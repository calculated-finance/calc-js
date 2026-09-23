import { SendMessageBatchCommand, SQSClient } from "@aws-sdk/client-sqs";
import { CosmWasmClient } from "@cosmjs/cosmwasm";
import type {
  ConditionFilter,
  SchedulerQueryMsg,
  Trigger,
} from "@template/domain/calc";
import {
  CHAINS_BY_ID,
  RUJIRA,
  type CosmosChain,
} from "@template/domain/chains";
import {
  CosmWasmQueryError,
  makeRotatingClient,
  type RotatingClient,
} from "@template/domain/cosmwasm";
import { Config, DateTime, Effect, Schema, Stream } from "effect";
import "@template/domain/bigint-json";
import { getFreshBlock } from "./fresh-block.js";
import { rpcRetrySchedule } from "./rpc-retry.js";

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
  client: RotatingClient<CosmWasmClient>
) =>
  Effect.gen(function* () {
    if (!chain.schedulerContract) {
      return yield* Effect.fail(
        new CosmWasmQueryError({
          cause: "Scheduler contract not defined for chain",
        })
      );
    }

    return yield* client.use<Array<Trigger>>((c) =>
      c.queryContractSmart(chain.schedulerContract!, {
        filtered: {
          limit: 5,
          filter,
        },
      } as SchedulerQueryMsg)
    );
  });

const fetchTimeTriggers = (
  chain: CosmosChain,
  client: RotatingClient<CosmWasmClient>
) =>
  Effect.gen(function* () {
    const block = yield* client.use((c) => getFreshBlock(() => c.getBlock()));

    const blockTime = DateTime.unsafeFromDate(
      new Date(Date.parse(block.header.time))
    );

    const end = (blockTime.epochMillis * 10 ** 6).toFixed(0);

    return yield* getCosmosChainTriggers(chain, { timestamp: { end } }, client);
  });

const fetchBlockTriggers = (
  chain: CosmosChain,
  client: RotatingClient<CosmWasmClient>
) =>
  Effect.gen(function* () {
    const block = yield* client.use((c) => getFreshBlock(() => c.getBlock()));

    return yield* getCosmosChainTriggers(
      chain,
      { block_height: { end: block.header.height } },
      client
    );
  });

const scheduler = Effect.gen(function* () {
  const chainId = yield* Config.string("CHAIN_ID").pipe(
    Config.withDefault(RUJIRA.id)
  );
  const queueUrl = yield* Config.string("QUEUE_URL").pipe(
    Config.withDefault(
      "https://sqs.ap-southeast-1.amazonaws.com/503097572706/calc-staging-triggers.fifo"
    )
  );
  const fetchDelay = yield* Config.string("FETCH_DELAY").pipe(
    Config.withDefault("6000")
  );

  const chain = CHAINS_BY_ID[chainId] as CosmosChain;
  const client = yield* makeRotatingClient({
    rpcUrls: chain.rpcUrls,
    connect: (rpcUrl) => CosmWasmClient.connect(rpcUrl),
    disconnect: (c) => c.disconnect(),
  }).pipe(
    Effect.tapError((error) =>
      Effect.logWarning(
        `Failed to connect to chain ${chain.id}; retrying with backoff`,
        error
      )
    ),
    Effect.retry(rpcRetrySchedule)
  );

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
      Effect.tapError((error) =>
        Effect.logWarning(
          `Failed to fetch time triggers for chain ${chain.id}; retrying with backoff`,
          error
        )
      ),
      Effect.retry(rpcRetrySchedule),
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
      Effect.tapError((error) =>
        Effect.logWarning(
          `Failed to fetch block triggers for chain ${chain.id}; retrying with backoff`,
          error
        )
      ),
      Effect.retry(rpcRetrySchedule),
      Effect.delay(`${Number(fetchDelay)} millis`),
      Effect.catchAll((error) =>
        Effect.gen(function* () {
          yield* Effect.logError("Failed to fetch block triggers", error);
          return [];
        })
      )
    )
  ).pipe(Stream.runForEach(enqueueTriggers));

  yield* Effect.all([timeFetcher, blockFetcher], {
    concurrency: "unbounded",
  });
});

scheduler.pipe(Effect.scoped, Effect.runPromise);
