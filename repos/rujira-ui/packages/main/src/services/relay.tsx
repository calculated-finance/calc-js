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
import { FC, PropsWithChildren } from "react";
import { RelayEnvironmentProvider } from "react-relay";

export const phoenixSocket = new PhoenixSocket(
  `${import.meta.env.VITE_SOCKET}/socket`,
  { params: { token: import.meta.env.VITE_API_KEY } }
);

const conn = socket.create(phoenixSocket);
const legacySubscriber = createSubscriber(conn);

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

// @absinthe/socket-relay is outdated so wrap it with a fix
const subscriber: SubscribeFunction = (request, variables, cacheConfig) => {
  return Observable.create((sink) => {
    legacySubscriber(request, variables, cacheConfig, {
      onNext: (v: GraphQLResponse) => {
        const transformed = transformBigInts(v);
        logGraphQLErrors(transformed, `Subscription: ${request.name}`);
        sink.next(transformed);
      },
      onError: sink.error,
      onCompleted: sink.complete,
    });
  });
};

const fetcher = createFetcher(conn);
const wrapper: FetchFunction = (request, variables, cacheConfig) => {
  return fetcher(request, variables, cacheConfig).then(
    (response: GraphQLResponse) => {
      const transformed = transformBigInts(response);
      logGraphQLErrors(transformed, `Query: ${request.name}`);
      return transformed;
    }
  );
};
const network = Network.create(wrapper, subscriber);
const store = new Store(new RecordSource());
export const environment = new Environment({ store, network });

export const RelayContext: FC<PropsWithChildren> = ({ children }) => (
  <RelayEnvironmentProvider environment={environment}>
    {children}
  </RelayEnvironmentProvider>
);
