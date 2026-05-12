import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useEffect } from "react";
import bird from "@/assets/lab-bluebird.jpg";
import lock from "@/assets/lab-lock.png";
import orb from "@/assets/lab-orb.png";

const LAB_FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500&family=Host+Grotesk:wght@300;400;500;600&display=swap";

const Lab = () => {
  useEffect(() => {
    const id = "lab-fonts";
    if (!document.getElementById(id)) {
      const l = document.createElement("link");
      l.id = id;
      l.rel = "stylesheet";
      l.href = LAB_FONTS_HREF;
      document.head.appendChild(l);
    }
    document.documentElement.style.setProperty("--lab-bg", "#A9BCCF");
    return () => {
      document.documentElement.style.removeProperty("--lab-bg");
    };
  }, []);

  return (
    <div
      className="min-h-screen w-full overflow-x-hidden"
      style={{
        background:
          "linear-gradient(180deg, #B6C7D8 0%, #A9BCCF 40%, #C2D2E0 100%)",
        fontFamily: "'Host Grotesk', system-ui, sans-serif",
        color: "#3a4a5c",
      }}
    >
      {/* Top bar */}
      <header className="flex items-center justify-between px-5 pt-5">
        <div
          className="text-[15px] tracking-tight"
          style={{ fontFamily: "'Fraunces', serif", fontWeight: 400 }}
        >
          много<span className="opacity-60">места</span>
        </div>
        <button
          className="px-4 py-1.5 text-[13px] bg-white/90 backdrop-blur"
          style={{ borderRadius: 999, color: "#0A4FE8", fontWeight: 500 }}
        >
          Меню
        </button>
      </header>

      {/* Pill nav */}
      <nav className="mt-5 px-5 flex items-center gap-2 overflow-x-auto scrollbar-hide">
        {["главная", "каталог", "категории", "партнёрам", "контакты"].map(
          (item, i) => (
            <span
              key={item}
              className="text-[12px] whitespace-nowrap px-3.5 py-1.5"
              style={{
                borderRadius: 999,
                border: i === 0 ? "1px solid rgba(58,74,92,0.35)" : "none",
                color: i === 0 ? "#3a4a5c" : "rgba(58,74,92,0.55)",
              }}
            >
              {item}
            </span>
          ),
        )}
      </nav>

      {/* Hero */}
      <section className="relative mt-6 px-5">
        {/* Giant serif word behind */}
        <div
          aria-hidden
          className="absolute left-0 right-0 top-2 text-center pointer-events-none select-none"
          style={{
            fontFamily: "'Fraunces', serif",
            fontWeight: 300,
            fontSize: "clamp(72px, 24vw, 120px)",
            lineHeight: 0.9,
            letterSpacing: "-0.03em",
            color: "rgba(255,255,255,0.55)",
            textShadow: "0 1px 0 rgba(255,255,255,0.4)",
          }}
        >
          МНОГО
        </div>

        {/* Hero image */}
        <div className="relative h-[340px] flex items-end justify-center">
          <img
            src={bird}
            alt=""
            className="h-[300px] w-auto object-contain relative z-10"
            style={{
              filter: "drop-shadow(0 30px 40px rgba(50,90,140,0.25))",
              maskImage:
                "radial-gradient(ellipse 70% 75% at 50% 40%, #000 55%, transparent 100%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 70% 75% at 50% 40%, #000 55%, transparent 100%)",
            }}
          />
        </div>

        {/* Headline + sub */}
        <div className="relative z-20 mt-1">
          <h1
            className="text-white"
            style={{
              fontFamily: "'Fraunces', serif",
              fontWeight: 300,
              fontSize: "44px",
              lineHeight: 1.02,
              letterSpacing: "-0.02em",
            }}
          >
            Уют
            <br />
            <span style={{ color: "rgba(255,255,255,0.55)" }}>&</span>{" "}
            пространство
          </h1>
          <p
            className="mt-3 text-[13px] leading-[1.45] max-w-[260px]"
            style={{ color: "rgba(255,255,255,0.75)" }}
          >
            Сотни модульных домов от&nbsp;проверенных производителей. Доставка
            по всей России.
          </p>

          {/* CTA pill row */}
          <div className="mt-5 flex items-center gap-2">
            <button
              className="flex items-center gap-3 pl-5 pr-1.5 py-1.5 text-white text-[14px]"
              style={{
                background:
                  "linear-gradient(90deg, #0A4FE8 0%, #1F6BFF 60%, #0C8FD0 100%)",
                borderRadius: 999,
                boxShadow: "0 10px 24px -8px rgba(10,79,232,0.55)",
                fontWeight: 500,
              }}
            >
              Смотреть каталог
              <span
                className="flex items-center justify-center w-8 h-8 bg-white"
                style={{ borderRadius: 999, color: "#0A4FE8" }}
              >
                <ArrowRight size={16} strokeWidth={2.2} />
              </span>
            </button>
            <button
              className="px-5 py-2.5 text-[14px] bg-white"
              style={{
                borderRadius: 999,
                color: "#3a4a5c",
                fontWeight: 500,
              }}
            >
              Подобрать
            </button>
          </div>
        </div>
      </section>

      {/* Active users glass pill */}
      <div className="mt-6 px-5 flex justify-end">
        <div
          className="flex items-center gap-2 pl-1 pr-4 py-1"
          style={{
            background: "rgba(255,255,255,0.35)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            border: "1px solid rgba(255,255,255,0.5)",
            borderRadius: 999,
          }}
        >
          <div className="flex -space-x-2">
            {["#7BB7E0", "#D9B69A", "#A8C5A0", "#C8A5D9"].map((c) => (
              <span
                key={c}
                className="w-6 h-6 rounded-full border-2"
                style={{ background: c, borderColor: "rgba(255,255,255,0.7)" }}
              />
            ))}
          </div>
          <span
            className="text-[11px]"
            style={{ color: "rgba(255,255,255,0.85)" }}
          >
            активных
          </span>
          <span
            className="text-[12px] text-white"
            style={{ fontWeight: 600 }}
          >
            +323
          </span>
        </div>
      </div>

      {/* Bento glass cards */}
      <section className="mt-4 px-5 grid grid-cols-2 gap-3">
        {/* Card 1 */}
        <GlassCard>
          <img
            src={lock}
            alt=""
            className="w-16 h-16 object-contain -mb-2"
            loading="lazy"
          />
          <Chip>Гарантия</Chip>
          <p
            className="mt-3 text-[15px] leading-[1.2] text-white"
            style={{ fontWeight: 500 }}
          >
            Проверенные подрядчики
          </p>
          <ArrowBadge />
        </GlassCard>

        {/* Card 2 */}
        <GlassCard>
          <img
            src={orb}
            alt=""
            className="w-16 h-16 object-contain -mb-2"
            loading="lazy"
          />
          <p
            className="mt-3 text-[15px] leading-[1.2] text-white"
            style={{ fontWeight: 500 }}
          >
            AI-подбор
            <br />
            проекта
          </p>
          <p
            className="mt-2 text-[11px] leading-[1.4]"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            Опишите участок — мы найдём подходящий дом.
          </p>
          <ArrowBadge />
        </GlassCard>

        {/* Card 3 — full width stat */}
        <GlassCard className="col-span-2">
          <div className="flex items-end justify-between">
            <div>
              <span
                className="text-white"
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontWeight: 300,
                  fontSize: "56px",
                  lineHeight: 0.9,
                  letterSpacing: "-0.02em",
                }}
              >
                1.2k
                <span style={{ fontSize: 28 }}>+</span>
              </span>
              <p
                className="mt-2 text-[11px]"
                style={{ color: "rgba(255,255,255,0.75)" }}
              >
                Проектов от производителей
                <br />
                со всей страны
              </p>
            </div>
            <ArrowBadge />
          </div>
        </GlassCard>
      </section>

      {/* Trust footer */}
      <section className="mt-8 px-5 pb-12 flex items-center gap-3">
        <div className="flex -space-x-2">
          {["#7BB7E0", "#D9B69A", "#A8C5A0", "#C8A5D9"].map((c) => (
            <span
              key={c}
              className="w-8 h-8 rounded-full border-2"
              style={{ background: c, borderColor: "#A9BCCF" }}
            />
          ))}
        </div>
        <p
          className="text-[12px] leading-[1.3]"
          style={{ color: "rgba(255,255,255,0.85)" }}
        >
          Нам доверяют тысячи
          <br />
          семей по России
        </p>
      </section>
    </div>
  );
};

const GlassCard = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`relative p-4 ${className}`}
    style={{
      background: "rgba(255,255,255,0.18)",
      backdropFilter: "blur(18px)",
      WebkitBackdropFilter: "blur(18px)",
      border: "1px solid rgba(255,255,255,0.45)",
      borderRadius: 24,
      boxShadow: "0 10px 30px -12px rgba(50,90,140,0.25)",
    }}
  >
    {children}
  </div>
);

const Chip = ({ children }: { children: React.ReactNode }) => (
  <span
    className="inline-block text-[10px] px-2.5 py-1 mt-1"
    style={{
      background: "rgba(255,255,255,0.35)",
      borderRadius: 999,
      color: "#3a4a5c",
      fontWeight: 500,
    }}
  >
    {children}
  </span>
);

const ArrowBadge = () => (
  <span
    className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center"
    style={{
      borderRadius: 999,
      border: "1px solid rgba(255,255,255,0.5)",
      color: "rgba(255,255,255,0.85)",
    }}
  >
    <ArrowUpRight size={14} strokeWidth={2} />
  </span>
);

export default Lab;
