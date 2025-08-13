import { stringToPath } from "@cosmjs/crypto"
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing"
import { Config, Effect } from "effect"
import { CHAINS_BY_ID, type CosmosChain } from "../chains.js"
import { ClientNotAvailableError, SignerNotAvailableError } from "../clients.js"
import { createCosmosQueryClient, createCosmosSigningClient } from "../cosmos.js"

const getSignerFromMnemonic = (mnemonic: string, chain: CosmosChain) =>
    Effect.gen(function*() {
        return yield* Effect.tryPromise({
            try: () =>
                DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
                    prefix: chain.bech32AddressPrefix,
                    hdPaths: [stringToPath(chain.hdPath)]
                }),
            catch: (error: any) =>
                new SignerNotAvailableError({
                    cause: `Failed to generate wallet for chain ${chain.id}: ${error.message}`
                })
        })
    })

export const createSigningClientFromEnv = () =>
    Effect.gen(function*() {
        const mnemonic = yield* Config.string("MNEMONIC")
        const chainId = yield* Config.string("CHAIN_ID")

        const chain = CHAINS_BY_ID[chainId]

        if (chain.type === "cosmos") {
            const wallet = yield* getSignerFromMnemonic(mnemonic, chain)
            return yield* createCosmosSigningClient(chain, wallet)
        }

        return yield* Effect.fail(
            new SignerNotAvailableError({
                cause: `Mnemonic signing client not available for chain ${chain.id}`
            })
        )
    })

export const createQueryClientFromEnv = () =>
    Effect.gen(function*() {
        const chainId = yield* Config.string("CHAIN_ID")
        const chain = CHAINS_BY_ID[chainId]

        if (chain.type === "cosmos") {
            return yield* createCosmosQueryClient(chain)
        }

        return yield* Effect.fail(
            new ClientNotAvailableError({
                cause: `Query client not available for chain ${chain.id}`
            })
        )
    })
