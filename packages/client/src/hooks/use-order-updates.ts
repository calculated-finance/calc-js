import { useQueryClient } from "@tanstack/react-query";
import { RujiraIndexer } from "@template/domain/indexer";
import { Effect, Fiber, Stream } from "effect";
import { useEffect } from "react";
import { useAddressBook } from "./use-address-book";
import { useIndexerRuntime } from "./use-runtime";
import { useStrategyChain } from "./use-strategy-chain";

/**
 * Subscribes to the indexer's calcOrdersUpdated feed for every address-book
 * owner and invalidates the strategy queries on each event, so on-chain
 * changes appear (and changed balances flash) without polling or reloading.
 */
export const useOrderUpdates = () => {
  const runtime = useIndexerRuntime();
  const queryClient = useQueryClient();
  const { chain } = useStrategyChain();
  const { addressBook } = useAddressBook();

  // Joined so the effect keys on content, not object identity.
  const owners = Object.keys(addressBook[chain.id] ?? {}).sort().join(",");

  useEffect(() => {
    if (!owners) return;

    const fiber = runtime.runFork(
      Effect.flatMap(RujiraIndexer, (indexer) =>
        Stream.runForEach(
          Stream.mergeAll(
            owners.split(",").map((owner) => indexer.calcOrdersUpdated(owner)),
            { concurrency: "unbounded" },
          ),
          () =>
            Effect.promise(async () => {
              await queryClient.invalidateQueries({ queryKey: ["strategies"] });
              await queryClient.invalidateQueries({ queryKey: ["strategy"] });
              await queryClient.invalidateQueries({ queryKey: ["strategiesBalances"] });
              await queryClient.invalidateQueries({ queryKey: ["strategyBalances"] });
            }),
        ),
      ).pipe(Effect.tapErrorCause((cause) => Effect.logWarning("order updates stream ended", cause))),
    );

    return () => {
      void Effect.runFork(Fiber.interrupt(fiber));
    };
  }, [owners, chain.id, runtime, queryClient]);
};
