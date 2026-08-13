export type ProductSeoCopy = {
  title: string;
  description: string;
  breadcrumbLabel?: string;
};

export type ProductSeoTemplateCopy = {
  titleTemplate: string;
  descriptionTemplate: string;
};

export type DynamicSeoKind =
  | "indexAsset"
  | "borrowPair"
  | "tradePair"
  | "tradePairAutomated"
  | "swapPair"
  | "stakingStrategy"
  | "lendStrategy"
  | "ammXykStrategy";

export type StaticProductSeoCopy = Record<string, ProductSeoCopy>;

export type DynamicProductSeoCopy = Record<
  DynamicSeoKind,
  ProductSeoTemplateCopy
>;
