import { z } from "zod";
import rawRegistry from "@/data/generated/catalog-registry.json";

const generatedCatalogRegistrySchema = z.object({
  version: z.literal(1),
  publishedAt: z.string().datetime().nullable(),
  manufacturers: z.array(z.record(z.unknown())),
  projects: z.array(z.record(z.unknown())),
  projectSourceFacts: z.record(z.record(z.unknown())),
  imports: z.array(z.object({
    manufacturerId: z.string().min(1),
    sourceRunId: z.string().uuid(),
    sourceSha256: z.string().length(64),
    publishedAt: z.string().datetime(),
  })).default([]),
});

/**
 * Машинно публикуемый слой единого реестра. Ручные и импортированные записи
 * проходят через те же downstream-потребители: карточки, фильтры, SEO и sitemap.
 */
export const generatedCatalogRegistry = generatedCatalogRegistrySchema.parse(rawRegistry);
