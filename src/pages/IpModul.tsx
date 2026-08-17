import { useEffect, useState } from "react";
import Seo from "@/components/Seo";

/**
 * Лендинг производителя IP MODUL (ip-modul.ru).
 * Визуальная система — референс onehouse.ru: белый фон, крупная узкая
 * uppercase-типографика, полноэкранный герой с фото, минимум декора,
 * тонкие линии, чёрно-белый контраст.
 * Контент, проекты и цены взяты с ip-modul.ru. Придуманных блоков нет:
 * галереи «дома и производство» на сайте производителя нет — её здесь тоже нет.
 */

const PHONE = "+7 (812) 203 82 06";
const PHONE_HREF = "tel:+78122038206";
const TELEGRAM = "https://t.me/IPMODUL";
const WHATSAPP = "https://api.whatsapp.com/send/?phone=79934912461";
const AVITO =
  "https://www.avito.ru/brands/i192533124/all?src=sharing&sellerId=9fc38c2e8091cbeee2f2fb39a2fa647b";
const SITE = "https://ip-modul.ru/";
const ADDRESS = "Ленинградская область, Гатчинский район, д. Новый Свет, д. 118А";

/** Палитра: белый фон, чёрный текст, серые линии */
const BG = "hsl(0,0%,100%)";
const INK = "hsl(0,0%,7%)";
const MUTED = "hsl(0,0%,42%)";
const HAIR = "hsl(0,0%,88%)";
const PLACEHOLDER = "hsl(0,0%,93%)";

const DISPLAY = "'Oswald', 'Arial Narrow', system-ui, sans-serif";

const IMG = {
  g: [
    "https://optim.tildacdn.com/tild3934-3334-4830-a439-313362663866/-/format/webp/1_.jpeg.webp",
    "https://optim.tildacdn.com/tild6138-3939-4362-a464-643239336539/-/format/webp/1_.jpg.webp",
    "https://optim.tildacdn.com/tild3630-6136-4461-a561-353362643834/-/format/webp/4.jpeg.webp",
    "https://optim.tildacdn.com/tild6634-3539-4461-b139-373132326163/-/format/webp/3.jpeg.webp",
    "https://optim.tildacdn.com/tild3631-6130-4364-b635-393634643132/-/format/webp/IMG_0683.jpeg.webp",
    "https://optim.tildacdn.com/tild3031-3534-4262-b065-376534383462/-/format/webp/6.jpeg.webp",
    "https://optim.tildacdn.com/tild6338-6530-4964-b138-303266363139/-/format/webp/IMG_2071.jpeg.webp",
    "https://optim.tildacdn.com/tild3938-3966-4538-b134-386433373235/-/format/webp/IMG_0685.jpeg.webp",
    "https://optim.tildacdn.com/tild3266-6263-4863-b863-623835323539/-/format/webp/IMG_2088.jpeg.webp",
    "https://optim.tildacdn.com/tild3762-3162-4062-a631-376437663363/-/format/webp/IMG_7834.jpeg.webp",
    "https://optim.tildacdn.com/tild3663-3364-4435-b364-623162386561/-/format/webp/IMG_2096.jpeg.webp",
    "https://optim.tildacdn.com/tild3564-6335-4235-a361-386232383365/-/format/webp/WhatsApp_Image_2024-.jpeg.webp",
  ],
  start: [
    "https://optim.tildacdn.com/tild3833-6536-4565-b862-346336333963/-/format/webp/ChatGPT_Image_30__20.png.webp",
    "https://optim.tildacdn.com/tild3733-3261-4663-a661-313938653166/-/format/webp/____.png.webp",
    "https://optim.tildacdn.com/tild3830-6165-4230-a233-663538306238/-/format/webp/ChatGPT_Image_30__20.png.webp",
  ],
};

type Project = {
  name: string;
  price: string;
  area: string;
  specs: string[];
  href: string;
  image: string;
};

