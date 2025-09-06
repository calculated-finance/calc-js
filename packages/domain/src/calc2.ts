import { Schema } from "effect";
import { Duration, Timestamp, Uint64 } from "./cosmwasm.js";

export const StrategyStatus = Schema.Union(
  Schema.Literal("active"),
  Schema.Literal("paused")
);

export const EncodedStrategy = Schema.Struct({
  contract_address: Schema.String,
  created_at: Schema.Positive,
  updated_at: Schema.Positive,
  id: Schema.Positive,
  label: Schema.NonEmptyTrimmedString,
  owner: Schema.NonEmptyTrimmedString,
  status: StrategyStatus,
});

export const DecodedStrategy = Schema.transform(
  EncodedStrategy,
  Schema.Struct({
    contractAddress: Schema.String,
    createdAt: Schema.Positive,
    updatedAt: Schema.Positive,
    id: Schema.Positive,
    label: Schema.NonEmptyTrimmedString,
    owner: Schema.NonEmptyTrimmedString,
    status: StrategyStatus,
  }),
  {
    strict: true,
    decode: (input) => ({
      contractAddress: input.contract_address,
      createdAt: input.created_at,
      updatedAt: input.updated_at,
      id: input.id,
      label: input.label,
      owner: input.owner,
      status: input.status,
    }),
    encode: (input) => ({
      contract_address: input.contractAddress,
      created_at: input.createdAt,
      updated_at: input.updatedAt,
      id: input.id,
      label: input.label,
      owner: input.owner,
      status: input.status,
    }),
  }
);

export const Strategy = Schema.compose(
  EncodedStrategy,
  Schema.transform(
    DecodedStrategy,
    Schema.Struct({
      contractAddress: Schema.String,
      createdAt: Schema.Positive,
      updatedAt: Schema.Positive,
      id: Schema.Positive,
      label: Schema.NonEmptyTrimmedString,
      owner: Schema.NonEmptyTrimmedString,
      status: StrategyStatus,
    }),
    {
      strict: true,
      decode: (input) => input,
      encode: (input) => input,
    }
  )
);

export const TimestampElapsedCondition = Schema.Struct({
  type: Schema.Literal("timestamp_elapsed"),
  timestamp_elapsed: Timestamp,
});

export const BlocksCompletedCondition = Schema.Struct({
  type: Schema.Literal("blocks_completed"),
  blocks_completed: Schema.Positive,
});

export const Condition = Schema.Union(
  TimestampElapsedCondition,
  BlocksCompletedCondition
);

export const Trigger = Schema.Struct({
  id: Uint64,
  owner: Schema.NonEmptyTrimmedString,
  executors: Schema.Array(Schema.NonEmptyTrimmedString),
  jitter: Schema.optional(Schema.NullOr(Duration)),
  condition: Condition,
});

export type Trigger = Schema.Schema.Type<typeof Trigger>;
