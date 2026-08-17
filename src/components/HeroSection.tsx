import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { manufacturers, projects } from "@/data/projects";
import { parseSearchFilters } from "@/components/SearchDropdown";
import { geoLocationCount } from "@/data/regions";
import { CATALOG_PATH, getRegionPath } from "@/lib/siteRoutes";
import { resolveGeoSelection, searchGeoSelections } from "@/lib/geoSelection";

const pluralize = (count: number, one: string, few: string, many: string) => {
  const absoluteCount = Math.abs(count) % 100;
  const lastDigit = absoluteCount % 10;

  if (absoluteCount > 10 && absoluteCount < 20) return many;
  if (lastDigit === 1) return one;
  if (lastDigit >= 2 && lastDigit <= 4) return few;
  return many;
};

const HeroSection = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  const regionSuggestions = useMemo(
    () => searchGeoSelections(query, 5),
    [query],
  );

  const projectCount = projects.length;
  const manufacturerCount = manufacturers.length;
  const regionCount = geoLocationCount;
  const technologyCount = new Set(projects.map((project) => project.technology)).size;

  const stats = [
    { value: String(projectCount), label: pluralize(projectCount, "проект дома", "проекта домов", "проектов домов") },
    { value: String(manufacturerCount), label: pluralize(manufacturerCount, "производитель", "производителя", "производителей") },
    { value: String(regionCount), label: pluralize(regionCount, "регион", "региона", "регионов") },
    { value: String(technologyCount), label: pluralize(technologyCount, "технология", "технологии", "технологий") },
  ];

  const runSearch = () => {
    const normalized = query.trim();
    if (!normalized) {
      navigate(CATALOG_PATH);
      return;
    }

    const exactRegion = resolveGeoSelection(normalized);
    if (exactRegion) {
      navigate(getRegionPath(exactRegion.slug));
      return;
    }

    const parsed = parseSearchFilters(normalized);
    const params = new URLSearchParams({ q: normalized });
    if (parsed.minPrice !== undefined) params.set("minPrice", String(parsed.minPrice));
    if (parsed.maxPrice !== undefined) params.set("maxPrice", String(parsed.maxPrice));
    if (parsed.minArea !== undefined) params.set("minArea", String(parsed.minArea));
    if (parsed.maxArea !== undefined) params.set("maxArea", String(parsed.maxArea));
    if (parsed.beds !== undefined) params.set("beds", String(parsed.beds));
    if (parsed.baths !== undefined) params.set("baths", String(parsed.baths));
    navigate(`${CATALOG_PATH}?${params.toString()}`);
  };

  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    runSearch();
  };

  const popularQueries = [
    { label: "barn house", href: `${CATALOG_PATH}?q=barn%20house` },
    { label: "а-фрейм", href: `${CATALOG_PATH}?q=%D0%B0-%D1%84%D1%80%D0%B5%D0%B9%D0%BC` },
    { label: "до 2 млн", href: `${CATALOG_PATH}?maxPrice=2000000` },
    { label: "под ключ", href: `${CATALOG_PATH}?q=%D0%BF%D0%BE%D0%B4%20%D0%BA%D0%BB%D1%8E%D1%87` },
  ];

  return (
    <section className="bg-[radial-gradient(circle_at_82%_20%,rgba(31,36,43,0.055)_0%,rgba(31,36,43,0.016)_30%,transparent_58%),linear-gradient(180deg,#ffffff_0%,#f3f4f6_100%)] pt-[50px] dark:bg-[radial-gradient(circle_at_82%_18%,rgba(255,255,255,0.045)_0%,rgba(255,255,255,0.012)_30%,transparent_58%),linear-gradient(180deg,#0f1115_0%,#181a1e_100%)] md:pt-[116px]">
      <div className="border-b border-[#e4e4e2]">
        <div className="mx-auto flex min-h-[500px] w-full max-w-[1400px] flex-col justify-center px-4 py-14 sm:px-8 sm:py-16 md:min-h-[560px] lg:px-12">
          <h1 className="max-w-[1120px] text-[34px] font-semibold leading-[1.03] tracking-[-0.035em] text-[#171614] sm:text-[44px] md:text-[56px] lg:text-[64px]">
            Модульные дома России<br />
            на одной платформе
          </h1>

          <p className="mt-6 max-w-[940px] text-[15px] font-normal leading-relaxed text-[#595653] md:mt-8 md:text-[20px]">
            Каталог производителей домов с ценами, характеристиками и регионами доставки
          </p>

          <form onSubmit={submitSearch} className="relative mt-8 w-full md:mt-10">
            <label className="sr-only" htmlFor="hero-search">Производитель, модель или регион</label>
            <input
              id="hero-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => window.setTimeout(() => setSearchFocused(false), 120)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  runSearch();
                }
              }}
              className="min-h-14 w-full min-w-0 rounded-[3px] border border-[#d7d7d4] bg-white py-0 pl-4 pr-[122px] text-[14px] tracking-normal text-[#342d27] outline-none transition-colors placeholder:text-[#94918d] focus:border-primary md:min-h-16 md:pl-6 md:pr-[182px] md:text-[18px]"
              placeholder="Производитель, модель или регион"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 h-11 min-w-[108px] -translate-y-1/2 rounded-[3px] bg-primary px-6 text-[14px] font-medium tracking-normal text-white transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 md:h-[52px] md:min-w-[160px] md:px-8 md:text-[17px]"
            >
              Поиск
            </button>

            {searchFocused && regionSuggestions.length > 0 && (
              <div
                role="listbox"
                aria-label="Найденные регионы доставки"
                className="absolute left-0 right-0 top-[calc(100%+6px)] z-30 overflow-hidden rounded-[3px] border border-[#dfe5f5] bg-white py-1 shadow-[0_8px_24px_rgba(31,36,43,0.08)] dark:bg-background"
              >
                {regionSuggestions.map((region) => (
                  <button
                    key={region.slug}
                    type="button"
                    role="option"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => navigate(getRegionPath(region.slug))}
                    className="flex min-h-14 w-full items-center justify-between gap-4 px-4 py-3 text-left transition-colors hover:bg-secondary hover:text-primary focus-visible:bg-secondary focus-visible:text-primary focus-visible:outline-none md:px-6"
                  >
                    <span className="text-[14px] font-medium md:text-[16px]">{region.name}</span>
                    <span className="shrink-0 text-[12px] font-normal text-muted-foreground md:text-[13px]">
                      {region.deliveryArea ? "Регион доставки" : "Город доставки"}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </form>

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-[#595653] md:mt-6 md:text-[16px]">
            <span>Популярное:</span>
            {popularQueries.map((popularQuery) => (
              <button
                key={popularQuery.label}
                type="button"
                onClick={() => navigate(popularQuery.href)}
                className="border-b border-[#bcb9b5] leading-snug transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
              >
                {popularQuery.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="border-b border-[#dfe5f5] bg-transparent">
        <div className="mx-auto grid w-full max-w-[1400px] grid-cols-2 font-sans md:grid-cols-4">
          {stats.map((stat, index) => (
            <button
              key={stat.label}
              type="button"
              onClick={() => navigate(index === 1 ? "/partner" : CATALOG_PATH)}
              className="group flex min-h-[88px] flex-col items-start justify-center gap-1.5 border-b border-r border-[#dfe5f5] px-5 text-left font-sans transition-colors last:border-r-0 hover:bg-white/70 dark:hover:bg-primary/10 md:min-h-[104px] md:gap-2 md:border-b-0 md:px-9 lg:px-12"
            >
              <span className="block text-[24px] font-medium leading-none tracking-[-0.02em] text-[#3a332d] transition-colors group-hover:text-primary md:text-[30px]">
                {stat.value}
              </span>
              <span className="block text-[12px] font-medium tracking-normal text-[#717b8e] md:text-[14px]">
                {stat.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
