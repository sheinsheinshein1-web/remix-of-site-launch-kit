import { describe, expect, it } from "vitest";
import { getCatalogCategoryBySlug } from "@/data/catalogCategories";
import { resolveCatalogSeoState } from "@/lib/catalogSeo";

describe("resolveCatalogSeoState", () => {
  it("keeps the main catalog indexable", () => {
    const state = resolveCatalogSeoState(new URLSearchParams());
    expect(state.shouldNoIndex).toBe(false);
    expect(state.canonicalPath).toBe("/modulnye-doma/");
    expect(state.activeCategory).toBeUndefined();
  });

  it("keeps a clean category path indexable with a self canonical", () => {
    const category = getCatalogCategoryBySlug("50-80-m2");
    const state = resolveCatalogSeoState(new URLSearchParams(), category);
    expect(state.shouldNoIndex).toBe(false);
    expect(state.activeCategory?.title).toBe("Дома 50–80 м²");
    expect(state.canonicalPath).toBe("/modulnye-doma/50-80-m2/");
  });

  it("noindexes a legacy query filter and canonicals it to the clean category", () => {
    const state = resolveCatalogSeoState(new URLSearchParams("minArea=50&maxArea=80"));
    expect(state.shouldNoIndex).toBe(true);
    expect(state.activeCategory?.title).toBe("Дома 50–80 м²");
    expect(state.canonicalPath).toBe("/modulnye-doma/50-80-m2/");
  });

  it("noindexes the modular baths query filter", () => {
    const state = resolveCatalogSeoState(new URLSearchParams("type=bath"));
    expect(state.shouldNoIndex).toBe(true);
    expect(state.activeCategory?.title).toBe("Модульные бани");
    expect(state.canonicalPath).toBe("/modulnye-bani/");
  });

  it("noindexes extra filters on a clean category and preserves its canonical", () => {
    const category = getCatalogCategoryBySlug("s-terrasoy");
    const state = resolveCatalogSeoState(new URLSearchParams("beds=2"), category);
    expect(state.shouldNoIndex).toBe(true);
    expect(state.activeCategory?.title).toBe("Дома с террасой");
    expect(state.canonicalPath).toBe("/modulnye-doma/s-terrasoy/");
  });

  it("noindexes arbitrary searches and canonicals them to the main catalog", () => {
    const state = resolveCatalogSeoState(new URLSearchParams("q=дом 100 м² с гаражом недорого"));
    expect(state.shouldNoIndex).toBe(true);
    expect(state.activeCategory).toBeUndefined();
    expect(state.canonicalPath).toBe("/modulnye-doma/");
  });

  it("noindexes the retired frame-house filter", () => {
    const state = resolveCatalogSeoState(new URLSearchParams("tech=Каркасный"));
    expect(state.shouldNoIndex).toBe(true);
    expect(state.activeCategory).toBeUndefined();
    expect(state.canonicalPath).toBe("/modulnye-doma/");
  });
});
