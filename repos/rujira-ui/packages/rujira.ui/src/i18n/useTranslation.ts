import { useContext } from "react";
import type { i18n as I18n, TFunction } from "i18next";
import { useTranslation as useI18nextTranslation } from "react-i18next";
import { TranslationContext } from "./TranslationProvider";

type TranslationHook = {
  t: TFunction;
  i18n: I18n;
  language: string;
  changeLanguage: I18n["changeLanguage"];
};

export const useTranslation = (ns?: string): TranslationHook => {
  const contextNamespace = useContext(TranslationContext);
  const namespace = ns ?? contextNamespace;

  if (!namespace) {
    throw new Error(
      'useTranslation: No namespace provided. Either pass a namespace argument or wrap your component in <TranslationProvider namespace="...">.'
    );
  }

  const { t, i18n } = useI18nextTranslation(namespace);

  return {
    t,
    i18n,
    language: i18n.language,
    changeLanguage: i18n.changeLanguage.bind(i18n),
  };
};
