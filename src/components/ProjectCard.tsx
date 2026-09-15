/**
 * Единая карточка проекта для каталога, ленты, главной и избранного.
 *
 * Принцип: карточка получает готовые данные из единого Project ViewModel по `projectId`
 * (галерея, fit, лайки, цена, площадь, производитель). Это гарантирует,
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
import { getProjectCardViewModel } from "@/lib/projectViewModel";
import VerifiedBadge from "@/components/VerifiedBadge";

interface ProjectCardProps {
  projectId: number;
  /** Высота галереи. По умолчанию мобильная aspect 3:4 + md:h-[240px] для desktop. */
  height?: string;
  /** Обработчик клика по карточке (например, чтобы сохранить scroll position). */
  onCardClick?: (e: React.MouseEvent<HTMLAnchorElement>, projectId: number) => void;
  /** Отключить листание галереи — показывать только первое фото без точек/свайпа. */
  singleImage?: boolean;
  /** Семантический уровень названия карточки внутри текущего раздела. */
  headingLevel?: "h2" | "h3";
}

const DEFAULT_HEIGHT = "aspect-[3/4] h-auto md:h-[240px] md:aspect-auto";

const ProjectCard = ({
  projectId,
  height = DEFAULT_HEIGHT,
  onCardClick,
  singleImage = false,
  headingLevel = "h2",
}: ProjectCardProps) => {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();

  const viewModel = getProjectCardViewModel(projectId);
  if (!viewModel) return null;

  const images = singleImage ? viewModel.gallery.desktop.slice(0, 1) : viewModel.gallery.desktop;
  const mobileImages = singleImage ? viewModel.gallery.mobile.slice(0, 1) : viewModel.gallery.mobile;
  const liked = isFavorite(viewModel.id);
  const likesCount = viewModel.likes + (liked ? 1 : 0);
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onCardClick) onCardClick(e, viewModel.id);
    else navigateWithTransition(e, navigate, viewModel.href);
  };

  const handleFavToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(viewModel.favorite);
  };
  const Heading = headingLevel;

  return (
    <article className="relative overflow-hidden">
      <a
        href={viewModel.href}
        onClick={handleClick}
        className="block cursor-pointer"
        aria-label={`${viewModel.name} — ${viewModel.price.label}`}
      >
        <SwipeableGallery
          images={images}
          mobileImages={mobileImages}
          fits={viewModel.gallery.fits}
          objectPositions={viewModel.gallery.objectPositions}
          alt={viewModel.name}
          height={height}
        />
        <div className="px-1 pb-1.5 pt-2">
          <div className="flex min-w-0 items-center gap-2">
            <Heading className="truncate text-[14px] font-medium leading-tight text-[#342d27] md:text-[15px]">{viewModel.name}</Heading>
            {viewModel.manufacturer.verified && <VerifiedBadge className="ml-auto" />}
          </div>

          <div className="mt-1 whitespace-nowrap text-[13px] font-medium leading-tight text-[#342d27] md:text-[14px]">
            {viewModel.price.label}
          </div>

          <p className="mt-2 text-[13px] font-medium leading-snug tracking-normal text-[#595653] md:text-[14px]">
            {viewModel.facts.join(" · ")}
          </p>
        </div>
      </a>
      <button
        type="button"
        onClick={handleFavToggle}
        className="absolute right-2 top-2 z-10 flex items-center gap-1 rounded-[var(--radius)] bg-foreground/40 px-2 py-[4px] backdrop-blur-md"
        aria-label={liked ? "Удалить из избранного" : "Добавить в избранное"}
        aria-pressed={liked}
      >
        <Heart
          className={`h-3.5 w-3.5 ${liked ? "fill-red-500 text-red-500" : "text-white/70"}`}
          strokeWidth={1.5}
        />
        <span className="text-[11px] font-medium text-white">{likesCount}</span>
      </button>
    </article>
  );
};

export default ProjectCard;
