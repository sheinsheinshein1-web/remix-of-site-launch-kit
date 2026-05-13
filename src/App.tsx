import { lazy, Suspense, useEffect, useLayoutEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation, useParams } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import Index from "./pages/Index.tsx";
import ScrollToTop from "./components/ScrollToTop.tsx";

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
const Partner = lazy(() => import("./pages/Partner.tsx"));
const PartnerLanding = lazy(() => import("./pages/PartnerLanding.tsx"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy.tsx"));
const MessagesLayout = lazy(() => import("./pages/MessagesLayout.tsx"));
const Lab = lazy(() => import("./pages/Lab.tsx"));
const OperatorChat = lazy(() => import("./pages/OperatorChat.tsx"));

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

const BrowserScrollRestoration = () => {
  useLayoutEffect(() => {
    if (!("scrollRestoration" in window.history)) return;

    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    return () => {
      window.history.scrollRestoration = previous;
    };
  }, []);

  return null;
};

const AssetPreloader = () => {
  const { pathname } = useLocation();
  const shouldPreload = pathname === "/" || pathname === "/categories" || pathname === "/catalog" || pathname.startsWith("/project/");

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
  const { id } = useParams();
  return <ProjectDetail key={id} />;
};

const AppRoutes = () => (
  <>
    <BrowserScrollRestoration />
    <ScrollToTop />
    <AssetPreloader />
    <Suspense fallback={<div className="min-h-screen bg-secondary" />}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/favorites" element={<Favorites />} />
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
        <Route path="/partner/:id" element={<Partner />} />
        <Route path="/operator" element={<OperatorChat />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/lab" element={<Lab />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  </>
);

const App = () => (
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
);

export default App;
