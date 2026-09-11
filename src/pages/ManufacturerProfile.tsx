import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { ChevronDown, ChevronLeft, ChevronRight, Flag, Forward, Heart, Play, Star, X } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ManufacturerName from "@/components/ManufacturerName";
import ManufacturerReportDialog from "@/components/ManufacturerReportDialog";
import ProjectCard from "@/components/ProjectCard";
import Seo from "@/components/Seo";
import SiteBreadcrumbs, { siteBreadcrumbPageContainerClassName } from "@/components/SiteBreadcrumbs";
import VerifiedBadge from "@/components/VerifiedBadge";
import TrailingChevronLabel from "@/components/TrailingChevronLabel";
import NotFound from "@/pages/NotFound";
import { useFavorites } from "@/contexts/FavoritesContext";
import { makersById, projects, projectsCountByMakerId } from "@/data/projects";
import { getManufacturerRatingSummary } from "@/data/manufacturerRatings";
import { getPartnerReviews, getPartnerReviewSummary } from "@/data/partnerReviews";
import { compareProjectTechnologyPriority } from "@/lib/projectPriority";
import { getCityDisplayName, getCityPrepositionalName, isSameCityRegion } from "@/lib/cityDisplay";
import { getManufacturerMapUrls } from "@/lib/manufacturerMap";
import { buildManufacturerSeo } from "@/lib/pageSeo";
import { buildCanonicalUrl } from "@/lib/seo";
import { isVerifiedMaker } from "@/lib/verifiedMakers";
import {
  CATALOG_PATH,
  MANUFACTURERS_PATH,
  getManufacturerPath,
  getManufacturerReviewsPath,
} from "@/lib/siteRoutes";

