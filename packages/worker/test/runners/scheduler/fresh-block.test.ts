import { describe, expect, it } from "vitest";
import {
  DEFAULT_MAX_BLOCK_AGE_MS,
  getFreshBlock,
  requireFreshBlock,
} from "../../../src/runners/scheduler/fresh-block.js";

const NOW_MS = Date.parse("2026-08-13T05:30:00.000Z");

const block = (height: number, time: string) => ({
  header: { height, time },
});

describe("scheduler RPC block freshness", () => {
  it("accepts a recent latest block", () => {
    const recent = block(27_406_618, "2026-08-13T05:29:30.000Z");

    expect(requireFreshBlock(recent, { nowMs: NOW_MS })).toBe(recent);
  });

  it("rejects a stale latest block", () => {
    expect(() =>
      requireFreshBlock(block(27_392_541, "2026-08-12T03:14:01.000Z"), {
        nowMs: NOW_MS,
      })
    ).toThrow(
      `RPC latest block is stale: height=27392541 time=2026-08-12T03:14:01.000Z ageMs=94559000 maxAgeMs=${DEFAULT_MAX_BLOCK_AGE_MS}`
    );
  });

  it("rejects a stale block returned by an RPC request", async () => {
    const staleBlock = block(27_392_541, "2026-08-12T03:14:01.000Z");

    await expect(
      getFreshBlock(() => Promise.resolve(staleBlock), { nowMs: NOW_MS })
    ).rejects.toThrow("RPC latest block is stale");
  });

  it("returns a fresh block from an RPC request", async () => {
    const freshBlock = block(27_406_618, "2026-08-13T05:29:45.000Z");

    await expect(
      getFreshBlock(() => Promise.resolve(freshBlock), { nowMs: NOW_MS })
    ).resolves.toBe(freshBlock);
  });

  it("rejects an invalid latest block time", () => {
    expect(() =>
      requireFreshBlock(block(27_406_618, "not-a-time"), { nowMs: NOW_MS })
    ).toThrow(
      "RPC returned an invalid latest block time: height=27406618 time=not-a-time"
    );
  });
});
