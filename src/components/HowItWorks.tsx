const steps = [
  {
    num: 1,
    title: "Выбираете проект",
    desc: "Фильтруйте по площади, цене и назначению участка",
    active: true,
  },
  {
    num: 2,
    title: "Считаете стоимость",
    desc: "Калькулятор с доставкой и монтажом в вашем регионе",
  },
  {
    num: 3,
    title: "Пишете производителю",
    desc: "Напрямую, без посредников",
  },
  {
    num: 4,
    title: "Получаете дом",
    desc: "Доставка и монтаж по всей России — от 2 до 8 недель",
  },
];

const HowItWorks = () => {
  return (
    <section>
      <div className="py-2 md:px-6 md:py-7">
        <div className="flex items-baseline justify-between mb-2.5 md:mb-8">
          <h2 className="text-[17px] md:text-lg font-medium text-foreground">Как это работает</h2>
        </div>

        {/* Desktop: horizontal grid */}
        <div className="hidden md:grid md:grid-cols-4 gap-0">
          {steps.map((step, i) => (
            <div key={step.num} className="relative pr-6">
              {i < steps.length - 1 && (
                <div className="absolute top-[19px] left-[40px] right-[-8px] h-px bg-border" />
              )}
              <div
                className={`w-[38px] h-[38px] rounded-full border flex items-center justify-center text-sm mb-4 relative z-10 ${
                  step.active
                    ? "bg-primary border-primary text-primary-foreground"
                    : "border-border text-muted-foreground bg-background"
                }`}
              >
                {step.num}
              </div>
              <h3 className="text-[15px] font-medium text-foreground mb-1.5">{step.title}</h3>
              <p className="text-[13px] font-light text-muted-foreground leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Mobile: vertical timeline */}
        <div className="flex flex-col md:hidden mt-2.5 bg-secondary rounded-xl p-5">
          {steps.map((step, i) => (
            <div key={step.num} className="flex gap-3.5 pb-4 last:pb-0">
              <div className="flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-[11px] text-primary-foreground shrink-0">
                  {step.num}
                </div>
                {i < steps.length - 1 && (
                  <div className="flex-1 w-px bg-border mt-1" />
                )}
              </div>
              <div className="pt-0.5">
                <h3 className="text-[13px] font-medium text-foreground mb-0.5">{step.title}</h3>
                <p className="text-[12px] font-light text-muted-foreground leading-[1.55]">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
