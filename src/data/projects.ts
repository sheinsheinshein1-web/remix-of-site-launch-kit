// ============================================================================
// ЕДИНЫЙ ИСТОЧНИК ПРАВДЫ для проектов / производителей / городов.
//
// ─── ЧЕК-ЛИСТ ДОБАВЛЕНИЯ НОВОГО ПРОИЗВОДИТЕЛЯ ────────────────────────────────
// 1. Создай константу Maker (PLATFORMA / BYGGE / …) с уникальным `id` и siteUrl.
// 2. Импортируй ассеты в src/assets/<makerId>/...
// 3. Для КАЖДОЙ фотографии в gallery укажи флаги ОСОЗНАННО:
//    • Реальные фото / рендеры экстерьера и интерьера →
//        { fit: "contain", blur: true }
//      (без blur будут белые рамки на карточках в каталоге/ленте).
//    • ПЛАНИРОВКИ (floor plans, 3D-планы, поэтажки) →
//        { fit: "contain" }   ← БЕЗ blur и БЕЗ edgeBleed.
//      Планировки ВСЕГДА на дефолтном сером bg-muted. Никогда не ставь blur
//      на план — это правило важнее «нет белых полей»: лучше серый кант,
//      чем размытая планировка. Обычно план — это последняя картинка
//      в gallery (имя содержит plan/floor/_<номер> или превью почти белое).
//    • edgeBleed: true — ТОЛЬКО для рендеров на белом/прозрачном фоне (Bygge).
//      Для реальных фото с небом/травой и для планов — НЕ ставь.
// 4. technology — используй ТОЧНО одно из значений каталожного фильтра:
//      "Модульный дом" | "Каркасный" | "Домокомплект" | "СИП-Префаб"
//    (см. src/pages/Catalog.tsx — иначе проект не попадёт в фильтры).
// 5. city — должен быть в массиве `cities` ниже, иначе проект не попадёт в ленту.
// 6. Проверь, что поиск импортирует данные из `projects.ts`, без локального хардкода.
// 7. Добавь текст «о компании» в `aboutByMakerId` в src/pages/Partner.tsx.
//
// Всё остальное (карточка /partner/:id, счётчик проектов, поиск,
// manufacturers, makersById, projectGalleries и т.п.) рассчитывается автоматически.
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

// Bygge
import patio1 from "@/assets/patio-2.webp";
import patio2 from "@/assets/patio-3.webp";
import patio3 from "@/assets/patio-4.webp";
import patio4 from "@/assets/patio-5.webp";
import patio5 from "@/assets/patio-6.webp";
import patio6 from "@/assets/patio-9.webp";
import patio7 from "@/assets/patio-10.webp";
import patio8 from "@/assets/patio-11.webp";
import patioPlan1 from "@/assets/patio-plan-1.webp";
import patioPlan2 from "@/assets/patio-plan-2.webp";
import tundra1 from "@/assets/tundra-1.webp";
import tundra2 from "@/assets/tundra-2.webp";
import tundra3 from "@/assets/tundra-3.webp";
import tundra4 from "@/assets/tundra-4.webp";
import tundra5 from "@/assets/tundra-5.webp";
import tundra6 from "@/assets/tundra-6.webp";
import tundra7 from "@/assets/tundra-7.webp";
import tundraPlan1 from "@/assets/tundra-plan-1.webp";
import tundraPlan2 from "@/assets/tundra-plan-2.webp";
import tundraPlan3 from "@/assets/tundra-plan-3.webp";
import sherwood1 from "@/assets/sherwood-1.webp";
import sherwood2 from "@/assets/sherwood-2.webp";
import sherwood3 from "@/assets/sherwood-3.webp";
import sherwood4 from "@/assets/sherwood-4.webp";
import sherwood5 from "@/assets/sherwood-5.webp";
import sherwood6 from "@/assets/sherwood-6.webp";
import sherwood7 from "@/assets/sherwood-7.webp";
import sherwood8 from "@/assets/sherwood-8.webp";
import sherwood9 from "@/assets/sherwood-9.webp";
import sherwoodPlan1 from "@/assets/sherwood-plan-1.webp";
import senat1 from "@/assets/senat-1.webp";
import senat2 from "@/assets/senat-2.webp";
import senat3 from "@/assets/senat-3.webp";
import senat4 from "@/assets/senat-4.webp";
import senat5 from "@/assets/senat-5.webp";
import senat6 from "@/assets/senat-6.webp";
import senat7 from "@/assets/senat-7.webp";
import senat8 from "@/assets/senat-8.webp";
import senat9 from "@/assets/senat-9.webp";
import senatPlan1 from "@/assets/senat-plan-1.webp";
import familySuite1 from "@/assets/family-suite-1.webp";
import familySuite2 from "@/assets/family-suite-2.webp";
import familySuite3 from "@/assets/family-suite-3.webp";
import familySuitePlan1 from "@/assets/family-suite-plan-1.webp";
import gallant1 from "@/assets/gallant-1.webp";
import gallant2 from "@/assets/gallant-2.webp";
import gallant3 from "@/assets/gallant-3.webp";
import gallant4 from "@/assets/gallant-4.webp";
import gallant5 from "@/assets/gallant-5.webp";
import gallant6 from "@/assets/gallant-6.webp";
import gallant7 from "@/assets/gallant-7.webp";
import gallantPlan1 from "@/assets/gallant-plan-1.webp";
import grandis1 from "@/assets/grandis-1.webp";
import grandis2 from "@/assets/grandis-2.webp";
import grandis3 from "@/assets/grandis-3.webp";
import grandis4 from "@/assets/grandis-4.webp";
import grandis5 from "@/assets/grandis-5.webp";
import grandis6 from "@/assets/grandis-6.webp";
import grandis7 from "@/assets/grandis-7.webp";
import grandisPlan1 from "@/assets/grandis-plan-1.webp";

// Glezman Group
import larus45_1 from "@/assets/glezman/larus-45.webp";
import larus45_2 from "@/assets/glezman/larus-45-2.webp";
import larus45_3 from "@/assets/glezman/larus-45-3.webp";
import larus75_1 from "@/assets/glezman/larus-75.webp";
import larus75_2 from "@/assets/glezman/larus-75-2.webp";
import larus75_3 from "@/assets/glezman/larus-75-3.webp";
import larus100_1 from "@/assets/glezman/larus-100.webp";
import larus100_2 from "@/assets/glezman/larus-100-2.webp";
import larus100_3 from "@/assets/glezman/larus-100-3.webp";
import larus100_4 from "@/assets/glezman/larus-100-4.webp";
import larus100_5 from "@/assets/glezman/larus-100-5.webp";
import larus120_1 from "@/assets/glezman/larus-120.webp";
import larus120_2 from "@/assets/glezman/larus-120-2.webp";
import larus120_3 from "@/assets/glezman/larus-120-3.webp";
import larus120_4 from "@/assets/glezman/larus-120-4.webp";
import larus120_5 from "@/assets/glezman/larus-120-5.webp";
import larus127_1 from "@/assets/glezman/larus-127.webp";
import larus127_2 from "@/assets/glezman/larus-127-2.webp";
import larus127_3 from "@/assets/glezman/larus-127-3.webp";

