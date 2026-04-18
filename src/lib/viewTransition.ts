import { flushSync } from "react-dom";
import type { NavigateFunction } from "react-router-dom";

export function navigateWithTransition(
  e: React.MouseEvent<HTMLElement>,
  navigate: NavigateFunction,
  path: string
) {
  // Если клик с модификаторами или средней кнопкой — пусть браузер откроет в новой вкладке
  const me = e as unknown as React.MouseEvent<HTMLAnchorElement>;
  if (me.metaKey || me.ctrlKey || me.shiftKey || me.altKey || me.button === 1) {
    return;
  }
  // Предотвращаем нативную навигацию по <a href>, чтобы не было двойной записи в history
  e.preventDefault();

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
