import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import StatsRow from "@/components/StatsRow";
import CategoriesSection from "@/components/CategoriesSection";
import FeaturedProjects from "@/components/FeaturedProjects";
import HomeCategoryLinks from "@/components/HomeCategoryLinks";
import HomeRegionLinks from "@/components/HomeRegionLinks";
import HomeManufacturers from "@/components/HomeManufacturers";
import HowItWorks from "@/components/HowItWorks";
import ManufacturersList from "@/components/ManufacturersList";
import ReviewsSection from "@/components/ReviewsSection";
import CalculatorSection from "@/components/CalculatorSection";
import ArticlesSection from "@/components/ArticlesSection";
import HomeFaq from "@/components/HomeFaq";
import HomeClosingCta from "@/components/HomeClosingCta";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import { buildAssetUrl, buildSiteUrl, SITE_URL } from "@/lib/seo";
import { homeFaq } from "@/data/homeFaq";
import { CATALOG_PATH } from "@/lib/siteRoutes";
import { projects } from "@/data/projects";
import HomeSectionTitle from "@/components/HomeSectionTitle";

const homeJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "многоместа.рф",
    alternateName: "Много места",
    url: buildSiteUrl("/"),
    logo: buildAssetUrl("/icons/icon-512.png"),
    description: "Платформа для выбора модульных домов с доставкой по России.",
    areaServed: "RU",
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: "многоместа.рф",
    alternateName: "Много места",
    url: buildSiteUrl("/"),
    inLanguage: "ru-RU",
    publisher: { "@id": `${SITE_URL}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}${CATALOG_PATH}?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: homeFaq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  },
];

const BentoCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-card rounded-2xl border border-border ${className}`}>
    {children}
  </div>
);

const Index = () => {
  return (
    <div className="min-h-screen bg-secondary font-sans">
      <Seo
        title="многоместа.рф — модульные дома с доставкой по России"
        description="Каталог модульных домов: проекты с ценами, площадью и планировками от проверенных производителей. Доставка и сборка по всей России."
        canonicalPath="/"
        jsonLd={homeJsonLd}
      />
      {/* Home surface: editorial hero + project feed */}
      <div className="bg-background md:rounded-b-2xl">
        <Header />
        <HeroSection />
        <div className="mx-auto w-full max-w-[1400px] px-4 pt-10 sm:px-8 sm:pt-16 lg:px-12">
          <div className="mb-4 sm:mb-5">
            <HomeSectionTitle title="Все проекты" count={projects.length} to={CATALOG_PATH} />
          </div>
        </div>
        <div className="mx-auto w-full max-w-[1400px] px-4 pb-2 pt-0 sm:px-8 lg:px-12">
          <FeaturedProjects />
        </div>
        <HomeCategoryLinks />
        <HomeRegionLinks />
        <HomeManufacturers />
        <ArticlesSection />
        <HomeFaq />
        <HomeClosingCta />
      </div>

      <Footer />
    </div>
  );
};

export default Index;
