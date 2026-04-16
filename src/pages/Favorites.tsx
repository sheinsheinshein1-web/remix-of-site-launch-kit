import { useState, useEffect } from "react";
import { formatSpecs } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { navigateWithTransition } from "@/lib/viewTransition";
import { Heart, Check, MoreHorizontal, Grid2X2, List, Calculator, Search, ArrowUpDown, SlidersHorizontal, Camera, Truck } from "lucide-react";
import SwipeableGallery from "@/components/SwipeableGallery";
import MobileTabBar from "@/components/MobileTabBar";
import Header from "@/components/Header";
import { useIsMobile } from "@/hooks/use-mobile";
import { useFavorites } from "@/contexts/FavoritesContext";
import { Drawer, DrawerContent } from "@/components/ui/drawer";

import house1 from "@/assets/house-1.jpg";
import house2 from "@/assets/house-2.jpg";
import house3 from "@/assets/house-3.jpg";
import house4 from "@/assets/house-4.jpg";
import house5 from "@/assets/house-5.jpg";
import house6 from "@/assets/house-6.jpg";
import house7 from "@/assets/house-7.jpg";
import house8 from "@/assets/house-8.jpg";
import house9 from "@/assets/house-9.jpg";
import heart3d from "@/assets/heart-3d.png";

const allHouseImages = [house1, house2, house3, house4, house5, house6, house7, house8, house9];

function getProjectImages(mainImage: string, id: number): string[] {
  const others = allHouseImages.filter(img => img !== mainImage);
  const sorted = [...others].sort((a, b) => {
    const ha = a.charCodeAt(a.length - 5) ^ id;
    const hb = b.charCodeAt(b.length - 5) ^ id;
    return ha - hb;
  });
  return [mainImage, ...sorted.slice(0, 3)];
}

const favoriteProjects = [
  { id: 1, badge: "Дом", maker: "СибМодуль", makerFull: "СибМодуль · Новосибирск", name: "Тайга 72", price: "2 450 000 ₽", area: "72 м²", term: "4–6 нед.", type: "Жилой дом", purpose: "ИЖС / СНТ", image: house1 },
  { id: 2, badge: "Глэмпинг", maker: "ГлэмпингСтрой", makerFull: "ГлэмпингСтрой · Сочи", name: "Купол Альпика", price: "1 200 000 ₽", area: "36 м²", term: "1 нед.", type: "Глэмпинг", purpose: "Коммерч.", image: house3 },
  { id: 3, badge: "Баня", maker: "УралДом", makerFull: "УралДом · Екатеринбург", name: "Кедр 24", price: "890 000 ₽", area: "24 м²", term: "2 нед.", type: "Баня", purpose: "СНТ / ИЖС", image: house2 },
  { id: 4, badge: "Дом", maker: "МодульХаус", makerFull: "МодульХаус · Москва", name: "Loft 48", price: "1 750 000 ₽", area: "48 м²", term: "3–5 нед.", type: "Жилой дом", purpose: "ИЖС", image: house1 },
  { id: 5, badge: "Корпус", maker: "ДомКомплект", makerFull: "ДомКомплект · Казань", name: "Гостевой G-120", price: "3 900 000 ₽", area: "120 м²", term: "6–8 нед.", type: "Гостевой корпус", purpose: "Коммерч.", image: house2 },
];

const savedCalcs = [
  {
    id: 1, name: "Тайга 72 · МО", date: "22 марта 2026",
    rows: [
      { label: "Проект и производство", value: "1 200 000 ₽" },
      { label: "Доставка", value: "180 000 ₽" },
      { label: "Фундамент (сваи)", value: "120 000 ₽" },
      { label: "Монтаж", value: "150 000 ₽" },
    ],
    total: "1 650 000 ₽",
  },
  {
    id: 2, name: "Кедр 24 · Краснодар", date: "20 марта 2026",
    rows: [
      { label: "Проект и производство", value: "890 000 ₽" },
      { label: "Доставка", value: "220 000 ₽" },
      { label: "Фундамент (лента)", value: "95 000 ₽" },
      { label: "Монтаж", value: "45 000 ₽" },
    ],
    total: "1 250 000 ₽",
  },
];

