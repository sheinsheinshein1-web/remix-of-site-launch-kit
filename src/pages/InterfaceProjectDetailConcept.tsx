import { useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Forward,
  Heart,
  MapPin,
  Scale,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useCity } from "@/components/CitySelector";
import ManufacturerLogo from "@/components/ManufacturerLogo";
import ProjectPriceQuiz from "@/components/ProjectPriceQuiz";
import Seo from "@/components/Seo";
import VerifiedBadge from "@/components/VerifiedBadge";
import { useFavorites } from "@/contexts/FavoritesContext";
import { manufacturerRegistry } from "@/data/manufacturers";
import { getManufacturerRatingSummary } from "@/data/manufacturerRatings";
import { projects, projectsCountByMakerId } from "@/data/projects";
import { getManufacturerPath } from "@/lib/siteRoutes";
import { isVerifiedMaker } from "@/lib/verifiedMakers";

const project = projects.find((item) => item.id === 40);

const InterfaceProjectDetailConcept = () => {
  const [activePhoto, setActivePhoto] = useState(0);
  const [activePlan, setActivePlan] = useState(0);
  const [inCompare, setInCompare] = useState(false);
  const [priceQuizOpen, setPriceQuizOpen] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { city: deliveryRegion } = useCity();

  if (!project) return null;
  const manufacturer = manufacturerRegistry[project.manufacturerId];
  if (!manufacturer) return null;

  const photos = project.gallery.slice(0, -2);
  const plans = project.gallery.slice(-2);
  const plan = plans[activePlan] ?? plans[0];
  const liked = isFavorite(project.id);
  const verified = isVerifiedMaker(project.manufacturerId);
  const reviewSummary = getManufacturerRatingSummary(project.manufacturerId);
  const makerProjectsCount = projectsCountByMakerId[project.manufacturerId] ?? 0;
  const makerHref = getManufacturerPath(project.manufacturerId);
  const sourceUrl = project.sourceUrl ?? manufacturer.siteUrl;

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
      image: photos[0]?.image ?? "",
      likes: project.likes,
      city: project.city,
    });
  };

  const handleShare = async () => {
    const shareData = { title: `${project.name} | Много места`, url: window.location.href };
    if (navigator.share) {
      await navigator.share(shareData).catch(() => undefined);
      return;
    }
    await navigator.clipboard?.writeText(window.location.href).catch(() => undefined);
  };

  const showPhoto = (offset: number) => {
    setActivePhoto((current) => (current + offset + photos.length) % photos.length);
  };

  const focusClass = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3157ff] focus-visible:ring-offset-2";

  return (
    <div className="min-h-[100dvh] bg-[#f3f5f5] pb-24 text-[#111617] lg:pb-0" style={{ fontFamily: '"Helvetica Neue", Arial, sans-serif' }}>
      <Seo
        title="ПАТИО | карточка проекта"
        description="Карточка модульного дома ПАТИО от Bygge."
        canonicalPath="/lab/interface-cards/project"
        noIndex
      />
      <style>{`
        @media (min-width: 1024px) {
          .patio-market-grid {
            grid-template-columns: minmax(0, 1fr) 400px;
          }
          .patio-market-gallery {
            aspect-ratio: auto;
            height: clamp(560px, calc(100vh - 170px), 760px);
          }
          .patio-plan-grid {
            grid-template-columns: minmax(0, 1.15fr) minmax(340px, .55fr);
          }
          .patio-maker-grid {
            grid-template-columns: minmax(0, .9fr) minmax(420px, 1.1fr);
          }
        }
      `}</style>

      <main>
        <section id="overview" className="scroll-mt-16 p-2.5 sm:p-4 lg:p-6" aria-labelledby="project-title">
          <div className="patio-market-grid mx-auto grid max-w-[1600px] gap-5 lg:gap-7">
            <div className="min-w-0">
              <div className="patio-market-gallery relative aspect-[65/54] overflow-hidden rounded-[22px] bg-[#202421] lg:rounded-[26px]">
                <img
                  src={photos[activePhoto]?.image}
                  alt={`Дом ПАТИО, фотография ${activePhoto + 1}`}
                  className="h-full w-full object-contain lg:object-cover"
                  loading={activePhoto === 0 ? "eager" : "lazy"}
                  decoding="async"
                />

                <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3 sm:p-5">
                  <Link
                    to="/lab/interface-cards"
                    className={`flex h-11 w-11 items-center justify-center rounded-full bg-[#f7f8f6] text-[#111617] shadow-sm transition-transform hover:-translate-x-0.5 active:scale-[0.97] ${focusClass}`}
                    aria-label="Вернуться к карточкам"
                  >
                    <ArrowLeft className="h-5 w-5" strokeWidth={1.7} aria-hidden />
                  </Link>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={handleShare} className={`flex h-11 w-11 items-center justify-center rounded-full bg-[#f7f8f6] text-[#111617] shadow-sm transition-transform hover:-translate-y-0.5 active:scale-[0.97] ${focusClass}`} aria-label="Поделиться">
                      <Forward className="h-5 w-5" strokeWidth={1.7} aria-hidden />
                    </button>
                    <button type="button" onClick={handleFavorite} className={`flex h-11 w-11 items-center justify-center rounded-full bg-[#f7f8f6] text-[#111617] shadow-sm transition-transform hover:-translate-y-0.5 active:scale-[0.97] ${focusClass}`} aria-label={liked ? "Убрать из избранного" : "Добавить в избранное"} aria-pressed={liked}>
                      <Heart className={`h-5 w-5 ${liked ? "fill-[#3157ff] text-[#3157ff]" : ""}`} strokeWidth={1.7} aria-hidden />
                    </button>
                  </div>
                </div>

                <button type="button" onClick={() => showPhoto(-1)} className={`absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-[#111617]/65 text-white backdrop-blur-md transition-colors hover:bg-[#111617]/85 active:scale-[0.97] sm:left-5 ${focusClass}`} aria-label="Предыдущая фотография">
                  <ChevronLeft className="h-5 w-5" strokeWidth={1.8} aria-hidden />
                </button>
                <button type="button" onClick={() => showPhoto(1)} className={`absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-[#111617]/65 text-white backdrop-blur-md transition-colors hover:bg-[#111617]/85 active:scale-[0.97] sm:right-5 ${focusClass}`} aria-label="Следующая фотография">
                  <ChevronRight className="h-5 w-5" strokeWidth={1.8} aria-hidden />
                </button>
              </div>

              <div className="mt-2.5 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Фотографии проекта">
                {photos.map((photo, index) => (
                  <button
                    key={photo.image}
                    type="button"
                    onClick={() => setActivePhoto(index)}
                    className={`relative h-[58px] w-[74px] shrink-0 overflow-hidden rounded-[10px] bg-[#d9ddda] transition-opacity active:scale-[0.98] sm:h-[72px] sm:w-[92px] ${activePhoto === index ? "ring-2 ring-[#3157ff] ring-offset-2" : "opacity-60 hover:opacity-100"} ${focusClass}`}
                    aria-label={`Показать фотографию ${index + 1}`}
                    aria-pressed={activePhoto === index}
                  >
                    <img src={photo.image} alt="" className="h-full w-full object-cover" loading={index < 4 ? "eager" : "lazy"} decoding="async" />
                  </button>
                ))}
              </div>
            </div>

            <aside className="flex min-w-0 flex-col px-2 pb-6 pt-1 sm:px-1 lg:min-h-[640px] lg:justify-between lg:py-2">
              <div>
                <Link to={makerHref} className={`inline-flex min-h-11 items-center gap-3 text-[14px] font-semibold ${focusClass}`}>
                  <ManufacturerLogo manufacturer={manufacturer} className="h-9 w-9 rounded-full text-[8px]" />
                  {manufacturer.name}
                  {verified && <VerifiedBadge className="bg-[#e7eaea] text-[#4e5859]" />}
                </Link>

                <div className="mt-7 flex items-start justify-between gap-4">
                  <div>
                    <h1 id="project-title" className="text-[38px] font-semibold leading-none tracking-[-0.05em] lg:text-[46px]">{project.name}</h1>
                    <p className="mt-3 max-w-[30ch] text-[15px] leading-relaxed text-[#626b6c]">Модульный дом для постоянного проживания</p>
                  </div>
                  <button type="button" onClick={() => setInCompare((value) => !value)} className={`flex h-11 shrink-0 items-center gap-2 rounded-[12px] px-3 text-[13px] font-semibold transition-colors active:scale-[0.98] ${inCompare ? "bg-[#3157ff] text-white" : "bg-white text-[#2d3536] hover:bg-[#e8ebeb]"} ${focusClass}`} aria-label={inCompare ? "Убрать из сравнения" : "Добавить в сравнение"} aria-pressed={inCompare}>
                    <Scale className="h-4 w-4" strokeWidth={1.7} aria-hidden />
                    <span className="hidden sm:inline lg:hidden xl:inline">{inCompare ? "В сравнении" : "Сравнить"}</span>
                  </button>
                </div>

                <div className="mt-7 rounded-[18px] bg-white p-4 sm:p-5">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-[12px] text-[#71797a]">Цена под ключ</p>
                      <p className="mt-1 text-[27px] font-semibold tracking-[-0.035em]">от {project.price}</p>
                    </div>
                    <span className="rounded-[9px] bg-[#e8eefc] px-2.5 py-1.5 text-[12px] font-semibold text-[#2447bd]">60 дней</span>
                  </div>

                  <dl className="mt-5 grid grid-cols-4 gap-3">
                    {[
                      ["Площадь", project.area],
                      ["Спальни", String(project.beds)],
                      ["Санузел", String(project.baths)],
                      ["Этаж", String(project.floors)],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <dt className="text-[11px] text-[#7b8384]">{label}</dt>
                        <dd className="mt-1 text-[17px] font-semibold">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div className="mt-3 flex items-start gap-3 rounded-[16px] bg-[#e7ebea] p-4">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#3157ff]" strokeWidth={1.7} aria-hidden />
                  <div>
                    <p className="text-[13px] font-semibold">Производство в Екатеринбурге</p>
                    <p className="mt-1 text-[12px] leading-relaxed text-[#687171]">Доставку и монтаж рассчитают для вашего участка.</p>
                  </div>
                </div>

                <button type="button" onClick={() => setPriceQuizOpen(true)} className={`mt-5 hidden min-h-14 w-full items-center justify-center rounded-[14px] bg-[#3157ff] px-5 text-[15px] font-semibold text-white transition-colors hover:bg-[#2447bd] active:scale-[0.99] lg:flex ${focusClass}`}>
                  Получить расчёт
                </button>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <a href={sourceUrl} target="_blank" rel="noopener noreferrer nofollow sponsored" className={`flex min-h-12 items-center justify-center gap-2 rounded-[13px] bg-white px-3 text-center text-[13px] font-semibold transition-colors hover:bg-[#e8ebeb] active:scale-[0.98] ${focusClass}`}>
                    Сайт Bygge
                    <ArrowUpRight className="h-4 w-4" strokeWidth={1.7} aria-hidden />
                  </a>
                  <button type="button" onClick={handleFavorite} className={`flex min-h-12 items-center justify-center gap-2 rounded-[13px] bg-white px-3 text-[13px] font-semibold transition-colors hover:bg-[#e8ebeb] active:scale-[0.98] ${focusClass}`}>
                    <Heart className={`h-4 w-4 ${liked ? "fill-[#3157ff] text-[#3157ff]" : ""}`} strokeWidth={1.7} aria-hidden />
                    {liked ? "Сохранено" : "Сохранить"}
                  </button>
                </div>
              </div>

              <p className="mt-6 text-[12px] leading-relaxed text-[#7a8282]">Цена зависит от региона, фундамента и выбранных опций. Финальную сумму подтверждает производитель.</p>
            </aside>
          </div>
        </section>

        <nav className="sticky top-0 z-30 border-y border-[#dfe3e2] bg-[#f3f5f5]/92 backdrop-blur-xl" aria-label="Разделы проекта">
          <div className="mx-auto flex max-w-[1600px] gap-1 overflow-x-auto px-3 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:px-4 lg:px-6">
            {[["overview", "Обзор"], ["plan", "Планировка"], ["specs", "Комплектация"], ["maker", "Производитель"]].map(([id, label]) => (
              <a key={id} href={`#${id}`} className={`flex min-h-10 shrink-0 items-center rounded-[11px] px-4 text-[13px] font-semibold text-[#586162] transition-colors hover:bg-white hover:text-[#111617] ${focusClass}`}>
                {label}
              </a>
            ))}
          </div>
        </nav>

        <section id="plan" className="scroll-mt-16 px-3 py-14 sm:px-4 lg:px-6 lg:py-20" aria-labelledby="plan-title">
          <div className="patio-plan-grid mx-auto grid max-w-[1400px] gap-8 lg:items-center lg:gap-16">
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h2 id="plan-title" className="text-[32px] font-semibold tracking-[-0.04em] sm:text-[40px]">Планировка</h2>
                <div className="flex gap-2" aria-label="Выбор планировки">
                  {plans.map((item, index) => (
                    <button key={item.image} type="button" onClick={() => setActivePlan(index)} className={`flex h-11 w-11 items-center justify-center rounded-[12px] text-[13px] font-semibold transition-colors active:scale-[0.97] ${activePlan === index ? "bg-[#3157ff] text-white" : "bg-white text-[#111617] hover:bg-[#e8ebeb]"} ${focusClass}`} aria-label={`Показать планировку ${index + 1}`} aria-pressed={activePlan === index}>
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>
              <div className="overflow-hidden rounded-[22px] bg-white p-3 sm:p-6">
                <img src={plan.image} alt={`Планировка ПАТИО ${activePlan + 1}`} className="aspect-[4/3] h-full w-full object-contain" loading="lazy" decoding="async" />
              </div>
            </div>

            <div>
              <p className="text-[27px] font-semibold leading-[1.12] tracking-[-0.035em]">Три спальни, санузел и общая кухня-гостиная</p>
              <p className="mt-4 text-[15px] leading-[1.65] text-[#5e6869]">В доме можно жить круглый год. Инженерия и чистовая отделка выполняются на производстве.</p>

              <dl className="mt-7 grid grid-cols-2 gap-3">
                {[["Габариты", "7,3 × 6,1 м"], ["Потолки", "2,5 м"], ["Назначение", project.purpose], ["Участок", "3-6 соток"]].map(([label, value]) => (
                  <div key={label} className="rounded-[15px] bg-white p-4">
                    <dt className="text-[11px] text-[#768080]">{label}</dt>
                    <dd className="mt-1.5 text-[17px] font-semibold">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        <section id="specs" className="scroll-mt-16 px-3 pb-14 sm:px-4 lg:px-6 lg:pb-20" aria-labelledby="specs-title">
          <div className="mx-auto max-w-[1400px] rounded-[24px] bg-white p-5 sm:p-8 lg:p-10">
            <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
              <div>
                <h2 id="specs-title" className="text-[32px] font-semibold tracking-[-0.04em] sm:text-[40px]">Комплектация под ключ</h2>
                <p className="mt-4 max-w-[42ch] text-[15px] leading-[1.65] text-[#5e6869]">Дом приезжает на участок с отделкой и готовой инженерией. Остаётся подключить внешние сети.</p>
                <ul className="mt-7 grid gap-3">
                  {["Кабельные тёплые полы", "Оборудованный санузел", "Вытяжная вентиляция", "Защитная сетка от грызунов"].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-[14px] font-medium">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[9px] bg-[#e8eefc] text-[#3157ff]">
                        <Check className="h-4 w-4" strokeWidth={2} aria-hidden />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-[18px] font-semibold">Технические данные</p>
                <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-3">
                  {[["Технология", project.technology], ["Готовность", project.completion], ["Утепление", project.insulation], ["Этажность", `${project.floors} этаж`], ["Стиль", project.style], ["Производство", project.city]].map(([label, value]) => (
                    <div key={label}>
                      <dt className="text-[12px] text-[#768080]">{label}</dt>
                      <dd className="mt-1.5 text-[16px] font-semibold leading-snug">{value}</dd>
                    </div>
                  ))}
                </dl>

                <details className="group mt-8 rounded-[16px] bg-[#f0f2f2] p-4 open:bg-[#e9eded]">
                  <summary className={`flex min-h-7 cursor-pointer list-none items-center justify-between text-[14px] font-semibold [&::-webkit-details-marker]:hidden ${focusClass}`}>
                    Подробное описание
                    <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90" strokeWidth={1.8} aria-hidden />
                  </summary>
                  <p className="mt-3 text-[14px] leading-[1.65] text-[#5e6869]">{project.descriptionLong.replace(/^ПАТИО\s+\u2014\s+/, "ПАТИО: ")}</p>
                </details>
              </div>
            </div>
          </div>
        </section>

        <section id="maker" className="scroll-mt-16 px-3 pb-16 sm:px-4 lg:px-6 lg:pb-24" aria-labelledby="maker-title">
          <article className="patio-maker-grid mx-auto grid max-w-[1400px] gap-6 rounded-[24px] bg-[#e7ebea] p-4 sm:p-6 lg:items-stretch lg:p-7">
            <div className="flex flex-col justify-between p-2 sm:p-4 lg:p-5">
              <div>
                <div className="flex items-center gap-4">
                  <ManufacturerLogo manufacturer={manufacturer} className="h-14 w-14 rounded-full text-[10px]" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 id="maker-title" className="text-[28px] font-semibold tracking-[-0.03em]">{manufacturer.name}</h2>
                      {verified && <VerifiedBadge className="bg-white text-[#4e5859]" />}
                    </div>
                    {reviewSummary.hasReviews && (
                      <p className="mt-1 flex items-center gap-1.5 text-[13px] text-[#626b6c]">
                        <Star className="h-4 w-4 fill-[#3157ff] text-[#3157ff]" strokeWidth={1.5} aria-hidden />
                        {reviewSummary.rating.toFixed(1).replace(".", ",")} из 5, {reviewSummary.reviewsLabel}
                      </p>
                    )}
                  </div>
                </div>
                <p className="mt-7 max-w-[520px] text-[17px] leading-[1.55] text-[#4f595a]">Производитель модульных домов полной заводской готовности из Екатеринбурга.</p>
                <div className="mt-7 flex flex-wrap gap-x-8 gap-y-3 text-[13px] font-medium text-[#5a6465]">
                  <span>{makerProjectsCount} проекта</span>
                  <span>Собственное производство</span>
                  <span>Есть шоурум</span>
                </div>
                {manufacturer.productionAddress && (
                  <p className="mt-6 flex items-start gap-2 text-[13px] leading-relaxed text-[#687171]">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.6} aria-hidden />
                    {manufacturer.productionAddress}
                  </p>
                )}
              </div>

              <div className="mt-8 grid grid-cols-2 gap-3">
                <Link to={makerHref} className={`flex min-h-[52px] items-center justify-center rounded-[13px] bg-[#3157ff] px-4 text-center text-[14px] font-semibold text-white transition-colors hover:bg-[#2447bd] active:scale-[0.98] ${focusClass}`}>Все проекты</Link>
                <a href={sourceUrl} target="_blank" rel="noopener noreferrer nofollow sponsored" className={`flex min-h-[52px] items-center justify-center gap-2 rounded-[13px] bg-white px-4 text-center text-[14px] font-semibold transition-colors hover:bg-[#f3f5f5] active:scale-[0.98] ${focusClass}`}>
                  Сайт компании
                  <ArrowUpRight className="h-4 w-4" strokeWidth={1.7} aria-hidden />
                </a>
              </div>
            </div>

            <div className="relative min-h-[300px] overflow-hidden rounded-[20px] bg-[#cfd5d2] lg:min-h-[440px]">
              <img src={photos[4]?.image} alt="Дом ПАТИО от Bygge" className="absolute inset-0 h-full w-full object-cover" loading="lazy" decoding="async" />
            </div>
          </article>
        </section>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#dfe3e2] bg-[#f7f8f6]/96 p-3 backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-[640px] items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] text-[#747d7d]">Под ключ</p>
            <p className="truncate text-[17px] font-semibold">от {project.price}</p>
          </div>
          <button type="button" onClick={() => setPriceQuizOpen(true)} className={`flex min-h-12 shrink-0 items-center justify-center rounded-[13px] bg-[#3157ff] px-5 text-[14px] font-semibold text-white active:scale-[0.98] ${focusClass}`}>
            Получить расчёт
          </button>
        </div>
      </div>

      <ProjectPriceQuiz open={priceQuizOpen} onOpenChange={setPriceQuizOpen} project={project} deliveryRegion={deliveryRegion} />
    </div>
  );
};

export default InterfaceProjectDetailConcept;
