import { BigDecimal, Context, Effect, Option, ParseResult, Schema } from "effect"

export const Asset = Schema.Struct({
    displayName: Schema.NonEmptyTrimmedString,
    denom: Schema.NonEmptyTrimmedString,
    significantFigures: Schema.Positive.pipe(Schema.clamp(6, 18)),
    color: Schema.NonEmptyTrimmedString
})

export type Asset = Schema.Schema.Type<typeof Asset>

export class AssetsProvider extends Context.Tag("AssetsProvider")<
    AssetsProvider,
    {
        readonly assets: () => Record<string, Omit<Schema.Schema.Type<typeof Asset>, "denom">>
    }
>() {}

export const HardcodedAssetsProvider = {
    assets: () => ({
        rune: {
            displayName: "RUNE",
            significantFigures: 8,
            coinGeckoId: "thorchain",
            color: "#2CBE8C"
        },
        "btc-btc": {
            displayName: "BTC",
            significantFigures: 8,
            coinGeckoId: "bitcoin",
            color: "#F89626"
        },
        "eth-eth": {
            displayName: "ETH",
            significantFigures: 8,
            coinGeckoId: "ethereum",
            color: "#676D93"
        },
        "x/ruji": {
            displayName: "RUJI",
            significantFigures: 8,
            coinGeckoId: "rujira",
            color: "#B223EF"
        }
    })
}

export const Amount = Schema.transformOrFail(
    Schema.Struct({
        amount: Schema.Union(Schema.NonEmptyTrimmedString, Schema.Number).annotations({
            message: () => ({
                message: "Please provide a valid number",
                override: true
            })
        }),
        denom: Schema.NonEmptyTrimmedString
    }),
    Schema.Struct({
        ...Asset.fields,
        amount: Schema.Number
    }),
    {
        strict: true,
        encode: (value) =>
            ParseResult.succeed({
                amount: BigDecimal.format(BigDecimal.round(BigDecimal.multiply(
                    BigDecimal.unsafeFromNumber(value.amount || 0),
                    BigDecimal.unsafeFromNumber(10 ** value.significantFigures)
                ))),
                denom: value.denom
            }),
        decode: (value, _, ast) =>
            Effect.runSync(Effect.provideService(
                Effect.gen(function*() {
                    const asset = ((yield* AssetsProvider).assets())[value.denom]

                    if (!asset) {
                        return ParseResult.fail(new ParseResult.Type(ast, value, `Unknown asset: ${value.denom}`))
                    }

                    return ParseResult.succeed({
                        displayName: asset.displayName,
                        amount: Number(BigDecimal.format(Option.getOrThrow(
                            BigDecimal.divide(
                                BigDecimal.unsafeFromString(`${value.amount}`),
                                BigDecimal.unsafeFromNumber(10 ** asset.significantFigures)
                            )
                        ))),
                        denom: value.denom,
                        significantFigures: asset.significantFigures,
                        color: asset.color
                    })
                }),
                AssetsProvider,
                HardcodedAssetsProvider
            ))
    }
)

export const assetList = Effect.provideService(
    Effect.gen(function*() {
        const assetsProvider = yield* AssetsProvider

        return Object.entries(assetsProvider.assets()).map(([denom, asset]) => ({
            denom,
            ...asset
        }))
    }),
    AssetsProvider,
    HardcodedAssetsProvider
)
