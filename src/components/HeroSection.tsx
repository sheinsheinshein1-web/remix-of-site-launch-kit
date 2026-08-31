import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { parseSearchFilters } from "@/components/SearchDropdown";
import { CATALOG_PATH, getRegionPath } from "@/lib/siteRoutes";
import { resolveGeoSelection, searchGeoSelections } from "@/lib/geoSelection";
import mobileHeroImage from "@/assets/home-mobile-forest.jpg";
import desktopHeroImage from "@/assets/home-desktop-village-sky.jpg";

// Keep the mobile matte for text contrast; the old desktop diagonal can be restored independently.
const HERO_BLUR_ENABLED = true;
const DESKTOP_DIAGONAL_BLUR_ENABLED = false;

const HeroSection = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  const regionSuggestions = useMemo(
    () => searchGeoSelections(query, 5),
    [query],
  );

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
      <div className="relative overflow-hidden border-b border-[#e4e4e2]">
        <img
          src={mobileHeroImage}
          alt=""
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[760px] w-full object-cover object-center sm:bottom-0 sm:h-full md:hidden"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
        <img
          src={desktopHeroImage}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 hidden h-full w-full object-cover object-center md:block"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
        <div className="pointer-events-none absolute inset-0 hidden bg-[#07110a]/20 md:block" aria-hidden="true" />
        {HERO_BLUR_ENABLED && (
          <div
            className="pointer-events-none absolute inset-x-0 -top-[60px] h-[760px] sm:bottom-0 sm:top-0 sm:h-auto md:hidden"
            style={{
              background: "linear-gradient(180deg, rgba(20, 34, 23, 0.02) 0%, rgba(16, 29, 20, 0.1) 52%, rgba(10, 22, 14, 0.32) 100%)",
              backdropFilter: "blur(18px) brightness(0.69) saturate(0.86)",
              WebkitBackdropFilter: "blur(18px) brightness(0.69) saturate(0.86)",
              maskImage: "linear-gradient(to bottom, transparent 25%, rgba(0, 0, 0, 0.38) 45%, black 68%)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 25%, rgba(0, 0, 0, 0.38) 45%, black 68%)",
            }}
            aria-hidden="true"
          />
        )}
        {DESKTOP_DIAGONAL_BLUR_ENABLED && (
          <div
            className="pointer-events-none absolute inset-0 hidden md:block"
            style={{
              maskImage: "linear-gradient(to bottom, transparent 12%, rgba(0, 0, 0, 0.28) 28%, black 48%)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 12%, rgba(0, 0, 0, 0.28) 28%, black 48%)",
            }}
            aria-hidden="true"
          >
            <div
              className="absolute inset-0"
              style={{
                maskImage: "linear-gradient(68deg, black 0%, black 46%, rgba(0, 0, 0, 0.82) 52%, transparent 66%)",
                WebkitMaskImage: "linear-gradient(68deg, black 0%, black 46%, rgba(0, 0, 0, 0.82) 52%, transparent 66%)",
              }}
            >
              <img
                src={desktopHeroImage}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full scale-[1.035] object-cover object-center blur-[22px] brightness-[0.64] saturate-[0.86]"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,34,23,0.02)_0%,rgba(16,29,20,0.1)_52%,rgba(10,22,14,0.32)_100%)]" />
            </div>
          </div>
        )}
        <div className="relative z-10 mx-auto flex min-h-[700px] w-full max-w-[1400px] flex-col justify-end px-4 py-12 sm:min-h-[760px] sm:px-8 sm:py-16 md:min-h-[640px] md:items-center md:justify-center lg:min-h-[680px] lg:px-12">
          <div className="w-full md:max-w-[900px] md:text-center">
            <h1 className="max-w-[1120px] text-[34px] font-semibold leading-[1.03] tracking-[-0.035em] text-white sm:text-[44px] md:mx-auto md:text-[56px] lg:text-[64px]">
              Найдите свой<br />
              модульный дом
            </h1>

            <p className="mt-6 max-w-[940px] text-[15px] font-normal leading-relaxed text-white/85 md:mx-auto md:mt-8 md:text-[20px]">
              Каталог производителей домов с ценами,
              <br className="hidden md:block" />
              <span className="md:hidden"> </span>
              характеристиками и регионами доставки
            </p>

            <form onSubmit={submitSearch} className="relative mt-8 w-full md:mx-auto md:mt-10 md:max-w-[700px] lg:max-w-[720px]">
            <label className="sr-only" htmlFor="hero-search">Производитель, модель или регион</label>
            <input
              id="hero-search"
              value={query}
              type="search"
              inputMode="search"
              enterKeyHint="search"
              onChange={(event) => setQuery(event.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => window.setTimeout(() => setSearchFocused(false), 120)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  runSearch();
                }
              }}
              className="min-h-14 w-full min-w-0 rounded-[var(--radius)] border border-[#d7d7d4] bg-white py-0 pl-4 pr-[122px] text-[16px] tracking-normal text-[#342d27] outline-none transition-colors placeholder:text-[#94918d] focus:border-primary md:min-h-16 md:pl-6 md:pr-[182px] md:text-[18px]"
              placeholder="Производитель, модель или регион"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 h-11 min-w-[108px] -translate-y-1/2 rounded-[var(--radius)] bg-primary px-6 text-[14px] font-medium tracking-normal text-white transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 md:h-[52px] md:min-w-[160px] md:px-8 md:text-[17px]"
            >
              Поиск
            </button>

            {searchFocused && regionSuggestions.length > 0 && (
              <div
                role="listbox"
                aria-label="Найденные регионы доставки"
                className="absolute left-0 right-0 top-[calc(100%+6px)] z-30 overflow-hidden rounded-[var(--radius)] border border-[#dfe5f5] bg-white py-1 shadow-[0_8px_24px_rgba(31,36,43,0.08)] dark:bg-background"
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

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-white/80 md:mt-6 md:justify-center md:text-[16px]">
              <span>Популярное:</span>
              {popularQueries.map((popularQuery) => (
                <button
                  key={popularQuery.label}
                  type="button"
                  onClick={() => navigate(popularQuery.href)}
                  className="border-b border-white/55 leading-snug transition-colors hover:border-white hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                >
                  {popularQuery.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default HeroSection;
