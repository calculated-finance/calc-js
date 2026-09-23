import { Helmet } from "react-helmet";
import type { ProductSeo } from "./types";

export const ProductSeoHelmet = ({ seo }: { seo: ProductSeo | null }) => {
  if (!seo) return null;

  const openGraph = seo.openGraph;
  const twitter = seo.twitter;
  const openGraphImage = openGraph?.image;

  return (
    <Helmet>
      <html lang={seo.locale ?? "en"} />
      <title>{seo.title}</title>
      <meta name="title" content={seo.title} />
      <meta name="description" content={seo.description} />
      {seo.canonical && <link rel="canonical" href={seo.canonical} />}
      {seo.alternates?.map((alternate) => (
        <link
          key={`${alternate.hrefLang}:${alternate.href}`}
          rel="alternate"
          hrefLang={alternate.hrefLang}
          href={alternate.href}
        />
      ))}
      {seo.robots && <meta name="robots" content={seo.robots} />}

      <meta property="og:title" content={openGraph?.title ?? seo.title} />
      <meta
        property="og:description"
        content={openGraph?.description ?? seo.description}
      />
      {openGraphImage && <meta property="og:image" content={openGraphImage} />}
      {openGraphImage && (
        <meta property="og:image:secure_url" content={openGraphImage} />
      )}
      {openGraph?.imageAlt && (
        <meta property="og:image:alt" content={openGraph.imageAlt} />
      )}
      {openGraph?.imageWidth && (
        <meta property="og:image:width" content={`${openGraph.imageWidth}`} />
      )}
      {openGraph?.imageHeight && (
        <meta property="og:image:height" content={`${openGraph.imageHeight}`} />
      )}
      {openGraph?.url && <meta property="og:url" content={openGraph.url} />}
      <meta property="og:type" content={openGraph?.type ?? "website"} />
      {openGraph?.siteName && (
        <meta property="og:site_name" content={openGraph.siteName} />
      )}
      {openGraph?.locale && (
        <meta property="og:locale" content={openGraph.locale} />
      )}
      {openGraph?.alternateLocales?.map((locale) => (
        <meta key={locale} property="og:locale:alternate" content={locale} />
      ))}

      <meta name="twitter:title" content={twitter?.title ?? seo.title} />
      <meta
        name="twitter:description"
        content={twitter?.description ?? seo.description}
      />
      {twitter?.url && <meta name="twitter:url" content={twitter.url} />}
      <meta
        name="twitter:card"
        content={twitter?.card ?? "summary_large_image"}
      />
      {twitter?.site && <meta name="twitter:site" content={twitter.site} />}
      {twitter?.image && <meta name="twitter:image" content={twitter.image} />}
      {twitter?.imageAlt && (
        <meta name="twitter:image:alt" content={twitter.imageAlt} />
      )}
    </Helmet>
  );
};
