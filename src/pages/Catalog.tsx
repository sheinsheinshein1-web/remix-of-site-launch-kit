import { useState, useEffect, useRef } from "react";
import { formatSpecs } from "@/lib/utils";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, ChevronDown, ChevronRight, X, ArrowUpDown, Ruler, Star, Camera, Columns2, Redo2, Truck } from "lucide-react";
import SearchDropdown, { parseSearchFilters } from "@/components/SearchDropdown";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import ProjectCard from "@/components/ProjectCard";
import { navigateWithTransition } from "@/lib/viewTransition";
import Seo from "@/components/Seo";
import SiteBreadcrumbs, { siteBreadcrumbPageContainerClassName } from "@/components/SiteBreadcrumbs";
import { buildSiteUrl } from "@/lib/seo";
import { CATALOG_PATH, getProjectPath } from "@/lib/siteRoutes";
import { compareWithProjectPriority } from "@/lib/projectPriority";
import { getCityDisplayName } from "@/lib/cityDisplay";
import { regions } from "@/data/regions";
import {
  getCatalogCategoryBySlug,
  matchesCatalogCategory,
} from "@/data/catalogCategories";
import { resolveCatalogSeoState } from "@/lib/catalogSeo";
import { buildCatalogSeo } from "@/lib/pageSeo";
import { getProjectTechnologyLabel, matchesProjectTechnology, PROJECT_TECHNOLOGY } from "@/lib/projectTechnology";
import {
  getGeoSelectionCityValue,
  getGeoSelectionLabel,
  getGeoSelectionPrepositional,
  isProjectAvailableInGeo,
  normalizeGeoSelection,
} from "@/lib/geoSelection";

import { catalogItems, projects, type ProjectUseCase } from "@/data/projects";
import CitySelector, { useCity } from "@/components/CitySelector";
import { BUSINESS_USE_CASE_OPTIONS, matchesProjectBusinessUseCases } from "@/lib/projectUseCases";
import {
  getProjectAreaAmount,
  getProjectPriceAmount,
  getProjectTermDays,
  matchesProjectObjectType,
} from "@/lib/projectDomain";
import { matchesProjectFilters } from "@/lib/projectFilters";
import { withCatalogObjectType, withoutLegacyCatalogRegion } from "@/lib/catalogQuery";
import { useHistoryBatch } from "@/hooks/useHistoryBatch";
import { useIsMobile } from "@/hooks/use-mobile";
import { getProjectDetailViewModel } from "@/lib/projectViewModel";

function pluralizeProjects(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return "проект";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "проекта";
  return "проектов";
}

const bundles = [
  { name: "До 1 млн ₽", count: "38 проектов" },
  { name: "Малый участок", count: "24 проекта" },
  { name: "Быстрый монтаж", count: "31 проект" },
  { name: "Для ИЖС", count: "56 проектов" },
  { name: "Хиты сезона", count: "12 проектов" },
];


const sidebarFilters = [
  {
    title: "ТИП ОБЪЕКТА",
    options: [
      { label: "Жилой дом", count: 84, checked: true },
      { label: "Баня", count: 46, checked: true },
      { label: "Глэмпинг", count: 31, checked: false },
      { label: "Гостевой корпус", count: 28, checked: false },
      { label: "Коммерция", count: 25, checked: false },
    ],
  },
  {
    title: "НАЗНАЧЕНИЕ",
    options: [
      { label: "ИЖС", checked: true },
      { label: "СНТ", checked: true },
      { label: "ЛПХ", checked: false },
      { label: "Коммерческое", checked: false },
    ],
  },
  {
    title: "СРОК МОНТАЖА",
    options: [
      { label: "до 2 недель", checked: false },
      { label: "2–4 недели", checked: true },
      { label: "4–8 недель", checked: false },
    ],
  },
  {
    title: "КОМПЛЕКТАЦИЯ",
    options: [
      { label: "Под ключ", checked: true },
      { label: "Без отделки", checked: false },
      { label: "Только корпус", checked: false },
    ],
  },
];

const sourceAwareCatalogItems = catalogItems.map((item) => {
  const viewModel = getProjectDetailViewModel(item.id);
  if (!viewModel) return item;

  return {
    ...item,
    price: viewModel.price.raw,
    area: viewModel.area.raw,
    beds: viewModel.rooms.beds,
    baths: viewModel.rooms.baths,
    floors: viewModel.rooms.floors,
    term: viewModel.production.term,
    technology: viewModel.specifications.technology,
    completion: viewModel.specifications.completion,
    insulation: viewModel.specifications.insulation,
    style: viewModel.specifications.style ?? "",
  };
});
const catalogMakers = Array.from(new Set(sourceAwareCatalogItems.map((item) => item.maker))).sort((a, b) => a.localeCompare(b, "ru"));
const projectsById = new Map(projects.map((project) => [project.id, project]));
const PUBLIC_TECHNOLOGY_OPTIONS = [
  PROJECT_TECHNOLOGY.modular,
  PROJECT_TECHNOLOGY.frameModular,
  PROJECT_TECHNOLOGY.prefab,
  PROJECT_TECHNOLOGY.houseKit,
] as const;
const COMPLETION_OPTIONS = ["Без отделки", "Только корпус", "Теплый контур", "Под ключ"] as const;
const INITIAL_CATALOG_PROJECT_COUNT = 24;
const CATALOG_PROJECT_BATCH_SIZE = 24;

