import { Buffer } from "buffer";
import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
  useTransition,
} from "react";
import {
  PreloadedQuery,
  usePreloadedQuery,
  useQueryLoader,
  useRelayEnvironment,
} from "react-relay";
import { graphql, requestSubscription } from "relay-runtime";
import { Network, PendingDeposit } from "rujira.js";
import { depositsQuery } from "./__generated__/depositsQuery.graphql";

const KEY = `rujira-pending-deposits-${import.meta.env.MODE}`;

interface StoredDeposit {
  hash: string;
  timestamp: string;
  network: Network;
  coin: {
    amount: number;
    symbol: string;
  };
}

type SetDeposit = (v: {
  hash: string;
  timestamp: Date;
  network: Network;
  coin: {
    amount: bigint;
    symbol: string;
  };
}) => void;

type ClearDeposit = (hash: string) => void;
type ClearAllDeposit = () => void;

const load = (): StoredDeposit[] =>
  JSON.parse(localStorage.getItem(KEY) || "[]");

const store = (xs: StoredDeposit[]) =>
  localStorage.setItem(
    KEY,
    JSON.stringify(
      xs.map((x) => ({
        ...x,
        coin: { ...x.coin, amount: Number(x.coin.amount) },
      }))
    )
  );

const DEFAULT = {
  deposits: [],
  setDeposit: () => {
    throw new Error("setDeposit not implemented");
  },
  clearDeposit: () => {
    throw new Error("clearDeposit not implemented");
  },
  clearAllDeposits: () => {
    throw new Error("clearAllDeposits not implemented");
  },
};

const storeContext = createContext<{
  deposits: StoredDeposit[];
  setDeposit: SetDeposit;
  clearDeposit: ClearDeposit;
  clearAllDeposits: ClearAllDeposit;
}>(DEFAULT);

const queryContext = createContext<{
  q: PreloadedQuery<depositsQuery>;
}>({ q: undefined as unknown as PreloadedQuery<depositsQuery> });

export const PendingDepositStorageContext: FC<PropsWithChildren> = ({
  children,
}) => {
  const [stored, setStored] = useState<StoredDeposit[]>(load());
  const setDeposit: SetDeposit = (d) => {
    setStored((prev) => {
      const next = [
        ...prev,
        {
          ...d,
          timestamp: d.timestamp.toISOString(),
          coin: { ...d.coin, amount: Number(d.coin.amount) },
        },
      ];
      store(next);
      return next;
    });
  };

  const clearDeposit: ClearDeposit = (hash) =>
    setStored((prev) => {
      const next = prev.filter((x) => x.hash !== hash);
      store(next);
      return next;
    });

  const clearAllDeposits = () => {
    setStored([]);
    store([]);
  };

  return (
    <storeContext.Provider
      value={{ deposits: stored, setDeposit, clearAllDeposits, clearDeposit }}>
      {children}
    </storeContext.Provider>
  );
};

const query = graphql`
  query depositsQuery($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on ThorchainTxIn {
        id
        finalizedHeight
        finalizedEvents {
          type
          attributes {
            key
            value
          }
        }
      }
    }
  }
`;

const subscription = graphql`
  subscription depositsSubscription($id: ID!) {
    node(id: $id) {
      ... on ThorchainTxIn {
        id
        finalizedHeight
        finalizedEvents {
          type
          attributes {
            key
            value
          }
        }
      }
    }
  }
`;

export const PendingDepositLoadedContext: FC<PropsWithChildren> = ({
  children,
}) => {
  const storage = useContext(storeContext);

  const [, transition] = useTransition();
  const [q, loadQuery] = useQueryLoader<depositsQuery>(query);
  const env = useRelayEnvironment();

  useEffect(() => {
    const ids = storage.deposits.map(toId);
    transition(() => {
      loadQuery({ ids }, { fetchPolicy: "store-and-network" });
    });
    const subs = ids.map((id) =>
      requestSubscription(env, {
        subscription,
        variables: { id },
      })
    );

    return () => {
      subs.forEach((s) => s.dispose());
    };
  }, [storage.deposits]);

  return q ? (
    <queryContext.Provider value={{ q }}>{children}</queryContext.Provider>
  ) : null;
};

export const usePendingDepositStore = (): [
  SetDeposit,
  ClearDeposit,
  ClearAllDeposit,
] => {
  const value = useContext(storeContext);
  return [value.setDeposit, value.clearDeposit, value.clearAllDeposits];
};

export const usePreloadedPendingDeposits = (): [
  PendingDeposit[],
  SetDeposit,
  ClearDeposit,
  ClearAllDeposit,
] => {
  const { q } = useContext(queryContext);
  const data = usePreloadedQuery<depositsQuery>(query, q);
  const storage = useContext(storeContext);

  const deposits = storage.deposits
    .map((s) => {
      const found = data.nodes.find((a) => a && a.id === toId(s));
      const refundEvent = found?.finalizedEvents?.find(
        (x) => x.type === "refund"
      );
      const item: PendingDeposit = {
        ...s,
        timestamp: new Date(s.timestamp),
        coin: {
          symbol: s.coin.symbol,
          amount: BigInt(s.coin.amount),
        },
        status: found?.finalizedHeight
          ? refundEvent
            ? refundEvent.attributes.find((x) =>
                x.value.includes("fail to refund")
              )
              ? "failed"
              : "refunded"
            : "succeeded"
          : "pending",
        message: found?.finalizedEvents
          ?.at(0)
          ?.attributes.find((a) => a.key === "reason")?.value,
      };
      return item;
    })
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return [
    deposits,
    storage.setDeposit,
    storage.clearDeposit,
    storage.clearAllDeposits,
  ];
};

const toId = (x: { hash: string }) =>
  Buffer.from(
    `ThorchainTxIn:${x.hash.replace("0x", "").toUpperCase()}`
  ).toString("base64");
