import { useEffect, useState } from "react";
import { Monitor, Moon, Sun, type LucideIcon } from "lucide-react";
import { useTheme } from "next-themes";

type ThemeValue = "system" | "light" | "dark";

const themeOptions: Array<{ value: ThemeValue; label: string; icon: LucideIcon }> = [
  { value: "system", label: "Системная", icon: Monitor },
  { value: "light", label: "Светлая", icon: Sun },
  { value: "dark", label: "Тёмная", icon: Moon },
];

const ThemeToggle = ({ variant = "default" }: { variant?: "default" | "dark" }) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const selectedTheme: ThemeValue = mounted && themeOptions.some((option) => option.value === theme)
    ? theme as ThemeValue
    : "system";

  return (
    <div
      role="radiogroup"
      aria-label="Цветовая тема"
      className={`grid w-full max-w-[390px] grid-cols-3 gap-1 justify-self-start rounded-[var(--radius)] border p-1 ${
        variant === "dark" ? "border-white/15 bg-white/5" : "border-border bg-background"
      }`}
    >
      {themeOptions.map(({ value, label, icon: Icon }) => {
        const selected = selectedTheme === value;

        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => setTheme(value)}
            className={`inline-flex min-h-11 min-w-0 items-center justify-center gap-1.5 rounded-[var(--radius)] px-1.5 text-[12px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 sm:gap-2 sm:px-3 sm:text-[13px] ${
              selected
                ? variant === "dark"
                  ? "bg-white/10 text-white"
                  : "bg-secondary text-primary"
                : variant === "dark"
                  ? "text-white/65 hover:text-primary"
                  : "text-muted-foreground hover:text-primary"
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" strokeWidth={1.7} aria-hidden />
            <span className="whitespace-nowrap">{label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ThemeToggle;
