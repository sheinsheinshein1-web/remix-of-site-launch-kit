import type { ManufacturerProjectTab, ManufacturerSocial } from "@/data/manufacturers";
import type { Project } from "@/data/projects";

export const manufacturerSectionLabels = {
  about: "О компании",
  projects: "Проекты",
  legal: "Юридическая информация",
  builtObjects: "Объекты",
  production: "Производство",
  reviews: "Отзывы",
  socialMedia: "Соцсети",
} as const;

export const manufacturerProjectTabLabels: Record<ManufacturerProjectTab, string> = {
  houses: "Дома",
  baths: "Бани",
  business: "Для бизнеса",
};

export type ManufacturerSocialSource = "youtube" | "telegram";

export const getManufacturerSocialSources = (social: ManufacturerSocial): ManufacturerSocialSource[] => [
  ...(social.youtubeVideos.length > 0 ? (["youtube"] as const) : []),
  ...(social.telegramChannel && social.telegramPosts.length > 0 ? (["telegram"] as const) : []),
];

export const groupManufacturerProjects = <T extends Pick<Project, "productType" | "useCases">>(projects: T[]) => {
  return {
    // «Дома» и «Бани» — фактические типы. Дом с собственной баней остаётся жилым комплексом.
    houses: projects.filter((project) => project.productType !== "bath"),
    baths: projects.filter((project) => project.productType === "bath"),
    // «Для бизнеса» — дополнительный сценарий, поэтому этот список осознанно пересекается с двумя верхними.
    business: projects.filter((project) => Boolean(project.useCases?.length)),
  } satisfies Record<ManufacturerProjectTab, T[]>;
};
