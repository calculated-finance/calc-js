import { next } from "@vercel/functions";
import {
  getSwapEntryRedirectPath,
  shouldBypassCrawlerHandling,
} from "./crawler-bypass";
import {
  DEFAULT_SOCIAL_IMAGE_URL,
  getProductSeo,
  localizeSeoPath,
  normalizeSeoPath,
  PRODUCT_SEO_LOCALES,
  SITE_ORIGIN,
} from "./packages/main/src/seo/productSeo";
import {
  INDEX_FOLLOW_ROBOTS,
  NOINDEX_FOLLOW_ROBOTS,
} from "./packages/main/src/seo/robots";

export const config = {
  runtime: "edge",
};

const ORG_ID = `${SITE_ORIGIN}/#organization`;
const SITE_ID = `${SITE_ORIGIN}/#website`;
const FAVICON_ICO_URL = `${SITE_ORIGIN}/favicon.ico`;
const FAVICON_SVG_URL = `${SITE_ORIGIN}/favicon.svg`;
const APPLE_TOUCH_ICON_URL = `${SITE_ORIGIN}/apple-touch-icon.png`;
const SITE_MANIFEST_URL = `${SITE_ORIGIN}/site.webmanifest`;
const OG_BANNER_URL = DEFAULT_SOCIAL_IMAGE_URL;

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://rujira.network/#organization",
  name: "Rujira",
  legalName: "Ruji Holdings Limited",
  url: "https://rujira.network",
  logo: {
    "@type": "ImageObject",
    "@id": "https://rujira.network/#logo",
    url: FAVICON_ICO_URL,
    contentUrl: FAVICON_ICO_URL,
    width: 256,
    height: 256,
  },
  image: {
    "@type": "ImageObject",
    "@id": "https://rujira.network/#banner",
    url: OG_BANNER_URL,
    contentUrl: OG_BANNER_URL,
    width: 1200,
    height: 630,
  },
  slogan: "Fair By Design. Owned By You.",
  description:
    "Rujira is the App Layer on THORChain, empowering anyone, anywhere, to access the same financial opportunities.",
  foundingDate: "2025-01-01",
  areaServed: { "@type": "Place", name: "Worldwide" },
  isAccessibleForFree: true,
  termsOfService: "https://rujira.network/tou",
  privacyPolicy: "https://rujira.network/privacypolicy",
  sameAs: [
    "https://x.com/RujiraNetwork",
    "https://medium.com/rujiranetwork",
    "https://www.reddit.com/r/RujiraNetworkOfficial/",
    "https://www.linkedin.com/company/rujira-network/",
    "https://www.tiktok.com/@rujiranetwork",
    "https://www.instagram.com/rujiranetwork/",
    "https://www.threads.net/@rujiranetwork",
    "https://bsky.app/profile/rujiraofficial.bsky.social",
    "https://www.youtube.com/@RujiraNetwork",
    "https://typefully.com/RujiraNetwork",
    "https://t.me/Rujira_Community",
    "https://discord.gg/uRzqQmU9EE",
    "https://gitlab.com/thorchain/rujira",
  ],
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "partnerships",
      email: "bd@rujira.network",
      availableLanguage: PRODUCT_SEO_LOCALES,
    },
    {
      "@type": "ContactPoint",
      contactType: "customer support",
      url: "https://discord.gg/uRzqQmU9EE",
      availableLanguage: PRODUCT_SEO_LOCALES,
    },
    {
      "@type": "ContactPoint",
      contactType: "marketing",
      email: "marketing@rujira.network",
      availableLanguage: PRODUCT_SEO_LOCALES,
    },
  ],
};

const PRODUCT_WEBSITE_PART_PATHS = [
  "/trade",
  "/index",
  "/lend",
  "/borrow/BTC/USDC",
  "/liquidate",
  "/strategies",
  "/leaderboard",
] as const;

const titleLabel = (title: string) => title.split("|")[0]?.trim() || title;

const productSeoLabelForPath = (path: string, locale?: string) => {
  const seo = getProductSeo(path, locale);
  return seo?.breadcrumbLabel ?? (seo ? titleLabel(seo.title) : null);
};

