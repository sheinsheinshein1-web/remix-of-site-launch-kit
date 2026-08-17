import { describe, expect, it } from "vitest";
import { compareGeoNames, sortGeoItems } from "@/lib/geoOrder";

describe("geo ordering", () => {
  it("always puts Moscow first and Saint Petersburg second", () => {
    expect(sortGeoItems(
      ["Казань", "Санкт-Петербург и ЛО", "Екатеринбург", "Москва и МО"],
      (city) => city,
    )).toEqual([
      "Москва и МО",
      "Санкт-Петербург и ЛО",
      "Казань",
      "Екатеринбург",
    ]);
  });

  it("preserves the chosen ordering rule for the other regions", () => {
    const cities = [
      { name: "Казань", projects: 10 },
      { name: "Москва", projects: 1 },
      { name: "Пермь", projects: 30 },
      { name: "Санкт-Петербург", projects: 2 },
    ];

    expect(sortGeoItems(
      cities,
      (city) => city.name,
      (first, second) => second.projects - first.projects,
    ).map((city) => city.name)).toEqual([
      "Москва",
      "Санкт-Петербург",
      "Пермь",
      "Казань",
    ]);
  });

  it("uses the existing Russian alphabetical order after the priority cities", () => {
    expect([
      "Уфа",
      "Санкт-Петербург",
      "Москва",
      "Барнаул",
    ].sort((first, second) => compareGeoNames(
      first,
      second,
      (a, b) => a.localeCompare(b, "ru"),
    ))).toEqual([
      "Москва",
      "Санкт-Петербург",
      "Барнаул",
      "Уфа",
    ]);
  });
});
