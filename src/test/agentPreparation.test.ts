// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { mkdtemp, mkdir, readFile, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createHash, randomUUID } from "node:crypto";
import { prepareCatalog, unambiguousArea, type PreparationContext } from "../../server/agent-runtime/preparation";
import { parseCompanyPages } from "../../server/agent-runtime/company";
import { buildManufacturerPackage, hashProjects } from "../../server/agent-runtime/manufacturer-package";
import { AgentRuntime } from "../../server/agent-runtime/runtime";
import { parseOfficialProduct } from "../../server/agent-runtime/collector";
import { collectorResultSchema } from "@/features/agent-office/collector-contract";
import { preparationResultSchema } from "@/features/agent-office/preparation-contract";
import { replayOfficeEvents } from "@/features/agent-office/events";
import { manufacturerRegistry, manufacturerSchema } from "@/data/manufacturers";
import { allProjects } from "@/data/projects";
import { projectSourceFactsById } from "@/data/projectSourceFacts";

const context: PreparationContext = { manufacturers:Object.values(manufacturerRegistry),projects:allProjects,referenceFacts:projectSourceFactsById,validateManufacturer:record=>manufacturerSchema.safeParse(record).success };
function fixture() {
  const url='https://ir365.ru/product/fixture/';
  const project=parseOfficialProduct({id:1,name:'Модульная баня, тест',permalink:url,categories:[{name:'Модульные бани'}],attributes:[{name:'Площадь',terms:[{name:'27-28 м2'}]}],description:'<p>2 отдельных спальни, санузел.</p>',short_description:'Сохранённое описание, без редактирования.',images:[]},'',url,'sources/fixture.txt');
  project.type={value:'баня',sourceUrl:url};project.bedrooms={value:'2 отдельных спальни',sourceUrl:url};
  project.bathrooms={value:'санузел',sourceUrl:url};project.technology={value:null,sourceUrl:url};
  project.configuration={value:'Комфорт; Премиум',sourceUrl:url};project.variations={value:[{price:'100'},{price:'200'}],sourceUrl:url};
  project.price={value:'от 1 200 000,00 ₽',sourceUrl:url};
  const raw=collectorResultSchema.parse({version:1,kind:'collector.raw-catalog',runId:randomUUID(),taskId:randomUUID(),sourceRunId:randomUUID(),city:'Екатеринбург',manufacturer:{name:'ГК «ИР365»',officialWebsite:'https://ir365.ru/',cityRegion:'Екатеринбург',products:['Модульные бани'],modularHouses:'yes',modularBaths:'yes',businessRole:'manufacturer',manufacturerStatus:'confirmed',sourceUrl:url,evidence:'Тестовый сохранённый источник',confidence:.97,inclusionReason:'Тестовый сохранённый кандидат',knownRegistryId:null},selectionReason:'Тест',provider:'official-woocommerce-http',startedAt:'2026-09-12T10:00:00.000Z',completedAt:'2026-09-12T10:01:00.000Z',discoveredCount:1,parsedCount:1,projects:[project],sources:[url],coverage:{catalogUrls:[],productUrls:[url],sitemapUrls:[],complete:true},failures:[],limitations:[]});
  const company=parseCompanyPages(['/', '/o-nas/','/kontakty/','/privacy-policy/'].map(path=>({url:'https://ir365.ru'+path,html:'<p>Тестовый официальный источник</p>',snapshot:'fixture.html'})),raw.manufacturer);
  raw.manufacturerPackage=buildManufacturerPackage(raw,company,context,{catalogRunId:raw.runId,catalogSha256:'0'.repeat(64),projectsSha256:hashProjects(raw),projectsReused:true});
  return raw;
}

