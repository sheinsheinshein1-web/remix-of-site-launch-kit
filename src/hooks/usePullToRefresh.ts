import { useEffect, useRef, useState, useCallback } from "react";

interface Options {
  onRefresh: () => void | Promise<void>;
  threshold?: number;
  maxPull?: number;
  enabled?: boolean;
}

/**
 * Pull-to-refresh для мобильной ленты. Активируется только когда window.scrollY === 0
 * И пользователь явно тянет вниз (delta > ACTIVATION_DELTA).
 * Не блокирует обычные тапы и скроллы.
 */
const ACTIVATION_DELTA = 12; // минимальный свайп вниз чтобы начать tracking

export function usePullToRefresh({ onRefresh, threshold = 70, maxPull = 110, enabled = true }: Options) {
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  // Все мутабельные значения держим в refs, чтобы не пересоздавать listeners
  const startYRef = useRef<number | null>(null);
  const pullRef = useRef(0);
  const activatedRef = useRef(false);
  const refreshingRef = useRef(false);
  const onRefreshRef = useRef(onRefresh);
  const rafRef = useRef<number | null>(null);

  // Держим actuall callback свежим без переподписки listeners
  useEffect(() => {
    onRefreshRef.current = onRefresh;
  }, [onRefresh]);

  useEffect(() => {
    refreshingRef.current = refreshing;
  }, [refreshing]);

  const updatePull = useCallback((value: number) => {
    pullRef.current = value;
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      setPull(pullRef.current);
    });
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const onTouchStart = (e: TouchEvent) => {
      if (window.scrollY > 0 || refreshingRef.current) {
        startYRef.current = null;
        return;
      }
      startYRef.current = e.touches[0].clientY;
      activatedRef.current = false;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (startYRef.current === null) return;
      const delta = e.touches[0].clientY - startYRef.current;

      // Активируем pull-to-refresh только если палец явно ушёл вниз
      if (!activatedRef.current) {
        if (delta < ACTIVATION_DELTA) return;
        activatedRef.current = true;
      }

      if (delta <= 0) {
        if (pullRef.current !== 0) updatePull(0);
        return;
      }
      const resisted = Math.min(maxPull, delta * 0.5);
      updatePull(resisted);
    };

    const onTouchEnd = () => {
      if (startYRef.current === null) return;
      const wasActivated = activatedRef.current;
      const current = pullRef.current;
      startYRef.current = null;
      activatedRef.current = false;

      // Если palец почти не двигался — игнорируем (это был тап)
      if (!wasActivated) return;

      if (current >= threshold) {
        setRefreshing(true);
        updatePull(threshold);
        Promise.resolve(onRefreshRef.current()).finally(() => {
          setRefreshing(false);
          updatePull(0);
        });
      } else {
        updatePull(0);
      }
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [enabled, threshold, maxPull, updatePull]);

  return { pull, refreshing };
}
