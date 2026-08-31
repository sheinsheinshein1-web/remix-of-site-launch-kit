import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Seo from "@/components/Seo";
import {
  platformaFaqGroups,
  platformaBusinessHero,
  platformaBusinessObject,
  platformaCutawayKitchen,
  platformaCutawayLiving,
  platformaLogo,
  platformaOptions,
  platformaPortfolio,
  platformaProductionCraft,
  platformaProductionFloor,
  platformaProductionTeam,
  platformaProcess,
  platformaProjects,
  platformaReasons,
  platformaReviews,
  platformaSpecifications,
  platformaWorkStages,
  type PlatformaProject,
} from "@/data/platformaSite";

const PHONE = "+7 (343) 226-11-40";
const PHONE_HREF = "tel:+73432261140";
const EMAIL = "sales@platforma-modul.ru";
const cx = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(" ");
const money = (value: number) => `${new Intl.NumberFormat("ru-RU").format(value)} ₽`;

const nav = [
  ["Главная", "/platforma"],
  ["Бизнесу", "/platforma/business"],
  ["Каталог", "/platforma/catalog"],
  ["О компании", "/platforma/about"],
  ["Ипотека и рассрочка", "/platforma/payment"],
  ["Контакты", "/platforma/contacts"],
] as const;

const PageShell = ({ children }: { children: ReactNode }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#f3f3ee] text-[#17201d]">
      <header className="sticky top-0 z-50 border-b border-black/10 bg-[#f3f3ee]/95 backdrop-blur-md">
        <div className="mx-auto flex h-[74px] max-w-[1480px] items-center justify-between px-5 md:px-10 lg:px-14">
          <Link to="/platforma" className="flex min-h-11 items-center gap-3 rounded-[var(--radius)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#205142]">
            <img src={platformaLogo} alt="" className="h-10 w-10 rounded-[var(--radius)] object-cover" />
            <span className="text-[16px] font-semibold tracking-[-0.02em]">ПЛАТФОРМА</span>
          </Link>
          <nav className="hidden items-center gap-6 text-[13px] xl:flex" aria-label="Основная навигация">
            {nav.map(([label, href]) => (
              <Link key={href} to={href} className={cx("flex min-h-11 items-center transition-colors hover:text-[#9a5b2c]", location.pathname === href && "text-[#9a5b2c]")}>{label}</Link>
            ))}
          </nav>
          <div className="hidden items-center gap-5 md:flex">
            <a href={PHONE_HREF} className="text-[13px] font-medium">{PHONE}</a>
            <Link to="/platforma/contacts" className="inline-flex min-h-11 items-center rounded-[var(--radius)] bg-[#205142] px-5 text-[13px] font-semibold text-white transition-colors hover:bg-[#173c32]">Заказать звонок</Link>
          </div>
          <button type="button" className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-[var(--radius)] xl:hidden" onClick={() => setMenuOpen((value) => !value)} aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"} aria-expanded={menuOpen}>
            {menuOpen ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
        {menuOpen && (
          <nav className="absolute inset-x-0 top-[74px] border-b border-black/10 bg-[#f3f3ee] px-5 pb-5 pt-2 xl:hidden" aria-label="Мобильная навигация">
            <div className="mx-auto grid max-w-[1480px] md:grid-cols-2">{nav.map(([label, href]) => <Link key={href} to={href} className="flex min-h-12 items-center border-b border-black/10 text-[16px]">{label}</Link>)}</div>
          </nav>
        )}
      </header>
      <main>{children}</main>
      <Footer />
    </div>
  );
};

const Footer = () => (
  <footer className="bg-[#162f28] px-5 py-14 text-white md:px-10 lg:px-14">
    <div className="mx-auto grid max-w-[1480px] gap-12 lg:grid-cols-3">
      <div><div className="flex items-center gap-3"><img src={platformaLogo} alt="" className="h-10 w-10 rounded-[var(--radius)] object-cover" /><span className="font-semibold">ПЛАТФОРМА</span></div><p className="mt-6 max-w-xs text-[14px] leading-relaxed text-white/62">Модульные дома и бани комфорт- и премиум-класса.</p></div>
      <nav className="grid grid-cols-2 gap-x-8 gap-y-3 text-[14px] text-white/72" aria-label="Навигация в подвале">{nav.slice(1).map(([label, href]) => <Link key={href} to={href} className="hover:text-white">{label}</Link>)}</nav>
      <address className="not-italic text-[14px] leading-[1.8] text-white/65 lg:justify-self-end"><a href={PHONE_HREF} className="block text-[22px] font-medium text-white">{PHONE}</a><a href={`mailto:${EMAIL}`} className="block text-white">{EMAIL}</a><p className="mt-3">Екатеринбург, ул. Азина, 22/5</p></address>
    </div>
    <div className="mx-auto mt-14 flex max-w-[1480px] flex-col gap-2 text-[11px] text-white/38 md:flex-row md:justify-between"><span>ООО «Платформа. Модульное производство»</span><span>ИНН 6678135856 · ОГРН 1246600012581</span></div>
  </footer>
);

const SectionHeading = ({ children, className }: { children: ReactNode; className?: string }) => <h2 className={cx("max-w-5xl text-[39px] font-medium leading-[1.02] tracking-[-0.045em] md:text-[64px]", className)}>{children}</h2>;

const PrimaryLink = ({ to, children, light = false }: { to: string; children: ReactNode; light?: boolean }) => (
  <Link to={to} className={cx("inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius)] px-6 text-[14px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2", light ? "bg-white text-[#173c32] hover:bg-[#e7e7e0] focus-visible:ring-white" : "bg-[#205142] text-white hover:bg-[#173c32] focus-visible:ring-[#205142]")}>{children}</Link>
);

const ProjectCard = ({ project }: { project: PlatformaProject }) => (
  <Link to={`/platforma/project/${project.slug}`} className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#205142]">
    <div className="aspect-[1.32] overflow-hidden bg-[#dfe2dc]"><img src={project.gallery[0]} alt={project.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]" loading="lazy" /></div>
    <div className="grid gap-5 bg-white p-5 md:grid-cols-[1fr_auto] md:p-6">
      <div><h3 className="text-[21px] font-medium tracking-[-0.025em]">{project.name}</h3><p className="mt-2 text-[13px] leading-relaxed text-[#69736f]">{project.description}</p><p className="mt-4 text-[12px] text-[#69736f]">{project.area.toString().replace(".", ",")} м² · {project.rooms}</p></div>
      <div className="md:text-right"><p className="text-[12px] text-[#69736f]">от</p><p className="mt-1 whitespace-nowrap text-[18px] font-semibold">{money(project.price)}</p><span className="mt-6 inline-flex items-center gap-2 text-[13px] font-semibold text-[#205142]">Подробнее <ArrowRight size={16} /></span></div>
    </div>
  </Link>
);