const projects: Project[] = [
  {
    name: "IP 40",
    price: "2 620 000 ₽",
    area: "40 м²",
    specs: ["2,9 × 5 × 8 м", "жилая 26 м²", "потолки 2 – 2,4 м"],
    href: "https://ip-modul.ru/ip40",
    image: IMG.g[0],
  },
  {
    name: "IP 48",
    price: "3 080 000 ₽",
    area: "48 м²",
    specs: ["3,6 × 6 × 8 м", "жилая 31 м²", "потолки 2 – 3,1 м"],
    href: "https://ip-modul.ru/ip48",
    image: IMG.g[1],
  },
  {
    name: "IP 60",
    price: "3 870 000 ₽",
    area: "60 м²",
    specs: ["3,3 × 7,5 × 8 м", "жилая 40 м²", "потолки 2 – 2,7 м"],
    href: "https://ip-modul.ru/ip60",
    image: IMG.g[2],
  },
  {
    name: "IP 64",
    price: "4 950 000 ₽",
    area: "64 м²",
    specs: ["3,7 × 8 × 8 м", "жилая 43 м²", "потолки 2 – 3,1 м"],
    href: "https://ip-modul.ru/ip64",
    image: IMG.g[3],
  },
  {
    name: "IP 72",
    price: "4 150 000 ₽",
    area: "72 м²",
    specs: ["3,7 × 9 × 8 м", "жилая 49 м²", "потолки 2 – 3,1 м"],
    href: "https://ip-modul.ru/ip72",
    image: IMG.g[4],
  },
  {
    name: "IP 82",
    price: "5 850 000 ₽",
    area: "82 м²",
    specs: ["3,6 × 7,5 × 11 м", "жилая 60 м²", "потолки 2 – 3 м"],
    href: "https://ip-modul.ru/ip82",
    image: IMG.g[5],
  },
  {
    name: "IP 88",
    price: "6 350 000 ₽",
    area: "88 м²",
    specs: ["3,6 × 8 × 11 м", "жилая 64 м²", "потолки 2 – 3 м"],
    href: "https://ip-modul.ru/ip88",
    image: IMG.g[6],
  },
  {
    name: "IP 99",
    price: "7 210 000 ₽",
    area: "99 м²",
    specs: ["3,7 × 9 × 11 м", "жилая 74 м²", "потолки 2 – 3,1 м"],
    href: "https://ip-modul.ru/ip99",
    image: IMG.g[7],
  },
];

const bigProjects: Project[] = [
  {
    name: "Дом Шале",
    price: "6 120 000 ₽",
    area: "102 м²",
    specs: ["5,5 × 10 × 12 м", "внутри 84 м²", "потолки 2,4 – 4 м"],
    href: "https://ip-modul.ru/#popup-stoimost",
    image: IMG.g[9],
  },
  {
    name: "Двухэтажный дом",
    price: "8 550 000 ₽",
    area: "99 м²",
    specs: ["3,7 × 9 × 11 м", "жилая 74 м²", "потолки 2 – 3,1 м"],
    href: "https://ip-modul.ru/#popup-stoimost",
    image: IMG.g[10],
  },
  {
    name: "Классический дом",
    price: "7 400 000 ₽",
    area: "102 м²",
    specs: ["4,5 × 8,8 × 12 м", "внутри 78 м²", "потолки 2,4 – 3,5 м"],
    href: "https://ip-modul.ru/#popup-stoimost",
    image: IMG.g[11],
  },
];

const startSeries: Project[] = [
  {
    name: "Старт 24",
    price: "1 300 000 ₽",
    area: "24 м²",
    specs: [],
    href: "https://ip-modul.ru/#popup-stoimost",
    image: IMG.start[0],
  },
  {
    name: "МБ-36",
    price: "1 950 000 ₽",
    area: "36 м²",
    specs: [],
    href: "https://ip-modul.ru/#popup-stoimost",
    image: IMG.start[1],
  },
  {
    name: "Старт 30",
    price: "1 625 000 ₽",
    area: "30 м²",
    specs: [],
    href: "https://ip-modul.ru/#popup-stoimost",
    image: IMG.start[2],
  },
];

const competences = [
  { title: "Модульные дома", text: "Готовые дома с террасой под завоз мебели, площадь 40 – 99 м²." },
  { title: "Серия «Старт»", text: "Компактные модули 24 – 36 м² в полной комплектации." },
  { title: "Большие дома", text: "Шале, двухэтажные и классические проекты до 102 м²." },
  { title: "Индивидуальный проект", text: "Планировка, плоская крыша, умный дом и тёплый пол под задачу." },
];

