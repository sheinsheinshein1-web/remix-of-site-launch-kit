import { Heart, Loader2 } from "lucide-react";
import { formatSpecs } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "@/contexts/FavoritesContext";
import SwipeableGallery from "@/components/SwipeableGallery";
import ProjectCardSkeleton from "@/components/ProjectCardSkeleton";
import { navigateWithTransition } from "@/lib/viewTransition";
import { useEffect, useLayoutEffect, useRef, useState, useCallback } from "react";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import house1 from "@/assets/house-1.jpg";
import house2 from "@/assets/house-2.jpg";
import house3 from "@/assets/house-3.jpg";
import house4 from "@/assets/house-4.jpg";
import house5 from "@/assets/house-5.jpg";
import house6 from "@/assets/house-6.jpg";
import house7 from "@/assets/house-7.jpg";
import house8 from "@/assets/house-8.jpg";
import house9 from "@/assets/house-9.jpg";

const houseImages = [house1, house2, house3, house4, house5, house6, house7, house8, house9];

function getProjectImages(mainImage: string, id: number): string[] {
  const others = houseImages.filter(img => img !== mainImage);
  const sorted = [...others].sort((a, b) => {
    const ha = a.charCodeAt(a.length - 5) ^ id;
    const hb = b.charCodeAt(b.length - 5) ^ id;
    return ha - hb;
  });
  return [mainImage, ...sorted.slice(0, 3)];
}

