// @vitest-environment node
import { afterEach, describe, expect, it } from "vitest";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import type { IncomingMessage } from "node:http";
import { AgentRuntime } from "../../server/agent-runtime/runtime";
import { classifyCandidates, normalizeDomain, normalizeIdentity } from "../../server/agent-runtime/scout";
import { verifyScoutSources, normalizeSource, type SearchProvider } from "../../server/agent-runtime/codex-search";
import { isLocalRuntimeRequest } from "../../server/agent-runtime/vite-plugin";
import { candidateSchema, cityTaskInputSchema, type ScoutCandidate } from "@/features/agent-office/runtime-contract";
import { replayOfficeEvents } from "@/features/agent-office/events";

// Fixtures are used only in isolated temporary directories, never in the app runtime.
const sample = (extra: Partial<ScoutCandidate> = {}): ScoutCandidate => ({ name: "Тестовый производитель", officialWebsite: "https://new.example/", cityRegion: "Тестовый город", products: ["Модульные дома"], modularHouses: "yes", modularBaths: "unclear", businessRole: "manufacturer", manufacturerStatus: "confirmed", sourceUrl: "https://new.example/about", evidence: "Тестовый источник сообщает о производстве модульных домов.", confidence: .7, inclusionReason: "Кандидат из тестового официального источника.", knownRegistryId: null, ...extra });
const directories: string[] = [];
const runtimes: AgentRuntime[] = [];
afterEach(async () => { for (const runtime of runtimes.splice(0)) await runtime.close(); for (const directory of directories.splice(0)) await rm(directory, { recursive: true, force: true }); });
async function create(provider: SearchProvider, registry = [{ id: "existing", name: "Другой производитель", siteUrl: "https://existing.example" }]) {
  const directory = await mkdtemp(join(tmpdir(), "mnogomesta-runtime-test-")); directories.push(directory);
  const runtime = new AgentRuntime(directory, provider, async () => registry); runtimes.push(runtime); await runtime.init(); return runtime;
}
const available = async () => ({ available: true, message: "Test-only provider" });

describe("Scout validation", () => {
  it("normalizes domain, ID and name without relying only on a name", () => {
    expect(normalizeDomain("HTTPS://WWW.Example.COM./about?x=1")).toBe("example.com");
    expect(normalizeDomain("https://пример.рф")).toBe("xn--e1afmkfd.xn--p1ai");
    expect(normalizeIdentity(" Ёлка — Дом ")).toBe("елкадом");
    const registry = [{ id: "maker-one", name: "Исходное название", siteUrl: "https://www.example.com" }, { id: "maker-two", name: "Ёлка Дом", siteUrl: "https://another.example" }];
    const result = classifyCandidates([sample({ name: "Новое название", officialWebsite: "https://ekb.example.com" }), sample({ name: "Елка-Дом" }), sample({ knownRegistryId: "maker-one" }), sample()], registry);
    expect(result.candidates).toHaveLength(1); expect(result.excluded).toHaveLength(3);
    expect(result.excluded[0].registryIds).toEqual(["maker-one"]);
  });
  it("excludes repeats and intermediaries; uncertainty remains explicit", () => {
    const result = classifyCandidates([sample(), sample({ name: "Повтор", officialWebsite: "https://www.new.example" }), sample({ name: "Посредник", officialWebsite: "https://reseller.example", businessRole: "intermediary", manufacturerStatus: "unclear" })], []);
    expect(result.candidates).toHaveLength(1); expect(result.excluded).toHaveLength(2);
    expect(result.candidates[0].modularBaths).toBe("unclear");
  });
  it("rejects unsupported evidence and unsafe source addresses", () => {
    expect(candidateSchema.safeParse(sample({ officialWebsite: "new.example" })).success).toBe(false);
    expect(candidateSchema.safeParse(sample({ officialWebsite: "http://127.0.0.1:8080" })).success).toBe(false);
    expect(candidateSchema.safeParse(sample({ businessRole: "unclear", manufacturerStatus: "confirmed" })).success).toBe(false);
    expect(cityTaskInputSchema.safeParse({ city: "../runtime", requestId: randomUUID() }).success).toBe(false);
    expect(() => verifyScoutSources({ candidates: [sample()], limitations: [] }, new Set())).toThrow("открытия");
    expect(() => verifyScoutSources({ candidates: [sample()], limitations: [] }, new Set([normalizeSource(sample().sourceUrl)]))).not.toThrow();
  });
});

