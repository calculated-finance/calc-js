// import { describe, it } from "@effect/vitest"
// import type { ThorchainRoute as ThorchainRouteType } from "../src/types.js"

// declare global {
//     interface BigInt {
//         toJSON(): string
//     }
// }

// BigInt.prototype.toJSON = function() {
//     return this.toString() + "n"
// }

// describe("Schema tests", () => {
//     it("should pass", () => {
//         const thorchainRoute: { thorchain: ThorchainRouteType } = {
//             thorchain: {
//                 max_streaming_quantity: 2,
//                 streaming_interval: 3,
//                 latest_swap: {
//                     starting_block: 123456,
//                     swap_amount: {
//                         amount: "1000",
//                         denom: "THOR.RUNE"
//                     },
//                     streaming_swap_blocks: 10,
//                     expected_receive_amount: {
//                         amount: "900",
//                         denom: "BTC.BTC"
//                     },
//                     memo: "asdas"
//                 }
//             }
//         }

//         // const routes: Array<SwapRouteType> = [
//         //     {
//         //         fin: {
//         //             pair_address: "thor1xyz"
//         //         }
//         //     },
//         //     thorchainRoute
//         // ]

//         // const adjustment = {
//         //     linear_scalar: {
//         //         base_receive_amount: {
//         //             amount: "1000",
//         //             denom: "THOR.RUNE"
//         //         },
//         //         minimum_swap_amount: {
//         //             amount: "900",
//         //             denom: "BTC.BTC"
//         //         },
//         //         scalar: "100002343234234400000.34535340001"
//         //     }
//         // }

//         // const data: SwapType = {
//         //     swap_amount: {
//         //         amount: "1000",
//         //         denom: "THOR.RUNE"
//         //     },
//         //     minimum_receive_amount: {
//         //         amount: "900",
//         //         denom: "BTC.BTC"
//         //     },
//         //     maximum_slippage_bps: 50,
//         //     adjustment,
//         //     routes
//         // }

//         // const result = Effect.runSync(Schema.decodeUnknown(LinearScalarSwapAdjustment)(adjustment))
//         // console.log(JSON.stringify(result, null, 2))
//         // console.log(JSON.stringify(Schema.encodeSync(LinearScalarSwapAdjustment)(result), null, 2))

//         // const result1 = Effect.runSync(Schema.decodeUnknown(CoinSchema)(data.swap_amount))
//         // console.log(JSON.stringify(result1, null, 2))
//         // console.log(JSON.stringify(Schema.encodeSync(CoinSchema)(result1), null, 2))

//         // const result = Effect.runSync(Schema.decodeUnknown(Action)({ many: [{ swap: data }] }))
//         // console.log(JSON.stringify(result, null, 2))
//         // console.log(JSON.stringify(Schema.encodeSync(Action)(result), null, 2))

//         // const result = Effect.runSync(Schema.decodeUnknown(ThorchainRoute)(thorchainRoute))
//         // console.log(JSON.stringify(result, null, 2))
//         // console.log(JSON.stringify(Schema.encodeSync(ThorchainRoute)(result), null, 2))
//     })
// })
