import floorplanStudio from "@/assets/floorplan-studio.jpg";
import floorplan2bed from "@/assets/floorplan-2bed.jpg";
import aduOffice from "@/assets/adu-office.jpg";

const ManufacturersSection = () => {
  return (
    <section id="manufacturers" className="py-16 md:py-24 bg-background">
      <div className="max-w-[1400px] mx-auto px-5 md:px-8">
        <div className="grid md:grid-cols-[1fr_1.2fr] gap-12 md:gap-20 items-start">
          {/* Left: text */}
          <div className="flex flex-col">
            <h2 className="jumbo-text mb-1">
              Сравните лучших производителей
            </h2>
            <h3 className="text-primary font-semibold text-xl md:text-2xl mb-5">
              (Без давления продавцов)
            </h3>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-8 max-w-md">
              Изучайте проекты домов в своём темпе. Наша платформа позволяет сравнивать производителей без навязчивых звонков — только пространство и время для правильного решения.
            </p>
            <a href="#" className="btn-secondary-dwellito self-start">
              Все производители
            </a>
          </div>

          {/* Right: collage of images like Dwellito */}
          <div className="flex gap-3 items-start">
            <div className="flex-1">
              <img
                src={floorplanStudio}
                alt="Производитель 1"
                loading="lazy"
                width={640}
                height={640}
                className="w-full rounded"
              />
            </div>
            <div className="flex flex-col gap-3 flex-1">
              <img
                src={aduOffice}
                alt="Производитель 2"
                loading="lazy"
                width={800}
                height={600}
                className="w-full rounded"
              />
              <img
                src={floorplan2bed}
                alt="Производитель 3"
                loading="lazy"
                width={640}
                height={640}
                className="w-full rounded"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ManufacturersSection;
