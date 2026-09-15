import { describe, expect, it } from "vitest";
import type { Project } from "@/data/projects";
import { matchesProjectFilters } from "@/lib/projectFilters";

const project = (overrides: Partial<Project> = {}) => ({
  productType: "house" as const,
  price: "3 000 000 ₽",
  area: "60 м²",
  beds: 2,
  baths: 1,
  floors: 1,
  term: "30 д.",
  technology: "Модульный дом",
  completion: "Под ключ",
  ...overrides,
}) as Project;

describe("project filters", () => {
  it("combines technology and completion with AND semantics", () => {
    const filters = {
      technologies: new Set(["Модульный дом"]),
      completions: new Set(["Под ключ"]),
    };

    expect(matchesProjectFilters(project(), filters)).toBe(true);
    expect(matchesProjectFilters(project({ completion: "Без отделки" }), filters)).toBe(false);
    expect(matchesProjectFilters(project({ technology: "СИП-Префаб" }), filters)).toBe(false);
  });

  it("excludes unknown prices only when a price filter is explicit", () => {
    const unknown = project({ price: "по запросу" });
    expect(matchesProjectFilters(unknown, { price: { max: 2_000_000 } })).toBe(true);
    expect(matchesProjectFilters(unknown, { price: { max: 2_000_000, excludeUnknown: true } })).toBe(false);
  });

  it("uses normalized time units for move-in filters", () => {
    const quick = { moveIn: new Set(["до 2 недель"]) };
    expect(matchesProjectFilters(project({ term: "10 д." }), quick)).toBe(true);
    expect(matchesProjectFilters(project({ term: "от 10 недель" }), quick)).toBe(false);
    expect(matchesProjectFilters(project({ term: "2 мес." }), quick)).toBe(false);
  });

  it("keeps house-bath out of the bath-only filter", () => {
    const combined = project({ productType: "house-bath" });
    expect(matchesProjectFilters(combined, { objectType: "house" })).toBe(true);
    expect(matchesProjectFilters(combined, { objectType: "bath" })).toBe(false);
  });
});
