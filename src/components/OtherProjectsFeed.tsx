import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { navigateWithTransition } from "@/lib/viewTransition";
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

// Базовый набор проектов «других» от подрядчика.
// id указывает на маршрут /project/:id.
const baseOtherProjects = [
  { id: 1, name: "Тайга 72", price: "от 2,4 млн ₽", meta: "72 м² · 2 спальни · 1 этаж", image: house1 },
  { id: 6, name: "Мидленд 66", price: "от 4,4 млн ₽", meta: "56 м² · 2 спальни · 1 этаж", image: house6 },
  { id: 5, name: "Шервуд 72", price: "от 4,4 млн ₽", meta: "70 м² · 2 спальни · 1 этаж", image: house7 },
  { id: 3, name: "Бонд 88", price: "от 5,8 млн ₽", meta: "88 м² · 3 спальни · 1 этаж", image: house8 },
  { id: 10, name: "Печора", price: "от 4,6 млн ₽", meta: "73 м² · 2 спальни · 1 этаж", image: house4 },
  { id: 13, name: "БД-109", price: "от 5,7 млн ₽", meta: "109 м² · 3 спальни · 1 этаж", image: house5 },
  { id: 24, name: "Шале 76", price: "от 2,7 млн ₽", meta: "76 м² · 3 спальни · 1 этаж", image: house3 },
  { id: 19, name: "Модуль 68", price: "от 2,4 млн ₽", meta: "68 м² · 3 спальни · 1 этаж", image: house9 },
  { id: 11, name: "Барн 80", price: "от 2,9 млн ₽", meta: "80 м² · 3 спальни · 1 этаж", image: house2 },
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
          setPage((p) => Math.min(p + 1, 30));
        }
      },
      { rootMargin: "600px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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
      <div className="grid grid-cols-2 gap-x-[2px] gap-y-[6px]">
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
                <div className="text-[12px] font-bold text-foreground">{project.price}</div>
                <p className="text-[12px] font-normal text-foreground/80 whitespace-nowrap leading-none mt-[2px]">
                  {project.meta}
                </p>
              </div>
            </a>
          </article>
        ))}
      </div>
      <div ref={sentinelRef} aria-hidden="true" className="h-1 w-full" />
    </>
  );
};

export default OtherProjectsFeed;
