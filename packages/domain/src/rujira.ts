import { Schema } from "effect";
import { ChainId } from "./chains.js";

export const FinPair = Schema.Struct({
  address: Schema.NonEmptyTrimmedString,
  denoms: Schema.Array(Schema.NonEmptyTrimmedString),
});

export type FinPair = Schema.Schema.Type<typeof FinPair>;

/**
 * THORChain mainnet FIN order-book pairs whose base and quote assets are both
 * in the ASSETS registry — 18 of the 57 pairs live on mainnet as of
 * 2026-08-13. Sourced from the Rujira indexer (api.rujira.network, the same
 * finV2 query the vendored repos/rujira-ui trade screen uses); refresh from
 * there when assets are added.
 */
export const MAINNET_FIN_PAIRS: ReadonlyArray<FinPair> = [
    { address: "thor17aspfgv75azl5j25jte3dd48gruf36u2v5l48ey5hmd55tkfr8sqchmfwz", denoms: ["gaia-atom", "rune"] },
    { address: "thor1s8rxcvg83cwar87ehv4c866auxujkfj3k4wjkxkaren7vmvn9nass80ekp", denoms: ["gaia-atom", "eth-usdc-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"] },
    { address: "thor15t4cykf3mj8fsvd6ha8j0lnavcyex2h4a4l2pv8zkctandwck3zshs92jy", denoms: ["thor.auto", "eth-usdc-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"] },
    { address: "thor1dwsnlqw3lfhamc5dz3r57hlsppx3a2n2d7kppccxfdhfazjh06rs5077sz", denoms: ["btc-btc", "eth-usdc-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"] },
    { address: "thor1g3mymxjlmvyeadfys6lsj98sgg7mxut5pwz99q5rat7ny698elwq778ngf", denoms: ["eth-eth", "btc-btc"] },
    { address: "thor1sjl0uwl7kftjj00qklknv6n0gcx8upaawsatlyxt4v57ekpmfjtqv2hf6q", denoms: ["eth-eth", "rune"] },
    { address: "thor1tnd06uswj8033d0kzd5d7zre73u3uc44r2vvez26z5m4kr68vtusf2snva", denoms: ["eth-eth", "eth-usdc-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"] },
    { address: "thor1t76lvqjq7avt6kxnul4pt0zaq6y06fhkw29wxs5rm4kt873s6y9sdp8rxf", denoms: ["thor.lqdy", "btc-btc"] },
    { address: "thor15gdwez2jt8tdpukx4x4upul4pjtl8f4hx8dsj9a7htsszmas89gqqkx3kf", denoms: ["thor.lqdy", "eth-eth"] },
    { address: "thor1ax94w4rldvdgc4xgsfwgve7g7xfyxhvuvquvx57vtmr6y4alev0qw3mlvr", denoms: ["thor.lqdy", "eth-usdc-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"] },
    { address: "thor1a7jw3r8we32guc0cp0zwe5zw2fltt9ns0h9txhc923xd88d0mqlq4w9d3q", denoms: ["x/ruji", "btc-btc"] },
    { address: "thor1j9euq8fjd5zdxdkx7auser7kp84tmwtx3snuptpec6azakzwv3dqq6ahwp", denoms: ["x/ruji", "rune"] },
    { address: "thor17cawwg2lsnvcne69fek6nsqkf8snma6gc5ccceshul86rl0u3q4s5l5d0a", denoms: ["x/ruji", "eth-usdc-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"] },
    { address: "thor1qqql3tugjuwnslfgf9a9zfqenywn2h8zy9v025vh3398xtzpaqcsx5axyl", denoms: ["rune", "btc-btc"] },
    { address: "thor1y8g3yhzmnwyt6g7jque36eyregf85kgtzem6dgzqxuzrpmzpumvqts7ud7", denoms: ["rune", "eth-usdc-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"] },
    { address: "thor1jshw3secvxhzfyza6aj530hrc73zave42zgs525n0xkc3e9d6wkqrm8j3y", denoms: ["tcy", "btc-btc"] },
    { address: "thor12ds7fxj5g47jwzfzvzzhzxxd3cp6v55flgwxva0803r8k5mzm44skth6wa", denoms: ["tcy", "rune"] },
    { address: "thor1kyjky2yprmamj0gfkevyc6tunxev0054gpxjap8k9vkyutkkf5lqyr0xxv", denoms: ["tcy", "eth-usdc-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"] },
]

export const PAIRS_BY_CHAIN_ID: Record<ChainId, ReadonlyArray<FinPair>> = {
    thorchain: MAINNET_FIN_PAIRS
}
