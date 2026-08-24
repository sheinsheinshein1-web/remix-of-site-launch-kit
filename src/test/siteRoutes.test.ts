import { describe, expect, it } from "vitest";
import { projects } from "@/data/projects";
import { allRegions } from "@/data/regions";
import {
  CATALOG_PATH,
  MANUFACTURERS_PATH,
  REGIONS_PATH,
  getManufacturerPath,
  getProjectIdFromRouteParam,
  getProjectPath,
  getRegionPath,
} from "@/lib/siteRoutes";

describe("публичные SEO-адреса", () => {
  it("использует тематические адреса для основных разделов", () => {
    expect(CATALOG_PATH).toBe("/modulnye-doma/");
    expect(MANUFACTURERS_PATH).toBe("/proizvoditeli/");
    expect(REGIONS_PATH).toBe("/regiony-dostavki/");
    expect(getRegionPath("moskva")).toBe("/modulnye-doma/moskva/");
    expect(getManufacturerPath("cubber")).toBe("/proizvoditeli/cubber/");
  });

  it("формирует читаемый и стабильный адрес проекта", () => {
    const cubber65 = projects.find((project) => project.id === 379);
    const wideHouse = projects.find((project) => project.id === 32);

    expect(cubber65 && getProjectPath(cubber65)).toBe(
      "/modulnye-doma/proekty/cubber-house-65-67-m2-379/",
    );
    expect(wideHouse && getProjectPath(wideHouse)).toBe(
      "/modulnye-doma/proekty/platforma-wide-house-46-m2-32/",
    );
  });

  it("оставляет числовой id в конце для однозначного поиска проекта", () => {
    expect(getProjectIdFromRouteParam("cubber-house-65-67-m2-379")).toBe(379);
    expect(getProjectIdFromRouteParam("379")).toBe(379);
    expect(Number.isNaN(getProjectIdFromRouteParam("cubber-house"))).toBe(true);
  });

  it("не создаёт коллизий между проектами и регионами", () => {
    const projectPaths = projects.map(getProjectPath);
    const regionPaths = allRegions.map((region) => getRegionPath(region.slug));

    expect(new Set(projectPaths).size).toBe(projectPaths.length);
    expect(new Set(regionPaths).size).toBe(regionPaths.length);
  });
});
