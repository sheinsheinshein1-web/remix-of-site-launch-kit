import { useState, useRef, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { flushSync } from "react-dom";
import { Search, X, FileText, LayoutGrid, ChevronRight, Clock, MapPin, SlidersHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { makersById, projects as dataProjects } from "@/data/projects";
import { manufacturerRegistry } from "@/data/manufacturers";
import { useCity } from "@/components/CitySelector";
import { compareProjectTechnologyPriority } from "@/lib/projectPriority";
import { allCategoryLinks } from "@/data/categoryLinks";
import { allRegions } from "@/data/regions";
import { isProjectAvailableInGeo } from "@/lib/geoSelection";
import ManufacturerLogo from "@/components/ManufacturerLogo";
import {
  CATALOG_PATH,
  getManufacturerPath,
  getProjectPath,
  getRegionPath,
} from "@/lib/siteRoutes";

// Поиск всегда строится из единого источника правды src/data/projects.ts.
const projects = dataProjects.map((p) => ({
  id: p.id,
  name: p.name,
  maker: manufacturerRegistry[p.manufacturerId].name,
  makerId: p.manufacturerId,
  city: p.city,
  price: p.price,
  area: p.area,
  beds: p.beds,
  baths: p.baths,
  technology: p.technology,
  deliveryRegionSlugs: p.deliveryRegionSlugs,
  path: getProjectPath(p),
  tags: [
    p.badge,
    p.city,
    p.rooms,
    p.purpose,
    p.technology,
    p.completion,
    p.insulation,
    p.style,
    p.landSize,
    p.description,
    p.descriptionLong,
    ...p.suitableFor,
    ...p.features,
  ].join(" "),
}));

const categories = allCategoryLinks.map((category, index) => ({
  name: category.title,
  slug: String(index),
  href: category.href,
}));

const manufacturers = Object.values(makersById).map((maker) => ({
  id: maker.id,
  name: maker.name,
  location: maker.city,
}));

const deliveryRegions = allRegions.map((region) => ({
  slug: region.slug,
  name: region.name,
  type: region.deliveryArea ? "Регион доставки" : "Город доставки",
  searchText: [region.name, region.catalogRegionLabel, ...(region.searchAliases ?? [])]
    .filter(Boolean)
    .join(" ")
    .toLocaleLowerCase("ru"),
}));

// Quick suggestion chips shown when query has text
const quickSuggestions: Record<string, string[]> = {
  "дом": ["под ключ", "для семьи", "с террасой", "до 5 млн", "большой", "одноэтажный"],
  "модуль": ["для жизни", "под ключ", "с отделкой", "скандинавский"],
  "barn": ["barn house", "недорогой"],
  "bear": ["bear house 45", "bear house 77", "bear house 86", "bear house 134", "bear house 168"],
  "vast": ["vast house 140"],
  "wide": ["wide house"],
  "пермь": ["диво", "модульный дом"],
  "диво": ["диво start", "диво 34", "диво 51", "диво 64", "диво 88"],
  "divodom": ["диво start", "диво 34", "диво 51", "диво 64", "диво 88"],
  "дивадом": ["диво start", "диво 34", "диво 51", "диво 64", "диво 88"],
  "дивод": ["диво start", "диво 34", "диво 51", "диво 64", "диво 88"],
  "платформ": ["wide house", "barn house", "bear house"],
};

function formatPrice(v: number): string {
  if (v >= 1_000_000) {
    const m = v / 1_000_000;
    return `${m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)} млн ₽`;
  }
  if (v >= 1_000) return `${Math.round(v / 1000)} тыс ₽`;
  return `${v} ₽`;
}

function fuzzyMatch(text: string, query: string): boolean {
  const a = text.toLowerCase().replace(/ё/g, "е");
  const b = query.toLowerCase().replace(/ё/g, "е");
  return a.includes(b);
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const m: number[][] = [];
  for (let i = 0; i <= b.length; i++) { m[i] = [i]; }
  for (let j = 0; j <= a.length; j++) { m[0][j] = j; }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      m[i][j] = b[i-1] === a[j-1]
        ? m[i-1][j-1]
        : Math.min(m[i-1][j]+1, m[i][j-1]+1, m[i-1][j-1]+1);
    }
  }
  return m[b.length][a.length];
}

function parsePrice(s: string): number {
  return parseInt(s.replace(/[^\d]/g, ""), 10) || 0;
}

function parseArea(s: string): number {
  return parseInt(s.replace(/[^\d]/g, ""), 10) || 0;
}

// Typo correction dictionary
const typoMap: Record<string, string> = {
  "можульный": "модульный", "модулный": "модульный", "модульнй": "модульный",
  "модлульный": "модульный", "модульныи": "модульный", "жульный": "модульный",
  "можульные": "модульные", "можульного": "модульного", "жульные": "модульные",
  "спалня": "спальня", "спални": "спальни", "спалнями": "спальнями",
  "спальнми": "спальнями", "спалень": "спален", "сапльни": "спальни",
  "комнотный": "комнатный", "комнотные": "комнатные",
  "тирраса": "терраса", "терасса": "терраса", "террасса": "терраса",
  "глемпинг": "глэмпинг", "глампинг": "глэмпинг",
  "двухэтажый": "двухэтажный", "двухэтажный": "двухэтажный",
  "дачый": "дачный", "дачьный": "дачный",
};

