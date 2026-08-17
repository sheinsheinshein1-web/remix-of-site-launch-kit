export const SITE_URL = "https://многоместа.рф";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og/default.jpg`;

const absoluteUrlPattern = /^https?:\/\//i;

export const normalizeSitePath = (path = "/") => {
  const rawPath = path.trim() || "/";
  const withoutHash = rawPath.split("#")[0] || "/";
  const [rawPathname, rawSearch = ""] = withoutHash.split("?");
  const pathname = rawPathname || "/";
  const withLeadingSlash = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const isFile = /\.[a-z0-9]+$/i.test(withLeadingSlash);
  const normalizedPathname = withLeadingSlash === "/" || withLeadingSlash.endsWith("/") || isFile
    ? withLeadingSlash
    : `${withLeadingSlash}/`;
  const search = rawSearch ? `?${rawSearch}` : "";

  return `${normalizedPathname}${search}`;
};

export const buildSiteUrl = (path = "/") => `${SITE_URL}${normalizeSitePath(path)}`;

export const buildCanonicalUrl = (path?: string) => {
  if (!path) {
    if (typeof window !== "undefined") {
      return buildSiteUrl(window.location.pathname);
    }
    return buildSiteUrl("/");
  }

  if (!absoluteUrlPattern.test(path)) {
    return buildSiteUrl(path);
  }

  try {
    const url = new URL(path);
    if (url.hostname === "многоместа.рф" || url.hostname === "xn--80afg0abehb3ak.xn--p1ai") {
      return buildSiteUrl(`${url.pathname}${url.search}`);
    }
  } catch {
    return path;
  }

  return path;
};

export const buildAssetUrl = (path?: string) => {
  if (!path) return DEFAULT_OG_IMAGE;
  if (absoluteUrlPattern.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
};
