import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Heart, Play, ChevronRight, ChevronDown, MoreHorizontal, Phone, MessageSquare, Share2, Bookmark, EyeOff, Flag, X, Ruler, BedDouble, Bath, Layers, Star, MessageCircleQuestion, Image, Send, MapPin, Maximize } from "lucide-react";
import Header from "@/components/Header";
import MobileTabBar from "@/components/MobileTabBar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useFavorites } from "@/contexts/FavoritesContext";
import CitySelector, { useCity } from "@/components/CitySelector";
import OtherProjectsFeed from "@/components/OtherProjectsFeed";
import house1 from "@/assets/house-1.jpg";
import house2 from "@/assets/house-2.jpg";
import house3 from "@/assets/house-3.jpg";
import house4 from "@/assets/house-4.jpg";
import house5 from "@/assets/house-5.jpg";
import house6 from "@/assets/house-6.jpg";
import house7 from "@/assets/house-7.jpg";
import house8 from "@/assets/house-8.jpg";
import house9 from "@/assets/house-9.jpg";
import wideHouse1 from "@/assets/wide-house-1.webp";
import wideHouse2 from "@/assets/wide-house-2.webp";
import wideHousePlan3d from "@/assets/wide-house-plan-3d.webp";
import wideHousePlan from "@/assets/wide-house-plan.webp";
import makerPlatforma from "@/assets/maker-platforma.png";

const defaultGallery = [
  { id: 1, image: house1, type: "photo" },
  { id: 2, image: house2, type: "photo" },
  { id: 3, image: house3, type: "photo" },
  { id: 4, image: house4, type: "photo" },
  { id: 5, image: house5, type: "video" },
];

// Переопределения данных проекта по id (минимальное решение для новых карточек).
const projectOverrides: Record<string, {
  name: string;
  maker: string;
  makerInitials: string;
  makerLogo?: string;
  price: string;
  area: string;
  beds: number;
  baths: number;
  floors: number;
  city: string;
  description: string;
  descriptionLong: string;
  gallery: { id: number; image: string; type: string; fit?: "cover" | "contain" }[];
}> = {
  "32": {
    name: "Wide House",
    maker: "Платформа",
    makerInitials: "ПЛ",
    makerLogo: undefined,
    price: "2 320 000 ₽",
    area: "46,4 м²",
    beds: 2,
    baths: 1,
    floors: 1,
    city: "Екатеринбург",
    description: "Одноэтажный дом 9,2 × 7,2 м с двускатной кровлей и террасой. Две спальни, санузел, кухня-гостиная.",
    descriptionLong: "Wide House — компактный загородный дом площадью 46,4 м² с продуманной планировкой: две спальни (6,25 и 13,88 м²), санузел 4,44 м², кухня 7,94 м², гостиная 8,9 м², прихожая 2,57 м² и терраса 10,36 м². Деревянный каркас, металлическая фальцевая кровля, панорамное остекление гостиной.",
    gallery: [
      { id: 1, image: wideHouse1, type: "photo" },
      { id: 2, image: wideHouse2, type: "photo", fit: "contain" },
      { id: 3, image: wideHousePlan3d, type: "photo", fit: "contain" },
      { id: 4, image: wideHousePlan, type: "photo", fit: "contain" },
    ],
  },
};

const baseParams = [
  { key: "Тип фундамента", value: "Свайный", link: true },
  { key: "Срок строительства", value: "3–6 месяцев" },
];

const constructParams = [
  { key: "Внешние стены", value: "Модульный дом", link: true },
  { key: "Вентиляция фасада", value: "Да" },
  { key: "Материал перекрытий", value: "Деревянные", link: true },
  { key: "Огнебиозащита", value: "Да" },
  { key: "Толщина стен", value: "220 мм" },
  { key: "Фасад", value: "Имитация бруса", link: true },
];

const insulationParams = [
  { key: "Пол первого этажа", value: "200 мм" },
  { key: "Внешние стены", value: "150 мм" },
  { key: "Кровля", value: "200 мм" },
  { key: "Утеплитель", value: "Минвата KNAUF" },
  { key: "Пароизоляция", value: "ONDUTISS PRO" },
];

