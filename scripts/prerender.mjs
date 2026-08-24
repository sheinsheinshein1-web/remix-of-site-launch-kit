// Prerender SPA after `vite build`.
// 1. Spins up a static server over dist/ with SPA fallback.
// 2. Loads each URL in headless Chromium, waits for React Helmet to flush head tags.
// 3. Writes dist/<path>/index.html with the rendered HTML.
// 4. Regenerates dist/sitemap.xml from the same URL list.
//
// Routes are derived from src/data/projects.ts (single source of truth) +
// a small set of static routes from src/App.tsx.

import { chromium } from "@playwright/test";
import ts from "typescript";
import { createServer } from "node:http";
import { readFile, writeFile, mkdir, readFileSync } from "node:fs";
import { promisify } from "node:util";
import { dirname, extname, join, resolve } from "node:path";
import { existsSync, readFileSync as readSync } from "node:fs";

const readFileP = promisify(readFile);
const writeFileP = promisify(writeFile);
const mkdirP = promisify(mkdir);

const DIST = resolve("dist");
const SRC_PROJECTS = resolve("src/data/projects.ts");
const SRC_REGIONAL = resolve("src/data/regionalBatchProjects.ts");
const SRC_CATEGORIES = resolve("src/data/categoryLinks.ts");
const SRC_PARTNER_SERVICES = resolve("src/data/partnerServices.ts");
const SRC_VISIBILITY = resolve("src/data/catalogVisibility.ts");
const PUBLIC_SITEMAP = resolve("public/sitemap.xml");
const LEGACY_REDIRECTS_FILE = join(DIST, "legacy-redirects.caddy");
const SITE_URL = "https://многоместа.рф";
const PORT = 4173;
const NOT_FOUND_RENDER_ROUTE = "/__not-found__";

const normalizeSitePath = (path) => {
  const rawPath = (path || "/").trim();
  const withoutHash = rawPath.split("#")[0] || "/";
  const [rawPathname, rawSearch = ""] = withoutHash.split("?");
  const pathname = rawPathname || "/";
  const withLeadingSlash = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const isFile = /\.[a-z0-9]+$/i.test(withLeadingSlash);
  const normalizedPathname = withLeadingSlash === "/" || withLeadingSlash.endsWith("/") || isFile
    ? withLeadingSlash
    : `${withLeadingSlash}/`;
  const search = rawSearch ? `?${rawSearch}` : "";

  return `${normalizedPathname}${search}`;
};

const buildSiteUrl = (path) => `${SITE_URL}${normalizeSitePath(path)}`;
const escapeXml = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

const parseSource = (fileName, source) => ts.createSourceFile(
  fileName,
  source,
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TS,
);

const getObjectProperty = (object, propertyName) => object.properties.find((property) =>
  ts.isPropertyAssignment(property)
  && ((ts.isIdentifier(property.name) && property.name.text === propertyName)
    || (ts.isStringLiteral(property.name) && property.name.text === propertyName)),
);

const stringValue = (expression) => ts.isStringLiteralLike(expression) ? expression.text : undefined;
const numberValue = (expression) => ts.isNumericLiteral(expression) ? Number(expression.text) : undefined;

const collectMakerIds = (sourceFile) => {
  const makerIds = new Map();
  const visit = (node) => {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && ts.isObjectLiteralExpression(node.initializer)) {
      const idProperty = getObjectProperty(node.initializer, "id");
      const id = idProperty ? stringValue(idProperty.initializer) : undefined;
      if (id) makerIds.set(node.name.text, id);
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  return makerIds;
};

const makerIdFromProject = (project, makerIds) => {
  const makerProperty = getObjectProperty(project, "maker");
  if (!makerProperty) return undefined;
  const maker = makerProperty.initializer;
  if (ts.isIdentifier(maker)) return makerIds.get(maker.text);
  if (!ts.isObjectLiteralExpression(maker)) return undefined;

  const inlineId = getObjectProperty(maker, "id");
  if (inlineId) return stringValue(inlineId.initializer);
  const spread = maker.properties.find((property) => ts.isSpreadAssignment(property) && ts.isIdentifier(property.expression));
  return spread && ts.isSpreadAssignment(spread) && ts.isIdentifier(spread.expression)
    ? makerIds.get(spread.expression.text)
    : undefined;
};

const transliterationMap = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z",
  и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
  с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts", ч: "ch", ш: "sh", щ: "sch",
  ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
};

