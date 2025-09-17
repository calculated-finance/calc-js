import { SendMessageBatchCommand, SQSClient } from "@aws-sdk/client-sqs";
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import type { Trigger } from "@template/domain/calc2";
import {
  CHAINS_BY_ID,
  RUJIRA_STAGENET,
  type CosmosChain,
} from "@template/domain/chains";
import {
  CosmWasmQueryError,
  getCosmWasmClient,
} from "@template/domain/cosmwasm";
import { FinPair, PAIRS_BY_CHAIN_ID } from "@template/domain/rujira";
import type {
  ConditionFilter,
  SchedulerQueryMsg,
} from "@template/domain/types";
import { Config, DateTime, Effect, Schedule, Schema, Stream } from "effect";

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export class SQSSendMessageError extends Schema.TaggedError<SQSSendMessageError>()(
  "SQSSendMessageError",
  {
    cause: Schema.Defect,
  }
) {}

const sqs = new SQSClient({});

const getCosmosChainTriggers = (
  chain: CosmosChain,
  filter: ConditionFilter,
  client: CosmWasmClient
) =>
  Effect.gen(function* () {
    if (!chain.schedulerContract) {
      return yield* Effect.fail(
        new CosmWasmQueryError({
          cause: "Scheduler contract not defined for chain",
        })
      );
    }

    const triggers = yield* Effect.tryPromise<
      Array<Trigger>,
      CosmWasmQueryError
    >({
      try: () =>
        client.queryContractSmart(chain.schedulerContract!, {
          filtered: {
            limit: 5,
            filter,
          },
        } as SchedulerQueryMsg),
      catch: (error: any) => {
        console.log(
          `Failed to fetch triggers from chain ${
            chain.id
          } with filter ${JSON.stringify(filter)}: ${error.message}`
        );
        return new CosmWasmQueryError({ cause: error });
      },
    }).pipe(Effect.retry(Schedule.exponential("500 millis")));

    return triggers;
  });

const checkTriggerCanExecute = (
  chain: CosmosChain,
  triggerId: string,
  client: CosmWasmClient
) =>
  Effect.gen(function* () {
    if (!chain.schedulerContract) {
      return yield* Effect.fail(
        new CosmWasmQueryError({
          cause: "Scheduler contract not defined for chain",
        })
      );
    }

    return yield* Effect.tryPromise<boolean, CosmWasmQueryError>({
      try: () =>
        client.queryContractSmart(chain.schedulerContract!, {
          can_execute: triggerId,
        }),
      catch: (error: any) => {
        console.log(
          `Failed to check if trigger can execute on chain ${chain.id} for trigger ${triggerId}: ${error.message}`
        );
        return new CosmWasmQueryError({ cause: error });
      },
    }).pipe(Effect.retry(Schedule.exponential("500 millis")));
  });

const fetchTimeTriggers = (chain: CosmosChain, client: CosmWasmClient) =>
  Effect.gen(function* () {
    const block = yield* Effect.tryPromise({
      try: async () => client.getBlock(),
      catch: (error: any) => {
        console.log(
          `Failed to fetch block height from chain ${chain.id}: ${error.message}`
        );
        return new CosmWasmQueryError({ cause: error });
      },
    });

    const blockTime = DateTime.unsafeFromDate(
      new Date(Date.parse(block.header.time))
    );

    const end = (blockTime.epochMillis * 10 ** 6).toFixed(0);

    return yield* getCosmosChainTriggers(
      chain,
      {
        timestamp: { end },
      },
      client
    );
  });

const fetchBlockTriggers = (chain: CosmosChain, client: CosmWasmClient) =>
  Effect.gen(function* () {
    const block = yield* Effect.tryPromise({
      try: async () => {
        const block = await client.getBlock();
        return block.header.height;
      },
      catch: (error: any) => {
        console.log(
          `Failed to fetch block height from chain ${chain.id}: ${error.message}`
        );
        return new CosmWasmQueryError({ cause: error });
      },
    });

    return yield* getCosmosChainTriggers(
      chain,
      {
        block_height: { end: block },
      },
      client
    );
  });