describe('Подготовка карточек из сохранённого сырья',()=>{
  it('uses existing models and reference records without guessing unknown numbers or losing price qualifiers',()=>{
    const raw=fixture(),before=JSON.stringify(raw);
    const output=prepareCatalog(raw,context),p=output.projects[0];
    expect(manufacturerSchema.safeParse(output.manufacturer.record).success).toBe(true);
    expect(p.record.manufacturerId).toBe('ir365'); expect(p.record.productType).toBe('bath');
    expect(p.record.beds).toBe(2);expect(p.record.baths).toBeNull();expect(p.record.floors).toBeNull();
    expect(p.record.area).toBe('27-28 м2');expect(p.record.area_m2).toBeNull();
    expect(p.record.technology).toBeNull();expect(p.record.completion).toBeNull();
    expect(p.record.price).toBe('от 1 200 000,00 ₽');
    expect(p.record.descriptionLong).toBe(raw.projects[0].description.value);
    expect(p.fieldSources.beds.sourceUrl).toBe(raw.projects[0].bedrooms.sourceUrl);
    expect(p.sourceFacts.floors.value).toBeNull();expect(p.ready).toBe(false);
    expect(p.missingFields).toContain('floors');expect(output.references.manufacturerIds).toEqual(['platforma','bygge']);
    expect(output.referenceSnapshot.projects.some(p=>p.manufacturerId==='platforma')).toBe(true);
    expect(output.referenceSnapshot.projects.some(p=>p.manufacturerId==='bygge')).toBe(true);
    expect(JSON.stringify(raw)).toBe(before);
  });
  it('rejects legacy projects-only input without the company package',()=>{const raw=fixture();delete raw.manufacturerPackage;expect(()=>prepareCatalog(raw,context)).toThrow('полный пакет производителя');});
  it('preserves nulls despite suggestive product names and refuses ambiguous numeric areas',()=>{
    const raw=fixture();raw.projects[0].bedrooms.value=null;raw.projects[0].name.value='Каркасно-модульная баня 2 спальни';
    const p=prepareCatalog(raw,context).projects[0].record;
    expect(p.beds).toBeNull();expect(p.technology).toBeNull();
    expect(unambiguousArea('12,5 м2')).toBe(12.5);expect(unambiguousArea('27-28 м2')).toBeNull();expect(unambiguousArea(null)).toBeNull();
  });
  it('runs offline, persists real editor events and report, supports restart and leaves other workers idle',async()=>{
    const directory=await mkdtemp(join(tmpdir(),'mnogomesta-preparation-'));
    const raw=fixture(),sourceText=JSON.stringify(raw,null,2),timestamp=raw.completedAt;
    await mkdir(join(directory,'runs'),{recursive:true});
    await writeFile(join(directory,'runs',`${raw.runId}.json`),JSON.stringify({version:1,id:raw.runId,requestId:randomUUID(),city:raw.city,status:'completed',createdAt:timestamp,completedAt:timestamp,error:null,tasks:[],events:[],result:raw}));
    const network=vi.fn(()=>{throw new Error('Запрещён новый поиск');});vi.stubGlobal('fetch',network);
    const makeRuntime=()=>new AgentRuntime(directory,{available:async()=>({available:false,message:'offline'}),search:network},async()=>[],{collect:network},async()=>context);
    let runtime=makeRuntime();
    try {
      await runtime.init();
      const sourcePath=join(directory,'runs',raw.runId,'result.json');expect(await readFile(sourcePath,'utf8')).toBe(sourceText);
      const input={sourceRunId:raw.runId,requestId:randomUUID()};
      const run=await runtime.createPreparation(input);await runtime.waitForIdle();
      expect(run.error).toBeNull();expect(run.status).toBe('completed');expect(await runtime.createPreparation(input)).toBe(run);
      const result=preparationResultSchema.parse(JSON.parse(await readFile(join(directory,'runs',run.id,'result.json'),'utf8')));
      expect(result.sourceSha256).toBe(createHash('sha256').update(sourceText).digest('hex'));
      expect(await readFile(sourcePath,'utf8')).toBe(sourceText);
      expect(JSON.parse(await readFile(join(directory,'runs',run.id,'validation-report.json'),'utf8')).readyCount).toBe(0);
      expect(run.events.filter(e=>e.type==='project.prepared')).toHaveLength(1);
      const state=replayOfficeEvents(runtime.snapshot().events,runtime.snapshot().events.length);
      expect(state.statuses.editor).toBe('needs-review');expect(state.statuses.publisher).toBe('idle');expect(state.statuses.extractor).toBe('idle');
      await runtime.close();runtime=makeRuntime();await runtime.init();
      expect(runtime.getRun(run.id)?.status).toBe('completed');expect(network).not.toHaveBeenCalled();
    } finally { await runtime.close();vi.unstubAllGlobals();await rm(directory,{recursive:true,force:true}); }
  });
});
