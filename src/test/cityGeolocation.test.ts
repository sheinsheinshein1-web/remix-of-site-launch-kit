import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useCity } from "@/components/CitySelector";

beforeEach(() => {
  localStorage.clear();
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));
});

describe("geo selection", () => {
  it("defaults to all regions without making an IP request", () => {
    const { result } = renderHook(() => useCity());

    expect(result.current.city).toBe("all");
    expect(localStorage.getItem("selected_city")).toBe("all");
    expect(fetch).not.toHaveBeenCalled();
  });

  it("keeps a region explicitly selected by the user", () => {
    const { result } = renderHook(() => useCity());

    act(() => result.current.selectCity("moskva"));

    expect(result.current.city).toBe("moskva");
    expect(localStorage.getItem("selected_city")).toBe("moskva");
    expect(localStorage.getItem("city_auto_detected")).toBe("manual");
  });

  it("resets a legacy selection that could have been saved by opening a regional page", () => {
    localStorage.setItem("selected_city", "perm");
    localStorage.setItem("city_auto_detected", "manual");

    const { result } = renderHook(() => useCity());

    expect(result.current.city).toBe("all");
    expect(result.current.hasExplicitSelection).toBe(false);
    expect(localStorage.getItem("selected_city")).toBe("all");
    expect(localStorage.getItem("city_auto_detected")).toBeNull();
    expect(localStorage.getItem("geo_selection_version")).toBe("2");
  });

  it("keeps a user selection saved by the current geo logic", () => {
    localStorage.setItem("selected_city", "perm");
    localStorage.setItem("city_auto_detected", "manual");
    localStorage.setItem("geo_selection_version", "2");

    const { result } = renderHook(() => useCity());

    expect(result.current.city).toBe("perm");
    expect(result.current.hasExplicitSelection).toBe(true);
  });
});