const LeadForm = () => {
  const [sent, setSent] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSent(true); };
  if (sent) return <div className="bg-[#205142] p-8 text-white"><p className="text-[24px] font-medium">Заявка принята</p><p className="mt-3 text-white/70">Менеджер свяжется с вами по указанному номеру.</p></div>;
  return (
    <form onSubmit={submit} className="grid gap-3 bg-white p-5 md:grid-cols-2 md:p-7">
      <label className="grid gap-2 text-[12px] text-[#5d6864]">Имя<input required className="min-h-12 rounded-[var(--radius)] border border-black/15 px-4 text-[16px] text-[#17201d] outline-none focus:border-[#205142]" /></label>
      <label className="grid gap-2 text-[12px] text-[#5d6864]">Телефон<input required inputMode="tel" className="min-h-12 rounded-[var(--radius)] border border-black/15 px-4 text-[16px] text-[#17201d] outline-none focus:border-[#205142]" /></label>
      <button className="min-h-12 rounded-[var(--radius)] bg-[#205142] px-6 text-[14px] font-semibold text-white md:col-span-2" type="submit">Отправить</button>
    </form>
  );
};

const Consultation = ({ title = "Остались вопросы?" }: { title?: string }) => (
  <section className="bg-[#cfd8d2] px-5 py-20 md:px-10 md:py-28 lg:px-14"><div className="mx-auto grid max-w-[1480px] gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-end"><div><SectionHeading>{title}</SectionHeading><p className="mt-6 max-w-xl text-[17px] leading-relaxed text-[#5d6864]">Оставьте контакты. Менеджер уточнит задачу, бюджет и поможет выбрать следующий шаг.</p></div><LeadForm /></div></section>
);

