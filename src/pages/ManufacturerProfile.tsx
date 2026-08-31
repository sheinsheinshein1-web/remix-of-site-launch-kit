import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { ChevronRight, Flag, Forward, Globe, Heart, Mail, Phone, Send, Star } from "lucide-react";
import { toast } from "sonner";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ManufacturerName from "@/components/ManufacturerName";
import ManufacturerReportDialog from "@/components/ManufacturerReportDialog";
import ProjectCard from "@/components/ProjectCard";
import Seo from "@/components/Seo";
import SiteBreadcrumbs, { siteBreadcrumbPageContainerClassName } from "@/components/SiteBreadcrumbs";
import VerifiedBadge from "@/components/VerifiedBadge";
import NotFound from "@/pages/NotFound";
import { useFavorites } from "@/contexts/FavoritesContext";
import { makersById, projects, projectsCountByMakerId } from "@/data/projects";
import { getManufacturerRatingSummary } from "@/data/manufacturerRatings";
import { getPartnerReviews, getPartnerReviewSummary } from "@/data/partnerReviews";
import { compareProjectTechnologyPriority } from "@/lib/projectPriority";
import { getCityDisplayName, getCityPrepositionalName, isSameCityRegion } from "@/lib/cityDisplay";
import { getManufacturerMapUrls } from "@/lib/manufacturerMap";
import { buildCanonicalUrl } from "@/lib/seo";
import { getTelegramLabel, getTelegramUrl } from "@/lib/telegram";
import { isVerifiedMaker } from "@/lib/verifiedMakers";
import {
  MANUFACTURERS_PATH,
  getManufacturerPath,
  getManufacturerReviewsPath,
} from "@/lib/siteRoutes";

const LEGACY_PARTNER_IDS: Record<string, string> = { "1": "platforma" };
const MAP_COORDINATES_BY_MAKER_ID: Record<string, { lat: number; lon: number }> = {
  bygge: { lat: 56.7923281, lon: 60.7321339 },
  elmaco: { lat: 59.995471, lon: 30.249177 },
  modom: { lat: 60.11911, lon: 30.349878 },
  platforma: { lat: 56.891559, lon: 60.777237 },
};

const ABOUT_BY_MAKER_ID: Record<string, string> = {
  platforma:
    "Производитель модульных домов из Екатеринбурга. Компания проектирует и собирает компактные одноэтажные дома для круглогодичного проживания и загородного отдыха.",
  bygge:
    "Bygge — производитель модульных домов из Екатеринбурга. В каталоге представлены дома полной заводской готовности под ключ: с инженерными системами, оборудованным санузлом и решениями для круглогодичного проживания.",
  elmaco:
    "Elmaco Homes — производитель модульных домов из Санкт-Петербурга. В каталоге представлены серии Ivor, Lukas, Jung, Tor и Oscar: от компактных загородных домов до просторных семейных решений.",
  modom:
    "Modom — производитель модульных домов из Санкт-Петербурга и Ленинградской области. Компания выпускает готовые модульные решения UNO и серию О2 для дачи и круглогодичного проживания.",
};

const wordForm = (count: number, forms: [string, string, string]) => {
  const lastTwo = Math.abs(count) % 100;
  const lastOne = lastTwo % 10;
  if (lastTwo > 10 && lastTwo < 20) return forms[2];
  if (lastOne === 1) return forms[0];
  if (lastOne >= 2 && lastOne <= 4) return forms[1];
  return forms[2];
};

const usesDarkLogoBackground = (makerId: string) => makerId === "blackmodule";

const parseArea = (value: string, numericValue?: number) => {
  if (numericValue) return numericValue;
  return Number.parseFloat(value.replace(",", ".").replace(/[^\d.]/g, "")) || 0;
};

const parsePrice = (value: string) => Number.parseInt(value.replace(/\D/g, ""), 10) || 0;

const uniqueValues = (values: Array<string | undefined>, limit = 4) =>
  [...new Set(values.map((value) => value?.trim()).filter(Boolean) as string[])].slice(0, limit);

