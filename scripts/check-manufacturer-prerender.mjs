import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const representativeProfiles = [
  { slug: "platforma", name: "Платформа", legalState: "data" },
  { slug: "bygge", name: "Bygge", legalState: "data" },
  { slug: "glavles", name: "Главлес", legalState: "data" },
  { slug: "budushiy-dom", name: "Будущий Дом", legalState: "data" },
  { slug: "bm-dom", name: "БМ-ДОМ", legalState: "unavailable" },
  { slug: "sq-modyl", name: "SQ-MODYL", legalState: "data" },
  { slug: "exmodule", name: "ExModule", legalState: "data" },
  { slug: "russian-modular-house", name: "Русский Модульный Дом", legalState: "data" },
  { slug: "da-home", name: "DA-HOME", legalState: "unavailable" },
  { slug: "moduldom-ural", name: "МОДУЛЬДОМ-УРАЛ", legalState: "unavailable" },
  { slug: "e-module-stroy", name: "E.Module-stroy", legalState: "unavailable" },
  { slug: "prefabia", name: "PREFABIA", legalState: "data" },
  { slug: "zhar-parych", name: "Жар Парыч", legalState: "data" },
];

const failures = [];
const sitemapPath = resolve("dist/sitemap.xml");
const sitemap = await readFile(sitemapPath, "utf8");
const manufacturerRoutes = [...sitemap.matchAll(/<loc>https:\/\/xn--80afg0abehb3ak\.xn--p1ai(\/proizvoditeli\/[^<]+\/)<\/loc>/g)]
  .map((match) => match[1]);

for (const route of manufacturerRoutes) {
  const slug = route.split("/").filter(Boolean).at(-1);
  const htmlPath = resolve(`dist/proizvoditeli/${slug}/index.html`);
  const html = await readFile(htmlPath, "utf8");
  const h1Count = html.match(/<h1\b/g)?.length ?? 0;

  if (h1Count !== 1) failures.push(`${route}: expected one H1, found ${h1Count}`);
  if (!html.includes(`rel="canonical" href="https://многоместа.рф${route}"`)) {
    failures.push(`${route}: self-referencing canonical is missing`);
  }
  if (!html.includes('"@type":"Organization"')) failures.push(`${route}: Organization JSON-LD is missing`);
  if (!html.includes('"@type":"WebPage"')) failures.push(`${route}: WebPage JSON-LD is missing`);
  if (!sitemap.includes(`https://xn--80afg0abehb3ak.xn--p1ai${route}`)) {
    failures.push(`${route}: route is missing from sitemap.xml`);
  }
}

for (const profile of representativeProfiles) {
  const route = `/proizvoditeli/${profile.slug}/`;
  const html = await readFile(resolve(`dist/proizvoditeli/${profile.slug}/index.html`), "utf8");
  const h1Html = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? "";
  const h1Text = h1Html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

  if (!h1Text.includes(profile.name)) failures.push(`${route}: manufacturer name is missing from H1`);
  if (!html.includes('id="manufacturer-legal-heading"')) {
    failures.push(`${route}: legal section is missing from prerendered HTML`);
  }
  const hasUnavailableLegalCopy = html.includes("Реквизиты не найдены") || html.includes("Реквизиты уточняются");
  if (profile.legalState === "data" && hasUnavailableLegalCopy) {
    failures.push(`${route}: verified legal data was replaced by an unavailable state`);
  }
  if (profile.legalState === "unavailable" && !hasUnavailableLegalCopy) {
    failures.push(`${route}: unavailable legal data is not identified as such`);
  }
}

if (failures.length > 0) {
  console.error(`[manufacturer-prerender] ${failures.length} failure(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`[manufacturer-prerender] ${manufacturerRoutes.length} manufacturer routes and ${representativeProfiles.length} representative profiles passed`);
}
