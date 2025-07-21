import { Effect, SubscriptionRef } from "effect"

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
                    console.log("EIP6963 Provider announced:", event.detail.info.name)
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