const roofParams = [
  { key: "Покрытие", value: "Оцинк. профнастил", link: true },
  { key: "Водосточная система", value: "Да" },
];

const finishParams = [
  { key: "Фасад", value: "Имитация бруса А,Б" },
  { key: "Пол", value: "Ламинат 33 класс" },
  { key: "Двери", value: "CARDA soft touch" },
  { key: "Входная дверь", value: "Алюм. с остеклением" },
];

const engineeringParams = [
  { key: "Электроснабжение", value: "Розетки, автоматика" },
  { key: "Водоснабжение", value: "Разводка" },
];

const techParams = [
  { key: "Общая площадь", value: "60 м²" },
  { key: "Площадь застройки", value: "72 м²" },
  { key: "Тип фундамента", value: "Свайный", link: true },
  { key: "Материал стен", value: "Модульный дом", link: true },
  { key: "Толщина внешних стен", value: "220 мм" },
  { key: "Отделка фасада", value: "Имитация бруса", link: true },
  { key: "Материал кровли", value: "Оцинк. профнастил", link: true },
];

const planParams = [
  { key: "Высота потолков", value: "от 2,4 м" },
  { key: "Этажей", value: "1" },
  { key: "Спальни", value: "2" },
  { key: "Санузлы", value: "1" },
  { key: "Кухня-гостиная", value: "Да" },
  { key: "Веранда", value: "Да" },
];

const builtHouses = [
  { name: "Мидленд 66", photos: "6 фото", image: house6 },
  { name: "Шервуд 72", photos: "4 фото", image: house7 },
  { name: "Бонд 55", photos: "8 фото", image: house8 },
];

const reviews = [
  {
    initial: "М",
    name: "Максим С.",
    rating: "5.0",
    date: "Построено · 11 мар 26",
    text: "Решили построить дом-баню под сдачу. Долго выбирали подрядчика, читали отзывы, смотрели проекты…",
    builtTime: "Построен за 1–3 месяца",
  },
  {
    initial: "Д",
    name: "Дарья К.",
    rating: "5.0",
    date: "Построено · фев 26",
    text: "Мы живём здесь с 2024 года. Дом стал нашим любимым местом…",
    builtTime: "Построен за 2 месяца",
  },
];

const contractorProjects = [
  { name: "Мидленд 66", price: "от 4,4 млн ₽", meta: "56 м² · 2 спальни · 1 этаж", image: house6 },
  { name: "Шервуд 72", price: "от 4,4 млн ₽", meta: "70 м² · 2 спальни · 1 этаж", image: house7 },
  { name: "Бонд 88", price: "от 5,8 млн ₽", meta: "88 м² · 3 спальни · 1 этаж", image: house8 },
  { name: "Печора", price: "от 4,6 млн ₽", meta: "73 м² · 2 спальни · 1 этаж", image: house4 },
  { name: "БД-109", price: "от 5,7 млн ₽", meta: "109 м² · 3 спальни · 1 этаж", image: house5 },
  { name: "Тайга 72", price: "от 2,4 млн ₽", meta: "72 м² · 2 спальни · 1 этаж", image: house9 },
];

const similarProjects = [
  { name: "Печора", price: "от 4,6 млн ₽", meta: "73 м² · 2 спальни · 1 этаж", image: house4 },
  { name: "БД-109", price: "от 5,7 млн ₽", meta: "109 м² · 3 спальни · 1 этаж", image: house5 },
  { name: "Тайга 72", price: "от 2,4 млн ₽", meta: "72 м² · 2 спальни · 1 этаж", image: house9 },
];

const chatQuestions = [
  "Что нужно для строительства?",
  "Какие сроки строительства?",
  "Проконсультируете по строительству?",
];

const ParamRow = ({ item }: { item: { key: string; value: string; link?: boolean } }) => (
  <div className="flex justify-between items-center py-[11px] border-b border-border last:border-b-0">
    <span className="text-sm text-muted-foreground">{item.key}</span>
    <span className={`text-sm font-medium text-right ${item.link ? "text-primary" : "text-foreground"}`}>{item.value}</span>
  </div>
);