// Build dictionary from all searchable content
const dictWords = (() => {
  const sources = [
    ...projects.flatMap(p => [p.name, p.maker]),
    ...categories.map(c => c.name),
    ...manufacturers.flatMap(m => [m.name, m.location]),
    ...allRegions.flatMap(region => [region.name, ...(region.searchAliases ?? [])]),
    
    "модульный", "модульные", "модульного", "дом", "дома", "дому",
    "спальня", "спальни", "спальнями", "спален",
    "комната", "комнаты", "комнатный", "комнатные",
    "баня", "бани", "баню", "глэмпинг",
    "терраса", "террасой",
    "дача", "дачи", "дачный", "дачные",
    "руб", "рублей", "рубль", "рубли", "млн", "миллион", "миллиона",
    "тыс", "тысяч", "тысячи",
  ];
  const words = new Set<string>();
  sources.forEach(s => s.toLowerCase().split(/[^а-яёa-z0-9]+/i).filter(w => w.length > 2).forEach(w => words.add(w)));
  return Array.from(words);
})();

const skipCorrection = new Set(["руб", "рублей", "рубль", "рубли", "млн", "тыс", "милл", "миллион", "миллиона", "миллионов", "для", "при", "под", "над", "без", "про", "до"]);

function correctWord(token: string): string {
  if (token.length < 3 || /^\d+$/.test(token)) return token;
  const t0 = token.toLowerCase();
  if (skipCorrection.has(t0)) return t0;
  const t = token.toLowerCase();
  if (typoMap[t]) return typoMap[t];
  if (dictWords.includes(t)) return t;

  let best = t, bestDist = Infinity;
  const norm = t.replace(/ё/g, "е");
  for (const w of dictWords) {
    if (Math.abs(w.length - t.length) > 2) continue;
    const d = levenshtein(norm, w.replace(/ё/g, "е"));
    if (d < bestDist) { best = w; bestDist = d; if (d <= 1) break; }
  }
  const maxDist = t.length >= 7 ? 2 : 1;
  return bestDist <= maxDist ? best : t;
}

function normalizeQuery(raw: string): string {
  return raw.toLowerCase()
    .replace(/[а-яёa-z]+/gi, m => correctWord(m))
    .replace(/\s+/g, " ").trim();
}

export interface ParsedSearchFilters {
  beds?: number;
  baths?: number;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  textQuery: string;
}

// Word-number map for written-out numbers
const wordToNumber: Record<string, number> = {
  "одн": 1, "одной": 1, "одним": 1, "одна": 1, "одно": 1, "один": 1,
  "двумя": 2, "двух": 2, "две": 2, "два": 2,
  "тремя": 3, "трёх": 3, "трех": 3, "три": 3,
  "четырьмя": 4, "четырёх": 4, "четырех": 4, "четыре": 4,
  "пятью": 5, "пяти": 5, "пять": 5,
};

// Cyrillic-aware char class for word continuations
const CYR = "[а-яёА-ЯЁ]";

