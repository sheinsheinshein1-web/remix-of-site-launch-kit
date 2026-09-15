import { z } from "zod";

export const cityTaskInputSchema = z.object({
  city: z.string().trim().min(2).max(80).regex(/^[\p{L}\p{M} .'-]+$/u, "Укажите название города"),
  requestId: z.string().uuid(),
}).strict();
export const publicUrlSchema = z.string().url().refine(value => {
  try {
  const url = new URL(value);
  return ["https:", "http:"].includes(url.protocol) && !url.username && !url.password && !/^(localhost|127\.|0\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.|\[|::)/i.test(url.hostname) && url.hostname.includes(".");
  } catch { return false; }
}, "Ожидается публичный HTTP(S) источник");
export const candidateSchema = z.object({
  name: z.string().trim().min(2).max(160),
  officialWebsite: publicUrlSchema,
  cityRegion: z.string().min(2).max(180),
  products: z.array(z.string().min(1).max(100)).min(1).max(12),
  modularHouses: z.enum(["yes", "no", "unclear"]),
  modularBaths: z.enum(["yes", "no", "unclear"]),
  businessRole: z.enum(["manufacturer", "intermediary", "unclear"]),
  manufacturerStatus: z.enum(["confirmed", "unclear"]),
  sourceUrl: publicUrlSchema,
  evidence: z.string().min(15).max(1000),
  confidence: z.number().min(0).max(1),
  inclusionReason: z.string().min(10).max(1000),
  knownRegistryId: z.string().max(100).nullable(),
}).strict().refine(candidate => candidate.manufacturerStatus !== "confirmed" || candidate.businessRole === "manufacturer", "Подтверждение производителя требует соответствующей роли");
export type ScoutCandidate = z.infer<typeof candidateSchema>;
export const scoutOutputSchema = z.object({
  candidates: z.array(candidateSchema).max(20),
  limitations: z.array(z.string().min(1).max(1000)).max(20),
}).strict();
export type ScoutOutput = z.infer<typeof scoutOutputSchema>;
export const resultSchema = z.object({
  version: z.literal(1), runId: z.string().uuid(), taskId: z.string().uuid(), city: z.string(),
  searchedAt: z.string().datetime(), completedAt: z.string().datetime(),
  provider: z.literal("codex-cli-web-search"),
  candidates: z.array(candidateSchema),
  excluded: z.array(z.object({ candidate: candidateSchema, registryIds: z.array(z.string()), reason: z.string() })),
  sources: z.array(publicUrlSchema), limitations: z.array(z.string()),
  registryCheckedAt: z.string().datetime(), registryCount: z.number().int().nonnegative(),
}).strict();
export type ScoutResult = z.infer<typeof resultSchema>;
export const runtimeTaskSchema = z.object({
  id: z.string().uuid(), runId: z.string().uuid(), parentTaskId: z.string().uuid().nullable(),
  city: z.string(), agentId: z.enum(["astra", "scout", "collector", "editor"]), title: z.string(),
  status: z.enum(["idle", "working", "waiting", "needs-review", "completed", "error"]),
  input: z.object({ city: z.string(), sourceRunId: z.string().uuid().optional(), officialWebsite: publicUrlSchema.optional() }), resultPath: z.string().nullable(), sources: z.array(publicUrlSchema),
  error: z.string().nullable(), createdAt: z.string().datetime(), startedAt: z.string().datetime().nullable(), completedAt: z.string().datetime().nullable(),
}).strict();
export type RuntimeTask = z.infer<typeof runtimeTaskSchema>;
export const runtimeHealthSchema = z.object({
  connected: z.boolean(), provider: z.literal("codex-cli-web-search"), searchAvailable: z.boolean(),
  message: z.string(), activeRunId: z.string().nullable(),
  activeAgent: z.enum(["astra", "scout", "collector", "editor"]).nullable().optional(),
});
export type RuntimeHealth = z.infer<typeof runtimeHealthSchema>;
