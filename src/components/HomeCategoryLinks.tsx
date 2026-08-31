import CategoryLinksGrid from "@/components/CategoryLinksGrid";
import HomeSectionTitle from "@/components/HomeSectionTitle";
import { allCategoryLinks } from "@/data/categoryLinks";

const HomeCategoryLinks = () => (
  <section className="mx-auto w-full max-w-[1400px] px-4 pb-6 pt-12 sm:px-8 sm:pt-16 lg:px-12">
    <div className="mb-4 sm:mb-5">
      <HomeSectionTitle title="Все категории" count={allCategoryLinks.length} to="/categories/" />
    </div>
    <CategoryLinksGrid />
  </section>
);

export default HomeCategoryLinks;
