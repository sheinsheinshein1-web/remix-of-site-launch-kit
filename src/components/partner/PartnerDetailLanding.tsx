import { useState, type ReactNode } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import FaqList from "@/components/FaqList";
import Seo from "@/components/Seo";
import PartnerApplicationContent from "@/components/partner/PartnerApplicationContent";
import PartnerFeatureSection from "@/components/partner/PartnerFeatureSection";
import PartnerHeroSection from "@/components/partner/PartnerHeroSection";
import { Button } from "@/components/ui/button";
import type { PartnerService } from "@/data/partnerServices";
import { buildCanonicalUrl } from "@/lib/seo";

type PartnerDetailSection = {
  title: string;
  content: ReactNode;
  visual: ReactNode;
  reverse?: boolean;
};

type PartnerDetailLandingProps = {
  service: PartnerService;
  heroVisual: ReactNode;
  sections: PartnerDetailSection[];
  finalTitle: string;
  finalDescription: string;
  ctaLabel?: string;
};

const ctaClassName =
  "min-h-12 rounded-[3px] px-6 text-[15px] font-semibold focus-visible:ring-primary focus-visible:ring-offset-2";

const PartnerDetailLanding = ({
  service,
  heroVisual,
  sections,
  finalTitle,
  finalDescription,
  ctaLabel = "Разместить проекты",
}: PartnerDetailLandingProps) => {
  const [showForm, setShowForm] = useState(false);
  const [initialInterest, setInitialInterest] = useState(service.interest);

  const openForm = (interest = service.interest) => {
    setInitialInterest(interest);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const closeForm = () => {
    setShowForm(false);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const breadcrumbItems = [
    { label: "Главная", to: "/" },
    { label: "Производителям", to: "/partner/" },
    { label: service.breadcrumbLabel },
  ];

  const applicationBreadcrumbItems = [
    { label: "Главная", to: "/" },
    { label: "Производителям", to: "/partner/" },
    { label: service.breadcrumbLabel, to: service.path, onClick: closeForm },
    { label: "Заявка" },
  ];

  if (showForm) {
    return (
      <div className="min-h-screen bg-background font-sans">
        <Seo
          title={`Заявка: ${service.breadcrumbLabel.toLocaleLowerCase("ru")} — многоместа.рф`}
          description={`Оставьте заявку для производителя: ${service.breadcrumbLabel.toLocaleLowerCase("ru")} на многоместа.рф.`}
          canonicalPath={service.path}
          noIndex
        />
        <Header variant="partner" />
        <PartnerApplicationContent
          breadcrumbItems={applicationBreadcrumbItems}
          initialInterest={initialInterest}
          onBack={closeForm}
          visual={heroVisual}
        />
        <Footer />
      </div>
    );
  }

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: service.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: buildCanonicalUrl("/") },
      { "@type": "ListItem", position: 2, name: "Производителям", item: buildCanonicalUrl("/partner/") },
      { "@type": "ListItem", position: 3, name: service.breadcrumbLabel, item: buildCanonicalUrl(service.path) },
    ],
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <Seo
        title={service.seoTitle}
        description={service.seoDescription}
        canonicalPath={service.path}
        jsonLd={[breadcrumbJsonLd, faqJsonLd]}
      />
      <Header variant="partner" onPartnerCta={() => openForm()} />

      <main>
        <PartnerHeroSection>
          <div className="max-w-[960px]">
            <h1 className="text-[40px] font-semibold leading-[1.01] tracking-[-0.045em] text-[#342d27] sm:text-[52px] md:text-[68px] dark:text-foreground">
              {service.title}
            </h1>
            <p className="mt-6 max-w-[780px] text-[17px] leading-relaxed text-[#595653] md:text-[20px] dark:text-muted-foreground">
              {service.description}
            </p>
            <div className="mt-8 flex flex-col items-stretch sm:flex-row sm:items-center">
              <Button type="button" size="lg" onClick={() => openForm()} className={ctaClassName}>
                {ctaLabel}
              </Button>
            </div>
          </div>
          <div className="mt-12 md:mt-16">{heroVisual}</div>
        </PartnerHeroSection>

        {sections.map((section, index) => (
          <PartnerFeatureSection
            key={section.title}
            title={section.title}
            visual={section.visual}
            reverse={section.reverse ?? index % 2 === 1}
          >
            {section.content}
          </PartnerFeatureSection>
        ))}

        <section id={`${service.id}-faq`} className="scroll-mt-24">
          <div className="mx-auto grid w-full max-w-[1400px] gap-8 px-4 py-12 sm:px-8 md:grid-cols-[0.72fr_1.28fr] md:gap-14 md:py-16 lg:px-12 lg:py-20">
            <h2 className="max-w-[470px] text-[30px] font-semibold leading-[1.08] tracking-[-0.03em] text-[#342d27] sm:text-[36px] md:text-[44px] dark:text-foreground">
              Часто задаваемые вопросы
            </h2>
            <FaqList items={service.faq} idPrefix={`${service.id}-faq`} />
          </div>
        </section>

        <section>
          <div className="mx-auto flex w-full max-w-[980px] flex-col items-center px-4 py-14 text-center sm:px-8 md:py-20">
            <h2 className="max-w-[800px] text-[32px] font-semibold leading-[1.06] tracking-[-0.035em] text-[#342d27] sm:text-[40px] md:text-[52px] dark:text-foreground">
              {finalTitle}
            </h2>
            <p className="mt-5 max-w-[640px] text-[15px] leading-relaxed text-[#595653] md:text-[17px] dark:text-muted-foreground">
              {finalDescription}
            </p>
            <Button type="button" size="lg" onClick={() => openForm()} className={`${ctaClassName} mt-8`}>
              {ctaLabel}
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PartnerDetailLanding;
