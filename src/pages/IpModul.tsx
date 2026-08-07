import { useState } from "react";
import Seo from "@/components/Seo";

/**
 * Лендинг производителя IP MODUL (ip-modul.ru).
 * Визуальная система — та же, что у страницы РУСМОДУЛЬ (референс rhodeskin.com):
 * тёплый кремовый фон, крупные фото, много воздуха, спокойная типографика,
 * тонкие линии вместо плашек. Акцент — тёплый древесный тон.
 * Контент, проекты, цены и отзывы взяты с ip-modul.ru без изменений.
 */

const PHONE = "+7 (812) 203 82 06";
const PHONE_HREF = "tel:+78122038206";
const TELEGRAM = "https://t.me/IPMODUL";
const WHATSAPP = "https://api.whatsapp.com/send/?phone=79934912461";
const AVITO =
  "https://www.avito.ru/brands/i192533124/all?src=sharing&sellerId=9fc38c2e8091cbeee2f2fb39a2fa647b";
const SITE = "https://ip-modul.ru/";
const ADDRESS = "Ленинградская область, Гатчинский район, д. Новый Свет, д. 118А";

/** Палитра: тёплый кремовый фон, графитовый текст, древесный акцент */
const CREAM = "hsl(38,32%,95%)";
const INK = "hsl(24,10%,14%)";
const MUTED = "hsl(24,8%,44%)";
const HAIR = "hsl(30,14%,86%)";
const BRAND = "hsl(30,38%,42%)";
const PLACEHOLDER = "hsl(30,14%,90%)";

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
    "https://optim.tildacdn.com/tild3664-3063-4532-b433-333438353463/-/format/webp/IMG_9684.jpeg.webp",
    "https://optim.tildacdn.com/tild3533-3733-4030-a666-333066626566/-/format/webp/WhatsApp_Image_2024-.jpeg.webp",
    "https://optim.tildacdn.com/tild6537-3566-4532-b164-393534356636/-/format/webp/photo.jpeg.webp",
    "https://optim.tildacdn.com/tild3662-3537-4130-a566-653830353334/-/format/webp/_11.jpg.webp",
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
  desc: string;
  specs: string[];
  href: string;
  image: string;
};

const projects: Project[] = [
  {
    name: "IP 40",
    price: "2 620 000 ₽",
    desc: "Готовый дом с террасой под завоз мебели. Возможны разные планировки.",
    specs: ["Габариты ВхШхД: 2,9 × 5 × 8 м", "Жилая площадь 26 м²", "Общая площадь (включая террасу) 40 м²", "Высота потолков 2 – 2,4 м"],
    href: "https://ip-modul.ru/ip40",
    image: IMG.g[0],
  },
  {
    name: "IP 48",
    price: "3 080 000 ₽",
    desc: "Готовый дом с террасой под завоз мебели. Возможны разные планировки.",
    specs: ["Габариты ВхШхД: 3,6 × 6 × 8 м", "Жилая площадь 31 м²", "Общая площадь (включая террасу) 48 м²", "Высота потолков 2 – 3,1 м"],
    href: "https://ip-modul.ru/ip48",
    image: IMG.g[1],
  },
  {
    name: "IP 60",
    price: "3 870 000 ₽",
    desc: "Готовый дом с террасой под завоз мебели. Возможны разные планировки.",
    specs: ["Габариты ВхШхД: 3,3 × 7,5 × 8 м", "Жилая площадь 40 м²", "Общая площадь (включая террасу) 60 м²", "Высота потолков 2 – 2,7 м"],
    href: "https://ip-modul.ru/ip60",
    image: IMG.g[2],
  },
  {
    name: "IP 64",
    price: "4 950 000 ₽",
    desc: "Готовый дом с террасой под завоз мебели. Возможны разные планировки.",
    specs: ["Габариты ВхШхД: 3,7 × 8 × 8 м", "Жилая площадь 43 м²", "Общая площадь (включая террасу) 64 м²", "Высота потолков 2 – 3,1 м"],
    href: "https://ip-modul.ru/ip64",
    image: IMG.g[3],
  },
  {
    name: "IP 72",
    price: "4 150 000 ₽",
    desc: "Готовый дом с террасой под завоз мебели. Возможны разные планировки.",
    specs: ["Габариты ВхШхД: 3,7 × 9 × 8 м", "Жилая площадь 49 м²", "Общая площадь (включая террасу) 72 м²", "Высота потолков 2 – 3,1 м"],
    href: "https://ip-modul.ru/ip72",
    image: IMG.g[4],
  },
  {
    name: "IP 82",
    price: "5 850 000 ₽",
    desc: "Готовый дом с террасой под завоз мебели. Возможны разные планировки.",
    specs: ["Габариты ВхШхД: 3,6 × 7,5 × 11 м", "Жилая площадь 60 м²", "Общая площадь (включая террасу) 82 м²", "Высота потолков 2 – 3 м"],
    href: "https://ip-modul.ru/ip82",
    image: IMG.g[5],
  },
  {
    name: "IP 88",
    price: "6 350 000 ₽",
    desc: "Готовый дом с террасой под завоз мебели. Возможны разные планировки.",
    specs: ["Габариты ВхШхД: 3,6 × 8 × 11 м", "Жилая площадь 64 м²", "Общая площадь (включая террасу) 88 м²", "Высота потолков 2 – 3 м"],
    href: "https://ip-modul.ru/ip88",
    image: IMG.g[6],
  },
  {
    name: "IP 99",
    price: "7 210 000 ₽",
    desc: "Готовый дом с террасой под завоз мебели. Возможны разные планировки.",
    specs: ["Габариты ВхШхД: 3,7 × 9 × 11 м", "Жилая площадь 74 м²", "Общая площадь (включая террасу) 99 м²", "Высота потолков 2 – 3,1 м"],
    href: "https://ip-modul.ru/ip99",
    image: IMG.g[7],
  },
  {
    name: "IP 60",
    price: "3 456 000 ₽",
    desc: "Готовый дом с террасой под завоз мебели. Возможны разные планировки.",
    specs: ["Габариты ВхШхД: 3,3 × 7,5 × 8 м", "Жилая площадь 40 м²", "Общая площадь (включая террасу) 60 м²", "Высота потолков 2 – 2,7 м"],
    href: "https://ip-modul.ru/#popup-stoimost",
    image: IMG.g[8],
  },
];

