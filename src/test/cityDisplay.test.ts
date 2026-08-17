import { describe, expect, it } from "vitest";
import {
  compareCityRegionPriority,
  getCityDisplayName,
  getCityPrepositionalName,
  isSameCityRegion,
} from "@/lib/cityDisplay";

describe("city display normalization", () => {
  it("shows the short Saint Petersburg label", () => {
    expect(getCityDisplayName("Санкт-Петербург и ЛО")).toBe("Санкт-Петербург");
  });

  it("merges old and new Saint Petersburg region values", () => {
    expect(isSameCityRegion("Санкт-Петербург и ЛО", "Санкт-Петербург")).toBe(true);
  });

  it("keeps different regions separate", () => {
    expect(isSameCityRegion("Санкт-Петербург и ЛО", "Москва и МО")).toBe(false);
  });

  it("uses the shared geo registry for a base city", () => {
    expect(getCityPrepositionalName("Москва и МО")).toBe("в Москве");
    expect(getCityPrepositionalName("Санкт-Петербург и ЛО")).toBe("в Санкт-Петербурге");
  });

  it("uses the shared geo registry for an administrative region", () => {
    expect(getCityPrepositionalName("Московская область")).toBe("в Московской области");
  });

  it("prioritizes the selected region and preserves the order within it", () => {
    expect(compareCityRegionPriority("Москва и МО", "Екатеринбург", "Москва и МО")).toBeLessThan(0);
    expect(compareCityRegionPriority("Екатеринбург", "Москва и МО", "Москва и МО")).toBeGreaterThan(0);
    expect(compareCityRegionPriority("Москва и МО", "Москва и МО", "Москва и МО")).toBe(0);
  });
});
