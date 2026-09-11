const MOBILE_LAYOUT_QUERY = "(max-width: 767px)";

export const isMobileLayout = () => (
  typeof window !== "undefined"
  && (window.matchMedia(MOBILE_LAYOUT_QUERY).matches || window.innerWidth < 768)
);

export const blurActiveFormControl = () => {
  if (typeof document === "undefined") return;

  const activeElement = document.activeElement;
  if (
    activeElement instanceof HTMLInputElement
    || activeElement instanceof HTMLTextAreaElement
    || activeElement instanceof HTMLSelectElement
    || (activeElement instanceof HTMLElement && activeElement.isContentEditable)
  ) {
    activeElement.blur();
  }
};

export const resetHorizontalViewport = () => {
  if (typeof window === "undefined" || !isMobileLayout()) return;

  window.scrollTo({
    top: window.scrollY,
    left: 0,
    behavior: "auto",
  });
};

export const prepareForMobileNavigation = () => {
  if (!isMobileLayout()) return;
  blurActiveFormControl();
  resetHorizontalViewport();
};

/**
 * Mobile Safari needs one paint after an input is blurred or a modal is closed.
 * Navigating in the same frame can carry the old visual viewport into the next route.
 */
export const runAfterMobileViewportRelease = (callback: () => void) => {
  if (typeof window === "undefined" || !isMobileLayout()) {
    callback();
    return undefined;
  }

  prepareForMobileNavigation();
  return window.requestAnimationFrame(callback);
};
