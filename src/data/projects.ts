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

// СК Уткино
import utkino_lesnoy32_1 from "@/assets/utkino/lesnoy-32-1.webp";
import utkino_lesnoy32_plan from "@/assets/utkino/lesnoy-32-plan.webp";
import utkino_lesnoy32_size from "@/assets/utkino/lesnoy-32-size.webp";
import utkino_tikhiy43_1 from "@/assets/utkino/tikhiy-bereg-43-1.webp";
import utkino_tikhiy43_planFurnished from "@/assets/utkino/tikhiy-bereg-43-plan-furnished.webp";
import utkino_tikhiy43_plan from "@/assets/utkino/tikhiy-bereg-43-plan.webp";
import utkino_bereginya50_1 from "@/assets/utkino/bereginya-50-1.webp";
import utkino_bereginya50_planFurnished from "@/assets/utkino/bereginya-50-plan-furnished.webp";
import utkino_bereginya50_plan from "@/assets/utkino/bereginya-50-plan.webp";
import utkino_berendey63_1 from "@/assets/utkino/berendey-63-1.webp";
import utkino_berendey63_planFurnished from "@/assets/utkino/berendey-63-plan-furnished.webp";
import utkino_berendey63_plan from "@/assets/utkino/berendey-63-plan.webp";
import utkino_svetlitsa72_1 from "@/assets/utkino/svetlitsa-prikamya-72-1.webp";
import utkino_svetlitsa72_floor1Plan from "@/assets/utkino/svetlitsa-prikamya-72-floor1-plan.webp";
import utkino_svetlitsa72_floor1Size from "@/assets/utkino/svetlitsa-prikamya-72-floor1-size.webp";
import utkino_svetlitsa72_atticPlan from "@/assets/utkino/svetlitsa-prikamya-72-attic-plan.webp";
import utkino_svetlitsa72_atticSize from "@/assets/utkino/svetlitsa-prikamya-72-attic-size.webp";

// Теплодина
import td_dk122_1 from "@/assets/teplodina/dk-122-1.webp";
import td_dk122_2 from "@/assets/teplodina/dk-122-2.webp";
import td_dk122_3 from "@/assets/teplodina/dk-122-3.webp";
import td_dk122_4 from "@/assets/teplodina/dk-122-4.webp";
import td_dk122_5 from "@/assets/teplodina/dk-122-5.webp";
import td_dk55_1 from "@/assets/teplodina/dk-55-1.webp";
import td_dk55_2 from "@/assets/teplodina/dk-55-2.webp";
import td_dk55_3 from "@/assets/teplodina/dk-55-3.webp";
import td_dk55_4 from "@/assets/teplodina/dk-55-4.webp";
import td_dk55_5 from "@/assets/teplodina/dk-55-5.webp";
import td_dk67_1 from "@/assets/teplodina/dk-67-1.webp";
import td_dk67_2 from "@/assets/teplodina/dk-67-2.webp";
import td_dk67_3 from "@/assets/teplodina/dk-67-3.webp";
import td_dk67_4 from "@/assets/teplodina/dk-67-4.webp";
import td_dk67_5 from "@/assets/teplodina/dk-67-5.webp";
import td_dk72_1 from "@/assets/teplodina/dk-72-1.webp";
import td_dk72_2 from "@/assets/teplodina/dk-72-2.webp";
import td_dk72_3 from "@/assets/teplodina/dk-72-3.webp";
import td_dk72_4 from "@/assets/teplodina/dk-72-4.webp";
import td_dk72_5 from "@/assets/teplodina/dk-72-5.webp";
import td_skandinaviya_1 from "@/assets/teplodina/skandinaviya-1.webp";
import td_skandinaviya_2 from "@/assets/teplodina/skandinaviya-2.webp";
import td_skandinaviya_3 from "@/assets/teplodina/skandinaviya-3.webp";
import td_skandinaviya_4 from "@/assets/teplodina/skandinaviya-4.webp";

// Karkas.haus
import kh2205_1 from "@/assets/karkas-haus/kh-22-05/1.webp";
import kh2205_2 from "@/assets/karkas-haus/kh-22-05/2.webp";
import kh2205_3 from "@/assets/karkas-haus/kh-22-05/3.webp";
import kh2205_4 from "@/assets/karkas-haus/kh-22-05/4.webp";
import kh2205_5 from "@/assets/karkas-haus/kh-22-05/5.webp";
import kh2205_6 from "@/assets/karkas-haus/kh-22-05/6.webp";
import kh2310_1 from "@/assets/karkas-haus/kh-23-10-barnhaus/1.webp";
import kh2310_2 from "@/assets/karkas-haus/kh-23-10-barnhaus/2.webp";
import kh2310_3 from "@/assets/karkas-haus/kh-23-10-barnhaus/3.webp";
import kh2310_4 from "@/assets/karkas-haus/kh-23-10-barnhaus/4.webp";
import kh2310_5 from "@/assets/karkas-haus/kh-23-10-barnhaus/5.webp";
import kh2310_6 from "@/assets/karkas-haus/kh-23-10-barnhaus/6.webp";
import kh23151_1 from "@/assets/karkas-haus/kh-23-15-1/1.webp";
import kh23151_2 from "@/assets/karkas-haus/kh-23-15-1/2.webp";
import kh23151_3 from "@/assets/karkas-haus/kh-23-15-1/3.webp";
import kh23151_4 from "@/assets/karkas-haus/kh-23-15-1/4.webp";
import kh23151_5 from "@/assets/karkas-haus/kh-23-15-1/5.webp";
import kh23151_6 from "@/assets/karkas-haus/kh-23-15-1/6.webp";
import kh23152_1 from "@/assets/karkas-haus/kh-23-15-2/1.webp";
import kh23152_2 from "@/assets/karkas-haus/kh-23-15-2/2.webp";
import kh23152_3 from "@/assets/karkas-haus/kh-23-15-2/3.webp";
import kh23152_4 from "@/assets/karkas-haus/kh-23-15-2/4.webp";
import kh23152_5 from "@/assets/karkas-haus/kh-23-15-2/5.webp";
import kh23152_6 from "@/assets/karkas-haus/kh-23-15-2/6.webp";
import kh23222_1 from "@/assets/karkas-haus/kh-23-22-2/1.webp";
import kh23222_2 from "@/assets/karkas-haus/kh-23-22-2/2.webp";
import kh23222_3 from "@/assets/karkas-haus/kh-23-22-2/3.webp";
import kh23222_4 from "@/assets/karkas-haus/kh-23-22-2/4.webp";
import kh23222_5 from "@/assets/karkas-haus/kh-23-22-2/5.webp";
import kh23222_6 from "@/assets/karkas-haus/kh-23-22-2/6.webp";

// Урал Хаус
import uhSkandi120_1 from "@/assets/ural-house/uh-skandi-120/1.webp";
import uhSkandi120_2 from "@/assets/ural-house/uh-skandi-120/2.webp";
import uhSkandi120_3 from "@/assets/ural-house/uh-skandi-120/3.webp";
import uhSkandi120_4 from "@/assets/ural-house/uh-skandi-120/4.webp";
import uhSkandi120_5 from "@/assets/ural-house/uh-skandi-120/5.webp";
import uhSkandi120_6 from "@/assets/ural-house/uh-skandi-120/6.webp";
import uhBarn92_1 from "@/assets/ural-house/uh-barn-92/1.webp";
import uhBarn92_2 from "@/assets/ural-house/uh-barn-92/2.webp";
import uhKlassik170_1 from "@/assets/ural-house/uh-klassik-170/1.webp";
import uhKlassik170_2 from "@/assets/ural-house/uh-klassik-170/2.webp";
import uhFahverk190_1 from "@/assets/ural-house/uh-fahverk-190/1.webp";
import uhFahverk190_2 from "@/assets/ural-house/uh-fahverk-190/2.webp";
import uhFahverk190_3 from "@/assets/ural-house/uh-fahverk-190/3.webp";
import uhFahverk190_4 from "@/assets/ural-house/uh-fahverk-190/4.webp";
import uhFahverk190_5 from "@/assets/ural-house/uh-fahverk-190/5.webp";
import uhKlassik76_1 from "@/assets/ural-house/uh-klassik-76/1.webp";
import uhKlassik76_2 from "@/assets/ural-house/uh-klassik-76/2.webp";

