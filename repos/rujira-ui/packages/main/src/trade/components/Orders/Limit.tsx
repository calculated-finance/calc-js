import clsx from "clsx";
import { format } from "date-fns";
import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from "react";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import {
  Account,
  bigintToFixed,
  MsgExecute,
  MsgMulti,
  priceFormatter,
} from "rujira.js";
import {
  Button,
  Decimal,
  Fiat,
  toFiatAmount,
  IconDenom,
  nFormatter,
  TranslationProvider,
  useGlobalModalContext,
  useIsTouchDevice,
  useQueryParam,
  useTranslation,
} from "rujira.ui";

import { Icons } from "rujira.ui";
import {
  BalanceProvider,
  usePreloadedBalance,
} from "../../../common/components/Balance";
import {
  MsgProvider,
  TxBalanceAccountButton,
  TxButton,
} from "../../../common/components/TxButton";
import { usePreloadedAccountData } from "../../../services/accountData";
import { useAccounts } from "../../../services/accounts";
import { useTradeBookSubscription } from "../../TradeSubscriptions";
import { useTradeContext } from "../Context";
import { InputQuantity } from "../InputQuantity";
import {
  LimitOrdersAccountFragment$data,
  LimitOrdersAccountFragment$key,
} from "./__generated__/LimitOrdersAccountFragment.graphql";
import {
  LimitOrdersFragment$data,
  LimitOrdersFragment$key,
} from "./__generated__/LimitOrdersFragment.graphql";
import { Nav, OrderLink } from "./Common";
import { useOrdersContext } from "./Context";

type FinOrderNode = Extract<
  NonNullable<
    NonNullable<
      NonNullable<
        NonNullable<LimitOrdersAccountFragment$data["fin"]>["ordersV2"]
      >["edges"]
    >[number]
  >["node"],
  { __typename: "FinOrder" }
>;
type LimitOrdersData = {
  open: FinOrderNode[];
  filled: FinOrderNode[];
  total: number;
};

type TableProps = FC<{
  expanded?: boolean;
  orders: FinOrderNode[];
}>;

enum Tab {
  Open = "open",
  Filled = "filled",
  History = "history",
}

const context = createContext<{
  tab: Tab;
  setTab: (v: Tab) => void;
}>({
  tab: Tab.Open,
  setTab: () => {},
});

export const Context: FC<PropsWithChildren> = ({ children }) => {
  const [tab, setTab] = useQueryParam<Tab>("orders-sub-limit", Tab.Open);
  return (
    <context.Provider value={{ tab, setTab }}>{children}</context.Provider>
  );
};

const accountFragment = graphql`
  fragment LimitOrdersAccountFragment on Account {
    fin {
      ordersV2(first: 100)
        @connection(key: "TradeSubscriptionsFragment_ordersV2") {
        edges {
          node {
            __typename
            ... on FinOrder {
              pair {
                address
              }
              side
              rate
              remaining
              filled
              ...LimitOrdersFragment
            }
          }
        }
      }
    }
  }
`;

export const useLimitOrdersData = (): LimitOrdersData => {
  const { accountData } = usePreloadedAccountData();
  const { only } = useOrdersContext();
  const { address } = useTradeContext();
  const d = useFragment<LimitOrdersAccountFragment$key>(
    accountFragment,
    accountData
  );

  return useMemo(() => {
    const finOrders =
      d?.fin?.ordersV2?.edges
        ?.map((o) => o?.node)
        .filter(
          (node): node is FinOrderNode =>
            !!node && node.__typename === "FinOrder"
        ) || [];

    const sorted = [...finOrders]
      .sort((a, b) => Number(a?.rate) - Number(b?.rate))
      .filter((o) => {
        return address ? (only ? o?.pair.address === address : true) : true;
      });

    const open = sorted.reduce(
      (agg: FinOrderNode[], x) => (x?.remaining ? [x, ...agg] : agg),
      []
    );
    const filled = sorted.reduce(
      (agg: FinOrderNode[], x) => (x?.filled ? [x, ...agg] : agg),
      []
    );

    return { open, filled, total: sorted.length };
  }, [d, address, only]);
};

export const Tabs: FC<{ data?: LimitOrdersData }> = ({ data }) => {
  const { tab, setTab } = useContext(context);
  return (
    <Nav
      tab={tab}
      setTab={setTab}
      tabs={[
        { value: Tab.Open, count: data?.open.length || 0 },
        { value: Tab.Filled, count: data?.filled.length || 0 },
      ]}
    />
  );
};

