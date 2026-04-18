import { useNavigate } from "react-router-dom";
import { X, ShieldCheck, TrendingUp, LayoutGrid, Sparkles, MapPin, Search, Check, Star } from "lucide-react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import PartnerApplicationForm from "@/components/PartnerApplicationForm";
import partnerHeroImg from "@/assets/partner-hero-illustration.png";

const features = [
  { icon: ShieldCheck, title: "Бейдж «Проверено»", desc: "На карточке компании и каждом проекте" },
  { icon: TrendingUp, title: "Приоритет в выдаче", desc: "Выше в каталоге и поиске по региону" },
  { icon: LayoutGrid, title: "Страница компании", desc: "Портфолио, галерея, отзывы и рейтинг" },
  { icon: Sparkles, title: "Оформление карточек", desc: "Единый стиль и аккуратная типографика" },
  { icon: MapPin, title: "География работ", desc: "Жители ваших регионов видят первыми" },
  { icon: Search, title: "Индексация в поиске", desc: "Покупатели находят вас через Google и Яндекс" },
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
  { num: "01", title: "Оставляете заявку", desc: "Контакты, ИНН и ссылка на сайт." },
  { num: "02", title: "Мы проверяем вручную", desc: "Сверяем реквизиты, обсуждаем формат." },
  { num: "03", title: "Запускаем витрину", desc: "Оплата, оформление, бейдж «Проверено»." },
];

interface PartnerDrawerProps {
  children?: React.ReactNode;
  drawerOpen?: boolean;
  onDrawerOpenChange?: (open: boolean) => void;
}

