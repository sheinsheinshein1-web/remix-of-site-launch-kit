import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export type SiteBreadcrumbItem = {
  label: string;
  to?: string;
  onClick?: () => void;
};

type SiteBreadcrumbsProps = {
  items: SiteBreadcrumbItem[];
  className?: string;
  spacing?: "page" | "none";
};

export const siteBreadcrumbPageContainerClassName =
  "mx-auto w-full max-w-[1400px] px-4 pt-[82px] sm:px-8 md:pt-[144px] lg:px-12";

const SiteBreadcrumbs = ({ items, className = "", spacing = "page" }: SiteBreadcrumbsProps) => (
  <nav
    aria-label="Хлебные крошки"
    className={`flex min-w-0 flex-nowrap items-center gap-2 overflow-hidden text-[13px] leading-none text-[#717b8e] md:gap-1.5 md:text-[13px] md:text-[#6b7280] ${spacing === "page" ? "mb-7" : ""} ${className}`}
  >
    {items.map((item, index) => {
      const isCurrent = index === items.length - 1;

      return (
        <span
          key={`${item.label}-${index}`}
          className={`inline-flex min-w-0 items-center gap-2 md:gap-1.5 ${isCurrent ? "flex-1" : "shrink-0"}`}
        >
          {index > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[#717b8e]/55 md:h-3 md:w-3 md:text-[#98a1b0]" strokeWidth={1.6} aria-hidden />}
          {item.to && !isCurrent ? (
            <Link
              to={item.to}
              onClick={item.onClick}
              className="whitespace-nowrap transition-colors hover:text-primary focus-visible:rounded-[2px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            >
              {item.label}
            </Link>
          ) : (
            <span className="truncate font-medium text-[#342d27] dark:text-foreground md:font-normal" aria-current={isCurrent ? "page" : undefined}>
              {item.label}
            </span>
          )}
        </span>
      );
    })}
  </nav>
);

export default SiteBreadcrumbs;
