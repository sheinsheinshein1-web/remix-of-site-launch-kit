import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { ChevronDown, ChevronLeft, ChevronRight, Flag, Forward, Heart, Play, Star, X } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ManufacturerLogo from "@/components/ManufacturerLogo";
import ManufacturerName from "@/components/ManufacturerName";
import ManufacturerReportDialog from "@/components/ManufacturerReportDialog";
import OtherProjectsFeed from "@/components/OtherProjectsFeed";
import ProjectCard from "@/components/ProjectCard";
import Seo from "@/components/Seo";
import SiteBreadcrumbs, { siteBreadcrumbPageContainerClassName } from "@/components/SiteBreadcrumbs";
import VerifiedBadge from "@/components/VerifiedBadge";
import TrailingChevronLabel from "@/components/TrailingChevronLabel";
import NotFound from "@/pages/NotFound";
import { useFavorites } from "@/contexts/FavoritesContext";
import { makersById, projects, projectsCountByMakerId } from "@/data/projects";
import type {
  ManufacturerBuiltObject,
  ManufacturerLegal,
  ManufacturerProjectTab,
  ManufacturerSocial,
} from "@/data/manufacturers";
import { getExternalManufacturerRating, getManufacturerRatingSummary } from "@/data/manufacturerRatings";
import { getPartnerReviews, getPartnerReviewSummary } from "@/data/partnerReviews";
import { compareProjectTechnologyPriority } from "@/lib/projectPriority";
import { getCityDisplayName, getCityPrepositionalName, isSameCityRegion } from "@/lib/cityDisplay";
import { getManufacturerMapUrls } from "@/lib/manufacturerMap";
import { normalizeGeoSelection } from "@/lib/geoSelection";
import { formatManufacturerEnforcementProceedings, getPublicLegalSources } from "@/lib/manufacturerLegal";
import {
  getManufacturerSocialSources,
  groupManufacturerProjects,
  manufacturerProjectTabLabels,
  manufacturerSectionLabels,
} from "@/lib/manufacturerPresentation";
import type { ManufacturerSocialSource } from "@/lib/manufacturerPresentation";
import { buildManufacturerSeo } from "@/lib/pageSeo";
import { buildAssetUrl, buildCanonicalUrl } from "@/lib/seo";
import { isVerifiedMaker } from "@/lib/verifiedMakers";
import {
  MANUFACTURERS_PATH,
  getManufacturerPath,
  getManufacturerReviewsPath,
  getProjectPath,
  getRegionPath,
} from "@/lib/siteRoutes";

const LEGACY_PARTNER_IDS: Record<string, string> = { "1": "platforma" };

const wordForm = (count: number, forms: [string, string, string]) => {
  const lastTwo = Math.abs(count) % 100;
  const lastOne = lastTwo % 10;
  if (lastTwo > 10 && lastTwo < 20) return forms[2];
  if (lastOne === 1) return forms[0];
  if (lastOne >= 2 && lastOne <= 4) return forms[1];
  return forms[2];
};

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

const ExternalIframe = ({ src, title, className }: { src: string; title: string; className: string }) => {
  return (
    <iframe
      src={src}
      title={title}
      className={className}
    />
  );
};

const ManufacturerYandexReviews = ({
  makerId,
  makerName,
  makerNamePrepositional,
}: {
  makerId: string;
  makerName: string;
  makerNamePrepositional: string;
}) => {
  const yandexRating = getExternalManufacturerRating(makerId);
  if (!yandexRating) return null;

  return (
    <div className="mt-5 w-full">
      <div
        id="manufacturer-external-reviews-panel"
        className="reviews-scroll h-[500px] overflow-y-scroll overscroll-contain rounded-[var(--radius)] border border-[#dfe5f5] bg-[#f3f1ed] dark:border-border"
        role="region"
        aria-label={`Отзывы о ${makerNamePrepositional} на Яндекс Картах. Прокручиваемая область`}
        tabIndex={0}
      >
        <ExternalIframe
          src={yandexRating.embedUrl}
          title={`Официальный виджет отзывов о ${makerNamePrepositional} на Яндекс Картах`}
          className="mx-auto block h-[1280px] w-full min-w-[300px] max-w-[760px] border-0"
        />
      </div>
    </div>
  );
};

const TelegramPostEmbed = ({ channel, postId, dark }: { channel: string; postId: number; dark: boolean }) => {
  const embedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = embedRef.current;
    if (!container) return;

    container.replaceChildren();
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.dataset.telegramPost = `${channel}/${postId}`;
    script.dataset.width = "100%";
    script.dataset.color = "3C71EC";
    if (dark) script.dataset.dark = "1";
    container.appendChild(script);

    return () => container.replaceChildren();
  }, [channel, dark, postId]);

  return <div ref={embedRef} className="min-h-[180px] w-full [&>iframe]:!max-w-none" />;
};

