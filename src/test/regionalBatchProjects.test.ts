import { describe, expect, it } from "vitest";
import { allProjects, projects } from "@/data/projects";

const expectedMakerIds = [
  "azbuka-doma",
  "yuzhny-dom",
  "klyuch-st",
  "doorhan-kazan",
  "avgst",
  "stroylider-nn",
  "postroidom-altai",
  "altai-mda",
];

describe("regional partner batch", () => {
  const batch = allProjects.filter((project) => project.id >= 197 && project.id <= 236);

  it("contains 40 projects with unique sequential ids", () => {
    expect(batch).toHaveLength(40);
    expect(batch.map((project) => project.id)).toEqual(
      Array.from({ length: 40 }, (_, index) => index + 197),
    );
  });

  it.each(expectedMakerIds)("%s has five complete projects", (makerId) => {
    const makerProjects = batch.filter((project) => project.maker.id === makerId);

    expect(makerProjects).toHaveLength(5);
    makerProjects.forEach((project) => {
      expect(project.gallery.length).toBeGreaterThanOrEqual(2);
      expect(project.gallery.every((item) => item.image)).toBe(true);
      expect(project.maker.siteUrl).toMatch(/^https:\/\//);
      expect(project.city).toBeTruthy();
      expect(project.floors).toBeGreaterThan(0);
    });
  });

  it("keeps frame projects in source data but excludes them from the public catalog", () => {
    expect(allProjects.some((project) => project.technology === "Каркасный")).toBe(true);
    expect(projects.some((project) => project.technology === "Каркасный")).toBe(false);
  });
});
