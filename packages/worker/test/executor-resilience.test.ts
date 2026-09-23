import { BroadcastTxError } from "@cosmjs/stargate";
import { describe, expect, it, vi } from "vitest";
import {
  AllRpcEndpointsFailedError,
  BroadcastOutcomeUnknownError,
  calculateAttemptTimeoutMs,
  classifyRpcFailure,
  deduplicateTriggerIds,
  executeWithRpcFailover,
  ExecutionBudgetExhaustedError,
  isSequenceMismatch,
  isTxAlreadyKnown,
  parseSequenceMismatch,
  preferredStartIndex,
  RpcAttemptTimeoutError,
  RpcCircuitBreaker,
  type RpcEndpoint,
} from "../src/handlers/executor/resilience.js";

// The exact error seen in production executor logs.
const SIMULATE_SEQUENCE_MISMATCH = new Error(
  "Query failed with (6): rpc error: code = Unknown desc = account sequence mismatch, expected 153452, got 153451: incorrect account sequence [cosmos/cosmos-sdk@v0.53.0/x/auth/ante/sigverify.go:364] with gas used: '16851': unknown request"
);
const CHECKTX_SEQUENCE_MISMATCH = () =>
  new BroadcastTxError(
    32,
    "sdk",
    "account sequence mismatch, expected 5, got 4: incorrect account sequence"
  );
const ambiguousBroadcast = (rpcUrl = "rpc-1") =>
  new BroadcastOutcomeUnknownError({
    cause: new Error("fetch failed: ECONNRESET"),
    rpcUrl,
    transactionHash: "ABC123",
    txBytes: new Uint8Array([1, 2, 3]),
  });

const endpoints = ["rpc-1", "rpc-2", "rpc-3"].map((rpcUrl) => ({
  client: rpcUrl,
  rpcUrl,
}));

describe("RpcCircuitBreaker", () => {
  it("opens a failing endpoint and restores it after cooldown", () => {
    let now = 1_000;
    const breaker = new RpcCircuitBreaker({
      cooldownMs: 500,
      failureThreshold: 2,
      now: () => now,
    });

    expect(breaker.recordFailure("rpc-1").opened).toBe(false);
    expect(breaker.recordFailure("rpc-1").opened).toBe(true);
    expect(breaker.select(endpoints, 0)).toEqual({
      endpoints: endpoints.slice(1),
      forcedProbe: false,
      skippedRpcUrls: ["rpc-1"],
    });

    now = 1_500;
    expect(breaker.select(endpoints, 0).endpoints).toEqual(endpoints);
    breaker.recordSuccess("rpc-1");
    expect(breaker.getState("rpc-1")).toBeUndefined();
  });

  it("opens an endpoint immediately after an execute timeout", () => {
    const breaker = new RpcCircuitBreaker({
      cooldownMs: 500,
      failureThreshold: 2,
      now: () => 1_000,
    });

    expect(
      breaker.recordFailure("rpc-1", { openImmediately: true })
    ).toEqual({
      consecutiveFailures: 1,
      opened: true,
      openUntilMs: 1_500,
    });
    expect(breaker.select(endpoints, 0)).toEqual({
      endpoints: endpoints.slice(1),
      forcedProbe: false,
      skippedRpcUrls: ["rpc-1"],
    });
  });

  it("probes only the endpoint whose cooldown expires first when all are open", () => {
    let now = 1_000;
    const breaker = new RpcCircuitBreaker({
      cooldownMs: 500,
      failureThreshold: 1,
      now: () => now,
    });

    breaker.recordFailure("rpc-1");
    now = 1_100;
    breaker.recordFailure("rpc-2");
    now = 1_200;
    breaker.recordFailure("rpc-3");

    expect(breaker.select(endpoints, 0)).toEqual({
      endpoints: [endpoints[0]],
      forcedProbe: true,
      skippedRpcUrls: ["rpc-2", "rpc-3"],
    });
  });
});

