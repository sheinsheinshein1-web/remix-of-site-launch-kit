import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Star, ChevronDown, SlidersHorizontal, ThumbsUp, MoreHorizontal } from "lucide-react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { projects as allProjects, makersById } from "@/data/projects";

const partnerMakerIds: Record<string, string> = { "1": "platforma" };

const REVIEW_TEMPLATES: { title: string; body: string; name: string; when: string; stars: number }[] = [
  {
    title: "Отличное качество",
    body: "Дом собрали быстро, всё аккуратно. Команда на связи, материалы качественные — за месяц подняли коробку, ещё неделя ушла на отделку. Очень довольны результатом, всё как на рендерах.",
    name: "Алексей",
    when: "2 нед. назад",
    stars: 5,
  },
  {
    title: "Тепло даже зимой",
    body: "Переехали в декабре, при −28°С внутри +23 без проблем. Утепление и окна на пятёрку, счета за отопление приятно удивили. Спасибо за честную работу.",
    name: "Мария",
    when: "1 мес. назад",
    stars: 5,
  },
  {
    title: "Сроки сдвинули, но финал хороший",
    body: "Сдача задержалась на 2 недели из-за погоды, но менеджер всегда был на связи и предупреждал. По итогу дом отличный, мелкие замечания устранили в течение недели.",
    name: "Иван",
    when: "1 мес. назад",
    stars: 4,
  },
  {
    title: "Рекомендую",
    body: "Долго выбирали подрядчика, в итоге выбрали по отзывам и не пожалели. Прозрачная смета, никаких допов в процессе. Дом стоит уже полгода — всё ок.",
    name: "Елена",
    when: "2 мес. назад",
    stars: 5,
  },
  {
    title: "Качественная сборка",
    body: "Конструктив добротный, видно что работают на совесть. Узлы и стыки промазаны как надо, кровля идеально ровная. Внутрянку доверили им же — тоже без нареканий.",
    name: "Дмитрий",
    when: "3 мес. назад",
    stars: 5,
  },
  {
    title: "Хороший дом за свои деньги",
    body: "Соотношение цены и качества на уровне. Сравнивали с другими — у конкурентов или дороже, или сроки больше. Тут попали в бюджет и в сроки.",
    name: "Светлана",
    when: "4 мес. назад",
    stars: 4,
  },
];

