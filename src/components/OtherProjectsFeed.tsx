import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { navigateWithTransition } from "@/lib/viewTransition";
import { Heart, Maximize, BedDouble, Bath } from "lucide-react";
import ProjectCardSkeleton from "@/components/ProjectCardSkeleton";
import SwipeableGallery from "@/components/SwipeableGallery";
import { useFavorites } from "@/contexts/FavoritesContext";
import wideHouse from "@/assets/wide-house-1.webp";
import wideHouse2 from "@/assets/wide-house-2.webp";
import wideHousePlan3d from "@/assets/wide-house-plan-3d.webp";
import wideHousePlan from "@/assets/wide-house-plan.webp";
import cabin31_1 from "@/assets/cabin-31-1.webp";
import cabin31_2 from "@/assets/cabin-31-2.webp";
import cabin31Plan3d from "@/assets/cabin-31-plan-3d.webp";
import cabin31Plan from "@/assets/cabin-31-plan.webp";
import bear1 from "@/assets/bear-1.webp";
import bear2 from "@/assets/bear-2.webp";
import bear3 from "@/assets/bear-3.webp";
import bearPlan3d from "@/assets/bear-plan-3d.webp";
import bearPlan from "@/assets/bear-plan.webp";
import bear77_1 from "@/assets/bear77-1.webp";
import bear77_2 from "@/assets/bear77-2.webp";
import bear77Plan3d from "@/assets/bear77-plan-3d.webp";
import bear77Plan from "@/assets/bear77-plan.webp";
import bear86_1 from "@/assets/bear86-1.webp";
import bear86_2 from "@/assets/bear86-2.webp";
import bear86_3 from "@/assets/bear86-3.webp";
import bear86Plan3d from "@/assets/bear86-plan-3d.webp";
import bear86Plan from "@/assets/bear86-plan.webp";
import bear134_1 from "@/assets/bear134-1.webp";
import bear134_2 from "@/assets/bear134-2.webp";
import bear134_3 from "@/assets/bear134-3.webp";
import bear134Plan3d from "@/assets/bear134-plan-3d.webp";
import bear134Plan from "@/assets/bear134-plan.webp";
import vast140_1 from "@/assets/vast140-1.webp";
import vast140_2 from "@/assets/vast140-2.webp";
import vast140_3 from "@/assets/vast140-3.webp";
import vast140Plan3d from "@/assets/vast140-plan-3d.webp";
import vast140Plan from "@/assets/vast140-plan.webp";
import bear168_1 from "@/assets/bear168-1.webp";
import bear168_2 from "@/assets/bear168-2.webp";
import bear168Plan3d from "@/assets/bear168-plan-3d.webp";
import bear168Plan from "@/assets/bear168-plan.webp";

// Базовый набор проектов «других» от подрядчика.
// id указывает на маршрут /project/:id. maker/term/city/likes синхронизированы с FeaturedProjects.
const baseOtherProjects = [
  { id: 32, name: "Wide House", maker: "Платформа", price: "5 480 000 ₽", area: "46,4 м²", beds: 2, baths: 1, term: "30 д.", image: wideHouse, likes: 64, city: "Екатеринбург" },
  { id: 33, name: "Barn House", maker: "Платформа", price: "1 680 000 ₽", area: "42,9 м²", beds: 1, baths: 1, term: "30 д.", image: cabin31_1, likes: 48, city: "Екатеринбург" },
  { id: 34, name: "Bear House 45", maker: "Платформа", price: "2 207 000 ₽", area: "41 м²", beds: 1, baths: 1, term: "30 д.", image: bear1, likes: 39, city: "Екатеринбург" },
  { id: 35, name: "Bear House 77", maker: "Платформа", price: "3 894 700 ₽", area: "61,32 м²", beds: 2, baths: 1, term: "45 д.", image: bear77_1, likes: 52, city: "Екатеринбург" },
  { id: 36, name: "Bear House 86", maker: "Платформа", price: "4 349 000 ₽", area: "68,7 м²", beds: 2, baths: 2, term: "50 д.", image: bear86_1, likes: 58, city: "Екатеринбург" },
  { id: 37, name: "Bear House 134", maker: "Платформа", price: "8 762 000 ₽", area: "110 м²", beds: 3, baths: 3, term: "70 д.", image: bear134_1, likes: 71, city: "Екатеринбург" },
  { id: 38, name: "Vast House 140", maker: "Платформа", price: "8 077 600 ₽", area: "114,9 м²", beds: 4, baths: 2, term: "75 д.", image: vast140_1, likes: 83, city: "Екатеринбург" },
  { id: 39, name: "Bear House 168", maker: "Платформа", price: "12 110 400 ₽", area: "146,4 м²", beds: 4, baths: 3, term: "90 д.", image: bear168_1, likes: 95, city: "Екатеринбург" },
];

