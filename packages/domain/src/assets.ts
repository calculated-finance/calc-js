export const ASSETS = {
  rune: {
    displayName: "RUNE",
    significantFigures: 8,
    coinGeckoId: "thorchain",
    color: "#2CBE8C",
  },
  "btc-btc": {
    displayName: "BTC",
    significantFigures: 8,
    coinGeckoId: "bitcoin",
    color: "#F89626",
  },
  "eth-eth": {
    displayName: "ETH",
    significantFigures: 8,
    coinGeckoId: "ethereum",
    color: "#9fa5c9",
  },
  "x/ruji": {
    displayName: "RUJI",
    significantFigures: 8,
    coinGeckoId: "rujira",
    color: "#ab3ddb",
  },
  "thor.lqdy": {
    displayName: "LQDY",
    significantFigures: 8,
    coinGeckoId: "liquidy",
    color: "#24776B",
  },
  "thor.auto": {
    displayName: "AUTO",
    significantFigures: 8,
    coinGeckoId: "auto-2",
    color: "#161C24",
  },
  "eth-usdc-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48": {
    displayName: "USDC",
    significantFigures: 8,
    coinGeckoId: "usd-coin",
    color: "#2775CA",
  },
  tcy: {
    displayName: "TCY",
    significantFigures: 8,
    coinGeckoId: "tcy",
    color: "#102A22",
  },
  "gaia-atom": {
    displayName: "ATOM",
    significantFigures: 8,
    coinGeckoId: "cosmos",
    color: "#2E3148",
  },
};

export const ASSETS_BY_COINGECKO_ID: Record<string, { rawName: string }> =
  Object.entries(ASSETS).reduce((acc, [rawName, asset]) => {
    const { coinGeckoId } = asset;
    acc[coinGeckoId] = { rawName };
    return acc;
  }, {} as Record<string, { rawName: string }>);

export const ASSETS_BY_DENOM = Object.entries(ASSETS).reduce(
  (acc, [rawName, asset]) => {
    acc[rawName] = asset;
    return acc;
  },
  {} as Record<string, (typeof ASSETS)[keyof typeof ASSETS]>
);

import {
  BigDecimal,
  Context,
  Effect,
  Option,
  ParseResult,
  Schema,
} from "effect";

export const Asset = Schema.Struct({
  displayName: Schema.NonEmptyTrimmedString,
  denom: Schema.NonEmptyTrimmedString,
  significantFigures: Schema.Positive.pipe(Schema.clamp(6, 18)),
  color: Schema.NonEmptyTrimmedString,
});

export type Asset = Schema.Schema.Type<typeof Asset>;

export class AssetsProvider extends Context.Tag("AssetsProvider")<
  AssetsProvider,
  {
    readonly assets: () => Record<
      string,
      Omit<Schema.Schema.Type<typeof Asset>, "denom">
    >;
  }
>() {}

export const HardcodedAssetsProvider = {
  assets: () => ASSETS,
};

export const Amount = Schema.transformOrFail(
  Schema.Struct({
    amount: Schema.Union(
      Schema.NonEmptyTrimmedString,
      Schema.Number
    ).annotations({
      message: () => ({
        message: "Please provide a valid number",
        override: true,
      }),
    }),
    denom: Schema.NonEmptyTrimmedString,
  }),
  Schema.Struct({
    ...Asset.fields,
    amount: Schema.Number,
  }),
  {
    strict: true,
    encode: (value) =>
      ParseResult.succeed({
        amount: BigDecimal.format(
          BigDecimal.round(
            BigDecimal.multiply(
              BigDecimal.unsafeFromNumber(value.amount || 0),
              BigDecimal.unsafeFromNumber(10 ** value.significantFigures)
            )
          )
        ),
        denom: value.denom,
      }),
    decode: (value, _, ast) =>
      Effect.runSync(
        Effect.provideService(
          Effect.gen(function* () {
            const asset = (yield* AssetsProvider).assets()[value.denom];

            if (!asset) {
              return ParseResult.fail(
                new ParseResult.Type(
                  ast,
                  value,
                  `Unknown asset: ${value.denom}`
                )
              );
            }

            return ParseResult.succeed({
              displayName: asset.displayName,
              amount: Number(
                BigDecimal.format(
                  Option.getOrThrow(
                    BigDecimal.divide(
                      BigDecimal.unsafeFromString(`${value.amount}`),
                      BigDecimal.unsafeFromNumber(
                        10 ** asset.significantFigures
                      )
                    )
                  )
                )
              ),
              denom: value.denom,
              significantFigures: asset.significantFigures,
              color: asset.color,
            });
          }),
          AssetsProvider,
          HardcodedAssetsProvider
        )
      ),
  }
);

export type Amount = Schema.Schema.Type<typeof Amount>;

export type AmountDecoded = Schema.Schema.Type<typeof Amount.Encoded>;

export const assetList = Effect.provideService(
  Effect.gen(function* () {
    const assetsProvider = yield* AssetsProvider;

    return Object.entries(assetsProvider.assets()).map(([denom, asset]) => ({
      denom,
      ...asset,
    }));
  }),
  AssetsProvider,
  HardcodedAssetsProvider
);