const LEGACY_PARTNER_IDS: Record<string, string> = { "1": "platforma" };
const PLATFORMA_YANDEX_REVIEWS_URL = "https://yandex.ru/maps-reviews-widget/91516424053?comments";
const PLATFORMA_REVIEW_COUNT = 5;
const PLATFORMA_LEGAL_DETAILS = {
  legalName: "ООО «Платформа. Модульное производство»",
  status: "Действует",
  registeredAt: "15 марта 2024",
  inn: "6678135856",
  kpp: "667801001",
  ogrn: "1246600012581",
  legalAddress: "620027, Свердловская область, г. Екатеринбург, ул. Азина, стр. 22/5",
  director: "Тореев Михаил Вячеславович",
  mainActivity: "Строительство жилых и нежилых зданий",
  shareCapital: "10 000 ₽",
  revenue: "54,3 млн ₽",
  netProfit: "622 тыс. ₽",
  reportingYear: "2025",
  arbitrationCases: "Не найдено",
  enforcementProceedings: "Не найдено",
  unfairSuppliersRegistry: "Не числится",
  checkedAt: "9 сентября 2026",
} as const;
const PLATFORMA_YOUTUBE_VIDEOS = [
  {
    id: "Fn4egeR53y0",
    title: "Модульные дома и бани с доставкой по Свердловской области",
    publishedLabel: "1 сентября 2026",
    thumbnail: "https://i3.ytimg.com/vi/Fn4egeR53y0/hqdefault.jpg",
  },
  {
    id: "Z31Y_icFwlY",
    title: "Модульные дома и бани с доставкой по Свердловской области",
    publishedLabel: "27 августа 2026",
    thumbnail: "https://i3.ytimg.com/vi/Z31Y_icFwlY/hqdefault.jpg",
  },
  {
    id: "0ieKu8aZ5HE",
    title: "Строительство модульных домов",
    publishedLabel: "25 августа 2026",
    thumbnail: "https://i1.ytimg.com/vi/0ieKu8aZ5HE/hqdefault.jpg",
  },
  {
    id: "VHd30kYPzWo",
    title: "Утепление модульного дома",
    publishedLabel: "15 июня 2026",
    thumbnail: "https://i.ytimg.com/vi/VHd30kYPzWo/hqdefault.jpg",
  },
  {
    id: "4F9vveTBe6o",
    title: "Модульные дома и бани с доставкой по Свердловской области",
    publishedLabel: "11 июня 2026",
    thumbnail: "https://i.ytimg.com/vi/4F9vveTBe6o/hqdefault.jpg",
  },
  {
    id: "lfCYqqVPseA",
    title: "Доставка модульных домов и бань по Свердловской области",
    publishedLabel: "8 июня 2026",
    thumbnail: "https://i.ytimg.com/vi/lfCYqqVPseA/hqdefault.jpg",
  },
] as const;
const PLATFORMA_TELEGRAM_POSTS = [328, 327, 326] as const;
const PLATFORMA_BUILT_OBJECTS = [
  "https://static.tildacdn.com/tild6166-3162-4838-a431-356364366566/1-1-2.jpg",
  "https://static.tildacdn.com/tild3138-6132-4432-b135-613932376132/2.jpg",
  "https://static.tildacdn.com/tild3737-3530-4232-b165-333361393133/_WhatsApp_2025-08-25.jpg",
  "https://static.tildacdn.com/tild3831-6530-4436-b735-383638373361/IMG_36156.png",
  "https://static.tildacdn.com/tild3536-6631-4763-b331-313533316432/IMG_36891.png",
  "https://static.tildacdn.com/tild6532-3666-4530-b163-613231626261/IMG_36771.png",
  "https://static.tildacdn.com/tild6233-3936-4936-a139-366463633436/1.jpg",
  "https://static.tildacdn.com/tild3037-3063-4261-b231-383361623861/2.jpg",
  "https://static.tildacdn.com/tild6537-6338-4238-b964-303639393561/IMG-20250830-WA00231.jpg",
  "https://static.tildacdn.com/tild3934-3165-4938-a538-386665393836/6.jpg",
  "https://static.tildacdn.com/tild3461-3734-4238-a661-666331393539/7.jpg",
] as const;
const MAP_COORDINATES_BY_MAKER_ID: Record<string, { lat: number; lon: number }> = {
  bygge: { lat: 56.7923281, lon: 60.7321339 },
  elmaco: { lat: 59.995471, lon: 30.249177 },
  modom: { lat: 60.11911, lon: 30.349878 },
  platforma: { lat: 56.89275, lon: 60.783923 },
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

const PlatformaYandexReviews = () => {
  return (
    <div className="mt-5 w-full">
      <div
        id="platforma-external-reviews-panel"
        className="reviews-scroll h-[500px] overflow-y-scroll overscroll-contain rounded-[var(--radius)] border border-[#dfe5f5] bg-[#f3f1ed] dark:border-border"
        role="region"
        aria-label="Отзывы о Платформе на Яндекс Картах. Прокручиваемая область"
        tabIndex={0}
      >
        <iframe
          src={PLATFORMA_YANDEX_REVIEWS_URL}
          title="Официальный виджет отзывов о Платформе на Яндекс Картах"
          className="mx-auto block h-[1280px] w-full min-w-[300px] max-w-[760px] border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
};

const TelegramPostEmbed = ({ postId, enabled, dark }: { postId: number; enabled: boolean; dark: boolean }) => {
  const embedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = embedRef.current;
    if (!container || !enabled) return;

    container.replaceChildren();
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.dataset.telegramPost = `PlatformaModul/${postId}`;
    script.dataset.width = "100%";
    script.dataset.color = "3C71EC";
    if (dark) script.dataset.dark = "1";
    container.appendChild(script);

    return () => container.replaceChildren();
  }, [dark, enabled, postId]);

  return <div ref={embedRef} className="min-h-[180px] w-full [&>iframe]:!max-w-none" />;
};

