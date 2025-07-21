import { Schema } from "effect"

export const ChainType = Schema.Literal("evm", "cosmos", "utxo")

export type ChainType = Schema.Schema.Type<typeof ChainType>

export const ChainId = Schema.Union(
    Schema.NonEmptyTrimmedString,
    Schema.Positive
)

export const Chain = Schema.Struct({
    type: ChainType,
    id: ChainId,
    displayName: Schema.NonEmptyTrimmedString,
    color: Schema.NonEmptyTrimmedString,
    rpcUrls: Schema.Array(Schema.NonEmptyTrimmedString),
    nativeCurrency: Schema.Struct({
        name: Schema.NonEmptyTrimmedString,
        symbol: Schema.NonEmptyTrimmedString,
        decimals: Schema.Positive.pipe(Schema.clamp(6, 18))
    })
})

export type Chain = Schema.Schema.Type<typeof Chain>

export type ChainId = Schema.Schema.Type<typeof ChainId>

export const ETHEREUM: Chain = {
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
}

export const BINANCE_SMART_CHAIN: Chain = {
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

export const COSMOS_HUB: Chain = {
    type: "cosmos",
    id: "cosmoshub-4",
    displayName: "Cosmos Hub",
    color: "#2B8CBE",
    rpcUrls: ["https://rpc.cosmos.network"],
    nativeCurrency: {
        name: "Atom",
        symbol: "ATOM",
        decimals: 6
    }
}

export const RUJIRA_STAGENET: Chain = {
    type: "cosmos",
    id: "thorchain-stagenet-2",
    displayName: "Rujira Stagenet",
    color: "#2B8CBE",
    rpcUrls: ["https://stagenet-rpc.ninerealms.com"],
    nativeCurrency: {
        name: "Rune",
        symbol: "RUNE",
        decimals: 8
    }
}
