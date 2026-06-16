import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Heart, Play, ChevronRight, ChevronDown, MoreHorizontal, Phone, MessageSquare, Share2, Bookmark, EyeOff, Flag, X, Ruler, BedDouble, Bath, Layers, Star, MessageCircleQuestion, Image, Send, MapPin, Maximize } from "lucide-react";
import Header from "@/components/Header";
import MobileTabBar from "@/components/MobileTabBar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useFavorites } from "@/contexts/FavoritesContext";
import CitySelector, { useCity } from "@/components/CitySelector";
import OtherProjectsFeed from "@/components/OtherProjectsFeed";
import Seo from "@/components/Seo";
import house1 from "@/assets/house-1.webp";
import house2 from "@/assets/house-2.webp";
import house3 from "@/assets/house-3.webp";
import house4 from "@/assets/house-4.webp";
import house5 from "@/assets/house-5.webp";
import house6 from "@/assets/house-6.webp";
import house7 from "@/assets/house-7.webp";
import house8 from "@/assets/house-8.webp";
import house9 from "@/assets/house-9.webp";
import { projectOverrides, projectsCountByMakerId } from "@/data/projects";

const defaultGallery = [
  { id: 1, image: house1, type: "photo" },
  { id: 2, image: house2, type: "photo" },
  { id: 3, image: house3, type: "photo" },
  { id: 4, image: house4, type: "photo" },
  { id: 5, image: house5, type: "video" },
];

