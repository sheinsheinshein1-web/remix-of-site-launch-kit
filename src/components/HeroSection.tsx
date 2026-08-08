import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { manufacturers, projects } from "@/data/projects";

const HeroSection = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const stats = [
    { value: String(projects.length), label: "проектов домов" },
    { value: String(manufacturers.length), label: "производители" },
    { value: String(new Set(projects.map((p) => p.city)).size), label: "регионы" },
    { value: String(new Set(projects.map((p) => p.technology)).size), label: "технологии" },
  ];

  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized = query.trim();
    navigate(normalized ? `/catalog?q=${encodeURIComponent(normalized)}` : "/catalog");
  };

  return (
    <section className="bg-[#f5f7ff]">
      <div className="relative h-[60vh] md:h-[72vh] min-h-[400px] md:min-h-[480px] max-h-[680px] overflow-hidden border-b border-[#dfe5f5] bg-[linear-gradient(180deg,#4f7fe8_0%,#86a7f4_48%,#f5f7ff_100%)]">
        <span className="hidden md:block absolute left-[32%] top-[34%] h-7 w-7 text-white/55 before:absolute before:left-1/2 before:top-0 before:h-full before:w-px before:-translate-x-1/2 before:bg-current after:absolute after:left-0 after:top-1/2 after:h-px after:w-full after:-translate-y-1/2 after:bg-current" aria-hidden />
        <span className="hidden md:block absolute left-[58%] top-[22%] h-6 w-6 text-white/45 before:absolute before:left-1/2 before:top-0 before:h-full before:w-px before:-translate-x-1/2 before:bg-current after:absolute after:left-0 after:top-1/2 after:h-px after:w-full after:-translate-y-1/2 after:bg-current" aria-hidden />

        <div className="absolute inset-x-0 bottom-8 md:bottom-12 z-10">
          <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-8 lg:px-12">
            <h1 className="max-w-[420px] text-[24px] md:text-[28px] leading-[1.2] font-light tracking-tight text-[#2f2923]">
              Найдите свой<br />
              <span className="font-semibold">модульный дом.</span>
            </h1>

            <p className="mt-3 md:mt-4 max-w-[340px] text-[13px] leading-relaxed tracking-wide font-normal text-[#768093]">
              Все производители. Все системы сборки. Цены, характеристики и зоны доставки. В одном месте.
            </p>

            <form onSubmit={submitSearch} className="mt-5 md:mt-6 flex w-full md:w-[440px] overflow-hidden rounded-[3px] border border-[#dfe5f5] bg-white/90 shadow-sm">
              <label className="sr-only" htmlFor="hero-search">Производитель, модель или регион</label>
              <input
                id="hero-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="min-w-0 flex-1 bg-transparent px-3 md:px-4 py-3 text-[11px] uppercase tracking-[0.1em] text-[#263248] placeholder:text-[#8792aa] outline-none"
                placeholder="Производитель, модель или регион"
              />
              <button
                type="submit"
                className="shrink-0 px-4 md:px-5 bg-primary text-white text-[10px] font-semibold uppercase tracking-[0.16em] hover:bg-primary/90 transition-colors"
              >
                Поиск
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="border-b border-[#dfe5f5] bg-[#f8faff]">
        <div className="mx-auto grid w-full max-w-[1400px] grid-cols-2 md:grid-cols-4">
          {stats.map((stat, index) => (
            <button
              key={stat.label}
              type="button"
              onClick={() => navigate(index === 1 ? "/partner" : "/catalog")}
              className="min-h-[82px] md:min-h-[92px] px-5 md:px-9 text-left border-r border-b md:border-b-0 border-[#dfe5f5] last:border-r-0 hover:bg-white/70 transition-colors"
            >
              <span className="block text-[21px] md:text-[24px] leading-none font-light text-[#3a332d]">
                {stat.value}
              </span>
              <span className="mt-3 md:mt-4 block text-[8px] md:text-[9px] uppercase tracking-[0.24em] md:tracking-[0.32em] font-medium text-[#7e879a]">
                {stat.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
