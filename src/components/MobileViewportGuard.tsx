import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  prepareForMobileNavigation,
  resetHorizontalViewport,
} from "@/lib/mobileViewport";

const isInternalLink = (link: HTMLAnchorElement) => {
  if (link.hasAttribute("download") || link.target === "_blank") return false;

  try {
    return new URL(link.href, window.location.href).origin === window.location.origin;
  } catch {
    return false;
  }
};

/**
 * Shared guard for iOS Safari: start dismissing the keyboard before an internal
 * navigation and keep every newly rendered route aligned to the layout viewport.
 */
const MobileViewportGuard = () => {
  const location = useLocation();

  useEffect(() => {
    const prepareFromPointer = (event: PointerEvent) => {
      if (!(event.target instanceof Element)) return;

      const link = event.target.closest<HTMLAnchorElement>("a[href]");
      const markedNavigation = event.target.closest<HTMLElement>("[data-mobile-navigation]");
      if ((link && isInternalLink(link)) || markedNavigation) {
        prepareForMobileNavigation();
      }
    };

    const prepareFromSubmit = () => prepareForMobileNavigation();

    document.addEventListener("pointerdown", prepareFromPointer, true);
    document.addEventListener("submit", prepareFromSubmit, true);
    return () => {
      document.removeEventListener("pointerdown", prepareFromPointer, true);
      document.removeEventListener("submit", prepareFromSubmit, true);
    };
  }, []);

  useLayoutEffect(() => {
    prepareForMobileNavigation();

    // A second pass catches the frame where Safari updates visualViewport after
    // the software keyboard or a Radix/Vaul overlay has finished closing.
    let secondFrame = 0;
    const firstFrame = window.requestAnimationFrame(() => {
      resetHorizontalViewport();
      secondFrame = window.requestAnimationFrame(resetHorizontalViewport);
    });

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
    };
  }, [location.key]);

  return null;
};

export default MobileViewportGuard;
