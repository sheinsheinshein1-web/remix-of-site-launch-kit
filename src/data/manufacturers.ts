import makerPlatformaLogo from "@/assets/maker-platforma-square.webp";
import byggeLogo from "@/assets/bygge/logo.jpg";
import fpsModulLogo from "@/assets/fps-modul/logo.png";
import budushiyDomLogo from "@/assets/budushiy-dom/logo.png";
import budushiyDomObject1 from "@/assets/budushiy-dom/objects/object-1.webp";
import budushiyDomObject2 from "@/assets/budushiy-dom/objects/object-2.webp";
import budushiyDomObject3 from "@/assets/budushiy-dom/objects/object-3.webp";
import budushiyDomObject4 from "@/assets/budushiy-dom/objects/object-4.webp";
import budushiyDomObject5 from "@/assets/budushiy-dom/objects/object-5.webp";
import durovLogo from "@/assets/durov-house/logo.webp";
import histhutLogo from "@/assets/histhut/logo.webp";
import countryhouseLogo from "@/assets/countryhouse/logo.webp";
import cubadomLogo from "@/assets/cubadom/logo.webp";
import idolhouseLogo from "@/assets/idolhouse/logo.webp";
import woodalpLogo from "@/assets/woodalp/logo.webp";
import boxmateLogo from "@/assets/boxmate/logo.webp";
import uvhouseLogo from "@/assets/uvhouse/logo.webp";
import asteriusLogo from "@/assets/asterius/logo.webp";
import smolaLogo from "@/assets/smola/logo.webp";
import ultradomspbLogo from "@/assets/ultradomspb/logo.webp";
import freedomLogo from "@/assets/freedom/logo.webp";
import chebwoodLogo from "@/assets/chebwood/logo.webp";
import campingdomLogo from "@/assets/campingdom/logo.webp";
import pslcompLogo from "@/assets/pslcomp/logo.webp";
import blackmoduleLogo from "@/assets/blackmodule/logo.webp";
import dommLogo from "@/assets/domm/logo.webp";
import myModuleLogo from "@/assets/my-module/logo.webp";
import cubberLogo from "@/assets/cubber/logo.webp";
import simplehouseLogo from "@/assets/simplehouse/logo.webp";
import panoramicLogo from "@/assets/panoramic-home/logo.webp";
import ambarnLogo from "@/assets/ambarn/logo.webp";
import familyHouseLogo from "@/assets/myfamilyhouse/logo.webp";
import stroygradLogo from "@/assets/stroygrad/logo.webp";
import modulcampLogo from "@/assets/modulcamp/logo.webp";
import ipModulLogo from "@/assets/ip-modul/logo.webp";
import rusmodulLogo from "@/assets/rusmodul-spb/logo.svg";

import { z } from "zod";
import { regionalMakers } from "@/data/regionalBatchProjects";
import { generatedCatalogRegistry } from "@/data/generatedCatalogRegistry";

const externalRatingSchema = z.object({
  rating: z.number().min(0).max(5),
  totalCount: z.number().int().nonnegative(),
  source: z.literal("yandex"),
  sourceLabel: z.string().min(1),
  embedUrl: z.string().url(),
});

const manufacturerLegalSchema = z.object({
  legalName: z.string().min(1),
  status: z.string().min(1),
  registeredAt: z.string().min(1),
  foundingDate: z.string().min(1),
  inn: z.string().min(1),
  kpp: z.string().min(1),
  ogrn: z.string().min(1),
  legalAddress: z.string().min(1),
  director: z.string().min(1),
  mainActivity: z.string().min(1),
  shareCapital: z.string().min(1),
  revenue: z.string().min(1),
  netProfit: z.string().min(1),
  reportingYear: z.string().min(1),
  arbitrationCases: z.string().min(1),
  generalCourtCases: z.string().min(1).optional(),
  enforcementProceedings: z.object({
    open: z.number().int().nonnegative(),
    completed: z.number().int().nonnegative(),
  }),
  unfairSuppliersRegistry: z.string().min(1),
  checkedAt: z.string().min(1),
  checkedAtIso: z.string().min(1),
  sources: z.array(z.object({ label: z.string().min(1), href: z.string().url() })),
});

const manufacturerProfileSchema = z.object({
  groupedProjects: z.literal(true).default(true),
  projectTabs: z.array(z.enum(["houses", "baths", "business"])).min(1).optional(),
  useCatalogSummary: z.boolean().default(false),
  headlineSuffix: z.string().min(1).optional(),
  technologyLabel: z.string().min(1).optional(),
  seo: z.object({
    title: z.string().min(1),
    descriptionTemplate: z.string().min(1),
  }).optional(),
  intro: z.string().min(1).optional(),
  about: z.array(z.string().min(1)).min(1).optional(),
  namePrepositional: z.string().min(1).optional(),
  schemaLogoUrl: z.string().url().optional(),
  coordinates: z.object({ lat: z.number(), lon: z.number() }).optional(),
  mapKind: z.enum(["production", "office"]).default("production"),
  sourceAudit: z.object({
    checkedAtIso: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    catalog: z.object({
      sourceUrl: z.string().url(),
      expectedProjectCount: z.number().int().nonnegative(),
      sourceMode: z.enum(["distinct-project-pages", "shared-catalog-page"]).default("distinct-project-pages"),
    }),
    legal: z.object({
      status: z.enum(["imported", "not-found", "unverified"]),
      sourceUrl: z.string().url().optional(),
      note: z.string().min(1),
    }),
    reviews: z.object({
      status: z.enum(["imported", "not-found", "first-party-only"]),
      sourceUrl: z.string().url().optional(),
      note: z.string().min(1),
    }),
    builtObjects: z.object({
      status: z.enum(["imported", "not-found", "not-imported"]),
      sourceUrl: z.string().url().optional(),
      note: z.string().min(1),
    }),
    production: z.object({
      status: z.enum(["imported", "not-found", "unverified"]),
      sourceUrl: z.string().url().optional(),
      note: z.string().min(1),
    }),
    social: z.object({
      youtube: z.object({
        status: z.enum(["imported", "not-found", "unverified"]),
        sourceUrl: z.string().url().optional(),
        note: z.string().min(1),
      }),
      telegram: z.object({
        status: z.enum(["imported", "not-found", "unverified"]),
        sourceUrl: z.string().url().optional(),
        note: z.string().min(1),
      }),
    }),
  }).optional(),
  legal: manufacturerLegalSchema.optional(),
  builtObjects: z.array(z.object({
    src: z.string().min(1),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
  })).optional(),
  social: z.object({
    telegramChannel: z.string().min(1).optional(),
    telegramPosts: z.array(z.number().int().positive()).default([]),
    youtubeChannelUrl: z.string().url().optional(),
    youtubeVideos: z.array(z.object({
      id: z.string().min(1),
      title: z.string().min(1),
      publishedLabel: z.string().min(1),
      thumbnail: z.string().url(),
    })),
  }).optional(),
}).superRefine((profile, context) => {
  if (profile.projectTabs && !profile.sourceAudit) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["sourceAudit"],
      message: "Расширенный профиль нельзя публиковать без полного аудита источников",
    });
  }
});

export const manufacturerSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  initials: z.string().min(1),
  logo: z.string().optional(),
  logoFit: z.enum(["contain", "cover"]).default("contain"),
  logoBackground: z.enum(["light", "dark", "transparent"]).default("light"),
  siteUrl: z.string().url().optional(),
  productionAddress: z.string().optional(),
  phone: z.string().optional(),
  additionalPhones: z.array(z.string()).optional(),
  email: z.string().email().optional(),
  telegram: z.string().optional(),
  verified: z.boolean().default(false),
  externalRating: externalRatingSchema.optional(),
  profile: manufacturerProfileSchema.optional(),
});

export type Maker = z.input<typeof manufacturerSchema>;
export type Manufacturer = z.output<typeof manufacturerSchema>;
export type ManufacturerProfile = z.output<typeof manufacturerProfileSchema>;
export type ManufacturerProjectTab = NonNullable<ManufacturerProfile["projectTabs"]>[number];
export type ManufacturerLegal = z.output<typeof manufacturerLegalSchema>;
export type ManufacturerBuiltObject = NonNullable<ManufacturerProfile["builtObjects"]>[number];
export type ManufacturerSocial = NonNullable<ManufacturerProfile["social"]>;

export const PLATFORMA: Maker = {
  name: "Платформа",
  initials: "ПЛ",
  id: "platforma",
  verified: true,
  logo: makerPlatformaLogo,
  logoFit: "cover",
  logoBackground: "transparent",
  siteUrl: "https://platforma-modul.ru/",
  productionAddress: "Свердловская область, г. Березовский, территория Южная промышленная зона, д. 21",
  phone: "+7 (906) 858-31-23",
  email: "sales@platforma-modul.ru",
  telegram: "PlatformaModul",
  externalRating: {
    rating: 4.3,
    totalCount: 5,
    source: "yandex",
    sourceLabel: "Яндекс",
    embedUrl: "https://yandex.ru/maps-reviews-widget/91516424053?comments",
  },
  profile: {
    groupedProjects: true,
    projectTabs: ["houses", "baths", "business"],
    useCatalogSummary: true,
    headlineSuffix: "— модульные дома и бани под ключ для жизни и бизнеса в Екатеринбурге",
    technologyLabel: "Каркасно-модульная технология",
    seo: {
      title: "Платформа — модульные дома и бани в Екатеринбурге",
      descriptionTemplate: "{projectCount} проектов «Платформы»: модульные дома и бани под ключ в Екатеринбурге, решения для глэмпингов и баз отдыха, цены, планировки и отзывы.",
    },
    intro: "Готовые дома и бани заводской сборки с адаптацией архитектуры под участок — для круглогодичной жизни, отдыха, глэмпингов и баз отдыха.",
    namePrepositional: "Платформе",
    schemaLogoUrl: "https://static.tildacdn.com/tild6331-3532-4635-b130-373133653236/Group_145696.svg",
    coordinates: { lat: 56.89275, lon: 60.783923 },
    sourceAudit: {
      checkedAtIso: "2026-09-12",
      catalog: { sourceUrl: "https://platforma-modul.ru/", expectedProjectCount: 11 },
      legal: { status: "imported", sourceUrl: "https://egrul.nalog.ru/", note: "Реквизиты и статус перенесены с проверкой по открытым реестрам." },
      reviews: { status: "imported", sourceUrl: "https://yandex.ru/maps-reviews-widget/91516424053?comments", note: "Подключён официальный виджет отзывов Яндекс Карт." },
      builtObjects: { status: "imported", sourceUrl: "https://platforma-modul.ru/", note: "Фотографии выполненных объектов перенесены в профиль." },
      production: { status: "imported", sourceUrl: "https://platforma-modul.ru/contacts", note: "Адрес производства и координаты проверены по официальным контактам." },
      social: {
        youtube: { status: "imported", note: "В профиль добавлены проверенные публикации официального канала." },
        telegram: { status: "imported", sourceUrl: "https://t.me/PlatformaModul", note: "В профиль добавлены публикации официального Telegram-канала." },
      },
    },
    about: [
      "«Платформа» — производитель модульных домов и бань из Екатеринбурга. Компания создаёт решения для круглогодичного проживания, загородного отдыха и бизнеса, совмещая заводскую сборку модулей с адаптацией архитектуры под участок и задачи будущего владельца.",
      "В каталоге «Много места» собраны компактные и семейные модульные дома, барнхаусы, готовые бани и решения для коммерческого размещения. Планировку, фасад, комплектацию и дополнительные опции производитель может уточнить под конкретный сценарий использования.",
      "Модули собирают в двух тёплых производственных цехах в Березовском. После выбора проекта и согласования комплектации компания производит конструкции, организует доставку на участок, монтаж на фундаменте и подключение предусмотренных инженерных систем.",
      "На странице производителя собраны проекты с ценами и характеристиками, фотографии выполненных объектов, расположение производства и отзывы покупателей с Яндекс Карт. Это позволяет сравнить модели «Платформы» и проверить основную информацию о компании до перехода на её официальный сайт.",
    ],
    legal: {
      legalName: "ООО «Платформа. Модульное производство»",
      status: "Действует",
      registeredAt: "15 марта 2024",
      foundingDate: "2024-03-15",
      inn: "6678135856",
      kpp: "667801001",
      ogrn: "1246600012581",
      legalAddress: "620027, Свердловская область, г. Екатеринбург, ул. Азина, стр. 22/5",
      director: "Тореев Михаил Вячеславович",
      mainActivity: "Строительство жилых и нежилых зданий",
      shareCapital: "10 000 ₽",
      revenue: "54,3 млн ₽",
      netProfit: "622 тыс. ₽",
      reportingYear: "2025",
      arbitrationCases: "Не найдено",
      enforcementProceedings: { open: 0, completed: 0 },
      unfairSuppliersRegistry: "Не числится",
      checkedAt: "9 сентября 2026",
      checkedAtIso: "2026-09-09",
      sources: [
        { label: "ЕГРЮЛ ФНС", href: "https://egrul.nalog.ru/" },
        { label: "ГИР БО ФНС", href: "https://bo.nalog.ru/" },
        { label: "Арбитражные дела", href: "https://kad.arbitr.ru/" },
        { label: "ФССП", href: "https://fssp.gov.ru/iss/ip" },
        { label: "РНП ЕИС", href: "https://zakupki.gov.ru/epz/dishonestsupplier/search/results.html" },
      ],
    },
    builtObjects: [
      { src: "https://static.tildacdn.com/tild6166-3162-4838-a431-356364366566/1-1-2.jpg", width: 894, height: 1136 },
      { src: "https://static.tildacdn.com/tild3138-6132-4432-b135-613932376132/2.jpg", width: 1154, height: 810 },
      { src: "https://static.tildacdn.com/tild3737-3530-4232-b165-333361393133/_WhatsApp_2025-08-25.jpg", width: 1280, height: 960 },
      { src: "https://static.tildacdn.com/tild3831-6530-4436-b735-383638373361/IMG_36156.png", width: 1400, height: 1711 },
      { src: "https://static.tildacdn.com/tild3536-6631-4763-b331-313533316432/IMG_36891.png", width: 1200, height: 1600 },
      { src: "https://static.tildacdn.com/tild6532-3666-4530-b163-613231626261/IMG_36771.png", width: 1680, height: 1144 },
      { src: "https://static.tildacdn.com/tild6233-3936-4936-a139-366463633436/1.jpg", width: 1680, height: 1177 },
      { src: "https://static.tildacdn.com/tild3037-3063-4261-b231-383361623861/2.jpg", width: 1536, height: 1152 },
      { src: "https://static.tildacdn.com/tild6537-6338-4238-b964-303639393561/IMG-20250830-WA00231.jpg", width: 1600, height: 1200 },
      { src: "https://static.tildacdn.com/tild3934-3165-4938-a538-386665393836/6.jpg", width: 1600, height: 1139 },
      { src: "https://static.tildacdn.com/tild3461-3734-4238-a661-666331393539/7.jpg", width: 1200, height: 1535 },
    ],
    social: {
      telegramChannel: "PlatformaModul",
      telegramPosts: [328, 327, 326],
      youtubeVideos: [
        { id: "Fn4egeR53y0", title: "Модульные дома и бани с доставкой по Свердловской области", publishedLabel: "1 сентября 2026", thumbnail: "https://i3.ytimg.com/vi/Fn4egeR53y0/hqdefault.jpg" },
        { id: "Z31Y_icFwlY", title: "Модульные дома и бани с доставкой по Свердловской области", publishedLabel: "27 августа 2026", thumbnail: "https://i3.ytimg.com/vi/Z31Y_icFwlY/hqdefault.jpg" },
        { id: "0ieKu8aZ5HE", title: "Строительство модульных домов", publishedLabel: "25 августа 2026", thumbnail: "https://i1.ytimg.com/vi/0ieKu8aZ5HE/hqdefault.jpg" },
        { id: "VHd30kYPzWo", title: "Утепление модульного дома", publishedLabel: "15 июня 2026", thumbnail: "https://i.ytimg.com/vi/VHd30kYPzWo/hqdefault.jpg" },
        { id: "4F9vveTBe6o", title: "Модульные дома и бани с доставкой по Свердловской области", publishedLabel: "11 июня 2026", thumbnail: "https://i.ytimg.com/vi/4F9vveTBe6o/hqdefault.jpg" },
        { id: "lfCYqqVPseA", title: "Доставка модульных домов и бань по Свердловской области", publishedLabel: "8 июня 2026", thumbnail: "https://i.ytimg.com/vi/lfCYqqVPseA/hqdefault.jpg" },
      ],
    },
  },
};


