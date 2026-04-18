import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Clock, Star, ChevronRight, Play, Send, MessageSquare, Phone, Factory, ShieldCheck, CheckCircle2, Globe } from "lucide-react";
import MobileTabBar from "@/components/MobileTabBar";
import Header from "@/components/Header";
import { useIsMobile } from "@/hooks/use-mobile";
import shareIcon from "@/assets/share-icon.svg";

const projects = [
  { id: 1, name: "Шервуд 72.1", price: "от 4,9 млн ₽", meta: "60 м² · 2 спальни · 1 этаж", gradient: "from-[#8B9B7A] to-[#3D4A30]", badge: "Быстровозводимый" },
  { id: 2, name: "Мидленд 66", price: "от 4,4 млн ₽", meta: "56 м² · 2 спальни · 1 этаж", gradient: "from-[#B8A89A] to-[#6B5B4B]", badge: "Быстровозводимый" },
  { id: 3, name: "Бонд 88", price: "от 5,8 млн ₽", meta: "88 м² · 3 спальни · 1 этаж", gradient: "from-[#7A8B9B] to-[#2B4B5A]" },
  { id: 4, name: "Форест 100", price: "от 6,2 млн ₽", meta: "100 м² · 3 спальни · 2 этажа", gradient: "from-[#C4B49A] to-[#7B6B5A]" },
];

const reviews = [
  { id: 1, name: "Алексей П.", initial: "А", rating: 5, date: "26 сен 25", text: "Без преувеличения и лишней лести оставляю положительный отзыв. Дом построили в срок, качество отличное…", meta: "Построен за 2 месяца" },
  { id: 2, name: "Марина С.", initial: "М", rating: 5, date: "авг 25", text: "Мы долго выбирали застройщика. Дом и ни разу не пожалели. Всё чётко, по договору…", meta: "Построен за 1,5 месяца" },
  { id: 3, name: "Дмитрий К.", initial: "Д", rating: 4, date: "июл 25", text: "Хорошая компания, быстро построили. Небольшие замечания устранили оперативно.", meta: "Построен за 3 месяца" },
];

const builtHomes = [
  { id: 1, gradient: "from-[#8B9B7A] to-[#3D4A30]", hasVideo: true },
  { id: 2, gradient: "from-[#B8A89A] to-[#6B5B4B]", hasVideo: false },
  { id: 3, gradient: "from-[#7A8B9B] to-[#2B4B5A]", hasVideo: false },
];

