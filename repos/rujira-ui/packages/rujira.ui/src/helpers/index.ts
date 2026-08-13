export const getLang = () => {
  if (navigator.languages != undefined) return navigator.languages[0];
  return navigator.language;
};

export const whatDecimalSeparator = () => {
  const n = 1.1;
  const s = n.toLocaleString().substring(1, 2);
  return s;
};

export const isEmpty = (obj: any) => {
  for (const prop in obj) {
    if (Object.hasOwn(obj, prop)) {
      return false;
    }
  }
  return true;
};

export const uuidv4 = () => {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
    (
      +c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))
    ).toString(16)
  );
};

export const nFormatter = (bigint: bigint, digits: number, decimals = 8) => {
  const num = Number(bigint) / 10 ** decimals;
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "B" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  const item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });

  return item
    ? (num / item.value).toLocaleDecimal(digits).replace(rx, "$1") + item.symbol
    : num
      ? num.toLocaleDecimal(digits).replaceAll(/\.[0]+$/g, "")
      : "0";
};

export type ValueUsdEntry = {
  valueUsd?: bigint;
};

export const compareBigintDesc = (a: bigint, b: bigint): number =>
  a === b ? 0 : a > b ? -1 : 1;

export const compareValueUsdDesc = (
  a: ValueUsdEntry,
  b: ValueUsdEntry
): number => compareBigintDesc(a.valueUsd || 0n, b.valueUsd || 0n);

export const sortByValueUsd = <T extends ValueUsdEntry>(
  options: readonly T[],
  compareEqual?: (a: T, b: T) => number
): T[] =>
  [...options].sort(
    (a, b) => compareValueUsdDesc(a, b) || compareEqual?.(a, b) || 0
  );

export const sortKeysByValueUsd = <T extends ValueUsdEntry>(
  options: readonly T[],
  getKey: (option: T) => string,
  compareEqual: (a: string, b: string) => number = (a, b) => a.localeCompare(b)
): string[] => {
  const valueByKey = new Map<string, bigint>();

  for (const option of options) {
    const key = getKey(option);
    const valueUsd = option.valueUsd || 0n;
    valueByKey.set(key, (valueByKey.get(key) || 0n) + valueUsd);
  }

  return [...valueByKey.keys()].sort(
    (a, b) =>
      compareBigintDesc(valueByKey.get(a) || 0n, valueByKey.get(b) || 0n) ||
      compareEqual(a, b)
  );
};

export const nFormatterInt = (num: number, digits: number) => {
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  const item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });

  return item
    ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol
    : "0";
};

export interface Apr {
  value: bigint | null | undefined;
  status: "AVAILABLE" | "NOT_APPLICABLE" | "SOON" | "%future added value";
}

export const formatApr = (apr: Apr | null | undefined): string => {
  if (!apr) return "—";

  if (apr.status === "SOON") return "Soon";
  if (apr.status === "NOT_APPLICABLE") return "N/A";

  if (apr.value === null) return "—";
  if (apr.value === undefined) return "—";

  return `${nFormatter(apr.value, 2, 10)}%`;
};

export const classApr = (apr: Apr | null | undefined): string => {
  if (!apr) return "color-grey";

  if (apr.status === "SOON") return "color-white";
  if (apr.status === "NOT_APPLICABLE") return "color-grey";

  if (apr.value === null) return "color-grey";
  if (apr.value === undefined) return "color-grey";

  if (apr.value >= 0n) return "color-teal";
  return "color-red";
};

export const compress = (v: string): string => {
  if (v.match(/^0+$/)) return "0";
  const matches = v.match(/^(0+)([0-9]+)/);
  if (!matches) return v;
  const count = matches[1].length;

  if (count <= 2) return v;

  const sub = {
    "0": "\u2080",
    "1": "\u2081",
    "2": "\u2082",
    "3": "\u2083",
    "4": "\u2084",
    "5": "\u2085",
    "6": "\u2086",
    "7": "\u2087",
    "8": "\u2088",
    "9": "\u2089",
  }[count];

  return "\u0030" + sub + matches[2];
};

/**
 * Formats a float value, using subscript when necessary if the value is small.
 * @param floatValue The value to format.
 * @param rounding The number of digits to round the value too, before applying subscript compression if necessary.
 *                 This param can be greater than the fractionDigits, to ensure that very small numbers still get subscript compression.
 * @param fractionDigits The desired number of fractional digits in the final output, including the subscripting.
 */
