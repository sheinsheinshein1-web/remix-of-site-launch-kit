// ============================================================================
// ЕДИНЫЙ ИСТОЧНИК ПРАВДЫ для проектов / производителей / городов.
//
// Чтобы добавить новый проект — добавь объект в массив `projects` ниже.
// Он автоматически появится:
//   • в каталоге (/catalog)
//   • в карточке товара (/project/:id)
//   • в счётчике производителя (ManufacturersList)
//
// Чтобы добавить производителя — добавь объект в `manufacturers`.
// Чтобы добавить город — добавь строку в `cities`.
// ============================================================================

// Платформа
import wideHouse1 from "@/assets/wide-house-1.webp";
import wideHouse2 from "@/assets/wide-house-2.webp";
import wideHousePlan3d from "@/assets/wide-house-plan-3d.webp";
import wideHousePlan from "@/assets/wide-house-plan.webp";
import cabin31_1 from "@/assets/cabin-31-1.webp";
import cabin31_2 from "@/assets/cabin-31-2.webp";
import cabin31Plan3d from "@/assets/cabin-31-plan-3d.webp";
import cabin31Plan from "@/assets/cabin-31-plan.webp";
import bear1 from "@/assets/bear-1.webp";
import bear2 from "@/assets/bear-2.webp";
import bear3 from "@/assets/bear-3.webp";
import bearPlan3d from "@/assets/bear-plan-3d.webp";
import bearPlan from "@/assets/bear-plan.webp";
import bear77_1 from "@/assets/bear77-1.webp";
import bear77_2 from "@/assets/bear77-2.webp";
import bear77Plan3d from "@/assets/bear77-plan-3d.webp";
import bear77Plan from "@/assets/bear77-plan.webp";
import bear86_1 from "@/assets/bear86-1.webp";
import bear86_2 from "@/assets/bear86-2.webp";
import bear86_3 from "@/assets/bear86-3.webp";
import bear86Plan3d from "@/assets/bear86-plan-3d.webp";
import bear86Plan from "@/assets/bear86-plan.webp";
import bear134_1 from "@/assets/bear134-1.webp";
import bear134_2 from "@/assets/bear134-2.webp";
import bear134_3 from "@/assets/bear134-3.webp";
import bear134Plan3d from "@/assets/bear134-plan-3d.webp";
import bear134Plan from "@/assets/bear134-plan.webp";
import vast140_1 from "@/assets/vast140-1.webp";
import vast140_2 from "@/assets/vast140-2.webp";
import vast140_3 from "@/assets/vast140-3.webp";
import vast140Plan3d from "@/assets/vast140-plan-3d.webp";
import vast140Plan from "@/assets/vast140-plan.webp";
import bear168_1 from "@/assets/bear168-1.webp";
import bear168_2 from "@/assets/bear168-2.webp";
import bear168Plan3d from "@/assets/bear168-plan-3d.webp";
import bear168Plan from "@/assets/bear168-plan.webp";

// Bygge
import patio1 from "@/assets/patio-2.jpeg";
import patio2 from "@/assets/patio-3.jpg";
import patio3 from "@/assets/patio-4.jpg";
import patio4 from "@/assets/patio-5.jpg";
import patio5 from "@/assets/patio-6.jpg";
import patio6 from "@/assets/patio-9.jpg";
import patio7 from "@/assets/patio-10.jpg";
import patio8 from "@/assets/patio-11.jpg";
import patioPlan1 from "@/assets/patio-plan-1.jpg";
import patioPlan2 from "@/assets/patio-plan-2.jpg";
import tundra1 from "@/assets/tundra-1.jpg";
import tundra2 from "@/assets/tundra-2.jpg";
import tundra3 from "@/assets/tundra-3.jpg";
import tundra4 from "@/assets/tundra-4.jpg";
import tundra5 from "@/assets/tundra-5.jpg";
import tundra6 from "@/assets/tundra-6.jpg";
import tundra7 from "@/assets/tundra-7.jpg";
import tundraPlan1 from "@/assets/tundra-plan-1.jpg";
import tundraPlan2 from "@/assets/tundra-plan-2.jpg";
import tundraPlan3 from "@/assets/tundra-plan-3.jpg";
import sherwood1 from "@/assets/sherwood-1.jpg";
import sherwood2 from "@/assets/sherwood-2.jpg";
import sherwood3 from "@/assets/sherwood-3.jpg";
import sherwood4 from "@/assets/sherwood-4.jpg";
import sherwood5 from "@/assets/sherwood-5.jpg";
import sherwood6 from "@/assets/sherwood-6.jpg";
import sherwood7 from "@/assets/sherwood-7.jpg";
import sherwood8 from "@/assets/sherwood-8.jpg";
import sherwood9 from "@/assets/sherwood-9.jpg";
import sherwoodPlan1 from "@/assets/sherwood-plan-1.jpg";
import senat1 from "@/assets/senat-1.jpg";
import senat2 from "@/assets/senat-2.jpg";
import senat3 from "@/assets/senat-3.png";
import senat4 from "@/assets/senat-4.png";
import senat5 from "@/assets/senat-5.png";
import senat6 from "@/assets/senat-6.png";
import senat7 from "@/assets/senat-7.jpg";
import senat8 from "@/assets/senat-8.jpg";
import senat9 from "@/assets/senat-9.jpg";
import senatPlan1 from "@/assets/senat-plan-1.jpg";
import familySuite1 from "@/assets/family-suite-1.jpg";
import familySuite2 from "@/assets/family-suite-2.jpg";
import familySuite3 from "@/assets/family-suite-3.jpg";
import familySuitePlan1 from "@/assets/family-suite-plan-1.jpg";
import gallant1 from "@/assets/gallant-1.jpg";
import gallant2 from "@/assets/gallant-2.jpg";
import gallant3 from "@/assets/gallant-3.jpg";
import gallant4 from "@/assets/gallant-4.jpg";
import gallant5 from "@/assets/gallant-5.jpg";
import gallant6 from "@/assets/gallant-6.jpg";
import gallant7 from "@/assets/gallant-7.jpg";
import gallantPlan1 from "@/assets/gallant-plan-1.jpg";
import grandis1 from "@/assets/grandis-1.jpg";
import grandis2 from "@/assets/grandis-2.jpg";
import grandis3 from "@/assets/grandis-3.jpg";
import grandis4 from "@/assets/grandis-4.jpg";
import grandis5 from "@/assets/grandis-5.jpg";
import grandis6 from "@/assets/grandis-6.jpg";
import grandis7 from "@/assets/grandis-7.jpg";
import grandisPlan1 from "@/assets/grandis-plan-1.jpg";

