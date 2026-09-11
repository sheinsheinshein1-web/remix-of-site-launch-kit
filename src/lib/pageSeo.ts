import type { Project } from "@/data/projects";
import { manufacturerRegistry } from "@/data/manufacturers";

export type PageSeoMetadata = {
  title: string;
  description: string;
};

type CatalogSeoInput = {
  categoryTitle?: string;
  categoryCaption?: string;
};

type ManufacturerSeoInput = {
  name: string;
  city: string;
  projectCount: number;
  hasReviews: boolean;
};

type RegionSeoInput = {
  h1: string;
  namePrepositional: string;
  fallbackDescription: string;
  projectCount: number;
  manufacturerCount: number;
};

const BRAND = "многоместа.рф";
const TITLE_SOFT_LIMIT = 65;
const DESCRIPTION_LIMIT = 160;

const normalizeWhitespace = (value: string) => value.replace(/\s+/g, " ").trim();

const truncateAtWord = (value: string, maxLength: number) => {
  const normalized = normalizeWhitespace(value);
  if (normalized.length <= maxLength) return normalized;

  const availableLength = Math.max(1, maxLength - 1);
  const sliced = normalized.slice(0, availableLength);
  const lastSpace = sliced.lastIndexOf(" ");
  const safeSlice = lastSpace > availableLength * 0.72 ? sliced.slice(0, lastSpace) : sliced;
  return `${safeSlice.replace(/[\s,;:.!?—-]+$/u, "")}…`;
};

const chooseTitle = (...candidates: string[]) => {
  const normalized = candidates.map(normalizeWhitespace);
  return normalized.find((candidate) => candidate.length <= TITLE_SOFT_LIMIT)
    ?? truncateAtWord(normalized[0], TITLE_SOFT_LIMIT);
};

const createDescription = (...parts: Array<string | undefined | false>) => (
  truncateAtWord(parts.filter(Boolean).join(" "), DESCRIPTION_LIMIT)
);

const chooseDescription = (...candidates: string[]) => {
  const normalized = candidates.map(normalizeWhitespace);
  return normalized.find((candidate) => candidate.length <= DESCRIPTION_LIMIT)
    ?? truncateAtWord(normalized[0], DESCRIPTION_LIMIT);
};

export const pluralizeRu = (count: number, forms: [string, string, string]) => {
  const mod100 = Math.abs(count) % 100;
  const mod10 = mod100 % 10;
  if (mod100 > 10 && mod100 < 20) return forms[2];
  if (mod10 === 1) return forms[0];
  if (mod10 >= 2 && mod10 <= 4) return forms[1];
  return forms[2];
};

export const getProjectTypeLabel = (project: Pick<Project, "productType" | "technology">) => {
  if (project.productType === "bath") return "Модульная баня";
  if (project.productType === "house-bath") return "Дом с баней";
  if (project.technology.toLocaleLowerCase("ru").includes("префаб")) return "Префаб-дом";
  return "Модульный дом";
};

export const getProjectPriceLabel = (price: string) => {
  const normalized = normalizeWhitespace(price);
  if (/^по запросу$/iu.test(normalized)) return "по запросу";
  return /^(?:от\s)/iu.test(normalized) ? normalized : `от ${normalized}`;
};

export const buildHomeSeo = (): PageSeoMetadata => ({
  title: `Модульные дома: проекты и цены | ${BRAND}`,
  description: "Каталог модульных домов с ценами, площадями и планировками. Сравните проекты производителей и проверьте условия доставки в свой регион.",
});

export const buildCatalogSeo = ({ categoryTitle, categoryCaption }: CatalogSeoInput = {}): PageSeoMetadata => {
  if (!categoryTitle) {
    return {
      title: `Проекты модульных домов с ценами | ${BRAND}`,
      description: "Каталог проектов модульных домов: цены, площади, планировки и сроки. Сравните предложения производителей и условия доставки по России.",
    };
  }

  return {
    title: chooseTitle(
      `${categoryTitle}: проекты и цены | ${BRAND}`,
      `${categoryTitle}: проекты с ценами`,
    ),
    description: createDescription(
      `${categoryTitle}: ${categoryCaption ? `${categoryCaption.toLocaleLowerCase("ru")}.` : "проекты с ценами и планировками."}`,
      "Сравните площади, характеристики и сроки у производителей с доставкой по регионам России.",
    ),
  };
};

