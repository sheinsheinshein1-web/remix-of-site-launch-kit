import { describe, expect, it } from "vitest";
import { getManufacturerById, getProjectsByManufacturerId } from "@/data/projects";
import {
  getManufacturerSocialSources,
  groupManufacturerProjects,
  manufacturerProjectTabLabels,
  manufacturerSectionLabels,
} from "@/lib/manufacturerPresentation";
import {
  formatEnforcementProceedings,
  formatManufacturerEnforcementProceedings,
  getPublicLegalSources,
} from "@/lib/manufacturerLegal";

describe("manufacturer presentation rules", () => {
  it("keeps editorial brand-to-entity evidence out of the public legal source list", () => {
    expect(getPublicLegalSources([
      { label: "ЕГРИП ФНС", href: "https://egrul.nalog.ru/" },
      { label: "Реквизиты на сайте PREFABIA", href: "https://prefabia.ru/kontakty/" },
      { label: "Связь бренда с ИП", href: "https://example.com/article" },
      { label: "ФССП", href: "https://fssp.gov.ru/iss/ip" },
    ])).toEqual([
      { label: "ЕГРИП ФНС", href: "https://egrul.nalog.ru/" },
      { label: "ФССП", href: "https://fssp.gov.ru/iss/ip" },
    ]);
  });

  it("distinguishes current and completed enforcement proceedings", () => {
    expect(formatEnforcementProceedings({ open: 0, completed: 0 })).toBe("Не обнаружено");
    expect(formatEnforcementProceedings({ open: 0, completed: 1 })).toBe("Нет открытых · 1 завершено");
    expect(formatEnforcementProceedings({ open: 2, completed: 3 })).toBe("Открыто: 2 · завершено: 3");
    expect(formatManufacturerEnforcementProceedings({ open: 0, completed: 0 })).toBe("Не обнаружено");
  });

  it("keeps canonical manufacturer labels in one place", () => {
    expect(manufacturerSectionLabels.legal).toBe("Юридическая информация");
    expect(Object.values(manufacturerProjectTabLabels)).toEqual(["Дома", "Бани", "Для бизнеса"]);
  });

  it("keeps the YouTube source label for manufacturers without Telegram", () => {
    const glavles = getManufacturerById("glavles");
    const fps = getManufacturerById("fps-modul");

    expect(glavles?.profile?.social && getManufacturerSocialSources(glavles.profile.social)).toEqual(["youtube"]);
    expect(fps?.profile?.social && getManufacturerSocialSources(fps.profile.social)).toEqual(["youtube"]);
  });

  it.each([
    ["platforma", { houses: 9, baths: 2, business: 3 }],
    ["bygge", { houses: 21, baths: 2, business: 4 }],
    ["glavles", { houses: 13, baths: 0, business: 13 }],
    ["fps-modul", { houses: 12, baths: 7, business: 7 }],
    ["budushiy-dom", { houses: 29, baths: 3, business: 29 }],
  ])("separates %s object types and keeps business as an overlapping use case", (manufacturerId, expectedCounts) => {
    const projects = getProjectsByManufacturerId(manufacturerId);
    const groups = groupManufacturerProjects(projects);
    const objectTypeIds = [...groups.houses, ...groups.baths].map((project) => project.id);

    expect({
      houses: groups.houses.length,
      baths: groups.baths.length,
      business: groups.business.length,
    }).toEqual(expectedCounts);
    expect(new Set(objectTypeIds).size).toBe(projects.length);
    expect(objectTypeIds).toHaveLength(projects.length);
    expect(groups.business.every((project) => Boolean(project.useCases?.length))).toBe(true);
  });

  it("does not present adaptable Glavles houses as finished baths", () => {
    const projects = getProjectsByManufacturerId("glavles");
    const groups = groupManufacturerProjects(projects);

    expect(projects).toHaveLength(13);
    expect(groups.houses).toHaveLength(13);
    expect(groups.baths).toHaveLength(0);
    expect(groups.business).toHaveLength(13);
    expect(groups.business.map((project) => project.id)).toEqual(expect.arrayContaining(
      projects.map((project) => project.id),
    ));
  });
});
