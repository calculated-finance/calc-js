import {
  DEFAULT_PRODUCT_SEO_LOCALE,
  getProductSeoLocaleConfig,
  isProductSeoLocale,
  PRODUCT_SEO_LOCALES,
  resolveProductSeoLocale,
  type ProductSeoLocale,
} from "../locales";
import { dynamicProductSeoCopy, type DynamicSeoKind } from "../copy";
import { INDEX_FOLLOW_ROBOTS, NOINDEX_FOLLOW_ROBOTS } from "../robots";
import type { ProductSeo } from "../types";

export const SITE_ORIGIN = "https://rujira.network";
export const DEFAULT_SOCIAL_IMAGE_URL = `${SITE_ORIGIN}/og/banner.jpg`;
export const DEFAULT_ROBOTS = INDEX_FOLLOW_ROBOTS;

export type ProductSeoLocaleInput =
  | ProductSeoLocale
  | string
  | null
  | undefined;

type ProductSeoInput = {
  title: string;
  description: string;
  path: string;
  breadcrumbLabel?: string;
  locale?: ProductSeoLocaleInput;
  robots?: string;
  image?: string;
};

const tokenPattern = /^[A-Za-z0-9.-]{1,32}$/;

const splitPathAndSearch = (path: string) => {
  const withoutHash = String(path || "/").split("#", 1)[0] || "/";
  const queryIndex = withoutHash.indexOf("?");

  if (queryIndex === -1) {
    return {
      pathname: withoutHash,
      search: "",
    };
  }

  return {
    pathname: withoutHash.slice(0, queryIndex) || "/",
    search: withoutHash.slice(queryIndex),
  };
};

const normalizeSeoPathname = (pathname: string) => {
  try {
    const decoded = decodeURI(pathname || "/");
    if (decoded !== "/" && decoded.endsWith("/")) return decoded.slice(0, -1);
    return decoded || "/";
  } catch {
    return (pathname || "/").replace(/\/+$/, "") || "/";
  }
};

export const SWAP_SEO_BASE_ASSETS = [
  "AAVE",
  "ATOM",
  "AVAX",
  "BCH",
  "BNB",
  "BTC",
  "DAI",
  "DOGE",
  "ETH",
  "LINK",
  "LTC",
  "RUJI",
  "RUNE",
  "SOL",
  "TCY",
  "TGT",
  "THOR",
  "TRX",
  "USDC",
  "USDT",
  "VTHOR",
  "VVV",
  "WBTC",
  "XRP",
  "XRUNE",
  "YFI",
] as const;

export const SWAP_SEO_TARGET_ASSETS = ["BTC", "ETH", "USDC", "USDT"] as const;

export const SWAP_SEO_EXPLICIT_PAIRS = [
  ["RUJI", "RUNE"],
  ["TCY", "RUNE"],
] as const;

const normalizeSwapSeoAssetSymbol = (value: string | undefined) => {
  const token = value?.trim().replace(/_/g, "-").toUpperCase() ?? "";
  return tokenPattern.test(token) ? token : "";
};

const swapPairKey = (from: string, to: string) => `${from}/${to}`;

const SWAP_SEO_PAIR_KEYS = new Set([
  ...SWAP_SEO_BASE_ASSETS.flatMap((asset) =>
    SWAP_SEO_TARGET_ASSETS.filter((target) => target !== asset).map((target) =>
      swapPairKey(asset, target)
    )
  ),
  ...SWAP_SEO_EXPLICIT_PAIRS.map(([from, to]) => swapPairKey(from, to)),
]);

export const isSwapSeoPairIndexable = (
  fromAsset: string | undefined,
  toAsset: string | undefined
) => {
  const from = normalizeSwapSeoAssetSymbol(fromAsset);
  const to = normalizeSwapSeoAssetSymbol(toAsset);

  if (!from || !to || from === to) return false;

  return SWAP_SEO_PAIR_KEYS.has(swapPairKey(from, to));
};

export const buildSwapSeoRoutesFromLiveAssets = (liveAssets: string[]) => {
  const liveAssetSet = new Set(
    liveAssets.map(normalizeSwapSeoAssetSymbol).filter(Boolean)
  );

  return [...SWAP_SEO_PAIR_KEYS]
    .flatMap((pairKey) => {
      const [from, to] = pairKey.split("/");
      if (!liveAssetSet.has(from) || !liveAssetSet.has(to)) return [];

      return [`/swap/${encodeURIComponent(from)}/${encodeURIComponent(to)}`];
    })
    .sort((a, b) => a.localeCompare(b));
};

const robotsForSwapPair = (from: string, to: string) =>
  isSwapSeoPairIndexable(from, to)
    ? INDEX_FOLLOW_ROBOTS
    : NOINDEX_FOLLOW_ROBOTS;

export const normalizeSeoPath = (path: string) => {
  const { pathname, search } = splitPathAndSearch(path);

  return `${normalizeSeoPathname(pathname)}${search}`;
};

