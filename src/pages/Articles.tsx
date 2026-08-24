import ArticlesSection from "@/components/ArticlesSection";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SiteBreadcrumbs, { siteBreadcrumbPageContainerClassName } from "@/components/SiteBreadcrumbs";
import Seo from "@/components/Seo";
import { homeArticles } from "@/data/articles";

const materialPlural = (count: number) => {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return "материал";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "материала";
  return "материалов";
};

const Articles = () => (
  <div className="min-h-screen bg-secondary font-sans">
    <Seo
      title="Журнал о модульных домах — многоместа.рф"
      description="Практические материалы о выборе модульного дома, расчёте стоимости и работе с производителями."
      canonicalPath="/articles/"
    />
    <main className="bg-background">
      <Header variant="home" />
      <div className={siteBreadcrumbPageContainerClassName}>
        <SiteBreadcrumbs items={[{ label: "Главная", to: "/" }, { label: "Журнал" }]} />

        <div className="flex items-end justify-between gap-6">
          <div className="max-w-[720px]">
            <h1 className="text-[30px] font-semibold leading-[1.08] tracking-[-0.025em] text-[#342d27] dark:text-foreground md:text-[46px]">
              Журнал
            </h1>
            <p className="mt-4 text-[15px] leading-relaxed text-[#342d27]/65 dark:text-muted-foreground md:max-w-[680px] md:text-[17px]">
              Практические материалы о выборе проекта, стоимости, комплектации и работе с производителем.
            </p>
          </div>
          <p className="hidden shrink-0 pb-1 text-[14px] text-muted-foreground sm:block md:text-[15px]">
            {homeArticles.length} {materialPlural(homeArticles.length)}
          </p>
        </div>
      </div>
      <ArticlesSection showHeader={false} className="pt-9 sm:pt-12" />
    </main>
    <Footer />
  </div>
);

export default Articles;
