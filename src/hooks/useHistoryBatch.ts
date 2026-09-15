import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

type HistoryBatchOptions = {
  namespace: string;
  identity: string;
  itemCount: number;
  initialCount: number;
  batchSize: number;
};

type BatchState = {
  storageKey: string;
  visibleCount: number;
};

const readVisibleCount = (storageKey: string, initialCount: number, itemCount: number) => {
  const fallback = Math.min(initialCount, itemCount);
  if (typeof window === "undefined") return fallback;

  try {
    const storedCount = Number.parseInt(window.sessionStorage.getItem(storageKey) ?? "", 10);
    if (Number.isFinite(storedCount) && storedCount >= initialCount) {
      return Math.min(storedCount, itemCount);
    }
  } catch {
    // Начальная пачка остаётся запасным вариантом без sessionStorage.
  }

  return fallback;
};

export const useHistoryBatch = ({
  namespace,
  identity,
  itemCount,
  initialCount,
  batchSize,
}: HistoryBatchOptions) => {
  const { key: locationKey } = useLocation();
  const storageKey = useMemo(
    () => `mm-history-batch:${namespace}:${locationKey}:${identity}`,
    [identity, locationKey, namespace],
  );
  const [state, setState] = useState<BatchState>(() => ({
    storageKey,
    visibleCount: readVisibleCount(storageKey, initialCount, itemCount),
  }));

  const visibleCount = state.storageKey === storageKey
    ? Math.min(state.visibleCount, itemCount)
    : readVisibleCount(storageKey, initialCount, itemCount);

  useEffect(() => {
    if (state.storageKey !== storageKey) {
      setState({
        storageKey,
        visibleCount: readVisibleCount(storageKey, initialCount, itemCount),
      });
    }
  }, [initialCount, itemCount, state.storageKey, storageKey]);

  useEffect(() => {
    if (state.storageKey !== storageKey) return;

    try {
      window.sessionStorage.setItem(storageKey, String(visibleCount));
    } catch {
      // Пагинация текущего монтирования продолжает работать без sessionStorage.
    }
  }, [state.storageKey, storageKey, visibleCount]);

  const loadNextBatch = useCallback(() => {
    setState((current) => {
      const currentCount = current.storageKey === storageKey
        ? Math.min(current.visibleCount, itemCount)
        : readVisibleCount(storageKey, initialCount, itemCount);

      return {
        storageKey,
        visibleCount: Math.min(currentCount + batchSize, itemCount),
      };
    });
  }, [batchSize, initialCount, itemCount, storageKey]);

  return { visibleCount, loadNextBatch };
};
