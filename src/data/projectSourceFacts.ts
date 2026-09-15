import { manufacturerRegistry } from "@/data/manufacturers";
import { projects, type Project } from "@/data/projects";
import { generatedCatalogRegistry } from "@/data/generatedCatalogRegistry";

export const UNKNOWN_REQUIRED_PROJECT_FACT = "Уточнить у производителя";

export type ProjectFactStatus = "verified" | "derived" | "not-published" | "not-applicable";

export type ProjectSourceFact = Readonly<{
  value: string | null;
  status: ProjectFactStatus;
  sourceUrl: string;
  checkedAtIso: string;
  evidence: string;
}>;

export type ProjectSourceFacts = Readonly<{
  area: ProjectSourceFact;
  price: ProjectSourceFact;
  productionTerm: ProjectSourceFact;
  productionAddress: ProjectSourceFact;
  technology: ProjectSourceFact;
  insulation: ProjectSourceFact;
  completion: ProjectSourceFact;
  delivery: ProjectSourceFact;
  style: ProjectSourceFact;
  roomCount: ProjectSourceFact;
  bedrooms: ProjectSourceFact;
  bathrooms: ProjectSourceFact;
  floors: ProjectSourceFact;
  dimensions: ProjectSourceFact;
  media?: Readonly<{
    publishedImageCount: number;
    planStatus: "published" | "not-published";
    sourceUrl: string;
    checkedAtIso: string;
    evidence: string;
  }>;
}>;

const CHECKED_AT_ISO = "2026-09-12";
const PLATFORMA_CONTACTS_URL = "https://platforma-modul.ru/contacts";
const PLATFORMA_PRODUCTION_ADDRESS =
  "Свердловская область, г. Березовский, территория Южная промышленная зона, д. 21";
const BYGGE_PRODUCTION_URL = "https://bygge.ru/o-nas/";
const BYGGE_PRODUCTION_ADDRESS = "г. Екатеринбург";

const verified = (value: string, sourceUrl: string, evidence: string): ProjectSourceFact => ({
  value,
  status: "verified",
  sourceUrl,
  checkedAtIso: CHECKED_AT_ISO,
  evidence,
});

const derived = (value: string, sourceUrl: string, evidence: string): ProjectSourceFact => ({
  value,
  status: "derived",
  sourceUrl,
  checkedAtIso: CHECKED_AT_ISO,
  evidence,
});

const notPublished = (sourceUrl: string, evidence: string): ProjectSourceFact => ({
  value: null,
  status: "not-published",
  sourceUrl,
  checkedAtIso: CHECKED_AT_ISO,
  evidence,
});

const notApplicable = (sourceUrl: string, evidence: string): ProjectSourceFact => ({
  value: null,
  status: "not-applicable",
  sourceUrl,
  checkedAtIso: CHECKED_AT_ISO,
  evidence,
});

const hasPublishedValue = (value?: string | null) => Boolean(
  value?.trim()
  && !/^(?:по запросу|срок уточняется|уточнить у производителя|не указан)$/iu.test(value.trim()),
);

const importedProjectFact = (
  value: string | undefined,
  sourceUrl: string,
  evidence: string,
): ProjectSourceFact => hasPublishedValue(value)
  ? verified(value!.trim(), sourceUrl, evidence)
  : notPublished(sourceUrl, `${evidence} Значение на странице проекта не зафиксировано.`);

const importedNumericPlanFact = (
  value: number | undefined,
  sourceUrl: string,
  evidence: string,
  notApplicableToProject = false,
  hasPublishedEvidence = false,
): ProjectSourceFact => {
  if (notApplicableToProject) return notApplicable(sourceUrl, evidence);
  return hasPublishedEvidence && typeof value === "number" && Number.isFinite(value) && value > 0
    ? derived(String(value), sourceUrl, evidence)
    : notPublished(sourceUrl, `${evidence} Значение не зафиксировано.`);
};

/**
 * Базовый паспорт импортированного проекта. Он покрывает весь екатеринбургский
 * срез и намеренно консервативен: площадь, цена, срок и габариты считаются
 * подтверждёнными только когда они сохранены у конкретного проекта. Спальни,
 * санузлы и этажность отмечаются как выведенные из опубликованной планировки.
 * Общие обещания производителя о комплектации и утеплении сюда не переносятся.
 */
