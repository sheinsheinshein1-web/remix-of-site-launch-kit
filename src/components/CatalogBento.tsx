import wideHouse from "@/assets/wide-house-1.webp";
import bear86_1 from "@/assets/bear86-1.webp";
import bear134_1 from "@/assets/bear134-1.webp";

const houses = [
  {
    name: 'Wide House',
    image: wideHouse,
    price: "5 480 000 ₽",
    area: "46,4 м²",
    floors: "1 этаж",
    delivery: "Доставка в Москву",
  },
  {
    name: 'Bear House 86',
    image: bear86_1,
    price: "4 349 000 ₽",
    area: "68,7 м²",
    floors: "1 этаж",
    delivery: "Доставка в Москву",
  },
  {
    name: 'Bear House 134',
    image: bear134_1,
    price: "8 762 000 ₽",
    area: "110 м²",
    floors: "1 этаж",
    delivery: "Доставка в Москву",
  },
];

const CatalogBento = () => {
  return (
    <section className="py-14 md:py-20 bg-muted/40">
      <div className="max-w-[1400px] mx-auto px-5 md:px-8">
        {/* Header row */}
        <div className="flex items-center justify-between mb-8 md:mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Популярные модели
          </h2>
          <a href="#" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
            Смотреть все <span>›</span>
          </a>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {houses.map((house) => (
            <a key={house.name} href="#" className="group bg-background rounded-xl overflow-hidden border border-border hover:shadow-md transition-shadow">
              {/* Image */}
              <div className="overflow-hidden">
                <img
                  src={house.image}
                  alt={house.name}
                  loading="lazy"
                  width={800}
                  height={512}
                  className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-sm md:text-base font-semibold text-foreground mb-1">
                  {house.name}
                </h3>
                <p className="text-lg md:text-xl font-bold text-foreground mb-3">
                  от {house.price}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                  <span>{house.area}</span>
                  <span>{house.floors}</span>
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mb-4">
                  <span className="text-primary">↗</span> {house.delivery}
                </p>
                <span className="text-sm font-semibold text-primary flex items-center gap-1">
                  Подробнее <span>›</span>
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CatalogBento;
