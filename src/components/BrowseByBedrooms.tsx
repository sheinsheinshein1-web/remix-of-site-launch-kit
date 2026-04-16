import floorplanStudio from "@/assets/floorplan-studio.jpg";
import floorplan2bed from "@/assets/floorplan-2bed.jpg";

const rooms = [
  { label: "Студии", image: floorplanStudio },
  { label: "Одна спальня", image: floorplanStudio },
  { label: "Две спальни", image: floorplan2bed },
  { label: "Три спальни", image: floorplan2bed },
];

const BrowseByBedrooms = () => {
  return (
    <section id="browse" className="py-16 md:py-24 bg-background">
      <div className="max-w-[1400px] mx-auto px-5 md:px-8">
        <div className="grid md:grid-cols-[1fr_1.2fr] gap-12 md:gap-20 items-start">
          {/* Left: text */}
          <div className="flex flex-col">
            <h2 className="jumbo-text mb-1">
              Подбор по комнатам
            </h2>
            <h3 className="text-primary font-semibold text-xl md:text-2xl mb-5">
              (Найдите свой размер)
            </h3>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-8 max-w-md">
              От уютных студий до просторных трёхкомнатных — найдите планировку под ваши нужды. Сравнивайте варианты от лучших производителей в одном месте.
            </p>
            <a href="#" className="btn-secondary-dwellito self-start">
              Все планировки
            </a>
          </div>

          {/* Right: 2x2 grid of floor plans */}
          <div className="grid grid-cols-2 gap-3">
            {rooms.map((room) => (
              <a key={room.label} href="#" className="group block">
                <div className="bg-muted rounded overflow-hidden">
                  <img
                    src={room.image}
                    alt={room.label}
                    loading="lazy"
                    width={640}
                    height={640}
                    className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p className="text-center text-sm text-muted-foreground mt-2 font-medium">
                  {room.label}
                </p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrowseByBedrooms;
