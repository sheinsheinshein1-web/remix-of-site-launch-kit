import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, ChevronRight, ShieldCheck } from "lucide-react";
import Header from "@/components/Header";
import { useIsMobile } from "@/hooks/use-mobile";
import shareIcon from "@/assets/share-icon.svg";

type PartnerData = {
  name: string;
  initials: string;
  city: string;
  category: string;
  about: string;
  siteUrl: string;
  stats: { val: string; label: string }[];
};

const partners: Record<string, PartnerData> = {
  "1": {
    name: "Платформа",
    initials: "ПЛ",
    city: "Екатеринбург",
    category: "Модульные дома",
    about:
      "Производитель модульных домов из Екатеринбурга. Проектируем и собираем компактные одноэтажные дома для круглогодичного проживания и загородного отдыха.",
    siteUrl: "https://platforma-modul.ru",
    stats: [
      { val: "8", label: "Проекты" },
      { val: "—", label: "Отзывы" },
      { val: "—", label: "Рейтинг" },
    ],
  },
  bygge: {
    name: "Bygge",
    initials: "BG",
    city: "Екатеринбург",
    category: "Модульные дома",
    about:
      "Bygge — производитель модульных домов из Екатеринбурга. Дома полной заводской готовности под ключ: с тёплыми полами, оборудованным санузлом и вытяжной вентиляцией.",
    siteUrl: "https://bygge.ru",
    stats: [
      { val: "1", label: "Проекты" },
      { val: "—", label: "Отзывы" },
      { val: "—", label: "Рейтинг" },
    ],
  },
  glezman: {
    name: "Glezman Group",
    initials: "GG",
    city: "Пермь",
    category: "Модульные дома",
    about:
      "Glezman Group — производитель модульных домов из Перми. Линейка La Rus: компактные и просторные дома площадью от 45 до 127 м² с панорамным остеклением и продуманной планировкой.",
    siteUrl: "https://glezman-group.ru",
    stats: [
      { val: "5", label: "Проекты" },
      { val: "—", label: "Отзывы" },
      { val: "4.7", label: "Рейтинг" },
    ],
  },
};

