import { Buffer } from "buffer";
import { FC, useState } from "react";
import { useFragment } from "react-relay";
import { Link } from "react-router-dom";
import { graphql } from "relay-runtime";
import { MsgExecute, THOR, signers } from "rujira.js";
import {
  AssetLabel,
  Decimal,
  Fiat,
  IconDenom,
  useTranslation,
} from "rujira.ui";

import { Icons } from "rujira.ui";
import { assetToTradeUrlSegment } from "../../services/assetUrl";
import { Subscription } from "../../services/useNodeSubscription";
import { DataView } from "../../trade/Trade";
import { BowPoolXykAccountFragment$key } from "./__generated__/BowPoolXykAccountFragment.graphql";
import {
  BowPoolXykFragment$data,
  BowPoolXykFragment$key,
} from "./__generated__/BowPoolXykFragment.graphql";
import { BowPoolXykRowFragment$key } from "./__generated__/BowPoolXykRowFragment.graphql";
import { BowPoolXykStateFragment$key } from "./__generated__/BowPoolXykStateFragment.graphql";
import { BowPoolXykSummaryFragment$key } from "./__generated__/BowPoolXykSummaryFragment.graphql";
import { BowPoolXykBalance } from "./BowPoolXykBalance";
import { BalanceProvider, BowXykDeposit } from "./BowPoolXykDeposit";
import { AddressLink, StrategyContainer } from "./Common";

const row = graphql`
  fragment BowPoolXykRowFragment on BowPoolXyk {
    id
    config {
      x {
        chain
        type
        metadata {
          symbol
        }
        price {
          current
        }
      }
      y {
        chain
        type
        metadata {
          symbol
        }
        price {
          current
        }
      }
      minQuote
      fee
    }
    state {
      x
      y
    }
  }
`;

const fragment = graphql`
  fragment BowPoolXykFragment on BowPoolXyk {
    ...BowPoolXykSummaryFragment
    ...BowPoolXykStateFragment
    id
    address
    config {
      x {
        asset
        chain
        type
        price {
          current
        }
        metadata {
          symbol
          decimals
        }
      }
      y {
        asset
        chain
        type
        price {
          current
        }
        metadata {
          symbol
          decimals
        }
      }
      shareAsset {
        variants {
          native {
            denom
          }
        }
      }
      minQuote
      fee
    }
    state {
      x
      y
      shares
    }
  }
`;

const accountFragment = graphql`
  fragment BowPoolXykAccountFragment on Account {
    address
    bow {
      id
      ...BowPoolXykBalanceFragment
    }
  }
`;

const subscription = graphql`
  subscription BowPoolXykSubscription($id: ID!) {
    node(id: $id) {
      ... on BowPoolXyk {
        state {
          x
          y
        }
      }
    }
  }
`;

export const BowPoolXykRow: FC<{ k: BowPoolXykRowFragment$key }> = ({ k }) => {
  const { t } = useTranslation("strategies");
  const { id, config, state } = useFragment(row, k);
  const url = `amm/xyk/${config.x.metadata.symbol}-${config.y.metadata.symbol}`;

  const xValue = config.x.price?.current
    ? (BigInt(config.x.price.current) * BigInt(state.x)) / 10n ** 12n
    : 0n;
  const yValue = config.y.price?.current
    ? (BigInt(config.y.price.current) * BigInt(state.y)) / 10n ** 12n
    : 0n;
  const halfValue = xValue || yValue;
  const value = halfValue ? halfValue * 2n : 0n;

  return (
    <tr className="pointer">
      <Subscription id={id} subscription={subscription} />
      <td>
        <Link
          to={url}
          className="flex ai-c mt-0.5 no-underline color-white w-full">
          <div className="lp">
            <IconDenom denom={config.x?.metadata.symbol || ""} />
            <IconDenom denom={config.y?.metadata.symbol || ""} />
          </div>
          <h3 className="condensed fs-22 lh-22 fs-lg-28 lh-lg-28 fw-400 mb-0 ml-1 nowrap">
            <AssetLabel
              asset={config.x}
              Container={({ children }) => (
                <small className="color-grey fs-14 fs-lg-16">{children}</small>
              )}
            />{" "}
            <span className="color-grey">/</span>{" "}
            <AssetLabel
              asset={config.y}
              Container={({ children }) => (
                <small className="color-grey fs-14 fs-lg-16">{children}</small>
              )}
            />
          </h3>
        </Link>
      </td>
      <td>
        <Link to={url} className="flex dir-c no-underline color-white w-full">
          <Fiat
            amount={value}
            symbol="$"
            decimals={8}
            className="fs-16 fs-md-18 color-white"
          />
          <div className="flex ai-c mt-0.5">
            <Decimal
              amount={BigInt(state.x || 0)}
              className="fs-12 fs-md-14 condensed color-grey"
              symbol={config.x?.metadata.symbol || ""}
            />
            <span className="block mx-1 color-grey opacity-8">/</span>
            <Decimal
              amount={BigInt(state.y || 0)}
              className="fs-12 fs-md-14 condensed color-grey"
              symbol={config.y?.metadata.symbol || ""}
            />
          </div>
        </Link>
      </td>
      <td className="text-right">{t("comingSoon")}</td>
      <td className="text-right">
        <Link to={url} className="block w-full text-right">
          <div className="tag tag--orange">{t("ammXyk")}</div>
        </Link>
      </td>

      <td className="w-3">
        <Link to={url} className="block w-full text-right">
          <Icons.AngleRight className="w-3 h-3 color-grey" />
        </Link>
      </td>
    </tr>
  );
};

