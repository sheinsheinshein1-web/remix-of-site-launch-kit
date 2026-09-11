type MapPoint = {
  lat: number;
  lng: number;
};

type NominatimAddress = Record<string, unknown>;

type NominatimReverseResponse = {
  address?: NominatimAddress;
};

type ReverseGeocodingOptions = {
  endpoint?: string;
  fetcher?: typeof fetch;
};

const DEFAULT_REVERSE_GEOCODING_ENDPOINT = "https://nominatim.openstreetmap.org/reverse";
const locationCache = new Map<string, string | null>();

const firstAddressValue = (address: NominatimAddress, keys: string[]) => {
  for (const key of keys) {
    const value = address[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
};

const uniqueParts = (parts: string[]) => {
  const seen = new Set<string>();

  return parts.filter((part) => {
    if (!part) return false;
    const normalized = part.toLocaleLowerCase("ru-RU");
    if (seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  });
};

export const formatReverseGeocodingAddress = (address: NominatimAddress) => {
  const settlement = firstAddressValue(address, [
    "village",
    "town",
    "city",
    "municipality",
    "hamlet",
  ]);
  const localArea = firstAddressValue(address, [
    "suburb",
    "neighbourhood",
    "quarter",
    "city_district",
    "borough",
    "district",
  ]);
  const widerArea = firstAddressValue(address, ["county", "state_district", "state"]);
  const road = firstAddressValue(address, [
    "road",
    "pedestrian",
    "residential",
    "footway",
    "path",
  ]);

  const primaryParts = uniqueParts([settlement, localArea, road]);
  if (primaryParts.length >= 2) return primaryParts.slice(0, 3).join(", ");

  return uniqueParts([...primaryParts, widerArea]).slice(0, 3).join(", ");
};

export const formatApproximateMapLocation = (address: string | null, fallbackRegion: string) => (
  address
    ? `Примерный район: ${address} (радиус 3 км)`
    : `Примерный район: ${fallbackRegion} (точка выбрана на карте, радиус 3 км)`
);

export const reverseGeocodeMapPoint = async (
  point: MapPoint,
  options: ReverseGeocodingOptions = {},
) => {
  const cacheKey = `${point.lat.toFixed(4)},${point.lng.toFixed(4)}`;
  if (locationCache.has(cacheKey)) return locationCache.get(cacheKey) ?? null;

  const endpoint = options.endpoint
    ?? import.meta.env.VITE_REVERSE_GEOCODING_URL
    ?? DEFAULT_REVERSE_GEOCODING_ENDPOINT;
  const url = new URL(endpoint);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("lat", String(point.lat));
  url.searchParams.set("lon", String(point.lng));
  url.searchParams.set("zoom", "16");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("layer", "address");
  url.searchParams.set("accept-language", "ru");
  url.searchParams.set("email", "hello@mnogomesta.com");

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 6_000);

  try {
    const response = await (options.fetcher ?? fetch)(url, {
      headers: { Accept: "application/json" },
      referrerPolicy: "strict-origin-when-cross-origin",
      signal: controller.signal,
    });
    if (!response.ok) return null;

    const data = await response.json() as NominatimReverseResponse;
    const address = data.address ? formatReverseGeocodingAddress(data.address) : "";
    const result = address || null;
    locationCache.set(cacheKey, result);
    return result;
  } catch {
    return null;
  } finally {
    window.clearTimeout(timeoutId);
  }
};

