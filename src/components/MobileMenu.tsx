import { useState } from "react";
import { X, Calculator, Factory, Wallet, BookOpen, HelpCircle, MessageCircle, ChevronRight, ClipboardList, Save } from "lucide-react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";

interface MobileMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const serviceItems = [
  {
    icon: Calculator,
    bg: "bg-blue-50",
    iconColor: "text-primary",
    title: "Калькулятор стоимости",
    sub: "Цена под ключ с доставкой",
  },
  {
    icon: Factory,
    bg: "bg-green-50",
    iconColor: "text-green-700",
    title: "Производители",
    sub: "80+ проверенных компаний",
  },
  {
    icon: Wallet,
    bg: "bg-violet-50",
    iconColor: "text-violet-600",
    title: "Рассрочка и ипотека",
    sub: "Финансирование под проект",
  },
];

const infoItems = [
  {
    icon: BookOpen,
    bg: "bg-amber-50",
    iconColor: "text-amber-600",
    title: "Журнал",
    sub: "Советы, истории, право",
    badge: "Новое",
  },
  {
    icon: HelpCircle,
    bg: "bg-stone-100",
    iconColor: "text-muted-foreground",
    title: "Как это работает",
    sub: "От выбора до монтажа",
  },
  {
    icon: MessageCircle,
    bg: "bg-stone-100",
    iconColor: "text-muted-foreground",
    title: "Написать нам",
    sub: "Telegram · WhatsApp",
  },
];

const myItems = [
  {
    icon: ClipboardList,
    bg: "bg-blue-50",
    iconColor: "text-primary",
    title: "Мои заявки",
    sub: "2 активные заявки",
  },
  {
    icon: Save,
    bg: "bg-green-50",
    iconColor: "text-green-700",
    title: "Сохранённые расчёты",
    sub: "3 расчёта в калькуляторе",
  },
];

const authServiceItems = [
  {
    icon: Calculator,
    bg: "bg-blue-50",
    iconColor: "text-primary",
    title: "Калькулятор стоимости",
    sub: "Цена под ключ с доставкой",
  },
  {
    icon: Factory,
    bg: "bg-green-50",
    iconColor: "text-green-700",
    title: "Производители",
    sub: "80+ компаний",
  },
  {
    icon: BookOpen,
    bg: "bg-amber-50",
    iconColor: "text-amber-600",
    title: "Журнал",
    sub: "Советы, истории, право",
    badge: "Новое",
  },
  {
    icon: MessageCircle,
    bg: "bg-stone-100",
    iconColor: "text-muted-foreground",
    title: "Написать нам",
    sub: "Telegram · WhatsApp",
  },
];

type MenuItemData = {
  icon: React.ElementType;
  bg: string;
  iconColor: string;
  title: string;
  sub: string;
  badge?: string;
};

const MenuItem = ({ item }: { item: MenuItemData }) => (
  <button className="flex items-center gap-3.5 py-3 w-full border-b border-border last:border-b-0">
    <div className={`w-9 h-9 rounded-[9px] ${item.bg} flex items-center justify-center flex-shrink-0`}>
      <item.icon className={`w-[17px] h-[17px] ${item.iconColor}`} strokeWidth={1.5} />
    </div>
    <div className="flex-1 text-left">
      <div className="text-[15px] font-normal text-foreground">{item.title}</div>
      <div className="text-xs font-light text-muted-foreground mt-0.5">{item.sub}</div>
    </div>
    {item.badge && (
      <span className="text-[11px] font-normal bg-primary text-primary-foreground rounded-full px-2 py-0.5">
        {item.badge}
      </span>
    )}
    <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" strokeWidth={1.5} />
  </button>
);

const MenuSection = ({ label, items }: { label: string; items: MenuItemData[] }) => (
  <div className="px-5 pt-4 pb-1.5">
    <div className="text-[10px] tracking-[2px] text-muted-foreground mb-1">{label}</div>
    {items.map((item) => (
      <MenuItem key={item.title} item={item} />
    ))}
  </div>
);

const MobileMenu = ({ open, onOpenChange }: MobileMenuProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh] mb-[calc(52px+env(safe-area-inset-bottom))] mx-0 rounded-t-[10px] p-0">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <span className="text-[15px] font-medium text-foreground">Меню</span>
          <button
            onClick={() => onOpenChange(false)}
            className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {isLoggedIn ? (
          <div className="flex items-center gap-3.5 px-5 py-4 border-b border-border bg-secondary cursor-pointer">
            <div className="w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center text-[15px] font-medium text-primary flex-shrink-0">
              АК
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-foreground">Андрей Королёв</div>
              <div className="text-xs font-light text-muted-foreground mt-0.5">2 заявки · 5 в избранном</div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
          </div>
        ) : (
          <div className="flex gap-2.5 px-5 py-4 border-b border-border">
            <button className="flex-1 text-sm font-light text-muted-foreground border border-border rounded-[9px] py-2.5">
              Войти
            </button>
            <button className="flex-1 text-sm font-normal text-primary-foreground bg-primary rounded-[9px] py-2.5">
              Регистрация
            </button>
          </div>
        )}

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {isLoggedIn ? (
            <>
              <MenuSection label="МОЁ" items={myItems} />
              <MenuSection label="СЕРВИСЫ И ИНФО" items={authServiceItems} />
            </>
          ) : (
            <>
              <MenuSection label="СЕРВИСЫ" items={serviceItems} />
              <MenuSection label="ИНФОРМАЦИЯ" items={infoItems} />
            </>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="px-5 py-4 border-t border-border space-y-3">
          <button className="w-full text-sm font-light text-primary border border-primary rounded-[10px] py-3">
            Вы производитель? Разместить объект →
          </button>
          <button
            onClick={() => setIsLoggedIn(!isLoggedIn)}
            className="w-full text-xs text-muted-foreground border border-dashed border-border rounded-lg py-2"
          >
            Demo: переключить на {isLoggedIn ? "неавторизованный" : "авторизованный"} режим
          </button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileMenu;