const Partner = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { id } = useParams();
  const [scrolled, setScrolled] = useState(false);

  const partner = (id && partners[id]) || partners["1"];

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/catalog");
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 200);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ─── Desktop ─── */
  if (!isMobile) {
    return (
      <div className="min-h-screen bg-secondary font-sans">
        <Header />
        <div className="pt-[152px] pb-6">
          <div className="max-w-[1400px] mx-auto bg-background rounded-2xl overflow-hidden">
            <div className="bg-background">
              {/* Header row: back / share */}
              <div className="flex items-center justify-between px-6 pt-6">
                <button onClick={handleBack} className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors">
                  <ArrowLeft className="w-[18px] h-[18px] text-foreground" strokeWidth={1.8} />
                </button>
                <button
                  className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
                  onClick={() => { if (navigator.share) { navigator.share({ title: partner.name, url: window.location.href }); } else { navigator.clipboard.writeText(window.location.href); } }}
                >
                  <img src={shareIcon} alt="" className="w-[18px] h-[18px]" loading="lazy" decoding="async" />
                </button>
              </div>

              {/* "Your company?" banner */}
              <div className="px-6 mt-4">
                <div className="bg-secondary rounded-xl px-4 py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <ShieldCheck className="w-[18px] h-[18px] text-muted-foreground shrink-0" strokeWidth={1.8} />
                    <span className="text-[14px] text-foreground/80 truncate">Это ваша компания?</span>
                  </div>
                  <Link to="/messages/support" className="text-[14px] font-medium text-primary inline-flex items-center gap-1 shrink-0 hover:underline">
                    Подтвердить <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Profile */}
              <div className="px-6 pt-5 pb-6 flex items-center gap-4">
                <div className="w-[80px] h-[80px] rounded-2xl bg-secondary text-foreground/30 flex items-center justify-center text-lg font-bold shrink-0">{partner.initials}</div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-[22px] font-bold text-foreground leading-tight mb-1 truncate">{partner.name}</h1>
                  <p className="text-[14px] text-muted-foreground truncate">{partner.category} · {partner.city}</p>
                </div>
              </div>

              {/* Stats row */}
              <div className="border-t border-border grid grid-cols-3">
                {partner.stats.map((s, i) => (
                  <div key={i} className={`py-5 text-center ${i > 0 ? 'border-l border-border' : ''}`}>
                    <div className="text-[22px] font-bold text-foreground leading-none mb-1.5">{s.val}</div>
                    <div className="text-[11px] font-medium tracking-wider uppercase text-muted-foreground">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* About */}
              <div className="border-t border-border px-6 py-5">
                <p className="text-[11px] font-medium tracking-wider uppercase text-muted-foreground mb-2">О компании</p>
                <p className="text-[15px] text-foreground/85 leading-relaxed">
                  {partner.about}
                </p>
                <p className="mt-3 text-[12px] text-muted-foreground/80 leading-relaxed">
                  Все проекты и торговые знаки принадлежат компании {partner.name}. Информация собрана из открытых источников и приведена в ознакомительных целях.
                </p>
              </div>

              {/* Go to site CTA */}
              <div className="border-t border-border p-5">
                <a
                  href={partner.siteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-[52px] bg-primary text-primary-foreground rounded-xl text-[15px] font-semibold flex items-center justify-center hover:opacity-90 transition-opacity"
                >
                  Перейти на сайт
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ─── Mobile ─── */
  return (
    <div className="min-h-screen bg-secondary">
      {/* Sticky compact header on scroll */}
      <div className={`fixed top-0 left-0 right-0 z-50 transition-opacity duration-300 ${scrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="bg-background px-3 pt-[max(env(safe-area-inset-top),12px)] pb-3 rounded-b-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <button onClick={handleBack} className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
              <ArrowLeft className="w-[18px] h-[18px] text-foreground" strokeWidth={1.8} />
            </button>
            <div className="flex-1 min-w-0 ml-3">
              <div className="text-[14px] font-semibold text-foreground truncate">{partner.name}</div>
              <div className="text-[12px] text-muted-foreground truncate">{partner.category} · {partner.city}</div>
            </div>
            <button
              className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center"
              onClick={() => { if (navigator.share) { navigator.share({ title: partner.name, url: window.location.href }); } else { navigator.clipboard.writeText(window.location.href); } }}
            >
              <img src={shareIcon} alt="" className="w-[18px] h-[18px]" loading="lazy" decoding="async" />
            </button>
          </div>
        </div>
      </div>

      {/* Main bento card — full width, edge-to-edge top */}
      <div className="bg-background rounded-b-2xl overflow-hidden">
        <div>
          {/* Header row: back / share */}
          <div className="flex items-center justify-between px-4 pt-[max(env(safe-area-inset-top),12px)]">
            <button onClick={handleBack} className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
              <ArrowLeft className="w-[18px] h-[18px] text-foreground" strokeWidth={1.8} />
            </button>
            <button
              className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center"
              onClick={() => { if (navigator.share) { navigator.share({ title: partner.name, url: window.location.href }); } else { navigator.clipboard.writeText(window.location.href); } }}
            >
              <img src={shareIcon} alt="" className="w-[18px] h-[18px]" loading="lazy" decoding="async" />
            </button>
          </div>

          {/* "Your company?" banner */}
          <div className="px-4 mt-4">
            <div className="bg-secondary rounded-xl px-3.5 py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <ShieldCheck className="w-[18px] h-[18px] text-muted-foreground shrink-0" strokeWidth={1.8} />
                <span className="text-[13px] text-foreground/80 truncate">Это ваша компания?</span>
              </div>
              <Link to="/messages/support" className="text-[13px] font-medium text-primary inline-flex items-center gap-1 shrink-0">
                Подтвердить <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Profile */}
          <div className="px-4 pt-4 pb-5 flex items-center gap-3">
            <div className="w-[68px] h-[68px] rounded-2xl bg-secondary text-foreground/30 flex items-center justify-center text-base font-bold shrink-0">{partner.initials}</div>
            <div className="flex-1 min-w-0">
              <h1 className="text-[19px] font-bold text-foreground leading-tight mb-0.5 truncate">{partner.name}</h1>
              <p className="text-[13px] text-muted-foreground truncate">{partner.category} · {partner.city}</p>
            </div>
          </div>

          {/* Stats row */}
          <div className="border-t border-border grid grid-cols-3">
            {partner.stats.map((s, i) => (
              <div key={i} className={`py-4 text-center ${i > 0 ? 'border-l border-border' : ''}`}>
                <div className="text-[20px] font-bold text-foreground leading-none mb-1.5">{s.val}</div>
                <div className="text-[11px] font-medium tracking-wider uppercase text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>

          {/* About */}
          <div className="border-t border-border px-4 py-4">
            <p className="text-[11px] font-medium tracking-wider uppercase text-muted-foreground mb-2">О компании</p>
            <p className="text-[14px] text-foreground/85 leading-relaxed">
              {partner.about}
            </p>
            <p className="mt-3 text-[12px] text-muted-foreground/80 leading-relaxed">
              Все проекты и торговые знаки принадлежат компании {partner.name}. Информация собрана из открытых источников и приведена в ознакомительных целях.
            </p>
          </div>

        </div>
      </div>

      <div className="h-28" />

      {/* Bottom Bar — go to site CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="bg-background border-t border-border p-3 pb-[calc(0.75rem+max(env(safe-area-inset-bottom),20px))]">
          <a
            href={partner.siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-[50px] bg-primary text-primary-foreground rounded-xl text-[15px] font-semibold flex items-center justify-center"
          >
            Перейти на сайт
          </a>
        </div>
      </div>
    </div>
  );
};

export default Partner;
