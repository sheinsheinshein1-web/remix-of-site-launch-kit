import { useState } from "react";
import partnerRenderAfter from "@/assets/partner-render-after.webp";
import partnerRenderBefore from "@/assets/partner-render-before.webp";
import BeforeAfterComparison from "@/components/BeforeAfterComparison";
import FaqList from "@/components/FaqList";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PartnerApplicationContent from "@/components/partner/PartnerApplicationContent";
import PartnerFeatureSection from "@/components/partner/PartnerFeatureSection";
import PartnerHeroSection from "@/components/partner/PartnerHeroSection";
import {
  PartnerBusinessPreview,
  PartnerCrmPreview,
  PartnerMarketplacePreview,
  PartnerProfilePreview,
} from "@/components/partner/PartnerProductVisuals";
import Seo from "@/components/Seo";
import { Button } from "@/components/ui/button";
import {
  partnerFaq,
  partnerSteps,
} from "@/data/partnerProgram";
import { makersById, projects } from "@/data/projects";
import { geoLocationCount } from "@/data/regions";
import { buildCanonicalUrl } from "@/lib/seo";

const showcaseMaker = makersById.platforma ?? Object.values(makersById)[0];
const showcaseProjects = projects.filter((project) => project.manufacturerId === showcaseMaker?.id).slice(0, 3);
const marketplaceProjects = showcaseProjects.length >= 2 ? showcaseProjects : projects.slice(0, 3);
const businessProjects = projects
  .filter((project) => project.suitableFor.some((value) => ["Аренда", "Бизнес", "Гостевой дом"].includes(value)))
  .slice(0, 3);
const manufacturerCount = Object.keys(makersById).length;

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: partnerFaq.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Главная", item: buildCanonicalUrl("/") },
    { "@type": "ListItem", position: 2, name: "Производителям", item: buildCanonicalUrl("/partner/") },
  ],
};

const ctaClassName =
  "min-h-12 rounded-[var(--radius)] px-6 text-[15px] font-semibold focus-visible:ring-primary focus-visible:ring-offset-2";

