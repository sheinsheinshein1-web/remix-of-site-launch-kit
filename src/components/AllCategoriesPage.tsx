import CategoryLinksGrid from "@/components/CategoryLinksGrid";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SearchDropdown from "@/components/SearchDropdown";
import Seo from "@/components/Seo";
import SiteBreadcrumbs, { siteBreadcrumbPageContainerClassName } from "@/components/SiteBreadcrumbs";
import { allCategoryLinks, businessCategoryLinks } from "@/data/categoryLinks";
import { buildSiteUrl } from "@/lib/seo";
import { CATALOG_PATH } from "@/lib/siteRoutes";

const AllCategoriesPage = () => (
  <div className="min-h-screen bg-white font-sans text-[#342d27] dark:bg-background dark:text-foreground">
    <Seo
      title="Категории проектов домов | многоместа.рф"
      description="Категории проектов модульных домов: барнхаусы, мини-дома, дома для ПМЖ, дачи и проекты с террасой."
      canonicalPath="/categories/"
      jsonLd={[
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Главная", item: buildSiteUrl("/") },
            { "@type": "ListItem", position: 2, name: "Проекты", item: buildSiteUrl(CATALOG_PATH) },
            { "@type": "ListItem", position: 3, name: "Категории", item: buildSiteUrl("/categories/") },
          ],
        },
        {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Категории проектов домов",
          itemListElement: allCategoryLinks.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.title,
            url: buildSiteUrl(item.href),
          })),
        },
      ]}
    />
    <Header variant="home" />

    <main>
      <div className={`${siteBreadcrumbPageContainerClassName} pb-16 sm:pb-20`}>
        <SiteBreadcrumbs
          items={[{ label: "Главная", to: "/" }, { label: "Проекты", to: CATALOG_PATH }, { label: "Категории" }]}
        />

        <div>
          <h1 className="max-w-[820px] text-[32px] font-semibold leading-[1.05] tracking-[-0.035em] text-[#342d27] dark:text-foreground sm:text-[42px] md:text-[52px]">
            Категории проектов
          </h1>
          <p className="mt-4 max-w-[720px] text-[15px] leading-relaxed text-[#595653] dark:text-muted-foreground md:mt-5 md:text-[18px]">
            Выберите подходящий тип дома, бюджет или сценарий проживания — сразу покажем проекты из каталога.
          </p>
        </div>

        <div className="mt-7 max-w-[860px] md:mt-9">
          <SearchDropdown inputClassName="border border-[#dfe5f5] bg-[#f8faff] rounded-[3px]" />
        </div>

        <section className="mt-10 md:mt-14" aria-labelledby="all-categories-heading">
          <h2 id="all-categories-heading" className="mb-5 text-[20px] font-semibold tracking-[-0.01em] text-[#342d27] dark:text-foreground md:mb-6 md:text-[24px]">
            Для жизни
          </h2>
          <CategoryLinksGrid eagerCount={3} />
        </section>

        <section className="mt-12 md:mt-16" aria-labelledby="business-categories-heading">
          <h2 id="business-categories-heading" className="mb-5 text-[20px] font-semibold tracking-[-0.01em] text-[#342d27] dark:text-foreground md:mb-6 md:text-[24px]">
            Для бизнеса
          </h2>
          <CategoryLinksGrid items={businessCategoryLinks} />
        </section>
      </div>
    </main>

    <Footer />
  </div>
);

export default AllCategoriesPage;
