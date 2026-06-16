// Prerender SPA after `vite build`.
// 1. Spins up a static server over dist/ with SPA fallback.
// 2. Loads each URL in headless Chromium, waits for React Helmet to flush head tags.
// 3. Writes dist/<path>/index.html with the rendered HTML.
// 4. Regenerates dist/sitemap.xml from the same URL list.
//
// Routes are derived from src/data/projects.ts (single source of truth) +
// a small set of static routes from src/App.tsx.

import { chromium } from "@playwright/test";
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
const SITE_URL = "https://многоместа.рф";
const PORT = 4173;

// ---------- 1. Build URL list ----------
const projectsSrc = readSync(SRC_PROJECTS, "utf8");
const regionalSrc = existsSync(SRC_REGIONAL) ? readSync(SRC_REGIONAL, "utf8") : "";
const combinedSrc = projectsSrc + "\n" + regionalSrc;
const projectIds = [...new Set([...combinedSrc.matchAll(/^\s+id:\s*(\d+),/gm)].map((m) => Number(m[1])))];
const makerIds = [...new Set([...combinedSrc.matchAll(/^\s+id:\s*["']([^"']+)["'],/gm)].map((m) => m[1]))];

const staticRoutes = ["/", "/catalog", "/categories", "/partner", "/privacy"];
const projectRoutes = projectIds.map((id) => `/project/${id}`);
const partnerRoutes = makerIds.map((id) => `/partner/${id}`);

const ROUTES = [...new Set([...staticRoutes, ...projectRoutes, ...partnerRoutes])];
console.log(`[prerender] ${ROUTES.length} routes (${staticRoutes.length} static, ${projectRoutes.length} projects, ${partnerRoutes.length} partners)`);

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

for (const route of ROUTES) {
  const page = await ctx.newPage();
  const url = `http://127.0.0.1:${PORT}${route}`;
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 30_000 });
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
    if (route === "/") {
      await writeFileP(join(DIST, "index.html"), html);
    } else {
      await mkdirP(dirname(outPath), { recursive: true });
      await writeFileP(outPath, html);
    }
    ok++;
    if (ok % 25 === 0) console.log(`[prerender] ${ok}/${ROUTES.length}…`);
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

// ---------- 4. Regenerate sitemap.xml ----------
const lastmod = new Date().toISOString().slice(0, 10);
const sitemapEntries = ROUTES.map((p) => {
  const priority = p === "/" ? "1.0" : p.startsWith("/project/") ? "0.8" : p.startsWith("/partner/") ? "0.7" : "0.6";
  const changefreq = p === "/" || p === "/catalog" ? "weekly" : "monthly";
  return `  <url>\n    <loc>${SITE_URL}${p}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}).join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries}\n</urlset>\n`;
await writeFileP(join(DIST, "sitemap.xml"), sitemap);
console.log(`[prerender] sitemap.xml: ${ROUTES.length} urls`);

process.exit(fail > 0 ? 1 : 0);
