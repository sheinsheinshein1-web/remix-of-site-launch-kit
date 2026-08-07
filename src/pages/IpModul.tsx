import { useState } from "react";
import { Phone, MapPin, Send } from "lucide-react";
import Seo from "@/components/Seo";

/**
 * Лендинг производителя IP MODUL (ip-modul.ru).
 * Дизайн-референс: woodart.ru — тёмная лесная палитра + песочный акцент.
 * Контент, проекты, цены и отзывы взяты с ip-modul.ru без изменений.
 */

const PHONE = "+7 (812) 203 82 06";
const PHONE_HREF = "tel:+78122038206";
const TELEGRAM = "https://t.me/IPMODUL";
const WHATSAPP = "https://api.whatsapp.com/send/?phone=79934912461";
const AVITO =
  "https://www.avito.ru/brands/i192533124/all?src=sharing&sellerId=9fc38c2e8091cbeee2f2fb39a2fa647b";
const ADDRESS = "Ленинградская область, Гатчинский район, д. Новый Свет, д. 118А";

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

const startSeries = [
  { name: "Старт 24", price: "1 300 000 ₽", desc: "Компактный модульный дом в полной комплектации.", image: IMG.start[0] },
  { name: "МБ-36", price: "1 950 000 ₽", desc: "Компактный модульный дом в полной комплектации.", image: IMG.start[1] },
  { name: "Старт 30", price: "1 625 000 ₽", desc: "Компактный модульный дом в полной комплектации.", image: IMG.start[2] },
];

const advantages = [
  { n: "01", text: "Уникальные планировки дома, которые будут отражать вашу индивидуальность!" },
  { n: "02", text: "Быстрая и качественная реализация ваших проектов." },
  { n: "03", text: "Индивидуальный подход к каждому клиенту: мы учитываем все ваши пожелания и требования." },
  { n: "04", text: "Профессиональная команда строителей и дизайнеров: качество, которому можно доверять." },
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
    text: "Хочу сказать спасибо за дом. Цены растут, но мы успели внести предоплату заранее и зафиксировали цену на пол года. При заключении договора добавили всё, что хотели, прописали, что какого цвета будет. По работе проблем не было, все мелочи решались в рабочем порядке. Сейчас сдаём дом в аренду, получаем только положительные отзывы от своих клиентов. К сотрудничеству рекомендуем!",
  },
  {
    name: "Кристина",
    text: "Мы хотим выразить огромную благодарность, потому что мы скоро сможем въехать в наш новый дом. Мы долго искали компанию для строительства нашего дома, но когда нашли эту, мы сразу же отправились в их офис, чтобы обсудить все детали. Уже на первой встрече мы были впечатлены профессионализмом и качеством работы. Все работы были выполнены безупречно и аккуратно.",
  },
  {
    name: "Мария",
    text: "Теперь у нас есть дом, это компания, которой можно доверить на все 100. Очень клиентоориентированны, после консультации приехал на экскурсию на производство, удалось увидеть своими глазами и потрогать своими руками. Алексей и Иван сопровождали весь цикл строительства, за 2,5 месяца уже готовый дом стоял у нас на участке. Рекомендую данную компанию!",
  },
  {
    name: "Дарья",
    text: "Выражаем огромную благодарность Ивану за его работу! Теперь у нас есть прекрасный загородный каркасный домик «под ключ». Повезло на просторах Авито найти таких мастеров. При выборе компании и до заключения договора Иван всегда был на связи, помогал с проектом, подсказывал и отвечал на все наши вопросы. Все материалы в доме очень качественные, со вкусом, наши пожелания всегда учитывались.",
  },
  {
    name: "Анастасия",
    text: "Благодарю за подход: учли пожелания, подобрали дизайн, меняли в ходе сборки дома на производстве планировку. Работой и отзывчивостью мы остались максимально довольны! Доставка дома тоже была вопросом со звёздочкой, который Иван и его команда решили. Если нам обещают сделать — значит сделают!",
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
  description: "Модульные дома и бани под ключ от 1,6 млн рублей с гарантией 10 лет.",
};

const INK = "text-[hsl(0,0%,96%)]";
const DIM = "text-[hsl(0,0%,64%)]";
const LINE = "border-[hsl(0,0%,18%)]";

const Btn = ({ href, children, ghost }: { href: string; children: React.ReactNode; ghost?: boolean }) => (
  <a
    href={href}
    target={href.startsWith("http") ? "_blank" : undefined}
    rel={href.startsWith("http") ? "noopener noreferrer nofollow" : undefined}
    className={
      ghost
        ? "inline-flex items-center justify-center border border-[hsl(0,0%,40%)] px-10 py-4 text-[13px] font-semibold uppercase tracking-[0.14em] text-[hsl(0,0%,96%)] transition-colors hover:bg-[hsl(0,0%,96%)] hover:text-[hsl(0,0%,7%)]"
        : "inline-flex items-center justify-center bg-[hsl(35,34%,78%)] px-10 py-4 text-[13px] font-semibold uppercase tracking-[0.14em] text-[hsl(0,0%,8%)] transition-colors hover:bg-[hsl(35,44%,86%)]"
    }
  >
    {children}
  </a>
);

