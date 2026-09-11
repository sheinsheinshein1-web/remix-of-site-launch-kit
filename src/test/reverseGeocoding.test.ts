import { describe, expect, it, vi } from "vitest";
import {
  formatApproximateMapLocation,
  formatReverseGeocodingAddress,
  reverseGeocodeMapPoint,
} from "@/lib/reverseGeocoding";

describe("reverse geocoding", () => {
  it("собирает короткий понятный адрес без индекса и страны", () => {
    expect(formatReverseGeocodingAddress({
      road: "улица Толмачёва",
      neighbourhood: "Вознесенская горка",
      suburb: "Пионерский",
      city_district: "Кировский район",
      city: "Екатеринбург",
      state: "Свердловская область",
      postcode: "620075",
      country: "Россия",
    })).toBe("Екатеринбург, Пионерский, улица Толмачёва");
  });

  it("использует район области, когда населённый пункт не найден", () => {
    expect(formatReverseGeocodingAddress({
      county: "Белоярский городской округ",
      state: "Свердловская область",
    })).toBe("Белоярский городской округ");
  });

  it("не показывает координаты в резервном тексте", () => {
    expect(formatApproximateMapLocation(null, "Екатеринбург"))
      .toBe("Примерный район: Екатеринбург (точка выбрана на карте, радиус 3 км)");
  });

  it("запрашивает русскоязычный адрес с точностью до улицы", async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify({
      address: {
        road: "улица Толмачёва",
        suburb: "Пионерский",
        city: "Екатеринбург",
      },
    }), { status: 200 }));

    await expect(reverseGeocodeMapPoint(
      { lat: 56.84, lng: 60.61 },
      { endpoint: "https://example.com/reverse", fetcher },
    )).resolves.toBe("Екатеринбург, Пионерский, улица Толмачёва");

    const requestedUrl = new URL(String(fetcher.mock.calls[0]?.[0]));
    expect(requestedUrl.searchParams.get("zoom")).toBe("16");
    expect(requestedUrl.searchParams.get("accept-language")).toBe("ru");
  });
});

