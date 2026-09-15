import { readFile, writeFile } from "node:fs/promises";
import process from "node:process";
import { fileURLToPath } from "node:url";
import {
  importedManufacturerSchema,
  importedProjectSchema,
} from "./universal-manufacturer-import.mjs";

const OPTIONAL_PROJECT_FIELDS = [
  "price",
  "dimensions",
  "roomCount",
  "bedrooms",
  "bathrooms",
  "floors",
  "productionTerm",
  "technology",
  "insulation",
  "completion",
];

const OPTIONAL_MANUFACTURER_FIELDS = [
  ["identity", "logo"],
  ["contacts", "phones"],
  ["contacts", "emails"],
  ["contacts", "telegram"],
  ["contacts", "youtube"],
  ["legal", "operator"],
  ["legal", "inn"],
  ["legal", "ogrn"],
  ["production", "address"],
  ["reviews", "externalProfile"],
  ["builtObjects", "sourcePage"],
];

const fieldIsKnown = (field) => field?.value !== null
  && field?.status !== "not-published"
  && field?.status !== "conflict";

const canonicalUrl = (value) => {
  const url = new URL(value);
  url.hash = "";
  url.search = "";
  url.pathname = url.pathname.replace(/\/+$/u, "") || "/";
  return url.toString();
};

export const evaluateReleaseGate = ({ manufacturer: rawManufacturer, projects: rawProjects }) => {
  const manufacturer = importedManufacturerSchema.parse(rawManufacturer);
  const projects = rawProjects.map((project) => importedProjectSchema.parse(project));
  const blockers = [];
  const warnings = [];
  const siteOrigin = new URL(manufacturer.contacts.siteUrl).origin;

  if (!fieldIsKnown(manufacturer.identity.name)) {
    blockers.push({ scope: "manufacturer", field: "identity.name", reason: "Не подтверждено название производителя." });
  }
  if (projects.length === 0) {
    blockers.push({ scope: "manufacturer", field: "catalog", reason: "Не найдено ни одного проекта." });
  }
  if (manufacturer.catalog.expectedProjectCount !== null && manufacturer.catalog.discoveredProjectCount !== manufacturer.catalog.expectedProjectCount) {
    blockers.push({
      scope: "manufacturer",
      field: "catalog.discoveredProjectCount",
      reason: `Ожидалось ${manufacturer.catalog.expectedProjectCount} проектов, найдено ${manufacturer.catalog.discoveredProjectCount}. Изменение состава каталога требует проверки.`,
    });
  }

  const seenProjectUrls = new Map();
  const seenProjectNames = new Map();
  const primaryImages = new Map();
  for (const [index, project] of projects.entries()) {
    const label = String(project.name.value ?? `project-${index + 1}`);
    const projectUrl = canonicalUrl(project.sourceUrl);
    if (seenProjectUrls.has(projectUrl)) {
      blockers.push({ scope: label, field: "sourceUrl", reason: `Дубликат источника проекта ${projectUrl}.` });
    }
    seenProjectUrls.set(projectUrl, label);
    const normalizedName = label.toLocaleLowerCase("ru").replace(/[^\p{L}\d]+/gu, " ").trim();
    if (seenProjectNames.has(normalizedName)) {
      blockers.push({ scope: label, field: "name", reason: `Повторяется название другого проекта: ${seenProjectNames.get(normalizedName)}.` });
    }
    seenProjectNames.set(normalizedName, label);

    if (new URL(project.sourceUrl).origin !== siteOrigin) {
      blockers.push({ scope: label, field: "sourceUrl", reason: "Карточка проекта находится не на официальном домене производителя." });
    }
    for (const fieldName of ["name", "productType", "area"]) {
      const field = project[fieldName];
      if (!fieldIsKnown(field)) {
        blockers.push({ scope: label, field: fieldName, reason: "Не заполнено минимальное поле эталонной карточки." });
      } else if (field.confidence < 0.7) {
        blockers.push({ scope: label, field: fieldName, reason: `Недостаточная достоверность: ${field.confidence}.` });
      }
    }
    if (project.conflicts.length > 0) {
      for (const conflict of project.conflicts) {
        blockers.push({ scope: label, field: conflict.field, reason: conflict.evidence });
      }
    }
    if (project.media.length < 2) {
      blockers.push({ scope: label, field: "media", reason: `Нужно минимум 2 изображения проекта, найдено ${project.media.length}.` });
    }
    const primaryImage = project.media[0]?.url;
    if (primaryImage) {
      const usages = primaryImages.get(primaryImage) ?? [];
      usages.push(label);
      primaryImages.set(primaryImage, usages);
    }
    for (const fieldName of OPTIONAL_PROJECT_FIELDS) {
      if (!fieldIsKnown(project[fieldName])) {
        warnings.push({ scope: label, field: fieldName, reason: "На официальной странице не опубликовано; в интерфейсе нельзя подставлять догадку." });
      }
    }
  }

  for (const [imageUrl, usages] of primaryImages) {
    if (usages.length > 1) {
      blockers.push({ scope: usages.join(", "), field: "media", reason: `Одна главная картинка повторяется у разных проектов: ${imageUrl}.` });
    }
  }

  for (const [group, fieldName] of OPTIONAL_MANUFACTURER_FIELDS) {
    if (!fieldIsKnown(manufacturer[group][fieldName])) {
      warnings.push({ scope: "manufacturer", field: `${group}.${fieldName}`, reason: "На официальных страницах не найдено; поле остаётся пустым до подтверждения." });
    }
  }

  const totalOptionalProjectFields = projects.length * OPTIONAL_PROJECT_FIELDS.length;
  const missingOptionalProjectFields = warnings.filter((warning) => warning.scope !== "manufacturer").length;
  return {
    checkedAt: new Date().toISOString(),
    manufacturerId: manufacturer.id,
    ready: blockers.length === 0,
    projectCount: projects.length,
    coverage: {
      requiredProjectFields: projects.length * 3,
      requiredProjectFieldsPassed: Math.max(0, projects.length * 3 - blockers.filter((item) => ["name", "productType", "area"].includes(item.field)).length),
      optionalProjectFields: totalOptionalProjectFields,
      optionalProjectFieldsFound: Math.max(0, totalOptionalProjectFields - missingOptionalProjectFields),
    },
    blockers,
    warnings,
  };
};

export const validatePackageDirectory = async (id, { write = false } = {}) => {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(id ?? "")) throw new Error("Укажите корректный id производителя.");
  const base = `content/manufacturers/${id}`;
  const [manufacturer, projects] = await Promise.all([
    readFile(`${base}/manufacturer.json`, "utf8").then(JSON.parse),
    readFile(`${base}/projects.json`, "utf8").then(JSON.parse),
  ]);
  const result = evaluateReleaseGate({ manufacturer, projects });
  if (write) await writeFile(`${base}/release-gate.json`, `${JSON.stringify(result, null, 2)}\n`, "utf8");
  return result;
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const id = process.argv.slice(2).find((value) => !value.startsWith("--"));
  const result = await validatePackageDirectory(id, { write: process.argv.includes("--write") });
  console.log(`${result.manufacturerId}: ${result.ready ? "READY" : "BLOCKED"}; проектов ${result.projectCount}; блокеров ${result.blockers.length}; предупреждений ${result.warnings.length}`);
  if (!result.ready) process.exitCode = 1;
}
