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
  jsonLd,
}: SeoProps) => {
  const canonical = buildCanonicalUrl(canonicalPath);
  const absoluteImage = buildAssetUrl(image);
  const fullTitle = title.length > 60 ? title.slice(0, 57) + "…" : title;
  const fullDescription = description.length > 160 ? description.slice(0, 157) + "…" : description;
  const ldArray = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <link rel="canonical" href={canonical} />
      {noIndex && <meta name="robots" content="noindex,nofollow" />}

      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={absoluteImage} />
      <meta property="og:site_name" content="многоместа.рф" />
      <meta property="og:locale" content="ru_RU" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
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