const PartnerContent = ({ onClose, onStartChat }: { onClose: () => void; onStartChat: () => void }) => (
  <div className="flex flex-col gap-3 px-3 pt-3 pb-4 bg-secondary">
    {/* HERO */}
    <div className="bg-primary rounded-2xl relative overflow-hidden">
      <div className="absolute top-3 right-3 z-20">
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-xl bg-background/15 backdrop-blur flex items-center justify-center"
        >
          <X className="w-4 h-4 text-primary-foreground" />
        </button>
      </div>
      <div className="absolute top-[-100px] left-[-80px] w-[300px] h-[300px] bg-primary-foreground/5 rounded-full pointer-events-none" />
      <div className="absolute bottom-[-60px] right-[-60px] w-[200px] h-[200px] bg-primary-foreground/5 rounded-full pointer-events-none" />
      <div className="flex justify-center pt-3 pb-1 md:hidden">
        <div className="w-10 h-1 rounded-md bg-primary-foreground/20" />
      </div>
      <div className="flex justify-center pt-4 pb-1 px-2">
        <img src={partnerHeroImg} alt="" className="w-[260px] h-auto relative z-[1]" />
      </div>
      <div className="px-5 pb-7 relative z-[1] text-center">
        <p className="text-[11px] font-bold tracking-wider uppercase text-primary-foreground/50 mb-2">Для застройщиков</p>
        <h1 className="text-[26px] font-extrabold text-primary-foreground leading-[1.15] mb-3 tracking-tight">
          Покажите свои дома<br />в лучшем свете
        </h1>
        <p className="text-[13px] text-primary-foreground/70 leading-relaxed max-w-[320px] mx-auto">
          Красивая витрина, проверенный статус и приоритет в выдаче — чтобы покупатели видели вас первыми.
        </p>
      </div>
    </div>

    {/* PREVIEW CARD */}
    <div className="bg-background rounded-2xl p-4">
      <p className="text-[11px] font-bold tracking-wider uppercase text-primary mb-3">Партнёрская карточка</p>
      <div className="bg-secondary rounded-xl p-3">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-foreground text-background flex items-center justify-center text-[11px] font-bold shrink-0">
            SW
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
              <span className="text-[13px] font-semibold text-foreground">Sherwood Home</span>
              <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                <ShieldCheck className="w-2.5 h-2.5" /> Проверено
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Star className="w-2.5 h-2.5 fill-current text-foreground" />
              <span>5,0 · 13 отзывов · 12 проектов</span>
            </div>
          </div>
        </div>
        <div className="aspect-[16/9] rounded-lg bg-gradient-to-b from-[hsl(205,30%,65%)] to-[hsl(80,20%,40%)]" />
      </div>
    </div>

    {/* FEATURES */}
    <div className="bg-background rounded-2xl p-4">
      <p className="text-[11px] font-bold tracking-wider uppercase text-primary mb-1.5">Что получают партнёры</p>
      <h2 className="text-[20px] font-extrabold text-foreground leading-tight mb-4 tracking-tight">
        Представительство, которое работает на бренд
      </h2>
      <div className="grid grid-cols-1 gap-2">
        {features.map((f, i) => (
          <div key={i} className="flex gap-3 items-start bg-secondary rounded-xl p-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <f.icon className="w-[18px] h-[18px] text-primary" />
            </div>
            <div className="min-w-0">
              <div className="text-[14px] font-semibold text-foreground mb-0.5">{f.title}</div>
              <div className="text-[12px] text-muted-foreground leading-relaxed">{f.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* PLANS */}
    <div className="bg-background rounded-2xl p-4">
      <p className="text-[11px] font-bold tracking-wider uppercase text-primary mb-1.5">Форматы участия</p>
      <h2 className="text-[20px] font-extrabold text-foreground leading-tight mb-4 tracking-tight">
        Три тарифа, разные уровни присутствия
      </h2>
      <div className="flex flex-col gap-2.5">
        {plans.map((p) => {
          const isHero = p.popular;
          return (
            <div
              key={p.name}
              className={`rounded-2xl p-5 ${isHero ? "bg-foreground text-background" : "bg-secondary text-foreground"}`}
            >
              <div className="flex items-center justify-between mb-3">
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
                <span className={`text-[12px] font-medium ${isHero ? "text-background/50" : "text-muted-foreground"}`}>
                  {p.priceHint}
                </span>
                <span className="text-[26px] font-extrabold tracking-tight leading-none">{p.price}</span>
              </div>
              <div className={`text-[12px] mb-4 ${isHero ? "text-background/50" : "text-muted-foreground"}`}>
                {p.period}
              </div>
              <ul className="flex flex-col gap-2">
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
            </div>
          );
        })}
      </div>
      <p className="text-[11px] text-muted-foreground text-center mt-4 leading-relaxed">
        Продление — в любой момент. Переход на другой тариф — без потери оставшегося периода.
      </p>
    </div>

    {/* HOW IT WORKS */}
    <div className="bg-foreground rounded-2xl p-5 relative overflow-hidden">
      <div className="absolute top-[-60px] right-[-60px] w-[200px] h-[200px] bg-primary/20 rounded-full pointer-events-none" />
      <div className="relative z-[1]">
        <p className="text-[11px] font-bold tracking-wider uppercase text-background/40 mb-1.5">Как это работает</p>
        <h2 className="text-[20px] font-extrabold text-background leading-tight mb-5 tracking-tight">
          Подключение занимает 2–3 рабочих дня
        </h2>
        <div className="flex flex-col gap-2.5">
          {steps.map((s) => (
            <div key={s.num} className="bg-background/5 rounded-xl p-4 flex gap-3">
              <div className="text-[20px] font-extrabold text-primary tracking-tight leading-none shrink-0 w-8">{s.num}</div>
              <div className="min-w-0">
                <div className="text-[14px] font-semibold text-background mb-0.5">{s.title}</div>
                <div className="text-[12px] text-background/50 leading-relaxed">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* FINAL CTA — desktop dialog only (mobile uses fixed CTA) */}
    <div className="hidden md:block bg-background rounded-2xl p-6 text-center">
      <h2 className="text-[22px] font-extrabold text-foreground leading-tight mb-2 tracking-tight">
        Готовы стать партнёром?
      </h2>
      <p className="text-[13px] text-muted-foreground mb-5">
        Оплата после подтверждения. Менеджер свяжется в течение дня.
      </p>
      <button
        onClick={onStartChat}
        className="w-full h-[52px] bg-primary text-primary-foreground rounded-xl text-[15px] font-bold hover:opacity-90 transition-opacity"
      >
        Оставить заявку
      </button>
    </div>
  </div>
);

const PartnerDrawer = ({ children, drawerOpen, onDrawerOpenChange }: PartnerDrawerProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [internalOpen, setInternalOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const isControlled = drawerOpen !== undefined;
  const open = isControlled ? drawerOpen : internalOpen;
  const setOpen = isControlled ? (onDrawerOpenChange || (() => {})) : setInternalOpen;

  const handleStartChat = () => setShowForm(true);
  const handleClose = () => {
    setShowForm(false);
    setOpen(false);
  };
  const handleFormBack = () => setShowForm(false);

  if (!isMobile) {
    return (
      <Dialog open={open} onOpenChange={(v) => { if (!v) setShowForm(false); setOpen(v); }}>
        {children && <DialogTrigger asChild>{children}</DialogTrigger>}
        <DialogContent className="max-w-[680px] max-h-[90vh] p-0 overflow-hidden rounded-2xl border-0 gap-0 [&>button]:hidden">
          <div className="overflow-y-auto max-h-[90vh]">
            {showForm ? (
              <div className="p-6">
                <PartnerApplicationForm onBack={handleFormBack} variant="drawer" />
              </div>
            ) : (
              <PartnerContent onClose={handleClose} onStartChat={handleStartChat} />
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={(v) => { if (!v) setShowForm(false); setOpen(v); }} shouldScaleBackground={false} handleOnly>
      {children && <DrawerTrigger asChild>{children}</DrawerTrigger>}
      <DrawerContent className="!mt-0 h-[98vh] max-h-[98vh] outline-none rounded-t-[28px] border-0 bg-secondary [&>div:first-child]:!hidden [&>div:first-child]:!h-0 [&>div:first-child]:!m-0 [&>div:first-child]:!p-0 overflow-hidden">
        <div className="overflow-y-auto h-full pb-[calc(80px+env(safe-area-inset-bottom))]">
          {showForm ? (
            <div className="pt-6 bg-background min-h-full">
              <PartnerApplicationForm onBack={handleFormBack} variant="drawer" />
            </div>
          ) : (
            <PartnerContent onClose={handleClose} onStartChat={handleStartChat} />
          )}
        </div>

        {!showForm && (
          <div className="absolute bottom-0 left-0 right-0 bg-background border-t border-border px-3 pt-2.5 pb-[calc(16px+env(safe-area-inset-bottom))] z-10">
            <button
              onClick={handleStartChat}
              className="w-full h-[52px] bg-primary text-primary-foreground rounded-xl text-[15px] font-bold"
            >
              Оставить заявку
            </button>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default PartnerDrawer;
