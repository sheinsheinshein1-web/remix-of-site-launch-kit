export const COOKIE_CONSENT_STORAGE_KEY = "mnogo_mesta_cookie_consent";
export const COOKIE_CONSENT_VERSION = 1;
export const COOKIE_CONSENT_CHANGED_EVENT = "mnogo-mesta:cookie-consent-changed";
export const COOKIE_SETTINGS_OPEN_EVENT = "mnogo-mesta:cookie-settings-open";

export type CookieConsentChoice = "all" | "necessary";

export type CookieConsent = {
  version: number;
  choice: CookieConsentChoice;
  updatedAt: string;
};

const isCookieConsent = (value: unknown): value is CookieConsent => {
  if (!value || typeof value !== "object") return false;
  const consent = value as Partial<CookieConsent>;
  return consent.version === COOKIE_CONSENT_VERSION
    && (consent.choice === "all" || consent.choice === "necessary")
    && typeof consent.updatedAt === "string";
};

export const getCookieConsent = (): CookieConsent | null => {
  if (typeof window === "undefined") return null;

  try {
    const stored = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    if (!stored) return null;
    const parsed: unknown = JSON.parse(stored);
    return isCookieConsent(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

export const saveCookieConsent = (choice: CookieConsentChoice): CookieConsent => {
  const consent: CookieConsent = {
    version: COOKIE_CONSENT_VERSION,
    choice,
    updatedAt: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(consent));
    } catch {
      // Выбор продолжает действовать в текущем интерфейсе, даже если хранилище недоступно.
    }
    window.dispatchEvent(new CustomEvent<CookieConsent>(COOKIE_CONSENT_CHANGED_EVENT, { detail: consent }));
  }

  return consent;
};

export const hasAnalyticsCookieConsent = () => getCookieConsent()?.choice === "all";

export const openCookieSettings = () => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(COOKIE_SETTINGS_OPEN_EVENT));
};
