import { Loader2 } from "lucide-react";
import { useNavigate, useNavigationType } from "react-router-dom";
import ProjectCard from "@/components/ProjectCard";
import ProjectCardSkeleton from "@/components/ProjectCardSkeleton";
import { navigateWithTransition } from "@/lib/viewTransition";
import { useEffect, useLayoutEffect, useRef, useState, useCallback } from "react";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import { projects } from "@/data/projects";

import { useCity } from "@/components/CitySelector";

// baseProjects берётся из единого источника правды (src/data/projects.ts).
// Здесь храним только то, что нужно для пагинации/перемешивания. Сама карточка
// читает все остальные поля сама из projects.ts по id (см. ProjectCard).
const baseProjects = projects.map((p) => ({
  id: p.id,
  maker: p.maker.name,
  city: p.city,
  name: p.name,
  price: p.price,
}));

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
function getPagedProjects(page: number, seed: number, source: typeof baseProjects) {
  if (source.length === 0) return [];
  // Чередуем проекты по производителю — чтобы карточки одного бренда не стояли подряд.
  const interleaveByMaker = (arr: typeof baseProjects) => {
    const buckets = new Map<string, typeof baseProjects>();
    for (const p of arr) {
      const list = buckets.get(p.maker) ?? [];
      list.push(p);
      buckets.set(p.maker, list);
    }
    const queues = Array.from(buckets.values());
    const out: typeof baseProjects = [];
    while (queues.some((q) => q.length > 0)) {
      for (const q of queues) {
        const next = q.shift();
        if (next) out.push(next);
      }
    }
    return out;
  };
  // Базовый порядок: интерливим по производителю, затем стабильно тасуем,
  // чтобы в 2-колоночной сетке не получалось "столбцов" одного бренда.
  const shuffleWithSeed = (arr: typeof baseProjects, s: number) => {
    const rng = mulberry32(s);
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const ordered = seed === 0
    ? shuffleWithSeed(interleaveByMaker(source), 1337)
    : shuffleWithSeed(source, seed);
  const total = page * PAGE_SIZE;
  const items: { project: typeof baseProjects[number]; key: string }[] = [];
  for (let i = 0; i < total; i++) {
    const project = ordered[i % ordered.length];
    items.push({ project, key: `${seed}-${project.id}-${i}` });
  }
  return items;
}

const FeaturedProjects = () => {
  const navigate = useNavigate();
  const navigationType = useNavigationType();
  

  const initialPage = (() => {
    if (typeof window === "undefined") return 1;
    const url = new URL(window.location.href);
    const p = parseInt(url.searchParams.get(PAGE_PARAM) || "1", 10);
    return Number.isFinite(p) && p > 0 ? Math.min(p, 50) : 1;
  })();

  const { city } = useCity();
  const cityProjects = baseProjects.filter((p) => p.city === city);

  const [page, setPage] = useState(initialPage);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [seed, setSeed] = useState(0);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const items = getPagedProjects(page, seed, cityProjects);
  const MAX_PAGE = 50;
  const isEmpty = cityProjects.length === 0;

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

  // При смене города — сбрасываем страницу
  useEffect(() => {
    setPage(1);
  }, [city]);

  // Подгрузка при появлении сентинела.
  // Пересоздаём observer при изменении page — иначе на десктопе, если сентинел
  // остаётся в viewport после подгрузки, новый триггер не приходит.
  useEffect(() => {
    if (!sentinelRef.current) return;
    if (page >= MAX_PAGE) return;
    if (isEmpty) return;
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
  }, [page, seed, isEmpty]);

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
        {isEmpty && (
          <div className="px-3 py-10 md:py-16 text-center">
            <div className="text-[15px] font-medium text-foreground mb-1">Пока нет проектов в городе «{city}»</div>
            <div className="text-[13px] font-light text-muted-foreground">Выберите другой город в шапке, чтобы увидеть подборку</div>
          </div>
        )}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-x-[2px] gap-y-[6px] md:gap-4 md:mt-0 ${isEmpty ? "hidden" : ""}`}>
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
