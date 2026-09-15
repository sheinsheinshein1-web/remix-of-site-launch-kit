import { describe, expect, it } from "vitest";
import { projects } from "@/data/projects";
import { getProjectPath } from "@/lib/siteRoutes";
import {
  getProject,
  getProjectCardViewModel,
  getProjectDetailViewModel,
} from "@/lib/projectViewModel";

describe("project view models", () => {
  it("resolves every public project through the canonical read layer", () => {
    for (const project of projects) {
      expect(getProject(project.id)).toBe(project);
      expect(getProjectCardViewModel(project.id)?.href).toBe(getProjectPath(project));
      expect(getProjectDetailViewModel(project.id)?.canonicalPath).toBe(getProjectPath(project));
    }
  });

  it("joins project and manufacturer data once", () => {
    const source = projects[0];
    const card = getProjectCardViewModel(source.id);
    const detail = getProjectDetailViewModel(source.id);

    expect(card).not.toBeNull();
    expect(detail).not.toBeNull();
    expect(card?.manufacturer.id).toBe(source.manufacturerId);
    expect(detail?.manufacturer.id).toBe(source.manufacturerId);
    expect(card?.price).toEqual(detail?.price);
    expect(card?.facts).toEqual(detail?.facts);
  });

  it("keeps catalog geography separate from the manufacturer's production address", () => {
    const platformaProject = projects.find((project) => project.manufacturerId === "platforma");
    expect(platformaProject).toBeDefined();

    const detail = getProjectDetailViewModel(platformaProject!.id);

    expect(platformaProject?.city).toBe("Екатеринбург");
    expect(detail?.production.term).toBe(platformaProject?.term);
    expect(detail?.production.address).toContain("Березовский");
  });

  it("keeps the sourced Bear House 45 production term", () => {
    const bearHouse45 = projects.find(
      (project) => project.sourceUrl === "https://platforma-modul.ru/bear-house-45",
    );

    expect(bearHouse45?.term).toBe("60 д.");
    expect(getProjectDetailViewModel(bearHouse45!.id)?.production.term).toBe("60 д.");
  });

  it("uses official Platforma facts without changing the legacy canonical URL", () => {
    const wideHouse = projects.find((project) => project.id === 32)!;
    const detail = getProjectDetailViewModel(wideHouse.id)!;

    expect(wideHouse.area).toBe("56,8 м²");
    expect(detail.area.raw).toBe("56,8 м²");
    expect(detail.production.term).toBe("60 д.");
    expect(detail.specifications.insulation).toBe("Стены 150 мм, кровля 200 мм");
    expect(detail.specifications.style).toBeNull();
    expect(detail.rooms).toMatchObject({ beds: 2, baths: 1, floors: 1 });
    expect(detail.canonicalPath).toContain("wide-house-46-m2-32");
  });

  it("shows the required fallback when Platforma did not publish a fact", () => {
    const bathhouse = getProjectDetailViewModel(437)!;

    expect(bathhouse.production.term).toBe("Уточнить у производителя");
    expect(bathhouse.specifications.insulation).toBe("Уточнить у производителя");
    expect(bathhouse.specifications.dimensions).toBe("6,5 × 2,66 × 3 м");
    expect(bathhouse.rooms).toMatchObject({ beds: 0, baths: 0, floors: 0 });
  });

  it("does not expose manufacturer-wide placeholders as Bygge project facts", () => {
    const tundra = getProjectDetailViewModel(41)!;
    const complexTundra = getProjectDetailViewModel(449)!;

    expect(tundra.price.raw).toBe("4 283 000 ₽");
    expect(tundra.production.term).toBe("35 д.");
    expect(tundra.specifications.insulation).toBe("Пол 200 мм, стены 150 мм, потолок 150 мм");
    expect(complexTundra.price.raw).toBe("Уточнить у производителя");
    expect(complexTundra.specifications.insulation).toBe("Уточнить у производителя");
  });

  it("keeps the complete primary facts visible for Elen", () => {
    const elen = getProjectDetailViewModel(441)!;

    expect(elen.rooms).toMatchObject({ count: 3, beds: 0, baths: 1, floors: 1 });
    expect(elen.production.address).toBe("г. Екатеринбург");
    expect(elen.project.gallery).toHaveLength(4);
    expect(elen.project.gallery.some((item) => item.type === "plan")).toBe(true);
  });

  it("returns a truthful empty result for an unknown or unpublished project", () => {
    expect(getProjectCardViewModel(Number.MAX_SAFE_INTEGER)).toBeNull();
    expect(getProjectDetailViewModel(Number.MAX_SAFE_INTEGER)).toBeNull();
  });
});
