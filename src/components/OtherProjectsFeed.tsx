import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { navigateWithTransition } from "@/lib/viewTransition";
import { Heart, Maximize, BedDouble, Bath } from "lucide-react";
import ProjectCardSkeleton from "@/components/ProjectCardSkeleton";
import SwipeableGallery from "@/components/SwipeableGallery";
import { useFavorites } from "@/contexts/FavoritesContext";
import {
  projects as allProjects,
  projectFits,
  projectBlurBackground,
  projectObjectPositions,
} from "@/data/projects";

const PAGE_SIZE = 6;
const SCROLL_KEY_PREFIX = "project_feed_scroll_";

interface Props {
  currentId?: string;
}

const OtherProjectsFeed = ({ currentId }: Props) => {
  const navigate = useNavigate();
  const sentinelRef = useRef<HTMLDivElement>(null);
  const { isFavorite, toggleFavorite } = useFavorites();

  // Берём только проекты из того же города, что и текущий. Если города нет — показываем все.
  const pool = useMemo(() => {
    const current = allProjects.find((p) => String(p.id) === currentId);
    const targetCity = current?.city;
    return allProjects
      .filter((p) => String(p.id) !== currentId)
      .filter((p) => (targetCity ? p.city === targetCity : true))
      .map((p) => ({
        id: p.id,
        name: p.name,
        maker: p.maker.name,
        price: p.price,
        area: p.area,
        beds: p.beds,
        baths: p.baths,
        term: p.term,
        city: p.city,
        likes: p.likes,
        gallery: p.gallery,
      }));
  }, [currentId]);

  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const MAX_PAGE = 30;
  const total = page * PAGE_SIZE;
  const items = pool.length === 0
    ? []
    : Array.from({ length: total }, (_, i) => {
        const project = pool[i % pool.length];
        return { project, key: `${project.id}-${i}` };
      });

  useEffect(() => {
    if (!sentinelRef.current) return;
    if (page >= MAX_PAGE) return;
    if (pool.length === 0) return;
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
  }, [page, pool.length]);

  useEffect(() => {
    if (isLoadingMore) setIsLoadingMore(false);
  }, [page]);

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

  if (pool.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-[2px] gap-y-[6px] md:gap-4">
        {items.map(({ project, key }) => {
          const images = project.gallery.map((g) => g.image);
          const fits = project.gallery.map((g) => g.fit ?? "cover");
          const firstImage = images[0] ?? "";
          return (
            <article key={key} className="overflow-hidden">
              <a
                href={`/project/${project.id}`}
                onClick={(e) => handleClick(e, project.id)}
                className="block cursor-pointer"
                aria-label={`${project.name} — ${project.price}`}
              >
                <SwipeableGallery
                  images={images}
                  fits={fits}
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
                          image: firstImage,
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
                        {project.likes + (isFavorite(project.id) ? 1 : 0)}
                      </span>
                    </button>
                  </div>
                </SwipeableGallery>
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
          );
        })}
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