// Галереи проектов по id (синхронизированы с FeaturedProjects/Catalog).
const projectGalleries: Record<number, string[]> = {
  32: [wideHouse, wideHouse2, wideHousePlan3d, wideHousePlan],
  33: [cabin31_1, cabin31_2, cabin31Plan3d, cabin31Plan],
  34: [bear1, bear2, bear3, bearPlan3d, bearPlan],
  35: [bear77_1, bear77_2, bear77Plan3d, bear77Plan],
  36: [bear86_1, bear86_2, bear86_3, bear86Plan3d, bear86Plan],
  37: [bear134_1, bear134_2, bear134_3, bear134Plan3d, bear134Plan],
  38: [vast140_1, vast140_2, vast140_3, vast140Plan3d, vast140Plan],
  39: [bear168_1, bear168_2, bear168Plan3d, bear168Plan],
};

const projectFits: Record<number, ("cover" | "contain")[]> = {
  32: ["cover", "cover", "contain", "contain"],
  33: ["cover", "cover", "contain", "contain"],
  34: ["cover", "cover", "cover", "contain", "contain"],
  35: ["cover", "cover", "contain", "contain"],
  36: ["cover", "cover", "cover", "contain", "contain"],
  37: ["cover", "cover", "cover", "contain", "contain"],
  38: ["cover", "cover", "cover", "contain", "contain"],
  39: ["cover", "cover", "contain", "contain"],
};

const projectObjectPositions: Record<number, (string | undefined)[]> = {
  38: ["right center"],
};

function getProjectImages(mainImage: string, id: number): string[] {
  return projectGalleries[id] ?? [mainImage];
}

const PAGE_SIZE = 6;
const SCROLL_KEY_PREFIX = "project_feed_scroll_";

interface Props {
  currentId?: string;
}

const OtherProjectsFeed = ({ currentId }: Props) => {
  const navigate = useNavigate();
  const sentinelRef = useRef<HTMLDivElement>(null);
  const { isFavorite, toggleFavorite } = useFavorites();

  // Исключаем текущий проект из ленты
  const pool = baseOtherProjects.filter((p) => String(p.id) !== currentId);

  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const MAX_PAGE = 30;
  const total = page * PAGE_SIZE;
  const items = Array.from({ length: total }, (_, i) => {
    const project = pool[i % pool.length];
    return { project, key: `${project.id}-${i}` };
  });

  // IntersectionObserver — автоподгрузка.
  // Пересоздаём при изменении page, иначе на десктопе сентинел может остаться
  // в зоне видимости и повторного триггера не будет.
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
  }, [page]);

  // Снимаем флаг после отрисовки
  useEffect(() => {
    if (isLoadingMore) setIsLoadingMore(false);
  }, [page]);

  // Восстановление позиции при возврате
  const scrollKey = `${SCROLL_KEY_PREFIX}${currentId ?? "x"}`;
  useEffect(() => {
    const saved = sessionStorage.getItem(scrollKey);
    if (saved) {
      const y = parseInt(saved, 10);
      if (Number.isFinite(y)) {
        requestAnimationFrame(() => window.scrollTo(0, y));
      }
      sessionStorage.removeItem(scrollKey);
    }
  }, [scrollKey]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, projectId: number) => {
      sessionStorage.setItem(scrollKey, String(window.scrollY));
      navigateWithTransition(e, navigate, `/project/${projectId}`);
    },
    [navigate, scrollKey]
  );

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-[2px] gap-y-[6px] md:gap-4">
        {items.map(({ project, key }) => (
          <article key={key} className="overflow-hidden">
            <a
              href={`/project/${project.id}`}
              onClick={(e) => handleClick(e, project.id)}
              className="block cursor-pointer"
              aria-label={`${project.name} — ${project.price}`}
            >
              <SwipeableGallery
                images={getProjectImages(project.image, project.id)}
                fits={projectFits[project.id]}
                objectPositions={projectObjectPositions[project.id]}
                alt={project.name}
                height="aspect-[3/4] h-auto md:h-[240px] md:aspect-auto"
              />
              <div className="px-[10px] pt-1 pb-1">
                <h2 className="text-[11px] font-medium text-foreground/60 uppercase tracking-wide truncate">{project.name}</h2>
                <div className="text-[13px] font-bold text-foreground whitespace-nowrap leading-tight mt-[1px]">{project.price}</div>
                <div className="flex items-center gap-2 text-[12px] font-normal text-foreground/80 whitespace-nowrap leading-none mt-[3px]">
                  <span className="inline-flex items-center gap-[3px]"><Maximize className="w-3 h-3" strokeWidth={1.75} />{project.area}</span>
                  <span className="inline-flex items-center gap-[3px]"><BedDouble className="w-3 h-3" strokeWidth={1.75} />{project.beds}</span>
                  <span className="inline-flex items-center gap-[3px]"><Bath className="w-3 h-3" strokeWidth={1.75} />{project.baths}</span>
                </div>
              </div>
            </a>
          </article>
        ))}
        {isLoadingMore &&
          Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <ProjectCardSkeleton key={`skeleton-${i}`} />
          ))}
      </div>
      <div ref={sentinelRef} aria-hidden="true" className="h-1 w-full" />
    </>
  );
};

export default OtherProjectsFeed;