const baseProjects = [
  { id: 1, name: "Тайга 72", maker: "СибМодуль", area: "72 м²", beds: 2, baths: 1, term: "30 д.", price: "2 450 000 ₽", image: house1, liked: false, likes: 124, hasRealPhotos: true, city: "Москва и МО", rating: "4.8" },
  { id: 2, name: "Кедр 24", maker: "УралДом", area: "24 м²", beds: 0, baths: 1, term: "14 д.", price: "890 000 ₽", image: house4, liked: true, likes: 89, hasRealPhotos: false, city: "Екатеринбург", rating: "4.8" },
  { id: 3, name: "Купол Альпика", maker: "ГлэмпингСтрой", area: "36 м²", beds: 1, baths: 1, term: "7 д.", price: "1 200 000 ₽", image: house8, liked: false, likes: 56, hasRealPhotos: true, city: "Сочи", rating: "4.6" },
  { id: 4, name: "Loft 48", maker: "МодульХаус", area: "48 м²", beds: 2, baths: 1, term: "21 д.", price: "1 750 000 ₽", image: house5, liked: false, likes: 73, hasRealPhotos: false, city: "Казань", rating: "4.7" },
  { id: 5, name: "Сосна 18", maker: "БаняМастер", area: "18 м²", beds: 0, baths: 1, term: "10 д.", price: "650 000 ₽", image: house7, liked: false, likes: 41, hasRealPhotos: true, city: "Новосибирск", rating: "4.9" },
  { id: 6, name: "Модуль 56", maker: "ЭкоДом", area: "56 м²", beds: 2, baths: 1, term: "25 д.", price: "1 950 000 ₽", image: house6, liked: false, likes: 95, hasRealPhotos: false, city: "Москва и МО", rating: "4.5" },
  { id: 7, name: "Сканди 64", maker: "НордХаус", area: "64 м²", beds: 3, baths: 2, term: "40 д.", price: "2 180 000 ₽", image: house9, liked: false, likes: 62, hasRealPhotos: true, city: "СПб", rating: "4.8" },
  { id: 8, name: "Бочка 12", maker: "БаняПро", area: "12 м²", beds: 0, baths: 1, term: "7 д.", price: "490 000 ₽", image: house7, liked: false, likes: 33, hasRealPhotos: false, city: "Тюмень", rating: "4.6" },
  { id: 9, name: "Куб 36", maker: "МодернДом", area: "36 м²", beds: 1, baths: 1, term: "18 д.", price: "1 350 000 ₽", image: house3, liked: true, likes: 108, hasRealPhotos: false, city: "Москва и МО", rating: "4.7" },
  { id: 10, name: "Мини 28", maker: "КомфортДом", area: "28 м²", beds: 1, baths: 1, term: "14 д.", price: "980 000 ₽", image: house4, liked: false, likes: 47, hasRealPhotos: true, city: "Краснодар", rating: "4.4" },
  { id: 11, name: "Барн 80", maker: "РусМодуль", area: "80 м²", beds: 3, baths: 2, term: "50 д.", price: "2 890 000 ₽", image: house2, liked: false, likes: 81, hasRealPhotos: false, city: "Москва и МО", rating: "4.9" },
  { id: 12, name: "A-Frame 32", maker: "ГлэмпПарк", area: "32 м²", beds: 1, baths: 1, term: "10 д.", price: "1 100 000 ₽", image: house4, liked: false, likes: 39, hasRealPhotos: true, city: "Алтай", rating: "4.5" },
  { id: 13, name: "Эко 44", maker: "ЗелёныйДом", area: "44 м²", beds: 2, baths: 1, term: "22 д.", price: "1 580 000 ₽", image: house5, liked: false, likes: 54, hasRealPhotos: false, city: "Ростов", rating: "4.6" },
  { id: 14, name: "Премиум 30", maker: "ПарнаяЛюкс", area: "30 м²", beds: 0, baths: 2, term: "18 д.", price: "1 250 000 ₽", image: house7, liked: true, likes: 112, hasRealPhotos: true, city: "Москва и МО", rating: "4.8" },
  { id: 15, name: "Хайтек 52", maker: "ТехноМодуль", area: "52 м²", beds: 2, baths: 1, term: "30 д.", price: "2 100 000 ₽", image: house6, liked: false, likes: 67, hasRealPhotos: false, city: "СПб", rating: "4.7" },
  { id: 16, name: "Уют 20", maker: "ДачаСтрой", area: "20 м²", beds: 1, baths: 1, term: "12 д.", price: "720 000 ₽", image: house9, liked: false, likes: 28, hasRealPhotos: false, city: "Воронеж", rating: "4.3" },
  { id: 17, name: "Фахверк 96", maker: "ПремиумДом", area: "96 м²", beds: 4, baths: 3, term: "60 д.", price: "3 450 000 ₽", image: house6, liked: false, likes: 143, hasRealPhotos: true, city: "Москва и МО", rating: "4.9" },
  { id: 18, name: "Классик 16", maker: "СтройБаня", area: "16 м²", beds: 0, baths: 1, term: "7 д.", price: "580 000 ₽", image: house7, liked: false, likes: 36, hasRealPhotos: false, city: "Уфа", rating: "4.5" },
  { id: 19, name: "Модуль 68", maker: "АльфаДом", area: "68 м²", beds: 3, baths: 2, term: "35 д.", price: "2 350 000 ₽", image: house1, liked: false, likes: 79, hasRealPhotos: true, city: "Москва и МО", rating: "4.7" },
  { id: 20, name: "Сфера 24", maker: "КуполСтрой", area: "24 м²", beds: 1, baths: 1, term: "7 д.", price: "950 000 ₽", image: house8, liked: false, likes: 52, hasRealPhotos: false, city: "Калининград", rating: "4.6" },
  { id: 21, name: "Вилла 120", maker: "ЛюксМодуль", area: "120 м²", beds: 4, baths: 3, term: "75 д.", price: "4 200 000 ₽", image: house6, liked: true, likes: 187, hasRealPhotos: true, city: "Москва и МО", rating: "4.9" },
  { id: 22, name: "Терем 88", maker: "РусСтиль", area: "88 м²", beds: 3, baths: 2, term: "45 д.", price: "3 100 000 ₽", image: house2, liked: false, likes: 91, hasRealPhotos: true, city: "Тверь", rating: "4.7" },
  { id: 23, name: "Компакт 22", maker: "МиниДом", area: "22 м²", beds: 1, baths: 1, term: "10 д.", price: "780 000 ₽", image: house9, liked: false, likes: 44, hasRealPhotos: false, city: "Самара", rating: "4.5" },
  { id: 24, name: "Шале 76", maker: "АльпХаус", area: "76 м²", beds: 3, baths: 2, term: "40 д.", price: "2 680 000 ₽", image: house3, liked: false, likes: 103, hasRealPhotos: true, city: "Сочи", rating: "4.8" },
  { id: 25, name: "Студия 14", maker: "МикроДом", area: "14 м²", beds: 0, baths: 1, term: "7 д.", price: "520 000 ₽", image: house5, liked: false, likes: 31, hasRealPhotos: false, city: "Пермь", rating: "4.4" },
  { id: 26, name: "Дуплекс 104", maker: "ДвойнойДом", area: "104 м²", beds: 4, baths: 2, term: "55 д.", price: "3 650 000 ₽", image: house6, liked: false, likes: 126, hasRealPhotos: true, city: "Москва и МО", rating: "4.9" },
  { id: 27, name: "Глэмп 28", maker: "ПаркОтель", area: "28 м²", beds: 1, baths: 1, term: "12 д.", price: "1 050 000 ₽", image: house8, liked: false, likes: 58, hasRealPhotos: false, city: "Карелия", rating: "4.6" },
  { id: 28, name: "Лофт 60", maker: "СтальДом", area: "60 м²", beds: 2, baths: 1, term: "28 д.", price: "2 020 000 ₽", image: house1, liked: false, likes: 72, hasRealPhotos: true, city: "СПб", rating: "4.7" },
  { id: 29, name: "Баррель 10", maker: "БочкаПлюс", area: "10 м²", beds: 0, baths: 1, term: "5 д.", price: "420 000 ₽", image: house7, liked: false, likes: 25, hasRealPhotos: false, city: "Челябинск", rating: "4.3" },
  { id: 30, name: "Панорама 84", maker: "ВидДом", area: "84 м²", beds: 3, baths: 2, term: "42 д.", price: "2 950 000 ₽", image: house3, liked: false, likes: 99, hasRealPhotos: true, city: "Москва и МО", rating: "4.8" },
  { id: 31, name: "Ранчо 110", maker: "ФермаДом", area: "110 м²", beds: 4, baths: 3, term: "65 д.", price: "3 800 000 ₽", image: house5, liked: false, likes: 134, hasRealPhotos: false, city: "Краснодар", rating: "4.8" },
];

