import { useState } from "react";
import { Phone, MapPin, Clock } from "lucide-react";
import Seo from "@/components/Seo";

/**
 * Лендинг производителя РУСМОДУЛЬ (rusmodul-spb.ru).
 * Фирменная палитра взята с сайта: оранжевый #EB6937 на белом,
 * uppercase-типографика, прямоугольные кнопки.
 * Контент, проекты, цены и отзывы — с rusmodul-spb.ru.
 */

const PHONE = "+7 (812) 703-85-84";
const PHONE_HREF = "tel:+78127038584";
const EMAIL = "SKRus178@yandex.ru";
const SITE = "https://rusmodul-spb.ru/";
const ADDRESS = "Русско-Высоцкое, ул. Дорога на Южный птицекомплекс, 3";
const HOURS = "Пн–Пт | с 10:00 до 18:00";

/** Фирменный оранжевый #EB6937 */
const BRAND = "hsl(18,82%,57%)";
const ORANGE = "text-[hsl(18,82%,57%)]";
const LINE = "border-[hsl(0,0%,90%)]";

const IMG = {
  hero: "https://static.tildacdn.com/tild6238-3136-4363-a539-313631663337/Exterior_shot_of_a_s.png",
  houses: [
    "https://optim.tildacdn.com/tild3032-6531-4933-a265-303465653461/-/cover/456x427/center/center/-/format/webp/JWK_0261.webp",
    "https://optim.tildacdn.com/tild3534-3937-4231-a339-316161383531/-/cover/456x427/center/center/-/format/webp/Exterior_Camera_01_W.webp",
    "https://optim.tildacdn.com/tild3633-6462-4363-a164-343666316538/-/cover/456x427/center/center/-/format/webp/XLoft_zijaanzicht.webp",
    "https://optim.tildacdn.com/tild3662-3562-4237-a230-646165333038/-/cover/456x427/center/center/-/format/webp/MHL_30_front.webp",
    "https://optim.tildacdn.com/tild3932-6331-4536-a138-633032306536/-/cover/456x427/center/center/-/format/webp/IMG_2511-min.webp",
    "https://optim.tildacdn.com/tild6261-6664-4563-b137-313061386234/-/cover/456x427/center/center/-/format/webp/240325-Scandi-Double.webp",
    "https://optim.tildacdn.com/tild6165-3835-4131-b339-616564663034/-/cover/456x427/center/center/-/format/webp/1.png.webp",
    "https://optim.tildacdn.com/tild3936-3033-4436-b066-323161336363/-/cover/456x427/center/center/-/format/webp/2.png.webp",
  ],
  gallery: [
    "https://static.tildacdn.com/tild3537-3638-4338-b765-666230393062/Scandi_0144.webp",
    "https://static.tildacdn.com/tild3862-3737-4936-b364-303538666461/2024-04-01_09-57-23_.webp",
    "https://static.tildacdn.com/tild3033-3434-4161-b037-393561323264/WhatsApp-Image-2023-.webp",
    "https://static.tildacdn.com/tild3764-3836-4662-b336-313237326631/Interior_photography.png",
    "https://static.tildacdn.com/tild6638-3230-4464-b035-383634366466/Staircase_leading_to.jpg",
    "https://static.tildacdn.com/tild6464-3531-4234-b033-383438326362/A_highquality_realis.png",
    "https://static.tildacdn.com/tild3032-6531-4933-a265-303465653461/JWK_0261.webp",
    "https://static.tildacdn.com/tild6165-6434-4563-b962-306466346132/5312140793399152046.jpg",
  ],
};

type Project = { name: string; area: string; price: string; image: string; href: string };

