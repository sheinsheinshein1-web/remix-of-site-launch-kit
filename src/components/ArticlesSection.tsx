import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { homeArticles } from "@/data/articles";

type ArticlesSectionProps = {
  showHeader?: boolean;
  className?: string;
};

const ArticlesSection = ({ showHeader = true, className = "" }: ArticlesSectionProps) => (
  <section className={`mx-auto w-full max-w-[1400px] px-4 pb-8 pt-12 sm:px-8 sm:pb-12 sm:pt-16 lg:px-12 ${className}`}>
    {showHeader && (
      <div className="mb-4 flex items-center justify-between gap-3 sm:mb-5">
        <h2 className="min-w-0 text-[18px] font-semibold tracking-normal text-[#342d27] dark:text-foreground md:text-[22px]">
          Журнал
        </h2>
        <Link
          to="/articles"
          className="inline-flex min-h-11 shrink-0 items-center gap-1 text-[15px] font-medium tracking-normal text-[#342d27] transition-colors duration-200 hover:text-primary focus-visible:rounded-[2px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 dark:text-foreground md:text-[16px]"
        >
          Все материалы
          <ChevronRight className="h-[15px] w-[15px] md:h-4 md:w-4" strokeWidth={1.8} aria-hidden />
        </Link>
      </div>
    )}

    <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-5 lg:gap-8">
      {homeArticles.map((article) => (
        <Link
          key={article.slug}
          to={article.path}
          className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
        >
          <span className="relative flex aspect-[1.45/1] items-center justify-center overflow-hidden rounded-[3px] bg-[#f6f7fa] dark:bg-secondary">
            <img
              src={article.image}
              alt=""
              width={256}
              height={256}
              loading="lazy"
              decoding="async"
              className="h-[72%] w-[72%] object-contain transition-transform duration-300 group-hover:scale-[1.035]"
            />
            <span className="absolute left-3 top-3 text-[10px] font-medium tracking-normal text-primary md:text-[11px]">
              {article.category}
            </span>
          </span>

          <span className="mt-4 block text-[20px] font-medium leading-[1.08] tracking-[-0.015em] text-[#342d27] transition-colors group-hover:text-primary dark:text-foreground md:text-[24px]">
            {article.title}
          </span>
          <span className="mt-2 block max-w-[410px] text-[12px] leading-relaxed text-muted-foreground md:text-[13px]">
            {article.description}
          </span>
          <span className="mt-3 block text-[10px] font-normal tracking-normal text-muted-foreground md:text-[11px]">
            {article.readTime} чтения
          </span>
        </Link>
      ))}
    </div>
  </section>
);

export default ArticlesSection;
