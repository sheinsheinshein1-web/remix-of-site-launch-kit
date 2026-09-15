import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import ProjectCard from "@/components/ProjectCard";
import Seo from "@/components/Seo";
import VerifiedBadge from "@/components/VerifiedBadge";
import { useFavorites } from "@/contexts/FavoritesContext";
import { manufacturerRegistry } from "@/data/manufacturers";
import { projectThumbs } from "@/data/projectThumbs";
import { projects } from "@/data/projects";
import { isVerifiedMaker } from "@/lib/verifiedMakers";

const project = projects.find((item) => item.id === 40);

const ModernProjectCard = () => {
  const { isFavorite, toggleFavorite } = useFavorites();

  if (!project) return null;
  const manufacturer = manufacturerRegistry[project.manufacturerId];
  if (!manufacturer) return null;

  const liked = isFavorite(project.id);
  const likesCount = project.likes + (liked ? 1 : 0);
  const projectHref = "/lab/interface-cards/project";
  const firstImage = projectThumbs[project.id] ?? project.gallery[0]?.image ?? "";
  const facts = [
    ["Площадь", project.area],
    ["Спальни", String(project.beds)],
    ["Санузел", String(project.baths)],
    ["Этаж", String(project.floors)],
  ] as const;

  const handleFavorite = () => {
    toggleFavorite({
      id: project.id,
      badge: project.badge,
      maker: manufacturer.name,
      name: project.name,
      price: project.price,
      area: project.area,
      beds: project.beds,
      baths: project.baths,
      term: project.term,
      image: project.gallery[0]?.image ?? firstImage,
      likes: project.likes,
      city: project.city,
    });
  };

  return (
    <article className="w-full">
      <div className="group/image relative aspect-[5/4] overflow-hidden rounded-[var(--radius)] bg-secondary">
        <Link
          to={projectHref}
          aria-label={`Открыть обновлённую страницу проекта ${project.name}`}
          className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <img
            src={firstImage}
            alt={`Модульный дом ${project.name}`}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover/image:scale-[1.015] motion-reduce:transition-none"
            loading="eager"
            decoding="async"
          />
          <span className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/25 to-transparent" />
        </Link>

        <button
          type="button"
          onClick={handleFavorite}
          aria-label={liked ? "Убрать из избранного" : "Добавить в избранное"}
          aria-pressed={liked}
          className="absolute right-0 top-0 z-10 flex min-h-11 min-w-11 items-center justify-center p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <span className="flex items-center gap-1.5 rounded-[var(--radius)] bg-[#242424]/55 px-2 py-1.5 text-white backdrop-blur-md transition-colors hover:bg-[#242424]/70">
            <Heart
              className={`h-3.5 w-3.5 ${liked ? "fill-red-500 text-red-500" : "text-white"}`}
              strokeWidth={1.5}
              aria-hidden
            />
            <span className="text-[12px] font-medium leading-none">{likesCount}</span>
          </span>
        </button>
      </div>

      <div className="px-1 pb-1 pt-3.5">
        <div className="flex items-start justify-between gap-5">
          <div className="min-w-0">
            <Link
              to={projectHref}
              className="inline-block rounded-[var(--radius)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <h2 className="truncate text-[20px] font-semibold leading-tight tracking-[-0.025em] text-foreground transition-colors hover:text-primary md:text-[22px]">
                {project.name}
              </h2>
            </Link>
            <div className="mt-1.5 flex min-w-0 items-center gap-2">
              <p className="truncate text-[13px] leading-none text-muted-foreground">{manufacturer.name}</p>
              {isVerifiedMaker(project.manufacturerId) && <VerifiedBadge />}
            </div>
          </div>

          <p className="shrink-0 whitespace-nowrap pt-0.5 text-[15px] font-semibold leading-tight tracking-[-0.02em] text-foreground md:text-[16px]">
            от {project.price}
          </p>
        </div>

        <dl className="mt-4 grid grid-cols-4 gap-3">
          {facts.map(([label, value]) => (
            <div key={label} className="min-w-0">
              <dt className="truncate text-[12px] leading-tight text-muted-foreground">{label}</dt>
              <dd className="mt-1 text-[14px] font-medium leading-tight text-foreground">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </article>
  );
};

const InterfaceCardsConcept = () => {
  if (!project) return null;

  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <Seo
        title="ПАТИО | обновлённая карточка проекта"
        description="Локальный пример аккуратного обновления карточки проекта ПАТИО."
        canonicalPath="/lab/interface-cards"
        noIndex
      />

      <main className="mx-auto w-full max-w-[920px] px-4 py-10 sm:px-6 md:py-16">
        <h1 className="text-[28px] font-semibold leading-tight tracking-[-0.03em] md:text-[36px]">
          Карточка проекта ПАТИО
        </h1>

        <div className="mt-10 grid items-start gap-14 md:grid-cols-2 md:gap-12">
          <section className="order-2 md:order-1" aria-labelledby="current-card-title">
            <h2 id="current-card-title" className="mb-4 text-[14px] font-medium text-muted-foreground">
              Сейчас
            </h2>
            <ProjectCard projectId={project.id} height="aspect-[5/4] h-auto" />
          </section>

          <section className="order-1 md:order-2" aria-labelledby="updated-card-title">
            <h2 id="updated-card-title" className="mb-4 text-[14px] font-medium text-foreground">
              Обновлено
            </h2>
            <ModernProjectCard />
          </section>
        </div>
      </main>
    </div>
  );
};

export default InterfaceCardsConcept;
