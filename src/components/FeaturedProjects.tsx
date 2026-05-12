import { Heart, Loader2, Maximize, BedDouble, Bath } from "lucide-react";
import { useNavigate, useNavigationType } from "react-router-dom";
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
import {
  projects,
  projectGalleries,
  projectFits,
  projectBlurBackground,
  projectObjectPositions,
} from "@/data/projects";

const houseImages = [house1, house2, house3, house4, house5, house6, house7, house8, house9];

function getProjectImages(mainImage: string, id: number): string[] {
  if (projectGalleries[id]) return projectGalleries[id];
  const others = houseImages.filter(img => img !== mainImage);
  const sorted = [...others].sort((a, b) => {
    const ha = a.charCodeAt(a.length - 5) ^ id;
    const hb = b.charCodeAt(b.length - 5) ^ id;
    return ha - hb;
  });
  return [mainImage, ...sorted.slice(0, 3)];
}

const baseProjects = [
  { id: 32, name: "Wide House", maker: "Платформа", area: "46,4 м²", beds: 2, baths: 1, term: "30 д.", price: "5 480 000 ₽", image: wideHouse, liked: false, likes: 64, hasRealPhotos: true, city: "Екатеринбург", rating: "4.8" },
  { id: 33, name: "Barn House", maker: "Платформа", area: "42,9 м²", beds: 1, baths: 1, term: "30 д.", price: "1 680 000 ₽", image: cabin31_1, liked: false, likes: 48, hasRealPhotos: true, city: "Екатеринбург", rating: "4.8" },
  { id: 34, name: "Bear House 45", maker: "Платформа", area: "41 м²", beds: 1, baths: 1, term: "30 д.", price: "2 207 000 ₽", image: bear1, liked: false, likes: 39, hasRealPhotos: true, city: "Екатеринбург", rating: "4.8" },
  { id: 35, name: "Bear House 77", maker: "Платформа", area: "61,32 м²", beds: 2, baths: 1, term: "45 д.", price: "3 894 700 ₽", image: bear77_1, liked: false, likes: 52, hasRealPhotos: true, city: "Екатеринбург", rating: "4.8" },
  { id: 36, name: "Bear House 86", maker: "Платформа", area: "68,7 м²", beds: 2, baths: 2, term: "50 д.", price: "4 349 000 ₽", image: bear86_1, liked: false, likes: 58, hasRealPhotos: true, city: "Екатеринбург", rating: "4.8" },
  { id: 37, name: "Bear House 134", maker: "Платформа", area: "110 м²", beds: 3, baths: 3, term: "70 д.", price: "8 762 000 ₽", image: bear134_1, liked: false, likes: 71, hasRealPhotos: true, city: "Екатеринбург", rating: "4.9" },
  { id: 38, name: "Vast House 140", maker: "Платформа", area: "114,9 м²", beds: 4, baths: 2, term: "75 д.", price: "8 077 600 ₽", image: vast140_1, liked: false, likes: 83, hasRealPhotos: true, city: "Екатеринбург", rating: "4.9" },
  { id: 39, name: "Bear House 168", maker: "Платформа", area: "146,4 м²", beds: 4, baths: 3, term: "90 д.", price: "12 110 400 ₽", image: bear168_1, liked: false, likes: 95, hasRealPhotos: true, city: "Екатеринбург", rating: "4.9" },
  { id: 40, name: "ПАТИО", maker: "Bygge", area: "45 м²", beds: 3, baths: 1, term: "60 д.", price: "2 598 000 ₽", image: patio5, liked: false, likes: 27, hasRealPhotos: true, city: "Екатеринбург", rating: "4.7" },
  { id: 41, name: "ТУНДРА", maker: "Bygge", area: "96 м²", beds: 4, baths: 1, term: "60 д.", price: "5 990 000 ₽", image: tundra1, liked: false, likes: 34, hasRealPhotos: true, city: "Екатеринбург", rating: "4.8" },
  { id: 42, name: "ШЕРВУД", maker: "Bygge", area: "87 м²", beds: 4, baths: 1, term: "60 д.", price: "5 635 000 ₽", image: sherwood1, liked: false, likes: 29, hasRealPhotos: true, city: "Екатеринбург", rating: "4.8" },
  { id: 43, name: "СЕНАТ", maker: "Bygge", area: "96 м²", beds: 4, baths: 1, term: "60 д.", price: "6 545 000 ₽", image: senat1, liked: false, likes: 31, hasRealPhotos: true, city: "Екатеринбург", rating: "4.8" },
  { id: 44, name: "ФАМИЛЬНЫЙ", maker: "Bygge", area: "72 м²", beds: 1, baths: 1, term: "60 д.", price: "4 050 000 ₽", image: familySuite1, liked: false, likes: 26, hasRealPhotos: true, city: "Екатеринбург", rating: "4.7" },
  { id: 45, name: "ГАЛАНТ", maker: "Bygge", area: "59 м²", beds: 2, baths: 1, term: "35 д.", price: "3 346 000 ₽", image: gallant1, liked: false, likes: 24, hasRealPhotos: true, city: "Екатеринбург", rating: "4.7" },
  { id: 46, name: "ГРАНДИС", maker: "Bygge", area: "30 м²", beds: 1, baths: 1, term: "30 д.", price: "1 585 000 ₽", image: grandis1, liked: false, likes: 19, hasRealPhotos: true, city: "Екатеринбург", rating: "4.7" },
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
  const navigationType = useNavigationType();
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

  // Подгрузка при появлении сентинела.
  // Пересоздаём observer при изменении page — иначе на десктопе, если сентинел
  // остаётся в viewport после подгрузки, новый триггер не приходит.
  useEffect(() => {
    if (!sentinelRef.current) return;
    if (page >= MAX_PAGE) return;
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
      { rootMargin: "800px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [page, seed]);

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
  // чтобы Header сразу инициализировался с правильным scrollY и не моргал.
  // Только при POP (кнопка "Назад"), не при PUSH (клик по лого/таб-бару).
  useLayoutEffect(() => {
    const saved = sessionStorage.getItem(SCROLL_KEY);
    if (saved && navigationType === "POP") {
      const y = parseInt(saved, 10);
      if (Number.isFinite(y)) {
        window.scrollTo(0, y);
      }
    }
    // Чистим в любом случае, чтобы старая позиция не «выстрелила» позже
    sessionStorage.removeItem(SCROLL_KEY);
  }, [navigationType]);

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
                  fits={projectFits[project.id]}
                  objectPositions={projectObjectPositions[project.id]}
                  blurBackground={projectBlurBackground[project.id]}
                  edgeBleed={projectEdgeBleed[project.id]}
                  alt={project.name}
                  height="aspect-[3/4] h-auto md:h-[240px] md:aspect-auto"
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
                  <h2 className="text-[11px] font-medium text-foreground/60 uppercase tracking-wide truncate">{project.name}</h2>
                  <div className="text-[13px] font-bold text-foreground whitespace-nowrap leading-tight mt-[1px]">от {project.price}</div>
                  <div className="flex items-center gap-2 text-[12px] font-normal text-foreground/80 whitespace-nowrap leading-none mt-[3px]">
                    <span className="inline-flex items-center gap-[3px]">
                      <Maximize className="w-3 h-3" strokeWidth={1.75} />
                      {project.area}
                    </span>
                    <span className="inline-flex items-center gap-[3px]">
                      <BedDouble className="w-3 h-3" strokeWidth={1.75} />
                      {project.beds}
                    </span>
                    <span className="inline-flex items-center gap-[3px]">
                      <Bath className="w-3 h-3" strokeWidth={1.75} />
                      {project.baths}
                    </span>
                  </div>
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
