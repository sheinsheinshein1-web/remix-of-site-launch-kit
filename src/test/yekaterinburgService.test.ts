import { describe, expect, it } from "vitest";
import { manufacturerRegistry } from "@/data/manufacturers";
import { projects } from "@/data/projects";
import { regionsBySlug } from "@/data/regions";
import {
  getGeoSelectionLabel,
  isProjectAvailableInGeo,
} from "@/lib/geoSelection";
import { interpolateRegionContent } from "@/lib/regionContent";
import { getProjectDetailViewModel } from "@/lib/projectViewModel";
import { UNKNOWN_REQUIRED_PROJECT_FACT, getProjectSourceFacts } from "@/data/projectSourceFacts";
import { getRegionPath } from "@/lib/siteRoutes";

describe("Yekaterinburg service contract", () => {
  const manufacturerIds = Object.values(manufacturerRegistry)
    .filter((manufacturer) => manufacturer.profile?.sourceAudit)
    .map((manufacturer) => manufacturer.id);
  const regionalProjects = projects.filter((project) => manufacturerIds.includes(project.manufacturerId));

  it("keeps the complete audited city slice connected", () => {
    expect(manufacturerIds).toHaveLength(16);
    expect(regionalProjects).toHaveLength(238);

    for (const project of regionalProjects) {
      expect(isProjectAvailableInGeo(project.city, "ekaterinburg", project.deliveryRegionSlugs)).toBe(true);
      expect(isProjectAvailableInGeo(project.city, "sverdlovskaya-oblast", project.deliveryRegionSlugs)).toBe(true);
      expect(manufacturerRegistry[project.manufacturerId]).toBeDefined();
    }
  });

  it("never leaks an unverified project value into the public view model", () => {
    const isKnown = (status: string) => status === "verified" || status === "derived";

    for (const project of regionalProjects) {
      const facts = getProjectSourceFacts(project.id)!;
      const viewModel = getProjectDetailViewModel(project.id)!;

      expect(facts, `${project.manufacturerId}/${project.name}: source facts`).toBeDefined();
      if (!isKnown(facts.area.status)) expect(viewModel.area.raw).toBe(UNKNOWN_REQUIRED_PROJECT_FACT);
      if (!isKnown(facts.price.status)) expect(viewModel.price.raw).toBe(UNKNOWN_REQUIRED_PROJECT_FACT);
      if (!isKnown(facts.productionTerm.status)) expect(viewModel.production.term).toBe(UNKNOWN_REQUIRED_PROJECT_FACT);
      if (!isKnown(facts.productionAddress.status)) expect(viewModel.production.address).toBe(UNKNOWN_REQUIRED_PROJECT_FACT);
      if (!isKnown(facts.insulation.status)) expect(viewModel.specifications.insulation).toBe(UNKNOWN_REQUIRED_PROJECT_FACT);
      if (!isKnown(facts.completion.status)) expect(viewModel.specifications.completion).toBe(UNKNOWN_REQUIRED_PROJECT_FACT);
      if (!isKnown(facts.delivery.status)) expect(viewModel.specifications.delivery).toBe(UNKNOWN_REQUIRED_PROJECT_FACT);
      if (!isKnown(facts.bedrooms.status)) expect(viewModel.rooms.beds).toBe(0);
      if (!isKnown(facts.bathrooms.status)) expect(viewModel.rooms.baths).toBe(0);
      if (!isKnown(facts.floors.status)) expect(viewModel.rooms.floors).toBe(0);
      expect(viewModel.facts.join(" ")).not.toMatch(/(?:^|\s)0\s/u);
    }
  });

  it("keeps city and area as distinct canonical destinations", () => {
    expect(getGeoSelectionLabel("ekaterinburg")).toBe("Екатеринбург");
    expect(getGeoSelectionLabel("sverdlovskaya-oblast")).toBe("Свердловская область");
    expect(getRegionPath("ekaterinburg")).toBe("/modulnye-doma/ekaterinburg/");
    expect(getRegionPath("sverdlovskaya-oblast")).toBe("/modulnye-doma/sverdlovskaya-oblast/");
    expect(regionsBySlug.ekaterinburg.technologyValue).toBeUndefined();
    expect(regionsBySlug["sverdlovskaya-oblast"].technologyValue).toBeUndefined();
  });

  it("builds regional copy from current data without stale promises", () => {
    const region = regionsBySlug.ekaterinburg;
    const rendered = interpolateRegionContent(region.introHtml, {
      projectCount: regionalProjects.length,
      manufacturerCount: manufacturerIds.length,
    });

    expect(rendered).toContain("238 проектов");
    expect(rendered).toContain("16 производителей");
    expect(rendered).not.toMatch(/\{(?:project|manufacturer)Count/u);
    expect(rendered).not.toMatch(/46 готовых проектов|Теплодина|Karkas\.haus|Урал-Хаус/u);
    expect(rendered).not.toMatch(/доставка по области обычно входит|каркас 200 мм минимум/u);
  });
});
