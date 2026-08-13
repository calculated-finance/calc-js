import vercelConfig from "./vercel.json";
import { PRODUCT_SEO_LOCALES } from "./packages/main/src/seo/productSeo";

type VercelRewrite = {
  source?: string;
  destination?: string;
};

const SEO_RESOURCE_PATHS = new Set([
  "/sitemap.xml",
  "/sitemap-marketing.xml",
  "/sitemap-product.xml",
  "/robots.txt",
]);

const METADATA_RESOURCE_PATHS = new Set([
  "/favicon.ico",
  "/favicon.svg",
  "/favicon.png",
  "/apple-touch-icon.png",
  "/site.webmanifest",
  "/manifest.json",
  "/browserconfig.xml",
]);

const ASSET_PREFIXES = [
  "/_next/",
  "/assets/",
  "/images/",
  "/icons/",
  "/logo/",
  "/og/",
  "/fonts/",
];

const STATIC_RESOURCE_EXTENSIONS = [
  ".xml",
  ".txt",
  ".json",
  ".ico",
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".svg",
  ".css",
  ".js",
  ".mjs",
  ".map",
  ".woff",
  ".woff2",
  ".wasm",
  ".webmanifest",
];

const SUPPORTED_LOCALE_SEGMENTS: ReadonlySet<string> = new Set(
  PRODUCT_SEO_LOCALES
);
export const DEFAULT_SWAP_ENTRY_REDIRECT_PATH = "/swap/ETH/BTC";

// Bare product entry routes are redirect-only helpers. `/swap` and
// `/{locale}/swap` resolve to a concrete pair route before SEO processing.
const LOCALE_REDIRECT_SEGMENTS = new Set(["swap"]);

// External rewrites are route ownership handoffs in vercel.json. Keep these
// path-based so crawler handling cannot preempt marketing/static routing.
const EXTERNAL_REWRITE_SOURCES = (
  (vercelConfig as { rewrites?: VercelRewrite[] }).rewrites ?? []
)
  .filter(
    (rewrite): rewrite is Required<VercelRewrite> =>
      typeof rewrite.source === "string" &&
      typeof rewrite.destination === "string" &&
      /^https?:\/\//i.test(rewrite.destination)
  )
  .map((rewrite) => rewrite.source);

const normalizeBypassPath = (pathname: string) => {
  let path = pathname || "/";

  if (/^https?:\/\//i.test(path)) {
    try {
      path = new URL(path).pathname;
    } catch {
      path = "/";
    }
  }

  path = path.split(/[?#]/, 1)[0] || "/";
  if (!path.startsWith("/")) path = `/${path}`;

  try {
    path = decodeURI(path);
  } catch {
    // Keep the raw path if it contains malformed escaping.
  }

  return path.replace(/\/+$/, "") || "/";
};

const splitPath = (path: string) =>
  normalizeBypassPath(path).toLowerCase().split("/").filter(Boolean);

const sourceMatchesPath = (source: string, pathname: string) => {
  const sourceSegments = splitPath(source);
  const pathSegments = splitPath(pathname);

  const matchesFrom = (sourceIndex: number, pathIndex: number): boolean => {
    if (sourceIndex === sourceSegments.length) {
      return pathIndex === pathSegments.length;
    }

    const sourceSegment = sourceSegments[sourceIndex];
    if (sourceSegment.startsWith(":") && sourceSegment.endsWith("*")) {
      // Terminal :param* sources own the rest of the path. Non-terminal
      // wildcards must leave room for later static/param segments to match.
      if (sourceIndex === sourceSegments.length - 1) return true;

      for (
        let nextPathIndex = pathIndex;
        nextPathIndex <= pathSegments.length;
        nextPathIndex += 1
      ) {
        if (matchesFrom(sourceIndex + 1, nextPathIndex)) return true;
      }

      return false;
    }

    const pathSegment = pathSegments[pathIndex];
    if (!pathSegment) return false;

    if (!sourceSegment.startsWith(":") && sourceSegment !== pathSegment) {
      return false;
    }

    return matchesFrom(sourceIndex + 1, pathIndex + 1);
  };

  return matchesFrom(0, 0);
};

export const getSwapEntryRedirectPath = (path: string) => {
  const segments = splitPath(path);

  if (segments.length === 1 && LOCALE_REDIRECT_SEGMENTS.has(segments[0])) {
    return DEFAULT_SWAP_ENTRY_REDIRECT_PATH;
  }

  if (
    segments.length === 2 &&
    SUPPORTED_LOCALE_SEGMENTS.has(segments[0]) &&
    LOCALE_REDIRECT_SEGMENTS.has(segments[1])
  ) {
    return `/${segments[0]}${DEFAULT_SWAP_ENTRY_REDIRECT_PATH}`;
  }

  return null;
};

export const shouldBypassCrawlerHandling = (pathname: string): boolean => {
  const path = normalizeBypassPath(pathname).toLowerCase();

  if (SEO_RESOURCE_PATHS.has(path)) return true;
  if (METADATA_RESOURCE_PATHS.has(path)) return true;
  if (ASSET_PREFIXES.some((prefix) => path.startsWith(prefix))) return true;
  if (
    STATIC_RESOURCE_EXTENSIONS.some((extension) => path.endsWith(extension))
  ) {
    return true;
  }
  if (getSwapEntryRedirectPath(path)) return true;

  return EXTERNAL_REWRITE_SOURCES.some((source) =>
    sourceMatchesPath(source, path)
  );
};