export const BYGGE: Maker = {
  name: "Bygge",
  initials: "BG",
  logo: byggeLogo,
  logoFit: "cover",
  logoBackground: "transparent",
  id: "bygge",
  verified: true,
  siteUrl: "https://bygge.ru/",
  productionAddress: "г. Екатеринбург, ул. Хлебная, 17",
  phone: "+7 (982) 693-70-39",
  email: "bygge_ural@mail.ru",
  telegram: "bygge_rus",
  externalRating: {
    rating: 4.4,
    totalCount: 18,
    source: "yandex",
    sourceLabel: "Яндекс",
    embedUrl: "https://yandex.ru/maps-reviews-widget/183856102596?comments",
  },
  profile: {
    groupedProjects: true,
    projectTabs: ["houses", "baths", "business"],
    mapKind: "office",
    headlineSuffix: "— модульные дома и бани в Екатеринбурге",
    technologyLabel: "Модульная технология",
    seo: {
      title: "Bygge — готовые модульные дома в Екатеринбурге",
      descriptionTemplate: "{projectCount} проектов Bygge: модульные дома, бани и комплексы в Екатеринбурге, цены и планировки. Сроки и гарантия зависят от выбранного проекта.",
    },
    intro: "Модульные дома и бани из собственного тёплого цеха в Екатеринбурге. Комплектация, срок и гарантия зависят от выбранного проекта.",
    namePrepositional: "Bygge",
    about: [
      "Bygge — производитель модульных домов из Екатеринбурга. Компания выпускает готовые дома для круглогодичного проживания и загородного отдыха на собственном производстве.",
      "Дома собирают в тёплом цехе при контролируемой температуре и влажности. Производитель заявляет контроль качества на каждом этапе, строительство под ключ и готовность основных моделей к проживанию после монтажа.",
      "Команда работает в строительной отрасли с 2009 года, а бренд BYGGE развивает с 2020 года. Актуальная гарантия составляет до 10 лет в зависимости от проекта. Возможности, сроки и окончательная стоимость зависят от выбранного проекта, комплектации и участка.",
      "Компания сообщает о собственном тёплом цехе в Екатеринбурге. Офис и демонстрационная площадка находятся по адресу: улица Хлебная, 17. На странице собраны проекты с ценами, характеристиками и отзывами покупателей.",
    ],
    coordinates: { lat: 56.7923281, lon: 60.7321339 },
    sourceAudit: {
      checkedAtIso: "2026-09-12",
      catalog: { sourceUrl: "https://bygge.ru/katalog/", expectedProjectCount: 23 },
      legal: { status: "imported", sourceUrl: "https://egrul.nalog.ru/", note: "Реквизиты ИП проверены по ЕГРИП. Связь с сайтом подтверждается контактным адресом msivashov@mail.ru в официальной политике обработки данных и совпадающими открытыми источниками." },
      reviews: { status: "imported", sourceUrl: "https://yandex.ru/maps-reviews-widget/183856102596?comments", note: "Подключён официальный виджет отзывов Яндекс Карт." },
      builtObjects: { status: "imported", sourceUrl: "https://bygge.ru/gotovyie-proektyi/", note: "Импортированы опубликованные производителем реализованные объекты с названиями, годами и площадями." },
      production: { status: "imported", sourceUrl: "https://bygge.ru/o-nas/", note: "Наличие собственного тёплого цеха в Екатеринбурге подтверждено; точный адрес цеха не опубликован. Хлебная, 17 — офис и демонстрационная площадка." },
      social: {
        youtube: { status: "imported", note: "В профиль добавлены проверенные публикации официального канала." },
        telegram: { status: "imported", sourceUrl: "https://t.me/bygge_rus", note: "В профиль добавлены публикации официального Telegram-канала." },
      },
    },
    legal: {
      legalName: "ИП Ивашов Михаил Сергеевич",
      status: "Действует",
      registeredAt: "5 февраля 2009",
      foundingDate: "2009-02-05",
      inn: "661701160979",
      kpp: "Не применяется",
      ogrn: "309661703600027",
      legalAddress: "Свердловская область, г. Екатеринбург",
      director: "Ивашов Михаил Сергеевич",
      mainActivity: "Строительство жилых и нежилых зданий",
      shareCapital: "Не применяется",
      revenue: "Не публикуется",
      netProfit: "Не публикуется",
      reportingYear: "—",
      arbitrationCases: "Не обнаружено",
      enforcementProceedings: { open: 0, completed: 0 },
      unfairSuppliersRegistry: "Не числится",
      checkedAt: "11 сентября 2026",
      checkedAtIso: "2026-09-11",
      sources: [
        { label: "ЕГРИП ФНС", href: "https://egrul.nalog.ru/" },
        { label: "Политика обработки данных Bygge", href: "https://bygge.ru/politika-konfidenczialnosti/" },
        { label: "Связь бренда с ИП", href: "https://www.metrtv.ru/articles/country_estate/17861" },
        { label: "Арбитражные дела", href: "https://kad.arbitr.ru/" },
        { label: "ФССП", href: "https://fssp.gov.ru/iss/ip" },
        { label: "РНП ЕИС", href: "https://zakupki.gov.ru/epz/dishonestsupplier/search/results.html" },
      ],
    },
    builtObjects: [
      { src: "https://bygge.ru/assets/cache_image/resources/181/big/dsc09931_450x445_d70.jpg", width: 450, height: 445 },
      { src: "https://bygge.ru/assets/cache_image/resources/180/big/dji-0783_450x445_d70.jpg", width: 450, height: 445 },
      { src: "https://bygge.ru/assets/cache_image/resources/183/big/dsc00151_450x445_d70.jpg", width: 450, height: 445 },
      { src: "https://bygge.ru/assets/cache_image/resources/146/big/dsc06910_450x445_d70.jpg", width: 450, height: 445 },
      { src: "https://bygge.ru/assets/cache_image/resources/164/big/dji-0737_450x445_d70.jpg", width: 450, height: 445 },
      { src: "https://bygge.ru/assets/cache_image/resources/74/big/img20230411172039_450x445_d70.jpg", width: 450, height: 445 },
    ],
    social: {
      telegramChannel: "bygge_rus",
      telegramPosts: [2999, 2998, 2997],
      youtubeVideos: [
        { id: "x_gU3o2wfDo", title: "Внутри готового дома BYGGE", publishedLabel: "11 сентября 2026", thumbnail: "https://i1.ytimg.com/vi/x_gU3o2wfDo/hqdefault.jpg" },
        { id: "bKtuXaXRpEo", title: "Обновление террасы готового дома", publishedLabel: "11 сентября 2026", thumbnail: "https://i3.ytimg.com/vi/bKtuXaXRpEo/hqdefault.jpg" },
        { id: "DebEqeqHOS0", title: "Дом BYGGE в коттеджном посёлке Александрия", publishedLabel: "11 сентября 2026", thumbnail: "https://i1.ytimg.com/vi/DebEqeqHOS0/hqdefault.jpg" },
        { id: "cB3af_sf608", title: "Благоустройство территории у выставочного дома", publishedLabel: "8 сентября 2026", thumbnail: "https://i4.ytimg.com/vi/cB3af_sf608/hqdefault.jpg" },
        { id: "Jb8VP_h0DxY", title: "Работы на выставочном доме BYGGE", publishedLabel: "4 сентября 2026", thumbnail: "https://i3.ytimg.com/vi/Jb8VP_h0DxY/hqdefault.jpg" },
        { id: "IruXO5s7-8g", title: "Проект MILANI в посёлке Калиновский", publishedLabel: "1 сентября 2026", thumbnail: "https://i2.ytimg.com/vi/IruXO5s7-8g/hqdefault.jpg" },
      ],
    },
  },
};
export const GLEZMAN: Maker = {
  name: "Glezman Group",
  initials: "GG",
  id: "glezman",
};
export const DIVODOM: Maker = {
  name: "ДивоДом",
  initials: "ДД",
  id: "divodom",
  siteUrl: "https://www.divodom.net/",
};
export const GRADODOM: Maker = {
  name: "ГрадоДом",
  initials: "ГД",
  id: "gradodom",
  siteUrl: "https://novostroy159.ru/",
};
export const ZAGORODOM: Maker = {
  name: "СК «Загородом»",
  initials: "ЗГ",
  id: "zagorodom",
  siteUrl: "https://zagorodom59.ru/",
};
export const APA: Maker = {
  name: "Апа Групп",
  initials: "АА",
  id: "apa",
  siteUrl: "https://apagrupp.ru/",
};
export const PRIME_MODUL: Maker = {
  name: "Прайм Модуль",
  initials: "ПМ",
  id: "prime-modul",
  siteUrl: "https://prime-module.ru/",
};
export const UTKINO: Maker = {
  name: "СК Уткино",
  initials: "УТ",
  id: "utkino",
  siteUrl: "https://sk-utkino.ru/catalog",
};
export const TEPLODINA: Maker = {
  name: "Теплодина",
  initials: "ТД",
  id: "teplodina",
  siteUrl: "https://teplodina.ru/product-category/doma/karkasnye-doma/",
};
export const KARKAS_HAUS: Maker = {
  name: "Karkas.haus",
  initials: "KH",
  id: "karkas-haus",
  siteUrl: "https://karkas.haus/doma",
};
export const URAL_HOUSE: Maker = {
  name: "Урал Хаус",
  initials: "УХ",
  id: "ural-house",
  siteUrl: "https://ural-house.ru/",
};
export const HOCHU_DOM: Maker = {
  name: "Хочу Дом",
  initials: "ХД",
  id: "hochu-dom",
  siteUrl: "https://hochu-dom.ru/",
};
export const BEREST_DOM: Maker = {
  name: "Берест",
  initials: "БР",
  id: "berest-dom",
  siteUrl: "https://berest-dom.ru/product/",
};
export const RIFT: Maker = {
  name: "РИФТ",
  initials: "РФ",
  id: "rift",
  siteUrl: "https://www.rift.ru/projects/doma-i-kottedzhi/karkasnye-doma/",
};
export const IZBRUSA: Maker = {
  name: "Из Бруса",
  initials: "ИБ",
  id: "izbrusa",
  siteUrl: "https://izbrusa.com/category/karkasnye-doma/",
};
export const SCANDI_ECODOM: Maker = {
  name: "Сканди ЭкоДом",
  initials: "СЭ",
  id: "scandiecodom",
  siteUrl: "https://scandiecodom.ru/houses/",
};
export const KARKAS_POVOLZHYA: Maker = {
  name: "Каркас Поволжья",
  initials: "КП",
  id: "karkas-povolzhya",
  siteUrl: "https://karkasdoma.pro/projects/frame/",
};
export const KAZANSTROY16: Maker = {
  name: "Строй Дом",
  initials: "СД",
  id: "kazanstroy16",
  siteUrl: "https://kazanstroy16.ru/building/karkassnye-doma/",
};
export const ASKHOME: Maker = {
  name: "AskHome",
  initials: "AH",
  id: "askhome",
  siteUrl: "https://askhome.me/projects/",
};
export const DOMOTEKA: Maker = {
  name: "Домотека",
  initials: "ДМ",
  id: "domoteka",
  siteUrl: "https://domoteka-krd.ru/karkasnye-doma/",
};
export const KARKAS_DOM_YUG: Maker = {
  name: "Каркасный Дом Юг",
  initials: "КЮ",
  id: "karkas-dom-yug",
  siteUrl: "https://xn-----6kcare7afbyhptq5m4b.xn--p1ai/",
};
export const SIBIRYAK: Maker = {
  name: "Сибиряк",
  initials: "СБ",
  id: "sibiryak",
  siteUrl: "https://sibiryak23.ru/dom-barn/",
};
export const SVOI_HOUSE: Maker = {
  name: "СК «Свой»",
  initials: "СВ",
  id: "svoi-house",
  siteUrl: "https://svoi.house/karkas",
};
export const BAGROVSTROY: Maker = {
  name: "Багров Строй",
  initials: "БС",
  id: "bagrovstroy",
  siteUrl: "https://bagrovstroy.ru/karkasnye-doma",
};
export const DOMAKARKAS: Maker = {
  name: "Строй Комфорт",
  initials: "ДК",
  id: "domakarkas",
  siteUrl: "https://domakarkas.ru/proekty-karkasnyh-domov/",
};
export const SK_GARMONIYA: Maker = {
  name: "СК Гармония",
  initials: "ГР",
  id: "sk-garmoniya",
  siteUrl: "https://skgarmoniya.ru/catalog/doma-karkas/",
};
export const DOMA_OT_MIHALYCHA: Maker = {
  name: "Дома от Михалыча",
  initials: "ДМ",
  id: "doma-ot-mihalycha",
  siteUrl: "https://xn-----6kccat5azaddrd6c4b6a4d.xn--p1ai/proekty/karkasniye-doma/",
};
export const BARNSTUDIO: Maker = {
  name: "Barn Studio",
  initials: "BS",
  id: "barnstudio",
  siteUrl: "https://barnstudio.ru/barnhouse",
};
export const BELI_DOM: Maker = {
  name: "Белый дом",
  initials: "БД",
  id: "beli-dom",
  siteUrl: "https://beli-dom.ru/catalog/?technology=karkasnye-doma",
};
export const MASTERGRUPP_BARNAUL: Maker = {
  name: "МастерГруппБарнаул",
  initials: "МГ",
  id: "mastergrupp-barnaul",
  siteUrl: "https://stroy-dom-barnaul.ru/building/karkassnye-doma/",
  productionAddress: "г. Барнаул, проезд Южный, 9",
  phone: "+7 (3852) 22-24-13",
  email: "info@stroy-dom-barnaul.ru",
};
export const PRAKTIKA_STROY: Maker = {
  name: "Практика Строй",
  initials: "ПС",
  id: "praktika-stroy",
  siteUrl: "https://praktika-stroy.ru/modulnye-doma/kruglogodichnoe-prozhivanie",
  productionAddress: "Санкт-Петербург и Ленинградская область",
  phone: "+7 (901) 132-76-76",
};
export const ECO_CITY: Maker = {
  name: "Eco-City",
  initials: "EC",
  id: "eco-city",
  siteUrl: "https://eco-city.spb.ru/product-category/modulnye-doma/",
  productionAddress: "Санкт-Петербург и Ленинградская область",
};
export const MODOM: Maker = {
  name: "Modom",
  initials: "MO",
  id: "modom",
  siteUrl: "https://modom.pro/",
  productionAddress: "Ленинградская область, Всеволожский район, д. Порошкино, Промышленный проезд, 2Б",
  phone: "+7 (812) 615-22-51",
  additionalPhones: ["+7 (911) 977-55-90"],
  email: "sales@modom.pro",
  telegram: "https://t.me/modom_spb",
  profile: {
    intro: "Modom — производитель готовых модульных домов для дачи и круглогодичного проживания.",
    about: ["Modom — производитель модульных домов из Санкт-Петербурга и Ленинградской области. Компания выпускает готовые модульные решения UNO и серию О2 для дачи и круглогодичного проживания."],
    coordinates: { lat: 60.11911, lon: 30.349878 },
  },
};
export const HOUSEBOX: Maker = {
  name: "HouseBox",
  initials: "HB",
  id: "housebox",
  siteUrl: "https://housebox-spb.ru/",
  productionAddress: "Санкт-Петербург и Ленинградская область",
};
export const GLAVLES: Maker = {
  name: "Главлес",
  initials: "ГЛ",
  id: "glavles",
  verified: true,
  logo: "https://glavles.com/img/favicon/apple-touch-icon-180x180.png",
  logoFit: "cover",
  logoBackground: "transparent",
  siteUrl: "https://promo.glavles.com/",
  productionAddress: "Свердловская область, с. Туринская Слобода, ул. Лесная, 5",
  phone: "+7 (343) 206-50-88",
  additionalPhones: ["+7 (912) 254-39-40", "+7 (919) 373-80-88"],
  email: "info@glavles.com",
  externalRating: {
    rating: 4,
    totalCount: 16,
    source: "yandex",
    sourceLabel: "Яндекс",
    embedUrl: "https://yandex.ru/maps-reviews-widget/1747182160?comments",
  },
  profile: {
    groupedProjects: true,
    projectTabs: ["houses", "baths", "business"],
    useCatalogSummary: true,
    headlineSuffix: "— деревянные модульные дома полного цикла в Свердловской области",
    technologyLabel: "Деревянная модульная технология",
    seo: {
      title: "Главлес — деревянные модульные дома в Екатеринбурге",
      descriptionTemplate: "{projectCount} проектов «Главлеса» площадью 12–87 м²: деревянные модульные дома в Екатеринбурге и области, цены, планировки, решения для глэмпинга и отзывы.",
    },
    intro: "Одномодульные и многомодульные дома площадью 12–87 м² из древесины собственного цикла — для проживания, баз отдыха, глэмпингов и загородных отелей.",
    namePrepositional: "«Главлесе»",
    schemaLogoUrl: "https://glavles.com/img/logo.svg",
    coordinates: { lat: 57.6342516, lon: 64.3762247 },
    sourceAudit: {
      checkedAtIso: "2026-09-12",
      catalog: { sourceUrl: "https://promo.glavles.com/#catalog", expectedProjectCount: 13 },
      legal: { status: "imported", sourceUrl: "https://egrul.nalog.ru/", note: "Реквизиты и статус юридического лица перенесены после проверки." },
      reviews: { status: "imported", sourceUrl: "https://yandex.ru/maps-reviews-widget/1747182160?comments", note: "Подключён официальный виджет отзывов Яндекс Карт." },
      builtObjects: { status: "not-found", sourceUrl: "https://promo.glavles.com/", note: "Отдельная проверяемая галерея выполненных объектов на официальном сайте не найдена." },
      production: { status: "imported", sourceUrl: "https://glavles.com/", note: "Адрес производства и координаты проверены по официальным контактам." },
      social: {
        youtube: { status: "imported", sourceUrl: "https://www.youtube.com/channel/UCrUSAQr4iLHU896XRFzfxHA", note: "В профиль добавлены публикации официального YouTube-канала." },
        telegram: { status: "not-found", note: "Подтверждённый Telegram-канал при проверке не найден." },
      },
    },
    about: [
      "«Главлес» — производитель деревянных модульных домов и бань из Свердловской области. Компания работает с древесиной полного цикла и выпускает одномодульные и многомодульные решения для сезонного и круглогодичного проживания.",
      "В официальном каталоге представлены 13 моделей площадью от 12 до 87 м². Часть компактных проектов можно адаптировать под баню, а несколько модулей — объединять, увеличивать по ширине или дополнять открытой и крытой террасой.",
      "Производитель сообщает о 26-летнем опыте в домостроении, 2 347 построенных домах и сроке монтажа от нескольких дней до четырёх недель. В круглогодичных комплектациях предусмотрены внутренняя отделка, электрика и инженерные коммуникации внутри дома.",
      "Производство находится в селе Туринская Слобода. Компания указывает полный цикл обработки древесины: распиловку, сушку до влажности 10%, строжку и калибровку заготовок, а также заводскую сборку стеновых модулей на стапелях.",
    ],
    legal: {
      legalName: "ООО «Главлес»",
      status: "Действует",
      registeredAt: "22 декабря 2006",
      foundingDate: "2006-12-22",
      inn: "6651004503",
      kpp: "667601001",
      ogrn: "1069656004439",
      legalAddress: "623930, Свердловская область, с. Туринская Слобода, ул. Лесная, д. 5",
      director: "Коробов Игорь Геннадьевич",
      mainActivity: "Распиловка и строгание древесины",
      shareCapital: "10 000 ₽",
      revenue: "21,36 млн ₽",
      netProfit: "753 тыс. ₽",
      reportingYear: "2025",
      arbitrationCases: "Не обнаружено",
      enforcementProceedings: { open: 0, completed: 0 },
      unfairSuppliersRegistry: "Не числится",
      checkedAt: "11 сентября 2026",
      checkedAtIso: "2026-09-11",
      sources: [
        { label: "ЕГРЮЛ ФНС", href: "https://egrul.nalog.ru/" },
        { label: "ГИР БО ФНС", href: "https://bo.nalog.ru/" },
        { label: "Арбитражные дела", href: "https://kad.arbitr.ru/" },
        { label: "ФССП", href: "https://fssp.gov.ru/iss/ip" },
        { label: "РНП ЕИС", href: "https://zakupki.gov.ru/epz/dishonestsupplier/search/results.html" },
      ],
    },
    social: {
      youtubeChannelUrl: "https://www.youtube.com/channel/UCrUSAQr4iLHU896XRFzfxHA",
      youtubeVideos: [
        { id: "c6IPqy4JbcU", title: "Модульные дома. База отдыха", publishedLabel: "13 декабря 2022", thumbnail: "https://i4.ytimg.com/vi/c6IPqy4JbcU/hqdefault.jpg" },
        { id: "r-tG7UdBvTI", title: "Монтаж ендовы в каркасной Т-образной крыше", publishedLabel: "21 февраля 2022", thumbnail: "https://i3.ytimg.com/vi/r-tG7UdBvTI/hqdefault.jpg" },
        { id: "cEpDD_kLdNA", title: "Профилированный брус в Екатеринбурге", publishedLabel: "16 ноября 2020", thumbnail: "https://i4.ytimg.com/vi/cEpDD_kLdNA/hqdefault.jpg" },
        { id: "0dz1CS6QMV0", title: "Дом в серо-голубых тонах", publishedLabel: "5 июня 2020", thumbnail: "https://i1.ytimg.com/vi/0dz1CS6QMV0/hqdefault.jpg" },
        { id: "a2YORaznQps", title: "Дом из норвежского лафета: готовый ремонт", publishedLabel: "29 мая 2020", thumbnail: "https://i2.ytimg.com/vi/a2YORaznQps/hqdefault.jpg" },
        { id: "6dr6FtcF798", title: "Фальцевая кровля на каркасном доме", publishedLabel: "26 мая 2020", thumbnail: "https://i3.ytimg.com/vi/6dr6FtcF798/hqdefault.jpg" },
      ],
    },
  },
};
export const FPS_MODUL: Maker = {
  name: "ФПС Модуль",
  initials: "ФП",
  id: "fps-modul",
  verified: true,
  logo: fpsModulLogo,
  logoFit: "cover",
  logoBackground: "transparent",
  siteUrl: "https://fps-modul.ru/",
  productionAddress: "Свердловская область, г. Берёзовский, Берёзовский тракт, 6Б/6",
  phone: "+7 (966) 705-96-96",
  additionalPhones: ["+7 (912) 030-96-96", "+7 (343) 361-97-46"],
  email: "zakaz@inventdom.ru",
  telegram: "https://t.me/fps_modul",
  externalRating: {
    rating: 4.7,
    totalCount: 11,
    source: "yandex",
    sourceLabel: "Яндекс",
    embedUrl: "https://yandex.ru/maps-reviews-widget/178144717841?comments",
  },
  profile: {
    groupedProjects: true,
    projectTabs: ["houses", "baths", "business"],
    useCatalogSummary: true,
    headlineSuffix: "— модульные барнхаусы и готовые бани в Екатеринбурге",
    technologyLabel: "Модульная технология",
    seo: {
      title: "ФПС Модуль — барнхаусы и модульные бани в Екатеринбурге",
      descriptionTemplate: "{projectCount} проектов «ФПС Модуль»: барнхаусы серий Арт Хаус, Викинг и Барн Макс, готовые бани Фьорд, цены, планировки и отзывы в Екатеринбурге.",
    },
    intro: "Барнхаусы серий Арт Хаус, Викинг, Барн Макс и Стандарт, а также готовые модульные бани Фьорд с доставкой и монтажом на участке.",
    namePrepositional: "ФПС Модуль",
    coordinates: { lat: 56.902718, lon: 60.774852 },
    sourceAudit: {
      checkedAtIso: "2026-09-12",
      catalog: { sourceUrl: "https://fps-modul.ru/", expectedProjectCount: 19 },
      legal: { status: "imported", sourceUrl: "https://egrul.nalog.ru/", note: "Реквизиты и статус юридического лица перенесены после проверки." },
      reviews: { status: "imported", sourceUrl: "https://yandex.ru/maps-reviews-widget/178144717841?comments", note: "Подключён официальный виджет отзывов Яндекс Карт." },
      builtObjects: { status: "imported", sourceUrl: "https://fps-modul.ru/#foto", note: "Шесть фотографий перенесены из официальной фотогалереи производителя." },
      production: { status: "imported", sourceUrl: "https://fps-modul.ru/", note: "Адрес производства и координаты проверены по официальному сайту." },
      social: {
        youtube: { status: "imported", sourceUrl: "https://www.youtube.com/@FPS-Modul", note: "В профиль добавлены публикации официального YouTube-канала." },
        telegram: { status: "not-found", note: "Подтверждённый Telegram-канал при проверке не найден." },
      },
    },
    about: [
      "«ФПС Модуль» — производитель модульных домов и бань из Екатеринбурга. В официальном каталоге представлены серии Арт Хаус, Барн Викинг, Барн Макс, Барн Стандарт и модульные бани Фьорд.",
      "Компания выпускает здания на деревянном каркасе с утеплением минеральной ватой, наружной и внутренней отделкой, окнами, электрикой и вентиляцией. Состав конкретной комплектации зависит от модели и фиксируется при расчёте.",
      "Готовые модули доставляют на участок и собирают на подготовленном фундаменте. Производитель указывает, что доставка и монтаж большинства проектов занимают один день; фундамент, доставка, терраса и дополнительные элементы могут рассчитываться отдельно.",
      "Производство и офис находятся в Берёзовском рядом с Екатеринбургом. На странице собраны все актуальные проекты с официального сайта, цены и планировки, расположение производства, отзывы с Яндекс Карт и сведения о юридическом лице.",
    ],
    legal: {
      legalName: "ООО «ФПС-МОДУЛЬ»",
      status: "Действует",
      registeredAt: "16 февраля 2021",
      foundingDate: "2021-02-16",
      inn: "6678111397",
      kpp: "667801001",
      ogrn: "1216600008404",
      legalAddress: "623702, Свердловская область, г. Берёзовский, ул. Шиловская, к. 1, стр. 30, офис 211",
      director: "Гильманов Роберт Фанузович",
      mainActivity: "Производство готовых строительных изделий из бетона, цемента и искусственного камня",
      shareCapital: "10 000 ₽",
      revenue: "28,5 млн ₽",
      netProfit: "193 тыс. ₽",
      reportingYear: "2025",
      arbitrationCases: "Не обнаружено",
      enforcementProceedings: { open: 0, completed: 1 },
      unfairSuppliersRegistry: "Не числится",
      checkedAt: "11 сентября 2026",
      checkedAtIso: "2026-09-11",
      sources: [
        { label: "ЕГРЮЛ ФНС", href: "https://egrul.nalog.ru/" },
        { label: "ГИР БО ФНС", href: "https://bo.nalog.ru/" },
        { label: "Арбитражные дела", href: "https://kad.arbitr.ru/" },
        { label: "ФССП", href: "https://fssp.gov.ru/iss/ip" },
        { label: "РНП ЕИС", href: "https://zakupki.gov.ru/epz/dishonestsupplier/search/results.html" },
      ],
    },
    builtObjects: [
      { src: "https://fps-modul.ru/data/uploads/slider/001.jpg", width: 1000, height: 750 },
      { src: "https://fps-modul.ru/data/uploads/slider/002.jpg", width: 1000, height: 750 },
      { src: "https://fps-modul.ru/data/uploads/slider/003.jpg", width: 1000, height: 750 },
      { src: "https://fps-modul.ru/data/uploads/slider/004.jpg", width: 1000, height: 750 },
      { src: "https://fps-modul.ru/data/uploads/slider/005.jpg", width: 1000, height: 750 },
      { src: "https://fps-modul.ru/data/uploads/slider/006.jpg", width: 1000, height: 750 },
    ],
    social: {
      youtubeChannelUrl: "https://www.youtube.com/@FPS-Modul",
      telegramPosts: [],
      youtubeVideos: [
        { id: "C5RBwRZ5pKE", title: "Дом холостяка: обзор модульного барнхауса с заказчиком", publishedLabel: "Видео на канале", thumbnail: "https://i.ytimg.com/vi/C5RBwRZ5pKE/hqdefault.jpg" },
        { id: "2ZUPmkfJYgQ", title: "Что происходит с рынком ИЖС? Как выбрать подрядчика?", publishedLabel: "Видео на канале", thumbnail: "https://i.ytimg.com/vi/2ZUPmkfJYgQ/hqdefault.jpg" },
        { id: "g6dotRoN0N0", title: "Обзор модульного барнхауса по проекту Барн Макс 501", publishedLabel: "Видео на канале", thumbnail: "https://i.ytimg.com/vi/g6dotRoN0N0/hqdefault.jpg" },
        { id: "16ikkUcQpbo", title: "Обзор модульного дома с высокими потолками Викинг-411", publishedLabel: "Видео на канале", thumbnail: "https://i.ytimg.com/vi/16ikkUcQpbo/hqdefault.jpg" },
        { id: "9XqIh4ZW1yU", title: "Вентилируемые фасады УМКФ: отзыв заказчика", publishedLabel: "Видео на канале", thumbnail: "https://i.ytimg.com/vi/9XqIh4ZW1yU/hqdefault.jpg" },
        { id: "sy0Xar0d5QY", title: "Модульный барнхаус для глэмпинга «Лофт Дача»", publishedLabel: "Видео на канале", thumbnail: "https://i.ytimg.com/vi/sy0Xar0d5QY/hqdefault.jpg" },
      ],
    },
  },
};
export const VEK_TRAD: Maker = {
  name: "Вековые Традиции",
  initials: "ВТ",
  id: "vek-trad",
  verified: true,
  logo: "https://vek-trad.ru/favicon.png",
  logoFit: "contain",
  logoBackground: "light",
  siteUrl: "https://vek-trad.ru/katalog-proektov-domov/modulnye/",
  productionAddress: "620137, г. Екатеринбург, ул. Ирбитская, 13",
  phone: "+7 (343) 271-51-92",
  additionalPhones: ["+7 (912) 037-07-77"],
  email: "info@vek-trad.ru",
  profile: {
    groupedProjects: true,
    projectTabs: ["houses"],
    useCatalogSummary: true,
    headlineSuffix: "— модульные дома под ключ в Екатеринбурге",
    technologyLabel: "Каркасно-модульная технология",
    seo: {
      title: "Вековые Традиции — модульные дома в Екатеринбурге",
      descriptionTemplate: "{projectCount} проекта компании «Вековые Традиции»: модульные дома под ключ в Екатеринбурге, цены, площади, планировки и комплектации.",
    },
    intro: "Модульные дома на деревянном каркасе для круглогодичного проживания с готовыми вариантами планировок и несколькими уровнями комплектации.",
    namePrepositional: "«Вековых Традициях»",
    mapKind: "office",
    sourceAudit: {
      checkedAtIso: "2026-09-12",
      catalog: { sourceUrl: "https://vek-trad.ru/katalog-proektov-domov/modulnye/", expectedProjectCount: 4 },
      legal: { status: "imported", sourceUrl: "https://vek-trad.ru/kontakty/", note: "Оператор сайта, ИНН и банковские реквизиты опубликованы в официальных контактах; регистрационные сведения сопоставлены по ИНН." },
      reviews: { status: "not-found", note: "Независимый профиль с однозначным совпадением сайта и реквизитов пока не подключён." },
      builtObjects: { status: "imported", sourceUrl: "https://vek-trad.ru/my-postroili/", note: "Фотографии выполненных домов перенесены из официального портфолио." },
      production: { status: "not-found", sourceUrl: "https://vek-trad.ru/kontakty/", note: "На официальном сайте опубликован только адрес офиса; адрес производства отдельно не указан." },
      social: {
        youtube: { status: "not-found", note: "Подтверждённый официальный YouTube-канал не найден." },
        telegram: { status: "not-found", note: "Подтверждённый публичный Telegram-канал не найден." },
      },
    },
    about: [
      "«Вековые Традиции» строят модульные дома под ключ в Екатеринбурге. Готовые элементы собирают на деревянном каркасе в заводских условиях, доставляют на участок и устанавливают на подготовленный фундамент.",
      "В каталоге опубликованы четыре одноэтажных проекта площадью от 60 до 98 м². Для каждой модели указаны спальни, санузлы, размеры, терраса и три уровня комплектации: базовая, тепловой контур и под ключ.",
      "Производитель указывает возможность круглогодичной эксплуатации, изменения компоновки модулей и подключения инженерных коммуникаций. Срок и окончательный состав работ нужно сверять в карточке выбранного проекта.",
    ],
    legal: {
      legalName: "ИП Губернаторова Ольга Владимировна",
      status: "Действует",
      registeredAt: "25 марта 2019",
      foundingDate: "2019-03-25",
      inn: "665910793700",
      kpp: "Не применяется",
      ogrn: "319665800061370",
      legalAddress: "Свердловская область",
      director: "Губернаторова Ольга Владимировна",
      mainActivity: "Строительство жилых и нежилых зданий",
      shareCapital: "Не применяется",
      revenue: "Не публикуется",
      netProfit: "Не публикуется",
      reportingYear: "—",
      arbitrationCases: "Не обнаружено",
      enforcementProceedings: { open: 0, completed: 0 },
      unfairSuppliersRegistry: "Не числится",
      checkedAt: "12 сентября 2026",
      checkedAtIso: "2026-09-12",
      sources: [
        { label: "ЕГРИП ФНС", href: "https://egrul.nalog.ru/" },
      ],
    },
    builtObjects: [
      { src: "https://vek-trad.ru/userfls/shop/large/1562_dom-gde-zhivet-uyut.jpg", width: 1200, height: 900 },
      { src: "https://vek-trad.ru/userfls/shop/large/1565_dom-gde-zhivet-uyut.jpg", width: 900, height: 1200 },
      { src: "https://vek-trad.ru/userfls/shop/large/1564_dom-gde-zhivet-uyut.jpg", width: 1200, height: 900 },
      { src: "https://vek-trad.ru/userfls/shop/large/1563_dom-gde-zhivet-uyut.jpg", width: 1200, height: 900 },
      { src: "https://vek-trad.ru/userfls/shop/large/1559_nebolshoy-proekt-barnkhaus.jpg", width: 1200, height: 900 },
      { src: "https://vek-trad.ru/userfls/shop/large/1560_nebolshoy-proekt-barnkhaus.jpg", width: 1200, height: 900 },
    ],
    social: { telegramPosts: [], youtubeVideos: [] },
  },
};
export const BUDUSHIY_DOM: Maker = {
  name: "Будущий Дом",
  initials: "БД",
  id: "budushiy-dom",
  verified: true,
  logo: budushiyDomLogo,
  logoFit: "contain",
  logoBackground: "light",
  siteUrl: "https://budushiy-dom.ru/",
  productionAddress: "г. Екатеринбург, ул. Малышева, 19, подъезд 1, этаж 2, офис 1212",
  phone: "+7 (922) 124-42-52",
  email: "budushiy.dom@yandex.ru",
  telegram: "https://t.me/+79221244252",
  profile: {
    groupedProjects: true,
    projectTabs: ["houses", "baths", "business"],
    useCatalogSummary: true,
    headlineSuffix: "— расширяемые модульные дома под ключ в Екатеринбурге",
    technologyLabel: "Модульная технология",
    seo: {
      title: "Будущий Дом — модульные дома и бани в Екатеринбурге",
      descriptionTemplate: "{projectCount} проектов компании «Будущий Дом»: расширяемые модульные дома под ключ в Екатеринбурге, цены, планировки, отделка, инженерия и доставка по России.",
    },
    intro: "Расширяемые модульные дома заводской сборки с готовой отделкой, инженерными системами и документами для регистрации — с доставкой по России.",
    namePrepositional: "«Будущем Доме»",
    coordinates: { lat: 56.8332279, lon: 60.5906211 },
    mapKind: "office",
    sourceAudit: {
      checkedAtIso: "2026-09-12",
      catalog: { sourceUrl: "https://budushiy-dom.ru/shop/", expectedProjectCount: 32 },
      legal: { status: "imported", sourceUrl: "https://egrul.nalog.ru/", note: "Реквизиты и статус перенесены с проверкой по открытым реестрам." },
      reviews: { status: "first-party-only", sourceUrl: "https://budushiy-dom.ru/reviews/", note: "Найдены отзывы на собственном сайте производителя; они не учитываются как независимый рейтинг." },
      builtObjects: { status: "imported", sourceUrl: "https://budushiy-dom.ru/", note: "Пять фотографий из официального портфолио перенесены в профиль." },
      production: { status: "not-found", sourceUrl: "https://budushiy-dom.ru/", note: "Официальный сайт публикует адрес офиса; отдельный адрес производства не найден." },
      social: {
        youtube: { status: "not-found", note: "Подтверждённый официальный YouTube-канал не найден." },
        telegram: { status: "not-found", note: "На сайте указан прямой контакт, но публичный Telegram-канал не найден." },
      },
    },
    about: [
      "«Будущий Дом» — производитель модульных домов и бань под ключ из Екатеринбурга. Компания проектирует типовые и индивидуальные решения, собирает конструкции в заводских условиях, доставляет их по России и монтирует на участке.",
      "В каталоге производителя есть компактные дома в стиле хай-тек, семейные барнхаусы и готовые модульные бани. Модульную конструкцию можно расширять, а планировку, цвет фасада, отделку и дополнительные опции — адаптировать под участок и сценарий владельца.",
      "Для каркаса производитель указывает сухой строганый брус камерной сушки, утеплитель «Технониколь», тройные стеклопакеты и электрические конвекторы. В круглогодичную комплектацию входят наружная и внутренняя отделка; точный состав работ и инженерных систем зависит от выбранной модели.",
      "На официальном сайте заявлены полный пакет документов для регистрации дома, доставка по России от 7 дней и сборка на участке от 10 дней. Офис компании находится в Екатеринбурге на улице Малышева; актуальные сроки, стоимость доставки и комплектацию следует уточнять для конкретного проекта.",
    ],
    legal: {
      legalName: "ООО «ЛЕСХИМЭКСПОРТ»",
      status: "Действует",
      registeredAt: "7 апреля 2009",
      foundingDate: "2009-04-07",
      inn: "6674328575",
      kpp: "667901001",
      ogrn: "1096674006406",
      legalAddress: "620130, Свердловская область, г. Екатеринбург, ул. Белинского, д. 222",
      director: "Сафин Тимур Надирович",
      mainActivity: "Торговля оптовая химическими продуктами",
      shareCapital: "10 000 ₽",
      revenue: "Не публикуется",
      netProfit: "Не публикуется",
      reportingYear: "—",
      arbitrationCases: "11 дел в истории",
      enforcementProceedings: { open: 0, completed: 5 },
      unfairSuppliersRegistry: "Не числится",
      checkedAt: "12 сентября 2026",
      checkedAtIso: "2026-09-12",
      sources: [
        { label: "ЕГРЮЛ ФНС", href: "https://egrul.nalog.ru/" },
        { label: "Арбитражные дела", href: "https://kad.arbitr.ru/" },
        { label: "ФССП", href: "https://fssp.gov.ru/iss/ip" },
        { label: "РНП ЕИС", href: "https://zakupki.gov.ru/epz/dishonestsupplier/search/results.html" },
      ],
    },
    builtObjects: [
      { src: budushiyDomObject1, width: 1200, height: 1524 },
      { src: budushiyDomObject2, width: 1200, height: 676 },
      { src: budushiyDomObject3, width: 1200, height: 900 },
      { src: budushiyDomObject4, width: 1200, height: 900 },
      { src: budushiyDomObject5, width: 1200, height: 675 },
    ],
  },
};
export const QUBDOM: Maker = {
  name: "Qubdom",
  initials: "QD",
  id: "qubdom",
  siteUrl: "https://qubdom.ru/",
  productionAddress: "Санкт-Петербург и Ленинградская область",
  phone: "+7 (999) 945-30-05",
  email: "info@qubdom.ru",
};
export const DUROV_HOUSE: Maker = {
  name: "DUROV.HOUSE",
  initials: "DH",
  id: "durov-house",
  verified: true,
  logo: durovLogo,
  siteUrl: "https://durov.house/",
  productionAddress: "Воронежская область, Новоусманский район, село Бабяково, 1-й Парковый проезд, строение 11",
  phone: "+7 (906) 677-35-55",
  email: "sales@durov.house",
};
export const HISTHUT: Maker = {
  name: "HISTHUT",
  initials: "HH",
  id: "histhut",
  verified: true,
  logo: histhutLogo,
  siteUrl: "https://histhut.ru/",
  productionAddress: "г. Пермь, ул. Героев Хасана, 105 к70",
  phone: "+7 (982) 496-77-77",
  email: "info@histhut.ru",
};
export const COUNTRYHOUSE: Maker = {
  name: "CountryHouse",
  initials: "CH",
  id: "countryhouse",
  verified: true,
  logo: countryhouseLogo,
  siteUrl: "https://modulniye-doma.ru/",
  productionAddress: "Санкт-Петербург, Коломяжский пр-т, д. 33, к. 2",
  phone: "+7 (952) 356-65-92",
  email: "info@modulniye-doma.ru",
};
export const CUBADOM: Maker = {
  name: "CUBA DOM",
  initials: "CD",
  id: "cuba-dom",
  verified: true,
  logo: cubadomLogo,
  siteUrl: "https://cuba-dom.ru/",
  productionAddress: "Санкт-Петербург, 1-я Полевая 25а",
  phone: "+7 (812) 509-13-04",
};
export const IDOLHOUSE: Maker = {
  name: "АЙДОЛХАУС",
  initials: "IH",
  id: "idolhouse",
  verified: true,
  logo: idolhouseLogo,
  siteUrl: "https://idolhouse.ru/",
  productionAddress: "Воронежская область, Новоусманский район, село Бабяково, 1-й Парковый проезд, строение 11",
  phone: "+7 (958) 509-08-19",
  email: "hello@idolhouse.ru",
};
export const WOODALP: Maker = {
  name: "WOODALP",
  initials: "WA",
  id: "woodalp",
  verified: true,
  logo: woodalpLogo,
  siteUrl: "https://woodalphouse.ru/",
  productionAddress: "МО, Одинцовский городской округ, Малые Вяземы, БЦ Madex",
  phone: "+7 (929) 692-90-09",
  email: "vudalp@yandex.ru",
};
export const BOXMATE: Maker = {
  name: "Boxmate",
  initials: "BM",
  id: "boxmate",
  verified: true,
  logo: boxmateLogo,
  siteUrl: "https://boxmate.ru/",
  productionAddress: "Санкт-Петербург, Полтавский проезд, 2",
  phone: "+7 (981) 717-91-20",
};
export const UVHOUSE: Maker = {
  name: "UV House",
  initials: "UV",
  id: "uvhouse",
  verified: true,
  logo: uvhouseLogo,
  siteUrl: "https://ufa-vagon.ru/",
  productionAddress: "Уфа",
  phone: "+7 (917) 048-79-84",
  email: "info@ufa-vagon.ru",
};
export const ASTERIUS: Maker = {
  name: "Asterius House",
  initials: "AH",
  id: "asterius-house",
  verified: true,
  logo: asteriusLogo,
  siteUrl: "https://asterius-house.ru/",
  productionAddress: "Чебоксары, Кабельный проезд, 4",
  phone: "+7 (931) 105-80-90",
};
export const SMOLA: Maker = {
  name: "SMOLA HOUSE",
  initials: "SH",
  id: "smola-house",
  verified: true,
  logo: smolaLogo,
  siteUrl: "https://smolahouse.ru/",
  productionAddress: "Московская область",
  phone: "+7 (910) 011-35-55",
  email: "smolahouse@yandex.ru",
  telegram: "https://t.me/smolahouse",
};
export const ULTRADOMSPB: Maker = {
  name: "UltraDomSPb",
  initials: "UD",
  id: "ultradomspb",
  verified: true,
  logo: ultradomspbLogo,
  siteUrl: "https://ultradomspb.ru/",
  productionAddress: "Санкт-Петербург",
  phone: "+7 (812) 921-82-86",
  email: "info@ultradomspb.ru",
};
export const FREEDOM_NATURI: Maker = {
  name: "FREEDOM NATURI",
  initials: "FN",
  id: "freedom-naturi",
  verified: true,
  logo: freedomLogo,
  siteUrl: "https://freedom-modul.ru/",
  productionAddress: "М.О. Воря-Богородское",
  phone: "+7 (903) 715-95-20",
  email: "info@freedom-modul.ru",
};
export const CHEBWOOD: Maker = {
  name: "Чебвуд",
  initials: "ЧВ",
  id: "chebwood",
  verified: true,
  logo: chebwoodLogo,
  siteUrl: "https://chebwood.com/",
  productionAddress: "Чебоксары, Дорожный проезд, 10А",
  phone: "+7 (920) 733-77-33",
  email: "chebwood21@mail.ru",
  telegram: "https://t.me/chebwood",
};
export const CAMPINGDOM: Maker = {
  name: "Campingdom",
  initials: "CD",
  id: "campingdom",
  verified: true,
  logo: campingdomLogo,
  siteUrl: "https://campingdom.ru/proekti",
  productionAddress: "Республика Татарстан, с. Высокая Гора, ул. Большая Красная, д. 1а",
  phone: "+7 (966) 240-47-47",
  telegram: "https://t.me/RamilGubaev",
};
export const PSLCOMP: Maker = {
  name: "Промстройлес",
  initials: "ПЛ",
  id: "pslcomp",
  verified: true,
  logo: pslcompLogo,
  siteUrl: "https://www.pslcomp.ru/katalog-proektov-derevyannyh-domov/modulnye-doma",
  productionAddress: "Санкт-Петербург и Москва",
  phone: "+7 (812) 596-39-01",
};
export const DOMNASM: Maker = {
  name: "Домнас Модуль",
  initials: "ДМ",
  id: "domnasm",
  verified: true,
  siteUrl: "https://domnasm.ru/",
  productionAddress: "Казань, ул. Адмиралтейская, д. 3, к. 1, офис 205",
};
export const BLACKMODULE: Maker = {
  name: "BlackModule",
  initials: "BM",
  id: "blackmodule",
  verified: true,
  logo: blackmoduleLogo,
  logoBackground: "dark",
  siteUrl: "https://blackmodule.ru/",
  productionAddress: "Мурино, Сквозной проезд, 4",
  phone: "+7 (921) 343-70-44",
  email: "blackmodulespb@gmail.com",
};
export const DOMM: Maker = {
  name: "DOMM",
  initials: "DM",
  id: "domm",
  verified: true,
  logo: dommLogo,
  siteUrl: "https://domm.store/",
  productionAddress: "Новосибирск",
  phone: "+7 (983) 307-29-87",
  email: "dom-m54@mail.ru",
};
export const MY_MODULE: Maker = {
  name: "Мой Модуль",
  initials: "ММ",
  id: "my-module",
  verified: true,
  logo: myModuleLogo,
  siteUrl: "https://my-module.ru/module-dom/",
  productionAddress: "Московская область, городской округ Балашиха, дер. Дятловка, 828",
  phone: "8-800-222-07-67",
  email: "info@my-module.ru",
  telegram: "https://t.me/Mymodule",
};
export const FOUR_MODUL: Maker = {
  name: "4 Стихии",
  initials: "4С",
  id: "4modul",
  verified: true,
  siteUrl: "https://4modul.ru/",
  productionAddress: "Рязань",
  phone: "+7 (900) 609-69-09",
};
export const CUBBER: Maker = {
  name: "Cubber Prefab",
  initials: "CB",
  id: "cubber",
  verified: true,
  logo: cubberLogo,
  siteUrl: "https://cubber.ru/modul",
  productionAddress: "Новокузнецк, Кемеровская область",
  phone: "+7 (900) 105-61-30",
};
export const SIMPLEHOUSE: Maker = {
  name: "Simple House",
  initials: "SH",
  id: "simplehouse",
  verified: true,
  logo: simplehouseLogo,
  siteUrl: "https://simplehouse1.ru/",
  productionAddress: "Санкт-Петербург",
  email: "simplehouse1@mail.ru",
  telegram: "https://t.me/simple_house1",
};
export const PANORAMIC_HOME: Maker = {
  name: "Panoramic Home",
  initials: "PH",
  id: "panoramic-home",
  verified: true,
  logo: panoramicLogo,
  siteUrl: "https://panoramic-home.ru/modular_house",
  productionAddress: "Красноярск",
  phone: "+7 (906) 974-44-00",
};
export const AMBARN: Maker = {
  name: "АмбарН",
  initials: "АН",
  id: "ambarn",
  verified: true,
  logo: ambarnLogo,
  siteUrl: "https://ambarn.ru/product-category/modulnye-doma/",
  productionAddress: "Краснодар и Краснодарский край",
  phone: "+7 (937) 260-04-20",
};
export const MYFAMILYHOUSE: Maker = {
  name: "FAMILY HOUSE",
  initials: "FH",
  id: "myfamilyhouse",
  verified: true,
  logo: familyHouseLogo,
  siteUrl: "https://myfamilyhouse.ru/",
  productionAddress: "х. Суповский, ул. Ленина 88/4",
  phone: "+7 (995) 103-67-03",
};
export const STROYGRAD: Maker = {
  name: "СтройГрад",
  initials: "СГ",
  id: "stroygrad",
  verified: true,
  logo: stroygradLogo,
  siteUrl: "https://stroygrad-sk.ru/our-projects/",
  productionAddress: "Московская область, г. Сергиев Посад, Глинково 22А",
  phone: "+7 (925) 057-57-54",
  email: "info@stroygrad-sk.ru",
};
export const MODULCAMP: Maker = {
  name: "Modul Camp",
  initials: "MC",
  id: "modulcamp",
  verified: true,
  logo: modulcampLogo,
  siteUrl: "https://modulcamp-dolgoprudniy.ru/quiz",
  productionAddress: "Калужская область, г. Калуга, ул. Черновская, д. 56, стр. 1",
  phone: "+7 (958) 537-00-93",
};
export const ELMACO: Maker = {
  name: "Elmaco Homes",
  initials: "EH",
  id: "elmaco",
  verified: true,
  siteUrl: "https://www.elmaco.ru/homes/",
  productionAddress: "197374, г. Санкт-Петербург, ул. Оптиков, д. 4, корп. 2, лит. А, офис 311",
  phone: "+7 (812) 449-31-79",
  email: "info@elmaco.ru",
  profile: {
    intro: "Elmaco Homes — производитель модульных домов из Санкт-Петербурга.",
    about: ["Elmaco Homes — производитель модульных домов из Санкт-Петербурга. В каталоге представлены серии Ivor, Lukas, Jung, Tor и Oscar: от компактных загородных домов до просторных семейных решений."],
    coordinates: { lat: 59.995471, lon: 30.249177 },
  },
};
export const NOVATOR: Maker = {
  name: "Novator",
  initials: "NV",
  id: "novator",
  verified: true,
  siteUrl: "https://novator.ltd/modelniy-riad",
  productionAddress: "Санкт-Петербург",
  phone: "+7 (812) 250-60-13",
  email: "Info@novator.ltd",
  telegram: "https://t.me/novator_ltd",
};
export const BLAGOHOUSE: Maker = {
  name: "BlagoHouse",
  initials: "BH",
  id: "blagohouse",
  verified: true,
  siteUrl: "https://blagohouse.ru/#projects",
  productionAddress: "Москва и Московская область",
  phone: "+7 (495) 308-40-16",
  telegram: "https://t.me/BlagoHouse_manager",
};
export const STILNYE_MODULI: Maker = {
  name: "Стильные Модули",
  initials: "СМ",
  id: "stilnye-moduli",
  verified: true,
  siteUrl: "https://stilnye-moduli.ru/",
  productionAddress: "Московская область",
  phone: "+7 (915) 142-45-00",
  telegram: "https://t.me/glempingdom",
};
export const IP_MODUL: Maker = {
  name: "IP Modul",
  initials: "IP",
  id: "ip-modul",
  verified: true,
  logo: ipModulLogo,
  siteUrl: "https://ip-modul.ru/",
  productionAddress: "Ленинградская область, Гатчинский район, д. Новый Свет, д. 118А",
  phone: "+7 (812) 203-82-06",
};
export const RUSMODUL_SPB: Maker = {
  name: "РусМодуль",
  initials: "РМ",
  id: "rusmodul-spb",
  verified: true,
  logo: rusmodulLogo,
  siteUrl: "https://rusmodul-spb.ru/projects",
  productionAddress: "Ленинградская область, Русско-Высоцкое, улица Дорога на Южный птицекомплекс, 3",
  phone: "+7 (812) 703-85-84",
  email: "SKRus178@yandex.ru",
};

