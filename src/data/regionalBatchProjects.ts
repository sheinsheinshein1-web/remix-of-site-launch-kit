import type { Maker, Project } from "@/data/projects";

const images = import.meta.glob<string>(
  [
    "../assets/azbuka/**/*.webp",
    "../assets/rostdomik/**/*.webp",
    "../assets/klyuch-st/**/*.webp",
    "../assets/doorhan/**/*.webp",
    "../assets/avgst/**/*.webp",
    "../assets/stroylider/**/*.webp",
    "../assets/postroidom/**/*.webp",
    "../assets/altai-mda/**/*.webp",
  ],
  { eager: true, import: "default" },
);

const gallery = (folder: string, planFiles: number[] = []) =>
  Object.entries(images)
    .filter(([path]) => path.includes(`/assets/${folder}/`))
    .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
    .map(([, image], index) => ({
      image,
      type: "photo" as const,
      fit: "contain" as const,
      ...(planFiles.includes(index + 1) ? {} : { blur: true }),
    }));

const AZBUKA: Maker = {
  name: "Азбука Дома",
  initials: "АД",
  id: "azbuka-doma",
  siteUrl: "https://krasnodar.azbuka-doma.ru/",
};

const YUZHNY_DOM: Maker = {
  name: "Южный Дом",
  initials: "ЮД",
  id: "yuzhny-dom",
  siteUrl: "https://krasnodar.rostdomik.ru/",
};

const KLYUCH_ST: Maker = {
  name: "Ключ СТ",
  initials: "КС",
  id: "klyuch-st",
  siteUrl: "https://kazan.domofcarcass.ru/",
};

const DOORHAN: Maker = {
  name: "DoorHan",
  initials: "DH",
  id: "doorhan-kazan",
  siteUrl: "https://kazan.doorhan-house.ru/catalog/",
};

const AVGST: Maker = {
  name: "Авангард Строй",
  initials: "АС",
  id: "avgst",
  siteUrl: "https://avgst.ru/catalog/modulnye-doma",
};

const STROYLIDER: Maker = {
  name: "Строй Лидер",
  initials: "СЛ",
  id: "stroylider-nn",
  siteUrl: "https://stroylider-nn.ru/catalog/kottedzhi/karkasnaya-tekhnologiya/",
};

const POSTROIDOM: Maker = {
  name: "ПостройДом",
  initials: "ПД",
  id: "postroidom-altai",
  siteUrl: "https://postroidom.com/",
};

const ALTAI_MDA: Maker = {
  name: "Алтай МодульДом",
  initials: "АМ",
  id: "altai-mda",
  siteUrl: "https://altai-mda.ru/modul-house",
};

export const regionalMakers = [AZBUKA, YUZHNY_DOM, KLYUCH_ST, DOORHAN, AVGST, STROYLIDER, POSTROIDOM, ALTAI_MDA];

type ProjectInput = {
  id: number;
  name: string;
  badge?: string;
  price: string;
  area: number;
  beds: number;
  baths: number;
  floors: number;
  term: string;
  city: string;
  maker: Maker;
  url: string;
  assetFolder: string;
  dimensions: string;
  description: string;
  technology: string;
  features: string[];
  style: string;
  planFiles?: number[];
  completion?: string;
  insulation?: string;
  suitableFor?: string[];
  landSize?: string;
  hasRealPhotos?: boolean;
  hasShowroom?: boolean;
  hasInstallment?: boolean;
};

const roomLabel = (beds: number) => {
  if (beds === 1) return "1 спальня";
  if (beds > 1 && beds < 5) return `${beds} спальни`;
  return `${beds} спален`;
};

const areaLabel = (area: number) => String(area).replace(".", ",");

