import { useState, useRef, useEffect } from "react";
import { ChevronLeft, Send, Check, BookOpen, MapPin, Layers } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import partnerIcon from "@/assets/partner-icon.png";
import PartnerDrawer from "@/components/PartnerDrawer";
import { useIsMobile } from "@/hooks/use-mobile";

interface Message {
  id: number;
  text: string;
  fromBot: boolean;
  time: string;
  buttons?: { label: string; icon?: React.ReactNode; action: string }[];
}

type OnboardingStep = "welcome" | "company_name" | "region" | "projects_count" | "contact" | "done" | "free_chat";

const BOT_NAME = "Партнёрство Много места";

const now = () => {
  const d = new Date();
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
};

const REGIONS = ["Москва и МО", "Санкт-Петербург и ЛО", "Центральный ФО", "Южный ФО", "Сибирский ФО", "Другой регион"];
const PROJECT_COUNTS = ["1–5 проектов", "6–15 проектов", "16–30 проектов", "30+ проектов"];

const PartnerChat = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isMobile = useIsMobile();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [step, setStep] = useState<OnboardingStep>("welcome");
  const [partnerData, setPartnerData] = useState({ company: "", region: "", projects: "", contact: "" });
  const scrollRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const addBot = (text: string, buttons?: Message["buttons"], delay = 800) => {
    setTimeout(() => {
      setMessages((prev) => [...prev, { id: Date.now(), text, fromBot: true, time: now(), buttons }]);
    }, delay);
  };

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Check if coming from partner application form
    const isFromForm = searchParams.get("start") === "1";
    const savedApp = localStorage.getItem("partner_application");

    if (isFromForm && savedApp) {
      try {
        const app = JSON.parse(savedApp);
        const summaryText = [
          `Компания: ${app.companyName || "—"}`,
          `ИНН: ${app.inn || "—"}`,
          `Вид деятельности: ${app.activityType || "—"}`,
          app.website ? `Сайт: ${app.website}` : null,
          `Контактное лицо: ${app.contactName || "—"}`,
          `Телефон: ${app.phone || "—"}`,
        ].filter(Boolean).join("\n");

        setMessages([
          { id: 1, text: "Здравствуйте! Рады, что вы заинтересовались размещением на маркетплейсе модульных домов.", fromBot: true, time: now() },
          { id: 2, text: "Вот данные из вашей заявки:", fromBot: true, time: now() },
          { id: 3, text: summaryText, fromBot: false, time: now() },
        ]);
        setStep("done");
        localStorage.removeItem("partner_application");
        setTimeout(() => {
          addBot("Заявка принята! Менеджер свяжется с вами в ближайшее время. Если есть вопросы — пишите прямо здесь.");
        }, 1000);
        return;
      } catch { /* ignore parse errors */ }
    }

    setMessages([
      { id: 1, text: "Здравствуйте! Рады, что вы заинтересовались размещением на маркетплейсе модульных домов.", fromBot: true, time: now() },
      { id: 2, text: "Мы помогаем производителям получать целевые заявки от покупателей, которые уже выбрали модульный дом. 1200+ покупателей в месяц, 1 980 ₽ за заявку.", fromBot: true, time: now(),
        buttons: [{ label: "Изучить материалы", icon: <BookOpen className="w-3.5 h-3.5" />, action: "open_drawer" }],
      },
    ]);
    setStep("company_name");
    setTimeout(() => {
      setMessages((prev) => [...prev, { id: Date.now(), text: "Давайте оформим заявку на подключение.\n\nКак называется ваша компания?", fromBot: true, time: now() }]);
    }, 1200);
  }, [searchParams]);

  const startOnboarding = () => { setStep("company_name"); addBot("Отлично! Давайте оформим заявку на подключение.\n\nКак называется ваша компания?"); };
  const askRegion = () => { setStep("region"); addBot("В каком регионе вы работаете?", REGIONS.map((r) => ({ label: r, icon: <MapPin className="w-3.5 h-3.5" />, action: `region_${r}` }))); };
  const askProjectsCount = () => { setStep("projects_count"); addBot("Сколько проектов планируете разместить?", PROJECT_COUNTS.map((p) => ({ label: p, icon: <Layers className="w-3.5 h-3.5" />, action: `projects_${p}` }))); };
  const askContact = () => { setStep("contact"); addBot("Отлично! Последний шаг — укажите ваш контакт для связи (телефон или Telegram)."); };

  const handleButton = (action: string, label: string) => {
    if (action === "open_drawer") { setDrawerOpen(true); return; }
    if (action === "start_onboarding") { setMessages((prev) => [...prev, { id: Date.now(), text: label, fromBot: false, time: now() }]); startOnboarding(); return; }
    if (action.startsWith("region_")) { const region = action.replace("region_", ""); setMessages((prev) => [...prev, { id: Date.now(), text: region, fromBot: false, time: now() }]); setPartnerData((prev) => ({ ...prev, region })); askProjectsCount(); return; }
    if (action.startsWith("projects_")) { const projects = action.replace("projects_", ""); setMessages((prev) => [...prev, { id: Date.now(), text: projects, fromBot: false, time: now() }]); setPartnerData((prev) => { const updated = { ...prev, projects }; setTimeout(() => askContact(), 0); return updated; }); return; }
    setMessages((prev) => [...prev, { id: Date.now(), text: label, fromBot: false, time: now() }]);
  };

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { id: Date.now(), text, fromBot: false, time: now() }]);
    setInput("");
    if (step === "company_name") { setPartnerData((prev) => ({ ...prev, company: text })); askRegion(); return; }
    if (step === "contact") {
      setPartnerData((prev) => {
        const updated = { ...prev, contact: text };
        setTimeout(() => { setStep("done"); addBot(`Заявка принята.\n\nКомпания: ${updated.company}\nРегион: ${updated.region}\nПроектов: ${updated.projects}\nКонтакт: ${updated.contact}\n\nМенеджер свяжется с вами в ближайшее время.`); }, 0);
        return updated;
      });
      return;
    }
    setTimeout(() => { addBot("Спасибо за сообщение! Менеджер ответит вам в ближайшее время."); }, 400);
  };

  const getPlaceholder = () => {
    switch (step) {
      case "company_name": return "Введите название компании";
      case "contact": return "Телефон или @telegram";
      default: return "Введите сообщение";
    }
  };

  // Shared message bubble renderer
  const renderMessage = (msg: Message, isDesktop: boolean) => (
    <div key={msg.id}>
      <div className={`flex items-end gap-2 ${msg.fromBot ? "justify-start" : "justify-end"}`}>
        {msg.fromBot && (
          <div className={`${isDesktop ? "w-8 h-8 rounded-xl" : "w-7 h-7 rounded-lg"} shrink-0 bg-muted flex items-center justify-center mb-0.5 overflow-hidden`}>
            <img src={partnerIcon} alt="" className="w-10 h-10 object-contain" />
          </div>
        )}
        <div className={`max-w-[${isDesktop ? "70" : "75"}%] rounded-2xl px-3.5 ${isDesktop ? "py-3" : "py-2.5"} ${
          msg.fromBot
            ? `${isDesktop ? "bg-background border border-border" : "bg-muted"} rounded-bl-md`
            : "bg-primary text-primary-foreground rounded-br-md"
        }`}>
          {msg.fromBot && <p className={`text-[12px] font-semibold text-primary ${isDesktop ? "mb-1" : "mb-0.5"}`}>{BOT_NAME}</p>}
          <p className="text-[15px] leading-relaxed whitespace-pre-line">{msg.text}</p>
          <p className={`text-[10px] ${isDesktop ? "mt-1.5" : "mt-1"} text-right ${msg.fromBot ? "text-muted-foreground" : "text-primary-foreground/70"}`}>{msg.time}</p>
        </div>
      </div>
      {msg.buttons && msg.fromBot && (
        <div className={`flex flex-wrap gap-2 mt-2 ${isDesktop ? "ml-10" : "ml-9"}`}>
          {msg.buttons.map((btn) => (
            <button key={btn.label} onClick={() => handleButton(btn.action, btn.label)}
              className={`text-xs font-medium px-3.5 ${isDesktop ? "py-2.5" : "py-2"} transition-colors flex items-center gap-1.5 ${
                isDesktop
                  ? "border border-border bg-background text-foreground rounded-xl hover:bg-secondary"
                  : "border border-primary text-primary rounded-full active:bg-primary/10"
              }`}>
              {btn.icon}
              {btn.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  // Desktop header
  const desktopHeader = (
    <div className="border-b border-border bg-card shrink-0">
      <div className="px-5 h-[60px] flex items-center gap-3">
        <div className="w-10 h-10 shrink-0 rounded-xl bg-muted flex items-center justify-center overflow-hidden">
          <img src={partnerIcon} alt="Партнер" className="w-14 h-14 object-contain" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-semibold text-foreground leading-tight truncate">{BOT_NAME}</p>
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
      <div ref={scrollRef} className="flex-1 overflow-y-auto flex flex-col px-5 py-5 gap-3 bg-secondary/30">
        {messages.map((msg) => renderMessage(msg, true))}
      </div>
      <div className="border-t border-border bg-card px-5 py-3.5 shrink-0">
        <div className="flex items-center gap-2">
          <input value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()} placeholder={getPlaceholder()}
            className="flex-1 h-11 rounded-2xl bg-secondary border border-border px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
          <button onClick={sendMessage} disabled={!input.trim()}
            className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center shrink-0 disabled:opacity-40 transition-opacity">
            <Send className="w-4 h-4 text-primary-foreground fill-primary-foreground" />
          </button>
        </div>
      </div>
      <PartnerDrawer drawerOpen={drawerOpen} onDrawerOpenChange={setDrawerOpen} />
    </div>
  );

  // Mobile: full-screen (UNCHANGED from original)
  if (isMobile) {
    return (
      <div className="min-h-screen bg-card font-sans flex flex-col">
        <div className="sticky top-0 z-40 bg-card shadow-sm">
          <div className="flex items-center gap-3 px-4 h-14">
            <button onClick={() => navigate("/messages")} className="text-foreground">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="w-11 h-11 shrink-0 rounded-xl bg-muted flex items-center justify-center overflow-hidden">
              <img src={partnerIcon} alt="Партнер" className="w-16 h-16 object-contain" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <p className="text-sm font-semibold text-foreground leading-tight">{BOT_NAME}</p>
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

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-2.5">
          {messages.map((msg) => renderMessage(msg, false))}
        </div>

        <div className="sticky bottom-0 bg-background/70 backdrop-blur-lg border-t border-border px-3 py-2.5 pb-[calc(0.625rem+max(env(safe-area-inset-bottom),20px))]">
          <div className="flex items-center gap-2">
            <input value={input} onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()} placeholder={getPlaceholder()}
              className="flex-1 h-10 rounded-full bg-muted border border-border px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              style={{ fontSize: "16px" }} />
            <button onClick={sendMessage} disabled={!input.trim()}
              className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0 disabled:opacity-40 transition-opacity">
              <Send className="w-4.5 h-4.5 text-primary-foreground fill-primary-foreground" />
            </button>
          </div>
        </div>
        <PartnerDrawer drawerOpen={drawerOpen} onDrawerOpenChange={setDrawerOpen} />
      </div>
    );
  }

  return desktopThread;
};

export default PartnerChat;