// ГрадоДом
import filip55_1 from "@/assets/gradodom/filip-55-1.webp";
import filip55_2 from "@/assets/gradodom/filip-55-2.webp";
import filip55_3 from "@/assets/gradodom/filip-55-3.webp";
import filip55_4 from "@/assets/gradodom/filip-55-4.webp";
import filip55_5 from "@/assets/gradodom/filip-55-5.webp";
import filip55_6 from "@/assets/gradodom/filip-55-6.webp";
import filip55_plan from "@/assets/gradodom/filip-55-plan.webp";
import arktur56_1 from "@/assets/gradodom/arktur-56-1.webp";
import arktur56_2 from "@/assets/gradodom/arktur-56-2.webp";
import arktur56_plan from "@/assets/gradodom/arktur-56-plan.webp";
import rinho60_1 from "@/assets/gradodom/rinho-60-1.webp";
import rinho60_2 from "@/assets/gradodom/rinho-60-2.webp";
import rinho60_plan from "@/assets/gradodom/rinho-60-plan.webp";
import almaks72_1 from "@/assets/gradodom/almaks-72-1.webp";
import almaks72_plan from "@/assets/gradodom/almaks-72-plan.webp";
import alester73_1 from "@/assets/gradodom/alester-73-1.webp";
import alester73_2 from "@/assets/gradodom/alester-73-2.webp";
import alester73_3 from "@/assets/gradodom/alester-73-3.webp";
import alester73_plan1 from "@/assets/gradodom/alester-73-plan1.webp";
import alester73_plan2 from "@/assets/gradodom/alester-73-plan2.webp";

// Загородом
import zg_soul1 from "@/assets/zagorodom/soul-1.webp";
import zg_soul2 from "@/assets/zagorodom/soul-2.webp";
import zg_soul3 from "@/assets/zagorodom/soul-3.webp";
import zg_soul_plan from "@/assets/zagorodom/soul-plan.webp";
import zg_strong1 from "@/assets/zagorodom/strong-1.webp";
import zg_strong2 from "@/assets/zagorodom/strong-2.webp";
import zg_strong3 from "@/assets/zagorodom/strong-3.webp";
import zg_strong_plan from "@/assets/zagorodom/strong-plan.webp";
import zg_lumo1 from "@/assets/zagorodom/lumo-1.webp";
import zg_lumo2 from "@/assets/zagorodom/lumo-2.webp";
import zg_lumo3 from "@/assets/zagorodom/lumo-3.webp";
import zg_lumo_plan from "@/assets/zagorodom/lumo-plan.webp";
import zg_happy1 from "@/assets/zagorodom/happy-1.webp";
import zg_happy2 from "@/assets/zagorodom/happy-2.webp";
import zg_happy3 from "@/assets/zagorodom/happy-3.webp";
import zg_happy_plan from "@/assets/zagorodom/happy-plan.webp";
import zg_favorite1 from "@/assets/zagorodom/favorite-1.webp";
import zg_favorite2 from "@/assets/zagorodom/favorite-2.webp";
import zg_favorite3 from "@/assets/zagorodom/favorite-3.webp";
import zg_favorite_plan from "@/assets/zagorodom/favorite-plan.webp";

// Прайм Модуль
import pm_barn200_1 from "@/assets/prime-modul/barnhaus-200-2-etazha/1.webp";
import pm_barn200_2 from "@/assets/prime-modul/barnhaus-200-2-etazha/2.webp";
import pm_barn200_3 from "@/assets/prime-modul/barnhaus-200-2-etazha/3.webp";
import pm_barn200_4 from "@/assets/prime-modul/barnhaus-200-2-etazha/4.webp";
import pm_barn200_5 from "@/assets/prime-modul/barnhaus-200-2-etazha/5.webp";
import pm_barn200_6 from "@/assets/prime-modul/barnhaus-200-2-etazha/6.webp";
import pm_barn200_plan from "@/assets/prime-modul/barnhaus-200-2-etazha/plan-1.webp";
import pm_skandi72_1 from "@/assets/prime-modul/skandinaviya-72/1.webp";
import pm_skandi72_2 from "@/assets/prime-modul/skandinaviya-72/2.webp";
import pm_skandi72_3 from "@/assets/prime-modul/skandinaviya-72/3.webp";
import pm_skandi72_4 from "@/assets/prime-modul/skandinaviya-72/4.webp";
import pm_skandi72_plan from "@/assets/prime-modul/skandinaviya-72/plan-1.webp";
import pm_barn42_1 from "@/assets/prime-modul/barn-42/1.webp";
import pm_barn42_2 from "@/assets/prime-modul/barn-42/2.webp";
import pm_barn42_3 from "@/assets/prime-modul/barn-42/3.webp";
import pm_barn42_plan from "@/assets/prime-modul/barn-42/plan-1.webp";
import pm_modern72_1 from "@/assets/prime-modul/modern-72/1.webp";
import pm_modern72_2 from "@/assets/prime-modul/modern-72/2.webp";
import pm_modern72_3 from "@/assets/prime-modul/modern-72/3.webp";
import pm_modern72_4 from "@/assets/prime-modul/modern-72/4.webp";
import pm_modern72_plan from "@/assets/prime-modul/modern-72/plan-1.webp";
import pm_kantri110_1 from "@/assets/prime-modul/kantri-110/1.webp";
import pm_kantri110_2 from "@/assets/prime-modul/kantri-110/2.webp";
import pm_kantri110_3 from "@/assets/prime-modul/kantri-110/3.webp";
import pm_kantri110_4 from "@/assets/prime-modul/kantri-110/4.webp";
import pm_kantri110_plan from "@/assets/prime-modul/kantri-110/plan-1.webp";
import dd_start30_1 from "@/assets/divodom/start-30/1.webp";
import dd_start30_2 from "@/assets/divodom/start-30/2.webp";
import dd_start30_3 from "@/assets/divodom/start-30/3.webp";
import dd_start30_4 from "@/assets/divodom/start-30/4.webp";
import dd_start30_5 from "@/assets/divodom/start-30/5.webp";
import dd_divo34_1 from "@/assets/divodom/divo-34/1.webp";
import dd_divo34_2 from "@/assets/divodom/divo-34/2.webp";
import dd_divo34_3 from "@/assets/divodom/divo-34/3.webp";
import dd_divo34_4 from "@/assets/divodom/divo-34/4.webp";
import dd_divo34_5 from "@/assets/divodom/divo-34/5.webp";
import dd_divo51_1 from "@/assets/divodom/divo-51/1.webp";
import dd_divo51_2 from "@/assets/divodom/divo-51/2.webp";
import dd_divo51_3 from "@/assets/divodom/divo-51/3.webp";
import dd_divo51_4 from "@/assets/divodom/divo-51/4.webp";
import dd_divo51_5 from "@/assets/divodom/divo-51/5.webp";
import dd_divo64_1 from "@/assets/divodom/divo-64/1.webp";
import dd_divo64_2 from "@/assets/divodom/divo-64/2.webp";
import dd_divo64_3 from "@/assets/divodom/divo-64/3.webp";
import dd_divo64_4 from "@/assets/divodom/divo-64/4.webp";
import dd_divo64_5 from "@/assets/divodom/divo-64/5.webp";
import dd_divo88_1 from "@/assets/divodom/divo-88/1.webp";
import dd_divo88_2 from "@/assets/divodom/divo-88/2.webp";
import dd_divo88_3 from "@/assets/divodom/divo-88/3.webp";
import dd_divo88_4 from "@/assets/divodom/divo-88/4.webp";
import dd_divo88_5 from "@/assets/divodom/divo-88/5.webp";
import apa_aa1_1 from "@/assets/apa/aa-1/1.webp";
import apa_aa1_2 from "@/assets/apa/aa-1/2.webp";
import apa_aa1_3 from "@/assets/apa/aa-1/3.webp";
import apa_aa1_4 from "@/assets/apa/aa-1/4.webp";
import apa_aa1_5 from "@/assets/apa/aa-1/5.webp";
import apa_aa2_1 from "@/assets/apa/aa-2/1.webp";
import apa_aa2_2 from "@/assets/apa/aa-2/2.webp";
import apa_aa2_3 from "@/assets/apa/aa-2/3.webp";
import apa_aa2_4 from "@/assets/apa/aa-2/4.webp";
import apa_aa2_5 from "@/assets/apa/aa-2/5.webp";
import apa_aa3_1 from "@/assets/apa/aa-3/1.webp";
import apa_aa3_2 from "@/assets/apa/aa-3/2.webp";
import apa_aa3_3 from "@/assets/apa/aa-3/3.webp";
import apa_aa3_4 from "@/assets/apa/aa-3/4.webp";
import apa_aa3_5 from "@/assets/apa/aa-3/5.webp";
import apa_aa3_6 from "@/assets/apa/aa-3/6.webp";
import apa_aa4_1 from "@/assets/apa/aa-4/1.webp";
import apa_aa4_2 from "@/assets/apa/aa-4/2.webp";
import apa_aa4_3 from "@/assets/apa/aa-4/3.webp";
import apa_aa4_4 from "@/assets/apa/aa-4/4.webp";
import apa_aa4_5 from "@/assets/apa/aa-4/5.webp";
import apa_aa4_6 from "@/assets/apa/aa-4/6.webp";
import apa_aa5_1 from "@/assets/apa/aa-5/1.webp";
import apa_aa5_2 from "@/assets/apa/aa-5/2.webp";
import apa_aa5_3 from "@/assets/apa/aa-5/3.webp";
import apa_aa5_4 from "@/assets/apa/aa-5/4.webp";
import apa_aa5_5 from "@/assets/apa/aa-5/5.webp";

