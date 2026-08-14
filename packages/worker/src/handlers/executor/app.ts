import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from "@aws-sdk/client-secrets-manager";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
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
  calculateAttemptTimeoutMs,
  classifyRpcFailure,
  deduplicateTriggerIds,
  errorMessage,
  executeWithRpcFailover,
  ExecutionBudgetExhaustedError,
  RpcAttemptTimeoutError,
  RpcCircuitBreaker,
  type RpcFailureCategory,
  withTimeout,
} from "./resilience.js";

const RPC_CONNECT_TIMEOUT_MS = 5_000;
const RPC_EXECUTE_TIMEOUT_MS = 50_000;
const RPC_MIN_ATTEMPT_MS = 3_000;
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

// Rotating start index so a persistently-flaky endpoint does not penalize
// every call. Module scope persists across warm Lambda invocations.
let rrCursor = 0;

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
  } else if (category === "rpc_reported_chain_halted") {
    // Telemetry only. A halt response from one RPC is not treated as proof
    // that every configured RPC observes a chain-wide halt.
    metrics.putMetric("RpcReportedChainHalted", 1, Unit.Count);
  }
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
        SigningCosmWasmClient.connectWithSigner(rpcUrl, wallet, {
          gasPrice: GasPrice.fromString(chain.defaultGasPrice),
        }),
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
  return { signers, address, scheduler };
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
      const { signers, address, scheduler } = await init(
        metrics,
        context,
        logContext
      );
      const startIndex = rrCursor;
      rrCursor = (rrCursor + 1) % signers.length;

      const result = await executeWithRpcFailover({
        circuitBreaker: rpcCircuitBreaker,
        endpoints: signers,
        execute: ({ client }) =>
          client.execute(
            address,
            scheduler,
            { execute: triggerIds },
            "auto"
          ),
        getRemainingTimeInMillis: () => context.getRemainingTimeInMillis(),
        headroomMs: LAMBDA_TIMEOUT_HEADROOM_MS,
        maxAttemptMs: RPC_EXECUTE_TIMEOUT_MS,
        minAttemptMs: RPC_MIN_ATTEMPT_MS,
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
              ambiguousOutcome: category === "ambiguous_timeout",
              attempt,
              category,
              circuitOpenUntilMs: circuit.openUntilMs,
              consecutiveFailures: circuit.consecutiveFailures,
              rpcUrl,
              willRetryAnotherEndpoint,
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
      });

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
              transactionHash: result.transactionHash,
            });
          }
        }
      }

      metrics.putMetric("ExecutorSuccess", 1, Unit.Count);
      structuredLog("INFO", "executor_invocation_succeeded", logContext, {
        elapsedMs: Date.now() - startedAt,
        transactionHash: result.transactionHash,
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
