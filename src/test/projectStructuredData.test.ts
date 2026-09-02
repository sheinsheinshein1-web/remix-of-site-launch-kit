import { describe, expect, it } from "vitest";
import type { Project } from "@/data/projects";
import { buildProjectProductJsonLd, getProjectPriceAmount } from "@/lib/projectStructuredData";

const project = {
  id: 337,
  name: "FREEDOM NATURI 100",
  price: "по запросу",
  description: "Описание проекта",
  descriptionLong: "Подробное описание проекта",
  maker: { name: "Freedom Naturi", initials: "FN" },
} as Project;

describe("project structured data", () => {
  it("does not publish incomplete Product markup when the price is not disclosed", () => {
    expect(
      buildProjectProductJsonLd({
        project,
        canonicalPath: "/modulnye-doma/proekty/freedom-naturi-100/",
      }),
    ).toBeNull();
  });

  it("publishes a valid Offer when the project has a numeric price", () => {
    const jsonLd = buildProjectProductJsonLd({
      project: { ...project, price: "от 3 102 000 ₽" },
      canonicalPath: "/modulnye-doma/proekty/twin-house/",
    });

    expect(jsonLd).toMatchObject({
      "@type": "Product",
      offers: {
        "@type": "Offer",
        priceCurrency: "RUB",
        price: 3_102_000,
      },
    });
  });

  it("does not accept zero or text-only prices as an offer", () => {
    expect(getProjectPriceAmount("0 ₽")).toBeNull();
    expect(getProjectPriceAmount("по запросу")).toBeNull();
  });
});
