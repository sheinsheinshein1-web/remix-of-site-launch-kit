import { Star } from "lucide-react";

const reviews = [
  {
    initials: "АК",
    name: "Андрей Королёв",
    location: "Подмосковье",
    rating: 5,
    project: "Тайга 72 · СибМодуль",
    text: "Искал дачный дом полгода. Здесь нашёл за вечер — реальные цены, документы, отзывы.",
    tag: "Дачный дом · 72 м²",
    color: "bg-primary/10 text-primary",
  },
  {
    initials: "ЕМ",
    name: "Елена Морозова",
    location: "Краснодар",
    rating: 5,
    project: "Кедр 24 · УралДом",
    text: "Калькулятор сразу показал реальную цену с доставкой — никаких сюрпризов.",
    tag: "Баня · 24 м²",
    color: "bg-green-100 text-green-700",
  },
  {
    initials: "ДС",
    name: "Дмитрий Сергеев",
    location: "Екатеринбург",
    rating: 4,
    project: "Loft 48 · МодульХаус",
    text: "Сравнивал три проекта через сайт — очень удобно видеть всё рядом.",
    tag: "Жилой дом · 48 м²",
    color: "bg-amber-100 text-amber-700",
  },
];

const ReviewsSection = () => {
  return (
    <section>
      <div className="py-2 md:px-6 md:py-7">
        <div className="flex items-baseline justify-between mb-2.5 md:mb-8">
          <h2 className="text-[17px] md:text-lg font-medium text-foreground">Истории покупателей</h2>
          <a href="#" className="text-[14px] md:text-[13px] font-light text-primary hover:underline shrink-0 inline-flex items-center gap-1">
            Смотреть все <span className="text-[12px]">›</span>
          </a>
        </div>

        {/* Desktop: 3-col grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-4">
          {reviews.map((r) => (
            <ReviewCard key={r.name} {...r} />
          ))}
        </div>

        {/* Mobile: each review is its own bento card, scroll horizontally */}
        <div className="-mx-3 px-3 flex gap-2.5 overflow-x-auto scrollbar-hide pb-1 md:hidden mt-2.5">
          {reviews.map((r) => (
            <div key={r.name} className="shrink-0 w-[300px] bg-card border border-border rounded-2xl p-4">
              <ReviewCard {...r} mobile />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ReviewCard = ({
  initials, name, location, rating, project, text, color, mobile,
}: {
  initials: string; name: string; location: string; rating: number;
  project: string; text: string; tag?: string; color: string; mobile?: boolean;
}) => (
  <div className={`flex flex-col gap-2 md:gap-4 ${mobile ? "" : "border border-border rounded-[10px] p-6 bg-background"}`}>
    <div className="flex items-center gap-2 md:gap-3">
      <div className={`w-[34px] h-[34px] md:w-10 md:h-10 rounded-full flex items-center justify-center text-[12px] md:text-sm font-medium shrink-0 ${color}`}>
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] md:text-sm font-medium text-foreground">{name}</div>
        <div className="text-[11px] md:text-xs font-light text-muted-foreground">{location}</div>
      </div>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-3 h-3 md:w-3.5 md:h-3.5 ${i < rating ? "text-amber-400 fill-amber-400" : "text-border"}`}
            strokeWidth={1.5}
          />
        ))}
      </div>
    </div>

    <div className="text-[11px] md:text-xs font-light text-primary">{project}</div>

    <p className="text-[13px] md:text-sm font-light text-muted-foreground leading-relaxed flex-1">
      {text}
    </p>
  </div>
);

export default ReviewsSection;
