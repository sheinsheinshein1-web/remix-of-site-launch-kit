import { describe, expect, it } from "vitest";
import { manufacturerRegistry } from "@/data/manufacturers";
import { projects } from "@/data/projects";
import { auditManufacturerPublicationQuality } from "@/lib/manufacturerPublicationQuality";

const readinessFor = (manufacturerId: string) => auditManufacturerPublicationQuality(
  manufacturerRegistry[manufacturerId],
  projects.filter((project) => project.manufacturerId === manufacturerId),
);

describe("manufacturer publication readiness", () => {
  it("evaluates every audited Yekaterinburg manufacturer with one contract", () => {
    const audited = Object.values(manufacturerRegistry).filter((manufacturer) => manufacturer.profile?.sourceAudit);
    expect(audited).toHaveLength(16);

    for (const manufacturer of audited) {
      const readiness = readinessFor(manufacturer.id);
      expect(readiness.manufacturerId).toBe(manufacturer.id);
      expect(["ready", "source-limited", "needs-work"]).toContain(readiness.status);
    }
  });

  it("does not allow Bygge to regress to a profile without legal data or completed objects", () => {
    const bygge = manufacturerRegistry.bygge;
    const broken = {
      ...bygge,
      profile: {
        ...bygge.profile!,
        legal: undefined,
        builtObjects: undefined,
      },
    };
    const readiness = auditManufacturerPublicationQuality(
      broken,
      projects.filter((project) => project.manufacturerId === "bygge"),
    );

    expect(readiness.status).toBe("needs-work");
    expect(readiness.issues.map((issue) => issue.code)).toEqual(expect.arrayContaining([
      "missing-imported-legal",
      "missing-imported-objects",
    ]));
  });

  it("keeps Bygge free of manufacturer-profile blockers", () => {
    const readiness = readinessFor("bygge");
    const profileBlockers = readiness.issues.filter((issue) => (
      issue.severity === "blocking" && issue.projectId === undefined
    ));
    expect(profileBlockers).toEqual([]);
  });

  it("keeps SQ-MODYL free of manufacturer-profile blockers", () => {
    const readiness = readinessFor("sq-modyl");
    const profileBlockers = readiness.issues.filter((issue) => (
      issue.severity === "blocking" && issue.projectId === undefined
    ));
    expect(profileBlockers).toEqual([]);
  });
});
