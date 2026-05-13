/**
 * Единая карточка проекта для каталога, ленты, главной и избранного.
 *
 * Принцип: карточка САМА читает все данные из `src/data/projects.ts` по `projectId`
 * (галерея, blur, fit, edgeBleed, лайки, цена, площадь, метро). Это гарантирует,
 * что любая правка вида или правил отображения автоматически применяется во всех
 * местах. НИКОГДА не передавай эти данные пропами — карточка всегда тянет их сама.
 *
 * Если нужно показать карточку проекта — используй ТОЛЬКО этот компонент.
 */
import { Heart, Maximize, BedDouble, Bath } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { navigateWithTransition } from "@/lib/viewTransition";
import SwipeableGallery from "@/components/SwipeableGallery";
import { useFavorites } from "@/contexts/FavoritesContext";
import {
  projects as allProjects,
  projectFits,
  projectBlurBackground,
  projectObjectPositions,
  projectEdgeBleed,
} from "@/data/projects";

interface ProjectCardProps {
  projectId: number;
  /** Высота галереи. По умолчанию мобильная aspect 3:4 + md:h-[240px] для desktop. */
  height?: string;
  /** Обработчик клика по карточке (например, чтобы сохранить scroll position). */
  onCardClick?: (e: React.MouseEvent<HTMLAnchorElement>, projectId: number) => void;
}

const DEFAULT_HEIGHT = "aspect-[3/4] h-auto md:h-[240px] md:aspect-auto";

const ProjectCard = ({ projectId, height = DEFAULT_HEIGHT, onCardClick }: ProjectCardProps) => {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();

  const project = allProjects.find((p) => p.id === projectId);
  if (!project) return null;

  const images = project.gallery.map((g) => g.image);
  const firstImage = images[0] ?? "";
  const liked = isFavorite(project.id);
  const likesCount = project.likes + (liked ? 1 : 0);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onCardClick) onCardClick(e, project.id);
    else navigateWithTransition(e, navigate, `/project/${project.id}`);
  };

  const handleFavToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite({
      id: project.id,
      badge: project.badge,
      maker: project.maker.name,
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
  };

  return (
    <article className="overflow-hidden">
      <a
        href={`/project/${project.id}`}
        onClick={handleClick}
        className="block cursor-pointer"
        aria-label={`${project.name} — от ${project.price}`}
      >
        <SwipeableGallery
          images={images}
          fits={projectFits[project.id]}
          objectPositions={projectObjectPositions[project.id]}
          blurBackground={projectBlurBackground[project.id]}
          edgeBleed={projectEdgeBleed[project.id]}
          alt={project.name}
          height={height}
        >
          <div className="absolute top-2 right-2 z-10">
            <button
              onClick={handleFavToggle}
              className="flex items-center gap-1 bg-foreground/40 backdrop-blur-md rounded-full px-2 py-[4px]"
              aria-label="В избранное"
            >
              <Heart
                className={`w-3.5 h-3.5 ${liked ? "fill-red-500 text-red-500" : "text-white/70"}`}
                strokeWidth={1.5}
              />
              <span className="text-[11px] font-medium text-white">{likesCount}</span>
            </button>
          </div>
        </SwipeableGallery>
        <div className="px-[10px] pt-1 pb-1">
          <h2 className="text-[11px] font-medium text-foreground/60 uppercase tracking-wide truncate">{project.name}</h2>
          <div className="text-[13px] font-bold text-foreground whitespace-nowrap leading-tight mt-[1px]">от {project.price}</div>
          <div className="flex items-center gap-2 text-[12px] font-normal text-foreground/80 whitespace-nowrap leading-none mt-[3px]">
            <span className="inline-flex items-center gap-[3px]"><Maximize className="w-3 h-3" strokeWidth={1.75} />{project.area}</span>
            <span className="inline-flex items-center gap-[3px]"><BedDouble className="w-3 h-3" strokeWidth={1.75} />{project.beds}</span>
            <span className="inline-flex items-center gap-[3px]"><Bath className="w-3 h-3" strokeWidth={1.75} />{project.baths}</span>
          </div>
        </div>
      </a>
    </article>
  );
};

export default ProjectCard;
