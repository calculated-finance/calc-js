import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate"
import { GasPrice } from "@cosmjs/stargate"
import type { Window as KeplrWindow } from "@keplr-wallet/types"
import { Effect, Schedule, Stream, SubscriptionRef } from "effect"
import type { Chain, ChainId, CosmosChain, EvmChain, EvmChainId } from "../chains.js"
import { BINANCE_SMART_CHAIN, COSMOS_HUB, ETHEREUM, RUJIRA_STAGENET } from "../chains.js"
import { createCosmosSigningClient } from "../cosmos.js"
import type { EIP1193Provider } from "../evm.js"
import { EIP1193Providers } from "../evm.js"
import { StorageService } from "../storage.js"
import type { Connection, CosmosTransactionMsgs, Transaction, TransactionData, Wallet } from "./index.js"
import {
    AccountsNotAvailableError,
    ChainNotAddedError,
    ChainNotSupportedError,
    ClientNotAvailableError,
    ConnectionRejectedError,
    RpcError,
    SignerNotAvailableError,
    TransactionSimulationFailed,
    TransactionSubmissionFailed
} from "./index.js"

declare global {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface Window extends KeplrWindow {}
}
const KEPLR_CONNECTION_KEY = "calc_keplr_connection"

const SUPPORTED_COSMOS_CHAINS: ReadonlyArray<CosmosChain> = [
    COSMOS_HUB,
    RUJIRA_STAGENET
] as const

const SUPPORTED_EVM_CHAINS: ReadonlyArray<EvmChain> = [
    ETHEREUM,
    BINANCE_SMART_CHAIN
] as const

const SUPPORTED_CHAINS: ReadonlyArray<Chain> = [
    ...SUPPORTED_COSMOS_CHAINS,
    ...SUPPORTED_EVM_CHAINS
] as const

export const SUPPORTED_CHAINS_BY_DISPLAY_NAME: Record<string, Chain> = SUPPORTED_CHAINS.reduce(
    (acc, chain) => ({
        ...acc,
        [chain.displayName]: chain
    }),
    {} as Record<string, Chain>
)

export const SUPPORTED_CHAINS_BY_ID: Record<ChainId, Chain> = SUPPORTED_CHAINS.reduce(
    (acc, chain) => ({
        ...acc,
        [chain.id]: chain
    }),
    {} as Record<ChainId, Chain>
)

const KEPLR_WALLET: Wallet = {
    type: "Keplr" as const,
    supportedChains: SUPPORTED_CHAINS,
    icon: "images/keplr.png",
    color: "#355fe8",
    connection: {
        status: "disconnected" as const
    }
}

export const KeplrSigningClient = {
    simulateTransaction: (transaction: Transaction) =>
        Effect.gen(function*() {
            if (transaction.type === "cosmos") {
                const simulationResponse = yield* simulateCosmosTransaction(transaction.chainId, transaction.data).pipe(
                    Effect.catchAll((e) => new TransactionSimulationFailed(e))
                )

                return {
                    type: "cosmos" as const,
                    result: simulationResponse
                }
            }

            return yield* Effect.fail(
                new TransactionSimulationFailed({
                    cause: `Keplr does not support simulating ${transaction.type} transactions`
                })
            )
        }).pipe(Effect.scoped),
    signAndSubmitTransaction: (transaction: Transaction) =>
        Effect.gen(function*() {
            if (transaction.type === "cosmos") {
                const deliverTxResponse = yield* executeCosmosTransaction(transaction.chainId, transaction.data).pipe(
                    Effect.catchAll((e) => new TransactionSubmissionFailed(e))
                )

                return {
                    type: "cosmos" as const,
                    result: deliverTxResponse
                }
            }

            return yield* Effect.fail(
                new TransactionSubmissionFailed({
                    cause: `Keplr does not support signing ${transaction.type} transactions`
                })
            )
        }).pipe(Effect.scoped)
}