const ListIcon = ({ active }: { active: boolean }) => (
  <svg width="16" height="14" viewBox="0 0 16 14" fill="none">
    <rect x="0" y="0" width="16" height="4" rx="1.5" fill={active ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"} />
    <rect x="0" y="5" width="16" height="4" rx="1.5" fill={active ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"} />
    <rect x="0" y="10" width="16" height="4" rx="1.5" fill={active ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"} />
  </svg>
);

const GridIcon = ({ active }: { active: boolean }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect x="0" y="0" width="6" height="6" rx="1.5" fill={active ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"} />
    <rect x="8" y="0" width="6" height="6" rx="1.5" fill={active ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"} />
    <rect x="0" y="8" width="6" height="6" rx="1.5" fill={active ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"} />
    <rect x="8" y="8" width="6" height="6" rx="1.5" fill={active ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"} />
  </svg>
);

type CatalogProps = {
  embedded?: boolean;
  lockedRegion?: string;
  lockedRegionLabel?: string;
  lockedRegionPrepositional?: string;
  lockedTechnology?: string;
  categorySlug?: string;
};

const Catalog = ({ embedded = false, lockedRegion, lockedRegionLabel, lockedRegionPrepositional, lockedTechnology, categorySlug }: CatalogProps = {}) => {
  const isMobile = useIsMobile();
  const [searchParams, setSearchParams] = useSearchParams();
  const [catalogSearch, setCatalogSearch] = useState(searchParams.get("q") || "");
  const catalogLoadMoreRef = useRef<HTMLDivElement>(null);
  const routeCategory = getCatalogCategoryBySlug(categorySlug);
  const { activeCategory, shouldNoIndex, canonicalPath } = resolveCatalogSeoState(searchParams, routeCategory);
  const typeFilter = searchParams.get("type") ?? "";
  const techFilter = lockedTechnology ?? searchParams.get("tech") ?? "";
  const effectiveObjectType = typeFilter || routeCategory?.filter.objectType || "";
  const selectedObjectType = effectiveObjectType === "bath" ? "bath" : effectiveObjectType === "house" ? "house" : "all";
  const catalogTitle = routeCategory?.h1 ?? activeCategory?.title ?? "Проекты модульных домов";
  const catalogSeo = routeCategory
    ? { title: `${routeCategory.metaTitle} | многоместа.рф`, description: routeCategory.metaDescription }
    : buildCatalogSeo({
      categoryTitle: activeCategory?.title,
      categoryCaption: activeCategory?.caption,
    });
  const catalogDescription = routeCategory?.caption ?? catalogSeo.description;
  const breadcrumbItems = [
    { label: "Главная", to: "/" },
    ...(activeCategory
      ? [{ label: "Проекты", to: CATALOG_PATH }, { label: activeCategory.title }]
      : [{ label: "Проекты" }]),
  ];
  const breadcrumbJsonLdItems = [
    { "@type": "ListItem", position: 1, name: "Главная", item: buildSiteUrl("/") },
    { "@type": "ListItem", position: 2, name: "Проекты", item: buildSiteUrl(CATALOG_PATH) },
    ...(activeCategory
      ? [{ "@type": "ListItem", position: 3, name: activeCategory.title, item: buildSiteUrl(activeCategory.path) }]
      : []),
  ];

  const resetAllFilters = ({ preserveBusinessUseCases = false }: { preserveBusinessUseCases?: boolean } = {}) => {
    setFilterPriceMinVal(500000);
    setFilterPriceMaxVal(15000000);
    setFilterAreaMin("");
    setFilterAreaMax("");
    setFilterSuitableFor(new Set());
    if (!preserveBusinessUseCases) setFilterBusinessUseCases(new Set());
    setFilterMoveIn(new Set());
    setFilterBedrooms(new Set());
    setFilterBathrooms(new Set());
    setFilterFloors(new Set());
    setFilterTechnology(new Set());
    setFilterCompletion(new Set());
    setFilterInsulation(new Set());
    setFilterFeatures(new Set());
    setFilterStyle(new Set());
    setFilterLandType(new Set());
    setFilterExtras(new Set());
    setFilterMaker("");
  };

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [citySelectorOpen, setCitySelectorOpen] = useState(false);
  const [sortBy, setSortBy] = useState("rating");
  const desktopFiltersRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const clearCatalogFilters = () => {
    resetAllFilters();
    setCatalogSearch("");
    setSearchParams({}, { replace: true });
  };

  const setObjectTypeFilter = (value: "all" | "house" | "bath") => {
    if (routeCategory) {
      if (value === "bath") navigate("/modulnye-bani/");
      else navigate(CATALOG_PATH);
      return;
    }
    setSearchParams(withCatalogObjectType(searchParams, value));
  };

  const sortOptions = [
    { value: "rating", label: "С высоким рейтингом" },
    { value: "popular", label: "Популярные" },
    { value: "new", label: "Новинки" },
    { value: "cheap", label: "Дешевле" },
    { value: "expensive", label: "Дороже" },
    { value: "area_asc", label: "По площади м², от меньшего" },
    { value: "area_desc", label: "По площади м², от большего" },
    { value: "fast", label: "Быстрый монтаж" },
  ];

  useEffect(() => {
    const filters = desktopFiltersRef.current;
    if (!filters) return;

    const handOffWheelAtBoundary = (event: WheelEvent) => {
      const atTop = filters.scrollTop <= 0;
      const atBottom =
        Math.ceil(filters.scrollTop + filters.clientHeight) >= filters.scrollHeight - 1;
      const leavingFilters =
        (event.deltaY < 0 && atTop) || (event.deltaY > 0 && atBottom);

      if (!leavingFilters) return;

      event.preventDefault();
      window.scrollBy({ top: event.deltaY, left: 0, behavior: "auto" });
    };

    filters.addEventListener("wheel", handOffWheelAtBoundary, { passive: false });
    return () => filters.removeEventListener("wheel", handOffWheelAtBoundary);
  }, []);

  // 1. Подходит для
  const [filterSuitableFor, setFilterSuitableFor] = useState<Set<string>>(new Set());
  const [filterBusinessUseCases, setFilterBusinessUseCases] = useState<Set<ProjectUseCase>>(new Set());
  // 2. Цена
  const [filterPriceMinVal, setFilterPriceMinVal] = useState(500000);
  const [filterPriceMaxVal, setFilterPriceMaxVal] = useState(15000000);
  const PRICE_MIN = 0;
  const PRICE_MAX = 15000000;
  // 3. Базовые параметры
  const [filterAreaMin, setFilterAreaMin] = useState("");
  const [filterAreaMax, setFilterAreaMax] = useState("");
  const [filterMoveIn, setFilterMoveIn] = useState<Set<string>>(new Set());
  // 4. Планировка
  const [filterBedrooms, setFilterBedrooms] = useState<Set<string>>(new Set());
  const [filterBathrooms, setFilterBathrooms] = useState<Set<string>>(new Set());
  const [filterFloors, setFilterFloors] = useState<Set<string>>(new Set());
  // 5. Технология и комплектация — независимые измерения фильтра.
  const [filterTechnology, setFilterTechnology] = useState<Set<string>>(new Set());
  const [filterCompletion, setFilterCompletion] = useState<Set<string>>(new Set());
  // 6. Утепление
  const [filterInsulation, setFilterInsulation] = useState<Set<string>>(new Set());
  // 7. Особенности
  const [filterFeatures, setFilterFeatures] = useState<Set<string>>(new Set());
  // 8. Стиль
  const [filterStyle, setFilterStyle] = useState<Set<string>>(new Set());
  // 9. Участок
  const [filterLandType, setFilterLandType] = useState<Set<string>>(new Set());
  // 10. Производитель
  const [filterMaker, setFilterMaker] = useState("");
  // 11. Дополнительно
  const [filterExtras, setFilterExtras] = useState<Set<string>>(new Set());

  // Apply URL search params as initial filters and keep local state synced with URL
  useEffect(() => {
    const q = searchParams.get("q") || "";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const minArea = searchParams.get("minArea");
    const maxArea = searchParams.get("maxArea");
    const beds = searchParams.get("beds");
    const baths = searchParams.get("baths");
    const parsedQuery = parseSearchFilters(q);

    // Переключение URL-фильтров (например, «Дома / Бани») не должно сбрасывать
    // выбранный сценарий «Для бизнеса»: эти признаки должны сочетаться.
    resetAllFilters({ preserveBusinessUseCases: true });
    setCatalogSearch(q);
    setFilterPriceMinVal(minPrice ? parseInt(minPrice) : parsedQuery.minPrice ?? 500000);
    setFilterPriceMaxVal(maxPrice ? parseInt(maxPrice) : parsedQuery.maxPrice ?? 15000000);
    setFilterAreaMin(minArea || (parsedQuery.minArea !== undefined ? String(parsedQuery.minArea) : ""));
    setFilterAreaMax(maxArea || (parsedQuery.maxArea !== undefined ? String(parsedQuery.maxArea) : ""));

    const bedroomValue = beds ?? (parsedQuery.beds !== undefined ? (parsedQuery.beds >= 3 ? "3+" : String(parsedQuery.beds)) : "");
    const bathroomValue = baths ?? (parsedQuery.baths !== undefined ? (parsedQuery.baths >= 2 ? "2+" : String(parsedQuery.baths)) : "");
    setFilterBedrooms(bedroomValue ? new Set([bedroomValue]) : new Set());
    setFilterBathrooms(bathroomValue ? new Set([bathroomValue]) : new Set());
  }, [searchParams]);

  const toggleInSet = (setter: React.Dispatch<React.SetStateAction<Set<string>>>, val: string) => {
    setter(prev => {
      const next = new Set(prev);
      if (next.has(val)) next.delete(val);
      else next.add(val);
      return next;
    });
  };

  const toggleBusinessUseCase = (value: ProjectUseCase) => {
    setFilterBusinessUseCases((current) => {
      const next = new Set(current);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  };

  const applySuitablePreset = (preset: string) => {
    const isActive = filterSuitableFor.has(preset);
    if (isActive) {
      setFilterSuitableFor(prev => { const n = new Set(prev); n.delete(preset); return n; });
      setFilterAreaMin("");
      setFilterAreaMax("");
      setFilterBedrooms(new Set());
      setFilterBathrooms(new Set());
      setFilterFloors(new Set());
      setFilterTechnology(new Set());
      setFilterCompletion(new Set());
      setFilterInsulation(new Set());
      setFilterExtras(new Set());
      setFilterPriceMinVal(500000);
      setFilterPriceMaxVal(15000000);
      return;
    }
    setFilterSuitableFor(new Set([preset]));
    setFilterAreaMin("");
    setFilterAreaMax("");
    setFilterBedrooms(new Set());
    setFilterBathrooms(new Set());
    setFilterFloors(new Set());
    setFilterTechnology(new Set());
    setFilterCompletion(new Set());
    setFilterInsulation(new Set());
    setFilterExtras(new Set());
    setFilterPriceMinVal(500000);
    setFilterPriceMaxVal(15000000);

    switch (preset) {
      case "Для одного / пары":
        setFilterAreaMax("45");
        setFilterBedrooms(new Set(["1"]));
        break;
      case "Для семьи":
        setFilterAreaMin("50");
        setFilterBedrooms(new Set(["2", "3+"]));
        setFilterBathrooms(new Set(["2+"]));
        setFilterFloors(new Set(["1", "2"]));
        break;
      case "Постоянное проживание":
        setFilterBedrooms(new Set(["2", "3+"]));
        setFilterInsulation(new Set(["до −30°C", "до −40°C"]));
        setFilterCompletion(new Set(["Под ключ"]));
        break;
      case "Выходные / дача":
        setFilterPriceMaxVal(2000000);
        setFilterAreaMax("60");
        break;
      case "Сдача в аренду":
        setFilterCompletion(new Set(["Под ключ"]));
        setFilterExtras(new Set(["Рассрочка"]));
        break;
      case "Гостевой дом":
        setFilterAreaMax("35");
        setFilterBedrooms(new Set(["1"]));
        break;
    }
  };

  const hasActiveFilters = filterPriceMinVal !== 500000 || filterPriceMaxVal !== 15000000 || filterAreaMin !== "" || filterAreaMax !== "" || filterBedrooms.size > 0 || filterBathrooms.size > 0 || filterSuitableFor.size > 0 || filterBusinessUseCases.size > 0 || filterMoveIn.size > 0 || filterFloors.size > 0 || filterTechnology.size > 0 || filterCompletion.size > 0 || filterInsulation.size > 0 || filterFeatures.size > 0 || filterStyle.size > 0 || filterLandType.size > 0 || filterExtras.size > 0 || filterMaker !== "" || typeFilter !== "" || techFilter !== "";
  const hasExplicitPriceFilter = searchParams.has("minPrice")
    || searchParams.has("maxPrice")
    || filterPriceMinVal !== 500000
    || filterPriceMaxVal !== 15000000;

  const compareOptionalNumbers = (left: number | null, right: number | null, direction: "asc" | "desc") => {
    if (left === null && right === null) return 0;
    if (left === null) return 1;
    if (right === null) return -1;
    return direction === "asc" ? left - right : right - left;
  };
  const stemSearchTerm = (term: string) => {
    if (term.length <= 3) return term; // Don't stem short words like "дом", "баня" etc.
    return term.replace(/(иями|ями|ами|ого|ему|ому|ыми|ими|иях|ях|ах|ов|ев|ей|ой|ий|ый|ая|ое|ее|ые|ие|ья|ью|ия|ям|ам|ом|ем|ию|ю|у|а|я|ы|и|е|о)$/u, "");
  };

  const parsedCatalogSearch = parseSearchFilters(catalogSearch);
  let normalizedCatalogQuery = ` ${parsedCatalogSearch.textQuery.toLowerCase().replace(/ё/g, "е")} `;

  normalizedCatalogQuery = normalizedCatalogQuery
    .replace(/(^|\s)1\s*этаж[а-я]*(?=\s|$)/gu, " одноэтажный ")
    .replace(/(^|\s)2\s*этаж[а-я]*(?=\s|$)/gu, " двухэтажный ");

  // Always strip price/unit tokens so they don't block text matching
  normalizedCatalogQuery = normalizedCatalogQuery
    .replace(/(^|\s)(?:до|от)\s*[\d.,]+\s*(?:млн|милл[а-я]*|миллион[а-я]*|тыс[а-я]*|руб[а-я]*|₽)(?=\s|$)/gu, " ")
    .replace(/(^|\s)[\d.,]+\s*(?:млн|милл[а-я]*|миллион[а-я]*|тыс[а-я]*|руб[а-я]*|₽)(?=\s|$)/gu, " ")
    .replace(/(^|\s)(?:млн|милл[а-я]*|миллион[а-я]*|тыс[а-я]*|руб[а-я]*|₽)(?=\s|$)/gu, " ");

  // Always strip bedroom/bathroom/area tokens
  normalizedCatalogQuery = normalizedCatalogQuery.replace(
    /(^|\s)(?:\d+|одно|одна|одним|две|два|двух|три|трех|трёх|четыре|четырех|четырёх|пять|пяти)\s*[- ]?(?:спальн[а-я]*|комнат[а-я]*|сп[а-я]*)(?=\s|$)/gu, " "
  );
  normalizedCatalogQuery = normalizedCatalogQuery.replace(/(^|\s)\d+\s*(?:санузл[а-я]*|ванн[а-я]*)(?=\s|$)/gu, " ");
  normalizedCatalogQuery = normalizedCatalogQuery.replace(/(^|\s)(?:до|от)\s*[\d.,]+\s*(?:м2|м²|кв|квадрат[а-я]*|метр[а-я]*)(?=\s|$)/gu, " ");

  const catalogSearchTerms = normalizedCatalogQuery
    .replace(/(^|\s)(для|и|в|на|по|с|к|у|под|над|при|от|до|дом|дома|домов|дому|доме|проект|проекты|проектов|найти|найди|покажи|нужен|нужны)(?=\s|$)/gu, " ")
    .split(/[^а-яёa-z0-9]+/iu)
    .map((term) => stemSearchTerm(term))
    .filter((term) => term.length > 1);

  const { city: selectedCity, selectCity, hasExplicitSelection } = useCity();
  const selectedCityValue = getGeoSelectionCityValue(selectedCity);
  const requestedRegion = lockedRegion ? null : searchParams.get("region");
  const requestedRegionSlug = requestedRegion ? normalizeGeoSelection(requestedRegion) : undefined;
  const effectiveCity = lockedRegion
    ?? (requestedRegionSlug ? getGeoSelectionCityValue(requestedRegionSlug) : selectedCityValue);
  const effectiveCityLabel = lockedRegionLabel
    ?? (lockedRegion
      ? getCityDisplayName(effectiveCity)
      : requestedRegionSlug
        ? getGeoSelectionLabel(requestedRegionSlug)
        : getGeoSelectionLabel(selectedCity));
  const selectedRegionPrepositional = lockedRegionPrepositional
    ?? (lockedRegion
      ? regions.find((region) => (region.cityValues ?? [region.cityValue]).includes(effectiveCity))?.namePrepositional
      : getGeoSelectionPrepositional(requestedRegionSlug ?? selectedCity))
    ?? `в ${getCityDisplayName(effectiveCity)}`;
  const openCitySelectorFromMobileFilters = () => {
    setFiltersOpen(false);
    window.setTimeout(() => setCitySelectorOpen(true), 180);
  };
  const handleSelectCity = (city: string) => {
    selectCity(city);
    if (!searchParams.has("region")) return;
    setSearchParams(withoutLegacyCatalogRegion(searchParams), { replace: true });
  };
  const matchesObjectType = (item: (typeof sourceAwareCatalogItems)[number]) =>
    matchesProjectObjectType(item, selectedObjectType);
  const availableCatalogMakers = catalogMakers.filter((maker) =>
    sourceAwareCatalogItems.some((item) => (
      item.maker === maker
      && matchesObjectType(item)
      && isProjectAvailableInGeo(item.city, effectiveCity, item.deliveryRegionSlugs)
    )),
  );
  const filteredItems = sourceAwareCatalogItems.filter(item => {
    if (!matchesCatalogCategory(item, routeCategory ?? activeCategory)) return false;
    // Без запроса сохраняем регион из шапки. Текстовый поиск работает по всему
    // каталогу, иначе производителя или модель из другого региона невозможно найти.
    if (
      (lockedRegion || catalogSearchTerms.length === 0)
      && !isProjectAvailableInGeo(item.city, effectiveCity, item.deliveryRegionSlugs)
    ) return false;
    if (filterMaker && item.maker !== filterMaker) return false;
    if (!matchesProjectBusinessUseCases(item.useCases, filterBusinessUseCases)) return false;
    // Сохраняем совместимость со старыми URL, но сравниваем технологии через
    // единый справочник пользовательских названий.
    if (techFilter && !matchesProjectTechnology(item.technology, techFilter)) return false;
    if (!matchesProjectFilters(item, {
      objectType: selectedObjectType,
      price: hasExplicitPriceFilter
        ? {
            min: filterPriceMinVal,
            max: filterPriceMaxVal,
            excludeUnknown: true,
          }
        : undefined,
      area: {
        min: filterAreaMin ? Number.parseFloat(filterAreaMin) : undefined,
        max: filterAreaMax ? Number.parseFloat(filterAreaMax) : undefined,
      },
      bedrooms: filterBedrooms,
      bathrooms: filterBathrooms,
      floors: filterFloors,
      moveIn: filterMoveIn,
      technologies: filterTechnology,
      completions: filterCompletion,
    })) return false;
    if (catalogSearchTerms.length > 0) {
      const floorsLabel = item.floors === 1 ? "одноэтажный 1 этаж" : item.floors === 2 ? "двухэтажный 2 этажа" : `${item.floors} этаж`;
      const bedsLabel = item.beds === 0 ? "студия без спальни" : `${item.beds} спальня ${item.beds} спальни ${item.beds} спален`;
      const haystack = [
        item.name,
        item.badge,
        item.maker,
        item.city,
        item.purpose,
        item.technology,
        item.completion,
        item.insulation,
        item.style,
        item.rooms,
        floorsLabel,
        bedsLabel,
        item.suitableFor.join(" "),
        item.features.join(" "),
      ]
        .join(" ")
        .toLowerCase()
        .replace(/ё/g, "е");

      if (!catalogSearchTerms.every((term) => haystack.includes(term))) return false;
    }
    // Подходит для
    if (filterSuitableFor.size > 0) {
      if (!Array.from(filterSuitableFor).some(f => item.suitableFor.includes(f))) return false;
    }
    // Утепление
    if (filterInsulation.size > 0 && !filterInsulation.has(item.insulation)) return false;
    // Особенности
    if (filterFeatures.size > 0) {
      if (!Array.from(filterFeatures).some(f => item.features.includes(f))) return false;
    }
    // Стиль
    if (filterStyle.size > 0 && !filterStyle.has(item.style)) return false;
    // Размер участка
    if (filterLandType.size > 0 && !filterLandType.has(item.landSize)) return false;
    // Дополнительно
    if (filterExtras.size > 0) {
      const match = Array.from(filterExtras).every(f => {
        if (f === "Фото реальных домов") return item.hasRealPhotos;
        if (f === "Рейтинг 4.5+") return item.rating >= 4.5;
        if (f === "Есть шоурум и выставочные дома") return item.hasShowroom;
        if (f === "Рассрочка") return item.hasInstallment;
        return true;
      });
      if (!match) return false;
    }
    return true;
  });

  const sortedItems = [...filteredItems].sort((a, b) =>
    compareWithProjectPriority(a, b, (a, b) => {
      switch (sortBy) {
        case "cheap": return compareOptionalNumbers(getProjectPriceAmount(a.price), getProjectPriceAmount(b.price), "asc");
        case "expensive": return compareOptionalNumbers(getProjectPriceAmount(a.price), getProjectPriceAmount(b.price), "desc");
        case "area_asc": return compareOptionalNumbers(getProjectAreaAmount({ area: a.area }), getProjectAreaAmount({ area: b.area }), "asc");
        case "area_desc": return compareOptionalNumbers(getProjectAreaAmount({ area: a.area }), getProjectAreaAmount({ area: b.area }), "desc");
        case "fast": return compareOptionalNumbers(getProjectTermDays(a.term), getProjectTermDays(b.term), "asc");
        case "popular": return b.likes - a.likes;
        case "new": return b.id - a.id;
        default: return b.rating - a.rating;
      }
    })
  );
  const { visibleCount: visibleLimit, loadNextBatch: loadNextCatalogBatch } = useHistoryBatch({
    namespace: "catalog",
    identity: `${categorySlug ?? "all"}:${lockedRegion ?? "all"}:${lockedTechnology ?? "all"}:${searchParams.toString()}:${sortBy}`,
    itemCount: sortedItems.length,
    initialCount: INITIAL_CATALOG_PROJECT_COUNT,
    batchSize: CATALOG_PROJECT_BATCH_SIZE,
  });
  const visibleItems = sortedItems.slice(0, visibleLimit);
  const hasMoreItems = visibleItems.length < sortedItems.length;

  useEffect(() => {
    const target = catalogLoadMoreRef.current;
    if (!target || !hasMoreItems || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.unobserve(entry.target);
          loadNextCatalogBatch();
        }
      },
      { rootMargin: "800px 0px" },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [hasMoreItems, loadNextCatalogBatch, visibleLimit]);

  const itemListElements = visibleItems.flatMap((item, index) => {
    const project = projectsById.get(item.id);
    if (!project) return [];
    return [{
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: buildSiteUrl(getProjectPath(project)),
    }];
  });

  return (
    <div className={`${embedded ? "" : "min-h-screen"} w-full min-w-0 max-w-full overflow-x-clip bg-background font-sans`}>
      {!embedded && <Seo
        title={catalogSeo.title}
        description={catalogSeo.description}
        canonicalPath={canonicalPath}
        noIndex={shouldNoIndex}
        noFollow={false}
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: breadcrumbJsonLdItems,
          },
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: catalogTitle,
            numberOfItems: itemListElements.length,
            itemListElement: itemListElements,
          },
        ]}
      />}
      {!embedded && <Header variant="home" />}

      {!embedded && <div className={`${siteBreadcrumbPageContainerClassName} pb-5 md:pb-7`}>
        <SiteBreadcrumbs items={breadcrumbItems} />
        <div className="max-w-[760px]">
          <h1 className="text-[30px] font-semibold leading-[1.08] tracking-[-0.025em] text-foreground md:text-[46px]">
            {catalogTitle}
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground md:mt-4 md:text-[17px]">
            {catalogDescription}
          </p>
        </div>
      </div>}

      {/* Mobile search, view and sorting */}
      <div
        className={`sticky top-[50px] z-40 bg-background/95 backdrop-blur-xl md:hidden ${
          embedded ? "-mx-4 sm:-mx-8" : ""
        }`}
        aria-label="Управление каталогом"
      >
        <div className={`${embedded ? "px-4 sm:px-8" : "mx-auto w-full max-w-[1400px] px-4 sm:px-8"} py-2.5`}>
          <div className="flex min-w-0 items-center gap-2">
            <SearchDropdown
              className="min-w-0 flex-1"
              inputClassName="!rounded-[var(--radius)] border border-border bg-background font-normal"
              initialQuery={catalogSearch}
              onQueryChange={setCatalogSearch}
              showFilterButton
              onFilterClick={() => setFiltersOpen(true)}
              hasActiveFilters={hasActiveFilters}
            />
            <div className="flex h-12 shrink-0 items-center rounded-[var(--radius)] border border-border bg-background p-0.5">
              <button
                onClick={() => setViewMode("list")}
                className={`flex h-11 w-11 items-center justify-center rounded-[var(--radius)] ${viewMode === "list" ? "bg-secondary" : ""}`}
                aria-label="Показать списком"
              >
                <ListIcon active={viewMode === "list"} />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`flex h-11 w-11 items-center justify-center rounded-[var(--radius)] ${viewMode === "grid" ? "bg-secondary" : ""}`}
                aria-label="Показать сеткой"
              >
                <GridIcon active={viewMode === "grid"} />
              </button>
            </div>
            <label className="relative flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-[var(--radius)] border border-border bg-background" aria-label="Сортировать проекты">
              <ArrowUpDown className="h-5 w-5 text-muted-foreground" strokeWidth={2.5} />
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                aria-label="Сортировать проекты"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>

      {/* Desktop catalog content. Only the active responsive grid is mounted. */}
      {!isMobile && <div className={`${embedded ? "" : "px-4 sm:px-8 lg:px-10 xl:px-12 w-full pb-16"} hidden md:block`}>
        <div className="mb-8 pb-7">
          <SearchDropdown
            className="w-full"
            inputClassName="!rounded-[var(--radius)] border border-border bg-background font-normal"
            initialQuery={catalogSearch}
            onQueryChange={setCatalogSearch}
          />
        </div>

        <div className="grid grid-cols-[260px_minmax(0,1fr)] gap-8">
          <aside className="border-r border-border pr-6">
          <div
            ref={desktopFiltersRef}
            className="sticky top-[80px] max-h-[calc(100vh-100px)] overflow-y-auto pr-2"
          >
            <div className="mb-5">
              <div className="mb-3 flex min-h-6 items-center justify-between gap-2">
                <div className="text-[13px] font-semibold text-foreground">Регион доставки</div>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearCatalogFilters}
                    className="shrink-0 text-[14px] font-medium text-primary transition-colors hover:text-primary/80"
                  >
                    Сбросить
                  </button>
                )}
              </div>
              {lockedRegion ? (
                <div className="flex min-h-11 w-full items-center rounded-[var(--radius)] border border-border bg-background px-3 text-[13px] text-foreground">
                  {effectiveCityLabel}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setCitySelectorOpen(true)}
                  className="flex min-h-11 w-full items-center justify-between rounded-[var(--radius)] border border-border bg-background px-3 text-left text-[13px] text-foreground transition-colors hover:border-primary/50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                >
                  <span>{effectiveCityLabel}</span>
                  <ChevronRight className="h-4 w-4 shrink-0" strokeWidth={1.7} aria-hidden />
                </button>
              )}
            </div>

            <div className="mb-5">
              <div className="mb-3 text-[13px] font-semibold text-foreground">Тип объекта</div>
              <div className="flex flex-wrap gap-1.5">
                {([
                  ["all", "Все"],
                  ["house", "Дома"],
                  ["bath", "Бани"],
                ] as const).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setObjectTypeFilter(value)}
                    aria-pressed={selectedObjectType === value}
                    className={`min-h-9 rounded-[var(--radius)] px-3 text-[12px] transition-colors ${
                      selectedObjectType === value ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/80"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <div className="mb-3 text-[13px] font-semibold text-foreground">Для бизнеса</div>
              <div className="flex flex-wrap gap-1.5">
                {BUSINESS_USE_CASE_OPTIONS.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => toggleBusinessUseCase(value)}
                    aria-pressed={filterBusinessUseCases.has(value)}
                    className={`rounded-[var(--radius)] px-3 py-[6px] text-[12px] transition-colors ${
                      filterBusinessUseCases.has(value) ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/80"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Подходит для */}
            <div className="mb-5">
              <div className="mb-3 text-[13px] font-semibold text-foreground">Подходит для</div>
              <div className="flex flex-wrap gap-1.5">
                {["Постоянное проживание", "Выходные / дача", "Сдача в аренду", "Гостевой дом", "Для семьи", "Для одного / пары"].map(c => (
                  <button key={c} onClick={() => applySuitablePreset(c)}
                    className={`rounded-[var(--radius)] px-3 py-[6px] text-[12px] transition-colors ${
                      filterSuitableFor.has(c) ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/80"
                    }`}>{c}</button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <label htmlFor="catalog-maker-desktop" className="mb-3 block text-[13px] font-semibold text-foreground">Производитель</label>
              <div className="relative">
                <select
                  id="catalog-maker-desktop"
                  value={filterMaker}
                  onChange={(event) => setFilterMaker(event.target.value)}
                  className="h-11 w-full cursor-pointer appearance-none rounded-[var(--radius)] border border-border bg-background pl-3 pr-12 text-[13px] text-foreground outline-none transition-colors focus:border-primary"
                >
                  <option value="">Все производители</option>
                  {availableCatalogMakers.map((maker) => <option key={maker} value={maker}>{maker.split(" · ")[0]}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-5 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground" strokeWidth={1.7} aria-hidden />
              </div>
            </div>

            {/* Цена */}
            <div className="mb-5">
              <div className="mb-3 text-[13px] font-semibold text-foreground">Цена, ₽</div>
              <div className="flex items-end gap-[2px] h-8 mb-2">
                {[85,100,75,60,50,40,35,28,20,15,10,5].map((h, i) => {
                  const barMin = (i / 12) * PRICE_MAX;
                  const barMax = ((i + 1) / 12) * PRICE_MAX;
                  const active = barMin < filterPriceMaxVal && barMax > filterPriceMinVal;
                  return <div key={i} className={`flex-1 rounded-t-sm ${active ? "bg-primary" : "bg-border"}`} style={{ height: `${h}%` }} />;
                })}
              </div>
              <div className="relative h-6 mb-2 touch-none">
                <div className="absolute top-[11px] left-0 right-0 h-1 bg-border rounded-full" />
                <div className="absolute top-[11px] h-1 bg-primary rounded-full" style={{ left: `${(filterPriceMinVal / PRICE_MAX) * 100}%`, right: `${100 - (filterPriceMaxVal / PRICE_MAX) * 100}%` }} />
                <input type="range" min={PRICE_MIN} max={PRICE_MAX} step={50000} value={filterPriceMinVal}
                  onChange={e => { const v = Math.min(Number(e.target.value), filterPriceMaxVal - 50000); setFilterPriceMinVal(v); }}
                  className="touch-none absolute top-0 left-0 w-full h-6 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-background [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer" />
                <input type="range" min={PRICE_MIN} max={PRICE_MAX} step={50000} value={filterPriceMaxVal}
                  onChange={e => { const v = Math.max(Number(e.target.value), filterPriceMinVal + 50000); setFilterPriceMaxVal(v); }}
                  className="touch-none absolute top-0 left-0 w-full h-6 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-background [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input value={filterPriceMinVal.toLocaleString("ru-RU")} onChange={e => setFilterPriceMinVal(parseInt(e.target.value.replace(/\D/g, "")) || 0)} className="text-[12px] bg-secondary rounded-[var(--radius)] px-2.5 py-2 text-foreground outline-none" />
                <input value={filterPriceMaxVal.toLocaleString("ru-RU")} onChange={e => setFilterPriceMaxVal(parseInt(e.target.value.replace(/\D/g, "")) || 0)} className="text-[12px] bg-secondary rounded-[var(--radius)] px-2.5 py-2 text-foreground outline-none" />
              </div>
            </div>

            {/* Площадь */}
            <div className="mb-5">
              <div className="mb-3 text-[13px] font-semibold text-foreground">Площадь, м²</div>
              <div className="grid grid-cols-2 gap-2">
                <input value={filterAreaMin} onChange={e => setFilterAreaMin(e.target.value)} placeholder="от" className="text-[12px] bg-secondary rounded-[var(--radius)] px-2.5 py-2 text-foreground placeholder:text-muted-foreground outline-none" />
                <input value={filterAreaMax} onChange={e => setFilterAreaMax(e.target.value)} placeholder="до" className="text-[12px] bg-secondary rounded-[var(--radius)] px-2.5 py-2 text-foreground placeholder:text-muted-foreground outline-none" />
              </div>
            </div>

            {/* Срок до заселения */}
            <div className="mb-5">
              <div className="mb-3 text-[13px] font-semibold text-foreground">Срок до заселения</div>
              <div className="flex flex-wrap gap-1.5">
                {["до 2 недель", "2–4 недели", "1–2 месяца"].map(c => (
                  <button key={c} onClick={() => toggleInSet(setFilterMoveIn, c)}
                    className={`text-[12px] rounded-[var(--radius)] px-3 py-[6px] transition-colors ${
                      filterMoveIn.has(c) ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/80"
                    }`}>{c}</button>
                ))}
              </div>
            </div>

            {/* Спальни */}
            <div className="mb-5">
              <div className="mb-3 text-[13px] font-semibold text-foreground">Спальни</div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {["Студия", "1", "2", "3+"].map(c => (
                  <button key={c} onClick={() => toggleInSet(setFilterBedrooms, c)}
                    className={`text-[12px] rounded-[var(--radius)] px-3 py-[6px] transition-colors ${
                      filterBedrooms.has(c) ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/80"
                    }`}>{c}</button>
                ))}
              </div>
              <div className="mb-3 text-[13px] font-semibold text-foreground">Санузлы</div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {["1", "2+"].map(c => (
                  <button key={c} onClick={() => toggleInSet(setFilterBathrooms, c)}
                    className={`text-[12px] rounded-[var(--radius)] px-3 py-[6px] transition-colors ${
                      filterBathrooms.has(c) ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/80"
                    }`}>{c}</button>
                ))}
              </div>
              <div className="mb-3 text-[13px] font-semibold text-foreground">Этажность</div>
              <div className="flex flex-wrap gap-1.5">
                {["1", "2"].map(c => (
                  <button key={c} onClick={() => toggleInSet(setFilterFloors, c)}
                    className={`text-[12px] rounded-[var(--radius)] px-3 py-[6px] transition-colors ${
                      filterFloors.has(c) ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/80"
                    }`}>{c}</button>
                ))}
              </div>
            </div>

            {/* Технология */}
            <div className="mb-5">
              <div className="mb-3 text-[13px] font-semibold text-foreground">Технология</div>
              <div className="flex flex-wrap gap-1.5">
                {PUBLIC_TECHNOLOGY_OPTIONS.map(({ value, label }) => (
                  <button key={value} onClick={() => toggleInSet(setFilterTechnology, value)} aria-pressed={Boolean(techFilter && matchesProjectTechnology(techFilter, value)) || filterTechnology.has(value)}
                    className={`text-[12px] rounded-[var(--radius)] px-3 py-[6px] transition-colors ${
                      Boolean(techFilter && matchesProjectTechnology(techFilter, value)) || filterTechnology.has(value) ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/80"
                    }`}>{getProjectTechnologyLabel(label)}</button>
                ))}
              </div>
            </div>

            {/* Комплектация */}
            <div className="mb-5">
              <div className="mb-3 text-[13px] font-semibold text-foreground">Комплектация</div>
              <div className="flex flex-wrap gap-1.5">
                {COMPLETION_OPTIONS.map(c => (
                  <button key={c} onClick={() => toggleInSet(setFilterCompletion, c)}
                    className={`text-[12px] rounded-[var(--radius)] px-3 py-[6px] transition-colors ${
                      filterCompletion.has(c) ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/80"
                    }`}>{c}</button>
                ))}
              </div>
            </div>

            {/* Утепление */}
            <div className="mb-5">
              <div className="mb-3 text-[13px] font-semibold text-foreground">Утепление</div>
              <div className="flex flex-wrap gap-1.5">
                {["до −20°C", "до −30°C", "до −40°C"].map(c => (
                  <button key={c} onClick={() => toggleInSet(setFilterInsulation, c)}
                    className={`text-[12px] rounded-[var(--radius)] px-3 py-[6px] transition-colors ${
                      filterInsulation.has(c) ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/80"
                    }`}>{c}</button>
                ))}
              </div>
            </div>

            {/* Особенности */}
            <div className="mb-5">
              <div className="mb-3 text-[13px] font-semibold text-foreground">Особенности</div>
              <div className="flex flex-wrap gap-1.5">
                {["Терраса", "Панорамные окна", "Второй свет", "Антресоль", "Сауна"].map(c => (
                  <button key={c} onClick={() => toggleInSet(setFilterFeatures, c)}
                    className={`text-[12px] rounded-[var(--radius)] px-3 py-[6px] transition-colors ${
                      filterFeatures.has(c) ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/80"
                    }`}>{c}</button>
                ))}
              </div>
            </div>

            {/* Стиль */}
            <div className="mb-5">
              <div className="mb-3 text-[13px] font-semibold text-foreground">Стиль</div>
              <div className="flex flex-wrap gap-1.5">
                {["A-Frame", "Барнхаус", "Скандинавский", "Минимализм / Loft", "Классический"].map(c => (
                  <button key={c} onClick={() => toggleInSet(setFilterStyle, c)}
                    className={`text-[12px] rounded-[var(--radius)] px-3 py-[6px] transition-colors ${
                      filterStyle.has(c) ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/80"
                    }`}>{c}</button>
                ))}
              </div>
            </div>

            {/* Размер участка */}
            <div className="mb-5">
              <div className="mb-3 text-[13px] font-semibold text-foreground">Размер участка</div>
              <div className="flex flex-wrap gap-1.5">
                {["3–6 соток", "6–10 соток", "от 10 соток"].map(c => (
                  <button key={c} onClick={() => toggleInSet(setFilterLandType, c)}
                    className={`text-[12px] rounded-[var(--radius)] px-3 py-[6px] transition-colors ${
                      filterLandType.has(c) ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/80"
                    }`}>{c}</button>
                ))}
              </div>
            </div>

            {/* Дополнительно */}
            <div>
              <div className="mb-3 text-[13px] font-semibold text-foreground">Дополнительно</div>
              <div className="flex flex-wrap gap-1.5">
                {["Фото реальных домов", "Рейтинг 4.5+", "Есть шоурум", "Рассрочка"].map(c => (
                  <button key={c} onClick={() => toggleInSet(setFilterExtras, c === "Есть шоурум" ? "Есть шоурум и выставочные дома" : c)}
                    className={`text-[12px] rounded-[var(--radius)] px-3 py-[6px] transition-colors ${
                      filterExtras.has(c === "Есть шоурум" ? "Есть шоурум и выставочные дома" : c) ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/80"
                    }`}>{c}</button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="hidden md:block flex-1 py-0">
          {/* Sort row */}
          <div className="mb-5 flex min-h-11 items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-[14px] text-muted-foreground">
                Найдено: <span className="font-medium text-foreground">{sortedItems.length} {pluralizeProjects(sortedItems.length)}</span>
                {catalogSearchTerms.length === 0 && <> {selectedRegionPrepositional}</>}
              </span>
              <div className="relative inline-flex h-11 cursor-pointer items-center gap-2 rounded-[var(--radius)] border border-border bg-background px-4">
                <span className="text-[14px] font-medium text-foreground">
                  {sortOptions.find(o => o.value === sortBy)?.label ?? "Сортировка"}
                </span>
                <ChevronDown className="h-4 w-4 text-foreground" strokeWidth={1.7} />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  aria-label="Сортировка"
                >
                  {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>
            <div className="flex h-11 items-center rounded-[var(--radius)] border border-border bg-background p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`flex h-9 w-9 items-center justify-center rounded-[var(--radius)] ${viewMode === "grid" ? "bg-secondary" : ""}`}
                aria-label="Показать сеткой"
              >
                <GridIcon active={viewMode === "grid"} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`flex h-9 w-9 items-center justify-center rounded-[var(--radius)] ${viewMode === "list" ? "bg-secondary" : ""}`}
                aria-label="Показать списком"
              >
                <ListIcon active={viewMode === "list"} />
              </button>
            </div>
          </div>

          {sortedItems.length === 0 ? (
            <div className="flex min-h-[340px] flex-col items-center justify-center border-t border-border px-6 text-center">
              <h2 className="text-[24px] font-semibold text-foreground">Проекты не найдены</h2>
              <p className="mt-2 max-w-[460px] text-[15px] leading-relaxed text-muted-foreground">
                Измените параметры поиска или сбросьте фильтры, чтобы увидеть больше вариантов.
              </p>
              <button
                type="button"
                onClick={clearCatalogFilters}
                className="mt-5 min-h-11 rounded-[var(--radius)] border border-border px-5 text-[14px] font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                Сбросить фильтры
              </button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8">
              {visibleItems.map((item) => (
                <ProjectCard
                  key={item.id}
                  projectId={item.id}
                  height="aspect-[5/4] h-auto"
                  onCardClick={(event, id) => {
                    const project = projects.find((item) => item.id === id);
                    if (project) navigateWithTransition(event, navigate, getProjectPath(project));
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-y-10">
              {visibleItems.map((item) => (
                <ProjectCard
                  key={item.id}
                  projectId={item.id}
                  height="aspect-[5/4] h-auto"
                  onCardClick={(event, id) => {
                    const project = projects.find((item) => item.id === id);
                    if (project) navigateWithTransition(event, navigate, getProjectPath(project));
                  }}
                />
              ))}
            </div>
          )}
        </main>
      </div>
      </div>}

      {/* Mobile content */}
      {isMobile && <div className={`${embedded ? "" : "px-0 lg:px-10 xl:px-12"} w-full pb-12 pt-5 md:hidden`}>
        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-[14px] text-muted-foreground">
              Найдено: <span className="font-medium text-foreground">{sortedItems.length} {pluralizeProjects(sortedItems.length)}</span>
              {catalogSearchTerms.length === 0 && <> {selectedRegionPrepositional}</>}
            </p>
            {hasActiveFilters && (
              <button type="button" onClick={clearCatalogFilters} className="min-h-11 text-[14px] font-medium text-primary">
                Сбросить
              </button>
            )}
          </div>
          {sortedItems.length === 0 ? (
            <div className="flex min-h-[300px] flex-col items-start justify-center border-t border-border py-10">
              <h2 className="text-[22px] font-semibold text-foreground">Проекты не найдены</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">Попробуйте изменить запрос или фильтры.</p>
              <button
                type="button"
                onClick={clearCatalogFilters}
                className="mt-5 min-h-11 text-[15px] font-medium text-primary"
              >
                Сбросить фильтры
              </button>
            </div>
          ) : (
            <div className={viewMode === "list" ? "grid grid-cols-1 gap-y-[6px]" : "grid grid-cols-2 gap-x-[2px] gap-y-[6px]"}>
              {visibleItems.map((item) => (
                <ProjectCard
                  key={item.id}
                  projectId={item.id}
                  height={viewMode === "grid" ? "aspect-[4/3] h-auto" : "aspect-[5/4] h-auto"}
                  onCardClick={(e, id) => {
                    const project = projects.find((item) => item.id === id);
                    if (project) navigateWithTransition(e, navigate, getProjectPath(project));
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>}

      {hasMoreItems && (
        <div
          ref={catalogLoadMoreRef}
          className="h-px w-full"
          aria-hidden="true"
          data-testid="catalog-projects-load-more"
        />
      )}
      <p className="sr-only" aria-live="polite">
        Показано проектов: {visibleItems.length} из {sortedItems.length}
      </p>

      {!embedded && routeCategory && (
        <section
          className="px-4 py-16 sm:px-8 md:py-24 lg:px-10 xl:px-12"
          aria-labelledby="catalog-category-description"
        >
          <div className="max-w-[850px]">
            <h2
              id="catalog-category-description"
              className="text-[28px] font-semibold leading-[1.12] tracking-[-0.03em] text-foreground md:text-[36px]"
            >
              {routeCategory.contentHeading}
            </h2>
            <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-muted-foreground md:mt-6 md:text-[17px]">
              {routeCategory.contentParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Mobile Filter Sheet */}
      <Drawer open={filtersOpen} onOpenChange={setFiltersOpen}>
        <DrawerContent className="mx-0 flex max-h-[90vh] flex-col rounded-t-[var(--radius)] p-0 font-sans [&>div:first-child]:hidden">
          {/* Scrollable filter sections */}
          <div className="flex-1 overflow-y-auto">

            {/* 1. Подходит для */}
            <div className="px-5 pb-3.5 pt-4 border-b border-border/50">
              <div className="mb-2.5 flex min-h-11 items-center justify-between gap-3">
                <div className="text-[13px] font-semibold text-foreground">Подходит для</div>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={clearCatalogFilters}
                    className="min-h-11 px-2 text-sm font-normal text-primary"
                  >
                    Сбросить
                  </button>
                  <button
                    type="button"
                    onClick={() => setFiltersOpen(false)}
                    aria-label="Закрыть фильтры"
                    className="flex h-11 w-11 items-center justify-center rounded-[var(--radius)] text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                  >
                    <X className="h-5 w-5" strokeWidth={1.7} aria-hidden />
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {["Постоянное проживание", "Выходные / дача", "Сдача в аренду", "Гостевой дом", "Для семьи", "Для одного / пары"].map(c => (
                  <button key={c} onClick={() => applySuitablePreset(c)}
                    className={`text-[13px] rounded-[var(--radius)] px-3.5 py-[7px] transition-colors ${
                      filterSuitableFor.has(c) ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/80"
                    }`}>{c}</button>
                ))}
              </div>
            </div>

            <div className="border-b border-border/50 px-5 py-3.5">
              <div className="mb-2.5 text-[13px] font-semibold text-foreground">Тип объекта</div>
              <div className="flex flex-wrap gap-2">
                {([
                  ["all", "Все"],
                  ["house", "Дома"],
                  ["bath", "Бани"],
                ] as const).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setObjectTypeFilter(value)}
                    aria-pressed={selectedObjectType === value}
                    className={`min-h-9 rounded-[var(--radius)] px-3.5 text-[13px] transition-colors ${
                      selectedObjectType === value ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/80"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-b border-border/50 px-5 py-3.5">
              <div className="mb-2.5 text-[13px] font-semibold text-foreground">Для бизнеса</div>
              <div className="flex flex-wrap gap-2">
                {BUSINESS_USE_CASE_OPTIONS.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => toggleBusinessUseCase(value)}
                    aria-pressed={filterBusinessUseCases.has(value)}
                    className={`rounded-[var(--radius)] px-3.5 py-[7px] text-[13px] transition-colors ${
                      filterBusinessUseCases.has(value) ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/80"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Цена */}
            <div className="px-5 py-3.5 border-b border-border/50">
              <div className="mb-2.5 text-[13px] font-semibold text-foreground">Цена, ₽</div>
              <div className="flex items-end gap-[2px] h-9 mb-2">
                {[85,100,75,60,50,40,35,28,20,15,10,5].map((h, i) => {
                  const barMin = (i / 12) * PRICE_MAX;
                  const barMax = ((i + 1) / 12) * PRICE_MAX;
                  const active = barMin < filterPriceMaxVal && barMax > filterPriceMinVal;
                  return <div key={i} className={`flex-1 rounded-t-sm ${active ? "bg-primary" : "bg-border"}`} style={{ height: `${h}%` }} />;
                })}
              </div>
              <div className="relative h-6 mb-2.5 touch-none">
                <div className="absolute top-[11px] left-0 right-0 h-1 bg-border rounded-full" />
                <div className="absolute top-[11px] h-1 bg-primary rounded-full" style={{ left: `${(filterPriceMinVal / PRICE_MAX) * 100}%`, right: `${100 - (filterPriceMaxVal / PRICE_MAX) * 100}%` }} />
                <input type="range" min={PRICE_MIN} max={PRICE_MAX} step={50000} value={filterPriceMinVal}
                  onChange={e => { const v = Math.min(Number(e.target.value), filterPriceMaxVal - 50000); setFilterPriceMinVal(v); }}
                  className="touch-none absolute top-0 left-0 w-full h-6 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-background [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer" />
                <input type="range" min={PRICE_MIN} max={PRICE_MAX} step={50000} value={filterPriceMaxVal}
                  onChange={e => { const v = Math.max(Number(e.target.value), filterPriceMinVal + 50000); setFilterPriceMaxVal(v); }}
                  className="touch-none absolute top-0 left-0 w-full h-6 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-background [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input value={filterPriceMinVal.toLocaleString("ru-RU")} onChange={e => setFilterPriceMinVal(parseInt(e.target.value.replace(/\D/g, "")) || 0)} className="rounded-[var(--radius)] border border-border bg-background px-3 py-2.5 text-[13px] text-foreground outline-none focus:border-primary" />
                <input value={filterPriceMaxVal.toLocaleString("ru-RU")} onChange={e => setFilterPriceMaxVal(parseInt(e.target.value.replace(/\D/g, "")) || 0)} className="rounded-[var(--radius)] border border-border bg-background px-3 py-2.5 text-[13px] text-foreground outline-none focus:border-primary" />
              </div>
            </div>

            {/* 3. Базовые параметры */}
            <div className="px-5 py-3.5 border-b border-border/50">
              <div className="mb-2.5 text-[13px] font-semibold text-foreground">Площадь, м²</div>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <input value={filterAreaMin} onChange={e => setFilterAreaMin(e.target.value)} placeholder="от" className="rounded-[var(--radius)] border border-border bg-background px-3 py-2.5 text-[13px] text-foreground outline-none placeholder:text-muted-foreground focus:border-primary" />
                <input value={filterAreaMax} onChange={e => setFilterAreaMax(e.target.value)} placeholder="до" className="rounded-[var(--radius)] border border-border bg-background px-3 py-2.5 text-[13px] text-foreground outline-none placeholder:text-muted-foreground focus:border-primary" />
              </div>
            </div>

            {/* Срок до заселения */}
            <div className="px-5 py-3.5 border-b border-border/50">
              <div className="mb-2.5 text-[13px] font-semibold text-foreground">Срок до заселения</div>
              <div className="flex flex-wrap gap-2">
                {["до 2 недель", "2–4 недели", "1–2 месяца"].map(c => (
                  <button key={c} onClick={() => toggleInSet(setFilterMoveIn, c)}
                    className={`text-[13px] rounded-[var(--radius)] px-3.5 py-[7px] transition-colors ${
                      filterMoveIn.has(c) ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/80"
                    }`}>{c}</button>
                ))}
              </div>
            </div>

            {/* 4. Планировка */}
            <div className="px-5 py-3.5 border-b border-border/50">
              <div className="mb-2.5 text-[13px] font-semibold text-foreground">Спальни</div>
              <div className="flex flex-wrap gap-2 mb-3">
                {["Студия", "1", "2", "3+"].map(c => (
                  <button key={c} onClick={() => toggleInSet(setFilterBedrooms, c)}
                    className={`text-[13px] rounded-[var(--radius)] px-3.5 py-[7px] transition-colors ${
                      filterBedrooms.has(c) ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/80"
                    }`}>{c}</button>
                ))}
              </div>
              <div className="mb-2.5 text-[13px] font-semibold text-foreground">Санузлы</div>
              <div className="flex flex-wrap gap-2 mb-3">
                {["1", "2+"].map(c => (
                  <button key={c} onClick={() => toggleInSet(setFilterBathrooms, c)}
                    className={`text-[13px] rounded-[var(--radius)] px-3.5 py-[7px] transition-colors ${
                      filterBathrooms.has(c) ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/80"
                    }`}>{c}</button>
                ))}
              </div>
              <div className="mb-2.5 text-[13px] font-semibold text-foreground">Этажность</div>
              <div className="flex flex-wrap gap-2">
                {["1", "2"].map(c => (
                  <button key={c} onClick={() => toggleInSet(setFilterFloors, c)}
                    className={`text-[13px] rounded-[var(--radius)] px-3.5 py-[7px] transition-colors ${
                      filterFloors.has(c) ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/80"
                    }`}>{c}</button>
                ))}
              </div>
            </div>

            {/* Технология */}
            <div className="px-5 py-3.5 border-b border-border/50">
              <div className="mb-2.5 text-[13px] font-semibold text-foreground">Технология</div>
              <div className="flex flex-wrap gap-2">
                {PUBLIC_TECHNOLOGY_OPTIONS.map(({ value, label }) => (
                  <button key={value} onClick={() => toggleInSet(setFilterTechnology, value)} aria-pressed={Boolean(techFilter && matchesProjectTechnology(techFilter, value)) || filterTechnology.has(value)}
                    className={`text-[13px] rounded-[var(--radius)] px-3.5 py-[7px] transition-colors ${
                      Boolean(techFilter && matchesProjectTechnology(techFilter, value)) || filterTechnology.has(value) ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/80"
                    }`}>{getProjectTechnologyLabel(label)}</button>
                ))}
              </div>
            </div>

            {/* 5. Комплектация */}
            <div className="px-5 py-3.5 border-b border-border/50">
              <div className="mb-2.5 text-[13px] font-semibold text-foreground">Комплектация</div>
              <div className="flex flex-wrap gap-2">
                {COMPLETION_OPTIONS.map(c => (
                  <button key={c} onClick={() => toggleInSet(setFilterCompletion, c)}
                    className={`text-[13px] rounded-[var(--radius)] px-3.5 py-[7px] transition-colors ${
                      filterCompletion.has(c) ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/80"
                    }`}>{c}</button>
                ))}
              </div>
            </div>

            {/* 6. Утепление */}
            <div className="px-5 py-3.5 border-b border-border/50">
              <div className="mb-2.5 text-[13px] font-semibold text-foreground">Утепление</div>
              <div className="flex flex-wrap gap-2">
                {["до −20°C", "до −30°C", "до −40°C"].map(c => (
                  <button key={c} onClick={() => toggleInSet(setFilterInsulation, c)}
                    className={`text-[13px] rounded-[var(--radius)] px-3.5 py-[7px] transition-colors ${
                      filterInsulation.has(c) ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/80"
                    }`}>{c}</button>
                ))}
              </div>
            </div>

            {/* 7. Особенности (чекбоксы) */}
            <div className="px-5 py-3.5 border-b border-border/50">
              <div className="mb-2.5 text-[13px] font-semibold text-foreground">Особенности</div>
              <div className="flex flex-wrap gap-2">
                {["Терраса", "Панорамные окна", "Второй свет", "Антресоль", "Сауна"].map(c => (
                  <button key={c} onClick={() => toggleInSet(setFilterFeatures, c)}
                    className={`text-[13px] rounded-[var(--radius)] px-3.5 py-[7px] transition-colors ${
                      filterFeatures.has(c) ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/80"
                    }`}>{c}</button>
                ))}
              </div>
            </div>

            {/* 8. Стиль */}
            <div className="px-5 py-3.5 border-b border-border/50">
              <div className="mb-2.5 text-[13px] font-semibold text-foreground">Стиль</div>
              <div className="flex flex-wrap gap-2">
                {["A-Frame", "Барнхаус", "Скандинавский", "Минимализм / Loft", "Классический"].map(c => (
                  <button key={c} onClick={() => toggleInSet(setFilterStyle, c)}
                    className={`text-[13px] rounded-[var(--radius)] px-3.5 py-[7px] transition-colors ${
                      filterStyle.has(c) ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/80"
                    }`}>{c}</button>
                ))}
              </div>
            </div>

            {/* 9. Размер участка */}
            <div className="px-5 py-3.5 border-b border-border/50">
              <div className="mb-2.5 text-[13px] font-semibold text-foreground">Размер участка</div>
              <div className="flex flex-wrap gap-2 mb-3">
                {["3–6 соток", "6–10 соток", "от 10 соток"].map(c => (
                  <button key={c} onClick={() => toggleInSet(setFilterLandType, c)}
                    className={`text-[13px] rounded-[var(--radius)] px-3.5 py-[7px] transition-colors ${
                      filterLandType.has(c) ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/80"
                    }`}>{c}</button>
                ))}
              </div>
            </div>

            {/* 10. Регион и производитель */}
            <div className="px-5 py-3.5 border-b border-border/50">
              <div className="mb-2.5 text-[13px] font-semibold text-foreground">Регион доставки</div>
              {lockedRegion ? (
                <div className="mb-3 flex min-h-11 w-full items-center rounded-[var(--radius)] border border-border bg-background px-3.5 py-2.5 text-[13px] text-foreground">
                  {effectiveCityLabel}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={openCitySelectorFromMobileFilters}
                  className="mb-3 flex min-h-11 w-full items-center justify-between rounded-[var(--radius)] border border-border bg-background px-3.5 py-2.5 text-left transition-colors hover:border-primary/50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                >
                  <span className="text-[13px] text-foreground">{effectiveCityLabel}</span>
                  <ChevronRight className="h-4 w-4 shrink-0" strokeWidth={1.7} aria-hidden />
                </button>
              )}
              <label htmlFor="catalog-maker-mobile" className="mb-2.5 block text-[13px] font-semibold text-foreground">Производитель</label>
              <div className="relative">
                <select
                  id="catalog-maker-mobile"
                  value={filterMaker}
                  onChange={(event) => setFilterMaker(event.target.value)}
                  className="h-11 w-full cursor-pointer appearance-none rounded-[var(--radius)] border border-border bg-background pl-3.5 pr-12 text-[13px] text-foreground outline-none focus:border-primary"
                >
                  <option value="">Все производители</option>
                  {availableCatalogMakers.map((maker) => <option key={maker} value={maker}>{maker.split(" · ")[0]}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-5 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground" strokeWidth={1.7} aria-hidden />
              </div>
            </div>

            {/* 11. Дополнительно */}
            <div className="px-5 py-3.5">
              <div className="mb-2.5 text-[13px] font-semibold text-foreground">Дополнительно</div>
              <div className="flex flex-wrap gap-2">
                {["Фото реальных домов", "Рейтинг 4.5+", "Есть шоурум и выставочные дома", "Рассрочка"].map(c => (
                  <button key={c} onClick={() => toggleInSet(setFilterExtras, c)}
                    className={`text-[13px] rounded-[var(--radius)] px-3.5 py-[7px] transition-colors ${
                      filterExtras.has(c) ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/80"
                    }`}>{c}</button>
                ))}
              </div>
            </div>

          </div>

          {/* CTA */}
          <div className="px-5 pt-3 pb-[calc(16px+env(safe-area-inset-bottom))] border-t border-border bg-background">
            <button
              onClick={() => setFiltersOpen(false)}
              className="w-full rounded-[var(--radius)] bg-primary py-4 text-[15px] font-medium text-primary-foreground"
            >
              Показать {filteredItems.length} {pluralizeProjects(filteredItems.length)}
            </button>
          </div>
        </DrawerContent>
      </Drawer>

      {!embedded && <Footer />}

      {!embedded && <CitySelector
        open={citySelectorOpen}
        onOpenChange={setCitySelectorOpen}
        city={selectedCity}
        onSelect={handleSelectCity}
        hasExplicitSelection={hasExplicitSelection}
      />}

    </div>
  );
};

export default Catalog;
