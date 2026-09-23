import { Duration, formatDuration } from "date-fns";

export const formatExecutionDuration = (duration: Duration) =>
  formatDuration(duration, {
    delimiter: ", ",
    format: duration.years
      ? ["years", "months"]
      : duration.months
        ? ["months", "days"]
        : duration.days
          ? ["days", "hours"]
          : duration.hours
            ? ["hours", "minutes"]
            : duration.minutes
              ? ["minutes"]
              : ["seconds"],
  });

/**
 * Truncates a price to the `tick` significant digits the pair accepts.
 * If an invalid or zero value tick is supplied, the price is returned
 * unadjusted.
 */
export const adjust = (price: bigint, tick: number): bigint => {
  if (!price) return 0n;
  if (!Number.isFinite(tick) || tick < 1) return price;
  const truncLen = price.toString().length - tick;
  if (truncLen < 0) {
    return price;
  }
  const trunc = 10n ** BigInt(truncLen);
  return BigInt((price / trunc) * trunc);
};
