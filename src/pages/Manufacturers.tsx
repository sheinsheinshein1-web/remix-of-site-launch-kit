import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import CitySelector, { useCity } from "@/components/CitySelector";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ManufacturerListItem from "@/components/ManufacturerListItem";
import SiteBreadcrumbs, { siteBreadcrumbPageContainerClassName } from "@/components/SiteBreadcrumbs";
import Seo from "@/components/Seo";
import { getManufacturerRatingSummary } from "@/data/manufacturerRatings";
import { makersById, projects, projectsCountByMakerId } from "@/data/projects";
import { compareWithProjectPriority } from "@/lib/projectPriority";
import {
  ALL_REGIONS_GEO_SLUG,
  getGeoSelectionLabel,
  isAllRegionsGeo,
  isProjectAvailableInGeo,
  normalizeGeoSelection,
} from "@/lib/geoSelection";
import { isVerifiedMaker } from "@/lib/verifiedMakers";
import { MANUFACTURERS_PATH } from "@/lib/siteRoutes";

type SortValue = "rating" | "projects" | "name";
const MOBILE_PAGE_SIZE = 10;

const Manufacturers = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { city: selectedGeo, selectCity, hasExplicitSelection } = useCity();
  const [query, setQuery] = useState("");
  const [regionSelectorOpen, setRegionSelectorOpen] = useState(false);
  const [technology, setTechnology] = useState("all");
  const [sortBy, setSortBy] = useState<SortValue>("rating");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [mobileVisibleCount, setMobileVisibleCount] = useState(MOBILE_PAGE_SIZE);

  useEffect(() => {
    const requestedSort = searchParams.get("sort");
    setQuery(searchParams.get("q") ?? "");
    setTechnology(searchParams.get("tech") ?? "all");
    setSortBy(requestedSort === "projects" || requestedSort === "name" ? requestedSort : "rating");
    setVerifiedOnly(searchParams.get("verified") === "true");
  }, [searchParams]);

  useEffect(() => {
    const requestedRegion = searchParams.get("region");
    if (!requestedRegion) return;

    const normalizedRegion = normalizeGeoSelection(requestedRegion);
    selectCity(normalizedRegion);

    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.delete("region");
    setSearchParams(nextSearchParams, { replace: true });
  }, [searchParams, selectCity, setSearchParams]);

  const region = hasExplicitSelection ? selectedGeo : ALL_REGIONS_GEO_SLUG;

  const makers = useMemo(() => {
    const technologiesByMaker = projects.reduce((acc, project) => {
      const makerId = project.maker.id;
      if (!makerId || !project.technology) return acc;
      const makerTechnologies = acc.get(makerId) ?? new Set<string>();
      makerTechnologies.add(project.technology);
      acc.set(makerId, makerTechnologies);
      return acc;
    }, new Map<string, Set<string>>());

    return Object.values(makersById).map((maker) => ({
        ...maker,
        technologies: [...(technologiesByMaker.get(maker.id) ?? new Set([maker.technology]))],
        projectsCount: projectsCountByMakerId[maker.id] ?? 0,
        reviewSummary: getManufacturerRatingSummary(maker.id),
      }));
  }, []);

  const technologies = useMemo(
    () => [...new Set(makers.flatMap((maker) => maker.technologies))].sort((a, b) => a.localeCompare(b, "ru")),
    [makers],
  );

  const visibleMakers = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("ru");
    const filtered = makers.filter((maker) => {
      const matchesQuery = !normalizedQuery
        || `${maker.name} ${maker.city} ${maker.technologies.join(" ")}`.toLocaleLowerCase("ru").includes(normalizedQuery);
      const matchesRegion = isAllRegionsGeo(region) || projects.some((project) => (
        project.maker.id === maker.id
        && isProjectAvailableInGeo(project.city, region, project.deliveryRegionSlugs)
      ));
      const matchesTechnology = technology === "all" || maker.technologies.includes(technology);
      const matchesVerification = !verifiedOnly || isVerifiedMaker(maker.id);
      return matchesQuery && matchesRegion && matchesTechnology && matchesVerification;
    });

    return filtered.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name, "ru");
      if (sortBy === "projects") {
        return compareWithProjectPriority(
          a,
          b,
          (first, second) => second.projectsCount - first.projectsCount || first.name.localeCompare(second.name, "ru"),
        );
      }

      if (a.reviewSummary.hasReviews !== b.reviewSummary.hasReviews) {
        return Number(b.reviewSummary.hasReviews) - Number(a.reviewSummary.hasReviews);
      }
      if (a.reviewSummary.rating !== b.reviewSummary.rating) {
        return b.reviewSummary.rating - a.reviewSummary.rating;
      }
      if (a.reviewSummary.totalCount !== b.reviewSummary.totalCount) {
        return b.reviewSummary.totalCount - a.reviewSummary.totalCount;
      }
      return compareWithProjectPriority(
        a,
        b,
        (first, second) => second.projectsCount - first.projectsCount || first.name.localeCompare(second.name, "ru"),
      );
    });
  }, [makers, query, region, sortBy, technology, verifiedOnly]);

  useEffect(() => {
    setMobileVisibleCount(MOBILE_PAGE_SIZE);
  }, [query, region, sortBy, technology, verifiedOnly]);

  const filtersChanged = query.length > 0 || region !== "all" || technology !== "all" || verifiedOnly;
  const regionLabel = isAllRegionsGeo(region) ? "Все регионы" : getGeoSelectionLabel(region);
  const handleRegionSelect = (nextRegion: string) => {
    const normalizedRegion = normalizeGeoSelection(nextRegion);
    selectCity(normalizedRegion);
  };
  const resetFilters = () => {
    setQuery("");
    handleRegionSelect(ALL_REGIONS_GEO_SLUG);
    setTechnology("all");
    setVerifiedOnly(false);
  };

  return (
    <div className="min-h-screen bg-secondary font-sans">
      <Seo
        title="Производители домов — многоместа.рф"
        description="Производители модульных домов: отзывы, регионы работы и проекты компаний на многоместа.рф."
        canonicalPath={MANUFACTURERS_PATH}
      />

      <main className="bg-background">
        <Header variant="home" />
        <div className={`${siteBreadcrumbPageContainerClassName} pb-14 sm:pb-20`}>
          <SiteBreadcrumbs items={[{ label: "Главная", to: "/" }, { label: "Производители" }]} />
          <div className="max-w-[720px]">
            <h1 className="text-[30px] font-semibold leading-[1.08] tracking-[-0.025em] text-[#342d27] md:text-[46px]">
              Производители
            </h1>
            <p className="mt-4 text-[15px] leading-relaxed text-[#342d27]/65 md:max-w-[680px] md:text-[17px]">
              Сравнивайте компании по реальным отзывам, регионам доставки и количеству опубликованных проектов.
            </p>
          </div>

          <div className="mt-8 grid gap-3 pb-7 md:mt-10 md:grid-cols-2 md:gap-4 md:pb-8 xl:grid-cols-[minmax(280px,1fr)_220px_190px_220px]">
            <label className="relative block">
              <span className="sr-only">Найти производителя</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#342d27]/45" strokeWidth={1.7} aria-hidden />
              <input
                type="text"
                inputMode="search"
                role="searchbox"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Название или технология"
                className="h-12 w-full rounded-[var(--radius)] border border-[#d8deed] bg-white pl-11 pr-11 text-[15px] text-[#342d27] outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10 dark:text-foreground"
              />
              {query && (
                <button type="button" onClick={() => setQuery("")} className="absolute right-0 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-[#342d27]/45 transition-colors hover:text-[#342d27]" aria-label="Очистить поиск">
                  <X className="h-4 w-4" aria-hidden />
                </button>
              )}
            </label>

            <button
              type="button"
              onClick={() => setRegionSelectorOpen(true)}
              className="relative flex h-12 w-full cursor-pointer items-center rounded-[var(--radius)] border border-[#d8deed] bg-white pl-4 pr-12 text-left text-[15px] text-[#342d27] outline-none transition-colors hover:border-primary/50 hover:text-primary focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/10"
              aria-label={`Регион доставки: ${regionLabel}`}
            >
              <span className="truncate">{regionLabel}</span>
              <ChevronDown className="pointer-events-none absolute right-5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#342d27]" strokeWidth={1.7} aria-hidden />
            </button>

            <label className="relative block">
              <span className="sr-only">Технология производства</span>
              <select value={technology} onChange={(event) => setTechnology(event.target.value)} className="h-12 w-full cursor-pointer appearance-none rounded-[var(--radius)] border border-[#d8deed] bg-white pl-4 pr-12 text-[15px] text-[#342d27] outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10">
                <option value="all">Все технологии</option>
                {technologies.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#342d27]" strokeWidth={1.7} aria-hidden />
            </label>

            <label className="relative block">
              <span className="sr-only">Сортировка</span>
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value as SortValue)} className="h-12 w-full cursor-pointer appearance-none rounded-[var(--radius)] border border-[#d8deed] bg-white pl-4 pr-12 text-[15px] text-[#342d27] outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10">
                <option value="rating">Сначала по рейтингу</option>
                <option value="projects">Больше проектов</option>
                <option value="name">По алфавиту</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#342d27]" strokeWidth={1.7} aria-hidden />
            </label>
          </div>

          <div className="flex min-h-12 items-center justify-between gap-4 py-4">
            <p className="text-[13px] text-[#342d27]/60 md:text-[14px]">
              Найдено: <span className="font-medium text-[#342d27]">{visibleMakers.length}</span>
            </p>
            {filtersChanged && (
              <button type="button" onClick={resetFilters} className="min-h-11 text-[13px] font-medium text-primary transition-colors hover:text-primary/75 md:text-[14px]">
                Сбросить фильтры
              </button>
            )}
          </div>

          {visibleMakers.length > 0 ? (
            <div className="grid sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-3 lg:gap-x-10">
              {visibleMakers.map((maker, index) => (
                <ManufacturerListItem
                  key={maker.id}
                  makerId={maker.id}
                  className={index < mobileVisibleCount ? "flex" : "hidden sm:flex"}
                />
              ))}
            </div>
          ) : (
            <div className="border-t border-[#dfe5f5] py-20 text-center">
              <p className="text-[22px] font-medium text-[#342d27]">Ничего не найдено</p>
              <p className="mx-auto mt-2 max-w-[440px] text-[14px] leading-relaxed text-[#342d27]/60">Попробуйте изменить название, регион или технологию.</p>
              <button type="button" onClick={resetFilters} className="mt-5 min-h-11 text-[14px] font-medium text-primary transition-colors hover:text-primary/75">Сбросить фильтры</button>
            </div>
          )}

          {visibleMakers.length > mobileVisibleCount && (
            <button
              type="button"
              onClick={() => setMobileVisibleCount((current) => current + MOBILE_PAGE_SIZE)}
              className="flex min-h-12 w-full items-center justify-start gap-2 py-4 text-left text-[15px] font-medium text-primary transition-colors hover:text-primary/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 sm:hidden"
            >
              Смотреть ещё
              <ChevronDown className="h-4 w-4" strokeWidth={1.7} aria-hidden />
            </button>
          )}

          <section id="rating-methodology" className="mt-10 scroll-mt-24 pt-10 md:mt-14 md:pt-12" aria-labelledby="rating-methodology-title">
            <div className="max-w-[760px]">
              <h2 id="rating-methodology-title" className="text-[22px] font-semibold leading-tight text-[#342d27] md:text-[28px]">
                Оценки и отзывы
              </h2>
              <p className="mt-4 text-[14px] leading-relaxed text-[#342d27]/65 md:text-[16px]">
                Оценка производителя рассчитывается только по опубликованным отзывам. Если отзывов пока нет, показываем оценку 0,0 и не подставляем рейтинг проектов.
              </p>
              <p className="mt-3 text-[14px] leading-relaxed text-[#342d27]/65 md:text-[16px]">
                Количество проектов и регион производства показаны отдельно. Отметка «Проверено» означает, что данные профиля подтверждены площадкой, но не заменяет самостоятельную проверку реквизитов, договора и гарантий.
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
      <CitySelector
        open={regionSelectorOpen}
        onOpenChange={setRegionSelectorOpen}
        city={region}
        onSelect={handleRegionSelect}
        title="Регион доставки"
        hasExplicitSelection
      />
    </div>
  );
};

export default Manufacturers;