const ManufacturerTelegramPosts = ({ manufacturerName, social }: { manufacturerName: string; social: ManufacturerSocial }) => {
  const { resolvedTheme } = useTheme();
  const channel = social.telegramChannel;

  if (!channel || social.telegramPosts.length === 0) return null;

  return (
    <div className="mt-5 w-full">
      <div
        className="reviews-scroll h-[640px] overflow-y-auto overscroll-contain rounded-[var(--radius)] border border-border bg-secondary/40 px-2 py-4 sm:px-4"
        role="region"
        aria-label={`Публикации ${manufacturerName} в Telegram. Прокручиваемая область`}
        tabIndex={0}
      >
        <div className="mx-auto w-full max-w-[500px] space-y-4">
          {social.telegramPosts.map((postId) => (
            <TelegramPostEmbed
              key={postId}
              channel={channel}
              postId={postId}
              dark={resolvedTheme === "dark"}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const ManufacturerYouTubePosts = ({ manufacturerName, social }: { manufacturerName: string; social: ManufacturerSocial }) => {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  return (
    <div className="mt-5 flex w-full min-w-0 max-w-full snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-2 md:gap-4 md:overflow-visible md:pb-0">
      {social.youtubeVideos.map((video) => {
        const isPlaying = activeVideoId === video.id;
        return (
          <article
            key={video.id}
            className="min-w-0 max-w-[82%] shrink-0 basis-[82%] snap-start rounded-[var(--radius)] border border-border bg-card p-2 md:max-w-none md:basis-auto"
          >
            <div className="aspect-[4/3] overflow-hidden rounded-[var(--radius)] bg-[#101114]">
              {isPlaying ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&playsinline=1&rel=0`}
                  title={video.title}
                  className="block h-full w-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setActiveVideoId(video.id)}
                  className="group relative block h-full w-full overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
                  aria-label={`Воспроизвести видео «${video.title}»`}
                >
                  <img
                    src={video.thumbnail}
                    alt={`Превью видео «${video.title}» компании «${manufacturerName}»`}
                    width={480}
                    height={360}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.015] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[var(--radius)] bg-primary text-white transition-transform group-hover:scale-105 group-active:scale-[0.98] motion-reduce:transition-none motion-reduce:group-hover:scale-100">
                    <Play className="h-5 w-5 fill-current" strokeWidth={1.8} aria-hidden />
                  </span>
                </button>
              )}
            </div>
            <h3 className="mt-3 line-clamp-2 text-[15px] font-semibold leading-snug text-[#342d27] dark:text-foreground">
              {video.title}
            </h3>
            <p className="mt-2 text-[13px] text-muted-foreground">{video.publishedLabel}</p>
          </article>
        );
      })}
    </div>
  );
};

const ManufacturerEmptyState = ({ title, description, action }: {
  title: string;
  description: string;
  action?: ReactNode;
}) => (
  <div className="mt-5 flex min-h-[220px] flex-col items-center justify-center rounded-[var(--radius)] bg-secondary px-5 py-8 text-center">
    <h3 className="text-[20px] font-semibold text-[#342d27] dark:text-foreground">{title}</h3>
    <p className="mt-2 max-w-[520px] text-[14px] leading-relaxed text-[#717b8e]">{description}</p>
    {action}
  </div>
);

const ManufacturerUnavailableSection = ({
  id,
  heading,
  title,
  description,
  checkedAtIso,
}: {
  id: string;
  heading: string;
  title: string;
  description: string;
  checkedAtIso?: string;
}) => (
  <section id={id} className="mt-16 scroll-mt-28 md:mt-24" aria-labelledby={`manufacturer-${id}-heading`}>
    <h2
      id={`manufacturer-${id}-heading`}
      className="text-[28px] font-semibold tracking-[-0.03em] text-[#342d27] md:text-[36px] dark:text-foreground"
    >
      {heading}
    </h2>
    <ManufacturerEmptyState title={title} description={description} />
    {checkedAtIso && (
      <p className="mt-3 text-[12px] text-[#717b8e]">
        Проверено {new Intl.DateTimeFormat("ru-RU").format(new Date(`${checkedAtIso}T00:00:00`))}
      </p>
    )}
  </section>
);

const ManufacturerSocialMedia = ({
  manufacturerName,
  social,
  sourceAudit,
  keepCanonicalSources = false,
}: {
  manufacturerName: string;
  social?: ManufacturerSocial;
  sourceAudit?: {
    youtube?: { status?: "imported" | "not-found" | "unverified"; note?: string };
    telegram?: { status?: "imported" | "not-found" | "unverified"; note?: string };
  };
  keepCanonicalSources?: boolean;
}) => {
  const normalizedSocial: ManufacturerSocial = social ?? { telegramPosts: [], youtubeVideos: [] };
  const hasYouTube = normalizedSocial.youtubeVideos.length > 0;
  const hasTelegram = Boolean(normalizedSocial.telegramChannel && normalizedSocial.telegramPosts.length > 0);
  const availableSources = keepCanonicalSources
    ? (["youtube", "telegram"] as const)
    : getManufacturerSocialSources(normalizedSocial);
  const [source, setSource] = useState<ManufacturerSocialSource>(availableSources[0] ?? "youtube");
  const selectedAuditStatus = sourceAudit?.[source]?.status;
  const emptySocialDescription = selectedAuditStatus === "not-found"
    ? `Подтверждённый ${source === "youtube" ? "YouTube" : "Telegram"}-канал компании «${manufacturerName}» не найден.`
    : selectedAuditStatus === "unverified"
      ? `${source === "youtube" ? "YouTube" : "Telegram"}-канал компании «${manufacturerName}» пока не подтверждён.`
      : `Публикаций компании «${manufacturerName}» из ${source === "youtube" ? "YouTube" : "Telegram"} пока нет.`;

  useEffect(() => {
    if (keepCanonicalSources) return;
    const fallbackSource = hasYouTube ? "youtube" : hasTelegram ? "telegram" : null;
    const sourceIsAvailable = source === "youtube" ? hasYouTube : hasTelegram;
    if (!sourceIsAvailable && fallbackSource) {
      setSource(fallbackSource);
    }
  }, [hasTelegram, hasYouTube, keepCanonicalSources, source]);

  if (availableSources.length === 0) return null;

  return (
    <div className="mt-7">
      <div
        className="flex min-w-0 max-w-full touch-pan-x items-center gap-5 overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="tablist"
        aria-label={`Социальные сети ${manufacturerName}`}
      >
        {availableSources.map((itemSource) => {
          const label = itemSource === "youtube" ? "YouTube" : "Telegram";
          const isActive = source === itemSource;
          return (
            <button
              key={itemSource}
              id={`manufacturer-social-${itemSource}-tab`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`manufacturer-social-${itemSource}-panel`}
              onClick={() => setSource(itemSource)}
              className="manufacturer-section-tab min-h-11 shrink-0 text-[20px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-4"
            >
              {label}
            </button>
          );
        })}
      </div>

      {source === "youtube" && hasYouTube ? (
        <div
          id="manufacturer-social-youtube-panel"
          role="tabpanel"
          aria-labelledby="manufacturer-social-youtube-tab"
        >
          <ManufacturerYouTubePosts manufacturerName={manufacturerName} social={normalizedSocial} />
        </div>
      ) : source === "telegram" && hasTelegram ? (
        <div
          id="manufacturer-social-telegram-panel"
          role="tabpanel"
          aria-labelledby="manufacturer-social-telegram-tab"
        >
          <ManufacturerTelegramPosts manufacturerName={manufacturerName} social={normalizedSocial} />
        </div>
      ) : (
        <ManufacturerEmptyState
          title={`${source === "youtube" ? "YouTube" : "Telegram"}-канал ${sourceAudit?.[source]?.status === "not-found" ? "не найден" : sourceAudit?.[source]?.status === "unverified" ? "пока не подтверждён" : "пока не добавлен"}`}
          description={emptySocialDescription}
        />
      )}
    </div>
  );
};

const ManufacturerReviewSources = ({
  makerId,
  makerName,
  makerNamePrepositional,
  source,
  onSourceChange,
  hasExternalRating,
  auditStatus,
  reviewSummary,
  reviewPreviews,
}: {
  makerId: string;
  makerName: string;
  makerNamePrepositional: string;
  source: "yandex" | "mnogomesta";
  onSourceChange: (source: "yandex" | "mnogomesta") => void;
  hasExternalRating: boolean;
  auditStatus?: "imported" | "not-found" | "first-party-only";
  reviewSummary: ReturnType<typeof getPartnerReviewSummary>;
  reviewPreviews: ReturnType<typeof getPartnerReviews>;
}) => {
  const yandexEmptyDescription = auditStatus === "first-party-only"
    ? "На сайте производителя есть собственные отзывы, но независимый источник на Яндекс Картах пока не подтверждён. Поэтому эти отзывы не включены в рейтинг."
    : auditStatus === "not-found"
      ? "При проверке независимые отзывы о компании на Яндекс Картах не найдены."
      : "Подтверждённые отзывы о компании на Яндекс Картах пока не добавлены.";

  return (
    <div className="mt-7">
      <div
        className="flex min-w-0 max-w-full touch-pan-x items-center gap-5 overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="tablist"
        aria-label={`Источник отзывов о ${makerNamePrepositional}`}
      >
        {([[
          "yandex",
          "Яндекс",
        ], [
          "mnogomesta",
          "Много места",
        ]] as const).map(([itemSource, label]) => (
          <button
            key={itemSource}
            id={`manufacturer-reviews-${itemSource}-tab`}
            type="button"
            role="tab"
            aria-selected={source === itemSource}
            aria-controls={`manufacturer-reviews-${itemSource}-panel`}
            onClick={() => onSourceChange(itemSource)}
            className="manufacturer-section-tab min-h-11 shrink-0 text-[20px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-4"
          >
            {label}
          </button>
        ))}
      </div>

      {source === "yandex" ? (
        <div id="manufacturer-reviews-yandex-panel" role="tabpanel" aria-labelledby="manufacturer-reviews-yandex-tab">
          {hasExternalRating ? (
            <ManufacturerYandexReviews
              makerId={makerId}
              makerName={makerName}
              makerNamePrepositional={makerNamePrepositional}
            />
          ) : (
            <ManufacturerEmptyState
              title="Отзывы на Яндексе пока не найдены"
              description={yandexEmptyDescription}
            />
          )}
        </div>
      ) : (
        <div id="manufacturer-reviews-mnogomesta-panel" role="tabpanel" aria-labelledby="manufacturer-reviews-mnogomesta-tab">
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
            <ManufacturerEmptyState
              title="Отзывов на «Много места» пока нет"
              description="Станьте первым, кто поделится опытом работы с компанией. Отзыв появится после проверки."
              action={(
                <Link to="/messages/support" className="mt-5 inline-flex min-h-11 items-center justify-center rounded-[var(--radius)] bg-primary px-5 text-[14px] font-medium text-white transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                  Оставить отзыв
                </Link>
              )}
            />
          )}
        </div>
      )}
    </div>
  );
};

const ManufacturerLegalOverview = ({
  legal,
  compact = false,
  manufacturerName,
  builtObjectsCount = 0,
  reviewsLabel = "Отзывов пока нет",
}: {
  legal: ManufacturerLegal;
  compact?: boolean;
  manufacturerName: string;
  builtObjectsCount?: number;
  reviewsLabel?: string;
}) => {
  const showVerificationSummary = true;
  const [expanded, setExpanded] = useState(!compact);
  const verificationCardRef = useRef<HTMLDivElement>(null);
  const isSoleProprietor = legal.legalName.startsWith("ИП ");
  const hasPublishedFinancials = legal.revenue !== "Не публикуется" || legal.netProfit !== "Не публикуется";
  const financialMetrics = [
    ["Выручка", legal.revenue],
    ["Чистая прибыль", legal.netProfit],
  ] as const;
  const enforcementProceedingsLabel = formatManufacturerEnforcementProceedings(legal.enforcementProceedings);
  const publicLegalSources = getPublicLegalSources(legal.sources);
  const registryChecks = [
    ["Арбитражные дела", legal.arbitrationCases],
    ...(legal.generalCourtCases ? [["Суды общей юрисдикции", legal.generalCourtCases] as const] : []),
    ["Исполнительные производства", enforcementProceedingsLabel],
    ["Реестр недобросовестных поставщиков", legal.unfairSuppliersRegistry],
  ] as const;
  const registrationLabel = isSoleProprietor ? "Предприниматель зарегистрирован" : "Компания зарегистрирована";
  const legalAddressLabel = isSoleProprietor ? "Регион регистрации" : "Юридический адрес";
  const builtObjectsLabel = `${builtObjectsCount.toLocaleString("ru-RU")} ${wordForm(builtObjectsCount, ["объект", "объекта", "объектов"])}`;

  const handleVerificationToggle = () => {
    if (!expanded) {
      setExpanded(true);
      return;
    }

    const section = document.getElementById("legal");
    const sectionTop = section ? section.getBoundingClientRect().top + window.scrollY : null;
    setExpanded(false);
    window.requestAnimationFrame(() => {
      if (sectionTop === null) return;
      window.scrollTo({ top: Math.max(0, sectionTop - 112), behavior: "auto" });
    });
  };

  if (showVerificationSummary) {
    return (
      <section id="legal" className="mt-16 scroll-mt-28 md:mt-24" aria-labelledby="manufacturer-legal-heading">
        <h2
          id="manufacturer-legal-heading"
          className="text-[28px] font-semibold tracking-[-0.03em] text-[#342d27] md:text-[36px] dark:text-foreground"
        >
          Юридическая информация
        </h2>

        <div ref={verificationCardRef} className="mt-7 overflow-hidden rounded-[var(--radius)] border border-border bg-card">
          <div className="px-5 py-6 md:px-7 md:py-7">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
              <div className="min-w-0">
                <p className="text-[18px] font-semibold leading-snug text-[#342d27] md:text-[20px] dark:text-foreground">
                  {legal.legalName}
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-[#717b8e]">
                  ИНН {legal.inn}
                </p>
              </div>
              <span className="inline-flex min-h-8 w-fit shrink-0 items-center rounded-[var(--radius)] bg-secondary px-3 text-[13px] font-medium text-[#595653] dark:text-muted-foreground">
                {legal.status}
              </span>
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5 lg:grid-cols-4 lg:gap-x-8">
              {([
                ["Дата регистрации", legal.registeredAt],
                ["Арбитражные дела", legal.arbitrationCases],
                ...(legal.generalCourtCases ? [["Суды общей юрисдикции", legal.generalCourtCases] as const] : []),
                ["Исполнительные производства", enforcementProceedingsLabel],
                ["Реестр недобросовестных поставщиков", legal.unfairSuppliersRegistry],
              ] as const).map(([label, value]) => (
                <div key={label} className="min-w-0">
                  <dt className="text-[12px] leading-snug text-[#717b8e]">{label}</dt>
                  <dd className="mt-2 text-[15px] font-semibold leading-snug text-[#342d27] dark:text-foreground">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {expanded && (
            <div id="manufacturer-legal-details" className="border-t border-border px-5 py-6 md:px-7 md:py-7">
              <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <dt className="text-[12px] text-[#717b8e]">{legalAddressLabel}</dt>
                  <dd className="mt-1.5 text-[14px] font-medium leading-relaxed text-[#342d27] dark:text-foreground">{legal.legalAddress}</dd>
                </div>
                <div>
                  <dt className="text-[12px] text-[#717b8e]">{isSoleProprietor ? "Предприниматель" : "Руководитель"}</dt>
                  <dd className="mt-1.5 text-[14px] font-medium text-[#342d27] dark:text-foreground">{legal.director}</dd>
                </div>
                {!isSoleProprietor && (
                  <div>
                    <dt className="text-[12px] text-[#717b8e]">Уставный капитал</dt>
                    <dd className="mt-1.5 text-[14px] font-medium tabular-nums text-[#342d27] dark:text-foreground">{legal.shareCapital}</dd>
                  </div>
                )}
                <div className="sm:col-span-2">
                  <dt className="text-[12px] text-[#717b8e]">Основной вид деятельности</dt>
                  <dd className="mt-1.5 text-[14px] font-medium leading-relaxed text-[#342d27] dark:text-foreground">{legal.mainActivity}</dd>
                </div>
                <div>
                  <dt className="text-[12px] text-[#717b8e]">ИНН</dt>
                  <dd className="mt-1.5 text-[14px] font-medium tabular-nums text-[#342d27] dark:text-foreground">{legal.inn}</dd>
                </div>
                {!isSoleProprietor && (
                  <div>
                    <dt className="text-[12px] text-[#717b8e]">КПП</dt>
                    <dd className="mt-1.5 text-[14px] font-medium tabular-nums text-[#342d27] dark:text-foreground">{legal.kpp}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-[12px] text-[#717b8e]">{isSoleProprietor ? "ОГРНИП" : "ОГРН"}</dt>
                  <dd className="mt-1.5 text-[14px] font-medium tabular-nums text-[#342d27] dark:text-foreground">{legal.ogrn}</dd>
                </div>
              </dl>

              {hasPublishedFinancials && (
                <div className="mt-6 border-t border-border pt-5">
                  <p className="text-[12px] text-[#717b8e]">Бухгалтерская отчётность за {legal.reportingYear} год</p>
                  <dl className="mt-3 grid grid-cols-2 gap-x-8 gap-y-4">
                    {financialMetrics.map(([label, value]) => (
                      <div key={label}>
                        <dt className="text-[12px] text-[#717b8e]">{label}</dt>
                        <dd className="mt-1.5 text-[15px] font-medium tabular-nums text-[#342d27] dark:text-foreground">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              {publicLegalSources.length > 0 && (
              <p className="mt-5 text-[12px] leading-relaxed text-[#717b8e]">
                Источники: {publicLegalSources.map((source, index) => (
                  <span key={source.href}>
                    {index > 0 && " · "}
                    <a
                      href={source.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-current/30 underline-offset-2 transition-colors hover:text-primary"
                    >
                      {source.label}
                    </a>
                  </span>
                ))}
              </p>
              )}
              <p className="mt-3 text-[11px] leading-relaxed text-[#717b8e]">
                Сведения носят информационный характер и не являются оценкой качества работ компании.
              </p>
            </div>
          )}

          <div className="flex flex-col gap-2 px-5 pb-3 pt-1 sm:flex-row sm:items-center sm:justify-between md:px-7">
            <p className="text-[12px] text-[#717b8e]">Данные на {legal.checkedAt}</p>
            {compact && (
              <button
                type="button"
                onClick={handleVerificationToggle}
                className="inline-flex min-h-11 items-center gap-1 self-start text-[14px] font-medium text-[#342d27] transition-colors hover:text-primary focus-visible:rounded-[var(--radius)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 sm:self-auto dark:text-foreground dark:hover:text-primary"
                aria-expanded={expanded}
                aria-controls="manufacturer-legal-details"
              >
                {expanded ? "Скрыть реквизиты" : "Показать реквизиты"}
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 motion-reduce:transition-none ${expanded ? "rotate-180" : ""}`}
                  strokeWidth={1.8}
                  aria-hidden
                />
              </button>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="legal" className="mt-16 scroll-mt-28 md:mt-24" aria-labelledby="manufacturer-legal-heading">
      <h2
        id="manufacturer-legal-heading"
        className="text-[28px] font-semibold tracking-[-0.03em] text-[#342d27] md:text-[36px] dark:text-foreground"
      >
        {showVerificationSummary ? "Компания и документы" : "Юридическая информация"}
      </h2>

      {showVerificationSummary && (
        <div ref={verificationCardRef} className={`mt-7 overflow-hidden border border-border bg-card ${compact && expanded ? "rounded-t-[var(--radius)]" : "rounded-[var(--radius)]"}`}>
          <div className="px-5 py-6 md:px-8 md:py-8">
            <p className="text-[14px] font-medium text-primary">По открытым данным</p>
            <p className="mt-3 max-w-[780px] text-[25px] font-semibold leading-[1.12] tracking-[-0.025em] text-[#342d27] md:text-[32px] dark:text-foreground">
              Коротко о компании «{manufacturerName}»
            </p>
            <p className="mt-4 max-w-[850px] text-[15px] leading-[1.65] text-[#595653] md:text-[16px] dark:text-muted-foreground">
              Собрали юридические сведения, финансовую отчётность и данные профиля {legal.legalName}. Они помогают проверить компанию перед договором, но не заменяют проверку его условий.
            </p>

            <dl className="mt-7 grid grid-cols-2 border-l border-t border-border lg:grid-cols-4">
              <div className="border-b border-r border-border p-4 md:p-5">
                <dt className="text-[12px] leading-snug text-[#717b8e]">{registrationLabel}</dt>
                <dd className="mt-2 text-[17px] font-semibold leading-tight text-[#342d27] dark:text-foreground">{legal.registeredAt}</dd>
                <p className="mt-1.5 text-[12px] text-[#717b8e]">Статус: {legal.status.toLocaleLowerCase("ru-RU")}</p>
              </div>
              <div className="border-b border-r border-border p-4 md:p-5">
                <dt className="text-[12px] leading-snug text-[#717b8e]">Финансы за {legal.reportingYear} год</dt>
                <dd className="mt-2 text-[17px] font-semibold leading-tight tabular-nums text-[#342d27] dark:text-foreground">{legal.revenue}</dd>
                <p className="mt-1.5 text-[12px] text-[#717b8e]">Выручка · прибыль {legal.netProfit}</p>
              </div>
              <div className="border-b border-r border-border p-4 md:p-5">
                <dt className="text-[12px] leading-snug text-[#717b8e]">Открытые реестры</dt>
                <dd className="mt-2 space-y-1 text-[13px] font-medium leading-snug text-[#342d27] dark:text-foreground">
                  <p>Арбитраж — {legal.arbitrationCases.toLocaleLowerCase("ru-RU")}</p>
                  <p>ФССП — {enforcementProceedingsLabel.toLocaleLowerCase("ru-RU")}</p>
                  <p>РНП — {legal.unfairSuppliersRegistry.toLocaleLowerCase("ru-RU")}</p>
                </dd>
              </div>
              <div className="border-b border-r border-border p-4 md:p-5">
                <dt className="text-[12px] leading-snug text-[#717b8e]">Профиль на «Много места»</dt>
                <dd className="mt-2 text-[17px] font-semibold leading-tight text-[#342d27] dark:text-foreground">{builtObjectsLabel}</dd>
                <p className="mt-1.5 text-[12px] text-[#717b8e]">{reviewsLabel}</p>
              </div>
            </dl>

            <div className="mt-6 border-l-[3px] border-primary bg-primary/[0.06] px-4 py-4 md:px-5">
              <p className="text-[14px] font-semibold text-[#342d27] dark:text-foreground">Перед заключением договора</p>
              <p className="mt-2 max-w-[900px] text-[13px] leading-relaxed text-[#595653] md:text-[14px] dark:text-muted-foreground">
                Проверьте, что в договоре указано {legal.legalName}, ИНН {legal.inn}. Зафиксируйте комплектацию, окончательную стоимость, сроки, гарантию и порядок оплаты.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-border bg-secondary/30 px-5 py-3 md:px-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="min-w-0 text-[12px] leading-relaxed text-[#717b8e]">Сведения обновлены {legal.checkedAt}</p>
            {compact && !expanded && (
              <button
                type="button"
                onClick={handleVerificationToggle}
                className="inline-flex min-h-11 shrink-0 items-center gap-1 self-start text-[14px] font-semibold text-[#342d27] transition-colors hover:text-primary focus-visible:rounded-[var(--radius)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 lg:self-auto dark:text-foreground dark:hover:text-primary"
                aria-expanded={expanded}
                aria-controls="manufacturer-legal-details"
              >
                Реквизиты и источники
                <ChevronDown className="h-4 w-4" strokeWidth={1.8} aria-hidden />
              </button>
            )}
          </div>

          {(!compact || !expanded) && (
            <p className="border-t border-border px-5 py-3 text-[11px] leading-relaxed text-[#717b8e] md:px-8">
              Сведения носят информационный характер. Перед подписанием договора повторно проверьте реквизиты и условия сделки.
            </p>
          )}
        </div>
      )}

      {(!showVerificationSummary || !compact || expanded) && (
      <div
        id="manufacturer-legal-details"
        className={`${showVerificationSummary ? "rounded-b-[var(--radius)] border border-t-0" : "mt-7 rounded-[var(--radius)] border"} border-border bg-card px-5 py-6 md:px-7 md:py-7`}
      >
        {showVerificationSummary ? (
          <div>
            <p className="text-[18px] font-semibold leading-snug text-[#342d27] md:text-[20px] dark:text-foreground">
              Реквизиты, финансы и источники
            </p>
            <p className="mt-2 max-w-[680px] text-[14px] leading-relaxed text-[#717b8e]">
              Юридический адрес: {legal.legalAddress}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
            <div className="min-w-0">
              <p className="text-[18px] font-semibold leading-snug text-[#342d27] md:text-[20px] dark:text-foreground">
                {legal.legalName}
              </p>
              <p className="mt-2 max-w-[680px] text-[14px] leading-relaxed text-[#717b8e]">
                {legal.legalAddress}
              </p>
            </div>
            <span className="inline-flex min-h-8 w-fit shrink-0 items-center rounded-[var(--radius)] bg-primary/10 px-3 text-[13px] font-semibold text-primary">
              {legal.status}
            </span>
          </div>
        )}

        <div className="mt-6 grid gap-7 border-t border-border pt-6 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] md:gap-10">
          <div>
            {hasPublishedFinancials ? (
              <>
                <p className="text-[13px] text-[#717b8e]">Финансовые показатели за {legal.reportingYear} год</p>
                <dl className="mt-4 grid grid-cols-2 gap-x-5 gap-y-5">
                  {financialMetrics.map(([label, value]) => (
                    <div key={label}>
                      <dt className="text-[13px] text-[#717b8e]">{label}</dt>
                      <dd className="mt-1.5 text-[22px] font-semibold leading-none tabular-nums text-[#342d27] md:text-[26px] dark:text-foreground">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </>
            ) : (
              <>
                <p className="text-[13px] text-[#717b8e]">Бухгалтерская отчётность</p>
                <p className="mt-3 max-w-[440px] text-[15px] font-semibold leading-relaxed text-[#342d27] dark:text-foreground">
                  Индивидуальные предприниматели не публикуют бухгалтерскую отчётность в ГИР БО.
                </p>
              </>
            )}
          </div>

          <dl className={expanded ? "grid grid-cols-2 gap-x-5 gap-y-5" : "hidden"}>
            <div>
              <dt className="text-[13px] text-[#717b8e]">Дата регистрации</dt>
              <dd className="mt-1.5 text-[15px] font-semibold text-[#342d27] dark:text-foreground">{legal.registeredAt}</dd>
            </div>
            {!isSoleProprietor && (
              <div>
                <dt className="text-[13px] text-[#717b8e]">Уставный капитал</dt>
                <dd className="mt-1.5 text-[15px] font-semibold tabular-nums text-[#342d27] dark:text-foreground">{legal.shareCapital}</dd>
              </div>
            )}
            <div className="col-span-2">
              <dt className="text-[13px] text-[#717b8e]">{isSoleProprietor ? "Предприниматель" : "Руководитель"}</dt>
              <dd className="mt-1.5 text-[15px] font-semibold text-[#342d27] dark:text-foreground">{legal.director}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-[13px] text-[#717b8e]">Основной вид деятельности</dt>
              <dd className="mt-1.5 text-[15px] font-semibold leading-snug text-[#342d27] dark:text-foreground">{legal.mainActivity}</dd>
            </div>
          </dl>
        </div>

        {!showVerificationSummary && (
          <dl className="mt-6 grid gap-x-7 gap-y-4 border-t border-border pt-6 sm:grid-cols-3">
            {registryChecks.map(([label, value]) => (
              <div key={label} className="flex items-start justify-between gap-5 sm:block">
                <dt className="max-w-[230px] text-[13px] leading-snug text-[#717b8e]">{label}</dt>
                <dd className="shrink-0 text-[14px] font-semibold text-[#342d27] sm:mt-2 dark:text-foreground">{value}</dd>
              </div>
            ))}
          </dl>
        )}

        <dl className={expanded ? "mt-6 grid gap-x-7 gap-y-4 border-t border-border pt-6 sm:grid-cols-2 lg:grid-cols-3" : "hidden"}>
          <div>
            <dt className="text-[13px] text-[#717b8e]">ИНН</dt>
            <dd className="mt-1.5 text-[14px] font-medium tabular-nums text-[#342d27] dark:text-foreground">{legal.inn}</dd>
          </div>
          {!isSoleProprietor && (
            <div>
              <dt className="text-[13px] text-[#717b8e]">КПП</dt>
              <dd className="mt-1.5 text-[14px] font-medium tabular-nums text-[#342d27] dark:text-foreground">{legal.kpp}</dd>
            </div>
          )}
          <div>
            <dt className="text-[13px] text-[#717b8e]">{isSoleProprietor ? "ОГРНИП" : "ОГРН"}</dt>
            <dd className="mt-1.5 text-[14px] font-medium tabular-nums text-[#342d27] dark:text-foreground">{legal.ogrn}</dd>
          </div>
        </dl>

        {showVerificationSummary && publicLegalSources.length > 0 && (
          <p className="mt-6 border-t border-border pt-5 text-[12px] leading-relaxed text-[#717b8e]">
            Источники: {publicLegalSources.map((source, index) => (
              <span key={source.href}>
                {index > 0 && " · "}
                <a
                  href={source.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium underline decoration-current/30 underline-offset-2 transition-colors hover:text-primary"
                >
                  {source.label}
                </a>
              </span>
            ))}
          </p>
        )}

        {compact && !showVerificationSummary && (
          <button
            type="button"
            onClick={() => setExpanded((current) => !current)}
            className="mt-5 inline-flex min-h-11 items-center gap-1 text-[15px] font-medium text-[#342d27] transition-colors hover:text-primary focus-visible:rounded-[var(--radius)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 dark:text-foreground dark:hover:text-primary"
            aria-expanded={expanded}
          >
            {expanded
              ? showVerificationSummary
                ? "Скрыть юридическую информацию"
                : "Скрыть реквизиты"
              : "Все реквизиты"}
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 motion-reduce:transition-none ${expanded ? "rotate-180" : ""}`}
              strokeWidth={1.8}
              aria-hidden
            />
          </button>
        )}

        {!showVerificationSummary && publicLegalSources.length > 0 && (
          <p className="mt-5 max-w-[850px] text-[12px] leading-relaxed text-[#717b8e]">
            Сведения проверены {legal.checkedAt} по открытым источникам: {publicLegalSources.map((source, index) => (
              <span key={source.href}>
                {index > 0 && ", "}
                <a
                  href={source.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-current/30 underline-offset-2 transition-colors hover:text-primary"
                >
                  {source.label}
                </a>
              </span>
            ))}.
          </p>
        )}
        {showVerificationSummary && (
          <>
            <p className="mt-6 border-t border-border pt-4 text-[11px] leading-relaxed text-[#717b8e]">
              Сведения носят информационный характер. Перед подписанием договора повторно проверьте реквизиты и условия сделки.
            </p>
            {compact && (
              <button
                type="button"
                onClick={handleVerificationToggle}
                className="mt-4 inline-flex min-h-11 items-center gap-1 text-[14px] font-semibold text-[#342d27] transition-colors hover:text-primary focus-visible:rounded-[var(--radius)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 dark:text-foreground dark:hover:text-primary"
                aria-expanded={expanded}
                aria-controls="manufacturer-legal-details"
              >
                Скрыть реквизиты и источники
                <ChevronDown className="h-4 w-4 rotate-180" strokeWidth={1.8} aria-hidden />
              </button>
            )}
          </>
        )}
      </div>
      )}
    </section>
  );
};

const ManufacturerBuiltObjectsGallery = ({ manufacturerName, objects, compact = false }: { manufacturerName: string; objects: ManufacturerBuiltObject[]; compact?: boolean }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(!compact);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number | null>(null);
  const isOpen = activeIndex !== null;
  const imageCount = objects.length;

  const showPrevious = useCallback(() => {
    setActiveIndex((current) => current === null ? 0 : (current - 1 + imageCount) % imageCount);
  }, [imageCount]);

  const showNext = useCallback(() => {
    setActiveIndex((current) => current === null ? 0 : (current + 1) % imageCount);
  }, [imageCount]);

  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousBodyOverflow = document.body.style.overflow;
    const focusFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveIndex(null);
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousBodyOverflow;
      previouslyFocused?.focus();
    };
  }, [isOpen, showNext, showPrevious]);

  useEffect(() => {
    if (activeIndex === null) return;

    [
      (activeIndex - 1 + imageCount) % imageCount,
      (activeIndex + 1) % imageCount,
    ].forEach((index) => {
      const image = new Image();
      image.src = objects[index].src;
    });
  }, [activeIndex, imageCount, objects]);

  return (
    <>
      <div className="grid grid-cols-2 gap-x-[2px] gap-y-6 md:gap-x-4 md:gap-y-8">
        {objects.slice(0, showAll ? imageCount : 6).map((image, index) => (
          <button
            key={image.src}
            type="button"
            onClick={() => setActiveIndex(index)}
            className="group aspect-[4/3] min-w-0 cursor-zoom-in overflow-hidden rounded-[var(--radius)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 md:aspect-[5/4]"
            aria-label={`Открыть выполненный объект ${index + 1} из ${imageCount}`}
            aria-haspopup="dialog"
          >
            <img
              src={image.src}
              alt={`Выполненный объект компании «${manufacturerName}», фото ${index + 1}`}
              width={image.width}
              height={image.height}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.015] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              loading="lazy"
              decoding="async"
            />
          </button>
        ))}
      </div>

      {compact && imageCount > 6 && !showAll && (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="mt-5 inline-flex min-h-11 items-center gap-1 text-[15px] font-medium text-[#342d27] transition-colors hover:text-primary focus-visible:rounded-[var(--radius)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 dark:text-foreground dark:hover:text-primary"
        >
          Показать все {imageCount.toLocaleString("ru-RU")}
          <ChevronDown className="h-4 w-4" strokeWidth={1.8} aria-hidden />
        </button>
      )}

      {activeIndex !== null && (
        <div
          className="fixed inset-0 z-[100] flex touch-pan-y items-center justify-center bg-black/95 p-3 md:p-10"
          role="dialog"
          aria-modal="true"
          aria-label="Просмотр выполненных объектов"
          onClick={() => setActiveIndex(null)}
          onTouchStart={(event) => { touchStartX.current = event.touches[0].clientX; }}
          onTouchEnd={(event) => {
            if (touchStartX.current === null) return;
            const deltaX = event.changedTouches[0].clientX - touchStartX.current;
            if (Math.abs(deltaX) > 50) {
              if (deltaX < 0) showNext();
              if (deltaX > 0) showPrevious();
            }
            touchStartX.current = null;
          }}
        >
          <p
            className="absolute left-3 top-3 z-20 rounded-[var(--radius)] bg-white/10 px-3 py-2 text-[13px] font-medium tabular-nums text-white md:left-5 md:top-5"
            aria-live="polite"
          >
            {activeIndex + 1} / {imageCount}
          </p>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={(event) => { event.stopPropagation(); setActiveIndex(null); }}
            className="absolute right-3 top-3 z-20 flex h-11 w-11 items-center justify-center rounded-[var(--radius)] bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white md:right-5 md:top-5"
            aria-label="Закрыть просмотр"
          >
            <X className="h-5 w-5" strokeWidth={1.8} aria-hidden />
          </button>

          <img
            src={objects[activeIndex].src}
            alt={`Выполненный объект компании «${manufacturerName}», фото ${activeIndex + 1}`}
            width={objects[activeIndex].width}
            height={objects[activeIndex].height}
            className="max-h-[calc(100dvh-24px)] max-w-full select-none object-contain md:max-h-[calc(100dvh-80px)]"
            onClick={(event) => event.stopPropagation()}
            draggable={false}
          />

          <button
            type="button"
            onClick={(event) => { event.stopPropagation(); showPrevious(); }}
            className="absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-[var(--radius)] bg-black/45 text-white transition-colors hover:bg-black/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white md:left-5 md:h-12 md:w-12"
            aria-label="Предыдущий объект"
          >
            <ChevronLeft className="h-6 w-6" strokeWidth={1.8} aria-hidden />
          </button>

          <button
            type="button"
            onClick={(event) => { event.stopPropagation(); showNext(); }}
            className="absolute right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-[var(--radius)] bg-black/45 text-white transition-colors hover:bg-black/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white md:right-5 md:h-12 md:w-12"
            aria-label="Следующий объект"
          >
            <ChevronRight className="h-6 w-6" strokeWidth={1.8} aria-hidden />
          </button>
        </div>
      )}
    </>
  );
};

const ManufacturerSectionNav = ({
  showBuiltObjects,
  showLegal,
  showProduction,
  showSocialMedia,
  vertical = false,
  projectsBeforeLegal = false,
  embedded = false,
  productionLabel = manufacturerSectionLabels.production,
}: {
  showBuiltObjects: boolean;
  showLegal: boolean;
  showProduction: boolean;
  showSocialMedia: boolean;
  vertical?: boolean;
  projectsBeforeLegal?: boolean;
  embedded?: boolean;
  productionLabel?: string;
}) => {
  const items = useMemo(() => [
    { id: "about", label: manufacturerSectionLabels.about },
    ...(projectsBeforeLegal ? [{ id: "projects", label: manufacturerSectionLabels.projects }] : []),
    ...(showLegal ? [{ id: "legal", label: manufacturerSectionLabels.legal }] : []),
    ...(!projectsBeforeLegal ? [{ id: "projects", label: manufacturerSectionLabels.projects }] : []),
    ...(showBuiltObjects ? [{ id: "built-objects", label: manufacturerSectionLabels.builtObjects }] : []),
    ...(showProduction ? [{ id: "production", label: productionLabel }] : []),
    { id: "reviews", label: manufacturerSectionLabels.reviews },
    ...(showSocialMedia ? [{ id: "social-media", label: manufacturerSectionLabels.socialMedia }] : []),
  ], [productionLabel, projectsBeforeLegal, showBuiltObjects, showLegal, showProduction, showSocialMedia]);
  const [activeSection, setActiveSection] = useState(items[0].id);

  useEffect(() => {
    let animationFrame: number | null = null;

    const updateActiveSection = () => {
      if (animationFrame !== null) return;
      animationFrame = window.requestAnimationFrame(() => {
        animationFrame = null;
        const activationLine = 128;
        let nextSection = items[0].id;

        items.forEach((item) => {
          const section = document.getElementById(item.id);
          if (section && section.getBoundingClientRect().top <= activationLine) {
            nextSection = item.id;
          }
        });

        setActiveSection((current) => current === nextSection ? current : nextSection);
      });
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [items]);

  return (
    <nav
      className={vertical
        ? "min-w-0"
        : embedded
          ? "flex h-[50px] min-w-0 items-center md:h-[60px]"
          : "mb-8 min-w-0 md:mb-10"}
      aria-label="Разделы страницы производителя"
    >
      <ul className={vertical
        ? "grid gap-0.5"
        : embedded
          ? "flex h-full max-w-full touch-pan-x items-center gap-5 overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          : "flex max-w-full flex-wrap items-center gap-x-5 gap-y-0 md:gap-x-6"}
      >
        {items.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                data-section-id={item.id}
                aria-current={isActive ? "location" : undefined}
                onClick={(event) => {
                  event.preventDefault();
                  const section = document.getElementById(item.id);
                  if (!section) return;

                  setActiveSection(item.id);
                  window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}#${item.id}`);
                  section.scrollIntoView({
                    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
                    block: "start",
                  });
                }}
                className={embedded
                  ? "manufacturer-section-tab inline-flex h-11 shrink-0 items-center whitespace-nowrap text-[14px] font-medium tracking-normal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                  : `manufacturer-section-tab inline-flex min-h-11 shrink-0 items-center whitespace-nowrap text-[16px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 md:text-[17px] ${vertical ? "w-full" : ""}`}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

const ManufacturerProfile = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [manufacturerProjectType, setManufacturerProjectType] = useState<ManufacturerProjectTab>("houses");
  const [manufacturerReviewSource, setManufacturerReviewSource] = useState<"yandex" | "mnogomesta">("yandex");
  const [aboutExpanded, setAboutExpanded] = useState(false);
  const makerId = id ? LEGACY_PARTNER_IDS[id] ?? id : "platforma";
  const maker = makersById[makerId];
  const profile = maker?.profile;
  const hasCanonicalProfile = Boolean(profile?.sourceAudit);
  const canonicalPath = getManufacturerPath(makerId);
  const { isMakerFavorite, toggleMakerFavorite } = useFavorites();
  const makerIsFavorite = isMakerFavorite(makerId);

  const makerProjects = useMemo(
    () => projects.filter((project) => project.manufacturerId === makerId).sort(compareProjectTechnologyPriority),
    [makerId],
  );
  const projectsByType = groupManufacturerProjects(makerProjects);
  const configuredProjectTabs: ManufacturerProjectTab[] = profile?.projectTabs
    ?? ["houses", "baths", "business"];
  const manufacturerProjectTabs = configuredProjectTabs.filter((type) => projectsByType[type].length > 0);
  const groupedProjects = Boolean(profile?.groupedProjects) && manufacturerProjectTabs.length > 1;
  const activeManufacturerProjectType = manufacturerProjectTabs.includes(manufacturerProjectType)
    ? manufacturerProjectType
    : (manufacturerProjectTabs[0] ?? "houses");
  const visibleMakerProjects = groupedProjects
    ? projectsByType[activeManufacturerProjectType]
    : makerProjects;

  useEffect(() => {
    if (!maker || location.pathname === canonicalPath) return;
    navigate(`${canonicalPath}${location.search}${location.hash}`, { replace: true });
  }, [canonicalPath, location.hash, location.pathname, location.search, maker, navigate]);

  useEffect(() => {
    setAboutExpanded(false);
  }, [makerId]);

  if (!maker || makerProjects.length === 0) return <NotFound />;

  const reviewSummary = getPartnerReviewSummary(makerId);
  const profileReviewSummary = getManufacturerRatingSummary(makerId);
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
  const confirmedProjectTerms = uniqueValues(
    makerProjects
      .map((project) => project.term)
      .filter((term) => term.toLocaleLowerCase("ru-RU") !== "по запросу"),
  );
  const productionTermLabel = confirmedProjectTerms.length === 0
    ? "По запросу"
    : confirmedProjectTerms.length === 1
      ? confirmedProjectTerms[0]
      : "Зависит от проекта";
  const legal = profile?.legal;
  const builtObjects = profile?.builtObjects ?? [];
  const social = profile?.social;
  const hasSocialMedia = Boolean(
    social && (
      social.youtubeVideos.length > 0
      || (social.telegramChannel && social.telegramPosts.length > 0)
    ),
  );
  const mapCoordinates = profile?.coordinates
    && typeof profile.coordinates.lat === "number"
    && typeof profile.coordinates.lon === "number"
    ? { lat: profile.coordinates.lat, lon: profile.coordinates.lon }
    : undefined;
  const mapSectionLabel = profile?.mapKind === "office" ? "Офис" : manufacturerSectionLabels.production;
  const mapHeading = profile?.mapKind === "office" ? "Офис на карте" : "Производство на карте";
  const mapFrameTitle = profile?.mapKind === "office"
    ? `Офис компании ${maker.name} на карте`
    : `Производство компании ${maker.name} на карте`;
  const { embedUrl: mapEmbedUrl, externalUrl: yandexMapLink } = getManufacturerMapUrls({
    address: maker.productionAddress,
    city: cityLabel,
    coordinates: mapCoordinates,
  });
  const fallbackAbout = `${maker.name} — производитель домов из ${cityLabel}. На странице собраны проекты компании, доступные в каталоге многоместа.рф.`;
  const storedAboutParagraphs = profile?.about ?? [fallbackAbout];
  const catalogTypeSummary = projectsByType.houses.length > 0 && projectsByType.baths.length > 0
    ? "Среди них есть жилые дома и готовые бани."
    : projectsByType.baths.length > 0
      ? "Все представленные проекты относятся к готовым баням."
      : "Все представленные проекты относятся к жилым модульным домам.";
  const businessSummary = projectsByType.business.length > 0
    ? ` Для аренды, глэмпинга и других коммерческих сценариев отмечено ${projectsByType.business.length.toLocaleString("ru-RU")} ${wordForm(projectsByType.business.length, ["подходящее решение", "подходящих решения", "подходящих решений"])}.`
    : "";
  const projectPriceSummary = minPrice > 0
    ? ` и стоимостью от ${minPriceLabel}`
    : "; стоимость уточняется у производителя";
  const catalogSummary = `На «Много места» представлено ${makerProjects.length.toLocaleString("ru-RU")} ${wordForm(makerProjects.length, ["проект", "проекта", "проектов"])} площадью ${areaRange}${projectPriceSummary}. ${catalogTypeSummary}${businessSummary} Планировку, фасад, комплектацию и дополнительные опции производитель уточняет под выбранный проект и участок.`;
  const aboutParagraphs = profile?.useCatalogSummary && storedAboutParagraphs.length > 1
    ? [storedAboutParagraphs[0], catalogSummary, ...storedAboutParagraphs.slice(2)]
    : storedAboutParagraphs;
  const profileIntro = profile?.intro ?? aboutParagraphs[0];
  const heroImage = makerProjects[0]?.gallery[0]?.image;
  const manufacturerSeo = profile?.seo
    ? {
        title: profile.seo.title,
        description: profile.seo.descriptionTemplate.replace(
          "{projectCount}",
          makerProjects.length.toLocaleString("ru-RU"),
        ),
      }
    : buildManufacturerSeo({
        name: maker.name,
        city: cityLabel,
        projectCount: makerProjects.length,
        hasReviews: profileReviewSummary.hasReviews,
      });
  // Every manufacturer route uses one production template. Query parameters no longer
  // expose the removed classic/analytic variants.
  const isFeaturedVisualView = true;
  const isLegacyAnalyticalView = false;
  const isAnalyticalView = true;

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
  const otherRegionProjectsCount = projects
    .filter((project) => project.manufacturerId !== makerId && isSameCityRegion(project.city, maker.city))
    .length;
  const otherRegionMakersPreview = otherRegionMakers.slice(0, 8);
  const regionSlug = normalizeGeoSelection(maker.city);
  const regionProjectsHref = getRegionPath(regionSlug);
  const regionManufacturersHref = `${MANUFACTURERS_PATH}?region=${encodeURIComponent(regionSlug)}`;

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

  const canonicalUrl = buildCanonicalUrl(canonicalPath);
  const organizationId = `${canonicalUrl}#organization`;
  const pageId = `${canonicalUrl}#webpage`;
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": organizationId,
    name: maker.name,
    description: aboutParagraphs.join(" "),
    url: maker.siteUrl,
    logo: profile?.schemaLogoUrl
      ? profile.schemaLogoUrl
      : maker.logo && !maker.logo.startsWith("data:")
        ? buildAssetUrl(maker.logo)
        : undefined,
    image: buildAssetUrl(heroImage),
    areaServed: cityLabel,
    ...(legal ? {
      legalName: legal.legalName,
      taxID: legal.inn,
      foundingDate: legal.foundingDate,
      address: {
        "@type": "PostalAddress",
        addressCountry: "RU",
        streetAddress: legal.legalAddress,
      },
      location: {
        "@type": "Place",
        name: profile?.mapKind === "office"
          ? `Офис компании «${maker.name}»`
          : `Производство компании «${maker.name}»`,
        address: maker.productionAddress,
      },
      identifier: [
        { "@type": "PropertyValue", propertyID: "ИНН", value: legal.inn },
        { "@type": "PropertyValue", propertyID: "ОГРН", value: legal.ogrn },
      ],
      sameAs: social
        ? [
            ...(social.telegramChannel ? [`https://t.me/${social.telegramChannel}`] : []),
            ...(social.youtubeChannelUrl ? [social.youtubeChannelUrl] : []),
          ]
        : undefined,
    } : {
      address: maker.productionAddress,
    }),
  };
  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": pageId,
    url: canonicalUrl,
    name: manufacturerSeo.title,
    description: manufacturerSeo.description,
    dateModified: legal?.checkedAtIso,
    primaryImageOfPage: {
      "@type": "ImageObject",
      contentUrl: buildAssetUrl(heroImage),
    },
    mainEntity: { "@id": organizationId },
    isPartOf: {
      "@type": "WebSite",
      name: "многоместа.рф",
      url: buildCanonicalUrl("/"),
    },
  };
  const projectListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Проекты компании «${maker.name}»`,
    numberOfItems: makerProjects.length,
    itemListElement: makerProjects.map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: project.name,
      url: buildCanonicalUrl(getProjectPath(project)),
    })),
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
        title={manufacturerSeo.title}
        description={manufacturerSeo.description}
        canonicalPath={canonicalPath}
        image={heroImage}
        jsonLd={[organizationJsonLd, webPageJsonLd, projectListJsonLd, breadcrumbJsonLd]}
      />

      <main className="bg-white dark:bg-background">
        <Header variant="home" marketplaceNavigationMode="top-only" />
        <div className={`${siteBreadcrumbPageContainerClassName} pb-16 sm:pb-20`}>
          <SiteBreadcrumbs
            items={[
              { label: "Главная", to: "/" },
              { label: "Производители", to: MANUFACTURERS_PATH },
              { label: maker.name },
            ]}
          />

          {isAnalyticalView && (
            <section
              className={isFeaturedVisualView
                ? "mb-7 pb-8 md:mb-0 md:pb-10"
                : "mb-10 border-y border-border py-7 md:mb-14 md:py-10"}
              aria-labelledby="manufacturer-profile-title"
            >
              <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end lg:gap-12">
                <div className="min-w-0">
                  <div className="flex items-start gap-4 md:gap-6">
                    <ManufacturerLogo
                      manufacturer={maker}
                      className="h-[76px] w-[76px] text-[16px] md:h-24 md:w-24"
                      loading="eager"
                    />
                    <div className="min-w-0 pt-0.5">
                      <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2">
                        <h1 id="manufacturer-profile-title" className="min-w-0 text-[34px] font-semibold leading-[0.96] tracking-[-0.045em] text-[#342d27] md:text-[52px] dark:text-foreground">
                          {maker.name}
                        </h1>
                        {verified && <VerifiedBadge />}
                      </div>
                      {profile?.headlineSuffix && (
                        <p className="mt-2 max-w-[620px] text-[14px] font-medium leading-[1.35] text-[#717b8e] md:text-[18px]">
                          {profile.headlineSuffix}
                        </p>
                      )}
                    </div>
                  </div>

                  <p className="mt-6 max-w-[700px] text-[18px] leading-[1.55] text-[#342d27] md:text-[22px] dark:text-foreground">
                    {profileIntro}
                  </p>
                  <a
                    href="#reviews"
                    className="group mt-4 inline-flex min-h-11 items-center gap-2 text-[14px] font-medium text-[#342d27] transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 dark:text-foreground dark:hover:text-primary"
                    aria-label={`Рейтинг ${profileReviewSummary.rating.toFixed(1)} из 5, ${profileReviewSummary.reviewsLabel}`}
                  >
                    <span className="flex items-center gap-0.5" aria-hidden>
                      {Array.from({ length: 5 }, (_, index) => (
                        <Star
                          key={index}
                          className={`h-3.5 w-3.5 ${index < Math.round(profileReviewSummary.rating) ? "fill-primary text-primary" : "text-[#c5cbd8] dark:text-border"}`}
                          strokeWidth={1.5}
                        />
                      ))}
                    </span>
                    <span className="tabular-nums">{profileReviewSummary.rating.toFixed(1).replace(".", ",")}</span>
                    <span className="text-[#717b8e] transition-colors group-hover:text-primary">{profileReviewSummary.reviewsLabel}</span>
                  </a>
                </div>

                <div className="grid gap-2">
                  {maker.siteUrl && (
                    <a
                      href={maker.siteUrl}
                      target="_blank"
                      rel="noopener noreferrer nofollow sponsored"
                      className="flex min-h-12 w-full items-center justify-center rounded-[var(--radius)] bg-primary px-5 text-center text-[15px] font-semibold text-white transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    >
                      Перейти на сайт
                    </a>
                  )}
                  <div className="grid grid-cols-[minmax(0,1fr)_48px] gap-2">
                    <button
                      type="button"
                      onClick={handleShare}
                      className="group flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius)] border border-border bg-background px-3 text-[14px] font-medium text-[#342d27] transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 dark:text-foreground"
                    >
                      <Forward className="h-4 w-4 text-[#717b8e] transition-colors group-hover:text-primary" strokeWidth={1.7} aria-hidden />
                      Поделиться
                    </button>
                    <button
                      type="button"
                      onClick={handleToggleMakerFavorite}
                      className="group flex h-12 w-12 items-center justify-center rounded-[var(--radius)] border border-border bg-background text-[#342d27] transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 dark:text-foreground"
                      aria-pressed={makerIsFavorite}
                      aria-label={makerIsFavorite ? "Удалить производителя из избранного" : "Добавить производителя в избранное"}
                    >
                      <Heart className={`h-5 w-5 ${makerIsFavorite ? "fill-red-500 text-red-500" : "text-[#717b8e] group-hover:text-primary"}`} strokeWidth={1.7} aria-hidden />
                    </button>
                  </div>
                </div>
              </div>

              {!isFeaturedVisualView && (
                <dl className="mt-8 grid grid-cols-2 gap-x-5 gap-y-6 border-t border-border pt-7 sm:grid-cols-3 lg:grid-cols-6 lg:gap-x-7">
                  {([
                    ["Проекты", makerProjects.length.toLocaleString("ru-RU")],
                    ["Цена от", minPriceLabel],
                    ["Площадь", areaRange],
                    ["Выполнено", builtObjects.length.toLocaleString("ru-RU")],
                    ["Срок производства", productionTermLabel],
                    ["Доставка", "По запросу"],
                  ] as const).map(([label, value]) => (
                    <div key={label} className="min-w-0">
                      <dt className="text-[12px] text-[#717b8e]">{label}</dt>
                      <dd className="mt-1.5 text-[17px] font-semibold leading-tight tabular-nums text-[#342d27] dark:text-foreground">{value}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </section>
          )}

          {isFeaturedVisualView && (
            <div className="sticky top-[51px] z-40 -mx-4 mb-10 bg-background px-4 sm:-mx-8 sm:px-8 md:top-[61px] md:mb-12 lg:-mx-12 lg:px-12">
              <ManufacturerSectionNav
                showBuiltObjects={builtObjects.length > 0 || hasCanonicalProfile}
                showLegal={Boolean(legal) || hasCanonicalProfile}
                showProduction={Boolean(mapEmbedUrl) || hasCanonicalProfile}
                showSocialMedia={hasSocialMedia || hasCanonicalProfile}
                productionLabel={mapSectionLabel}
                projectsBeforeLegal
                embedded
              />
            </div>
          )}

          <div className={`grid items-start ${isFeaturedVisualView ? "gap-y-5" : "gap-y-10 lg:gap-y-12"} ${isLegacyAnalyticalView ? "lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-x-12 xl:grid-cols-[240px_minmax(0,1fr)] xl:gap-x-16" : isFeaturedVisualView ? "grid-cols-1" : "lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-x-14 xl:grid-cols-[330px_minmax(0,1fr)] xl:gap-x-20"}`}>
            {isLegacyAnalyticalView && (
              <aside className="sticky top-24 hidden self-start lg:block" aria-label="Навигация и статус данных">
                <p className="mb-3 text-[12px] font-medium text-[#717b8e]">Разделы</p>
                <ManufacturerSectionNav
                  showBuiltObjects={builtObjects.length > 0 || hasCanonicalProfile}
                  showLegal={Boolean(legal) || hasCanonicalProfile}
                  showProduction={Boolean(mapEmbedUrl) || hasCanonicalProfile}
                  showSocialMedia={hasSocialMedia || hasCanonicalProfile}
                  productionLabel={mapSectionLabel}
                  vertical
                  projectsBeforeLegal
                />
                <div className="mt-7 border-t border-border pt-6">
                  <p className="text-[12px] font-medium text-[#717b8e]">Проверка данных</p>
                  <dl className="mt-4 grid gap-4 text-[13px]">
                    <div>
                      <dt className="text-[#717b8e]">Юридический статус</dt>
                      <dd className="mt-1 font-semibold text-[#342d27] dark:text-foreground">Компания действует</dd>
                    </div>
                    <div>
                      <dt className="text-[#717b8e]">Источники</dt>
                      <dd className="mt-1 font-semibold text-[#342d27] dark:text-foreground">Реестры, каталог, отзывы</dd>
                    </div>
                    <div>
                      <dt className="text-[#717b8e]">Обновлено</dt>
                      <dd className="mt-1 font-semibold text-[#342d27] dark:text-foreground">{legal?.checkedAt}</dd>
                    </div>
                  </dl>
                  <ManufacturerReportDialog manufacturerName={maker.name}>
                    <button
                      type="button"
                      className="group mt-4 flex min-h-11 items-center gap-2 text-left text-[13px] text-[#717b8e] transition-colors hover:text-primary focus-visible:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                    >
                      <Flag className="h-4 w-4" strokeWidth={1.7} aria-hidden />
                      Сообщить об ошибке
                    </button>
                  </ManufacturerReportDialog>
                </div>
              </aside>
            )}

            {!isAnalyticalView && (
            <aside className="self-start" aria-label={`Профиль компании ${maker.name}`}>
              <div className="flex items-start gap-4 lg:block">
                <ManufacturerLogo
                  manufacturer={maker}
                  className="h-[76px] w-[76px] text-[16px] lg:h-24 lg:w-24"
                  loading="eager"
                />

                <div className="min-w-0 flex-1 lg:mt-6">
                  <div className="flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-2">
                    <h1 className="min-w-0 text-[30px] font-semibold leading-none tracking-[-0.035em] text-[#342d27] lg:text-[40px] dark:text-foreground">
                      {maker.name}
                    </h1>
                    {verified && <VerifiedBadge />}
                  </div>
                  <p className="mt-2 text-[14px] leading-[1.4] text-[#717b8e] lg:text-[15px]">
                    {profile?.headlineSuffix ?? `${technologies.join(" · ")} · ${cityLabel}`}
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <a
                  href="#reviews"
                  className="group inline-flex min-h-11 items-center gap-2 text-[14px] font-medium text-[#342d27] transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 dark:text-foreground dark:hover:text-primary"
                  aria-label={profileReviewSummary.hasReviews
                    ? `Рейтинг ${profileReviewSummary.rating.toFixed(1)} из 5, ${profileReviewSummary.reviewsLabel}`
                    : "Отзывов пока нет"}
                >
                  <span className="flex items-center gap-0.5" aria-hidden>
                    {Array.from({ length: 5 }, (_, index) => (
                      <Star
                        key={index}
                        className={`h-3.5 w-3.5 ${index < Math.round(profileReviewSummary.rating) ? "fill-primary text-primary" : "text-[#c5cbd8] dark:text-border"}`}
                        strokeWidth={1.5}
                      />
                    ))}
                  </span>
                  <span className="tabular-nums">{profileReviewSummary.rating.toFixed(1).replace(".", ",")}</span>
                  <span className="text-[#717b8e] transition-colors group-hover:text-primary">{profileReviewSummary.reviewsLabel}</span>
                </a>
                <p className="mt-3 max-w-[34rem] text-[15px] leading-[1.65] text-[#595653] dark:text-muted-foreground">
                  {profileIntro}
                </p>
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

              <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-6">
                <div>
                  <dt className="text-[13px] text-[#717b8e]">Расположение</dt>
                  <dd className="mt-1.5 text-[16px] font-semibold text-[#342d27] dark:text-foreground">{cityLabel}</dd>
                </div>
                <div>
                  <dt className="text-[13px] text-[#717b8e]">Проекты</dt>
                  <dd className="mt-1.5 text-[16px] font-semibold text-[#342d27] dark:text-foreground">{makerProjects.length.toLocaleString("ru-RU")} в каталоге</dd>
                </div>
                <div>
                  <dt className="text-[13px] text-[#717b8e]">Технология</dt>
                  <dd className="mt-1.5 text-[16px] font-semibold text-[#342d27] dark:text-foreground">
                    {profile?.technologyLabel ?? technologies.join(", ")}
                  </dd>
                </div>
                <div>
                  <dt className="text-[13px] leading-snug text-[#717b8e]">Срок производства</dt>
                  <dd className="mt-1.5 text-[16px] font-semibold text-[#342d27] dark:text-foreground">{productionTermLabel}</dd>
                </div>
                <div>
                  <dt className="text-[13px] text-[#717b8e]">Площади</dt>
                  <dd className="mt-1.5 text-[16px] font-semibold text-[#342d27] dark:text-foreground">{areaRange}</dd>
                </div>
                <div>
                  <dt className="text-[13px] text-[#717b8e]">Цены от</dt>
                  <dd className="mt-1.5 text-[16px] font-semibold text-[#342d27] dark:text-foreground">{minPriceLabel}</dd>
                </div>
              </dl>

              <div className="mt-3 text-[14px] text-[#595653] dark:text-muted-foreground">
                <ManufacturerReportDialog manufacturerName={maker.name}>
                  <button
                    type="button"
                    className="group flex min-h-11 items-center gap-3 rounded-[var(--radius)] text-left text-[14px] text-[#717b8e] transition-colors hover:text-primary focus-visible:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2"
                  >
                    <Flag className="h-4 w-4 shrink-0 transition-colors group-hover:text-primary group-focus-visible:text-primary" strokeWidth={1.7} aria-hidden />
                    Пожаловаться
                  </button>
                </ManufacturerReportDialog>
              </div>

            </aside>
            )}

            <div className={isFeaturedVisualView ? "min-w-0" : "min-w-0 lg:col-start-2 lg:row-start-1"}>
              {!isFeaturedVisualView && (
                <div className={isLegacyAnalyticalView ? "lg:hidden" : undefined}>
                  <ManufacturerSectionNav
                    showBuiltObjects={builtObjects.length > 0 || hasCanonicalProfile}
                    showLegal={Boolean(legal) || hasCanonicalProfile}
                    showProduction={Boolean(mapEmbedUrl) || hasCanonicalProfile}
                    showSocialMedia={hasSocialMedia || hasCanonicalProfile}
                    productionLabel={mapSectionLabel}
                    projectsBeforeLegal={isAnalyticalView}
                  />
                </div>
              )}

              <section id="about" className="scroll-mt-28" aria-labelledby="manufacturer-about-heading">
                <h2 id="manufacturer-about-heading" className="text-[28px] font-semibold tracking-[-0.03em] text-[#342d27] md:text-[36px] dark:text-foreground">
                  {isAnalyticalView ? `О компании «${maker.name}»` : `Компания «${maker.name}»`}
                </h2>
                <div className="mt-5 max-w-[850px] text-[16px] leading-[1.72] text-[#595653] md:text-[17px] dark:text-muted-foreground">
                  <div id="manufacturer-about-details" className="space-y-4">
                    {aboutParagraphs.map((paragraph, index) => (
                      <p key={paragraph} className={!aboutExpanded && index >= (isFeaturedVisualView ? 1 : 2) ? "hidden" : undefined}>
                        {paragraph}
                      </p>
                    ))}
                  </div>
                  {aboutParagraphs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setAboutExpanded((current) => !current)}
                      className="mt-2 inline-flex min-h-11 items-center gap-1 text-[15px] font-medium text-[#342d27] transition-colors duration-200 hover:text-primary focus-visible:rounded-[var(--radius)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 dark:text-foreground dark:hover:text-primary"
                      aria-expanded={aboutExpanded}
                      aria-controls="manufacturer-about-details"
                    >
                      {aboutExpanded ? "Свернуть" : "Подробнее"}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 motion-reduce:transition-none ${aboutExpanded ? "rotate-180" : ""}`}
                        strokeWidth={1.8}
                        aria-hidden
                      />
                    </button>
                  )}
                </div>
              </section>

              {legal && !isAnalyticalView && (
                <ManufacturerLegalOverview
                  legal={legal}
                  manufacturerName={maker.name}
                  builtObjectsCount={builtObjects.length}
                  reviewsLabel={profileReviewSummary.reviewsLabel}
                />
              )}
            </div>

            <div className={isFeaturedVisualView ? "min-w-0" : "min-w-0 lg:col-start-2 lg:row-start-2"}>
              <section
                id="projects"
                className="scroll-mt-28"
                aria-labelledby="manufacturer-projects-heading"
              >
                <div className="mb-7">
                  {groupedProjects ? (
                    <>
                      <h2 id="manufacturer-projects-heading" className="text-[28px] font-semibold tracking-[-0.03em] text-[#342d27] md:text-[36px] dark:text-foreground">
                        Проекты
                      </h2>
                      <div
                        className="mt-4 flex min-w-0 max-w-full touch-pan-x items-center gap-3 overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:gap-5"
                        role="tablist"
                        aria-label={`Тип проектов ${maker.name}`}
                      >
                        {manufacturerProjectTabs.map((type) => {
                          const label = manufacturerProjectTabLabels[type];
                          const count = projectsByType[type].length;
                          const isActive = activeManufacturerProjectType === type;
                          return (
                            <button
                              key={type}
                              id={`manufacturer-projects-${type}-tab`}
                              type="button"
                              role="tab"
                              aria-selected={isActive}
                              aria-controls="manufacturer-projects-panel"
                              onClick={() => setManufacturerProjectType(type)}
                              className="manufacturer-section-tab group flex min-h-11 shrink-0 items-center gap-2 text-[20px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-4"
                            >
                              <span>{label}</span>
                              <span
                                className="tabular-nums opacity-65 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                                aria-label={`Количество: ${count}`}
                              >
                                {count.toLocaleString("ru-RU")}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </>
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
                  role={groupedProjects ? "tabpanel" : undefined}
                  aria-labelledby={groupedProjects ? `manufacturer-projects-${activeManufacturerProjectType}-tab` : undefined}
                >
                  {isFeaturedVisualView ? (
                    <>
                      {visibleMakerProjects[0] && (
                        <div className="[&_h3]:!text-[19px] md:[&_h3]:!text-[23px]">
                          <ProjectCard
                            projectId={visibleMakerProjects[0].id}
                            height="aspect-[16/9] h-auto md:aspect-[21/9]"
                            headingLevel="h3"
                          />
                        </div>
                      )}

                      <div className="mt-6 grid grid-cols-2 gap-x-3 gap-y-6 md:mt-8 md:gap-x-5 md:gap-y-8">
                        {visibleMakerProjects.slice(1).map((project) => (
                          <ProjectCard
                            key={project.id}
                            projectId={project.id}
                            height="aspect-[4/3] h-auto md:aspect-[5/4]"
                            headingLevel="h3"
                          />
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="grid grid-cols-2 gap-x-[2px] gap-y-6 md:gap-x-4 md:gap-y-8">
                      {visibleMakerProjects.map((project) => (
                      <ProjectCard
                        key={project.id}
                        projectId={project.id}
                        height="aspect-[4/3] h-auto md:aspect-[5/4]"
                        headingLevel="h3"
                      />
                      ))}
                    </div>
                  )}
                </div>
              </section>

              {isAnalyticalView && (legal && profile?.sourceAudit?.legal.status === "imported" ? (
                <ManufacturerLegalOverview
                  legal={legal}
                  compact
                  manufacturerName={maker.name}
                  builtObjectsCount={builtObjects.length}
                  reviewsLabel={profileReviewSummary.reviewsLabel}
                />
              ) : hasCanonicalProfile ? (
                <ManufacturerUnavailableSection
                  id="legal"
                  heading="Юридическая информация"
                  title={profile?.sourceAudit?.legal.status === "not-found" ? "Реквизиты не найдены" : "Реквизиты уточняются"}
                  description={profile?.sourceAudit?.legal.status === "not-found"
                    ? "Подтверждённые юридические сведения о компании пока не опубликованы на «Много места»."
                    : "Юридические сведения появятся после подтверждения связи бренда с ИП или ООО."}
                  checkedAtIso={profile?.sourceAudit?.checkedAtIso}
                />
              ) : null)}

              {builtObjects.length > 0 ? (
                <section
                  id="built-objects"
                  className="mt-16 scroll-mt-28 md:mt-24"
                  aria-labelledby="manufacturer-built-objects-heading"
                >
                  <h2
                    id="manufacturer-built-objects-heading"
                    className="mb-7 min-w-0 text-[25px] font-semibold leading-[1.05] tracking-[-0.03em] text-[#342d27] sm:text-[28px] md:text-[36px] dark:text-foreground"
                  >
                    <span>Выполненные </span>
                    <span className="inline-flex items-baseline gap-2 whitespace-nowrap align-baseline md:gap-3">
                      <span>объекты</span>
                      <span
                        className="tabular-nums text-[#746f6a] dark:text-foreground/65"
                        aria-label={`Количество выполненных объектов: ${builtObjects.length}`}
                      >
                        {builtObjects.length.toLocaleString("ru-RU")}
                      </span>
                    </span>
                  </h2>

                  <ManufacturerBuiltObjectsGallery manufacturerName={maker.name} objects={builtObjects} compact={isAnalyticalView} />
                </section>
              ) : hasCanonicalProfile ? (
                <ManufacturerUnavailableSection
                  id="built-objects"
                  heading="Выполненные объекты"
                  title={profile?.sourceAudit?.builtObjects.status === "not-found" ? "Фотографии объектов не найдены" : "Галерея пока не опубликована"}
                  description="Подтверждённые фотографии выполненных объектов пока не опубликованы на «Много места»."
                  checkedAtIso={profile?.sourceAudit?.checkedAtIso}
                />
              ) : null}

              {(mapEmbedUrl || hasCanonicalProfile) && <section id="production" className="mt-16 scroll-mt-28 md:mt-24" aria-labelledby="manufacturer-production-heading">
                <div>
                  <h2 id="manufacturer-production-heading" className="text-[28px] font-semibold tracking-[-0.03em] text-[#342d27] md:text-[36px] dark:text-foreground">{mapHeading}</h2>
                  {maker.productionAddress && (
                    <a href={yandexMapLink} target="_blank" rel="noopener noreferrer nofollow" className="mt-3 inline-flex min-h-11 items-center text-[14px] leading-relaxed text-[#595653] transition-colors hover:text-primary focus-visible:rounded-[var(--radius)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 md:text-[15px] dark:text-muted-foreground">
                      <span>{maker.productionAddress}</span>
                    </a>
                  )}
                </div>

                {mapEmbedUrl ? (
                  <div className="relative mt-7 min-h-[320px] overflow-hidden rounded-[var(--radius)] md:min-h-[440px]">
                    <ExternalIframe
                      src={mapEmbedUrl}
                      title={mapFrameTitle}
                      className="absolute inset-0 h-full w-full border-0"
                    />
                  </div>
                ) : (
                  <ManufacturerEmptyState
                    title={`${mapSectionLabel} пока не ${profile?.mapKind === "office" ? "указан" : "указано"} на карте`}
                    description="Адрес или координаты пока не подтверждены."
                  />
                )}
              </section>}

              <section id="reviews" className="mt-16 scroll-mt-28 md:mt-24" aria-labelledby="manufacturer-reviews-heading">
                <div className={`grid gap-6 ${profileReviewSummary.hasReviews ? "md:grid-cols-[minmax(0,1fr)_auto] md:items-center" : ""}`}>
                  <div>
                    <h2 id="manufacturer-reviews-heading" className="text-[28px] font-semibold leading-[1.05] tracking-[-0.03em] text-[#342d27] md:text-[36px] dark:text-foreground">
                      {profile?.namePrepositional ? (
                        <>
                          <span>Отзывы о </span>
                          <span className="inline-flex items-baseline gap-2 whitespace-nowrap align-baseline md:gap-3">
                            <span>{profile.namePrepositional}</span>
                            <span
                              className="tabular-nums text-[#746f6a] dark:text-foreground/65"
                              aria-label={`Количество отзывов: ${profileReviewSummary.totalCount}`}
                            >
                              {profileReviewSummary.totalCount.toLocaleString("ru-RU")}
                            </span>
                          </span>
                        </>
                      ) : (
                        <>Отзывы о {maker.name}</>
                      )}
                    </h2>
                  </div>
                  {profileReviewSummary.hasReviews && (
                    <div className="min-w-0 md:min-w-[330px]" aria-label={`Средняя оценка производителя ${profileReviewSummary.rating.toFixed(1)} из 5, ${profileReviewSummary.reviewsLabel}`}>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 md:justify-end">
                        <div className="text-[38px] font-semibold leading-none tabular-nums text-[#342d27] md:text-[42px] dark:text-foreground">
                          {profileReviewSummary.rating.toFixed(1).replace(".", ",")}
                        </div>
                        <div className="flex items-center gap-1" aria-hidden>
                          {Array.from({ length: 5 }, (_, index) => (
                            <Star key={index} className={`h-[19px] w-[19px] ${index < Math.round(profileReviewSummary.rating) ? "fill-primary text-primary" : "text-[#c5cbd8]"}`} strokeWidth={1.4} />
                          ))}
                        </div>
                        <p className="text-[14px] text-[#717b8e]">{profileReviewSummary.reviewsLabel}</p>
                      </div>
                    </div>
                  )}
                </div>

                {hasCanonicalProfile ? (
                  <ManufacturerReviewSources
                    makerId={makerId}
                    makerName={maker.name}
                    makerNamePrepositional={profile?.namePrepositional ?? maker.name}
                    source={manufacturerReviewSource}
                    onSourceChange={setManufacturerReviewSource}
                    hasExternalRating={Boolean(maker.externalRating)}
                    auditStatus={profile?.sourceAudit?.reviews.status}
                    reviewSummary={reviewSummary}
                    reviewPreviews={reviewPreviews}
                  />
                ) : maker.externalRating ? (
                  <div className="mt-7">
                    <div
                      className="flex min-w-0 max-w-full touch-pan-x items-center gap-5 overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                      role="tablist"
                      aria-label={`Источник отзывов о ${profile?.namePrepositional ?? maker.name}`}
                    >
                      {([
                        ["yandex", "Яндекс"],
                        ["mnogomesta", "Много места"],
                      ] as const).map(([source, label]) => {
                        const isActive = manufacturerReviewSource === source;
                        return (
                          <button
                            key={source}
                            id={`manufacturer-reviews-${source}-tab`}
                            type="button"
                            role="tab"
                            aria-selected={isActive}
                            aria-controls={`manufacturer-reviews-${source}-panel`}
                            onClick={() => setManufacturerReviewSource(source)}
                            className="manufacturer-section-tab min-h-11 shrink-0 text-[20px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-4"
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>

                    {manufacturerReviewSource === "yandex" ? (
                      <div
                        id="manufacturer-reviews-yandex-panel"
                        role="tabpanel"
                        aria-labelledby="manufacturer-reviews-yandex-tab"
                      >
                          <ManufacturerYandexReviews
                            makerId={makerId}
                            makerName={maker.name}
                            makerNamePrepositional={profile?.namePrepositional ?? maker.name}
                          />
                      </div>
                    ) : (
                      <div
                        id="manufacturer-reviews-mnogomesta-panel"
                        role="tabpanel"
                        aria-labelledby="manufacturer-reviews-mnogomesta-tab"
                        className="mt-5 flex min-h-[240px] flex-col items-center justify-center rounded-[var(--radius)] bg-secondary px-5 py-8 text-center"
                      >
                        <Star className="h-9 w-9 text-[#aab2c2]" strokeWidth={1.5} aria-hidden />
                        <h3 className="mt-5 text-[21px] font-semibold text-[#342d27] dark:text-foreground">Отзывов на «Много места» пока нет</h3>
                        <p className="mt-2 max-w-[470px] text-[14px] leading-relaxed text-[#717b8e]">Станьте первым, кто поделится опытом работы с компанией. Отзыв появится после проверки.</p>
                        <Link to="/messages/support" className="mt-5 inline-flex min-h-11 items-center justify-center rounded-[var(--radius)] bg-primary px-5 text-[14px] font-medium text-white transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                          Оставить отзыв
                        </Link>
                      </div>
                    )}
                  </div>
                ) : reviewSummary.hasReviews ? (
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

              {(hasSocialMedia || hasCanonicalProfile) && (
                <section
                  id="social-media"
                  className="mt-16 scroll-mt-28 md:mt-24"
                  aria-labelledby="manufacturer-social-heading"
                >
                  <h2
                    id="manufacturer-social-heading"
                    className="text-[28px] font-semibold leading-[1.05] tracking-[-0.03em] text-[#342d27] md:text-[36px] dark:text-foreground"
                  >
                    {maker.name} в социальных сетях
                  </h2>
                  <ManufacturerSocialMedia
                    manufacturerName={maker.name}
                    social={social}
                    sourceAudit={profile?.sourceAudit?.social}
                    keepCanonicalSources={hasCanonicalProfile}
                  />
                </section>
              )}

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
            {otherRegionProjectsCount > 0 && (
              <section className="mt-12 md:mt-16" aria-labelledby="related-region-projects-heading">
                <h2 id="related-region-projects-heading" className="text-[28px] font-semibold tracking-[-0.03em] text-[#342d27] md:text-[36px] dark:text-foreground">
                  <Link
                    to={regionProjectsHref}
                    className="group inline transition-colors hover:text-primary focus-visible:rounded-[var(--radius)] focus-visible:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                  >
                    <TrailingChevronLabel text={`Другие проекты ${cityPrepositionalName}`} />
                  </Link>
                </h2>
                <div className="mt-7">
                  <OtherProjectsFeed
                    deliveryRegion={cityLabel}
                    productType="all"
                    excludeManufacturerId={makerId}
                  />
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
                    className="group inline min-h-11 text-[#342d27] transition-colors hover:text-primary focus-visible:rounded-[var(--radius)] focus-visible:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 dark:text-foreground"
                  >
                    <TrailingChevronLabel text={`Все производители ${cityPrepositionalName}`} />
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
                        <ManufacturerLogo manufacturer={candidate} className="h-11 w-11 text-[10px]" />
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