const houses: Project[] = [
  { name: "Атриум-3", area: "21 м²", price: "от 1 155 000 ₽", image: IMG.houses[0], href: "https://rusmodul-spb.ru/atreum21" },
  { name: "Атриум-4", area: "28 м²", price: "от 1 540 000 ₽", image: IMG.houses[1], href: "https://rusmodul-spb.ru/atreum28" },
  { name: "Лодж", area: "30 м²", price: "от 1 650 000 ₽", image: IMG.houses[2], href: "https://rusmodul-spb.ru/lodge30" },
  { name: "Двойной Лодж", area: "50 м²", price: "от 2 750 000 ₽", image: IMG.houses[3], href: "https://rusmodul-spb.ru/doublelodge50" },
  { name: "Лофт", area: "63 м²", price: "от 3 465 000 ₽", image: IMG.houses[4], href: "https://rusmodul-spb.ru/loft63" },
  { name: "Скандик Дабл", area: "60 м²", price: "от 3 300 000 ₽", image: IMG.houses[5], href: "https://rusmodul-spb.ru/scandidubl60" },
  { name: "Скандик", area: "100 м²", price: "от 5 500 000 ₽", image: IMG.houses[6], href: "https://rusmodul-spb.ru/scandi100" },
  { name: "Скандик", area: "127 м²", price: "от 6 985 000 ₽", image: IMG.houses[7], href: "https://rusmodul-spb.ru/scandi127" },
];

const banyas: Project[] = [
  { name: "Модульная баня «Кедр»", area: "11 м²", price: "от 605 000 ₽", image: IMG.gallery[1], href: SITE },
  { name: "Модульная баня «Кедр»", area: "25 м²", price: "от 1 375 000 ₽", image: IMG.gallery[0], href: SITE },
];

const categories = [
  { title: "Модульные дома", price: "от 1 155 000 ₽" },
  { title: "Модульные бани", price: "от 605 000 ₽" },
  { title: "Хоз. блоки", price: "от 200 000 ₽" },
];

const steps = [
  { n: "01", title: "Подписание договора", text: "Согласование условий по строительству будущего дома" },
  { n: "02", title: "Проектирование", text: "Вы выбираете модель дома, которая будет построена" },
  { n: "03", title: "Фундамент", text: "Подготовка участка для выполнения фундаментных работ" },
  { n: "04", title: "Производство", text: "Производство согласованного по проекту дома" },
  { n: "05", title: "Сборка дома", text: "Доставка дома на участок и финишная сборка" },
];

const advantages = [
  { title: "Проектирование по индивидуальному проекту", text: "Разработаем проект «с нуля» под ваши задачи: изменим планировку, добавим панорамное остекление или создадим уникальную конфигурацию модулей." },
  { title: "Фиксированная стоимость", text: "Вы знаете точную стоимость объекта «под ключ» с первого дня. Никаких сюрпризов и перерасходов." },
  { title: "Запуск за 2–3 месяца", text: "Пока на вашем участке готовится лёгкий фундамент, мы производим модули на заводе. Экономьте не месяцы, а целый сезон." },
  { title: "Качество и надёжность", text: "Вы получаете технологичное строение, которое сохраняет комфортный микроклимат и не требует частого обслуживания." },
  { title: "Команда с 10-летним опытом", text: "Собственная производственная база и штатные монтажные бригады гарантируют качество на каждом этапе." },
  { title: "Гарантия 5 лет", text: "Мы берём на себя ответственность за конструктив и долговечность строения, подтверждая это официальной гарантией." },
];

const included = [
  { title: "Энергоэффективность 365", text: "Современные технологии утепления: тепло в мороз и прохладно в летний зной." },
  { title: "Полный цикл работ", text: "Можем не только поставить дом, но и полностью укомплектовать его мебелью и благоустроить территорию." },
  { title: "Готовый к работе продукт", text: "Не нужно искать дизайнеров или электриков — всё уже включено в базовую комплектацию." },
  { title: "Заводская чистовая отделка", text: "Никакой пыли и покраски на участке — объект готов к эксплуатации." },
  { title: "Инженерные сети «под ключ»", text: "Все коммуникации разведены внутри модулей — остаётся подключиться к внешним сетям." },
  { title: "Масштабирование без границ", text: "Проект легко адаптируется под гостевой дом, офис или кафе. Нужно больше — добавьте модули." },
];

const reviews = [
  {
    name: "Алексей В.",
    text: "Долго думали: строить полноценный дом или модульный. В итоге выбрали второй вариант и не пожалели. Привезли и установили всё за один день! Дом прогревается за пару часов даже в минус 10.",
  },
  {
    name: "Марина С.",
    text: "Брали баню «Кедр» для дачи. Всё сделали в срок, отделка аккуратная, запах дерева приятный. Монтаж занял один день, вопросов по качеству нет.",
  },
  {
    name: "Игорь П.",
    text: "Ставили дома под глэмпинг. Понравилась фиксированная цена и то, что сезон не потеряли: пока делали фундамент, модули уже производились на заводе.",
  },
];