export const splitSeoPath = (path: string) => {
  const normalizedPath = normalizeSeoPath(path);

  return splitPathAndSearch(normalizedPath);
};

export const localizeSeoPath = (
  path: string,
  locale?: ProductSeoLocaleInput
) => {
  const normalizedPath = normalizeSeoPath(path);
  const { pathname, search } = splitSeoPath(normalizedPath);
  const { pathPrefix } = getProductSeoLocaleConfig(locale);

  if (!pathPrefix) return `${pathname}${search}`;
  if (pathname === "/") return `${pathPrefix}${search}`;

  return `${pathPrefix}${pathname}${search}`;
};

export const resolveProductSeoPath = (
  pathname: string,
  preferredLocale?: ProductSeoLocaleInput
) => {
  const normalizedPath = normalizeSeoPath(pathname);
  const { pathname: normalizedPathname, search } = splitSeoPath(normalizedPath);
  const [firstSegment, ...restSegments] = normalizedPathname
    .split("/")
    .filter(Boolean);

  if (isProductSeoLocale(firstSegment)) {
    const routePathname = normalizeSeoPath(`/${restSegments.join("/")}`);
    const routePath = `${routePathname}${search}`;

    return {
      locale: firstSegment,
      routePath,
      localizedPath: localizeSeoPath(routePath, firstSegment),
      hasLocalePrefix: true,
    };
  }

  const locale = resolveProductSeoLocale(preferredLocale);

  return {
    locale,
    routePath: normalizedPath,
    localizedPath: localizeSeoPath(normalizedPath, locale),
    hasLocalePrefix: false,
  };
};

// General SEO route tokens may be long asset IDs, so only normalize separators.
export const normalizeSeoToken = (value: string | undefined) => {
  if (!value) return "";

  return value.trim().replace(/_/g, "-");
};

const fillTemplate = (template: string, first?: string, second?: string) =>
  template
    .replaceAll("[1]", first ?? "")
    .replaceAll("[2]", second ?? "")
    .replace(/\s{2,}/g, " ")
    .replace(/\|\s*\|/g, "|")
    .replace(/\(\s*\)/g, "")
    .replace(/\s+\|\s+$/g, "")
    .trim();

const breadcrumbLabelFromTitle = (title: string) =>
  title.split("|")[0]?.trim() || title;

export type TradePairSeoMode = "manual" | "automated";

export const resolveTradePairSeoMode = (
  type: string | null | undefined
): TradePairSeoMode => (type === "automated" ? "automated" : "manual");

export const canonicalForPath = (
  path: string,
  locale?: ProductSeoLocaleInput
) => `${SITE_ORIGIN}${localizeSeoPath(path, locale)}`;

const alternatesForPath = (path: string) => [
  ...PRODUCT_SEO_LOCALES.map((locale) => {
    const { hrefLang } = getProductSeoLocaleConfig(locale);

    return {
      locale,
      hrefLang,
      href: canonicalForPath(path, locale),
    };
  }),
  {
    hrefLang: "x-default",
    href: canonicalForPath(path, DEFAULT_PRODUCT_SEO_LOCALE),
  },
];

const withDefaults = ({
  title,
  description,
  path,
  breadcrumbLabel,
  locale: localeInput,
  robots = DEFAULT_ROBOTS,
  image = DEFAULT_SOCIAL_IMAGE_URL,
}: ProductSeoInput): ProductSeo => {
  const locale = resolveProductSeoLocale(localeInput);
  const routePath = normalizeSeoPath(path);
  const localizedPath = localizeSeoPath(routePath, locale);
  const canonical = canonicalForPath(routePath, locale);
  const { openGraphLocale } = getProductSeoLocaleConfig(locale);

  return {
    title,
    description,
    locale,
    routePath,
    localizedPath,
    canonical,
    breadcrumbLabel: breadcrumbLabel ?? breadcrumbLabelFromTitle(title),
    robots,
    alternates: alternatesForPath(routePath),
    openGraph: {
      title,
      description,
      image,
      imageAlt: "Rujira banner",
      imageWidth: 1200,
      imageHeight: 630,
      url: canonical,
      type: "website",
      siteName: "Rujira",
      locale: openGraphLocale,
      alternateLocales: PRODUCT_SEO_LOCALES.filter(
        (alternateLocale) => alternateLocale !== locale
      ).map(
        (alternateLocale) =>
          getProductSeoLocaleConfig(alternateLocale).openGraphLocale
      ),
    },
    twitter: {
      title,
      description,
      url: canonical,
      image,
      imageAlt: "Rujira banner",
      card: "summary_large_image",
      site: "@RujiraNetwork",
    },
  };
};

export const createStaticProductSeo = (input: ProductSeoInput) =>
  withDefaults(input);

