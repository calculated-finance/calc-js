import { Effect, Schedule, SubscriptionRef } from "effect"
import type { Chain, ChainId, EvmChain } from "../chains.js"
import type { ChainState, Connection, WalletType } from "./model.js"
import {
    AccountsNotAvailableError,
    ChainNotAddedError,
    ConnectionRejectedError,
    RpcError
} from "./model.js"
import type { EIP1193Provider } from "../evm.js"

/**
 * Everything the shared EVM connection flows need to know about the wallet
 * they act for. MetaMask and Keplr's EVM mode differ only in these values.
 */
export interface EvmWalletContext {
    readonly walletType: WalletType
    readonly provider: EIP1193Provider
    readonly connectionRef: SubscriptionRef.SubscriptionRef<Connection>
    readonly supportedChainsById: Record<string, Chain>
    readonly defaultChainId: ChainId
    /** Resolve the display label once connected (e.g. Keplr key name). */
    readonly getLabel: (chainId: ChainId) => Effect.Effect<string>
}

const setChainState = (
    connectionRef: SubscriptionRef.SubscriptionRef<Connection>,
    chain: ChainState
) =>
    SubscriptionRef.update(connectionRef, (connection) =>
        connection.status === "connected" ? { ...connection, chain } : connection)

export const setupEvmEventListeners = (context: EvmWalletContext) => {
    const { connectionRef, provider, supportedChainsById } = context

    provider.removeAllListeners("chainChanged")
    provider.removeAllListeners("accountsChanged")

    provider.on("chainChanged", (chainId: string) => {
        Effect.runSync(
            SubscriptionRef.update(connectionRef, (state) => {
                if (state.status !== "connected") return state
                const chain = supportedChainsById[Number(chainId)]
                return {
                    ...state,
                    chain: chain
                        ? { status: "ready" as const, chain }
                        : { status: "unsupported" as const, chainId: Number(chainId) }
                }
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
                    return { ...state, address: accounts[0] }
                }
                return state
            })
        )
    })
}

export const addEvmChain = (context: EvmWalletContext, chain: EvmChain) =>
    Effect.gen(function*() {
        const { connectionRef, provider, walletType } = context

        yield* setChainState(connectionRef, { status: "adding" })

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
            catch: (error: unknown) => {
                const e = error as { code?: number; message?: string }
                return e.code === 4001 || e.code === 4100
                    ? new ConnectionRejectedError({ walletType, reason: e.message ?? "rejected" })
                    : new RpcError({ walletType, message: e.message ?? String(error) })
            }
        })

        yield* Effect.retry(tryAddChain, {
            while: (error) => error instanceof RpcError,
            times: 3,
            schedule: Schedule.exponential("2 seconds")
        }).pipe(
            Effect.catchAll(() => setChainState(connectionRef, { status: "unsupported", chainId: chain.id }))
        )
    })

export const switchEvmChain = (context: EvmWalletContext, chainId: ChainId) =>
    Effect.gen(function*() {
        const { connectionRef, provider, supportedChainsById, walletType } = context

        yield* setChainState(connectionRef, { status: "switching" })

        const trySwitchChain = Effect.tryPromise({
            try: () =>
                provider.request({
                    method: "wallet_switchEthereumChain",
                    params: [{ chainId: `0x${Number(chainId).toString(16)}` }]
                }),
            catch: (error: unknown) => {
                const e = error as { code?: number; message?: string }
                return e.code === 4902
                    ? new ChainNotAddedError({ walletType, chainId })
                    : new RpcError({ walletType, message: e.message ?? String(error) })
            }
        })

        yield* Effect.retry(trySwitchChain, {
            while: (error) => error instanceof RpcError,
            times: 3,
            schedule: Schedule.exponential("2 seconds")
        }).pipe(
            Effect.catchTag("ChainNotAddedError", () => {
                const chain = supportedChainsById[chainId]
                return chain && chain.type === "evm"
                    ? addEvmChain(context, chain)
                    : setChainState(connectionRef, { status: "unsupported", chainId })
            }),
            Effect.catchAll(() => setChainState(connectionRef, { status: "unsupported", chainId }))
        )

        setupEvmEventListeners(context)

        const chain = supportedChainsById[chainId]
        yield* setChainState(
            connectionRef,
            chain ? { status: "ready", chain } : { status: "unsupported", chainId }
        )
    })

export const connectEvm = (context: EvmWalletContext, requestedChainId?: ChainId) =>
    Effect.gen(function*() {
        const { connectionRef, defaultChainId, provider, supportedChainsById, walletType } = context

        const tryFetchAccounts = Effect.tryPromise({
            try: () => provider.request({ method: "eth_requestAccounts" }),
            catch: (error: unknown) => {
                const e = error as { code?: number; message?: string }
                return e.code === 4001
                    ? new ConnectionRejectedError({ walletType, reason: "User rejected connection request" })
                    : new RpcError({ walletType, message: e.message ?? String(error) })
            }
        })

        const accounts = yield* Effect.retry(tryFetchAccounts, {
            while: (error) => error instanceof RpcError,
            times: 3,
            schedule: Schedule.exponential("2 seconds")
        })

        if (!accounts || accounts.length === 0) {
            return yield* Effect.fail(new AccountsNotAvailableError({ cause: walletType }))
        }

        const chainId = yield* Effect.tryPromise({
            try: () => provider.request({ method: "eth_chainId" }),
            catch: (error: unknown) =>
                new RpcError({
                    walletType,
                    message: error instanceof Error ? error.message : `Unknown network issue: ${String(error)}`
                })
        })

        let chain = supportedChainsById[Number(chainId)]

        if (!chain || (requestedChainId && Number(chainId) !== Number(requestedChainId))) {
            const newChainId = requestedChainId ?? defaultChainId
            yield* switchEvmChain(context, newChainId)
            chain = supportedChainsById[newChainId]
        }

        setupEvmEventListeners(context)

        const label = yield* context.getLabel(chain ? chain.id : defaultChainId)

        yield* SubscriptionRef.set(connectionRef, {
            status: "connected",
            address: accounts[0],
            chain: chain
                ? { status: "ready", chain }
                : { status: "unsupported", chainId: Number(chainId) },
            label
        })
    })
