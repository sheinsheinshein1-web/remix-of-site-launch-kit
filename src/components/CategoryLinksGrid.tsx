import { Link } from "react-router-dom";
import { categoryLinks, type CategoryLink } from "@/data/categoryLinks";

type CategoryLinksGridProps = {
  eagerCount?: number;
  items?: CategoryLink[];
};

const CategoryLinksGrid = ({ eagerCount = 0, items = categoryLinks }: CategoryLinksGridProps) => (
  <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3">
    {items.map((item, index) => (
      <Link
        key={item.title}
        to={item.href}
        className="group relative flex min-h-[172px] flex-col overflow-hidden rounded-[3px] bg-[#f6f7fa] p-3 transition-colors duration-200 hover:bg-[#f0f3fb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 dark:bg-secondary dark:hover:bg-primary/10 md:min-h-[226px] md:p-5"
        aria-label={`${item.title}. ${item.caption}`}
      >
        <div className="relative z-10 max-w-[75%]">
          <h3 className="text-[15px] font-semibold leading-tight text-[#342d27] transition-colors group-hover:text-primary dark:text-foreground md:text-[19px]">
            {item.title}
          </h3>
          <p className="mt-1.5 text-[12px] leading-snug text-[#717b8e] md:mt-2 md:text-[14px]">
            {item.caption}
          </p>
        </div>

        <img
          src={item.image}
          alt=""
          loading={index < eagerCount ? "eager" : "lazy"}
          decoding="async"
          className="pointer-events-none absolute bottom-[-10px] right-[-16px] h-[118px] w-[150px] object-contain transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transform-none md:bottom-[-12px] md:right-[-18px] md:h-[172px] md:w-[232px]"
        />
      </Link>
    ))}
  </div>
);

export default CategoryLinksGrid;
