import { Navigate, useParams } from "react-router-dom";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Seo from "@/components/Seo";
import SiteBreadcrumbs, { siteBreadcrumbPageContainerClassName } from "@/components/SiteBreadcrumbs";
import { getLegalDocument, parseLegalDocument } from "@/data/legalDocuments";

const LegalDocument = () => {
  const { slug } = useParams();
  const document = getLegalDocument(slug);

  if (!document) {
    return <Navigate to="/legal/" replace />;
  }

  const parsed = parseLegalDocument(document.source);

  return (
    <div className="min-h-screen bg-secondary font-sans">
      <Seo
        title={`${document.title} — многоместа.рф`}
        description={document.seoDescription}
        canonicalPath={document.path}
      />

      <main className="bg-background">
        <Header variant="home" />
        <div className={`${siteBreadcrumbPageContainerClassName} pb-16 sm:pb-24`}>
          <SiteBreadcrumbs
            items={[
              { label: "Главная", to: "/" },
              { label: "Юридическая информация", to: "/legal/" },
              { label: document.navigationTitle },
            ]}
          />

          <header className="max-w-[980px]">
            <h1 className="text-[30px] font-semibold leading-[1.08] tracking-[-0.025em] text-[#342d27] dark:text-foreground md:text-[46px]">
              {parsed.title}
            </h1>
            <p className="mt-4 text-[16px] leading-relaxed text-[#342d27]/65 dark:text-muted-foreground md:text-[19px]">
              {parsed.subtitle}
            </p>
            <div className="mt-5 space-y-1 text-[13px] leading-relaxed text-muted-foreground md:text-[14px]">
              {parsed.metadata.map((line) => <p key={line}>{line}</p>)}
            </div>
          </header>

          <details className="mt-10 lg:hidden">
            <summary className="flex min-h-11 cursor-pointer items-center text-[15px] font-medium text-[#342d27] transition-colors hover:text-primary dark:text-foreground">
              Содержание
            </summary>
            <nav aria-label="Содержание документа" className="mt-2 space-y-1 pb-3">
              {parsed.sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="block min-h-11 py-3 text-[14px] leading-snug text-[#342d27]/70 transition-colors hover:text-primary focus-visible:rounded-[var(--radius)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 dark:text-muted-foreground"
                >
                  {section.title}
                </a>
              ))}
            </nav>
          </details>

          <div className="mt-10 grid items-start gap-14 lg:mt-14 lg:grid-cols-[240px_minmax(0,780px)] xl:gap-20">
            <nav aria-label="Содержание документа" className="sticky top-[88px] hidden max-h-[calc(100vh-112px)] overflow-y-auto pr-3 lg:block">
              <p className="text-[13px] font-medium text-[#342d27] dark:text-foreground">Содержание</p>
              <div className="mt-3 space-y-1">
                {parsed.sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="block py-2 text-[13px] leading-snug text-[#342d27]/58 transition-colors hover:text-primary focus-visible:rounded-[var(--radius)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 dark:text-muted-foreground"
                  >
                    {section.title}
                  </a>
                ))}
              </div>
            </nav>

            <article className="min-w-0 text-[15px] leading-[1.72] text-[#342d27]/78 dark:text-foreground/80 md:text-[16px]">
              {parsed.introduction.length > 0 && (
                <div className="space-y-4">
                  {parsed.introduction.map((paragraph, index) => <p key={`${index}-${paragraph}`}>{paragraph}</p>)}
                </div>
              )}

              <div className={parsed.introduction.length > 0 ? "mt-12 space-y-12 md:mt-14 md:space-y-14" : "space-y-12 md:space-y-14"}>
                {parsed.sections.map((section) => (
                  <section key={section.id} id={section.id} className="scroll-mt-[88px]">
                    <h2 className="text-[21px] font-semibold leading-snug tracking-[-0.01em] text-[#342d27] dark:text-foreground md:text-[26px]">
                      {section.title}
                    </h2>
                    <div className="mt-5 space-y-4">
                      {section.paragraphs.map((paragraph, index) => (
                        <p key={`${section.id}-${index}`} className="whitespace-pre-wrap">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </article>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LegalDocument;