const getReviewExcerpt = (body: string, maxLength = 190) => {
  if (body.length <= maxLength) return body;
  const candidate = body.slice(0, maxLength + 1);
  const sentenceEnd = Math.max(candidate.lastIndexOf(". "), candidate.lastIndexOf("! "), candidate.lastIndexOf("? "));
  if (sentenceEnd >= Math.round(maxLength * 0.55)) return `${candidate.slice(0, sentenceEnd + 1).trim()}…`;
  const wordEnd = candidate.lastIndexOf(" ");
  return `${candidate.slice(0, wordEnd > 0 ? wordEnd : maxLength).trim()}…`;
};

const ManufacturerProfile = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [platformaProjectType, setPlatformaProjectType] = useState<"houses" | "baths" | "business">("houses");
  const makerId = id ? LEGACY_PARTNER_IDS[id] ?? id : "platforma";
  const maker = makersById[makerId];
  const canonicalPath = getManufacturerPath(makerId);
  const { isMakerFavorite, toggleMakerFavorite } = useFavorites();
  const makerIsFavorite = isMakerFavorite(makerId);

  const makerProjects = useMemo(
    () => projects.filter((project) => project.maker.id === makerId).sort(compareProjectTechnologyPriority),
    [makerId],
  );
  const platformaBathProjects = makerProjects.filter((project) =>
    project.productType === "bath" || project.productType === "house-bath",
  );
  const platformaHouseProjects = makerProjects.filter((project) => project.productType !== "bath");
  // Платформа предлагает те же модели с адаптацией под коммерческий сценарий;
  // отдельные карточки B2B-объектов появятся только вместе с отдельными исходными данными.
  const platformaBusinessProjects = platformaHouseProjects;
  const visibleMakerProjects = makerId === "platforma"
    ? platformaProjectType === "baths"
      ? platformaBathProjects
      : platformaProjectType === "business"
        ? platformaBusinessProjects
        : platformaHouseProjects
    : makerProjects;

  useEffect(() => {
    if (!maker || location.pathname === canonicalPath) return;
    navigate(`${canonicalPath}${location.search}${location.hash}`, { replace: true });
  }, [canonicalPath, location.hash, location.pathname, location.search, maker, navigate]);

  if (!maker || makerProjects.length === 0) return <NotFound />;

  const reviewSummary = getPartnerReviewSummary(makerId);
  const reviewPreviews = getPartnerReviews(makerId).slice(0, 4);
  const cityLabel = getCityDisplayName(maker.city);
  const cityPrepositionalName = getCityPrepositionalName(maker.city);
  const verified = isVerifiedMaker(makerId);
  const technologies = uniqueValues(makerProjects.map((project) => project.technology));
  const areas = makerProjects
    .map((project) => parseArea(project.area, project.area_m2))
    .filter((value) => value > 0);
  const minArea = areas.length > 0 ? Math.min(...areas) : 0;
  const maxArea = areas.length > 0 ? Math.max(...areas) : 0;
  const areaRange = areas.length === 0
    ? "По запросу"
    : minArea === maxArea
      ? `${minArea.toLocaleString("ru-RU")} м²`
      : `${minArea.toLocaleString("ru-RU")}–${maxArea.toLocaleString("ru-RU")} м²`;
  const prices = makerProjects.map((project) => parsePrice(project.price)).filter((value) => value > 0);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const minPriceLabel = minPrice > 0 ? `${minPrice.toLocaleString("ru-RU")} ₽` : "По запросу";
  const telegramUrl = getTelegramUrl(maker.telegram);
  const telegramLabel = getTelegramLabel(maker.telegram);
  const siteLabel = maker.siteUrl?.replace(/^https?:\/\/(?:www\.)?/i, "").replace(/\/$/, "");
  const mapCoordinates = MAP_COORDINATES_BY_MAKER_ID[makerId];
  const { embedUrl: mapEmbedUrl, externalUrl: yandexMapLink } = getManufacturerMapUrls({
    address: maker.productionAddress,
    city: cityLabel,
    coordinates: mapCoordinates,
  });
  const about = ABOUT_BY_MAKER_ID[makerId]
    ?? `${maker.name} — производитель домов из ${cityLabel}. На странице собраны проекты компании, доступные в каталоге многоместа.рф.`;
  const heroImage = makerProjects[0]?.gallery[0]?.image;

  const otherRegionMakers = Object.values(makersById)
    .filter((candidate) => candidate.id !== makerId && isSameCityRegion(candidate.city, maker.city))
    .map((candidate) => ({
      ...candidate,
      projectCount: projectsCountByMakerId[candidate.id] ?? 0,
      reviewSummary: getManufacturerRatingSummary(candidate.id),
    }))
    .filter((candidate) => candidate.projectCount > 0)
    .sort((a, b) => {
      if (a.reviewSummary.hasReviews !== b.reviewSummary.hasReviews) {
        return Number(b.reviewSummary.hasReviews) - Number(a.reviewSummary.hasReviews);
      }
      if (a.reviewSummary.rating !== b.reviewSummary.rating) {
        return b.reviewSummary.rating - a.reviewSummary.rating;
      }
      if (a.reviewSummary.totalCount !== b.reviewSummary.totalCount) {
        return b.reviewSummary.totalCount - a.reviewSummary.totalCount;
      }
      return b.projectCount - a.projectCount || a.name.localeCompare(b.name, "ru");
    });
  const otherRegionProjects = projects
    .filter((project) => project.maker.id !== makerId && isSameCityRegion(project.city, maker.city))
    .sort((a, b) => compareProjectTechnologyPriority(a, b) || b.likes - a.likes);
  const otherRegionMakersPreview = otherRegionMakers.slice(0, 8);
  const regionManufacturersHref = `${MANUFACTURERS_PATH}?region=${encodeURIComponent(cityLabel)}`;

  const handleShare = async () => {
    const shareData = { title: `${maker.name} — Много места`, url: window.location.href };
    if (navigator.share) {
      await navigator.share(shareData).catch(() => undefined);
      return;
    }

    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Ссылка скопирована");
    } catch {
      toast.error("Не удалось скопировать ссылку");
    }
  };

  const handleToggleMakerFavorite = () => toggleMakerFavorite(makerId);

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: maker.name,
    url: maker.siteUrl,
    address: maker.productionAddress,
    areaServed: cityLabel,
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: buildCanonicalUrl("/") },
      { "@type": "ListItem", position: 2, name: "Производители", item: buildCanonicalUrl(MANUFACTURERS_PATH) },
      { "@type": "ListItem", position: 3, name: maker.name, item: buildCanonicalUrl(canonicalPath) },
    ],
  };

  return (
    <div className="min-h-screen bg-secondary font-sans">
      <Seo
        title={`${maker.name} — проекты и контакты производителя | многоместа.рф`}
        description={`${maker.name}: ${makerProjects.length} ${wordForm(makerProjects.length, ["проект", "проекта", "проектов"])} домов, характеристики, цены и контакты производителя${reviewSummary.hasReviews ? ", отзывы клиентов" : ""}.`}
        canonicalPath={canonicalPath}
        image={heroImage}
        jsonLd={[organizationJsonLd, breadcrumbJsonLd]}
      />

      <main className="bg-white dark:bg-background">
        <Header variant="home" />
        <div className={`${siteBreadcrumbPageContainerClassName} pb-16 sm:pb-20`}>
          <SiteBreadcrumbs
            items={[
              { label: "Главная", to: "/" },
              { label: "Производители", to: MANUFACTURERS_PATH },
              { label: maker.name },
            ]}
          />

          <div className="grid items-start gap-10 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-14 xl:grid-cols-[330px_minmax(0,1fr)] xl:gap-20">
            <aside className="self-start lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:overscroll-contain lg:pr-2 lg:[scrollbar-width:none] lg:[&::-webkit-scrollbar]:hidden" aria-label={`Профиль компании ${maker.name}`}>
              <div className="flex items-start gap-4 lg:block">
                <div className={`flex h-[76px] w-[76px] shrink-0 items-center justify-center overflow-hidden rounded-[var(--radius)] border border-[#dfe5f5] text-[16px] font-semibold text-[#342d27] lg:h-24 lg:w-24 ${usesDarkLogoBackground(makerId) ? "bg-[#342d27]" : "bg-white"}`}>
                  {maker.logo ? (
                    <img src={maker.logo} alt="" className="h-full w-full object-contain p-2.5" loading="eager" decoding="async" />
                  ) : (
                    maker.initials
                  )}
                </div>

                <div className="min-w-0 flex-1 lg:mt-6">
                  <div className="flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-2">
                    <h1 className="min-w-0 text-[30px] font-semibold leading-none tracking-[-0.035em] text-[#342d27] lg:text-[40px] dark:text-foreground">
                      {maker.name}
                    </h1>
                    {verified && <VerifiedBadge />}
                  </div>
                  <p className="mt-2 text-[14px] text-[#717b8e]">{technologies.join(" · ")} · {cityLabel}</p>
                </div>
              </div>

              {maker.siteUrl && (
                <a
                  href={maker.siteUrl}
                  target="_blank"
                  rel="noopener noreferrer nofollow sponsored"
                  className="mt-6 flex min-h-12 w-full items-center justify-center rounded-[var(--radius)] bg-primary px-5 text-center text-[15px] font-semibold text-white transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  Перейти на сайт
                </a>
              )}

              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={handleShare}
                  className="group flex min-h-11 min-w-0 flex-1 items-center justify-center gap-2 rounded-[var(--radius)] border border-[#dfe5f5] bg-white px-3 text-[14px] font-medium text-[#342d27] transition-colors hover:border-primary/25 hover:bg-secondary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 dark:border-border dark:bg-background dark:text-foreground dark:hover:bg-secondary dark:hover:text-primary"
                >
                  <Forward className="h-4 w-4 shrink-0 text-[#717b8e] transition-colors group-hover:text-primary group-focus-visible:text-primary" strokeWidth={1.7} aria-hidden />
                  Поделиться
                </button>
                <button
                  type="button"
                  onClick={handleToggleMakerFavorite}
                  className="group flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius)] border border-[#dfe5f5] bg-white text-[#342d27] transition-colors hover:border-primary/25 hover:bg-secondary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 dark:border-border dark:bg-background dark:text-foreground dark:hover:bg-secondary dark:hover:text-primary"
                  aria-pressed={makerIsFavorite}
                  aria-label={makerIsFavorite ? "Удалить производителя из избранного" : "Добавить производителя в избранное"}
                >
                  <Heart className={`h-5 w-5 shrink-0 transition-colors ${makerIsFavorite ? "fill-red-500 text-red-500" : "text-[#717b8e] group-hover:text-primary group-focus-visible:text-primary"}`} strokeWidth={1.7} aria-hidden />
                </button>
              </div>

              <div className="mt-5 space-y-1 text-[14px] text-[#595653] dark:text-muted-foreground">
                {maker.phone && (
                  <a href={`tel:${maker.phone.replace(/[^+\d]/g, "")}`} className="group flex min-h-11 w-full items-center gap-3 rounded-[var(--radius)] px-3 transition-colors hover:bg-secondary hover:text-primary focus-visible:bg-secondary focus-visible:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30">
                    <Phone className="h-4 w-4 shrink-0 text-[#717b8e] transition-colors group-hover:text-primary group-focus-visible:text-primary" strokeWidth={1.7} aria-hidden />
                    {maker.phone}
                  </a>
                )}
                {maker.additionalPhones?.map((phone) => (
                  <a key={phone} href={`tel:${phone.replace(/[^+\d]/g, "")}`} className="group flex min-h-11 w-full items-center gap-3 rounded-[var(--radius)] px-3 transition-colors hover:bg-secondary hover:text-primary focus-visible:bg-secondary focus-visible:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30">
                    <Phone className="h-4 w-4 shrink-0 text-[#717b8e] transition-colors group-hover:text-primary group-focus-visible:text-primary" strokeWidth={1.7} aria-hidden />
                    {phone}
                  </a>
                ))}
                {maker.email && (
                  <a href={`mailto:${maker.email}`} className="group flex min-h-11 w-full min-w-0 items-center gap-3 rounded-[var(--radius)] px-3 transition-colors hover:bg-secondary hover:text-primary focus-visible:bg-secondary focus-visible:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30">
                    <Mail className="h-4 w-4 shrink-0 text-[#717b8e] transition-colors group-hover:text-primary group-focus-visible:text-primary" strokeWidth={1.7} aria-hidden />
                    <span className="min-w-0 truncate">{maker.email}</span>
                  </a>
                )}
                {telegramUrl && telegramLabel && (
                  <a href={telegramUrl} target="_blank" rel="noopener noreferrer nofollow" className="group flex min-h-11 w-full items-center gap-3 rounded-[var(--radius)] px-3 transition-colors hover:bg-secondary hover:text-primary focus-visible:bg-secondary focus-visible:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30">
                    <Send className="h-4 w-4 shrink-0 text-[#717b8e] transition-colors group-hover:text-primary group-focus-visible:text-primary" strokeWidth={1.7} aria-hidden />
                    {telegramLabel}
                  </a>
                )}
                {maker.siteUrl && siteLabel && (
                  <a href={maker.siteUrl} target="_blank" rel="noopener noreferrer nofollow" className="group flex min-h-11 w-full min-w-0 items-center gap-3 rounded-[var(--radius)] px-3 transition-colors hover:bg-secondary hover:text-primary focus-visible:bg-secondary focus-visible:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30">
                    <Globe className="h-4 w-4 shrink-0 text-[#717b8e] transition-colors group-hover:text-primary group-focus-visible:text-primary" strokeWidth={1.7} aria-hidden />
                    <span className="min-w-0 truncate">{siteLabel}</span>
                  </a>
                )}
                <ManufacturerReportDialog manufacturerName={maker.name}>
                  <button
                    type="button"
                    className="group flex min-h-11 w-full items-center gap-3 rounded-[var(--radius)] px-3 text-left text-[14px] text-[#717b8e] transition-colors hover:bg-secondary hover:text-primary focus-visible:bg-secondary focus-visible:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                  >
                    <Flag className="h-4 w-4 shrink-0 transition-colors group-hover:text-primary group-focus-visible:text-primary" strokeWidth={1.7} aria-hidden />
                    Пожаловаться
                  </button>
                </ManufacturerReportDialog>
              </div>

            </aside>

            <div className="min-w-0">
              <section id="about" className="scroll-mt-28" aria-labelledby="manufacturer-about-heading">
                <h2 id="manufacturer-about-heading" className="text-[28px] font-semibold tracking-[-0.03em] text-[#342d27] md:text-[36px] dark:text-foreground">
                  О компании «{maker.name}»
                </h2>
                <div className="mt-5 max-w-[850px] space-y-4 text-[16px] leading-[1.72] text-[#595653] md:text-[17px] dark:text-muted-foreground">
                  <p>{about}</p>
                </div>

                <dl className="mt-8 grid max-w-[850px] grid-cols-2 gap-x-8 gap-y-7 sm:gap-x-14 md:mt-10">
                  <div>
                    <dt className="text-[13px] text-[#717b8e]">Технология</dt>
                    <dd className="mt-2 text-[17px] font-semibold text-[#342d27] md:text-[18px] dark:text-foreground">{technologies.join(", ")}</dd>
                  </div>
                  <div>
                    <dt className="text-[13px] text-[#717b8e]">Срок</dt>
                    <dd className="mt-2 text-[17px] font-semibold text-[#342d27] md:text-[18px] dark:text-foreground">До 60 дней</dd>
                  </div>
                  <div>
                    <dt className="text-[13px] text-[#717b8e]">Площади</dt>
                    <dd className="mt-2 text-[17px] font-semibold text-[#342d27] md:text-[18px] dark:text-foreground">{areaRange}</dd>
                  </div>
                  <div>
                    <dt className="text-[13px] text-[#717b8e]">Цены от</dt>
                    <dd className="mt-2 text-[17px] font-semibold text-[#342d27] md:text-[18px] dark:text-foreground">{minPriceLabel}</dd>
                  </div>
                </dl>

              </section>

              <section
                id="projects"
                className="mt-16 scroll-mt-28 md:mt-24"
                aria-labelledby={makerId === "platforma" ? `manufacturer-projects-${platformaProjectType}-tab` : "manufacturer-projects-heading"}
              >
                <div className="mb-7 flex items-end justify-between gap-4">
                  {makerId === "platforma" ? (
                    <div
                      className="flex min-w-0 max-w-full touch-pan-x items-baseline gap-4 overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:gap-5 md:overflow-visible md:overscroll-auto"
                      role="tablist"
                      aria-label="Тип проектов Платформы"
                    >
                      {([
                        ["houses", "Дома", platformaHouseProjects.length],
                        ["baths", "Бани", platformaBathProjects.length],
                        ["business", "Для бизнеса", platformaBusinessProjects.length],
                      ] as const).map(([type, label, count]) => {
                        const isActive = platformaProjectType === type;
                        return (
                          <button
                            key={type}
                            id={`manufacturer-projects-${type}-tab`}
                            type="button"
                            role="tab"
                            aria-selected={isActive}
                            aria-controls="manufacturer-projects-panel"
                            onClick={() => setPlatformaProjectType(type)}
                            className={`group flex min-h-11 shrink-0 items-center gap-2 text-[25px] font-semibold leading-none tracking-[-0.03em] transition-colors hover:text-primary focus-visible:text-primary dark:hover:text-primary dark:focus-visible:text-primary sm:text-[28px] md:gap-3 md:text-[36px] ${
                              isActive
                                ? "text-[#342d27] dark:text-foreground"
                                : "text-[#9a9691] dark:text-foreground/45"
                            } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-4`}
                          >
                            <span>{label}</span>
                            <span
                              className={`tabular-nums transition-colors group-hover:text-primary group-focus-visible:text-primary ${isActive ? "text-[#746f6a] dark:text-foreground/65" : "text-current"}`}
                              aria-label={`Количество: ${count}`}
                            >
                              {count.toLocaleString("ru-RU")}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex min-w-0 items-baseline gap-3">
                      <h2 id="manufacturer-projects-heading" className="text-[28px] font-semibold tracking-[-0.03em] text-[#342d27] md:text-[36px] dark:text-foreground">Проекты производителя</h2>
                      <span
                        className="shrink-0 text-[28px] font-semibold leading-none tabular-nums tracking-[-0.03em] text-[#746f6a] md:text-[36px] dark:text-foreground/65"
                        aria-label={`Количество проектов: ${makerProjects.length}`}
                      >
                        {makerProjects.length.toLocaleString("ru-RU")}
                      </span>
                    </div>
                  )}
                </div>

                <div
                  id="manufacturer-projects-panel"
                  role={makerId === "platforma" ? "tabpanel" : undefined}
                  aria-labelledby={makerId === "platforma" ? `manufacturer-projects-${platformaProjectType}-tab` : undefined}
                  className="grid grid-cols-2 gap-x-[2px] gap-y-6 md:gap-x-4 md:gap-y-8"
                >
                  {visibleMakerProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      projectId={project.id}
                      height="aspect-[4/3] h-auto md:aspect-[5/4]"
                    />
                  ))}
                </div>
              </section>

              {mapEmbedUrl && <section id="production" className="mt-16 scroll-mt-28 md:mt-24" aria-labelledby="manufacturer-production-heading">
                <div>
                  <h2 id="manufacturer-production-heading" className="text-[28px] font-semibold tracking-[-0.03em] text-[#342d27] md:text-[36px] dark:text-foreground">Производство на карте</h2>
                  {maker.productionAddress && (
                    <a href={yandexMapLink} target="_blank" rel="noopener noreferrer nofollow" className="mt-3 inline-flex min-h-11 items-center text-[14px] leading-relaxed text-[#595653] transition-colors hover:text-primary focus-visible:rounded-[var(--radius)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 md:text-[15px] dark:text-muted-foreground">
                      <span>{maker.productionAddress}</span>
                    </a>
                  )}
                </div>

                <div className="relative mt-7 min-h-[320px] overflow-hidden rounded-[var(--radius)] md:min-h-[440px]">
                  <iframe
                    src={mapEmbedUrl}
                    title={`Производство компании ${maker.name} на карте`}
                    className="absolute inset-0 h-full w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </section>}

              <section id="reviews" className="mt-16 scroll-mt-28 md:mt-24" aria-labelledby="manufacturer-reviews-heading">
                <div className={`grid gap-6 ${reviewSummary.hasReviews ? "md:grid-cols-[minmax(0,1fr)_auto] md:items-center" : ""}`}>
                  <div>
                    <h2 id="manufacturer-reviews-heading" className="text-[28px] font-semibold tracking-[-0.03em] text-[#342d27] md:text-[36px] dark:text-foreground">Отзывы о {maker.name}</h2>
                  </div>
                  {reviewSummary.hasReviews && (
                    <div className="min-w-0 md:min-w-[330px]" aria-label={`Средняя оценка производителя ${reviewSummary.rating.toFixed(1)} из 5, ${reviewSummary.reviewsLabel}`}>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 md:justify-end">
                        <div className="text-[38px] font-semibold leading-none tabular-nums text-[#342d27] md:text-[42px] dark:text-foreground">
                          {reviewSummary.rating.toFixed(1).replace(".", ",")}
                        </div>
                        <div className="flex items-center gap-1" aria-hidden>
                          {Array.from({ length: 5 }, (_, index) => (
                            <Star key={index} className={`h-[19px] w-[19px] ${index < Math.round(reviewSummary.rating) ? "fill-primary text-primary" : "text-[#c5cbd8]"}`} strokeWidth={1.4} />
                          ))}
                        </div>
                        <p className="text-[14px] text-[#717b8e]">{reviewSummary.reviewsLabel}</p>
                      </div>
                    </div>
                  )}
                </div>

                {reviewSummary.hasReviews ? (
                  <>
                    <div className="mt-12 grid gap-x-12 gap-y-12 sm:grid-cols-2">
                      {reviewPreviews.map((review) => (
                        <article key={`${review.name}-${review.when}`} className="flex flex-col sm:min-h-[230px]">
                          <div className="flex items-center gap-1" aria-label={`${review.stars} из 5`}>
                            {Array.from({ length: 5 }, (_, index) => (
                              <Star key={index} className={`h-3.5 w-3.5 ${index < review.stars ? "fill-primary text-primary" : "text-[#c5cbd8]"}`} strokeWidth={1.4} aria-hidden />
                            ))}
                          </div>
                          <h3 className="mt-4 text-[17px] font-semibold leading-snug text-[#342d27] dark:text-foreground">{review.title}</h3>
                          <p className="mt-3 text-[14px] leading-relaxed text-[#595653] dark:text-muted-foreground">
                            {getReviewExcerpt(review.body)}
                            {review.body.length > 190 && (
                              <Link to={getManufacturerReviewsPath(makerId)} className="ml-1 whitespace-nowrap font-medium text-primary hover:underline focus-visible:rounded-[var(--radius)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30">
                                Читать
                              </Link>
                            )}
                          </p>
                          <p className="mt-5 text-[12px] text-[#717b8e] sm:mt-auto sm:pt-5">{review.name} · {review.when}</p>
                        </article>
                      ))}
                    </div>
                    <Link to={getManufacturerReviewsPath(makerId)} className="mt-10 inline-flex min-h-11 items-center gap-1 text-[15px] font-medium text-[#342d27] transition-colors hover:text-primary focus-visible:rounded-[var(--radius)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 dark:text-foreground">
                      Все {reviewSummary.reviewsLabel} <ChevronRight className="h-4 w-4" strokeWidth={1.8} aria-hidden />
                    </Link>
                  </>
                ) : (
                  <div className="mt-7 flex min-h-[220px] flex-col items-center justify-center rounded-[var(--radius)] bg-secondary px-5 py-8 text-center">
                    <Star className="h-9 w-9 text-[#aab2c2]" strokeWidth={1.5} aria-hidden />
                    <h3 className="mt-5 text-[21px] font-semibold text-[#342d27] dark:text-foreground">Отзывов пока нет</h3>
                    <p className="mt-2 max-w-[470px] text-[14px] leading-relaxed text-[#717b8e]">Станьте первым, кто поделится опытом работы с компанией. Отзыв появится после проверки.</p>
                    <Link to="/messages/support" className="mt-5 inline-flex min-h-11 items-center justify-center rounded-[var(--radius)] bg-primary px-5 text-[14px] font-medium text-white transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                      Оставить отзыв
                    </Link>
                  </div>
                )}
              </section>

              <div className="mt-16 text-[14px] text-[#717b8e] md:mt-24">
                <div className="flex flex-wrap items-center gap-x-2">
                  <span>Представитель этой компании?</span>
                  <Link to="/messages/support" className="inline-flex min-h-11 items-center font-medium text-[#342d27] transition-colors hover:text-primary focus-visible:rounded-[var(--radius)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 dark:text-foreground">
                    Подтвердить профиль
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="min-w-0">
            {otherRegionProjects.length > 0 && (
              <section className="mt-12 md:mt-16" aria-labelledby="related-region-projects-heading">
                <h2 id="related-region-projects-heading" className="text-[28px] font-semibold tracking-[-0.03em] text-[#342d27] md:text-[36px] dark:text-foreground">
                  Другие проекты {cityPrepositionalName}
                </h2>
                <div className="mt-7 grid grid-cols-2 gap-x-[2px] gap-y-7 md:gap-x-4 md:gap-y-9 lg:grid-cols-3">
                  {otherRegionProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      projectId={project.id}
                      height="aspect-[4/3] h-auto md:aspect-[5/4]"
                    />
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="min-w-0">
            {otherRegionMakers.length > 0 && (
              <section className="mt-16 md:mt-24" aria-labelledby="related-manufacturers-heading">
                <h2 id="related-manufacturers-heading" className="min-w-0 text-[28px] font-semibold tracking-[-0.03em] md:text-[36px]">
                  <Link
                    to={regionManufacturersHref}
                    className="group inline-flex min-h-11 items-center gap-2 text-[#342d27] transition-colors hover:text-primary focus-visible:rounded-[var(--radius)] focus-visible:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 dark:text-foreground"
                  >
                    <span>Все производители {cityPrepositionalName}</span>
                    <ChevronRight className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none md:h-6 md:w-6" strokeWidth={1.8} aria-hidden />
                  </Link>
                </h2>
                <div className="mt-6 grid sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-3 lg:gap-x-10">
                    {otherRegionMakersPreview.map((candidate) => (
                      <Link
                        key={candidate.id}
                        to={getManufacturerPath(candidate.id)}
                        aria-label={`${candidate.name}: ${candidate.reviewSummary.rating.toFixed(1)} из 5, ${candidate.reviewSummary.hasReviews ? candidate.reviewSummary.reviewsLabel : "отзывов пока нет"}`}
                        className="group -mx-3 flex min-h-[76px] items-center gap-3 rounded-[var(--radius)] px-3 py-3 transition-colors duration-200 hover:bg-secondary focus-visible:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 md:min-h-[80px]"
                      >
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-[var(--radius)] border border-border bg-white text-[10px] font-semibold uppercase tracking-[0.08em] text-[#342d27]">
                          {candidate.logo ? (
                            <img src={candidate.logo} alt="" width={40} height={40} className="h-full w-full object-contain p-1.5" loading="lazy" decoding="async" />
                          ) : (
                            candidate.initials
                          )}
                        </span>
                        <span className="min-w-0 flex-1">
                          <ManufacturerName
                            makerId={candidate.id}
                            name={candidate.name}
                            className="w-full"
                            nameClassName="text-[15px] font-medium leading-tight text-[#342d27] transition-colors group-hover:text-primary md:text-[16px] dark:text-foreground"
                          />
                          <span className="mt-1 block text-[13px] text-muted-foreground md:text-[14px]">
                            {getCityDisplayName(candidate.city)}
                          </span>
                        </span>
                        <span className="shrink-0 text-right">
                          <span className="flex items-center justify-end gap-1 text-[14px] font-medium tabular-nums text-[#342d27] md:text-[15px] dark:text-foreground">
                            <Star className={`h-3 w-3 ${candidate.reviewSummary.hasReviews ? "fill-primary text-primary" : "text-muted-foreground/55"}`} strokeWidth={1.6} aria-hidden />
                            {candidate.reviewSummary.rating.toFixed(1).replace(".", ",")}
                          </span>
                          <span className="mt-1 block text-[12px] text-muted-foreground md:text-[13px]">
                            {candidate.reviewSummary.hasReviews ? candidate.reviewSummary.reviewsLabel : "Нет отзывов"}
                          </span>
                        </span>
                      </Link>
                    ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ManufacturerProfile;
