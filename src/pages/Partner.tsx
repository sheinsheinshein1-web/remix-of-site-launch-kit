import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, ChevronRight, ShieldCheck, Star, ArrowUpDown, MapPin, Menu } from "lucide-react";
import Header from "@/components/Header";
import { useIsMobile } from "@/hooks/use-mobile";
import shareIcon from "@/assets/share-icon.svg";
import ProjectCard from "@/components/ProjectCard";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
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
  const [sortOpen, setSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState("rating");

  const sortOptions = [
    { value: "rating", label: "С высоким рейтингом" },
    { value: "popular", label: "Популярные" },
    { value: "new", label: "Новинки" },
    { value: "cheap", label: "Дешевле" },
    { value: "expensive", label: "Дороже" },
    { value: "area_asc", label: "По площади м², от меньшего" },
    { value: "area_desc", label: "По площади м², от большего" },
    { value: "fast", label: "Быстрый монтаж" },
  ];

  const priceNum = (s: string) => parseInt(String(s).replace(/\D/g, ""), 10) || 0;
  const areaNum = (s: string) => parseFloat(String(s).replace(/[^\d.]/g, "")) || 0;
  const termNum = (s: string) => parseInt(String(s).replace(/\D/g, ""), 10) || 0;

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

  const sortedMakerProjects = useMemo(() => {
    const arr = [...makerProjects];
    arr.sort((a: any, b: any) => {
      switch (sortBy) {
        case "cheap": return priceNum(a.price) - priceNum(b.price);
        case "expensive": return priceNum(b.price) - priceNum(a.price);
        case "area_asc": return areaNum(a.area) - areaNum(b.area);
        case "area_desc": return areaNum(b.area) - areaNum(a.area);
        case "fast": return termNum(a.term) - termNum(b.term);
        case "popular": return (b.likes ?? 0) - (a.likes ?? 0);
        case "new": return (b.id ?? 0) - (a.id ?? 0);
        case "rating": return (b.rating ?? 0) - (a.rating ?? 0);
        default: return 0;
      }
    });
    return arr;
  }, [makerProjects, sortBy]);

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
    <div className="relative overflow-hidden md:rounded-2xl min-h-[62vh] md:min-h-[500px] flex flex-col">
      {/* Резкое фото на весь hero, к низу маскируется (открывается фон страницы) */}
      <div className="absolute inset-0">
        {heroImage ? (
          <img
            src={heroImage}
            alt=""
            className="w-full h-full object-cover"
            aria-hidden
            loading="eager"
            style={{
              WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 50%, transparent 92%)",
              maskImage: "linear-gradient(to bottom, black 0%, black 50%, transparent 92%)",
            }}
          />
        ) : (
          <div className="w-full h-full" />
        )}
      </div>

      {/* Плавный градиент к цвету фона страницы — для читаемости и бесшовного перехода */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent 35%, hsl(25, 14%, 16% / 0.55) 65%, hsl(25, 14%, 16%) 100%)" }}
      />





      {/* Top row: back + share + menu */}
      <div className="relative flex items-center justify-between px-3 md:px-8 pt-[max(env(safe-area-inset-top),12px)]">
        <button onClick={handleBack} className="w-10 h-10 rounded-xl bg-black/35 backdrop-blur-md flex items-center justify-center" aria-label="Назад">
          <ArrowLeft className="w-[18px] h-[18px] text-white" strokeWidth={1.8} />
        </button>
        <div className="flex items-center gap-2">
          <button onClick={onShare} className="w-10 h-10 rounded-xl bg-black/35 backdrop-blur-md flex items-center justify-center" aria-label="Поделиться">
            <img src={shareIcon} alt="" className="w-[18px] h-[18px]" style={{ filter: "brightness(0) invert(1)" }} loading="lazy" decoding="async" />
          </button>
          <button className="w-10 h-10 rounded-xl bg-black/35 backdrop-blur-md flex items-center justify-center" aria-label="Меню">
            <Menu className="w-[18px] h-[18px] text-white" strokeWidth={1.8} />
          </button>
        </div>
      </div>

      {/* Текст на блюр-плашке (нижняя 1/3) */}
      <div className="relative mt-auto mb-[15%] h-1/3 flex flex-col items-center justify-center px-5 text-center">
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
    <div className="bg-background rounded-b-2xl md:rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-4 md:px-6 pt-[max(env(safe-area-inset-top),12px)] md:pt-6">
        <button onClick={handleBack} className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
          <ArrowLeft className="w-[18px] h-[18px] text-foreground" strokeWidth={1.8} />
        </button>
        <button onClick={onShare} className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center" aria-label="Поделиться">
          <img src={shareIcon} alt="" className="w-[18px] h-[18px]" loading="lazy" decoding="async" />
        </button>
      </div>

      <div className="px-4 md:px-6 mt-4">
        <div className="bg-secondary rounded-xl px-3.5 md:px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <ShieldCheck className="w-[18px] h-[18px] text-muted-foreground shrink-0" strokeWidth={1.8} />
            <span className="text-[13px] md:text-[14px] text-foreground/80 truncate">Это ваша компания?</span>
          </div>
          <Link to="/messages/support" className="text-[13px] md:text-[14px] font-medium text-primary inline-flex items-center gap-1 shrink-0">
            Подтвердить <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </Link>
        </div>
      </div>

      <div className="px-4 md:px-6 pt-4 md:pt-5 pb-5 md:pb-6 flex items-center gap-3 md:gap-4">
        <div className="w-[68px] h-[68px] md:w-[80px] md:h-[80px] rounded-2xl bg-secondary text-foreground/30 flex items-center justify-center text-base md:text-lg font-bold shrink-0">{partner.initials}</div>
        <div className="flex-1 min-w-0">
          <h1 className="text-[19px] md:text-[22px] font-bold text-foreground leading-tight mb-0.5 md:mb-1 truncate">{partner.name}</h1>
          <p className="text-[13px] md:text-[14px] text-muted-foreground truncate">{partner.category} · {partner.city}</p>
        </div>
      </div>

      <div className="border-t border-border grid grid-cols-3">
        {[{ val: String(projectsCount), label: wordForm(projectsCount, ["Проект", "Проекта", "Проектов"]) }, { val: "—", label: "Отзывы" }, { val: "—", label: "Рейтинг" }].map((s, i) => (
          <div key={s.label} className={`py-4 md:py-5 text-center ${i > 0 ? "border-l border-border" : ""}`}>
            <div className="text-[20px] md:text-[22px] font-bold text-foreground leading-none mb-1.5">{s.val}</div>
            <div className="text-[11px] font-medium tracking-wider uppercase text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="border-t border-border px-4 md:px-6 py-4 md:py-5">
        <p className="text-[11px] font-medium tracking-wider uppercase text-muted-foreground mb-2">О компании</p>
        <p className="text-[14px] md:text-[15px] text-foreground/85 leading-relaxed">{partner.about}</p>
        <p className="mt-3 text-[12px] text-muted-foreground/80 leading-relaxed">
          Все проекты и торговые знаки принадлежат компании {partner.name}. Информация собрана из открытых источников и приведена в ознакомительных целях.
        </p>
      </div>
    </div>
  );

  const Hero = isPlatforma ? HeroPlatforma : HeroDefault;

  /* ─── Layout ─── */
  return (
    <div
      className={`relative min-h-screen font-sans pb-[140px] md:pb-10 ${isPlatforma ? "" : "bg-secondary"}`}
      style={isPlatforma ? { backgroundColor: "hsl(25, 14%, 16%)" } : undefined}
    >

      {/* Sticky compact header (mobile) */}
      {isMobile && (
        <div
          className={`fixed top-0 left-0 right-0 z-50 transition-opacity duration-300 ${
            scrolled ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div
            className="px-3 pt-[max(env(safe-area-inset-top),10px)] pb-2 border-b border-white/10"
            style={{
              background: "hsl(0 0% 0% / 0.45)",
              backdropFilter: "blur(18px) saturate(140%)",
              WebkitBackdropFilter: "blur(18px) saturate(140%)",
            }}
          >
            <div className="flex items-center justify-between gap-2">
              <button onClick={handleBack} className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0" aria-label="Назад">
                <ArrowLeft className="w-[18px] h-[18px] text-white" strokeWidth={1.8} />
              </button>
              <div className="flex-1 min-w-0 px-1">
                <div className="text-[15px] font-semibold text-white truncate leading-tight">{partner.name}</div>
                <div className="text-[12px] text-white/70 truncate">{partner.category} · {partner.city}</div>
              </div>
              <button onClick={onShare} className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0" aria-label="Поделиться">
                <img src={shareIcon} alt="" className="w-[18px] h-[18px]" style={{ filter: "brightness(0) invert(1)" }} loading="lazy" decoding="async" />
              </button>
              <button className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0" aria-label="Меню">
                <Menu className="w-[18px] h-[18px] text-white" strokeWidth={1.8} />
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
            <div
              className="rounded-2xl pt-5 pb-5"
              style={{ background: "hsl(28, 12%, 24%)", ["--foreground" as any]: "0 0% 100%" }}
            >
              <h2 className="px-4 text-[22px] font-bold text-background tracking-tight">Популярные</h2>
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

        {/* Бенто: "По категориям" — только Платформа */}
        {isPlatforma && (() => {
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
              <div
                className="relative overflow-hidden rounded-2xl bg-background min-h-[460px] flex flex-col"
                style={{ ["--foreground" as any]: "0 0% 100%" }}
              >
                <div className="absolute inset-0">
                  <img src={bgImage} alt="" className="w-full h-full object-cover" aria-hidden loading="lazy" />
                  {/* Тёмный градиент от середины плашки */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: "linear-gradient(to bottom, hsl(0 0% 0% / 0.05) 0%, hsl(0 0% 0% / 0.25) 40%, hsl(0 0% 0% / 0.5) 70%, hsl(0 0% 0% / 0.65) 100%)",
                    }}
                  />
                </div>

                <h2 className="relative px-5 pt-5 text-[22px] font-bold text-background tracking-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]">
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

        {/* "Все проекты" — только Платформа */}
        {isPlatforma && makerProjects.length > 0 && (
          <div className="px-3 mt-5">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-[24px] font-bold tracking-tight text-background">Все проекты</h2>
              <button
                onClick={() => setSortOpen(true)}
                className="w-10 h-10 rounded-xl backdrop-blur-md flex items-center justify-center bg-background/25"
                aria-label="Сортировка"
              >
                <ArrowUpDown className="w-[18px] h-[18px] text-background" strokeWidth={2.2} />
              </button>
            </div>
            <div
              className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-2.5"
              style={{ ["--foreground" as any]: "0 0% 100%" }}
            >
              {sortedMakerProjects.map((p) => (
                <ProjectCard key={p.id} projectId={p.id} />
              ))}
            </div>
          </div>
        )}


      </div>

      {/* Sort Drawer — как в каталоге */}
      <Drawer open={sortOpen} onOpenChange={setSortOpen}>
        <DrawerContent className="mx-0 rounded-t-[20px] p-0">
          <div className="px-5 pt-5 pb-2">
            <h3 className="text-[20px] font-semibold text-foreground">Показать сначала</h3>
          </div>
          <div className="bg-secondary rounded-xl mx-4 mb-6 divide-y divide-border/50">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => { setSortBy(option.value); setSortOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-4 text-left"
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${sortBy === option.value ? "border-primary" : "border-muted-foreground/30"}`}>
                  {sortBy === option.value && <div className="w-3 h-3 rounded-full bg-primary" />}
                </div>
                <span className="text-[16px] text-foreground">{option.label}</span>
              </button>
            ))}
          </div>
        </DrawerContent>
      </Drawer>


      {/* Bottom Bar — go to site CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <div
          className="border-t border-white/10 p-3 pb-[calc(0.75rem+max(env(safe-area-inset-bottom),20px))]"
          style={{
            background: isPlatforma ? "hsl(0 0% 0% / 0.45)" : undefined,
            backdropFilter: isPlatforma ? "blur(18px) saturate(140%)" : undefined,
            WebkitBackdropFilter: isPlatforma ? "blur(18px) saturate(140%)" : undefined,
          }}
        >
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
