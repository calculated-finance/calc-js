import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { FoundTx } from "@template/worker/types";

type Resources = {
  dynamodb: DynamoDBDocumentClient;
};

let initPromise: Promise<Resources> | null = null;

function init(): Promise<Resources> {
  if (initPromise) return initPromise;

  console.log("Initializing sync dependencies...");

  initPromise = (async () => ({
    dynamodb: DynamoDBDocumentClient.from(new DynamoDBClient({})),
  }))();

  return initPromise;
}

const EXECUTE_STRATEGY = "wasm-calc-strategy/execute";
const PROCESS_MESSAGES = "wasm-calc-strategy/process-node.messages";
const PROCESS_RESULT = "wasm-calc-strategy/process-node.result";

export const handler = async (event: {
  Records: Array<{ messageId: string; body: string }>;
}) => {
  await init();

  const transactions = event.Records.map((r) => JSON.parse(r.body) as FoundTx);
  const strategies: Record<string, Record<string, any>> = {};

  console.log(
    "Processing transactions:",
    JSON.stringify(transactions, null, 2)
  );

  for (const { events } of transactions) {
    for (const { type, attributes } of events) {
      if (type === EXECUTE_STRATEGY) {
        const strategyAddress = attributes["_contract_address"];
        strategies[strategyAddress] = {};
      }

      if (type === PROCESS_MESSAGES) {
        const strategyAddress = attributes["_contract_address"];
        const nodeIndex = attributes["node_index"];
        strategies[strategyAddress] ||= {};
        strategies[strategyAddress]["events"] ||= {};

        strategies[strategyAddress]["events"][nodeIndex] = {
          messages: JSON.parse(attributes["messages"]),
        };
      }

      if (type === PROCESS_RESULT) {
        const strategyAddress = attributes["_contract_address"];
        const nodeIndex = attributes["node_index"];
        const status = attributes["status"];
        strategies[strategyAddress] ||= {};
        strategies[strategyAddress]["events"] ||= {};

        strategies[strategyAddress]["events"][nodeIndex] = {
          ...(strategies[strategyAddress]["events"][nodeIndex] || {}),
          status,
          ...("error" in attributes ? { error: attributes["error"] } : {}),
        };
      }
    }
  }

  console.log("Processed strategies:", JSON.stringify(strategies, null, 2));

  return { batchItemFailures: [] };
};