const moreProjects: Project[] = [
  {
    name: "Дом Шале",
    price: "6 120 000 ₽",
    desc: "Просторный дом с высокими потолками и двумя санузлами.",
    specs: ["Габариты ВхШхД: 5,5 × 10 × 12 м", "Внутренняя площадь 84 м²", "Общая площадь (включая террасу) 102 м²", "Высота потолков 2,4 – 4 м"],
    href: "https://ip-modul.ru/#popup-stoimost",
    image: IMG.g[9],
  },
  {
    name: "Двухэтажный дом",
    price: "8 550 000 ₽",
    desc: "Готовый дом с террасой под завоз мебели. Возможны разные планировки.",
    specs: ["Габариты ВхШхД: 3,7 × 9 × 11 м", "Жилая площадь 74 м²", "Общая площадь (включая террасу) 99 м²", "Высота потолков 2 – 3,1 м"],
    href: "https://ip-modul.ru/#popup-stoimost",
    image: IMG.g[10],
  },
  {
    name: "Классический дом",
    price: "7 400 000 ₽",
    desc: "Одноэтажный каркасный дом с высокими потолками и террасой.",
    specs: ["Габариты ВхШхД: 4,5 × 8,8 × 12 м", "Внутренняя площадь 78 м²", "Общая площадь (включая террасу) 102 м²", "Высота потолков 2,4 – 3,5 м"],
    href: "https://ip-modul.ru/#popup-stoimost",
    image: IMG.g[11],
  },
];

