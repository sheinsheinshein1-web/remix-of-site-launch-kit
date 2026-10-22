import { act, cleanup, fireEvent, render, renderHook, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import RegionSuggestion from "@/components/RegionSuggestion";
import { useCity } from "@/components/CitySelector";

const detect = vi.hoisted(() => vi.fn());
vi.mock("@/lib/detectRegion", () => ({ detectRegion: detect }));

beforeEach(() => {
  localStorage.clear(); sessionStorage.clear(); vi.resetModules();
  detect.mockReset().mockResolvedValue("ekaterinburg");
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe("region suggestion", () => {
  it("does not personalize static SEO pages during prerender", async () => {
    vi.spyOn(navigator, "userAgent", "get").mockReturnValue("PrerenderBot/1.0 (+mnogomesta)");
    const { useRegionSuggestion } = await import("@/hooks/useRegionSuggestion");
    expect(renderHook(() => useRegionSuggestion(false)).result.current.suggestion).toBeNull();
    expect(detect).not.toHaveBeenCalled();
  });

  it.each(["moskva", "all"])("does not look up or replace an explicit choice: %s", async (slug) => {
    const { useRegionSuggestion } = await import("@/hooks/useRegionSuggestion");
    localStorage.setItem("geo_selection_version", "2");
    localStorage.setItem("selected_city", slug);
    localStorage.setItem("city_auto_detected", slug === "all" ? "all-regions" : "manual");
    const { result } = renderHook(() => {
      const selection = useCity();
      return { ...selection, ...useRegionSuggestion(selection.hasExplicitSelection) };
    });
    expect(result.current.city).toBe(slug);
    expect(result.current.suggestion).toBeNull();
    expect(detect).not.toHaveBeenCalled();
  });

  it("ignores a late result after a manual selection", async () => {
    let resolve: (slug: string) => void;
    detect.mockReturnValue(new Promise<string>((done) => { resolve = done; }));
    const { useRegionSuggestion } = await import("@/hooks/useRegionSuggestion");
    const { result } = renderHook(() => {
      const selection = useCity();
      return { ...selection, ...useRegionSuggestion(selection.hasExplicitSelection) };
    });
    act(() => result.current.selectCity("perm"));
    await act(async () => resolve!("ekaterinburg"));
    expect(result.current.city).toBe("perm");
    expect(result.current.suggestion).toBeNull();
  });

  it("confirms the detected region and persists it for another visit", async () => {
    const { useRegionSuggestion } = await import("@/hooks/useRegionSuggestion");
    function Fixture() {
      const { city, selectCity, hasExplicitSelection } = useCity();
      const { suggestion, dismiss } = useRegionSuggestion(hasExplicitSelection);
      return <RegionSuggestion suggestion={suggestion} onConfirm={selectCity} onChange={dismiss} onDismiss={dismiss}>
        <button>{city}</button>
      </RegionSuggestion>;
    }
    const view = render(<Fixture />);
    await screen.findByRole("dialog", { name: "Ваш регион — Екатеринбург?" });
    expect(localStorage.getItem("selected_city")).toBe("all");
    fireEvent.click(screen.getByRole("button", { name: "Да, верно" }));
    expect(localStorage.getItem("selected_city")).toBe("ekaterinburg");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    view.unmount();
    const { result } = renderHook(() => useCity());
    expect(result.current.city).toBe("ekaterinburg");
    expect(result.current.hasExplicitSelection).toBe(true);
  });

  it("dismisses for the session without selecting all regions permanently", async () => {
    const { useRegionSuggestion } = await import("@/hooks/useRegionSuggestion");
    const { result, unmount } = renderHook(() => useRegionSuggestion(false));
    await waitFor(() => expect(result.current.suggestion).toBe("ekaterinburg"));
    act(() => result.current.dismiss());
    expect(result.current.suggestion).toBeNull();
    expect(localStorage.getItem("city_auto_detected")).toBeNull();
    unmount();
    vi.resetModules();
    const { useRegionSuggestion: remounted } = await import("@/hooks/useRegionSuggestion");
    expect(renderHook(() => remounted(false)).result.current.suggestion).toBeNull();
    expect(detect).toHaveBeenCalledTimes(1);
  });

  it("offers the manual selector through Change", () => {
    const onChange = vi.fn();
    render(<RegionSuggestion suggestion="ekaterinburg" onConfirm={vi.fn()} onDismiss={vi.fn()} onChange={onChange}>
      <button>Выберите регион</button>
    </RegionSuggestion>);
    fireEvent.click(screen.getByRole("button", { name: "Изменить" }));
    expect(onChange).toHaveBeenCalledOnce();
  });
});
