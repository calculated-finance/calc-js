import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

type Resources = {
  dynamodb: DynamoDBDocumentClient;
};

let initPromise: Promise<Resources> | null = null;

function init(): Promise<Resources> {
  if (initPromise) return initPromise;

  console.log("Initializing sync dependencies...");

  initPromise = (async () => {
    return { dynamodb: DynamoDBDocumentClient.from(new DynamoDBClient({})) };
  })();

  return initPromise;
}

export const handler = async (event: {
  Records: Array<{ messageId: string; body: string }>;
}) => {
  await init();

  const transactions = event.Records.map((r) => r.body);

  console.log(transactions);

  return { batchItemFailures: [] };
};