type TabKey = "projects" | "compare" | "calcs";

const tabs: { key: TabKey; label: string; count: number }[] = [
  { key: "projects", label: "Проекты", count: 5 },
  { key: "compare", label: "Сравнение", count: 3 },
  { key: "calcs", label: "Расчёты", count: 2 },
];

const GridIcon = ({ active }: { active: boolean }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect x="0" y="0" width="6" height="6" rx="1.5" fill={active ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"} />
    <rect x="8" y="0" width="6" height="6" rx="1.5" fill={active ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"} />
    <rect x="0" y="8" width="6" height="6" rx="1.5" fill={active ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"} />
    <rect x="8" y="8" width="6" height="6" rx="1.5" fill={active ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"} />
  </svg>
);

const ListIcon = ({ active }: { active: boolean }) => (
  <svg width="16" height="14" viewBox="0 0 16 14" fill="none">
    <rect x="0" y="0" width="16" height="4" rx="1.5" fill={active ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"} />
    <rect x="0" y="5" width="16" height="4" rx="1.5" fill={active ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"} />
    <rect x="0" y="10" width="16" height="4" rx="1.5" fill={active ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"} />
  </svg>
);

/* ─── PROJECT CARD ─── */
const ProjectCard = ({ item }: { item: typeof favoriteProjects[0] }) => (
  <div className="cursor-pointer">
    <div className="rounded-[14px] overflow-hidden relative">
      <img src={item.image} alt={item.name} className="w-full aspect-[16/10] object-cover" loading="lazy" />
      <span className="absolute top-2.5 left-2.5 text-[11px] font-normal bg-black/45 text-white rounded-md px-2.5 py-1">{item.badge}</span>
      <button className="absolute top-2 right-2 flex items-center gap-1 bg-foreground/40 backdrop-blur-md rounded-full px-2.5 py-[5px]">
        <Heart className="w-3.5 h-3.5 fill-primary text-primary" strokeWidth={1.5} />
        <span className="text-[11px] font-medium text-white">124</span>
      </button>
    </div>
    <div className="pt-2.5 px-0.5">
      <p className="text-[11px] font-light text-muted-foreground mb-0.5">{item.maker}</p>
      <h3 className="text-[15px] font-medium text-foreground mb-1.5">{item.name}</h3>
      <div className="flex items-center justify-between">
        <span className="text-[14px] font-medium text-foreground">{item.price}</span>
        <div className="flex items-center gap-2 text-xs font-light text-muted-foreground">
          <span>{item.area}</span>
          <span>·</span>
          <span>{item.term}</span>
        </div>
      </div>
    </div>
  </div>
);

/* ─── CALC CARD ─── */
const CalcCard = ({ calc }: { calc: typeof savedCalcs[0] }) => (
  <div className="border border-border rounded-[14px] p-5">
    <div className="flex justify-between items-start mb-3.5">
      <div>
        <p className="text-[15px] font-medium text-foreground">{calc.name}</p>
        <p className="text-xs font-light text-muted-foreground mt-0.5">{calc.date}</p>
      </div>
      <MoreHorizontal className="w-5 h-5 text-muted-foreground cursor-pointer" strokeWidth={1.5} />
    </div>
    <div className="flex flex-col gap-[7px] mb-3.5">
      {calc.rows.map((row) => (
        <div key={row.label} className="flex justify-between">
          <span className="text-[13px] font-light text-muted-foreground">{row.label}</span>
          <span className="text-[13px] font-light text-foreground">{row.value}</span>
        </div>
      ))}
    </div>
    <div className="flex justify-between pt-3 border-t border-border mb-3.5">
      <span className="text-sm font-medium text-foreground">Итого под ключ</span>
      <span className="text-base font-medium text-primary">{calc.total}</span>
    </div>
    <div className="flex gap-2">
      <button className="flex-1 text-[13px] font-light text-muted-foreground border border-border rounded-lg py-2.5 hover:bg-secondary transition-colors">Удалить</button>
      <button className="flex-1 text-[13px] font-normal text-primary-foreground bg-primary rounded-lg py-2.5 hover:opacity-90 transition-opacity">Отправить производителю</button>
    </div>
  </div>
);

const favChips = ["Все", "Дома", "Бани", "Глэмпинг", "Гостевые"];

const Favorites = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("projects");
  const [compareSelected, setCompareSelected] = useState<Set<number>>(new Set([1, 2]));
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortOrder, setSortOrder] = useState<"date" | "price_asc" | "price_desc">("date");
  const [activeChip, setActiveChip] = useState("Все");
  const [collapsed, setCollapsed] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState("popular");

  const sortOptions = [
    { value: "popular", label: "Популярные" },
    { value: "new", label: "Недавно добавленные" },
    { value: "cheap", label: "Дешевле" },
    { value: "expensive", label: "Дороже" },
    { value: "area_asc", label: "По площади м², от меньшего" },
    { value: "area_desc", label: "По площади м², от большего" },
  ];
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { favoriteItems, toggleFavorite } = useFavorites();

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setCollapsed(y > 60 && y > lastY);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleCompare = (id: number) => {
    setCompareSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  /* ═══════ MOBILE ═══════ */
  if (isMobile) {
    return (
      <div className="min-h-screen bg-muted font-sans flex flex-col">
        {/* Search bar — catalog-style header */}
        <div className="sticky top-0 z-40">
          <div className="bg-background rounded-b-2xl shadow-sm pt-[env(safe-area-inset-top)]">
            <div className="px-4 pt-5 pb-3 flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Найти в избранном"
                  className="w-full h-12 pl-9 pr-4 rounded-xl bg-secondary text-[16px] font-light text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30"
                />
              </div>
            </div>

            {/* View toggle, sort & chips */}
            <div className={`transition-all duration-300 overflow-hidden ${collapsed ? "max-h-0 pb-0" : "max-h-[60px] pb-2.5"}`}>
              <div className="px-4 flex items-center gap-2 overflow-x-auto scrollbar-hide">
              <div className="flex bg-secondary rounded-xl p-1 gap-0.5 h-10 shrink-0">
                <button
                  onClick={() => setViewMode("list")}
                  className={`w-[32px] rounded-lg flex items-center justify-center ${viewMode === "list" ? "bg-background" : ""}`}
                >
                  <ListIcon active={viewMode === "list"} />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`w-[32px] rounded-lg flex items-center justify-center ${viewMode === "grid" ? "bg-background" : ""}`}
                >
                  <GridIcon active={viewMode === "grid"} />
                </button>
              </div>
              <div className="flex-1" />
              <button
                onClick={() => setSortOpen(true)}
                className="flex items-center justify-center bg-secondary rounded-xl w-10 h-10 shrink-0"
              >
                <ArrowUpDown className="w-5 h-5 text-muted-foreground" strokeWidth={2.5} />
              </button>
            </div>
            </div>
          </div>
        </div>

        {favoriteItems.length === 0 ? (
          <div className="bg-card rounded-t-2xl mt-2 flex-1 flex flex-col items-center text-center px-6 pt-20 pb-32">
            {/* 3D heart illustration */}
            <div className="w-44 h-44 mb-4">
              <img src={heart3d} alt="" className="w-full h-full object-contain" loading="eager" decoding="sync" fetchPriority="high" />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">Здесь пока пусто</h2>
            <p className="text-[13px] text-muted-foreground leading-relaxed max-w-[260px]">
              Нажмите на сердечко в карточке проекта — и он сохранится сюда. Так вы сможете быстро вернуться к понравившимся вариантам.
            </p>
          </div>
        ) : (
          <div className="mt-2 flex flex-col pb-[calc(140px+env(safe-area-inset-bottom))]">

            {/* Cards */}
            <div className={`bg-background rounded-2xl px-2 py-3 ${viewMode === "grid" ? "" : ""}`}>
            <div className={viewMode === "grid" ? "grid grid-cols-2 gap-x-[2px] gap-y-[6px]" : "flex flex-col gap-[10px]"}>
              {favoriteItems.map((item) => viewMode === "list" ? (
                <div key={item.id} onClick={(e) => navigateWithTransition(e, navigate, `/project/${item.id}`)} className="cursor-pointer overflow-hidden">
                  <SwipeableGallery images={getProjectImages(item.image, item.id)} alt={item.name} height="h-[260px]">
                    <div className="absolute top-2 right-2 z-10">
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(item); }}
                        className="flex items-center gap-1 bg-foreground/40 backdrop-blur-md rounded-full px-2 py-[4px]"
                      >
                        <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" strokeWidth={1.5} />
                        <span className="text-[11px] font-medium text-white">{item.likes}</span>
                      </button>
                    </div>
                  </SwipeableGallery>
                  <div className="px-[10px] pt-1 pb-1">
                    <div className="text-[12px] font-bold text-foreground">от {item.price}</div>
                    <p className="text-[12px] font-normal text-foreground/80 whitespace-nowrap leading-none mt-[2px]">{formatSpecs(item.area, item.beds, item.baths)}</p>
                  </div>
                </div>
              ) : (
                <div key={item.id} onClick={(e) => navigateWithTransition(e, navigate, `/project/${item.id}`)} className="cursor-pointer overflow-hidden">
                  <SwipeableGallery images={getProjectImages(item.image, item.id)} alt={item.name} height="h-[260px]">
                    <div className="absolute top-2 right-2 z-10">
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(item); }}
                        className="flex items-center gap-1 bg-foreground/40 backdrop-blur-md rounded-full px-2 py-[4px]"
                      >
                        <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" strokeWidth={1.5} />
                        <span className="text-[11px] font-medium text-white">{item.likes}</span>
                      </button>
                    </div>
                  </SwipeableGallery>
                  <div className="px-[10px] pt-1 pb-1">
                    <div className="text-[12px] font-bold text-foreground">от {item.price}</div>
                    <p className="text-[12px] font-normal text-foreground/80 whitespace-nowrap leading-none mt-[2px]">{formatSpecs(item.area, item.beds, item.baths)}</p>
                  </div>
                </div>
              ))}
            </div>
            </div>
          </div>
        )}

        {/* Sort Drawer */}
        <Drawer open={sortOpen} onOpenChange={setSortOpen}>
          <DrawerContent className="mx-0 rounded-t-[20px] p-0">
            <div className="px-5 pt-5 pb-2">
              <h3 className="text-[20px] font-semibold text-foreground">Показать сначала</h3>
            </div>
            <div className="bg-secondary rounded-xl mx-4 mb-6 divide-y divide-border/50">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => { setSortBy(option.value); setSortOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-4 text-left"
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${sortBy === option.value ? "border-primary" : "border-muted-foreground/30"}`}>
                    {sortBy === option.value && <div className="w-3 h-3 rounded-full bg-primary" />}
                  </div>
                  <span className="text-[16px] text-foreground">{option.label}</span>
                </button>
              ))}
            </div>
          </DrawerContent>
        </Drawer>

        <MobileTabBar />
      </div>
    );
  }

  /* ═══════ DESKTOP ═══════ */
  return (
    <div className="min-h-screen bg-secondary font-sans">
      <Header />
      <div className="pt-[152px] pb-8">
        <div className="max-w-[1400px] mx-auto px-8">
          {/* Sort row */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-[13px] font-light text-muted-foreground">{favoriteItems.length > 0 ? `${favoriteItems.length} проектов` : "Нет проектов"}</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-[13px] font-light text-muted-foreground bg-background border-none rounded-xl px-3 py-1.5 outline-none"
              >
                {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div className="flex bg-background rounded-xl p-0.5 gap-0.5">
              <button onClick={() => setViewMode("grid")} className={`w-8 h-7 rounded-lg flex items-center justify-center ${viewMode === "grid" ? "bg-secondary" : ""}`}>
                <GridIcon active={viewMode === "grid"} />
              </button>
              <button onClick={() => setViewMode("list")} className={`w-8 h-7 rounded-lg flex items-center justify-center ${viewMode === "list" ? "bg-secondary" : ""}`}>
                <ListIcon active={viewMode === "list"} />
              </button>
            </div>
          </div>

          {favoriteItems.length === 0 ? (
            <div className="bg-background rounded-2xl flex flex-col items-center text-center px-6 py-20">
              <div className="w-44 h-44 mb-4">
                <img src={heart3d} alt="" className="w-full h-full object-contain" loading="eager" decoding="sync" />
              </div>
              <h2 className="text-lg font-semibold text-foreground mb-2">Здесь пока пусто</h2>
              <p className="text-[13px] text-muted-foreground leading-relaxed max-w-[300px]">
                Нажмите на сердечко в карточке проекта — и он сохранится сюда.
              </p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-3 gap-4">
              {favoriteItems.map((item) => (
                <div key={item.id} onClick={(e) => navigateWithTransition(e, navigate, `/project/${item.id}`)} className="cursor-pointer bg-background rounded-2xl overflow-hidden shadow-sm">
                  <SwipeableGallery images={getProjectImages(item.image, item.id)} alt={item.name} height="h-[260px]">
                    <div className="absolute top-2.5 right-2.5 z-10">
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(item); }}
                        className="flex items-center gap-1 bg-foreground/40 backdrop-blur-md rounded-full px-2 py-[4px]"
                      >
                        <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" strokeWidth={1.5} />
                        <span className="text-[11px] font-medium text-white">{item.likes}</span>
                      </button>
                    </div>
                  </SwipeableGallery>
                  <div className="px-[10px] pt-2 pb-[10px]">
                    <div className="text-[14px] font-bold text-foreground mb-[1px]">{item.price}</div>
                    <div className="text-[12px] text-muted-foreground mb-[6px]">{item.name}</div>
                    <p className="text-[12px] font-normal text-foreground/80 whitespace-nowrap leading-none mt-[2px]">{formatSpecs(item.area, item.beds, item.baths)}</p>
                    <div className="h-px bg-border mb-[6px]" />
                    <div className="flex items-center gap-2 overflow-hidden will-change-transform" style={{ maskImage: 'linear-gradient(to right, black calc(100% - 10px), transparent)', WebkitMaskImage: 'linear-gradient(to right, black calc(100% - 10px), transparent)' }}>
                      <div className="flex items-center gap-[3px] flex-shrink-0">
                        <span className="text-[10px] text-yellow-500">★</span>
                        <span className="text-[10px] font-semibold text-foreground mr-[2px]">4.8</span>
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">{item.maker.split(" · ")[0]}</span>
                      </div>
                      <div className="flex items-center gap-[3px] flex-shrink-0">
                        <Truck className="w-[10px] h-[10px] text-green-700" strokeWidth={2.5} />
                        <span className="text-[10px] text-green-700 whitespace-nowrap">{item.city}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3.5">
              {favoriteItems.map((item) => (
                <div key={item.id} onClick={(e) => navigateWithTransition(e, navigate, `/project/${item.id}`)} className="flex gap-4 cursor-pointer bg-background rounded-2xl overflow-hidden group hover:shadow-sm transition-shadow">
                  <div className="w-[200px] flex-shrink-0 relative overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(item); }}
                        className="flex items-center gap-1 bg-foreground/40 backdrop-blur-md rounded-full px-2 py-[4px]"
                      >
                        <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" strokeWidth={1.5} />
                        <span className="text-[11px] font-medium text-white">{item.likes}</span>
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 py-4 pr-5 flex flex-col justify-center gap-1">
                    <p className="text-xs font-light text-muted-foreground">{item.maker.split(" · ")[0]}</p>
                    <h3 className="text-[17px] font-medium text-foreground">{item.name}</h3>
                    <p className="text-[12px] font-normal text-foreground/80">{formatSpecs(item.area, item.beds, item.baths)}</p>
                    <p className="text-lg font-medium text-foreground mt-1">{item.price}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1">
                        <span className="text-[11px] text-yellow-500">★</span>
                        <span className="text-[11px] font-semibold text-foreground">4.8</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Truck className="w-[11px] h-[11px] text-green-700" strokeWidth={2.5} />
                        <span className="text-[11px] text-green-700">{item.city}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Favorites;
