import { useState } from "react";

const CalculatorSection = () => {
  const [result] = useState({
    production: "1 200 000 ₽",
    delivery: "180 000 ₽",
    foundation: "120 000 ₽",
    assembly: "150 000 ₽",
    total: "1 650 000 ₽",
  });

  return (
    <section className="bg-secondary/50 border-b border-border">
      <div className="max-w-[1400px] mx-auto px-5 md:px-8 py-8 md:py-16">
        <div className="text-[10px] md:text-[11px] uppercase tracking-[2px] font-normal text-muted-foreground mb-2.5 md:mb-4">
          Стоимость
        </div>
        <h2 className="text-xl md:text-2xl font-medium text-foreground tracking-tight mb-5 md:mb-0">
          Посчитайте цену под ключ
        </h2>

        <div className="md:grid md:grid-cols-2 md:gap-10 md:mt-8">
          {/* Left — form */}
          <div>
            <p className="hidden md:block text-sm font-light text-muted-foreground leading-relaxed mb-6">
              Укажите параметры — получите ориентировочную стоимость с доставкой, фундаментом и монтажом в вашем регионе.
            </p>

            <div className="flex flex-col gap-3 md:gap-4">
              <Field label="Тип объекта" options={["Жилой дом", "Баня", "Гостевой корпус", "Глэмпинг"]} />

              <div className="grid grid-cols-2 gap-2.5 md:gap-3">
                <Field label="Площадь" options={["до 40 м²", "40–70 м²", "70–100 м²", "от 100 м²"]} />
                <Field label="Назначение" options={["ИЖС", "СНТ", "ЛПХ"]} />
              </div>

              <Field label="Регион" options={["Москва и МО", "Санкт-Петербург", "Урал", "Сибирь", "Краснодарский край"]} />
              <Field label="Фундамент" options={["Винтовые сваи", "Ленточный", "Плита", "Без фундамента"]} />

              <button className="w-full bg-primary text-primary-foreground text-[15px] md:text-sm font-normal rounded-xl py-3.5 hover:opacity-90 transition-opacity mt-1">
                Рассчитать стоимость
              </button>
            </div>
          </div>

          {/* Right — result card */}
          <div className="bg-background border border-border rounded-xl md:rounded-2xl p-[18px] md:p-7 mt-4 md:mt-0 self-start">
            <div className="text-[10px] uppercase tracking-[1.5px] text-muted-foreground mb-3.5 md:mb-5">
              Ориентировочный расчёт
            </div>

            <div className="flex flex-col">
              <ResultRow label="Проект и производство" value={result.production} />
              <ResultRow label="Доставка в регион" value={result.delivery} />
              <ResultRow label="Фундамент" value={result.foundation} />
              <ResultRow label="Монтаж" value={result.assembly} last />
            </div>

            <div className="flex justify-between items-baseline mt-3.5 md:mt-5 pt-3.5 md:pt-5 border-t-2 border-border">
              <span className="text-sm font-medium text-foreground">Итого под ключ</span>
              <span className="text-[22px] md:text-2xl font-medium text-primary tracking-tight">{result.total}</span>
            </div>

            <p className="text-[11px] font-light text-muted-foreground mt-2 md:mt-3 text-right">
              Точная сумма — после консультации с производителем
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const Field = ({ label, options }: { label: string; options: string[] }) => (
  <div>
    <div className="text-[11px] uppercase tracking-[1px] font-normal text-muted-foreground mb-1.5">
      {label}
    </div>
    <select className="w-full text-sm font-light text-foreground bg-background border border-border rounded-lg px-3.5 py-2.5 outline-none focus:border-primary transition-colors">
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  </div>
);

const ResultRow = ({ label, value, last }: { label: string; value: string; last?: boolean }) => (
  <div className={`flex justify-between items-baseline py-2.5 md:py-3 ${!last ? "border-b border-border" : ""}`}>
    <span className="text-[13px] font-light text-muted-foreground">{label}</span>
    <span className="text-[13px] md:text-sm font-normal text-foreground">{value}</span>
  </div>
);

export default CalculatorSection;
