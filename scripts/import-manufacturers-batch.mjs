import { execFile } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { promisify } from "node:util";
import process from "node:process";
import { createServer } from "vite";

const execFileAsync = promisify(execFile);
const conciseError = (error) => {
  const stderr = typeof error?.stderr === "string" ? error.stderr : "";
  const code = stderr.match(/code:\s*'([^']+)'/u)?.[1];
  const host = stderr.match(/host:\s*'([^']+)'/u)?.[1];
  if (code) return `${code}${host ? ` при обращении к ${host}` : ""}`;
  return error instanceof Error ? error.message.split("\n").find((line) => line.trim()) ?? error.message : String(error);
};

const values = process.argv.slice(2);
const requestedIds = values.filter((value) => !value.startsWith("--"));
const option = (name) => values.find((value) => value.startsWith(`--${name}=`))?.slice(name.length + 3);
const city = option("city");
const strict = values.includes("--strict");
const resume = values.includes("--resume");

if (requestedIds.length === 0 && !city) {
  throw new Error("Укажите id производителей или --city=Екатеринбург. Пакетный импорт без явной области запрещён.");
}

const vite = await createServer({ appType: "custom", logLevel: "error", server: { middlewareMode: true, hmr: false } });
let manufacturers;
try {
  const [{ manufacturerRegistry }, { projects }] = await Promise.all([
    vite.ssrLoadModule("/src/data/manufacturers.ts"),
    vite.ssrLoadModule("/src/data/projects.ts"),
  ]);
  const cityIds = city
    ? [...new Set(projects.filter((project) => project.city === city).map((project) => project.manufacturerId))]
    : [];
  const ids = [...new Set([...requestedIds, ...cityIds])];
  manufacturers = ids.map((id) => ({ id, hasSite: Boolean(manufacturerRegistry[id]?.siteUrl) }));
} finally {
  await vite.close();
}

const results = [];
for (const { id, hasSite } of manufacturers) {
  if (!hasSite) {
    results.push({ manufacturerId: id, status: "failed", error: "В реестре нет официального siteUrl." });
    continue;
  }
  if (resume) {
    try {
      const [audit, gate] = await Promise.all([
        readFile(`content/manufacturers/${id}/audit.json`, "utf8").then(JSON.parse),
        readFile(`content/manufacturers/${id}/release-gate.json`, "utf8").then(JSON.parse),
      ]);
      results.push({ manufacturerId: id, status: gate.ready ? "ready" : "blocked", platform: audit.platform, projectCount: gate.projectCount, blockers: gate.blockers.length, warnings: gate.warnings.length });
      console.log(`${id}: RESUMED ${gate.ready ? "READY" : "BLOCKED"}; ${gate.projectCount} проектов; ${gate.blockers.length} блокеров`);
      continue;
    } catch {
      // No complete previous draft; perform a fresh isolated import.
    }
  }
  try {
    await execFileAsync(process.execPath, ["scripts/universal-manufacturer-import.mjs", id, "--write"], { maxBuffer: 2_000_000 });
    try {
      await execFileAsync(process.execPath, ["scripts/validate-manufacturer-package.mjs", id, "--write"], { maxBuffer: 1_000_000 });
    } catch {
      // BLOCKED is an expected gate result; the report contains the reasons.
    }
    const [audit, gate] = await Promise.all([
      readFile(`content/manufacturers/${id}/audit.json`, "utf8").then(JSON.parse),
      readFile(`content/manufacturers/${id}/release-gate.json`, "utf8").then(JSON.parse),
    ]);
    results.push({
      manufacturerId: id,
      status: gate.ready ? "ready" : "blocked",
      platform: audit.platform,
      projectCount: gate.projectCount,
      blockers: gate.blockers.length,
      warnings: gate.warnings.length,
    });
    console.log(`${id}: ${gate.ready ? "READY" : "BLOCKED"}; ${gate.projectCount} проектов; ${gate.blockers.length} блокеров`);
  } catch (error) {
    const message = conciseError(error);
    results.push({ manufacturerId: id, status: "failed", error: message });
    console.error(`${id}: FAILED; ${message}`);
  }
}

const summary = {
  generatedAt: new Date().toISOString(),
  scope: city ? { city } : { manufacturerIds: requestedIds },
  totals: {
    manufacturers: results.length,
    ready: results.filter((result) => result.status === "ready").length,
    blocked: results.filter((result) => result.status === "blocked").length,
    failed: results.filter((result) => result.status === "failed").length,
  },
  results,
};
await mkdir("outputs", { recursive: true });
await writeFile("outputs/manufacturer-import-batch.json", `${JSON.stringify(summary, null, 2)}\n`, "utf8");
console.log("Отчёт: outputs/manufacturer-import-batch.json");
if (strict && (summary.totals.blocked > 0 || summary.totals.failed > 0)) process.exitCode = 1;
