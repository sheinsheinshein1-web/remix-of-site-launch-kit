import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import logoColor from "@/assets/logo-color.svg";
import logoIcon from "@/assets/logo-icon.svg";
import { SlidersHorizontal, ChevronDown, LayoutGrid, Heart, MessageSquare } from "lucide-react";
import MobileMenu from "./MobileMenu";
import SearchDropdown from "./SearchDropdown";
import CitySelector, { useCity } from "./CitySelector";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  // Синхронно определяем, возвращаемся ли мы на проскролленную главную.
  // Если да — стартуем со скрытым синим хедером (но БЕЗ компактного поиска),
  // чтобы он не мелькнул на долю секунды до восстановления скролла.
  const isReturningScrolled = (() => {
    if (typeof window === "undefined") return false;
    if (window.scrollY > 10) return true;
    const saved = sessionStorage.getItem("home_feed_scroll");
    if (!saved) return false;
    const y = parseInt(saved, 10);
    return Number.isFinite(y) && y > 10;
  })();
  const [showCompactHeader, setShowCompactHeader] = useState(false);
  const [scrolled, setScrolled] = useState(isReturningScrolled);
  const [mobileScrolled, setMobileScrolled] = useState(isReturningScrolled);
  // Подавляем transition на первые кадры при возврате, чтобы не было мелькания
  const [enableTransitions, setEnableTransitions] = useState(!isReturningScrolled);
  const [cityOpen, setCityOpen] = useState(false);
  const { city, selectCity } = useCity();

  useEffect(() => {
    let lastY = window.scrollY;
    let upDistance = 0; // накопленное расстояние скролла вверх
    const UP_THRESHOLD = 80; // пикселей вверх до показа компактного хедера
    // Первые ~400ms игнорируем «скролл», чтобы восстановление позиции из
    // sessionStorage (FeaturedProjects делает scrollTo) не считалось «скроллом вверх»
    let settled = false;
    const settleTimer = window.setTimeout(() => {
      settled = true;
      lastY = window.scrollY;
      setEnableTransitions(true);
    }, 500);

    const sync = () => {
      const y = window.scrollY;
      const pastThreshold = y > 60;
      setScrolled(pastThreshold);
      setMobileScrolled(y > 10);
      lastY = y;
    };
    sync();
    const raf = requestAnimationFrame(sync);

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY;
      const pastThreshold = y > 60;
      setScrolled(pastThreshold);
      setMobileScrolled(y > 10);

      // Пока не «устаканились» — только обновляем lastY, не трогаем компактный хедер
      if (!settled) {
        lastY = y;
        return;
      }

      const scrollingDown = delta > 0;
      if (scrollingDown) {
        upDistance = 0;
        setShowCompactHeader(false);
      } else if (delta < 0) {
        upDistance += -delta;
        if (pastThreshold && upDistance >= UP_THRESHOLD) {
          setShowCompactHeader(true);
        }
      }

      if (!pastThreshold) {
        upDistance = 0;
        setShowCompactHeader(false);
      }

      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(settleTimer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Mobile header */}
      <div className="md:hidden relative">
        {/* Safe-area background — виден всегда при скролле, чтобы под status bar не просвечивал контент */}
        <div className={`absolute inset-x-0 top-0 z-0 bg-background h-[max(env(safe-area-inset-top),12px)] ${enableTransitions ? 'transition-opacity duration-300' : ''} ${mobileScrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} aria-hidden />

        {/* Static header - visible when not scrolled */}
        <div className={`relative z-10 ${enableTransitions ? 'transition-all duration-300' : ''} ${mobileScrolled ? 'opacity-0 pointer-events-none scale-95 -translate-y-full' : 'opacity-100 scale-100 translate-y-0'}`}>
          <div className="bg-background px-3 pt-[max(env(safe-area-inset-top),6px)] pb-1.5">
            <div className="flex items-center justify-between">
              <Link to="/" className="text-[22px] font-bold text-foreground tracking-tight">
                Много места
              </Link>
              <button onClick={() => setCityOpen(true)} className="flex items-center gap-1 text-[13px] font-medium text-primary bg-secondary rounded-xl h-9 px-3">
                {city}
                <ChevronDown className="w-3.5 h-3.5 text-primary" strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>

        {/* Compact white header - visible when scrolled */}
        <div className={`absolute inset-x-0 top-0 z-20 ${enableTransitions ? 'transition-all duration-300' : ''} ${showCompactHeader ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="bg-background px-3 pt-[max(env(safe-area-inset-top),12px)] pb-3 rounded-b-2xl shadow-sm">
            <SearchDropdown inputClassName="bg-secondary" />
          </div>
        </div>
      </div>

      {/* Desktop header */}
      <div className="hidden md:block relative">
        {/* Full blue header - visible when not scrolled */}
        <div className={`transition-all duration-300 ${scrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <div className="max-w-[1400px] mx-auto">
            <div className="bg-primary rounded-b-2xl px-8 pt-4 pb-4">
              {/* Top row: logo + location + nav + CTA */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-6">
                  <a href="/" className="flex items-center">
                    <img src={logoColor} alt="многоместа.рф" className="h-9 brightness-0 invert" />
                  </a>
                  <button onClick={() => setCityOpen(true)} className="inline-flex items-center gap-1.5 text-primary-foreground/90 hover:text-primary-foreground transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                    <span className="text-sm font-medium">{city}</span>
                    <ChevronDown className="w-4 h-4 opacity-70" />
                  </button>
                </div>

                <div className="flex items-center gap-6">
                  <nav className="flex items-center gap-6">
                    <Link to="/categories" className={`text-[15px] transition-colors flex items-center gap-1.5 ${location.pathname === "/categories" || location.pathname === "/catalog" ? "font-semibold text-primary-foreground" : "font-medium text-primary-foreground/80 hover:text-primary-foreground"}`}><LayoutGrid className="w-[18px] h-[18px] fill-current" strokeWidth={1.5} />Категории</Link>
                    <Link to="/favorites" className={`text-[15px] transition-colors flex items-center gap-1.5 ${location.pathname === "/favorites" ? "font-semibold text-primary-foreground" : "font-medium text-primary-foreground/80 hover:text-primary-foreground"}`}><Heart className="w-[18px] h-[18px] fill-current" strokeWidth={1.5} />Избранное</Link>
                    <Link to="/messages" className={`text-[15px] transition-colors flex items-center gap-1.5 ${location.pathname.startsWith("/messages") ? "font-semibold text-primary-foreground" : "font-medium text-primary-foreground/80 hover:text-primary-foreground"}`}><MessageSquare className="w-[18px] h-[18px] fill-current" strokeWidth={1.5} />Сообщения</Link>
                  </nav>
                  <button onClick={() => navigate("/partner")} className="text-sm font-medium text-primary bg-primary-foreground rounded-xl px-5 py-2.5 hover:opacity-90 transition-opacity">
                    Стать партнером
                  </button>
                </div>
              </div>

              {/* Search row */}
              <SearchDropdown inputClassName="bg-card" />
            </div>
          </div>
        </div>

        {/* Compact white header - visible when scrolled */}
        <div className={`transition-all duration-300 absolute inset-x-0 top-0 ${scrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="max-w-[1400px] mx-auto">
            <div className="bg-background backdrop-blur-lg shadow-sm rounded-b-2xl">
              <div className="flex items-center gap-6 px-8 py-3">
                <Link to="/" className="flex items-center flex-shrink-0">
                  <img src={logoColor} alt="многоместа.рф" className="h-8" />
                </Link>
                <div className="flex-1">
                  <SearchDropdown inputClassName="bg-secondary" />
                </div>
                <nav className="flex items-center gap-5 flex-shrink-0">
                  <Link to="/categories" className={`text-[15px] transition-colors flex items-center gap-1.5 ${location.pathname === "/categories" || location.pathname === "/catalog" ? "font-semibold text-foreground" : "font-medium text-muted-foreground hover:text-foreground"}`}><LayoutGrid className="w-[18px] h-[18px] fill-current" strokeWidth={1.5} />Категории</Link>
                  <Link to="/favorites" className={`text-[15px] transition-colors flex items-center gap-1.5 ${location.pathname === "/favorites" ? "font-semibold text-foreground" : "font-medium text-muted-foreground hover:text-foreground"}`}><Heart className="w-[18px] h-[18px] fill-current" strokeWidth={1.5} />Избранное</Link>
                  <Link to="/messages" className={`text-[15px] transition-colors flex items-center gap-1.5 ${location.pathname.startsWith("/messages") ? "font-semibold text-foreground" : "font-medium text-muted-foreground hover:text-foreground"}`}><MessageSquare className="w-[18px] h-[18px] fill-current" strokeWidth={1.5} />Сообщения</Link>
                </nav>
                <button onClick={() => navigate("/partner")} className="text-sm font-medium text-foreground bg-secondary rounded-xl px-4 py-2 hover:bg-secondary/80 transition-colors flex-shrink-0">
                  Стать партнером
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
    <MobileMenu open={menuOpen} onOpenChange={setMenuOpen} />
    <CitySelector open={cityOpen} onOpenChange={setCityOpen} city={city} onSelect={selectCity} />
    </>
  );
};

export default Header;
