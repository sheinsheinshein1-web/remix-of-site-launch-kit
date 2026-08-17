import { describe, expect, it } from "vitest";
import { getLegalDocument, legalDocuments, parseLegalDocument } from "@/data/legalDocuments";

describe("legal documents registry", () => {
  it("publishes the four reference documents", () => {
    expect(legalDocuments.map((document) => document.slug)).toEqual([
      "rules",
      "terms",
      "privacy",
      "cookies",
    ]);
    expect(legalDocuments.map((document) => document.path)).toEqual([
      "/legal/rules",
      "/legal/terms",
      "/legal/privacy",
      "/legal/cookies",
    ]);
  });

  it("keeps the supplied legal texts and their sections", () => {
    for (const document of legalDocuments) {
      const parsed = parseLegalDocument(document.source);
      expect(parsed.title.length).toBeGreaterThan(0);
      expect(parsed.metadata).toHaveLength(2);
      expect(parsed.sections.length).toBeGreaterThan(0);
      expect(document.source).toContain("ООО «МНОГОМЕСТА»");
      expect(document.source).toContain("1269600005058");
      expect(document.source).toContain("Редакция от «15» июля 2026 г.");
    }
  });

  it("does not expose a contract as a legal reference page", () => {
    expect(getLegalDocument("business-placement")).toBeUndefined();
    expect(getLegalDocument("sales-commission")).toBeUndefined();
  });
});
