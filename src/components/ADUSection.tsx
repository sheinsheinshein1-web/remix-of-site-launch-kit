import aduOffice from "@/assets/adu-office.jpg";

const ADUSection = () => {
  return (
    <section id="adu" className="py-16 md:py-24 bg-background">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid md:grid-cols-[1.2fr_1fr] gap-12 md:gap-20 items-start">
          {/* Left: image */}
          <div>
            <img
              src={aduOffice}
              alt="Офис на участке"
              loading="lazy"
              width={800}
              height={600}
              className="w-full rounded"
            />
          </div>

          {/* Right: text */}
          <div className="flex flex-col">
            <h2 className="jumbo-text mb-1">
              Офисы и гостевые дома
            </h2>
            <h3 className="text-primary font-semibold text-xl md:text-2xl mb-5">
              (Увеличьте стоимость участка)
            </h3>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-8 max-w-md">
              Добавьте жилое пространство, арендный доход или выделенную рабочую зону. Готовые модули от ведущих производителей с доставкой и установкой.
            </p>
            <a href="#" className="btn-secondary-dwellito self-start">
              Смотреть варианты
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ADUSection;
