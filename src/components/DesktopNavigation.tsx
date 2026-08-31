import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { siteNavigation } from "@/data/siteNavigation";

type DesktopNavigationProps = {
  className?: string;
  triggerClassName?: string;
};

const DesktopNavigation = ({ className = "", triggerClassName = "" }: DesktopNavigationProps) => (
  <nav aria-label="Основная навигация" className={`flex items-center gap-6 ${className}`}>
    {siteNavigation.map((section) => {
      if (section.type === "link") {
        return (
          <Link
            key={section.label}
            to={section.path}
            className={`inline-flex h-11 items-center whitespace-nowrap transition-colors ${triggerClassName}`}
          >
            {section.label}
          </Link>
        );
      }

      return (
        <div key={section.label} className="group relative">
        <Link
          to={section.path}
          className={`inline-flex h-11 items-center gap-1.5 whitespace-nowrap transition-colors ${triggerClassName}`}
        >
          {section.label}
          <ChevronDown
            className="h-3 w-3 transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180"
            strokeWidth={1.5}
            aria-hidden
          />
        </Link>

        <div
          className={`invisible absolute top-full z-50 opacity-0 transition-[visibility,opacity,transform] duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 ${
            section.align === "right" ? "right-0" : "left-0"
          } ${section.widthClassName}`}
        >
          <div className="mt-1 rounded-[var(--radius)] border border-border bg-background p-2 shadow-[0_16px_45px_rgba(24,28,38,0.14)] dark:shadow-[0_18px_48px_rgba(0,0,0,0.34)]">
            <div className={`grid gap-0.5 ${section.columnsClassName ?? "grid-cols-1"}`}>
              {section.items.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className="flex min-h-10 items-center rounded-[var(--radius)] px-3 py-2 text-[14px] font-normal leading-snug text-foreground transition-colors hover:bg-secondary hover:text-primary focus-visible:bg-secondary focus-visible:text-primary focus-visible:outline-none"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      );
    })}
  </nav>
);

export default DesktopNavigation;