const project = (input: ProjectInput): Project => ({
  id: input.id,
  name: input.name,
  badge: input.badge ?? (input.technology === "Модульный дом" ? "Модульный дом" : "Жилой дом"),
  price: input.price,
  area: `${areaLabel(input.area)} м²`,
  area_m2: input.area,
  beds: input.beds,
  baths: input.baths,
  floors: input.floors,
  term: input.term,
  rooms: roomLabel(input.beds),
  purpose: "ИЖС / СНТ",
  city: input.city,
  maker: { ...input.maker, siteUrl: input.url },
  description: input.description,
  descriptionLong: `Проект «${input.name}» от компании «${input.maker.name}»: дом площадью ${areaLabel(input.area)} м² и габаритами ${input.dimensions}. ${input.description}`,
  gallery: gallery(input.assetFolder, input.planFiles),
  likes: 28 + (input.id % 17),
  rating: 4.7 + (input.id % 3) * 0.05,
  suitableFor: input.suitableFor ?? ["Постоянное проживание", "Для семьи"],
  technology: input.technology,
  completion: input.completion ?? "Под ключ",
  insulation: input.insulation ?? "до −30°C",
  features: input.features,
  style: input.style,
  landSize: input.landSize ?? (input.area >= 120 ? "10+ соток" : "6–10 соток"),
  hasRealPhotos: input.hasRealPhotos ?? false,
  hasShowroom: input.hasShowroom ?? false,
  hasInstallment: input.hasInstallment ?? true,
});

