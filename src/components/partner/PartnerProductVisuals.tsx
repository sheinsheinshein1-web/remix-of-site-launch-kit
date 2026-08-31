import { BarChart3, Check, FileText, UserRound } from "lucide-react";
import ManufacturerName from "@/components/ManufacturerName";
import catalogScreenshot from "@/assets/partner-screens/catalog.png";
import manufacturerScreenshot from "@/assets/partner-screens/manufacturer.png";
import projectScreenshot from "@/assets/partner-screens/project.png";
import regionsScreenshot from "@/assets/partner-screens/regions.png";
import { partnerCommercialTerms } from "@/data/partnerProgram";
import type { MakerSummary, Project } from "@/data/projects";
import { getCityPrepositionalName } from "@/lib/cityDisplay";
import { cn } from "@/lib/utils";

const largeVisualClassName = "xl:flex xl:aspect-square xl:items-center";
const heroVisualClassName = "xl:flex xl:aspect-[16/10] xl:items-center";

type PartnerVisualLayout = "feature" | "hero";

const getVisualLayoutClassName = (layout: PartnerVisualLayout) =>
  layout === "hero" ? heroVisualClassName : largeVisualClassName;

type ProjectVisualProps = {
  projects: Project[];
  maker: MakerSummary;
};

type PlatformScreenshotProps = {
  src: string;
  alt: string;
  layout?: PartnerVisualLayout;
  imageClassName?: string;
};

const PlatformScreenshot = ({ src, alt, layout = "feature", imageClassName }: PlatformScreenshotProps) => (
  <div className={`partner-platform-screenshot flex items-center justify-center overflow-hidden rounded-[var(--radius)] bg-[#eef0f4] p-3 sm:p-5 md:p-7 dark:bg-secondary ${layout === "hero" ? "aspect-square sm:aspect-[16/10]" : "aspect-square"}`}>
    <img
      src={src}
      alt={alt}
      width={4486}
      height={2648}
      className={cn(
        "partner-platform-screenshot-image flex-none rounded-[var(--radius)] object-contain object-center",
        layout === "hero"
          ? "h-full w-full scale-[1.06] translate-y-[2.5%]"
          : "h-[82%] w-auto max-w-none",
        imageClassName,
      )}
      loading="lazy"
      decoding="async"
      draggable={false}
    />
  </div>
);

export const PartnerMarketplacePreview = (_props: ProjectVisualProps) => (
  <PlatformScreenshot
    src={catalogScreenshot}
    alt="Каталог проектов модульных домов на платформе Много места"
    layout="hero"
  />
);

export const PartnerProfilePreview = (_props: ProjectVisualProps) => (
  <PlatformScreenshot
    src={manufacturerScreenshot}
    alt="Страница производителя Платформа на сервисе Много места"
    imageClassName="!-translate-x-[3%] !scale-[1.07]"
  />
);

export const PartnerProjectPagePreview = (_props: ProjectVisualProps) => (
  <PlatformScreenshot
    src={projectScreenshot}
    alt="Страница проекта Wide House на сервисе Много места"
  />
);

export const PartnerDeliveryPreview = (_props: ProjectVisualProps) => (
  <PlatformScreenshot
    src={regionsScreenshot}
    alt="Страница регионов доставки на сервисе Много места"
  />
);

const crmRows = [
  ["Новая заявка", "Дом 65 м²", "Сегодня, 11:40"],
  ["Расчёт отправлен", "Barn 103", "Вчера, 16:15"],
  ["Встреча назначена", "Дом 82 м²", "12 августа"],
];

