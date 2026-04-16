import { useNavigate } from "react-router-dom";
import { X, Users, TrendingUp, Clock, Home, LayoutGrid, MessageSquare, Star, BarChart3, MapPin, Check, Bath, Tent, Warehouse, Building2, TreePine, Flame, Fence } from "lucide-react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import PartnerApplicationForm from "@/components/PartnerApplicationForm";
import partnerHeroImg from "@/assets/partner-hero-illustration.png";

const stats = [
  { val: "50+", label: "производителей" },
  { val: "1 980 ₽", label: "за одну заявку" },
  { val: "50+", label: "заявок в пакете" },
];

const painPoints = [
  { icon: TrendingUp, title: "Клиенты ищут, но не находят вас", desc: "Покупатели сравнивают десятки предложений. Без присутствия на маркетплейсе вы теряете заявки." },
  { icon: BarChart3, title: "Стоимость заявки растёт", desc: "Рекламные каналы дорожают. Конверсия падает. За те же деньги получаете меньше обращений." },
  { icon: Users, title: "Нужно объяснять технологию", desc: "Часть покупателей воспринимает «модуль» как временное решение." },
];

const steps = [
  { num: 1, title: "Загружаете проекты", desc: "Фото, цена, характеристики, планировка." },
  { num: 2, title: "Покупатель выбирает", desc: "Фильтрует по площади, стилю, региону. Видит ваше портфолио." },
  { num: 3, title: "Заявка приходит напрямую", desc: "В Telegram или WhatsApp. Клиент уже изучил вас." },
];

const benefits = [
  { icon: Home, title: "Профиль производителя", desc: "Портфолио, отзывы, сертификаты" },
  { icon: LayoutGrid, title: "Карточки проектов", desc: "Фото, планировка, цена, стиль" },
  { icon: MessageSquare, title: "Чат с покупателем", desc: "Быстрые вопросы в карточке проекта" },
  { icon: Star, title: "Верифицированные отзывы", desc: "Только от реальных покупателей" },
  { icon: MapPin, title: "Региональный поиск", desc: "Покупатели фильтруют по региону" },
];

const priceIncludes = [
  "Неограниченное количество проектов",
  "50 заявок + 15 в подарок до 14 мая",
  "Полный профиль производителя",
  "Галерея построенных объектов",
  "Заявки в Telegram / WhatsApp",
  "Верифицированные отзывы покупателей",
  "Приоритет в поиске и выдаче",
  "Персональный менеджер на старте",
];

interface PartnerDrawerProps {
  children?: React.ReactNode;
  drawerOpen?: boolean;
  onDrawerOpenChange?: (open: boolean) => void;
}