export const BM_DOM: Maker = {
  name: "БМ-ДОМ", initials: "БМ", id: "bm-dom", verified: true,
  logo: "https://bm-dom.ru/wp-content/uploads/2025/07/logo-bm-dom-new.png", logoFit: "contain", logoBackground: "light",
  siteUrl: "https://bm-dom.ru/", productionAddress: "Свердловская область, г. Верхняя Пышма, п. Залесье, Индустриальный проезд, 2",
  phone: "+7 (343) 221-78-02", additionalPhones: ["+7 (902) 797-92-93"], email: "info@bm-dom.ru", telegram: "https://t.me/BM_DOM",
  profile: {
    groupedProjects: true, projectTabs: ["houses"], useCatalogSummary: true,
    headlineSuffix: "— модульные и каркасные дома под ключ в Екатеринбурге",
    technologyLabel: "Модульная технология",
    seo: { title: "БМ-ДОМ — модульные дома в Екатеринбурге", descriptionTemplate: "{projectCount} актуальных проектов БМ-ДОМ: модульные и каркасные дома под ключ, площади, планировки и производство в Екатеринбурге." },
    intro: "Модульные и каркасные дома заводской сборки для круглогодичного проживания и дачи с доставкой по Свердловской области.",
    namePrepositional: "БМ-ДОМ", coordinates: { lat: 56.9672486, lon: 60.6600736 },
    sourceAudit: {
      checkedAtIso: "2026-09-12", catalog: { sourceUrl: "https://bm-dom.ru/proekty/", expectedProjectCount: 5 },
      legal: { status: "not-found", sourceUrl: "https://bm-dom.ru/privacy-policy/", note: "В политике конфиденциальности реквизиты оставлены незаполненными, поэтому юридическое лицо не утверждается." },
      reviews: { status: "first-party-only", sourceUrl: "https://bm-dom.ru/", note: "Найдены отзывы на сайте производителя; подтверждение независимого профиля не выполнено." },
      builtObjects: { status: "not-found", sourceUrl: "https://bm-dom.ru/nashi-raboty/", note: "Страница «Наши работы» открывается, но не содержит опубликованных объектов или фотографий." },
      production: { status: "imported", sourceUrl: "https://bm-dom.ru/", note: "Адрес производства опубликован на официальном сайте и нанесён на карту." },
      social: { youtube: { status: "not-found", note: "Подтверждённый канал не найден." }, telegram: { status: "not-found", sourceUrl: "https://t.me/BM_DOM", note: "Публичная лента, пригодная для подтверждённого импорта, не подключена." } },
    },
    about: [
      "БМ-ДОМ производит модульные и каркасные дома в Екатеринбурге и Верхней Пышме. Компания указывает собственное производство, работу по договору и доставку готовых модулей на участок.",
      "В текущем каталоге представлены компактные и семейные дома, включая проекты в архитектуре барнхаус. Домокомплекты рассчитаны на дачное и круглогодичное использование; состав утепления и инженерии зависит от комплектации.",
      "Производитель заявляет более 275 построенных домов и 10 лет опыта. В линейке есть компактные дачные решения и дома для круглогодичного проживания.",
    ],
    social: { telegramChannel: "BM_DOM", telegramPosts: [], youtubeVideos: [] },
  },
};