export const PartnerCrmPreview = ({ layout = "feature" }: { layout?: PartnerVisualLayout }) => (
  <div className={`rounded-[var(--radius)] bg-[#eef0f4] p-3 sm:p-5 md:p-7 dark:bg-secondary ${getVisualLayoutClassName(layout)}`}>
    <div className="w-full rounded-[var(--radius)] bg-white p-5 sm:p-7 dark:bg-card">
      <div className="flex items-start justify-between gap-5">
        <div>
          <p className="text-[18px] font-semibold text-[#342d27] md:text-[22px] dark:text-foreground">Обращения из Много места</p>
          <p className="mt-1 text-[12px] text-muted-foreground md:text-[13px]">Источник, проект и этап сделки в одной воронке</p>
        </div>
        <BarChart3 className="h-5 w-5 text-primary" strokeWidth={1.6} aria-hidden />
      </div>
      <div className="mt-7 space-y-3">
        {crmRows.map(([stage, project, time], index) => (
          <div key={stage} className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 rounded-[var(--radius)] bg-[#f4f5f7] p-4 dark:bg-secondary">
            <div className="min-w-0">
              <p className="text-[14px] font-medium text-[#342d27] dark:text-foreground">{stage}</p>
              <p className="mt-1 truncate text-[12px] text-muted-foreground">{project} · Москва</p>
            </div>
            <div className="text-right">
              <p className="text-[12px] text-muted-foreground">{time}</p>
              <p className="mt-1 text-[12px] font-medium text-primary">№ {1248 + index}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3 text-center">
        <div><p className="text-[20px] font-semibold text-[#342d27] dark:text-foreground">18</p><p className="mt-1 text-[11px] text-muted-foreground">новых</p></div>
        <div><p className="text-[20px] font-semibold text-[#342d27] dark:text-foreground">7</p><p className="mt-1 text-[11px] text-muted-foreground">в работе</p></div>
        <div><p className="text-[20px] font-semibold text-[#342d27] dark:text-foreground">3</p><p className="mt-1 text-[11px] text-muted-foreground">сделки</p></div>
      </div>
    </div>
  </div>
);

export const PartnerLeadPreview = () => (
  <div className={`rounded-[var(--radius)] bg-[#eef0f4] p-3 sm:p-5 md:p-7 dark:bg-secondary ${largeVisualClassName}`}>
    <div className="w-full rounded-[var(--radius)] bg-white p-5 sm:p-7 dark:bg-card">
      <div className="flex items-start justify-between gap-5">
        <div>
          <p className="text-[18px] font-semibold text-[#342d27] md:text-[22px] dark:text-foreground">Новое обращение</p>
          <p className="mt-1 text-[12px] text-muted-foreground md:text-[13px]">Заявка № 1248 · сегодня, 11:40</p>
        </div>
        <UserRound className="h-5 w-5 text-primary" strokeWidth={1.6} aria-hidden />
      </div>
      <dl className="mt-7 grid gap-x-8 gap-y-5 sm:grid-cols-2">
        <div>
          <dt className="text-[11px] text-muted-foreground">Покупатель</dt>
          <dd className="mt-1 text-[14px] font-medium text-[#342d27] dark:text-foreground">Алексей · +7 900 000-00-00</dd>
        </div>
        <div>
          <dt className="text-[11px] text-muted-foreground">Регион</dt>
          <dd className="mt-1 text-[14px] font-medium text-[#342d27] dark:text-foreground">Москва</dd>
        </div>
        <div>
          <dt className="text-[11px] text-muted-foreground">Проект</dt>
          <dd className="mt-1 text-[14px] font-medium text-[#342d27] dark:text-foreground">Barn 103 · 103 м²</dd>
        </div>
        <div>
          <dt className="text-[11px] text-muted-foreground">Источник</dt>
          <dd className="mt-1 text-[14px] font-medium text-[#342d27] dark:text-foreground">многоместа.рф / проект</dd>
        </div>
      </dl>
      <div className="mt-7 rounded-[var(--radius)] bg-[#f4f5f7] p-4 dark:bg-secondary">
        <p className="text-[11px] text-muted-foreground">Запрос покупателя</p>
        <p className="mt-2 text-[13px] leading-relaxed text-[#342d27] dark:text-foreground">Нужен расчёт комплектации с доставкой и сборкой. Планируем строительство осенью.</p>
      </div>
    </div>
  </div>
);

const dealHistoryRows = [
  ["Обращение получено", "12 августа, 11:40"],
  ["Расчёт отправлен", "12 августа, 16:15"],
  ["Встреча назначена", "14 августа, 10:00"],
  ["Договор подтверждён", "28 августа, 17:20"],
];

export const PartnerDealHistoryPreview = () => (
  <div className={`rounded-[var(--radius)] bg-[#eef0f4] p-3 sm:p-5 md:p-7 dark:bg-secondary ${largeVisualClassName}`}>
    <div className="w-full rounded-[var(--radius)] bg-white p-5 sm:p-7 dark:bg-card">
      <div className="flex items-start justify-between gap-5">
        <div>
          <p className="text-[18px] font-semibold text-[#342d27] md:text-[22px] dark:text-foreground">История сделки</p>
          <p className="mt-1 text-[12px] text-muted-foreground md:text-[13px]">Barn 103 · покупатель из Москвы</p>
        </div>
        <FileText className="h-5 w-5 text-primary" strokeWidth={1.6} aria-hidden />
      </div>
      <ol className="mt-7">
        {dealHistoryRows.map(([stage, time], index) => (
          <li key={stage} className="grid grid-cols-[20px_minmax(0,1fr)_auto] items-center gap-3 border-b border-border py-4 last:border-b-0">
            <span className="flex h-5 w-5 items-center justify-center text-primary" aria-hidden>
              <Check className="h-4 w-4" strokeWidth={1.8} />
            </span>
            <span className="text-[13px] font-medium text-[#342d27] md:text-[14px] dark:text-foreground">{stage}</span>
            <span className="text-right text-[11px] text-muted-foreground md:text-[12px]">{time}</span>
          </li>
        ))}
      </ol>
      <div className="mt-6 flex items-center justify-between gap-5 rounded-[var(--radius)] bg-[#f4f5f7] p-4 dark:bg-secondary">
        <div>
          <p className="text-[11px] text-muted-foreground">Ответственный</p>
          <p className="mt-1 text-[13px] font-medium text-[#342d27] dark:text-foreground">Менеджер производителя</p>
        </div>
        <p className="text-right text-[12px] font-medium text-primary">Сделка подтверждена</p>
      </div>
    </div>
  </div>
);

export const PartnerCommissionPreview = () => (
  <div className={`rounded-[var(--radius)] bg-[#eef0f4] p-3 sm:p-5 md:p-7 dark:bg-secondary ${largeVisualClassName}`}>
    <div className="w-full rounded-[var(--radius)] bg-white p-5 sm:p-7 dark:bg-card">
      <p className="text-[18px] font-semibold text-[#342d27] md:text-[22px] dark:text-foreground">Расчёт по состоявшейся сделке</p>
      <p className="mt-1 text-[12px] text-muted-foreground md:text-[13px]">Условия зафиксированы в договоре до запуска</p>
      <dl className="mt-8 space-y-5">
        <div className="flex items-baseline justify-between gap-5">
          <dt className="text-[13px] text-muted-foreground">Стоимость договора покупателя</dt>
          <dd className="text-[15px] font-semibold tabular-nums text-[#342d27] dark:text-foreground">4 800 000 ₽</dd>
        </div>
        <div className="flex items-baseline justify-between gap-5">
          <dt className="text-[13px] text-muted-foreground">Согласованное вознаграждение</dt>
          <dd className="text-[15px] font-semibold tabular-nums text-[#342d27] dark:text-foreground">5%</dd>
        </div>
        <div className="border-t border-border pt-5">
          <div className="flex items-baseline justify-between gap-5">
            <dt className="text-[14px] font-medium text-[#342d27] dark:text-foreground">Вознаграждение после сделки</dt>
            <dd className="text-[24px] font-semibold tabular-nums tracking-[-0.025em] text-[#342d27] md:text-[28px] dark:text-foreground">240 000 ₽</dd>
          </div>
        </div>
      </dl>
      <p className="mt-8 rounded-[var(--radius)] bg-[#f4f5f7] p-4 text-[12px] leading-relaxed text-muted-foreground dark:bg-secondary">Демонстрационный расчёт при вознаграждении 5%. В договоре фиксируется порядок подтверждения состоявшейся сделки.</p>
    </div>
  </div>
);

export const PartnerRenderingEstimatePreview = () => (
  <div className={`rounded-[var(--radius)] bg-[#eef0f4] p-3 sm:p-5 md:p-7 dark:bg-secondary ${largeVisualClassName}`}>
    <div className="w-full rounded-[var(--radius)] bg-white p-5 sm:p-7 dark:bg-card">
      <div className="flex items-start justify-between gap-5">
        <div>
          <p className="text-[18px] font-semibold text-[#342d27] md:text-[22px] dark:text-foreground">Полная визуальная линейка</p>
          <p className="mt-1 text-[12px] text-muted-foreground md:text-[13px]">Каждый проект усиливает всю линейку</p>
        </div>
        <FileText className="h-5 w-5 text-primary" strokeWidth={1.6} aria-hidden />
      </div>
      <dl className="mt-7 space-y-5">
        <div className="flex items-baseline justify-between gap-5">
          <dt className="text-[13px] text-muted-foreground">Проекты производителя</dt>
          <dd className="text-[14px] font-medium text-[#342d27] dark:text-foreground">весь ассортимент</dd>
        </div>
        <div className="flex items-baseline justify-between gap-5">
          <dt className="text-[13px] text-muted-foreground">Экстерьеры и интерьеры</dt>
          <dd className="text-[14px] font-medium text-[#342d27] dark:text-foreground">полный комплект</dd>
        </div>
        <div className="flex items-baseline justify-between gap-5">
          <dt className="text-[13px] text-muted-foreground">Платформа, сайт и реклама</dt>
          <dd className="text-[14px] font-medium text-[#342d27] dark:text-foreground">готовые форматы</dd>
        </div>
      </dl>
      <div className="mt-7 rounded-[var(--radius)] bg-[#f4f5f7] p-4 dark:bg-secondary">
        <p className="text-[11px] text-muted-foreground">Стоимость</p>
        <p className="mt-2 text-[26px] font-semibold tabular-nums tracking-[-0.025em] text-[#342d27] md:text-[30px] dark:text-foreground">{partnerCommercialTerms.renderingPrice}</p>
        <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">за проект. Общую стоимость оформления всей линейки фиксируем до начала работы.</p>
      </div>
    </div>
  </div>
);

export const PartnerWebsitePreview = ({
  projects,
  maker,
  layout = "feature",
}: ProjectVisualProps & { layout?: PartnerVisualLayout }) => {
  const project = projects[0];

  return (
    <div className={`rounded-[var(--radius)] bg-[#e8ebf0] p-3 sm:p-5 md:p-7 dark:bg-secondary ${getVisualLayoutClassName(layout)}`}>
      <div className="w-full overflow-hidden rounded-[var(--radius)] bg-white dark:bg-card">
        <div className="flex h-10 items-center gap-3 bg-[#f4f5f7] px-4 text-[11px] text-muted-foreground dark:bg-secondary">
          <span className="h-2 w-2 rounded-[var(--radius)] bg-[#b7bdc8]" aria-hidden />
          <span className="truncate">{maker.id}.дома.рф</span>
        </div>
        <div className="p-5 sm:p-7">
          <div className="flex items-center justify-between gap-4">
            <ManufacturerName makerId={maker.id} name={maker.name} nameClassName="text-[18px] font-semibold text-[#342d27] md:text-[21px] dark:text-foreground" />
            <span className="text-[12px] text-muted-foreground">Проекты · О компании · Контакты</span>
          </div>
          {project && (
            <div className="mt-6 grid gap-5 sm:grid-cols-[1.15fr_0.85fr] sm:items-center">
              <img src={project.gallery[0]?.image} alt="" className="aspect-[4/3] w-full rounded-[var(--radius)] object-cover" loading="lazy" decoding="async" />
              <div>
                <p className="text-[22px] font-semibold leading-tight text-[#342d27] md:text-[28px] dark:text-foreground">{project.name}</p>
                <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">{project.area} · {project.rooms}. Производство {getCityPrepositionalName(maker.city)}, доставка по региону.</p>
                <div className="mt-5 inline-flex min-h-10 items-center rounded-[var(--radius)] bg-primary px-4 text-[12px] font-medium text-white">Получить расчёт</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const PartnerBusinessPreview = ({
  projects,
  maker,
  layout = "feature",
}: ProjectVisualProps & { layout?: PartnerVisualLayout }) => (
  <div className={`rounded-[var(--radius)] bg-[#1f242c] p-3 text-white sm:p-5 md:p-7 ${getVisualLayoutClassName(layout)}`}>
    <div className="w-full rounded-[var(--radius)] bg-[#2a3039] p-5 sm:p-7">
      <div className="flex items-end justify-between gap-5">
        <div>
          <p className="text-[20px] font-semibold md:text-[24px]">Проекты для бизнеса</p>
          <p className="mt-2 text-[12px] text-white/58 md:text-[13px]">Глэмпинги, гостиницы, базы отдыха и арендные объекты</p>
        </div>
        <p className="hidden text-right text-[12px] text-white/58 sm:block">Отдельный раздел<br />на платформе</p>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {projects.slice(0, 3).map((project, index) => (
          <div key={project.id} className={index === 2 ? "hidden sm:block" : ""}>
            <img src={project.gallery[0]?.image} alt="" className="aspect-[4/3] w-full rounded-[var(--radius)] object-cover" loading="lazy" decoding="async" />
            <p className="mt-2 truncate text-[12px] font-medium text-white">{project.name}</p>
            <p className="mt-1 text-[11px] text-white/50">{project.maker.name || maker.name}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);
