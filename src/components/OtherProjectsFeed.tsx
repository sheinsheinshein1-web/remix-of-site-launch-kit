import { useCallback, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { navigateWithTransition } from "@/lib/viewTransition";
import { getProjectPath } from "@/lib/siteRoutes";
import ProjectCard from "@/components/ProjectCard";
import { projects as allProjects } from "@/data/projects";
import { compareProjectTechnologyPriority } from "@/lib/projectPriority";
import { isProjectAvailableInGeo } from "@/lib/geoSelection";
import { getProjectAreaAmount, getProjectPriceAmount } from "@/lib/projectDomain";
import { useHistoryBatch } from "@/hooks/useHistoryBatch";

const RELATED_CARD_HEIGHT = "aspect-[4/3] h-auto md:h-[240px] md:aspect-auto";
const INITIAL_PROJECT_COUNT = 6;
const PROJECT_BATCH_SIZE = 12;

interface Props {
  currentId?: string;
  deliveryRegion: string;
  productType?: "house" | "bath" | "all";
  excludeManufacturerId?: string;
}

const OtherProjectsFeed = ({
  currentId,
  deliveryRegion,
  productType = "house",
  excludeManufacturerId,
}: Props) => {
  const navigate = useNavigate();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Рекомендации следуют выбранному направлению доставки, а не региону производства проекта.
  const pool = useMemo(() => {
    const currentProject = allProjects.find((project) => String(project.id) === currentId);
    const currentArea = currentProject ? getProjectAreaAmount(currentProject) : null;
    const currentPrice = currentProject ? getProjectPriceAmount(currentProject.price) : null;
    const matchingProjects = allProjects
      .filter((p) => String(p.id) !== currentId)
      .filter((p) => !excludeManufacturerId || p.manufacturerId !== excludeManufacturerId)
      .filter((p) => productType === "all" || (productType === "bath"
        ? p.productType === "bath" || p.productType === "house-bath"
        : p.productType !== "bath"))
      .filter((p) => isProjectAvailableInGeo(p.city, deliveryRegion, p.deliveryRegionSlugs))
      .sort((a, b) => {
        const manufacturerPriority = currentProject
          ? Number(b.manufacturerId === currentProject.manufacturerId)
            - Number(a.manufacturerId === currentProject.manufacturerId)
          : 0;
        if (manufacturerPriority !== 0) return manufacturerPriority;

        const technologyPriority = compareProjectTechnologyPriority(a, b);
        if (technologyPriority !== 0) return technologyPriority;

        if (currentArea !== null) {
          const areaA = getProjectAreaAmount(a);
          const areaB = getProjectAreaAmount(b);
          const areaDistanceA = areaA === null ? Number.POSITIVE_INFINITY : Math.abs(areaA - currentArea);
          const areaDistanceB = areaB === null ? Number.POSITIVE_INFINITY : Math.abs(areaB - currentArea);
          if (areaDistanceA !== areaDistanceB) return areaDistanceA - areaDistanceB;
        }

        if (currentPrice !== null) {
          const priceA = getProjectPriceAmount(a.price);
          const priceB = getProjectPriceAmount(b.price);
          const priceDistanceA = priceA === null ? Number.POSITIVE_INFINITY : Math.abs(priceA - currentPrice);
          const priceDistanceB = priceB === null ? Number.POSITIVE_INFINITY : Math.abs(priceB - currentPrice);
          if (priceDistanceA !== priceDistanceB) return priceDistanceA - priceDistanceB;
        }

        return a.id - b.id;
      });

    return Array.from(new Map(matchingProjects.map((project) => [project.id, project])).values());
  }, [currentId, deliveryRegion, excludeManufacturerId, productType]);

  const { visibleCount, loadNextBatch } = useHistoryBatch({
    namespace: "project-recommendations",
    identity: `${currentId ?? "unknown"}:${deliveryRegion}:${productType}:${excludeManufacturerId ?? "all-makers"}`,
    itemCount: pool.length,
    initialCount: INITIAL_PROJECT_COUNT,
    batchSize: PROJECT_BATCH_SIZE,
  });

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || visibleCount >= pool.length || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.unobserve(entry.target);
          loadNextBatch();
        }
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [loadNextBatch, pool.length, visibleCount]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, projectId: number) => {
      const project = allProjects.find((item) => item.id === projectId);
      if (project) navigateWithTransition(e, navigate, getProjectPath(project));
    },
    [navigate]
  );

  if (pool.length === 0) return null;

  const visibleProjects = pool.slice(0, visibleCount);
  const hasMoreProjects = visibleCount < pool.length;

  return (
    <>
      <div className="grid grid-cols-2 gap-x-[2px] gap-y-[6px] md:gap-4 lg:grid-cols-3">
        {visibleProjects.map((project) => (
          <ProjectCard
            key={project.id}
            projectId={project.id}
            height={RELATED_CARD_HEIGHT}
            onCardClick={handleClick}
          />
        ))}
      </div>
      {hasMoreProjects && (
        <div
          ref={loadMoreRef}
          className="h-px w-full"
          aria-hidden="true"
          data-testid="other-projects-load-more"
        />
      )}
      <p className="sr-only" aria-live="polite">
        Показано проектов: {visibleProjects.length} из {pool.length}
      </p>
    </>
  );
};

export default OtherProjectsFeed;
