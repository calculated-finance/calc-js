import {
  createStaticProductSeo,
  buildSwapSeoRoutesFromLiveAssets,
  getAmmXykStrategySeo,
  getBorrowPairSeo,
  getIndexAssetSeo,
  getLendStrategySeo,
  getStakingStrategySeo,
  getStrategySeo,
  getSwapPairSeo,
  getTradePairSeo,
  isSwapSeoPairIndexable,
  localizeSeoPath,
  normalizeSeoPath,
  resolveProductSeoPath,
  SITE_ORIGIN,
  SWAP_SEO_BASE_ASSETS,
  SWAP_SEO_EXPLICIT_PAIRS,
  SWAP_SEO_TARGET_ASSETS,
  DEFAULT_SOCIAL_IMAGE_URL,
  splitSeoPath,
  type ProductSeoLocaleInput,
} from "./builders/productSeoBuilders";
import { staticProductSeoCopy, type StaticProductSeoPath } from "./copy";

export {
  buildSwapSeoRoutesFromLiveAssets,
  DEFAULT_SOCIAL_IMAGE_URL,
  getAmmXykStrategySeo,
  getBorrowPairSeo,
  getIndexAssetSeo,
  getLendStrategySeo,
  getStakingStrategySeo,
  getStrategySeo,
  getSwapPairSeo,
  getTradePairSeo,
  isSwapSeoPairIndexable,
  localizeSeoPath,
  normalizeSeoPath,
  resolveProductSeoPath,
  SITE_ORIGIN,
  splitSeoPath,
  SWAP_SEO_BASE_ASSETS,
  SWAP_SEO_EXPLICIT_PAIRS,
  SWAP_SEO_TARGET_ASSETS,
};
export {
  DEFAULT_PRODUCT_SEO_LOCALE,
  getProductSeoLocaleConfig,
  PRODUCT_SEO_LOCALE_CONFIG,
  PRODUCT_SEO_LOCALES,
  resolveProductSeoLocale,
} from "./locales";
export { dynamicProductSeoCopy, staticProductSeoCopy } from "./copy";

export type { ProductSeoLocale } from "./locales";
export type { ProductSeo } from "./types";

export const getStaticProductSeo = (
  path: string,
  locale?: ProductSeoLocaleInput
) => {
  const { routePath, locale: resolvedLocale } = resolveProductSeoPath(
    path,
    locale
  );
  const { pathname: staticRoutePath } = splitSeoPath(routePath);
  const copy =
    staticProductSeoCopy[resolvedLocale]?.[
      staticRoutePath as StaticProductSeoPath
    ];

  if (!copy) return null;

  return createStaticProductSeo({
    path: staticRoutePath,
    locale: resolvedLocale,
    ...copy,
  });
};

export const getProductSeo = (
  pathname: string,
  locale?: ProductSeoLocaleInput
) => {
  const { routePath, locale: resolvedLocale } = resolveProductSeoPath(
    pathname,
    locale
  );
  const staticSeo = getStaticProductSeo(routePath, resolvedLocale);
  if (staticSeo) return staticSeo;

  const { pathname: routePathname, search } = splitSeoPath(routePath);
  const [section, first, second, third] = routePathname
    .split("/")
    .filter(Boolean);

  if (section === "index" && first && !second) {
    return getIndexAssetSeo(first, resolvedLocale);
  }

  if (section === "trade" && first && second && !third) {
    const tradeType = new URLSearchParams(search).get("type");

    return getTradePairSeo(first, second, resolvedLocale, tradeType);
  }

  if (section === "borrow" && first && second && !third) {
    return getBorrowPairSeo(first, second, resolvedLocale);
  }

  if (section === "swap" && first && second && !third) {
    return getSwapPairSeo(first, second, resolvedLocale);
  }

  if (section === "lend" && first && !second) {
    return getLendStrategySeo(first, resolvedLocale);
  }

  if (section === "stake" && first && !second) {
    return getStakingStrategySeo(first, resolvedLocale);
  }

  if (section === "strategies") {
    if (first === "amm" && second === "xyk" && third) {
      return getAmmXykStrategySeo(third, resolvedLocale);
    }
  }

  return null;
};
