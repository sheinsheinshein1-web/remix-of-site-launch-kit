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
  PartnerWebsitePreview,
} from "@/components/partner/PartnerProductVisuals";
import Seo from "@/components/Seo";
import { Button } from "@/components/ui/button";
import {
  partnerFaq,
  partnerSteps,
} from "@/data/partnerProgram";
import { partnerServices } from "@/data/partnerServices";
import { makersById, projects } from "@/data/projects";
import { geoLocationCount } from "@/data/regions";
import { buildCanonicalUrl } from "@/lib/seo";

const showcaseMaker = makersById.platforma ?? Object.values(makersById)[0];
const showcaseProjects = projects.filter((project) => project.maker.id === showcaseMaker?.id).slice(0, 3);
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
    setInitialInterest("Бесплатное размещение");
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
          title="Заявка на бесплатное размещение — многоместа.рф"
          description="Оставьте заявку на бесплатное размещение проектов модульных домов на многоместа.рф."
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
        title="Размещение проектов модульных домов для производителей | многоместа.рф"
        description="Получайте трафик и обращения по проектам модульных домов без платы за размещение. Вознаграждение 5% начисляется только после состоявшейся сделки."
        canonicalPath="/partner/"
        jsonLd={[breadcrumbJsonLd, faqJsonLd]}
      />
      <Header variant="partner" onPartnerCta={() => openFormWithInterest("Бесплатное размещение")} />

      <main>
        <PartnerHeroSection>
          <div className="max-w-[920px]">
            <h1 className="text-[40px] font-semibold leading-[1.01] tracking-[-0.045em] text-[#342d27] sm:text-[52px] md:text-[68px] dark:text-foreground">
              Продавайте больше модульных домов
            </h1>
            <p className="mt-6 max-w-[760px] text-[17px] leading-relaxed text-[#595653] md:text-[20px] dark:text-muted-foreground">
              На платформе размещаем ваши проекты без платы за публикацию и оформляем страницу компании. Дополнительно вы получаете собственный сайт, трафик без ограничений и платите вознаграждение 5% только после состоявшейся сделки.
            </p>
            <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <Button type="button" size="lg" onClick={() => openFormWithInterest("Бесплатное размещение")} className={ctaClassName}>
                Разместить проекты
              </Button>
              <Button
                type="button"
                size="lg"
                variant="secondary"
                onClick={() => openFormWithInterest("Демонстрация платформы")}
                className={`${ctaClassName} border-0 bg-secondary text-foreground hover:bg-secondary hover:text-primary`}
              >
                Запросить демонстрацию
              </Button>
            </div>
          </div>

          {showcaseMaker && marketplaceProjects.length >= 2 && (
            <div className="mt-12 md:mt-16">
              <PartnerMarketplacePreview projects={marketplaceProjects} maker={showcaseMaker} />
            </div>
          )}

          <div className="mt-10 grid gap-6 md:mt-14 lg:grid-cols-[minmax(240px,0.9fr)_minmax(0,2.1fr)] lg:items-end lg:gap-14">
            <p className="max-w-[330px] text-[18px] font-medium leading-snug tracking-[-0.015em] text-[#342d27] md:text-[20px] dark:text-foreground">
              Проекты и производители модульных домов по всей России
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
            title="Проекты на платформе и страница компании"
            visual={<PartnerProfilePreview projects={showcaseProjects} maker={showcaseMaker} />}
            actionHref={partnerServices.freePlacement.path}
            actionLabel="Подробнее о размещении"
          >
            <p>Публикуем ассортимент на платформе: фотографии, планировки, площадь, цена, комплектация, срок изготовления и города доставки. Покупатель сравнивает вашу модель с другими и оставляет заявку по конкретному дому.</p>
            <p>Все дома собраны на странице компании с контактами и отзывами. Если цена изменилась, сообщите один раз, и мы обновим все страницы.</p>
          </PartnerFeatureSection>
        )}

        {showcaseMaker && showcaseProjects.length > 0 && (
          <PartnerFeatureSection
            title="Получайте больше клиентов с собственным сайтом"
            visual={<PartnerWebsitePreview projects={showcaseProjects} maker={showcaseMaker} />}
            actionHref={partnerServices.manufacturerWebsite.path}
            actionLabel="Подробнее о сайте"
            reverse
          >
            <p>Вместе с размещением вы дополнительно получаете полноценный сайт компании, который представляет проекты, помогает покупателям находить вас в интернете и превращает интерес к дому в заявку.</p>
            <p>Вам не нужно платить разработчикам и маркетинговым агентствам. Мы запускаем сайт и постоянно обновляем проекты, цены и географию доставки, а вы получаете ещё один источник клиентов.</p>
          </PartnerFeatureSection>
        )}

        <PartnerFeatureSection
          title="Получайте трафик без ограничений и платите только за результат"
          visual={<PartnerCrmPreview />}
          actionHref={partnerServices.salesCommission.path}
          actionLabel="Подробнее о работе за результат"
        >
          <p>Размещаем проекты бесплатно и показываем их покупателям во всех согласованных регионах доставки. Вы не платите за публикацию, просмотры или обращения.</p>
          <p>Вознаграждение 5% возникает только после того, как покупатель заключил с вами договор и внёс оплату. Каждую заявку передаём в вашу CRM вместе с выбранным проектом, регионом и источником обращения.</p>
        </PartnerFeatureSection>

        {showcaseMaker && businessProjects.length > 0 && (
          <PartnerFeatureSection
            title="Продавайте больше проектов для бизнеса"
            visual={<PartnerBusinessPreview projects={businessProjects} maker={showcaseMaker} />}
            actionHref={partnerServices.businessPlacement.path}
            actionLabel="Подробнее о разделе «Бизнес»"
            reverse
          >
            <p>Выходите на предпринимателей и инвесторов, которые выбирают дома для глэмпингов, баз отдыха, гостиниц и аренды. Отдельная витрина помогает представить проект как готовое решение для запуска бизнеса: с понятной вместимостью, комплектацией, сроком изготовления и условиями поставки.</p>
            <p>Вы получаете обращения по более крупным заказам, в которых покупателю может потребоваться сразу несколько домов. Каждый проект остаётся связан с вашей компанией, а заявка приходит в CRM с выбранной моделью и параметрами объекта.</p>
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
          actionHref={partnerServices.renderings.path}
          actionLabel="Подробнее о рендерах"
        >
          <p>Покупателю проще решиться на обращение, когда он может представить готовый дом на своём участке. Хорошая визуализация показывает архитектуру, материалы, остекление и террасу так, чтобы проект был понятен без дополнительных объяснений менеджера.</p>
          <p>Вы получаете готовый комплект изображений для карточек, сайта, презентаций и рекламы. Ваши проекты выглядят убедительно во всех каналах, помогают покупателю выбрать конкретную модель и перейти к предметному разговору о покупке.</p>
        </PartnerFeatureSection>

        <section>
          <div className="mx-auto w-full max-w-[1400px] px-4 py-12 sm:px-8 md:py-16 lg:px-12 lg:py-20">
            <h2 className="max-w-[760px] text-[30px] font-semibold leading-[1.08] tracking-[-0.03em] text-[#342d27] sm:text-[36px] md:text-[44px] dark:text-foreground">
              От заявки до первых обращений
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
              Начать размещение
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
              Разместим первые проекты и подготовим страницы
            </h2>
            <p className="mt-5 max-w-[620px] text-[15px] leading-relaxed text-[#595653] md:text-[17px] dark:text-muted-foreground">
              Оставьте контакты компании. Посмотрим ассортимент, уточним города доставки и покажем страницы до публикации.
            </p>
            <Button type="button" size="lg" onClick={openForm} className={`${ctaClassName} mt-8`}>
              Разместить проекты
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PartnerLanding;
