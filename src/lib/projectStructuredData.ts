import type { Project } from "@/data/projects";
import { manufacturerRegistry } from "@/data/manufacturers";
import { buildAssetUrl, buildSiteUrl } from "@/lib/seo";
import { getProjectPriceAmount } from "@/lib/projectDomain";

export { getProjectPriceAmount } from "@/lib/projectDomain";

type ProjectProductJsonLdOptions = {
  project: Project;
  canonicalPath: string;
  image?: string;
  description?: string;
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
  description,
}: ProjectProductJsonLdOptions): Record<string, unknown> | null => {
  const price = getProjectPriceAmount(project.price);
  if (price === null) return null;
  const manufacturer = manufacturerRegistry[project.manufacturerId];
  if (!manufacturer) return null;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: project.name,
    description: description || project.descriptionLong || project.description,
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
