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

const BentoCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-card rounded-2xl border border-border ${className}`}>
    {children}
  </div>
);

const Index = () => {
  return (
    <div className="min-h-screen bg-secondary font-sans pb-16 md:pb-0">
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
