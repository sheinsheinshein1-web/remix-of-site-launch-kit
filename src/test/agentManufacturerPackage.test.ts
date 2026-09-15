// @vitest-environment node
import {describe,it,expect,vi} from 'vitest';
import {mkdtemp,mkdir,writeFile,readFile,rm} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {randomUUID} from 'node:crypto';
import {parseCompanyPages,createCompanyCollector} from '../../server/agent-runtime/company';
import {parseOfficialProduct} from '../../server/agent-runtime/collector';
import {buildManufacturerPackage,hashProjects} from '../../server/agent-runtime/manufacturer-package';
import {AgentRuntime} from '../../server/agent-runtime/runtime';
import {collectorResultSchema} from '@/features/agent-office/collector-contract';
import {companyDataSchema} from '@/features/agent-office/manufacturer-package-contract';
import {allProjects} from '@/data/projects';
import {manufacturerRegistry,manufacturerSchema} from '@/data/manufacturers';
import {projectSourceFactsById} from '@/data/projectSourceFacts';
const company={name:'ГК «ИР365»',officialWebsite:'https://ir365.ru/',cityRegion:'Екатеринбург',products:['Модульные дома'],modularHouses:'yes' as const,modularBaths:'yes' as const,businessRole:'manufacturer' as const,manufacturerStatus:'confirmed' as const,sourceUrl:'https://ir365.ru/',evidence:'Тестовое официальное подтверждение производства',confidence:.97,inclusionReason:'Тестовый выбранный кандидат',knownRegistryId:null};
const html:Record<string,string>={
 '/':'<p>ГК «ИР365» производит СИП-панели и выпускает каркасно-модульные дома. Собственное производство в Екатеринбурге.</p><h2>О компании</h2><p>Точное описание компании.</p><p>География: Свердловская область.</p><img class="custom-logo" src="/logo.png"><a href="/product/do-not-fetch/">Проект</a>',
 '/kontakty/':'<p>+7 (343) 929-11-43</p><p>+7 (901) 852-69-52</p><p>zakaz@ir365.ru</p>',
 '/o-nas/':'<h3>Адрес производства:</h3><p>Свердловская область, г. Березовский</p><h3>Режим работы:</h3><p>Пн-Пт 9-18</p><a href="https://t.me/example">Telegram</a>',
 '/privacy-policy/':'<p>Оператор данных. Адрес места жительства: Екатеринбург.</p><p>Данные передаются производственной компании для заключения договора.</p>',
};
const pages=()=>Object.entries(html).map(([path,body])=>({url:'https://ir365.ru'+path,html:body,snapshot:'fixture.html'}));
const context={manufacturers:Object.values(manufacturerRegistry),projects:allProjects,referenceFacts:projectSourceFactsById,validateManufacturer:(record:unknown)=>manufacturerSchema.safeParse(record).success};
function rawFixture(){const time=new Date().toISOString();const projects=Array.from({length:10},(_,i)=>parseOfficialProduct({id:100+i,name:`Дом ${i}`,permalink:`https://ir365.ru/product/test-${i}/`,categories:[{id:1,name:'Модульные дома',link:'https://ir365.ru/product-category/houses/'}],attributes:[],images:[],description:'<p>Сохранённое описание.</p>',short_description:'Исходный текст.'},'',company.sourceUrl,'fixture.html'));return collectorResultSchema.parse({version:1,kind:'collector.raw-catalog',runId:randomUUID(),taskId:randomUUID(),sourceRunId:randomUUID(),city:'Екатеринбург',manufacturer:company,selectionReason:'Существующий кандидат',provider:'official-woocommerce-http',startedAt:time,completedAt:time,discoveredCount:10,parsedCount:10,projects,sources:[company.sourceUrl],coverage:{catalogUrls:['https://ir365.ru/product-category/houses/'],productUrls:projects.map(p=>p.officialPage),sitemapUrls:[],complete:true},failures:[],limitations:[]});}
describe('Полный пакет производителя',()=>{
 it('collects real contact text and keeps manufacturer identity and incomplete address unresolved',()=>{
  const data=parseCompanyPages(pages(),company);
  expect(data.fields.phone.value).toBe('+7 (343) 929-11-43');expect(data.fields.additionalPhones.value).toBe('+7 (901) 852-69-52');expect(data.fields.email.value).toBe('zakaz@ir365.ru');
  expect(data.fields.productionAddress.value).toBeNull();expect(data.fields.productionAddress.status).toBe('conflict');
  expect(data.fields['profile.legal.legalName'].value).toBeNull();expect(data.fields.brandManufacturerIdentity.status).toBe('conflict');
  expect(data.fields.telegram.value).toBe('https://t.me/example');expect(data.fields['profile.social.telegramChannel'].value).toBeNull();
  delete data.fields.phone;expect(companyDataSchema.safeParse(data).success).toBe(false);
 });
 it('checks company and project duplicates against the registry without removing evidence',()=>{
  const raw=rawFixture();raw.projects[1]={...raw.projects[0]};const data=parseCompanyPages(pages(),company);
  const packet=buildManufacturerPackage(raw,data,{...context,manufacturers:[...context.manufacturers,{id:'existing',name:'IR365',siteUrl:company.officialWebsite,initials:'IR'}]},{catalogRunId:raw.runId,catalogSha256:'0'.repeat(64),projectsSha256:hashProjects(raw),projectsReused:true});
  expect(packet.duplicates.matches.some(m=>m.field==='company')).toBe(true);expect(packet.duplicates.matches.some(m=>m.field.startsWith('projects.'))).toBe(true);expect(packet.readiness.ready).toBe(false);expect(raw.projects).toHaveLength(10);
 });
 it('supplements only company pages, preserves all ten projects and prepares the entire package',async()=>{
  const directory=await mkdtemp(join(tmpdir(),'manufacturer-package-')),raw=rawFixture(),before=JSON.stringify(raw.projects);
  await mkdir(join(directory,'runs'),{recursive:true});await writeFile(join(directory,'runs',raw.runId+'.json'),JSON.stringify({version:1,id:raw.runId,requestId:randomUUID(),city:raw.city,status:'completed',createdAt:raw.completedAt,completedAt:raw.completedAt,error:null,tasks:[],events:[],result:raw}));
  const network=vi.fn(async(value:string|URL)=>{const path=new URL(value).pathname;if(!(path in html))throw new Error('Запрещён повторный сбор '+path);return new Response(html[path],{status:200});});vi.stubGlobal('fetch',network);
  const noProjects=vi.fn(()=>{throw new Error('Проекты нельзя собирать повторно');});
  const runtime=new AgentRuntime(directory,{available:async()=>({available:false,message:'test'}),search:noProjects},async()=>[],{collect:noProjects},async()=>context,createCompanyCollector());
  try{await runtime.init();await expect(runtime.createPreparation({sourceRunId:raw.runId,requestId:randomUUID()})).rejects.toThrow('полный пакет производителя');
    const run=await runtime.completeCompany({sourceRunId:raw.runId,requestId:randomUUID()});await runtime.waitForIdle();expect(run.error).toBeNull();expect(network).toHaveBeenCalledTimes(4);expect(noProjects).not.toHaveBeenCalled();
    const saved=JSON.parse(await readFile(join(directory,'runs',run.id,'result.json'),'utf8'));expect(JSON.stringify(saved.projects)).toBe(before);expect(saved.manufacturerPackage.lineage.projectsSha256).toBe(hashProjects(raw));
    const ready=await runtime.createPreparation({sourceRunId:run.id,requestId:randomUUID()});await runtime.waitForIdle();expect(ready.error).toBeNull();
    const result=JSON.parse(await readFile(join(directory,'runs',ready.id,'result.json'),'utf8'));expect(result.manufacturer.record.phone).toBe('+7 (343) 929-11-43');expect(result.rawProjects).toHaveLength(10);expect(result.manufacturerPackage.readiness.status).toBe('needs-review');expect(network).toHaveBeenCalledTimes(4);
    expect(result.projects.every((p:{record:{floors:unknown}})=>p.record.floors===null)).toBe(true);
  }finally{await runtime.close();vi.unstubAllGlobals();await rm(directory,{recursive:true,force:true});}
 });
});
