import { describe, expect, it } from "vitest";
import { getJournalArticle, homeArticles } from "@/data/articles";

describe("journal article routes", () => {
  it("maps every canonical path to the slug handled by the router", () => {
    for (const article of homeArticles) {
      const pathSlug = article.path.split("/").filter(Boolean).at(-1);
      expect(pathSlug).toBe(article.slug);
      expect(getJournalArticle(pathSlug ?? "")).toEqual(article);
    }
  });

  it("keeps canonical paths and SEO titles unique", () => {
    expect(new Set(homeArticles.map((article) => article.path)).size).toBe(homeArticles.length);
    expect(new Set(homeArticles.map((article) => article.seoTitle)).size).toBe(homeArticles.length);
  });
});