const buildImportedProjectSourceFacts = (project: Project): ProjectSourceFacts | null => {
  const manufacturer = manufacturerRegistry[project.manufacturerId];
  const sourceAudit = manufacturer?.profile?.sourceAudit;
  const sourceUrl = project.sourceUrl?.trim();
  if (!sourceAudit || !sourceUrl) return null;

  const isBath = project.productType === "bath";
  const productionAudit = sourceAudit.production;
  const productionAddress = productionAudit.status === "imported"
    && manufacturer.profile?.mapKind !== "office"
    && manufacturer.productionAddress
    && productionAudit.sourceUrl
    ? verified(
        manufacturer.productionAddress,
        productionAudit.sourceUrl,
        "Адрес производства подтверждён аудитом официального сайта производителя.",
      )
    : notPublished(
        productionAudit.sourceUrl ?? sourceAudit.catalog.sourceUrl,
        productionAudit.note,
      );
  const hasPlan = project.gallery.some((item) => item.type === "plan");
  const sourceVerifiedFields = new Set(project.sourceVerifiedFields ?? []);

  return {
    area: importedProjectFact(
      /по запросу|уточняется/iu.test(project.area) ? undefined : project.area,
      sourceUrl,
      "Площадь перенесена из карточки проекта на официальном сайте.",
    ),
    price: importedProjectFact(
      /по запросу|уточняется/iu.test(project.price) ? undefined : project.price,
      sourceUrl,
      "Цена перенесена из карточки проекта на официальном сайте.",
    ),
    productionTerm: importedProjectFact(
      /по запросу|уточняется/iu.test(project.term) ? undefined : project.term,
      sourceUrl,
      "Срок перенесён из карточки конкретного проекта, а не из общего обещания компании.",
    ),
    productionAddress,
    technology: sourceVerifiedFields.has("technology")
      ? verified(project.technology, sourceUrl, "Технология опубликована на странице конкретного проекта.")
      : derived(project.technology, sourceUrl, `Технология определена по официальному разделу и типу проекта «${project.badge}».`),
    insulation: sourceVerifiedFields.has("insulation")
      ? importedProjectFact(project.insulation, sourceUrl, "Утепление опубликовано на странице конкретного проекта.")
      : notPublished(sourceUrl, "Проектное утепление не переносится из общего значения производителя без отдельного подтверждения."),
    completion: sourceVerifiedFields.has("completion")
      ? importedProjectFact(project.completion, sourceUrl, "Комплектация опубликована на странице конкретного проекта.")
      : notPublished(sourceUrl, "Проектная комплектация не переносится из общего значения производителя без отдельного подтверждения."),
    delivery: notPublished(
      sourceUrl,
      "Стоимость и условия доставки для конкретного проекта отдельно не зафиксированы.",
    ),
    style: hasPublishedValue(project.style)
      ? derived(project.style, sourceUrl, "Архитектурный стиль определён по названию и материалам официальной карточки.")
      : notPublished(sourceUrl, "Архитектурный стиль отдельным полем не опубликован."),
    roomCount: notPublished(
      sourceUrl,
      "Общее количество комнат не подменяется текстовым описанием планировки.",
    ),
    bedrooms: importedNumericPlanFact(
      project.beds,
      sourceUrl,
      isBath
        ? "Для модульной бани количество спален не применяется."
        : "Количество спален перенесено из опубликованной планировки.",
      isBath,
      hasPlan || sourceVerifiedFields.has("bedrooms"),
    ),
    bathrooms: importedNumericPlanFact(
      project.baths,
      sourceUrl,
      isBath
        ? "Для модульной бани жилые санузлы не применяются."
        : "Количество санузлов перенесено из опубликованной планировки.",
      isBath,
      hasPlan || sourceVerifiedFields.has("bathrooms"),
    ),
    floors: importedNumericPlanFact(
      project.floors,
      sourceUrl,
      isBath
        ? "Для модульной бани этажность как характеристика жилого дома не применяется."
        : "Этажность перенесена из опубликованной планировки или изображения проекта.",
      isBath,
      hasPlan || sourceVerifiedFields.has("floors"),
    ),
    dimensions: importedProjectFact(
      project.dimensions,
      sourceUrl,
      "Габариты перенесены из карточки проекта на официальном сайте.",
    ),
    media: {
      publishedImageCount: project.gallery.length,
      planStatus: hasPlan ? "published" : "not-published",
      sourceUrl,
      checkedAtIso: sourceAudit.checkedAtIso,
      evidence: hasPlan
        ? "В локальный паспорт импортированы изображения и опубликованная планировка проекта."
        : "В локальный паспорт импортированы доступные изображения; отдельная планировка не зафиксирована.",
    },
  };
};

