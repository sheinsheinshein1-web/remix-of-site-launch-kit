const STORAGE_PREFIX = "mm-scroll-position:";
const scrollPositions = new Map<string, number>();

export const getSavedScrollPosition = (locationKey: string) => {
  const memoryPosition = scrollPositions.get(locationKey);
  if (memoryPosition !== undefined) return memoryPosition;
  if (typeof window === "undefined") return undefined;

  try {
    const stored = window.sessionStorage.getItem(`${STORAGE_PREFIX}${locationKey}`);
    if (stored === null) return undefined;
    const position = Number.parseInt(stored, 10);
    if (!Number.isFinite(position) || position < 0) return undefined;
    scrollPositions.set(locationKey, position);
    return position;
  } catch {
    return undefined;
  }
};

export const saveScrollPosition = (locationKey: string, position: number) => {
  const normalizedPosition = Math.max(0, Math.round(position));
  scrollPositions.set(locationKey, normalizedPosition);

  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.setItem(`${STORAGE_PREFIX}${locationKey}`, String(normalizedPosition));
  } catch {
    // Память вкладки остаётся резервным хранилищем, если sessionStorage недоступен.
  }
};
