import { useMemo, useState } from "react";
import { ChevronDown, Heart, Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ManufacturerListItem from "@/components/ManufacturerListItem";
import ProjectCard from "@/components/ProjectCard";
import Seo from "@/components/Seo";
import SiteBreadcrumbs, { siteBreadcrumbPageContainerClassName } from "@/components/SiteBreadcrumbs";
import { useFavorites } from "@/contexts/FavoritesContext";
import { makersById, projects } from "@/data/projects";
import { CATALOG_PATH } from "@/lib/siteRoutes";

type SortValue = "saved" | "popular" | "price-asc" | "price-desc" | "area";

const sortOptions: Array<{ value: SortValue; label: string }> = [
  { value: "saved", label: "Недавно сохранённые" },
  { value: "popular", label: "Популярные" },
  { value: "price-asc", label: "Сначала дешевле" },
  { value: "price-desc", label: "Сначала дороже" },
  { value: "area", label: "По площади" },
];

const getNumber = (value: string) => Number(value.replace(/[^\d]/g, "")) || 0;
const getPrice = (value: string) => {
  const price = getNumber(value);
  return price > 0 ? price : null;
};

const Favorites = () => {
  const { favoriteItems, favoriteMakerItems, favoriteCount } = useFavorites();
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortValue>("saved");

  const favoriteProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("ru");
    const savedOrder = new Map(favoriteItems.map((item, index) => [item.id, index]));
    const favoriteIds = new Set(favoriteItems.map((item) => item.id));

    const filtered = projects.filter((project) => {
      if (!favoriteIds.has(project.id)) return false;
      if (!normalizedQuery) return true;

      return [
        project.name,
        project.maker.name,
        project.city,
        project.badge,
        project.area,
      ].some((value) => value.toLocaleLowerCase("ru").includes(normalizedQuery));
    });

    return filtered.sort((a, b) => {
      if (sortBy === "popular") return b.likes - a.likes || a.name.localeCompare(b.name, "ru");
      if (sortBy === "price-asc") return (getPrice(a.price) ?? Number.POSITIVE_INFINITY) - (getPrice(b.price) ?? Number.POSITIVE_INFINITY) || a.name.localeCompare(b.name, "ru");
      if (sortBy === "price-desc") return (getPrice(b.price) ?? Number.NEGATIVE_INFINITY) - (getPrice(a.price) ?? Number.NEGATIVE_INFINITY) || a.name.localeCompare(b.name, "ru");
      if (sortBy === "area") return (b.area_m2 ?? getNumber(b.area)) - (a.area_m2 ?? getNumber(a.area));
      return (savedOrder.get(b.id) ?? 0) - (savedOrder.get(a.id) ?? 0);
    });
  }, [favoriteItems, query, sortBy]);

  const favoriteManufacturers = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("ru");
    const savedOrder = new Map(favoriteMakerItems.map((makerId, index) => [makerId, index]));

    return favoriteMakerItems
      .map((makerId) => makersById[makerId])
      .filter(Boolean)
      .filter((maker) => !normalizedQuery || `${maker.name} ${maker.city} ${maker.technology}`.toLocaleLowerCase("ru").includes(normalizedQuery))
      .sort((first, second) => (savedOrder.get(second.id) ?? 0) - (savedOrder.get(first.id) ?? 0));
  }, [favoriteMakerItems, query]);

  const visibleFavoritesCount = favoriteProjects.length + favoriteManufacturers.length;

  return (
    <div className="min-h-screen bg-secondary font-sans">
      <Seo
        title="Избранное — многоместа.рф"
        description="Сохранённые проекты модульных домов и производители."
        canonicalPath="/favorites"
        noIndex
      />

      <main className="bg-background">
        <Header variant="home" />

        <div className={`${siteBreadcrumbPageContainerClassName} pb-14 sm:pb-20`}>
          <SiteBreadcrumbs
            items={[{ label: "Главная", to: "/" }, { label: "Избранное" }]}
          />

          <div>
            <div className="max-w-[720px]">
              <h1 className="text-[30px] font-semibold leading-[1.08] tracking-[-0.025em] text-[#342d27] dark:text-foreground md:text-[46px]">
                Избранное
              </h1>
              <p className="mt-4 text-[15px] leading-relaxed text-[#342d27]/65 dark:text-muted-foreground md:max-w-[680px] md:text-[17px]">
                Сохранённые проекты и производители, к которым можно вернуться перед выбором дома.
              </p>
            </div>
          </div>

          {favoriteCount === 0 ? (
            <section className="flex min-h-[430px] flex-col items-start justify-center py-14 md:min-h-[520px] md:items-center md:text-center" aria-labelledby="favorites-empty-heading">
              <Heart className="h-9 w-9 text-[#342d27]/25" strokeWidth={1.4} aria-hidden />
              <h2 id="favorites-empty-heading" className="mt-6 text-[24px] font-semibold tracking-[-0.02em] text-[#342d27] dark:text-foreground md:text-[30px]">
                Пока ничего не сохранено
              </h2>
              <p className="mt-3 max-w-[480px] text-[15px] leading-relaxed text-muted-foreground md:text-[16px]">
                Нажимайте на сердце в карточках проектов и производителей — всё выбранное появится здесь.
              </p>
              <Link
                to={CATALOG_PATH}
                className="mt-7 inline-flex min-h-12 items-center justify-center rounded-[3px] bg-primary px-6 text-[15px] font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                Смотреть проекты
              </Link>
            </section>
          ) : (
            <>
              <div className={`mt-8 grid gap-3 pb-7 md:mt-10 md:gap-4 md:pb-8 ${favoriteItems.length > 0 ? "md:grid-cols-[minmax(260px,1fr)_260px]" : "md:grid-cols-1"}`}>
                <label className="relative block">
                  <span className="sr-only">Поиск в избранном</span>
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.7} aria-hidden />
                  <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Проект или производитель"
                    className="h-12 w-full rounded-[3px] border border-border bg-background pl-11 pr-11 text-[16px] text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10 md:text-[15px]"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery("")}
                      className="absolute right-0 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-[3px] text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                      aria-label="Очистить поиск"
                    >
                      <X className="h-4 w-4" strokeWidth={1.7} aria-hidden />
                    </button>
                  )}
                </label>

                {favoriteItems.length > 0 && (
                  <label className="relative block">
                    <span className="sr-only">Сортировка избранных проектов</span>
                    <select
                      value={sortBy}
                      onChange={(event) => setSortBy(event.target.value as SortValue)}
                      className="h-12 w-full cursor-pointer appearance-none rounded-[3px] border border-border bg-background pl-4 pr-12 text-[15px] text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10"
                    >
                      {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-5 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground" strokeWidth={1.7} aria-hidden />
                  </label>
                )}
              </div>

              <div className="flex min-h-14 items-center justify-between py-4">
                <p className="text-[13px] text-muted-foreground md:text-[14px]">
                  Показано: <span className="font-medium text-foreground">{visibleFavoritesCount}</span>
                </p>
                {query && visibleFavoritesCount === 0 && (
                  <button type="button" onClick={() => setQuery("")} className="min-h-11 text-[14px] font-medium text-primary transition-colors hover:text-primary/75">
                    Очистить поиск
                  </button>
                )}
              </div>

              {visibleFavoritesCount > 0 ? (
                <div className="space-y-12 md:space-y-16">
                  {favoriteProjects.length > 0 && (
                    <section aria-labelledby="favorite-projects-heading">
                      <h2 id="favorite-projects-heading" className="mb-6 text-[22px] font-semibold tracking-[-0.015em] text-foreground md:text-[28px]">
                        Проекты
                      </h2>
                      <div className="grid grid-cols-2 gap-x-2 gap-y-8 sm:gap-x-4 md:gap-y-10">
                        {favoriteProjects.map((project) => (
                          <ProjectCard
                            key={project.id}
                            projectId={project.id}
                            height="aspect-[4/3] h-auto md:aspect-[5/4]"
                          />
                        ))}
                      </div>
                    </section>
                  )}

                  {favoriteManufacturers.length > 0 && (
                    <section aria-labelledby="favorite-manufacturers-heading">
                      <h2 id="favorite-manufacturers-heading" className="mb-3 text-[22px] font-semibold tracking-[-0.015em] text-foreground md:mb-4 md:text-[28px]">
                        Производители
                      </h2>
                      <div className="grid sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-3 lg:gap-x-10">
                        {favoriteManufacturers.map((maker) => (
                          <ManufacturerListItem key={maker.id} makerId={maker.id} />
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              ) : (
                <section className="flex min-h-[340px] flex-col items-start justify-center py-12" aria-labelledby="favorites-search-empty-heading">
                  <h2 id="favorites-search-empty-heading" className="text-[22px] font-semibold tracking-[-0.015em] text-foreground md:text-[26px]">
                    Ничего не найдено
                  </h2>
                  <p className="mt-2 max-w-[440px] text-[15px] leading-relaxed text-muted-foreground">
                    Попробуйте изменить название проекта или производителя.
                  </p>
                </section>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Favorites;
