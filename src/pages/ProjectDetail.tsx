import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Bath,
  BedDouble,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Forward,
  Heart,
  Images,
  Layers,
  Maximize,
  Play,
  Ruler,
  Star,
  X,
} from "lucide-react";
import Header from "@/components/Header";
import CitySelector, { useCity } from "@/components/CitySelector";
import Footer from "@/components/Footer";
import MobileExpandableText from "@/components/MobileExpandableText";
import OtherProjectsFeed from "@/components/OtherProjectsFeed";
import ProjectReportDialog from "@/components/ProjectReportDialog";
import ProjectRooms from "@/components/ProjectRooms";
import Seo from "@/components/Seo";
import SiteBreadcrumbs, { siteBreadcrumbPageContainerClassName } from "@/components/SiteBreadcrumbs";
import VerifiedBadge from "@/components/VerifiedBadge";
import NotFound from "@/pages/NotFound";
import { useIsMobile } from "@/hooks/use-mobile";
import { useFavorites } from "@/contexts/FavoritesContext";
import { buildAssetUrl, buildSiteUrl } from "@/lib/seo";
import { getCityDisplayName } from "@/lib/cityDisplay";
import {
  getGeoSelectionAccusative,
  getGeoSelectionLabel,
  getGeoSelectionPrepositional,
  getProjectDeliveryRegions,
  isAllRegionsGeo,
  isProjectAvailableInGeo,
  normalizeGeoSelection,
} from "@/lib/geoSelection";
import { projects, projectsCountByMakerId } from "@/data/projects";
import { getPartnerReviewSummary } from "@/data/partnerReviews";
import { isVerifiedMaker } from "@/lib/verifiedMakers";
import {
  CATALOG_PATH,
  getManufacturerPath,
  getProjectIdFromRouteParam,
  getProjectPath,
  getRegionPath,
} from "@/lib/siteRoutes";

const wordForm = (count: number, forms: [string, string, string]) => {
  const mod100 = Math.abs(count) % 100;
  const mod10 = mod100 % 10;
  if (mod100 > 10 && mod100 < 20) return forms[2];
  if (mod10 === 1) return forms[0];
  if (mod10 >= 2 && mod10 <= 4) return forms[1];
  return forms[2];
};

const ProjectDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id, projectSlug } = useParams();
  const isMobile = useIsMobile();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { city: deliveryRegionSlug, selectCity: selectDeliveryRegion } = useCity();
  const routeProjectId = getProjectIdFromRouteParam(projectSlug ?? id);
  const project = projects.find((item) => item.id === routeProjectId);
  const projectDeliveryRegions = getProjectDeliveryRegions(project?.city, project?.deliveryRegionSlugs);

  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [deliveryCityOpen, setDeliveryCityOpen] = useState(false);
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const galleryWrapRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const dragOffsetRef = useRef(0);
  const lockedAxis = useRef<"x" | "y" | null>(null);
  const isDragging = useRef(false);
  const [dragOffset, setDragOffset] = useState(0);
  const lightboxStartX = useRef<number | null>(null);

  const galleryLength = project?.gallery.length ?? 0;

  const finishSwipe = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    if (sliderRef.current) sliderRef.current.style.transition = "";
    const offset = dragOffsetRef.current;
    if (lockedAxis.current === "x" && Math.abs(offset) > 60) {
      if (offset < 0) setActiveImage((current) => Math.min(galleryLength - 1, current + 1));
      if (offset > 0) setActiveImage((current) => Math.max(0, current - 1));
    }
    lockedAxis.current = null;
    dragOffsetRef.current = 0;
    setDragOffset(0);
  }, [galleryLength]);

  useEffect(() => {
    setDetailsExpanded(false);
  }, [routeProjectId]);

  useEffect(() => {
    const element = galleryWrapRef.current;
    if (!element) return;

    const handleStart = (event: TouchEvent) => {
      touchStartX.current = event.touches[0].clientX;
      touchStartY.current = event.touches[0].clientY;
      lockedAxis.current = null;
      isDragging.current = true;
      dragOffsetRef.current = 0;
      if (sliderRef.current) sliderRef.current.style.transition = "none";
    };

    const handleMove = (event: TouchEvent) => {
      if (!isDragging.current) return;
      const dx = event.touches[0].clientX - touchStartX.current;
      const dy = event.touches[0].clientY - touchStartY.current;

      if (!lockedAxis.current && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
        lockedAxis.current = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      }
      if (lockedAxis.current === "x") {
        if (event.cancelable) event.preventDefault();
        dragOffsetRef.current = dx;
        setDragOffset(dx);
      }
    };

    element.addEventListener("touchstart", handleStart, { passive: true });
    element.addEventListener("touchmove", handleMove, { passive: false });
    element.addEventListener("touchend", finishSwipe, { passive: true });
    element.addEventListener("touchcancel", finishSwipe, { passive: true });
    return () => {
      element.removeEventListener("touchstart", handleStart);
      element.removeEventListener("touchmove", handleMove);
      element.removeEventListener("touchend", finishSwipe);
      element.removeEventListener("touchcancel", finishSwipe);
    };
  }, [finishSwipe]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setActiveImage(0);
  }, [routeProjectId]);

  useEffect(() => {
    if (!project) return;
    const canonicalProjectPath = getProjectPath(project);
    if (location.pathname === canonicalProjectPath) return;
    navigate(`${canonicalProjectPath}${location.search}${location.hash}`, { replace: true });
  }, [location.hash, location.pathname, location.search, navigate, project]);

  if (!project) return <NotFound />;

  const makerId = project.maker.id ?? "";
  const canonicalPath = getProjectPath(project);
  const makerHref = getManufacturerPath(makerId);
  const verified = isVerifiedMaker(makerId);
  const reviewSummary = getPartnerReviewSummary(makerId);
  const liked = isFavorite(project.id);
  const firstImage = project.gallery[0]?.image ?? "";
  const isBathProject = project.productType === "bath";
  const bathCatalogHref = `${CATALOG_PATH}?type=bath`;
  const priceLabel = /^(?:от(?:\s|$)|по запросу(?:\s|$))/i.test(project.price.trim())
    ? project.price
    : `от ${project.price}`;
  const seoProjectType = isBathProject
    ? "Модульная баня"
    : project.technology.toLocaleLowerCase("ru").includes("префаб")
      ? "Префаб-дом"
      : "Модульный дом";
  const seoTitle = `${seoProjectType} ${project.name}, ${project.area} от ${project.maker.name} | многоместа.рф`;
  const seoDescription = `${seoProjectType} ${project.name} площадью ${project.area} от ${project.maker.name}. Цена ${priceLabel}. ${project.description}`.slice(0, 160);
  const deliveryCityLabel = getGeoSelectionLabel(deliveryRegionSlug);
  const deliveryRegionAccusative = getGeoSelectionAccusative(deliveryRegionSlug);
  const deliveryRegionPrepositional = getGeoSelectionPrepositional(deliveryRegionSlug);
  const allRegionsSelected = isAllRegionsGeo(deliveryRegionSlug);
  const deliveryRegionHref = allRegionsSelected
    ? CATALOG_PATH
    : getRegionPath(normalizeGeoSelection(deliveryRegionSlug));
  const deliveryAvailable = isProjectAvailableInGeo(project.city, deliveryRegionSlug, project.deliveryRegionSlugs);

  const favoriteItem = {
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
  };

  const handleToggleFavorite = () => toggleFavorite(favoriteItem);
  const handleShare = async () => {
    const shareData = { title: `${project.name} — Много места`, url: window.location.href };
    if (navigator.share) {
      await navigator.share(shareData).catch(() => undefined);
      return;
    }
    await navigator.clipboard?.writeText(window.location.href).catch(() => undefined);
  };

  const renderDeliveryMessage = () => (
    <p className="mt-2 text-[13px] leading-relaxed text-[#717b8e]">
      {allRegionsSelected ? (
        <>
          Цена зависит от комплектации и региона доставки.{" "}
          <button
            type="button"
            onClick={() => setDeliveryCityOpen(true)}
            className="font-medium text-primary transition-colors hover:text-primary/75 focus-visible:rounded-[var(--radius)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          >
            Выбрать регион
          </button>
        </>
      ) : deliveryAvailable ? (
        <>
          Цена зависит от комплектации и доставки в{" "}
          <button
            type="button"
            onClick={() => setDeliveryCityOpen(true)}
            className="inline-flex items-center gap-0.5 font-medium text-primary underline decoration-primary/25 underline-offset-2 transition-colors hover:text-primary/75 hover:decoration-primary/60 focus-visible:rounded-[var(--radius)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            aria-label={`Выбрать регион доставки. Сейчас ${deliveryCityLabel}`}
          >
            {deliveryRegionAccusative}
            <ChevronDown className="h-3 w-3 shrink-0" strokeWidth={1.8} aria-hidden />
          </button>
        </>
      ) : (
        <>
          Проект недоступен для доставки в {deliveryRegionAccusative}.{" "}
          <button
            type="button"
            onClick={() => setDeliveryCityOpen(true)}
            className="font-medium text-primary transition-colors hover:text-primary/75 focus-visible:rounded-[var(--radius)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          >
            Выбрать другой регион
          </button>
        </>
      )}
    </p>
  );

  const renderProjectAction = (className: string) => deliveryAvailable ? (
    <a
      href={project.maker.siteUrl}
      target="_blank"
      rel="noopener noreferrer nofollow sponsored"
      className={className}
    >
      Перейти на сайт
    </a>
  ) : (
    <button type="button" onClick={() => navigate(deliveryRegionHref)} className={className}>
      Смотреть проекты {deliveryRegionPrepositional}
    </button>
  );

  const priceDigits = (project.price.match(/\d+/g) ?? []).join("");
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: project.name,
    description: project.descriptionLong || project.description,
    brand: { "@type": "Brand", name: project.maker.name },
    image: firstImage ? buildAssetUrl(firstImage) : undefined,
    offers: priceDigits
      ? {
          "@type": "Offer",
          priceCurrency: "RUB",
          price: priceDigits,
          url: buildSiteUrl(canonicalPath),
        }
      : undefined,
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: buildSiteUrl("/") },
      {
        "@type": "ListItem",
        position: 2,
        name: isBathProject ? "Модульные бани" : "Проекты",
        item: buildSiteUrl(isBathProject ? bathCatalogHref : CATALOG_PATH),
      },
      { "@type": "ListItem", position: 3, name: project.name, item: buildSiteUrl(canonicalPath) },
    ],
  };

  const specItems = isBathProject
    ? [
        { icon: Maximize, value: project.area, label: "Площадь" },
        { icon: Ruler, value: project.dimensions ?? "По запросу", label: "Габариты" },
        { icon: Bath, value: project.steamRoomArea ?? "Есть", label: "Парная" },
        { icon: Layers, value: String(project.floors), label: wordForm(project.floors, ["Этаж", "Этажа", "Этажей"]) },
      ]
    : [
        { icon: Maximize, value: project.area, label: "Площадь" },
        { icon: BedDouble, value: String(project.beds), label: wordForm(project.beds, ["Спальня", "Спальни", "Спален"]) },
        { icon: Bath, value: String(project.baths), label: wordForm(project.baths, ["Санузел", "Санузла", "Санузлов"]) },
        { icon: Layers, value: String(project.floors), label: wordForm(project.floors, ["Этаж", "Этажа", "Этажей"]) },
      ];
  const rawProjectDescription = project.descriptionLong || project.description;
  const descriptionPrefix = `${project.name} — `;
  const unprefixedProjectDescription = rawProjectDescription.startsWith(descriptionPrefix)
    ? rawProjectDescription.slice(descriptionPrefix.length)
    : rawProjectDescription;
  const projectDescription = unprefixedProjectDescription.charAt(0).toUpperCase() + unprefixedProjectDescription.slice(1);

  const detailRows = isBathProject
    ? [
        ["Тип объекта", "Модульная баня"],
        ["Габариты", project.dimensions ?? "По запросу"],
        ["Отделка парной", project.steamRoomFinish ?? "По запросу"],
        ["Пол", project.floorFinish ?? "По запросу"],
        ["Регион производства", getCityDisplayName(project.city)],
      ]
    : [
        ["Технология", project.technology],
        ["Утепление", project.insulation],
        ["Срок строительства", "до 60 дней"],
        ["Стиль", project.style],
        ["Регион производства", getCityDisplayName(project.city)],
      ];

  const renderGalleryImage = (index: number, mobile = false) => {
    const item = project.gallery[index];
    const isContain = item.fit === "contain";
    return (
      <div className={`relative isolate overflow-hidden bg-secondary ${mobile ? "aspect-[4/3]" : "h-full"}`}>
        <img
          src={item.image}
          alt={`${project.name}, изображение ${index + 1}`}
          className={`relative z-10 h-full w-full ${isContain ? "object-contain" : "object-cover"}`}
          loading={index === 0 ? "eager" : "lazy"}
          decoding="async"
          draggable={false}
          onClick={() => setLightboxOpen(true)}
        />
        {item.type === "video" && (
          <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-[var(--radius)] bg-white/90 text-[#342d27] shadow-sm">
              <Play className="h-5 w-5 fill-current" aria-hidden />
            </span>
          </div>
        )}
      </div>
    );
  };

  const mosaicIndexes = project.gallery.slice(0, 5).map((_, index) => index);
  const mosaicPreviewCount = Math.max(0, mosaicIndexes.length - 1);
  const lastMosaicIndex = mosaicIndexes[mosaicIndexes.length - 1] ?? 0;

  const mosaicCellClass = (previewIndex: number) => {
    if (mosaicPreviewCount === 1) return "col-span-2 row-span-2";
    if (mosaicPreviewCount === 2) return "col-span-2";
    if (mosaicPreviewCount === 3 && previewIndex === 0) return "col-span-2";
    return "";
  };

  const renderMosaicImage = (index: number, primary = false, previewIndex = 0) => {
    const item = project.gallery[index];
    const isContain = item.fit === "contain";
    const showCount = index === lastMosaicIndex;

    return (
      <button
        key={index}
        type="button"
        onClick={() => { setActiveImage(index); setLightboxOpen(true); }}
        className={`group relative isolate h-full min-h-0 w-full cursor-pointer overflow-hidden rounded-[var(--radius)] bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 ${primary ? "" : mosaicCellClass(previewIndex)}`}
        aria-label={`Открыть фотографию ${index + 1} из ${project.gallery.length}`}
      >
        <img
          src={item.image}
          alt={`${project.name}, фотография ${index + 1}`}
          className={`relative z-10 h-full w-full transition-transform duration-300 group-hover:scale-[1.01] motion-reduce:transform-none ${isContain ? "object-contain" : "object-cover"}`}
          style={item.objectPosition ? { objectPosition: item.objectPosition } : undefined}
          loading={index === 0 ? "eager" : "lazy"}
          decoding="async"
          draggable={false}
        />
        {item.type === "video" && (
          <span className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
            <span className="flex h-11 w-11 items-center justify-center rounded-[var(--radius)] bg-white/90 text-[#342d27] shadow-sm">
              <Play className="h-4 w-4 fill-current" aria-hidden />
            </span>
          </span>
        )}
        {showCount && (
          <span className="absolute bottom-3 right-3 z-30 inline-flex min-h-9 items-center gap-1.5 rounded-[var(--radius)] bg-[#342d27]/90 px-3 text-[12px] font-medium text-white backdrop-blur-sm">
            <Images className="h-4 w-4" strokeWidth={1.6} aria-hidden />
            {project.gallery.length} фото
          </span>
        )}
      </button>
    );
  };

  const renderSpecs = () => (
    <dl className="grid grid-cols-4 gap-x-2 sm:gap-x-6">
      {specItems.map(({ icon: Icon, value, label }) => (
        <div key={label} className="min-w-0 py-1">
          <Icon className="mb-2 h-[18px] w-[18px] text-primary" strokeWidth={1.7} aria-hidden />
          <dd className="text-[14px] font-semibold leading-tight text-[#342d27] sm:text-[16px] dark:text-foreground">{value}</dd>
          <dt className="mt-1 text-[11px] leading-tight text-[#717b8e] sm:text-[12px]">{label}</dt>
        </div>
      ))}
    </dl>
  );

  const renderMakerCard = () => (
    <button
      type="button"
      onClick={() => navigate(makerHref)}
      className="group flex min-h-12 w-full items-center gap-3 rounded-[var(--radius)] bg-[#f1f4ff] px-3 py-2.5 text-left transition-colors hover:bg-[#e9efff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 dark:bg-primary/10 dark:hover:bg-primary/15"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-[var(--radius)] bg-white text-[11px] font-bold shadow-[0_0_0_1px_rgba(59,70,96,0.08)] dark:bg-card">
        {project.maker.logo ? (
          <img src={project.maker.logo} alt="" className="h-full w-full object-cover" loading="lazy" />
        ) : (
          project.maker.initials
        )}
      </span>
      <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className="truncate text-[14px] font-semibold text-[#342d27] dark:text-foreground">{project.maker.name}</span>
          {verified && <VerifiedBadge />}
        </span>
        <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] leading-tight text-[#717b8e]">
          {reviewSummary.hasReviews && (
            <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap">
              <Star className="h-3.5 w-3.5 fill-primary text-primary" strokeWidth={1.5} aria-hidden />
              <span>{reviewSummary.rating.toFixed(1).replace(".", ",")} · {reviewSummary.reviewsLabel}</span>
            </span>
          )}
          <span className="shrink-0 whitespace-nowrap">
            {projectsCountByMakerId[makerId] ?? 0} проектов в каталоге
          </span>
        </span>
      </span>
      <ChevronRight className="h-5 w-5 shrink-0 text-[#717b8e] transition-[color,transform] duration-200 group-hover:translate-x-0.5 group-hover:text-primary motion-reduce:transform-none" strokeWidth={1.8} aria-hidden />
    </button>
  );

  return (
    <div className="min-h-screen bg-white text-[#342d27] dark:bg-background dark:text-foreground">
      <Seo
        title={seoTitle}
        description={seoDescription}
        canonicalPath={canonicalPath}
        type="product"
        image={firstImage}
        jsonLd={[productJsonLd, breadcrumbJsonLd]}
      />
      <Header variant="home" />

      <main className="pt-[50px] md:pt-0">
        <div className="sticky top-[50px] z-40 flex h-14 items-center gap-1 border-b border-[#e2e6ef] bg-white px-2 md:hidden dark:border-border dark:bg-background">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius)] text-[#342d27] transition-colors hover:bg-[#f3f4f7] active:bg-[#edf1fb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 dark:text-foreground dark:hover:bg-secondary"
            aria-label="Назад"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={1.6} aria-hidden />
          </button>
          <div
            className={`min-w-0 flex-1 px-1.5 transition-opacity duration-200 ${scrolled ? "opacity-100" : "opacity-0"}`}
            aria-hidden={!scrolled}
          >
            <p className="truncate text-[14px] font-semibold">{project.name}</p>
            <p className="text-[13px] text-primary">{priceLabel}</p>
          </div>
          <button
            type="button"
            onClick={handleShare}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius)] text-[#342d27] transition-colors hover:bg-[#f3f4f7] active:bg-[#edf1fb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 dark:text-foreground dark:hover:bg-secondary"
            aria-label="Поделиться"
          >
            <Forward className="h-5 w-5" strokeWidth={1.6} aria-hidden />
          </button>
          <button
            type="button"
            onClick={handleToggleFavorite}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius)] text-[#342d27] transition-colors hover:bg-[#f3f4f7] active:bg-[#edf1fb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 dark:text-foreground dark:hover:bg-secondary"
            aria-label={liked ? "Удалить из избранного" : "Добавить в избранное"}
          >
            <Heart className={`h-5 w-5 ${liked ? "fill-red-500 text-red-500" : ""}`} strokeWidth={1.6} aria-hidden />
          </button>
          <ProjectReportDialog
            projectId={project.id}
            projectName={project.name}
            manufacturerName={project.maker.name}
          >
            <button
              type="button"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius)] text-[#342d27] transition-colors hover:bg-[#f3f4f7] active:bg-[#edf1fb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 dark:text-foreground dark:hover:bg-secondary"
              aria-label="Пожаловаться на проект"
            >
              <CircleAlert className="h-5 w-5" strokeWidth={1.6} aria-hidden />
            </button>
          </ProjectReportDialog>
        </div>

        <div className={`${siteBreadcrumbPageContainerClassName} hidden md:block`}>
          <SiteBreadcrumbs
            items={[
              { label: "Главная", to: "/" },
              { label: isBathProject ? "Модульные бани" : "Проекты", to: isBathProject ? bathCatalogHref : CATALOG_PATH },
              { label: project.name },
            ]}
          />
        </div>

        <div className="mx-auto max-w-[1400px] px-0 md:px-9 lg:px-12">

          <section aria-label="Фотографии проекта" className="min-w-0">
            <div className="relative md:hidden">
              <div ref={galleryWrapRef} className="touch-pan-y overflow-hidden bg-secondary">
                <div
                  ref={sliderRef}
                  className="flex transition-transform duration-300 ease-out motion-reduce:transition-none"
                  style={{ transform: `translateX(calc(-${activeImage * 100}% + ${dragOffset}px))` }}
                >
                  {project.gallery.map((_, index) => (
                    <div key={index} className="w-full shrink-0">{renderGalleryImage(index, true)}</div>
                  ))}
                </div>
              </div>
              <span className="absolute bottom-3 right-3 z-30 rounded-[var(--radius)] bg-[#342d27]/75 px-2.5 py-1.5 text-[12px] font-medium text-white">
                {activeImage + 1} / {project.gallery.length}
              </span>
            </div>

            <div className={`hidden h-[clamp(440px,47vw,650px)] gap-1.5 md:grid ${mosaicIndexes.length > 1 ? "grid-cols-[minmax(0,1.75fr)_minmax(280px,0.9fr)]" : "grid-cols-1"}`}>
              {renderMosaicImage(mosaicIndexes[0], true)}
              {mosaicIndexes.length > 1 && (
                <div className="grid min-h-0 grid-cols-2 grid-rows-2 gap-1.5">
                  {mosaicIndexes.slice(1).map((index, previewIndex) => renderMosaicImage(index, false, previewIndex))}
                </div>
              )}
            </div>
          </section>

          <div className="grid items-start lg:mt-9 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_380px] xl:gap-16">
            <article className="min-w-0 px-4 py-7 md:px-0 md:py-8 lg:py-0">
              <div className="flex items-start gap-3">
                <h1 className="min-w-0 flex-1 text-[30px] font-semibold leading-[1.08] tracking-[-0.035em] text-[#342d27] md:text-[42px] dark:text-foreground">
                  {project.name}
                </h1>
                <div className="hidden items-center gap-1.5 md:flex">
                  <button
                    type="button"
                    onClick={handleShare}
                    className="flex h-11 w-11 items-center justify-center rounded-[var(--radius)] bg-[#f6f7fa] text-[#595653] transition-colors hover:bg-[#edf1fb] hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 dark:bg-secondary dark:text-muted-foreground"
                    aria-label="Поделиться"
                  >
                    <Forward className="h-5 w-5" strokeWidth={1.6} aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={handleToggleFavorite}
                    className="flex h-11 w-11 items-center justify-center rounded-[var(--radius)] bg-[#f6f7fa] text-[#595653] transition-colors hover:bg-[#edf1fb] hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 dark:bg-secondary dark:text-muted-foreground"
                    aria-label={liked ? "Удалить из избранного" : "Добавить в избранное"}
                  >
                    <Heart className={`h-5 w-5 ${liked ? "fill-red-500 text-red-500" : ""}`} strokeWidth={1.6} aria-hidden />
                  </button>
                  <ProjectReportDialog
                    projectId={project.id}
                    projectName={project.name}
                    manufacturerName={project.maker.name}
                  >
                    <button
                      type="button"
                      className="flex h-11 w-11 items-center justify-center gap-2 rounded-[var(--radius)] bg-[#f6f7fa] px-0 text-[13px] font-medium text-[#595653] transition-colors hover:bg-[#edf1fb] hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 xl:w-auto xl:px-3.5 dark:bg-secondary dark:text-muted-foreground"
                      aria-label="Пожаловаться на проект"
                    >
                      <CircleAlert className="h-5 w-5 shrink-0" strokeWidth={1.6} aria-hidden />
                      <span className="hidden xl:inline">Пожаловаться</span>
                    </button>
                  </ProjectReportDialog>
                </div>
              </div>

              <div className="mt-3 hidden md:block lg:hidden">
                <p className="text-[28px] font-semibold tracking-[-0.025em] text-[#342d27] md:text-[30px] dark:text-foreground">
                  {priceLabel}
                </p>
                {renderDeliveryMessage()}
                {renderProjectAction("mt-4 hidden h-12 w-full max-w-[420px] items-center justify-center gap-2 rounded-[var(--radius)] bg-primary px-5 text-[15px] font-semibold text-white transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 md:flex")}
              </div>

              <div className="mt-6 max-w-[560px] md:mt-7">{renderSpecs()}</div>

              <div className="mt-7 md:hidden">
                <p className="text-[12px] font-medium text-[#717b8e]">Стоимость проекта</p>
                <p className="mt-1 text-[28px] font-semibold tracking-[-0.025em] text-[#342d27] dark:text-foreground">
                  {priceLabel}
                </p>
                {renderDeliveryMessage()}
                {renderProjectAction("mt-4 flex min-h-12 w-full items-center justify-center rounded-[var(--radius)] bg-primary px-5 text-[15px] font-semibold text-white transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2")}
              </div>

              <div className="mt-5 max-w-[620px] border-t border-[#e2e6ef] pt-5 lg:hidden dark:border-border">{renderMakerCard()}</div>

              <section className="mt-10 max-w-[800px] md:mt-12" aria-labelledby="about-project-heading">
                <h2 id="about-project-heading" className="text-[26px] font-semibold tracking-[-0.025em] text-[#342d27] md:text-[30px] dark:text-foreground">
                  О проекте
                </h2>
                <MobileExpandableText
                  text={projectDescription}
                  contentId="project-description-content"
                  className="mt-5 max-w-[760px] text-[16px] leading-[1.72] text-[#595653] dark:text-muted-foreground"
                />

                {!isBathProject && <ProjectRooms beds={project.beds} baths={project.baths} kitchens={project.kitchens} />}

                <section className="mt-10" aria-labelledby="project-characteristics-heading">
                  <h3 id="project-characteristics-heading" className="text-[20px] font-semibold text-[#342d27] dark:text-foreground">Характеристики</h3>
                  <dl id="project-characteristics-content" className="mt-5 grid gap-x-10 gap-y-4 sm:grid-cols-2">
                    {detailRows.map(([label, value], index) => (
                      <div
                        key={label}
                        className={`min-w-0 grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-baseline gap-4 text-[14px] sm:text-[15px] ${detailsExpanded || index < 4 ? "grid" : "hidden md:grid"}`}
                      >
                        <dt className="text-[#717b8e]">{label}</dt>
                        <dd className="min-w-0 font-medium leading-snug text-[#342d27] dark:text-foreground">{value}</dd>
                      </div>
                    ))}
                  </dl>
                  {detailRows.length > 4 && (
                    <button
                      type="button"
                      onClick={() => setDetailsExpanded((current) => !current)}
                      className="mt-2 inline-flex min-h-11 items-center gap-1 text-[15px] font-medium text-[#342d27] transition-colors duration-200 hover:text-primary focus-visible:rounded-[var(--radius)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 md:hidden dark:text-foreground"
                      aria-expanded={detailsExpanded}
                      aria-controls="project-characteristics-content"
                    >
                      {detailsExpanded ? "Свернуть" : "Все характеристики"}
                      <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${detailsExpanded ? "rotate-180" : ""}`} strokeWidth={1.8} aria-hidden />
                    </button>
                  )}
                </section>
              </section>
            </article>

            <aside className="hidden lg:block" aria-label="Стоимость и связь с производителем">
              <p className="text-[12px] font-medium text-[#717b8e]">Стоимость проекта</p>
              <p className="mt-1 text-[30px] font-semibold tracking-[-0.025em] text-[#342d27] dark:text-foreground">
                {priceLabel}
              </p>
              {renderDeliveryMessage()}
              {renderProjectAction("mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-[var(--radius)] bg-primary px-5 text-center text-[15px] font-semibold text-white transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2")}
              <div className="mt-5 border-t border-[#e2e6ef] pt-5 dark:border-border">{renderMakerCard()}</div>
            </aside>
          </div>

          <section className="mx-4 py-12 md:mx-0 md:py-16" aria-labelledby="other-projects-heading">
            <div className="mb-8">
              <h2 id="other-projects-heading" className="text-[26px] font-semibold tracking-[-0.025em] md:text-[32px]">
                <button
                  type="button"
                  onClick={() => navigate(isBathProject ? bathCatalogHref : deliveryRegionHref)}
                  className="group inline-flex min-h-11 items-center gap-2 text-left text-[#342d27] transition-colors hover:text-primary focus-visible:rounded-[var(--radius)] focus-visible:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 dark:text-foreground"
                >
                  <span>
                  {isBathProject
                    ? "Все модульные бани"
                    : allRegionsSelected
                      ? "Все проекты"
                      : `Все проекты ${deliveryRegionPrepositional}`}
                  </span>
                  <ChevronRight className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none md:h-6 md:w-6" strokeWidth={1.8} aria-hidden />
                </button>
              </h2>
            </div>
            <OtherProjectsFeed
              currentId={String(project.id)}
              deliveryRegion={deliveryRegionSlug}
              productType={isBathProject ? "bath" : "house"}
            />
          </section>
        </div>
      </main>

      <Footer />

      <CitySelector
        open={deliveryCityOpen}
        onOpenChange={setDeliveryCityOpen}
        city={deliveryRegionSlug}
        onSelect={selectDeliveryRegion}
        title={isBathProject ? "Куда доставить баню?" : "Куда доставить дом?"}
        availableRegions={projectDeliveryRegions}
      />

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/95 p-3 md:p-10"
          role="dialog"
          aria-modal="true"
          aria-label="Просмотр изображений"
          onClick={() => setLightboxOpen(false)}
          onTouchStart={(event) => { lightboxStartX.current = event.touches[0].clientX; }}
          onTouchEnd={(event) => {
            if (lightboxStartX.current === null) return;
            const dx = event.changedTouches[0].clientX - lightboxStartX.current;
            if (Math.abs(dx) > 50) {
              if (dx < 0) setActiveImage((current) => Math.min(project.gallery.length - 1, current + 1));
              if (dx > 0) setActiveImage((current) => Math.max(0, current - 1));
            }
            lightboxStartX.current = null;
          }}
        >
          <button
            type="button"
            onClick={(event) => { event.stopPropagation(); setLightboxOpen(false); }}
            className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-[var(--radius)] bg-white/10 text-white transition-colors hover:bg-white/20"
            aria-label="Закрыть"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
          <span className="absolute left-4 top-4 z-20 rounded-[var(--radius)] bg-white/10 px-3 py-2 text-[12px] font-medium text-white">
            {activeImage + 1} / {project.gallery.length}
          </span>
          <img
            src={project.gallery[activeImage].image}
            alt={`${project.name}, изображение ${activeImage + 1}`}
            className="max-h-full max-w-full select-none object-contain"
            onClick={(event) => event.stopPropagation()}
            draggable={false}
          />
          {!isMobile && (
            <>
              <button
                type="button"
                onClick={(event) => { event.stopPropagation(); setActiveImage((current) => Math.max(0, current - 1)); }}
                disabled={activeImage === 0}
                className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-[var(--radius)] bg-white/10 text-white transition-colors hover:bg-white/20 disabled:pointer-events-none disabled:opacity-25"
                aria-label="Предыдущее изображение"
              >
                <ChevronLeft className="h-6 w-6" aria-hidden />
              </button>
              <button
                type="button"
                onClick={(event) => { event.stopPropagation(); setActiveImage((current) => Math.min(project.gallery.length - 1, current + 1)); }}
                disabled={activeImage === project.gallery.length - 1}
                className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-[var(--radius)] bg-white/10 text-white transition-colors hover:bg-white/20 disabled:pointer-events-none disabled:opacity-25"
                aria-label="Следующее изображение"
              >
                <ChevronRight className="h-6 w-6" aria-hidden />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
