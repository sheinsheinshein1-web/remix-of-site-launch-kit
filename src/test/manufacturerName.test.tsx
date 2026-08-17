import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import ManufacturerName from "@/components/ManufacturerName";

describe("ManufacturerName", () => {
  it("shows the shared verified badge for a verified manufacturer", () => {
    const markup = renderToStaticMarkup(<ManufacturerName makerId="bygge" name="Bygge" />);

    expect(markup).toContain("Bygge");
    expect(markup).toContain("Проверено");
  });

  it("does not invent a verified badge for an unverified manufacturer", () => {
    const markup = renderToStaticMarkup(<ManufacturerName makerId="glavles" name="Главлес" />);

    expect(markup).toContain("Главлес");
    expect(markup).not.toContain("Проверено");
  });
});
