import type { Project } from "@/data/projects";
import {
  isAllRegionsGeo,
  isProjectAvailableInGeo,
  normalizeGeoSelection,
} from "@/lib/geoSelection";

const getNumber = (value: string) => Number.parseInt(value.replace(/\D/g, ""), 10) || 0;

const getArea = (project: Project) => project.area_m2 ?? getNumber(project.area);

const getProductGroup = (project: Project) => (
  project.productType === "bath" ? "bath" : "house"
);

const relativeCloseness = (first: number, second: number) => {
  if (!first || !second) return 0;
  return Math.max(0, 1 - Math.abs(first - second) / Math.max(first, second));
};

const getMatchingRegion = (project: Project, selectedRegion?: string | null) => (
  isAllRegionsGeo(selectedRegion) ? normalizeGeoSelection(project.city) : normalizeGeoSelection(selectedRegion)
);

const getScore = (source: Project, candidate: Project) => {
  const sourcePrice = getNumber(source.price);
  const candidatePrice = getNumber(candidate.price);
  const sourceArea = getArea(source);
  const candidateArea = getArea(candidate);
  const sharedPurposes = candidate.suitableFor.filter((item) => source.suitableFor.includes(item)).length;

  return (
    relativeCloseness(sourcePrice, candidatePrice) * 42
    + relativeCloseness(sourceArea, candidateArea) * 32
    + (source.beds === candidate.beds ? 9 : 0)
    + (source.technology === candidate.technology ? 8 : 0)
    + (source.style === candidate.style ? 5 : 0)
    + Math.min(sharedPurposes, 2) * 2
  );
};

export const getSimilarManufacturerProjects = (
  source: Project,
  allProjects: Project[],
  selectedRegion?: string | null,
  limit = 5,
) => {
  const matchingRegion = getMatchingRegion(source, selectedRegion);
  const sourceGroup = getProductGroup(source);

  const candidates = allProjects
    .filter((candidate) => candidate.id !== source.id)
    .filter((candidate) => candidate.maker.id && candidate.maker.id !== source.maker.id)
    .filter((candidate) => getProductGroup(candidate) === sourceGroup)
    .filter((candidate) => isProjectAvailableInGeo(candidate.city, matchingRegion, candidate.deliveryRegionSlugs))
    .map((candidate) => ({ project: candidate, score: getScore(source, candidate) }))
    .sort((first, second) => second.score - first.score || first.project.id - second.project.id);

  const seenMakers = new Set<string>();

  return candidates
    .filter(({ project }) => {
      const makerId = project.maker.id;
      if (!makerId || seenMakers.has(makerId)) return false;
      seenMakers.add(makerId);
      return true;
    })
    .slice(0, Math.max(0, limit))
    .map(({ project }) => project);
};

export const getProjectMatchLabel = (source: Project, candidate: Project) => {
  const priceCloseness = relativeCloseness(getNumber(source.price), getNumber(candidate.price));
  const areaCloseness = relativeCloseness(getArea(source), getArea(candidate));

  if (priceCloseness >= 0.82 && areaCloseness >= 0.82) return "Близок по площади и бюджету";
  if (areaCloseness >= priceCloseness) return "Близок по площади и планировке";
  return "Близок по бюджету";
};
