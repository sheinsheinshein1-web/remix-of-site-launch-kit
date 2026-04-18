import { useState, useEffect } from "react";
import { Check, MessageSquare } from "lucide-react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import Header from "@/components/Header";
import supportIcon from "@/assets/support-icon.png";
import partnerIcon from "@/assets/partner-icon.png";
import { getCompanyChats, type CompanyChatEntry } from "@/lib/companyChats";

const staticChats = [
  {
    id: "support",
    title: "Поддержка Много места",
    subtitle: "Сообщение",
    time: "19:05",
    icon: supportIcon,
    iconClassName: "w-12 h-12",
    href: "/messages/support",
  },
  {
    id: "partner",
    title: "Стать партнером",
    subtitle: "Сотрудничество",
    icon: partnerIcon,
    iconClassName: "w-20 h-20",
    href: "/partner",
  },
];

const DesktopMessagesLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const activePath = location.pathname + location.search;
  const hasActiveChat = location.pathname !== "/messages";
  const [companyChats, setCompanyChats] = useState<CompanyChatEntry[]>([]);

  useEffect(() => {
    setCompanyChats(getCompanyChats());
  }, []);

  // Re-read on route change (new company chat may have been created)
  useEffect(() => {
    setCompanyChats(getCompanyChats());
  }, [location.pathname, location.search]);

  return (
    <div className="min-h-screen bg-secondary font-sans">
      <Header />
      <main className="pt-[140px] pb-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="bg-background rounded-2xl overflow-hidden h-[calc(100vh-172px)] flex">
            {/* Left sidebar - chat list */}
            <div className="w-[340px] shrink-0 border-r border-border flex flex-col">
              <div className="px-5 py-4 border-b border-border">
                <h1 className="text-lg font-semibold text-foreground">Сообщения</h1>
              </div>
              <div className="flex-1 overflow-y-auto">
                {/* Static chats */}
                {staticChats.map((chat) => {
                  const isActive = activePath.startsWith(chat.href);
                  const isPartner = chat.id === "partner";
                  return (
                    <button
                      key={chat.id}
                      onClick={() => navigate(chat.href)}
                      className={`w-full px-4 py-3.5 flex items-center gap-3 text-left transition-colors ${
                        isActive ? "bg-primary/8" : "hover:bg-secondary/60"
                      }`}
                    >
                      <div className="w-12 h-12 shrink-0 rounded-2xl bg-muted flex items-center justify-center overflow-hidden">
                        <img src={chat.icon} alt={chat.title} className={`${chat.iconClassName} object-contain`} loading="eager" decoding="sync" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[14px] text-foreground truncate ${isActive ? "font-semibold" : "font-medium"}`}>{chat.title}</span>
                          <span className="w-3.5 h-3.5 rounded-full bg-primary/70 flex items-center justify-center shrink-0">
                            <Check className="w-2 h-2 text-primary-foreground" strokeWidth={3} />
                          </span>
                        </div>
                        <p className="text-[13px] text-muted-foreground mt-0.5 truncate">{chat.subtitle}</p>
                      </div>
                      {chat.time && <span className="text-[11px] text-muted-foreground shrink-0">{chat.time}</span>}
                    </button>
                  );
                })}

                {/* Company chats from localStorage */}
                {companyChats.map((chat) => {
                  const href = `/messages/company?company=${encodeURIComponent(chat.company)}&project=${encodeURIComponent(chat.project)}&projectId=${chat.projectId}`;
                  const isActive = location.pathname === "/messages/company" && location.search.includes(encodeURIComponent(chat.company));
                  const initials = chat.company.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
                  return (
                    <button
                      key={chat.company}
                      onClick={() => navigate(href)}
                      className={`w-full px-4 py-3.5 flex items-center gap-3 text-left transition-colors ${
                        isActive ? "bg-primary/8" : "hover:bg-secondary/60"
                      }`}
                    >
                      <div className="w-12 h-12 shrink-0 rounded-2xl bg-foreground flex items-center justify-center">
                        <span className="text-[12px] font-bold text-background">{initials}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[14px] text-foreground truncate ${isActive ? "font-semibold" : "font-medium"}`}>{chat.company}</span>
                        </div>
                        <p className="text-[13px] text-muted-foreground mt-0.5 truncate">{chat.lastMessage}</p>
                      </div>
                      <span className="text-[11px] text-muted-foreground shrink-0">{chat.lastTime}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right area - active chat or placeholder */}
            <div className="flex-1 flex flex-col min-w-0 min-h-0">
              {hasActiveChat ? (
                <Outlet />
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
                      <MessageSquare className="w-7 h-7 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground text-sm">Выберите чат</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DesktopMessagesLayout;