export const SQ_MODYL: Maker = {
  name: "SQ-MODYL", initials: "SQ", id: "sq-modyl", verified: true,
  logo: "https://static.tildacdn.com/tild3835-3636-4539-a339-323233333133/sq-modyl_logo_circle.png", logoFit: "cover", logoBackground: "transparent",
  siteUrl: "https://modyl.info/", productionAddress: "Свердловская область, Белоярский район, пос. Прохладный, ул. Свердлова, стр. 22",
  phone: "+7 (900) 201-06-05", email: "modyl.info@gmail.com",
  externalRating: { rating: 4.6, totalCount: 18, source: "yandex", sourceLabel: "Яндекс", embedUrl: "https://yandex.ru/maps-reviews-widget/242030548021?comments" },
  profile: {
    groupedProjects: true, projectTabs: ["houses", "baths", "business"], useCatalogSummary: true,
    headlineSuffix: "— модульные дома, гостевые модули и бани в Екатеринбурге",
    technologyLabel: "Модульная технология",
    seo: { title: "SQ-MODYL — модульные дома и бани в Екатеринбурге", descriptionTemplate: "{projectCount} проектов SQ-MODYL: модульные дома, гостевые модули и готовые бани под ключ, планировки, производство и отзывы в Екатеринбурге." },
    intro: "Типовые и индивидуальные модульные дома, гостевые модули и бани для частных участков, глэмпингов и баз отдыха.",
    namePrepositional: "SQ-MODYL", coordinates: { lat: 56.7460402, lon: 60.9411587 },
    sourceAudit: {
      checkedAtIso: "2026-09-12", catalog: { sourceUrl: "https://modyl.info/modular_house_projects", expectedProjectCount: 12 },
      legal: { status: "imported", sourceUrl: "https://modyl.info/politika_konfidencialnosti", note: "Связь бренда с ООО «Модуль-групп Компани» подтверждена политикой официального сайта и совпадающими реквизитами открытого реестра." },
      reviews: { status: "imported", sourceUrl: "https://yandex.ru/maps/org/sq_modyl/242030548021/reviews/", note: "Подключён официальный виджет Яндекс Карт для совпавшей организации." },
      builtObjects: { status: "imported", sourceUrl: "https://modyl.info/gallery_of_modular_houses", note: "Шесть фотографий перенесены из официальной галереи построенных объектов." },
      production: { status: "imported", sourceUrl: "https://modyl.info/contacts", note: "Адрес производства опубликован в официальных контактах и нанесён на карту." },
      social: { youtube: { status: "not-found", note: "Подтверждённый канал не найден." }, telegram: { status: "not-found", note: "Подтверждённый канал не найден." } },
    },
    about: [
      "SQ-MODYL — производитель модульных домов и бань из Свердловской области. Офис находится в Екатеринбурге, производство — в посёлке Прохладный Белоярского района.",
      "Каталог включает жилые дома, гостевые модули и несколько серий готовых бань. Гостевые модели подходят для аренды, глэмпингов, гостиниц и баз отдыха.",
      "На официальном сайте опубликованы технология, этапы работ, прайс, сертификаты и галерея объектов. Актуальную комплектацию и стоимость следует подтверждать для выбранного проекта.",
    ],
    legal: {
      legalName: "ООО «Модуль-групп Компани»",
      status: "Действующая организация",
      registeredAt: "24 января 2022 года",
      foundingDate: "24 января 2022 года",
      inn: "6679148463",
      kpp: "667901001",
      ogrn: "1226600002683",
      legalAddress: "620023, Свердловская область, г. Екатеринбург, мкр. Светлый, д. 3, кв. 141",
      director: "Шилов Дмитрий Викторович",
      mainActivity: "Строительство жилых и нежилых зданий (ОКВЭД 41.20)",
      shareCapital: "100 000 ₽",
      revenue: "57,8 млн ₽",
      netProfit: "19,3 млн ₽",
      reportingYear: "2025",
      arbitrationCases: "Не обнаружено",
      generalCourtCases: "2 дела в качестве ответчика",
      enforcementProceedings: { open: 0, completed: 0 },
      unfairSuppliersRegistry: "Не числится",
      checkedAt: "12 сентября 2026 года",
      checkedAtIso: "2026-09-12",
      sources: [
        { label: "ЕГРЮЛ ФНС", href: "https://egrul.nalog.ru/index.html" },
        { label: "Политика официального сайта", href: "https://modyl.info/politika_konfidencialnosti" },
        { label: "Профиль открытых реестров", href: "https://saby.ru/profile/6679148463-667901001" },
        { label: "Арбитражные дела", href: "https://kad.arbitr.ru/" },
        { label: "ФССП", href: "https://fssp.gov.ru/iss/ip" },
        { label: "РНП ЕИС", href: "https://zakupki.gov.ru/epz/dishonestsupplier/search/results.html" },
      ],
    },
    builtObjects: [
      { src: "https://static.tildacdn.com/tild6236-6331-4261-a530-396433303731/IMG_7386.jpeg", width: 1280, height: 955 },
      { src: "https://static.tildacdn.com/tild3733-3465-4530-b732-343465313030/IMG_7308.jpeg", width: 1680, height: 1254 },
      { src: "https://static.tildacdn.com/tild3933-3738-4765-b162-356438373831/IMG_7314.jpeg", width: 1680, height: 1260 },
      { src: "https://static.tildacdn.com/tild6236-6166-4735-b663-343239613835/IMG_7189.jpeg", width: 1408, height: 736 },
      { src: "https://static.tildacdn.com/tild3231-3835-4536-b663-613961383034/69292BA0-67B3-44E5-9.jpeg", width: 1320, height: 886 },
      { src: "https://static.tildacdn.com/tild3236-3561-4135-b734-366662643666/IMG_7316.jpeg", width: 1680, height: 1260 },
    ],
  },
};

