import { Effect, Schedule, Stream, SubscriptionRef } from "effect"
import { BINANCE_SMART_CHAIN, type Chain, type ChainId, ETHEREUM } from "../chains.js"
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

const METAMASK_CONNECTION_KEY = "calc_metamask_connection"

const SUPPORTED_CHAINS: ReadonlyArray<Chain> = [
    ETHEREUM,
    BINANCE_SMART_CHAIN
] as const

export const SUPPORTED_CHAINS_BY_DISPLAY_NAME: Record<string, Chain> = SUPPORTED_CHAINS.reduce(
    (acc, chain) => ({
        ...acc,
        [chain.displayName]: chain
    }),
    {} as Record<string, Chain>
)

export const SUPPORTED_CHAINS_BY_ID: Record<string, Chain> = SUPPORTED_CHAINS.reduce(
    (acc, chain) => ({
        ...acc,
        [chain.id]: chain
    }),
    {} as Record<string, Chain>
)

const METAMASK_WALLET: Wallet = {
    type: "MetaMask" as const,
    supportedChains: SUPPORTED_CHAINS,
    icon: "images/metamask.svg",
    color: "#f46f35",
    connection: {
        status: "disconnected" as const
    }
}

export class MetaMaskService extends Effect.Service<MetaMaskService>()("MetaMaskService", {
    effect: Effect.gen(function*() {
        const providersRef = yield* EIP1193Providers
        const providers = yield* providersRef.get
        const storage = yield* StorageService

        const connectionData = yield* storage.get(METAMASK_CONNECTION_KEY)
        const storedConnection = connectionData ? JSON.parse(connectionData) : { status: "disconnected" }

        const connectionRef = yield* SubscriptionRef.make<Connection>(storedConnection)

        if (storedConnection.status === "connected") {
            yield* Effect.gen(function*() {
                const provider = (yield* providersRef.get).get("MetaMask")?.provider

                if (provider) {
                    const accounts = yield* Effect.tryPromise({
                        try: () => provider.request({ method: "eth_accounts" }),
                        catch: () => []
                    })

                    if (!accounts.length) {
                        yield* SubscriptionRef.set(connectionRef, { status: "disconnected" as const })
                    } else {
                        const chainId = yield* Effect.tryPromise({
                            try: () => provider.request({ method: "eth_chainId" }),
                            catch: () => null
                        })

                        yield* SubscriptionRef.set(connectionRef, {
                            status: "connected" as const,
                            address: accounts[0],
                            chain: SUPPORTED_CHAINS_BY_ID[Number(chainId)] || "unsupported",
                            label: "MetaMask"
                        })

                        setupEventListeners(provider, connectionRef)
                    }
                } else {
                    yield* SubscriptionRef.set(connectionRef, { status: "disconnected" as const })
                }
            })
        }

        yield* Effect.forkDaemon(
            Stream.runForEach(
                connectionRef.changes,
                (connectionState) =>
                    connectionState.status === "connected"
                        ? storage.set(METAMASK_CONNECTION_KEY, JSON.stringify(connectionState))
                        : storage.remove(METAMASK_CONNECTION_KEY)
            )
        )

        if (storedConnection.status === "connected") {
            const provider = providers.get("MetaMask")?.provider
            if (provider) setupEventListeners(provider, connectionRef)
        }

        return {
            wallet: Stream.map(connectionRef.changes, (connection) => ({
                ...METAMASK_WALLET,
                connection
            })),

            connect: (chainId?: ChainId) =>
                Effect.gen(function*() {
                    const provider = (yield* providersRef.get).get("MetaMask")?.provider

                    if (!provider) {
                        return yield* Effect.fail(new WalletNotInstalledError({ walletType: "MetaMask" }))
                    }

                    if (chainId) {
                        const chain = SUPPORTED_CHAINS_BY_ID[chainId]
                        if (!chain || chain.type !== "evm") {
                            return yield* Effect.fail(new ChainNotSupportedError({ walletType: "MetaMask", chainId }))
                        }
                    }

                    yield* SubscriptionRef.set(connectionRef, {
                        status: "connecting" as const
                    })

                    yield* connectEvm(provider, connectionRef, chainId)
                }),

            switchChain: (chainId: ChainId) =>
                Effect.gen(function*() {
                    const connection = yield* connectionRef.get

                    if (connection.status === "connected" && typeof connection.chain !== "string") {
                        if (connection.chain.id === chainId) {
                            return yield* Effect.succeed(connection)
                        }
                    }

                    const provider = (yield* providersRef.get).get("MetaMask")?.provider

                    if (!provider) {
                        return yield* Effect.fail(new WalletNotInstalledError({ walletType: "MetaMask" }))
                    }

                    const chain = SUPPORTED_CHAINS_BY_ID[chainId]
                    if (!chain || chain.type !== "evm") {
                        return yield* Effect.fail(new ChainNotSupportedError({ walletType: "MetaMask", chainId }))
                    }

                    yield* switchChainMetaMask(provider, connectionRef, chainId)
                }),

            disconnect: () =>
                Effect.gen(function*() {
                    yield* SubscriptionRef.set(connectionRef, { status: "disconnecting" as const })

                    const provider = (yield* providersRef.get).get("MetaMask")?.provider

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

const setupEventListeners = (
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
                    console.log("Chain changed to:", chainId)
                    return state.status === "connected"
                        ? { ...state, chain: SUPPORTED_CHAINS_BY_ID[Number(chainId)] || "unsupported" }
                        : state
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
                        address: accounts[0]
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
                ? new ConnectionRejectedError({ walletType: "MetaMask", reason: "User rejected connection request" })
                : new RpcError({ walletType: "MetaMask", message: error.message })
    })

    const accounts = yield* Effect.retry(tryFetchAccounts, {
        while: (error) => error instanceof RpcError,
        times: 3,
        schedule: Schedule.exponential("2 seconds")
    })

    if (!accounts || accounts.length === 0) {
        return yield* Effect.fail(new AccountsNotAvailableError({ walletType: "MetaMask" }))
    }

    const chainId = yield* Effect.tryPromise({
        try: () => provider.request({ method: "eth_chainId" }),
        catch: (e) =>
            Effect.fail(
                new RpcError({
                    walletType: "MetaMask",
                    message: e instanceof Error ? e.message : `Unknown network issue: ${e}`
                })
            )
    })

    let chain = SUPPORTED_CHAINS_BY_ID[chainId]

    if (!chain || (requestedChainId && chainId !== requestedChainId)) {
        const newChainId = requestedChainId || SUPPORTED_CHAINS[0].id
        yield* switchChainMetaMask(provider, connectionRef, newChainId)
        chain = SUPPORTED_CHAINS_BY_ID[newChainId]
    }

    setupEventListeners(provider, connectionRef)

    yield* SubscriptionRef.update(connectionRef, () => ({
        status: "connected" as const,
        address: accounts[0],
        chain,
        label: "MetaMask"
    }))
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
                    chainId: `0x${chain.id.toString(16)}`,
                    rpcUrls: chain.rpcUrls,
                    chainName: chain.displayName,
                    nativeCurrency: chain.nativeCurrency
                }]
            }),
        catch: (error: any) =>
            "code" in error && (error.code === 4001 || error.code === 4100) ?
                new ConnectionRejectedError({
                    walletType: "MetaMask",
                    reason: error.message
                }) :
                new RpcError({ walletType: "MetaMask", message: error.message })
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

const switchChainMetaMask = (
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
                params: [{ chainId: `0x${chainId.toString(16)}` }]
            }),
        catch: (error: any) =>
            "code" in error || error.code == 4902
                ? new ChainNotAddedError({ walletType: "MetaMask", chainId })
                : new RpcError({ walletType: "MetaMask", message: error.message })
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
})
