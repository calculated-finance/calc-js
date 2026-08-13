export type RpcEndpoint<T> = {
  client: T;
  rpcUrl: string;
};

type CircuitState = {
  consecutiveFailures: number;
  openUntilMs: number;
};

export type CircuitFailure = CircuitState & {
  opened: boolean;
};

export type CircuitSelection<T> = {
  endpoints: RpcEndpoint<T>[];
  forcedProbe: boolean;
  skippedRpcUrls: string[];
};

export class RpcAttemptTimeoutError extends Error {
  readonly phase: "connect" | "execute";
  readonly rpcUrl: string;
  readonly timeoutMs: number;

  constructor(
    rpcUrl: string,
    timeoutMs: number,
    phase: "connect" | "execute" = "execute"
  ) {
    super(`RPC ${phase} attempt to ${rpcUrl} exceeded ${timeoutMs}ms`);
    this.name = "RpcAttemptTimeoutError";
    this.phase = phase;
    this.rpcUrl = rpcUrl;
    this.timeoutMs = timeoutMs;
  }
}

export class ExecutionBudgetExhaustedError extends Error {
  readonly remainingTimeMs: number;

  constructor(remainingTimeMs: number) {
    super(
      `Not enough Lambda execution time remains to start another RPC attempt (${remainingTimeMs}ms)`
    );
    this.name = "ExecutionBudgetExhaustedError";
    this.remainingTimeMs = remainingTimeMs;
  }
}

export class AllRpcEndpointsFailedError extends Error {
  readonly cause: unknown;

  constructor(cause: unknown) {
    super("All RPC endpoints failed to execute the transaction");
    this.name = "AllRpcEndpointsFailedError";
    this.cause = cause;
  }
}

export class RpcCircuitBreaker {
  private readonly states = new Map<string, CircuitState>();

  constructor(
    private readonly options: {
      cooldownMs: number;
      failureThreshold: number;
      now?: () => number;
    }
  ) {}

  private now() {
    return this.options.now?.() ?? Date.now();
  }

  select<T>(
    endpoints: RpcEndpoint<T>[],
    startIndex: number
  ): CircuitSelection<T> {
    if (endpoints.length === 0) {
      return { endpoints: [], forcedProbe: false, skippedRpcUrls: [] };
    }

    const normalizedStart =
      ((startIndex % endpoints.length) + endpoints.length) % endpoints.length;
    const rotated = [
      ...endpoints.slice(normalizedStart),
      ...endpoints.slice(0, normalizedStart),
    ];
    const now = this.now();
    const available = rotated.filter(
      ({ rpcUrl }) => (this.states.get(rpcUrl)?.openUntilMs ?? 0) <= now
    );

    if (available.length > 0) {
      const availableUrls = new Set(available.map(({ rpcUrl }) => rpcUrl));
      return {
        endpoints: available,
        forcedProbe: false,
        skippedRpcUrls: rotated
          .filter(({ rpcUrl }) => !availableUrls.has(rpcUrl))
          .map(({ rpcUrl }) => rpcUrl),
      };
    }

    const probe = rotated.reduce((earliest, endpoint) => {
      const earliestOpenUntil =
        this.states.get(earliest.rpcUrl)?.openUntilMs ?? Number.POSITIVE_INFINITY;
      const endpointOpenUntil =
        this.states.get(endpoint.rpcUrl)?.openUntilMs ?? Number.POSITIVE_INFINITY;
      return endpointOpenUntil < earliestOpenUntil ? endpoint : earliest;
    });

    return {
      endpoints: [probe],
      forcedProbe: true,
      skippedRpcUrls: rotated
        .filter(({ rpcUrl }) => rpcUrl !== probe.rpcUrl)
        .map(({ rpcUrl }) => rpcUrl),
    };
  }

  recordFailure(
    rpcUrl: string,
    options: { openImmediately?: boolean } = {}
  ): CircuitFailure {
    const previous = this.states.get(rpcUrl) ?? {
      consecutiveFailures: 0,
      openUntilMs: 0,
    };
    const consecutiveFailures = previous.consecutiveFailures + 1;
    const opened =
      options.openImmediately === true ||
      consecutiveFailures >= this.options.failureThreshold;
    const next = {
      consecutiveFailures,
      openUntilMs: opened
        ? this.now() + this.options.cooldownMs
        : previous.openUntilMs,
    };
    this.states.set(rpcUrl, next);
    return { ...next, opened };
  }

  recordSuccess(rpcUrl: string) {
    this.states.delete(rpcUrl);
  }

  getState(rpcUrl: string): Readonly<CircuitState> | undefined {
    const state = this.states.get(rpcUrl);
    return state ? { ...state } : undefined;
  }
}

export const errorMessage = (error: unknown) =>
  error instanceof Error ? error.message : String(error);

export const deduplicateTriggerIds = (triggerIds: readonly string[]) => [
  ...new Set(triggerIds),
];

export type RpcFailureCategory =
  | "ambiguous_timeout"
  | "connect_timeout"
  | "http_502"
  | "http_5xx"
  | "rpc_reported_chain_halted"
  | "rpc_error";

