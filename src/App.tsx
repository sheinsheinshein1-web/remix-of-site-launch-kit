import { lazy, Suspense, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import Index from "./pages/Index.tsx";
import ScrollRestoration from "./components/ScrollToTop.tsx";
import CookieConsentBanner from "./components/CookieConsentBanner.tsx";
import { CATALOG_PATH, MANUFACTURERS_PATH, REGIONS_PATH } from "@/lib/siteRoutes";

// Lazy-loaded routes — each becomes its own chunk, kept out of the main bundle.
const Catalog = lazy(() => import("./pages/Catalog.tsx"));
const Favorites = lazy(() => import("./pages/Favorites.tsx"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const AllCategoriesPage = lazy(() => import("./components/AllCategoriesPage.tsx"));
const Messages = lazy(() => import("./pages/Messages.tsx"));
const SupportChat = lazy(() => import("./pages/SupportChat.tsx"));
const PartnerChat = lazy(() => import("./pages/PartnerChat.tsx"));
const CompanyChat = lazy(() => import("./pages/CompanyChat.tsx"));
const Profile = lazy(() => import("./pages/Profile.tsx"));
const Requests = lazy(() => import("./pages/Requests.tsx"));
const Partner = lazy(() => import("./pages/ManufacturerProfile.tsx"));
const PartnerReviews = lazy(() => import("./pages/PartnerReviews.tsx"));
const PartnerLanding = lazy(() => import("./pages/PartnerLanding.tsx"));
const PartnerFreePlacementLanding = lazy(() => import("./pages/PartnerFreePlacementLanding.tsx"));
const PartnerSalesCommissionLanding = lazy(() => import("./pages/PartnerSalesCommissionLanding.tsx"));
const PartnerManufacturerWebsiteLanding = lazy(() => import("./pages/PartnerManufacturerWebsiteLanding.tsx"));
const PartnerRenderingsLanding = lazy(() => import("./pages/PartnerRenderingsLanding.tsx"));
const PartnerBusinessPlacementLanding = lazy(() => import("./pages/PartnerBusinessPlacementLanding.tsx"));
const PartnerLab = lazy(() => import("./pages/PartnerLab.tsx"));
const Legal = lazy(() => import("./pages/Legal.tsx"));
const LegalDocument = lazy(() => import("./pages/LegalDocument.tsx"));
const MessagesLayout = lazy(() => import("./pages/MessagesLayout.tsx"));
const Lab = lazy(() => import("./pages/Lab.tsx"));
const OperatorChat = lazy(() => import("./pages/OperatorChat.tsx"));
const RegionPage = lazy(() => import("./pages/RegionPage.tsx"));
const Regions = lazy(() => import("./pages/Regions.tsx"));
const Manufacturers = lazy(() => import("./pages/Manufacturers.tsx"));
const Articles = lazy(() => import("./pages/Articles.tsx"));
const ArticleDetail = lazy(() => import("./pages/ArticleDetail.tsx"));
const IpModul = lazy(() => import("./pages/IpModul.tsx"));
const RusModul = lazy(() => import("./pages/RusModul.tsx"));

import avatar3d from "@/assets/avatar-3d.webp";
import heart3d from "@/assets/heart-3d.webp";
import supportIcon from "@/assets/support-icon.webp";
import partnerIcon from "@/assets/partner-icon.webp";
import catHouses from "@/assets/cat-houses.webp";
import catBaths from "@/assets/cat-baths.webp";
import catGlamping from "@/assets/cat-glamping.webp";
import catGuest from "@/assets/cat-guest.webp";
import catCommercial from "@/assets/cat-commercial.webp";
import catDacha from "@/assets/cat-dacha.webp";
import catShed from "@/assets/cat-shed.webp";
import catOffice from "@/assets/cat-office.webp";
import catWorkshop from "@/assets/cat-workshop.webp";
import catBarrelBath from "@/assets/cat-barrel-bath.webp";
import catHotTub from "@/assets/cat-hot-tub.webp";
import catGazebo from "@/assets/cat-gazebo.webp";
import catTerrace from "@/assets/cat-terrace.webp";
import catBbq from "@/assets/cat-bbq.webp";
import catHotel from "@/assets/cat-hotel.webp";
import catCafe from "@/assets/cat-cafe.webp";
import catGarage from "@/assets/cat-garage.webp";
import catCanopy from "@/assets/cat-canopy.webp";
import catFence from "@/assets/cat-fence.webp";
import catSeptic from "@/assets/cat-septic.webp";
import catWell from "@/assets/cat-well.webp";
import catCalculator from "@/assets/cat-calculator.webp";
import catPartner from "@/assets/partner-icon.webp";
import catCompare from "@/assets/cat-compare.webp";
import catSearchImg from "@/assets/cat-search.webp";
import catRoi from "@/assets/cat-roi.webp";
import catMortgage from "@/assets/cat-mortgage.webp";
import catGuide from "@/assets/cat-guide.webp";
import catLaw from "@/assets/cat-law.webp";
import catStories from "@/assets/cat-stories.webp";
import catGlampingBiz from "@/assets/cat-glamping-biz.webp";
import catSeasonal from "@/assets/cat-seasonal.webp";
import catStudio from "@/assets/cat-studio.webp";
import catTwostory from "@/assets/cat-twostory.webp";

const preloadedAssets = [
  avatar3d,
  heart3d,
  supportIcon,
  partnerIcon,
  catHouses,
  catBaths,
  catGlamping,
  catGuest,
  catCommercial,
  catDacha,
  catShed,
  catOffice,
  catWorkshop,
  catBarrelBath,
  catHotTub,
  catGazebo,
  catTerrace,
  catBbq,
  catHotel,
  catCafe,
  catGarage,
  catCanopy,
  catFence,
  catSeptic,
  catWell,
  catCalculator,
  catPartner,
  catCompare,
  catSearchImg,
  catRoi,
  catMortgage,
  catGuide,
  catLaw,
  catStories,
  catGlampingBiz,
  catSeasonal,
  catStudio,
  catTwostory,
];

const queryClient = new QueryClient();

const AssetPreloader = () => {
  const { pathname } = useLocation();
  const shouldPreload = pathname === "/" || pathname === "/categories/" || pathname === CATALOG_PATH || pathname.includes("/proekty/");

  useEffect(() => {
    if (!shouldPreload) return;

    preloadedAssets.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [shouldPreload]);

  return null;
};

// Forces ProjectDetail to remount on :id change so internal state and scroll reset cleanly.
const ProjectDetailRoute = () => {
  const { projectSlug, id } = useParams();
  return <ProjectDetail key={projectSlug ?? id} />;
};

const RedirectWithLocation = ({ to }: { to: string }) => {
  const location = useLocation();
  return <Navigate to={`${to}${location.search}${location.hash}`} replace />;
};

const AppRoutes = () => (
  <>
    <ScrollRestoration />
    <AssetPreloader />
    <Suspense fallback={<div className="min-h-screen bg-secondary" />}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path={CATALOG_PATH} element={<Catalog />} />
        <Route path="/catalog" element={<RedirectWithLocation to={CATALOG_PATH} />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/modulnye-doma/proekty/:projectSlug" element={<ProjectDetailRoute />} />
        <Route path="/prefab-doma/proekty/:projectSlug" element={<ProjectDetailRoute />} />
        <Route path="/project/:id" element={<ProjectDetailRoute />} />
        <Route path="/categories" element={<AllCategoriesPage />} />
        <Route path="/messages" element={<MessagesLayout />}>
          <Route index element={<Messages />} />
          <Route path="support" element={<SupportChat />} />
          <Route path="partner" element={<PartnerChat />} />
          <Route path="company" element={<CompanyChat />} />
        </Route>
        <Route path="/profile" element={<Profile />} />
        <Route path="/requests" element={<Requests />} />
        <Route path="/partner" element={<PartnerLanding />} />
        <Route path="/partner/free-placement" element={<PartnerFreePlacementLanding />} />
        <Route path="/partner/sales-commission" element={<PartnerSalesCommissionLanding />} />
        <Route path="/partner/manufacturer-website" element={<PartnerManufacturerWebsiteLanding />} />
        <Route path="/partner/renderings" element={<PartnerRenderingsLanding />} />
        <Route path="/partner/business-placement" element={<PartnerBusinessPlacementLanding />} />
        <Route path="/proizvoditeli/:id" element={<Partner />} />
        <Route path="/partner/:id" element={<Partner />} />
        <Route path="/lab/partner/:id" element={<PartnerLab />} />
        <Route path="/proizvoditeli/:id/otzyvy" element={<PartnerReviews />} />
        <Route path="/partner/:id/reviews" element={<PartnerReviews />} />
        <Route path="/operator" element={<OperatorChat />} />
        <Route path="/legal" element={<Legal />} />
        <Route path="/legal/:slug" element={<LegalDocument />} />
        <Route path="/privacy" element={<Navigate to="/legal/privacy/" replace />} />
        <Route path="/modulnye-doma/:slug" element={<RegionPage />} />
        <Route path="/region/:slug" element={<RegionPage />} />
        <Route path={REGIONS_PATH} element={<Regions />} />
        <Route path="/regions" element={<RedirectWithLocation to={REGIONS_PATH} />} />
        <Route path={MANUFACTURERS_PATH} element={<Manufacturers />} />
        <Route path="/manufacturers" element={<RedirectWithLocation to={MANUFACTURERS_PATH} />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/articles/:slug" element={<ArticleDetail />} />
        <Route path="/ip-modul" element={<IpModul />} />
        <Route path="/rusmodul" element={<RusModul />} />
        <Route path="/lab" element={<Lab />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
    <CookieConsentBanner />
  </>
);

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="mnogo-mesta-theme" disableTransitionOnChange>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <FavoritesProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </FavoritesProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
