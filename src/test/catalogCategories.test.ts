import { describe, expect, it } from "vitest";
import { catalogCategories, matchesCatalogCategory } from "@/data/catalogCategories";
import { catalogItems } from "@/data/projects";

describe("indexable catalog categories", () => {
  it("keeps slugs and paths unique", () => {
    expect(new Set(catalogCategories.map((category) => category.slug)).size).toBe(catalogCategories.length);
    expect(new Set(catalogCategories.map((category) => category.path)).size).toBe(catalogCategories.length);
  });

  it("has real projects in every landing", () => {
    for (const category of catalogCategories) {
      const matches = catalogItems.filter((item) => matchesCatalogCategory(item, category));
      expect(matches.length, category.path).toBeGreaterThan(0);
    }
  });

  it("does not produce categories with identical project sets", () => {
    const signatures = catalogCategories.map((category) => ({
      path: category.path,
      ids: catalogItems
        .filter((item) => matchesCatalogCategory(item, category))
        .map((item) => item.id)
        .sort((a, b) => a - b)
        .join(","),
    }));

    expect(new Set(signatures.map(({ ids }) => ids)).size).toBe(signatures.length);
  });
});
