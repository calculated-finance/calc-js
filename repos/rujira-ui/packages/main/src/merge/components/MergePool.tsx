import clsx from "clsx";
import { FC, useEffect, useTransition } from "react";
import { useRefetchableFragment } from "react-relay";
import { graphql } from "relay-runtime";
import { Decimal, formatApr, useTranslation, nFormatter, tokens } from "rujira.ui";
import { useNodeSubscription } from "../../services/useNodeSubscription";
import { MergePoolFragment$key } from "./__generated__/MergePoolFragment.graphql";
import { Graph } from "./Graph";

const fragment = graphql`
  fragment MergePoolFragment on MergePool
  @refetchable(queryName: "MergePoolRefetchQuery") {
    id
    address
    currentRate
    mergeAsset {
      asset
      metadata {
        symbol
        decimals
      }
    }
    mergeSupply
    rujiAllocation
    startRate
    status {
      merged
      apr {
        value
        status
      }
    }
  }
`;

const subscription = graphql`
  subscription MergePoolSubscription($id: ID!) {
    node(id: $id) {
      ... on MergePool {
        currentRate
        status {
          merged
        }
      }
    }
  }
`;

export const MergePool: FC<{ k: MergePoolFragment$key }> = ({ k }) => {
  const { t } = useTranslation("merge");
  const [data, refetch] = useRefetchableFragment(fragment, k);
  const [, transition] = useTransition();
  useEffect(() => {
    transition(() => {
      refetch({}, { fetchPolicy: "store-and-network" });
    });
  }, []);
  const completed = Number(data.status?.merged || 0) / Number(data.mergeSupply);
  useNodeSubscription(subscription, data.id);

  const src =
    tokens[
      data.mergeAsset.metadata.symbol.toLowerCase() as keyof typeof tokens
    ];

  return (
    <div className="col-12 col-lg-6 mt-5 mt-sm-3 flex ai-c jc-c wrap">
      <div
        className="merge__graph-container"
        data-tooltip-float={true}
        data-tooltip-id="global-tip"
        data-tooltip-html={`
          ${data.mergeAsset.metadata.symbol} Merged<br/><div class="fs-20 mt-0.5 fw-500">${nFormatter(BigInt(data.status?.merged || 0), 3, 8)}<span class="${clsx(
            {
              "ml-0.5 fs-16": true,
              "color-red": completed >= 0.8,
              "color-orange": completed < 0.8 && completed >= 0.5,
              "color-teal": completed < 0.5,
            }
          )}">(${(completed * 100).toLocaleDecimal(2)}%)</span></div>`}>
        <Graph percentage={completed * 100} />
        <img src={src} alt={data.mergeAsset.metadata.symbol} />
        <div className="merge__graph-container-pct">
          {Math.round(completed * 100)}%
        </div>
      </div>
      <div className="break" />
      <div className="flex dir-c ai-s merge__graph-stat">
        <h3 className="fs-16 lh-22 fw-400 color-grey">{t("allocation")}</h3>
        <div className="fs-28 condensed fw-500">
          {nFormatter(BigInt(data.rujiAllocation), 2, 8)} RUJI
        </div>
        <div className="color-grey condensed fs-16 fw-500">
          for max {nFormatter(BigInt(data.mergeSupply), 2)}{" "}
          {data.mergeAsset.metadata.symbol}
        </div>
      </div>
      <div className="flex dir-c ai-s merge__graph-stat">
        <h3 className="fs-16 lh-22 fw-400 color-grey">
          {t("effectiveApr")}
        </h3>
        <div className="fs-28 condensed fw-500 color-teal">
          {" "}
          {formatApr(data?.status?.apr)}
        </div>
        {/* <div className="color-grey condensed fs-14 fw-500">
          *Unallocated RUJI distributed{" "}
        </div> */}
        {/* <div className="fs-28 condensed fw-500">
          {nFormatter(BigInt(data.status?.merged || 0), 0, 8)}{" "}
          {data.mergeAsset.metadata.symbol}
        </div>
        <div
          className={clsx({
            "condensed fs-16 fw-500": true,
            "color-red": completed >= 0.8,
            "color-orange": completed < 0.8 && completed >= 0.5,
            "color-teal": completed < 0.5,
          })}>
          {(completed * 100).toLocaleDecimal(2)}%
        </div> */}
      </div>
      <div className="flex dir-c ai-s merge__graph-stat">
        <h3 className="fs-16 lh-22 fw-400 color-grey">
          {t("currentRate")}
        </h3>
        <Decimal
          decimals={12}
          className="fs-28 condensed fw-500"
          amount={BigInt(data.currentRate)}
        />
        <Decimal
          symbol="from"
          symbolLeft={true}
          decimals={12}
          className="condensed fs-16 fw-500 color-grey"
          amount={BigInt(data.startRate)}
        />
      </div>
    </div>
  );
};