export const Content: FC = () => {
  const { tab } = useContext(context);
  const { open, filled } = useLimitOrdersData();

  switch (tab) {
    case Tab.Open:
      return <Table orders={open} />;
    case Tab.Filled:
      return <Table orders={filled} />;
    case Tab.History:
      return <History />;
  }
};

const groupOrders = (
  account: Account,
  orders: FinOrderNode[],
  amount?: string
) =>
  Array.from(
    orders.reduce((grouped, order) => {
      const entry = [order.side, priceKey(order), amount ?? null] as const;
      return new Map(grouped).set(order.pair.address, [
        ...(grouped.get(order.pair.address) ?? []),
        entry,
      ]);
    }, new Map<string, Array<readonly [FinOrderNode["side"], ReturnType<typeof priceKey>, string | null]>>())
  ).map(
    ([contract, contractOrders]) =>
      new MsgExecute(account, [], contract, {
        order: [contractOrders, null],
      })
  );

export const Table: TableProps = ({ orders }) => {
  const { t } = useTranslation();
  const { tab } = useContext(context);
  const { selected } = useAccounts();
  const isTouchDevice = useIsTouchDevice();
  const { address } = useTradeContext();

  const claimAll = useMemo(() => {
    if (!selected) return null;
    if (!address) return null;

    const toClaim = orders.filter((o) => o.filled);

    if (!toClaim.length) return null;
    const account = Account.fromAddress(selected.address);
    return new MsgMulti(account, groupOrders(account, toClaim));
  }, [orders, address, selected]);

  const cancelAll = useMemo(() => {
    if (!address) return null;
    if (!selected) return null;
    const toCancel = orders.filter((o) => o.remaining);
    if (!toCancel.length) return null;
    const account = Account.fromAddress(selected.address);
    return new MsgMulti(account, groupOrders(account, toCancel, "0"));
  }, [orders, address, selected]);

  return (
    <div className="trade__orders-table table-sticky table-sticky--left table-sticky--right mt-2">
      {orders.length > 0 ? (
        <table
          className={clsx({
            "table nowrap table--spaced": true,
            "table--no-hover": isTouchDevice,
          })}>
          <thead>
            <tr>
              <th className="w-1">{t("pair")}</th>
              <th></th>
              <th className="text-center">{t("side")}</th>
              <th className="text-center">{t("type")}</th>
              <th>{t("date")}</th>
              <th className="text-right">{t("currentPrice")}</th>
              <th className="text-right">{t("orderPrice")}</th>
              <th className="text-right">{t("amount")}</th>
              <th className="text-right">{t("remaining")}</th>
              <th className="text-right">{t("value")}</th>
              <th className="text-right">{t("filled")}</th>
              <th className="text-right">{t("unclaimed")}</th>
              <th className="text-right">{t("fee")}</th>
              {address ? (
                <th className="w-6">
                  <div className="flex jc-e w-full">
                    <MsgProvider msg={cancelAll}>
                      <TxButton
                        hideSimulation
                        className={clsx({
                          "block transparent w-3 h-3 color-grey": true,
                          "opacity-10": false,
                          "hover-white": true,
                        })}
                        data-tooltip-content={t("cancelAll")}
                        data-tooltip-id="global-tip"
                        data-tooltip-float={false}>
                        <Icons.CirclesXMark className="block w-3 h-3" />
                      </TxButton>
                    </MsgProvider>
                    <MsgProvider msg={claimAll}>
                      <TxButton
                        hideSimulation
                        className={clsx({
                          "block transparent w-3 h-3 color-grey ml-0.5": true,
                          "opacity-10": false,
                          "hover-white": true,
                        })}
                        data-tooltip-content={t("claimAll")}
                        data-tooltip-id="global-tip"
                        data-tooltip-float={false}>
                        <Icons.ClaimAll className="block w-3 h-3" />
                      </TxButton>
                    </MsgProvider>
                  </div>
                </th>
              ) : (
                <th className="nowrap w-6"></th>
              )}
            </tr>
          </thead>
          <tbody>
            {orders.map((o, idx) => (
              <LimitOrderItem key={idx} k={o} />
            ))}
          </tbody>
        </table>
      ) : (
        <p className="condensed fs-14 color-grey text-center mt-2">
          {t("noOrdersMessage", { label: tab })}
        </p>
      )}
    </div>
  );
};