describe("executeWithRpcFailover", () => {
  const options = () => ({
    circuitBreaker: new RpcCircuitBreaker({
      cooldownMs: 60_000,
      failureThreshold: 2,
    }),
    endpoints,
    getRemainingTimeInMillis: () => 60_000,
    headroomMs: 5_000,
    maxAttemptMs: 50_000,
    minAttemptMs: 3_000,
    startIndex: 0,
  });

  it("tries another endpoint after an explicit RPC rejection", async () => {
    const execute = vi
      .fn<(endpoint: RpcEndpoint<string>) => Promise<string>>()
      .mockRejectedValueOnce(new Error("Bad status on response: 502"))
      .mockResolvedValueOnce("ok");

    await expect(
      executeWithRpcFailover({ ...options(), execute })
    ).resolves.toBe("ok");
    expect(execute.mock.calls.map(([endpoint]) => endpoint.rpcUrl)).toEqual([
      "rpc-1",
      "rpc-2",
    ]);
  });

  it("tries another endpoint when one RPC reports that THORChain is halted", async () => {
    const execute = vi
      .fn<(endpoint: RpcEndpoint<string>) => Promise<string>>()
      .mockRejectedValueOnce(
        new Error("unable to use MsgExecuteContract while THORChain is halted")
      )
      .mockResolvedValueOnce("ok");

    await expect(
      executeWithRpcFailover({ ...options(), execute })
    ).resolves.toBe("ok");
    expect(execute.mock.calls.map(([endpoint]) => endpoint.rpcUrl)).toEqual([
      "rpc-1",
      "rpc-2",
    ]);
  });

  it("does not try another endpoint after an ambiguous client-side timeout", async () => {
    const testOptions = options();
    const execute = vi.fn(() => new Promise<string>(() => {}));
    const promise = executeWithRpcFailover({
      ...testOptions,
      execute,
      maxAttemptMs: 1,
      minAttemptMs: 1,
    });

    await expect(promise).rejects.toBeInstanceOf(RpcAttemptTimeoutError);
    expect(execute).toHaveBeenCalledTimes(1);
    expect(testOptions.circuitBreaker.getState("rpc-1")).toMatchObject({
      consecutiveFailures: 1,
      openUntilMs: expect.any(Number),
    });
    expect(
      testOptions.circuitBreaker.select(endpoints, 0).skippedRpcUrls
    ).toEqual(["rpc-1"]);
  });

  it("stops before starting an attempt without enough Lambda budget", async () => {
    const execute = vi.fn();

    await expect(
      executeWithRpcFailover({
        ...options(),
        execute,
        getRemainingTimeInMillis: () => 4_000,
        minAttemptMs: 3_000,
      })
    ).rejects.toBeInstanceOf(ExecutionBudgetExhaustedError);
    expect(execute).not.toHaveBeenCalled();
  });

  it("reports failure after every available endpoint rejects", async () => {
    const execute = vi.fn(() => Promise.reject(new Error("rejected")));

    await expect(
      executeWithRpcFailover({ ...options(), execute })
    ).rejects.toBeInstanceOf(AllRpcEndpointsFailedError);
    expect(execute).toHaveBeenCalledTimes(3);
  });
});

