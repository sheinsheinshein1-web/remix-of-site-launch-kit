import { useState } from "react";
import Seo from "@/components/Seo";

/**
 * Лендинг производителя РУСМОДУЛЬ (rusmodul-spb.ru).
 * Визуальный референс — rhodeskin.com: тёплый кремовый фон, крупные фото,
 * много воздуха, спокойная типографика, минимум рамок и плашек.
 * Фирменный оранжевый #EB6937 используется точечно как акцент.
 */

const PHONE = "+7 (812) 703-85-84";
const PHONE_HREF = "tel:+78127038584";
const EMAIL = "SKRus178@yandex.ru";
const SITE = "https://rusmodul-spb.ru/";
const ADDRESS = "Русско-Высоцкое, ул. Дорога на Южный птицекомплекс, 3";
const HOURS = "Пн–Пт | с 10:00 до 18:00";

/** Палитра: тёплый кремовый фон, графитовый текст, фирменный оранжевый акцент */
const CREAM = "hsl(38,32%,95%)";
const INK = "hsl(24,10%,14%)";
const MUTED = "hsl(24,8%,44%)";
const HAIR = "hsl(30,14%,86%)";
const BRAND = "hsl(18,82%,57%)";

const IMG = {
  hero: "https://static.tildacdn.com/tild6238-3136-4363-a539-313631663337/Exterior_shot_of_a_s.png",
  houses: [
    "https://optim.tildacdn.com/tild3032-6531-4933-a265-303465653461/-/cover/912x854/center/center/-/format/webp/JWK_0261.webp",
    "https://optim.tildacdn.com/tild3534-3937-4231-a339-316161383531/-/cover/912x854/center/center/-/format/webp/Exterior_Camera_01_W.webp",
    "https://optim.tildacdn.com/tild3633-6462-4363-a164-343666316538/-/cover/912x854/center/center/-/format/webp/XLoft_zijaanzicht.webp",
    "https://optim.tildacdn.com/tild3662-3562-4237-a230-646165333038/-/cover/912x854/center/center/-/format/webp/MHL_30_front.webp",
    "https://optim.tildacdn.com/tild3932-6331-4536-a138-633032306536/-/cover/912x854/center/center/-/format/webp/IMG_2511-min.webp",
    "https://optim.tildacdn.com/tild6261-6664-4563-b137-313061386234/-/cover/912x854/center/center/-/format/webp/240325-Scandi-Double.webp",
    "https://optim.tildacdn.com/tild6165-3835-4131-b339-616564663034/-/cover/912x854/center/center/-/format/webp/1.png.webp",
    "https://optim.tildacdn.com/tild3936-3033-4436-b066-323161336363/-/cover/912x854/center/center/-/format/webp/2.png.webp",
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
  { name: "Баня «Кедр»", area: "11 м²", price: "от 605 000 ₽", image: IMG.gallery[1], href: SITE },
  { name: "Баня «Кедр»", area: "25 м²", price: "от 1 375 000 ₽", image: IMG.gallery[0], href: SITE },
];

const categories = [
  { title: "Модульные дома", price: "от 1 155 000 ₽" },
  { title: "Модульные бани", price: "от 605 000 ₽" },
  { title: "Хозяйственные блоки", price: "от 200 000 ₽" },
];

const steps = [
  { n: "01", title: "Договор", text: "Согласовываем условия и сроки строительства будущего дома." },
  { n: "02", title: "Проект", text: "Вы выбираете модель дома, мы адаптируем её под участок." },
  { n: "03", title: "Фундамент", text: "Готовим участок и выполняем лёгкие фундаментные работы." },
  { n: "04", title: "Производство", text: "Собираем модули на заводе с чистовой отделкой." },
  { n: "05", title: "Сборка", text: "Доставляем дом на участок и завершаем монтаж." },
];

const advantages = [
  { title: "Индивидуальный проект", text: "Разработаем проект «с нуля» под ваши задачи: изменим планировку, добавим панорамное остекление или создадим уникальную конфигурацию модулей." },
  { title: "Фиксированная стоимость", text: "Вы знаете точную стоимость объекта «под ключ» с первого дня. Никаких сюрпризов и перерасходов." },
  { title: "Запуск за 2–3 месяца", text: "Пока на участке готовится лёгкий фундамент, модули производятся на заводе. Экономите не месяцы, а целый сезон." },
  { title: "Качество и надёжность", text: "Технологичное строение, которое сохраняет комфортный микроклимат и не требует частого обслуживания." },
  { title: "10 лет опыта", text: "Собственная производственная база и штатные монтажные бригады на каждом этапе." },
  { title: "Гарантия 5 лет", text: "Берём на себя ответственность за конструктив и долговечность строения официально." },
];

const included = [
  { title: "Энергоэффективность 365", text: "Современные технологии утепления: тепло в мороз и прохладно в летний зной." },
  { title: "Полный цикл работ", text: "Можем не только поставить дом, но и укомплектовать его мебелью и благоустроить территорию." },
  { title: "Готовый продукт", text: "Не нужно искать дизайнеров или электриков — всё уже включено в базовую комплектацию." },
  { title: "Заводская отделка", text: "Никакой пыли и покраски на участке — объект готов к эксплуатации." },
  { title: "Инженерия «под ключ»", text: "Коммуникации разведены внутри модулей — остаётся подключиться к внешним сетям." },
  { title: "Масштабирование", text: "Проект легко адаптируется под гостевой дом, офис или кафе. Нужно больше — добавьте модули." },
];

const reviews = [
  { name: "Алексей В.", text: "Долго думали: строить полноценный дом или модульный. Выбрали второй и не пожалели. Привезли и установили всё за один день, дом прогревается за пару часов даже в минус 10." },
  { name: "Марина С.", text: "Брали баню «Кедр» для дачи. Всё сделали в срок, отделка аккуратная, запах дерева приятный. Монтаж занял один день, вопросов по качеству нет." },
  { name: "Игорь П.", text: "Ставили дома под глэмпинг. Понравилась фиксированная цена и то, что сезон не потеряли: пока делали фундамент, модули уже производились на заводе." },
];

const faq = [
  { q: "Какие документы я получаю после завершения работ?", a: "Акт приёмки-передачи модульного дома, технический паспорт и проектную документацию, гарантии на конструкцию и отделку, инструкции по эксплуатации инженерных систем." },
  { q: "Можно ли купить дом в ипотеку?", a: "Да. Дома подходят под льготные программы: Семейная, IT-ипотека, Господдержка — ставка от 4,5%, первоначальный взнос от 15%." },
  { q: "Куда вы доставляете дома?", a: "Строим по всей Ленинградской области и за её пределами: радиус доставки модулей 800+ км, работаем в 12+ регионах России." },
];

const ext = (href: string) =>
  href.startsWith("#") || href.startsWith("tel:") || href.startsWith("mailto:")
    ? {}
    : { target: "_blank", rel: "noopener noreferrer nofollow" };

/** Спокойная кнопка-«пилюля» в духе Rhode: тёмная заливка или тонкий контур */
const Btn = ({ href, children, ghost }: { href: string; children: React.ReactNode; ghost?: boolean }) => (
  <a
    href={href}
    {...ext(href)}
    className="inline-flex items-center justify-center px-8 py-3.5 text-[13px] tracking-[0.02em] transition-colors duration-300"
    style={
      ghost
        ? { border: `1px solid ${INK}`, color: INK }
        : { background: INK, color: CREAM }
    }
  >
    {children}
  </a>
);

/** Секция: широкие поля, тонкая линия сверху, крупный спокойный заголовок */
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

/** Карточка проекта — только фото и тихая подпись, без рамок */
const Card = ({ p, tall }: { p: Project; tall?: boolean }) => (
  <a href={p.href} {...ext(p.href)} className="group block">
    <div
      className={`${tall ? "aspect-[4/5]" : "aspect-[5/4]"} overflow-hidden`}
      style={{ background: "hsl(30,14%,90%)" }}
    >
      <img
        src={p.image}
        alt={`Модульный дом ${p.name} ${p.area} — РУСМОДУЛЬ`}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]"
      />
    </div>
    <div className="flex items-baseline justify-between gap-6 pt-6">
      <h3 className="text-[19px] font-normal tracking-[-0.01em] md:text-[22px]" style={{ color: INK }}>
        {p.name}
        <span style={{ color: MUTED }}> · {p.area}</span>
      </h3>
      <span className="shrink-0 text-[14px]" style={{ color: MUTED }}>
        {p.price}
      </span>
    </div>
  </a>
);

