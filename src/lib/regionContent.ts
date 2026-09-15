import { pluralizeRu } from "@/lib/pageSeo";

export type RegionContentStats = {
  projectCount: number;
  manufacturerCount: number;
};

export const interpolateRegionContent = (value: string, stats: RegionContentStats) => {
  const projectCountLabel = `${stats.projectCount.toLocaleString("ru-RU")} ${pluralizeRu(
    stats.projectCount,
    ["проект", "проекта", "проектов"],
  )}`;
  const manufacturerCountLabel = `${stats.manufacturerCount.toLocaleString("ru-RU")} ${pluralizeRu(
    stats.manufacturerCount,
    ["производитель", "производителя", "производителей"],
  )}`;

  return value
    .replaceAll("{projectCount}", stats.projectCount.toLocaleString("ru-RU"))
    .replaceAll("{projectCountLabel}", projectCountLabel)
    .replaceAll("{manufacturerCount}", stats.manufacturerCount.toLocaleString("ru-RU"))
    .replaceAll("{manufacturerCountLabel}", manufacturerCountLabel);
};
