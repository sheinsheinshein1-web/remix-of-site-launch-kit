import { describe, expect, it } from "vitest";
import type { Project } from "@/data/projects";
import {
  formatProjectPriceLabel,
  getProjectAreaAmount,
  getProjectFactLabels,
  getProjectPriceAmount,
  getProjectTermDays,
  matchesProjectObjectType,
} from "@/lib/projectDomain";

const project = (overrides: Partial<Project> = {}) => ({
  area: "46,4 м²",
  beds: 2,
  baths: 1,
  floors: 1,
  productType: "house" as const,
  completion: "Под ключ",
  ...overrides,
}) as Project;

describe("project domain", () => {
  it("normalizes numeric project values without treating unknown values as zero", () => {
    expect(getProjectPriceAmount("5 480 000 ₽")).toBe(5_480_000);
    expect(getProjectPriceAmount("по запросу")).toBeNull();
    expect(getProjectAreaAmount(project())).toBe(46.4);
    expect(getProjectAreaAmount(project({ area: "по запросу" }))).toBeNull();
  });

  it("normalizes construction terms with their actual units", () => {
    expect(getProjectTermDays("30 д.")).toBe(30);
    expect(getProjectTermDays("от 10 недель")).toBe(70);
    expect(getProjectTermDays("2 мес.")).toBe(60);
    expect(getProjectTermDays("по запросу")).toBeNull();
  });

  it("keeps house-bath projects in the residential object type only", () => {
    const combined = project({ productType: "house-bath" });
    expect(matchesProjectObjectType(combined, "house")).toBe(true);
    expect(matchesProjectObjectType(combined, "bath")).toBe(false);
  });

  it("formats price labels consistently", () => {
    expect(formatProjectPriceLabel("5 480 000 ₽")).toBe("от 5 480 000 ₽");
    expect(formatProjectPriceLabel("от 3 102 000 ₽")).toBe("от 3 102 000 ₽");
    expect(formatProjectPriceLabel("по запросу")).toBe("Цена по запросу");
    expect(formatProjectPriceLabel("Уточнить у производителя")).toBe("Уточнить у производителя");
  });

  it("does not expose missing facts as zero-valued characteristics", () => {
    expect(getProjectFactLabels(project({ beds: 0, baths: 0, floors: 0 }))).toEqual(["46,4 м²"]);
    expect(getProjectFactLabels(project({ productType: "bath", floors: 1 }))).toEqual([
      "46,4 м²",
      "парная",
      "под ключ",
      "1 этаж",
    ]);
  });
});
