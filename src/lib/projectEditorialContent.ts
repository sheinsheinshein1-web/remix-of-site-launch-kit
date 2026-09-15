import type { Project } from "@/data/projects";
import { getProjectPriceLabel, getProjectTypeLabel } from "@/lib/pageSeo";
import { getProjectTechnologyLabel } from "@/lib/projectTechnology";

export type ProjectEditorialSection = {
  heading: string;
  text: string;
};

export type ProjectEditorialContent = {
  lead: string;
  sections: ProjectEditorialSection[];
  sourceUrl?: string;
};

export type ProjectEditorialFacts = {
  productionTerm: string | null;
  productionAddress: string | null;
  technology: string | null;
  insulation: string | null;
  completion: string | null;
  delivery: string | null;
  style: string | null;
};

const lowerFirst = (value: string) => value.charAt(0).toLocaleLowerCase("ru") + value.slice(1);

const normalizeEditorialPunctuation = (value: string) => value.replace(/\s+[—–]\s+/gu, ": ");

const joinRussianList = (items: string[]) => {
  const uniqueItems = [...new Set(items.map((item) => item.trim()).filter(Boolean))];
  if (uniqueItems.length <= 1) return uniqueItems[0] ?? "";
  return `${uniqueItems.slice(0, -1).join(", ")} и ${uniqueItems.at(-1)}`;
};

const bedroomLabel = (count: number) => {
  const lastTwo = Math.abs(count) % 100;
  const lastOne = lastTwo % 10;
  if (lastTwo > 10 && lastTwo < 20) return `${count} спален`;
  if (lastOne === 1) return `${count} спальня`;
  if (lastOne >= 2 && lastOne <= 4) return `${count} спальни`;
  return `${count} спален`;
};

const bathroomLabel = (count: number) => {
  const lastTwo = Math.abs(count) % 100;
  const lastOne = lastTwo % 10;
  if (lastTwo > 10 && lastTwo < 20) return `${count} санузлов`;
  if (lastOne === 1) return `${count} санузел`;
  if (lastOne >= 2 && lastOne <= 4) return `${count} санузла`;
  return `${count} санузлов`;
};

const dayLabel = (count: number) => {
  const lastTwo = Math.abs(count) % 100;
  const lastOne = lastTwo % 10;
  if (lastTwo > 10 && lastTwo < 20) return "дней";
  if (lastOne === 1) return "день";
  if (lastOne >= 2 && lastOne <= 4) return "дня";
  return "дней";
};

const formatProductionTerm = (value: string) => {
  const normalized = value.trim();
  const match = normalized.match(/^(?:(от|до)\s+)?(\d+)\s*д\.?$/iu);
  if (!match) return normalized;

  const count = Number(match[2]);
  return `${match[1] ? `${match[1]} ` : ""}${count} ${dayLabel(count)}`;
};

const formatProductionLocation = (address: string) => {
  const normalized = address.trim();
  const city = normalized.match(/(?:^|,\s*)(?:г\.|город)\s*([^,]+)/iu)?.[1]?.trim();
  return city ? `г. ${city}` : normalized;
};

const curatedProjectEditorialContent: Record<
  number,
  (project: Project, facts: ProjectEditorialFacts) => Omit<ProjectEditorialContent, "sourceUrl">
> = {
  36: (project, facts) => ({
    lead: [
      "Bear House 86: одноэтажный модульный дом от компании «Платформа». Габариты 13,7 × 6,17 м. Общая площадь 68,7 м²: 59,5 м² помещений и крытая терраса 9,24 м².",
      facts.insulation ? `Утепление: ${lowerFirst(facts.insulation)}.` : "",
      "Производитель позиционирует дом для круглогодичного проживания.",
    ].filter(Boolean).join(" "),
    sections: [
      {
        heading: "Планировка",
        text: "Кухня 15,06 м², гостиная 12,01 м² с панорамным остеклением и выходом на террасу, спальни 13,60 и 9,24 м², санузлы 4,44 и 2,60 м², коридор 2,51 м². Один этаж без лестниц: удобно семье с детьми и старшим родственникам.",
      },
      {
        heading: "Конструкция и комплектация",
        text: [
          "Деревянный каркас заводской сборки, фальцевая металлическая кровля, панорамные окна.",
          facts.completion ? `Комплектация: ${lowerFirst(facts.completion)}.` : "",
          facts.productionTerm ? `Срок производства: ${formatProductionTerm(facts.productionTerm)}.` : "",
          facts.productionAddress ? `Производство и отгрузка: ${formatProductionLocation(facts.productionAddress)}.` : "",
          facts.delivery ? `Стоимость доставки: ${lowerFirst(facts.delivery)}.` : "",
        ].filter(Boolean).join(" "),
      },
      {
        heading: "Цена",
        text: `В каталоге многоместа.рф указана стоимость ${getProjectPriceLabel(project.price)} по данным на 12 сентября 2026 года. Уточните у производителя, входят ли в эту цену фундамент, доставка, монтаж и подключение коммуникаций.`,
      },
    ],
  }),
};

export const hasEnhancedProjectEditorialContent = (
  project: Pick<Project, "city" | "sourceUrl">,
) => (
  project.city === "Екатеринбург" && Boolean(project.sourceUrl?.trim())
);

