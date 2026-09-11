import { readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = resolve(import.meta.dirname, "../..");

describe("critical mobile performance budget", () => {
  it("keeps the mobile LCP image below 220 KiB", () => {
    const heroPath = resolve(projectRoot, "public/hero/home-mobile-768-v1.avif");

    expect(statSync(heroPath).size).toBeLessThan(220 * 1024);
  });

  it("keeps the header logo below 30 KiB", () => {
    const logoPath = resolve(projectRoot, "src/assets/logo-mnogo-mesta-430.webp");

    expect(statSync(logoPath).size).toBeLessThan(30 * 1024);
  });

  it("does not restore render-blocking Google Fonts", () => {
    const html = readFileSync(resolve(projectRoot, "index.html"), "utf8");

    expect(html).not.toContain("fonts.googleapis.com");
    expect(html).not.toContain("fonts.gstatic.com");
  });
});
