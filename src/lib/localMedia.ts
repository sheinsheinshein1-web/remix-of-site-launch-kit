import manifest from "@/data/localMediaPaths.json";
import { buildAssetUrl } from "@/lib/seo";
import type { Manufacturer } from "@/data/manufacturers";

const assets: Record<string, string> = manifest;
export const UNAVAILABLE_MEDIA = "/media/unavailable.svg";

/** Source URLs remain in source records; every public surface reads this resolver. */
export const localMedia = (source: string): string => assets[source]
  ?? (/^(?:https?:)?\/\//i.test(source) ? UNAVAILABLE_MEDIA : source);

export function localizeManufacturerMedia(maker: Manufacturer): Manufacturer {
  const profile = maker.profile;
  return {
    ...maker,
    ...(maker.logo ? { logo: localMedia(maker.logo) } : {}),
    ...(profile ? { profile: {
      ...profile,
      ...(profile.schemaLogoUrl ? { schemaLogoUrl: buildAssetUrl(localMedia(profile.schemaLogoUrl)) } : {}),
      ...(profile.builtObjects ? { builtObjects: profile.builtObjects.map(item => ({ ...item, src: localMedia(item.src) })) } : {}),
      ...(profile.social ? { social: { ...profile.social, youtubeVideos: profile.social.youtubeVideos.map(video => ({ ...video, thumbnail: localMedia(video.thumbnail) })) } } : {}),
    } } : {}),
  };
}
