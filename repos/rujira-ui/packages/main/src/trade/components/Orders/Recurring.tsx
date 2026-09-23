import clsx from "clsx";
import { formatDuration, intervalToDuration } from "date-fns";
import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import toast from "react-hot-toast";
import { graphql, useFragment, useLazyLoadQuery } from "react-relay";
import { Link, useLocation } from "react-router-dom";
import { Account, Asset, MsgExecute } from "rujira.js";
import {
  Button,
  Decimal,
  DenomInput,
  IconDenom,
  Input,
  Numeric,
  Progress,
  Toggle,
  TranslationProvider,
  useGlobalModalContext,
  useIsTouchDevice,
  useQueryParam,
  useTranslation,
} from "rujira.ui";

import { Icons } from "rujira.ui";
import { BalanceProvider } from "../../../common/components/Balance";
import { MsgProvider, TxButton } from "../../../common/components/TxButton";
import { usePreloadedAccountData } from "../../../services/accountData";
import { useAccounts } from "../../../services/accounts";
import { assetToTradeUrlSegment } from "../../../services/assetUrl";
import { Subscription } from "../../../services/useNodeSubscription";
import {
  removeDeprecatedTradeParams,
  searchFromParams,
} from "../../tradeUrlState";
import { Side } from "../../types";
import { adjust, formatExecutionDuration } from "../../utils";
import { useCalcMetadata } from "../Calc";
import { useTradeContext } from "../Context";
import { InputQuantity } from "../InputQuantity";
import { SwapMultiplierCarousel } from "../Submit/Recurring";
import {
  RecurringOrdersAccountFragment$data,
  RecurringOrdersAccountFragment$key,
} from "./__generated__/RecurringOrdersAccountFragment.graphql";
import {
  RecurringOrdersFragment$data,
  RecurringOrdersFragment$key,
} from "./__generated__/RecurringOrdersFragment.graphql";
import { RecurringOrdersLatestBlockQuery } from "./__generated__/RecurringOrdersLatestBlockQuery.graphql";
import {
  RecurringOrdersPairFragment$data,
  RecurringOrdersPairFragment$key,
} from "./__generated__/RecurringOrdersPairFragment.graphql";
import { Nav } from "./Common";
import { useOrdersContext } from "./Context";

const pairFragment = graphql`
  fragment RecurringOrdersPairFragment on FinPair {
    address
    assetQuote {
      metadata {
        symbol
      }
      chain
      type
    }
    assetBase {
      metadata {
        symbol
      }
      chain
      type
    }
    tick
    book {
      center
      bids {
        price
      }
      asks {
        price
      }
    }
  }
`;

const orderFragment = graphql`
  fragment RecurringOrdersFragment on CalcOrder {
    id
    address
    label
    status
    source
    createdAt
    updatedAt
    owner
    balances {
      asset {
        type
        chain
        metadata {
          symbol
          decimals
        }
        variants {
          native {
            denom
          }
          secured {
            type
            chain
            metadata {
              symbol
              decimals
            }
            variants {
              native {
                denom
              }
            }
          }
        }
      }
      amount
    }
    config {
      nodes {
        __typename
        ... on CalcAction {
          next
          action {
            __typename
            ... on CalcActionDistribute {
              denoms
              destinations {
                shares
                label
                recipient {
                  __typename
                  ... on CalcRecipientBank {
                    address
                  }
                  ... on CalcRecipientContract {
                    address
                    msg
                  }
                  ... on CalcRecipientDeposit {
                    memo
                  }
                }
              }
            }
            ... on CalcActionSwap {
              swapAmount {
                asset {
                  type
                  chain
                  asset
                  metadata {
                    decimals
                    symbol
                  }
                  variants {
                    native {
                      denom
                    }
                    secured {
                      asset
                      type
                      chain
                      metadata {
                        symbol
                        decimals
                      }
                      variants {
                        native {
                          denom
                        }
                      }
                    }
                  }
                }
                amount
              }
              minimumReceiveAmount {
                asset {
                  type
                  chain
                  asset
                  metadata {
                    decimals
                    symbol
                  }
                  variants {
                    native {
                      denom
                    }
                    secured {
                      asset
                      type
                      chain
                      metadata {
                        symbol
                        decimals
                      }
                      variants {
                        native {
                          denom
                        }
                      }
                    }
                  }
                }
                amount
              }
              adjustment {
                __typename
                ... on CalcSwapAmountAdjustmentFixed {
                  kind
                }
                ... on CalcSwapAmountAdjustmentLinearScalar {
                  baseReceiveAmount {
                    amount
                    asset {
                      variants {
                        native {
                          denom
                        }
                      }
                    }
                  }
                  scalar
                }
              }
              routes {
                __typename
                ... on CalcSwapRouteFin {
                  pair {
                    ...RecurringOrdersPairFragment
                  }
                }
                ... on CalcSwapRouteThorchain {
                  affiliateCode
                  affiliateBps
                }
              }
              maximumSlippageBps
            }
          }
        }
        ... on CalcCondition {
          condition {
            __typename
            ... on CalcConditionTimestampElapsed {
              timestamp
            }
            ... on CalcConditionSchedule {
              cadence {
                __typename
                ... on CalcCadenceCron {
                  expr
                  previousTime: previous
                }
                ... on CalcCadenceTime {
                  duration
                  previousTime: previous
                }
                ... on CalcCadenceBlocks {
                  interval
                  previousBlock: previous
                }
              }
              executors
              executions
              jitter
            }
            ... on CalcConditionBalanceAvailable {
              address
              amount {
                amount
                asset {
                  metadata {
                    symbol
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

const accountFragment = graphql`
  fragment RecurringOrdersAccountFragment on Account {
    fin {
      ordersV2(first: 100)
        @connection(key: "TradeSubscriptionsFragment_ordersV2") {
        edges {
          node {
            __typename
            ... on CalcOrder {
              id
              source
              status
              balances {
                amount
              }
              config {
                nodes {
                  __typename
                  ... on CalcAction {
                    action {
                      __typename
                      ... on CalcActionSwap {
                        routes {
                          __typename
                          ... on CalcSwapRouteFin {
                            pairAddress
                          }
                        }
                      }
                    }
                  }
                }
              }
              ...RecurringOrdersFragment
            }
          }
        }
      }
    }
  }
`;

type RecurringOrdersData = {
  active: CalcOrderNode[];
  paused: CalcOrderNode[];
  completed: CalcOrderNode[];
  total: number;
};

type CalcOrderNode = Extract<
  NonNullable<
    NonNullable<
      NonNullable<
        NonNullable<RecurringOrdersAccountFragment$data["fin"]>["ordersV2"]
      >["edges"]
    >[number]
  >["node"],
  { __typename: "CalcOrder" }
>;

export const useRecurringOrdersData = (): RecurringOrdersData => {
  const { accountData } = usePreloadedAccountData();
  const { only } = useOrdersContext();
  const { address } = useTradeContext();
  const d = useFragment<RecurringOrdersAccountFragment$key>(
    accountFragment,
    accountData
  );

  return useMemo(() => {
    const recurring =
      d?.fin?.ordersV2?.edges
        ?.map((o) => o?.node)
        .filter(
          (node): node is CalcOrderNode =>
            !!node && node.__typename === "CalcOrder" && node.source === "rj"
        )
        .filter(
          (o) =>
            !only ||
            !!o.config.nodes?.some(
              (n) =>
                n.__typename === "CalcAction" &&
                n.action.__typename === "CalcActionSwap" &&
                n.action.routes?.some(
                  (r) =>
                    r.__typename === "CalcSwapRouteFin" &&
                    r.pairAddress === address
                )
            )
        ) || [];

    const active = recurring.filter(
      ({ status, balances }) =>
        status === "ACTIVE" && balances?.some((b) => BigInt(b?.amount) > 10n)
    );
    const paused = recurring.filter(({ status }) => status === "PAUSED");
    const completed = recurring.filter(
      ({ status, balances }) =>
        status === "ACTIVE" && balances?.every((b) => BigInt(b?.amount) < 10n)
    );
    return {
      active,
      paused,
      completed,
      total: recurring.length,
    };
  }, [d, only, address]);
};

const orderSubscription = graphql`
  subscription RecurringOrdersOrderUpdatedSubscription($id: ID!) {
    node(id: $id) {
      ...RecurringOrdersFragment
    }
  }
