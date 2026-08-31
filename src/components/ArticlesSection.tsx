import { Link } from "react-router-dom";
import { homeArticles } from "@/data/articles";
import HomeSectionTitle from "@/components/HomeSectionTitle";

type ArticlesSectionProps = {
  showHeader?: boolean;
  className?: string;
};

const ArticlesSection = ({ showHeader = true, className = "" }: ArticlesSectionProps) => (
  <section className={`mx-auto w-full max-w-[1400px] px-4 pb-8 pt-12 sm:px-8 sm:pb-12 sm:pt-16 lg:px-12 ${className}`}>
    {showHeader && (
      <div className="mb-4 sm:mb-5">
        <HomeSectionTitle title="Все материалы" count={homeArticles.length} to="/articles/" />
      </div>
    )}

    <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-5 lg:gap-8">
      {homeArticles.map((article) => (
        <Link
          key={article.slug}
          to={article.path}
          className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
        >
          <span className="relative flex aspect-[1.45/1] items-center justify-center overflow-hidden rounded-[var(--radius)] bg-[#f6f7fa] dark:bg-secondary">
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
