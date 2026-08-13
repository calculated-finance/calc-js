export type CclModel = "quadratic" | "linear";

export interface CclRangeConfig {
  high: number;
  low: number;
  price: number;
  sigma: number;
  spread: number;
  delta: number;
  model?: CclModel;
}

export interface CclDistributionBucket {
  pStart: number;
  pEnd: number;
  pMid: number;
  weight: number;
  pct: number;
  side: "ask" | "bid";
}

export interface CclDistribution {
  asks: CclDistributionBucket[];
  bids: CclDistributionBucket[];
  price: number;
  askPrice: number;
  bidPrice: number;
  avgAskFillPrice: number;
  avgBidFillPrice: number;
  balanceRatio: number | null;
}
