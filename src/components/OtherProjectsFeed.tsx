import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { navigateWithTransition } from "@/lib/viewTransition";
import { getProjectPath } from "@/lib/siteRoutes";
import ProjectCard from "@/components/ProjectCard";
import { projects as allProjects } from "@/data/projects";
import { compareProjectTechnologyPriority } from "@/lib/projectPriority";
import { isProjectAvailableInGeo } from "@/lib/geoSelection";

const RELATED_CARD_HEIGHT = "aspect-[4/3] h-auto md:h-[240px] md:aspect-auto";

interface Props {
  currentId?: string;
  deliveryRegion: string;
}

const OtherProjectsFeed = ({ currentId, deliveryRegion }: Props) => {
  const navigate = useNavigate();

  // Рекомендации следуют выбранному направлению доставки, а не региону производства проекта.
  const pool = useMemo(() => {
    const matchingProjects = allProjects
      .filter((p) => String(p.id) !== currentId)
      .filter((p) => isProjectAvailableInGeo(p.city, deliveryRegion, p.deliveryRegionSlugs))
      .sort(compareProjectTechnologyPriority);

    return Array.from(new Map(matchingProjects.map((project) => [project.id, project])).values());
  }, [currentId, deliveryRegion]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, projectId: number) => {
      const project = allProjects.find((item) => item.id === projectId);
      if (project) navigateWithTransition(e, navigate, getProjectPath(project));
    },
    [navigate]
  );

  if (pool.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-x-[2px] gap-y-[6px] md:gap-4 lg:grid-cols-3">
      {pool.map((project) => (
        <div key={project.id}>
          <ProjectCard projectId={project.id} height={RELATED_CARD_HEIGHT} onCardClick={handleClick} />
        </div>
      ))}
    </div>
  );
};

export default OtherProjectsFeed;
