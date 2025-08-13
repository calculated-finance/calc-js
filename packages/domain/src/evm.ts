import { Effect, Schedule, SubscriptionRef } from "effect"
import { ChainNotAddedError, ConnectionRejectedError, RpcError } from "./clients.js"

declare global {
    interface WindowEventMap {
        "eip6963:announceProvider": CustomEvent
    }
}

interface EIP6963ProviderInfo {
    rdns: string
    uuid: string
    name: string
    icon: string
}

export interface EIP6963ProviderDetail {
    info: EIP6963ProviderInfo
    provider: EIP1193Provider
}

type EIP6963AnnounceProviderEvent = {
    detail: {
        info: EIP6963ProviderInfo
        provider: Readonly<EIP1193Provider>
    }
}

export interface EIP1193Provider {
    request(args: { method: string; params?: Array<any> | Record<string, any> }): Promise<any>
    on(eventName: string, listener: (...args: Array<any>) => void): void
    removeListener(eventName: string, listener: (...args: Array<any>) => void): void
    removeAllListeners(eventName?: string): void
}

export class EIP1193Providers extends Effect.Service<EIP1193Providers>()("EIP1193Providers", {
    effect: Effect.gen(function*() {
        const ref = yield* SubscriptionRef.make<Map<string, EIP6963ProviderDetail>>(new Map())

        function onAnnouncement(event: EIP6963AnnounceProviderEvent) {
            Effect.runPromise(
                SubscriptionRef.update(ref, (providers) => {
                    if (providers.has(event.detail.info.name)) {
                        return providers
                    }
                    return providers.set(event.detail.info.name, event.detail)
                })
            )
        }

        window.addEventListener("eip6963:announceProvider", onAnnouncement)
        window.dispatchEvent(new Event("eip6963:requestProvider"))

        return ref
    })
}) {}

export const fetchAccounts = (provider: EIP1193Provider) =>
    Effect.tryPromise({
        try: () => provider.request({ method: "eth_requestAccounts" }),
        catch: (error: any) =>
            "code" in error && error.code === 4001
                ? new ConnectionRejectedError({ walletType: "MetaMask", reason: "User rejected connection request" })
                : new RpcError({ walletType: "MetaMask", message: error.message })
    }).pipe(
        Effect.map((accounts) => accounts as Array<string>),
        Effect.catchTag(
            "RpcError",
            Effect.retry({
                times: 3,
                schedule: Schedule.exponential("1 seconds")
            })
        ),
        Effect.catchTag("ConnectionRejectedError", (error) => Effect.fail(error))
    )

export const switchChain = (provider: EIP1193Provider, chainId: string) =>
    Effect.tryPromise({
        try: () => provider.request({ method: "wallet_switchEthereumChain", params: [{ chainId }] }),
        catch: (error: any) =>
            "code" in error && error.code === 4902
                ? new ChainNotAddedError({ walletType: "MetaMask", chainId })
                : new RpcError({ walletType: "MetaMask", message: error.message })
    }).pipe(
        Effect.catchTag(
            "RpcError",
            Effect.retry({
                times: 3,
                schedule: Schedule.exponential("1 seconds")
            })
        )
    )

export const addChain = (provider: EIP1193Provider, chainId: string) =>
    Effect.tryPromise({
        try: () => provider.request({ method: "wallet_addEthereumChain", params: [{ chainId }] }),
        catch: (error: any) =>
            "code" in error && (error.code === 4001 || error.code === 4100) ?
                new ConnectionRejectedError({
                    walletType: "MetaMask",
                    reason: error.message
                }) :
                new RpcError({ walletType: "MetaMask", message: error.message })
    }).pipe(
        Effect.catchTag(
            "RpcError",
            Effect.retry({
                times: 3,
                schedule: Schedule.exponential("1 seconds")
            })
        )
    )