const ParamGroup = ({ title, params }: { title: string; params: { key: string; value: string; link?: boolean }[] }) => (
  <div className="mt-4">
    <div className="text-[15px] font-semibold text-foreground mb-2">{title}</div>
    <div className="flex flex-col">
      {params.map((p, i) => <ParamRow key={i} item={p} />)}
    </div>
  </div>
);

const ProjectCard = ({ project }: { project: { name: string; price: string; meta: string; image: string } }) => (
  <div className="flex-shrink-0 w-[160px]">
    <div className="h-[110px] rounded-xl overflow-hidden mb-2">
      <img src={project.image} alt={project.name} className="w-full h-full object-cover" loading="lazy" />
    </div>
    <div className="text-[13px] font-semibold text-foreground mb-0.5">{project.name}</div>
    <div className="text-xs font-medium text-green-600 mb-0.5">{project.price}</div>
    <div className="text-[11px] text-muted-foreground">{project.meta}</div>
  </div>
);

const ProjectDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isMobile = useIsMobile();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [activeImage, setActiveImage] = useState(0);

  // Данные проекта (с override по id)
  const override = id ? projectOverrides[id] : undefined;
  const project = {
    id: id ? Number(id) : 1,
    name: override?.name ?? "Шервуд 72.1",
    maker: override?.maker ?? "Sherwood Home",
    makerInitials: override?.makerInitials ?? "SW",
    makerLogo: override?.makerLogo,
    price: override?.price ?? "4 950 000 ₽",
    area: override?.area ?? "60 м²",
    beds: override?.beds ?? 2,
    baths: override?.baths ?? 1,
    floors: override?.floors ?? 1,
    cityDefault: override?.city,
    description: override?.description ?? "Компактный одноэтажный дом с панорамным остеклением. Каркасная технология, сборка за 45 дней.",
    descriptionLong: override?.descriptionLong ?? "Шервуд 72.1 — ваш дом за 6 недель. Компактный одноэтажный дом с продуманной планировкой для комфортной жизни за городом. Две изолированные спальни, просторная кухня-гостиная с панорамным остеклением и уютная веранда — всё, что нужно для семьи.",
  };
  const galleryImages = override?.gallery ?? defaultGallery;

  const projectFavItem = {
    id: project.id,
    badge: "Хит",
    maker: project.maker,
    name: project.name,
    price: `от ${project.price}`,
    area: project.area,
    beds: project.beds,
    baths: project.baths,
    term: "3–6 мес.",
    image: galleryImages[0]?.image ?? "",
    likes: 0,
    city: project.cityDefault ?? "",
  };
  const liked = isFavorite(projectFavItem.id);
  const handleToggleFav = () => toggleFavorite(projectFavItem);
  const [showActions, setShowActions] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);
  const [openSection, setOpenSection] = useState<"equipment" | "specs" | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const { city, selectCity } = useCity();
  const [cityOpen, setCityOpen] = useState(false);

  // Gallery slider touch
  const sliderRef = useRef<HTMLDivElement>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const touchStartX = useRef(0);
  const isDragging = useRef(false);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    isDragging.current = true;
    if (sliderRef.current) sliderRef.current.style.transition = 'none';
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current) return;
    setDragOffset(e.touches[0].clientX - touchStartX.current);
  }, []);

  const onTouchEnd = useCallback(() => {
    isDragging.current = false;
    if (sliderRef.current) sliderRef.current.style.transition = '';
    if (Math.abs(dragOffset) > 60) {
      if (dragOffset < 0 && activeImage < galleryImages.length - 1) {
        setActiveImage(prev => prev + 1);
      } else if (dragOffset > 0 && activeImage > 0) {
        setActiveImage(prev => prev - 1);
      }
    }
    setDragOffset(0);
  }, [dragOffset, activeImage]);

  const navigateBack = useCallback(() => navigate(-1), [navigate]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-muted pb-24 md:pb-0">
      {/* Desktop header */}
      <div className="hidden md:block"><Header /></div>
      {/* Sticky bento header on scroll */}
      {isMobile && (
        <div className={`fixed top-0 left-0 right-0 z-50 transition-opacity duration-300 ${scrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="bg-background px-3 pt-[max(env(safe-area-inset-top),12px)] pb-3 rounded-b-2xl shadow-sm">
            <div className="flex items-center justify-between">
              <button onClick={navigateBack} className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
                <ArrowLeft className="w-[18px] h-[18px] text-foreground" strokeWidth={1.8} />
              </button>
              <div className="flex-1 min-w-0 ml-3">
                <div className="text-[14px] font-semibold text-foreground truncate">{projectFavItem.name}</div>
                <div className="text-[13px] font-medium text-primary">{projectFavItem.price}</div>
              </div>
              <div className="flex items-center gap-2">
                <button className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center" onClick={() => { if (navigator.share) { navigator.share({ title: 'Проект', url: window.location.href }); } else { navigator.clipboard.writeText(window.location.href); } }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 100 103" fill="hsl(var(--foreground) / 0.8)" stroke="hsl(var(--foreground) / 0.8)" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round">
                    <path d="M53 20 L84 50 L53 80 L53 65 C30 65 15 75 10 93 C10 68 15 38 53 33 Z" />
                  </svg>
                </button>
                <button onClick={handleToggleFav} className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
                  <Heart className={`w-[18px] h-[18px] ${liked ? "text-red-500 fill-red-500" : "text-foreground"}`} strokeWidth={1.8} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Mobile floating nav - visible only when not scrolled */}
      {isMobile && (
        <div className={`fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-3 pt-3 transition-opacity duration-300 ${scrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <button
            onClick={navigateBack}
            className="w-9 h-9 rounded-xl bg-background shadow-sm flex items-center justify-center"
          >
            <ArrowLeft className="w-[18px] h-[18px] text-foreground" strokeWidth={1.8} />
          </button>
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 rounded-xl bg-background shadow-sm flex items-center justify-center" onClick={() => { if (navigator.share) { navigator.share({ title: 'Проект', url: window.location.href }); } else { navigator.clipboard.writeText(window.location.href); } }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 100 103" fill="hsl(var(--foreground) / 0.8)" stroke="hsl(var(--foreground) / 0.8)" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round">
                <path d="M53 20 L84 50 L53 80 L53 65 C30 65 15 75 10 93 C10 68 15 38 53 33 Z" />
              </svg>
            </button>
            <button
              onClick={handleToggleFav}
              className="w-9 h-9 rounded-xl bg-background shadow-sm flex items-center justify-center"
            >
              <Heart className={`w-[18px] h-[18px] ${liked ? "text-red-500 fill-red-500" : "text-foreground"}`} strokeWidth={1.8} />
            </button>
          </div>
        </div>
      )}

      {/* Actions bottom sheet */}
      {showActions && (
        <>
          <div className="fixed inset-0 z-[60] bg-black/40" onClick={() => setShowActions(false)} />
          <div className="fixed bottom-0 left-0 right-0 z-[60] bg-background rounded-t-2xl px-5 pb-8 pt-4 animate-in slide-in-from-bottom duration-200">
            <button onClick={() => setShowActions(false)} className="mb-4">
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
            <h3 className="text-lg font-medium text-foreground mb-4">Действия</h3>
            <div className="flex flex-col">
              {[
                { icon: Phone, label: "Позвонить" },
                { icon: MessageSquare, label: "Написать" },
                { icon: Share2, label: "Поделиться" },
                { icon: Heart, label: "Добавить в избранное" },
                { icon: Bookmark, label: "Оставить заметку" },
                { icon: EyeOff, label: "Скрыть объявление" },
                { icon: Flag, label: "Пожаловаться на объявление" },
              ].map(({ icon: Icon, label }, i) => (
                <button
                  key={label}
                  className={`flex items-center gap-3.5 py-3.5 text-[15px] font-light text-foreground ${i > 0 ? "border-t border-border" : ""}`}
                  onClick={() => setShowActions(false)}
                >
                  <Icon className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      <main className={`${isMobile ? "pt-0" : "pt-[140px] max-w-[1400px] mx-auto bg-background rounded-2xl px-8 pb-8 mt-3"}`}>
        {!isMobile && (
          <div className="pt-6 pb-2">
            <button onClick={() => navigate("/catalog")} className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              Назад в каталог
            </button>
          </div>
        )}
        <div className={isMobile ? "" : "grid grid-cols-[1fr_420px] gap-8"}>
        <div>
        {/* ===== GALLERY ===== */}
        {isMobile ? (
          <div className="relative bg-background">
            <div className="relative overflow-hidden touch-pan-y rounded-b-2xl">
            <div
              ref={sliderRef}
              className="flex transition-transform duration-300 ease-out"
              style={{ transform: `translateX(calc(-${activeImage * 100}% + ${dragOffset}px))` }}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              {galleryImages.map((img, i) => {
                const isContain = (img as any).fit === "contain";
                return (
                  <div key={img.id} className="w-full flex-shrink-0 aspect-[4/5] relative bg-muted overflow-hidden">
                    {isContain && (
                      <img src={img.image} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-60" draggable={false} />
                    )}
                    <img
                      src={img.image}
                      alt={`Фото ${i + 1}`}
                      className={`relative z-10 w-full h-full ${isContain ? "object-contain" : "object-cover"}`}
                      draggable={false}
                      onClick={() => setLightboxOpen(true)}
                      style={i === 0 ? { viewTransitionName: 'project-hero' } as React.CSSProperties : undefined}
                    />
                    {img.type === "video" && (
                      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                        <Play className="w-12 h-12 text-white/80" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <span className="absolute bottom-3 right-4 text-xs text-white bg-black/45 px-2.5 py-1 rounded-full">
              {activeImage + 1} из {galleryImages.length}
            </span>
            </div>
          </div>
        ) : (
          <div className="bg-background rounded-2xl p-3 flex flex-col gap-3">
            {/* Main image with blurred background */}
            <div className="relative rounded-xl overflow-hidden bg-muted h-[500px]">
              {/* Blurred background */}
              <img
                src={galleryImages[activeImage].image}
                alt=""
                className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-60"
                draggable={false}
              />
              {/* Main image */}
              <div className="relative h-full flex items-center justify-center">
                <img
                  src={galleryImages[activeImage].image}
                  alt={`Фото ${activeImage + 1}`}
                  className="max-h-full max-w-full object-contain relative z-10"
                  draggable={false}
                />
                {galleryImages[activeImage].type === "video" && (
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <Play className="w-14 h-14 text-white/80" />
                  </div>
                )}
              </div>
              {/* Nav arrows */}
              <button
                onClick={() => setActiveImage(Math.max(0, activeImage - 1))}
                className={`absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-xl bg-background/80 backdrop-blur-sm flex items-center justify-center transition-opacity ${activeImage === 0 ? "opacity-30 pointer-events-none" : "opacity-100 hover:bg-background"}`}
              >
                <ChevronDown className="w-5 h-5 text-foreground rotate-90" />
              </button>
              <button
                onClick={() => setActiveImage(Math.min(galleryImages.length - 1, activeImage + 1))}
                className={`absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-xl bg-background/80 backdrop-blur-sm flex items-center justify-center transition-opacity ${activeImage === galleryImages.length - 1 ? "opacity-30 pointer-events-none" : "opacity-100 hover:bg-background"}`}
              >
                <ChevronDown className="w-5 h-5 text-foreground -rotate-90" />
              </button>
              {/* Counter */}
              <span className="absolute bottom-3 right-4 text-xs text-white bg-black/45 px-2.5 py-1 rounded-full z-20">
                {activeImage + 1} из {galleryImages.length}
              </span>
            </div>
            {/* Thumbnails */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {galleryImages.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(i)}
                  className={`flex-shrink-0 w-[80px] h-[56px] rounded-lg overflow-hidden border-2 transition-colors ${activeImage === i ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"}`}
                >
                  <img src={img.image} alt={`Миниатюра ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}
        {/* End gallery / left column on desktop */}
        </div>

        {/* Right column on desktop: info */}
        <div>
        {/* ===== MAIN INFO — BENTO ===== */}
        <div className={`flex flex-col gap-2 ${isMobile ? "" : "sticky top-[80px]"}`}>
          {/* Row 1: Title + Price + Specs + Maker + Description (inline expandable) + Accordions + CTA */}
          <div className={`bg-background px-2 pt-3 pb-3 ${isMobile ? "rounded-b-2xl" : "rounded-2xl"}`}>
            <div className="flex items-baseline justify-between gap-3 mb-1">
              <h1 className="text-[18px] font-bold text-foreground tracking-tight leading-tight truncate">{project.name}</h1>
              <div className="text-[15px] whitespace-nowrap">
                <span className="text-muted-foreground font-normal">от </span>
                <span className="font-bold text-foreground">{project.price}</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5 text-[12px] text-muted-foreground">
              <span className="inline-flex items-center gap-[3px]"><Maximize className="w-3 h-3" strokeWidth={1.75} />{project.area}</span>
              <span className="inline-flex items-center gap-[3px]"><BedDouble className="w-3 h-3" strokeWidth={1.75} />{project.beds}</span>
              <span className="inline-flex items-center gap-[3px]"><Bath className="w-3 h-3" strokeWidth={1.75} />{project.baths}</span>
              <span className="inline-flex items-center gap-[3px]"><Layers className="w-3 h-3" strokeWidth={1.75} />{project.floors}</span>
            </div>

            {/* Локация доставки */}
            <div className="mt-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" strokeWidth={2} />
              <span className="flex-1 text-[12px] text-muted-foreground truncate">{project.cityDefault ?? city}</span>
              <button onClick={() => setCityOpen(true)} className="text-[12px] text-primary hover:underline">
                изменить
              </button>
            </div>

            {/* Maker pill */}
            <div
              className="mt-3 flex items-center gap-2.5 bg-secondary rounded-xl px-2.5 py-2 cursor-pointer"
              onClick={() => navigate('/partner/1')}
            >
              <div className="w-9 h-9 bg-background rounded-lg flex items-center justify-center text-foreground text-[10px] font-bold flex-shrink-0 overflow-hidden">
                {project.makerLogo ? (
                  <img src={project.makerLogo} alt={project.maker} className="w-full h-full object-contain" />
                ) : (
                  project.makerInitials
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold text-foreground leading-tight truncate">{project.maker}</div>
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5">
                  <Star className="w-3 h-3 text-muted-foreground" strokeWidth={1.5} />
                  <span>0,0 · Недостаточно данных</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            </div>

            {/* Описание — inline раскрытие */}
            {!descExpanded ? (
              <p className="mt-3 text-[14px] text-foreground leading-snug">
                <span className="line-clamp-2">{project.description}</span>
                {" "}
                <button
                  onClick={() => setDescExpanded(true)}
                  className="text-primary hover:underline transition-colors"
                >
                  Подробнее
                </button>
              </p>
            ) : (
              <div className="mt-3">
                <p className="text-[14px] text-foreground leading-relaxed mb-3">
                  {project.descriptionLong}
                </p>
                <p className="text-[14px] text-foreground leading-relaxed">
                  <button onClick={() => setDescExpanded(false)} className="text-primary hover:underline">
                    Свернуть
                  </button>
                </p>
              </div>
            )}

            {/* Комплектация и Характеристики временно скрыты */}

            {/* CTA в самом низу */}
            <a
              href="https://sherwood-home.ru"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-12 bg-primary text-primary-foreground rounded-xl text-[15px] font-semibold mt-4 flex items-center justify-center hover:opacity-90 transition-opacity"
            >
              Перейти на сайт
            </a>
          </div>

        </div>
        {/* End right column */}
        </div>
        {/* End two-column grid */}
        </div>

        {/* ===== ПОСТРОЕННЫЕ + ОТЗЫВЫ + ПРОЕКТЫ — BENTO ===== */}
        <div className="flex flex-col gap-2 mt-2">
          {/* Другие проекты — бесконечная лента */}
          <div className="bg-background rounded-2xl px-2 py-3">
            <div className="text-[17px] font-bold text-foreground mb-3 px-1">Другие проекты</div>
            <OtherProjectsFeed currentId={id} />
          </div>

        </div>

        <div className="h-[100px]" />
      </main>

      <MobileTabBar />
      <CitySelector open={cityOpen} onOpenChange={setCityOpen} city={city} onSelect={selectCity} />
    </div>
  );
};

export default ProjectDetail;
