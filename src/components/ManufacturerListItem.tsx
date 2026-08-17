import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import ManufacturerName from "@/components/ManufacturerName";
import { getManufacturerRatingSummary } from "@/data/manufacturerRatings";
import { makersById, projectsCountByMakerId } from "@/data/projects";
import { getCityDisplayName } from "@/lib/cityDisplay";
import { cn, pluralizeRu } from "@/lib/utils";
import { getManufacturerPath } from "@/lib/siteRoutes";

type ManufacturerListItemProps = {
  makerId: string;
  className?: string;
};

const ManufacturerListItem = ({ makerId, className }: ManufacturerListItemProps) => {
  const maker = makersById[makerId];
  if (!maker) return null;

  const reviewSummary = getManufacturerRatingSummary(makerId);
  const projectsCount = projectsCountByMakerId[makerId] ?? 0;
  const projectsLabel = `${projectsCount} ${pluralizeRu(projectsCount, "проект", "проекта", "проектов")}`;

  return (
    <Link
      to={getManufacturerPath(makerId)}
      aria-label={`${maker.name}: ${reviewSummary.rating.toFixed(1)} из 5, ${reviewSummary.hasReviews ? reviewSummary.reviewsLabel : "отзывов пока нет"}; ${projectsLabel}`}
      className={cn(
        "group -mx-3 flex min-h-[92px] items-center gap-3 rounded-[4px] px-3 py-4 transition-colors duration-200 hover:bg-secondary focus-visible:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
        className,
      )}
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-[3px] border border-border bg-white text-[11px] font-semibold uppercase tracking-[0.06em] text-[#342d27]">
        {maker.logo ? (
          <img src={maker.logo} alt="" width={44} height={44} loading="lazy" decoding="async" className="h-full w-full object-contain p-1" />
        ) : maker.initials}
      </span>

      <span className="min-w-0 flex-1">
        <ManufacturerName
          makerId={maker.id}
          name={maker.name}
          className="w-full"
          nameClassName="text-[14px] font-medium leading-tight text-[#342d27] transition-colors duration-200 group-hover:text-primary md:text-[15px] dark:text-foreground"
        />
        <span className="mt-1.5 block text-[11px] leading-tight text-muted-foreground md:text-[12px]">
          {getCityDisplayName(maker.city)} · {projectsLabel}
        </span>
      </span>

      <span className="shrink-0 text-right">
        <span className="flex items-center justify-end gap-1 text-[14px] font-medium tabular-nums text-[#342d27] md:text-[15px] dark:text-foreground">
          <Star className={`h-3 w-3 ${reviewSummary.hasReviews ? "fill-primary text-primary" : "text-muted-foreground/55"}`} strokeWidth={1.6} aria-hidden />
          {reviewSummary.rating.toFixed(1).replace(".", ",")}
        </span>
        <span className="mt-1 block text-[12px] text-muted-foreground md:text-[13px]">
          {reviewSummary.hasReviews ? reviewSummary.reviewsLabel : "Нет отзывов"}
        </span>
      </span>
    </Link>
  );
};

export default ManufacturerListItem;
