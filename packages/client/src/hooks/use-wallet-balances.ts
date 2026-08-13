import { useQuery } from "@tanstack/react-query";
import { RujiraIndexer } from "@template/domain/indexer";
import { Effect } from "effect";
import { useIndexerRuntime } from "./use-runtime";

/** A THORChain account's app-layer balances from the indexer. */
export const useWalletBalances = (address: string | undefined) => {
  const runtime = useIndexerRuntime();

  return useQuery({
    queryKey: ["walletBalances", address],
    enabled: !!address,
    staleTime: 30 * 1000,
    queryFn: () =>
      runtime.runPromise(
        Effect.gen(function* () {
          if (!address) {
            throw new Error("Cannot fetch wallet balances without an address");
          }
          const indexer = yield* RujiraIndexer;
          return yield* indexer.accountBalances(address);
        }),
      ),
  });
};
