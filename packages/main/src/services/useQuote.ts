import { useEffect, useState } from "react";
import { signers } from "rujira.js";
import { QUERY_CLIENT } from "./queryClient";

export type Quote = undefined | "loading" | signers.cosmos.QuoteSwap | Error;
export interface QuoteRequest {
  from: string;
  to: string;
  amount: bigint;
  destination: string;
  liquidityToleranceBps?: bigint;
}

export const useQuote = (
  req: QuoteRequest | null,
  affiliate = false
): Quote => {
  const [quote, setQuote] = useState<Quote>();

  useEffect(() => {
    setQuote(undefined);
    if (!req) return;
    setQuote("loading");

    QUERY_CLIENT.thorchain
      .getSwapQuote({
        fromAsset: req.from,
        toAsset: req.to,
        amount: req.amount,
        destination: req.destination,
        streamingInterval: 1n,
        streamingQuantity: 0n,
        affiliates: affiliate ? [{ id: "rj", bps: 50n }] : [],
        liquidityToleranceBps: req.liquidityToleranceBps,
      })
      .then(setQuote)
      .catch(setQuote);
  }, [req]);

  return quote;
};