const makeWebsitePart = (path: string) => {
  const seo = getProductSeo(path);

  return {
    "@type": "WebPage",
    "@id": seo?.canonical ?? `${SITE_ORIGIN}${normalizeSeoPath(path)}`,
    name: productSeoLabelForPath(path) ?? normalizeSeoPath(path),
  };
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://rujira.network/#website",
  url: "https://rujira.network",
  name: "Rujira",
  alternateName: "Fair By Design. Owned By You.",
  inLanguage: PRODUCT_SEO_LOCALES,
  publisher: { "@id": "https://rujira.network/#organization" },
  about: { "@id": "https://rujira.network/#organization" },
  description:
    "Rujira is the App Layer on THORChain, bringing together decentralized products to trade, lend, and earn with native assets across blockchains, directly from your wallet.",
  image: { "@id": "https://rujira.network/#banner" },
  isAccessibleForFree: true,
  isFamilyFriendly: true,
  keywords:
    "DeFi, THORChain, Rujira, cross-chain, omnichain, staking, native assets, crypto, fair finance, decentralized exchange",
  copyrightNotice: "\u00a9 Rujira. All rights reserved.",
  hasPart: PRODUCT_WEBSITE_PART_PATHS.map(makeWebsitePart),
};

const makeWebPageSchema = (
  url: string,
  title: string,
  desc: string,
  locale: string
) => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${url}#webpage`,
  url,
  name: title,
  description: desc,
  isPartOf: { "@id": SITE_ID },
  inLanguage: [locale],
  about: { "@id": ORG_ID },
  image: OG_BANNER_URL,
  primaryImageOfPage: OG_BANNER_URL,
});

const makeBreadcrumb = (
  items: { name: string; url: string }[],
  pageUrl: string
) => ({
  "@type": "BreadcrumbList",
  "@id": `${pageUrl}#breadcrumb`,
  itemListElement: items.map((it, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: it.name,
    item: it.url,
  })),
});

const inferBreadcrumbNameFromSegment = (part: string) => {
  if (/^[A-Z0-9-_]+$/i.test(part)) {
    return part.toUpperCase();
  }

  return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
};

const getBreadcrumbName = ({
  part,
  routePath,
  locale,
  isCurrentPage,
  pageTitle,
  pageBreadcrumbLabel,
}: {
  part: string;
  routePath: string;
  locale?: string;
  isCurrentPage: boolean;
  pageTitle: string;
  pageBreadcrumbLabel?: string;
}) => {
  const productSeoLabel = isCurrentPage
    ? pageBreadcrumbLabel
    : productSeoLabelForPath(routePath, locale);
  if (productSeoLabel) return productSeoLabel;

  if (isCurrentPage) {
    return titleLabel(pageTitle);
  }

  return inferBreadcrumbNameFromSegment(part);
};

const crawlerUserAgents =
  /Googlebot|Google-InspectionTool|Googlebot-Image|AdsBot-Google|bingbot|DuckDuckBot|Baiduspider|Sogou|Naverbot|Yandex(Bot|Images)|Applebot|Twitterbot|facebookexternalhit|Facebot|LinkedInBot|Slackbot|Discordbot|TelegramBot|redditbot|WhatsApp|ThreadsBot|AhrefsBot|SemrushBot|CoinMarketCapBot|DefiLlamaBot|DexScreenerBot|GeckoTerminalBot|GPTBot|OAI-SearchBot|ChatGPT-User|ClaudeBot|Claude-SearchBot|Claude-User|PerplexityBot|Perplexity-User|CCBot|Amazonbot|Bytespider|Meta-ExternalAgent|FacebookBot|YouBot/i;

const crawlerResponseHeaders = (robots: string) => ({
  "content-type": "text/html; charset=UTF-8",
  "cache-control":
    "public, max-age=300, s-maxage=600, stale-while-revalidate=86400",
  vary: "User-Agent",
  "x-robots-tag": robots,
  "x-content-type-options": "nosniff",
  "referrer-policy": "strict-origin-when-cross-origin",
  "x-frame-options": "DENY",
  "permissions-policy": "interest-cohort=()",
});