const PAGE_SIZE = 8;
const SCROLL_KEY = "home_feed_scroll";
const PAGE_PARAM = "page";

// Mulberry32 — детерминированный PRNG
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Стабильно перемешанный порядок baseProjects под конкретный seed.
// seed=0 — оригинальный порядок (после первой загрузки).
function getOrderedProjects(seed: number) {
  if (seed === 0) return baseProjects;
  const rng = mulberry32(seed);
  const arr = [...baseProjects];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Циклически генерируем «бесконечную» ленту, переиспользуя проекты в порядке seed.
function getPagedProjects(page: number, seed: number) {
  const ordered = getOrderedProjects(seed);
  const total = page * PAGE_SIZE;
  const items: { project: typeof baseProjects[number]; key: string }[] = [];
  for (let i = 0; i < total; i++) {
    const project = ordered[i % ordered.length];
    // Включаем seed в key, чтобы React переиспользовал DOM правильно при reshuffle
    items.push({ project, key: `${seed}-${project.id}-${i}` });
  }
  return items;
}

const FeaturedProjects = () => {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();

  const initialPage = (() => {
    if (typeof window === "undefined") return 1;
    const url = new URL(window.location.href);
    const p = parseInt(url.searchParams.get(PAGE_PARAM) || "1", 10);
    return Number.isFinite(p) && p > 0 ? Math.min(p, 50) : 1;
  })();

  const [page, setPage] = useState(initialPage);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [seed, setSeed] = useState(0);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const items = getPagedProjects(page, seed);
  const MAX_PAGE = 50;

  // Pull-to-refresh: перемешиваем порядок и сбрасываем на первую страницу
  const handleRefresh = useCallback(async () => {
    const newSeed = Date.now() & 0xffffffff;
    setSeed(newSeed);
    setPage(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
    // Небольшая задержка чтобы индикатор успел показаться (UX)
    await new Promise((r) => setTimeout(r, 400));
  }, []);

  const { pull, refreshing } = usePullToRefresh({ onRefresh: handleRefresh });

  // Подгрузка при появлении сентинела
  useEffect(() => {
    if (!sentinelRef.current) return;
    const el = sentinelRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((p) => {
            if (p >= MAX_PAGE) return p;
            setIsLoadingMore(true);
            return p + 1;
          });
        }
      },
      { rootMargin: "600px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Снимаем флаг загрузки после отрисовки новых карточек
  useEffect(() => {
    if (isLoadingMore) setIsLoadingMore(false);
  }, [page]);

  // Синхронизация ?page= с URL
  useEffect(() => {
    const url = new URL(window.location.href);
    if (page === 1) url.searchParams.delete(PAGE_PARAM);
    else url.searchParams.set(PAGE_PARAM, String(page));
    window.history.replaceState({}, "", url.toString());
  }, [page]);

  // Восстановление позиции при возврате с детальной — синхронно перед paint,
  // чтобы Header сразу инициализировался с правильным scrollY и не моргал
  useLayoutEffect(() => {
    const saved = sessionStorage.getItem(SCROLL_KEY);
    if (saved) {
      const y = parseInt(saved, 10);
      if (Number.isFinite(y)) {
        window.scrollTo(0, y);
      }
      sessionStorage.removeItem(SCROLL_KEY);
    }
  }, []);

  const handleCardClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, projectId: number) => {
      // Сохраняем позицию для восстановления
      sessionStorage.setItem(SCROLL_KEY, String(window.scrollY));
      navigateWithTransition(e, navigate, `/project/${projectId}`);
    },
    [navigate]
  );

  // JSON-LD ItemList для SEO
  const itemListJson = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: baseProjects.slice(0, 20).map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${typeof window !== "undefined" ? window.location.origin : ""}/project/${p.id}`,
      name: p.name,
    })),
  };

  return (
    <section aria-label="Лента проектов">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJson) }}
      />
      {/* Pull-to-refresh индикатор */}
      <div
        aria-hidden={!refreshing && pull === 0}
        className="flex justify-center items-center overflow-hidden md:hidden"
        style={{
          height: `${pull}px`,
          transition: refreshing || pull === 0 ? "height 0.25s ease-out" : "none",
        }}
      >
        <Loader2
          className={`w-5 h-5 text-primary ${refreshing ? "animate-spin" : ""}`}
          style={{
            opacity: Math.min(1, pull / 50),
            transform: `rotate(${refreshing ? 0 : pull * 4}deg)`,
          }}
        />
      </div>
      <div
        className="md:py-5"
        style={{
          transform: pull > 0 && !refreshing ? `translateY(0)` : undefined,
        }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-[2px] gap-y-[6px] md:gap-4 md:mt-0">
          {items.map(({ project, key }) => (
            <article key={key} className="overflow-hidden">
              <a
                href={`/project/${project.id}`}
                onClick={(e) => handleCardClick(e, project.id)}
                className="block cursor-pointer"
                aria-label={`${project.name} — от ${project.price}`}
              >
                <SwipeableGallery
                  images={getProjectImages(project.image, project.id)}
                  alt={project.name}
                  height="h-[260px] md:h-[240px]"
                >
                  <div className="absolute top-2 right-2 z-10">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavorite({
                          id: project.id,
                          badge: "",
                          maker: project.maker,
                          name: project.name,
                          price: project.price,
                          area: project.area,
                          beds: project.beds,
                          baths: project.baths,
                          term: project.term,
                          image: project.image,
                          likes: project.likes,
                          city: project.city,
                        });
                      }}
                      className="flex items-center gap-1 bg-foreground/40 backdrop-blur-md rounded-full px-2 py-[4px]"
                      aria-label="В избранное"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${isFavorite(project.id) ? "fill-red-500 text-red-500" : "text-white/70"}`}
                        strokeWidth={1.5}
                      />
                      <span className="text-[11px] font-medium text-white">
                        {project.likes +
                          (isFavorite(project.id) && !project.liked
                            ? 1
                            : !isFavorite(project.id) && project.liked
                            ? -1
                            : 0)}
                      </span>
                    </button>
                  </div>
                </SwipeableGallery>
                <div className="px-[10px] pt-1 pb-1">
                  <h2 className="text-[12px] font-bold text-foreground">от {project.price}</h2>
                  <p className="text-[12px] font-normal text-foreground/80 whitespace-nowrap leading-none mt-[2px]">
                    {formatSpecs(project.area, project.beds, project.baths)}
                  </p>
                </div>
              </a>
            </article>
          ))}
          {isLoadingMore &&
            Array.from({ length: 8 }).map((_, i) => (
              <ProjectCardSkeleton key={`skeleton-${i}`} height="h-[260px] md:h-[240px]" />
            ))}
        </div>
        {/* Сентинел для IntersectionObserver — невидимый */}
        <div ref={sentinelRef} aria-hidden="true" className="h-1 w-full" />
      </div>
    </section>
  );
};

export default FeaturedProjects;