describe("executeWithRpcFailover sequence mismatch handling", () => {
  const setup = (overrides: { remainingTimeMs?: number } = {}) => {
    const sleeps: number[] = [];
    const circuitBreaker = new RpcCircuitBreaker({
      cooldownMs: 60_000,
      failureThreshold: 2,
    });
    const onSequenceMismatch = vi.fn();
    const onFailure = vi.fn();
    const run = (
      execute: (endpoint: RpcEndpoint<string>) => Promise<string>,
      // null: the caller has not opted into sequence retries.
      sequenceRetry: { maxRetries: number; waitMs: number } | null = {
        maxRetries: 3,
        waitMs: 6_000,
      }
    ) =>
      executeWithRpcFailover({
        circuitBreaker,
        endpoints,
        execute,
        getRemainingTimeInMillis: () => overrides.remainingTimeMs ?? 60_000,
        headroomMs: 5_000,
        hooks: { onFailure, onSequenceMismatch },
        maxAttemptMs: 20_000,
        minAttemptMs: 3_000,
        ...(sequenceRetry && {
          sequenceRetry: {
            ...sequenceRetry,
            sleep: async (ms: number) => {
              sleeps.push(ms);
            },
          },
        }),
        startIndex: 0,
      });
    return { circuitBreaker, onFailure, onSequenceMismatch, run, sleeps };
  };

  const rpcUrls = (execute: ReturnType<typeof vi.fn>) =>
    execute.mock.calls.map(([endpoint]) => (endpoint as RpcEndpoint<string>).rpcUrl);

  it("waits a block and retries the same endpoint after a simulate mismatch", async () => {
    const { circuitBreaker, onFailure, onSequenceMismatch, run, sleeps } = setup();
    const execute = vi
      .fn<(endpoint: RpcEndpoint<string>) => Promise<string>>()
      .mockRejectedValueOnce(SIMULATE_SEQUENCE_MISMATCH)
      .mockResolvedValueOnce("ok");

    await expect(run(execute)).resolves.toBe("ok");

    expect(rpcUrls(execute)).toEqual(["rpc-1", "rpc-1"]);
    expect(sleeps).toEqual([6_000]);
    expect(onSequenceMismatch).toHaveBeenCalledWith({
      attempt: 1,
      error: SIMULATE_SEQUENCE_MISMATCH,
      maxRetries: 3,
      retry: 1,
      rpcUrl: "rpc-1",
      waitMs: 6_000,
    });
    expect(onFailure).not.toHaveBeenCalled();
    expect(circuitBreaker.getState("rpc-1")).toBeUndefined();
  });

  it("retries the same endpoint after a CheckTx sequence rejection", async () => {
    const { run } = setup();
    const execute = vi
      .fn<(endpoint: RpcEndpoint<string>) => Promise<string>>()
      .mockRejectedValueOnce(CHECKTX_SEQUENCE_MISMATCH())
      .mockResolvedValueOnce("ok");

    await expect(run(execute)).resolves.toBe("ok");
    expect(rpcUrls(execute)).toEqual(["rpc-1", "rpc-1"]);
  });

  it("fails over after exhausting sequence retries and counts one circuit failure", async () => {
    const { circuitBreaker, onFailure, onSequenceMismatch, run, sleeps } = setup();
    const execute = vi
      .fn<(endpoint: RpcEndpoint<string>) => Promise<string>>()
      .mockRejectedValueOnce(SIMULATE_SEQUENCE_MISMATCH)
      .mockRejectedValueOnce(SIMULATE_SEQUENCE_MISMATCH)
      .mockRejectedValueOnce(SIMULATE_SEQUENCE_MISMATCH)
      .mockRejectedValueOnce(SIMULATE_SEQUENCE_MISMATCH)
      .mockResolvedValueOnce("ok");

    await expect(run(execute)).resolves.toBe("ok");

    expect(rpcUrls(execute)).toEqual([
      "rpc-1",
      "rpc-1",
      "rpc-1",
      "rpc-1",
      "rpc-2",
    ]);
    expect(sleeps).toEqual([6_000, 6_000, 6_000]);
    expect(onSequenceMismatch).toHaveBeenCalledTimes(3);
    expect(onFailure).toHaveBeenCalledTimes(1);
    expect(onFailure.mock.calls[0][0]).toMatchObject({
      attempt: 4,
      category: "sequence_mismatch",
      rpcUrl: "rpc-1",
      willRetryAnotherEndpoint: true,
    });
    expect(circuitBreaker.getState("rpc-1")).toMatchObject({
      consecutiveFailures: 1,
    });
  });

  it("gives each endpoint its own retry budget", async () => {
    const { run } = setup();
    const execute = vi
      .fn<(endpoint: RpcEndpoint<string>) => Promise<string>>()
      .mockRejectedValueOnce(SIMULATE_SEQUENCE_MISMATCH)
      .mockRejectedValueOnce(SIMULATE_SEQUENCE_MISMATCH)
      .mockRejectedValueOnce(SIMULATE_SEQUENCE_MISMATCH)
      .mockResolvedValueOnce("ok");

    await expect(run(execute, { maxRetries: 1, waitMs: 6_000 })).resolves.toBe(
      "ok"
    );
    expect(rpcUrls(execute)).toEqual(["rpc-1", "rpc-1", "rpc-2", "rpc-2"]);
  });

  it("fails over immediately on a mismatch when sequence retry is not configured", async () => {
    const { run, sleeps } = setup();
    const execute = vi
      .fn<(endpoint: RpcEndpoint<string>) => Promise<string>>()
      .mockRejectedValueOnce(SIMULATE_SEQUENCE_MISMATCH)
      .mockResolvedValueOnce("ok");

    await expect(run(execute, null)).resolves.toBe("ok");
    expect(rpcUrls(execute)).toEqual(["rpc-1", "rpc-2"]);
    expect(sleeps).toEqual([]);
  });

  it("does not wait when no attempt could start after the wait", async () => {
    // 13s left: 13 - 6 (wait) - 5 (headroom) = 2s < 3s minimum attempt.
    const { run, sleeps } = setup({ remainingTimeMs: 13_000 });
    const execute = vi
      .fn<(endpoint: RpcEndpoint<string>) => Promise<string>>()
      .mockRejectedValueOnce(SIMULATE_SEQUENCE_MISMATCH)
      .mockResolvedValueOnce("ok");

    await expect(run(execute)).resolves.toBe("ok");
    expect(sleeps).toEqual([]);
    expect(rpcUrls(execute)).toEqual(["rpc-1", "rpc-2"]);
  });

  it("waits when exactly enough budget remains for one more attempt", async () => {
    // 14s left: 14 - 6 - 5 = 3s, exactly the minimum attempt.
    const { run, sleeps } = setup({ remainingTimeMs: 14_000 });
    const execute = vi
      .fn<(endpoint: RpcEndpoint<string>) => Promise<string>>()
      .mockRejectedValueOnce(SIMULATE_SEQUENCE_MISMATCH)
      .mockResolvedValueOnce("ok");

    await expect(run(execute)).resolves.toBe("ok");
    expect(sleeps).toEqual([6_000]);
  });

  it("does not retry non-sequence errors on the same endpoint", async () => {
    const { run, sleeps } = setup();
    const execute = vi
      .fn<(endpoint: RpcEndpoint<string>) => Promise<string>>()
      .mockRejectedValueOnce(new Error("Bad status on response: 502"))
      .mockResolvedValueOnce("ok");

    await expect(run(execute)).resolves.toBe("ok");
    expect(rpcUrls(execute)).toEqual(["rpc-1", "rpc-2"]);
    expect(sleeps).toEqual([]);
  });
});

