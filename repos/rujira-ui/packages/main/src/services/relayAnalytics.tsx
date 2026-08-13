import {
  Environment,
  FetchFunction,
  GraphQLResponse,
  Network,
  Observable,
  RecordSource,
  Store,
  SubscribeFunction,
} from "relay-runtime";

import * as socket from "@absinthe/socket";
// @ts-ignore no types
import { createFetcher, createSubscriber } from "@absinthe/socket-relay";
import { Socket as PhoenixSocket } from "phoenix";
import { FC, PropsWithChildren, useSyncExternalStore } from "react";
import { RelayEnvironmentProvider } from "react-relay";

const transformBigInts = (data: any): any => {
  // Check if it's a BigInt string (you might need to adjust this logic)
  // This is a simple heuristic - you could also use field metadata
  if (typeof data === "string" && /^\d+$/.test(data)) return BigInt(data);

  if (data === null || data === undefined) return data;
  if (Array.isArray(data)) return data.map(transformBigInts);

  if (typeof data === "object") {
    const transformed: any = {};
    for (const [key, value] of Object.entries(data)) {
      transformed[key] = transformBigInts(value);
    }
    return transformed;
  }

  return data;
};

const QUERY_TIMEOUT_MS = 10_000;

const withTimeout = <T,>(promise: Promise<T>, ms: number): Promise<T> =>
  new Promise((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error(`Analytics query timed out after ${ms}ms`)),
      ms
    );
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      }
    );
  });

const logGraphQLErrors = (response: GraphQLResponse, source: string) => {
  if ("errors" in response && response.errors && response.errors.length > 0) {
    response.errors.forEach((error, index) => {
      console.error(
        `[Relay ${source}] Error ${index}:`,
        JSON.stringify({
          message: error.message,
          locations: error.locations,
          path: error.path,
        })
      );
    });
  }
};

export type AnalyticsConnectionStatus = "connecting" | "open" | "error";

let connectionStatus: AnalyticsConnectionStatus = "connecting";
const connectionListeners = new Set<() => void>();

const setConnectionStatus = (next: AnalyticsConnectionStatus) => {
  if (next === connectionStatus) return;
  connectionStatus = next;
  connectionListeners.forEach((listener) => listener());
};

const subscribeConnection = (listener: () => void) => {
  connectionListeners.add(listener);
  return () => {
    connectionListeners.delete(listener);
  };
};

const getConnectionStatus = () => connectionStatus;

export const useAnalyticsConnection = (): AnalyticsConnectionStatus =>
  useSyncExternalStore(subscribeConnection, getConnectionStatus);

export const retryAnalyticsConnection = () => {
  setConnectionStatus("connecting");
  const socket = analyticsSocket;
  if (!socket) return;
  socket.disconnect(() => socket.connect());
};

// Created lazily on first use so pages that never query analytics data never open this socket.
let analyticsEnvironment: Environment | undefined;
let analyticsSocket: PhoenixSocket | undefined;

const createAnalyticsEnvironment = (): Environment => {
  const phoenixSocket = new PhoenixSocket(
    `${import.meta.env.VITE_ANALYTICS_SOCKET}/socket`,
    { params: { token: import.meta.env.VITE_API_KEY } }
  );
  analyticsSocket = phoenixSocket;

  phoenixSocket.onOpen(() => setConnectionStatus("open"));

  phoenixSocket.onError((e: unknown) => {
    console.error("[Analytics] socket error", e);
    setConnectionStatus("error");
  });

  const conn = socket.create(phoenixSocket);
  const legacySubscriber = createSubscriber(conn);

  // @absinthe/socket-relay is outdated so wrap it with a fix
  const subscriber: SubscribeFunction = (request, variables, cacheConfig) => {
    return Observable.create((sink) => {
      legacySubscriber(request, variables, cacheConfig, {
        onNext: (v: GraphQLResponse) => {
          const transformed = transformBigInts(v);
          logGraphQLErrors(
            transformed,
            `Analytics Subscription: ${request.name}`
          );
          sink.next(transformed);
        },
        onError: sink.error,
        onCompleted: sink.complete,
      });
    });
  };

  const fetcher = createFetcher(conn);
  const wrapper: FetchFunction = (request, variables, cacheConfig) => {
    return withTimeout<GraphQLResponse>(
      fetcher(request, variables, cacheConfig),
      QUERY_TIMEOUT_MS
    ).then((response: GraphQLResponse) => {
      const transformed = transformBigInts(response);
      logGraphQLErrors(transformed, `Analytics Query: ${request.name}`);
      return transformed;
    });
  };

  const network = Network.create(wrapper, subscriber);
  const store = new Store(new RecordSource());
  return new Environment({ store, network });
};

export const getAnalyticsEnvironment = (): Environment => {
  if (!analyticsEnvironment) {
    analyticsEnvironment = createAnalyticsEnvironment();
  }
  return analyticsEnvironment;
};

export const AnalyticsRelayProvider: FC<PropsWithChildren> = ({ children }) => (
  <RelayEnvironmentProvider environment={getAnalyticsEnvironment()}>
    {children}
  </RelayEnvironmentProvider>
);