const importedProjectSourceFactsById = Object.fromEntries(
  projects.flatMap((project) => {
    const facts = buildImportedProjectSourceFacts(project);
    return facts ? [[project.id, facts] as const] : [];
  }),
) as Readonly<Record<number, ProjectSourceFacts>>;

const platformaProductionAddress = verified(
  PLATFORMA_PRODUCTION_ADDRESS,
  PLATFORMA_CONTACTS_URL,
  "На официальной странице контактов отдельно указан адрес производства в Березовском.",
);

type PlatformaProjectFactsInput = {
  sourceUrl: string;
  area: string;
  price: string;
  productionTerm?: string;
  bedrooms?: number;
  bathrooms?: number;
  floors?: number;
  dimensions?: string;
  isBath?: boolean;
  publishedImageCount: number;
  planPublished: boolean;
};

const platformaProjectFacts = ({
  sourceUrl,
  area,
  price,
  productionTerm,
  bedrooms,
  bathrooms,
  floors = 1,
  dimensions,
  isBath = false,
  publishedImageCount,
  planPublished,
}: PlatformaProjectFactsInput): ProjectSourceFacts => ({
  area: verified(
    area,
    sourceUrl,
    isBath
      ? "Площадь опубликована в характеристиках бани."
      : "Площадь дома опубликована в первом блоке проекта.",
  ),
  price: verified(price, sourceUrl, "На официальной странице опубликована стоимость «от»."),
  productionTerm: productionTerm
    ? verified(productionTerm, sourceUrl, "Срок производства опубликован в первом блоке проекта.")
    : notPublished(sourceUrl, "Срок производства на официальной странице не опубликован."),
  productionAddress: platformaProductionAddress,
  technology: verified(
    "Модульная технология",
    sourceUrl,
    isBath
      ? "Проект опубликован производителем как модульная баня."
      : "Проект опубликован производителем в разделе «Модульные дома».",
  ),
  insulation: isBath
    ? notPublished(sourceUrl, "Толщина и климатический режим утепления не опубликованы.")
    : verified(
        "Стены 150 мм, кровля 200 мм",
        sourceUrl,
        "В составе конструкции указано утепление Knauf Aquastatik: стены 150 мм, кровля 200 мм.",
      ),
  completion: verified(
    "Под ключ",
    sourceUrl,
    isBath
      ? "Официальная страница называет объект готовой модульной баней под ключ."
      : "Официальная страница называет объект модульным домом под ключ и публикует состав комплектации.",
  ),
  delivery: isBath
    ? notPublished(sourceUrl, "Стоимость и условия доставки отдельно не опубликованы.")
    : verified(
        "Рассчитывается индивидуально",
        sourceUrl,
        "Производитель предлагает расчет с учетом участка, доставки, фундамента и комплектации.",
      ),
  style: notPublished(sourceUrl, "Название архитектурного стиля явно не опубликовано."),
  roomCount: notPublished(sourceUrl, "Общее количество комнат не используется вместо подтверждённого количества спален."),
  bedrooms: isBath
    ? notApplicable(sourceUrl, "Для модульной бани количество спален не применяется.")
    : bedrooms === undefined
      ? notPublished(sourceUrl, "Количество спален не опубликовано.")
      : verified(String(bedrooms), sourceUrl, "Количество спален указано на странице и плане проекта."),
  bathrooms: isBath
    ? notApplicable(sourceUrl, "Для модульной бани жилые санузлы не применяются.")
    : bathrooms === undefined
      ? notPublished(sourceUrl, "Количество санузлов не опубликовано.")
      : derived(String(bathrooms), sourceUrl, "Количество санузлов выведено из официального плана проекта."),
  floors: isBath
    ? notApplicable(sourceUrl, "Для модульной бани этажность как характеристика жилого дома не применяется.")
    : verified(String(floors), sourceUrl, "Этажность опубликована в структурированных данных проекта и проверена по плану."),
  dimensions: dimensions
    ? verified(dimensions, sourceUrl, "Габариты опубликованы в характеристиках проекта.")
    : notPublished(sourceUrl, "Габариты отдельным текстовым значением не опубликованы."),
  media: {
    publishedImageCount,
    planStatus: planPublished ? "published" : "not-published",
    sourceUrl,
    checkedAtIso: CHECKED_AT_ISO,
    evidence: planPublished
      ? "Основная галерея официальной страницы проверена; в ней опубликована планировка."
      : "Основная галерея официальной страницы проверена; отдельная планировка не опубликована.",
  },
});

