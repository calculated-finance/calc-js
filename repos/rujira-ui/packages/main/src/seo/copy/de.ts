import type { enDynamicProductSeoCopy, enStaticProductSeoCopy } from "./en";
import type { ProductSeoCopy, ProductSeoTemplateCopy } from "./types";

type MatchingStaticCopy<T extends Record<string, ProductSeoCopy>> = {
  [Path in keyof T]: ProductSeoCopy;
};

type MatchingDynamicCopy<T extends Record<string, ProductSeoTemplateCopy>> = {
  [Kind in keyof T]: ProductSeoTemplateCopy;
};

export const deStaticProductSeoCopy = {
  "/": {
    title: "Rujira | Omnichain DeFi mit nativen Assets",
    description:
      "Handle, verleihe und verdiene mit nativem BTC, ETH, BNB, XRP und mehr. Faire, transparente DeFi mit voller Kontrolle über deine Assets. Powered by THORChain.",
    breadcrumbLabel: "Startseite",
  },
  "/index": {
    title: "In Krypto-Indizes investieren | RUJI Index | Rujira",
    description:
      "Investiere in diversifizierte Krypto-Indizes auf Basis nativer Assets. Erhalte Onchain-Exposure über mehrere Assets hinweg mit einem transparenten und dezentralen Index.",
    breadcrumbLabel: "Indizes",
  },
  "/trade": {
    title: "BTC, ETH & mehr handeln und verdienen | RUJI Trade | Rujira",
    description:
      "Handle und verdiene mit nativem BTC, ETH, XRP und mehr auf RUJI Trade. Nutze Orderbook-Trading und automatisierte Strategien mit Kontrolle ueber deine Assets.",
    breadcrumbLabel: "Handeln",
  },
  "/strategies": {
    title:
      "Krypto-Yield verdienen | Staken, Verleihen & Liquidität bereitstellen",
    description:
      "Verdiene mit Staking, Lending und Liquidität über native Assets. Entdecke transparente Onchain-Strategien und behalte die volle Kontrolle über deine Assets.",
    breadcrumbLabel: "Strategien",
  },
  "/lend": {
    title:
      "Krypto verleihen und Rendite verdienen | RUJI Money Market | Rujira",
    description:
      "Verleihen Sie native Assets und verdienen Sie Rendite von Kreditnehmern in transparenten, dezentralen Kreditmärkten. Nutzen Sie BTC, ETH, XRP und mehr auf Rujira.",
    breadcrumbLabel: "RUJI Money Market",
  },
  "/stake": {
    title:
      "Assets staken & Protokolleinnahmen verdienen | RUJI Staking | Rujira",
    description:
      "Stake deine Assets auf Rujira und verdiene einen Anteil an den Protokolleinnahmen. Wähle, wie du Rewards erhältst, und beende dein Staking jederzeit sofort.",
    breadcrumbLabel: "RUJI Staking",
  },
  "/borrow": {
    title: "Krypto beleihen | RUJI Money Market | Rujira",
    description:
      "Greife auf die Liquidität deiner nativen Assets zu, ohne sie zu verkaufen. Beleihe BTC, ETH, XRP und mehr und behalte die volle Kontrolle über deine Assets.",
    breadcrumbLabel: "Leihen",
  },
  "/liquidate": {
    title: "Kaufen Sie Krypto-Assets mit Rabatt | RUJI Liquidations | Rujira",
    description:
      "Kaufen Sie Krypto-Assets unter dem Marktpreis über transparente Liquidationsauktionen mit offenem Zugang für alle auf Rujira.",
    breadcrumbLabel: "RUJI Liquidations",
  },
  "/leaderboard": {
    title:
      "Trading Rewards verdienen | Im Leaderboard aufsteigen | RUJI Leagues",
    description:
      "Verdiene RUJI Rewards durch Trading und Aktivitäten im Rujira-Ökosystem. Steige im Leaderboard auf, sammle Punkte und sichere dir jede Saison Rewards.",
    breadcrumbLabel: "Leaderboard",
  },
  "/automated-trading": {
    title: "Automatisches Trading Leaderboard | RUJI Trade | Rujira",
    description:
      "Entdecke die leistungsstärksten automatisierten Market-Making-Positionen auf Rujira. Sortiere nach APR, MOIC und DPI und übernimm die Parameter einer Strategie mit einem Klick in RUJI Trade.",
    breadcrumbLabel: "Automatisches Trading",
  },
} as const satisfies MatchingStaticCopy<typeof enStaticProductSeoCopy>;

export const deDynamicProductSeoCopy = {
  indexAsset: {
    titleTemplate:
      "In den [1] Index investieren | Diversifiziertes Krypto-Exposure | Rujira",
    descriptionTemplate:
      "Greife über den [1] Index auf diversifiziertes Krypto-Exposure zu. Mit nativen Assets als Grundlage und vollständig transparent Onchain auf Rujira.",
  },
  borrowPair: {
    titleTemplate: "[1] gegen [2] leihen | Native Asset Borrowing | Rujira",
    descriptionTemplate:
      "Leihe [1] gegen native [2] auf Rujira. Erhalte Liquidität, ohne deine Assets zu verkaufen, mit robusten Price Feeds und fairen Liquidations.",
  },
  tradePair: {
    titleTemplate: "Native [1]-[2] handeln | Native Asset Trading | Rujira",
    descriptionTemplate:
      "Handle [1]-[2] direkt auf RUJI Trade ueber ein dezentrales Onchain-Orderbook.",
  },
  tradePairAutomated: {
    titleTemplate: "Native automatisierte [1]-[2] Strategien | Rujira",
    descriptionTemplate:
      "Verdiene mit nativen automatisierten [1]-[2] Strategien auf Rujira. Stelle Liquiditaet fuer RUJI Trade bereit und behalte die Kontrolle ueber deine Assets.",
  },
  swapPair: {
    titleTemplate: "[1] sofort in [2] tauschen | Native Asset Swaps | Rujira",
    descriptionTemplate:
      "Tausche [1] in Sekunden gegen [2] mit nativen Assets. Niedrige Gebühren, keine Wrapped Tokens und nahtlose Cross-Chain-Swaps powered by THORChain.",
  },
  stakingStrategy: {
    titleTemplate: "[1] staken | Yield verdienen & Auto-Compound | Rujira",
    descriptionTemplate:
      "Stake [1] und verdiene Yield aus echter Protokollaktivität mit optionalem Auto-Compounding. Transparentes Onchain-Staking mit voller Kontrolle über deine Assets.",
  },
  lendStrategy: {
    titleTemplate:
      "Native [1] verleihen | Dezentralen Yield verdienen | Rujira",
    descriptionTemplate:
      "Verleihe native [1] und verdiene Yield in transparenten Onchain-Märkten. Dezentrales Lending mit voller Kontrolle über deine Assets auf Rujira.",
  },
  ammXykStrategy: {
    titleTemplate:
      "[1] Liquidität bereitstellen | Trading Fees verdienen | Rujira",
    descriptionTemplate:
      "Stelle [1] Liquidität bereit und verdiene Trading Fees bei jedem Swap. Generiere Yield mit nativen Assets über transparente Onchain-Märkte auf Rujira.",
  },
} as const satisfies MatchingDynamicCopy<typeof enDynamicProductSeoCopy>;
