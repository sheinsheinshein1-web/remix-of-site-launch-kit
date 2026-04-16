import { ArrowRight, Search } from "lucide-react";
import PartnerDrawer from "@/components/PartnerDrawer";
import SearchDropdown from "./SearchDropdown";
import MobileTabBar from "./MobileTabBar";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
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

type Tag = "new" | "soon" | "later";

interface CategoryItem {
  name: string;
  count: string;
  img: string;
  tag?: Tag;
  span?: number;
  imgClass?: string;
}

const sections: { title: string; items: CategoryItem[] }[] = [
  {
    title: "Дома",
    items: [
      { name: "Дома", count: "84", img: catHouses, imgClass: "bottom-[-20px] right-[-50px]" },
      { name: "Дачные домики", count: "19", img: catDacha, imgClass: "bottom-[-20px] right-[-16px]" },
      { name: "Двух-\nэтажные", count: "15", img: catTwostory, imgClass: "bottom-[-20px] right-[-16px]" },
      { name: "Студии", count: "12", img: catStudio, tag: "soon", imgClass: "bottom-[-20px] right-[-16px]" },
      { name: "Гостевые дома", count: "28", img: catGuest, tag: "soon" },
    ],
  },
  {
    title: "Бани и отдых",
    items: [
      { name: "Бани и сауны", count: "46", img: catBaths, tag: "soon", imgClass: "bottom-[-22px] right-[-16px]" },
      { name: "Бани-бочки", count: "14", img: catBarrelBath, tag: "soon", imgClass: "bottom-[-22px] right-[-16px]" },
      { name: "Купели и чаны", count: "8", img: catHotTub, tag: "soon" },
      { name: "Беседки", count: "11", img: catGazebo, tag: "soon" },
      { name: "Террасы", count: "7", img: catTerrace, tag: "soon" },
      { name: "Барбекю-зоны", count: "5", img: catBbq, tag: "soon" },
    ],
  },
  {
    title: "Для бизнеса",
    items: [
      { name: "Глэмпинг", count: "31", img: catGlamping, imgClass: "bottom-[-28px] right-[-16px]" },
      { name: "Магазины", count: "25", img: catCommercial, tag: "soon" },
      { name: "Офисы", count: "11", img: catOffice, tag: "soon" },
      { name: "Мастерские", count: "8", img: catWorkshop, tag: "soon" },
      { name: "Гостиницы", count: "3", img: catHotel, tag: "soon" },
      { name: "Кафе и\nрестораны", count: "2", img: catCafe, tag: "soon" },
    ],
  },
  {
    title: "Участок и инженерия",
    items: [
      { name: "Бытовки", count: "14", img: catShed, tag: "soon", imgClass: "bottom-[-14px] right-[-22px]" },
      { name: "Гаражи", count: "6", img: catGarage, tag: "soon" },
      { name: "Навесы", count: "4", img: catCanopy, tag: "soon" },
      { name: "Заборы", count: "3", img: catFence, tag: "soon" },
      { name: "Септики", count: "5", img: catSeptic, tag: "soon" },
      { name: "Скважины", count: "2", img: catWell, tag: "soon" },
    ],
  },
  {
    title: "Сервисы",
    items: [
      { name: "Стать партнером", count: "", img: catPartner, imgClass: "bottom-[-34px] right-[-16px]" },
      
      { name: "Ипотека", count: "", img: catMortgage, tag: "soon", imgClass: "bottom-[-20px] right-[-16px]" },
    ],
  },
  {
    title: "Блог",
    items: [
      { name: "Как выбрать\nдом", count: "2 мин", img: catGuide, imgClass: "bottom-[-24px] right-[-16px]" },
      { name: "Право и\nдокументы", count: "2 мин", img: catLaw, tag: "soon" },
      { name: "Истории\nпокупателей", count: "2 мин", img: catStories, tag: "soon" },
      { name: "Глэмпинг-\nбизнес", count: "2 мин", img: catGlampingBiz, tag: "soon" },
      { name: "Сезонные\nподборки", count: "2 мин", img: catSeasonal, tag: "later" },
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
      {/* Desktop header */}
      {!isMobile && <Header />}

      {/* Mobile: Search bar — bento header */}
      {isMobile && (
        <div className="sticky top-0 z-40 bg-background rounded-b-2xl px-3 pt-5 pb-3 shadow-sm">
          <SearchDropdown inputClassName="bg-secondary" />
        </div>
      )}

      {/* Mobile Hero Banner */}
      {isMobile && (
        <div className="px-3 mt-2">
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
                Сотни модульных домов на&nbsp;одном сайте
              </h2>
              <p className="text-[12px] font-light leading-[1.4] mt-1 mb-2.5 max-w-[55%] text-white/70">
                Находите проекты от&nbsp;проверенных производителей.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className={`${isMobile ? "mt-2" : "mt-[152px]"} flex-1 flex flex-col`}>
        <div className={isMobile ? "" : "w-[calc(100%-64px)] max-w-[1336px] mx-auto"}>
          <div className={`bg-background ${isMobile ? "rounded-t-2xl px-3 py-4 pb-24" : "rounded-2xl px-8 py-8 mb-8"} flex-grow`}>
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
                  const card = (
                    <button
                      key={item.name}
                      onClick={() => !isPartner && item.tag !== "soon" && item.tag !== "later" ? navigate("/catalog") : undefined}
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
                        loading="eager"
                        decoding="sync"
                        fetchPriority="high"
                        className={`absolute object-contain ${isMobile ? "w-[100px] h-[100px]" : "w-[180px] h-[180px]"} ${
                          item.name === "Дома" 
                            ? (isMobile ? "bottom-[-14px] right-[-16px]" : "bottom-[-20px] right-[-50px]")
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