// Хочу Дом
import hdDk443_1 from "@/assets/hochu-dom/dk-443-130/1.webp";
import hdDk443_2 from "@/assets/hochu-dom/dk-443-130/2.webp";
import hdDk443_3 from "@/assets/hochu-dom/dk-443-130/3.webp";
import hdDk443Plan1 from "@/assets/hochu-dom/dk-443-130/4.webp";
import hdDk443Plan2 from "@/assets/hochu-dom/dk-443-130/5.webp";
import hdDk387_1 from "@/assets/hochu-dom/dk-387-115/1.webp";
import hdDk387_2 from "@/assets/hochu-dom/dk-387-115/2.webp";
import hdDk387_3 from "@/assets/hochu-dom/dk-387-115/3.webp";
import hdDk387_4 from "@/assets/hochu-dom/dk-387-115/4.webp";
import hdDk387_5 from "@/assets/hochu-dom/dk-387-115/5.webp";
import hdDk387Plan1 from "@/assets/hochu-dom/dk-387-115/6.webp";
import hdDk387Plan2 from "@/assets/hochu-dom/dk-387-115/7.webp";
import hdDk384_1 from "@/assets/hochu-dom/dk-384-91/1.webp";
import hdDk384_2 from "@/assets/hochu-dom/dk-384-91/2.webp";
import hdDk384_3 from "@/assets/hochu-dom/dk-384-91/3.webp";
import hdDk384_4 from "@/assets/hochu-dom/dk-384-91/4.webp";
import hdDk384Plan from "@/assets/hochu-dom/dk-384-91/5.webp";
import hdDk428_1 from "@/assets/hochu-dom/dk-428-127/1.webp";
import hdDk428_2 from "@/assets/hochu-dom/dk-428-127/2.webp";
import hdDk428_3 from "@/assets/hochu-dom/dk-428-127/3.webp";
import hdDk428_4 from "@/assets/hochu-dom/dk-428-127/4.webp";
import hdDk428_5 from "@/assets/hochu-dom/dk-428-127/5.webp";
import hdDk428_6 from "@/assets/hochu-dom/dk-428-127/6.webp";
import hdDk428Plan from "@/assets/hochu-dom/dk-428-127/7.webp";
import hdDk390_1 from "@/assets/hochu-dom/dk-390-96/1.webp";
import hdDk390_2 from "@/assets/hochu-dom/dk-390-96/2.webp";
import hdDk390Plan from "@/assets/hochu-dom/dk-390-96/3.webp";
import seKd1600_1 from "@/assets/scandiecodom/kd-1600/1.webp";
import seKd1600_2 from "@/assets/scandiecodom/kd-1600/2.webp";
import seKd1600_3 from "@/assets/scandiecodom/kd-1600/3.webp";
import seKd1600Plan from "@/assets/scandiecodom/kd-1600/4.webp";
import seKd1590_1 from "@/assets/scandiecodom/kd-1590/1.webp";
import seKd1590_2 from "@/assets/scandiecodom/kd-1590/2.webp";
import seKd1590_3 from "@/assets/scandiecodom/kd-1590/3.webp";
import seKd1590Plan from "@/assets/scandiecodom/kd-1590/4.webp";
import seKd1580_1 from "@/assets/scandiecodom/kd-1580/1.webp";
import seKd1580_2 from "@/assets/scandiecodom/kd-1580/2.webp";
import seKd1580_3 from "@/assets/scandiecodom/kd-1580/3.webp";
import seKd1580Plan1 from "@/assets/scandiecodom/kd-1580/4.webp";
import seKd1580Plan2 from "@/assets/scandiecodom/kd-1580/5.webp";
import seKd1570_1 from "@/assets/scandiecodom/kd-1570/1.webp";
import seKd1570_2 from "@/assets/scandiecodom/kd-1570/2.webp";
import seKd1570_3 from "@/assets/scandiecodom/kd-1570/3.webp";
import seKd1570Plan1 from "@/assets/scandiecodom/kd-1570/4.webp";
import seKd1570Plan2 from "@/assets/scandiecodom/kd-1570/5.webp";
import seKd1560_1 from "@/assets/scandiecodom/kd-1560/1.webp";
import seKd1560_2 from "@/assets/scandiecodom/kd-1560/2.webp";
import seKd1560_3 from "@/assets/scandiecodom/kd-1560/3.webp";
import seKd1560Plan from "@/assets/scandiecodom/kd-1560/4.webp";
import kpMadrid3_1 from "@/assets/karkas-povolzhya/madrid-3/1.webp";
import kpMadrid3_2 from "@/assets/karkas-povolzhya/madrid-3/2.webp";
import kpMadrid3_3 from "@/assets/karkas-povolzhya/madrid-3/3.webp";
import kpMadrid3Plan1 from "@/assets/karkas-povolzhya/madrid-3/4.webp";
import kpMadrid3Plan2 from "@/assets/karkas-povolzhya/madrid-3/5.webp";
import kpManchester_1 from "@/assets/karkas-povolzhya/manchester/1.webp";
import kpManchester_2 from "@/assets/karkas-povolzhya/manchester/2.webp";
import kpManchester_3 from "@/assets/karkas-povolzhya/manchester/3.webp";
import kpManchesterPlan from "@/assets/karkas-povolzhya/manchester/4.webp";
import kpStokgolm_1 from "@/assets/karkas-povolzhya/stokgolm/1.webp";
import kpStokgolm_2 from "@/assets/karkas-povolzhya/stokgolm/2.webp";
import kpStokgolm_3 from "@/assets/karkas-povolzhya/stokgolm/3.webp";
import kpStokgolmPlan1 from "@/assets/karkas-povolzhya/stokgolm/4.webp";
import kpStokgolmPlan2 from "@/assets/karkas-povolzhya/stokgolm/5.webp";
import kpBerlin_1 from "@/assets/karkas-povolzhya/berlin/1.webp";
import kpBerlin_2 from "@/assets/karkas-povolzhya/berlin/2.webp";
import kpBerlin_3 from "@/assets/karkas-povolzhya/berlin/3.webp";
import kpBerlinPlan1 from "@/assets/karkas-povolzhya/berlin/4.webp";
import kpBerlinPlan2 from "@/assets/karkas-povolzhya/berlin/5.webp";
import kpLondon1_1 from "@/assets/karkas-povolzhya/london-1/1.webp";
import kpLondon1_2 from "@/assets/karkas-povolzhya/london-1/2.webp";
import kpLondon1_3 from "@/assets/karkas-povolzhya/london-1/3.webp";
import kpLondon1Plan1 from "@/assets/karkas-povolzhya/london-1/4.webp";
import kpLondon1Plan2 from "@/assets/karkas-povolzhya/london-1/5.webp";
import dtGlempingBarnhaus_1 from "@/assets/domoteka/glemping-barnhaus-6x7/1.webp";
import dtGlempingBarnhaus_2 from "@/assets/domoteka/glemping-barnhaus-6x7/2.webp";
import dtGlempingBarnhaus_3 from "@/assets/domoteka/glemping-barnhaus-6x7/3.webp";
import dtGlempingBarnhaus_4 from "@/assets/domoteka/glemping-barnhaus-6x7/4.webp";
import dtGlempingBarnhaus_5 from "@/assets/domoteka/glemping-barnhaus-6x7/5.webp";
import dtParizh_1 from "@/assets/domoteka/parizh/1.webp";
import dtParizh_2 from "@/assets/domoteka/parizh/2.webp";
import dtParizh_3 from "@/assets/domoteka/parizh/3.webp";
import dtParizh_4 from "@/assets/domoteka/parizh/4.webp";
import dtParizh_5 from "@/assets/domoteka/parizh/5.webp";
import dtElbrus_1 from "@/assets/domoteka/elbrus/1.webp";
import dtElbrus_2 from "@/assets/domoteka/elbrus/2.webp";
import dtElbrus_3 from "@/assets/domoteka/elbrus/3.webp";
import dtElbrus_4 from "@/assets/domoteka/elbrus/4.webp";
import dtElbrus_5 from "@/assets/domoteka/elbrus/5.webp";
import dtAFrame_1 from "@/assets/domoteka/glemping-a-frame-6x6/1.webp";
import dtAFrame_2 from "@/assets/domoteka/glemping-a-frame-6x6/2.webp";
import dtAFrame_3 from "@/assets/domoteka/glemping-a-frame-6x6/3.webp";
import dtAFrame_4 from "@/assets/domoteka/glemping-a-frame-6x6/4.webp";
import dtAFrame_5 from "@/assets/domoteka/glemping-a-frame-6x6/5.webp";
import dtFisht_1 from "@/assets/domoteka/fisht/1.webp";
import dtFisht_2 from "@/assets/domoteka/fisht/2.webp";
import dtFisht_3 from "@/assets/domoteka/fisht/3.webp";
import dtFisht_4 from "@/assets/domoteka/fisht/4.webp";
import dtFisht_5 from "@/assets/domoteka/fisht/5.webp";
import shSvoy199_1 from "@/assets/svoi-house/svoy-199/1.webp";
import shSvoy199_2 from "@/assets/svoi-house/svoy-199/2.webp";
import shSvoyLayt001_1 from "@/assets/svoi-house/svoy-layt-001/1.webp";
import shSvoyLayt001_2 from "@/assets/svoi-house/svoy-layt-001/2.webp";
import shSvoy100_1 from "@/assets/svoi-house/svoy-100/1.webp";
import shSvoy100_2 from "@/assets/svoi-house/svoy-100/2.webp";
import shSvoyLayt004_1 from "@/assets/svoi-house/svoy-layt-004/1.webp";
import shSvoyLayt004_2 from "@/assets/svoi-house/svoy-layt-004/2.webp";
import shSvoy102M_1 from "@/assets/svoi-house/svoy-102-m/1.webp";
import shSvoy102M_2 from "@/assets/svoi-house/svoy-102-m/2.webp";
import bs9h15Dionis_1 from "@/assets/bagrovstroy/9h15-dionis/1.webp";
import bs9h15Dionis_2 from "@/assets/bagrovstroy/9h15-dionis/2.webp";
import bs9h15Dionis_3 from "@/assets/bagrovstroy/9h15-dionis/3.webp";
import bs9h15Dionis_4 from "@/assets/bagrovstroy/9h15-dionis/4.webp";
import bs9h15Dionis_5 from "@/assets/bagrovstroy/9h15-dionis/5.webp";
import bs9h15Sadko_1 from "@/assets/bagrovstroy/9h15-sadko/1.webp";
import bs9h15Sadko_2 from "@/assets/bagrovstroy/9h15-sadko/2.webp";
import bs9h15Sadko_3 from "@/assets/bagrovstroy/9h15-sadko/3.webp";
import bs9h15Sadko_4 from "@/assets/bagrovstroy/9h15-sadko/4.webp";
import bs9h15Sadko_5 from "@/assets/bagrovstroy/9h15-sadko/5.webp";
import bs105h11Avgust_1 from "@/assets/bagrovstroy/10-5h11-avgust/1.webp";
import bs105h11Avgust_2 from "@/assets/bagrovstroy/10-5h11-avgust/2.webp";
import bs105h11Avgust_3 from "@/assets/bagrovstroy/10-5h11-avgust/3.webp";
import bs105h11Avgust_4 from "@/assets/bagrovstroy/10-5h11-avgust/4.webp";
import bs105h11Avgust_5 from "@/assets/bagrovstroy/10-5h11-avgust/5.webp";
import bs6h8Saveliy_1 from "@/assets/bagrovstroy/6h8-saveliy/1.webp";
import bs6h8Saveliy_2 from "@/assets/bagrovstroy/6h8-saveliy/2.webp";
import bs6h8Saveliy_3 from "@/assets/bagrovstroy/6h8-saveliy/3.webp";
import bs6h8Saveliy_4 from "@/assets/bagrovstroy/6h8-saveliy/4.webp";
import bs6h8Saveliy_5 from "@/assets/bagrovstroy/6h8-saveliy/5.webp";
import bs7h9Gostimir_1 from "@/assets/bagrovstroy/7h9-gostimir/1.webp";
import bs7h9Gostimir_2 from "@/assets/bagrovstroy/7h9-gostimir/2.webp";
import bs7h9Gostimir_3 from "@/assets/bagrovstroy/7h9-gostimir/3.webp";
import bs7h9Gostimir_4 from "@/assets/bagrovstroy/7h9-gostimir/4.webp";
import bs7h9Gostimir_5 from "@/assets/bagrovstroy/7h9-gostimir/5.webp";
import dkKd120_1 from "@/assets/domakarkas/kd-120/1.webp";
import dkKd120_2 from "@/assets/domakarkas/kd-120/2.webp";
import dkKd120_3 from "@/assets/domakarkas/kd-120/3.webp";
import dkKd120_4 from "@/assets/domakarkas/kd-120/4.webp";
import dkKd120_5 from "@/assets/domakarkas/kd-120/5.webp";
import dkKd119_1 from "@/assets/domakarkas/kd-119/1.webp";
import dkKd119_2 from "@/assets/domakarkas/kd-119/2.webp";
import dkKd119_3 from "@/assets/domakarkas/kd-119/3.webp";
import dkKd119_4 from "@/assets/domakarkas/kd-119/4.webp";
import dkKd119_5 from "@/assets/domakarkas/kd-119/5.webp";
import dkKd118_1 from "@/assets/domakarkas/kd-118/1.webp";
import dkKd118_2 from "@/assets/domakarkas/kd-118/2.webp";
import dkKd118_3 from "@/assets/domakarkas/kd-118/3.webp";
import dkKd118_4 from "@/assets/domakarkas/kd-118/4.webp";
import dkKd118_5 from "@/assets/domakarkas/kd-118/5.webp";
import dkKd117_1 from "@/assets/domakarkas/kd-117/1.webp";
import dkKd117_2 from "@/assets/domakarkas/kd-117/2.webp";
import dkKd117_3 from "@/assets/domakarkas/kd-117/3.webp";
import dkKd117_4 from "@/assets/domakarkas/kd-117/4.webp";
import dkKd117_5 from "@/assets/domakarkas/kd-117/5.webp";
import dkKd116_1 from "@/assets/domakarkas/kd-116/1.webp";
import dkKd116_2 from "@/assets/domakarkas/kd-116/2.webp";
import dkKd116_3 from "@/assets/domakarkas/kd-116/3.webp";
import dkKd116_4 from "@/assets/domakarkas/kd-116/4.webp";
import dkKd116_5 from "@/assets/domakarkas/kd-116/5.webp";
import sgVyazma_1 from "@/assets/sk-garmoniya/vyazma/1.webp";
import sgVyazma_2 from "@/assets/sk-garmoniya/vyazma/2.webp";
import sgVyazma_3 from "@/assets/sk-garmoniya/vyazma/3.webp";
import sgVyazma_4 from "@/assets/sk-garmoniya/vyazma/4.webp";
import sgVyazma_5 from "@/assets/sk-garmoniya/vyazma/5.webp";
import sgSosnovyyBor_1 from "@/assets/sk-garmoniya/sosnovyy-bor/1.webp";
import sgSosnovyyBor_2 from "@/assets/sk-garmoniya/sosnovyy-bor/2.webp";
import sgSosnovyyBor_3 from "@/assets/sk-garmoniya/sosnovyy-bor/3.webp";
import sgSosnovyyBor_4 from "@/assets/sk-garmoniya/sosnovyy-bor/4.webp";
import sgSosnovyyBor_5 from "@/assets/sk-garmoniya/sosnovyy-bor/5.webp";
import sgTroitsk_1 from "@/assets/sk-garmoniya/troitsk/1.webp";
import sgTroitsk_2 from "@/assets/sk-garmoniya/troitsk/2.webp";
import sgTroitsk_3 from "@/assets/sk-garmoniya/troitsk/3.webp";
import sgTroitsk_4 from "@/assets/sk-garmoniya/troitsk/4.webp";
import sgTroitsk_5 from "@/assets/sk-garmoniya/troitsk/5.webp";
import sgVyborg_1 from "@/assets/sk-garmoniya/vyborg/1.webp";
import sgVyborg_2 from "@/assets/sk-garmoniya/vyborg/2.webp";
import sgVyborg_3 from "@/assets/sk-garmoniya/vyborg/3.webp";
import sgVyborg_4 from "@/assets/sk-garmoniya/vyborg/4.webp";
import sgVyborg_5 from "@/assets/sk-garmoniya/vyborg/5.webp";
import sgSamara_1 from "@/assets/sk-garmoniya/samara/1.webp";
import sgSamara_2 from "@/assets/sk-garmoniya/samara/2.webp";
import sgSamara_3 from "@/assets/sk-garmoniya/samara/3.webp";
import sgSamara_4 from "@/assets/sk-garmoniya/samara/4.webp";
import sgSamara_5 from "@/assets/sk-garmoniya/samara/5.webp";

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
const UTKINO: Maker = {
  name: "СК Уткино",
  initials: "УТ",
  id: "utkino",
  siteUrl: "https://sk-utkino.ru/catalog",
};
const TEPLODINA: Maker = {
  name: "Теплодина",
  initials: "ТД",
  id: "teplodina",
  siteUrl: "https://teplodina.ru/product-category/doma/karkasnye-doma/",
};
const KARKAS_HAUS: Maker = {
  name: "Karkas.haus",
  initials: "KH",
  id: "karkas-haus",
  siteUrl: "https://karkas.haus/doma",
};
const URAL_HOUSE: Maker = {
  name: "Урал Хаус",
  initials: "УХ",
  id: "ural-house",
  siteUrl: "https://ural-house.ru/",
};
const HOCHU_DOM: Maker = {
  name: "Хочу Дом",
  initials: "ХД",
  id: "hochu-dom",
  siteUrl: "https://hochu-dom.ru/catalog/",
};
const SCANDI_ECODOM: Maker = {
  name: "Сканди ЭкоДом",
  initials: "СЭ",
  id: "scandiecodom",
  siteUrl: "https://scandiecodom.ru/houses/",
};
const KARKAS_POVOLZHYA: Maker = {
  name: "Каркас Поволжья",
  initials: "КП",
  id: "karkas-povolzhya",
  siteUrl: "https://karkasdoma.pro/projects/frame/",
};
const DOMOTEKA: Maker = {
  name: "Домотека",
  initials: "ДМ",
  id: "domoteka",
  siteUrl: "https://domoteka-krd.ru/karkasnye-doma/",
};
const SVOI_HOUSE: Maker = {
  name: "СК «Свой»",
  initials: "СВ",
  id: "svoi-house",
  siteUrl: "https://svoi.house/karkas",
};
const BAGROVSTROY: Maker = {
  name: "Багров Строй",
  initials: "БС",
  id: "bagrovstroy",
  siteUrl: "https://bagrovstroy.ru/karkasnye-doma",
};
const DOMAKARKAS: Maker = {
  name: "ДомаКаркас",
  initials: "ДК",
  id: "domakarkas",
  siteUrl: "https://domakarkas.ru/proekty-karkasnyh-domov/",
};
const SK_GARMONIYA: Maker = {
  name: "СК Гармония",
  initials: "ГР",
  id: "sk-garmoniya",
  siteUrl: "https://skgarmoniya.ru/catalog/doma-karkas/",
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
    area: "73 м²", area_m2: 73, beds: 3, baths: 1, floors: 2, term: "90 д.",
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
    id: 62, name: "Дом SOUL Душевный", badge: "Жилой дом", price: "3 500 000 ₽",
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
    id: 63, name: "Барнхаус STRONG Крепкий", badge: "Барнхаус", price: "3 700 000 ₽",
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
    id: 64, name: "Дом LUMO Очаровательный", badge: "Жилой дом", price: "5 850 000 ₽",
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
    id: 65, name: "Дом HAPPY Счастливый", badge: "Жилой дом", price: "5 900 000 ₽",
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
    id: 66, name: "Дом FAVORITE Любимый", badge: "Жилой дом", price: "5 490 000 ₽",
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
    id: 67, name: "АА-1. Каркасный дом 68 м²", badge: "Жилой дом", price: "3 160 000 ₽",
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
    id: 68, name: "АА-2. Каркасный дом 82 м²", badge: "Жилой дом", price: "2 770 000 ₽",
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
    id: 69, name: "АА-3. Каркасный дом 90 м²", badge: "Жилой дом", price: "3 280 000 ₽",
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
    id: 70, name: "АА-4. Каркасный дом 94 м² с террасой", badge: "Жилой дом", price: "3 666 000 ₽",
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
    id: 71, name: "АА-5. Каркасный дом 106 м²", badge: "Жилой дом", price: "3 844 000 ₽",
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
    id: 72, name: "Барнхаус-200", badge: "Барнхаус", price: "6 699 000 ₽",
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
    id: 73, name: "Скандинавия-72", badge: "Жилой дом", price: "3 200 000 ₽",
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
    id: 74, name: "Барн-42", badge: "Барнхаус", price: "1 999 000 ₽",
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
    id: 75, name: "Модерн-72", badge: "Жилой дом", price: "3 200 000 ₽",
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
    id: 76, name: "Кантри-110", badge: "Жилой дом", price: "4 200 000 ₽",
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

  // ── СК Уткино · Пермский край ─────────────────────────────────────────
  {
    id: 77, name: "Лесной", badge: "Жилой дом", price: "1 418 752 ₽",
    area: "32,6 м²", area_m2: 32.6, beds: 1, baths: 1, floors: 1, term: "от 1 мес.",
    rooms: "1 спальня", purpose: "ИЖС / СНТ / Дача", city: "Пермский край", maker: UTKINO,
    description: "Компактный каркасный дом 32,6 м² в комплектации тёплый контур.",
    descriptionLong: "Каркасный дом площадью 32,6 м² (габариты 6 × 6 м) для дачи или компактного загородного проживания. Планировка включает кухню-гостиную, спальню, санузел и террасу.",
    gallery: [
      { image: utkino_lesnoy32_1, type: "photo", fit: "contain", blur: true },
      { image: utkino_lesnoy32_plan, type: "photo", fit: "contain" },
      { image: utkino_lesnoy32_size, type: "photo", fit: "contain" },
    ],
    likes: 16, rating: 4.6,
    suitableFor: ["Для одного / пары", "Выходные / дача"],
    technology: "Каркасный", completion: "Без отделки", insulation: "до −30°C",
    features: ["Терраса"], style: "Современный", landSize: "3–6 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 78, name: "Тихий берег", badge: "Жилой дом", price: "1 893 120 ₽",
    area: "43,5 м²", area_m2: 43.5, beds: 2, baths: 1, floors: 1, term: "от 1 мес.",
    rooms: "2 спальни", purpose: "ИЖС / СНТ / Дача", city: "Пермский край", maker: UTKINO,
    description: "Одноэтажный каркасный дом 43,5 м² с двумя спальнями и террасой.",
    descriptionLong: "Каркасный дом площадью 43,5 м² (габариты 7 × 7 м) в комплектации тёплый контур. В планировке две спальни, кухня-гостиная, санузел, прихожая и терраса.",
    gallery: [
      { image: utkino_tikhiy43_1, type: "photo", fit: "contain", blur: true },
      { image: utkino_tikhiy43_planFurnished, type: "photo", fit: "contain" },
      { image: utkino_tikhiy43_plan, type: "photo", fit: "contain" },
    ],
    likes: 19, rating: 4.7,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Без отделки", insulation: "до −30°C",
    features: ["Терраса"], style: "Современный", landSize: "3–6 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 79, name: "Берегиня", badge: "Жилой дом", price: "2 189 056 ₽",
    area: "50,38 м²", area_m2: 50.38, beds: 2, baths: 1, floors: 1, term: "от 1 мес.",
    rooms: "2 спальни", purpose: "ИЖС / СНТ", city: "Пермский край", maker: UTKINO,
    description: "Каркасный дом 50,38 м² с двумя спальнями и удобной общей зоной.",
    descriptionLong: "Одноэтажный каркасный дом площадью 50,38 м² (габариты 6 × 9 м) в комплектации тёплый контур. Планировка подходит для семьи: две спальни, кухня-гостиная, санузел, котельная и входная зона.",
    gallery: [
      { image: utkino_bereginya50_1, type: "photo", fit: "contain", blur: true },
      { image: utkino_bereginya50_planFurnished, type: "photo", fit: "contain" },
      { image: utkino_bereginya50_plan, type: "photo", fit: "contain" },
    ],
    likes: 21, rating: 4.7,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Без отделки", insulation: "до −30°C",
    features: ["Котельная"], style: "Классический", landSize: "6–10 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 80, name: "Берендей", badge: "Жилой дом", price: "2 763 520 ₽",
    area: "63,5 м²", area_m2: 63.5, beds: 2, baths: 1, floors: 1, term: "от 1 мес.",
    rooms: "2 спальни", purpose: "ИЖС / СНТ", city: "Пермский край", maker: UTKINO,
    description: "Каркасный дом 63,5 м² с двумя спальнями и просторной кухней-гостиной.",
    descriptionLong: "Одноэтажный каркасный дом площадью 63,5 м² (габариты 7,2 × 10 м) в комплектации тёплый контур. Внутри две спальни, кухня-гостиная, санузел, котельная и прихожая.",
    gallery: [
      { image: utkino_berendey63_1, type: "photo", fit: "contain", blur: true },
      { image: utkino_berendey63_planFurnished, type: "photo", fit: "contain" },
      { image: utkino_berendey63_plan, type: "photo", fit: "contain" },
    ],
    likes: 24, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Без отделки", insulation: "до −30°C",
    features: ["Котельная"], style: "Классический", landSize: "6–10 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 81, name: "Светлица Прикамья", badge: "Жилой дом", price: "3 138 227 ₽",
    area: "72,11 м²", area_m2: 72.11, beds: 3, baths: 1, floors: 2, term: "от 1 мес.",
    rooms: "3 спальни", purpose: "ИЖС / СНТ", city: "Пермский край", maker: UTKINO,
    description: "Каркасный дом 72,11 м² с мансардой, тремя спальнями и террасой.",
    descriptionLong: "Каркасный дом площадью 72,11 м² (габариты 6 × 8 м) в комплектации тёплый контур. На первом этаже кухня-гостиная, спальня, санузел и терраса; на мансарде — две дополнительные комнаты.",
    gallery: [
      { image: utkino_svetlitsa72_1, type: "photo", fit: "contain", blur: true },
      { image: utkino_svetlitsa72_floor1Plan, type: "photo", fit: "contain" },
      { image: utkino_svetlitsa72_floor1Size, type: "photo", fit: "contain" },
      { image: utkino_svetlitsa72_atticPlan, type: "photo", fit: "contain" },
      { image: utkino_svetlitsa72_atticSize, type: "photo", fit: "contain" },
    ],
    likes: 26, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Без отделки", insulation: "до −30°C",
    features: ["Терраса", "Мансарда"], style: "Классический", landSize: "6–10 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },

  // ── Теплодина · Екатеринбург ───────────────────────────────────────────
  {
    id: 82, name: "ДК-122", badge: "Жилой дом", price: "3 863 000 ₽",
    area: "85,8 м²", area_m2: 85.8, beds: 2, baths: 1, floors: 1, term: "от 2 мес.",
    rooms: "2 спальни", purpose: "ИЖС / СНТ", city: "Екатеринбург",
    maker: { ...TEPLODINA, siteUrl: "https://teplodina.ru/product/karkasnyj-dom-dk-122/" },
    description: "Одноэтажный каркасный дом 85,8 м² с двумя спальнями и террасой.",
    descriptionLong: "Каркасный дом площадью 85,8 м² (габариты 11,6 × 7,4 м) с двумя спальнями, санузлом и террасой. Подходит для постоянного проживания семьи за городом.",
    gallery: [
      { image: td_dk122_1, type: "photo", fit: "contain", blur: true },
      { image: td_dk122_2, type: "photo", fit: "contain", blur: true },
      { image: td_dk122_3, type: "photo", fit: "contain", blur: true },
      { image: td_dk122_4, type: "photo", fit: "contain", blur: true },
      { image: td_dk122_5, type: "photo", fit: "contain", blur: true },
    ],
    likes: 29, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса"], style: "Современный", landSize: "6–10 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 83, name: "ДК-55", badge: "Жилой дом", price: "2 835 000 ₽",
    area: "55 м²", area_m2: 55, beds: 2, baths: 1, floors: 1, term: "от 2 мес.",
    rooms: "2 спальни", purpose: "ИЖС / СНТ / Дача", city: "Екатеринбург",
    maker: { ...TEPLODINA, siteUrl: "https://teplodina.ru/product/karkasnyj-dom-dk-55/" },
    description: "Компактный каркасный дом 55 м² с двумя спальнями и террасой.",
    descriptionLong: "Одноэтажный каркасный дом площадью 55 м² (габариты 9 × 7 м). В проекте две спальни, общая зона, санузел и терраса.",
    gallery: [
      { image: td_dk55_1, type: "photo", fit: "contain", blur: true },
      { image: td_dk55_2, type: "photo", fit: "contain", blur: true },
      { image: td_dk55_3, type: "photo", fit: "contain", blur: true },
      { image: td_dk55_4, type: "photo", fit: "contain", blur: true },
      { image: td_dk55_5, type: "photo", fit: "contain", blur: true },
    ],
    likes: 23, rating: 4.7,
    suitableFor: ["Постоянное проживание", "Выходные / дача"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса"], style: "Современный", landSize: "3–6 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 84, name: "ДК-67", badge: "Жилой дом", price: "2 835 000 ₽",
    area: "63 м²", area_m2: 63, beds: 2, baths: 1, floors: 1, term: "от 2 мес.",
    rooms: "2 спальни", purpose: "ИЖС / СНТ", city: "Екатеринбург",
    maker: { ...TEPLODINA, siteUrl: "https://teplodina.ru/product/karkasnyj-dom-dk-67/" },
    description: "Одноэтажный каркасный дом 63 м² с двумя спальнями и террасой.",
    descriptionLong: "Каркасный дом площадью 63 м² (габариты 9 × 7 м) с двумя спальнями, санузлом и террасой. Формат для постоянного проживания или просторной дачи.",
    gallery: [
      { image: td_dk67_1, type: "photo", fit: "contain", blur: true },
      { image: td_dk67_2, type: "photo", fit: "contain", blur: true },
      { image: td_dk67_3, type: "photo", fit: "contain", blur: true },
      { image: td_dk67_4, type: "photo", fit: "contain", blur: true },
      { image: td_dk67_5, type: "photo", fit: "contain", blur: true },
    ],
    likes: 24, rating: 4.7,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса"], style: "Современный", landSize: "6–10 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 85, name: "ДК-72", badge: "Жилой дом", price: "3 240 000 ₽",
    area: "64,5 м²", area_m2: 64.5, beds: 3, baths: 1, floors: 1, term: "от 2 мес.",
    rooms: "3 спальни", purpose: "ИЖС / СНТ", city: "Екатеринбург",
    maker: { ...TEPLODINA, siteUrl: "https://teplodina.ru/product/karkasnyj-dom-dk-72/" },
    description: "Каркасный дом 64,5 м² с тремя спальнями и террасой.",
    descriptionLong: "Одноэтажный каркасный дом площадью 64,5 м² (габариты 9 × 8 м). Планировка рассчитана на три спальни, санузел, общую зону и террасу.",
    gallery: [
      { image: td_dk72_1, type: "photo", fit: "contain", blur: true },
      { image: td_dk72_2, type: "photo", fit: "contain", blur: true },
      { image: td_dk72_3, type: "photo", fit: "contain", blur: true },
      { image: td_dk72_4, type: "photo", fit: "contain", blur: true },
      { image: td_dk72_5, type: "photo", fit: "contain", blur: true },
    ],
    likes: 26, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса"], style: "Современный", landSize: "6–10 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 86, name: "Скандинавия", badge: "Жилой дом", price: "2 304 000 ₽",
    area: "48 м²", area_m2: 48, beds: 2, baths: 1, floors: 1, term: "от 2 мес.",
    rooms: "2 спальни", purpose: "ИЖС / СНТ / Дача", city: "Екатеринбург",
    maker: { ...TEPLODINA, siteUrl: "https://teplodina.ru/product/dom-karkasnyj-skandinaviya/" },
    description: "Компактный каркасный дом 48 м² в скандинавском стиле.",
    descriptionLong: "Одноэтажный каркасный дом площадью 48 м² (габариты 8 × 6 м) с двумя спальнями, санузлом и террасой/крыльцом. Подходит для дачи и круглогодичного проживания.",
    gallery: [
      { image: td_skandinaviya_1, type: "photo", fit: "contain", blur: true },
      { image: td_skandinaviya_2, type: "photo", fit: "contain", blur: true },
      { image: td_skandinaviya_3, type: "photo", fit: "contain", blur: true },
      { image: td_skandinaviya_4, type: "photo", fit: "contain", blur: true },
    ],
    likes: 22, rating: 4.7,
    suitableFor: ["Для одного / пары", "Выходные / дача"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса"], style: "Скандинавский", landSize: "3–6 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },

  // ── Karkas.haus · Екатеринбург ─────────────────────────────────────────
  {
    id: 87, name: "22-05", badge: "Жилой дом", price: "2 979 200 ₽",
    area: "93,1 м²", area_m2: 93.1, beds: 2, baths: 1, floors: 1, term: "от 2 мес.",
    rooms: "2 спальни", purpose: "ИЖС / СНТ", city: "Екатеринбург",
    maker: { ...KARKAS_HAUS, siteUrl: "https://karkas.haus/doma/proekt-doma-22-05" },
    description: "Каркасный дом 93,1 м² с двумя спальнями, террасой и крыльцом.",
    descriptionLong: "Проект 22-05 от Karkas.haus: каркасный дом камерной сушки площадью 93,1 м². Габариты 12,5 × 7,5 м, тёплый контур 75 м², жилая площадь 65 м², терраса 18,1 м² и крыльцо 1,79 м².",
    gallery: [
      { image: kh2205_1, type: "photo", fit: "contain", blur: true },
      { image: kh2205_2, type: "photo", fit: "contain" },
      { image: kh2205_3, type: "photo", fit: "contain" },
      { image: kh2205_4, type: "photo", fit: "contain" },
      { image: kh2205_5, type: "photo", fit: "contain" },
      { image: kh2205_6, type: "photo", fit: "contain" },
    ],
    likes: 31, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Без отделки", insulation: "до −30°C",
    features: ["Терраса", "Крыльцо"], style: "Современный", landSize: "6–10 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 88, name: "23-10 БарнХаус", badge: "Жилой дом", price: "4 192 000 ₽",
    area: "131 м²", area_m2: 131, beds: 3, baths: 1, floors: 2, term: "от 2 мес.",
    rooms: "3 спальни", purpose: "ИЖС / СНТ", city: "Екатеринбург",
    maker: { ...KARKAS_HAUS, siteUrl: "https://karkas.haus/doma/proekt-doma-23-10-barnhaus" },
    description: "Двухэтажный барнхаус 131 м² с тремя спальнями и террасой.",
    descriptionLong: "Проект 23-10 БарнХаус от Karkas.haus: каркасный дом камерной сушки площадью 131 м². Габариты 12 × 6 м, тёплый контур 120 м², жилая площадь 110 м², терраса 11 м² и крыльцо 4 м².",
    gallery: [
      { image: kh2310_1, type: "photo", fit: "contain", blur: true },
      { image: kh2310_2, type: "photo", fit: "contain" },
      { image: kh2310_3, type: "photo", fit: "contain" },
      { image: kh2310_4, type: "photo", fit: "contain" },
      { image: kh2310_5, type: "photo", fit: "contain" },
      { image: kh2310_6, type: "photo", fit: "contain" },
    ],
    likes: 34, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Без отделки", insulation: "до −30°C",
    features: ["Терраса", "Второй свет"], style: "Барнхаус", landSize: "6–10 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 89, name: "23-15-1", badge: "Жилой дом", price: "4 499 200 ₽",
    area: "140,6 м²", area_m2: 140.6, beds: 2, baths: 1, floors: 1, term: "от 2 мес.",
    rooms: "2 спальни", purpose: "ИЖС / СНТ", city: "Екатеринбург",
    maker: { ...KARKAS_HAUS, siteUrl: "https://karkas.haus/doma/proekt-doma-23-15-1" },
    description: "Одноэтажный каркасный дом 140,6 м² с большой террасой.",
    descriptionLong: "Проект 23-15-1 от Karkas.haus: каркасный дом камерной сушки площадью 140,6 м². Габариты 16,6 × 8,5 м, тёплый контур 115 м², жилая площадь 98 м², терраса 25,6 м² и крыльцо 2,21 м².",
    gallery: [
      { image: kh23151_1, type: "photo", fit: "contain", blur: true },
      { image: kh23151_2, type: "photo", fit: "contain" },
      { image: kh23151_3, type: "photo", fit: "contain" },
      { image: kh23151_4, type: "photo", fit: "contain" },
      { image: kh23151_5, type: "photo", fit: "contain" },
      { image: kh23151_6, type: "photo", fit: "contain" },
    ],
    likes: 33, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Без отделки", insulation: "до −30°C",
    features: ["Терраса", "Крыльцо"], style: "Современный", landSize: "10+ соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 90, name: "23-15-2", badge: "Жилой дом", price: "3 692 800 ₽",
    area: "115,4 м²", area_m2: 115.4, beds: 2, baths: 1, floors: 1, term: "от 2 мес.",
    rooms: "2 спальни", purpose: "ИЖС / СНТ", city: "Екатеринбург",
    maker: { ...KARKAS_HAUS, siteUrl: "https://karkas.haus/doma/proekt-doma-23-15-2" },
    description: "Одноэтажный каркасный дом 115,4 м² с просторной террасой.",
    descriptionLong: "Проект 23-15-2 от Karkas.haus: каркасный дом камерной сушки площадью 115,4 м². Габариты 13 × 8,9 м, тёплый контур 89 м², жилая площадь 80 м², терраса 26,4 м² и крыльцо 3 м².",
    gallery: [
      { image: kh23152_1, type: "photo", fit: "contain", blur: true },
      { image: kh23152_2, type: "photo", fit: "contain" },
      { image: kh23152_3, type: "photo", fit: "contain" },
      { image: kh23152_4, type: "photo", fit: "contain" },
      { image: kh23152_5, type: "photo", fit: "contain" },
      { image: kh23152_6, type: "photo", fit: "contain" },
    ],
    likes: 30, rating: 4.7,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Без отделки", insulation: "до −30°C",
    features: ["Терраса", "Крыльцо"], style: "Современный", landSize: "6–10 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 91, name: "23-22-2", badge: "Жилой дом", price: "3 043 200 ₽",
    area: "95,1 м²", area_m2: 95.1, beds: 2, baths: 1, floors: 1, term: "от 2 мес.",
    rooms: "2 спальни", purpose: "ИЖС / СНТ", city: "Екатеринбург",
    maker: { ...KARKAS_HAUS, siteUrl: "https://karkas.haus/doma/proekt-doma-23-22-2" },
    description: "Одноэтажный каркасный дом 95,1 м² с двумя спальнями и террасой.",
    descriptionLong: "Проект 23-22-2 от Karkas.haus: каркасный дом камерной сушки площадью 95,1 м². Габариты 9,7 × 11 м, тёплый контур 88 м², жилая площадь 80 м², терраса 7,1 м² и крыльцо 3,67 м².",
    gallery: [
      { image: kh23222_1, type: "photo", fit: "contain", blur: true },
      { image: kh23222_2, type: "photo", fit: "contain" },
      { image: kh23222_3, type: "photo", fit: "contain" },
      { image: kh23222_4, type: "photo", fit: "contain" },
      { image: kh23222_5, type: "photo", fit: "contain" },
      { image: kh23222_6, type: "photo", fit: "contain" },
    ],
    likes: 29, rating: 4.7,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Без отделки", insulation: "до −30°C",
    features: ["Терраса", "Крыльцо"], style: "Современный", landSize: "6–10 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },

  // ── Урал Хаус · Екатеринбург ───────────────────────────────────────────
  {
    id: 92, name: "Сканди 120", badge: "Жилой дом", price: "5 200 000 ₽",
    area: "88 м²", area_m2: 88, beds: 2, baths: 1, floors: 1, term: "от 2 мес.",
    rooms: "2 спальни", purpose: "ИЖС / СНТ", city: "Екатеринбург",
    maker: { ...URAL_HOUSE, siteUrl: "https://ural-house.ru/tproduct/523330126-504825492462-skandi-120" },
    description: "Каркасный дом в скандинавском стиле с двумя спальнями и террасой.",
    descriptionLong: "Сканди 120 от Урал Хаус: тёплый контур 8 × 11 м, площадь 88 м², жилая площадь 78 м², терраса и крыльцо 37 м². В комплектации тёплого контура используется строганая доска камерной сушки и утепление минеральной ватой.",
    gallery: [
      { image: uhSkandi120_1, type: "photo", fit: "contain", blur: true },
      { image: uhSkandi120_2, type: "photo", fit: "contain" },
      { image: uhSkandi120_3, type: "photo", fit: "contain", blur: true },
      { image: uhSkandi120_4, type: "photo", fit: "contain", blur: true },
      { image: uhSkandi120_5, type: "photo", fit: "contain", blur: true },
      { image: uhSkandi120_6, type: "photo", fit: "contain", blur: true },
    ],
    likes: 35, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Без отделки", insulation: "до −30°C",
    features: ["Терраса", "Крыльцо"], style: "Скандинавский", landSize: "6–10 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 93, name: "Барн 92", badge: "Жилой дом", price: "3 800 000 ₽",
    area: "60 м²", area_m2: 60, beds: 2, baths: 1, floors: 1, term: "от 2 мес.",
    rooms: "2 спальни", purpose: "ИЖС / СНТ", city: "Екатеринбург",
    maker: { ...URAL_HOUSE, siteUrl: "https://ural-house.ru/tproduct/523330126-495445897382-barn-92" },
    description: "Каркасный барнхаус 60 м² с двумя спальнями и террасами.",
    descriptionLong: "Барн 92 от Урал Хаус: тёплый контур 6 × 10 м, площадь 60 м², жилая площадь 52 м², террасы 31,3 м². Проект в стиле барнхаус для загородного проживания.",
    gallery: [
      { image: uhBarn92_1, type: "photo", fit: "contain", blur: true },
      { image: uhBarn92_2, type: "photo", fit: "contain" },
    ],
    likes: 28, rating: 4.7,
    suitableFor: ["Постоянное проживание", "Выходные / дача"],
    technology: "Каркасный", completion: "Без отделки", insulation: "до −30°C",
    features: ["Терраса"], style: "Барнхаус", landSize: "6–10 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 94, name: "Классик 170", badge: "Жилой дом", price: "7 700 000 ₽",
    area: "128 м²", area_m2: 128, beds: 3, baths: 1, floors: 1, term: "от 2 мес.",
    rooms: "3 спальни", purpose: "ИЖС / СНТ", city: "Екатеринбург",
    maker: { ...URAL_HOUSE, siteUrl: "https://ural-house.ru/tproduct/523330126-628459603402-klassik-170" },
    description: "Каркасный дом 128 м² с тремя спальнями, парной и террасой.",
    descriptionLong: "Классик 170 от Урал Хаус: тёплый контур 8,9 × 14,5 м, площадь 128 м², жилая площадь 111 м², террасы и крыльцо 40,6 м². В проекте три спальни и парная.",
    gallery: [
      { image: uhKlassik170_1, type: "photo", fit: "contain", blur: true },
      { image: uhKlassik170_2, type: "photo", fit: "contain" },
    ],
    likes: 32, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Без отделки", insulation: "до −30°C",
    features: ["Терраса", "Сауна"], style: "Классический", landSize: "10+ соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 95, name: "Фахверк 190", badge: "Жилой дом", price: "8 700 000 ₽",
    area: "146 м²", area_m2: 146, beds: 3, baths: 1, floors: 1, term: "от 2 мес.",
    rooms: "3 спальни", purpose: "ИЖС / СНТ", city: "Екатеринбург",
    maker: { ...URAL_HOUSE, siteUrl: "https://ural-house.ru/tproduct/523330126-748317956082-fahverk-190" },
    description: "Каркасный дом с элементами фахверка, тремя спальнями и террасами.",
    descriptionLong: "Фахверк 190 от Урал Хаус: тёплый контур 11 × 14,9 м, площадь 146 м², жилая площадь 128 м², террасы и крыльцо 46 м². Просторный дом с элементами фахверка для постоянного проживания.",
    gallery: [
      { image: uhFahverk190_1, type: "photo", fit: "contain", blur: true },
      { image: uhFahverk190_2, type: "photo", fit: "contain" },
      { image: uhFahverk190_3, type: "photo", fit: "contain", blur: true },
      { image: uhFahverk190_4, type: "photo", fit: "contain", blur: true },
      { image: uhFahverk190_5, type: "photo", fit: "contain", blur: true },
    ],
    likes: 36, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Без отделки", insulation: "до −30°C",
    features: ["Терраса", "Панорамные окна"], style: "Фахверк", landSize: "10+ соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 96, name: "Классик 76", badge: "Жилой дом", price: "3 250 000 ₽",
    area: "48 м²", area_m2: 48, beds: 3, baths: 1, floors: 1, term: "от 2 мес.",
    rooms: "3 спальни", purpose: "ИЖС / СНТ / Дача", city: "Екатеринбург",
    maker: { ...URAL_HOUSE, siteUrl: "https://ural-house.ru/tproduct/523330126-696804063452-klassik-76" },
    description: "Компактный каркасный дом 48 м² с тремя спальнями и террасой.",
    descriptionLong: "Классик 76 от Урал Хаус: тёплый контур 6 × 8 м, площадь 48 м², жилая площадь 42 м², террасы и крыльцо 28,3 м². Компактный вариант для дачи или постоянного проживания.",
    gallery: [
      { image: uhKlassik76_1, type: "photo", fit: "contain", blur: true },
      { image: uhKlassik76_2, type: "photo", fit: "contain" },
    ],
    likes: 27, rating: 4.7,
    suitableFor: ["Постоянное проживание", "Выходные / дача"],
    technology: "Каркасный", completion: "Без отделки", insulation: "до −30°C",
    features: ["Терраса", "Крыльцо"], style: "Классический", landSize: "3–6 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },

  // ── Хочу Дом · Москва и МО ─────────────────────────────────────────────
  {
    id: 97, name: "ДК-443", badge: "Жилой дом", price: "2 126 250 ₽",
    area: "130 м²", area_m2: 130, beds: 3, baths: 1, floors: 2, term: "от 2 мес.",
    rooms: "3 спальни", purpose: "ИЖС / СНТ", city: "Москва и МО",
    maker: { ...HOCHU_DOM, siteUrl: "https://hochu-dom.ru/catalog/dk-443-11-5-x-7-130m/" },
    description: "Двухэтажный каркасный дом 130 м² размером 7 × 11,5 м с просторной гостиной и террасой.",
    descriptionLong: "Проект ДК-443 от «Хочу Дом»: каркасный дом площадью 130 м², габариты 7 × 11,5 м, два этажа. На сайте застройщика указаны комплектации «Каркас под крышу», «Тёплый контур» и «Дом для ПМЖ», а также возможность изменить планировку.",
    gallery: [
      { image: hdDk443_1, type: "photo", fit: "contain", blur: true },
      { image: hdDk443_2, type: "photo", fit: "contain", blur: true },
      { image: hdDk443_3, type: "photo", fit: "contain", blur: true },
      { image: hdDk443Plan1, type: "photo", fit: "contain" },
      { image: hdDk443Plan2, type: "photo", fit: "contain" },
    ],
    likes: 33, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Без отделки", insulation: "до −30°C",
    features: ["Терраса", "Панорамные окна"], style: "Скандинавский", landSize: "6–10 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 98, name: "ДК-387", badge: "Жилой дом", price: "2 023 875 ₽",
    area: "115 м²", area_m2: 115, beds: 3, baths: 1, floors: 2, term: "от 2 мес.",
    rooms: "3 спальни", purpose: "ИЖС / СНТ", city: "Москва и МО",
    maker: { ...HOCHU_DOM, siteUrl: "https://hochu-dom.ru/catalog/dk-387-8-5-x-8-115m/" },
    description: "Двухэтажный каркасный дом 115 м² размером 8 × 8,5 м для постоянного проживания семьи.",
    descriptionLong: "Проект ДК-387 от «Хочу Дом»: каркасный дом площадью 115 м², габариты 8 × 8,5 м, два этажа. В каталоге застройщика есть комплектации от каркаса под крышу до дома для ПМЖ и возможность адаптировать планировку.",
    gallery: [
      { image: hdDk387_1, type: "photo", fit: "contain", blur: true },
      { image: hdDk387_2, type: "photo", fit: "contain", blur: true },
      { image: hdDk387_3, type: "photo", fit: "contain", blur: true },
      { image: hdDk387_4, type: "photo", fit: "contain", blur: true },
      { image: hdDk387_5, type: "photo", fit: "contain", blur: true },
      { image: hdDk387Plan1, type: "photo", fit: "contain" },
      { image: hdDk387Plan2, type: "photo", fit: "contain" },
    ],
    likes: 31, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Без отделки", insulation: "до −30°C",
    features: ["Терраса"], style: "Классический", landSize: "6–10 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 99, name: "ДК-384", badge: "Жилой дом", price: "1 990 800 ₽",
    area: "91 м²", area_m2: 91, beds: 3, baths: 1, floors: 1, term: "от 2 мес.",
    rooms: "3 спальни", purpose: "ИЖС / СНТ", city: "Москва и МО",
    maker: { ...HOCHU_DOM, siteUrl: "https://hochu-dom.ru/catalog/dk-384-9-4x7-5-91m-/" },
    description: "Одноэтажный каркасный дом 91 м² размером 7,5 × 9,5 м с террасой и панорамным остеклением.",
    descriptionLong: "Проект ДК-384 от «Хочу Дом»: одноэтажный каркасный дом площадью 91 м², габариты 7,5 × 9,5 м. Компактная планировка для семьи, с вариантами комплектации «Каркас под крышу», «Тёплый контур» и «Дом для ПМЖ».",
    gallery: [
      { image: hdDk384_1, type: "photo", fit: "contain", blur: true },
      { image: hdDk384_2, type: "photo", fit: "contain", blur: true },
      { image: hdDk384_3, type: "photo", fit: "contain", blur: true },
      { image: hdDk384_4, type: "photo", fit: "contain", blur: true },
      { image: hdDk384Plan, type: "photo", fit: "contain" },
    ],
    likes: 30, rating: 4.7,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Без отделки", insulation: "до −30°C",
    features: ["Терраса", "Панорамные окна"], style: "Современный", landSize: "6–10 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 100, name: "ДК-428", badge: "Жилой дом", price: "2 590 875 ₽",
    area: "127 м²", area_m2: 127, beds: 3, baths: 1, floors: 1, term: "от 2 мес.",
    rooms: "3 спальни", purpose: "ИЖС / СНТ", city: "Москва и МО",
    maker: { ...HOCHU_DOM, siteUrl: "https://hochu-dom.ru/catalog/dk-428-12-2-x-12-127m/" },
    description: "Одноэтажный каркасный дом 127 м² размером 12 × 12,2 м с широкой семейной планировкой.",
    descriptionLong: "Проект ДК-428 от «Хочу Дом»: одноэтажный каркасный дом площадью 127 м², габариты 12 × 12,2 м. Проект рассчитан на постоянное проживание, на сайте представлены комплектации от каркаса под крышу до дома для ПМЖ.",
    gallery: [
      { image: hdDk428_1, type: "photo", fit: "contain", blur: true },
      { image: hdDk428_2, type: "photo", fit: "contain", blur: true },
      { image: hdDk428_3, type: "photo", fit: "contain", blur: true },
      { image: hdDk428_4, type: "photo", fit: "contain", blur: true },
      { image: hdDk428_5, type: "photo", fit: "contain", blur: true },
      { image: hdDk428_6, type: "photo", fit: "contain", blur: true },
      { image: hdDk428Plan, type: "photo", fit: "contain" },
    ],
    likes: 34, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Без отделки", insulation: "до −30°C",
    features: ["Терраса"], style: "Классический", landSize: "10+ соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 101, name: "ДК-390", badge: "Жилой дом", price: "2 055 375 ₽",
    area: "96 м²", area_m2: 96, beds: 3, baths: 1, floors: 1, term: "от 2 мес.",
    rooms: "3 спальни", purpose: "ИЖС / СНТ", city: "Москва и МО",
    maker: { ...HOCHU_DOM, siteUrl: "https://hochu-dom.ru/catalog/dk-390-12-x-8-96m/" },
    description: "Одноэтажный каркасный дом 96 м² размером 8 × 12 м с лаконичной классической архитектурой.",
    descriptionLong: "Проект ДК-390 от «Хочу Дом»: одноэтажный каркасный дом площадью 96 м², габариты 8 × 12 м. В каталоге застройщика указаны комплектации «Каркас под крышу», «Тёплый контур» и «Дом для ПМЖ».",
    gallery: [
      { image: hdDk390_1, type: "photo", fit: "contain", blur: true },
      { image: hdDk390_2, type: "photo", fit: "contain", blur: true },
      { image: hdDk390Plan, type: "photo", fit: "contain" },
    ],
    likes: 29, rating: 4.7,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Без отделки", insulation: "до −30°C",
    features: ["Крыльцо"], style: "Классический", landSize: "6–10 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },

  // ── Сканди ЭкоДом · Санкт-Петербург и ЛО ───────────────────────────────
  {
    id: 102, name: "КД-1600", badge: "Жилой дом", price: "6 780 000 ₽",
    area: "139,9 м²", area_m2: 139.9, beds: 2, baths: 2, floors: 1, term: "4–5 мес.",
    rooms: "2 спальни", purpose: "ИЖС / СНТ", city: "Санкт-Петербург и ЛО",
    maker: { ...SCANDI_ECODOM, siteUrl: "https://scandiecodom.ru/houses/kd-1600-13-3h12-8/" },
    description: "Одноэтажный каркасный барнхаус 139,9 м² размером 13,3 × 12,8 м с двумя спальнями, сауной и лофтом.",
    descriptionLong: "Проект КД-1600 от «Сканди ЭкоДом»: одноэтажный каркасный дом площадью 139,9 м², габариты 13,3 × 12,8 м. В планировке две спальни, два санузла, сауна и лофт, стоимость на сайте застройщика указана для комплектации под ключ.",
    gallery: [
      { image: seKd1600_1, type: "photo", fit: "contain", blur: true },
      { image: seKd1600_2, type: "photo", fit: "contain", blur: true },
      { image: seKd1600_3, type: "photo", fit: "contain", blur: true },
      { image: seKd1600Plan, type: "photo", fit: "contain" },
    ],
    likes: 37, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Сауна", "Панорамные окна"], style: "Барнхаус", landSize: "10+ соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 103, name: "КД-1590", badge: "Жилой дом", price: "13 400 000 ₽",
    area: "276,7 м²", area_m2: 276.7, beds: 2, baths: 3, floors: 1, term: "4–5 мес.",
    rooms: "2 спальни", purpose: "ИЖС / СНТ", city: "Санкт-Петербург и ЛО",
    maker: { ...SCANDI_ECODOM, siteUrl: "https://scandiecodom.ru/houses/kd-1590-23-4h15-35/" },
    description: "Одноэтажный премиальный каркасный дом 276,7 м² размером 23,4 × 15,35 м со СПА-зоной.",
    descriptionLong: "Проект КД-1590 от «Сканди ЭкоДом»: просторный одноэтажный каркасный дом площадью 276,7 м², габариты 23,4 × 15,35 м. В проекте две спальни, три санузла и СПА-зона, стоимость на сайте указана для комплектации под ключ.",
    gallery: [
      { image: seKd1590_1, type: "photo", fit: "contain", blur: true },
      { image: seKd1590_2, type: "photo", fit: "contain", blur: true },
      { image: seKd1590_3, type: "photo", fit: "contain", blur: true },
      { image: seKd1590Plan, type: "photo", fit: "contain" },
    ],
    likes: 39, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Сауна", "Панорамные окна"], style: "Современный", landSize: "10+ соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 104, name: "КД-1580", badge: "Жилой дом", price: "11 730 000 ₽",
    area: "242,1 м²", area_m2: 242.1, beds: 3, baths: 2, floors: 2, term: "4–5 мес.",
    rooms: "3 спальни", purpose: "ИЖС / СНТ", city: "Санкт-Петербург и ЛО",
    maker: { ...SCANDI_ECODOM, siteUrl: "https://scandiecodom.ru/houses/kd-1580-9-5h12-5/" },
    description: "Двухэтажный каркасный барнхаус 242,1 м² размером 9,5 × 12,5 м с панорамным фронтоном и антресолью.",
    descriptionLong: "Проект КД-1580 от «Сканди ЭкоДом»: двухэтажный каркасный дом площадью 242,1 м², габариты 9,5 × 12,5 м. В планировке три спальни, два санузла, панорамный фронтон и антресоль, стоимость указана для комплектации под ключ.",
    gallery: [
      { image: seKd1580_1, type: "photo", fit: "contain", blur: true },
      { image: seKd1580_2, type: "photo", fit: "contain", blur: true },
      { image: seKd1580_3, type: "photo", fit: "contain", blur: true },
      { image: seKd1580Plan1, type: "photo", fit: "contain" },
      { image: seKd1580Plan2, type: "photo", fit: "contain" },
    ],
    likes: 38, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Панорамные окна", "Антресоль"], style: "Барнхаус", landSize: "10+ соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 105, name: "КД-1570", badge: "Жилой дом", price: "9 100 000 ₽",
    area: "187,8 м²", area_m2: 187.8, beds: 4, baths: 2, floors: 2, term: "4–5 мес.",
    rooms: "4 спальни", purpose: "ИЖС / СНТ", city: "Санкт-Петербург и ЛО",
    maker: { ...SCANDI_ECODOM, siteUrl: "https://scandiecodom.ru/houses/kd-1570-11-5h12/" },
    description: "Каркасный дом с мансардой 187,8 м² размером 11,5 × 12 м с четырьмя спальнями.",
    descriptionLong: "Проект КД-1570 от «Сканди ЭкоДом»: каркасный дом с мансардой площадью 187,8 м², габариты 11,5 × 12 м. Проект рассчитан на семью: четыре спальни, два санузла и современная архитектура в стиле барнхаус.",
    gallery: [
      { image: seKd1570_1, type: "photo", fit: "contain", blur: true },
      { image: seKd1570_2, type: "photo", fit: "contain", blur: true },
      { image: seKd1570_3, type: "photo", fit: "contain", blur: true },
      { image: seKd1570Plan1, type: "photo", fit: "contain" },
      { image: seKd1570Plan2, type: "photo", fit: "contain" },
    ],
    likes: 36, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Панорамные окна"], style: "Барнхаус", landSize: "10+ соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 106, name: "КД-1560", badge: "Жилой дом", price: "6 310 000 ₽",
    area: "130,2 м²", area_m2: 130.2, beds: 3, baths: 2, floors: 1, term: "4–5 мес.",
    rooms: "3 спальни", purpose: "ИЖС / СНТ", city: "Санкт-Петербург и ЛО",
    maker: { ...SCANDI_ECODOM, siteUrl: "https://scandiecodom.ru/houses/kd-1560-8h18/" },
    description: "Одноэтажный каркасный дом 130,2 м² размером 8 × 18 м с тремя спальнями, сауной и кабинетом.",
    descriptionLong: "Проект КД-1560 от «Сканди ЭкоДом»: одноэтажный каркасный дом площадью 130,2 м², габариты 8 × 18 м. В планировке три спальни, кухня-столовая, сауна, кабинет и крыльцо, стоимость на сайте указана для комплектации под ключ.",
    gallery: [
      { image: seKd1560_1, type: "photo", fit: "contain", blur: true },
      { image: seKd1560_2, type: "photo", fit: "contain", blur: true },
      { image: seKd1560_3, type: "photo", fit: "contain", blur: true },
      { image: seKd1560Plan, type: "photo", fit: "contain" },
    ],
    likes: 35, rating: 4.7,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Сауна", "Терраса"], style: "Классический", landSize: "10+ соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },

  // ── Каркас Поволжья · Казань ───────────────────────────────────────────
  {
    id: 107, name: "Мадрид 3 с террасой", badge: "Жилой дом", price: "4 510 000 ₽",
    area: "100 м²", area_m2: 100, beds: 3, baths: 1, floors: 2, term: "до 3 мес.",
    rooms: "3 комнаты", purpose: "ИЖС / СНТ", city: "Казань",
    maker: { ...KARKAS_POVOLZHYA, siteUrl: "https://karkasdoma.pro/projects/frame/madrid-3-s-terrasoj/" },
    description: "Каркасный дом 100 м² размером 6 × 8 м с террасой и жилым вторым этажом.",
    descriptionLong: "Проект «Мадрид 3 с террасой» от «Каркас Поволжья»: каркасный дом площадью 100 м², габариты 6 × 8 м. На втором этаже расположены три спальни, проект можно адаптировать и дополнить террасой, верандой или балконом.",
    gallery: [
      { image: kpMadrid3_1, type: "photo", fit: "contain", blur: true },
      { image: kpMadrid3_2, type: "photo", fit: "contain", blur: true },
      { image: kpMadrid3_3, type: "photo", fit: "contain", blur: true },
      { image: kpMadrid3Plan1, type: "photo", fit: "contain" },
      { image: kpMadrid3Plan2, type: "photo", fit: "contain" },
    ],
    likes: 34, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса"], style: "Классический", landSize: "6–10 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 108, name: "Манчестер", badge: "Жилой дом", price: "3 906 000 ₽",
    area: "62 м²", area_m2: 62, beds: 2, baths: 1, floors: 1, term: "до 3 мес.",
    rooms: "2 комнаты", purpose: "ИЖС / СНТ", city: "Казань",
    maker: { ...KARKAS_POVOLZHYA, siteUrl: "https://karkasdoma.pro/projects/frame/manchester/" },
    description: "Одноэтажный каркасный дом 62 м² размером 9,5 × 7 м с двумя комнатами.",
    descriptionLong: "Проект «Манчестер» от «Каркас Поволжья»: одноэтажный каркасный дом площадью 62 м², габариты 9,5 × 7 м. Компактная планировка для постоянного проживания или загородного отдыха, с возможностью бесплатной адаптации проекта.",
    gallery: [
      { image: kpManchester_1, type: "photo", fit: "contain", blur: true },
      { image: kpManchester_2, type: "photo", fit: "contain", blur: true },
      { image: kpManchester_3, type: "photo", fit: "contain", blur: true },
      { image: kpManchesterPlan, type: "photo", fit: "contain" },
    ],
    likes: 31, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для одного / пары"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Панорамные окна"], style: "Современный", landSize: "3–6 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 109, name: "Стокгольм", badge: "Жилой дом", price: "4 459 000 ₽",
    area: "91 м²", area_m2: 91, beds: 3, baths: 2, floors: 1, term: "до 3 мес.",
    rooms: "3 комнаты", purpose: "ИЖС / СНТ", city: "Казань",
    maker: { ...KARKAS_POVOLZHYA, siteUrl: "https://karkasdoma.pro/projects/stokgolm/" },
    description: "Одноэтажный каркасный дом 91 м² размером 8 × 12,2 м с тремя комнатами и верандой.",
    descriptionLong: "Проект «Стокгольм» от «Каркас Поволжья»: одноэтажный каркасный дом площадью 91 м², габариты 8 × 12,2 м. В описании проекта выделены кухня-гостиная, три спальни, мастер-спальня с санузлом и гардеробной, а также просторная веранда.",
    gallery: [
      { image: kpStokgolm_1, type: "photo", fit: "contain", blur: true },
      { image: kpStokgolm_2, type: "photo", fit: "contain", blur: true },
      { image: kpStokgolm_3, type: "photo", fit: "contain", blur: true },
      { image: kpStokgolmPlan1, type: "photo", fit: "contain" },
      { image: kpStokgolmPlan2, type: "photo", fit: "contain" },
    ],
    likes: 33, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса"], style: "Скандинавский", landSize: "6–10 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 110, name: "Берлин", badge: "Жилой дом", price: "5 000 000 ₽",
    area: "100 м²", area_m2: 100, beds: 4, baths: 2, floors: 2, term: "до 3 мес.",
    rooms: "4 комнаты", purpose: "ИЖС / СНТ", city: "Казань",
    maker: { ...KARKAS_POVOLZHYA, siteUrl: "https://karkasdoma.pro/projects/berlin/" },
    description: "Двухэтажный каркасный дом 100 м² размером 7 × 7,5 м с четырьмя комнатами.",
    descriptionLong: "Проект «Берлин» от «Каркас Поволжья»: двухэтажный каркасный дом площадью 100 м², габариты 7 × 7,5 м. В проекте четыре комнаты и два этажа, планировку можно изменить под сценарий постоянного проживания семьи.",
    gallery: [
      { image: kpBerlin_1, type: "photo", fit: "contain", blur: true },
      { image: kpBerlin_2, type: "photo", fit: "contain", blur: true },
      { image: kpBerlin_3, type: "photo", fit: "contain", blur: true },
      { image: kpBerlinPlan1, type: "photo", fit: "contain" },
      { image: kpBerlinPlan2, type: "photo", fit: "contain" },
    ],
    likes: 32, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Панорамные окна"], style: "Классический", landSize: "6–10 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 111, name: "Лондон-1", badge: "Жилой дом", price: "4 692 000 ₽",
    area: "120 м²", area_m2: 120, beds: 5, baths: 2, floors: 2, term: "до 3 мес.",
    rooms: "5 комнат", purpose: "ИЖС / СНТ", city: "Казань",
    maker: { ...KARKAS_POVOLZHYA, siteUrl: "https://karkasdoma.pro/projects/frame/london-1/" },
    description: "Двухэтажный каркасный дом 120 м² размером 7,5 × 10 м с панорамными окнами и террасой.",
    descriptionLong: "Проект «Лондон-1» от «Каркас Поволжья»: двухэтажный каркасный дом площадью 120 м², габариты 7,5 × 10 м. В описании проекта отмечены гостиная с большими панорамными окнами, три спальни на втором этаже, отдельный санузел и летняя терраса.",
    gallery: [
      { image: kpLondon1_1, type: "photo", fit: "contain", blur: true },
      { image: kpLondon1_2, type: "photo", fit: "contain", blur: true },
      { image: kpLondon1_3, type: "photo", fit: "contain", blur: true },
      { image: kpLondon1Plan1, type: "photo", fit: "contain" },
      { image: kpLondon1Plan2, type: "photo", fit: "contain" },
    ],
    likes: 35, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса", "Панорамные окна"], style: "Классический", landSize: "6–10 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },

  // ── Домотека · Краснодарский край ─────────────────────────────────────
  {
    id: 112, name: "Глэмпинг барнхаус 6×7", badge: "Глэмпинг", price: "11 520 000 ₽",
    area: "42 м²", area_m2: 42, beds: 3, baths: 1, floors: 1, term: "от 10 д.",
    rooms: "3 комнаты", purpose: "ИЖС / СНТ / Бизнес", city: "Краснодарский край",
    maker: { ...DOMOTEKA, siteUrl: "https://domoteka-krd.ru/karkasnye-doma/glemping/glemping-barnhaus-6x7/" },
    description: "Каркасный глэмпинг-барнхаус 42 м² размером 6 × 7 м с тремя комнатами.",
    descriptionLong: "Проект «Глэмпинг барнхаус 6×7» от «Домотеки»: одноэтажный каркасный дом площадью 42 м², габариты 6 × 7 м. Компактный формат для загородного отдыха или коммерческого размещения, на сайте производителя указана стоимость комплектации под ключ.",
    gallery: [
      { image: dtGlempingBarnhaus_1, type: "photo", fit: "contain", blur: true },
      { image: dtGlempingBarnhaus_2, type: "photo", fit: "contain", blur: true },
      { image: dtGlempingBarnhaus_3, type: "photo", fit: "contain", blur: true },
      { image: dtGlempingBarnhaus_4, type: "photo", fit: "contain", blur: true },
      { image: dtGlempingBarnhaus_5, type: "photo", fit: "contain", blur: true },
    ],
    likes: 36, rating: 4.8,
    suitableFor: ["Сдача в аренду", "Выходные / дача"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса", "Панорамные окна"], style: "Барнхаус", landSize: "3–6 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 113, name: "Париж", badge: "Жилой дом", price: "6 542 570 ₽",
    area: "229 м²", area_m2: 229, beds: 9, baths: 2, floors: 2, term: "от 10 д.",
    rooms: "9 комнат", purpose: "ИЖС", city: "Краснодарский край",
    maker: { ...DOMOTEKA, siteUrl: "https://domoteka-krd.ru/karkasnye-doma/elitnye/parizh/" },
    description: "Двухэтажный элитный каркасный дом 229 м² размером 10 × 12 м.",
    descriptionLong: "Проект «Париж» от «Домотеки»: двухэтажный каркасный дом площадью 229 м², габариты 10 × 12 м. Просторный проект для постоянного проживания большой семьи, в карточке производителя указаны девять комнат и цена комплектации под ключ.",
    gallery: [
      { image: dtParizh_1, type: "photo", fit: "contain", blur: true },
      { image: dtParizh_2, type: "photo", fit: "contain", blur: true },
      { image: dtParizh_3, type: "photo", fit: "contain", blur: true },
      { image: dtParizh_4, type: "photo", fit: "contain", blur: true },
      { image: dtParizh_5, type: "photo", fit: "contain", blur: true },
    ],
    likes: 34, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Панорамные окна"], style: "Классический", landSize: "10+ соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 114, name: "Эльбрус", badge: "Барнхаус", price: "6 447 089 ₽",
    area: "144 м²", area_m2: 144, beds: 5, baths: 2, floors: 2, term: "от 10 д.",
    rooms: "5 комнат", purpose: "ИЖС / СНТ", city: "Краснодарский край",
    maker: { ...DOMOTEKA, siteUrl: "https://domoteka-krd.ru/karkasnye-doma/barnhaus/barn-haus-6h12/" },
    description: "Двухэтажный каркасный барнхаус 144 м² размером 6 × 12 м с пятью комнатами.",
    descriptionLong: "Проект «Эльбрус» от «Домотеки»: двухэтажный каркасный барнхаус площадью 144 м², габариты 6 × 12 м. В проекте пять комнат, выразительное панорамное остекление и стоимость комплектации под ключ по данным сайта производителя.",
    gallery: [
      { image: dtElbrus_1, type: "photo", fit: "contain", blur: true },
      { image: dtElbrus_2, type: "photo", fit: "contain", blur: true },
      { image: dtElbrus_3, type: "photo", fit: "contain", blur: true },
      { image: dtElbrus_4, type: "photo", fit: "contain", blur: true },
      { image: dtElbrus_5, type: "photo", fit: "contain", blur: true },
    ],
    likes: 35, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Панорамные окна"], style: "Барнхаус", landSize: "6–10 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 115, name: "Глэмпинг, А-Фрейм 6×6", badge: "A-Frame", price: "5 950 000 ₽",
    area: "48 м²", area_m2: 48, beds: 2, baths: 1, floors: 2, term: "от 10 д.",
    rooms: "2 комнаты", purpose: "ИЖС / СНТ / Бизнес", city: "Краснодарский край",
    maker: { ...DOMOTEKA, siteUrl: "https://domoteka-krd.ru/karkasnye-doma/glemping/glemping-a-frejm-6x6/" },
    description: "Двухэтажный каркасный A-Frame 48 м² размером 6 × 6 м для глэмпинга и отдыха.",
    descriptionLong: "Проект «Глэмпинг, А-Фрейм 6×6» от «Домотеки»: двухэтажный каркасный A-Frame площадью 48 м², габариты 6 × 6 м. Проект рассчитан на загородный отдых или коммерческий глэмпинг, с панорамным остеклением и ценой под ключ на сайте производителя.",
    gallery: [
      { image: dtAFrame_1, type: "photo", fit: "contain", blur: true },
      { image: dtAFrame_2, type: "photo", fit: "contain", blur: true },
      { image: dtAFrame_3, type: "photo", fit: "contain", blur: true },
      { image: dtAFrame_4, type: "photo", fit: "contain", blur: true },
      { image: dtAFrame_5, type: "photo", fit: "contain", blur: true },
    ],
    likes: 33, rating: 4.8,
    suitableFor: ["Сдача в аренду", "Выходные / дача"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Панорамные окна"], style: "A-Frame", landSize: "3–6 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 116, name: "Фишт", badge: "Барнхаус", price: "5 317 231 ₽",
    area: "108 м²", area_m2: 108, beds: 4, baths: 2, floors: 2, term: "от 10 д.",
    rooms: "4 комнаты", purpose: "ИЖС / СНТ", city: "Краснодарский край",
    maker: { ...DOMOTEKA, siteUrl: "https://domoteka-krd.ru/karkasnye-doma/barnhaus/barn-haus-6h9-2/" },
    description: "Двухэтажный каркасный барнхаус 108 м² размером 6 × 9 м с четырьмя комнатами.",
    descriptionLong: "Проект «Фишт» от «Домотеки»: двухэтажный каркасный барнхаус площадью 108 м², габариты 6 × 9 м. В карточке производителя указаны четыре комнаты, современная архитектура с панорамным остеклением и стоимость комплектации под ключ.",
    gallery: [
      { image: dtFisht_1, type: "photo", fit: "contain", blur: true },
      { image: dtFisht_2, type: "photo", fit: "contain", blur: true },
      { image: dtFisht_3, type: "photo", fit: "contain", blur: true },
      { image: dtFisht_4, type: "photo", fit: "contain", blur: true },
      { image: dtFisht_5, type: "photo", fit: "contain", blur: true },
    ],
    likes: 34, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Панорамные окна"], style: "Барнхаус", landSize: "6–10 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  // ── СК «Свой» · Санкт-Петербург и ЛО ───────────────────────────────────
  {
    id: 117, name: "СВОЙ 199", badge: "Хит", price: "4 761 449 ₽",
    area: "90 м²", area_m2: 90, beds: 2, baths: 1, floors: 1, term: "от 1 мес.",
    rooms: "2 спальни", purpose: "ИЖС / СНТ", city: "Санкт-Петербург и ЛО",
    maker: { ...SVOI_HOUSE, siteUrl: "https://svoi.house/catalog/svoi-199" },
    description: "Каркасный дом СВОЙ 199 90 м² размером 9×9 от производителя СК «Свой». В проекте отмечены: терраса, панорамные окна.",
    descriptionLong: "Каркасный дом СВОЙ 199 90 м² размером 9×9 от производителя СК «Свой». В проекте отмечены: терраса, панорамные окна. Площадь проекта 90 м², габариты 9×9, 2 спальни, 1 санузел. Кнопка перехода ведёт на страницу проекта на сайте производителя.",
    gallery: [
      { image: shSvoy199_1, type: "photo", fit: "contain", blur: true },
      { image: shSvoy199_2, type: "photo", fit: "contain", blur: true },
    ],
    likes: 30, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса", "Панорамные окна"], style: "Современный", landSize: "6–10 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 118, name: "СВОЙ ЛАЙТ 001", badge: "Жилой дом", price: "1 992 154 ₽",
    area: "41 м²", area_m2: 41, beds: 1, baths: 1, floors: 1, term: "от 1 мес.",
    rooms: "1 спальня", purpose: "ИЖС / СНТ", city: "Санкт-Петербург и ЛО",
    maker: { ...SVOI_HOUSE, siteUrl: "https://svoi.house/catalog/svoi-light-001" },
    description: "Каркасный дом СВОЙ ЛАЙТ 001 41 м² размером 6×6 от производителя СК «Свой». В проекте отмечены: компактный формат.",
    descriptionLong: "Каркасный дом СВОЙ ЛАЙТ 001 41 м² размером 6×6 от производителя СК «Свой». В проекте отмечены: компактный формат. Площадь проекта 41 м², габариты 6×6, 1 спальня, 1 санузел. Кнопка перехода ведёт на страницу проекта на сайте производителя.",
    gallery: [
      { image: shSvoyLayt001_1, type: "photo", fit: "contain", blur: true },
      { image: shSvoyLayt001_2, type: "photo", fit: "contain", blur: true },
    ],
    likes: 31, rating: 4.8,
    suitableFor: ["Выходные / дача", "Для пары"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Компактный формат"], style: "Скандинавский", landSize: "3–6 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 119, name: "СВОЙ 100", badge: "Хит", price: "4 192 040 ₽",
    area: "86 м²", area_m2: 86, beds: 2, baths: 1, floors: 1, term: "от 1 мес.",
    rooms: "2 спальни", purpose: "ИЖС / СНТ", city: "Санкт-Петербург и ЛО",
    maker: { ...SVOI_HOUSE, siteUrl: "https://svoi.house/catalog/svoi-100" },
    description: "Каркасный дом СВОЙ 100 86 м² размером 10×7 от производителя СК «Свой». В проекте отмечены: терраса, панорамные окна.",
    descriptionLong: "Каркасный дом СВОЙ 100 86 м² размером 10×7 от производителя СК «Свой». В проекте отмечены: терраса, панорамные окна. Площадь проекта 86 м², габариты 10×7, 2 спальни, 1 санузел. Кнопка перехода ведёт на страницу проекта на сайте производителя.",
    gallery: [
      { image: shSvoy100_1, type: "photo", fit: "contain", blur: true },
      { image: shSvoy100_2, type: "photo", fit: "contain", blur: true },
    ],
    likes: 32, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса", "Панорамные окна"], style: "Современный", landSize: "6–10 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 120, name: "СВОЙ ЛАЙТ 004", badge: "Жилой дом", price: "2 944 795 ₽",
    area: "67 м²", area_m2: 67, beds: 2, baths: 1, floors: 1, term: "от 1 мес.",
    rooms: "2 спальни", purpose: "ИЖС / СНТ", city: "Санкт-Петербург и ЛО",
    maker: { ...SVOI_HOUSE, siteUrl: "https://svoi.house/catalog/svoi-light-004" },
    description: "Каркасный дом СВОЙ ЛАЙТ 004 67 м² размером 9×6 от производителя СК «Свой». В проекте отмечены: терраса.",
    descriptionLong: "Каркасный дом СВОЙ ЛАЙТ 004 67 м² размером 9×6 от производителя СК «Свой». В проекте отмечены: терраса. Площадь проекта 67 м², габариты 9×6, 2 спальни, 1 санузел. Кнопка перехода ведёт на страницу проекта на сайте производителя.",
    gallery: [
      { image: shSvoyLayt004_1, type: "photo", fit: "contain", blur: true },
      { image: shSvoyLayt004_2, type: "photo", fit: "contain", blur: true },
    ],
    likes: 33, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса"], style: "Скандинавский", landSize: "6–10 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 121, name: "СВОЙ 102 M", badge: "Хит", price: "6 237 084 ₽",
    area: "123 м²", area_m2: 123, beds: 3, baths: 2, floors: 1, term: "от 1 мес.",
    rooms: "3 спальни", purpose: "ИЖС / СНТ", city: "Санкт-Петербург и ЛО",
    maker: { ...SVOI_HOUSE, siteUrl: "https://svoi.house/catalog/svoi-102" },
    description: "Каркасный дом СВОЙ 102 M 123 м² размером 12×8 от производителя СК «Свой». В проекте отмечены: терраса, панорамные окна.",
    descriptionLong: "Каркасный дом СВОЙ 102 M 123 м² размером 12×8 от производителя СК «Свой». В проекте отмечены: терраса, панорамные окна. Площадь проекта 123 м², габариты 12×8, 3 спальни, 2 санузла. Кнопка перехода ведёт на страницу проекта на сайте производителя.",
    gallery: [
      { image: shSvoy102M_1, type: "photo", fit: "contain", blur: true },
      { image: shSvoy102M_2, type: "photo", fit: "contain", blur: true },
    ],
    likes: 34, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для большой семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса", "Панорамные окна"], style: "Современный", landSize: "10+ соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },

  // ── Багров Строй · Санкт-Петербург и ЛО ────────────────────────────────
  {
    id: 122, name: "9х15 Дионис", badge: "Жилой дом", price: "1 670 000 ₽",
    area: "141 м²", area_m2: 141, beds: 4, baths: 1, floors: 1, term: "от 1 мес.",
    rooms: "4 спальни", purpose: "ИЖС / СНТ", city: "Санкт-Петербург и ЛО",
    maker: { ...BAGROVSTROY, siteUrl: "https://bagrovstroy.ru/karkasnye-doma/kd-dionis" },
    description: "Каркасный дом 9х15 Дионис 141 м² размером 9×15 от производителя «Багров Строй». В проекте отмечены: терраса.",
    descriptionLong: "Каркасный дом 9х15 Дионис 141 м² размером 9×15 от производителя «Багров Строй». В проекте отмечены: терраса. Площадь проекта 141 м², габариты 9×15, 4 спальни, 1 санузел. Кнопка перехода ведёт на страницу проекта на сайте производителя.",
    gallery: [
      { image: bs9h15Dionis_1, type: "photo", fit: "contain", blur: true },
      { image: bs9h15Dionis_2, type: "photo", fit: "contain", blur: true },
      { image: bs9h15Dionis_3, type: "photo", fit: "contain", blur: true },
      { image: bs9h15Dionis_4, type: "photo", fit: "contain", blur: true },
      { image: bs9h15Dionis_5, type: "photo", fit: "contain", blur: true },
    ],
    likes: 35, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для большой семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса"], style: "Классический", landSize: "10+ соток",
    hasRealPhotos: true, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 123, name: "9х15 Садко", badge: "Жилой дом", price: "1 450 800 ₽",
    area: "141 м²", area_m2: 141, beds: 4, baths: 1, floors: 1, term: "от 1 мес.",
    rooms: "4 спальни", purpose: "ИЖС / СНТ", city: "Санкт-Петербург и ЛО",
    maker: { ...BAGROVSTROY, siteUrl: "https://bagrovstroy.ru/karkasnye-doma/kd-sadko" },
    description: "Каркасный дом 9х15 Садко 141 м² размером 9×15 от производителя «Багров Строй». В проекте отмечены: терраса.",
    descriptionLong: "Каркасный дом 9х15 Садко 141 м² размером 9×15 от производителя «Багров Строй». В проекте отмечены: терраса. Площадь проекта 141 м², габариты 9×15, 4 спальни, 1 санузел. Кнопка перехода ведёт на страницу проекта на сайте производителя.",
    gallery: [
      { image: bs9h15Sadko_1, type: "photo", fit: "contain", blur: true },
      { image: bs9h15Sadko_2, type: "photo", fit: "contain", blur: true },
      { image: bs9h15Sadko_3, type: "photo", fit: "contain", blur: true },
      { image: bs9h15Sadko_4, type: "photo", fit: "contain", blur: true },
      { image: bs9h15Sadko_5, type: "photo", fit: "contain", blur: true },
    ],
    likes: 36, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для большой семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса"], style: "Классический", landSize: "10+ соток",
    hasRealPhotos: true, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 124, name: "10.5х11 Август", badge: "Жилой дом", price: "1 321 100 ₽",
    area: "132 м²", area_m2: 132, beds: 4, baths: 1, floors: 1, term: "от 1 мес.",
    rooms: "4 спальни", purpose: "ИЖС / СНТ", city: "Санкт-Петербург и ЛО",
    maker: { ...BAGROVSTROY, siteUrl: "https://bagrovstroy.ru/karkasnye-doma/kd-avgust" },
    description: "Каркасный дом 10.5х11 Август 132 м² размером 10.5×11 от производителя «Багров Строй». В проекте отмечены: терраса.",
    descriptionLong: "Каркасный дом 10.5х11 Август 132 м² размером 10.5×11 от производителя «Багров Строй». В проекте отмечены: терраса. Площадь проекта 132 м², габариты 10.5×11, 4 спальни, 1 санузел. Кнопка перехода ведёт на страницу проекта на сайте производителя.",
    gallery: [
      { image: bs105h11Avgust_1, type: "photo", fit: "contain", blur: true },
      { image: bs105h11Avgust_2, type: "photo", fit: "contain", blur: true },
      { image: bs105h11Avgust_3, type: "photo", fit: "contain", blur: true },
      { image: bs105h11Avgust_4, type: "photo", fit: "contain", blur: true },
      { image: bs105h11Avgust_5, type: "photo", fit: "contain", blur: true },
    ],
    likes: 37, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для большой семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса"], style: "Классический", landSize: "10+ соток",
    hasRealPhotos: true, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 125, name: "6х8 Савелий", badge: "Жилой дом", price: "886 000 ₽",
    area: "82 м²", area_m2: 82, beds: 4, baths: 2, floors: 2, term: "от 1 мес.",
    rooms: "4 спальни", purpose: "ИЖС / СНТ", city: "Санкт-Петербург и ЛО",
    maker: { ...BAGROVSTROY, siteUrl: "https://bagrovstroy.ru/karkasnye-doma/kd-savelij" },
    description: "Каркасный дом 6х8 Савелий 82 м² размером 6×8 от производителя «Багров Строй». В проекте отмечены: терраса.",
    descriptionLong: "Каркасный дом 6х8 Савелий 82 м² размером 6×8 от производителя «Багров Строй». В проекте отмечены: терраса. Площадь проекта 82 м², габариты 6×8, 4 спальни, 2 санузла. Кнопка перехода ведёт на страницу проекта на сайте производителя.",
    gallery: [
      { image: bs6h8Saveliy_1, type: "photo", fit: "contain", blur: true },
      { image: bs6h8Saveliy_2, type: "photo", fit: "contain", blur: true },
      { image: bs6h8Saveliy_3, type: "photo", fit: "contain", blur: true },
      { image: bs6h8Saveliy_4, type: "photo", fit: "contain", blur: true },
      { image: bs6h8Saveliy_5, type: "photo", fit: "contain", blur: true },
    ],
    likes: 38, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса"], style: "Классический", landSize: "6–10 соток",
    hasRealPhotos: true, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 126, name: "7х9 Гостимир", badge: "Жилой дом", price: "1 204 500 ₽",
    area: "118 м²", area_m2: 118, beds: 3, baths: 2, floors: 2, term: "от 1 мес.",
    rooms: "3 спальни", purpose: "ИЖС / СНТ", city: "Санкт-Петербург и ЛО",
    maker: { ...BAGROVSTROY, siteUrl: "https://bagrovstroy.ru/karkasnye-doma/kd-gostimir" },
    description: "Каркасный дом 7х9 Гостимир 118 м² размером 7×9 от производителя «Багров Строй». В проекте отмечены: терраса.",
    descriptionLong: "Каркасный дом 7х9 Гостимир 118 м² размером 7×9 от производителя «Багров Строй». В проекте отмечены: терраса. Площадь проекта 118 м², габариты 7×9, 3 спальни, 2 санузла. Кнопка перехода ведёт на страницу проекта на сайте производителя.",
    gallery: [
      { image: bs7h9Gostimir_1, type: "photo", fit: "contain", blur: true },
      { image: bs7h9Gostimir_2, type: "photo", fit: "contain", blur: true },
      { image: bs7h9Gostimir_3, type: "photo", fit: "contain", blur: true },
      { image: bs7h9Gostimir_4, type: "photo", fit: "contain", blur: true },
      { image: bs7h9Gostimir_5, type: "photo", fit: "contain", blur: true },
    ],
    likes: 39, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса"], style: "Классический", landSize: "6–10 соток",
    hasRealPhotos: true, hasShowroom: false, hasInstallment: false,
  },

  // ── ДомаКаркас · Санкт-Петербург и ЛО ──────────────────────────────────
  {
    id: 127, name: "КД-120", badge: "Жилой дом", price: "3 063 000 ₽",
    area: "130 м²", area_m2: 130, beds: 3, baths: 2, floors: 1, term: "от 2 мес.",
    rooms: "3 спальни", purpose: "ИЖС / СНТ", city: "Санкт-Петербург и ЛО",
    maker: { ...DOMAKARKAS, siteUrl: "https://domakarkas.ru/proekty-karkasnyh-domov/kd-120/" },
    description: "Каркасный дом КД-120 130 м² размером 14.5×9 от производителя «ДомаКаркас». В проекте отмечены: терраса, панорамные окна, сауна.",
    descriptionLong: "Каркасный дом КД-120 130 м² размером 14.5×9 от производителя «ДомаКаркас». В проекте отмечены: терраса, панорамные окна, сауна. Площадь проекта 130 м², габариты 14.5×9, 3 спальни, 2 санузла. Кнопка перехода ведёт на страницу проекта на сайте производителя.",
    gallery: [
      { image: dkKd120_1, type: "photo", fit: "contain", blur: true },
      { image: dkKd120_2, type: "photo", fit: "contain", blur: true },
      { image: dkKd120_3, type: "photo", fit: "contain", blur: true },
      { image: dkKd120_4, type: "photo", fit: "contain", blur: true },
      { image: dkKd120_5, type: "photo", fit: "contain", blur: true },
    ],
    likes: 40, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для большой семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса", "Панорамные окна", "Сауна"], style: "Современный", landSize: "10+ соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 128, name: "КД-119", badge: "Жилой дом", price: "3 560 000 ₽",
    area: "126 м²", area_m2: 126, beds: 3, baths: 1, floors: 1, term: "от 2 мес.",
    rooms: "3 спальни", purpose: "ИЖС / СНТ", city: "Санкт-Петербург и ЛО",
    maker: { ...DOMAKARKAS, siteUrl: "https://domakarkas.ru/proekty-karkasnyh-domov/kd-119/" },
    description: "Каркасный дом КД-119 126 м² размером 14×9 от производителя «ДомаКаркас». В проекте отмечены: терраса.",
    descriptionLong: "Каркасный дом КД-119 126 м² размером 14×9 от производителя «ДомаКаркас». В проекте отмечены: терраса. Площадь проекта 126 м², габариты 14×9, 3 спальни, 1 санузел. Кнопка перехода ведёт на страницу проекта на сайте производителя.",
    gallery: [
      { image: dkKd119_1, type: "photo", fit: "contain", blur: true },
      { image: dkKd119_2, type: "photo", fit: "contain", blur: true },
      { image: dkKd119_3, type: "photo", fit: "contain", blur: true },
      { image: dkKd119_4, type: "photo", fit: "contain", blur: true },
      { image: dkKd119_5, type: "photo", fit: "contain", blur: true },
    ],
    likes: 41, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для большой семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса"], style: "Современный", landSize: "10+ соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 129, name: "КД-118", badge: "Жилой дом", price: "3 329 000 ₽",
    area: "117 м²", area_m2: 117, beds: 3, baths: 1, floors: 1, term: "от 2 мес.",
    rooms: "3 спальни", purpose: "ИЖС / СНТ", city: "Санкт-Петербург и ЛО",
    maker: { ...DOMAKARKAS, siteUrl: "https://domakarkas.ru/proekty-karkasnyh-domov/kd-118/" },
    description: "Каркасный дом КД-118 117 м² размером 13×9 от производителя «ДомаКаркас». В проекте отмечены: терраса.",
    descriptionLong: "Каркасный дом КД-118 117 м² размером 13×9 от производителя «ДомаКаркас». В проекте отмечены: терраса. Площадь проекта 117 м², габариты 13×9, 3 спальни, 1 санузел. Кнопка перехода ведёт на страницу проекта на сайте производителя.",
    gallery: [
      { image: dkKd118_1, type: "photo", fit: "contain", blur: true },
      { image: dkKd118_2, type: "photo", fit: "contain", blur: true },
      { image: dkKd118_3, type: "photo", fit: "contain", blur: true },
      { image: dkKd118_4, type: "photo", fit: "contain", blur: true },
      { image: dkKd118_5, type: "photo", fit: "contain", blur: true },
    ],
    likes: 42, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса"], style: "Современный", landSize: "6–10 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 130, name: "КД-117", badge: "Новинка", price: "2 912 000 ₽",
    area: "126 м²", area_m2: 126, beds: 3, baths: 1, floors: 1, term: "от 2 мес.",
    rooms: "3 спальни", purpose: "ИЖС / СНТ", city: "Санкт-Петербург и ЛО",
    maker: { ...DOMAKARKAS, siteUrl: "https://domakarkas.ru/proekty-karkasnyh-domov/kd-117/" },
    description: "Каркасный дом КД-117 126 м² размером 14×9 от производителя «ДомаКаркас». В проекте отмечены: терраса, панорамные окна, второй свет.",
    descriptionLong: "Каркасный дом КД-117 126 м² размером 14×9 от производителя «ДомаКаркас». В проекте отмечены: терраса, панорамные окна, второй свет. Площадь проекта 126 м², габариты 14×9, 3 спальни, 1 санузел. Кнопка перехода ведёт на страницу проекта на сайте производителя.",
    gallery: [
      { image: dkKd117_1, type: "photo", fit: "contain", blur: true },
      { image: dkKd117_2, type: "photo", fit: "contain", blur: true },
      { image: dkKd117_3, type: "photo", fit: "contain", blur: true },
      { image: dkKd117_4, type: "photo", fit: "contain", blur: true },
      { image: dkKd117_5, type: "photo", fit: "contain", blur: true },
    ],
    likes: 30, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для большой семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса", "Панорамные окна", "Второй свет"], style: "Современный", landSize: "10+ соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 131, name: "КД-116", badge: "Новинка", price: "2 739 000 ₽",
    area: "108 м²", area_m2: 108, beds: 3, baths: 1, floors: 1, term: "от 2 мес.",
    rooms: "3 спальни", purpose: "ИЖС / СНТ", city: "Санкт-Петербург и ЛО",
    maker: { ...DOMAKARKAS, siteUrl: "https://domakarkas.ru/proekty-karkasnyh-domov/kd-116/" },
    description: "Каркасный дом КД-116 108 м² размером 13.5×8 от производителя «ДомаКаркас». В проекте отмечены: терраса, второй свет.",
    descriptionLong: "Каркасный дом КД-116 108 м² размером 13.5×8 от производителя «ДомаКаркас». В проекте отмечены: терраса, второй свет. Площадь проекта 108 м², габариты 13.5×8, 3 спальни, 1 санузел. Кнопка перехода ведёт на страницу проекта на сайте производителя.",
    gallery: [
      { image: dkKd116_1, type: "photo", fit: "contain", blur: true },
      { image: dkKd116_2, type: "photo", fit: "contain", blur: true },
      { image: dkKd116_3, type: "photo", fit: "contain", blur: true },
      { image: dkKd116_4, type: "photo", fit: "contain", blur: true },
      { image: dkKd116_5, type: "photo", fit: "contain", blur: true },
    ],
    likes: 31, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса", "Второй свет"], style: "Современный", landSize: "6–10 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },

  // ── СК Гармония · Санкт-Петербург и ЛО ─────────────────────────────────
  {
    id: 132, name: "Вязьма", badge: "Хит", price: "3 732 000 ₽",
    area: "120 м²", area_m2: 120, beds: 3, baths: 2, floors: 2, term: "от 2 мес.",
    rooms: "3 спальни", purpose: "ИЖС / СНТ", city: "Санкт-Петербург и ЛО",
    maker: { ...SK_GARMONIYA, siteUrl: "https://skgarmoniya.ru/catalog/doma-karkas/vyazma/" },
    description: "Каркасный дом Вязьма 120 м² размером 7.5×9 от производителя СК «Гармония». В проекте отмечены: панорамные окна.",
    descriptionLong: "Каркасный дом Вязьма 120 м² размером 7.5×9 от производителя СК «Гармония». В проекте отмечены: панорамные окна. Площадь проекта 120 м², габариты 7.5×9, 3 спальни, 2 санузла. Кнопка перехода ведёт на страницу проекта на сайте производителя.",
    gallery: [
      { image: sgVyazma_1, type: "photo", fit: "contain", blur: true },
      { image: sgVyazma_2, type: "photo", fit: "contain", blur: true },
      { image: sgVyazma_3, type: "photo", fit: "contain", blur: true },
      { image: sgVyazma_4, type: "photo", fit: "contain", blur: true },
      { image: sgVyazma_5, type: "photo", fit: "contain", blur: true },
    ],
    likes: 32, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для большой семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Панорамные окна"], style: "Скандинавский", landSize: "10+ соток",
    hasRealPhotos: true, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 133, name: "Сосновый бор", badge: "Хит", price: "по запросу",
    area: "99 м²", area_m2: 99, beds: 3, baths: 1, floors: 1, term: "от 2 мес.",
    rooms: "3 спальни", purpose: "ИЖС / СНТ", city: "Санкт-Петербург и ЛО",
    maker: { ...SK_GARMONIYA, siteUrl: "https://skgarmoniya.ru/catalog/doma-karkas/sosnovyy-bor/" },
    description: "Каркасный дом Сосновый бор 99 м² размером 8×14 от производителя СК «Гармония». В проекте отмечены: второй свет.",
    descriptionLong: "Каркасный дом Сосновый бор 99 м² размером 8×14 от производителя СК «Гармония». В проекте отмечены: второй свет. Площадь проекта 99 м², габариты 8×14, 3 спальни, 1 санузел. Кнопка перехода ведёт на страницу проекта на сайте производителя.",
    gallery: [
      { image: sgSosnovyyBor_1, type: "photo", fit: "contain", blur: true },
      { image: sgSosnovyyBor_2, type: "photo", fit: "contain", blur: true },
      { image: sgSosnovyyBor_3, type: "photo", fit: "contain", blur: true },
      { image: sgSosnovyyBor_4, type: "photo", fit: "contain", blur: true },
      { image: sgSosnovyyBor_5, type: "photo", fit: "contain", blur: true },
    ],
    likes: 33, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Второй свет"], style: "Скандинавский", landSize: "6–10 соток",
    hasRealPhotos: true, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 134, name: "Троицк", badge: "Хит", price: "2 288 000 ₽",
    area: "54 м²", area_m2: 54, beds: 2, baths: 1, floors: 1, term: "от 2 мес.",
    rooms: "2 спальни", purpose: "ИЖС / СНТ", city: "Санкт-Петербург и ЛО",
    maker: { ...SK_GARMONIYA, siteUrl: "https://skgarmoniya.ru/catalog/doma-karkas/troiczk/" },
    description: "Каркасный дом Троицк 54 м² размером 6×9 от производителя СК «Гармония». В проекте отмечены: терраса.",
    descriptionLong: "Каркасный дом Троицк 54 м² размером 6×9 от производителя СК «Гармония». В проекте отмечены: терраса. Площадь проекта 54 м², габариты 6×9, 2 спальни, 1 санузел. Кнопка перехода ведёт на страницу проекта на сайте производителя.",
    gallery: [
      { image: sgTroitsk_1, type: "photo", fit: "contain", blur: true },
      { image: sgTroitsk_2, type: "photo", fit: "contain", blur: true },
      { image: sgTroitsk_3, type: "photo", fit: "contain", blur: true },
      { image: sgTroitsk_4, type: "photo", fit: "contain", blur: true },
      { image: sgTroitsk_5, type: "photo", fit: "contain", blur: true },
    ],
    likes: 34, rating: 4.8,
    suitableFor: ["Выходные / дача", "Для пары"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса"], style: "Скандинавский", landSize: "3–6 соток",
    hasRealPhotos: true, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 135, name: "Выборг", badge: "Новинка", price: "по запросу",
    area: "105 м²", area_m2: 105, beds: 3, baths: 2, floors: 1, term: "от 2 мес.",
    rooms: "3 спальни", purpose: "ИЖС / СНТ", city: "Санкт-Петербург и ЛО",
    maker: { ...SK_GARMONIYA, siteUrl: "https://skgarmoniya.ru/catalog/doma-karkas/vyborg/" },
    description: "Каркасный дом Выборг 105 м² размером 13×9 от производителя СК «Гармония». В проекте отмечены: панорамные окна.",
    descriptionLong: "Каркасный дом Выборг 105 м² размером 13×9 от производителя СК «Гармония». В проекте отмечены: панорамные окна. Площадь проекта 105 м², габариты 13×9, 3 спальни, 2 санузла. Кнопка перехода ведёт на страницу проекта на сайте производителя.",
    gallery: [
      { image: sgVyborg_1, type: "photo", fit: "contain", blur: true },
      { image: sgVyborg_2, type: "photo", fit: "contain", blur: true },
      { image: sgVyborg_3, type: "photo", fit: "contain", blur: true },
      { image: sgVyborg_4, type: "photo", fit: "contain", blur: true },
      { image: sgVyborg_5, type: "photo", fit: "contain", blur: true },
    ],
    likes: 35, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Панорамные окна"], style: "Скандинавский", landSize: "6–10 соток",
    hasRealPhotos: true, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 136, name: "Самара", badge: "Жилой дом", price: "3 920 000 ₽",
    area: "152 м²", area_m2: 152, beds: 4, baths: 2, floors: 2, term: "от 2 мес.",
    rooms: "4 спальни", purpose: "ИЖС / СНТ", city: "Санкт-Петербург и ЛО",
    maker: { ...SK_GARMONIYA, siteUrl: "https://skgarmoniya.ru/catalog/doma-karkas/samara/" },
    description: "Каркасный дом Самара 152 м² размером 8×9.5 от производителя СК «Гармония». В проекте отмечены: терраса.",
    descriptionLong: "Каркасный дом Самара 152 м² размером 8×9.5 от производителя СК «Гармония». В проекте отмечены: терраса. Площадь проекта 152 м², габариты 8×9.5, 4 спальни, 2 санузла. Кнопка перехода ведёт на страницу проекта на сайте производителя.",
    gallery: [
      { image: sgSamara_1, type: "photo", fit: "contain", blur: true },
      { image: sgSamara_2, type: "photo", fit: "contain", blur: true },
      { image: sgSamara_3, type: "photo", fit: "contain", blur: true },
      { image: sgSamara_4, type: "photo", fit: "contain", blur: true },
      { image: sgSamara_5, type: "photo", fit: "contain", blur: true },
    ],
    likes: 36, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для большой семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса"], style: "Скандинавский", landSize: "10+ соток",
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

export const cities = ["Москва и МО", "Санкт-Петербург и ЛО", "Краснодарский край", "Казань", "Екатеринбург", "Пермский край"];
