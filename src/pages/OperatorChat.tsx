import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Lock, MessageCircle, RefreshCw, Send } from "lucide-react";

const API = "https://sheinsheinshein1-web-chat-telegram-bridge-77c4.twc1.net";
const TOKEN_KEY = "operator_chat_token";

interface ChatMessage {
  from: "client" | "admin";
  text: string;
  timestamp: number;
  seenByAdmin?: boolean;
  pending?: boolean;
}

interface ChatSession {
  id: string;
  lastActivity: number;
  lastMessage: ChatMessage | null;
  messages: ChatMessage[];
  unread: number;
}

function formatTime(ts?: number): string {
  if (!ts) return "";
  return new Date(ts).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
}

function formatDate(ts?: number): string {
  if (!ts) return "";
  return new Date(ts).toLocaleDateString("ru-RU", { day: "2-digit", month: "short" });
}

function upsertMessage(sessions: ChatSession[], sessionId: string, message: ChatMessage): ChatSession[] {
  return sessions.map((session) => {
    if (session.id !== sessionId) return session;

    const exists = session.messages.some((item) => item.timestamp === message.timestamp && item.from === message.from);
    if (exists) return session;

    const messages = [...session.messages, message];
    return {
      ...session,
      messages,
      lastActivity: message.timestamp,
      lastMessage: message,
    };
  });
}

function replacePendingMessage(sessions: ChatSession[], sessionId: string, pendingTimestamp: number, message: ChatMessage): ChatSession[] {
  return sessions.map((session) => {
    if (session.id !== sessionId) return session;

    const messages = session.messages.map((item) =>
      item.timestamp === pendingTimestamp && item.from === "admin" ? message : item,
    );

    return {
      ...session,
      messages,
      lastActivity: message.timestamp,
      lastMessage: message,
    };
  });
}

