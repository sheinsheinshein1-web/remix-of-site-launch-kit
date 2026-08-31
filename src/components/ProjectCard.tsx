/**
 * Единая карточка проекта для каталога, ленты, главной и избранного.
 *
 * Принцип: карточка САМА читает все данные из `src/data/projects.ts` по `projectId`
 * (галерея, fit, лайки, цена, площадь, метро). Это гарантирует,
 * что любая правка вида или правил отображения автоматически применяется во всех
 * местах. НИКОГДА не передавай эти данные пропами — карточка всегда тянет их сама.
 *
 * Если нужно показать карточку проекта — используй ТОЛЬКО этот компонент.
 */
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { navigateWithTransition } from "@/lib/viewTransition";
import SwipeableGallery from "@/components/SwipeableGallery";
import { useFavorites } from "@/contexts/FavoritesContext";
import { getProjectPath } from "@/lib/siteRoutes";
import { projectThumbs } from "@/data/projectThumbs";
import { isVerifiedMaker } from "@/lib/verifiedMakers";
import VerifiedBadge from "@/components/VerifiedBadge";
import {
  projects as allProjects,
  projectFits,
  projectObjectPositions,
} from "@/data/projects";

interface ProjectCardProps {
  projectId: number;
  /** Высота галереи. По умолчанию мобильная aspect 3:4 + md:h-[240px] для desktop. */
  height?: string;
  /** Обработчик клика по карточке (например, чтобы сохранить scroll position). */
  onCardClick?: (e: React.MouseEvent<HTMLAnchorElement>, projectId: number) => void;
  /** Отключить листание галереи — показывать только первое фото без точек/свайпа. */
  singleImage?: boolean;
}

const DEFAULT_HEIGHT = "aspect-[3/4] h-auto md:h-[240px] md:aspect-auto";

const wordForm = (count: number, forms: [string, string, string]) => {
  const mod100 = Math.abs(count) % 100;
  const mod10 = mod100 % 10;
  if (mod100 > 10 && mod100 < 20) return forms[2];
  if (mod10 === 1) return forms[0];
  if (mod10 >= 2 && mod10 <= 4) return forms[1];
  return forms[2];
};

const ProjectCard = ({ projectId, height = DEFAULT_HEIGHT, onCardClick, singleImage = false }: ProjectCardProps) => {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();

  const project = allProjects.find((p) => p.id === projectId);
  if (!project) return null;

  const allImages = project.gallery.map((g) => g.image);
  const firstImage = allImages[0] ?? "";
  const cardImages = firstImage
    ? [projectThumbs[project.id] ?? firstImage, ...allImages.slice(1)]
    : [];
  const images = singleImage ? cardImages.slice(0, 1) : cardImages;
  const liked = isFavorite(project.id);
  const isBathProject = project.productType === "bath";
  const likesCount = project.likes + (liked ? 1 : 0);
  const projectHref = getProjectPath(project);
  const displayPrice = /^(?:от(?:\s|$)|по запросу(?:\s|$))/i.test(project.price.trim())
    ? project.price
    : `от ${project.price}`;
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onCardClick) onCardClick(e, project.id);
    else navigateWithTransition(e, navigate, projectHref);
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
        href={projectHref}
        onClick={handleClick}
        className="block cursor-pointer"
        aria-label={`${project.name} — ${displayPrice}`}
      >
        <SwipeableGallery
          images={images}
          fits={projectFits[project.id]}
          objectPositions={projectObjectPositions[project.id]}
          alt={project.name}
          height={height}
        >
          <div className="absolute top-2 right-2 z-10">
            <button
              onClick={handleFavToggle}
              className="flex items-center gap-1 rounded-[var(--radius)] bg-foreground/40 px-2 py-[4px] backdrop-blur-md"
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
        <div className="px-1 pb-1.5 pt-2">
          <div className="flex min-w-0 items-center gap-2">
            <h2 className="truncate text-[14px] font-medium leading-tight text-[#342d27] md:text-[15px]">{project.name}</h2>
            {isVerifiedMaker(project.maker.id) && <VerifiedBadge className="ml-auto" />}
          </div>

          <div className="mt-1 whitespace-nowrap text-[13px] font-medium leading-tight text-[#342d27] md:text-[14px]">
            {displayPrice}
          </div>

          <p className="mt-2 text-[13px] font-medium leading-snug tracking-normal text-[#595653] md:text-[14px]">
            {isBathProject
              ? `${project.area} · парная · под ключ · ${project.floors} ${wordForm(project.floors, ["этаж", "этажа", "этажей"])}`
              : `${project.area} · ${project.beds} ${wordForm(project.beds, ["спальня", "спальни", "спален"])} · ${project.baths} ${wordForm(project.baths, ["санузел", "санузла", "санузлов"])} · ${project.floors} ${wordForm(project.floors, ["этаж", "этажа", "этажей"])}`}
          </p>
        </div>
      </a>
    </article>
  );
};

export default ProjectCard;