export const EXMODULE: Maker = {
  name: "ExModule", initials: "EX", id: "exmodule", verified: true,
  logo: "https://exmodulhouse.ru/images/tild6362-3662-4839-b237-646139323337__photo.webp", logoFit: "cover", logoBackground: "transparent",
  siteUrl: "https://exmodulhouse.ru/", productionAddress: "Свердловская область, г. Верхняя Пышма, ул. Осипенко, 5",
  phone: "+7 (932) 480-86-86", email: "exmodulhouse@yandex.ru",
  profile: {
    groupedProjects: true, projectTabs: ["houses", "baths", "business"], useCatalogSummary: true,
    headlineSuffix: "— модульные дома и комплексы для глэмпинга в Екатеринбурге",
    technologyLabel: "Модульная технология",
    seo: { title: "ExModule — модульные дома и глэмпинги в Екатеринбурге", descriptionTemplate: "{projectCount} проектов ExModule: модульные дома под ключ, бани и решения для глэмпингов, цены, площади и сроки производства в Екатеринбурге." },
    intro: "Модульные дома с готовой отделкой, доставкой и монтажом, а также серийные решения для глэмпингов и баз отдыха.",
    namePrepositional: "ExModule", coordinates: { lat: 56.9697821, lon: 60.5986233 }, mapKind: "office",
    sourceAudit: {
      checkedAtIso: "2026-09-12", catalog: { sourceUrl: "https://exmodulhouse.ru/", expectedProjectCount: 14 },
      legal: { status: "unverified", sourceUrl: "https://exmodulhouse.ru/politika", note: "Оператор сайта ИП Кривцов Олег Игоревич и реквизиты подтверждены; полный реестровый профиль пока не собран." },
      reviews: { status: "not-found", note: "Независимый профиль с однозначным совпадением сайта, телефона и адреса не найден." },
      builtObjects: { status: "imported", sourceUrl: "https://exmodulhouse.ru/#exmodule-gallery", note: "Фотографии готовых домов перенесены из официального блока «Живые фото объектов»." },
      production: { status: "not-found", sourceUrl: "https://exmodulhouse.ru/", note: "На официальном сайте опубликован адрес офиса продаж; отдельный адрес производства не указан." },
      social: { youtube: { status: "not-found", note: "Подтверждённый канал не найден." }, telegram: { status: "not-found", note: "Подтверждённый канал не найден." } },
    },
    about: [
      "ExModule — завод модульных конструкций с офисом продаж в Верхней Пышме. Компания производит жилые дома, бани и готовые решения для коммерческого размещения.",
      "В официальном каталоге есть типовые дома, линейка домиков для глэмпинга, банные комплексы и проекты, объединяющие дом, баню и террасу.",
      "Производитель указывает срок изготовления 30–45 дней, монтаж за 1–3 дня и гарантию пять лет. Итоговая стоимость зависит от участка, фундамента, инженерии, доставки и выбранной комплектации.",
    ],
    builtObjects: [
      { src: "https://exmodulhouse.ru/images/tild6564-6230-4365-a265-366465623736__exmodule-gallery-01.webp", width: 1536, height: 1024 },
      { src: "https://exmodulhouse.ru/images/tild3062-6631-4731-b564-353131393230__exmodule-gallery-02.webp", width: 1536, height: 1024 },
      { src: "https://exmodulhouse.ru/images/tild6161-3738-4364-b564-613366323037__exmodule-gallery-03.webp", width: 1448, height: 1086 },
      { src: "https://exmodulhouse.ru/images/tild3465-6133-4435-a634-643637343662__exmodule-gallery-04.webp", width: 1600, height: 900 },
      { src: "https://exmodulhouse.ru/images/tild3961-3964-4432-b866-636132323839__exmodule-gallery-05.webp", width: 1600, height: 900 },
      { src: "https://exmodulhouse.ru/images/tild3830-3734-4431-b763-376230383932__exmodule-gallery-06.webp", width: 1448, height: 1086 },
    ],
  },
};

