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

export function navigateBackWithTransition(navigate: NavigateFunction) {
  if ((document as any).startViewTransition) {
    (document as any).startViewTransition(() => {
      flushSync(() => navigate(-1));
    });
  } else {
    navigate(-1);
  }
}
