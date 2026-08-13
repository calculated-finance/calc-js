import { Effect, Stream, SubscriptionRef } from "effect"
import type { Chain, ChainId } from "../chains.js"
import { BINANCE_SMART_CHAIN, ETHEREUM } from "../chains.js"
import type { Wallet, WalletClient } from "./model.js"
import {
    ChainNotSupportedError,
    ClientNotAvailableError,
    OperationNotSupportedError
} from "./model.js"
import { EIP1193Providers } from "../evm.js"
import { StorageService } from "../storage.js"
import { makeConnectionStore } from "./connection.js"
import type { EvmWalletContext } from "./evm-connection.js"
import { connectEvm, setupEvmEventListeners, switchEvmChain } from "./evm-connection.js"

const METAMASK_CONNECTION_KEY = "calc_metamask_connection"

const SUPPORTED_CHAINS: ReadonlyArray<Chain> = [ETHEREUM, BINANCE_SMART_CHAIN] as const

const SUPPORTED_CHAINS_BY_ID: Record<string, Chain> = SUPPORTED_CHAINS.reduce(
    (acc, chain) => ({ ...acc, [chain.id]: chain }),
    {}
)

const METAMASK_WALLET: Wallet = {
    type: "MetaMask",
    supportedChains: SUPPORTED_CHAINS,
    color: "#f46f35",
    connection: { status: "disconnected" }
}

export class MetaMaskService extends Effect.Service<MetaMaskService>()("MetaMaskService", {
    scoped: Effect.gen(function*() {
        const providersRef = yield* EIP1193Providers
        const { ref: connectionRef, stored } = yield* makeConnectionStore(METAMASK_CONNECTION_KEY)

        const makeContext = Effect.gen(function*() {
            const provider = (yield* providersRef.get).get("MetaMask")?.provider

            if (!provider) {
                return yield* Effect.fail(new ClientNotAvailableError({ cause: "MetaMask" }))
            }

            const context: EvmWalletContext = {
                walletType: "MetaMask",
                provider,
                connectionRef,
                supportedChainsById: SUPPORTED_CHAINS_BY_ID,
                defaultChainId: SUPPORTED_CHAINS[0].id,
                getLabel: () => Effect.succeed("MetaMask")
            }

            return context
        })

        // Restore a persisted session if the provider still has the account.
        if (stored.status === "connected") {
            yield* Effect.gen(function*() {
                const context = yield* makeContext

                const accounts = yield* Effect.tryPromise({
                    try: () => context.provider.request({ method: "eth_accounts" }),
                    catch: () => []
                })

                if (!accounts.length) {
                    return yield* SubscriptionRef.set(connectionRef, { status: "disconnected" as const })
                }

                const chainId = yield* Effect.tryPromise({
                    try: () => context.provider.request({ method: "eth_chainId" }),
                    catch: () => null
                })

                const chain = SUPPORTED_CHAINS_BY_ID[Number(chainId)]

                yield* SubscriptionRef.set(connectionRef, {
                    status: "connected" as const,
                    address: accounts[0],
                    chain: chain
                        ? { status: "ready" as const, chain }
                        : { status: "unsupported" as const, chainId: Number(chainId) },
                    label: "MetaMask"
                })

                setupEvmEventListeners(context)
            }).pipe(
                Effect.catchAll(() => SubscriptionRef.set(connectionRef, { status: "disconnected" as const }))
            )
        }

        const client: WalletClient = {
            type: "MetaMask",

            wallet: Stream.map(connectionRef.changes, (connection) => ({
                ...METAMASK_WALLET,
                connection
            })),

            connect: (chainId?: ChainId) =>
                Effect.gen(function*() {
                    if (chainId) {
                        const chain = SUPPORTED_CHAINS_BY_ID[chainId]
                        if (!chain || chain.type !== "evm") {
                            return yield* Effect.fail(new ChainNotSupportedError({ walletType: "MetaMask", chainId }))
                        }
                    }

                    const context = yield* makeContext

                    yield* SubscriptionRef.set(connectionRef, { status: "connecting" as const })

                    yield* connectEvm(context, chainId)
                }),

            switchChain: (chainId: ChainId) =>
                Effect.gen(function*() {
                    const connection = yield* connectionRef.get

                    if (
                        connection.status === "connected" &&
                        connection.chain.status === "ready" &&
                        connection.chain.chain.id === chainId
                    ) {
                        return
                    }

                    const chain = SUPPORTED_CHAINS_BY_ID[chainId]
                    if (!chain || chain.type !== "evm") {
                        return yield* Effect.fail(new ChainNotSupportedError({ walletType: "MetaMask", chainId }))
                    }

                    const context = yield* makeContext

                    yield* switchEvmChain(context, chainId)
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
                }),

            simulateTransaction: () =>
                Effect.fail(new OperationNotSupportedError({ walletType: "MetaMask", operation: "simulateTransaction" })),

            signTransaction: () =>
                Effect.fail(new OperationNotSupportedError({ walletType: "MetaMask", operation: "signTransaction" }))
        }

        return client
    }),
    dependencies: [EIP1193Providers.Default, StorageService.Default]
}) {}