const ProjectCard = ({ p }: { p: Project }) => (
  <article className="group bg-[hsl(0,0%,10%)]">
    <div className="aspect-[4/3] overflow-hidden">
      <img
        src={p.image}
        alt={`Модульный дом ${p.name} от IP MODUL`}
        loading="lazy"
        className="h-full w-full object-cover brightness-[1.08] transition-transform duration-700 group-hover:scale-[1.04]"
      />
    </div>
    <div className="p-6">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className={`text-xl font-bold uppercase tracking-[0.08em] ${INK}`}>{p.name}</h3>
        <span className="text-[15px] font-semibold text-[hsl(35,34%,78%)]">{p.price}</span>
      </div>
      <p className={`mt-3 text-[13px] leading-relaxed ${DIM}`}>{p.desc}</p>
      <dl className={`mt-5 divide-y divide-[hsl(0,0%,18%)] border-t ${LINE}`}>
        {p.specs.map((s) => (
          <div key={s} className="py-2 text-[13px] text-[hsl(0,0%,78%)]">
            {s}
          </div>
        ))}
      </dl>
      <a
        href={p.href}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="mt-5 inline-block text-[12px] font-semibold uppercase tracking-[0.14em] text-[hsl(35,34%,78%)] transition-opacity hover:opacity-70"
      >
        Подробнее
      </a>
    </div>
  </article>
);

const Section = ({
  eyebrow,
  title,
  subtitle,
  children,
  id,
  tone,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  id?: string;
  tone?: "dark";
}) => (
  <section id={id} className={tone === "dark" ? "bg-[hsl(0,0%,10%)]" : ""}>
    <div className="mx-auto max-w-[1360px] px-4 py-16 md:px-10 md:py-24">
      {eyebrow && (
        <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[hsl(35,34%,78%)]">{eyebrow}</div>
      )}
      <h2 className={`mt-4 max-w-4xl text-[28px] font-bold uppercase leading-[1.1] tracking-[0.02em] md:text-[44px] ${INK}`}>
        {title}
      </h2>
      {subtitle && <p className={`mt-4 max-w-2xl text-sm leading-relaxed md:text-base ${DIM}`}>{subtitle}</p>}
      <div className="mt-12">{children}</div>
    </div>
  </section>
);

