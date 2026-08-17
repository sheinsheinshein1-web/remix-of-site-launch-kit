import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  COOKIE_CONSENT_CHANGED_EVENT,
  COOKIE_CONSENT_STORAGE_KEY,
  COOKIE_CONSENT_VERSION,
  getCookieConsent,
  hasAnalyticsCookieConsent,
  saveCookieConsent,
} from "@/lib/cookieConsent";

describe("cookie consent storage", () => {
  beforeEach(() => window.localStorage.clear());

  it("returns null until the user makes a choice", () => {
    expect(getCookieConsent()).toBeNull();
    expect(hasAnalyticsCookieConsent()).toBe(false);
  });

  it("stores the necessary-only choice without enabling analytics", () => {
    const consent = saveCookieConsent("necessary");

    expect(consent.version).toBe(COOKIE_CONSENT_VERSION);
    expect(getCookieConsent()?.choice).toBe("necessary");
    expect(hasAnalyticsCookieConsent()).toBe(false);
  });

  it("stores and announces analytics consent", () => {
    const listener = vi.fn();
    window.addEventListener(COOKIE_CONSENT_CHANGED_EVENT, listener);

    saveCookieConsent("all");

    expect(hasAnalyticsCookieConsent()).toBe(true);
    expect(listener).toHaveBeenCalledOnce();
    window.removeEventListener(COOKIE_CONSENT_CHANGED_EVENT, listener);
  });

  it("ignores consent from an outdated version", () => {
    window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify({
      version: COOKIE_CONSENT_VERSION - 1,
      choice: "all",
      updatedAt: new Date().toISOString(),
    }));

    expect(getCookieConsent()).toBeNull();
  });
});