export class KeplrService extends Effect.Service<KeplrService>()(
    "KeplrService",
    {
        effect: Effect.gen(function*() {
            const providersRef = yield* EIP1193Providers
            const evmProviders = yield* providersRef.get
            const storage = yield* StorageService

            const connectionData = yield* storage.get(KEPLR_CONNECTION_KEY)
            const storedConnection = connectionData
                ? JSON.parse(connectionData)
                : { status: "disconnected" }

            const connectionRef = yield* SubscriptionRef.make<Connection>(storedConnection)

            if (storedConnection.status === "connected") {
                yield* Effect.gen(function*() {
                    if (typeof storedConnection.chain !== "string") {
                        const chain = SUPPORTED_CHAINS_BY_ID[storedConnection.chain.id]

                        if (chain.type === "evm") {
                            const provider = evmProviders.get("Keplr")?.provider

                            if (provider) {
                                yield* connectEvm(provider, connectionRef, chain.id)
                            } else {
                                yield* SubscriptionRef.set(connectionRef, {
                                    status: "disconnected"
                                })
                            }
                        } else if (chain.type === "cosmos") {
                            yield* connectCosmos(connectionRef, chain)
                        }
                    }
                })
            }

            yield* Effect.fork(
                Stream.runForEach(connectionRef.changes, (connectionState) =>
                    connectionState.status === "connected"
                        ? storage.set(KEPLR_CONNECTION_KEY, JSON.stringify(connectionState))
                        : storage.remove(KEPLR_CONNECTION_KEY))
            )

            if (storedConnection.status === "connected") {
                const provider = evmProviders.get("Keplr")?.provider
                if (provider) setupEvmEventListeners(provider, connectionRef)
            }

            return {
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
                        const chain = chainId !== undefined
                            ? SUPPORTED_CHAINS_BY_ID[chainId]
                            : undefined

                        if (chainId && !chain) {
                            return yield* Effect.fail(
                                new ChainNotSupportedError({ walletType: "Keplr", chainId })
                            )
                        }

                        const provider = (yield* providersRef.get).get("Keplr")?.provider

                        if (!provider) {
                            return yield* Effect.fail(
                                new ClientNotAvailableError({ cause: "Keplr" })
                            )
                        }

                        yield* SubscriptionRef.set(connectionRef, {
                            status: "connecting" as const
                        })

                        if (chain?.type === "evm") {
                            yield* connectEvm(provider, connectionRef, chainId as EvmChainId)
                        } else {
                            yield* connectCosmos(connectionRef, chain as CosmosChain || RUJIRA_STAGENET)
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
                            typeof connection.chain !== "string"
                        ) {
                            if (connection.chain.id === chainId) {
                                return yield* Effect.succeed(connection)
                            }
                        }

                        if (chain.type === "evm") {
                            const provider = (yield* providersRef.get).get("Keplr")?.provider

                            if (!provider) {
                                return yield* Effect.fail(
                                    new ClientNotAvailableError({ cause: "Keplr" })
                                )
                            }

                            yield* connectEvm(provider, connectionRef, chainId as EvmChainId)
                        } else {
                            yield* switchToCosmosChainKeplr(connectionRef, chain)
                        }
                    }),

                disconnect: () =>
                    Effect.gen(function*() {
                        yield* SubscriptionRef.set(connectionRef, {
                            status: "disconnecting" as const
                        })

                        const provider = (yield* providersRef.get).get("Keplr")?.provider

                        if (provider) {
                            provider.removeAllListeners("chainChanged")
                            provider.removeAllListeners("accountsChanged")
                        }

                        yield* SubscriptionRef.set(connectionRef, {
                            status: "disconnected" as const
                        })
                    }),

                simulateTransaction: (chain: Chain, data: TransactionData) =>
                    Effect.gen(function*() {
                        if (data.type === "cosmos") {
                            return yield* simulateCosmosTransaction(chain.id, data.msgs)
                        }

                        return yield* Effect.fail(
                            new ChainNotSupportedError({
                                walletType: "Keplr",
                                chainId: chain.id
                            })
                        )
                    }),

                signTransaction: (chain: Chain, data: TransactionData) =>
                    Effect.gen(function*() {
                        if (data.type === "cosmos") {
                            yield* executeCosmosTransaction(chain.id, data.msgs)
                        }

                        yield* Effect.fail(
                            new ChainNotSupportedError({
                                walletType: "Keplr",
                                chainId: chain.id
                            })
                        )
                    })
            }
        }),
        dependencies: [EIP1193Providers.Default, StorageService.Default]
    }
) {}

