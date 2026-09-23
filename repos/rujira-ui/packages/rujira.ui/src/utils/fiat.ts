import { whatDecimalSeparator } from "../helpers";

const FIAT_SCALE = 10n ** 12n;

export const toFiatAmount = (
  price: bigint | null | undefined,
  amount: bigint
): bigint | undefined => {
  return price != null ? (price * amount) / FIAT_SCALE : undefined;
};

/**
 * Formats a fiat bigint amount as a display string.
 * @param amount - The bigint value to format.
 * @param options
 * @param options.decimals - Decimal places in the bigint representation. @default 8
 * @param options.rounding - Visible decimal digits in the output. @default 2
 */
export const toFiatDisplay = (
  amount: bigint,
  options?: {
    /** @default 8 */
    decimals?: number;
    /** @default 2 */
    rounding?: number;
  }
): string => {
  const { decimals: useDecimals = 8, rounding: useRounding = 2 } =
    options ?? {};

  const dec = amount % BigInt(10 ** useDecimals);
  const int = BigInt(Math.floor(Number(amount - dec) / 10 ** useDecimals));

  return `${(int || "0").toLocaleString()}${whatDecimalSeparator()}${dec.toString().padStart(useDecimals, "0").substring(0, useRounding)}`;
};

/**
 * A util that will combine text and asset values into a single display string. Use this
 * when you want to add the fiat value of 1 or more assets to a component label, or other text.
 * It will internally sum up the total values for you, and return a string with a fiat value
 * appended, provided all price values are valid and non-zero. If any price value is
 * invalid, then the original label will be returned with no fiat value appended as we cannot
 * compute an accurate fiat value.
 * @param label The label text.
 * @param assets The assets to sum up, format and append to the supplied label.
 * @param symbol The fiat symbol to use.
 */
export const fiatize = (
  label: string,
  assets: { price: bigint | null | undefined; amount: bigint }[],
  symbol = "$"
): string => {
  if (!assets || assets.length === 0) return label;

  let fiatTotal = 0n;
  let incomplete = false;

  for (const asset of assets) {
    // 0n is currently considered an invalid price for the purposes of this function.
    if (!asset.price) {
      incomplete = true;
      break;
    }

    fiatTotal = fiatTotal + (toFiatAmount(asset.price, asset.amount) ?? 0n);
  }

  if (incomplete || fiatTotal === 0n) return label;

  return `${label} (${symbol}${toFiatDisplay(fiatTotal)})`;
};
