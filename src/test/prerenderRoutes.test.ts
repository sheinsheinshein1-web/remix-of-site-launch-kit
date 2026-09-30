import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { projects } from "@/data/projects";
import { getProjectPath } from "@/lib/siteRoutes";

describe("prerender and sitemap project routes", () => {
  it("uses exactly the same public project URLs as the website", () => {
    const output = execFileSync(process.execPath, ["scripts/prerender.mjs"], {
      env: { ...process.env, PRERENDER_LIST_ONLY: "1" },
      encoding: "utf8",
    });
    const manifest = JSON.parse(output.trim().split("\n").pop()!) as { routes: string[]; sitemapRoutes: string[] };
    const expected = projects.map(getProjectPath).sort();
    const projectPaths = (routes: string[]) => routes.filter((path) => path.includes("/proekty/")).sort();
    expect(projectPaths(manifest.routes)).toEqual(expected);
    expect(projectPaths(manifest.sitemapRoutes)).toEqual(expected);
    expect(manifest.routes).toContain("/modulnye-doma/proekty/platforma-wide-house-46-m2-32/");
    expect(manifest.routes).not.toContain("/modulnye-doma/proekty/platforma-wide-house-57-m2-32/");
  });
});
