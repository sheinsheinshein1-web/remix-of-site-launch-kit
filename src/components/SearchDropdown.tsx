import { useState, useRef, useEffect, useMemo } from "react";
import { Search, X, Home, Factory, FileText, LayoutGrid, ArrowRight, ChevronRight, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { manufacturers as dataManufacturers, projects as dataProjects } from "@/data/projects";
import { useCity } from "@/components/CitySelector";

// Поиск всегда строится из единого источника правды src/data/projects.ts.
const allProjects = dataProjects.map((p) => ({
  id: p.id,
  name: p.name,
  maker: p.maker.name,
  city: p.city,
  price: p.price,
  area: p.area,
  beds: p.beds,
  baths: p.baths,
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

const categories = [
  { name: "Дома", slug: "houses" },
  { name: "Каркасные дома", slug: "frame" },
  { name: "Модульные дома", slug: "modular" },
];

const allManufacturers = dataManufacturers.map((m) => ({ name: m.name, location: m.location }));

// Quick suggestion chips shown when query has text
const quickSuggestions: Record<string, string[]> = {
  "дом": ["под ключ", "для семьи", "с террасой", "до 5 млн", "большой", "одноэтажный"],
  "модуль": ["для жизни", "под ключ", "с отделкой", "скандинавский"],
  "каркас": ["la rus", "пермь", "для семьи", "с террасой"],
  "barn": ["barn house", "недорогой"],
  "bear": ["bear house 45", "bear house 77", "bear house 86", "bear house 134", "bear house 168"],
  "vast": ["vast house 140"],
  "wide": ["wide house"],
  "la ru": ["la rus 45", "la rus 75", "la rus 100", "la rus 120", "la rus 127"],
  "larus": ["la rus 45", "la rus 75", "la rus 100", "la rus 120", "la rus 127"],
  "глезман": ["la rus 45", "la rus 75", "la rus 100", "la rus 120", "la rus 127"],
  "пермь": ["la rus", "диво", "каркасный дом", "модульный дом"],
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
  "каркасый": "каркасный", "керкасный": "каркасный",
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
    ...articlesList.flatMap(a => [a.title]),
    "модульный", "модульные", "модульного", "дом", "дома", "дому",
    "спальня", "спальни", "спальнями", "спален",
    "комната", "комнаты", "комнатный", "комнатные",
    "баня", "бани", "баню", "глэмпинг",
    "каркасный", "каркасные", "терраса", "террасой",
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

interface ParsedFilters {
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

function parseFilters(raw: string): ParsedFilters {
  let q = normalizeQuery(raw);
  const filters: ParsedFilters = { textQuery: "" };

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

function filterProjects(filters: ParsedFilters) {
  return projects.filter(p => {
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

  const showDropdown = focused && query.length > 0;

  // Lock body scroll when mobile fullscreen is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [mobileOpen]);

  // Auto-focus mobile input when opened
  useEffect(() => {
    if (mobileOpen) {
      setTimeout(() => mobileInputRef.current?.focus(), 50);
    }
  }, [mobileOpen]);

  const buildCatalogUrl = (params: Record<string, string | number>) => {
    const sp = new URLSearchParams();
    // Always pass the raw query so the catalog input shows it
    if (query.trim() && !params.q) sp.set("q", query.trim());
    Object.entries(params).forEach(([k, v]) => sp.set(k, String(v)));
    return `/catalog?${sp.toString()}`;
  };

  const results = useMemo(() => {
    const rawQ = query.trim().toLowerCase();
    const nq = normalizeQuery(query.trim());
    if (!nq) return { suggestions: [], projects: [], categories: [], manufacturers: [], articles: [], hasFilters: false };
    const filters = parseFilters(nq);
    const hasFilters = filters.beds !== undefined || filters.baths !== undefined || filters.minPrice !== undefined || filters.maxPrice !== undefined || filters.minArea !== undefined || filters.maxArea !== undefined;

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

      const matchCount = filterProjects(filters).length;
      const label = parts.join(", ");

      suggestions.push({
        label: label || "Все проекты",
        sub: `${matchCount} ${matchCount === 1 ? "проект" : matchCount < 5 ? "проекта" : "проектов"} в каталоге`,
        url: buildCatalogUrl(urlParams),
      });

      if (filters.maxPrice && !filters.minPrice) {
        const halfPrice = filters.maxPrice / 2;
        const cheaperCount = filterProjects({ ...filters, maxPrice: halfPrice }).length;
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
      const matchingProjects = projects.filter(p => {
        const haystack = (p.name + " " + p.maker + " " + (p.tags || "")).toLowerCase();
        return words.some(w => haystack.includes(w));
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
      filteredProjects = filterProjects(filters).slice(0, 3);
    } else {
      const words = nq.split(/\s+/).filter(w => w.length >= 1);
      const rawWords = rawQ.split(/\s+/).filter(w => w.length >= 1);
      filteredProjects = projects.filter(p => {
        const haystack = (p.name + " " + p.maker + " " + (p.tags || "")).toLowerCase();
        return words.some(w => haystack.includes(w)) || rawWords.some(w => haystack.includes(w));
      }).slice(0, 4);
    }

    const catWords = (hasFilters ? filters.textQuery : nq).split(/\s+/).filter(w => w.length >= 1);
    const rawCatWords = rawQ.split(/\s+/).filter(w => w.length >= 1);
    const allSearchWords = [...new Set([...catWords, ...rawCatWords])];
    
    const matchedCategories = !hasFilters && allSearchWords.length > 0
      ? categories.filter(c => allSearchWords.some(w => c.name.toLowerCase().includes(w))).slice(0, 3)
      : [];

    const matchedManufacturers = allSearchWords.length > 0
      ? manufacturers.filter(m => allSearchWords.some(w => m.name.toLowerCase().includes(w) || m.location.toLowerCase().includes(w))).slice(0, 3)
      : [];

    const matchedArticles = allSearchWords.length > 0
      ? articlesList.filter(a => allSearchWords.some(w => a.title.toLowerCase().includes(w))).slice(0, 2)
      : [];

    return {
      suggestions,
      projects: filteredProjects,
      categories: matchedCategories,
      manufacturers: matchedManufacturers,
      articles: matchedArticles,
      hasFilters,
    };
  }, [query]);

  const hasResults = results.suggestions.length + results.projects.length + results.categories.length + results.manufacturers.length + results.articles.length > 0;

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

  const handleSelect = (path: string) => {
    if (query.trim()) {
      const updated = [query.trim(), ...searchHistory.filter(h => h !== query.trim())].slice(0, 10);
      setSearchHistory(updated);
      localStorage.setItem("search_history", JSON.stringify(updated));
    }
    updateQuery("");
    setFocused(false);
    setMobileOpen(false);
    navigate(path);
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem("search_history");
  };

  const handleMobileClose = () => {
    setMobileOpen(false);
    updateQuery("");
    setFocused(false);
  };

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
        <div className="px-4 pt-3 pb-1">
          <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-2">Показать в каталоге</div>
          {results.suggestions.map((s, i) => (
            <button key={i} onClick={() => handleSelect(s.url)} className="flex items-center gap-3 w-full py-3 border-b border-border/50 last:border-0">
              <Search className="w-4 h-4 text-muted-foreground/50 shrink-0" />
              <div className="flex-1 text-left min-w-0">
                <div className="text-[14px] font-medium text-foreground">{s.label}</div>
                <div className="text-[12px] text-primary">{s.sub}</div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground/40 shrink-0" />
            </button>
          ))}
        </div>
      )}

      {results.projects.length > 0 && (
        <div className="px-4 pt-2 pb-1">
          <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-2">Проекты</div>
          {results.projects.map((p) => (
            <button key={p.id} onClick={() => handleSelect(`/project/${p.id}`)} className="flex items-center gap-3 w-full py-3 border-b border-border/50 last:border-0">
              <Search className="w-4 h-4 text-muted-foreground/50 shrink-0" />
              <div className="flex-1 text-left min-w-0">
                <div className="text-[14px] text-foreground">{p.name}</div>
                <div className="text-[12px] text-muted-foreground">{p.maker} · {p.area} · {p.price}</div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground/40 shrink-0" />
            </button>
          ))}
        </div>
      )}

      {results.categories.length > 0 && (
        <div className="px-4 pt-2 pb-1">
          <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-2">Категории</div>
          {results.categories.map((cat) => (
            <button key={cat.slug} onClick={() => handleSelect("/catalog")} className="flex items-center gap-3 w-full py-3 border-b border-border/50 last:border-0">
              <LayoutGrid className="w-4 h-4 text-muted-foreground/50 shrink-0" />
              <span className="text-[14px] text-foreground flex-1 text-left">{cat.name}</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground/40 shrink-0" />
            </button>
          ))}
        </div>
      )}

      {results.manufacturers.length > 0 && (
        <div className="px-4 pt-2 pb-1">
          <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-2">Производители</div>
          {results.manufacturers.map((m) => (
            <button key={m.name} onClick={() => handleSelect("/catalog")} className="flex items-center gap-3 w-full py-3 border-b border-border/50 last:border-0">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-[12px] font-semibold text-primary">{m.name.slice(0, 2)}</div>
              <div className="flex-1 text-left min-w-0">
                <div className="text-[14px] text-foreground">{m.name}</div>
                <div className="text-[12px] text-muted-foreground">{m.location}</div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground/40 shrink-0" />
            </button>
          ))}
        </div>
      )}

      {results.articles.length > 0 && (
        <div className="px-4 pt-2 pb-3">
          <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-2">Статьи</div>
          {results.articles.map((a) => (
            <button key={a.title} onClick={() => handleSelect("/categories")} className="flex items-center gap-3 w-full py-3 border-b border-border/50 last:border-0">
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0"><FileText className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} /></div>
              <div className="flex-1 text-left min-w-0">
                <div className="text-[14px] text-foreground">{a.title}</div>
                <div className="text-[12px] text-muted-foreground">{a.tag}</div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground/40 shrink-0" />
            </button>
          ))}
        </div>
      )}

      {query.length > 0 && !hasResults && (
        <div className="px-4 py-8 text-center text-[14px] text-muted-foreground">Ничего не найдено</div>
      )}
    </>
  );

  // ==================== MOBILE FULLSCREEN ====================
  if (mobileOpen) {
    return (
      <>
        {/* Placeholder to keep header layout */}
        <div className={`relative ${className}`}>
          <div className="w-full h-12 rounded-xl" />
        </div>

        {/* Fullscreen overlay */}
        <div className="fixed inset-0 z-[200] bg-background flex flex-col">
          {/* Top bar with search + cancel */}
          <div className="shrink-0 px-3 pt-[max(env(safe-area-inset-top),10px)] pb-2 bg-background border-b border-border/30">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                <input
                  ref={mobileInputRef}
                  type="search"
                  enterKeyHint="search"
                  value={query}
                  onChange={(e) => updateQuery(e.target.value)}
                  placeholder="Поиск на многоместа.рф"
                  autoFocus
                  className="w-full h-11 pl-9 pr-9 rounded-xl text-[16px] font-light text-foreground placeholder:text-muted-foreground focus:outline-none bg-secondary"
                />
                {query && (
                  <button
                    onClick={() => updateQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-muted-foreground/20 flex items-center justify-center z-10"
                  >
                    <X className="w-3 h-3 text-muted-foreground" />
                  </button>
                )}
              </div>
              <button
                onClick={handleMobileClose}
                className="text-[14px] text-primary font-medium shrink-0 px-1"
              >
                Отменить
              </button>
            </div>

          </div>

          {/* Results area */}
          <div className="flex-1 overflow-y-auto">
            {/* Empty state: popular searches */}
            {!query.trim() && (
              <div className="px-4 pt-4">
                {searchHistory.length > 0 && (
                  <>
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Недавние запросы</div>
                      <button onClick={clearHistory} className="text-[12px] text-primary">Очистить</button>
                    </div>
                    {searchHistory.map((s) => (
                      <button
                        key={s}
                        onClick={() => updateQuery(s)}
                        className="flex items-center gap-3 w-full py-3 border-b border-border/50 last:border-0"
                      >
                        <Clock className="w-4 h-4 text-muted-foreground/50 shrink-0" />
                        <span className="text-[14px] text-foreground flex-1 text-left">{s}</span>
                        <ChevronRight className="w-4 h-4 text-muted-foreground/40 shrink-0" />
                      </button>
                    ))}
                  </>
                )}

                <div className={`text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-3 ${searchHistory.length > 0 ? 'mt-4' : ''}`}>Популярные запросы</div>
                {popularSearches.map((s) => (
                  <button
                    key={s}
                    onClick={() => updateQuery(s)}
                    className="flex items-center gap-3 w-full py-3 border-b border-border/50 last:border-0"
                  >
                    <Search className="w-4 h-4 text-muted-foreground/50 shrink-0" />
                    <span className="text-[14px] text-foreground flex-1 text-left">{s}</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground/40 shrink-0" />
                  </button>
                ))}
              </div>
            )}

            {query.trim() && renderResults()}
          </div>
        </div>
      </>
    );
  }

  // ==================== DEFAULT (INLINE) ====================
  if (iconOnly) {
    return (
      <>
        <button
          className="md:hidden w-9 h-9 rounded-xl bg-secondary flex items-center justify-center"
          onClick={() => setMobileOpen(true)}
        >
          <Search className="w-[18px] h-[18px] text-muted-foreground" />
        </button>
        {mobileOpen && (
          <div className="fixed inset-0 z-[200] bg-background flex flex-col">
            <div className="shrink-0 px-3 pt-[max(env(safe-area-inset-top),10px)] pb-2 bg-background border-b border-border/30">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                  <input
                    ref={mobileInputRef}
                    type="search"
                    enterKeyHint="search"
                    value={query}
                    onChange={(e) => updateQuery(e.target.value)}
                    placeholder="Поиск на многоместа.рф"
                    autoFocus
                    className="w-full h-11 pl-9 pr-9 rounded-xl text-[16px] font-light text-foreground placeholder:text-muted-foreground focus:outline-none bg-secondary"
                  />
                  {query && (
                    <button
                      onClick={() => updateQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-muted-foreground/20 flex items-center justify-center z-10"
                    >
                      <X className="w-3 h-3 text-muted-foreground" />
                    </button>
                  )}
                </div>
                <button onClick={handleMobileClose} className="text-[14px] text-primary font-medium shrink-0 px-1">Отменить</button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {!query.trim() && (
                <div className="px-4 pt-4">
                  {searchHistory.length > 0 && (
                    <>
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Недавние запросы</div>
                        <button onClick={clearHistory} className="text-[12px] text-primary">Очистить</button>
                      </div>
                      {searchHistory.map((s) => (
                        <button key={s} onClick={() => updateQuery(s)} className="flex items-center gap-3 w-full py-3 border-b border-border/50 last:border-0">
                          <Clock className="w-4 h-4 text-muted-foreground/50 shrink-0" />
                          <span className="text-[14px] text-foreground flex-1 text-left">{s}</span>
                          <ChevronRight className="w-4 h-4 text-muted-foreground/40 shrink-0" />
                        </button>
                      ))}
                    </>
                  )}
                  <div className={`text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-3 ${searchHistory.length > 0 ? 'mt-4' : ''}`}>Популярные запросы</div>
                  {popularSearches.map((s) => (
                    <button key={s} onClick={() => updateQuery(s)} className="flex items-center gap-3 w-full py-3 border-b border-border/50 last:border-0">
                      <Search className="w-4 h-4 text-muted-foreground/50 shrink-0" />
                      <span className="text-[14px] text-foreground flex-1 text-left">{s}</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground/40 shrink-0" />
                    </button>
                  ))}
                </div>
              )}
              {query.trim() && renderResults()}
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />

      {/* Mobile: tap opens fullscreen */}
      <button
        className={`md:hidden w-full h-12 pl-9 ${showFilterButton ? "pr-12" : "pr-9"} rounded-xl text-[16px] font-light text-left focus:outline-none truncate ${query ? "text-foreground" : "text-muted-foreground"} ${inputClassName}`}
        onClick={() => setMobileOpen(true)}
      >
        {query || "Поиск на многоместа.рф"}
      </button>
      {showFilterButton && (
        <button
          onClick={(e) => { e.stopPropagation(); onFilterClick?.(); }}
          className="md:hidden absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={hasActiveFilters ? "text-primary" : "text-muted-foreground"}>
            <line x1="3" y1="8" x2="21" y2="8" /><circle cx="9" cy="8" r="2.5" fill="hsl(var(--background))" />
            <line x1="3" y1="16" x2="21" y2="16" /><circle cx="16" cy="16" r="2.5" fill="hsl(var(--background))" />
          </svg>
          {hasActiveFilters && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary rounded-full border-2 border-background" />
          )}
        </button>
      )}

      {/* Desktop: real input + find button */}
      <div className="hidden md:flex items-center gap-0 relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => updateQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && query.trim()) {
              handleSelect(buildCatalogUrl({ q: query.trim() }));
            }
          }}
          placeholder="Поиск на многоместа.рф"
          className={`w-full h-12 pl-9 pr-24 rounded-xl text-[16px] font-light text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30 ${inputClassName}`}
        />
        {query && (
          <button
            onClick={() => { updateQuery(""); }}
            className="absolute right-[88px] top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-muted-foreground/20 flex items-center justify-center z-10"
          >
            <X className="w-3 h-3 text-muted-foreground" />
          </button>
        )}
        <button
          onClick={() => {
            if (query.trim()) {
              handleSelect(buildCatalogUrl({ q: query.trim() }));
            }
          }}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 h-9 px-5 bg-primary text-primary-foreground text-sm font-medium rounded-xl hover:opacity-90 transition-opacity z-10"
        >
          Найти
        </button>
      </div>

      {/* Desktop dropdown */}
      {showDropdown && (
        <div className="hidden md:block absolute top-full left-0 right-0 mt-1 bg-card rounded-2xl shadow-lg border border-border max-h-[60vh] overflow-y-auto z-50">
          {renderResults()}
        </div>
      )}
    </div>
  );
};

export default SearchDropdown;
