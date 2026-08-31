import { describe, expect, it } from "vitest";
import { allCategoryLinks } from "@/data/categoryLinks";
import { resolveCatalogSeoState } from "@/lib/catalogSeo";

describe("resolveCatalogSeoState", () => {
  it("keeps the main catalog indexable", () => {
    const state = resolveCatalogSeoState(new URLSearchParams(), allCategoryLinks);
    expect(state.shouldNoIndex).toBe(false);
    expect(state.canonicalPath).toBe("/modulnye-doma/");
    expect(state.activeCategory).toBeUndefined();
  });

  it("keeps an exact curated category indexable", () => {
    const state = resolveCatalogSeoState(new URLSearchParams("minArea=50&maxArea=80"), allCategoryLinks);
    expect(state.shouldNoIndex).toBe(false);
    expect(state.activeCategory?.title).toBe("Дома 50–80 м²");
    expect(state.canonicalPath).toBe("/modulnye-doma/?minArea=50&maxArea=80");
  });

  it("keeps the modular baths catalog indexable", () => {
    const state = resolveCatalogSeoState(new URLSearchParams("type=bath"), allCategoryLinks);
    expect(state.shouldNoIndex).toBe(false);
    expect(state.activeCategory?.title).toBe("Модульные бани");
    expect(state.canonicalPath).toBe("/modulnye-doma/?type=bath");
  });

  it("noindexes extra filters and canonicals them to the matching category", () => {
    const state = resolveCatalogSeoState(new URLSearchParams("q=терраса&beds=2"), allCategoryLinks);
    expect(state.shouldNoIndex).toBe(true);
    expect(state.activeCategory?.title).toBe("Дома с террасой");
    expect(state.canonicalPath).toBe("/modulnye-doma/?q=терраса");
  });

  it("noindexes arbitrary searches and canonicals them to the main catalog", () => {
    const state = resolveCatalogSeoState(new URLSearchParams("q=дом 100 м² с гаражом недорого"), allCategoryLinks);
    expect(state.shouldNoIndex).toBe(true);
    expect(state.activeCategory).toBeUndefined();
    expect(state.canonicalPath).toBe("/modulnye-doma/");
  });

  it("noindexes the retired frame-house filter", () => {
    const state = resolveCatalogSeoState(new URLSearchParams("tech=Каркасный"), allCategoryLinks);
    expect(state.shouldNoIndex).toBe(true);
    expect(state.activeCategory).toBeUndefined();
    expect(state.canonicalPath).toBe("/modulnye-doma/");
  });
});
