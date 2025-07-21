import { Data, Effect, Schema, Stream } from "effect"
import type { ChainId } from "../chains.js"
import { Chain, ChainType } from "../chains.js"
import { KeplrService } from "./keplr.js"
import { MetaMaskService } from "./metamask.js"

export const WalletType = Schema.Literal(
    "MetaMask",
    "Keplr",
    "Rabby Wallet"
)

export type WalletType = Schema.Schema.Type<typeof WalletType>

export const Wallet = Schema.Struct({
    type: WalletType,
    supportedChains: Schema.Array(Chain),
    icon: Schema.optional(Schema.NonEmptyTrimmedString)
})

export type Wallet = Schema.Schema.Type<typeof Wallet>

export const Account = Schema.Struct({
    address: Schema.NonEmptyTrimmedString,
    chainType: ChainType
})

export type Account = Schema.Schema.Type<typeof Account>

export const Connection = Schema.Union(
    Schema.Struct({
        status: Schema.Literal("disconnected")
    }),
    Schema.Struct({
        status: Schema.Literal("connecting"),
        wallet: WalletType
    }),
    Schema.Struct({
        status: Schema.Literal("connected"),
        wallet: Wallet,
        chain: Schema.Union(Chain, Schema.Literal("switching_chain", "adding_chain", "unsupported")),
        account: Account
    })
)

export type Connection = Schema.Schema.Type<typeof Connection>

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
                (...wallets) => wallets.filter((wallet) => !!wallet)
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

            connection: Stream.debounce(
                Stream.zipLatest(
                    metaMaskService.connection,
                    keplrService.connection
                ),
                200
            ),

            switchChain: (wallet: Wallet, chainId: ChainId) =>
                Effect.gen(function*() {
                    console.log("Switching chain", wallet, chainId)
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
