import { flushSync } from "react-dom";
import type { NavigateFunction } from "react-router-dom";

const BACK_TRANSITION_KEY = "vt-back-project";

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
  if (projectId) {
    sessionStorage.setItem(BACK_TRANSITION_KEY, String(projectId));
  }

  if ((document as any).startViewTransition) {
    (document as any).startViewTransition(() => {
      flushSync(() => navigate(-1));
    });
  } else {
    navigate(-1);
  }
}

export function getBackTransitionProjectId() {
  const value = sessionStorage.getItem(BACK_TRANSITION_KEY);
  if (!value) return null;

  const projectId = Number(value);
  return Number.isNaN(projectId) ? null : projectId;
}

export function clearBackTransitionProjectId() {
  sessionStorage.removeItem(BACK_TRANSITION_KEY);
}
