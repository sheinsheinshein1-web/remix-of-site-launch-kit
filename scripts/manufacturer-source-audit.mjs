import { mkdir, writeFile } from "node:fs/promises";
import process from "node:process";
import { createServer } from "vite";
import {
  discoverByggeProjectUrls,
  discoverSqModylProjectUrls,
  parseProjectByManufacturer,
} from "./manufacturer-source-adapters.mjs";

const args = process.argv.slice(2);
const shouldWrite = args.includes("--write");
const strict = args.includes("--strict");
const requestedIds = args.filter((value) => !value.startsWith("--"));
const strictAdapterIds = new Set(["bygge", "platforma", "sq-modyl", "fps-modul", "da-home"]);

const normalizePath = (value) => new URL(value).pathname.replace(/\/+$/u, "");
const normalizeComparable = (value) => String(value ?? "")
  .toLocaleLowerCase("ru")
  .replace(/\d+(?:[.,]\d+)?/gu, (number) => String(Number(number.replace(",", "."))))
  .replace(/[.,]/gu, "")
  .replace(/\s+/gu, "")
  .replace(/руб(?:лей|ля|ль)?|₽|м²|м2|дней|дня|день|д\.?/giu, "")
  .replace(/[хx*]/giu, "×")
  .trim();

const htmlCache = new Map();
const fetchHtml = async (url) => {
  if (!htmlCache.has(url)) {
    htmlCache.set(url, (async () => {
      let lastError;
      for (let attempt = 1; attempt <= 3; attempt += 1) {
        try {
          const response = await fetch(url, {
            headers: { "user-agent": "MnogomestaSourceAudit/1.0 (+https://xn--80aaaa5cfdi5b.xn--p1ai)" },
            signal: AbortSignal.timeout(30_000),
          });
          if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
          return response.text();
        } catch (error) {
          lastError = error;
        }
      }
      throw lastError;
    })());
  }
  return htmlCache.get(url);
};

const runPool = async (items, worker, concurrency = 5) => {
  const results = new Array(items.length);
  let cursor = 0;
  const runners = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await worker(items[index], index);
    }
  });
  await Promise.all(runners);
  return results;
};

const compareFact = ({ key, localFact, sourceFact, strictAdapter }) => {
  if (!localFact) return { field: key, severity: "error", code: "missing-local-provenance", message: "Нет локального source fact." };
  if (
    strictAdapter
    && sourceFact.status === "published"
    && sourceFact.value
    && localFact.status !== "verified"
    && localFact.status !== "derived"
  ) {
    return {
      field: key,
      severity: key === "dimensions" ? "warning" : "error",
      code: key === "dimensions" ? "published-optional-source-value-not-imported" : "published-source-value-not-imported",
      message: `Официальный источник публикует «${sourceFact.value}», но значение не перенесено в карточку.`,
    };
  }
  if (sourceFact.status === "conflict") {
    if (
      localFact.value
      && sourceFact.value
      && normalizeComparable(localFact.value) !== normalizeComparable(sourceFact.value)
    ) {
      return { field: key, severity: "error", code: "value-mismatch-inside-upstream-conflict", message: `Локально «${localFact.value}», выбранное видимое значение источника «${sourceFact.value}». ${sourceFact.evidence}` };
    }
    return { field: key, severity: "warning", code: "multiple-source-metrics", message: sourceFact.evidence };
  }
  if (localFact.status === "verified" && sourceFact.status === "not-published") {
    return {
      field: key,
      severity: strictAdapter ? "error" : "warning",
      code: strictAdapter ? "verified-value-not-found" : "generic-adapter-did-not-find-value",
      message: `Локально подтверждено «${localFact.value}», но автоматический проход значение не нашёл.`,
    };
  }
  if (localFact.status === "derived" && sourceFact.status === "not-published") {
    return { field: key, severity: "warning", code: "derived-value-needs-review", message: `Локальное значение «${localFact.value}» выведено из плана или изображения и не найдено текстовым адаптером.` };
  }
  if (
    (localFact.status === "verified" || localFact.status === "derived")
    && sourceFact.value
    && normalizeComparable(localFact.value) !== normalizeComparable(sourceFact.value)
  ) {
    return {
      field: key,
      severity: strictAdapter ? "error" : "warning",
      code: strictAdapter ? "value-mismatch" : "generic-adapter-value-review",
      message: `Локально «${localFact.value}», автоматический адаптер извлёк «${sourceFact.value}».`,
    };
  }
  return null;
};