const byggePatioSourceUrl = "https://bygge.ru/katalog/patio/";
const byggePatioFacts: ProjectSourceFacts = {
  area: verified("45 м²", byggePatioSourceUrl, "В характеристиках опубликована общая площадь 45 м²."),
  price: verified("2 445 000 ₽", byggePatioSourceUrl, "На странице проекта опубликована цена 2 445 000 рублей."),
  productionTerm: verified(
    "19 д.",
    byggePatioSourceUrl,
    "Производитель указывает сборку на производстве за 19 дней и монтаж на участке за 1 день.",
  ),
  productionAddress: verified(
    BYGGE_PRODUCTION_ADDRESS,
    BYGGE_PRODUCTION_URL,
    "Производитель сообщает о собственном тёплом цехе в Екатеринбурге; точный адрес цеха отдельно не опубликован.",
  ),
  technology: verified(
    "Каркасно-модульная технология",
    byggePatioSourceUrl,
    "Проект опубликован как модульный дом; производитель прямо описывает выпускаемые дома как каркасные.",
  ),
  insulation: verified(
    "Пол, стены и потолок: 150 мм",
    byggePatioSourceUrl,
    "На странице указано утепление пола, стен и потолка 150/150/150 мм.",
  ),
  completion: verified(
    "Под ключ",
    byggePatioSourceUrl,
    "Страница называет проект домом под ключ и публикует состав максимальной комплектации.",
  ),
  delivery: notPublished(
    byggePatioSourceUrl,
    "Доставка и монтаж отмечены как дополнительные опции, но их стоимость и условия не опубликованы.",
  ),
  style: notPublished(byggePatioSourceUrl, "Название архитектурного стиля явно не опубликовано."),
  roomCount: verified("3", byggePatioSourceUrl, "В характеристиках проекта указаны три комнаты."),
  bedrooms: derived("2", byggePatioSourceUrl, "На официальном плане показаны две отдельные спальни."),
  bathrooms: derived("1", byggePatioSourceUrl, "На официальном плане показан один санузел."),
  floors: derived("1", byggePatioSourceUrl, "На официальном плане и фотографиях представлен один этаж."),
  dimensions: verified("7,3 × 6,1 м", byggePatioSourceUrl, "Габариты 7,3 × 6,1 м опубликованы в характеристиках."),
  media: {
    publishedImageCount: 36,
    planStatus: "published",
    sourceUrl: byggePatioSourceUrl,
    checkedAtIso: CHECKED_AT_ISO,
    evidence: "На официальной странице опубликованы фотографии и две планировки проекта.",
  },
};

type ByggeProjectFactsInput = {
  sourceSlug: string;
  area: string;
  price?: string;
  productionTerm: string;
  roomCount: number;
  publishedImageCount: number;
  planPublished: boolean;
  floors?: number;
  insulation?: string;
  completion?: string;
  dimensions?: string;
  isBath?: boolean;
  bathroomCount?: number;
};

