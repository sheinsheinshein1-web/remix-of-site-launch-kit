import { describe, expect, it } from "vitest";
import { allRegions, regionGroups, regions, regionsBySlug } from "@/data/regions";

describe("региональные зоны доставки", () => {
  it("создаёт города доставки и отдельные страницы административных регионов", () => {
    expect(regions).toHaveLength(16);
    expect(regionGroups).toHaveLength(16);
    expect(regionGroups.filter((group) => group.cities.some((region) => region.deliveryArea))).toHaveLength(13);
    expect(regionGroups.every((group) => group.cities.length === 5 || group.cities.length === 6)).toBe(true);
    expect(allRegions).toHaveLength(93);
  });

  it("не создаёт повторяющиеся URL", () => {
    const slugs = allRegions.map((region) => region.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(Object.keys(regionsBySlug)).toHaveLength(93);
  });

  it("город наследует проекты и технологию базового региона", () => {
    for (const group of regionGroups) {
      for (const location of group.cities.slice(1)) {
        expect(location.baseRegionSlug).toBe(group.region.slug);
        expect(location.cityValue).toBe(group.region.cityValue);
        expect(location.cityValues).toEqual(group.region.cityValues);
        expect(location.technologyValue).toBe(group.region.technologyValue ?? "Модульный дом");
        expect(Boolean(location.deliveryCity || location.deliveryArea)).toBe(true);
      }
    }
  });

  it("создаёт канонические страницы Московской и Свердловской областей", () => {
    expect(regionsBySlug["moskovskaya-oblast"]?.name).toBe("Московская область");
    expect(regionsBySlug["sverdlovskaya-oblast"]?.name).toBe("Свердловская область");
  });
});
