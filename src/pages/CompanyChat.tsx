import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, Send, Check, RotateCcw } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { saveCompanyChatEntry } from "@/lib/companyChats";

/* ─── Types ─── */
interface ProjectCardData {
  name: string;
  price: string;
  area: string;
  image: string;
  projectId: string;
}

interface Message {
  id: number;
  text: string;
  fromCompany: boolean;
  time: string;
  timestamp: number;
  badge?: string;
  hint?: string;
  isTyping?: boolean;
  summaryCard?: SummaryRow[];
  projectCard?: ProjectCardData;
}

interface SummaryRow {
  label: string;
  value: string;
}

type FlowStep =
  | "greeting"
  | "plot_status"
  | "cadastral_input"
  | "address_input"
  | "region_no_plot"
  | "region_rental"
  | "rental_type"
  | "payment"
  | "timeline"
  | "done";

interface BotState {
  plotStatus: string;
  plot: string;
  address: string;
  region: string;
  rentType: string;
  payment: string;
  timeline: string;
}

/* ─── Helpers ─── */
const STORAGE_PREFIX = "company_chat_";
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function loadChat(company: string): { messages: Message[]; botState: BotState; step: FlowStep } | null {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + company);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (Date.now() - data.savedAt > WEEK_MS) {
      localStorage.removeItem(STORAGE_PREFIX + company);
      return null;
    }
    if (data.botState && data.step) {
      return { messages: data.messages, botState: data.botState, step: data.step };
    }
    return null;
  } catch {
    return null;
  }
}

function saveFullChat(company: string, messages: Message[], botState: BotState, step: FlowStep) {
  localStorage.setItem(
    STORAGE_PREFIX + company,
    JSON.stringify({ messages, botState, step, savedAt: Date.now() })
  );
}

