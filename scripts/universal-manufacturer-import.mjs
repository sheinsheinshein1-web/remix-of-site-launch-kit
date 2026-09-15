import { mkdir, writeFile } from "node:fs/promises";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { JSDOM, VirtualConsole } from "jsdom";
import { z } from "zod";
import { parseGenericProject } from "./manufacturer-source-adapters.mjs";

const UNKNOWN_STATUS = "not-published";
const IMPORT_USER_AGENT = "MnogomestaImporter/1.0 (+https://xn--80aaaa5cfdi5b.xn--p1ai)";

const parseDom = (html) => new JSDOM(html, { virtualConsole: new VirtualConsole() });

const evidenceFieldSchema = z.object({
  value: z.union([z.string(), z.number(), z.array(z.string())]).nullable(),
  status: z.enum(["verified", "derived", "not-published", "conflict"]),
  confidence: z.number().min(0).max(1),
  sourceUrl: z.string().url(),
  method: z.enum(["structured-data", "visible-text", "link", "media", "not-found"]),
  evidence: z.string().min(1),
});

const mediaSchema = z.object({
  url: z.string().url(),
  type: z.enum(["photo", "plan", "unknown"]),
  sourceUrl: z.string().url(),
});

export const importedProjectSchema = z.object({
  sourceUrl: z.string().url(),
  publicationStatus: z.enum(["draft", "review", "published"]).default("draft"),
  name: evidenceFieldSchema,
  productType: evidenceFieldSchema,
  price: evidenceFieldSchema,
  area: evidenceFieldSchema,
  dimensions: evidenceFieldSchema,
  roomCount: evidenceFieldSchema,
  bedrooms: evidenceFieldSchema,
  bathrooms: evidenceFieldSchema,
  floors: evidenceFieldSchema,
  productionTerm: evidenceFieldSchema,
  technology: evidenceFieldSchema,
  insulation: evidenceFieldSchema,
  completion: evidenceFieldSchema,
  media: z.array(mediaSchema),
  conflicts: z.array(z.object({
    field: z.string().min(1),
    values: z.array(z.string().min(1)).min(2),
    evidence: z.string().min(1),
  })),
});

export const importedManufacturerSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/u),
  publicationStatus: z.enum(["draft", "review", "published"]).default("draft"),
  identity: z.object({ name: evidenceFieldSchema, logo: evidenceFieldSchema }),
  contacts: z.object({
    siteUrl: z.string().url(),
    phones: evidenceFieldSchema,
    emails: evidenceFieldSchema,
    telegram: evidenceFieldSchema,
    youtube: evidenceFieldSchema,
  }),
  catalog: z.object({
    sourceUrl: z.string().url(),
    discoveredProjectCount: z.number().int().nonnegative(),
    expectedProjectCount: z.number().int().nonnegative().nullable().default(null),
  }),
  legal: z.object({ operator: evidenceFieldSchema, inn: evidenceFieldSchema, ogrn: evidenceFieldSchema }),
  production: z.object({ address: evidenceFieldSchema }),
  reviews: z.object({ externalProfile: evidenceFieldSchema }),
  builtObjects: z.object({ sourcePage: evidenceFieldSchema, media: z.array(mediaSchema) }),
});

