import { z } from "zod";
import { manufacturerPackageSchema } from "./manufacturer-package-contract";
import { candidateSchema, publicUrlSchema } from "./runtime-contract";

// Raw strings retain the manufacturer's units, qualifiers and wording.
export const rawFactSchema = z.object({ value: z.string().nullable(), sourceUrl: publicUrlSchema }).strict();
export const rawProjectSchema = z.object({
  officialPage: publicUrlSchema, sourceProductId: z.number().int(),
  name: rawFactSchema, type: rawFactSchema, price: rawFactSchema, area: rawFactSchema,
  floors: rawFactSchema, bedrooms: rawFactSchema, bathrooms: rawFactSchema,
  dimensions: rawFactSchema, manufacturingTime: rawFactSchema, technology: rawFactSchema,
  configuration: rawFactSchema, description: rawFactSchema,
  photos: z.array(z.object({ url: publicUrlSchema, sourceUrl: publicUrlSchema, alt: z.string().nullable(), srcset: z.string().nullable() })).nullable(),
  characteristics: z.array(z.object({ label: z.string(), value: z.string(), sourceUrl: publicUrlSchema })),
  tables: z.array(z.object({ headers: z.array(z.string()), rows: z.array(z.array(z.string())), sourceUrl: publicUrlSchema })),
  sections: z.array(z.object({ heading: z.string().nullable(), text: z.string(), sourceUrl: publicUrlSchema })),
  variations: z.object({ value: z.array(z.record(z.unknown())), sourceUrl: publicUrlSchema }).nullable(),
  rawOfficialProduct: z.object({ value: z.record(z.unknown()), sourceUrl: publicUrlSchema }),
  pageSnapshot: z.string(), missingFields: z.array(z.string()),
}).strict();
export const collectorResultSchema = z.object({
  version: z.literal(1), kind: z.literal("collector.raw-catalog"),
  runId: z.string().uuid(), taskId: z.string().uuid(), sourceRunId: z.string().uuid(), city: z.string(),
  manufacturer: candidateSchema, selectionReason: z.string(),
  provider: z.literal("official-woocommerce-http"), startedAt: z.string().datetime(), completedAt: z.string().datetime(),
  discoveredCount: z.number().int().nonnegative(), parsedCount: z.number().int().nonnegative(),
  projects: z.array(rawProjectSchema),
  manufacturerPackage: manufacturerPackageSchema.optional(), // Legacy archives remain readable; new preparation requires this envelope.
  sources: z.array(publicUrlSchema),
  coverage: z.object({ catalogUrls: z.array(publicUrlSchema), productUrls: z.array(publicUrlSchema), sitemapUrls: z.array(publicUrlSchema), complete: z.boolean() }),
  failures: z.array(z.object({ url: publicUrlSchema, error: z.string() })), limitations: z.array(z.string()),
}).strict().refine(r => r.parsedCount === r.projects.length && r.discoveredCount >= r.parsedCount, "Некорректные счётчики каталога");
export const collectionInputSchema = z.object({ sourceRunId: z.string().uuid(), requestId: z.string().uuid() }).strict();
export type RawProject = z.infer<typeof rawProjectSchema>;
export type CollectorResult = z.infer<typeof collectorResultSchema>;

export const completeCollectorResultSchema = collectorResultSchema.refine(r => !!r.manufacturerPackage?.readiness.envelopeComplete && r.coverage.complete && r.manufacturerPackage.catalog.complete && r.manufacturerPackage.catalog.parsedCount === r.projects.length, "Подготовка принимает только полный пакет производителя: компания, каталог, источники, пропуски, конфликты, изображения и проверка дублей");