/* Shared content used by both Drawer (mobile) and Dialog (desktop) */
const PartnerContent = ({ onClose, onStartChat }: { onClose: () => void; onStartChat: () => void }) => (
  <>
    {/* Hero */}
    <div className="bg-primary relative overflow-hidden">
      <div className="absolute top-3 right-3 z-20">
        <button onClick={onClose} className="w-7 h-7 rounded-full bg-background/20 backdrop-blur flex items-center justify-center">
          <X className="w-3.5 h-3.5 text-primary-foreground" />
        </button>
      </div>
      <div className="absolute top-[-100px] left-[-80px] w-[300px] h-[300px] bg-primary-foreground/5 rounded-full pointer-events-none" />
      <div className="absolute bottom-[-60px] right-[-60px] w-[200px] h-[200px] bg-primary-foreground/5 rounded-full pointer-events-none" />
      <div className="flex justify-center pt-3 pb-1 md:hidden">
        <div className="w-10 h-1 rounded-full bg-primary-foreground/20" />
      </div>
      <div className="flex justify-center pt-6 md:pt-8 pb-2 px-2">
        <img src={partnerHeroImg} alt="" className="w-[340px] md:w-[380px] h-auto relative z-[1]" />
      </div>
      <div className="absolute top-14 right-4 bg-background/95 backdrop-blur rounded-xl p-2.5 shadow-lg z-[2]">
        <div className="text-[11px] text-muted-foreground mb-0.5">от</div>
        <div className="text-[22px] font-black text-foreground leading-none tracking-tight">50</div>
        <div className="text-[11px] font-semibold text-primary leading-tight mt-0.5">заявок<br/>в пакете</div>
      </div>
      <div className="px-5 md:px-8 pb-6 relative z-[1]">
        <h3 className="text-[24px] md:text-[28px] font-extrabold text-primary-foreground leading-[1.15] text-center mb-2.5">
          Покажите ваши проекты тем, кто уже ищет
        </h3>
        <p className="text-[13px] md:text-sm text-primary-foreground/60 leading-relaxed text-center mb-5 max-w-[500px] mx-auto">
          Дома, бани, глэмпинг, бытовки и другие модульные решения — размещайте на маркетплейсе и получайте целевые заявки
        </p>
        <div className="grid grid-cols-3 gap-2 max-w-[500px] mx-auto">
          {stats.map((s) => (
            <div key={s.label} className="bg-primary-foreground/10 rounded-xl p-2.5 text-center">
              <div className="text-[17px] font-extrabold text-primary-foreground leading-none mb-1">{s.val}</div>
              <div className="text-[10px] text-primary-foreground/50 leading-tight">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="bg-background px-4 md:px-6 flex flex-col gap-3 pt-4 pb-4">
      {/* Who we're looking for */}
      <div className="bg-card rounded-2xl p-4 border border-border">
        <p className="text-[11px] font-bold tracking-wider uppercase text-primary mb-1">Кого мы ищем</p>
        <p className="text-[13px] text-muted-foreground mb-3">Не только дома — все направления загородного строительства</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { icon: Home, label: "Модульные дома" },
            { icon: Bath, label: "Бани и сауны" },
            { icon: Tent, label: "Глэмпинг" },
            { icon: Warehouse, label: "Бытовки и хозблоки" },
            { icon: TreePine, label: "Беседки и навесы" },
            { icon: Building2, label: "Коммерческие объекты" },
            { icon: Flame, label: "Барбекю-зоны" },
            { icon: Fence, label: "Гаражи и заборы" },
          ].map((c, i) => (
            <div key={i} className="flex items-center gap-2.5 bg-secondary rounded-xl px-3 py-2.5">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <c.icon className="w-3.5 h-3.5 text-primary" />
              </div>
              <span className="text-[13px] font-medium text-foreground">{c.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pain points */}
      <div className="bg-card rounded-2xl p-4 border border-border">
        <p className="text-[11px] font-bold tracking-wider uppercase text-primary mb-3">Что происходит на рынке</p>
        {painPoints.map((p, i) => (
          <div key={i} className={`flex gap-3 items-start py-3 ${i < painPoints.length - 1 ? "border-b border-border" : ""}`}>
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <p.icon className="w-[18px] h-[18px] text-primary" />
            </div>
            <div>
              <div className="text-[14px] font-semibold text-foreground mb-0.5">{p.title}</div>
              <div className="text-[12px] text-muted-foreground leading-relaxed">{p.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div className="bg-foreground rounded-2xl p-5 relative overflow-hidden">
        <div className="absolute top-[-60px] right-[-60px] w-[200px] h-[200px] bg-primary/20 rounded-full pointer-events-none" />
        <p className="text-[11px] font-bold tracking-wider uppercase text-background/40 mb-3">Как это работает</p>
        <h3 className="text-[20px] font-extrabold text-background leading-tight mb-1">Целевая аудитория с первого контакта</h3>
        <p className="text-[13px] text-background/50 leading-relaxed mb-4">Покупатели уже выбрали технологию — вам не надо объяснять, надо показать.</p>
        {steps.map((s, i) => (
          <div key={i} className={`flex gap-3 items-start py-3 ${i < steps.length - 1 ? "border-b border-background/10" : ""}`}>
            <div className="w-8 h-8 rounded-full bg-background/10 flex items-center justify-center shrink-0">
              <span className="text-[13px] font-extrabold text-background">{s.num}</span>
            </div>
            <div>
              <div className="text-[14px] font-semibold text-background mb-0.5">{s.title}</div>
              <div className="text-[12px] text-background/50 leading-relaxed">{s.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Benefits */}
      <div>
        <p className="text-[11px] font-bold tracking-wider uppercase text-primary mb-2 px-1">Что входит</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {benefits.map((b, i) => (
            <div key={i} className="bg-card rounded-xl p-3 border border-border">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <b.icon className="w-4 h-4 text-primary" />
              </div>
              <div className="text-[13px] font-semibold text-foreground mb-0.5">{b.title}</div>
              <div className="text-[11px] text-muted-foreground leading-snug">{b.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-foreground rounded-2xl p-5 relative overflow-hidden">
        <div className="absolute top-[-80px] right-[-80px] w-[260px] h-[260px] bg-primary/30 rounded-full pointer-events-none" />
        <p className="text-[11px] font-bold tracking-wider uppercase text-background/40 mb-4">Единый тариф</p>
        <div className="text-[44px] font-black text-background leading-none tracking-tight mb-1">99 000 ₽</div>
        <div className="text-[15px] font-bold text-background/60 mb-1">50 заявок + 15 в подарок до 14 мая</div>
        <p className="text-[12px] text-background/40 leading-relaxed mb-5">1 980 ₽ за заявку от покупателя, который уже выбрал решение и изучил ваш профиль.</p>
        <div className="flex flex-col gap-2.5 mb-5">
          {priceIncludes.map((item, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-primary/40 flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5 text-primary-foreground" strokeWidth={3} />
              </div>
              <span className="text-[13px] text-background/80">{item}</span>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-background/30 leading-relaxed">
          * Заявка — это обращение покупателя через кнопки «Позвонить», «Написать» или «Узнать цену» на вашем проекте.
        </p>
      </div>

      {/* Desktop inline CTA */}
      <div className="hidden md:block pt-2 pb-2">
        <button
          onClick={onStartChat}
          className="w-full h-[52px] bg-primary text-primary-foreground rounded-2xl text-[15px] font-bold hover:opacity-90 transition-opacity"
        >
          Подключиться
        </button>
      </div>
    </div>
  </>
);

const PartnerDrawer = ({ children, drawerOpen, onDrawerOpenChange }: PartnerDrawerProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [internalOpen, setInternalOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const isControlled = drawerOpen !== undefined;
  const open = isControlled ? drawerOpen : internalOpen;
  const setOpen = isControlled ? (onDrawerOpenChange || (() => {})) : setInternalOpen;

  const handleStartChat = () => {
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setOpen(false);
  };

  const handleFormBack = () => {
    setShowForm(false);
  };

  /* Desktop: centered Dialog */
  if (!isMobile) {
    return (
      <Dialog open={open} onOpenChange={(v) => { if (!v) setShowForm(false); setOpen(v); }}>
        {children && (
          <DialogTrigger asChild>
            {children}
          </DialogTrigger>
        )}
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

  /* Mobile: bottom Drawer */
  return (
    <Drawer open={open} onOpenChange={(v) => { if (!v) setShowForm(false); setOpen(v); }} shouldScaleBackground={false} handleOnly>
      {children && (
        <DrawerTrigger asChild>
          {children}
        </DrawerTrigger>
      )}
      <DrawerContent className="!mt-0 h-[98vh] max-h-[98vh] outline-none rounded-t-[28px] border-0 bg-background [&>div:first-child]:!hidden [&>div:first-child]:!h-0 [&>div:first-child]:!m-0 [&>div:first-child]:!p-0 overflow-hidden">
        <div className="overflow-y-auto h-full pb-[calc(80px+env(safe-area-inset-bottom))]">
          {showForm ? (
            <div className="pt-6">
              <PartnerApplicationForm onBack={handleFormBack} variant="drawer" />
            </div>
          ) : (
            <PartnerContent onClose={handleClose} onStartChat={handleStartChat} />
          )}
        </div>

        {/* Fixed CTA — mobile only, hide when form is shown */}
        {!showForm && (
          <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border px-4 pt-2.5 pb-[calc(16px+env(safe-area-inset-bottom))]">
            <button
              onClick={handleStartChat}
              className="w-full h-[52px] bg-primary text-primary-foreground rounded-2xl text-[15px] font-bold"
            >
              Подключиться
            </button>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default PartnerDrawer;
