import type { NavigateFunction } from "react-router-dom";

// View Transitions временно отключены — давали лаг и мигание на мобиле
// при тяжёлом DOM. Вернём в нативном приложении (shared element transition).
export function navigateWithTransition(
  e: React.MouseEvent<HTMLElement>,
  navigate: NavigateFunction,
  path: string
) {
  const me = e as unknown as React.MouseEvent<HTMLAnchorElement>;
  if (me.metaKey || me.ctrlKey || me.shiftKey || me.altKey || me.button === 1) {
    return;
  }
  e.preventDefault();
  navigate(path);
  window.scrollTo(0, 0);
}