const advantages = [
  { n: "01", title: "Уникальные планировки", text: "Планировки дома, которые будут отражать вашу индивидуальность." },
  { n: "02", title: "Скорость", text: "Быстрая и качественная реализация ваших проектов." },
  { n: "03", title: "Индивидуальный подход", text: "Учитываем все ваши пожелания и требования к дому." },
  { n: "04", title: "Команда", text: "Профессиональные строители и дизайнеры: качество, которому можно доверять." },
];

const construction = [
  {
    n: "01",
    title: "Крыша",
    items: [
      "профлист С20 цвет 7024",
      "обрешётка",
      "контробрешётка",
      "пароизоляция, проклеенная скотчем",
      "утепление 200 мм",
      "каркас из доски камерной сушки 50×200 мм",
      "подкровельная мембрана",
    ],
  },
  {
    n: "02",
    title: "Стены",
    items: [
      "имитация бруса 20 мм, крашеная до монтажа",
      "обрешётка",
      "пароизоляция, проклеенная скотчем",
      "утепление 150 мм",
      "каркас из доски камерной сушки 50×150 мм",
      "ветрозащитная мембрана",
      "профлист С20 цвет 7024 либо фасадная доска",
    ],
  },
  {
    n: "03",
    title: "Пол",
    items: [
      "ламинат 33 класс",
      "обрешётка",
      "ветрозащитная мембрана",
      "утепление 200 мм",
      "каркас из доски камерной сушки 50×200 мм",
      "пароизоляция",
      "ОСБ 22 мм",
    ],
  },
  {
    n: "04",
    title: "Окна",
    items: [
      "двухкамерный стеклопакет с аргоном и i-напылением",
      "пятикамерный пластиковый профиль 70 мм с дополнительным армированием",
    ],
  },
];

const options = [
  "Любой дом с плоской крышей",
  "Индивидуальный проект",
  "Система умного дома",
  "Растущий дом для будущего расширения",
  "Инфракрасный или водяной тёплый пол",
];

const reviews = [
  {
    name: "Дарья Ц.",
    text: "Спасибо Ивану! Прошел уже год с покупки, пора написать отзыв. Отличный домик, очень уютный и стильный. Брала под аренду, наши клиенты очень довольны. Собираемся заказать ещё парочку.",
  },
  {
    name: "Леонид М.",
    text: "Хочу сказать спасибо за дом. Цены растут, но мы успели внести предоплату заранее и зафиксировали цену на пол года. При заключении договора добавили всё, что хотели, прописали, что какого цвета будет.",
  },
  {
    name: "Кристина",
    text: "Мы долго искали компанию для строительства нашего дома. Уже на первой встрече мы были впечатлены профессионализмом и качеством работы. Все работы были выполнены безупречно и аккуратно.",
  },
  {
    name: "Мария",
    text: "Теперь у нас есть дом, это компания, которой можно доверить на все 100. После консультации приехал на экскурсию на производство. За 2,5 месяца уже готовый дом стоял у нас на участке.",
  },
  {
    name: "Дарья",
    text: "Выражаем огромную благодарность Ивану за его работу! Теперь у нас есть прекрасный загородный каркасный домик «под ключ». Все материалы в доме очень качественные.",
  },
  {
    name: "Анастасия",
    text: "Благодарю за подход: учли пожелания, подобрали дизайн, меняли в ходе сборки дома на производстве планировку. Если нам обещают сделать — значит сделают!",
  },
];

