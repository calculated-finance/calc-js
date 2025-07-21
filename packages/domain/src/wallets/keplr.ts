import type { Window as KeplrWindow } from "@keplr-wallet/types"
import { Effect, Option, Schedule, Stream, SubscriptionRef } from "effect"
import { BINANCE_SMART_CHAIN, type Chain, type ChainId, COSMOS_HUB, ETHEREUM, RUJIRA_STAGENET } from "../chains.js"
import type { EIP1193Provider } from "../evm.js"
import { EIP1193Providers } from "../evm.js"
import { StorageService } from "../storage.js"
import type { Connection, Wallet } from "./index.js"
import {
    AccountsNotAvailableError,
    ChainNotAddedError,
    ChainNotSupportedError,
    ConnectionRejectedError,
    RpcError,
    WalletNotInstalledError
} from "./index.js"

declare global {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface Window extends KeplrWindow {}
}
const KEPLR_CONNECTION_KEY = "calc_keplr_connection"

const SUPPORTED_CHAINS: ReadonlyArray<Chain> = [
    RUJIRA_STAGENET,
    ETHEREUM,
    BINANCE_SMART_CHAIN,
    COSMOS_HUB
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
    icon: "images/keplr.png"
}

export class KeplrService extends Effect.Service<KeplrService>()("KeplrService", {
    effect: Effect.gen(function*() {
        const providersRef = yield* EIP1193Providers
        const evmProviders = yield* providersRef.get
        const storage = yield* StorageService

        const connectionData = yield* storage.get(KEPLR_CONNECTION_KEY)
        const storedConnection = connectionData ? JSON.parse(connectionData) : { status: "disconnected" }

        const connectionRef = yield* SubscriptionRef.make<Connection>(storedConnection)

        if (storedConnection.status === "connected") {
            yield* Effect.gen(function*() {
                if (typeof storedConnection.chain! === "string") {
                    const chain = SUPPORTED_CHAINS_BY_ID[storedConnection.chain]

                    if (chain.type === "evm") {
                        const provider = evmProviders.get("Keplr")?.provider

                        if (provider) {
                            yield* connectEvm(provider, connectionRef, chain.id)
                        } else {
                            yield* SubscriptionRef.set(connectionRef, { status: "disconnected" })
                        }
                    } else if (chain.type === "cosmos") {
                        yield* connectCosmos(connectionRef, chain)
                    }
                }
            })
        }

        yield* Effect.forkDaemon(
            Stream.runForEach(
                connectionRef.changes,
                (connectionState) =>
                    connectionState.status === "connected"
                        ? storage.set(KEPLR_CONNECTION_KEY, JSON.stringify(connectionState))
                        : storage.remove(KEPLR_CONNECTION_KEY)
            )
        )

        if (storedConnection.status === "connected") {
            const provider = evmProviders.get("Keplr")?.provider
            if (provider) setupEvmEventListeners(provider, connectionRef)
        }

        return {
            wallet: Stream.filterMap(
                providersRef.changes,
                (providers) => {
                    const hasEvmProvider = providers.has("Keplr")
                    const hasCosmosProvider = !!(window as any).keplr

                    if (!hasEvmProvider && !hasCosmosProvider) {
                        return Option.none()
                    }

                    return Option.some({
                        ...KEPLR_WALLET,
                        supportedChains: SUPPORTED_CHAINS.filter((chain) =>
                            chain.type === "evm" && hasEvmProvider ||
                            chain.type === "cosmos" && hasCosmosProvider
                        )
                    })
                }
            ),

            connect: (chainId?: ChainId) =>
                Effect.gen(function*() {
                    const chain = chainId !== undefined ? SUPPORTED_CHAINS_BY_ID[chainId] : undefined

                    if (chainId && !chain) {
                        return yield* Effect.fail(new ChainNotSupportedError({ walletType: "Keplr", chainId }))
                    }

                    const provider = (yield* providersRef.get).get("Keplr")?.provider

                    if (!provider) {
                        return yield* Effect.fail(new WalletNotInstalledError({ walletType: "Keplr" }))
                    }

                    yield* SubscriptionRef.set(connectionRef, {
                        status: "connecting" as const,
                        wallet: KEPLR_WALLET.type
                    })

                    if (chain?.type === "evm") {
                        yield* connectEvm(provider, connectionRef, chainId)
                    } else {
                        yield* connectCosmos(connectionRef, chain || RUJIRA_STAGENET)
                    }
                }),

            connection: connectionRef.changes,

            switchChain: (chainId: ChainId) =>
                Effect.gen(function*() {
                    const chain = SUPPORTED_CHAINS_BY_ID[chainId]

                    if (!chain) {
                        return yield* Effect.fail(new ChainNotSupportedError({ walletType: "Keplr", chainId }))
                    }

                    const connection = yield* connectionRef.get

                    if (connection.status === "connected" && typeof connection.chain !== "string") {
                        if (connection.chain.id === chainId) {
                            return yield* Effect.succeed(connection)
                        }
                    }

                    if (chain.type === "evm") {
                        const provider = (yield* providersRef.get).get("Keplr")?.provider

                        if (!provider) {
                            return yield* Effect.fail(new WalletNotInstalledError({ walletType: "Keplr" }))
                        }

                        yield* connectEvm(provider, connectionRef, chainId)
                    } else {
                        yield* switchToCosmosChainKeplr(connectionRef, chain)
                    }
                }),

            disconnect: () =>
                Effect.gen(function*() {
                    const provider = (yield* providersRef.get).get("Keplr")?.provider

                    if (provider) {
                        provider.removeAllListeners("chainChanged")
                        provider.removeAllListeners("accountsChanged")
                    }

                    yield* SubscriptionRef.set(connectionRef, { status: "disconnected" as const })
                })
        }
    }),
    dependencies: [EIP1193Providers.Default, StorageService.Default]
}) {}

