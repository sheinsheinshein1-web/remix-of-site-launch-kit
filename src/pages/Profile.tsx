import { useNavigate } from "react-router-dom";
import {
  ChevronRight, Bell, Heart, Crown,
  Cog, Headset, HelpCircle, Info, Search
} from "lucide-react";
import MobileTabBar from "@/components/MobileTabBar";
import { useIsMobile } from "@/hooks/use-mobile";
import svcCalculator from "@/assets/svc-calculator.png";
import svcManufacturers from "@/assets/svc-manufacturers.png";
import svcMortgage from "@/assets/svc-mortgage.png";
import svcJournal from "@/assets/svc-journal.png";
import svcCompare from "@/assets/svc-compare.png";
import projectTaiga from "@/assets/project-taiga72.jpg";
import projectKedr from "@/assets/project-kedr24.jpg";
import avatar3d from "@/assets/avatar-3d.png";

const profileServices = [
  { name: "Калькулятор", img: svcCalculator },
  { name: "Производители", img: svcManufacturers },
  { name: "Рассрочка", img: svcMortgage },
  { name: "Журнал", img: svcJournal },
  { name: "Сравнение", img: svcCompare },
];

const isLoggedIn = false; // Toggle for auth state

const Profile = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  if (isMobile && !isLoggedIn) {
    return (
      <div className="min-h-screen bg-muted font-sans flex flex-col">
        {/* Bento header */}
        <div className="sticky top-0 z-40 bg-background rounded-b-2xl shadow-sm shrink-0">
          <div className="flex items-center justify-center h-14">
            <h1 className="text-base font-semibold text-foreground">Профиль</h1>
          </div>
        </div>

        {/* Auth prompt — bento card */}
        <div className="bg-card rounded-t-2xl mx-0 mt-2 px-6 pt-8 pb-32 flex-1 flex flex-col items-center text-center">
          <div className="w-44 h-44 mb-4">
            <img src={avatar3d} alt="" className="w-full h-full object-contain" loading="eager" decoding="sync" fetchPriority="high" />
          </div>
          <h2 className="text-[18px] font-bold text-foreground mb-2">Войдите или зарегистрируйтесь</h2>
          <p className="text-[13px] text-muted-foreground leading-relaxed max-w-[280px]">
            Чтобы управлять своими заявками, сообщениями и другими полезными вещами
          </p>
          <button className="w-full h-[52px] bg-primary text-primary-foreground rounded-2xl text-[15px] font-semibold mt-6">
            Войти или зарегистрироваться
          </button>

          {/* Menu items */}
          <div className="w-full mt-8">
            {[
              { icon: Cog, label: "Настройки" },
              { icon: Headset, label: "Служба поддержки", onClick: () => navigate("/messages/support") },
              { icon: HelpCircle, label: "Вопрос-ответ" },
              { icon: Info, label: "О приложении" },
            ].map((item, i) => (
              <button
                key={item.label}
                onClick={item.onClick}
                className={`flex items-center justify-between w-full px-0 py-4 ${i > 0 ? "border-t border-border" : ""}`}
              >
                <div className="flex items-center gap-3.5">
                  <item.icon className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
                  <span className="text-[15px] text-foreground">{item.label}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground/50" strokeWidth={1.5} />
              </button>
            ))}
          </div>
        </div>


        <MobileTabBar />
      </div>
    );
  }

  // Logged in state (existing design)
  return (
    <div className="min-h-screen bg-secondary pb-20">
      {/* Compact header */}
      <div className="bg-card px-5 pt-3 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-[15px] font-bold text-primary-foreground flex-shrink-0">
              АВ
            </div>
            <div>
              <div className="text-[15px] font-semibold text-foreground flex items-center gap-1.5">
                Артём Васильевич
                <Crown className="w-4 h-4 text-amber-500 fill-amber-400" strokeWidth={1.5} />
              </div>
              <button className="text-[12px] font-light text-muted-foreground flex items-center gap-0.5">
                Данные и настройки
                <ChevronRight className="w-3 h-3" strokeWidth={1.5} />
              </button>
            </div>
          </div>
          <button className="relative w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
            <Bell className="w-[18px] h-[18px] text-muted-foreground fill-muted-foreground" strokeWidth={1.5} />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive rounded-full text-[9px] font-semibold text-primary-foreground flex items-center justify-center">
              3
            </span>
          </button>
        </div>
      </div>

      {/* Promo cards */}
      <div className="flex gap-2 px-4 mt-3">
        <div className="flex-1 bg-card rounded-xl p-3.5">
          <div className="text-[11px] font-light text-muted-foreground mb-1 flex items-center gap-1">
            Скидка
            <ChevronRight className="w-3 h-3" strokeWidth={1.5} />
          </div>
          <div className="text-[17px] font-semibold text-foreground">до 15 %</div>
        </div>
        <div className="flex-1 bg-card rounded-xl p-3.5">
          <div className="text-[11px] font-light text-muted-foreground mb-1 flex items-center gap-1">
            Рассрочка
            <ChevronRight className="w-3 h-3" strokeWidth={1.5} />
          </div>
          <div className="text-[17px] font-semibold text-foreground">0% на 12 мес</div>
        </div>
      </div>

      {/* Escrow balance */}
      <div className="bg-card rounded-xl mx-4 mt-3 px-4 py-3.5 flex items-center justify-between">
        <div>
          <div className="text-[17px] font-bold text-foreground">15 760 000 ₽ <ChevronRight className="w-3.5 h-3.5 inline text-muted-foreground" strokeWidth={1.5} /></div>
          <div className="text-[12px] font-light text-muted-foreground mt-0.5">Эскроу счёт</div>
        </div>
        <button className="text-[13px] font-medium text-primary-foreground bg-primary rounded-xl px-4 py-2.5">
          Открыть счёт
        </button>
      </div>

      {/* Requests / Orders */}
      <div className="bg-card rounded-xl mx-4 mt-3 overflow-hidden">
        <button
          onClick={() => navigate("/requests")}
          className="flex items-center justify-between w-full px-4 py-3.5 border-b border-border"
        >
          <div>
            <div className="text-[15px] font-semibold text-foreground text-left">Заявки</div>
            <div className="text-[13px] font-light text-muted-foreground mt-0.5">Активные: 2 · Архив: 1</div>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground/50" strokeWidth={1.5} />
        </button>
        <button onClick={() => navigate("/messages")} className="flex items-center gap-3 w-full px-4 py-3.5 border-b border-border">
          <img src={projectTaiga} alt="Тайга 72" className="w-9 h-9 rounded-[10px] object-cover flex-shrink-0" />
          <div className="flex-1 text-left min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-medium text-foreground">Тайга 72</span>
              <span className="text-[10px] font-medium text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">Ответили</span>
            </div>
            <div className="text-[12px] font-light text-muted-foreground mt-0.5">СибМодуль · 2 630 000 ₽</div>
          </div>
          <span className="text-[13px] font-medium text-primary flex-shrink-0">Чат ›</span>
        </button>
        <div className="flex items-center gap-3 px-4 py-3.5">
          <img src={projectKedr} alt="Кедр 24" className="w-9 h-9 rounded-[10px] object-cover flex-shrink-0" />
          <div className="flex-1 text-left min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-medium text-foreground">Кедр 24</span>
              <span className="text-[10px] font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full">Ожидает</span>
            </div>
            <div className="text-[12px] font-light text-muted-foreground mt-0.5">УралДом · ответ ~24ч</div>
          </div>
        </div>
      </div>

      {/* Favorites shortcut */}
      <button
        onClick={() => navigate("/favorites")}
        className="bg-card rounded-xl mx-4 mt-3 px-4 py-3.5 flex items-center justify-between w-[calc(100%-2rem)]"
      >
        <div className="flex items-center gap-3">
          <Heart className="w-5 h-5 text-primary fill-primary flex-shrink-0" strokeWidth={1.5} />
          <div>
            <div className="text-[15px] font-semibold text-foreground text-left">Избранное</div>
            <div className="text-[13px] font-light text-muted-foreground text-left">5 проектов</div>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground/50" strokeWidth={1.5} />
      </button>

      {/* Services */}
      <div className="mt-3">
        <div className="text-[15px] font-semibold text-foreground mb-2.5 px-4">Сервисы</div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide px-4">
          {profileServices.map((s) => (
            <button key={s.name} className="shrink-0 flex flex-col items-center gap-1.5">
              <div className="w-[60px] h-[60px] rounded-2xl bg-card border border-border flex items-center justify-center overflow-hidden hover:border-primary transition-colors">
                <img src={s.img} alt={s.name} loading="lazy" className="w-[58px] h-[58px] object-cover" />
              </div>
              <span className="text-[10px] font-light text-foreground/70 leading-tight">{s.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Settings & other */}
      <div className="bg-card rounded-xl mx-4 mt-5 overflow-hidden">
        {[
          { icon: Cog, label: "Настройки", sub: "Уведомления, регион" },
          { icon: Headset, label: "Помощь", sub: "Написать в поддержку", onClick: () => navigate("/messages/support") },
        ].map((item, i) => (
          <button
            key={item.label}
            onClick={item.onClick}
            className={`flex items-center gap-3.5 w-full px-4 py-3.5 ${i > 0 ? "border-t border-border" : ""}`}
          >
            <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
              <item.icon className="w-[17px] h-[17px] text-muted-foreground" strokeWidth={1.8} />
            </div>
            <div className="flex-1 text-left">
              <div className="text-[15px] text-foreground">{item.label}</div>
              <div className="text-xs font-light text-muted-foreground mt-0.5">{item.sub}</div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground/50" strokeWidth={1.5} />
          </button>
        ))}
      </div>

      <button className="w-full py-5 mt-3 text-[14px] font-normal text-destructive">
        Выйти из аккаунта
      </button>

      <MobileTabBar />
    </div>
  );
};

export default Profile;
