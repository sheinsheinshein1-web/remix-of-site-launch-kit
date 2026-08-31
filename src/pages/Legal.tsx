import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Seo from "@/components/Seo";
import SiteBreadcrumbs, { siteBreadcrumbPageContainerClassName } from "@/components/SiteBreadcrumbs";
import { legalDocuments } from "@/data/legalDocuments";

const Legal = () => (
  <div className="min-h-screen bg-secondary font-sans">
    <Seo
      title="Юридическая информация — многоместа.рф"
      description="Правила размещения, пользовательское соглашение, политика обработки персональных данных и информация о cookie платформы многоместа.рф."
      canonicalPath="/legal/"
    />

    <main className="bg-background">
      <Header variant="home" />
      <div className={`${siteBreadcrumbPageContainerClassName} pb-16 sm:pb-24`}>
        <SiteBreadcrumbs items={[{ label: "Главная", to: "/" }, { label: "Юридическая информация" }]} />

        <div className="max-w-[760px]">
          <h1 className="text-[30px] font-semibold leading-[1.08] tracking-[-0.025em] text-[#342d27] dark:text-foreground md:text-[46px]">
            Юридическая информация
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-[#342d27]/65 dark:text-muted-foreground md:text-[17px]">
            Документы, регулирующие использование платформы, размещение справочной информации, обработку персональных данных и применение cookie.
          </p>
        </div>

        <nav aria-label="Юридические документы" className="mt-10 max-w-[920px] space-y-8 md:mt-14 md:space-y-10">
          {legalDocuments.map((document) => (
            <Link
              key={document.slug}
              to={document.path}
              className="group grid min-h-11 gap-2 rounded-[var(--radius)] text-[#342d27] transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 dark:text-foreground md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:gap-8"
            >
              <span>
                <span className="block text-[19px] font-medium leading-snug md:text-[24px]">
                  {document.title}
                </span>
                <span className="mt-2 block max-w-[700px] text-[14px] leading-relaxed text-[#342d27]/60 group-hover:text-primary/75 dark:text-muted-foreground md:text-[16px]">
                  {document.subtitle}
                </span>
              </span>
              <span className="hidden h-11 w-11 items-center justify-center md:inline-flex" aria-hidden>
                <ChevronRight className="h-5 w-5" strokeWidth={1.6} />
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </main>

    <Footer />
  </div>
);

export default Legal;