// projectOverrides импортируется из src/data/projects.ts (единый источник правды).

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
    makerId: override?.makerId ?? "1",
    makerHref: `/partner/${override?.makerId ?? "1"}`,
    siteUrl: override?.siteUrl ?? "https://platforma-modul.ru/",
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
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Gallery slider touch — с фиксацией оси, чтобы вертикальный скролл не дёргал страницу
  const sliderRef = useRef<HTMLDivElement>(null);
  const galleryWrapRef = useRef<HTMLDivElement>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const dragOffsetRef = useRef(0);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const lockedAxis = useRef<"x" | "y" | null>(null);
  const isDragging = useRef(false);

  const finishSwipe = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    if (sliderRef.current) sliderRef.current.style.transition = '';
    const offset = dragOffsetRef.current;
    if (lockedAxis.current === "x" && Math.abs(offset) > 60) {
      if (offset < 0 && activeImage < galleryImages.length - 1) {
        setActiveImage(prev => prev + 1);
      } else if (offset > 0 && activeImage > 0) {
        setActiveImage(prev => prev - 1);
      }
    }
    lockedAxis.current = null;
    dragOffsetRef.current = 0;
    setDragOffset(0);
  }, [activeImage, galleryImages.length]);

  // Нативные non-passive listeners — нужны чтобы preventDefault блокировал
  // вертикальный скролл во время горизонтального свайпа
  useEffect(() => {
    const el = galleryWrapRef.current;
    if (!el) return;

    const handleStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
      lockedAxis.current = null;
      isDragging.current = true;
      dragOffsetRef.current = 0;
      if (sliderRef.current) sliderRef.current.style.transition = 'none';
    };

    const handleMove = (e: TouchEvent) => {
      if (!isDragging.current) return;
      const dx = e.touches[0].clientX - touchStartX.current;
      const dy = e.touches[0].clientY - touchStartY.current;

      if (!lockedAxis.current) {
        if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
          lockedAxis.current = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
        } else {
          return;
        }
      }

      if (lockedAxis.current === "x") {
        // Блокируем вертикальный скролл, пока листаем горизонтально
        if (e.cancelable) e.preventDefault();
        dragOffsetRef.current = dx;
        setDragOffset(dx);
      }
    };

    const handleEnd = () => finishSwipe();

    el.addEventListener("touchstart", handleStart, { passive: true });
    el.addEventListener("touchmove", handleMove, { passive: false });
    el.addEventListener("touchend", handleEnd, { passive: true });
    el.addEventListener("touchcancel", handleEnd, { passive: true });

    return () => {
      el.removeEventListener("touchstart", handleStart);
      el.removeEventListener("touchmove", handleMove);
      el.removeEventListener("touchend", handleEnd);
      el.removeEventListener("touchcancel", handleEnd);
    };
  }, [finishSwipe]);

  const navigateBack = useCallback(() => navigate(-1), [navigate]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const priceDigits = (project.price.match(/\d+/g) ?? []).join("");
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: project.name,
    description: project.descriptionLong || project.description,
    brand: { "@type": "Brand", name: project.maker },
    image: galleryImages[0]?.image ? `https://многоместа.рф${galleryImages[0].image}` : undefined,
    offers: priceDigits
      ? {
          "@type": "Offer",
          priceCurrency: "RUB",
          price: priceDigits,
          availability: "https://schema.org/InStock",
          url: typeof window !== "undefined" ? window.location.href : `https://многоместа.рф/project/${project.id}`,
        }
      : undefined,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: "https://многоместа.рф/" },
      { "@type": "ListItem", position: 2, name: "Каталог", item: "https://многоместа.рф/catalog" },
      { "@type": "ListItem", position: 3, name: project.name, item: `https://многоместа.рф/project/${project.id}` },
    ],
  };

  return (
    <div className="min-h-screen bg-muted pb-24 md:pb-0">
      <Seo
        title={`${project.name} от ${project.maker} — ${project.price} | многоместа.рф`}
        description={`${project.name} (${project.area}, ${project.beds} спальни). ${project.description}`.slice(0, 160)}
        canonicalPath={`/project/${project.id}`}
        type="product"
        image={galleryImages[0]?.image}
        jsonLd={[productJsonLd, breadcrumbJsonLd]}
      />
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
            <div ref={galleryWrapRef} className="relative overflow-hidden rounded-b-2xl">
            <div
              ref={sliderRef}
              className="flex transition-transform duration-300 ease-out"
              style={{ transform: `translateX(calc(-${activeImage * 100}% + ${dragOffset}px))` }}
            >
              {galleryImages.map((img, i) => {
                const isContain = (img as any).fit === "contain";
                const hasBlur = Boolean((img as any).blur);
                const isActive = i === activeImage;
                return (
                  <div key={img.id} className="relative isolate w-full flex-shrink-0 aspect-[4/5] bg-muted overflow-hidden">
                    {isContain && hasBlur && (
                      <img
                        src={img.image}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-cover opacity-70 z-0"
                        style={{ filter: "blur(18px)", transform: "scale(1.12)" }}
                        draggable={false}
                        loading="lazy"
                        decoding="async"
                      />
                    )}
                    <img
                      src={img.image}
                      alt={`Фото ${i + 1}`}
                      className={`relative z-10 w-full h-full ${isContain ? "object-contain" : "object-cover"}`}
                      decoding="sync"
                      loading="lazy"
                      draggable={false}
                      onClick={() => setLightboxOpen(true)}
                      style={undefined}
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
            <span className="absolute bottom-3 right-4 text-xs text-white bg-black/45 px-2.5 py-1 rounded-full" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.45)" }}>
              {activeImage + 1} из {galleryImages.length}
            </span>
            </div>
          </div>
        ) : (
          <div className="bg-background rounded-2xl p-3 flex flex-col gap-3">
            {/* Main image with optional blurred background */}
            <div className="relative rounded-xl overflow-hidden bg-muted h-[500px]">
              {/* Blurred background — только если у изображения явно включён blur (планировки рендерятся на сером bg-muted) */}
              {(galleryImages[activeImage] as any).fit === "contain" && Boolean((galleryImages[activeImage] as any).blur) && (
                <img
                  src={galleryImages[activeImage].image}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover opacity-60"
                  style={{ filter: "blur(16px)", transform: "scale(1.08)" }}
                  draggable={false} loading="lazy" decoding="async" />
              )}
              {/* Main image */}
              <div className="relative h-full flex items-center justify-center">
                <img
                  src={galleryImages[activeImage].image}
                  alt={`Фото ${activeImage + 1}`}
                  className="max-h-full max-w-full object-contain relative z-10"
                  draggable={false} loading="lazy" decoding="async" />
                {galleryImages[activeImage].type === "video" && (
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <Play className="w-14 h-14 text-white/80" />
                  </div>
                )}
              </div>
              {/* Nav arrows */}
              <button
                onClick={() => setActiveImage(Math.max(0, activeImage - 1))}
                className={`absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-xl bg-background/90 shadow-sm flex items-center justify-center transition-opacity ${activeImage === 0 ? "opacity-30 pointer-events-none" : "opacity-100 hover:bg-background"}`}
              >
                <ChevronDown className="w-5 h-5 text-foreground rotate-90" />
              </button>
              <button
                onClick={() => setActiveImage(Math.min(galleryImages.length - 1, activeImage + 1))}
                className={`absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-xl bg-background/90 shadow-sm flex items-center justify-center transition-opacity ${activeImage === galleryImages.length - 1 ? "opacity-30 pointer-events-none" : "opacity-100 hover:bg-background"}`}
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
                  <img src={img.image} alt={`Миниатюра ${i + 1}`} className="w-full h-full object-cover" loading="lazy" decoding="async" />
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
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-baseline justify-between gap-3 mb-1 w-full text-left -mx-1 px-1 py-0.5 rounded-md hover:bg-muted/50 active:bg-muted transition-colors cursor-pointer"
              aria-label="Наверх страницы"
            >
              <h1 className="text-[18px] font-bold text-foreground tracking-tight leading-tight min-w-0 flex-1 break-words">{project.name}</h1>
              <div className="text-[15px] whitespace-nowrap flex-shrink-0">
                <span className="text-muted-foreground font-normal">от </span>
                <span className="font-bold text-foreground">{project.price.replace(/^от\s*/i, "")}</span>
              </div>
            </button>
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
            </div>

            {/* Maker pill */}
            <div
              className="mt-3 flex items-center gap-2.5 bg-secondary rounded-xl px-2.5 py-2 cursor-pointer"
              onClick={() => navigate(project.makerHref)}
            >
              <div className="w-9 h-9 bg-background rounded-lg flex items-center justify-center text-foreground text-[10px] font-bold flex-shrink-0 overflow-hidden">
                {project.makerLogo ? (
                  <img src={project.makerLogo} alt={project.maker} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                ) : (
                  project.makerInitials
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 min-w-0">
                  <div className="text-[13px] font-semibold text-foreground leading-tight truncate">{project.maker}</div>
                  {project.makerId === "platforma" && (
                    <span className="shrink-0 text-[9px] font-medium uppercase tracking-wide bg-primary/15 text-primary px-1.5 py-[2px] rounded-lg">Проверено</span>
                  )}
                </div>
                {project.makerId === "platforma" ? (
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5">
                    <Star className="w-3 h-3 fill-primary text-primary" strokeWidth={1.5} />
                    <span>4,9 · 6 отзывов</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5">
                    <Star className="w-3 h-3 text-muted-foreground" strokeWidth={1.5} />
                    <span>0,0 · Недостаточно данных</span>
                  </div>
                )}
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            </div>

            {/* Описание — inline раскрытие */}
            {(() => {
              const fullText = project.descriptionLong || project.description;
              return !descExpanded ? (
                <p className="mt-3 text-[14px] text-foreground leading-snug">
                  <span className="line-clamp-2">{fullText}</span>
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
                    {fullText}
                  </p>
                  <p className="text-[14px] text-foreground leading-relaxed">
                    <button onClick={() => setDescExpanded(false)} className="text-primary hover:underline">
                      Свернуть
                    </button>
                  </p>
                </div>
              );
            })()}

            {/* Комплектация и Характеристики временно скрыты */}

            {/* CTA в самом низу */}
            <a
              href={project.siteUrl}
              target="_blank"
              rel="noopener noreferrer nofollow sponsored"
              className="w-full h-12 bg-secondary text-foreground rounded-xl text-[15px] font-semibold mt-4 flex items-center justify-center hover:bg-secondary/80 transition-colors"
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

        {/* Дисклеймер для Хочу Дом */}
        {project.makerId === "hochu-dom" && (
          <div className="mt-6 px-4 py-3 text-xs text-muted-foreground leading-relaxed max-w-3xl">
            Все права на проект, изображения и название принадлежат компании{" "}
            <span className="font-medium text-foreground">{project.maker}</span>
            {" ("}
            <a
              href={project.siteUrl}
              target="_blank"
              rel="noopener noreferrer nofollow sponsored"
              className="text-foreground underline underline-offset-2 hover:no-underline"
            >
              {cleanSiteUrl}
            </a>
            {"). Карточка собрана из открытых источников и размещена в информационных целях — для прямой связи покупателя с производителем. Если вы правообладатель и хотите удалить материал — сообщить о нарушении по почте "}
            <a
              href={violationMailto}
              className="text-foreground underline underline-offset-2 hover:no-underline"
            >
              inadvert@yandex.ru
            </a>
            {". Мы рассмотрим обращение в течение 24 часов."}
          </div>
        )}

        <div className="h-[100px]" />
      </main>

      <MobileTabBar />
      <CitySelector open={cityOpen} onOpenChange={setCityOpen} city={city} onSelect={selectCity} />

      {/* Lightbox — полноэкранный просмотр исходного фото со свайпом */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[80] bg-black/95 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
          onTouchStart={(e) => {
            (e.currentTarget as any)._lbx = e.touches[0].clientX;
            (e.currentTarget as any)._lby = e.touches[0].clientY;
            (e.currentTarget as any)._lbAxis = null;
          }}
          onTouchMove={(e) => {
            const startX = (e.currentTarget as any)._lbx;
            const startY = (e.currentTarget as any)._lby;
            if (startX == null) return;
            const dx = e.touches[0].clientX - startX;
            const dy = e.touches[0].clientY - startY;
            if (!(e.currentTarget as any)._lbAxis && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
              (e.currentTarget as any)._lbAxis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
            }
          }}
          onTouchEnd={(e) => {
            const startX = (e.currentTarget as any)._lbx;
            if (startX == null) return;
            const dx = e.changedTouches[0].clientX - startX;
            const axis = (e.currentTarget as any)._lbAxis;
            if (axis === "x" && Math.abs(dx) > 50) {
              if (dx < 0 && activeImage < galleryImages.length - 1) setActiveImage(activeImage + 1);
              else if (dx > 0 && activeImage > 0) setActiveImage(activeImage - 1);
            }
            (e.currentTarget as any)._lbx = null;
          }}
        >
          <button
            onClick={(e) => { e.stopPropagation(); setLightboxOpen(false); }}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/15 flex items-center justify-center text-white"
            aria-label="Закрыть"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white text-xs bg-white/15 rounded-full px-3 py-1">
            {activeImage + 1} из {galleryImages.length}
          </div>
          <img
            src={galleryImages[activeImage].image}
            alt={`Фото ${activeImage + 1}`}
            className="max-w-full max-h-full object-contain select-none"
            loading="lazy"
            decoding="async"
            onClick={(e) => e.stopPropagation()}
            draggable={false}
          />
          {!isMobile && activeImage > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); setActiveImage(activeImage - 1); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/15 flex items-center justify-center text-white"
              aria-label="Предыдущее"
            >
              <ChevronDown className="w-6 h-6 rotate-90" />
            </button>
          )}
          {!isMobile && activeImage < galleryImages.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); setActiveImage(activeImage + 1); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/15 flex items-center justify-center text-white"
              aria-label="Следующее"
            >
              <ChevronDown className="w-6 h-6 -rotate-90" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
