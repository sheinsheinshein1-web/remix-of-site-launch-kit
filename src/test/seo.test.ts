import { describe, expect, it } from "vitest";
import { buildCanonicalUrl, buildSiteUrl, normalizeSitePath } from "@/lib/seo";

describe("SEO URL helpers", () => {
  it("preserves query parameters while normalizing the pathname", () => {
    expect(normalizeSitePath("/catalog?minArea=50&maxArea=80"))
      .toBe("/catalog/?minArea=50&maxArea=80");
  });

  it("keeps curated filters in canonical and structured-data URLs", () => {
    expect(buildCanonicalUrl("/catalog?q=терраса"))
      .toBe("https://многоместа.рф/catalog/?q=терраса");
    expect(buildSiteUrl("/catalog?tech=Каркасный"))
      .toBe("https://многоместа.рф/catalog/?tech=Каркасный");
  });
});
