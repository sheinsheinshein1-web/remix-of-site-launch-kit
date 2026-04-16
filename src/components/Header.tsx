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
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileScrolled, setMobileScrolled] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const { city, selectCity } = useCity();

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > 60 && y > lastY);
      setScrolled(y > 60);
      setMobileScrolled(y > 10);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Mobile header */}
      <div className="md:hidden relative">
        {/* Static header - visible when not scrolled */}
        <div className={`transition-all duration-300 relative z-10 ${mobileScrolled ? 'opacity-0 pointer-events-none scale-95 -translate-y-full' : 'opacity-100 scale-100 translate-y-0'}`}>
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
        <div className={`transition-all duration-300 absolute inset-x-0 top-0 z-20 ${mobileScrolled && !hidden ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
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
