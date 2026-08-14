import { useQuery } from "@tanstack/react-query";
import type { ChainId } from "@template/domain/chains";
import { RujiraIndexer } from "@template/domain/indexer";
import { Effect } from "effect";
import { useIndexerRuntime } from "./use-runtime";

/**
 * A THORChain account's app-layer balances from the indexer. Keyed by the
 * wallet's active chain as well as its address so a chain switch always
 * gets its own cache entry, and the fetch is aborted if the key changes
 * mid-flight — otherwise a switch back inside staleTime would re-render
 * balances the previous chain's request wrote after the user left it.
 */
export const useWalletBalances = (address: string | undefined, chainId: ChainId | undefined) => {
  const runtime = useIndexerRuntime();

  return useQuery({
    queryKey: ["walletBalances", chainId, address],
    enabled: !!address && chainId !== undefined,
    staleTime: 30 * 1000,
    queryFn: ({ signal }) =>
      runtime.runPromise(
        Effect.gen(function* () {
          if (!address) {
            throw new Error("Cannot fetch wallet balances without an address");
          }
          const indexer = yield* RujiraIndexer;
          return yield* indexer.accountBalances(address);
        }),
        { signal },
      ),
  });
};
