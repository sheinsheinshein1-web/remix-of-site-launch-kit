import { useState, useEffect } from "react";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import SupportAvatar from "@/components/chat/SupportAvatar";
import { getCompanyChats, type CompanyChatEntry } from "@/lib/companyChats";
import { useMessagesNavigation } from "@/contexts/MessagesNavigationContext";

const staticChats = [
  {
    id: "support",
    title: "Поддержка Много места",
    subtitle: "Ответим на вопросы о сервисе",
    href: "/messages/support",
  },
  // Чат "Стать партнером" временно скрыт
];

const DesktopMessagesLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { exitMessages } = useMessagesNavigation();
  const activePath = location.pathname + location.search;
  const hasActiveChat = location.pathname !== "/messages";
  const pageTitle = location.pathname === "/messages/support" ? "Поддержка" : "Сообщения";
  const [companyChats, setCompanyChats] = useState<CompanyChatEntry[]>([]);

  useEffect(() => {
    setCompanyChats(getCompanyChats());
  }, []);

  // Re-read on route change (new company chat may have been created)
  useEffect(() => {
    setCompanyChats(getCompanyChats());
  }, [location.pathname, location.search]);

  return (
    <div className="min-h-dvh bg-background font-sans">
      <header className="border-b border-border bg-background" aria-label="Навигация сообщений">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center px-4 md:px-8 lg:px-12">
          <button
            type="button"
            onClick={exitMessages}
            className="inline-flex min-h-11 items-center gap-2 rounded-[var(--radius)] px-2 text-[14px] font-medium text-foreground transition-colors hover:bg-secondary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            aria-label="Вернуться на сайт"
          >
            <ArrowLeft className="h-[18px] w-[18px]" strokeWidth={1.7} aria-hidden />
            На сайт
          </button>
          <h1 className="ml-5 text-[20px] font-semibold tracking-[-0.025em] text-foreground md:text-[22px]">
            {pageTitle}
          </h1>
        </div>
      </header>
      <main className="px-4 py-5 md:px-8 lg:px-12 lg:py-6">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid h-[calc(100dvh-104px)] min-h-[560px] grid-cols-[220px_minmax(0,1fr)] gap-6 sm:h-[calc(100dvh-112px)] lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-8">
            {/* Left sidebar - chat list */}
            <aside className="flex min-h-0 flex-col" aria-label="Список сообщений">
              <div className="flex-1 space-y-1 overflow-y-auto pr-1">
                {/* Static chats */}
                {staticChats.map((chat) => {
                  const isActive = activePath.startsWith(chat.href);
                  return (
                    <button
                      key={chat.id}
                      onClick={() => navigate(chat.href)}
                      className={`flex min-h-[72px] w-full items-center gap-3 rounded-[var(--radius)] px-3 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/30 ${
                        isActive ? "bg-secondary" : "hover:bg-secondary/70"
                      }`}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <SupportAvatar size="lg" />
                      <div className="flex-1 min-w-0">
                        <span className={`block truncate text-[14px] text-foreground ${isActive ? "font-semibold" : "font-medium"}`}>{chat.title}</span>
                        <p className="text-[13px] text-muted-foreground mt-0.5 truncate">{chat.subtitle}</p>
                      </div>
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
                      className={`flex min-h-[72px] w-full items-center gap-3 rounded-[var(--radius)] px-3 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/30 ${
                        isActive ? "bg-secondary" : "hover:bg-secondary/70"
                      }`}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius)] bg-secondary text-foreground">
                        <span className="text-[12px] font-semibold">{initials}</span>
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
            </aside>

            {/* Right area - active chat or placeholder */}
            <section className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-[var(--radius)] border border-border bg-background" aria-label="Переписка">
              {hasActiveChat ? (
                <Outlet />
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="mx-auto mb-4 h-7 w-7 text-muted-foreground" strokeWidth={1.6} aria-hidden />
                    <p className="text-[14px] text-muted-foreground">Выберите чат</p>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DesktopMessagesLayout;
