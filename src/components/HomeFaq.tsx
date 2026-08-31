import FaqList from "@/components/FaqList";
import { homeFaq } from "@/data/homeFaq";

const HomeFaq = () => (
  <section id="faq" className="mt-4 scroll-mt-20">
    <div className="mx-auto grid w-full max-w-[1400px] gap-8 px-4 py-10 sm:px-8 sm:py-14 md:grid-cols-[0.72fr_1.28fr] md:gap-14 lg:px-12">
      <div className="max-w-[440px]">
        <h2 className="text-[25px] font-semibold leading-none tracking-[-0.03em] text-[#342d27] sm:text-[28px] md:text-[36px] dark:text-foreground">
          Часто задаваемые вопросы
        </h2>
      </div>

      <FaqList items={homeFaq} idPrefix="home-faq" />
    </div>
  </section>
);

export default HomeFaq;
