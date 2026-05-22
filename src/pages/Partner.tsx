import { useState, useEffect, useMemo } from "react";
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

  const isPlatforma = makerId === "platforma";

  const HeroPlatforma = () => (
    <div className="relative overflow-hidden rounded-b-2xl md:rounded-2xl bg-background min-h-[78vh] md:min-h-[620px] flex flex-col">
      {/* Резкое фото на весь hero */}
      <div className="absolute inset-0">
        {heroImage ? (
          <img src={heroImage} alt="" className="w-full h-full object-cover" aria-hidden loading="eager" />
        ) : (
          <div className="w-full h-full bg-secondary" />
        )}
      </div>

      {/* Плавный градиентный блюр снизу — стопка слоёв с плавными масками */}
      {heroImage && (
        <div className="absolute inset-x-0 bottom-0 h-[55%] pointer-events-none">
          {[
            { b: 2, from: 0, to: 20 },
            { b: 6, from: 15, to: 40 },
            { b: 14, from: 35, to: 60 },
            { b: 28, from: 55, to: 80 },
          ].map(({ b, from, to }) => (
            <div
              key={b}
              className="absolute inset-0"
              style={{
                backdropFilter: `blur(${b}px)`,
                WebkitBackdropFilter: `blur(${b}px)`,
                maskImage: `linear-gradient(to bottom, transparent ${from}%, black ${to}%)`,
                WebkitMaskImage: `linear-gradient(to bottom, transparent ${from}%, black ${to}%)`,
              }}
            />
          ))}
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to bottom, transparent 30%, hsl(var(--foreground) / 0.4) 100%)" }}
          />
        </div>
      )}



      {/* Top row: back + follow + share */}
      <div className="relative flex items-center justify-between px-3 md:px-8 pt-[max(env(safe-area-inset-top),12px)]">
        <button onClick={handleBack} className="w-10 h-10 rounded-xl bg-background/25 backdrop-blur-md flex items-center justify-center" aria-label="Назад">
          <ArrowLeft className="w-[18px] h-[18px] text-background" strokeWidth={1.8} />
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFollowing((v) => !v)}
            className={`h-10 px-5 rounded-xl text-[14px] font-semibold transition-colors backdrop-blur-md ${
              following ? "bg-background text-foreground" : "bg-background/25 text-background"
            }`}
          >
            {following ? "В подписках" : "Подписаться"}
          </button>
          <button onClick={onShare} className="w-10 h-10 rounded-xl bg-background/25 backdrop-blur-md flex items-center justify-center" aria-label="Поделиться">
            <img src={shareIcon} alt="" className="w-[18px] h-[18px] invert" loading="lazy" decoding="async" />
          </button>
        </div>
      </div>

      {/* Текст на блюр-плашке (нижняя 1/3) */}
      <div className="relative mt-auto h-1/3 flex flex-col items-center justify-center px-5 text-center">
        <h1 className="text-background leading-[1.05] tracking-tight font-bold uppercase text-[clamp(32px,9vw,52px)]">
          {partner.name}
        </h1>
        <div className="mt-3 inline-flex items-center gap-1.5 text-[14px] text-background/90">
          <span className="font-semibold">{rating.toFixed(1)}</span>
          <Star className="w-3.5 h-3.5 fill-background text-background" strokeWidth={0} />
          <span className="text-background/70">({reviewsLabel})</span>
        </div>
        <div className="mt-1.5 text-[12px] text-background/70 inline-flex items-center justify-center gap-1.5 w-full">
          <MapPin className="w-3 h-3" strokeWidth={1.8} />
          {partner.city}
          <span className="text-background/40">·</span>
          {partner.category}
        </div>
      </div>
    </div>
  );

  const HeroDefault = () => (
    <div className="relative overflow-hidden rounded-b-2xl md:rounded-2xl bg-background min-h-[420px] md:min-h-[480px] flex flex-col">
      <div className="absolute inset-0">
        {heroImage ? (
          <>
            <img src={heroImage} alt="" className="w-full h-full object-cover" aria-hidden loading="eager" />
            <div className="absolute inset-0 bg-gradient-to-b from-foreground/30 via-transparent to-background/95" />
          </>
        ) : (
          <div className="w-full h-full bg-secondary" />
        )}
      </div>

      <div className="relative flex items-center justify-between px-3 md:px-8 pt-[max(env(safe-area-inset-top),12px)]">
        <button onClick={handleBack} className="w-9 h-9 rounded-xl bg-background/90 backdrop-blur flex items-center justify-center">
          <ArrowLeft className="w-[18px] h-[18px] text-foreground" strokeWidth={1.8} />
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFollowing((v) => !v)}
            className={`h-9 px-4 rounded-xl text-[13px] font-semibold transition-colors ${
              following ? "bg-background/90 backdrop-blur text-foreground" : "bg-foreground text-background"
            }`}
          >
            {following ? "В подписках" : "Подписаться"}
          </button>
          <button onClick={onShare} className="w-9 h-9 rounded-xl bg-background/90 backdrop-blur flex items-center justify-center">
            <img src={shareIcon} alt="" className="w-[18px] h-[18px]" loading="lazy" decoding="async" />
          </button>
        </div>
      </div>

      <div className="relative mt-auto px-3 md:px-8 pb-7 md:pb-10 text-center">
        <h1 className="text-foreground text-[34px] md:text-[44px] font-bold leading-[1.05] tracking-tight">{partner.name}</h1>
        <p className="mt-2 text-[13px] md:text-[14px] text-foreground/70 inline-flex items-center justify-center gap-1.5 w-full">
          <MapPin className="w-3.5 h-3.5" strokeWidth={1.8} />
          {partner.city}
          <span className="text-foreground/40">·</span>
          {partner.category}
        </p>
        <div className="mt-3 inline-flex items-center gap-1.5 text-[13px] text-foreground/80">
          <Star className="w-3.5 h-3.5 fill-foreground text-foreground" strokeWidth={0} />
          <span className="font-semibold">{rating.toFixed(1)}</span>
          <span className="text-foreground/60">({reviewsLabel})</span>
        </div>
      </div>
    </div>
  );

  const Hero = isPlatforma ? HeroPlatforma : HeroDefault;

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

        {/* Бенто: "Популярные" — горизонтальный скролл крупных карточек */}
        {isPlatforma && makerProjects.length > 0 && (
          <div className="px-3 mt-3">
            <div className="bg-background rounded-2xl pt-5 pb-5">
              <h2 className="px-4 text-[22px] font-bold text-foreground tracking-tight">Популярные</h2>
              <div className="mt-3 flex gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {makerProjects.map((p) => (
                  <div key={p.id} className="shrink-0 w-[235px] md:w-[260px]">
                    <ProjectCard projectId={p.id} height="aspect-square h-auto" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Бенто: "По категориям" — плитки с подписью под фото */}
        {(() => {
          const groups = new Map<string, { label: string; image: string; count: number }>();
          makerProjects.forEach((p) => {
            const label = p.badge || "—";
            const existing = groups.get(label);
            if (existing) existing.count += 1;
            else groups.set(label, { label, image: p.gallery[0]?.image ?? "", count: 1 });
          });
          const arr = Array.from(groups.values());
          if (arr.length < 2) return null;
          return (
            <div className="px-3 mt-3">
              <div className="bg-background rounded-2xl pt-5 pb-5">
                <h2 className="px-4 text-[22px] font-bold text-foreground tracking-tight">По категориям</h2>
                <div className="mt-3 flex gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {arr.map((g) => (
                    <button
                      key={g.label}
                      onClick={() => navigate(`/catalog?maker=${makerId}&badge=${encodeURIComponent(g.label)}`)}
                      className="shrink-0 w-[200px] text-left"
                    >
                      <div className="aspect-square rounded-2xl overflow-hidden bg-secondary">
                        {g.image && <img src={g.image} alt={g.label} className="w-full h-full object-cover" loading="lazy" decoding="async" />}
                      </div>
                      <div className="mt-2.5 text-center text-[15px] font-semibold text-foreground">{g.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}

        {/* Бенто: "Хиты продаж" — большое фото-бенто с карточками внизу */}
        {isPlatforma && makerProjects.length >= 2 && (() => {
          const bgImage = makerProjects[1]?.gallery[0]?.image ?? heroImage;
          const cards = makerProjects.slice(0, 3);
          return (
            <div className="px-3 mt-3">
              <div className="relative overflow-hidden rounded-2xl bg-background min-h-[460px] flex flex-col">
                <div className="absolute inset-0">
                  <img src={bgImage} alt="" className="w-full h-full object-cover" aria-hidden loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/40" />
                </div>
                <h2 className="relative px-5 pt-5 text-[22px] font-bold text-foreground tracking-tight drop-shadow-[0_1px_2px_rgba(255,255,255,0.6)]">
                  Хиты продаж
                </h2>
                <div className="relative mt-auto flex gap-3 overflow-x-auto px-4 pt-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {cards.map((p) => (
                    <div key={p.id} className="shrink-0 w-[200px]">
                      <ProjectCard projectId={p.id} height="aspect-square h-auto" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}

        {/* Бенто: "По технологии" — плитки с подписью под фото */}
        {techGroups.length > 1 && (
          <div className="px-3 mt-3">
            <div className="bg-background rounded-2xl pt-5 pb-5">
              <h2 className="px-4 text-[22px] font-bold text-foreground tracking-tight">По технологии</h2>
              <div className="mt-3 flex gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {techGroups.map((t) => (
                  <div key={t.tech} className="shrink-0 w-[200px]">
                    <div className="aspect-square rounded-2xl overflow-hidden bg-secondary">
                      {t.image && (
                        <img src={t.image} alt={t.tech} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                      )}
                    </div>
                    <div className="mt-2.5 text-center text-[15px] font-semibold text-foreground">{t.tech}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* "Все проекты" — заголовок + фильтр + 2-кол сетка (без бенто-обёртки, как в референсе) */}
        {makerProjects.length > 0 && (
          <div className="px-3 mt-5">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-[24px] font-bold text-foreground tracking-tight">Все проекты</h2>
              <button
                onClick={() => navigate(`/catalog?maker=${makerId}`)}
                className="w-10 h-10 rounded-xl bg-background flex items-center justify-center"
                aria-label="Фильтры"
              >
                <SlidersHorizontal className="w-[18px] h-[18px] text-foreground" strokeWidth={1.8} />
              </button>
            </div>
            <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-2.5">
              {makerProjects.map((p) => (
                <div key={p.id} className="bg-background rounded-2xl p-2">
                  <ProjectCard projectId={p.id} height="aspect-square h-auto" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Бенто: "О компании" */}
        <div className="px-3 mt-3">
          <div className="bg-background rounded-2xl p-4">
            <h2 className="text-[20px] font-bold text-foreground tracking-tight">О компании</h2>
            <p className="mt-2 text-[14px] text-foreground/85 leading-relaxed">{partner.about}</p>
            <p className="mt-3 text-[12px] text-muted-foreground/80 leading-relaxed">
              Все проекты и торговые знаки принадлежат компании {partner.name}. Информация собрана из открытых источников и приведена в ознакомительных целях.
            </p>
          </div>
        </div>

        {/* "Это ваша компания?" — внизу, ближе к CTA */}
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
