import { FormEvent, useMemo, useState } from "react";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import Seo from "@/components/Seo";
import {
  platformaCutawayKitchen,
  platformaFaqGroups,
  platformaLogo,
  platformaPortfolio,
  platformaProcess,
  platformaProductionCraft,
  platformaProductionFloor,
  platformaProductionTeam,
  platformaProjects,
  platformaSpecifications,
  type PlatformaProject,
} from "@/data/platformaSite";

const PHONE = "+7 (343) 226-11-40";
const PHONE_HREF = "tel:+73432261140";
const money = (value: number) => `${new Intl.NumberFormat("ru-RU").format(value)} ₽`;

const navItems = [
  ["Проекты", "#projects"],
  ["Производство", "#factory"],
  ["Технология", "#technology"],
  ["Построенные дома", "#built"],
  ["FAQ", "#faq"],
] as const;

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="max-w-[920px] text-[38px] font-medium leading-[0.98] tracking-[-0.045em] text-[#14201c] dark:text-[#edf2ed] sm:text-[48px] lg:text-[66px]">
    {children}
  </h2>
);

const ProjectFeature = ({ project, large = false }: { project: PlatformaProject; large?: boolean }) => (
  <Link
    to={`/platforma/project/${project.slug}`}
    className="group block min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#215343] focus-visible:ring-offset-4 dark:focus-visible:ring-offset-[#111915]"
  >
    <figure className={`overflow-hidden bg-[#d5ddd7] ${large ? "aspect-[1.32]" : "aspect-[1.18]"}`}>
      <img
        src={project.gallery[0]}
        alt={project.name}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
      />
    </figure>
    <div className="grid gap-4 border-b border-[#14201c]/18 py-5 dark:border-white/16 sm:grid-cols-[1fr_auto] sm:items-start">
      <div>
        <h3 className={`${large ? "text-[28px] sm:text-[34px]" : "text-[23px]"} font-medium tracking-[-0.035em] text-[#14201c] dark:text-[#edf2ed]`}>
          {project.name}
        </h3>
        <p className="mt-2 text-[14px] leading-relaxed text-[#66716c] dark:text-[#aab6af]">{project.description}</p>
      </div>
      <div className="sm:text-right">
        <p className="text-[18px] font-semibold text-[#14201c] dark:text-[#edf2ed]">от {money(project.price)}</p>
        <p className="mt-2 text-[13px] text-[#66716c] dark:text-[#aab6af]">{project.area.toString().replace(".", ",")} м² / {project.bedrooms} спальни</p>
      </div>
    </div>
  </Link>
);

