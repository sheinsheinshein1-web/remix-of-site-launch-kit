import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { createRequire } from "node:module";
import { z } from "zod";
import { publicUrlSchema, type ScoutCandidate } from "../../src/features/agent-office/runtime-contract";
import { rawProjectSchema, type RawProject, type CollectorResult } from "../../src/features/agent-office/collector-contract";

// The installed jsdom dependency is used only for inert HTML parsing, never scripts/resources.
interface HtmlElement {
  textContent: string | null; tagName: string; parentElement: HtmlElement | null;
  getAttribute(name: string): string | null; closest(selector: string): HtmlElement | null;
  querySelector(selector: string): HtmlElement | null; querySelectorAll(selector: string): Iterable<HtmlElement>;
}
const { JSDOM, VirtualConsole } = createRequire(import.meta.url)("jsdom") as {
  JSDOM: new (html: string, options: { virtualConsole: unknown }) => { window: { document: HtmlElement & { body: HtmlElement } } };
  VirtualConsole: new () => unknown;
};
const categorySchema = z.object({ id: z.number(), name: z.string(), link: publicUrlSchema }).passthrough();
const productSchema = z.object({
  id: z.number(), name: z.string(), permalink: publicUrlSchema, description: z.string(), short_description: z.string(),
  categories: z.array(categorySchema), attributes: z.array(z.object({ name: z.string(), terms: z.array(z.object({ name: z.string() }).passthrough()) }).passthrough()),
  images: z.array(z.object({ src: publicUrlSchema, alt: z.string().optional(), srcset: z.string().optional() }).passthrough()),
}).passthrough();
type Product = z.infer<typeof productSchema>;
const dom = (html: string) => new JSDOM(html, { virtualConsole: new VirtualConsole() }).window.document;
const text = (node: HtmlElement | null) => node?.textContent?.trim() ?? "";
const categoryType = (name: string) => /модульн/i.test(name) ? /бан/i.test(name) ? "баня" : /дом/i.test(name) ? "дом" : null : null;
export const canonicalUrl = (value: string) => { const u = new URL(value); u.hash = ""; return u.href.replace(/%[a-f\d]{2}/gi, m => m.toUpperCase()).replace(/\/$/, ""); };

export function parseOfficialProduct(product: Product, html: string, apiUrl: string, snapshot: string): RawProject {
  const url = product.permalink, page = dom(html), description = dom(product.description);
  const plain = (html: string) => text(dom(html).body);
  const fact = (value: string | null, sourceUrl = url) => ({ value: value || null, sourceUrl });
  const characteristics = product.attributes.map(a => ({ label: a.name, value: a.terms.map(t => t.name).join("; "), sourceUrl: apiUrl }));
  const tables = [...description.querySelectorAll("table")].map(table => ({
    headers: [...table.querySelectorAll("thead th")].map(text),
    rows: [...table.querySelectorAll("tr")].map(tr => [...tr.querySelectorAll("th,td")].map(text)), sourceUrl: url,
  }));
  for (const table of tables) for (const row of table.rows) if (row.length === 2) characteristics.push({ label: row[0], value: row[1], sourceUrl: url });
  const sections: RawProject["sections"] = [];
  let heading: string | null = null;
  for (const el of description.querySelectorAll("h1,h2,h3,h4,p,li")) {
    if (/^H/.test(el.tagName)) heading = text(el);
    else if (text(el)) sections.push({ heading, text: text(el), sourceUrl: url });
  }
  const short = plain(product.short_description);
  if (short) sections.unshift({ heading: "short_description", text: short, sourceUrl: apiUrl });
  const attribute = (re: RegExp) => { const a = characteristics.find(a => re.test(a.label)); return a ? fact(a.value, a.sourceUrl) : null; };
  const passage = (re: RegExp) => {
    const a = characteristics.find(a => re.test(a.value)); if (a) return fact(a.value, a.sourceUrl);
    const p = sections.find(s => re.test(s.text)); return p ? fact(p.text, p.sourceUrl) : fact(null);
  };
  const photos: NonNullable<RawProject["photos"]> = [];
  const addImage = (value: string | null, sourceUrl: string, alt: string | null, srcset: string | null) => {
    if (!value) return;
    let resolved: string; try { resolved = new URL(value, url).href; } catch { return; }
    if (!publicUrlSchema.safeParse(resolved).success || /\.svg(?:\?|$)/i.test(resolved)) return;
    if (!photos.some(p => p.url === resolved)) photos.push({ url: resolved, sourceUrl, alt, srcset });
  };
  for (const img of product.images) addImage(img.src, apiUrl, img.alt ?? null, img.srcset ?? null);
  for (const img of page.querySelectorAll('.wp-block-woocommerce-product-gallery img, .woocommerce-product-gallery img, #tab-description img')) {
    const anchor = img.closest("a[href]")?.getAttribute("href");
    addImage(anchor && /\.(png|jpe?g|webp|avif)(?:\?|$)/i.test(anchor) ? anchor : img.getAttribute("data-large_image") ?? img.getAttribute("src"), url, img.getAttribute("alt"), img.getAttribute("srcset"));
  }
  const variationsText = page.querySelector("[data-product_variations]")?.getAttribute("data-product_variations");
  const variations = variationsText ? JSON.parse(variationsText) : null;
  const configurationHeading = [...description.querySelectorAll("h2,h3")].find(h => /^Комплектаци/i.test(text(h)));
  const configurationText = configurationHeading?.parentElement ? text(configurationHeading.parentElement) : null;
  const fields = {
    name: fact(plain(product.name), apiUrl), type: fact(product.categories.map(c => categoryType(c.name)).find(Boolean) ?? null, apiUrl),
    price: fact(text(page.querySelector(".wp-block-woocommerce-product-price, .summary .price"))),
    area: attribute(/^Площадь(?: дома)?$/i) ?? fact(null),
    floors: attribute(/этаж/i) ?? passage(/(?:\d+|одно|двух|тр[её]х)[ -]?этаж|этажность/i),
    bedrooms: attribute(/^спаль/i) ?? passage(/спальн/i),
    bathrooms: attribute(/^сануз|^ванн/i) ?? passage(/(?:^|[^а-яё])(?:сануз[а-яё]*|ванн(?:ая|ую|ой|ые|ых)\s+комнат)/i),
    dimensions: attribute(/^Габарит|^Дом$/i) ?? fact(null),
    manufacturingTime: attribute(/срок.*(?:изготов|производ)/i) ?? passage(/(?:собирается|изготавливаем|производство|изготовлен).{0,70}(?:\d+\s*(?:месяц|недел|дн|ден))/i),
    technology: attribute(/^технолог|^каркас$/i) ?? passage(/каркас|технолог/i),
    configuration: configurationText ? fact(configurationText) : attribute(/^комплектац/i) ?? fact(null), description: fact(plain(product.description)),
  };
  return rawProjectSchema.parse({ officialPage: url, sourceProductId: product.id, ...fields,
    photos: photos.length ? photos : null, characteristics, tables, sections,
    variations: Array.isArray(variations) ? { value: variations, sourceUrl: url } : null,
    rawOfficialProduct: { value: product, sourceUrl: apiUrl }, pageSnapshot: snapshot,
    missingFields: Object.entries(fields).filter(([,f]) => f.value === null).map(([k]) => k).concat(photos.length ? [] : ["photos"]),
  });
}