/** Ряд списка: номер/заголовок слева, текст справа, разделитель — тонкая линия */
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

const RusModul = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen font-sans antialiased" style={{ background: CREAM, color: INK }}>
      <Seo
        title="РУСМОДУЛЬ — модульные дома, бани и хозблоки в СПб"
        description="Модульные дома от 1 155 000 ₽, бани от 605 000 ₽, хозблоки от 200 000 ₽. Производство от 30 дней, монтаж за 7 дней, гарантия 5 лет, ипотека от 4,5%."
        canonicalPath="/rusmodul"
      />

      {/* Шапка */}
      <header
        className="sticky top-0 z-40 backdrop-blur"
        style={{ background: "hsla(38,32%,95%,0.9)", borderBottom: `1px solid ${HAIR}` }}
      >
        <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between px-5 md:px-12">
          <a href="#top" className="text-[15px] tracking-[0.22em]" style={{ color: INK }}>
            РУСМОДУЛЬ
          </a>
          <nav className="hidden items-center gap-9 text-[13px] lg:flex" style={{ color: MUTED }}>
            <a href="#houses" className="transition-colors hover:text-[hsl(24,10%,14%)]">Дома</a>
            <a href="#banya" className="transition-colors hover:text-[hsl(24,10%,14%)]">Бани</a>
            <a href="#steps" className="transition-colors hover:text-[hsl(24,10%,14%)]">Этапы</a>
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
          src={IMG.hero}
          alt="Модульный дом РУСМОДУЛЬ с установкой за один день"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/65 via-black/25 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 px-5 pb-12 md:px-12 md:pb-16">
          <div className="mx-auto max-w-[1240px]">
            <h1 className="max-w-3xl text-[34px] font-normal leading-[1.06] tracking-[-0.03em] text-white md:text-[68px]">
              Модульные дома, бани и хозблоки с установкой от одного дня
            </h1>
            <div className="mt-7 flex flex-col gap-7 md:mt-10 md:flex-row md:items-end md:justify-between">
              <p className="max-w-md text-[15px] leading-[1.7] text-white/75 md:text-[17px]">
                Строим на заводе и привозим готовый дом к вам на участок. Производство от 30 дней,
                Санкт-Петербург и Ленинградская область.
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
                  href="#houses"
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
            { v: "7 дней", l: "монтаж на участке" },
            { v: "5 лет", l: "гарантия" },
            { v: "от 4,5%", l: "ипотека" },
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

      {/* Направления */}
      <Section eyebrow="Что мы производим" title="Три направления">
        <div className="grid gap-10 md:grid-cols-3">
          {categories.map((c) => (
            <div key={c.title} className="pt-6" style={{ borderTop: `1px solid ${HAIR}` }}>
              <h3 className="text-[20px] font-normal tracking-[-0.01em]" style={{ color: INK }}>
                {c.title}
              </h3>
              <p className="mt-3 text-[15px]" style={{ color: BRAND }}>
                {c.price}
              </p>
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
        <div className="grid gap-x-8 gap-y-20 md:grid-cols-2 md:gap-x-14 md:gap-y-28">
          {houses.map((p, i) => (
            <Card key={`${p.name}-${p.area}`} p={p} tall={i % 3 === 0} />
          ))}
        </div>
        <div className="mt-20">
          <Btn href="https://rusmodul-spb.ru/projects" ghost>
            Все проекты
          </Btn>
        </div>
      </Section>

      {/* Бани */}
      <Section
        id="banya"
        eyebrow="Бани"
        title="Модульные бани «Кедр»"
        subtitle="Готовая баня с отделкой — привозим и устанавливаем за один день."
      >
        <div className="grid gap-x-8 gap-y-20 md:grid-cols-2 md:gap-x-14">
          {banyas.map((p) => (
            <Card key={`${p.name}-${p.area}`} p={p} />
          ))}
        </div>
      </Section>

      {/* Этапы */}
      <Section id="steps" eyebrow="Этапы работы" title="Как строится ваш дом">
        <div>
          {steps.map((s) => (
            <Row key={s.n} label={s.n} title={s.title} text={s.text} />
          ))}
        </div>
      </Section>

      {/* Преимущества */}
      <Section eyebrow="Преимущества" title="Почему РУСМОДУЛЬ">
        <div>
          {advantages.map((a) => (
            <Row key={a.title} title={a.title} text={a.text} />
          ))}
        </div>
      </Section>

      {/* Ипотека */}
      <section className="px-5 py-20 md:px-12 md:py-28" style={{ borderTop: `1px solid ${HAIR}` }}>
        <div className="mx-auto grid max-w-[1240px] gap-10 md:grid-cols-2 md:items-end">
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em]" style={{ color: BRAND }}>
              Ипотека
            </p>
            <h2
              className="mt-5 text-[30px] font-normal leading-[1.1] tracking-[-0.02em] md:text-[52px]"
              style={{ color: INK }}
            >
              Ваша недвижимость в ипотеку от 4,5%
            </h2>
          </div>
          <div>
            <p className="text-[15px] leading-[1.75] md:text-[17px]" style={{ color: MUTED }}>
              Дома подходят под все виды льготных программ: Семейная, IT-ипотека, Господдержка. Помогаем с
              одобрением даже в сложных случаях. Первоначальный взнос от 15%.
            </p>
            <div className="mt-8">
              <Btn href={SITE}>Рассчитать платёж</Btn>
            </div>
          </div>
        </div>
      </section>

      {/* Комплектация */}
      <Section eyebrow="Комплектация" title="Что входит в дом">
        <div>
          {included.map((i) => (
            <Row key={i.title} title={i.title} text={i.text} />
          ))}
        </div>
      </Section>

      {/* География */}
      <Section
        eyebrow="География"
        title="Строим по Ленинградской области и за её пределами"
        subtitle="Наши модули вписываются в любой ландшафт и условия участка."
      >
        <dl className="grid gap-10 sm:grid-cols-2">
          {[
            { v: "800+ км", l: "радиус доставки модулей" },
            { v: "12+", l: "регионов России" },
          ].map((s) => (
            <div key={s.l} className="pt-6" style={{ borderTop: `1px solid ${HAIR}` }}>
              <dt className="text-[32px] font-normal tracking-[-0.02em] md:text-[48px]" style={{ color: INK }}>
                {s.v}
              </dt>
              <dd className="mt-2 text-[13px]" style={{ color: MUTED }}>
                {s.l}
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* Галерея */}
      <Section id="gallery" eyebrow="Портфолио" title="Реализованные объекты">
        <div className="space-y-8 md:space-y-14">
          <div className="aspect-[16/9] overflow-hidden" style={{ background: "hsl(30,14%,90%)" }}>
            <img
              src={IMG.gallery[0]}
              alt="Готовый объект РУСМОДУЛЬ"
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out hover:scale-[1.04]"
            />
          </div>
          <div className="grid grid-cols-2 gap-8 md:gap-14">
            {IMG.gallery.slice(1).map((src, i) => (
              <div
                key={src + i}
                className={`${i % 3 === 0 ? "aspect-[4/5]" : "aspect-[5/4]"} overflow-hidden`}
                style={{ background: "hsl(30,14%,90%)" }}
              >
                <img
                  src={src}
                  alt={`Готовый объект РУСМОДУЛЬ №${i + 2}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out hover:scale-[1.04]"
                />
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Отзывы */}
      <Section id="reviews" eyebrow="Отзывы — 4,9" title="Доверие в каждом метре">
        <div className="grid gap-12 md:grid-cols-3 md:gap-14">
          {reviews.map((r) => (
            <blockquote key={r.name} className="pt-6" style={{ borderTop: `1px solid ${HAIR}` }}>
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
        title="Убедитесь в качестве лично"
        subtitle="Посетите наше пространство в Санкт-Петербурге: в офисе подберём планировку, а на площадке покажем готовую работу в деталях."
      >
        <div className="grid gap-10 md:grid-cols-3">
          <div className="pt-6" style={{ borderTop: `1px solid ${HAIR}` }}>
            <p className="text-[12px] uppercase tracking-[0.2em]" style={{ color: MUTED }}>
              Телефон
            </p>
            <a href={PHONE_HREF} className="mt-4 block text-[22px] font-normal tracking-[-0.01em]" style={{ color: INK }}>
              {PHONE}
            </a>
            <a href={`mailto:${EMAIL}`} className="mt-2 block text-[14px]" style={{ color: MUTED }}>
              {EMAIL}
            </a>
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
              Режим работы
            </p>
            <p className="mt-4 text-[15px]" style={{ color: INK }}>
              {HOURS}
            </p>
            <div className="mt-7">
              <Btn href="http://rusmodul-spb.ru/production" ghost>
                О производстве
              </Btn>
            </div>
          </div>
        </div>
      </Section>

      <footer className="px-5 py-14 md:px-12" style={{ borderTop: `1px solid ${HAIR}` }}>
        <div className="mx-auto flex max-w-[1240px] flex-col gap-3 text-[13px]" style={{ color: MUTED }}>
          <span className="text-[15px] tracking-[0.22em]" style={{ color: INK }}>
            РУСМОДУЛЬ
          </span>
          <span>{ADDRESS}</span>
          <span>
            Информация о проектах и ценах взята с официального сайта производителя{" "}
            <a href={SITE} {...ext(SITE)} className="underline underline-offset-2">
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