const decode = (value = "") => value
  .replace(/&nbsp;|&#160;/giu, " ")
  .replace(/&quot;/giu, '"')
  .replace(/&amp;/giu, "&")
  .replace(/&#(\d+);/gu, (_, code) => String.fromCodePoint(Number(code)));

const normalizeWhitespace = (value = "") => decode(value).replace(/\s+/gu, " ").trim();
const htmlToText = (html = "") => normalizeWhitespace(String(html)
  .replace(/<script\b[\s\S]*?<\/script>/giu, " ")
  .replace(/<style\b[\s\S]*?<\/style>/giu, " ")
  .replace(/<[^>]+>/gu, " "));

const absoluteUrl = (value, baseUrl) => {
  if (typeof value !== "string" || !value.trim()) return null;
  try {
    const url = new URL(value, baseUrl);
    url.hash = "";
    return url.toString();
  } catch {
    return null;
  }
};

const canonicalSourceUrl = (value) => {
  const url = new URL(value);
  url.hash = "";
  url.search = "";
  url.pathname = url.pathname.replace(/\/+$/u, "") || "/";
  return url.toString();
};

const unique = (values) => [...new Set(values.filter(Boolean))];

const findStructuredEntity = (document, acceptedTypes) => {
  const matches = (node) => {
    const types = Array.isArray(node?.["@type"]) ? node["@type"] : [node?.["@type"]];
    return types.some((type) => acceptedTypes.includes(String(type)));
  };
  const walk = (node) => {
    if (!node || typeof node !== "object") return null;
    if (matches(node)) return node;
    if (Array.isArray(node)) {
      for (const item of node) {
        const found = walk(item);
        if (found) return found;
      }
      return null;
    }
    for (const value of Object.values(node)) {
      const found = walk(value);
      if (found) return found;
    }
    return null;
  };
  for (const script of document.querySelectorAll('script[type="application/ld+json"]')) {
    try {
      const found = walk(JSON.parse(script.textContent ?? ""));
      if (found) return found;
    } catch {
      // Invalid JSON-LD cannot be treated as evidence.
    }
  }
  return null;
};

const verified = (value, sourceUrl, method, evidence, confidence = 0.95) => ({
  value,
  status: "verified",
  confidence,
  sourceUrl,
  method,
  evidence,
});

const derived = (value, sourceUrl, method, evidence, confidence = 0.7) => ({
  value,
  status: "derived",
  confidence,
  sourceUrl,
  method,
  evidence,
});

const unknown = (sourceUrl, evidence) => ({
  value: null,
  status: UNKNOWN_STATUS,
  confidence: 1,
  sourceUrl,
  method: "not-found",
  evidence,
});

const sourceFactToEvidence = (fact, sourceUrl) => {
  if (!fact || fact.status === "not-published" || !fact.value) return unknown(sourceUrl, fact?.evidence ?? "Поле не найдено.");
  const method = fact.method === "media-name" ? "media" : fact.method;
  if (fact.status === "derived") return derived(fact.value, sourceUrl, method, fact.evidence);
  return {
    value: fact.value,
    status: fact.status === "conflict" ? "conflict" : "verified",
    confidence: fact.status === "conflict" ? 0.4 : fact.method === "structured-data" ? 0.98 : 0.92,
    sourceUrl,
    method,
    evidence: fact.evidence,
  };
};

export const detectSitePlatform = (html = "") => {
  const source = html.toLocaleLowerCase("en");
  if (source.includes("static.tildacdn.com") || source.includes("tilda-blocks")) return "tilda";
  if (source.includes("wp-content") || source.includes("woocommerce")) return "wordpress";
  if (source.includes("/bitrix/") || source.includes("bx-core")) return "bitrix";
  return "html";
};

export const extractSameOriginLinks = (html, sourceUrl) => {
  const dom = parseDom(html);
  const origin = new URL(sourceUrl).origin;
  return unique([...dom.window.document.querySelectorAll("a[href]")]
    .map((node) => absoluteUrl(node.getAttribute("href"), sourceUrl))
    .filter((url) => url && new URL(url).origin === origin));
};

export const extractSitemapLocations = (xml, sourceUrl) => unique(
  [...String(xml).matchAll(/<loc>([\s\S]*?)<\/loc>/giu)]
    .map((match) => normalizeWhitespace(match[1]).replace(/^<!\[CDATA\[/u, "").replace(/\]\]>$/u, ""))
    .map((value) => absoluteUrl(value, sourceUrl)),
);

const excludedPathPattern = /(?:\.(?:jpe?g|png|webp|gif|svg|pdf|xml)$|\/(?:tag|category|author|blog|news|novosti|contacts?|kontakty|about|o-nas|privacy|politika|offer|oferta|cart|korzina|checkout|search|feed|wp-json|wp-admin)(?:\/|$))/iu;
const projectPathPattern = /\/(?:project|projects|proekt|proekty|product|products|catalog|katalog|model|models|dom|doma|bani|bath|house)(?:\/|[-_])/iu;

export const scoreProjectUrl = (value, siteUrl) => {
  const url = new URL(value);
  if (url.origin !== new URL(siteUrl).origin || excludedPathPattern.test(url.pathname)) return -100;
  let score = projectPathPattern.test(url.pathname) ? 3 : 0;
  const segments = url.pathname.split("/").filter(Boolean);
  if (segments.length >= 2) score += 1;
  if (segments.length >= 3) score += 1;
  if (/\d/u.test(segments.at(-1) ?? "")) score += 1;
  if (url.search) score -= 1;
  return score;
};

const fetchPage = async (url) => {
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: { "user-agent": IMPORT_USER_AGENT },
        redirect: "follow",
        signal: AbortSignal.timeout(25_000),
      });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      return { url: response.url, body: await response.text(), contentType: response.headers.get("content-type") ?? "" };
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
};