export const simulateCosmosTransaction = (
    chainId: ChainId,
    data: CosmosTransactionMsgs
) => Effect.gen(function*() {
    if (!window.keplr) {
        return yield* Effect.fail(new ClientNotAvailableError({ cause: "Keplr wallet not installed" }))
    }

    const signer = yield* Effect.tryPromise({
        try: () => window.keplr!.getOfflineSignerAuto(`${chainId}`),
        catch: (error: any) => new SignerNotAvailableError({ cause: `Keplr signer not available: ${error.message}` })
    })

    const client = yield* Effect.acquireRelease(
        Effect.tryPromise({
            try: () =>
                SigningCosmWasmClient.connectWithSigner(
                    SUPPORTED_CHAINS_BY_ID[chainId].rpcUrls[0],
                    signer,
                    {
                        gasPrice: GasPrice.fromString("0.0rune")
                    }
                ),
            catch: (error: any) =>
                new SignerNotAvailableError({ cause: `Unable to connect with Keplr signer: ${error.message}` })
        }),
        (client) => Effect.sync(client.disconnect)
    )

    const accounts = yield* Effect.tryPromise({
        try: () => signer.getAccounts(),
        catch: (error: any) =>
            new AccountsNotAvailableError({ cause: `Keplr accounts not available: ${error.message}` })
    })

    return yield* Effect.tryPromise({
        try: () => client.simulate(accounts[0].address, data, "auto"),
        catch: (error: any) => new TransactionSimulationFailed({ cause: error.message })
    })
})

export const executeCosmosTransaction = (
    chainId: ChainId,
    data: CosmosTransactionMsgs
) => Effect.gen(function*() {
    if (!window.keplr) {
        return yield* Effect.fail(new ClientNotAvailableError({ cause: "Keplr wallet not installed" }))
    }

    const signer = yield* Effect.tryPromise({
        try: () => window.keplr!.getOfflineSignerAuto(`${chainId}`),
        catch: (error: any) => new SignerNotAvailableError({ cause: `Keplr signer not available: ${error.message}` })
    })

    const client = yield* Effect.acquireRelease(
        Effect.tryPromise({
            try: () =>
                SigningCosmWasmClient.connectWithSigner(
                    SUPPORTED_CHAINS_BY_ID[chainId].rpcUrls[0],
                    signer,
                    {
                        gasPrice: GasPrice.fromString("0.0rune")
                    }
                ),
            catch: (error: any) =>
                new SignerNotAvailableError({ cause: `Unable to connect with Keplr signer: ${error.message}` })
        }),
        (client) => Effect.sync(client.disconnect)
    )

    const accounts = yield* Effect.tryPromise({
        try: () => signer.getAccounts(),
        catch: (error: any) =>
            new AccountsNotAvailableError({ cause: `Keplr accounts not available: ${error.message}` })
    })

    return yield* Effect.tryPromise({
        try: () => client.signAndBroadcast(accounts[0].address, data, "auto"),
        catch: (error: any) =>
            new TransactionSubmissionFailed({ cause: `Failed to submit transaction: ${error.message}` })
    })
})

const setupEvmEventListeners = (
    provider: EIP1193Provider,
    connectionRef: SubscriptionRef.SubscriptionRef<Connection>
) => {
    provider.removeAllListeners("chainChanged")
    provider.removeAllListeners("accountsChanged")

    provider.on("chainChanged", (chainId: string) => {
        Effect.runSync(
            SubscriptionRef.update(connectionRef, (state) => {
                if (state.status === "connected" && typeof state.chain !== "string") {
                    if (state.chain.type !== "evm") {
                        Effect.runPromise(
                            connectEvm(provider, connectionRef, Number(chainId))
                        )
                    }
                }
                return state
            })
        )
    })

    provider.on("accountsChanged", (accounts: Array<string>) => {
        Effect.runSync(
            SubscriptionRef.update(connectionRef, (state) => {
                if (!accounts.length) {
                    return { status: "disconnected" as const }
                }
                if (state.status === "connected") {
                    return {
                        ...state,
                        address: accounts[0]
                    }
                }

                return state
            })
        )
    })
}

const setupCosmosEventListeners = (
    connectionRef: SubscriptionRef.SubscriptionRef<Connection>
) => {
    window.addEventListener("keplr_keystorechange", () => {
        Effect.runSync(
            SubscriptionRef.update(connectionRef, (state) => {
                if (state.status === "connected" && typeof state.chain !== "string") {
                    if (state.chain.type === "cosmos") {
                        Effect.runPromise(connectCosmos(connectionRef, state.chain))
                    }
                }
                return state
            })
        )
    })
}