export const RUSSIAN_MODULAR_HOUSE: Maker = {
  name: "Русский Модульный Дом", initials: "РМ", id: "russian-modular-house", verified: true,
  logo: "https://static.tildacdn.com/tild6237-6164-4766-b934-363536336462/Vector_36.svg", logoFit: "contain", logoBackground: "light",
  siteUrl: "https://pkrmd.ru/", productionAddress: "Свердловская область, пос. Большой Исток, ул. Обухова, 10",
  phone: "+7 (922) 020-75-55", email: "info@pkrmd.ru",
  profile: {
    groupedProjects: true, projectTabs: ["houses", "baths"], useCatalogSummary: true,
    headlineSuffix: "— серийные модульные дома и бани на Урале",
    technologyLabel: "Модульная технология",
    seo: { title: "Русский Модульный Дом — проекты и цены в Екатеринбурге", descriptionTemplate: "{projectCount} проектов «Русского Модульного Дома»: жилые дома и готовые бани, площади, террасы, планировки и производство в Большом Истоке." },
    intro: "Серийные дома и бани из одного, двух и нескольких модулей с производством в посёлке Большой Исток.",
    namePrepositional: "«Русском Модульном Доме»", coordinates: { lat: 56.7220713, lon: 60.752884 },
    sourceAudit: {
      checkedAtIso: "2026-09-12", catalog: { sourceUrl: "https://pkrmd.ru/catalogrmd", expectedProjectCount: 20 },
      legal: { status: "unverified", sourceUrl: "https://pkrmd.ru/contacti", note: "ИП Бахирев Александр Андреевич указан оператором сайта; полный юридический профиль требует отдельной проверки реестров." },
      reviews: { status: "not-found", sourceUrl: "https://pkrmd.ru/", note: "Отзывы на сайте производителя найдены, но независимый профиль с достаточным совпадением не подключён." },
      builtObjects: { status: "imported", sourceUrl: "https://pkrmd.ru/", note: "Фотографии перенесены из официальной галереи производителя." },
      production: { status: "imported", sourceUrl: "https://pkrmd.ru/contacti", note: "Адрес производства опубликован в официальных контактах и нанесён на карту." },
      social: { youtube: { status: "unverified", sourceUrl: "https://pkrmd.ru/contacti", note: "Ссылка есть в контактах, канал отдельно не проверен." }, telegram: { status: "unverified", sourceUrl: "https://pkrmd.ru/contacti", note: "Ссылка есть в контактах, канал отдельно не проверен." } },
    },
    about: [
      "«Русский Модульный Дом» выпускает типовые жилые дома и готовые бани на собственном производстве в посёлке Большой Исток рядом с Екатеринбургом.",
      "Каталог построен вокруг серий «Уютный», «Комфортный» и «Просторный»: от компактных одномодульных решений до семейных домов и бань с террасами.",
      "Производитель заявляет строительство под ключ за срок до 60 дней. Цена и состав работ зависят от количества модулей, террасы, инженерии и комплектации.",
    ],
    builtObjects: [
      { src: "https://static.tildacdn.com/tild6337-3438-4630-b063-306464343162/photo_2026-07-07_123.jpeg", width: 960, height: 1280 },
      { src: "https://static.tildacdn.com/tild3836-3066-4639-a333-376139303335/photo_2026-07-07_130.jpeg", width: 960, height: 1280 },
      { src: "https://static.tildacdn.com/tild3638-3065-4339-a630-326335346562/photo_2026-08-20_195.jpeg", width: 720, height: 1280 },
      { src: "https://static.tildacdn.com/tild6432-6137-4133-b165-633765643732/photo_2026-07-14_223.jpeg", width: 1020, height: 768 },
      { src: "https://static.tildacdn.com/tild3063-3336-4230-b531-376133363766/photo_2026-07-14_223.jpeg", width: 1020, height: 768 },
      { src: "https://static.tildacdn.com/tild6335-3861-4435-b136-616632633161/photo_2026-07-14_223.jpeg", width: 1280, height: 960 },
    ],
  },
};

