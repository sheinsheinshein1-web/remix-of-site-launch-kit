import { z } from "zod";

const sourceFactSchema = z.object({
  value: z.string().nullable(),
  status: z.enum(["published", "derived", "not-published", "conflict"]),
  method: z.enum(["visible-text", "structured-data", "media-name", "not-found"]),
  evidence: z.string().min(1),
});

export const normalizedSourceProjectSchema = z.object({
  sourceUrl: z.string().url(),
  manufacturerId: z.string().min(1),
  name: sourceFactSchema,
  area: sourceFactSchema,
  price: sourceFactSchema,
  productionTerm: sourceFactSchema,
  roomCount: sourceFactSchema,
  bedrooms: sourceFactSchema,
  floors: sourceFactSchema,
  dimensions: sourceFactSchema,
  technology: sourceFactSchema.optional(),
  insulation: sourceFactSchema.optional(),
  completion: sourceFactSchema.optional(),
  media: z.object({
    imageUrls: z.array(z.string().url()),
    publishedImageCount: z.number().int().nonnegative(),
    planStatus: z.enum(["published", "not-published", "unknown"]),
    evidence: z.string().min(1),
  }),
  conflicts: z.array(z.object({
    field: z.string().min(1),
    values: z.array(z.string().min(1)).min(2),
    evidence: z.string().min(1),
  })),
});

const entityMap = {
  amp: "&",
  apos: "'",
  gt: ">",
  lt: "<",
  nbsp: " ",
  quot: '"',
};

