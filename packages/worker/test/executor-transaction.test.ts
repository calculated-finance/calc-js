import { fromUtf8, toUtf8 } from "@cosmjs/encoding";
import type { EncodeObject } from "@cosmjs/proto-signing";
import {
  BroadcastTxError,
  GasPrice,
  type IndexedTx,
  type StdFee,
} from "@cosmjs/stargate";
import { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx.js";
import type { MsgExecuteContract } from "cosmjs-types/cosmwasm/wasm/v1/tx.js";
import { describe, expect, it } from "vitest";
import {
  BroadcastOutcomeUnknownError,
  executeWithRpcFailover,
  RpcCircuitBreaker,
  type RpcEndpoint,
} from "../src/handlers/executor/resilience.js";
import {
  awaitInclusion,
  type Broadcast,
  rebroadcast,
  schedulerExecuteMessage,
  signAndBroadcast,
  type TransactionClient,
  TransactionFailedError,
  txHash,
} from "../src/handlers/executor/transaction.js";

const SEQUENCE_MISMATCH = new Error(
  "Query failed with (6): rpc error: code = Unknown desc = account sequence mismatch, expected 153452, got 153451: incorrect account sequence [cosmos/cosmos-sdk@v0.53.0/x/auth/ante/sigverify.go:364] with gas used: '16851': unknown request"
);
const networkError = () => new Error("fetch failed: ECONNRESET");

/** Shared state standing in for the chain every fake endpoint talks to. */
const makeChain = () => ({
  /** Hashes that have landed in a block, with their result code. */
  included: new Map<string, number>(),
  /** When false, accepted txs sit in the mempool and never land. */
  includeTxs: true,
  txCode: 0,
  /** Every distinct tx this wallet signed, in order. */
  signed: [] as string[],
});
type Chain = ReturnType<typeof makeChain>;

/** A broadcast that reaches the mempool but whose response is lost. */
const acceptedThen = (error: Error) => ({ acceptedThen: error });

const fakeEndpoint = (
  rpcUrl: string,
  chain: Chain,
  faults: {
    broadcast?: Array<Error | ReturnType<typeof acceptedThen>>;
    getTx?: Error[];
    simulate?: Error[];
  } = {}
) => {
  const calls = {
    broadcast: [] as string[],
    getTx: [] as string[],
    sign: [] as StdFee[],
    simulate: [] as EncodeObject[][],
  };
  const accept = (txBytes: Uint8Array) => {
    if (chain.includeTxs) chain.included.set(txHash(txBytes), chain.txCode);
  };

  const client: TransactionClient = {
    simulate: async (_address, messages) => {
      calls.simulate.push([...messages]);
      const fault = faults.simulate?.shift();
      if (fault) throw fault;
      return 100_000;
    },
    sign: async (_address, _messages, fee) => {
      calls.sign.push(fee);
      const txRaw = TxRaw.fromPartial({
        bodyBytes: toUtf8(`tx-${chain.signed.length + 1}`),
        authInfoBytes: new Uint8Array(),
        signatures: [new Uint8Array()],
      });
      chain.signed.push(txHash(TxRaw.encode(txRaw).finish()));
      return txRaw;
    },
    broadcastTxSync: async (txBytes) => {
      const hash = txHash(txBytes);
      calls.broadcast.push(hash);
      const fault = faults.broadcast?.shift();
      if (fault && "acceptedThen" in fault) {
        accept(txBytes);
        throw fault.acceptedThen;
      }
      if (fault) throw fault;
      accept(txBytes);
      return hash;
    },
    getTx: async (hash) => {
      calls.getTx.push(hash);
      const fault = faults.getTx?.shift();
      if (fault) throw fault;
      const code = chain.included.get(hash);
      if (code === undefined) return null;
      return {
        code,
        events: [{ type: "wasm", attributes: [] }],
        gasUsed: 90_000n,
        gasWanted: 140_000n,
        hash,
        height: 100,
        msgResponses: [],
        rawLog: code === 0 ? "" : "out of gas",
        tx: new Uint8Array(),
        txIndex: 0,
      } satisfies IndexedTx;
    },
  };

  return { calls, endpoint: { client, rpcUrl } };
};

const messages = [schedulerExecuteMessage("thor1executor", "thor1scheduler", ["7", "8"])];
const gasPrice = GasPrice.fromString("0.0rune");

const fakeClock = () => {
  let time = 0;
  const sleeps: number[] = [];
  return {
    now: () => time,
    sleep: async (ms: number) => {
      sleeps.push(ms);
      time += ms;
    },
    sleeps,
  };
};

describe("txHash", () => {
  it("hashes like CometBFT: uppercase hex SHA-256", () => {
    expect(txHash(new Uint8Array())).toBe(
      "E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855"
    );
  });
});

describe("schedulerExecuteMessage", () => {
  it("builds the scheduler execute msg from the executor", () => {
    const [message] = messages;
    const value = message.value as MsgExecuteContract;

    expect(message.typeUrl).toBe("/cosmwasm.wasm.v1.MsgExecuteContract");
    expect(value.sender).toBe("thor1executor");
    expect(value.contract).toBe("thor1scheduler");
    expect(JSON.parse(fromUtf8(value.msg))).toEqual({ execute: ["7", "8"] });
    expect(value.funds).toEqual([]);
  });
});

describe("signAndBroadcast", () => {
  const submit = (endpoint: RpcEndpoint<TransactionClient>) =>
    signAndBroadcast({ address: "thor1executor", endpoint, gasPrice, messages });

  it("simulates, signs with 1.4x gas and broadcasts the signed bytes", async () => {
    const chain = makeChain();
    const a = fakeEndpoint("rpc-1", chain);

    const broadcast = await submit(a.endpoint);

    expect(a.calls.simulate).toEqual([messages]);
    expect(a.calls.sign[0].gas).toBe("140000");
    expect(broadcast.rpcUrl).toBe("rpc-1");
    expect(broadcast.transactionHash).toBe(chain.signed[0]);
    expect(txHash(broadcast.txBytes)).toBe(broadcast.transactionHash);
    expect(a.calls.broadcast).toEqual([broadcast.transactionHash]);
  });

  it("throws a simulate sequence mismatch as-is, before signing", async () => {
    const chain = makeChain();
    const a = fakeEndpoint("rpc-1", chain, { simulate: [SEQUENCE_MISMATCH] });

    await expect(submit(a.endpoint)).rejects.toBe(SEQUENCE_MISMATCH);
    expect(chain.signed).toEqual([]);
    expect(a.calls.broadcast).toEqual([]);
  });

  it("throws CheckTx rejections as-is: nothing reached a mempool", async () => {
    const chain = makeChain();
    const rejection = new BroadcastTxError(32, "sdk", "account sequence mismatch");
    const a = fakeEndpoint("rpc-1", chain, { broadcast: [rejection] });

    await expect(submit(a.endpoint)).rejects.toBe(rejection);
    expect(chain.included.size).toBe(0);
  });

  it("treats 'already in mempool' as a successful broadcast", async () => {
    const chain = makeChain();
    const a = fakeEndpoint("rpc-1", chain, {
      broadcast: [
        acceptedThen(new BroadcastTxError(19, "sdk", "tx already in mempool")),
      ],
    });

    const broadcast = await submit(a.endpoint);
    expect(broadcast.transactionHash).toBe(chain.signed[0]);
  });

  it("wraps a transport error as an unknown outcome carrying the signed bytes", async () => {
    const chain = makeChain();
    const cause = networkError();
    const a = fakeEndpoint("rpc-1", chain, { broadcast: [acceptedThen(cause)] });

    const error = await submit(a.endpoint).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(BroadcastOutcomeUnknownError);
    const unknown = error as BroadcastOutcomeUnknownError;
    expect(unknown.cause).toBe(cause);
    expect(unknown.rpcUrl).toBe("rpc-1");
    expect(unknown.transactionHash).toBe(chain.signed[0]);
    expect(txHash(unknown.txBytes)).toBe(unknown.transactionHash);
  });
});

describe("rebroadcast", () => {
  const txBytes = toUtf8("signed-tx");

  it("sends the same bytes and stops at the first endpoint that accepts", async () => {
    const chain = makeChain();
    const b = fakeEndpoint("rpc-2", chain);
    const c = fakeEndpoint("rpc-3", chain);

    await expect(
      rebroadcast({ endpoints: [b.endpoint, c.endpoint], txBytes })
    ).resolves.toBe("rpc-2");
    expect(b.calls.broadcast).toEqual([txHash(txBytes)]);
    expect(c.calls.broadcast).toEqual([]);
  });

  it("counts 'tx already exists in cache' as accepted", async () => {
    const chain = makeChain();
    const b = fakeEndpoint("rpc-2", chain, {
      broadcast: [new Error("Internal error: tx already exists in cache")],
    });

    await expect(rebroadcast({ endpoints: [b.endpoint], txBytes })).resolves.toBe(
      "rpc-2"
    );
  });

  it("reports each failure and returns undefined when no endpoint accepts", async () => {
    const chain = makeChain();
    const b = fakeEndpoint("rpc-2", chain, { broadcast: [networkError()] });
    const c = fakeEndpoint("rpc-3", chain, { broadcast: [networkError()] });
    const failures: string[] = [];

    await expect(
      rebroadcast({
        endpoints: [b.endpoint, c.endpoint],
        onFailure: ({ rpcUrl }) => failures.push(rpcUrl),
        txBytes,
      })
    ).resolves.toBeUndefined();
    expect(failures).toEqual(["rpc-2", "rpc-3"]);
    expect(chain.signed).toEqual([]);
  });

  it("returns undefined when there are no other endpoints", async () => {
    await expect(rebroadcast({ endpoints: [], txBytes })).resolves.toBeUndefined();
  });
});

describe("awaitInclusion", () => {
  const land = (chain: Chain, hash: string) => chain.included.set(hash, 0);

  it("returns the tx once it lands", async () => {
    const chain = makeChain();
    land(chain, "HASH");
    const a = fakeEndpoint("rpc-1", chain);
    const clock = fakeClock();

    const tx = await awaitInclusion({
      ...clock,
      deadlineMs: 50_000,
      endpoints: [a.endpoint],
      pollIntervalMs: 3_000,
      transactionHash: "HASH",
    });

    expect(tx).toMatchObject({ hash: "HASH", height: 100, code: 0 });
    expect(clock.sleeps).toEqual([3_000]);
  });

  it("keeps polling the same endpoint while the tx is not found", async () => {
    const chain = makeChain();
    const a = fakeEndpoint("rpc-1", chain);
    const b = fakeEndpoint("rpc-2", chain);

    await awaitInclusion({
      ...fakeClock(),
      deadlineMs: 12_000,
      endpoints: [a.endpoint, b.endpoint],
      pollIntervalMs: 3_000,
      transactionHash: "HASH",
    });

    expect(a.calls.getTx).toHaveLength(4);
    expect(b.calls.getTx).toHaveLength(0);
  });

  it("moves to the next endpoint when one errors, and wraps around", async () => {
    const chain = makeChain();
    const a = fakeEndpoint("rpc-1", chain, { getTx: [networkError()] });
    const b = fakeEndpoint("rpc-2", chain, { getTx: [networkError()] });
    const failures: string[] = [];
    land(chain, "HASH");

    const tx = await awaitInclusion({
      ...fakeClock(),
      deadlineMs: 50_000,
      endpoints: [a.endpoint, b.endpoint],
      onPollFailure: ({ rpcUrl }) => failures.push(rpcUrl),
      pollIntervalMs: 3_000,
      transactionHash: "HASH",
    });

    expect(tx?.hash).toBe("HASH");
    expect(failures).toEqual(["rpc-1", "rpc-2"]);
    expect(a.calls.getTx).toHaveLength(2);
  });

  it("returns null at the deadline without polling past it", async () => {
    const chain = makeChain();
    const a = fakeEndpoint("rpc-1", chain);
    const clock = fakeClock();

    const tx = await awaitInclusion({
      ...clock,
      deadlineMs: 10_000,
      endpoints: [a.endpoint],
      pollIntervalMs: 3_000,
      transactionHash: "HASH",
    });

    expect(tx).toBeNull();
    expect(clock.now()).toBeLessThanOrEqual(10_000);
    expect(a.calls.getTx).toHaveLength(3);
  });

  it("returns null without polling when the deadline has passed", async () => {
    const chain = makeChain();
    const a = fakeEndpoint("rpc-1", chain);

    const tx = await awaitInclusion({
      ...fakeClock(),
      deadlineMs: 0,
      endpoints: [a.endpoint],
      pollIntervalMs: 3_000,
      transactionHash: "HASH",
    });

    expect(tx).toBeNull();
    expect(a.calls.getTx).toEqual([]);
  });
});

describe("TransactionFailedError", () => {
  it("carries the hash, code and log", () => {
    const error = new TransactionFailedError({
      code: 11,
      hash: "HASH",
      rawLog: "out of gas",
    });

    expect(error).toMatchObject({
      code: 11,
      message: "Transaction HASH failed with code 11: out of gas",
      name: "TransactionFailedError",
      rawLog: "out of gas",
      transactionHash: "HASH",
    });
  });
});

/**
 * The handler's submit path end to end: failover + signAndBroadcast, then
 * recovery from an unknown outcome and polling. The property that matters is
 * that the wallet never has two signed txs in flight.
 */
describe("submit path", () => {
  const submitWithFailover = (
    endpoints: RpcEndpoint<TransactionClient>[],
    clock = fakeClock()
  ) =>
    executeWithRpcFailover({
      circuitBreaker: new RpcCircuitBreaker({
        cooldownMs: 60_000,
        failureThreshold: 2,
      }),
      endpoints,
      execute: (endpoint) =>
        signAndBroadcast({
          address: "thor1executor",
          endpoint,
          gasPrice,
          messages,
        }),
      getRemainingTimeInMillis: () => 60_000,
      headroomMs: 5_000,
      maxAttemptMs: 20_000,
      minAttemptMs: 3_000,
      sequenceRetry: { maxRetries: 3, sleep: clock.sleep, waitMs: 6_000 },
      startIndex: 0,
    });

  it("rides out a sequence mismatch on the same endpoint and lands one tx", async () => {
    const chain = makeChain();
    const a = fakeEndpoint("rpc-1", chain, { simulate: [SEQUENCE_MISMATCH] });
    const b = fakeEndpoint("rpc-2", chain);
    const clock = fakeClock();

    const broadcast = await submitWithFailover([a.endpoint, b.endpoint], clock);
    const tx = await awaitInclusion({
      ...clock,
      deadlineMs: 50_000,
      endpoints: [a.endpoint, b.endpoint],
      pollIntervalMs: 3_000,
      transactionHash: broadcast.transactionHash,
    });

    expect(clock.sleeps[0]).toBe(6_000);
    expect(a.calls.simulate).toHaveLength(2);
    expect(b.calls.simulate).toHaveLength(0);
    expect(chain.signed).toEqual([broadcast.transactionHash]);
    expect(tx?.hash).toBe(broadcast.transactionHash);
  });

  it("recovers an unknown broadcast by rebroadcasting, never re-signing", async () => {
    const chain = makeChain();
    const a = fakeEndpoint("rpc-1", chain, {
      broadcast: [acceptedThen(networkError())],
    });
    const b = fakeEndpoint("rpc-2", chain, {
      broadcast: [new Error("tx already exists in cache")],
    });

    const broadcast: Broadcast = await submitWithFailover([
      a.endpoint,
      b.endpoint,
    ]).catch(async (error: unknown) => {
      if (!(error instanceof BroadcastOutcomeUnknownError)) throw error;
      await rebroadcast({ endpoints: [b.endpoint], txBytes: error.txBytes });
      return error;
    });
    const tx = await awaitInclusion({
      ...fakeClock(),
      deadlineMs: 50_000,
      endpoints: [a.endpoint, b.endpoint],
      pollIntervalMs: 3_000,
      transactionHash: broadcast.transactionHash,
    });

    expect(chain.signed).toHaveLength(1);
    expect(b.calls.simulate).toHaveLength(0);
    expect(b.calls.broadcast).toEqual(a.calls.broadcast);
    expect(tx?.hash).toBe(chain.signed[0]);
  });

  it("fails over and re-signs only when CheckTx rejected the first tx", async () => {
    const chain = makeChain();
    const a = fakeEndpoint("rpc-1", chain, {
      broadcast: [new BroadcastTxError(5, "sdk", "insufficient funds")],
    });
    const b = fakeEndpoint("rpc-2", chain);

    const broadcast = await submitWithFailover([a.endpoint, b.endpoint]);

    expect(broadcast.rpcUrl).toBe("rpc-2");
    expect(chain.signed).toHaveLength(2);
    // The rejected tx never reached a mempool; only the second one lands.
    expect(chain.included.has(chain.signed[0])).toBe(false);
    expect(chain.included.has(chain.signed[1])).toBe(true);
  });
});
