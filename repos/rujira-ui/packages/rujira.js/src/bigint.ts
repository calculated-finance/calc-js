export const bigintToFixed = (v: bigint, decimals = 12): string => {
  const int = v / 10n ** BigInt(decimals);
  const dec = v - int * 10n ** 12n;
  return `${int}.${dec.toString().padStart(decimals, "0")}`;
};

export const bigintMin = (a: bigint, b: bigint): bigint => (a > b ? b : a);
