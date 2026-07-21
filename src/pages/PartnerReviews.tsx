import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Star, ChevronDown, SlidersHorizontal, ThumbsUp, MoreHorizontal, Flag } from "lucide-react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { toast } from "sonner";
import { projects as allProjects, makersById } from "@/data/projects";

const partnerMakerIds: Record<string, string> = { "1": "platforma" };

type ReviewTemplate = { title: string; body: string; name: string; when: string; stars: number };

const REVIEW_TEMPLATES: ReviewTemplate[] = [
  {
    title: "Фиксированная цена и забота",
    body: "Выбирали с мужем компанию по строительству модульного дома и остановилась на «Платформе». Понравилось, что цена фиксированная, без неожиданных доплат. Очень быстро отвечают, менеджер всегда на связи, не чувствовала себя брошенной. Ещё здорово, что можно было съездить на производство и посмотреть, как всё делается.",
    name: "Полина",
    when: "Дом сдан",
    stars: 5,
  },
  {
    title: "Подстроились под индивидуальный заказ",
    body: "Долго выбирала где заказать дом. Оказалось что не все производители могут выполнить индивидуальный заказ. Штампуют одинаковые дома всем. Эти ребята подстроились под мои хотелки. А после поездки на производство и строящийся объект, сравнив качество с другими компаниями, окончательно убедилась в выборе.",
    name: "Наталья",
    when: "Дом на этапе производства",
    stars: 5,
  },
  {
    title: "Прозрачное производство",
    body: "Приехали на производство, поняли, что и как делается. Впечатлялись, заказали дом. Наблюдаем процесс сборки.",
    name: "Михаил",
    when: "Дом на этапе производства",
    stars: 5,
  },
  {
    title: "Модульная баня — огонь",
    body: "Взяли у «Платформы» модульную баню и не нарадуемся. Привезли без суеты, поставили ровно, внутри всё по-человечески сделано. Парилка разогревается быстро, тепло держит отлично. Теперь каждые выходные туда бегаем — вообще не понимаем, как раньше без неё жили.",
    name: "Карина",
    when: "Баня сдана",
    stars: 5,
  },
];

// Реальные отзывы, собранные с публичных источников (Яндекс.Карты).
const MAKER_REVIEW_OVERRIDES: Record<string, ReviewTemplate[]> = {
  bygge: [
    {
      title: "Проект «Сенат» по семейной ипотеке",
      body: "Построили с Михаилом проект Сенат в Александрии по семейной ипотеке. Строительство прошло быстро и качественно, без вопросов. На этапе согласования проекта внесли правки: сменили вход в детскую, сделали панораму, перенесли камин. Дом прошёл холода −30, ни промерзаний, ни конденсата не обнаружил. Тёплый, подходит для круглогодичного проживания. Понравилось, что скважину и септик тоже удалось включить в ипотеку. В итоге получили дом «под тапочки» — заезжай и живи.",
      name: "Игорь Д.",
      when: "30 марта",
      stars: 5,
    },
    {
      title: "Заказали — привезли — собрали",
      body: "Приняли решение всей семьёй приобрести участок и построить просторный дом. Побывав на производстве, все сомнения пропали. Фиксированная стоимость, качественные материалы, доп. опции. Ребята очень внимательны, всегда на связи, вопросы решаются оперативно. Отделка — такую и видели в своём доме. Окна — свет и воздух! Дополнительно сделали тёплый пол в прихожей и гостиной, комфортно даже в морозы. Реальность превзошла ожидания!",
      name: "Василиса С.",
      when: "3 июня 2025",
      stars: 5,
    },
    {
      title: "Модульный Gallant собрали раньше срока",
      body: "Для нас построили модульный дом Gallant. Привлекло, что строительство идёт на производстве, материалы не мокнут, покрытие на участке не нарушается. Дом привозят несколькими модулями. Перед покупкой ездили смотреть выставочный — всё в точности так же. Доставили и собрали чуть раньше срока. Менеджер всегда на связи, правки удобно согласовывать. Специалисты по доставке несколько раз выезжали на участок (узкий проезд). На участке и в доме оставили идеальную чистоту.",
      name: "Александр",
      when: "1 апреля 2025",
      stars: 5,
    },
    {
      title: "Весной заказали — в июле въехали",
      body: "Заказали дом у BYGGE весной, уже в июле въехали. Всё чётко по срокам, без затягиваний. Очень понравился подход: менеджер всё подробно объяснил, на каждом этапе присылали фотоотчёты. Качество сборки на уровне — тепло, никуда не продувает. Спасибо ребятам за слаженную работу: от проекта до последнего самореза всё продумано.",
      name: "Миннигуль К.",
      when: "19 октября 2025",
      stars: 5,
    },
    {
      title: "Пережил морозы −40, панорамные окна не подвели",
      body: "Долго выбирала подрядчика, приглядывалась к модульным быстровозводимым домам. После покупки участка остановилась на этой компании: съездила посмотрела дом, коллега по работе побывал в цеху и остался доволен качеством. Дом стоит 2 месяца, прошёл испытания морозами −40. Было страшновато — практически весь в панорамном остеклении, но окна не промерзали, не «плакали», наледи не было. Отапливается конвекторами, тёплыми полами в санузле и прихожей, печью по выходным. Построили видоизменённый Шервуд 86 м² — с владельцем Михаилом поменяли планировку, получилась конфетка. Дополнительно поставили хоз.блок 5×2,5 м — единый стиль на участке.",
      name: "Марина Ч.",
      when: "4 февраля 2024",
      stars: 5,
    },
  ],
};

