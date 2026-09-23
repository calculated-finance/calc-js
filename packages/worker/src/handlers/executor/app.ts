import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from "@aws-sdk/client-secrets-manager";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm";
import { stringToPath } from "@cosmjs/crypto";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { GasPrice } from "@cosmjs/stargate";
import { CHAINS_BY_ID, CosmosChain } from "@template/domain/chains";
import {
  metricScope,
  type MetricsLogger,
  Unit,
} from "aws-embedded-metrics";
import {
  AllRpcEndpointsFailedError,
  BroadcastOutcomeUnknownError,
  calculateAttemptTimeoutMs,
  classifyRpcFailure,
  deduplicateTriggerIds,
  errorMessage,
  executeWithRpcFailover,
  ExecutionBudgetExhaustedError,
  parseSequenceMismatch,
  preferredStartIndex,
  RpcAttemptTimeoutError,
  RpcCircuitBreaker,
  type RpcFailureCategory,
  withTimeout,
} from "./resilience.js";
import {
  awaitInclusion,
  type Broadcast,
  rebroadcast,
  schedulerExecuteMessage,
  signAndBroadcast,
  TransactionFailedError,
} from "./transaction.js";

const RPC_CONNECT_TIMEOUT_MS = 5_000;
const RPC_QUERY_TIMEOUT_MS = 5_000;
// Simulate + sign + broadcast_sync only; waiting for the block is separate.
const RPC_SUBMIT_TIMEOUT_MS = 20_000;
// THORChain produces a block roughly every 6s.
const BLOCK_TIME_MS = 6_000;
const SEQUENCE_MISMATCH_MAX_RETRIES = 3;
const TX_POLL_INTERVAL_MS = 3_000;
// Stop waiting for inclusion well before the 55s near-timeout alarm, so a
// slow block is reported as a pending tx rather than as a Lambda near timeout.
const TX_POLL_HEADROOM_MS = 10_000;
const RPC_MIN_ATTEMPT_MS = 3_000;
const RPC_QUERY_MIN_ATTEMPT_MS = 1_000;
const LAMBDA_TIMEOUT_HEADROOM_MS = 5_000;
const RPC_CIRCUIT_FAILURE_THRESHOLD = 2;
const RPC_CIRCUIT_COOLDOWN_MS = 5 * 60_000;
const RESOURCE_TTL_MS = 5 * 60_000;
const STRATEGY_EXECUTED_EVENT = "wasm-calc-strategy/execute";
const CONTRACT_ADDRESS_ATTRIBUTE = "_contract_address";

const secrets = new SecretsManagerClient({});
const rpcCircuitBreaker = new RpcCircuitBreaker({
  cooldownMs: RPC_CIRCUIT_COOLDOWN_MS,
  failureThreshold: RPC_CIRCUIT_FAILURE_THRESHOLD,
});

type Signer = {
  client: SigningCosmWasmClient;
  rpcUrl: string;
};

type Resources = {
  address: string;
  gasPrice: GasPrice;
  scheduler: string;
  signers: Signer[];
};

type ExecutorEvent = {
  Records: Array<{ body: string; messageId: string }>;
};

type LambdaContext = {
  awsRequestId: string;
  getRemainingTimeInMillis: () => number;
};

type LogContext = {
  chainId: string;
  functionName: string;
  requestId: string;
  triggerIds: string[];
};

let cachedResources: Resources | null = null;
let initPromise: Promise<Resources> | null = null;
let resourcesExpireAtMs = 0;

// The endpoint that last submitted successfully. We stick to it rather than
// rotating per invocation; the circuit breaker and failover move us off it
// when it misbehaves. Module scope persists across warm Lambda invocations.
let preferredRpcUrl: string | undefined;

