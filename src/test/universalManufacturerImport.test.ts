import { describe, expect, it } from "vitest";
import {
  detectSitePlatform,
  discoverProjectUrls,
  extractProjectDraft,
  extractSameOriginLinks,
  extractSitemapLocations,
  scoreProjectUrl,
} from "../../scripts/universal-manufacturer-import.mjs";
import { evaluateReleaseGate } from "../../scripts/validate-manufacturer-package.mjs";

describe("universal manufacturer import", () => {
  it("detects common CMS families instead of manufacturer ids", () => {
    expect(detectSitePlatform('<script src="https://static.tildacdn.com/js/tilda-blocks.js"></script>')).toBe("tilda");
    expect(detectSitePlatform('<link href="/wp-content/themes/site.css">')).toBe("wordpress");
    expect(detectSitePlatform('<script src="/bitrix/js/main/core.js"></script>')).toBe("bitrix");
    expect(detectSitePlatform("<main>Обычная страница</main>")).toBe("html");
  });

  it("extracts only same-origin links and sitemap locations", () => {
    const html = '<a href="/projects/dom-1/">Дом</a><a href="https://other.test/project/x">Чужой</a>';
    expect(extractSameOriginLinks(html, "https://maker.test/catalog/")).toEqual([
      "https://maker.test/projects/dom-1/",
    ]);
    expect(extractSitemapLocations(
      "<urlset><url><loc>https://maker.test/projects/dom-1/</loc></url></urlset>",
      "https://maker.test/sitemap.xml",
    )).toEqual(["https://maker.test/projects/dom-1/"]);
  });

  it("scores project-like URLs and rejects service pages", () => {
    expect(scoreProjectUrl("https://maker.test/projects/modulnyy-dom-60/", "https://maker.test/")).toBeGreaterThanOrEqual(3);
    expect(scoreProjectUrl("https://maker.test/contacts/", "https://maker.test/")).toBeLessThan(0);
  });

  it("discovers project pages through sitemap and catalog without site-specific rules", async () => {
    const pages = new Map([
      ["https://maker.test/catalog/", '<a href="/catalog/dom-60/">Дом 60</a><a href="/contacts/">Контакты</a>'],
      ["https://maker.test/sitemap.xml", "<urlset><url><loc>https://maker.test/catalog/dom-60/</loc></url></urlset>"],
      ["https://maker.test/catalog/dom-60/", "<h1>Модульный дом 60</h1><p>Площадь: 60 м²</p>"],
    ]);
    const fetcher = async (url: string) => {
      const body = pages.get(url);
      if (!body) throw new Error("404");
      return { url, body, contentType: "text/html" };
    };
    const result = await discoverProjectUrls({
      siteUrl: "https://maker.test/",
      catalogUrl: "https://maker.test/catalog/",
      fetcher,
    });
    expect(result.confirmed.map((item) => item.url)).toEqual(["https://maker.test/catalog/dom-60/"]);
    expect(result.rejected).toEqual([]);
  });

  it("does not treat a project collection heading as a product card", async () => {
    const pages = new Map([
      ["https://maker.test/projects/", '<h1>Проекты домов и бань</h1><p>Дом 60: 60 м²</p>'],
      ["https://maker.test/sitemap.xml", "<urlset><url><loc>https://maker.test/projects/</loc></url></urlset>"],
    ]);
    const fetcher = async (url: string) => {
      const body = pages.get(url);
      if (!body) throw new Error("404");
      return { url, body, contentType: "text/html" };
    };
    const result = await discoverProjectUrls({ siteUrl: "https://maker.test/", catalogUrl: "https://maker.test/projects/", fetcher });
    expect(result.confirmed).toEqual([]);
  });

  it("maps the reference project fields and keeps absent values explicit", () => {
    const html = `
      <script type="application/ld+json">
        {"@type":"Product","name":"Дом 60","offers":{"price":"3640000"},"image":"/house.webp"}
      </script>
      <h1>Модульный дом 60</h1>
      <div>Площадь: 60 м²</div>
      <div>Габариты: 6 × 10 м</div>
      <div>Количество спален: 2</div>
      <div>Количество санузлов: 1</div>
      <div>Срок производства: 30 дней</div>
    `;
    const result = extractProjectDraft({ html, sourceUrl: "https://maker.test/projects/dom-60/" });
    expect(result.name.value).toBe("Дом 60");
    expect(result.productType.value).toBe("house");
    expect(result.price.value).toBe("3 640 000 ₽");
    expect(result.area.value).toBe("60 м²");
    expect(result.bedrooms.value).toBe("2");
    expect(result.bathrooms.value).toBe("1");
    expect(result.floors.status).toBe("not-published");
    expect(result.publicationStatus).toBe("draft");
  });

  it("blocks incomplete media while allowing genuinely unpublished optional facts", () => {
    const project = extractProjectDraft({
      sourceUrl: "https://maker.test/projects/dom-60/",
      html: `
        <script type="application/ld+json">{"@type":"Product","name":"Дом 60","image":["/one.webp","/two.webp"]}</script>
        <h1>Модульный дом 60</h1><p>Площадь: 60 м²</p>
      `,
    });
    const manufacturer = {
      id: "maker",
      publicationStatus: "draft",
      identity: {
        name: { value: "Maker", status: "verified", confidence: 1, sourceUrl: "https://maker.test/", method: "visible-text", evidence: "H1" },
        logo: { value: null, status: "not-published", confidence: 1, sourceUrl: "https://maker.test/", method: "not-found", evidence: "Не найдено" },
      },
      contacts: {
        siteUrl: "https://maker.test/",
        phones: { value: null, status: "not-published", confidence: 1, sourceUrl: "https://maker.test/", method: "not-found", evidence: "Не найдено" },
        emails: { value: null, status: "not-published", confidence: 1, sourceUrl: "https://maker.test/", method: "not-found", evidence: "Не найдено" },
        telegram: { value: null, status: "not-published", confidence: 1, sourceUrl: "https://maker.test/", method: "not-found", evidence: "Не найдено" },
        youtube: { value: null, status: "not-published", confidence: 1, sourceUrl: "https://maker.test/", method: "not-found", evidence: "Не найдено" },
      },
      catalog: { sourceUrl: "https://maker.test/projects/", discoveredProjectCount: 1 },
      legal: {
        operator: { value: null, status: "not-published", confidence: 1, sourceUrl: "https://maker.test/", method: "not-found", evidence: "Не найдено" },
        inn: { value: null, status: "not-published", confidence: 1, sourceUrl: "https://maker.test/", method: "not-found", evidence: "Не найдено" },
        ogrn: { value: null, status: "not-published", confidence: 1, sourceUrl: "https://maker.test/", method: "not-found", evidence: "Не найдено" },
      },
      production: { address: { value: null, status: "not-published", confidence: 1, sourceUrl: "https://maker.test/", method: "not-found", evidence: "Не найдено" } },
      reviews: { externalProfile: { value: null, status: "not-published", confidence: 1, sourceUrl: "https://maker.test/", method: "not-found", evidence: "Не найдено" } },
      builtObjects: {
        sourcePage: { value: null, status: "not-published", confidence: 1, sourceUrl: "https://maker.test/", method: "not-found", evidence: "Не найдено" },
        media: [],
      },
    };
    const result = evaluateReleaseGate({ manufacturer, projects: [project] });
    expect(result.ready).toBe(true);
    expect(result.blockers).toEqual([]);
    expect(result.warnings.some((warning) => warning.field === "floors")).toBe(true);

    const blocked = evaluateReleaseGate({ manufacturer, projects: [{ ...project, media: project.media.slice(0, 1) }] });
    expect(blocked.ready).toBe(false);
    expect(blocked.blockers.some((blocker) => blocker.field === "media")).toBe(true);
  });
});
