import { allRegions } from "@/data/regions";

const CACHE_KEY = "geo_ip_suggestion_v1";
const CACHE_TTL = 6 * 60 * 60 * 1000;
const FAILURE_TTL = 30 * 60 * 1000;
const REQUEST_TIMEOUT = 4000;

const normalize = (value: string) => value.trim().toLocaleLowerCase("ru")
  .replace(/ё/g, "е").replace(/[–—]/g, "-").replace(/\s+/g, " ");

/** Only suggest locations actually supported by the canonical delivery registry. */
export function resolveDetectedRegion(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const { success, country_code, city, region } = data as Record<string, unknown>;
  if (success !== true || country_code !== "RU") return null;
  const findMatch = (value: unknown) => {
    if (typeof value !== "string" || !value.trim()) return undefined;
    return allRegions.find((candidate) =>
      [candidate.name, candidate.catalogRegionLabel, ...(candidate.searchAliases ?? [])]
        .some((name) => name && normalize(name) === normalize(value)),
    );
  };
  const cityMatch = findMatch(city);
  const regionMatch = findMatch(region);
  // Homonymous cities in another supported region must not select the wrong group.
  const sameGroup = !regionMatch || !cityMatch
    || (cityMatch.baseRegionSlug ?? cityMatch.slug) === (regionMatch.baseRegionSlug ?? regionMatch.slug);
  return (sameGroup ? cityMatch ?? regionMatch : regionMatch)?.slug ?? null;
}

type CachedSuggestion = { slug: string | null; expiresAt: number };
let memoryCache: CachedSuggestion | undefined;
let pending: Promise<string | null> | undefined;

function readCache(): CachedSuggestion | undefined {
  if (memoryCache && memoryCache.expiresAt > Date.now()) return memoryCache;
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
    if (cached && typeof cached.expiresAt === "number" && cached.expiresAt > Date.now()
      && (cached.slug === null || allRegions.some(({ slug }) => slug === cached.slug))) {
      return cached;
    }
  } catch { /* Storage can be unavailable in private browsing. */ }
  return undefined;
}

/** IP lookup needs no browser location permission. Never persists a user selection.
 * ipwho.is supports browser CORS and Russian names; its free domain quota is shared
 * by visitors (https://ipwhois.io/documentation). Cache failures as well as matches.
 */
export function detectRegion(): Promise<string | null> {
  const cached = readCache();
  if (cached) return Promise.resolve(cached.slug);
  if (pending) return pending;

  pending = (async () => {
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout>;
    let slug: string | null = null;
    try {
      const lookup = async () => {
        const response = await fetch("https://ipwho.is/?lang=ru&fields=success,country_code,city,region", {
          signal: controller.signal,
          credentials: "omit",
          referrerPolicy: "no-referrer",
        });
        return response.ok ? resolveDetectedRegion(await response.json()) : null;
      };
      slug = await Promise.race([
        lookup(),
        new Promise<null>((resolve) => {
          timer = setTimeout(() => { controller.abort(); resolve(null); }, REQUEST_TIMEOUT);
        }),
      ]);
    } catch { /* Offline, quota, blocked requests: keep the manual selector available. */ }
    finally { clearTimeout(timer!); }

    memoryCache = { slug, expiresAt: Date.now() + (slug ? CACHE_TTL : FAILURE_TTL) };
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(memoryCache)); } catch { /* Optional cache. */ }
    return slug;
  })().finally(() => { pending = undefined; });
  return pending;
}
