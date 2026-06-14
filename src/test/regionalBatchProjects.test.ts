import { describe, expect, it } from "vitest";
import { projects } from "@/data/projects";

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
  const batch = projects.filter((project) => project.id >= 197 && project.id <= 236);

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
});