const LeadForm = () => {
  const [sent, setSent] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  if (sent) {
    return (
      <div className="flex min-h-[240px] flex-col justify-center bg-[#215343] p-7 text-[#f6f8f4] sm:p-9">
        <h3 className="text-[30px] font-medium tracking-[-0.035em]">Заявка принята</h3>
        <p className="mt-3 max-w-md text-[15px] leading-relaxed text-white/72">Менеджер свяжется с вами по указанному номеру.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5 bg-[#fafaf7] p-6 text-[#14201c] dark:bg-[#18231e] dark:text-[#edf2ed] sm:p-9">
      <label className="grid gap-2 text-[13px] font-medium">
        Имя
        <input required autoComplete="name" className="min-h-12 rounded-[var(--radius)] border border-[#14201c]/25 bg-transparent px-4 text-[16px] outline-none transition-colors focus:border-[#215343] focus:ring-2 focus:ring-[#215343]/20 dark:border-white/25" />
      </label>
      <label className="grid gap-2 text-[13px] font-medium">
        Телефон
        <input required type="tel" inputMode="tel" autoComplete="tel" className="min-h-12 rounded-[var(--radius)] border border-[#14201c]/25 bg-transparent px-4 text-[16px] outline-none transition-colors focus:border-[#215343] focus:ring-2 focus:ring-[#215343]/20 dark:border-white/25" />
      </label>
      <button type="submit" className="min-h-12 rounded-[var(--radius)] bg-[#215343] px-5 text-[14px] font-semibold text-white transition-colors hover:bg-[#183f34] active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#215343] focus-visible:ring-offset-2">
        Получить расчёт
      </button>
      <p className="text-[11px] leading-relaxed text-[#707a75] dark:text-[#9ca8a1]">Нажимая кнопку, вы соглашаетесь на обработку персональных данных.</p>
    </form>
  );
};

const PlatformaTemplatePreview = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const featured = [platformaProjects[1], platformaProjects[6], platformaProjects[7]];
  const faqItems = useMemo(() => platformaFaqGroups.flatMap((group) => group.items).slice(0, 6), []);

  return (
    <div className="min-h-screen bg-[#eef1ec] text-[#14201c] dark:bg-[#111915] dark:text-[#edf2ed]">
      <Seo
        title="Платформа: модульные дома в Екатеринбурге"
        description="Тестовый шаблон сайта производителя модульных домов Платформа. Проекты, цены, производство, технология и готовые объекты."
        canonicalPath="/proizvoditeli/platforma/"
        noIndex
      />

      <header className="sticky top-0 z-40 border-b border-[#14201c]/12 bg-[#eef1ec]/94 backdrop-blur-xl dark:border-white/12 dark:bg-[#111915]/94">
        <div className="mx-auto flex h-[70px] max-w-[1520px] items-center justify-between px-4 sm:px-6 lg:px-10">
          <Link to="/platforma-preview" className="flex min-h-11 items-center gap-3 rounded-[var(--radius)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#215343]">
            <img src={platformaLogo} alt="" className="h-9 w-9 rounded-[var(--radius)] object-cover" />
            <span className="text-[15px] font-semibold tracking-[-0.02em]">ПЛАТФОРМА</span>
          </Link>

          <nav className="hidden items-center gap-7 text-[13px] lg:flex" aria-label="Навигация по странице">
            {navItems.map(([label, href]) => <a key={href} href={href} className="py-3 transition-colors hover:text-[#215343] dark:hover:text-[#9fc8b9]">{label}</a>)}
          </nav>

          <div className="hidden items-center gap-5 sm:flex">
            <a href={PHONE_HREF} className="text-[13px] font-medium">{PHONE}</a>
            <a href="#calculate" className="inline-flex min-h-11 items-center rounded-[var(--radius)] bg-[#215343] px-5 text-[13px] font-semibold text-white transition-colors hover:bg-[#183f34]">Рассчитать стоимость</a>
          </div>

          <button type="button" onClick={() => setMenuOpen((value) => !value)} className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-[var(--radius)] sm:hidden" aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"} aria-expanded={menuOpen}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {menuOpen && (
          <nav className="border-t border-[#14201c]/12 bg-[#eef1ec] px-4 pb-5 pt-2 dark:border-white/12 dark:bg-[#111915]" aria-label="Мобильная навигация">
            {navItems.map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)} className="flex min-h-12 items-center border-b border-[#14201c]/12 text-[15px] dark:border-white/12">{label}</a>)}
            <a href="#calculate" onClick={() => setMenuOpen(false)} className="mt-4 flex min-h-12 items-center justify-center rounded-[var(--radius)] bg-[#215343] px-5 text-[14px] font-semibold text-white">Рассчитать стоимость</a>
          </nav>
        )}
      </header>

      <main>
        <section className="border-b border-[#14201c]/14 dark:border-white/12">
          <div className="mx-auto grid min-h-[calc(100dvh-70px)] max-w-[1600px] lg:grid-cols-2">
            <div className="flex items-center px-4 py-14 sm:px-8 sm:py-20 lg:px-12 xl:px-16">
              <div className="max-w-[650px]">
                <p className="text-[13px] font-medium text-[#53625b] dark:text-[#9eaaa4]">Екатеринбург / производство в Берёзовском</p>
                <h1 className="mt-7 text-[48px] font-medium leading-[0.94] tracking-[-0.055em] sm:text-[62px] lg:text-[clamp(54px,4.3vw,72px)]">
                  <span className="block lg:whitespace-nowrap">Модульные дома</span>
                  <span className="block">Платформа</span>
                </h1>
                <p className="mt-7 max-w-[540px] text-[17px] leading-[1.65] text-[#596760] dark:text-[#aeb9b3] sm:text-[19px]">Готовые дома заводской сборки с фиксированной стоимостью и монтажом на участке.</p>
                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <a href="#projects" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius)] bg-[#215343] px-6 text-[14px] font-semibold text-white transition-colors hover:bg-[#183f34] active:translate-y-px">Смотреть проекты <ArrowRight size={17} /></a>
                  <a href="#calculate" className="inline-flex min-h-12 items-center justify-center rounded-[var(--radius)] border border-[#14201c]/30 px-6 text-[14px] font-semibold transition-colors hover:border-[#215343] hover:bg-white/45 dark:border-white/30 dark:hover:bg-white/8">Рассчитать стоимость</a>
                </div>
              </div>
            </div>

            <figure className="min-h-[460px] overflow-hidden bg-[#cad3cd] lg:min-h-[calc(100dvh-70px)]">
              <img src={platformaProjects[1].gallery[0]} alt="Модульный дом Wide House" className="h-full w-full object-cover object-[57%_center]" fetchPriority="high" />
            </figure>
          </div>
        </section>

        <section className="border-b border-[#14201c]/14 bg-[#fafaf7] dark:border-white/12 dark:bg-[#151f1a]" aria-label="Основные факты">
          <dl className="mx-auto grid max-w-[1520px] divide-y divide-[#14201c]/12 px-4 dark:divide-white/12 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-6 lg:px-10">
            {[["от 1 680 000 ₽", "Минимальная стоимость"], ["9 проектов", "Каталог с планировками"], ["до 60 дней", "Срок производства"]].map(([value, label]) => (
              <div key={label} className="py-6 sm:px-7 sm:py-8 first:pl-0 last:pr-0">
                <dt className="text-[12px] text-[#69756f] dark:text-[#9da9a2]">{label}</dt>
                <dd className="mt-2 text-[25px] font-medium tracking-[-0.03em] sm:text-[30px]">{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section id="projects" className="scroll-mt-20 px-4 py-20 sm:px-6 sm:py-28 lg:px-10 lg:py-36">
          <div className="mx-auto max-w-[1520px]">
            <div className="flex flex-col gap-7 border-b border-[#14201c]/16 pb-9 dark:border-white/14 md:flex-row md:items-end md:justify-between">
              <div>
                <SectionTitle>Проекты для разных сценариев жизни</SectionTitle>
                <p className="mt-5 max-w-[620px] text-[16px] leading-relaxed text-[#64716a] dark:text-[#a9b5ae]">Площадь, цена и планировка взяты из каталога производителя.</p>
              </div>
              <Link to="/platforma/catalog" className="inline-flex min-h-11 items-center gap-2 text-[14px] font-semibold text-[#215343] dark:text-[#9fc8b9]">Все 9 проектов <ArrowRight size={17} /></Link>
            </div>

            <div className="mt-10 grid gap-10 lg:grid-cols-[1.45fr_0.75fr] lg:gap-6">
              <ProjectFeature project={featured[0]} large />
              <div className="grid gap-10 lg:gap-7">
                <ProjectFeature project={featured[1]} />
                <ProjectFeature project={featured[2]} />
              </div>
            </div>
          </div>
        </section>

        <section id="factory" className="scroll-mt-20 bg-[#152b24] text-[#f1f5f0]">
          <div className="mx-auto grid max-w-[1600px] lg:grid-cols-[1.15fr_0.85fr]">
            <div className="grid min-h-[620px] grid-cols-2 grid-rows-2 gap-[2px] bg-white/10">
              <img src={platformaProductionFloor} alt="Производственный цех Платформы" loading="lazy" className="col-span-2 h-full w-full object-cover" />
              <img src={platformaProductionCraft} alt="Сборка модульного дома в цехе" loading="lazy" className="h-full w-full object-cover" />
              <img src={platformaProductionTeam} alt="Команда производства Платформы" loading="lazy" className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-col justify-center px-4 py-16 sm:px-8 lg:px-12 xl:px-16">
              <h2 className="text-[42px] font-medium leading-[0.98] tracking-[-0.045em] sm:text-[56px]">Дом собирается в тёплом цехе</h2>
              <p className="mt-7 max-w-[560px] text-[16px] leading-[1.75] text-white/68">Производство находится в Берёзовском. Основная часть работ проходит под контролем на заводе, затем готовые модули доставляются на участок.</p>
              <dl className="mt-11 divide-y divide-white/14 border-y border-white/14">
                {[["Адрес производства", "Берёзовский, Южная промзона, 21"], ["Сборка", "В тёплом производственном цехе"], ["Контроль", "От каркаса до внутренней отделки"]].map(([label, value]) => (
                  <div key={label} className="grid gap-2 py-5 sm:grid-cols-[150px_1fr]">
                    <dt className="text-[12px] text-white/45">{label}</dt>
                    <dd className="text-[15px] leading-relaxed text-white/86">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        <section id="technology" className="scroll-mt-20 bg-[#dce4de] px-4 py-20 dark:bg-[#1a2922] sm:px-6 sm:py-28 lg:px-10 lg:py-36">
          <div className="mx-auto max-w-[1520px]">
            <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
              <div>
                <SectionTitle>Конструкция без скрытых слоёв</SectionTitle>
                <figure className="mt-9 overflow-hidden bg-[#d4ddd6] dark:bg-[#22342b]">
                  <img src={platformaCutawayKitchen} alt="Конструкция и оснащение модульного дома Платформа" loading="lazy" className="aspect-[1.35] h-full w-full object-cover mix-blend-multiply dark:mix-blend-normal" />
                </figure>
              </div>
              <div className="lg:pt-[102px]">
                <p className="max-w-[520px] text-[16px] leading-[1.7] text-[#5f6d66] dark:text-[#aab6af]">Показываем только характеристики, опубликованные производителем.</p>
                <dl className="mt-8 divide-y divide-[#14201c]/16 border-y border-[#14201c]/16 dark:divide-white/14 dark:border-white/14">
                  {platformaSpecifications.slice(0, 6).map(([label, value]) => (
                    <div key={label} className="grid gap-2 py-5 sm:grid-cols-[160px_1fr]">
                      <dt className="text-[12px] text-[#6c7871] dark:text-[#99a69f]">{label}</dt>
                      <dd className="text-[14px] leading-relaxed text-[#25342d] dark:text-[#e2e9e4]">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </section>

        <section id="built" className="scroll-mt-20 bg-[#fafaf7] px-4 py-20 dark:bg-[#151f1a] sm:px-6 sm:py-28 lg:px-10 lg:py-36">
          <div className="mx-auto max-w-[1520px]">
            <SectionTitle>Объекты, которые уже построены</SectionTitle>
            <p className="mt-5 max-w-[660px] text-[16px] leading-relaxed text-[#64716a] dark:text-[#a9b5ae]">В этом разделе используются только фотографии реализованных объектов, не рендеры.</p>
            <div className="mt-10 grid auto-rows-[230px] gap-3 md:grid-cols-12 md:auto-rows-[290px]">
              {platformaPortfolio.slice(0, 5).map((item, index) => (
                <figure key={item.src} className={`overflow-hidden bg-[#d5ddd7] ${index === 0 ? "md:col-span-7 md:row-span-2" : index === 1 ? "md:col-span-5" : "md:col-span-5"}`}>
                  <img src={item.src} alt={item.alt} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.02] motion-reduce:transition-none motion-reduce:hover:scale-100" />
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-[#14201c]/14 px-4 py-20 dark:border-white/12 sm:px-6 sm:py-28 lg:px-10">
          <div className="mx-auto max-w-[1520px]">
            <SectionTitle>От выбора проекта до готового дома</SectionTitle>
            <ol className="mt-11 grid border-y border-[#14201c]/16 dark:border-white/14 md:grid-cols-5">
              {platformaProcess.map(([title, text], index) => (
                <li key={title} className="flex min-h-[230px] flex-col border-b border-[#14201c]/14 py-6 md:border-b-0 md:border-r md:px-5 md:last:border-r-0 dark:border-white/12">
                  <span className="text-[12px] font-medium text-[#215343] dark:text-[#9fc8b9]">{String(index + 1).padStart(2, "0")}</span>
                  <h3 className="mt-auto text-[20px] font-medium tracking-[-0.025em]">{title}</h3>
                  <p className="mt-3 text-[13px] leading-relaxed text-[#66736c] dark:text-[#a5b1aa]">{text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="faq" className="scroll-mt-20 px-4 py-20 sm:px-6 sm:py-28 lg:px-10 lg:py-36">
          <div className="mx-auto grid max-w-[1520px] gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
            <div>
              <SectionTitle>Вопросы о доме и покупке</SectionTitle>
              <p className="mt-5 max-w-[480px] text-[15px] leading-relaxed text-[#64716a] dark:text-[#a9b5ae]">Ответы собраны из подтверждённых материалов производителя.</p>
            </div>
            <div className="border-t border-[#14201c]/16 dark:border-white/14">
              {faqItems.map(([question, answer]) => (
                <details key={question} className="group border-b border-[#14201c]/16 dark:border-white/14">
                  <summary className="flex min-h-[72px] cursor-pointer list-none items-center justify-between gap-5 py-4 text-[16px] font-medium sm:text-[18px]">
                    <span>{question}</span>
                    <ChevronDown size={19} className="shrink-0 transition-transform group-open:rotate-180 motion-reduce:transition-none" />
                  </summary>
                  <p className="max-w-[780px] pb-6 text-[15px] leading-[1.75] text-[#64716a] dark:text-[#a9b5ae]">{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section id="calculate" className="scroll-mt-20 bg-[#cbd6cf] px-4 py-16 dark:bg-[#20322a] sm:px-6 sm:py-24 lg:px-10">
          <div className="mx-auto grid max-w-[1320px] gap-10 lg:grid-cols-[1fr_0.75fr] lg:items-end">
            <div>
              <h2 className="max-w-[760px] text-[42px] font-medium leading-[0.98] tracking-[-0.045em] sm:text-[58px] lg:text-[70px]">Получите расчёт дома под ваш участок</h2>
              <p className="mt-6 max-w-[600px] text-[16px] leading-relaxed text-[#596760] dark:text-[#b4beb8]">Менеджер уточнит проект, регион установки и подходящую комплектацию.</p>
            </div>
            <LeadForm />
          </div>
        </section>
      </main>

      <footer className="bg-[#12251f] px-4 py-12 text-white sm:px-6 lg:px-10">
        <div className="mx-auto grid max-w-[1520px] gap-10 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <div className="flex items-center gap-3"><img src={platformaLogo} alt="" className="h-9 w-9 rounded-[var(--radius)]" /><span className="font-semibold">ПЛАТФОРМА</span></div>
            <p className="mt-5 max-w-md text-[13px] leading-relaxed text-white/58">Представительство производителя внутри платформы «Многоместа».</p>
          </div>
          <div className="md:text-right">
            <a href={PHONE_HREF} className="text-[23px] font-medium">{PHONE}</a>
            <p className="mt-2 text-[12px] text-white/48">Екатеринбург, ул. Азина, 22/5</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PlatformaTemplatePreview;