// This parser is shared with the hero and catalog, not only with the dropdown.
// eslint-disable-next-line react-refresh/only-export-components
export function parseSearchFilters(raw: string): ParsedSearchFilters {
  const canonicalRaw = raw.toLowerCase()
    .replace(/(^|\s)(?:не\s+дороже|не\s+больше|дешевле|максимум)(?=\s|$)/gu, "$1до")
    .replace(/(^|\s)(?:не\s+дешевле|не\s+меньше|дороже|минимум)(?=\s|$)/gu, "$1от")
    .replace(/(^|\s)бюджет(?:ом)?\s+(?=\d)/gu, "$1до ")
    .replace(/(^|\s)за\s+(?=\d)/gu, "$1до ");
  let q = normalizeQuery(canonicalRaw);
  const filters: ParsedSearchFilters = { textQuery: "" };

  // 1) digit + bedroom word
  const bedsDigit = q.match(new RegExp(`(\\d+)\\s*[-\\s]?(?:спал${CYR}*|комнат${CYR}*|bedroom\\w*|сп${CYR}{0,12})`, "u"));
  if (bedsDigit) {
    filters.beds = parseInt(bedsDigit[1]);
    q = q.replace(bedsDigit[0], "");
  }

  // 2) word-number + bedroom
  if (filters.beds === undefined) {
    const wordKeys = Object.keys(wordToNumber).sort((a, b) => b.length - a.length).join("|");
    const bedsWord = q.match(new RegExp(`(${wordKeys})\\s*[-\\s]?(?:спал${CYR}*|комнат${CYR}*|сп${CYR}{0,12})`, "u"));
    if (bedsWord) {
      const numWord = bedsWord[1].toLowerCase();
      filters.beds = wordToNumber[numWord] || Object.entries(wordToNumber).find(([k]) => numWord.startsWith(k))?.[1];
      q = q.replace(bedsWord[0], "");
    }
  }

  // 3) compound: "двухкомнатный", "трёхкомнатный"
  if (filters.beds === undefined) {
    const compoundMatch = q.match(new RegExp(`(одно|двух|трёх|трех|четырёх|четырех|пяти)\\s*(?:комнат${CYR}*|спал${CYR}*)`, "u"));
    if (compoundMatch) {
      const prefix = compoundMatch[1];
      const prefixMap: Record<string, number> = { "одно": 1, "двух": 2, "трёх": 3, "трех": 3, "четырёх": 4, "четырех": 4, "пяти": 5 };
      filters.beds = prefixMap[prefix];
      q = q.replace(compoundMatch[0], "");
    }
  }

  const bathsMatch = q.match(new RegExp(`(\\d+)\\s*(?:санузл${CYR}*|ванн${CYR}*|bath\\w*)`, "u"));
  if (bathsMatch) { filters.baths = parseInt(bathsMatch[1]); q = q.replace(bathsMatch[0], ""); }

  const areaFromMatch = q.match(/от\s*(\d+)\s*(?:м²|м2|м\.?\b|кв\.?|квадрат(?:ных)?|метр(?:ов|а)?)/u);
  if (areaFromMatch) { filters.minArea = parseInt(areaFromMatch[1]); q = q.replace(areaFromMatch[0], ""); }
  const areaToMatch = q.match(/до\s*(\d+)\s*(?:м²|м2|м\.?\b|кв\.?|квадрат(?:ных)?|метр(?:ов|а)?)/u);
  if (areaToMatch) { filters.maxArea = parseInt(areaToMatch[1]); q = q.replace(areaToMatch[0], ""); }

  const priceUnit = `млн|милл${CYR}*|миллион${CYR}*|тыс${CYR}*|руб${CYR}*|₽`;
  const priceFromMatch = q.match(new RegExp(`от\\s*([\\d.,]+)\\s*(${priceUnit})\\s*(${priceUnit})?`, "u"));
  if (priceFromMatch) {
    let v = parseFloat(priceFromMatch[1].replace(",", "."));
    const units = [priceFromMatch[2], priceFromMatch[3]].filter(Boolean).join(" ");
    if (/млн|милл|миллион/.test(units)) v *= 1_000_000;
    else if (/тыс/.test(units)) v *= 1_000;
    filters.minPrice = v;
    q = q.replace(priceFromMatch[0], "");
  }
  const priceToMatch = q.match(new RegExp(`до\\s*([\\d.,]+)\\s*(${priceUnit})\\s*(${priceUnit})?`, "u"));
  if (priceToMatch) {
    let v = parseFloat(priceToMatch[1].replace(",", "."));
    const units = [priceToMatch[2], priceToMatch[3]].filter(Boolean).join(" ");
    if (/млн|милл|миллион/.test(units)) v *= 1_000_000;
    else if (/тыс/.test(units)) v *= 1_000;
    filters.maxPrice = v;
    q = q.replace(priceToMatch[0], "");
  }
  const bigFromMatch = q.match(/от\s*(\d{4,})/);
  if (bigFromMatch && !filters.minPrice) { filters.minPrice = parseInt(bigFromMatch[1]); q = q.replace(bigFromMatch[0], ""); }
  const bigToMatch = q.match(/до\s*(\d{4,})/);
  if (bigToMatch && !filters.maxPrice) { filters.maxPrice = parseInt(bigToMatch[1]); q = q.replace(bigToMatch[0], ""); }

  // Clean up leftover words using cyrillic-aware patterns
  const numberWords = Object.keys(wordToNumber).sort((a, b) => b.length - a.length).join("|");
  q = q.replace(new RegExp(`(^|\\s)(${numberWords})(?=\\s|$)`, "gu"), " ");
  q = q.replace(new RegExp(`(^|\\s)(спал${CYR}*|комнат${CYR}*|сп${CYR}{0,12})(?=\\s|$)`, "gu"), " ");
  q = q.replace(new RegExp(`(^|\\s)(руб${CYR}*|₽)(?=\\s|$)`, "gu"), " ");
  q = q.replace(/(^|\s)(метр(?:ов|а)?|м\.?|кв\.?|квадрат(?:ных)?)(?=\s|$)/gu, " ");
  q = q.replace(/(^|\s)(с|для|на|и|в|а|о|у|к|от|до|по|из)(?=\s|$)/g, " ");
  q = q.replace(/(^|\s)(млн|милл[а-яё]*|миллион[а-яё]*|тыс[а-яё]*|руб[а-яё]*|₽)(?=\s|$)/gu, " ");
  filters.textQuery = q.replace(/\s+/g, " ").trim();
  return filters;
}

function filterProjects(filters: ParsedSearchFilters, list: typeof projects = projects) {
  return list.filter(p => {
    if (filters.beds !== undefined && p.beds !== filters.beds) return false;
    if (filters.baths !== undefined && p.baths !== filters.baths) return false;
    const price = parsePrice(p.price);
    if (filters.minPrice && price < filters.minPrice) return false;
    if (filters.maxPrice && price > filters.maxPrice) return false;
    const area = parseArea(p.area);
    if (filters.minArea && area < filters.minArea) return false;
    if (filters.maxArea && area > filters.maxArea) return false;
    if (filters.textQuery) {
      const isCategory = categories.some(c => c.name.toLowerCase().includes(filters.textQuery.toLowerCase()));
      if (!isCategory) {
        const words = filters.textQuery.split(/\s+/);
        const haystack = (p.name + " " + p.maker + " " + (p.tags || "")).toLowerCase();
        const matchesAny = words.some(w => haystack.includes(w));
        if (!matchesAny) return false;
      }
    }
    return true;
  });
}