const structuredLog = (
  level: "ERROR" | "INFO" | "WARN",
  event: string,
  context: LogContext,
  fields: Record<string, unknown> = {}
) => {
  const entry = JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    event,
    ...context,
    ...fields,
  });

  if (level === "ERROR") console.error(entry);
  else if (level === "WARN") console.warn(entry);
  else console.log(entry);
};

const errorFields = (error: unknown) => ({
  errorMessage: errorMessage(error),
  errorName: error instanceof Error ? error.name : typeof error,
});

const isMissingTriggerError = (error: unknown) => {
  const message = errorMessage(error);

  return (
    message.includes("calc_rs::scheduler::Trigger") &&
    message.includes("not found")
  );
};

const preflightTriggerIds = async ({
  context,
  logContext,
  metrics,
  scheduler,
  signers,
  startIndex,
  triggerIds,
}: {
  context: LambdaContext;
  logContext: LogContext;
  metrics: MetricsLogger;
  scheduler: string;
  signers: Signer[];
  startIndex: number;
  triggerIds: string[];
}) => {
  const normalizedStart = startIndex % signers.length;
  const orderedSigners = [
    ...signers.slice(normalizedStart),
    ...signers.slice(0, normalizedStart),
  ];

  const results = await Promise.all(
    triggerIds.map(async (triggerId) => {
      let missingCount = 0;
      let notReadyCount = 0;
      const queryErrors: Array<{ error: unknown; rpcUrl: string }> = [];

      for (const { client, rpcUrl } of orderedSigners) {
        const timeoutMs = calculateAttemptTimeoutMs({
          headroomMs: LAMBDA_TIMEOUT_HEADROOM_MS,
          maxAttemptMs: RPC_QUERY_TIMEOUT_MS,
          minAttemptMs: RPC_QUERY_MIN_ATTEMPT_MS,
          remainingTimeMs: context.getRemainingTimeInMillis(),
        });

        metrics.putMetric("TriggerPreflightQuery", 1, Unit.Count);

        try {
          const canExecute = await withTimeout(
            client.queryContractSmart(scheduler, { can_execute: triggerId }),
            timeoutMs,
            () =>
              new Error(
                `RPC trigger query to ${rpcUrl} exceeded ${timeoutMs}ms`
              )
          );

          if (canExecute === true) {
            return { status: "executable" as const, triggerId };
          }

          if (canExecute === false) {
            notReadyCount += 1;
            continue;
          }

          queryErrors.push({
            error: new Error("Unexpected can_execute response"),
            rpcUrl,
          });
        } catch (error) {
          if (isMissingTriggerError(error)) {
            missingCount += 1;
          } else {
            queryErrors.push({ error, rpcUrl });
          }
        }
      }

      if (
        orderedSigners.length >= 2 &&
        missingCount === orderedSigners.length
      ) {
        return { status: "stale" as const, triggerId };
      }

      return {
        errors: queryErrors.map(({ error, rpcUrl }) => ({
          rpcUrl,
          ...errorFields(error),
        })),
        missingCount,
        notReadyCount,
        status: "inconclusive" as const,
        triggerId,
      };
    })
  );

  const confirmedExecutableTriggerIds = results
    .filter(({ status }) => status === "executable")
    .map(({ triggerId }) => triggerId);
  const staleTriggerIds = results
    .filter(({ status }) => status === "stale")
    .map(({ triggerId }) => triggerId);
  const inconclusiveResults = results.filter(
    ({ status }) => status === "inconclusive"
  );
  const inconclusiveTriggerIds = inconclusiveResults.map(
    ({ triggerId }) => triggerId
  );
  const executableTriggerIds = results
    .filter(({ status }) => status !== "stale")
    .map(({ triggerId }) => triggerId);

  if (inconclusiveResults.length > 0) {
    metrics.putMetric(
      "TriggerPreflightInconclusive",
      inconclusiveResults.length,
      Unit.Count
    );
    structuredLog(
      "WARN",
      "executor_trigger_preflight_inconclusive",
      logContext,
      { inconclusiveResults }
    );
  }

  if (executableTriggerIds.length > 0) {
    metrics.putMetric(
      "TriggerPreflightExecutable",
      executableTriggerIds.length,
      Unit.Count
    );
  }
  if (staleTriggerIds.length > 0) {
    metrics.putMetric(
      "TriggerPreflightStale",
      staleTriggerIds.length,
      Unit.Count
    );
  }
  structuredLog("INFO", "executor_trigger_preflight_succeeded", logContext, {
    confirmedExecutableTriggerIds,
    executableTriggerIds,
    inconclusiveTriggerIds,
    staleTriggerIds,
  });

  return { executableTriggerIds, staleTriggerIds };
};