function getTime() {
  const now = new Date();
  return `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;
}

function mkMsg(text: string, fromCompany: boolean, extra?: Partial<Message>): Message {
  const ts = Date.now() + Math.random();
  return { id: ts, timestamp: ts, text, fromCompany, time: getTime(), ...extra };
}

const emptyState = (): BotState => ({
  plotStatus: "",
  plot: "",
  address: "",
  region: "",
  rentType: "",
  payment: "",
  timeline: "",
});

/* ─── Chips for each step ─── */
const PLOT_CHIPS = [
  "Да, знаю кадастровый номер",
  "Есть участок, но не знаю номер",
  "Участок ещё не куплен",
  "Участок в аренде",
];

const PAYMENT_CHIPS = ["Собственные средства", "Ипотека", "Смешанное", "Пока не решил"];
const TIMELINE_CHIPS = ["В ближайшие 3 месяца", "3–6 месяцев", "В течение года", "Просто изучаю"];
const RENTAL_CHIPS = ["Моя аренда", "Земля родственников", "Другое"];

/* ─── Component ─── */
const CompanyChat = forwardRef<HTMLDivElement>((_, ref) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [searchParams] = useSearchParams();
  const companyName = searchParams.get("company") || "Производитель";
  const projectName = searchParams.get("project") || "";
  const projectId = searchParams.get("projectId");
  const projectPrice = searchParams.get("price") || "";
  const projectArea = searchParams.get("area") || "";
  const projectImage = searchParams.get("image") || "";
  const initials = companyName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const [messages, setMessages] = useState<Message[]>([]);
  const [botState, setBotState] = useState<BotState>(emptyState());
  const [step, setStep] = useState<FlowStep>("greeting");
  const [input, setInput] = useState("");
  const [inputEnabled, setInputEnabled] = useState(false);
  const [inputPlaceholder, setInputPlaceholder] = useState("Напишите ответ...");
  const [isTypingVisible, setIsTypingVisible] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const messagesViewportRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);
  const prevCompanyRef = useRef(companyName);

  const scrollToBottom = useCallback(() => {
    const viewport = messagesViewportRef.current;
    if (!viewport) return;
    viewport.scrollTo({ top: viewport.scrollHeight, behavior: "auto" });
  }, []);

  useEffect(() => {
    let frame2 = 0;
    const frame1 = requestAnimationFrame(() => {
      frame2 = requestAnimationFrame(() => {
        scrollToBottom();
      });
    });

    return () => {
      cancelAnimationFrame(frame1);
      cancelAnimationFrame(frame2);
    };
  }, [messages.length, isTypingVisible, inputEnabled, step, scrollToBottom]);

  // Add bot message with typing delay
  const addBot = useCallback(
    (text: string, badge?: string, hint?: string, delay = 700): Promise<void> => {
      return new Promise((resolve) => {
        setIsTypingVisible(true);
        setTimeout(() => {
          setIsTypingVisible(false);
          setMessages((prev) => [...prev, mkMsg(text, true, { badge, hint })]);
          resolve();
        }, delay);
      });
    },
    []
  );

  const addUser = useCallback((text: string) => {
    setMessages((prev) => [...prev, mkMsg(text, false)]);
  }, []);

  // Save chat on changes
  useEffect(() => {
    if (!hasInitialized.current) return;
    saveFullChat(companyName, messages, botState, step);
    if (messages.length > 0) {
      const last = messages[messages.length - 1];
      saveCompanyChatEntry({
        company: companyName,
        project: projectName,
        projectId: projectId || "",
        lastMessage: last.text.slice(0, 60),
        lastTime: last.time,
      });
    }
  }, [messages, botState, step, companyName, projectName, projectId]);

  // Build summary rows
  const buildSummary = useCallback((st: BotState): SummaryRow[] => {
    const rows: SummaryRow[] = [];
    if (st.plotStatus === "cadastral") rows.push({ label: "Участок", value: st.plot });
    else if (st.plotStatus === "address") rows.push({ label: "Адрес", value: st.address });
    else if (st.plotStatus === "no_plot") rows.push({ label: "Участок", value: `Ещё не куплен · ${st.region}` });
    else if (st.plotStatus === "rental") rows.push({ label: "Участок", value: `Аренда · ${st.region}` });
    rows.push({ label: "Форма оплаты", value: st.payment });
    rows.push({ label: "Срок начала", value: st.timeline });
    return rows;
  }, []);

  // Flow progression
  const progressFlow = useCallback(
    async (nextStep: FlowStep, updatedState: BotState) => {
      setBotState(updatedState);
      setStep(nextStep);
      setInputEnabled(false);

      switch (nextStep) {
        case "plot_status":
          await addBot(
            `Привет! Помогу разобраться с вашим проектом${projectName ? ` «${projectName}»` : ""}. Это займёт около минуты.`,
            undefined,
            undefined,
            900
          );
          await addBot("Есть ли у вас участок для строительства?", "Шаг 1 из 3");
          break;

        case "cadastral_input":
          await addBot("Введите кадастровый номер участка.", "Кадастровый номер", undefined, 700);
          setInputEnabled(true);
          setInputPlaceholder("Например: 50:20:0010101:456");
          break;

        case "address_input":
          await addBot("Не беда — введите адрес, мы найдём кадастровый номер самостоятельно.", "Адрес", undefined, 700);
          setInputEnabled(true);
          setInputPlaceholder("Адрес участка...");
          break;

        case "region_no_plot":
          await addBot("Понял. Это нормально — многие приходят к нам ещё на этапе выбора.", "Без участка", undefined, 700);
          await addBot("Хорошо. В каком регионе или городе вы планируете строиться?", undefined, undefined, 800);
          setInputEnabled(true);
          setInputPlaceholder("Например: Краснодар, Подмосковье, Сочи...");
          break;

        case "region_rental":
          await addBot("Хорошо. В каком регионе или городе вы рассматриваете участок?", undefined, undefined, 800);
          setInputEnabled(true);
          setInputPlaceholder("Например: Краснодар, Подмосковье, Сочи...");
          break;

        case "rental_type":
          await addBot(
            "Хорошо, учтём. Уточните права на участок: это собственная аренда или земля родственников?",
            "Аренда",
            undefined,
            700
          );
          break;

        case "payment":
          if (updatedState.plotStatus === "cadastral") {
            await addBot("Отлично, участок зафиксирован.");
          } else if (updatedState.plotStatus === "address") {
            await addBot("Принято, найдём номер по адресу.");
          } else if (updatedState.plotStatus === "no_plot") {
            await addBot("Поняли. Как только выберете участок — мы поможем проверить его по кадастру и зонированию.");
          } else if (updatedState.plotStatus === "rental" && updatedState.rentType) {
            await addBot("Важно: для строительства потребуется согласие собственника и разрешение на застройку. Мы проконсультируем.");
          }
          await addBot("Как планируете финансировать строительство?", "Финансирование");
          break;

        case "timeline":
          if (updatedState.payment === "Ипотека" || updatedState.payment === "Смешанное") {
            await addBot("Понял. Мы подберём партнёров с подходящими программами.");
          }
          await addBot("Когда планируете начать строительство?", "Сроки");
          break;

        case "done": {
          await addBot("Отлично, всё записал! Вот сводка вашей заявки:");
          const summary = buildSummary(updatedState);
          setMessages((prev) => [...prev, mkMsg("", true, { summaryCard: summary })]);
          scroll();
          await addBot("Наш менеджер свяжется с вами в ближайшее время для следующего шага.");
          break;
        }
      }
    },
    [addBot, buildSummary, projectName, scroll]
  );

  // Handle chip selection
  const handleChip = useCallback(
    (value: string) => {
      addUser(value);
      const st = { ...botState };

      switch (step) {
        case "plot_status":
          if (value === "Да, знаю кадастровый номер") {
            st.plotStatus = "cadastral";
            progressFlow("cadastral_input", st);
          } else if (value === "Есть участок, но не знаю номер") {
            st.plotStatus = "address";
            progressFlow("address_input", st);
          } else if (value === "Участок ещё не куплен") {
            st.plotStatus = "no_plot";
            progressFlow("region_no_plot", st);
          } else if (value === "Участок в аренде") {
            st.plotStatus = "rental";
            progressFlow("region_rental", st);
          }
          break;

        case "rental_type":
          st.rentType = value;
          progressFlow("payment", st);
          break;

        case "payment":
          st.payment = value;
          progressFlow("timeline", st);
          break;

        case "timeline":
          st.timeline = value;
          progressFlow("done", st);
          break;
      }
    },
    [addUser, botState, step, progressFlow]
  );

  // Handle text input submission
  const sendMessage = useCallback(() => {
    const text = input.trim();
    if (!text || !inputEnabled) return;
    addUser(text);
    setInput("");
    setInputEnabled(false);
    const st = { ...botState };

    switch (step) {
      case "cadastral_input":
        st.plot = text;
        progressFlow("payment", st);
        break;
      case "address_input":
        st.address = text;
        st.plotStatus = "address";
        progressFlow("payment", st);
        break;
      case "region_no_plot":
        st.region = text;
        progressFlow("payment", st);
        break;
      case "region_rental":
        st.region = text;
        progressFlow("rental_type", st);
        break;
    }
  }, [input, inputEnabled, addUser, botState, step, progressFlow]);

  const hasProjectPreview = Boolean(projectName && projectPrice && projectImage);

  const buildProjectCardMessage = useCallback((): Message | null => {
    if (!hasProjectPreview) return null;

    return mkMsg("", false, {
      projectCard: {
        name: projectName,
        price: projectPrice,
        area: projectArea,
        image: projectImage,
        projectId: projectId || "",
      },
    });
  }, [hasProjectPreview, projectName, projectPrice, projectArea, projectImage, projectId]);

  // Restart flow
  const restart = useCallback(() => {
    const newState = emptyState();
    const projectCard = buildProjectCardMessage();

    setMessages(projectCard ? [projectCard] : []);
    setBotState(newState);
    setStep("greeting");
    setInput("");
    setInputEnabled(false);
    setInputPlaceholder("Напишите ответ...");
    localStorage.removeItem(STORAGE_PREFIX + companyName);
    hasInitialized.current = false;

    setTimeout(() => {
      hasInitialized.current = true;
      progressFlow("plot_status", newState);
    }, 100);
  }, [buildProjectCardMessage, companyName, progressFlow]);

  // Initialize or restore
  useEffect(() => {
    if (hasInitialized.current && prevCompanyRef.current === companyName && !hasProjectPreview) return;

    prevCompanyRef.current = companyName;
    hasInitialized.current = true;

    const saved = hasProjectPreview ? null : loadChat(companyName);

    if (saved && saved.messages.length > 0) {
      setMessages(saved.messages);
      setBotState(saved.botState);
      setStep(saved.step);
      setInput("");
      if (["cadastral_input", "address_input", "region_no_plot", "region_rental"].includes(saved.step)) {
        setInputEnabled(true);
      }
    } else {
      const newState = emptyState();
      const projectCard = buildProjectCardMessage();

      setMessages(projectCard ? [projectCard] : []);
      setBotState(newState);
      setStep("greeting");
      setInput("");
      setInputEnabled(false);
      setInputPlaceholder("Напишите ответ...");
      progressFlow("plot_status", newState);
    }
  }, [buildProjectCardMessage, companyName, hasProjectPreview, progressFlow]);

  // Get current chips based on step
  const getChips = (): string[] => {
    switch (step) {
      case "plot_status": return PLOT_CHIPS;
      case "rental_type": return RENTAL_CHIPS;
      case "payment": return PAYMENT_CHIPS;
      case "timeline": return TIMELINE_CHIPS;
      default: return [];
    }
  };

  const currentChips = getChips();
  const showChips = currentChips.length > 0 && !isTypingVisible;

  /* ─── Typing indicator ─── */
  const renderTypingIndicator = () => (
    <div className="flex items-end gap-2 justify-start">
      <div className={`${isMobile ? "w-7 h-7 rounded-lg" : "w-8 h-8 rounded-xl"} shrink-0 bg-foreground flex items-center justify-center mb-0.5`}>
        <span className={`${isMobile ? "text-[9px]" : "text-[9px]"} font-bold text-background`}>{initials}</span>
      </div>
      <div className={`rounded-2xl px-3.5 py-3 ${isMobile ? "bg-muted rounded-bl-md" : "bg-background border border-border rounded-bl-md"}`}>
        <div className="flex gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-pulse" style={{ animationDelay: "0ms" }} />
          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-pulse" style={{ animationDelay: "200ms" }} />
          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-pulse" style={{ animationDelay: "400ms" }} />
        </div>
      </div>
    </div>
  );

  /* ─── Summary card ─── */
  const renderSummaryCard = (rows: SummaryRow[]) => (
    <div className={`rounded-2xl p-4 mt-1 ${isMobile ? "bg-muted" : "bg-background border border-border"}`}>
      {rows.map((r, i) => (
        <div
          key={i}
          className={`flex justify-between py-2 ${i < rows.length - 1 ? "border-b border-border" : ""}`}
        >
          <span className="text-[13px] text-muted-foreground">{r.label}</span>
          <span className="text-[13px] font-medium text-foreground text-right max-w-[58%]">{r.value}</span>
        </div>
      ))}
      <button
        onClick={restart}
        className="flex items-center gap-1.5 mt-3 text-[13px] text-muted-foreground hover:text-foreground transition-colors"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        Начать заново
      </button>
    </div>
  );

  /* ─── Render message ─── */
  const renderMessage = (msg: Message) => {
    if (msg.projectCard) {
      const card = msg.projectCard;
      return (
        <div key={msg.id} className="flex items-end gap-2 justify-end">
          <div className={`rounded-2xl overflow-hidden ${isMobile ? "max-w-[75%]" : "max-w-[320px]"} bg-primary text-primary-foreground rounded-br-md`}>
            {card.image ? <img src={card.image} alt={card.name} className="w-full h-[140px] object-cover" /> : null}
            <div className="px-3.5 py-2.5">
              <p className="text-[15px] font-semibold">{card.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[13px] opacity-90">{card.price}</span>
                {card.area ? (
                  <>
                    <span className="text-[13px] opacity-60">·</span>
                    <span className="text-[13px] opacity-90">{card.area}</span>
                  </>
                ) : null}
              </div>
              <p className="text-[10px] mt-1.5 text-right text-primary-foreground/70">{msg.time}</p>
            </div>
          </div>
        </div>
      );
    }

    if (msg.summaryCard) {
      return (
        <div key={msg.id} className="flex items-end gap-2 justify-start">
          {isMobile ? (
            <div className="w-7 h-7 shrink-0 rounded-lg bg-foreground flex items-center justify-center mb-0.5">
              <span className="text-[9px] font-bold text-background">{initials}</span>
            </div>
          ) : (
            <div className="w-8 h-8 shrink-0 rounded-xl bg-foreground flex items-center justify-center mb-0.5">
              <span className="text-[9px] font-bold text-background">{initials}</span>
            </div>
          )}
          <div className="max-w-[80%]">{renderSummaryCard(msg.summaryCard)}</div>
        </div>
      );
    }

    return (
      <div key={msg.id} className={`flex items-end gap-2 ${msg.fromCompany ? "justify-start" : "justify-end"}`}>
        {msg.fromCompany && (
          isMobile ? (
            <div className="w-7 h-7 shrink-0 rounded-lg bg-foreground flex items-center justify-center mb-0.5">
              <span className="text-[9px] font-bold text-background">{initials}</span>
            </div>
          ) : (
            <div className="w-8 h-8 shrink-0 rounded-xl bg-foreground flex items-center justify-center mb-0.5">
              <span className="text-[9px] font-bold text-background">{initials}</span>
            </div>
          )
        )}
        <div
          className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 ${
            msg.fromCompany
              ? isMobile
                ? "bg-muted rounded-bl-md"
                : "bg-background border border-border rounded-bl-md"
              : "bg-primary text-primary-foreground rounded-br-md"
          }`}
        >
          {msg.fromCompany && msg.badge ? (
            <span className="inline-block bg-primary/10 text-primary rounded-lg px-2 py-0.5 text-[11px] font-medium mb-1.5">
              {msg.badge}
            </span>
          ) : null}
          {msg.fromCompany && !msg.summaryCard ? (
            <p className="text-[12px] font-semibold text-primary mb-0.5">{companyName}</p>
          ) : null}
          <p className="text-[15px] leading-relaxed">{msg.text}</p>
          <p
            className={`text-[10px] mt-1 text-right ${
              msg.fromCompany ? "text-muted-foreground" : "text-primary-foreground/70"
            }`}
          >
            {msg.time}
          </p>
        </div>
      </div>
    );
  };

  /* ─── Chip buttons ─── */
  const ChipButtons = () =>
    showChips ? (
      <div className="flex flex-wrap gap-2 mt-1 pl-9">
        {currentChips.map((chip) => (
          <button
            key={chip}
            onClick={() => handleChip(chip)}
            className={`text-[13px] font-medium px-3.5 py-2 transition-colors ${
              isMobile
                ? "border border-primary text-primary rounded-xl active:bg-primary/10"
                : "border border-border bg-background text-foreground rounded-xl hover:bg-secondary"
            }`}
          >
            {chip}
          </button>
        ))}
      </div>
    ) : null;

  /* ─── Desktop header ─── */
  const desktopHeader = (
    <div className="border-b border-border bg-card shrink-0">
      <div className="px-5 h-[60px] flex items-center gap-3">
        <div className="w-10 h-10 shrink-0 rounded-xl bg-foreground flex items-center justify-center">
          <span className="text-[12px] font-bold text-background">{initials}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-semibold text-foreground leading-tight truncate">{companyName}</p>
            <span className="w-4 h-4 rounded-[6px] bg-primary/15 flex items-center justify-center shrink-0">
              <Check className="w-2.5 h-2.5 text-primary" strokeWidth={3} />
            </span>
          </div>
          <p className="text-[12px] text-muted-foreground">онлайн</p>
        </div>
      </div>
    </div>
  );

  /* ─── Mobile layout ─── */
  if (isMobile) {
    return (
      <div ref={ref} className="h-[100dvh] bg-card font-sans flex flex-col overflow-hidden">
        <div className="shrink-0 bg-card shadow-sm pt-[env(safe-area-inset-top)]">
          <div className="flex items-center gap-3 px-4 h-14">
            <button onClick={() => (projectId ? navigate(`/project/${projectId}`) : navigate(-1))} className="text-foreground">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="w-11 h-11 shrink-0 rounded-xl bg-foreground flex items-center justify-center">
              <span className="text-[13px] font-bold text-background">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <p className="text-sm font-semibold text-foreground leading-tight">{companyName}</p>
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

        <div ref={messagesViewportRef} className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-3 py-4 flex flex-col gap-2.5">
          {messages.map(renderMessage)}
          {isTypingVisible && renderTypingIndicator()}
          <ChipButtons />
          <div ref={bottomRef} />
        </div>

        <div className="shrink-0 bg-background/70 backdrop-blur-lg border-t border-border px-3 py-2.5 pb-[calc(0.625rem+max(env(safe-area-inset-bottom),20px))]">
          <div className="flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder={inputPlaceholder}
              disabled={!inputEnabled}
              className="flex-1 h-10 rounded-full bg-muted border border-border px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-40"
              style={{ fontSize: "16px" }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || !inputEnabled}
              className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0 disabled:opacity-40 transition-opacity"
            >
              <Send className="w-4.5 h-4.5 text-primary-foreground fill-primary-foreground" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ─── Desktop layout ─── */
  return (
    <div ref={ref} className="flex-1 flex flex-col min-h-0 max-h-full overflow-hidden">
      {desktopHeader}
      <div ref={messagesViewportRef} className="flex-1 min-h-0 overflow-y-auto overscroll-contain flex flex-col px-5 py-5 gap-3 bg-secondary/30">
        {messages.map(renderMessage)}
        {isTypingVisible && renderTypingIndicator()}
        <ChipButtons />
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-border bg-card px-5 py-3.5 shrink-0">
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder={inputPlaceholder}
            disabled={!inputEnabled}
            className="flex-1 h-11 rounded-2xl bg-secondary border border-border px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-40"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || !inputEnabled}
            className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center shrink-0 disabled:opacity-40 transition-opacity"
          >
            <Send className="w-4 h-4 text-primary-foreground fill-primary-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
});

CompanyChat.displayName = "CompanyChat";

export default CompanyChat;