const faq = [
  {
    q: "Сколько времени занимает изготовление дома?",
    a: "Дом собирается на производстве и приезжает к вам готовым — в среднем весь цикл занимает около 2,5 месяцев.",
  },
  {
    q: "Что входит в стоимость дома?",
    a: "Готовый дом с террасой под завоз мебели: чистовая отделка, окна, инженерия и утепление по заводскому стандарту.",
  },
  {
    q: "Можно ли изменить планировку?",
    a: "Да, планировка меняется под ваши задачи — вплоть до индивидуального проекта, плоской крыши, тёплого пола и системы умного дома.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "IP MODUL",
  url: "https://ip-modul.ru",
  telephone: "+78122038206",
  address: {
    "@type": "PostalAddress",
    addressRegion: "Ленинградская область",
    streetAddress: "Гатчинский район, д. Новый Свет, д. 118А",
    addressCountry: "RU",
  },
  description: "Модульные дома и бани под ключ от 1,3 млн рублей с гарантией.",
};

const ext = (href: string) =>
  href.startsWith("#") || href.startsWith("tel:") || href.startsWith("mailto:")
    ? {}
    : { target: "_blank", rel: "noopener noreferrer nofollow" };

const Display = ({
  children,
  className = "",
  as: Tag = "h2",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
  style?: React.CSSProperties;
}) => (
  <Tag
    className={`uppercase leading-[0.92] ${className}`}
    style={{ fontFamily: DISPLAY, fontWeight: 600, letterSpacing: "-0.01em", ...style }}
  >
    {children}
  </Tag>
);

const Btn = ({ href, children, ghost }: { href: string; children: React.ReactNode; ghost?: boolean }) => (
  <a
    href={href}
    {...ext(href)}
    className="inline-flex items-center justify-center px-9 py-4 text-[12px] uppercase tracking-[0.14em] transition-colors duration-300"
    style={
      ghost
        ? { border: `1px solid ${INK}`, color: INK, fontFamily: DISPLAY, fontWeight: 500 }
        : { background: INK, color: BG, fontFamily: DISPLAY, fontWeight: 500 }
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
}: {
  id?: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}) => (
  <section id={id} className="px-5 py-20 md:px-10 md:py-28" style={{ borderTop: `1px solid ${HAIR}` }}>
    <div className="mx-auto max-w-[1400px]">
      {(eyebrow || title) && (
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            {eyebrow && (
              <p className="text-[11px] uppercase tracking-[0.26em]" style={{ color: MUTED }}>
                {eyebrow}
              </p>
            )}
            {title && (
              <Display className="mt-4 text-[38px] md:text-[76px]" style={{ color: INK }}>
                {title}
              </Display>
            )}
          </div>
          {subtitle && (
            <p className="max-w-sm text-[15px] leading-[1.7] md:text-right" style={{ color: MUTED }}>
              {subtitle}
            </p>
          )}
        </div>
      )}
      <div className={eyebrow || title ? "mt-12 md:mt-20" : ""}>{children}</div>
    </div>
  </section>
);

/** Полноширинный кадр проекта — как в референсе: фото во всю ширину, подпись поверх снизу. */
const Card = ({ p, tall }: { p: Project; tall?: boolean }) => (
  <a href={p.href} {...ext(p.href)} className="group relative block overflow-hidden">
    <div
      className={`${tall ? "aspect-[4/5] md:aspect-[21/9]" : "aspect-[4/3] md:aspect-[16/7]"} overflow-hidden`}
      style={{ background: PLACEHOLDER }}
    >
      <img
        src={p.image}
        alt={`Модульный дом ${p.name} — IP MODUL`}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]"
      />
    </div>
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
    <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-5 md:flex-row md:items-end md:justify-between md:p-10">
      <div>
        <Display as="h3" className="text-[26px] text-white md:text-[46px]">
          {p.name}
        </Display>
        {p.specs.length > 0 && (
          <p className="mt-1 text-[13px] leading-[1.6] text-white/75">{p.specs.join(" · ")}</p>
        )}
      </div>
      <span className="shrink-0 text-[13px] uppercase tracking-[0.14em] text-white/90 md:text-[15px]">
        {p.area} · от {p.price}
      </span>
    </div>
  </a>
);

/** Компактный кадр для второстепенных серий — плотная сетка без просветов. */
const TileCard = ({ p }: { p: Project }) => (
  <a href={p.href} {...ext(p.href)} className="group relative block overflow-hidden">
    <div className="aspect-[4/3] overflow-hidden" style={{ background: PLACEHOLDER }}>
      <img
        src={p.image}
        alt={`Модульный дом ${p.name} — IP MODUL`}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.05]"
      />
    </div>
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 to-transparent" />
    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5">
      <Display as="h3" className="text-[20px] text-white md:text-[26px]">
        {p.name}
      </Display>
      <span className="shrink-0 text-[12px] text-white/85">от {p.price}</span>
    </div>
  </a>
);