const transliterateSlug = (value) => value
  .trim()
  .toLocaleLowerCase("ru")
  .split("")
  .map((character) => transliterationMap[character] ?? character)
  .join("")
  .normalize("NFKD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "")
  .replace(/-{2,}/g, "-");

const sourceValue = (expression) => stringValue(expression) ?? numberValue(expression);

const buildProjectPath = ({ id, name, area, makerId, technology }) => {
  const category = technology.toLocaleLowerCase("ru").includes("префаб")
    ? "prefab-doma"
    : "modulnye-doma";
  const parsedArea = Number.parseFloat(String(area).replace(",", "."));
  const areaSlug = Number.isFinite(parsedArea) ? `${Math.round(parsedArea)}-m2` : "";
  const slug = [transliterateSlug(makerId), transliterateSlug(name), areaSlug, String(id)]
    .filter(Boolean)
    .join("-");
  return `/${category}/proekty/${slug}/`;
};

const collectPublicProjectRoutes = ({ sourceFile, arrayName, makerIds, hiddenTechnologies }) => {
  const projects = [];
  const publicMakerIds = [];

  const visit = (node) => {
    if (!ts.isVariableDeclaration(node) || !ts.isIdentifier(node.name) || node.name.text !== arrayName || !ts.isArrayLiteralExpression(node.initializer)) {
      ts.forEachChild(node, visit);
      return;
    }

    for (const element of node.initializer.elements) {
      const project = ts.isObjectLiteralExpression(element)
        ? element
        : ts.isCallExpression(element) && element.arguments[0] && ts.isObjectLiteralExpression(element.arguments[0])
          ? element.arguments[0]
          : undefined;
      if (!project) continue;

      const idProperty = getObjectProperty(project, "id");
      const nameProperty = getObjectProperty(project, "name");
      const technologyProperty = getObjectProperty(project, "technology");
      const areaM2Property = getObjectProperty(project, "area_m2");
      const areaProperty = getObjectProperty(project, "area");
      const id = idProperty ? numberValue(idProperty.initializer) : undefined;
      const name = nameProperty ? stringValue(nameProperty.initializer) : undefined;
      const technology = technologyProperty ? stringValue(technologyProperty.initializer) : undefined;
      const area = areaM2Property
        ? sourceValue(areaM2Property.initializer)
        : areaProperty
          ? sourceValue(areaProperty.initializer)
          : undefined;
      const makerId = makerIdFromProject(project, makerIds);
      if (!id || !name || !technology || !makerId || hiddenTechnologies.has(technology)) continue;

      projects.push({ id, name, technology, area: area ?? "", makerId });
      publicMakerIds.push(makerId);
    }
  };

  visit(sourceFile);
  return { projects, makerIds: publicMakerIds };
};

// ---------- 1. Build URL list ----------
const projectsSrc = readSync(SRC_PROJECTS, "utf8");
const regionalSrc = existsSync(SRC_REGIONAL) ? readSync(SRC_REGIONAL, "utf8") : "";
const visibilitySrc = existsSync(SRC_VISIBILITY) ? readSync(SRC_VISIBILITY, "utf8") : "";
const hiddenTechnologies = new Set(
  [...visibilitySrc.matchAll(/HIDDEN_PUBLIC_TECHNOLOGIES\s*=\s*\[([^\]]*)\]/gs)]
    .flatMap((match) => [...match[1].matchAll(/["']([^"']+)["']/g)].map((value) => value[1])),
);
const projectsFile = parseSource(SRC_PROJECTS, projectsSrc);
const regionalFile = parseSource(SRC_REGIONAL, regionalSrc);
const makerIdMap = new Map([...collectMakerIds(projectsFile), ...collectMakerIds(regionalFile)]);
const primaryRoutes = collectPublicProjectRoutes({
  sourceFile: projectsFile,
  arrayName: "allProjects",
  makerIds: makerIdMap,
  hiddenTechnologies,
});
const regionalRoutes = collectPublicProjectRoutes({
  sourceFile: regionalFile,
  arrayName: "regionalBatchProjects",
  makerIds: makerIdMap,
  hiddenTechnologies,
});
const projectRecords = [...new Map(
  [...primaryRoutes.projects, ...regionalRoutes.projects].map((project) => [project.id, project]),
).values()];
const makerIds = [...new Set([...primaryRoutes.makerIds, ...regionalRoutes.makerIds])];