export const floatToSubscript = (
  floatValue: number,
  rounding: number,
  fractionDigits: number
): string => {
  const separator = whatDecimalSeparator();

  const formatted = floatValue.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: rounding,
  });
  const [intPart, decimalPart] = formatted.split(separator);

  if (!decimalPart) return intPart + ".".padEnd(fractionDigits + 1, "0");

  const compressedDec = compress(decimalPart);

  const trimmed =
    compressedDec.length >= fractionDigits
      ? compressedDec.substring(0, fractionDigits)
      : compressedDec.padEnd(fractionDigits, "0");

  return intPart + separator + trimmed;
};

export function clipFloat(value: number): string {
  if (!isFinite(value) || value === 0) return "0";

  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  const sep = whatDecimalSeparator();

  if (abs >= 1000) return sign + Math.round(abs).toLocaleString();
  if (abs >= 100) return sign + abs.toLocaleDecimal(1);
  if (abs >= 10) return sign + abs.toLocaleDecimal(2);
  if (abs >= 1) return sign + abs.toLocaleDecimal(3);
  if (abs >= 0.1) return sign + abs.toLocaleDecimal(4);

  // < 0.1: 4 significant figures, subscript notation if > 3 leading zeros
  const leadingZeros = Math.max(0, -Math.floor(Math.log10(abs)) - 1);
  const totalDecimals = leadingZeros + 4;
  const formatted = abs.toLocaleString(undefined, {
    minimumFractionDigits: totalDecimals,
    maximumFractionDigits: totalDecimals,
  });
  const [intPart, decPart] = formatted.split(sep);
  return (
    sign + (intPart ?? "0") + sep + compress((decPart ?? "").replace(/0+$/, ""))
  );
}

export function clipAmountString(amount: bigint, decimals: number): string {
  const { intStr, sep, decStr } = clipAmount(amount, decimals);
  return sep ? `${intStr}${whatDecimalSeparator()}${decStr}` : intStr;
}

export function clipAmount(
  amount: bigint,
  decimals: number
): { intStr: string; sep: boolean; decStr: string } {
  const scale = 10n ** BigInt(decimals);
  const intPart = amount / scale;
  const fracPart = amount % scale;
  const fracStr = fracPart.toString().padStart(decimals, "0");
  const intNum = Number(intPart);

  const withDec = (raw: string, int = String(intNum)) => ({
    intStr: int,
    sep: true,
    decStr: raw,
  });

  if (intNum >= 1000)
    return {
      intStr: (intPart || "0").toLocaleString(),
      sep: false,
      decStr: "",
    };
  if (intNum >= 100) return withDec(fracStr.substring(0, 1));
  if (intNum >= 10) return withDec(fracStr.substring(0, 2));
  if (intNum >= 1) return withDec(fracStr.substring(0, 3));
  if (fracPart === 0n) return { intStr: "0", sep: false, decStr: "" };

  const leadingZeros = (fracStr.match(/^(0*)/) ?? ["", ""])[1].length;

  if (leadingZeros === 0)
    return withDec(fracStr.substring(0, 4).replace(/0+$/, ""), "0");

  // < 0.1: 4 significant figures, trailing zeros trimmed
  const sigFigStr = fracStr.substring(0, leadingZeros + 4).replace(/0+$/, "");
  if (leadingZeros > 3)
    return { intStr: "0", sep: true, decStr: compress(sigFigStr) };
  return { intStr: "0", sep: true, decStr: sigFigStr };
}

/**
 * A function that uses string manipulation to convert a bigint into a floating point number,
 * avoiding the floating points maths issues that sometimes arise when generating this number
 * mathematically.
 * @param value The value to convert into a floating point number, using the provided number of decimals.
 * @param decimals The exponent value to use in the conversion.
 */
export const bigIntToDecimalString = (
  value: string | bigint,
  decimals: number
): string => {
  const valueStr = value.toString().padStart(decimals + 1, "0");
  const integerPart = valueStr.slice(0, -decimals) || "0";
  const decimalPart = valueStr.slice(-decimals);
  return `${integerPart}.${decimalPart}`;
};