// Popular searches shown when input is empty
const popularSearches = [
  "Модульный дом под ключ",
  "Дом до 3 млн",
  "Bear House",
  "Дом с террасой",
  "Большой дом для семьи",
  "Одноэтажный дом",
];

interface SearchDropdownProps {
  className?: string;
  inputClassName?: string;
  onFocusChange?: (focused: boolean) => void;
  initialQuery?: string;
  showFilterButton?: boolean;
  onFilterClick?: () => void;
  hasActiveFilters?: boolean;
  onQueryChange?: (q: string) => void;
  iconOnly?: boolean;
}

const SearchDropdown = ({ className = "", inputClassName = "", onFocusChange, initialQuery = "", showFilterButton, onFilterClick, hasActiveFilters, onQueryChange, iconOnly }: SearchDropdownProps) => {
  const navigate = useNavigate();
  const { city } = useCity();
  const [query, setQuery] = useState(initialQuery);

  // Sync initialQuery from parent (e.g. URL change)
  useEffect(() => { setQuery(initialQuery); }, [initialQuery]);

  const updateQuery = (val: string) => {
    setQuery(val);
    onQueryChange?.(val);
  };
  const [focused, setFocused] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("search_history") || "[]"); } catch { return []; }
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const mobileDialogRef = useRef<HTMLDivElement>(null);
  const mobileTriggerRef = useRef<HTMLButtonElement>(null);
  const previousBodyOverflowRef = useRef<string>("");
  const previousHtmlOverflowRef = useRef<string>("");
  const bodyScrollLockedRef = useRef(false);
  const openFrameRef = useRef<number | null>(null);

  const showDropdown = focused && query.length > 0;

  // Lock body scroll when mobile fullscreen is open
  useEffect(() => {
    if (mobileOpen) {
      previousBodyOverflowRef.current = document.body.style.overflow;
      previousHtmlOverflowRef.current = document.documentElement.style.overflow;
      bodyScrollLockedRef.current = true;
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      return () => {
        if (bodyScrollLockedRef.current) {
          document.body.style.overflow = previousBodyOverflowRef.current;
          if (previousHtmlOverflowRef.current) {
            document.documentElement.style.overflow = previousHtmlOverflowRef.current;
          } else {
            document.documentElement.style.removeProperty("overflow");
          }
          bodyScrollLockedRef.current = false;
        }
      };
    }
  }, [mobileOpen]);

  // Auto-focus mobile input when opened
  useEffect(() => {
    if (mobileOpen) {
      const frame = requestAnimationFrame(() => {
        mobileInputRef.current?.focus();
      });
      return () => {
        cancelAnimationFrame(frame);
      };
    }
  }, [mobileOpen]);

  const buildCatalogUrl = (params: Record<string, string | number>) => {
    const sp = new URLSearchParams();
    // Always pass the raw query so the catalog input shows it
    if (query.trim() && !params.q) sp.set("q", query.trim());
    Object.entries(params).forEach(([k, v]) => sp.set(k, String(v)));
    return `${CATALOG_PATH}?${sp.toString()}`;
  };

  const results = useMemo(() => {
    const rawQ = query.trim().toLowerCase();
    const nq = normalizeQuery(query.trim());
    if (!nq) return { suggestions: [], regions: [], projects: [], categories: [], manufacturers: [], articles: [], hasFilters: false };
    const filters = parseSearchFilters(nq);
    const hasFilters = filters.beds !== undefined || filters.baths !== undefined || filters.minPrice !== undefined || filters.maxPrice !== undefined || filters.minArea !== undefined || filters.maxArea !== undefined;

    // Гео-фильтр: показываем только проекты и производителей выбранного города.
    const cityProjects = city
      ? projects.filter((project) => isProjectAvailableInGeo(project.city, city, project.deliveryRegionSlugs))
      : projects;
    const cityMakerIds = new Set(cityProjects.map((project) => project.makerId).filter(Boolean));
    const cityManufacturers = city
      ? manufacturers.filter((maker) => cityMakerIds.has(maker.id))
      : manufacturers;

    const suggestions: { label: string; sub: string; url: string }[] = [];

    if (hasFilters) {
      const parts: string[] = [];
      const urlParams: Record<string, string | number> = {};

      if (filters.textQuery) {
        const catMatch = categories.find(c => c.name.toLowerCase().includes(filters.textQuery.toLowerCase()));
        if (catMatch) parts.push(catMatch.name);
        else {
          const clean = filters.textQuery.charAt(0).toUpperCase() + filters.textQuery.slice(1);
          if (clean.length > 1) parts.push(clean);
        }
      }

      if (filters.minPrice) { parts.push(`от ${formatPrice(filters.minPrice)}`); urlParams.minPrice = filters.minPrice; }
      if (filters.maxPrice) { parts.push(`до ${formatPrice(filters.maxPrice)}`); urlParams.maxPrice = filters.maxPrice; }
      if (filters.minArea) { parts.push(`от ${filters.minArea} м²`); urlParams.minArea = filters.minArea; }
      if (filters.maxArea) { parts.push(`до ${filters.maxArea} м²`); urlParams.maxArea = filters.maxArea; }
      if (filters.beds !== undefined) { parts.push(`${filters.beds} ${filters.beds === 1 ? 'спальня' : filters.beds < 5 ? 'спальни' : 'спален'}`); urlParams.beds = filters.beds; }
      if (filters.baths !== undefined) { parts.push(`${filters.baths} санузл.`); urlParams.baths = filters.baths; }

      const matchCount = filterProjects(filters, cityProjects).length;
      const label = parts.join(", ");

      suggestions.push({
        label: label || "Все проекты",
        sub: `${matchCount} ${matchCount === 1 ? "проект" : matchCount < 5 ? "проекта" : "проектов"} в каталоге`,
        url: buildCatalogUrl(urlParams),
      });

      if (filters.maxPrice && !filters.minPrice) {
        const halfPrice = filters.maxPrice / 2;
        const cheaperCount = filterProjects({ ...filters, maxPrice: halfPrice }, cityProjects).length;
        if (cheaperCount > 0) {
          suggestions.push({
            label: `${filters.textQuery ? filters.textQuery + " " : ""}до ${formatPrice(halfPrice)}`,
            sub: `${cheaperCount} проектов — бюджетные`,
            url: buildCatalogUrl({ ...urlParams, maxPrice: halfPrice }),
          });
        }
      }
    } else if (nq.length >= 1) {
      // Show catalog suggestion even without parsed filters
      const words = nq.split(/\s+/).filter(w => w.length >= 1);
      const matchingProjects = cityProjects.filter(p => {
        const haystack = (p.name + " " + p.maker + " " + (p.tags || "")).toLowerCase();
        return words.every(w => haystack.includes(w));
      });
      const catMatch = categories.find(c => words.some(w => c.name.toLowerCase().includes(w)));
      const label = catMatch ? catMatch.name : (nq.charAt(0).toUpperCase() + nq.slice(1));
      
      if (matchingProjects.length > 0) {
        suggestions.push({
          label,
          sub: `${matchingProjects.length} ${matchingProjects.length === 1 ? "проект" : matchingProjects.length < 5 ? "проекта" : "проектов"} в каталоге`,
          url: buildCatalogUrl({ q: nq }),
        });
      }
    }

    let filteredProjects;
    if (hasFilters) {
      filteredProjects = filterProjects(filters, cityProjects)
        .sort(compareProjectTechnologyPriority)
        .slice(0, 3);
    } else {
      const words = nq.split(/\s+/).filter(w => w.length >= 1);
      const rawWords = rawQ.split(/\s+/).filter(w => w.length >= 1);
      filteredProjects = cityProjects.filter(p => {
        const haystack = (p.name + " " + p.maker + " " + (p.tags || "")).toLowerCase();
        return words.some(w => haystack.includes(w)) || rawWords.some(w => haystack.includes(w));
      }).sort(compareProjectTechnologyPriority).slice(0, 4);
    }

    const catWords = (hasFilters ? filters.textQuery : nq).split(/\s+/).filter(w => w.length >= 1);
    const rawCatWords = rawQ.split(/\s+/).filter(w => w.length >= 1);
    const allSearchWords = [...new Set([...catWords, ...rawCatWords])];
    
    const matchedCategories = !hasFilters && allSearchWords.length > 0
      ? categories.filter(c => allSearchWords.some(w => c.name.toLowerCase().includes(w))).slice(0, 3)
      : [];

    const matchedManufacturers = allSearchWords.length > 0
      ? cityManufacturers.filter(m => allSearchWords.some(w => m.name.toLowerCase().includes(w) || m.location.toLowerCase().includes(w))).slice(0, 3)
      : [];

    const normalizedRegionWords = nq.split(/\s+/).filter(Boolean);
    const rawRegionWords = rawQ.split(/\s+/).filter(Boolean);
    const matchedRegions = !hasFilters && normalizedRegionWords.length > 0
      ? deliveryRegions
        .filter((region) => (
          normalizedRegionWords.every((word) => region.searchText.includes(word))
          || rawRegionWords.every((word) => region.searchText.includes(word))
        ))
        .slice(0, 5)
      : [];

    return {
      suggestions,
      regions: matchedRegions,
      projects: filteredProjects,
      categories: matchedCategories,
      manufacturers: matchedManufacturers,
      articles: [] as { title: string; tag: string }[],
      hasFilters,
    };
  }, [query, city]);

  const hasResults = results.suggestions.length + results.regions.length + results.projects.length + results.categories.length + results.manufacturers.length + results.articles.length > 0;

  // Desktop: click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    onFocusChange?.(focused || mobileOpen);
  }, [focused, mobileOpen, onFocusChange]);

  const restoreBodyScrollLock = () => {
    if (!bodyScrollLockedRef.current) return;
    if (previousBodyOverflowRef.current) {
      document.body.style.overflow = previousBodyOverflowRef.current;
    } else {
      document.body.style.removeProperty("overflow");
    }
    if (previousHtmlOverflowRef.current) {
      document.documentElement.style.overflow = previousHtmlOverflowRef.current;
    } else {
      document.documentElement.style.removeProperty("overflow");
    }
    bodyScrollLockedRef.current = false;
    previousBodyOverflowRef.current = "";
    previousHtmlOverflowRef.current = "";
  };

  const deactivateMobileSearch = (afterClose?: () => void) => {
    inputRef.current?.blur();
    mobileInputRef.current?.blur();
    if (openFrameRef.current !== null) {
      cancelAnimationFrame(openFrameRef.current);
      openFrameRef.current = null;
    }
    flushSync(() => {
      restoreBodyScrollLock();
      setFocused(false);
      setMobileOpen(false);
    });
    if (afterClose) {
      openFrameRef.current = requestAnimationFrame(afterClose);
    } else {
      openFrameRef.current = requestAnimationFrame(() => mobileTriggerRef.current?.focus());
    }
  };

  const handleSelect = (path: string) => {
    if (query.trim()) {
      const updated = [query.trim(), ...searchHistory.filter(h => h !== query.trim())].slice(0, 10);
      setSearchHistory(updated);
      localStorage.setItem("search_history", JSON.stringify(updated));
    }
    updateQuery("");
    deactivateMobileSearch(() => {
      navigate(path);
    });
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem("search_history");
  };

  const handleMobileClose = () => {
    deactivateMobileSearch();
    updateQuery("");
  };

  useEffect(() => {
    if (!mobileOpen) return;

    const handleDialogKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setFocused(false);
        setMobileOpen(false);
        setQuery("");
        onQueryChange?.("");
        requestAnimationFrame(() => mobileTriggerRef.current?.focus());
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = Array.from(
        mobileDialogRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleDialogKeyDown);
    return () => document.removeEventListener("keydown", handleDialogKeyDown);
  }, [mobileOpen, onQueryChange]);

  // Get matching quick suggestion chips based on current query
  const chips = useMemo(() => {
    const nq = normalizeQuery(query);
    if (!nq) return [];
    for (const [key, values] of Object.entries(quickSuggestions)) {
      if (nq.includes(key)) return values;
    }
    return [];
  }, [query]);

  const renderResults = () => (
    <>
      {results.suggestions.length > 0 && (
        <section className="px-4 pt-5 md:px-5">
          <h2 className="mb-2 text-[20px] font-semibold leading-tight text-foreground">В каталоге</h2>
          <div className="space-y-1">
            {results.suggestions.map((s, i) => (
              <button key={i} onClick={() => handleSelect(s.url)} className="group flex min-h-14 w-full items-center gap-3 rounded-[3px] px-3 py-3 text-left transition-colors hover:bg-secondary focus-visible:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30">
                <div className="min-w-0 flex-1">
                  <div className="text-[16px] font-medium leading-snug text-foreground">{s.label}</div>
                  <div className="mt-0.5 text-[13px] leading-snug text-muted-foreground">{s.sub}</div>
                </div>
                <ChevronRight className="h-[18px] w-[18px] shrink-0 text-muted-foreground transition-colors group-hover:text-primary group-focus-visible:text-primary" strokeWidth={1.7} aria-hidden />
              </button>
            ))}
          </div>
        </section>
      )}

      {results.regions.length > 0 && (
        <section className="px-4 pt-6 md:px-5">
          <h2 className="mb-2 text-[20px] font-semibold leading-tight text-foreground">Регионы доставки</h2>
          <div className="space-y-1">
            {results.regions.map((region) => (
              <button key={region.slug} onClick={() => handleSelect(getRegionPath(region.slug))} className="group flex min-h-14 w-full items-center gap-3 rounded-[3px] px-3 py-3 text-left transition-colors hover:bg-secondary focus-visible:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30">
                <MapPin className="h-[18px] w-[18px] shrink-0 text-muted-foreground" strokeWidth={1.7} aria-hidden />
                <div className="min-w-0 flex-1">
                  <div className="text-[16px] leading-snug text-foreground">{region.name}</div>
                  <div className="mt-0.5 text-[13px] leading-snug text-muted-foreground">{region.type}</div>
                </div>
                <ChevronRight className="h-[18px] w-[18px] shrink-0 text-muted-foreground transition-colors group-hover:text-primary group-focus-visible:text-primary" strokeWidth={1.7} aria-hidden />
              </button>
            ))}
          </div>
        </section>
      )}

      {results.projects.length > 0 && (
        <section className="px-4 pt-6 md:px-5">
          <h2 className="mb-2 text-[20px] font-semibold leading-tight text-foreground">Проекты</h2>
          <div className="space-y-1">
            {results.projects.map((p) => (
              <button key={p.id} onClick={() => handleSelect(p.path)} className="group flex min-h-14 w-full items-center gap-3 rounded-[3px] px-3 py-3 text-left transition-colors hover:bg-secondary focus-visible:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30">
                <div className="min-w-0 flex-1">
                  <div className="text-[16px] leading-snug text-foreground">{p.name}</div>
                  <div className="mt-0.5 text-[13px] leading-snug text-muted-foreground">{p.maker} · {p.area} · {p.price}</div>
                </div>
                <ChevronRight className="h-[18px] w-[18px] shrink-0 text-muted-foreground transition-colors group-hover:text-primary group-focus-visible:text-primary" strokeWidth={1.7} aria-hidden />
              </button>
            ))}
          </div>
        </section>
      )}

      {results.categories.length > 0 && (
        <section className="px-4 pt-6 md:px-5">
          <h2 className="mb-2 text-[20px] font-semibold leading-tight text-foreground">Категории</h2>
          <div className="space-y-1">
            {results.categories.map((cat) => (
              <button key={cat.slug} onClick={() => handleSelect(cat.href)} className="group flex min-h-14 w-full items-center gap-3 rounded-[3px] px-3 py-3 text-left transition-colors hover:bg-secondary focus-visible:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30">
                <LayoutGrid className="h-[18px] w-[18px] shrink-0 text-muted-foreground" strokeWidth={1.7} aria-hidden />
                <span className="min-w-0 flex-1 text-[16px] leading-snug text-foreground">{cat.name}</span>
                <ChevronRight className="h-[18px] w-[18px] shrink-0 text-muted-foreground transition-colors group-hover:text-primary group-focus-visible:text-primary" strokeWidth={1.7} aria-hidden />
              </button>
            ))}
          </div>
        </section>
      )}

      {results.manufacturers.length > 0 && (
        <section className="px-4 pt-6 md:px-5">
          <h2 className="mb-2 text-[20px] font-semibold leading-tight text-foreground">Производители</h2>
          <div className="space-y-1">
            {results.manufacturers.map((m) => (
              <button key={m.id} onClick={() => handleSelect(getManufacturerPath(m.id))} className="group flex min-h-[68px] w-full items-center gap-3 rounded-[3px] px-3 py-2.5 text-left transition-colors hover:bg-secondary focus-visible:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30">
                <ManufacturerLogo manufacturer={manufacturerRegistry[m.id]} className="h-11 w-11 shrink-0 text-[9px]" />
                <div className="min-w-0 flex-1">
                  <div className="text-[16px] leading-snug text-foreground">{m.name}</div>
                  <div className="mt-0.5 text-[13px] leading-snug text-muted-foreground">{m.location}</div>
                </div>
                <ChevronRight className="h-[18px] w-[18px] shrink-0 text-muted-foreground transition-colors group-hover:text-primary group-focus-visible:text-primary" strokeWidth={1.7} aria-hidden />
              </button>
            ))}
          </div>
        </section>
      )}

      {results.articles.length > 0 && (
        <section className="px-4 pb-6 pt-6 md:px-5">
          <h2 className="mb-2 text-[20px] font-semibold leading-tight text-foreground">Журнал</h2>
          <div className="space-y-1">
            {results.articles.map((a) => (
              <button key={a.title} onClick={() => handleSelect("/categories/")} className="group flex min-h-14 w-full items-center gap-3 rounded-[3px] px-3 py-3 text-left transition-colors hover:bg-secondary focus-visible:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30">
                <FileText className="h-[18px] w-[18px] shrink-0 text-muted-foreground" strokeWidth={1.7} aria-hidden />
                <div className="min-w-0 flex-1">
                  <div className="text-[16px] leading-snug text-foreground">{a.title}</div>
                  <div className="mt-0.5 text-[13px] leading-snug text-muted-foreground">{a.tag}</div>
                </div>
                <ChevronRight className="h-[18px] w-[18px] shrink-0 text-muted-foreground transition-colors group-hover:text-primary group-focus-visible:text-primary" strokeWidth={1.7} aria-hidden />
              </button>
            ))}
          </div>
        </section>
      )}

      {query.length > 0 && !hasResults && (
        <div className="px-7 py-12 text-center">
          <h2 className="text-[20px] font-semibold text-foreground">Ничего не нашли</h2>
          <p className="mx-auto mt-2 max-w-[320px] text-[15px] leading-relaxed text-muted-foreground">Попробуйте изменить запрос или указать меньше параметров.</p>
        </div>
      )}
    </>
  );

  // ==================== MOBILE FULLSCREEN ====================
  if (mobileOpen) {
    return (
      <>
        {/* Placeholder to keep header layout */}
        <div className={`relative ${className}`}>
          <div className="w-full h-12 rounded-[var(--radius)]" />
        </div>

        {/* Render outside sticky/header stacking contexts so the search always covers the site header. */}
        {createPortal(<div ref={mobileDialogRef} className="fixed inset-0 z-[200] flex h-[100dvh] max-h-[100dvh] flex-col bg-background text-foreground" role="dialog" aria-modal="true" aria-label="Поиск по сайту">
          <div className="shrink-0 bg-background px-4 pb-3 pt-[max(env(safe-area-inset-top),12px)]">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 z-10 h-[18px] w-[18px] -translate-y-1/2 text-muted-foreground" strokeWidth={1.7} aria-hidden />
                <input
                  ref={mobileInputRef}
                  type="search"
                  enterKeyHint="search"
                  inputMode="search"
                  value={query}
                  onChange={(e) => updateQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && query.trim()) {
                      handleSelect(buildCatalogUrl({ q: query.trim() }));
                    }
                  }}
                  placeholder="Поиск на многоместа.рф"
                  autoFocus
                  aria-label="Поиск по сайту"
                  className="h-12 w-full rounded-[3px] border border-border bg-background pl-11 pr-12 text-[16px] font-normal text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10 [&::-webkit-search-cancel-button]:appearance-none"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => updateQuery("")}
                    className="absolute right-0.5 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-[3px] text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                    aria-label="Очистить поиск"
                  >
                    <X className="h-4 w-4" strokeWidth={1.7} aria-hidden />
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={handleMobileClose}
                className="min-h-11 shrink-0 rounded-[3px] px-2 text-[14px] font-medium text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                aria-label="Закрыть поиск"
              >
                Отменить
              </button>
            </div>
          </div>

          {/* Results area */}
          <div className="flex-1 overflow-y-auto">
            {/* Empty state: popular searches */}
            {!query.trim() && (
              <div className="px-4 pb-8 pt-5">
                {searchHistory.length > 0 && (
                  <section>
                    <div className="mb-2 flex items-center justify-between gap-4 px-3">
                      <h2 className="text-[20px] font-semibold leading-tight text-foreground">Недавние запросы</h2>
                      <button type="button" onClick={clearHistory} className="min-h-11 shrink-0 rounded-[3px] px-2 text-[14px] font-medium text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30">Очистить</button>
                    </div>
                    <div className="space-y-1">
                      {searchHistory.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => updateQuery(s)}
                          className="group flex min-h-14 w-full items-center gap-3 rounded-[3px] px-3 py-3 text-left transition-colors hover:bg-secondary focus-visible:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                        >
                          <Clock className="h-[18px] w-[18px] shrink-0 text-muted-foreground" strokeWidth={1.7} aria-hidden />
                          <span className="min-w-0 flex-1 text-[16px] leading-snug text-foreground">{s}</span>
                          <ChevronRight className="h-[18px] w-[18px] shrink-0 text-muted-foreground transition-colors group-hover:text-primary group-focus-visible:text-primary" strokeWidth={1.7} aria-hidden />
                        </button>
                      ))}
                    </div>
                  </section>
                )}

                <section className={searchHistory.length > 0 ? "mt-7" : ""}>
                  <h2 className="mb-2 px-3 text-[20px] font-semibold leading-tight text-foreground">Популярные запросы</h2>
                  <div className="space-y-1">
                    {popularSearches.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => updateQuery(s)}
                        className="group flex min-h-14 w-full items-center rounded-[3px] px-3 py-3 text-left transition-colors hover:bg-secondary focus-visible:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                      >
                        <span className="min-w-0 flex-1 text-[16px] leading-snug text-foreground">{s}</span>
                        <ChevronRight className="h-[18px] w-[18px] shrink-0 text-muted-foreground transition-colors group-hover:text-primary group-focus-visible:text-primary" strokeWidth={1.7} aria-hidden />
                      </button>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {query.trim() && renderResults()}
          </div>
        </div>, document.body)}
      </>
    );
  }

  // ==================== DEFAULT (INLINE) ====================
  if (iconOnly) {
    return (
      <button
        ref={mobileTriggerRef}
        type="button"
        className="flex h-11 w-11 items-center justify-center rounded-[3px] text-muted-foreground transition-colors hover:bg-secondary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 md:hidden"
        onClick={() => setMobileOpen(true)}
        aria-label="Открыть поиск"
      >
        <Search className="h-[18px] w-[18px]" strokeWidth={1.7} aria-hidden />
      </button>
    );
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.7} aria-hidden />

      {/* Mobile: tap opens fullscreen */}
      <button
        ref={mobileTriggerRef}
        type="button"
        className={`h-12 w-full truncate rounded-[3px] pl-9 text-left text-[16px] font-normal focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 md:hidden ${showFilterButton ? "pr-12" : "pr-9"} ${query ? "text-foreground" : "text-muted-foreground"} ${inputClassName}`}
        onClick={() => setMobileOpen(true)}
        aria-label="Открыть поиск"
      >
        {query || "Поиск на многоместа.рф"}
      </button>
      {showFilterButton && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onFilterClick?.(); }}
          className="absolute right-0.5 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-[3px] text-muted-foreground transition-colors hover:bg-secondary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 md:hidden"
          aria-label="Открыть фильтры"
        >
          <SlidersHorizontal className={`h-[18px] w-[18px] ${hasActiveFilters ? "text-primary" : "text-muted-foreground"}`} strokeWidth={1.7} aria-hidden />
        </button>
      )}

      {/* Desktop: real input + find button */}
      <div className="hidden md:flex items-center gap-0 relative">
        <input
          ref={inputRef}
          type="search"
          inputMode="search"
          enterKeyHint="search"
          aria-label="Поиск по сайту"
          value={query}
          onChange={(e) => updateQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && query.trim()) {
              handleSelect(buildCatalogUrl({ q: query.trim() }));
            }
          }}
          placeholder="Поиск на многоместа.рф"
          className={`h-12 w-full rounded-[3px] pl-9 pr-24 text-[16px] font-normal text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 [&::-webkit-search-cancel-button]:appearance-none ${inputClassName}`}
        />
        {query && (
          <button
            type="button"
            onClick={() => { updateQuery(""); }}
            className="absolute right-[96px] top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-[var(--radius)] bg-transparent text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            aria-label="Очистить поиск"
          >
            <X className="h-4 w-4" strokeWidth={1.7} aria-hidden />
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            if (query.trim()) {
              handleSelect(buildCatalogUrl({ q: query.trim() }));
            }
          }}
          className="absolute right-1.5 top-1/2 z-10 h-9 -translate-y-1/2 rounded-[var(--radius)] bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Найти
        </button>
      </div>

      {/* Desktop dropdown */}
      {showDropdown && (
        <div className="hidden md:block absolute top-full left-0 right-0 mt-1 bg-card rounded-[var(--radius)] shadow-lg border border-border max-h-[60vh] overflow-y-auto z-50">
          {renderResults()}
        </div>
      )}
    </div>
  );
};

export default SearchDropdown;