const discoverSitemapUrls = async (siteUrl, fetcher) => {
  const origin = new URL(siteUrl).origin;
  const queue = [`${origin}/sitemap.xml`];
  const visited = new Set();
  const pages = [];
  while (queue.length && visited.size < 20 && pages.length < 5_000) {
    const sitemapUrl = queue.shift();
    if (!sitemapUrl || visited.has(sitemapUrl)) continue;
    visited.add(sitemapUrl);
    try {
      const response = await fetcher(sitemapUrl);
      const locations = extractSitemapLocations(response.body, response.url);
      for (const location of locations) {
        if (/\.xml(?:$|\?)/iu.test(new URL(location).pathname)) queue.push(location);
        else pages.push(location);
      }
    } catch {
      // A missing sitemap is normal; catalog links remain the fallback.
    }
  }
  return unique(pages);
};

const pageLooksLikeProject = (html, url) => {
  const h1 = htmlToText(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/iu)?.[1] ?? "");
  const text = htmlToText(html);
  const hasProductSchema = /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?"@type"\s*:\s*"Product"/iu.test(html);
  const hasMetric = /\b\d+(?:[.,]\d+)?\s*м[²2](?=\s|[.,;:)]|$)/iu.test(text);
  const projectWords = /дом|бан|house|bath|модул|проект/iu.test(`${h1} ${new URL(url).pathname}`);
  const collectionHeading = /^(?:проекты|каталог)(?:\s|$)|(?:дома|бани|комплексы)\s+под\s+ключ$|^(?:(?:одно|двух|тр[её]х|четыр[её]х)комнатные\s+)?модульные\s+(?:дома|бани)(?:\s+(?:до|от|для|с|в|под)|$)|^быстровозводимые\s+дома/iu.test(h1);
  const leaf = new URL(url).pathname.split("/").filter(Boolean).at(-1) ?? "";
  const collectionPath = /(?:^|[-_])(?:houses|homes|doma|domov|baths|bani)(?:$|[-_])/iu.test(leaf);
  return !collectionPath && (hasProductSchema || (Boolean(h1) && !collectionHeading && hasMetric && projectWords));
};

