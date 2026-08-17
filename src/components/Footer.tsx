import { Link } from "react-router-dom";
import { ArrowUpRight, Mail, Send } from "lucide-react";
import logoColor from "@/assets/logo-mnogo-mesta.png";
import { FRAME_VS_MODULAR_ARTICLE_PATH } from "@/data/articles";
import { regions } from "@/data/regions";
import ThemeToggle from "@/components/ThemeToggle";
import { sortGeoItems } from "@/lib/geoOrder";
import { openCookieSettings } from "@/lib/cookieConsent";
import { CATALOG_PATH, MANUFACTURERS_PATH, REGIONS_PATH, getRegionPath } from "@/lib/siteRoutes";

type FooterItem = { label: string; path: string };
type FooterGroup = { title: string; links: FooterItem[] };

const catalogLinks: FooterItem[] = [
  { label: "Все проекты домов", path: CATALOG_PATH },
  { label: "Все категории", path: "/categories" },
  { label: "Модульные дома", path: `${CATALOG_PATH}?tech=Модульный дом` },
  { label: "Дома до 2 млн ₽", path: `${CATALOG_PATH}?maxPrice=2000000` },
  { label: "Дома до 3 млн ₽", path: `${CATALOG_PATH}?maxPrice=3000000` },
  { label: "Дома под ключ", path: `${CATALOG_PATH}?q=под ключ` },
  { label: "Барнхаусы", path: `${CATALOG_PATH}?q=барнхаус` },
  { label: "A-frame", path: `${CATALOG_PATH}?q=а-фрейм` },
  { label: "Одноэтажные дома", path: `${CATALOG_PATH}?floors=1` },
  { label: "Дома с террасой", path: `${CATALOG_PATH}?q=терраса` },
  { label: "Дома для дачи", path: `${CATALOG_PATH}?q=дача` },
];

const regionLinks: FooterItem[] = sortGeoItems(
  regions,
  (region) => region.cityValue,
).map((region) => ({
  label: region.name,
  path: getRegionPath(region.slug),
}));

const buyerLinks: FooterItem[] = [
  { label: "Как работает сервис", path: "/#faq" },
  { label: "Избранное", path: "/favorites" },
  { label: "Мои заявки", path: "/requests" },
  { label: "Сообщения", path: "/messages" },
];

const materialLinks: FooterItem[] = [
  { label: "Журнал", path: "/articles" },
  { label: "Как выбрать дом", path: "/articles/kak-vybrat-modulnyy-dom" },
  { label: "Из чего складывается цена", path: "/articles/iz-chego-skladyvaetsya-tsena" },
  { label: "Каркасный или модульный дом", path: FRAME_VS_MODULAR_ARTICLE_PATH },
];

const manufacturerLinks: FooterItem[] = [
  { label: "Производители", path: MANUFACTURERS_PATH },
  { label: "Разместить проекты", path: "/partner" },
  { label: "Войти в кабинет", path: "/profile?mode=login" },
  { label: "Поддержка производителей", path: "/messages/partner" },
];

const serviceLinks: FooterItem[] = [
  { label: "О сервисе", path: "/#about" },
  { label: "Все производители", path: MANUFACTURERS_PATH },
  { label: "Все регионы", path: REGIONS_PATH },
  { label: "Поддержка покупателей", path: "/messages/support" },
];

const socialLinks = [
  { label: "Telegram", href: "https://t.me/mnogomesta", icon: Send },
  { label: "Дзен", href: "https://dzen.ru/mnogomesta", icon: ArrowUpRight },
];

const FooterNavigationGroup = ({ title, links }: FooterGroup) => {
  return (
    <section>
      <h2 className="text-[12px] font-medium leading-snug text-muted-foreground sm:text-[13px]">{title}</h2>
      <nav aria-label={title} className="mt-3 flex flex-col items-start lg:mt-4">
        {links.map((item) => (
          <Link key={`${item.label}-${item.path}`} to={item.path} className="inline-flex min-h-11 items-center text-[14px] leading-snug text-foreground/80 transition-colors hover:text-primary focus-visible:rounded-[2px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 lg:min-h-9 lg:text-[15px]">
            {item.label}
          </Link>
        ))}
      </nav>
    </section>
  );
};

