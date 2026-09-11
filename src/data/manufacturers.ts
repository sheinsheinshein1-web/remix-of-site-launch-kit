import makerPlatformaLogo from "@/assets/maker-platforma.webp";
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
  enforcementProceedings: z.string().min(1),
  unfairSuppliersRegistry: z.string().min(1),
  checkedAt: z.string().min(1),
  checkedAtIso: z.string().min(1),
  sources: z.array(z.object({ label: z.string().min(1), href: z.string().url() })),
});

const manufacturerProfileSchema = z.object({
  featuredLayout: z.boolean().default(false),
  groupedProjects: z.boolean().default(false),
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
  legal: manufacturerLegalSchema.optional(),
  builtObjects: z.array(z.object({
    src: z.string().url(),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
  })).optional(),
  social: z.object({
    telegramChannel: z.string().min(1),
    telegramPosts: z.array(z.number().int().positive()),
    youtubeVideos: z.array(z.object({
      id: z.string().min(1),
      title: z.string().min(1),
      publishedLabel: z.string().min(1),
      thumbnail: z.string().url(),
    })),
  }).optional(),
});

export const manufacturerSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  initials: z.string().min(1),
  logo: z.string().optional(),
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
export type ManufacturerLegal = z.output<typeof manufacturerLegalSchema>;
export type ManufacturerBuiltObject = NonNullable<ManufacturerProfile["builtObjects"]>[number];
export type ManufacturerSocial = NonNullable<ManufacturerProfile["social"]>;

export const PLATFORMA: Maker = {
  name: "Платформа",
  initials: "ПЛ",
  id: "platforma",
  verified: true,
  logo: makerPlatformaLogo,
  siteUrl: "https://platforma-modul.ru/",
  productionAddress: "Свердловская область, г. Березовский, территория Южная промышленная зона, д. 21",
  phone: "+7 (343) 226-11-40",
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
    featuredLayout: true,
    groupedProjects: true,
    useCatalogSummary: true,
    headlineSuffix: "— производитель модульных домов в Екатеринбурге",
    technologyLabel: "Модульная технология",
    seo: {
      title: "Платформа — модульные дома, проекты и цены в Екатеринбурге",
      descriptionTemplate: "{projectCount} проектов модульных домов и бань «Платформа» в Екатеринбурге: цены, площади, планировки, выполненные объекты, производство, отзывы и данные компании.",
    },
    intro: "Модульные дома и бани для круглогодичного проживания, отдыха и бизнеса.",
    namePrepositional: "Платформе",
    schemaLogoUrl: "https://static.tildacdn.com/tild6331-3532-4635-b130-373133653236/Group_145696.svg",
    coordinates: { lat: 56.89275, lon: 60.783923 },
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
      enforcementProceedings: "Не найдено",
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
  id: "bygge",
  verified: true,
  siteUrl: "https://bygge.ru/",
  productionAddress: "г. Екатеринбург, ул. Хлебная, 17",
  phone: "+7 (982) 693-70-39",
  email: "bygge_ural@mail.ru",
  telegram: "bygge_rus",
  profile: {
    intro: "Bygge — производитель модульных домов из Екатеринбурга.",
    about: ["Bygge — производитель модульных домов из Екатеринбурга. В каталоге представлены дома полной заводской готовности под ключ: с инженерными системами, оборудованным санузлом и решениями для круглогодичного проживания."],
    coordinates: { lat: 56.7923281, lon: 60.7321339 },
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
  siteUrl: "https://promo.glavles.com/",
  productionAddress: "г. Екатеринбург, ул. Сулимова, 50, офис 3.11",
  phone: "+7 (343) 206-50-88",
  email: "info@glavles.com",
};
export const FPS_MODUL: Maker = {
  name: "ФПС Модуль",
  initials: "ФП",
  id: "fps-modul",
  siteUrl: "https://fps-modul.ru/",
  productionAddress: "г. Екатеринбург, Берёзовский тракт, 6Б",
  phone: "+7 (966) 705-96-96",
  telegram: "https://t.me/fps_modul",
};
export const VEK_TRAD: Maker = {
  name: "Вековые Традиции",
  initials: "ВТ",
  id: "vek-trad",
  siteUrl: "https://vek-trad.ru/katalog-proektov-domov/modulnye/",
  productionAddress: "г. Екатеринбург, ул. Ирбитская, 13",
  phone: "+7 (343) 271-51-92",
  email: "info@vek-trad.ru",
};
export const BUDUSHIY_DOM: Maker = {
  name: "Будущий Дом",
  initials: "БД",
  id: "budushiy-dom",
  siteUrl: "https://budushiy-dom.ru/product-category/doma/",
  productionAddress: "Екатеринбург и Свердловская область",
  phone: "+7 (922) 124-42-52",
  email: "budushiy.dom@yandex.ru",
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

const manufacturerRecords = [
  PLATFORMA, BYGGE, GLEZMAN, DIVODOM, GRADODOM, ZAGORODOM, APA, PRIME_MODUL, UTKINO, TEPLODINA, KARKAS_HAUS, URAL_HOUSE, HOCHU_DOM, BEREST_DOM, RIFT, IZBRUSA, SCANDI_ECODOM, KARKAS_POVOLZHYA, KAZANSTROY16, ASKHOME, DOMOTEKA, KARKAS_DOM_YUG, SIBIRYAK, SVOI_HOUSE, BAGROVSTROY, DOMAKARKAS, SK_GARMONIYA, DOMA_OT_MIHALYCHA, BARNSTUDIO, BELI_DOM, MASTERGRUPP_BARNAUL, PRAKTIKA_STROY, ECO_CITY, MODOM, HOUSEBOX, GLAVLES, FPS_MODUL, VEK_TRAD, BUDUSHIY_DOM, QUBDOM, DUROV_HOUSE, HISTHUT, COUNTRYHOUSE, CUBADOM, IDOLHOUSE, WOODALP, BOXMATE, UVHOUSE, ASTERIUS, SMOLA, ULTRADOMSPB, FREEDOM_NATURI, CHEBWOOD, CAMPINGDOM, PSLCOMP, DOMNASM, BLACKMODULE, DOMM, MY_MODULE, FOUR_MODUL, CUBBER, SIMPLEHOUSE, PANORAMIC_HOME, AMBARN, MYFAMILYHOUSE, STROYGRAD, MODULCAMP, ELMACO, NOVATOR, BLAGOHOUSE, STILNYE_MODULI, IP_MODUL, RUSMODUL_SPB,
  ...regionalMakers,
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
