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
import makerPlatformaLogo from "@/assets/maker-platforma.webp";
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
import ksBigl_1 from "@/assets/kazanstroy16/bigl/1.webp";
import ksBigl_2 from "@/assets/kazanstroy16/bigl/2.webp";
import ksBigl_3 from "@/assets/kazanstroy16/bigl/3.webp";
import ksBigl_4 from "@/assets/kazanstroy16/bigl/4.webp";
import ksBigl_5 from "@/assets/kazanstroy16/bigl/5.webp";
import ksBiglPlan1 from "@/assets/kazanstroy16/bigl/6.webp";
import ksBiglPlan2 from "@/assets/kazanstroy16/bigl/7.webp";
import ksDiotima_1 from "@/assets/kazanstroy16/diotima/1.webp";
import ksDiotima_2 from "@/assets/kazanstroy16/diotima/2.webp";
import ksDiotimaPlan1 from "@/assets/kazanstroy16/diotima/3.webp";
import ksDiotimaPlan2 from "@/assets/kazanstroy16/diotima/4.webp";
import ksGlenapp_1 from "@/assets/kazanstroy16/glenapp/1.webp";
import ksGlenapp_2 from "@/assets/kazanstroy16/glenapp/2.webp";
import ksGlenappPlan1 from "@/assets/kazanstroy16/glenapp/3.webp";
import ksGlenappPlan2 from "@/assets/kazanstroy16/glenapp/4.webp";
import ksGlenappPlan3 from "@/assets/kazanstroy16/glenapp/5.webp";
import ksStrakeya_1 from "@/assets/kazanstroy16/strakeya/1.webp";
import ksStrakeya_2 from "@/assets/kazanstroy16/strakeya/2.webp";
import ksStrakeyaPlan1 from "@/assets/kazanstroy16/strakeya/3.webp";
import ksStrakeya_3 from "@/assets/kazanstroy16/strakeya/4.webp";
import ksStrakeya_4 from "@/assets/kazanstroy16/strakeya/5.webp";
import ksStrakeya_5 from "@/assets/kazanstroy16/strakeya/6.webp";
import ksStrakeyaPlan2 from "@/assets/kazanstroy16/strakeya/7.webp";
import ksIzabella_1 from "@/assets/kazanstroy16/izabella/1.webp";
import ksIzabella_2 from "@/assets/kazanstroy16/izabella/2.webp";
import ksIzabella_3 from "@/assets/kazanstroy16/izabella/3.webp";
import ksIzabellaPlan1 from "@/assets/kazanstroy16/izabella/4.webp";
import ksIzabellaPlan2 from "@/assets/kazanstroy16/izabella/5.webp";
import ahNovaPrime_1 from "@/assets/askhome/nova-prime/1.webp";
import ahNovaPrime_2 from "@/assets/askhome/nova-prime/2.webp";
import ahNovaPrime_3 from "@/assets/askhome/nova-prime/3.webp";
import ahNovaPrime_4 from "@/assets/askhome/nova-prime/4.webp";
import ahNovaPrime_5 from "@/assets/askhome/nova-prime/5.webp";
import ahNova_1 from "@/assets/askhome/nova/1.webp";
import ahNova_2 from "@/assets/askhome/nova/2.webp";
import ahNova_3 from "@/assets/askhome/nova/3.webp";
import ahNova_4 from "@/assets/askhome/nova/4.webp";
import ahNova_5 from "@/assets/askhome/nova/5.webp";
import ahModeraPrime_1 from "@/assets/askhome/modera-prime/1.webp";
import ahModeraPrimePlan from "@/assets/askhome/modera-prime/2.webp";
import ahModeraPrime_2 from "@/assets/askhome/modera-prime/3.webp";
import ahModeraPrime_3 from "@/assets/askhome/modera-prime/4.webp";
import ahModeraPrime_4 from "@/assets/askhome/modera-prime/5.webp";
import ahModera_1 from "@/assets/askhome/modera/1.webp";
import ahModeraPlan from "@/assets/askhome/modera/2.webp";
import ahModera_2 from "@/assets/askhome/modera/3.webp";
import ahModera_3 from "@/assets/askhome/modera/4.webp";
import ahModera_4 from "@/assets/askhome/modera/5.webp";
import ahAstraPrime_1 from "@/assets/askhome/astra-prime/1.webp";
import ahAstraPrimePlan from "@/assets/askhome/astra-prime/2.webp";
import ahAstraPrime_2 from "@/assets/askhome/astra-prime/3.webp";
import ahAstraPrime_3 from "@/assets/askhome/astra-prime/4.webp";
import ahAstraPrime_4 from "@/assets/askhome/astra-prime/5.webp";
import kdyShale67_1 from "@/assets/karkas-dom-yug/shale-67/1.webp";
import kdyShale69_1 from "@/assets/karkas-dom-yug/shale-69/1.webp";
import kdyShale65_1 from "@/assets/karkas-dom-yug/shale-65/1.webp";
import kdyShale82_1 from "@/assets/karkas-dom-yug/shale-82/1.webp";
import kdyShale90_1 from "@/assets/karkas-dom-yug/shale-90/1.webp";
import sbBarn28_1 from "@/assets/sibiryak/barn-28/1.webp";
import sbBarn28_2 from "@/assets/sibiryak/barn-28/2.webp";
import sbBarn28_3 from "@/assets/sibiryak/barn-28/3.webp";
import sbBarn28Plan1 from "@/assets/sibiryak/barn-28/4.webp";
import sbBarn28Plan2 from "@/assets/sibiryak/barn-28/5.webp";
import sbBarn41_1 from "@/assets/sibiryak/barn-41/1.webp";
import sbBarn41_2 from "@/assets/sibiryak/barn-41/2.webp";
import sbBarn41_3 from "@/assets/sibiryak/barn-41/3.webp";
import sbBarn41_4 from "@/assets/sibiryak/barn-41/4.webp";
import sbBarn41_5 from "@/assets/sibiryak/barn-41/5.webp";
import sbBarn47_1 from "@/assets/sibiryak/barn-47/1.webp";
import sbBarn47_2 from "@/assets/sibiryak/barn-47/2.webp";
import sbBarn47_3 from "@/assets/sibiryak/barn-47/3.webp";
import sbBarn47_4 from "@/assets/sibiryak/barn-47/4.webp";
import sbBarn47_5 from "@/assets/sibiryak/barn-47/5.webp";
import sbBarn95_1 from "@/assets/sibiryak/barn-95/1.webp";
import sbBarn95_2 from "@/assets/sibiryak/barn-95/2.webp";
import sbBarn95_3 from "@/assets/sibiryak/barn-95/3.webp";
import sbBarn95_4 from "@/assets/sibiryak/barn-95/4.webp";
import sbBarn95Plan from "@/assets/sibiryak/barn-95/5.webp";
import sbBarn120_1 from "@/assets/sibiryak/barn-120/1.webp";
import sbBarn120_2 from "@/assets/sibiryak/barn-120/2.webp";
import sbBarn120_3 from "@/assets/sibiryak/barn-120/3.webp";
import sbBarn120_4 from "@/assets/sibiryak/barn-120/4.webp";
import sbBarn120_5 from "@/assets/sibiryak/barn-120/5.webp";
import mihKulibin_1 from "@/assets/doma-ot-mihalycha/kulibin/1.webp";
import mihKulibin_2 from "@/assets/doma-ot-mihalycha/kulibin/2.webp";
import mihKulibin_3 from "@/assets/doma-ot-mihalycha/kulibin/3.webp";
import mihKulibinPlan from "@/assets/doma-ot-mihalycha/kulibin/4.webp";
import mihLomonosov_1 from "@/assets/doma-ot-mihalycha/lomonosov/1.webp";
import mihLomonosov_2 from "@/assets/doma-ot-mihalycha/lomonosov/2.webp";
import mihLomonosov_3 from "@/assets/doma-ot-mihalycha/lomonosov/3.webp";
import mihLomonosovPlan1 from "@/assets/doma-ot-mihalycha/lomonosov/4.webp";
import mihLomonosovPlan2 from "@/assets/doma-ot-mihalycha/lomonosov/5.webp";
import mihRakhmaninov_1 from "@/assets/doma-ot-mihalycha/rakhmaninov/1.webp";
import mihRakhmaninov_2 from "@/assets/doma-ot-mihalycha/rakhmaninov/2.webp";
import mihRakhmaninov_3 from "@/assets/doma-ot-mihalycha/rakhmaninov/3.webp";
import mihRakhmaninovPlan from "@/assets/doma-ot-mihalycha/rakhmaninov/4.webp";
import mihDerzhavin_1 from "@/assets/doma-ot-mihalycha/derzhavin/1.webp";
import mihDerzhavin_2 from "@/assets/doma-ot-mihalycha/derzhavin/2.webp";
import mihDerzhavin_3 from "@/assets/doma-ot-mihalycha/derzhavin/3.webp";
import mihDerzhavinPlan1 from "@/assets/doma-ot-mihalycha/derzhavin/4.webp";
import mihDerzhavinPlan2 from "@/assets/doma-ot-mihalycha/derzhavin/5.webp";
import mihVinogradov_1 from "@/assets/doma-ot-mihalycha/vinogradov/1.webp";
import mihVinogradov_2 from "@/assets/doma-ot-mihalycha/vinogradov/2.webp";
import mihVinogradov_3 from "@/assets/doma-ot-mihalycha/vinogradov/3.webp";
import mihVinogradovPlan from "@/assets/doma-ot-mihalycha/vinogradov/4.webp";
import bsOpti_1 from "@/assets/barnstudio/opti/1.webp";
import bsOpti_2 from "@/assets/barnstudio/opti/2.webp";
import bsOpti_3 from "@/assets/barnstudio/opti/3.webp";
import bsOpti_4 from "@/assets/barnstudio/opti/4.webp";
import bsOpti_5 from "@/assets/barnstudio/opti/5.webp";
import bsOpti_6 from "@/assets/barnstudio/opti/6.webp";
import bsOptiPlan from "@/assets/barnstudio/opti/7.webp";
import bsAdel_1 from "@/assets/barnstudio/adel/1.webp";
import bsAdel_2 from "@/assets/barnstudio/adel/2.webp";
import bsAdel_3 from "@/assets/barnstudio/adel/3.webp";
import bsAdel_4 from "@/assets/barnstudio/adel/4.webp";
import bsAdel_5 from "@/assets/barnstudio/adel/5.webp";
import bsAdel_6 from "@/assets/barnstudio/adel/6.webp";
import bsAdelPlan from "@/assets/barnstudio/adel/7.webp";
import bsAlpina_1 from "@/assets/barnstudio/alpina/1.webp";
import bsAlpina_2 from "@/assets/barnstudio/alpina/2.webp";
import bsAlpina_3 from "@/assets/barnstudio/alpina/3.webp";
import bsAlpina_4 from "@/assets/barnstudio/alpina/4.webp";
import bsAlpina_5 from "@/assets/barnstudio/alpina/5.webp";
import bsAlpina_6 from "@/assets/barnstudio/alpina/6.webp";
import bsAlpinaPlan from "@/assets/barnstudio/alpina/7.webp";
import bsAntresol_1 from "@/assets/barnstudio/antresol/1.webp";
import bsAntresol_2 from "@/assets/barnstudio/antresol/2.webp";
import bsAntresol_3 from "@/assets/barnstudio/antresol/3.webp";
import bsAntresol_4 from "@/assets/barnstudio/antresol/4.webp";
import bsAntresol_5 from "@/assets/barnstudio/antresol/5.webp";
import bsAntresol_6 from "@/assets/barnstudio/antresol/6.webp";
import bsAntresolPlan from "@/assets/barnstudio/antresol/7.webp";
import bsVizhn_1 from "@/assets/barnstudio/vizhn/1.webp";
import bsVizhn_2 from "@/assets/barnstudio/vizhn/2.webp";
import bsVizhn_3 from "@/assets/barnstudio/vizhn/3.webp";
import bsVizhn_4 from "@/assets/barnstudio/vizhn/4.webp";
import bsVizhn_5 from "@/assets/barnstudio/vizhn/5.webp";
import bsVizhn_6 from "@/assets/barnstudio/vizhn/6.webp";
import bsVizhnPlan from "@/assets/barnstudio/vizhn/7.webp";
import bdValdaj_1 from "@/assets/beli-dom/valdaj/1.webp";
import bdValdaj_2 from "@/assets/beli-dom/valdaj/2.webp";
import bdValdaj_3 from "@/assets/beli-dom/valdaj/3.webp";
import bdValdaj_4 from "@/assets/beli-dom/valdaj/4.webp";
import bdValdaj_5 from "@/assets/beli-dom/valdaj/5.webp";
import bdValdaj_6 from "@/assets/beli-dom/valdaj/6.webp";
import bdValdajPlan from "@/assets/beli-dom/valdaj/plan-1.webp";
import bdSemejnyj_1 from "@/assets/beli-dom/semejnyj/1.webp";
import bdSemejnyj_2 from "@/assets/beli-dom/semejnyj/2.webp";
import bdSemejnyj_3 from "@/assets/beli-dom/semejnyj/3.webp";
import bdSemejnyj_4 from "@/assets/beli-dom/semejnyj/4.webp";
import bdSemejnyj_5 from "@/assets/beli-dom/semejnyj/5.webp";
import bdSemejnyj_6 from "@/assets/beli-dom/semejnyj/6.webp";
import bdSemejnyjPlan1 from "@/assets/beli-dom/semejnyj/plan-1.webp";
import bdSemejnyjPlan2 from "@/assets/beli-dom/semejnyj/plan-2.webp";
import bdTradicziya_1 from "@/assets/beli-dom/tradicziya/1.webp";
import bdTradicziya_2 from "@/assets/beli-dom/tradicziya/2.webp";
import bdTradicziya_3 from "@/assets/beli-dom/tradicziya/3.webp";
import bdTradicziya_4 from "@/assets/beli-dom/tradicziya/4.webp";
import bdTradicziya_5 from "@/assets/beli-dom/tradicziya/5.webp";
import bdTradicziyaPlan1 from "@/assets/beli-dom/tradicziya/plan-1.webp";
import bdTradicziyaPlan2 from "@/assets/beli-dom/tradicziya/plan-2.webp";
import bdKarolina_1 from "@/assets/beli-dom/karolina/1.webp";
import bdKarolina_2 from "@/assets/beli-dom/karolina/2.webp";
import bdKarolina_3 from "@/assets/beli-dom/karolina/3.webp";
import bdKarolina_4 from "@/assets/beli-dom/karolina/4.webp";
import bdKarolina_5 from "@/assets/beli-dom/karolina/5.webp";
import bdKarolinaPlan1 from "@/assets/beli-dom/karolina/plan-1.webp";
import bdKarolinaPlan2 from "@/assets/beli-dom/karolina/plan-2.webp";
import bdTriumf_1 from "@/assets/beli-dom/triumf/1.webp";
import bdTriumf_2 from "@/assets/beli-dom/triumf/2.webp";
import bdTriumfPlan from "@/assets/beli-dom/triumf/plan-1.webp";

// МастерГруппБарнаул
import mgbAngliya_1 from "@/assets/mastergrupp-barnaul/angliya/01.webp";
import mgbAngliya_2 from "@/assets/mastergrupp-barnaul/angliya/02.webp";
import mgbAngliya_3 from "@/assets/mastergrupp-barnaul/angliya/03.webp";
import mgbAngliya_4 from "@/assets/mastergrupp-barnaul/angliya/04.webp";
import mgbAngliya_5 from "@/assets/mastergrupp-barnaul/angliya/05.webp";
import mgbAngliyaPlan1 from "@/assets/mastergrupp-barnaul/angliya/06.webp";
import mgbAngliyaPlan2 from "@/assets/mastergrupp-barnaul/angliya/07.webp";
import mgbKlavdiya_1 from "@/assets/mastergrupp-barnaul/klavdiya/01.webp";
import mgbKlavdiyaFoundation from "@/assets/mastergrupp-barnaul/klavdiya/02.webp";
import mgbKlavdiyaPlan from "@/assets/mastergrupp-barnaul/klavdiya/03.webp";
import mgbKlavdiyaSection from "@/assets/mastergrupp-barnaul/klavdiya/04.webp";
import mgbVud_1 from "@/assets/mastergrupp-barnaul/vud/01.webp";
import mgbVud_2 from "@/assets/mastergrupp-barnaul/vud/02.webp";
import mgbVudFoundation from "@/assets/mastergrupp-barnaul/vud/03.webp";
import mgbVudPlan from "@/assets/mastergrupp-barnaul/vud/04.webp";
import mgbVudSection from "@/assets/mastergrupp-barnaul/vud/05.webp";
import mgbBriksiya_1 from "@/assets/mastergrupp-barnaul/briksiya/01.webp";
import mgbBriksiya_2 from "@/assets/mastergrupp-barnaul/briksiya/02.webp";
import mgbBriksiyaPlan2 from "@/assets/mastergrupp-barnaul/briksiya/03.webp";
import mgbBriksiya_3 from "@/assets/mastergrupp-barnaul/briksiya/04.webp";
import mgbBriksiya_4 from "@/assets/mastergrupp-barnaul/briksiya/05.webp";
import mgbBriksiya_5 from "@/assets/mastergrupp-barnaul/briksiya/06.webp";
import mgbBriksiyaPlan1 from "@/assets/mastergrupp-barnaul/briksiya/07.webp";
import mgbBurlakov_1 from "@/assets/mastergrupp-barnaul/burlakov/01.webp";
import mgbBurlakov_2 from "@/assets/mastergrupp-barnaul/burlakov/02.webp";
import mgbBurlakov_3 from "@/assets/mastergrupp-barnaul/burlakov/03.webp";
import mgbBurlakovPlan1 from "@/assets/mastergrupp-barnaul/burlakov/04.webp";
import mgbBurlakovPlan2 from "@/assets/mastergrupp-barnaul/burlakov/05.webp";
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
import bdBogatyrLk7h9_1 from "@/assets/berest-dom/bogatyr-lk-7h9/1.webp";
import bdBogatyrLk7h9_2 from "@/assets/berest-dom/bogatyr-lk-7h9/2.webp";
import bdBogatyrLk7h9_3 from "@/assets/berest-dom/bogatyr-lk-7h9/3.webp";
import bdBogatyrLk7h9_4 from "@/assets/berest-dom/bogatyr-lk-7h9/4.webp";
import bdBogatyrLk7h9_5 from "@/assets/berest-dom/bogatyr-lk-7h9/5.webp";
import bdKareliya27h9_1 from "@/assets/berest-dom/kareliya-2-7h9/1.webp";
import bdKareliya27h9_2 from "@/assets/berest-dom/kareliya-2-7h9/2.webp";
import bdKareliya27h9_3 from "@/assets/berest-dom/kareliya-2-7h9/3.webp";
import bdKareliya27h9_4 from "@/assets/berest-dom/kareliya-2-7h9/4.webp";
import bdKareliya27h9_5 from "@/assets/berest-dom/kareliya-2-7h9/5.webp";
import bdSenator75h9_1 from "@/assets/berest-dom/senator-7-5h9/1.webp";
import bdSenator75h9_2 from "@/assets/berest-dom/senator-7-5h9/2.webp";
import bdSenator75h9_3 from "@/assets/berest-dom/senator-7-5h9/3.webp";
import bdSenator75h9_4 from "@/assets/berest-dom/senator-7-5h9/4.webp";
import bdSenator75h9_5 from "@/assets/berest-dom/senator-7-5h9/5.webp";
import bdKareliya17h8_1 from "@/assets/berest-dom/kareliya-1-7h8/1.webp";
import bdKareliya17h8_2 from "@/assets/berest-dom/kareliya-1-7h8/2.webp";
import bdKareliya17h8_3 from "@/assets/berest-dom/kareliya-1-7h8/3.webp";
import bdKareliya17h8_4 from "@/assets/berest-dom/kareliya-1-7h8/4.webp";
import bdKareliya17h8_5 from "@/assets/berest-dom/kareliya-1-7h8/5.webp";
import bdSenator285h105_1 from "@/assets/berest-dom/senator-2-8-5h10-5/1.webp";
import bdSenator285h105_2 from "@/assets/berest-dom/senator-2-8-5h10-5/2.webp";
import bdSenator285h105_3 from "@/assets/berest-dom/senator-2-8-5h10-5/3.webp";
import bdSenator285h105_4 from "@/assets/berest-dom/senator-2-8-5h10-5/4.webp";
import bdSenator285h105_5 from "@/assets/berest-dom/senator-2-8-5h10-5/5.webp";
import riftDg51_1 from "@/assets/rift/dg51/1.webp";
import riftDg51_2 from "@/assets/rift/dg51/2.webp";
import riftDg51_3 from "@/assets/rift/dg51/3.webp";
import riftDg50_1 from "@/assets/rift/dg50/1.webp";
import riftDg50_2 from "@/assets/rift/dg50/2.webp";
import riftDg50_3 from "@/assets/rift/dg50/3.webp";
import riftXx27_1 from "@/assets/rift/xx27/1.webp";
import riftXx27_2 from "@/assets/rift/xx27/2.webp";
import riftXx27_3 from "@/assets/rift/xx27/3.webp";
import riftXx27_4 from "@/assets/rift/xx27/4.webp";
import riftDg49_1 from "@/assets/rift/dg49/1.webp";
import riftDg49_2 from "@/assets/rift/dg49/2.webp";
import riftDg49_3 from "@/assets/rift/dg49/3.webp";
import riftDg49_4 from "@/assets/rift/dg49/4.webp";
import riftDg49_5 from "@/assets/rift/dg49/5.webp";
import riftXx05_1 from "@/assets/rift/xx05/1.webp";
import riftXx05_2 from "@/assets/rift/xx05/2.webp";
import riftXx05_3 from "@/assets/rift/xx05/3.webp";
import riftXx05_4 from "@/assets/rift/xx05/4.webp";
import riftXx05_5 from "@/assets/rift/xx05/5.webp";
import ibKd38_1 from "@/assets/izbrusa/kd-38/1.webp";
import ibKd38_2 from "@/assets/izbrusa/kd-38/2.webp";
import ibKd29_1 from "@/assets/izbrusa/kd-29/1.webp";
import ibKd29_2 from "@/assets/izbrusa/kd-29/2.webp";
import ibKd29_3 from "@/assets/izbrusa/kd-29/3.webp";
import ibKd29_4 from "@/assets/izbrusa/kd-29/4.webp";
import ibKd29_5 from "@/assets/izbrusa/kd-29/5.webp";
import ibKd41_1 from "@/assets/izbrusa/kd-41/1.webp";
import ibKd41_2 from "@/assets/izbrusa/kd-41/2.webp";
import ibKd12_1 from "@/assets/izbrusa/kd-12/1.webp";
import ibKd12_2 from "@/assets/izbrusa/kd-12/2.webp";
import ibKd12_3 from "@/assets/izbrusa/kd-12/3.webp";
import ibKd12_4 from "@/assets/izbrusa/kd-12/4.webp";
import ibKd12_5 from "@/assets/izbrusa/kd-12/5.webp";
import ibKd36_1 from "@/assets/izbrusa/kd-36/1.webp";
import ibKd36_2 from "@/assets/izbrusa/kd-36/2.webp";
import ibKd36_3 from "@/assets/izbrusa/kd-36/3.webp";
import ibKd36_4 from "@/assets/izbrusa/kd-36/4.webp";
import ibKd36_5 from "@/assets/izbrusa/kd-36/5.webp";

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

// Санкт-Петербург и ЛО · модульные дома
import psPraktik21_1 from "@/assets/praktika-stroy/ps-praktik-21-1.webp";
import psPraktik21_2 from "@/assets/praktika-stroy/ps-praktik-21-2.webp";
import psPraktik21_3 from "@/assets/praktika-stroy/ps-praktik-21-3.webp";
import psPraktik22_1 from "@/assets/praktika-stroy/ps-praktik-22-1.webp";
import psPraktik22_2 from "@/assets/praktika-stroy/ps-praktik-22-2.webp";
import psPraktik23_1 from "@/assets/praktika-stroy/ps-praktik-23-1.webp";
import psPraktik23_2 from "@/assets/praktika-stroy/ps-praktik-23-2.webp";
import psPraktik31_1 from "@/assets/praktika-stroy/ps-praktik-31-1.webp";
import psPraktik31_2 from "@/assets/praktika-stroy/ps-praktik-31-2.webp";
import psPraktik31_3 from "@/assets/praktika-stroy/ps-praktik-31-3.webp";
import psPraktik32_1 from "@/assets/praktika-stroy/ps-praktik-32-1.webp";
import psPraktik32_2 from "@/assets/praktika-stroy/ps-praktik-32-2.webp";
import ecMga1 from "@/assets/eco-city/ec-mga-1.webp";
import ecMga2 from "@/assets/eco-city/ec-mga-2.webp";
import ecMga3 from "@/assets/eco-city/ec-mga-3.webp";
import ecDunay1 from "@/assets/eco-city/ec-dunay-1.webp";
import ecDunay2 from "@/assets/eco-city/ec-dunay-2.webp";
import ecDunay3 from "@/assets/eco-city/ec-dunay-3.webp";
import ecLammi1 from "@/assets/eco-city/ec-lammi-1.webp";
import ecLammi2 from "@/assets/eco-city/ec-lammi-2.webp";
import ecLammi3 from "@/assets/eco-city/ec-lammi-3.webp";
import ecImatra1 from "@/assets/eco-city/ec-imatra-1.webp";
import ecImatra2 from "@/assets/eco-city/ec-imatra-2.webp";
import ecImatra3 from "@/assets/eco-city/ec-imatra-3.webp";
import ecLahti1 from "@/assets/eco-city/ec-lahti-1.webp";
import ecLahti2 from "@/assets/eco-city/ec-lahti-2.webp";
import ecLahti3 from "@/assets/eco-city/ec-lahti-3.webp";
import moUno1 from "@/assets/modom/mo-uno-1.webp";
import moUnoPlan3d from "@/assets/modom/mo-uno-plan3d.webp";
import moUnoPlan from "@/assets/modom/mo-uno-plan.webp";
import moO2S1 from "@/assets/modom/mo-o2-s-1.webp";
import moO2SPlan3d from "@/assets/modom/mo-o2-s-plan3d.webp";
import moO2SPlan from "@/assets/modom/mo-o2-s-plan.webp";
import moO2M1 from "@/assets/modom/mo-o2-m-1.webp";
import moO2MPlan3d from "@/assets/modom/mo-o2-m-plan3d.webp";
import moO2MPlan from "@/assets/modom/mo-o2-m-plan.webp";
import moO2L1 from "@/assets/modom/mo-o2-l-1.webp";
import moO2LPlan3d from "@/assets/modom/mo-o2-l-plan3d.webp";
import moO2LPlan from "@/assets/modom/mo-o2-l-plan.webp";
import moO2Mini30_1 from "@/assets/modom/mo-o2-mini30-1.webp";
import moO2Mini30Plan3d from "@/assets/modom/mo-o2-mini30-plan3d.webp";
import moO2Mini30Plan from "@/assets/modom/mo-o2-mini30-plan.webp";
import hbStandart14_1 from "@/assets/housebox/hb-standart14-1.webp";
import hbStandart14_2 from "@/assets/housebox/hb-standart14-2.webp";
import hbStandart14_3 from "@/assets/housebox/hb-standart14-3.webp";
import hbStandart14m_1 from "@/assets/housebox/hb-standart14m-1.webp";
import hbStandart14m_2 from "@/assets/housebox/hb-standart14m-2.webp";
import hbStandart19_1 from "@/assets/housebox/hb-standart19-1.webp";
import hbStandart19_2 from "@/assets/housebox/hb-standart19-2.webp";
import hbStandart19_3 from "@/assets/housebox/hb-standart19-3.webp";

// Екатеринбург · модульные дома
import gl835_1 from "@/assets/glavles/gl-8-35/01.webp";
import gl835_2 from "@/assets/glavles/gl-8-35/02.webp";
import gl835_3 from "@/assets/glavles/gl-8-35/03.webp";
import gl835Plan1 from "@/assets/glavles/gl-8-35/04.webp";
import gl835Plan2 from "@/assets/glavles/gl-8-35/05.webp";
import gl835Plan3 from "@/assets/glavles/gl-8-35/06.webp";
import gl827_1 from "@/assets/glavles/gl-8-27/01.webp";
import gl827_2 from "@/assets/glavles/gl-8-27/02.webp";
import gl827_3 from "@/assets/glavles/gl-8-27/03.webp";
import gl827Plan1 from "@/assets/glavles/gl-8-27/04.webp";
import gl827Plan2 from "@/assets/glavles/gl-8-27/05.webp";
import gl827Plan3 from "@/assets/glavles/gl-8-27/06.webp";
import gl825_1 from "@/assets/glavles/gl-8-25/01.webp";
import gl825_2 from "@/assets/glavles/gl-8-25/02.webp";
import gl825_3 from "@/assets/glavles/gl-8-25/03.webp";
import gl825Plan1 from "@/assets/glavles/gl-8-25/04.webp";
import gl825Plan2 from "@/assets/glavles/gl-8-25/05.webp";
import gl825Plan3 from "@/assets/glavles/gl-8-25/06.webp";
import gl868_1 from "@/assets/glavles/gl-8-68/01.webp";
import gl868_2 from "@/assets/glavles/gl-8-68/02.webp";
import gl868_3 from "@/assets/glavles/gl-8-68/03.webp";
import gl868Plan1 from "@/assets/glavles/gl-8-68/04.webp";
import gl868Plan2 from "@/assets/glavles/gl-8-68/05.webp";
import gl868Plan3 from "@/assets/glavles/gl-8-68/06.webp";
import gl887_1 from "@/assets/glavles/gl-8-87/01.webp";
import gl887_2 from "@/assets/glavles/gl-8-87/02.webp";
import gl887_3 from "@/assets/glavles/gl-8-87/03.webp";
import gl887Plan1 from "@/assets/glavles/gl-8-87/04.webp";
import gl887Plan2 from "@/assets/glavles/gl-8-87/05.webp";
import gl887Plan3 from "@/assets/glavles/gl-8-87/06.webp";
import fpsAh281_1 from "@/assets/fps-modul/ah-281/01.webp";
import fpsAh281Plan1 from "@/assets/fps-modul/ah-281/02.webp";
import fpsAh281Plan2 from "@/assets/fps-modul/ah-281/03.webp";
import fpsAh313_1 from "@/assets/fps-modul/ah-313/01.webp";
import fpsAh313Plan from "@/assets/fps-modul/ah-313/02.webp";
import fpsAh313_2 from "@/assets/fps-modul/ah-313/03.webp";
import fpsBh411_1 from "@/assets/fps-modul/bh-411/01.webp";
import fpsBh411Plan1 from "@/assets/fps-modul/bh-411/02.webp";
import fpsBh411Plan2 from "@/assets/fps-modul/bh-411/03.webp";
import fpsBh412_1 from "@/assets/fps-modul/bh-412/01.webp";
import fpsBh412Plan1 from "@/assets/fps-modul/bh-412/02.webp";
import fpsBh412Plan2 from "@/assets/fps-modul/bh-412/03.webp";
import fpsBh403_1 from "@/assets/fps-modul/bh-403/01.webp";
import fpsBh403Plan1 from "@/assets/fps-modul/bh-403/02.webp";
import fpsBh403Plan2 from "@/assets/fps-modul/bh-403/03.webp";
import vtM98_1 from "@/assets/vek-trad/m-98/01.webp";
import vtM98_2 from "@/assets/vek-trad/m-98/02.webp";
import vtM98_3 from "@/assets/vek-trad/m-98/03.webp";
import vtM85_1 from "@/assets/vek-trad/m-85/01.webp";
import vtM85_2 from "@/assets/vek-trad/m-85/02.webp";
import vtM85_3 from "@/assets/vek-trad/m-85/03.webp";
import vtM73_1 from "@/assets/vek-trad/m-73/01.webp";
import vtM73_2 from "@/assets/vek-trad/m-73/02.webp";
import vtM73_3 from "@/assets/vek-trad/m-73/03.webp";
import vtM60_1 from "@/assets/vek-trad/m-60/01.webp";
import vtM60_2 from "@/assets/vek-trad/m-60/02.webp";
import vtM60_3 from "@/assets/vek-trad/m-60/03.webp";
import bdHitech45_1 from "@/assets/budushiy-dom/hitech-45/01.webp";
import bdHitech45_2 from "@/assets/budushiy-dom/hitech-45/02.webp";
import bdHitech45_3 from "@/assets/budushiy-dom/hitech-45/03.webp";
import bdHitech36_1 from "@/assets/budushiy-dom/hitech-36/01.webp";
import bdHitech36_2 from "@/assets/budushiy-dom/hitech-36/02.webp";
import bdHitech36_3 from "@/assets/budushiy-dom/hitech-36/03.webp";
import bdBarn60f_1 from "@/assets/budushiy-dom/barn-60f/01.webp";
import bdBarn60f_2 from "@/assets/budushiy-dom/barn-60f/02.webp";
import bdBarn60f_3 from "@/assets/budushiy-dom/barn-60f/03.webp";
import bdDom8_1 from "@/assets/budushiy-dom/dom-8/01.webp";
import bdDom8_2 from "@/assets/budushiy-dom/dom-8/02.webp";
import bdDom8_3 from "@/assets/budushiy-dom/dom-8/03.webp";
import bdModual75_1 from "@/assets/budushiy-dom/modual-75/01.webp";
import bdModual75_2 from "@/assets/budushiy-dom/modual-75/02.webp";
import bdModual75_3 from "@/assets/budushiy-dom/modual-75/03.webp";
import qubQ_1 from "@/assets/qubdom/q/01.webp";
import qubQ_2 from "@/assets/qubdom/q/02.webp";
import qubQ_3 from "@/assets/qubdom/q/03.webp";
import qubQPlan from "@/assets/qubdom/q/04.webp";
import qubQPlus_1 from "@/assets/qubdom/q-plus/01.webp";
import qubQPlus_2 from "@/assets/qubdom/q-plus/02.webp";
import qubQPlus_3 from "@/assets/qubdom/q-plus/03.webp";
import qubQPlusPlan1 from "@/assets/qubdom/q-plus/04.webp";
import qubQPlusPlan2 from "@/assets/qubdom/q-plus/05.webp";
import qubQFamilyMini_1 from "@/assets/qubdom/q-family-mini/01.webp";
import qubQFamilyMini_2 from "@/assets/qubdom/q-family-mini/02.webp";
import qubQFamilyMini_3 from "@/assets/qubdom/q-family-mini/03.webp";
import qubQFamilyMiniPlan1 from "@/assets/qubdom/q-family-mini/04.webp";
import qubQFamilyMiniPlan2 from "@/assets/qubdom/q-family-mini/05.webp";
import qubQFamilyMax_1 from "@/assets/qubdom/q-family-max/01.webp";
import qubQFamilyMax_2 from "@/assets/qubdom/q-family-max/02.webp";
import qubQFamilyMax_3 from "@/assets/qubdom/q-family-max/03.webp";
import qubQFamilyMaxPlan from "@/assets/qubdom/q-family-max/04.webp";
import qubQTambour_1 from "@/assets/qubdom/q-s-tamburom/01.webp";
import qubQTambour_2 from "@/assets/qubdom/q-s-tamburom/02.webp";
import qubQTambour_3 from "@/assets/qubdom/q-s-tamburom/03.webp";
import qubQTambourPlan from "@/assets/qubdom/q-s-tamburom/04.webp";
import durovLogo from "@/assets/durov-house/logo.webp";
import durovBarn21_1 from "@/assets/durov-house/barn-dh21/01.webp";
import durovBarn21Plan1 from "@/assets/durov-house/barn-dh21/02-plan.webp";
import durovBarn21Plan2 from "@/assets/durov-house/barn-dh21/03-plan.webp";
import durovBarn21Plan3 from "@/assets/durov-house/barn-dh21/04-plan.webp";
import durovBarn21Plan4 from "@/assets/durov-house/barn-dh21/05-plan.webp";
import durovBarn57_1 from "@/assets/durov-house/barn-dh57/01.webp";
import durovBarn57_2 from "@/assets/durov-house/barn-dh57/02.webp";
import durovBarn57_3 from "@/assets/durov-house/barn-dh57/03.webp";
import durovBarn57Plan from "@/assets/durov-house/barn-dh57/04-plan.webp";
import durovBarn64_1 from "@/assets/durov-house/barn-dh64/01.webp";
import durovBarn64_2 from "@/assets/durov-house/barn-dh64/02.webp";
import durovBarn64_3 from "@/assets/durov-house/barn-dh64/03.webp";
import durovBarn64Plan from "@/assets/durov-house/barn-dh64/04-plan.webp";
import durovFlat67_1 from "@/assets/durov-house/flat-dh67/01.webp";
import durovFlat67_2 from "@/assets/durov-house/flat-dh67/02.webp";
import durovFlat67_3 from "@/assets/durov-house/flat-dh67/03.webp";
import durovFlat67Plan from "@/assets/durov-house/flat-dh67/04-plan.webp";
import durovFlat124_1 from "@/assets/durov-house/flat-dh124/01.webp";
import durovFlat124_2 from "@/assets/durov-house/flat-dh124/02.webp";
import durovFlat124_3 from "@/assets/durov-house/flat-dh124/03.webp";
import durovFlat124Plan from "@/assets/durov-house/flat-dh124/04-plan.webp";
import histhutLogo from "@/assets/histhut/logo.webp";
import histhutHizhina8_1 from "@/assets/histhut/hizhina-8/01.webp";
import histhutHizhina8_2 from "@/assets/histhut/hizhina-8/02.webp";
import histhutHizhina8_3 from "@/assets/histhut/hizhina-8/03.webp";
import histhutHizhina8Plan from "@/assets/histhut/hizhina-8/04-plan.webp";
import histhutHizhina10_1 from "@/assets/histhut/hizhina-10/01.webp";
import histhutHizhina10_2 from "@/assets/histhut/hizhina-10/02.webp";
import histhutHizhina10_3 from "@/assets/histhut/hizhina-10/03.webp";
import histhutHizhina10Plan from "@/assets/histhut/hizhina-10/04-plan.webp";
import histhutHizhina12_1 from "@/assets/histhut/hizhina-12/01.webp";
import histhutHizhina12_2 from "@/assets/histhut/hizhina-12/02.webp";
import histhutHizhina12_3 from "@/assets/histhut/hizhina-12/03.webp";
import histhutHizhina12Plan from "@/assets/histhut/hizhina-12/04-plan.webp";
import histhutHizhina20_1 from "@/assets/histhut/hizhina-20/01.webp";
import histhutHizhina20_2 from "@/assets/histhut/hizhina-20/02.webp";
import histhutHizhina20_3 from "@/assets/histhut/hizhina-20/03.webp";
import histhutHizhina20Plan from "@/assets/histhut/hizhina-20/04-plan.webp";
import histhutHizhina25_1 from "@/assets/histhut/hizhina-25/01.webp";
import histhutHizhina25_2 from "@/assets/histhut/hizhina-25/02.webp";
import histhutHizhina25_3 from "@/assets/histhut/hizhina-25/03.webp";
import histhutHizhina25Plan from "@/assets/histhut/hizhina-25/04-plan.webp";
import countryhouseLogo from "@/assets/countryhouse/logo.webp";
import countryhouseHitechM1_1 from "@/assets/countryhouse/hitech-m1/01.webp";
import countryhouseHitechM1_2 from "@/assets/countryhouse/hitech-m1/02.webp";
import countryhouseHitechM1_3 from "@/assets/countryhouse/hitech-m1/03.webp";
import countryhouseHitechM1Plan from "@/assets/countryhouse/hitech-m1/04-plan.webp";
import countryhouseHitechM15_1 from "@/assets/countryhouse/hitech-m15/01.webp";
import countryhouseHitechM15_2 from "@/assets/countryhouse/hitech-m15/02.webp";
import countryhouseHitechM15_3 from "@/assets/countryhouse/hitech-m15/03.webp";
import countryhouseHitechM15Plan from "@/assets/countryhouse/hitech-m15/04-plan.webp";
import countryhouseHitechM2_1 from "@/assets/countryhouse/hitech-m2/01.webp";
import countryhouseHitechM2_2 from "@/assets/countryhouse/hitech-m2/02.webp";
import countryhouseHitechM2_3 from "@/assets/countryhouse/hitech-m2/03.webp";
import countryhouseHitechM2Plan from "@/assets/countryhouse/hitech-m2/04-plan.webp";
import countryhouseHitechM3_1 from "@/assets/countryhouse/hitech-m3/01.webp";
import countryhouseHitechM3_2 from "@/assets/countryhouse/hitech-m3/02.webp";
import countryhouseHitechM3_3 from "@/assets/countryhouse/hitech-m3/03.webp";
import countryhouseHitechM3Plan from "@/assets/countryhouse/hitech-m3/04-plan.webp";
import countryhouseHitechM5_1 from "@/assets/countryhouse/hitech-m5/01.webp";
import countryhouseHitechM5_2 from "@/assets/countryhouse/hitech-m5/02.webp";
import countryhouseHitechM5_3 from "@/assets/countryhouse/hitech-m5/03.webp";
import countryhouseHitechM5Plan from "@/assets/countryhouse/hitech-m5/04-plan.webp";
import cubadomLogo from "@/assets/cubadom/logo.webp";
import cubadomCuba351_1 from "@/assets/cubadom/cuba-35-1/01.webp";
import cubadomCuba351Plan1 from "@/assets/cubadom/cuba-35-1/02-plan.webp";
import cubadomCuba351Plan2 from "@/assets/cubadom/cuba-35-1/03-plan.webp";
import cubadomCuba351Plan3 from "@/assets/cubadom/cuba-35-1/04-plan.webp";
import cubadomCuba352_1 from "@/assets/cubadom/cuba-35-2/01.webp";
import cubadomCuba352Plan1 from "@/assets/cubadom/cuba-35-2/02-plan.webp";
import cubadomCuba352Plan2 from "@/assets/cubadom/cuba-35-2/03-plan.webp";
import cubadomCuba352Plan3 from "@/assets/cubadom/cuba-35-2/04-plan.webp";
import cubadomCuba531_1 from "@/assets/cubadom/cuba-53-1/01.webp";
import cubadomCuba531Plan1 from "@/assets/cubadom/cuba-53-1/02-plan.webp";
import cubadomCuba531Plan2 from "@/assets/cubadom/cuba-53-1/03-plan.webp";
import cubadomCuba531Plan3 from "@/assets/cubadom/cuba-53-1/04-plan.webp";
import cubadomCuba532_1 from "@/assets/cubadom/cuba-53-2/01.webp";
import cubadomCuba532Plan1 from "@/assets/cubadom/cuba-53-2/02-plan.webp";
import cubadomCuba532Plan2 from "@/assets/cubadom/cuba-53-2/03-plan.webp";
import cubadomCuba532Plan3 from "@/assets/cubadom/cuba-53-2/04-plan.webp";
import cubadomCuba701_1 from "@/assets/cubadom/cuba-70-1/01.webp";
import cubadomCuba701Plan1 from "@/assets/cubadom/cuba-70-1/02-plan.webp";
import cubadomCuba701Plan2 from "@/assets/cubadom/cuba-70-1/03-plan.webp";
import cubadomCuba701Plan3 from "@/assets/cubadom/cuba-70-1/04-plan.webp";
import idolhouseLogo from "@/assets/idolhouse/logo.webp";
import idolhouse36_1 from "@/assets/idolhouse/modul-nyy-dom-aydolhaus-36/01.webp";
import idolhouse36Plan from "@/assets/idolhouse/modul-nyy-dom-aydolhaus-36/02.webp";
import idolhouse47_1 from "@/assets/idolhouse/modul-nyy-dom-aydolhaus-47/01.webp";
import idolhouse47Plan from "@/assets/idolhouse/modul-nyy-dom-aydolhaus-47/02.webp";
import idolhouse62_1 from "@/assets/idolhouse/modul-nyy-dom-aydolhaus-62/01.webp";
import idolhouse62Plan from "@/assets/idolhouse/modul-nyy-dom-aydolhaus-62/02.webp";
import idolhouse72_1 from "@/assets/idolhouse/modul-nyy-dom-aydolhaus-72/01.webp";
import idolhouse72Plan from "@/assets/idolhouse/modul-nyy-dom-aydolhaus-72/02.webp";
import idolhouse86_1 from "@/assets/idolhouse/modul-nyy-dom-aydolhaus-86/01.webp";
import idolhouse86Plan from "@/assets/idolhouse/modul-nyy-dom-aydolhaus-86/02.webp";
import woodalpLogo from "@/assets/woodalp/logo.webp";
import woodhouse60_1 from "@/assets/woodalp/woodhouse-60-pro/01.webp";
import woodhouse60_2 from "@/assets/woodalp/woodhouse-60-pro/02.webp";
import woodhouse90_1 from "@/assets/woodalp/woodhouse-90-pro/01.webp";
import woodhouse90_2 from "@/assets/woodalp/woodhouse-90-pro/02.webp";
import woodhouse120_1 from "@/assets/woodalp/woodhouse-120-pro/01.webp";
import woodhouse120_2 from "@/assets/woodalp/woodhouse-120-pro/02.webp";
import boxmateLogo from "@/assets/boxmate/logo.webp";
import boxmateFlat5_1 from "@/assets/boxmate/flat-5-box/01.webp";
import boxmateFlat4_1 from "@/assets/boxmate/flat-4-box/01.webp";
import boxmateFlat3_1 from "@/assets/boxmate/flat-3-box/01.webp";
import boxmateFlat3Plan from "@/assets/boxmate/flat-3-box/02.webp";
import boxmateRed5_1 from "@/assets/boxmate/red-5-box/01.webp";
import boxmateRed4_1 from "@/assets/boxmate/red-4-box/01.webp";
import uvhouseLogo from "@/assets/uvhouse/logo.webp";
import uvhouseMono30_1 from "@/assets/uvhouse/mono-30/01.webp";
import uvhouseMono30Plan from "@/assets/uvhouse/mono-30/02.webp";
import uvhouseScandi32_1 from "@/assets/uvhouse/skandi-32/01.webp";
import uvhouseScandi32Plan from "@/assets/uvhouse/skandi-32/02.webp";
import uvhouseNord40_1 from "@/assets/uvhouse/nord-40/01.webp";
import uvhouseNord40_2 from "@/assets/uvhouse/nord-40/02.webp";
import uvhouseNord40Plan from "@/assets/uvhouse/nord-40/03.webp";
import uvhouseShale24_1 from "@/assets/uvhouse/shale-24/01.webp";
import uvhouseShale24_2 from "@/assets/uvhouse/shale-24/02.webp";
import uvhouseShale24Plan from "@/assets/uvhouse/shale-24/03.webp";
import uvhouseScandi40_1 from "@/assets/uvhouse/skandi-40/01.webp";
import uvhouseScandi40_2 from "@/assets/uvhouse/skandi-40/02.webp";
import uvhouseScandi40Plan from "@/assets/uvhouse/skandi-40/03.webp";
import asteriusLogo from "@/assets/asterius/logo.webp";
import asteriusAltair20_1 from "@/assets/asterius/altair-20/01.webp";
import asteriusAltair20_2 from "@/assets/asterius/altair-20/02.webp";
import asteriusAltair20Plan from "@/assets/asterius/altair-20/03-plan.webp";
import asteriusAltair30_1 from "@/assets/asterius/altair-30/01.webp";
import asteriusAltair30_2 from "@/assets/asterius/altair-30/02.webp";
import asteriusAltair30Plan from "@/assets/asterius/altair-30/03-plan.webp";
import asteriusAntares40_1 from "@/assets/asterius/antares-40/01.webp";
import asteriusAntares40_2 from "@/assets/asterius/antares-40/02.webp";
import asteriusAntares40Plan from "@/assets/asterius/antares-40/03-plan.webp";
import asteriusAntares60_1 from "@/assets/asterius/antares-60/01.webp";
import asteriusAntares60_2 from "@/assets/asterius/antares-60/02.webp";
import asteriusAntares60Plan from "@/assets/asterius/antares-60/03-plan.webp";
import asteriusAntares80_1 from "@/assets/asterius/antares-80/01.webp";
import asteriusAntares80_2 from "@/assets/asterius/antares-80/02.webp";
import asteriusAntares80Plan from "@/assets/asterius/antares-80/03-plan.webp";
import smolaLogo from "@/assets/smola/logo.webp";
import smola103_1 from "@/assets/smola/smola-103/01.webp";
import smola103_2 from "@/assets/smola/smola-103/02.webp";
import smola103Plan from "@/assets/smola/smola-103/03-plan.webp";
import smola65_1 from "@/assets/smola/smola-65/01.webp";
import smola65_2 from "@/assets/smola/smola-65/02.webp";
import smola65Plan from "@/assets/smola/smola-65/03-plan.webp";
import smola77_1 from "@/assets/smola/smola-77/01.webp";
import smola77_2 from "@/assets/smola/smola-77/02.webp";
import smola77Plan from "@/assets/smola/smola-77/03-plan.webp";
import smola43_1 from "@/assets/smola/smola-43/01.webp";
import smola43_2 from "@/assets/smola/smola-43/02.webp";
import smola43Plan from "@/assets/smola/smola-43/03-plan.webp";
import ultradomspbLogo from "@/assets/ultradomspb/logo.webp";
import ultra36_1 from "@/assets/ultradomspb/ultra-36/01.webp";
import ultra54_1 from "@/assets/ultradomspb/ultra-54/01.webp";
import ultra72_1 from "@/assets/ultradomspb/ultra-72/01.webp";
import ultra65_1 from "@/assets/ultradomspb/ultra-65/01.webp";
import ultra65_2 from "@/assets/ultradomspb/ultra-65/02.webp";
import ultra65Plan from "@/assets/ultradomspb/ultra-65/03-plan.webp";
import ultra85_1 from "@/assets/ultradomspb/ultra-85/01.webp";
import ultra85_2 from "@/assets/ultradomspb/ultra-85/02.webp";
import ultra85Plan from "@/assets/ultradomspb/ultra-85/03-plan.webp";
import freedomLogo from "@/assets/freedom/logo.webp";
import freedomRelax_1 from "@/assets/freedom/home-relaxation/01.webp";
import freedomRelax_2 from "@/assets/freedom/home-relaxation/02.webp";
import freedomPrivacy_1 from "@/assets/freedom/home-privacy/01.webp";
import freedomPrivacy_2 from "@/assets/freedom/home-privacy/02.webp";
import freedomMobile_1 from "@/assets/freedom/mobile-home/01.webp";
import freedomMobile_2 from "@/assets/freedom/mobile-home/02.webp";
import chebwoodLogo from "@/assets/chebwood/logo.webp";
import chebwoodModul15_1 from "@/assets/chebwood/modul-15/01.webp";
import chebwoodModul15_2 from "@/assets/chebwood/modul-15/02.webp";
import chebwoodDom_1 from "@/assets/chebwood/dom-pod-kluch/01.webp";
import chebwoodGlamping_1 from "@/assets/chebwood/glamping/01.webp";
import campingdomLogo from "@/assets/campingdom/logo.webp";
import camping15_1 from "@/assets/campingdom/campingdom-15/01.webp";
import camping22_1 from "@/assets/campingdom/campingdom-22/01.webp";
import camping32_1 from "@/assets/campingdom/campingdom-32/01.webp";
import camping15Barn_1 from "@/assets/campingdom/campingdom-15-barn/01.webp";
import camping28Barn_1 from "@/assets/campingdom/campingdom-28-barn/01.webp";
import pslcompLogo from "@/assets/pslcomp/logo.webp";
import pslBarn36_1 from "@/assets/pslcomp/barn-36/01.webp";
import pslBarn36_2 from "@/assets/pslcomp/barn-36/02.webp";
import pslBarn36_3 from "@/assets/pslcomp/barn-36/03.webp";
import pslBarn36_4 from "@/assets/pslcomp/barn-36/04.webp";
import pslBarn36_5 from "@/assets/pslcomp/barn-36/05.webp";
import pslBarn36_6 from "@/assets/pslcomp/barn-36/06.webp";
import pslBarn36Plan1 from "@/assets/pslcomp/barn-36/plan-1.webp";
import pslHaytek36_1 from "@/assets/pslcomp/haytek-36/01.webp";
import pslHaytek36_2 from "@/assets/pslcomp/haytek-36/02.webp";
import pslHaytek36_3 from "@/assets/pslcomp/haytek-36/03.webp";
import pslHaytek36_4 from "@/assets/pslcomp/haytek-36/04.webp";
import pslHaytek36_5 from "@/assets/pslcomp/haytek-36/05.webp";
import pslHaytek36_6 from "@/assets/pslcomp/haytek-36/06.webp";
import pslHaytek36Plan1 from "@/assets/pslcomp/haytek-36/plan-1.webp";
import pslBarn40_1 from "@/assets/pslcomp/barn-40/01.webp";
import pslBarn40_2 from "@/assets/pslcomp/barn-40/02.webp";
import pslBarn40_3 from "@/assets/pslcomp/barn-40/03.webp";
import pslBarn40_4 from "@/assets/pslcomp/barn-40/04.webp";
import pslBarn40_5 from "@/assets/pslcomp/barn-40/05.webp";
import pslBarn40_6 from "@/assets/pslcomp/barn-40/06.webp";
import pslBarn40Plan1 from "@/assets/pslcomp/barn-40/plan-1.webp";
import pslHaytek40_1 from "@/assets/pslcomp/haytek-40/01.webp";
import pslHaytek40_2 from "@/assets/pslcomp/haytek-40/02.webp";
import pslHaytek40_3 from "@/assets/pslcomp/haytek-40/03.webp";
import pslHaytek40_4 from "@/assets/pslcomp/haytek-40/04.webp";
import pslHaytek40_5 from "@/assets/pslcomp/haytek-40/05.webp";
import pslHaytek40_6 from "@/assets/pslcomp/haytek-40/06.webp";
import pslHaytek40Plan1 from "@/assets/pslcomp/haytek-40/plan-1.webp";
import pslBarn45_1 from "@/assets/pslcomp/barn-45/01.webp";
import pslBarn45_2 from "@/assets/pslcomp/barn-45/02.webp";
import pslBarn45_3 from "@/assets/pslcomp/barn-45/03.webp";
import pslBarn45_4 from "@/assets/pslcomp/barn-45/04.webp";
import pslBarn45_5 from "@/assets/pslcomp/barn-45/05.webp";
import pslBarn45_6 from "@/assets/pslcomp/barn-45/06.webp";
import pslBarn45Plan1 from "@/assets/pslcomp/barn-45/plan-1.webp";
import pslBarn45Plan2 from "@/assets/pslcomp/barn-45/plan-2.webp";
import domnas35_1 from "@/assets/domnasm/domnas-35/01.webp";
import domnas50_1 from "@/assets/domnasm/domnas-50/01.webp";
import domnas80_1 from "@/assets/domnasm/domnas-80/01.webp";
import domnasBarn_1 from "@/assets/domnasm/barn/01.webp";
import domnasMgn_1 from "@/assets/domnasm/mgn/01.webp";
import blackmoduleLogo from "@/assets/blackmodule/logo.webp";
import blackmoduleOne_1 from "@/assets/blackmodule/one-module/01.webp";
import blackmoduleOneHalf_1 from "@/assets/blackmodule/one-half-module/01.webp";
import blackmoduleTwo_1 from "@/assets/blackmodule/two-module/01.webp";
import blackmoduleThree_1 from "@/assets/blackmodule/three-module/01.webp";
import blackmoduleFour_1 from "@/assets/blackmodule/four-module/01.webp";
import dommLogo from "@/assets/domm/logo.webp";
import dommHouse1_1 from "@/assets/domm/modul-house-1/01.webp";
import dommHouse2_1 from "@/assets/domm/modul-house-2/01.webp";
import dommHouse3_1 from "@/assets/domm/modul-house-3/01.webp";
import dommHouse4_1 from "@/assets/domm/modul-house-4/01.webp";
import dommHouse6_1 from "@/assets/domm/modul-house-6/01.webp";
import myModuleLogo from "@/assets/my-module/logo.webp";
import myModuleBarni_1 from "@/assets/my-module/barni/01.webp";
import myModuleKorner_1 from "@/assets/my-module/korner/01.webp";
import myModuleScandinavia_1 from "@/assets/my-module/scandinavia/01.webp";
import myModuleZ_1 from "@/assets/my-module/z/01.webp";
import fourModulKarelia30_1 from "@/assets/4modul/karelia-30/01.webp";
import fourModulKarelia45_1 from "@/assets/4modul/karelia-45/01.webp";
import fourModulKarelia45_2 from "@/assets/4modul/karelia-45/02.webp";
import fourModulKarelia60_1 from "@/assets/4modul/karelia-60/01.webp";
import fourModulKarelia60_2 from "@/assets/4modul/karelia-60/02.webp";
import fourModulKarelia75_1 from "@/assets/4modul/karelia-75/01.webp";
import fourModulKarelia75_2 from "@/assets/4modul/karelia-75/02.webp";
import fourModulBarn60_1 from "@/assets/4modul/barn-60/01.webp";
import cubberLogo from "@/assets/cubber/logo.webp";
import cubberHouse48_1 from "@/assets/cubber/house-48/01.webp";
import cubberHouse48Plan from "@/assets/cubber/house-48/02-plan.webp";
import cubberHouse50_1 from "@/assets/cubber/house-50/01.webp";
import cubberHouse50Plan from "@/assets/cubber/house-50/02-plan.webp";
import cubberHouse60_1 from "@/assets/cubber/house-60/01.webp";
import cubberHouse60Plan from "@/assets/cubber/house-60/02-plan.webp";
import cubberHouse65_1 from "@/assets/cubber/house-65/01.webp";
import cubberHouse65Plan from "@/assets/cubber/house-65/02-plan.webp";
import cubberHouse95t_1 from "@/assets/cubber/house-95t/01.webp";
import cubberHouse95tPlan from "@/assets/cubber/house-95t/02-plan.webp";
import simplehouseLogo from "@/assets/simplehouse/logo.webp";
import simple6_1 from "@/assets/simplehouse/simple-6/01.webp";
import simple6Plan from "@/assets/simplehouse/simple-6/02-plan.webp";
import panoramicLogo from "@/assets/panoramic-home/logo.webp";
import panoramicXl54_1 from "@/assets/panoramic-home/xl-54/01.webp";
import panoramicXl54_2 from "@/assets/panoramic-home/xl-54/02.webp";
import panoramicMax87_1 from "@/assets/panoramic-home/max-87/01.webp";
import panoramicMax87_2 from "@/assets/panoramic-home/max-87/02.webp";
import panoramicXl60_1 from "@/assets/panoramic-home/xl-60/01.webp";
import panoramicXl60_2 from "@/assets/panoramic-home/xl-60/02.webp";
import panoramicXl72_1 from "@/assets/panoramic-home/xl-72/01.webp";
import panoramicXl72_2 from "@/assets/panoramic-home/xl-72/02.webp";
import panoramicXl45_1 from "@/assets/panoramic-home/xl-45/01.webp";
import panoramicXl45_2 from "@/assets/panoramic-home/xl-45/02.webp";
import ambarnLogo from "@/assets/ambarn/logo.webp";
import ambarnBarn40_1 from "@/assets/ambarn/barn-40-lux/01.webp";
import ambarnBarn40_2 from "@/assets/ambarn/barn-40-lux/02.webp";
import ambarnBarn40_3 from "@/assets/ambarn/barn-40-lux/03.webp";
import ambarnBarn40_4 from "@/assets/ambarn/barn-40-lux/04.webp";
import ambarnBarn40_5 from "@/assets/ambarn/barn-40-lux/05.webp";
import ambarnBarn40_6 from "@/assets/ambarn/barn-40-lux/06.webp";
import ambarnBarn40Plan1 from "@/assets/ambarn/barn-40-lux/plan-1.webp";
import ambarnIndigo30_1 from "@/assets/ambarn/indigo-30/01.webp";
import ambarnIndigo30_2 from "@/assets/ambarn/indigo-30/02.webp";
import ambarnIndigo30_3 from "@/assets/ambarn/indigo-30/03.webp";
import ambarnIndigo30_4 from "@/assets/ambarn/indigo-30/04.webp";
import ambarnIndigo30_5 from "@/assets/ambarn/indigo-30/05.webp";
import ambarnIndigo30_6 from "@/assets/ambarn/indigo-30/06.webp";
import ambarnIndigo30Plan1 from "@/assets/ambarn/indigo-30/plan-1.webp";
import ambarnIndigo40_1 from "@/assets/ambarn/indigo-40/01.webp";
import ambarnIndigo40_2 from "@/assets/ambarn/indigo-40/02.webp";
import ambarnIndigo40_3 from "@/assets/ambarn/indigo-40/03.webp";
import ambarnIndigo40_4 from "@/assets/ambarn/indigo-40/04.webp";
import ambarnIndigo40_5 from "@/assets/ambarn/indigo-40/05.webp";
import ambarnIndigo40_6 from "@/assets/ambarn/indigo-40/06.webp";
import ambarnIndigo40Plan1 from "@/assets/ambarn/indigo-40/plan-1.webp";
import ambarnIndigo50_1 from "@/assets/ambarn/indigo-50/01.webp";
import ambarnIndigo50_2 from "@/assets/ambarn/indigo-50/02.webp";
import ambarnIndigo50_3 from "@/assets/ambarn/indigo-50/03.webp";
import ambarnIndigo50_4 from "@/assets/ambarn/indigo-50/04.webp";
import ambarnIndigo50_5 from "@/assets/ambarn/indigo-50/05.webp";
import ambarnIndigo50_6 from "@/assets/ambarn/indigo-50/06.webp";
import ambarnIndigo50Plan1 from "@/assets/ambarn/indigo-50/plan-1.webp";
import ambarnIndigo36_1 from "@/assets/ambarn/indigo-36/01.webp";
import ambarnIndigo36_2 from "@/assets/ambarn/indigo-36/02.webp";
import ambarnIndigo36_3 from "@/assets/ambarn/indigo-36/03.webp";
import ambarnIndigo36_4 from "@/assets/ambarn/indigo-36/04.webp";
import ambarnIndigo36_5 from "@/assets/ambarn/indigo-36/05.webp";
import ambarnIndigo36_6 from "@/assets/ambarn/indigo-36/06.webp";
import ambarnIndigo36Plan1 from "@/assets/ambarn/indigo-36/plan-1.webp";
import familyHouseLogo from "@/assets/myfamilyhouse/logo.webp";
import familyHouseProject1_1 from "@/assets/myfamilyhouse/project-1/01.webp";
import familyHouseProject1_2 from "@/assets/myfamilyhouse/project-1/02.webp";
import familyHouseProject2_1 from "@/assets/myfamilyhouse/project-2/01.webp";
import familyHouseProject2_2 from "@/assets/myfamilyhouse/project-2/02.webp";
import familyHouseProject3_1 from "@/assets/myfamilyhouse/project-3/01.webp";
import familyHouseProject3_2 from "@/assets/myfamilyhouse/project-3/02.webp";
import familyHouseProject4_1 from "@/assets/myfamilyhouse/project-4/01.webp";
import familyHouseProject4_2 from "@/assets/myfamilyhouse/project-4/02.webp";
import familyHouseProject5_1 from "@/assets/myfamilyhouse/project-5/01.webp";
import familyHouseProject5_2 from "@/assets/myfamilyhouse/project-5/02.webp";
import { regionalBatchProjects, regionalMakers } from "@/data/regionalBatchProjects";

// ============================================================================
// ТИПЫ
// ============================================================================

export type GalleryItem = {
  image: string;
  type?: "photo" | "video" | "plan";
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
  phone?: string;
  email?: string;
  telegram?: string;
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
  logo: makerPlatformaLogo,
  siteUrl: "https://platforma-modul.ru/",
  productionAddress: "г. Березовский, Южная промзона, д. 21",
  phone: "+7 (343) 226-11-40",
  email: "sales@platforma-modul.ru",
  telegram: "PlatformaModul",
};


const BYGGE: Maker = {
  name: "Bygge",
  initials: "BG",
  id: "bygge",
  siteUrl: "https://bygge.ru/",
  productionAddress: "г. Екатеринбург, ул. Хлебная, 17",
  phone: "+7 (982) 693-70-39",
  email: "bygge_ural@mail.ru",
  telegram: "bygge_rus",
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
  siteUrl: "https://hochu-dom.ru/",
};
const BEREST_DOM: Maker = {
  name: "Берест",
  initials: "БР",
  id: "berest-dom",
  siteUrl: "https://berest-dom.ru/product/",
};
const RIFT: Maker = {
  name: "РИФТ",
  initials: "РФ",
  id: "rift",
  siteUrl: "https://www.rift.ru/projects/doma-i-kottedzhi/karkasnye-doma/",
};
const IZBRUSA: Maker = {
  name: "Из Бруса",
  initials: "ИБ",
  id: "izbrusa",
  siteUrl: "https://izbrusa.com/category/karkasnye-doma/",
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
const KAZANSTROY16: Maker = {
  name: "Строй Дом",
  initials: "СД",
  id: "kazanstroy16",
  siteUrl: "https://kazanstroy16.ru/building/karkassnye-doma/",
};
const ASKHOME: Maker = {
  name: "AskHome",
  initials: "AH",
  id: "askhome",
  siteUrl: "https://askhome.me/projects/",
};
const DOMOTEKA: Maker = {
  name: "Домотека",
  initials: "ДМ",
  id: "domoteka",
  siteUrl: "https://domoteka-krd.ru/karkasnye-doma/",
};
const KARKAS_DOM_YUG: Maker = {
  name: "Каркасный Дом Юг",
  initials: "КЮ",
  id: "karkas-dom-yug",
  siteUrl: "https://xn-----6kcare7afbyhptq5m4b.xn--p1ai/",
};
const SIBIRYAK: Maker = {
  name: "Сибиряк",
  initials: "СБ",
  id: "sibiryak",
  siteUrl: "https://sibiryak23.ru/dom-barn/",
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
  name: "Строй Комфорт",
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
const DOMA_OT_MIHALYCHA: Maker = {
  name: "Дома от Михалыча",
  initials: "ДМ",
  id: "doma-ot-mihalycha",
  siteUrl: "https://xn-----6kccat5azaddrd6c4b6a4d.xn--p1ai/proekty/karkasniye-doma/",
};
const BARNSTUDIO: Maker = {
  name: "Barn Studio",
  initials: "BS",
  id: "barnstudio",
  siteUrl: "https://barnstudio.ru/barnhouse",
};
const BELI_DOM: Maker = {
  name: "Белый дом",
  initials: "БД",
  id: "beli-dom",
  siteUrl: "https://beli-dom.ru/catalog/?technology=karkasnye-doma",
};
const MASTERGRUPP_BARNAUL: Maker = {
  name: "МастерГруппБарнаул",
  initials: "МГ",
  id: "mastergrupp-barnaul",
  siteUrl: "https://stroy-dom-barnaul.ru/building/karkassnye-doma/",
  productionAddress: "г. Барнаул, проезд Южный, 9",
  phone: "+7 (3852) 22-24-13",
  email: "info@stroy-dom-barnaul.ru",
};
const PRAKTIKA_STROY: Maker = {
  name: "Практика Строй",
  initials: "ПС",
  id: "praktika-stroy",
  siteUrl: "https://praktika-stroy.ru/modulnye-doma/kruglogodichnoe-prozhivanie",
  productionAddress: "Санкт-Петербург и Ленинградская область",
  phone: "+7 (901) 132-76-76",
};
const ECO_CITY: Maker = {
  name: "Eco-City",
  initials: "EC",
  id: "eco-city",
  siteUrl: "https://eco-city.spb.ru/product-category/modulnye-doma/",
  productionAddress: "Санкт-Петербург и Ленинградская область",
};
const MODOM: Maker = {
  name: "Modom",
  initials: "MO",
  id: "modom",
  siteUrl: "https://modom.pro/proekty-modulnyh-domov/",
  productionAddress: "Санкт-Петербург и Ленинградская область",
};
const HOUSEBOX: Maker = {
  name: "HouseBox",
  initials: "HB",
  id: "housebox",
  siteUrl: "https://housebox-spb.ru/",
  productionAddress: "Санкт-Петербург и Ленинградская область",
};
const GLAVLES: Maker = {
  name: "Главлес",
  initials: "ГЛ",
  id: "glavles",
  siteUrl: "https://promo.glavles.com/",
  productionAddress: "г. Екатеринбург, ул. Сулимова, 50, офис 3.11",
  phone: "+7 (343) 206-50-88",
  email: "info@glavles.com",
};
const FPS_MODUL: Maker = {
  name: "ФПС Модуль",
  initials: "ФП",
  id: "fps-modul",
  siteUrl: "https://fps-modul.ru/",
  productionAddress: "г. Екатеринбург, Берёзовский тракт, 6Б",
  phone: "+7 (966) 705-96-96",
  telegram: "https://t.me/fps_modul",
};
const VEK_TRAD: Maker = {
  name: "Вековые Традиции",
  initials: "ВТ",
  id: "vek-trad",
  siteUrl: "https://vek-trad.ru/katalog-proektov-domov/modulnye/",
  productionAddress: "г. Екатеринбург, ул. Ирбитская, 13",
  phone: "+7 (343) 271-51-92",
  email: "info@vek-trad.ru",
};
const BUDUSHIY_DOM: Maker = {
  name: "Будущий Дом",
  initials: "БД",
  id: "budushiy-dom",
  siteUrl: "https://budushiy-dom.ru/product-category/doma/",
  productionAddress: "Екатеринбург и Свердловская область",
  phone: "+7 (922) 124-42-52",
  email: "budushiy.dom@yandex.ru",
};
const QUBDOM: Maker = {
  name: "Qubdom",
  initials: "QD",
  id: "qubdom",
  siteUrl: "https://qubdom.ru/",
  productionAddress: "Санкт-Петербург и Ленинградская область",
  phone: "+7 (999) 945-30-05",
  email: "info@qubdom.ru",
};
const DUROV_HOUSE: Maker = {
  name: "DUROV.HOUSE",
  initials: "DH",
  id: "durov-house",
  logo: durovLogo,
  siteUrl: "https://durov.house/",
  productionAddress: "Воронежская область, Новоусманский район, село Бабяково, 1-й Парковый проезд, строение 11",
  phone: "+7 (906) 677-35-55",
  email: "sales@durov.house",
};
const HISTHUT: Maker = {
  name: "HISTHUT",
  initials: "HH",
  id: "histhut",
  logo: histhutLogo,
  siteUrl: "https://histhut.ru/",
  productionAddress: "г. Пермь, ул. Героев Хасана, 105 к70",
  phone: "+7 (982) 496-77-77",
  email: "info@histhut.ru",
};
const COUNTRYHOUSE: Maker = {
  name: "CountryHouse",
  initials: "CH",
  id: "countryhouse",
  logo: countryhouseLogo,
  siteUrl: "https://modulniye-doma.ru/",
  productionAddress: "Санкт-Петербург, Коломяжский пр-т, д. 33, к. 2",
  phone: "+7 (952) 356-65-92",
  email: "info@modulniye-doma.ru",
};
const CUBADOM: Maker = {
  name: "CUBA DOM",
  initials: "CD",
  id: "cuba-dom",
  logo: cubadomLogo,
  siteUrl: "https://cuba-dom.ru/",
  productionAddress: "Санкт-Петербург, 1-я Полевая 25а",
  phone: "+7 (812) 509-13-04",
};
const IDOLHOUSE: Maker = {
  name: "АЙДОЛХАУС",
  initials: "IH",
  id: "idolhouse",
  logo: idolhouseLogo,
  siteUrl: "https://idolhouse.ru/",
  productionAddress: "Воронежская область, Новоусманский район, село Бабяково, 1-й Парковый проезд, строение 11",
  phone: "+7 (958) 509-08-19",
  email: "hello@idolhouse.ru",
};
const WOODALP: Maker = {
  name: "WOODALP",
  initials: "WA",
  id: "woodalp",
  logo: woodalpLogo,
  siteUrl: "https://woodalphouse.ru/",
  productionAddress: "МО, Одинцовский городской округ, Малые Вяземы, БЦ Madex",
  phone: "+7 (929) 692-90-09",
  email: "vudalp@yandex.ru",
};
const BOXMATE: Maker = {
  name: "Boxmate",
  initials: "BM",
  id: "boxmate",
  logo: boxmateLogo,
  siteUrl: "https://boxmate.ru/",
  productionAddress: "Санкт-Петербург, Полтавский проезд, 2",
  phone: "+7 (981) 717-91-20",
};
const UVHOUSE: Maker = {
  name: "UV House",
  initials: "UV",
  id: "uvhouse",
  logo: uvhouseLogo,
  siteUrl: "https://ufa-vagon.ru/",
  productionAddress: "Уфа",
  phone: "+7 (917) 048-79-84",
  email: "info@ufa-vagon.ru",
};
const ASTERIUS: Maker = {
  name: "Asterius House",
  initials: "AH",
  id: "asterius-house",
  logo: asteriusLogo,
  siteUrl: "https://asterius-house.ru/",
  productionAddress: "Чебоксары, Кабельный проезд, 4",
  phone: "+7 (931) 105-80-90",
};
const SMOLA: Maker = {
  name: "SMOLA HOUSE",
  initials: "SH",
  id: "smola-house",
  logo: smolaLogo,
  siteUrl: "https://smolahouse.ru/",
  productionAddress: "Московская область",
  phone: "+7 (910) 011-35-55",
  email: "smolahouse@yandex.ru",
  telegram: "https://t.me/smolahouse",
};
const ULTRADOMSPB: Maker = {
  name: "UltraDomSPb",
  initials: "UD",
  id: "ultradomspb",
  logo: ultradomspbLogo,
  siteUrl: "https://ultradomspb.ru/",
  productionAddress: "Санкт-Петербург",
  phone: "+7 (812) 921-82-86",
  email: "info@ultradomspb.ru",
};
const FREEDOM_NATURI: Maker = {
  name: "FREEDOM NATURI",
  initials: "FN",
  id: "freedom-naturi",
  logo: freedomLogo,
  siteUrl: "https://freedom-modul.ru/",
  productionAddress: "М.О. Воря-Богородское",
  phone: "+7 (903) 715-95-20",
  email: "info@freedom-modul.ru",
};
const CHEBWOOD: Maker = {
  name: "Чебвуд",
  initials: "ЧВ",
  id: "chebwood",
  logo: chebwoodLogo,
  siteUrl: "https://chebwood.com/",
  productionAddress: "Чебоксары, Дорожный проезд, 10А",
  phone: "+7 (920) 733-77-33",
  email: "chebwood21@mail.ru",
  telegram: "https://t.me/chebwood",
};
const CAMPINGDOM: Maker = {
  name: "Campingdom",
  initials: "CD",
  id: "campingdom",
  logo: campingdomLogo,
  siteUrl: "https://campingdom.ru/proekti",
  productionAddress: "Республика Татарстан, с. Высокая Гора, ул. Большая Красная, д. 1а",
  phone: "+7 (966) 240-47-47",
  telegram: "https://t.me/RamilGubaev",
};
const PSLCOMP: Maker = {
  name: "Промстройлес",
  initials: "ПЛ",
  id: "pslcomp",
  logo: pslcompLogo,
  siteUrl: "https://www.pslcomp.ru/katalog-proektov-derevyannyh-domov/modulnye-doma",
  productionAddress: "Санкт-Петербург и Москва",
  phone: "+7 (812) 596-39-01",
};
const DOMNASM: Maker = {
  name: "Домнас Модуль",
  initials: "ДМ",
  id: "domnasm",
  siteUrl: "https://domnasm.ru/",
  productionAddress: "Казань, ул. Адмиралтейская, д. 3, к. 1, офис 205",
};
const BLACKMODULE: Maker = {
  name: "BlackModule",
  initials: "BM",
  id: "blackmodule",
  logo: blackmoduleLogo,
  siteUrl: "https://blackmodule.ru/",
  productionAddress: "Мурино, Сквозной проезд, 4",
  phone: "+7 (921) 343-70-44",
  email: "blackmodulespb@gmail.com",
};
const DOMM: Maker = {
  name: "DOMM",
  initials: "DM",
  id: "domm",
  logo: dommLogo,
  siteUrl: "https://domm.store/",
  productionAddress: "Новосибирск",
  phone: "+7 (983) 307-29-87",
  email: "dom-m54@mail.ru",
};
const MY_MODULE: Maker = {
  name: "Мой Модуль",
  initials: "ММ",
  id: "my-module",
  logo: myModuleLogo,
  siteUrl: "https://my-module.ru/module-dom/",
  productionAddress: "Московская область, городской округ Балашиха, дер. Дятловка, 828",
  phone: "8-800-222-07-67",
  email: "info@my-module.ru",
  telegram: "https://t.me/Mymodule",
};
const FOUR_MODUL: Maker = {
  name: "4 Стихии",
  initials: "4С",
  id: "4modul",
  siteUrl: "https://4modul.ru/",
  productionAddress: "Рязань",
  phone: "+7 (900) 609-69-09",
};
const CUBBER: Maker = {
  name: "Cubber Prefab",
  initials: "CB",
  id: "cubber",
  logo: cubberLogo,
  siteUrl: "https://cubber.ru/modul",
  productionAddress: "Новокузнецк, Кемеровская область",
  phone: "+7 (900) 105-61-30",
};
const SIMPLEHOUSE: Maker = {
  name: "Simple House",
  initials: "SH",
  id: "simplehouse",
  logo: simplehouseLogo,
  siteUrl: "https://simplehouse1.ru/",
  productionAddress: "Санкт-Петербург",
  email: "simplehouse1@mail.ru",
  telegram: "https://t.me/simple_house1",
};
const PANORAMIC_HOME: Maker = {
  name: "Panoramic Home",
  initials: "PH",
  id: "panoramic-home",
  logo: panoramicLogo,
  siteUrl: "https://panoramic-home.ru/modular_house",
  productionAddress: "Красноярск",
  phone: "+7 (906) 974-44-00",
};
const AMBARN: Maker = {
  name: "АмбарН",
  initials: "АН",
  id: "ambarn",
  logo: ambarnLogo,
  siteUrl: "https://ambarn.ru/product-category/modulnye-doma/",
  productionAddress: "Краснодар и Краснодарский край",
  phone: "+7 (937) 260-04-20",
};
const MYFAMILYHOUSE: Maker = {
  name: "FAMILY HOUSE",
  initials: "FH",
  id: "myfamilyhouse",
  logo: familyHouseLogo,
  siteUrl: "https://myfamilyhouse.ru/",
  productionAddress: "х. Суповский, ул. Ленина 88/4",
  phone: "+7 (995) 103-67-03",
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

  // ── Строй Дом · Казань ─────────────────────────────────────────────────
  {
    id: 152, name: "Бигль", badge: "Жилой дом", price: "1 798 580 ₽",
    area: "62,02 м²", area_m2: 62.02, beds: 2, baths: 1, floors: 1, term: "до 3 мес.",
    rooms: "2 комнаты", purpose: "ИЖС / СНТ", city: "Казань",
    maker: { ...KAZANSTROY16, siteUrl: "https://kazanstroy16.ru/building/1623/" },
    description: "Одноэтажный каркасный дом 62,02 м² размером 9 × 6 м с мансардой и крыльцом.",
    descriptionLong: "Проект «Бигль» от «Строй Дом»: одноэтажный каркасный дом площадью 62,02 м², габариты 9 × 6 м. В проекте две комнаты, санузел, кухня, холл и крыльцо, на сайте производителя указана цена строительства от 1 798 580 ₽.",
    gallery: [
      { image: ksBigl_1, type: "photo", fit: "contain", blur: true },
      { image: ksBigl_2, type: "photo", fit: "contain", blur: true },
      { image: ksBigl_3, type: "photo", fit: "contain", blur: true },
      { image: ksBigl_4, type: "photo", fit: "contain", blur: true },
      { image: ksBigl_5, type: "photo", fit: "contain", blur: true },
      { image: ksBiglPlan1, type: "photo", fit: "contain" },
      { image: ksBiglPlan2, type: "photo", fit: "contain" },
    ],
    likes: 31, rating: 4.7,
    suitableFor: ["Постоянное проживание", "Для одного / пары"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Мансарда", "Крыльцо"], style: "Классический", landSize: "3–6 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 153, name: "Диотима", badge: "Жилой дом", price: "1 803 800 ₽",
    area: "62,2 м²", area_m2: 62.2, beds: 2, baths: 1, floors: 1, term: "до 3 мес.",
    rooms: "2 комнаты", purpose: "ИЖС / СНТ", city: "Казань",
    maker: { ...KAZANSTROY16, siteUrl: "https://kazanstroy16.ru/building/1515/" },
    description: "Одноэтажный каркасный дом 62,2 м² размером 9 × 8 м для постоянного проживания.",
    descriptionLong: "Проект «Диотима» от «Строй Дом»: одноэтажный каркасный дом площадью 62,2 м², габариты 9 × 8 м. Компактный проект для постоянного проживания с двумя комнатами и базовой планировкой без мансарды.",
    gallery: [
      { image: ksDiotima_1, type: "photo", fit: "contain", blur: true },
      { image: ksDiotima_2, type: "photo", fit: "contain", blur: true },
      { image: ksDiotimaPlan1, type: "photo", fit: "contain" },
      { image: ksDiotimaPlan2, type: "photo", fit: "contain" },
    ],
    likes: 30, rating: 4.7,
    suitableFor: ["Постоянное проживание", "Для одного / пары"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Крыльцо"], style: "Классический", landSize: "3–6 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 154, name: "Гленапп", badge: "Жилой дом", price: "1 803 800 ₽",
    area: "62,2 м²", area_m2: 62.2, beds: 2, baths: 1, floors: 1, term: "до 3 мес.",
    rooms: "2 комнаты", purpose: "ИЖС / СНТ", city: "Казань",
    maker: { ...KAZANSTROY16, siteUrl: "https://kazanstroy16.ru/building/1526/" },
    description: "Одноэтажный каркасный дом 62,2 м² размером 8 × 9 м с террасой.",
    descriptionLong: "Проект «Гленапп» от «Строй Дом»: одноэтажный каркасный дом площадью 62,2 м², габариты 8 × 9 м. В проекте предусмотрена терраса, а в каталоге производителя указана цена строительства от 1 803 800 ₽.",
    gallery: [
      { image: ksGlenapp_1, type: "photo", fit: "contain", blur: true },
      { image: ksGlenapp_2, type: "photo", fit: "contain", blur: true },
      { image: ksGlenappPlan1, type: "photo", fit: "contain" },
      { image: ksGlenappPlan2, type: "photo", fit: "contain" },
      { image: ksGlenappPlan3, type: "photo", fit: "contain" },
    ],
    likes: 32, rating: 4.7,
    suitableFor: ["Постоянное проживание", "Выходные / дача"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса"], style: "Классический", landSize: "3–6 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 155, name: "Стракея", badge: "Жилой дом", price: "1 891 090 ₽",
    area: "65,21 м²", area_m2: 65.21, beds: 2, baths: 1, floors: 2, term: "до 3 мес.",
    rooms: "2 комнаты", purpose: "ИЖС / СНТ", city: "Казань",
    maker: { ...KAZANSTROY16, siteUrl: "https://kazanstroy16.ru/building/1616/" },
    description: "Двухэтажный каркасный дом 65,21 м² размером 8 × 6 м с мансардой и террасой.",
    descriptionLong: "Проект «Стракея» от «Строй Дом»: двухэтажный каркасный дом площадью 65,21 м², габариты 8 × 6 м. В карточке производителя отмечены мансарда и терраса, проект подходит для дачного или постоянного проживания.",
    gallery: [
      { image: ksStrakeya_1, type: "photo", fit: "contain", blur: true },
      { image: ksStrakeya_2, type: "photo", fit: "contain", blur: true },
      { image: ksStrakeyaPlan1, type: "photo", fit: "contain" },
      { image: ksStrakeya_3, type: "photo", fit: "contain", blur: true },
      { image: ksStrakeya_4, type: "photo", fit: "contain", blur: true },
      { image: ksStrakeya_5, type: "photo", fit: "contain", blur: true },
      { image: ksStrakeyaPlan2, type: "photo", fit: "contain" },
    ],
    likes: 31, rating: 4.7,
    suitableFor: ["Постоянное проживание", "Выходные / дача"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Мансарда", "Терраса"], style: "Классический", landSize: "3–6 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 156, name: "Изабелла", badge: "Жилой дом", price: "1 977 800 ₽",
    area: "68,2 м²", area_m2: 68.2, beds: 3, baths: 1, floors: 2, term: "до 3 мес.",
    rooms: "3 комнаты", purpose: "ИЖС / СНТ", city: "Казань",
    maker: { ...KAZANSTROY16, siteUrl: "https://kazanstroy16.ru/building/75/" },
    description: "Двухэтажный каркасный дом 68,2 м² размером 7 × 11 м с мансардой и эркером.",
    descriptionLong: "Проект «Изабелла» от «Строй Дом»: двухэтажный каркасный дом площадью 68,2 м², габариты 7 × 11 м. В проекте есть мансарда, эркер и компактная планировка для постоянного проживания.",
    gallery: [
      { image: ksIzabella_1, type: "photo", fit: "contain", blur: true },
      { image: ksIzabella_2, type: "photo", fit: "contain", blur: true },
      { image: ksIzabella_3, type: "photo", fit: "contain", blur: true },
      { image: ksIzabellaPlan1, type: "photo", fit: "contain" },
      { image: ksIzabellaPlan2, type: "photo", fit: "contain" },
    ],
    likes: 33, rating: 4.7,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Мансарда", "Эркер"], style: "Классический", landSize: "6–10 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },

  // ── AskHome · Казань ──────────────────────────────────────────────────
  {
    id: 157, name: "Nova Prime", badge: "Жилой дом", price: "4 520 000 ₽",
    area: "80 м²", area_m2: 80, beds: 2, baths: 1, floors: 1, term: "от 2 мес.",
    rooms: "2 комнаты", purpose: "ИЖС / СНТ", city: "Казань",
    maker: { ...ASKHOME, siteUrl: "https://askhome.me/item/karkasnyj-dom-pod-klyuch-nova-prime/" },
    description: "Каркасный дом 80 м² с двумя спальнями, кухней-столовой и двусветной гостиной.",
    descriptionLong: "Проект Nova Prime от AskHome: каркасный дом площадью 80 м² с двумя спальнями, просторным санузлом, прихожей с нишей под шкаф, кухней-столовой и гостиной с высоким потолком. На сайте производителя указана стоимость от 4 520 000 ₽ и срок реализации от 2 месяцев.",
    gallery: [
      { image: ahNovaPrime_1, type: "photo", fit: "contain", blur: true },
      { image: ahNovaPrime_2, type: "photo", fit: "contain", blur: true },
      { image: ahNovaPrime_3, type: "photo", fit: "contain", blur: true },
      { image: ahNovaPrime_4, type: "photo", fit: "contain", blur: true },
      { image: ahNovaPrime_5, type: "photo", fit: "contain", blur: true },
    ],
    likes: 36, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Панорамные окна", "Второй свет"], style: "Современный", landSize: "6–10 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 158, name: "Nova", badge: "Жилой дом", price: "3 650 000 ₽",
    area: "80 м²", area_m2: 80, beds: 2, baths: 1, floors: 1, term: "от 2 мес.",
    rooms: "2 комнаты", purpose: "ИЖС / СНТ", city: "Казань",
    maker: { ...ASKHOME, siteUrl: "https://askhome.me/item/karkasnyj-dom-pod-klyuch-nova/" },
    description: "Компактный каркасный дом 80 м² для небольшой семьи с кухней-гостиной.",
    descriptionLong: "Проект Nova от AskHome: одноэтажный каркасный дом площадью 80 м² для небольшой семьи. В планировке две спальни, кухня-столовая, гостиная, прихожая и санузел, строительство заявлено от 2 месяцев.",
    gallery: [
      { image: ahNova_1, type: "photo", fit: "contain", blur: true },
      { image: ahNova_2, type: "photo", fit: "contain", blur: true },
      { image: ahNova_3, type: "photo", fit: "contain", blur: true },
      { image: ahNova_4, type: "photo", fit: "contain", blur: true },
      { image: ahNova_5, type: "photo", fit: "contain", blur: true },
    ],
    likes: 34, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Панорамные окна"], style: "Современный", landSize: "6–10 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 159, name: "Modera Prime", badge: "Жилой дом", price: "7 180 000 ₽",
    area: "130 м²", area_m2: 130, beds: 3, baths: 2, floors: 1, term: "от 2 мес.",
    rooms: "3 комнаты", purpose: "ИЖС", city: "Казань",
    maker: { ...ASKHOME, siteUrl: "https://askhome.me/item/karkasnyj-dom-pod-klyuch-modera-prime/" },
    description: "Современный каркасный дом 130 м² с мастер-спальней, двумя санузлами и террасой.",
    descriptionLong: "Проект Modera Prime от AskHome: каркасный дом площадью 130 м² с тремя изолированными спальнями, включая мастер-спальню, светлой гостиной около 30 м², двумя санузлами и отдельным помещением под котельную. На сайте указана стоимость от 7 180 000 ₽.",
    gallery: [
      { image: ahModeraPrime_1, type: "photo", fit: "contain", blur: true },
      { image: ahModeraPrimePlan, type: "photo", fit: "contain" },
      { image: ahModeraPrime_2, type: "photo", fit: "contain", blur: true },
      { image: ahModeraPrime_3, type: "photo", fit: "contain", blur: true },
      { image: ahModeraPrime_4, type: "photo", fit: "contain", blur: true },
    ],
    likes: 38, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса", "Панорамные окна", "Мастер-спальня"], style: "Современный", landSize: "6–10 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 160, name: "Modera", badge: "Жилой дом", price: "6 200 000 ₽",
    area: "130 м²", area_m2: 130, beds: 3, baths: 2, floors: 1, term: "от 2 мес.",
    rooms: "3 комнаты", purpose: "ИЖС", city: "Казань",
    maker: { ...ASKHOME, siteUrl: "https://askhome.me/item/karkasnyj-dom-pod-klyuch-modera/" },
    description: "Каркасный дом 130 м² с тремя спальнями, двумя санузлами и просторной гостиной.",
    descriptionLong: "Проект Modera от AskHome: современный каркасный дом площадью 130 м² с тремя спальнями, гостиной, двумя санузлами и отдельной котельной. Планировка рассчитана на постоянное проживание семьи и срок строительства от 2 месяцев.",
    gallery: [
      { image: ahModera_1, type: "photo", fit: "contain", blur: true },
      { image: ahModeraPlan, type: "photo", fit: "contain" },
      { image: ahModera_2, type: "photo", fit: "contain", blur: true },
      { image: ahModera_3, type: "photo", fit: "contain", blur: true },
      { image: ahModera_4, type: "photo", fit: "contain", blur: true },
    ],
    likes: 36, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Панорамные окна", "Котельная"], style: "Современный", landSize: "6–10 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 161, name: "Astra Prime", badge: "Жилой дом", price: "6 580 000 ₽",
    area: "114 м²", area_m2: 114, beds: 3, baths: 1, floors: 1, term: "от 2 мес.",
    rooms: "3 комнаты", purpose: "ИЖС / СНТ", city: "Казань",
    maker: { ...ASKHOME, siteUrl: "https://askhome.me/item/karkasnyj-dom-pod-klyuch-astra-prime/" },
    description: "Каркасный дом 114 м² для семьи с современной планировкой и панорамным остеклением.",
    descriptionLong: "Проект Astra Prime от AskHome: каркасный дом площадью 114 м² с современной планировкой, энергоэффективным теплым контуром и отделкой под ключ. На странице проекта указана стоимость от 6 580 000 ₽ и срок реализации от 2 месяцев.",
    gallery: [
      { image: ahAstraPrime_1, type: "photo", fit: "contain", blur: true },
      { image: ahAstraPrimePlan, type: "photo", fit: "contain" },
      { image: ahAstraPrime_2, type: "photo", fit: "contain", blur: true },
      { image: ahAstraPrime_3, type: "photo", fit: "contain", blur: true },
      { image: ahAstraPrime_4, type: "photo", fit: "contain", blur: true },
    ],
    likes: 37, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Панорамные окна"], style: "Современный", landSize: "6–10 соток",
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

  // ── Каркасный Дом Юг · Краснодарский край ─────────────────────────────
  {
    id: 162, name: "Шале 67", badge: "Жилой дом", price: "3 350 000 ₽",
    area: "65 м²", area_m2: 65, beds: 2, baths: 1, floors: 1, term: "31 д.",
    rooms: "2 спальни", purpose: "ИЖС / СНТ", city: "Краснодарский край",
    maker: { ...KARKAS_DOM_YUG, siteUrl: "https://xn-----6kcare7afbyhptq5m4b.xn--p1ai/planirovka_shale_67/" },
    description: "Каркасный дом 65 м² размером 10 × 6,9 м для постоянного проживания.",
    descriptionLong: "Проект «Шале 67» от «Каркасный Дом Юг»: каркасный дом площадью 65 м², габариты 10 × 6,9 м. В планировке две спальни, кухня-гостиная и прихожая, срок строительства на сайте указан 31 день.",
    gallery: [
      { image: kdyShale67_1, type: "photo", fit: "contain", blur: true },
    ],
    likes: 31, rating: 4.7,
    suitableFor: ["Постоянное проживание", "Для одного / пары"],
    technology: "Каркасный", completion: "Теплый контур", insulation: "до −30°C",
    features: ["Кухня-гостиная"], style: "Шале", landSize: "3–6 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: true,
  },
  {
    id: 163, name: "Шале 69", badge: "Жилой дом", price: "3 450 000 ₽",
    area: "67 м²", area_m2: 67, beds: 2, baths: 1, floors: 1, term: "31 д.",
    rooms: "2 спальни", purpose: "ИЖС / СНТ", city: "Краснодарский край",
    maker: { ...KARKAS_DOM_YUG, siteUrl: "https://xn-----6kcare7afbyhptq5m4b.xn--p1ai/planirovka_shale_69/" },
    description: "Каркасный дом 67 м² размером 9 × 7,5 м с террасой 13 м² и кладовой.",
    descriptionLong: "Проект «Шале 69» от «Каркасный Дом Юг»: каркасный дом площадью 67 м², габариты 9 × 7,5 м. В проекте две спальни, кухня-гостиная, прихожая, кладовая и терраса 13,02 м².",
    gallery: [
      { image: kdyShale69_1, type: "photo", fit: "contain", blur: true },
    ],
    likes: 32, rating: 4.7,
    suitableFor: ["Постоянное проживание", "Выходные / дача"],
    technology: "Каркасный", completion: "Теплый контур", insulation: "до −30°C",
    features: ["Терраса", "Кладовая"], style: "Шале", landSize: "3–6 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: true,
  },
  {
    id: 164, name: "Шале 65", badge: "Жилой дом", price: "3 250 000 ₽",
    area: "69 м²", area_m2: 69, beds: 2, baths: 1, floors: 1, term: "31 д.",
    rooms: "2 спальни", purpose: "ИЖС / СНТ", city: "Краснодарский край",
    maker: { ...KARKAS_DOM_YUG, siteUrl: "https://xn-----6kcare7afbyhptq5m4b.xn--p1ai/planirovka_shale_65/" },
    description: "Одноэтажный каркасный дом 69 м² размером 9,4 × 6,9 м с рациональной планировкой.",
    descriptionLong: "Проект «Шале 65» от «Каркасный Дом Юг»: каркасный дом площадью 69 м², габариты 9,4 × 6,9 м. На странице проекта отмечены две спальни, кухня-гостиная и дополнительная кладовая.",
    gallery: [
      { image: kdyShale65_1, type: "photo", fit: "contain", blur: true },
    ],
    likes: 31, rating: 4.7,
    suitableFor: ["Постоянное проживание", "Для одного / пары"],
    technology: "Каркасный", completion: "Теплый контур", insulation: "до −30°C",
    features: ["Кладовая", "Кухня-гостиная"], style: "Шале", landSize: "3–6 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: true,
  },
  {
    id: 165, name: "Шале 82", badge: "Жилой дом", price: "3 690 000 ₽",
    area: "82 м²", area_m2: 82, beds: 3, baths: 1, floors: 2, term: "31 д.",
    rooms: "3 спальни", purpose: "ИЖС / СНТ", city: "Краснодарский край",
    maker: { ...KARKAS_DOM_YUG, siteUrl: "https://xn-----6kcare7afbyhptq5m4b.xn--p1ai/planirovka_shale_82/" },
    description: "Каркасный дом 82 м² с мансардой, тремя спальнями и компактным пятном застройки.",
    descriptionLong: "Проект «Шале 82» от «Каркасный Дом Юг»: каркасный дом площадью 82 м², габариты 6,15 × 8,15 м. Дом с мансардой дает дополнительное пространство без увеличения пятна застройки.",
    gallery: [
      { image: kdyShale82_1, type: "photo", fit: "contain", blur: true },
    ],
    likes: 33, rating: 4.7,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Теплый контур", insulation: "до −30°C",
    features: ["Мансарда"], style: "Шале", landSize: "3–6 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: true,
  },
  {
    id: 166, name: "Шале 90", badge: "Жилой дом", price: "4 100 000 ₽",
    area: "90 м²", area_m2: 90, beds: 3, baths: 2, floors: 1, term: "31 д.",
    rooms: "3 спальни", purpose: "ИЖС", city: "Краснодарский край",
    maker: { ...KARKAS_DOM_YUG, siteUrl: "https://xn-----6kcare7afbyhptq5m4b.xn--p1ai/planirovka_shale_90/" },
    description: "Просторный каркасный дом 90 м² размером 12 × 7,5 м с тремя спальнями.",
    descriptionLong: "Проект «Шале 90» от «Каркасный Дом Юг»: каркасный дом площадью 90 м², габариты 12 × 7,5 м. В планировке три спальни, два санузла, холл и кухня-гостиная.",
    gallery: [
      { image: kdyShale90_1, type: "photo", fit: "contain", blur: true },
    ],
    likes: 34, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Теплый контур", insulation: "до −30°C",
    features: ["Кухня-гостиная"], style: "Шале", landSize: "6–10 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: true,
  },

  // ── Сибиряк · Краснодарский край ──────────────────────────────────────
  {
    id: 167, name: "БАРН 28", badge: "Барнхаус", price: "1 855 000 ₽",
    area: "28 м²", area_m2: 28, beds: 1, baths: 1, floors: 2, term: "от 1 мес.",
    rooms: "1 спальня", purpose: "ИЖС / СНТ / Бизнес", city: "Краснодарский край",
    maker: { ...SIBIRYAK, siteUrl: "https://sibiryak23.ru/barn-28m2/" },
    description: "Компактный каркасный барн-дом 28 м² размером 5 × 4 м с открытой террасой.",
    descriptionLong: "Проект «БАРН 28» от «Сибиряк»: каркасный барн-дом площадью 28 м², габариты 5 × 4 м и открытая терраса 10 м². Формат подходит для загородного отдыха, глэмпинга или компактного проживания.",
    gallery: [
      { image: sbBarn28_1, type: "photo", fit: "contain", blur: true },
      { image: sbBarn28_2, type: "photo", fit: "contain", blur: true },
      { image: sbBarn28_3, type: "photo", fit: "contain", blur: true },
      { image: sbBarn28Plan1, type: "photo", fit: "contain" },
      { image: sbBarn28Plan2, type: "photo", fit: "contain" },
    ],
    likes: 33, rating: 4.8,
    suitableFor: ["Выходные / дача", "Сдача в аренду"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса"], style: "Барнхаус", landSize: "3–6 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 168, name: "БАРН 41", badge: "Барнхаус", price: "2 380 000 ₽",
    area: "41 м²", area_m2: 41, beds: 1, baths: 1, floors: 2, term: "от 1 мес.",
    rooms: "1 спальня", purpose: "ИЖС / СНТ / Бизнес", city: "Краснодарский край",
    maker: { ...SIBIRYAK, siteUrl: "https://sibiryak23.ru/barn-41m2/" },
    description: "Каркасный барн-дом 41 м² размером 4,5 × 7 м для отдыха или компактного проживания.",
    descriptionLong: "Проект «БАРН 41» от «Сибиряк»: каркасный барн-дом площадью 41 м², габариты 4,5 × 7 м. В базовой комплектации указаны утепленный каркас, наружная и внутренняя отделка, коммуникации и санузел.",
    gallery: [
      { image: sbBarn41_1, type: "photo", fit: "contain", blur: true },
      { image: sbBarn41_2, type: "photo", fit: "contain", blur: true },
      { image: sbBarn41_3, type: "photo", fit: "contain", blur: true },
      { image: sbBarn41_4, type: "photo", fit: "contain", blur: true },
      { image: sbBarn41_5, type: "photo", fit: "contain", blur: true },
    ],
    likes: 34, rating: 4.8,
    suitableFor: ["Выходные / дача", "Сдача в аренду"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Панорамные окна"], style: "Барнхаус", landSize: "3–6 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 169, name: "БАРН 47", badge: "Барнхаус", price: "3 050 000 ₽",
    area: "47 м²", area_m2: 47, beds: 2, baths: 1, floors: 2, term: "от 1 мес.",
    rooms: "2 комнаты", purpose: "ИЖС / СНТ / Бизнес", city: "Краснодарский край",
    maker: { ...SIBIRYAK, siteUrl: "https://sibiryak23.ru/barn-47m2/" },
    description: "Каркасный барн-дом 47 м² размером 5 × 9,5 м с крытой террасой 12,5 м².",
    descriptionLong: "Проект «БАРН 47» от «Сибиряк»: каркасный барн-дом площадью 47 м², габариты 5 × 9,5 м. В проекте предусмотрена крытая терраса 12,5 м² и двухуровневый формат с компактной планировкой.",
    gallery: [
      { image: sbBarn47_1, type: "photo", fit: "contain", blur: true },
      { image: sbBarn47_2, type: "photo", fit: "contain", blur: true },
      { image: sbBarn47_3, type: "photo", fit: "contain", blur: true },
      { image: sbBarn47_4, type: "photo", fit: "contain", blur: true },
      { image: sbBarn47_5, type: "photo", fit: "contain", blur: true },
    ],
    likes: 35, rating: 4.8,
    suitableFor: ["Выходные / дача", "Сдача в аренду"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса"], style: "Барнхаус", landSize: "3–6 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 170, name: "БАРН 95", badge: "Барнхаус", price: "6 370 000 ₽",
    area: "95 м²", area_m2: 95, beds: 3, baths: 1, floors: 2, term: "от 1 мес.",
    rooms: "3 комнаты", purpose: "ИЖС / СНТ", city: "Краснодарский край",
    maker: { ...SIBIRYAK, siteUrl: "https://sibiryak23.ru/barn-95m2/" },
    description: "Просторный каркасный барн-дом 95 м² размером 8,5 × 8,5 м.",
    descriptionLong: "Проект «БАРН 95» от «Сибиряк»: каркасный барн-дом площадью 95 м², габариты 8,5 × 8,5 м. Проект рассчитан на семейный загородный сценарий и включает утепленный каркас, отделку и инженерные выводы в базовой комплектации.",
    gallery: [
      { image: sbBarn95_1, type: "photo", fit: "contain", blur: true },
      { image: sbBarn95_2, type: "photo", fit: "contain", blur: true },
      { image: sbBarn95_3, type: "photo", fit: "contain", blur: true },
      { image: sbBarn95_4, type: "photo", fit: "contain", blur: true },
      { image: sbBarn95Plan, type: "photo", fit: "contain" },
    ],
    likes: 36, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Панорамные окна"], style: "Барнхаус", landSize: "6–10 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 171, name: "БАРН 120", badge: "Барнхаус", price: "5 470 000 ₽",
    area: "120 м²", area_m2: 120, beds: 4, baths: 1, floors: 2, term: "от 1 мес.",
    rooms: "4 комнаты", purpose: "ИЖС / СНТ", city: "Краснодарский край",
    maker: { ...SIBIRYAK, siteUrl: "https://sibiryak23.ru/barn-120m2/" },
    description: "Двухэтажный каркасный барн-дом 120 м² размером 6,4 × 10,5 м с террасой.",
    descriptionLong: "Проект «БАРН 120» от «Сибиряк»: каркасный барн-дом площадью 120 м², габариты 6,4 × 10,5 м. На странице проекта указана открытая терраса 6,5 м², базовая комплектация с утеплением и отделкой.",
    gallery: [
      { image: sbBarn120_1, type: "photo", fit: "contain", blur: true },
      { image: sbBarn120_2, type: "photo", fit: "contain", blur: true },
      { image: sbBarn120_3, type: "photo", fit: "contain", blur: true },
      { image: sbBarn120_4, type: "photo", fit: "contain", blur: true },
      { image: sbBarn120_5, type: "photo", fit: "contain", blur: true },
    ],
    likes: 37, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса", "Панорамные окна"], style: "Барнхаус", landSize: "6–10 соток",
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

  // ── Строй Комфорт · Санкт-Петербург и ЛО ───────────────────────────────
  {
    id: 127, name: "КД-120", badge: "Жилой дом", price: "3 063 000 ₽",
    area: "130 м²", area_m2: 130, beds: 3, baths: 2, floors: 1, term: "от 2 мес.",
    rooms: "3 спальни", purpose: "ИЖС / СНТ", city: "Санкт-Петербург и ЛО",
    maker: { ...DOMAKARKAS, siteUrl: "https://domakarkas.ru/proekty-karkasnyh-domov/kd-120/" },
    description: "Каркасный дом КД-120 130 м² размером 14.5×9 от производителя «Строй Комфорт». В проекте отмечены: терраса, панорамные окна, сауна.",
    descriptionLong: "Каркасный дом КД-120 130 м² размером 14.5×9 от производителя «Строй Комфорт». В проекте отмечены: терраса, панорамные окна, сауна. Площадь проекта 130 м², габариты 14.5×9, 3 спальни, 2 санузла. Кнопка перехода ведёт на страницу проекта на сайте производителя.",
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
    description: "Каркасный дом КД-119 126 м² размером 14×9 от производителя «Строй Комфорт». В проекте отмечены: терраса.",
    descriptionLong: "Каркасный дом КД-119 126 м² размером 14×9 от производителя «Строй Комфорт». В проекте отмечены: терраса. Площадь проекта 126 м², габариты 14×9, 3 спальни, 1 санузел. Кнопка перехода ведёт на страницу проекта на сайте производителя.",
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
    description: "Каркасный дом КД-118 117 м² размером 13×9 от производителя «Строй Комфорт». В проекте отмечены: терраса.",
    descriptionLong: "Каркасный дом КД-118 117 м² размером 13×9 от производителя «Строй Комфорт». В проекте отмечены: терраса. Площадь проекта 117 м², габариты 13×9, 3 спальни, 1 санузел. Кнопка перехода ведёт на страницу проекта на сайте производителя.",
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
    description: "Каркасный дом КД-117 126 м² размером 14×9 от производителя «Строй Комфорт». В проекте отмечены: терраса, панорамные окна, второй свет.",
    descriptionLong: "Каркасный дом КД-117 126 м² размером 14×9 от производителя «Строй Комфорт». В проекте отмечены: терраса, панорамные окна, второй свет. Площадь проекта 126 м², габариты 14×9, 3 спальни, 1 санузел. Кнопка перехода ведёт на страницу проекта на сайте производителя.",
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
    description: "Каркасный дом КД-116 108 м² размером 13.5×8 от производителя «Строй Комфорт». В проекте отмечены: терраса, второй свет.",
    descriptionLong: "Каркасный дом КД-116 108 м² размером 13.5×8 от производителя «Строй Комфорт». В проекте отмечены: терраса, второй свет. Площадь проекта 108 м², габариты 13.5×8, 3 спальни, 1 санузел. Кнопка перехода ведёт на страницу проекта на сайте производителя.",
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

  // ── Берест · Москва и МО ───────────────────────────────────────────────
  {
    id: 137, name: "Богатырь ЛК 7×9", badge: "Хит", price: "3 511 000 ₽",
    area: "102,33 м²", area_m2: 102.33, beds: 3, baths: 1, floors: 2, term: "от 2 мес.",
    rooms: "5 комнат", purpose: "ИЖС / СНТ", city: "Москва и МО",
    maker: { ...BEREST_DOM, siteUrl: "https://berest-dom.ru/product/nedorogie-doma/proekt-karkasnogo-doma-bogatyr-lk-7kh9/" },
    description: "Каркасный дом «Богатырь ЛК» 102,33 м² размером 7 × 9 м с мансардой.",
    descriptionLong: "Проект «Богатырь ЛК» от компании «Берест»: каркасный дом площадью 102,33 м², габариты 7 × 9 м. В карточке производителя указаны пять комнат, один санузел и стоимость комплектации под ключ.",
    gallery: [
      { image: bdBogatyrLk7h9_1, type: "photo", fit: "contain", blur: true },
      { image: bdBogatyrLk7h9_2, type: "photo", fit: "contain", blur: true },
      { image: bdBogatyrLk7h9_3, type: "photo", fit: "contain", blur: true },
      { image: bdBogatyrLk7h9_4, type: "photo", fit: "contain", blur: true },
      { image: bdBogatyrLk7h9_5, type: "photo", fit: "contain", blur: true },
    ],
    likes: 37, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Мансарда"], style: "Классический", landSize: "6–10 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 138, name: "Карелия-2 7×9", badge: "Просмотр на площадке", price: "4 323 000 ₽",
    area: "110,5 м²", area_m2: 110.5, beds: 3, baths: 2, floors: 2, term: "от 2 мес.",
    rooms: "5 комнат", purpose: "ИЖС / СНТ", city: "Москва и МО",
    maker: { ...BEREST_DOM, siteUrl: "https://berest-dom.ru/product/dlya-PMZH/proekt-kareliya-2/" },
    description: "Полутораэтажный каркасный дом «Карелия-2» 110,5 м² размером 7 × 9 м.",
    descriptionLong: "Проект «Карелия-2» от компании «Берест»: полутораэтажный каркасный дом площадью 110,5 м², габариты 7 × 9 м. В карточке производителя указаны пять комнат, два санузла и возможность просмотра проекта на площадке.",
    gallery: [
      { image: bdKareliya27h9_1, type: "photo", fit: "contain", blur: true },
      { image: bdKareliya27h9_2, type: "photo", fit: "contain", blur: true },
      { image: bdKareliya27h9_3, type: "photo", fit: "contain" },
      { image: bdKareliya27h9_4, type: "photo", fit: "contain" },
      { image: bdKareliya27h9_5, type: "photo", fit: "contain", blur: true },
    ],
    likes: 38, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Мансарда"], style: "Классический", landSize: "6–10 соток",
    hasRealPhotos: false, hasShowroom: true, hasInstallment: false,
  },
  {
    id: 139, name: "Сенатор 7,5×9", badge: "Новинка", price: "4 695 000 ₽",
    area: "120 м²", area_m2: 120, beds: 2, baths: 1, floors: 2, term: "от 2 мес.",
    rooms: "4 комнаты", purpose: "ИЖС / СНТ", city: "Москва и МО",
    maker: { ...BEREST_DOM, siteUrl: "https://berest-dom.ru/product/dlya-PMZH/proekt-karkasnogo-doma-senator-7-5kh9/" },
    description: "Полутораэтажный каркасный дом «Сенатор» 120 м² размером 7,5 × 9 м.",
    descriptionLong: "Проект «Сенатор» от компании «Берест»: полутораэтажный каркасный дом площадью 120 м², габариты 7,5 × 9 м. В карточке производителя указаны четыре комнаты и стоимость комплектации под ключ.",
    gallery: [
      { image: bdSenator75h9_1, type: "photo", fit: "contain", blur: true },
      { image: bdSenator75h9_2, type: "photo", fit: "contain", blur: true },
      { image: bdSenator75h9_3, type: "photo", fit: "contain", blur: true },
      { image: bdSenator75h9_4, type: "photo", fit: "contain", blur: true },
      { image: bdSenator75h9_5, type: "photo", fit: "contain", blur: true },
    ],
    likes: 39, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Мансарда"], style: "Классический", landSize: "6–10 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 140, name: "Карелия-1 7×8", badge: "Рекомендуем", price: "3 933 000 ₽",
    area: "100,15 м²", area_m2: 100.15, beds: 4, baths: 2, floors: 2, term: "от 2 мес.",
    rooms: "6 комнат", purpose: "ИЖС / СНТ", city: "Москва и МО",
    maker: { ...BEREST_DOM, siteUrl: "https://berest-dom.ru/product/nebolshie-kottedzhi/proekt-kareliya-1/" },
    description: "Полутораэтажный каркасный дом «Карелия-1» 100,15 м² размером 7 × 8 м.",
    descriptionLong: "Проект «Карелия-1» от компании «Берест»: полутораэтажный каркасный дом площадью 100,15 м², габариты 7 × 8 м. В карточке производителя указаны шесть комнат, два санузла и стоимость комплектации под ключ.",
    gallery: [
      { image: bdKareliya17h8_1, type: "photo", fit: "contain", blur: true },
      { image: bdKareliya17h8_2, type: "photo", fit: "contain" },
      { image: bdKareliya17h8_3, type: "photo", fit: "contain" },
      { image: bdKareliya17h8_4, type: "photo", fit: "contain", blur: true },
      { image: bdKareliya17h8_5, type: "photo", fit: "contain", blur: true },
    ],
    likes: 40, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Мансарда"], style: "Классический", landSize: "6–10 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 141, name: "Сенатор — 2 8,5×10,5", badge: "Новинка", price: "6 288 000 ₽",
    area: "174,5 м²", area_m2: 174.5, beds: 4, baths: 2, floors: 2, term: "от 2 мес.",
    rooms: "6 комнат", purpose: "ИЖС / СНТ", city: "Москва и МО",
    maker: { ...BEREST_DOM, siteUrl: "https://berest-dom.ru/product/dlya-PMZH/proekt-karkasnogo-doma-senator-2-8-5kh10-5/" },
    description: "Полутораэтажный каркасный дом «Сенатор — 2» 174,5 м² размером 8,5 × 10,5 м.",
    descriptionLong: "Проект «Сенатор — 2» от компании «Берест»: полутораэтажный каркасный дом площадью 174,5 м², габариты 8,5 × 10,5 м. В карточке производителя указаны шесть комнат, два санузла и стоимость комплектации под ключ.",
    gallery: [
      { image: bdSenator285h105_1, type: "photo", fit: "contain", blur: true },
      { image: bdSenator285h105_2, type: "photo", fit: "contain", blur: true },
      { image: bdSenator285h105_3, type: "photo", fit: "contain" },
      { image: bdSenator285h105_4, type: "photo", fit: "contain" },
      { image: bdSenator285h105_5, type: "photo", fit: "contain", blur: true },
    ],
    likes: 41, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для большой семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Мансарда"], style: "Классический", landSize: "10+ соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },

  // ── РИФТ · Москва и МО ────────────────────────────────────────────────────
  {
    id: 142, name: "DG51 15×8", badge: "Хит", price: "5 600 000 ₽",
    area: "129 м²", area_m2: 129, beds: 4, baths: 1, floors: 1, term: "от 45 д.",
    rooms: "4 комнаты", purpose: "ИЖС / СНТ", city: "Москва и МО",
    maker: { ...RIFT, siteUrl: "https://www.rift.ru/project/karkasnyj-dom-dg51/" },
    description: "Одноэтажный каркасный дом DG51 площадью 129 м² размером 15 × 8 м.",
    descriptionLong: "Проект DG51 от компании «РИФТ»: одноэтажный каркасный дом площадью 129 м², габариты 15 × 8 м. В карточке производителя указаны комплектации без отделки и с отделкой.",
    gallery: [
      { image: riftDg51_1, type: "photo", fit: "contain", blur: true },
      { image: riftDg51_2, type: "photo", fit: "contain", blur: true },
      { image: riftDg51_3, type: "photo", fit: "contain", blur: true },
    ],
    likes: 42, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса", "Панорамные окна"], style: "Современный", landSize: "10+ соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 143, name: "DG50 12×8", badge: "Хит", price: "4 150 000 ₽",
    area: "111 м²", area_m2: 111, beds: 3, baths: 1, floors: 1, term: "от 45 д.",
    rooms: "4 комнаты", purpose: "ИЖС / СНТ", city: "Москва и МО",
    maker: { ...RIFT, siteUrl: "https://www.rift.ru/project/karkasnyj-dom-dg50/" },
    description: "Одноэтажный каркасный дом DG50 площадью 111 м² размером 12 × 8 м.",
    descriptionLong: "Проект DG50 от компании «РИФТ»: одноэтажный каркасный дом площадью 111 м², габариты 12 × 8 м. В карточке производителя указана комплектация с отделкой стоимостью 4 150 000 ₽.",
    gallery: [
      { image: riftDg50_1, type: "photo", fit: "contain", blur: true },
      { image: riftDg50_2, type: "photo", fit: "contain", blur: true },
      { image: riftDg50_3, type: "photo", fit: "contain", blur: true },
    ],
    likes: 43, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса"], style: "Современный", landSize: "6–10 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 144, name: "XX27 10×8", badge: "Два этажа", price: "5 846 000 ₽",
    area: "158 м²", area_m2: 158, beds: 4, baths: 2, floors: 2, term: "от 45 д.",
    rooms: "6 комнат", purpose: "ИЖС / СНТ", city: "Москва и МО",
    maker: { ...RIFT, siteUrl: "https://www.rift.ru/project/karkasnyj-dom-xx27/" },
    description: "Двухэтажный каркасный дом XX27 площадью 158 м² размером 10 × 8 м.",
    descriptionLong: "Проект XX27 от компании «РИФТ»: двухэтажный каркасный дом площадью 158 м², габариты 10 × 8 м. В планировке производителя указаны шесть комнат и два санузла.",
    gallery: [
      { image: riftXx27_1, type: "photo", fit: "contain", blur: true },
      { image: riftXx27_2, type: "photo", fit: "contain", blur: true },
      { image: riftXx27_3, type: "photo", fit: "contain", blur: true },
      { image: riftXx27_4, type: "photo", fit: "contain", blur: true },
    ],
    likes: 44, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для большой семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Панорамные окна"], style: "Современный", landSize: "10+ соток",
    hasRealPhotos: true, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 145, name: "DG49 11×7", badge: "Компактный", price: "3 760 000 ₽",
    area: "79 м²", area_m2: 79, beds: 2, baths: 1, floors: 1, term: "от 45 д.",
    rooms: "3 комнаты", purpose: "ИЖС / СНТ", city: "Москва и МО",
    maker: { ...RIFT, siteUrl: "https://www.rift.ru/project/karkasnyj-dom-dg49/" },
    description: "Одноэтажный каркасный дом DG49 площадью 79 м² размером 11 × 7 м.",
    descriptionLong: "Проект DG49 от компании «РИФТ»: одноэтажный каркасный дом площадью 79 м², габариты 11 × 7 м. В планировке производителя указаны три комнаты, кухня, санузел и терраса.",
    gallery: [
      { image: riftDg49_1, type: "photo", fit: "contain", blur: true },
      { image: riftDg49_2, type: "photo", fit: "contain", blur: true },
      { image: riftDg49_3, type: "photo", fit: "contain", blur: true },
      { image: riftDg49_4, type: "photo", fit: "contain", blur: true },
      { image: riftDg49_5, type: "photo", fit: "contain", blur: true },
    ],
    likes: 45, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса"], style: "Современный", landSize: "6–10 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 146, name: "XX05 10×9", badge: "Два этажа", price: "5 907 050 ₽",
    area: "155 м²", area_m2: 155, beds: 4, baths: 2, floors: 2, term: "от 45 д.",
    rooms: "5 комнат", purpose: "ИЖС / СНТ", city: "Москва и МО",
    maker: { ...RIFT, siteUrl: "https://www.rift.ru/project/karkasnyj-dom-xx05/" },
    description: "Двухэтажный каркасный дом XX05 площадью 155 м² размером 10 × 9 м.",
    descriptionLong: "Проект XX05 от компании «РИФТ»: двухэтажный каркасный дом площадью 155 м², габариты 10 × 9 м. В карточке производителя указаны комплектации без отделки и с отделкой.",
    gallery: [
      { image: riftXx05_1, type: "photo", fit: "contain", blur: true },
      { image: riftXx05_2, type: "photo", fit: "contain", blur: true },
      { image: riftXx05_3, type: "photo", fit: "contain", blur: true },
      { image: riftXx05_4, type: "photo", fit: "contain", blur: true },
      { image: riftXx05_5, type: "photo", fit: "contain", blur: true },
    ],
    likes: 46, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для большой семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса"], style: "Классический", landSize: "10+ соток",
    hasRealPhotos: true, hasShowroom: false, hasInstallment: false,
  },

  // ── Из Бруса · Москва и МО ────────────────────────────────────────────────
  {
    id: 147, name: "КД-38 9×10,5", badge: "Жилой дом", price: "3 286 000 ₽",
    area: "105,1 м²", area_m2: 105.1, beds: 3, baths: 1, floors: 1, term: "от 2 мес.",
    rooms: "4 комнаты", purpose: "ИЖС / СНТ", city: "Москва и МО",
    maker: { ...IZBRUSA, siteUrl: "https://izbrusa.com/product/karkasnyy-dom-kd-38/" },
    description: "Одноэтажный каркасный дом КД-38 площадью 105,1 м² размером 9 × 10,5 м.",
    descriptionLong: "Проект КД-38 от компании «Из Бруса»: одноэтажный каркасный дом площадью 105,1 м², габариты 9 × 10,5 м. В карточке производителя указана терраса площадью 31,5 м².",
    gallery: [
      { image: ibKd38_1, type: "photo", fit: "contain", blur: true },
      { image: ibKd38_2, type: "photo", fit: "contain", blur: true },
    ],
    likes: 47, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса"], style: "Современный", landSize: "6–10 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 148, name: "КД-29 8,5×12", badge: "Жилой дом", price: "3 162 000 ₽",
    area: "102 м²", area_m2: 102, beds: 3, baths: 1, floors: 1, term: "от 2 мес.",
    rooms: "4 комнаты", purpose: "ИЖС / СНТ", city: "Москва и МО",
    maker: { ...IZBRUSA, siteUrl: "https://izbrusa.com/product/karkasnyj-dom-kd-29/" },
    description: "Одноэтажный каркасный дом КД-29 площадью 102 м² размером 8,5 × 12 м.",
    descriptionLong: "Проект КД-29 от компании «Из Бруса»: одноэтажный каркасный дом площадью 102 м², габариты 8,5 × 12 м. В карточке производителя указана терраса площадью 21,25 м².",
    gallery: [
      { image: ibKd29_1, type: "photo", fit: "contain", blur: true },
      { image: ibKd29_2, type: "photo", fit: "contain", blur: true },
      { image: ibKd29_3, type: "photo", fit: "contain", blur: true },
      { image: ibKd29_4, type: "photo", fit: "contain", blur: true },
      { image: ibKd29_5, type: "photo", fit: "contain", blur: true },
    ],
    likes: 48, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса"], style: "Классический", landSize: "6–10 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 149, name: "КД-41 7,5×9", badge: "Компактный", price: "1 953 000 ₽",
    area: "62,4 м²", area_m2: 62.4, beds: 2, baths: 1, floors: 1, term: "от 2 мес.",
    rooms: "3 комнаты", purpose: "ИЖС / СНТ", city: "Москва и МО",
    maker: { ...IZBRUSA, siteUrl: "https://izbrusa.com/product/karkasnyy-dom-kd-41/" },
    description: "Одноэтажный каркасный дом КД-41 площадью 62,4 м² размером 7,5 × 9 м.",
    descriptionLong: "Проект КД-41 от компании «Из Бруса»: одноэтажный каркасный дом площадью 62,4 м², габариты 7,5 × 9 м. В карточке производителя указана терраса площадью 29 м².",
    gallery: [
      { image: ibKd41_1, type: "photo", fit: "contain", blur: true },
      { image: ibKd41_2, type: "photo", fit: "contain", blur: true },
    ],
    likes: 49, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса"], style: "Классический", landSize: "3–6 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 150, name: "КД-12 7×6", badge: "С мансардой", price: "1 610 000 ₽",
    area: "70 м²", area_m2: 70, beds: 2, baths: 1, floors: 2, term: "от 2 мес.",
    rooms: "3 комнаты", purpose: "ИЖС / СНТ", city: "Москва и МО",
    maker: { ...IZBRUSA, siteUrl: "https://izbrusa.com/product/karkasnyj-dom-kd-12/" },
    description: "Каркасный дом КД-12 с мансардой площадью 70 м² размером 7 × 6 м.",
    descriptionLong: "Проект КД-12 от компании «Из Бруса»: каркасный дом с мансардой площадью 70 м², габариты 7 × 6 м. В карточке производителя указана терраса площадью 19 м².",
    gallery: [
      { image: ibKd12_1, type: "photo", fit: "contain", blur: true },
      { image: ibKd12_2, type: "photo", fit: "contain", blur: true },
      { image: ibKd12_3, type: "photo", fit: "contain", blur: true },
      { image: ibKd12_4, type: "photo", fit: "contain", blur: true },
      { image: ibKd12_5, type: "photo", fit: "contain", blur: true },
    ],
    likes: 50, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Мансарда", "Терраса"], style: "Классический", landSize: "3–6 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 151, name: "КД-36 15×8,5", badge: "Жилой дом", price: "3 968 000 ₽",
    area: "127,5 м²", area_m2: 127.5, beds: 3, baths: 1, floors: 1, term: "от 2 мес.",
    rooms: "4 комнаты", purpose: "ИЖС / СНТ", city: "Москва и МО",
    maker: { ...IZBRUSA, siteUrl: "https://izbrusa.com/product/karkasnyy-dom-kd-36/" },
    description: "Одноэтажный каркасный дом КД-36 площадью 127,5 м² размером 15 × 8,5 м.",
    descriptionLong: "Проект КД-36 от компании «Из Бруса»: одноэтажный каркасный дом площадью 127,5 м², габариты 15 × 8,5 м. В карточке производителя указаны кухня, гостиная и терраса площадью 25,92 м².",
    gallery: [
      { image: ibKd36_1, type: "photo", fit: "contain", blur: true },
      { image: ibKd36_2, type: "photo", fit: "contain", blur: true },
      { image: ibKd36_3, type: "photo", fit: "contain", blur: true },
      { image: ibKd36_4, type: "photo", fit: "contain", blur: true },
      { image: ibKd36_5, type: "photo", fit: "contain" },
    ],
    likes: 51, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса"], style: "Классический", landSize: "10+ соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },

  // ── Дома от Михалыча · Нижний Новгород ────────────────────────────────
  {
    id: 172, name: "Кулибин", badge: "Жилой дом", price: "2 730 000 ₽",
    area: "86 м²", area_m2: 86, beds: 3, baths: 1, floors: 1, term: "от 2 мес.",
    rooms: "3 комнаты", purpose: "ИЖС / СНТ", city: "Нижний Новгород",
    maker: { ...DOMA_OT_MIHALYCHA, siteUrl: "https://xn-----6kccat5azaddrd6c4b6a4d.xn--p1ai/proekty/karkasniye-doma/karkasnyy-dom-kulibin/" },
    description: "Каркасный дом 86 м² размером 9,5 × 11 м для постоянного проживания.",
    descriptionLong: "Проект «Кулибин» от «Дома от Михалыча»: каркасный дом площадью 86 м², габариты 9,5 × 11 м. В карточке производителя указана цена строительства от 2 730 000 ₽ и готовая планировка.",
    gallery: [
      { image: mihKulibin_1, type: "photo", fit: "contain", blur: true },
      { image: mihKulibin_2, type: "photo", fit: "contain", blur: true },
      { image: mihKulibin_3, type: "photo", fit: "contain", blur: true },
      { image: mihKulibinPlan, type: "photo", fit: "contain" },
    ],
    likes: 34, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Планировка"], style: "Классический", landSize: "6–10 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 173, name: "Ломоносов", badge: "Жилой дом", price: "2 060 000 ₽",
    area: "55 м²", area_m2: 55, beds: 2, baths: 1, floors: 2, term: "от 2 мес.",
    rooms: "2 комнаты", purpose: "ИЖС / СНТ", city: "Нижний Новгород",
    maker: { ...DOMA_OT_MIHALYCHA, siteUrl: "https://xn-----6kccat5azaddrd6c4b6a4d.xn--p1ai/proekty/karkasniye-doma/karkasnyy-dom-lomonosov/" },
    description: "Компактный каркасный дом 55 м² размером 6 × 6 м с двумя этажами.",
    descriptionLong: "Проект «Ломоносов» от «Дома от Михалыча»: каркасный дом площадью 55 м², габариты 6 × 6 м. В карточке производителя указана цена от 2 060 000 ₽, фото фасадов и планировки.",
    gallery: [
      { image: mihLomonosov_1, type: "photo", fit: "contain", blur: true },
      { image: mihLomonosov_2, type: "photo", fit: "contain", blur: true },
      { image: mihLomonosov_3, type: "photo", fit: "contain", blur: true },
      { image: mihLomonosovPlan1, type: "photo", fit: "contain" },
      { image: mihLomonosovPlan2, type: "photo", fit: "contain" },
    ],
    likes: 33, rating: 4.7,
    suitableFor: ["Постоянное проживание", "Выходные / дача"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Мансарда", "Планировка"], style: "Классический", landSize: "3–6 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 174, name: "Рахманинов", badge: "Жилой дом", price: "3 050 000 ₽",
    area: "86 м²", area_m2: 86, beds: 3, baths: 1, floors: 1, term: "от 2 мес.",
    rooms: "3 комнаты", purpose: "ИЖС / СНТ", city: "Нижний Новгород",
    maker: { ...DOMA_OT_MIHALYCHA, siteUrl: "https://xn-----6kccat5azaddrd6c4b6a4d.xn--p1ai/proekty/karkasniye-doma/karkasnyy-dom-rakhmaninov/" },
    description: "Одноэтажный каркасный дом 86 м² размером 14 × 8 м с готовой планировкой.",
    descriptionLong: "Проект «Рахманинов» от «Дома от Михалыча»: каркасный дом площадью 86 м², габариты 14 × 8 м. На сайте производителя указана цена от 3 050 000 ₽ и комплект фото с планом.",
    gallery: [
      { image: mihRakhmaninov_1, type: "photo", fit: "contain", blur: true },
      { image: mihRakhmaninov_2, type: "photo", fit: "contain", blur: true },
      { image: mihRakhmaninov_3, type: "photo", fit: "contain", blur: true },
      { image: mihRakhmaninovPlan, type: "photo", fit: "contain" },
    ],
    likes: 35, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Планировка"], style: "Классический", landSize: "6–10 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 175, name: "Державин", badge: "Жилой дом", price: "4 430 000 ₽",
    area: "158 м²", area_m2: 158, beds: 4, baths: 2, floors: 2, term: "от 2 мес.",
    rooms: "4 комнаты", purpose: "ИЖС", city: "Нижний Новгород",
    maker: { ...DOMA_OT_MIHALYCHA, siteUrl: "https://xn-----6kccat5azaddrd6c4b6a4d.xn--p1ai/proekty/karkasniye-doma/karkasnyy-dom-derzhavin/" },
    description: "Просторный каркасный дом 158 м² размером 10 × 12 м для большой семьи.",
    descriptionLong: "Проект «Державин» от «Дома от Михалыча»: каркасный дом площадью 158 м², габариты 10 × 12 м. В карточке производителя указана цена от 4 430 000 ₽ и несколько вариантов фасадов с планировками.",
    gallery: [
      { image: mihDerzhavin_1, type: "photo", fit: "contain", blur: true },
      { image: mihDerzhavin_2, type: "photo", fit: "contain", blur: true },
      { image: mihDerzhavin_3, type: "photo", fit: "contain", blur: true },
      { image: mihDerzhavinPlan1, type: "photo", fit: "contain" },
      { image: mihDerzhavinPlan2, type: "photo", fit: "contain" },
    ],
    likes: 37, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для большой семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Планировка"], style: "Классический", landSize: "10+ соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 176, name: "Виноградов", badge: "Жилой дом", price: "3 640 000 ₽",
    area: "109,5 м²", area_m2: 109.5, beds: 3, baths: 1, floors: 1, term: "от 2 мес.",
    rooms: "3 комнаты", purpose: "ИЖС / СНТ", city: "Нижний Новгород",
    maker: { ...DOMA_OT_MIHALYCHA, siteUrl: "https://xn-----6kccat5azaddrd6c4b6a4d.xn--p1ai/proekty/karkasniye-doma/karkasnyy-dom-vinogradov/" },
    description: "Одноэтажный каркасный дом 109,5 м² размером 12 × 12,5 м.",
    descriptionLong: "Проект «Виноградов» от «Дома от Михалыча»: каркасный дом площадью 109,5 м², габариты 12 × 12,5 м. В карточке производителя указана цена от 3 640 000 ₽, фото фасадов и план.",
    gallery: [
      { image: mihVinogradov_1, type: "photo", fit: "contain", blur: true },
      { image: mihVinogradov_2, type: "photo", fit: "contain", blur: true },
      { image: mihVinogradov_3, type: "photo", fit: "contain", blur: true },
      { image: mihVinogradovPlan, type: "photo", fit: "contain" },
    ],
    likes: 36, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Планировка"], style: "Классический", landSize: "6–10 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },

  // ── Barn Studio · Нижний Новгород ──────────────────────────────────────
  {
    id: 177, name: "Опти", badge: "Барнхаус", price: "4 000 000 ₽",
    area: "120 м²", area_m2: 120, beds: 2, baths: 1, floors: 1, term: "от 2 мес.",
    rooms: "2 спальни", purpose: "ИЖС / СНТ", city: "Нижний Новгород",
    maker: { ...BARNSTUDIO, siteUrl: "https://barnstudio.ru/barnhouse/opti" },
    description: "Одноэтажный барнхаус 120 м² с панорамными окнами, террасой и утеплением до −40°C.",
    descriptionLong: "Проект «Опти» от Barn Studio: теплый каркасный дом в стиле барнхаус для круглогодичного проживания. Базовый вариант — 120 м², 2 спальни, 1 санузел и терраса; на сайте производителя также представлены варианты планировки до 164 м².",
    gallery: [
      { image: bsOpti_1, type: "photo", fit: "contain", blur: true },
      { image: bsOpti_2, type: "photo", fit: "contain", blur: true },
      { image: bsOpti_3, type: "photo", fit: "contain", blur: true },
      { image: bsOpti_4, type: "photo", fit: "contain", blur: true },
      { image: bsOpti_5, type: "photo", fit: "contain", blur: true },
      { image: bsOpti_6, type: "photo", fit: "contain", blur: true },
      { image: bsOptiPlan, type: "photo", fit: "contain" },
    ],
    likes: 38, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −40°C",
    features: ["Терраса", "Панорамные окна", "Планировка"], style: "Барнхаус", landSize: "6–10 соток",
    hasRealPhotos: false, hasShowroom: true, hasInstallment: false,
  },
  {
    id: 178, name: "Адель", badge: "Барнхаус", price: "4 650 000 ₽",
    area: "94 м²", area_m2: 94, beds: 3, baths: 1, floors: 1, term: "от 2 мес.",
    rooms: "3 спальни", purpose: "ИЖС / СНТ", city: "Нижний Новгород",
    maker: { ...BARNSTUDIO, siteUrl: "https://barnstudio.ru/barnhouse/adel" },
    description: "Одноэтажный барнхаус 94 м² с тремя спальнями, гостиной, кухней и санузлом.",
    descriptionLong: "Проект «Адель» от Barn Studio: современный одноэтажный каркасный дом по технологии Prefab площадью 94 м² для круглогодичного проживания. В планировке три спальни, гостиная, кухня и санузел, а панорамные окна наполняют дом светом.",
    gallery: [
      { image: bsAdel_1, type: "photo", fit: "contain", blur: true },
      { image: bsAdel_2, type: "photo", fit: "contain", blur: true },
      { image: bsAdel_3, type: "photo", fit: "contain", blur: true },
      { image: bsAdel_4, type: "photo", fit: "contain", blur: true },
      { image: bsAdel_5, type: "photo", fit: "contain", blur: true },
      { image: bsAdel_6, type: "photo", fit: "contain", blur: true },
      { image: bsAdelPlan, type: "photo", fit: "contain" },
    ],
    likes: 36, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −40°C",
    features: ["Панорамные окна", "Планировка"], style: "Барнхаус", landSize: "6–10 соток",
    hasRealPhotos: false, hasShowroom: true, hasInstallment: false,
  },
  {
    id: 179, name: "Альпина", badge: "Барнхаус", price: "7 700 000 ₽",
    area: "220 м²", area_m2: 220, beds: 4, baths: 3, floors: 2, term: "от 2 мес.",
    rooms: "4 спальни", purpose: "ИЖС", city: "Нижний Новгород",
    maker: { ...BARNSTUDIO, siteUrl: "https://barnstudio.ru/barnhouse/alpina" },
    description: "Двухэтажный барнхаус 220 м² с четырьмя спальнями, тремя санузлами и панорамным остеклением.",
    descriptionLong: "Проект «Альпина» от Barn Studio: просторный двухэтажный каркасный дом по технологии Prefab для круглогодичного проживания. В планировке четыре спальни, гостиная, кухня и три санузла, жилая площадь на сайте производителя указана 220 м².",
    gallery: [
      { image: bsAlpina_1, type: "photo", fit: "contain", blur: true },
      { image: bsAlpina_2, type: "photo", fit: "contain", blur: true },
      { image: bsAlpina_3, type: "photo", fit: "contain", blur: true },
      { image: bsAlpina_4, type: "photo", fit: "contain", blur: true },
      { image: bsAlpina_5, type: "photo", fit: "contain", blur: true },
      { image: bsAlpina_6, type: "photo", fit: "contain", blur: true },
      { image: bsAlpinaPlan, type: "photo", fit: "contain" },
    ],
    likes: 41, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для большой семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −40°C",
    features: ["Панорамные окна", "Планировка"], style: "Барнхаус", landSize: "10+ соток",
    hasRealPhotos: false, hasShowroom: true, hasInstallment: false,
  },
  {
    id: 180, name: "Антресоль", badge: "Барнхаус", price: "3 200 000 ₽",
    area: "84 м²", area_m2: 84, beds: 2, baths: 1, floors: 2, term: "от 2 мес.",
    rooms: "2 спальни", purpose: "ИЖС / СНТ", city: "Нижний Новгород",
    maker: { ...BARNSTUDIO, siteUrl: "https://barnstudio.ru/barnhouse/antresol" },
    description: "Компактный барнхаус 84 м² с антресолью, двумя спальнями и панорамным остеклением.",
    descriptionLong: "Проект «Антресоль» от Barn Studio: уютный каркасный дом 1,5 этажа для круглогодичного проживания. Жилая площадь 84 м², в планировке две спальни, гостиная, кухня и санузел; формат с антресолью подходит для небольшой семьи.",
    gallery: [
      { image: bsAntresol_1, type: "photo", fit: "contain", blur: true },
      { image: bsAntresol_2, type: "photo", fit: "contain", blur: true },
      { image: bsAntresol_3, type: "photo", fit: "contain", blur: true },
      { image: bsAntresol_4, type: "photo", fit: "contain", blur: true },
      { image: bsAntresol_5, type: "photo", fit: "contain", blur: true },
      { image: bsAntresol_6, type: "photo", fit: "contain", blur: true },
      { image: bsAntresolPlan, type: "photo", fit: "contain" },
    ],
    likes: 35, rating: 4.7,
    suitableFor: ["Постоянное проживание", "Выходные / дача"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −40°C",
    features: ["Антресоль", "Панорамные окна", "Планировка"], style: "Барнхаус", landSize: "3–6 соток",
    hasRealPhotos: false, hasShowroom: true, hasInstallment: false,
  },
  {
    id: 181, name: "Вижн", badge: "Барнхаус", price: "7 400 000 ₽",
    area: "165 м²", area_m2: 165, beds: 1, baths: 2, floors: 2, term: "от 2 мес.",
    rooms: "1 спальня", purpose: "ИЖС", city: "Нижний Новгород",
    maker: { ...BARNSTUDIO, siteUrl: "https://barnstudio.ru/barnhouse/vizhn" },
    description: "Двухэтажный барнхаус 165 м² со свободной светлой планировкой и двумя санузлами.",
    descriptionLong: "Проект «Вижн» от Barn Studio: просторный двухэтажный каркасный дом для круглогодичного проживания. Жилая площадь 165 м², в планировке спальня, гостиная, кухня и два санузла; проект рассчитан на светлое открытое пространство.",
    gallery: [
      { image: bsVizhn_1, type: "photo", fit: "contain", blur: true },
      { image: bsVizhn_2, type: "photo", fit: "contain", blur: true },
      { image: bsVizhn_3, type: "photo", fit: "contain", blur: true },
      { image: bsVizhn_4, type: "photo", fit: "contain", blur: true },
      { image: bsVizhn_5, type: "photo", fit: "contain", blur: true },
      { image: bsVizhn_6, type: "photo", fit: "contain", blur: true },
      { image: bsVizhnPlan, type: "photo", fit: "contain" },
    ],
    likes: 39, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −40°C",
    features: ["Панорамные окна", "Планировка"], style: "Барнхаус", landSize: "10+ соток",
    hasRealPhotos: false, hasShowroom: true, hasInstallment: false,
  },

  // ── Белый дом · Нижний Новгород ───────────────────────────────────────
  {
    id: 182, name: "Валдай", badge: "Загородный дом", price: "3 535 315 ₽",
    area: "100,1 м²", area_m2: 100.1, beds: 3, baths: 1, floors: 1, term: "30–45 д.",
    rooms: "3 спальни", purpose: "ИЖС / СНТ", city: "Нижний Новгород",
    maker: { ...BELI_DOM, siteUrl: "https://beli-dom.ru/catalog/valdaj_zhiloy_dom/" },
    description: "Одноэтажный каркасный дом 100,1 м² с тремя спальнями, кухней-гостиной и готовой планировкой.",
    descriptionLong: "Проект «Валдай» от СК «Белый дом»: одноэтажный каркасный загородный дом 100,1 м² для постоянного проживания. В планировке три спальни, кухня-гостиная, санузел и компактные хозяйственные зоны; строительство на сайте производителя указано 30–45 дней.",
    gallery: [
      { image: bdValdaj_1, type: "photo", fit: "contain", blur: true },
      { image: bdValdaj_2, type: "photo", fit: "contain", blur: true },
      { image: bdValdaj_3, type: "photo", fit: "contain", blur: true },
      { image: bdValdaj_4, type: "photo", fit: "contain", blur: true },
      { image: bdValdaj_5, type: "photo", fit: "contain", blur: true },
      { image: bdValdaj_6, type: "photo", fit: "contain", blur: true },
      { image: bdValdajPlan, type: "photo", fit: "contain" },
    ],
    likes: 37, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Панорамные окна", "Планировка"], style: "Барнхаус", landSize: "6–10 соток",
    hasRealPhotos: false, hasShowroom: true, hasInstallment: true,
  },
  {
    id: 183, name: "Семейный", badge: "Загородный дом", price: "3 212 028 ₽",
    area: "126 м²", area_m2: 126, beds: 4, baths: 2, floors: 2, term: "30–45 д.",
    rooms: "4 спальни", purpose: "ИЖС", city: "Нижний Новгород",
    maker: { ...BELI_DOM, siteUrl: "https://beli-dom.ru/catalog/semejnyj_zhiloy_dom/" },
    description: "Двухэтажный каркасный дом 126 м² с четырьмя спальнями, двумя санузлами и балконом.",
    descriptionLong: "Проект «Семейный» от СК «Белый дом»: двухэтажный каркасный дом 126 м² для большой семьи. В планировке четыре спальни, два санузла, кухня-гостиная, хозяйственные помещения и балкон; проект представлен с фотографиями построенного дома и планами двух этажей.",
    gallery: [
      { image: bdSemejnyj_1, type: "photo", fit: "contain", blur: true },
      { image: bdSemejnyj_2, type: "photo", fit: "contain", blur: true },
      { image: bdSemejnyj_3, type: "photo", fit: "contain", blur: true },
      { image: bdSemejnyj_4, type: "photo", fit: "contain", blur: true },
      { image: bdSemejnyj_5, type: "photo", fit: "contain", blur: true },
      { image: bdSemejnyj_6, type: "photo", fit: "contain", blur: true },
      { image: bdSemejnyjPlan1, type: "photo", fit: "contain" },
      { image: bdSemejnyjPlan2, type: "photo", fit: "contain" },
    ],
    likes: 42, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для большой семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Балкон", "Планировка"], style: "Классический", landSize: "6–10 соток",
    hasRealPhotos: true, hasShowroom: true, hasInstallment: true,
  },
  {
    id: 184, name: "Традиция", badge: "Загородный дом", price: "2 205 216 ₽",
    area: "72,75 м²", area_m2: 72.75, beds: 2, baths: 1, floors: 2, term: "30–45 д.",
    rooms: "2 спальни", purpose: "ИЖС / СНТ", city: "Нижний Новгород",
    maker: { ...BELI_DOM, siteUrl: "https://beli-dom.ru/catalog/tradicziya/" },
    description: "Компактный двухэтажный каркасный дом 72,75 м² с террасой, балконом и двумя спальнями.",
    descriptionLong: "Проект «Традиция» от СК «Белый дом»: компактный каркасный загородный дом 72,75 м² с линейными размерами 6,0 × 8,5 м. Планировка рассчитана на две спальни, санузел, террасу и балкон, поэтому дом подходит для постоянного проживания или дачного формата.",
    gallery: [
      { image: bdTradicziya_1, type: "photo", fit: "contain", blur: true },
      { image: bdTradicziya_2, type: "photo", fit: "contain", blur: true },
      { image: bdTradicziya_3, type: "photo", fit: "contain", blur: true },
      { image: bdTradicziya_4, type: "photo", fit: "contain", blur: true },
      { image: bdTradicziya_5, type: "photo", fit: "contain", blur: true },
      { image: bdTradicziyaPlan1, type: "photo", fit: "contain" },
      { image: bdTradicziyaPlan2, type: "photo", fit: "contain" },
    ],
    likes: 35, rating: 4.7,
    suitableFor: ["Постоянное проживание", "Выходные / дача"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса", "Балкон", "Планировка"], style: "Классический", landSize: "3–6 соток",
    hasRealPhotos: false, hasShowroom: true, hasInstallment: true,
  },
  {
    id: 185, name: "Каролина", badge: "Загородный дом", price: "2 920 000 ₽",
    area: "113 м²", area_m2: 113, beds: 3, baths: 1, floors: 2, term: "30–45 д.",
    rooms: "3 спальни", purpose: "ИЖС / СНТ", city: "Нижний Новгород",
    maker: { ...BELI_DOM, siteUrl: "https://beli-dom.ru/catalog/karolina_zhiloy_dom/" },
    description: "Двухэтажный каркасный дом 113 м² с тремя спальнями, санузлом и балконом.",
    descriptionLong: "Проект «Каролина» от СК «Белый дом»: двухэтажный каркасный загородный дом 113 м² с линейными размерами 6,0 × 9,0 м. Планировка включает три спальни, санузел, кухню-гостиную и балкон, а сезонные визуализации показывают дом в разных вариантах окружения.",
    gallery: [
      { image: bdKarolina_1, type: "photo", fit: "contain", blur: true },
      { image: bdKarolina_2, type: "photo", fit: "contain", blur: true },
      { image: bdKarolina_3, type: "photo", fit: "contain", blur: true },
      { image: bdKarolina_4, type: "photo", fit: "contain", blur: true },
      { image: bdKarolina_5, type: "photo", fit: "contain", blur: true },
      { image: bdKarolinaPlan1, type: "photo", fit: "contain" },
      { image: bdKarolinaPlan2, type: "photo", fit: "contain" },
    ],
    likes: 36, rating: 4.7,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Балкон", "Планировка"], style: "Классический", landSize: "6–10 соток",
    hasRealPhotos: false, hasShowroom: true, hasInstallment: true,
  },
  {
    id: 186, name: "Триумф", badge: "Загородный дом", price: "3 298 464 ₽",
    area: "86 м²", area_m2: 86, beds: 2, baths: 1, floors: 1, term: "30–45 д.",
    rooms: "2 спальни", purpose: "ИЖС / СНТ", city: "Нижний Новгород",
    maker: { ...BELI_DOM, siteUrl: "https://beli-dom.ru/catalog/triumf_zhiloy_dom/" },
    description: "Одноэтажный каркасный дом 86 м² с двумя спальнями, террасой и удобной планировкой без лестниц.",
    descriptionLong: "Проект «Триумф» от СК «Белый дом»: современный одноэтажный каркасный загородный дом 86 м² с линейными размерами 9,5 × 10,0 м. В доме две спальни, санузел, кухня-гостиная и терраса; формат без лестниц удобен для семей с детьми и старшего поколения.",
    gallery: [
      { image: bdTriumf_1, type: "photo", fit: "contain", blur: true },
      { image: bdTriumf_2, type: "photo", fit: "contain", blur: true },
      { image: bdTriumfPlan, type: "photo", fit: "contain" },
    ],
    likes: 34, rating: 4.7,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса", "Планировка"], style: "Современный", landSize: "6–10 соток",
    hasRealPhotos: false, hasShowroom: true, hasInstallment: true,
  },

  // ── МастерГруппБарнаул · Алтайский край ───────────────────────────────
  {
    id: 192, name: "Англия", badge: "Спецпредложение", price: "2 604 841 ₽",
    area: "62,02 м²", area_m2: 62.02, beds: 2, baths: 1, floors: 1, term: "от 2 мес.",
    rooms: "2 комнаты", purpose: "ИЖС / СНТ", city: "Алтайский край",
    maker: { ...MASTERGRUPP_BARNAUL, siteUrl: "https://stroy-dom-barnaul.ru/building/1623/" },
    description: "Каркасный дом 62,02 м² размером 9 × 6 м с мансардой и крыльцом.",
    descriptionLong: "Проект «Англия» от компании «МастерГруппБарнаул»: каркасный дом площадью 62,02 м², габариты 9 × 6 м. В планировке две комнаты, кухня, санузел и жилая мансарда; на сайте производителя указана специальная цена строительства.",
    gallery: [
      { image: mgbAngliya_1, type: "photo", fit: "contain", blur: true },
      { image: mgbAngliya_2, type: "photo", fit: "contain", blur: true },
      { image: mgbAngliya_3, type: "photo", fit: "contain", blur: true },
      { image: mgbAngliya_4, type: "photo", fit: "contain", blur: true },
      { image: mgbAngliya_5, type: "photo", fit: "contain", blur: true },
      { image: mgbAngliyaPlan1, type: "photo", fit: "contain" },
      { image: mgbAngliyaPlan2, type: "photo", fit: "contain" },
    ],
    likes: 32, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Выходные / дача"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Мансарда", "Крыльцо"], style: "Классический", landSize: "3–6 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 193, name: "Клавдия", badge: "Спецпредложение", price: "2 612 401 ₽",
    area: "62,2 м²", area_m2: 62.2, beds: 2, baths: 1, floors: 1, term: "от 2 мес.",
    rooms: "2 комнаты", purpose: "ИЖС / СНТ", city: "Алтайский край",
    maker: { ...MASTERGRUPP_BARNAUL, siteUrl: "https://stroy-dom-barnaul.ru/building/1515/" },
    description: "Одноэтажный каркасный дом 62,2 м² размером 9 × 8 м с двумя спальнями.",
    descriptionLong: "Проект «Клавдия» от компании «МастерГруппБарнаул»: одноэтажный каркасный дом площадью 62,2 м², габариты 9 × 8 м. Планировка включает две спальни, гостиную, кухню, санузел и прихожую, а галерея содержит план фундамента и разрез дома.",
    gallery: [
      { image: mgbKlavdiya_1, type: "photo", fit: "contain", blur: true },
      { image: mgbKlavdiyaFoundation, type: "photo", fit: "contain" },
      { image: mgbKlavdiyaPlan, type: "photo", fit: "contain" },
      { image: mgbKlavdiyaSection, type: "photo", fit: "contain" },
    ],
    likes: 31, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Планировка"], style: "Классический", landSize: "3–6 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 194, name: "Вуд", badge: "Хит", price: "2 612 401 ₽",
    area: "62,2 м²", area_m2: 62.2, beds: 2, baths: 1, floors: 1, term: "от 2 мес.",
    rooms: "2 комнаты", purpose: "ИЖС / СНТ", city: "Алтайский край",
    maker: { ...MASTERGRUPP_BARNAUL, siteUrl: "https://stroy-dom-barnaul.ru/building/1526/" },
    description: "Одноэтажный каркасный дом 62,2 м² размером 8 × 9 м с навесом и двумя спальнями.",
    descriptionLong: "Проект «Вуд» от компании «МастерГруппБарнаул»: одноэтажный каркасный дом площадью 62,2 м², габариты 8 × 9 м. В доме предусмотрены две спальни, кухня, гостиная, санузел и прихожая, а к фасаду примыкает просторный навес.",
    gallery: [
      { image: mgbVud_1, type: "photo", fit: "contain", blur: true },
      { image: mgbVud_2, type: "photo", fit: "contain", blur: true },
      { image: mgbVudFoundation, type: "photo", fit: "contain" },
      { image: mgbVudPlan, type: "photo", fit: "contain" },
      { image: mgbVudSection, type: "photo", fit: "contain" },
    ],
    likes: 34, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Навес", "Планировка"], style: "Классический", landSize: "3–6 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 195, name: "Бриксия", badge: "Спецпредложение", price: "2 738 820 ₽",
    area: "65,21 м²", area_m2: 65.21, beds: 2, baths: 1, floors: 2, term: "от 2 мес.",
    rooms: "2 комнаты", purpose: "ИЖС / СНТ", city: "Алтайский край",
    maker: { ...MASTERGRUPP_BARNAUL, siteUrl: "https://stroy-dom-barnaul.ru/building/1616/" },
    description: "Двухэтажный каркасный дом 65,21 м² размером 8 × 6 м с мансардой и террасой.",
    descriptionLong: "Проект «Бриксия» от компании «МастерГруппБарнаул»: двухэтажный каркасный дом площадью 65,21 м², габариты 8 × 6 м. На первом этаже расположены кухня-гостиная и санузел, на мансардном этаже — спальня и дополнительная комната.",
    gallery: [
      { image: mgbBriksiya_1, type: "photo", fit: "contain", blur: true },
      { image: mgbBriksiya_2, type: "photo", fit: "contain", blur: true },
      { image: mgbBriksiyaPlan2, type: "photo", fit: "contain" },
      { image: mgbBriksiya_3, type: "photo", fit: "contain", blur: true },
      { image: mgbBriksiya_4, type: "photo", fit: "contain", blur: true },
      { image: mgbBriksiya_5, type: "photo", fit: "contain", blur: true },
      { image: mgbBriksiyaPlan1, type: "photo", fit: "contain" },
    ],
    likes: 33, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Выходные / дача"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Мансарда", "Терраса"], style: "Классический", landSize: "3–6 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 196, name: "Бурлаков", badge: "Жилой дом", price: "2 864 400 ₽",
    area: "68,2 м²", area_m2: 68.2, beds: 3, baths: 1, floors: 2, term: "от 2 мес.",
    rooms: "3 комнаты", purpose: "ИЖС / СНТ", city: "Алтайский край",
    maker: { ...MASTERGRUPP_BARNAUL, siteUrl: "https://stroy-dom-barnaul.ru/building/75/" },
    description: "Двухэтажный каркасный дом 68,2 м² размером 7 × 11 м с мансардой и эркером.",
    descriptionLong: "Проект «Бурлаков» от компании «МастерГруппБарнаул»: двухэтажный каркасный дом площадью 68,2 м², габариты 7 × 11 м. Планировка включает кухню, гостиную с эркером, санузел и две спальни на мансардном этаже.",
    gallery: [
      { image: mgbBurlakov_1, type: "photo", fit: "contain", blur: true },
      { image: mgbBurlakov_2, type: "photo", fit: "contain", blur: true },
      { image: mgbBurlakov_3, type: "photo", fit: "contain", blur: true },
      { image: mgbBurlakovPlan1, type: "photo", fit: "contain" },
      { image: mgbBurlakovPlan2, type: "photo", fit: "contain" },
    ],
    likes: 35, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Каркасный", completion: "Под ключ", insulation: "до −30°C",
    features: ["Мансарда", "Эркер"], style: "Классический", landSize: "3–6 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  // ── Практика Строй · Санкт-Петербург и ЛО ──────────────────────────────
  {
    id: 237, name: "Практик 2.1", badge: "Модульный дом", price: "3 390 000 ₽",
    area: "40,9 м²", area_m2: 40.9, beds: 1, baths: 1, floors: 1, term: "от 1 мес.",
    rooms: "1 спальня", purpose: "ИЖС / СНТ", city: "Санкт-Петербург и ЛО",
    maker: { ...PRAKTIKA_STROY, siteUrl: "https://praktika-stroy.ru/modulnye-doma/modulniy-dom-praktik-2-0" },
    description: "Компактный модульный дом серии «Практик 2.0» площадью 40,9 м² с террасой 11 м².",
    descriptionLong: "Проект «Практик 2.1» от компании «Практика Строй»: модульный дом для круглогодичного проживания площадью 40,9 м². На странице производителя указаны жилая площадь 23,8 м² и терраса 11 м²; дом строится на собственном производстве и поставляется с отделкой и инженерными системами.",
    gallery: [
      { image: psPraktik21_1, type: "photo", fit: "contain", blur: true },
      { image: psPraktik21_2, type: "photo", fit: "contain", blur: true },
      { image: psPraktik21_3, type: "photo", fit: "contain", blur: true },
    ],
    likes: 39, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для одного / пары", "Выходные / дача"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса", "Готовый санузел"], style: "Современный", landSize: "3–6 соток",
    hasRealPhotos: true, hasShowroom: true, hasInstallment: true,
  },
  {
    id: 238, name: "Практик 2.2", badge: "Модульный дом", price: "3 390 000 ₽",
    area: "44,5 м²", area_m2: 44.5, beds: 1, baths: 1, floors: 1, term: "от 1 мес.",
    rooms: "1 спальня", purpose: "ИЖС / СНТ", city: "Санкт-Петербург и ЛО",
    maker: { ...PRAKTIKA_STROY, siteUrl: "https://praktika-stroy.ru/modulnye-doma/modulniy-dom-praktik-2-0" },
    description: "Одноэтажный модульный дом 44,5 м² серии «Практик 2.0» с террасой и увеличенной жилой зоной.",
    descriptionLong: "Проект «Практик 2.2» от «Практика Строй»: модульный дом площадью 44,5 м² для круглогодичного проживания. В карточке серии указаны жилая площадь 27,4 м² и терраса 11 м²; формат подходит для дачи, гостевого дома или компактного постоянного проживания.",
    gallery: [
      { image: psPraktik22_1, type: "photo", fit: "contain", blur: true },
      { image: psPraktik22_2, type: "photo", fit: "contain", blur: true },
      { image: psPraktik21_3, type: "photo", fit: "contain", blur: true },
    ],
    likes: 40, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для одного / пары", "Выходные / дача"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса", "Готовый санузел"], style: "Современный", landSize: "3–6 соток",
    hasRealPhotos: true, hasShowroom: true, hasInstallment: true,
  },
  {
    id: 239, name: "Практик 2.3", badge: "Модульный дом", price: "3 390 000 ₽",
    area: "48,2 м²", area_m2: 48.2, beds: 1, baths: 1, floors: 1, term: "от 1 мес.",
    rooms: "2 комнаты", purpose: "ИЖС / СНТ", city: "Санкт-Петербург и ЛО",
    maker: { ...PRAKTIKA_STROY, siteUrl: "https://praktika-stroy.ru/modulnye-doma/modulniy-dom-praktik-2-0" },
    description: "Модульный дом 48,2 м² с террасой 11 м² и жилой площадью 30 м².",
    descriptionLong: "Проект «Практик 2.3» от «Практика Строй»: одноэтажный модульный дом серии «Практик 2.0» площадью 48,2 м². На сайте производителя указаны жилая площадь 30 м² и терраса 11 м²; дом рассчитан на быстрый монтаж и эксплуатацию круглый год.",
    gallery: [
      { image: psPraktik23_1, type: "photo", fit: "contain", blur: true },
      { image: psPraktik23_2, type: "photo", fit: "contain", blur: true },
      { image: psPraktik21_3, type: "photo", fit: "contain", blur: true },
    ],
    likes: 41, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для одного / пары", "Выходные / дача"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса", "Готовый санузел"], style: "Современный", landSize: "3–6 соток",
    hasRealPhotos: true, hasShowroom: true, hasInstallment: true,
  },
  {
    id: 240, name: "Практик 3.1", badge: "Модульный дом", price: "4 330 000 ₽",
    area: "59,1 м²", area_m2: 59.1, beds: 2, baths: 1, floors: 1, term: "от 1 мес.",
    rooms: "2 спальни", purpose: "ИЖС / СНТ", city: "Санкт-Петербург и ЛО",
    maker: { ...PRAKTIKA_STROY, siteUrl: "https://praktika-stroy.ru/modulnye-doma/modulniy-dom-praktik-3-0" },
    description: "Модульный дом серии «Практик 3.0» площадью 59,1 м² с террасой 14,64 м².",
    descriptionLong: "Проект «Практик 3.1» от «Практика Строй»: модульный дом для круглогодичного проживания площадью 59,1 м². В серии указаны жилая площадь 36,7 м² и терраса 14,64 м²; дом подходит для семьи и поставляется с отделкой и инженерными системами.",
    gallery: [
      { image: psPraktik31_1, type: "photo", fit: "contain", blur: true },
      { image: psPraktik31_2, type: "photo", fit: "contain", blur: true },
      { image: psPraktik31_3, type: "photo", fit: "contain", blur: true },
    ],
    likes: 42, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса", "Готовый санузел"], style: "Современный", landSize: "6–10 соток",
    hasRealPhotos: true, hasShowroom: true, hasInstallment: true,
  },
  {
    id: 241, name: "Практик 3.2", badge: "Модульный дом", price: "4 330 000 ₽",
    area: "66,4 м²", area_m2: 66.4, beds: 2, baths: 1, floors: 1, term: "от 1 мес.",
    rooms: "2 спальни", purpose: "ИЖС / СНТ", city: "Санкт-Петербург и ЛО",
    maker: { ...PRAKTIKA_STROY, siteUrl: "https://praktika-stroy.ru/modulnye-doma/modulniy-dom-praktik-3-0" },
    description: "Модульный дом 66,4 м² с жилой площадью 42,3 м² и террасой 14,64 м².",
    descriptionLong: "Проект «Практик 3.2» от «Практика Строй»: дом серии «Практик 3.0» площадью 66,4 м² для круглогодичного проживания. В карточке серии указаны жилая площадь 42,3 м² и терраса 14,64 м²; решение рассчитано на семью и быстрое размещение на участке.",
    gallery: [
      { image: psPraktik32_1, type: "photo", fit: "contain", blur: true },
      { image: psPraktik32_2, type: "photo", fit: "contain", blur: true },
      { image: psPraktik31_3, type: "photo", fit: "contain", blur: true },
    ],
    likes: 43, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса", "Готовый санузел"], style: "Современный", landSize: "6–10 соток",
    hasRealPhotos: true, hasShowroom: true, hasInstallment: true,
  },

  // ── Eco-City · Санкт-Петербург и ЛО ────────────────────────────────────
  {
    id: 242, name: "Мга", badge: "СИП-Префаб", price: "761 970 ₽",
    area: "37,5 м²", area_m2: 37.5, beds: 1, baths: 1, floors: 1, term: "от 1 мес.",
    rooms: "1 спальня", purpose: "ИЖС / СНТ", city: "Санкт-Петербург и ЛО",
    maker: { ...ECO_CITY, siteUrl: "https://eco-city.spb.ru/products/mga/" },
    description: "Небольшой одноэтажный дом из СИП-панелей 37,5 м² с одной спальней и кухней.",
    descriptionLong: "Проект «Мга» от Eco-City: дом из СИП-панелей площадью 37,5 м², габариты 7,5 × 5 м. На сайте производителя указаны жилая площадь 31,68 м², один санузел и несколько вариантов комплектации домокомплекта.",
    gallery: [
      { image: ecMga1, type: "photo", fit: "contain", blur: true },
      { image: ecMga2, type: "photo", fit: "contain", blur: true },
      { image: ecMga3, type: "photo", fit: "contain", blur: true },
    ],
    likes: 34, rating: 4.7,
    suitableFor: ["Выходные / дача", "Для одного / пары"],
    technology: "СИП-Префаб", completion: "Только корпус", insulation: "до −30°C",
    features: ["Компактный дом"], style: "Классический", landSize: "3–6 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 243, name: "Дунай", badge: "СИП-Префаб", price: "983 780 ₽",
    area: "53,12 м²", area_m2: 53.12, beds: 2, baths: 1, floors: 2, term: "от 1 мес.",
    rooms: "2 спальни", purpose: "ИЖС / СНТ", city: "Санкт-Петербург и ЛО",
    maker: { ...ECO_CITY, siteUrl: "https://eco-city.spb.ru/products/dunay/" },
    description: "Двухэтажный дом из СИП-панелей 53,12 м² для небольшого участка.",
    descriptionLong: "Проект «Дунай» от Eco-City: дом из СИП-панелей площадью 53,12 м², габариты 5 × 5 м. В планировке две спальни на втором этаже, кухня-гостиная на первом этаже и один санузел.",
    gallery: [
      { image: ecDunay1, type: "photo", fit: "contain", blur: true },
      { image: ecDunay2, type: "photo", fit: "contain", blur: true },
      { image: ecDunay3, type: "photo", fit: "contain", blur: true },
    ],
    likes: 35, rating: 4.7,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "СИП-Префаб", completion: "Только корпус", insulation: "до −30°C",
    features: ["Два этажа"], style: "Классический", landSize: "3–6 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 244, name: "Ламми", badge: "СИП-Префаб", price: "1 218 720 ₽",
    area: "86,4 м²", area_m2: 86.4, beds: 3, baths: 1, floors: 2, term: "от 1 мес.",
    rooms: "3 спальни", purpose: "ИЖС / СНТ", city: "Санкт-Петербург и ЛО",
    maker: { ...ECO_CITY, siteUrl: "https://eco-city.spb.ru/products/lammi/" },
    description: "Двухэтажный дом из СИП-панелей 86,4 м² с кровлей клик-фальц.",
    descriptionLong: "Проект «Ламми» от Eco-City: дом из СИП-панелей площадью 86,4 м², габариты 9,5 × 5 м. На сайте указаны жилая площадь 47,01 м², два этажа и один санузел.",
    gallery: [
      { image: ecLammi1, type: "photo", fit: "contain", blur: true },
      { image: ecLammi2, type: "photo", fit: "contain", blur: true },
      { image: ecLammi3, type: "photo", fit: "contain", blur: true },
    ],
    likes: 36, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "СИП-Префаб", completion: "Только корпус", insulation: "до −30°C",
    features: ["Два этажа"], style: "Современный", landSize: "6–10 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 245, name: "Иматра", badge: "СИП-Префаб", price: "1 190 275 ₽",
    area: "59,62 м²", area_m2: 59.62, beds: 2, baths: 1, floors: 1, term: "от 1 мес.",
    rooms: "2 спальни", purpose: "ИЖС / СНТ", city: "Санкт-Петербург и ЛО",
    maker: { ...ECO_CITY, siteUrl: "https://eco-city.spb.ru/products/imatra/" },
    description: "Популярный одноэтажный СИП-дом 59,62 м² для дачи и загородного проживания.",
    descriptionLong: "Проект «Иматра» от Eco-City: одноэтажный дом из СИП-панелей площадью 59,62 м², габариты 8,75 × 8,55 м. Производитель отмечает лаконичную планировку и набор помещений для небольшого загородного дома.",
    gallery: [
      { image: ecImatra1, type: "photo", fit: "contain", blur: true },
      { image: ecImatra2, type: "photo", fit: "contain", blur: true },
      { image: ecImatra3, type: "photo", fit: "contain", blur: true },
    ],
    likes: 37, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Выходные / дача", "Для семьи"],
    technology: "СИП-Префаб", completion: "Только корпус", insulation: "до −30°C",
    features: ["Компактный дом"], style: "Классический", landSize: "6–10 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 246, name: "Лахти", badge: "СИП-Префаб", price: "1 383 150 ₽",
    area: "95 м²", area_m2: 95, beds: 2, baths: 1, floors: 1, term: "от 1 мес.",
    rooms: "2 спальни", purpose: "ИЖС / СНТ", city: "Санкт-Петербург и ЛО",
    maker: { ...ECO_CITY, siteUrl: "https://eco-city.spb.ru/products/lahti/" },
    description: "Одноэтажный СИП-дом 95 м² с сауной, которую можно заменить котельной.",
    descriptionLong: "Проект «Лахти» от Eco-City: одноэтажный дом из СИП-панелей площадью 95 м², габариты 10 × 9,5 м. На сайте производителя указаны жилая площадь 62,96 м², один санузел и помещение сауны.",
    gallery: [
      { image: ecLahti1, type: "photo", fit: "contain", blur: true },
      { image: ecLahti2, type: "photo", fit: "contain", blur: true },
      { image: ecLahti3, type: "photo", fit: "contain", blur: true },
    ],
    likes: 38, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "СИП-Префаб", completion: "Только корпус", insulation: "до −30°C",
    features: ["Сауна"], style: "Классический", landSize: "6–10 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },

  // ── Modom · Санкт-Петербург и ЛО ───────────────────────────────────────
  {
    id: 247, name: "UNO", badge: "Модульный дом", price: "2 700 000 ₽",
    area: "36 м²", area_m2: 36, beds: 1, baths: 1, floors: 1, term: "от 1 мес.",
    rooms: "2 комнаты", purpose: "ИЖС / СНТ", city: "Санкт-Петербург и ЛО",
    maker: { ...MODOM, siteUrl: "https://modom.pro/proekty/modulnyj-dom-uno/" },
    description: "Модульный дом UNO площадью 36 м² с жилой площадью 32 м² и террасой.",
    descriptionLong: "Проект UNO от Modom: готовый модульный дом площадью 36 м². В стоимость на странице производителя входят готовый санузел, инженерные системы и терраса; проект рассчитан на компактное круглогодичное проживание.",
    gallery: [
      { image: moUno1, type: "photo", fit: "contain", blur: true },
      { image: moUnoPlan3d, type: "photo", fit: "contain" },
      { image: moUnoPlan, type: "photo", fit: "contain" },
    ],
    likes: 44, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для одного / пары"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса", "Готовый санузел"], style: "Современный", landSize: "3–6 соток",
    hasRealPhotos: false, hasShowroom: true, hasInstallment: true,
  },
  {
    id: 248, name: "О2 Модель S", badge: "Модульный дом", price: "3 130 000 ₽",
    area: "25,4 м²", area_m2: 25.4, beds: 1, baths: 1, floors: 1, term: "от 1 мес.",
    rooms: "1 спальня", purpose: "ИЖС / СНТ", city: "Санкт-Петербург и ЛО",
    maker: { ...MODOM, siteUrl: "https://modom.pro/proekty/modulnyj-dom-serija-o2-model-s/" },
    description: "Компактный модульный дом серии О2 площадью 25,4 м² с готовым санузлом.",
    descriptionLong: "Проект «О2 Модель S» от Modom: модульный дом площадью 25,4 м², жилая площадь 12,1 м². В карточке производителя указана комплектация с сантехникой, мебелью в санузле и террасой.",
    gallery: [
      { image: moO2S1, type: "photo", fit: "contain", blur: true },
      { image: moO2SPlan3d, type: "photo", fit: "contain" },
      { image: moO2SPlan, type: "photo", fit: "contain" },
    ],
    likes: 40, rating: 4.8,
    suitableFor: ["Выходные / дача", "Для одного / пары"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса", "Готовый санузел"], style: "Современный", landSize: "3–6 соток",
    hasRealPhotos: false, hasShowroom: true, hasInstallment: true,
  },
  {
    id: 249, name: "О2 Модель M", badge: "Модульный дом", price: "3 570 000 ₽",
    area: "38,3 м²", area_m2: 38.3, beds: 1, baths: 1, floors: 1, term: "от 1 мес.",
    rooms: "2 комнаты", purpose: "ИЖС / СНТ", city: "Санкт-Петербург и ЛО",
    maker: { ...MODOM, siteUrl: "https://modom.pro/proekty/modulnyj-dom-serija-o2-model-m/" },
    description: "Модульный дом серии О2 площадью 38,3 м² с жилой площадью 25 м².",
    descriptionLong: "Проект «О2 Модель M» от Modom: модульный дом площадью 38,3 м², жилая площадь 25 м². Дом поставляется с готовым санузлом, инженерной подготовкой и террасой по комплектации производителя.",
    gallery: [
      { image: moO2M1, type: "photo", fit: "contain", blur: true },
      { image: moO2MPlan3d, type: "photo", fit: "contain" },
      { image: moO2MPlan, type: "photo", fit: "contain" },
    ],
    likes: 41, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для одного / пары"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса", "Готовый санузел"], style: "Современный", landSize: "3–6 соток",
    hasRealPhotos: false, hasShowroom: true, hasInstallment: true,
  },
  {
    id: 250, name: "О2 Модель L", badge: "Модульный дом", price: "4 795 000 ₽",
    area: "50,8 м²", area_m2: 50.8, beds: 2, baths: 1, floors: 1, term: "от 1 мес.",
    rooms: "2 спальни", purpose: "ИЖС / СНТ", city: "Санкт-Петербург и ЛО",
    maker: { ...MODOM, siteUrl: "https://modom.pro/proekty/modulnyj-dom-serija-o2-model-l/" },
    description: "Модульный дом О2 L площадью 50,8 м² с жилой площадью 37,5 м².",
    descriptionLong: "Проект «О2 Модель L» от Modom: модульный дом площадью 50,8 м², жилая площадь 37,5 м². В комплектации производителя указаны готовый санузел, инженерные системы и терраса.",
    gallery: [
      { image: moO2L1, type: "photo", fit: "contain", blur: true },
      { image: moO2LPlan3d, type: "photo", fit: "contain" },
      { image: moO2LPlan, type: "photo", fit: "contain" },
    ],
    likes: 42, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса", "Готовый санузел"], style: "Современный", landSize: "3–6 соток",
    hasRealPhotos: false, hasShowroom: true, hasInstallment: true,
  },
  {
    id: 251, name: "О2 Мини 30", badge: "Модульный дом", price: "3 395 000 ₽",
    area: "30,75 м²", area_m2: 30.75, beds: 1, baths: 1, floors: 1, term: "от 1 мес.",
    rooms: "1 спальня", purpose: "ИЖС / СНТ", city: "Санкт-Петербург и ЛО",
    maker: { ...MODOM, siteUrl: "https://modom.pro/proekty/modulnyj-dom-o2-mini-30-m2/" },
    description: "Компактный модульный дом О2 Мини 30 площадью 30,75 м².",
    descriptionLong: "Проект «О2 Мини 30» от Modom: модульный дом площадью 30,75 м², жилая площадь 19,7 м². Производитель указывает готовый санузел с мебелью и техникой, а также террасу в составе решения.",
    gallery: [
      { image: moO2Mini30_1, type: "photo", fit: "contain", blur: true },
      { image: moO2Mini30Plan3d, type: "photo", fit: "contain" },
      { image: moO2Mini30Plan, type: "photo", fit: "contain" },
    ],
    likes: 43, rating: 4.8,
    suitableFor: ["Выходные / дача", "Для одного / пары"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса", "Готовый санузел"], style: "Современный", landSize: "3–6 соток",
    hasRealPhotos: false, hasShowroom: true, hasInstallment: true,
  },

  // ── HouseBox · Санкт-Петербург и ЛО ────────────────────────────────────
  {
    id: 252, name: "Стандарт 14", badge: "Модульный дом", price: "690 000 ₽",
    area: "14 м²", area_m2: 14, beds: 1, baths: 0, floors: 1, term: "30 д.",
    rooms: "1 комната", purpose: "Гостевой дом / Дача", city: "Санкт-Петербург и ЛО",
    maker: { ...HOUSEBOX, siteUrl: "https://housebox-spb.ru/" },
    description: "Компактный модульный дом 14 м² на базе стандартного решения HouseBox.",
    descriptionLong: "Проект «Стандарт 14» от HouseBox: компактный модульный дом площадью 14 м². На сайте производителя указано, что дом можно использовать как дачный или гостевой, а срок изготовления готового модуля — около 30 дней.",
    gallery: [
      { image: hbStandart14_1, type: "photo", fit: "contain", blur: true },
      { image: hbStandart14_2, type: "photo", fit: "contain", blur: true },
      { image: hbStandart14_3, type: "photo", fit: "contain", blur: true },
    ],
    likes: 31, rating: 4.7,
    suitableFor: ["Выходные / дача", "Для одного / пары"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "до −20°C",
    features: ["Компактный дом"], style: "Минимализм", landSize: "до 3 соток",
    hasRealPhotos: true, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 253, name: "Стандарт 14 с мебелью", badge: "Модульный дом", price: "890 000 ₽",
    area: "14 м²", area_m2: 14, beds: 1, baths: 0, floors: 1, term: "30 д.",
    rooms: "1 комната", purpose: "Гостевой дом / Дача", city: "Санкт-Петербург и ЛО",
    maker: { ...HOUSEBOX, siteUrl: "https://housebox-spb.ru/" },
    description: "Модульный дом 14 м² с базовой мебелью: шкафом и спальным местом.",
    descriptionLong: "Проект «Стандарт 14 с мебелью» от HouseBox: компактный модульный дом площадью 14 м². На сайте производителя указана комплектация с мебелью — шкафом и спальным местом; дом подходит для гостевого формата и сезонного отдыха.",
    gallery: [
      { image: hbStandart14m_1, type: "photo", fit: "contain", blur: true },
      { image: hbStandart14m_2, type: "photo", fit: "contain", blur: true },
      { image: hbStandart14_3, type: "photo", fit: "contain", blur: true },
    ],
    likes: 32, rating: 4.7,
    suitableFor: ["Выходные / дача", "Для одного / пары"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "до −20°C",
    features: ["Мебель в комплекте", "Компактный дом"], style: "Минимализм", landSize: "до 3 соток",
    hasRealPhotos: true, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 254, name: "Стандарт 19 с санузлом", badge: "Модульный дом", price: "1 250 000 ₽",
    area: "19 м²", area_m2: 19, beds: 1, baths: 1, floors: 1, term: "30 д.",
    rooms: "1 комната", purpose: "Гостевой дом / Дача", city: "Санкт-Петербург и ЛО",
    maker: { ...HOUSEBOX, siteUrl: "https://housebox-spb.ru/" },
    description: "Модульный дом 19 м² с мебелью и санузлом для дачи или гостевого размещения.",
    descriptionLong: "Проект «Стандарт 19 с санузлом» от HouseBox: модульный дом площадью 19 м². В карточке производителя указаны мебель, спальное место и санузел; решение рассчитано на быстрый монтаж и использование как гостевой или дачный дом.",
    gallery: [
      { image: hbStandart19_1, type: "photo", fit: "contain", blur: true },
      { image: hbStandart19_2, type: "photo", fit: "contain", blur: true },
      { image: hbStandart19_3, type: "photo", fit: "contain", blur: true },
    ],
    likes: 33, rating: 4.7,
    suitableFor: ["Выходные / дача", "Для одного / пары"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "до −20°C",
    features: ["Готовый санузел", "Мебель в комплекте"], style: "Минимализм", landSize: "до 3 соток",
    hasRealPhotos: true, hasShowroom: false, hasInstallment: false,
  },

  // ── Главлес · Екатеринбург ─────────────────────────────────────────────
  {
    id: 255, name: "Проект 8-35-м", badge: "Модульный дом", price: "1 712 000 ₽",
    area: "35 м²", area_m2: 35, beds: 1, baths: 1, floors: 1, term: "от 2 нед.",
    rooms: "Свободная планировка", purpose: "ИЖС / СНТ / Дача", city: "Екатеринбург",
    maker: { ...GLAVLES, siteUrl: "https://promo.glavles.com/project/8-35-m" },
    description: "Модульный дом 5,8 × 5,9 м с плоской кровлей и теплой площадью 35 м².",
    descriptionLong: "Проект 8-35-м от «Главлес» — компактный модульный дом с теплой площадью 35 м². Производитель предлагает свободную планировку, круглогодичную комплектацию и варианты с террасой или банным модулем.",
    gallery: [
      { image: gl835_1, type: "photo", fit: "contain", blur: true },
      { image: gl835_2, type: "photo", fit: "contain", blur: true },
      { image: gl835_3, type: "photo", fit: "contain", blur: true },
      { image: gl835Plan1, type: "plan", fit: "contain" },
      { image: gl835Plan2, type: "plan", fit: "contain" },
      { image: gl835Plan3, type: "plan", fit: "contain" },
    ],
    likes: 34, rating: 4.8,
    suitableFor: ["Выходные / дача", "Для одного / пары"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "до −30°C",
    features: ["Свободная планировка", "Вариант с террасой"], style: "Современный", landSize: "3–6 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 256, name: "Проект 8-27-м", badge: "Модульный дом", price: "1 718 000 ₽",
    area: "27 м²", area_m2: 27, beds: 1, baths: 1, floors: 1, term: "от 2 нед.",
    rooms: "1 спальня", purpose: "ИЖС / СНТ / Дача", city: "Екатеринбург",
    maker: { ...GLAVLES, siteUrl: "https://promo.glavles.com/project/8-27-m" },
    description: "Просторный модульный дом 5,7 × 6,4 м с отдельной спальней и санузлом.",
    descriptionLong: "Проект 8-27-м от «Главлес» рассчитан на комфортное проживание до четырех человек. Варианты планировок включают отдельную спальню, большой санузел и исполнение с увеличенной террасой.",
    gallery: [
      { image: gl827_1, type: "photo", fit: "contain", blur: true },
      { image: gl827_2, type: "photo", fit: "contain", blur: true },
      { image: gl827_3, type: "photo", fit: "contain", blur: true },
      { image: gl827Plan1, type: "plan", fit: "contain" },
      { image: gl827Plan2, type: "plan", fit: "contain" },
      { image: gl827Plan3, type: "plan", fit: "contain" },
    ],
    likes: 35, rating: 4.8,
    suitableFor: ["Выходные / дача", "Для одного / пары"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса", "Готовый санузел"], style: "Современный", landSize: "3–6 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 257, name: "Проект 8-25-м", badge: "Модульный дом", price: "1 487 000 ₽",
    area: "25 м²", area_m2: 25, beds: 1, baths: 1, floors: 1, term: "от 2 нед.",
    rooms: "1 комната", purpose: "ИЖС / СНТ / Дача", city: "Екатеринбург",
    maker: { ...GLAVLES, siteUrl: "https://promo.glavles.com/project/8-25" },
    description: "Модульный дом 4,15 × 6,4 м с теплой площадью 25 м² и вариантами планировки.",
    descriptionLong: "Проект 8-25-м от «Главлес» — модуль увеличенной площади, который можно адаптировать под проживание или баню. В карточке производителя есть варианты свободной планировки, стандартной планировки и решения с террасой.",
    gallery: [
      { image: gl825_1, type: "photo", fit: "contain", blur: true },
      { image: gl825_2, type: "photo", fit: "contain", blur: true },
      { image: gl825_3, type: "photo", fit: "contain", blur: true },
      { image: gl825Plan1, type: "plan", fit: "contain" },
      { image: gl825Plan2, type: "plan", fit: "contain" },
      { image: gl825Plan3, type: "plan", fit: "contain" },
    ],
    likes: 32, rating: 4.7,
    suitableFor: ["Выходные / дача", "Для одного / пары"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "до −30°C",
    features: ["Вариант с террасой", "Можно адаптировать под баню"], style: "Современный", landSize: "3–6 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 258, name: "Проект 8-68-м", badge: "Модульный дом", price: "2 935 000 ₽",
    area: "68 м²", area_m2: 68, beds: 2, baths: 1, floors: 1, term: "от 2 нед.",
    rooms: "2 спальни", purpose: "ИЖС / СНТ", city: "Екатеринбург",
    maker: { ...GLAVLES, siteUrl: "https://promo.glavles.com/8-68-m" },
    description: "Просторный одноэтажный модульный дом 11,86 × 7,96 м с двумя спальнями.",
    descriptionLong: "Проект 8-68-м от «Главлес» — светлый модульный дом площадью 68 м² с двумя спальнями. Производитель указывает сезонную и круглогодичную комплектации, стандартную планировку и опцию открытой террасы.",
    gallery: [
      { image: gl868_1, type: "photo", fit: "contain", blur: true },
      { image: gl868_2, type: "photo", fit: "contain", blur: true },
      { image: gl868_3, type: "photo", fit: "contain", blur: true },
      { image: gl868Plan1, type: "plan", fit: "contain" },
      { image: gl868Plan2, type: "plan", fit: "contain" },
      { image: gl868Plan3, type: "plan", fit: "contain" },
    ],
    likes: 41, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса", "Две спальни"], style: "Современный", landSize: "6–10 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 259, name: "Проект 8-87-м", badge: "Модульный дом", price: "3 534 000 ₽",
    area: "87 м²", area_m2: 87, beds: 3, baths: 1, floors: 2, term: "от 2 нед.",
    rooms: "3 спальни", purpose: "ИЖС / СНТ", city: "Екатеринбург",
    maker: { ...GLAVLES, siteUrl: "https://promo.glavles.com/8-87-m" },
    description: "Двухэтажный модульный дом 11,86 × 7,96 м с тремя спальнями.",
    descriptionLong: "Проект 8-87-м от «Главлес» — двухэтажный модульный дом с теплой площадью 87 м² и тремя спальнями. На странице производителя указаны сезонная и круглогодичная комплектации, а также планировки первого и второго этажа.",
    gallery: [
      { image: gl887_1, type: "photo", fit: "contain", blur: true },
      { image: gl887_2, type: "photo", fit: "contain", blur: true },
      { image: gl887_3, type: "photo", fit: "contain", blur: true },
      { image: gl887Plan1, type: "plan", fit: "contain" },
      { image: gl887Plan2, type: "plan", fit: "contain" },
      { image: gl887Plan3, type: "plan", fit: "contain" },
    ],
    likes: 45, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "до −30°C",
    features: ["Два этажа", "Три спальни"], style: "Современный", landSize: "6–10 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },

  // ── ФПС Модуль · Екатеринбург ──────────────────────────────────────────
  {
    id: 260, name: "АртХаус AH 281", badge: "Модульный дом", price: "2 160 000 ₽",
    area: "54 м²", area_m2: 54, beds: 1, baths: 1, floors: 1, term: "от 1 мес.",
    rooms: "2 комнаты", purpose: "ИЖС / СНТ", city: "Екатеринбург",
    maker: { ...FPS_MODUL, siteUrl: "https://fps-modul.ru/modulnyj-dom-ah281" },
    description: "Модульный дом АртХаус 54 м², габариты 6 × 9 м, жилая площадь 45,2 м².",
    descriptionLong: "АртХаус AH 281 от «ФПС Модуль» — одноэтажный модульный дом площадью 54 м². На сайте производителя указаны жилая площадь 45,2 м², габариты 6 × 9 м и базовая стоимость без учета террасы, фундамента и доставки.",
    gallery: [
      { image: fpsAh281_1, type: "photo", fit: "contain", blur: true },
      { image: fpsAh281Plan1, type: "photo", fit: "contain" },
      { image: fpsAh281Plan2, type: "photo", fit: "contain" },
    ],
    likes: 37, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для одного / пары"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "до −30°C",
    features: ["Готовый санузел", "Вентфасад"], style: "Современный", landSize: "3–6 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: true,
  },
  {
    id: 261, name: "АртХаус AH 313", badge: "Модульный дом", price: "1 800 000 ₽",
    area: "45 м²", area_m2: 45, beds: 1, baths: 1, floors: 1, term: "от 1 мес.",
    rooms: "2 комнаты", purpose: "ИЖС / СНТ", city: "Екатеринбург",
    maker: { ...FPS_MODUL, siteUrl: "https://fps-modul.ru/modulnyj-dom-ah313" },
    description: "Модульный дом АртХаус 45 м², габариты 7,5 × 6 м, жилая площадь 36,2 м².",
    descriptionLong: "АртХаус AH 313 от «ФПС Модуль» — компактный одноэтажный дом площадью 45 м². Производитель указывает жилую площадь 36,2 м², внутреннюю высоту потолков 2,4 м и несколько вариантов планировок.",
    gallery: [
      { image: fpsAh313_1, type: "photo", fit: "contain", blur: true },
      { image: fpsAh313_2, type: "photo", fit: "contain", blur: true },
      { image: fpsAh313Plan, type: "photo", fit: "contain" },
    ],
    likes: 35, rating: 4.7,
    suitableFor: ["Выходные / дача", "Для одного / пары"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "до −30°C",
    features: ["Готовый санузел", "Вентфасад"], style: "Современный", landSize: "3–6 соток",
    hasRealPhotos: true, hasShowroom: false, hasInstallment: true,
  },
  {
    id: 262, name: "Барнхаус Викинг BH 411", badge: "Модульный дом", price: "1 500 000 ₽",
    area: "30 м²", area_m2: 30, beds: 1, baths: 1, floors: 2, term: "от 1 мес.",
    rooms: "2 комнаты", purpose: "ИЖС / СНТ / Дача", city: "Екатеринбург",
    maker: { ...FPS_MODUL, siteUrl: "https://fps-modul.ru/barnhaus-viking-bh-411" },
    description: "Барнхаус Викинг 30 м² с высокой кровлей и вторым уровнем.",
    descriptionLong: "Барнхаус Викинг BH 411 от «ФПС Модуль» — компактный модульный дом с внешними размерами 5 × 6 м и высокой кровлей. Производитель указывает варианты жилой площади 33,7–36,25 м² за счет второго уровня.",
    gallery: [
      { image: fpsBh411_1, type: "photo", fit: "contain", blur: true },
      { image: fpsBh411Plan1, type: "photo", fit: "contain" },
      { image: fpsBh411Plan2, type: "photo", fit: "contain" },
    ],
    likes: 38, rating: 4.8,
    suitableFor: ["Выходные / дача", "Для одного / пары"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "до −30°C",
    features: ["Антресоль", "Барнхаус"], style: "Барнхаус", landSize: "3–6 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: true,
  },
  {
    id: 263, name: "Барнхаус Викинг BH 412", badge: "Модульный дом", price: "2 100 000 ₽",
    area: "49 м²", area_m2: 49, beds: 2, baths: 1, floors: 2, term: "от 1 мес.",
    rooms: "2 спальни", purpose: "ИЖС / СНТ", city: "Екатеринбург",
    maker: { ...FPS_MODUL, siteUrl: "https://fps-modul.ru/barnhaus-viking-bh-412" },
    description: "Модульный барнхаус с габаритами 6 × 7 м и вторым уровнем.",
    descriptionLong: "Барнхаус Викинг BH 412 от «ФПС Модуль» — увеличенная версия линейки Викинг. На сайте производителя указана площадь до 49 м², внешние размеры 6 × 7 м и варианты планировок для постоянного или дачного проживания.",
    gallery: [
      { image: fpsBh412_1, type: "photo", fit: "contain", blur: true },
      { image: fpsBh412Plan1, type: "photo", fit: "contain" },
      { image: fpsBh412Plan2, type: "photo", fit: "contain" },
    ],
    likes: 40, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "до −30°C",
    features: ["Антресоль", "Барнхаус"], style: "Барнхаус", landSize: "3–6 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: true,
  },
  {
    id: 264, name: "Барнхаус BH 403", badge: "Модульный дом", price: "1 200 000 ₽",
    area: "30 м²", area_m2: 30, beds: 1, baths: 1, floors: 1, term: "от 1 мес.",
    rooms: "1 спальня", purpose: "ИЖС / СНТ / Дача", city: "Екатеринбург",
    maker: { ...FPS_MODUL, siteUrl: "https://fps-modul.ru/barnhaus-bh-403" },
    description: "Компактный барнхаус 30 м², габариты 5 × 6 м, базовая комплектация под ключ.",
    descriptionLong: "Барнхаус BH 403 от «ФПС Модуль» — одноэтажный модульный дом площадью 30 м². В комплектацию входят деревянный каркас, утепление, наружная и внутренняя отделка, окна, двери, электрика и вентиляция.",
    gallery: [
      { image: fpsBh403_1, type: "photo", fit: "contain", blur: true },
      { image: fpsBh403Plan1, type: "photo", fit: "contain" },
      { image: fpsBh403Plan2, type: "photo", fit: "contain" },
    ],
    likes: 34, rating: 4.7,
    suitableFor: ["Выходные / дача", "Для одного / пары"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "до −30°C",
    features: ["Барнхаус", "Готовый санузел"], style: "Барнхаус", landSize: "3–6 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: true,
  },

  // ── Вековые Традиции · Екатеринбург ────────────────────────────────────
  {
    id: 265, name: "М-98-1-3", badge: "Модульный дом", price: "3 920 000 ₽",
    area: "98 м²", area_m2: 98, beds: 3, baths: 2, floors: 1, term: "3–6 мес.",
    rooms: "3 спальни", purpose: "ИЖС / СНТ", city: "Екатеринбург",
    maker: { ...VEK_TRAD, siteUrl: "https://vek-trad.ru/katalog-proektov-domov/modulnye/m-98-1-3/" },
    description: "Одноэтажный модульный дом 98 м² с тремя спальнями, двумя санузлами и террасой.",
    descriptionLong: "М-98-1-3 от «Вековые Традиции» — модульный дом площадью 98 м², размер 11 × 12 м. В проекте предусмотрены три спальни, два санузла и терраса; производитель указывает базовую, тепловой контур и комплектацию под ключ.",
    gallery: [
      { image: vtM98_1, type: "photo", fit: "contain", blur: true },
      { image: vtM98_2, type: "photo", fit: "contain", blur: true },
      { image: vtM98_3, type: "photo", fit: "contain", blur: true },
    ],
    likes: 42, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса", "Два санузла"], style: "Современный", landSize: "6–10 соток",
    hasRealPhotos: false, hasShowroom: true, hasInstallment: false,
  },
  {
    id: 266, name: "М-85-1-2", badge: "Модульный дом", price: "3 400 000 ₽",
    area: "85 м²", area_m2: 85, beds: 2, baths: 2, floors: 1, term: "3–6 мес.",
    rooms: "2 спальни", purpose: "ИЖС / СНТ", city: "Екатеринбург",
    maker: { ...VEK_TRAD, siteUrl: "https://vek-trad.ru/katalog-proektov-domov/modulnye/m-85-1-2/" },
    description: "Модульный дом 85 м² с двумя спальнями, двумя санузлами и террасой.",
    descriptionLong: "М-85-1-2 от «Вековые Традиции» — одноэтажный модульный дом площадью 85 м², размер 11 × 12 м. Проект рассчитан на семью: две спальни, два санузла и терраса.",
    gallery: [
      { image: vtM85_1, type: "photo", fit: "contain", blur: true },
      { image: vtM85_2, type: "photo", fit: "contain", blur: true },
      { image: vtM85_3, type: "photo", fit: "contain", blur: true },
    ],
    likes: 40, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса", "Два санузла"], style: "Современный", landSize: "6–10 соток",
    hasRealPhotos: false, hasShowroom: true, hasInstallment: false,
  },
  {
    id: 267, name: "М-73-1-2", badge: "Модульный дом", price: "2 920 000 ₽",
    area: "73 м²", area_m2: 73, beds: 2, baths: 1, floors: 1, term: "3–6 мес.",
    rooms: "2 спальни", purpose: "ИЖС / СНТ", city: "Екатеринбург",
    maker: { ...VEK_TRAD, siteUrl: "https://vek-trad.ru/katalog-proektov-domov/modulnye/m-73-1-2/" },
    description: "Одноэтажный модульный дом 73 м² с двумя спальнями и террасой.",
    descriptionLong: "М-73-1-2 от «Вековые Традиции» — модульный дом площадью 73 м², размер 8 × 12 м. В планировке две спальни, один санузел и терраса; дом предлагается в нескольких комплектациях.",
    gallery: [
      { image: vtM73_1, type: "photo", fit: "contain", blur: true },
      { image: vtM73_2, type: "photo", fit: "contain", blur: true },
      { image: vtM73_3, type: "photo", fit: "contain", blur: true },
    ],
    likes: 38, rating: 4.7,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса"], style: "Современный", landSize: "6–10 соток",
    hasRealPhotos: false, hasShowroom: true, hasInstallment: false,
  },
  {
    id: 268, name: "М-60-1-1", badge: "Модульный дом", price: "2 400 000 ₽",
    area: "60 м²", area_m2: 60, beds: 1, baths: 1, floors: 1, term: "3–6 мес.",
    rooms: "1 спальня", purpose: "ИЖС / СНТ / Дача", city: "Екатеринбург",
    maker: { ...VEK_TRAD, siteUrl: "https://vek-trad.ru/katalog-proektov-domov/modulnye/m-60-1-1/" },
    description: "Компактный модульный дом 60 м² с одной спальней, санузлом и террасой.",
    descriptionLong: "М-60-1-1 от «Вековые Традиции» — модульный дом площадью 60 м², размер 8 × 12 м. Проект подходит для круглогодичного проживания или дачного сценария: спальня, санузел, гостиная зона и терраса.",
    gallery: [
      { image: vtM60_1, type: "photo", fit: "contain", blur: true },
      { image: vtM60_2, type: "photo", fit: "contain", blur: true },
      { image: vtM60_3, type: "photo", fit: "contain", blur: true },
    ],
    likes: 36, rating: 4.7,
    suitableFor: ["Выходные / дача", "Для одного / пары"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса"], style: "Современный", landSize: "3–6 соток",
    hasRealPhotos: false, hasShowroom: true, hasInstallment: false,
  },

  // ── Будущий Дом · Екатеринбург ─────────────────────────────────────────
  {
    id: 269, name: "Хайтек 45", badge: "Модульный дом", price: "2 730 000 ₽",
    area: "45 м²", area_m2: 45, beds: 1, baths: 1, floors: 1, term: "от 10 д.",
    rooms: "1 спальня", purpose: "ИЖС / СНТ", city: "Екатеринбург",
    maker: { ...BUDUSHIY_DOM, siteUrl: "https://budushiy-dom.ru/product/modulnyj-dom-hajtek-45/" },
    description: "Модульный дом в стиле хай-тек 45 м² с одной спальней и санузлом.",
    descriptionLong: "Хайтек 45 от СК «Будущий Дом» — модульный дом площадью 45 м². Производитель указывает внутреннюю и внешнюю отделку, разводку электрики, сантехники и воды; фундамент и терраса считаются отдельно.",
    gallery: [
      { image: bdHitech45_1, type: "photo", fit: "contain", blur: true },
      { image: bdHitech45_2, type: "photo", fit: "contain", blur: true },
      { image: bdHitech45_3, type: "photo", fit: "contain", blur: true },
    ],
    likes: 39, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для одного / пары"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "до −30°C",
    features: ["Готовый санузел", "Хай-тек"], style: "Хай-тек", landSize: "3–6 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: true,
  },
  {
    id: 270, name: "Хайтек 36", badge: "Модульный дом", price: "2 120 000 ₽",
    area: "36 м²", area_m2: 36, beds: 1, baths: 1, floors: 1, term: "от 10 д.",
    rooms: "1 спальня", purpose: "ИЖС / СНТ / Дача", city: "Екатеринбург",
    maker: { ...BUDUSHIY_DOM, siteUrl: "https://budushiy-dom.ru/product/modulnyj-dom-hajtek-36-m-kv/" },
    description: "Компактный модульный дом хай-тек 36 м² с одной спальней и санузлом.",
    descriptionLong: "Хайтек 36 от СК «Будущий Дом» — компактный модульный дом площадью 36 м². В описании проекта указаны стены 100 мм, потолок и пол 150 мм, внутренняя и внешняя отделка, разведенная электрика, сантехника и вода.",
    gallery: [
      { image: bdHitech36_1, type: "photo", fit: "contain", blur: true },
      { image: bdHitech36_2, type: "photo", fit: "contain", blur: true },
      { image: bdHitech36_3, type: "photo", fit: "contain", blur: true },
    ],
    likes: 37, rating: 4.7,
    suitableFor: ["Выходные / дача", "Для одного / пары"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "до −30°C",
    features: ["Готовый санузел", "Хай-тек"], style: "Хай-тек", landSize: "3–6 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: true,
  },
  {
    id: 271, name: "Барн 60F-1", badge: "Модульный дом", price: "3 640 000 ₽",
    area: "60 м²", area_m2: 60, beds: 3, baths: 1, floors: 1, term: "от 10 д.",
    rooms: "3 спальни", purpose: "ИЖС / СНТ", city: "Екатеринбург",
    maker: { ...BUDUSHIY_DOM, siteUrl: "https://budushiy-dom.ru/product/modulnyj-dom-barn-60f-1/" },
    description: "Модульный дом в стиле барн 60 м² с тремя спальнями и санузлом.",
    descriptionLong: "Барн 60F-1 от СК «Будущий Дом» — модульный дом площадью 60 м² с тремя спальнями. В базовом описании указаны внутренняя и внешняя отделка, электрика, сантехника и водоснабжение.",
    gallery: [
      { image: bdBarn60f_1, type: "photo", fit: "contain", blur: true },
      { image: bdBarn60f_2, type: "photo", fit: "contain", blur: true },
      { image: bdBarn60f_3, type: "photo", fit: "contain", blur: true },
    ],
    likes: 43, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "до −30°C",
    features: ["Барнхаус", "Три спальни"], style: "Барнхаус", landSize: "6–10 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: true,
  },
  {
    id: 272, name: "Дом №8", badge: "Модульный дом", price: "2 087 020 ₽",
    area: "32,5 м²", area_m2: 32.5, beds: 2, baths: 1, floors: 1, term: "от 10 д.",
    rooms: "2 спальни", purpose: "ИЖС / СНТ / Дача", city: "Екатеринбург",
    maker: { ...BUDUSHIY_DOM, siteUrl: "https://budushiy-dom.ru/product/dom-8/" },
    description: "Компактный модульный дом 32,5 м² с двумя спальнями и санузлом.",
    descriptionLong: "Дом №8 от СК «Будущий Дом» — модульный дом площадью 32,5 м². В карточке производителя указаны две спальни, один санузел, внутренняя и внешняя отделка, разведенная электрика, сантехника и вода.",
    gallery: [
      { image: bdDom8_1, type: "photo", fit: "contain", blur: true },
      { image: bdDom8_2, type: "photo", fit: "contain", blur: true },
      { image: bdDom8_3, type: "photo", fit: "contain", blur: true },
    ],
    likes: 36, rating: 4.7,
    suitableFor: ["Выходные / дача", "Для семьи"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "до −30°C",
    features: ["Две спальни", "Готовый санузел"], style: "Современный", landSize: "3–6 соток",
    hasRealPhotos: true, hasShowroom: false, hasInstallment: true,
  },
  {
    id: 273, name: "Модуал 75 с террасой", badge: "Модульный дом", price: "3 524 000 ₽",
    area: "75 м²", area_m2: 75, beds: 2, baths: 1, floors: 1, term: "от 10 д.",
    rooms: "2 спальни", purpose: "ИЖС / СНТ", city: "Екатеринбург",
    maker: { ...BUDUSHIY_DOM, siteUrl: "https://budushiy-dom.ru/product/modual-75-m2-s-terrasoj/" },
    description: "Модульный дом 75 м² с двумя спальнями, санузлом и террасой.",
    descriptionLong: "Модуал 75 с террасой от СК «Будущий Дом» — одноэтажный модульный дом площадью 75 м². Производитель указывает усиленный деревянный каркас, утепление, вентилируемый фасад, подготовку санузла и комплект окон и дверей.",
    gallery: [
      { image: bdModual75_1, type: "photo", fit: "contain", blur: true },
      { image: bdModual75_2, type: "photo", fit: "contain", blur: true },
      { image: bdModual75_3, type: "photo", fit: "contain", blur: true },
    ],
    likes: 44, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса", "Две спальни"], style: "Современный", landSize: "6–10 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: true,
  },

  // ── Qubdom · Санкт-Петербург и ЛО ────────────────────────────────────────
  {
    id: 274, name: "Q", badge: "Модульный дом", price: "1 600 000 ₽",
    area: "31,5 м²", area_m2: 31.5, beds: 1, baths: 1, floors: 1, term: "от 30 д.",
    rooms: "1 спальня", purpose: "ИЖС / СНТ / Дача", city: "Санкт-Петербург и ЛО",
    maker: { ...QUBDOM, siteUrl: "https://qubdom.ru/q/" },
    description: "Компактный модульный дом 31,5 м² с жилой зоной, санузлом и террасой.",
    descriptionLong: "Q от Qubdom — компактный одноэтажный модульный дом площадью 31,5 м² для дачи, гостевого размещения или проживания пары. Проект включает жилую зону, санузел и открытую террасу; производитель указывает быстрый срок изготовления и возможность комплектации мебелью.",
    gallery: [
      { image: qubQ_1, type: "photo" },
      { image: qubQ_2, type: "photo" },
      { image: qubQ_3, type: "photo" },
      { image: qubQPlan, type: "photo", fit: "contain", blur: true },
    ],
    likes: 41, rating: 4.8,
    suitableFor: ["Выходные / дача", "Для одного / пары"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса", "Готовый санузел"], style: "Современный", landSize: "3–6 соток",
    hasRealPhotos: true, hasShowroom: true, hasInstallment: false,
  },
  {
    id: 275, name: "Q+", badge: "Модульный дом", price: "2 150 000 ₽",
    area: "45,6 м²", area_m2: 45.6, beds: 1, baths: 1, floors: 1, term: "от 30 д.",
    rooms: "1 спальня", purpose: "ИЖС / СНТ / Дача", city: "Санкт-Петербург и ЛО",
    maker: { ...QUBDOM, siteUrl: "https://qubdom.ru/q-2/" },
    description: "Модульный дом 45,6 м² с увеличенной жилой зоной, санузлом и террасой.",
    descriptionLong: "Q+ от Qubdom — расширенная версия компактного модульного дома площадью 45,6 м². Планировка рассчитана на комфортное проживание одного-двух человек: выделенная спальная зона, кухня-гостиная, санузел и терраса.",
    gallery: [
      { image: qubQPlus_1, type: "photo" },
      { image: qubQPlus_2, type: "photo" },
      { image: qubQPlus_3, type: "photo" },
      { image: qubQPlusPlan1, type: "photo", fit: "contain", blur: true },
      { image: qubQPlusPlan2, type: "photo", fit: "contain", blur: true },
    ],
    likes: 44, rating: 4.8,
    suitableFor: ["Выходные / дача", "Для одного / пары"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса", "Готовый санузел"], style: "Современный", landSize: "3–6 соток",
    hasRealPhotos: true, hasShowroom: true, hasInstallment: false,
  },
  {
    id: 276, name: "Q Family mini", badge: "Модульный дом", price: "2 700 000 ₽",
    area: "49,5 м²", area_m2: 49.5, beds: 2, baths: 1, floors: 1, term: "от 40 д.",
    rooms: "2 спальни", purpose: "ИЖС / СНТ", city: "Санкт-Петербург и ЛО",
    maker: { ...QUBDOM, siteUrl: "https://qubdom.ru/q-family-mini/" },
    description: "Семейный модульный дом 49,5 м² с двумя приватными зонами и санузлом.",
    descriptionLong: "Q Family mini от Qubdom — компактный семейный модульный дом площадью 49,5 м² для круглогодичного проживания или загородного отдыха. Планировка подходит для небольшой семьи: есть общая зона, санузел и две приватные комнаты.",
    gallery: [
      { image: qubQFamilyMini_1, type: "photo" },
      { image: qubQFamilyMini_2, type: "photo" },
      { image: qubQFamilyMini_3, type: "photo" },
      { image: qubQFamilyMiniPlan1, type: "photo", fit: "contain", blur: true },
      { image: qubQFamilyMiniPlan2, type: "photo", fit: "contain", blur: true },
    ],
    likes: 47, rating: 4.9,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "до −30°C",
    features: ["Семейная планировка", "Готовый санузел"], style: "Современный", landSize: "6–10 соток",
    hasRealPhotos: true, hasShowroom: true, hasInstallment: false,
  },
  {
    id: 277, name: "Q Family MAX", badge: "Модульный дом", price: "4 900 000 ₽",
    area: "100,8 м²", area_m2: 100.8, beds: 3, baths: 1, floors: 1, term: "от 70 д.",
    rooms: "3 спальни", purpose: "ИЖС / СНТ", city: "Санкт-Петербург и ЛО",
    maker: { ...QUBDOM, siteUrl: "https://qubdom.ru/q-family-max/" },
    description: "Большой модульный дом 100,8 м² для постоянного проживания семьи.",
    descriptionLong: "Q Family MAX от Qubdom — просторный одноэтажный модульный дом площадью 100,8 м². Проект рассчитан на семью и постоянное проживание: несколько спален, общая зона, санузел и увеличенная полезная площадь.",
    gallery: [
      { image: qubQFamilyMax_1, type: "photo" },
      { image: qubQFamilyMax_2, type: "photo" },
      { image: qubQFamilyMax_3, type: "photo" },
      { image: qubQFamilyMaxPlan, type: "photo", fit: "contain", blur: true },
    ],
    likes: 52, rating: 4.9,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "до −30°C",
    features: ["Большая площадь", "Семейная планировка"], style: "Современный", landSize: "8–12 соток",
    hasRealPhotos: true, hasShowroom: true, hasInstallment: false,
  },
  {
    id: 278, name: "Q с тамбуром", badge: "Модульный дом", price: "1 800 000 ₽",
    area: "36 м²", area_m2: 36, beds: 1, baths: 1, floors: 1, term: "от 35 д.",
    rooms: "1 спальня", purpose: "ИЖС / СНТ / Дача", city: "Санкт-Петербург и ЛО",
    maker: { ...QUBDOM, siteUrl: "https://qubdom.ru/q-s-tamburom/" },
    description: "Компактный модульный дом 36 м² с тёплым тамбуром, санузлом и террасой.",
    descriptionLong: "Q с тамбуром от Qubdom — компактный модульный дом площадью 36 м² для проживания двух человек или использования как гостевой дом. Тамбур добавляет удобство в холодный сезон и может работать как входная зона для хранения.",
    gallery: [
      { image: qubQTambour_1, type: "photo" },
      { image: qubQTambour_2, type: "photo" },
      { image: qubQTambour_3, type: "photo" },
      { image: qubQTambourPlan, type: "photo", fit: "contain", blur: true },
    ],
    likes: 40, rating: 4.8,
    suitableFor: ["Выходные / дача", "Для одного / пары"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "до −30°C",
    features: ["Тамбур", "Терраса"], style: "Современный", landSize: "3–6 соток",
    hasRealPhotos: true, hasShowroom: true, hasInstallment: false,
  },

  // ── DUROV.HOUSE · Воронеж ───────────────────────────────────────────────
  {
    id: 279, name: "Барн DH 21", badge: "Модульный дом", price: "1 985 500 ₽",
    area: "21,42 м²", area_m2: 21.42, beds: 1, baths: 1, floors: 1, term: "от 30 д.",
    rooms: "студия", purpose: "Глэмпинг / Дача / Аренда", city: "Воронеж",
    maker: { ...DUROV_HOUSE, siteUrl: "https://durov.house/barn_dh21" },
    description: "Компактный одномодульный дом формата мини для глэмпинга, аренды или дачного отдыха.",
    descriptionLong: "Барн DH 21 от DUROV.HOUSE — компактный одномодульный дом площадью 21,42 м². Производитель позиционирует проект как мини-формат для глэмпингов, аренды и загородного отдыха: внутри предусмотрены жилая зона, санузел и несколько вариантов планировки.",
    gallery: [
      { image: durovBarn21_1, type: "photo", fit: "contain", blur: true },
      { image: durovBarn21Plan1, type: "plan", fit: "contain" },
      { image: durovBarn21Plan2, type: "plan", fit: "contain" },
      { image: durovBarn21Plan3, type: "plan", fit: "contain" },
      { image: durovBarn21Plan4, type: "plan", fit: "contain" },
    ],
    likes: 42, rating: 4.8,
    suitableFor: ["Выходные / дача", "Глэмпинг / аренда", "Для одного / пары"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "до −30°C",
    features: ["Мини-формат", "Готовый санузел", "Терраса"], style: "Барнхаус", landSize: "до 3 соток",
    hasRealPhotos: false, hasShowroom: true, hasInstallment: true,
  },
  {
    id: 280, name: "Барн DH 57", badge: "Модульный дом", price: "4 275 000 ₽",
    area: "56,7 м²", area_m2: 56.7, beds: 1, baths: 1, floors: 1, term: "от 30 д.",
    rooms: "1 спальня", purpose: "ИЖС / СНТ / Дача", city: "Воронеж",
    maker: { ...DUROV_HOUSE, siteUrl: "https://durov.house/house_dh57" },
    description: "Одноэтажный барнхаус с отдельной спальней, кухней-гостиной и террасой.",
    descriptionLong: "Барн DH 57 от DUROV.HOUSE — модульный дом площадью 56,7 м² с совмещенной кухней-гостиной и отдельной спальней. Формат подходит для дачи, гостевого дома или компактного постоянного проживания; на сайте производителя указана общая площадь с террасой 48,3 м².",
    gallery: [
      { image: durovBarn57_1, type: "photo", fit: "contain", blur: true },
      { image: durovBarn57_2, type: "photo", fit: "contain", blur: true },
      { image: durovBarn57_3, type: "photo", fit: "contain", blur: true },
      { image: durovBarn57Plan, type: "plan", fit: "contain" },
    ],
    likes: 45, rating: 4.8,
    suitableFor: ["Выходные / дача", "Для одного / пары"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "до −30°C",
    features: ["Спальня", "Кухня-гостиная", "Терраса"], style: "Барнхаус", landSize: "3–6 соток",
    hasRealPhotos: false, hasShowroom: true, hasInstallment: true,
  },
  {
    id: 281, name: "Барн DH 64", badge: "Модульный дом", price: "4 800 000 ₽",
    area: "64,57 м²", area_m2: 64.57, beds: 2, baths: 1, floors: 1, term: "от 30 д.",
    rooms: "2 спальни", purpose: "ИЖС / СНТ", city: "Воронеж",
    maker: { ...DUROV_HOUSE, siteUrl: "https://durov.house/house_dh64" },
    description: "Модульный барнхаус с двумя спальнями, кухней-гостиной, террасой и крыльцом.",
    descriptionLong: "Барн DH 64 от DUROV.HOUSE — одноэтажный модульный дом площадью 64,57 м². В планировке две спальни, кухня-гостиная и санузел; производитель указывает общую площадь с террасой и крыльцом 56,33 м².",
    gallery: [
      { image: durovBarn64_1, type: "photo", fit: "contain", blur: true },
      { image: durovBarn64_2, type: "photo", fit: "contain", blur: true },
      { image: durovBarn64_3, type: "photo", fit: "contain", blur: true },
      { image: durovBarn64Plan, type: "plan", fit: "contain" },
    ],
    likes: 48, rating: 4.9,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "до −30°C",
    features: ["Две спальни", "Кухня-гостиная", "Терраса"], style: "Барнхаус", landSize: "6–10 соток",
    hasRealPhotos: false, hasShowroom: true, hasInstallment: true,
  },
  {
    id: 282, name: "Флэт DH 67", badge: "Модульный дом", price: "5 025 000 ₽",
    area: "66,7 м²", area_m2: 66.7, beds: 1, baths: 1, floors: 1, term: "от 30 д.",
    rooms: "1 спальня", purpose: "ИЖС / СНТ", city: "Воронеж",
    maker: { ...DUROV_HOUSE, siteUrl: "https://durov.house/flat_dh67" },
    description: "Современный модульный дом с отдельной спальней, кухней-гостиной и террасой.",
    descriptionLong: "Флэт DH 67 от DUROV.HOUSE — модульный дом площадью 66,7 м² с отдельной спальней и кухней-гостиной. На странице производителя указана полезная площадь 57,16 м², высота потолков 2,6 м, а также включенные в стоимость терраса и монтаж.",
    gallery: [
      { image: durovFlat67_1, type: "photo", fit: "contain", blur: true },
      { image: durovFlat67_2, type: "photo", fit: "contain", blur: true },
      { image: durovFlat67_3, type: "photo", fit: "contain", blur: true },
      { image: durovFlat67Plan, type: "plan", fit: "contain" },
    ],
    likes: 47, rating: 4.8,
    suitableFor: ["Постоянное проживание", "Для одного / пары"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "до −30°C",
    features: ["Спальня", "Кухня-гостиная", "Терраса"], style: "Современный", landSize: "6–10 соток",
    hasRealPhotos: false, hasShowroom: true, hasInstallment: true,
  },
  {
    id: 283, name: "Флэт DH 124", badge: "Модульный дом", price: "9 300 000 ₽",
    area: "124 м²", area_m2: 124, beds: 3, baths: 1, floors: 1, term: "от 30 д.",
    rooms: "3 спальни", purpose: "ИЖС", city: "Воронеж",
    maker: { ...DUROV_HOUSE, siteUrl: "https://durov.house/flat_dh124" },
    description: "Просторный модульный дом с тремя спальнями, кухней-гостиной и большой террасой.",
    descriptionLong: "Флэт DH 124 от DUROV.HOUSE — большой одноэтажный модульный дом площадью 124 м². Проект рассчитан на семейное проживание: три спальни, общая кухня-гостиная, санузел и терраса; на сайте производителя указана общая площадь с террасой 108,2 м².",
    gallery: [
      { image: durovFlat124_1, type: "photo", fit: "contain", blur: true },
      { image: durovFlat124_2, type: "photo", fit: "contain", blur: true },
      { image: durovFlat124_3, type: "photo", fit: "contain", blur: true },
      { image: durovFlat124Plan, type: "plan", fit: "contain" },
    ],
    likes: 54, rating: 4.9,
    suitableFor: ["Постоянное проживание", "Для семьи"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "до −30°C",
    features: ["Три спальни", "Большая терраса", "Кухня-гостиная"], style: "Современный", landSize: "8–12 соток",
    hasRealPhotos: false, hasShowroom: true, hasInstallment: true,
  },

  // ── HISTHUT · Пермский край ─────────────────────────────────────────────
  {
    id: 284, name: "Хижина 8", badge: "Модульный дом", price: "1 000 000 ₽",
    area: "15,76 м²", area_m2: 15.76, beds: 1, baths: 1, floors: 1, term: "от 60 д.",
    rooms: "студия", purpose: "Дача / Глэмпинг / Аренда", city: "Пермский край",
    maker: { ...HISTHUT, siteUrl: "https://histhut.ru/product/modul-hizhina-8" },
    description: "Компактный модульный дом для двоих с жилой зоной, санузлом и открытой террасой.",
    descriptionLong: "Хижина 8 от HISTHUT — компактный модульный дом площадью 15,76 м² для двоих. Проект подходит для дачи, гостевого размещения, глэмпинга и туристических объектов: внутри предусмотрена жилая зона, санузел, кухонный блок и открытая терраса.",
    gallery: [
      { image: histhutHizhina8_1, type: "photo", fit: "contain", blur: true },
      { image: histhutHizhina8_2, type: "photo", fit: "contain", blur: true },
      { image: histhutHizhina8_3, type: "photo", fit: "contain", blur: true },
      { image: histhutHizhina8Plan, type: "plan", fit: "contain" },
    ],
    likes: 41, rating: 4.8,
    suitableFor: ["Выходные / дача", "Глэмпинг / аренда", "Для одного / пары"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса", "Готовый санузел", "Компактный формат"], style: "Современный", landSize: "до 3 соток",
    hasRealPhotos: true, hasShowroom: true, hasInstallment: false,
  },
  {
    id: 285, name: "Хижина 10", badge: "Модульный дом", price: "1 300 000 ₽",
    area: "21,07 м²", area_m2: 21.07, beds: 1, baths: 1, floors: 1, term: "от 60 д.",
    rooms: "студия", purpose: "Дача / Глэмпинг / Аренда", city: "Пермский край",
    maker: { ...HISTHUT, siteUrl: "https://histhut.ru/product/modul-hizhina-10" },
    description: "Модульный дом для двоих с увеличенной жилой зоной, санузлом и террасой.",
    descriptionLong: "Хижина 10 от HISTHUT — модульный дом площадью 21,07 м² для двоих. По сравнению с младшей версией здесь больше внутренняя зона отдыха и терраса; формат подходит для загородного отдыха, аренды и небольшого глэмпинг-объекта.",
    gallery: [
      { image: histhutHizhina10_1, type: "photo", fit: "contain", blur: true },
      { image: histhutHizhina10_2, type: "photo", fit: "contain", blur: true },
      { image: histhutHizhina10_3, type: "photo", fit: "contain", blur: true },
      { image: histhutHizhina10Plan, type: "plan", fit: "contain" },
    ],
    likes: 43, rating: 4.8,
    suitableFor: ["Выходные / дача", "Глэмпинг / аренда", "Для одного / пары"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "до −30°C",
    features: ["Терраса", "Санузел", "Мебель"], style: "Современный", landSize: "до 3 соток",
    hasRealPhotos: true, hasShowroom: true, hasInstallment: false,
  },
  {
    id: 286, name: "Хижина 12", badge: "Модульный дом", price: "1 674 000 ₽",
    area: "26,43 м²", area_m2: 26.43, beds: 1, baths: 1, floors: 1, term: "от 60 д.",
    rooms: "1 спальня", purpose: "Дача / Глэмпинг / Аренда", city: "Пермский край",
    maker: { ...HISTHUT, siteUrl: "https://histhut.ru/product/modul-hizhina-12" },
    description: "Модульный дом с отдельной спальней, зоной отдыха, санузлом и открытой террасой.",
    descriptionLong: "Хижина 12 от HISTHUT — модульный дом площадью 26,43 м² с отдельной спальней, зоной отдыха и санузлом. Проект рассчитан на проживание пары и прием гостей, а большая открытая терраса усиливает сценарий загородного отдыха.",
    gallery: [
      { image: histhutHizhina12_1, type: "photo", fit: "contain", blur: true },
      { image: histhutHizhina12_2, type: "photo", fit: "contain", blur: true },
      { image: histhutHizhina12_3, type: "photo", fit: "contain", blur: true },
      { image: histhutHizhina12Plan, type: "plan", fit: "contain" },
    ],
    likes: 45, rating: 4.8,
    suitableFor: ["Выходные / дача", "Глэмпинг / аренда", "Для одного / пары"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "до −30°C",
    features: ["Спальня", "Открытая терраса", "Готовый санузел"], style: "Современный", landSize: "3–6 соток",
    hasRealPhotos: true, hasShowroom: true, hasInstallment: false,
  },
  {
    id: 287, name: "Хижина 20", badge: "Модульный дом", price: "600 000 ₽",
    area: "42,52 м²", area_m2: 42.52, beds: 2, baths: 1, floors: 1, term: "от 60 д.",
    rooms: "2 спальни", purpose: "ИЖС / Дача / Глэмпинг", city: "Пермский край",
    maker: { ...HISTHUT, siteUrl: "https://histhut.ru/product/modul-hizhina-20" },
    description: "Семейный модульный дом с двумя спальнями, жилой зоной и большой террасой.",
    descriptionLong: "Хижина 20 от HISTHUT — модульный дом площадью 42,52 м² для семьи до пяти человек. В планировке предусмотрены две спальни, жилая зона, санузел и большая терраса; проект подходит для загородного проживания, аренды и коммерческих туристических сценариев.",
    gallery: [
      { image: histhutHizhina20_1, type: "photo", fit: "contain", blur: true },
      { image: histhutHizhina20_2, type: "photo", fit: "contain", blur: true },
      { image: histhutHizhina20_3, type: "photo", fit: "contain", blur: true },
      { image: histhutHizhina20Plan, type: "plan", fit: "contain" },
    ],
    likes: 47, rating: 4.9,
    suitableFor: ["Постоянное проживание", "Для семьи", "Глэмпинг / аренда"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "до −30°C",
    features: ["Две спальни", "Большая терраса", "Семейная планировка"], style: "Современный", landSize: "6–10 соток",
    hasRealPhotos: true, hasShowroom: true, hasInstallment: false,
  },
  {
    id: 288, name: "Хижина 25", badge: "Модульный дом", price: "2 974 000 ₽",
    area: "53,72 м²", area_m2: 53.72, beds: 2, baths: 1, floors: 1, term: "от 60 д.",
    rooms: "2 спальни", purpose: "ИЖС / Дача / Глэмпинг", city: "Пермский край",
    maker: { ...HISTHUT, siteUrl: "https://histhut.ru/product/modul-hizhina-25" },
    description: "Большой модульный дом для семьи с двумя спальнями, санузлом и просторной террасой.",
    descriptionLong: "Хижина 25 от HISTHUT — модульный дом площадью 53,72 м² для круглогодичного проживания семьи. Планировка включает две спальни, зону отдыха, санузел, техническое помещение и просторную террасу; один из сценариев производителя — замена второй спальни на хаммам или сауну.",
    gallery: [
      { image: histhutHizhina25_1, type: "photo", fit: "contain", blur: true },
      { image: histhutHizhina25_2, type: "photo", fit: "contain", blur: true },
      { image: histhutHizhina25_3, type: "photo", fit: "contain", blur: true },
      { image: histhutHizhina25Plan, type: "plan", fit: "contain" },
    ],
    likes: 50, rating: 4.9,
    suitableFor: ["Постоянное проживание", "Для семьи", "Глэмпинг / аренда"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "до −30°C",
    features: ["Две спальни", "Техническое помещение", "Большая терраса"], style: "Современный", landSize: "6–10 соток",
    hasRealPhotos: true, hasShowroom: true, hasInstallment: false,
  },

  // ── CountryHouse · Санкт-Петербург ─────────────────────────────────────
  {
    id: 294, name: "Хайтек М1", badge: "Модульный дом", price: "по запросу",
    area: "20 м²", area_m2: 20, beds: 1, baths: 1, floors: 1, term: "150 д.",
    rooms: "студия", purpose: "Дача / Глэмпинг", city: "Санкт-Петербург",
    maker: { ...COUNTRYHOUSE, siteUrl: "https://modulniye-doma.ru/modulhightek-m1" },
    description: "Компактный одномодульный дом в стиле хай-тек с жилой зоной, санузлом и террасой.",
    descriptionLong: "Хайтек М1 от CountryHouse — компактный одномодульный дом площадью 20 м² для дачи, гостевого сценария или глэмпинга. На странице производителя указаны высота потолков 2,65 м, утепление пола и стен 200 мм, кровли 250 мм, чистовая отделка, остекление, электрика, водоснабжение и санузел в составе дома.",
    gallery: [
      { image: countryhouseHitechM1_1, type: "photo", fit: "contain", blur: true },
      { image: countryhouseHitechM1_2, type: "photo", fit: "contain", blur: true },
      { image: countryhouseHitechM1_3, type: "photo", fit: "contain", blur: true },
      { image: countryhouseHitechM1Plan, type: "plan", fit: "contain" },
    ],
    likes: 42, rating: 4.9,
    suitableFor: ["Дача", "Глэмпинг / аренда", "Гостевой дом"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "200 мм",
    features: ["Одномодульный формат", "Готовый санузел", "Терраса"], style: "Хай-тек", landSize: "3–6 соток",
    hasRealPhotos: true, hasShowroom: true, hasInstallment: false,
  },
  {
    id: 295, name: "Хайтек М1.5", badge: "Модульный дом", price: "по запросу",
    area: "30 м²", area_m2: 30, beds: 1, baths: 1, floors: 1, term: "150 д.",
    rooms: "1 спальня", purpose: "Дача / Компактное проживание", city: "Санкт-Петербург",
    maker: { ...COUNTRYHOUSE, siteUrl: "https://modulniye-doma.ru/modulhightek-m15" },
    description: "Полуторамодульный дом с компактной жилой зоной, спальней, санузлом и террасой.",
    descriptionLong: "Хайтек М1.5 от CountryHouse — полуторамодульный дом площадью 30 м² для небольшого участка, дачи или дополнительного жилья. Производитель описывает такие дома как быстрые в строительстве и полностью готовые к заселению: каркас, отделка, остекление, коммуникации, оборудование и сантехника входят в состав решения.",
    gallery: [
      { image: countryhouseHitechM15_1, type: "photo", fit: "contain", blur: true },
      { image: countryhouseHitechM15_2, type: "photo", fit: "contain", blur: true },
      { image: countryhouseHitechM15_3, type: "photo", fit: "contain", blur: true },
      { image: countryhouseHitechM15Plan, type: "plan", fit: "contain" },
    ],
    likes: 44, rating: 4.9,
    suitableFor: ["Дача", "Компактное проживание", "Гостевой дом"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "200 мм",
    features: ["Полуторамодульный формат", "Чистовая отделка", "Санузел"], style: "Хай-тек", landSize: "3–6 соток",
    hasRealPhotos: true, hasShowroom: true, hasInstallment: false,
  },
  {
    id: 296, name: "Г-образный проект М2", badge: "Модульный дом", price: "по запросу",
    area: "40 м²", area_m2: 40, beds: 1, baths: 1, floors: 1, term: "150 д.",
    rooms: "1 спальня", purpose: "Дача / Загородный дом", city: "Санкт-Петербург",
    maker: { ...COUNTRYHOUSE, siteUrl: "https://modulniye-doma.ru/modulhightek-m2" },
    description: "Двухмодульный дом с Г-образной планировкой, жилой зоной, спальней и террасой.",
    descriptionLong: "Г-образный проект М2 от CountryHouse — двухмодульный дом площадью 40 м². Формат рассчитан на комфортное размещение одного человека или пары: в составе дома может быть спальня, кухня-гостиная, вместительный санузел и веранда для отдыха; дом изготавливается в заводских условиях и собирается на участке.",
    gallery: [
      { image: countryhouseHitechM2_1, type: "photo", fit: "contain", blur: true },
      { image: countryhouseHitechM2_2, type: "photo", fit: "contain", blur: true },
      { image: countryhouseHitechM2_3, type: "photo", fit: "contain", blur: true },
      { image: countryhouseHitechM2Plan, type: "plan", fit: "contain" },
    ],
    likes: 46, rating: 4.9,
    suitableFor: ["Дача", "Для пары", "Круглогодичное проживание"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "200 мм",
    features: ["Г-образная планировка", "Веранда", "Заводская сборка"], style: "Хай-тек", landSize: "4–8 соток",
    hasRealPhotos: true, hasShowroom: true, hasInstallment: false,
  },
  {
    id: 297, name: "Три+ модуля с сауной", badge: "Модульный дом", price: "по запросу",
    area: "60 м²", area_m2: 60, beds: 2, baths: 1, floors: 1, term: "150 д.",
    rooms: "2 спальни", purpose: "ИЖС / Дача", city: "Санкт-Петербург",
    maker: { ...COUNTRYHOUSE, siteUrl: "https://modulniye-doma.ru/modulhightek-m3" },
    description: "Трёхмодульный дом с увеличенной площадью, сауной и планировкой для загородного отдыха.",
    descriptionLong: "Три+ модуля с сауной от CountryHouse — модульный дом площадью 60 м² для загородного проживания и отдыха. Линейка трёхмодульных домов на сайте производителя включает несколько планировок, а выбранный вариант делает акцент на комфортном семейном сценарии, террасе и сауне.",
    gallery: [
      { image: countryhouseHitechM3_1, type: "photo", fit: "contain", blur: true },
      { image: countryhouseHitechM3_2, type: "photo", fit: "contain", blur: true },
      { image: countryhouseHitechM3_3, type: "photo", fit: "contain", blur: true },
      { image: countryhouseHitechM3Plan, type: "plan", fit: "contain" },
    ],
    likes: 49, rating: 4.9,
    suitableFor: ["Круглогодичное проживание", "Для семьи", "Отдых с сауной"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "200 мм",
    features: ["Сауна", "Терраса", "Трёхмодульный формат"], style: "Хай-тек", landSize: "6–10 соток",
    hasRealPhotos: true, hasShowroom: true, hasInstallment: false,
  },
  {
    id: 298, name: "5 модулей 1.0", badge: "Модульный дом", price: "по запросу",
    area: "100 м²", area_m2: 100, beds: 2, baths: 1, floors: 1, term: "150 д.",
    rooms: "2 спальни", purpose: "ИЖС / Загородный дом", city: "Санкт-Петербург",
    maker: { ...COUNTRYHOUSE, siteUrl: "https://modulniye-doma.ru/modulhightek-m5" },
    description: "Просторный пятимодульный дом для семьи с большой жилой зоной, спальнями и террасой.",
    descriptionLong: "5 модулей 1.0 от CountryHouse — просторный модульный дом площадью 100 м² из линейки пятимодульных домов. Проект рассчитан на семейный загородный сценарий: большая жилая зона, спальни, санузел, терраса и заводское изготовление модулей с последующей сборкой на участке.",
    gallery: [
      { image: countryhouseHitechM5_1, type: "photo", fit: "contain", blur: true },
      { image: countryhouseHitechM5_2, type: "photo", fit: "contain", blur: true },
      { image: countryhouseHitechM5_3, type: "photo", fit: "contain", blur: true },
      { image: countryhouseHitechM5Plan, type: "plan", fit: "contain" },
    ],
    likes: 52, rating: 4.9,
    suitableFor: ["Постоянное проживание", "Для семьи", "Загородный участок"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "200 мм",
    features: ["Пять модулей", "Большая жилая зона", "Терраса"], style: "Хай-тек", landSize: "8–12 соток",
    hasRealPhotos: true, hasShowroom: true, hasInstallment: false,
  },

  // ── CUBA DOM · Санкт-Петербург и ЛО ───────────────────────────────────
  {
    id: 299, name: "CUBA 35-1", badge: "Модульный дом", price: "2 280 000 ₽",
    area: "35 м²", area_m2: 35, beds: 1, baths: 1, floors: 1, term: "по договору",
    rooms: "1 спальня", purpose: "ИЖС / Дача", city: "Санкт-Петербург и ЛО",
    maker: { ...CUBADOM, siteUrl: "https://cuba-dom.ru/modulnye-doma-planirovki-i-ceny/tproduct/2136176771-964862565722-cuba-35-1" },
    description: "Компактный модульный дом с одной спальней, кухней-гостиной и террасой.",
    descriptionLong: "CUBA 35-1 от CUBA DOM — модульный дом площадью 35 м² с одной спальней и высотой потолков 2,6 м. В каталоге производителя проект представлен с несколькими вариантами комплектации: тёплый контур, чистовая отделка, а также версии с крытой террасой.",
    gallery: [
      { image: cubadomCuba351_1, type: "plan", fit: "contain" },
      { image: cubadomCuba351Plan1, type: "plan", fit: "contain" },
      { image: cubadomCuba351Plan2, type: "plan", fit: "contain" },
      { image: cubadomCuba351Plan3, type: "plan", fit: "contain" },
    ],
    likes: 43, rating: 4.9,
    suitableFor: ["Дача", "Компактное проживание", "Гостевой дом"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["Терраса", "Высота потолков 2,6 м", "Чистовая отделка"], style: "Современный", landSize: "4–7 соток",
    hasRealPhotos: false, hasShowroom: true, hasInstallment: true,
  },
  {
    id: 300, name: "CUBA 35-2", badge: "Модульный дом", price: "2 360 000 ₽",
    area: "35 м²", area_m2: 35, beds: 2, baths: 1, floors: 1, term: "по договору",
    rooms: "2 спальни", purpose: "ИЖС / Дача", city: "Санкт-Петербург и ЛО",
    maker: { ...CUBADOM, siteUrl: "https://cuba-dom.ru/modulnye-doma-planirovki-i-ceny/tproduct/2136181381-241045539232-cuba-35-2" },
    description: "Модульный дом 35 м² с двумя спальнями, кухней-гостиной и санузлом.",
    descriptionLong: "CUBA 35-2 — компактный модульный дом площадью 35 м² для семьи или загородного проживания. В проекте две спальни, кухня-гостиная, прихожая и санузел; высота потолков на странице производителя указана 2,6 м.",
    gallery: [
      { image: cubadomCuba352_1, type: "plan", fit: "contain" },
      { image: cubadomCuba352Plan1, type: "plan", fit: "contain" },
      { image: cubadomCuba352Plan2, type: "plan", fit: "contain" },
      { image: cubadomCuba352Plan3, type: "plan", fit: "contain" },
    ],
    likes: 45, rating: 4.9,
    suitableFor: ["Дача", "Для семьи", "Круглогодичное проживание"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["2 спальни", "Терраса", "Высота потолков 2,6 м"], style: "Современный", landSize: "4–7 соток",
    hasRealPhotos: false, hasShowroom: true, hasInstallment: true,
  },
  {
    id: 301, name: "CUBA 53-1", badge: "Модульный дом", price: "3 470 000 ₽",
    area: "53 м²", area_m2: 53, beds: 2, baths: 1, floors: 1, term: "по договору",
    rooms: "2 спальни", purpose: "ИЖС / СНТ", city: "Санкт-Петербург и ЛО",
    maker: { ...CUBADOM, siteUrl: "https://cuba-dom.ru/modulnye-doma-planirovki-i-ceny/tproduct/2136181381-545476284282-cuba-53-1" },
    description: "Модульный дом 53 м² с двумя спальнями, кухней-гостиной и террасой.",
    descriptionLong: "CUBA 53-1 от CUBA DOM — модульный дом площадью 53 м² с двумя спальнями. Планировка рассчитана на комфортный загородный сценарий: кухня-гостиная, спальни, санузел, прихожая и терраса; высота потолков указана 2,6 м.",
    gallery: [
      { image: cubadomCuba531_1, type: "plan", fit: "contain" },
      { image: cubadomCuba531Plan1, type: "plan", fit: "contain" },
      { image: cubadomCuba531Plan2, type: "plan", fit: "contain" },
      { image: cubadomCuba531Plan3, type: "plan", fit: "contain" },
    ],
    likes: 48, rating: 4.9,
    suitableFor: ["Круглогодичное проживание", "Для семьи", "Загородный участок"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["2 спальни", "Терраса", "Кухня-гостиная"], style: "Современный", landSize: "6–9 соток",
    hasRealPhotos: false, hasShowroom: true, hasInstallment: true,
  },
  {
    id: 302, name: "CUBA 53-2", badge: "Модульный дом", price: "3 470 000 ₽",
    area: "53 м²", area_m2: 53, beds: 2, baths: 1, floors: 1, term: "по договору",
    rooms: "2 спальни", purpose: "ИЖС / СНТ", city: "Санкт-Петербург и ЛО",
    maker: { ...CUBADOM, siteUrl: "https://cuba-dom.ru/modulnye-doma-planirovki-i-ceny/tproduct/2136181381-395158214302-cuba-53-2" },
    description: "Вариант модульного дома 53 м² с двумя спальнями и просторной общей зоной.",
    descriptionLong: "CUBA 53-2 — альтернативная планировка модульного дома площадью 53 м². Проект сохраняет семейный сценарий с двумя спальнями и кухней-гостиной, а разные варианты планировок позволяют подобрать решение под участок и образ жизни.",
    gallery: [
      { image: cubadomCuba532_1, type: "plan", fit: "contain" },
      { image: cubadomCuba532Plan1, type: "plan", fit: "contain" },
      { image: cubadomCuba532Plan2, type: "plan", fit: "contain" },
      { image: cubadomCuba532Plan3, type: "plan", fit: "contain" },
    ],
    likes: 47, rating: 4.9,
    suitableFor: ["Круглогодичное проживание", "Для семьи", "СНТ"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["2 спальни", "Терраса", "Чистовая отделка"], style: "Современный", landSize: "6–9 соток",
    hasRealPhotos: false, hasShowroom: true, hasInstallment: true,
  },
  {
    id: 303, name: "CUBA 70-1", badge: "Модульный дом", price: "4 550 000 ₽",
    area: "70 м²", area_m2: 70, beds: 3, baths: 2, floors: 1, term: "по договору",
    rooms: "3 спальни", purpose: "ИЖС / СНТ", city: "Санкт-Петербург и ЛО",
    maker: { ...CUBADOM, siteUrl: "https://cuba-dom.ru/modulnye-doma-planirovki-i-ceny/tproduct/2136182161-885721032042-cuba-70-1" },
    description: "Семейный модульный дом 70 м² с тремя спальнями, двумя санузлами и террасой.",
    descriptionLong: "CUBA 70-1 от CUBA DOM — модульный дом площадью 70 м² для постоянного проживания семьи. В карточке производителя указаны три спальни, два санузла, кухня-гостиная, прихожая, терраса и высота потолков 2,6 м.",
    gallery: [
      { image: cubadomCuba701_1, type: "plan", fit: "contain" },
      { image: cubadomCuba701Plan1, type: "plan", fit: "contain" },
      { image: cubadomCuba701Plan2, type: "plan", fit: "contain" },
      { image: cubadomCuba701Plan3, type: "plan", fit: "contain" },
    ],
    likes: 52, rating: 4.9,
    suitableFor: ["Постоянное проживание", "Для семьи", "Загородный участок"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["3 спальни", "2 санузла", "Терраса"], style: "Современный", landSize: "7–11 соток",
    hasRealPhotos: false, hasShowroom: true, hasInstallment: true,
  },

  // ── АЙДОЛХАУС · Воронеж ───────────────────────────────────────────────
  {
    id: 304, name: "АЙДОЛХАУС 36", badge: "Модульный дом", price: "3 150 000 ₽",
    area: "35,77 м²", area_m2: 35.77, beds: 1, baths: 1, floors: 1, term: "90 д.",
    rooms: "1 спальня", purpose: "ИЖС / Дача", city: "Воронеж",
    maker: { ...IDOLHOUSE, siteUrl: "https://idolhouse.ru/modul-house/36" },
    description: "Компактный модульный дом с кухней-гостиной, спальней, санузлом и закрытой террасой.",
    descriptionLong: "Модульный дом АЙДОЛХАУС 36 — проект площадью 35,77 м² для дачи, гостевого сценария или компактного круглогодичного проживания. По данным производителя, в планировке предусмотрены кухня-гостиная 12,33 м², спальня 8,54 м², санузел 3,39 м² и закрытая терраса 11,51 м².",
    gallery: [
      { image: idolhouse36_1, type: "photo", fit: "contain", blur: true },
      { image: idolhouse36Plan, type: "plan", fit: "contain" },
    ],
    likes: 44, rating: 4.9,
    suitableFor: ["Дача", "Гостевой дом", "Компактное проживание"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["Закрытая терраса", "Чистовая отделка", "Мебель и техника"], style: "Современный", landSize: "4–7 соток",
    hasRealPhotos: true, hasShowroom: true, hasInstallment: true,
  },
  {
    id: 305, name: "АЙДОЛХАУС 47", badge: "Модульный дом", price: "3 870 000 ₽",
    area: "47,07 м²", area_m2: 47.07, beds: 1, baths: 1, floors: 1, term: "90 д.",
    rooms: "1 спальня", purpose: "ИЖС / Дача", city: "Воронеж",
    maker: { ...IDOLHOUSE, siteUrl: "https://idolhouse.ru/modul-house/47" },
    description: "Модульный дом 47 м² с увеличенной кухней-гостиной, спальней, санузлом и закрытой террасой.",
    descriptionLong: "АЙДОЛХАУС 47 — модульный дом площадью 47,07 м². Производитель указывает кухню-гостиную 23,63 м², спальню 8,54 м², санузел 3,39 м² и закрытую террасу 11,51 м²; проект рассчитан на быстрый монтаж и формат «заезжай и живи».",
    gallery: [
      { image: idolhouse47_1, type: "photo", fit: "contain", blur: true },
      { image: idolhouse47Plan, type: "plan", fit: "contain" },
    ],
    likes: 46, rating: 4.9,
    suitableFor: ["Дача", "Для пары", "Круглогодичное проживание"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["Большая кухня-гостиная", "Закрытая терраса", "Готовая отделка"], style: "Современный", landSize: "4–8 соток",
    hasRealPhotos: true, hasShowroom: true, hasInstallment: true,
  },
  {
    id: 306, name: "АЙДОЛХАУС 62", badge: "Модульный дом", price: "4 200 000 ₽",
    area: "61,53 м²", area_m2: 61.53, beds: 2, baths: 1, floors: 1, term: "90 д.",
    rooms: "2 спальни", purpose: "ИЖС / СНТ", city: "Воронеж",
    maker: { ...IDOLHOUSE, siteUrl: "https://idolhouse.ru/modul-house/62" },
    description: "Семейный модульный дом с двумя спальнями, кухней-гостиной и двумя террасами.",
    descriptionLong: "АЙДОЛХАУС 62 — модульный дом площадью 61,53 м² с двумя спальнями. В описании производителя указаны кухня-гостиная 19,1 м², спальни 8,75 и 6,18 м², санузел, закрытая терраса 11,51 м² и открытая терраса 12,6 м².",
    gallery: [
      { image: idolhouse62_1, type: "photo", fit: "contain", blur: true },
      { image: idolhouse62Plan, type: "plan", fit: "contain" },
    ],
    likes: 48, rating: 4.9,
    suitableFor: ["Круглогодичное проживание", "Для семьи", "СНТ"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["2 спальни", "Закрытая терраса", "Открытая терраса"], style: "Современный", landSize: "6–9 соток",
    hasRealPhotos: true, hasShowroom: true, hasInstallment: true,
  },
  {
    id: 307, name: "АЙДОЛХАУС 72", badge: "Модульный дом", price: "4 920 000 ₽",
    area: "72,46 м²", area_m2: 72.46, beds: 2, baths: 1, floors: 1, term: "90 д.",
    rooms: "2 спальни", purpose: "ИЖС / СНТ", city: "Воронеж",
    maker: { ...IDOLHOUSE, siteUrl: "https://idolhouse.ru/modul-house/72" },
    description: "Модульный дом 72 м² с двумя спальнями, просторной кухней-гостиной и террасами.",
    descriptionLong: "АЙДОЛХАУС 72 — одноэтажный модульный дом площадью 72,46 м². Планировка включает кухню-гостиную 23,63 м², две спальни, санузел, закрытую террасу 11,51 м² и открытую террасу 12,5 м².",
    gallery: [
      { image: idolhouse72_1, type: "photo", fit: "contain", blur: true },
      { image: idolhouse72Plan, type: "plan", fit: "contain" },
    ],
    likes: 50, rating: 4.9,
    suitableFor: ["Постоянное проживание", "Для семьи", "Загородный участок"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["2 спальни", "Кухня-гостиная 23,63 м²", "2 террасы"], style: "Современный", landSize: "6–10 соток",
    hasRealPhotos: true, hasShowroom: true, hasInstallment: true,
  },
  {
    id: 308, name: "АЙДОЛХАУС 86", badge: "Модульный дом", price: "5 700 000 ₽",
    area: "85,83 м²", area_m2: 85.83, beds: 3, baths: 1, floors: 1, term: "90 д.",
    rooms: "3 спальни", purpose: "ИЖС / СНТ", city: "Воронеж",
    maker: { ...IDOLHOUSE, siteUrl: "https://idolhouse.ru/modul-house/86" },
    description: "Просторный модульный дом с тремя спальнями, кухней-гостиной и двумя террасами.",
    descriptionLong: "АЙДОЛХАУС 86 — модульный дом площадью 85,83 м² для семейного проживания. Производитель указывает три спальни, кухню-гостиную 30,61 м², санузел, закрытую террасу 11,51 м² и открытую террасу 12,5 м².",
    gallery: [
      { image: idolhouse86_1, type: "photo", fit: "contain", blur: true },
      { image: idolhouse86Plan, type: "plan", fit: "contain" },
    ],
    likes: 53, rating: 4.9,
    suitableFor: ["Постоянное проживание", "Для семьи", "ИЖС"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["3 спальни", "Кухня-гостиная 30,61 м²", "2 террасы"], style: "Современный", landSize: "7–11 соток",
    hasRealPhotos: true, hasShowroom: true, hasInstallment: true,
  },

  // ── WOODALP · Москва и МО ──────────────────────────────────────────────
  {
    id: 309, name: "WOODHOUSE 60 PRO", badge: "Модульно-каркасный дом", price: "по запросу",
    area: "60 м²", area_m2: 60, beds: 2, baths: 1, floors: 1, term: "60 д.",
    rooms: "2 спальни", purpose: "ИЖС / СНТ", city: "Москва и МО",
    maker: { ...WOODALP, siteUrl: "https://woodalphouse.ru/#rec1541828301" },
    description: "Модульно-каркасный дом WOODALP для постоянного проживания с полной отделкой и инженерией.",
    descriptionLong: "WOODHOUSE 60 PRO от WOODALP — модульно-каркасный дом для постоянного проживания. Производитель описывает дома как заводские PREFAB-решения с полной отделкой, коммуникациями, свайным фундаментом и быстрым монтажом на участке.",
    gallery: [
      { image: woodhouse60_1, type: "photo", fit: "contain", blur: true },
      { image: woodhouse60_2, type: "photo", fit: "contain", blur: true },
    ],
    likes: 45, rating: 4.9,
    suitableFor: ["Постоянное проживание", "Для семьи", "Загородный участок"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["PREFAB", "Панорамные окна", "Монтаж 1–2 дня"], style: "Современный", landSize: "6–9 соток",
    hasRealPhotos: true, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 310, name: "WOODHOUSE 90 PRO", badge: "Модульно-каркасный дом", price: "по запросу",
    area: "90 м²", area_m2: 90, beds: 3, baths: 1, floors: 1, term: "60 д.",
    rooms: "3 спальни", purpose: "ИЖС / СНТ", city: "Москва и МО",
    maker: { ...WOODALP, siteUrl: "https://woodalphouse.ru/#rec1541828301" },
    description: "Семейный модульно-каркасный дом 90 м² с заводской готовностью и отделкой под ключ.",
    descriptionLong: "WOODHOUSE 90 PRO — проект из линейки WOODALP для семейного загородного проживания. Дом изготавливается в заводских условиях, комплектуется отделкой и инженерией, а на участке собирается без долгой мокрой стройки.",
    gallery: [
      { image: woodhouse90_1, type: "photo", fit: "contain", blur: true },
      { image: woodhouse90_2, type: "photo", fit: "contain", blur: true },
    ],
    likes: 48, rating: 4.9,
    suitableFor: ["Постоянное проживание", "Для семьи", "ИЖС"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["Заводская сборка", "Полная отделка", "Энергоэффективный контур"], style: "Современный", landSize: "7–11 соток",
    hasRealPhotos: true, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 311, name: "WOODHOUSE 120 PRO", badge: "Модульно-каркасный дом", price: "по запросу",
    area: "120 м²", area_m2: 120, beds: 3, baths: 2, floors: 1, term: "60 д.",
    rooms: "3 спальни", purpose: "ИЖС", city: "Москва и МО",
    maker: { ...WOODALP, siteUrl: "https://woodalphouse.ru/#rec1541828301" },
    description: "Крупный модульно-каркасный дом для постоянного проживания с готовой инженерией.",
    descriptionLong: "WOODHOUSE 120 PRO — старшая модель WOODALP из линейки модульно-каркасных домов. Формат рассчитан на постоянное проживание семьи: заводская подготовка, утепленный контур, панорамные окна, чистовая отделка и инженерные системы.",
    gallery: [
      { image: woodhouse120_1, type: "photo", fit: "contain", blur: true },
      { image: woodhouse120_2, type: "photo", fit: "contain", blur: true },
    ],
    likes: 51, rating: 4.9,
    suitableFor: ["Постоянное проживание", "Для семьи", "Загородный участок"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["Большая площадь", "Панорамные окна", "Готовая инженерия"], style: "Современный", landSize: "8–12 соток",
    hasRealPhotos: true, hasShowroom: false, hasInstallment: false,
  },

  // ── Boxmate · Санкт-Петербург и ЛО ─────────────────────────────────────
  {
    id: 312, name: "Flat 5 Box", badge: "Модульный дом", price: "по запросу",
    area: "127 м²", area_m2: 127, beds: 3, baths: 2, floors: 1, term: "2 мес.",
    rooms: "3 спальни", purpose: "ИЖС / СНТ", city: "Санкт-Петербург и ЛО",
    maker: { ...BOXMATE, siteUrl: "https://boxmate.ru/flat5box_" },
    description: "Дом линейки Flat Box площадью 127 м² для постоянного проживания семьи.",
    descriptionLong: "Flat 5 Box от Boxmate — модульный дом площадью 127 м² из линейки Flat Box. Производитель позиционирует серию как готовое решение для загородной жизни с продуманной эргономикой, заводской сборкой и отделкой.",
    gallery: [
      { image: boxmateFlat5_1, type: "photo", fit: "contain", blur: true },
    ],
    likes: 56, rating: 4.9,
    suitableFor: ["Постоянное проживание", "Для семьи", "ИЖС"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["Линейка Flat Box", "Заводская сборка", "Современная отделка"], style: "Современный", landSize: "8–12 соток",
    hasRealPhotos: true, hasShowroom: true, hasInstallment: true,
  },
  {
    id: 313, name: "Flat 4 Box", badge: "Модульный дом", price: "по запросу",
    area: "107 м²", area_m2: 107, beds: 3, baths: 2, floors: 1, term: "2 мес.",
    rooms: "3 спальни", purpose: "ИЖС / СНТ", city: "Санкт-Петербург и ЛО",
    maker: { ...BOXMATE, siteUrl: "https://boxmate.ru/flat4box_" },
    description: "Модульный дом 107 м² из серии Flat Box с плоской кровлей и семейной планировкой.",
    descriptionLong: "Flat 4 Box — модель Boxmate площадью 107 м². Дом относится к линейке Flat Box, где акцент сделан на современной архитектуре, плоской кровле, готовой отделке и комфортной планировке для семьи.",
    gallery: [
      { image: boxmateFlat4_1, type: "photo", fit: "contain", blur: true },
    ],
    likes: 54, rating: 4.9,
    suitableFor: ["Постоянное проживание", "Для семьи", "Загородный участок"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["Flat Box", "Плоская кровля", "Готовая отделка"], style: "Минимализм", landSize: "7–11 соток",
    hasRealPhotos: true, hasShowroom: true, hasInstallment: true,
  },
  {
    id: 314, name: "Flat 3 Box", badge: "Модульный дом", price: "от 7 055 000 ₽",
    area: "86 м²", area_m2: 86, beds: 2, baths: 1, floors: 1, term: "2 мес.",
    rooms: "2 спальни", purpose: "ИЖС / СНТ", city: "Санкт-Петербург и ЛО",
    maker: { ...BOXMATE, siteUrl: "https://boxmate.ru/flat3box_" },
    description: "Компактный дом Flat Box 86 м² с террасой и готовой отделкой.",
    descriptionLong: "Flat 3 Box от Boxmate — модульный дом площадью 86 м². На странице производителя указаны габариты 9 × 10,1 м, общая площадь 86 м², площадь дома 62 м² и терраса 24 м²; стандартная комплектация стартует от 7 055 000 ₽.",
    gallery: [
      { image: boxmateFlat3_1, type: "photo", fit: "contain", blur: true },
      { image: boxmateFlat3Plan, type: "plan", fit: "contain" },
    ],
    likes: 52, rating: 4.9,
    suitableFor: ["Постоянное проживание", "Для пары", "СНТ"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["Терраса 24 м²", "Плоская кровля", "Готовность за 2 месяца"], style: "Минимализм", landSize: "6–10 соток",
    hasRealPhotos: true, hasShowroom: true, hasInstallment: true,
  },
  {
    id: 315, name: "Red 5 Box", badge: "Модульный дом", price: "по запросу",
    area: "135 м²", area_m2: 135, beds: 3, baths: 2, floors: 1, term: "2 мес.",
    rooms: "3 спальни", purpose: "ИЖС / СНТ", city: "Санкт-Петербург и ЛО",
    maker: { ...BOXMATE, siteUrl: "https://boxmate.ru/red5box_" },
    description: "Модульный дом 135 м² из дизайнерской линейки Red Box.",
    descriptionLong: "Red 5 Box — дом Boxmate площадью 135 м² из линейки Red Box. Серия делает акцент на выразительной архитектуре, дизайнерской отделке и заводской готовности, чтобы дом можно было быстро установить на участке.",
    gallery: [
      { image: boxmateRed5_1, type: "photo", fit: "contain", blur: true },
    ],
    likes: 57, rating: 4.9,
    suitableFor: ["Постоянное проживание", "Для семьи", "Дизайнерский дом"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["Red Box", "Дизайнерская отделка", "Заводская сборка"], style: "Современный", landSize: "8–12 соток",
    hasRealPhotos: true, hasShowroom: true, hasInstallment: true,
  },
  {
    id: 316, name: "Red 4 Box", badge: "Модульный дом", price: "по запросу",
    area: "113 м²", area_m2: 113, beds: 3, baths: 2, floors: 1, term: "2 мес.",
    rooms: "3 спальни", purpose: "ИЖС / СНТ", city: "Санкт-Петербург и ЛО",
    maker: { ...BOXMATE, siteUrl: "https://boxmate.ru/red4box_" },
    description: "Дом Red Box 113 м² с современной архитектурой и готовым интерьером.",
    descriptionLong: "Red 4 Box от Boxmate — модульный дом площадью 113 м². Это средняя модель в линейке Red Box: современный экстерьер, заводская сборка, продуманная семейная планировка и финишная отделка.",
    gallery: [
      { image: boxmateRed4_1, type: "photo", fit: "contain", blur: true },
    ],
    likes: 55, rating: 4.9,
    suitableFor: ["Постоянное проживание", "Для семьи", "Загородный участок"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["Red Box", "Семейная планировка", "Готовая отделка"], style: "Современный", landSize: "7–11 соток",
    hasRealPhotos: true, hasShowroom: true, hasInstallment: true,
  },

  // ── UV House · Уфа ─────────────────────────────────────────────────────
  {
    id: 317, name: "Моно 30", badge: "Модульный дом", price: "1 500 000 ₽",
    area: "30 м²", area_m2: 30, beds: 1, baths: 1, floors: 1, term: "по договору",
    rooms: "студия", purpose: "Дача / Гостевой дом", city: "Уфа",
    maker: { ...UVHOUSE, siteUrl: "https://ufa-vagon.ru/mono30" },
    description: "Компактный модульный дом с террасой, кухней-гостиной, тамбуром и санузлом.",
    descriptionLong: "Моно 30 от UV House — компактный модульный дом с просторной террасой. В описании производителя выделены панорамное окно в гостиной-кухне, удобный тамбур, санузел и сценарий для дачи или гостевого домика.",
    gallery: [
      { image: uvhouseMono30_1, type: "photo", fit: "contain", blur: true },
      { image: uvhouseMono30Plan, type: "plan", fit: "contain" },
    ],
    likes: 42, rating: 4.9,
    suitableFor: ["Дача", "Гостевой дом", "Компактное проживание"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["Терраса", "Панорамное окно", "Санузел"], style: "Современный", landSize: "3–6 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 318, name: "Сканди 32", badge: "Модульный дом", price: "1 960 000 ₽",
    area: "32 м²", area_m2: 32, beds: 1, baths: 1, floors: 1, term: "по договору",
    rooms: "1 спальня", purpose: "Дача / Гостевой дом", city: "Уфа",
    maker: { ...UVHOUSE, siteUrl: "https://ufa-vagon.ru/scandi32" },
    description: "Модульный дом в скандинавском стиле с панорамными окнами, спальней и террасой.",
    descriptionLong: "Сканди 32 от UV House — модульный дом с панорамными окнами в гостиной-кухне и спальне. Производитель описывает проект как минималистичное и функциональное решение с уютной террасой для отдыха на участке.",
    gallery: [
      { image: uvhouseScandi32_1, type: "photo", fit: "contain", blur: true },
      { image: uvhouseScandi32Plan, type: "plan", fit: "contain" },
    ],
    likes: 44, rating: 4.9,
    suitableFor: ["Дача", "Для пары", "Круглогодичное проживание"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["Панорамные окна", "Терраса", "Скандинавский стиль"], style: "Скандинавский", landSize: "3–6 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 319, name: "Норд 40", badge: "Модульный дом", price: "2 599 000 ₽",
    area: "40 м²", area_m2: 40, beds: 1, baths: 1, floors: 1, term: "по договору",
    rooms: "1 спальня", purpose: "ИЖС / Дача", city: "Уфа",
    maker: { ...UVHOUSE, siteUrl: "https://ufa-vagon.ru/nord40" },
    description: "Популярный модульный дом 40 м² с большой кухней-гостиной, спальней и санузлом.",
    descriptionLong: "Норд 40 — один из популярных проектов UV House: светлый модульный дом с большой гостиной-кухней и панорамными окнами. В планировке предусмотрены просторная спальня, санузел с душевой кабиной и функциональная жилая зона.",
    gallery: [
      { image: uvhouseNord40_1, type: "photo", fit: "contain", blur: true },
      { image: uvhouseNord40_2, type: "photo", fit: "contain", blur: true },
      { image: uvhouseNord40Plan, type: "plan", fit: "contain" },
    ],
    likes: 47, rating: 4.9,
    suitableFor: ["Круглогодичное проживание", "Для пары", "Дача"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["Кухня-гостиная", "Панорамные окна", "Санузел с душевой"], style: "Современный", landSize: "4–8 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 320, name: "Шале 24", badge: "Модульный дом", price: "2 599 000 ₽",
    area: "24 м²", area_m2: 24, beds: 2, baths: 1, floors: 1, term: "по договору",
    rooms: "2 спальни", purpose: "Дача / Гостевой дом", city: "Уфа",
    maker: { ...UVHOUSE, siteUrl: "https://ufa-vagon.ru/shale24" },
    description: "Компактный модульный дом в стиле шале с кухней-гостиной, двумя спальнями, санузлом и террасой.",
    descriptionLong: "Шале 24 от UV House — компактный модульный дом с кухней-гостиной, двумя спальными комнатами, санузлом и террасой. Проект сочетает минималистичный дизайн шале, простые формы и функциональную планировку для дачного сценария.",
    gallery: [
      { image: uvhouseShale24_1, type: "photo", fit: "contain", blur: true },
      { image: uvhouseShale24_2, type: "photo", fit: "contain", blur: true },
      { image: uvhouseShale24Plan, type: "plan", fit: "contain" },
    ],
    likes: 46, rating: 4.9,
    suitableFor: ["Дача", "Гостевой дом", "Для семьи"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["2 спальни", "Терраса", "Стиль шале"], style: "Шале", landSize: "4–7 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 321, name: "Сканди 40", badge: "Модульный дом", price: "2 599 000 ₽",
    area: "40 м²", area_m2: 40, beds: 1, baths: 1, floors: 1, term: "по договору",
    rooms: "1 спальня", purpose: "ИЖС / Дача", city: "Уфа",
    maker: { ...UVHOUSE, siteUrl: "https://ufa-vagon.ru/scandi40" },
    description: "Модульный дом 40 м² с панорамными окнами, спальней, санузлом и двумя террасами.",
    descriptionLong: "Сканди 40 от UV House — модульный дом с панорамными окнами и двумя компактными террасами. Внутри предусмотрены просторная гостиная-кухня, спальня и санузел; проект рассчитан на комфортный загородный сценарий.",
    gallery: [
      { image: uvhouseScandi40_1, type: "photo", fit: "contain", blur: true },
      { image: uvhouseScandi40_2, type: "photo", fit: "contain", blur: true },
      { image: uvhouseScandi40Plan, type: "plan", fit: "contain" },
    ],
    likes: 48, rating: 4.9,
    suitableFor: ["Круглогодичное проживание", "Для пары", "Дача"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["2 террасы", "Панорамные окна", "Кухня-гостиная"], style: "Скандинавский", landSize: "4–8 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 322, name: "Альтаир 20", badge: "Модульный дом", price: "1 250 000 ₽",
    area: "20 м²", area_m2: 20, beds: 1, baths: 1, floors: 1, term: "45 дней",
    rooms: "студия", purpose: "Дача / Глэмпинг", city: "Москва и МО",
    maker: { ...ASTERIUS, siteUrl: "https://asterius-house.ru/altair20" },
    description: "Компактный модульный дом 20 м² для дачи, глэмпинга или аренды с полной заводской готовностью.",
    descriptionLong: "Альтаир 20 от Asterius House — компактный модульный дом площадью 20 м² для дачи, глэмпинга или арендного сценария. В проекте предусмотрены тёплый контур, внутренняя отделка, инженерные решения и санузел; дом доставляется на участок и монтируется за 1 день.",
    gallery: [
      { image: asteriusAltair20_1, type: "photo", fit: "contain", blur: true },
      { image: asteriusAltair20_2, type: "photo", fit: "contain", blur: true },
      { image: asteriusAltair20Plan, type: "plan", fit: "contain" },
    ],
    likes: 46, rating: 4.8,
    suitableFor: ["Дача", "Глэмпинг", "Аренда"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["Монтаж за 1 день", "Санузел", "Заводская готовность"], style: "Современный", landSize: "3–6 соток",
    hasRealPhotos: false, hasShowroom: true, hasInstallment: true,
  },
  {
    id: 323, name: "Альтаир 30", badge: "Модульный дом", price: "1 750 000 ₽",
    area: "30 м²", area_m2: 30, beds: 1, baths: 1, floors: 1, term: "45 дней",
    rooms: "1 спальня", purpose: "Дача / Глэмпинг", city: "Москва и МО",
    maker: { ...ASTERIUS, siteUrl: "https://asterius-house.ru/altair30" },
    description: "Модульный дом 30 м² для дачи и глэмпинга с отдельной спальней, кухней-гостиной и санузлом.",
    descriptionLong: "Альтаир 30 от Asterius House — модульный дом площадью 30 м² для загородного отдыха, глэмпинга или компактного проживания. Планировка включает спальню, кухню-гостиную и санузел; проект поставляется под ключ с заводской подготовкой и быстрым монтажом на участке.",
    gallery: [
      { image: asteriusAltair30_1, type: "photo", fit: "contain", blur: true },
      { image: asteriusAltair30_2, type: "photo", fit: "contain", blur: true },
      { image: asteriusAltair30Plan, type: "plan", fit: "contain" },
    ],
    likes: 52, rating: 4.8,
    suitableFor: ["Дача", "Глэмпинг", "Для пары"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["Отдельная спальня", "Санузел", "Монтаж за 1 день"], style: "Современный", landSize: "4–7 соток",
    hasRealPhotos: false, hasShowroom: true, hasInstallment: true,
  },
  {
    id: 324, name: "Антарес 40", badge: "Модульный дом", price: "2 300 000 ₽",
    area: "40 м²", area_m2: 40, beds: 1, baths: 1, floors: 1, term: "60 дней",
    rooms: "1 спальня", purpose: "ИЖС / Дача", city: "Москва и МО",
    maker: { ...ASTERIUS, siteUrl: "https://asterius-house.ru/antares40" },
    description: "Однокомнатный модульный дом 40 м² для постоянного проживания под ключ.",
    descriptionLong: "Антарес 40 от Asterius House — одноэтажный модульный дом площадью 40 м² для круглогодичного проживания. Проект рассчитан на компактный семейный или дачный сценарий: кухня-гостиная, спальня и санузел в готовом заводском модуле с доставкой и монтажом.",
    gallery: [
      { image: asteriusAntares40_1, type: "photo", fit: "contain", blur: true },
      { image: asteriusAntares40_2, type: "photo", fit: "contain", blur: true },
      { image: asteriusAntares40Plan, type: "plan", fit: "contain" },
    ],
    likes: 58, rating: 4.9,
    suitableFor: ["Круглогодичное проживание", "Дача", "Для пары"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["Панорамные окна", "Санузел", "Кухня-гостиная"], style: "Современный", landSize: "4–8 соток",
    hasRealPhotos: false, hasShowroom: true, hasInstallment: true,
  },
  {
    id: 325, name: "Антарес 60", badge: "Модульный дом", price: "3 150 000 ₽",
    area: "60 м²", area_m2: 60, beds: 2, baths: 1, floors: 1, term: "60 дней",
    rooms: "2 спальни", purpose: "ИЖС / ПМЖ", city: "Москва и МО",
    maker: { ...ASTERIUS, siteUrl: "https://asterius-house.ru/antares60" },
    description: "Модульный дом 60 м² с двумя спальнями и террасой для круглогодичного проживания.",
    descriptionLong: "Антарес 60 от Asterius House — модульный дом площадью 60 м² с двумя спальнями, кухней-гостиной, санузлом и террасой. Проект подходит для постоянного проживания и семейного загородного сценария, поставляется под ключ с заводской готовностью и быстрым монтажом.",
    gallery: [
      { image: asteriusAntares60_1, type: "photo", fit: "contain", blur: true },
      { image: asteriusAntares60_2, type: "photo", fit: "contain", blur: true },
      { image: asteriusAntares60Plan, type: "plan", fit: "contain" },
    ],
    likes: 63, rating: 4.9,
    suitableFor: ["Круглогодичное проживание", "Для семьи", "Ипотека"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["2 спальни", "Терраса", "Кухня-гостиная"], style: "Современный", landSize: "5–9 соток",
    hasRealPhotos: false, hasShowroom: true, hasInstallment: true,
  },
  {
    id: 326, name: "Антарес 80", badge: "Модульный дом", price: "4 060 000 ₽",
    area: "80 м²", area_m2: 80, beds: 3, baths: 1, floors: 1, term: "70 дней",
    rooms: "2–3 спальни", purpose: "ИЖС / ПМЖ", city: "Москва и МО",
    maker: { ...ASTERIUS, siteUrl: "https://asterius-house.ru/antares80" },
    description: "Просторный модульный дом 80 м² с двумя-тремя спальнями для семьи.",
    descriptionLong: "Антарес 80 от Asterius House — модульный дом площадью 80 м² для семьи и круглогодичного проживания. В проекте предусмотрены две-три спальни, общая зона кухни-гостиной, санузел и продуманная планировка для постоянной жизни за городом.",
    gallery: [
      { image: asteriusAntares80_1, type: "photo", fit: "contain", blur: true },
      { image: asteriusAntares80_2, type: "photo", fit: "contain", blur: true },
      { image: asteriusAntares80Plan, type: "plan", fit: "contain" },
    ],
    likes: 71, rating: 4.9,
    suitableFor: ["Круглогодичное проживание", "Для семьи", "Ипотека"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["2–3 спальни", "Панорамные окна", "Кухня-гостиная"], style: "Современный", landSize: "6–10 соток",
    hasRealPhotos: false, hasShowroom: true, hasInstallment: true,
  },
  {
    id: 327, name: "СМОЛА 103", badge: "Модульный дом", price: "9 690 000 ₽",
    area: "103 м²", area_m2: 103, beds: 3, baths: 2, floors: 1, term: "по договору",
    rooms: "3 спальни", purpose: "ИЖС / ПМЖ", city: "Москва и МО",
    maker: { ...SMOLA, siteUrl: "https://smolahouse.ru/smola-103" },
    description: "Просторный модульный дом 103 м² с большой террасой и панорамным остеклением.",
    descriptionLong: "СМОЛА 103 от SMOLA HOUSE — одноэтажный модульный дом для семьи и круглогодичного проживания. Проект сочетает большую жилую площадь, выразительную кровлю, панорамное остекление и террасу; подходит для постоянного загородного сценария в Московской области.",
    gallery: [
      { image: smola103_1, type: "photo", fit: "contain", blur: true },
      { image: smola103_2, type: "photo", fit: "contain", blur: true },
      { image: smola103Plan, type: "plan", fit: "contain" },
    ],
    likes: 72, rating: 4.9,
    suitableFor: ["Круглогодичное проживание", "Для семьи", "ИЖС"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["Терраса", "Панорамные окна", "Большая площадь"], style: "Современный", landSize: "8–12 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 328, name: "СМОЛА 65", badge: "Модульный дом", price: "6 290 000 ₽",
    area: "65 м²", area_m2: 65, beds: 2, baths: 1, floors: 1, term: "по договору",
    rooms: "2 спальни", purpose: "ИЖС / Дача", city: "Москва и МО",
    maker: { ...SMOLA, siteUrl: "https://smolahouse.ru/smola-65" },
    description: "Модульный дом 65 м² с террасой, панорамными окнами и семейной планировкой.",
    descriptionLong: "СМОЛА 65 — компактный семейный модульный дом площадью 65 м². В проекте предусмотрены комфортные жилые зоны, терраса и панорамное остекление; дом подходит для дачи, сезонного отдыха и круглогодичного проживания.",
    gallery: [
      { image: smola65_1, type: "photo", fit: "contain", blur: true },
      { image: smola65_2, type: "photo", fit: "contain", blur: true },
      { image: smola65Plan, type: "plan", fit: "contain" },
    ],
    likes: 64, rating: 4.8,
    suitableFor: ["Круглогодичное проживание", "Для семьи", "Дача"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["Терраса", "Панорамные окна", "2 спальни"], style: "Современный", landSize: "6–10 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 329, name: "СМОЛА 77", badge: "Модульный дом", price: "7 590 000 ₽",
    area: "77 м²", area_m2: 77, beds: 3, baths: 1, floors: 1, term: "по договору",
    rooms: "3 спальни", purpose: "ИЖС / ПМЖ", city: "Москва и МО",
    maker: { ...SMOLA, siteUrl: "https://smolahouse.ru/smola-77" },
    description: "Модульный дом 77 м² с террасой и планировкой для постоянного проживания семьи.",
    descriptionLong: "СМОЛА 77 от SMOLA HOUSE — одноэтажный модульный дом для семейного загородного проживания. Визуально лёгкая архитектура, большая зона остекления и терраса делают проект удобным для жизни за городом и отдыха на участке.",
    gallery: [
      { image: smola77_1, type: "photo", fit: "contain", blur: true },
      { image: smola77_2, type: "photo", fit: "contain", blur: true },
      { image: smola77Plan, type: "plan", fit: "contain" },
    ],
    likes: 68, rating: 4.9,
    suitableFor: ["Круглогодичное проживание", "Для семьи", "ИЖС"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["Терраса", "Панорамные окна", "Семейная планировка"], style: "Современный", landSize: "7–11 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 330, name: "СМОЛА 43", badge: "Модульный дом", price: "4 290 000 ₽",
    area: "43 м²", area_m2: 43, beds: 1, baths: 1, floors: 1, term: "по договору",
    rooms: "1 спальня", purpose: "Дача / Глэмпинг", city: "Москва и МО",
    maker: { ...SMOLA, siteUrl: "https://smolahouse.ru/smola-43" },
    description: "Компактный модульный дом 43 м² для дачи, аренды или небольшой семьи.",
    descriptionLong: "СМОЛА 43 — компактный модульный дом площадью 43 м² с современной архитектурой и террасой. Проект подходит для дачного сценария, гостевого дома, глэмпинга или арендного формата на загородном участке.",
    gallery: [
      { image: smola43_1, type: "photo", fit: "contain", blur: true },
      { image: smola43_2, type: "photo", fit: "contain", blur: true },
      { image: smola43Plan, type: "plan", fit: "contain" },
    ],
    likes: 57, rating: 4.8,
    suitableFor: ["Дача", "Глэмпинг", "Аренда"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["Терраса", "Панорамные окна", "Компактный формат"], style: "Современный", landSize: "4–7 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 331, name: "Ultra 36", badge: "Модульный дом", price: "3 320 000 ₽",
    area: "36 м²", area_m2: 36, beds: 1, baths: 1, floors: 1, term: "по договору",
    rooms: "1 спальня", purpose: "ИЖС / Дача", city: "Санкт-Петербург и ЛО",
    maker: { ...ULTRADOMSPB, siteUrl: "https://ultradomspb.ru/modeli-s-dvuskatnoj-krovlej/" },
    description: "Одноэтажный модульный дом 36 м² с двускатной крышей под ключ.",
    descriptionLong: "Ultra 36 от UltraDomSPb — компактный одноэтажный модульный дом с двускатной крышей. Проект подходит для дачи, гостевого дома или небольшого загородного проживания в Санкт-Петербурге и Ленинградской области.",
    gallery: [
      { image: ultra36_1, type: "photo", fit: "contain", blur: true },
    ],
    likes: 51, rating: 4.8,
    suitableFor: ["Дача", "Для пары", "Гостевой дом"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["Двускатная крыша", "Компактный формат", "Под ключ"], style: "Современный", landSize: "4–7 соток",
    hasRealPhotos: true, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 332, name: "Ultra 54", badge: "Модульный дом", price: "4 740 000 ₽",
    area: "54 м²", area_m2: 54, beds: 2, baths: 1, floors: 1, term: "по договору",
    rooms: "2 спальни", purpose: "ИЖС / Дача", city: "Санкт-Петербург и ЛО",
    maker: { ...ULTRADOMSPB, siteUrl: "https://ultradomspb.ru/modeli-s-dvuskatnoj-krovlej/" },
    description: "Модульный дом 54 м² с двускатной крышей для семьи или загородного отдыха.",
    descriptionLong: "Ultra 54 — модульный дом средней площади с двускатной крышей и практичной одноэтажной планировкой. Подходит для семейного дачного сценария и круглогодичного проживания за городом.",
    gallery: [
      { image: ultra54_1, type: "photo", fit: "contain", blur: true },
    ],
    likes: 58, rating: 4.8,
    suitableFor: ["Круглогодичное проживание", "Для семьи", "Дача"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["Двускатная крыша", "2 спальни", "Под ключ"], style: "Современный", landSize: "5–8 соток",
    hasRealPhotos: true, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 333, name: "Ultra 72", badge: "Модульный дом", price: "5 940 000 ₽",
    area: "72 м²", area_m2: 72, beds: 3, baths: 1, floors: 1, term: "по договору",
    rooms: "3 спальни", purpose: "ИЖС / ПМЖ", city: "Санкт-Петербург и ЛО",
    maker: { ...ULTRADOMSPB, siteUrl: "https://ultradomspb.ru/modeli-s-dvuskatnoj-krovlej/" },
    description: "Одноэтажный модульный дом 72 м² с двускатной крышей для постоянного проживания.",
    descriptionLong: "Ultra 72 от UltraDomSPb — просторный одноэтажный модульный дом с двускатной крышей. Площадь 72 м² позволяет организовать семейный сценарий с несколькими спальнями и общей зоной для жизни за городом.",
    gallery: [
      { image: ultra72_1, type: "photo", fit: "contain", blur: true },
    ],
    likes: 62, rating: 4.9,
    suitableFor: ["Круглогодичное проживание", "Для семьи", "ИЖС"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["Двускатная крыша", "3 спальни", "Под ключ"], style: "Современный", landSize: "6–10 соток",
    hasRealPhotos: true, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 334, name: "Ultra 65", badge: "Модульный дом", price: "по запросу",
    area: "65 м²", area_m2: 65, beds: 3, baths: 1, floors: 1, term: "по договору",
    rooms: "3 комнаты", purpose: "ИЖС / ПМЖ", city: "Санкт-Петербург и ЛО",
    maker: { ...ULTRADOMSPB, siteUrl: "https://ultradomspb.ru/ultra65.html" },
    description: "Модульный дом 65 м² с плоской кровлей, отделкой и несколькими комнатами.",
    descriptionLong: "Ultra 65 — модульный дом площадью 65 м² с современным фасадом, плоской кровлей и готовой отделкой. На странице проекта представлены реальные фото интерьера и планировка, дом подходит для загородного проживания под ключ.",
    gallery: [
      { image: ultra65_1, type: "photo", fit: "contain", blur: true },
      { image: ultra65_2, type: "photo", fit: "contain", blur: true },
      { image: ultra65Plan, type: "plan", fit: "contain" },
    ],
    likes: 67, rating: 4.9,
    suitableFor: ["Круглогодичное проживание", "Для семьи", "ИЖС"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["Плоская кровля", "Реальные фото", "Планировка"], style: "Современный", landSize: "6–10 соток",
    hasRealPhotos: true, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 335, name: "Ultra 85", badge: "Модульный дом", price: "7 280 000 ₽",
    area: "85 м²", area_m2: 85, beds: 3, baths: 1, floors: 1, term: "по договору",
    rooms: "3 комнаты", purpose: "ИЖС / ПМЖ", city: "Санкт-Петербург и ЛО",
    maker: { ...ULTRADOMSPB, siteUrl: "https://ultradomspb.ru/ultra85.html" },
    description: "Модульный дом 85 м² с террасой, вентиляцией и панорамными окнами.",
    descriptionLong: "Ultra 85 от UltraDomSPb — модульный дом 85 м² с террасой, панорамным остеклением и инженерными решениями для круглогодичного проживания. Проект представлен с реальными фотографиями и планировочной схемой.",
    gallery: [
      { image: ultra85_1, type: "photo", fit: "contain", blur: true },
      { image: ultra85_2, type: "photo", fit: "contain", blur: true },
      { image: ultra85Plan, type: "plan", fit: "contain" },
    ],
    likes: 74, rating: 4.9,
    suitableFor: ["Круглогодичное проживание", "Для семьи", "ИЖС"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["Терраса", "Панорамные окна", "Вентиляция"], style: "Современный", landSize: "7–12 соток",
    hasRealPhotos: true, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 336, name: "Дом для расслабления", badge: "Модульный дом", price: "по запросу",
    area: "по запросу", beds: 1, baths: 1, floors: 1, term: "по договору",
    rooms: "1 спальня", purpose: "Отдых / Дача", city: "Москва и МО",
    maker: { ...FREEDOM_NATURI, siteUrl: "https://freedom-modul.ru/catalog/home-for-relaxation" },
    description: "Автономный модульный дом FREEDOM NATURI для отдыха и проживания на природе.",
    descriptionLong: "Дом для расслабления FREEDOM NATURI — автономное модульное решение для отдыха, дачи и проживания вне городской среды. Компания делает дома, которые не требуют капитальной застройки и рассчитаны на быстрый сценарий установки.",
    gallery: [
      { image: freedomRelax_1, type: "photo", fit: "contain", blur: true },
      { image: freedomRelax_2, type: "photo", fit: "contain", blur: true },
    ],
    likes: 59, rating: 4.8,
    suitableFor: ["Дача", "Отдых", "Автономное проживание"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["Автономность", "Быстрая установка", "Отдых на природе"], style: "Современный", landSize: "4–8 соток",
    hasRealPhotos: false, hasShowroom: true, hasInstallment: false,
  },
  {
    id: 337, name: "Дом для уединения", badge: "Модульный дом", price: "по запросу",
    area: "по запросу", beds: 1, baths: 1, floors: 1, term: "по договору",
    rooms: "1 спальня", purpose: "Отдых / Глэмпинг", city: "Москва и МО",
    maker: { ...FREEDOM_NATURI, siteUrl: "https://freedom-modul.ru/catalog/home-for-privacy" },
    description: "Компактный автономный дом FREEDOM NATURI для приватного отдыха и проживания.",
    descriptionLong: "Дом для уединения FREEDOM NATURI — компактный модульный формат для приватного отдыха, глэмпинга или гостевого сценария. Проект ориентирован на быстрое размещение на участке и использование в любое время года.",
    gallery: [
      { image: freedomPrivacy_1, type: "photo", fit: "contain", blur: true },
      { image: freedomPrivacy_2, type: "photo", fit: "contain", blur: true },
    ],
    likes: 55, rating: 4.8,
    suitableFor: ["Глэмпинг", "Дача", "Аренда"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["Автономность", "Компактный формат", "Приватность"], style: "Современный", landSize: "3–7 соток",
    hasRealPhotos: false, hasShowroom: true, hasInstallment: false,
  },
  {
    id: 338, name: "Автономный мобильный дом", badge: "Модульный дом", price: "по запросу",
    area: "по запросу", beds: 1, baths: 1, floors: 1, term: "по договору",
    rooms: "студия", purpose: "Глэмпинг / Аренда", city: "Москва и МО",
    maker: { ...FREEDOM_NATURI, siteUrl: "https://freedom-modul.ru/catalog/autonomous-mobile-homes" },
    description: "Мобильный автономный дом FREEDOM NATURI для глэмпинга, отдыха и работы.",
    descriptionLong: "Автономный мобильный дом FREEDOM NATURI — готовое решение для отдыха, работы или коммерческого размещения на природе. Формат подходит для глэмпинга, аренды и мобильных сценариев без капитальной стройки.",
    gallery: [
      { image: freedomMobile_1, type: "photo", fit: "contain", blur: true },
      { image: freedomMobile_2, type: "photo", fit: "contain", blur: true },
    ],
    likes: 61, rating: 4.9,
    suitableFor: ["Глэмпинг", "Аренда", "Автономное проживание"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["Мобильность", "Автономность", "Коммерческий сценарий"], style: "Современный", landSize: "3–8 соток",
    hasRealPhotos: false, hasShowroom: true, hasInstallment: false,
  },
  {
    id: 339, name: "Модульный дом от 15 м²", badge: "Модульный дом", price: "от 700 000 ₽",
    area: "от 15 м²", area_m2: 15, beds: 1, baths: 1, floors: 1, term: "от 7 дней",
    rooms: "студия", purpose: "Дача / Глэмпинг", city: "Чебоксары",
    maker: { ...CHEBWOOD, siteUrl: "https://chebwood.com/" },
    description: "Готовый модульный дом CHEBWOOD от 15 м² с доставкой и монтажом на участке.",
    descriptionLong: "Модульный дом CHEBWOOD от 15 м² — компактное решение для дачи, отдыха, гостевого размещения или глэмпинга. Компания производит готовые модули в Чебоксарах, доставляет их на участок и выполняет монтаж в короткие сроки.",
    gallery: [
      { image: chebwoodModul15_1, type: "photo", fit: "contain", blur: true },
      { image: chebwoodModul15_2, type: "photo", fit: "contain", blur: true },
    ],
    likes: 49, rating: 4.9,
    suitableFor: ["Дача", "Глэмпинг", "Быстрая установка"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["Производство от 7 дней", "Доставка по России", "Готовый модуль"], style: "Современный", landSize: "3–6 соток",
    hasRealPhotos: true, hasShowroom: true, hasInstallment: false,
  },
  {
    id: 340, name: "Дом под ключ CHEBWOOD", badge: "Модульный дом", price: "4 000 000 ₽",
    area: "по проекту", beds: 2, baths: 1, floors: 1, term: "от 7 дней",
    rooms: "2 спальни", purpose: "ИЖС / Дача", city: "Чебоксары",
    maker: { ...CHEBWOOD, siteUrl: "https://chebwood.com/" },
    description: "Модульный дом под ключ CHEBWOOD для загородного проживания с готовой комплектацией.",
    descriptionLong: "Дом под ключ CHEBWOOD — готовое модульное решение для загородного участка. Формат подходит для дачи, проживания за городом и быстрого запуска объекта без долгой стройки на участке.",
    gallery: [
      { image: chebwoodDom_1, type: "photo", fit: "contain", blur: true },
    ],
    likes: 54, rating: 4.9,
    suitableFor: ["Загородное проживание", "Дача", "Быстрый монтаж"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["Под ключ", "Заводская готовность", "Монтаж на участке"], style: "Современный", landSize: "5–10 соток",
    hasRealPhotos: false, hasShowroom: true, hasInstallment: false,
  },
  {
    id: 341, name: "Гостевой модуль CHEBWOOD", badge: "Модульный дом", price: "от 700 000 ₽",
    area: "от 15 м²", area_m2: 15, beds: 1, baths: 1, floors: 1, term: "от 7 дней",
    rooms: "студия", purpose: "Глэмпинг / Бизнес", city: "Чебоксары",
    maker: { ...CHEBWOOD, siteUrl: "https://chebwood.com/" },
    description: "Компактный гостевой модуль CHEBWOOD для глэмпинга, аренды и размещения на участке.",
    descriptionLong: "Гостевой модуль CHEBWOOD — компактный модульный формат для глэмпинга, гостевого дома, аренды или сезонного бизнеса. Проект рассчитан на быструю установку и использование на небольшом участке.",
    gallery: [
      { image: chebwoodGlamping_1, type: "photo", fit: "contain", blur: true },
    ],
    likes: 47, rating: 4.8,
    suitableFor: ["Глэмпинг", "Аренда", "Гостевой дом"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["Компактный формат", "Для бизнеса", "Быстрый запуск"], style: "Современный", landSize: "3–6 соток",
    hasRealPhotos: true, hasShowroom: true, hasInstallment: false,
  },
  {
    id: 342, name: "Campingdom 15", badge: "Модульный дом", price: "по запросу",
    area: "15 м²", area_m2: 15, beds: 1, baths: 1, floors: 1, term: "по договору",
    rooms: "студия", purpose: "Дача / Глэмпинг", city: "Казань",
    maker: { ...CAMPINGDOM, siteUrl: "https://campingdom.ru/campingdom15" },
    description: "Компактный модульный дом Campingdom 15 для отдыха, дачи и глэмпинга.",
    descriptionLong: "Campingdom 15 — компактный модульный дом площадью 15 м² для размещения на дачном участке, базе отдыха или глэмпинге. Формат подходит для быстрого запуска гостевого сценария с минимальной площадью застройки.",
    gallery: [
      { image: camping15_1, type: "photo", fit: "contain", blur: true },
    ],
    likes: 51, rating: 4.9,
    suitableFor: ["Дача", "Глэмпинг", "Аренда"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["15 м²", "Компактный модуль", "Готовое размещение"], style: "Современный", landSize: "3–5 соток",
    hasRealPhotos: true, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 343, name: "Campingdom 22", badge: "Модульный дом", price: "1 995 000 ₽",
    area: "22 м²", area_m2: 22, beds: 1, baths: 1, floors: 1, term: "по договору",
    rooms: "студия", purpose: "Дача / Отдых", city: "Казань",
    maker: { ...CAMPINGDOM, siteUrl: "https://campingdom.ru/campingdom22" },
    description: "Модульный дом Campingdom 22 площадью 22 м² для дачи и круглогодичного отдыха.",
    descriptionLong: "Campingdom 22 — модульный дом площадью 22 м² с современным внешним видом и компактной планировкой. Подходит для дачи, гостевого сценария, аренды и размещения на природных территориях.",
    gallery: [
      { image: camping22_1, type: "photo", fit: "contain", blur: true },
    ],
    likes: 58, rating: 4.9,
    suitableFor: ["Дача", "Отдых", "Глэмпинг"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["22 м²", "Компактная планировка", "Под ключ"], style: "Современный", landSize: "3–6 соток",
    hasRealPhotos: true, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 344, name: "Campingdom 32", badge: "Модульный дом", price: "2 695 000 ₽",
    area: "32 м²", area_m2: 32, beds: 1, baths: 1, floors: 1, term: "по договору",
    rooms: "1 спальня", purpose: "Дача / ПМЖ", city: "Казань",
    maker: { ...CAMPINGDOM, siteUrl: "https://campingdom.ru/campingdom32" },
    description: "Модульный дом Campingdom 32 с увеличенной площадью для отдыха и проживания.",
    descriptionLong: "Campingdom 32 — модульный дом площадью 32 м² для более комфортного сценария проживания за городом. Проект подходит для дачи, гостевого размещения и небольшого круглогодичного дома.",
    gallery: [
      { image: camping32_1, type: "photo", fit: "contain", blur: true },
    ],
    likes: 64, rating: 4.9,
    suitableFor: ["Дача", "Круглогодичное проживание", "Гостевой дом"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["32 м²", "Увеличенная площадь", "Панорамное остекление"], style: "Современный", landSize: "4–7 соток",
    hasRealPhotos: true, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 345, name: "Campingdom 15 Barn", badge: "Модульный дом", price: "2 695 000 ₽",
    area: "15 м²", area_m2: 15, beds: 1, baths: 1, floors: 1, term: "по договору",
    rooms: "студия", purpose: "Глэмпинг / Отдых", city: "Казань",
    maker: { ...CAMPINGDOM, siteUrl: "https://campingdom.ru/campingdom15barn" },
    description: "Компактный barn-модуль Campingdom 15 для глэмпинга и отдыха на природе.",
    descriptionLong: "Campingdom 15 Barn — небольшой модульный дом в barn-стилистике для глэмпинга, аренды и отдыха. Компактная площадь позволяет быстро разместить объект на участке или базе отдыха.",
    gallery: [
      { image: camping15Barn_1, type: "photo", fit: "contain", blur: true },
    ],
    likes: 57, rating: 4.9,
    suitableFor: ["Глэмпинг", "Аренда", "Отдых"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["Barn-стиль", "Компактный модуль", "Для 4 человек"], style: "Барнхаус", landSize: "3–6 соток",
    hasRealPhotos: true, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 346, name: "Campingdom 28 Barn", badge: "Модульный дом", price: "2 195 000 ₽",
    area: "28 м²", area_m2: 28, beds: 1, baths: 1, floors: 1, term: "по договору",
    rooms: "1 спальня", purpose: "Дача / Глэмпинг", city: "Казань",
    maker: { ...CAMPINGDOM, siteUrl: "https://campingdom.ru/campingdom28barn" },
    description: "Barn-модуль Campingdom 28 площадью 28 м² для отдыха, аренды и загородного размещения.",
    descriptionLong: "Campingdom 28 Barn — модульный дом площадью 28 м² в barn-архитектуре. Проект подходит для дачи, глэмпинга, гостевого дома или коммерческого размещения с готовой архитектурой.",
    gallery: [
      { image: camping28Barn_1, type: "photo", fit: "contain", blur: true },
    ],
    likes: 61, rating: 4.9,
    suitableFor: ["Дача", "Глэмпинг", "Аренда"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["28 м²", "Barn-стиль", "Для отдыха"], style: "Барнхаус", landSize: "4–7 соток",
    hasRealPhotos: true, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 347, name: "Барн 36", badge: "Модульный дом", price: "2 270 000 ₽",
    area: "36 м²", area_m2: 36, beds: 1, baths: 1, floors: 1, term: "по договору",
    rooms: "1 спальня", purpose: "Дача / ПМЖ", city: "Санкт-Петербург и ЛО",
    maker: { ...PSLCOMP, siteUrl: "https://www.pslcomp.ru/katalog-proektov-derevyannyh-domov/modulnye-doma/barn-36" },
    description: "Модульный дом Барн 36 от Промстройлес площадью 36 м² по технологии CLT.",
    descriptionLong: "Барн 36 от Промстройлес — модульный дом площадью 36 м² с габаритами 3,5 × 12 м. Проект выполнен в современной barn-архитектуре и подходит для дачи, гостевого дома или компактного круглогодичного проживания.",
    gallery: [
      { image: pslBarn36_1, type: "photo", fit: "contain", blur: true },
      { image: pslBarn36_2, type: "photo", fit: "contain", blur: true },
      { image: pslBarn36_3, type: "photo", fit: "contain", blur: true },
      { image: pslBarn36_4, type: "photo", fit: "contain", blur: true },
      { image: pslBarn36_5, type: "photo", fit: "contain", blur: true },
      { image: pslBarn36_6, type: "photo", fit: "contain", blur: true },
      { image: pslBarn36Plan1, type: "plan", fit: "contain" },
    ],
    likes: 63, rating: 4.9,
    suitableFor: ["Дача", "Гостевой дом", "Круглогодичное проживание"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["CLT", "3,5 × 12 м", "Barn-стиль"], style: "Барнхаус", landSize: "4–7 соток",
    hasRealPhotos: false, hasShowroom: true, hasInstallment: false,
  },
  {
    id: 348, name: "Хайтек 36", badge: "Модульный дом", price: "2 270 000 ₽",
    area: "36 м²", area_m2: 36, beds: 1, baths: 1, floors: 1, term: "по договору",
    rooms: "1 спальня", purpose: "Дача / ПМЖ", city: "Санкт-Петербург и ЛО",
    maker: { ...PSLCOMP, siteUrl: "https://www.pslcomp.ru/katalog-proektov-derevyannyh-domov/modulnye-doma/haytek-36" },
    description: "Модульный дом Хайтек 36 площадью 36 м² от Промстройлес.",
    descriptionLong: "Хайтек 36 от Промстройлес — компактный модульный дом площадью 36 м² в современной архитектуре. Проект подходит для дачного участка, гостевого размещения и небольшого загородного дома.",
    gallery: [
      { image: pslHaytek36_1, type: "photo", fit: "contain", blur: true },
      { image: pslHaytek36_2, type: "photo", fit: "contain", blur: true },
      { image: pslHaytek36_3, type: "photo", fit: "contain", blur: true },
      { image: pslHaytek36_4, type: "photo", fit: "contain", blur: true },
      { image: pslHaytek36_5, type: "photo", fit: "contain", blur: true },
      { image: pslHaytek36_6, type: "photo", fit: "contain", blur: true },
      { image: pslHaytek36Plan1, type: "plan", fit: "contain" },
    ],
    likes: 59, rating: 4.9,
    suitableFor: ["Дача", "Современный дом", "Гостевой дом"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["CLT", "36 м²", "Современный фасад"], style: "Хайтек", landSize: "4–7 соток",
    hasRealPhotos: false, hasShowroom: true, hasInstallment: false,
  },
  {
    id: 349, name: "Барн 40", badge: "Модульный дом", price: "2 650 000 ₽",
    area: "40 м²", area_m2: 40, beds: 2, baths: 1, floors: 1, term: "по договору",
    rooms: "2 спальни", purpose: "Дача / ПМЖ", city: "Санкт-Петербург и ЛО",
    maker: { ...PSLCOMP, siteUrl: "https://www.pslcomp.ru/katalog-proektov-derevyannyh-domov/modulnye-doma/barn-40" },
    description: "Модульный дом Барн 40 площадью 40 м² с двумя спальнями.",
    descriptionLong: "Барн 40 от Промстройлес — модульный дом площадью 40 м² с двумя спальнями и современной barn-архитектурой. Подходит для семьи, дачи и круглогодичного проживания на небольшом участке.",
    gallery: [
      { image: pslBarn40_1, type: "photo", fit: "contain", blur: true },
      { image: pslBarn40_2, type: "photo", fit: "contain", blur: true },
      { image: pslBarn40_3, type: "photo", fit: "contain", blur: true },
      { image: pslBarn40_4, type: "photo", fit: "contain", blur: true },
      { image: pslBarn40_5, type: "photo", fit: "contain", blur: true },
      { image: pslBarn40_6, type: "photo", fit: "contain", blur: true },
      { image: pslBarn40Plan1, type: "plan", fit: "contain" },
    ],
    likes: 67, rating: 4.9,
    suitableFor: ["Для семьи", "Дача", "ПМЖ"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["CLT", "2 спальни", "Barn-стиль"], style: "Барнхаус", landSize: "5–8 соток",
    hasRealPhotos: false, hasShowroom: true, hasInstallment: false,
  },
  {
    id: 350, name: "Хайтек 40", badge: "Модульный дом", price: "2 650 000 ₽",
    area: "40 м²", area_m2: 40, beds: 2, baths: 1, floors: 1, term: "по договору",
    rooms: "2 спальни", purpose: "Дача / ПМЖ", city: "Санкт-Петербург и ЛО",
    maker: { ...PSLCOMP, siteUrl: "https://www.pslcomp.ru/katalog-proektov-derevyannyh-domov/modulnye-doma/haytek-40" },
    description: "Модульный дом Хайтек 40 площадью 40 м² с современной архитектурой.",
    descriptionLong: "Хайтек 40 от Промстройлес — модульный дом площадью 40 м² для дачи и проживания за городом. В проекте предусмотрена компактная семейная планировка и современный внешний вид.",
    gallery: [
      { image: pslHaytek40_1, type: "photo", fit: "contain", blur: true },
      { image: pslHaytek40_2, type: "photo", fit: "contain", blur: true },
      { image: pslHaytek40_3, type: "photo", fit: "contain", blur: true },
      { image: pslHaytek40_4, type: "photo", fit: "contain", blur: true },
      { image: pslHaytek40_5, type: "photo", fit: "contain", blur: true },
      { image: pslHaytek40_6, type: "photo", fit: "contain", blur: true },
      { image: pslHaytek40Plan1, type: "plan", fit: "contain" },
    ],
    likes: 65, rating: 4.9,
    suitableFor: ["Для семьи", "Дача", "Современный дом"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["CLT", "40 м²", "2 спальни"], style: "Хайтек", landSize: "5–8 соток",
    hasRealPhotos: false, hasShowroom: true, hasInstallment: false,
  },
  {
    id: 351, name: "Барн 45", badge: "Модульный дом", price: "2 920 000 ₽",
    area: "45 м²", area_m2: 45, beds: 1, baths: 1, floors: 1, term: "по договору",
    rooms: "1 спальня", purpose: "Дача / ПМЖ", city: "Санкт-Петербург и ЛО",
    maker: { ...PSLCOMP, siteUrl: "https://www.pslcomp.ru/katalog-proektov-derevyannyh-domov/modulnye-doma/barn-45" },
    description: "Модульный дом Барн 45 площадью 45 м² от Промстройлес.",
    descriptionLong: "Барн 45 от Промстройлес — модульный дом площадью 45 м² в barn-стиле. Проект рассчитан на загородное проживание, дачный сценарий или гостевое размещение с комфортной площадью.",
    gallery: [
      { image: pslBarn45_1, type: "photo", fit: "contain", blur: true },
      { image: pslBarn45_2, type: "photo", fit: "contain", blur: true },
      { image: pslBarn45_3, type: "photo", fit: "contain", blur: true },
      { image: pslBarn45_4, type: "photo", fit: "contain", blur: true },
      { image: pslBarn45_5, type: "photo", fit: "contain", blur: true },
      { image: pslBarn45_6, type: "photo", fit: "contain", blur: true },
      { image: pslBarn45Plan1, type: "plan", fit: "contain" },
      { image: pslBarn45Plan2, type: "plan", fit: "contain" },
    ],
    likes: 69, rating: 4.9,
    suitableFor: ["Дача", "ПМЖ", "Гостевой дом"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["CLT", "45 м²", "Barn-стиль"], style: "Барнхаус", landSize: "5–8 соток",
    hasRealPhotos: false, hasShowroom: true, hasInstallment: false,
  },
  {
    id: 352, name: "Домнас 35", badge: "Модульный дом", price: "2 017 000 ₽",
    area: "35 м²", area_m2: 35, beds: 1, baths: 1, floors: 1, term: "30 д.",
    rooms: "1 спальня", purpose: "Дача / ПМЖ", city: "Казань",
    maker: { ...DOMNASM, siteUrl: "https://domnasm.ru/#projects" },
    description: "Компактный модульный дом Домнас 35 с отделкой, мебелью и инженерными коммуникациями.",
    descriptionLong: "Домнас 35 — небольшой модульный дом заводской готовности для дачи, гостевого сценария или первого загородного дома. Проект рассчитан на быстрый запуск проживания: отделка, мебель и коммуникации входят в концепцию производителя.",
    gallery: [
      { image: domnas35_1, type: "photo", fit: "contain", blur: true },
    ],
    likes: 58, rating: 4.9,
    suitableFor: ["Дача", "Гостевой дом", "Круглогодичное проживание"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["35 м²", "Готовая отделка", "Заводская сборка"], style: "Современный", landSize: "4–7 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 353, name: "Домнас 50", badge: "Модульный дом", price: "2 400 000 ₽",
    area: "50 м²", area_m2: 50, beds: 1, baths: 1, floors: 1, term: "30 д.",
    rooms: "1 спальня", purpose: "Дача / ПМЖ", city: "Казань",
    maker: { ...DOMNASM, siteUrl: "https://domnasm.ru/#projects" },
    description: "Модульный дом Домнас 50 с террасой и современной одноэтажной архитектурой.",
    descriptionLong: "Домнас 50 — одноэтажный модульный дом для загородного участка в Казани и Татарстане. Формат подходит для сезонного и круглогодичного проживания, гостевого размещения или компактного семейного дома.",
    gallery: [
      { image: domnas50_1, type: "photo", fit: "contain", blur: true },
    ],
    likes: 62, rating: 4.9,
    suitableFor: ["Дача", "Пара", "Гостевой дом"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["50 м²", "Терраса", "Панорамное остекление"], style: "Современный", landSize: "5–8 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 354, name: "Домнас 80", badge: "Модульный дом", price: "3 600 000 ₽",
    area: "80 м²", area_m2: 80, beds: 2, baths: 1, floors: 1, term: "30 д.",
    rooms: "2 спальни", purpose: "Семья / ПМЖ", city: "Казань",
    maker: { ...DOMNASM, siteUrl: "https://domnasm.ru/#projects" },
    description: "Семейный модульный дом Домнас 80 с увеличенной площадью и террасой.",
    descriptionLong: "Домнас 80 — модульный дом для семьи, которой нужен более просторный формат загородного проживания. Проект сохраняет заводскую скорость производства и подходит для круглогодичного сценария.",
    gallery: [
      { image: domnas80_1, type: "photo", fit: "contain", blur: true },
    ],
    likes: 66, rating: 4.9,
    suitableFor: ["Для семьи", "ПМЖ", "Дача"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["80 м²", "2 спальни", "Терраса"], style: "Современный", landSize: "6–10 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 355, name: "BARN", badge: "Модульный дом", price: "5 662 000 ₽",
    area: "80 м²", area_m2: 80, beds: 2, baths: 1, floors: 1, term: "30 д.",
    rooms: "2 спальни", purpose: "ПМЖ / Глэмпинг", city: "Казань",
    maker: { ...DOMNASM, siteUrl: "https://domnasm.ru/#projects" },
    description: "Модульный дом BARN от Домнас Модуль в выразительной barn-архитектуре.",
    descriptionLong: "BARN — проект Домнас Модуль с архитектурным акцентом на панорамное остекление и современный силуэт. Подходит для загородного проживания, видового участка или коммерческого размещения.",
    gallery: [
      { image: domnasBarn_1, type: "photo", fit: "contain", blur: true },
    ],
    likes: 71, rating: 4.9,
    suitableFor: ["ПМЖ", "Глэмпинг", "Видовой участок"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["Barn-стиль", "Панорамное остекление", "Терраса"], style: "Барнхаус", landSize: "6–10 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 356, name: "Домнас МГН", badge: "Модульный дом", price: "2 087 860 ₽",
    area: "35 м²", area_m2: 35, beds: 1, baths: 1, floors: 1, term: "30 д.",
    rooms: "студия", purpose: "Дача / Гостевой дом", city: "Казань",
    maker: { ...DOMNASM, siteUrl: "https://domnasm.ru/#projects" },
    description: "Компактный модульный дом Домнас МГН с готовой отделкой и коммуникациями.",
    descriptionLong: "Домнас МГН — компактный модульный проект для быстрого размещения на участке. Формат подходит для дачи, гостевого дома или отдельного жилого модуля с готовыми инженерными решениями.",
    gallery: [
      { image: domnasMgn_1, type: "photo" },
    ],
    likes: 55, rating: 4.9,
    suitableFor: ["Дача", "Гостевой дом", "Быстрый запуск"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["35 м²", "Готовая комплектация", "Компактный модуль"], style: "Современный", landSize: "4–7 соток",
    hasRealPhotos: true, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 357, name: "Одномодульный дом", badge: "Модульный дом", price: "от 2 071 000 ₽",
    area: "55 м²", area_m2: 55, beds: 1, baths: 1, floors: 1, term: "по договору",
    rooms: "1 спальня", purpose: "Дача / ПМЖ", city: "Санкт-Петербург и ЛО",
    maker: { ...BLACKMODULE, siteUrl: "https://blackmodule.ru/#catalog" },
    description: "Одномодульный дом BlackModule с террасой и тёмным современным фасадом.",
    descriptionLong: "Одномодульный дом BlackModule — компактный проект для загородного отдыха и проживания. Площадь с террасой — до 55 м², тёплый контур — около 24 м².",
    gallery: [
      { image: blackmoduleOne_1, type: "photo" },
    ],
    likes: 64, rating: 4.9,
    suitableFor: ["Дача", "Гостевой дом", "Пара"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["Терраса", "Тёмный фасад", "Заводская сборка"], style: "Современный", landSize: "4–7 соток",
    hasRealPhotos: true, hasShowroom: true, hasInstallment: false,
  },
  {
    id: 358, name: "Полуторамодульный дом", badge: "Модульный дом", price: "от 3 150 000 ₽",
    area: "62 м²", area_m2: 62, beds: 1, baths: 1, floors: 1, term: "по договору",
    rooms: "1 спальня", purpose: "Дача / ПМЖ", city: "Санкт-Петербург и ЛО",
    maker: { ...BLACKMODULE, siteUrl: "https://blackmodule.ru/#catalog" },
    description: "Полуторамодульный дом BlackModule с увеличенной площадью и террасой.",
    descriptionLong: "Полуторамодульный дом BlackModule — формат для тех, кому нужен компактный дом, но с более свободной жилой зоной. Площадь с террасой — около 62 м², тёплый контур — около 37 м².",
    gallery: [
      { image: blackmoduleOneHalf_1, type: "photo" },
    ],
    likes: 67, rating: 4.9,
    suitableFor: ["Дача", "ПМЖ", "Гостевой дом"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["62 м²", "Терраса", "Деревянный фасад"], style: "Современный", landSize: "5–8 соток",
    hasRealPhotos: true, hasShowroom: true, hasInstallment: false,
  },
  {
    id: 359, name: "Двухмодульный дом", badge: "Модульный дом", price: "от 4 150 000 ₽",
    area: "96 м²", area_m2: 96, beds: 2, baths: 1, floors: 1, term: "по договору",
    rooms: "2 спальни", purpose: "Семья / ПМЖ", city: "Санкт-Петербург и ЛО",
    maker: { ...BLACKMODULE, siteUrl: "https://blackmodule.ru/#catalog" },
    description: "Двухмодульный дом BlackModule для семьи и круглогодичного проживания.",
    descriptionLong: "Двухмодульный дом BlackModule — семейный проект площадью до 96 м² с просторной планировкой и современным тёмным фасадом. Подходит для дачи и постоянного проживания за городом.",
    gallery: [
      { image: blackmoduleTwo_1, type: "photo" },
    ],
    likes: 73, rating: 4.9,
    suitableFor: ["Для семьи", "ПМЖ", "Дача"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["96 м²", "2 модуля", "Терраса"], style: "Современный", landSize: "6–10 соток",
    hasRealPhotos: true, hasShowroom: true, hasInstallment: false,
  },
  {
    id: 360, name: "Трёхмодульный дом", badge: "Модульный дом", price: "от 6 200 000 ₽",
    area: "120 м²", area_m2: 120, beds: 3, baths: 1, floors: 1, term: "по договору",
    rooms: "3 спальни", purpose: "Семья / ПМЖ", city: "Санкт-Петербург и ЛО",
    maker: { ...BLACKMODULE, siteUrl: "https://blackmodule.ru/#catalog" },
    description: "Трёхмодульный дом BlackModule площадью до 120 м² для семейного проживания.",
    descriptionLong: "Трёхмодульный дом BlackModule — просторный модульный проект с современным фасадом, террасой и площадью до 120 м². Формат рассчитан на постоянное проживание семьи за городом.",
    gallery: [
      { image: blackmoduleThree_1, type: "photo" },
    ],
    likes: 76, rating: 4.9,
    suitableFor: ["Для семьи", "ПМЖ", "Большой участок"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["120 м²", "3 модуля", "Панорамные окна"], style: "Современный", landSize: "8–12 соток",
    hasRealPhotos: true, hasShowroom: true, hasInstallment: false,
  },
  {
    id: 361, name: "Четырёхмодульный дом", badge: "Модульный дом", price: "от 7 620 000 ₽",
    area: "146 м²", area_m2: 146, beds: 3, baths: 2, floors: 1, term: "по договору",
    rooms: "3 спальни", purpose: "Семья / ПМЖ", city: "Санкт-Петербург и ЛО",
    maker: { ...BLACKMODULE, siteUrl: "https://blackmodule.ru/#catalog" },
    description: "Четырёхмодульный дом BlackModule площадью до 146 м² с просторной планировкой.",
    descriptionLong: "Четырёхмодульный дом BlackModule — самый просторный формат линейки для постоянного проживания, семейного сценария и участков, где нужна полноценная загородная резиденция.",
    gallery: [
      { image: blackmoduleFour_1, type: "photo" },
    ],
    likes: 79, rating: 4.9,
    suitableFor: ["Большая семья", "ПМЖ", "Загородная резиденция"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["146 м²", "4 модуля", "Просторная планировка"], style: "Современный", landSize: "10–15 соток",
    hasRealPhotos: true, hasShowroom: true, hasInstallment: false,
  },
  {
    id: 362, name: "MODUL HOUSE 1", badge: "Модульный дом", price: "990 000 ₽",
    area: "27 м²", area_m2: 27, beds: 1, baths: 1, floors: 1, term: "30 д.",
    rooms: "студия", purpose: "Дача / Отдых", city: "Новосибирск",
    maker: { ...DOMM, siteUrl: "https://domm.store/" },
    description: "Модульный дом DOMM площадью 27 м² с террасой для отдыха или проживания.",
    descriptionLong: "MODUL HOUSE 1 от DOMM — компактный модульный дом с террасой для двух человек, дачного отдыха или гостевого размещения. Производитель работает в Новосибирске и выпускает дома заводской готовности.",
    gallery: [
      { image: dommHouse1_1, type: "photo", fit: "contain", blur: true },
    ],
    likes: 61, rating: 4.9,
    suitableFor: ["Дача", "Гостевой дом", "Пара"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["27 м²", "Терраса", "Заводская сборка"], style: "Современный", landSize: "4–7 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 363, name: "MODUL HOUSE 2", badge: "Модульный дом", price: "1 350 000 ₽",
    area: "30 м²", area_m2: 30, beds: 1, baths: 1, floors: 1, term: "30 д.",
    rooms: "1 спальня", purpose: "Дача / ПМЖ", city: "Новосибирск",
    maker: { ...DOMM, siteUrl: "https://domm.store/" },
    description: "Модульный дом DOMM 30 м² с террасой и компактной планировкой.",
    descriptionLong: "MODUL HOUSE 2 — модульный дом площадью 30 м² для отдыха, дачи или компактного круглогодичного проживания. Проект сочетает небольшой размер, террасу и быстрый цикл производства.",
    gallery: [
      { image: dommHouse2_1, type: "photo" },
    ],
    likes: 64, rating: 4.9,
    suitableFor: ["Дача", "ПМЖ", "Гостевой дом"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["30 м²", "Терраса", "Компактная планировка"], style: "Современный", landSize: "4–7 соток",
    hasRealPhotos: true, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 364, name: "MODUL HOUSE 3", badge: "Модульный дом", price: "1 450 000 ₽",
    area: "40 м²", area_m2: 40, beds: 1, baths: 1, floors: 1, term: "30 д.",
    rooms: "1 спальня", purpose: "Дача / ПМЖ", city: "Новосибирск",
    maker: { ...DOMM, siteUrl: "https://domm.store/" },
    description: "Модульный дом DOMM 40 м² для дачи и круглогодичного проживания.",
    descriptionLong: "MODUL HOUSE 3 — проект площадью 40 м² от DOMM. Подходит для загородного участка, гостевого дома или небольшого постоянного проживания с современной модульной архитектурой.",
    gallery: [
      { image: dommHouse3_1, type: "photo" },
    ],
    likes: 66, rating: 4.9,
    suitableFor: ["Дача", "ПМЖ", "Гостевой дом"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["40 м²", "Терраса", "Панорамные окна"], style: "Современный", landSize: "5–8 соток",
    hasRealPhotos: true, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 365, name: "MODUL HOUSE 4", badge: "Модульный дом", price: "1 550 000 ₽",
    area: "56,3 м²", area_m2: 56.3, beds: 2, baths: 1, floors: 1, term: "30 д.",
    rooms: "2 спальни", purpose: "Семья / ПМЖ", city: "Новосибирск",
    maker: { ...DOMM, siteUrl: "https://domm.store/" },
    description: "Модульный дом DOMM 56,3 м² с увеличенной площадью для семьи.",
    descriptionLong: "MODUL HOUSE 4 — модульный дом площадью 56,3 м² для семьи, дачного отдыха или постоянного проживания. Проект рассчитан на более свободный сценарий жизни за городом.",
    gallery: [
      { image: dommHouse4_1, type: "photo" },
    ],
    likes: 69, rating: 4.9,
    suitableFor: ["Для семьи", "ПМЖ", "Дача"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["56,3 м²", "2 спальни", "Терраса"], style: "Современный", landSize: "6–10 соток",
    hasRealPhotos: true, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 366, name: "MODUL HOUSE 6", badge: "Модульный дом", price: "2 350 000 ₽",
    area: "60 м²", area_m2: 60, beds: 2, baths: 1, floors: 1, term: "30 д.",
    rooms: "2 спальни", purpose: "Семья / ПМЖ", city: "Новосибирск",
    maker: { ...DOMM, siteUrl: "https://domm.store/" },
    description: "Модульный дом DOMM 60 м² с террасой для семейного проживания.",
    descriptionLong: "MODUL HOUSE 6 — модульный дом площадью 60 м² для семьи и круглогодичного загородного проживания. Проект подходит для участка, где нужен быстрый запуск дома под ключ.",
    gallery: [
      { image: dommHouse6_1, type: "photo" },
    ],
    likes: 72, rating: 4.9,
    suitableFor: ["Для семьи", "ПМЖ", "Дача"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["60 м²", "Терраса", "Семейный формат"], style: "Современный", landSize: "6–10 соток",
    hasRealPhotos: true, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 367, name: "Барни", badge: "Модульный дом", price: "3 385 000 ₽",
    area: "45 м²", area_m2: 45, beds: 1, baths: 1, floors: 1, term: "по договору",
    rooms: "1 спальня", purpose: "Дача / ПМЖ", city: "Москва и МО",
    maker: { ...MY_MODULE, siteUrl: "https://my-module.ru/module-dom/modulnyj-dom-barni/" },
    description: "Модульный дом «Барни» от Мой Модуль для дачи и загородного проживания.",
    descriptionLong: "Барни — модульный дом от Мой Модуль с современной архитектурой и готовой заводской комплектацией. Производитель работает в Москве и Московской области.",
    gallery: [
      { image: myModuleBarni_1, type: "photo", fit: "contain", blur: true },
    ],
    likes: 65, rating: 4.9,
    suitableFor: ["Дача", "ПМЖ", "Гостевой дом"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["Готовая комплектация", "Терраса", "Заводская сборка"], style: "Современный", landSize: "5–8 соток",
    hasRealPhotos: false, hasShowroom: true, hasInstallment: false,
  },
  {
    id: 368, name: "Корнер", badge: "Модульный дом", price: "2 130 000 ₽",
    area: "35 м²", area_m2: 35, beds: 1, baths: 1, floors: 1, term: "по договору",
    rooms: "1 спальня", purpose: "Дача / ПМЖ", city: "Москва и МО",
    maker: { ...MY_MODULE, siteUrl: "https://my-module.ru/module-dom/modulnyj-dom-scandinavia-corner/" },
    description: "Модульный дом «Корнер» от Мой Модуль в компактном современном формате.",
    descriptionLong: "Корнер — компактный модульный дом от Мой Модуль для дачного участка, гостевого размещения или небольшого круглогодичного проживания в Московской области.",
    gallery: [
      { image: myModuleKorner_1, type: "photo", fit: "contain", blur: true },
    ],
    likes: 62, rating: 4.9,
    suitableFor: ["Дача", "Гостевой дом", "Пара"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["Компактный формат", "Терраса", "Московская область"], style: "Современный", landSize: "4–7 соток",
    hasRealPhotos: false, hasShowroom: true, hasInstallment: false,
  },
  {
    id: 369, name: "Скандинавия", badge: "Модульный дом", price: "1 475 000 ₽",
    area: "30 м²", area_m2: 30, beds: 1, baths: 1, floors: 1, term: "по договору",
    rooms: "студия", purpose: "Дача / Отдых", city: "Москва и МО",
    maker: { ...MY_MODULE, siteUrl: "https://my-module.ru/module-dom/modulnyj-dom-scandinavia/" },
    description: "Модульный дом «Скандинавия» от Мой Модуль для отдыха и дачного проживания.",
    descriptionLong: "Скандинавия — модульный дом от Мой Модуль в лаконичной современной архитектуре. Подходит для дачи, гостевого дома или компактного загородного сценария.",
    gallery: [
      { image: myModuleScandinavia_1, type: "photo", fit: "contain", blur: true },
    ],
    likes: 59, rating: 4.9,
    suitableFor: ["Дача", "Отдых", "Гостевой дом"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["Скандинавский стиль", "Компактный модуль", "Заводская сборка"], style: "Скандинавский", landSize: "4–7 соток",
    hasRealPhotos: false, hasShowroom: true, hasInstallment: false,
  },
  {
    id: 370, name: "Z", badge: "Модульный дом", price: "4 350 000 ₽",
    area: "60 м²", area_m2: 60, beds: 2, baths: 1, floors: 1, term: "по договору",
    rooms: "2 спальни", purpose: "Семья / ПМЖ", city: "Москва и МО",
    maker: { ...MY_MODULE, siteUrl: "https://my-module.ru/module-dom/modulnyj-dom-z/" },
    description: "Модульный дом «Z» от Мой Модуль с выразительной современной архитектурой.",
    descriptionLong: "Z — один из старших модульных проектов Мой Модуль для семейного проживания, дачи или загородного дома в Московской области. Проект выделяется современной архитектурой и готовой заводской комплектацией.",
    gallery: [
      { image: myModuleZ_1, type: "photo", fit: "contain", blur: true },
    ],
    likes: 70, rating: 4.9,
    suitableFor: ["Для семьи", "ПМЖ", "Дача"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["60 м²", "2 спальни", "Современный фасад"], style: "Современный", landSize: "6–10 соток",
    hasRealPhotos: false, hasShowroom: true, hasInstallment: false,
  },
  {
    id: 371, name: "Дом Карелия 30", badge: "Модульный дом", price: "2 550 000 ₽",
    area: "30 м²", area_m2: 30, beds: 1, baths: 1, floors: 1, term: "по договору",
    rooms: "2 комнаты", purpose: "Дача / ПМЖ", city: "Рязань",
    maker: { ...FOUR_MODUL, siteUrl: "https://4modul.ru/karelia30" },
    description: "Компактный модульный дом 6×6 м площадью 30 м² для дачи и загородного проживания.",
    descriptionLong: "Дом Карелия 30 — компактный модульный дом от 4 Стихии размером 6000×6000 мм. Формат подходит для дачного участка, гостевого дома или небольшого круглогодичного сценария.",
    gallery: [
      { image: fourModulKarelia30_1, type: "photo" },
    ],
    likes: 63, rating: 4.9,
    suitableFor: ["Дача", "Гостевой дом", "Пара"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["30 м²", "2 комнаты", "Заводская сборка"], style: "Современный", landSize: "4–7 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 372, name: "Дом Карелия 45", badge: "Модульный дом", price: "3 450 000 ₽",
    area: "45 м²", area_m2: 45, beds: 2, baths: 1, floors: 1, term: "по договору",
    rooms: "3 комнаты", purpose: "Дача / ПМЖ", city: "Рязань",
    maker: { ...FOUR_MODUL, siteUrl: "https://4modul.ru/karelia45" },
    description: "Модульный дом Карелия 45 площадью 45 м² с планировкой на 3 комнаты.",
    descriptionLong: "Дом Карелия 45 — модульный дом от 4 Стихии размером 6000×9000 мм. Проект площадью 45 м² рассчитан на дачное или круглогодичное проживание небольшой семьи.",
    gallery: [
      { image: fourModulKarelia45_1, type: "photo" },
      { image: fourModulKarelia45_2, type: "photo" },
    ],
    likes: 68, rating: 4.9,
    suitableFor: ["Для семьи", "Дача", "ПМЖ"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["45 м²", "3 комнаты", "Панорамные окна"], style: "Современный", landSize: "5–8 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 373, name: "Дом Карелия 60", badge: "Модульный дом", price: "4 750 000 ₽",
    area: "61 м²", area_m2: 61, beds: 2, baths: 1, floors: 1, term: "по договору",
    rooms: "3 комнаты", purpose: "Семья / ПМЖ", city: "Рязань",
    maker: { ...FOUR_MODUL, siteUrl: "https://4modul.ru/karelia60" },
    description: "Семейный модульный дом Карелия 60 площадью 61 м² для круглогодичного проживания.",
    descriptionLong: "Дом Карелия 60 — модульный дом от 4 Стихии размером 6000×12000 мм. Планировка на 3 комнаты подходит для семьи, дачного участка или постоянного загородного проживания.",
    gallery: [
      { image: fourModulKarelia60_1, type: "photo" },
      { image: fourModulKarelia60_2, type: "photo" },
    ],
    likes: 74, rating: 4.9,
    suitableFor: ["Для семьи", "ПМЖ", "Дача"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["61 м²", "3 комнаты", "Заводская сборка"], style: "Современный", landSize: "6–10 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 374, name: "Дом Карелия 75", badge: "Модульный дом", price: "5 900 000 ₽",
    area: "76 м²", area_m2: 76, beds: 3, baths: 1, floors: 1, term: "по договору",
    rooms: "4 комнаты", purpose: "Семья / ПМЖ", city: "Рязань",
    maker: { ...FOUR_MODUL, siteUrl: "https://4modul.ru/karelia75" },
    description: "Просторный модульный дом Карелия 75 площадью 76 м² с планировкой на 4 комнаты.",
    descriptionLong: "Дом Карелия 75 — старший проект линейки Карелия от 4 Стихии. Дом размером 9000×12000 мм и площадью 76 м² рассчитан на семейное круглогодичное проживание.",
    gallery: [
      { image: fourModulKarelia75_1, type: "photo" },
      { image: fourModulKarelia75_2, type: "photo" },
    ],
    likes: 77, rating: 4.9,
    suitableFor: ["Для семьи", "ПМЖ", "Просторный дом"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["76 м²", "4 комнаты", "Семейная планировка"], style: "Современный", landSize: "7–12 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 375, name: "Дом Барн 60", badge: "Барнхаус", price: "4 800 000 ₽",
    area: "59 м²", area_m2: 59, beds: 3, baths: 1, floors: 1, term: "по договору",
    rooms: "4 комнаты", purpose: "Семья / ПМЖ", city: "Рязань",
    maker: { ...FOUR_MODUL, siteUrl: "https://4modul.ru/barn60" },
    description: "Модульный дом в стиле барнхаус площадью 59 м² с выразительным панорамным фасадом.",
    descriptionLong: "Дом Барн 60 — модульный барнхаус от 4 Стихии размером 7000×9600 мм. Проект площадью 59 м² подходит для семьи, отдыха за городом и круглогодичного проживания.",
    gallery: [
      { image: fourModulBarn60_1, type: "photo" },
    ],
    likes: 81, rating: 4.9,
    suitableFor: ["Для семьи", "ПМЖ", "Дача"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["Барнхаус", "59 м²", "Панорамное остекление"], style: "Барнхаус", landSize: "6–10 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 376, name: "HOUSE 48", badge: "Модульный дом", price: "по запросу",
    area: "47 м²", area_m2: 47, beds: 2, baths: 1, floors: 1, term: "от 30 д.",
    rooms: "2 спальни", purpose: "Дача / ПМЖ", city: "Кемеровская область",
    maker: { ...CUBBER, siteUrl: "https://cubber.ru/modul" },
    description: "Модульный дом HOUSE 48 от Cubber Prefab площадью 47 м² с жилой зоной 32 м².",
    descriptionLong: "HOUSE 48 — модульный дом Cubber Prefab для дачи, гостевого размещения или круглогодичного проживания. На странице производителя указаны общая площадь 47 м², жилая площадь 32 м², две спальни и один санузел.",
    gallery: [
      { image: cubberHouse48_1, type: "photo" },
      { image: cubberHouse48Plan, type: "plan", fit: "contain" },
    ],
    likes: 69, rating: 4.9,
    suitableFor: ["Дача", "ПМЖ", "Гостевой дом"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["47 м²", "2 спальни", "Сибирский формат"], style: "Современный", landSize: "5–8 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: true,
  },
  {
    id: 377, name: "HOUSE 50", badge: "Модульный дом", price: "по запросу",
    area: "49 м²", area_m2: 49, beds: 2, baths: 1, floors: 1, term: "от 30 д.",
    rooms: "2 спальни", purpose: "Дача / ПМЖ", city: "Кемеровская область",
    maker: { ...CUBBER, siteUrl: "https://cubber.ru/modul" },
    description: "Проект HOUSE 50 площадью 49 м² с двумя спальнями и жилой площадью 38 м².",
    descriptionLong: "HOUSE 50 — модульный дом Cubber Prefab площадью 49 м². Проект рассчитан на две спальни, один санузел и загородный сценарий для семьи, отдыха или аренды.",
    gallery: [
      { image: cubberHouse50_1, type: "photo" },
      { image: cubberHouse50Plan, type: "plan", fit: "contain" },
    ],
    likes: 71, rating: 4.9,
    suitableFor: ["Для семьи", "Дача", "Аренда"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["49 м²", "2 спальни", "Жилая площадь 38 м²"], style: "Современный", landSize: "5–8 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: true,
  },
  {
    id: 378, name: "HOUSE 60", badge: "Модульный дом", price: "по запросу",
    area: "59 м²", area_m2: 59, beds: 2, baths: 1, floors: 1, term: "от 30 д.",
    rooms: "2 спальни", purpose: "Семья / ПМЖ", city: "Кемеровская область",
    maker: { ...CUBBER, siteUrl: "https://cubber.ru/modul" },
    description: "Модульный дом HOUSE 60 площадью 59 м² для семьи и круглогодичного проживания.",
    descriptionLong: "HOUSE 60 — семейный проект Cubber Prefab с общей площадью 59 м² и жилой площадью 43 м². Дом подходит для постоянного проживания, дачи или размещения на туристическом участке.",
    gallery: [
      { image: cubberHouse60_1, type: "photo" },
      { image: cubberHouse60Plan, type: "plan", fit: "contain" },
    ],
    likes: 76, rating: 4.9,
    suitableFor: ["Для семьи", "ПМЖ", "Дача"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["59 м²", "2 спальни", "Жилая площадь 43 м²"], style: "Современный", landSize: "6–10 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: true,
  },
  {
    id: 379, name: "HOUSE 65", badge: "Модульный дом", price: "по запросу",
    area: "67 м²", area_m2: 67, beds: 3, baths: 1, floors: 1, term: "от 30 д.",
    rooms: "3 спальни", purpose: "Семья / ПМЖ", city: "Кемеровская область",
    maker: { ...CUBBER, siteUrl: "https://cubber.ru/modul" },
    description: "Проект HOUSE 65 площадью 67 м² с тремя спальнями.",
    descriptionLong: "HOUSE 65 — модульный дом Cubber Prefab для семейного проживания. По данным каталога производителя: общая площадь 67 м², три спальни, один санузел и жилая площадь 49 м².",
    gallery: [
      { image: cubberHouse65_1, type: "photo" },
      { image: cubberHouse65Plan, type: "plan", fit: "contain" },
    ],
    likes: 78, rating: 4.9,
    suitableFor: ["Для семьи", "ПМЖ", "Дача"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["67 м²", "3 спальни", "Ипотека"], style: "Современный", landSize: "6–10 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: true,
  },
  {
    id: 380, name: "HOUSE 95T", badge: "Модульный дом", price: "по запросу",
    area: "94 м²", area_m2: 94, beds: 2, baths: 1, floors: 1, term: "от 30 д.",
    rooms: "2 спальни", purpose: "Семья / ПМЖ", city: "Кемеровская область",
    maker: { ...CUBBER, siteUrl: "https://cubber.ru/modul" },
    description: "Просторный модульный дом HOUSE 95T площадью 94 м² с террасным форматом.",
    descriptionLong: "HOUSE 95T — старший проект линейки Cubber Prefab. В каталоге указаны общая площадь 94 м², жилая площадь 61 м², две спальни и один санузел.",
    gallery: [
      { image: cubberHouse95t_1, type: "photo" },
      { image: cubberHouse95tPlan, type: "plan", fit: "contain" },
    ],
    likes: 84, rating: 4.9,
    suitableFor: ["Для семьи", "ПМЖ", "Загородный дом"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["94 м²", "Террасный формат", "Жилая площадь 61 м²"], style: "Современный", landSize: "8–12 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: true,
  },
  {
    id: 381, name: "Simple 6", badge: "Модульный дом", price: "4 500 000 ₽",
    area: "30 м²", area_m2: 30, beds: 1, baths: 1, floors: 1, term: "3–5 д.",
    rooms: "1 спальня", purpose: "Дача / ПМЖ", city: "Санкт-Петербург и ЛО",
    maker: { ...SIMPLEHOUSE, siteUrl: "https://simplehouse1.ru/simple6" },
    description: "Модульный дом Simple 6 площадью 30 м² с террасой 5–15 м².",
    descriptionLong: "Simple 6 — модульный дом Simple House с внешними габаритами 7,2×4,6 м и внутренней площадью 30 м². Проект рассчитан на спальню, санузел, компактную кухню-гостиную и террасу с лестницей.",
    gallery: [
      { image: simple6_1, type: "photo" },
      { image: simple6Plan, type: "plan", fit: "contain" },
    ],
    likes: 82, rating: 4.9,
    suitableFor: ["Дача", "Пара", "Гостевой дом"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["30 м²", "Терраса", "Монтаж 3–5 дней"], style: "Современный", landSize: "4–7 соток",
    hasRealPhotos: true, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 382, name: "Модульный дом XL 54", badge: "Модульный дом", price: "4 280 000 ₽",
    area: "54 м²", area_m2: 54, beds: 2, baths: 1, floors: 1, term: "30–45 д.",
    rooms: "2 спальни", purpose: "Семья / ПМЖ", city: "Красноярск",
    maker: { ...PANORAMIC_HOME, siteUrl: "https://panoramic-home.ru/modular_house_54" },
    description: "Модульный дом XL 54 с кухней-гостиной, двумя спальнями, санузлом и тамбуром.",
    descriptionLong: "Модульный дом XL 54 от Panoramic Home площадью 54 м². Планировка включает кухню-гостиную 22,9 м², две спальни по 7 м², санузел 3,3 м² и тамбур 3,7 м².",
    gallery: [
      { image: panoramicXl54_1, type: "photo", fit: "contain" },
      { image: panoramicXl54_2, type: "photo", fit: "contain" },
    ],
    likes: 79, rating: 4.9,
    suitableFor: ["Для семьи", "ПМЖ", "Дача"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["54 м²", "2 спальни", "Панорамные окна"], style: "Современный", landSize: "5–8 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: true,
  },
  {
    id: 383, name: "Модульный дом MAX 87", badge: "Модульный дом", price: "6 680 000 ₽",
    area: "87 м²", area_m2: 87, beds: 3, baths: 2, floors: 1, term: "30–45 д.",
    rooms: "3 спальни", purpose: "Семья / ПМЖ", city: "Красноярск",
    maker: { ...PANORAMIC_HOME, siteUrl: "https://panoramic-home.ru/modular_house_87" },
    description: "Просторный модульный дом MAX 87 с тремя спальнями и кухней-гостиной 30,9 м².",
    descriptionLong: "Модульный дом MAX 87 от Panoramic Home площадью 87 м². В планировке кухня-гостиная 30,9 м², три спальни, ванная, отдельный санузел, прихожая и коридор.",
    gallery: [
      { image: panoramicMax87_1, type: "photo", fit: "contain" },
      { image: panoramicMax87_2, type: "photo", fit: "contain" },
    ],
    likes: 88, rating: 4.9,
    suitableFor: ["Для семьи", "ПМЖ", "Просторный дом"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["87 м²", "3 спальни", "2 санузла"], style: "Современный", landSize: "8–12 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: true,
  },
  {
    id: 384, name: "Модульный дом XL 60", badge: "Модульный дом", price: "4 760 000 ₽",
    area: "60 м²", area_m2: 60, beds: 3, baths: 1, floors: 1, term: "30–45 д.",
    rooms: "3 спальни", purpose: "Семья / ПМЖ", city: "Красноярск",
    maker: { ...PANORAMIC_HOME, siteUrl: "https://panoramic-home.ru/modular_house_60" },
    description: "Модульный дом XL 60 с гостиной, кухней, тремя спальнями и санузлом.",
    descriptionLong: "Модульный дом XL 60 от Panoramic Home площадью 60 м². Планировка включает гостиную 20,1 м², кухню 6,1 м², три спальни по 5,8 м², санузел и прихожую.",
    gallery: [
      { image: panoramicXl60_1, type: "photo", fit: "contain" },
      { image: panoramicXl60_2, type: "photo", fit: "contain" },
    ],
    likes: 83, rating: 4.9,
    suitableFor: ["Для семьи", "ПМЖ", "Дача"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["60 м²", "3 спальни", "Тёплый пол"], style: "Современный", landSize: "6–10 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: true,
  },
  {
    id: 385, name: "Модульный дом XL 72", badge: "Модульный дом", price: "5 740 000 ₽",
    area: "72 м²", area_m2: 72, beds: 2, baths: 1, floors: 1, term: "30–45 д.",
    rooms: "2 спальни", purpose: "Семья / ПМЖ", city: "Красноярск",
    maker: { ...PANORAMIC_HOME, siteUrl: "https://panoramic-home.ru/modular_house_72" },
    description: "Модульный дом XL 72 с большой кухней-гостиной, спальней, детской и санузлом.",
    descriptionLong: "Модульный дом XL 72 от Panoramic Home площадью 72 м². В доме кухня-гостиная 31 м², спальня 10 м², детская 7 м², санузел 5 м² и прихожая 8 м².",
    gallery: [
      { image: panoramicXl72_1, type: "photo", fit: "contain" },
      { image: panoramicXl72_2, type: "photo", fit: "contain" },
    ],
    likes: 86, rating: 4.9,
    suitableFor: ["Для семьи", "ПМЖ", "Дача"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["72 м²", "Кухня-гостиная 31 м²", "Панорамное остекление"], style: "Современный", landSize: "7–12 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: true,
  },
  {
    id: 386, name: "Модульный дом XL 45", badge: "Модульный дом", price: "3 590 000 ₽",
    area: "45 м²", area_m2: 45, beds: 2, baths: 1, floors: 1, term: "30–45 д.",
    rooms: "2 спальни", purpose: "Дача / ПМЖ", city: "Красноярск",
    maker: { ...PANORAMIC_HOME, siteUrl: "https://panoramic-home.ru/modular_house_45" },
    description: "Модульный дом XL 45 с кухней-гостиной, двумя спальнями и санузлом.",
    descriptionLong: "Модульный дом XL 45 от Panoramic Home площадью 45 м². Планировка включает кухню-гостиную 19,5 м², две спальни по 5,8 м², санузел и тамбур.",
    gallery: [
      { image: panoramicXl45_1, type: "photo", fit: "contain" },
      { image: panoramicXl45_2, type: "photo", fit: "contain" },
    ],
    likes: 77, rating: 4.9,
    suitableFor: ["Дача", "Для семьи", "ПМЖ"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["45 м²", "2 спальни", "Готовая отделка"], style: "Современный", landSize: "5–8 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: true,
  },
  {
    id: 387, name: "Мини Барн 40", badge: "Барнхаус", price: "1 350 000 ₽",
    area: "40 м²", area_m2: 40, beds: 1, baths: 1, floors: 1, term: "30 д.",
    rooms: "3 комнаты", purpose: "Дача / ПМЖ", city: "Краснодарский край",
    maker: { ...AMBARN, siteUrl: "https://ambarn.ru/product/barn-40-lyuks/" },
    description: "Мини Барн 40 от АмбарН: 30 м² жилой площади и терраса 10 м².",
    descriptionLong: "Мини Барн 40 — модульный дом от АмбарН площадью застройки 40 м². Проект состоит из двух жилых модулей и модуля террасы, рассчитан на 2 спальных места и 3 комнаты.",
    gallery: [
      { image: ambarnBarn40_1, type: "photo" },
      { image: ambarnBarn40_2, type: "photo" },
      { image: ambarnBarn40_3, type: "photo" },
      { image: ambarnBarn40_4, type: "photo" },
      { image: ambarnBarn40_5, type: "photo" },
      { image: ambarnBarn40_6, type: "photo" },
      { image: ambarnBarn40Plan1, type: "plan", fit: "contain" },
    ],
    likes: 74, rating: 4.9,
    suitableFor: ["Дача", "Гостевой дом", "Пара"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["40 м²", "Терраса 10 м²", "Барнхаус"], style: "Барнхаус", landSize: "4–7 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 388, name: "Индиго 30", badge: "Модульный дом", price: "1 350 000 ₽",
    area: "30 м²", area_m2: 30, beds: 1, baths: 1, floors: 1, term: "30 д.",
    rooms: "3 комнаты", purpose: "Дача / ПМЖ", city: "Краснодарский край",
    maker: { ...AMBARN, siteUrl: "https://ambarn.ru/product/modulnyj-dom-indigo-30/" },
    description: "Модульный дом Индиго 30 с террасой 12 м² и планировкой на 3 комнаты.",
    descriptionLong: "Индиго 30 — модульный дом АмбарН площадью 30 м². Дом состоит из двух модулей, имеет террасу 12 м², один санузел и рассчитан на 4 спальных места.",
    gallery: [
      { image: ambarnIndigo30_1, type: "photo" },
      { image: ambarnIndigo30_2, type: "photo" },
      { image: ambarnIndigo30_3, type: "photo" },
      { image: ambarnIndigo30_4, type: "photo" },
      { image: ambarnIndigo30_5, type: "photo" },
      { image: ambarnIndigo30_6, type: "photo" },
      { image: ambarnIndigo30Plan1, type: "plan", fit: "contain" },
    ],
    likes: 73, rating: 4.9,
    suitableFor: ["Дача", "Гостевой дом", "Семья"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["30 м²", "Терраса 12 м²", "30 дней"], style: "Современный", landSize: "4–7 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 389, name: "Индиго 40 модуль", badge: "Модульный дом", price: "2 000 000 ₽",
    area: "40 м²", area_m2: 40, beds: 2, baths: 1, floors: 1, term: "30 д.",
    rooms: "3 комнаты", purpose: "Дача / ПМЖ", city: "Краснодарский край",
    maker: { ...AMBARN, siteUrl: "https://ambarn.ru/product/modulnyj-dom-indigo-40-modul/" },
    description: "Модульный дом Индиго 40 площадью 40 м² с террасой 12 м².",
    descriptionLong: "Индиго 40 модуль — проект АмбарН из четырёх модулей площадью 40 м² жилой площади. Общая площадь застройки 58,5 м², терраса 12 м², 4 спальных места и 3 комнаты.",
    gallery: [
      { image: ambarnIndigo40_1, type: "photo" },
      { image: ambarnIndigo40_2, type: "photo" },
      { image: ambarnIndigo40_3, type: "photo" },
      { image: ambarnIndigo40_4, type: "photo" },
      { image: ambarnIndigo40_5, type: "photo" },
      { image: ambarnIndigo40_6, type: "photo" },
      { image: ambarnIndigo40Plan1, type: "plan", fit: "contain" },
    ],
    likes: 78, rating: 4.9,
    suitableFor: ["Для семьи", "Дача", "ПМЖ"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["40 м²", "Терраса 12 м²", "4 модуля"], style: "Современный", landSize: "5–8 соток",
    hasRealPhotos: true, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 390, name: "Индиго 50 модуль", badge: "Модульный дом", price: "2 000 000 ₽",
    area: "73 м²", area_m2: 73, beds: 3, baths: 1, floors: 1, term: "30 д.",
    rooms: "4 комнаты", purpose: "Семья / ПМЖ", city: "Краснодарский край",
    maker: { ...AMBARN, siteUrl: "https://ambarn.ru/product/modulnyj-dom-indigo-50-modul/" },
    description: "Семейный модульный дом Индиго 50 площадью застройки 73 м².",
    descriptionLong: "Индиго 50 модуль — проект АмбарН из пяти модулей с 50 м² жилой площади и общей площадью застройки 73,14 м². В доме 4 комнаты, 6 спальных мест и терраса 13 м².",
    gallery: [
      { image: ambarnIndigo50_1, type: "photo" },
      { image: ambarnIndigo50_2, type: "photo" },
      { image: ambarnIndigo50_3, type: "photo" },
      { image: ambarnIndigo50_4, type: "photo" },
      { image: ambarnIndigo50_5, type: "photo" },
      { image: ambarnIndigo50_6, type: "photo" },
      { image: ambarnIndigo50Plan1, type: "plan", fit: "contain" },
    ],
    likes: 82, rating: 4.9,
    suitableFor: ["Для семьи", "ПМЖ", "Дача"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["73 м²", "4 комнаты", "Терраса 13 м²"], style: "Современный", landSize: "6–10 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 391, name: "Индиго 36", badge: "Модульный дом", price: "1 620 000 ₽",
    area: "48 м²", area_m2: 48, beds: 2, baths: 1, floors: 1, term: "3 мес.",
    rooms: "3 комнаты", purpose: "Дача / ПМЖ", city: "Краснодарский край",
    maker: { ...AMBARN, siteUrl: "https://ambarn.ru/product/modulnyj-dom-indigo-36/" },
    description: "Модульный дом Индиго 36 площадью застройки 48 м² с террасой.",
    descriptionLong: "Индиго 36 — модульный дом АмбарН из двух модулей 6×3 м. Общая площадь застройки 48 м², жилая площадь 36 м², терраса 18 м², 4 спальных места и 3 комнаты.",
    gallery: [
      { image: ambarnIndigo36_1, type: "photo" },
      { image: ambarnIndigo36_2, type: "photo" },
      { image: ambarnIndigo36_3, type: "photo" },
      { image: ambarnIndigo36_4, type: "photo" },
      { image: ambarnIndigo36_5, type: "photo" },
      { image: ambarnIndigo36_6, type: "photo" },
      { image: ambarnIndigo36Plan1, type: "plan", fit: "contain" },
    ],
    likes: 75, rating: 4.9,
    suitableFor: ["Дача", "Для семьи", "ПМЖ"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["48 м²", "Терраса 18 м²", "2 модуля"], style: "Современный", landSize: "5–8 соток",
    hasRealPhotos: false, hasShowroom: false, hasInstallment: false,
  },
  {
    id: 392, name: "1,5-а модульный дом 3 м", badge: "Модульный дом", price: "1 250 000 ₽",
    area: "30 м²", area_m2: 30, beds: 1, baths: 1, floors: 1, term: "до 21 д.",
    rooms: "1 спальня", purpose: "Дача / ПМЖ", city: "Ростовская область",
    maker: { ...MYFAMILYHOUSE, siteUrl: "http://myfamilyhouse.ru/tproduct/756750991712-proekt-15-a-modulnii-dom-spalnya-3-metra" },
    description: "Проект FAMILY HOUSE 30 м² в стиле MODERN для 2–4 человек.",
    descriptionLong: "1,5-а модульный дом FAMILY HOUSE с размером 6×5 м, площадью застройки 30 м², одной спальней, одним санузлом и террасой 2–6 м².",
    gallery: [
      { image: familyHouseProject1_1, type: "photo" },
      { image: familyHouseProject1_2, type: "photo" },
    ],
    likes: 70, rating: 4.9,
    suitableFor: ["Дача", "Пара", "Гостевой дом"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["30 м²", "1 спальня", "MODERN"], style: "Современный", landSize: "4–7 соток",
    hasRealPhotos: false, hasShowroom: true, hasInstallment: false,
  },
  {
    id: 393, name: "1,5-а модульный дом 3,5 м", badge: "Модульный дом", price: "1 220 000 ₽",
    area: "30 м²", area_m2: 30, beds: 1, baths: 1, floors: 1, term: "до 21 д.",
    rooms: "1 спальня", purpose: "Дача / ПМЖ", city: "Ростовская область",
    maker: { ...MYFAMILYHOUSE, siteUrl: "http://myfamilyhouse.ru/tproduct/431133215552-proekt-15-a-modulnii-dom-spalnya-35-metr" },
    description: "Компактный проект FAMILY HOUSE 30 м² с увеличенной спальней 3,5 м.",
    descriptionLong: "1,5-а модульный дом FAMILY HOUSE размером 6×5 м в стиле MODERN. Проект рассчитан на 2–4 человек, включает одну спальню, один санузел и террасу 2–6 м².",
    gallery: [
      { image: familyHouseProject2_1, type: "photo" },
      { image: familyHouseProject2_2, type: "photo" },
    ],
    likes: 68, rating: 4.9,
    suitableFor: ["Дача", "Пара", "Гостевой дом"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["30 м²", "1 спальня", "Терраса"], style: "Современный", landSize: "4–7 соток",
    hasRealPhotos: false, hasShowroom: true, hasInstallment: false,
  },
  {
    id: 394, name: "1,5-а модульный дом с прихожей", badge: "Модульный дом", price: "1 360 000 ₽",
    area: "30 м²", area_m2: 30, beds: 1, baths: 1, floors: 1, term: "до 21 д.",
    rooms: "1 спальня", purpose: "Дача / ПМЖ", city: "Ростовская область",
    maker: { ...MYFAMILYHOUSE, siteUrl: "http://myfamilyhouse.ru/tproduct/157307435312-proekt-15-a-modulnii-dom-s-prihozhei-i-s" },
    description: "Проект FAMILY HOUSE 30 м² с прихожей, спальней и террасой до 12 м².",
    descriptionLong: "1,5-а модульный дом FAMILY HOUSE размером 6×5 м. В проекте предусмотрены спальня, санузел, прихожая и терраса 6–12 м².",
    gallery: [
      { image: familyHouseProject3_1, type: "photo" },
      { image: familyHouseProject3_2, type: "photo" },
    ],
    likes: 71, rating: 4.9,
    suitableFor: ["Дача", "Пара", "ПМЖ"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["30 м²", "Прихожая", "Терраса 6–12 м²"], style: "Современный", landSize: "4–7 соток",
    hasRealPhotos: false, hasShowroom: true, hasInstallment: false,
  },
  {
    id: 395, name: "1,5-а модульный дом 7 м", badge: "Модульный дом", price: "1 405 000 ₽",
    area: "35 м²", area_m2: 35, beds: 1, baths: 1, floors: 1, term: "до 21 д.",
    rooms: "1 спальня", purpose: "Дача / ПМЖ", city: "Ростовская область",
    maker: { ...MYFAMILYHOUSE, siteUrl: "http://myfamilyhouse.ru/tproduct/548761215592-proekt-15-a-modulnii-dom-7-metrov-i-spal" },
    description: "Модульный дом FAMILY HOUSE 35 м² размером 7×5 м с террасой.",
    descriptionLong: "1,5-а модульный дом FAMILY HOUSE размером 7×5 м. Площадь застройки 35 м², одна спальня, один санузел и терраса 6–12 м².",
    gallery: [
      { image: familyHouseProject4_1, type: "photo" },
      { image: familyHouseProject4_2, type: "photo" },
    ],
    likes: 73, rating: 4.9,
    suitableFor: ["Дача", "Пара", "ПМЖ"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["35 м²", "7×5 м", "Терраса"], style: "Современный", landSize: "4–7 соток",
    hasRealPhotos: false, hasShowroom: true, hasInstallment: false,
  },
  {
    id: 396, name: "Барн-Хаус Стандарт", badge: "Барнхаус", price: "1 660 000 ₽",
    area: "40 м²", area_m2: 40, beds: 1, baths: 1, floors: 1, term: "до 30 д.",
    rooms: "1 спальня", purpose: "Дача / ПМЖ", city: "Ростовская область",
    maker: { ...MYFAMILYHOUSE, siteUrl: "http://myfamilyhouse.ru/tproduct/656940914592-proekt-2-h-modulnii-dom-barn-haus-standa" },
    description: "Двухмодульный дом FAMILY HOUSE в стиле барнхаус площадью 40 м².",
    descriptionLong: "Барн-Хаус Стандарт — проект FAMILY HOUSE размером 8×5 м. Дом рассчитан на 2–4 человек, включает одну спальню, один санузел и террасу 6–12 м².",
    gallery: [
      { image: familyHouseProject5_1, type: "photo" },
      { image: familyHouseProject5_2, type: "photo" },
    ],
    likes: 76, rating: 4.9,
    suitableFor: ["Дача", "ПМЖ", "Гостевой дом"],
    technology: "Модульный дом", completion: "Под ключ", insulation: "круглогодичный",
    features: ["40 м²", "Барнхаус", "2 модуля"], style: "Барнхаус", landSize: "5–8 соток",
    hasRealPhotos: false, hasShowroom: true, hasInstallment: false,
  },
  ...regionalBatchProjects,
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
  logo?: string;
  city: string;
  siteUrl?: string;
  technology: string;
  productionAddress?: string;
  phone?: string;
  email?: string;
  telegram?: string;
};
const canonicalMakerSiteUrls: Record<string, string> = [
  PLATFORMA, BYGGE, GLEZMAN, DIVODOM, GRADODOM, ZAGORODOM, APA, PRIME_MODUL, UTKINO, TEPLODINA, KARKAS_HAUS, URAL_HOUSE, HOCHU_DOM, BEREST_DOM, RIFT, IZBRUSA, SCANDI_ECODOM, KARKAS_POVOLZHYA, KAZANSTROY16, ASKHOME, DOMOTEKA, KARKAS_DOM_YUG, SIBIRYAK, SVOI_HOUSE, BAGROVSTROY, DOMAKARKAS, SK_GARMONIYA, DOMA_OT_MIHALYCHA, BARNSTUDIO, BELI_DOM, MASTERGRUPP_BARNAUL, PRAKTIKA_STROY, ECO_CITY, MODOM, HOUSEBOX, GLAVLES, FPS_MODUL, VEK_TRAD, BUDUSHIY_DOM, QUBDOM, DUROV_HOUSE, HISTHUT, COUNTRYHOUSE, CUBADOM, IDOLHOUSE, WOODALP, BOXMATE, UVHOUSE, ASTERIUS, SMOLA, ULTRADOMSPB, FREEDOM_NATURI, CHEBWOOD, CAMPINGDOM, PSLCOMP, DOMNASM, BLACKMODULE, DOMM, MY_MODULE, FOUR_MODUL,
  ...regionalMakers,
].reduce((acc, m) => {
  if (m.id && m.siteUrl) acc[m.id] = m.siteUrl;
  return acc;
}, {} as Record<string, string>);

export const makersById: Record<string, MakerSummary> = projects.reduce((acc, p) => {
  const id = p.maker.id;
  if (!id || acc[id]) return acc;
  acc[id] = {
    id,
    name: p.maker.name,
    initials: p.maker.initials,
    logo: p.maker.logo,
    city: p.city,
    siteUrl: canonicalMakerSiteUrls[id] ?? p.maker.siteUrl,
    technology: p.technology,
    productionAddress: p.maker.productionAddress,
    phone: p.maker.phone,
    email: p.maker.email,
    telegram: p.maker.telegram,
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

export const cities = ["Москва и МО", "Санкт-Петербург и ЛО", "Краснодарский край", "Казань", "Екатеринбург", "Пермский край", "Нижний Новгород", "Алтайский край", "Красноярск", "Самара", "Воронеж", "Уфа", "Чебоксары", "Новосибирск", "Рязань", "Кемеровская область", "Ростовская область"];
