import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import Index from "./pages/Index.tsx";
import Catalog from "./pages/Catalog.tsx";
import Favorites from "./pages/Favorites.tsx";
import ProjectDetail from "./pages/ProjectDetail.tsx";
import NotFound from "./pages/NotFound.tsx";
import AllCategoriesPage from "./components/AllCategoriesPage.tsx";
import Messages from "./pages/Messages.tsx";
import SupportChat from "./pages/SupportChat.tsx";
import PartnerChat from "./pages/PartnerChat.tsx";
import CompanyChat from "./pages/CompanyChat.tsx";
import Profile from "./pages/Profile.tsx";
import Requests from "./pages/Requests.tsx";
import Partner from "./pages/Partner.tsx";
import PartnerLanding from "./pages/PartnerLanding.tsx";
import ScrollToTop from "./components/ScrollToTop.tsx";
import MessagesLayout from "./pages/MessagesLayout.tsx";

import avatar3d from "@/assets/avatar-3d.png";
import heart3d from "@/assets/heart-3d.png";
import supportIcon from "@/assets/support-icon.png";
import partnerIcon from "@/assets/partner-icon.png";
import catHouses from "@/assets/cat-houses.png";
import catBaths from "@/assets/cat-baths.png";
import catGlamping from "@/assets/cat-glamping.png";
import catGuest from "@/assets/cat-guest.png";
import catCommercial from "@/assets/cat-commercial.png";
import catDacha from "@/assets/cat-dacha.png";
import catShed from "@/assets/cat-shed.png";
import catOffice from "@/assets/cat-office.png";
import catWorkshop from "@/assets/cat-workshop.png";
import catBarrelBath from "@/assets/cat-barrel-bath.png";
import catHotTub from "@/assets/cat-hot-tub.png";
import catGazebo from "@/assets/cat-gazebo.png";
import catTerrace from "@/assets/cat-terrace.png";
import catBbq from "@/assets/cat-bbq.png";
import catHotel from "@/assets/cat-hotel.png";
import catCafe from "@/assets/cat-cafe.png";
import catGarage from "@/assets/cat-garage.png";
import catCanopy from "@/assets/cat-canopy.png";
import catFence from "@/assets/cat-fence.png";
import catSeptic from "@/assets/cat-septic.png";
import catWell from "@/assets/cat-well.png";
import catCalculator from "@/assets/cat-calculator.png";
import catPartner from "@/assets/partner-icon.png";
import catCompare from "@/assets/cat-compare.png";
import catSearchImg from "@/assets/cat-search.png";
import catRoi from "@/assets/cat-roi.png";
import catMortgage from "@/assets/cat-mortgage.png";
import catGuide from "@/assets/cat-guide.png";
import catLaw from "@/assets/cat-law.png";
import catStories from "@/assets/cat-stories.png";
import catGlampingBiz from "@/assets/cat-glamping-biz.png";
import catSeasonal from "@/assets/cat-seasonal.png";
import catStudio from "@/assets/cat-studio.png";
import catTwostory from "@/assets/cat-twostory.png";

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

const AppRoutes = () => (
  <>
    <ScrollToTop />
    <AssetPreloader />
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
      <Route path="*" element={<NotFound />} />
    </Routes>
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