export const BowPoolXyk: FC<{
  k: BowPoolXykFragment$key;
  a?: BowPoolXykAccountFragment$key;
}> = ({ k, a }) => {
  const { t } = useTranslation("strategies");
  const account = useFragment(accountFragment, a);
  const data = useFragment(fragment, k);

  const xValue =
    (data.config.x.price?.current &&
      BigInt(data.config.x.price.current) * BigInt(data.state.x)) ||
    0n;
  const yValue =
    (data.config.y.price?.current &&
      BigInt(data.config.y.price.current) * BigInt(data.state.y)) ||
    0n;
  const value = xValue + yValue;

  console.log(data.config.y);
  //console.log(JSON.stringify(data.config.x));

  return (
    <StrategyContainer>
      <Subscription id={data.id} subscription={subscription} />
      <div className="flex ai-c wrap">
        <h1 className="h1 mb-0 mr-2">
          <AssetLabel
            asset={data.config.x}
            Container={({ children }) => (
              <small className="color-grey fs-20 fs-lg-28">{children}</small>
            )}
          />{" "}
          <small className="color-grey">/</small>{" "}
          <AssetLabel
            asset={data.config.y}
            Container={({ children }) => (
              <small className="color-grey fs-20 fs-lg-28">{children}</small>
            )}
          />
        </h1>
        <div className="lp big mr-3">
          <IconDenom denom={data.config.x.metadata.symbol} />
          <IconDenom denom={data.config.y.metadata.symbol} />
        </div>
        <div className="tag tag--lg tag--orange my-1.5">{t("ammXykFull")}</div>
      </div>
      <div className="row pad wrap mt-1">
        <div className="col-12 col-md-8 mt-2">
          <div className="row pad wrap">
            <div className="col-12 col-sm-6">
              <div className="card h-full p-3 flex dir-c">
                <h3 className="fs-16 lh-22 fw-400 color-grey">
                  {t("strategyTvl")}
                </h3>
                <Fiat
                  symbol="$"
                  amount={value}
                  decimals={20}
                  className="fs-22 fs-md-32 condensed fw-500 mt-1"
                />
                <div className="flex ai-c mt-1">
                  <IconDenom
                    denom={data.config.x.metadata.symbol}
                    className="h-2 w-2 mr-1"
                  />
                  <Decimal
                    amount={BigInt(data.state.x)}
                    round={4}
                    className="fs-16 fs-md-18 lh-16 lh-md-18 condensed color-grey"
                  />
                </div>
                <div className="flex ai-c mt-0.5">
                  <IconDenom
                    denom={data.config.y.metadata.symbol}
                    className="h-2 w-2 mr-1"
                  />
                  <Decimal
                    amount={BigInt(data.state.y)}
                    round={4}
                    className="fs-16 fs-md-18 lh-16 lh-md-18 condensed color-grey"
                  />
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-6 mt-2 mt-sm-0 show-sm">
              <div className="card h-full p-3 flex dir-c">
                <h3 className="fs-16 lh-22 fw-400 color-grey">APR</h3>
                <p className="fs-22 fs-md-32 condensed fw-500 mt-1">
                  Soon&trade;
                </p>
              </div>
            </div>
            <div className="col-12 mt-4">
              <BalanceProvider assets={data.config}>
                <BowXykDeposit
                  address={data.address}
                  config={{ fee: BigInt(data.config.fee) }}
                  state={{
                    x: BigInt(data.state.x),
                    y: BigInt(data.state.y),
                    shares: BigInt(data.state.shares),
                  }}
                  priceX={data.config.x.price?.current || 0n}
                  priceY={data.config.y.price?.current || 0n}
                />
              </BalanceProvider>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4 mt-2 gradient-card-container">
          <BowPoolXykBalance
            k={account?.bow.find(
              (a) =>
                Buffer.from(a.id, "base64").toString() ===
                accountId(account.address || "", data.config)
            )}
            id={account ? accountId(account.address, data.config) : undefined}
            toMsg={(amount, asset) =>
              amount && asset.variants?.native?.denom && account
                ? new MsgExecute(
                    { address: account.address, network: THOR },
                    signers.cosmos.coins(
                      amount.toString(),
                      asset.variants.native.denom
                    ),
                    data.address,
                    { withdraw: {} }
                  )
                : null
            }
          />
        </div>
      </div>
      <hr className="hr mt-8 mb-8 opacity-4" />
      <div className="row wrap pad">
        <div className="col-12 col-md-6">
          <PoolBowSummary k={data} />
        </div>
        <div className="col-12 col-md-6 mt-2 mt-md-0 flex dir-c">
          <BowState k={data} />
        </div>
      </div>
    </StrategyContainer>
  );
};

