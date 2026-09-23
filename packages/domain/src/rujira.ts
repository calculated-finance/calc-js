import { Schema } from "effect";
import { ChainId } from "./chains.js";

export const FinPair = Schema.Struct({
  address: Schema.NonEmptyTrimmedString,
  denoms: Schema.Array(Schema.NonEmptyTrimmedString),
});

export type FinPair = Schema.Schema.Type<typeof FinPair>;

/**
 * All THORChain mainnet FIN order-book pairs — 57 live as of 2026-08-13,
 * sourced from the Rujira indexer (api.rujira.network, the same finV2 query
 * the vendored repos/rujira-ui trade screen uses). Denoms are the on-chain
 * denoms reported by the indexer's variants.native.denom. Refresh from the
 * indexer when new pairs list.
 */
export const MAINNET_FIN_PAIRS: ReadonlyArray<FinPair> = [
    { address: "thor17aspfgv75azl5j25jte3dd48gruf36u2v5l48ey5hmd55tkfr8sqchmfwz", denoms: ["gaia-atom", "rune"] },
    { address: "thor1s8rxcvg83cwar87ehv4c866auxujkfj3k4wjkxkaren7vmvn9nass80ekp", denoms: ["gaia-atom", "eth-usdc-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"] },
    { address: "thor15t4cykf3mj8fsvd6ha8j0lnavcyex2h4a4l2pv8zkctandwck3zshs92jy", denoms: ["thor.auto", "eth-usdc-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"] },
    { address: "thor1k4lepg7umfncsuvv4lnq95vqzeu0xx6awp74e384sfv0pecyqhysu2x65k", denoms: ["avax-avax", "rune"] },
    { address: "thor1dw8tadkwy746ytvaugv26g5jwekwpfyjyvlvncvryukm07rc998s4ukvrt", denoms: ["avax-avax", "eth-usdc-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"] },
    { address: "thor1zr7z5get5shhtr0xmvvc84tjjc376y2re3kws8y2txzcj8l69afsxwtx00", denoms: ["bch-bch", "rune"] },
    { address: "thor1s4jpxtz0jsh6elyqcdujd303ptefz53gknmcp437rm9ykxnfhysqrm5hze", denoms: ["bch-bch", "eth-usdc-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"] },
    { address: "thor12dkmw3r63c6afuc7kffe7hv23gg3az43l2yrwe4egxsgydhd07csye8uvz", denoms: ["bsc-bnb", "rune"] },
    { address: "thor1g49m6re9vgrte8twpgx0qcnvr92575tqhcgmnwq3g5s94msk4ersqsyw3x", denoms: ["bsc-bnb", "eth-usdc-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"] },
    { address: "thor1dwsnlqw3lfhamc5dz3r57hlsppx3a2n2d7kppccxfdhfazjh06rs5077sz", denoms: ["btc-btc", "eth-usdc-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"] },
    { address: "thor1sttnfysg5e92d82gu9vg7jl9dhu29h4w8mujg7hsfdy3qj6ryuwsaqwu5m", denoms: ["btc-btc", "eth-usdt-0xdac17f958d2ee523a2206206994597c13d831ec7"] },
    { address: "thor1qa2l2rrzjq30j2wphc3hcz3ykjz8aaqcjlrnzmp00hy0cpk233ysm9rr3c", denoms: ["eth-dai-0x6b175474e89094c44da98b954eedeac495271d0f", "eth-usdc-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"] },
    { address: "thor1akzwwcsjfff34y2lf389a4c692n5zfqsfd6nn4wcrwgaj3jrnpts6lpvfd", denoms: ["doge-doge", "rune"] },
    { address: "thor1w8agselh7k2e4ty369v39lngkckljxfafm35d06f7wj3ar90h2esv75t7p", denoms: ["doge-doge", "eth-usdc-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"] },
    { address: "thor1g3mymxjlmvyeadfys6lsj98sgg7mxut5pwz99q5rat7ny698elwq778ngf", denoms: ["eth-eth", "btc-btc"] },
    { address: "thor1624v08rr5na2hv5jazw5tmyyjyqg8lfy78zvck52ep3nqxa7lljq00e4xq", denoms: ["base-eth", "eth-eth"] },
    { address: "thor1sjl0uwl7kftjj00qklknv6n0gcx8upaawsatlyxt4v57ekpmfjtqv2hf6q", denoms: ["eth-eth", "rune"] },
    { address: "thor1tnd06uswj8033d0kzd5d7zre73u3uc44r2vvez26z5m4kr68vtusf2snva", denoms: ["eth-eth", "eth-usdc-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"] },
    { address: "thor1fekmqh9crnzdaudrsqxk5gmwcch6xrfre288nqmx4hpk8sscw6hq9kkxn6", denoms: ["eth-eth", "eth-usdt-0xdac17f958d2ee523a2206206994597c13d831ec7"] },
    { address: "thor19pdw7vjkhk0qhvn7r3xgj6f5zyyj700w6my3z28cv9ugzu7gp5rqv5596l", denoms: ["eth-gusd-0x056fd409e1d7a124bd7017459dfea2f387b6d5cd", "eth-usdc-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"] },
    { address: "thor1t76lvqjq7avt6kxnul4pt0zaq6y06fhkw29wxs5rm4kt873s6y9sdp8rxf", denoms: ["thor.lqdy", "btc-btc"] },
    { address: "thor15gdwez2jt8tdpukx4x4upul4pjtl8f4hx8dsj9a7htsszmas89gqqkx3kf", denoms: ["thor.lqdy", "eth-eth"] },
    { address: "thor1ax94w4rldvdgc4xgsfwgve7g7xfyxhvuvquvx57vtmr6y4alev0qw3mlvr", denoms: ["thor.lqdy", "eth-usdc-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"] },
    { address: "thor17xet7zhcx0yf3ts2qfskrv5audzxa7aufp0n9zq468wg2ksnm5tqrwv60a", denoms: ["ltc-ltc", "rune"] },
    { address: "thor1ks9qq0nwv7qxtnznesys6ylflwruqlf85er6zls4erwgzkvw0m0qs3rghz", denoms: ["ltc-ltc", "eth-usdc-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"] },
    { address: "thor10a8nuh9r3xywm77km3upqk08lqac7sj9avl082cnm39teae4w9cs64kptz", denoms: ["ltc-ltc", "eth-usdt-0xdac17f958d2ee523a2206206994597c13d831ec7"] },
    { address: "thor1n52wjhf8mvfe2lymev08grpwtjh8n6jse5zku0cewlhyzl77yauqst6rw3", denoms: ["eth-lusd-0x5f98805a4e8be255a32880fdec7f6728c6568ba0", "eth-usdc-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"] },
    { address: "thor1txmrchsrzycmzvlwsjl20q9zkdsp0nywctefuceepf02phpudvxsxtzmty", denoms: ["thor.nami", "eth-usdc-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"] },
    { address: "thor1a7jw3r8we32guc0cp0zwe5zw2fltt9ns0h9txhc923xd88d0mqlq4w9d3q", denoms: ["x/ruji", "btc-btc"] },
    { address: "thor1j9euq8fjd5zdxdkx7auser7kp84tmwtx3snuptpec6azakzwv3dqq6ahwp", denoms: ["x/ruji", "rune"] },
    { address: "thor17cawwg2lsnvcne69fek6nsqkf8snma6gc5ccceshul86rl0u3q4s5l5d0a", denoms: ["x/ruji", "eth-usdc-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"] },
    { address: "thor1r836nj58g6mzve87avwww72hc449canxu6a9yusxycgy44pswuyqr7ad3j", denoms: ["x/ruji", "eth-usdt-0xdac17f958d2ee523a2206206994597c13d831ec7"] },
    { address: "thor1qqql3tugjuwnslfgf9a9zfqenywn2h8zy9v025vh3398xtzpaqcsx5axyl", denoms: ["rune", "btc-btc"] },
    { address: "thor1y8g3yhzmnwyt6g7jque36eyregf85kgtzem6dgzqxuzrpmzpumvqts7ud7", denoms: ["rune", "eth-usdc-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"] },
    { address: "thor1pvs37p0gplq9gf6d9zgyt7zkfpp88rgtr089tfh50suxh6tnar9swea8xj", denoms: ["rune", "eth-usdt-0xdac17f958d2ee523a2206206994597c13d831ec7"] },
    { address: "thor1jshw3secvxhzfyza6aj530hrc73zave42zgs525n0xkc3e9d6wkqrm8j3y", denoms: ["tcy", "btc-btc"] },
    { address: "thor12ds7fxj5g47jwzfzvzzhzxxd3cp6v55flgwxva0803r8k5mzm44skth6wa", denoms: ["tcy", "rune"] },
    { address: "thor1kyjky2yprmamj0gfkevyc6tunxev0054gpxjap8k9vkyutkkf5lqyr0xxv", denoms: ["tcy", "eth-usdc-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"] },
    { address: "thor13ut45ze59tdxjtuv4jhranujxx73qvpqfmwx2cmpt5ddzeualthqs9x6ay", denoms: ["tron-trx", "rune"] },
    { address: "thor1wj7vzfp7lasyuqga35hcvhg5xuyxh3auh5epxqns8p9f0yhhwelqu7kq0z", denoms: ["tron-trx", "eth-usdc-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"] },
    { address: "thor1lqxf7qk46wm3xt2t45csmejw2l88tq57tdwkpj89jeer6m6jdnxsj0lxfe", denoms: ["tron-trx", "eth-usdt-0xdac17f958d2ee523a2206206994597c13d831ec7"] },
    { address: "thor1kkuhwaqnlnvchx6fzttp7l9vhman9ll9u6dyhx65v4c7gcpflvcqkdv7z9", denoms: ["base-usdc-0x833589fcd6edb6e08f4c7c32d4f71b54bda02913", "eth-usdc-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"] },
    { address: "thor1f9zc2sdua4n6nreuxzhed9435n0cf6v6lpx6nrjdadtkr294a26qhs676n", denoms: ["bsc-usdc-0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d", "eth-usdc-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"] },
    { address: "thor14sk3vqzt6rpp8c06ynfhw30ctk0wy5mqhvedccg8gnnlcdcyc9csaf4ngt", denoms: ["avax-usdc-0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e", "eth-usdc-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"] },
    { address: "thor1zj84djje5t0cn3veezmlfewmzmn6yn793nkrtfkjhcywdyyca9tq9582yf", denoms: ["eth-usdp-0x8e870d67f660d95d5be530380d0ec0bd388289e1", "eth-usdc-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"] },
    { address: "thor1mgjtf976cnurac63yh2tldmw2mme5f4a8n0u7m3d5yvxk6x5yrws4u37es", denoms: ["bsc-usdt-0x55d398326f99059ff775485246999027b3197955", "eth-usdc-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"] },
    { address: "thor1mj73004rhycffu6k56dalt0zmefzdc3ana6egkh4aes9aw43lxqqmfq2xg", denoms: ["avax-usdt-0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7", "eth-usdc-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"] },
    { address: "thor1cwahyj3lsu9ug6qhxg2hppas3c9vmhjsuml964um5vx9j034zknqx4e7pt", denoms: ["avax-usdt-0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7", "eth-usdt-0xdac17f958d2ee523a2206206994597c13d831ec7"] },
    { address: "thor14qg8r6u7x4yt57565ztm6v8fwkd2t0j8wqnx6k872yt49ynx8d0q6s7kq0", denoms: ["eth-usdt-0xdac17f958d2ee523a2206206994597c13d831ec7", "eth-usdc-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"] },
    { address: "thor1zl5fcaexljnyz6udcsp6sr9d2l7qjftneayad9x4qnyc9t4n95eq2wcll3", denoms: ["tron-usdt-tr7nhqjekqxgtci8q8zy4pl8otszgjlj6t", "eth-usdc-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"] },
    { address: "thor1kcr3rujeadytx3l594c3ugx2mklwqt59v5krj8e3h2d4amrdpcmql2gtm5", denoms: ["tron-usdt-tr7nhqjekqxgtci8q8zy4pl8otszgjlj6t", "eth-usdt-0xdac17f958d2ee523a2206206994597c13d831ec7"] },
    { address: "thor1e5dmfdtpveprsznzyqjdygy2fd782d0q9zm7246e7jhvmq04nqnqm78vek", denoms: ["eth-wbtc-0x2260fac5e5542a773aa44fbcfedf7c193bc2c599", "btc-btc"] },
    { address: "thor1ahe7skh640utwefpt7362tkvzkm58cwwe5afy95rgs670fuuj4yqfaz4ju", denoms: ["eth-wbtc-0x2260fac5e5542a773aa44fbcfedf7c193bc2c599", "rune"] },
    { address: "thor13u7fhdsv8xjrlx2hj5tmwt0j5d7wlrg89g9z4h9562xw3wcaj68qn08tds", denoms: ["xrp-xrp", "rune"] },
    { address: "thor14v89h32ztmfg9d230cjly7ac26fvdkhgq7nkntsw4uy2f3yh2v7qrz6hsw", denoms: ["xrp-xrp", "eth-usdc-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"] },
    { address: "thor1x2l2d3vh73uuzlur2dxhzwgc2zu3p56jnzxen6rry9e5zvks6g8sqjhdq3", denoms: ["thor.xusk", "eth-usdc-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"] },
    { address: "thor1vk6trmz42cjrh4zcxczeaacnsv3snv4f22x8ccu203dqde7vtaxsyevlec", denoms: ["x/brune", "rune"] },
]

export const PAIRS_BY_CHAIN_ID: Record<ChainId, ReadonlyArray<FinPair>> = {
    thorchain: MAINNET_FIN_PAIRS
}