describe("executeWithRpcFailover ambiguous broadcast", () => {
  it("never submits through another endpoint after an unknown broadcast outcome", async () => {
    const circuitBreaker = new RpcCircuitBreaker({
      cooldownMs: 60_000,
      failureThreshold: 2,
    });
    const onFailure = vi.fn();
    const error = ambiguousBroadcast();
    const execute = vi.fn(() => Promise.reject(error));

    await expect(
      executeWithRpcFailover({
        circuitBreaker,
        endpoints,
        execute,
        getRemainingTimeInMillis: () => 60_000,
        headroomMs: 5_000,
        hooks: { onFailure },
        maxAttemptMs: 20_000,
        minAttemptMs: 3_000,
        startIndex: 0,
      })
    ).rejects.toBe(error);

    expect(execute).toHaveBeenCalledTimes(1);
    expect(onFailure.mock.calls[0][0]).toMatchObject({
      category: "ambiguous_broadcast",
      willRetryAnotherEndpoint: false,
    });
    // Unlike a timeout, a dropped connection costs little budget, so the
    // endpoint only gets an ordinary strike.
    expect(circuitBreaker.recordFailure("rpc-1").consecutiveFailures).toBe(2);
    expect(circuitBreaker.select(endpoints, 0).skippedRpcUrls).toEqual([
      "rpc-1",
    ]);
  });
});

