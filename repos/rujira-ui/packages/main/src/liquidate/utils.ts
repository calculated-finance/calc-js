import { Side } from "../trade/types";

export const liquidationBidDeviationBps = (side: Side, discountBps: number) =>
  side === Side.Base ? discountBps : -discountBps;