// Glezman Group
import larus45_1 from "@/assets/glezman/larus-45.jpg";
import larus45_2 from "@/assets/glezman/larus-45-2.jpg";
import larus45_3 from "@/assets/glezman/larus-45-3.png";
import larus75_1 from "@/assets/glezman/larus-75.jpg";
import larus75_2 from "@/assets/glezman/larus-75-2.jpg";
import larus75_3 from "@/assets/glezman/larus-75-3.png";
import larus100_1 from "@/assets/glezman/larus-100.jpg";
import larus100_2 from "@/assets/glezman/larus-100-2.jpg";
import larus100_3 from "@/assets/glezman/larus-100-3.jpg";
import larus100_4 from "@/assets/glezman/larus-100-4.jpg";
import larus100_5 from "@/assets/glezman/larus-100-5.jpg";
import larus120_1 from "@/assets/glezman/larus-120.jpg";
import larus120_2 from "@/assets/glezman/larus-120-2.jpg";
import larus120_3 from "@/assets/glezman/larus-120-3.jpg";
import larus120_4 from "@/assets/glezman/larus-120-4.jpg";
import larus120_5 from "@/assets/glezman/larus-120-5.jpg";
import larus127_1 from "@/assets/glezman/larus-127.jpg";
import larus127_2 from "@/assets/glezman/larus-127-2.jpg";
import larus127_3 from "@/assets/glezman/larus-127-3.png";

// ============================================================================
// ТИПЫ
// ============================================================================

export type GalleryItem = {
  image: string;
  type?: "photo" | "video";
  fit?: "cover" | "contain";
  blur?: boolean; // blur-фон в каталоге для фото с прозрачным/неровным фоном
  objectPosition?: string;
};

export type Maker = {
  name: string;
  initials: string;
  id?: string;
  logo?: string;
  siteUrl?: string;
};

export type Project = {
  id: number;
  name: string;
  badge: string; // "Жилой дом" / "Барнхаус" / ...
  price: string; // "5 480 000 ₽" или "по запросу"
  area: string;
  area_m2?: number;
  beds: number;
  baths: number;
  floors: number;
  term: string; // "30 д."
  rooms: string; // "2 спальни"
  purpose: string; // "ИЖС / СНТ"
  city: string;
  maker: Maker;
  description: string;
  descriptionLong: string;
  gallery: GalleryItem[];
  // Каталожные фильтры/мета:
  likes: number;
  rating: number;
  suitableFor: string[];
  technology: string;
  completion: string;
  insulation: string;
  features: string[];
  style: string;
  landSize: string;
  hasRealPhotos: boolean;
  hasShowroom: boolean;
  hasInstallment: boolean;
};

// ============================================================================
// ПРОИЗВОДИТЕЛИ
// ============================================================================

const PLATFORMA: Maker = {
  name: "Платформа",
  initials: "ПЛ",
  id: "platforma",
  siteUrl: "https://platforma-modul.ru/",
};
const BYGGE: Maker = {
  name: "Bygge",
  initials: "BG",
  id: "bygge",
};
const GLEZMAN: Maker = {
  name: "Glezman Group",
  initials: "GG",
  id: "glezman",
};
const DIVODOM: Maker = {
  name: "ДивоДом",
  initials: "ДД",
  id: "divodom",
  siteUrl: "https://www.divodom.net/",
};

// ============================================================================
// ПРОЕКТЫ — единый источник правды
// ============================================================================

