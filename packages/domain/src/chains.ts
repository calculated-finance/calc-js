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
    }),
    managerContract: Schema.optional(Schema.NonEmptyTrimmedString),
    schedulerContract: Schema.optional(Schema.NonEmptyTrimmedString)
})

export type Chain = Schema.Schema.Type<typeof Chain>

export type ChainId = Schema.Schema.Type<typeof ChainId>

export const ETHEREUM: Chain = {
    type: "evm",
    id: 1,
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
    id: 56,
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
    color: "#B223EF",
    rpcUrls: ["https://stagenet-rpc.ninerealms.com"],
    nativeCurrency: {
        name: "Rune",
        symbol: "RUNE",
        decimals: 8
    },
    managerContract: "sthor1xg6qsvyktr0zyyck3d67mgae0zun4lhwwn3v9pqkl5pk8mvkxsnscenkc0",
    schedulerContract: "sthor1x3hfzl0v43upegeszz8cjygljgex9jtygpx4l44nkxudxjsukn3setrkl6"
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
