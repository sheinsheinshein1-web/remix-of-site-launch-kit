import { describe, expect, it } from "vitest";
import type { Project } from "@/data/projects";
import { getSimilarManufacturerProjects } from "@/lib/projectRecommendations";

const createProject = (overrides: Partial<Project> = {}): Project => ({
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
  maker: { id: "source", name: "Источник", initials: "И" },
  productType: "house",
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
});

describe("подбор похожих проектов других производителей", () => {
  it("оставляет один лучший проект от производителя и учитывает регион", () => {
    const source = createProject();
    const close = createProject({ id: 2, name: "Близкий", maker: { id: "maker-a", name: "A", initials: "A" }, price: "3 100 000 ₽", area_m2: 76 });
    const distantSameMaker = createProject({ id: 3, name: "Дальний", maker: { id: "maker-a", name: "A", initials: "A" }, price: "8 000 000 ₽", area_m2: 150 });
    const wrongRegion = createProject({ id: 4, maker: { id: "maker-b", name: "B", initials: "B" }, city: "Москва и МО" });

    expect(getSimilarManufacturerProjects(source, [source, distantSameMaker, wrongRegion, close], "ekaterinburg"))
      .toEqual([close]);
  });

  it("не смешивает дома и бани и ограничивает количество карточек", () => {
    const source = createProject();
    const candidates = Array.from({ length: 7 }, (_, index) => createProject({
      id: index + 2,
      maker: { id: `maker-${index}`, name: `Производитель ${index}`, initials: "П" },
    }));
    const bath = createProject({ id: 20, productType: "bath", maker: { id: "bath-maker", name: "Бани", initials: "Б" } });

    const result = getSimilarManufacturerProjects(source, [source, bath, ...candidates], "ekaterinburg");

    expect(result).toHaveLength(5);
    expect(result).not.toContain(bath);
  });
});
