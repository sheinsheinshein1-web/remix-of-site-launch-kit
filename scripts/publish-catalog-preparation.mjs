import { copyFile, mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { basename, dirname, join, resolve } from "node:path";
import process from "node:process";
import { createServer } from "vite";

const inputPath = process.argv.slice(2).find((value) => !value.startsWith("--"));
const approved = process.argv.includes("--approve");
const registryPath = resolve("src/data/generated/catalog-registry.json");

if (!inputPath) throw new Error("Укажите result.json этапа подготовки.");
if (!approved) throw new Error("Публикация требует явного флага --approve после проверки отчёта.");

const requiredProjectFields = [
  "id", "name", "badge", "price", "area", "beds", "baths", "floors", "term", "rooms",
  "purpose", "city", "manufacturerId", "sourceUrl", "productType", "description", "descriptionLong",
  "gallery", "likes", "rating", "suitableFor", "technology", "completion", "insulation", "features",
  "style", "landSize", "hasRealPhotos", "hasShowroom", "hasInstallment",
];

const vite = await createServer({ appType: "custom", logLevel: "error", server: { middlewareMode: true } });
try {
  const [{ preparationResultSchema }, { manufacturerSchema }, { projectRecords }] = await Promise.all([
    vite.ssrLoadModule("/src/features/agent-office/preparation-contract.ts"),
    vite.ssrLoadModule("/src/data/manufacturers.ts"),
    vite.ssrLoadModule("/src/data/projects.ts"),
  ]);
  const sourceFile = resolve(inputPath);
  const preparation = preparationResultSchema.parse(JSON.parse(await readFile(sourceFile, "utf8")));
  const envelope = preparation.manufacturerPackage;

  if (!preparation.manufacturer.ready || preparation.projects.some((project) => !project.ready)) {
    throw new Error("Пакет не готов: производитель или проекты имеют незаполненные поля.");
  }
  if (!envelope?.readiness.ready || !envelope.readiness.envelopeComplete || !envelope.readiness.dataComplete) {
    throw new Error(`Пакет не прошёл проверку: ${envelope?.readiness.blockers.join("; ") || "нет полного manufacturerPackage"}`);
  }

  const manufacturer = manufacturerSchema.parse(preparation.manufacturer.record);
  const preparedProjects = preparation.projects.map((prepared) => {
    const record = prepared.record;
    const missing = requiredProjectFields.filter((field) => record[field] === null || record[field] === undefined);
    if (missing.length > 0) throw new Error(`Проект ${record.id ?? "без ID"}: отсутствуют ${missing.join(", ")}`);
    if (!Array.isArray(record.gallery) || record.gallery.length === 0) throw new Error(`Проект ${record.id}: пустая галерея.`);
    if (record.manufacturerId !== manufacturer.id) throw new Error(`Проект ${record.id}: неверная связь с производителем.`);
    return record;
  });

  const current = JSON.parse(await readFile(registryPath, "utf8"));
  const generatedManufacturerIds = new Set(current.manufacturers.map((item) => item.id));
  const staticManufacturerExists = Object.prototype.hasOwnProperty.call(
    (await vite.ssrLoadModule("/src/data/manufacturers.ts")).manufacturerRegistry,
    manufacturer.id,
  ) && !generatedManufacturerIds.has(manufacturer.id);
  if (staticManufacturerExists) {
    throw new Error(`Производитель ${manufacturer.id} пока хранится в ручном слое. Сначала выполните управляемую миграцию, перезапись запрещена.`);
  }

  const generatedProjectIds = new Set(current.projects.map((item) => item.id));
  const staticProjectIds = new Set(projectRecords.filter((item) => !generatedProjectIds.has(item.id)).map((item) => item.id));
  for (const project of preparedProjects) {
    if (staticProjectIds.has(project.id)) throw new Error(`ID проекта ${project.id} уже занят ручным реестром.`);
  }

  const retainedManufacturers = current.manufacturers.filter((item) => item.id !== manufacturer.id);
  const retainedProjects = current.projects.filter((item) => item.manufacturerId !== manufacturer.id);
  const replacedProjectIds = new Set(current.projects.filter((item) => item.manufacturerId === manufacturer.id).map((item) => String(item.id)));
  const projectSourceFacts = Object.fromEntries(
    Object.entries(current.projectSourceFacts).filter(([projectId]) => !replacedProjectIds.has(projectId)),
  );
  for (const prepared of preparation.projects) projectSourceFacts[String(prepared.record.id)] = prepared.sourceFacts;

  const publishedAt = new Date().toISOString();
  const next = {
    version: 1,
    publishedAt,
    manufacturers: [...retainedManufacturers, manufacturer],
    projects: [...retainedProjects, ...preparedProjects],
    projectSourceFacts,
    imports: [
      ...(current.imports ?? []).filter((item) => item.manufacturerId !== manufacturer.id),
      { manufacturerId: manufacturer.id, sourceRunId: preparation.sourceRunId, sourceSha256: preparation.sourceSha256, publishedAt },
    ],
  };

  const backupDirectory = resolve("outputs/catalog-publisher-backups");
  await mkdir(backupDirectory, { recursive: true });
  await copyFile(registryPath, join(backupDirectory, `${publishedAt.replace(/[:.]/gu, "-")}-${basename(registryPath)}`));
  const temporaryPath = join(dirname(registryPath), `.catalog-registry-${process.pid}.tmp`);
  await writeFile(temporaryPath, `${JSON.stringify(next, null, 2)}\n`, "utf8");
  await rename(temporaryPath, registryPath);
  console.log(`Опубликовано: ${manufacturer.name}; проектов: ${preparedProjects.length}; реестр: ${registryPath}`);
} finally {
  await vite.close();
}
