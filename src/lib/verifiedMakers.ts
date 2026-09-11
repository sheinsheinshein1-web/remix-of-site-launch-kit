import { manufacturerRegistry } from "@/data/manufacturers";

export const isVerifiedMaker = (makerId?: string) =>
  Boolean(makerId && manufacturerRegistry[makerId]?.verified);
