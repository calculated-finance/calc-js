import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { SendMessageBatchCommand, SQSClient } from "@aws-sdk/client-sqs";
import {
  DynamoDBDocumentClient,
  GetCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { fromTendermintEvent, StargateClient } from "@cosmjs/stargate";
import type { TxResponse } from "@cosmjs/tendermint-rpc";
import { Tendermint37Client } from "@cosmjs/tendermint-rpc";
import {
  CHAINS_BY_ID,
  RUJIRA_STAGENET,
  type CosmosChain,
} from "@template/domain/chains";
import { FoundTx } from "@template/worker/types";
import { flattenAttributes } from "@template/worker/util";
import { Config, Duration, Effect, Schedule } from "effect";

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

const sqs = new SQSClient({});
const dynamodb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

type CheckpointItem = {
  chain_id: string; // chain id
  last_height: number;
};

async function getCheckpoint(
  tableName: string,
  chainId: string
): Promise<number | null> {
  const out = await dynamodb.send(
    new GetCommand({
      TableName: tableName,
      Key: { chain_id: chainId },
      ConsistentRead: true,
    })
  );

  const item = out.Item as CheckpointItem | undefined;
  return item?.last_height ?? null;
}

async function setCheckpoint(
  tableName: string,
  chainId: string,
  newHeight: number
): Promise<void> {
  await dynamodb.send(
    new UpdateCommand({
      TableName: tableName,
      Key: { chain_id: chainId },
      UpdateExpression: "SET last_height = :h",
      ConditionExpression:
        "attribute_not_exists(last_height) OR :h > last_height",
      ExpressionAttributeValues: { ":h": newHeight },
    })
  );
}

async function txSearchAll(
  tm: Tendermint37Client,
  query: string,
  perPage = 100
): Promise<TxResponse[]> {
  let page = 1;
  const out: TxResponse[] = [];

  while (true) {
    const res = await tm.txSearch({
      query,
      page,
      per_page: perPage,
      prove: false,
    });

    out.push(...(res.txs as any));
    const fetched = page * perPage;
    if (res.totalCount <= fetched || res.txs.length === 0) break;
    page += 1;
  }

  return out;
}

async function fetchCalcTransactions(
  tm: Tendermint37Client,
  minHeight: number,
  maxHeight: number,
  managerAddress: string,
  feeCollectorAddress: string
): Promise<FoundTx[]> {
  return Promise.all([
    txSearchAll(
      tm,
      `tx.height>=${minHeight} AND tx.height<=${maxHeight} AND execute._contract_address='${managerAddress}'`
    ),
    txSearchAll(
      tm,
      `tx.height>=${minHeight} AND tx.height<=${maxHeight} AND transfer.recipient='${feeCollectorAddress}'`
    ),
  ]).then((results) =>
    results.flat().map((t) => ({
      hash: Buffer.from(t.hash).toString("hex"),
      index: t.index,
      events: t.result.events.map((e) =>
        flattenAttributes(fromTendermintEvent(e))
      ),
      height: t.height,
    }))
  );
}

export class SQSSendMessageError extends Error {
  constructor(message: string, public cause?: unknown) {
    super(message);
  }
}

const indexer = Effect.gen(function* () {
  const chainId = yield* Config.string("CHAIN_ID").pipe(
    Config.withDefault(RUJIRA_STAGENET.id)
  );

  const queueUrl = yield* Config.string("QUEUE_URL").pipe(
    Config.withDefault("")
  );

  const tableName = yield* Config.string("CHECKPOINT_TABLE").pipe(
    Config.withDefault("calc-production-indexer-checkpoint")
  );

  const fetchDelayMs = Number(
    yield* Config.string("FETCH_DELAY").pipe(Config.withDefault("6000"))
  );

  const windowBlocks = Number(
    yield* Config.string("WINDOW_BLOCKS").pipe(Config.withDefault("5"))
  );

  const chain = CHAINS_BY_ID[chainId] as CosmosChain;
  const rpc = chain.rpcUrls[0];

  const client = yield* Effect.tryPromise({
    try: () => StargateClient.connect(rpc),
    catch: (e) => e as unknown,
  });

  const tm = yield* Effect.tryPromise({
    try: () => Tendermint37Client.connect(rpc),
    catch: (e) => e as unknown,
  });

  const tick = Effect.gen(function* () {
    const latest = yield* Effect.tryPromise({
      try: () => client.getHeight(),
      catch: (e) => e as unknown,
    });

    const saved = yield* Effect.tryPromise({
      try: () => getCheckpoint(tableName, chainId),
      catch: (e) => e as unknown,
    });

    let nextHeight = saved != null ? saved + 1 : Math.max(1, latest - 1000);

    const head = yield* Effect.tryPromise(() => client.getHeight());

    if (nextHeight > head) {
      yield* Effect.sleep(Duration.millis(fetchDelayMs));
      return;
    }

    const end = Math.min(head, nextHeight + windowBlocks - 1);

    const results = yield* Effect.tryPromise(() =>
      fetchCalcTransactions(
        tm,
        nextHeight,
        end,
        chain.managerContract!,
        chain.feeCollectorAddress!
      )
    );

    const byHash = new Map<string, FoundTx>();

    for (const tx of results) {
      if (!byHash.has(tx.hash)) byHash.set(tx.hash, tx);
    }

    const txList = Array.from(byHash.values());

    console.log({ fetched: txList.length, window: [nextHeight, end] });

    console.log(
      JSON.stringify(
        txList.map((t) => t.events),
        null,
        2
      )
    );

    for (let i = 0; i < txList.length; i += 10) {
      yield* Effect.tryPromise({
        try: () =>
          sqs.send(
            new SendMessageBatchCommand({
              QueueUrl: queueUrl,
              Entries: txList.slice(i, i + 10).map((tx) => ({
                Id: tx.hash,
                MessageBody: JSON.stringify({
                  chainId,
                  ...tx,
                }),
                MessageGroupId: chainId,
                MessageDeduplicationId: tx.hash,
              })),
            })
          ),
        catch: (e) => new SQSSendMessageError("SQS enqueue failed", e),
      });
    }

    yield* Effect.tryPromise({
      try: () => setCheckpoint(tableName, chainId, end),
      catch: (e) => e as unknown,
    });

    nextHeight = end + 1;

    if (nextHeight > head) {
      yield* Effect.sleep(Duration.millis(fetchDelayMs));
    }
  });

  yield* tick.pipe(Effect.repeat(Schedule.forever));
});

indexer.pipe(Effect.scoped, Effect.runPromise);