const PartnerLanding = () => {
  const [showForm, setShowForm] = useState(false);
  const [initialInterest, setInitialInterest] = useState("");

  const openForm = () => {
    setInitialInterest("Квалифицированные лиды");
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const openFormWithInterest = (interest: string) => {
    setInitialInterest(interest);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const closeForm = () => {
    setShowForm(false);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  if (showForm) {
    return (
      <div className="min-h-screen bg-background font-sans">
        <Seo
          title="Заявка для производителя | многоместа.рф"
          description="Оставьте заявку на привлечение покупателей или подготовку изображений домов и бань."
          canonicalPath="/partner/"
          noIndex
        />
        <Header variant="partner" />
        <PartnerApplicationContent
          breadcrumbItems={[
            { label: "Главная", to: "/" },
            { label: "Производителям", to: "/partner/", onClick: closeForm },
            { label: "Заявка" },
          ]}
          initialInterest={initialInterest}
          onBack={closeForm}
          title={initialInterest === "Художественные рендеры" ? "Заявка на улучшение изображений" : "Заявка на получение лидов"}
          description={initialInterest === "Художественные рендеры"
            ? "Оставьте контакты компании. Обсудим исходные материалы и нужные изображения."
            : "Оставьте контакты компании. Мы изучим ассортимент и обсудим подключение."}
          submitLabel="Оставить заявку"
          visual={showcaseMaker && marketplaceProjects.length >= 2
            ? <PartnerMarketplacePreview projects={marketplaceProjects} maker={showcaseMaker} />
            : undefined}
        />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-sans">
      <Seo
        title="Покупатели домов и бань для производителей | многоместа.рф"
        description="Помогаем продавать дома и бани: оформляем каталог и страницу компании, улучшаем изображения, передаём квалифицированные лиды от 2 900 ₽."
        canonicalPath="/partner/"
        jsonLd={[breadcrumbJsonLd, faqJsonLd]}
      />
      <Header variant="partner" partnerCtaLabel="Получать заявки" onPartnerCta={openForm} />

      <main>
        <PartnerHeroSection>
          <div className="max-w-[920px]">
            <h1 className="text-[40px] font-semibold leading-[1.01] tracking-[-0.045em] text-[#342d27] sm:text-[52px] md:text-[68px] dark:text-foreground">
              Продавайте больше домов и бань
            </h1>
            <p className="mt-6 max-w-[760px] text-[17px] leading-relaxed text-[#595653] md:text-[20px] dark:text-muted-foreground">
              Привлекаем покупателей на многоместа.рф. Оформляем ваш ассортимент и страницу компании, улучшаем изображения и передаём квалифицированные заявки.
            </p>
            <div className="mt-8 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
              <Button type="button" size="lg" onClick={openForm} className={ctaClassName}>
                Получать заявки
              </Button>
              <p className="max-w-[410px] text-[13px] leading-relaxed text-muted-foreground md:text-[14px]">
                Размещение без абонентской платы. Квалифицированный лид от 2 900 ₽.
              </p>
            </div>
          </div>

          {showcaseMaker && marketplaceProjects.length >= 2 && (
            <div className="mt-12 md:mt-16">
              <PartnerMarketplacePreview projects={marketplaceProjects} maker={showcaseMaker} />
            </div>
          )}

          <div className="mt-10 grid gap-6 md:mt-14 lg:grid-cols-[minmax(240px,0.9fr)_minmax(0,2.1fr)] lg:items-end lg:gap-14">
            <p className="max-w-[330px] text-[18px] font-medium leading-snug tracking-[-0.015em] text-[#342d27] md:text-[20px] dark:text-foreground">
              Покупатели выбирают проекты на платформе по всей России
            </p>
            <dl className="grid grid-cols-3 gap-4 md:gap-10">
              <div>
                <dd className="text-[25px] font-semibold tracking-[-0.025em] text-[#342d27] md:text-[34px] dark:text-foreground">{projects.length}</dd>
                <dt className="mt-1 text-[11px] leading-snug text-muted-foreground md:text-[13px]">проектов домов</dt>
              </div>
              <div>
                <dd className="text-[25px] font-semibold tracking-[-0.025em] text-[#342d27] md:text-[34px] dark:text-foreground">{manufacturerCount}</dd>
                <dt className="mt-1 text-[11px] leading-snug text-muted-foreground md:text-[13px]">производителей</dt>
              </div>
              <div>
                <dd className="text-[25px] font-semibold tracking-[-0.025em] text-[#342d27] md:text-[34px] dark:text-foreground">{geoLocationCount}</dd>
                <dt className="mt-1 text-[11px] leading-snug text-muted-foreground md:text-[13px]">городов и областей</dt>
              </div>
            </dl>
          </div>
        </PartnerHeroSection>

        {showcaseMaker && showcaseProjects.length > 0 && (
          <PartnerFeatureSection
            title="Ваш ассортимент и компания в одном месте"
            visual={<PartnerProfilePreview projects={showcaseProjects} maker={showcaseMaker} />}
            onApply={openForm}
            actionLabel="Оставить заявку"
          >
            <p>Создаём карточки домов и бань с фотографиями, планировками, ценами и комплектациями. На странице компании собираем ассортимент, сведения о производстве, выполненные объекты и отзывы.</p>
            <p>Покупатель видит, что вы предлагаете и кому доверяет заказ. При изменении цены или комплектации обновляем информацию на связанных страницах.</p>
          </PartnerFeatureSection>
        )}

        <PartnerFeatureSection
          title="Обращения, с которыми удобно работать"
          visual={<PartnerCrmPreview />}
          onApply={openForm}
          actionLabel="Получать заявки"
          reverse
        >
          <p>Передаём контакт покупателя, выбранный дом или баню, регион доставки и источник обращения. Менеджер видит запрос клиента и может начать с обсуждения комплектации и расчёта стоимости.</p>
          <p>До подключения согласуем географию и критерии квалифицированного лида. Дальнейшие переговоры и продажу ведёт ваша команда.</p>
        </PartnerFeatureSection>

        {showcaseMaker && businessProjects.length > 0 && (
          <PartnerFeatureSection
            title="Дома и бани для бизнес-заказчиков"
            visual={<PartnerBusinessPreview projects={businessProjects} maker={showcaseMaker} />}
            onApply={() => openFormWithInterest("Размещение в разделе «Бизнес»")}
            actionLabel="Получать лиды для бизнеса"
          >
            <p>Представляем ваши дома и бани предпринимателям, которые развивают глэмпинги, базы отдыха, банные комплексы и арендный бизнес.</p>
            <p>Помогаем показать предложение под их задачи: вместимость, комплектацию, сроки производства и возможность поставки нескольких объектов.</p>
          </PartnerFeatureSection>
        )}

        <PartnerFeatureSection
          title="Изображения, которые помогают продавать"
          visual={(
            <div>
              <BeforeAfterComparison
                beforeSrc={partnerRenderBefore}
                afterSrc={partnerRenderAfter}
                beforeAlt="Фотография построенного модульного дома до художественной визуализации"
                afterAlt="Художественный рендер модульного дома в хвойном лесу"
              />
              <p className="mt-3 text-[12px] leading-relaxed text-muted-foreground">Реальный пример преобразования фотографии построенного дома в художественный рендер.</p>
            </div>
          )}
          onApply={() => openFormWithInterest("Художественные рендеры")}
          actionLabel="Улучшить изображения"
          reverse
        >
          <p>Улучшаем подачу ваших фотографий и рендеров: свет, окружение и ракурсы. Помогаем показать дом или баню так, чтобы покупатель мог рассмотреть архитектуру, отделку и представить объект на своём участке.</p>
          <p>Готовим изображения для карточек, презентаций и рекламы в едином стиле. Сравните исходную фотографию и художественную визуализацию одного дома.</p>
        </PartnerFeatureSection>

        <section>
          <div className="mx-auto w-full max-w-[1400px] px-4 py-12 sm:px-8 md:py-16 lg:px-12 lg:py-20">
            <h2 className="max-w-[760px] text-[30px] font-semibold leading-[1.08] tracking-[-0.03em] text-[#342d27] sm:text-[36px] md:text-[44px] dark:text-foreground">
              Как начать получать заявки
            </h2>
            <ol className="mt-10 grid gap-9 md:mt-14 md:grid-cols-3 md:gap-12">
              {partnerSteps.map((step) => (
                <li key={step.num}>
                  <span className="text-[15px] font-semibold text-primary">{step.num}</span>
                  <h3 className="mt-4 text-[20px] font-semibold leading-snug text-[#342d27] md:text-[24px] dark:text-foreground">{step.title}</h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-[#595653] md:text-[16px] dark:text-muted-foreground">{step.desc}</p>
                </li>
              ))}
            </ol>
            <Button type="button" size="lg" onClick={openForm} className={`${ctaClassName} mt-10`}>
              Оставить заявку
            </Button>
          </div>
        </section>

        <section id="partner-faq" className="scroll-mt-24">
          <div className="mx-auto grid w-full max-w-[1400px] gap-8 px-4 py-12 sm:px-8 md:grid-cols-[0.72fr_1.28fr] md:gap-14 md:py-16 lg:px-12 lg:py-20">
            <h2 className="max-w-[470px] text-[30px] font-semibold leading-[1.08] tracking-[-0.03em] text-[#342d27] sm:text-[36px] md:text-[44px] dark:text-foreground">
              Часто задаваемые вопросы
            </h2>
            <FaqList items={partnerFaq} idPrefix="partner-faq" />
          </div>
        </section>

        <section>
          <div className="mx-auto flex w-full max-w-[980px] flex-col items-center px-4 py-14 text-center sm:px-8 md:py-20">
            <h2 className="max-w-[780px] text-[32px] font-semibold leading-[1.06] tracking-[-0.035em] text-[#342d27] sm:text-[40px] md:text-[52px] dark:text-foreground">
              Найдём покупателей для ваших домов и бань
            </h2>
            <p className="mt-5 max-w-[620px] text-[15px] leading-relaxed text-[#595653] md:text-[17px] dark:text-muted-foreground">
              Оставьте контакты компании. Мы изучим ассортимент, уточним географию доставки и обсудим подключение.
            </p>
            <Button type="button" size="lg" onClick={openForm} className={`${ctaClassName} mt-8`}>
              Оставить заявку
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PartnerLanding;