const MAKER_REVIEW_TOTAL_OVERRIDES: Record<string, number> = {
  bygge: 18,
};

const PartnerReviews = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const makerId = (id && (partnerMakerIds[id] ?? (makersById[id] ? id : undefined))) || "platforma";
  const summary = makersById[makerId];

  const makerProjects = useMemo(
    () => allProjects.filter((p) => p.maker.id === makerId),
    [makerId]
  );

  const reviews = useMemo(() => {
    if (makerProjects.length === 0) return [];
    const templates = MAKER_REVIEW_OVERRIDES[makerId] ?? REVIEW_TEMPLATES;
    return templates.map((tpl, i) => {
      const project = makerProjects[i % makerProjects.length];
      return { ...tpl, project };
    });
  }, [makerProjects, makerId]);


  const totalCount = MAKER_REVIEW_TOTAL_OVERRIDES[makerId] ?? reviews.length;
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

  const [helpful, setHelpful] = useState<Record<number, boolean>>({});
  const toggleHelpful = (i: number) =>
    setHelpful((h) => ({ ...h, [i]: !h[i] }));

  const [reportFor, setReportFor] = useState<number | null>(null);
  const reportReasons = [
    "Спам или реклама",
    "Оскорбления или язык вражды",
    "Недостоверная информация",
    "Личные данные",
    "Другое",
  ];

  const handleBack = () => {
    if ((location.state as { returnToMenu?: boolean } | null)?.returnToMenu) {
      navigate(`/partner/${id}`, { state: { openMenu: true } });
    }
    else if (window.history.length > 1) navigate(-1);
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
                {(ratingAvg || 0).toFixed(1).replace(".", ",")}
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
            onClick={() => setSortOpen(true)}
            className="shrink-0 h-9 px-3.5 rounded-xl flex items-center gap-1.5 text-[14px] text-white"
            style={{ background: "hsl(0 0% 100% / 0.08)" }}
          >
            {sortLabel}
            <ChevronDown className="w-4 h-4" strokeWidth={1.8} />
          </button>
          <button
            onClick={() => setRatingOpen(true)}
            className="shrink-0 h-9 px-3.5 rounded-xl flex items-center gap-1.5 text-[14px] text-white"
            style={{ background: "hsl(0 0% 100% / 0.08)" }}
          >
            {ratingLabel}
            <ChevronDown className="w-4 h-4" strokeWidth={1.8} />
          </button>
        </div>

        {/* Reviews list */}
        <div className="space-y-3">
          {displayedReviews.map((r, idx) => (
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
                      onClick={() => setReportFor(idx)}
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
                <button
                  type="button"
                  onClick={() => toggleHelpful(idx)}
                  aria-pressed={!!helpful[idx]}
                  className={`flex items-center gap-1.5 text-[13px] transition-colors ${
                    helpful[idx] ? "text-white" : "text-white/70"
                  }`}
                >
                  <ThumbsUp
                    className="w-4 h-4"
                    strokeWidth={1.8}
                    fill={helpful[idx] ? "currentColor" : "none"}
                  />
                  Полезно{helpful[idx] ? " · 1" : ""}
                </button>
                <a
                  href={summary?.siteUrl ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer nofollow sponsored"
                  className="text-[12px] text-white/55"
                >
                  {summary?.siteUrl ? new URL(summary.siteUrl).hostname.replace(/^www\./, "") : ""}
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Sort drawer */}
      <Drawer open={sortOpen} onOpenChange={setSortOpen}>
        <DrawerContent
          className="mx-0 rounded-t-[20px] p-0 border-0 text-white"
          style={{
            background: "hsl(0 0% 8% / 0.55)",
            backdropFilter: "blur(32px) saturate(160%)",
            WebkitBackdropFilter: "blur(32px) saturate(160%)",
          }}
        >
          <div className="px-3 pt-5 pb-3">
            <h3 className="text-[20px] font-semibold text-white px-1">Сортировка</h3>
          </div>
          <div className="px-3 pb-6 flex flex-col gap-2">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => { setSortKey(option.value); setSortOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-4 text-left rounded-2xl"
                style={{ background: "hsl(0 0% 100% / 0.08)" }}
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${sortKey === option.value ? "border-primary" : "border-white/30"}`}>
                  {sortKey === option.value && <div className="w-3 h-3 rounded-full bg-primary" />}
                </div>
                <span className="text-[16px] text-white">{option.label}</span>
              </button>
            ))}
          </div>
        </DrawerContent>
      </Drawer>

      {/* Rating filter drawer */}
      <Drawer open={ratingOpen} onOpenChange={setRatingOpen}>
        <DrawerContent
          className="mx-0 rounded-t-[20px] p-0 border-0 text-white"
          style={{
            background: "hsl(0 0% 8% / 0.55)",
            backdropFilter: "blur(32px) saturate(160%)",
            WebkitBackdropFilter: "blur(32px) saturate(160%)",
          }}
        >
          <div className="px-3 pt-5 pb-3">
            <h3 className="text-[20px] font-semibold text-white px-1">Оценка</h3>
          </div>
          <div className="px-3 pb-6 flex flex-col gap-2">
            {ratingOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => { setRatingFilter(option.value); setRatingOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-4 text-left rounded-2xl"
                style={{ background: "hsl(0 0% 100% / 0.08)" }}
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${ratingFilter === option.value ? "border-primary" : "border-white/30"}`}>
                  {ratingFilter === option.value && <div className="w-3 h-3 rounded-full bg-primary" />}
                </div>
                <span className="text-[16px] text-white">{option.label}</span>
              </button>
            ))}
          </div>
        </DrawerContent>
      </Drawer>

      {/* Report drawer */}
      <Drawer open={reportFor !== null} onOpenChange={(o) => !o && setReportFor(null)}>
        <DrawerContent
          className="mx-0 rounded-t-[20px] p-0 border-0 text-white"
          style={{
            background: "hsl(0 0% 8% / 0.55)",
            backdropFilter: "blur(32px) saturate(160%)",
            WebkitBackdropFilter: "blur(32px) saturate(160%)",
          }}
        >
          <div className="px-3 pt-5 pb-3">
            <h3 className="text-[20px] font-semibold text-white px-1 flex items-center gap-2">
              <Flag className="w-5 h-5" strokeWidth={1.8} />
              Пожаловаться на отзыв
            </h3>
            <p className="text-[13px] text-white/60 px-1 mt-1">Выберите причину — мы проверим в течение 24 часов</p>
          </div>
          <div className="px-3 pb-6 flex flex-col gap-2">
            {reportReasons.map((reason) => (
              <button
                key={reason}
                onClick={() => {
                  setReportFor(null);
                  toast.success("Жалоба отправлена");
                }}
                className="w-full text-left px-4 py-4 rounded-2xl text-[16px] text-white"
                style={{ background: "hsl(0 0% 100% / 0.08)" }}
              >
                {reason}
              </button>
            ))}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default PartnerReviews;
