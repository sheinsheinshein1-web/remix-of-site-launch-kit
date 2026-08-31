import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Seo from "@/components/Seo";
import { CATALOG_PATH } from "@/lib/siteRoutes";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-secondary font-sans">
      <Seo
        title="Страница не найдена — многоместа.рф"
        description="Такой страницы нет. Перейдите в каталог проектов или вернитесь на главную страницу многоместа.рф."
        noIndex
      />

      <main className="bg-background">
        <Header variant="home" />

        <section className="mx-auto flex min-h-[calc(100svh-64px)] w-full max-w-[1400px] items-center px-4 pb-16 pt-[98px] sm:px-8 sm:pb-20 md:pt-[136px] lg:px-12">
          <div className="grid w-full gap-10 md:grid-cols-[minmax(0,0.9fr)_minmax(340px,1.1fr)] md:items-end md:gap-14 lg:gap-20">
            <p
              className="select-none text-[clamp(112px,22vw,300px)] font-semibold leading-[0.72] tracking-[-0.075em] text-secondary"
              aria-hidden="true"
            >
              404
            </p>

            <div className="max-w-[620px] md:pb-2 lg:pb-5">
              <h1 className="text-[36px] font-semibold leading-[1.04] tracking-[-0.035em] text-[#342d27] dark:text-foreground sm:text-[46px] lg:text-[62px]">
                Страница не найдена
              </h1>
              <p className="mt-5 max-w-[560px] text-[16px] leading-relaxed text-[#342d27]/65 dark:text-muted-foreground sm:text-[17px] lg:text-[18px]">
                Возможно, ссылка устарела или адрес введён с ошибкой. Продолжите поиск в каталоге или вернитесь на главную.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to={CATALOG_PATH}
                  className="inline-flex min-h-12 items-center justify-center rounded-[var(--radius)] bg-primary px-6 text-[15px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  Перейти в каталог
                </Link>
                <Link
                  to="/"
                  className="inline-flex min-h-12 items-center justify-center rounded-[var(--radius)] border border-border bg-background px-6 text-[15px] font-semibold text-foreground transition-colors hover:border-primary/50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                >
                  На главную
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
