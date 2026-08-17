import { getCityDisplayName } from "@/lib/cityDisplay";

const GEO_PRIORITY: Record<string, number> = {
  "Москва": 0,
  "Санкт-Петербург": 1,
};

export const getGeoPriority = (name: string) =>
  GEO_PRIORITY[getCityDisplayName(name).trim()] ?? Number.POSITIVE_INFINITY;

/**
 * Москва и Санкт-Петербург всегда открывают географический список.
 * Для остальных значений сохраняется переданный порядок сортировки.
 */
export const compareGeoNames = (
  first: string,
  second: string,
  compareRest: (first: string, second: string) => number = () => 0,
) => {
  const firstPriority = getGeoPriority(first);
  const secondPriority = getGeoPriority(second);
  const priorityDifference = firstPriority - secondPriority;
  if (Number.isFinite(priorityDifference) && priorityDifference !== 0) return priorityDifference;
  if (Number.isFinite(firstPriority) !== Number.isFinite(secondPriority)) {
    return Number.isFinite(firstPriority) ? -1 : 1;
  }
  return compareRest(first, second);
};

export const sortGeoItems = <T>(
  items: readonly T[],
  getName: (item: T) => string,
  compareRest: (first: T, second: T) => number = () => 0,
) => [...items].sort((first, second) => (
  compareGeoNames(
    getName(first),
    getName(second),
    () => compareRest(first, second),
  )
));
