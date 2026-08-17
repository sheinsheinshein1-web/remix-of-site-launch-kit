import { allRegions, regionGroups, regions, regionsBySlug, type Region } from "@/data/regions";
import { getCityDisplayName } from "@/lib/cityDisplay";

export const ALL_REGIONS_GEO_SLUG = "all";
export const ALL_REGIONS_GEO_LABEL = "Все регионы";
export const DEFAULT_GEO_SLUG = ALL_REGIONS_GEO_SLUG;

const normalizeLookupValue = (value: string) => value.trim().toLocaleLowerCase("ru");

export const isAllRegionsGeo = (value?: string | null) => {
  if (!value) return true;
  const normalized = normalizeLookupValue(value);
  return normalized === ALL_REGIONS_GEO_SLUG || normalized === "все регионы";
};

const getRegionSearchValues = (region: Region) => [
  region.name,
  region.catalogRegionLabel,
  ...(region.searchAliases ?? []),
  ...(!region.baseRegionSlug ? [region.cityValue, ...(region.cityValues ?? [])] : []),
].filter((candidate): candidate is string => Boolean(candidate));

/**
 * Единая точка разрешения географии интерфейса.
 *
 * Новые значения хранятся как уникальные slug из allRegions. Поддержка старых
 * cityValue и отображаемых названий нужна только для бесшовной миграции
 * localStorage и старых ссылок вида ?region=Москва+и+МО.
 */
export const resolveGeoSelection = (value?: string | null): Region | undefined => {
  if (isAllRegionsGeo(value)) return undefined;

  const directSlugMatch = regionsBySlug[value];
  if (directSlugMatch) return directSlugMatch;

  const normalized = normalizeLookupValue(value);

  // Для старых региональных значений выбираем базовую страницу, а не один из
  // дочерних городов с тем же cityValue.
  const baseRegionMatch = regions.find((region) =>
    [region.cityValue, ...(region.cityValues ?? [])]
      .some((candidate) => normalizeLookupValue(candidate) === normalized),
  );
  if (baseRegionMatch) return baseRegionMatch;

  return allRegions.find((region) =>
    getRegionSearchValues(region)
      .some((candidate) => normalizeLookupValue(candidate) === normalized),
  );
};

/** География доставки конкретного проекта: базовый регион, область и ближайшие города. */
export const getProjectDeliveryRegions = (
  projectCity?: string | null,
  deliveryRegionSlugs?: string[],
): Region[] => {
  if (deliveryRegionSlugs?.length) {
    return deliveryRegionSlugs
      .map((slug) => regionsBySlug[slug])
      .filter((region): region is Region => Boolean(region));
  }

  const projectRegion = resolveGeoSelection(projectCity);
  const baseRegionSlug = projectRegion?.baseRegionSlug ?? projectRegion?.slug;
  const group = regionGroups.find((candidate) => candidate.slug === baseRegionSlug);

  return group?.cities ?? (projectRegion ? [projectRegion] : []);
};

/** Проверяет доступность доставки проекта в выбранный пользователем регион. */
export const isProjectAvailableInGeo = (
  projectCity?: string | null,
  selectedGeo?: string | null,
  deliveryRegionSlugs?: string[],
) => {
  if (isAllRegionsGeo(selectedGeo)) return true;

  const selectedRegion = resolveGeoSelection(selectedGeo);
  if (!selectedRegion) return false;

  return getProjectDeliveryRegions(projectCity, deliveryRegionSlugs)
    .some((region) => region.slug === selectedRegion.slug);
};

/** Поиск городов и административных регионов для общих поисковых интерфейсов. */
export const searchGeoSelections = (query: string, limit = 5): Region[] => {
  const normalized = normalizeLookupValue(query);
  if (!normalized) return [];

  const words = normalized.split(/\s+/).filter(Boolean);

  return allRegions
    .map((region, index) => {
      const values = getRegionSearchValues(region).map(normalizeLookupValue);
      const exactMatch = values.some((value) => value === normalized);
      const startsWithMatch = values.some((value) => value.startsWith(normalized));
      const wordMatch = words.every((word) => values.some((value) => value.includes(word)));

      return {
        region,
        index,
        score: exactMatch ? 0 : startsWithMatch ? 1 : wordMatch ? 2 : Number.POSITIVE_INFINITY,
      };
    })
    .filter(({ score }) => Number.isFinite(score))
    .sort((first, second) => first.score - second.score || first.index - second.index)
    .slice(0, limit)
    .map(({ region }) => region);
};

export const normalizeGeoSelection = (value?: string | null) => {
  if (isAllRegionsGeo(value)) return ALL_REGIONS_GEO_SLUG;
  return resolveGeoSelection(value)?.slug ?? DEFAULT_GEO_SLUG;
};

export const getGeoSelectionLabel = (value?: string | null) => {
  if (isAllRegionsGeo(value)) return ALL_REGIONS_GEO_LABEL;
  return resolveGeoSelection(value)?.name ?? getCityDisplayName(value || ALL_REGIONS_GEO_LABEL);
};

/** Название после направления «в»: «в Уфу», «в Московскую область». */
export const getGeoSelectionAccusative = (value?: string | null) =>
  (isAllRegionsGeo(value) ? ALL_REGIONS_GEO_LABEL.toLocaleLowerCase("ru") : getGeoSelectionLabel(value))
    .split(/(\s+|-)/)
    .map((word) => {
      if (/ая$/u.test(word)) return word.replace(/ая$/u, "ую");
      if (/яя$/u.test(word)) return word.replace(/яя$/u, "юю");
      if (/а$/u.test(word)) return word.replace(/а$/u, "у");
      if (/я$/u.test(word)) return word.replace(/я$/u, "ю");
      return word;
    })
    .join("");

/** Значение, по которому существующие проекты и производители привязаны к гео. */
export const getGeoSelectionCityValue = (value?: string | null) => {
  if (isAllRegionsGeo(value)) return ALL_REGIONS_GEO_SLUG;
  return resolveGeoSelection(value)?.cityValue ?? value ?? ALL_REGIONS_GEO_SLUG;
};

export const getGeoSelectionPrepositional = (value?: string | null) => {
  if (isAllRegionsGeo(value)) return "во всех регионах";
  return resolveGeoSelection(value)?.namePrepositional ?? `в ${getGeoSelectionLabel(value)}`;
};
