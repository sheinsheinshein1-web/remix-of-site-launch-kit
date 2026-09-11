import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

type HomeSectionTitleProps = {
  title: string;
  count: number;
  to: string;
};

const HomeSectionTitle = ({ title, count, to }: HomeSectionTitleProps) => {
  const titleWords = title.trim().split(/\s+/);
  const lastWord = titleWords.pop() ?? "";
  const titlePrefix = titleWords.join(" ");

  return (
    <h2 className="min-w-0">
      <Link
        to={to}
        className="group inline text-[25px] font-semibold leading-[1.05] tracking-[-0.03em] text-[#342d27] transition-colors hover:text-primary focus-visible:rounded-[var(--radius)] focus-visible:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 dark:text-foreground sm:text-[28px] md:text-[36px]"
      >
        {titlePrefix && <>{titlePrefix}{" "}</>}
        <span className="inline-flex whitespace-nowrap align-baseline items-baseline gap-2 md:gap-3">
          <span>{lastWord}</span>
          <span
            className="tabular-nums text-[#746f6a] transition-colors group-hover:text-primary group-focus-visible:text-primary dark:text-foreground/65"
            aria-label={`Количество: ${count}`}
          >
            {count.toLocaleString("ru-RU")}
          </span>
          <ChevronRight className="h-5 w-5 self-center transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none md:h-6 md:w-6" strokeWidth={1.8} aria-hidden />
        </span>
      </Link>
    </h2>
  );
};

export default HomeSectionTitle;
