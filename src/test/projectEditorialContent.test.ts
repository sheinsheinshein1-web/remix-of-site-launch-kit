import { describe, expect, it } from "vitest";
import { manufacturerRegistry } from "@/data/manufacturers";
import { allProjects } from "@/data/projects";
import {
  buildProjectEditorialContent,
  buildProjectHeading,
  buildProjectSeoDescription,
} from "@/lib/projectEditorialContent";
import { buildProjectSeo } from "@/lib/pageSeo";

const targetManufacturerIds = new Set(
  Object.values(manufacturerRegistry)
    .filter((manufacturer) => manufacturer.profile?.sourceAudit)
    .map((manufacturer) => manufacturer.id),
);
const targetProjects = allProjects.filter((project) => targetManufacturerIds.has(project.manufacturerId));

describe("verified project editorial content", () => {
  it("covers every project from the enriched manufacturers", () => {
    expect(targetProjects.length).toBeGreaterThan(98);

    for (const project of targetProjects) {
      const manufacturer = manufacturerRegistry[project.manufacturerId];
      const content = buildProjectEditorialContent(project, manufacturer.name);
      const fullText = buildProjectSeoDescription(project, manufacturer.name);

      expect(project.sourceUrl, `${manufacturer.name}: ${project.name}`).toMatch(/^https:\/\//);
      expect(new URL(project.sourceUrl!).hostname).toBe(new URL(manufacturer.siteUrl!).hostname);
      expect(content.sections.length).toBeGreaterThanOrEqual(2);
      if (!/уточняется|по запросу/iu.test(project.area)) expect(fullText).toContain(project.area);
      expect(fullText).toContain(project.price);
      expect(fullText).toContain(manufacturer.name);
      expect(fullText).not.toMatch(/undefined|NaN/);
      if (!project.name.toLocaleLowerCase("ru").includes("под ключ")) {
        expect(buildProjectSeo(project).description).not.toContain("под ключ");
      }
      expect(buildProjectHeading(project)).toContain(project.name);
    }
  });

  it("keeps unverified details out of the generated copy", () => {
    const project = targetProjects.find((item) => item.id === 255)!;
    const content = buildProjectSeoDescription(project, "Главлес");

    expect(content).not.toContain("фундамент входит");
    expect(content).not.toContain("доставка включена");
    expect(content).not.toContain("гарантия");
  });

  it("does not add residential room counts to bath descriptions", () => {
    const bath = targetProjects.find((item) => item.productType === "bath")!;
    const content = buildProjectSeoDescription(bath, manufacturerRegistry[bath.manufacturerId].name);

    expect(content).not.toContain("0 спален");
    expect(content).not.toContain("0 санузлов");
    expect(content).not.toContain("технология «Модульный дом»");
    expect(content).not.toContain("до −30°C");
  });

  it("applies the shared editorial contract by region instead of a manufacturer allowlist", () => {
    const auditedYekaterinburgProject = allProjects.find((project) => (
      project.manufacturerId === "prefabia" && Boolean(project.sourceUrl)
    ))!;
    const projectOutsideYekaterinburg = allProjects.find((project) => (
      project.manufacturerId === "ip-modul" && Boolean(project.sourceUrl)
    ))!;

    expect(buildProjectEditorialContent(auditedYekaterinburgProject, "PREFABIA").sections.length).toBeGreaterThanOrEqual(2);
    expect(buildProjectEditorialContent(projectOutsideYekaterinburg, "IP Modul").sections).toEqual([]);
  });

  it("does not synthesize detailed copy without an official source", () => {
    const referenceProject = targetProjects[0];
    const unsourcedProject = { ...referenceProject, sourceUrl: undefined };

    expect(buildProjectEditorialContent(unsourcedProject, "Платформа").sections).toEqual([]);
  });

  it("keeps PREFABIA project facts from the official product page", () => {
    const project = allProjects.find((item) => item.id === 617)!;
    const content = buildProjectSeoDescription(project, "PREFABIA");

    expect(project.price).toBe("4 400 000 ₽");
    expect(project.area).toBe("58,5 м²");
    expect(project.dimensions).toBe("6,5 × 9 м");
    expect(project.beds).toBe(2);
    expect(project.baths).toBe(1);
    expect(project.gallery.length).toBeGreaterThan(1);
    expect(content).toContain("две полноценные спальни");
    expect(content).toContain("30 дней");
  });

  it("uses the current project's production term and the audited production location", () => {
    const project = allProjects.find((item) => item.id === 31)!;
    const manufacturer = manufacturerRegistry[project.manufacturerId];
    const content = buildProjectEditorialContent(
      project,
      manufacturer.name,
      manufacturer.productionAddress,
    );
    const construction = content.sections.find((section) => section.heading === "Конструкция и комплектация");

    expect(project.name).toBe("Twin House");
    expect(project.term).toBe("60 д.");
    expect(construction?.text).toContain("Срок производства: 60 дней.");
    expect(construction?.text).toContain("Место производства: г. Березовский.");
    expect(construction?.text).not.toContain("50 дней");
    expect(buildProjectSeoDescription(project, manufacturer.name, manufacturer.productionAddress)).not.toMatch(/\s[—–]\s/u);
  });

  it("preserves the approved Bear House 86 editorial copy", () => {
    const project = allProjects.find((item) => item.id === 36)!;
    const manufacturer = manufacturerRegistry[project.manufacturerId];
    const content = buildProjectEditorialContent(project, manufacturer.name, manufacturer.productionAddress);
    const price = content.sections.find((section) => section.heading === "Цена");
    const construction = content.sections.find((section) => section.heading === "Конструкция и комплектация");

    expect(content.lead).toContain("одноэтажный модульный дом от компании «Платформа»");
    expect(project.term).toBe("60 д.");
    expect(construction?.text).toContain("Срок производства: 60 дней.");
    expect(construction?.text).toContain("Производство и отгрузка: г. Березовский.");
    expect(price?.text).toBe(
      "В каталоге многоместа.рф указана стоимость от 4 349 000 ₽ по данным на 12 сентября 2026 года. Уточните у производителя, входят ли в эту цену фундамент, доставка, монтаж и подключение коммуникаций.",
    );
  });
});