describe("preferredStartIndex", () => {
  it("starts at the first endpoint when nothing has succeeded yet", () => {
    expect(preferredStartIndex(endpoints, undefined)).toBe(0);
  });

  it("starts at the endpoint that last succeeded", () => {
    expect(preferredStartIndex(endpoints, "rpc-2")).toBe(1);
    expect(preferredStartIndex(endpoints, "rpc-3")).toBe(2);
  });

  it("falls back to the first endpoint when the preferred one is gone", () => {
    expect(preferredStartIndex(endpoints, "rpc-removed")).toBe(0);
  });
});

describe("sequence and mempool error detection", () => {
  it("recognises sequence mismatches from simulate and CheckTx", () => {
    expect(isSequenceMismatch(SIMULATE_SEQUENCE_MISMATCH)).toBe(true);
    expect(isSequenceMismatch(CHECKTX_SEQUENCE_MISMATCH())).toBe(true);
    expect(isSequenceMismatch(new BroadcastTxError(32, "sdk", undefined))).toBe(
      true
    );
  });

  it("does not mistake other errors for sequence mismatches", () => {
    expect(isSequenceMismatch(new Error("Bad status on response: 502"))).toBe(
      false
    );
    expect(isSequenceMismatch(new BroadcastTxError(32, "wasm", "other"))).toBe(
      false
    );
    expect(isSequenceMismatch(undefined)).toBe(false);
  });

  it("recognises a tx the node already has", () => {
    expect(
      isTxAlreadyKnown(new BroadcastTxError(19, "sdk", "tx already in mempool"))
    ).toBe(true);
    expect(
      isTxAlreadyKnown(new Error("Internal error: tx already exists in cache"))
    ).toBe(true);
    expect(isTxAlreadyKnown(new BroadcastTxError(19, "wasm", "other"))).toBe(
      false
    );
    expect(isTxAlreadyKnown(new Error("fetch failed"))).toBe(false);
  });

  it("parses the expected and actual sequence", () => {
    expect(parseSequenceMismatch(SIMULATE_SEQUENCE_MISMATCH)).toEqual({
      expectedSequence: 153452,
      gotSequence: 153451,
    });
    expect(parseSequenceMismatch(new Error("no numbers"))).toEqual({});
  });

  it("classifies sequence mismatches and unknown broadcasts", () => {
    expect(classifyRpcFailure(SIMULATE_SEQUENCE_MISMATCH)).toBe(
      "sequence_mismatch"
    );
    expect(classifyRpcFailure(CHECKTX_SEQUENCE_MISMATCH())).toBe(
      "sequence_mismatch"
    );
    expect(classifyRpcFailure(ambiguousBroadcast())).toBe(
      "ambiguous_broadcast"
    );
  });
});

describe("attempt budgeting and classification", () => {
  it("keeps Lambda headroom and caps a single attempt", () => {
    expect(
      calculateAttemptTimeoutMs({
        headroomMs: 5_000,
        maxAttemptMs: 50_000,
        minAttemptMs: 3_000,
        remainingTimeMs: 60_000,
      })
    ).toBe(50_000);
  });

  it("deduplicates trigger IDs while preserving their order", () => {
    expect(deduplicateTriggerIds(["a", "b", "a", "c", "b"])).toEqual([
      "a",
      "b",
      "c",
    ]);
  });

  it("treats an RPC-reported halt as endpoint failure telemetry, not global state", () => {
    expect(
      classifyRpcFailure(
        new Error("unable to use MsgExecuteContract while THORChain is halted")
      )
    ).toBe("rpc_reported_chain_halted");
  });
});
