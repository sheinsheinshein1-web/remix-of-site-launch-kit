import { useEffect } from "react";
import { ChevronRight, Star } from "lucide-react";
import { Link, Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "@/components/Header";
import ManufacturerName from "@/components/ManufacturerName";
import SiteBreadcrumbs, { siteBreadcrumbPageContainerClassName } from "@/components/SiteBreadcrumbs";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import Catalog from "@/pages/Catalog";
import { regionsBySlug } from "@/data/regions";
import { projects, makersById } from "@/data/projects";
import { compareProjectTechnologyPriority } from "@/lib/projectPriority";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { buildSiteUrl } from "@/lib/seo";
import { getManufacturerRatingSummary } from "@/data/manufacturerRatings";
import { getCityDisplayName } from "@/lib/cityDisplay";
import { isProjectAvailableInGeo } from "@/lib/geoSelection";
import {
  CATALOG_PATH,
  MANUFACTURERS_PATH,
  REGIONS_PATH,
  getManufacturerPath,
  getProjectPath,
  getRegionPath,
} from "@/lib/siteRoutes";

const MAKERS_PREVIEW_LIMIT = 6;

const extractParagraphs = (html: string) => html.match(/<p>[\s\S]*?<\/p>/g) ?? [];

const RegionPage = () => {
  const { slug = "" } = useParams<{ slug: string }>();
  const region = regionsBySlug[slug];
  const location = useLocation();
  const navigate = useNavigate();
  const canonicalPath = region ? getRegionPath(region.slug) : "";

  useEffect(() => {
    if (!region || location.pathname === canonicalPath) return;
    navigate(`${canonicalPath}${location.search}${location.hash}`, { replace: true });
  }, [canonicalPath, location.hash, location.pathname, location.search, navigate, region]);

  if (!region) {
    return <Navigate to={CATALOG_PATH} replace />;
  }

  const baseRegion = region.baseRegionSlug ? regionsBySlug[region.baseRegionSlug] : region;
  const isDerivedRegion = Boolean(region.deliveryCity || region.deliveryArea);
  const regionProjects = projects
    .filter((project) => (
      isProjectAvailableInGeo(project.city, region.slug, project.deliveryRegionSlugs)
      && (!region.technologyValue || project.technology === region.technologyValue)
    ))
    .sort(compareProjectTechnologyPriority);

  const makerIds = Array.from(new Set(regionProjects.map((project) => project.maker.id).filter(Boolean) as string[]));
  const regionMakers = makerIds
    .map((id) => makersById[id])
    .filter(Boolean)
    .map((maker) => ({
      ...maker,
      projectsCount: regionProjects.filter((project) => project.maker.id === maker.id).length,
      reviewSummary: getManufacturerRatingSummary(maker.id),
    }))
    .sort((a, b) => {
      if (a.reviewSummary.hasReviews !== b.reviewSummary.hasReviews) {
        return Number(b.reviewSummary.hasReviews) - Number(a.reviewSummary.hasReviews);
      }
      if (a.reviewSummary.rating !== b.reviewSummary.rating) {
        return b.reviewSummary.rating - a.reviewSummary.rating;
      }
      if (a.reviewSummary.totalCount !== b.reviewSummary.totalCount) {
        return b.reviewSummary.totalCount - a.reviewSummary.totalCount;
      }
      return b.projectsCount - a.projectsCount || a.name.localeCompare(b.name, "ru");
    });

  const previewMakers = regionMakers.slice(0, MAKERS_PREVIEW_LIMIT);
  const manufacturerParams = new URLSearchParams({ region: region.cityValue });
  if (region.technologyValue) manufacturerParams.set("tech", region.technologyValue);
  const manufacturersHref = `${MANUFACTURERS_PATH}?${manufacturerParams.toString()}`;
  const introParagraphs = extractParagraphs(region.introHtml);
  const shortIntroHtml = introParagraphs[0] ?? region.description;
  const seoTextHtml = introParagraphs.slice(1).join("");

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: buildSiteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Регионы", item: buildSiteUrl(REGIONS_PATH) },
      ...(isDerivedRegion && baseRegion
        ? [{ "@type": "ListItem", position: 3, name: baseRegion.name, item: buildSiteUrl(getRegionPath(baseRegion.slug)) }]
        : []),
      { "@type": "ListItem", position: isDerivedRegion ? 4 : 3, name: region.name, item: buildSiteUrl(canonicalPath) },
    ],
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: region.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: regionProjects.map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: buildSiteUrl(getProjectPath(project)),
      name: project.name,
    })),
  };

  return (
    <div className="min-h-screen bg-secondary font-sans">
      <Seo
        title={region.title}
        description={region.description}
        canonicalPath={canonicalPath}
        jsonLd={[breadcrumbLd, faqLd, itemListLd]}
      />

      <main className="bg-background">
        <Header variant="home" />

        <div className={`${siteBreadcrumbPageContainerClassName} pb-16 sm:pb-20`}>
          <SiteBreadcrumbs
            items={[
              { label: "Главная", to: "/" },
              { label: "Регионы", to: REGIONS_PATH },
              ...(isDerivedRegion && baseRegion ? [{ label: baseRegion.name, to: getRegionPath(baseRegion.slug) }] : []),
              { label: region.name },
            ]}
          />

          <section className="max-w-[900px]" aria-labelledby="region-heading">
            <h1 id="region-heading" className="text-[30px] font-semibold leading-[1.08] tracking-[-0.025em] text-[#342d27] md:text-[46px] dark:text-foreground">
              {region.h1}
            </h1>
            <div
              className="mt-5 text-[15px] leading-[1.72] text-[#595653] md:mt-6 md:text-[17px] dark:text-muted-foreground [&_p]:m-0"
              dangerouslySetInnerHTML={{ __html: shortIntroHtml }}
            />
          </section>

          <section className="mt-10 md:mt-14" aria-label={`Каталог проектов ${region.namePrepositional}`}>
            <Catalog
              embedded
              lockedRegion={region.cityValue}
              lockedRegionLabel={region.catalogRegionLabel}
              lockedRegionPrepositional={region.deliveryCity ? region.namePrepositional : undefined}
              lockedTechnology={region.technologyValue}
            />
          </section>

          {regionMakers.length > 0 && (
            <section className="mt-4 md:mt-8" aria-labelledby="region-makers-heading">
              <h2 id="region-makers-heading" className="text-[26px] font-semibold tracking-[-0.025em] md:text-[32px]">
                <Link
                  to={manufacturersHref}
                  className="group inline-flex min-h-11 items-center gap-2 text-[#342d27] transition-colors hover:text-primary focus-visible:rounded-[var(--radius)] focus-visible:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 dark:text-foreground"
                >
                  <span>Все производители {region.namePrepositional}</span>
                  <ChevronRight className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none md:h-6 md:w-6" strokeWidth={1.8} aria-hidden />
                </Link>
              </h2>
              <div className="mt-6 grid sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-3 lg:gap-x-10">
                {previewMakers.map((maker) => (
                  <Link
                    key={maker.id}
                    to={getManufacturerPath(maker.id)}
                    className="group -mx-3 flex min-h-[76px] items-center gap-3 rounded-[var(--radius)] px-3 py-3 transition-colors duration-200 hover:bg-secondary focus-visible:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 md:min-h-[80px]"
                    aria-label={`${maker.name}: ${maker.reviewSummary.rating.toFixed(1)} из 5, ${maker.reviewSummary.hasReviews ? maker.reviewSummary.reviewsLabel : "отзывов пока нет"}`}
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-[var(--radius)] border border-border bg-white text-[10px] font-semibold uppercase tracking-[0.08em] text-[#342d27]">
                      {maker.logo ? <img src={maker.logo} alt="" width={40} height={40} className="h-full w-full object-contain p-1.5" loading="lazy" decoding="async" /> : maker.initials}
                    </span>
                    <span className="min-w-0 flex-1">
                      <ManufacturerName
                        makerId={maker.id}
                        name={maker.name}
                        className="w-full"
                        nameClassName="text-[15px] font-medium leading-tight text-[#342d27] transition-colors duration-200 group-hover:text-primary md:text-[16px] dark:text-foreground"
                      />
                      <span className="mt-1 block text-[13px] text-muted-foreground md:text-[14px]">{getCityDisplayName(maker.city)}</span>
                    </span>
                    <span className="shrink-0 text-right">
                      <span className="flex items-center justify-end gap-1 text-[14px] font-medium tabular-nums text-[#342d27] md:text-[15px] dark:text-foreground">
                        <Star className={`h-3 w-3 ${maker.reviewSummary.hasReviews ? "fill-primary text-primary" : "text-muted-foreground/55"}`} strokeWidth={1.6} aria-hidden />
                        {maker.reviewSummary.rating.toFixed(1).replace(".", ",")}
                      </span>
                      <span className="mt-1 block text-[12px] text-muted-foreground md:text-[13px]">
                        {maker.reviewSummary.hasReviews ? maker.reviewSummary.reviewsLabel : "Нет отзывов"}
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section className="mt-16 max-w-[900px] md:mt-24" aria-labelledby="region-faq-heading">
            <h2 id="region-faq-heading" className="text-[26px] font-semibold tracking-[-0.025em] text-[#342d27] md:text-[32px] dark:text-foreground">
              Часто задаваемые вопросы
            </h2>
            <Accordion type="single" collapsible className="mt-6">
              {region.faq.map((item, index) => (
                <AccordionItem key={item.question} value={`faq-${index}`} className="border-b border-[#dfe5f5]">
                  <AccordionTrigger className="min-h-[68px] py-4 text-left text-[15px] font-medium text-[#342d27] transition-colors hover:text-primary hover:no-underline md:text-[16px] dark:text-foreground">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="max-w-[760px] pb-5 text-[14px] leading-relaxed text-[#595653] md:text-[15px] dark:text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          {seoTextHtml && (
            <section className="mt-16 max-w-[900px] md:mt-24" aria-labelledby="region-seo-heading">
              <h2 id="region-seo-heading" className="text-[26px] font-semibold tracking-[-0.025em] text-[#342d27] md:text-[32px] dark:text-foreground">
                О строительстве домов {region.namePrepositional}
              </h2>
              <div
                className="mt-6 space-y-4 text-[15px] leading-[1.72] text-[#595653] md:text-[17px] dark:text-muted-foreground [&_p]:m-0"
                dangerouslySetInnerHTML={{ __html: seoTextHtml }}
              />
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RegionPage;
