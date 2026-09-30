import { cleanup, render } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import RegionPage from "@/pages/RegionPage";

const { seoProps } = vi.hoisted(() => ({ seoProps: vi.fn((_props: Record<string, unknown>) => null) }));
vi.mock("@/components/Seo", () => ({ default: seoProps }));
vi.mock("@/components/Header", () => ({ default: () => null }));
vi.mock("@/components/Footer", () => ({ default: () => null }));
vi.mock("@/pages/Catalog", () => ({ default: () => null }));

afterEach(() => { cleanup(); seoProps.mockClear(); });

describe("regional catalog indexing", () => {
  it.each([
    ["", false],
    ["?maxPrice=3000000", true],
    ["?beds=2&type=house", true],
    ["?q=house", true],
  ])("preserves the regional canonical for %s", (search, noIndex) => {
    render(
      <MemoryRouter initialEntries={[`/modulnye-doma/ekaterinburg/${search}`]}>
        <Routes>
          <Route path="/modulnye-doma/:slug/" element={<RegionPage />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(seoProps).toHaveBeenCalled();
    expect(seoProps.mock.calls.at(-1)?.[0]).toEqual(expect.objectContaining({
      canonicalPath: "/modulnye-doma/ekaterinburg/",
      noIndex,
      noFollow: false,
    }));
  });
});
