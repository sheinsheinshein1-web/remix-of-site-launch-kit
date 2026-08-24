import { useNavigate } from "react-router-dom";
import catAll from "@/assets/cat-all.webp";
import catHouses from "@/assets/cat-houses.webp";
import catBaths from "@/assets/cat-baths.webp";
import catGlamping from "@/assets/cat-glamping.webp";
import catDacha from "@/assets/cat-dacha.webp";
import catShed from "@/assets/cat-shed.webp";
import catTwostory from "@/assets/cat-twostory.webp";
import catBarrelBath from "@/assets/cat-barrel-bath.webp";
import catPartner from "@/assets/partner-icon.webp";
import catGuide from "@/assets/cat-guide.webp";
import PartnerDrawer from "@/components/PartnerDrawer";
import { CATALOG_PATH } from "@/lib/siteRoutes";

type Category = {
  name: string;
  count: string;
  img: string;
  imgClass?: string;
  isAll?: boolean;
  isPartner?: boolean;
  tag?: "soon";
};

const categories: Category[] = [
  { name: "Все", count: "214", img: catAll, isAll: true },
  { name: "Дома", count: "84", img: catHouses, imgClass: "bottom-[-28px] right-[-32px] md:right-[-60px]" },
  { name: "Глэмпинг", count: "31", img: catGlamping },
  { name: "Дачные\nдомики", count: "19", img: catDacha },
  { name: "Двух-\nэтажные", count: "15", img: catTwostory },
  { name: "Стать\nпартнером", count: "", img: catPartner, imgClass: "bottom-[-40px] right-[-16px]", isPartner: true },
  { name: "Как выбрать\nдом", count: "2 мин", img: catGuide },
  { name: "Бани-бочки", count: "14", img: catBarrelBath, tag: "soon" as const },
  { name: "Бани и\nсауны", count: "46", img: catBaths, tag: "soon" as const },
  { name: "Бытовки", count: "14", img: catShed, tag: "soon" as const },
];

const CategoryCard = ({ cat, onClick }: { cat: Category; onClick?: () => void }) => (
  <button
    onClick={onClick}
    className={`shrink-0 group h-[95px] md:w-auto md:h-auto md:aspect-[5/3] rounded-2xl p-2.5 md:p-3 flex flex-col items-start text-left transition-colors overflow-hidden relative bg-secondary hover:border-primary ${cat.tag ? "opacity-45 grayscale pointer-events-auto cursor-default" : ""}`}
  >
    <span className="text-[13px] md:text-base font-normal transition-colors z-10 max-w-[85%] leading-tight text-foreground group-hover:text-primary whitespace-pre-line">
      {cat.name}
    </span>
    {cat.tag && (
      <span className="mt-1 text-[10px] font-medium text-muted-foreground bg-white/80 rounded-full px-2 py-0.5 z-10">скоро</span>
    )}
    <img
      src={cat.img}
      alt={cat.name}
      loading="lazy"
      className={`absolute w-[120px] h-[120px] md:w-[200px] md:h-[200px] object-contain ${cat.imgClass || "bottom-[-28px] right-[-22px]"}`}
    />
  </button>
);

const CategoriesSection = () => {
  const navigate = useNavigate();

  return (
    <section>
      <div className="md:py-5">
        <div className="-mx-3 px-3 md:mx-0 md:px-0 grid grid-rows-2 grid-flow-col auto-cols-[calc(36vw-8px)] gap-2 overflow-x-auto scrollbar-hide md:grid-rows-none md:grid-flow-row md:auto-cols-auto md:grid-cols-5 md:gap-4">
          {categories.map((cat) => {
            if (cat.isPartner) {
              return (
                <CategoryCard
                  key={cat.name}
                  cat={cat}
                  onClick={() => navigate("/partner/")}
                />
              );
            }
            return (
              <CategoryCard
                key={cat.name}
                cat={cat}
                onClick={() => {
                  if (cat.tag) return;
                  navigate(cat.isAll ? "/categories/" : CATALOG_PATH);
                }}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
