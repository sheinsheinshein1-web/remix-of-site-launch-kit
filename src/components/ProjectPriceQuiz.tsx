import { FormEvent, lazy, Suspense, useMemo, useRef, useState, type CSSProperties } from "react";
import { ArrowLeft, Check, ChevronLeft, ChevronRight, Expand, MapPin, Send, X } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { projects as catalogProjects, type Project } from "@/data/projects";
import { manufacturerRegistry } from "@/data/manufacturers";
import { sendSupportMessage } from "@/lib/supportChat";
import type { ProjectMapPoint } from "@/components/ProjectLocationMap";
import {
  getProjectMatchLabel,
  getSimilarManufacturerProjects,
} from "@/lib/projectRecommendations";
import { regionGroups } from "@/data/regions";
import { isAllRegionsGeo, resolveGeoSelection } from "@/lib/geoSelection";
import {
  createProjectQuoteLeadId,
  submitProjectQuoteApplication,
  type ProjectQuoteApplicationPayload,
} from "@/lib/projectQuoteApplication";
import {
  formatApproximateMapLocation,
  reverseGeocodeMapPoint,
} from "@/lib/reverseGeocoding";

const ProjectLocationMap = lazy(() => import("@/components/ProjectLocationMap"));

type QuizStep = "location" | "plot" | "payment" | "bank" | "timing" | "contacts";

type ProjectPriceQuizProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project;
  deliveryRegion: string;
};

type ChoiceOption = {
  value: string;
  note: string;
};

const plotOptions = [
  { value: "Участок уже есть", note: "Место строительства известно" },
  { value: "Оформляю покупку", note: "Участок уже выбран" },
  { value: "Подбираю участок", note: "Рассматриваю разные районы" },
  { value: "Участка пока нет", note: "Хочу узнать примерную стоимость" },
] as const;

const paymentOptions = [
  { value: "Собственные средства", note: "Оплата без кредита" },
  { value: "Ипотека", note: "Банк уже выбран или ещё подбирается" },
  { value: "Рассрочка", note: "Хочу уточнить доступные условия" },
  { value: "Материнский капитал", note: "Планирую использовать в оплате" },
  { value: "Пока выбираю", note: "Сначала хочу увидеть расчёт" },
] as const;

const bankOptions = [
  { value: "Сбер", note: "Рассматриваю этот банк" },
  { value: "ВТБ", note: "Рассматриваю этот банк" },
  { value: "ДОМ.РФ", note: "Рассматриваю этот банк" },
  { value: "Другой банк", note: "Можно уточнить при разговоре" },
  { value: "Банк пока не выбран", note: "Хочу сравнить условия" },
] as const;

const timingOptions = [
  { value: "В ближайшие 3 месяца", note: "Хотелось бы начать в ближайшее время" },
  { value: "Через 3–6 месяцев", note: "Ориентируюсь на этот период" },
  { value: "Через 6–12 месяцев", note: "Планирую заранее" },
  { value: "Пока знакомлюсь с ценами", note: "Срок ещё не определён" },
] as const;

const confettiColors = ["#3f70ea", "#8caaf4", "#e8bb64", "#342d27", "#dce6ff"];
const confettiPieces = Array.from({ length: 24 }, (_, index) => ({
  left: 4 + ((index * 17) % 92),
  delay: (index % 8) * 70,
  duration: 1500 + (index % 5) * 170,
  drift: ((index % 7) - 3) * 24,
  rotation: 240 + (index % 6) * 95,
  color: confettiColors[index % confettiColors.length],
}));

const pluralizeCalculations = (count: number) => {
  const remainder100 = count % 100;
  const remainder10 = count % 10;
  if (remainder100 >= 11 && remainder100 <= 19) return "расчётов";
  if (remainder10 === 1) return "расчёт";
  if (remainder10 >= 2 && remainder10 <= 4) return "расчёта";
  return "расчётов";
};

const getProjectManufacturerName = (project: Project) =>
  manufacturerRegistry[project.manufacturerId]?.name ?? "Производитель";

