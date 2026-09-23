import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import deBorrow from "./locales/de/borrow.json";
import deCommon from "./locales/de/common.json";
import deEcosystem from "./locales/de/ecosystem.json";
import deHeader from "./locales/de/header.json";
import deHome from "./locales/de/home.json";
import deIndex from "./locales/de/index.json";
import deLeagues from "./locales/de/leagues.json";
import deMerge from "./locales/de/merge.json";
import dePortfolio from "./locales/de/portfolio.json";
import deStaking from "./locales/de/staking.json";
import deStrategies from "./locales/de/strategies.json";
import deSwap from "./locales/de/swap.json";
import deTrade from "./locales/de/trade.json";
import deLending from "./locales/de/lending.json";
import deLiquidate from "./locales/de/liquidate.json";
//import deAlgorithmic from "./locales/en/algorithmic.json"; /* need translation */

import enBorrow from "./locales/en/borrow.json";
import enCommon from "./locales/en/common.json";
import enEcosystem from "./locales/en/ecosystem.json";
import enHeader from "./locales/en/header.json";
import enHome from "./locales/en/home.json";
import enIndex from "./locales/en/index.json";
import enLeagues from "./locales/en/leagues.json";
import enMerge from "./locales/en/merge.json";
import enPortfolio from "./locales/en/portfolio.json";
import enStaking from "./locales/en/staking.json";
import enStrategies from "./locales/en/strategies.json";
import enSwap from "./locales/en/swap.json";
import enTrade from "./locales/en/trade.json";
import enLending from "./locales/en/lending.json";
import enLiquidate from "./locales/en/liquidate.json";
import enAlgorithmic from "./locales/en/algorithmic.json";

const STORAGE_KEY = "language";
const SUPPORTED_LANGUAGES = ["en", "de"] as const;
type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];
export const SUPPORTED_LANGUAGE_PATTERN = SUPPORTED_LANGUAGES.join("|");

const detectLanguage = (): SupportedLanguage => {
  if (typeof window === "undefined") return "en";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && SUPPORTED_LANGUAGES.includes(stored as SupportedLanguage)) {
    return stored as SupportedLanguage;
  }

  // Default to English regardless, switched now in footer
  return "en";
};

export const setLanguage = (lang: SupportedLanguage) => {
  localStorage.setItem(STORAGE_KEY, lang);
  i18n.changeLanguage(lang);
};

export const getLanguage = (): SupportedLanguage => {
  return i18n.language as SupportedLanguage;
};

i18n.use(initReactI18next).init({
  resources: {
    en: {
      swap: enSwap,
      trade: enTrade,
      common: enCommon,
      strategies: enStrategies,
      portfolio: enPortfolio,
      index: enIndex,
      borrow: enBorrow,
      header: enHeader,
      home: enHome,
      ecosystem: enEcosystem,
      merge: enMerge,
      leagues: enLeagues,
      lending: enLending,
      liquidate: enLiquidate,
      algorithmic: enAlgorithmic,
      staking: enStaking,
    },
    de: {
      swap: deSwap,
      trade: deTrade,
      common: deCommon,
      strategies: deStrategies,
      portfolio: dePortfolio,
      index: deIndex,
      borrow: deBorrow,
      header: deHeader,
      home: deHome,
      ecosystem: deEcosystem,
      merge: deMerge,
      leagues: deLeagues,
      lending: deLending,
      liquidate: deLiquidate,
      algorithmic: enAlgorithmic,
      staking: deStaking,
    },
  },
  lng: detectLanguage(),
  fallbackLng: "en",
  defaultNS: "swap",
  ns: [
    "swap",
    "trade",
    "common",
    "strategies",
    "portfolio",
    "index",
    "borrow",
    "header",
    "home",
    "ecosystem",
    "merge",
    "leagues",
    "lending",
    "staking",
  ],
  interpolation: {
    escapeValue: false,
  },
});

export { i18n, SUPPORTED_LANGUAGES, type SupportedLanguage };