const faq = [
  {
    q: "Какие документы я получаю после завершения работ?",
    a: "Акт приёмки-передачи модульного дома, технический паспорт и проектную документацию, гарантии на конструкцию и отделку, инструкции по эксплуатации инженерных систем.",
  },
  {
    q: "Можно ли купить дом в ипотеку?",
    a: "Да. Дома подходят под льготные программы: Семейная, IT-ипотека, Господдержка — ставка от 4,5%, первоначальный взнос от 15%.",
  },
  {
    q: "Куда вы доставляете дома?",
    a: "Строим по всей Ленинградской области и за её пределами: радиус доставки модулей 800+ км, работаем в 12+ регионах России.",
  },
];

const Btn = ({
  href,
  children,
  ghost,
}: {
  href: string;
  children: React.ReactNode;
  ghost?: boolean;
}) => (
  <a
    href={href}
    target={href.startsWith("#") ? undefined : "_blank"}
    rel={href.startsWith("#") ? undefined : "noopener noreferrer nofollow"}
    className={
      ghost
        ? "inline-flex items-center justify-center border border-[hsl(0,0%,18%)] px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-[hsl(0,0%,10%)] transition-colors hover:bg-[hsl(0,0%,10%)] hover:text-white"
        : "inline-flex items-center justify-center bg-[hsl(18,82%,57%)] px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[hsl(18,72%,49%)]"
    }
  >
    {children}
  </a>
);

