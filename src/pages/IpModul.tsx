import { useState } from "react";
import { ArrowRight, Check, Phone, MapPin, Send } from "lucide-react";
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

const Sand = "text-[hsl(35,32%,82%)]";

const ProjectCard = ({ p }: { p: Project }) => (
  <article className="group overflow-hidden rounded-2xl bg-[hsl(150,10%,13%)] border border-[hsl(150,8%,22%)]">
    <div className="aspect-[4/3] overflow-hidden bg-[hsl(150,8%,18%)]">
      <img
        src={p.image}
        alt={`Модульный дом ${p.name} от IP MODUL`}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
      />
    </div>
    <div className="p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-lg font-semibold text-[hsl(40,30%,94%)]">{p.name}</h3>
        <span className={`text-base font-semibold ${Sand}`}>{p.price}</span>
      </div>
      <p className="mt-2 text-[13px] leading-relaxed text-[hsl(40,10%,70%)]">{p.desc}</p>
      <ul className="mt-4 space-y-1.5">
        {p.specs.map((s) => (
          <li key={s} className="flex gap-2 text-[13px] text-[hsl(40,12%,78%)]">
            <Check className="mt-[3px] h-3.5 w-3.5 shrink-0 text-[hsl(35,32%,72%)]" strokeWidth={2} />
            {s}
          </li>
        ))}
      </ul>
      <a
        href={p.href}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[hsl(35,32%,82%)] px-4 py-2 text-[13px] font-semibold text-[hsl(150,14%,10%)] transition-colors hover:bg-[hsl(35,40%,88%)]"
      >
        Подробнее <ArrowRight className="h-4 w-4" />
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
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  id?: string;
}) => (
  <section id={id} className="mx-auto max-w-[1240px] px-4 py-16 md:px-8 md:py-24">
    {eyebrow && <div className={`text-xs uppercase tracking-[0.18em] ${Sand}`}>{eyebrow}</div>}
    <h2 className="mt-3 max-w-3xl text-3xl font-bold leading-tight text-[hsl(40,30%,94%)] md:text-[42px]">{title}</h2>
    {subtitle && <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[hsl(40,10%,70%)] md:text-base">{subtitle}</p>}
    <div className="mt-10">{children}</div>
  </section>
);

const IpModul = () => {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="min-h-screen bg-[hsl(150,14%,9%)] font-sans antialiased">
      <Seo
        title="IP MODUL — модульные дома и бани под ключ"
        description="Модульные дома и бани под ключ от 1,6 млн ₽ с гарантией 10 лет. Производство в Ленинградской области, доставка и монтаж."
        canonicalPath="/ip-modul"
        jsonLd={jsonLd}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[hsl(150,8%,18%)] bg-[hsl(150,14%,9%)]/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between gap-4 px-4 md:px-8">
          <a href="#top" className="text-base font-bold tracking-[0.14em] text-[hsl(40,30%,94%)]">
            IP MODUL
          </a>
          <nav className="hidden items-center gap-7 text-sm text-[hsl(40,12%,78%)] md:flex">
            <a href="#projects" className="hover:text-[hsl(40,30%,94%)]">Наши проекты</a>
            <a href="#start" className="hover:text-[hsl(40,30%,94%)]">Серия СТАРТ</a>
            <a href="#gallery" className="hover:text-[hsl(40,30%,94%)]">Галерея</a>
            <a href="#reviews" className="hover:text-[hsl(40,30%,94%)]">Отзывы</a>
            <a href="#contacts" className="hover:text-[hsl(40,30%,94%)]">Контакты</a>
          </nav>
          <div className="flex items-center gap-3">
            <a href={PHONE_HREF} className="hidden text-sm font-semibold text-[hsl(40,30%,94%)] sm:block">
              {PHONE}
            </a>
            <a
              href={TELEGRAM}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="rounded-xl bg-[hsl(35,32%,82%)] px-4 py-2 text-[13px] font-semibold text-[hsl(150,14%,10%)] transition-colors hover:bg-[hsl(35,40%,88%)]"
            >
              Рассчитать
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="relative overflow-hidden">
        <img
          src={IMG.g[1]}
          alt="Модульный дом IP MODUL с террасой"
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(150,14%,9%)]/70 via-[hsl(150,14%,9%)]/80 to-[hsl(150,14%,9%)]" />
        <div className="relative mx-auto grid max-w-[1240px] gap-10 px-4 py-20 md:grid-cols-[1.15fr_0.85fr] md:px-8 md:py-32">
          <div>
            <div className="inline-flex items-center gap-2 rounded-xl border border-[hsl(150,8%,26%)] bg-[hsl(150,10%,13%)]/70 px-3 py-1.5 text-xs text-[hsl(40,12%,80%)]">
              <Check className="h-3.5 w-3.5 text-[hsl(35,32%,78%)]" /> Производство в Ленинградской области · доставка и монтаж
            </div>
            <h1 className="mt-6 text-[34px] font-bold leading-[1.08] text-[hsl(40,30%,94%)] md:text-[56px]">
              Построим ваш уютный модульный дом или баню
            </h1>
            <p className={`mt-4 text-xl font-semibold md:text-2xl ${Sand}`}>от 1,6 млн ₽ с гарантией 10 лет!</p>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-[hsl(40,10%,72%)] md:text-base">
              Высокое качество, сроки и контроль всех этапов — мы берём на себя всё, от закупки материалов до финальной уборки.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 rounded-xl bg-[hsl(35,32%,82%)] px-6 py-3.5 text-sm font-semibold text-[hsl(150,14%,10%)] transition-colors hover:bg-[hsl(35,40%,88%)]"
              >
                Посмотреть проекты <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="inline-flex items-center gap-2 rounded-xl border border-[hsl(150,8%,28%)] bg-[hsl(150,10%,13%)] px-6 py-3.5 text-sm font-semibold text-[hsl(40,30%,94%)] transition-colors hover:bg-[hsl(150,10%,17%)]"
              >
                Рассчитать стоимость
              </a>
            </div>
          </div>

          <div className="space-y-3 self-center">
            {advantages.map((a) => (
              <div
                key={a.n}
                className="flex items-start justify-between gap-4 rounded-2xl border border-[hsl(150,8%,22%)] bg-[hsl(150,10%,13%)]/80 p-5"
              >
                <p className="text-sm leading-relaxed text-[hsl(40,16%,88%)]">{a.text}</p>
                <span className="shrink-0 rounded-xl bg-[hsl(150,8%,18%)] px-2.5 py-1 text-[11px] font-semibold text-[hsl(35,32%,78%)]">
                  {a.n}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <Section
        id="projects"
        eyebrow="Дома"
        title="Наши проекты"
        subtitle="Готовые модульные дома с террасой под завоз мебели. Возможны разные планировки."
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <ProjectCard key={`${p.name}-${i}`} p={p} />
          ))}
          {showMore && moreProjects.map((p, i) => <ProjectCard key={`more-${i}`} p={p} />)}
        </div>
        {!showMore && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setShowMore(true)}
              className="rounded-xl border border-[hsl(150,8%,28%)] px-6 py-3 text-sm font-semibold text-[hsl(40,30%,94%)] transition-colors hover:bg-[hsl(150,10%,15%)]"
            >
              Показать ещё
            </button>
          </div>
        )}
      </Section>

      {/* Start series */}
      <div className="border-y border-[hsl(150,8%,18%)] bg-[hsl(150,12%,11%)]">
        <Section id="start" eyebrow="Серия СТАРТ" title="Дома серии СТАРТ" subtitle="Компактные модульные дома в полной комплектации.">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {startSeries.map((s) => (
              <article key={s.name} className="overflow-hidden rounded-2xl border border-[hsl(150,8%,22%)] bg-[hsl(150,10%,13%)]">
                <div className="aspect-[4/3] overflow-hidden bg-[hsl(150,8%,18%)]">
                  <img src={s.image} alt={`Модульный дом ${s.name}`} loading="lazy" className="h-full w-full object-cover" />
                </div>
                <div className="p-5">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-lg font-semibold text-[hsl(40,30%,94%)]">{s.name}</h3>
                    <span className={`text-base font-semibold ${Sand}`}>{s.price}</span>
                  </div>
                  <p className="mt-2 text-[13px] text-[hsl(40,10%,70%)]">{s.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </Section>
      </div>

      {/* Construction */}
      <Section eyebrow="Технология" title="Из чего состоит модульный дом" subtitle="Полный пирог конструкции — как на производстве.">
        <div className="grid gap-4 md:grid-cols-2">
          {construction.map((c) => (
            <div key={c.n} className="rounded-2xl border border-[hsl(150,8%,22%)] bg-[hsl(150,10%,13%)] p-6">
              <div className="flex items-center gap-3">
                <span className="rounded-xl bg-[hsl(150,8%,18%)] px-2.5 py-1 text-[11px] font-semibold text-[hsl(35,32%,78%)]">{c.n}</span>
                <h3 className="text-lg font-semibold text-[hsl(40,30%,94%)]">{c.title}</h3>
              </div>
              <ul className="mt-4 space-y-1.5">
                {c.items.map((i) => (
                  <li key={i} className="flex gap-2 text-[13px] text-[hsl(40,12%,76%)]">
                    <Check className="mt-[3px] h-3.5 w-3.5 shrink-0 text-[hsl(35,32%,72%)]" strokeWidth={2} />
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-[hsl(150,8%,22%)] bg-[hsl(150,10%,13%)] p-5 text-sm text-[hsl(40,16%,88%)]">
            Готовая крытая терраса
          </div>
          <div className="rounded-2xl border border-[hsl(150,8%,22%)] bg-[hsl(150,10%,13%)] p-5 text-sm text-[hsl(40,16%,88%)]">
            Лестницы на террасу
          </div>
        </div>
      </Section>

      {/* Gallery */}
      <div className="border-y border-[hsl(150,8%,18%)] bg-[hsl(150,12%,11%)]">
        <Section id="gallery" eyebrow="Портфолио" title="Галерея наших объектов">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {IMG.g.map((src, i) => (
              <div key={src + i} className="aspect-square overflow-hidden rounded-2xl bg-[hsl(150,8%,18%)]">
                <img
                  src={src}
                  alt={`Готовый объект IP MODUL №${i + 1}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* Options */}
      <Section eyebrow="Опции" title="Дополнительные опции">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {options.map((o) => (
            <div key={o} className="flex items-start gap-3 rounded-2xl border border-[hsl(150,8%,22%)] bg-[hsl(150,10%,13%)] p-5">
              <Check className="mt-[2px] h-4 w-4 shrink-0 text-[hsl(35,32%,78%)]" />
              <span className="text-sm text-[hsl(40,16%,88%)]">{o}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Reviews */}
      <div className="border-y border-[hsl(150,8%,18%)] bg-[hsl(150,12%,11%)]">
        <Section id="reviews" eyebrow="Почему мы?" title="О нас говорят клиенты" subtitle="Рейтинг 5,0 по отзывам покупателей.">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((r) => (
              <blockquote key={r.name} className="rounded-2xl border border-[hsl(150,8%,22%)] bg-[hsl(150,10%,13%)] p-6">
                <p className="text-[13px] leading-relaxed text-[hsl(40,12%,78%)]">{r.text}</p>
                <footer className={`mt-4 text-sm font-semibold ${Sand}`}>{r.name}</footer>
              </blockquote>
            ))}
          </div>
          <div className="mt-8">
            <a
              href={AVITO}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="inline-flex items-center gap-2 rounded-xl border border-[hsl(150,8%,28%)] px-6 py-3 text-sm font-semibold text-[hsl(40,30%,94%)] transition-colors hover:bg-[hsl(150,10%,15%)]"
            >
              Посмотреть отзывы <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </Section>
      </div>

      {/* CTA + contacts */}
      <Section id="contacts" eyebrow="Контакты" title="Скачайте каталог с актуальными ценами" subtitle="Для домов, глэмпингов и баз отдыха.">
        <div className="grid gap-4 md:grid-cols-3">
          <a
            href={PHONE_HREF}
            className="flex items-start gap-3 rounded-2xl border border-[hsl(150,8%,22%)] bg-[hsl(150,10%,13%)] p-6"
          >
            <Phone className="mt-1 h-4 w-4 text-[hsl(35,32%,78%)]" />
            <span>
              <span className="block text-xs text-[hsl(40,10%,66%)]">Телефон</span>
              <span className="block text-base font-semibold text-[hsl(40,30%,94%)]">{PHONE}</span>
            </span>
          </a>
          <div className="flex items-start gap-3 rounded-2xl border border-[hsl(150,8%,22%)] bg-[hsl(150,10%,13%)] p-6">
            <MapPin className="mt-1 h-4 w-4 shrink-0 text-[hsl(35,32%,78%)]" />
            <span>
              <span className="block text-xs text-[hsl(40,10%,66%)]">Адрес</span>
              <span className="block text-sm font-medium text-[hsl(40,30%,94%)]">{ADDRESS}</span>
            </span>
          </div>
          <div className="flex flex-col gap-3 rounded-2xl border border-[hsl(150,8%,22%)] bg-[hsl(150,10%,13%)] p-6">
            <span className="text-xs text-[hsl(40,10%,66%)]">Мессенджеры</span>
            <div className="flex gap-3">
              <a
                href={TELEGRAM}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="inline-flex items-center gap-2 rounded-xl bg-[hsl(150,8%,18%)] px-4 py-2 text-[13px] font-semibold text-[hsl(40,30%,94%)]"
              >
                <Send className="h-3.5 w-3.5" /> Telegram
              </a>
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="inline-flex items-center gap-2 rounded-xl bg-[hsl(150,8%,18%)] px-4 py-2 text-[13px] font-semibold text-[hsl(40,30%,94%)]"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </Section>

      <footer className="border-t border-[hsl(150,8%,18%)] px-4 py-10 md:px-8">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-2 text-xs text-[hsl(40,8%,58%)]">
          <span className="text-sm font-bold tracking-[0.14em] text-[hsl(40,30%,94%)]">IP MODUL</span>
          <span>ИНН 470607991608</span>
          <span>{ADDRESS}</span>
          <span>
            Информация о проектах и ценах взята с официального сайта производителя{" "}
            <a
              href="https://ip-modul.ru/"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="underline underline-offset-2 hover:text-[hsl(40,30%,94%)]"
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