const PlatformaTelegramPosts = () => {
  const { resolvedTheme } = useTheme();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (!("IntersectionObserver" in window)) {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShouldLoad(true);
        observer.disconnect();
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={sectionRef} className="mt-5 w-full">
      <div
        className="reviews-scroll h-[640px] overflow-y-auto overscroll-contain rounded-[var(--radius)] border border-border bg-secondary/40 px-2 py-4 sm:px-4"
        role="region"
        aria-label="Публикации Платформы в Telegram. Прокручиваемая область"
        tabIndex={0}
      >
        <div className="mx-auto w-full max-w-[500px] space-y-4">
          {shouldLoad ? (
            PLATFORMA_TELEGRAM_POSTS.map((postId) => (
              <TelegramPostEmbed
                key={postId}
                postId={postId}
                enabled={shouldLoad}
                dark={resolvedTheme === "dark"}
              />
            ))
          ) : (
            <div className="space-y-4" aria-label="Загрузка публикаций">
              {PLATFORMA_TELEGRAM_POSTS.map((postId) => (
                <div key={postId} className="h-[420px] animate-pulse rounded-[var(--radius)] bg-muted motion-reduce:animate-none" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const PlatformaYouTubePosts = () => {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  return (
    <div className="mt-5 flex w-full min-w-0 max-w-full snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-2 md:gap-4 md:overflow-visible md:pb-0">
      {PLATFORMA_YOUTUBE_VIDEOS.map((video) => {
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
                    alt=""
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

const PlatformaSocialMedia = () => {
  const [source, setSource] = useState<"youtube" | "telegram">("youtube");

  return (
    <div className="mt-7">
      <div
        className="flex min-w-0 max-w-full touch-pan-x items-center gap-5 overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="tablist"
        aria-label="Социальные сети Платформы"
      >
        {([
          ["youtube", "YouTube"],
          ["telegram", "Telegram"],
        ] as const).map(([itemSource, label]) => {
          const isActive = source === itemSource;
          return (
            <button
              key={itemSource}
              id={`platforma-social-${itemSource}-tab`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`platforma-social-${itemSource}-panel`}
              onClick={() => setSource(itemSource)}
              className="manufacturer-section-tab min-h-11 shrink-0 text-[20px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-4"
            >
              {label}
            </button>
          );
        })}
      </div>

      {source === "youtube" ? (
        <div
          id="platforma-social-youtube-panel"
          role="tabpanel"
          aria-labelledby="platforma-social-youtube-tab"
        >
          <PlatformaYouTubePosts />
        </div>
      ) : (
        <div
          id="platforma-social-telegram-panel"
          role="tabpanel"
          aria-labelledby="platforma-social-telegram-tab"
        >
          <PlatformaTelegramPosts />
        </div>
      )}
    </div>
  );
};

const PlatformaLegalOverview = ({ compact = false }: { compact?: boolean }) => {
  const [expanded, setExpanded] = useState(!compact);
  const financialMetrics = [
    ["Выручка", PLATFORMA_LEGAL_DETAILS.revenue],
    ["Чистая прибыль", PLATFORMA_LEGAL_DETAILS.netProfit],
  ] as const;
  const registryChecks = [
    ["Арбитражные дела", PLATFORMA_LEGAL_DETAILS.arbitrationCases],
    ["Исполнительные производства", PLATFORMA_LEGAL_DETAILS.enforcementProceedings],
    ["Реестр недобросовестных поставщиков", PLATFORMA_LEGAL_DETAILS.unfairSuppliersRegistry],
  ] as const;

  return (
    <section id="legal" className="mt-16 scroll-mt-28 md:mt-24" aria-labelledby="manufacturer-legal-heading">
      <h2
        id="manufacturer-legal-heading"
        className="text-[28px] font-semibold tracking-[-0.03em] text-[#342d27] md:text-[36px] dark:text-foreground"
      >
        Юридическая информация
      </h2>

      <div className="mt-7 rounded-[var(--radius)] border border-border bg-card px-5 py-6 md:px-7 md:py-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
          <div className="min-w-0">
            <p className="text-[18px] font-semibold leading-snug text-[#342d27] md:text-[20px] dark:text-foreground">
              {PLATFORMA_LEGAL_DETAILS.legalName}
            </p>
            <p className="mt-2 max-w-[680px] text-[14px] leading-relaxed text-[#717b8e]">
              {PLATFORMA_LEGAL_DETAILS.legalAddress}
            </p>
          </div>
          <span className="inline-flex min-h-8 w-fit shrink-0 items-center rounded-[var(--radius)] bg-primary/10 px-3 text-[13px] font-semibold text-primary">
            {PLATFORMA_LEGAL_DETAILS.status}
          </span>
        </div>

        <div className="mt-6 grid gap-7 border-t border-border pt-6 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] md:gap-10">
          <div>
            <p className="text-[13px] text-[#717b8e]">Финансовые показатели за {PLATFORMA_LEGAL_DETAILS.reportingYear} год</p>
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
          </div>

          <dl className={expanded ? "grid grid-cols-2 gap-x-5 gap-y-5" : "hidden"}>
            <div>
              <dt className="text-[13px] text-[#717b8e]">Дата регистрации</dt>
              <dd className="mt-1.5 text-[15px] font-semibold text-[#342d27] dark:text-foreground">{PLATFORMA_LEGAL_DETAILS.registeredAt}</dd>
            </div>
            <div>
              <dt className="text-[13px] text-[#717b8e]">Уставный капитал</dt>
              <dd className="mt-1.5 text-[15px] font-semibold tabular-nums text-[#342d27] dark:text-foreground">{PLATFORMA_LEGAL_DETAILS.shareCapital}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-[13px] text-[#717b8e]">Руководитель</dt>
              <dd className="mt-1.5 text-[15px] font-semibold text-[#342d27] dark:text-foreground">{PLATFORMA_LEGAL_DETAILS.director}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-[13px] text-[#717b8e]">Основной вид деятельности</dt>
              <dd className="mt-1.5 text-[15px] font-semibold leading-snug text-[#342d27] dark:text-foreground">{PLATFORMA_LEGAL_DETAILS.mainActivity}</dd>
            </div>
          </dl>
        </div>

        <dl className="mt-6 grid gap-x-7 gap-y-4 border-t border-border pt-6 sm:grid-cols-3">
          {registryChecks.map(([label, value]) => (
            <div key={label} className="flex items-start justify-between gap-5 sm:block">
              <dt className="max-w-[230px] text-[13px] leading-snug text-[#717b8e]">{label}</dt>
              <dd className="shrink-0 text-[14px] font-semibold text-[#342d27] sm:mt-2 dark:text-foreground">{value}</dd>
            </div>
          ))}
        </dl>

        <dl className={expanded ? "mt-6 grid gap-x-7 gap-y-4 border-t border-border pt-6 sm:grid-cols-2 lg:grid-cols-3" : "hidden"}>
          <div>
            <dt className="text-[13px] text-[#717b8e]">ИНН</dt>
            <dd className="mt-1.5 text-[14px] font-medium tabular-nums text-[#342d27] dark:text-foreground">{PLATFORMA_LEGAL_DETAILS.inn}</dd>
          </div>
          <div>
            <dt className="text-[13px] text-[#717b8e]">КПП</dt>
            <dd className="mt-1.5 text-[14px] font-medium tabular-nums text-[#342d27] dark:text-foreground">{PLATFORMA_LEGAL_DETAILS.kpp}</dd>
          </div>
          <div>
            <dt className="text-[13px] text-[#717b8e]">ОГРН</dt>
            <dd className="mt-1.5 text-[14px] font-medium tabular-nums text-[#342d27] dark:text-foreground">{PLATFORMA_LEGAL_DETAILS.ogrn}</dd>
          </div>
        </dl>

        {compact && (
          <button
            type="button"
            onClick={() => setExpanded((current) => !current)}
            className="mt-5 inline-flex min-h-11 items-center gap-1 text-[15px] font-medium text-[#342d27] transition-colors hover:text-primary focus-visible:rounded-[var(--radius)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 dark:text-foreground dark:hover:text-primary"
            aria-expanded={expanded}
          >
            {expanded ? "Скрыть реквизиты" : "Все реквизиты"}
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 motion-reduce:transition-none ${expanded ? "rotate-180" : ""}`}
              strokeWidth={1.8}
              aria-hidden
            />
          </button>
        )}

        <p className="mt-5 text-[12px] leading-relaxed text-[#717b8e]">
          Сведения из открытых государственных реестров. Последняя ручная проверка: {PLATFORMA_LEGAL_DETAILS.checkedAt}.
        </p>
      </div>
    </section>
  );
};

const PlatformaBuiltObjectsGallery = ({ compact = false }: { compact?: boolean }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(!compact);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number | null>(null);
  const isOpen = activeIndex !== null;
  const imageCount = PLATFORMA_BUILT_OBJECTS.length;

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
      image.src = PLATFORMA_BUILT_OBJECTS[index];
    });
  }, [activeIndex, imageCount]);

  return (
    <>
      <div className="grid grid-cols-2 gap-x-[2px] gap-y-6 md:gap-x-4 md:gap-y-8">
        {PLATFORMA_BUILT_OBJECTS.slice(0, showAll ? imageCount : 6).map((image, index) => (
          <button
            key={image}
            type="button"
            onClick={() => setActiveIndex(index)}
            className="group aspect-[4/3] min-w-0 cursor-zoom-in overflow-hidden rounded-[var(--radius)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 md:aspect-[5/4]"
            aria-label={`Открыть выполненный объект ${index + 1} из ${imageCount}`}
            aria-haspopup="dialog"
          >
            <img
              src={image}
              alt={`Выполненный объект компании «Платформа», фото ${index + 1}`}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.015] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              loading="lazy"
              decoding="async"
            />
          </button>
        ))}
      </div>

      {compact && !showAll && (
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
            src={PLATFORMA_BUILT_OBJECTS[activeIndex]}
            alt={`Выполненный объект компании «Платформа», фото ${activeIndex + 1}`}
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
}: {
  showBuiltObjects: boolean;
  showLegal: boolean;
  showProduction: boolean;
  showSocialMedia: boolean;
  vertical?: boolean;
  projectsBeforeLegal?: boolean;
  embedded?: boolean;
}) => {
  const items = useMemo(() => [
    { id: "about", label: "О компании" },
    ...(projectsBeforeLegal ? [{ id: "projects", label: "Проекты" }] : []),
    ...(showLegal ? [{ id: "legal", label: "Юридическая информация" }] : []),
    ...(!projectsBeforeLegal ? [{ id: "projects", label: "Проекты" }] : []),
    ...(showBuiltObjects ? [{ id: "built-objects", label: "Объекты" }] : []),
    ...(showProduction ? [{ id: "production", label: "Производство" }] : []),
    { id: "reviews", label: "Отзывы" },
    ...(showSocialMedia ? [{ id: "social-media", label: "Соцсети" }] : []),
  ], [projectsBeforeLegal, showBuiltObjects, showLegal, showProduction, showSocialMedia]);
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
          ? "flex h-full max-w-full touch-pan-x items-center gap-7 overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
                  ? `inline-flex h-11 shrink-0 items-center whitespace-nowrap text-[14px] font-medium tracking-normal transition-colors hover:text-primary focus-visible:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${isActive ? "text-primary" : "text-[#342d27]/90 dark:text-white/85"}`
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
  const [platformaProjectType, setPlatformaProjectType] = useState<"houses" | "baths" | "business">("houses");
  const [platformaReviewSource, setPlatformaReviewSource] = useState<"yandex" | "mnogomesta">("yandex");
  const [aboutExpanded, setAboutExpanded] = useState(false);
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

  useEffect(() => {
    setAboutExpanded(false);
  }, [makerId]);

  if (!maker || makerProjects.length === 0) return <NotFound />;

  const reviewSummary = getPartnerReviewSummary(makerId);
  const profileReviewSummary = makerId === "platforma"
    ? { hasReviews: true, rating: 4.3, reviewsLabel: `${PLATFORMA_REVIEW_COUNT} отзывов` }
    : reviewSummary;
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
  const mapCoordinates = MAP_COORDINATES_BY_MAKER_ID[makerId];
  const { embedUrl: mapEmbedUrl, externalUrl: yandexMapLink } = getManufacturerMapUrls({
    address: maker.productionAddress,
    city: cityLabel,
    coordinates: mapCoordinates,
  });
  const about = ABOUT_BY_MAKER_ID[makerId]
    ?? `${maker.name} — производитель домов из ${cityLabel}. На странице собраны проекты компании, доступные в каталоге многоместа.рф.`;
  const profileIntro = makerId === "platforma"
    ? "Модульные дома и бани для круглогодичного проживания, отдыха и бизнеса."
    : about;
  const aboutParagraphs = makerId === "platforma"
    ? [
        "«Платформа» — производитель модульных домов и бань из Екатеринбурга. Компания создаёт решения для круглогодичного проживания, загородного отдыха и бизнеса, совмещая заводскую сборку модулей с адаптацией архитектуры под участок и задачи будущего владельца.",
        `В каталоге «Много места» представлено ${makerProjects.length.toLocaleString("ru-RU")} ${wordForm(makerProjects.length, ["проект", "проекта", "проектов"])} площадью ${areaRange} с ценами от ${minPriceLabel}. Среди них — компактные и семейные модульные дома, барнхаусы, готовые бани и решения для коммерческого размещения. Планировку, фасад, комплектацию и дополнительные опции производитель может уточнить под конкретный сценарий использования.`,
        "Модули собирают в двух тёплых производственных цехах в Березовском. После выбора проекта и согласования комплектации компания производит конструкции, организует доставку на участок, монтаж на фундаменте и подключение предусмотренных инженерных систем.",
        "На странице производителя собраны проекты с ценами и характеристиками, фотографии выполненных объектов, расположение производства и отзывы покупателей с Яндекс Карт. Это позволяет сравнить модели «Платформы» и проверить основную информацию о компании до перехода на её официальный сайт.",
      ]
    : [about];
  const heroImage = makerProjects[0]?.gallery[0]?.image;
  const manufacturerSeo = buildManufacturerSeo({
    name: maker.name,
    city: cityLabel,
    projectCount: makerProjects.length,
    hasReviews: reviewSummary.hasReviews,
  });
  const requestedPlatformaView = new URLSearchParams(location.search).get("view");
  const isPlatformaVisualView = makerId === "platforma"
    && requestedPlatformaView !== "classic"
    && requestedPlatformaView !== "analytic";
  const isPlatformaLegacyAnalyticalView = makerId === "platforma" && requestedPlatformaView === "analytic";
  const isPlatformaAnalyticalView = isPlatformaVisualView || isPlatformaLegacyAnalyticalView;

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
  const regionProjectsHref = `${CATALOG_PATH}?region=${encodeURIComponent(cityLabel)}`;
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
    ...(makerId === "platforma" ? {
      legalName: PLATFORMA_LEGAL_DETAILS.legalName,
      taxID: PLATFORMA_LEGAL_DETAILS.inn,
    } : {}),
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
        jsonLd={[organizationJsonLd, breadcrumbJsonLd]}
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

          {isPlatformaAnalyticalView && (
            <section
              className={isPlatformaVisualView
                ? "mb-7 pb-8 md:mb-0 md:pb-10"
                : "mb-10 border-y border-border py-7 md:mb-14 md:py-10"}
              aria-labelledby="platforma-profile-title"
            >
              <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end lg:gap-12">
                <div className="min-w-0">
                  <div className="flex items-start gap-4 md:gap-6">
                    <div className={`flex h-[76px] w-[76px] shrink-0 items-center justify-center overflow-hidden rounded-[var(--radius)] border border-border text-[16px] font-semibold text-[#342d27] md:h-24 md:w-24 ${usesDarkLogoBackground(makerId) ? "bg-[#342d27]" : "bg-white"}`}>
                      {maker.logo ? (
                        <img src={maker.logo} alt="" className="h-full w-full object-contain p-2.5" loading="eager" decoding="async" />
                      ) : (
                        maker.initials
                      )}
                    </div>
                    <div className="min-w-0 pt-0.5">
                      <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2">
                        <h1 id="platforma-profile-title" className="min-w-0 text-[34px] font-semibold leading-[0.96] tracking-[-0.045em] text-[#342d27] md:text-[52px] dark:text-foreground">
                          {maker.name}
                        </h1>
                        {verified && <VerifiedBadge />}
                      </div>
                      <p className="mt-2 text-[14px] text-[#717b8e]">Модульное производство · {cityLabel}</p>
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

              {!isPlatformaVisualView && (
                <dl className="mt-8 grid grid-cols-2 gap-x-5 gap-y-6 border-t border-border pt-7 sm:grid-cols-3 lg:grid-cols-6 lg:gap-x-7">
                  {([
                    ["Проекты", makerProjects.length.toLocaleString("ru-RU")],
                    ["Цена от", minPriceLabel],
                    ["Площадь", areaRange],
                    ["Выполнено", PLATFORMA_BUILT_OBJECTS.length.toLocaleString("ru-RU")],
                    ["Срок производства", "до 60 дней"],
                    ["Доставка", "до 150 км"],
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

          {isPlatformaVisualView && (
            <div className="sticky top-[51px] z-40 -mx-4 mb-10 bg-background px-4 sm:-mx-6 sm:px-6 md:top-[61px] md:mb-12">
              <ManufacturerSectionNav
                showBuiltObjects
                showLegal
                showProduction={Boolean(mapEmbedUrl)}
                showSocialMedia
                projectsBeforeLegal
                embedded
              />
            </div>
          )}

          <div className={`grid items-start ${isPlatformaVisualView ? "gap-y-5" : "gap-y-10 lg:gap-y-12"} ${isPlatformaLegacyAnalyticalView ? "lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-x-12 xl:grid-cols-[240px_minmax(0,1fr)] xl:gap-x-16" : isPlatformaVisualView ? "grid-cols-1" : "lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-x-14 xl:grid-cols-[330px_minmax(0,1fr)] xl:gap-x-20"}`}>
            {isPlatformaLegacyAnalyticalView && (
              <aside className="sticky top-24 hidden self-start lg:block" aria-label="Навигация и статус данных">
                <p className="mb-3 text-[12px] font-medium text-[#717b8e]">Разделы</p>
                <ManufacturerSectionNav
                  showBuiltObjects
                  showLegal
                  showProduction={Boolean(mapEmbedUrl)}
                  showSocialMedia
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
                      <dd className="mt-1 font-semibold text-[#342d27] dark:text-foreground">{PLATFORMA_LEGAL_DETAILS.checkedAt}</dd>
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

            <aside className={isPlatformaAnalyticalView ? "hidden" : "self-start"} aria-label={`Профиль компании ${maker.name}`}>
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
                  <p className="mt-2 text-[14px] text-[#717b8e]">
                    {makerId === "platforma" ? "Модульная технология" : technologies.join(" · ")} · {cityLabel}
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
                    {makerId === "platforma" ? "Модульная технология" : technologies.join(", ")}
                  </dd>
                </div>
                <div>
                  <dt className="text-[13px] leading-snug text-[#717b8e]">Срок производства</dt>
                  <dd className="mt-1.5 text-[16px] font-semibold text-[#342d27] dark:text-foreground">До 60 дней</dd>
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

            <div className={isPlatformaVisualView ? "min-w-0" : "min-w-0 lg:col-start-2 lg:row-start-1"}>
              {!isPlatformaVisualView && (
                <div className={isPlatformaLegacyAnalyticalView ? "lg:hidden" : undefined}>
                  <ManufacturerSectionNav
                    showBuiltObjects={makerId === "platforma"}
                    showLegal={makerId === "platforma"}
                    showProduction={Boolean(mapEmbedUrl)}
                    showSocialMedia={makerId === "platforma"}
                    projectsBeforeLegal={isPlatformaAnalyticalView}
                  />
                </div>
              )}

              <section id="about" className="scroll-mt-28" aria-labelledby="manufacturer-about-heading">
                <h2 id="manufacturer-about-heading" className="text-[28px] font-semibold tracking-[-0.03em] text-[#342d27] md:text-[36px] dark:text-foreground">
                  {isPlatformaAnalyticalView ? "О платформе" : `Компания «${maker.name}»`}
                </h2>
                <div className="mt-5 max-w-[850px] text-[16px] leading-[1.72] text-[#595653] md:text-[17px] dark:text-muted-foreground">
                  <div id="manufacturer-about-details" className="space-y-4">
                    {aboutParagraphs.map((paragraph, index) => (
                      <p key={paragraph} className={!aboutExpanded && index >= (isPlatformaVisualView ? 1 : 2) ? "hidden" : undefined}>
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

              {makerId === "platforma" && !isPlatformaAnalyticalView && <PlatformaLegalOverview />}
            </div>

            <div className={isPlatformaVisualView ? "min-w-0" : "min-w-0 lg:col-start-2 lg:row-start-2"}>
              <section
                id="projects"
                className="scroll-mt-28"
                aria-labelledby="manufacturer-projects-heading"
              >
                <div className="mb-7">
                  {makerId === "platforma" ? (
                    <>
                      <h2 id="manufacturer-projects-heading" className="text-[28px] font-semibold tracking-[-0.03em] text-[#342d27] md:text-[36px] dark:text-foreground">
                        Проекты
                      </h2>
                      <div
                        className="mt-4 flex min-w-0 max-w-full touch-pan-x items-center gap-3 overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:gap-5"
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
                  role={makerId === "platforma" ? "tabpanel" : undefined}
                  aria-labelledby={makerId === "platforma" ? `manufacturer-projects-${platformaProjectType}-tab` : undefined}
                >
                  {isPlatformaVisualView ? (
                    <>
                      {visibleMakerProjects[0] && (
                        <div className="[&_h2]:!text-[19px] md:[&_h2]:!text-[23px]">
                          <ProjectCard
                            projectId={visibleMakerProjects[0].id}
                            height="aspect-[16/9] h-auto md:aspect-[21/9]"
                          />
                        </div>
                      )}

                      <div className="mt-6 grid grid-cols-2 gap-x-3 gap-y-6 md:mt-8 md:gap-x-5 md:gap-y-8">
                        {visibleMakerProjects.slice(1).map((project) => (
                          <ProjectCard
                            key={project.id}
                            projectId={project.id}
                            height="aspect-[4/3] h-auto md:aspect-[5/4]"
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
                      />
                      ))}
                    </div>
                  )}
                </div>
              </section>

              {makerId === "platforma" && isPlatformaAnalyticalView && <PlatformaLegalOverview compact />}

              {makerId === "platforma" && (
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
                        aria-label={`Количество выполненных объектов: ${PLATFORMA_BUILT_OBJECTS.length}`}
                      >
                        {PLATFORMA_BUILT_OBJECTS.length.toLocaleString("ru-RU")}
                      </span>
                    </span>
                  </h2>

                  <PlatformaBuiltObjectsGallery compact={isPlatformaAnalyticalView} />
                </section>
              )}

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
                    <h2 id="manufacturer-reviews-heading" className="text-[28px] font-semibold leading-[1.05] tracking-[-0.03em] text-[#342d27] md:text-[36px] dark:text-foreground">
                      {makerId === "platforma" ? (
                        <>
                          <span>Отзывы о </span>
                          <span className="inline-flex items-baseline gap-2 whitespace-nowrap align-baseline md:gap-3">
                            <span>Платформе</span>
                            <span
                              className="tabular-nums text-[#746f6a] dark:text-foreground/65"
                              aria-label={`Количество отзывов: ${PLATFORMA_REVIEW_COUNT}`}
                            >
                              {PLATFORMA_REVIEW_COUNT.toLocaleString("ru-RU")}
                            </span>
                          </span>
                        </>
                      ) : (
                        <>Отзывы о {maker.name}</>
                      )}
                    </h2>
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

                {makerId === "platforma" ? (
                  <div className="mt-7">
                    <div
                      className="flex min-w-0 max-w-full touch-pan-x items-center gap-5 overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                      role="tablist"
                      aria-label="Источник отзывов о Платформе"
                    >
                      {([
                        ["yandex", "Яндекс"],
                        ["mnogomesta", "Много места"],
                      ] as const).map(([source, label]) => {
                        const isActive = platformaReviewSource === source;
                        return (
                          <button
                            key={source}
                            id={`platforma-reviews-${source}-tab`}
                            type="button"
                            role="tab"
                            aria-selected={isActive}
                            aria-controls={`platforma-reviews-${source}-panel`}
                            onClick={() => setPlatformaReviewSource(source)}
                            className="manufacturer-section-tab min-h-11 shrink-0 text-[20px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-4"
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>

                    {platformaReviewSource === "yandex" ? (
                      <div
                        id="platforma-reviews-yandex-panel"
                        role="tabpanel"
                        aria-labelledby="platforma-reviews-yandex-tab"
                      >
                        <PlatformaYandexReviews />
                      </div>
                    ) : (
                      <div
                        id="platforma-reviews-mnogomesta-panel"
                        role="tabpanel"
                        aria-labelledby="platforma-reviews-mnogomesta-tab"
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

              {makerId === "platforma" && (
                <section
                  id="social-media"
                  className="mt-16 scroll-mt-28 md:mt-24"
                  aria-labelledby="manufacturer-social-heading"
                >
                  <h2
                    id="manufacturer-social-heading"
                    className="text-[28px] font-semibold leading-[1.05] tracking-[-0.03em] text-[#342d27] md:text-[36px] dark:text-foreground"
                  >
                    Платформа в социальных сетях
                  </h2>
                  <PlatformaSocialMedia />
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
            {otherRegionProjects.length > 0 && (
              <section className="mt-12 md:mt-16" aria-labelledby="related-region-projects-heading">
                <h2 id="related-region-projects-heading" className="text-[28px] font-semibold tracking-[-0.03em] text-[#342d27] md:text-[36px] dark:text-foreground">
                  <Link
                    to={regionProjectsHref}
                    className="group inline transition-colors hover:text-primary focus-visible:rounded-[var(--radius)] focus-visible:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                  >
                    <TrailingChevronLabel text={`Другие проекты ${cityPrepositionalName}`} />
                  </Link>
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
