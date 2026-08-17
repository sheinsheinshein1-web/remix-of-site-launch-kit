type MapCoordinates = {
  lat: number;
  lon: number;
};

type ManufacturerMapOptions = {
  address?: string;
  city?: string;
  coordinates?: MapCoordinates;
};

const normalizeMapPart = (value?: string) => value?.replace(/\s+/g, " ").trim() ?? "";

export const getManufacturerMapQuery = (address?: string, city?: string) => {
  const normalizedAddress = normalizeMapPart(address);
  const normalizedCity = normalizeMapPart(city);

  if (!normalizedAddress) return normalizedCity;

  // Номер офиса нужен в контактах, но мешает геокодеру найти сам дом.
  const streetAddress = normalizedAddress
    .replace(/,\s*(?:офис|оф\.?|помещение|пом\.?|кабинет)\s+[^,]+$/iu, "")
    .trim();

  if (!normalizedCity) return streetAddress;

  const cityName = normalizedCity.replace(/^г\.?\s*/iu, "").trim().toLocaleLowerCase("ru-RU");
  const addressAlreadyHasCity = streetAddress.toLocaleLowerCase("ru-RU").includes(cityName);

  return addressAlreadyHasCity ? streetAddress : `${normalizedCity}, ${streetAddress}`;
};

export const getManufacturerMapUrls = ({ address, city, coordinates }: ManufacturerMapOptions) => {
  if (coordinates) {
    const point = `${coordinates.lon}%2C${coordinates.lat}`;
    return {
      embedUrl: `https://yandex.ru/map-widget/v1/?ll=${point}&z=16&l=map&pt=${point}%2Cpm2blm`,
      externalUrl: `https://yandex.ru/maps/?ll=${point}&z=17&pt=${point}%2Cpm2blm`,
      query: getManufacturerMapQuery(address, city),
    };
  }

  const query = getManufacturerMapQuery(address, city);
  return {
    embedUrl: query
      ? `https://yandex.ru/map-widget/v1/?mode=search&text=${encodeURIComponent(query)}&z=16`
      : undefined,
    externalUrl: query
      ? `https://yandex.ru/maps/?mode=search&text=${encodeURIComponent(query)}`
      : undefined,
    query,
  };
};
