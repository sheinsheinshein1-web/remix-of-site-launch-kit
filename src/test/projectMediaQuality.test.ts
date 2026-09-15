import { describe, expect, it } from "vitest";
import { manufacturerRegistry } from "@/data/manufacturers";
import { generatedProjectMedia, generatedProjectMediaMeta } from "@/data/generatedProjectMedia";
import { projects } from "@/data/projects";

const suspiciousMediaPattern = /(?:logo|favicon|icon|(?:^|[\/_-])icn|avatar|promocode|promo[_-]|empty|captcha|qr[_-]|social|youtube|rutube|looo|\.(?:js|css|mjs|map|svg|gif|mp4|webm)$)/iu;

describe("project media quality gate", () => {
  const auditedProjects = projects.filter((project) => manufacturerRegistry[project.manufacturerId]?.profile?.sourceAudit);

  it("covers the full Yekaterinburg source-audited slice", () => {
    expect(Object.values(manufacturerRegistry).filter((maker) => maker.profile?.sourceAudit)).toHaveLength(16);
    expect(auditedProjects).toHaveLength(238);
    expect(generatedProjectMediaMeta.projectCount).toBe(Object.keys(generatedProjectMedia).length);
  });

  it("never presents a known logo, icon, or promo asset as the first project image", () => {
    for (const project of auditedProjects) {
      expect(project.gallery.length, `${project.manufacturerId}/${project.id} has no media`).toBeGreaterThan(0);
      expect(project.gallery[0]?.image, `${project.manufacturerId}/${project.id} starts with a fallback asset`)
        .not.toMatch(suspiciousMediaPattern);
    }
  });

  it("keeps generated galleries bounded, unique, and free of service assets", () => {
    for (const [projectId, gallery] of Object.entries(generatedProjectMedia)) {
      expect(gallery.length, `${projectId} generated gallery is empty`).toBeGreaterThan(0);
      expect(gallery.length, `${projectId} generated gallery is unbounded`).toBeLessThanOrEqual(10);
      expect(new Set(gallery.map((item) => item.image)).size, `${projectId} generated gallery has duplicates`)
        .toBe(gallery.length);
      for (const item of gallery) expect(item.image).not.toMatch(suspiciousMediaPattern);
    }
  });

  it("prevents the singleton-gallery regression that exposed the pipeline gap", () => {
    for (const manufacturerId of ["sq-modyl", "exmodule"]) {
      const manufacturerProjects = auditedProjects.filter((project) => project.manufacturerId === manufacturerId);
      expect(manufacturerProjects.length).toBeGreaterThan(0);
      for (const project of manufacturerProjects) {
        expect(project.gallery.length, `${manufacturerId}/${project.id} still has a singleton gallery`).toBeGreaterThan(1);
      }
    }
  });
});
