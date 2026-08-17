import { describe, expect, it } from "vitest";
import { getManufacturerMapQuery, getManufacturerMapUrls } from "@/lib/manufacturerMap";

describe("manufacturer map", () => {
  it("does not duplicate a city already present in the address", () => {
    expect(
      getManufacturerMapQuery("г. Екатеринбург, ул. Сулимова, 50, офис 3.11", "Екатеринбург"),
    ).toBe("г. Екатеринбург, ул. Сулимова, 50");
  });

  it("adds the city to a street-only address", () => {
    expect(getManufacturerMapQuery("ул. Хлебная, 17", "Екатеринбург")).toBe(
      "Екатеринбург, ул. Хлебная, 17",
    );
  });

  it("uses the cleaned full address in Yandex search URLs", () => {
    const urls = getManufacturerMapUrls({
      address: "г. Екатеринбург, ул. Сулимова, 50, офис 3.11",
      city: "Екатеринбург",
    });

    expect(decodeURIComponent(urls.embedUrl ?? "")).toContain("text=г. Екатеринбург, ул. Сулимова, 50");
    expect(decodeURIComponent(urls.externalUrl ?? "")).toContain("text=г. Екатеринбург, ул. Сулимова, 50");
  });
});
