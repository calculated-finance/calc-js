import {
  CosmWasmClient,
  SigningCosmWasmClient,
} from "@cosmjs/cosmwasm-stargate";
import type { OfflineSigner } from "@cosmjs/proto-signing";
import { GasPrice, StargateClient } from "@cosmjs/stargate";
import { BigDecimal, Config, Effect, Ref, Schedule, Schema } from "effect";
import type { ChainId, CosmosChain } from "./chains.js";
import { CHAINS } from "./chains.js";
import { SignerNotAvailableError } from "./clients.js";

export const Uint128 = Schema.BigInt.pipe(
  Schema.clampBigInt(
    BigInt(0),
    BigInt(340282366841710300949128831971969468211n)
  )
);

export const Uint64 = Schema.String;

export type Uint64 = typeof Uint64.Type;

export const Decimal = Schema.BigDecimal.pipe(
  Schema.clampBigDecimal(
    BigDecimal.fromBigInt(0n),
    BigDecimal.fromBigInt(340282366841710300949128831971969468211n)
  )
);

export const Timestamp = Uint64;

export type Timestamp = typeof Timestamp.Type;

export const Duration = Schema.Struct({
  secs: Schema.Positive,
  nanos: Schema.NonNegative,
});

export const Coin = Schema.Struct({
  amount: Uint128,
  denom: Schema.NonEmptyTrimmedString,
});

export const AddrSchema = Schema.NonEmptyTrimmedString.pipe(
  Schema.brand("Addr"),
  Schema.maxLength(255),
  Schema.minLength(1)
);

export type Addr = typeof AddrSchema.Type;

export const RujiraStagenetAddrSchema = AddrSchema.pipe(
  Schema.startsWith("sthor")
);

export type RujiraStagenetAddr = typeof RujiraStagenetAddrSchema.Type;

export const RujiraMainnetAddrSchema = AddrSchema.pipe(
  Schema.startsWith("thor")
);

export type RujiraMainnetAddr = typeof RujiraMainnetAddrSchema.Type;

export class CosmWasmConnectionError extends Schema.TaggedError<CosmWasmConnectionError>()(
  "CosmWasmConnectionError",
  {
    cause: Schema.Defect,
  }
) {}

export class CosmWasmQueryError extends Schema.TaggedError<CosmWasmQueryError>()(
  "CosmWasmQueryError",
  {
    cause: Schema.Defect,
  }
) {}

export const getCosmWasmClient = (chain: CosmosChain) =>
  Effect.acquireRelease(
    Effect.tryPromise({
      try: async () => {
        for (const rpcUrl of chain.rpcUrls) {
          try {
            const client = await CosmWasmClient.connect(rpcUrl);
            console.log(`Connected to RPC URL ${rpcUrl} for chain ${chain.id}`);
            return client;
          } catch (error) {
            console.error(`Failed to connect to RPC URL ${rpcUrl}: ${error}`);
          }
        }

        throw new Error("No available RPC URLs to connect to");
      },
      catch: (error) => new CosmWasmConnectionError({ cause: error }),
    }),
    (client) => Effect.sync(client.disconnect)
  );

export interface RotatingClient<C> {
  /**
   * Runs `f` against the current client. On failure, disconnects, rotates to
   * the next RPC URL (looping through all until one connects), and retries `f`
   * once. If another concurrent caller has already rotated, reuses that client
   * instead of reconnecting.
   */
  use: <A>(
    f: (client: C) => Promise<A>
  ) => Effect.Effect<A, CosmWasmConnectionError | CosmWasmQueryError>;
}

/**
 * A long-lived client that fails over to the next RPC URL on error. Intended
 * for long-running processes (scheduler/indexer) where the single connection
 * picked at startup can go bad mid-run. Must be used within a Scope; the
 * connection is closed on scope exit.
 */
export const makeRotatingClient = <C>(opts: {
  rpcUrls: readonly string[];
  connect: (rpcUrl: string) => Promise<C>;
  disconnect: (client: C) => void;
}) =>
  Effect.gen(function* () {
    const connectFrom = (startIdx: number) =>
      Effect.tryPromise({
        try: async () => {
          const n = opts.rpcUrls.length;
          for (let i = 0; i < n; i++) {
            const idx = (startIdx + i) % n;
            const rpcUrl = opts.rpcUrls[idx];
            try {
              const client = await opts.connect(rpcUrl);
              console.log(`Connected to RPC URL ${rpcUrl}`);
              return { client, idx };
            } catch (error) {
              console.error(`Failed to connect to RPC URL ${rpcUrl}: ${error}`);
            }
          }
          throw new Error("No available RPC URLs to connect to");
        },
        catch: (cause) => new CosmWasmConnectionError({ cause }),
      });

    const disconnectQuietly = (client: C) =>
      Effect.sync(() => {
        try {
          opts.disconnect(client);
        } catch {
          // ignore disconnect errors
        }
      });

    const stateRef = yield* Ref.make(yield* connectFrom(0));

    yield* Effect.addFinalizer(() =>
      Effect.flatMap(Ref.get(stateRef), (s) => disconnectQuietly(s.client))
    );

    const use = <A>(f: (client: C) => Promise<A>) =>
      Effect.gen(function* () {
        const current = yield* Ref.get(stateRef);

        return yield* Effect.tryPromise({
          try: () => f(current.client),
          catch: (cause) => new CosmWasmQueryError({ cause }),
        }).pipe(
          Effect.catchAll(() =>
            Effect.gen(function* () {
              const latest = yield* Ref.get(stateRef);
              // Another concurrent caller may already have rotated; only
              // reconnect if we are still pointed at the failed client.
              const next =
                latest.client === current.client
                  ? yield* Effect.gen(function* () {
                      yield* disconnectQuietly(current.client);
                      const reconnected = yield* connectFrom(current.idx + 1);
                      yield* Ref.set(stateRef, reconnected);
                      return reconnected;
                    })
                  : latest;

              return yield* Effect.tryPromise({
                try: () => f(next.client),
                catch: (cause) => new CosmWasmQueryError({ cause }),
              });
            })
          )
        );
      });

    return { use } as RotatingClient<C>;
  });