export const TableFallback: FC = () => {
  const { t } = useTranslation();
  const isTouchDevice = useIsTouchDevice();

  return (
    <div className="trade__orders-table table-sticky table-sticky--left mt-2">
      <table
        className={clsx({
          "table nowrap table--spaced": true,
          "table--no-hover": isTouchDevice,
        })}>
        <thead>
          <tr>
            <th className="w-1">{t("pair")}</th>
            <th></th>
            <th className="text-center">{t("side")}</th>
            <th className="text-center">{t("type")}</th>
            <th>{t("date")}</th>
            <th className="text-right">{t("currentPrice")}</th>
            <th className="text-right">{t("orderPrice")}</th>
            <th className="text-right">{t("amount")}</th>
            <th className="text-right">{t("remaining")}</th>
            <th className="text-right">{t("value")}</th>
            <th className="text-right">{t("filled")}</th>
            <th className="text-right">{t("fee")}</th>
            <th className="w-6"></th>
          </tr>
        </thead>
        <tbody>
          {[...Array(3)].map((_, i) => (
            <tr key={`skeleton-${i}`}>
              <td className="w-1">
                <div className={clsx({ lp: true, small: true })}>
                  <div className="icon-denom skeleton h-2 w-2 br-2" />
                  <div className="icon-denom skeleton h-2 w-2 br-2" />
                </div>
              </td>
              <td>
                <div className="skeleton h-1 w-10 br-2" />
              </td>
              <td className="text-center">
                <div className="skeleton h-1 w-5 br-2 inline-block" />
              </td>
              <td className="text-center">
                <div className="skeleton h-1 w-5 br-2 inline-block" />
              </td>
              <td>
                <div className="skeleton h-1 w-10 br-2 inline-block" />
              </td>
              <td className="text-right">
                <div className="skeleton h-1 w-10 br-2 inline-block" />
              </td>
              <td className="text-right">
                <div className="skeleton h-1 w-10 br-2 inline-block" />
              </td>
              <td className="text-right">
                <div className="skeleton h-1 w-10 br-2 inline-block" />
              </td>
              <td className="text-right">
                <div className="skeleton h-1 w-10 br-2 inline-block" />
              </td>
              <td className="text-right">
                <div className="skeleton h-1 w-10 br-2 inline-block" />
              </td>
              <td className="text-right">
                <div className="skeleton h-1 w-5 br-2 inline-block" />
              </td>
              <td className="text-right">
                <div className="skeleton h-1 w-10 br-2 inline-block" />
              </td>
              <td className="w-6">
                <div className="flex" style={{ gap: "0.5rem" }}>
                  <div className="skeleton h-2 w-2 br-2 inline-block" />
                  <div className="skeleton h-2 w-2 br-2 inline-block" />
                  <div className="skeleton h-2 w-2 br-2 inline-block" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const orderFragment = graphql`
  fragment LimitOrdersFragment on FinOrder {
    deviation
    filled
    filledValue
    filledFee
    offer
    owner
    pair {
      address
      assetBase {
        asset
        chain
        type
        metadata {
          symbol
          decimals
        }
      }
      assetQuote {
        asset
        chain
        type
        metadata {
          symbol
          decimals
        }
        price {
          current
        }
      }
      book {
        id
        center
      }
    }
    remaining
    remainingValue
    rate
    side
    type
    updatedAt
    offerValue
  }
`;

type LimitOrderItemType = FC<{
  k: LimitOrdersFragment$key;
}>;

const priceKey = (d: { deviation?: bigint | null; rate: bigint }) =>
  d.deviation
    ? { oracle: Number(d.deviation) }
    : { fixed: bigintToFixed(d.rate) };

export const LimitOrderItem: LimitOrderItemType = ({ k }) => {
  const { t } = useTranslation();
  const { showModal, hideModal } = useGlobalModalContext();
  const { selected } = useAccounts();
  const d = useFragment(orderFragment, k);
  const contract = d.pair.address;
  const { assetOffer, assetAsk } =
    d.side === "base"
      ? { assetOffer: d.pair.assetBase, assetAsk: d.pair.assetQuote }
      : { assetOffer: d.pair.assetQuote, assetAsk: d.pair.assetBase };

  const cancelMsg = useMemo(() => {
    if (!selected) return null;
    if (!contract) return null;

    return new MsgExecute(Account.fromAddress(selected.address), [], contract, {
      order: [[[d.side, priceKey(d), "0"]], null],
    });
  }, [d, contract]);

  const claimMsg = useMemo(() => {
    if (!selected) return null;
    if (!contract) return null;

    return new MsgExecute(Account.fromAddress(selected.address), [], contract, {
      order: [[[d.side, priceKey(d), null]], null],
    });
  }, [contract, d]);

  const confirmCancel = () => {
    showModal({
      backgroundClose: false,
      hideCloseButton: true,
      children: cancelMsg ? (
        <TranslationProvider namespace="trade">
          <MsgProvider msg={cancelMsg}>
            <CancelLimitOrderModal hideModal={hideModal} />
          </MsgProvider>
        </TranslationProvider>
      ) : null,
    });
  };

  const editOrder = (k: LimitOrdersFragment$key) => {
    showModal({
      title: t("editOrder"),
      backgroundClose: false,
      children: (
        <TranslationProvider namespace="trade">
          <BalanceProvider
            asset={d.side === "base" ? d.pair.assetBase : d.pair.assetQuote}
            additionalBalance={BigInt(d.remaining)}>
            <EditLimitOrder k={k} hideModal={hideModal} />
          </BalanceProvider>
        </TranslationProvider>
      ),
    });
  };

  return (
    <tr>
      <OrderLink assetBase={d.pair.assetBase} assetQuote={d.pair.assetQuote} />
      <td className="text-center">
        <LabelSide {...d} />
      </td>
      <td className="text-center">
        <LabelType {...d} />
      </td>
      <td className="mono fs-12">
        {format(d.updatedAt, "dd/MM/yy")}{" "}
        <span className="color-grey">{format(d.updatedAt, "HH:mm")}</span>
      </td>
      <td className="text-right mono">
        <Decimal
          subscript
          decimals={12}
          round={4}
          amount={BigInt(d.pair.book.center || 0)}
          symbol={d.pair.assetQuote.metadata.symbol}
          symbolClassName="decimal__symbol--small color-grey condensed fw-500"
          clip
        />
      </td>
      <td className="text-right">
        <Price {...d} />
      </td>
      <td className="text-right">
        {d.side === "base" ? (
          <Decimal
            subscript
            round={4}
            amount={BigInt(d.offer)}
            symbol={assetOffer.metadata.symbol}
            symbolClassName="decimal__symbol--small color-grey condensed fw-500"
            clip
          />
        ) : (
          <Decimal
            subscript
            round={4}
            amount={BigInt(d.offerValue)}
            symbol={assetAsk.metadata.symbol}
            symbolClassName="decimal__symbol--small color-grey condensed fw-500"
            clip
          />
        )}
      </td>
      <td className="text-right">
        {d.side === "base" ? (
          <Decimal
            subscript
            round={4}
            amount={BigInt(d.remaining)}
            symbol={assetOffer.metadata.symbol}
            symbolClassName="decimal__symbol--small color-grey condensed fw-500"
            clip
          />
        ) : (
          <Decimal
            subscript
            round={4}
            amount={BigInt(d.remainingValue)}
            symbol={assetAsk.metadata.symbol}
            symbolClassName="decimal__symbol--small color-grey condensed fw-500"
            clip
          />
        )}
      </td>

      <td className="text-right">
        {d.side === "base" ? (
          <Decimal
            subscript
            round={4}
            amount={BigInt(d.offerValue)}
            symbol={assetAsk.metadata.symbol}
            symbolClassName="decimal__symbol--small color-grey condensed fw-500"
            clip
          />
        ) : (
          <Decimal
            subscript
            round={4}
            amount={BigInt(d.offer)}
            symbol={assetOffer.metadata.symbol}
            symbolClassName="decimal__symbol--small color-grey condensed fw-500"
            clip
          />
        )}
      </td>
      <td className="text-right color-teal">
        <StatusFilled {...d} />
      </td>
      <td className="text-right">
        {d.filled ? (
          <Decimal
            subscript
            round={4}
            amount={BigInt(d.filled)}
            symbol={assetAsk.metadata.symbol}
            symbolClassName="decimal__symbol--small color-grey condensed fw-500"
            clip
          />
        ) : (
          <span className="color-grey">&mdash;</span>
        )}
      </td>
      <td className="text-right">
        <Decimal
          subscript
          round={4}
          amount={BigInt(d.filledFee)}
          symbol={assetAsk.metadata.symbol}
          symbolClassName="decimal__symbol--small color-grey condensed fw-500"
          clip
        />
      </td>
      <td>
        <div className="flex">
          {d.remaining ? (
            <button
              className="block transparent w-3 h-3 color-grey hover-white"
              onClick={() => editOrder(k)}
              data-tooltip-content={t("editOrder")}
              data-tooltip-id="global-tip">
              <Icons.CirclePen className="block w-3 h-3" />
            </button>
          ) : null}

          <button
            className={clsx({
              "block transparent w-3 h-3 color-grey": true,
              "opacity-10": Number(d.remaining) === 0,
              "hover-white": Number(d.remaining) > 0,
            })}
            data-tooltip-content={t("cancelOrder")}
            data-tooltip-id="global-tip"
            onClick={d.remaining ? confirmCancel : () => null}
            disabled={!d.remaining}>
            <Icons.CircleXMark className="block w-3 h-3" />
          </button>
          {Number(d.filled) > 0 ? (
            <MsgProvider msg={claimMsg}>
              <TxButton
                className="block transparent w-3 h-3"
                data-tooltip-content={t("claimOrder")}
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

const LabelSide: FC<LimitOrdersFragment$data> = ({ side }) => {
  const { t } = useTranslation();
  return (
    <div
      className={clsx({
        "tag tag--borderless": true,
        "tag--red": side === "base",
        "tag--teal": side === "quote",
      })}>
      {side === "base" ? t("sell") : t("buy")}
    </div>
  );
};

const LabelType: FC<LimitOrdersFragment$data> = ({ type }) => {
  const { t } = useTranslation();
  return (
    <div
      className={clsx({
        "tag tag--borderless": true,
        "tag--grey": true,
      })}>
      {type === "fixed" ? t("limit") : t("oracle")}
    </div>
  );
};

const StatusFilled: FC<LimitOrdersFragment$data> = ({ offer, remaining }) => {
  const filled = (Number(offer) - Number(remaining)) / Number(offer);
  return (
    <div
      className={clsx({
        "tag tag--borderless": true,
        "tag--red": filled < 0.25,
        "tag--orange": filled >= 0.25 && filled < 0.75,
        "tag--teal": filled >= 0.75,
      })}>
      {(filled * 100).toLocaleDecimal(2)}%
    </div>
  );
};

const Price: FC<LimitOrdersFragment$data> = ({ rate, deviation, pair }) => {
  switch (deviation) {
    case null:
    case undefined:
      return (
        <>
          <Decimal
            subscript
            decimals={12}
            round={4}
            amount={BigInt(rate)}
            symbol={pair.assetQuote.metadata.symbol}
            symbolClassName="decimal__symbol--small color-grey condensed fw-500"
            clip
          />
        </>
      );

    default:
      return (
        <div>
          <Decimal
            subscript
            decimals={12}
            round={4}
            amount={BigInt(rate)}
            symbol={pair.assetQuote.metadata.symbol}
            symbolClassName="decimal__symbol--small color-grey condensed fw-500"
            clip
          />
          <p className="inline-block color-grey condensed fs-12 fw-500 ml-1">
            ({Number(deviation) > 0 ? "+" : ""}
            {(Number(deviation) / 100).toLocaleDecimal(4)}%)
          </p>
        </div>
      );
  }
};

const PriceUsdSuffix: FC<{
  tokenPrice: bigint;
  quotePrice?: bigint | null;
}> = ({ tokenPrice, quotePrice }) => {
  const usdValue =
    tokenPrice > 0n && quotePrice && quotePrice > 0n
      ? toFiatAmount(quotePrice, tokenPrice)
      : undefined;

  if (!usdValue) return null;

  return (
    <span className="color-grey condensed fs-12 fw-500 ml-0.5">
      {"("}
      <Fiat
        amount={usdValue}
        decimals={12}
        symbol="$"
        padSymbol={false}
        as="span"
      />
      {")"}
    </span>
  );
};

const EditOrderPriceValue: FC<{
  price: bigint;
  quoteSymbol: string;
  quotePrice?: bigint | null;
}> = ({ price, quoteSymbol, quotePrice }) => (
  <div className="edit-limit-order__price-value mt-0.5 color-white">
    <Decimal
      subscript
      decimals={12}
      round={4}
      amount={price}
      symbol={quoteSymbol}
      symbolClassName="decimal__symbol--small color-grey condensed fw-500"
      clip
      as="span"
    />
    <PriceUsdSuffix tokenPrice={price} quotePrice={quotePrice} />
  </div>
);

const EditCurrentPriceValue: FC<{
  price: bigint;
  quoteSymbol: string;
  quotePrice?: bigint | null;
}> = ({ price, quoteSymbol, quotePrice }) => (
  <div className="edit-limit-order__price-value color-grey mt-0.5">
    <span className="decimal">
      {priceFormatter(price) || "0"}
      <span className="decimal__symbol decimal__symbol--small color-grey condensed fw-500">
        {quoteSymbol}
      </span>
    </span>
    <PriceUsdSuffix tokenPrice={price} quotePrice={quotePrice} />
  </div>
);

const EditOrderDeviationValue: FC<{ deviation: bigint }> = ({ deviation }) => {
  const { t } = useTranslation();
  const value = `${deviation > 0n ? "+" : ""}${(
    Number(deviation) / 100
  ).toLocaleDecimal(2)}`;

  return (
    <div className="edit-limit-order__deviation-value mt-0.5">
      <span className="color-white mono">{value}%</span>{" "}
      <span className="color-grey">{t("ofCurrentPrice")}</span>
    </div>
  );
};

const editOrderTxKey = (
  amount: bigint,
  selectedAddress?: string,
  nativeDenom?: string
) => [amount.toString(), selectedAddress ?? "", nativeDenom ?? ""].join(":");

export const History = () => {
  const { t } = useTranslation();
  return (
    <div className="trade__orders-table table-sticky table-sticky--left mt-2">
      <p className="condensed fs-14 color-grey text-center mt-2">
        {t("comingSoon")}
      </p>
    </div>
  );
};

const EditLimitOrder: FC<{
  k: LimitOrdersFragment$key;
  hideModal: () => void;
}> = ({ k, hideModal }) => {
  const { t } = useTranslation();
  const d = useFragment(orderFragment, k);
  useTradeBookSubscription(d?.pair.book.id);
  const { selected } = useAccounts();

  const orderPrice = BigInt(d.rate);
  const currentPrice = BigInt(d.pair.book.center || 0);
  const quotePrice = d.pair.assetQuote.price?.current;
  const quoteSymbol = d.pair.assetQuote.metadata.symbol;
  const deviation =
    d.type === "fixed" || d.deviation == null ? null : d.deviation;

  const assetOffer = d.side === "base" ? d.pair.assetBase : d.pair.assetQuote;
  const assetAsk = d.side === "base" ? d.pair.assetQuote : d.pair.assetBase;
  const { balance } = usePreloadedBalance();
  const originalAmount = BigInt(d.remaining);
  const [amount, setAmount] = useState(originalAmount);
  const [draftAmount, setDraftAmount] = useState(originalAmount);
  const funds = amount - originalAmount;
  const draftFunds = draftAmount - originalAmount;
  const selectedAccountAddress = selected?.address;
  const selectedAddress = selectedAccountAddress?.toString();
  const nativeDenom = balance?.asset.variants?.native?.denom;
  const coins = useMemo(
    () =>
      funds > 0n && nativeDenom
        ? [
            {
              denom: nativeDenom,
              amount: funds.toString(),
            },
          ]
        : [],
    [funds, nativeDenom]
  );
  const txKey = editOrderTxKey(amount, selectedAddress, nativeDenom);

  const commitAmount = (nextAmount: bigint) => {
    setDraftAmount(nextAmount);
    if (nextAmount === amount) return;

    setAmount(nextAmount);
  };

  const msg = useMemo(() => {
    if (amount === originalAmount) return null;
    if (!selectedAccountAddress) return null;

    return new MsgExecute(
      Account.fromAddress(selectedAccountAddress),
      coins,
      d.pair.address,
      {
        order: [[[d.side, priceKey(d), amount.toString()]], null],
      }
    );
  }, [
    amount,
    coins,
    d.deviation,
    d.pair.address,
    d.rate,
    d.side,
    originalAmount,
    selectedAccountAddress,
  ]);

  return (
    <div className="edit-limit-order flex dir-c gap-1">
      <div className="modal__header edit-limit-order__header">
        <div className="edit-limit-order__summary flex ai-c w-full">
          <div className="lp big">
            <IconDenom denom={d.pair.assetBase.metadata.symbol} />
            <IconDenom denom={d.pair.assetQuote.metadata.symbol} />
          </div>
          <div className="edit-limit-order__summary-content ml-1 flex ai-c grow">
            <LabelSide {...d} />
            <div className="ml-0.5">
              <LabelType {...d} />
            </div>
            <div className="edit-limit-order__details grow ml-6">
              <table className="table table--sm condensed color-grey">
                <tbody>
                  {deviation !== null ? (
                    <tr>
                      <td>{t("deviation")}:</td>
                      <td className="text-right">
                        <EditOrderDeviationValue deviation={deviation} />
                      </td>
                    </tr>
                  ) : null}
                  <tr>
                    <td>{t("orderPrice")}:</td>
                    <td className="text-right">
                      <EditOrderPriceValue
                        price={orderPrice}
                        quoteSymbol={quoteSymbol}
                        quotePrice={quotePrice}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>{t("currentPrice")}:</td>
                    <td className="text-right">
                      <EditCurrentPriceValue
                        price={currentPrice}
                        quoteSymbol={quoteSymbol}
                        quotePrice={quotePrice}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <InputQuantity
        containerClassName="mt-2"
        amount={draftAmount}
        setAmount={commitAmount}
        onSliderChange={setDraftAmount}
      />

      <div
        className="edit-limit-order__settlement-row row pad--xs mt-2"
        style={{ marginLeft: "-0.5rem", marginRight: "-0.5rem" }}>
        <div className="col-6 flex">
          <div className="card px-2 py-1 flex fs-12 condensed color-grey grow">
            {t("required")}:{" "}
            <div className="color-white ml-a">
              {nFormatter(draftFunds > 0n ? draftFunds : 0n, 6)}{" "}
              {assetOffer.metadata.symbol}
            </div>
          </div>
        </div>
        <div className="col-6 flex">
          <div className="card px-2 py-1 flex fs-12 condensed color-grey grow">
            {t("withdrawnClaimed")}:{" "}
            <div className="ml-a text-right">
              <div className="color-white mb-0.5">
                {nFormatter(draftFunds < 0n ? -draftFunds : 0n, 6)}{" "}
                {assetOffer.metadata.symbol}
              </div>
              {BigInt(d.filled) ? (
                <div className="color-white">
                  {nFormatter(BigInt(d.filled), 6)} {assetAsk.metadata.symbol}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <div className="modal__footer mt-4 px-3 py-2 flex ai-s wrap">
        <Button
          className="button--grey button--outline mr-1"
          onClick={hideModal}
          label={t("cancel")}
        />
        <div
          className="flex dir-c ai-e ml-a text-right"
          style={{
            minWidth: "6.375rem",
            whiteSpace: "nowrap",
          }}>
          <MsgProvider msg={msg}>
            {funds > 0n ? (
              <TxBalanceAccountButton
                key={txKey}
                required={{ asset: assetOffer, amount: funds }}
                disabled={draftAmount !== amount}
                hideSimulation
                className="button ml-1"
                label={t("confirm")}
                onSuccess={hideModal}
              />
            ) : (
              <TxButton
                key={txKey}
                disabled={draftAmount !== amount}
                hideSimulation
                className="button ml-1"
                label={t("confirm")}
                onSuccess={hideModal}
              />
            )}
          </MsgProvider>
        </div>
      </div>
    </div>
  );
};

const CancelLimitOrderModal: FC<{ hideModal: () => void }> = ({
  hideModal,
}) => {
  const { t } = useTranslation();
  return (
    <>
      <div className="modal__header">
        <h2>{t("cancelOrder")}</h2>
      </div>
      <p>{t("cancelOrderConfirmation")}</p>
      <div className="modal__footer mt-4 px-3 py-2 flex ai-s wrap">
        <Button
          className="button--grey button--outline mr-1"
          onClick={hideModal}
          label={t("cancel")}
        />
        <div className="block ml-a text-right">
          <TxButton
            className="button ml-1"
            label={t("confirm")}
            onSuccess={hideModal}
          />
        </div>
      </div>
    </>
  );
};