export const buildProjectSeo = (
  project: Pick<Project, "name" | "area" | "price" | "rooms" | "completion" | "productType" | "technology" | "manufacturerId">,
): PageSeoMetadata => {
  const projectType = getProjectTypeLabel(project);
  const price = getProjectPriceLabel(project.price);
  const titlePrice = `цена ${price}`;
  const makerName = manufacturerRegistry[project.manufacturerId]?.name ?? "Производитель";
  const fullDescription = `${projectType} «${project.name}» от производителя «${makerName}»: ${project.area}, ${project.rooms.toLocaleLowerCase("ru")}, ${project.completion.toLocaleLowerCase("ru")}. Цена ${price}. Фото, характеристики и условия доставки.`;
  const compactDescription = `${projectType} «${project.name}» от производителя «${makerName}»: ${project.area}, ${project.completion.toLocaleLowerCase("ru")}. Цена ${price}. Фото, характеристики и условия доставки.`;

  return {
    title: chooseTitle(
      `${projectType} ${project.name}, ${project.area} — ${titlePrice} | ${makerName}`,
      `${projectType} ${project.name}, ${project.area} — ${titlePrice}`,
      `${project.name}, ${project.area} — ${titlePrice} | ${makerName}`,
      `${projectType} ${project.name}, ${project.area} | ${makerName}`,
    ),
    description: chooseDescription(
      fullDescription,
      compactDescription,
      `${projectType} «${project.name}», ${project.area}, от «${makerName}». Цена ${price}. Фото, характеристики и условия доставки.`,
    ),
  };
};

export const buildManufacturerSeo = ({
  name,
  city,
  projectCount,
  hasReviews,
}: ManufacturerSeoInput): PageSeoMetadata => ({
  title: chooseTitle(
    `${name} — ${projectCount} ${pluralizeRu(projectCount, ["проект", "проекта", "проектов"])} домов с ценами | ${BRAND}`,
    `${name} — ${projectCount} ${pluralizeRu(projectCount, ["проект", "проекта", "проектов"])} с ценами`,
    `${name} — проекты домов и цены | ${BRAND}`,
    `${name} — проекты домов и цены`,
  ),
  description: createDescription(
    `Проекты производителя «${name}»: ${projectCount} ${pluralizeRu(projectCount, ["проект", "проекта", "проектов"])} с ценами, площадями и планировками.`,
    `Производство — ${city}.`,
    hasReviews && "Читайте отзывы и сравнивайте варианты.",
  ),
});

export const buildRegionSeo = ({
  h1,
  namePrepositional,
  fallbackDescription,
  projectCount,
  manufacturerCount,
}: RegionSeoInput): PageSeoMetadata => {
  if (projectCount === 0) {
    return {
      title: chooseTitle(`${h1}: проекты и цены | ${BRAND}`, `${h1}: проекты и цены`),
      description: truncateAtWord(fallbackDescription, DESCRIPTION_LIMIT),
    };
  }

  return {
    title: chooseTitle(
      `${h1} — ${projectCount} ${pluralizeRu(projectCount, ["проект", "проекта", "проектов"])} с ценами`,
      `Модульные дома ${namePrepositional} — ${projectCount} ${pluralizeRu(projectCount, ["проект", "проекта", "проектов"])}`,
      `${h1}: проекты и цены`,
    ),
    description: createDescription(
      `${h1}: ${projectCount} ${pluralizeRu(projectCount, ["проект", "проекта", "проектов"])} от ${manufacturerCount} ${pluralizeRu(manufacturerCount, ["производителя", "производителей", "производителей"])}.`,
      "Сравните цены, площади, планировки и условия доставки.",
    ),
  };
};

export const staticPageSeo = {
  manufacturers: {
    title: `Производители модульных домов в России | ${BRAND}`,
    description: "Сравните производителей модульных домов: проекты и цены, регионы доставки, рейтинги и отзывы. Выберите подходящую компанию для строительства.",
  },
  regions: {
    title: `Модульные дома по регионам России | ${BRAND}`,
    description: "Выберите регион доставки и сравните доступные проекты модульных домов, цены и производителей, работающих в вашем городе или области.",
  },
  categories: {
    title: `Категории модульных домов | ${BRAND}`,
    description: "Категории проектов модульных домов и бань: для ПМЖ, дачи, отдыха и бизнеса. Сравните цены, площади и планировки в каталоге.",
  },
  articles: {
    title: "Журнал о модульных домах: выбор, цены и строительство",
    description: "Практические материалы о выборе модульного дома, стоимости, комплектации, доставке и работе с производителями.",
  },
} satisfies Record<string, PageSeoMetadata>;
