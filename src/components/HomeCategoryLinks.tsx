import { Link } from "react-router-dom";
import catHousesModular from "@/assets/cat-houses-modular.webp";
import catHousesPrefab from "@/assets/cat-houses-prefab.webp";
import catDachaModular from "@/assets/cat-dacha-modular.webp";
import catGuestModular from "@/assets/cat-guest-modular.webp";
import catStudioModular from "@/assets/cat-studio-modular.webp";
import catTerrace from "@/assets/cat-terrace.webp";
import catTwostory from "@/assets/cat-twostory-modular.webp";
import catHouses from "@/assets/cat-houses.webp";
import catDacha from "@/assets/cat-dacha.webp";

const categoryLinks = [
  {
    title: "Модульные дома",
    caption: "Готовые проекты заводской сборки",
    href: "/catalog?tech=Модульный дом",
    image: catHousesModular,
  },
  {
    title: "Каркасные дома",
    caption: "Проекты для дачи и ПМЖ",
    href: "/catalog?tech=Каркасный",
    image: catHouses,
  },
  {
    title: "Барнхаусы",
    caption: "Современная архитектура с террасами",
    href: "/catalog?q=барнхаус",
    image: catHousesPrefab,
  },
  {
    title: "Дома до 3 млн",
    caption: "Компактные решения с понятным бюджетом",
    href: "/catalog?maxPrice=3000000",
    image: catStudioModular,
  },
  {
    title: "Дома 50–80 м²",
    caption: "Популярный размер для семьи",
    href: "/catalog?minArea=50&maxArea=80",
    image: catGuestModular,
  },
  {
    title: "Дома для ПМЖ",
    caption: "Круглогодичное проживание",
    href: "/catalog?q=пмж",
    image: catTwostory,
  },
  {
    title: "Дома с террасой",
    caption: "Проекты для отдыха за городом",
    href: "/catalog?q=терраса",
    image: catTerrace,
  },
  {
    title: "Мини-дома",
    caption: "Небольшие дома и студии",
    href: "/catalog?maxArea=50",
    image: catDachaModular,
  },
  {
    title: "Дачные дома",
    caption: "Сезонные и компактные проекты",
    href: "/catalog?q=дача",
    image: catDacha,
  },
];

const HomeCategoryLinks = () => {
  return (
    <section className="mx-auto w-full max-w-[1400px] px-4 pb-2 pt-12 sm:px-8 sm:pt-16 lg:px-12">
      <div className="flex items-baseline justify-between mb-4 sm:mb-5">
        <h2 className="text-[11px] md:text-[12px] font-semibold uppercase tracking-[0.16em] text-[#342d27]">
          Популярные подборки
        </h2>
        <Link
          to="/categories"
          className="text-[10px] md:text-[11px] font-medium uppercase tracking-[0.16em] text-primary transition-colors hover:text-primary/80 focus-visible:outline-none"
        >
          Все категории
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-2">
        {categoryLinks.map((item) => (
          <Link
            key={item.title}
            to={item.href}
            className="group relative overflow-hidden rounded-[3px] border border-[#dfe5f5] bg-white min-h-[172px] md:min-h-[220px] p-3 md:p-4 flex flex-col justify-between transition-colors hover:border-primary/40"
          >
            <div className="relative z-10">
              <h3 className="text-[13px] md:text-[16px] font-semibold leading-tight text-[#342d27]">
                {item.title}
              </h3>
              <p className="mt-1.5 text-[10px] md:text-[12px] leading-snug text-muted-foreground max-w-[170px]">
                {item.caption}
              </p>
            </div>

            <img
              src={item.image}
              alt={item.title}
              loading="lazy"
              decoding="async"
              className="absolute right-[-16px] bottom-[-10px] w-[150px] h-[118px] md:w-[230px] md:h-[170px] object-contain transition-transform duration-300 group-hover:scale-[1.03]"
            />
          </Link>
        ))}
      </div>
    </section>
  );
};

export default HomeCategoryLinks;