const connectEvm = (
    provider: EIP1193Provider,
    connectionRef: SubscriptionRef.SubscriptionRef<Connection>,
    requestedChainId?: EvmChainId
) => Effect.gen(function*() {
    const tryFetchAccounts = Effect.tryPromise({
        try: () => provider.request({ method: "eth_requestAccounts" }),
        catch: (error: any) =>
            "code" in error && error.code === 4001
                ? new ConnectionRejectedError({
                    walletType: "Keplr",
                    reason: "User rejected connection request"
                })
                : new RpcError({ walletType: "Keplr", message: error.message })
    })

    const accounts = yield* Effect.retry(tryFetchAccounts, {
        while: (error) => error instanceof RpcError,
        times: 3,
        schedule: Schedule.exponential("2 seconds")
    })

    if (!accounts || accounts.length === 0) {
        return yield* Effect.fail(
            new AccountsNotAvailableError({ cause: "Keplr" })
        )
    }

    const chainId = yield* Effect.tryPromise({
        try: () => provider.request({ method: "eth_chainId" }),
        catch: (e) =>
            Effect.fail(
                new RpcError({
                    walletType: "Keplr",
                    message: e instanceof Error ? e.message : `Unknown network issue: ${e}`
                })
            )
    })

    let chain = SUPPORTED_CHAINS_BY_ID[chainId]

    if (!chain || (requestedChainId && chainId !== requestedChainId)) {
        const newChainId = requestedChainId || SUPPORTED_EVM_CHAINS[0].id
        yield* switchToEvmChainKeplr(provider, connectionRef, newChainId)
        chain = SUPPORTED_CHAINS_BY_ID[newChainId]
    }

    if (!chain) {
        return yield* SubscriptionRef.update(connectionRef, (currentConnection) => ({
            ...currentConnection,
            chain: "unsupported" as const
        }))
    }

    setupEvmEventListeners(provider, connectionRef)

    const { name } = yield* Effect.tryPromise({
        try: () => window.keplr?.getKey(`eip155:${chain.id}`) as Promise<{ name: string }>,
        catch: () => ({ name: "Keplr" })
    })

    yield* SubscriptionRef.update(connectionRef, () => ({
        status: "connected" as const,
        address: accounts[0],
        chain,
        label: name
    }))
})

const connectCosmos = (
    connectionRef: SubscriptionRef.SubscriptionRef<Connection>,
    chain: CosmosChain
) => Effect.gen(function*() {
    yield* SubscriptionRef.update(connectionRef, (currentConnection) => ({
        ...currentConnection,
        chain: "switching_chain" as const
    }))

    const tryEnable = Effect.tryPromise({
        try: async () => {
            await window.keplr?.enable(`${chain.id}`)
            return window.keplr?.getKey(`${chain.id}`)
        },
        catch: (error: any) => {
            console.error("Failed to enable Keplr for chain:", chain.id, error)
            return new Error(error)
        }
    })

    const key = yield* Effect.retry(tryEnable, {
        while: (error) => error instanceof Error,
        schedule: Schedule.exponential("2 seconds")
    }).pipe(
        Effect.catchAll(() =>
            SubscriptionRef.update(connectionRef, (currentConnection) => ({
                ...currentConnection,
                chain: "unsupported" as const
            }))
        )
    )

    if (key) {
        setupCosmosEventListeners(connectionRef)

        yield* SubscriptionRef.set(connectionRef, {
            status: "connected" as const,
            chain,
            address: key.bech32Address,
            label: key.name
        })
    } else {
        yield* SubscriptionRef.update(connectionRef, (currentConnection) => ({
            ...currentConnection,
            chain: "unsupported" as const
        }))
    }
})

