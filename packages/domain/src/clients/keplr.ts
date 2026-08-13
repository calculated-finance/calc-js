import { SigningCosmWasmClient } from "@cosmjs/cosmwasm"
import { GasPrice } from "@cosmjs/stargate"
import type { Window as KeplrWindow } from "@keplr-wallet/types"
import { Effect, Schedule, Stream, SubscriptionRef } from "effect"
import type { Chain, ChainId, CosmosChain, EvmChain } from "../chains.js"
import { BINANCE_SMART_CHAIN, COSMOS_HUB, ETHEREUM, RUJIRA } from "../chains.js"
import type { Connection, CosmosTransactionMsgs, TransactionData, Wallet, WalletClient } from "./model.js"
import {
    AccountsNotAvailableError,
    ChainNotSupportedError,
    ClientNotAvailableError,
    OperationNotSupportedError,
    SignerNotAvailableError,
    TransactionSimulationFailed,
    TransactionSubmissionFailed
} from "./model.js"
import { createCosmosSigningClient } from "../cosmos.js"
import { EIP1193Providers } from "../evm.js"
import { StorageService } from "../storage.js"
import { makeConnectionStore } from "./connection.js"
import type { EvmWalletContext } from "./evm-connection.js"
import { connectEvm, switchEvmChain } from "./evm-connection.js"

declare global {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface Window extends KeplrWindow {}
}

const KEPLR_CONNECTION_KEY = "calc_keplr_connection"

const SUPPORTED_COSMOS_CHAINS: ReadonlyArray<CosmosChain> = [COSMOS_HUB, RUJIRA] as const

const SUPPORTED_EVM_CHAINS: ReadonlyArray<EvmChain> = [ETHEREUM, BINANCE_SMART_CHAIN] as const

const SUPPORTED_CHAINS: ReadonlyArray<Chain> = [
    ...SUPPORTED_COSMOS_CHAINS,
    ...SUPPORTED_EVM_CHAINS
] as const

export const SUPPORTED_CHAINS_BY_ID: Record<ChainId, Chain> = SUPPORTED_CHAINS.reduce(
    (acc, chain) => ({ ...acc, [chain.id]: chain }),
    {}
)

const KEPLR_WALLET: Wallet = {
    type: "Keplr",
    supportedChains: SUPPORTED_CHAINS,
    color: "#355fe8",
    connection: { status: "disconnected" }
}