const PartnerReviews = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const makerId = (id && (partnerMakerIds[id] ?? (makersById[id] ? id : undefined))) || "platforma";
  const summary = makersById[makerId];

  const makerProjects = useMemo(
    () => allProjects.filter((p) => p.maker.id === makerId),
    [makerId]
  );

  const reviews = useMemo(() => {
    if (makerProjects.length === 0) return [];
    return REVIEW_TEMPLATES.map((tpl, i) => {
      const project = makerProjects[i % makerProjects.length];
      return { ...tpl, project };
    });
  }, [makerProjects]);

  const totalCount = reviews.length;
  const ratingAvg = useMemo(() => {
    if (reviews.length === 0) return 0;
    return reviews.reduce((s, r) => s + r.stars, 0) / reviews.length;
  }, [reviews]);

  const sortOptions = [
    { value: "new", label: "Сначала новые" },
    { value: "old", label: "Сначала старые" },
    { value: "high", label: "С высоким рейтингом" },
    { value: "low", label: "С низким рейтингом" },
  ] as const;
  const ratingOptions = [
    { value: 0, label: "Все оценки" },
    { value: 5, label: "Только 5 звёзд" },
    { value: 4, label: "Только 4 звезды" },
    { value: 3, label: "Только 3 звезды" },
    { value: 2, label: "Только 2 звезды" },
    { value: 1, label: "Только 1 звезда" },
  ] as const;

  const [sortKey, setSortKey] = useState<"new" | "old" | "high" | "low">("new");
  const [ratingFilter, setRatingFilter] = useState<number>(0);
  const [sortOpen, setSortOpen] = useState(false);
  const [ratingOpen, setRatingOpen] = useState(false);

  const sortLabel = sortOptions.find((o) => o.value === sortKey)?.label ?? "Сначала новые";
  const ratingLabel = ratingOptions.find((o) => o.value === ratingFilter)?.label ?? "Все оценки";

  const displayedReviews = useMemo(() => {
    const withIndex = reviews.map((r, i) => ({ r, i }));
    const filtered = ratingFilter === 0 ? withIndex : withIndex.filter(({ r }) => r.stars === ratingFilter);
    const sorted = [...filtered].sort((a, b) => {
      switch (sortKey) {
        case "new": return a.i - b.i;
        case "old": return b.i - a.i;
        case "high": return b.r.stars - a.r.stars || a.i - b.i;
        case "low": return a.r.stars - b.r.stars || a.i - b.i;
      }
    });
    return sorted.map(({ r }) => r);
  }, [reviews, sortKey, ratingFilter]);

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate(`/partner/${id}`);
  };

  return (
    <div
      className="min-h-screen pb-[max(env(safe-area-inset-bottom),12px)] text-white"
      style={{ background: "hsl(0 0% 8%)" }}
    >
      {/* Sticky header */}
      <div
        className="sticky top-0 z-30"
        style={{
          background: "hsl(0 0% 8% / 0.55)",
          backdropFilter: "blur(32px) saturate(160%)",
          WebkitBackdropFilter: "blur(32px) saturate(160%)",
        }}
      >
        <div className="px-3 pt-[max(env(safe-area-inset-top),12px)] pb-3 flex items-center gap-3">
          <button
            onClick={handleBack}
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "hsl(0 0% 100% / 0.12)" }}
            aria-label="Назад"
          >
            <ArrowLeft className="w-[18px] h-[18px] text-white" strokeWidth={1.8} />
          </button>
          <div className="min-w-0">
            <h1 className="text-[17px] font-semibold text-white leading-tight truncate">
              Отзывы о {summary?.name ?? "компании"}
            </h1>
          </div>
        </div>
      </div>

      <div className="px-3 pt-2 space-y-3">
        {/* Summary card */}
        <section className="rounded-2xl p-5" style={{ background: "hsl(0 0% 100% / 0.08)" }}>
          <div className="flex items-end justify-between gap-3">
            <div>
              <div className="text-[34px] font-bold leading-none text-white">
                {ratingAvg.toFixed(1)}
              </div>
              <div className="flex items-center gap-0.5 mt-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i <= Math.round(ratingAvg)
                        ? "fill-white text-white"
                        : "fill-white/20 text-white/20"
                    }`}
                    strokeWidth={0}
                  />
                ))}
              </div>
              <div className="text-[13px] text-white/70 mt-1.5">
                {totalCount} {totalCount === 1 ? "отзыв" : totalCount < 5 ? "отзыва" : "отзывов"}
              </div>
            </div>
            <div className="flex-1 max-w-[200px] space-y-1">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = reviews.filter((r) => r.stars === star).length;
                const pct = totalCount ? (count / totalCount) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-2">
                    <span className="text-[11px] text-white/70 w-2">{star}</span>
                    <div className="flex-1 h-1.5 rounded-xl overflow-hidden" style={{ background: "hsl(0 0% 100% / 0.12)" }}>
                      <div
                        className="h-full bg-white/80"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Filter chips */}
        <div className="flex items-center gap-2 overflow-x-auto -mx-3 px-3 scrollbar-hide">
          <button
            className="shrink-0 h-9 px-3.5 rounded-xl flex items-center gap-1.5 text-[14px] text-white"
            style={{ background: "hsl(0 0% 100% / 0.08)" }}
          >
            {sortLabel}
            <ChevronDown className="w-4 h-4" strokeWidth={1.8} />
          </button>
          <button
            className="shrink-0 h-9 px-3.5 rounded-xl flex items-center gap-1.5 text-[14px] text-white"
            style={{ background: "hsl(0 0% 100% / 0.08)" }}
          >
            {ratingLabel}
            <ChevronDown className="w-4 h-4" strokeWidth={1.8} />
          </button>
        </div>

        {/* Reviews list */}
        <div className="space-y-3">
          {reviews.map((r, idx) => (
            <article key={idx} className="rounded-2xl p-4" style={{ background: "hsl(0 0% 100% / 0.08)" }}>
              <div className="flex items-start gap-3">
                <div className="w-[72px] h-[72px] rounded-xl overflow-hidden shrink-0" style={{ background: "hsl(0 0% 100% / 0.08)" }}>
                  {r.project.gallery[0]?.image && (
                    <img
                      src={r.project.gallery[0].image}
                      alt=""
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i <= r.stars
                              ? "fill-white text-white"
                              : "fill-white/20 text-white/20"
                          }`}
                          strokeWidth={0}
                        />
                      ))}
                    </div>
                    <button
                      className="w-7 h-7 -mt-1 -mr-1 flex items-center justify-center text-white/60"
                      aria-label="Действия"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-[13px] text-white/70 mt-1">
                    {r.name} · {r.when}
                  </div>
                  <div className="text-[14px] text-white/90 mt-0.5 truncate">
                    {r.project.name}
                  </div>
                </div>
              </div>

              <div className="mt-3 text-[15px] font-semibold text-white">
                {r.title}
              </div>
              <p className="mt-1 text-[14px] text-white/85 leading-snug">
                {r.body}
              </p>

              <div className="mt-3 flex items-center justify-between">
                <button className="flex items-center gap-1.5 text-[13px] text-white/70">
                  <ThumbsUp className="w-4 h-4" strokeWidth={1.8} />
                  Полезно
                </button>
                <a
                  href={summary?.siteUrl ?? "#"}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-[12px] text-white/55"
                >
                  {summary?.siteUrl ? new URL(summary.siteUrl).hostname.replace(/^www\./, "") : ""}
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PartnerReviews;
