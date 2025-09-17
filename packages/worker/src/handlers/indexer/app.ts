/**
 * Sync transactions to a dynammodb table.
 *
 * Transactions of interest are:
 *
 * 1. Any MsgSend that transfers funds INTO a smart contract address. These could be deposits into
 * a CALC strategy address and hence must be indexed.
 *
 * 2. Any MsgSend that transfers funds OUT OF a smart contract address. These could be deposits into
 * a CALC strategy address and hence must be indexed.
 *
 * 3. Any MsgExecuteContract with a CALC event, these include
 *
 *    * wasm-calc-manager/strategy.create
 *
 *      - Fetch the strategy config and save it to the strategies table
 *      - Log any asset deposits
 *
 *    * wasm-calc-manager/strategy.execute
 *
 *      - Save relevant events from the TX in the events table
 *      - Log any asset deposits
 *
 *    * wasm-calc-manager/strategy.update
 *
 *      - Fetch the strategy config and update it in the strategies table
 *      - Log any asset deposits
 *
 *    * wasm-calc-manager/strategy.update-status
 *
 *      - Update the strategy status in the strategies table
 *
 *    * wasm-calc-manager/strategy.update-label
 *
 *      - Update the strategy name in the strategies table
 */

import { Event } from "@cosmjs/stargate";
import { Tendermint37Client } from "@cosmjs/tendermint-rpc";
import {
  CHAINS_BY_ID,
  CosmosChain,
  RUJIRA_STAGENET,
} from "@template/domain/chains";
import { Config, Effect, Ref, Schedule } from "effect";

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

type AppConfig = {
  chainId: string;
  startHeight: number;
  lag: number;
  pollMs: number;
};

const loadConfig = Effect.gen(function* () {
  const chainId = yield* Config.string("CHAIN_ID").pipe(
    Config.withDefault(RUJIRA_STAGENET.id)
  );
  const startHeight = yield* Config.number("START_HEIGHT").pipe(
    Config.withDefault(6_136_226)
  );
  const lag = yield* Config.number("LAG").pipe(Config.withDefault(2));
  const pollMs = yield* Config.number("POLL_MS").pipe(
    Config.withDefault(5_000)
  );

  return { chainId, startHeight, lag, pollMs } as AppConfig;
});

const makeClient = (rpcUrl: string) =>
  Effect.acquireRelease(
    Effect.tryPromise(() => Tendermint37Client.connect(rpcUrl)),
    (tm) => Effect.sync(() => tm.disconnect())
  );

const latestHeight = (tm: Tendermint37Client) =>
  Effect.tryPromise(async () => {
    const { syncInfo } = await tm.status();
    return syncInfo.latestBlockHeight;
  });

const targetHeight = (tm: Tendermint37Client, lag: number) =>
  latestHeight(tm).pipe(Effect.map((tip) => tip - lag));

const matchAction = (event: Event, action: string) =>
  event.type === "message" &&
  event.attributes.some((a) => a.key === "action" && a.value === action);

const processBlock = (
  tm: Tendermint37Client,
  height: number,
  lastRef: Ref.Ref<number>
) =>
  Effect.tryPromise(async () => {
    const { results: transactions } = await tm.blockResults(height);

    for (const { events } of transactions) {
      const isExecute = events.some((e) =>
        matchAction(e, "/cosmwasm.wasm.v1.MsgExecuteContract")
      );

      const isTransfer = events.some((e) => matchAction(e, "/types.MsgSend"));

      if (isExecute || isTransfer) {
        console.log(JSON.stringify(events, null, 2));
      }
    }

    return height;
  }).pipe(
    Effect.tap((h) => Ref.set(lastRef, h)),
    Effect.catchAll((err) =>
      Effect.logWarning(`failed to process block ${height}: ${String(err)}`)
    )
  );

const processRange = (
  tm: Tendermint37Client,
  from: number,
  to: number,
  lastRef: Ref.Ref<number>
) =>
  Effect.gen(function* () {
    for (let h = from; h <= to; h++) {
      yield* processBlock(tm, h, lastRef);
    }
  });

const program = Effect.gen(function* () {
  const cfg = yield* loadConfig;

  const chain = CHAINS_BY_ID[cfg.chainId] as CosmosChain;
  const rpcUrl = chain.rpcUrls[0];

  const tm = yield* makeClient(rpcUrl);
  const lastRef = yield* Ref.make(cfg.startHeight);

  const initialTarget = yield* targetHeight(tm, cfg.lag);
  const last0 = yield* Ref.get(lastRef);

  if (last0 < initialTarget) {
    yield* processRange(tm, last0 + 1, initialTarget, lastRef);
  }

  const last1 = yield* Ref.get(lastRef);

  console.error(`[tailing] starting at height ${last1 + 1}`);

  const tick = Effect.gen(function* () {
    const last = yield* Ref.get(lastRef);
    const target = yield* targetHeight(tm, cfg.lag);
    if (last < target) {
      yield* processRange(tm, last + 1, target, lastRef);
    }
  }).pipe(Effect.catchAll((e) => Effect.logError(e)));

  yield* tick.pipe(Effect.repeat(Schedule.spaced(cfg.pollMs)));
});

program.pipe(Effect.scoped, Effect.runPromise);