const startSeries: Project[] = [
  {
    name: "Старт 24",
    price: "1 300 000 ₽",
    desc: "Компактный модульный дом в полной комплектации.",
    specs: [],
    href: "https://ip-modul.ru/#popup-stoimost",
    image: IMG.start[0],
  },
  {
    name: "МБ-36",
    price: "1 950 000 ₽",
    desc: "Компактный модульный дом в полной комплектации.",
    specs: [],
    href: "https://ip-modul.ru/#popup-stoimost",
    image: IMG.start[1],
  },
  {
    name: "Старт 30",
    price: "1 625 000 ₽",
    desc: "Компактный модульный дом в полной комплектации.",
    specs: [],
    href: "https://ip-modul.ru/#popup-stoimost",
    image: IMG.start[2],
  },
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
    text: "Хочу сказать спасибо за дом. Цены растут, но мы успели внести предоплату заранее и зафиксировали цену на пол года. При заключении договора добавили всё, что хотели, прописали, что какого цвета будет. Сейчас сдаём дом в аренду, получаем только положительные отзывы от своих клиентов.",
  },
  {
    name: "Кристина",
    text: "Мы долго искали компанию для строительства нашего дома, но когда нашли эту, сразу же отправились в их офис, чтобы обсудить все детали. Уже на первой встрече мы были впечатлены профессионализмом и качеством работы. Все работы были выполнены безупречно и аккуратно.",
  },
  {
    name: "Мария",
    text: "Теперь у нас есть дом, это компания, которой можно доверить на все 100. После консультации приехал на экскурсию на производство, удалось увидеть своими глазами и потрогать своими руками. За 2,5 месяца уже готовый дом стоял у нас на участке.",
  },
  {
    name: "Дарья",
    text: "Выражаем огромную благодарность Ивану за его работу! Теперь у нас есть прекрасный загородный каркасный домик «под ключ». Иван всегда был на связи, помогал с проектом, подсказывал и отвечал на все наши вопросы. Все материалы в доме очень качественные.",
  },
  {
    name: "Анастасия",
    text: "Благодарю за подход: учли пожелания, подобрали дизайн, меняли в ходе сборки дома на производстве планировку. Работой и отзывчивостью мы остались максимально довольны! Если нам обещают сделать — значит сделают!",
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

const Btn = ({ href, children, ghost }: { href: string; children: React.ReactNode; ghost?: boolean }) => (
  <a
    href={href}
    {...ext(href)}
    className="inline-flex items-center justify-center px-8 py-3.5 text-[13px] tracking-[0.02em] transition-colors duration-300"
    style={ghost ? { border: `1px solid ${INK}`, color: INK } : { background: INK, color: CREAM }}
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
  divider = true,
}: {
  id?: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  divider?: boolean;
}) => (
  <section
    id={id}
    className="px-5 py-20 md:px-12 md:py-32"
    style={divider ? { borderTop: `1px solid ${HAIR}` } : undefined}
  >
    <div className="mx-auto max-w-[1240px]">
      {(eyebrow || title) && (
        <div className="max-w-3xl">
          {eyebrow && (
            <p className="text-[11px] uppercase tracking-[0.24em]" style={{ color: MUTED }}>
              {eyebrow}
            </p>
          )}
          {title && (
            <h2
              className="mt-5 text-[30px] font-normal leading-[1.1] tracking-[-0.02em] md:text-[52px]"
              style={{ color: INK }}
            >
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="mt-5 max-w-xl text-[15px] leading-[1.7] md:text-[17px]" style={{ color: MUTED }}>
              {subtitle}
            </p>
          )}
        </div>
      )}
      <div className={eyebrow || title ? "mt-14 md:mt-20" : ""}>{children}</div>
    </div>
  </section>
);

/** Карточка проекта — крупное фото и тихая подпись, без рамок */
const Card = ({ p, tall }: { p: Project; tall?: boolean }) => (
  <a href={p.href} {...ext(p.href)} className="group block">
    <div className={`${tall ? "aspect-[4/5]" : "aspect-[5/4]"} overflow-hidden`} style={{ background: PLACEHOLDER }}>
      <img
        src={p.image}
        alt={`Модульный дом ${p.name} — IP MODUL`}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]"
      />
    </div>
    <div className="flex items-baseline justify-between gap-6 pt-6">
      <h3 className="text-[19px] font-normal tracking-[-0.01em] md:text-[22px]" style={{ color: INK }}>
        {p.name}
      </h3>
      <span className="shrink-0 text-[14px]" style={{ color: MUTED }}>
        от {p.price}
      </span>
    </div>
    {p.specs.length > 0 && (
      <p className="mt-3 text-[14px] leading-[1.7]" style={{ color: MUTED }}>
        {p.specs.slice(1, 3).join(" · ")}
      </p>
    )}
  </a>
);

const Row = ({ label, title, text }: { label?: string; title: string; text: string }) => (
  <div
    className="grid gap-4 py-8 md:grid-cols-[80px_1fr_1.4fr] md:items-baseline md:gap-10 md:py-10"
    style={{ borderTop: `1px solid ${HAIR}` }}
  >
    <span className="text-[12px] tracking-[0.2em]" style={{ color: BRAND }}>
      {label}
    </span>
    <h3 className="text-[20px] font-normal leading-tight tracking-[-0.01em] md:text-[24px]" style={{ color: INK }}>
      {title}
    </h3>
    <p className="text-[15px] leading-[1.75]" style={{ color: MUTED }}>
      {text}
    </p>
  </div>
);

