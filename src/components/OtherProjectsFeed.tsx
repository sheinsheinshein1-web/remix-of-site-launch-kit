import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { navigateWithTransition } from "@/lib/viewTransition";
import { Maximize, BedDouble, Bath } from "lucide-react";
import ProjectCardSkeleton from "@/components/ProjectCardSkeleton";
import house1 from "@/assets/house-1.jpg";
import house2 from "@/assets/house-2.jpg";
import house3 from "@/assets/house-3.jpg";
import house4 from "@/assets/house-4.jpg";
import house5 from "@/assets/house-5.jpg";
import house6 from "@/assets/house-6.jpg";
import house7 from "@/assets/house-7.jpg";
import house8 from "@/assets/house-8.jpg";
import house9 from "@/assets/house-9.jpg";
import wideHouse from "@/assets/wide-house-1.webp";
import cabin31_1 from "@/assets/cabin-31-1.webp";

// Базовый набор проектов «других» от подрядчика.
// id указывает на маршрут /project/:id.
const baseOtherProjects = [
  { id: 32, name: "Wide House", price: "от 5,48 млн ₽", area: "46,4 м²", beds: 2, baths: 1, image: wideHouse },
  { id: 33, name: "Barn House", price: "от 1,68 млн ₽", area: "42,9 м²", beds: 1, baths: 1, image: cabin31_1 },
  { id: 1, name: "Тайга 72", price: "от 2,4 млн ₽", area: "72 м²", beds: 2, baths: 1, image: house1 },
  { id: 6, name: "Мидленд 66", price: "от 4,4 млн ₽", area: "56 м²", beds: 2, baths: 1, image: house6 },
  { id: 5, name: "Шервуд 72", price: "от 4,4 млн ₽", area: "70 м²", beds: 2, baths: 1, image: house7 },
  { id: 3, name: "Бонд 88", price: "от 5,8 млн ₽", area: "88 м²", beds: 3, baths: 2, image: house8 },
  { id: 10, name: "Печора", price: "от 4,6 млн ₽", area: "73 м²", beds: 2, baths: 1, image: house4 },
  { id: 13, name: "БД-109", price: "от 5,7 млн ₽", area: "109 м²", beds: 3, baths: 2, image: house5 },
  { id: 24, name: "Шале 76", price: "от 2,7 млн ₽", area: "76 м²", beds: 3, baths: 2, image: house3 },
  { id: 19, name: "Модуль 68", price: "от 2,4 млн ₽", area: "68 м²", beds: 3, baths: 2, image: house9 },
  { id: 11, name: "Барн 80", price: "от 2,9 млн ₽", area: "80 м²", beds: 3, baths: 2, image: house2 },
];

const PAGE_SIZE = 6;
const SCROLL_KEY_PREFIX = "project_feed_scroll_";

interface Props {
  currentId?: string;
}

const OtherProjectsFeed = ({ currentId }: Props) => {
  const navigate = useNavigate();
  const sentinelRef = useRef<HTMLDivElement>(null);

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

  // IntersectionObserver — автоподгрузка
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
              <div className="h-[260px] rounded-[14px] overflow-hidden">
                <img
                  src={project.image}
                  alt={project.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
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