export const regionalBatchProjects: Project[] = [
  // Азбука Дома · Краснодарский край
  project({
    id: 197, name: "Заря 7,5 × 8", price: "1 600 400 ₽", area: 57.6, beds: 2, baths: 1, floors: 1,
    term: "от 23 д.", city: "Краснодарский край", maker: AZBUKA,
    url: "https://krasnodar.azbuka-doma.ru/proekty/zhilye-karkasnye-doma-pod-klyuch/zarya/zarya-7-5-kh-8/",
    assetFolder: "azbuka/zarya-75x8", dimensions: "7,5 × 8 м",
    description: "Компактный одноэтажный каркасный дом с двумя спальнями и общей кухней-гостиной.",
    technology: "Каркасный", features: ["Терраса", "Кухня-гостиная"], style: "Классический", planFiles: [2, 3, 4],
  }),
  project({
    id: 198, name: "Заря 10 × 8,5", price: "2 008 600 ₽", area: 85, beds: 3, baths: 1, floors: 1,
    term: "от 25 д.", city: "Краснодарский край", maker: AZBUKA,
    url: "https://krasnodar.azbuka-doma.ru/proekty/zhilye-karkasnye-doma-pod-klyuch/zarya/zarya-10-kh-8-5/",
    assetFolder: "azbuka/zarya-10x85", dimensions: "10 × 8,5 м",
    description: "Одноэтажный семейный дом с тремя спальнями, санузлом и просторной общей зоной.",
    technology: "Каркасный", features: ["3 спальни", "Кухня-гостиная"], style: "Классический", planFiles: [2, 3, 4],
  }),
  project({
    id: 199, name: "Заря 11 × 8,5", price: "2 134 500 ₽", area: 88, beds: 3, baths: 1, floors: 1,
    term: "от 26 д.", city: "Краснодарский край", maker: AZBUKA,
    url: "https://krasnodar.azbuka-doma.ru/proekty/zhilye-karkasnye-doma-pod-klyuch/zarya/zarya-11-kh-8-5/",
    assetFolder: "azbuka/zarya-11x85", dimensions: "11 × 8,5 м",
    description: "Одноэтажный каркасный дом для семьи с тремя спальнями и удобной планировкой.",
    technology: "Каркасный", features: ["3 спальни", "Терраса"], style: "Классический", planFiles: [2, 3, 4],
  }),
  project({
    id: 200, name: "Заря 11 × 9,5", price: "2 275 700 ₽", area: 104.5, beds: 3, baths: 1, floors: 1,
    term: "от 27 д.", city: "Краснодарский край", maker: AZBUKA,
    url: "https://krasnodar.azbuka-doma.ru/proekty/zhilye-karkasnye-doma-pod-klyuch/zarya/zarya-11-kh-9-5/",
    assetFolder: "azbuka/zarya-11x95", dimensions: "11 × 9,5 м",
    description: "Просторный одноэтажный дом с тремя спальнями, кухней-гостиной и террасой.",
    technology: "Каркасный", features: ["Терраса", "3 спальни"], style: "Классический", planFiles: [2, 3, 4],
  }),
  project({
    id: 201, name: "Заря 9 × 9", price: "2 006 400 ₽", area: 81, beds: 3, baths: 1, floors: 1,
    term: "от 27 д.", city: "Краснодарский край", maker: AZBUKA,
    url: "https://krasnodar.azbuka-doma.ru/proekty/zhilye-karkasnye-doma-pod-klyuch/zarya/zarya-9-kh-9/",
    assetFolder: "azbuka/zarya-9x9", dimensions: "9 × 9 м",
    description: "Квадратный одноэтажный дом с четырьмя жилыми комнатами и компактной посадкой на участке.",
    technology: "Каркасный", features: ["Компактная планировка", "3 спальни"], style: "Классический", planFiles: [2, 3, 4],
  }),

  // Южный Дом · Краснодарский край
  project({
    id: 202, name: "Крепость", price: "3 358 000 ₽", area: 140, beds: 4, baths: 2, floors: 2,
    term: "от 14 д.", city: "Краснодарский край", maker: YUZHNY_DOM,
    url: "https://krasnodar.rostdomik.ru/proekty/proekty-karkasno-shchitovykh-domov/proekt-krepost/",
    assetFolder: "rostdomik/krepost", dimensions: "8 × 10 м",
    description: "Двухэтажный каркасный дом с четырьмя спальнями и террасой площадью 10 м².",
    technology: "Каркасный", features: ["Терраса", "4 спальни"], style: "Классический", planFiles: [3, 4],
  }),
  project({
    id: 203, name: "Ангел", price: "3 210 000 ₽", area: 132, beds: 4, baths: 2, floors: 2,
    term: "от 14 д.", city: "Краснодарский край", maker: YUZHNY_DOM,
    url: "https://krasnodar.rostdomik.ru/proekty/proekty-karkasno-shchitovykh-domov/proekt-angel/",
    assetFolder: "rostdomik/angel", dimensions: "12 × 7,5 м",
    description: "Семейный двухэтажный дом с четырьмя спальнями и большой террасой площадью 24 м².",
    technology: "Каркасный", features: ["Большая терраса", "4 спальни"], style: "Классический", planFiles: [3, 4],
  }),
  project({
    id: 204, name: "Комфортный 6 × 8", price: "2 471 000 ₽", area: 85, beds: 3, baths: 1, floors: 2,
    term: "от 20 д.", city: "Краснодарский край", maker: YUZHNY_DOM,
    url: "https://krasnodar.rostdomik.ru/proekty/proekty-karkasno-shchitovykh-domov/proekt-komfortnyy-6h8/",
    assetFolder: "rostdomik/komfort-6x8", dimensions: "6 × 10 м",
    description: "Компактный двухэтажный дом с тремя спальнями и крытой террасой площадью 16 м².",
    technology: "Каркасный", features: ["Крытая терраса", "3 спальни"], style: "Классический", planFiles: [3, 4],
  }),
  project({
    id: 205, name: "Жемчужина Мини", price: "977 000 ₽", area: 25, beds: 1, baths: 1, floors: 1,
    term: "от 10 д.", city: "Краснодарский край", maker: YUZHNY_DOM,
    url: "https://krasnodar.rostdomik.ru/proekty/proekty-karkasno-shchitovykh-domov/dom-5kh7-zhemchuzhina-mini/",
    assetFolder: "rostdomik/zhemchuzhina-mini", dimensions: "5 × 7 м",
    description: "Небольшой дачный дом с отдельной спальней и террасой площадью 10 м².",
    technology: "Каркасный", features: ["Терраса", "Компактный дом"], style: "Классический",
    suitableFor: ["Выходные / дача", "Для пары"], landSize: "3–6 соток", planFiles: [3, 4],
  }),
  project({
    id: 206, name: "Жемчужина", price: "1 513 000 ₽", area: 48, beds: 2, baths: 1, floors: 1,
    term: "от 14 д.", city: "Краснодарский край", maker: YUZHNY_DOM,
    url: "https://krasnodar.rostdomik.ru/proekty/proekty-karkasno-shchitovykh-domov/proekt-zhemchuzhina/",
    assetFolder: "rostdomik/zhemchuzhina", dimensions: "6 × 8 м",
    description: "Одноэтажный каркасный дом с двумя спальнями и террасой площадью 12 м².",
    technology: "Каркасный", features: ["Терраса", "2 спальни"], style: "Классический", planFiles: [3, 4],
  }),

  // Ключ СТ · Казань
  project({
    id: 207, name: "Дом 6 × 6", price: "по запросу", area: 36, beds: 1, baths: 1, floors: 1,
    term: "по запросу", city: "Казань", maker: KLYUCH_ST,
    url: "https://kazan.domofcarcass.ru/home/karkasnyy-dom-6-na-6/",
    assetFolder: "klyuch-st/dom-6x6", dimensions: "6 × 6 м",
    description: "Компактный одноэтажный каркасный дом для дачи или небольшой семьи.",
    technology: "Каркасный", features: ["Компактный дом", "Крыльцо"], style: "Классический",
    suitableFor: ["Выходные / дача", "Для пары"], landSize: "3–6 соток", planFiles: [2, 3],
  }),
  project({
    id: 208, name: "Дом 6 × 9", price: "1 239 000 ₽", area: 54, beds: 2, baths: 1, floors: 1,
    term: "по запросу", city: "Казань", maker: KLYUCH_ST,
    url: "https://kazan.domofcarcass.ru/home/karkasnyj-dom-6-na-9-vozmozhen-kredit/",
    assetFolder: "klyuch-st/dom-6x9", dimensions: "6 × 9 м",
    description: "Одноэтажный дом для круглогодичного проживания с двумя спальнями и коммуникациями.",
    technology: "Каркасный", features: ["Коммуникации", "Круглогодичный"], style: "Современный", planFiles: [2, 3],
  }),
  project({
    id: 209, name: "Дом 5 × 7", price: "по запросу", area: 35, beds: 1, baths: 1, floors: 1,
    term: "по запросу", city: "Казань", maker: KLYUCH_ST,
    url: "https://kazan.domofcarcass.ru/home/karkasnyy-dom-5-na-7/",
    assetFolder: "klyuch-st/dom-5x7", dimensions: "5 × 7 м",
    description: "Небольшой одноэтажный дом с утеплением для круглогодичного проживания.",
    technology: "Каркасный", features: ["Компактный дом", "Утепление"], style: "Современный",
    suitableFor: ["Выходные / дача", "Для пары"], landSize: "3–6 соток", planFiles: [2],
  }),
  project({
    id: 210, name: "Дом 6 × 8", price: "по запросу", area: 48, beds: 2, baths: 1, floors: 1,
    term: "по запросу", city: "Казань", maker: KLYUCH_ST,
    url: "https://kazan.domofcarcass.ru/home/karkasnyj-dom-6-na-8/",
    assetFolder: "klyuch-st/dom-6x8", dimensions: "6 × 8 м",
    description: "Одноэтажный каркасный дом с двумя спальнями, утеплённым контуром и металлической дверью.",
    technology: "Каркасный", features: ["2 спальни", "Утепление"], style: "Современный", planFiles: [2, 3, 4],
  }),
  project({
    id: 211, name: "Дом 8 × 12", price: "2 270 000 ₽", area: 96, beds: 3, baths: 1, floors: 1,
    term: "по запросу", city: "Казань", maker: KLYUCH_ST,
    url: "https://kazan.domofcarcass.ru/home/karkasnyj-dom-8-na-12/",
    assetFolder: "klyuch-st/dom-8x12", dimensions: "8 × 12 м",
    description: "Просторный одноэтажный дом заводской сборки с тремя спальнями и инженерными коммуникациями.",
    technology: "Каркасный", features: ["Заводская сборка", "3 спальни"], style: "Современный", planFiles: [2],
  }),

  // DoorHan · Казань
  project({
    id: 212, name: "DoorHan 29", price: "1 398 123 ₽", area: 29, beds: 1, baths: 1, floors: 1,
    term: "от 1 мес.", city: "Казань", maker: DOORHAN,
    url: "https://kazan.doorhan-house.ru/catalog/doorhan/dom-29/",
    assetFolder: "doorhan/dom-29", dimensions: "4,88 × 6,055 м",
    description: "Компактный домокомплект из двух модулей с одной спальней и санузлом.",
    technology: "Домокомплект", features: ["2 модуля", "Панорамные окна"], style: "Современный",
    suitableFor: ["Выходные / дача", "Для пары"], landSize: "3–6 соток",
  }),
  project({
    id: 213, name: "DoorHan 44", price: "1 872 319 ₽", area: 44, beds: 1, baths: 1, floors: 1,
    term: "от 1 мес.", city: "Казань", maker: DOORHAN,
    url: "https://kazan.doorhan-house.ru/catalog/doorhan/dom-44/",
    assetFolder: "doorhan/dom-44", dimensions: "7,325 × 6,055 м",
    description: "Одноэтажный домокомплект из трёх модулей с отдельной спальней и кухней-гостиной.",
    technology: "Домокомплект", features: ["3 модуля", "Кухня-гостиная"], style: "Современный",
  }),
  project({
    id: 214, name: "DoorHan 59", price: "2 322 402 ₽", area: 59, beds: 2, baths: 1, floors: 1,
    term: "от 1 мес.", city: "Казань", maker: DOORHAN,
    url: "https://kazan.doorhan-house.ru/catalog/doorhan/dom-59/",
    assetFolder: "doorhan/dom-59", dimensions: "9,77 × 6,055 м",
    description: "Одноэтажный домокомплект с двумя спальнями, общей зоной и санузлом.",
    technology: "Домокомплект", features: ["2 спальни", "4 модуля"], style: "Современный",
  }),
  project({
    id: 215, name: "DoorHan 74", price: "2 894 765 ₽", area: 74, beds: 2, baths: 1, floors: 1,
    term: "от 1 мес.", city: "Казань", maker: DOORHAN,
    url: "https://kazan.doorhan-house.ru/catalog/doorhan/dom-74/",
    assetFolder: "doorhan/dom-74", dimensions: "12,12 × 7,325 м",
    description: "Просторный мобильный дом из пяти модулей с двумя спальнями и кухней-гостиной.",
    technology: "Домокомплект", features: ["5 модулей", "2 спальни"], style: "Современный",
  }),
  project({
    id: 216, name: "DoorHan 88", price: "3 155 374 ₽", area: 88, beds: 3, baths: 2, floors: 2,
    term: "от 1 мес.", city: "Казань", maker: DOORHAN,
    url: "https://kazan.doorhan-house.ru/catalog/doorhan/bystrovozvodimyy-dom-88-2/",
    assetFolder: "doorhan/dom-88", dimensions: "7,615 × 6,345 м",
    description: "Двухэтажный быстровозводимый дом с тремя спальнями и двумя санузлами.",
    technology: "Домокомплект", features: ["2 этажа", "3 спальни"], style: "Современный",
  }),

  // Авангард Строй · Нижний Новгород
  project({
    id: 217, name: "Барн 75", badge: "Модульный дом", price: "3 563 000 ₽", area: 75.3, beds: 2, baths: 1, floors: 1,
    term: "от 10 недель", city: "Нижний Новгород", maker: AVGST,
    url: "https://avgst.ru/catalog/modulnye-doma/product/modulnyi-dom-barn-75",
    assetFolder: "avgst/barn-75", dimensions: "12 × 8,3 м",
    description: "Модульный барнхаус с двумя комнатами, санузлом и панорамным остеклением.",
    technology: "Модульный дом", features: ["Панорамные окна", "Эскроу"], style: "Барнхаус",
    hasShowroom: true,
  }),
  project({
    id: 218, name: "Барн 134", badge: "Модульный дом", price: "5 758 000 ₽", area: 133.65, beds: 3, baths: 2, floors: 1,
    term: "от 10 недель", city: "Нижний Новгород", maker: AVGST,
    url: "https://avgst.ru/catalog/modulnye-doma/product/modulnyi-dom-barn-134",
    assetFolder: "avgst/barn-134", dimensions: "15,3 × 10,2 м",
    description: "Просторный модульный барнхаус с тремя комнатами и двумя санузлами.",
    technology: "Модульный дом", features: ["Панорамные окна", "Эскроу"], style: "Барнхаус",
    hasShowroom: true,
  }),
  project({
    id: 219, name: "Экохаус 124", badge: "Модульный дом", price: "5 717 000 ₽", area: 123.1, beds: 3, baths: 2, floors: 1,
    term: "от 10 недель", city: "Нижний Новгород", maker: AVGST,
    url: "https://avgst.ru/catalog/modulnye-doma/product/modulnyi-dom-ekokhaus-124",
    assetFolder: "avgst/ekokhaus-124", dimensions: "15 × 10,2 м",
    description: "Современный модульный дом с тремя комнатами, двумя санузлами и просторными общими зонами.",
    technology: "Модульный дом", features: ["Панорамные окна", "Эскроу"], style: "Современный",
    hasShowroom: true,
  }),
  project({
    id: 220, name: "Барн 74", badge: "Модульный дом", price: "3 361 000 ₽", area: 75.88, beds: 2, baths: 1, floors: 1,
    term: "от 10 недель", city: "Нижний Новгород", maker: AVGST,
    url: "https://avgst.ru/catalog/modulnye-doma/product/modulnyi-dom-barn-74",
    assetFolder: "avgst/barn-74", dimensions: "12,4 × 8,3 м",
    description: "Одноэтажный модульный барнхаус с двумя комнатами и быстрым монтажом.",
    technology: "Модульный дом", features: ["Терраса", "Эскроу"], style: "Барнхаус",
    hasShowroom: true,
  }),
  project({
    id: 221, name: "Барн 73", badge: "Модульный дом", price: "3 489 000 ₽", area: 68.8, beds: 2, baths: 1, floors: 1,
    term: "от 10 недель", city: "Нижний Новгород", maker: AVGST,
    url: "https://avgst.ru/catalog/modulnye-doma/product/modulnyi-dom-barn-73",
    assetFolder: "avgst/barn-73", dimensions: "12 × 6,6 м",
    description: "Компактный модульный барнхаус с двумя комнатами и панорамным остеклением.",
    technology: "Модульный дом", features: ["Панорамные окна", "Терраса"], style: "Барнхаус",
    hasShowroom: true, planFiles: [5],
  }),

  // Строй Лидер · Нижний Новгород
  project({
    id: 222, name: "Карелия 82", price: "2 409 750 ₽", area: 148.2, beds: 3, baths: 2, floors: 1,
    term: "от 2 мес.", city: "Нижний Новгород", maker: STROYLIDER,
    url: "https://stroylider-nn.ru/catalog/kottedzhi/karkasnyy-dom-kareliya-82/",
    assetFolder: "stroylider/kareliya-82", dimensions: "12,6 × 14,6 м",
    description: "Большой одноэтажный каркасный дом с тремя спальнями и просторной общей зоной.",
    technology: "Каркасный", features: ["3 спальни", "Терраса"], style: "Современный", planFiles: [2, 3, 4],
  }),
  project({
    id: 223, name: "Карелия 81", price: "2 025 656 ₽", area: 78.5, beds: 2, baths: 1, floors: 1,
    term: "от 2 мес.", city: "Нижний Новгород", maker: STROYLIDER,
    url: "https://stroylider-nn.ru/catalog/kottedzhi/karkasnyy-dom-kareliya-81/",
    assetFolder: "stroylider/kareliya-81", dimensions: "7,3 × 11,7 м",
    description: "Одноэтажный семейный дом с двумя спальнями и вытянутой удобной планировкой.",
    technology: "Каркасный", features: ["2 спальни", "Кухня-гостиная"], style: "Современный", planFiles: [2, 3, 4],
  }),
  project({
    id: 224, name: "Карелия 80", price: "1 199 969 ₽", area: 60.74, beds: 2, baths: 1, floors: 2,
    term: "от 2 мес.", city: "Нижний Новгород", maker: STROYLIDER,
    url: "https://stroylider-nn.ru/catalog/kottedzhi/karkasnyy-dom-kareliya-80/",
    assetFolder: "stroylider/kareliya-80", dimensions: "6 × 6 м",
    description: "Компактный двухэтажный каркасный дом с двумя спальнями и небольшой площадью застройки.",
    technology: "Каркасный", features: ["2 этажа", "Компактный дом"], style: "Классический", planFiles: [2, 3, 4],
  }),
  project({
    id: 225, name: "Карелия 75", price: "1 656 524 ₽", area: 102.6, beds: 3, baths: 1, floors: 2,
    term: "от 2 мес.", city: "Нижний Новгород", maker: STROYLIDER,
    url: "https://stroylider-nn.ru/catalog/kottedzhi/karkasnyy-dom-kareliya-75/",
    assetFolder: "stroylider/kareliya-75", dimensions: "7,25 × 8,3 м",
    description: "Двухэтажный каркасный дом с тремя спальнями и классической двускатной кровлей.",
    technology: "Каркасный", features: ["3 спальни", "2 этажа"], style: "Классический", planFiles: [2, 3, 4],
  }),
  project({
    id: 226, name: "Карелия 76", price: "2 203 721 ₽", area: 141.34, beds: 4, baths: 2, floors: 2,
    term: "от 2 мес.", city: "Нижний Новгород", maker: STROYLIDER,
    url: "https://stroylider-nn.ru/catalog/kottedzhi/karkasnyy-dom-kareliya-76/",
    assetFolder: "stroylider/kareliya-76", dimensions: "9 × 10,5 м",
    description: "Просторный двухэтажный дом с четырьмя спальнями для большой семьи.",
    technology: "Каркасный", features: ["4 спальни", "2 этажа"], style: "Классический", planFiles: [2, 3, 4],
  }),

  // ПостройДом · Алтайский край
  project({
    id: 227, name: "Forest 91", price: "7 735 000 ₽", area: 91, beds: 2, baths: 1, floors: 1,
    term: "по запросу", city: "Алтайский край", maker: POSTROIDOM,
    url: "https://postroidom.com/karkasniidomforest91",
    assetFolder: "postroidom/forest-91", dimensions: "по проекту производителя",
    description: "Одноэтажный каркасный дом с двумя спальнями и террасой площадью 16,5 м².",
    technology: "Каркасный", features: ["Терраса", "Панорамные окна"], style: "Современный",
  }),
  project({
    id: 228, name: "Forest 109", price: "9 265 000 ₽", area: 109, beds: 3, baths: 1, floors: 1,
    term: "по запросу", city: "Алтайский край", maker: POSTROIDOM,
    url: "https://postroidom.com/karkasniidomforest109",
    assetFolder: "postroidom/forest-109", dimensions: "по проекту производителя",
    description: "Одноэтажный семейный дом с тремя спальнями и выразительным современным фасадом.",
    technology: "Каркасный", features: ["3 спальни", "Панорамные окна"], style: "Современный",
  }),
  project({
    id: 229, name: "Forest 137", price: "11 635 000 ₽", area: 137, beds: 3, baths: 2, floors: 2,
    term: "по запросу", city: "Алтайский край", maker: POSTROIDOM,
    url: "https://postroidom.com/karkasniidomforest137",
    assetFolder: "postroidom/forest-137", dimensions: "по проекту производителя",
    description: "Двухэтажный каркасный дом с тремя спальнями и просторными зонами общего пользования.",
    technology: "Каркасный", features: ["2 этажа", "3 спальни"], style: "Современный",
  }),
  project({
    id: 230, name: "Forest 253", price: "21 505 000 ₽", area: 253, beds: 4, baths: 2, floors: 1,
    term: "по запросу", city: "Алтайский край", maker: POSTROIDOM,
    url: "https://postroidom.com/karkasniidomforest253",
    assetFolder: "postroidom/forest-253", dimensions: "по проекту производителя",
    description: "Большой одноэтажный каркасный дом с четырьмя спальнями и панорамным остеклением.",
    technology: "Каркасный", features: ["4 спальни", "Панорамные окна"], style: "Современный",
  }),
  project({
    id: 231, name: "A-Frame 50", badge: "A-frame", price: "5 175 000 ₽", area: 50, beds: 1, baths: 1, floors: 2,
    term: "по запросу", city: "Алтайский край", maker: POSTROIDOM,
    url: "https://postroidom.com/aframe50",
    assetFolder: "postroidom/aframe-50", dimensions: "по проекту производителя",
    description: "Компактный двухуровневый A-frame с одной спальней и панорамным фасадом.",
    technology: "Каркасный", features: ["Панорамные окна", "Второй свет"], style: "A-frame",
    suitableFor: ["Выходные / дача", "Для пары"], landSize: "3–6 соток",
  }),

  // Алтай МодульДом · Алтайский край
  project({
    id: 232, name: "Октябрь", badge: "Модульный дом", price: "4 600 000 ₽", area: 71.2, beds: 2, baths: 1, floors: 1,
    term: "от 2 мес.", city: "Алтайский край", maker: ALTAI_MDA,
    url: "https://altai-mda.ru/modul-house/tproduct/395449700-547847831382-amd-oktyabr",
    assetFolder: "altai-mda/oktyabr", dimensions: "9,5 × 7,5 м",
    description: "Семейный модульный дом с двумя спальнями и просторной кухней-гостиной.",
    technology: "Модульный дом", features: ["2 спальни", "Кухня-гостиная"], style: "Современный",
    hasRealPhotos: true,
  }),
  project({
    id: 233, name: "Ая", badge: "Модульный дом", price: "2 750 000 ₽", area: 34.1, beds: 1, baths: 1, floors: 1,
    term: "от 2 мес.", city: "Алтайский край", maker: ALTAI_MDA,
    url: "https://altai-mda.ru/modul-house/tproduct/395449700-346210170332-amd-aya",
    assetFolder: "altai-mda/aya", dimensions: "7 × 6 м",
    description: "Компактный модульный дом с отдельной спальней для пары или загородного отдыха.",
    technology: "Модульный дом", features: ["Компактный дом", "Панорамные окна"], style: "Современный",
    suitableFor: ["Выходные / дача", "Для пары"], landSize: "3–6 соток", hasRealPhotos: true,
  }),
  project({
    id: 234, name: "Флора", badge: "Модульный дом", price: "1 400 000 ₽", area: 15, beds: 1, baths: 1, floors: 1,
    term: "от 2 мес.", city: "Алтайский край", maker: ALTAI_MDA,
    url: "https://altai-mda.ru/modul-house/tproduct/395449700-921700790641-amd-flora",
    assetFolder: "altai-mda/flora", dimensions: "6 × 2,5 м",
    description: "Мини-дом заводской готовности для гостевого размещения или загородного отдыха.",
    technology: "Модульный дом", features: ["Мини-дом", "Заводская готовность"], style: "Современный",
    suitableFor: ["Выходные / дача", "Для одного"], landSize: "3–6 соток", hasRealPhotos: true,
  }),
  project({
    id: 235, name: "Узнезя", badge: "Модульный дом", price: "3 800 000 ₽", area: 48.7, beds: 2, baths: 1, floors: 1,
    term: "от 2 мес.", city: "Алтайский край", maker: ALTAI_MDA,
    url: "https://altai-mda.ru/modul-house/tproduct/395449700-624180291981-amd-uznezya",
    assetFolder: "altai-mda/uznezya", dimensions: "6,9 × 8,5 м",
    description: "Одноэтажный модульный дом с двумя спальнями и функциональной общей зоной.",
    technology: "Модульный дом", features: ["2 спальни", "Панорамные окна"], style: "Современный",
    hasRealPhotos: true,
  }),
  project({
    id: 236, name: "Барантал", badge: "Модульный дом", price: "3 800 000 ₽", area: 49.9, beds: 2, baths: 1, floors: 1,
    term: "от 2 мес.", city: "Алтайский край", maker: ALTAI_MDA,
    url: "https://altai-mda.ru/modul-house/tproduct/395449700-329025468202-amd-barantal",
    assetFolder: "altai-mda/barantal", dimensions: "6,5 × 8 м",
    description: "Компактный семейный модульный дом с двумя спальнями и современной архитектурой.",
    technology: "Модульный дом", features: ["2 спальни", "Терраса"], style: "Современный",
    hasRealPhotos: true,
  }),
];
