import { Helmet } from "react-helmet-async";
import { buildAssetUrl, buildCanonicalUrl, DEFAULT_OG_IMAGE } from "@/lib/seo";

interface SeoProps {
  title: string;
  description: string;
  /** Path starting with "/" or full URL. Defaults to current location. */
  canonicalPath?: string;
  image?: string;
  /** "website" | "article" | "product" */
  type?: string;
  noIndex?: boolean;
  noFollow?: boolean;
  /** Any number of JSON-LD objects to inject as <script type="application/ld+json"> */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

const Seo = ({
  title,
  description,
  canonicalPath,
  image = DEFAULT_OG_IMAGE,
  type = "website",
  noIndex = false,
  noFollow = noIndex,
  jsonLd,
}: SeoProps) => {
  const canonical = buildCanonicalUrl(canonicalPath);
  const absoluteImage = buildAssetUrl(image);
  const ldArray = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];
  const robots = noIndex || noFollow
    ? `${noIndex ? "noindex" : "index"},${noFollow ? "nofollow" : "follow"}`
    : "index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1";

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta name="robots" content={robots} />
      <meta name="googlebot" content={robots} />

      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={absoluteImage} />
      <meta property="og:site_name" content="многоместа.рф" />
      <meta property="og:locale" content="ru_RU" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteImage} />

      {ldArray.map((data, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      ))}
    </Helmet>
  );
};

export default Seo;
