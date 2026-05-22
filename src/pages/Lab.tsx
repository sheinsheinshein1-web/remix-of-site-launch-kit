import { ArrowRight, ArrowUpRight, Search, ChevronDown, Heart, SlidersHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import logoMarkWhite from "@/assets/logo-mark-white.svg";
import house1 from "@/assets/house-1.webp";
import house2 from "@/assets/house-2.webp";
import house3 from "@/assets/house-3.webp";
import house4 from "@/assets/house-4.webp";
import catHouses from "@/assets/cat-houses.webp";
import catBaths from "@/assets/cat-baths.webp";
import catGlamping from "@/assets/cat-glamping.webp";
import catGuest from "@/assets/cat-guest.webp";

/**
 * /lab — экспериментальная мобильная главная в стиле "BLUEBIRD".
 * Берёт структуру обычной главной (хедер, поиск, CTA, категории, лента проектов,
 * статистика) и переодевает её в стекломорфизм на пастельно-голубом фоне.
 * Полностью изолирована от основного дизайна.
 */

const PAGE_BG =
  "linear-gradient(180deg, #B8C9DA 0%, #A9BCCF 45%, #C2D2E0 100%)";

const GLASS = {
  background: "rgba(255,255,255,0.45)",
  backdropFilter: "blur(18px) saturate(140%)",
  WebkitBackdropFilter: "blur(18px) saturate(140%)",
  border: "1px solid rgba(255,255,255,0.65)",
  boxShadow: "0 10px 30px -14px rgba(40,70,110,0.28)",
} as const;

const GLASS_DARK = {
  background: "rgba(255,255,255,0.22)",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
  border: "1px solid rgba(255,255,255,0.45)",
} as const;

const Lab = () => {
  return (
    <div
      className="min-h-screen w-full overflow-x-hidden pb-20"
      style={{ background: PAGE_BG, color: "#2c3a4d" }}
    >
      {/* === Header === */}
      <header
        className="sticky top-0 z-40 px-3 pt-[max(env(safe-area-inset-top),10px)] pb-2"
        style={{
          background: "rgba(169,188,207,0.7)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-[20px] font-semibold tracking-[-0.03em] text-white"
          >
            <img src={logoMarkWhite} alt="" className="h-[20px] w-[20px]" />
            Много места
          </Link>
          <button
            className="flex items-center gap-1 text-[12px] px-3 h-8 text-white"
            style={{ ...GLASS_DARK, borderRadius: 999 }}
          >
            Москва
            <ChevronDown className="w-3.5 h-3.5 opacity-80" strokeWidth={2} />
          </button>
        </div>

        {/* Search glass pill */}
        <div
          className="mt-2 flex items-center gap-2 pl-4 pr-1 h-11"
          style={{ ...GLASS, borderRadius: 999 }}
        >
          <Search className="w-4 h-4" style={{ color: "#5d6f85" }} strokeWidth={2} />
          <input
            placeholder="Найти проект, производителя…"
            className="flex-1 bg-transparent outline-none text-[14px] placeholder:text-[#5d6f85]/70"
            style={{ color: "#2c3a4d" }}
          />
          <button
            className="w-9 h-9 flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg,#0A4FE8 0%,#0C8FD0 100%)",
              borderRadius: 999,
              color: "#fff",
            }}
          >
            <SlidersHorizontal className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>
      </header>

      {/* === Hero CTA card === */}
      <section className="px-3 mt-3">
        <div
          className="relative overflow-hidden p-5 pb-6"
          style={{
            background:
              "linear-gradient(135deg, #0A4FE8 0%, #1F6BFF 55%, #0C8FD0 100%)",
            borderRadius: 28,
            boxShadow: "0 18px 40px -16px rgba(10,79,232,0.55)",
          }}
        >
          {/* decorative glow */}
          <div
            aria-hidden
            className="absolute -right-12 -top-12 w-48 h-48 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(255,255,255,0.45) 0%, transparent 70%)",
            }}
          />
          <span
            className="inline-block text-[10px] uppercase tracking-[0.12em] px-2.5 py-1 text-white"
            style={{ ...GLASS_DARK, borderRadius: 999 }}
          >
            Маркетплейс
          </span>
          <h1
            className="mt-3 text-white text-[26px] leading-[1.1] tracking-[-0.02em]"
            style={{ fontWeight: 600, maxWidth: "85%" }}
          >
            Сотни быстровозводимых домов наСотни модульных домов на&nbsp;одном сайтеnbsp;одном сайте
          </h1>
          <p className="mt-2 text-[13px] text-white/75 leading-[1.4] max-w-[80%]">
            Проекты от&nbsp;проверенных производителей с&nbsp;доставкой
            по&nbsp;России.
          </p>
          <div className="mt-5 flex items-center gap-2">
            <button
              className="flex items-center gap-2 pl-5 pr-1.5 py-1.5 text-[14px] bg-white"
              style={{ borderRadius: 999, color: "#0A4FE8", fontWeight: 500 }}
            >
              Каталог
              <span
                className="flex items-center justify-center w-8 h-8"
                style={{
                  background: "linear-gradient(135deg,#0A4FE8,#0C8FD0)",
                  borderRadius: 999,
                  color: "#fff",
                }}
              >
                <ArrowRight size={15} strokeWidth={2.4} />
              </span>
            </button>
            <button
              className="px-4 py-2.5 text-[13px] text-white"
              style={{ ...GLASS_DARK, borderRadius: 999 }}
            >
              Подобрать
            </button>
          </div>
        </div>
      </section>

      {/* === Category chips === */}
      <section className="mt-4 px-3">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide -mx-3 px-3">
          {[
            { label: "Дома", img: catHouses },
            { label: "Бани", img: catBaths },
            { label: "Глэмпинг", img: catGlamping },
            { label: "Гостевые", img: catGuest },
            { label: "Дачные", img: catHouses },
          ].map((c, i) => (
            <button
              key={c.label}
              className="flex-shrink-0 flex items-center gap-2 pl-1 pr-4 py-1 h-11"
              style={{
                ...GLASS,
                borderRadius: 999,
                color: i === 0 ? "#0A4FE8" : "#2c3a4d",
                fontWeight: i === 0 ? 500 : 400,
              }}
            >
              <span
                className="w-9 h-9 flex items-center justify-center"
                style={{
                  background: "rgba(255,255,255,0.7)",
                  borderRadius: 999,
                }}
              >
                <img src={c.img} alt="" className="w-7 h-7 object-contain" />
              </span>
              <span className="text-[13px]">{c.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* === Stats glass row === */}
      <section className="mt-4 px-3 grid grid-cols-3 gap-2">
        {[
          { v: "1.2k+", l: "проектов" },
          { v: "180+", l: "производителей" },
          { v: "85", l: "регионов" },
        ].map((s) => (
          <div
            key={s.l}
            className="p-3"
            style={{ ...GLASS, borderRadius: 20 }}
          >
            <div
              className="text-[22px] leading-none text-white"
              style={{ fontWeight: 600, letterSpacing: "-0.02em" }}
            >
              {s.v}
            </div>
            <div
              className="mt-1 text-[11px]"
              style={{ color: "rgba(255,255,255,0.78)" }}
            >
              {s.l}
            </div>
          </div>
        ))}
      </section>

      {/* === Section heading === */}
      <div className="mt-6 px-3 flex items-end justify-between">
        <h2
          className="text-white text-[20px] tracking-[-0.02em]"
          style={{ fontWeight: 600 }}
        >
          Популярные проекты
        </h2>
        <button
          className="text-[12px] text-white/80 flex items-center gap-1"
        >
          Все
          <ArrowUpRight size={13} strokeWidth={2} />
        </button>
      </div>

      {/* === Projects grid (glass cards) === */}
      <section className="mt-3 px-3 grid grid-cols-2 gap-3">
        {[
          { img: house1, name: "Wide House", price: "от 4.2 млн", area: "85 м²", likes: 64 },
          { img: house2, name: "Bear 168", price: "от 6.8 млн", area: "168 м²", likes: 95 },
          { img: house3, name: "Tundra", price: "от 3.6 млн", area: "72 м²", likes: 41 },
          { img: house4, name: "Sherwood", price: "от 5.1 млн", area: "110 м²", likes: 28 },
        ].map((p) => (
          <div
            key={p.name}
            className="overflow-hidden p-1.5"
            style={{ ...GLASS, borderRadius: 22 }}
          >
            <div
              className="relative overflow-hidden"
              style={{ borderRadius: 16, aspectRatio: "1 / 1.05" }}
            >
              <img
                src={p.img}
                alt={p.name}
                className="w-full h-full object-cover"
              />
              <button
                className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center"
                style={{ ...GLASS_DARK, borderRadius: 999 }}
              >
                <Heart className="w-4 h-4 text-white" strokeWidth={2} />
              </button>
              <span
                className="absolute bottom-2 left-2 text-[10px] text-white px-2 py-0.5"
                style={{ ...GLASS_DARK, borderRadius: 999 }}
              >
                {p.likes}
              </span>
            </div>
            <div className="px-1.5 pt-2 pb-1.5">
              <div
                className="text-[13px] text-white leading-tight"
                style={{ fontWeight: 500 }}
              >
                {p.name}
              </div>
              <div className="mt-0.5 flex items-center justify-between">
                <span className="text-[11px] text-white/70">{p.area}</span>
                <span
                  className="text-[12px] text-white"
                  style={{ fontWeight: 500 }}
                >
                  {p.price}
                </span>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* === Promo bento (AI + partner) === */}
      <section className="mt-4 px-3 grid grid-cols-5 gap-3">
        <div
          className="col-span-3 relative p-4 overflow-hidden"
          style={{ ...GLASS, borderRadius: 24, minHeight: 150 }}
        >
          <span
            className="text-[10px] uppercase tracking-[0.12em] px-2 py-0.5"
            style={{ ...GLASS_DARK, borderRadius: 999, color: "#fff" }}
          >
            AI
          </span>
          <div
            className="mt-3 text-white text-[16px] leading-[1.2]"
            style={{ fontWeight: 500 }}
          >
            Подберём дом
            <br />
            под&nbsp;ваш участок
          </div>
          <button
            className="absolute bottom-4 left-4 flex items-center gap-2 pl-3 pr-1 py-1 text-[12px] text-white"
            style={{
              background: "linear-gradient(135deg,#0A4FE8,#0C8FD0)",
              borderRadius: 999,
              fontWeight: 500,
            }}
          >
            Начать
            <span
              className="w-6 h-6 flex items-center justify-center bg-white"
              style={{ borderRadius: 999, color: "#0A4FE8" }}
            >
              <ArrowRight size={12} strokeWidth={2.4} />
            </span>
          </button>
          <div
            aria-hidden
            className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full"
            style={{
              background:
                "radial-gradient(circle,rgba(10,79,232,0.45) 0%,transparent 70%)",
            }}
          />
        </div>

        <div
          className="col-span-2 p-4 flex flex-col justify-between"
          style={{ ...GLASS, borderRadius: 24, minHeight: 150 }}
        >
          <span
            className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center"
            style={{ ...GLASS_DARK, borderRadius: 999, color: "#fff" }}
          >
            <ArrowUpRight size={13} strokeWidth={2} />
          </span>
          <div
            className="text-white text-[28px] leading-none"
            style={{ fontWeight: 600, letterSpacing: "-0.02em" }}
          >
            42<span className="text-[16px]">%</span>
          </div>
          <p className="text-[11px] text-white/75 leading-[1.35]">
            Скидка для первых заказов в&nbsp;этом месяце
          </p>
        </div>
      </section>

      {/* === Trust footer === */}
      <section className="mt-6 px-3">
        <div
          className="flex items-center gap-3 p-3"
          style={{ ...GLASS, borderRadius: 999 }}
        >
          <div className="flex -space-x-2">
            {["#7BB7E0", "#D9B69A", "#A8C5A0", "#C8A5D9"].map((c) => (
              <span
                key={c}
                className="w-7 h-7 rounded-full border-2"
                style={{ background: c, borderColor: "rgba(255,255,255,0.85)" }}
              />
            ))}
          </div>
          <p className="text-[12px] text-white/85 leading-[1.3]">
            Нам доверяют тысячи семей по&nbsp;России
          </p>
        </div>
      </section>
    </div>
  );
};

export default Lab;
