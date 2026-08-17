import type { ReactNode } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Seo from "@/components/Seo";
import SiteBreadcrumbs, { siteBreadcrumbPageContainerClassName } from "@/components/SiteBreadcrumbs";
import type { JournalArticle } from "@/data/articles";
import { buildAssetUrl, buildCanonicalUrl } from "@/lib/seo";

export type ArticleTocItem = {
  id: string;
  label: string;
};

type ArticleLayoutProps = {
  article: JournalArticle;
  toc: ArticleTocItem[];
  children: ReactNode;
};

const ArticleContents = ({ items }: { items: ArticleTocItem[] }) => (
  <nav aria-label="Содержание статьи">
    <h2 className="text-[17px] font-semibold text-[#342d27] dark:text-foreground">В статье</h2>
    <ol className="mt-4 space-y-2.5">
      {items.map((item, index) => (
        <li key={item.id} className="flex gap-3 text-[14px] leading-[1.45] text-muted-foreground">
          <span className="w-5 shrink-0 tabular-nums text-[#342d27]/45 dark:text-muted-foreground">{index + 1}</span>
          <a className="transition-colors hover:text-primary" href={`#${item.id}`}>
            {item.label}
          </a>
        </li>
      ))}
    </ol>
  </nav>
);

const ArticleLayout = ({ article, toc, children }: ArticleLayoutProps) => {
  const seoTitle = article.seoTitle ?? article.title;
  const seoDescription = article.seoDescription ?? article.description;
  const coverImage = article.coverImage ?? article.image;
  const canonicalUrl = buildCanonicalUrl(article.path);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: seoDescription,
    image: buildAssetUrl(coverImage),
    mainEntityOfPage: canonicalUrl,
    inLanguage: "ru-RU",
    author: { "@type": "Organization", name: "Много места", url: buildCanonicalUrl("/") },
    publisher: { "@type": "Organization", name: "Много места", url: buildCanonicalUrl("/") },
  };

  const breadcrumbsJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: buildCanonicalUrl("/") },
      { "@type": "ListItem", position: 2, name: "Журнал", item: buildCanonicalUrl("/articles") },
      { "@type": "ListItem", position: 3, name: article.title, item: canonicalUrl },
    ],
  };

  return (
    <div className="min-h-screen bg-secondary font-sans">
      <Seo
        title={seoTitle}
        description={seoDescription}
        canonicalPath={article.path}
        image={coverImage}
        type="article"
        jsonLd={[articleJsonLd, breadcrumbsJsonLd]}
      />

      <main className="bg-background">
        <Header variant="home" />

        <div className={`${siteBreadcrumbPageContainerClassName} pb-14 sm:pb-20`}>
          <SiteBreadcrumbs
            items={[
              { label: "Главная", to: "/" },
              { label: "Журнал", to: "/articles" },
              { label: article.title },
            ]}
          />

          <article>
            <header className="max-w-[980px]">
              <p className="text-[13px] text-muted-foreground md:text-[14px]">
                {article.category} · {article.readTime} чтения
              </p>
              <h1 className="mt-4 text-[34px] font-semibold leading-[1.04] tracking-[-0.035em] text-[#342d27] dark:text-foreground sm:text-[42px] md:text-[56px]">
                {article.title}
              </h1>
              <p className="mt-5 max-w-[800px] text-[17px] leading-[1.6] text-[#342d27]/68 dark:text-muted-foreground md:text-[20px]">
                {seoDescription}
              </p>
            </header>

            <figure className="mt-8 overflow-hidden rounded-[3px] bg-[#f6f7fa] sm:mt-10">
              <img
                src={coverImage}
                alt="Модульный дом на участке"
                width={1280}
                height={960}
                loading="eager"
                decoding="async"
                className="aspect-[16/8.4] w-full object-cover object-center"
              />
            </figure>

            <div className="mt-10 grid items-start gap-12 lg:mt-14 lg:grid-cols-[minmax(0,820px)_minmax(220px,1fr)] lg:gap-20">
              <div className="min-w-0">
                <div className="mb-12 lg:hidden">
                  <ArticleContents items={toc} />
                </div>

                <div className="article-content">{children}</div>
              </div>

              <aside className="sticky top-8 hidden lg:block">
                <ArticleContents items={toc} />
              </aside>
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ArticleLayout;