const SRC_REGIONS = resolve("src/data/regions.ts");
const regionsSrc = existsSync(SRC_REGIONS) ? readSync(SRC_REGIONS, "utf8") : "";
const regionSlugs = [...new Set([...regionsSrc.matchAll(/slug:\s*["']([^"']+)["']/g)].map((m) => m[1]))];
const categoriesSrc = existsSync(SRC_CATEGORIES) ? readSync(SRC_CATEGORIES, "utf8") : "";
const categoryRoutes = [...new Set(
  [...categoriesSrc.matchAll(/href:\s*([`"'])(.*?)\1/g)]
    .map((match) => match[2].replace("${CATALOG_PATH}", "/modulnye-doma/")),
)];
const partnerServicesSrc = existsSync(SRC_PARTNER_SERVICES) ? readSync(SRC_PARTNER_SERVICES, "utf8") : "";
const partnerServiceRoutes = [...new Set([...partnerServicesSrc.matchAll(/path:\s*["']([^"']+)["']/g)].map((m) => m[1]))];

const staticRoutes = [
  "/",
  "/modulnye-doma/",
  "/categories/",
  "/proizvoditeli/",
  "/regiony-dostavki/",
  "/articles/",
  "/articles/kak-vybrat-modulnyy-dom/",
  "/articles/iz-chego-skladyvaetsya-tsena/",
  "/articles/karkasnyy-ili-modulnyy-dom/",
  "/partner/",
  "/legal/",
  "/legal/rules/",
  "/legal/terms/",
  "/legal/privacy/",
  "/legal/cookies/",
];
const projectRoutes = projectRecords.map(buildProjectPath);
const partnerRoutes = makerIds.map((id) => `/proizvoditeli/${id}/`);
const regionRoutes = regionSlugs.map((slug) => `/modulnye-doma/${slug}/`);

const ROUTES = [...new Set([...staticRoutes, ...partnerServiceRoutes, ...projectRoutes, ...partnerRoutes, ...regionRoutes])];
const SITEMAP_ROUTES = [...new Set([...ROUTES, ...categoryRoutes])];
const RENDER_ROUTES = [...ROUTES, NOT_FOUND_RENDER_ROUTE];
console.log(`[prerender] ${ROUTES.length} routes (${staticRoutes.length} static, ${partnerServiceRoutes.length} partner services, ${projectRoutes.length} projects, ${partnerRoutes.length} partners, ${regionRoutes.length} regions)`);

if (process.env.PRERENDER_LIST_ONLY === "1") {
  console.log(JSON.stringify({ routes: ROUTES, sitemapRoutes: SITEMAP_ROUTES }));
  process.exit(0);
}

// ---------- 2. Tiny static server with SPA fallback ----------
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript",
  ".mjs": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".map": "application/json",
  ".xml": "application/xml",
  ".txt": "text/plain",
};

const indexHtml = await readFileP(join(DIST, "index.html"));

const server = createServer(async (req, res) => {
  try {
    const urlPath = decodeURIComponent(req.url.split("?")[0]);
    const filePath = join(DIST, urlPath);
    const ext = extname(urlPath);
    if (ext && existsSync(filePath)) {
      const body = await readFileP(filePath);
      res.writeHead(200, { "content-type": MIME[ext] ?? "application/octet-stream" });
      res.end(body);
      return;
    }
    // SPA fallback
    res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    res.end(indexHtml);
  } catch (e) {
    res.writeHead(500);
    res.end(String(e));
  }
});

await new Promise((r) => server.listen(PORT, r));
console.log(`[prerender] server up on http://127.0.0.1:${PORT}`);

// ---------- 3. Render with Playwright ----------
const browser = await chromium.launch();
const ctx = await browser.newContext({ userAgent: "PrerenderBot/1.0 (+mnogomesta)" });

let ok = 0;
let fail = 0;

for (const route of RENDER_ROUTES) {
  const page = await ctx.newPage();
  const url = `http://127.0.0.1:${PORT}${route}`;
  try {
    // В карточках производителей есть внешняя карта. Её фоновые запросы не
    // должны блокировать генерацию уже готового HTML страницы.
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30_000 });
    // Wait until Helmet has injected JSON-LD — a real signal that meta tags are flushed.
    await page.waitForFunction(
      () => !!document.querySelector('script[type="application/ld+json"]'),
      null,
      { timeout: 10_000 }
    ).catch(() => {});
    // small buffer for trailing helmet writes
    await page.waitForTimeout(150);

    const html = await page.content();

    // Resolve target file path
    const cleanRoute = route === "/" ? "/index" : route;
    const outPath = join(DIST, cleanRoute, "index.html");
    if (route === NOT_FOUND_RENDER_ROUTE) {
      // Keep the server response status at 404 while reusing the shared React
      // NotFound page instead of maintaining a second, visually divergent page.
      await writeFileP(join(DIST, "404.html"), html);
    } else if (route === "/") {
      await writeFileP(join(DIST, "index.html"), html);
    } else {
      await mkdirP(dirname(outPath), { recursive: true });
      await writeFileP(outPath, html);
    }
    ok++;
    if (ok % 25 === 0) console.log(`[prerender] ${ok}/${RENDER_ROUTES.length}…`);
  } catch (e) {
    fail++;
    console.warn(`[prerender] FAIL ${route}: ${e.message}`);
  } finally {
    await page.close();
  }
}

await browser.close();
server.close();
console.log(`[prerender] done. ok=${ok} fail=${fail}`);

// ---------- 4. Generate server-side redirects for legacy public URLs ----------
const redirectLines = [
  "# Generated by scripts/prerender.mjs. Do not edit manually.",
  "# Keep these redirects before the public file_server handler.",
];
const redirectSources = new Set();

const addLegacyRedirect = (sourcePath, targetPath) => {
  const normalizedSource = sourcePath === "/" ? sourcePath : sourcePath.replace(/\/+$/, "");
  const sourceVariants = normalizedSource === "/"
    ? [normalizedSource]
    : [normalizedSource, `${normalizedSource}/`];

  for (const sourceVariant of sourceVariants) {
    if (sourceVariant === targetPath || redirectSources.has(sourceVariant)) continue;
    redirectSources.add(sourceVariant);
    redirectLines.push(`redir ${sourceVariant} ${targetPath}{?query} permanent`);
  }
};

addLegacyRedirect("/catalog", "/modulnye-doma/");
addLegacyRedirect("/regions", "/regiony-dostavki/");
addLegacyRedirect("/manufacturers", "/proizvoditeli/");
addLegacyRedirect("/privacy", "/legal/privacy/");

for (const project of projectRecords) {
  addLegacyRedirect(`/project/${project.id}`, buildProjectPath(project));
}
for (const slug of regionSlugs) {
  addLegacyRedirect(`/region/${slug}`, `/modulnye-doma/${slug}/`);
}
for (const makerId of makerIds) {
  addLegacyRedirect(`/partner/${makerId}`, `/proizvoditeli/${makerId}/`);
  addLegacyRedirect(`/partner/${makerId}/reviews`, `/proizvoditeli/${makerId}/otzyvy/`);
}

await writeFileP(LEGACY_REDIRECTS_FILE, `${redirectLines.join("\n")}\n`);
console.log(`[prerender] legacy redirects: ${redirectSources.size}`);

// ---------- 5. Regenerate sitemap.xml ----------
const lastmod = new Date().toISOString().slice(0, 10);
const sitemapEntries = SITEMAP_ROUTES.map((p) => {
  const isProject = p.includes("/proekty/");
  const isRegion = p.startsWith("/modulnye-doma/") && !isProject;
  const priority = p === "/" ? "1.0" : p.startsWith("/modulnye-doma/?") ? "0.8" : isProject ? "0.8" : isRegion ? "0.8" : p.startsWith("/proizvoditeli/") ? "0.7" : "0.6";
  const changefreq = p === "/" || p === "/modulnye-doma/" ? "weekly" : "monthly";
  return `  <url>\n    <loc>${escapeXml(encodeURI(buildSiteUrl(p)))}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}).join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries}\n</urlset>\n`;
await writeFileP(join(DIST, "sitemap.xml"), sitemap);
await writeFileP(PUBLIC_SITEMAP, sitemap);
console.log(`[prerender] sitemap.xml: ${SITEMAP_ROUTES.length} urls`);

process.exit(fail > 0 ? 1 : 0);
