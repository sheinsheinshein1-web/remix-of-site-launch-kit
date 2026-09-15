export type CatalogObjectType = "all" | "house" | "bath";

/** Keeps unrelated query state while changing only the object-type dimension. */
export const withCatalogObjectType = (
  current: URLSearchParams,
  objectType: CatalogObjectType,
) => {
  const next = new URLSearchParams(current);
  next.delete("type");
  next.delete("tech");
  if (objectType !== "all") next.set("type", objectType);
  return next;
};

/** A manual region choice supersedes a legacy `region` query parameter. */
export const withoutLegacyCatalogRegion = (current: URLSearchParams) => {
  const next = new URLSearchParams(current);
  next.delete("region");
  return next;
};