const fetchLimitOrders = (
  chain: CosmosChain,
  client: CosmWasmClient,
  pair: FinPair
) =>
  Effect.gen(function* () {
    const limitOrderTriggers = yield* getCosmosChainTriggers(
      chain,
      {
        limit_order: {
          pair_address: pair.address,
        },
      },
      client
    );

    const triggers = [];

    for (const trigger of limitOrderTriggers) {
      const canExecute = yield* checkTriggerCanExecute(
        chain,
        trigger.id,
        client
      );

      if (canExecute) {
        triggers.push(trigger);
      } else {
        console.log(
          `Skipping limit order trigger at ${JSON.stringify(
            trigger.condition
          )} for pair ${pair.denoms}`
        );
      }
    }

    return triggers;
  });

const producer = Effect.gen(function* () {
  const chainId = yield* Config.string("CHAIN_ID").pipe(
    Config.withDefault(RUJIRA_STAGENET.id)
  );
  const queueUrl = yield* Config.string("QUEUE_URL").pipe(
    Config.withDefault(
      "https://sqs.ap-southeast-1.amazonaws.com/503097572706/calc-staging-triggers.fifo"
    )
  );
  const fetchDelay = yield* Config.string("FETCH_DELAY").pipe(
    Config.withDefault("2000")
  );

  const chain = CHAINS_BY_ID[chainId] as CosmosChain;
  const client = yield* getCosmWasmClient(chain);

  const enqueueTriggers = (triggers: Trigger[]) =>
    Effect.tryPromise({
      try: async () => {
        if (triggers.length === 0) {
          return;
        }

        for (const trigger of triggers) {
          console.log(
            `Enqueuing trigger ${trigger.id} with condition ${JSON.stringify(
              trigger.condition
            )}`
          );
        }

        await sqs.send(
          new SendMessageBatchCommand({
            QueueUrl: queueUrl,
            Entries: triggers.map((trigger) => ({
              Id: trigger.id,
              MessageBody: trigger.id,
              MessageGroupId: trigger.id,
              MessageDeduplicationId: trigger.id,
            })),
          })
        );
      },
      catch: (error: any) => {
        console.log(
          `Failed to enqueue triggers for chain ${chain.id}: ${error.message}`
        );
        return new SQSSendMessageError({ cause: error });
      },
    });

  const timeFetcher = Stream.repeatEffect(
    fetchTimeTriggers(chain, client).pipe(
      Effect.delay(`${Number(fetchDelay)} millis`),
      Effect.catchAll((error) =>
        Effect.gen(function* () {
          yield* Effect.logError("Failed to fetch time triggers", error);
          return [];
        })
      )
    )
  ).pipe(Stream.runForEach(enqueueTriggers));

  const blockFetcher = Stream.repeatEffect(
    fetchBlockTriggers(chain, client).pipe(
      Effect.delay(`${Number(fetchDelay)} millis`),
      Effect.catchAll((error) =>
        Effect.gen(function* () {
          yield* Effect.logError("Failed to fetch block triggers", error);
          return [];
        })
      )
    )
  ).pipe(Stream.runForEach(enqueueTriggers));

  const limitOrderFetchers = PAIRS_BY_CHAIN_ID[chainId].map((pair) =>
    Stream.repeatEffect(
      fetchLimitOrders(chain, client, pair).pipe(
        Effect.delay("30 seconds"),
        Effect.catchAll((error) =>
          Effect.gen(function* () {
            yield* Effect.logError(
              "Failed to fetch limit order triggers",
              error
            );
            return [];
          })
        )
      )
    ).pipe(Stream.runForEach(enqueueTriggers))
  );

  yield* Effect.all([timeFetcher, blockFetcher, ...limitOrderFetchers], {
    concurrency: "unbounded",
  });
});

producer.pipe(Effect.scoped, Effect.runPromise);
