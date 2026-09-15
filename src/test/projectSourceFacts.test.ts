import { describe, expect, it } from "vitest";
import {
  getProjectSourceFacts,
  projectSourceFactsById,
  resolveOptionalProjectFact,
  resolveRequiredProjectFact,
  UNKNOWN_REQUIRED_PROJECT_FACT,
} from "@/data/projectSourceFacts";
import { manufacturerRegistry } from "@/data/manufacturers";
import { projects } from "@/data/projects";

describe("sourced project facts", () => {
  const normalizeSourceUrl = (value: string) => value.replace(/\/+$/u, "");
  const platformaProjects = projects.filter((project) => project.manufacturerId === "platforma");
  const byggeProjects = projects.filter((project) => project.manufacturerId === "bygge");
  const yekaterinburgManufacturerIds = new Set(
    Object.values(manufacturerRegistry)
      .filter((manufacturer) => manufacturer.profile?.sourceAudit)
      .map((manufacturer) => manufacturer.id),
  );
  const yekaterinburgProjects = projects.filter((project) => (
    yekaterinburgManufacturerIds.has(project.manufacturerId)
  ));

  it("covers every project from all sixteen Yekaterinburg manufacturers", () => {
    expect(yekaterinburgManufacturerIds.size).toBe(16);
    expect(yekaterinburgProjects).toHaveLength(238);

    for (const project of yekaterinburgProjects) {
      const facts = getProjectSourceFacts(project.id);
      expect(facts, `${project.manufacturerId}/${project.name}`).toBeDefined();
      expect(normalizeSourceUrl(facts!.area.sourceUrl)).toBe(normalizeSourceUrl(project.sourceUrl!));
      expect(normalizeSourceUrl(facts!.price.sourceUrl)).toBe(normalizeSourceUrl(project.sourceUrl!));
      expect(normalizeSourceUrl(facts!.productionTerm.sourceUrl)).toBe(normalizeSourceUrl(project.sourceUrl!));
      expect(normalizeSourceUrl(facts!.technology.sourceUrl)).toBe(normalizeSourceUrl(project.sourceUrl!));
      expect(normalizeSourceUrl(facts!.delivery.sourceUrl)).toBe(normalizeSourceUrl(project.sourceUrl!));
    }
  });

  it("does not promote manufacturer defaults to project facts", () => {
    const importedGlavlesProject = getProjectSourceFacts(469)!;

    expect(importedGlavlesProject.area.value).toBe("17 м²");
    expect(importedGlavlesProject.price.value).toBe("1 214 000 ₽");
    expect(importedGlavlesProject.productionTerm.status).toBe("not-published");
    expect(importedGlavlesProject.insulation.status).toBe("not-published");
    expect(importedGlavlesProject.completion.status).toBe("not-published");
    expect(importedGlavlesProject.delivery.status).toBe("not-published");
  });

  it("does not label an office address as the project production site", () => {
    const officeOnlyProject = getProjectSourceFacts(477)!;

    expect(officeOnlyProject.productionAddress.status).toBe("not-published");
    expect(officeOnlyProject.productionAddress.value).toBeNull();
  });

  it("publishes only the DA-HOME facts explicitly verified on the project page", () => {
    const daHomeProject = getProjectSourceFacts(579)!;

    expect(daHomeProject.bedrooms.status).toBe("not-published");
    expect(daHomeProject.bathrooms.status).toBe("not-published");
    expect(daHomeProject.floors.status).toBe("derived");
    expect(daHomeProject.floors.value).toBe("1");
  });

  it("covers every published Platforma project", () => {
    expect(platformaProjects).toHaveLength(11);

    for (const project of platformaProjects) {
      const facts = getProjectSourceFacts(project.id);
      expect(facts, project.name).toBeDefined();
      expect(new URL(facts!.area.sourceUrl).pathname.replace(/\/+$/u, "")).toBe(
        new URL(project.sourceUrl!).pathname.replace(/\/+$/u, ""),
      );
      expect(facts?.price.sourceUrl).toBe(project.sourceUrl);
      expect(facts?.productionTerm.sourceUrl).toBe(project.sourceUrl);
      expect(facts?.bedrooms.sourceUrl).toBe(project.sourceUrl);
      expect(facts?.bathrooms.sourceUrl).toBe(project.sourceUrl);
      expect(facts?.floors.sourceUrl).toBe(project.sourceUrl);
    }
  });

  it("requires provenance for every value and records missing facts explicitly", () => {
    for (const facts of Object.values(projectSourceFactsById)) {
      for (const [key, fact] of Object.entries(facts)) {
        if (key === "media") continue;
        expect(fact.sourceUrl).toMatch(/^https:\/\//u);
        expect(fact.checkedAtIso).toMatch(/^\d{4}-\d{2}-\d{2}$/u);
        expect(fact.evidence.trim()).not.toBe("");

        if (fact.status === "verified" || fact.status === "derived") {
          expect(fact.value?.trim()).not.toBe("");
        } else {
          expect(fact.value).toBeNull();
        }
      }
    }
  });

  it("never replaces absent required data with a guess", () => {
    const bathFacts = getProjectSourceFacts(437)!;

    expect(resolveRequiredProjectFact(bathFacts.productionTerm, "30 д.")).toBe(
      UNKNOWN_REQUIRED_PROJECT_FACT,
    );
    expect(resolveRequiredProjectFact(bathFacts.insulation, "до −30°C")).toBe(
      UNKNOWN_REQUIRED_PROJECT_FACT,
    );
    expect(resolveOptionalProjectFact(bathFacts.style, "Современный")).toBeNull();
    expect(bathFacts.bedrooms.status).toBe("not-applicable");
    expect(bathFacts.bathrooms.status).toBe("not-applicable");
  });

  it("uses official Bygge facts instead of the stale Patio legacy values", () => {
    const patioFacts = getProjectSourceFacts(40)!;
    const patioProject = projects.find((project) => project.id === 40)!;

    expect(patioFacts.price.value).toBe("2 445 000 ₽");
    expect(patioFacts.productionTerm.value).toBe("19 д.");
    expect(patioFacts.bedrooms.value).toBe("2");
    expect(patioFacts.insulation.value).toBe("Пол, стены и потолок: 150 мм");
    expect(patioProject.descriptionLong).toContain("габаритами 7,3 × 6,1 м");
    expect(patioFacts.productionAddress.value).toBe("г. Екатеринбург");
    expect(patioFacts.delivery.status).toBe("not-published");
  });

  it("covers every published Bygge project with an explicit source status", () => {
    expect(byggeProjects).toHaveLength(23);

    for (const project of byggeProjects) {
      const facts = getProjectSourceFacts(project.id);
      expect(facts, project.name).toBeDefined();
      expect(new URL(facts!.area.sourceUrl).pathname.replace(/\/+$/u, "")).toBe(
        new URL(project.sourceUrl!).pathname.replace(/\/+$/u, ""),
      );
      expect(facts?.productionTerm.status).toBe("verified");
      expect(facts?.insulation.status, project.name).toMatch(/^(verified|not-published)$/u);
      expect(facts?.roomCount.status, `${project.name}: rooms`).toBe("verified");
      expect(facts?.floors.status, `${project.name}: floors`).toBe("derived");
    }
  });

  it("uses current official prices and terms for the six legacy Bygge cards", () => {
    const expected = new Map([
      [41, ["4 283 000 ₽", "35 д."]],
      [42, ["4 035 000 ₽", "35 д."]],
      [43, ["4 636 000 ₽", "35 д."]],
      [44, ["3 707 000 ₽", "35 д."]],
      [45, ["3 135 000 ₽", "19 д."]],
      [46, ["1 439 000 ₽", "15 д."]],
    ]);

    for (const [projectId, [price, term]] of expected) {
      const facts = getProjectSourceFacts(projectId)!;
      expect(facts.price.value).toBe(price);
      expect(facts.productionTerm.value).toBe(term);
    }
  });
});