const putFailureCategoryMetric = (
  metrics: MetricsLogger,
  category: RpcFailureCategory
) => {
  metrics.putMetric("RpcFailure", 1, Unit.Count);

  if (category === "ambiguous_timeout") {
    metrics.putMetric("RpcAmbiguousTimeout", 1, Unit.Count);
  } else if (category === "connect_timeout") {
    metrics.putMetric("RpcConnectTimeout", 1, Unit.Count);
  } else if (category === "http_502") {
    metrics.putMetric("RpcHttp502", 1, Unit.Count);
  } else if (category === "http_5xx") {
    metrics.putMetric("RpcHttp5xx", 1, Unit.Count);
  } else if (category === "sequence_mismatch") {
    metrics.putMetric("RpcSequenceMismatch", 1, Unit.Count);
  } else if (category === "ambiguous_broadcast") {
    metrics.putMetric("RpcAmbiguousBroadcast", 1, Unit.Count);
  } else if (category === "rpc_reported_chain_halted") {
    // Telemetry only. A halt response from one RPC is not treated as proof
    // that every configured RPC observes a chain-wide halt.
    metrics.putMetric("RpcReportedChainHalted", 1, Unit.Count);
  }
};

/**
 * The signed bytes may be in a mempool. Push the same bytes to the other
 * endpoints (never re-sign) so the caller can wait for the hash.
 */
const recoverUnknownBroadcast = async ({
  error,
  logContext,
  metrics,
  signers,
}: {
  error: BroadcastOutcomeUnknownError;
  logContext: LogContext;
  metrics: MetricsLogger;
  signers: Signer[];
}): Promise<Broadcast> => {
  metrics.putMetric("BroadcastOutcomeUnknown", 1, Unit.Count);
  const acceptedBy = await rebroadcast({
    endpoints: signers.filter(({ rpcUrl }) => rpcUrl !== error.rpcUrl),
    txBytes: error.txBytes,
    onFailure: ({ error: rebroadcastError, rpcUrl }) => {
      metrics.putMetric("RebroadcastFailure", 1, Unit.Count);
      structuredLog("WARN", "executor_rebroadcast_failed", logContext, {
        rpcUrl,
        transactionHash: error.transactionHash,
        ...errorFields(rebroadcastError),
      });
    },
  });
  structuredLog("WARN", "executor_broadcast_outcome_unknown", logContext, {
    rebroadcastAcceptedBy: acceptedBy ?? null,
    rpcUrl: error.rpcUrl,
    transactionHash: error.transactionHash,
    ...errorFields(error.cause),
  });

  return {
    rpcUrl: error.rpcUrl,
    transactionHash: error.transactionHash,
    txBytes: error.txBytes,
  };
};

const disposeResources = (resources: Resources | null) => {
  if (!resources) return;

  for (const { client } of resources.signers) {
    try {
      client.disconnect();
    } catch {
      // Best-effort cleanup. A failed disconnect must not hide the real error.
    }
  }
};

const invalidateResources = () => {
  disposeResources(cachedResources);
  cachedResources = null;
  initPromise = null;
  resourcesExpireAtMs = 0;
};