const IpModul = () => {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="min-h-screen bg-[hsl(0,0%,7%)] font-sans antialiased">
      <Seo
        title="IP MODUL — модульные дома и бани под ключ"
        description="Модульные дома и бани под ключ от 1,6 млн ₽ с гарантией 10 лет. Производство в Ленинградской области, доставка и монтаж."
        canonicalPath="/ip-modul"
        jsonLd={jsonLd}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[hsl(0,0%,7%)]">
        <div className={`mx-auto flex max-w-[1360px] items-center justify-between gap-4 border-b ${LINE} px-4 py-5 md:px-10`}>
          <a href="#top" className={`text-2xl font-bold uppercase tracking-[0.12em] ${INK}`}>
            IP MODUL
          </a>
          <div className="text-right">
            <a href={PHONE_HREF} className={`block text-[15px] font-semibold ${INK}`}>
              {PHONE}
            </a>
            <span className={`text-xs ${DIM}`}>Ленинградская область</span>
          </div>
        </div>
        <nav className={`mx-auto hidden max-w-[1360px] items-center gap-8 border-b ${LINE} px-4 py-3.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-[hsl(0,0%,72%)] md:flex md:px-10`}>
          <a href="#projects" className="hover:text-[hsl(0,0%,96%)]">Модельный ряд</a>
          <a href="#start" className="hover:text-[hsl(0,0%,96%)]">Серия СТАРТ</a>
          <a href="#tech" className="hover:text-[hsl(0,0%,96%)]">Технология</a>
          <a href="#gallery" className="hover:text-[hsl(0,0%,96%)]">Галерея</a>
          <a href="#reviews" className="hover:text-[hsl(0,0%,96%)]">Отзывы</a>
          <a href="#contacts" className="hover:text-[hsl(0,0%,96%)]">Контакты</a>
        </nav>
      </header>

      {/* Hero — full-bleed фото с наложенным текстом */}
      <section id="top" className="relative min-h-[560px] md:min-h-[760px]">
        <img
          src={IMG.g[1]}
          alt="Модульный дом IP MODUL с террасой"
          className="absolute inset-0 h-full w-full object-cover brightness-[0.95]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
        <div className="relative mx-auto flex min-h-[560px] max-w-[1360px] flex-col justify-center px-4 py-20 md:min-h-[760px] md:px-10">
          <h1 className={`text-[38px] font-bold uppercase leading-[0.98] tracking-[0.02em] md:text-[76px] ${INK}`}>
            IP MODUL
          </h1>
          <p className={`mt-2 max-w-2xl text-[18px] font-bold uppercase leading-tight tracking-[0.02em] md:text-[32px] ${INK}`}>
            Модульные дома и бани под ключ
          </p>
          <div className="mt-8 space-y-1 text-sm text-[hsl(0,0%,82%)] md:text-[15px]">
            <p>Модульно-каркасная технология, гарантия 10 лет</p>
            <p>Производство в Ленинградской области</p>
            <p>Доставка и монтаж по России — от 1,6 млн ₽</p>
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <Btn href="#projects">Модельный ряд</Btn>
            <Btn href={WHATSAPP} ghost>
              Рассчитать стоимость
            </Btn>
          </div>
        </div>
      </section>

      {/* Ключевые цифры */}
      <div className={`border-b ${LINE} bg-[hsl(0,0%,10%)]`}>
        <dl className="mx-auto grid max-w-[1360px] grid-cols-3 divide-x divide-[hsl(0,0%,18%)] px-4 md:px-10">
          {[
            { v: "10 лет", l: "гарантия" },
            { v: "30 дней", l: "срок производства" },
            { v: "100+", l: "готовых объектов" },
          ].map((s) => (
            <div key={s.l} className="px-4 py-8 first:pl-0 md:py-10">
              <dt className={`text-xl font-bold uppercase tracking-[0.04em] md:text-3xl ${INK}`}>{s.v}</dt>
              <dd className={`mt-2 text-[11px] uppercase tracking-[0.16em] ${DIM}`}>{s.l}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Advantages */}
      <Section eyebrow="Почему IP MODUL" title="Что вы получаете">
        <div className="grid gap-px bg-[hsl(0,0%,18%)] sm:grid-cols-2 lg:grid-cols-4">
          {advantages.map((a) => (
            <div key={a.n} className="bg-[hsl(0,0%,7%)] p-7">
              <span className="text-[11px] font-semibold tracking-[0.2em] text-[hsl(35,34%,78%)]">{a.n}</span>
              <p className="mt-4 text-sm leading-relaxed text-[hsl(0,0%,84%)]">{a.text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Projects */}
      <Section
        id="projects"
        tone="dark"
        eyebrow="Модельный ряд"
        title="Наши проекты"
        subtitle="Готовые модульные дома с террасой под завоз мебели. Возможны разные планировки."
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <ProjectCard key={`${p.name}-${i}`} p={p} />
          ))}
          {showMore && moreProjects.map((p, i) => <ProjectCard key={`more-${i}`} p={p} />)}
        </div>
        {!showMore && (
          <div className="mt-10">
            <button
              onClick={() => setShowMore(true)}
              className="inline-flex items-center justify-center border border-[hsl(0,0%,40%)] px-10 py-4 text-[13px] font-semibold uppercase tracking-[0.14em] text-[hsl(0,0%,96%)] transition-colors hover:bg-[hsl(0,0%,96%)] hover:text-[hsl(0,0%,7%)]"
            >
              Показать ещё
            </button>
          </div>
        )}
      </Section>

      {/* Start series */}
      <Section id="start" eyebrow="Серия СТАРТ" title="Дома серии СТАРТ" subtitle="Компактные модульные дома в полной комплектации.">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {startSeries.map((s) => (
            <article key={s.name} className="bg-[hsl(0,0%,10%)]">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={s.image} alt={`Модульный дом ${s.name}`} loading="lazy" className="h-full w-full object-cover brightness-[1.06]" />
              </div>
              <div className="p-6">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className={`text-xl font-bold uppercase tracking-[0.08em] ${INK}`}>{s.name}</h3>
                  <span className="text-[15px] font-semibold text-[hsl(35,34%,78%)]">{s.price}</span>
                </div>
                <p className={`mt-3 text-[13px] leading-relaxed ${DIM}`}>{s.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* Construction */}
      <Section id="tech" tone="dark" eyebrow="Технология" title="Из чего состоит модульный дом" subtitle="Полный пирог конструкции — как на производстве.">
        <div className="grid gap-px bg-[hsl(0,0%,18%)] md:grid-cols-2">
          {construction.map((c) => (
            <div key={c.n} className="bg-[hsl(0,0%,10%)] p-7">
              <div className="flex items-baseline gap-3">
                <span className="text-[11px] font-semibold tracking-[0.2em] text-[hsl(35,34%,78%)]">{c.n}</span>
                <h3 className={`text-base font-bold uppercase tracking-[0.08em] ${INK}`}>{c.title}</h3>
              </div>
              <ul className="mt-4 space-y-1.5">
                {c.items.map((i) => (
                  <li key={i} className="text-[13px] leading-relaxed text-[hsl(0,0%,74%)]">
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-8 text-sm text-[hsl(0,0%,78%)]">
          В базовой комплектации: готовая крытая терраса и лестницы на террасу.
        </p>
      </Section>

      {/* Gallery — плотная сетка без скруглений */}
      <Section id="gallery" eyebrow="Портфолио" title="Галерея наших объектов">
        <div className="grid grid-cols-2 gap-px bg-[hsl(0,0%,18%)] md:grid-cols-4">
          {IMG.g.map((src, i) => (
            <div key={src + i} className="aspect-square overflow-hidden bg-[hsl(0,0%,12%)]">
              <img
                src={src}
                alt={`Готовый объект IP MODUL №${i + 1}`}
                loading="lazy"
                className="h-full w-full object-cover brightness-[1.06] transition-transform duration-700 hover:scale-[1.05]"
              />
            </div>
          ))}
        </div>
      </Section>

      {/* Options */}
      <Section tone="dark" eyebrow="Опции" title="Дополнительные опции">
        <ul className="grid gap-px bg-[hsl(0,0%,18%)] sm:grid-cols-2 lg:grid-cols-3">
          {options.map((o) => (
            <li key={o} className="bg-[hsl(0,0%,10%)] px-6 py-5 text-sm text-[hsl(0,0%,84%)]">
              {o}
            </li>
          ))}
        </ul>
      </Section>

      {/* Reviews */}
      <Section id="reviews" eyebrow="Отзывы" title="О нас говорят клиенты" subtitle="Рейтинг 5,0 по отзывам покупателей.">
        <div className="grid gap-px bg-[hsl(0,0%,18%)] md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r) => (
            <blockquote key={r.name} className="bg-[hsl(0,0%,7%)] p-7">
              <p className="text-[13px] leading-relaxed text-[hsl(0,0%,76%)]">{r.text}</p>
              <footer className={`mt-5 text-[12px] font-semibold uppercase tracking-[0.14em] ${INK}`}>{r.name}</footer>
            </blockquote>
          ))}
        </div>
        <div className="mt-10">
          <Btn href={AVITO} ghost>
            Все отзывы
          </Btn>
        </div>
      </Section>

      {/* Contacts */}
      <Section id="contacts" tone="dark" eyebrow="Контакты" title="Свяжитесь с нами" subtitle="Пришлём каталог с актуальными ценами — для домов, глэмпингов и баз отдыха.">
        <div className="grid gap-px bg-[hsl(0,0%,18%)] md:grid-cols-3">
          <a href={PHONE_HREF} className="bg-[hsl(0,0%,10%)] p-7">
            <span className={`flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] ${DIM}`}>
              <Phone className="h-3.5 w-3.5" /> Телефон
            </span>
            <span className={`mt-3 block text-xl font-bold ${INK}`}>{PHONE}</span>
          </a>
          <div className="bg-[hsl(0,0%,10%)] p-7">
            <span className={`flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] ${DIM}`}>
              <MapPin className="h-3.5 w-3.5" /> Адрес
            </span>
            <span className="mt-3 block text-sm leading-relaxed text-[hsl(0,0%,88%)]">{ADDRESS}</span>
          </div>
          <div className="bg-[hsl(0,0%,10%)] p-7">
            <span className={`text-[11px] uppercase tracking-[0.2em] ${DIM}`}>Мессенджеры</span>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href={TELEGRAM}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="inline-flex items-center gap-2 border border-[hsl(0,0%,32%)] px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-[hsl(0,0%,96%)] transition-colors hover:bg-[hsl(0,0%,96%)] hover:text-[hsl(0,0%,8%)]"
              >
                <Send className="h-3.5 w-3.5" /> Telegram
              </a>
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="inline-flex items-center gap-2 border border-[hsl(0,0%,32%)] px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-[hsl(0,0%,96%)] transition-colors hover:bg-[hsl(0,0%,96%)] hover:text-[hsl(0,0%,8%)]"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </Section>

      <footer className={`border-t ${LINE} px-4 py-12 md:px-10`}>
        <div className={`mx-auto flex max-w-[1360px] flex-col gap-2 text-xs ${DIM}`}>
          <span className={`text-lg font-bold uppercase tracking-[0.12em] ${INK}`}>IP MODUL</span>
          <span>ИНН 470607991608</span>
          <span>{ADDRESS}</span>
          <span>
            Информация о проектах и ценах взята с официального сайта производителя{" "}
            <a
              href="https://ip-modul.ru/"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="underline underline-offset-2 hover:text-[hsl(0,0%,96%)]"
            >
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

