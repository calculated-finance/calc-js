import type { ProductSeoLocale } from "../locales";
import { deDynamicProductSeoCopy, deStaticProductSeoCopy } from "./de";
import { enDynamicProductSeoCopy, enStaticProductSeoCopy } from "./en";
import type { DynamicProductSeoCopy, StaticProductSeoCopy } from "./types";

export const staticProductSeoCopy = {
  en: enStaticProductSeoCopy,
  de: deStaticProductSeoCopy,
} satisfies Record<ProductSeoLocale, StaticProductSeoCopy>;

export type StaticProductSeoPath = keyof typeof enStaticProductSeoCopy;

export const dynamicProductSeoCopy = {
  en: enDynamicProductSeoCopy,
  de: deDynamicProductSeoCopy,
} satisfies Record<ProductSeoLocale, DynamicProductSeoCopy>;

export type {
  DynamicProductSeoCopy,
  DynamicSeoKind,
  ProductSeoCopy,
  ProductSeoTemplateCopy,
  StaticProductSeoCopy,
} from "./types";
