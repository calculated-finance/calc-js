import { SendMessageBatchCommand, SQSClient } from "@aws-sdk/client-sqs";

const sqs = new SQSClient({});

export const handler = async (event: {
  Records: Array<{ messageId: string; body: string }>;
}) => {
  await sqs.send(
    new SendMessageBatchCommand({
      QueueUrl: process.env.TRIGGERS_FIFO_QUEUE_URL!,
      Entries: event.Records.map(({ body }) => body).map((trigger) => ({
        Id: trigger,
        MessageBody: trigger,
      })),
    })
  );

  return { batchItemFailures: [] };
};
