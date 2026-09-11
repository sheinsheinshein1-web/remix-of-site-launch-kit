import {
  getCatalogCategoryByLegacyQuery,
  type CatalogCategoryPage,
} from "@/data/catalogCategories";
import { CATALOG_PATH } from "@/lib/siteRoutes";

export const resolveCatalogSeoState = (
  searchParams: URLSearchParams,
  routeCategory?: CatalogCategoryPage,
) => {
  const currentEntries = Array.from(searchParams.entries());
  const legacyCategory = routeCategory ? undefined : getCatalogCategoryByLegacyQuery(searchParams);
  const activeCategory = routeCategory ?? legacyCategory;

  return {
    activeCategory,
    shouldNoIndex: currentEntries.length > 0,
    canonicalPath: activeCategory?.path ?? CATALOG_PATH,
  };
};