export const DA_HOME: Maker = {
  name: "DA-HOME", initials: "DA", id: "da-home", verified: true,
  logo: "https://da-home.ru/favicon.svg", logoFit: "contain", logoBackground: "light",
  siteUrl: "https://da-home.ru/", productionAddress: "Екатеринбург",
  phone: "+7 (950) 545-77-54",
  profile: {
    groupedProjects: true, projectTabs: ["houses", "baths"], useCatalogSummary: true,
    headlineSuffix: "— модульные дома, бани и дачные проекты в Екатеринбурге",
    technologyLabel: "Модульная технология",
    seo: { title: "DA-HOME — модульные дома и бани в Екатеринбурге", descriptionTemplate: "{projectCount} проектов DA-HOME: модульные и каркасные дома, готовые бани, площади, комплектации и производство в Екатеринбурге." },
    intro: "Модульные и каркасные дома, бани и дачные решения с отделкой, коммуникациями, доставкой и монтажом.",
    namePrepositional: "DA-HOME",
    sourceAudit: {
      checkedAtIso: "2026-09-12", catalog: { sourceUrl: "https://da-home.ru/", expectedProjectCount: 25 },
      legal: { status: "not-found", sourceUrl: "https://da-home.ru/", note: "На доступных официальных страницах реквизиты оператора сайта не опубликованы." },
      reviews: { status: "first-party-only", sourceUrl: "https://da-home.ru/", note: "Сайт показывает собственную подборку отзывов и заявляет рейтинг Авито; независимый виджет не подключён." },
      builtObjects: { status: "not-found", sourceUrl: "https://da-home.ru/", note: "Сайт заявляет построенные дома, но отдельную проверяемую галерею выполненных объектов не публикует." },
      production: { status: "imported", sourceUrl: "https://da-home.ru/", note: "Официальный сайт подтверждает собственное производство в Екатеринбурге; точный адрес не опубликован." },
      social: { youtube: { status: "not-found", note: "Подтверждённый канал не найден." }, telegram: { status: "not-found", sourceUrl: "https://da-home.ru/", note: "На сайте есть контакт Telegram, но публичный канал не указан." } },
    },
    about: [
      "DA-HOME производит модульные и каркасные дома и бани в Екатеринбурге. Компания указывает собственное производство, работу по договору и доставку по России.",
      "В каталоге представлены дачные и круглогодичные дома площадью от 15 до 127 м², семейные планировки, барнхаус, дома с террасами и несколько готовых бань.",
      "Производитель заявляет срок изготовления около 30 дней, готовую отделку и коммуникации. Точный срок, цену доставки и комплектацию необходимо подтверждать перед заказом.",
    ],
  },
};

export const MODULDOM_URAL: Maker = {
  name: "МОДУЛЬДОМ-УРАЛ", initials: "МУ", id: "moduldom-ural", verified: true,
  logo: "https://moduldom-ural.ru/sites/default/files/logo%202.png", logoFit: "contain", logoBackground: "light",
  siteUrl: "https://moduldom-ural.ru/", productionAddress: "Свердловская область, г. Берёзовский, территория Южная промзона, 24А",
  phone: "+7 (343) 200-24-23", additionalPhones: ["+7 (982) 704-00-02"], email: "moduldom@mail.ru", telegram: "https://t.me/moduldomural96",
  externalRating: { rating: 4, totalCount: 11, source: "yandex", sourceLabel: "Яндекс", embedUrl: "https://yandex.ru/maps-reviews-widget/161921692633?comments" },
  profile: {
    groupedProjects: true, projectTabs: ["houses", "baths"], useCatalogSummary: true,
    headlineSuffix: "— дачные модульные дома и готовые бани в Берёзовском",
    technologyLabel: "Модульная технология",
    seo: { title: "МОДУЛЬДОМ-УРАЛ — дачные дома и бани в Екатеринбурге", descriptionTemplate: "{projectCount} проектов МОДУЛЬДОМ-УРАЛ: дачные модульные дома и готовые бани разных размеров, производство, контакты и отзывы в Берёзовском." },
    intro: "Компактные дачные дома и готовые бани стандартных транспортных габаритов с производством в Берёзовском.",
    namePrepositional: "МОДУЛЬДОМ-УРАЛ", coordinates: { lat: 56.8943291, lon: 60.7810417 },
    sourceAudit: {
      checkedAtIso: "2026-09-12", catalog: { sourceUrl: "https://moduldom-ural.ru/modulnye-dachnye-doma.html", expectedProjectCount: 22 },
      legal: { status: "not-found", sourceUrl: "https://moduldom-ural.ru/politika-konfidencialnosti", note: "В доступной политике не указаны полные реквизиты оператора сайта." },
      reviews: { status: "imported", sourceUrl: "https://yandex.ru/maps/org/moduldom_ural/161921692633/reviews/", note: "Подключён совпавший профиль Яндекс Карт." },
      builtObjects: { status: "not-found", sourceUrl: "https://moduldom-ural.ru/", note: "Отдельный раздел с проверяемыми выполненными объектами не найден." },
      production: { status: "imported", sourceUrl: "https://moduldom-ural.ru/contacts.html", note: "Адрес офиса и производства опубликован в официальных контактах и нанесён на карту." },
      social: { youtube: { status: "not-found", note: "Подтверждённый канал не найден." }, telegram: { status: "not-found", sourceUrl: "https://t.me/moduldomural96", note: "Публичная лента не подключена к профилю; используется только ссылка для связи." } },
    },
    about: [
      "МОДУЛЬДОМ-УРАЛ производит дачные модульные дома, готовые бани и другие быстровозводимые здания в Берёзовском рядом с Екатеринбургом.",
      "В профиль включены только жилые дачные дома и бани. Строительные бытовки, посты охраны, киоски, вагон-дома и промышленные здания не относятся к текущему каталогу «Много места».",
      "Проекты различаются длиной, шириной и внутренней планировкой. Утепление, отделка, доставка и монтаж зависят от выбранной комплектации.",
    ],
    social: { telegramChannel: "moduldomural96", telegramPosts: [], youtubeVideos: [] },
  },
};

export const LESPROM96: Maker = {
  name: "ЛЕСПРОМ96", initials: "ЛП", id: "lesprom96", verified: true,
  siteUrl: "https://lesprom96.ru/", productionAddress: "Свердловская область, Сысертский район, пгт Двуреченск, ул. Ленина, 35В",
  phone: "+7 (995) 343-20-19",
  profile: {
    groupedProjects: true, projectTabs: ["houses", "baths"], useCatalogSummary: true,
    headlineSuffix: "— модульные дома и бани из собственного пиломатериала",
    technologyLabel: "Модульная технология",
    seo: { title: "ЛЕСПРОМ96 — модульные дома и бани в Свердловской области", descriptionTemplate: "{projectCount} проектов ЛЕСПРОМ96: модульные дома, бани и дом-баня из собственного пиломатериала, размеры и производство в Двуреченске." },
    intro: "Модульные дома и бани из кедра, липы и сосны с производством пиломатериалов в Сысертском районе.",
    namePrepositional: "ЛЕСПРОМ96", coordinates: { lat: 56.5980144, lon: 61.1004524 },
    sourceAudit: {
      checkedAtIso: "2026-09-12", catalog: { sourceUrl: "https://lesprom96.ru/", expectedProjectCount: 5, sourceMode: "shared-catalog-page" },
      legal: { status: "unverified", sourceUrl: "https://lesprom96.ru/", note: "На сайте указаны ООО «ЛЕСПРОМ96» и ИНН 6679128770; полный юридический профиль требует реестровой проверки." },
      reviews: { status: "not-found", note: "Независимый профиль, однозначно связанный с производством домов в Двуреченске, не найден." },
      builtObjects: { status: "not-found", sourceUrl: "https://lesprom96.ru/", note: "Фотографии относятся к товарным сериям; отдельный раздел выполненных объектов не опубликован." },
      production: { status: "imported", sourceUrl: "https://lesprom96.ru/", note: "Адрес производства опубликован на официальной странице и нанесён на карту." },
      social: { youtube: { status: "not-found", note: "Подтверждённый канал не найден." }, telegram: { status: "not-found", note: "Подтверждённый канал не найден." } },
    },
    about: [
      "ЛЕСПРОМ96 строит модульные дома и бани в посёлке Двуреченск Свердловской области. Компания использует пиломатериалы собственного производства из кедра, липы и сосны.",
      "На официальной странице представлены два жилых дома, две бани и комбинированный дом-баня. Детские игровые домики не включены в каталог жилых проектов.",
      "Производитель указывает доставку по УрФО и установку готового проекта за один-два дня; срок изготовления и комплектацию необходимо уточнять индивидуально.",
    ],
  },
};

export const E_MODULE_STROY: Maker = {
  name: "E.Module-stroy", initials: "EM", id: "e-module-stroy", verified: true,
  siteUrl: "https://www.emodule-stroy.ru/", productionAddress: "Екатеринбург, ДНТ Клевер",
  phone: "+7 (904) 981-88-07", email: "E.Module-stroy@yandex.ru", telegram: "https://t.me/+79049818807",
  profile: {
    groupedProjects: true, projectTabs: ["baths"], useCatalogSummary: true,
    headlineSuffix: "— готовые модульные бани под ключ в Екатеринбурге",
    technologyLabel: "Каркасно-модульная технология",
    seo: { title: "E.Module-stroy — модульные бани в Екатеринбурге", descriptionTemplate: "{projectCount} проектов E.Module-stroy: готовые каркасно-модульные бани под ключ, комплектации, производство и контакты в Екатеринбурге." },
    intro: "Линейка готовых каркасно-модульных бань с парной, моечной и комнатой отдыха в разных планировках.",
    namePrepositional: "E.Module-stroy",
    sourceAudit: {
      checkedAtIso: "2026-09-12", catalog: { sourceUrl: "https://www.emodule-stroy.ru/", expectedProjectCount: 9 },
      legal: { status: "not-found", sourceUrl: "https://www.emodule-stroy.ru/", note: "Полные реквизиты оператора на доступных страницах не опубликованы." },
      reviews: { status: "not-found", note: "Найден профиль другой организации E-Modul с иным телефоном и сайтом, поэтому отзывы не привязаны." },
      builtObjects: { status: "not-found", sourceUrl: "https://www.emodule-stroy.ru/", note: "Изображения относятся к товарам; отдельная галерея выполненных объектов не опубликована." },
      production: { status: "imported", sourceUrl: "https://www.emodule-stroy.ru/", note: "В официальных контактах адрес «Екатеринбург, ДНТ Клевер» прямо подписан как производство." },
      social: { youtube: { status: "not-found", note: "Подтверждённый канал не найден." }, telegram: { status: "not-found", sourceUrl: "https://www.emodule-stroy.ru/", note: "На сайте указан прямой Telegram-контакт, публичный канал не найден." } },
    },
    about: [
      "E.Module-stroy производит каркасно-модульные бани в Екатеринбурге. В официальном магазине представлены девять актуальных моделей.",
      "В карточках указаны варианты с двумя или тремя отделениями: парной, моечной и комнатой отдыха. Материалы, печь и инженерное оснащение зависят от выбранной комплектации.",
      "Производство расположено в ДНТ «Клевер». Доставка рассчитывается отдельно; компания рекомендует уточнять стоимость по адресу участка.",
    ],
  },
};

