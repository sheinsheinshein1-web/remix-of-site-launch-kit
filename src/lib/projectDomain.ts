import type { Project } from "@/data/projects";

export type ProjectObjectType = "house" | "bath" | "house-bath";

export const getProjectObjectType = (project: Pick<Project, "productType">): ProjectObjectType =>
  project.productType ?? "house";

/**
 * A combined house + bath is a residential project. This mirrors the public
 * manufacturer contract and prevents the same object from changing category
 * between the catalogue, search and manufacturer pages.
 */
export const isHouseProject = (project: Pick<Project, "productType">) =>
  getProjectObjectType(project) !== "bath";

export const isBathProject = (project: Pick<Project, "productType">) =>
  getProjectObjectType(project) === "bath";

export const matchesProjectObjectType = (
  project: Pick<Project, "productType">,
  objectType: "all" | "house" | "bath",
) => {
  if (objectType === "all") return true;
  return objectType === "house" ? isHouseProject(project) : isBathProject(project);
};

export const getProjectPriceAmount = (value: string): number | null => {
  const digits = (value.match(/\d+/g) ?? []).join("");
  if (!digits) return null;

  const amount = Number(digits);
  return Number.isFinite(amount) && amount > 0 ? amount : null;
};

export const getProjectAreaAmount = (project: Pick<Project, "area" | "area_m2">): number | null => {
  if (typeof project.area_m2 === "number" && Number.isFinite(project.area_m2)) {
    return project.area_m2;
  }

  const amount = Number.parseFloat(project.area.replace(",", "."));
  return Number.isFinite(amount) && amount > 0 ? amount : null;
};

export const getProjectTermDays = (value: string): number | null => {
  const numericPart = value.replace(",", ".").match(/\d+(?:\.\d+)?/u)?.[0];
  const amount = numericPart ? Number.parseFloat(numericPart) : Number.NaN;
  if (!Number.isFinite(amount) || amount <= 0) return null;

  const normalized = value.toLocaleLowerCase("ru");
  if (/недел|нед\.?/u.test(normalized)) return Math.round(amount * 7);
  if (/месяц|мес\.?/u.test(normalized)) return Math.round(amount * 30);
  return Math.round(amount);
};

export const formatProjectPriceLabel = (value: string) => {
  const normalized = value.trim();
  if (!normalized) return "Цена по запросу";
  if (/^по запросу(?:\s|$)/iu.test(normalized)) return "Цена по запросу";
  if (/^уточнит/iu.test(normalized)) return "Уточнить у производителя";
  if (/^от(?:\s|$)/iu.test(normalized)) return normalized;
  return `от ${normalized}`;
};

const pluralizeRu = (count: number, forms: [string, string, string]) => {
  const mod100 = Math.abs(count) % 100;
  const mod10 = mod100 % 10;
  if (mod100 > 10 && mod100 < 20) return forms[2];
  if (mod10 === 1) return forms[0];
  if (mod10 >= 2 && mod10 <= 4) return forms[1];
  return forms[2];
};

/** Ready-to-render facts. Unknown numeric values never leak into UI as zeroes. */
export const getProjectFactLabels = (
  project: Pick<Project, "area" | "beds" | "baths" | "floors" | "productType" | "completion">,
) => {
  const facts: string[] = [];
  if (project.area.trim()) facts.push(project.area);

  if (isBathProject(project)) {
    facts.push("парная");
    if (project.completion.trim()) facts.push(project.completion.toLocaleLowerCase("ru"));
  } else {
    if (project.beds > 0) {
      facts.push(`${project.beds} ${pluralizeRu(project.beds, ["спальня", "спальни", "спален"])}`);
    }
    if (project.baths > 0) {
      facts.push(`${project.baths} ${pluralizeRu(project.baths, ["санузел", "санузла", "санузлов"])}`);
    }
  }

  if (project.floors > 0) {
    facts.push(`${project.floors} ${pluralizeRu(project.floors, ["этаж", "этажа", "этажей"])}`);
  }

  return facts;
};
