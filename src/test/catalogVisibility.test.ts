import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { isPublicProject } from "@/data/catalogVisibility";
import {
  allProjects, projects, catalogItems, makersById, projectOverrides,
  getProjectsByManufacturerId,
} from "@/data/projects";
import { getProjectCardViewModel } from "@/lib/projectViewModel";

describe("withdrawn manufacturer publication", () => {
  it("retains recoverable source data but removes the company and all its projects from public selectors", () => {
    const archived = allProjects.filter((project) => project.manufacturerId === "lesprom96");
    expect(archived.map((project) => project.id)).toEqual([602, 603, 604, 605, 606]);
    expect(makersById.lesprom96).toBeUndefined();
    expect(getProjectsByManufacturerId("lesprom96")).toEqual([]);
    for (const project of archived) {
      expect(isPublicProject(project)).toBe(false);
      expect(projects.some((item) => item.id === project.id)).toBe(false);
      expect(catalogItems.some((item) => item.id === project.id)).toBe(false);
      expect(projectOverrides[project.id]).toBeUndefined();
      expect(getProjectCardViewModel(project.id)).toBeFalsy();
    }
    expect(makersById.platforma).toBeDefined();
    expect(makersById.bygge).toBeDefined();
  });

  it("excludes withdrawn routes from both prerender and sitemap", () => {
    const output = execFileSync(process.execPath, ["scripts/prerender.mjs"], {
      encoding: "utf8",
      env: { ...process.env, PRERENDER_LIST_ONLY: "1" },
    });
    const manifest = JSON.parse(output.trim().split("\n").at(-1)!);
    for (const routes of [manifest.routes, manifest.sitemapRoutes] as string[][]) {
      expect(routes.some((route) => route.includes("lesprom96"))).toBe(false);
      expect(routes).toContain("/proizvoditeli/platforma/");
      expect(routes).toContain("/proizvoditeli/bygge/");
    }
  });
});