const Footer = () => (
  <footer id="about" className="scroll-mt-20 bg-secondary text-foreground">
    <div className="mx-auto w-full max-w-[1400px] px-4 pb-7 pt-10 sm:px-8 md:pb-9 md:pt-14 lg:px-12 lg:pt-16">
      <div className="grid grid-cols-2 gap-x-6 gap-y-12 sm:gap-x-10 lg:grid-cols-[1.25fr_1fr_1fr_1fr_1fr] lg:gap-x-10 lg:gap-y-0 xl:gap-x-14">
        <section className="col-span-2 max-w-[420px] lg:col-span-1 lg:max-w-[340px]">
          <Link to="/" className="inline-flex rounded-[2px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30">
            <img src={logoColor} alt="Много места" className="h-[22px] w-auto dark:brightness-0 dark:invert md:h-[23px]" loading="lazy" decoding="async" />
          </Link>
          <p className="mt-5 text-[14px] leading-relaxed text-foreground/65 md:text-[15px]">
            Платформа для выбора модульных домов с доставкой по России.
          </p>
          <a href="mailto:hello@mnogomesta.com" className="mt-4 inline-flex min-h-11 items-center gap-2 text-[14px] font-medium text-foreground/85 transition-colors hover:text-primary focus-visible:rounded-[2px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 md:text-[15px]">
            <Mail className="h-4 w-4 text-muted-foreground" strokeWidth={1.8} aria-hidden />
            hello@mnogomesta.com
          </a>
          <nav aria-label="Социальные сети" className="mt-3 flex items-center gap-2">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className="inline-flex h-11 w-11 items-center justify-center rounded-[3px] text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30">
                <Icon className="h-[18px] w-[18px]" strokeWidth={1.7} aria-hidden />
              </a>
            ))}
          </nav>
        </section>

        <FooterNavigationGroup title="Каталог домов" links={catalogLinks} />
        <FooterNavigationGroup title="Регионы доставки" links={regionLinks} />

        <div className="space-y-10">
          <FooterNavigationGroup title="Покупателям" links={buyerLinks} />
          <FooterNavigationGroup title="Журнал" links={materialLinks} />
        </div>

        <div className="space-y-10">
          <FooterNavigationGroup title="Производителям" links={manufacturerLinks} />
          <FooterNavigationGroup title="О сервисе" links={serviceLinks} />
        </div>
      </div>

      <div className="mt-12 grid gap-6 pt-7 md:mt-14 md:grid-cols-[1fr_auto] md:items-end">
        <div className="max-w-[950px]">
          <p className="text-[12px] leading-relaxed text-foreground/55 md:text-[13px]">
            Мы не строим дома и не принимаем оплату: договор, комплектацию, сроки и окончательную стоимость покупатель согласовывает напрямую с производителем.
          </p>
          <p className="mt-2 text-[12px] leading-relaxed text-foreground/45 md:text-[13px]">
            Информация на сайте носит справочный характер и не является публичной офертой.
          </p>
        </div>
        <ThemeToggle />
      </div>

      <div className="mt-7 flex flex-col gap-3 text-[12px] text-foreground/50 sm:flex-row sm:items-center sm:justify-between md:text-[13px]">
        <p>© многоместа.рф, {new Date().getFullYear()}</p>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <Link to="/legal" className="transition-colors hover:text-primary">Юридическая информация</Link>
          <button type="button" onClick={openCookieSettings} className="transition-colors hover:text-primary focus-visible:rounded-[2px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30">
            Настройки cookie
          </button>
          <Link to="/messages/support" className="transition-colors hover:text-primary">Обратная связь</Link>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
