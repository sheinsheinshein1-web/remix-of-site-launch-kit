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
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
         style={{ paddingBottom: (window.navigator as any).standalone ? 'calc(env(safe-area-inset-bottom, 0px) + 8px)' : '0px' }}>
      <nav className="bg-background shadow-[0_4px_30px_-4px_hsl(var(--foreground)/0.12)] border-t border-border/50 w-full">
        {ctaLabel && (
          <div className="px-4 pt-2 pb-1">
            <button onClick={onCtaClick} className="w-full h-10 bg-primary text-primary-foreground rounded-xl text-[14px] font-semibold flex items-center justify-center gap-2">
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
                className="flex-1 flex items-center justify-center py-2.5 px-4"
              >
                <tab.icon
                  className={`w-[26px] h-[26px] ${active ? "text-primary fill-primary" : "text-muted-foreground fill-muted-foreground"}`}
                  strokeWidth={1.5}
                />
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default MobileTabBar;
