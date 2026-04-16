import { useState } from "react";
import { ChevronLeft, Send, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import supportIcon from "@/assets/support-icon.png";

interface Message {
  id: number;
  text: string;
  fromSupport: boolean;
  time: string;
}

const initialMessages: Message[] = [
  { id: 1, text: "Здравствуйте! Добро пожаловать в службу поддержки. Чем можем помочь?", fromSupport: true, time: "19:05" },
  { id: 2, text: "Вы можете задать любой вопрос о модульных домах, доставке или оплате.", fromSupport: true, time: "19:05" },
];

const quickActions = [
  "Вопрос по заказу",
  "Доставка и монтаж",
  "Подобрать проект",
  "Другой вопрос",
];

const SupportChat = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    const now = new Date();
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;
    setMessages((prev) => [...prev, { id: Date.now(), text, fromSupport: false, time }]);
    setInput("");
    setTimeout(() => {
      const replyTime = new Date();
      const rt = `${replyTime.getHours()}:${String(replyTime.getMinutes()).padStart(2, "0")}`;
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), text: "Спасибо за обращение! Менеджер ответит вам в ближайшее время.", fromSupport: true, time: rt },
      ]);
    }, 1500);
  };

  const handleQuickAction = (action: string) => {
    const now = new Date();
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;
    setMessages((prev) => [...prev, { id: Date.now(), text: action, fromSupport: false, time }]);
    setTimeout(() => {
      const replyTime = new Date();
      const rt = `${replyTime.getHours()}:${String(replyTime.getMinutes()).padStart(2, "0")}`;
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), text: "Спасибо! Менеджер свяжется с вами в ближайшее время.", fromSupport: true, time: rt },
      ]);
    }, 1500);
  };

  // Desktop header inside the chat area
  const desktopHeader = (
    <div className="border-b border-border bg-card shrink-0">
      <div className="px-5 h-[60px] flex items-center gap-3">
        <div className="w-10 h-10 shrink-0 rounded-xl bg-muted flex items-center justify-center">
          <img src={supportIcon} alt="Поддержка" className="w-7 h-7 object-contain" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-semibold text-foreground leading-tight">Поддержка Много места</p>
            <span className="w-4 h-4 rounded-[6px] bg-primary/15 flex items-center justify-center shrink-0">
              <Check className="w-2.5 h-2.5 text-primary" strokeWidth={3} />
            </span>
          </div>
          <p className="text-[12px] text-muted-foreground">онлайн</p>
        </div>
      </div>
    </div>
  );

  const desktopThread = (
    <div className="flex-1 flex flex-col min-h-0">
      {desktopHeader}
      <div className="flex-1 overflow-y-auto flex flex-col px-5 py-5 gap-3 bg-secondary/30">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-end gap-2 ${msg.fromSupport ? "justify-start" : "justify-end"}`}>
            {msg.fromSupport && (
              <div className="w-8 h-8 shrink-0 rounded-xl bg-muted flex items-center justify-center mb-0.5">
                <img src={supportIcon} alt="" className="w-5 h-5 object-contain" />
              </div>
            )}
            <div className={`max-w-[70%] rounded-2xl px-3.5 py-3 ${
              msg.fromSupport
                ? "bg-background border border-border rounded-bl-md"
                : "bg-primary text-primary-foreground rounded-br-md"
            }`}>
              {msg.fromSupport && <p className="text-[12px] font-semibold text-primary mb-1">Поддержка Много места</p>}
              <p className="text-[15px] leading-relaxed">{msg.text}</p>
              <p className={`text-[10px] mt-1.5 text-right ${msg.fromSupport ? "text-muted-foreground" : "text-primary-foreground/70"}`}>{msg.time}</p>
            </div>
          </div>
        ))}

        {messages.length <= 3 && (
          <div className="flex flex-wrap gap-2 mt-1">
            {quickActions.map((action) => (
              <button key={action} onClick={() => handleQuickAction(action)}
                className="border border-border bg-background text-foreground text-[13px] font-medium rounded-xl px-3.5 py-2.5 hover:bg-secondary transition-colors">
                {action}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-border bg-card px-5 py-3.5 shrink-0">
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Введите сообщение"
            className="flex-1 h-11 rounded-2xl bg-secondary border border-border px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button onClick={sendMessage} disabled={!input.trim()}
            className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center shrink-0 disabled:opacity-40 transition-opacity">
            <Send className="w-4 h-4 text-primary-foreground fill-primary-foreground" />
          </button>
        </div>
      </div>
    </div>
  );

  // Mobile: full-screen chat page (UNCHANGED)
  if (isMobile) {
    return (
      <div className="min-h-screen bg-card font-sans flex flex-col">
        <div className="sticky top-0 z-40 bg-card shadow-sm pt-[env(safe-area-inset-top)]">
          <div className="flex items-center gap-3 px-4 h-14">
            <button onClick={() => navigate("/messages")} className="text-foreground">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="w-11 h-11 shrink-0 rounded-xl bg-muted flex items-center justify-center">
              <img src={supportIcon} alt="Поддержка" className="w-9 h-9 object-contain" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <p className="text-sm font-semibold text-foreground leading-tight">Поддержка Много места</p>
                <span className="w-3 h-3 rounded-full bg-primary/70 flex items-center justify-center shrink-0">
                  <Check className="w-1.5 h-1.5 text-primary-foreground" strokeWidth={3} />
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                <p className="text-[11px] text-muted-foreground font-medium">онлайн</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-2.5">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-end gap-2 ${msg.fromSupport ? "justify-start" : "justify-end"}`}>
              {msg.fromSupport && (
                <div className="w-7 h-7 shrink-0 rounded-lg bg-muted flex items-center justify-center mb-0.5">
                  <img src={supportIcon} alt="" className="w-5 h-5 object-contain" />
                </div>
              )}
              <div className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 ${
                msg.fromSupport ? "bg-muted rounded-bl-md" : "bg-primary text-primary-foreground rounded-br-md"
              }`}>
                {msg.fromSupport && <p className="text-[12px] font-semibold text-primary mb-0.5">Поддержка Много места</p>}
                <p className="text-[15px] leading-relaxed">{msg.text}</p>
                <p className={`text-[10px] mt-1 text-right ${msg.fromSupport ? "text-muted-foreground" : "text-primary-foreground/70"}`}>{msg.time}</p>
              </div>
            </div>
          ))}
          {messages.length <= 3 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {quickActions.map((action) => (
                <button key={action} onClick={() => handleQuickAction(action)}
                  className="border border-primary text-primary text-xs font-medium rounded-full px-3.5 py-2 active:bg-primary/10 transition-colors">
                  {action}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-background/70 backdrop-blur-lg border-t border-border px-3 py-2.5 pb-[calc(0.625rem+max(env(safe-area-inset-bottom),20px))]">
          <div className="flex items-center gap-2">
            <input value={input} onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()} placeholder="Введите сообщение"
              className="flex-1 h-10 rounded-full bg-muted border border-border px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              style={{ fontSize: "16px" }} />
            <button onClick={sendMessage} disabled={!input.trim()}
              className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0 disabled:opacity-40 transition-opacity">
              <Send className="w-4.5 h-4.5 text-primary-foreground fill-primary-foreground" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Desktop: rendered inside Outlet of DesktopMessagesLayout
  return desktopThread;
};

export default SupportChat;
