import { createHash, randomUUID } from "node:crypto";
import { mkdir, open, readFile, readdir, rename, unlink, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { z } from "zod";
import { officeEventSchema, type OfficeEvent } from "../../src/features/agent-office/events";
import { cityTaskInputSchema, resultSchema, runtimeTaskSchema, publicUrlSchema, type RuntimeTask, type ScoutResult } from "../../src/features/agent-office/runtime-contract";
import { classifyCandidates, scoutPrompt, type RegistryEntry } from "./scout";
import type { SearchProvider } from "./codex-search";
import { collectorResultSchema, completeCollectorResultSchema, collectionInputSchema, type CollectorResult } from "../../src/features/agent-office/collector-contract";
import { createOfficialCollector, type CollectorProvider } from "./collector";
import { prepareCatalog, type PreparationContext } from "./preparation";
import { preparationResultSchema, type PreparationResult } from "../../src/features/agent-office/preparation-contract";

import { createCompanyCollector, parseCompanyPages, type CompanyProvider } from "./company";
import { buildManufacturerPackage, hashProjects } from "./manufacturer-package";

const runSchema = z.object({
  version: z.literal(1), id: z.string().uuid(), requestId: z.string().uuid(), city: z.string(),
  status: z.enum(["running", "completed", "failed"]), createdAt: z.string().datetime(), completedAt: z.string().datetime().nullable(), error: z.string().nullable(),
  tasks: z.array(runtimeTaskSchema), events: z.array(officeEventSchema), result: resultSchema.or(collectorResultSchema).or(preparationResultSchema).nullable(),
});
export interface RuntimeRun {
  version: 1; id: string; requestId: string; city: string; status: "running" | "completed" | "failed";
  createdAt: string; completedAt: string | null; error: string | null; tasks: RuntimeTask[]; events: OfficeEvent[]; result: ScoutResult | CollectorResult | PreparationResult | null;
}
type EventPayload = OfficeEvent extends infer E ? E extends OfficeEvent ? Omit<E, "version" | "id" | "runId" | "sequence" | "occurredAt"> : never : never;
export class RuntimeBusyError extends Error {}
const now = () => new Date().toISOString();

export class AgentRuntime {
  private runs = new Map<string, RuntimeRun>();
  private activeRunId: string | null = null;
  private running: Promise<void> | null = null;
  private abort: AbortController | null = null;
  private providerState = { available: false, message: "Поиск не проверен" };
  private ownsLock = false;
  constructor(readonly directory: string, private provider: SearchProvider, private registry: () => Promise<RegistryEntry[]>, private collector: CollectorProvider = createOfficialCollector(), private preparationContext?: () => Promise<PreparationContext>, private companyCollector: CompanyProvider = createCompanyCollector()) {}

  private async acquireLock(path:string) {
    // Vite closes the old runtime asynchronously during configuration reload.
    // Wait for that owner to release its lock; never unlink a live owner's lock.
    for(let attempt=0;;attempt++) {
      try{return await open(path,"wx",0o600);}catch(error){
        if((error as NodeJS.ErrnoException).code!=="EEXIST"||attempt>=20)throw error;
        const owner=await readFile(path,"utf8").catch(()=>"");
        if(!owner)continue;
        if(Number(owner)!==process.pid)throw error;
        await new Promise(resolve=>setTimeout(resolve,50));
      }
    }
  }

  async init() {
    for (const folder of ["tasks", "runs", "events"]) await mkdir(join(this.directory, folder), { recursive: true, mode: 0o700 });
    const lockPath = join(this.directory, ".writer.lock");
    try {
      const lock = await this.acquireLock(lockPath); await lock.writeFile(String(process.pid)); await lock.close(); this.ownsLock = true;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
      const pid = Number(await readFile(lockPath, "utf8"));
      let alive = true;
      try { process.kill(pid, 0); } catch (err) { if ((err as NodeJS.ErrnoException).code === "ESRCH") alive = false; }
      if (alive) throw new Error("Runtime уже открыт другим процессом");
      await unlink(lockPath);
      const lock = await this.acquireLock(lockPath); await lock.writeFile(String(process.pid)); await lock.close(); this.ownsLock = true;
    }
    try {
      for (const name of (await readdir(join(this.directory, "runs"))).filter(name => /^[\da-f-]{36}\.json$/.test(name)).sort()) {
        const stored = JSON.parse(await readFile(join(this.directory, "runs", name), "utf8"));
        runSchema.parse(stored); // Validate without reordering archived evidence.
        const run = stored as RuntimeRun;
        this.runs.set(run.id, run);
        if (run.status === "running") await this.fail(run, "Предыдущий процесс runtime был прерван. Автоматический повтор поиска не выполнялся");
        else await this.persist(run); // Rebuild derivative files after an interrupted write.
      }
      this.providerState = await this.provider.available();
    } catch (error) { await unlink(lockPath); this.ownsLock = false; throw error; }
  }

  private async atomic(path: string, value: string) {
    const temporary = `${path}.${randomUUID()}.tmp`;
    await writeFile(temporary, value, { mode: 0o600 });
    await rename(temporary, path);
  }
  private async persist(run: RuntimeRun) {
    runSchema.parse(run);
    // runs/<id>.json is authoritative. Other files are recoverable projections.
    await this.atomic(join(this.directory, "runs", `${run.id}.json`), JSON.stringify(run, null, 2));
    for (const task of run.tasks) await this.atomic(join(this.directory, "tasks", `${task.id}.json`), JSON.stringify(task, null, 2));
    await this.atomic(join(this.directory, "events", `${run.id}.jsonl`), run.events.map(event => JSON.stringify(event)).join("\n") + "\n");
    if (run.result) {
      await mkdir(join(this.directory, "runs", run.id), { recursive: true });
      await this.atomic(join(this.directory, "runs", run.id, "result.json"), JSON.stringify(run.result, null, 2));
    }
  }
  private async emit(run: RuntimeRun, payload: EventPayload) {
    const event = officeEventSchema.parse({ version: 1, id: randomUUID(), runId: run.id, sequence: run.events.length, occurredAt: now(), ...payload }) as OfficeEvent;
    run.events.push(event);
    await this.persist(run);
  }
  snapshot() {
    const runs = [...this.runs.values()].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    return {
      health: { connected: true, provider: "codex-cli-web-search" as const, searchAvailable: this.providerState.available, message: this.providerState.message, activeRunId: this.activeRunId, activeAgent: this.activeRunId ? this.runs.get(this.activeRunId)?.tasks.at(-1)?.agentId ?? null : null },
      events: runs.flatMap(run => run.events),
      tasks: runs.flatMap(run => run.tasks),
    };
  }
  getRun(id: string) { return this.runs.get(id); }
  async create(input: unknown): Promise<RuntimeRun> {
    const parsed = cityTaskInputSchema.parse(input);
    const existing = [...this.runs.values()].find(run => run.requestId === parsed.requestId);
    if (existing) return existing;
    if (this.activeRunId) throw new RuntimeBusyError("Сначала дождитесь завершения текущего запуска");
    const id = randomUUID(); this.activeRunId = id;
    const root: RuntimeTask = { id: randomUUID(), runId: id, parentTaskId: null, city: parsed.city, agentId: "astra", title: `Обработать город ${parsed.city}`, status: "idle", input: { city: parsed.city }, resultPath: null, sources: [], error: null, createdAt: now(), startedAt: null, completedAt: null };
    const run: RuntimeRun = { version: 1, id, requestId: parsed.requestId, city: parsed.city, status: "running", createdAt: now(), completedAt: null, error: null, tasks: [root], events: [], result: null };
    this.runs.set(id, run);
    try { await this.emit(run, { type: "task.created", taskId: root.id, agentId: "astra", task: { ...root }, message: `Создано задание: ${root.title}` }); }
    catch (error) { this.activeRunId = null; this.runs.delete(id); throw error; }
    this.abort = new AbortController();
    const controller = this.abort;
    this.running = this.execute(run, controller.signal).catch(error => this.fail(run, error instanceof Error ? error.message : String(error))).finally(() => { this.activeRunId = null; this.abort = null; });
    // Request returns after durable task creation; execution continues locally.
    void this.running.catch(error => console.error("Agent runtime persistence error", error));
    return run;
  }

  async createCollection(input: unknown): Promise<RuntimeRun> {
    const parsed = collectionInputSchema.parse(input);
    const existing = [...this.runs.values()].find(r => r.requestId === parsed.requestId);
    if (existing) return existing;
    if (this.activeRunId) throw new RuntimeBusyError("Сначала дождитесь завершения текущего запуска");
    const source = this.runs.get(parsed.sourceRunId);
    if (source?.status !== "completed" || !source.result || !("candidates" in source.result)) throw new Error("Нужен завершённый результат Scout");
    if (!this.preparationContext) throw new Error("Сбор данных требует существующий реестр и модели для полного пакета производителя");
    const manufacturer = [...source.result.candidates].sort((a,b) => b.confidence-a.confidence)[0];
    if (!manufacturer) throw new Error("В результате Scout нет кандидатов");
    const id = randomUUID(); this.activeRunId = id;
    const root: RuntimeTask = { id: randomUUID(), runId: id, parentTaskId: null, city: source.city, agentId: "astra", title: `Собрать официальный каталог: ${manufacturer.name}`, status: "idle", input: { city: source.city, sourceRunId: source.id, officialWebsite: manufacturer.officialWebsite }, resultPath: null, sources: [], error: null, createdAt: now(), startedAt: null, completedAt: null };
    const run: RuntimeRun = { version: 1, id, requestId: parsed.requestId, city: source.city, status: "running", createdAt: now(), completedAt: null, error: null, tasks: [root], events: [], result: null };
    this.runs.set(id, run);
    try { await this.emit(run, { type: "task.created", taskId: root.id, agentId: "astra", task: { ...root }, message: root.title }); }
    catch(error) { this.activeRunId = null; this.runs.delete(id); throw error; }
    this.abort = new AbortController();
    this.running = this.executeCollection(run, source.id, manufacturer, this.abort.signal).catch(error => this.fail(run, error instanceof Error ? error.message : String(error))).finally(() => { this.activeRunId = null; this.abort = null; });
    void this.running.catch(error => console.error("Collector persistence error", error));
    return run;
  }

  private async executeCollection(run: RuntimeRun, sourceRunId: string, manufacturer: ScoutResult["candidates"][number], signal: AbortSignal) {
    const root = run.tasks[0]; root.status = "working"; root.startedAt = now();
    await this.emit(run, { type: "agent.started", taskId: root.id, agentId: "astra", message: `Astra выбрала ${manufacturer.name}: максимальная уверенность Scout ${manufacturer.confidence}; при равенстве — первый в исходном списке` });
    const task: RuntimeTask = { ...root, id: randomUUID(), parentTaskId: root.id, agentId: "collector", title: `Сборщик данных: весь официальный каталог ${manufacturer.name}`, sources: [], status: "waiting", createdAt: now(), startedAt: null };
    run.tasks.push(task);
    await this.emit(run, { type: "task.created", taskId: task.id, agentId: "collector", task: { ...task }, message: task.title });
    await this.emit(run, { type: "agent.assigned", taskId: task.id, agentId: "collector", message: "Сборщику данных назначен один официальный сайт" });
    await this.emit(run, { type: "task.handoff", taskId: task.id, from: "astra", to: "collector", message: "Astra передала кандидата Сборщику данных" });
    task.status = "working"; task.startedAt = now();
    const directory = join(this.directory, "runs", run.id); await mkdir(directory, { recursive: true });
    await this.atomic(join(directory, "collector-input.json"), JSON.stringify({ sourceRunId, manufacturer, instruction: "Только официальный сайт. Весь каталог домов и бань, исходные строки с URL. Пропуски null. Не преобразовывать в каталог Многоместа и не публиковать." }, null, 2));
    await this.emit(run, { type: "agent.started", taskId: task.id, agentId: "collector", message: "Сборщик данных читает официальный API и HTML, без генерации текстов" });
    const output = await this.collector.collect({ manufacturer, directory, signal: AbortSignal.any([signal, AbortSignal.timeout(12*60*1000)]),
      onSource: async url => { task.sources.push(url); await this.emit(run, { type: "source.found", taskId: task.id, agentId: "collector", sourceUrl: url, message: `Сборщик сохранил официальный источник: ${url}` }); },
      onProject: async project => {
        await this.atomic(join(directory, `project-${project.sourceProductId}.json`), JSON.stringify(project, null, 2));
        await this.emit(run, { type: "project.collected", taskId: task.id, agentId: "collector", projectName: project.name.value ?? project.officialPage, sourceUrl: project.officialPage, message: `Разобран проект: ${project.name.value ?? project.officialPage}` });
      },
    });
    run.result = collectorResultSchema.parse({ version: 1, kind: "collector.raw-catalog", runId: run.id, taskId: task.id, sourceRunId, city: run.city, manufacturer, selectionReason: "Максимальная confidence Scout; при равенстве первый в сохранённом списке", provider: "official-woocommerce-http", startedAt: task.startedAt, completedAt: now(), ...output });
    const company = await this.companyCollector.collect({manufacturer,directory,signal,onSource:async url=>{task.sources.push(url);await this.emit(run,{type:"source.found",taskId:task.id,agentId:"collector",sourceUrl:url,message:"Сбор данных компании: "+url});}});
    const context = await this.preparationContext!();
    const raw = run.result as CollectorResult;
    raw.manufacturerPackage=buildManufacturerPackage(raw,company,context,{catalogRunId:run.id,catalogSha256:createHash("sha256").update(JSON.stringify(raw.projects)).digest("hex"),projectsSha256:hashProjects(raw),projectsReused:false});
    task.resultPath = `runtime/runs/${run.id}/result.json`;
    await this.emit(run, { type: "file.recorded", taskId: task.id, file: { id: `${run.id}-result`, name: `Сборщик данных · ${manufacturer.name} · ${output.parsedCount} проектов`, path: task.resultPath, agentId: "collector", taskId: task.id, url: `/__agent-runtime/runs/${run.id}/result` }, message: `Сохранён сырой JSON: найдено ${output.discoveredCount}, разобрано ${output.parsedCount}` });
    if (!output.coverage.complete) throw new Error(`Сбор завершён с пропусками: ${output.failures.length}. Частичный JSON сохранён`);
    task.status = "completed"; task.completedAt = now();
    await this.emit(run, { type: "agent.completed", taskId: task.id, agentId: "collector", message: "Сборщик данных завершил чтение официального каталога" });
    await this.emit(run, { type: "task.completed", taskId: task.id, agentId: "collector", task: { ...task }, message: "Сырой каталог сохранён; следующие агенты не запускаются" });
    root.status = "completed"; root.completedAt = now(); root.resultPath = task.resultPath; root.sources = [...task.sources];
    await this.emit(run, { type: "agent.completed", taskId: root.id, agentId: "astra", message: "Astra приняла сырой результат Сборщика данных" });
    run.status = "completed"; run.completedAt = now();
    await this.emit(run, { type: "task.completed", taskId: root.id, agentId: "astra", task: { ...root }, message: "Сбор одного производителя завершён. Публикация не выполнялась" });
  }

  async completeCompany(input:unknown):Promise<RuntimeRun> {
    const parsed=collectionInputSchema.parse(input);
    const existing=[...this.runs.values()].find(r=>r.requestId===parsed.requestId);if(existing)return existing;
    if(this.activeRunId)throw new RuntimeBusyError("Сначала дождитесь текущего запуска");
    const source=this.runs.get(parsed.sourceRunId);
    if(source?.status!=="completed"||!source.result||!("kind" in source.result)||source.result.kind!=="collector.raw-catalog")throw new Error("Нужен сохранённый каталог Сборщика данных, без нового Scout");
    if(!this.preparationContext)throw new Error("Не подключён существующий каталог для проверки дублей");
    const id=randomUUID();this.activeRunId=id;
    const root:RuntimeTask={id:randomUUID(),runId:id,parentTaskId:null,city:source.city,agentId:"astra",title:"Дополнить полный пакет производителя",status:"working",input:{city:source.city,sourceRunId:source.id},resultPath:null,sources:[],error:null,createdAt:now(),startedAt:now(),completedAt:null};
    const task:RuntimeTask={...root,id:randomUUID(),parentTaskId:root.id,agentId:"collector",title:"Дособрать сведения компании без повторного чтения проектов"};
    const run:RuntimeRun={version:1,id,requestId:parsed.requestId,city:source.city,status:"running",createdAt:now(),completedAt:null,error:null,tasks:[root,task],events:[],result:null};this.runs.set(id,run);
    try{await this.emit(run,{type:"task.created",taskId:root.id,agentId:"astra",task:{...root},message:root.title});}catch(e){this.activeRunId=null;this.runs.delete(id);throw e;}
    this.abort=new AbortController();const signal=this.abort.signal;
    this.running=(async()=>{
      await this.emit(run,{type:"agent.started",taskId:root.id,agentId:"astra",message:"Astra сохраняет существующий каталог и запрашивает только данные компании"});
      await this.emit(run,{type:"task.created",taskId:task.id,agentId:"collector",task:{...task},message:task.title});
      await this.emit(run,{type:"task.handoff",taskId:task.id,from:"astra",to:"collector",message:"Дополнение существующего пакета производителя"});
      await this.emit(run,{type:"agent.started",taskId:task.id,agentId:"collector",message:"Сборщик читает только страницы компании; проекты переиспользуются"});
      const sourceText=await readFile(join(this.directory,"runs",source.id,"result.json"),"utf8"),raw=collectorResultSchema.parse(JSON.parse(sourceText));
      const directory=join(this.directory,"runs",id);await mkdir(directory,{recursive:true});
      const company=raw.manufacturerPackage?.company.coverage.complete
        ? parseCompanyPages(await Promise.all(raw.manufacturerPackage.company.pages.map(async page=>{const snapshot=page.snapshot.startsWith('/')?page.snapshot:join(this.directory,"runs",source.id,page.snapshot);return {url:page.url,snapshot,html:await readFile(snapshot,"utf8")};})),raw.manufacturer)
        : await this.companyCollector.collect({manufacturer:raw.manufacturer,directory,signal,onSource:async url=>{task.sources.push(url);await this.emit(run,{type:"source.found",taskId:task.id,agentId:"collector",sourceUrl:url,message:"Официальные сведения компании: "+url});}});
      if(raw.manufacturerPackage?.company.coverage.complete)await this.emit(run,{type:"source.found",taskId:task.id,agentId:"collector",sourceUrl:raw.manufacturer.officialWebsite,message:"Использованы сохранённые снимки страниц компании, без повторных HTTP-запросов"});
      const context=await this.preparationContext!();signal.throwIfAborted();
      const envelope=buildManufacturerPackage(raw,company,context,{catalogRunId:raw.manufacturerPackage?.lineage.catalogRunId??source.id,catalogSha256:raw.manufacturerPackage?.lineage.catalogSha256??createHash("sha256").update(sourceText).digest("hex"),projectsSha256:hashProjects(raw),projectsReused:true});
      run.result=collectorResultSchema.parse({...raw,runId:id,taskId:task.id,sourceRunId:source.id,manufacturerPackage:envelope,sources:[...new Set([...raw.sources,...company.coverage.checkedUrls])],limitations:[...raw.limitations,"Каталог сохранён без повторного сбора. Дособраны только официальные сведения компании."]});
      await this.atomic(join(directory,"package-report.json"),JSON.stringify({missingData:envelope.missingData,conflicts:envelope.conflicts,duplicates:envelope.duplicates,readiness:envelope.readiness},null,2));
      task.resultPath=`runtime/runs/${id}/result.json`;
      await this.emit(run,{type:"file.recorded",taskId:task.id,file:{id:`${id}-result`,name:"Полный пакет производителя · "+raw.manufacturer.name,path:task.resultPath,agentId:"collector",taskId:task.id,url:`/__agent-runtime/runs/${id}/result`},message:"Компания и сохранённый каталог объединены в пакет"});
      task.status=envelope.readiness.envelopeComplete?"completed":"needs-review";task.completedAt=now();
      await this.emit(run,{type:"agent.completed",taskId:task.id,agentId:"collector",message:"Дополнение компании завершено; пропуски и конфликты сохранены"});
      await this.emit(run,{type:"task.completed",taskId:task.id,agentId:"collector",task:{...task},message:"Сбор полного пакета завершён"});
      root.status="completed";root.completedAt=now();root.resultPath=task.resultPath;run.status="completed";run.completedAt=now();
      await this.emit(run,{type:"agent.completed",taskId:root.id,agentId:"astra",message:"Astra приняла пакет производителя"});
      await this.emit(run,{type:"task.completed",taskId:root.id,agentId:"astra",task:{...root},message:"Публичный каталог не изменялся"});
    })().catch(e=>this.fail(run,e instanceof Error?e.message:String(e))).finally(()=>{this.activeRunId=null;this.abort=null;});
    void this.running.catch(e=>console.error("Company package persistence error",e));return run;
  }

  async createPreparation(input: unknown): Promise<RuntimeRun> {
    const parsed = collectionInputSchema.parse(input);
    const existing = [...this.runs.values()].find(r=>r.requestId===parsed.requestId); if (existing) return existing;
    if (this.activeRunId) throw new RuntimeBusyError("Сначала дождитесь текущего запуска");
    const source = this.runs.get(parsed.sourceRunId);
    if (source?.status!=="completed" || !source.result || !("kind" in source.result) || source.result.kind!=="collector.raw-catalog") throw new Error("Нужен завершённый сырой результат Сборщика данных");
    completeCollectorResultSchema.parse(source.result);
    if (!this.preparationContext) throw new Error("Не подключены существующие модели и эталонные записи каталога");
    const id=randomUUID(); this.activeRunId=id;
    const task: RuntimeTask={id:randomUUID(),runId:id,parentTaskId:null,city:source.city,agentId:"editor",title:"Подготовка карточек ГК «ИР365» из сохранённого сырья",status:"working",input:{city:source.city,sourceRunId:source.id},resultPath:null,sources:[],error:null,createdAt:now(),startedAt:now(),completedAt:null};
    const root: RuntimeTask={...task,id:randomUUID(),agentId:"astra",title:"Подготовить пакет ИР365 в существующей модели каталога"};task.parentTaskId=root.id;
    const run:RuntimeRun={version:1,id,requestId:parsed.requestId,city:source.city,status:"running",createdAt:now(),completedAt:null,error:null,tasks:[root,task],events:[],result:null};
    this.runs.set(id,run);
    try { await this.emit(run,{type:"task.created",taskId:root.id,agentId:"astra",task:{...root},message:root.title}); }
    catch(error){this.activeRunId=null;this.runs.delete(id);throw error;}
    this.abort=new AbortController(); const signal=this.abort.signal;
    this.running=(async()=>{
      await this.emit(run,{type:"agent.started",taskId:root.id,agentId:"astra",message:"Astra запускает подготовку из существующего JSON без веб-поиска"});
      await this.emit(run,{type:"task.created",taskId:task.id,agentId:"editor",task:{...task},message:task.title});
      await this.emit(run,{type:"agent.assigned",taskId:task.id,agentId:"editor",message:"Назначен агент «Подготовка карточек»"});
      await this.emit(run,{type:"task.handoff",taskId:task.id,from:"astra",to:"editor",message:"Astra передала сохранённые данные агенту подготовки"});
      await this.emit(run,{type:"agent.started",taskId:task.id,agentId:"editor",message:"Подготовка карточек: чтение сырого пакета и эталонов Platforma/BYGGE"});
      const sourceFile=join(this.directory,"runs",source.id,"result.json"); const sourceText=await readFile(sourceFile,"utf8");
      const raw=completeCollectorResultSchema.parse(JSON.parse(sourceText));
      if(hashProjects(raw)!==raw.manufacturerPackage!.lineage.projectsSha256)throw new Error("Нарушена неизменность сохранённых проектов");
      const context=await this.preparationContext!(); signal.throwIfAborted();
      const prepared=prepareCatalog(raw,context);
      const directory=join(this.directory,"runs",id); await mkdir(directory,{recursive:true});
      await this.atomic(join(directory,"reference-records.json"),JSON.stringify(prepared.referenceSnapshot,null,2));
      const {referenceSnapshot: _snapshot,...data}=prepared;
      const result:PreparationResult={version:1,kind:"catalog.preparation",runId:id,taskId:task.id,sourceRunId:source.id,sourceFile,sourceSha256:createHash("sha256").update(sourceText).digest("hex"),createdAt:now(),agentId:"editor",status:"needs-review",...data};
      preparationResultSchema.parse(result);run.result=result;
      await this.atomic(join(directory,"validation-report.json"),JSON.stringify(result.report,null,2));
      await this.atomic(join(directory,"validation-report.md"),[
        `Подготовлено: ${result.report.preparedCount}. Полностью готово: ${result.report.readyCount}.`,
        "Готовые данные",...result.report.fullyReadyData.map(s=>`- ${s}`),
        "Отсутствуют",...result.report.missingFields.map(s=>`- ${s}`),
        "Требуют решения",...result.report.ambiguousMappings.map(s=>`- ${s}`),
        "Отличия от эталонов",...result.report.referenceDifferences.map(s=>`- ${s}`),
      ].join("\n\n"));
      for (const p of result.projects) await this.emit(run,{type:"project.prepared",taskId:task.id,agentId:"editor",projectName:p.record.name??String(p.record.id),sourceUrl:p.record.sourceUrl!,message:`Подготовлен черновик: ${p.record.name}; неизвестных полей: ${p.missingFields.length}`});
      task.resultPath=`runtime/runs/${id}/result.json`;
      await this.emit(run,{type:"file.recorded",taskId:task.id,file:{id:`${id}-result`,name:`Подготовка карточек · ИР365 · ${result.projects.length} черновиков`,path:task.resultPath,agentId:"editor",taskId:task.id,url:`/__agent-runtime/runs/${id}/result`},message:"Подготовленный JSON и отчёт сохранены отдельно от каталога"});
      task.status="needs-review";task.completedAt=now();
      await this.emit(run,{type:"agent.completed",taskId:task.id,agentId:"editor",message:"Преобразование завершено; пакет требует решения по пропускам"});
      await this.emit(run,{type:"task.completed",taskId:task.id,agentId:"editor",task:{...task},message:"Черновики и отчёт готовы к рассмотрению"});
      await this.emit(run,{type:"agent.status",taskId:task.id,agentId:"editor",status:"needs-review",message:"Подготовка карточек: требуется проверка человеком"});
      root.status="completed";root.completedAt=now();root.resultPath=task.resultPath;
      await this.emit(run,{type:"agent.completed",taskId:root.id,agentId:"astra",message:"Astra приняла пакет. Дальнейшие агенты не запускаются"});
      run.status="completed";run.completedAt=now();
      await this.emit(run,{type:"task.completed",taskId:root.id,agentId:"astra",task:{...root},message:"Подготовка ИР365 завершена без изменений публичного каталога"});
    })().catch(error=>this.fail(run,error instanceof Error?error.message:String(error))).finally(()=>{this.activeRunId=null;this.abort=null;});
    void this.running.catch(error=>console.error("Preparation persistence error",error));
    return run;
  }

  private async execute(run: RuntimeRun, signal: AbortSignal) {
    const root = run.tasks[0];
    root.status = "working"; root.startedAt = now();
    await this.emit(run, { type: "agent.assigned", taskId: root.id, agentId: "astra", message: "Astra назначена оркестратором задания" });
    await this.emit(run, { type: "agent.started", taskId: root.id, agentId: "astra", message: "Astra начала обработку города" });
    const scout: RuntimeTask = { ...root, id: randomUUID(), parentTaskId: root.id, agentId: "scout", title: `Найти производителей модульных домов и модульных бань: ${run.city} и регион`, status: "waiting", createdAt: now(), startedAt: null };
    run.tasks.push(scout);
    await this.emit(run, { type: "task.created", taskId: scout.id, agentId: "scout", task: { ...scout }, message: `Astra создала подзадачу Scout: ${scout.title}` });
    await this.emit(run, { type: "agent.assigned", taskId: scout.id, agentId: "scout", message: "Поиск производителей назначен Scout" });
    await this.emit(run, { type: "task.handoff", taskId: scout.id, from: "astra", to: "scout", message: "Astra передала задачу Scout" });
    this.providerState = await this.provider.available();
    if (!this.providerState.available) throw new Error(this.providerState.message);
    const registry = await this.registry();
    const directory = join(this.directory, "runs", run.id);
    await mkdir(directory, { recursive: true });
    await this.atomic(join(directory, "registry-before.json"), JSON.stringify(registry, null, 2));
    const prompt = scoutPrompt(run.city, registry);
    await this.atomic(join(directory, "scout-instructions.txt"), prompt);
    scout.status = "working"; scout.startedAt = now();
    await this.emit(run, { type: "agent.started", taskId: scout.id, agentId: "scout", message: "Scout запускает реальный веб-поиск через Codex CLI" });
    const timeout = AbortSignal.timeout(12 * 60 * 1000);
    const output = await this.provider.search({ prompt, directory, signal: AbortSignal.any([signal, timeout]), onSource: async url => {
      const parsed = publicUrlSchema.safeParse(url);
      if (!parsed.success || scout.sources.includes(parsed.data)) return;
      scout.sources.push(parsed.data);
      await this.emit(run, { type: "source.found", taskId: scout.id, agentId: "scout", sourceUrl: parsed.data, message: `Scout обратился к внешнему источнику: ${parsed.data}` });
    } });
    const latestRegistry = await this.registry();
    const classified = classifyCandidates(output.candidates, latestRegistry);
    run.result = resultSchema.parse({ version: 1, runId: run.id, taskId: scout.id, city: run.city, searchedAt: scout.startedAt, completedAt: now(), provider: "codex-cli-web-search", ...classified, sources: [...new Set(output.candidates.map(candidate => candidate.sourceUrl))], limitations: output.limitations, registryCheckedAt: now(), registryCount: latestRegistry.length });
    await this.atomic(join(directory, "registry-checked.json"), JSON.stringify(latestRegistry, null, 2));
    for (const candidate of classified.candidates) await this.emit(run, { type: "candidate.found", taskId: scout.id, agentId: "scout", candidateName: candidate.name, sourceUrl: candidate.sourceUrl, message: `Новый кандидат после проверки реестра: ${candidate.name}` });
    scout.resultPath = `runtime/runs/${run.id}/result.json`;
    await this.emit(run, { type: "file.recorded", taskId: scout.id, file: { id: `${run.id}-result`, name: `Scout · ${run.city} · ${classified.candidates.length} новых кандидатов`, path: scout.resultPath, agentId: "scout", taskId: scout.id, url: `/__agent-runtime/runs/${run.id}/result` }, message: `JSON сохранён: новых ${classified.candidates.length}, исключено ${classified.excluded.length}` });
    scout.status = "completed"; scout.completedAt = now();
    await this.emit(run, { type: "agent.completed", taskId: scout.id, agentId: "scout", message: "Scout завершил поиск и подготовил структурированный результат" });
    await this.emit(run, { type: "task.completed", taskId: scout.id, agentId: "scout", task: { ...scout }, message: "Подзадача Scout завершена" });
    root.status = "completed"; root.completedAt = now(); root.resultPath = scout.resultPath; root.sources = [...scout.sources];
    await this.emit(run, { type: "agent.completed", taskId: root.id, agentId: "astra", message: "Astra приняла результат Scout. Каталог не изменялся" });
    run.status = "completed"; run.completedAt = now();
    await this.emit(run, { type: "task.completed", taskId: root.id, agentId: "astra", task: { ...root }, message: `Обработка города ${run.city} завершена; результат ожидает ручного рассмотрения` });
  }
  private async fail(run: RuntimeRun, reason: string) {
    run.status = "failed"; run.error = reason.slice(0, 2000); run.completedAt = now();
    for (const task of run.tasks) {
      if (task.status === "completed") continue;
      task.status = "error"; task.error = run.error; task.completedAt = now();
      await this.emit(run, { type: "task.failed", taskId: task.id, agentId: task.agentId, task: { ...task }, error: run.error, message: `Задание ${task.agentId} остановлено: ${run.error}` });
    }
  }
  async waitForIdle() { await this.running; }
  async close() {
    this.abort?.abort(new Error("Runtime остановлен"));
    try { await this.running; } finally { if (this.ownsLock) { await unlink(join(this.directory, ".writer.lock")); this.ownsLock = false; } }
  }
}
