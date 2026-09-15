import { describe, expect, it } from "vitest";
import {
  getProjectTechnologyLabel,
  matchesProjectTechnology,
  PROJECT_TECHNOLOGY,
} from "@/lib/projectTechnology";

describe("project technology vocabulary", () => {
  it("uses one user-facing label for modular technology", () => {
    expect(PROJECT_TECHNOLOGY.modular.label).toBe("Модульная");
    expect(getProjectTechnologyLabel(PROJECT_TECHNOLOGY.modular.value)).toBe("Модульная");
    expect(getProjectTechnologyLabel("Модульная технология")).toBe("Модульная");
  });

  it("keeps legacy filter links compatible with the canonical label", () => {
    expect(matchesProjectTechnology("Модульный дом", "Модульная")).toBe(true);
    expect(matchesProjectTechnology("Каркасный", "Модульная")).toBe(false);
  });
});
