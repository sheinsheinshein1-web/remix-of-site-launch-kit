import type { Project } from "@/data/projects";

type ProjectRouteInput = Pick<Project, "id" | "name" | "area" | "area_m2" | "technology"> & {
  maker: Pick<Project["maker"], "id" | "name">;
};

export const CATALOG_PATH = "/modulnye-doma";
export const MANUFACTURERS_PATH = "/proizvoditeli";
export const REGIONS_PATH = "/regiony-dostavki";

const transliterationMap: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z",
  и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
  с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts", ч: "ch", ш: "sh", щ: "sch",
  ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
};

/** Единая транслитерация для публичных SEO-адресов. */
export const transliterateSlug = (value: string) => value
  .trim()
  .toLocaleLowerCase("ru")
  .split("")
  .map((character) => transliterationMap[character] ?? character)
  .join("")
  .normalize("NFKD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "")
  .replace(/-{2,}/g, "-");

export const getProjectCategorySlug = (technology: string) =>
  technology.toLocaleLowerCase("ru").includes("префаб") ? "prefab-doma" : "modulnye-doma";

const getProjectAreaSlug = (project: Pick<Project, "area" | "area_m2">) => {
  const parsedArea = project.area_m2 ?? Number.parseFloat(project.area.replace(",", "."));
  return Number.isFinite(parsedArea) ? `${Math.round(parsedArea)}-m2` : "";
};

export const getProjectSlug = (
  project: Omit<ProjectRouteInput, "technology">,
) => [
  transliterateSlug(project.maker.id || project.maker.name),
  transliterateSlug(project.name),
  getProjectAreaSlug(project),
  String(project.id),
].filter(Boolean).join("-");

export const getProjectPath = (
  project: ProjectRouteInput,
) => `/${getProjectCategorySlug(project.technology)}/proekty/${getProjectSlug(project)}`;

export const getProjectIdFromRouteParam = (value = "") => {
  const match = value.match(/(?:^|-)(\d+)$/);
  return match ? Number(match[1]) : Number.NaN;
};

export const getRegionPath = (slug: string) => `/modulnye-doma/${slug}`;
export const getManufacturerPath = (makerId: string) => `${MANUFACTURERS_PATH}/${makerId}`;
export const getManufacturerReviewsPath = (makerId: string) => `${getManufacturerPath(makerId)}/otzyvy`;
