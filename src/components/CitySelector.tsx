import { useState, useMemo, useEffect } from "react";
import { MapPin, Search, X, Check } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { cities } from "@/data/projects";

const CITY_STORAGE_KEY = "selected_city";
const CITY_AUTO_DETECTED_KEY = "city_auto_detected";

// Сопоставление того, что отдаёт ipapi.co (город на английском или русском),
// с нашими каноническими названиями.
const IP_CITY_MAP: Record<string, string> = {
  "moscow": "Москва и МО",
  "москва": "Москва и МО",
  "saint petersburg": "Санкт-Петербург и ЛО",
  "st petersburg": "Санкт-Петербург и ЛО",
  "st. petersburg": "Санкт-Петербург и ЛО",
  "санкт-петербург": "Санкт-Петербург и ЛО",
  "novosibirsk": "Новосибирск",
  "yekaterinburg": "Екатеринбург",
  "ekaterinburg": "Екатеринбург",
  "kazan": "Казань",
  "krasnodar": "Краснодар",
  "sochi": "Сочи",
  "nizhny novgorod": "Нижний Новгород",
  "samara": "Самара",
  "rostov-on-don": "Ростов-на-Дону",
  "rostov": "Ростов-на-Дону",
  "ufa": "Уфа",
  "voronezh": "Воронеж",
  "perm": "Пермь",
  "chelyabinsk": "Челябинск",
  "tyumen": "Тюмень",
  "kaliningrad": "Калининград",
  "tver": "Тверь",
  "krasnoyarsk": "Красноярск",
  "irkutsk": "Иркутск",
  "vladivostok": "Владивосток",
  "murmansk": "Мурманск",
  "petrozavodsk": "Петрозаводск",
  "barnaul": "Барнаул",
  "khabarovsk": "Хабаровск",
  "tomsk": "Томск",
};

const matchCityFromIp = (raw: string | undefined | null): string | null => {
  if (!raw) return null;
  const key = raw.trim().toLowerCase();
  if (IP_CITY_MAP[key]) return IP_CITY_MAP[key];
  // частичное совпадение по нашему списку
  const direct = cities.find((c) => c.toLowerCase().includes(key) || key.includes(c.toLowerCase().split(" ")[0]));
  return direct || null;
};

export function useCity() {
  const [city, setCity] = useState(() => {
    try { return localStorage.getItem(CITY_STORAGE_KEY) || "Екатеринбург"; } catch { return "Екатеринбург"; }
  });

  const selectCity = (c: string) => {
    setCity(c);
    try {
      localStorage.setItem(CITY_STORAGE_KEY, c);
      // Помечаем как ручной выбор, чтобы автоопределение больше не перезаписывало
      localStorage.setItem(CITY_AUTO_DETECTED_KEY, "manual");
    } catch {}
  };

  // Автоопределение города по IP при первом заходе
  useEffect(() => {
    let cancelled = false;
    try {
      const stored = localStorage.getItem(CITY_STORAGE_KEY);
      const flag = localStorage.getItem(CITY_AUTO_DETECTED_KEY);
      // Если пользователь уже выбирал город вручную или автоопределение уже отработало — выходим
      if (stored || flag) return;
    } catch {
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 4000);

    fetch("https://ipapi.co/json/", { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data) return;
        const matched = matchCityFromIp(data.city);
        if (matched) {
          setCity(matched);
          try { localStorage.setItem(CITY_STORAGE_KEY, matched); } catch {}
        }
        try { localStorage.setItem(CITY_AUTO_DETECTED_KEY, "auto"); } catch {}
      })
      .catch(() => {
        // тихо игнорируем — оставляем дефолт
      })
      .finally(() => window.clearTimeout(timeout));

    return () => {
      cancelled = true;
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, []);

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
