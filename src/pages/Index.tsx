import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import StatsRow from "@/components/StatsRow";
import CategoriesSection from "@/components/CategoriesSection";
import FeaturedProjects from "@/components/FeaturedProjects";
import HowItWorks from "@/components/HowItWorks";
import ManufacturersList from "@/components/ManufacturersList";
import ReviewsSection from "@/components/ReviewsSection";
import CalculatorSection from "@/components/CalculatorSection";
import ArticlesSection from "@/components/ArticlesSection";
import MobileTabBar from "@/components/MobileTabBar";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";

const SITE_URL = "https://многоместа.рф";

const homeJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "многоместа.рф",
    url: SITE_URL,
    logo: `${SITE_URL}/icons/icon-512.png`,
    description: "Маркетплейс модульных и префаб домов с доставкой по России.",
    areaServed: "RU",
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "многоместа.рф",
    url: SITE_URL,
    inLanguage: "ru-RU",
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/catalog?q={search_term_string}`,
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
        title="многоместа.рф — модульные и префаб дома с доставкой по России"
        description="Маркетплейс модульных и префаб домов. Сотни проектов от проверенных производителей с доставкой и сборкой по России."
        canonicalPath="/"
        jsonLd={homeJsonLd}
      />
      {/* Big white bento: header + hero + categories + projects */}
      <div className="max-w-[1400px] mx-auto bg-background md:rounded-b-2xl pb-4">
        <Header />
        <div className="hidden md:block px-3 md:px-8 md:pt-[92px]">
          <HeroSection />
        </div>
        <div className="md:hidden pt-[50px]" />
        <div className="px-2 md:px-8 pt-2 md:pt-3 pb-2">
          <FeaturedProjects />
        </div>
      </div>

      <Footer />
      <MobileTabBar />
    </div>
  );
};

export default Index;
