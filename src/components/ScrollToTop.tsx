import { useLayoutEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

/**
 * Сбрасывает скролл наверх при PUSH-навигации.
 * При POP (нажатие "Назад" в браузере) скролл не трогаем —
 * страницы со своей логикой восстановления (главная) сами вернут позицию.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();

  useLayoutEffect(() => {
    if (navigationType === "POP") return;
    window.scrollTo({ top: 0, left: 0 });
  }, [pathname, navigationType]);

  return null;
};

export default ScrollToTop;
