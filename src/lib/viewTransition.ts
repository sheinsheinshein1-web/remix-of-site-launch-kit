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

  // Гарантируем, что новая страница откроется сверху (особенно когда React Router
  // переиспользует тот же маршрут /project/:id и не размонтирует компонент).
  const resetScroll = () => window.scrollTo(0, 0);

  const imgEl = (e.currentTarget as HTMLElement).querySelector("img");
  if (imgEl && (document as any).startViewTransition) {
    // Снимаем view-transition-name с любых уже существующих элементов на странице,
    // иначе при переходе /project/:id → /project/:id будет конфликт двух элементов
    // с одним и тем же именем — браузер тихо отменит анимацию.
    const previous = document.querySelectorAll<HTMLElement>('[style*="view-transition-name"]');
    const cleared: HTMLElement[] = [];
    previous.forEach((el) => {
      if (el !== imgEl && el.style.viewTransitionName) {
        el.style.viewTransitionName = "";
        cleared.push(el);
      }
    });

    imgEl.style.viewTransitionName = "project-hero";
    const transition = (document as any).startViewTransition(() => {
      imgEl.style.viewTransitionName = "";
      flushSync(() => {
        navigate(path);
      });
      resetScroll();
    });
    // На всякий случай — после завершения транзишна
    transition?.finished?.finally?.(() => {
      resetScroll();
    });
  } else {
    navigate(path);
    resetScroll();
  }
}