/**
 * Builds factual, source-bound copy from the structured fields collected from
 * the manufacturer's project page. It deliberately does not infer materials,
 * inclusions, delivery geography or use cases that are absent from the record.
 */
export const buildProjectEditorialContent = (
  project: Project,
  manufacturerName: string,
  productionAddress?: string,
  sourcedFacts?: ProjectEditorialFacts,
): ProjectEditorialContent => {
  const facts: ProjectEditorialFacts = sourcedFacts ?? {
    productionTerm: project.term || null,
    productionAddress: productionAddress || null,
    technology: project.technology || null,
    insulation: project.insulation || null,
    completion: project.completion || null,
    delivery: null,
    style: project.style || null,
  };
  const buildCuratedContent = curatedProjectEditorialContent[project.id];
  if (buildCuratedContent) {
    return {
      ...buildCuratedContent(project, facts),
      sourceUrl: project.sourceUrl,
    };
  }

  const lead = normalizeEditorialPunctuation(project.descriptionLong || project.description);
  if (!hasEnhancedProjectEditorialContent(project)) {
    return { lead, sections: [], sourceUrl: project.sourceUrl };
  }

  const isBath = project.productType === "bath";
  const normalizedRooms = project.rooms.toLocaleLowerCase("ru");
  const hasSpecificRoomDescription = normalizedRooms !== "планировка на сайте производителя";
  const roomFacts = !hasSpecificRoomDescription
    ? []
    : isBath
    ? [project.rooms]
    : [
        project.rooms,
        ...(project.beds > 0 && !normalizedRooms.includes("спаль") ? [bedroomLabel(project.beds)] : []),
        ...(project.baths > 0 && !normalizedRooms.includes("сануз") ? [bathroomLabel(project.baths)] : []),
      ];
  const dimensionsSentence = project.dimensions
    ? `Габариты объекта: ${project.dimensions}.`
    : "";
  const bathDetails = isBath
    ? [
        project.steamRoomArea ? `Площадь парной: ${project.steamRoomArea}.` : "",
        project.steamRoomFinish ? `Отделка парной: ${lowerFirst(project.steamRoomFinish)}.` : "",
        project.floorFinish ? `Отделка пола: ${lowerFirst(project.floorFinish)}.` : "",
      ].filter(Boolean)
    : [];
  const hasKnownArea = !/уточняется|по запросу/iu.test(project.area);
  const layoutText = [
    hasKnownArea ? `Площадь проекта составляет ${project.area}.` : "",
    dimensionsSentence,
    roomFacts.length > 0 ? `Производитель описывает планировку так: ${joinRussianList(roomFacts)}.` : "",
    ...bathDetails,
    project.floors > 1 ? `В проекте ${project.floors} этажа.` : "",
  ].filter(Boolean).join(" ");

  const specificationFacts = [
    `Тип проекта: ${lowerFirst(project.badge)}.`,
    project.features.length > 0
      ? `В описании модели отдельно отмечены ${joinRussianList(project.features.map(lowerFirst))}.`
      : "",
  ].filter(Boolean).join(" ");

  const constructionFacts = [
    !isBath && facts.technology ? `Технология: ${lowerFirst(getProjectTechnologyLabel(facts.technology))}.` : "",
    facts.completion ? `Комплектация: ${lowerFirst(facts.completion)}.` : "",
    !isBath && facts.insulation ? `Утепление: ${facts.insulation}.` : "",
    facts.productionTerm ? `Срок производства: ${formatProductionTerm(facts.productionTerm)}.` : "",
    facts.productionAddress ? `Место производства: ${formatProductionLocation(facts.productionAddress)}.` : "",
    facts.delivery ? `Стоимость доставки: ${lowerFirst(facts.delivery)}.` : "",
  ].filter(Boolean).join(" ");

  const price = getProjectPriceLabel(project.price);
  const priceText = [
    `В каталоге «Много места» для проекта указана стоимость ${price}.`,
    `Цена и состав комплектации могут быть обновлены производителем «${manufacturerName}», поэтому перед заказом их нужно сверить с официальной страницей проекта.`,
  ].filter(Boolean).join(" ");

  const sections = [
    layoutText ? { heading: "Планировка и размеры", text: layoutText } : null,
    constructionFacts ? { heading: "Конструкция и комплектация", text: constructionFacts } : null,
    specificationFacts ? { heading: "Особенности проекта", text: specificationFacts } : null,
    priceText ? { heading: "Цена и актуальность данных", text: priceText } : null,
  ].filter((section): section is ProjectEditorialSection => Boolean(section));

  return {
    lead,
    sections,
    sourceUrl: project.sourceUrl,
  };
};

export const buildProjectSeoDescription = (
  project: Project,
  manufacturerName: string,
  productionAddress?: string,
  sourcedFacts?: ProjectEditorialFacts,
) => {
  const content = buildProjectEditorialContent(project, manufacturerName, productionAddress, sourcedFacts);
  return [content.lead, ...content.sections.map((section) => section.text)].join(" ");
};

export const buildProjectHeading = (project: Project) => {
  const area = /уточняется|по запросу/iu.test(project.area) ? "" : `, ${project.area}`;
  return `${getProjectTypeLabel(project)} «${project.name}»${area}`;
};
