import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { regions } from "@/data/regions";
import { REGIONS_PATH, getRegionPath } from "@/lib/siteRoutes";
import { projects } from "@/data/projects";
import { getCityDisplayName } from "@/lib/cityDisplay";
import { sortGeoItems } from "@/lib/geoOrder";
import { isProjectAvailableInGeo } from "@/lib/geoSelection";

const MOBILE_VISIBLE_REGIONS = 8;
const DESKTOP_VISIBLE_REGIONS = 16;

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
  if (mod10 === 1 && mod100 !== 11) return "производителя";
  return "производителей";
};

const HomeRegionLinks = () => {
  const regionLinks = sortGeoItems(
    regions
      .map((region) => {
        const regionProjects = projects.filter((project) => (
          isProjectAvailableInGeo(project.city, region.slug, project.deliveryRegionSlugs)
        ));
        const makersCount = new Set(regionProjects.map((project) => project.maker.id).filter(Boolean)).size;

        return {
          ...region,
          projectsCount: regionProjects.length,
          makersCount,
        };
      })
      .filter((region) => region.projectsCount > 0),
    (region) => region.cityValue,
    (a, b) => b.projectsCount - a.projectsCount || a.cityValue.localeCompare(b.cityValue, "ru"),
  )
    .slice(0, DESKTOP_VISIBLE_REGIONS);

  return (
    <section id="regions" className="mx-auto w-full max-w-[1400px] scroll-mt-24 px-4 pb-6 pt-12 sm:px-8 sm:pt-16 lg:px-12">
      <div className="mb-4 flex items-center justify-between gap-3 sm:mb-5">
        <h2 className="min-w-0 text-[18px] font-semibold tracking-normal text-[#342d27] md:text-[22px]">
          Регионы доставки
        </h2>
        <Link
          to={REGIONS_PATH}
          className="inline-flex min-h-11 shrink-0 items-center gap-1 text-[15px] font-medium tracking-normal text-[#342d27] transition-colors duration-200 hover:text-primary focus-visible:rounded-[2px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 md:text-[16px]"
        >
          Все регионы
          <ChevronRight className="h-[15px] w-[15px] md:h-4 md:w-4" strokeWidth={1.8} aria-hidden />
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-4 lg:gap-x-10">
        {regionLinks.map((region, index) => (
          <Link
            key={region.slug}
            to={getRegionPath(region.slug)}
            className={`group -mx-3 min-h-[76px] flex-col items-start justify-center gap-1 rounded-[4px] px-3 transition-colors duration-200 hover:bg-secondary focus-visible:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 md:min-h-[88px] ${index >= MOBILE_VISIBLE_REGIONS ? "hidden lg:flex" : "flex"}`}
          >
            <span className="text-[16px] font-medium leading-tight text-[#342d27] transition-colors group-hover:text-primary md:text-[18px]">
              {getCityDisplayName(region.cityValue)}
            </span>
            <span className="text-[13px] font-normal leading-snug text-[#85827e] md:text-[14px]">
              {region.projectsCount} {projectPlural(region.projectsCount)} от {region.makersCount} {makerPlural(region.makersCount)}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default HomeRegionLinks;
