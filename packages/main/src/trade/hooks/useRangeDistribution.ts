import { useMemo } from "react";
import { generateCclDistribution } from "rujira.js";
import { useRangeContext } from "../components/Range";

const PRECISION = 1_000_000_000_000;
const DEFAULT_RANGE_DELTA = 0.02;

export const useRangeDistribution = () => {
  const { high, low, skew, spread, price } = useRangeContext();

  const distribution = useMemo(
    () =>
      generateCclDistribution({
        high: Number(high || 0n) / PRECISION,
        low: Number(low || 0n) / PRECISION,
        price: Number(price || 0n) / PRECISION,
        sigma: skew / 10,
        spread: Number(spread) / PRECISION,
        delta: DEFAULT_RANGE_DELTA,
        model: "linear",
      }),
    [high, low, price, skew, spread]
  );

  return distribution;
};
