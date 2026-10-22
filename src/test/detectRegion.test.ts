import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { resolveDetectedRegion } from "@/lib/detectRegion";

const location = (city: string, region = "Свердловская область") => ({
  success: true, country_code: "RU", city, region,
});

beforeEach(() => { localStorage.clear(); vi.resetModules(); });
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });

describe("IP location matching", () => {
  it.each([
    [location("Екатеринбург"), "ekaterinburg"],
    [location("Березовский"), "berezovskiy"],
    [location("Березовский", "Кемеровская область"), "kemerovskaya-oblast"],
    [location("Неизвестный город"), "sverdlovskaya-oblast"],
    [location("Москва", "Москва"), "moskva"],
    [location("Санкт–Петербург", "Санкт-Петербург"), "sankt-peterburg"],
    [location("Неизвестный город", "Татарстан"), "tatarstan"],
    [{ ...location("Москва"), country_code: "US" }, null],
    [{ ...location("Москва"), success: false }, null],
    [location("Неизвестный город", "Неизвестный регион"), null],
    [null, null],
    [{ success: true, country_code: "RU", city: {}, region: [] }, null],
  ])("maps %j to %s", (input, expected) => {
    expect(resolveDetectedRegion(input)).toBe(expected);
  });
});

describe("IP request resilience", () => {
  it("deduplicates requests, caches the suggestion and never selects it", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => location("Екатеринбург") });
    vi.stubGlobal("fetch", fetchMock);
    const { detectRegion } = await import("@/lib/detectRegion");
    expect(await Promise.all([detectRegion(), detectRegion()])).toEqual(["ekaterinburg", "ekaterinburg"]);
    expect(await detectRegion()).toBe("ekaterinburg");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem("selected_city")).toBeNull();
    vi.resetModules();
    expect(await (await import("@/lib/detectRegion")).detectRegion()).toBe("ekaterinburg");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it.each(["network", "quota", "invalid-json"])("falls back and caches %s failures", async (failure) => {
    const fetchMock = vi.fn().mockImplementation(async () => {
      if (failure === "network") throw new Error("Offline");
      return { ok: failure !== "quota", json: async () => { throw new Error("Invalid JSON"); } };
    });
    vi.stubGlobal("fetch", fetchMock);
    const { detectRegion } = await import("@/lib/detectRegion");
    expect(await detectRegion()).toBeNull();
    expect(await detectRegion()).toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("times out a hanging request and aborts it", async () => {
    vi.useFakeTimers();
    const fetchMock = vi.fn().mockImplementation(() => new Promise(() => {}));
    vi.stubGlobal("fetch", fetchMock);
    const { detectRegion } = await import("@/lib/detectRegion");
    const result = detectRegion();
    await vi.advanceTimersByTimeAsync(4000);
    expect(await result).toBeNull();
    expect(fetchMock.mock.calls[0][1].signal.aborted).toBe(true);
  });

  it("ignores expired and corrupt caches", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => location("Москва", "Москва") }));
    localStorage.setItem("geo_ip_suggestion_v1", JSON.stringify({ slug: "perm", expiresAt: Date.now() - 1 }));
    expect(await (await import("@/lib/detectRegion")).detectRegion()).toBe("moskva");
    vi.resetModules();
    localStorage.setItem("geo_ip_suggestion_v1", "broken");
    expect(await (await import("@/lib/detectRegion")).detectRegion()).toBe("moskva");
    expect(fetch).toHaveBeenCalledTimes(2);
  });
});
