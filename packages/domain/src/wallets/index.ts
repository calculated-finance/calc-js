import { Data, Effect, Schema, Stream } from "effect"
import type { ChainId } from "../chains.js"
import { Chain } from "../chains.js"
import { KeplrService } from "./keplr.js"
import { MetaMaskService } from "./metamask.js"

export const Connection = Schema.Union(
    Schema.Struct({
        status: Schema.Literal("disconnecting")
    }),
    Schema.Struct({
        status: Schema.Literal("disconnected")
    }),
    Schema.Struct({
        status: Schema.Literal("connecting")
    }),
    Schema.Struct({
        status: Schema.Literal("connected"),
        chain: Schema.Union(Chain, Schema.Literal("switching_chain", "adding_chain", "unsupported")),
        address: Schema.NonEmptyTrimmedString,
        label: Schema.NonEmptyTrimmedString
    })
)

export type Connection = Schema.Schema.Type<typeof Connection>

export const WalletType = Schema.Literal(
    "MetaMask",
    "Keplr",
    "Rabby Wallet"
)

export type WalletType = Schema.Schema.Type<typeof WalletType>

export const Wallet = Schema.Struct({
    type: WalletType,
    supportedChains: Schema.Array(Chain),
    icon: Schema.optional(Schema.NonEmptyTrimmedString),
    color: Schema.NonEmptyTrimmedString,
    connection: Connection
})

export type Wallet = Schema.Schema.Type<typeof Wallet>

export class WalletNotInstalledError extends Data.TaggedError("WalletNotInstalledError")<{
    walletType: string
}> {}

export class ChainNotSupportedError extends Data.TaggedError("ChainNotSupportedError")<{
    walletType: string
    chainId: ChainId
}> {}

export class ChainNotAddedError extends Data.TaggedError("ChainNotAddedError")<{
    walletType: string
    chainId: ChainId
}> {}

export class AccountsNotAvailableError extends Data.TaggedError("AccountsNotAvailableError")<{
    walletType: string
}> {}

export class ChainNotAvailableError extends Data.TaggedError("ChainNotAvailableError")<{
    walletType: string
}> {}

export class ConnectionRejectedError extends Data.TaggedError("ConnectionRejectedError")<{
    walletType: string
    reason?: string
}> {}

export class RpcError extends Data.TaggedError("RpcError")<{
    walletType: string
    message: string
}> {}

export type WalletError =
    | WalletNotInstalledError
    | AccountsNotAvailableError
    | ConnectionRejectedError
    | ChainNotAvailableError
    | ChainNotSupportedError

export class WalletService extends Effect.Service<WalletService>()("WalletService", {
    effect: Effect.gen(function*() {
        const metaMaskService = yield* MetaMaskService
        const keplrService = yield* KeplrService

        return {
            wallets: Stream.zipLatestWith(
                metaMaskService.wallet,
                keplrService.wallet,
                (...wallets) => wallets
            ),

            connect: (wallet: Wallet, chainId?: ChainId) =>
                Effect.gen(function*() {
                    switch (wallet.type) {
                        case "MetaMask":
                            yield* metaMaskService.connect(chainId)
                            break
                        case "Keplr":
                            yield* keplrService.connect(chainId)
                            break
                        default:
                            yield* Effect.fail(new WalletNotInstalledError({ walletType: wallet.type }))
                    }
                }),

            switchChain: (wallet: Wallet, chainId: ChainId) =>
                Effect.gen(function*() {
                    switch (wallet.type) {
                        case "MetaMask":
                            yield* metaMaskService.switchChain(chainId)
                            break
                        case "Keplr":
                            yield* keplrService.switchChain(chainId)
                            break
                        default:
                            return yield* Effect.fail(new WalletNotInstalledError({ walletType: wallet.type }))
                    }
                }),

            disconnect: (wallet: Wallet) =>
                Effect.gen(function*() {
                    switch (wallet.type) {
                        case "MetaMask":
                            yield* metaMaskService.disconnect()
                            break
                        case "Keplr":
                            yield* keplrService.disconnect()
                            break
                        default:
                            return yield* Effect.fail(new WalletNotInstalledError({ walletType: wallet.type }))
                    }
                })
        }
    }),
    dependencies: [MetaMaskService.Default, KeplrService.Default]
}) {}
