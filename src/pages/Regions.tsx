import { useMemo, useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SiteBreadcrumbs, { siteBreadcrumbPageContainerClassName } from "@/components/SiteBreadcrumbs";
import Seo from "@/components/Seo";
import { projects } from "@/data/projects";
import { regionGroups } from "@/data/regions";
import { REGIONS_PATH, getRegionPath } from "@/lib/siteRoutes";
import { sortGeoItems } from "@/lib/geoOrder";
import { isProjectAvailableInGeo } from "@/lib/geoSelection";

const plural = (count: number, forms: [string, string, string]) => {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms[1];
  return forms[2];
};

type SortValue = "projects" | "name";

const Regions = () => {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortValue>("projects");

  const groupedRegionLinks = useMemo(
    () =>
      regionGroups
        .map((group) => {
          const regionProjects = projects.filter((project) => (
            isProjectAvailableInGeo(project.city, group.region.slug, project.deliveryRegionSlugs)
            && (!group.region.technologyValue || project.technology === group.region.technologyValue)
          ));
          return {
            ...group,
            projectsCount: regionProjects.length,
            makersCount: new Set(regionProjects.map((project) => project.maker.id).filter(Boolean)).size,
          };
        })
        .filter((group) => group.projectsCount > 0),
    [],
  );

  const visibleGroups = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("ru");
    const filtered = groupedRegionLinks
      .map((group) => ({
        ...group,
        visibleCities: normalizedQuery
          ? group.cities.filter((city) => (
            `${city.name} ${group.label} ${(city.searchAliases ?? []).join(" ")}`
              .toLocaleLowerCase("ru")
              .includes(normalizedQuery)
          ))
          : group.cities,
      }))
      .filter((group) => group.visibleCities.length > 0);

    return sortGeoItems(
      filtered,
      (group) => group.region.cityValue,
      (a, b) => {
        if (sortBy === "name") return a.label.localeCompare(b.label, "ru");
        return b.projectsCount - a.projectsCount || a.label.localeCompare(b.label, "ru");
      },
    );
  }, [groupedRegionLinks, query, sortBy]);

  const visibleCitiesCount = visibleGroups.reduce((total, group) => total + group.visibleCities.length, 0);

  return (
    <div className="min-h-screen bg-secondary font-sans">
      <Seo
        title="Модульные дома по регионам России — многоместа.рф"
        description="Все регионы каталога многоместа.рф: проекты модульных домов, производители, цены, доставка и монтаж."
        canonicalPath={REGIONS_PATH}
      />

      <main className="bg-background">
        <Header variant="home" />
        <div className={`${siteBreadcrumbPageContainerClassName} pb-14 sm:pb-20`}>
          <SiteBreadcrumbs items={[{ label: "Главная", to: "/" }, { label: "Регионы" }]} />

          <div className="max-w-[760px]">
            <h1 className="text-[30px] font-semibold leading-[1.08] tracking-[-0.025em] text-[#342d27] md:text-[46px]">
              Регионы доставки
            </h1>
            <p className="mt-4 text-[15px] leading-relaxed text-[#342d27]/65 md:max-w-[720px] md:text-[17px]">
              Выберите город или регион, чтобы увидеть доступные проекты, производителей и актуальные условия доставки.
            </p>
          </div>

          <div className="mt-8 grid gap-3 pb-7 md:mt-10 md:grid-cols-[minmax(280px,1fr)_240px] md:gap-4 md:pb-8">
            <label className="relative block">
              <span className="sr-only">Найти город или регион</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#342d27]/45" strokeWidth={1.7} aria-hidden />
              <input
                type="text"
                inputMode="search"
                role="searchbox"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Город или регион"
                className="h-12 w-full rounded-[var(--radius)] border border-[#d8deed] bg-white pl-11 pr-11 text-[15px] text-[#342d27] outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10 dark:text-foreground"
              />
              {query && (
                <button type="button" onClick={() => setQuery("")} className="absolute right-0 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-[#342d27]/45 transition-colors hover:text-[#342d27]" aria-label="Очистить поиск">
                  <X className="h-4 w-4" aria-hidden />
                </button>
              )}
            </label>

            <label className="relative block">
              <span className="sr-only">Сортировка регионов</span>
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value as SortValue)} className="h-12 w-full cursor-pointer appearance-none rounded-[var(--radius)] border border-[#d8deed] bg-white pl-4 pr-12 text-[15px] text-[#342d27] outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10">
                <option value="projects">Больше проектов</option>
                <option value="name">По алфавиту</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#342d27]" strokeWidth={1.7} aria-hidden />
            </label>
          </div>

          <div className="flex min-h-12 items-center py-4">
            <p className="text-[13px] text-[#342d27]/60 md:text-[14px]">
              Найдено: <span className="font-medium text-[#342d27]">{visibleCitiesCount}</span>
            </p>
          </div>

          {visibleGroups.length > 0 ? (
            <div className="space-y-10 md:space-y-14">
              {visibleGroups.map((group) => (
                <section key={group.slug} aria-labelledby={`region-group-${group.slug}`}>
                  <h2 id={`region-group-${group.slug}`} className="text-[20px] font-semibold tracking-[-0.015em] text-[#342d27] md:text-[24px]">
                    {group.label}
                  </h2>
                  <div className="mt-3 grid sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-3 lg:gap-x-10">
                    {group.visibleCities.map((city) => (
                      <Link
                        key={city.slug}
                        to={getRegionPath(city.slug)}
                        aria-label={`${city.name}: ${group.projectsCount} ${plural(group.projectsCount, ["проект", "проекта", "проектов"])} от ${group.makersCount} ${plural(group.makersCount, ["производителя", "производителей", "производителей"])}`}
                        className="group -mx-3 flex min-h-[86px] flex-col justify-center rounded-[var(--radius)] px-3 py-3 transition-colors duration-200 hover:bg-secondary focus-visible:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                      >
                        <span className="block text-[16px] font-medium leading-tight text-[#342d27] transition-colors duration-200 group-hover:text-primary md:text-[18px]">
                          {city.name}
                        </span>
                        <span className="mt-2 block text-[12px] leading-snug text-[#342d27]/58 md:text-[13px]">
                          {group.projectsCount} {plural(group.projectsCount, ["проект", "проекта", "проектов"])} · {group.makersCount} {plural(group.makersCount, ["производитель", "производителя", "производителей"])}
                        </span>
                      </Link>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <div className="border-t border-[#dfe5f5] py-20 text-center">
              <p className="text-[22px] font-medium text-[#342d27]">Регион не найден</p>
              <p className="mx-auto mt-2 max-w-[440px] text-[14px] leading-relaxed text-[#342d27]/60">Попробуйте изменить название города или очистить поиск.</p>
              <button type="button" onClick={() => setQuery("")} className="mt-5 min-h-11 text-[14px] font-medium text-primary transition-colors hover:text-primary/75">Очистить поиск</button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Regions;