export class KeplrService extends Effect.Service<KeplrService>()(
    "KeplrService",
    {
        effect: Effect.gen(function*() {
            const providersRef = yield* EIP1193Providers
            const { ref: connectionRef, stored } = yield* makeConnectionStore(KEPLR_CONNECTION_KEY)

            const makeEvmContext = Effect.gen(function*() {
                const provider = (yield* providersRef.get).get("Keplr")?.provider

                if (!provider) {
                    return yield* Effect.fail(new ClientNotAvailableError({ cause: "Keplr" }))
                }

                const context: EvmWalletContext = {
                    walletType: "Keplr",
                    provider,
                    connectionRef,
                    supportedChainsById: SUPPORTED_CHAINS_BY_ID,
                    defaultChainId: SUPPORTED_EVM_CHAINS[0].id,
                    getLabel: (chainId) =>
                        Effect.tryPromise({
                            try: () => window.keplr?.getKey(`eip155:${chainId}`) as Promise<{ name: string }>,
                            catch: () => undefined
                        }).pipe(
                            Effect.map((key) => key.name),
                            Effect.catchAll(() => Effect.succeed("Keplr"))
                        )
                }

                return context
            })

            // Restore a persisted session against whichever chain type it was on.
            if (stored.status === "connected" && stored.chain.status === "ready") {
                const chain = SUPPORTED_CHAINS_BY_ID[stored.chain.chain.id]

                if (chain?.type === "evm") {
                    yield* makeEvmContext.pipe(
                        Effect.flatMap((context) => connectEvm(context, chain.id)),
                        Effect.catchAll(() => SubscriptionRef.set(connectionRef, { status: "disconnected" as const }))
                    )
                } else if (chain?.type === "cosmos") {
                    yield* connectCosmos(connectionRef, chain).pipe(
                        Effect.catchAll(() => SubscriptionRef.set(connectionRef, { status: "disconnected" as const }))
                    )
                }
            }

            const client: WalletClient = {
                type: "Keplr",

                wallet: Stream.debounce(
                    Stream.zipLatestWith(
                        providersRef.changes,
                        connectionRef.changes,
                        (providers, connection) => {
                            const hasEvmProvider = providers.has("Keplr")
                            const hasCosmosProvider = !!window.keplr
                            return {
                                ...KEPLR_WALLET,
                                supportedChains: SUPPORTED_CHAINS.filter(
                                    (chain) =>
                                        (chain.type === "evm" && hasEvmProvider) ||
                                        (chain.type === "cosmos" && hasCosmosProvider)
                                ),
                                connection
                            }
                        }
                    ),
                    80
                ),

                connect: (chainId?: ChainId) =>
                    Effect.gen(function*() {
                        const chain = chainId !== undefined ? SUPPORTED_CHAINS_BY_ID[chainId] : undefined

                        if (chainId && !chain) {
                            return yield* Effect.fail(
                                new ChainNotSupportedError({ walletType: "Keplr", chainId })
                            )
                        }

                        yield* SubscriptionRef.set(connectionRef, { status: "connecting" as const })

                        if (chain?.type === "evm") {
                            const context = yield* makeEvmContext
                            yield* connectEvm(context, chain.id)
                        } else {
                            yield* connectCosmos(connectionRef, (chain as CosmosChain | undefined) ?? RUJIRA)
                        }
                    }),

                switchChain: (chainId: ChainId) =>
                    Effect.gen(function*() {
                        const chain = SUPPORTED_CHAINS_BY_ID[chainId]

                        if (!chain) {
                            return yield* Effect.fail(
                                new ChainNotSupportedError({ walletType: "Keplr", chainId })
                            )
                        }

                        const connection = yield* connectionRef.get

                        if (
                            connection.status === "connected" &&
                            connection.chain.status === "ready" &&
                            connection.chain.chain.id === chainId
                        ) {
                            return
                        }

                        if (chain.type === "evm") {
                            const context = yield* makeEvmContext
                            yield* switchEvmChain(context, chainId)
                        } else {
                            yield* switchToCosmosChain(connectionRef, chain)
                        }
                    }),

                disconnect: () =>
                    Effect.gen(function*() {
                        yield* SubscriptionRef.set(connectionRef, { status: "disconnecting" as const })

                        const provider = (yield* providersRef.get).get("Keplr")?.provider

                        if (provider) {
                            provider.removeAllListeners("chainChanged")
                            provider.removeAllListeners("accountsChanged")
                        }

                        yield* SubscriptionRef.set(connectionRef, { status: "disconnected" as const })
                    }),

                simulateTransaction: (chain: Chain, data: TransactionData) =>
                    data.type === "cosmos"
                        ? simulateCosmosTransaction(chain.id, data.msgs)
                        : Effect.fail(
                            new OperationNotSupportedError({
                                walletType: "Keplr",
                                operation: `simulateTransaction(${String(data.type)})`
                            })
                        ),

                signTransaction: (chain: Chain, data: TransactionData) =>
                    data.type === "cosmos"
                        ? executeCosmosTransaction(chain.id, data.msgs)
                        : Effect.fail(
                            new OperationNotSupportedError({
                                walletType: "Keplr",
                                operation: `signTransaction(${String(data.type)})`
                            })
                        )
            }

            return client
        }),
        dependencies: [EIP1193Providers.Default, StorageService.Default]
    }
) {}

/** Connect to (or re-enable) a cosmos chain through the Keplr extension. */
const connectCosmos = (
    connectionRef: SubscriptionRef.SubscriptionRef<Connection>,
    chain: CosmosChain
) =>
    Effect.gen(function*() {
        const tryEnable = Effect.tryPromise({
            try: async () => {
                await window.keplr?.enable(`${chain.id}`)
                return window.keplr?.getKey(`${chain.id}`)
            },
            catch: (cause) => new ClientNotAvailableError({ cause: `Keplr enable failed: ${String(cause)}` })
        })

        const key = yield* Effect.retry(tryEnable, {
            times: 3,
            schedule: Schedule.exponential("2 seconds")
        }).pipe(Effect.catchAll(() => Effect.succeed(undefined)))

        if (!key) {
            return yield* SubscriptionRef.update(connectionRef, (connection) =>
                connection.status === "connected"
                    ? { ...connection, chain: { status: "unsupported" as const, chainId: chain.id } }
                    : connection)
        }

        setupCosmosEventListeners(connectionRef)

        yield* SubscriptionRef.set(connectionRef, {
            status: "connected" as const,
            chain: { status: "ready" as const, chain },
            address: key.bech32Address,
            label: key.name
        })
    })