export interface CollectorProvider {
  collect(input: { manufacturer: ScoutCandidate; directory: string; signal: AbortSignal; onSource: (url: string) => Promise<void>; onProject: (project: RawProject) => Promise<void> }): Promise<Pick<CollectorResult, "projects" | "discoveredCount" | "parsedCount" | "coverage" | "failures" | "limitations" | "sources">>;
}

export function createOfficialCollector(): CollectorProvider {
  return { async collect({ manufacturer, directory, signal, onSource, onProject }) {
    const origin = new URL(manufacturer.officialWebsite).origin;
    // This initial adapter is deliberately confined to the selected official site.
    if (origin !== "https://ir365.ru") throw new Error("Для этого официального сайта ещё не подключён адаптер Сборщика данных");
    const sources: string[] = [], failures: { url: string; error: string }[] = [], limitations: string[] = [];
    const snapshots = join(directory, "sources"); await mkdir(snapshots, { recursive: true });
    const cache = new Map<string, { body: string; path: string; totalPages: number }>();
    const get = async (value: string) => {
      const u = new URL(value, origin);
      if (u.origin !== origin || u.username || u.password) throw new Error("Сборщик обращается только к официальному сайту");
      const key = canonicalUrl(u.href); const previous = cache.get(key); if (previous) return previous;
      let response: Awaited<ReturnType<typeof fetch>> | undefined;
      for (let attempt = 0; attempt < 2; attempt++) {
        try { response = await fetch(u, { signal: AbortSignal.any([signal, AbortSignal.timeout(30000)]), redirect: "manual", headers: { "User-Agent": "Mnogomesta-Collector/1.0" } }); break; }
        catch (error) { if (signal.aborted || attempt === 1) throw new Error(`${u.href}: ${error instanceof Error ? error.message : String(error)}`); }
      }
      if (!response) throw new Error(`Источник не ответил: ${u.href}`);
      if (response.status >= 300 && response.status < 400) throw new Error(`Редирект ${response.status}: ${response.headers.get("location")}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const body = await response.text(); if (body.length > 8_000_000) throw new Error("Источник превышает лимит 8 МБ");
      const path = `sources/${createHash("sha256").update(u.href).digest("hex").slice(0,20)}.txt`;
      await writeFile(join(directory, path), body, { mode: 0o600 });
      await writeFile(join(directory, `${path}.json`), JSON.stringify({ url: u.href, status: response.status, fetchedAt: new Date().toISOString(), contentType: response.headers.get("content-type") }), { mode: 0o600 });
      const data = { body, path, totalPages: Number(response.headers.get("x-wp-totalpages") ?? 1) };
      cache.set(key, data); sources.push(u.href); await onSource(u.href); return data;
    };
    const recordFailure = (url: string, error: unknown) => { if (signal.aborted) throw signal.reason; failures.push({ url, error: error instanceof Error ? error.message : String(error) }); };
    const home = await get(`${origin}/`);
    const categories = new Set<string>();
    for (const a of dom(home.body).querySelectorAll("a[href]")) if (/\/product-category\//.test(a.getAttribute("href") ?? "") && categoryType(text(a))) categories.add(new URL(a.getAttribute("href")!, origin).href);
    if (!categories.size) throw new Error("Не найдены официальные категории модульных домов и бань");
    const listings: string[] = [], discovered = new Set<string>();
    const queue = [...categories]; const seen = new Set<string>();
    while (queue.length) {
      const url = queue.shift()!; if (seen.has(canonicalUrl(url))) continue; seen.add(canonicalUrl(url));
      if (seen.size > 100) throw new Error("Превышен предел страниц категорий; полнота не подтверждена");
      try {
        const page = await get(url); listings.push(url);
        for (const a of dom(page.body).querySelectorAll("a[href]")) {
          const next = new URL(a.getAttribute("href")!, url); if (next.origin !== origin) continue;
          if (next.pathname.startsWith("/product/")) discovered.add(canonicalUrl(next.href));
          if (/\/page\/|[?&](?:paged|product-page|query-\d+-page)=/.test(next.href) && [...categories].some(c => next.pathname.startsWith(new URL(c).pathname))) queue.push(next.href);
        }
      } catch (error) { recordFailure(url, error); }
    }
    // Public official API pagination gives an independent inventory, including variants.
    const products = new Map<string, { product: Product; source: string }>();
    let pages = 1;
    for (let page = 1; page <= pages; page++) {
      const url = `${origin}/wp-json/wc/store/v1/products?per_page=100&page=${page}`;
      const response = await get(url); pages = response.totalPages;
      if (!Number.isInteger(pages) || pages < 1 || pages > 100) throw new Error("Некорректная пагинация официального API");
      for (const p of z.array(productSchema).parse(JSON.parse(response.body))) products.set(canonicalUrl(p.permalink), { product: p, source: url });
    }
    const wanted = [...products.values()].filter(p => p.product.categories.some(c => categoryType(c.name)));
    for (const { product } of wanted) discovered.add(canonicalUrl(product.permalink));
    const sitemapUrls: string[] = [];
    try {
      const robots = await get(`${origin}/robots.txt`); const index = robots.body.match(/^Sitemap:\s*(\S+)/im)?.[1];
      if (index) {
        const xml = await get(index); sitemapUrls.push(index);
        const maps = [...xml.body.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]).filter(u => /product[^/]*sitemap/i.test(u));
        for (const map of maps) {
          const xml = await get(map); sitemapUrls.push(map);
          for (const m of xml.body.matchAll(/<loc>(.*?)<\/loc>/g)) {
            const key = canonicalUrl(m[1]); const p = products.get(key);
            if (p?.product.categories.some(c => categoryType(c.name))) discovered.add(key);
            else if (new URL(m[1]).pathname.startsWith("/product/") && !p) failures.push({ url: m[1], error: "Страница sitemap отсутствует в API; принадлежность к целевому каталогу требует проверки" });
          }
        }
      } else limitations.push("В robots.txt не найден sitemap");
    } catch (error) { recordFailure(`${origin}/robots.txt`, error); }
    const projects: RawProject[] = [];
    for (const key of discovered) {
      const entry = products.get(key);
      if (!entry) { failures.push({ url: key, error: "Карточка из каталога отсутствует в официальном API" }); continue; }
      if (!entry.product.categories.some(c => categoryType(c.name))) continue;
      try {
        const page = await get(entry.product.permalink);
        // Check related-project links; unknown targets prevent claiming complete coverage.
        for (const a of dom(page.body).querySelectorAll('a[href]')) {
          const href: URL = new URL(a.getAttribute("href")!, origin); if (href.origin !== origin || !href.pathname.startsWith("/product/")) continue;
          const key = canonicalUrl(href.href), linked = products.get(key);
          if (linked?.product.categories.some(c => categoryType(c.name))) discovered.add(key);
          else if (!linked) failures.push({ url: href.href, error: "Связанный проект отсутствует в API" });
        }
        const parsed = parseOfficialProduct(entry.product, page.body, entry.source, page.path);
        projects.push(parsed); await onProject(parsed);
      } catch (error) { recordFailure(entry.product.permalink, error); }
    }
    limitations.push("Значения сохранены строками производителя без пересчёта единиц и редакторской обработки. Отсутствующие значения — null. Наличие санузла не преобразовано в выдуманное количество.", "Фотографии сохранены как официальные URL с источниками и srcset; бинарные файлы не скачивались.", "Сборщик использует детерминированный адаптер официального WooCommerce API и HTML. Другие сайты требуют отдельного адаптера.");
    return { projects, discoveredCount: discovered.size, parsedCount: projects.length, sources, failures, limitations,
      coverage: { catalogUrls: listings, productUrls: [...discovered], sitemapUrls, complete: failures.length === 0 && discovered.size === projects.length } };
  } };
}