export const getStargateClient = (chain: CosmosChain) =>
  Effect.acquireRelease(
    Effect.tryPromise({
      try: () => StargateClient.connect(chain.rpcUrls[0]),
      catch: (error) => new CosmWasmConnectionError({ cause: error }),
    }),
    (client) => Effect.sync(client.disconnect)
  );

export const getSigningCosmWamClient = (
  signer: OfflineSigner,
  chain: CosmosChain
) =>
  Effect.acquireRelease(
    Effect.tryPromise({
      try: async () =>
        SigningCosmWasmClient.connectWithSigner(chain.rpcUrls[0], signer, {
          gasPrice: GasPrice.fromString(chain.defaultGasPrice),
        }),
      catch: (error: any) => {
        console.warn(
          `Failed to connect to chain ${chain.id} with signer:`,
          error
        );
        return new SignerNotAvailableError({
          cause: `Failed to connect to chain ${chain.id} with signer: ${error.message}`,
        });
      },
    }).pipe(Effect.retry(Schedule.exponential("500 millis"))),
    (signer) =>
      Effect.sync(() => {
        console.log(`Disconnecting signer for chain ${chain.id}`);
        signer.disconnect();
      })
  );

export class UseCosmWasmClient extends Effect.Service<UseCosmWasmClient>()(
  "UseCosmWasmClient",
  {
    scoped: Effect.gen(function* () {
      const rpcUrl = yield* Config.string("RPC_URL");

      const client = yield* Effect.acquireRelease(
        Effect.tryPromise(() => CosmWasmClient.connect(rpcUrl)),
        (client) => Effect.sync(client.disconnect)
      );

      return {
        use: <A>(f: (client: CosmWasmClient) => Promise<A>) =>
          Effect.gen(function* () {
            return yield* Effect.tryPromise({
              try: () => f(client),
              catch: (cause) => new CosmWasmConnectionError({ cause }),
            });
          }),
      };
    }),
  }
) {}

export class CosmWasm extends Effect.Service<CosmWasm>()("CosmWasm", {
  scoped: Effect.gen(function* () {
    const clients = new Map<ChainId, CosmWasmClient>();

    yield* Effect.all(
      CHAINS.filter((chain) => chain.type === "cosmos").map((chain) =>
        Effect.tryPromise({
          try: async () => {
            const client = await CosmWasmClient.connect(chain.rpcUrls[0]);
            clients.set(chain.id, client);
          },
          catch: (cause) => new CosmWasmConnectionError({ cause }),
        })
      ),
      { concurrency: "unbounded" }
    );

    yield* Effect.addFinalizer(() =>
      Effect.gen(function* () {
        yield* Effect.all(
          Array.from(clients.values()).map((c) => Effect.sync(c.disconnect)),
          { concurrency: "unbounded" }
        );

        console.log("CosmWasm clients disconnected");
      })
    );

    return {
      clients,

      getClient: (chainId: ChainId) =>
        Effect.gen(function* () {
          const client = clients.get(chainId);

          if (!client) {
            return yield* Effect.fail(
              new CosmWasmConnectionError({
                cause: `No CosmWasmClient found for chain id ${chainId}`,
              })
            );
          }

          return client;
        }),

      queryContractSmart: (
        chainId: ChainId,
        contractAddress: string,
        query: Record<string, any>
      ) =>
        Effect.gen(function* () {
          const client = clients.get(chainId);

          if (!client) {
            return yield* Effect.fail(
              new CosmWasmConnectionError({
                cause: `No CosmWasm client found for chain ${chainId}`,
              })
            );
          }

          return yield* Effect.tryPromise({
            try: () => client.queryContractSmart(contractAddress, query),
            catch: (cause) =>
              new CosmWasmQueryError({
                cause: `Querying contract ${contractAddress} on chain id ${chainId} with query: ${JSON.stringify(
                  query,
                  null,
                  2
                )}: ${cause}`,
              }),
          });
        }),
    } as const;
  }),
}) {}
