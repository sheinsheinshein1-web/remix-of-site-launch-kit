import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
import Seo from "@/components/Seo";
import SupportAvatar from "@/components/chat/SupportAvatar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMessagesNavigation } from "@/contexts/MessagesNavigationContext";

const API = "https://sheinsheinshein1-web-chat-telegram-bridge-77c4.twc1.net";
const STORAGE_KEY_PREFIX = "support_chat_messages";
const STORAGE_TTL = 7 * 24 * 60 * 60 * 1000;

interface Message {
  id: number;
  text: string;
  fromSupport: boolean;
  time: string;
}

interface BridgeMessage {
  timestamp: number;
  text: string;
  from: string;
}

const initialMessages: Message[] = [
  { id: 1, text: "Здравствуйте! Добро пожаловать в службу поддержки. Чем можем помочь?", fromSupport: true, time: "19:05" },
  { id: 2, text: "Здесь можно задать вопрос о проектах, производителях или работе сервиса.", fromSupport: true, time: "19:05" },
];

const quickActions = [
  "Вопрос по проекту",
  "Вопрос о производителе",
  "Работа сервиса",
  "Другой вопрос",
];

function getSessionId(): string {
  const key = "support_chat_session";
  let id = localStorage.getItem(key);
  if (!id) {
    id = `s_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    localStorage.setItem(key, id);
  }
  return id;
}

function formatTime(ts?: number): string {
  const d = ts ? new Date(ts) : new Date();
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function getStorageKey(sessionId: string): string {
  return `${STORAGE_KEY_PREFIX}_${sessionId}`;
}

function loadStoredMessages(sessionId: string): Message[] {
  try {
    const storageKey = getStorageKey(sessionId);
    const raw = localStorage.getItem(storageKey);
    if (!raw) return initialMessages;

    const data = JSON.parse(raw);
    if (!data.savedAt || Date.now() - data.savedAt > STORAGE_TTL) {
      localStorage.removeItem(storageKey);
      return initialMessages;
    }

    return Array.isArray(data.messages) && data.messages.length > 0 ? data.messages : initialMessages;
  } catch {
    return initialMessages;
  }
}

function saveStoredMessages(sessionId: string, messages: Message[]) {
  localStorage.setItem(getStorageKey(sessionId), JSON.stringify({ savedAt: Date.now(), messages }));
}

function mergeMessages(current: Message[], incoming: Message[]): Message[] {
  const next = [...current];

  incoming.forEach((message) => {
    const duplicate = next.some((item) => {
      if (item.id === message.id) return true;
      return (
        item.fromSupport === message.fromSupport &&
        item.text === message.text &&
        Math.abs(item.id - message.id) < 5000
      );
    });

    if (!duplicate) next.push(message);
  });

  return next.sort((a, b) => a.id - b.id);
}

const SupportChat = () => {
  const { backFromChat } = useMessagesNavigation();
  const isMobile = useIsMobile();
  const sessionId = useRef(getSessionId());
  const [messages, setMessages] = useState<Message[]>(() => loadStoredMessages(sessionId.current));
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    saveStoredMessages(sessionId.current, messages);
  }, [messages]);

  // SSE — слушаем ответы оператора
  useEffect(() => {
    const es = new EventSource(`${API}/listen?session=${sessionId.current}`);

    es.onmessage = (e) => {
      const data = JSON.parse(e.data);

      if (data.type === "history") {
        const restored: Message[] = data.messages
          .map((m: BridgeMessage) => ({
            id: m.timestamp,
            text: m.text,
            fromSupport: m.from === "admin",
            time: formatTime(m.timestamp),
          }));
        if (restored.length > 0) {
          setMessages((prev) => mergeMessages(prev, restored));
        }
        return;
      }

      if (data.from === "admin") {
        const timestamp = data.timestamp || Date.now();
        setMessages((prev) => mergeMessages(prev, [
          { id: timestamp, text: data.text, fromSupport: true, time: formatTime(timestamp) },
        ]));
      }
    };

    return () => es.close();
  }, []);

  // Скролл вниз при новых сообщениях
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text = input.trim()) => {
    if (!text) return;
    const timestamp = Date.now();
    const time = formatTime(timestamp);

    setMessages((prev) => [...prev, { id: timestamp, text, fromSupport: false, time }]);
    setInput("");

    try {
      await fetch(`${API}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session: sessionId.current, text }),
      });
    } catch {
      // сеть недоступна — сообщение уже показано локально
    }
  };

  const handleQuickAction = (action: string) => sendMessage(action);

  const chatHeader = (mobile = false) => (
    <header className="shrink-0 border-b border-border bg-background">
      <div className={`flex h-16 items-center gap-3 ${mobile ? "px-3" : "px-5 lg:px-6"}`}>
        {mobile && (
          <button
            type="button"
            onClick={backFromChat}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[3px] text-foreground transition-colors hover:bg-secondary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            aria-label="Назад"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={1.8} aria-hidden />
          </button>
        )}
        <SupportAvatar size="md" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-semibold leading-tight text-foreground">Поддержка Много места</p>
          <p className="mt-1 truncate text-[12px] text-muted-foreground">Поможем с проектами и работой сервиса</p>
        </div>
      </div>
    </header>
  );

  const messageThread = (
    <div className="flex flex-col gap-3" role="log" aria-live="polite" aria-label="Сообщения поддержки">
      {messages.map((msg) => (
        <div key={msg.id} className={`flex ${msg.fromSupport ? "justify-start" : "justify-end"}`}>
          <div
            className={`max-w-[88%] rounded-[3px] px-4 py-3 sm:max-w-[72%] lg:max-w-[680px] ${
              msg.fromSupport
                ? "bg-secondary text-foreground"
                : "bg-primary text-primary-foreground"
            }`}
          >
            <p className="whitespace-pre-wrap text-[15px] leading-relaxed">{msg.text}</p>
            <p className={`mt-1.5 text-right text-[11px] ${msg.fromSupport ? "text-muted-foreground" : "text-primary-foreground/75"}`}>
              {msg.time}
            </p>
          </div>
        </div>
      ))}

      {messages.length <= 3 && (
        <div className="mt-2 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap" aria-label="Быстрые вопросы">
          {quickActions.map((action) => (
            <button
              key={action}
              type="button"
              onClick={() => handleQuickAction(action)}
              className="min-h-11 rounded-[3px] border border-border bg-background px-3.5 py-2 text-[13px] font-medium text-foreground transition-colors hover:border-primary/25 hover:bg-secondary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            >
              {action}
            </button>
          ))}
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );

  const composer = (mobile = false) => (
    <div className={`shrink-0 border-t border-border bg-background ${mobile ? "pb-[max(env(safe-area-inset-bottom),12px)]" : ""}`}>
      <form
        className="flex w-full items-center gap-2 px-3 py-3 sm:px-5 lg:px-6"
        onSubmit={(event) => {
          event.preventDefault();
          void sendMessage();
        }}
      >
        <label htmlFor={mobile ? "support-message-mobile" : "support-message-desktop"} className="sr-only">Сообщение</label>
        <input
          id={mobile ? "support-message-mobile" : "support-message-desktop"}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Введите сообщение"
          autoComplete="off"
          className="h-12 min-w-0 flex-1 rounded-[3px] border border-input bg-background px-4 text-[16px] text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[3px] bg-primary text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Отправить сообщение"
        >
          <Send className="h-5 w-5" strokeWidth={1.8} aria-hidden />
        </button>
      </form>
    </div>
  );

  const desktopThread = (
    <div className="flex min-h-0 flex-1 flex-col bg-background">
      {chatHeader()}
      <div className="flex-1 overflow-y-auto px-5 py-6 lg:px-6">
        {messageThread}
      </div>
      {composer()}
    </div>
  );

  // Mobile: full-screen chat page
  if (isMobile) {
    return (
      <div className="flex h-dvh flex-col overflow-hidden bg-background font-sans">
        <Seo title="Поддержка — многоместа.рф" description="Чат со службой поддержки сервиса многоместа.рф." canonicalPath="/messages/support" noIndex />
        <div className="pt-[env(safe-area-inset-top)]">
          {chatHeader(true)}
        </div>
        <main className="flex-1 overflow-y-auto px-4 py-5">
          {messageThread}
        </main>
        {composer(true)}
      </div>
    );
  }

  // Desktop: rendered inside Outlet of DesktopMessagesLayout
  return (
    <>
      <Seo title="Поддержка — многоместа.рф" description="Чат со службой поддержки сервиса многоместа.рф." canonicalPath="/messages/support" noIndex />
      {desktopThread}
    </>
  );
};

export default SupportChat;
