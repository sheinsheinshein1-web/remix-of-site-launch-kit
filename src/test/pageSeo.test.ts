import { describe, expect, it } from "vitest";
import { projects } from "@/data/projects";
import {
  buildCatalogSeo,
  buildHomeSeo,
  buildManufacturerSeo,
  buildProjectSeo,
  buildRegionSeo,
  getProjectTechnologyLabel,
} from "@/lib/pageSeo";

describe("SEO metadata templates", () => {
  it("keeps the homepage aligned with the main commercial query", () => {
    const metadata = buildHomeSeo();

    expect(metadata.title).toContain("Модульные дома");
    expect(metadata.title).toContain("цены");
    expect(metadata.description).toContain("Каталог модульных домов");
  });

  it("creates category metadata from the curated category content", () => {
    const metadata = buildCatalogSeo({
      categoryTitle: "Модульные бани",
      categoryCaption: "Готовые решения с парной",
    });

    expect(metadata.title).toContain("Модульные бани");
    expect(metadata.description).toContain("готовые решения с парной");
    expect(metadata.description.length).toBeLessThanOrEqual(160);
  });

  it("keeps every public project title unique and metadata within the template limits", () => {
    const metadata = projects.map(buildProjectSeo);
    const titles = metadata.map((item) => item.title);

    expect(new Set(titles).size).toBe(titles.length);
    for (const item of metadata) {
      expect(item.title.length).toBeLessThanOrEqual(65);
      expect(item.description.length).toBeLessThanOrEqual(160);
      expect(item.description).not.toContain("…");
    }
  });

  it("does not duplicate the starting-price prefix", () => {
    const project = projects.find((item) => item.price.startsWith("от "));
    expect(project).toBeDefined();

    const metadata = buildProjectSeo(project!);
    expect(metadata.title).not.toContain("от от");
    expect(metadata.description).not.toContain("от от");
  });

  it("adds live inventory counts to regional metadata", () => {
    const metadata = buildRegionSeo({
      h1: "Модульные дома в Екатеринбурге",
      namePrepositional: "в Екатеринбурге",
      fallbackDescription: "Проекты модульных домов в Екатеринбурге.",
      projectCount: 23,
      manufacturerCount: 6,
    });

    expect(metadata.title).toContain("23 проекта");
    expect(metadata.title).not.toContain("…");
    expect(metadata.description).toContain("6 производителей");
  });

  it("adds the available project count to manufacturer titles", () => {
    const metadata = buildManufacturerSeo({
      name: "Qubdom",
      city: "Екатеринбург",
      projectCount: 5,
      hasReviews: true,
    });

    expect(metadata.title).toContain("5 проектов");
    expect(metadata.title.length).toBeLessThanOrEqual(65);
    expect(metadata.description).toContain("5 проектов");
  });

  it("uses one customer-facing technology vocabulary", () => {
    expect(getProjectTechnologyLabel("Модульный дом")).toBe("Модульная");
    expect(getProjectTechnologyLabel("Модульная технология")).toBe("Модульная");
    expect(getProjectTechnologyLabel("Каркасный")).toBe("Каркасная");
    expect(getProjectTechnologyLabel("Каркасная технология")).toBe("Каркасная");
    expect(getProjectTechnologyLabel("Каркасно-модульный")).toBe("Каркасно-модульная");
  });
});