const ProjectPriceQuiz = ({ open, onOpenChange, project, deliveryRegion }: ProjectPriceQuizProps) => {
  const [step, setStep] = useState<QuizStep>("plot");
  const [locationDetails, setLocationDetails] = useState("");
  const [mapPoint, setMapPoint] = useState<ProjectMapPoint | null>(null);
  const [locationUnknown, setLocationUnknown] = useState(false);
  const [plotStatus, setPlotStatus] = useState("");
  const [payment, setPayment] = useState("");
  const [bank, setBank] = useState("");
  const [timing, setTiming] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [selectedRecommendationIds, setSelectedRecommendationIds] = useState<number[]>([]);
  const [additionalSent, setAdditionalSent] = useState(false);
  const [initialQuotePayload, setInitialQuotePayload] = useState<ProjectQuoteApplicationPayload | null>(null);
  const [previewProjectId, setPreviewProjectId] = useState<number | null>(null);
  const [previewImageIndex, setPreviewImageIndex] = useState(0);
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "recommendations" | "success">("idle");
  const initialSheetRequestPromiseRef = useRef<Promise<void> | null>(null);

  const steps = useMemo<QuizStep[]>(() => [
    "plot",
    ...(plotStatus && plotStatus !== "Участка пока нет" ? ["location" as const] : []),
    "payment",
    ...(payment === "Ипотека" ? ["bank" as const] : []),
    "timing",
    "contacts",
  ], [payment, plotStatus]);

  const stepIndex = Math.max(steps.indexOf(step), 0);
  const manufacturerName = getProjectManufacturerName(project);
  const firstImage = project.gallery[0]?.image ?? "";
  const recommendations = useMemo(
    () => getSimilarManufacturerProjects(project, catalogProjects, deliveryRegion),
    [deliveryRegion, project],
  );
  const priceLabel = /^(?:от(?:\s|$)|по запросу(?:\s|$))/i.test(project.price.trim())
    ? project.price
    : `от ${project.price}`;
  const previewProject = recommendations.find((item) => item.id === previewProjectId) ?? null;
  const previewGallery = previewProject?.gallery ?? [];
  const previewImage = previewGallery[previewImageIndex] ?? previewGallery[0];
  const previewPriceLabel = previewProject
    ? /^(?:от(?:\s|$)|по запросу(?:\s|$))/i.test(previewProject.price.trim())
      ? previewProject.price
      : `от ${previewProject.price}`
    : "";
  const selectedRecommendationProjects = recommendations.filter((item) => (
    selectedRecommendationIds.includes(item.id)
  ));
  const selectedRecommendationNames = selectedRecommendationProjects.map((item) => item.name);
  const selectedRecommendationNamesLabel = selectedRecommendationNames.length > 1
    ? `${selectedRecommendationNames.slice(0, -1).join(", ")} и ${selectedRecommendationNames.at(-1)}`
    : selectedRecommendationNames[0] ?? "";
  const selectedGeo = !isAllRegionsGeo(deliveryRegion)
    ? resolveGeoSelection(deliveryRegion)
    : resolveGeoSelection(project.city);
  const selectedRegionGroup = regionGroups.find((group) => (
    group.slug === (selectedGeo?.baseRegionSlug ?? selectedGeo?.slug)
  ));
  const telegramRegion = selectedRegionGroup?.cities.find((region) => region.deliveryArea)?.namePrepositional
    ?? selectedGeo?.namePrepositional
    ?? "в вашем регионе";
  const isRecommendationStep = submitState === "recommendations";

  const resolveLocationAnswer = async () => {
    if (plotStatus === "Участка пока нет") return "Не указано: участка пока нет";
    if (locationUnknown) return "Район пока не выбран";
    if (locationDetails.trim()) return `Населённый пункт или район: ${locationDetails.trim()}`;

    if (mapPoint) {
      const address = await reverseGeocodeMapPoint(mapPoint);
      return formatApproximateMapLocation(address, selectedGeo?.name ?? project.city);
    }

    return "Район пока не выбран";
  };

  const reset = () => {
    setStep("plot");
    setLocationDetails("");
    setMapPoint(null);
    setLocationUnknown(false);
    setPlotStatus("");
    setPayment("");
    setBank("");
    setTiming("");
    setName("");
    setPhone("");
    setSelectedRecommendationIds([]);
    setAdditionalSent(false);
    setInitialQuotePayload(null);
    initialSheetRequestPromiseRef.current = null;
    setPreviewProjectId(null);
    setPreviewImageIndex(0);
    setError("");
    setSubmitState("idle");
  };

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);
    if (!nextOpen) window.setTimeout(reset, 180);
  };

  const canContinue = (() => {
    if (step === "location") {
      return Boolean(locationDetails.trim() || mapPoint || locationUnknown);
    }
    if (step === "plot") return Boolean(plotStatus);
    if (step === "payment") return Boolean(payment);
    if (step === "bank") return Boolean(bank);
    if (step === "timing") return Boolean(timing);
    return false;
  })();

  const goForward = () => {
    if (!canContinue) return;
    const nextStep = steps[steps.indexOf(step) + 1];
    if (nextStep) setStep(nextStep);
  };

  const goBack = () => {
    const previousStep = steps[steps.indexOf(step) - 1];
    if (previousStep) setStep(previousStep);
  };

  const handlePlotStatus = (value: string) => {
    setPlotStatus(value);
    setLocationDetails("");
    setMapPoint(null);
    setLocationUnknown(false);
    setError("");
  };

  const handleLocationUnknown = () => {
    setLocationDetails("");
    setMapPoint(null);
    setLocationUnknown(true);
    setError("");
    setStep("payment");
  };

  const sendInitialRequest = (message: string, quotePayload: ProjectQuoteApplicationPayload) => {
    const supportSubmission = sendSupportMessage(message);
    const sheetSubmission = submitProjectQuoteApplication(quotePayload);
    initialSheetRequestPromiseRef.current = sheetSubmission;
    const submission = Promise.allSettled([
      supportSubmission,
      sheetSubmission,
    ]).then((results) => {
      const delivered = results.some((result) => result.status === "fulfilled");
      return delivered;
    });

    return submission;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) {
      setError("Пожалуйста, укажите имя");
      return;
    }
    if (phone.replace(/\D/g, "").length < 10) {
      setError("Пожалуйста, проверьте номер телефона");
      return;
    }

    setError("");
    setSubmitState("submitting");
    const locationAnswer = await resolveLocationAnswer();
    const message = [
      "Заявка на расчёт цены дома с доставкой",
      `Проект: ${project.name}`,
      `ID проекта: ${project.id}`,
      `Производитель: ${manufacturerName}`,
      `Местоположение участка: ${locationAnswer}`,
      `Статус участка: ${plotStatus}`,
      `Способ оплаты: ${payment}`,
      payment === "Ипотека" ? `Банк: ${bank}` : "",
      `Срок покупки: ${timing}`,
      `Имя: ${name.trim()}`,
      `Телефон: ${phone.trim()}`,
      `Страница: ${window.location.href}`,
    ].filter(Boolean).join("\n");

    const quotePayload: ProjectQuoteApplicationPayload = {
      applicationType: "projectQuote",
      leadId: createProjectQuoteLeadId(),
      projectName: project.name,
      projectId: String(project.id),
      manufacturerName,
      area: project.area,
      price: project.price,
      deliveryRegion,
      plotStatus,
      location: locationAnswer,
      payment,
      bank: payment === "Ипотека" ? bank : "",
      timing,
      contactName: name.trim(),
      phone: phone.trim(),
      alternativeProjects: "",
      sourceUrl: window.location.href,
      fax: "",
    };

    setInitialQuotePayload(quotePayload);

    if (recommendations.length) {
      setSubmitState("recommendations");
      void sendInitialRequest(message, quotePayload);
      return;
    }

    const sent = await sendInitialRequest(message, quotePayload);
    if (sent) {
      setSubmitState("success");
    } else {
      setSubmitState("idle");
    }
  };

  const toggleRecommendation = (projectId: number) => {
    setSelectedRecommendationIds((current) => (
      current.includes(projectId)
        ? current.filter((id) => id !== projectId)
        : [...current, projectId]
    ));
    setError("");
  };

  const openProjectPreview = (projectId: number) => {
    setPreviewImageIndex(0);
    setPreviewProjectId(projectId);
  };

  const closeProjectPreview = () => {
    setPreviewProjectId(null);
    setPreviewImageIndex(0);
  };

  const showPreviousPreviewImage = () => {
    setPreviewImageIndex((current) => (
      current === 0 ? Math.max(previewGallery.length - 1, 0) : current - 1
    ));
  };

  const showNextPreviewImage = () => {
    setPreviewImageIndex((current) => (
      previewGallery.length ? (current + 1) % previewGallery.length : 0
    ));
  };

  const handleAdditionalSubmit = () => {
    if (!selectedRecommendationIds.length) return;
    if (!initialQuotePayload) {
      setError("Не найдены данные основной заявки");
      return;
    }

    const selectedProjects = recommendations.filter((item) => selectedRecommendationIds.includes(item.id));
    const locationAnswer = initialQuotePayload.location;

    const message = [
      "Запрос на дополнительные расчёты",
      `Исходный проект: ${project.name} от ${manufacturerName}`,
      `Местоположение участка: ${locationAnswer}`,
      ...selectedProjects.map((item, index) => (
        `${index + 1}. ${item.name} от ${getProjectManufacturerName(item)}, ID ${item.id}, ${item.area}, ${item.price}`
      )),
      `Имя: ${name.trim()}`,
      `Телефон: ${phone.trim()}`,
      `Страница: ${window.location.href}`,
    ].join("\n");

    setError("");
    const alternativeProjects = selectedProjects.map((item) => (
      `${item.name} — ${getProjectManufacturerName(item)}, ID ${item.id}, ${item.area}, ${item.price}`
    )).join("\n");

    // The original lead is already being delivered when this screen opens.
    // Start the independent support notification immediately, and serialize only
    // the sheet update so the original row cannot overwrite the alternatives.
    // Confirmation from either external service must not keep the user on a
    // loading screen: form submission itself is synchronous, acknowledgements are not.
    const supportSubmission = sendSupportMessage(message);
    const sheetSubmission = (initialSheetRequestPromiseRef.current ?? Promise.resolve())
      .catch(() => undefined)
      .then(() => submitProjectQuoteApplication({
        ...initialQuotePayload,
        alternativeProjects,
      }));

    void Promise.allSettled([supportSubmission, sheetSubmission]);
    setAdditionalSent(true);
    setSubmitState("success");
  };

  const handleKeepOriginal = () => {
    setError("");
    setSubmitState("success");
  };

  const renderOptions = (
    options: readonly ChoiceOption[],
    value: string,
    onChange: (value: string) => void,
  ) => (
    <div className="grid grid-cols-2 gap-2.5">
      {options.map((option) => {
        const selected = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`group flex min-h-[86px] w-full flex-col items-start justify-between rounded-[var(--radius)] px-4 py-3.5 text-left transition-colors active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${
              selected ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted hover:text-primary"
            }`}
            aria-pressed={selected}
          >
            <span className="flex w-full items-start gap-3">
              <span className="flex-1 text-[15px] font-semibold leading-snug sm:text-[16px]">{option.value}</span>
              <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${selected ? "border-primary-foreground/70 bg-primary-foreground text-primary" : "border-border group-hover:border-primary/60"}`}>
                {selected && <Check className="h-3 w-3" strokeWidth={2.5} aria-hidden />}
              </span>
            </span>
            <span className={`mt-2 text-[11px] leading-snug ${selected ? "text-primary-foreground/75" : "text-muted-foreground"}`}>{option.note}</span>
          </button>
        );
      })}
    </div>
  );

  const question = step === "plot"
    ? "Расскажите немного об участке"
    : step === "location"
      ? plotStatus === "Участок уже есть"
        ? "Подскажите, где находится участок"
        : plotStatus === "Оформляю покупку"
          ? "Где находится выбранный участок"
          : "В каком районе вы подбираете участок"
      : step === "payment"
        ? "Какой способ оплаты вам удобнее?"
        : step === "bank"
          ? "Рассматриваете ли вы какой-то банк?"
          : step === "timing"
            ? "Когда вам было бы удобно начать строительство?"
            : "Как с вами связаться для расчёта?";

  const description = step === "plot"
    ? "Так мы точнее учтём доставку, монтаж и подготовительные работы."
    : step === "location"
      ? plotStatus === "Подбираю участок"
        ? "Укажите предпочтительный населённый пункт или район — так мы предварительно рассчитаем стоимость доставки."
        : "Укажите адрес как можно точнее — он нужен, чтобы рассчитать стоимость доставки дома до участка."
      : step === "payment"
        ? "Выберите ближайший вариант — при необходимости его можно будет изменить."
        : step === "bank"
          ? "Если банк ещё не выбран, можно так и отметить."
          : step === "timing"
            ? "Можно указать ориентировочный срок — это ни к чему не обязывает."
            : "Оставьте имя и телефон. Менеджер уточнит детали перед подготовкой расчёта.";

  const sectionLabel = step === "plot"
    ? "Участок"
    : step === "location"
      ? "Расчёт доставки"
      : step === "payment"
        ? "Способ оплаты"
        : step === "bank"
          ? "Ипотека"
          : step === "timing"
            ? "Срок строительства"
            : "Получить расчёт";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className={`project-price-quiz !inset-0 !h-[100dvh] !w-screen !max-w-none !translate-x-0 !translate-y-0 !gap-0 !overflow-hidden !rounded-none !border-0 bg-background !p-0 !shadow-none [&>button]:!right-4 [&>button]:!top-4 [&>button]:!z-[600] [&>button]:!bg-card/90 [&>button]:!text-card-foreground [&>button]:!opacity-100 ${previewProject ? "[&>button]:!hidden" : ""}`}>
        <div className={submitState === "success" ? "relative h-[100dvh]" : "project-price-quiz-layout h-[100dvh]"}>
          {submitState !== "success" && (
            <aside className="relative min-h-0 overflow-hidden bg-[#222b26] text-white">
            {firstImage && (
              <img
                src={firstImage}
                alt={`${project.name} от ${manufacturerName}`}
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,24,21,0.10)_0%,rgba(18,24,21,0.32)_45%,rgba(18,24,21,0.88)_100%)] md:bg-[linear-gradient(180deg,rgba(18,24,21,0.12)_0%,rgba(18,24,21,0.78)_100%)]" />
            <div className="relative flex h-full min-h-0 flex-col justify-end p-5 pr-16 sm:p-8 lg:p-12 xl:p-16">
              <p className="mb-2 text-[13px] font-medium text-white/75">
                {isRecommendationStep ? "Выбранный проект" : manufacturerName}
              </p>
              <h2 className="text-[30px] font-semibold leading-none tracking-[-0.04em] sm:text-[38px] lg:text-[54px]">{project.name}</h2>
              <div className="mt-3 flex items-center gap-3 text-[13px] text-white/85 sm:text-[14px] lg:mt-6 lg:text-[16px]">
                <span>{project.area}</span>
                <span>{priceLabel}</span>
              </div>
              <div className="mt-6 hidden max-w-[380px] text-[14px] leading-relaxed text-white/75 lg:mt-auto lg:block">
                {isRecommendationStep ? (
                  <>
                    <Check className="mb-3 h-5 w-5" strokeWidth={1.8} aria-hidden />
                    Этот проект уже включён в расчёт. Справа можно добавить варианты других производителей для сравнения.
                  </>
                ) : (
                  <>
                    <MapPin className="mb-3 h-5 w-5" strokeWidth={1.6} aria-hidden />
                    Производство в Екатеринбурге. Доставка рассчитывается индивидуально для вашего участка.
                  </>
                )}
              </div>
            </div>
            </aside>
          )}

          {isRecommendationStep ? (
            <section className="flex min-h-0 flex-col overflow-hidden bg-background" aria-labelledby="recommendations-title">
              <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5 pt-7 sm:px-8 lg:px-10 lg:pt-10">
                <DialogTitle id="recommendations-title" className="max-w-[540px] pr-8 text-[30px] font-semibold leading-[1.02] tracking-[-0.04em] text-foreground sm:text-[38px]">
                  Получите больше подходящих вариантов
                </DialogTitle>
                <DialogDescription className="mt-3 max-w-[520px] text-[14px] leading-relaxed text-muted-foreground sm:text-[15px]">
                  Подобрали проекты других производителей, доступные в вашем регионе и близкие по параметрам и бюджету. Сравните расчёты и выберите оптимальный вариант.
                </DialogDescription>

                <div className="mt-6 grid gap-3">
                  {recommendations.map((item) => {
                    const selected = selectedRecommendationIds.includes(item.id);
                    const image = item.gallery[0]?.image ?? "";
                    const itemPrice = /^(?:от(?:\s|$)|по запросу(?:\s|$))/i.test(item.price.trim())
                      ? item.price
                      : `от ${item.price}`;

                    return (
                      <article
                        key={item.id}
                        className={`group relative grid w-full grid-cols-[104px_minmax(0,1fr)_32px] gap-3 rounded-[var(--radius)] p-2.5 text-left transition-colors sm:grid-cols-[128px_minmax(0,1fr)_32px] ${
                          selected ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => openProjectPreview(item.id)}
                          className="absolute inset-y-0 left-0 right-11 z-10 rounded-[var(--radius)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                          aria-label={`Рассмотреть проект ${item.name}`}
                        />
                        <span className="pointer-events-none relative h-[104px] overflow-hidden rounded-[var(--radius)] bg-muted sm:h-[108px]">
                          {image && <img src={image} alt="" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.025] motion-reduce:transform-none" />}
                          <span className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-[var(--radius)] bg-black/45 text-white backdrop-blur-md">
                            <Expand className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden />
                          </span>
                        </span>
                        <span className="pointer-events-none flex min-w-0 flex-col py-0.5">
                          <span className={`block truncate text-[12px] font-medium ${selected ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{getProjectManufacturerName(item)}</span>
                          <span className="mt-1 block truncate text-[16px] font-semibold leading-tight sm:text-[18px]">{item.name}</span>
                          <span className={`mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[12px] ${selected ? "text-primary-foreground/75" : "text-muted-foreground"}`}>
                            <span>{item.area}</span>
                            <span>{itemPrice}</span>
                          </span>
                          <span className={`mt-auto flex items-center gap-1.5 pt-2 text-[11px] font-medium leading-snug ${selected ? "text-primary-foreground" : "text-primary"}`}>
                            <Expand className="h-3 w-3" strokeWidth={1.8} aria-hidden />
                            Рассмотреть проект
                          </span>
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleRecommendation(item.id)}
                          className={`relative z-20 mt-1 flex h-8 w-8 items-center justify-center rounded-[var(--radius)] border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${selected ? "border-primary-foreground/80 bg-primary-foreground text-primary" : "border-border bg-background text-transparent hover:border-primary/60"}`}
                          aria-label={selected ? `Убрать проект ${item.name} из расчётов` : `Добавить проект ${item.name} к расчётам`}
                          aria-pressed={selected}
                        >
                          {selected && <Check className="h-4 w-4" strokeWidth={2.5} aria-hidden />}
                        </button>
                      </article>
                    );
                  })}
                </div>

                {error && (
                  <div className="mt-4" aria-live="polite">
                    <p className="text-[13px] leading-relaxed text-red-600" role="alert">{error}</p>
                  </div>
                )}
              </div>

              <div className="bg-background px-5 py-4 sm:px-8 lg:px-10">
                <p className="mb-2 text-[11px] leading-relaxed text-muted-foreground">
                  Контакты получат только выбранные вами производители.
                </p>
                <button
                  type="button"
                  onClick={handleAdditionalSubmit}
                  disabled={!selectedRecommendationIds.length}
                  className="min-h-12 w-full rounded-[var(--radius)] bg-primary px-5 text-[15px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90 active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-30 disabled:active:translate-y-0"
                >
                  {selectedRecommendationIds.length
                    ? `Получить ещё ${selectedRecommendationIds.length} ${pluralizeCalculations(selectedRecommendationIds.length)}`
                    : "Выберите проекты"}
                </button>
                <button
                  type="button"
                  onClick={handleKeepOriginal}
                  className="mt-2 min-h-11 w-full rounded-[var(--radius)] px-5 text-[14px] font-semibold text-muted-foreground transition-colors hover:text-primary active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-wait disabled:opacity-50"
                >
                  Оставить только {project.name}
                </button>
              </div>
            </section>
          ) : submitState === "success" ? (
            <div className="relative flex h-full min-h-0 items-center justify-center overflow-y-auto overflow-x-hidden bg-background px-5 py-10 sm:px-10">
              <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
                {confettiPieces.map((piece, index) => (
                  <span
                    key={`${piece.left}-${index}`}
                    className="project-price-confetti absolute -top-5 h-3 w-1.5 rounded-[1px]"
                    style={{
                      left: `${piece.left}%`,
                      backgroundColor: piece.color,
                      animationDelay: `${piece.delay}ms`,
                      animationDuration: `${piece.duration}ms`,
                      "--confetti-drift": `${piece.drift}px`,
                      "--confetti-rotation": `${piece.rotation}deg`,
                    } as CSSProperties}
                  />
                ))}
              </div>

              <div className="relative z-10 mx-auto flex w-full max-w-[620px] flex-col items-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-[var(--radius)] bg-primary text-primary-foreground shadow-[0_12px_32px_rgba(63,112,234,0.22)]">
                  <Check className="h-6 w-6" strokeWidth={2.2} aria-hidden />
                </div>
                <DialogTitle className="mt-7 text-[36px] font-semibold leading-[1.02] tracking-[-0.04em] text-foreground sm:text-[46px]">
                  Заявка отправлена
                </DialogTitle>
                <DialogDescription className="mt-4 max-w-[560px] text-[15px] leading-relaxed text-muted-foreground sm:text-[16px]">
                  {additionalSent
                    ? `Вы получите ${selectedRecommendationIds.length + 1} ${pluralizeCalculations(selectedRecommendationIds.length + 1)}: по проекту ${project.name} и дополнительно ${selectedRecommendationIds.length === 1 ? `по проекту ${selectedRecommendationNamesLabel}` : `по проектам ${selectedRecommendationNamesLabel}`}. Производители свяжутся с вами по указанному телефону.`
                    : `Производитель получил параметры проекта ${project.name} и свяжется с вами по указанному телефону.`}
                </DialogDescription>

                <div className="mt-10 max-w-[520px]">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-primary">Много места в Telegram</p>
                  <h2 className="mt-3 text-[23px] font-semibold leading-tight tracking-[-0.025em] text-foreground sm:text-[28px]">
                    Следите за новыми проектами {telegramRegion}
                  </h2>
                  <p className="mx-auto mt-3 max-w-[470px] text-[14px] leading-relaxed text-muted-foreground sm:text-[15px]">
                    Публикуем интересные дома, новые предложения и производителей вашего региона.
                  </p>
                  <a
                    href="https://t.me/mnogomesta"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[var(--radius)] bg-primary px-6 text-[15px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90 active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 sm:w-auto"
                  >
                    <Send className="h-[18px] w-[18px]" strokeWidth={1.8} aria-hidden />
                    Подписаться в Telegram
                  </a>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenChange(false)}
                  className="mt-5 min-h-11 rounded-[var(--radius)] px-6 text-[14px] font-semibold text-muted-foreground transition-colors hover:text-primary active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                >
                  Закрыть
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex min-h-0 flex-col overflow-hidden">
              <div className="flex items-center px-5 pb-1 pt-6 sm:px-8 lg:px-10 lg:pt-10">
                <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{sectionLabel}</span>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5 pt-4 sm:px-8 lg:px-10 lg:pt-8">
                <DialogHeader className="pr-7 text-left">
                  <DialogTitle className="max-w-[520px] text-[30px] font-semibold leading-[1.04] tracking-[-0.04em] text-foreground sm:text-[38px]">
                    {question}
                  </DialogTitle>
                  <DialogDescription className="max-w-[470px] pt-3 text-[14px] leading-relaxed text-muted-foreground sm:text-[15px]">
                    {description}
                  </DialogDescription>
                </DialogHeader>

                <div className="mt-7">
                  {step === "location" && (
                    <>
                      <div>
                        <p className="mb-3 text-[14px] font-semibold text-foreground">
                          Укажите место участка на карте
                        </p>
                        <Suspense fallback={<div className="h-[320px] animate-pulse rounded-[var(--radius)] bg-muted sm:h-[360px] lg:h-[400px]" aria-label="Загружаем карту" />}>
                          <ProjectLocationMap
                            point={mapPoint}
                            onChange={(point) => {
                              setMapPoint(point);
                              setLocationUnknown(false);
                            }}
                          />
                        </Suspense>
                      </div>

                      <label className="mt-6 block text-[13px] font-medium text-foreground">
                        Или напишите точный адрес, населённый пункт или район
                        <input
                          value={locationDetails}
                          onChange={(event) => {
                            setLocationDetails(event.target.value);
                            setLocationUnknown(false);
                          }}
                          placeholder="Например, Свердловская область, посёлок Растущий"
                          className="mt-2 h-14 w-full rounded-[var(--radius)] border border-input bg-background px-4 text-[16px] text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15"
                        />
                      </label>

                      {plotStatus === "Подбираю участок" && (
                        <button
                          type="button"
                          onClick={handleLocationUnknown}
                          className="mt-4 min-h-11 rounded-[var(--radius)] px-1 text-left text-[14px] font-semibold text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                        >
                          Район пока не определён
                        </button>
                      )}
                    </>
                  )}
                  {step === "plot" && renderOptions(plotOptions, plotStatus, handlePlotStatus)}
                  {step === "payment" && renderOptions(paymentOptions, payment, (value) => {
                    setPayment(value);
                    if (value !== "Ипотека") setBank("");
                  })}
                  {step === "bank" && renderOptions(bankOptions, bank, setBank)}
                  {step === "timing" && renderOptions(timingOptions, timing, setTiming)}
                  {step === "contacts" && (
                    <div className="grid gap-5">
                      <label className="block text-[13px] font-medium text-foreground">
                        Имя
                        <input
                          autoFocus
                          value={name}
                          onChange={(event) => { setName(event.target.value); setError(""); }}
                          autoComplete="name"
                          className="mt-2 h-12 w-full rounded-[var(--radius)] border border-input bg-background px-4 text-[16px] text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15"
                        />
                      </label>
                      <label className="block text-[13px] font-medium text-foreground">
                        Телефон
                        <input
                          value={phone}
                          onChange={(event) => { setPhone(event.target.value); setError(""); }}
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          placeholder="+7 999 000-00-00"
                          className="mt-2 h-12 w-full rounded-[var(--radius)] border border-input bg-background px-4 text-[16px] text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15"
                        />
                      </label>
                      <p className="text-[11px] leading-relaxed text-muted-foreground">
                        Нажимая «Получить расчёт», вы соглашаетесь с <Link to="/legal/privacy/" className="underline underline-offset-2 hover:text-primary">политикой обработки персональных данных</Link>.
                      </p>
                    </div>
                  )}
                  {error && <p className="mt-4 text-[13px] leading-relaxed text-red-600" role="alert">{error}</p>}
                </div>
              </div>

              <div className="flex items-center gap-2 bg-background px-5 py-4 sm:px-8 lg:px-10">
                {stepIndex > 0 && (
                  <button
                    type="button"
                    onClick={goBack}
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius)] border border-input text-foreground transition-colors hover:border-primary/50 hover:text-primary active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                    aria-label="Назад"
                  >
                    <ArrowLeft className="h-5 w-5" strokeWidth={1.7} aria-hidden />
                  </button>
                )}
                {step === "contacts" ? (
                  <button
                    type="submit"
                    disabled={submitState === "submitting"}
                    className="min-h-12 flex-1 rounded-[var(--radius)] bg-primary px-5 text-[15px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90 active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-wait disabled:opacity-60"
                  >
                    {submitState === "submitting" ? "Отправляем..." : "Получить расчёт"}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={goForward}
                    disabled={!canContinue}
                    className="min-h-12 flex-1 rounded-[var(--radius)] bg-primary px-5 text-[15px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90 active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-30 disabled:active:translate-y-0"
                  >
                    Продолжить
                  </button>
                )}
              </div>
            </form>
          )}
        </div>

        {previewProject && previewImage && (
          <div
            className="absolute inset-0 z-[700] flex items-center justify-center bg-[#17201d]/35 p-3 sm:p-6"
            onClick={closeProjectPreview}
          >
            <section
              className="relative grid h-full max-h-[760px] w-full max-w-[980px] grid-rows-[minmax(230px,40dvh)_minmax(0,1fr)] overflow-hidden rounded-[var(--radius)] bg-card text-card-foreground shadow-[0_28px_90px_rgba(10,16,13,0.24)] lg:h-[min(700px,calc(100dvh-48px))] lg:grid-cols-[minmax(0,1.45fr)_minmax(340px,0.75fr)] lg:grid-rows-1"
              onClick={(event) => event.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label={`Кратко о проекте ${previewProject.name}`}
            >
              <button
                type="button"
                onClick={closeProjectPreview}
                className="absolute right-3 top-3 z-30 flex h-11 w-11 items-center justify-center rounded-[var(--radius)] bg-card/90 text-card-foreground shadow-sm transition-colors hover:bg-card hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 sm:right-4 sm:top-4"
                aria-label="Закрыть просмотр проекта"
              >
                <X className="h-5 w-5" strokeWidth={1.8} aria-hidden />
              </button>

              <div className="relative min-h-0 overflow-hidden bg-muted">
                <img
                  src={previewImage.image}
                  alt=""
                  className="absolute inset-[-24px] h-[calc(100%+48px)] w-[calc(100%+48px)] scale-110 object-cover opacity-40 blur-2xl"
                  aria-hidden
                />
                <img
                  src={previewImage.image}
                  alt={`${previewProject.name}, изображение ${previewImageIndex + 1}`}
                  className="relative h-full w-full object-contain"
                  style={{ objectPosition: previewImage.objectPosition }}
                />

                <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-[var(--radius)] bg-black/55 px-3 py-1.5 text-[12px] font-medium text-white backdrop-blur-md sm:bottom-4">
                  {previewImageIndex + 1} из {previewGallery.length}
                </span>

                {previewGallery.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={showPreviousPreviewImage}
                      className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-[var(--radius)] bg-card/90 text-card-foreground shadow-sm transition-colors hover:bg-card hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 sm:left-4 sm:h-11 sm:w-11"
                      aria-label="Предыдущее изображение"
                    >
                      <ChevronLeft className="h-5 w-5" strokeWidth={1.8} aria-hidden />
                    </button>
                    <button
                      type="button"
                      onClick={showNextPreviewImage}
                      className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-[var(--radius)] bg-card/90 text-card-foreground shadow-sm transition-colors hover:bg-card hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 sm:right-4 sm:h-11 sm:w-11"
                      aria-label="Следующее изображение"
                    >
                      <ChevronRight className="h-5 w-5" strokeWidth={1.8} aria-hidden />
                    </button>
                  </>
                )}
              </div>

              <div className="flex min-h-0 flex-col overflow-y-auto px-5 pb-5 pt-6 sm:px-8 sm:pb-8 lg:px-9 lg:py-9">
                <p className="pr-10 text-[13px] font-medium text-muted-foreground">{getProjectManufacturerName(previewProject)}</p>
                <h2 className="mt-2 pr-10 text-[30px] font-semibold leading-none tracking-[-0.04em] sm:text-[36px]">
                  {previewProject.name}
                </h2>
                <p className="mt-3 text-[13px] font-medium text-primary">{getProjectMatchLabel(project, previewProject)}</p>

                <div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-4 text-[14px]">
                  <div>
                    <p className="text-[12px] text-muted-foreground">Площадь</p>
                    <p className="mt-1 font-semibold">{previewProject.area}</p>
                  </div>
                  <div>
                    <p className="text-[12px] text-muted-foreground">Стоимость</p>
                    <p className="mt-1 font-semibold">{previewPriceLabel}</p>
                  </div>
                  <div>
                    <p className="text-[12px] text-muted-foreground">Планировка</p>
                    <p className="mt-1 font-semibold">{previewProject.rooms}</p>
                  </div>
                  <div>
                    <p className="text-[12px] text-muted-foreground">Срок</p>
                    <p className="mt-1 font-semibold">{previewProject.term}</p>
                  </div>
                </div>

                <p className="mt-5 text-[14px] leading-relaxed text-muted-foreground">{previewProject.description}</p>

              </div>
            </section>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProjectPriceQuiz;
