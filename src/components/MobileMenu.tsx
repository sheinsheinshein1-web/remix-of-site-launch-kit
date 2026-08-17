import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight, X } from "lucide-react";
import logoColor from "@/assets/logo-mnogo-mesta.png";
import { siteNavigation } from "@/data/siteNavigation";

interface MobileMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPartnerCta?: () => void;
  hidePartnerCta?: boolean;
}

type MobileLink = {
  label: string;
  path: string;
};

const informationLinks: MobileLink[] = [
  { label: "Поддержка", path: "/messages/support" },
  { label: "Контакты", path: "mailto:hello@mnogomesta.com" },
];

type LinkSectionProps = {
  items: MobileLink[];
  onNavigate: () => void;
};

const LinkSection = ({ items, onNavigate }: LinkSectionProps) => (
  <section className="px-5 pb-5 pt-0">
    <nav aria-label="Дополнительная навигация" className="space-y-1">
      {items.map((item) => (
        <Link
          key={item.label}
          to={item.path}
          onClick={onNavigate}
          className="group -mx-3 flex min-h-14 items-center justify-between gap-4 rounded-[4px] px-3 py-2 text-[17px] font-semibold text-foreground transition-colors duration-200 hover:bg-secondary hover:text-primary active:bg-secondary active:text-primary focus-visible:bg-secondary focus-visible:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
        >
          <span>{item.label}</span>
          <ChevronRight
            className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary group-focus-visible:text-primary"
            strokeWidth={1.6}
            aria-hidden
          />
        </Link>
      ))}
    </nav>
  </section>
);

const MobileMenu = ({ open, onOpenChange, onPartnerCta, hidePartnerCta = false }: MobileMenuProps) => {
  const [mounted, setMounted] = useState(false);
  const [openNavigationSection, setOpenNavigationSection] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const closeMenu = () => onOpenChange(false);
  const handlePartnerCta = () => {
    closeMenu();
    onPartnerCta?.();
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    menuRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      onOpenChange(false);
      window.requestAnimationFrame(() => document.getElementById("mobile-menu-toggle")?.focus());
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onOpenChange]);

  useEffect(() => {
    if (!open) setOpenNavigationSection(null);
  }, [open]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      id="mobile-navigation"
      ref={menuRef}
      role="dialog"
      aria-modal="true"
      aria-label="Навигация"
      tabIndex={-1}
      className="fixed inset-0 z-[60] flex flex-col bg-background text-foreground outline-none xl:hidden"
    >
      <div className="mx-auto flex h-[50px] w-full max-w-[1400px] shrink-0 items-center px-4 md:h-16 md:px-9 lg:px-12">
        <Link to="/" onClick={closeMenu} className="flex items-center md:h-11">
          <img
            src={logoColor}
            alt="Много места"
            className="h-[18px] w-auto dark:brightness-0 dark:invert md:h-[23px]"
            loading="eager"
            decoding="async"
          />
        </Link>

        <button
          type="button"
          className="ml-auto inline-flex h-9 w-9 items-center justify-center text-[#342d27] transition-colors dark:text-white"
          aria-label="Закрыть меню"
          onClick={closeMenu}
        >
          <X className="h-6 w-6" strokeWidth={1.35} aria-hidden />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <nav aria-label="Основная навигация" className="space-y-1 px-5 py-2">
          {siteNavigation.map((section) => {
            const expanded = openNavigationSection === section.label;

            return (
              <div key={section.label}>
                  <button
                    type="button"
                    onClick={() => setOpenNavigationSection(expanded ? null : section.label)}
                    className={`-mx-3 flex min-h-14 w-[calc(100%+1.5rem)] items-center justify-between gap-4 rounded-[4px] px-3 py-2 text-left text-[17px] font-semibold transition-colors duration-200 hover:bg-secondary hover:text-primary active:bg-secondary active:text-primary focus-visible:bg-secondary focus-visible:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${
                      expanded ? "bg-secondary text-primary" : "text-foreground"
                    }`}
                    aria-expanded={expanded}
                    aria-controls={`mobile-navigation-${section.label}`}
                  >
                    {section.label}
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
                      strokeWidth={1.7}
                      aria-hidden
                    />
                  </button>

                  {expanded && (
                    <div id={`mobile-navigation-${section.label}`} className="pb-3">
                      {section.items.map((item) => (
                        <Link
                          key={item.label}
                          to={item.path}
                          onClick={closeMenu}
                          className="-mx-3 flex min-h-11 w-[calc(100%+1.5rem)] items-center rounded-[3px] px-3 py-2 text-[15px] leading-snug text-muted-foreground transition-colors duration-200 hover:bg-secondary hover:text-primary active:bg-secondary active:text-primary focus-visible:bg-secondary focus-visible:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
              </div>
            );
          })}
        </nav>

        <LinkSection items={informationLinks} onNavigate={closeMenu} />
        {!hidePartnerCta && (
          <div className="px-5 pb-5 pt-1">
            {onPartnerCta ? (
              <button
                type="button"
                onClick={handlePartnerCta}
                className="flex min-h-12 w-full items-center justify-center rounded-[3px] bg-primary px-3 text-center text-[15px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Разместиться бесплатно
              </button>
            ) : (
              <Link
                to="/partner"
                onClick={closeMenu}
                className="flex min-h-12 w-full items-center justify-center rounded-[3px] bg-primary px-3 text-center text-[15px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Для производителей
              </Link>
            )}
          </div>
        )}
        <div className="h-[max(env(safe-area-inset-bottom),20px)]" aria-hidden />
      </div>
    </div>,
    document.body,
  );
};

export default MobileMenu;
