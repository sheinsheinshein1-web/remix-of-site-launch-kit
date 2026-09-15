import { join } from "node:path";
import { existsSync } from "node:fs";
import type { Plugin } from "vite";
import type { IncomingMessage, ServerResponse } from "node:http";
import { AgentRuntime, RuntimeBusyError } from "./runtime";
import { createCodexSearch } from "./codex-search";

const loopback = (address: string | undefined) => ["127.0.0.1", "::1", "::ffff:127.0.0.1"].includes(address ?? "");
export function isLocalRuntimeRequest(request: IncomingMessage) {
  if (!loopback(request.socket.remoteAddress)) return false;
  const host = request.headers.host ?? "";
  if (!/^(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/.test(host)) return false;
  if (request.headers.origin && request.headers.origin !== `http://${host}`) return false;
  return request.headers["sec-fetch-site"] !== "cross-site";
}
const send = (res: ServerResponse, status: number, data: unknown) => {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow", "X-Content-Type-Options": "nosniff" });
  res.end(JSON.stringify(data, null, 2));
};
async function body(req: IncomingMessage) {
  if (!req.headers["content-type"]?.startsWith("application/json")) throw new Error("Требуется application/json");
  let content = "";
  for await (const chunk of req) { content += chunk; if (content.length > 4096) throw new Error("Слишком большой запрос"); }
  return JSON.parse(content);
}

export function agentRuntimePlugin(): Plugin {
  return { name: "mnogomesta-local-agent-runtime", apply: "serve", configureServer(server) {
    const root = server.config.root;
    const binary = process.env.CODEX_EXECUTABLE ?? ["/Applications/ChatGPT.app/Contents/Resources/codex", "/Applications/Codex.app/Contents/Resources/codex", "/usr/local/bin/codex"].find(existsSync) ?? "codex";
    const runtime = new AgentRuntime(process.env.AGENT_RUNTIME_DIR ?? join(root, "runtime"), createCodexSearch(binary, join(root, "server/agent-runtime/scout-output.schema.json")), async () => {
      const { manufacturerRegistry } = await server.ssrLoadModule("/src/data/manufacturers.ts");
      return Object.values(manufacturerRegistry as Record<string, { id: string; name: string; siteUrl?: string }>).map(({ id, name, siteUrl }) => ({ id, name, siteUrl }));
    }, undefined, async () => {
      const makers = await server.ssrLoadModule("/src/data/manufacturers.ts");
      const catalog = await server.ssrLoadModule("/src/data/projects.ts");
      const facts = await server.ssrLoadModule("/src/data/projectSourceFacts.ts");
      return { manufacturers: Object.values(makers.manufacturerRegistry), projects: catalog.allProjects, referenceFacts: facts.projectSourceFactsById,
        validateManufacturer: record => makers.manufacturerSchema.safeParse(record).success };
    });
    const ready = runtime.init();
    void ready.catch(error => server.config.logger.error(`Agent runtime: ${error.message}`));
    server.httpServer?.once("close", () => { void ready.then(() => runtime.close()).catch(() => {}); });
    server.middlewares.use(async (req, res, next) => {
      const path = (req.url ?? "").split("?")[0];
      if (!path.startsWith("/__agent-runtime/")) return next();
      if (!isLocalRuntimeRequest(req)) return send(res, 403, { error: "Runtime доступен только с этого компьютера и этого сайта" });
      try {
        await ready;
        if (req.method === "GET" && path === "/__agent-runtime/snapshot") return send(res, 200, runtime.snapshot());
        if (req.method === "POST" && path === "/__agent-runtime/company-completions") {
          const run = await runtime.completeCompany(await body(req));
          return send(res, 202, { runId: run.id, taskId: run.tasks[0].id });
        }
        if (req.method === "POST" && path === "/__agent-runtime/preparations") {
          const run = await runtime.createPreparation(await body(req));
          return send(res, 202, { runId: run.id, taskId: run.tasks[0].id });
        }
        if (req.method === "POST" && path === "/__agent-runtime/collections") {
          const run = await runtime.createCollection(await body(req));
          return send(res, 202, { runId: run.id, taskId: run.tasks[0].id });
        }
        if (req.method === "POST" && path === "/__agent-runtime/tasks") {
          const run = await runtime.create(await body(req));
          return send(res, 202, { runId: run.id, taskId: run.tasks[0].id });
        }
        const match = path.match(/^\/__agent-runtime\/runs\/([\da-f-]{36})\/result$/);
        if (req.method === "GET" && match) {
          const run = runtime.getRun(match[1]);
          return run?.result ? send(res, 200, run.result) : send(res, 404, { error: "Результат ещё не создан" });
        }
        send(res, 404, { error: "Неизвестный маршрут runtime" });
      } catch (error) {
        send(res, error instanceof RuntimeBusyError ? 409 : 400, { error: error instanceof Error ? error.message.slice(0, 2000) : "Ошибка runtime" });
      }
    });
  } };
}
