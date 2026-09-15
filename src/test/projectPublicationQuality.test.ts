import { describe, expect, it } from "vitest";
import { getProjectSourceFacts } from "@/data/projectSourceFacts";
import { projects } from "@/data/projects";
import {
  auditProjectPublicationQuality,
  projectPublicationContracts,
} from "@/lib/projectPublicationQuality";

describe("project publication quality gate", () => {
  const byggeProjects = projects.filter((project) => project.manufacturerId === "bygge");
  const contract = projectPublicationContracts.bygge;
  const platformaProjects = projects.filter((project) => project.manufacturerId === "platforma");

  it("blocks incomplete Bygge cards before publication", () => {
    expect(byggeProjects).toHaveLength(23);

    for (const project of byggeProjects) {
      expect(
        auditProjectPublicationQuality(project, getProjectSourceFacts(project.id), contract),
        `${project.name} не соответствует контракту публикации`,
      ).toEqual([]);
    }
  });

  it("detects the exact regression that affected Patio 2.0, Milani and Elen", () => {
    const elen = byggeProjects.find((project) => project.id === 441)!;
    const facts = getProjectSourceFacts(elen.id)!;
    const brokenProject = {
      ...elen,
      rooms: "Планировка на сайте производителя",
      descriptionLong: "Модульный дом от Bygge.",
      gallery: elen.gallery.slice(0, 1),
    };
    const brokenFacts = {
      ...facts,
      roomCount: { ...facts.roomCount, status: "not-published" as const, value: null },
      floors: { ...facts.floors, status: "not-published" as const, value: null },
    };
    const issueCodes = auditProjectPublicationQuality(brokenProject, brokenFacts, contract)
      .map((issue) => issue.code);

    expect(issueCodes).toEqual(expect.arrayContaining([
      "missing-room-fact",
      "missing-floor-fact",
      "gallery-too-small",
      "missing-published-plan",
      "thin-description",
    ]));
  });

  it("keeps the official main galleries for the three previously incomplete cards", () => {
    const expectedGallerySizes = new Map([
      [439, 9],
      [440, 30],
      [441, 4],
    ]);

    for (const [projectId, expectedSize] of expectedGallerySizes) {
      const project = byggeProjects.find((item) => item.id === projectId)!;
      expect(project.gallery, project.name).toHaveLength(expectedSize);
      expect(project.gallery.some((item) => item.type === "plan"), project.name).toBe(true);
    }
  });

  it("applies the same blocking publication contract to every Platforma card", () => {
    expect(platformaProjects).toHaveLength(11);

    for (const project of platformaProjects) {
      expect(
        auditProjectPublicationQuality(
          project,
          getProjectSourceFacts(project.id),
          projectPublicationContracts.platforma,
        ),
        `${project.name} не соответствует контракту публикации`,
      ).toEqual([]);
    }
  });
});
