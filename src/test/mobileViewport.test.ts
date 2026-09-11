import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  blurActiveFormControl,
  prepareForMobileNavigation,
  runAfterMobileViewportRelease,
} from "@/lib/mobileViewport";

describe("mobile viewport navigation guard", () => {
  let requestFrame: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 390 });
    requestFrame = vi.fn((callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });
    vi.stubGlobal("requestAnimationFrame", requestFrame);
    vi.spyOn(window, "scrollTo").mockImplementation(() => undefined);
  });

  afterEach(() => {
    document.body.replaceChildren();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("removes focus from an active mobile search field", () => {
    const input = document.createElement("input");
    document.body.append(input);
    input.focus();

    blurActiveFormControl();

    expect(document.activeElement).toBe(document.body);
  });

  it("realigns horizontal scroll before mobile navigation", () => {
    prepareForMobileNavigation();

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: window.scrollY,
      left: 0,
      behavior: "auto",
    });
  });

  it("runs mobile navigation after a paint", () => {
    const callback = vi.fn();

    runAfterMobileViewportRelease(callback);

    expect(requestFrame).toHaveBeenCalledOnce();
    expect(callback).toHaveBeenCalledOnce();
  });
});
