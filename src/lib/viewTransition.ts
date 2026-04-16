import { flushSync } from "react-dom";
import type { NavigateFunction } from "react-router-dom";

export function navigateWithTransition(
  e: React.MouseEvent<HTMLElement>,
  navigate: NavigateFunction,
  path: string
) {
  const imgEl = (e.currentTarget as HTMLElement).querySelector("img");
  if (imgEl && (document as any).startViewTransition) {
    imgEl.style.viewTransitionName = "project-hero";
    (document as any).startViewTransition(() => {
      imgEl.style.viewTransitionName = "";
      flushSync(() => navigate(path));
    });
  } else {
    navigate(path);
  }
}

export function navigateBackWithTransition(navigate: NavigateFunction, projectId?: number) {
  if ((document as any).startViewTransition) {
    if (projectId) {
      sessionStorage.setItem("vt-back-project", String(projectId));
    }
    (document as any).startViewTransition(() => {
      flushSync(() => navigate(-1));
    });
  } else {
    navigate(-1);
  }
}

/**
 * Call on mount in list pages (FeaturedProjects, Catalog, Favorites)
 * to set viewTransitionName on the card image that was navigated from,
 * so the back-morph transition has a matching target.
 */
export function applyBackTransitionName() {
  const id = sessionStorage.getItem("vt-back-project");
  if (!id) return;
  sessionStorage.removeItem("vt-back-project");
  // Find all project card links and match by href or data attribute
  // We use a small timeout to let React render first
  requestAnimationFrame(() => {
    const cards = document.querySelectorAll<HTMLElement>(`[data-project-id="${id}"]`);
    cards.forEach((card) => {
      const img = card.querySelector("img");
      if (img) {
        img.style.viewTransitionName = "project-hero";
        // Clean up after transition completes
        setTimeout(() => {
          img.style.viewTransitionName = "";
        }, 500);
      }
    });
  });
}
