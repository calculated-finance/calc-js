import clsx from "clsx";
import { FC, useEffect } from "react";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import { useTranslation } from "rujira.ui";

import { Icons } from "rujira.ui";
import { Drawer } from "vaul";
import { OrderType, Side } from "../../types.ts";
import { useCalcMetadata } from "../Calc.tsx";
import { useOrderType } from "../Context.tsx";
import { ClassicSubmitFragment$key } from "./__generated__/ClassicSubmitFragment.graphql.ts";
import { Limit } from "./Limit.tsx";
import { Market } from "./Market.tsx";
import { Oracle } from "./Oracle.tsx";
import { Recurring } from "./Recurring.tsx";
import { Scale } from "./Scale.tsx";

const fragment = graphql`
  fragment ClassicSubmitFragment on FinPair {
    ...MarketSubmitFragment
    ...OracleSubmitFragment
    ...LimitSubmitFragment
    ...RecurringSubmitFragment

    address
    tick
    assetBase {
      metadata {
        symbol
      }
    }
    assetQuote {
      metadata {
        symbol
      }
    }
    oracleBase {
      id
      price
    }
    oracleQuote {
      id
      price
    }
    book {
      bids {
        price
      }
      center
      asks {
        price
      }
    }
    feeMaker
    feeTaker
  }
`;

export const LaunchModal: FC<{
  k: ClassicSubmitFragment$key;
  onClick: (s: Side) => void;
}> = ({ k, onClick }) => {
  const { t } = useTranslation();
  const d = useFragment(fragment, k);

  return (
    <div className="trade__launch">
      <Drawer.Trigger
        className="button button--small button--blue w-full"
        onClick={() => onClick(Side.Quote)}>
        {t("buyAsset", { asset: d.assetBase.metadata.symbol })}
      </Drawer.Trigger>
      <Drawer.Trigger
        className="button button--small button--red w-full"
        onClick={() => onClick(Side.Base)}>
        {t("sellAsset", { asset: d.assetBase.metadata.symbol })}
      </Drawer.Trigger>
    </div>
  );
};

interface Props {
  k: ClassicSubmitFragment$key;
  side: Side;
}

export const Classic: FC<Props> = (props) => {
  const { t } = useTranslation();
  const d = useFragment(fragment, props.k);
  const [type, setType] = useOrderType();
  const metadata = useCalcMetadata();

  const hasTrackingOrders = !!(d.oracleBase && d.oracleQuote);
  const hasRecurringOrders = !!metadata;
  const effectiveType =
    type === OrderType.Tracking && !hasTrackingOrders
      ? OrderType.Limit
      : type;

  useEffect(() => {
    if (type === OrderType.Tracking && !hasTrackingOrders) {
      setType(OrderType.Limit);
    }
  }, [hasTrackingOrders, setType, type]);

  return (
    <div className="trade__submit-scroll">
      <nav className="trade__submit-order-tabs tabs tabs--sm">
        <a
          className={clsx({
            "selected outline": effectiveType === OrderType.Market,
          })}
          onClick={() => {
            setType(OrderType.Market);
          }}>
          {t("market")}
        </a>
        <a
          className={clsx({
            "selected outline": effectiveType === OrderType.Limit,
          })}
          onClick={() => {
            setType(OrderType.Limit);
          }}>
          {t("limit")}
        </a>
        <a
          className={clsx({
            "selected outline":
              effectiveType === OrderType.Scale ||
              effectiveType === OrderType.Recurring ||
              effectiveType === OrderType.Tracking,
          })}>
          <span
            className="trade__submit-order-label"
            data-reserve={t("advanced")}>
            <span>
              {effectiveType === OrderType.Tracking
                ? t("tracking")
                : effectiveType === OrderType.Recurring
                  ? t("recurring")
                  : effectiveType === OrderType.Scale
                    ? t("scale")
                    : t("advanced")}
            </span>
          </span>
          <Icons.AngleDown style={{ marginLeft: "0.25rem" }} />
          <nav>
            {effectiveType !== OrderType.Scale && (
              <a
                className="flex ai-c"
                style={{ fontSize: "0.75rem" }}
                onClick={() => setType(OrderType.Scale)}>
                {t("scale")}
              </a>
            )}
            {hasTrackingOrders && effectiveType !== OrderType.Tracking && (
              <a
                className="flex ai-c"
                style={{ fontSize: "0.75rem" }}
                onClick={() => setType(OrderType.Tracking)}>
                {t("tracking")}
              </a>
            )}
            {hasRecurringOrders && effectiveType !== OrderType.Recurring && (
              <a
                className="flex ai-c"
                style={{ fontSize: "0.75rem" }}
                onClick={() => setType(OrderType.Recurring)}>
                {t("recurring")}
              </a>
            )}
          </nav>
        </a>
      </nav>
      {effectiveType === OrderType.Limit && <Limit k={d} side={props.side} />}
      {effectiveType === OrderType.Tracking && d.oracleBase && d.oracleQuote && (
        <Oracle
          k={d}
          side={props.side}
          oracleBase={BigInt(d.oracleBase.price)}
          oracleQuote={BigInt(d.oracleQuote.price)}
        />
      )}
      {effectiveType === OrderType.Market && <Market k={d} side={props.side} />}
      {effectiveType === OrderType.Recurring && (
        <Recurring k={d} side={props.side} />
      )}
      {effectiveType === OrderType.Scale && <Scale k={d} side={props.side} />}
    </div>
  );
};

export const SubmitFallBack: FC = () => {
  return (
    <>
      <div className="trade__submit">
        <nav className="tabs tabs--sm tabs--full">
          <a className="skeleton" />
          <a className="skeleton" />
        </nav>

        <div className="mt-2">
          <div className="grow trade__submit-switch trade__submit-switch--quote">
            <button className="skeleton" />
            <button className="skeleton" />
          </div>
        </div>
        <div className="row wrap pad-mini mt-1.5">
          <div className="col">
            <div className="skeleton h-5 w-full br-1 block" />
          </div>

          <div className="flex ai-c px-0.5 mt-1 mt-xs-0 jc-lg-c mx-a">
            <div className="skeleton w-3.5 h-2.5 br-1" />
            <div className="skeleton w-3.5 h-2.5 br-1 ml-0.5" />
            <div className="skeleton w-3.5 h-2.5 br-1 ml-0.5" />
            <div className="skeleton w-3.5 h-2.5 br-1 ml-0.5" />
          </div>
        </div>

        <div className="skeleton h-5 w-full br-1 block mt-1" />
        <div className="skeleton h-5 w-full br-1 block mt-a" />
      </div>
    </>
  );
};