const byggeProjectFacts = ({
  sourceSlug,
  area,
  price,
  productionTerm,
  roomCount,
  publishedImageCount,
  planPublished,
  floors = 1,
  insulation,
  completion,
  dimensions,
  isBath = false,
  bathroomCount,
}: ByggeProjectFactsInput): ProjectSourceFacts => {
  const sourceUrl = new URL(sourceSlug, "https://bygge.ru/katalog/").toString();

  return {
    area: verified(area, sourceUrl, "Общая площадь опубликована в характеристиках проекта."),
    price: price
      ? verified(price, sourceUrl, "Текущая стартовая стоимость опубликована на странице проекта.")
      : notPublished(sourceUrl, "Актуальная базовая стоимость на странице проекта не опубликована."),
    productionTerm: verified(
      productionTerm,
      sourceUrl,
      "Срок опубликован в характеристиках проекта на официальном сайте.",
    ),
    productionAddress: verified(
      BYGGE_PRODUCTION_ADDRESS,
      BYGGE_PRODUCTION_URL,
      "Производитель сообщает о собственном тёплом цехе в Екатеринбурге; точный адрес цеха отдельно не опубликован.",
    ),
    technology: verified(
      isBath ? "Модульная технология" : "Каркасно-модульная технология",
      sourceUrl,
      isBath
        ? "Проект опубликован производителем как модульная баня."
        : "Проект опубликован в каталоге модульных объектов Bygge; конструкция описана как каркасная.",
    ),
    insulation: insulation
      ? verified(insulation, sourceUrl, "Толщина утепления пола, стен и потолка опубликована в комплектации проекта.")
      : notPublished(sourceUrl, "Толщина утепления для этого проекта не опубликована."),
    completion: completion
      ? verified(completion, sourceUrl, "Тип стартовой или полной комплектации указан на странице проекта.")
      : notPublished(sourceUrl, "Единая комплектация проекта не опубликована."),
    delivery: notPublished(
      sourceUrl,
      "Стоимость и условия доставки для конкретного проекта отдельно не опубликованы.",
    ),
    style: notPublished(sourceUrl, "Архитектурный стиль не опубликован как отдельная характеристика."),
    roomCount: verified(
      String(roomCount),
      sourceUrl,
      `В характеристиках проекта указано количество комнат: ${roomCount}.`,
    ),
    bedrooms: isBath
      ? notApplicable(sourceUrl, "Для модульной бани количество спален не применяется.")
      : notPublished(sourceUrl, "Количество спален требует отдельной проверки официальной планировки."),
    bathrooms: isBath
      ? notApplicable(sourceUrl, "Для модульной бани жилые санузлы не применяются.")
      : bathroomCount === undefined
        ? notPublished(sourceUrl, "Количество санузлов отдельно не опубликовано.")
        : verified(String(bathroomCount), sourceUrl, "На странице прямо указан оборудованный санузел."),
    floors: derived(
      String(floors),
      sourceUrl,
      "Этажность проверена по официальным изображениям и планировке проекта: все помещения расположены на одном уровне.",
    ),
    dimensions: dimensions
      ? verified(dimensions, sourceUrl, "Габариты опубликованы в характеристиках проекта.")
      : notPublished(sourceUrl, "Корректные габариты здания на странице проекта не опубликованы."),
    media: {
      publishedImageCount,
      planStatus: planPublished ? "published" : "not-published",
      sourceUrl,
      checkedAtIso: CHECKED_AT_ISO,
      evidence: planPublished
        ? "В основной галерее официальной страницы опубликованы фотографии и планировка."
        : "В основной галерее официальной страницы опубликованы фотографии; отдельная планировка не найдена.",
    },
  };
};

/**
 * Проверенный слой фактов. В него попадают только значения, найденные на
 * официальном сайте производителя; отсутствие значения фиксируется явно.
 */
