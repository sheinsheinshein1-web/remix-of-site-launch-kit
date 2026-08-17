import { FormEvent, useEffect, useMemo, useState } from "react";
import { ChevronDown, Flag, Star, ThumbsUp } from "lucide-react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Seo from "@/components/Seo";
import SiteBreadcrumbs, { siteBreadcrumbPageContainerClassName } from "@/components/SiteBreadcrumbs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { makersById, projects } from "@/data/projects";
import { getPartnerReviews, getPartnerReviewSummary } from "@/data/partnerReviews";
import { buildCanonicalUrl } from "@/lib/seo";
import NotFound from "@/pages/NotFound";
import {
  MANUFACTURERS_PATH,
  getManufacturerPath,
  getManufacturerReviewsPath,
  getProjectPath,
} from "@/lib/siteRoutes";

const LEGACY_PARTNER_IDS: Record<string, string> = { "1": "platforma" };

const SORT_OPTIONS = [
  { value: "new", label: "Сначала новые" },
  { value: "old", label: "Сначала старые" },
  { value: "high", label: "С высокой оценкой" },
  { value: "low", label: "С низкой оценкой" },
] as const;

const RATING_OPTIONS = [
  { value: 0, label: "Все оценки" },
  { value: 5, label: "5 звёзд" },
  { value: 4, label: "4 звезды" },
  { value: 3, label: "3 звезды" },
  { value: 2, label: "2 звезды" },
  { value: 1, label: "1 звезда" },
] as const;

const REPORT_REASONS = [
  "Спам или реклама",
  "Оскорбления или запрещённый контент",
  "Недостоверная информация",
  "Опубликованы личные данные",
  "Другое",
] as const;

type SortKey = (typeof SORT_OPTIONS)[number]["value"];

const REVIEW_MONTHS: Record<string, number> = {
  января: 0,
  февраля: 1,
  марта: 2,
  апреля: 3,
  мая: 4,
  июня: 5,
  июля: 6,
  августа: 7,
  сентября: 8,
  октября: 9,
  ноября: 10,
  декабря: 11,
};

const getReviewDateValue = (value: string) => {
  const match = value.toLowerCase().match(/(\d{1,2})\s+([а-яё]+)(?:\s+(\d{4}))?/i);
  if (!match) return 0;
  const month = REVIEW_MONTHS[match[2]];
  if (month === undefined) return 0;
  const year = match[3] ? Number(match[3]) : new Date().getFullYear();
  return new Date(year, month, Number(match[1])).getTime();
};

const Stars = ({ value, size = 18 }: { value: number; size?: number }) => (
  <span className="inline-flex items-center gap-1" aria-label={`Оценка ${value} из 5`}>
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={star <= Math.round(value) ? "fill-primary text-primary" : "fill-[#dfe5f5] text-[#dfe5f5]"}
        style={{ width: size, height: size }}
        strokeWidth={0}
        aria-hidden
      />
    ))}
  </span>
);

