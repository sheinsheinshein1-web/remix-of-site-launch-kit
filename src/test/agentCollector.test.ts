// @vitest-environment node
import { describe, expect, it } from "vitest";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { parseOfficialProduct, createOfficialCollector } from "../../server/agent-runtime/collector";
import { AgentRuntime } from "../../server/agent-runtime/runtime";
import { replayOfficeEvents } from "@/features/agent-office/events";
import { parseCompanyPages } from "../../server/agent-runtime/company";
import { allProjects } from "@/data/projects";
import { manufacturerRegistry, manufacturerSchema } from "@/data/manufacturers";
import { projectSourceFactsById } from "@/data/projectSourceFacts";
import type { ScoutCandidate } from "@/features/agent-office/runtime-contract";

const url = "https://ir365.ru/product/test/";
const candidate: ScoutCandidate = { name: "Фикстура", officialWebsite: "https://ir365.ru/", cityRegion: "Екатеринбург", products: ["Модульные дома"], modularHouses: "yes", modularBaths: "unclear", businessRole: "manufacturer", manufacturerStatus: "confirmed", sourceUrl: "https://ir365.ru/", evidence: "Только тестовая запись производителя", confidence: .97, inclusionReason: "Только тестовая фикстура", knownRegistryId: null };
const product = { id: 1, name: "Дом &amp; баня", permalink: url, categories: [{ id: 1, name: "Модульные дома", link: "https://ir365.ru/category/" }], description: '<h2>Комплектация</h2><table><tr><th>Параметр</th><th>Комфорт</th><th>Премиум</th></tr><tr><td>Цена</td><td>от 100 ₽</td><td>200 ₽</td></tr></table><p>Общая площадь с террасой 76,5 м².</p><p>Производство 30 дней.</p>', short_description: "", attributes: [{ name: "Площадь дома", terms: [{ name: "54 м²" }] }], images: [] };

describe("Raw collector", () => {
  it("keeps original strings, distinct areas, configuration columns and null missing values", () => {
    const p = parseOfficialProduct(product, '<div class="wp-block-woocommerce-product-price">от 100 ₽</div>', 'https://ir365.ru/wp-json/products', 'sources/test.txt');
    expect(p.price.value).toBe("от 100 ₽"); expect(p.area.value).toBe("54 м²");
    expect(p.description.value).toContain("76,5 м²");
    expect(p.tables[0].rows[1]).toEqual(["Цена", "от 100 ₽", "200 ₽"]);
    expect(p.floors.value).toBeNull(); expect(p.bedrooms.value).toBeNull(); expect(p.photos).toBeNull();
    expect(p.manufacturingTime.value).toBe("Производство 30 дней.");
    expect(p.name.value).toBe("Дом & баня"); expect(p.area.sourceUrl).toBe('https://ir365.ru/wp-json/products');
  });
  it("retains a separate bedroom without inferring its count, and does not mistake fixed-price wording for a bathroom", () => {
    const p = parseOfficialProduct({...product,short_description:'Отдельная спальня. Договор с фиксированной ценой.'},'', 'https://ir365.ru/wp-json/products','sources/test.txt');
    expect(p.bedrooms.value).toContain('Отдельная спальня');
    expect(p.bathrooms.value).toBeNull();
  });
  it("refuses an unsupported or nonofficial site before any network access", async () => {
    await expect(createOfficialCollector().collect({ manufacturer: {...candidate,officialWebsite:"https://other.example/"}, directory:"/nonexistent", signal:new AbortController().signal,onSource:async()=>{},onProject:async()=>{} })).rejects.toThrow("адаптер");
  });
  it("continues a saved Scout run, selects the highest confidence, persists Collector events and leaves later agents idle", async () => {
    const directory = await mkdtemp(join(tmpdir(),'mnogomesta-collector-test-'));
    const runtime = new AgentRuntime(directory, { available:async()=>({available:true,message:'test'}), search:async()=>({candidates:[{...candidate,name:'Ниже',confidence:.5},candidate,{...candidate,name:'Равный'}],limitations:[]}) }, async()=>[], { collect:async ({manufacturer,onSource,onProject}) => {
      expect(manufacturer.name).toBe('Фикстура'); await onSource(url);
      const p=parseOfficialProduct(product,'','https://ir365.ru/wp-json/products','sources/test.txt');await onProject(p);
      return {projects:[p],discoveredCount:1,parsedCount:1,sources:[url],failures:[],limitations:[],coverage:{catalogUrls:[],productUrls:[url],sitemapUrls:[],complete:true}};
    }},async()=>({manufacturers:Object.values(manufacturerRegistry),projects:allProjects,referenceFacts:projectSourceFactsById,validateManufacturer:record=>manufacturerSchema.safeParse(record).success}),{collect:async({manufacturer})=>parseCompanyPages(["/","/o-nas/","/kontakty/","/privacy-policy/"].map(path=>({url:"https://ir365.ru"+path,html:"<p>Тестовая компания</p>",snapshot:"fixture.html"})),manufacturer)});
    try {
      await runtime.init();
      // Seed through the same Scout execution path; different domains avoid Scout deduplication.
      const scout=await runtime.create({city:'Екатеринбург',requestId:randomUUID()}); await runtime.waitForIdle();
      if (scout.result && 'candidates' in scout.result) scout.result.candidates=[{...candidate,name:'Ниже',confidence:.5},candidate,{...candidate,name:'Равный'}];
      const input={sourceRunId:scout.id,requestId:randomUUID()}; const run=await runtime.createCollection(input); await runtime.waitForIdle();
      expect(run.status).toBe('completed'); expect(await runtime.createCollection(input)).toBe(run);
      expect(run.tasks[1].agentId).toBe('collector'); expect(run.tasks[1].parentTaskId).toBe(run.tasks[0].id);
      const state=replayOfficeEvents(runtime.snapshot().events,runtime.snapshot().events.length);
      expect(state.statuses.collector).toBe('completed'); expect(state.statuses.publisher).toBe('idle'); expect(state.statuses.extractor).toBe('idle');
      expect(run.events.filter(e=>e.type==='project.collected')).toHaveLength(1);
      const saved=JSON.parse(await readFile(join(directory,'runs',run.id,'result.json'),'utf8'));
      expect(saved.kind).toBe('collector.raw-catalog'); expect(saved.sourceRunId).toBe(scout.id); expect(saved.parsedCount).toBe(1);
    } finally { await runtime.close(); await rm(directory,{recursive:true,force:true}); }
  });
});