const buildResources = async (
  metrics: MetricsLogger,
  context: LambdaContext,
  logContext: LogContext
): Promise<Resources> => {
  structuredLog("INFO", "executor_initializing", logContext);

  const chain = CHAINS_BY_ID[logContext.chainId] as CosmosChain;
  const scheduler = chain.schedulerContract!;
  const secret = await secrets.send(
    new GetSecretValueCommand({ SecretId: process.env.SECRET_ARN! })
  );
  const { MNEMONIC } = JSON.parse(secret.SecretString!);
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(MNEMONIC, {
    prefix: chain.bech32AddressPrefix,
    hdPaths: [stringToPath(chain.hdPath)],
  });
  const candidates = chain.rpcUrls.map((rpcUrl) => ({ client: null, rpcUrl }));
  const selection = rpcCircuitBreaker.select(candidates, 0);

  if (selection.skippedRpcUrls.length > 0) {
    metrics.putMetric(
      "RpcCircuitSkipped",
      selection.skippedRpcUrls.length,
      Unit.Count
    );
    structuredLog("WARN", "executor_rpc_circuit_skipped", logContext, {
      forcedProbe: selection.forcedProbe,
      skippedRpcUrls: selection.skippedRpcUrls,
    });
  }
  if (selection.forcedProbe) {
    metrics.putMetric("RpcCircuitForcedProbe", 1, Unit.Count);
  }

  const signers: Signer[] = [];

  for (const { rpcUrl } of selection.endpoints) {
    const remainingTimeMs = context.getRemainingTimeInMillis();
    let timeoutMs: number;

    try {
      timeoutMs = calculateAttemptTimeoutMs({
        headroomMs: LAMBDA_TIMEOUT_HEADROOM_MS,
        maxAttemptMs: RPC_CONNECT_TIMEOUT_MS,
        minAttemptMs: RPC_MIN_ATTEMPT_MS,
        remainingTimeMs,
      });
    } catch (error) {
      metrics.putMetric("ExecutionBudgetExhausted", 1, Unit.Count);
      structuredLog("ERROR", "executor_connect_budget_exhausted", logContext, {
        remainingTimeMs,
        rpcUrl,
        ...errorFields(error),
      });
      throw error;
    }

    const startedAt = Date.now();
    metrics.putMetric("RpcConnectAttempt", 1, Unit.Count);
    structuredLog("INFO", "executor_rpc_connect_started", logContext, {
      remainingTimeMs,
      rpcUrl,
      timeoutMs,
    });

    try {
      const client = await withTimeout(
        SigningCosmWasmClient.connectWithSigner(rpcUrl, wallet),
        timeoutMs,
        () => new RpcAttemptTimeoutError(rpcUrl, timeoutMs, "connect")
      );
      signers.push({ client, rpcUrl });
      metrics.putMetric("RpcConnectSuccess", 1, Unit.Count);
      metrics.putMetric(
        "RpcConnectDuration",
        Date.now() - startedAt,
        Unit.Milliseconds
      );
      structuredLog("INFO", "executor_rpc_connect_succeeded", logContext, {
        elapsedMs: Date.now() - startedAt,
        rpcUrl,
      });
    } catch (error) {
      const category = classifyRpcFailure(error);
      const circuit = rpcCircuitBreaker.recordFailure(rpcUrl);
      putFailureCategoryMetric(metrics, category);
      metrics.putMetric("RpcConnectFailure", 1, Unit.Count);
      if (circuit.opened) {
        metrics.putMetric("RpcCircuitOpened", 1, Unit.Count);
      }
      structuredLog("ERROR", "executor_rpc_connect_failed", logContext, {
        category,
        circuitOpenUntilMs: circuit.openUntilMs,
        consecutiveFailures: circuit.consecutiveFailures,
        elapsedMs: Date.now() - startedAt,
        rpcUrl,
        ...errorFields(error),
      });
    }
  }

  if (signers.length === 0) {
    throw new Error("No available RPC URLs to connect to");
  }

  const [{ address }] = await wallet.getAccounts();
  return {
    signers,
    address,
    gasPrice: GasPrice.fromString(chain.defaultGasPrice),
    scheduler,
  };
};

