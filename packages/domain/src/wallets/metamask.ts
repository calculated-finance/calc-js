import { Effect, Option, Stream, SubscriptionRef } from "effect"
import type { Chain, ChainId } from "../chains.js"
import type { EIP1193Provider } from "../evm.js"
import { EIP1193Providers } from "../evm.js"
import { StorageService } from "../storage.js"
import type { Connection, Wallet } from "./index.js"
import {
    AccountsNotAvailableError,
    ChainNotAvailableError,
    ChainNotSupportedError,
    ConnectionRejectedError,
    WalletNotInstalledError
} from "./index.js"

const METAMASK_CONNECTION_KEY = "metamask_connection"

const SUPPORTED_CHAINS: ReadonlyArray<Chain> = [
    {
        type: "evm",
        id: "0x1",
        displayName: "Ethereum",
        color: "#627EEA",
        rpcUrls: ["https://ethereum-rpc.publicnode.com"],
        nativeCurrency: {
            name: "Ether",
            symbol: "ETH",
            decimals: 18
        }
    },
    {
        type: "evm",
        id: "0x38",
        displayName: "Binance Smart Chain",
        color: "#F3BA2E",
        rpcUrls: ["https://bsc-rpc.publicnode.com"],
        nativeCurrency: {
            name: "Binance Coin",
            symbol: "BNB",
            decimals: 18
        }
    }
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

export class MetaMaskService extends Effect.Service<MetaMaskService>()("MetaMaskService", {
    effect: Effect.gen(function*() {
        const providersRef = yield* EIP1193Providers
        const providers = yield* providersRef.get
        const storage = yield* StorageService

        const storedConnection = yield* Effect.gen(function*() {
            const stored = yield* storage.get(METAMASK_CONNECTION_KEY)
            if (!stored) return { status: "disconnected" as const }

            try {
                const parsed = JSON.parse(stored) as Connection
                if (parsed.status === "connected") {
                    const provider = providers.get("MetaMask")
                    if (provider) {
                        const accounts = yield* Effect.tryPromise({
                            try: () => provider.provider.request({ method: "eth_accounts" }),
                            catch: () => null
                        })

                        if (accounts && accounts.length > 0 && accounts.includes(parsed.account.address)) {
                            console.log("Restored MetaMask connection from storage")
                            return parsed
                        }
                    }
                }
            } catch {
                yield* storage.remove(METAMASK_CONNECTION_KEY)
            }

            return { status: "disconnected" as const }
        }).pipe(Effect.orElse(() => Effect.succeed({ status: "disconnected" as const })))

        const connection = yield* SubscriptionRef.make<Connection>(storedConnection)

        const setupStorageSync = Effect.gen(function*() {
            yield* Stream.runForEach(
                connection.changes,
                (connectionState) =>
                    Effect.gen(function*() {
                        if (connectionState.status === "connected") {
                            yield* storage.set(METAMASK_CONNECTION_KEY, JSON.stringify(connectionState))
                        } else {
                            yield* storage.remove(METAMASK_CONNECTION_KEY)
                        }
                    })
            )
        })

        yield* Effect.forkDaemon(setupStorageSync)

        if (storedConnection.status === "connected") {
            const provider = providers.get("MetaMask")
            if (provider) {
                yield* Effect.sync(() => {
                    setupEventListeners(provider.provider, connection)
                })
            }
        }

        return {
            wallet: Stream.filterMap(
                providersRef.changes,
                (providers) =>
                    providers.has("MetaMask")
                        ? Option.some({
                            type: "MetaMask",
                            supportedChains: SUPPORTED_CHAINS,
                            icon: "images/metamask.svg"
                        } as Wallet)
                        : Option.none()
            ),
            connect: (chainId?: ChainId) =>
                Effect.gen(function*() {
                    const provider = providers.get("MetaMask")

                    if (!provider) {
                        return yield* Effect.fail(new WalletNotInstalledError({ walletType: "MetaMask" }))
                    }

                    const chain = chainId && SUPPORTED_CHAINS_BY_ID[chainId]

                    if (chainId && (!chain || chain.type !== "evm")) {
                        return yield* Effect.fail(new ChainNotSupportedError({ walletType: "MetaMask", chainId }))
                    }

                    yield* connectEvm(provider.provider, connection, chainId)
                }),
            connection: connection.changes,
            switchChain: (chainId: ChainId) =>
                Effect.gen(function*() {
                    const provider = providers.get("MetaMask")

                    if (!provider) {
                        return yield* Effect.fail(new WalletNotInstalledError({ walletType: "MetaMask" }))
                    }

                    const chain = chainId && SUPPORTED_CHAINS_BY_ID[chainId]

                    if (chainId && (!chain || chain.type !== "evm")) {
                        return yield* Effect.fail(new ChainNotSupportedError({ walletType: "MetaMask", chainId }))
                    }

                    yield* switchChainMetaMask(provider.provider, connection, chainId)
                }),
            disconnect: () =>
                Effect.gen(function*() {
                    const provider = providers.get("MetaMask")

                    if (!provider) {
                        return yield* Effect.fail(new WalletNotInstalledError({ walletType: "MetaMask" }))
                    }

                    provider.provider.removeAllListeners("chainChanged")
                    provider.provider.removeAllListeners("accountsChanged")

                    yield* SubscriptionRef.update(connection, () => ({
                        status: "disconnected" as const
                    }))
                })
        }
    }),
    dependencies: [EIP1193Providers.Default, StorageService.Default]
}) {}

const setupEventListeners = (
    provider: EIP1193Provider,
    connectionRef: SubscriptionRef.SubscriptionRef<Connection>
) => {
    const handleChainChanged = (newChainId: string) => {
        const newChain = SUPPORTED_CHAINS_BY_ID[newChainId]
        if (newChain) {
            Effect.runSync(
                SubscriptionRef.update(connectionRef, (currentConnection) => {
                    if (currentConnection.status === "connected") {
                        return {
                            ...currentConnection,
                            chain: newChain
                        }
                    }
                    return currentConnection
                })
            )
        } else {
            Effect.runSync(
                SubscriptionRef.update(connectionRef, (currentConnection) => {
                    if (currentConnection.status === "connected") {
                        return {
                            ...currentConnection,
                            chain: "unsupported_chain" as const
                        }
                    }
                    return currentConnection
                })
            )
        }
    }

    const handleAccountsChanged = (newAccounts: Array<string>) => {
        if (newAccounts.length === 0) {
            Effect.runPromise(
                SubscriptionRef.update(connectionRef, () => ({
                    status: "disconnected" as const
                }))
            )
        } else {
            Effect.runPromise(
                SubscriptionRef.update(connectionRef, (currentConnection) => {
                    if (currentConnection.status === "connected") {
                        return {
                            ...currentConnection,
                            account: { ...currentConnection.account, address: newAccounts[0] }
                        }
                    }
                    return currentConnection
                })
            )
        }
    }

    provider.removeAllListeners("chainChanged")
    provider.removeAllListeners("accountsChanged")

    provider.on("chainChanged", handleChainChanged)
    provider.on("accountsChanged", handleAccountsChanged)
}

const connectEvm = (
    provider: EIP1193Provider,
    connectionRef: SubscriptionRef.SubscriptionRef<Connection>,
    requestedChainId?: ChainId
) => Effect.gen(function*() {
    const accounts = yield* Effect.tryPromise({
        try: () => provider.request({ method: "eth_requestAccounts" }),
        catch: () => new AccountsNotAvailableError({ walletType: "MetaMask" })
    })

    if (!accounts || accounts.length === 0) {
        throw new Error("No accounts found")
    }

    const chainId = yield* Effect.tryPromise({
        try: () => provider.request({ method: "eth_chainId" }),
        catch: () => new ChainNotAvailableError({ walletType: "MetaMask" })
    })

    let chain = SUPPORTED_CHAINS_BY_ID[chainId]

    if (!chain || chainId !== requestedChainId) {
        const newChainId = requestedChainId || SUPPORTED_CHAINS_BY_DISPLAY_NAME["Ethereum"].id

        yield* switchChainMetaMask(provider, connectionRef, newChainId)

        chain = SUPPORTED_CHAINS_BY_ID[newChainId]
    }

    setupEventListeners(provider, connectionRef)

    yield* SubscriptionRef.update(connectionRef, () => ({
        status: "connected" as const,
        wallet: {
            type: "MetaMask" as const,
            supportedChains: SUPPORTED_CHAINS,
            icon: "images/metamask.svg"
        },
        account: { address: accounts[0], chainType: "evm" as const },
        chain
    }))
})

const addEthereumChain = (
    provider: EIP1193Provider,
    connectionRef: SubscriptionRef.SubscriptionRef<Connection>,
    chain: Chain
) => Effect.gen(function*() {
    yield* SubscriptionRef.update(connectionRef, (currentConnection) => ({
        ...currentConnection,
        chain: "adding_chain" as const
    }))

    yield* Effect.tryPromise({
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
        catch: (error) => {
            if (error instanceof Error) {
                if (error.message.includes("User rejected")) {
                    return new ConnectionRejectedError({
                        walletType: "MetaMask",
                        reason: error.message
                    })
                }
                return new WalletNotInstalledError({ walletType: "MetaMask" })
            }
        }
    })
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

    yield* Effect.tryPromise({
        try: () =>
            provider.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId }]
            }),
        catch: (error: any) => {
            if ("code" in error) {
                if (error.code == 4902) {
                    return new ChainNotSupportedError({ walletType: "MetaMask", chainId })
                }
            }
            return error
        }
    }).pipe(Effect.catchTag("ChainNotSupportedError", (_) =>
        Effect.gen(function*() {
            yield* addEthereumChain(provider, connectionRef, SUPPORTED_CHAINS_BY_ID[chainId])
        })))

    yield* SubscriptionRef.update(connectionRef, (currentConnection) => {
        if (currentConnection.status === "connected") {
            const newChain = SUPPORTED_CHAINS_BY_ID[chainId]
            if (newChain) {
                return {
                    ...currentConnection,
                    chain: newChain
                }
            }
        }
        return currentConnection
    })
})
