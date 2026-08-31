import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

type PartnerFeatureSectionProps = {
  id?: string;
  title: string;
  children: ReactNode;
  visual: ReactNode;
  onApply?: () => void;
  actionHref?: string;
  actionLabel?: string;
  reverse?: boolean;
};

const PartnerFeatureSection = ({
  id,
  title,
  children,
  visual,
  onApply,
  actionHref,
  actionLabel = "Узнать подробнее",
  reverse = false,
}: PartnerFeatureSectionProps) => (
  <section id={id} className="scroll-mt-24">
    <div
      className={cn(
        "mx-auto grid w-full max-w-[1400px] gap-10 px-4 py-12 sm:px-8 md:gap-12 md:py-14 lg:px-12 lg:py-16 xl:grid-cols-2 xl:items-center xl:gap-16",
        reverse
          ? "xl:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)]"
          : "xl:grid-cols-[minmax(340px,0.85fr)_minmax(0,1.15fr)]",
      )}
    >
      <div className={cn("max-w-[600px] xl:max-w-[540px]", reverse && "xl:order-2 xl:justify-self-end")}>
        <h2 className="text-[30px] font-semibold leading-[1.08] tracking-[-0.03em] text-[#342d27] sm:text-[36px] md:text-[44px] dark:text-foreground">
          {title}
        </h2>
        <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-[#595653] md:text-[17px] dark:text-muted-foreground">
          {children}
        </div>
        {actionHref ? (
          <Link
            to={actionHref}
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-[var(--radius)] text-[15px] font-medium text-[#342d27] transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 dark:text-foreground dark:hover:text-primary"
          >
            {actionLabel}
            <ChevronRight className="h-4 w-4" strokeWidth={1.6} aria-hidden />
          </Link>
        ) : onApply ? (
          <button
            type="button"
            onClick={onApply}
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-[var(--radius)] text-[15px] font-medium text-[#342d27] transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 dark:text-foreground dark:hover:text-primary"
          >
            {actionLabel}
            <ChevronRight className="h-4 w-4" strokeWidth={1.6} aria-hidden />
          </button>
        ) : null}
      </div>
      <div
        className={cn(
          "min-w-0 xl:flex xl:items-center",
          reverse
            ? "xl:order-1 xl:[&_.partner-platform-screenshot]:justify-start xl:[&_.partner-platform-screenshot]:pl-0 xl:[&_.partner-platform-screenshot-image]:-translate-x-[2.5%]"
            : "xl:[&_.partner-platform-screenshot]:justify-end xl:[&_.partner-platform-screenshot]:pr-0 xl:[&_.partner-platform-screenshot-image]:translate-x-[2.5%]",
        )}
      >
        <div className="w-full">
          {visual}
        </div>
      </div>
    </div>
  </section>
);

export default PartnerFeatureSection;
