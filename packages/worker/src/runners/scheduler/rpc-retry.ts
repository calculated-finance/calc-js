import { Duration, Schedule } from "effect";

export const RPC_RETRY_BASE_DELAY = Duration.seconds(5);
export const RPC_RETRY_MAX_DELAY = Duration.minutes(30);

/**
 * Back off while every Rujira/THORChain RPC is unavailable, but keep checking
 * often enough to recover within 30 minutes of service returning.
 */
export const rpcRetrySchedule = Schedule.exponential(
  RPC_RETRY_BASE_DELAY
).pipe(
  Schedule.modifyDelay((_, delay) =>
    Duration.min(delay, RPC_RETRY_MAX_DELAY)
  )
);
