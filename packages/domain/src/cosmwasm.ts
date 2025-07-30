import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate"
import { BigDecimal, Effect, Schema } from "effect"
import type { ChainId } from "./chains.js"
import { CHAINS } from "./chains.js"

export const Uint128 = Schema.BigInt.pipe(Schema.clampBigInt(
    BigInt(0),
    BigInt(340282366841710300949128831971969468211n)
))

export const Uint64 = Schema.String

export type Uint64 = typeof Uint64.Type

export const Decimal = Schema.BigDecimal.pipe(Schema.clampBigDecimal(
    BigDecimal.fromBigInt(0n),
    BigDecimal.fromBigInt(340282366841710300949128831971969468211n)
))

export const Coin = Schema.Struct({
    amount: Uint128,
    denom: Schema.NonEmptyTrimmedString
})

export const AddrSchema = Schema.NonEmptyTrimmedString.pipe(
    Schema.brand("Addr"),
    Schema.maxLength(255),
    Schema.minLength(1)
)

export type Addr = typeof AddrSchema.Type

export const RujiraStagenetAddrSchema = AddrSchema.pipe(
    Schema.startsWith("sthor")
)

export type RujiraStagenetAddr = typeof RujiraStagenetAddrSchema.Type

export const RujiraMainnetAddrSchema = AddrSchema.pipe(
    Schema.startsWith("thor")
)

export type RujiraMainnetAddr = typeof RujiraMainnetAddrSchema.Type

export class CosmWasmConnectionError extends Schema.TaggedError<CosmWasmConnectionError>()("CosmWasmConnectionError", {
    cause: Schema.Defect
}) {}

export class CosmWasmQueryError extends Schema.TaggedError<CosmWasmQueryError>()("CosmWasmQueryError", {
    cause: Schema.Defect
}) {}

export class CosmWasm extends Effect.Service<CosmWasm>()("CosmWasm", {
    scoped: Effect.gen(function*() {
        const clients = new Map<ChainId, CosmWasmClient>()

        for (const chain of CHAINS) {
            if (chain.type !== "cosmos") {
                continue
            }

            const client = yield* Effect.tryPromise({
                try: () => CosmWasmClient.connect(chain.rpcUrls[0]),
                catch: (cause) => new CosmWasmConnectionError({ cause })
            })

            clients.set(chain.id, client)
        }

        yield* Effect.addFinalizer(() =>
            Effect.gen(function*() {
                yield* Effect.all(
                    Array.from(clients.values()).map((c) => Effect.sync(c.disconnect)),
                    { concurrency: "unbounded" }
                )

                console.log("CosmWasm clients disconnected")
            })
        )

        return {
            clients,

            getClient: (chainId: ChainId) =>
                Effect.gen(function*() {
                    const client = clients.get(chainId)

                    if (!client) {
                        return yield* Effect.fail(
                            new CosmWasmConnectionError({ cause: `No CosmWasmClient found for chain id ${chainId}` })
                        )
                    }

                    return client
                }),

            queryContractSmart: (chainId: ChainId, contractAddress: string, query: Record<string, any>) =>
                Effect.gen(function*() {
                    const client = clients.get(chainId)

                    if (!client) {
                        return yield* Effect.fail(
                            new CosmWasmConnectionError({ cause: `No CosmWasm client found for chain ${chainId}` })
                        )
                    }

                    return yield* Effect.tryPromise({
                        try: () => client.queryContractSmart(contractAddress, query),
                        catch: (cause) =>
                            new CosmWasmQueryError({
                                cause: `Querying contract ${contractAddress} on chain id ${chainId} with query: ${
                                    JSON.stringify(query, null, 2)
                                }: ${cause}`
                            })
                    })
                })
        } as const
    })
}) {}
