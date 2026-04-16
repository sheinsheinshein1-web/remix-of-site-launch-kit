const articles = [
  { title: "Как выбрать модульный дом", tag: "Гайд", readTime: "5 мин", gradient: "from-[#E8F0FE] to-[#D2E3FC]" },
  { title: "Сколько стоит баня под ключ", tag: "Цены", readTime: "3 мин", gradient: "from-[#FEF3E2] to-[#FDDCB5]" },
  { title: "Глэмпинг как бизнес", tag: "Бизнес", readTime: "7 мин", gradient: "from-[#E6F4EA] to-[#CEEAD6]" },
  { title: "Фундамент для модульного дома", tag: "Советы", readTime: "4 мин", gradient: "from-[#F3E8FD] to-[#E4D0F8]" },
];

const ArticlesSection = () => {
  return (
    <section>
      <div className="px-4 md:px-6 py-5 md:py-7">
        <div className="flex items-baseline justify-between mb-3 md:mb-4">
          <h2 className="text-[17px] md:text-lg font-medium text-foreground">Полезные статьи</h2>
          <a href="#" className="text-[14px] md:text-[13px] font-light text-primary hover:underline shrink-0 inline-flex items-center gap-1">
            Все статьи <span className="text-[12px]">›</span>
          </a>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {articles.map((a) => (
            <button key={a.title} className={`bg-gradient-to-br ${a.gradient} rounded-xl p-4 text-left transition-opacity hover:opacity-80`}>
              <span className="inline-block text-[10px] font-medium text-foreground/60 bg-background/60 rounded px-1.5 py-0.5 mb-2">
                {a.tag}
              </span>
              <div className="text-[13px] font-medium text-foreground leading-snug mb-1.5">{a.title}</div>
              <div className="text-[11px] font-light text-foreground/50">{a.readTime} чтения</div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ArticlesSection;
