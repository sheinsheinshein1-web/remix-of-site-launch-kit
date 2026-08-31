import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

type HomeSectionTitleProps = {
  title: string;
  count: number;
  to: string;
};

const HomeSectionTitle = ({ title, count, to }: HomeSectionTitleProps) => (
  <h2 className="min-w-0">
    <Link
      to={to}
      className="group flex min-h-11 max-w-full min-w-0 items-center gap-2 text-[25px] font-semibold leading-none tracking-[-0.03em] text-[#342d27] transition-colors hover:text-primary focus-visible:rounded-[var(--radius)] focus-visible:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 dark:text-foreground sm:text-[28px] md:gap-3 md:text-[36px]"
    >
      <span className="min-w-0 leading-[1.05]">{title}</span>
      <span
        className="shrink-0 tabular-nums text-[#746f6a] transition-colors group-hover:text-primary group-focus-visible:text-primary dark:text-foreground/65"
        aria-label={`Количество: ${count}`}
      >
        {count.toLocaleString("ru-RU")}
      </span>
      <ChevronRight className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none md:h-6 md:w-6" strokeWidth={1.8} aria-hidden />
    </Link>
  </h2>
);

export default HomeSectionTitle;
