import { Schema } from "effect"

export const ChainType = Schema.Literal("evm", "cosmos", "utxo")

export type ChainType = Schema.Schema.Type<typeof ChainType>

export const CosmosChainId = Schema.NonEmptyTrimmedString

export type CosmosChainId = Schema.Schema.Type<typeof CosmosChainId>

export const EvmChainId = Schema.Positive

export type EvmChainId = Schema.Schema.Type<typeof EvmChainId>

export const ChainId = Schema.Union(
    CosmosChainId,
    EvmChainId
)

export type ChainId = Schema.Schema.Type<typeof ChainId>

export const EvmChain = Schema.Struct({
    type: Schema.Literal("evm"),
    id: EvmChainId,
    displayName: Schema.NonEmptyTrimmedString,
    color: Schema.NonEmptyTrimmedString,
    rpcUrls: Schema.Array(Schema.NonEmptyTrimmedString),
    nativeCurrency: Schema.Struct({
        name: Schema.NonEmptyTrimmedString,
        symbol: Schema.NonEmptyTrimmedString,
        decimals: Schema.Positive.pipe(Schema.clamp(6, 18))
    })
})

export type CosmosChain = Schema.Schema.Type<typeof CosmosChain>

export const CosmosChain = Schema.Struct({
    type: Schema.Literal("cosmos"),
    id: CosmosChainId,
    displayName: Schema.NonEmptyTrimmedString,
    color: Schema.NonEmptyTrimmedString,
    bech32AddressPrefix: Schema.NonEmptyTrimmedString,
    rpcUrls: Schema.Array(Schema.NonEmptyTrimmedString),
    hdPath: Schema.NonEmptyTrimmedString,
    defaultGasPrice: Schema.NonEmptyTrimmedString,
    managerContract: Schema.optional(Schema.NonEmptyTrimmedString),
    schedulerContract: Schema.optional(Schema.NonEmptyTrimmedString)
})

export type EvmChain = Schema.Schema.Type<typeof EvmChain>

export const Chain = Schema.Union(
    EvmChain,
    CosmosChain
)

export type Chain = Schema.Schema.Type<typeof Chain>

export const ETHEREUM = {
    type: "evm" as const,
    id: 1 as const,
    displayName: "Ethereum",
    color: "#627EEA",
    rpcUrls: ["https://ethereum-rpc.publicnode.com"],
    nativeCurrency: {
        name: "Ether",
        symbol: "ETH",
        decimals: 18
    }
}

export const BINANCE_SMART_CHAIN = {
    type: "evm" as const,
    id: 56 as const,
    displayName: "Binance Smart Chain",
    color: "#F3BA2E",
    rpcUrls: ["https://bsc-rpc.publicnode.com"],
    nativeCurrency: {
        name: "Binance Coin",
        symbol: "BNB",
        decimals: 18
    }
}

export const COSMOS_HUB = {
    type: "cosmos" as const,
    id: "cosmoshub-4" as const,
    displayName: "Cosmos Hub",
    color: "#2B8CBE",
    bech32AddressPrefix: "cosmos",
    hdPath: "m/44'/118'/0'/0/0",
    rpcUrls: ["https://cosmos-rpc.publicnode.com:443"],
    defaultGasPrice: "0.025uatom"
}

export const RUJIRA_STAGENET = {
    type: "cosmos" as const,
    id: "thorchain-stagenet-2" as const,
    displayName: "Rujira Stagenet",
    color: "#ab3ddb",
    bech32AddressPrefix: "sthor",
    hdPath: "m/44'/931'/0'/0/0",
    rpcUrls: ["https://stagenet-rpc.ninerealms.com"],
    defaultGasPrice: "0.0rune",
    managerContract: "sthor18e35rm2dwpx3h09p7q7xx8qfvwdsxz2ls92fdfd4j7vh6g55h8ash7gkau",
    schedulerContract: "sthor14zd6glgu67mg2ze7ekqtce3r7yjuk846l3982en9y5v6nlh2y5es2llpa6"
}

export const CHAINS = [
    ETHEREUM,
    BINANCE_SMART_CHAIN,
    COSMOS_HUB,
    RUJIRA_STAGENET
]

export const CHAINS_BY_ID: Record<ChainId, Chain> = CHAINS.reduce(
    (acc, chain) => ({
        ...acc,
        [chain.id]: chain
    }),
    {} as Record<ChainId, Chain>
)