const OperatorChat = () => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [tokenInput, setTokenInput] = useState(token);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeId, setActiveId] = useState("");
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"connecting" | "online" | "offline">("connecting");
  const [authError, setAuthError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const activeSession = useMemo(
    () => sessions.find((session) => session.id === activeId) || sessions[0],
    [activeId, sessions],
  );

  useEffect(() => {
    if (!activeId && sessions.length > 0) {
      setActiveId(sessions[0].id);
    }
  }, [activeId, sessions]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeSession?.messages.length, activeSession?.id]);

  useEffect(() => {
    const params = token ? `?token=${encodeURIComponent(token)}` : "";
    const es = new EventSource(`${API}/admin/listen${params}`);

    setStatus("connecting");

    es.onopen = () => setStatus("online");
    es.onerror = () => setStatus("offline");
    es.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "sessions") {
        setSessions(data.sessions || []);
        if (data.activeSession) {
          setActiveId(data.activeSession);
        }
      }
    };

    return () => es.close();
  }, [token]);

  const saveToken = () => {
    const nextToken = tokenInput.trim();
    localStorage.setItem(TOKEN_KEY, nextToken);
    setAuthError("");
    setToken(nextToken);
    refreshSessions(nextToken);
  };

  const refreshSessions = async (tokenOverride = token) => {
    try {
      const res = await fetch(`${API}/admin/sessions`, {
        headers: tokenOverride ? { "x-admin-token": tokenOverride } : undefined,
      });
      const data = await res.json();
      if (res.status === 401) {
        setAuthError("Токен не подошёл. Введите ADMIN_TOKEN или точный ADMIN_CHAT_ID из backend.");
        setStatus("offline");
        return;
      }
      if (data.ok) {
        setAuthError("");
        setStatus("online");
        setSessions(data.sessions || []);
      }
    } catch {
      setAuthError("Не удалось подключиться к bridge. Проверьте деплой backend.");
      setStatus("offline");
    }
  };

  useEffect(() => {
    if (!token) return;

    refreshSessions(token);
    const interval = window.setInterval(() => {
      refreshSessions(token);
    }, 2500);

    return () => window.clearInterval(interval);
  }, [token]);

  const sendReply = async () => {
    const text = input.trim();
    if (!text || !activeSession) return;

    const sessionId = activeSession.id;
    const timestamp = Date.now();
    const optimisticMessage: ChatMessage = { from: "admin", text, timestamp, pending: true };

    setInput("");
    setSessions((prev) => upsertMessage(prev, sessionId, optimisticMessage));

    try {
      const res = await fetch(`${API}/admin/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "x-admin-token": token } : {}),
        },
        body: JSON.stringify({ session: sessionId, text }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error("reply failed");

      const confirmedMessage: ChatMessage = data.reply || { from: "admin", text, timestamp, pending: false };

      setAuthError("");
      setSessions((prev) => replacePendingMessage(prev, sessionId, timestamp, confirmedMessage));
      refreshSessions();
    } catch {
      setInput(text);
      setAuthError("Ответ не отправился. Проверьте подключение и попробуйте ещё раз.");
      setSessions((prev) =>
        prev.map((session) => {
          if (session.id !== sessionId) return session;
          const messages = session.messages.filter((message) => !(message.timestamp === timestamp && message.from === "admin"));
          return {
            ...session,
            messages,
            lastMessage: messages[messages.length - 1] || null,
            lastActivity: messages[messages.length - 1]?.timestamp || session.lastActivity,
          };
        }),
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f5f1] text-foreground">
      <div className="h-screen grid grid-cols-[360px_1fr]">
        <aside className="border-r border-border bg-background flex flex-col min-h-0">
          <div className="h-16 px-5 border-b border-border flex items-center justify-between shrink-0">
            <div>
              <h1 className="text-[17px] font-bold leading-tight">Операторская</h1>
              <p className="text-[12px] text-muted-foreground">
                {status === "online" ? "онлайн" : status === "connecting" ? "подключение" : "нет соединения"}
              </p>
            </div>
            <button
              onClick={refreshSessions}
              className="w-10 h-10 rounded-lg bg-secondary hover:bg-border flex items-center justify-center transition-colors"
              aria-label="Обновить"
              title="Обновить"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 border-b border-border">
            <label className="text-[12px] font-semibold text-muted-foreground flex items-center gap-1.5 mb-2">
              <Lock className="w-3.5 h-3.5" />
              Токен оператора
            </label>
            <div className="flex gap-2">
              <input
                value={tokenInput}
                onChange={(event) => setTokenInput(event.target.value)}
                className="h-10 flex-1 rounded-lg border border-border bg-secondary px-3 text-[14px] outline-none focus:border-primary"
                placeholder="ADMIN_TOKEN или ADMIN_CHAT_ID"
                type="password"
              />
              <button
                onClick={saveToken}
                className="h-10 px-4 rounded-lg bg-foreground text-background text-[13px] font-semibold hover:opacity-90"
              >
                OK
              </button>
            </div>
            {authError && <p className="mt-2 text-[12px] leading-snug text-red-500">{authError}</p>}
          </div>

          <div className="flex-1 overflow-y-auto">
            {sessions.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center px-8 text-center">
                <MessageCircle className="w-9 h-9 text-muted-foreground mb-3" />
                <p className="text-sm font-semibold">Диалогов пока нет</p>
                <p className="text-[13px] text-muted-foreground mt-1">Новые сообщения с сайта появятся здесь.</p>
              </div>
            ) : (
              sessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => setActiveId(session.id)}
                  className={`w-full px-4 py-3.5 flex gap-3 text-left border-b border-border/70 hover:bg-secondary/70 transition-colors ${
                    activeSession?.id === session.id ? "bg-secondary" : "bg-background"
                  }`}
                >
                  <div className="w-11 h-11 rounded-xl bg-foreground text-background flex items-center justify-center text-[13px] font-bold shrink-0">
                    {session.id.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[14px] font-semibold truncate">{session.id}</p>
                      <span className="text-[11px] text-muted-foreground shrink-0">{formatDate(session.lastActivity)}</span>
                    </div>
                    <p className="text-[13px] text-muted-foreground truncate mt-0.5">
                      {session.lastMessage?.text || "Пустой диалог"}
                    </p>
                  </div>
                  {session.unread > 0 && (
                    <span className="min-w-5 h-5 px-1.5 rounded-full bg-primary text-primary-foreground text-[11px] font-bold flex items-center justify-center">
                      {session.unread}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        </aside>

        <main className="flex flex-col min-h-0">
          <div className="h-16 px-6 bg-background border-b border-border flex items-center justify-between shrink-0">
            <div>
              <p className="text-[15px] font-bold">{activeSession?.id || "Выберите диалог"}</p>
              <p className="text-[12px] text-muted-foreground">
                {activeSession ? `последняя активность ${formatTime(activeSession.lastActivity)}` : "ожидание сообщений"}
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground">
              <Check className="w-3.5 h-3.5 text-primary" />
              Чат сайта
            </span>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3">
            {!activeSession ? (
              <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                Откройте диалог из списка
              </div>
            ) : (
              activeSession.messages.map((message) => (
                <div key={`${message.timestamp}-${message.from}`} className={`flex ${message.from === "admin" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[620px] rounded-2xl px-4 py-3 text-[14px] leading-relaxed ${
                      message.from === "admin"
                        ? "bg-foreground text-background rounded-br-md"
                        : "bg-background border border-border rounded-bl-md"
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{message.text}</p>
                    <p className={`text-[11px] mt-1 ${message.from === "admin" ? "text-background/65" : "text-muted-foreground"}`}>
                      {message.pending ? "отправляется" : formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={bottomRef} />
          </div>

          <div className="p-4 bg-background border-t border-border shrink-0">
            <div className="flex items-end gap-3">
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    sendReply();
                  }
                }}
                disabled={!activeSession}
                className="min-h-12 max-h-32 flex-1 resize-none rounded-xl border border-border bg-secondary px-4 py-3 text-[14px] outline-none focus:border-primary disabled:opacity-50"
                placeholder="Ответить клиенту"
              />
              <button
                onClick={sendReply}
                disabled={!activeSession || !input.trim()}
                className="w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40"
                aria-label="Отправить"
                title="Отправить"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OperatorChat;
