import { mkdir, writeFile } from "node:fs/promises";
import process from "node:process";
import { createServer } from "vite";

const args = process.argv.slice(2);
const shouldWrite = args.includes("--write");
const strict = args.includes("--strict");
const requestedIds = args.filter((value) => !value.startsWith("--"));

const vite = await createServer({
  appType: "custom",
  logLevel: "error",
  server: { middlewareMode: true },
});

try {
  const [{ manufacturerRegistry }, { projects }, { auditManufacturerPublicationQuality }] = await Promise.all([
    vite.ssrLoadModule("/src/data/manufacturers.ts"),
    vite.ssrLoadModule("/src/data/projects.ts"),
    vite.ssrLoadModule("/src/lib/manufacturerPublicationQuality.ts"),
  ]);
  const auditedManufacturers = Object.values(manufacturerRegistry)
    .filter((manufacturer) => manufacturer.profile?.sourceAudit)
    .filter((manufacturer) => requestedIds.length === 0 || requestedIds.includes(manufacturer.id));
  const manufacturers = auditedManufacturers.map((manufacturer) => auditManufacturerPublicationQuality(
    manufacturer,
    projects.filter((project) => project.manufacturerId === manufacturer.id),
  ));
  const report = {
    generatedAt: new Date().toISOString(),
    summary: {
      manufacturers: manufacturers.length,
      ready: manufacturers.filter((item) => item.status === "ready").length,
      sourceLimited: manufacturers.filter((item) => item.status === "source-limited").length,
      needsWork: manufacturers.filter((item) => item.status === "needs-work").length,
    },
    manufacturers,
  };

  for (const manufacturer of manufacturers) {
    const blocking = manufacturer.issues.filter((issue) => issue.severity === "blocking").length;
    const limited = manufacturer.issues.length - blocking;
    console.log(`${manufacturer.manufacturerId}: ${manufacturer.status}; блокирует ${blocking}; ограничения источника ${limited}`);
  }

  if (shouldWrite) {
    await mkdir("outputs", { recursive: true });
    await writeFile("outputs/manufacturer-readiness.json", `${JSON.stringify(report, null, 2)}\n`, "utf8");
    console.log("Отчёт: outputs/manufacturer-readiness.json");
  }
  if (strict && report.summary.needsWork > 0) process.exitCode = 1;
} finally {
  await vite.close();
}