const IpModul = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen font-sans antialiased" style={{ background: CREAM, color: INK }}>
      <Seo
        title="IP MODUL — модульные дома под ключ в Ленобласти"
        description="Модульные дома IP MODUL от 1 300 000 ₽: заводская сборка с чистовой отделкой, терраса, готовность за 2,5 месяца. Производство в Гатчинском районе."
        canonicalPath="/ip-modul"
        jsonLd={jsonLd}
      />

      {/* Шапка */}
      <header
        className="sticky top-0 z-40 backdrop-blur"
        style={{ background: "hsla(38,32%,95%,0.9)", borderBottom: `1px solid ${HAIR}` }}
      >
        <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between px-5 md:px-12">
          <a href="#top" className="text-[15px] tracking-[0.22em]" style={{ color: INK }}>
            IP MODUL
          </a>
          <nav className="hidden items-center gap-9 text-[13px] lg:flex" style={{ color: MUTED }}>
            <a href="#projects" className="transition-colors hover:text-[hsl(24,10%,14%)]">Проекты</a>
            <a href="#start" className="transition-colors hover:text-[hsl(24,10%,14%)]">Серия «Старт»</a>
            <a href="#tech" className="transition-colors hover:text-[hsl(24,10%,14%)]">Технология</a>
            <a href="#gallery" className="transition-colors hover:text-[hsl(24,10%,14%)]">Галерея</a>
            <a href="#reviews" className="transition-colors hover:text-[hsl(24,10%,14%)]">Отзывы</a>
            <a href="#contacts" className="transition-colors hover:text-[hsl(24,10%,14%)]">Контакты</a>
          </nav>
          <a href={PHONE_HREF} className="text-[13px]" style={{ color: INK }}>
            {PHONE}
          </a>
        </div>
      </header>

      {/* Герой — фото во всю ширину экрана, текст поверх */}
      <section id="top" className="relative h-[calc(100svh-4rem)] min-h-[520px] w-full overflow-hidden">
        <img
          src={IMG.g[0]}
          alt="Модульный дом IP MODUL с террасой"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/65 via-black/25 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 px-5 pb-12 md:px-12 md:pb-16">
          <div className="mx-auto max-w-[1240px]">
            <h1 className="max-w-3xl text-[34px] font-normal leading-[1.06] tracking-[-0.03em] text-white md:text-[68px]">
              Модульные дома с террасой под завоз мебели
            </h1>
            <div className="mt-7 flex flex-col gap-7 md:mt-10 md:flex-row md:items-end md:justify-between">
              <p className="max-w-md text-[15px] leading-[1.7] text-white/75 md:text-[17px]">
                Собираем дом на производстве в Гатчинском районе и привозим готовым на участок.
                Полный цикл — около 2,5 месяцев.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={SITE}
                  {...ext(SITE)}
                  className="inline-flex items-center justify-center px-8 py-3.5 text-[13px] transition-opacity duration-300 hover:opacity-90"
                  style={{ background: CREAM, color: INK }}
                >
                  Оставить заявку
                </a>
                <a
                  href="#projects"
                  className="inline-flex items-center justify-center border border-white/70 px-8 py-3.5 text-[13px] text-white transition-colors duration-300 hover:bg-white hover:text-[hsl(24,10%,14%)]"
                >
                  Смотреть проекты
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Цифры */}
      <section className="px-5 py-14 md:px-12 md:py-20">
        <dl className="mx-auto grid max-w-[1240px] grid-cols-1 gap-10 sm:grid-cols-3">
          {[
            { v: "2,5 месяца", l: "от договора до готового дома" },
            { v: "от 1,3 млн ₽", l: "цена дома в комплектации" },
            { v: "26–84 м²", l: "жилая площадь моделей" },
          ].map((s) => (
            <div key={s.l}>
              <dt className="text-[30px] font-normal tracking-[-0.02em] md:text-[42px]" style={{ color: INK }}>
                {s.v}
              </dt>
              <dd className="mt-2 text-[13px]" style={{ color: MUTED }}>
                {s.l}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Проекты */}
      <Section
        id="projects"
        eyebrow="Модельный ряд"
        title="Модульные дома IP MODUL"
        subtitle="Готовые дома с террасой под завоз мебели. Возможны разные планировки."
      >
        <div className="grid gap-x-8 gap-y-20 md:grid-cols-2 md:gap-x-14 md:gap-y-28">
          {projects.map((p, i) => (
            <Card key={`${p.name}-${p.price}`} p={p} tall={i % 3 === 0} />
          ))}
        </div>
      </Section>

      {/* Большие дома */}
      <Section
        eyebrow="Большие дома"
        title="Шале, двухэтажные и классические"
        subtitle="Проекты с увеличенной площадью, высокими потолками и двумя санузлами."
      >
        <div className="grid gap-x-8 gap-y-20 md:grid-cols-2 md:gap-x-14 md:gap-y-28">
          {moreProjects.map((p, i) => (
            <Card key={p.name} p={p} tall={i === 0} />
          ))}
        </div>
      </Section>

      {/* Серия Старт */}
      <Section
        id="start"
        eyebrow="Серия «Старт»"
        title="Компактные дома в полной комплектации"
        subtitle="Небольшой формат для дачи, аренды и глэмпинга — с той же заводской отделкой."
      >
        <div className="grid gap-x-8 gap-y-16 md:grid-cols-3 md:gap-x-10">
          {startSeries.map((p) => (
            <Card key={p.name} p={p} />
          ))}
        </div>
      </Section>

      {/* Технология */}
      <Section id="tech" eyebrow="Технология" title="Из чего состоит дом">
        <div>
          {construction.map((c) => (
            <Row key={c.n} label={c.n} title={c.title} text={c.items.join(", ")} />
          ))}
        </div>
      </Section>

      {/* Преимущества */}
      <Section eyebrow="Преимущества" title="Почему IP MODUL">
        <div>
          {advantages.map((a) => (
            <Row key={a.n} label={a.n} title={a.title} text={a.text} />
          ))}
        </div>
      </Section>

      {/* Опции */}
      <section className="px-5 py-20 md:px-12 md:py-28" style={{ borderTop: `1px solid ${HAIR}` }}>
        <div className="mx-auto grid max-w-[1240px] gap-10 md:grid-cols-2 md:items-start">
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em]" style={{ color: BRAND }}>
              Опции
            </p>
            <h2
              className="mt-5 text-[30px] font-normal leading-[1.1] tracking-[-0.02em] md:text-[52px]"
              style={{ color: INK }}
            >
              Дом можно собрать под себя
            </h2>
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

      {/* Галерея */}
      <Section id="gallery" eyebrow="Галерея" title="Дома и производство">
        <div className="space-y-8 md:space-y-14">
          <div className="aspect-[16/9] overflow-hidden" style={{ background: PLACEHOLDER }}>
            <img
              src={IMG.g[12]}
              alt="Модульный дом IP MODUL на участке"
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out hover:scale-[1.04]"
            />
          </div>
          <div className="grid grid-cols-2 gap-8 md:gap-14">
            {IMG.g.slice(13).concat(IMG.g.slice(4, 9)).map((src, i) => (
              <div
                key={src + i}
                className={`${i % 3 === 0 ? "aspect-[4/5]" : "aspect-[5/4]"} overflow-hidden`}
                style={{ background: PLACEHOLDER }}
              >
                <img
                  src={src}
                  alt={`Дом IP MODUL №${i + 2}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out hover:scale-[1.04]"
                />
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Отзывы */}
      <Section id="reviews" eyebrow="Отзывы" title="Что говорят владельцы">
        <div className="grid gap-12 md:grid-cols-3 md:gap-14">
          {reviews.map((r) => (
            <blockquote key={r.name + r.text.slice(0, 12)} className="pt-6" style={{ borderTop: `1px solid ${HAIR}` }}>
              <p className="text-[15px] leading-[1.8]" style={{ color: MUTED }}>
                {r.text}
              </p>
              <footer className="mt-6 text-[13px]" style={{ color: INK }}>
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
                <span className="text-[17px] font-normal tracking-[-0.01em] md:text-[20px]" style={{ color: INK }}>
                  {f.q}
                </span>
                <span className="text-xl leading-none" style={{ color: BRAND }}>
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
        subtitle="Покажем дома в сборке, материалы и отделку вживую — и подберём планировку под ваш участок."
      >
        <div className="grid gap-10 md:grid-cols-3">
          <div className="pt-6" style={{ borderTop: `1px solid ${HAIR}` }}>
            <p className="text-[12px] uppercase tracking-[0.2em]" style={{ color: MUTED }}>
              Телефон
            </p>
            <a href={PHONE_HREF} className="mt-4 block text-[22px] font-normal tracking-[-0.01em]" style={{ color: INK }}>
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
            <p className="text-[12px] uppercase tracking-[0.2em]" style={{ color: MUTED }}>
              Производство
            </p>
            <p className="mt-4 text-[15px] leading-[1.7]" style={{ color: INK }}>
              {ADDRESS}
            </p>
          </div>
          <div className="pt-6" style={{ borderTop: `1px solid ${HAIR}` }}>
            <p className="text-[12px] uppercase tracking-[0.2em]" style={{ color: MUTED }}>
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

      <footer className="px-5 py-14 md:px-12" style={{ borderTop: `1px solid ${HAIR}` }}>
        <div className="mx-auto flex max-w-[1240px] flex-col gap-3 text-[13px]" style={{ color: MUTED }}>
          <span className="text-[15px] tracking-[0.22em]" style={{ color: INK }}>
            IP MODUL
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
