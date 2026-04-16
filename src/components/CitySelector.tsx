import { useState, useMemo, useEffect } from "react";
import { MapPin, Search, X, Check } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer, DrawerContent } from "@/components/ui/drawer";

const cities = [
  "Вся Россия", "Москва и МО", "Санкт-Петербург и ЛО", "Новосибирск", "Екатеринбург",
  "Казань", "Краснодар", "Сочи", "Нижний Новгород", "Самара", "Ростов-на-Дону",
  "Уфа", "Воронеж", "Пермь", "Челябинск", "Тюмень", "Калининград",
  "Тверь", "Красноярск", "Иркутск", "Владивосток", "Мурманск",
  "Петрозаводск", "Барнаул", "Хабаровск", "Томск", "Алтай",
  "Карелия",
];

const CITY_STORAGE_KEY = "selected_city";

export function useCity() {
  const [city, setCity] = useState(() => {
    try { return localStorage.getItem(CITY_STORAGE_KEY) || "Вся Россия"; } catch { return "Вся Россия"; }
  });

  const selectCity = (c: string) => {
    setCity(c);
    try { localStorage.setItem(CITY_STORAGE_KEY, c); } catch {}
  };

  return { city, selectCity };
}

interface CitySelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  city: string;
  onSelect: (city: string) => void;
}

const CitySelector = ({ open, onOpenChange, city, onSelect }: CitySelectorProps) => {
  const isMobile = useIsMobile();
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (open) setSearch("");
  }, [open]);

  const filtered = useMemo(() => {
    if (!search.trim()) return cities;
    const q = search.toLowerCase();
    return cities.filter(c => c.toLowerCase().includes(q));
  }, [search]);

  const handleSelect = (c: string) => {
    onSelect(c);
    onOpenChange(false);
  };

  const content = (
    <div className="flex flex-col max-h-[85vh]">
      <div className="px-5 pt-5 pb-3 flex items-center justify-between shrink-0">
        <h2 className="text-lg font-semibold text-foreground">Выберите город</h2>
        {!isMobile && (
          <button onClick={() => onOpenChange(false)} className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-secondary">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>
      <div className="px-5 pb-3 shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={(e) => {
              // Prevent iOS viewport jump by scrolling back
              setTimeout(() => {
                e.target.scrollIntoView({ block: "center", behavior: "smooth" });
              }, 300);
            }}
            placeholder="Поиск города"
            className="w-full h-11 rounded-xl bg-secondary border border-border pl-9 pr-4 text-[16px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>
      <div className="overflow-y-auto flex-1 min-h-0 px-2 pb-5">
        {filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">Город не найден</p>
        ) : (
          filtered.map((c) => (
            <button
              key={c}
              onClick={() => handleSelect(c)}
              className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-left transition-colors ${
                c === city ? "bg-primary/10 text-primary" : "text-foreground hover:bg-secondary"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span className="text-[15px]">{c}</span>
              </div>
              {c === city && <Check className="w-4 h-4 text-primary flex-shrink-0" />}
            </button>
          ))
        )}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="mx-0 rounded-t-[20px] p-0 max-h-[85vh]" onOpenAutoFocus={(e) => e.preventDefault()}>
          {content}
        </DrawerContent>
      </Drawer>
    );
  }

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-[70] bg-black/30" onClick={() => onOpenChange(false)} />
      <div className="fixed z-[70] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] max-h-[80vh] bg-background rounded-2xl shadow-xl overflow-hidden">
        {content}
      </div>
    </>
  );
};

export default CitySelector;