export const projectSourceFactsById: Readonly<Record<number, ProjectSourceFacts>> = {
  ...importedProjectSourceFactsById,
  31: platformaProjectFacts({ sourceUrl: "https://platforma-modul.ru/twin-house", area: "75 м²", price: "3 102 000 ₽", productionTerm: "60 д.", bedrooms: 1, bathrooms: 1, publishedImageCount: 4, planPublished: true }),
  32: platformaProjectFacts({ sourceUrl: "https://platforma-modul.ru/wide-house", area: "56,8 м²", price: "5 480 000 ₽", productionTerm: "60 д.", bedrooms: 2, bathrooms: 1, publishedImageCount: 4, planPublished: true }),
  33: platformaProjectFacts({ sourceUrl: "https://platforma-modul.ru/barn-house", area: "42,9 м²", price: "1 680 000 ₽", productionTerm: "60 д.", bedrooms: 1, bathrooms: 1, publishedImageCount: 4, planPublished: true }),
  34: platformaProjectFacts({ sourceUrl: "https://platforma-modul.ru/bear-house-45", area: "41 м²", price: "2 207 000 ₽", productionTerm: "60 д.", bedrooms: 1, bathrooms: 1, publishedImageCount: 5, planPublished: true }),
  35: platformaProjectFacts({ sourceUrl: "https://platforma-modul.ru/bear-house-77", area: "61,32 м²", price: "3 894 700 ₽", productionTerm: "60 д.", bedrooms: 2, bathrooms: 1, publishedImageCount: 4, planPublished: true }),
  36: platformaProjectFacts({ sourceUrl: "https://platforma-modul.ru/bear-house-86", area: "68,7 м²", price: "4 349 000 ₽", productionTerm: "60 д.", bedrooms: 2, bathrooms: 2, publishedImageCount: 5, planPublished: true }),
  37: platformaProjectFacts({ sourceUrl: "https://platforma-modul.ru/bear-house-134", area: "110 м²", price: "8 762 000 ₽", productionTerm: "60 д.", bedrooms: 2, bathrooms: 2, publishedImageCount: 5, planPublished: true }),
  38: platformaProjectFacts({ sourceUrl: "https://platforma-modul.ru/vast-house", area: "114,9 м²", price: "8 077 600 ₽", productionTerm: "60 д.", bedrooms: 5, bathrooms: 2, publishedImageCount: 5, planPublished: true }),
  39: platformaProjectFacts({ sourceUrl: "https://platforma-modul.ru/bear-house-168", area: "146,4 м²", price: "12 110 400 ₽", productionTerm: "60 д.", bedrooms: 3, bathrooms: 3, publishedImageCount: 4, planPublished: true }),
  437: platformaProjectFacts({ sourceUrl: "https://platforma-modul.ru/bathhouse", area: "18 м²", price: "1 000 000 ₽", dimensions: "6,5 × 2,66 × 3 м", isBath: true, publishedImageCount: 2, planPublished: true }),
  438: platformaProjectFacts({ sourceUrl: "https://platforma-modul.ru/bathhousespa", area: "14,1 м²", price: "1 000 000 ₽", dimensions: "6 × 2,35 × 3,012 м", isBath: true, publishedImageCount: 5, planPublished: true }),
  40: byggePatioFacts,
  41: byggeProjectFacts({ sourceSlug: "tundra/", area: "96 м²", price: "4 283 000 ₽", productionTerm: "35 д.", roomCount: 4, bathroomCount: 1, publishedImageCount: 25, planPublished: true, insulation: "Пол 200 мм, стены 150 мм, потолок 150 мм", completion: "Тёплый контур", dimensions: "8 × 12 м" }),
  42: byggeProjectFacts({ sourceSlug: "sherwood/", area: "87 м²", price: "4 035 000 ₽", productionTerm: "35 д.", roomCount: 4, bathroomCount: 1, publishedImageCount: 11, planPublished: true, insulation: "Пол 200 мм, стены 150 мм, потолок 150 мм", completion: "Тёплый контур", dimensions: "7,3 × 12 м" }),
  43: byggeProjectFacts({ sourceSlug: "senat/", area: "96 м²", price: "4 636 000 ₽", productionTerm: "35 д.", roomCount: 4, bathroomCount: 1, publishedImageCount: 28, planPublished: true, insulation: "Пол 200 мм, стены 150 мм, потолок 200 мм", completion: "Тёплый контур" }),
  44: byggeProjectFacts({ sourceSlug: "family-suite/", area: "72 м²", price: "3 707 000 ₽", productionTerm: "35 д.", roomCount: 2, bathroomCount: 1, publishedImageCount: 4, planPublished: true, insulation: "Пол 200 мм, стены 150 мм, потолок 150 мм", completion: "Комплектация «Макс»", dimensions: "8 × 9 м" }),
  45: byggeProjectFacts({ sourceSlug: "gallant/", area: "59 м²", price: "3 135 000 ₽", productionTerm: "19 д.", roomCount: 3, bathroomCount: 1, publishedImageCount: 8, planPublished: true, insulation: "Пол 200 мм, стены 150 мм, потолок 150 мм", completion: "Комплектация «Макс»", dimensions: "7,3 × 8,1 м" }),
  46: byggeProjectFacts({ sourceSlug: "grandis/", area: "30 м²", price: "1 439 000 ₽", productionTerm: "15 д.", roomCount: 2, bathroomCount: 1, publishedImageCount: 21, planPublished: true, insulation: "Пол, стены и потолок: 150 мм", completion: "Комплектация «Макс»", dimensions: "4,9 × 6 м" }),
  439: byggeProjectFacts({ sourceSlug: "patio-v2/", area: "45 м²", price: "1 949 000 ₽", productionTerm: "19 д.", roomCount: 3, bathroomCount: 1, publishedImageCount: 9, planPublished: true, insulation: "Пол 200 мм, стены 150 мм, потолок 150 мм", completion: "Комплектация «Макс»", dimensions: "7,3 × 6 м" }),
  440: byggeProjectFacts({ sourceSlug: "millari/", area: "62 м²", price: "2 564 000 ₽", productionTerm: "29 д.", roomCount: 3, bathroomCount: 1, publishedImageCount: 30, planPublished: true, insulation: "Пол 200 мм, стены 150 мм, потолок 150 мм", completion: "Тёплый контур", dimensions: "8,6 × 7,3 м" }),
  441: byggeProjectFacts({ sourceSlug: "elen/", area: "79 м²", price: "3 200 000 ₽", productionTerm: "19 д.", roomCount: 3, bathroomCount: 1, publishedImageCount: 4, planPublished: true, insulation: "Пол 200 мм, стены 150 мм, потолок 150 мм", completion: "Тёплый контур", dimensions: "7,9 × 10 м" }),
  442: byggeProjectFacts({ sourceSlug: "barn-salton/", area: "72 м²", price: "3 005 000 ₽", productionTerm: "35 д.", roomCount: 3, bathroomCount: 1, publishedImageCount: 6, planPublished: true, insulation: "Пол 200 мм, стены 150 мм, потолок 150 мм", completion: "Тёплый контур", dimensions: "12 × 6 м" }),
  443: byggeProjectFacts({ sourceSlug: "modulnyij-dom-6x12-salton-v2/", area: "72 м²", price: "3 620 000 ₽", productionTerm: "35 д.", roomCount: 3, bathroomCount: 1, publishedImageCount: 20, planPublished: true, insulation: "Пол 200 мм, стены 150 мм, потолок 150 мм", completion: "Тёплый контур", dimensions: "12 × 6 м" }),
  444: byggeProjectFacts({ sourceSlug: "modulnyij-dom-6x12-salton-v3/", area: "72 м²", price: "3 781 000 ₽", productionTerm: "35 д.", roomCount: 4, bathroomCount: 1, publishedImageCount: 5, planPublished: true, insulation: "Пол 200 мм, стены 150 мм, потолок 150 мм", completion: "Тёплый контур", dimensions: "12 × 6 м" }),
  445: byggeProjectFacts({ sourceSlug: "bygge-kub-45/", area: "80 м²", price: "4 179 000 ₽", productionTerm: "35 д.", roomCount: 3, bathroomCount: 1, publishedImageCount: 4, planPublished: false, insulation: "Пол 200 мм, стены 150 мм, потолок 150 мм", completion: "Комплектация «Макс»", dimensions: "9 × 9 м" }),
  446: byggeProjectFacts({ sourceSlug: "modulnyij-dom-bygge-kub-53/", area: "80 м²", price: "4 706 000 ₽", productionTerm: "35 д.", roomCount: 4, bathroomCount: 1, publishedImageCount: 5, planPublished: true, insulation: "Пол 200 мм, стены 150 мм, потолок 150 мм", completion: "Комплектация «Макс»", dimensions: "9 × 9 м" }),
  447: byggeProjectFacts({ sourceSlug: "grand-senat/", area: "112 м²", price: "5 470 000 ₽", productionTerm: "35 д.", roomCount: 4, bathroomCount: 1, publishedImageCount: 5, planPublished: true, insulation: "Пол 200 мм, стены 150 мм, потолок 200 мм", completion: "Тёплый контур", dimensions: "12,4 × 9 м" }),
  448: byggeProjectFacts({ sourceSlug: "banya-brownie/", area: "25 м²", productionTerm: "12 д.", roomCount: 1, publishedImageCount: 3, planPublished: false, insulation: "Пол 150 мм, стены 100 мм, потолок 150 мм", completion: "Полная комплектация", dimensions: "5 × 5 м", isBath: true }),
  449: byggeProjectFacts({ sourceSlug: "kompleks-tundra/", area: "96 м²", productionTerm: "55 д.", roomCount: 4, publishedImageCount: 5, planPublished: false, completion: "Дом, баня, беседка и навес", dimensions: "20 × 35 м" }),
  450: byggeProjectFacts({ sourceSlug: "kompleks-barn-salton/", area: "70 м²", productionTerm: "55 д.", roomCount: 3, publishedImageCount: 4, planPublished: false, completion: "Максимальный комплекс", dimensions: "20 × 35 м" }),
  451: byggeProjectFacts({ sourceSlug: "kompleks-galant/", area: "59 м²", productionTerm: "35 д.", roomCount: 3, publishedImageCount: 6, planPublished: true, completion: "Дом с террасой и баня" }),
  452: byggeProjectFacts({ sourceSlug: "millari-dacha/", area: "40 м²", price: "2 079 000 ₽", productionTerm: "20 д.", roomCount: 2, bathroomCount: 1, publishedImageCount: 8, planPublished: true, insulation: "Пол, стены и потолок: 150 мм", completion: "Комплектация «Макс»", dimensions: "8 × 5 м" }),
  453: byggeProjectFacts({ sourceSlug: "banya-princ/", area: "15 м²", productionTerm: "12 д.", roomCount: 1, publishedImageCount: 3, planPublished: false, insulation: "Пол 150 мм, стены 100 мм, потолок 100 мм", completion: "Полная комплектация", dimensions: "6 × 2,5 м", isBath: true }),
  454: byggeProjectFacts({ sourceSlug: "bear-terrass/", area: "48 м²", price: "2 765 000 ₽", productionTerm: "19 д.", roomCount: 2, bathroomCount: 1, publishedImageCount: 20, planPublished: true, insulation: "Пол 200 мм, стены 150 мм, потолок 150 мм", completion: "Комплектация «Макс»", dimensions: "6 × 8 м" }),
  ...(generatedCatalogRegistry.projectSourceFacts as unknown as Record<number, ProjectSourceFacts>),
};

export const getProjectSourceFacts = (projectId: number) => projectSourceFactsById[projectId];

export const resolveRequiredProjectFact = (
  fact: ProjectSourceFact | undefined,
  legacyValue?: string,
) => {
  if (!fact) return legacyValue?.trim() || UNKNOWN_REQUIRED_PROJECT_FACT;
  return (fact.status === "verified" || fact.status === "derived") && fact.value
    ? fact.value
    : UNKNOWN_REQUIRED_PROJECT_FACT;
};

export const resolveOptionalProjectFact = (
  fact: ProjectSourceFact | undefined,
  legacyValue?: string,
) => {
  if (!fact) return legacyValue?.trim() || null;
  return (fact.status === "verified" || fact.status === "derived") && fact.value ? fact.value : null;
};

export const resolveOptionalProjectFactNumber = (
  fact: ProjectSourceFact | undefined,
  legacyValue?: number,
) => {
  if (!fact) return typeof legacyValue === "number" && Number.isFinite(legacyValue) ? legacyValue : null;
  if ((fact.status !== "verified" && fact.status !== "derived") || !fact.value) return null;

  const value = Number(fact.value.replace(",", "."));
  return Number.isFinite(value) ? value : null;
};