describe("Runtime lifecycle", () => {
  it("persists Astra → Scout, deduplicates, and replays only recorded events after restart", async () => {
    const runtime = await create({ available, search: async ({ onSource }) => { await onSource(sample().sourceUrl); return { candidates: [sample(), sample({ name: "Другой производитель", officialWebsite: "https://existing.example", sourceUrl: "https://existing.example/about" })], limitations: ["Тестовая фикстура"] }; } });
    const request = { city: "Екатеринбург", requestId: randomUUID() };
    const run = await runtime.create(request); await runtime.waitForIdle();
    expect(run.status).toBe("completed");
    const result = run.result && "candidates" in run.result ? run.result : null;
    expect(result?.candidates).toHaveLength(1); expect(result?.excluded).toHaveLength(1);
    expect(run.tasks[1].parentTaskId).toBe(run.tasks[0].id);
    expect(run.tasks.every(task => task.startedAt && task.completedAt && task.status === "completed")).toBe(true);
    const required = ["task.created", "agent.assigned", "agent.started", "source.found", "candidate.found", "agent.completed", "task.completed", "task.handoff"];
    for (const type of required) expect(run.events.some(event => event.type === type)).toBe(true);
    expect(await runtime.create(request)).toBe(run);
    const state = replayOfficeEvents(run.events, run.events.length);
    expect(state.statuses.astra).toBe("completed"); expect(state.statuses.scout).toBe("completed");
    expect(Object.entries(state.statuses).filter(([id]) => !["astra", "scout"].includes(id)).every(([, status]) => status === "idle")).toBe(true);
    const sourceIndex = run.events.findIndex(event => event.type === "source.found");
    expect(replayOfficeEvents(run.events, sourceIndex + 1).statuses.scout).toBe("working");
    const diskResult = JSON.parse(await readFile(join(runtime.directory, "runs", run.id, "result.json"), "utf8"));
    expect(diskResult).toEqual(run.result);
    const journal = (await readFile(join(runtime.directory, "events", `${run.id}.jsonl`), "utf8")).trim().split("\n").map(line => JSON.parse(line));
    expect(journal).toEqual(run.events);
    await runtime.close();
    const reopened = new AgentRuntime(runtime.directory, { available, search: async () => { throw new Error("Must not run"); } }, async () => []);
    runtimes.push(reopened); await reopened.init();
    expect(reopened.snapshot().events).toEqual(run.events); expect(reopened.getRun(run.id)?.result).toEqual(run.result);
  });
  it("records real provider failures instead of a successful empty search", async () => {
    const runtime = await create({ available, search: async () => { throw new Error("Поисковый инструмент недоступен"); } });
    const run = await runtime.create({ city: "Екатеринбург", requestId: randomUUID() }); await runtime.waitForIdle();
    expect(run.status).toBe("failed"); expect(run.result).toBeNull();
    expect(run.events.filter(event => event.type === "task.failed")).toHaveLength(2);
    expect(run.events.some(event => event.type === "task.completed")).toBe(false);
    const state = replayOfficeEvents(run.events, run.events.length);
    expect(state.statuses.scout).toBe("error"); expect(state.statuses.publisher).toBe("idle");
  });
  it("prevents parallel execution and rejects a second writer", async () => {
    let finish!: () => void;
    const gate = new Promise<void>(resolve => { finish = resolve; });
    const runtime = await create({ available, search: async () => { await gate; return { candidates: [], limitations: [] }; } });
    await runtime.create({ city: "Екатеринбург", requestId: randomUUID() });
    await expect(runtime.create({ city: "Москва", requestId: randomUUID() })).rejects.toThrow("дождитесь");
    const other = new AgentRuntime(runtime.directory, { available, search: async () => ({ candidates: [], limitations: [] }) }, async () => []);
    await expect(other.init()).rejects.toThrow("другим процессом");
    finish(); await runtime.waitForIdle();
  });
  it("marks interrupted work failed on restart without rerunning it", async () => {
    const runtime = await create({ available, search: async () => ({ candidates: [], limitations: [] }) });
    const run = await runtime.create({ city: "Екатеринбург", requestId: randomUUID() }); await runtime.waitForIdle(); await runtime.close();
    const interrupted = { ...run, status: "running", result: null, completedAt: null, tasks: run.tasks.map(task => ({ ...task, status: "working", completedAt: null })) };
    await writeFile(join(runtime.directory, "runs", `${run.id}.json`), JSON.stringify(interrupted));
    const recovered = new AgentRuntime(runtime.directory, { available, search: async () => { throw new Error("Should not restart"); } }, async () => []);
    runtimes.push(recovered); await recovered.init();
    expect(recovered.getRun(run.id)?.status).toBe("failed");
    expect(recovered.getRun(run.id)?.error).toContain("прерван");
  });
});

it("restricts runtime requests to loopback and same origin", () => {
  const request = (address: string, host: string, origin?: string) => ({ socket: { remoteAddress: address }, headers: { host, origin } } as IncomingMessage);
  expect(isLocalRuntimeRequest(request("127.0.0.1", "127.0.0.1:8080", "http://127.0.0.1:8080"))).toBe(true);
  expect(isLocalRuntimeRequest(request("192.168.1.2", "127.0.0.1:8080"))).toBe(false);
  expect(isLocalRuntimeRequest(request("127.0.0.1", "evil.example:8080"))).toBe(false);
  expect(isLocalRuntimeRequest(request("127.0.0.1", "127.0.0.1:8080", "https://evil.example"))).toBe(false);
});
