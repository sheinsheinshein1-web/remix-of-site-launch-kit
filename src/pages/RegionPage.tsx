import { Link, Navigate, useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileTabBar from "@/components/MobileTabBar";
import ProjectCard from "@/components/ProjectCard";
import Seo from "@/components/Seo";
import { regionsBySlug } from "@/data/regions";
import { projects, makersById } from "@/data/projects";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const SITE_URL = "https://многоместа.рф";

const RegionPage = () => {
  const { slug = "" } = useParams<{ slug: string }>();
  const region = regionsBySlug[slug];

  if (!region) {
    return <Navigate to="/catalog" replace />;
  }

  const regionProjects = projects.filter((p) => p.city === region.cityValue);

  // Уникальные производители в регионе
  const makerIds = Array.from(new Set(regionProjects.map((p) => p.maker.id).filter(Boolean) as string[]));
  const regionMakers = makerIds.map((id) => makersById[id]).filter(Boolean);

  const canonicalPath = `/region/${region.slug}`;

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: SITE_URL + "/" },
      { "@type": "ListItem", position: 2, name: "Каталог", item: SITE_URL + "/catalog" },
      { "@type": "ListItem", position: 3, name: region.name, item: SITE_URL + canonicalPath },
    ],
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: region.faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: regionProjects.slice(0, 20).map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/project/${p.id}`,
      name: p.name,
    })),
  };

  return (
    <div className="min-h-screen bg-secondary font-sans pb-16 md:pb-0">
      <Seo
        title={region.title}
        description={region.description}
        canonicalPath={canonicalPath}
        jsonLd={[breadcrumbLd, faqLd, itemListLd]}
      />

      <div className="max-w-[1400px] mx-auto bg-background md:rounded-b-2xl">
        <Header />

        <div className="px-3 md:px-8 pt-[64px] md:pt-[100px] pb-6">
          {/* Breadcrumbs */}
          <nav aria-label="breadcrumb" className="text-[13px] text-muted-foreground mb-4 flex flex-wrap items-center gap-1.5">
            <Link to="/" className="hover:text-foreground transition-colors">Главная</Link>
            <span aria-hidden>/</span>
            <Link to="/catalog" className="hover:text-foreground transition-colors">Каталог</Link>
            <span aria-hidden>/</span>
            <span className="text-foreground">{region.name}</span>
          </nav>

          {/* H1 */}
          <h1 className="text-2xl md:text-4xl font-semibold text-foreground mb-4 leading-tight">
            {region.h1}
          </h1>

          {/* Intro text */}
          <div
            className="prose prose-sm md:prose-base max-w-3xl text-foreground/80 [&_p]:mb-3"
            dangerouslySetInnerHTML={{ __html: region.introHtml }}
          />
        </div>

        {/* Projects grid */}
        <div className="px-3 md:px-8 pb-6">
          <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
            Проекты {region.namePrepositional} — {regionProjects.length}
          </h2>
          {regionProjects.length === 0 ? (
            <div className="text-muted-foreground text-sm">Скоро добавим проекты для этого региона.</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {regionProjects.map((p) => (
                <ProjectCard key={p.id} projectId={p.id} />
              ))}
            </div>
          )}
        </div>

        {/* Manufacturers in the region */}
        {regionMakers.length > 0 && (
          <div className="px-3 md:px-8 pb-6">
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
              Производители {region.namePrepositional}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {regionMakers.map((m) => (
                <Link
                  key={m.id}
                  to={`/partner/${m.id}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-secondary hover:bg-muted transition-colors"
                >
                  {m.logo ? (
                    <img src={m.logo} alt={m.name} className="w-10 h-10 rounded-lg object-contain bg-background" loading="lazy" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center text-xs font-semibold text-foreground/70">
                      {m.initials}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-foreground truncate">{m.name}</div>
                    <div className="text-[12px] text-muted-foreground">Перейти к производителю</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* FAQ */}
        <div className="px-3 md:px-8 pb-10">
          <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
            Вопросы и ответы {region.namePrepositional}
          </h2>
          <Accordion type="single" collapsible className="max-w-3xl">
            {region.faq.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-foreground">{f.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

      <Footer />
      <MobileTabBar />
    </div>
  );
};

export default RegionPage;
