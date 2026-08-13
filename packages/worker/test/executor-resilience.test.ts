import { describe, expect, it, vi } from "vitest";
import {
  AllRpcEndpointsFailedError,
  calculateAttemptTimeoutMs,
  classifyRpcFailure,
  deduplicateTriggerIds,
  executeWithRpcFailover,
  ExecutionBudgetExhaustedError,
  RpcAttemptTimeoutError,
  RpcCircuitBreaker,
  type RpcEndpoint,
} from "../src/handlers/executor/resilience.js";

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
