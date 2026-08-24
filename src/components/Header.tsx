import { useState, useEffect } from "react";
import { useNavigate, useLocation, useNavigationType, Link } from "react-router-dom";
import logoColor from "@/assets/logo-mnogo-mesta.png";
import logoIcon from "@/assets/logo-icon.svg";
import logoMark from "@/assets/logo-mark.svg";
import logoMarkWhite from "@/assets/logo-mark-white.svg";
import { Menu, X, SlidersHorizontal, ChevronDown, LayoutGrid, Heart, MessageSquare } from "lucide-react";
import MobileMenu from "./MobileMenu";
import DesktopNavigation from "./DesktopNavigation";
import SearchDropdown from "./SearchDropdown";
import CitySelector, { useCity } from "./CitySelector";
import { getSavedScrollPosition } from "@/lib/scrollRestoration";
import { getGeoSelectionLabel, isAllRegionsGeo, normalizeGeoSelection } from "@/lib/geoSelection";
import { useFavorites } from "@/contexts/FavoritesContext";
import { CATALOG_PATH, getRegionPath } from "@/lib/siteRoutes";

type HeaderProps = {
  variant?: "default" | "home" | "partner";
  onPartnerCta?: () => void;
};

const Header = ({ variant = "default", onPartnerCta }: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";
  const useMarketplaceHeader = isHome || variant === "home" || variant === "partner";
  const navigationType = useNavigationType();
  const [menuOpen, setMenuOpen] = useState(false);
  // Синхронно определяем, возвращаемся ли мы на проскролленную главную.
  // Только при POP (кнопка «Назад» браузера) — при PUSH (клик по таб-бару/лого)
  // считаем, что страница открывается с нуля, чтобы не показывать компактный поиск.
  const isReturningScrolled = (() => {
    if (typeof window === "undefined") return false;
    if (!isHome) return false;
    if (navigationType !== "POP") return false;
    if (window.scrollY > 10) return true;
    const saved = getSavedScrollPosition(location.key);
    return saved !== undefined && saved > 10;
  })();
  const [showCompactHeader, setShowCompactHeader] = useState(isReturningScrolled);
  const [scrolled, setScrolled] = useState(isReturningScrolled);
  const [mobileScrolled, setMobileScrolled] = useState(isReturningScrolled);
  // Подавляем transition на первые кадры при возврате, чтобы не было мелькания
  const [enableTransitions, setEnableTransitions] = useState(!isReturningScrolled);
  const [cityOpen, setCityOpen] = useState(false);
  const { city, selectCity, hasExplicitSelection } = useCity();
  const { favoriteCount } = useFavorites();
  const cityLabel = hasExplicitSelection ? getGeoSelectionLabel(city) : "Выберите регион";
  const favoritesAriaLabel = favoriteCount > 0
    ? `Избранное, сохранено: ${favoriteCount}`
    : "Избранное";
  const showMarketplaceNavigation = !scrolled || showCompactHeader;

  const handleCitySelect = (nextCity: string) => {
    const normalizedCity = normalizeGeoSelection(nextCity);
    selectCity(normalizedCity);
    const isRegionPage = location.pathname.startsWith("/region/")
      || (location.pathname.startsWith("/modulnye-doma/") && !location.pathname.includes("/proekty/"));
    if (isRegionPage) {
      navigate(isAllRegionsGeo(normalizedCity) ? CATALOG_PATH : getRegionPath(normalizedCity));
    }
  };

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

  if (useMarketplaceHeader) {
    const homeHeaderText = "text-[#342d27]/90 hover:text-primary dark:text-white/85 dark:hover:text-primary";

    return (
      <>
        <header className="fixed inset-x-0 top-0 z-50 border-b border-border/70 bg-white text-[#342d27] dark:bg-background dark:text-foreground">
          <div className="mx-auto flex h-[50px] w-full max-w-[1400px] items-center px-4 md:h-[60px] md:px-9 lg:px-12">
            <Link to="/" className="flex items-center md:h-11">
              <img src={logoColor} alt="Много места" className="h-[18px] w-auto dark:brightness-0 dark:invert md:h-[23px]" loading="eager" decoding="async" />
            </Link>

            <button
              type="button"
              onClick={() => setCityOpen(true)}
              className="ml-2 inline-flex h-8 min-w-0 max-w-[136px] items-center gap-0.5 text-[12px] font-medium tracking-normal text-[#342d27]/90 transition-colors hover:text-primary md:ml-5 md:h-11 md:max-w-[210px] md:gap-1.5 md:text-[15px]"
              aria-label={hasExplicitSelection
                ? `Выбрать регион. Сейчас выбран: ${cityLabel}`
                : "Выбрать регион"}
            >
              <span className="truncate">{cityLabel}</span>
              <ChevronDown className="h-3 w-3 shrink-0 md:h-4 md:w-4" strokeWidth={1.6} aria-hidden />
            </button>

            <div className="ml-auto hidden items-center gap-3 lg:flex">
              <Link
                to="/favorites"
                aria-label={favoritesAriaLabel}
                aria-current={location.pathname === "/favorites" ? "page" : undefined}
                className={`inline-flex h-11 items-center gap-2 whitespace-nowrap px-2 text-[14px] font-medium tracking-normal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${
                  location.pathname === "/favorites"
                    ? "text-primary"
                    : homeHeaderText
                }`}
              >
                <Heart className="h-[18px] w-[18px]" strokeWidth={1.6} aria-hidden />
                Избранное
              </Link>
              {onPartnerCta ? (
                <button
                  type="button"
                  onClick={onPartnerCta}
                  className="inline-flex h-11 items-center whitespace-nowrap rounded-[3px] bg-primary px-6 text-[14px] font-semibold tracking-normal text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  Разместиться бесплатно
                </button>
              ) : variant !== "partner" ? (
                <Link
                  to="/partner/"
                  aria-current={location.pathname === "/partner/" ? "page" : undefined}
                  className="inline-flex h-11 items-center whitespace-nowrap rounded-[3px] bg-primary px-6 text-[14px] font-semibold tracking-normal text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  Для производителей
                </Link>
              ) : null}
            </div>

            <Link
              to="/favorites"
              aria-label={favoritesAriaLabel}
              aria-current={location.pathname === "/favorites" ? "page" : undefined}
              className={`ml-auto inline-flex h-11 w-11 shrink-0 items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 lg:hidden ${
                location.pathname === "/favorites" ? "text-primary" : "text-[#342d27] hover:text-primary dark:text-white dark:hover:text-primary"
              }`}
            >
              <Heart className="h-[21px] w-[21px]" strokeWidth={1.55} aria-hidden />
            </Link>

            <button
              id="mobile-menu-toggle"
              type="button"
              className="ml-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center text-[#342d27] transition-colors hover:text-primary lg:hidden"
              aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMenuOpen((current) => !current)}
            >
              {menuOpen ? (
                <X className="h-6 w-6" strokeWidth={1.35} aria-hidden />
              ) : (
                <Menu className="h-6 w-6" strokeWidth={1.2} aria-hidden />
              )}
            </button>
          </div>

          <div
            className={`hidden transition-[max-height,opacity] duration-200 motion-reduce:transition-none md:block ${
              showMarketplaceNavigation
                ? "max-h-[60px] overflow-visible border-t border-border/70 opacity-100"
                : "pointer-events-none max-h-0 overflow-hidden border-t-0 opacity-0"
            }`}
          >
            <div className="mx-auto flex h-[60px] w-full max-w-[1400px] items-center px-9 lg:px-12">
              <DesktopNavigation
                className="h-[60px] gap-7 text-[14px] font-medium tracking-normal"
                triggerClassName={homeHeaderText}
              />
            </div>
          </div>
        </header>
        <MobileMenu
          open={menuOpen}
          onOpenChange={setMenuOpen}
          onPartnerCta={onPartnerCta}
          hidePartnerCta={variant === "partner" && !onPartnerCta}
        />
        <CitySelector
          open={cityOpen}
          onOpenChange={setCityOpen}
          city={city}
          onSelect={handleCitySelect}
          hasExplicitSelection={hasExplicitSelection}
        />
      </>
    );
  }

  return (
    <>
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Mobile header */}
      <div className="md:hidden relative">
        {/* Safe-area background — постоянно видна. Не зависит ни от какого state, не моргает при возврате. */}
        <div className="absolute inset-x-0 top-0 z-0 bg-background h-[env(safe-area-inset-top)]" aria-hidden />

        {/* Static header - visible when not scrolled */}
        <div className={`relative z-10 ${enableTransitions ? 'transition-all duration-300' : ''} ${mobileScrolled ? 'opacity-0 pointer-events-none scale-95 -translate-y-full' : 'opacity-100 scale-100 translate-y-0'}`}>
          <div className="bg-background px-3 pt-[max(env(safe-area-inset-top),6px)] pb-1.5">
            <div className="flex items-center justify-between gap-2">
              <Link to="/" className="flex items-center gap-1 text-[24px] font-bold text-foreground tracking-[-0.04em] whitespace-nowrap flex-shrink-0">
                <img src={logoMark} alt="" className="h-[23px] w-[23px]" aria-hidden loading="lazy" decoding="async" />
                Много места
              </Link>
              <button onClick={() => setCityOpen(true)} className="flex items-center gap-1 text-[13px] font-medium text-primary bg-secondary rounded-xl h-9 px-3 max-w-[160px] min-w-0">
                <span className="truncate">{cityLabel}</span>
                <ChevronDown className="w-3.5 h-3.5 text-primary flex-shrink-0" strokeWidth={2} />
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
                  <a href="/" className="flex items-center gap-1.5 text-[26px] font-bold text-primary-foreground tracking-[-0.04em]">
                    <img src={logoMarkWhite} alt="" className="h-[25px] w-[25px]" aria-hidden loading="lazy" decoding="async" />
                    Много места
                  </a>
                  <button onClick={() => setCityOpen(true)} className="inline-flex items-center gap-1.5 text-primary-foreground/90 hover:text-primary-foreground transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                    <span className="text-sm font-medium">{cityLabel}</span>
                    <ChevronDown className="w-4 h-4 opacity-70" />
                  </button>
                </div>

                <div className="flex items-center gap-6">
                  <nav className="flex items-center gap-6">
                    <Link to="/categories/" className={`text-[15px] transition-colors flex items-center gap-1.5 ${location.pathname === "/categories/" || location.pathname === CATALOG_PATH ? "font-semibold text-primary-foreground" : "font-medium text-primary-foreground/80 hover:text-primary-foreground"}`}><LayoutGrid className="w-[18px] h-[18px] fill-current" strokeWidth={1.5} />Категории</Link>
                    <Link to="/favorites" className={`text-[15px] transition-colors flex items-center gap-1.5 ${location.pathname === "/favorites" ? "font-semibold text-primary-foreground" : "font-medium text-primary-foreground/80 hover:text-primary-foreground"}`}><Heart className="w-[18px] h-[18px] fill-current" strokeWidth={1.5} />Избранное</Link>
                    <Link to="/messages" className={`text-[15px] transition-colors flex items-center gap-1.5 ${location.pathname.startsWith("/messages") ? "font-semibold text-primary-foreground" : "font-medium text-primary-foreground/80 hover:text-primary-foreground"}`}><MessageSquare className="w-[18px] h-[18px] fill-current" strokeWidth={1.5} />Сообщения</Link>
                  </nav>
                  {/* Кнопка "Стать партнером" временно скрыта */}
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
                <Link to="/" className="flex items-center gap-1.5 text-[24px] font-bold text-foreground tracking-[-0.04em] flex-shrink-0">
                  <img src={logoMark} alt="" className="h-[23px] w-[23px]" aria-hidden loading="lazy" decoding="async" />
                  Много места
                </Link>
                <div className="flex-1">
                  <SearchDropdown inputClassName="bg-secondary" />
                </div>
                <nav className="flex items-center gap-5 flex-shrink-0">
                  <Link to="/categories/" className={`text-[15px] transition-colors flex items-center gap-1.5 ${location.pathname === "/categories/" || location.pathname === CATALOG_PATH ? "font-semibold text-foreground" : "font-medium text-muted-foreground hover:text-foreground"}`}><LayoutGrid className="w-[18px] h-[18px] fill-current" strokeWidth={1.5} />Категории</Link>
                  <Link to="/favorites" className={`text-[15px] transition-colors flex items-center gap-1.5 ${location.pathname === "/favorites" ? "font-semibold text-foreground" : "font-medium text-muted-foreground hover:text-foreground"}`}><Heart className="w-[18px] h-[18px] fill-current" strokeWidth={1.5} />Избранное</Link>
                  <Link to="/messages" className={`text-[15px] transition-colors flex items-center gap-1.5 ${location.pathname.startsWith("/messages") ? "font-semibold text-foreground" : "font-medium text-muted-foreground hover:text-foreground"}`}><MessageSquare className="w-[18px] h-[18px] fill-current" strokeWidth={1.5} />Сообщения</Link>
                </nav>
                {/* Кнопка "Стать партнером" временно скрыта */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
    <MobileMenu
      open={menuOpen}
      onOpenChange={setMenuOpen}
    />
      <CitySelector
        open={cityOpen}
        onOpenChange={setCityOpen}
        city={city}
        onSelect={handleCitySelect}
        hasExplicitSelection={hasExplicitSelection}
      />
    </>
  );
};

export default Header;
