import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Star } from "lucide-react";
import { useCity } from "@/components/CitySelector";
import ManufacturerName from "@/components/ManufacturerName";
import { getManufacturerRatingSummary } from "@/data/manufacturerRatings";
import { makersById, projects, projectsCountByMakerId } from "@/data/projects";
import { compareWithProjectPriority } from "@/lib/projectPriority";
import { getCityDisplayName } from "@/lib/cityDisplay";
import { isProjectAvailableInGeo } from "@/lib/geoSelection";
import { MANUFACTURERS_PATH, getManufacturerPath } from "@/lib/siteRoutes";

const DESKTOP_VISIBLE_MAKERS = 15;
const MOBILE_VISIBLE_MAKERS = 6;

const HomeManufacturers = () => {
  const { city } = useCity();
  const makers = useMemo(() => Object.values(makersById)
      .map((maker) => ({
        ...maker,
        projectsCount: projectsCountByMakerId[maker.id] ?? 0,
        reviewSummary: getManufacturerRatingSummary(maker.id),
        availableInSelectedRegion: projects.some((project) => (
          project.maker.id === maker.id
          && isProjectAvailableInGeo(project.city, city, project.deliveryRegionSlugs)
        )),
      }))
      .sort((a, b) => {
        const regionPriority = Number(b.availableInSelectedRegion) - Number(a.availableInSelectedRegion);
        if (regionPriority !== 0) return regionPriority;

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
          (first, second) =>
            second.projectsCount - first.projectsCount || first.name.localeCompare(second.name, "ru"),
        );
      })
      .slice(0, DESKTOP_VISIBLE_MAKERS), [city]);

  return (
    <section id="manufacturers" className="scroll-mt-24">
      <div className="mx-auto w-full max-w-[1400px] px-4 pb-6 pt-12 sm:px-8 sm:pt-16 lg:px-12">
        <div className="mb-5 flex items-center justify-between gap-3 sm:mb-6">
          <h2 className="min-w-0 text-[18px] font-semibold tracking-normal text-[#342d27] md:text-[22px]">
            Производители
          </h2>
          <Link to={MANUFACTURERS_PATH} className="inline-flex min-h-11 shrink-0 items-center gap-1 text-[15px] font-medium tracking-normal text-[#342d27] transition-colors duration-200 hover:text-primary focus-visible:rounded-[2px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 md:text-[16px]">
            Все производители
            <ChevronRight className="h-[15px] w-[15px] md:h-4 md:w-4" strokeWidth={1.8} aria-hidden />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-3 lg:gap-x-10">
          {makers.map((maker, index) => (
            <Link
              key={maker.id}
              to={getManufacturerPath(maker.id)}
              aria-label={`${maker.name}: ${maker.reviewSummary.rating.toFixed(1)} из 5, ${maker.reviewSummary.hasReviews ? maker.reviewSummary.reviewsLabel : "отзывов пока нет"}; ${getCityDisplayName(maker.city)}`}
              className={`group -mx-3 min-h-[76px] items-center gap-3 rounded-[4px] px-3 py-3 transition-colors duration-200 hover:bg-secondary focus-visible:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 md:min-h-[80px] ${index >= MOBILE_VISIBLE_MAKERS ? "hidden sm:flex" : "flex"}`}
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-[3px] border border-border bg-white text-[10px] font-semibold uppercase tracking-[0.08em] text-[#342d27]">
                {maker.logo ? (
                  <img
                    src={maker.logo}
                    alt=""
                    width={40}
                    height={40}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-contain p-1.5"
                  />
                ) : (
                  maker.initials
                )}
              </span>

              <span className="min-w-0 flex-1">
                <ManufacturerName
                  makerId={maker.id}
                  name={maker.name}
                  className="w-full"
                  nameClassName="text-[15px] font-medium leading-tight text-[#342d27] transition-colors group-hover:text-primary md:text-[16px]"
                />
                <span className="mt-1 block text-[13px] font-normal tracking-normal text-muted-foreground md:text-[14px]">
                  {getCityDisplayName(maker.city)}
                </span>
              </span>

              <span className="shrink-0 text-right">
                <span className="flex items-center justify-end gap-1 text-[14px] font-medium tabular-nums text-[#342d27] md:text-[15px]">
                  <Star className={`h-3 w-3 ${maker.reviewSummary.hasReviews ? "fill-primary text-primary" : "text-muted-foreground/55"}`} strokeWidth={1.6} aria-hidden />
                  {maker.reviewSummary.rating.toFixed(1).replace(".", ",")}
                </span>
                <span className="mt-1 block text-[12px] font-normal text-muted-foreground md:text-[13px]">
                  {maker.reviewSummary.hasReviews ? maker.reviewSummary.reviewsLabel : "Нет отзывов"}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeManufacturers;