const FaqSection = () => {
  const [open, setOpen] = useState("0-0");
  return (
    <section className="px-5 py-24 md:px-10 md:py-32 lg:px-14">
      <div className="mx-auto max-w-[1480px]">
        <SectionHeading>Часто задаваемые вопросы</SectionHeading>
        <div className="mt-14 grid gap-12 lg:grid-cols-[0.42fr_1fr]">
          <div className="text-[15px] leading-relaxed text-[#66716d]"><p>Ответы о круглогодичном проживании, конструкции, фундаменте, стоимости и инженерных системах.</p><p className="mt-5">Всего: {platformaFaqGroups.reduce((count, group) => count + group.items.length, 0)} вопросов</p></div>
          <div className="space-y-10">
            {platformaFaqGroups.map((group, groupIndex) => (
              <section key={group.title}>
                <h3 className="mb-3 text-[22px] font-medium">{group.title}</h3>
                {group.items.map(([question, answer], itemIndex) => {
                  const key = `${groupIndex}-${itemIndex}`;
                  const isOpen = open === key;
                  return <div key={question} className="border-b border-black/15"><button type="button" className="flex min-h-[70px] w-full items-center justify-between gap-5 py-4 text-left text-[16px] font-medium" onClick={() => setOpen(isOpen ? "" : key)} aria-expanded={isOpen}><span>{question}</span><span className={cx("text-[24px] font-light transition-transform", isOpen && "rotate-45")}>+</span></button>{isOpen && <p className="max-w-3xl pb-6 text-[15px] leading-[1.7] text-[#68736f]">{answer}</p>}</div>;
                })}
              </section>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const HomePage = () => {
  const hero = platformaProjects[1];
  return (
    <>
      <Seo title="Платформа - модульные дома под ключ за 60 дней" description="Модульные дома под ключ от производителя Платформа. Каталог проектов, условия покупки и контакты." canonicalPath="/platforma" />
      <section className="bg-[#e5e9e4] text-[#17201d]">
        <div className="mx-auto grid min-h-[740px] max-w-[1600px] lg:grid-cols-[1.08fr_0.92fr]">
          <div className="flex flex-col justify-center px-5 py-16 md:px-10 md:py-24 lg:px-14 lg:py-20">
            <div className="max-w-[690px]">
              <h1 className="text-[46px] font-medium leading-[0.98] tracking-[-0.052em] md:text-[56px] lg:text-[clamp(56px,4.4vw,72px)]"><span className="block lg:whitespace-nowrap">Готовый модульный</span><span className="block">дом под ключ</span><span className="block">за 60 дней</span></h1>
              <p className="mt-7 max-w-[620px] text-[17px] leading-[1.65] text-[#52605b] md:text-[19px]">Дом создаётся на заводе, а на участке проходит аккуратный монтаж. Цена, комплектация и сроки фиксируются до начала работ.</p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row"><PrimaryLink to="/platforma/catalog">Подобрать дом</PrimaryLink><Link to="/platforma/contacts" className="inline-flex min-h-12 items-center justify-center rounded-[var(--radius)] border border-[#205142]/35 px-6 text-[14px] font-semibold text-[#173c32] transition-colors hover:border-[#205142] hover:bg-white/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#205142]">Рассчитать стоимость</Link></div>
            </div>
          </div>
          <figure className="relative min-h-[420px] overflow-hidden bg-[#ced7d1] lg:min-h-[740px]">
            <img src={hero.gallery[0]} alt="Модульный дом WIDE HOUSE" className="absolute inset-0 h-full w-full object-cover object-[58%_center]" fetchPriority="high" />
            <figcaption className="absolute bottom-0 left-0 bg-[#f3f3ee] px-5 py-4 text-[12px] text-[#64706b] md:px-6">WIDE HOUSE · модульный дом для круглогодичной жизни</figcaption>
          </figure>
        </div>
      </section>
      <section className="px-5 py-24 md:px-10 md:py-32 lg:px-14"><div className="mx-auto max-w-[1480px]"><div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between"><SectionHeading>Каталог проектов</SectionHeading><PrimaryLink to="/platforma/catalog">Все 9 проектов</PrimaryLink></div><p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-[#64706b]">Готовые архитектурные решения можно адаптировать под участок, образ жизни и задачи семьи.</p><div className="mt-12 grid gap-5 lg:grid-cols-2">{platformaProjects.slice(0, 6).map((project) => <ProjectCard key={project.slug} project={project} />)}</div></div></section>
      <section className="bg-[#173c32] px-5 py-24 text-white md:px-10 md:py-32 lg:px-14"><div className="mx-auto max-w-[1480px]"><SectionHeading>8 причин, почему ваш идеальный дом начинается здесь</SectionHeading><div className="mt-14 grid gap-px bg-white/15 sm:grid-cols-2 lg:grid-cols-4">{platformaReasons.map(([title, text]) => <article key={title} className="min-h-[245px] bg-[#173c32] p-7"><h3 className="text-[21px] font-medium">{title}</h3><p className="mt-5 text-[14px] leading-[1.7] text-white/58">{text}</p></article>)}</div></div></section>
      <section className="px-5 py-24 md:px-10 md:py-32 lg:px-14"><div className="mx-auto max-w-[1480px]"><SectionHeading>Понятный процесс без «вечной» стройки</SectionHeading><div className="mt-14 grid gap-4 md:grid-cols-5">{platformaProcess.map(([title, text], index) => <article key={title} className="flex min-h-[260px] flex-col bg-white p-6"><span className="font-mono text-[12px] text-[#9a5b2c]">{String(index + 1).padStart(2, "0")}</span><h3 className="mt-auto text-[19px] font-medium">{title}</h3><p className="mt-3 text-[13px] leading-relaxed text-[#69736f]">{text}</p></article>)}</div></div></section>
      <section className="overflow-hidden bg-[#e1e6e1] px-5 py-24 md:px-10 md:py-32 lg:px-14">
        <div className="mx-auto max-w-[1480px]">
          <div className="grid gap-8 border-b border-[#173c32]/20 pb-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-20">
            <SectionHeading className="md:text-[58px]">Модульные дома и бани под ключ</SectionHeading>
            <p className="max-w-[760px] text-[17px] leading-[1.7] text-[#5e6965]">Удобные планировки, полный цикл строительства: от каркаса до отделки и коммуникаций. Доставляем и устанавливаем на вашем участке модульные дома от компании «Платформа. Модульное производство» — с сантехникой, освещением, туалетом, душем и дополнительным оборудованием по вашему выбору.</p>
          </div>

          <figure className="relative -mx-5 h-[460px] overflow-hidden md:-mx-10 md:h-[580px] lg:-mx-14 lg:h-[640px]">
            <img src={platformaCutawayKitchen} alt="Кухня, прихожая и инженерное оснащение модульного дома в разрезе" className="absolute left-[-32%] top-[3%] w-[150%] max-w-none mix-blend-multiply md:left-[-5%] md:w-[106%] lg:left-[13%] lg:w-[74%]" loading="lazy" />
            <img src={platformaCutawayLiving} alt="Гостиная с панорамным остеклением модульного дома в разрезе" className="absolute left-[-32%] top-[3%] w-[150%] max-w-none mix-blend-multiply md:left-[-5%] md:w-[106%] lg:left-[13%] lg:w-[74%]" loading="lazy" />
          </figure>

          <ol className="grid border-y border-[#173c32]/25 sm:grid-cols-2 lg:grid-cols-5">
            {["Пространство для тихого и уютного отдыха", "Панорамное остекление", "Современное кухонное оснащение", "Городские удобства за городом", "Система умного дома Алиса"].map((title, index) => (
              <li key={title} className="flex min-h-[118px] gap-4 border-b border-[#173c32]/20 py-5 sm:px-5 lg:border-b-0 lg:border-r lg:last:border-r-0">
                <span className="font-mono text-[11px] text-[#9a5b2c]">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="max-w-[220px] text-[17px] font-medium leading-[1.3] text-[#173c32]">{title}</h3>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="px-5 py-24 md:px-10 md:py-32 lg:px-14">
        <div className="mx-auto max-w-[1480px]">
          <SectionHeading>Портфолио наших проектов</SectionHeading>
          <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-[#64706b]">Фотографии построенных и переданных заказчикам модульных объектов Платформы.</p>
          <div className="mt-12 grid auto-rows-[260px] gap-4 md:grid-cols-12">
            {platformaPortfolio.map((item, index) => <figure key={item.src} className={cx("relative overflow-hidden bg-[#dfe2dc]", index === 0 && "md:col-span-5 md:row-span-2", (index === 1 || index === 2) && "md:col-span-7", (index === 3 || index === 4) && "md:col-span-4 md:row-span-2", index >= 5 && "md:col-span-4")}><img src={item.src} alt={item.alt} className="absolute inset-0 h-full w-full object-cover" loading="lazy" /></figure>)}
          </div>
        </div>
      </section>
      <section className="bg-[#173c32] px-5 py-24 text-white md:px-10 md:py-32 lg:px-14">
        <div className="mx-auto max-w-[1480px]">
          <SectionHeading>Что о нас говорят</SectionHeading>
          <div className="mt-14 grid gap-px bg-white/15 md:grid-cols-2">{platformaReviews.map(([name, status, text]) => <blockquote key={name} className="min-h-[270px] bg-[#173c32] p-7 md:p-9"><p className="text-[16px] leading-[1.75] text-white/72">«{text}»</p><footer className="mt-8"><cite className="not-italic text-[17px] font-medium">{name}</cite><p className="mt-1 text-[12px] text-white/45">{status}</p></footer></blockquote>)}</div>
        </div>
      </section>
      <section className="px-5 py-24 md:px-10 md:py-32 lg:px-14">
        <div className="mx-auto max-w-[1480px]">
          <SectionHeading>Прозрачные условия от заявки до ввода в эксплуатацию</SectionHeading>
          <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">{platformaWorkStages.map(([title, text], index) => <article key={title} className="flex min-h-[230px] flex-col bg-white p-6"><span className="font-mono text-[12px] text-[#9a5b2c]">{String(index + 1).padStart(2, "0")}</span><h3 className="mt-auto text-[19px] font-medium">{title}</h3><p className="mt-3 text-[13px] leading-relaxed text-[#69736f]">{text}</p></article>)}</div>
        </div>
      </section>
      <FaqSection />
      <Consultation title="Заполните форму. Сориентируем по бюджету и срокам" />
    </>
  );
};

const CatalogPage = () => {
  const [collection, setCollection] = useState("ВСЕ");
  const [area, setArea] = useState("ВСЕ");
  const [price, setPrice] = useState("ВСЕ");
  const [bedrooms, setBedrooms] = useState("ВСЕ");
  const filtered = useMemo(() => platformaProjects.filter((project) => {
    const collectionMatch = collection === "ВСЕ" || project.collection === collection;
    const areaMatch = area === "ВСЕ" || (area === "ДО 50" ? project.area < 50 : area === "50-100" ? project.area >= 50 && project.area <= 100 : project.area > 100);
    const priceMatch = price === "ВСЕ" || (price === "ДО 3 МЛН" ? project.price <= 3_000_000 : price === "ДО 5 МЛН" ? project.price <= 5_000_000 : project.price <= 9_000_000);
    const bedroomsMatch = bedrooms === "ВСЕ" || project.bedrooms === Number(bedrooms);
    return collectionMatch && areaMatch && priceMatch && bedroomsMatch;
  }), [area, bedrooms, collection, price]);
  return (
    <>
      <Seo title="Каталог модульных домов - Платформа" description="Все проекты модульных домов Платформы с ценами, площадью и внутренними страницами." canonicalPath="/platforma/catalog" />
      <section className="bg-[#dce2de] px-5 py-12 md:px-10 md:py-16 lg:px-14">
        <div className="mx-auto max-w-[1480px]">
          <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-stretch">
            <div className="flex flex-col justify-center py-3">
              <h1 className="max-w-[700px] text-[47px] font-medium leading-[0.98] tracking-[-0.052em] md:text-[58px]"><span className="block lg:whitespace-nowrap">Каталог модульных</span><span className="block">домов</span></h1>
              <p className="mt-6 max-w-[590px] text-[17px] leading-[1.65] text-[#5f6a66]">Выберите готовое решение. Планировку, фасад и комплектацию адаптируем под ваш участок.</p>
              <p className="mt-9 text-[15px] font-medium text-[#205142]">{platformaProjects.length} проектов с ценами и планировками</p>
            </div>
            <div className="grid min-h-[360px] grid-cols-2 gap-3">
              <img src={platformaProjects[1].gallery[0]} alt={platformaProjects[1].name} className="h-full w-full object-cover" />
              <div className="grid gap-3"><img src={platformaProjects[2].gallery[0]} alt={platformaProjects[2].name} className="h-full min-h-0 w-full object-cover" /><img src={platformaProjects[3].gallery[0]} alt={platformaProjects[3].name} className="h-full min-h-0 w-full object-cover" /></div>
            </div>
          </div>
          <div className="mt-12 grid gap-7 border-t border-black/15 pt-8 md:grid-cols-2 lg:grid-cols-4">
            <Filter title="Раздел" values={["ВСЕ", "TWIN", "WIDE", "BARN", "BEAR", "VAST"]} active={collection} setActive={setCollection} />
            <Filter title="Площадь" values={["ВСЕ", "ДО 50", "50-100", "БОЛЕЕ 100"]} active={area} setActive={setArea} />
            <Filter title="Стоимость" values={["ВСЕ", "ДО 3 МЛН", "ДО 5 МЛН", "ДО 9 МЛН"]} active={price} setActive={setPrice} />
            <Filter title="Спальни" values={["ВСЕ", "1", "2", "3", "5"]} active={bedrooms} setActive={setBedrooms} />
          </div>
        </div>
      </section>
      <section className="px-5 py-14 md:px-10 md:py-20 lg:px-14"><div className="mx-auto max-w-[1480px]"><div className="flex items-center justify-between"><p className="text-[14px] text-[#69736f]">Найдено: {filtered.length}</p><p className="text-[14px] text-[#69736f]">Цена от 1 680 000 ₽</p></div>{filtered.length > 0 ? <div className="mt-9 grid gap-5 lg:grid-cols-2">{filtered.map((project) => <ProjectCard key={project.slug} project={project} />)}</div> : <div className="mt-9 bg-white p-8"><p className="text-[22px] font-medium">По этим параметрам проектов пока нет</p><button type="button" className="mt-5 min-h-11 rounded-[var(--radius)] bg-[#205142] px-5 text-[13px] font-semibold text-white" onClick={() => { setCollection("ВСЕ"); setArea("ВСЕ"); setPrice("ВСЕ"); setBedrooms("ВСЕ"); }}>Сбросить фильтры</button></div>}</div></section>
      <Consultation title="Не нашли дом? Мы спроектируем под вас" />
    </>
  );
};

const Filter = ({ title, values, active, setActive }: { title: string; values: string[]; active: string; setActive: (value: string) => void }) => <div><p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#69736f]">{title}</p><div className="flex flex-wrap gap-2">{values.map((item) => <button key={item} type="button" onClick={() => setActive(item)} className={cx("min-h-11 rounded-[var(--radius)] border px-4 text-[13px]", active === item ? "border-[#205142] bg-[#205142] text-white" : "border-black/15 bg-white")}>{item}</button>)}</div></div>;

const ProjectPage = ({ project }: { project: PlatformaProject }) => {
  const relatedProjects = platformaProjects.filter((item) => item.slug !== project.slug).slice(0, 3);
  return (
    <>
    <Seo title={`${project.name} - модульный дом Платформа`} description={`${project.name}: площадь ${project.area} м², стоимость от ${money(project.price)}.`} canonicalPath={`/platforma/project/${project.slug}`} />
    <section className="bg-[#e5e9e4] px-5 pb-12 pt-8 md:px-10 md:pb-16 lg:px-14"><div className="mx-auto max-w-[1480px]"><Link to="/platforma/catalog" className="inline-flex min-h-11 items-center text-[13px] text-[#65706c] hover:text-[#205142]">← Каталог модульных домов</Link><div className="mt-4 grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-stretch"><div className="flex flex-col py-5"><h1 className="text-[47px] font-medium leading-[0.98] tracking-[-0.05em] md:text-[68px]">{project.name}</h1><p className="mt-6 max-w-xl text-[17px] leading-[1.65] text-[#64706b]">{project.description} Подходит для круглогодичного проживания.</p><dl className="mt-9 grid grid-cols-2 gap-x-6 gap-y-7 border-t border-black/15 pt-7">{[[`${project.area.toString().replace(".", ",")} м²`, "Площадь"], [String(project.bedrooms), "Спальни"], ["60 дней", "Производство"], [`от ${money(project.price)}`, "Стоимость"]].map(([value, label]) => <div key={label}><dt className="text-[12px] text-[#6b7571]">{label}</dt><dd className="mt-2 text-[21px] font-medium">{value}</dd></div>)}</dl><div className="mt-auto pt-9"><PrimaryLink to="/platforma/contacts">Рассчитать стоимость</PrimaryLink></div></div><div className="min-h-[430px] overflow-hidden bg-[#dfe2dc]"><img src={project.gallery[0]} alt={`${project.name}, внешний вид`} className="h-full w-full object-cover" fetchPriority="high" /></div></div></div></section>
    <section className="px-5 py-20 md:px-10 md:py-28 lg:px-14"><div className="mx-auto grid max-w-[1480px] gap-4 lg:grid-cols-12">{project.gallery.slice(1).map((image, index) => <div key={image} className={cx("aspect-[1.45] overflow-hidden bg-[#dfe2dc]", index === 0 ? "lg:col-span-8" : "lg:col-span-4")}><img src={image} alt={`${project.name}, изображение ${index + 2}`} className={cx("h-full w-full", index >= 1 ? "object-contain p-4" : "object-cover")} loading="lazy" /></div>)}</div></section>
    <section className="px-5 pb-24 md:px-10 md:pb-32 lg:px-14"><div className="mx-auto grid max-w-[1480px] gap-10 lg:grid-cols-[0.72fr_1.28fr]"><SectionHeading>{project.name}: пространство под ваш образ жизни</SectionHeading><div><p className="text-[20px] leading-[1.7] text-[#4f5b57]">{project.story}</p><div className="mt-10 grid gap-px bg-black/10 sm:grid-cols-2">{[[project.rooms, "Планировка"], [String(project.bedrooms), "Спальни"], [project.livingArea, "Жилая площадь"], [project.terrace, "Терраса и дополнительные зоны"]].map(([value, label]) => <div key={label} className="min-h-[135px] bg-white p-5"><p className="text-[21px] font-medium">{value}</p><p className="mt-3 text-[12px] text-[#69736f]">{label}</p></div>)}</div></div></div></section>
    <section className="bg-[#173c32] px-5 py-24 text-white md:px-10 md:py-32 lg:px-14"><div className="mx-auto max-w-[1480px]"><SectionHeading>Характеристики проекта</SectionHeading><div className="mt-14 grid gap-px bg-white/15 sm:grid-cols-2 lg:grid-cols-5">{[[project.ceiling, "Высота потолков"], ["Панорамные", "Окна"], [project.livingArea, "Жилая площадь"], [project.terrace, "Терраса / ключевая зона"], ["365 дней", "Сезонность"]].map(([value, label]) => <div key={label} className="min-h-[190px] bg-[#173c32] p-6"><p className="text-[25px] font-medium">{value}</p><p className="mt-5 text-[13px] text-white/55">{label}</p></div>)}</div></div></section>
    <section className="px-5 py-24 md:px-10 md:py-32 lg:px-14"><div className="mx-auto max-w-[1480px]"><SectionHeading>Готовый дом в базовой комплектации</SectionHeading><p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-[#64706b]">В стоимость включены конструктив, утепление, отделка и базовые инженерные системы.</p><div className="mt-12 grid gap-px bg-black/10 md:grid-cols-2">{platformaSpecifications.map(([title, text]) => <div key={title} className="bg-white p-6 md:p-7"><h3 className="text-[16px] font-medium">{title}</h3><p className="mt-2 text-[14px] leading-relaxed text-[#69736f]">{text}</p></div>)}</div></div></section>
    <section className="bg-[#dce2de] px-5 py-24 md:px-10 md:py-32 lg:px-14"><div className="mx-auto max-w-[1480px]"><SectionHeading>Дополнительные опции для вашего дома</SectionHeading><p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-[#64706b]">Инженерные системы и оборудование можно согласовать до запуска дома в производство.</p><div className="mt-12 grid gap-px bg-black/10 sm:grid-cols-2 lg:grid-cols-3">{platformaOptions.map((option, index) => <div key={option} className="flex min-h-[130px] items-start gap-4 bg-white p-6"><span className="font-mono text-[12px] text-[#9a5b2c]">{String(index + 1).padStart(2, "0")}</span><p className="text-[17px] font-medium leading-snug">{option}</p></div>)}</div></div></section>
    <section className="px-5 py-24 md:px-10 md:py-32 lg:px-14"><div className="mx-auto max-w-[1480px]"><SectionHeading>Платите, как удобно</SectionHeading><p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-[#64706b]">Стоимость и выбранный способ оплаты закрепляются в договоре до начала производства.</p><div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">{[["Рассрочка", "Напрямую от производителя: первый взнос от 20%, без банковской переплаты."], ["Ипотека", "Программы банков-партнёров со сроком до 30 лет и ставкой от 6%."], ["Материнский капитал", "Можно использовать полностью или в составе первоначального взноса."], ["Полная оплата", "Наличный или безналичный расчёт по договору с фиксированной стоимостью."]].map(([title, text]) => <article key={title} className="min-h-[245px] bg-white p-7"><h3 className="text-[23px] font-medium">{title}</h3><p className="mt-5 text-[14px] leading-[1.7] text-[#69736f]">{text}</p></article>)}</div><div className="mt-8"><PrimaryLink to="/platforma/payment">Все способы покупки</PrimaryLink></div></div></section>
    <section className="bg-[#173c32] px-5 py-24 text-white md:px-10 md:py-32 lg:px-14"><div className="mx-auto max-w-[1480px]"><SectionHeading>Другие проекты</SectionHeading><div className="mt-12 grid gap-4 lg:grid-cols-3">{relatedProjects.map((item) => <Link key={item.slug} to={`/platforma/project/${item.slug}`} className="group bg-white text-[#17201d]"><div className="aspect-[1.25] overflow-hidden bg-[#dfe2dc]"><img src={item.gallery[0]} alt={item.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]" loading="lazy" /></div><div className="p-6"><h3 className="text-[21px] font-medium">{item.name}</h3><div className="mt-4 flex items-center justify-between gap-4 text-[13px] text-[#68736f]"><span>{item.area.toString().replace(".", ",")} м²</span><span>от {money(item.price)}</span></div></div></Link>)}</div></div></section>
    <Consultation title={`Узнайте точную стоимость ${project.name}`} />
    </>
  );
};

const AboutPage = () => (
  <>
    <Seo title="О компании Платформа" description="Производство модульных домов Платформа в Екатеринбурге и Берёзовском." canonicalPath="/platforma/about" />
    <section className="bg-[#e5e9e4]">
      <div className="mx-auto grid min-h-[660px] max-w-[1600px] lg:grid-cols-[0.9fr_1.1fr]">
        <div className="flex flex-col justify-center px-5 py-16 md:px-10 lg:px-14">
          <h1 className="max-w-[760px] text-[45px] font-medium leading-[0.98] tracking-[-0.052em] md:text-[62px]">О компании «Платформа» — модульные дома и бани</h1>
          <p className="mt-6 max-w-[570px] text-[18px] leading-[1.65] text-[#65706c]">Мы — команда экспертов, для которых строительство — не просто процесс, а создание дома с характером и ценностью.</p>
          <div className="mt-9"><PrimaryLink to="/platforma/contacts">Записаться на экскурсию</PrimaryLink></div>
        </div>
        <div className="min-h-[430px] overflow-hidden bg-[#ced7d1] lg:min-h-[660px]"><img src={platformaProductionTeam} alt="Команда Платформы в производственном цехе" className="h-full w-full object-cover object-center" fetchPriority="high" /></div>
      </div>
    </section>
    <section className="px-5 py-24 md:px-10 md:py-32 lg:px-14">
      <div className="mx-auto grid max-w-[1480px] gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <SectionHeading>Наша миссия</SectionHeading>
          <div className="mt-7 max-w-[720px] space-y-5 text-[17px] leading-[1.75] text-[#5e6965]">
            <p>Создавать модульные дома, в которых отражён образ жизни будущего хозяина. Для нас каждый проект — не набор чертежей, а пространство с характером, деталями и атмосферой, в которое мы вкладываем опыт и душу.</p>
            <p>«Платформа.Модульное производство» появилась как ответ на конкретный запрос рынка. Идея родилась внутри масштабного проекта — строительства спа-отеля. Поиск подрядчиков показал: качественных решений в сфере модульного строительства катастрофически не хватает. Вместо компромиссов мы решили создать собственное производство.</p>
            <p>С самого начала мы сосредоточились на модульных домах и банях комфорт- и премиум-класса. Наш принцип — совмещать скорость реализации с индивидуальной архитектурой и высоким качеством материалов. Это позволяет создавать проекты, которые выглядят уникально и при этом надёжны в эксплуатации.</p>
            <p>Мы — команда экспертов, для которых строительство — не просто процесс, а создание дома с характером и ценностью.</p>
          </div>
        </div>
        <img src={platformaProductionCraft} alt="Изготовление деревянного каркаса в цехе Платформы" className="aspect-[1.28] h-full w-full object-cover" loading="lazy" />
      </div>
    </section>
    <section className="bg-[#dce2de] px-5 py-24 md:px-10 md:py-32 lg:px-14">
      <div className="mx-auto max-w-[1480px]">
        <SectionHeading>Наши принципы</SectionHeading>
        <p className="mt-7 max-w-[850px] text-[17px] leading-[1.75] text-[#5e6965]">Мы верим, что строительство модульного дома — это не просто возведение стен, а создание пространства, в котором отражена история и стиль жизни владельца. Мы избавляем клиентов от лишней рутины и делаем путь от идеи до готового объекта прозрачным и предсказуемым. Чтобы это было возможным, мы придерживаемся четырёх ключевых принципов:</p>
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            ["Скорость", "Благодаря модульным технологиям и отлаженному производству мы сокращаем сроки реализации проектов, сохраняя качество"],
            ["Индивидуальность", "Каждый дом создаётся под клиента — архитектура, планировка и детали отражают стиль жизни владельца, а не типовой шаблон"],
            ["Уверенность", "Точные сроки, финансовая прозрачность, контроль качества и надёжные материалы гарантируют предсказуемый результат"],
            ["Простота", "Мы делаем взаимодействие простым и понятным и сопровождаем на каждом этапе — от первого эскиза до готового дома"],
          ].map(([title, text]) => <article key={title} className="min-h-[260px] bg-white p-7"><h2 className="text-[25px] font-medium">{title}</h2><p className="mt-5 text-[15px] leading-[1.65] text-[#69736f]">{text}</p></article>)}
        </div>
      </div>
    </section>
    <section className="px-5 py-24 md:px-10 md:py-32 lg:px-14">
      <div className="mx-auto max-w-[1480px]">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <SectionHeading>Производство</SectionHeading>
            <div className="mt-7 max-w-[720px] space-y-5 text-[17px] leading-[1.75] text-[#5e6965]">
              <p>Наше производство — это два теплых, светлых и просторных цеха, оснащенных всем необходимым. Здесь мы создаем модульные дома и бани, в которых каждая деталь имеет значение.</p>
              <p>В цехах царит порядок, а все материалы хранятся в идеальных условиях, защищенные от влаги и холода. Для нас чистота на производстве — это уважение к клиенту и к материалу.</p>
              <p>Мы работаем с деревом уважительно: тщательно пропитываем его защитными составами от огня и гниения, используем метод обжига для придания древесине особого рельефа. Вдохните аромат дерева и наблюдайте, как на ваших глазах рождаются элементы будущего дома.</p>
              <p>Мы приглашаем вас на бесплатную экскурсию. Вы сможете ознакомиться с нашими технологиями и материалами и задать вопросы мастерам и начальнику производства.</p>
            </div>
          </div>
          <img src={platformaProductionFloor} alt="Производственный цех Платформы" className="aspect-[1.34] h-full w-full object-cover" loading="lazy" />
        </div>
        <dl className="mt-12 grid gap-px bg-black/10 sm:grid-cols-2 lg:grid-cols-4">{[["2", "производственных цеха"], ["60 дней", "ориентир производства"], ["10 лет", "гарантия на силовой каркас"], ["365 дней", "эксплуатация дома"]].map(([value, label]) => <div key={label} className="min-h-[160px] bg-[#f3f3ee] p-6"><dt className="text-[13px] text-[#69736f]">{label}</dt><dd className="mt-5 text-[34px] font-medium">{value}</dd></div>)}</dl>
      </div>
    </section>
    <section className="bg-[#dce2de] px-5 py-24 md:px-10 md:py-32 lg:px-14"><div className="mx-auto max-w-[1480px]"><SectionHeading>Как создаётся ваш дом</SectionHeading><div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">{platformaWorkStages.map(([title, text]) => <article key={title} className="min-h-[220px] bg-white p-6"><h2 className="text-[19px] font-medium">{title}</h2><p className="mt-4 text-[13px] leading-relaxed text-[#69736f]">{text}</p></article>)}</div></div></section>
    <Consultation title="Посмотрите производство своими глазами" />
  </>
);

const PaymentPage = () => (
  <>
    <Seo title="Ипотека и рассрочка - Платформа" description="Способы покупки модульного дома Платформа: ипотека, рассрочка и материнский капитал." canonicalPath="/platforma/payment" />
    <section className="bg-[#e5e9e4]">
      <div className="mx-auto grid min-h-[660px] max-w-[1600px] lg:grid-cols-[1.08fr_0.92fr]">
        <div className="flex flex-col justify-center px-5 py-16 md:px-10 lg:px-14">
          <h1 className="max-w-[720px] text-[47px] font-medium leading-[0.98] tracking-[-0.052em] md:text-[58px] xl:text-[64px]"><span className="block">Модульный дом</span><span className="block lg:whitespace-nowrap">в ипотеку или рассрочку</span></h1>
          <p className="mt-6 max-w-[580px] text-[17px] leading-[1.65] text-[#5f6a66]">Рассчитаем платёж и поможем оформить документы без скрытых условий.</p>
          <div className="mt-9 grid max-w-[620px] grid-cols-3 gap-5 border-t border-black/15 pt-6">
            {[["от 6%", "Ставка"], ["от 20%", "Первый взнос"], ["до 30 лет", "Срок"]].map(([value, label]) => <div key={label}><p className="text-[24px] font-medium md:text-[30px]">{value}</p><p className="mt-2 text-[12px] text-[#68736f]">{label}</p></div>)}
          </div>
          <div className="mt-9"><PrimaryLink to="/platforma/contacts">Рассчитать платёж</PrimaryLink></div>
        </div>
        <div className="min-h-[430px] overflow-hidden bg-[#ced7d1] lg:min-h-[660px]"><img src={platformaPortfolio[0].src} alt="Готовый модульный дом Платформа" className="h-full w-full object-cover" fetchPriority="high" /></div>
      </div>
    </section>
    <section className="px-5 py-24 md:px-10 md:py-32 lg:px-14">
      <div className="mx-auto max-w-[1480px]">
        <SectionHeading>Выберите удобный способ покупки</SectionHeading>
        <div className="mt-12 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="flex min-h-[430px] flex-col bg-white p-7 md:p-10"><h2 className="text-[34px] font-medium tracking-[-0.035em]">Ипотека</h2><p className="mt-5 max-w-xl text-[16px] leading-[1.7] text-[#68736f]">Работаем со Сбером, ДОМ.РФ и ВТБ. Подбираем программу, готовим документы и сопровождаем сделку.</p><dl className="mt-auto grid gap-5 border-t border-black/15 pt-7 sm:grid-cols-2"><div><dt className="text-[12px] text-[#69736f]">Одобрение</dt><dd className="mt-2 text-[22px] font-medium">от 1 дня</dd></div><div><dt className="text-[12px] text-[#69736f]">Регистрация дома</dt><dd className="mt-2 text-[22px] font-medium">как ИЖС</dd></div></dl></article>
          <div className="grid gap-4"><article className="bg-[#dce2de] p-7 md:p-9"><h2 className="text-[30px] font-medium">Рассрочка</h2><p className="mt-4 text-[15px] leading-[1.7] text-[#64706b]">Напрямую от производителя. Первый взнос от 20%, без банков и без переплаты.</p></article><article className="bg-white p-7 md:p-9"><h2 className="text-[30px] font-medium">Материнский капитал</h2><p className="mt-4 text-[15px] leading-[1.7] text-[#64706b]">Используйте средства полностью или как часть первоначального взноса. Документы подготовим вместе.</p></article></div>
        </div>
        <p className="mt-7 max-w-2xl text-[15px] leading-[1.7] text-[#64706b]">Также доступен наличный и безналичный расчёт по договору с фиксированной стоимостью.</p>
      </div>
    </section>
    <section className="bg-[#dce2de] px-5 py-24 md:px-10 md:py-32 lg:px-14"><div className="mx-auto max-w-[1480px]"><SectionHeading>Как проходит покупка</SectionHeading><div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">{[["Выбираем проект", "Определяем площадь, планировку и комплектацию."], ["Считаем бюджет", "Фиксируем стоимость дома, доставки, фундамента и монтажа."], ["Готовим документы", "Подаём заявку в банк или согласовываем рассрочку."], ["Подписываем договор", "Закрепляем способ оплаты, сроки и состав работ."]].map(([title, text]) => <article key={title} className="min-h-[220px] bg-white p-6"><h2 className="text-[20px] font-medium">{title}</h2><p className="mt-4 text-[14px] leading-relaxed text-[#69736f]">{text}</p></article>)}</div></div></section>
    <Consultation title="Получите расчёт под ваш бюджет" />
  </>
);

const BusinessPage = () => (
  <>
    <Seo title="Модульные решения для бизнеса - Платформа" description="Модульные здания и дома для бизнеса под ключ от производителя Платформа." canonicalPath="/platforma/business" />
    <section className="relative min-h-[790px] overflow-hidden bg-[#173c32] md:min-h-[860px]">
      <img src={platformaBusinessHero} alt="Проект модульного комплекса для бизнеса" className="absolute inset-0 h-full w-full object-cover" fetchPriority="high" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#102b24]/55 via-transparent to-transparent" />
      <div className="relative mx-auto flex min-h-[790px] max-w-[1480px] items-end px-5 pb-8 pt-24 md:min-h-[860px] md:px-10 md:pb-12 lg:px-14">
        <div className="max-w-[930px] bg-[#f3f3ee]/95 p-6 text-[#17201d] backdrop-blur-[8px] md:p-10 lg:p-12">
          <p className="text-[15px] text-[#5f6a66]">Дома «под ключ» от 50 000 ₽/м²</p>
          <h1 className="mt-5 text-[48px] font-medium leading-[0.95] tracking-[-0.052em] md:text-[76px] lg:text-[88px]">Модульные решения для прибыльного бизнеса</h1>
          <div className="mt-9"><PrimaryLink to="/platforma/contacts">Оставить заявку</PrimaryLink></div>
        </div>
      </div>
    </section>
    <section className="px-5 py-24 md:px-10 md:py-32 lg:px-14">
      <div className="mx-auto max-w-[1480px]">
        <SectionHeading>Почему выбирают Платформу?</SectionHeading>
        <div className="mt-14 grid gap-8 lg:grid-cols-[1.06fr_0.94fr] lg:items-start">
          <figure className="lg:sticky lg:top-[98px]"><div className="aspect-[1.18] overflow-hidden bg-[#dfe2dc]"><img src={platformaBusinessObject} alt="Готовый модульный объект Платформа" className="h-full w-full object-cover" /></div><figcaption className="mt-4 text-[13px] leading-relaxed text-[#69736f]">Готовое решение «под ключ» для быстрого запуска объекта.</figcaption></figure>
          <div>{[
            ["Лучшее качество", "Дома изготовлены из высококачественных материалов и соответствуют всем стандартам безопасности."],
            ["Прибыль в любое время года", "Привлекайте гостей и получайте прибыль как в летний, так и в зимний сезон."],
            ["Эстетика", "Современный и стильный дизайн привлекает клиентов и создаёт комфортную атмосферу."],
            ["Современная технология производства", "LVL-брус в конструкции модулей обеспечивает надёжность, устойчивость к внешним воздействиям и экологичность."],
            ["Готовое решение", "Комплексное решение «под ключ» включает всё необходимое для запуска бизнеса."],
            ["Доступность", "Разрешение на строительство не требуется. Бизнес можно запустить за считанные недели."],
          ].map(([title, text], index) => <article key={title} className="grid min-h-[150px] gap-5 border-t border-black/15 py-6 sm:grid-cols-[52px_1fr]"><span className="font-mono text-[12px] text-[#9a5b2c]">/{String(index + 1).padStart(2, "0")}</span><div><h2 className="text-[24px] font-medium tracking-[-0.025em]">{title}</h2><p className="mt-3 max-w-xl text-[15px] leading-[1.7] text-[#68736f]">{text}</p></div></article>)}</div>
        </div>
      </div>
    </section>
    <section className="bg-[#dce2de] px-5 py-24 md:px-10 md:py-32 lg:px-14">
      <div className="mx-auto max-w-[1480px]">
        <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between"><SectionHeading>Каталог проектов</SectionHeading><PrimaryLink to="/platforma/catalog">Все проекты</PrimaryLink></div>
        <p className="mt-6 max-w-3xl text-[17px] leading-relaxed text-[#64706b]">Готовые варианты с удобными планировками можно быстро установить на участке и адаптировать под задачу бизнеса.</p>
        <div className="mt-12 grid gap-5 lg:grid-cols-2">{platformaProjects.slice(0, 6).map((project) => <ProjectCard key={project.slug} project={project} />)}</div>
      </div>
    </section>
    <section className="px-5 py-24 md:px-10 md:py-32 lg:px-14">
      <div className="mx-auto max-w-[1480px]">
        <SectionHeading>Построенные объекты</SectionHeading>
        <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-[#64706b]">Реальные фотографии готовых объектов Платформы: фасады, общественные зоны и интерьеры.</p>
        <div className="mt-12 grid gap-4 md:grid-cols-12">{platformaPortfolio.slice(0, 6).map((item, index) => <figure key={item.src} className={cx("relative min-h-[340px] overflow-hidden bg-[#dfe2dc]", index < 2 ? "md:col-span-6" : "md:col-span-3")}><img src={item.src} alt={item.alt} className="absolute inset-0 h-full w-full object-cover" loading="lazy" /></figure>)}</div>
      </div>
    </section>
    <section className="bg-[#173c32] px-5 py-24 text-white md:px-10 md:py-32 lg:px-14">
      <div className="mx-auto max-w-[1480px]">
        <SectionHeading>Прозрачные условия от заявки до ввода в эксплуатацию</SectionHeading>
        <div className="mt-14 grid gap-px bg-white/15 md:grid-cols-2 lg:grid-cols-4">{platformaWorkStages.map(([title, text], index) => <article key={title} className="flex min-h-[245px] flex-col bg-[#173c32] p-6"><span className="font-mono text-[12px] text-[#d4a27b]">{String(index + 1).padStart(2, "0")}</span><h2 className="mt-auto text-[19px] font-medium">{title}</h2><p className="mt-3 text-[13px] leading-relaxed text-white/58">{text}</p></article>)}</div>
      </div>
    </section>
    <Consultation title="Готовый бизнес под ключ" />
  </>
);

const ContactsPage = () => (
  <>
    <Seo title="Контакты Платформы" description="Контакты производителя модульных домов Платформа в Екатеринбурге." canonicalPath="/platforma/contacts" />
    <section className="px-5 py-16 md:px-10 md:py-24 lg:px-14">
      <div className="mx-auto max-w-[1480px]">
        <h1 className="text-[50px] font-medium leading-none tracking-[-0.052em] md:text-[72px]">Контакты</h1>
        <div className="mt-12 grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <address className="not-italic"><a href={PHONE_HREF} className="text-[30px] font-medium md:text-[42px]">{PHONE}</a><p className="mt-4 text-[15px] text-[#68736f]">Ежедневно с 09:00 до 18:00</p><a href={`mailto:${EMAIL}`} className="mt-8 block text-[20px] font-medium text-[#205142]">{EMAIL}</a><dl className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-1"><div><dt className="text-[12px] text-[#78817e]">Офис</dt><dd className="mt-2 text-[17px] leading-relaxed">Екатеринбург, улица Азина, 22/5</dd></div><div><dt className="text-[12px] text-[#78817e]">Производство</dt><dd className="mt-2 text-[17px] leading-relaxed">Берёзовский, Южная промзона, дом 21</dd></div></dl></address>
          <div className="bg-[#dce2de] p-6 md:p-9"><h2 className="max-w-2xl text-[34px] font-medium leading-[1.05] tracking-[-0.04em] md:text-[46px]">Оставьте номер. Менеджер перезвонит и ответит на вопросы</h2><div className="mt-8"><LeadForm /></div></div>
        </div>
      </div>
    </section>
  </>
);

const NotFoundProject = () => <section className="px-5 py-28 text-center"><h1 className="text-[54px] font-medium">Проект не найден</h1><div className="mt-8"><PrimaryLink to="/platforma/catalog">Вернуться в каталог</PrimaryLink></div></section>;

const Platforma = () => {
  const { pathname } = useLocation();
  const projectSlug = pathname.startsWith("/platforma/project/") ? pathname.split("/").filter(Boolean).at(-1) : null;
  const project = projectSlug ? platformaProjects.find((item) => item.slug === projectSlug) : null;
  let page: ReactNode;
  if (projectSlug) page = project ? <ProjectPage project={project} /> : <NotFoundProject />;
  else if (pathname === "/platforma/catalog") page = <CatalogPage />;
  else if (pathname === "/platforma/about") page = <AboutPage />;
  else if (pathname === "/platforma/payment") page = <PaymentPage />;
  else if (pathname === "/platforma/business") page = <BusinessPage />;
  else if (pathname === "/platforma/contacts") page = <ContactsPage />;
  else page = <HomePage />;
  return <PageShell>{page}</PageShell>;
};

export default Platforma;
