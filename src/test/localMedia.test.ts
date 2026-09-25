import { describe, expect, it } from "vitest";
import { projects, sourceProjects, makersById } from "@/data/projects";
import { localMedia, UNAVAILABLE_MEDIA } from "@/lib/localMedia";

describe("own-server catalog media", () => {
  it("serves every published project image locally while preserving source provenance", () => {
    for (const project of projects) {
      const source = sourceProjects.find(item => item.id === project.id)!;
      expect(project.gallery).toHaveLength(source.gallery.length);
      project.gallery.forEach((image, index) => {
        expect(image.image, `${project.id}: ${image.image}`).toMatch(/^\/(?!\/)|^data:image\//);
        expect(image).toEqual({ ...source.gallery[index], image: localMedia(source.gallery[index].image) });
      });
    }
  });

  it("serves manufacturer logos, completed objects and video posters locally", () => {
    for (const maker of Object.values(makersById)) {
      const images = [maker.logo, ...(maker.profile?.builtObjects ?? []).map(item => item.src), ...(maker.profile?.social?.youtubeVideos ?? []).map(item => item.thumbnail)].filter(Boolean);
      for (const image of images) expect(image, `${maker.id}: ${image}`).toMatch(/^\/(?!\/)|^data:image\//);
      if (maker.profile?.schemaLogoUrl) expect(new URL(maker.profile.schemaLogoUrl).hostname).toBe("xn--80afg0abehb3ak.xn--p1ai");
    }
  });

  it("leaves existing local assets unchanged", () => {
    expect(localMedia("/assets/photo.webp")).toBe("/assets/photo.webp");
  });

  it("never falls back to a third-party request for an unimported asset", () => {
    expect(localMedia("https://unimported.example/photo.jpg")).toBe(UNAVAILABLE_MEDIA);
    expect(localMedia("//unimported.example/photo.jpg")).toBe(UNAVAILABLE_MEDIA);
  });
});
