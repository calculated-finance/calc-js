import { Chunk, Duration, Effect, Schedule } from "effect";
import { describe, expect, it } from "vitest";
import {
  RPC_RETRY_BASE_DELAY,
  RPC_RETRY_MAX_DELAY,
  rpcRetrySchedule,
} from "../../../src/runners/scheduler/rpc-retry.js";

describe("scheduler RPC retry", () => {
  it("backs off exponentially and caps retries at 30 minutes", async () => {
    const delays = await Effect.runPromise(
      rpcRetrySchedule.pipe(
        Schedule.delays,
        Schedule.run(0, Array.from({ length: 12 }))
      )
    );

    expect(Chunk.toReadonlyArray(delays).map(Duration.toMillis)).toEqual([
      5_000,
      10_000,
      20_000,
      40_000,
      80_000,
      160_000,
      320_000,
      640_000,
      1_280_000,
      1_800_000,
      1_800_000,
      1_800_000,
    ]);
  });

  it("keeps the maximum recovery lag within the configured cap", () => {
    expect(Duration.toMillis(RPC_RETRY_BASE_DELAY)).toBe(5_000);
    expect(Duration.toMillis(RPC_RETRY_MAX_DELAY)).toBe(30 * 60 * 1_000);
  });
});
