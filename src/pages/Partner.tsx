import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, ChevronRight, ShieldCheck, Star, SlidersHorizontal, MapPin } from "lucide-react";
import Header from "@/components/Header";
import { useIsMobile } from "@/hooks/use-mobile";
import shareIcon from "@/assets/share-icon.svg";
import ProjectCard from "@/components/ProjectCard";
import {
  projects as allProjects,
  projectsCountByMakerId,
  makersById,
} from "@/data/projects";

const wordForm = (n: number, forms: [string, string, string]) => {
  const m = Math.abs(n) % 100;
  const m1 = m % 10;
  if (m > 10 && m < 20) return forms[2];
  if (m1 > 1 && m1 < 5) return forms[1];
  if (m1 === 1) return forms[0];
  return forms[2];
};

// Маппинг id из URL → makerId. Поддерживаем легаси "1" → platforma.
const partnerMakerIds: Record<string, string> = { "1": "platforma" };

// Тексты «о компании» — единственное, что не выводится автоматически из projects.ts.
const aboutByMakerId: Record<string, string> = {
  platforma:
    "Производитель модульных домов из Екатеринбурга. Проектируем и собираем компактные одноэтажные дома для круглогодичного проживания и загородного отдыха.",
  bygge:
    "Bygge — производитель модульных домов из Екатеринбурга. Дома полной заводской готовности под ключ: с тёплыми полами, оборудованным санузлом и вытяжной вентиляцией.",
  glezman:
    "Glezman Group — производитель каркасных домов из Перми. Линейка La Rus: компактные и просторные дома площадью от 45 до 127 м² с панорамным остеклением и продуманной планировкой.",
  divodom:
    "ДивоДом — производитель модульных домов из Перми. Линейка ДИВО: дома полной заводской готовности площадью от 30 до 110 м² с террасами, утеплением до −30°C и монтажом за 1 день.",
  gradodom:
    "ГрадоДом — производитель каркасных домов из Пермского края. Каркасные одно- и двухэтажные дома площадью от 55 м² с продуманной планировкой и сроком строительства от 3 месяцев.",
  zagorodom:
    "СК «Загородом» — строительная компания из Пермского края. Каркасные дома и барнхаусы под ключ с террасами, панорамным остеклением и современной архитектурой.",
  apa:
    "Апа Групп — производитель каркасных домов из Пермского края. Линейка АА: одно- и двухэтажные дома площадью от 68 до 106 м² со сроком строительства от 3 месяцев.",
  "prime-modul":
    "Прайм Модуль — производитель каркасных домов из Пермского края. Дома и барнхаусы площадью от 42 до 200 м² на винтовом фундаменте с утеплением базальтовой ватой, водяным тёплым полом и сроком строительства от 1 месяца.",
};

const manualCounts: Record<string, number> = { bygge: 5 };

