import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import SupportAvatar from "@/components/chat/SupportAvatar";
import { getCompanyChats, type CompanyChatEntry } from "@/lib/companyChats";
import Seo from "@/components/Seo";
import { useMessagesNavigation } from "@/contexts/MessagesNavigationContext";

const Messages = () => {
  const navigate = useNavigate();
  const { exitMessages } = useMessagesNavigation();
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
    <div className="flex h-dvh flex-col bg-background font-sans">
      <Seo title="Сообщения — многоместа.рф" description="Чаты с поддержкой и партнёрами." canonicalPath="/messages" noIndex />
      <header className="shrink-0 border-b border-border bg-background pt-[env(safe-area-inset-top)]">
        <div className="flex h-16 items-center px-4">
          <button
            type="button"
            onClick={exitMessages}
            className="mr-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius)] text-foreground transition-colors active:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            aria-label="Вернуться на сайт"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={1.8} aria-hidden />
          </button>
          <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-foreground">Сообщения</h1>
        </div>
      </header>
      <main className="flex flex-1 flex-col overflow-y-auto bg-background">
        {/* Support */}
        <button
          onClick={() => navigate("/messages/support")}
          className="flex min-h-[80px] w-full shrink-0 items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-secondary active:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/30"
        >
          <SupportAvatar size="lg" />
          <div className="flex-1 min-w-0">
            <span className="block truncate text-[15px] font-semibold text-foreground">Поддержка Много места</span>
            <p className="mt-0.5 truncate text-[13px] text-muted-foreground">Ответим на вопросы о сервисе</p>
          </div>
        </button>

        {/* Чат "Стать партнером" временно скрыт */}

        {/* Company chats */}
        {companyChats.map((chat) => {
          const initials = chat.company.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
          return (
            <div key={chat.company}>
              <div className="h-px bg-border mx-4" />
              <button
                onClick={() => navigate(`/messages/company?company=${encodeURIComponent(chat.company)}&project=${encodeURIComponent(chat.project)}&projectId=${chat.projectId}`)}
                className="flex min-h-[80px] w-full shrink-0 items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-secondary active:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/30"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius)] bg-secondary text-foreground">
                  <span className="text-[13px] font-semibold">{initials}</span>
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
      </main>
    </div>
  );
};

export default Messages;
