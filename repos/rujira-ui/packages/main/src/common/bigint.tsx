export const bigintToFixed = (v: bigint, decimals = 12): string => {
  const factor = 10n ** BigInt(decimals);
  const whole = v / factor;
  const frac = v % factor;
  return `${whole}.${frac.toString().padStart(decimals, "0")}`;
};

export const bigintMin = (a: bigint, b: bigint): bigint => (a > b ? b : a);

export const formatBigintPercent = (a: bigint, decimals = 12) => {
  return `${(Number(a) / 10 ** (decimals - 2)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;
};