export const PREFABIA: Maker = {
  name: "PREFABIA", initials: "PF", id: "prefabia", verified: true,
  logo: "https://prefabia.ru/favicon.ico", logoFit: "contain", logoBackground: "light",
  siteUrl: "https://prefabia.ru/", productionAddress: "Свердловская область, пос. Октябрьский, ул. Свердлова, 1А, цех 6",
  phone: "+7 (982) 605-35-53",
  externalRating: { rating: 4.5, totalCount: 9, source: "yandex", sourceLabel: "Яндекс", embedUrl: "https://yandex.ru/maps-reviews-widget/207108934201?comments" },
  profile: {
    groupedProjects: true, projectTabs: ["houses", "baths"], useCatalogSummary: true,
    headlineSuffix: "— модульные дома Сканди, Платт и готовые бани",
    technologyLabel: "Модульная технология",
    seo: { title: "PREFABIA — модульные дома и бани в Екатеринбурге", descriptionTemplate: "{projectCount} актуальных проектов PREFABIA: дома серий Сканди, Платт и Шале, модульные бани, площади, производство и отзывы." },
    intro: "Модульные дома серий Сканди, Платт и Шале, а также готовые бани с производством в Свердловской области.",
    namePrepositional: "PREFABIA",
    sourceAudit: {
      checkedAtIso: "2026-09-12", catalog: { sourceUrl: "https://prefabia.ru/project/", expectedProjectCount: 18 },
      legal: { status: "imported", sourceUrl: "https://prefabia.ru/kontakty/", note: "Оператор сайта сопоставлен с действующим ИП по ИНН и ОГРНИП; реквизиты перенесены в единый юридический шаблон." },
      reviews: { status: "imported", sourceUrl: "https://yandex.ru/maps/org/prefabia/207108934201/", note: "Подключён профиль Яндекс Карт с совпавшими сайтом и телефоном." },
      builtObjects: { status: "imported", sourceUrl: "https://prefabia.ru/portfolio/", note: "Фотографии выполненных объектов перенесены из официального портфолио." },
      production: { status: "imported", sourceUrl: "https://prefabia.ru/kontakty/", note: "Адрес производства опубликован в официальных контактах; отсутствие координат не меняет статус факта." },
      social: { youtube: { status: "not-found", note: "Подтверждённый канал не найден." }, telegram: { status: "not-found", note: "Подтверждённый канал не найден." } },
    },
    about: [
      "PREFABIA — производитель модульных домов и готовых бань в Свердловской области. Компания выпускает серии Сканди, Платт и Шале для постоянного проживания, дачи, загородного отдыха и размещения гостей.",
      "Жилые проекты охватывают площади от 24 до 78 м², включая варианты с верандами. Линейка бань включает компактные модели и баню с гостевым домом.",
      "Серия Сканди объединяет компактные студии и семейные одноэтажные дома с отдельными спальнями, кухнями-гостиными и санузлами. В серии Платт представлены проекты с плоской кровлей, а Шале 76 отличается высокой кровлей, потолками до 3,4 м, тремя спальнями, двумя санузлами и верандой.",
      "В карточках проектов можно сравнить цены, площади, габариты, планировки и заявленные сроки производства. Для отдельных моделей указаны панорамные окна, тёплый пол, скрытая разводка коммуникаций, сантехника в комплектации и варианты с террасой. Окончательный состав работ зависит от выбранного дома или бани.",
      "Линейка бань включает компактные решения площадью от 12,5 м² и проекты с гостевой зоной, которые можно рассматривать для личного отдыха или аренды. Производство PREFABIA находится в посёлке Октябрьском; на странице также собраны фотографии выполненных объектов и отзывы покупателей с Яндекс Карт.",
    ],
    legal: {
      legalName: "ИП Ларионова Алена Витальевна",
      status: "Действует",
      registeredAt: "27 января 2023",
      foundingDate: "2023-01-27",
      inn: "666203610134",
      kpp: "Не применяется",
      ogrn: "323665800015970",
      legalAddress: "620010, Свердловская область, г. Екатеринбург, ул. Инженерная, д. 61, кв. 42",
      director: "Ларионова Алена Витальевна",
      mainActivity: "Производство прочих деревянных строительных конструкций и столярных изделий",
      shareCapital: "Не применяется",
      revenue: "Не публикуется",
      netProfit: "Не публикуется",
      reportingYear: "—",
      arbitrationCases: "Не найдено",
      enforcementProceedings: { open: 0, completed: 0 },
      unfairSuppliersRegistry: "Не числится",
      checkedAt: "12 сентября 2026",
      checkedAtIso: "2026-09-12",
      sources: [
        { label: "ЕГРИП ФНС", href: "https://egrul.nalog.ru/" },
        { label: "Арбитражные дела", href: "https://kad.arbitr.ru/" },
        { label: "ФССП", href: "https://fssp.gov.ru/iss/ip" },
        { label: "РНП ЕИС", href: "https://zakupki.gov.ru/epz/dishonestsupplier/search/results.html" },
      ],
    },
    builtObjects: [
      { src: "https://prefabia.ru/UPLOAD/2025/07/09/2025-07-09_23-02-57-255.webp", width: 2517, height: 1416 },
      { src: "https://prefabia.ru/UPLOAD/2025/04/18/1-674.webp", width: 1500, height: 1000 },
      { src: "https://prefabia.ru/UPLOAD/2025/05/07/2025-05-07_14-40-14.webp", width: 2520, height: 1680 },
      { src: "https://prefabia.ru/UPLOAD/2024/09/25/hygge-ural-kvatro-kompl-10.webp", width: 1500, height: 1000 },
      { src: "https://prefabia.ru/UPLOAD/2024/09/24/hygge-ural-dom-kvatro-3.webp", width: 1600, height: 1200 },
      { src: "https://prefabia.ru/UPLOAD/2025/07/27/shvetsiya130-1.webp", width: 1280, height: 853 },
      { src: "https://prefabia.ru/UPLOAD/2025/05/05/mone49-2-1.webp", width: 1600, height: 1068 },
      { src: "https://prefabia.ru/UPLOAD/2025/07/27/atmosfera34-1.webp", width: 1280, height: 960 },
      { src: "https://prefabia.ru/UPLOAD/2025/07/27/matis-2-1.webp", width: 1280, height: 852 },
      { src: "https://prefabia.ru/UPLOAD/2025/04/18/mone49-1.webp", width: 1437, height: 956 },
      { src: "https://prefabia.ru/UPLOAD/2024/09/27/hygge-ural-dver-v-les-1.webp", width: 1600, height: 1200 },
      { src: "https://prefabia.ru/UPLOAD/2025/06/14/img_5847.webp", width: 4032, height: 3024 },
    ],
  },
};

export const ZHAR_PARYCH: Maker = {
  name: "Жар Парыч", initials: "ЖП", id: "zhar-parych", verified: true,
  logo: "https://static.tildacdn.com/tild6536-3631-4531-b838-653764663065/zhar_parych.png", logoFit: "contain", logoBackground: "light",
  siteUrl: "https://www.dmbany.ru/", productionAddress: "Свердловская область, г. Сысерть, ул. Красногорская, 29",
  phone: "+7 (908) 923-75-95",
  profile: {
    groupedProjects: true, projectTabs: ["houses", "baths", "business"], useCatalogSummary: true,
    headlineSuffix: "— готовые бани и комплексы дом с баней в Сысерти",
    technologyLabel: "Каркасная технология",
    seo: { title: "Жар Парыч — готовые бани под ключ в Екатеринбурге", descriptionTemplate: "{projectCount} серий «Жар Парыч»: готовые бани СкандиЖар, Финляндия, БарниЖар и комплексы дом с баней, производство в Сысерти." },
    intro: "Готовые каркасные бани заводской сборки и комплексы дом с баней с доставкой в собранном виде и установкой на участке.",
    namePrepositional: "«Жар Парыч»", coordinates: { lat: 56.5126578, lon: 60.8384581 },
    sourceAudit: {
      checkedAtIso: "2026-09-12", catalog: { sourceUrl: "https://www.dmbany.ru/proekty-skandizhar", expectedProjectCount: 6, sourceMode: "shared-catalog-page" },
      legal: { status: "unverified", sourceUrl: "https://www.dmbany.ru/privacy_policy", note: "На сайте опубликованы реквизиты ИП Дмитриевского Дмитрия Владимировича; полный юридический профиль требует актуальной реестровой проверки." },
      reviews: { status: "first-party-only", sourceUrl: "https://www.dmbany.ru/", note: "Отзывы опубликованы на сайте производителя; совпавший независимый профиль не найден." },
      builtObjects: { status: "not-found", sourceUrl: "https://www.dmbany.ru/gotovye-doma-i-bani-v-nalichii", note: "Разовые объекты в наличии не считаются подтверждённым портфолио выполненных заказов." },
      production: { status: "imported", sourceUrl: "https://www.dmbany.ru/about_us", note: "Адрес производства опубликован на официальном сайте и нанесён на карту." },
      social: { youtube: { status: "not-found", note: "Подтверждённый канал не найден." }, telegram: { status: "not-found", note: "Подтверждённый публичный канал не найден." } },
    },
    about: [
      "«Жар Парыч» — производитель готовых каркасных бань и комплексов дом с баней из Сысерти. Изделия доставляют на участок в собранном виде.",
      "На сайте выделены продуктовые серии СкандиЖар, СкандиЖар Мини, Финляндия, БарниЖар и Классика. Отдельных постоянных URL для каждой планировки внутри серий нет, поэтому в каталоге они представлены как линейки.",
      "Производитель заявляет установку за один день и доставку по России. Фундамент, подключение коммуникаций и доставка зависят от выбранного проекта и участка.",
    ],
  },
};

const generatedManufacturerRecords = (generatedCatalogRegistry.manufacturers as unknown[])
  .map((manufacturer) => manufacturerSchema.parse(manufacturer));

const manufacturerRecords = [
  PLATFORMA, BYGGE, GLEZMAN, DIVODOM, GRADODOM, ZAGORODOM, APA, PRIME_MODUL, UTKINO, TEPLODINA, KARKAS_HAUS, URAL_HOUSE, HOCHU_DOM, BEREST_DOM, RIFT, IZBRUSA, SCANDI_ECODOM, KARKAS_POVOLZHYA, KAZANSTROY16, ASKHOME, DOMOTEKA, KARKAS_DOM_YUG, SIBIRYAK, SVOI_HOUSE, BAGROVSTROY, DOMAKARKAS, SK_GARMONIYA, DOMA_OT_MIHALYCHA, BARNSTUDIO, BELI_DOM, MASTERGRUPP_BARNAUL, PRAKTIKA_STROY, ECO_CITY, MODOM, HOUSEBOX, GLAVLES, FPS_MODUL, VEK_TRAD, BUDUSHIY_DOM, QUBDOM, DUROV_HOUSE, HISTHUT, COUNTRYHOUSE, CUBADOM, IDOLHOUSE, WOODALP, BOXMATE, UVHOUSE, ASTERIUS, SMOLA, ULTRADOMSPB, FREEDOM_NATURI, CHEBWOOD, CAMPINGDOM, PSLCOMP, DOMNASM, BLACKMODULE, DOMM, MY_MODULE, FOUR_MODUL, CUBBER, SIMPLEHOUSE, PANORAMIC_HOME, AMBARN, MYFAMILYHOUSE, STROYGRAD, MODULCAMP, ELMACO, NOVATOR, BLAGOHOUSE, STILNYE_MODULI, IP_MODUL, RUSMODUL_SPB,
  BM_DOM, SQ_MODYL, EXMODULE, RUSSIAN_MODULAR_HOUSE, DA_HOME, MODULDOM_URAL, LESPROM96, E_MODULE_STROY, PREFABIA, ZHAR_PARYCH,
  ...regionalMakers,
  ...generatedManufacturerRecords,
] as const;

const validatedManufacturers = manufacturerRecords.map((manufacturer) => manufacturerSchema.parse(manufacturer));

const duplicateManufacturerIds = validatedManufacturers
  .map((manufacturer) => manufacturer.id)
  .filter((id, index, ids) => ids.indexOf(id) !== index);

if (duplicateManufacturerIds.length > 0) {
  throw new Error(`Duplicate manufacturer ids: ${[...new Set(duplicateManufacturerIds)].join(", ")}`);
}

export const manufacturerRegistry: Readonly<Record<string, Manufacturer>> = Object.freeze(
  Object.fromEntries(validatedManufacturers.map((manufacturer) => [manufacturer.id, Object.freeze(manufacturer)])),
);

export const manufacturers = Object.freeze(validatedManufacturers);
