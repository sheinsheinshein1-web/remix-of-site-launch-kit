import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import catHouses from "@/assets/cat-houses.webp";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="pt-[112px] md:pt-24 md:pb-6 pb-3">
      <Helmet>
        <link rel="preload" as="image" href={catHouses} {...{ fetchpriority: "high" } as any} />
      </Helmet>
      <div className="max-w-[1400px] mx-auto">
        <div
          className="rounded-2xl overflow-hidden relative cursor-pointer bg-primary mx-0"
          onClick={() => navigate("/catalog")}
        >
          <img
            src={catHouses}
            alt=""
            width={420}
            height={420}
            loading="eager"
            decoding="async"
            fetchPriority="high"
            className="absolute -bottom-12 -right-16 md:-bottom-20 md:right-[-120px] w-[240px] h-[240px] md:w-[420px] md:h-[420px] object-contain pointer-events-none z-10 opacity-90"
          />

          <div className="relative z-20 px-4 py-3 md:px-12 md:py-10 flex flex-col">
            <p className="hidden md:block text-[13px] font-light tracking-wide mb-3 text-white/70">
              Маркетплейс модульных строений
            </p>

            <h1 className="text-[22px] md:text-[2.75rem] font-bold leading-[1.15] md:leading-[1.18] tracking-tight mb-1 md:mb-4 max-w-[65%] md:max-w-[620px] text-white">
              Сотни быстровозводимых домов наСотни модульных домов на&nbsp;одном сайтеnbsp;одном сайте
            </h1>

            <p className="text-[12px] md:text-[17px] font-light leading-[1.4] mt-1 mb-2.5 md:mb-5 max-w-[55%] md:max-w-[520px] text-white/70">
              Находите проекты от&nbsp;проверенных производителей.
            </p>

            <button className="hidden md:inline-flex w-fit px-6 py-3 bg-white text-primary text-[15px] font-semibold rounded-xl hover:bg-white/90 transition-colors">
              Смотреть каталог
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
