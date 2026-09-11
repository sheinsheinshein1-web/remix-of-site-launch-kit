import { describe, expect, it } from "vitest";
import { manufacturerRegistry, manufacturers } from "@/data/manufacturers";
import {
  allProjects,
  getManufacturerById,
  getManufacturerProjectCount,
  getProjectsByManufacturerId,
} from "@/data/projects";

describe("manufacturer registry", () => {
  it("contains a unique validated record for every project manufacturer", () => {
    expect(new Set(manufacturers.map((manufacturer) => manufacturer.id)).size).toBe(manufacturers.length);

    for (const project of allProjects) {
      expect(manufacturerRegistry[project.manufacturerId], `project ${project.id}`).toBeDefined();
    }
  });

  it("keeps company data and project source URLs as separate fields", () => {
    const platformaProject = allProjects.find(
      (project) => project.manufacturerId === "platforma" && project.sourceUrl,
    );

    expect(platformaProject).toBeDefined();
    expect(platformaProject?.sourceUrl).not.toBe(manufacturerRegistry.platforma.siteUrl);
    expect(manufacturerRegistry.platforma.siteUrl).toBe("https://platforma-modul.ru/");
  });

  it("provides one canonical Platforma entity to every consumer", () => {
    const platforma = getManufacturerById("platforma");

    expect(platforma?.verified).toBe(true);
    expect(platforma?.externalRating?.rating).toBe(4.3);
    expect(platforma?.externalRating?.totalCount).toBe(5);
    expect(platforma?.profile?.coordinates).toEqual({ lat: 56.89275, lon: 60.783923 });
    expect(platforma?.profile?.legal?.inn).toBe("6678135856");
    expect(platforma?.profile?.builtObjects).toHaveLength(11);
    expect(platforma?.profile?.social?.youtubeVideos).toHaveLength(6);
    expect(platforma?.profile?.seo?.title).toContain("Платформа");
  });

  it("stores optional profile sections on the manufacturer instead of in the page component", () => {
    const bygge = getManufacturerById("bygge");

    expect(bygge?.profile?.about?.[0]).toContain("производитель модульных домов");
    expect(bygge?.profile?.coordinates).toEqual({ lat: 56.7923281, lon: 60.7321339 });
    expect(bygge?.profile?.legal).toBeUndefined();
    expect(bygge?.profile?.builtObjects).toBeUndefined();
  });

  it("derives project lists and counts from manufacturerId", () => {
    const projects = getProjectsByManufacturerId("platforma");

    expect(projects.length).toBeGreaterThan(0);
    expect(projects.every((project) => project.manufacturerId === "platforma")).toBe(true);
    expect(getManufacturerProjectCount("platforma")).toBe(projects.length);
  });
});
