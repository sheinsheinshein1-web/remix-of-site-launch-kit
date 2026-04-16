import { Home, Heart, MessageCircle, User, LayoutGrid } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const tabs = [
  { icon: Home, path: "/" },
  { icon: LayoutGrid, path: "/categories" },
  { icon: Heart, path: "/favorites" },
  { icon: MessageCircle, path: "/messages" },
];

const MobileTabBar = ({ ctaLabel, onCtaClick }: { ctaLabel?: string; onCtaClick?: () => void }) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background md:hidden pb-[max(env(safe-area-inset-bottom),16px)] rounded-t-2xl shadow-[0_-4px_20px_-4px_hsl(var(--foreground)/0.08)]">
      {ctaLabel && (
        <div className="px-4 pt-3 pb-1">
          <button onClick={onCtaClick} className="w-full h-12 bg-primary text-primary-foreground rounded-xl text-[15px] font-semibold flex items-center justify-center gap-2">
            {ctaLabel}
          </button>
        </div>
      )}
      <div className="flex">
        {tabs.map((tab) => {
          const active = location.pathname === tab.path;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className="flex-1 flex items-center justify-center py-4"
            >
              <tab.icon
                className={`w-[24px] h-[24px] ${active ? "text-primary fill-primary" : "text-muted-foreground fill-muted-foreground"}`}
                strokeWidth={1.5}
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileTabBar;