const Partner = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { id } = useParams();
  const [scrolled, setScrolled] = useState(false);
  const [following, setFollowing] = useState(false);

  const makerId = (id && (partnerMakerIds[id] ?? (makersById[id] ? id : undefined))) || "platforma";
  const summary = makersById[makerId];
  const projectsCount = manualCounts[makerId] ?? projectsCountByMakerId[makerId] ?? 0;

  // Проекты этой компании — берём из единого источника правды.
  const makerProjects = useMemo(
    () => allProjects.filter((p) => p.maker.id === makerId),
    [makerId]
  );
  const heroImage = makerProjects[0]?.gallery[0]?.image ?? "";

  // Соберём уникальные технологии/материалы — для секции "По технологии".
  const techGroups = useMemo(() => {
    const map = new Map<string, { tech: string; image: string; count: number }>();
    makerProjects.forEach((p) => {
      const t = p.technology || "—";
      const existing = map.get(t);
      if (existing) existing.count += 1;
      else map.set(t, { tech: t, image: p.gallery[0]?.image ?? "", count: 1 });
    });
    return Array.from(map.values());
  }, [makerProjects]);

  const partner = {
    name: summary?.name ?? "Партнёр",
    initials: summary?.initials ?? "—",
    city: summary?.city ?? "",
    category: summary?.technology ?? "Производитель домов",
    about: aboutByMakerId[makerId] ?? `${summary?.name ?? "Партнёр"} — производитель домов.`,
    siteUrl: summary?.siteUrl ?? "#",
  };

  // Плейсхолдер до подключения реальных отзывов.
  const rating = 4.9;
  const reviewsLabel = "новый";

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/catalog");
  };

  const onShare = () => {
    if (navigator.share) navigator.share({ title: partner.name, url: window.location.href });
    else navigator.clipboard.writeText(window.location.href);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 280);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ─── Hero бенто-карточка (общая для mobile/desktop) ─── */
  const Hero = ({ compact = false }: { compact?: boolean }) => (
    <div className="relative overflow-hidden rounded-b-2xl md:rounded-2xl bg-background">
      {/* Размытый фон из первого фото проекта */}
      <div className="absolute inset-0">
        {heroImage ? (
          <>
            <img
              src={heroImage}
              alt=""
              className="w-full h-full object-cover scale-110 blur-2xl opacity-70"
              aria-hidden
            />
            <div className="absolute inset-0 bg-gradient-to-b from-foreground/10 via-foreground/20 to-background" />
          </>
        ) : (
          <div className="w-full h-full bg-secondary" />
        )}
      </div>

      <div className="relative pt-[max(env(safe-area-inset-top),12px)] pb-7 md:pb-10 px-3 md:px-8">
        {/* Top row: back / share */}
        <div className="flex items-center justify-between">
          <button onClick={handleBack} className="w-9 h-9 rounded-xl bg-background/85 backdrop-blur flex items-center justify-center">
            <ArrowLeft className="w-[18px] h-[18px] text-foreground" strokeWidth={1.8} />
          </button>
          <button
            onClick={onShare}
            className="w-9 h-9 rounded-xl bg-background/85 backdrop-blur flex items-center justify-center"
          >
            <img src={shareIcon} alt="" className="w-[18px] h-[18px]" loading="lazy" decoding="async" />
          </button>
        </div>

        {/* Логотип / инициалы */}
        <div className={`mx-auto mt-${compact ? "5" : "8"} md:mt-10 w-[88px] h-[88px] md:w-[104px] md:h-[104px] rounded-2xl bg-background/90 backdrop-blur flex items-center justify-center text-2xl md:text-3xl font-bold text-foreground/80 shadow-[0_8px_30px_-12px_hsl(var(--foreground)/0.25)]`}>
          {partner.initials}
        </div>

        {/* Название */}
        <h1 className="mt-5 text-center text-foreground text-[26px] md:text-[34px] font-bold leading-tight tracking-tight">
          {partner.name}
        </h1>

        {/* Город · технология */}
        <p className="mt-1.5 text-center text-[13px] md:text-[14px] text-foreground/70 inline-flex items-center justify-center gap-1.5 w-full">
          <MapPin className="w-3.5 h-3.5" strokeWidth={1.8} />
          {partner.city}
          <span className="text-foreground/40">·</span>
          {partner.category}
        </p>

        {/* Рейтинг + Follow */}
        <div className="mt-4 flex items-center justify-center gap-3">
          <div className="inline-flex items-center gap-1.5 bg-background/85 backdrop-blur rounded-xl px-3 py-1.5">
            <Star className="w-3.5 h-3.5 fill-foreground text-foreground" strokeWidth={0} />
            <span className="text-[13px] font-semibold text-foreground">{rating.toFixed(1)}</span>
            <span className="text-[12px] text-foreground/60">({reviewsLabel})</span>
          </div>
          <button
            onClick={() => setFollowing((v) => !v)}
            className={`h-9 px-5 rounded-xl text-[13px] font-semibold transition-colors ${
              following
                ? "bg-background/85 backdrop-blur text-foreground"
                : "bg-primary text-primary-foreground"
            }`}
          >
            {following ? "В подписках" : "Подписаться"}
          </button>
        </div>
      </div>
    </div>
  );

  /* ─── Layout ─── */
  return (
    <div className="min-h-screen bg-secondary font-sans pb-[140px] md:pb-10">
      {/* Sticky compact header (mobile) */}
      {isMobile && (
        <div
          className={`fixed top-0 left-0 right-0 z-50 transition-opacity duration-300 ${
            scrolled ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="bg-background px-3 pt-[max(env(safe-area-inset-top),12px)] pb-3 rounded-b-2xl shadow-sm">
            <div className="flex items-center justify-between">
              <button onClick={handleBack} className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
                <ArrowLeft className="w-[18px] h-[18px] text-foreground" strokeWidth={1.8} />
              </button>
              <div className="flex-1 min-w-0 ml-3">
                <div className="text-[14px] font-semibold text-foreground truncate">{partner.name}</div>
                <div className="text-[12px] text-muted-foreground truncate">{partner.category} · {partner.city}</div>
              </div>
              <button onClick={onShare} className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
                <img src={shareIcon} alt="" className="w-[18px] h-[18px]" loading="lazy" decoding="async" />
              </button>
            </div>
          </div>
        </div>
      )}

      {!isMobile && <Header />}

      <div className={`max-w-[1400px] mx-auto ${!isMobile ? "pt-[100px]" : ""}`}>
        {/* Hero */}
        <div className={!isMobile ? "px-3 md:px-3" : ""}>
          <Hero />
        </div>

        {/* "Это ваша компания?" */}
        <div className="px-3 mt-3">
          <div className="bg-background rounded-2xl px-3.5 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <ShieldCheck className="w-[18px] h-[18px] text-muted-foreground shrink-0" strokeWidth={1.8} />
              <span className="text-[13px] text-foreground/80 truncate">Это ваша компания?</span>
            </div>
            <Link to="/messages/support" className="text-[13px] font-medium text-primary inline-flex items-center gap-1 shrink-0">
              Подтвердить <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Бенто: "Проекты" — горизонтальный скролл */}
        {makerProjects.length > 0 && (
          <div className="px-3 mt-3">
            <div className="bg-background rounded-2xl pt-4 pb-4">
              <h2 className="px-4 text-[20px] font-bold text-foreground tracking-tight">Проекты</h2>
              <div className="mt-3 flex gap-2.5 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {makerProjects.map((p) => (
                  <div key={p.id} className="shrink-0 w-[180px] md:w-[220px]">
                    <ProjectCard projectId={p.id} height="aspect-[3/4] h-auto" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Бенто: "По технологии" — горизонтальный скролл плиток */}
        {techGroups.length > 1 && (
          <div className="px-3 mt-3">
            <div className="bg-background rounded-2xl pt-4 pb-4">
              <h2 className="px-4 text-[20px] font-bold text-foreground tracking-tight">По технологии</h2>
              <div className="mt-3 flex gap-2.5 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {techGroups.map((t) => (
                  <div key={t.tech} className="shrink-0 w-[160px]">
                    <div className="aspect-square rounded-2xl overflow-hidden bg-secondary">
                      {t.image && (
                        <img src={t.image} alt={t.tech} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                      )}
                    </div>
                    <div className="mt-2 px-1 text-center text-[13px] font-medium text-foreground">{t.tech}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Бенто: "О компании" */}
        <div className="px-3 mt-3">
          <div className="bg-background rounded-2xl p-4">
            <h2 className="text-[20px] font-bold text-foreground tracking-tight">О компании</h2>
            <p className="mt-2 text-[14px] text-foreground/85 leading-relaxed">{partner.about}</p>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="bg-secondary rounded-xl py-3 text-center">
                <div className="text-[18px] font-bold text-foreground leading-none">{projectsCount}</div>
                <div className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">
                  {wordForm(projectsCount, ["Проект", "Проекта", "Проектов"])}
                </div>
              </div>
              <div className="bg-secondary rounded-xl py-3 text-center">
                <div className="text-[18px] font-bold text-foreground leading-none">{rating.toFixed(1)}</div>
                <div className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">Рейтинг</div>
              </div>
              <div className="bg-secondary rounded-xl py-3 text-center">
                <div className="text-[18px] font-bold text-foreground leading-none">—</div>
                <div className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">Отзывы</div>
              </div>
            </div>

            <p className="mt-3 text-[12px] text-muted-foreground/80 leading-relaxed">
              Все проекты и торговые знаки принадлежат компании {partner.name}. Информация собрана из открытых источников и приведена в ознакомительных целях.
            </p>
          </div>
        </div>

        {/* Бенто: "Все проекты" — сетка */}
        {makerProjects.length > 0 && (
          <div className="px-3 mt-3">
            <div className="bg-background rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-[20px] font-bold text-foreground tracking-tight">Все проекты</h2>
                <button
                  onClick={() => navigate(`/catalog?maker=${makerId}`)}
                  className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center"
                  aria-label="Фильтры"
                >
                  <SlidersHorizontal className="w-[18px] h-[18px] text-foreground" strokeWidth={1.8} />
                </button>
              </div>
              <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-2.5">
                {makerProjects.map((p) => (
                  <ProjectCard key={p.id} projectId={p.id} height="aspect-[3/4] h-auto" />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Bar — go to site CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <div className="bg-background border-t border-border p-3 pb-[calc(0.75rem+max(env(safe-area-inset-bottom),20px))]">
          <div className="max-w-[1400px] mx-auto">
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
    </div>
  );
};

export default Partner;
