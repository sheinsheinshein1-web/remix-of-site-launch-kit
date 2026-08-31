import { Link } from "react-router-dom";
import { CATALOG_PATH, MANUFACTURERS_PATH } from "@/lib/siteRoutes";

const HomeClosingCta = () => (
  <section className="bg-background">
    <div className="mx-auto flex w-full max-w-[1400px] flex-col items-center px-4 pb-24 pt-20 text-center sm:px-8 sm:pb-32 sm:pt-28 lg:px-12 lg:pb-36 lg:pt-32">
      <h2 className="max-w-[820px] text-[30px] font-medium leading-[1.02] tracking-[-0.025em] text-[#342d27] sm:text-[40px] md:text-[52px]">
        Готовы выбрать свой дом?
      </h2>
      <p className="mt-5 max-w-[660px] text-[14px] leading-relaxed text-muted-foreground md:mt-6 md:text-[17px]">
        Сравните проекты, цены и производителей — всё необходимое для выбора дома собрано в одном месте.
      </p>

      <div className="mt-8 flex w-full max-w-[520px] flex-col justify-center gap-3 sm:w-auto sm:max-w-none sm:flex-row md:mt-10">
        <Link
          to={CATALOG_PATH}
          className="inline-flex min-h-12 items-center justify-center rounded-[var(--radius)] bg-primary px-6 text-[14px] font-medium text-white transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
        >
          Смотреть проекты
        </Link>
        <Link
          to={MANUFACTURERS_PATH}
          className="inline-flex min-h-12 items-center justify-center rounded-[var(--radius)] border border-[#d7d7d4] bg-white px-6 text-[14px] font-medium text-[#342d27] transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
        >
          Смотреть производителей
        </Link>
      </div>
    </div>
  </section>
);

export default HomeClosingCta;