const PartnerReviews = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const makerId = id ? LEGACY_PARTNER_IDS[id] ?? id : "platforma";
  const maker = makersById[makerId];
  const canonicalPath = getManufacturerReviewsPath(makerId);
  const makerProjects = useMemo(
    () => projects.filter((project) => project.maker.id === makerId),
    [makerId],
  );
  const reviewTemplates = useMemo(() => getPartnerReviews(makerId), [makerId]);
  const reviewSummary = getPartnerReviewSummary(makerId);

  useEffect(() => {
    if (!maker || location.pathname === canonicalPath) return;
    navigate(`${canonicalPath}${location.search}${location.hash}`, { replace: true });
  }, [canonicalPath, location.hash, location.pathname, location.search, maker, navigate]);

  const reviews = useMemo(
    () => reviewTemplates.map((review, index) => ({
      ...review,
      project: makerProjects[index % Math.max(makerProjects.length, 1)],
      sourceIndex: index,
      dateValue: getReviewDateValue(review.when),
    })),
    [makerProjects, reviewTemplates],
  );

  const [sortKey, setSortKey] = useState<SortKey>("new");
  const [ratingFilter, setRatingFilter] = useState(0);
  const [helpful, setHelpful] = useState<Record<number, boolean>>({});
  const [reportFor, setReportFor] = useState<number | null>(null);
  const [reportReason, setReportReason] = useState("");
  const [reportComment, setReportComment] = useState("");

  const displayedReviews = useMemo(() => {
    const filtered = ratingFilter === 0
      ? reviews
      : reviews.filter((review) => review.stars === ratingFilter);

    return [...filtered].sort((first, second) => {
      if (sortKey === "old") return first.dateValue - second.dateValue;
      if (sortKey === "high") return second.stars - first.stars || second.dateValue - first.dateValue;
      if (sortKey === "low") return first.stars - second.stars || second.dateValue - first.dateValue;
      return second.dateValue - first.dateValue;
    });
  }, [ratingFilter, reviews, sortKey]);

  if (!maker || makerProjects.length === 0) return <NotFound />;

  const seoDescription = reviewSummary.hasReviews
    ? `${reviewSummary.reviewsLabel} о производителе ${maker.name}. Средняя оценка — ${reviewSummary.rating.toFixed(1).replace(".", ",")} из 5.`
    : `Отзывы о производителе ${maker.name} на многоместа.рф.`;
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: buildCanonicalUrl("/") },
      { "@type": "ListItem", position: 2, name: "Производители", item: buildCanonicalUrl(MANUFACTURERS_PATH) },
      { "@type": "ListItem", position: 3, name: maker.name, item: buildCanonicalUrl(getManufacturerPath(makerId)) },
      { "@type": "ListItem", position: 4, name: "Отзывы", item: buildCanonicalUrl(canonicalPath) },
    ],
  };

  const reportedReview = reportFor === null
    ? undefined
    : reviews.find((review) => review.sourceIndex === reportFor);

  const handleReportOpenChange = (open: boolean) => {
    if (open) return;
    setReportFor(null);
    setReportReason("");
    setReportComment("");
  };

  const submitReport = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!reportReason) return;

    const subject = `Жалоба на отзыв о ${maker.name}`;
    const body = [
      `Компания: ${maker.name}`,
      reportedReview ? `Отзыв: ${reportedReview.title}` : "",
      `Причина: ${reportReason}`,
      reportComment.trim() ? `Комментарий: ${reportComment.trim()}` : "",
      `Страница: ${window.location.href}`,
    ].filter(Boolean).join("\n");

    window.location.href = `mailto:hello@mnogomesta.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    toast.info("Откроем почтовое приложение с заполненной жалобой");
    handleReportOpenChange(false);
  };

  return (
    <div className="min-h-screen bg-secondary font-sans">
      <Seo
        title={`Отзывы о ${maker.name} | многоместа.рф`}
        description={seoDescription}
        canonicalPath={canonicalPath}
        jsonLd={breadcrumbJsonLd}
      />

      <main className="bg-white dark:bg-background">
        <Header variant="home" />

        <div className={`${siteBreadcrumbPageContainerClassName} pb-16 sm:pb-20`}>
          <SiteBreadcrumbs
            items={[
              { label: "Главная", to: "/" },
              { label: "Производители", to: MANUFACTURERS_PATH },
              { label: maker.name, to: getManufacturerPath(makerId) },
              { label: "Отзывы" },
            ]}
          />

          <header className="grid items-end gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:gap-12">
            <div>
              <h1 className="text-[36px] font-semibold leading-[1.04] tracking-[-0.045em] text-[#342d27] sm:text-[48px] lg:text-[58px] dark:text-foreground">
                Отзывы о {maker.name}
              </h1>
            </div>

            {reviewSummary.hasReviews && (
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 md:justify-end md:pb-1" aria-label={`Средняя оценка ${reviewSummary.rating.toFixed(1)} из 5`}>
                <span className="text-[40px] font-semibold leading-none tracking-[-0.04em] text-[#342d27] sm:text-[48px] dark:text-foreground">
                  {reviewSummary.rating.toFixed(1).replace(".", ",")}
                </span>
                <Stars value={reviewSummary.rating} size={20} />
                <span className="text-[15px] text-[#717b8e]">{reviewSummary.reviewsLabel}</span>
              </div>
            )}
          </header>

          {reviewSummary.hasReviews ? (
            <>
              <div className="mt-9 flex flex-wrap gap-3 sm:mt-12" aria-label="Фильтры отзывов">
                <label className="relative min-w-[210px] flex-1 sm:max-w-[250px]">
                  <span className="sr-only">Сортировка отзывов</span>
                  <select
                    value={sortKey}
                    onChange={(event) => setSortKey(event.target.value as SortKey)}
                    className="min-h-11 w-full appearance-none rounded-[3px] border border-[#dfe5f5] bg-white px-3.5 pr-10 text-[14px] font-medium text-[#342d27] outline-none transition-colors hover:border-primary/45 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-border dark:bg-background dark:text-foreground"
                  >
                    {SORT_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#717b8e]" strokeWidth={1.8} aria-hidden />
                </label>

                <label className="relative min-w-[180px] flex-1 sm:max-w-[220px]">
                  <span className="sr-only">Фильтр по оценке</span>
                  <select
                    value={ratingFilter}
                    onChange={(event) => setRatingFilter(Number(event.target.value))}
                    className="min-h-11 w-full appearance-none rounded-[3px] border border-[#dfe5f5] bg-white px-3.5 pr-10 text-[14px] font-medium text-[#342d27] outline-none transition-colors hover:border-primary/45 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-border dark:bg-background dark:text-foreground"
                  >
                    {RATING_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#717b8e]" strokeWidth={1.8} aria-hidden />
                </label>
              </div>

              {displayedReviews.length > 0 ? (
                <section className="mt-10 grid items-start gap-x-12 gap-y-14 sm:mt-12 md:grid-cols-2 lg:gap-x-20 lg:gap-y-16" aria-label="Отзывы покупателей">
                  {displayedReviews.map((review) => (
                    <article key={`${review.title}-${review.name}`} className="flex min-h-full flex-col">
                      <Stars value={review.stars} size={15} />
                      <h2 className="mt-4 text-[20px] font-semibold leading-snug tracking-[-0.015em] text-[#342d27] sm:text-[22px] dark:text-foreground">
                        {review.title}
                      </h2>
                      <p className="mt-3 text-[16px] leading-[1.7] text-[#5f5b57] dark:text-muted-foreground">
                        {review.body}
                      </p>

                      <div className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-[#717b8e]">
                        <span>{review.name}</span>
                        <span aria-hidden>·</span>
                        <span>{review.when}</span>
                        {review.project && (
                          <>
                            <span aria-hidden>·</span>
                            <Link to={getProjectPath(review.project)} className="font-medium text-[#342d27] transition-colors hover:text-primary dark:text-foreground">
                              {review.project.name}
                            </Link>
                          </>
                        )}
                      </div>

                      <div className="mt-5 flex flex-wrap items-center gap-5 text-[13px]">
                        <button
                          type="button"
                          onClick={() => setHelpful((current) => ({ ...current, [review.sourceIndex]: !current[review.sourceIndex] }))}
                          className={`inline-flex min-h-11 items-center gap-2 rounded-[3px] transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${helpful[review.sourceIndex] ? "text-primary" : "text-[#717b8e]"}`}
                          aria-pressed={Boolean(helpful[review.sourceIndex])}
                        >
                          <ThumbsUp className="h-4 w-4" strokeWidth={1.7} aria-hidden />
                          Полезно
                        </button>
                        <button
                          type="button"
                          onClick={() => setReportFor(review.sourceIndex)}
                          className="inline-flex min-h-11 items-center gap-2 rounded-[3px] text-[#717b8e] transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                        >
                          <Flag className="h-4 w-4" strokeWidth={1.7} aria-hidden />
                          Пожаловаться
                        </button>
                      </div>
                    </article>
                  ))}
                </section>
              ) : (
                <div className="mt-10 rounded-[3px] bg-secondary px-5 py-8 text-[15px] text-[#717b8e]">
                  Отзывов с такой оценкой пока нет.
                </div>
              )}
            </>
          ) : (
            <section className="mt-10 rounded-[3px] bg-secondary px-5 py-10 sm:px-8 sm:py-12">
              <h2 className="text-[24px] font-semibold tracking-[-0.025em] text-[#342d27] dark:text-foreground">Отзывов пока нет</h2>
              <p className="mt-2 max-w-[560px] text-[15px] leading-relaxed text-[#717b8e]">
                Когда появятся отзывы о компании, мы покажем их на этой странице.
              </p>
            </section>
          )}
        </div>
      </main>

      <Footer />

      <Dialog open={reportFor !== null} onOpenChange={handleReportOpenChange}>
        <DialogContent className="max-h-[90dvh] w-[calc(100%-24px)] max-w-[560px] overflow-y-auto rounded-[3px] border-[#dfe5f5] bg-white p-5 shadow-xl sm:p-7 dark:border-border dark:bg-background">
          <DialogHeader className="pr-8 text-left">
            <DialogTitle className="text-[24px] font-semibold leading-tight tracking-[-0.025em] text-[#342d27] dark:text-foreground">
              Пожаловаться на отзыв
            </DialogTitle>
            <DialogDescription className="pt-2 text-[14px] leading-relaxed text-[#717b8e]">
              Выберите причину. Мы проверим отзыв о компании «{maker.name}».
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={submitReport} className="mt-2">
            <RadioGroup value={reportReason} onValueChange={setReportReason} aria-label="Причина жалобы" className="gap-1">
              {REPORT_REASONS.map((reason, index) => {
                const reasonId = `review-report-reason-${index}`;
                return (
                  <Label
                    key={reason}
                    htmlFor={reasonId}
                    className="group flex min-h-11 cursor-pointer items-center gap-3 rounded-[3px] px-2.5 py-2.5 text-[15px] font-normal leading-snug text-[#342d27] transition-colors hover:bg-secondary focus-within:bg-secondary dark:text-foreground"
                  >
                    <RadioGroupItem id={reasonId} value={reason} className="h-5 w-5 shrink-0 border-[#9aa4b7]" />
                    <span>{reason}</span>
                  </Label>
                );
              })}
            </RadioGroup>

            <div className="mt-5">
              <Label htmlFor="review-report-comment" className="text-[14px] font-medium text-[#342d27] dark:text-foreground">
                Комментарий <span className="font-normal text-[#717b8e]">(необязательно)</span>
              </Label>
              <Textarea
                id="review-report-comment"
                value={reportComment}
                onChange={(event) => setReportComment(event.target.value)}
                maxLength={800}
                placeholder="Расскажите подробнее, что не так"
                className="mt-2 min-h-[104px] resize-y rounded-[3px] border-[#dfe5f5] bg-white px-3 py-3 text-[16px] text-[#342d27] focus-visible:ring-primary/30 focus-visible:ring-offset-0 dark:border-border dark:bg-background dark:text-foreground"
              />
            </div>

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => handleReportOpenChange(false)}
                className="min-h-11 rounded-[3px] px-5 text-[14px] font-medium text-[#342d27] transition-colors hover:bg-secondary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 dark:text-foreground"
              >
                Отмена
              </button>
              <button
                type="submit"
                disabled={!reportReason}
                className="min-h-11 rounded-[3px] bg-primary px-5 text-[14px] font-semibold text-white transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-45"
              >
                Отправить
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PartnerReviews;