const setupEvmEventListeners = (
    provider: EIP1193Provider,
    connectionRef: SubscriptionRef.SubscriptionRef<Connection>
) => {
    provider.removeAllListeners("chainChanged")
    provider.removeAllListeners("accountsChanged")

    provider.on("chainChanged", (chainId: string) => {
        Effect.runSync(
            SubscriptionRef.update(
                connectionRef,
                (state) => {
                    if (state.status === "connected" && typeof state.chain !== "string") {
                        if (state.chain.type !== "evm") {
                            Effect.runPromise(connectEvm(provider, connectionRef, chainId as ChainId))
                        }
                    }
                    return state
                }
            )
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
                        account: { ...state.account, address: accounts[0] }
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
        console.log("Keplr keystore changed, updating connection state")
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
    requestedChainId?: ChainId
) => Effect.gen(function*() {
    const tryFetchAccounts = Effect.tryPromise({
        try: () => provider.request({ method: "eth_requestAccounts" }),
        catch: (error: any) =>
            "code" in error && error.code === 4001
                ? new ConnectionRejectedError({ walletType: "Keplr", reason: "User rejected connection request" })
                : new RpcError({ walletType: "Keplr", message: error.message })
    })

    const accounts = yield* Effect.retry(tryFetchAccounts, {
        while: (error) => error instanceof RpcError,
        times: 3,
        schedule: Schedule.exponential("2 seconds")
    })

    if (!accounts || accounts.length === 0) {
        return yield* Effect.fail(new AccountsNotAvailableError({ walletType: "Keplr" }))
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
        const newChainId = requestedChainId || SUPPORTED_CHAINS[0].id
        yield* switchToEvmChainKeplr(provider, connectionRef, newChainId)
        chain = SUPPORTED_CHAINS_BY_ID[newChainId]
    }

    setupEvmEventListeners(provider, connectionRef)

    yield* SubscriptionRef.update(connectionRef, () => ({
        status: "connected" as const,
        wallet: KEPLR_WALLET,
        account: { address: accounts[0], chainType: "evm" as const },
        chain
    }))
})

const connectCosmos = (
    connectionRef: SubscriptionRef.SubscriptionRef<Connection>,
    chain: Chain
) => Effect.gen(function*() {
    yield* SubscriptionRef.update(connectionRef, (currentConnection) => ({
        ...currentConnection,
        chain: "switching_chain" as const
    }))

    const tryEnable = Effect.tryPromise({
        try: async () => {
            await (window as any).keplr.enable(chain.id)
            return (window as any).keplr.getKey(chain.id)
        },
        catch: (error: any) => {
            console.error("Failed to enable Keplr for chain:", chain.id, error)
            return new Error(error)
        }
    })

    const { bech32Address } = yield* Effect.retry(tryEnable, {
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

    setupCosmosEventListeners(connectionRef)

    yield* SubscriptionRef.set(connectionRef, {
        status: "connected" as const,
        wallet: KEPLR_WALLET,
        chain,
        account: {
            address: bech32Address,
            chainType: "cosmos" as const
        }
    })
})

const addEvmChain = (
    provider: EIP1193Provider,
    connectionRef: SubscriptionRef.SubscriptionRef<Connection>,
    chain: Chain
) => Effect.gen(function*() {
    yield* SubscriptionRef.update(connectionRef, (currentConnection) => ({
        ...currentConnection,
        chain: "adding_chain" as const
    }))

    const tryAddChain = Effect.tryPromise({
        try: () =>
            provider.request({
                method: "wallet_addEthereumChain",
                params: [{
                    chainId: chain.id,
                    rpcUrls: chain.rpcUrls,
                    chainName: chain.displayName,
                    nativeCurrency: chain.nativeCurrency
                }]
            }),
        catch: (error: any) =>
            "code" in error && (error.code === 4001 || error.code === 4100) ?
                new ConnectionRejectedError({
                    walletType: "Keplr",
                    reason: error.message
                }) :
                new RpcError({ walletType: "Keplr", message: error.message })
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
    chainId: ChainId
) => Effect.gen(function*() {
    yield* SubscriptionRef.update(connectionRef, (currentConnection) => ({
        ...currentConnection,
        chain: "switching_chain" as const
    }))

    const trySwitchChain = Effect.tryPromise({
        try: () =>
            provider.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId }]
            }),
        catch: (error: any) => {
            console.error("Failed to switch chain in Keplr:", error)
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
            (_) => addEvmChain(provider, connectionRef, SUPPORTED_CHAINS_BY_ID[chainId])
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
            await (window as any).keplr.enable(chain.id)
            return (window as any).keplr.getKey(chain.id)
        },
        catch: (error: any) => {
            console.error("Failed to enable Keplr for chain:", chain.id, error)
            return new Error(error)
        }
    })

    const { bech32Address } = yield* Effect.retry(tryEnable, {
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

    yield* SubscriptionRef.set(connectionRef, {
        status: "connected" as const,
        wallet: KEPLR_WALLET,
        chain,
        account: {
            address: bech32Address,
            chainType: "cosmos" as const
        }
    })
})
