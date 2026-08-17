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
  const categoryEntries = activeCategory
    ? Array.from(new URL(activeCategory.href, "https://многоместа.рф").searchParams.entries())
    : [];
  const isExactCuratedCategory = Boolean(
    activeCategory
    && currentEntries.length === categoryEntries.length
    && categoryEntries.every(([key, value]) => searchParams.get(key) === value),
  );

  return {
    activeCategory,
    isExactCuratedCategory,
    shouldNoIndex: currentEntries.length > 0 && !isExactCuratedCategory,
    canonicalPath: activeCategory?.href ?? CATALOG_PATH,
  };
};