const switchToCosmosChain = (
    connectionRef: SubscriptionRef.SubscriptionRef<Connection>,
    chain: CosmosChain
) =>
    Effect.gen(function*() {
        yield* SubscriptionRef.update(connectionRef, (connection) =>
            connection.status === "connected"
                ? { ...connection, chain: { status: "switching" as const } }
                : connection)

        yield* connectCosmos(connectionRef, chain)
    })

const setupCosmosEventListeners = (
    connectionRef: SubscriptionRef.SubscriptionRef<Connection>
) => {
    window.addEventListener("keplr_keystorechange", () => {
        Effect.runSync(
            SubscriptionRef.update(connectionRef, (state) => {
                if (
                    state.status === "connected" &&
                    state.chain.status === "ready" &&
                    state.chain.chain.type === "cosmos"
                ) {
                    Effect.runPromise(connectCosmos(connectionRef, state.chain.chain))
                }
                return state
            })
        )
    })
}

/** Acquire a scoped signing client over Keplr's offline signer for a chain. */
const withKeplrSigningClient = <A, E>(
    chainId: ChainId,
    f: (
        client: SigningCosmWasmClient,
        address: string
    ) => Effect.Effect<A, E>
) =>
    Effect.gen(function*() {
        if (!window.keplr) {
            return yield* Effect.fail(new ClientNotAvailableError({ cause: "Keplr wallet not installed" }))
        }

        const signer = yield* Effect.tryPromise({
            try: () => window.keplr!.getOfflineSignerAuto(`${chainId}`),
            catch: (cause) => new SignerNotAvailableError({ cause: `Keplr signer not available: ${String(cause)}` })
        })

        const client = yield* Effect.acquireRelease(
            Effect.tryPromise({
                try: () =>
                    SigningCosmWasmClient.connectWithSigner(
                        SUPPORTED_CHAINS_BY_ID[chainId].rpcUrls[0],
                        signer,
                        { gasPrice: GasPrice.fromString("0.0rune") }
                    ),
                catch: (cause) =>
                    new SignerNotAvailableError({ cause: `Unable to connect with Keplr signer: ${String(cause)}` })
            }),
            (client) => Effect.sync(() => client.disconnect())
        )

        const accounts = yield* Effect.tryPromise({
            try: () => signer.getAccounts(),
            catch: (cause) => new AccountsNotAvailableError({ cause: `Keplr accounts not available: ${String(cause)}` })
        })

        return yield* f(client, accounts[0].address)
    }).pipe(Effect.scoped)

export const simulateCosmosTransaction = (chainId: ChainId, data: CosmosTransactionMsgs) =>
    withKeplrSigningClient(chainId, (client, address) =>
        Effect.tryPromise({
            try: () => client.simulate(address, data, "auto"),
            catch: (cause) =>
                new TransactionSimulationFailed({ cause: cause instanceof Error ? cause.message : String(cause) })
        }))

export const executeCosmosTransaction = (chainId: ChainId, data: CosmosTransactionMsgs) =>
    withKeplrSigningClient(chainId, (client, address) =>
        Effect.tryPromise({
            try: () => client.signAndBroadcast(address, data, "auto"),
            catch: (cause) =>
                new TransactionSubmissionFailed({
                    cause: cause instanceof Error ? cause.message : `Failed to submit transaction: ${String(cause)}`
                })
        }))

export const createKeplrSigningClient = (chainId: ChainId) =>
    Effect.gen(function*() {
        if (!window.keplr) {
            return yield* Effect.fail(new ClientNotAvailableError({ cause: "Keplr extension not available" }))
        }

        const chain = SUPPORTED_CHAINS_BY_ID[chainId]

        if (chain.type === "cosmos") {
            const signer = yield* Effect.tryPromise({
                try: () => window.keplr!.getOfflineSignerAuto(`${chain.id}`),
                catch: (cause) =>
                    new SignerNotAvailableError({ cause: `Keplr signer not available: ${String(cause)}` })
            })

            return yield* createCosmosSigningClient(chain, signer)
        }

        return yield* Effect.fail(
            new ChainNotSupportedError({ walletType: "Keplr", chainId })
        )
    })