export const discoverProjectUrls = async ({ siteUrl, catalogUrl = siteUrl, knownProjectUrls = [], fetcher = fetchPage, limit = 500, transformConfirmed }) => {
  const [catalogPage, sitemapUrls] = await Promise.all([
    fetcher(catalogUrl),
    discoverSitemapUrls(siteUrl, fetcher),
  ]);
  const catalogLinks = extractSameOriginLinks(catalogPage.body, catalogPage.url);
  const catalogPath = new URL(catalogPage.url).pathname.replace(/\/+$/u, "") || "/";
  const belongsToCatalog = (url) => catalogPath === "/"
    || new URL(url).pathname === catalogPath
    || new URL(url).pathname.startsWith(`${catalogPath}/`);
  const rankedCandidates = unique([...knownProjectUrls, ...catalogLinks, ...sitemapUrls])
    .map((url) => ({ url, score: knownProjectUrls.includes(url) ? 100 : scoreProjectUrl(url, siteUrl) }))
    .filter((candidate) => knownProjectUrls.includes(candidate.url) || belongsToCatalog(candidate.url))
    .filter((candidate) => knownProjectUrls.includes(candidate.url) || canonicalSourceUrl(candidate.url) !== canonicalSourceUrl(catalogPage.url))
    .filter((candidate) => candidate.score >= 3)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  const confirmedByUrl = new Map();
  const rejected = [];
  let cursor = 0;
  const workers = Array.from({ length: Math.min(8, rankedCandidates.length) }, async () => {
    while (cursor < rankedCandidates.length) {
      const candidate = rankedCandidates[cursor];
      cursor += 1;
      try {
        const page = await fetcher(candidate.url);
        if (pageLooksLikeProject(page.body, page.url)) {
          const value = transformConfirmed ? await transformConfirmed({ url: page.url, html: page.body }) : { url: page.url, html: page.body };
          confirmedByUrl.set(canonicalSourceUrl(page.url), value);
        }
        else rejected.push({ url: candidate.url, reason: "Страница не прошла признаки карточки проекта." });
      } catch (error) {
        rejected.push({ url: candidate.url, reason: error instanceof Error ? error.message : String(error) });
      }
    }
  });
  await Promise.all(workers);
  const confirmed = [...confirmedByUrl.values()];
  return {
    platform: detectSitePlatform(catalogPage.body),
    catalogUrl: catalogPage.url,
    candidates: rankedCandidates.map((item) => item.url),
    confirmed,
    rejected,
  };
};

const inferProductType = (name, text, sourceUrl) => {
  const primary = `${name ?? ""} ${new URL(sourceUrl).pathname}`;
  if (/баня|бани|ban(?:i|ya|y)|bathhouse|sauna/iu.test(primary)) return derived("bath", sourceUrl, "visible-text", "Тип объекта определён по названию или рубрике официальной страницы бани.", 0.85);
  if (/дом|домов|dom(?:a|ov)?|house|коттедж/iu.test(primary)) return derived("house", sourceUrl, "visible-text", "Тип объекта определён по названию или рубрике официальной страницы дома.", 0.85);
  if (/баня|bathhouse|sauna/iu.test(text ?? "")) return derived("bath", sourceUrl, "visible-text", "Тип объекта определён по описанию официальной страницы бани.", 0.72);
  if (/дом|house|коттедж/iu.test(text ?? "")) return derived("house", sourceUrl, "visible-text", "Тип объекта определён по описанию официальной страницы дома.", 0.72);
  return unknown(sourceUrl, "Тип объекта не найден в явном виде.");
};

const inferTechnology = (name, text, sourceUrl) => {
  const primary = `${name ?? ""} ${new URL(sourceUrl).pathname}`;
  const fallback = (text ?? "").slice(0, 4_000);
  const classify = (sample) => {
    if (/сип(?:[-\s]?панел)|sip(?:[-_\s]?panel)/iu.test(sample)) return ["СИП-Префаб", "СИП-панелей"];
    if (/домокомплект|house[-_\s]?kit/iu.test(sample)) return ["Домокомплект", "домокомплекта"];
    if (/модульн|modul(?:e|ar|ny|nye|nyh)/iu.test(sample)) return ["Модульный дом", "модульной технологии"];
    if (/каркасн|karkasn|frame[-_\s]?(?:house|home)/iu.test(sample)) return ["Каркасный", "каркасной технологии"];
    return null;
  };
  const classification = classify(primary) ?? classify(fallback);
  if (classification) return derived(classification[0], sourceUrl, "visible-text", `Технология определена по явному упоминанию ${classification[1]}.`, 0.82);
  return unknown(sourceUrl, "Технология не опубликована в явном виде.");
};

