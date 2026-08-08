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
import MobileTabBar from "@/components/MobileTabBar";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import { buildAssetUrl, buildSiteUrl, SITE_URL } from "@/lib/seo";

const homeJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "многоместа.рф",
    url: buildSiteUrl("/"),
    logo: buildAssetUrl("/icons/icon-512.png"),
    description: "Маркетплейс модульных и префаб домов с доставкой по России.",
    areaServed: "RU",
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "многоместа.рф",
    url: buildSiteUrl("/"),
    inLanguage: "ru-RU",
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/catalog/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  },
];

const BentoCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-card rounded-2xl border border-border ${className}`}>
    {children}
  </div>
);

const Index = () => {
  return (
    <div className="min-h-screen bg-secondary font-sans pb-16 md:pb-0">
      <Seo
        title="многоместа.рф — модульные и префаб дома с доставкой по РФ"
        description="Маркетплейс модульных и префаб домов. Сотни проектов от проверенных производителей с доставкой и сборкой по России."
        canonicalPath="/"
        jsonLd={homeJsonLd}
      />
      {/* Home surface: editorial hero + project feed */}
      <div className="bg-background md:rounded-b-2xl pb-4">
        <Header />
        <HeroSection />
        <div className="mx-auto w-full max-w-[1400px] px-4 pt-10 sm:px-8 sm:pt-16 lg:px-12">
          <div className="flex items-baseline justify-between mb-4 sm:mb-5">
            <h2 className="text-[11px] md:text-[12px] font-semibold uppercase tracking-[0.16em] text-[#342d27]">
              Рекомендуемые дома
            </h2>
            <a href="/catalog" className="text-[10px] md:text-[11px] font-medium uppercase tracking-[0.16em] text-primary transition-colors hover:text-primary/80 focus-visible:outline-none">
              Посмотреть все
            </a>
          </div>
        </div>
        <div className="mx-auto w-full max-w-[1400px] px-4 pb-2 pt-0 sm:px-8 lg:px-12">
          <FeaturedProjects />
        </div>
        <HomeCategoryLinks />
        <HomeRegionLinks />
        <HomeManufacturers />
      </div>

      <Footer />
      <MobileTabBar />
    </div>
  );
};

export default Index;
