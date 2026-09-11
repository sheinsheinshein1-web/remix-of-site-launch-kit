import { describe, expect, it } from "vitest";
import type { Project } from "@/data/projects";
import { getSimilarManufacturerProjects } from "@/lib/projectRecommendations";

const createProject = (overrides: Partial<Project> = {}): Project => {
  const project = {
    id: 1,
    name: "Исходный дом",
    badge: "Жилой дом",
    price: "3 000 000 ₽",
    area: "75 м²",
    area_m2: 75,
    beds: 2,
    baths: 1,
    floors: 1,
    term: "30 дней",
    rooms: "2 спальни",
    purpose: "ПМЖ",
    city: "Екатеринбург",
    manufacturerId: "source",
    productType: "house" as const,
    description: "",
    descriptionLong: "",
    gallery: [],
    likes: 0,
    rating: 0,
    suitableFor: ["ПМЖ"],
    technology: "Модульный дом",
    completion: "Под ключ",
    insulation: "Зимний",
    features: [],
    style: "Современный",
    landSize: "",
    hasRealPhotos: false,
    hasShowroom: false,
    hasInstallment: false,
    ...overrides,
  };

  return project;
};

describe("подбор похожих проектов других производителей", () => {
  it("оставляет один лучший проект от производителя и учитывает регион", () => {
    const source = createProject();
    const close = createProject({ id: 2, name: "Близкий", manufacturerId: "maker-a", price: "3 100 000 ₽", area_m2: 76 });
    const distantSameMaker = createProject({ id: 3, name: "Дальний", manufacturerId: "maker-a", price: "8 000 000 ₽", area_m2: 150 });
    const wrongRegion = createProject({ id: 4, manufacturerId: "maker-b", city: "Москва и МО" });

    expect(getSimilarManufacturerProjects(source, [source, distantSameMaker, wrongRegion, close], "ekaterinburg"))
      .toEqual([close]);
  });

  it("не смешивает дома и бани и ограничивает количество карточек", () => {
    const source = createProject();
    const candidates = Array.from({ length: 7 }, (_, index) => createProject({
      id: index + 2,
      manufacturerId: `maker-${index}`,
    }));
    const bath = createProject({ id: 20, productType: "bath", manufacturerId: "bath-maker" });

    const result = getSimilarManufacturerProjects(source, [source, bath, ...candidates], "ekaterinburg");

    expect(result).toHaveLength(5);
    expect(result).not.toContain(bath);
  });
});
