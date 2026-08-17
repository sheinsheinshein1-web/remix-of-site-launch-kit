import { describe, expect, it } from "vitest";
import { allRegions, geoLocationCount } from "@/data/regions";
import {
  ALL_REGIONS_GEO_SLUG,
  getGeoSelectionAccusative,
  getGeoSelectionCityValue,
  getGeoSelectionLabel,
  getProjectDeliveryRegions,
  isProjectAvailableInGeo,
  normalizeGeoSelection,
  resolveGeoSelection,
  searchGeoSelections,
} from "@/lib/geoSelection";

describe("единый реестр выбранной географии", () => {
  it("использует все регионы как нейтральное состояние по умолчанию", () => {
    expect(normalizeGeoSelection()).toBe(ALL_REGIONS_GEO_SLUG);
    expect(normalizeGeoSelection("Все регионы")).toBe(ALL_REGIONS_GEO_SLUG);
    expect(getGeoSelectionLabel(ALL_REGIONS_GEO_SLUG)).toBe("Все регионы");
    expect(getGeoSelectionCityValue(ALL_REGIONS_GEO_SLUG)).toBe(ALL_REGIONS_GEO_SLUG);
    expect(isProjectAvailableInGeo("Рязань", ALL_REGIONS_GEO_SLUG)).toBe(true);
  });

  it("использует все города и административные регионы из единого реестра", () => {
    expect(geoLocationCount).toBe(allRegions.length);
    expect(allRegions).toHaveLength(93);
    expect(new Set(allRegions.map((region) => region.slug)).size).toBe(93);
    expect(new Set(allRegions.map((region) => region.name)).size).toBe(93);
  });

  it("переводит старое значение региона в канонический slug", () => {
    expect(normalizeGeoSelection("Москва и МО")).toBe("moskva");
    expect(normalizeGeoSelection("Екатеринбург")).toBe("ekaterinburg");
  });

  it("сохраняет название города, но фильтрует по его базовому региону", () => {
    expect(resolveGeoSelection("khimki")?.baseRegionSlug).toBe("moskva");
    expect(getGeoSelectionLabel("khimki")).toBe("Химки");
    expect(getGeoSelectionCityValue("khimki")).toBe("Москва и МО");
  });

  it("находит административную область по названию и падежной форме", () => {
    expect(normalizeGeoSelection("Свердловская область")).toBe("sverdlovskaya-oblast");
    expect(normalizeGeoSelection("Свердловскую область")).toBe("sverdlovskaya-oblast");
    expect(getGeoSelectionCityValue("sverdlovskaya-oblast")).toBe("Екатеринбург");
    expect(normalizeGeoSelection("Московская область")).toBe("moskovskaya-oblast");
  });

  it("показывает административные области в поисковых подсказках", () => {
    expect(searchGeoSelections("Свердловскую область")[0]?.slug).toBe("sverdlovskaya-oblast");
    expect(searchGeoSelections("Московская область")[0]?.slug).toBe("moskovskaya-oblast");
    expect(searchGeoSelections("Алтайский край")[0]?.slug).toBe("altayskiy-kray");
  });

  it("ограничивает доставку проекта его базовым регионом и ближайшими городами", () => {
    expect(getProjectDeliveryRegions("Санкт-Петербург и ЛО").map((region) => region.slug)).toEqual([
      "sankt-peterburg",
      "leningradskaya-oblast",
      "murino",
      "kudrovo",
      "vsevolozhsk",
      "gatchina",
    ]);
    expect(getProjectDeliveryRegions("Екатеринбург").every((region) => (
      region.slug === "ekaterinburg" || region.baseRegionSlug === "ekaterinburg"
    ))).toBe(true);
  });

  it("проверяет доставку по выбранному направлению, а не по физическому городу пользователя", () => {
    expect(isProjectAvailableInGeo("Рязань", "ryazan")).toBe(true);
    expect(isProjectAvailableInGeo("Рязань", "rybnoye")).toBe(true);
    expect(isProjectAvailableInGeo("Рязань", "kemerovo")).toBe(false);
  });

  it("поддерживает точный список регионов доставки у отдельного проекта", () => {
    expect(isProjectAvailableInGeo("Рязань", "kemerovo", ["kemerovo"])).toBe(true);
    expect(isProjectAvailableInGeo("Рязань", "ryazan", ["kemerovo"])).toBe(false);
  });

  it("склоняет выбранное направление для текста доставки", () => {
    expect(getGeoSelectionAccusative("ufa")).toBe("Уфу");
    expect(getGeoSelectionAccusative("moskovskaya-oblast")).toBe("Московскую область");
    expect(getGeoSelectionAccusative("verkhnyaya-pyshma")).toBe("Верхнюю Пышму");
    expect(getGeoSelectionAccusative("kazan")).toBe("Казань");
  });
});
