import { useNavigate } from "react-router-dom";
import { ShieldCheck, TrendingUp, LayoutGrid, Sparkles, MapPin, Search, Check, Star } from "lucide-react";
import Header from "@/components/Header";
import PartnerApplicationForm from "@/components/PartnerApplicationForm";
import Footer from "@/components/Footer";
import PartnerDrawer from "@/components/PartnerDrawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";
import partnerHeroImg from "@/assets/partner-hero-illustration.png";
import Seo from "@/components/Seo";

const features = [
  { icon: ShieldCheck, title: "Бейдж «Проверено»", desc: "На карточке компании и на каждом проекте. Покупатели отличают вас от непроверенных." },
  { icon: TrendingUp, title: "Приоритет в выдаче", desc: "Ваши проекты показываются выше в ленте каталога и в поиске по региону." },
  { icon: LayoutGrid, title: "Страница компании", desc: "Описание, контакты, портфолио, галерея работ, отзывы клиентов и рейтинг." },
  { icon: Sparkles, title: "Оформление карточек", desc: "Единый стиль и аккуратная типографика. Бренд выглядит достойно среди коллег." },
  { icon: MapPin, title: "География работ", desc: "Указываете регионы — ваши проекты видят жители этих регионов первыми." },
  { icon: Search, title: "Индексация в поиске", desc: "Страница компании попадает в поисковую выдачу. Приходят покупатели, ищущие именно вас." },
];

type Plan = {
  name: string;
  price: string;
  priceHint: string;
  period: string;
  features: string[];
  popular?: boolean;
};

const plans: Plan[] = [
  {
    name: "База",
    price: "19 000 ₽",
    priceHint: "от",
    period: "на 3 месяца",
    features: ["Бейдж «Проверено»", "До 5 проектов в каталоге", "2 региона работы", "Страница с отзывами"],
  },
  {
    name: "Рост",
    price: "39 000 ₽",
    priceHint: "от",
    period: "на 3 месяца",
    popular: true,
    features: ["Всё из «Базы»", "Приоритет в выдаче", "До 20 проектов", "5 регионов работы", "Фото и тексты от редакции"],
  },
  {
    name: "Макс",
    price: "79 000 ₽",
    priceHint: "от",
    period: "на 3 месяца",
    features: [
      "Всё из «Роста»",
      "Топ выдачи в регионе",
      "Без лимита по проектам",
      "Персональный сайт компании",
      "Персональный менеджер",
    ],
  },
];

const steps = [
  { num: "01", title: "Оставляете заявку", desc: "Контакты, ИНН и ссылка на сайт — чтобы мы поняли, с кем работаем." },
  { num: "02", title: "Мы проверяем вручную", desc: "Сверяем реквизиты, связываемся с вами, обсуждаем формат размещения." },
  { num: "03", title: "Запускаем витрину", desc: "Оплата, оформление страницы, бейдж «Проверено». Можно работать." },
];

