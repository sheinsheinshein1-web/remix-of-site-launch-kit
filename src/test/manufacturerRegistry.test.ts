import { describe, expect, it } from "vitest";
import { manufacturerRegistry, manufacturerSchema, manufacturers } from "@/data/manufacturers";
import {
  allProjects,
  getManufacturerById,
  getManufacturerProjectCount,
  getProjectsByManufacturerId,
} from "@/data/projects";

describe("manufacturer registry", () => {
  it("contains a unique validated record for every project manufacturer", () => {
    expect(new Set(manufacturers.map((manufacturer) => manufacturer.id)).size).toBe(manufacturers.length);

    for (const project of allProjects) {
      expect(manufacturerRegistry[project.manufacturerId], `project ${project.id}`).toBeDefined();
    }
  });

  it("keeps company data and project source URLs as separate fields", () => {
    const platformaProject = allProjects.find(
      (project) => project.manufacturerId === "platforma" && project.sourceUrl,
    );

    expect(platformaProject).toBeDefined();
    expect(platformaProject?.sourceUrl).not.toBe(manufacturerRegistry.platforma.siteUrl);
    expect(manufacturerRegistry.platforma.siteUrl).toBe("https://platforma-modul.ru/");
  });

  it("provides one canonical Platforma entity to every consumer", () => {
    const platforma = getManufacturerById("platforma");

    expect(platforma?.verified).toBe(true);
    expect(platforma?.externalRating?.rating).toBe(4.3);
    expect(platforma?.externalRating?.totalCount).toBe(5);
    expect(platforma?.profile?.coordinates).toEqual({ lat: 56.89275, lon: 60.783923 });
    expect(platforma?.profile?.legal?.inn).toBe("6678135856");
    expect(platforma?.profile?.builtObjects).toHaveLength(11);
    expect(platforma?.profile?.social?.youtubeVideos).toHaveLength(6);
    expect(platforma?.profile?.seo?.title).toContain("Платформа");
    expect(platforma?.logoFit).toBe("cover");
    expect(platforma?.logoBackground).toBe("transparent");
    expect(platforma?.profile?.projectTabs).toEqual(["houses", "baths", "business"]);
  });

  it("stores optional profile sections on the manufacturer instead of in the page component", () => {
    const bygge = getManufacturerById("bygge");

    expect(bygge?.logo).toBeTruthy();
    expect(bygge?.logoFit).toBe("cover");
    expect(bygge?.logoBackground).toBe("transparent");
    expect(bygge?.profile?.about?.[0]).toContain("производитель модульных домов");
    expect(bygge?.profile?.coordinates).toEqual({ lat: 56.7923281, lon: 60.7321339 });
    expect(bygge?.profile?.mapKind).toBe("office");
    expect(bygge?.profile?.sourceAudit?.legal.status).toBe("imported");
    expect(bygge?.profile?.legal?.inn).toBe("661701160979");
    expect(bygge?.profile?.legal?.ogrn).toBe("309661703600027");
    expect(bygge?.profile?.social?.telegramChannel).toBe("bygge_rus");
    expect(bygge?.profile?.social?.youtubeVideos).toHaveLength(6);
    expect(bygge?.profile?.sourceAudit?.builtObjects.status).toBe("imported");
    expect(bygge?.profile?.builtObjects).toHaveLength(6);
    expect(bygge?.profile?.projectTabs).toEqual(["houses", "baths", "business"]);
  });

  it("keeps exceptional logo presentation in the manufacturer registry", () => {
    expect(getManufacturerById("blackmodule")?.logoBackground).toBe("dark");
  });

  it("derives project lists and counts from manufacturerId", () => {
    const projects = getProjectsByManufacturerId("platforma");

    expect(projects.length).toBeGreaterThan(0);
    expect(projects.every((project) => project.manufacturerId === "platforma")).toBe(true);
    expect(getManufacturerProjectCount("platforma")).toBe(projects.length);
  });

  it("keeps positioning and SEO titles unique for the enriched Yekaterinburg profiles", () => {
    const profileIds = ["platforma", "bygge", "glavles", "fps-modul", "budushiy-dom"] as const;
    const profiles = profileIds.map((id) => getManufacturerById(id)?.profile);
    const headlines = profiles.map((profile) => profile?.headlineSuffix);
    const intros = profiles.map((profile) => profile?.intro);
    const seoTitles = profiles.map((profile) => profile?.seo?.title);

    expect(headlines.every(Boolean)).toBe(true);
    expect(intros.every(Boolean)).toBe(true);
    expect(seoTitles.every(Boolean)).toBe(true);
    expect(new Set(headlines).size).toBe(profileIds.length);
    expect(new Set(intros).size).toBe(profileIds.length);
    expect(new Set(seoTitles).size).toBe(profileIds.length);
  });

  it("keeps the complete Budushiy Dom catalog and legal data in the shared template", () => {
    const manufacturer = getManufacturerById("budushiy-dom");
    const projects = getProjectsByManufacturerId("budushiy-dom");

    expect(manufacturer?.verified).toBe(true);
    expect(manufacturer?.logo).toBeTruthy();
    expect(manufacturer?.profile?.mapKind).toBe("office");
    expect(manufacturer?.profile?.projectTabs).toEqual(["houses", "baths", "business"]);
    expect(manufacturer?.profile?.legal?.legalName).toBe("ООО «ЛЕСХИМЭКСПОРТ»");
    expect(manufacturer?.profile?.legal?.enforcementProceedings).toEqual({ open: 0, completed: 5 });
    expect(manufacturer?.profile?.legal?.unfairSuppliersRegistry).toBe("Не числится");
    expect(manufacturer?.externalRating).toBeUndefined();
    expect(manufacturer?.profile?.builtObjects).toHaveLength(5);
    expect(projects).toHaveLength(32);
    expect(projects.filter((project) => project.productType === "bath")).toHaveLength(3);
    expect(projects.filter((project) => project.productType !== "bath").every((project) => project.useCases?.includes("rental"))).toBe(true);

    const houseNumberTwo = projects.find((project) => project.id === 479);
    expect(houseNumberTwo?.term).toBe("по запросу");
    expect(houseNumberTwo?.gallery).toEqual([
      expect.objectContaining({ type: "plan", fit: "contain" }),
    ]);
  });

  it("blocks enriched manufacturers from being declared complete before every source is audited", () => {
    const enrichedIds = [
      "platforma", "bygge", "glavles", "fps-modul", "budushiy-dom",
      "vek-trad",
      "bm-dom", "sq-modyl", "exmodule", "russian-modular-house", "da-home",
      "moduldom-ural", "lesprom96", "e-module-stroy", "prefabia", "zhar-parych",
    ];

    for (const manufacturerId of enrichedIds) {
      const manufacturer = getManufacturerById(manufacturerId);
      const audit = manufacturer?.profile?.sourceAudit;
      const projects = getProjectsByManufacturerId(manufacturerId);

      expect(audit, `${manufacturerId}: source audit is missing`).toBeDefined();
      expect(projects, `${manufacturerId}: official catalog is incomplete`).toHaveLength(audit!.catalog.expectedProjectCount);

      if (audit!.legal.status === "imported") {
        expect(manufacturer?.profile?.legal, `${manufacturerId}: imported legal data is missing`).toBeDefined();
      }
      if (audit!.reviews.status === "imported") {
        expect(manufacturer?.externalRating, `${manufacturerId}: imported external reviews are missing`).toBeDefined();
      }
      if (audit!.builtObjects.status === "imported") {
        expect(manufacturer?.profile?.builtObjects?.length, `${manufacturerId}: imported portfolio is empty`).toBeGreaterThan(0);
      }
      if (audit!.production.status === "imported") {
        expect(manufacturer?.productionAddress, `${manufacturerId}: imported location has no address`).toBeTruthy();
      }
      if (audit!.social.youtube.status === "imported") {
        expect(manufacturer?.profile?.social?.youtubeVideos.length, `${manufacturerId}: imported YouTube feed is empty`).toBeGreaterThan(0);
      }
      if (audit!.social.telegram.status === "imported") {
        expect(manufacturer?.profile?.social?.telegramChannel, `${manufacturerId}: imported Telegram channel is missing`).toBeTruthy();
        expect(manufacturer?.profile?.social?.telegramPosts.length, `${manufacturerId}: imported Telegram feed is empty`).toBeGreaterThan(0);
      }
    }
  });

  it("keeps all sixteen Yekaterinburg manufacturers on the canonical profile contract", () => {
    const manufacturerIds = Object.values(manufacturerRegistry)
      .filter((manufacturer) => manufacturer.profile?.sourceAudit)
      .map((manufacturer) => manufacturer.id);

    expect(manufacturerIds).toHaveLength(16);

    for (const manufacturerId of manufacturerIds) {
      const manufacturer = getManufacturerById(manufacturerId);
      const profile = manufacturer?.profile;
      const projects = getProjectsByManufacturerId(manufacturerId);

      expect(profile?.sourceAudit, `${manufacturerId}: source audit is missing`).toBeDefined();
      expect(profile?.intro, `${manufacturerId}: profile intro is missing`).toBeTruthy();
      expect(profile?.about?.length, `${manufacturerId}: company description is missing`).toBeGreaterThan(0);
      expect(profile?.seo, `${manufacturerId}: SEO template is missing`).toBeDefined();
      expect(profile?.projectTabs?.length, `${manufacturerId}: project grouping is missing`).toBeGreaterThan(0);
      expect(projects, `${manufacturerId}: catalog count differs from source audit`).toHaveLength(
        profile!.sourceAudit!.catalog.expectedProjectCount,
      );

      for (const project of projects) {
        expect(project.sourceUrl, `${manufacturerId}/${project.id}: source URL is missing`).toMatch(/^https:\/\//);
        expect(project.gallery.length, `${manufacturerId}/${project.id}: gallery is empty`).toBeGreaterThan(0);
        expect(project.descriptionLong.trim().length, `${manufacturerId}/${project.id}: project description is empty`).toBeGreaterThan(0);
        expect(project.technology, `${manufacturerId}/${project.id}: non-canonical technology value`).not.toMatch(/технология$/iu);
        expect(project.area, `${manufacturerId}/${project.id}: legacy unknown-area wording`).not.toMatch(/площадь уточняется/iu);
      }
    }
  });

  it("never exposes internal legal-audit placeholders as customer-facing facts", () => {
    for (const manufacturer of Object.values(manufacturerRegistry)) {
      const legal = manufacturer.profile?.legal;
      if (!legal) continue;
      expect(legal.arbitrationCases, `${manufacturer.id}: arbitration placeholder`).not.toMatch(/не проверено/iu);
      expect(legal.unfairSuppliersRegistry, `${manufacturer.id}: supplier-registry placeholder`).not.toMatch(/не проверено/iu);
    }
  });

  it("keeps all ten September manufacturer imports complete and correctly grouped", () => {
    const expectedCounts = {
      "bm-dom": 5,
      "sq-modyl": 12,
      exmodule: 14,
      "russian-modular-house": 20,
      "da-home": 25,
      "moduldom-ural": 22,
      lesprom96: 5,
      "e-module-stroy": 9,
      prefabia: 18,
      "zhar-parych": 6,
    } as const;

    for (const [manufacturerId, expectedCount] of Object.entries(expectedCounts)) {
      const manufacturer = getManufacturerById(manufacturerId);
      const projects = getProjectsByManufacturerId(manufacturerId);

      expect(manufacturer?.profile?.sourceAudit?.catalog.expectedProjectCount).toBe(expectedCount);
      expect(projects, manufacturerId).toHaveLength(expectedCount);
      expect(projects.every((project) => project.sourceUrl?.startsWith(manufacturer!.siteUrl!)), manufacturerId).toBe(true);
    }

    expect(getProjectsByManufacturerId("e-module-stroy").every((project) => project.productType === "bath")).toBe(true);
    expect(getProjectsByManufacturerId("moduldom-ural").filter((project) => project.productType === "bath")).toHaveLength(5);
    expect(getProjectsByManufacturerId("prefabia").filter((project) => project.productType === "bath")).toHaveLength(7);
    expect(getProjectsByManufacturerId("sq-modyl").filter((project) => project.useCases?.includes("glamping"))).toHaveLength(4);
    expect(getManufacturerById("sq-modyl")?.externalRating).toMatchObject({ rating: 4.6, totalCount: 18 });
    expect(getManufacturerById("moduldom-ural")?.externalRating).toMatchObject({ rating: 4, totalCount: 11 });
    expect(getManufacturerById("prefabia")?.externalRating).toMatchObject({ rating: 4.5, totalCount: 9 });

    const prefabia = getManufacturerById("prefabia");
    expect(prefabia?.profile?.sourceAudit?.legal.status).toBe("imported");
    expect(prefabia?.profile?.legal).toMatchObject({
      legalName: "ИП Ларионова Алена Витальевна",
      inn: "666203610134",
      ogrn: "323665800015970",
    });
    expect(prefabia?.profile?.sourceAudit?.builtObjects.status).toBe("imported");
    expect(prefabia?.profile?.builtObjects).toHaveLength(12);
    expect(prefabia?.profile?.about).toHaveLength(5);
    expect(prefabia?.profile?.about?.join(" ").split(/\s+/).length).toBeGreaterThan(130);
  });

  it("keeps every PREFABIA project tied to its own official photo and plan", () => {
    const projects = getProjectsByManufacturerId("prefabia");
    const primaryImages = projects.map((project) => project.gallery[0]?.image);

    expect(projects).toHaveLength(18);
    expect(new Set(primaryImages).size).toBe(projects.length);
    projects.forEach((project) => {
      expect(project.gallery[0]).toMatchObject({ type: "photo" });
      expect(project.gallery[0]?.image).toMatch(/^https:\/\/prefabia\.ru\/UPLOAD\//);
      expect(project.gallery.some((item) => item.type === "plan"), `${project.name}: plan is missing`).toBe(true);
    });

    expect(projects.find((project) => project.id === 616)).toMatchObject({
      dimensions: "6,5 × 9 м",
      gallery: [
        expect.objectContaining({ image: "https://prefabia.ru/UPLOAD/2026/05/10/e9d2337f1ccf5b84768797ea406408139cf2" }),
        expect.objectContaining({ image: "https://prefabia.ru/UPLOAD/2026/05/10/88879f572dadbe149e2b384baf01d7cea755", type: "plan" }),
      ],
    });
  });

  it("keeps internal import and crawl notes out of public manufacturer copy", () => {
    const forbiddenPublicCopy = /sitemap|404|импорт|перенес|этап проверки|этап редактор/i;

    for (const manufacturer of manufacturers) {
      for (const paragraph of manufacturer.profile?.about ?? []) {
        expect(paragraph, manufacturer.id).not.toMatch(forbiddenPublicCopy);
      }
    }
  });

  it("rejects a future enriched profile when its source audit is missing", () => {
    const result = manufacturerSchema.safeParse({
      id: "future-maker",
      name: "Future Maker",
      initials: "FM",
      profile: {
        groupedProjects: true,
        projectTabs: ["houses", "baths", "business"],
      },
    });

    expect(result.success).toBe(false);
  });

  it("keeps the complete Bygge catalog, including baths", () => {
    const byggeProjects = getProjectsByManufacturerId("bygge");

    expect(byggeProjects).toHaveLength(23);
    expect(byggeProjects.filter((project) => project.productType === "bath")).toHaveLength(2);
    expect(byggeProjects.filter((project) => project.productType === "house-bath")).toHaveLength(3);
    expect(byggeProjects.map((project) => project.name)).toEqual(
      expect.arrayContaining(["БРАУНИ", "ПРИНЦ", "ПАТИО 2.0", "ГРАНД СЕНАТ"]),
    );
    expect(getManufacturerProjectCount("bygge")).toBe(23);
  });

  it("keeps the complete FPS Modul catalog and profile in the shared manufacturer template", () => {
    const fps = getManufacturerById("fps-modul");
    const fpsProjects = getProjectsByManufacturerId("fps-modul");

    expect(fps?.verified).toBe(true);
    expect(fps?.logo).toBeTruthy();
    expect(fps?.profile?.projectTabs).toEqual(["houses", "baths", "business"]);
    expect(fps?.profile?.legal?.inn).toBe("6678111397");
    expect(fps?.profile?.coordinates).toEqual({ lat: 56.902718, lon: 60.774852 });
    expect(fps?.profile?.social?.youtubeVideos).toHaveLength(6);
    expect(fps?.profile?.social?.telegramPosts).toHaveLength(0);
    expect(fpsProjects).toHaveLength(19);
    expect(fpsProjects.filter((project) => project.productType === "bath")).toHaveLength(7);
    expect(fpsProjects.map((project) => project.name)).toEqual(
      expect.arrayContaining(["АртХаус AH 281", "Барнхаус BH 505", "Баня Фьорд F 405"]),
    );
    expect(getManufacturerProjectCount("fps-modul")).toBe(19);
  });

  it("keeps the complete Glavles catalog and profile in the shared manufacturer template", () => {
    const glavles = getManufacturerById("glavles");
    const glavlesProjects = getProjectsByManufacturerId("glavles");

    expect(glavles?.verified).toBe(true);
    expect(glavles?.logo).toContain("glavles.com/img/favicon/");
    expect(glavles?.profile?.projectTabs).toEqual(["houses", "baths", "business"]);
    expect(glavles?.profile?.legal?.inn).toBe("6651004503");
    expect(glavles?.profile?.coordinates).toEqual({ lat: 57.6342516, lon: 64.3762247 });
    expect(glavles?.profile?.social?.youtubeVideos).toHaveLength(6);
    expect(glavles?.profile?.social?.telegramPosts).toEqual([]);
    expect(glavles?.profile?.builtObjects).toBeUndefined();
    expect(glavlesProjects).toHaveLength(13);
    expect(glavlesProjects.map((project) => project.name)).toEqual(
      expect.arrayContaining(["Проект 8-12-м", "Проект 8-68-м", "Проект 8-87-м"]),
    );
    expect(getManufacturerProjectCount("glavles")).toBe(13);
  });
});
