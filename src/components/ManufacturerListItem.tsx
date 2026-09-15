import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import ManufacturerLogo from "@/components/ManufacturerLogo";
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
        "group -mx-3 flex min-h-[92px] items-center gap-3 rounded-[var(--radius)] px-3 py-4 transition-colors duration-200 hover:bg-secondary focus-visible:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
        className,
      )}
    >
      <ManufacturerLogo manufacturer={maker} className="h-11 w-11 text-[11px]" />

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
