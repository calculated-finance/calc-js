import { useQueryClient } from "@tanstack/react-query";
import { RujiraIndexer } from "@template/domain/indexer";
import { Effect, Fiber, Stream } from "effect";
import { useEffect } from "react";
import { useConnectedWallet } from "./use-connection";
import { useIndexerRuntime } from "./use-runtime";

/**
 * Subscribes to the indexer's calcOrdersUpdated feed for the connected
 * wallet and invalidates the strategy queries on every event, so on-chain
 * changes (executions, status flips) appear without polling or reloading.
 */
export const useOrderUpdates = () => {
  const runtime = useIndexerRuntime();
  const queryClient = useQueryClient();
  const { wallet } = useConnectedWallet();

  const address = wallet?.connection.status === "connected" ? wallet.connection.address : undefined;

  useEffect(() => {
    if (!address) return;

    const fiber = runtime.runFork(
      Effect.flatMap(RujiraIndexer, (indexer) =>
        Stream.runForEach(indexer.calcOrdersUpdated(address), () =>
          Effect.promise(async () => {
            await queryClient.invalidateQueries({ queryKey: ["strategies"] });
            await queryClient.invalidateQueries({ queryKey: ["strategy"] });
          }),
        ),
      ).pipe(Effect.tapErrorCause((cause) => Effect.logWarning("order updates stream ended", cause))),
    );

    return () => {
      void Effect.runFork(Fiber.interrupt(fiber));
    };
  }, [address, runtime, queryClient]);
};
