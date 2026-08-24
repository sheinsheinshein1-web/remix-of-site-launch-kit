import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import CategoryLinksGrid from "@/components/CategoryLinksGrid";

const HomeCategoryLinks = () => (
  <section className="mx-auto w-full max-w-[1400px] px-4 pb-6 pt-12 sm:px-8 sm:pt-16 lg:px-12">
    <div className="mb-4 flex items-center justify-between gap-3 sm:mb-5">
      <h2 className="min-w-0 text-[18px] font-semibold tracking-normal text-[#342d27] dark:text-foreground md:text-[22px]">
        Категории
      </h2>
      <Link
        to="/categories/"
        className="inline-flex min-h-11 shrink-0 items-center gap-1 text-[15px] font-medium tracking-normal text-[#342d27] transition-colors duration-200 hover:text-primary focus-visible:rounded-[2px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 md:text-[16px]"
      >
        Все категории
        <ChevronRight className="h-[15px] w-[15px] md:h-4 md:w-4" strokeWidth={1.8} aria-hidden />
      </Link>
    </div>
    <CategoryLinksGrid />
  </section>
);

export default HomeCategoryLinks;