const init = async (
  metrics: MetricsLogger,
  context: LambdaContext,
  logContext: LogContext
): Promise<Resources> => {
  const now = Date.now();
  if (cachedResources && now < resourcesExpireAtMs) return cachedResources;
  if (initPromise) return initPromise;

  disposeResources(cachedResources);
  cachedResources = null;

  initPromise = buildResources(metrics, context, logContext)
    .then((resources) => {
      cachedResources = resources;
      resourcesExpireAtMs = Date.now() + RESOURCE_TTL_MS;
      return resources;
    })
    .finally(() => {
      initPromise = null;
    });

  return initPromise;
};

export const handler = metricScope(
  (metrics) => async (event: ExecutorEvent, context: LambdaContext) => {
    const startedAt = Date.now();
    const chainId = process.env.CHAIN_ID!;
    const receivedTriggerIds = event.Records.map((record) => record.body);
    const triggerIds = deduplicateTriggerIds(receivedTriggerIds);
    const duplicateTriggerCount =
      receivedTriggerIds.length - triggerIds.length;
    const logContext: LogContext = {
      chainId,
      functionName: process.env.AWS_LAMBDA_FUNCTION_NAME ?? "unknown",
      requestId: context.awsRequestId,
      triggerIds,
    };

    metrics.setNamespace("Calc/Executor");
    metrics.setDimensions({
      ChainId: chainId,
      FunctionName: logContext.functionName,
    });
    metrics.setProperty("RequestId", context.awsRequestId);
    metrics.setProperty("TriggerIds", triggerIds);
    metrics.putMetric("ExecutorInvocation", 1, Unit.Count);
    if (duplicateTriggerCount > 0) {
      metrics.putMetric("DuplicateTrigger", duplicateTriggerCount, Unit.Count);
      structuredLog("WARN", "executor_duplicate_triggers_removed", logContext, {
        duplicateTriggerCount,
        receivedTriggerCount: receivedTriggerIds.length,
        uniqueTriggerCount: triggerIds.length,
      });
    }
    structuredLog("INFO", "executor_invocation_started", logContext, {
      batchSize: event.Records.length,
      duplicateTriggerCount,
      remainingTimeMs: context.getRemainingTimeInMillis(),
      uniqueTriggerCount: triggerIds.length,
    });

    try {
      const { signers, address, gasPrice, scheduler } = await init(
        metrics,
        context,
        logContext
      );
      const startIndex = preferredStartIndex(signers, preferredRpcUrl);
      const { executableTriggerIds, staleTriggerIds } =
        await preflightTriggerIds({
          context,
          logContext,
          metrics,
          scheduler,
          signers,
          startIndex,
          triggerIds,
        });

      if (executableTriggerIds.length === 0) {
        metrics.putMetric("ExecutorTransactionSkipped", 1, Unit.Count);
        metrics.putMetric("ExecutorSuccess", 1, Unit.Count);
        structuredLog("INFO", "executor_invocation_skipped", logContext, {
          elapsedMs: Date.now() - startedAt,
          reason: "no_executable_triggers",
          staleTriggerIds,
        });
        return { batchItemFailures: [] };
      }

      logContext.triggerIds = executableTriggerIds;
      metrics.setProperty("ExecutableTriggerIds", executableTriggerIds);

      const messages = [
        schedulerExecuteMessage(address, scheduler, executableTriggerIds),
      ];
      const broadcast = await executeWithRpcFailover({
        circuitBreaker: rpcCircuitBreaker,
        endpoints: signers,
        execute: (endpoint) =>
          signAndBroadcast({ address, endpoint, gasPrice, messages }),
        getRemainingTimeInMillis: () => context.getRemainingTimeInMillis(),
        headroomMs: LAMBDA_TIMEOUT_HEADROOM_MS,
        maxAttemptMs: RPC_SUBMIT_TIMEOUT_MS,
        minAttemptMs: RPC_MIN_ATTEMPT_MS,
        sequenceRetry: {
          maxRetries: SEQUENCE_MISMATCH_MAX_RETRIES,
          waitMs: BLOCK_TIME_MS,
        },
        startIndex,
        hooks: {
          onAttempt: ({ attempt, rpcUrl, timeoutMs }) => {
            metrics.putMetric("RpcExecuteAttempt", 1, Unit.Count);
            structuredLog("INFO", "executor_rpc_execute_started", logContext, {
              attempt,
              remainingTimeMs: context.getRemainingTimeInMillis(),
              rpcUrl,
              timeoutMs,
            });
          },
          onBudgetExhausted: ({ attempt, error, rpcUrl }) => {
            metrics.putMetric("ExecutionBudgetExhausted", 1, Unit.Count);
            structuredLog(
              "ERROR",
              "executor_execute_budget_exhausted",
              logContext,
              {
                attempt,
                remainingTimeMs: error.remainingTimeMs,
                rpcUrl,
                ...errorFields(error),
              }
            );
          },
          onFailure: ({
            attempt,
            category,
            circuit,
            error,
            rpcUrl,
            willRetryAnotherEndpoint,
          }) => {
            putFailureCategoryMetric(metrics, category);
            metrics.putMetric("RpcExecuteFailure", 1, Unit.Count);
            if (circuit.opened) {
              metrics.putMetric("RpcCircuitOpened", 1, Unit.Count);
            }
            structuredLog("ERROR", "executor_rpc_execute_failed", logContext, {
              ambiguousOutcome:
                category === "ambiguous_timeout" ||
                category === "ambiguous_broadcast",
              attempt,
              category,
              circuitOpenUntilMs: circuit.openUntilMs,
              consecutiveFailures: circuit.consecutiveFailures,
              rpcUrl,
              willRetryAnotherEndpoint,
              ...errorFields(error),
            });
          },
          onSequenceMismatch: ({
            attempt,
            error,
            maxRetries,
            retry,
            rpcUrl,
            waitMs,
          }) => {
            metrics.putMetric("RpcSequenceMismatch", 1, Unit.Count);
            structuredLog("WARN", "executor_rpc_sequence_mismatch", logContext, {
              attempt,
              maxRetries,
              retry,
              rpcUrl,
              waitMs,
              ...parseSequenceMismatch(error),
              ...errorFields(error),
            });
          },
          onSelection: ({ forcedProbe, skippedRpcUrls }) => {
            if (skippedRpcUrls.length > 0) {
              metrics.putMetric(
                "RpcCircuitSkipped",
                skippedRpcUrls.length,
                Unit.Count
              );
              structuredLog(
                "WARN",
                "executor_rpc_circuit_skipped",
                logContext,
                { forcedProbe, skippedRpcUrls }
              );
            }
            if (forcedProbe) {
              metrics.putMetric("RpcCircuitForcedProbe", 1, Unit.Count);
            }
          },
          onSuccess: ({ attempt, elapsedMs, rpcUrl }) => {
            preferredRpcUrl = rpcUrl;
            metrics.putMetric("RpcExecuteSuccess", 1, Unit.Count);
            metrics.putMetric(
              "RpcExecuteDuration",
              elapsedMs,
              Unit.Milliseconds
            );
            structuredLog("INFO", "executor_rpc_execute_succeeded", logContext, {
              attempt,
              elapsedMs,
              rpcUrl,
            });
          },
        },
      }).catch((error: unknown) => {
        if (!(error instanceof BroadcastOutcomeUnknownError)) throw error;
        return recoverUnknownBroadcast({ error, logContext, metrics, signers });
      });

      structuredLog("INFO", "executor_transaction_broadcast", logContext, {
        rpcUrl: broadcast.rpcUrl,
        transactionHash: broadcast.transactionHash,
      });

      const result = await awaitInclusion({
        deadlineMs:
          Date.now() +
          context.getRemainingTimeInMillis() -
          TX_POLL_HEADROOM_MS,
        // Poll where we broadcast first; other endpoints only on errors.
        endpoints: [
          ...signers.filter(({ rpcUrl }) => rpcUrl === broadcast.rpcUrl),
          ...signers.filter(({ rpcUrl }) => rpcUrl !== broadcast.rpcUrl),
        ],
        pollIntervalMs: TX_POLL_INTERVAL_MS,
        transactionHash: broadcast.transactionHash,
        onPollFailure: ({ error, rpcUrl }) => {
          metrics.putMetric("TransactionPollFailure", 1, Unit.Count);
          structuredLog("WARN", "executor_transaction_poll_failed", logContext, {
            rpcUrl,
            transactionHash: broadcast.transactionHash,
            ...errorFields(error),
          });
        },
      });

      if (!result) {
        // Acked on purpose: the tx is in a mempool and will most likely land.
        // Triggers are idempotent on-chain (the scheduler skips IDs it has
        // already deleted), and if the tx is dropped the scheduler enqueues
        // whatever is still due again.
        metrics.putMetric("TransactionPending", 1, Unit.Count);
        structuredLog("ERROR", "executor_transaction_pending", logContext, {
          elapsedMs: Date.now() - startedAt,
          rpcUrl: broadcast.rpcUrl,
          transactionHash: broadcast.transactionHash,
        });
        return { batchItemFailures: [] };
      }

      if (result.code !== 0) throw new TransactionFailedError(result);

      for (const chainEvent of result.events) {
        structuredLog("INFO", "executor_chain_event", logContext, {
          chainEvent,
        });

        if (chainEvent.type === STRATEGY_EXECUTED_EVENT) {
          const strategyAddress = chainEvent.attributes.find(
            ({ key }) => key === CONTRACT_ADDRESS_ATTRIBUTE
          )?.value;

          if (strategyAddress) {
            structuredLog("INFO", "executor_strategy_executed", logContext, {
              strategyAddress,
              transactionHash: result.hash,
            });
          }
        }
      }

      metrics.putMetric("ExecutorSuccess", 1, Unit.Count);
      structuredLog("INFO", "executor_invocation_succeeded", logContext, {
        elapsedMs: Date.now() - startedAt,
        height: result.height,
        transactionHash: result.hash,
      });
      return { batchItemFailures: [] };
    } catch (error) {
      invalidateResources();
      metrics.putMetric("ExecutorFailure", 1, Unit.Count);
      if (error instanceof AllRpcEndpointsFailedError) {
        metrics.putMetric("AllRpcEndpointsFailed", 1, Unit.Count);
      }
      if (error instanceof ExecutionBudgetExhaustedError) {
        metrics.putMetric("ExecutionBudgetExhausted", 1, Unit.Count);
      }
      if (error instanceof RpcAttemptTimeoutError) {
        metrics.putMetric("AmbiguousExecution", 1, Unit.Count);
      }
      if (error instanceof TransactionFailedError) {
        metrics.putMetric("TransactionFailed", 1, Unit.Count);
      }
      structuredLog("ERROR", "executor_invocation_failed", logContext, {
        elapsedMs: Date.now() - startedAt,
        remainingTimeMs: context.getRemainingTimeInMillis(),
        ...errorFields(error),
      });
      throw error;
    } finally {
      metrics.putMetric(
        "ExecutorDuration",
        Date.now() - startedAt,
        Unit.Milliseconds
      );
      metrics.putMetric(
        "RemainingTime",
        context.getRemainingTimeInMillis(),
        Unit.Milliseconds
      );
    }
  }
);
