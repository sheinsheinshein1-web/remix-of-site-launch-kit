import { useEffect, useRef, useState } from "react";

interface Options {
  onRefresh: () => void | Promise<void>;
  threshold?: number; // px to trigger
  maxPull?: number; // visual cap
  enabled?: boolean;
}

/**
 * Pull-to-refresh для мобильной ленты. Активируется только когда window.scrollY === 0.
 * Возвращает текущее смещение (для индикатора) и состояние "refreshing".
 */
export function usePullToRefresh({ onRefresh, threshold = 70, maxPull = 110, enabled = true }: Options) {
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef<number | null>(null);
  const tracking = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    const onTouchStart = (e: TouchEvent) => {
      if (window.scrollY > 0 || refreshing) return;
      startY.current = e.touches[0].clientY;
      tracking.current = true;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!tracking.current || startY.current === null) return;
      const delta = e.touches[0].clientY - startY.current;
      if (delta <= 0) {
        setPull(0);
        return;
      }
      // Резистанс: чем дальше тянешь, тем медленнее
      const resisted = Math.min(maxPull, delta * 0.5);
      setPull(resisted);
    };

    const onTouchEnd = async () => {
      if (!tracking.current) return;
      tracking.current = false;
      const current = pull;
      startY.current = null;

      if (current >= threshold) {
        setRefreshing(true);
        setPull(threshold);
        try {
          await onRefresh();
        } finally {
          setRefreshing(false);
          setPull(0);
        }
      } else {
        setPull(0);
      }
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);

    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [enabled, threshold, maxPull, onRefresh, pull, refreshing]);

  return { pull, refreshing };
}
