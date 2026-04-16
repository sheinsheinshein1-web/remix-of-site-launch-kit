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
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden flex justify-center pb-[max(env(safe-area-inset-bottom),8px)]">
      <nav className="bg-foreground/80 backdrop-blur-2xl rounded-2xl shadow-[0_4px_30px_-4px_hsl(var(--foreground)/0.25)] mx-4 px-2"
           style={{ width: 'fit-content', minWidth: '220px', maxWidth: 'calc(100% - 80px)' }}>
        {ctaLabel && (
          <div className="px-3 pt-2 pb-1">
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
                className="flex-1 flex items-center justify-center py-3 px-5"
              >
                <tab.icon
                  className={`w-[22px] h-[22px] ${active ? "text-white fill-white" : "text-white/40 fill-white/40"}`}
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