export const classifyRpcFailure = (error: unknown): RpcFailureCategory => {
  if (error instanceof RpcAttemptTimeoutError) {
    return error.phase === "connect" ? "connect_timeout" : "ambiguous_timeout";
  }

  const message = errorMessage(error);
  if (message.includes("THORChain is halted")) {
    return "rpc_reported_chain_halted";
  }
  if (/\b502\b/.test(message)) return "http_502";
  if (/\b5\d\d\b/.test(message)) return "http_5xx";
  return "rpc_error";
};

export const calculateAttemptTimeoutMs = (options: {
  headroomMs: number;
  maxAttemptMs: number;
  minAttemptMs: number;
  remainingTimeMs: number;
}) => {
  const availableMs = options.remainingTimeMs - options.headroomMs;
  if (availableMs < options.minAttemptMs) {
    throw new ExecutionBudgetExhaustedError(options.remainingTimeMs);
  }
  return Math.min(options.maxAttemptMs, availableMs);
};

export const withTimeout = async <A>(
  operation: Promise<A>,
  timeoutMs: number,
  onTimeout: () => Error
): Promise<A> => {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeout = setTimeout(() => reject(onTimeout()), timeoutMs);
  });

  try {
    return await Promise.race([operation, timeoutPromise]);
  } finally {
    if (timeout !== undefined) clearTimeout(timeout);
  }
};

type FailoverHooks = {
  onAttempt?: (details: {
    attempt: number;
    rpcUrl: string;
    timeoutMs: number;
  }) => void;
  onBudgetExhausted?: (details: {
    attempt: number;
    error: ExecutionBudgetExhaustedError;
    rpcUrl: string;
  }) => void;
  onFailure?: (details: {
    attempt: number;
    category: RpcFailureCategory;
    circuit: CircuitFailure;
    error: unknown;
    rpcUrl: string;
    willRetryAnotherEndpoint: boolean;
  }) => void;
  onSelection?: (details: {
    forcedProbe: boolean;
    skippedRpcUrls: string[];
  }) => void;
  onSuccess?: (details: {
    attempt: number;
    elapsedMs: number;
    rpcUrl: string;
  }) => void;
};

export const executeWithRpcFailover = async <T, A>(options: {
  circuitBreaker: RpcCircuitBreaker;
  endpoints: RpcEndpoint<T>[];
  execute: (endpoint: RpcEndpoint<T>) => Promise<A>;
  getRemainingTimeInMillis: () => number;
  headroomMs: number;
  hooks?: FailoverHooks;
  maxAttemptMs: number;
  minAttemptMs: number;
  now?: () => number;
  startIndex: number;
}): Promise<A> => {
  const selection = options.circuitBreaker.select(
    options.endpoints,
    options.startIndex
  );
  options.hooks?.onSelection?.({
    forcedProbe: selection.forcedProbe,
    skippedRpcUrls: selection.skippedRpcUrls,
  });

  let lastError: unknown;

  for (let index = 0; index < selection.endpoints.length; index++) {
    const endpoint = selection.endpoints[index];
    const attempt = index + 1;
    let timeoutMs: number;

    try {
      timeoutMs = calculateAttemptTimeoutMs({
        headroomMs: options.headroomMs,
        maxAttemptMs: options.maxAttemptMs,
        minAttemptMs: options.minAttemptMs,
        remainingTimeMs: options.getRemainingTimeInMillis(),
      });
    } catch (error) {
      if (error instanceof ExecutionBudgetExhaustedError) {
        options.hooks?.onBudgetExhausted?.({
          attempt,
          error,
          rpcUrl: endpoint.rpcUrl,
        });
      }
      throw error;
    }

    options.hooks?.onAttempt?.({ attempt, rpcUrl: endpoint.rpcUrl, timeoutMs });
    const startedAt = options.now?.() ?? Date.now();

    try {
      const result = await withTimeout(
        options.execute(endpoint),
        timeoutMs,
        () => new RpcAttemptTimeoutError(endpoint.rpcUrl, timeoutMs)
      );
      options.circuitBreaker.recordSuccess(endpoint.rpcUrl);
      options.hooks?.onSuccess?.({
        attempt,
        elapsedMs: (options.now?.() ?? Date.now()) - startedAt,
        rpcUrl: endpoint.rpcUrl,
      });
      return result;
    } catch (error) {
      lastError = error;
      const timedOut = error instanceof RpcAttemptTimeoutError;
      const category = classifyRpcFailure(error);
      const circuit = options.circuitBreaker.recordFailure(endpoint.rpcUrl, {
        // An execute timeout consumes nearly the entire Lambda budget and has
        // an ambiguous broadcast outcome. Avoid selecting the same endpoint
        // again on the next warm-container invocation.
        openImmediately: timedOut,
      });
      options.hooks?.onFailure?.({
        attempt,
        category,
        circuit,
        error,
        rpcUrl: endpoint.rpcUrl,
        willRetryAnotherEndpoint:
          !timedOut && index + 1 < selection.endpoints.length,
      });

      // A client-side timeout can happen after a transaction was broadcast.
      // Do not submit through another endpoint in the same invocation. The
      // scheduler contract ignores trigger IDs already deleted by a successful
      // execution, so the SQS retry can safely resolve the ambiguous outcome.
      if (timedOut) throw error;
    }
  }

  throw new AllRpcEndpointsFailedError(lastError);
};
