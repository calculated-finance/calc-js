import { Effect, Schema } from "effect"
import type { Addr } from "./cosmwasm.js"

export const FinPair = Schema.Struct({
    address: Schema.NonEmptyTrimmedString,
    denoms: Schema.Array(Schema.NonEmptyTrimmedString)
})

export type FinPair = Schema.Schema.Type<typeof FinPair>

export const STAGENET_FIN_PAIRS: ReadonlyArray<FinPair> = [
    {
        address: "sthor1knzcsjqu3wpgm0ausx6w0th48kvl2wvtqzmvud4hgst4ggutehlseele4r" as Addr,
        denoms: ["rune", "x/ruji"]
    }
]

export const STAGENET_FIN_PAIRS_BY_DENOM: Record<string, Record<string, FinPair>> = STAGENET_FIN_PAIRS.reduce(
    (acc, pair) => ({
        ...acc,
        [pair.denoms[0]]: {
            ...acc[pair.denoms[0]],
            [pair.denoms[1]]: pair
        },
        [pair.denoms[1]]: {
            ...acc[pair.denoms[1]],
            [pair.denoms[0]]: pair
        }
    }),
    {} as Record<string, Record<string, FinPair>>
)

export class RujiraService extends Effect.Service<RujiraService>()("RujiraService", {
    effect: Effect.succeed({
        pairs: STAGENET_FIN_PAIRS,
        pairsByDenom: STAGENET_FIN_PAIRS_BY_DENOM
    })
}) {}
