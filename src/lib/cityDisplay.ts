import { allRegions } from "@/data/regions";

const CITY_DISPLAY_NAMES: Record<string, string> = {
  "Москва и МО": "Москва",
  "Санкт-Петербург и ЛО": "Санкт-Петербург",
  "Краснодарский край": "Краснодар",
  "Пермский край": "Пермь",
  "Алтайский край": "Барнаул",
  "Кемеровская область": "Кемерово",
  "Ростовская область": "Ростов-на-Дону",
};

export const getCityDisplayName = (city: string) => CITY_DISPLAY_NAMES[city] ?? city;

/**
 * Возвращает географию в форме, подходящей для фраз вроде
 * «Другие проекты в Москве». Формы берутся из единого геореестра.
 */
export const getCityPrepositionalName = (city: string) => {
  const displayName = getCityDisplayName(city);
  const region = allRegions.find((candidate) =>
    candidate.cityValue === city
    || candidate.name === city
    || candidate.catalogRegionLabel === city
    || candidate.name === displayName,
  );

  return region?.namePrepositional ?? `в ${displayName}`;
};

/**
 * Сравнивает старые региональные значения по их единому названию в интерфейсе.
 * Например, «Санкт-Петербург и ЛО» и «Санкт-Петербург» считаются одним регионом.
 */
export const isSameCityRegion = (first: string, second: string) =>
  getCityDisplayName(first) === getCityDisplayName(second);

/** Ставит географию выбранного региона выше остальных, сохраняя их внутренний порядок. */
export const compareCityRegionPriority = (
  firstCity: string,
  secondCity: string,
  selectedCity: string,
) => Number(isSameCityRegion(secondCity, selectedCity)) - Number(isSameCityRegion(firstCity, selectedCity));
