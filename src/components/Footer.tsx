import { useNavigate } from "react-router-dom";
import logoWhite from "@/assets/logo-white.svg";

const catalogLinks = [
  { label: "Все модульные дома", path: "/catalog" },
  { label: "Дома до 1 млн ₽", path: "/catalog" },
  { label: "Дома до 3 млн ₽", path: "/catalog" },
  { label: "Дачные домики", path: "/catalog" },
  { label: "Двухэтажные дома", path: "/catalog" },
  { label: "Дома для постоянного проживания", path: "/catalog" },
  { label: "Дома с террасой", path: "/catalog" },
  { label: "Каркасные дома", path: "/catalog" },
];

const categoryLinks = [
  { label: "Бани и сауны", path: "/catalog" },
  { label: "Бани-бочки", path: "/catalog" },
  { label: "Глэмпинг", path: "/catalog" },
  { label: "Бытовки", path: "/catalog" },
  { label: "Гостевые дома", path: "/catalog" },
  { label: "Беседки и навесы", path: "/catalog" },
  { label: "Гаражи", path: "/catalog" },
  { label: "Хозблоки", path: "/catalog" },
];

const regionLinks = [
  "Москва и МО", "Санкт-Петербург и ЛО", "Краснодарский край",
  "Новосибирская область", "Свердловская область", "Татарстан",
  "Нижегородская область", "Самарская область",
];

const Footer = () => {
  const navigate = useNavigate();

  const go = (path: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(path);
  };

  return (
    <footer className="bg-secondary border-t border-border mt-4">
      {/* Main grid */}
      <div className="max-w-[1400px] mx-auto px-5 md:px-8 pt-12 pb-10">
        <div className="grid md:grid-cols-4 gap-x-8 gap-y-10">
          {/* Brand */}
          <div>
            <img src={logoWhite} alt="многоместа.рф" className="h-6 mb-4" />
            <p className="text-muted-foreground text-[13px] leading-relaxed max-w-[220px] mb-5">
              Маркетплейс модульных домов. Подберите, сравните и&nbsp;закажите у&nbsp;проверенных производителей.
            </p>
            <div className="flex flex-col gap-1.5 text-[13px] text-muted-foreground">
              <span>info@многоместа.рф</span>
            </div>
          </div>

          {/* Catalog SEO links */}
          <div>
            <h4 className="font-semibold text-[13px] mb-4 text-foreground">Модульные дома</h4>
            <div className="flex flex-col gap-2 text-[13px] text-muted-foreground">
              {catalogLinks.map((l) => (
                <a key={l.label} href={l.path} onClick={go(l.path)} className="hover:text-foreground transition-colors">{l.label}</a>
              ))}
            </div>
          </div>

          {/* Categories SEO links */}
          <div>
            <h4 className="font-semibold text-[13px] mb-4 text-foreground">Категории</h4>
            <div className="flex flex-col gap-2 text-[13px] text-muted-foreground">
              {categoryLinks.map((l) => (
                <a key={l.label} href={l.path} onClick={go(l.path)} className="hover:text-foreground transition-colors">{l.label}</a>
              ))}
            </div>
          </div>

          {/* Company + Partner */}
          <div>
            <h4 className="font-semibold text-[13px] mb-4 text-foreground">Компания</h4>
            <div className="flex flex-col gap-2 text-[13px] text-muted-foreground mb-6">
              <a href="/partner" onClick={go("/partner")} className="hover:text-foreground transition-colors">Стать партнером</a>
              <a href="/categories" onClick={go("/categories")} className="hover:text-foreground transition-colors">Все категории</a>
              <a href="/favorites" onClick={go("/favorites")} className="hover:text-foreground transition-colors">Избранное</a>
              <a href="/messages/support" onClick={go("/messages/support")} className="hover:text-foreground transition-colors">Поддержка</a>
            </div>

            <h4 className="font-semibold text-[13px] mb-3 text-foreground">Производителям</h4>
            <div className="flex flex-col gap-2 text-[13px] text-muted-foreground">
              <a href="/partner" onClick={go("/partner")} className="hover:text-foreground transition-colors">Разместить проекты</a>
              <a href="/partner" onClick={go("/partner")} className="hover:text-foreground transition-colors">Получать заявки</a>
            </div>
          </div>
        </div>

        {/* Regions SEO row */}
        <div className="mt-10 pt-6 border-t border-border">
          <h4 className="font-semibold text-[13px] mb-3 text-foreground">Модульные дома по регионам</h4>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[13px] text-muted-foreground">
            {regionLinks.map((r) => (
              <a key={r} href="/catalog" onClick={go("/catalog")} className="hover:text-foreground transition-colors">{r}</a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border py-4">
        <div className="max-w-[1400px] mx-auto px-5 md:px-8">
          <p className="text-[11px] text-muted-foreground text-center leading-relaxed mb-3">
            Сайт носит информационный характер и не является публичной офертой, определяемой положениями п. 2 статьи 437 ГК РФ.
          </p>
          <div className="flex items-center justify-between text-[12px] text-muted-foreground">
            <span>© многоместа.рф, {new Date().getFullYear()}</span>
            <div className="flex gap-4">
              <a href="/privacy" onClick={go("/privacy")} className="hover:text-foreground transition-colors">Политика конфиденциальности</a>
              <a href="#" className="hover:text-foreground transition-colors">Пользовательское соглашение</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
