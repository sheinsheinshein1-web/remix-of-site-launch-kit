import type { Project } from "@/data/projects";
import {
  getProjectAreaAmount,
  getProjectPriceAmount,
  getProjectTermDays,
  matchesProjectObjectType,
} from "@/lib/projectDomain";
import { matchesProjectTechnology } from "@/lib/projectTechnology";

type FilterableProject = Pick<
  Project,
  | "productType"
  | "price"
  | "area"
  | "area_m2"
  | "beds"
  | "baths"
  | "floors"
  | "term"
  | "technology"
  | "completion"
>;

export type ProjectFilterState = {
  objectType?: "all" | "house" | "bath";
  price?: {
    min?: number;
    max?: number;
    /** Unknown prices remain visible until the visitor explicitly filters by price. */
    excludeUnknown?: boolean;
  };
  area?: { min?: number; max?: number };
  bedrooms?: ReadonlySet<string>;
  bathrooms?: ReadonlySet<string>;
  floors?: ReadonlySet<string>;
  moveIn?: ReadonlySet<string>;
  technologies?: ReadonlySet<string>;
  completions?: ReadonlySet<string>;
};

const matchesBedrooms = (beds: number, filters?: ReadonlySet<string>) => {
  if (!filters?.size) return true;
  return Array.from(filters).some((filter) => {
    if (filter === "Студия") return beds === 0;
    if (filter === "3+") return beds >= 3;
    return beds === Number.parseInt(filter, 10);
  });
};

const matchesBathrooms = (baths: number, filters?: ReadonlySet<string>) => {
  if (!filters?.size) return true;
  return Array.from(filters).some((filter) => (
    filter === "2+" ? baths >= 2 : baths === Number.parseInt(filter, 10)
  ));
};

const matchesMoveIn = (term: string, filters?: ReadonlySet<string>) => {
  if (!filters?.size) return true;
  const days = getProjectTermDays(term);
  if (days === null) return false;

  return Array.from(filters).some((filter) => {
    if (filter === "до 2 недель") return days <= 14;
    if (filter === "2–4 недели") return days > 14 && days <= 30;
    if (filter === "1–2 месяца") return days > 30 && days <= 60;
    return false;
  });
};

export const matchesProjectFilters = (
  project: FilterableProject,
  filters: ProjectFilterState,
) => {
  if (!matchesProjectObjectType(project, filters.objectType ?? "all")) return false;

  const price = getProjectPriceAmount(project.price);
  if (price === null) {
    if (filters.price?.excludeUnknown) return false;
  } else {
    if (filters.price?.min !== undefined && price < filters.price.min) return false;
    if (filters.price?.max !== undefined && price > filters.price.max) return false;
  }

  const area = getProjectAreaAmount(project);
  if (filters.area?.min !== undefined && (area === null || area < filters.area.min)) return false;
  if (filters.area?.max !== undefined && (area === null || area > filters.area.max)) return false;

  if (!matchesBedrooms(project.beds, filters.bedrooms)) return false;
  if (!matchesBathrooms(project.baths, filters.bathrooms)) return false;
  if (filters.floors?.size && !filters.floors.has(String(project.floors))) return false;
  if (!matchesMoveIn(project.term, filters.moveIn)) return false;

  if (filters.technologies?.size && !Array.from(filters.technologies).some((technology) => (
    matchesProjectTechnology(project.technology, technology)
  ))) return false;
  if (filters.completions?.size && !filters.completions.has(project.completion)) return false;

  return true;
};
