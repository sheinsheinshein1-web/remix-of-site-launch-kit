import type { CategoryLink } from "@/data/categoryLinks";
import { CATALOG_PATH } from "@/lib/siteRoutes";

export const resolveCatalogSeoState = (
  searchParams: URLSearchParams,
  categories: CategoryLink[],
) => {
  const currentEntries = Array.from(searchParams.entries());
  const activeCategory = categories.find((category) => {
    const categoryEntries = Array.from(new URL(category.href, "https://многоместа.рф").searchParams.entries());
    return categoryEntries.length > 0
      && categoryEntries.every(([key, value]) => searchParams.get(key) === value);
  });
  // The current static host serves one HTML document for every query-string
  // variation. Until categories get clean, separately prerendered paths, filters
  // must remain crawlable UI states but not separate indexable pages.
  return {
    activeCategory,
    shouldNoIndex: currentEntries.length > 0,
    canonicalPath: CATALOG_PATH,
  };
};
