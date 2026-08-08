import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { makersById, projectsCountByMakerId } from "@/data/projects";
import { compareWithProjectPriority } from "@/lib/projectPriority";

const DESKTOP_VISIBLE_MAKERS = 12;
const MOBILE_VISIBLE_MAKERS = 6;

const projectPlural = (count: number) => {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return "проект";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "проекта";
  return "проектов";
};

const companyPlural = (count: number) => {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return "компания";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "компании";
  return "компаний";
};

const HomeManufacturers = () => {
  const [showAllMobile, setShowAllMobile] = useState(false);

  const makers = Object.values(makersById)
    .map((maker) => ({
      ...maker,
      projectsCount: projectsCountByMakerId[maker.id] ?? 0,
    }))
    .sort((a, b) =>
      compareWithProjectPriority(
        a,
        b,
        (first, second) =>
          second.projectsCount - first.projectsCount || first.name.localeCompare(second.name, "ru"),
      ),
    )
    .slice(0, DESKTOP_VISIBLE_MAKERS);

  const makersCount = Object.keys(makersById).length;

  return (
    <section className="mt-12 bg-[#f6f7fa] sm:mt-16">
      <div className="mx-auto w-full max-w-[1400px] px-4 py-10 sm:px-8 sm:py-14 lg:px-12">
        <div className="mb-5 flex items-baseline justify-between gap-4 sm:mb-6">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#342d27] md:text-[12px]">
            Производители домов
          </h2>
          <span className="text-right text-[9px] font-medium uppercase tracking-[0.14em] text-muted-foreground md:text-[10px]">
            {makersCount} {companyPlural(makersCount)} в каталоге
          </span>
        </div>

        <div className="grid sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-3 lg:gap-x-10">
          {makers.map((maker, index) => (
            <Link
              key={maker.id}
              to={`/partner/${maker.id}`}
              aria-label={`${maker.name}: ${maker.projectsCount} ${projectPlural(maker.projectsCount)}`}
              className={`group min-h-[68px] items-center gap-3 border-b border-[#dfe5f5] py-3 transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${
                index >= MOBILE_VISIBLE_MAKERS && !showAllMobile ? "hidden sm:flex" : "flex"
              }`}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-[3px] bg-white text-[10px] font-semibold uppercase tracking-[0.08em] text-[#342d27]">
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
                <span className="block text-[13px] font-medium leading-tight text-[#342d27] transition-colors group-hover:text-primary md:text-[14px]">
                  {maker.name}
                </span>
                <span className="mt-1 block text-[9px] uppercase tracking-[0.11em] text-muted-foreground md:text-[10px]">
                  {maker.city}
                </span>
              </span>

              <span className="shrink-0 text-right text-[9px] uppercase tracking-[0.12em] text-muted-foreground md:text-[10px]">
                {maker.projectsCount} {projectPlural(maker.projectsCount)}
              </span>
            </Link>
          ))}
        </div>

        {makers.length > MOBILE_VISIBLE_MAKERS && (
          <button
            type="button"
            aria-expanded={showAllMobile}
            onClick={() => setShowAllMobile((value) => !value)}
            className="mt-4 inline-flex min-h-11 items-center gap-1.5 text-left text-[10px] font-semibold uppercase tracking-[0.16em] text-primary transition-colors hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 sm:hidden"
          >
            <span>{showAllMobile ? "Скрыть компании" : "Показать ещё"}</span>
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform duration-200 ${showAllMobile ? "rotate-180" : ""}`}
              strokeWidth={1.75}
              aria-hidden="true"
            />
          </button>
        )}
      </div>
    </section>
  );
};

export default HomeManufacturers;