const dynamicSeo = ({
  kind,
  path,
  first,
  second,
  locale: localeInput,
  robots,
}: {
  kind: DynamicSeoKind;
  path: string;
  first: string;
  second?: string;
  locale?: ProductSeoLocaleInput;
  robots?: string;
}) => {
  const locale = resolveProductSeoLocale(localeInput);
  const { titleTemplate, descriptionTemplate } =
    dynamicProductSeoCopy[locale]?.[kind] ??
    dynamicProductSeoCopy[DEFAULT_PRODUCT_SEO_LOCALE][kind];
  const title = fillTemplate(titleTemplate, first, second);
  const description = fillTemplate(descriptionTemplate, first, second);

  return withDefaults({
    title,
    description,
    path,
    locale,
    robots,
  });
};

export const getIndexAssetSeo = (
  asset: string | undefined,
  locale?: ProductSeoLocaleInput
) => {
  const normalizedAsset = normalizeSeoToken(asset);
  if (!normalizedAsset) return null;

  return dynamicSeo({
    kind: "indexAsset",
    path: `/index/${encodeURIComponent(normalizedAsset)}`,
    first: normalizedAsset,
    locale,
  });
};

export const getTradePairSeo = (
  base: string | undefined,
  quote: string | undefined,
  locale?: ProductSeoLocaleInput,
  type?: string | null
) => {
  const normalizedBase = normalizeSeoToken(base);
  const normalizedQuote = normalizeSeoToken(quote);
  if (!normalizedBase || !normalizedQuote) return null;
  const seoMode = resolveTradePairSeoMode(type);
  const basePath = `/trade/${encodeURIComponent(
    normalizedBase
  )}/${encodeURIComponent(normalizedQuote)}`;

  return dynamicSeo({
    kind: seoMode === "automated" ? "tradePairAutomated" : "tradePair",
    path: seoMode === "automated" ? `${basePath}?type=automated` : basePath,
    first: normalizedBase,
    second: normalizedQuote,
    locale,
  });
};

export const getBorrowPairSeo = (
  collateral: string | undefined,
  debt: string | undefined,
  locale?: ProductSeoLocaleInput
) => {
  const normalizedCollateral = normalizeSeoToken(collateral);
  const normalizedDebt = normalizeSeoToken(debt);
  if (!normalizedCollateral || !normalizedDebt) return null;

  return dynamicSeo({
    kind: "borrowPair",
    path: `/borrow/${encodeURIComponent(
      normalizedCollateral
    )}/${encodeURIComponent(normalizedDebt)}`,
    first: normalizedDebt,
    second: normalizedCollateral,
    locale,
  });
};

export const getSwapPairSeo = (
  from: string | undefined,
  to: string | undefined,
  locale?: ProductSeoLocaleInput
) => {
  const normalizedFrom = normalizeSeoToken(from);
  const normalizedTo = normalizeSeoToken(to);
  if (!normalizedFrom || !normalizedTo) return null;
  const seoFrom = normalizeSwapSeoAssetSymbol(normalizedFrom) || normalizedFrom;
  const seoTo = normalizeSwapSeoAssetSymbol(normalizedTo) || normalizedTo;

  return dynamicSeo({
    kind: "swapPair",
    path: `/swap/${encodeURIComponent(seoFrom)}/${encodeURIComponent(seoTo)}`,
    first: seoFrom,
    second: seoTo,
    locale,
    robots: robotsForSwapPair(seoFrom, seoTo),
  });
};

export const getStakingStrategySeo = (
  asset: string | undefined,
  locale?: ProductSeoLocaleInput
) => {
  const normalizedAsset = normalizeSeoToken(asset);
  if (!normalizedAsset) return null;

  return dynamicSeo({
    kind: "stakingStrategy",
    path: `/stake/${encodeURIComponent(normalizedAsset)}`,
    first: normalizedAsset,
    locale,
  });
};

export const getLendStrategySeo = (
  asset: string | undefined,
  locale?: ProductSeoLocaleInput
) => {
  const normalizedAsset = normalizeSeoToken(asset);
  if (!normalizedAsset) return null;

  return dynamicSeo({
    kind: "lendStrategy",
    path: `/lend/${encodeURIComponent(normalizedAsset)}`,
    first: normalizedAsset,
    locale,
  });
};

export const getAmmXykStrategySeo = (
  assets: string | undefined,
  locale?: ProductSeoLocaleInput
) => {
  const normalizedAssets = normalizeSeoToken(assets);
  if (!normalizedAssets) return null;

  return dynamicSeo({
    kind: "ammXykStrategy",
    path: `/strategies/amm/xyk/${encodeURIComponent(normalizedAssets)}`,
    first: normalizedAssets,
    locale,
  });
};

export const getStrategySeo = (
  {
    category,
    type,
    assets,
    locale,
  }: {
    category?: string;
    type?: string;
    assets?: string;
    locale?: ProductSeoLocaleInput;
  },
  fallbackLocale?: ProductSeoLocaleInput
) => {
  const seoLocale = locale ?? fallbackLocale;

  if (category === "stake") return getStakingStrategySeo(assets, seoLocale);
  if (category === "lend") return getLendStrategySeo(assets, seoLocale);
  if (category === "amm" && type === "xyk") {
    return getAmmXykStrategySeo(assets, seoLocale);
  }

  return null;
};
