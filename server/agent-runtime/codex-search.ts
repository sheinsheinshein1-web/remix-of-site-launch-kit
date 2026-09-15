import { spawn, spawnSync } from "node:child_process";
import { access, appendFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { scoutOutputSchema, type ScoutOutput } from "../../src/features/agent-office/runtime-contract";
import { normalizeDomain, sameDomain } from "./scout";
import { completedSourceUrl } from "./provider-events";

export interface SearchProvider {
  available(): Promise<{ available: boolean; message: string }>;
  search(input: { prompt: string; directory: string; onSource: (url: string) => Promise<void>; signal: AbortSignal }): Promise<ScoutOutput>;
}
export const normalizeSource = (value: string) => { const url = new URL(value); url.hash = ""; return url.href.replace(/\/$/, ""); };

export function createCodexSearch(binary: string, schemaPath: string): SearchProvider {
  return {
    async available() {
      try {
        await access(binary);
        const result = spawnSync(binary, ["login", "status"], { encoding: "utf8", timeout: 5000, stdio: ["ignore", "pipe", "pipe"] });
        return { available: result.status === 0, message: result.status === 0 ? "Codex CLI · web_search live" : "Нужна авторизация: codex login" };
      } catch { return { available: false, message: "Укажите путь CODEX_EXECUTABLE к установленному Codex CLI и выполните codex login" }; }
    },
    async search({ prompt, directory, onSource, signal }) {
      await mkdir(directory, { recursive: true });
      const args = ["exec", "--ignore-user-config", "--ephemeral", "--skip-git-repo-check", "--sandbox", "read-only", "--json", "-C", directory,
        "-c", 'web_search="live"', "-c", 'approval_policy="never"', "-c", "features.shell_tool=false", "-c", "features.multi_agent=false", "-c", "features.apps=false", "-c", "features.plugins=false", "-c", "features.remote_plugin=false", "-c", "project_doc_max_bytes=0", "--output-schema", schemaPath, "-"];
      const child = spawn(binary, args, { stdio: ["pipe", "pipe", "pipe"], shell: false, signal });
      child.stdin.end(prompt);
      let buffer = "", lastMessage = "", failure = "", searches = 0;
      let processing = Promise.resolve();
      let parseFailure: Error | null = null;
      const opened = new Set<string>();
      const stderrPath = join(directory, "stderr.log");
      child.stderr.on("data", chunk => { processing = processing.then(() => appendFile(stderrPath, chunk)); });
      const consume = async (line: string) => {
        if (!line.trim()) return;
        await appendFile(join(directory, "provider.jsonl"), `${line}\n`);
        const entry = JSON.parse(line);
        if (entry.type === "turn.failed" || entry.type === "error") failure = entry.error?.message ?? entry.message ?? "Ошибка процесса Scout";
        if (entry.type !== "item.completed") return;
        const item = entry.item;
        if (item?.type === "agent_message") lastMessage = item.text;
        if (item?.type !== "web_search") return;
        if (item.action?.type === "search") searches++;
        const url = completedSourceUrl(entry);
        if (url) {
          const normalized = normalizeSource(url);
          if (!opened.has(normalized)) { opened.add(normalized); await onSource(url); }
        }
      };
      child.stdout.on("data", chunk => {
        buffer += chunk.toString();
        if (buffer.length > 4_000_000) { parseFailure = new Error("Превышен размер сообщения Scout"); child.kill(); return; }
        let boundary: number;
        while ((boundary = buffer.indexOf("\n")) !== -1) {
          const line = buffer.slice(0, boundary); buffer = buffer.slice(boundary + 1);
          processing = processing.then(() => consume(line)).catch(error => { parseFailure = error; child.kill(); });
        }
      });
      let processError: Error | null = null;
      const code = await new Promise<number | null>(resolve => { child.once("error", error => { processError = error; }); child.once("close", resolve); });
      if (buffer.trim()) processing = processing.then(() => consume(buffer));
      await processing;
      if (processError) throw processError;
      if (parseFailure) throw parseFailure;
      if (code !== 0 || failure) throw new Error(failure || `Scout завершился с кодом ${code}`);
      if (!searches) throw new Error("Scout не выполнил настоящий web_search. Результат не принят");
      const output = scoutOutputSchema.parse(JSON.parse(lastMessage));
      verifyScoutSources(output, opened);
      return output;
    },
  };
}

export function verifyScoutSources(output: ScoutOutput, opened: Set<string>) {
  for (const candidate of output.candidates) {
    if (!opened.has(normalizeSource(candidate.sourceUrl))) throw new Error(`Нет подтверждения открытия источника ${candidate.sourceUrl}; кандидат не принят`);
    if (!sameDomain(normalizeDomain(candidate.sourceUrl), normalizeDomain(candidate.officialWebsite))) throw new Error(`Источник ${candidate.name} не принадлежит официальному домену`);
  }
}