// ============================================================================
// ТИПЫ
// ============================================================================

export type GalleryItem = {
  image: string;
  type?: "photo" | "video";
  fit?: "cover" | "contain";
  blur?: boolean; // blur-фон в каталоге для фото с прозрачным/неровным фоном
  edgeBleed?: boolean; // бесшовное продолжение краёв вместо blur
  objectPosition?: string;
};

export type Maker = {
  name: string;
  initials: string;
  id?: string;
  logo?: string;
  siteUrl?: string;
  productionAddress?: string;
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
  productionAddress: "г. Березовский, Южная промзона, д. 21",
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
const GRADODOM: Maker = {
  name: "ГрадоДом",
  initials: "ГД",
  id: "gradodom",
  siteUrl: "https://novostroy159.ru/",
};
const ZAGORODOM: Maker = {
  name: "СК «Загородом»",
  initials: "ЗГ",
  id: "zagorodom",
  siteUrl: "https://zagorodom59.ru/",
};
const APA: Maker = {
  name: "Апа Групп",
  initials: "АА",
  id: "apa",
  siteUrl: "https://apagrupp.ru/",
};
const PRIME_MODUL: Maker = {
  name: "Прайм Модуль",
  initials: "ПМ",
  id: "prime-modul",
  siteUrl: "https://prime-module.ru/",
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
  // ── Bygge · Екатеринбург ────────────────────────────────────────────────
  {
    id: 40, name: "ПАТИО", badge: "Жилой дом", price: "2 598 000 ₽",
    area: "45 м²", beds: 3, baths: 1, floors: 1, term: "60 д.",
    rooms: "3 комнаты", purpose: "ИЖС / СНТ", city: "Екатеринбург",
    maker: { ...BYGGE, siteUrl: "https://bygge.ru/katalog/patio/" },
    description: "Модульный дом 7,3 × 6,1 м под ключ. Высота потолка 2,5 м, тёплые полы, оборудованный санузел, вытяжная вентиляция с выходом на крышу.",
    descriptionLong: "ПАТИО — модульный дом площадью 45 м² с продуманной планировкой и полной заводской готовностью. Высота потолка 2,5 м. Утепление пол / стена / потолок — 200 / 150 / 150 мм. Полностью оборудованный санузел, вытяжная вентиляция с выходом на крышу, кабельные тёплые полы. В подарок — защитная сетка от грызунов.",
    gallery: [
      { image: patio5, type: "photo", fit: "contain", blur: true, edgeBleed: true },
      { image: patio2, type: "photo", fit: "contain", blur: true, edgeBleed: true },
      { image: patio3, type: "photo", fit: "contain", blur: true, edgeBleed: true },
      { image: patio4, type: "photo", fit: "contain", blur: true, edgeBleed: true },
      { image: patio1, type: "photo", fit: "contain", blur: true, edgeBleed: true },
      { image: patio6, type: "photo", fit: "contain", blur: true, edgeBleed: true },
      { image: patio7, type: "photo", fit: "contain", blur: true, edgeBleed: true },
      { image: patio8, type: "photo", fit: "contain", blur: true, edgeBleed: true },
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
      { image: tundra1, type: "photo", fit: "contain", blur: true, edgeBleed: true },
      { image: tundra2, type: "photo", fit: "contain", blur: true, edgeBleed: true },
      { image: tundra3, type: "photo", fit: "contain", blur: true, edgeBleed: true },
      { image: tundra4, type: "photo", fit: "contain", blur: true, edgeBleed: true },
      { image: tundra5, type: "photo", fit: "contain", blur: true, edgeBleed: true },
      { image: tundra6, type: "photo", fit: "contain", blur: true, edgeBleed: true },
      { image: tundra7, type: "photo", fit: "contain", blur: true, edgeBleed: true },
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
      { image: sherwood1, type: "photo", fit: "contain", blur: true, edgeBleed: true },
      { image: sherwood2, type: "photo", fit: "contain", blur: true, edgeBleed: true },
      { image: sherwood3, type: "photo", fit: "contain", blur: true, edgeBleed: true },
      { image: sherwood4, type: "photo", fit: "contain", blur: true, edgeBleed: true },
      { image: sherwood5, type: "photo", fit: "contain", blur: true, edgeBleed: true },
      { image: sherwood6, type: "photo", fit: "contain", blur: true, edgeBleed: true },
      { image: sherwood7, type: "photo", fit: "contain", blur: true, edgeBleed: true },
      { image: sherwood8, type: "photo", fit: "contain", blur: true, edgeBleed: true },
      { image: sherwood9, type: "photo", fit: "contain", blur: true, edgeBleed: true },
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

  // ── Glezman Group · Пермский край ───────────────────────────────────────────────
  {
    id: 47, name: "La Rus 45", badge: "Жилой дом", price: "4 114 800 ₽",
    area: "45,72 м²", area_m2: 45.72, beds: 1, baths: 1, floors: 1, term: "60 д.",
    rooms: "1 спальня", purpose: "ИЖС / СНТ", city: "Пермский край",
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
    rooms: "2 спальни", purpose: "ИЖС / СНТ", city: "Пермский край",
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
    rooms: "2 спальни", purpose: "ИЖС / СНТ", city: "Пермский край",
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
    rooms: "2 спальни", purpose: "ИЖС / СНТ", city: "Пермский край",
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
    rooms: "3 спальни", purpose: "ИЖС / СНТ", city: "Пермский край",
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

  // ── ДивоДом · Пермский край ─────────────────────────────────────────────────────
  {
    id: 52, name: "ДИВО START", badge: "Жилой дом", price: "1 100 000 ₽",
    area: "30 м²", area_m2: 30, beds: 1, baths: 1, floors: 1, term: "30 д.",
    rooms: "1 спальня", purpose: "ИЖС / СНТ / Дача", city: "Пермский край",
    maker: { ...DIVODOM, siteUrl: "https://www.divodom.net/start1" },
    description: "ДИВО START — модульный дом 30 м² с террасой 15 м². Базовое решение для дачи и круглогодичного отдыха.",
    descriptionLong: "ДИВО START — компактный модульный дом полной заводской готовности: одна спальня, санузел 3 м², кухня-гостиная и просторная терраса 15 м². Доставляется готовым, монтаж за 1 день.",
    gallery: [
      { image: dd_start30_1, type: "photo", fit: "contain", blur: true },
      { image: dd_start30_2, type: "photo", fit: "contain", blur: true },
      { image: dd_start30_3, type: "photo", fit: "contain", blur: true },
      { image: dd_start30_4, type: "photo", fit: "contain", blur: true },
      { image: dd_start30_5, type: "photo", fit: "contain" },
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
    rooms: "1 спальня", purpose: "ИЖС / СНТ / Дача", city: "Пермский край",
    maker: { ...DIVODOM, siteUrl: "https://www.divodom.net/dom-ploshhadyu-38-kvm" },
    description: "ДИВО 34 — модульный дом 34 м² с террасой 10 м². Удобная планировка для пары или небольшой семьи.",
    descriptionLong: "ДИВО 34 — модульный дом полной заводской готовности: спальня, санузел, кухня-гостиная и терраса 10 м². Привозим уже собранным, подключаем к коммуникациям.",
    gallery: [
      { image: dd_divo34_1, type: "photo", fit: "contain", blur: true },
      { image: dd_divo34_2, type: "photo", fit: "contain", blur: true },
      { image: dd_divo34_3, type: "photo", fit: "contain", blur: true },
      { image: dd_divo34_4, type: "photo", fit: "contain", blur: true },
      { image: dd_divo34_5, type: "photo", fit: "contain" },
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
    rooms: "2 спальни", purpose: "ИЖС / СНТ", city: "Пермский край",
    maker: { ...DIVODOM, siteUrl: "https://www.divodom.net/dom-ploshhadyu-60-kvm" },
    description: "ДИВО 51 — модульный дом 51 м² с двумя спальнями и террасой 12 м². Для постоянного проживания семьи.",
    descriptionLong: "ДИВО 51 — модульный дом полной заводской готовности: две спальни, санузел, кухня-гостиная и терраса 12 м². Утепление до −30°C, готов к круглогодичному проживанию.",
    gallery: [
      { image: dd_divo51_1, type: "photo", fit: "contain", blur: true },
      { image: dd_divo51_2, type: "photo", fit: "contain", blur: true },
      { image: dd_divo51_3, type: "photo", fit: "contain", blur: true },
      { image: dd_divo51_4, type: "photo", fit: "contain", blur: true },
      { image: dd_divo51_5, type: "photo", fit: "contain" },
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
    rooms: "2 спальни", purpose: "ИЖС / СНТ", city: "Пермский край",
    maker: { ...DIVODOM, siteUrl: "https://www.divodom.net/dom-ploshhadyu-72-kvm" },
    description: "ДИВО 64 — модульный дом 64 м² с двумя спальнями и просторной террасой 18 м².",
    descriptionLong: "ДИВО 64 — модульный дом для семьи: две спальни, санузел, кухня-гостиная и терраса 18 м². Полная заводская готовность, утепление до −30°C.",
    gallery: [
      { image: dd_divo64_1, type: "photo", fit: "contain", blur: true },
      { image: dd_divo64_2, type: "photo", fit: "contain", blur: true },
      { image: dd_divo64_3, type: "photo", fit: "contain", blur: true },
      { image: dd_divo64_4, type: "photo", fit: "contain", blur: true },
      { image: dd_divo64_5, type: "photo", fit: "contain" },
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
    rooms: "2 спальни", purpose: "ИЖС / СНТ", city: "Пермский край",
    maker: { ...DIVODOM, siteUrl: "https://www.divodom.net/dom-ploshhadyu-77-kvm" },
    description: "ДИВО 88 — просторный модульный дом 88 м² с террасой 18 м². Подходит для постоянного проживания.",
    descriptionLong: "ДИВО 88 — крупный модульный дом полной заводской готовности: две спальни, санузел, просторная кухня-гостиная и терраса 18 м². Утепление до −30°C.",
    gallery: [
      { image: dd_divo88_1, type: "photo", fit: "contain", blur: true },
      { image: dd_divo88_2, type: "photo", fit: "contain", blur: true },
      { image: dd_divo88_3, type: "photo", fit: "contain", blur: true },
      { image: dd_divo88_4, type: "photo", fit: "contain", blur: true },
      { image: dd_divo88_5, type: "photo", fit: "contain" },
    ],
    likes: 20, rating: 4.7,
    suitableFor: ["Для семьи", "Постоянное проживание"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса"], style: "Современный", landSize: "6–10 соток",
    hasRealPhotos: true, hasShowroom: false, hasInstallment: false,
  },
  // ── ГрадоДом · Пермский край ────────────────────────────────────────────
  {
    id: 57, name: "Филип 55", badge: "Жилой дом", price: "4 669 500 ₽",
    area: "55 м²", area_m2: 55, beds: 1, baths: 1, floors: 1, term: "90 д.",
    rooms: "2 комнаты", purpose: "ИЖС / СНТ", city: "Пермский край", maker: GRADODOM,
    description: "Каркасный дом 13 × 5 м площадью 55 м². Две комнаты, санузел, кухня-гостиная.",
    descriptionLong: "Филип 55 — каркасный загородный дом площадью 55 м², размеры 13 × 5 м. Две комнаты, санузел, кухня-гостиная. Срок строительства — 3 месяца.",
    gallery: [
      { image: filip55_1, type: "photo", fit: "contain", blur: true },
      { image: filip55_2, type: "photo", fit: "contain", blur: true },
      { image: filip55_3, type: "photo", fit: "contain", blur: true },
      { image: filip55_4, type: "photo", fit: "contain", blur: true },
      { image: filip55_5, type: "photo", fit: "contain", blur: true },
      { image: filip55_6, type: "photo", fit: "contain", blur: true },
      { image: filip55_plan, type: "photo", fit: "contain" },
    ],
    likes: 18, rating: 4.6,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: [], style: "Современный", landSize: "6–10 соток",
    hasRealPhotos: true, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 58, name: "Арктур 56", badge: "Жилой дом", price: "4 754 400 ₽",
    area: "56 м²", area_m2: 56, beds: 2, baths: 1, floors: 1, term: "90 д.",
    rooms: "3 комнаты", purpose: "ИЖС / СНТ", city: "Пермский край", maker: GRADODOM,
    description: "Каркасный дом 10 × 5 м площадью 56 м². Три комнаты, санузел, кухня-гостиная.",
    descriptionLong: "Арктур 56 — каркасный загородный дом площадью 56 м², размеры 10 × 5 м. Три комнаты, санузел, кухня-гостиная. Срок строительства — 3 месяца.",
    gallery: [
      { image: arktur56_1, type: "photo", fit: "contain", blur: true },
      { image: arktur56_2, type: "photo", fit: "contain", blur: true },
      { image: arktur56_plan, type: "photo", fit: "contain" },
    ],
    likes: 14, rating: 4.6,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: [], style: "Современный", landSize: "6–10 соток",
    hasRealPhotos: true, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 59, name: "Ринхо 60", badge: "Жилой дом", price: "5 094 000 ₽",
    area: "60 м²", area_m2: 60, beds: 2, baths: 1, floors: 1, term: "90 д.",
    rooms: "3 комнаты", purpose: "ИЖС / СНТ", city: "Пермский край", maker: GRADODOM,
    description: "Каркасный дом 7 × 10 м площадью 60 м². Три комнаты, санузел, кухня-гостиная.",
    descriptionLong: "Ринхо 60 — каркасный загородный дом площадью 60 м², размеры 7 × 10 м. Три комнаты, санузел, кухня-гостиная. Срок строительства — 3 месяца.",
    gallery: [
      { image: rinho60_1, type: "photo", fit: "contain", blur: true },
      { image: rinho60_2, type: "photo", fit: "contain", blur: true },
      { image: rinho60_plan, type: "photo", fit: "contain" },
    ],
    likes: 16, rating: 4.6,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: [], style: "Современный", landSize: "6–10 соток",
    hasRealPhotos: true, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 60, name: "Алмакс 72", badge: "Жилой дом", price: "5 400 000 ₽",
    area: "72 м²", area_m2: 72, beds: 2, baths: 1, floors: 1, term: "90 д.",
    rooms: "3 комнаты", purpose: "ИЖС / СНТ", city: "Пермский край", maker: GRADODOM,
    description: "Каркасный дом 10 × 8 м площадью 72 м². Три комнаты, санузел, кухня-гостиная.",
    descriptionLong: "Алмакс 72 — каркасный загородный дом площадью 72 м², размеры 10 × 8 м. Три комнаты, санузел, кухня-гостиная. Срок строительства — 3 месяца.",
    gallery: [
      { image: almaks72_1, type: "photo", fit: "contain", blur: true },
      { image: almaks72_plan, type: "photo", fit: "contain" },
    ],
    likes: 19, rating: 4.7,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: [], style: "Современный", landSize: "6–10 соток",
    hasRealPhotos: true, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 61, name: "Алестер 73", badge: "Жилой дом", price: "5 475 000 ₽",
    area: "73 м²", area_m2: 73, beds: 3, baths: 1, floors: 1, term: "90 д.",
    rooms: "4 комнаты", purpose: "ИЖС / СНТ", city: "Пермский край", maker: GRADODOM,
    description: "Каркасный дом 10 × 4 м площадью 73 м². Четыре комнаты, санузел, кухня-гостиная.",
    descriptionLong: "Алестер 73 — каркасный загородный дом площадью 73 м², размеры 10 × 4 м. Четыре комнаты, санузел, кухня-гостиная. Срок строительства — 3 месяца.",
    gallery: [
      { image: alester73_1, type: "photo", fit: "contain", blur: true },
      { image: alester73_2, type: "photo", fit: "contain", blur: true },
      { image: alester73_3, type: "photo", fit: "contain", blur: true },
      { image: alester73_plan1, type: "photo", fit: "contain" },
      { image: alester73_plan2, type: "photo", fit: "contain" },
    ],
    likes: 22, rating: 4.7,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: [], style: "Современный", landSize: "6–10 соток",
    hasRealPhotos: true, hasShowroom: false, hasInstallment: false,
  },
  // ── СК «Загородом» · Пермский край ──────────────────────────────────────
  {
    id: 62, name: "Дом SOUL Душевный", badge: "Жилой дом", price: "от 3 500 000 ₽",
    area: "63 м²", area_m2: 63, beds: 1, baths: 1, floors: 1, term: "90 д.",
    rooms: "Дом 42 м² + терраса 21 м²", purpose: "ИЖС / СНТ", city: "Пермский край", maker: ZAGORODOM,
    description: "Каркасный дом 7 × 9 м: дом 42 м² и терраса 21 м². Современная архитектура с панорамным остеклением.",
    descriptionLong: "Дом SOUL «Душевный» — каркасный дом размером 7 × 9 м общей площадью 63 м² (жилая часть 42 м² + терраса 21 м²). Современная архитектура, панорамное остекление, утеплённая каркасная конструкция.",
    gallery: [
      { image: zg_soul1, type: "photo", fit: "contain", blur: true },
      { image: zg_soul2, type: "photo", fit: "contain", blur: true },
      { image: zg_soul3, type: "photo", fit: "contain", blur: true },
      { image: zg_soul_plan, type: "photo", fit: "contain" },
    ],
    likes: 17, rating: 4.7,
    suitableFor: ["Постоянное проживание", "Для семьи", "Выходные / дача"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса", "Панорамные окна"], style: "Современный", landSize: "6–10 соток",
    hasRealPhotos: true, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 63, name: "Барнхаус STRONG Крепкий", badge: "Барнхаус", price: "от 3 700 000 ₽",
    area: "60 м²", area_m2: 60, beds: 2, baths: 1, floors: 1, term: "90 д.",
    rooms: "Дом 45 м² + терраса 15 м²", purpose: "ИЖС / СНТ", city: "Пермский край", maker: ZAGORODOM,
    description: "Каркасный барнхаус 7,5 × 8 м: дом 45 м² и терраса 15 м². Лаконичный силуэт двускатной крыши.",
    descriptionLong: "Барнхаус STRONG «Крепкий» — каркасный дом размером 7,5 × 8 м, общая площадь 60 м² (жилая 45 м² + терраса 15 м²). Лаконичный силуэт двускатной крыши, панорамное остекление.",
    gallery: [
      { image: zg_strong1, type: "photo", fit: "contain", blur: true },
      { image: zg_strong2, type: "photo", fit: "contain", blur: true },
      { image: zg_strong3, type: "photo", fit: "contain", blur: true },
      { image: zg_strong_plan, type: "photo", fit: "contain" },
    ],
    likes: 19, rating: 4.7,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса", "Барнхаус", "Панорамные окна"], style: "Барнхаус", landSize: "6–10 соток",
    hasRealPhotos: true, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 64, name: "Дом LUMO Очаровательный", badge: "Жилой дом", price: "от 5 850 000 ₽",
    area: "97 м²", area_m2: 97, beds: 3, baths: 1, floors: 1, term: "120 д.",
    rooms: "Дом 78 м² + терраса 19 м²", purpose: "ИЖС / СНТ", city: "Пермский край", maker: ZAGORODOM,
    description: "Каркасный дом 10,5 × 11 м: дом 78 м² и терраса 19 м². Просторная планировка для семьи.",
    descriptionLong: "Дом LUMO «Очаровательный» — каркасный дом размером 10,5 × 11 м, общая площадь 97 м² (жилая 78 м² + терраса 19 м²). Просторная планировка для семьи, утеплённая каркасная конструкция.",
    gallery: [
      { image: zg_lumo1, type: "photo", fit: "contain", blur: true },
      { image: zg_lumo2, type: "photo", fit: "contain", blur: true },
      { image: zg_lumo3, type: "photo", fit: "contain", blur: true },
      { image: zg_lumo_plan, type: "photo", fit: "contain" },
    ],
    likes: 24, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса", "Панорамные окна"], style: "Современный", landSize: "6–10 соток",
    hasRealPhotos: true, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 65, name: "Дом HAPPY Счастливый", badge: "Жилой дом", price: "от 5 900 000 ₽",
    area: "100 м²", area_m2: 100, beds: 3, baths: 1, floors: 1, term: "120 д.",
    rooms: "Дом 77 м² + терраса 23 м²", purpose: "ИЖС / СНТ", city: "Пермский край", maker: ZAGORODOM,
    description: "Каркасный дом 8,3 × 11,8 м: дом 77 м² и терраса 23 м². Светлый фасад и большая терраса.",
    descriptionLong: "Дом HAPPY «Счастливый» — каркасный дом размером 8,3 × 11,8 м, общая площадь 100 м² (жилая 77 м² + терраса 23 м²). Светлый фасад, большая терраса для семейного отдыха.",
    gallery: [
      { image: zg_happy1, type: "photo", fit: "contain", blur: true },
      { image: zg_happy2, type: "photo", fit: "contain", blur: true },
      { image: zg_happy3, type: "photo", fit: "contain", blur: true },
      { image: zg_happy_plan, type: "photo", fit: "contain" },
    ],
    likes: 26, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса", "Панорамные окна"], style: "Современный", landSize: "6–10 соток",
    hasRealPhotos: true, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 66, name: "Дом FAVORITE Любимый", badge: "Жилой дом", price: "от 5 490 000 ₽",
    area: "89 м²", area_m2: 89, beds: 3, baths: 1, floors: 1, term: "120 д.",
    rooms: "Дом 71 м² + терраса 18 м²", purpose: "ИЖС / СНТ", city: "Пермский край", maker: ZAGORODOM,
    description: "Каркасный дом 7,8 × 10,9 м: дом 71 м² и терраса 18 м². Уютный современный коттедж.",
    descriptionLong: "Дом FAVORITE «Любимый» — каркасный дом размером 7,8 × 10,9 м, общая площадь 89 м² (жилая 71 м² + терраса 18 м²). Уютный современный коттедж с просторной террасой.",
    gallery: [
      { image: zg_favorite1, type: "photo", fit: "contain", blur: true },
      { image: zg_favorite2, type: "photo", fit: "contain", blur: true },
      { image: zg_favorite3, type: "photo", fit: "contain", blur: true },
      { image: zg_favorite_plan, type: "photo", fit: "contain" },
    ],
    likes: 21, rating: 4.7,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса", "Панорамные окна"], style: "Современный", landSize: "6–10 соток",
    hasRealPhotos: true, hasShowroom: false, hasInstallment: false,
  },

  // ── Апа Групп · Пермский край ─────────────────────────────────────────
  {
    id: 67, name: "АА-1. Каркасный дом 68 м²", badge: "Жилой дом", price: "от 3 160 000 ₽",
    area: "68 м²", area_m2: 68, beds: 2, baths: 2, floors: 1, term: "от 3 мес.",
    rooms: "2 спальни", purpose: "ИЖС / СНТ", city: "Пермский край", maker: APA,
    description: "Одноэтажный каркасный дом 8,6 × 14 м с террасой. 4 комнаты, 2 санузла.",
    descriptionLong: "Небольшой одноэтажный каркасный дом площадью 68 м² (габариты 8,6 × 14 м) с террасой. Планировка на 4 комнаты и 2 санузла. Срок строительства — от 3 месяцев.",
    gallery: [
      { image: apa_aa1_1, type: "photo", fit: "contain", blur: true },
      { image: apa_aa1_2, type: "photo", fit: "contain", blur: true },
      { image: apa_aa1_3, type: "photo", fit: "contain", blur: true },
      { image: apa_aa1_4, type: "photo", fit: "contain", blur: true },
      { image: apa_aa1_5, type: "photo", fit: "contain" },
    ],
    likes: 18, rating: 4.7,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса"], style: "Современный", landSize: "6–10 соток",
    hasRealPhotos: true, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 68, name: "АА-2. Каркасный дом 82 м²", badge: "Жилой дом", price: "от 2 770 000 ₽",
    area: "82 м²", area_m2: 82, beds: 2, baths: 2, floors: 1, term: "от 3 мес.",
    rooms: "2 спальни", purpose: "ИЖС / СНТ", city: "Пермский край", maker: APA,
    description: "Одноэтажный каркасный дом 9,5 × 9,5 м. 4 комнаты, 2 санузла.",
    descriptionLong: "Одноэтажный каркасный дом площадью 82 м² (габариты 9,5 × 9,5 м) с планировкой на 4 комнаты и 2 санузла. Срок строительства — от 3 месяцев.",
    gallery: [
      { image: apa_aa2_1, type: "photo", fit: "contain", blur: true },
      { image: apa_aa2_2, type: "photo", fit: "contain", blur: true },
      { image: apa_aa2_3, type: "photo", fit: "contain", blur: true },
      { image: apa_aa2_4, type: "photo", fit: "contain", blur: true },
      { image: apa_aa2_5, type: "photo", fit: "contain" },
    ],
    likes: 15, rating: 4.7,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: [], style: "Современный", landSize: "6–10 соток",
    hasRealPhotos: true, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 69, name: "АА-3. Каркасный дом 90 м²", badge: "Жилой дом", price: "от 3 280 000 ₽",
    area: "90 м²", area_m2: 90, beds: 2, baths: 1, floors: 1, term: "от 3 мес.",
    rooms: "3 комнаты", purpose: "ИЖС / СНТ", city: "Пермский край", maker: APA,
    description: "Одноэтажный каркасный дом 13 × 8,8 м. 3 просторные комнаты.",
    descriptionLong: "Одноэтажный каркасный дом площадью 90 м² (габариты 13 × 8,8 м) с тремя просторными комнатами и санузлом. Срок строительства — от 3 месяцев.",
    gallery: [
      { image: apa_aa3_1, type: "photo", fit: "contain", blur: true },
      { image: apa_aa3_2, type: "photo", fit: "contain", blur: true },
      { image: apa_aa3_3, type: "photo", fit: "contain", blur: true },
      { image: apa_aa3_4, type: "photo", fit: "contain", blur: true },
      { image: apa_aa3_5, type: "photo", fit: "contain", blur: true },
      { image: apa_aa3_6, type: "photo", fit: "contain" },
    ],
    likes: 22, rating: 4.7,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: [], style: "Современный", landSize: "6–10 соток",
    hasRealPhotos: true, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 70, name: "АА-4. Каркасный дом 94 м² с террасой", badge: "Жилой дом", price: "от 3 666 000 ₽",
    area: "94 м²", area_m2: 94, beds: 3, baths: 2, floors: 2, term: "от 3 мес.",
    rooms: "5 комнат", purpose: "ИЖС / СНТ", city: "Пермский край", maker: APA,
    description: "Двухэтажный каркасный дом 7,5 × 7,5 м с балконом. 5 комнат, 2 санузла.",
    descriptionLong: "Двухэтажный каркасный дом площадью 94 м² (габариты 7,5 × 7,5 м) с балконом. Планировка на 5 комнат и 2 санузла. Срок строительства — от 3 месяцев.",
    gallery: [
      { image: apa_aa4_1, type: "photo", fit: "contain", blur: true },
      { image: apa_aa4_2, type: "photo", fit: "contain", blur: true },
      { image: apa_aa4_3, type: "photo", fit: "contain", blur: true },
      { image: apa_aa4_4, type: "photo", fit: "contain", blur: true },
      { image: apa_aa4_5, type: "photo", fit: "contain" },
      { image: apa_aa4_6, type: "photo", fit: "contain" },
    ],
    likes: 27, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса", "Балкон"], style: "Современный", landSize: "6–10 соток",
    hasRealPhotos: true, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 71, name: "АА-5. Каркасный дом 106 м²", badge: "Жилой дом", price: "от 3 844 000 ₽",
    area: "106 м²", area_m2: 106, beds: 3, baths: 2, floors: 1, term: "от 3 мес.",
    rooms: "4 комнаты", purpose: "ИЖС / СНТ", city: "Пермский край", maker: APA,
    description: "Одноэтажный каркасный дом 8,6 × 14 м в стиле хай-тек. 4 комнаты, 2 санузла.",
    descriptionLong: "Современный одноэтажный каркасный дом площадью 106 м² (габариты 8,6 × 14 м) в стиле хай-тек. Планировка на 4 комнаты и 2 санузла. Срок строительства — от 3 месяцев.",
    gallery: [
      { image: apa_aa5_1, type: "photo", fit: "contain", blur: true },
      { image: apa_aa5_2, type: "photo", fit: "contain", blur: true },
      { image: apa_aa5_3, type: "photo", fit: "contain", blur: true },
      { image: apa_aa5_4, type: "photo", fit: "contain", blur: true },
      { image: apa_aa5_5, type: "photo", fit: "contain" },
    ],
    likes: 31, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Хай-тек"], style: "Хай-тек", landSize: "6–10 соток",
    hasRealPhotos: true, hasShowroom: false, hasInstallment: false,
  },

  // ── Прайм Модуль · Пермский край ────────────────────────────────────────────
  {
    id: 72, name: "Барнхаус-200", badge: "Барнхаус", price: "от 6 699 000 ₽",
    area: "200 м²", area_m2: 200, beds: 5, baths: 2, floors: 2, term: "от 1 мес.",
    rooms: "5 спален", purpose: "ИЖС / СНТ", city: "Пермский край", maker: PRIME_MODUL,
    description: "Двухэтажный барнхаус 200 м² с мастер-спальней, сауной и крытой террасой 127 м².",
    descriptionLong: "Двухэтажный барнхаус площадью 200 м² на 5 спален и 2 санузла. Кухня-гостиная со вторым светом 34,8 м², мастер-спальня с собственным санузлом, сауна и просторная крытая терраса 127 м².",
    gallery: [
      { image: pm_barn200_1, type: "photo", fit: "contain", blur: true },
      { image: pm_barn200_2, type: "photo", fit: "contain", blur: true },
      { image: pm_barn200_3, type: "photo", fit: "contain", blur: true },
      { image: pm_barn200_4, type: "photo", fit: "contain", blur: true },
      { image: pm_barn200_5, type: "photo", fit: "contain", blur: true },
      { image: pm_barn200_6, type: "photo", fit: "contain", blur: true },
      { image: pm_barn200_plan, type: "photo", fit: "contain" },
    ],
    likes: 32, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса", "Сауна", "Второй свет"], style: "Барнхаус", landSize: "10+ соток",
    hasRealPhotos: true, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 73, name: "Скандинавия-72", badge: "Жилой дом", price: "от 3 200 000 ₽",
    area: "72 м²", area_m2: 72, beds: 2, baths: 1, floors: 1, term: "от 1 мес.",
    rooms: "2 спальни", purpose: "ИЖС / СНТ", city: "Пермский край", maker: PRIME_MODUL,
    description: "Одноэтажный каркасный дом 72 м² в скандинавском стиле для семьи из 2–4 человек.",
    descriptionLong: "Каркасный дом площадью 72 м² в скандинавском стиле. Планировка: кухня-гостиная 23,37 м², две просторные спальни по 9,8 м², санузел и терраса 12 м². Утепление базальтовой ватой, водяной тёплый пол, двухкамерные стеклопакеты.",
    gallery: [
      { image: pm_skandi72_1, type: "photo", fit: "contain", blur: true },
      { image: pm_skandi72_2, type: "photo", fit: "contain", blur: true },
      { image: pm_skandi72_3, type: "photo", fit: "contain", blur: true },
      { image: pm_skandi72_4, type: "photo", fit: "contain", blur: true },
      { image: pm_skandi72_plan, type: "photo", fit: "contain" },
    ],
    likes: 24, rating: 4.7,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса", "Тёплые полы"], style: "Скандинавский", landSize: "6–10 соток",
    hasRealPhotos: true, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 74, name: "Барн-42", badge: "Барнхаус", price: "от 1 999 000 ₽",
    area: "42 м²", area_m2: 42, beds: 1, baths: 1, floors: 1, term: "от 1 мес.",
    rooms: "1 спальня", purpose: "ИЖС / СНТ / Дача", city: "Пермский край", maker: PRIME_MODUL,
    description: "Компактный каркасный барнхаус 42 м² для семьи из 2–3 человек.",
    descriptionLong: "Каркасный барнхаус площадью 42 м² для семьи из 2–3 человек. Фундамент на винтовых сваях, утепление базальтовой ватой (пол/потолок 200 мм, стены 150 мм) с плёнками ONDUTISS, кровля из профнастила, двухкамерные стеклопакеты с немецкой фурнитурой, наружная отделка имитацией бруса с защитной пропиткой «Сканди».",
    gallery: [
      { image: pm_barn42_1, type: "photo", fit: "contain", blur: true },
      { image: pm_barn42_2, type: "photo", fit: "contain", blur: true },
      { image: pm_barn42_3, type: "photo", fit: "contain", blur: true },
      { image: pm_barn42_plan, type: "photo", fit: "contain" },
    ],
    likes: 18, rating: 4.6,
    suitableFor: ["Для одного / пары", "Выходные / дача"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Тёплые полы"], style: "Барнхаус", landSize: "3–6 соток",
    hasRealPhotos: true, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 75, name: "Модерн-72", badge: "Жилой дом", price: "от 3 200 000 ₽",
    area: "72 м²", area_m2: 72, beds: 2, baths: 1, floors: 1, term: "от 1 мес.",
    rooms: "2 спальни", purpose: "ИЖС / СНТ", city: "Пермский край", maker: PRIME_MODUL,
    description: "Каркасный дом 72 м² в современном стиле для семьи из 2–5 человек.",
    descriptionLong: "Каркасный дом площадью 72 м² в современном стиле. Планировка: кухня-гостиная 16,8 м², две спальни по 10 м², санузел и терраса 16 м². Винтовой фундамент, утепление до −30°C, водяной тёплый пол, двухкамерные стеклопакеты.",
    gallery: [
      { image: pm_modern72_1, type: "photo", fit: "contain", blur: true },
      { image: pm_modern72_2, type: "photo", fit: "contain", blur: true },
      { image: pm_modern72_3, type: "photo", fit: "contain", blur: true },
      { image: pm_modern72_4, type: "photo", fit: "contain", blur: true },
      { image: pm_modern72_plan, type: "photo", fit: "contain" },
    ],
    likes: 22, rating: 4.7,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса", "Тёплые полы"], style: "Современный", landSize: "6–10 соток",
    hasRealPhotos: true, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 76, name: "Кантри-110", badge: "Жилой дом", price: "от 4 200 000 ₽",
    area: "110 м²", area_m2: 110, beds: 3, baths: 2, floors: 1, term: "от 1 мес.",
    rooms: "3 спальни", purpose: "ИЖС / СНТ", city: "Пермский край", maker: PRIME_MODUL,
    description: "Каркасный дом 110 м² с мастер-спальней, гардеробной и террасой для семьи из 3–6 человек.",
    descriptionLong: "Каркасный дом площадью 110 м² для семьи из 3–6 человек. Планировка: кухня-гостиная 22,29 м², мастер-спальня с собственным санузлом, две просторные комнаты, основной санузел, гардеробная, прихожая и большая терраса 2×7 м. Утепление базальтовой ватой с плёнками ONDUTISS, металлочерепица, водяной тёплый пол.",
    gallery: [
      { image: pm_kantri110_1, type: "photo", fit: "contain", blur: true },
      { image: pm_kantri110_2, type: "photo", fit: "contain", blur: true },
      { image: pm_kantri110_3, type: "photo", fit: "contain", blur: true },
      { image: pm_kantri110_4, type: "photo", fit: "contain", blur: true },
      { image: pm_kantri110_plan, type: "photo", fit: "contain" },
    ],
    likes: 28, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса", "Гардеробная", "Тёплые полы"], style: "Кантри", landSize: "6–10 соток",
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

export const projectEdgeBleed: Record<number, boolean[]> = Object.fromEntries(
  projects.map((p) => [p.id, p.gallery.map((g) => g.edgeBleed ?? false)])
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

// Кол-во проектов по makerId — для карточки производителя на странице проекта.
export const projectsCountByMakerId: Record<string, number> = projects.reduce((acc, p) => {
  const id = p.maker.id;
  if (!id) return acc;
  acc[id] = (acc[id] ?? 0) + 1;
  return acc;
}, {} as Record<string, number>);

// Сводная информация по производителю (id → name/initials/city/siteUrl/technology),
// автоматически собирается из массива projects. Используется на странице /partner/:id,
// чтобы добавление нового производителя через projects.ts сразу подтягивалось всюду.
export type MakerSummary = {
  id: string;
  name: string;
  initials: string;
  city: string;
  siteUrl?: string;
  technology: string;
  productionAddress?: string;
};
export const makersById: Record<string, MakerSummary> = projects.reduce((acc, p) => {
  const id = p.maker.id;
  if (!id || acc[id]) return acc;
  acc[id] = {
    id,
    name: p.maker.name,
    initials: p.maker.initials,
    city: p.city,
    siteUrl: p.maker.siteUrl,
    technology: p.technology,
    productionAddress: p.maker.productionAddress,
  };
  return acc;
}, {} as Record<string, MakerSummary>);

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

// Производители считаются автоматически из массива projects.
// Никаких «вспомогательных» хардкод-производителей: всё, что есть, — реальные компании с проектами.
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

export const manufacturers = realManufacturers;

// ============================================================================
// ГОРОДА
// ============================================================================

export const cities = ["Екатеринбург", "Пермский край"];
