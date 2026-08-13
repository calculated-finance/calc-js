import { useQuery } from "@tanstack/react-query";
import { RujiraIndexer } from "@template/domain/indexer";
import { FinPair, MAINNET_FIN_PAIRS } from "@template/domain/rujira";
import { Effect } from "effect";
import { useIndexerRuntime } from "./use-runtime";

const byDenom = (pairs: readonly FinPair[]) =>
  pairs.reduce<Partial<Record<string, Partial<Record<string, FinPair>>>>>(
    (acc, pair) => ({
      ...acc,
      [pair.denoms[0]]: {
        ...acc[pair.denoms[0]],
        [pair.denoms[1]]: pair,
      },
      [pair.denoms[1]]: {
        ...acc[pair.denoms[1]],
        [pair.denoms[0]]: pair,
      },
    }),
    {},
  );

/**
 * Live FIN pairs from the Rujira indexer, with the vendored static snapshot
 * as the initial value so routing works offline and before the first fetch.
 */
export const useFinPairs = () => {
  const runtime = useIndexerRuntime();

  const { data: pairs } = useQuery({
    queryKey: ["fin-pairs"],
    staleTime: 5 * 60 * 1000,
    initialData: MAINNET_FIN_PAIRS,
    queryFn: () => runtime.runPromise(Effect.flatMap(RujiraIndexer, (indexer) => indexer.finPairs)),
  });

  return {
    pairs,
    pairsByDenom: byDenom(pairs),
  };
};