export const projects: Project[] = [
  // ── Платформа · Екатеринбург ────────────────────────────────────────────
  {
    id: 32, name: "Wide House", badge: "Жилой дом", price: "5 480 000 ₽",
    area: "46,4 м²", beds: 2, baths: 1, floors: 1, term: "30 д.",
    rooms: "2 спальни", purpose: "ИЖС / СНТ", city: "Екатеринбург", maker: PLATFORMA,
    description: "Одноэтажный дом 9,2 × 7,2 м с двускатной кровлей и террасой. Две спальни, санузел, кухня-гостиная.",
    descriptionLong: "Wide House — компактный загородный дом площадью 46,4 м² с продуманной планировкой: две спальни (6,25 и 13,88 м²), санузел 4,44 м², кухня 7,94 м², гостиная 8,9 м², прихожая 2,57 м² и терраса 10,36 м². Деревянный каркас, металлическая фальцевая кровля, панорамное остекление гостиной.",
    gallery: [
      { image: wideHouse1, type: "photo" },
      { image: wideHouse2, type: "photo" },
      { image: wideHousePlan3d, type: "photo", fit: "contain" },
      { image: wideHousePlan, type: "photo", fit: "contain" },
    ],
    likes: 64, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи", "Выходные / дача"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса", "Панорамные окна"], style: "Скандинавский", landSize: "6–10 соток",
    hasRealPhotos: true, hasShowroom: true, hasInstallment: true,
  },
  {
    id: 33, name: "Barn House", badge: "Жилой дом", price: "1 680 000 ₽",
    area: "42,9 м²", beds: 1, baths: 1, floors: 1, term: "30 д.",
    rooms: "1 спальня", purpose: "ИЖС / СНТ", city: "Екатеринбург", maker: PLATFORMA,
    description: "Одноэтажный модульный дом 9,8 × 5,2 м с двускатной кровлей и террасой 22,9 м². Спальня-гостиная, санузел с ванной, кухня.",
    descriptionLong: "Barn House — компактный загородный дом площадью 42,9 м² с продуманной планировкой: гостиная 14,07 м², санузел 4,06 м², прихожая 1,92 м² и просторная терраса 22,89 м². Деревянный каркас, фальцевая металлическая кровля, панорамное остекление по торцу с выходом на террасу.",
    gallery: [
      { image: cabin31_1, type: "photo" },
      { image: cabin31_2, type: "photo" },
      { image: cabin31Plan3d, type: "photo", fit: "contain" },
      { image: cabin31Plan, type: "photo", fit: "contain" },
    ],
    likes: 48, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для одного / пары", "Выходные / дача"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса", "Панорамные окна"], style: "Скандинавский", landSize: "3–6 соток",
    hasRealPhotos: true, hasShowroom: true, hasInstallment: true,
  },
  {
    id: 34, name: "Bear House 45", badge: "Жилой дом", price: "2 207 000 ₽",
    area: "41 м²", beds: 1, baths: 1, floors: 1, term: "30 д.",
    rooms: "1 спальня", purpose: "ИЖС / СНТ", city: "Екатеринбург", maker: PLATFORMA,
    description: "Одноэтажный модульный дом 9,0 × 5,3 м с двускатной кровлей и крытой террасой 12,3 м². Спальня, санузел, кухня-гостиная с панорамным остеклением.",
    descriptionLong: "Bear House 45 — компактный загородный дом площадью 41 м² с продуманной планировкой: кухня-гостиная 18,22 м², спальня 5,29 м², санузел 5,09 м² и крытая терраса 12,34 м². Деревянный каркас, фальцевая металлическая кровля, панорамное остекление с выходом на террасу.",
    gallery: [
      { image: bear1, type: "photo" },
      { image: bear2, type: "photo" },
      { image: bear3, type: "photo" },
      { image: bearPlan3d, type: "photo", fit: "contain" },
      { image: bearPlan, type: "photo", fit: "contain" },
    ],
    likes: 39, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для одного / пары", "Выходные / дача"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса", "Панорамные окна"], style: "Скандинавский", landSize: "3–6 соток",
    hasRealPhotos: true, hasShowroom: true, hasInstallment: true,
  },
  {
    id: 35, name: "Bear House 77", badge: "Жилой дом", price: "3 894 700 ₽",
    area: "61,32 м²", beds: 2, baths: 1, floors: 1, term: "45 д.",
    rooms: "2 спальни", purpose: "ИЖС / СНТ", city: "Екатеринбург", maker: PLATFORMA,
    description: "Одноэтажный модульный дом 11,1 × 6,06 м с плоской кровлей и террасой 15,92 м². Две спальни, кухня-гостиная, санузел.",
    descriptionLong: "Bear House 77 — загородный дом площадью 61,32 м² с продуманной планировкой: гостиная 17,08 м², кухня 4,88 м², две спальни по 8,21 м², санузел 3,76 м², прихожая 3,26 м² и просторная терраса 15,92 м². Деревянный каркас, плоская кровля, панорамное остекление гостиной с выходом на террасу.",
    gallery: [
      { image: bear77_1, type: "photo" },
      { image: bear77_2, type: "photo" },
      { image: bear77Plan3d, type: "photo", fit: "contain" },
      { image: bear77Plan, type: "photo", fit: "contain" },
    ],
    likes: 52, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи", "Выходные / дача"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса", "Панорамные окна"], style: "Скандинавский", landSize: "6–10 соток",
    hasRealPhotos: true, hasShowroom: true, hasInstallment: true,
  },
  {
    id: 36, name: "Bear House 86", badge: "Жилой дом", price: "4 349 000 ₽",
    area: "68,7 м²", beds: 2, baths: 2, floors: 1, term: "50 д.",
    rooms: "2 спальни", purpose: "ИЖС / СНТ", city: "Екатеринбург", maker: PLATFORMA,
    description: "Одноэтажный модульный дом 13,7 × 6,17 м с двускатной кровлей и террасой 9,24 м². Две спальни, два санузла, кухня и гостиная.",
    descriptionLong: "Bear House 86 — загородный дом площадью 68,7 м² с продуманной планировкой: кухня 15,06 м², гостиная 12,01 м², две спальни (9,24 и 13,60 м²), два санузла (4,44 и 2,60 м²), коридор 2,51 м² и крытая терраса 9,24 м². Деревянный каркас, фальцевая металлическая кровля, панорамное остекление гостиной с выходом на террасу.",
    gallery: [
      { image: bear86_1, type: "photo" },
      { image: bear86_2, type: "photo" },
      { image: bear86_3, type: "photo" },
      { image: bear86Plan3d, type: "photo", fit: "contain" },
      { image: bear86Plan, type: "photo", fit: "contain" },
    ],
    likes: 58, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса", "Панорамные окна"], style: "Скандинавский", landSize: "6–10 соток",
    hasRealPhotos: true, hasShowroom: true, hasInstallment: true,
  },
  {
    id: 37, name: "Bear House 134", badge: "Жилой дом", price: "8 762 000 ₽",
    area: "110 м²", beds: 3, baths: 3, floors: 1, term: "70 д.",
    rooms: "3 спальни", purpose: "ИЖС / СНТ", city: "Екатеринбург", maker: PLATFORMA,
    description: "Одноэтажный модульный дом 15,8 × 9,9 м с двускатной кровлей и двумя террасами. Три спальни, три санузла, гардероб, гостиная-кухня.",
    descriptionLong: "Bear House 134 — просторный загородный дом площадью 110 м² с продуманной планировкой: гостиная 20,20 м², кухня 9,53 м², три спальни (14,26, 16,49 и одна дополнительная), три санузла, гардероб 4,43 м², коридор 8,06 м², прихожая 3,17 м² и две крытых террасы (13,5 и 8,0 м²). Деревянный каркас, фальцевая металлическая кровля, панорамное остекление гостиной с выходом на террасу.",
    gallery: [
      { image: bear134_1, type: "photo" },
      { image: bear134_2, type: "photo" },
      { image: bear134_3, type: "photo" },
      { image: bear134Plan3d, type: "photo", fit: "contain" },
      { image: bear134Plan, type: "photo", fit: "contain" },
    ],
    likes: 71, rating: 4.9,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса", "Панорамные окна"], style: "Скандинавский", landSize: "от 10 соток",
    hasRealPhotos: true, hasShowroom: true, hasInstallment: true,
  },
  {
    id: 38, name: "Vast House 140", badge: "Жилой дом", price: "8 077 600 ₽",
    area: "114,9 м²", beds: 4, baths: 2, floors: 1, term: "75 д.",
    rooms: "4 спальни", purpose: "ИЖС / СНТ", city: "Екатеринбург", maker: PLATFORMA,
    description: "Просторный одноэтажный модульный дом 17,9 × 7,9 м с двускатной кровлей и акцентными деревянными фронтонами. Четыре спальни, два санузла, гостиная-кухня 41,9 м².",
    descriptionLong: "Vast House 140 — просторный загородный дом площадью 114,9 м² с продуманной планировкой для большой семьи: гостиная 23,76 м², кухня 18,10 м², четыре спальни (13,63, 9,37, 9,26 и 6,75 м²), два санузла (5,65 м²), коридор 6,39 м², прихожая 4,05 м² и помещение ИОС 5,67 м². Деревянный каркас, фальцевая металлическая кровля, контрастные деревянные акценты на фронтонах и входной группе.",
    gallery: [
      { image: vast140_1, type: "photo", objectPosition: "right center" },
      { image: vast140_2, type: "photo" },
      { image: vast140_3, type: "photo" },
      { image: vast140Plan3d, type: "photo", fit: "contain" },
      { image: vast140Plan, type: "photo", fit: "contain" },
    ],
    likes: 83, rating: 4.9,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса", "Панорамные окна"], style: "Скандинавский", landSize: "от 10 соток",
    hasRealPhotos: true, hasShowroom: true, hasInstallment: true,
  },
  {
    id: 39, name: "Bear House 168", badge: "Жилой дом", price: "12 110 400 ₽",
    area: "146,4 м²", beds: 4, baths: 3, floors: 1, term: "90 д.",
    rooms: "4 спальни", purpose: "ИЖС / СНТ", city: "Екатеринбург", maker: PLATFORMA,
    description: "Просторный одноэтажный модульный дом 14,1 × 13,1 м со сложной геометрией кровли, камином и террасой-пирсом. Четыре спальни, три санузла, гардероб, гостиная-кухня 51,25 м².",
    descriptionLong: "Bear House 168 — флагманский проект площадью 146,4 м² для большой семьи: гостиная с камином 41,72 м², кухня 9,53 м², четыре спальни (13,29, 9,99, 8,79 и одна гостевая), три санузла (3,80, 2,98, 1,80 м²), гардероб 3,23 м², кладовая 4,67 м², помещение ИОС 3,50 м², коридор 7,66 м² и прихожая 2,44 м². Комбинированный фасад: контрастный темный объем с фальцевой кровлей и теплый деревянный объем с двускатной крышей, две крытых террасы.",
    gallery: [
      { image: bear168_1, type: "photo" },
      { image: bear168_2, type: "photo" },
      { image: bear168Plan3d, type: "photo", fit: "contain" },
      { image: bear168Plan, type: "photo", fit: "contain" },
    ],
    likes: 95, rating: 4.9,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса", "Панорамные окна", "Камин"], style: "Скандинавский", landSize: "от 10 соток",
    hasRealPhotos: true, hasShowroom: true, hasInstallment: true,
  },

  // ── Bygge · Екатеринбург ────────────────────────────────────────────────
  {
    id: 40, name: "ПАТИО", badge: "Жилой дом", price: "2 598 000 ₽",
    area: "45 м²", beds: 3, baths: 1, floors: 1, term: "60 д.",
    rooms: "3 комнаты", purpose: "ИЖС / СНТ", city: "Екатеринбург",
    maker: { ...BYGGE, siteUrl: "https://bygge.ru/katalog/patio/" },
    description: "Модульный дом 7,3 × 6,1 м под ключ. Высота потолка 2,5 м, тёплые полы, оборудованный санузел, вытяжная вентиляция с выходом на крышу.",
    descriptionLong: "ПАТИО — модульный дом площадью 45 м² с продуманной планировкой и полной заводской готовностью. Высота потолка 2,5 м. Утепление пол / стена / потолок — 200 / 150 / 150 мм. Полностью оборудованный санузел, вытяжная вентиляция с выходом на крышу, кабельные тёплые полы. В подарок — защитная сетка от грызунов.",
    gallery: [
      { image: patio5, type: "photo", fit: "contain", blur: true },
      { image: patio2, type: "photo", fit: "contain", blur: true },
      { image: patio3, type: "photo", fit: "contain", blur: true },
      { image: patio4, type: "photo", fit: "contain", blur: true },
      { image: patio1, type: "photo", fit: "contain", blur: true },
      { image: patio6, type: "photo", fit: "contain", blur: true },
      { image: patio7, type: "photo", fit: "contain", blur: true },
      { image: patio8, type: "photo", fit: "contain", blur: true },
      { image: patioPlan1, type: "photo", fit: "contain" },
      { image: patioPlan2, type: "photo", fit: "contain" },
    ],
    likes: 27, rating: 4.7,
    suitableFor: ["Постоянное проживание", "Для семьи", "Выходные / дача"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "до −30°C",
    features: ["Тёплые полы", "Вытяжная вентиляция"], style: "Современный", landSize: "3–6 соток",
    hasRealPhotos: true, hasShowroom: true, hasInstallment: true,
  },
  {
    id: 41, name: "ТУНДРА", badge: "Жилой дом", price: "5 990 000 ₽",
    area: "96 м²", beds: 4, baths: 1, floors: 1, term: "60 д.",
    rooms: "4 спальни", purpose: "ИЖС / СНТ", city: "Екатеринбург",
    maker: { ...BYGGE, siteUrl: "https://bygge.ru/katalog/tundra/" },
    description: "Барнхаус 8 × 12 м для круглогодичного проживания. Высота потолка 3 м, оборудованный санузел, вытяжная вентиляция с выходом на крышу.",
    descriptionLong: "ТУНДРА — барнхаус площадью 96 м² для круглогодичного проживания. Высота потолка 3 м. Утепление пол / стена / потолок — 200 / 150 / 150 мм. Полностью оборудованный санузел, вытяжная вентиляция с выходом на крышу. В подарок — конвекторы отопления.",
    gallery: [
      { image: tundra1, type: "photo", fit: "contain", blur: true },
      { image: tundra2, type: "photo", fit: "contain", blur: true },
      { image: tundra3, type: "photo", fit: "contain", blur: true },
      { image: tundra4, type: "photo", fit: "contain", blur: true },
      { image: tundra5, type: "photo", fit: "contain", blur: true },
      { image: tundra6, type: "photo", fit: "contain", blur: true },
      { image: tundra7, type: "photo", fit: "contain", blur: true },
      { image: tundraPlan1, type: "photo", fit: "contain" },
      { image: tundraPlan2, type: "photo", fit: "contain" },
      { image: tundraPlan3, type: "photo", fit: "contain" },
    ],
    likes: 34, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "до −30°C",
    features: ["Тёплые полы", "Вытяжная вентиляция", "Барнхаус"], style: "Барнхаус", landSize: "6–10 соток",
    hasRealPhotos: true, hasShowroom: true, hasInstallment: true,
  },
  {
    id: 42, name: "ШЕРВУД", badge: "Жилой дом", price: "5 635 000 ₽",
    area: "87 м²", beds: 4, baths: 1, floors: 1, term: "60 д.",
    rooms: "4 спальни", purpose: "ИЖС / СНТ", city: "Екатеринбург",
    maker: { ...BYGGE, siteUrl: "https://bygge.ru/katalog/sherwood/" },
    description: "Модульный дом 7,3 × 12 м для круглогодичного проживания. Высота потолка 2,95 м, оборудованный санузел, вытяжная вентиляция с выходом на крышу.",
    descriptionLong: "ШЕРВУД — модульный дом площадью 87 м² для круглогодичного проживания. Высота потолка 2,95 м. Утепление пол / стена / потолок — 200 / 150 / 150 мм. Полностью оборудованный санузел, вытяжная вентиляция с выходом на крышу. В подарок — конвекторы отопления.",
    gallery: [
      { image: sherwood1, type: "photo", fit: "contain", blur: true },
      { image: sherwood2, type: "photo", fit: "contain", blur: true },
      { image: sherwood3, type: "photo", fit: "contain", blur: true },
      { image: sherwood4, type: "photo", fit: "contain", blur: true },
      { image: sherwood5, type: "photo", fit: "contain", blur: true },
      { image: sherwood6, type: "photo", fit: "contain", blur: true },
      { image: sherwood7, type: "photo", fit: "contain", blur: true },
      { image: sherwood8, type: "photo", fit: "contain", blur: true },
      { image: sherwood9, type: "photo", fit: "contain", blur: true },
      { image: sherwoodPlan1, type: "photo", fit: "contain" },
    ],
    likes: 29, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "до −30°C",
    features: ["Тёплые полы", "Вытяжная вентиляция"], style: "Современный", landSize: "6–10 соток",
    hasRealPhotos: true, hasShowroom: true, hasInstallment: true,
  },
  {
    id: 43, name: "СЕНАТ", badge: "Жилой дом", price: "6 545 000 ₽",
    area: "96 м²", beds: 4, baths: 1, floors: 1, term: "60 д.",
    rooms: "4 комнаты", purpose: "ИЖС / СНТ", city: "Екатеринбург",
    maker: { ...BYGGE, siteUrl: "https://bygge.ru/katalog/senat/" },
    description: "Барнхаус 96 м² для круглогодичного проживания. Три спальни, кухня-гостиная, оборудованный санузел, тёплые полы и просторная терраса.",
    descriptionLong: "СЕНАТ — барнхаус площадью 96 м² для круглогодичного проживания. Планировка: кухня-гостиная 30,2 м², три спальни (10,2; 10; 7 м²), санузел 4,6 м², прихожая 7,5 м², терраса 11,8 м² и крыльцо 3 м². Утепление пол / стена / потолок — 200 / 150 / 150 мм, полностью оборудованный санузел, вытяжная вентиляция с выходом на крышу, кабельные тёплые полы.",
    gallery: [
      { image: senat3, type: "photo", fit: "contain", blur: true },
      { image: senat4, type: "photo", fit: "contain", blur: true },
      { image: senat5, type: "photo", fit: "contain", blur: true },
      { image: senat6, type: "photo", fit: "contain", blur: true },
      { image: senat1, type: "photo", fit: "contain", blur: true },
      { image: senat2, type: "photo", fit: "contain", blur: true },
      { image: senat7, type: "photo", fit: "contain", blur: true },
      { image: senat8, type: "photo", fit: "contain", blur: true },
      { image: senat9, type: "photo", fit: "contain", blur: true },
      { image: senatPlan1, type: "photo", fit: "contain" },
    ],
    likes: 31, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "до −30°C",
    features: ["Тёплые полы", "Вытяжная вентиляция", "Барнхаус"], style: "Барнхаус", landSize: "6–10 соток",
    hasRealPhotos: true, hasShowroom: true, hasInstallment: true,
  },
  {
    id: 44, name: "ФАМИЛЬНЫЙ", badge: "Жилой дом", price: "4 050 000 ₽",
    area: "72 м²", beds: 1, baths: 1, floors: 1, term: "60 д.",
    rooms: "2 комнаты", purpose: "ИЖС / СНТ", city: "Екатеринбург",
    maker: { ...BYGGE, siteUrl: "https://bygge.ru/katalog/family-suite/" },
    description: "Модульный дом 8 × 9 м для круглогодичного проживания. Кухня-гостиная 29 м², спальня 7,2 м², санузел 4,6 м² и просторная терраса.",
    descriptionLong: "ФАМИЛЬНЫЙ (Family Suite) — модульный дом площадью 72 м² для круглогодичного проживания. Высота потолка 3 м. Утепление пол / стена / потолок — 200 / 150 / 150 мм. Просторная кухня-гостиная 29 м², отдельная спальня 7,2 м², полностью оборудованный санузел 4,6 м², большая терраса. Вытяжная вентиляция с выходом на крышу, кабельные тёплые полы. В подарок — конвекторы отопления.",
    gallery: [
      { image: familySuite1, type: "photo", fit: "contain", blur: true },
      { image: familySuite2, type: "photo", fit: "contain", blur: true },
      { image: familySuite3, type: "photo", fit: "contain", blur: true },
      { image: familySuitePlan1, type: "photo", fit: "contain" },
    ],
    likes: 26, rating: 4.7,
    suitableFor: ["Постоянное проживание", "Для семьи", "Выходные / дача"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "до −30°C",
    features: ["Тёплые полы", "Вытяжная вентиляция", "Терраса"], style: "Современный", landSize: "3–6 соток",
    hasRealPhotos: true, hasShowroom: true, hasInstallment: true,
  },
  {
    id: 45, name: "ГАЛАНТ", badge: "Жилой дом", price: "3 346 000 ₽",
    area: "59 м²", beds: 2, baths: 1, floors: 1, term: "35 д.",
    rooms: "3 комнаты", purpose: "ИЖС / СНТ", city: "Екатеринбург",
    maker: { ...BYGGE, siteUrl: "https://bygge.ru/katalog/gallant/" },
    description: "Модульный дом 7,3 × 8,1 м, 3 комнаты. Полностью оборудованный санузел, кабельные тёплые полы, вытяжная вентиляция.",
    descriptionLong: "ГАЛАНТ — модульный дом площадью 59 м², размеры 7,3 × 8,1 м, 3 комнаты. Высота потолка 2,5 м. Утепление пол / стена / потолок — 200 / 150 / 150 мм. Полностью оборудованный санузел, вытяжная вентиляция с выходом на крышу, кабельные тёплые полы. В подарок — защитная сетка от грызунов.",
    gallery: [
      { image: gallant1, type: "photo", fit: "contain", blur: true },
      { image: gallant2, type: "photo", fit: "contain", blur: true },
      { image: gallant3, type: "photo", fit: "contain", blur: true },
      { image: gallant4, type: "photo", fit: "contain", blur: true },
      { image: gallant5, type: "photo", fit: "contain", blur: true },
      { image: gallant6, type: "photo", fit: "contain", blur: true },
      { image: gallant7, type: "photo", fit: "contain", blur: true },
      { image: gallantPlan1, type: "photo", fit: "contain" },
    ],
    likes: 24, rating: 4.7,
    suitableFor: ["Постоянное проживание", "Для семьи", "Выходные / дача"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "до −30°C",
    features: ["Тёплые полы", "Вытяжная вентиляция", "Терраса"], style: "Современный", landSize: "3–6 соток",
    hasRealPhotos: true, hasShowroom: true, hasInstallment: true,
  },
  {
    id: 46, name: "ГРАНДИС", badge: "Барнхаус", price: "1 585 000 ₽",
    area: "30 м²", beds: 1, baths: 1, floors: 1, term: "30 д.",
    rooms: "2 комнаты", purpose: "ИЖС / СНТ", city: "Екатеринбург",
    maker: { ...BYGGE, siteUrl: "https://bygge.ru/katalog/grandis/" },
    description: "Барнхаус 6 × 5 м, 2 комнаты. Полностью оборудованный санузел, кабельные тёплые полы, вытяжная вентиляция.",
    descriptionLong: "ГРАНДИС — барнхаус площадью 30 м², размеры 6 × 5 м, 2 комнаты. Высота потолка 2,5 м. Утепление пол / стена / потолок — 200 / 150 / 150 мм. Полностью оборудованный санузел, вытяжная вентиляция с выходом на крышу, кабельные тёплые полы. В подарок — защитная сетка от грызунов.",
    gallery: [
      { image: grandis1, type: "photo", fit: "contain", blur: true },
      { image: grandis2, type: "photo", fit: "contain", blur: true },
      { image: grandis3, type: "photo", fit: "contain", blur: true },
      { image: grandis4, type: "photo", fit: "contain", blur: true },
      { image: grandis5, type: "photo", fit: "contain", blur: true },
      { image: grandis6, type: "photo", fit: "contain", blur: true },
      { image: grandis7, type: "photo", fit: "contain", blur: true },
      { image: grandisPlan1, type: "photo", fit: "contain" },
    ],
    likes: 19, rating: 4.7,
    suitableFor: ["Для одного / пары", "Выходные / дача"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "до −30°C",
    features: ["Тёплые полы", "Вытяжная вентиляция", "Терраса"], style: "Барнхаус", landSize: "3–6 соток",
    hasRealPhotos: true, hasShowroom: true, hasInstallment: true,
  },

  // ── Glezman Group · Пермь ───────────────────────────────────────────────
  {
    id: 47, name: "La Rus 45", badge: "Жилой дом", price: "4 114 800 ₽",
    area: "45,72 м²", area_m2: 45.72, beds: 1, baths: 1, floors: 1, term: "60 д.",
    rooms: "1 спальня", purpose: "ИЖС / СНТ", city: "Пермь",
    maker: { ...GLEZMAN, siteUrl: "https://glezman-group.ru/la-rus_45" },
    description: "La Rus 45 — каркасный дом площадью 45,72 м² с особой атмосферой уюта, тепла и комфорта.",
    descriptionLong: "La Rus 45 — особая атмосфера уюта, тепла и комфорта. Модульный дом с продуманной планировкой: одна спальня, санузел, просторная зона кухни-гостиной с панорамным остеклением.",
    gallery: [
      { image: larus45_1, type: "photo", fit: "contain", blur: true },
      { image: larus45_2, type: "photo", fit: "contain", blur: true },
      { image: larus45_3, type: "photo", fit: "contain" },
    ],
    likes: 14, rating: 4.7,
    suitableFor: ["Для одного / пары", "Выходные / дача"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Панорамные окна"], style: "Современный", landSize: "3–6 соток",
    hasRealPhotos: true, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 48, name: "La Rus 75", badge: "Жилой дом", price: "6 750 000 ₽",
    area: "75 м²", area_m2: 75, beds: 2, baths: 1, floors: 1, term: "70 д.",
    rooms: "2 спальни", purpose: "ИЖС / СНТ", city: "Пермь",
    maker: { ...GLEZMAN, siteUrl: "https://glezman-group.ru/la-rus_75" },
    description: "La Rus 75 — каркасный дом 75 м² с двумя спальнями и террасой. Сочетание функциональности, простора и эстетики.",
    descriptionLong: "La Rus 75 — сочетание функциональности, простора и эстетики. Две спальни, санузел, открытая зона кухни-гостиной и терраса для отдыха на свежем воздухе.",
    gallery: [
      { image: larus75_1, type: "photo", fit: "contain", blur: true },
      { image: larus75_2, type: "photo", fit: "contain", blur: true },
      { image: larus75_3, type: "photo", fit: "contain" },
    ],
    likes: 18, rating: 4.7,
    suitableFor: ["Постоянное проживание", "Для семьи", "Выходные / дача"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса", "Панорамные окна"], style: "Современный", landSize: "3–6 соток",
    hasRealPhotos: true, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 49, name: "La Rus 100", badge: "Жилой дом", price: "9 360 000 ₽",
    area: "104 м²", area_m2: 104, beds: 2, baths: 2, floors: 1, term: "80 д.",
    rooms: "2 спальни", purpose: "ИЖС / СНТ", city: "Пермь",
    maker: { ...GLEZMAN, siteUrl: "https://glezman-group.ru/la-rus_100" },
    description: "La Rus 100 — каркасный дом 104 м² с гармоничным сочетанием общих зон и уютных приватных помещений.",
    descriptionLong: "La Rus 100 — гармоничное сочетание общих зон и уютных приватных помещений. Две спальни, два санузла, просторная гостиная-кухня и продуманное зонирование для семьи.",
    gallery: [
      { image: larus100_1, type: "photo", fit: "contain", blur: true },
      { image: larus100_2, type: "photo", fit: "contain", blur: true },
      { image: larus100_3, type: "photo", fit: "contain", blur: true },
      { image: larus100_4, type: "photo", fit: "contain", blur: true },
      { image: larus100_5, type: "photo", fit: "contain" },
    ],
    likes: 22, rating: 4.7,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Панорамные окна"], style: "Современный", landSize: "6–10 соток",
    hasRealPhotos: true, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 50, name: "La Rus 120", badge: "Жилой дом", price: "10 800 000 ₽",
    area: "120 м²", area_m2: 120, beds: 2, baths: 2, floors: 1, term: "85 д.",
    rooms: "2 спальни", purpose: "ИЖС / СНТ", city: "Пермь",
    maker: { ...GLEZMAN, siteUrl: "https://glezman-group.ru/la-rus_120" },
    description: "La Rus 120 — каркасный дом 120 м² с террасой. Гармоничное сочетание общих зон и уютных приватных помещений.",
    descriptionLong: "La Rus 120 — гармоничное сочетание общих зон и уютных приватных помещений. Две спальни, два санузла, открытая гостиная-кухня и просторная терраса для отдыха.",
    gallery: [
      { image: larus120_1, type: "photo", fit: "contain", blur: true },
      { image: larus120_2, type: "photo", fit: "contain", blur: true },
      { image: larus120_3, type: "photo", fit: "contain", blur: true },
      { image: larus120_4, type: "photo", fit: "contain", blur: true },
      { image: larus120_5, type: "photo", fit: "contain" },
    ],
    likes: 25, rating: 4.7,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса", "Панорамные окна"], style: "Современный", landSize: "6–10 соток",
    hasRealPhotos: true, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 51, name: "La Rus 127", badge: "Жилой дом", price: "11 430 000 ₽",
    area: "127 м²", area_m2: 127, beds: 3, baths: 2, floors: 1, term: "90 д.",
    rooms: "3 спальни", purpose: "ИЖС / СНТ", city: "Пермь",
    maker: { ...GLEZMAN, siteUrl: "https://glezman-group.ru/la-rus_127" },
    description: "La Rus 127 — просторный каркасный дом 127 м² с тремя спальнями и террасой.",
    descriptionLong: "La Rus 127 — просторный дом с продуманной и удобной планировкой, объединяющей просторные общественные зоны и уединённые комнаты. Три спальни, два санузла, большая гостиная-кухня и терраса.",
    gallery: [
      { image: larus127_1, type: "photo", fit: "contain", blur: true },
      { image: larus127_2, type: "photo", fit: "contain", blur: true },
      { image: larus127_3, type: "photo", fit: "contain" },
    ],
    likes: 28, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса", "Панорамные окна"], style: "Современный", landSize: "6–10 соток",
    hasRealPhotos: true, hasShowroom: false, hasInstallment: false,
  },

  // ── ДивоДом · Пермь ─────────────────────────────────────────────────────
  {
    id: 52, name: "ДИВО START", badge: "Жилой дом", price: "1 100 000 ₽",
    area: "30 м²", area_m2: 30, beds: 1, baths: 1, floors: 1, term: "30 д.",
    rooms: "1 спальня", purpose: "ИЖС / СНТ / Дача", city: "Пермь",
    maker: { ...DIVODOM, siteUrl: "https://www.divodom.net/start1" },
    description: "ДИВО START — модульный дом 30 м² с террасой 15 м². Базовое решение для дачи и круглогодичного отдыха.",
    descriptionLong: "ДИВО START — компактный модульный дом полной заводской готовности: одна спальня, санузел 3 м², кухня-гостиная и просторная терраса 15 м². Доставляется готовым, монтаж за 1 день.",
    gallery: [
      { image: "https://static.tildacdn.com/tild3038-6130-4639-b335-356432333939/gVQD83y4tZ4_1.jpg", type: "photo", fit: "contain", blur: true },
      { image: "https://static.tildacdn.com/tild3539-6662-4333-a536-316664306533/8_1.jpg", type: "photo", fit: "contain", blur: true },
      { image: "https://static.tildacdn.com/tild6635-6461-4264-a539-643331396536/7.jpg", type: "photo", fit: "contain", blur: true },
      { image: "https://static.tildacdn.com/tild3737-3336-4138-b131-383565343035/4bpngqLiS-E.jpg", type: "photo", fit: "contain", blur: true },
      { image: "https://static.tildacdn.com/tild3866-3464-4335-b462-323430396366/_1.png", type: "photo", fit: "contain", blur: true },
    ],
    likes: 12, rating: 4.6,
    suitableFor: ["Для одного / пары", "Выходные / дача"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса"], style: "Современный", landSize: "3–6 соток",
    hasRealPhotos: true, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 53, name: "ДИВО 34", badge: "Жилой дом", price: "1 632 000 ₽",
    area: "34 м²", area_m2: 34, beds: 1, baths: 1, floors: 1, term: "30 д.",
    rooms: "1 спальня", purpose: "ИЖС / СНТ / Дача", city: "Пермь",
    maker: { ...DIVODOM, siteUrl: "https://www.divodom.net/dom-ploshhadyu-38-kvm" },
    description: "ДИВО 34 — модульный дом 34 м² с террасой 10 м². Удобная планировка для пары или небольшой семьи.",
    descriptionLong: "ДИВО 34 — модульный дом полной заводской готовности: спальня, санузел, кухня-гостиная и терраса 10 м². Привозим уже собранным, подключаем к коммуникациям.",
    gallery: [
      { image: "https://static.tildacdn.com/tild3830-3566-4163-a536-303932323339/img60.jpg", type: "photo", fit: "contain", blur: true },
      { image: "https://static.tildacdn.com/tild6562-6438-4665-a131-383634363531/img94.jpg", type: "photo", fit: "contain", blur: true },
      { image: "https://static.tildacdn.com/tild3265-3565-4632-a330-653139346562/img128.jpg", type: "photo", fit: "contain", blur: true },
      { image: "https://static.tildacdn.com/tild3237-3638-4562-a533-393732316435/_648.jpg", type: "photo", fit: "contain", blur: true },
      { image: "https://static.tildacdn.com/tild3961-6632-4134-a135-643734346232/85.jpg", type: "photo", fit: "contain", blur: true },
    ],
    likes: 14, rating: 4.6,
    suitableFor: ["Для одного / пары", "Выходные / дача"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса"], style: "Современный", landSize: "3–6 соток",
    hasRealPhotos: true, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 54, name: "ДИВО 51", badge: "Жилой дом", price: "2 645 000 ₽",
    area: "51 м²", area_m2: 51, beds: 2, baths: 1, floors: 1, term: "40 д.",
    rooms: "2 спальни", purpose: "ИЖС / СНТ", city: "Пермь",
    maker: { ...DIVODOM, siteUrl: "https://www.divodom.net/dom-ploshhadyu-60-kvm" },
    description: "ДИВО 51 — модульный дом 51 м² с двумя спальнями и террасой 12 м². Для постоянного проживания семьи.",
    descriptionLong: "ДИВО 51 — модульный дом полной заводской готовности: две спальни, санузел, кухня-гостиная и терраса 12 м². Утепление до −30°C, готов к круглогодичному проживанию.",
    gallery: [
      { image: "https://static.tildacdn.com/tild3034-6233-4436-b231-306461376131/img60.jpg", type: "photo", fit: "contain", blur: true },
      { image: "https://static.tildacdn.com/tild3666-6430-4635-a332-323132616261/img94.jpg", type: "photo", fit: "contain", blur: true },
      { image: "https://static.tildacdn.com/tild3332-3666-4436-a639-323236646135/img128.jpg", type: "photo", fit: "contain", blur: true },
      { image: "https://static.tildacdn.com/tild6266-3835-4634-b735-643464666563/_68.jpg", type: "photo", fit: "contain", blur: true },
      { image: "https://static.tildacdn.com/tild3531-3162-4231-b431-306537353331/106.jpg", type: "photo", fit: "contain", blur: true },
    ],
    likes: 16, rating: 4.6,
    suitableFor: ["Для семьи", "Постоянное проживание"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса"], style: "Современный", landSize: "3–6 соток",
    hasRealPhotos: true, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 55, name: "ДИВО 64", badge: "Жилой дом", price: "3 195 000 ₽",
    area: "64 м²", area_m2: 64, beds: 2, baths: 1, floors: 1, term: "45 д.",
    rooms: "2 спальни", purpose: "ИЖС / СНТ", city: "Пермь",
    maker: { ...DIVODOM, siteUrl: "https://www.divodom.net/dom-ploshhadyu-72-kvm" },
    description: "ДИВО 64 — модульный дом 64 м² с двумя спальнями и просторной террасой 18 м².",
    descriptionLong: "ДИВО 64 — модульный дом для семьи: две спальни, санузел, кухня-гостиная и терраса 18 м². Полная заводская готовность, утепление до −30°C.",
    gallery: [
      { image: "https://static.tildacdn.com/tild3334-6564-4062-b363-653161376234/_728.jpg", type: "photo", fit: "contain", blur: true },
      { image: "https://static.tildacdn.com/tild3064-3734-4630-a661-393462666562/1_1-min.jpg", type: "photo", fit: "contain", blur: true },
      { image: "https://static.tildacdn.com/tild3132-6631-4563-b935-656162376236/2-min.jpg", type: "photo", fit: "contain", blur: true },
      { image: "https://static.tildacdn.com/tild3131-3035-4839-b435-396336366265/img94.jpg", type: "photo", fit: "contain", blur: true },
      { image: "https://static.tildacdn.com/tild3565-3535-4763-a639-623264633635/892.jpg", type: "photo", fit: "contain", blur: true },
    ],
    likes: 18, rating: 4.7,
    suitableFor: ["Для семьи", "Постоянное проживание"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса"], style: "Современный", landSize: "3–6 соток",
    hasRealPhotos: true, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 56, name: "ДИВО 88", badge: "Жилой дом", price: "4 179 000 ₽",
    area: "88 м²", area_m2: 88, beds: 2, baths: 1, floors: 1, term: "50 д.",
    rooms: "2 спальни", purpose: "ИЖС / СНТ", city: "Пермь",
    maker: { ...DIVODOM, siteUrl: "https://www.divodom.net/dom-ploshhadyu-77-kvm" },
    description: "ДИВО 88 — просторный модульный дом 88 м² с террасой 18 м². Подходит для постоянного проживания.",
    descriptionLong: "ДИВО 88 — крупный модульный дом полной заводской готовности: две спальни, санузел, просторная кухня-гостиная и терраса 18 м². Утепление до −30°C.",
    gallery: [
      { image: "https://static.tildacdn.com/tild6364-3266-4232-b534-336633613738/_7211.jpg", type: "photo", fit: "contain", blur: true },
      { image: "https://static.tildacdn.com/tild3261-3638-4564-a137-326666303230/1_2-min.jpg", type: "photo", fit: "contain", blur: true },
      { image: "https://static.tildacdn.com/tild6165-3365-4335-b534-373731333031/2_1-min.jpg", type: "photo", fit: "contain", blur: true },
      { image: "https://static.tildacdn.com/tild6130-3235-4164-a461-636133623232/4_1-min.jpg", type: "photo", fit: "contain", blur: true },
      { image: "https://static.tildacdn.com/tild6162-6233-4830-b039-383632356165/119.png", type: "photo", fit: "contain", blur: true },
    ],
    likes: 20, rating: 4.7,
    suitableFor: ["Для семьи", "Постоянное проживание"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса"], style: "Современный", landSize: "6–10 соток",
    hasRealPhotos: true, hasShowroom: false, hasInstallment: false,
  },
];

// ============================================================================
// ПРОИЗВОДНЫЕ СТРУКТУРЫ — рассчитываются автоматически
// ============================================================================

// Карточка для каталога — формат, который ожидает Catalog.tsx.
export const catalogItems = projects.map((p) => ({
  id: p.id,
  badge: p.badge,
  maker: `${p.maker.name} · ${p.city}`,
  name: p.name,
  price: p.price,
  area: p.area,
  beds: p.beds,
  baths: p.baths,
  term: p.term,
  rooms: p.rooms,
  purpose: p.purpose,
  image: p.gallery[0]?.image ?? "",
  fav: false,
  likes: p.likes,
  city: p.city,
  floors: p.floors,
  suitableFor: p.suitableFor,
  technology: p.technology,
  completion: p.completion,
  insulation: p.insulation,
  features: p.features,
  style: p.style,
  landSize: p.landSize,
  hasRealPhotos: p.hasRealPhotos,
  rating: p.rating,
  hasShowroom: p.hasShowroom,
  hasInstallment: p.hasInstallment,
}));

// Галереи / fits / blur — для Catalog (превью + полноэкранный просмотр).
export const projectGalleries: Record<number, string[]> = Object.fromEntries(
  projects.map((p) => [p.id, p.gallery.map((g) => g.image)])
);

export const projectFits: Record<number, ("cover" | "contain")[]> = Object.fromEntries(
  projects.map((p) => [p.id, p.gallery.map((g) => g.fit ?? "cover")])
);

export const projectBlurBackground: Record<number, boolean[]> = Object.fromEntries(
  projects.map((p) => [p.id, p.gallery.map((g) => g.blur ?? false)])
);

export const projectObjectPositions: Record<number, (string | undefined)[]> = Object.fromEntries(
  projects.map((p) => [p.id, p.gallery.map((g) => g.objectPosition)])
);

// Структура для ProjectDetail.tsx (override по id).
export const projectOverrides: Record<string, {
  name: string;
  maker: string;
  makerInitials: string;
  makerLogo?: string;
  makerId?: string;
  siteUrl?: string;
  price: string;
  area: string;
  beds: number;
  baths: number;
  floors: number;
  city: string;
  description: string;
  descriptionLong: string;
  gallery: { id: number; image: string; type: string; fit?: "cover" | "contain"; blur?: boolean }[];
}> = Object.fromEntries(
  projects.map((p) => [
    String(p.id),
    {
      name: p.name,
      maker: p.maker.name,
      makerInitials: p.maker.initials,
      makerLogo: p.maker.logo,
      makerId: p.maker.id,
      siteUrl: p.maker.siteUrl,
      price: p.price,
      area: p.area,
      beds: p.beds,
      baths: p.baths,
      floors: p.floors,
      city: p.city,
      description: p.description,
      descriptionLong: p.descriptionLong,
      gallery: p.gallery.map((g, i) => ({
        id: i + 1,
        image: g.image,
        type: g.type ?? "photo",
        fit: g.fit,
        blur: g.blur,
      })),
    },
  ])
);

// ============================================================================
// ПРОИЗВОДИТЕЛИ — count рассчитывается из projects автоматически
// ============================================================================

const wordForm = (n: number, forms: [string, string, string]) => {
  const m = Math.abs(n) % 100;
  const m1 = m % 10;
  if (m > 10 && m < 20) return forms[2];
  if (m1 > 1 && m1 < 5) return forms[1];
  if (m1 === 1) return forms[0];
  return forms[2];
};

type ManufacturerExtra = { name: string; location: string; manualCount?: string };

// Список «вспомогательных» производителей, у которых пока нет проектов в каталоге.
const extraManufacturers: ManufacturerExtra[] = [
  { name: "СибМодуль", location: "Новосибирск", manualCount: "18 проектов" },
  { name: "УралДом", location: "Екатеринбург", manualCount: "24 проекта" },
  { name: "МодульХаус", location: "Москва", manualCount: "31 проект" },
  { name: "ГлэмпингСтрой", location: "Сочи", manualCount: "12 проектов" },
  { name: "АрктикДом", location: "Мурманск", manualCount: "9 проектов" },
  { name: "ДомКомплект", location: "Казань", manualCount: "15 проектов" },
];

// Реальные производители — count считаем из массива projects.
const realManufacturers = Array.from(
  projects.reduce((acc, p) => {
    const key = p.maker.name;
    const entry = acc.get(key);
    if (entry) entry.count += 1;
    else acc.set(key, { name: p.maker.name, location: p.city, count: 1 });
    return acc;
  }, new Map<string, { name: string; location: string; count: number }>()).values()
).map((m) => ({
  name: m.name,
  location: m.location,
  count: `${m.count} ${wordForm(m.count, ["проект", "проекта", "проектов"])}`,
}));

export const manufacturers = [
  ...extraManufacturers.map((m) => ({ name: m.name, location: m.location, count: m.manualCount! })),
  ...realManufacturers,
];

// ============================================================================
// ГОРОДА
// ============================================================================

export const cities = ["Екатеринбург", "Пермь"];
