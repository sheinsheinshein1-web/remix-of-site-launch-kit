import { describe, expect, it } from "vitest";
import { withCatalogObjectType, withoutLegacyCatalogRegion } from "@/lib/catalogQuery";

describe("catalog query", () => {
  it("uses the object type rather than technology for the houses tab", () => {
    const next = withCatalogObjectType(new URLSearchParams("q=барнхаус&tech=Модульный дом"), "house");
    expect(next.get("type")).toBe("house");
    expect(next.has("tech")).toBe(false);
    expect(next.get("q")).toBe("барнхаус");
  });

  it("clears only the object type for the all tab", () => {
    const next = withCatalogObjectType(new URLSearchParams("type=bath&maxPrice=3000000"), "all");
    expect(next.has("type")).toBe(false);
    expect(next.get("maxPrice")).toBe("3000000");
  });

  it("lets a newly selected city replace a legacy region query", () => {
    const next = withoutLegacyCatalogRegion(new URLSearchParams("region=moskva&q=дом"));
    expect(next.has("region")).toBe(false);
    expect(next.get("q")).toBe("дом");
  });

});