const extractBathrooms = (html, sourceUrl) => {
  const text = htmlToText(html);
  const match = text.match(/(?:количество\s+)?санузл(?:ов|а)?\D{0,18}(\d+)/iu)
    ?? text.match(/(\d+)\s*санузл/iu);
  return match
    ? verified(match[1], sourceUrl, "visible-text", "Подписанное количество санузлов на странице проекта.")
    : unknown(sourceUrl, "Количество санузлов не опубликовано отдельным полем.");
};

const inferAreaFromName = (name, sourceUrl) => {
  const match = String(name ?? "").match(/(?:^|\s)(\d+(?:[.,]\d+)?)\s*м[²2](?:\s|$|[),])/iu);
  return match
    ? derived(`${match[1].replace(",", ".")} м²`, sourceUrl, "visible-text", "Площадь явно указана в названии официальной карточки.", 0.86)
    : unknown(sourceUrl, "Подписанное значение площади не найдено.");
};

export const extractProjectDraft = ({ html, sourceUrl }) => {
  const parsed = parseGenericProject({ manufacturerId: "universal", html, sourceUrl });
  const text = htmlToText(html);
  const name = sourceFactToEvidence(parsed.name, sourceUrl);
  if (typeof name.value === "string") name.value = htmlToText(name.value);
  const media = parsed.media.imageUrls.map((url) => ({
    url,
    type: /plan|planirov|layout|floor[-_ ]?plan|план/iu.test(new URL(url).pathname) ? "plan" : "photo",
    sourceUrl,
  }));
  return importedProjectSchema.parse({
    sourceUrl,
    publicationStatus: "draft",
    name,
    productType: inferProductType(parsed.name.value, text.slice(0, 2_000), sourceUrl),
    price: sourceFactToEvidence(parsed.price, sourceUrl),
    area: parsed.area?.status !== "not-published"
      ? sourceFactToEvidence(parsed.area, sourceUrl)
      : inferAreaFromName(parsed.name.value, sourceUrl),
    dimensions: sourceFactToEvidence(parsed.dimensions, sourceUrl),
    roomCount: sourceFactToEvidence(parsed.roomCount, sourceUrl),
    bedrooms: sourceFactToEvidence(parsed.bedrooms, sourceUrl),
    bathrooms: parsed.bathrooms ? sourceFactToEvidence(parsed.bathrooms, sourceUrl) : extractBathrooms(html, sourceUrl),
    floors: sourceFactToEvidence(parsed.floors, sourceUrl),
    productionTerm: sourceFactToEvidence(parsed.productionTerm, sourceUrl),
    technology: parsed.technology && parsed.technology.status !== "not-published"
      ? sourceFactToEvidence(parsed.technology, sourceUrl)
      : inferTechnology(parsed.name.value, text, sourceUrl),
    insulation: parsed.insulation ? sourceFactToEvidence(parsed.insulation, sourceUrl) : unknown(sourceUrl, "Толщина утепления не опубликована отдельным полем."),
    completion: parsed.completion ? sourceFactToEvidence(parsed.completion, sourceUrl) : unknown(sourceUrl, "Комплектация не опубликована отдельным полем."),
    media,
    conflicts: parsed.conflicts,
  });
};

const extractMeta = (document, selector) => document.querySelector(selector)?.getAttribute("content")?.trim() ?? null;

const conciseIdentityName = (value) => {
  const normalized = normalizeWhitespace(value);
  if (!normalized) return "";
  const parts = normalized.split(/\s+(?:\||—|–)\s+/u).map((part) => part.trim()).filter(Boolean);
  const concise = parts.filter((part) => part.length >= 2 && part.length <= 48).sort((a, b) => a.length - b.length)[0];
  return concise ?? normalized;
};

