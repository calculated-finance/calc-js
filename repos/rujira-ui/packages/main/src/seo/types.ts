import type { ProductSeoLocale } from "./locales";

export type JsonLdNode = Record<string, unknown>;

export interface ProductOpenGraph {
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  url?: string;
  type?: string;
  siteName?: string;
  locale?: string;
  alternateLocales?: string[];
}

export interface ProductTwitterCard {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  imageAlt?: string;
  card?: "summary" | "summary_large_image";
  site?: string;
}

export interface ProductStructuredData {
  jsonLd?: JsonLdNode[];
}

export interface ProductGeoMetadata {
  region?: string;
  placename?: string;
  position?: string;
}

export interface ProductSeoAlternate {
  href: string;
  hrefLang: string;
  locale?: ProductSeoLocale;
}

export interface ProductSeo {
  title: string;
  description: string;
  locale?: ProductSeoLocale;
  routePath?: string;
  localizedPath?: string;
  canonical?: string;
  breadcrumbLabel?: string;
  robots?: string;
  alternates?: ProductSeoAlternate[];
  openGraph?: ProductOpenGraph;
  twitter?: ProductTwitterCard;
  structuredData?: ProductStructuredData;
  geo?: ProductGeoMetadata;
}