const Partner = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [aboutExpanded, setAboutExpanded] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
        <div className="pt-[152px] pb-12">
          <div className="max-w-[1400px] mx-auto px-8">

            {/* Banner */}
            <div className="w-full h-[220px] bg-gradient-to-br from-[#2a3528] to-[#111] rounded-2xl relative mb-4">
              <button onClick={() => navigate(-1)} className="absolute top-4 left-4 w-9 h-9 rounded-xl bg-background/80 backdrop-blur flex items-center justify-center">
                <ArrowLeft className="w-[18px] h-[18px] text-foreground" strokeWidth={1.8} />
              </button>
              <button className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-background/80 backdrop-blur flex items-center justify-center" onClick={() => navigator.clipboard.writeText(window.location.href)}>
                <img src={shareIcon} alt="" className="w-5 h-5" />
              </button>
            </div>

            {/* Company info + contact — single bento card */}
            <div className="bg-background rounded-2xl p-6 mb-4">
              <div className="flex gap-6">
                <div className="flex-1 min-w-0">
                  <div className="flex gap-4 mb-4">
                    <div className="w-[72px] h-[72px] rounded-2xl bg-foreground text-background flex items-center justify-center text-lg font-bold shrink-0">SW</div>
                    <div className="flex-1 min-w-0">
                      <h1 className="text-xl font-bold text-foreground leading-tight mb-0.5">ООО «Sherwood Home»</h1>
                      <p className="text-xs text-muted-foreground mb-2">ИНН: 631905302478</p>
                      <div className="flex items-center gap-1.5">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span className="text-base font-bold text-foreground">4.8</span>
                        <span className="text-[13px] text-primary cursor-pointer hover:underline">22 отзыва</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-x-6 gap-y-1.5 mb-4">
                    <div className="flex items-center gap-2 text-[13px] text-muted-foreground"><MapPin className="w-3.5 h-3.5 shrink-0" /><span>Самара, ул. Мичурина, д. 15</span></div>
                    <div className="flex items-center gap-2 text-[13px] text-muted-foreground"><Clock className="w-3.5 h-3.5 shrink-0" /><span>График работы <span className="text-primary">с 10:00 до 19:30</span></span></div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-secondary text-muted-foreground rounded-xl px-3 py-1.5"><Factory className="w-3.5 h-3.5" /> Собственное производство</span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-secondary text-muted-foreground rounded-xl px-3 py-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Эскроу-счёт</span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-secondary text-muted-foreground rounded-xl px-3 py-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> Проверен платформой</span>
                  </div>
                </div>
                <div className="w-[220px] shrink-0 flex flex-col gap-3 justify-center">
                  <a href="https://sherwood-home.ru" target="_blank" rel="noopener noreferrer" className="w-full h-[50px] bg-primary text-primary-foreground rounded-xl text-[15px] font-semibold flex items-center justify-center hover:opacity-90 transition-opacity">Перейти на сайт</a>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-3 mt-5">
                {[{ val: "10 лет", label: "на рынке" }, { val: "500+ домов", label: "построено" }, { val: "16 сделок", label: "за последний год" }, { val: "3 региона", label: "строительства" }].map((s, i) => (
                  <div key={i} className="bg-secondary rounded-xl p-4">
                    <div className="text-lg font-bold text-foreground">{s.val}</div>
                    <div className="text-xs text-muted-foreground">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Full-width content blocks */}
            <div className="flex flex-col gap-4">
              {/* Projects */}
              <div className="bg-background rounded-2xl p-6">
                <h2 className="text-lg font-bold text-foreground mb-4">Проекты домов <span className="text-muted-foreground font-normal text-[15px] ml-1">24</span></h2>
                <div className="grid grid-cols-4 gap-4 mb-4">
                  {projects.map((p) => (
                    <Link key={p.id} to={`/project/${p.id}`} className="group">
                      <div className={`h-[120px] bg-gradient-to-br ${p.gradient} rounded-xl relative overflow-hidden mb-2 group-hover:opacity-90 transition-opacity`}>
                        {p.badge && <div className="absolute top-2 left-2 bg-primary/90 text-primary-foreground text-[10px] font-semibold px-2 py-0.5 rounded-xl">{p.badge}</div>}
                      </div>
                      <div className="text-[13px] font-semibold text-foreground truncate">{p.name}</div>
                      <div className="text-xs text-primary font-medium">{p.price}</div>
                      <div className="text-[11px] text-muted-foreground">{p.meta}</div>
                    </Link>
                  ))}
                </div>
                <button className="w-full h-11 bg-secondary border border-border rounded-xl text-sm font-medium text-muted-foreground flex items-center justify-center gap-1.5 hover:bg-secondary/80 transition-colors">Смотреть все <ChevronRight className="w-4 h-4" /></button>
              </div>

              {/* Two-column: About + Regions */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-background rounded-2xl p-6">
                  <h2 className="text-lg font-bold text-foreground mb-3">О подрядчике</h2>
                  <p className={`text-sm text-muted-foreground leading-relaxed ${!aboutExpanded ? 'line-clamp-6' : ''}`}>
                    Наша компания занимается модульным домостроительством с 2015 года. Собственное производство в Самарской области, собственные строительные бригады. Даём 5 лет гарантии на конструктив. Работаем с качественными материалами: каркас из сухой строганой доски камерной сушки, утеплитель KNAUF. Аккредитованы в банках: Сбер, ВТБ, Альфа-банк. Осуществляем поддержку на всех этапах кредитования.
                  </p>
                  <button onClick={() => setAboutExpanded(!aboutExpanded)} className="text-[13px] text-primary mt-2 hover:underline">{aboutExpanded ? 'Свернуть' : 'Показать полностью'}</button>
                </div>
                <div className="bg-background rounded-2xl p-6">
                  <h2 className="text-lg font-bold text-foreground mb-3">Регионы строительства</h2>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {["Московская область", "Самарская область", "Нижегородская обл.", "Казань и РТ"].map((r, i) => (
                      <span key={i} className="text-xs font-medium bg-secondary text-muted-foreground rounded-xl px-3 py-1.5">{r}</span>
                    ))}
                  </div>
                  <h2 className="text-lg font-bold text-foreground mb-3">Технологии строительства</h2>
                  <div className="flex flex-wrap gap-2">
                    {["Модульный дом", "Каркасный дом", "Панельно-каркасный"].map((t, i) => (
                      <span key={i} className="text-xs font-medium bg-secondary text-muted-foreground rounded-xl px-3 py-1.5">{t}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Built homes */}
              <div className="bg-background rounded-2xl p-6">
                <h2 className="text-lg font-bold text-foreground mb-4">Построенные дома</h2>
                <div className="grid grid-cols-3 gap-4">
                  {builtHomes.map((h, i) => (
                    <div key={h.id} className="rounded-xl overflow-hidden relative cursor-pointer group">
                      <div className={`h-[180px] bg-gradient-to-br ${h.gradient} flex items-center justify-center relative group-hover:opacity-90 transition-opacity`}>
                        {h.hasVideo && <div className="absolute w-12 h-12 bg-background/90 rounded-full flex items-center justify-center"><Play className="w-5 h-5 text-foreground ml-0.5" /></div>}
                        <div className="absolute bottom-2.5 left-2.5 bg-foreground/50 text-primary-foreground text-xs px-2 py-0.5 rounded-xl">{i + 1} из 105</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Showroom */}
              <div className="bg-background rounded-2xl p-6">
                <h2 className="text-lg font-bold text-foreground mb-4">Выставочные дома</h2>
                <div className="border border-border rounded-xl overflow-hidden flex">
                  <div className="w-[300px] h-[200px] bg-gradient-to-br from-[#2a3528] to-[#111] shrink-0" />
                  <div className="p-5 flex flex-col justify-center">
                    <div className="text-[15px] font-semibold text-foreground mb-1.5">Барнхаус «ДБХ-12» 6x8 с лофтом</div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4"><MapPin className="w-3 h-3 shrink-0" />Москва, Каширское шоссе, вл63 к1 ст68</div>
                    <button className="h-10 bg-secondary border border-border rounded-xl text-[13px] font-medium text-foreground px-6 hover:bg-secondary/80 transition-colors w-fit">Записаться на просмотр</button>
                  </div>
                </div>
              </div>

              {/* Reviews */}
              <div className="bg-background rounded-2xl p-6">
                <h2 className="text-lg font-bold text-foreground mb-4">Отзывы о подрядчике <span className="text-muted-foreground font-normal text-[15px] ml-1">22</span></h2>
                <div className="flex items-center gap-6 mb-6">
                  <div className="text-[44px] font-bold text-foreground leading-none">4.8</div>
                  <div className="flex-1 max-w-[300px]">
                    {[{ star: 5, pct: 85, cnt: 11 }, { star: 4, pct: 15, cnt: 2 }, { star: 3, pct: 0, cnt: 0 }, { star: 2, pct: 0, cnt: 0 }, { star: 1, pct: 0, cnt: 0 }].map((r) => (
                      <div key={r.star} className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[11px] text-muted-foreground w-2 text-right">{r.star}</span>
                        <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden"><div className="h-full bg-amber-400 rounded-full" style={{ width: `${r.pct}%` }} /></div>
                        <span className="text-[11px] text-muted-foreground w-4 text-right">{r.cnt}</span>
                      </div>
                    ))}
                    <div className="text-[11px] text-muted-foreground mt-1">На основе 13 отзывов покупателей</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-5">
                  {reviews.map((r) => (
                    <div key={r.id} className="bg-secondary rounded-xl p-4">
                      <div className="flex items-center gap-2.5 mb-2.5">
                        <div className="w-9 h-9 rounded-xl bg-foreground text-background text-xs font-semibold flex items-center justify-center shrink-0">{r.initial}</div>
                        <div>
                          <div className="text-[13px] font-semibold text-foreground">{r.name} <span className="text-amber-400">★ {r.rating}.0</span></div>
                          <div className="text-[11px] text-muted-foreground">Построено · {r.date}</div>
                        </div>
                      </div>
                      <p className="text-[13px] text-muted-foreground leading-snug line-clamp-3 mb-1.5">{r.text}</p>
                      <button className="text-xs text-primary hover:underline">Показать полностью</button>
                      <div className="text-[11px] text-muted-foreground mt-2">{r.meta}</div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button className="flex-1 h-11 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">Оставить отзыв</button>
                  <button className="flex-1 h-11 bg-secondary border border-border rounded-xl text-sm font-medium text-foreground hover:bg-secondary/80 transition-colors">Смотреть все отзывы (22)</button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  /* ─── Mobile (unchanged) ─── */
  return (
    <div className="min-h-screen bg-secondary">
      {/* Sticky bento header on scroll */}
      <div className={`fixed top-0 left-0 right-0 z-50 transition-opacity duration-300 ${scrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="bg-background px-3 pt-[max(env(safe-area-inset-top),12px)] pb-3 rounded-b-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
              <ArrowLeft className="w-[18px] h-[18px] text-foreground" strokeWidth={1.8} />
            </button>
            <div className="flex-1 min-w-0 ml-3">
              <div className="text-[14px] font-semibold text-foreground truncate">Sherwood Home</div>
              <div className="flex items-center gap-1 text-[12px] text-muted-foreground">
                <ShieldCheck className="w-3 h-3" strokeWidth={2} />
                <span>Не верифицирован</span>
              </div>
            </div>
            <button
              className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center"
              onClick={() => { if (navigator.share) { navigator.share({ title: 'Партнёр', url: window.location.href }); } else { navigator.clipboard.writeText(window.location.href); } }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 100 103" fill="hsl(var(--foreground) / 0.8)" stroke="hsl(var(--foreground) / 0.8)" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round">
                <path d="M53 20 L84 50 L53 80 L53 65 C30 65 15 75 10 93 C10 68 15 38 53 33 Z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Header */}
      <div className={`fixed top-0 left-0 right-0 z-40 px-3 pt-3 pb-2 flex justify-between items-center transition-opacity duration-300 ${scrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-background flex items-center justify-center shadow-sm">
          <ArrowLeft className="w-[18px] h-[18px] text-foreground" strokeWidth={1.8} />
        </button>
        <button
          className="w-9 h-9 rounded-xl bg-background flex items-center justify-center shadow-sm"
          onClick={() => { if (navigator.share) { navigator.share({ title: 'Партнёр', url: window.location.href }); } else { navigator.clipboard.writeText(window.location.href); } }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 100 103" fill="hsl(var(--foreground) / 0.8)" stroke="hsl(var(--foreground) / 0.8)" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round">
            <path d="M53 20 L84 50 L53 80 L53 65 C30 65 15 75 10 93 C10 68 15 38 53 33 Z" />
          </svg>
        </button>
      </div>

      {/* Header Banner */}
      <div className="w-full h-[200px] bg-gradient-to-br from-[#2a3528] to-[#111]" />

      {/* Main Info Card — empty state */}
      <div className="bg-background rounded-t-2xl -mt-4 relative z-10">
        <div className="p-4">
          <div className="flex gap-3 mb-4">
            <div className="w-[72px] h-[72px] rounded-2xl bg-secondary text-foreground/40 flex items-center justify-center text-lg font-bold shrink-0">SW</div>
            <div className="flex-1 min-w-0">
              <h1 className="text-[17px] font-bold text-foreground leading-tight mb-1">Sherwood Home</h1>
              <p className="text-xs text-muted-foreground mb-2">Карточка компании ещё не заполнена</p>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-medium bg-secondary text-muted-foreground rounded-full px-2.5 py-1">
                <ShieldCheck className="w-3 h-3" />
                <span>Не верифицирован</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Empty state hero */}
      <div className="bg-background rounded-2xl mt-2 px-4 py-8">
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-3xl bg-secondary flex items-center justify-center mb-4">
            <ShieldCheck className="w-10 h-10 text-foreground/30" strokeWidth={1.5} />
          </div>
          <h2 className="text-[18px] font-bold text-foreground mb-1.5">Недостаточно данных</h2>
          <p className="text-[13px] text-muted-foreground leading-snug max-w-[280px] mb-6">
            Компания пока не прошла верификацию. После проверки здесь появятся проекты, отзывы, контакты и реквизиты.
          </p>

          <div className="w-full bg-secondary rounded-2xl p-4 mb-2">
            <p className="text-[13px] font-semibold text-foreground mb-3 text-left">После верификации появится:</p>
            <ul className="flex flex-col gap-2.5 text-left">
              {[
                "Проекты домов и галерея работ",
                "Реквизиты, ИНН и адрес офиса",
                "Отзывы клиентов и рейтинг",
                "Контакты и приём заявок",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-[13px] text-foreground/80">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-px shrink-0" strokeWidth={2} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Owner CTA */}
      <div className="bg-background rounded-2xl mt-2 p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Factory className="w-5 h-5 text-primary" strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-semibold text-foreground mb-0.5">Это ваша компания?</p>
            <p className="text-[12px] text-muted-foreground leading-snug">
              Подтвердите владение, заполните профиль и добавьте проекты — карточка станет публичной.
            </p>
          </div>
        </div>
      </div>

      <div className="h-28" />

      {/* Bottom Bar — verification CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="bg-background border-t border-border p-3 pb-[calc(0.75rem+max(env(safe-area-inset-bottom),20px))]">
          <button
            onClick={() => navigate("/partner-landing")}
            className="w-full h-[50px] bg-primary text-primary-foreground rounded-xl text-[15px] font-semibold flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-[18px] h-[18px]" strokeWidth={2} />
            Пройти верификацию
          </button>
        </div>
      </div>
    </div>
  );
};

export default Partner;
