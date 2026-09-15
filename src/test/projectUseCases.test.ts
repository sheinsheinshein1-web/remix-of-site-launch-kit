import { describe, expect, it } from "vitest";
import { catalogItems, projects } from "@/data/projects";
import { BUSINESS_USE_CASE_OPTIONS, matchesProjectBusinessUseCases } from "@/lib/projectUseCases";

describe("business project filters", () => {
  it("keeps every supported business use case in one shared option list", () => {
    expect(BUSINESS_USE_CASE_OPTIONS.map(({ value }) => value)).toEqual([
      "rental",
      "glamping",
      "recreation-center",
      "hotel",
      "office",
      "cafe",
      "retail",
    ]);
  });

  it("matches at least one selected business scenario", () => {
    expect(matchesProjectBusinessUseCases(["hotel"], new Set(["hotel", "cafe"]))).toBe(true);
    expect(matchesProjectBusinessUseCases(["rental"], new Set(["hotel", "cafe"]))).toBe(false);
    expect(matchesProjectBusinessUseCases(undefined, new Set())).toBe(true);
  });

  it("keeps business use cases in the public catalog projection", () => {
    const projectsWithBusinessUseCases = projects.filter((project) => project.useCases?.length);
    const catalogItemsWithBusinessUseCases = catalogItems.filter((project) => project.useCases?.length);

    expect(projectsWithBusinessUseCases.length).toBeGreaterThan(0);
    expect(catalogItemsWithBusinessUseCases).toHaveLength(projectsWithBusinessUseCases.length);
    expect(catalogItemsWithBusinessUseCases.map(({ id, useCases }) => ({ id, useCases }))).toEqual(
      projectsWithBusinessUseCases.map(({ id, useCases }) => ({ id, useCases })),
    );
  });
});
