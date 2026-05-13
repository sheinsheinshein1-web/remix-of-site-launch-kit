import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { navigateWithTransition } from "@/lib/viewTransition";
import ProjectCardSkeleton from "@/components/ProjectCardSkeleton";
import ProjectCard from "@/components/ProjectCard";
import { projects as allProjects } from "@/data/projects";

const PAGE_SIZE = 6;
const SCROLL_KEY_PREFIX = "project_feed_scroll_";

interface Props {
  currentId?: string;
}

const OtherProjectsFeed = ({ currentId }: Props) => {
  const navigate = useNavigate();
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Берём только проекты из того же города, что и текущий. Если города нет — показываем все.
  const pool = useMemo(() => {
    const current = allProjects.find((p) => String(p.id) === currentId);
    const targetCity = current?.city;
    return allProjects
      .filter((p) => String(p.id) !== currentId)
      .filter((p) => (targetCity ? p.city === targetCity : true));
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
        {items.map(({ project, key }) => (
          <ProjectCard key={key} projectId={project.id} onCardClick={handleClick} />
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