const addEvmChain = (
    provider: EIP1193Provider,
    connectionRef: SubscriptionRef.SubscriptionRef<Connection>,
    chain: EvmChain
) => Effect.gen(function*() {
    yield* SubscriptionRef.update(connectionRef, (currentConnection) => ({
        ...currentConnection,
        chain: "adding_chain" as const
    }))

    const tryAddChain = Effect.tryPromise({
        try: () =>
            provider.request({
                method: "wallet_addEthereumChain",
                params: [
                    {
                        chainId: `0x${chain.id.toString(16)}`,
                        rpcUrls: chain.rpcUrls,
                        chainName: chain.displayName,
                        nativeCurrency: chain.nativeCurrency
                    }
                ]
            }),
        catch: (error: any) =>
            "code" in error && (error.code === 4001 || error.code === 4100)
                ? new ConnectionRejectedError({
                    walletType: "Keplr",
                    reason: error.message
                })
                : new RpcError({ walletType: "Keplr", message: error.message })
    })

    yield* Effect.retry(tryAddChain, {
        while: (error) => error instanceof RpcError,
        times: 3,
        schedule: Schedule.exponential("2 seconds")
    }).pipe(
        Effect.catchAll(() =>
            SubscriptionRef.update(connectionRef, (conn) => ({
                ...conn,
                chain: "unsupported" as const
            }))
        )
    )
})

const switchToEvmChainKeplr = (
    provider: EIP1193Provider,
    connectionRef: SubscriptionRef.SubscriptionRef<Connection>,
    chainId: EvmChainId
) => Effect.gen(function*() {
    yield* SubscriptionRef.update(connectionRef, (currentConnection) => ({
        ...currentConnection,
        chain: "switching_chain" as const
    }))

    const trySwitchChain = Effect.tryPromise({
        try: () =>
            provider.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: `0x${chainId.toString(16)}` }]
            }),
        catch: (error: any) => {
            return "code" in error || error.code == 4902
                ? new ChainNotAddedError({ walletType: "Keplr", chainId })
                : new RpcError({ walletType: "Keplr", message: error.message })
        }
    })

    yield* Effect.retry(trySwitchChain, {
        while: (error) => error instanceof RpcError,
        schedule: Schedule.exponential("2 seconds")
    }).pipe(
        Effect.catchTag(
            "ChainNotAddedError",
            (_) => addEvmChain(provider, connectionRef, SUPPORTED_EVM_CHAINS[chainId])
        ),
        Effect.catchAll(() =>
            SubscriptionRef.update(connectionRef, (conn) => ({
                ...conn,
                chain: "unsupported" as const
            }))
        )
    )

    setupEvmEventListeners(provider, connectionRef)

    yield* SubscriptionRef.update(connectionRef, (currentConnection) => ({
        ...currentConnection,
        chain: SUPPORTED_CHAINS_BY_ID[chainId]
    }))
})

const switchToCosmosChainKeplr = (
    connectionRef: SubscriptionRef.SubscriptionRef<Connection>,
    chain: Chain
) => Effect.gen(function*() {
    yield* SubscriptionRef.update(connectionRef, (currentConnection) => ({
        ...currentConnection,
        chain: "switching_chain" as const
    }))

    const tryEnable = Effect.tryPromise({
        try: async () => {
            await window.keplr?.enable(`${chain.id}`)
            return window.keplr?.getKey(`${chain.id}`)
        },
        catch: (error: any) => {
            console.error("Failed to enable Keplr for chain:", chain.id, error)
            return new Error(error)
        }
    })

    const key = yield* Effect.retry(tryEnable, {
        while: (error) => error instanceof Error,
        schedule: Schedule.exponential("2 seconds")
    }).pipe(
        Effect.catchAll(() => {
            console.error("Failed to switch to Cosmos chain:", chain.id)
            return SubscriptionRef.update(connectionRef, (currentConnection) => ({
                ...currentConnection,
                chain: "unsupported" as const
            }))
        })
    )

    if (key) {
        yield* SubscriptionRef.set(connectionRef, {
            status: "connected" as const,
            chain,
            address: key.bech32Address,
            label: key.name
        })
    }
})

export const createKeplrSigningClient = (chainId: ChainId) =>
    Effect.gen(function*() {
        if (!window.keplr) {
            return yield* Effect.fail(new ClientNotAvailableError({ cause: "Keplr extension not available" }))
        }

        const chain = SUPPORTED_CHAINS_BY_ID[chainId]

        if (chain.type === "cosmos") {
            const signer = yield* Effect.tryPromise({
                try: () => window.keplr!.getOfflineSignerAuto(`${chain.id}`),
                catch: (error: any) =>
                    new SignerNotAvailableError({ cause: `Keplr signer not available: ${error.message}` })
            })

            return yield* createCosmosSigningClient(chain, signer)
        }

        return yield* Effect.fail(
            new ChainNotSupportedError({ walletType: "Keplr", chainId })
        )
    })