const Row = ({ label, title, text }: { label?: string; title: string; text: string }) => (
  <div
    className="grid gap-3 py-8 md:grid-cols-[70px_1fr_1.5fr] md:items-baseline md:gap-10 md:py-10"
    style={{ borderTop: `1px solid ${HAIR}` }}
  >
    <span className="text-[12px] tracking-[0.2em]" style={{ color: MUTED }}>
      {label}
    </span>
    <Display as="h3" className="text-[22px] md:text-[32px]" style={{ color: INK }}>
      {title}
    </Display>
    <p className="text-[15px] leading-[1.75]" style={{ color: MUTED }}>
      {text}
    </p>
  </div>
);

const IpModul = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    const id = "oswald-font";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
  }, []);

  return (
    <div className="min-h-screen font-sans antialiased" style={{ background: BG, color: INK }}>
      <Seo
        title="IP MODUL — модульные дома под ключ в Ленобласти"
        description="Модульные дома IP MODUL от 1 300 000 ₽: заводская сборка с чистовой отделкой, терраса, готовность за 2,5 месяца. Производство в Гатчинском районе."
        canonicalPath="/ip-modul"
        jsonLd={jsonLd}
      />

      {/* Шапка */}
      <header
        className="sticky top-0 z-40 backdrop-blur"
        style={{ background: "hsla(0,0%,100%,0.92)", borderBottom: `1px solid ${HAIR}` }}
      >
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 md:px-10">
          <a
            href="#top"
            className="text-[17px] uppercase tracking-[0.12em]"
            style={{ color: INK, fontFamily: DISPLAY, fontWeight: 700 }}
          >
            IP Modul
          </a>
          <nav
            className="hidden items-center gap-8 text-[12px] uppercase tracking-[0.14em] lg:flex"
            style={{ color: INK, fontFamily: DISPLAY, fontWeight: 400 }}
          >
            <a href="#projects" className="transition-opacity hover:opacity-50">Проекты</a>
            <a href="#start" className="transition-opacity hover:opacity-50">Старт</a>
            <a href="#tech" className="transition-opacity hover:opacity-50">Технология</a>
            <a href="#reviews" className="transition-opacity hover:opacity-50">Отзывы</a>
            <a href="#contacts" className="transition-opacity hover:opacity-50">Контакты</a>
          </nav>
          <a href={PHONE_HREF} className="text-[13px] tracking-[0.06em]" style={{ color: INK }}>
            {PHONE}
          </a>
        </div>
      </header>

      {/* Герой */}
      <section id="top" className="relative h-[calc(100svh-4rem)] min-h-[540px] w-full overflow-hidden">
        <img
          src={IMG.g[0]}
          alt="Модульный дом IP MODUL с террасой"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 px-5 pb-12 md:px-10 md:pb-14">
          <div className="mx-auto max-w-[1400px]">
            <Display as="h1" className="max-w-5xl text-[44px] text-white md:text-[104px]">
              Модульные дома под ключ
            </Display>
            <div className="mt-6 flex flex-col gap-6 md:mt-8 md:flex-row md:items-end md:justify-between">
              <p className="max-w-md text-[15px] leading-[1.7] text-white/80 md:text-[17px]">
                Собираем дом с террасой и чистовой отделкой на производстве в Гатчинском районе
                и привозим готовым на участок — около 2,5 месяцев.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={SITE}
                  {...ext(SITE)}
                  className="inline-flex items-center justify-center px-9 py-4 text-[12px] uppercase tracking-[0.14em] transition-opacity duration-300 hover:opacity-90"
                  style={{ background: BG, color: INK, fontFamily: DISPLAY, fontWeight: 500 }}
                >
                  Оставить заявку
                </a>
                <a
                  href="#projects"
                  className="inline-flex items-center justify-center border border-white/70 px-9 py-4 text-[12px] uppercase tracking-[0.14em] text-white transition-colors duration-300 hover:bg-white hover:text-black"
                  style={{ fontFamily: DISPLAY, fontWeight: 500 }}
                >
                  Проекты
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Компетенции */}
      <Section eyebrow="Что мы делаем" title="Наши компетенции">
        <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-4" style={{ background: HAIR }}>
          {competences.map((c) => (
            <div key={c.title} className="p-7 md:p-8" style={{ background: BG }}>
              <Display as="h3" className="text-[22px] md:text-[26px]" style={{ color: INK }}>
                {c.title}
              </Display>
              <p className="mt-4 text-[14px] leading-[1.7]" style={{ color: MUTED }}>
                {c.text}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Проекты — полноширинные кадры друг под другом */}
      <section id="projects" className="py-20 md:py-28" style={{ borderTop: `1px solid ${HAIR}` }}>
        <div className="mx-auto max-w-[1400px] px-5 md:px-10">
          <p className="text-[11px] uppercase tracking-[0.26em]" style={{ color: MUTED }}>
            Модельный ряд
          </p>
          <div className="mt-4 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <Display className="text-[38px] md:text-[76px]" style={{ color: INK }}>
              Проекты
            </Display>
            <p className="max-w-sm text-[15px] leading-[1.7] md:text-right" style={{ color: MUTED }}>
              Готовые дома с террасой под завоз мебели. Планировки меняются под задачу.
            </p>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-px md:mt-20" style={{ background: HAIR }}>
          {projects.map((p, i) => (
            <Card key={p.name} p={p} tall={i % 3 === 0} />
          ))}
        </div>
      </section>

      {/* Большие дома */}
      <section className="py-20 md:py-28" style={{ borderTop: `1px solid ${HAIR}` }}>
        <div className="mx-auto max-w-[1400px] px-5 md:px-10">
          <p className="text-[11px] uppercase tracking-[0.26em]" style={{ color: MUTED }}>
            Большая площадь
          </p>
          <Display className="mt-4 text-[38px] md:text-[76px]" style={{ color: INK }}>
            Шале и двухэтажные
          </Display>
        </div>
        <div className="mt-12 grid gap-px md:mt-20 md:grid-cols-2" style={{ background: HAIR }}>
          {bigProjects.map((p) => (
            <TileCard key={p.name} p={p} />
          ))}
        </div>
      </section>

      {/* Серия Старт */}
      <section id="start" className="py-20 md:py-28" style={{ borderTop: `1px solid ${HAIR}` }}>
        <div className="mx-auto max-w-[1400px] px-5 md:px-10">
          <p className="text-[11px] uppercase tracking-[0.26em]" style={{ color: MUTED }}>
            Серия «Старт»
          </p>
          <div className="mt-4 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <Display className="text-[38px] md:text-[76px]" style={{ color: INK }}>
              Компактные модули
            </Display>
            <p className="max-w-sm text-[15px] leading-[1.7] md:text-right" style={{ color: MUTED }}>
              Формат для дачи, аренды и глэмпинга — с той же заводской отделкой.
            </p>
          </div>
        </div>
        <div className="mt-12 grid gap-px md:mt-20 md:grid-cols-3" style={{ background: HAIR }}>
          {startSeries.map((p) => (
            <TileCard key={p.name} p={p} />
          ))}
        </div>
      </section>


      {/* Технология */}
      <Section id="tech" eyebrow="Технология" title="Из чего состоит дом">
        <div>
          {construction.map((c) => (
            <Row key={c.n} label={c.n} title={c.title} text={c.items.join(", ")} />
          ))}
        </div>
      </Section>

      {/* Преимущества */}
      <Section eyebrow="Преимущества" title="Почему IP Modul">
        <div>
          {advantages.map((a) => (
            <Row key={a.n} label={a.n} title={a.title} text={a.text} />
          ))}
        </div>
      </Section>

      {/* Опции */}
      <section className="px-5 py-20 md:px-10 md:py-28" style={{ borderTop: `1px solid ${HAIR}` }}>
        <div className="mx-auto grid max-w-[1400px] gap-10 md:grid-cols-2 md:items-start">
          <div>
            <p className="text-[11px] uppercase tracking-[0.26em]" style={{ color: MUTED }}>
              Опции
            </p>
            <Display className="mt-4 text-[38px] md:text-[76px]" style={{ color: INK }}>
              Дом собирается под себя
            </Display>
            <div className="mt-8">
              <Btn href={SITE}>Обсудить проект</Btn>
            </div>
          </div>
          <ul>
            {options.map((o) => (
              <li
                key={o}
                className="py-5 text-[16px] leading-[1.6] md:text-[18px]"
                style={{ borderTop: `1px solid ${HAIR}`, color: INK }}
              >
                {o}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Отзывы */}
      <Section id="reviews" eyebrow="Отзывы" title="Слово владельцам">
        <div className="grid gap-10 md:grid-cols-3 md:gap-12">
          {reviews.map((r) => (
            <blockquote key={r.name + r.text.slice(0, 12)} className="pt-6" style={{ borderTop: `1px solid ${HAIR}` }}>
              <p className="text-[15px] leading-[1.8]" style={{ color: MUTED }}>
                {r.text}
              </p>
              <footer
                className="mt-6 text-[13px] uppercase tracking-[0.14em]"
                style={{ color: INK, fontFamily: DISPLAY }}
              >
                {r.name}
              </footer>
            </blockquote>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section eyebrow="Вопросы" title="Частые вопросы">
        <div>
          {faq.map((f, i) => (
            <div key={f.q} style={{ borderTop: `1px solid ${HAIR}` }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="flex w-full items-center justify-between gap-8 py-7 text-left"
              >
                <Display as="h3" className="text-[18px] md:text-[26px]" style={{ color: INK }}>
                  {f.q}
                </Display>
                <span className="text-xl leading-none" style={{ color: MUTED }}>
                  {openFaq === i ? "–" : "+"}
                </span>
              </button>
              {openFaq === i && (
                <p className="max-w-2xl pb-8 text-[15px] leading-[1.75]" style={{ color: MUTED }}>
                  {f.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* Контакты */}
      <Section
        id="contacts"
        eyebrow="Контакты"
        title="Приезжайте на производство"
        subtitle="Покажем дома в сборке, материалы и отделку вживую."
      >
        <div className="grid gap-10 md:grid-cols-3">
          <div className="pt-6" style={{ borderTop: `1px solid ${HAIR}` }}>
            <p className="text-[11px] uppercase tracking-[0.22em]" style={{ color: MUTED }}>
              Телефон
            </p>
            <a href={PHONE_HREF} className="mt-4 block text-[24px]" style={{ color: INK, fontFamily: DISPLAY }}>
              {PHONE}
            </a>
            <div className="mt-3 flex flex-wrap gap-4 text-[14px]" style={{ color: MUTED }}>
              <a href={TELEGRAM} {...ext(TELEGRAM)} className="underline underline-offset-2">
                Telegram
              </a>
              <a href={WHATSAPP} {...ext(WHATSAPP)} className="underline underline-offset-2">
                WhatsApp
              </a>
              <a href={AVITO} {...ext(AVITO)} className="underline underline-offset-2">
                Авито
              </a>
            </div>
          </div>
          <div className="pt-6" style={{ borderTop: `1px solid ${HAIR}` }}>
            <p className="text-[11px] uppercase tracking-[0.22em]" style={{ color: MUTED }}>
              Производство
            </p>
            <p className="mt-4 text-[15px] leading-[1.7]" style={{ color: INK }}>
              {ADDRESS}
            </p>
          </div>
          <div className="pt-6" style={{ borderTop: `1px solid ${HAIR}` }}>
            <p className="text-[11px] uppercase tracking-[0.22em]" style={{ color: MUTED }}>
              Сайт
            </p>
            <p className="mt-4 text-[15px]" style={{ color: INK }}>
              ip-modul.ru
            </p>
            <div className="mt-7">
              <Btn href={SITE} ghost>
                Перейти на сайт
              </Btn>
            </div>
          </div>
        </div>
      </Section>

      <footer className="px-5 py-12 md:px-10" style={{ borderTop: `1px solid ${HAIR}` }}>
        <div className="mx-auto flex max-w-[1400px] flex-col gap-3 text-[13px]" style={{ color: MUTED }}>
          <span className="text-[17px] uppercase tracking-[0.12em]" style={{ color: INK, fontFamily: DISPLAY }}>
            IP Modul
          </span>
          <span>{ADDRESS}</span>
          <span>
            Информация о проектах и ценах взята с официального сайта производителя{" "}
            <a href={SITE} {...ext(SITE)} className="underline underline-offset-2">
              ip-modul.ru
            </a>
            .
          </span>
        </div>
      </footer>
    </div>
  );
};

export default IpModul;
