import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MobileTabBar from "@/components/MobileTabBar";
import { useIsMobile } from "@/hooks/use-mobile";
import supportIcon from "@/assets/support-icon.png";
import partnerIcon from "@/assets/partner-icon.png";
import { getCompanyChats, type CompanyChatEntry } from "@/lib/companyChats";
import PartnerDrawer from "@/components/PartnerDrawer";

const Messages = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [companyChats, setCompanyChats] = useState<CompanyChatEntry[]>([]);

  useEffect(() => {
    setCompanyChats(getCompanyChats());
  }, []);

  // On desktop, the DesktopMessagesLayout handles the list in the sidebar.
  if (!isMobile) {
    return null;
  }

  return (
    <div className="h-screen bg-muted font-sans flex flex-col">
        <div className="sticky top-0 z-40 bg-background rounded-b-2xl shadow-sm shrink-0 pt-[env(safe-area-inset-top)]">
          <div className="flex items-center justify-center h-14">
          <h1 className="text-base font-semibold text-foreground">Сообщения</h1>
        </div>
      </div>
      <div className="mt-2 bg-card rounded-2xl flex-1 flex flex-col overflow-hidden mx-0">
        {/* Support */}
        <button
          onClick={() => navigate("/messages/support")}
          className="w-full px-4 py-3.5 flex items-center gap-3 text-left active:bg-muted/50 hover:bg-muted/30 transition-colors shrink-0"
        >
          <div className="w-14 h-14 shrink-0 rounded-2xl bg-muted flex items-center justify-center overflow-hidden">
            <img src={supportIcon} alt="Поддержка" className="w-12 h-12 object-contain" loading="eager" decoding="sync" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-[15px] text-foreground">Поддержка Много места</span>
              <span className="w-3 h-3 rounded-full bg-primary/70 flex items-center justify-center shrink-0">
                <Check className="w-1.5 h-1.5 text-primary-foreground" strokeWidth={3} />
              </span>
            </div>
            <p className="text-[13px] text-muted-foreground mt-0.5 truncate">Сообщение</p>
          </div>
          <span className="text-[12px] text-muted-foreground shrink-0">19:05</span>
        </button>

        <div className="h-px bg-border mx-4" />

        {/* Partner */}
        <PartnerDrawer>
          <button
            className="w-full px-4 py-3.5 flex items-center gap-3 text-left active:bg-muted/50 hover:bg-muted/30 transition-colors shrink-0"
          >
            <div className="w-14 h-14 shrink-0 rounded-2xl bg-muted flex items-center justify-center overflow-hidden">
              <img src={partnerIcon} alt="Партнер" className="w-24 h-24 object-contain" loading="eager" decoding="sync" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <span className="font-semibold text-[15px] text-foreground">Стать партнером</span>
                <span className="w-3 h-3 rounded-full bg-primary/70 flex items-center justify-center shrink-0">
                  <Check className="w-1.5 h-1.5 text-primary-foreground" strokeWidth={3} />
                </span>
              </div>
              <p className="text-[13px] text-muted-foreground mt-0.5 truncate">Сотрудничество</p>
            </div>
          </button>
        </PartnerDrawer>

        {/* Company chats */}
        {companyChats.map((chat) => {
          const initials = chat.company.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
          return (
            <div key={chat.company}>
              <div className="h-px bg-border mx-4" />
              <button
                onClick={() => navigate(`/messages/company?company=${encodeURIComponent(chat.company)}&project=${encodeURIComponent(chat.project)}&projectId=${chat.projectId}`)}
                className="w-full px-4 py-3.5 flex items-center gap-3 text-left active:bg-muted/50 hover:bg-muted/30 transition-colors shrink-0"
              >
                <div className="w-14 h-14 shrink-0 rounded-2xl bg-foreground flex items-center justify-center">
                  <span className="text-[14px] font-bold text-background">{initials}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-[15px] text-foreground">{chat.company}</span>
                  </div>
                  <p className="text-[13px] text-muted-foreground mt-0.5 truncate">{chat.lastMessage}</p>
                </div>
                <span className="text-[12px] text-muted-foreground shrink-0">{chat.lastTime}</span>
              </button>
            </div>
          );
        })}

        <div className="flex-1" />
      </div>
      <MobileTabBar />
    </div>
  );
};

export default Messages;
