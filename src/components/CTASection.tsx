const CTASection = () => {
  return (
    <section>
      <div className="px-4 md:px-6 py-5 md:py-7 text-center md:text-center">
        <h2 className="text-[17px] md:text-[28px] font-medium text-foreground tracking-tight leading-tight mb-1.5 md:mb-3 md:text-center text-left">
          Не знаете с чего начать?
        </h2>
        <p className="text-[12px] md:text-base font-light text-muted-foreground leading-relaxed mb-4 md:mb-8 max-w-lg md:mx-auto text-left md:text-center">
          Расскажите что нужно — пришлём подборку проектов с ценами.
        </p>

        {/* Desktop: inline row */}
        <div className="hidden md:flex gap-2.5 max-w-md mx-auto">
          <input
            type="text"
            placeholder="Ваш email или телефон"
            className="flex-1 text-sm font-light bg-secondary border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary transition-colors"
          />
          <button className="bg-primary text-primary-foreground text-sm font-normal rounded-xl px-5 py-3 hover:opacity-90 transition-opacity whitespace-nowrap">
            Получить подборку
          </button>
        </div>

        {/* Mobile: two stacked buttons */}
        <div className="flex flex-col gap-2 md:hidden">
          <button className="w-full bg-primary text-primary-foreground text-[14px] font-normal rounded-[10px] py-3.5 hover:opacity-90 transition-opacity">
            Получить подборку
          </button>
          <button className="w-full text-[13px] font-light text-muted-foreground border border-border rounded-[10px] py-3 hover:border-primary hover:text-primary transition-colors">
            Как рассчитать стоимость
          </button>
        </div>

        <p className="hidden md:block text-[11px] font-light text-muted-foreground mt-3">
          Без спама. Только релевантные проекты.
        </p>
      </div>
    </section>
  );
};

export default CTASection;
