import { describe, expect, it } from "vitest";
import { partnerServiceList } from "@/data/partnerServices";

describe("partner service landing registry", () => {
  it("contains every product landing from the manufacturer offer", () => {
    expect(partnerServiceList.map((service) => service.path)).toEqual([
      "/partner/free-placement/",
      "/partner/sales-commission/",
      "/partner/manufacturer-website/",
      "/partner/renderings/",
      "/partner/business-placement/",
    ]);
  });

  it("keeps paths and ids unique and provides SEO and FAQ content", () => {
    expect(new Set(partnerServiceList.map((service) => service.id)).size).toBe(partnerServiceList.length);
    expect(new Set(partnerServiceList.map((service) => service.path)).size).toBe(partnerServiceList.length);

    partnerServiceList.forEach((service) => {
      expect(service.seoTitle.length).toBeGreaterThan(20);
      expect(service.seoDescription.length).toBeGreaterThan(60);
      expect(service.faq.length).toBeGreaterThanOrEqual(6);
    });
  });
});
