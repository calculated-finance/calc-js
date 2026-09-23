export const PRODUCT_SEO_LOCALE_CONFIG = {
  en: {
    label: "English",
    hrefLang: "en",
    pathPrefix: "",
    openGraphLocale: "en_US",
  },
  de: {
    label: "Deutsch",
    hrefLang: "de",
    pathPrefix: "/de",
    openGraphLocale: "de_DE",
  },
} as const;

export type ProductSeoLocale = keyof typeof PRODUCT_SEO_LOCALE_CONFIG;

export const DEFAULT_PRODUCT_SEO_LOCALE: ProductSeoLocale = "en";

export const PRODUCT_SEO_LOCALES = Object.keys(
  PRODUCT_SEO_LOCALE_CONFIG
) as ProductSeoLocale[];

export const isProductSeoLocale = (
  locale: string | null | undefined
): locale is ProductSeoLocale =>
  Boolean(
    locale &&
      Object.prototype.hasOwnProperty.call(PRODUCT_SEO_LOCALE_CONFIG, locale)
  );

export const resolveProductSeoLocale = (
  locale: string | null | undefined
): ProductSeoLocale =>
  isProductSeoLocale(locale) ? locale : DEFAULT_PRODUCT_SEO_LOCALE;

export const getProductSeoLocaleConfig = (
  locale: string | null | undefined
) => PRODUCT_SEO_LOCALE_CONFIG[resolveProductSeoLocale(locale)];