const vite = await createServer({
  appType: "custom",
  logLevel: "error",
  server: { middlewareMode: true },
});

try {
  const [{ projects }, sourceFactsModule, manufacturersModule] = await Promise.all([
    vite.ssrLoadModule("/src/data/projects.ts"),
    vite.ssrLoadModule("/src/data/projectSourceFacts.ts"),
    vite.ssrLoadModule("/src/data/manufacturers.ts"),
  ]);
  const { getProjectSourceFacts } = sourceFactsModule;
  const { manufacturerRegistry } = manufacturersModule;
  const supportedManufacturerIds = new Set(
    Object.values(manufacturerRegistry)
      .filter((manufacturer) => manufacturer.profile?.sourceAudit)
      .map((manufacturer) => manufacturer.id),
  );
  const manufacturerIds = requestedIds.length > 0 ? requestedIds : [...supportedManufacturerIds];
  for (const manufacturerId of manufacturerIds) {
    if (!supportedManufacturerIds.has(manufacturerId)) {
      throw new Error(`Производитель «${manufacturerId}» не входит в проверенный екатеринбургский реестр.`);
    }
  }
  const auditDate = new Date().toISOString();
  const report = {
    generatedAt: auditDate,
    mode: "read-only",
    manufacturers: [],
    summary: { manufacturers: 0, projects: 0, errors: 0, warnings: 0 },
  };

  for (const manufacturerId of manufacturerIds) {
    const maker = manufacturerRegistry[manufacturerId];
    const usesStrictAdapter = strictAdapterIds.has(manufacturerId);
    const manufacturerProjects = projects.filter((project) => project.manufacturerId === manufacturerId);
    const manufacturerIssues = [];
    let discoveredProjectUrls = [];

    if (manufacturerId === "bygge") {
      const catalogPages = await Promise.all([
        fetchHtml("https://bygge.ru/katalog/"),
        fetchHtml("https://bygge.ru/katalog/?page=2"),
      ]);
      discoveredProjectUrls = [...new Set(catalogPages.flatMap((html) => discoverByggeProjectUrls({ html })))];
      const localPaths = new Set(manufacturerProjects.map((project) => normalizePath(project.sourceUrl)));
      const discoveredPaths = new Set(discoveredProjectUrls.map(normalizePath));
      for (const url of discoveredProjectUrls) {
        if (!localPaths.has(normalizePath(url))) {
          manufacturerIssues.push({ severity: "error", code: "missing-local-project", message: `Проект источника отсутствует локально: ${url}` });
        }
      }
      for (const project of manufacturerProjects) {
        if (!discoveredPaths.has(normalizePath(project.sourceUrl))) {
          manufacturerIssues.push({ severity: "error", code: "project-not-in-catalog", message: `Локальный проект не найден в официальном каталоге: ${project.sourceUrl}` });
        }
      }
    } else if (manufacturerId === "sq-modyl") {
      const homepage = await fetchHtml("https://modyl.info/");
      discoveredProjectUrls = discoverSqModylProjectUrls({ html: homepage });
      const localPaths = new Set(manufacturerProjects.map((project) => normalizePath(project.sourceUrl)));
      const discoveredPaths = new Set(discoveredProjectUrls.map(normalizePath));
      for (const url of discoveredProjectUrls) {
        if (!localPaths.has(normalizePath(url))) {
          manufacturerIssues.push({ severity: "error", code: "missing-local-project", message: `Проект источника отсутствует локально: ${url}` });
        }
      }
      for (const project of manufacturerProjects) {
        if (!discoveredPaths.has(normalizePath(project.sourceUrl))) {
          manufacturerIssues.push({ severity: "error", code: "project-not-in-catalog", message: `Локальный проект не найден в официальном каталоге: ${project.sourceUrl}` });
        }
      }
    } else {
      discoveredProjectUrls = manufacturerProjects.map((project) => project.sourceUrl);
      manufacturerIssues.push({
        severity: "warning",
        code: manufacturerId === "platforma" ? "seeded-catalog-discovery" : "generic-catalog-discovery",
        message: manufacturerId === "platforma"
          ? "Каталог Platforma загружается Tilda API; проверены все локальные sourceUrl, независимое обнаружение каталога ещё не подключено."
          : "Проверены все локальные sourceUrl. Независимое обнаружение полного каталога требует отдельного адаптера этого сайта.",
      });
    }

    const projectReports = await runPool(manufacturerProjects, async (project) => {
      const localFacts = getProjectSourceFacts(project.id);
      try {
        const html = await fetchHtml(project.sourceUrl);
        const source = parseProjectByManufacturer({ manufacturerId, html, sourceUrl: project.sourceUrl });
        const issues = [
          compareFact({ key: "area", localFact: localFacts?.area, sourceFact: source.area, strictAdapter: usesStrictAdapter }),
          compareFact({ key: "price", localFact: localFacts?.price, sourceFact: source.price, strictAdapter: usesStrictAdapter }),
          compareFact({ key: "productionTerm", localFact: localFacts?.productionTerm, sourceFact: source.productionTerm, strictAdapter: usesStrictAdapter }),
          compareFact({ key: "roomCount", localFact: localFacts?.roomCount, sourceFact: source.roomCount, strictAdapter: usesStrictAdapter }),
          compareFact({ key: "bedrooms", localFact: localFacts?.bedrooms, sourceFact: source.bedrooms, strictAdapter: usesStrictAdapter }),
          compareFact({ key: "floors", localFact: localFacts?.floors, sourceFact: source.floors, strictAdapter: usesStrictAdapter }),
          compareFact({ key: "dimensions", localFact: localFacts?.dimensions, sourceFact: source.dimensions, strictAdapter: usesStrictAdapter }),
          ...(source.technology ? [compareFact({ key: "technology", localFact: localFacts?.technology, sourceFact: source.technology, strictAdapter: usesStrictAdapter })] : []),
          ...(source.insulation ? [compareFact({ key: "insulation", localFact: localFacts?.insulation, sourceFact: source.insulation, strictAdapter: usesStrictAdapter })] : []),
          ...(source.completion ? [compareFact({ key: "completion", localFact: localFacts?.completion, sourceFact: source.completion, strictAdapter: usesStrictAdapter })] : []),
          ...source.conflicts.map((conflict) => ({
            field: conflict.field,
            severity: "warning",
            code: "upstream-source-conflict",
            message: `${conflict.evidence} Значения: ${conflict.values.join(" / ")}.`,
          })),
        ].filter(Boolean);

        if (usesStrictAdapter && localFacts?.media && localFacts.media.publishedImageCount !== source.media.publishedImageCount) {
          issues.push({
            field: "media",
            severity: "error",
            code: "media-count-mismatch",
            message: `Локальный аудит: ${localFacts.media.publishedImageCount}; официальный источник: ${source.media.publishedImageCount}.`,
          });
        }
        if (!localFacts?.media) {
          issues.push({ field: "media", severity: "error", code: "missing-local-media-audit", message: "Полнота галереи локально не зафиксирована." });
        }
        if (usesStrictAdapter && project.gallery.length < Math.min(source.media.publishedImageCount, 8)) {
          issues.push({
            field: "media",
            severity: "error",
            code: "local-gallery-too-small",
            message: `В карточке ${project.gallery.length} изображений, в источнике ${source.media.publishedImageCount}.`,
          });
        }
        if (!usesStrictAdapter && source.media.publishedImageCount > project.gallery.length) {
          issues.push({
            field: "media",
            severity: "warning",
            code: "generic-gallery-coverage-review",
            message: `В карточке ${project.gallery.length} изображений; универсальный адаптер нашёл на странице ${source.media.publishedImageCount} графических файлов, включая возможные служебные.`,
          });
        }

        return { id: project.id, name: project.name, sourceUrl: project.sourceUrl, source, issues };
      } catch (error) {
        return {
          id: project.id,
          name: project.name,
          sourceUrl: project.sourceUrl,
          source: null,
          issues: [{
            severity: usesStrictAdapter ? "error" : "warning",
            code: "source-fetch-or-parse-failed",
            message: error instanceof Error ? error.message : String(error),
          }],
        };
      }
    });

    if (manufacturerId === "platforma") {
      const contactsHtml = await fetchHtml("https://platforma-modul.ru/contacts");
      const visibleText = contactsHtml.replace(/<[^>]+>/gu, " ").replace(/\s+/gu, " ");
      const officialPhone = visibleText.match(/\+7\s*\(?(\d{3})\)?\s*(\d{3})[-\s]*(\d{2})[-\s]*(\d{2})/u);
      const normalizedOfficialPhone = officialPhone
        ? `+7 (${officialPhone[1]}) ${officialPhone[2]}-${officialPhone[3]}-${officialPhone[4]}`
        : null;
      if (normalizedOfficialPhone && maker.phone !== normalizedOfficialPhone) {
        manufacturerIssues.push({ severity: "error", code: "phone-mismatch", message: `Локально «${maker.phone}», официальный сайт «${normalizedOfficialPhone}».` });
      }
    }

    const errors = [...manufacturerIssues, ...projectReports.flatMap((project) => project.issues)]
      .filter((issue) => issue.severity === "error").length;
    const warnings = [...manufacturerIssues, ...projectReports.flatMap((project) => project.issues)]
      .filter((issue) => issue.severity === "warning").length;
    report.manufacturers.push({
      id: manufacturerId,
      expectedProjectCount: maker.profile?.sourceAudit?.catalog.expectedProjectCount ?? null,
      localProjectCount: manufacturerProjects.length,
      discoveredProjectCount: discoveredProjectUrls.length,
      issues: manufacturerIssues,
      projects: projectReports,
      summary: { errors, warnings },
    });
    report.summary.projects += manufacturerProjects.length;
    report.summary.errors += errors;
    report.summary.warnings += warnings;
  }

  report.summary.manufacturers = report.manufacturers.length;
  const json = `${JSON.stringify(report, null, 2)}\n`;
  if (shouldWrite) {
    await mkdir("outputs", { recursive: true });
    await writeFile("outputs/manufacturer-source-audit.json", json, "utf8");
  }

  for (const manufacturer of report.manufacturers) {
    console.log(`${manufacturer.id}: ${manufacturer.localProjectCount} проектов, ${manufacturer.summary.errors} ошибок, ${manufacturer.summary.warnings} предупреждений`);
    for (const issue of manufacturer.issues) console.log(`  [${issue.severity}] ${issue.code}: ${issue.message}`);
    for (const project of manufacturer.projects.filter((item) => item.issues.length > 0)) {
      console.log(`  ${project.id} ${project.name}`);
      for (const issue of project.issues) console.log(`    [${issue.severity}] ${issue.code}: ${issue.message}`);
    }
  }
  if (shouldWrite) console.log("Отчёт: outputs/manufacturer-source-audit.json");
  if (strict && report.summary.errors > 0) process.exitCode = 1;
} finally {
  await vite.close();
}
