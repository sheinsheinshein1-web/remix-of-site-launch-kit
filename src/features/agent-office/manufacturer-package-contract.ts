import { z } from "zod";
import { publicUrlSchema } from "./runtime-contract";

// Transport/audit envelope only. Public catalog models remain Maker and Project.
export const companyFieldPaths = [
  "name", "siteUrl", "phone", "additionalPhones", "email", "productionAddress", "logo", "telegram",
  "profile.intro", "profile.about", "profile.coordinates", "profile.builtObjects", "externalRating",
  "profile.social.telegramChannel", "profile.social.telegramPosts", "profile.social.youtubeChannelUrl", "profile.social.youtubeVideos",
  "profile.legal.legalName", "profile.legal.status", "profile.legal.registeredAt", "profile.legal.foundingDate", "profile.legal.inn", "profile.legal.kpp", "profile.legal.ogrn", "profile.legal.legalAddress", "profile.legal.director", "profile.legal.mainActivity", "profile.legal.shareCapital", "profile.legal.revenue", "profile.legal.netProfit", "profile.legal.reportingYear", "profile.legal.arbitrationCases", "profile.legal.enforcementProceedings.open", "profile.legal.enforcementProceedings.completed", "profile.legal.unfairSuppliersRegistry",
  "technologies", "workGeography", "productionLocality", "workingHours", "socialLinks", "legalOperator", "brandManufacturerIdentity", "reviews", "certificates",
] as const;
export const observationSchema = z.object({value:z.string(),sourceUrl:publicUrlSchema}).strict();
export const companyFactSchema = z.object({value:z.string().nullable(),sourceUrl:publicUrlSchema,status:z.enum(["found","missing","conflict","not-checked"]),observations:z.array(observationSchema),note:z.string()}).strict();
export const packageIssueSchema=z.object({field:z.string(),reason:z.string(),sourceUrls:z.array(publicUrlSchema),values:z.array(observationSchema)}).strict();
export const companyDataSchema=z.object({
  collectedAt:z.string().datetime(), fields:z.record(companyFactSchema),
  pages:z.array(z.object({url:publicUrlSchema,snapshot:z.string(),sha256:z.string().length(64),sections:z.array(z.object({heading:z.string().nullable(),text:z.string()}))})),
  images:z.array(z.object({url:publicUrlSchema,sourceUrl:publicUrlSchema,role:z.enum(["logo","unclassified"])})),
  coverage:z.object({checkedUrls:z.array(publicUrlSchema),failedUrls:z.array(z.object({url:publicUrlSchema,error:z.string()})),complete:z.boolean()}),
}).strict().superRefine((v,c)=>{for(const path of companyFieldPaths) if(!v.fields[path]) c.addIssue({code:z.ZodIssueCode.custom,path:['fields',path],message:'Обязательное поле компании не проверено'});for(const [k,f] of Object.entries(v.fields)){if(f.value!==null&&!f.observations.some(o=>o.value===f.value&&o.sourceUrl===f.sourceUrl)&&f.observations.map(o=>o.value).join('\n')!==f.value)c.addIssue({code:z.ZodIssueCode.custom,path:['fields',k],message:'Факт без официального доказательства'});if(f.status!=='found'&&f.value!==null)c.addIssue({code:z.ZodIssueCode.custom,path:['fields',k],message:'Неизвестное или конфликтующее значение должно оставаться null'});}});
export const manufacturerPackageSchema=z.object({
  version:z.literal(1),unit:z.literal("manufacturer"),company:companyDataSchema,
  lineage:z.object({catalogRunId:z.string().uuid(),catalogSha256:z.string().length(64),projectsSha256:z.string().length(64),projectsReused:z.boolean()}),
  catalog:z.object({discoveredCount:z.number().int().nonnegative(),parsedCount:z.number().int().nonnegative(),complete:z.boolean(),checkedAt:z.string().datetime(),sourceUrls:z.array(publicUrlSchema)}),
  missingData:z.array(packageIssueSchema),conflicts:z.array(packageIssueSchema),
  images:z.array(z.object({url:publicUrlSchema,sourceUrl:publicUrlSchema,projectId:z.number().int().nullable()})),
  duplicates:z.object({checkedAt:z.string().datetime(),registryManufacturerCount:z.number().int(),registryProjectCount:z.number().int(),matches:z.array(packageIssueSchema),limitations:z.array(z.string())}),
  readiness:z.object({envelopeComplete:z.boolean(),dataComplete:z.boolean(),ready:z.boolean(),status:z.enum(["awaiting-preparation","needs-review"]),blockers:z.array(z.string())}),
}).strict();
export type CompanyData=z.infer<typeof companyDataSchema>;
export type ManufacturerPackage=z.infer<typeof manufacturerPackageSchema>;
export type PackageIssue=z.infer<typeof packageIssueSchema>;
