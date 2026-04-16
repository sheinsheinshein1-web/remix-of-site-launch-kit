import { useNavigate } from "react-router-dom";
import { Users, TrendingUp, Home, LayoutGrid, MessageSquare, Star, BarChart3, MapPin, Check, Building2, Tent, TreePine, Warehouse, Bath, Flame, Fence } from "lucide-react";
import Header from "@/components/Header";
import PartnerApplicationForm from "@/components/PartnerApplicationForm";
import Footer from "@/components/Footer";
import PartnerDrawer from "@/components/PartnerDrawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";
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

const partnerCategories = [
  { icon: Home, title: "Модульные дома", desc: "Для постоянного проживания, дачные, двухэтажные" },
  { icon: Bath, title: "Бани и сауны", desc: "Каркасные бани, бани-бочки, с террасой" },
  { icon: Tent, title: "Глэмпинг", desc: "А-фреймы, купола, модульные домики для турбизнеса" },
  { icon: Warehouse, title: "Бытовки и хозблоки", desc: "Строительные, дачные, утепленные" },
  { icon: TreePine, title: "Беседки и навесы", desc: "Открытые, закрытые, с барбекю-зоной" },
  { icon: Building2, title: "Коммерческие объекты", desc: "Офисы, магазины, кафе, гостиницы" },
  { icon: Flame, title: "Барбекю и зоны отдыха", desc: "Печные комплексы, летние кухни" },
  { icon: Fence, title: "Инфраструктура участка", desc: "Гаражи, заборы, септики, скважины" },
];