const accountId = (
  address: string,
  config: BowPoolXykFragment$data["config"]
) => {
  return `BowAccount:${address}/${config.shareAsset.variants.native?.denom}`;
};

const summary = graphql`
  fragment BowPoolXykSummaryFragment on BowPoolXyk {
    address
    quotes {
      pair {
        address
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
      }
    }
  }
`;

const PoolBowSummary: FC<{ k: BowPoolXykSummaryFragment$key }> = ({ k }) => {
  const d = useFragment(summary, k);
  const { t } = useTranslation("strategies");
  const pair = `${d?.quotes?.pair.assetBase.metadata.symbol}/${d?.quotes?.pair.assetQuote.metadata.symbol}`;
  return (
    <>
      <h3 className="h3">{t("strategyDetails")}</h3>
      <h4 className="h4">{t("strategyLabel")}: XYK</h4>
      <p className="p">{t("xykDescription", { pair })}</p>
      <p className="p">
        {t("moreInfo")}{" "}
        <a
          target="_blank"
          href="https://docs.rujira.network/strategies#xyk-strategy"
          className="color-white hover-primary1 iflex ai-c">
          https://docs.rujira.network/strategies#xyk-strategy
          <Icons.External className="w-2 h-2 ml-1" />
        </a>
      </p>
      <h4 className="h4 mt-5">{t("liquidityWithdrawals")}</h4>
      <p className="p">{t("xykWithdrawalInfo")}</p>
      <h4 className="h4 mt-5">{t("contracts")}</h4>
      {d.quotes && (
        <p className="p mb-0.5">
          {t("tradingPair")}: <AddressLink address={d.quotes.pair.address} />
        </p>
      )}
      <p className="p">
        {t("poolContract")}: <AddressLink address={d.address} />
      </p>
    </>
  );
};

const state = graphql`
  fragment BowPoolXykStateFragment on BowPoolXyk {
    config {
      x {
        chain
        metadata {
          symbol
        }
      }
      y {
        chain
        metadata {
          symbol
        }
      }
    }
    quotes {
      pair {
        tick
        bookV2 {
          ...OrderBookFragment
        }
      }
    }
    summary {
      spread
      depthBid
      depthAsk
      volume
      utilization
    }
    trades(first: 20) {
      edges {
        ...HistoryFragment
      }
    }
  }
`;

const BowState: FC<{ k: BowPoolXykStateFragment$key }> = ({ k }) => {
  const data = useFragment(state, k);
  const { t } = useTranslation("strategies");
  const [truncate, setTruncate] = useState(6);
  return (
    <div className="card p-3 grow flex dir-c">
      <div
        className="flex mb-2 ai-c"
        data-tooltip-float={true}
        data-tooltip-id="global-tip"
        data-tooltip-html={`<div class="w-20">${t("ammRoundingTooltip")}</div>`}>
        <h4>{t("liveMarketMaking")}</h4>
        <Icons.Info className="w-2 h-2 ml-0.5 color-grey" />
        {data.config.x && data.config.y && (
          <Link
            to={`../../trade/${assetToTradeUrlSegment(data.config.x)}/${assetToTradeUrlSegment(data.config.y)}`}
            relative="path"
            className="color-white hover-primary1 iflex ai-c">
            <Icons.External className="w-2 h-2 ml-1" />
          </Link>
        )}
      </div>
      <div className="trade__book">
        <DataView
          truncate={truncate}
          //base={data.config.x?.metadata.symbol || ""}
          //quote={data.config.y?.metadata.symbol || ""}
          //tick={Number(data.quotes?.pair.tick)}
          o={data.quotes?.pair.bookV2 || undefined}
          setTruncate={setTruncate}
          //h={data.trades?.edges?.filter((x) => !!x) || undefined}
        />
      </div>
    </div>
  );
};