const noIndexCrawlerResponse = () => {
  const robots = NOINDEX_FOLLOW_ROBOTS;

  return new Response(
    `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="${robots}" />
  <meta name="theme-color" content="#000000" />
  <link rel="icon" href="${FAVICON_ICO_URL}" sizes="any" />
  <link rel="icon" type="image/svg+xml" href="${FAVICON_SVG_URL}" />
  <link rel="apple-touch-icon" href="${APPLE_TOUCH_ICON_URL}" />
  <link rel="manifest" href="${SITE_MANIFEST_URL}" />
  <title>Rujira</title>
  <meta name="description" content="Rujira app route" />
</head>
<body></body>
</html>`,
    {
      headers: crawlerResponseHeaders(robots),
    }
  );
};

export default function middleware(request: Request) {
  const url = new URL(request.url);
  const swapEntryRedirectPath = getSwapEntryRedirectPath(url.pathname);

  if (swapEntryRedirectPath) {
    url.pathname = swapEntryRedirectPath;
    return Response.redirect(url, 308);
  }

  if (shouldBypassCrawlerHandling(url.pathname)) {
    return next();
  }

  const userAgent = request.headers.get("user-agent") || "";
  const isCrawler = crawlerUserAgents.test(userAgent);

  if (isCrawler) {
    const requestSeoPath = `${url.pathname}${url.search}`;
    const seoData = getProductSeo(requestSeoPath);
    if (!seoData) return noIndexCrawlerResponse();

    const pageUrl =
      seoData.canonical ?? `${SITE_ORIGIN}${normalizeSeoPath(requestSeoPath)}`;
    const title = escapeHtml(seoData.title);
    const desc = escapeHtml(seoData.description);
    const canonical = escapeHtml(pageUrl);
    const robots = seoData.robots ?? INDEX_FOLLOW_ROBOTS;
    const robotsContent = escapeHtml(robots);
    const htmlLang = escapeHtml(seoData.locale ?? "en");
    const openGraph = seoData.openGraph;
    const twitter = seoData.twitter;
    const ogTitle = escapeHtml(openGraph?.title ?? seoData.title);
    const ogDescription = escapeHtml(
      openGraph?.description ?? seoData.description
    );
    const ogImage = escapeHtml(openGraph?.image ?? OG_BANNER_URL);
    const ogImageAlt = escapeHtml(openGraph?.imageAlt ?? "Rujira banner");
    const ogImageWidth = openGraph?.imageWidth ?? 1200;
    const ogImageHeight = openGraph?.imageHeight ?? 630;
    const ogUrl = escapeHtml(openGraph?.url ?? pageUrl);
    const ogType = escapeHtml(openGraph?.type ?? "website");
    const ogSiteName = escapeHtml(openGraph?.siteName ?? "Rujira");
    const ogLocale = escapeHtml(openGraph?.locale ?? "en_US");
    const alternateLinks = (seoData.alternates ?? [])
      .map(
        (alternate) =>
          `<link rel="alternate" hreflang="${escapeHtml(
            alternate.hrefLang
          )}" href="${escapeHtml(alternate.href)}">`
      )
      .join("\n  ");
    const ogAlternateLocales = (openGraph?.alternateLocales ?? [])
      .map(
        (locale) =>
          `<meta property="og:locale:alternate" content="${escapeHtml(locale)}" />`
      )
      .join("\n  ");
    const twitterTitle = escapeHtml(twitter?.title ?? seoData.title);
    const twitterDescription = escapeHtml(
      twitter?.description ?? seoData.description
    );
    const twitterUrl = escapeHtml(twitter?.url ?? pageUrl);
    const twitterCard = escapeHtml(twitter?.card ?? "summary_large_image");
    const twitterSite = escapeHtml(twitter?.site ?? "@RujiraNetwork");
    const twitterImage = escapeHtml(twitter?.image ?? OG_BANNER_URL);
    const twitterImageAlt = escapeHtml(twitter?.imageAlt ?? "Rujira banner");

    const webPageSchema = makeWebPageSchema(
      pageUrl,
      seoData.title,
      seoData.description,
      seoData.locale ?? "en"
    );

    let breadcrumbSchema = null;
    const routePathWithSearch =
      seoData.routePath ?? normalizeSeoPath(requestSeoPath);
    const routePath = routePathWithSearch.split(/[?#]/, 1)[0] || "/";
    const pathParts = routePath.split("/").filter(Boolean);

    if (pathParts.length > 1) {
      const items = [
        {
          name: productSeoLabelForPath("/", seoData.locale) ?? "Home",
          url: `${SITE_ORIGIN}${localizeSeoPath("/", seoData.locale)}`,
        },
      ];

      pathParts.forEach((part, idx) => {
        const crumbRoutePath = normalizeSeoPath(
          `/${pathParts.slice(0, idx + 1).join("/")}`
        );
        const name = getBreadcrumbName({
          part,
          routePath: crumbRoutePath,
          locale: seoData.locale,
          isCurrentPage: idx === pathParts.length - 1,
          pageTitle: seoData.title,
          pageBreadcrumbLabel: seoData.breadcrumbLabel,
        });
        const link = `${SITE_ORIGIN}${localizeSeoPath(
          crumbRoutePath,
          seoData.locale
        )}`;
        items.push({ name, url: link });
      });

      breadcrumbSchema = makeBreadcrumb(items, pageUrl);
    }

    const graph: Record<string, unknown>[] = [
      organizationSchema,
      websiteSchema,
      webPageSchema,
    ];
    if (breadcrumbSchema) graph.push(breadcrumbSchema);

    const jsonLdSchemas = {
      "@context": "https://schema.org",
      "@graph": graph,
    };

    return new Response(
      `<!DOCTYPE html>
<html lang="${htmlLang}">
<head>
  <meta charset="UTF-8">
  <link rel="canonical" href="${canonical}">
  ${alternateLinks}
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="${robotsContent}" />
  <meta name="theme-color" content="#000000" />
  <link rel="icon" href="${FAVICON_ICO_URL}" sizes="any" />
  <link rel="icon" type="image/svg+xml" href="${FAVICON_SVG_URL}" />
  <link rel="apple-touch-icon" href="${APPLE_TOUCH_ICON_URL}" />
  <link rel="manifest" href="${SITE_MANIFEST_URL}" />

  <title>${title}</title>
  <meta name="title" content="${title}" />
  <meta name="description" content="${desc}" />

  <meta property="og:title" content="${ogTitle}" />
  <meta property="og:description" content="${ogDescription}" />
  <meta property="og:image" content="${ogImage}" />
  <meta property="og:image:secure_url" content="${ogImage}" />
  <meta property="og:image:alt" content="${ogImageAlt}" />
  <meta property="og:image:width" content="${ogImageWidth}" />
  <meta property="og:image:height" content="${ogImageHeight}" />
  <meta property="og:url" content="${ogUrl}" />
  <meta property="og:type" content="${ogType}" />
  <meta property="og:site_name" content="${ogSiteName}" />
  <meta property="og:locale" content="${ogLocale}" />
  ${ogAlternateLocales}

  <meta name="twitter:title" content="${twitterTitle}" />
  <meta name="twitter:description" content="${twitterDescription}" />
  <meta name="twitter:url" content="${twitterUrl}" />
  <meta name="twitter:card" content="${twitterCard}" />
  <meta name="twitter:site" content="${twitterSite}" />
  <meta name="twitter:image" content="${twitterImage}" />
  <meta name="twitter:image:alt" content="${twitterImageAlt}" />
  <meta name="author" content="Rujira" />
  <meta name="application-name" content="Rujira" />

  <script type="application/ld+json">
    ${JSON.stringify(jsonLdSchemas).replace(/</g, "\\u003c")}
  </script>
</head>
<body></body>
</html>`,
      {
        headers: crawlerResponseHeaders(robots),
      }
    );
  }

  return next();
}