const extractManufacturerDraft = ({ id, homepageHtml, siteUrl, catalogUrl, discoveredProjectCount, expectedProjectCount, supportingPages }) => {
  const dom = parseDom(homepageHtml);
  const document = dom.window.document;
  const organization = findStructuredEntity(document, ["Organization", "Corporation", "LocalBusiness", "HomeAndConstructionBusiness"]);
  const allHtml = [homepageHtml, ...supportingPages.map((page) => page.html)].join(" ");
  const allText = normalizeWhitespace(parseDom(allHtml).window.document.body?.textContent ?? "");
  const rawTitle = normalizeWhitespace(String(organization?.name ?? ""))
    || extractMeta(document, 'meta[property="og:site_name"]')
    || normalizeWhitespace(document.querySelector("h1")?.textContent ?? "")
    || normalizeWhitespace(document.title);
  const title = conciseIdentityName(rawTitle);
  const structuredLogo = typeof organization?.logo === "string" ? organization.logo : organization?.logo?.url;
  const linkedLogo = [...document.querySelectorAll('img[src], img[data-src]')]
    .map((node) => node.getAttribute("data-src") ?? node.getAttribute("src"))
    .find((value) => /logo|логотип/iu.test(value ?? ""));
  const logo = absoluteUrl(structuredLogo ?? linkedLogo, siteUrl);
  const phones = unique(allText.match(/\+7\s*\(?\d{3}\)?[\d\s-]{7,14}/gu) ?? [])
    .map((value) => value.trim())
    .filter((value) => !/(\d)\1{6,}/u.test(value.replace(/\D/gu, "")));
  const emails = unique(allText.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/giu) ?? []);
  const externalLinks = unique([homepageHtml, ...supportingPages.map((page) => page.html)]
    .flatMap((html) => {
      const page = parseDom(html);
      return [...page.window.document.querySelectorAll("a[href]")]
        .map((node) => absoluteUrl(node.getAttribute("href"), siteUrl))
        .filter(Boolean);
    }));
  const telegram = externalLinks.find((url) => /(?:t\.me|telegram\.me)\//iu.test(url));
  const youtube = externalLinks.find((url) => /(?:youtube\.com|youtu\.be)\//iu.test(url));
  const reviewProfile = externalLinks.find((url) => /yandex\.(?:ru|com)\/maps\/org|2gis\.ru\/[^/]+\/firm/iu.test(url));
  const operator = allText.match(/(?:ООО|АО|ПАО|ИП)\s*[«"']?[\p{L}\d ._-]{2,80}[»"']?/u)?.[0]?.trim();
  const inn = allText.match(/ИНН\D{0,12}(\d{10}|\d{12})/iu)?.[1];
  const ogrn = allText.match(/ОГРН(?:ИП)?\D{0,12}(\d{13}|\d{15})/iu)?.[1];
  const productionMatch = allText.match(/производство\s*:\s*([\p{L}\d., №-]{8,140}?)(?=\s+(?:посетить|заполните|телефон|email|e-mail|режим|$))/iu)?.[1]?.trim()
    ?? allText.match(/(?:адрес\s+производства|производство\s+(?:находится|расположено))\D{0,20}([^.!?]{12,180})/iu)?.[1]?.trim();
  const portfolioPage = supportingPages.find((page) => /portfolio|gallery|works|objects|raboty|obekty|галере|работ|объект/iu.test(page.url));
  const portfolioMedia = portfolioPage
    ? unique([...parseDom(portfolioPage.html).window.document.querySelectorAll("img")]
        .map((node) => absoluteUrl(node.getAttribute("data-original") ?? node.getAttribute("data-src") ?? node.getAttribute("src"), portfolioPage.url))
        .filter((url) => url && !/logo|icon|sprite|favicon/iu.test(new URL(url).pathname)))
        .slice(0, 24)
        .map((url) => ({ url, type: "photo", sourceUrl: portfolioPage.url }))
    : [];

  return importedManufacturerSchema.parse({
    id,
    publicationStatus: "draft",
    identity: {
      name: title ? derived(title, siteUrl, organization?.name ? "structured-data" : "visible-text", organization?.name ? "Название из Organization JSON-LD." : "Название взято из og:site_name, H1 или title и требует редакторской проверки.", organization?.name ? 0.9 : 0.75) : unknown(siteUrl, "Название компании не найдено."),
      logo: logo ? derived(logo, siteUrl, organization?.logo ? "structured-data" : "media", organization?.logo ? "Логотип из Organization JSON-LD." : "Изображение с явным признаком logo в имени файла.", organization?.logo ? 0.85 : 0.72) : unknown(siteUrl, "Логотип не найден автоматически."),
    },
    contacts: {
      siteUrl,
      phones: phones.length ? verified(phones, siteUrl, "visible-text", "Телефоны найдены на официальных страницах.") : unknown(siteUrl, "Телефоны не опубликованы."),
      emails: emails.length ? verified(emails, siteUrl, "visible-text", "Email найдены на официальных страницах.") : unknown(siteUrl, "Email не опубликованы."),
      telegram: telegram ? verified(telegram, siteUrl, "link", "Ссылка Telegram опубликована на официальном сайте.") : unknown(siteUrl, "Telegram не найден на официальном сайте."),
      youtube: youtube ? verified(youtube, siteUrl, "link", "Ссылка YouTube опубликована на официальном сайте.") : unknown(siteUrl, "YouTube не найден на официальном сайте."),
    },
    catalog: { sourceUrl: catalogUrl, discoveredProjectCount, expectedProjectCount: expectedProjectCount ?? null },
    legal: {
      operator: operator ? derived(operator, siteUrl, "visible-text", "Оператор найден в официальном тексте; связь требует проверки по реквизитам.", 0.7) : unknown(siteUrl, "Оператор сайта не найден."),
      inn: inn ? verified(inn, siteUrl, "visible-text", "ИНН опубликован на официальном сайте.") : unknown(siteUrl, "ИНН не опубликован."),
      ogrn: ogrn ? verified(ogrn, siteUrl, "visible-text", "ОГРН или ОГРНИП опубликован на официальном сайте.") : unknown(siteUrl, "ОГРН или ОГРНИП не опубликован."),
    },
    production: {
      address: productionMatch ? derived(productionMatch, siteUrl, "visible-text", "Фрагмент рядом с указанием производства; адрес требует нормализации.", 0.72) : unknown(siteUrl, "Отдельный адрес производства не найден."),
    },
    reviews: {
      externalProfile: reviewProfile ? derived(reviewProfile, siteUrl, "link", "Внешний профиль найден на официальном сайте; идентичность организации требует проверки.", 0.75) : unknown(siteUrl, "Независимый профиль отзывов не найден на официальном сайте."),
    },
    builtObjects: {
      sourcePage: portfolioPage ? verified(portfolioPage.url, portfolioPage.url, "link", "Официальная страница портфолио или объектов.") : unknown(siteUrl, "Страница выполненных объектов не найдена."),
      media: portfolioMedia,
    },
  });
};

const supportingLinkPattern = /contact|kontakty|about|o-nas|privacy|politika|requisite|rekvizit|portfolio|gallery|works|objects|raboty|obekty/iu;

const loadExistingSeed = async (id) => {
  const { createServer } = await import("vite");
  const vite = await createServer({ appType: "custom", logLevel: "error", server: { middlewareMode: true } });
  try {
    const [{ manufacturerRegistry }, { projects }] = await Promise.all([
      vite.ssrLoadModule("/src/data/manufacturers.ts"),
      vite.ssrLoadModule("/src/data/projects.ts"),
    ]);
    const manufacturer = manufacturerRegistry[id];
    if (!manufacturer) return null;
    return {
      siteUrl: new URL(manufacturer.siteUrl).origin + "/",
      catalogUrl: manufacturer.profile?.sourceAudit?.catalog.sourceUrl ?? manufacturer.siteUrl,
      expectedProjectCount: manufacturer.profile?.sourceAudit?.catalog.expectedProjectCount ?? null,
      knownProjectUrls: projects.filter((project) => project.manufacturerId === id).map((project) => project.sourceUrl),
    };
  } finally {
    await vite.close();
  }
};

const parseArguments = (values) => {
  const id = values.find((value) => !value.startsWith("--"));
  const option = (name) => values.find((value) => value.startsWith(`--${name}=`))?.slice(name.length + 3);
  return { id, siteUrl: option("site"), catalogUrl: option("catalog"), write: values.includes("--write") };
};

export const runUniversalImport = async ({ id, siteUrl, catalogUrl, knownProjectUrls = [], expectedProjectCount = null, write = false, fetcher = fetchPage }) => {
  if (!id) throw new Error("Укажите id производителя.");
  if (!siteUrl) throw new Error("Укажите официальный сайт через --site=https://example.com/.");
  const homepage = await fetcher(siteUrl);
  const homepageLinks = extractSameOriginLinks(homepage.body, homepage.url);
  const supportUrls = homepageLinks.filter((url) => supportingLinkPattern.test(new URL(url).pathname)).slice(0, 12);
  const supportingPages = [];
  for (const url of supportUrls) {
    try {
      const page = await fetcher(url);
      supportingPages.push({ url: page.url, html: page.body });
    } catch {
      // Missing optional support pages are recorded by the resulting field states.
    }
  }
  const discovery = await discoverProjectUrls({
    siteUrl: homepage.url,
    catalogUrl: catalogUrl ?? homepage.url,
    knownProjectUrls,
    fetcher,
    transformConfirmed: ({ url, html }) => extractProjectDraft({ sourceUrl: url, html }),
  });
  const projects = discovery.confirmed;
  const manufacturer = extractManufacturerDraft({
    id,
    homepageHtml: homepage.body,
    siteUrl: homepage.url,
    catalogUrl: discovery.catalogUrl,
    discoveredProjectCount: projects.length,
    expectedProjectCount,
    supportingPages,
  });
  const audit = {
    generatedAt: new Date().toISOString(),
    status: "draft",
    platform: discovery.platform,
    candidateCount: discovery.candidates.length,
    confirmedProjectCount: projects.length,
    rejected: discovery.rejected,
    conflicts: projects.flatMap((project) => project.conflicts.map((item) => ({ sourceUrl: project.sourceUrl, ...item }))),
    publicationBlocked: true,
    publicationReason: "Импорт создаёт черновик. Публикация разрешается отдельным release gate после проверки конфликтов и идентичности производителя.",
  };
  if (write) {
    const base = `content/manufacturers/${id}`;
    await mkdir(`${base}/assets`, { recursive: true });
    await Promise.all([
      writeFile(`${base}/manufacturer.json`, `${JSON.stringify(manufacturer, null, 2)}\n`, "utf8"),
      writeFile(`${base}/projects.json`, `${JSON.stringify(projects, null, 2)}\n`, "utf8"),
      writeFile(`${base}/audit.json`, `${JSON.stringify(audit, null, 2)}\n`, "utf8"),
    ]);
  }
  return { manufacturer, projects, audit };
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const args = parseArguments(process.argv.slice(2));
  const seed = args.id ? await loadExistingSeed(args.id) : null;
  const result = await runUniversalImport({
    id: args.id,
    siteUrl: args.siteUrl ?? seed?.siteUrl,
    catalogUrl: args.catalogUrl ?? seed?.catalogUrl,
    knownProjectUrls: seed?.knownProjectUrls ?? [],
    expectedProjectCount: seed?.expectedProjectCount ?? null,
    write: args.write,
  });
  console.log(`${result.manufacturer.id}: ${result.projects.length} проектов, платформа ${result.audit.platform}, конфликтов ${result.audit.conflicts.length}`);
  if (args.write) console.log(`Черновик: content/manufacturers/${result.manufacturer.id}/`);
}
