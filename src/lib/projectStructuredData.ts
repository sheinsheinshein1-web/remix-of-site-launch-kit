import type { Project } from "@/data/projects";
import { manufacturerRegistry } from "@/data/manufacturers";
import { buildAssetUrl, buildSiteUrl } from "@/lib/seo";

export const getProjectPriceAmount = (price: string): number | null => {
  const digits = (price.match(/\d+/g) ?? []).join("");
  if (!digits) return null;

  const amount = Number(digits);
  return Number.isFinite(amount) && amount > 0 ? amount : null;
};

type ProjectProductJsonLdOptions = {
  project: Project;
  canonicalPath: string;
  image?: string;
};

/**
 * Product rich results require a truthful Offer, Review or AggregateRating.
 * Project ratings in the catalogue are not backed by project-level reviews,
 * so projects without a published numeric price must not emit Product markup.
 */
export const buildProjectProductJsonLd = ({
  project,
  canonicalPath,
  image,
}: ProjectProductJsonLdOptions): Record<string, unknown> | null => {
  const price = getProjectPriceAmount(project.price);
  if (price === null) return null;
  const manufacturer = manufacturerRegistry[project.manufacturerId];
  if (!manufacturer) return null;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: project.name,
    description: project.descriptionLong || project.description,
    sku: `project-${project.id}`,
    brand: { "@type": "Brand", name: manufacturer.name },
    image: image ? buildAssetUrl(image) : undefined,
    offers: {
      "@type": "Offer",
      priceCurrency: "RUB",
      price,
      url: buildSiteUrl(canonicalPath),
      seller: {
        "@type": "Organization",
        name: manufacturer.name,
      },
    },
  };
};