`;

const blockSubscription = graphql`
  subscription RecurringOrdersThorchainBlockSubscription($id: ID!) {
    node(id: $id) {
      ... on ThorchainBlock {
        header {
          height
          time
        }
      }
    }
  }
`;

const blockSubscriptionId = btoa("ThorchainBlock:latest");

const latestBlockQuery = graphql`
  query RecurringOrdersLatestBlockQuery($id: ID!) {
    node(id: $id) {
      ... on ThorchainBlock {
        id
        header {
          height
          time
        }
      }
    }
  }
`;

export type RemovableColumn = "Time Remaining" | "Next Execution";

type TableProps = {
  expanded?: boolean;
  hide?: RemovableColumn[];
  orders: CalcOrderNode[];
};

enum Tab {
  Active = "active",
  Paused = "paused",
  Completed = "completed",
}

const context = createContext<{
  tab: Tab;
  setTab: (v: Tab) => void;
}>({
  tab: Tab.Active,
  setTab: () => {},
});

export const Context: FC<PropsWithChildren> = ({ children }) => {
  const [tab, setTab] = useQueryParam<Tab>("orders-sub-recurring", Tab.Active);
  return (
    <context.Provider value={{ tab, setTab }}>{children}</context.Provider>
  );
};

export const Tabs: FC<{ data?: RecurringOrdersData }> = ({ data }) => {
  const { tab, setTab } = useContext(context);

  return (
    <Nav
      tab={tab}
      setTab={setTab}
      tabs={[
        { value: Tab.Active, count: data?.active.length || 0 },
        { value: Tab.Paused, count: data?.paused.length || 0 },
        { value: Tab.Completed, count: data?.completed.length || 0 },
      ]}
    />
  );
};

export const Content: FC = () => {
  const { tab } = useContext(context);
  const { active, paused, completed } = useRecurringOrdersData();

  switch (tab) {
    case Tab.Active:
      return <Table orders={active} />;
    case Tab.Paused:
      return <Table orders={paused} />;
    case Tab.Completed:
      return <Table orders={completed} />;
  }
};

export const Table: FC<TableProps> = ({ expanded, hide, orders }) => {
  const { t } = useTranslation();
  const isTouchDevice = useIsTouchDevice();

  return (
    <div className="trade__orders-table table-sticky table-sticky--left table-sticky--right mt-2">
      {orders?.length ? (
        <>
          <Subscription
            id={blockSubscriptionId}
            subscription={blockSubscription}
          />
          <table
            className={clsx("table", {
              "table--big condensed portfolio__balances": !!expanded,
              "nowrap table--spaced": !expanded,
              "table--no-hover": isTouchDevice,
            })}>
            <thead>
              <tr>
                <th className="w-20">{t("pair")}</th>
                {expanded && <th className="text-center">{t("status")}</th>}
                <th className="w-16">{t("progress")}</th>
                {!hide?.includes("Time Remaining") && (
                  <th className="text-center nowrap">{t("timeRemaining")}</th>
                )}
                <th className="text-center nowrap">{t("every")}</th>
                {!hide?.includes("Next Execution") && (
                  <th className="text-center nowrap">{t("nextExecution")}</th>
                )}
                <th className="text-right nowrap">{t("swapAmount")}</th>
                <th className="text-right nowrap">{t("priceImpact")}</th>
                <th className="text-right nowrap">{t("priceLimit")}</th>
                <th className="text-center nowrap">{t("routes")}</th>
                <th className="text-center nowrap">{t("swapMultiplier")}</th>
                <th className="text-right nowrap">{t("remaining")}</th>
                <th className="text-right nowrap">{t("unclaimed")}</th>
                <th className="nowrap w-14"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((ks) => (
                <RecurringOrderItem
                  key={ks.id}
                  k={ks}
                  expanded={!!expanded}
                  hide={hide}
                />
              ))}
            </tbody>
          </table>{" "}
        </>
      ) : (
        <p className="condensed fs-14 color-grey text-center mt-2">
          {t("noRecurringOrders")}
        </p>
      )}
    </div>
  );
};

export const UnknownRecurringOrderItem: FC<{
  ks: RecurringOrdersFragment$key;
  manager: string;
  expanded: boolean;
  hide?: RemovableColumn[];
}> = ({ ks, manager, expanded, hide }) => {
  const { t } = useTranslation();
  const order = useFragment(orderFragment, ks);
  const { showModal, hideModal } = useGlobalModalContext();
  const { selected } = useAccounts();

  const hasBalances = order.balances && order.balances.length > 0;

  const confirmWithdraw = () => {
    showModal({
      backgroundClose: false,
      hideCloseButton: true,
      children: (
        <TranslationProvider namespace="trade">
          <WithdrawModal hideModal={hideModal} k={ks} />
        </TranslationProvider>
      ),
    });
  };

  return (
    <tr>
      <td>
        <div className="flex dir-r jc-s gap-0.5">
          <span className="fw-500 nowrap">{order.label}</span>
        </div>
      </td>
      {expanded && (
        <td className="text-center">
          <LabelStatus {...order} />
        </td>
      )}
      {expanded && <td className="text-center">-</td>}
      <td className="text-center"></td>
      {!hide?.includes("Time Remaining") && <td className="text-center"></td>}
      <td className="text-center"></td>
      {!hide?.includes("Next Execution") && <td className="text-center"></td>}
      <td className="text-center"></td>
      <td className="text-center"></td>
      <td className="text-center"></td>
      <td className="text-center"></td>
      <td className="text-center"></td>
      <td className="text-center"></td>
      <td className="text-center"></td>
      <td>
        <div className="flex jc-e">
          {order.status !== "PAUSED" && (
            <MsgProvider
              msg={
                selected?.address
                  ? new MsgExecute(
                      Account.fromAddress(selected.address),
                      [],
                      manager,
                      {
                        update_status: {
                          status: "paused",
                          contract_address: order.address,
                        },
                      }
                    )
                  : null
              }>
              <TxButton
                className="block transparent w-3 h-3 color-grey hover-white"
                data-tooltip-content={t("pauseOrder")}
                data-tooltip-id="global-tip"
                data-tooltip-float={false}
                hideSimulation>
                <Icons.Pause className="block w-3 h-3" />
              </TxButton>
            </MsgProvider>
          )}
          {order.status !== "ACTIVE" && (
            <MsgProvider
              msg={
                selected?.address
                  ? new MsgExecute(
                      Account.fromAddress(selected.address),
                      [],
                      manager,
                      {
                        update_status: {
                          status: "active",
                          contract_address: order.address,
                        },
                      }
                    )
                  : null
              }>
              <TxButton
                className="block transparent w-3 h-3 color-grey hover-white"
                data-tooltip-content={t("restartOrder")}
                data-tooltip-id="global-tip"
                data-tooltip-float={false}
                hideSimulation>
                <Icons.Play className="block w-3 h-3" />
              </TxButton>
            </MsgProvider>
          )}
          <button
            className={clsx({
              "block transparent w-3 h-3 color-grey": true,
              "opacity-10": !hasBalances,
              "hover-white": hasBalances,
            })}
            data-tooltip-content={
              hasBalances ? t("withdrawFunds") : t("noFundsToWithdraw")
            }
            data-tooltip-id="global-tip"
            onClick={hasBalances ? confirmWithdraw : () => null}
            disabled={!hasBalances}>
            <Icons.MinusCircle className="block w-3 h-3" />
          </button>
        </div>
      </td>
    </tr>
  );
};

type NodesArray = NonNullable<
  NonNullable<RecurringOrdersFragment$data["config"]>["nodes"]
>;

type AnyNode = NonNullable<NodesArray[number]>;

type CalcActionNode = Extract<AnyNode, { __typename: "CalcAction" }>;
type ActionUnion = NonNullable<CalcActionNode["action"]>;
type SwapAction = Extract<ActionUnion, { __typename: "CalcActionSwap" }>;
type SwapActionNode = CalcActionNode & { action: SwapAction };
type DistributeAction = Extract<
  ActionUnion,
  { __typename: "CalcActionDistribute" }
>;
type DistributeActionNode = CalcActionNode & { action: DistributeAction };

type CalcConditionNode = Extract<AnyNode, { __typename: "CalcCondition" }>;
type ConditionUnion = NonNullable<CalcConditionNode["condition"]>;
type ScheduleCondition = Extract<
  ConditionUnion,
  { __typename: "CalcConditionSchedule" }
>;
type ScheduleConditionNode = CalcConditionNode & {
  condition: ScheduleCondition;
};

export const RecurringOrderItem: FC<{
  k: RecurringOrdersFragment$key;
  expanded: boolean;
  hide?: RemovableColumn[];
}> = ({ k, expanded, hide }) => {
  const { t } = useTranslation();
  const { showModal, hideModal } = useGlobalModalContext();
  const order = useFragment(orderFragment, k);
  const latestBlock = useLazyLoadQuery<RecurringOrdersLatestBlockQuery>(
    latestBlockQuery,
    {
      id: blockSubscriptionId,
    }
  );

  const metadata = useCalcMetadata();

  // TODO: update metadata to be non-nullable in the API types and remove this assertion
  const { manager, scheduler } = metadata!;

  const finNode = order.config.nodes
    ?.find(
      (r): r is SwapActionNode =>
        r.__typename === "CalcAction" &&
        r.action.__typename === "CalcActionSwap"
    )
    ?.action.routes.find((r) => r.__typename === "CalcSwapRouteFin");

  const pair = useFragment<RecurringOrdersPairFragment$key>(
    pairFragment,
    finNode?.pair
  );

  const config = useMemo(() => {
    if (
      !order.config ||
      !order.config.nodes ||
      !(order.config.nodes.length === 7)
    ) {
      return null;
    }
    const hasBalanceNode = order.config.nodes[0];

    if (
      hasBalanceNode.__typename != "CalcCondition" ||
      hasBalanceNode.condition.__typename != "CalcConditionBalanceAvailable"
    ) {
      return null;
    }

    const skipScheduleNode = order.config.nodes[2];
    if (
      skipScheduleNode.__typename != "CalcCondition" ||
      skipScheduleNode.condition.__typename != "CalcConditionSchedule" ||
      (skipScheduleNode.condition.cadence.__typename != "CalcCadenceTime" &&
        skipScheduleNode.condition.cadence.__typename != "CalcCadenceBlocks")
    ) {
      return null;
    }

    const swapScheduleNode = order.config.nodes[3];
    if (
      swapScheduleNode.__typename != "CalcCondition" ||
      swapScheduleNode.condition.__typename != "CalcConditionSchedule" ||
      swapScheduleNode.condition.cadence.__typename !==
        skipScheduleNode.condition.cadence.__typename
    ) {
      return null;
    }

    const swapNode = order.config.nodes[4];
    if (
      swapNode.__typename != "CalcAction" ||
      swapNode.action.__typename != "CalcActionSwap"
    ) {
      return null;
    }

    const distributeNode = order.config.nodes[6];
    if (
      distributeNode.__typename != "CalcAction" ||
      distributeNode.action.__typename != "CalcActionDistribute"
    ) {
      return null;
    }

    const swapAmount = swapNode.action.swapAmount;
    const minimumReceiveAmount = swapNode.action.minimumReceiveAmount;
    const swapAdjustment = swapNode.action.adjustment;
    const routes = swapNode.action.routes;

    if (!pair) return null;

    const side =
      swapAmount.asset.metadata.symbol === pair.assetQuote?.metadata.symbol
        ? Side.Quote
        : Side.Base;

    const remainingSwapBalance = BigInt(
      order.balances?.find(
        (b) => b.asset.metadata.symbol === swapAmount.asset.metadata.symbol
      )?.amount || "0"
    );

    const acquiredReceiveAmount = BigInt(
      order.balances?.find(
        (b) =>
          b.asset.metadata.symbol === minimumReceiveAmount.asset.metadata.symbol
      )?.amount || "0"
    );

    const remainingSwaps = Math.round(
      Number(remainingSwapBalance) / Number(swapAmount.amount)
    );

    const previousSwap =
      swapScheduleNode.condition.cadence.__typename === "CalcCadenceBlocks"
        ? swapScheduleNode.condition.cadence.previousBlock
        : swapScheduleNode.condition.cadence.previousTime;

    const previousSkip =
      skipScheduleNode.condition.cadence.__typename === "CalcCadenceBlocks"
        ? skipScheduleNode.condition.cadence.previousBlock
        : skipScheduleNode.condition.cadence.previousTime;

    const isSkipping = (previousSkip || 0) > (previousSwap || 0);

    return {
      skipScheduleNode: skipScheduleNode as ScheduleConditionNode,
      swapScheduleNode: swapScheduleNode as ScheduleConditionNode,
      swapNode: swapNode as SwapActionNode,
      distributeNode: distributeNode as DistributeActionNode,
      swapAmount,
      minimumReceiveAmount,
      swapAdjustment,
      remainingSwapBalance,
      acquiredReceiveAmount,
      remainingSwaps,
      maximumSlippageBps: swapNode.action.maximumSlippageBps,
      routes,
      pair,
      side,
      cadence: isSkipping
        ? skipScheduleNode.condition.cadence
        : swapScheduleNode.condition.cadence,
      isSkipping,
      swaps: swapScheduleNode.condition.executions || 0,
    };
  }, [order.updatedAt, order.config.nodes, order.balances, pair]);

  const priceThreshold = useMemo(() => {
    if (!config) return 0n;

    const { swapAmount, minimumReceiveAmount, side } = config;

    const swap = BigInt(swapAmount.amount);
    const receive = BigInt(minimumReceiveAmount.amount);

    if (receive === 0n || swap === 0n) return 0n;

    return side === Side.Quote
      ? (swap * 10n ** 12n) / receive
      : (receive * 10n ** 12n) / swap;
  }, [config?.swapAmount, config?.minimumReceiveAmount, config?.side]);

  const secondsUntilNextExecution = useMemo(() => {
    if (!config || !latestBlock?.node?.header?.height) return 0;

    const { cadence } = config;

    if ("interval" in cadence && cadence.previousBlock) {
      const blockHeight = Number(latestBlock.node.header.height);
      return (cadence.interval - (blockHeight - cadence.previousBlock)) * 6;
    }

    if ("duration" in cadence && cadence.previousTime) {
      return Math.floor(
        (Date.parse(cadence.previousTime) +
          cadence.duration * 1000 -
          Date.now()) /
          1000
      );
    }

    return 0;
  }, [config?.cadence, latestBlock]);

  const remainingDuration = useMemo(() => {
    if (!config) return 0;

    const { cadence, remainingSwaps } = config;

    if (cadence.__typename === "CalcCadenceBlocks") {
      return cadence.interval * 6 * remainingSwaps;
    }

    if (cadence.__typename === "CalcCadenceTime") {
      return cadence.duration * remainingSwaps;
    }
  }, [config?.remainingSwaps, config?.cadence]);

  const swapProgress = useMemo(() => {
    if (!config) return 0;

    const { remainingSwaps, swaps } = config;

    if (remainingSwaps === 0) return 100;

    return remainingSwaps && swaps
      ? Math.round((swaps / (swaps + remainingSwaps)) * 100)
      : 0;
  }, [config?.remainingSwaps, config?.swaps, order.status]);

  const swapAdjustmentDescription = useMemo(() => {
    if (!config) return null;

    const { swapAmount, swapAdjustment, side } = config;

    if (swapAdjustment.__typename === "CalcSwapAmountAdjustmentFixed") {
      return "1.0x";
    }

    if (swapAdjustment.__typename === "CalcSwapAmountAdjustmentLinearScalar") {
      const basePrice =
        Number(swapAmount.amount) /
        Number(swapAdjustment.baseReceiveAmount.amount);

      const directionalPrice = !side
        ? basePrice
        : side === Side.Quote
          ? basePrice
          : 1 / basePrice;

      return `${BigInt(swapAdjustment.scalar) / 10n ** 12n}x from ${directionalPrice.toLocaleString(
        undefined,
        {
          minimumFractionDigits: 2,
        }
      )}`;
    }

    return null;
  }, [config?.swapAmount, config?.side, config?.swapAdjustment]);

  if (!config || !pair) {
    return (
      <UnknownRecurringOrderItem
        ks={k}
        manager={manager}
        expanded={expanded}
        hide={hide}
      />
    );
  }

  const {
    skipScheduleNode,
    swapScheduleNode,
    swapNode,
    distributeNode,
    swapAmount,
    minimumReceiveAmount,
    swapAdjustment,
    remainingSwapBalance,
    acquiredReceiveAmount,
    remainingSwaps,
    maximumSlippageBps,
    routes,
    side,
    cadence,
    isSkipping,
  } = config;

  const confirmWithdraw = () => {
    showModal({
      backgroundClose: false,
      hideCloseButton: true,
      children: (
        <TranslationProvider namespace="trade">
          <WithdrawModal hideModal={hideModal} k={k} />
        </TranslationProvider>
      ),
    });
  };

  const editOrder = () => {
    showModal({
      backgroundClose: false,
      children: (
        <TranslationProvider namespace="trade">
          <BalanceProvider asset={swapNode.action.swapAmount.asset}>
            <EditModal
              key={order.id}
              hideModal={hideModal}
              managerAddress={manager}
              schedulerAddress={scheduler}
              order={order}
              pair={pair}
              side={side}
              skipScheduleNode={skipScheduleNode}
              swapScheduleNode={swapScheduleNode}
              swapNode={swapNode}
              distributeNode={distributeNode}
            />
          </BalanceProvider>
        </TranslationProvider>
      ),
    });
  };

  const nextExecution =
    remainingSwaps === 0 || order.status === "PAUSED"
      ? ""
      : secondsUntilNextExecution < 5 && secondsUntilNextExecution > -7
        ? t("now")
        : `${secondsUntilNextExecution > 0 ? `${t("in")} ` : ""}${formatExecutionDuration(
            intervalToDuration({
              start: Date.now(),
              end: Date.now() + Math.abs(secondsUntilNextExecution * 1000),
            })
          )}${secondsUntilNextExecution < 0 ? ` ${t("ago")}` : ""}`;
  const recurringStatus =
    remainingSwaps > 0 ? order.status.toLowerCase() : "completed";
  const { search: locationSearch } = useLocation();
  const baseTradePath = "/trade";
  const tradeParams = removeDeprecatedTradeParams(
    new URLSearchParams(locationSearch)
  );
  tradeParams.set("orders-sub-recurring", recurringStatus);
  const tradeTo =
    pair.assetBase && pair.assetQuote
      ? `${baseTradePath}/${assetToTradeUrlSegment(pair.assetBase)}/${assetToTradeUrlSegment(pair.assetQuote)}${searchFromParams(tradeParams)}`
      : baseTradePath;
  const { selected } = useAccounts();

  return (
    <tr key={order.address}>
      <Subscription id={order.id} subscription={orderSubscription} />
      <td>
        <div className="flex ai-c jc-s gap-1">
          <div
            className={clsx(
              "recurring-icons",
              { small: !expanded },
              { lp: true }
            )}
            title={order.address}>
            <div className="recurring-icons__pair">
              <IconDenom denom={swapAmount.asset.metadata.symbol} />
              <IconDenom denom={minimumReceiveAmount.asset.metadata.symbol} />
            </div>
            <Icons.Copy
              type="button"
              aria-label="Icons.Copy order address"
              onClick={() => {
                navigator.clipboard.writeText(order.address);
                toast.success(t("orderAddressCopied"));
              }}
              className={clsx(
                "recurring-icons__copy button--icon transparent color-grey",
                {
                  "recurring-icons__copy--expanded": expanded,
                }
              )}
            />
          </div>
          <Link
            to={tradeTo}
            className="color-white nowrap no-underline hover-teal fw-500 fs-14">
            <div className="flex ai-c">
              {swapAmount.asset.metadata.symbol}{" "}
              <Icons.ArrowRight
                className="w-2 h-1.5 color-grey"
                style={{ marginTop: "0.1rem", marginInline: "0.05rem" }}
              />
              {minimumReceiveAmount.asset.metadata.symbol}
            </div>
          </Link>
        </div>
      </td>
      {expanded && (
        <td className="text-center">
          <LabelStatus {...order} />
        </td>
      )}
      <td className="mono fs-12">
        <div className="flex ai-c gap-1">
          <Progress height={6} percentage={swapProgress} className="w-10" />
          <span className="fs-12 color-grey">{swapProgress}%</span>
        </div>
      </td>
      {!hide?.includes("Time Remaining") && (
        <td className="text-center">
          <span className="nowrap">
            {!remainingDuration ? (
              <span></span>
            ) : isSkipping ? (
              <span
                className="color-darkOrange"
                data-tooltip-id="global-tip"
                data-tooltip-content={t("haltedTooltip")}>
                {t("halted")}
              </span>
            ) : (
              formatExecutionDuration(
                intervalToDuration({
                  start: 0,
                  end: Number(remainingDuration) * 1000,
                })
              )
            )}
          </span>
        </td>
      )}
      <td className="text-center">
        <p className="nowrap">
          {"interval" in cadence
            ? `${cadence.interval > 1 ? `${cadence.interval.toLocaleString()} blocks` : "1 block"}`
            : cadence.duration
              ? formatDuration(
                  intervalToDuration({
                    start: 0,
                    end: Number(cadence.duration || 0) * 1000,
                  }),
                  { format: ["days", "hours", "minutes"] }
                )
              : null}
        </p>
      </td>
      {!hide?.includes("Next Execution") && (
        <td className="text-center">
          {order.status === "PAUSED" ? (
            <span className="color-grey condensed">{t("paused")}</span>
          ) : isSkipping ? (
            priceThreshold ? (
              <span
                data-tooltip-id="global-tip"
                data-tooltip-content={`Next execution attempt due ${nextExecution.toLowerCase()}`}
                className="nowrap">
                at{" "}
                <Decimal subscript decimals={12} amount={priceThreshold} clip />
              </span>
            ) : (
              <span className="nowrap">
                at {"<"} {maximumSlippageBps / 100}% impact
              </span>
            )
          ) : (
            <p
              className={clsx("nowrap", {
                "color-orange":
                  remainingSwaps > 0 && secondsUntilNextExecution < -5,
                "color-darkOrange":
                  remainingSwaps > 0 && secondsUntilNextExecution < -30,
                "color-darkRed fw-500":
                  remainingSwaps > 0 && secondsUntilNextExecution < -120,
              })}>
              {nextExecution}
            </p>
          )}
        </td>
      )}
      <td className="text-right">
        <Decimal
          subscript
          amount={BigInt(swapAmount.amount)}
          symbol={swapAmount.asset.metadata.symbol}
          symbolClassName="decimal__symbol--small color-grey condensed fw-500"
          clip
        />
      </td>
      <td className="text-right">
        <span>{maximumSlippageBps / 100}%</span>
      </td>
      <td className="text-right">
        {priceThreshold > 0 ? (
          <Decimal subscript decimals={12} amount={priceThreshold} clip />
        ) : side === Side.Quote ? (
          <span className="color-lightGrey">∞</span>
        ) : (
          <Decimal
            subscript
            decimals={12}
            amount={0n}
            round={2}
            className="color-lightGrey"
            clip
          />
        )}
      </td>
      <td>
        <div className="flex nowrap ai-e gap-0.5 jc-c">
          <div className="tag tag--borderless tag--sm tag--pink">FIN</div>
          {!!routes.find((r) => r.__typename === "CalcSwapRouteThorchain") && (
            <div className="tag tag--borderless tag--sm tag--teal">TC</div>
          )}
        </div>
      </td>
      <td className="text-center">
        <div
          className={clsx("nowrap tag tag--borderless tag--sm", {
            "tag--teal":
              swapAdjustment.__typename ===
              "CalcSwapAmountAdjustmentLinearScalar",
          })}
          data-tooltip-id="global-tip"
          data-tooltip-content={t("swapMultiplierTooltip")}>
          {swapAdjustmentDescription}
        </div>
      </td>

      <td className="text-right">
        <Decimal
          subscript
          amount={remainingSwapBalance}
          symbol={swapAmount.asset.metadata.symbol}
          symbolClassName="decimal__symbol--small color-grey condensed fw-500"
          clip
        />
      </td>
      <td className="text-right">
        <Decimal
          subscript
          amount={acquiredReceiveAmount}
          symbol={minimumReceiveAmount.asset.metadata.symbol}
          symbolClassName="decimal__symbol--small color-grey condensed fw-500"
          clip
        />
      </td>
      <td>
        <div className="flex jc-e">
          <button
            className="block transparent w-3 h-3 color-grey hover-white"
            onClick={() => editOrder()}
            data-tooltip-content={t("editOrder")}
            data-tooltip-id="global-tip">
            <Icons.CirclePen className="block w-3 h-3" />
          </button>
          {order.status === "ACTIVE" && (
            <MsgProvider
              msg={
                selected?.address
                  ? new MsgExecute(
                      Account.fromAddress(selected.address),
                      [],
                      manager,
                      {
                        update_status: {
                          status: "paused",
                          contract_address: order.address,
                        },
                      }
                    )
                  : null
              }>
              <TxButton
                className="block transparent w-3 h-3 color-grey hover-white"
                data-tooltip-content={t("pauseOrder")}
                data-tooltip-id="global-tip"
                data-tooltip-float={false}
                hideSimulation>
                <Icons.Pause className="block w-3 h-3" />
              </TxButton>
            </MsgProvider>
          )}
          {order.status === "PAUSED" && (
            <MsgProvider
              msg={
                selected?.address
                  ? new MsgExecute(
                      Account.fromAddress(selected.address),
                      [],
                      manager,
                      {
                        update_status: {
                          status: "active",
                          contract_address: order.address,
                        },
                      }
                    )
                  : null
              }>
              <TxButton
                className={clsx({
                  "block transparent w-3 h-3 color-grey": true,
                  "opacity-10": remainingSwapBalance === 0n,
                  "hover-white": remainingSwapBalance > 0n,
                })}
                data-tooltip-content={t("restartOrder")}
                data-tooltip-id="global-tip"
                data-tooltip-float={false}
                hideSimulation>
                <Icons.Play className="block w-3 h-3" />
              </TxButton>
            </MsgProvider>
          )}
          <button
            className={clsx({
              "block transparent w-3 h-3 color-grey": true,
              "opacity-10": remainingSwapBalance === 0n,
              "hover-white": remainingSwapBalance > 0n,
            })}
            data-tooltip-content={t("withdrawFunds")}
            data-tooltip-id="global-tip"
            onClick={remainingSwapBalance !== 0n ? confirmWithdraw : () => null}
            disabled={remainingSwapBalance === 0n}>
            <Icons.MinusCircle className="block w-3 h-3" />
          </button>
          {acquiredReceiveAmount > 0n ? (
            <MsgProvider
              msg={
                selected?.address
                  ? new MsgExecute(
                      Account.fromAddress(selected.address),
                      [],
                      order.address,
                      {
                        withdraw: [
                          {
                            denom:
                              minimumReceiveAmount.asset.variants.native?.denom,
                            amount: acquiredReceiveAmount.toString(),
                          },
                        ],
                      }
                    )
                  : null
              }>
              <TxButton
                className="block transparent w-3 h-3"
                data-tooltip-content={t("claimFilledAmount")}
                data-tooltip-id="global-tip"
                data-tooltip-float={false}
                hideSimulation>
                <Icons.ClaimSolid className="block w-3 h-3 color-primary1 hover-primary2" />
              </TxButton>
            </MsgProvider>
          ) : (
            <button
              className="block transparent w-3 h-3 color-grey opacity-10"
              data-tooltip-content={t("claimOrder")}
              data-tooltip-id="global-tip"
              data-tooltip-float={false}>
              <Icons.Claim className="block w-3 h-3" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

const LabelStatus: FC<RecurringOrdersFragment$data> = ({ status }) => {
  const { t } = useTranslation();
  return (
    <div
      className={clsx({
        "tag tag--borderless": true,
        "tag--teal": status === "ACTIVE",
        "tag--red": status === "PAUSED",
      })}>
      {status === "ACTIVE" ? t("active") : t("paused")}
    </div>
  );
};

export type Unit = "blocks" | "minutes" | "hours" | "days";

const EditModal: FC<{
  hideModal: () => void;
  managerAddress: string;
  schedulerAddress: string;
  order: RecurringOrdersFragment$data;
  side: Side;
  pair: RecurringOrdersPairFragment$data;
  swapNode: SwapActionNode;
  skipScheduleNode: ScheduleConditionNode;
  swapScheduleNode: ScheduleConditionNode;
  distributeNode: DistributeActionNode;
}> = ({
  hideModal,
  managerAddress,
  schedulerAddress,
  order,
  pair,
  side,
  swapNode,
  skipScheduleNode,
  swapScheduleNode,
  distributeNode,
}) => {
  const { t } = useTranslation();
  const [{ showAdvanced, showSwapMultiplier }, setToggles] = useState(() => ({
    showAdvanced: false,
    showSwapMultiplier: false,
  }));

  const swapAsset = swapNode.action.swapAmount.asset;
  const receiveAsset = swapNode.action.minimumReceiveAmount.asset;

  const [deposit, setDeposit] = useState(0n);

  const [swapAmount, setSwapAmount] = useState(
    BigInt(swapNode.action.swapAmount.amount)
  );

  const [minimumReceiveAmount] = useState(
    BigInt(swapNode.action.minimumReceiveAmount.amount)
  );

  const [unit, setUnit] = useState<Unit>("blocks");
  const [cadence, setCadence] = useState<bigint | undefined>();
  const [priceThreshold, setPriceThreshold] = useState<bigint | undefined>();
  const [maxPriceImpact, setMaxPriceImpact] = useState<bigint | undefined>();
  const [addPoolRoute, setAddPoolRoute] = useState(
    swapNode.action.routes.some(
      (r) => r.__typename === "CalcSwapRouteThorchain"
    )
  );
  const [swapMultiplier, setSwapMultiplier] = useState<bigint | undefined>();
  const [basePrice, setBasePrice] = useState<bigint | undefined>();
  const { selected } = useAccounts();

  useEffect(() => {
    const hasPriceConstraints =
      swapNode.action.maximumSlippageBps !== 200 ||
      !!swapNode.action.minimumReceiveAmount.amount;

    const hasSwapAdjustment =
      swapNode.action.adjustment.__typename ===
      "CalcSwapAmountAdjustmentLinearScalar";

    setToggles({
      showAdvanced: hasPriceConstraints || hasSwapAdjustment,
      showSwapMultiplier: hasSwapAdjustment,
    });
  }, [
    swapNode.action.maximumSlippageBps,
    swapNode.action.minimumReceiveAmount.amount,
    swapNode.action.adjustment.__typename,
  ]);

  useEffect(() => {
    setMaxPriceImpact(BigInt(swapNode.action.maximumSlippageBps));

    if (swapNode.action.minimumReceiveAmount.amount) {
      setPriceThreshold(
        side === Side.Quote
          ? (BigInt(swapNode.action.swapAmount.amount) * 10n ** 12n) /
              BigInt(swapNode.action.minimumReceiveAmount.amount)
          : (BigInt(swapNode.action.minimumReceiveAmount.amount) * 10n ** 12n) /
              BigInt(swapNode.action.swapAmount.amount)
      );
    }
  }, [
    swapNode.action.maximumSlippageBps,
    swapNode.action.minimumReceiveAmount,
  ]);

  useEffect(() => {
    const { cadence } = swapScheduleNode.condition;

    if (cadence.__typename === "CalcCadenceBlocks") {
      setUnit("blocks");
      setCadence(BigInt(cadence.interval));
    } else if (cadence.__typename === "CalcCadenceTime") {
      const duration = cadence.duration;

      setCadence(BigInt(duration));
      setUnit(
        duration < 3600 ? "minutes" : duration < 86400 ? "hours" : "days"
      );
    }
  }, [swapScheduleNode.condition.cadence]);

  useEffect(() => {
    if (
      swapNode.action.adjustment.__typename ===
      "CalcSwapAmountAdjustmentLinearScalar"
    ) {
      const basePrice =
        side === Side.Quote
          ? (BigInt(swapNode.action.swapAmount.amount) * 10n ** 12n) /
            BigInt(swapNode.action.adjustment.baseReceiveAmount.amount)
          : (BigInt(swapNode.action.adjustment.baseReceiveAmount.amount) *
              10n ** 12n) /
            BigInt(swapNode.action.swapAmount.amount);

      setSwapMultiplier(BigInt(swapNode.action.adjustment.scalar) / 10n ** 12n);
      setBasePrice(basePrice);
    }
  }, [swapNode.action.adjustment]);

  useEffect(() => {
    if (
      swapNode.action.routes.find(
        (r) => r.__typename === "CalcSwapRouteThorchain"
      )
    ) {
      setAddPoolRoute(true);
    }
  }, [swapNode.action.routes]);

  const every =
    cadence &&
    (unit === "blocks"
      ? cadence
      : cadence /
        (unit === "minutes" ? 60n : unit === "hours" ? 3600n : 86400n));

  const ask = pair?.book?.asks[0] && BigInt(pair.book.asks[0].price);
  const bid = pair?.book?.bids[0] && BigInt(pair.book.bids[0].price);
  const mid = pair?.book?.center && BigInt(pair.book.center);

  let updateMsg = useMemo(() => {
    if (!order.config.nodes || !maxPriceImpact) return null;

    const hasSwapBalance = {
      balance_available: {
        amount: {
          amount: "1000",
          denom: swapAsset.variants.native!.denom,
        },
      },
    };

    const cadenceDetails =
      unit === "blocks"
        ? { blocks: { interval: Number(cadence) } }
        : { time: { duration: { secs: Number(cadence), nanos: 0 } } };

    const skipSchedule = {
      schedule: {
        cadence: cadenceDetails,
        executions: skipScheduleNode.condition.executions,
        manager_address: managerAddress,
        scheduler_address: schedulerAddress,
        execution_rebate: [],
        executors: [],
      },
    };

    const swapSchedule = {
      schedule: {
        cadence: cadenceDetails,
        executions: swapScheduleNode.condition.executions,
        manager_address: managerAddress,
        scheduler_address: schedulerAddress,
        execution_rebate: [],
        executors: [],
      },
    };

    const minimumReturn = priceThreshold
      ? side === Side.Base
        ? (swapAmount * priceThreshold) / 10n ** 12n
        : (swapAmount * 10n ** 12n) / priceThreshold
      : 0n;

    const baseReturn =
      swapMultiplier && basePrice
        ? swapMultiplier > 1n
          ? side === Side.Base
            ? (swapAmount * basePrice) / 10n ** 12n
            : (swapAmount * 10n ** 12n) / basePrice
          : 0n
        : null;

    const swapDetails = {
      swap_amount: {
        amount: swapAmount.toString(),
        denom: swapAsset.variants.native!.denom,
      },
      minimum_receive_amount: {
        amount: showAdvanced ? minimumReturn.toString() : "0",
        denom: receiveAsset.variants.native!.denom,
      },
      maximum_slippage_bps: showAdvanced ? Number(maxPriceImpact) : 200,
      routes: [
        {
          fin: {
            pair_address: pair?.address,
          },
        },
      ],
      adjustment:
        showAdvanced &&
        showSwapMultiplier &&
        swapMultiplier &&
        swapMultiplier > 1n &&
        baseReturn
          ? {
              linear_scalar: {
                base_receive_amount: {
                  amount: baseReturn.toString(),
                  denom: receiveAsset.variants.native!.denom,
                },
                scalar: swapMultiplier.toString(),
              },
            }
          : ("fixed" as const),
    };

    const canSwap = { can_swap: swapDetails };
    const swap = { swap: swapDetails };

    const distributeAllFunds = {
      distribute: {
        denoms: distributeNode.action.denoms,
        destinations: distributeNode.action.destinations.map((d) => {
          const recipient =
            d.recipient.__typename === "CalcRecipientBank"
              ? { bank: { address: d.recipient.address } }
              : d.recipient.__typename === "CalcRecipientContract"
                ? {
                    contract: {
                      address: d.recipient.address,
                      msg: d.recipient.msg,
                    },
                  }
                : d.recipient.__typename === "CalcRecipientDeposit"
                  ? { deposit: { memo: d.recipient.memo } }
                  : null;

          if (!recipient) return null;

          return {
            shares: `${d.shares}`,
            label: d.label,
            recipient: recipient,
          };
        }),
      },
    };

    const nodes = [
      {
        condition: {
          index: 0,
          condition: hasSwapBalance,
          on_success: 1,
          on_failure: 6,
        },
      },
      {
        condition: {
          index: 1,
          condition: canSwap,
          on_success: 3,
          on_failure: 2,
        },
      },
      {
        condition: {
          index: 2,
          condition: skipSchedule,
        },
      },
      {
        condition: {
          index: 3,
          condition: swapSchedule,
          on_success: 4,
        },
      },
      {
        action: {
          index: 4,
          action: swap,
          next: 5,
        },
      },
      {
        condition: {
          index: 5,
          condition: hasSwapBalance,
          on_failure: 6,
        },
      },
      {
        action: {
          index: 6,
          action: distributeAllFunds,
        },
      },
    ];
    if (!selected?.address) return null;
    return new MsgExecute(
      Account.fromAddress(selected.address),
      deposit > 0n
        ? [
            {
              amount: deposit.toString(),
              denom: swapAsset.variants.native!.denom,
            },
          ]
        : [],
      managerAddress,
      {
        update: {
          contract_address: order.address,
          nodes,
        },
      }
    );
  }, [
    deposit,
    swapAmount,
    minimumReceiveAmount,
    priceThreshold,
    maxPriceImpact,
    cadence,
    unit,
    addPoolRoute,
    showAdvanced,
    basePrice,
    swapMultiplier,
    order,
  ]);

  return (
    <div className="flex dir-c gap-2">
      <div className="modal__header">
        <div className="flex ai-c gap-2">
          <div className="flex ai-c gap-1">
            <div className="lp">
              <IconDenom denom={swapAsset.metadata.symbol} />
              <IconDenom denom={receiveAsset.metadata.symbol} />
            </div>
            <div className="flex ai-c fw-500 fs-16 gap-0.5">
              {swapAsset.metadata.symbol}{" "}
              <Icons.ArrowRight className="w-2 h-1.5 color-grey" />
              {receiveAsset.metadata.symbol}
            </div>
          </div>
          <LabelStatus {...order} />
        </div>
      </div>
      <div className="flex dir-c gap-2">
        <InputQuantity amount={deposit} setAmount={setDeposit}>
          <label>
            {t("additionalDeposit")}{" "}
            <small>({swapAsset.metadata.symbol})</small>
          </label>
        </InputQuantity>
        <Numeric
          decimals={swapAsset.metadata.decimals}
          amount={swapAmount}
          initialZeroAsPlaceholder
          onChangeAmount={setSwapAmount}
          className="numeric-input--white">
          <label>
            {t("swapAmount")} <small>({swapAsset.metadata.symbol})</small>
          </label>
        </Numeric>
        <div className="flex jc-sb">
          <div className="col-7">
            <Input
              label={t("every")}
              className="numeric-input numeric-input--white condensed"
              type="number"
              min="1"
              max="10000"
              value={every ? Number(every) : ""}
              onChange={(e) => {
                if (e.target.value === "") return setCadence(0n);
                if (unit === "blocks") {
                  setCadence(BigInt(e.target.valueAsNumber));
                } else {
                  setCadence(
                    BigInt(
                      e.target.valueAsNumber *
                        (unit === "minutes"
                          ? 60
                          : unit === "hours"
                            ? 3600
                            : 86400)
                    )
                  );
                }
              }}
            />
          </div>
          <div className="col-5 flex ai-c ml-1 jc-sa gap-0.5">
            <Button
              className={clsx({
                "button button--xsmall": true,
                "button--outline button--grey": unit !== "blocks",
              })}
              onClick={() => {
                setUnit("blocks");
                setCadence(every || 100n);
              }}>
              <span>{t("blocks")}</span>
            </Button>
            <Button
              className={clsx({
                "button button--xsmall": true,
                "button--outline button--grey": unit !== "minutes",
              })}
              onClick={() => {
                setUnit("minutes");
                setCadence(every ? 60n * every : 5n);
              }}>
              <span>{t("mins")}</span>
            </Button>
            <Button
              className={clsx({
                "button button--xsmall": true,
                "button--outline button--grey": unit !== "hours",
              })}
              onClick={() => {
                setUnit("hours");
                setCadence(every ? 3600n * every : 12n);
              }}>
              <span>{t("hours")}</span>
            </Button>
            <Button
              className={clsx({
                "button button--xsmall": true,
                "button--outline button--grey": unit !== "days",
              })}
              onClick={() => {
                setUnit("days");
                setCadence(every ? 86400n * every : 1n);
              }}>
              <span>{t("days")}</span>
            </Button>
          </div>
        </div>
        <div className="flex ai-c jc-e">
          <Toggle
            className={clsx("toggle--xs transition", {
              "color-lightGrey": !showAdvanced,
            })}
            id="er-advanced-options-toggle"
            checked={showAdvanced}
            onChange={(e) => {
              setToggles((v) => ({
                showAdvanced: !v.showAdvanced,
                showSwapMultiplier: !v.showAdvanced
                  ? false
                  : v.showSwapMultiplier,
              }));
              e.target.blur();
            }}>
            <label className="ml-1" htmlFor="er-advanced-options-toggle">
              {t("advancedOptions")}
            </label>
          </Toggle>
        </div>
        {showAdvanced && (
          <>
            <div className="flex dir-c">
              {!!priceThreshold ? (
                <Numeric
                  decimals={12}
                  amount={priceThreshold}
                  onChangeAmount={setPriceThreshold}
                  className="numeric-input--white">
                  <label>
                    {side === Side.Base ? t("priceFloor") : t("priceCeiling")}{" "}
                    <small>
                      (
                      {side === Side.Base
                        ? receiveAsset.metadata.symbol
                        : swapAsset.metadata.symbol}
                      )
                    </small>
                  </label>
                </Numeric>
              ) : (
                <Numeric
                  decimals={12}
                  amount={0n}
                  onChangeAmount={setPriceThreshold}
                  className="numeric-input--white">
                  <label>
                    {side === Side.Base
                      ? t("noPriceFloor")
                      : t("noPriceCeiling")}
                  </label>
                </Numeric>
              )}
              <div className="flex ai-c jc-c mx-a mt-0.5 mb-1.5">
                <button
                  className="trade__submit-sm-btn ml-0.5"
                  onClick={() =>
                    priceThreshold &&
                    setPriceThreshold(
                      adjust((priceThreshold * 98n) / 100n, Number(pair.tick))
                    )
                  }>
                  -2%
                </button>
                <button
                  className="trade__submit-sm-btn ml-0.5"
                  onClick={() =>
                    bid && setPriceThreshold(adjust(bid, Number(pair.tick)))
                  }>
                  {t("bid")}
                </button>
                <button
                  className="trade__submit-sm-btn ml-0.5"
                  onClick={() =>
                    mid && setPriceThreshold(adjust(mid, Number(pair.tick)))
                  }>
                  {t("mid")}
                </button>
                <button
                  className="trade__submit-sm-btn ml-0.5"
                  onClick={() =>
                    ask && setPriceThreshold(adjust(ask, Number(pair.tick)))
                  }>
                  {t("ask")}
                </button>
                <button
                  className="trade__submit-sm-btn ml-0.5"
                  onClick={() =>
                    priceThreshold &&
                    setPriceThreshold(
                      adjust((priceThreshold * 102n) / 100n, Number(pair.tick))
                    )
                  }>
                  +2%
                </button>
              </div>
              <div className="flex">
                <div className="col-8">
                  <Input
                    label={t("maxPriceImpact")}
                    className="numeric-input numeric-input--white"
                    type="number"
                    min="1"
                    max="100"
                    value={maxPriceImpact ? Number(maxPriceImpact) / 100 : ""}
                    onChange={(e) => {
                      if (e.target.value === "")
                        return setMaxPriceImpact(undefined);
                      setMaxPriceImpact(
                        BigInt(Math.round(e.target.valueAsNumber * 100))
                      );
                    }}
                  />
                </div>
                <div className="col-5 text-center flex ai-c ml-1 jc-sa gap-0.5">
                  <Button
                    className={clsx({
                      "button button--xsmall": true,
                      "button--outline button--grey": maxPriceImpact !== 50n,
                    })}
                    onClick={() => {
                      setMaxPriceImpact(50n);
                    }}>
                    <span>0.5%</span>
                  </Button>
                  <Button
                    className={clsx({
                      "button button--xsmall": true,
                      "button--outline button--grey": maxPriceImpact !== 100n,
                    })}
                    onClick={() => {
                      setMaxPriceImpact(100n);
                    }}>
                    <span>1%</span>
                  </Button>
                  <Button
                    className={clsx({
                      "button button--xsmall": true,
                      "button--outline button--grey": maxPriceImpact !== 200n,
                    })}
                    onClick={() => {
                      setMaxPriceImpact(200n);
                    }}>
                    <span>2%</span>
                  </Button>
                  <Button
                    className={clsx({
                      "button button--xsmall": true,
                      "button--outline button--grey": maxPriceImpact !== 500n,
                    })}
                    onClick={() => {
                      setMaxPriceImpact(500n);
                    }}>
                    <span>5%</span>
                  </Button>
                  <Button
                    className={clsx({
                      "button button--xsmall": true,
                      "button--outline button--grey": maxPriceImpact !== 1000n,
                    })}
                    onClick={() => {
                      setMaxPriceImpact(1000n);
                    }}>
                    <span>10%</span>
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex ai-c gap-0.5 jc-e">
              <Toggle
                className={clsx("toggle--xs transition", {
                  "color-lightGrey": !showSwapMultiplier,
                })}
                id="er-weighted-scale-toggle"
                checked={showSwapMultiplier}
                onChange={(e) => {
                  if (!basePrice && !showSwapMultiplier) {
                    setBasePrice(adjust(mid || 0n, Number(pair.tick)));
                  }

                  if (!swapMultiplier && !showSwapMultiplier) {
                    setSwapMultiplier(2n);
                  }

                  setToggles((v) => ({
                    ...v,
                    showSwapMultiplier: !v.showSwapMultiplier,
                  }));
                  e.target.blur();
                }}>
                <label className="ml-1" htmlFor="er-weighted-scale-toggle">
                  {t("swapMultiplier")}
                </label>
              </Toggle>
            </div>
            {showSwapMultiplier && (
              <div className="flex dir-c gap-3">
                <div className="flex dir-c">
                  <div className="flex gap-1">
                    <div className="col-3">
                      <Input
                        label={t("multiplier")}
                        className="numeric-input numeric-input--white"
                        type="number"
                        min="2"
                        max="10000"
                        value={swapMultiplier ? Number(swapMultiplier) : ""}
                        onChange={(e) => {
                          if (e.target.value === "") {
                            setSwapMultiplier(undefined);
                          } else {
                            setSwapMultiplier(
                              BigInt(Math.round(e.target.valueAsNumber))
                            );
                          }
                        }}
                      />
                    </div>
                    <Numeric
                      decimals={12}
                      amount={basePrice || 0n}
                      onChangeAmount={setBasePrice}
                      className="numeric-input--white h-lg w-full col-9">
                      <label>
                        {t("referencePrice")}{" "}
                        <small>
                          (
                          {side === Side.Base
                            ? receiveAsset.metadata.symbol
                            : swapAsset.metadata.symbol}
                          )
                        </small>
                      </label>
                    </Numeric>
                  </div>
                  <div className="flex ai-c jc-c mx-a mt-0.5">
                    <button
                      className="trade__submit-sm-btn ml-0.5"
                      onClick={() =>
                        basePrice &&
                        setBasePrice(
                          adjust((basePrice * 98n) / 100n, Number(pair.tick))
                        )
                      }>
                      -2%
                    </button>
                    <button
                      className="trade__submit-sm-btn ml-0.5"
                      onClick={() =>
                        bid && setBasePrice(adjust(bid, Number(pair.tick)))
                      }>
                      {t("bid")}
                    </button>
                    <button
                      className="trade__submit-sm-btn ml-0.5"
                      onClick={() =>
                        mid && setBasePrice(adjust(mid, Number(pair.tick)))
                      }>
                      {t("mid")}
                    </button>
                    <button
                      className="trade__submit-sm-btn ml-0.5"
                      onClick={() =>
                        ask && setBasePrice(adjust(ask, Number(pair.tick)))
                      }>
                      {t("ask")}
                    </button>
                    <button
                      className="trade__submit-sm-btn ml-0.5"
                      onClick={() =>
                        basePrice &&
                        setBasePrice(
                          adjust((basePrice * 102n) / 100n, Number(pair.tick))
                        )
                      }>
                      +2%
                    </button>
                  </div>
                </div>
                <SwapMultiplierCarousel
                  swapAmount={swapAmount}
                  basePrice={basePrice}
                  swapMultiplier={swapMultiplier}
                  side={side}
                />
              </div>
            )}
          </>
        )}
      </div>
      <div className="modal__footer mt-4 px-3 py-2 flex ai-s wrap">
        <Button
          className="button--grey button--outline mr-1"
          onClick={hideModal}
          label={t("cancel")}
        />
        <div className="block ml-a text-right">
          <MsgProvider msg={updateMsg}>
            <TxButton
              className="button ml-1"
              label={t("confirm")}
              onSuccess={hideModal}
              hideSimulation
            />
          </MsgProvider>
        </div>
      </div>
    </div>
  );
};

const WithdrawModal: FC<{
  hideModal: () => void;
  k?: RecurringOrdersFragment$key;
}> = ({ hideModal, k }) => {
  const { t } = useTranslation();
  const order = useFragment(orderFragment, k);

  const [amounts, setAmounts] = useState<Record<string, bigint>>(
    order?.balances?.reduce(
      (acc, b) => ({
        ...acc,
        [b.asset.metadata.symbol]: 0n,
      }),
      {}
    ) || {}
  );

  const assetsBySymbol = useMemo<Record<string, Asset | undefined>>(
    () =>
      order?.balances?.reduce(
        (acc, b) => ({
          ...acc,
          [b.asset.metadata.symbol]: b.asset,
        }),
        {}
      ) || {},
    [order?.balances]
  );

  const balancesBySymbol = useMemo<Record<string, bigint>>(
    () =>
      order?.balances?.reduce(
        (acc, b) => ({
          ...acc,
          [b.asset.metadata.symbol]: BigInt(b.amount),
        }),
        {}
      ) || {},
    [order?.balances]
  );
  const { selected } = useAccounts();

  const withdrawMsg = useMemo(() => {
    if (!order) return null;
    if (!selected) return null;
    return Object.values(amounts).some((a) => a > 0n)
      ? new MsgExecute(
          Account.fromAddress(selected.address),
          [],
          order.address,
          {
            withdraw: Object.entries(amounts)
              .map(([symbol, amount]) => ({
                denom: order.balances?.find(
                  (b) => b.asset.metadata.symbol === symbol
                )?.asset?.variants?.native?.denom,
                amount: amount.toString(),
              }))
              .filter((a) => a.amount !== "0"),
          }
        )
      : null;
  }, [amounts, order, selected]);
  if (!order) return null;

  return (
    <>
      <div className="modal__header">
        <h2 className="h3 flex ai-c">{t("withdrawFromRecurringOrder")}</h2>
      </div>
      <div className="flex dir-c gap-3">
        {Object.entries(amounts).map(([symbol, amount]) => (
          <div key={symbol} className="flex ai-c">
            <DenomInput
              symbol={symbol}
              amount={amount}
              decimals={assetsBySymbol[symbol]?.metadata.decimals || 8}
              max={balancesBySymbol[symbol] || 0n}
              maxLabel={`${t("balance")}:`}
              onChangeAmount={(value) =>
                setAmounts((prev) => ({
                  ...prev,
                  [symbol]: value,
                }))
              }
            />
          </div>
        ))}
      </div>
      <div className="modal__footer mt-4 px-3 py-2 flex ai-s wrap">
        <Button
          className="button--grey button--outline mr-1"
          onClick={hideModal}
          label={t("cancel")}
        />
        <div className="block ml-a text-right">
          <MsgProvider msg={withdrawMsg}>
            <TxButton
              className="button ml-1"
              label={t("confirm")}
              onSuccess={hideModal}
              hideSimulation
            />
          </MsgProvider>
        </div>
      </div>
    </>
  );
};