const benefits = [
  { icon: Home, title: "Профиль производителя", desc: "Портфолио, отзывы, сертификаты — всё на одной странице" },
  { icon: LayoutGrid, title: "Карточки проектов", desc: "Фото, планировка, цена, стиль — покупатель сравнивает" },
  { icon: MessageSquare, title: "Чат с покупателем", desc: "Быстрые вопросы прямо в карточке проекта" },
  { icon: Star, title: "Верифицированные отзывы", desc: "Только от реальных покупателей" },
  { icon: MapPin, title: "Региональный поиск", desc: "Покупатели фильтруют по вашему региону" },
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

const CTAButton = ({ onClick, className = "", variant = "primary" }: { onClick: () => void; className?: string; variant?: "primary" | "hero" }) => (
  <button
    onClick={onClick}
    className={`h-[52px] rounded-xl text-[15px] font-bold hover:opacity-90 transition-opacity flex items-center justify-center ${
      variant === "hero"
        ? "bg-primary-foreground text-primary"
        : "bg-primary text-primary-foreground"
    } ${className}`}
  >
    Подключиться
  </button>
);

const PartnerLanding = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // On mobile, open the drawer immediately and go back when closed
  useEffect(() => {
    if (isMobile) {
      setDrawerOpen(true);
    }
  }, [isMobile]);

  const handleDrawerChange = (open: boolean) => {
    setDrawerOpen(open);
    if (!open && isMobile) {
      navigate(-1);
    }
  };

  const handleStartChat = () => {
    setShowForm(true);
  };

  if (isMobile) {
    return (
      <PartnerDrawer drawerOpen={drawerOpen} onDrawerOpenChange={handleDrawerChange}>
        <div />
      </PartnerDrawer>
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
      <div className="pt-[152px]">
        {/* Hero */}
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="bg-primary rounded-2xl relative overflow-hidden">
            <div className="absolute top-[-150px] left-[-120px] w-[400px] h-[400px] bg-primary-foreground/5 rounded-full pointer-events-none" />
            <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-primary-foreground/5 rounded-full pointer-events-none" />

            <div className="max-w-[1100px] mx-auto flex items-center gap-8 px-10 py-12 relative z-[1]">
              <div className="flex-1 min-w-0">
                <h1 className="text-[36px] font-extrabold text-primary-foreground leading-[1.12] mb-4">
                  Покажите ваши проекты тем,<br />кто уже ищет
                </h1>
                <p className="text-[15px] text-primary-foreground/60 leading-relaxed mb-6 max-w-[440px]">
                  Дома, бани, глэмпинг, бытовки и другие модульные решения — размещайте на маркетплейсе и получайте целевые заявки
                </p>
                <div className="flex gap-3 mb-6">
                  {stats.map((s) => (
                    <div key={s.label} className="bg-primary-foreground/10 rounded-xl px-5 py-3 text-center">
                      <div className="text-[20px] font-extrabold text-primary-foreground leading-none mb-1">{s.val}</div>
                      <div className="text-[11px] text-primary-foreground/50 leading-tight">{s.label}</div>
                    </div>
                  ))}
                </div>
                <CTAButton onClick={handleStartChat} className="w-[260px]" variant="hero" />
              </div>
              <div className="w-[380px] shrink-0 flex items-center justify-center">
                <img src={partnerHeroImg} alt="" className="w-full h-auto" />
              </div>
            </div>

            <div className="absolute top-8 right-10 bg-background/95 backdrop-blur rounded-xl p-3 shadow-lg z-[2]">
              <div className="text-[11px] text-muted-foreground mb-0.5">от</div>
              <div className="text-[26px] font-black text-foreground leading-none tracking-tight">50</div>
              <div className="text-[11px] font-semibold text-primary leading-tight mt-0.5">заявок<br />в пакете</div>
            </div>
          </div>
        </div>

        {/* Partner categories — WHO WE'RE LOOKING FOR */}
        <div className="max-w-[1400px] mx-auto px-8 mt-6">
          <div className="bg-background rounded-2xl p-8">
            <p className="text-[12px] font-bold tracking-wider uppercase text-primary mb-2">Кого мы ищем</p>
            <h2 className="text-[22px] font-extrabold text-foreground leading-tight mb-1">Не только дома</h2>
            <p className="text-[14px] text-muted-foreground mb-6">Маркетплейс объединяет производителей по всем направлениям загородного строительства</p>
            <div className="grid grid-cols-4 gap-3">
              {partnerCategories.map((c, i) => (
                <div key={i} className="bg-secondary rounded-xl p-4 border border-border">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center mb-2.5">
                    <c.icon className="w-[18px] h-[18px] text-primary" />
                  </div>
                  <div className="text-[14px] font-semibold text-foreground mb-0.5">{c.title}</div>
                  <div className="text-[12px] text-muted-foreground leading-snug">{c.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pain points */}
        <div className="max-w-[1400px] mx-auto px-8 mt-6">
          <div className="bg-background rounded-2xl p-8">
            <p className="text-[12px] font-bold tracking-wider uppercase text-primary mb-6">Что происходит на рынке</p>
            <div className="grid grid-cols-3 gap-6">
              {painPoints.map((p, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <p.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-[15px] font-semibold text-foreground mb-1">{p.title}</div>
                    <div className="text-[13px] text-muted-foreground leading-relaxed">{p.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="max-w-[1400px] mx-auto px-8 mt-6">
          <div className="bg-foreground rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute top-[-80px] right-[-80px] w-[260px] h-[260px] bg-primary/20 rounded-full pointer-events-none" />
            <div className="max-w-[900px] relative z-[1]">
              <p className="text-[12px] font-bold tracking-wider uppercase text-background/40 mb-4">Как это работает</p>
              <h2 className="text-[28px] font-extrabold text-background leading-tight mb-2">Целевая аудитория с первого контакта</h2>
              <p className="text-[14px] text-background/50 leading-relaxed mb-8">
                Покупатели уже выбрали технологию — вам не надо объяснять, надо показать.
              </p>
              <div className="grid grid-cols-3 gap-6">
                {steps.map((s) => (
                  <div key={s.num} className="flex gap-3 items-start">
                    <div className="w-10 h-10 rounded-xl bg-background/10 flex items-center justify-center shrink-0">
                      <span className="text-[15px] font-extrabold text-background">{s.num}</span>
                    </div>
                    <div>
                      <div className="text-[15px] font-semibold text-background mb-1">{s.title}</div>
                      <div className="text-[13px] text-background/50 leading-relaxed">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-8 relative z-[1]">
              <CTAButton onClick={handleStartChat} className="w-[260px]" />
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="max-w-[1400px] mx-auto px-8 mt-6">
          <div className="bg-background rounded-2xl p-8">
            <p className="text-[12px] font-bold tracking-wider uppercase text-primary mb-6">Что входит</p>
            <div className="grid grid-cols-3 gap-4">
              {benefits.map((b, i) => (
                <div key={i} className="bg-secondary rounded-xl p-5 border border-border">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                    <b.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-[14px] font-semibold text-foreground mb-1">{b.title}</div>
                  <div className="text-[12px] text-muted-foreground leading-snug">{b.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing + CTA */}
        <div className="max-w-[1400px] mx-auto px-8 mt-6 mb-12">
          <div className="bg-foreground rounded-2xl relative overflow-hidden">
            <div className="absolute top-[-100px] right-[-100px] w-[340px] h-[340px] bg-primary/30 rounded-full pointer-events-none" />
            <div className="max-w-[900px] p-8 relative z-[1]">
              <p className="text-[12px] font-bold tracking-wider uppercase text-background/40 mb-5">Единый тариф</p>
              <div className="flex items-end gap-3 mb-2">
                <div className="text-[52px] font-black text-background leading-none tracking-tight">99 000 ₽</div>
              </div>
              <div className="text-[17px] font-bold text-background/60 mb-1">50 заявок + 15 в подарок до 14 мая</div>
              <p className="text-[13px] text-background/40 leading-relaxed mb-8 max-w-[500px]">
                1 980 ₽ за заявку от покупателя, который уже выбрал решение и изучил ваш профиль.
              </p>
              <div className="grid grid-cols-2 gap-x-8 gap-y-3 mb-8">
                {priceIncludes.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-xl bg-primary/40 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 text-primary-foreground" strokeWidth={3} />
                    </div>
                    <span className="text-[13px] text-background/80">{item}</span>
                  </div>
                ))}
              </div>
              <CTAButton onClick={handleStartChat} className="w-[320px]" />
              <p className="text-[11px] text-background/30 leading-relaxed mt-4">
                * Заявка — это обращение покупателя через кнопки «Позвонить», «Написать» или «Узнать цену» на вашем проекте.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PartnerLanding;