export const decodeHtmlEntities = (value = "") => value
  .replace(/&#(\d+);/gu, (_, code) => String.fromCodePoint(Number(code)))
  .replace(/&#x([\da-f]+);/giu, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
  .replace(/&([a-z]+);/giu, (match, name) => entityMap[name.toLowerCase()] ?? match);

const cleanText = (value = "") => decodeHtmlEntities(value)
  .replace(/<(?:script|style)\b[^>]*>[\s\S]*?<\/(?:script|style)>/giu, " ")
  .replace(/<br\s*\/?\s*>/giu, " ")
  .replace(/<[^>]+>/gu, " ")
  .replace(/\s+/gu, " ")
  .trim();

const missing = (evidence) => ({
  value: null,
  status: "not-published",
  method: "not-found",
  evidence,
});

const published = (value, method, evidence) => ({
  value,
  status: "published",
  method,
  evidence,
});

const derivedFact = (value, method, evidence) => ({
  value,
  status: "derived",
  method,
  evidence,
});

const conflict = (value, method, evidence) => ({
  value,
  status: "conflict",
  method,
  evidence,
});

const normalizeDecimal = (value) => value.trim().replace(".", ",");

const normalizeArea = (value) => `${normalizeDecimal(value)} м²`;

const normalizePrice = (value) => {
  const digits = value.replace(/\D/gu, "");
  return digits ? `${Number(digits).toLocaleString("ru-RU").replace(/\u00a0/gu, " ")} ₽` : null;
};

const normalizeMillionPrice = (value) => {
  const amount = Number(String(value).replace(",", "."));
  return Number.isFinite(amount) && amount > 0
    ? `${Math.round(amount * 1_000_000).toLocaleString("ru-RU").replace(/\u00a0/gu, " ")} ₽`
    : null;
};

const normalizeTerm = (value) => `${Number(value)} д.`;

const normalizeDimensions = (value) => value
  .trim()
  .replace(/[хx*]/giu, " × ")
  .replace(/\s*×\s*/gu, " × ")
  .replace(/(\d)\.(\d)/gu, "$1,$2")
  .replace(/\s+/gu, " ")
  .replace(/\s*м$/iu, " м");

const normalizeMetricDimensions = (value) => {
  const millimeters = [...value.matchAll(/([\d.,]+)\s*мм/giu)].map((match) => Number(match[1].replace(",", ".")));
  if (millimeters.length >= 2 && millimeters.every(Number.isFinite)) {
    return `${millimeters.map((item) => String(item / 1000).replace(".", ",")).join(" × ")} м`;
  }
  return normalizeDimensions(value);
};

const unique = (values) => [...new Set(values.filter(Boolean))];

const absoluteUrl = (value, sourceUrl) => {
  try {
    return new URL(value, sourceUrl).toString();
  } catch {
    return null;
  }
};

const getJsonLdBlocks = (html) => [...html.matchAll(
  /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/giu,
)].flatMap((match) => {
  try {
    const value = JSON.parse(decodeHtmlEntities(match[1]).trim());
    return Array.isArray(value) ? value : [value];
  } catch {
    return [];
  }
});

const findJsonLdByType = (html, type) => getJsonLdBlocks(html).find((item) => {
  if (!item || typeof item !== "object") return false;
  const itemType = item["@type"];
  return itemType === type || (Array.isArray(itemType) && itemType.includes(type));
});

const getJsonLdNodes = (value) => {
  if (Array.isArray(value)) return value.flatMap(getJsonLdNodes);
  if (!value || typeof value !== "object") return [];
  return [value, ...Object.values(value).flatMap(getJsonLdNodes)];
};

const findNestedJsonLdByType = (html, type) => getJsonLdBlocks(html)
  .flatMap(getJsonLdNodes)
  .find((item) => {
    const itemType = item?.["@type"];
    return itemType === type || (Array.isArray(itemType) && itemType.includes(type));
  });

const htmlAttributeValues = (html, attribute) => [...html.matchAll(
  new RegExp(`${attribute}=["']([^"']+)["']`, "giu"),
)].map((match) => decodeHtmlEntities(match[1]));

const cssUrlValues = (html) => [...html.matchAll(/url\(\s*["']?([^)'"\s]+)["']?\s*\)/giu)]
  .map((match) => decodeHtmlEntities(match[1]));

const detectPlanStatus = (imageUrls) => {
  if (imageUrls.length === 0) return "unknown";
  return imageUrls.some((url) => /(?:^|[\/_-])(plan|planirov|floorplan|план)/iu.test(url))
    ? "published"
    : "unknown";
};

export const parseByggeProject = ({ html, sourceUrl }) => {
  const text = cleanText(html);
  const projectTitle = cleanText(
    html.match(/<h1[^>]*class=["'][^"']*project-title[^"']*["'][^>]*>([\s\S]*?)<\/h1>/iu)?.[1]
      ?? html.match(/<title[^>]*>([\s\S]*?)<\/title>/iu)?.[1]
      ?? "",
  );
  const areaMatch = text.match(/Общая площадь:\s*([\d.,]+)\s*м[²2]/iu);
  const priceMatch = cleanText(
    html.match(/<div[^>]*class=["'][^"']*project-price[^"']*["'][^>]*>([\s\S]*?)<\/div>/iu)?.[1]
      ?? "",
  ).match(/([\d\s]+)\s*(?:руб|₽)/iu);
  const termMatch = text.match(/Срок (?:строительства|производства):\s*(\d+)\s*(?:дн|день|дня|дней)/iu);
  const roomMatch = text.match(/Количество комнат:\s*(\d+)/iu);
  const dimensionsMatch = text.match(/Габариты:\s*([\d.,]+\s*[хx×*]\s*[\d.,]+(?:\s*[хx×*]\s*[\d.,]+)?\s*м)/iu);
  const imageUrls = unique([...html.matchAll(
    /<a[^>]+href=["']([^"']+)["'][^>]+data-fancybox=["']project["']/giu,
  )]
    .map((match) => absoluteUrl(match[1], sourceUrl))
    .filter((url) => url && /\.(?:avif|gif|jpe?g|png|webp)(?:$|\?)/iu.test(url)));
  const pageSaysHouse = /Тип строения:\s*Дом/iu.test(text);

  const result = {
    sourceUrl,
    manufacturerId: "bygge",
    name: projectTitle
      ? published(projectTitle, "visible-text", "Заголовок H1 страницы проекта.")
      : missing("Заголовок проекта не найден."),
    area: areaMatch
      ? published(normalizeArea(areaMatch[1]), "visible-text", "Поле «Общая площадь» на странице проекта.")
      : missing("Поле «Общая площадь» не найдено."),
    price: priceMatch && normalizePrice(priceMatch[1])
      ? published(normalizePrice(priceMatch[1]), "visible-text", "Цена в основном блоке проекта.")
      : missing("Актуальная цена в основном блоке не найдена."),
    productionTerm: termMatch
      ? published(normalizeTerm(termMatch[1]), "visible-text", "Поле срока на странице проекта.")
      : missing("Срок производства или строительства не найден."),
    roomCount: roomMatch
      ? published(roomMatch[1], "visible-text", "Поле «Количество комнат» на странице проекта.")
      : missing("Количество комнат не найдено."),
    bedrooms: missing("Количество спален отдельным текстовым полем не опубликовано."),
    floors: missing("Этажность отдельным текстовым полем не опубликована."),
    dimensions: dimensionsMatch
      ? published(normalizeDimensions(dimensionsMatch[1]), "visible-text", "Поле «Габариты» на странице проекта.")
      : missing("Габариты отдельным текстовым полем не найдены."),
    media: {
      imageUrls,
      publishedImageCount: imageUrls.length,
      planStatus: detectPlanStatus(imageUrls),
      evidence: "Основная галерея data-fancybox=project; планировка определяется только по имени файла.",
    },
    conflicts: [],
  };

  if (!pageSaysHouse && /Модульная баня|Тип строения:\s*Баня/iu.test(text)) {
    result.bedrooms = missing("Для модульной бани количество спален не применяется.");
  }

  return normalizedSourceProjectSchema.parse(result);
};

const parseTildaGallery = (html, sourceUrl) => {
  const galleries = htmlAttributeValues(html, "data-field-imgs-value").flatMap((rawValue) => {
    try {
      const parsed = JSON.parse(rawValue);
      if (!Array.isArray(parsed)) return [];
      return [unique(parsed.map((item) => absoluteUrl(item?.li_img, sourceUrl)))];
    } catch {
      return [];
    }
  });

  const primaryGallery = galleries.sort((left, right) => right.length - left.length)[0];
  if (primaryGallery?.length) {
    // Tilda often renders separate desktop and mobile copies of one gallery.
    // Keep the union only for copies that substantially overlap with the
    // largest gallery; unrelated carousels lower on the page stay excluded.
    const primaryKeys = new Set(primaryGallery);
    return unique(galleries
      .filter((gallery) => {
        const overlap = gallery.filter((url) => primaryKeys.has(url)).length;
        return gallery === primaryGallery || overlap >= Math.ceil(Math.min(primaryGallery.length, gallery.length) / 2);
      })
      .flat());
  }

  return unique(htmlAttributeValues(html, "data-original")
    .map((value) => absoluteUrl(value, sourceUrl))
    .filter((url) => url && !/(?:\/366\.png|\/__\.png)(?:$|\?)/u.test(url)));
};

const isProjectMediaUrl = (url) => {
  let pathname = url;
  try {
    const parsed = new URL(url);
    pathname = decodeURIComponent(`${parsed.host}${parsed.pathname}`);
  } catch {
    // The schema validates absolute URLs later; keep filtering conservative.
  }
  if (/\.(?:js|css|mjs|map|svg|gif|mp4|webm)(?:$|\?)/iu.test(url)) return false;
  const looksLikeImage = /\.(?:avif|jpe?g|png|webp)(?:$|\?)/iu.test(url)
    || /siteapi\.[^/]+\/.*format\((?:avif|jpe?g|png|webp)\)/iu.test(url)
    || /\/UPLOAD\/[^/?]+$/u.test(pathname);
  if (!looksLikeImage) return false;
  return !/(?:logo|favicon|icon|(?:^|[\/_-])icn|avatar|promocode|promo[_-]|empty|payment|captcha|qr[_-]|social|youtube|rutube|looo)/iu.test(pathname);
};

const canonicalMediaKey = (url) => {
  try {
    const parsed = new URL(url);
    const tildaAsset = parsed.pathname.match(/\/(tild[a-z0-9-]+)\/(?:-\/[^/]+\/)*([^/]+)$/iu);
    return tildaAsset ? `${tildaAsset[1]}/${tildaAsset[2]}` : `${parsed.host}${parsed.pathname}`;
  } catch {
    return url;
  }
};

const uniqueProjectMedia = (urls) => {
  const seen = new Set();
  return urls.filter((url) => {
    if (!url || !isProjectMediaUrl(url)) return false;
    const key = canonicalMediaKey(url);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export const parsePlatformaProject = ({ html, sourceUrl }) => {
  const text = cleanText(html);
  const product = findJsonLdByType(html, "Product") ?? {};
  const properties = new Map(
    (Array.isArray(product.additionalProperty) ? product.additionalProperty : [])
      .filter((item) => item && typeof item.name === "string")
      .map((item) => [item.name.trim(), String(item.value ?? "").trim()]),
  );
  const visibleAreaMatch = text.match(/([\d.,]+)\s*м[²2]\s*(?:Площадь дома|Общая площадь)/iu)
    ?? text.match(/(?:Общая площадь застройки|Площадь):?\s*([\d.,]+)\s*м[²2]/iu);
  const title = cleanText(html.match(/<title[^>]*>([\s\S]*?)<\/title>/iu)?.[1] ?? "");
  const titleAreaMatch = title.match(/([\d.,]+)\s*м²/iu);
  const structuredArea = properties.get("Жилая площадь")?.match(/[\d.,]+/u)?.[0] ?? null;
  const visibleArea = visibleAreaMatch?.[1] ?? null;
  const distinctAreas = unique([visibleArea, titleAreaMatch?.[1], structuredArea].map((value) => (
    value ? normalizeArea(value) : null
  )));
  const termMatch = text.match(/(\d+)\s*(?:день|дня|дней)\s*Срок производства/iu);
  const bedroomsMatch = text.match(/(\d+)\s*Количество спален/iu);
  const priceMatch = text.match(/от\s*([\d\s]+)\s*(?:р\.|руб|₽)(?:\s*Стоимость)?/iu);
  const structuredPrice = product?.offers?.lowPrice ? String(product.offers.lowPrice) : null;
  const floorValue = (properties.get("Этажность") ?? properties.get("Дом: Этажность"))?.match(/\d+/u)?.[0] ?? null;
  const dimensionsValue = properties.get("Внешние размеры (Д*Ш*В)")
    ?? properties.get("Длина*Ширина*Высота")
    ?? null;
  const imageUrls = parseTildaGallery(html, sourceUrl);
  const conflicts = distinctAreas.length > 1 ? [{
    field: "area",
    values: distinctAreas,
    evidence: "SEO title, видимое поле «Площадь дома» и Product JSON-LD «Жилая площадь» содержат разные числа. Импортёр не объединяет метрики автоматически.",
  }] : [];
  const canonicalArea = visibleArea ? normalizeArea(visibleArea) : distinctAreas[0] ?? null;

  const result = {
    sourceUrl,
    manufacturerId: "platforma",
    name: typeof product.name === "string" && product.name.trim()
      ? published(product.name.trim(), "structured-data", "Product JSON-LD.")
      : missing("Название Product JSON-LD не найдено."),
    area: canonicalArea
      ? (conflicts.length > 0
          ? conflict(canonicalArea, "visible-text", "Видимое поле «Площадь дома» выбрано для сравнения, но источник содержит конфликт.")
          : published(canonicalArea, "visible-text", "Видимое поле «Площадь дома»."))
      : missing("Площадь дома не найдена."),
    price: normalizePrice(priceMatch?.[1] ?? structuredPrice ?? "")
      ? published(
          normalizePrice(priceMatch?.[1] ?? structuredPrice),
          priceMatch ? "visible-text" : "structured-data",
          priceMatch ? "Видимое поле «Стоимость»." : "Product JSON-LD, offers.lowPrice.",
        )
      : missing("Актуальная стартовая стоимость не найдена."),
    productionTerm: termMatch
      ? published(normalizeTerm(termMatch[1]), "visible-text", "Видимое поле «Срок производства».")
      : missing("Срок производства не найден."),
    roomCount: missing("Общее количество комнат отдельным полем не опубликовано."),
    bedrooms: bedroomsMatch
      ? published(bedroomsMatch[1], "visible-text", "Видимое поле «Количество спален».")
      : missing("Количество спален не найдено."),
    floors: floorValue
      ? published(floorValue, "structured-data", "Product JSON-LD, additionalProperty «Этажность».")
      : missing("Этажность не найдена в видимом тексте или Product JSON-LD."),
    dimensions: dimensionsValue
      ? published(normalizeMetricDimensions(dimensionsValue), "structured-data", "Product JSON-LD, внешние размеры.")
      : missing("Внешние размеры не найдены в Product JSON-LD."),
    media: {
      imageUrls,
      publishedImageCount: imageUrls.length,
      planStatus: detectPlanStatus(imageUrls),
      evidence: "Самая большая Tilda-галерея страницы; планировка определяется только по имени файла.",
    },
    conflicts,
  };

  return normalizedSourceProjectSchema.parse(result);
};

/**
 * Консервативный адаптер для официальных страниц без отдельного парсера.
 * Он извлекает только явно подписанные значения и Product JSON-LD. Отсутствие
 * совпадения не доказывает отсутствие факта: специализированный аудит может
 * быть добавлен позже без изменения общего контракта.
 */
export const parseGenericProject = ({ manufacturerId, html, sourceUrl }) => {
  const text = cleanText(html);
  const product = findNestedJsonLdByType(html, "Product") ?? {};
  const title = cleanText(
    html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/iu)?.[1]
      ?? html.match(/<title[^>]*>([\s\S]*?)<\/title>/iu)?.[1]
      ?? "",
  );
  const areaUnit = String.raw`(?:м\s*[²2]|кв\.?\s*м\.?)`;
  const areaMatch = text.match(new RegExp(String.raw`(?:общая|жилая|полезная|площадь дома|площадь проекта)?\s*площадь[^\d]{0,30}([\d.,]+)\s*${areaUnit}`, "iu"))
    ?? text.match(new RegExp(String.raw`([\d.,]+)\s*${areaUnit}[^\d]{0,24}(?:площадь|дом|бан)`, "iu"));
  const offerPrice = product?.offers?.lowPrice ?? product?.offers?.price;
  const priceMatch = text.match(/(?:цена|стоимость|от)\D{0,35}([\d][\d\s]{3,})\s*(?:₽|руб|р\.)/iu);
  const termMatch = text.match(/(?:срок\s+(?:производства|изготовления|строительства)|изготовление)[^\d]{0,35}(\d+)\s*(дн|день|дня|дней|недел|нед\.?|месяц|мес\.?)/iu);
  const roomsMatch = text.match(/(?:количество\s+)?комнат[^\d]{0,15}(\d+)/iu);
  const bedroomsMatch = text.match(/(?:количество\s+)?спален[^\d]{0,15}(\d+)/iu)
    ?? text.match(/(\d+)\s*спальн/iu);
  const floorsMatch = text.match(/(?:этажность|количество\s+этажей)[^\d]{0,15}(\d+)/iu)
    ?? text.match(/(\d+)[-\s]?этажн/iu);
  const dimensionsMatch = text.match(/(?:габариты|размер(?:ы)?)[^\d]{0,30}([\d.,]+\s*[хx×*]\s*[\d.,]+(?:\s*[хx×*]\s*[\d.,]+)?\s*м?)/iu);
  const imageCandidates = [
    ...(Array.isArray(product.image) ? product.image : [product.image]),
    ...htmlAttributeValues(html, "data-original"),
    ...htmlAttributeValues(html, "data-src"),
    ...htmlAttributeValues(html, "src"),
    ...htmlAttributeValues(html, "href"),
    ...cssUrlValues(html),
  ];
  const rawImageUrls = unique(imageCandidates
    .map((value) => typeof value === "string" ? absoluteUrl(value, sourceUrl) : null)
    .filter(Boolean));
  const tildaGallery = parseTildaGallery(html, sourceUrl);
  const imageUrls = uniqueProjectMedia(tildaGallery.length >= 2 ? tildaGallery : rawImageUrls);
  const normalizedOfferPrice = normalizePrice(String(offerPrice ?? ""));
  const normalizedVisiblePrice = normalizePrice(priceMatch?.[1] ?? "");
  const normalizedProductionTerm = termMatch
    ? /нед/iu.test(termMatch[2])
      ? `${Number(termMatch[1]) * 7} д.`
      : /месяц|мес/iu.test(termMatch[2])
        ? `${Number(termMatch[1]) * 30} д.`
        : normalizeTerm(termMatch[1])
    : null;

  return normalizedSourceProjectSchema.parse({
    sourceUrl,
    manufacturerId,
    name: typeof product.name === "string" && product.name.trim()
      ? published(product.name.trim(), "structured-data", "Product JSON-LD.")
      : title
        ? published(title, "visible-text", "Первый H1 или title официальной страницы.")
        : missing("Название проекта не найдено."),
    area: areaMatch
      ? published(normalizeArea(areaMatch[1]), "visible-text", "Подписанное значение площади в тексте страницы.")
      : missing("Подписанное значение площади не найдено универсальным адаптером."),
    price: normalizedVisiblePrice || normalizedOfferPrice
      ? published(
          normalizedVisiblePrice ?? normalizedOfferPrice,
          normalizedVisiblePrice ? "visible-text" : "structured-data",
          normalizedVisiblePrice ? "Подписанная цена в тексте страницы." : "Product JSON-LD, offers.price/lowPrice.",
        )
      : missing("Актуальная цена не найдена универсальным адаптером."),
    productionTerm: normalizedProductionTerm
      ? published(normalizedProductionTerm, "visible-text", "Подписанный срок производства, изготовления или строительства.")
      : missing("Срок не найден универсальным адаптером."),
    roomCount: roomsMatch
      ? published(roomsMatch[1], "visible-text", "Подписанное количество комнат.")
      : missing("Количество комнат не найдено универсальным адаптером."),
    bedrooms: bedroomsMatch
      ? published(bedroomsMatch[1], "visible-text", "Подписанное количество спален.")
      : missing("Количество спален не найдено универсальным адаптером."),
    floors: floorsMatch
      ? published(floorsMatch[1], "visible-text", "Подписанная этажность.")
      : missing("Этажность не найдена универсальным адаптером."),
    dimensions: dimensionsMatch
      ? published(normalizeDimensions(dimensionsMatch[1]), "visible-text", "Подписанные габариты или размеры.")
      : missing("Габариты не найдены универсальным адаптером."),
    media: {
      imageUrls,
      publishedImageCount: imageUrls.length,
      planStatus: detectPlanStatus(imageUrls),
      evidence: "Изображения из Product JSON-LD и lazy-load/src атрибутов; служебные изображения могут присутствовать.",
    },
    conflicts: [],
  });
};

/**
 * FPS Modul keeps the primary price in `.price .value`, project media in CSS
 * `background-image` declarations and publishes areas as `кв.м.`.  These are
 * stable page semantics, so the adapter never falls through to prices of
 * delivery or other additional services lower on the page.
 */
export const parseFpsModulProject = ({ html, sourceUrl }) => {
  const generic = parseGenericProject({ manufacturerId: "fps-modul", html, sourceUrl });
  const text = cleanText(html);
  const primaryPriceText = cleanText(
    html.match(/<div[^>]*class=["'][^"']*\bprice\b[^"']*["'][^>]*>[\s\S]*?<span[^>]*class=["'][^"']*\bvalue\b[^"']*["'][^>]*>([\s\S]*?)<\/span>/iu)?.[1]
      ?? "",
  );
  const primaryPrice = normalizePrice(primaryPriceText);
  const areaRangeMatch = text.match(/Общая\s+площадь\s*:\s*([\d.,]+)\s*\.{2,}\s*([\d.,]+)\s*(?:м\s*[²2]|кв\.?\s*м\.?)/iu);
  const areaMatch = text.match(/Общая\s+площадь\s*:\s*([\d.,]+)\s*(?:м\s*[²2]|кв\.?\s*м\.?)/iu);
  const galleryUrls = uniqueProjectMedia([
    ...htmlAttributeValues(html, "href"),
    ...htmlAttributeValues(html, "src"),
    ...cssUrlValues(html),
  ]
    .map((value) => absoluteUrl(value, sourceUrl))
    .filter((url) => url && /\/data\/uploads\/catalog\//iu.test(url)));

  return normalizedSourceProjectSchema.parse({
    ...generic,
    area: areaRangeMatch
      ? published(normalizeArea(areaRangeMatch[2]), "visible-text", `В основном блоке опубликован диапазон площади ${areaRangeMatch[1]}–${areaRangeMatch[2]} м²; карточка представляет максимальную планировку.`)
      : areaMatch
      ? published(normalizeArea(areaMatch[1]), "visible-text", "Поле «Общая площадь» в основном блоке проекта FPS Modul.")
      : generic.area,
    price: primaryPrice
      ? published(primaryPrice, "visible-text", "Основная цена в блоке `.price .value`; цены дополнительных услуг исключены.")
      : generic.price,
    media: galleryUrls.length > 0
      ? {
          imageUrls: galleryUrls,
          publishedImageCount: galleryUrls.length,
          planStatus: detectPlanStatus(galleryUrls),
          evidence: "Файлы основной проектной галереи `/data/uploads/catalog/`; служебные изображения страницы исключены.",
        }
      : generic.media,
  });
};

/**
 * DA-HOME renders the actual project before the «Похожие проекты» section.
 * The related cards repeat prices and facts from other products, therefore a
 * page-wide generic parser can silently assign a neighbour's price to the
 * current project. Read only the primary product section and its own gallery.
 */
export const parseDaHomeProject = ({ html, sourceUrl }) => {
  const primaryHtml = html.split(/<h2[^>]*>\s*Похожие проекты\s*<\/h2>/iu)[0];
  const text = cleanText(primaryHtml);
  const title = cleanText(primaryHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/iu)?.[1] ?? "");
  const labelledValue = (label) => cleanText(
    primaryHtml.match(new RegExp(
      `<dt[^>]*>\\s*${label}\\s*<\\/dt>\\s*<dd[^>]*>([\\s\\S]*?)<\\/dd>`,
      "iu",
    ))?.[1] ?? "",
  );
  const areaText = labelledValue("Площадь") || text.match(/(?:^|\s)([\d.,]+)\s*м[²2](?:\s|$)/u)?.[0] || "";
  const area = areaText.match(/([\d.,]+)\s*м[²2]/iu)?.[1] ?? null;
  const dimensionsText = labelledValue("(?:Размер|Габариты)");
  const dimensions = dimensionsText.match(/[\d.,]+\s*[хx×*]\s*[\d.,]+(?:\s*[хx×*]\s*[\d.,]+)?\s*м?/iu)?.[0] ?? null;
  const floorsText = labelledValue("Этажность");
  const floors = floorsText.match(/\d+/u)?.[0] ?? null;
  const technologyText = labelledValue("Технология");
  const normalizedTechnology = /каркас/iu.test(technologyText)
    ? (/бан/iu.test(title) ? "Каркасная баня" : "Каркасный дом")
    : /модул/iu.test(technologyText)
      ? "Модульный дом"
      : technologyText;
  const priceText = cleanText(
    primaryHtml.match(/<span[^>]*class=["'][^"']*text-4xl[^"']*["'][^>]*>([\s\S]*?)<\/span>/iu)?.[1] ?? "",
  );
  const price = normalizePrice(priceText);
  const termMatch = text.match(/(?:Срок|изготов\w*)[^\d]{0,24}(\d+)\s*(?:дн|день|дня|дней)/iu)
    ?? text.match(/(\d+)\s*(?:дн|день|дня|дней)[^\d]{0,24}(?:срок|изготов)/iu);
  const bedroomsMatch = text.match(/(?:количество\s+)?спален[^\d]{0,15}(\d+)/iu)
    ?? text.match(/(\d+)\s*спальн/iu);
  const roomsMatch = labelledValue("(?:Количество комнат|Комнат)").match(/\d+/u);
  const imageUrls = uniqueProjectMedia([
    ...htmlAttributeValues(primaryHtml, "src"),
    ...htmlAttributeValues(primaryHtml, "href"),
  ]
    .map((value) => absoluteUrl(value, sourceUrl))
    .filter((url) => url && /\/images\/(?:gallery|projects)\//iu.test(url)));

  return normalizedSourceProjectSchema.parse({
    sourceUrl,
    manufacturerId: "da-home",
    name: title
      ? published(title, "visible-text", "Заголовок H1 основной карточки проекта.")
      : missing("Заголовок проекта не найден."),
    area: area
      ? published(normalizeArea(area), "visible-text", "Поле «Площадь» основной карточки проекта.")
      : missing("Площадь в основной карточке проекта не опубликована."),
    price: price
      ? published(price, "visible-text", "Цена в основном ценовом блоке до секции похожих проектов.")
      : missing("Цена текущего проекта в основном блоке не опубликована."),
    productionTerm: termMatch
      ? published(normalizeTerm(termMatch[1]), "visible-text", "Срок явно опубликован в основной карточке проекта.")
      : missing("Срок текущего проекта отдельно не опубликован."),
    roomCount: roomsMatch
      ? published(roomsMatch[1], "visible-text", "Количество комнат явно опубликовано в основной карточке.")
      : missing("Количество комнат отдельно не опубликовано."),
    bedrooms: bedroomsMatch
      ? published(bedroomsMatch[1], "visible-text", "Количество спален явно опубликовано в основной карточке.")
      : missing("Количество спален отдельно не опубликовано."),
    floors: floors
      ? published(floors, "visible-text", "Поле «Этажность» основной карточки проекта.")
      : missing("Этажность отдельно не опубликована."),
    dimensions: dimensions
      ? published(normalizeDimensions(dimensions), "visible-text", "Поле «Размер» или «Габариты» основной карточки проекта.")
      : missing("Размеры отдельно не опубликованы."),
    technology: normalizedTechnology
      ? published(normalizedTechnology, "visible-text", "Поле «Технология» основной карточки проекта нормализовано к словарю каталога.")
      : missing("Технология отдельно не опубликована."),
    insulation: text.match(/Утепление\s*:?\s*[^\d]{0,80}(\d{2,3})\s*мм/iu)
      ? published(`${text.match(/Утепление\s*:?\s*[^\d]{0,80}(\d{2,3})\s*мм/iu)[1]} мм`, "visible-text", "Толщина утепления в составе стоимости.")
      : missing("Толщина утепления отдельно не опубликована."),
    completion: /под\s+ключ/iu.test(text)
      ? published("Под ключ", "visible-text", "Формат «под ключ» явно указан в основной карточке проекта.")
      : missing("Комплектация «под ключ» отдельно не опубликована."),
    media: {
      imageUrls,
      publishedImageCount: imageUrls.length,
      planStatus: detectPlanStatus(imageUrls),
      evidence: "Изображения текущего проекта до секции похожих проектов; соседние карточки исключены.",
    },
    conflicts: [],
  });
};

/**
 * SQ-MODYL publishes one page per series and several priced modifications on
 * that page. The catalog card represents the first (base) modification, so the
 * adapter reads its area, dimensions and price from one contiguous product
 * block instead of mixing values from different variants or footer text.
 */
export const parseSqModylProject = ({ html, sourceUrl }) => {
  const text = cleanText(html);
  const product = findNestedJsonLdByType(html, "Product") ?? {};
  const heading = cleanText(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/iu)?.[1] ?? "");
  const pageTitle = cleanText(html.match(/<title[^>]*>([\s\S]*?)<\/title>/iu)?.[1] ?? "");
  const directArea = text.match(/Площадь\s*([\d.,]+)\s*м[²2]/iu);
  const titleArea = pageTitle.match(/(?:^|[^\d])([\d.,]+)\s*м[²2](?:[^\d]|$)/iu);
  const directPrice = text.match(/Стоимость\s*([\d\s]{5,})\s*₽/iu);
  const titlePriceMatch = pageTitle.match(/(?:от\s+)?([\d\s]{5,})\s*₽/iu);
  const titlePrice = normalizePrice(titlePriceMatch?.[1] ?? "");
  const termMatch = text.match(/(\d+)\s*(?:дней|дня|день|д\.)\s*Срок\s*изготовления/iu)
    ?? text.match(/Срок\s*изготовления[^\d]{0,20}(\d+)\s*(?:дней|дня|день|д\.)/iu);
  const insulationMatch = text.match(/Утеплитель\s+KNAUF\s+INSULATION[^\d]{0,80}(\d{2,3})\s*мм/iu)
    ?? text.match(/Энергоэффективность\s+дома[^\d]{0,100}(\d{2,3})\s*мм/iu);
  const variant = text.match(
    /Стоимость\s+(?:Видео\s+обзор\s+)?(?:модульн(?:ый\s+дом|ая\s+баня)|гостевой\s+дом)\s+[^\d]{0,80}?(?:s[-\s]*)?(\d+(?:[.,]\d+)?)\s+([\s\S]{0,220}?)([\d.,]+\s*[хx×]\s*[\d.,]+(?:\s*[хx×]\s*[\d.,]+)?\s*м)\s*\(ДхШхВ\)\s*Что входит/iu,
  ) ?? text.match(
    /Стоимость\s+(?:Видео\s+обзор\s+)?(?:модульн(?:ый\s+дом|ая\s+баня)|гостевой\s+дом)\s+[^\d]{0,80}?(?:s[-\s]*)?(\d+(?:[.,]\d+)?)\s+Что входит/iu,
  ) ?? text.match(
    /Стоимость\s+(?:Видео\s+обзор\s+)?(?:модульн(?:ый\s+дом|ая\s+баня)|гостевой\s+дом)\s+[^\d]{0,80}?(?:s[-\s]*)?(\d+(?:[.,]\d+)?)\s+([\s\S]{0,420}?)\s*Что входит/iu,
  );
  const variantArea = variant?.[1] ?? null;
  const variantBody = variant?.[2] ?? "";
  const variantDimensions = variant?.[3] ?? null;
  const afterVariant = variant ? text.slice((variant.index ?? 0) + variant[0].length, (variant.index ?? 0) + variant[0].length + 160) : "";
  const firstVariantPrice = afterVariant.match(/(?:([\d.,]+)\s*млн\.?|([\d][\d\s]{4,}))\s*₽/iu);
  const variantPrice = firstVariantPrice?.[1]
    ? normalizeMillionPrice(firstVariantPrice[1])
    : normalizePrice(firstVariantPrice?.[2] ?? "");
  const heroMillion = text.match(/Стоимость\s+от\s+([\d.,]+)\s*млн\.?\s*₽/iu)?.[1] ?? null;
  const heroPrice = normalizeMillionPrice(heroMillion ?? "");
  const visiblePrice = variantPrice ?? (directPrice ? normalizePrice(directPrice[1]) : heroPrice);
  const bedrooms = [...variantBody.matchAll(/Спальня(?:\s+\d+)?:/giu)].length;
  const tildaGallery = parseTildaGallery(html, sourceUrl);
  const fallbackImages = uniqueProjectMedia([
    ...(Array.isArray(product.image) ? product.image : [product.image]),
    ...htmlAttributeValues(html, "data-original"),
    ...htmlAttributeValues(html, "data-src"),
  ].map((value) => typeof value === "string" ? absoluteUrl(value, sourceUrl) : null));
  const imageUrls = uniqueProjectMedia(tildaGallery.length >= 2 ? tildaGallery : fallbackImages).slice(0, 10);
  const conflicts = [];
  if (heroPrice && visiblePrice && heroPrice !== visiblePrice) {
    conflicts.push({
      field: "price",
      values: unique([visiblePrice, heroPrice]),
      evidence: "Цена базовой модификации и маркетинговое поле «Стоимость от» на странице различаются; карточка привязана к базовой модификации.",
    });
  }
  if (titlePrice && visiblePrice && titlePrice !== visiblePrice) {
    conflicts.push({
      field: "price",
      values: unique([visiblePrice, titlePrice]),
      evidence: "Цена базовой модификации в содержимом страницы и цена в title различаются; карточка привязана к видимому блоку базовой модификации.",
    });
  }

  return normalizedSourceProjectSchema.parse({
    sourceUrl,
    manufacturerId: "sq-modyl",
    name: heading
      ? published(heading, "visible-text", "Заголовок H1 официальной страницы серии.")
      : typeof product.name === "string" && product.name.trim()
        ? published(product.name.trim(), "structured-data", "Product JSON-LD.")
        : missing("Название серии не найдено."),
    area: variantArea
      ? published(normalizeArea(variantArea), "visible-text", "Площадь базовой модификации указана в её названии.")
      : directArea
        ? published(normalizeArea(directArea[1]), "visible-text", "Явно подписанное поле «Площадь» в карточке серии.")
        : titleArea
          ? published(normalizeArea(titleArea[1]), "visible-text", "Площадь серии опубликована в title официальной страницы.")
        : missing("Площадь базовой модификации не найдена."),
    price: visiblePrice
      ? published(visiblePrice, "visible-text", directPrice
        ? "Явно подписанное поле «Стоимость» в карточке серии."
        : "Цена базовой модификации в блоке вариантов серии.")
      : missing("Цена базовой модификации не найдена."),
    productionTerm: termMatch
      ? published(normalizeTerm(termMatch[1]), "visible-text", "Видимое поле «Срок изготовления» на странице серии.")
      : missing("Срок изготовления на странице серии не найден."),
    roomCount: missing("Общее количество комнат отдельным полем не опубликовано."),
    bedrooms: bedrooms > 0
      ? published(String(bedrooms), "visible-text", "Спальни перечислены в составе базовой модификации.")
      : missing("Количество спален для базовой модификации отдельно не опубликовано."),
    floors: missing("Этажность отдельным текстовым полем не опубликована."),
    dimensions: variantDimensions
      ? published(normalizeDimensions(variantDimensions), "visible-text", "Габариты базовой модификации в блоке вариантов серии.")
      : missing("Габариты базовой модификации не найдены."),
    technology: derivedFact(
      "Каркасно-модульный",
      "visible-text",
      "Страница описывает каркасную конструкцию, которую производят и доставляют готовыми модулями.",
    ),
    insulation: insulationMatch
      ? published(`${insulationMatch[1]} мм`, "visible-text", "Толщина утеплителя явно указана в составе конструкции проекта.")
      : missing("Толщина утеплителя на странице серии не найдена."),
    completion: /под\s+ключ/iu.test(`${heading} ${pageTitle} ${text.slice(0, 1800)}`)
      ? published("Под ключ", "visible-text", "Формат «под ключ» опубликован в заголовке или первом экране страницы серии.")
      : missing("Формат комплектации «под ключ» на странице серии не найден."),
    media: {
      imageUrls,
      publishedImageCount: imageUrls.length,
      planStatus: detectPlanStatus(imageUrls),
      evidence: "Основная Tilda-галерея страницы серии; служебные изображения и карусели комплектации исключены.",
    },
    conflicts,
  });
};

export const parseProjectByManufacturer = ({ manufacturerId, html, sourceUrl }) => {
  if (manufacturerId === "bygge") return parseByggeProject({ html, sourceUrl });
  if (manufacturerId === "platforma") return parsePlatformaProject({ html, sourceUrl });
  if (manufacturerId === "sq-modyl") return parseSqModylProject({ html, sourceUrl });
  if (manufacturerId === "fps-modul") return parseFpsModulProject({ html, sourceUrl });
  if (manufacturerId === "da-home") return parseDaHomeProject({ html, sourceUrl });
  return parseGenericProject({ manufacturerId, html, sourceUrl });
};

export const discoverByggeProjectUrls = ({ html, sourceUrl = "https://bygge.ru/" }) => unique(
  [...html.matchAll(/href=["']([^"']*katalog\/[a-z0-9-]+\/)["']/giu)]
    .map((match) => absoluteUrl(match[1].trim(), sourceUrl))
    .filter((url) => url && !/\/(?:barnxausyi|byistrovozvodimyie-doma|chetyrekhkomnatnye-modulnye-doma|dvuhkomnatnye-modulnye-doma|modulnye-doma-dlya-kruglogodichnogo-prozhivaniya|modulnye-doma-s-panoramnymi-oknami|modulnye-doma-s-terrasoj|modulnyie-bani|modulnyie-doma(?:-[^/]+)?|trekhkomnatnye-modulnye-doma)\/$/u.test(new URL(url).pathname)),
);

const sqModylProjectPaths = new Set([
  "/smart-box-bathhouse", "/aqua-box-bathhouse", "/akvatoria-bathhouse", "/kristal-boks",
  "/smart-box-guesthouse", "/multi-box-guesthouse", "/aqua-box-guesthouse", "/akvatoria-guesthouse",
  "/modular-smart-home", "/modular-flat-home", "/panorama", "/multi-boks",
]);

export const discoverSqModylProjectUrls = ({ html, sourceUrl = "https://modyl.info/" }) => unique(
  htmlAttributeValues(html, "href")
    .map((value) => absoluteUrl(value, sourceUrl))
    .filter((url) => {
      if (!url) return false;
      const parsed = new URL(url);
      return parsed.origin === new URL(sourceUrl).origin
        && sqModylProjectPaths.has(parsed.pathname.replace(/\/+$/u, ""));
    })
    .map((url) => url.replace(/\/+$/u, "")),
);
