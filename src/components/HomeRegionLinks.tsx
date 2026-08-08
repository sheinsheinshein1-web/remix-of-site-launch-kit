import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { regions } from "@/data/regions";
import { projects } from "@/data/projects";

const MOBILE_VISIBLE_REGIONS = 8;

const projectPlural = (count: number) => {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return "проект";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "проекта";
  return "проектов";
};

const makerPlural = (count: number) => {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return "производитель";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "производителя";
  return "производителей";
};

const HomeRegionLinks = () => {
  const [showAllMobileRegions, setShowAllMobileRegions] = useState(false);

  const regionLinks = regions
    .map((region) => {
      const cityValues = region.cityValues ?? [region.cityValue];
      const regionProjects = projects.filter((project) => cityValues.includes(project.city));
      const makersCount = new Set(regionProjects.map((project) => project.maker.id).filter(Boolean)).size;

      return {
        ...region,
        projectsCount: regionProjects.length,
        makersCount,
      };
    })
    .filter((region) => region.projectsCount > 0)
    .sort((a, b) => b.projectsCount - a.projectsCount || a.cityValue.localeCompare(b.cityValue, "ru"));

  return (
    <section className="mx-auto w-full max-w-[1400px] px-4 pb-4 pt-12 sm:px-8 sm:pt-16 lg:px-12">
      <div className="mb-4 sm:mb-5">
        <h2 className="text-[11px] md:text-[12px] font-semibold uppercase tracking-[0.16em] text-[#342d27]">
          География каталога
        </h2>
      </div>

      <div className="grid md:grid-cols-[0.82fr_1.18fr] gap-8 md:gap-14 pb-8 md:pb-10">
        <div className="max-w-[460px]">
          <h3 className="text-[24px] md:text-[34px] leading-[1.05] font-medium tracking-[-0.01em] text-[#342d27]">
            Проекты с учётом доставки и монтажа в вашем регионе.
          </h3>
          <p className="mt-4 text-[13px] md:text-[15px] leading-relaxed text-muted-foreground">
            Региональные страницы помогают сравнить производителей, цены и сроки там, где дом реально можно заказать.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:gap-x-10">
          {regionLinks.map((region, index) => (
            <Link
              key={region.slug}
              to={`/region/${region.slug}`}
              className={`group min-h-[56px] md:min-h-[60px] border-b border-[#dfe5f5] items-center justify-between gap-5 transition-colors hover:border-primary/50 ${
                index >= MOBILE_VISIBLE_REGIONS && !showAllMobileRegions ? "hidden md:flex" : "flex"
              }`}
            >
              <span className="text-[14px] md:text-[16px] font-medium leading-tight text-[#342d27] transition-colors group-hover:text-primary">
                {region.cityValue}
              </span>
              <span className="shrink-0 text-right uppercase leading-snug text-muted-foreground">
                <span className="block text-[10px] md:text-[11px] tracking-[0.14em]">
                  {region.projectsCount} {projectPlural(region.projectsCount)}
                </span>
                <span className="block mt-0.5 text-[8px] md:text-[9px] tracking-[0.12em] opacity-70">
                  {region.makersCount} {makerPlural(region.makersCount)}
                </span>
              </span>
            </Link>
          ))}

          {regionLinks.length > MOBILE_VISIBLE_REGIONS && (
            <button
              type="button"
              aria-expanded={showAllMobileRegions}
              onClick={() => setShowAllMobileRegions((value) => !value)}
              className="sm:col-span-2 md:hidden justify-self-start mt-4 inline-flex items-center gap-1.5 py-2 text-left text-[10px] font-semibold uppercase tracking-[0.16em] text-primary transition-colors hover:text-primary/80 focus-visible:outline-none"
            >
              <span>{showAllMobileRegions ? "Скрыть регионы" : "Все регионы"}</span>
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${showAllMobileRegions ? "rotate-180" : ""}`}
                strokeWidth={1.75}
                aria-hidden="true"
              />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default HomeRegionLinks;
