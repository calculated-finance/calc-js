import type { DynamicProductSeoCopy, StaticProductSeoCopy } from "./types";

export const enStaticProductSeoCopy = {
  "/": {
    title: "Rujira | Omnichain DeFi With Native Assets",
    description:
      "Trade, lend, and earn with native BTC, ETH, BNB, XRP, and more. Fair, transparent, community-owned DeFi powered by THORChain.",
    breadcrumbLabel: "Home",
  },
  "/index": {
    title: "Invest in Crypto Indices | RUJI Index | Rujira",
    description:
      "Invest in diversified crypto indices backed by native assets. Build on-chain exposure across multiple assets through a transparent and decentralized index.",
    breadcrumbLabel: "Indices",
  },
  "/trade": {
    title: "Trade & Earn BTC, ETH & More | RUJI Trade | Rujira",
    description:
      "Trade and earn with native BTC, ETH, XRP and more on RUJI Trade. Use orderbook trading and automated strategies while keeping control of your assets.",
    breadcrumbLabel: "Trade",
  },
  "/strategies": {
    title: "Earn Crypto Yield | Stake, Lend & Provide Liquidity",
    description:
      "Earn from staking, lending, and liquidity strategies using native assets. Explore transparent onchain opportunities while keeping control of your assets.",
    breadcrumbLabel: "Strategies",
  },
  "/lend": {
    title: "Earn Yield by Lending Crypto | RUJI Money Market | Rujira",
    description:
      "Lend native assets and earn yield from borrowers in transparent, decentralized lending markets. Put BTC, ETH, XRP, and more to work on Rujira.",
    breadcrumbLabel: "RUJI Money Market",
  },
  "/stake": {
    title: "Stake & Earn Protocol Revenue | RUJI Staking | Rujira",
    description:
      "Stake assets on Rujira to earn a share of protocol revenue. Choose how you receive rewards and instantly unstake anytime.",
    breadcrumbLabel: "RUJI Staking",
  },
  "/borrow": {
    title: "Borrow Against Crypto | RUJI Money Market | Rujira",
    description:
      "Access liquidity from your native assets without selling them. Borrow against BTC, ETH, XRP, and more while keeping control of your holdings.",
    breadcrumbLabel: "Borrow",
  },
  "/liquidate": {
    title: "Buy Discounted Crypto Assets | RUJI Liquidations | Rujira",
    description:
      "Buy crypto assets below market price through transparent liquidation auctions with open participation for everyone on Rujira.",
    breadcrumbLabel: "RUJI Liquidations",
  },
  "/leaderboard": {
    title: "Earn Trading Rewards | Climb the Leaderboard | RUJI Leagues",
    description:
      "Earn RUJI rewards by trading and participating across the Rujira ecosystem. Climb the leaderboard, compete, and claim rewards each season.",
    breadcrumbLabel: "Leaderboard",
  },
  "/automated-trading": {
    title: "Automated Trading Leaderboard | RUJI Trade | Rujira",
    description:
      "Explore the top-performing automated market-making positions on Rujira. Rank by APR, MOIC, and DPI, then copy a strategy's parameters into RUJI Trade in one click.",
    breadcrumbLabel: "Automated Trading",
  },
} as const satisfies StaticProductSeoCopy;

export const enDynamicProductSeoCopy = {
  indexAsset: {
    titleTemplate: "Invest in [1] Index | Diversified Crypto Exposure | Rujira",
    descriptionTemplate:
      "Access diversified crypto exposure through the [1] Index. Built with native assets and fully transparent onchain through Rujira.",
  },
  borrowPair: {
    titleTemplate: "Borrow [1] Against [2] | Native Asset Borrowing | Rujira",
    descriptionTemplate:
      "Borrow [1] against native [2] on Rujira. Access liquidity without selling your holdings, with robust price feeds and fair liquidations.",
  },
  tradePair: {
    titleTemplate: "Trade Native [1]-[2] | Native Asset Trading | Rujira",
    descriptionTemplate:
      "Trade [1]-[2] directly on RUJI Trade through a decentralized onchain orderbook.",
  },
  tradePairAutomated: {
    titleTemplate: "Native Automated [1]-[2] Strategies | Rujira",
    descriptionTemplate:
      "Earn with native automated [1]-[2] strategies on Rujira. Provide liquidity to RUJI Trade while keeping control of your assets.",
  },
  swapPair: {
    titleTemplate: "Swap [1] to [2] Instantly | Native Asset Swaps | Rujira",
    descriptionTemplate:
      "Swap [1] for [2] in seconds using native assets. Low fees, no wrapped tokens, and seamless cross-chain swaps powered by THORChain.",
  },
  stakingStrategy: {
    titleTemplate: "Stake [1] | Earn Yield & Auto-Compound | Rujira",
    descriptionTemplate:
      "Stake [1] to earn yield from real protocol activity with optional auto-compounding. Transparent onchain staking with full control of your assets.",
  },
  lendStrategy: {
    titleTemplate: "Lend Native [1] | Earn Decentralized Yield | Rujira",
    descriptionTemplate:
      "Lend native [1] and earn yield from transparent onchain markets. Decentralized lending with full control of your assets on Rujira.",
  },
  ammXykStrategy: {
    titleTemplate: "Provide [1] Liquidity | Earn Trading Fees | Rujira",
    descriptionTemplate:
      "Provide [1] liquidity and earn trading fees from every swap. Generate yield with native assets through transparent onchain markets on Rujira.",
  },
} as const satisfies DynamicProductSeoCopy;
