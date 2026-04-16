const stats = [
  { value: "214", label: "проектов" },
  { value: "80+", label: "производителей" },
  { value: "4–8 нед.", label: "до монтажа" },
  { value: "вся Россия", label: "доставка" },
];

const StatsRow = () => {
  return (
    <section>
      <div className="px-4 md:px-6 py-5 md:py-7 flex overflow-x-auto scrollbar-hide">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={`shrink-0 ${
              i < stats.length - 1
                ? "pr-6 md:pr-10 mr-6 md:mr-10 border-r border-border"
                : ""
            }`}
          >
            <div className="text-xl md:text-[1.625rem] font-medium text-foreground tracking-tight whitespace-nowrap">
              {stat.value}
            </div>
            <div className="text-[11px] md:text-[13px] font-light text-muted-foreground mt-0.5 whitespace-nowrap">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsRow;