const PartnerLanding = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (isMobile) setDrawerOpen(true);
  }, [isMobile]);

  const handleDrawerChange = (open: boolean) => {
    setDrawerOpen(open);
    if (!open && isMobile) navigate(-1);
  };

  const handleStartChat = () => setShowForm(true);

  if (isMobile) {
    return (
      <>
        <Seo title="Стать партнёром — многоместа.рф" description="Размещайте проекты модульных и префаб домов на маркетплейсе многоместа.рф." canonicalPath="/partner" />
        <PartnerDrawer drawerOpen={drawerOpen} onDrawerOpenChange={handleDrawerChange}>
          <div />
        </PartnerDrawer>
      </>
    );
  }

  if (showForm) {
    return (
      <div className="min-h-screen bg-secondary font-sans">
        <Header />
        <div className="pt-[152px]">
          <div className="max-w-[560px] mx-auto px-8 mb-12">
            <div className="bg-background rounded-2xl p-8">
              <PartnerApplicationForm onBack={() => setShowForm(false)} />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary font-sans">
      <Header />
      <div className="pt-[152px] pb-12">
        <div className="max-w-[1200px] mx-auto px-8 flex flex-col gap-3">
          {/* HERO */}
          <div className="bg-primary rounded-2xl relative overflow-hidden">
            <div className="absolute top-[-150px] left-[-120px] w-[400px] h-[400px] bg-primary-foreground/5 rounded-full pointer-events-none" />
            <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-primary-foreground/5 rounded-full pointer-events-none" />

            <div className="flex items-center gap-10 px-12 py-14 relative z-[1]">
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-bold tracking-wider uppercase text-primary-foreground/50 mb-4">Для застройщиков</p>
                <h1 className="text-[40px] font-extrabold text-primary-foreground leading-[1.1] mb-4 tracking-tight">
                  Покажите свои дома<br />в лучшем свете
                </h1>
                <p className="text-[15px] text-primary-foreground/70 leading-relaxed mb-7 max-w-[480px]">
                  Красивая витрина, проверенный статус и приоритет в выдаче — чтобы покупатели видели вас первыми и запоминали.
                </p>
                <button
                  onClick={handleStartChat}
                  className="h-[52px] px-8 rounded-xl text-[15px] font-bold bg-primary-foreground text-primary hover:opacity-90 transition-opacity"
                >
                  Стать партнёром
                </button>
              </div>
              <div className="w-[360px] shrink-0 flex items-center justify-center">
                <img src={partnerHeroImg} alt="" className="w-full h-auto" />
              </div>
            </div>
          </div>

          {/* PREVIEW CARD */}
          <div className="bg-background rounded-2xl p-8">
            <p className="text-[12px] font-bold tracking-wider uppercase text-primary mb-4">Как выглядит партнёрская карточка</p>
            <div className="bg-secondary rounded-2xl p-5 max-w-[520px]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-xl bg-foreground text-background flex items-center justify-center text-[12px] font-bold shrink-0">
                  SW
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[14px] font-semibold text-foreground">Sherwood Home</span>
                    <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-md">
                      <ShieldCheck className="w-3 h-3" /> Проверено
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
                    <Star className="w-3 h-3 fill-current text-foreground" />
                    <span>5,0 · 13 отзывов · 12 проектов</span>
                  </div>
                </div>
              </div>
              <div className="aspect-[16/9] rounded-xl bg-gradient-to-b from-[hsl(205,30%,65%)] to-[hsl(80,20%,40%)]" />
            </div>
          </div>

          {/* FEATURES */}
          <div className="bg-background rounded-2xl p-8">
            <p className="text-[12px] font-bold tracking-wider uppercase text-primary mb-2">Что получают партнёры</p>
            <h2 className="text-[26px] font-extrabold text-foreground leading-tight mb-6 tracking-tight">
              Представительство, которое работает на ваш бренд
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {features.map((f, i) => (
                <div key={i} className="bg-secondary rounded-xl p-5">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                    <f.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-[14px] font-semibold text-foreground mb-1">{f.title}</div>
                  <div className="text-[12px] text-muted-foreground leading-relaxed">{f.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* PLANS */}
          <div className="bg-background rounded-2xl p-8">
            <p className="text-[12px] font-bold tracking-wider uppercase text-primary mb-2">Форматы участия</p>
            <h2 className="text-[26px] font-extrabold text-foreground leading-tight mb-6 tracking-tight">
              Три тарифа, разные уровни присутствия
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {plans.map((p) => {
                const isHero = p.popular;
                return (
                  <div
                    key={p.name}
                    className={`rounded-2xl p-6 flex flex-col ${
                      isHero ? "bg-foreground text-background" : "bg-secondary text-foreground"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`text-[11px] font-bold tracking-wider uppercase ${
                          isHero ? "text-background/50" : "text-muted-foreground"
                        }`}
                      >
                        {p.name}
                      </span>
                      {isHero && (
                        <span className="text-[10px] font-bold tracking-wider uppercase bg-primary text-primary-foreground px-2 py-1 rounded-md">
                          Популярный
                        </span>
                      )}
                    </div>
                    <div className="flex items-baseline gap-1.5 mb-1">
                      <span className={`text-[13px] font-medium ${isHero ? "text-background/50" : "text-muted-foreground"}`}>
                        {p.priceHint}
                      </span>
                      <span className="text-[28px] font-extrabold tracking-tight leading-none">{p.price}</span>
                    </div>
                    <div className={`text-[12px] mb-5 ${isHero ? "text-background/50" : "text-muted-foreground"}`}>
                      {p.period}
                    </div>
                    <ul className="flex flex-col gap-2.5 mb-6">
                      {p.features.map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <div
                            className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
                              isHero ? "bg-primary/30" : "bg-primary/15"
                            }`}
                          >
                            <Check
                              className={`w-2.5 h-2.5 ${isHero ? "text-primary-foreground" : "text-primary"}`}
                              strokeWidth={3}
                            />
                          </div>
                          <span className={`text-[13px] leading-snug ${isHero ? "text-background/90" : "text-foreground"}`}>
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={handleStartChat}
                      className={`mt-auto h-[44px] rounded-xl text-[14px] font-bold transition-opacity hover:opacity-90 ${
                        isHero
                          ? "bg-primary-foreground text-foreground"
                          : "bg-primary text-primary-foreground"
                      }`}
                    >
                      Выбрать
                    </button>
                  </div>
                );
              })}
            </div>
            <p className="text-[12px] text-muted-foreground text-center mt-5">
              Продление — в любой момент. Переход на другой тариф — без потери оставшегося периода.
            </p>
          </div>

          {/* HOW IT WORKS */}
          <div className="bg-foreground rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute top-[-80px] right-[-80px] w-[260px] h-[260px] bg-primary/20 rounded-full pointer-events-none" />
            <div className="relative z-[1]">
              <p className="text-[12px] font-bold tracking-wider uppercase text-background/40 mb-2">Как это работает</p>
              <h2 className="text-[26px] font-extrabold text-background leading-tight mb-8 tracking-tight">
                Подключение занимает 2–3 рабочих дня
              </h2>
              <div className="grid grid-cols-3 gap-4">
                {steps.map((s) => (
                  <div key={s.num} className="bg-background/5 rounded-xl p-5">
                    <div className="text-[24px] font-extrabold text-primary tracking-tight mb-2">{s.num}</div>
                    <div className="text-[15px] font-semibold text-background mb-1">{s.title}</div>
                    <div className="text-[12px] text-background/50 leading-relaxed">{s.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* FINAL CTA */}
          <div className="bg-background rounded-2xl p-10 text-center">
            <h2 className="text-[28px] font-extrabold text-foreground leading-tight mb-2 tracking-tight">
              Готовы стать партнёром?
            </h2>
            <p className="text-[14px] text-muted-foreground mb-6 max-w-[440px] mx-auto">
              Оплата после подтверждения. Менеджер свяжется в течение дня.
            </p>
            <button
              onClick={handleStartChat}
              className="h-[52px] px-10 rounded-xl text-[15px] font-bold bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Оставить заявку
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PartnerLanding;
