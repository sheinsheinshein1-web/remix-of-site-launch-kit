import { z } from "zod";
import { manufacturerPackageSchema } from "./manufacturer-package-contract";
import { rawProjectSchema } from "./collector-contract";
import type { Project } from "../../data/projects";
import type { Maker } from "../../data/manufacturers";
import type { ProjectSourceFacts, ProjectSourceFact } from "../../data/projectSourceFacts";

// A runtime-only draft of EXISTING Project fields. It cannot be imported as Project:
// unknown required values stay null until the catalog contract can accept them.
export type ProjectDraft = { [K in keyof Project]: Project[K] | null };
export interface PreparedProject {
  record: ProjectDraft; sourceProductId: number; sourceFacts: ProjectSourceFacts;
  fieldSources: Record<string, ProjectSourceFact>; missingFields: string[];
  ambiguities: string[]; ready: boolean;
}
export interface PreparationReport {
  fullyReadyData: string[]; missingFields: string[]; ambiguousMappings: string[];
  referenceDifferences: string[]; preparedCount: number; readyCount: number;
  manufacturerSchemaCompatible: boolean; manufacturerReady: boolean;
}
const reportSchema = z.object({
  fullyReadyData: z.array(z.string()), missingFields: z.array(z.string()), ambiguousMappings: z.array(z.string()),
  referenceDifferences: z.array(z.string()), preparedCount: z.number().int(), readyCount: z.number().int(),
  manufacturerSchemaCompatible: z.boolean(), manufacturerReady: z.boolean(),
});
export const preparationResultSchema = z.object({
  version: z.literal(1), kind: z.literal("catalog.preparation"), runId: z.string().uuid(), taskId: z.string().uuid(),
  sourceRunId: z.string().uuid(), sourceFile: z.string(), sourceSha256: z.string().length(64), createdAt: z.string().datetime(),
  agentId: z.literal("editor"), status: z.literal("needs-review"),
  manufacturer: z.object({ record: z.record(z.unknown()), fieldSources: z.record(z.unknown()), unknownFields: z.record(z.null()), schemaCompatible: z.boolean(), ready: z.boolean() }),
  projects: z.array(z.object({ record: z.record(z.unknown()), sourceProductId: z.number(), sourceFacts: z.record(z.unknown()), fieldSources: z.record(z.unknown()), missingFields: z.array(z.string()), ambiguities: z.array(z.string()), ready: z.boolean() })),
  links: z.array(z.object({ manufacturerId: z.string(), projectId: z.number(), sourceProductId: z.number() })),
  references: z.object({ files: z.array(z.string()), manufacturerIds: z.array(z.string()), projectIds: z.array(z.number()) }),
  report: reportSchema,
  manufacturerPackage: manufacturerPackageSchema.optional(),
  rawProjects: z.array(rawProjectSchema).optional(),
}).strict();
export type PreparationResult = Omit<z.infer<typeof preparationResultSchema>, "manufacturer" | "projects" | "report"> & {
  manufacturer: { record: Maker; fieldSources: Record<string, ProjectSourceFact>; unknownFields: Record<string, null>; schemaCompatible: boolean; ready: boolean };
  projects: PreparedProject[]; report: PreparationReport;
};
