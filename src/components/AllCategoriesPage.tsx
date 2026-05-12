import { ArrowRight, Search } from "lucide-react";
import PartnerDrawer from "@/components/PartnerDrawer";
import SearchDropdown from "./SearchDropdown";
import MobileTabBar from "./MobileTabBar";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import Seo from "@/components/Seo";
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
import catHousesModular from "@/assets/cat-houses-modular.png";
import catDachaModular from "@/assets/cat-dacha-modular.png";
import catTwostoryModular from "@/assets/cat-twostory-modular.png";
import catStudioModular from "@/assets/cat-studio-modular.png";
import catGuestModular from "@/assets/cat-guest-modular.png";
import catHousesPrefab from "@/assets/cat-houses-prefab.png";
import catDachaPrefab from "@/assets/cat-dacha-prefab.png";
import catTwostoryPrefab from "@/assets/cat-twostory-prefab.png";
import catStudioPrefab from "@/assets/cat-studio-prefab.png";
import catGuestPrefab from "@/assets/cat-guest-prefab.png";

type Tag = "new" | "soon" | "later";

interface CategoryItem {
  name: string;
  count: string;
  img: string;
  tag?: Tag;
  span?: number;
  imgClass?: string;
}

const makeHouseItems = (imgs: { house: string; dacha: string; twostory: string; studio: string; guest: string }): CategoryItem[] => [
  { name: "Дома", count: "84", img: imgs.house, imgClass: "bottom-[-20px] right-[-50px]" },
  { name: "Дачные домики", count: "19", img: imgs.dacha, tag: "soon", imgClass: "bottom-[-20px] right-[-16px]" },
  { name: "Двух-\nэтажные", count: "15", img: imgs.twostory, tag: "soon", imgClass: "bottom-[-20px] right-[-16px]" },
  { name: "Студии", count: "12", img: imgs.studio, tag: "soon", imgClass: "bottom-[-20px] right-[-16px]" },
  { name: "Гостевые дома", count: "28", img: imgs.guest, tag: "soon" },
];

const sections: { title: string; tech?: string; items: CategoryItem[] }[] = [
  { title: "Каркасные дома", tech: "Каркасный", items: makeHouseItems({ house: catHouses, dacha: catDacha, twostory: catTwostory, studio: catStudio, guest: catGuest }) },
  { title: "Модульные дома", tech: "Модульный дом", items: makeHouseItems({ house: catHousesModular, dacha: catDachaModular, twostory: catTwostoryModular, studio: catStudioModular, guest: catGuestModular }) },
  { title: "Префаб дома", tech: "Префаб", items: makeHouseItems({ house: catHousesPrefab, dacha: catDachaPrefab, twostory: catTwostoryPrefab, studio: catStudioPrefab, guest: catGuestPrefab }) },
  {
    title: "Для бизнеса",
    items: [
      { name: "Глэмпинг", count: "31", img: catGlamping, tag: "soon", imgClass: "bottom-[-28px] right-[-16px]" },
    ],
  },
];

const tagConfig: Record<Tag, { bg: string; text: string; label: string }> = {
  new: { bg: "bg-green-100", text: "text-green-700", label: "новое" },
  soon: { bg: "bg-blue-100", text: "text-blue-700", label: "скоро" },
  later: { bg: "bg-gray-100", text: "text-gray-500", label: "потом" },
};

const AllCategoriesPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-secondary font-sans flex flex-col">
      <Seo
        title="Категории — модульные дома, бани, глэмпинг | многоместа.рф"
        description="Все категории проектов: жилые дома, бани, глэмпинг, гостевые дома, коммерческие модули и многое другое."
        canonicalPath="/categories"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Главная", item: "https://многоместа.рф/" },
            { "@type": "ListItem", position: 2, name: "Категории", item: "https://многоместа.рф/categories" },
          ],
        }}
      />
      {/* Desktop header */}
      {!isMobile && <Header />}

      {/* Mobile: Search bar — bento header */}
      {isMobile && (
        <div className="sticky top-0 z-40 bg-background rounded-b-2xl px-3 pt-5 pb-3 shadow-sm">
          <SearchDropdown inputClassName="bg-secondary" />
        </div>
      )}

      {/* Content */}
      <div className={`${isMobile ? "mt-2" : "mt-[108px]"} flex-1 flex flex-col`}>
        <div className={isMobile ? "" : "max-w-[1400px] mx-auto w-full"}>
          <div className={`bg-background ${isMobile ? "rounded-t-2xl px-3 py-4 pb-24" : "rounded-b-2xl px-8 py-8 mb-6"} flex-grow`}>
            {/* Mobile Hero Banner inside bento */}
            {isMobile && (
              <div className="mb-4">
                <div
                  className="rounded-2xl overflow-hidden relative cursor-pointer bg-primary"
                  onClick={() => navigate("/catalog")}
                >
                  <img
                    src={catHouses}
                    alt=""
                    className="absolute -bottom-12 -right-16 w-[240px] h-[240px] object-contain pointer-events-none z-10 opacity-90"
                  />
                  <div className="relative z-20 px-4 py-3 flex flex-col">
                    <h2 className="text-[22px] font-bold leading-[1.15] tracking-tight mb-1 max-w-[65%] text-white">
                      Сотни быстро-<br/>возводимых домов
                    </h2>
                    <p className="text-[12px] font-light leading-[1.4] mt-1 mb-2.5 max-w-[55%] text-white/70">
                      Находите проекты от&nbsp;проверенных производителей.
                    </p>
                  </div>
                </div>
              </div>
            )}
            {sections.map((section, sIdx) => (
            <div key={section.title} className={sIdx > 0 ? "mt-6" : ""}>
              <div className="flex items-center gap-2 mb-3">
                <h2 className={`${isMobile ? "text-[20px]" : "text-[22px]"} font-semibold text-foreground`}>{section.title}</h2>
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-foreground ml-[1px]"><polyline points="9 18 15 12 9 6"/></svg>
                </div>
              </div>

              <div className={`grid ${isMobile ? "grid-cols-3" : "grid-cols-4 lg:grid-cols-5"} gap-2 md:gap-3`} style={section.items.length <= 3 && !isMobile ? { display: 'flex', flexWrap: 'wrap' } : undefined}>
                {section.items.map((item) => {
                  const isPartner = item.name === "Стать партнером";
                  const isSmallSection = section.items.length <= 3 && !isMobile;
                  const targetUrl = section.tech ? `/catalog?tech=${encodeURIComponent(section.tech)}` : "/catalog";
                  const card = (
                    <button
                      key={item.name}
                      onClick={() => !isPartner && item.tag !== "soon" && item.tag !== "later" ? navigate(targetUrl) : undefined}
                      className={`bg-secondary rounded-2xl p-2.5 md:p-3.5 flex flex-col items-start text-left overflow-hidden relative ${isMobile ? "h-[95px]" : "h-[180px]"} ${item.span === 2 ? "col-span-2" : ""} ${item.tag === "soon" || item.tag === "later" ? "opacity-45 grayscale pointer-events-none" : "hover:text-primary active:text-primary transition-colors"} ${isSmallSection && !isPartner ? "w-[calc(20%-10px)]" : isSmallSection && isPartner ? "w-full" : ""}`}
                    >
                      <span className={`${isMobile ? "text-[13px]" : "text-[14px]"} font-normal leading-tight z-10 whitespace-pre-line max-w-[85%]`}>
                        {item.name}
                      </span>
                      {item.tag && (
                        <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded mt-1 z-10 ${tagConfig[item.tag].bg} ${tagConfig[item.tag].text}`}>
                          {tagConfig[item.tag].label}
                        </span>
                      )}
                      <img
                        src={item.img}
                        alt={item.name}
                        loading={sIdx === 0 ? "eager" : "lazy"}
                        decoding="async"
                        width={isMobile ? 100 : 180}
                        height={isMobile ? 100 : 180}
                        className={`absolute object-contain ${isMobile ? "w-[100px] h-[100px]" : "w-[180px] h-[180px]"} ${
                          item.name === "Дома" 
                            ? (isMobile ? "bottom-[-14px] right-[-32px]" : "bottom-[-20px] right-[-50px]")
                            : item.imgClass || (isMobile ? "bottom-[-14px] right-[-16px]" : "bottom-[-24px] right-[-26px]")
                        }`}
                      />
                    </button>
                  );
                  if (isPartner) {
                    return <div key={item.name} className={`cursor-pointer ${section.items.length <= 3 && !isMobile ? "w-[calc(20%-10px)]" : ""}`} onClick={() => navigate("/partner")}>{card}</div>;
                  }
                  return card;
                })}
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>
      <MobileTabBar />
    </div>
  );
};

export default AllCategoriesPage;