const Section = ({
  id,
  eyebrow,
  title,
  subtitle,
  children,
  tone = "light",
}: {
  id?: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  tone?: "light" | "grey";
}) => (
  <section
    id={id}
    className={`border-b ${LINE} ${tone === "grey" ? "bg-[hsl(0,0%,97%)]" : "bg-white"} px-4 py-16 md:px-10 md:py-24`}
  >
    <div className="mx-auto max-w-[1360px]">
      {eyebrow && (
        <p className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${ORANGE}`}>{eyebrow}</p>
      )}
      {title && (
        <h2 className="mt-4 max-w-3xl text-[26px] font-bold uppercase leading-[1.05] tracking-[0.01em] text-[hsl(0,0%,8%)] md:text-[44px]">
          {title}
        </h2>
      )}
      {subtitle && <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[hsl(0,0%,40%)] md:text-base">{subtitle}</p>}
      <div className={title || eyebrow ? "mt-10 md:mt-14" : ""}>{children}</div>
    </div>
  </section>
);

const Card = ({ p }: { p: Project }) => (
  <a href={p.href} target="_blank" rel="noopener noreferrer nofollow" className="group block bg-white">
    <div className="aspect-[4/3] overflow-hidden bg-[hsl(0,0%,94%)]">
      <img
        src={p.image}
        alt={`Модульный дом ${p.name} ${p.area} — РУСМОДУЛЬ`}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
      />
    </div>
    <div className={`border-t ${LINE} px-5 py-5`}>
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-[15px] font-bold uppercase tracking-[0.06em] text-[hsl(0,0%,8%)]">
          {p.name} | {p.area}
        </h3>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className={`text-[15px] font-semibold ${ORANGE}`}>{p.price}</span>
        <span className="text-[11px] uppercase tracking-[0.16em] text-[hsl(0,0%,45%)] group-hover:text-[hsl(0,0%,10%)]">
          Подробнее
        </span>
      </div>
    </div>
  </a>
);

const RusModul = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-white font-sans text-[hsl(0,0%,12%)] antialiased">
      <Seo
        title="РУСМОДУЛЬ — модульные дома, бани и хозблоки в СПб"
        description="Модульные дома от 1 155 000 ₽, бани от 605 000 ₽, хозблоки от 200 000 ₽. Производство от 30 дней, монтаж за 7 дней, гарантия 5 лет, ипотека от 4,5%."
        canonicalPath="/rusmodul"
      />

      {/* Header */}
      <header className={`sticky top-0 z-40 border-b ${LINE} bg-white/95 backdrop-blur`}>
        <div className="mx-auto flex h-16 max-w-[1360px] items-center justify-between px-4 md:px-10">
          <a href="#top" className="text-[17px] font-bold uppercase tracking-[0.16em] text-[hsl(0,0%,8%)]">
            РУС<span className={ORANGE}>МОДУЛЬ</span>
          </a>
          <nav className="hidden items-center gap-8 text-[12px] font-medium uppercase tracking-[0.14em] text-[hsl(0,0%,40%)] lg:flex">
            <a href="#houses" className="hover:text-[hsl(0,0%,8%)]">Дома</a>
            <a href="#banya" className="hover:text-[hsl(0,0%,8%)]">Бани</a>
            <a href="#steps" className="hover:text-[hsl(0,0%,8%)]">Этапы</a>
            <a href="#gallery" className="hover:text-[hsl(0,0%,8%)]">Галерея</a>
            <a href="#reviews" className="hover:text-[hsl(0,0%,8%)]">Отзывы</a>
            <a href="#contacts" className="hover:text-[hsl(0,0%,8%)]">Контакты</a>
          </nav>
          <a
            href={PHONE_HREF}
            className="text-[13px] font-semibold tracking-[0.02em] text-[hsl(0,0%,8%)] hover:text-[hsl(18,82%,57%)]"
          >
            {PHONE}
          </a>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="relative min-h-[560px] md:min-h-[720px]">
        <img
          src={IMG.hero}
          alt="Модульный дом РУСМОДУЛЬ с установкой за один день"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent" />
        <div className="relative mx-auto flex min-h-[560px] max-w-[1360px] flex-col justify-center px-4 py-20 md:min-h-[720px] md:px-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[hsl(18,82%,68%)]">
            Санкт-Петербург и Ленинградская область
          </p>
          <h1 className="mt-5 max-w-4xl text-[32px] font-bold uppercase leading-[1.02] tracking-[0.01em] text-white md:text-[62px]">
            Модульные дома, бани и хозблоки с установкой от 1 дня
          </h1>
          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-white/80 md:text-lg">
            Построим на заводе и привезём готовый дом прямо вам на участок. Производство от 30 дней.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Btn href={SITE}>Оставить заявку</Btn>
            <a
              href="#houses"
              className="inline-flex items-center justify-center border border-white/60 px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-white hover:text-[hsl(0,0%,10%)]"
            >
              Смотреть проекты
            </a>
          </div>
        </div>
      </section>

      {/* Цифры */}
      <div className={`border-b ${LINE} bg-white`}>
        <dl className="mx-auto grid max-w-[1360px] grid-cols-3 divide-x divide-[hsl(0,0%,90%)] px-4 md:px-10">
          {[
            { v: "7 дней", l: "монтаж на участке" },
            { v: "5 лет", l: "гарантия" },
            { v: "от 4,5%", l: "в ипотеку" },
          ].map((s) => (
            <div key={s.l} className="px-4 py-8 first:pl-0 md:py-10">
              <dt className="text-xl font-bold uppercase tracking-[0.04em] text-[hsl(0,0%,8%)] md:text-3xl">{s.v}</dt>
              <dd className="mt-2 text-[11px] uppercase tracking-[0.16em] text-[hsl(0,0%,45%)]">{s.l}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Категории */}
      <Section tone="grey" eyebrow="Что мы производим" title="Три направления">
        <div className="grid gap-px bg-[hsl(0,0%,90%)] md:grid-cols-3">
          {categories.map((c) => (
            <div key={c.title} className="bg-[hsl(0,0%,97%)] p-8">
              <h3 className="text-[17px] font-bold uppercase tracking-[0.06em] text-[hsl(0,0%,8%)]">{c.title}</h3>
              <p className={`mt-4 text-[15px] font-semibold ${ORANGE}`}>{c.price}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Дома */}
      <Section
        id="houses"
        eyebrow="Модельный ряд"
        title="Модульные дома"
        subtitle="Готовые дома заводского производства с чистовой отделкой и разведёнными коммуникациями."
      >
        <div className="grid gap-px bg-[hsl(0,0%,90%)] sm:grid-cols-2 lg:grid-cols-4">
          {houses.map((p) => (
            <Card key={`${p.name}-${p.area}`} p={p} />
          ))}
        </div>
        <div className="mt-10">
          <Btn href="https://rusmodul-spb.ru/projects" ghost>
            Все проекты
          </Btn>
        </div>
      </Section>

      {/* Бани */}
      <Section id="banya" tone="grey" eyebrow="Бани" title="Модульные бани «Кедр»" subtitle="Готовая баня с отделкой — привозим и устанавливаем за один день.">
        <div className="grid gap-px bg-[hsl(0,0%,90%)] sm:grid-cols-2 lg:grid-cols-4">
          {banyas.map((p) => (
            <Card key={`${p.name}-${p.area}`} p={p} />
          ))}
        </div>
      </Section>

      {/* Этапы */}
      <Section id="steps" eyebrow="Этапы работы" title="Как строится ваш дом">
        <div className="grid gap-px bg-[hsl(0,0%,90%)] sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((s) => (
            <div key={s.n} className="bg-white p-7">
              <span className={`text-[11px] font-semibold tracking-[0.2em] ${ORANGE}`}>{s.n}</span>
              <h3 className="mt-4 text-[14px] font-bold uppercase tracking-[0.06em] text-[hsl(0,0%,8%)]">{s.title}</h3>
              <p className="mt-3 text-[13px] leading-relaxed text-[hsl(0,0%,42%)]">{s.text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Преимущества */}
      <Section tone="grey" eyebrow="Преимущества" title="Почему РУСМОДУЛЬ">
        <div className="grid gap-px bg-[hsl(0,0%,90%)] md:grid-cols-2 lg:grid-cols-3">
          {advantages.map((a) => (
            <div key={a.title} className="bg-[hsl(0,0%,97%)] p-7">
              <h3 className="text-[14px] font-bold uppercase tracking-[0.06em] text-[hsl(0,0%,8%)]">{a.title}</h3>
              <p className="mt-3 text-[13px] leading-relaxed text-[hsl(0,0%,42%)]">{a.text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Ипотека */}
      <section className="border-b border-[hsl(18,82%,57%)] bg-[hsl(18,82%,57%)] px-4 py-16 text-white md:px-10 md:py-20">
        <div className="mx-auto grid max-w-[1360px] gap-8 md:grid-cols-[1fr_1fr] md:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/70">Ипотека</p>
            <h2 className="mt-4 text-[28px] font-bold uppercase leading-[1.05] md:text-[44px]">
              Ваша недвижимость в ипотеку от 4,5%
            </h2>
          </div>
          <div>
            <p className="text-sm leading-relaxed text-white/90 md:text-base">
              Наши дома подходят под все виды льготных программ: Семейная, IT-ипотека, Господдержка. Помогаем с
              одобрением даже в сложных случаях. Первоначальный взнос от 15%.
            </p>
            <a
              href={SITE}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="mt-7 inline-flex items-center justify-center bg-white px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-[hsl(18,82%,45%)] transition-opacity hover:opacity-90"
            >
              Рассчитать платёж
            </a>
          </div>
        </div>
      </section>

      {/* Комплектация */}
      <Section eyebrow="Комплектация" title="Что входит в дом">
        <div className="grid gap-px bg-[hsl(0,0%,90%)] md:grid-cols-2 lg:grid-cols-3">
          {included.map((i) => (
            <div key={i.title} className="bg-white p-7">
              <h3 className="text-[14px] font-bold uppercase tracking-[0.06em] text-[hsl(0,0%,8%)]">{i.title}</h3>
              <p className="mt-3 text-[13px] leading-relaxed text-[hsl(0,0%,42%)]">{i.text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* География */}
      <Section tone="grey" eyebrow="География" title="Строим по всей Ленинградской области и за её пределами" subtitle="Наши модули идеально вписываются в любой ландшафт и условия.">
        <dl className="grid gap-px bg-[hsl(0,0%,90%)] sm:grid-cols-2">
          {[
            { v: "800+ км", l: "радиус доставки модулей" },
            { v: "12+", l: "регионов России" },
          ].map((s) => (
            <div key={s.l} className="bg-[hsl(0,0%,97%)] p-8">
              <dt className="text-[28px] font-bold uppercase tracking-[0.04em] text-[hsl(0,0%,8%)] md:text-[40px]">{s.v}</dt>
              <dd className="mt-2 text-[11px] uppercase tracking-[0.16em] text-[hsl(0,0%,45%)]">{s.l}</dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* Галерея */}
      <Section id="gallery" eyebrow="Портфолио" title="Реализованные объекты">
        <div className="grid grid-cols-2 gap-px bg-[hsl(0,0%,90%)] md:grid-cols-4">
          {IMG.gallery.map((src, i) => (
            <div key={src + i} className="aspect-square overflow-hidden bg-[hsl(0,0%,94%)]">
              <img
                src={src}
                alt={`Готовый объект РУСМОДУЛЬ №${i + 1}`}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.05]"
              />
            </div>
          ))}
        </div>
      </Section>

      {/* Отзывы */}
      <Section id="reviews" tone="grey" eyebrow="Отзывы — 4,9" title="Доверие в каждом метре" subtitle="Ваше идеальное пространство для жизни и отдыха — наше любимое дело.">
        <div className="grid gap-px bg-[hsl(0,0%,90%)] md:grid-cols-3">
          {reviews.map((r) => (
            <blockquote key={r.name} className="bg-[hsl(0,0%,97%)] p-7">
              <p className="text-[13px] leading-relaxed text-[hsl(0,0%,42%)]">{r.text}</p>
              <footer className="mt-5 text-[12px] font-semibold uppercase tracking-[0.14em] text-[hsl(0,0%,8%)]">
                {r.name}
              </footer>
            </blockquote>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section eyebrow="Вопросы" title="Частые вопросы">
        <div className={`border-t ${LINE}`}>
          {faq.map((f, i) => (
            <div key={f.q} className={`border-b ${LINE}`}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="flex w-full items-center justify-between gap-6 py-6 text-left"
              >
                <span className="text-[15px] font-semibold text-[hsl(0,0%,8%)] md:text-[17px]">{f.q}</span>
                <span className={`text-2xl leading-none ${ORANGE}`}>{openFaq === i ? "–" : "+"}</span>
              </button>
              {openFaq === i && (
                <p className="max-w-3xl pb-6 text-sm leading-relaxed text-[hsl(0,0%,42%)]">{f.a}</p>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* Контакты */}
      <Section
        id="contacts"
        tone="grey"
        eyebrow="Контакты"
        title="Убедитесь в качестве лично"
        subtitle="Посетите наше пространство в СПб. В офисе подберём планировку, а на площадке покажем готовую работу в деталях."
      >
        <div className="grid gap-px bg-[hsl(0,0%,90%)] md:grid-cols-3">
          <a href={PHONE_HREF} className="bg-[hsl(0,0%,97%)] p-7">
            <span className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[hsl(0,0%,45%)]">
              <Phone className="h-3.5 w-3.5" /> Телефон
            </span>
            <span className="mt-3 block text-xl font-bold text-[hsl(0,0%,8%)]">{PHONE}</span>
            <span className="mt-2 block text-[13px] text-[hsl(0,0%,45%)]">{EMAIL}</span>
          </a>
          <div className="bg-[hsl(0,0%,97%)] p-7">
            <span className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[hsl(0,0%,45%)]">
              <MapPin className="h-3.5 w-3.5" /> Производство
            </span>
            <span className="mt-3 block text-sm leading-relaxed text-[hsl(0,0%,20%)]">{ADDRESS}</span>
          </div>
          <div className="bg-[hsl(0,0%,97%)] p-7">
            <span className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[hsl(0,0%,45%)]">
              <Clock className="h-3.5 w-3.5" /> Режим работы
            </span>
            <span className="mt-3 block text-sm text-[hsl(0,0%,20%)]">{HOURS}</span>
            <div className="mt-5">
              <Btn href="http://rusmodul-spb.ru/production">О производстве</Btn>
            </div>
          </div>
        </div>
      </Section>

      <footer className="bg-white px-4 py-12 md:px-10">
        <div className="mx-auto flex max-w-[1360px] flex-col gap-2 text-xs text-[hsl(0,0%,45%)]">
          <span className="text-lg font-bold uppercase tracking-[0.12em] text-[hsl(0,0%,8%)]">
            РУС<span style={{ color: BRAND }}>МОДУЛЬ</span>
          </span>
          <span>{ADDRESS}</span>
          <span>
            Информация о проектах и ценах взята с официального сайта производителя{" "}
            <a
              href={SITE}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="underline underline-offset-2 hover:text-[hsl(0,0%,10%)]"
            >
              rusmodul-spb.ru
            </a>
            .
          </span>
        </div>
      </footer>
    </div>
  );
};

export default RusModul;
