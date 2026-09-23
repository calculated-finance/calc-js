import { Buffer } from "buffer";
import {
  FC,
  Suspense,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import {
  PreloadedQuery,
  useFragment,
  useLazyLoadQuery,
  usePreloadedQuery,
  useQueryLoader,
} from "react-relay";
import { graphql } from "relay-runtime";
import { Account, Asset, MsgExecute, MsgMulti, signers } from "rujira.js";
import {
  Button,
  SimulationState,
  SwapSelect,
  useTranslation,
  Warning,
} from "rujira.ui";
import { MsgProvider, TxButton } from "../../common/components/TxButton";
import { useOraclePrice } from "../../common/OraclePrice";
import { useAccounts } from "../../services/accounts";
import { Subscription } from "../../services/useNodeSubscription";
import { ChunkSlider } from "../../trade/components/InputQuantity";
import { useSimulation } from "../../trade/hooks/useSimulation";
import { PositionSwapBookFragment$key } from "./__generated__/PositionSwapBookFragment.graphql";
import { PositionSwapConfigQuery } from "./__generated__/PositionSwapConfigQuery.graphql";
import { PositionSwapQuery } from "./__generated__/PositionSwapQuery.graphql";
import { AdjustmentSummary } from "./Common";
import { Cdp } from "./utils";

const configQuery = graphql`
  query PositionSwapConfigQuery($query: String!) {
    finV2(first: 20, query: $query, sortBy: VOLUME_USD, sortDir: DESC) {
      edges {
        node {
          id
          address
          assetBase {
            asset
            metadata {
              symbol
            }
          }
          assetQuote {
            asset
            metadata {
              symbol
            }
          }
        }
      }
    }
    ghostCredit {
      address
      collaterals {
        asset {
          asset
          type
          chain
          metadata {
            decimals
            symbol
          }
          variants {
            native {
              denom
            }
          }
        }
        ratio
      }
    }
  }
`;

const query = graphql`
  query PositionSwapQuery($id: ID!, $oracle: ID!) {
    positionSwapContract: node(id: $id) {
      ... on FinPair {
        id
        address
        book {
          ...PositionSwapBookFragment
        }
      }
    }
    oraclePrice: node(id: $oracle) {
      id
      ...OraclePriceFragment
    }
  }
`;

const f = graphql`
  fragment PositionSwapBookFragment on FinBook {
    id
    pair {
      assetBase {
        asset
      }
      assetQuote {
        asset
      }
    }
    bids {
      price
      total
      value
    }
    asks {
      price
      total
      value
    }
  }
`;

const sub1 = graphql`
  subscription PositionSwapBookSubscription($id: ID!) {
    node(id: $id) {
      ... on FinBook {
        ...PositionSwapBookFragment
      }
    }
  }
`;

const sub2 = graphql`
  subscription PositionSwapOracleSubscription($id: ID!) {
    node(id: $id) {
      ... on ThorchainOraclePrice {
        ...OraclePriceFragment
      }
    }
  }
`;

export const Swap: FC<{
  hideModal: () => void;
  p: Cdp<Asset>;
  registry: string;
}> = ({ hideModal, p, registry }) => {
  const [fromIndex, setFromIndex] = useState(0);
  const fromCollateral = p.collaterals[fromIndex] || p.collaterals[0];
  const fromAsset = fromCollateral.asset.asset;
  const [fromAmount, setFromAmount] = useState<bigint>(fromCollateral.amount);

  useEffect(() => {
    setFromAmount(p.collaterals[fromIndex]?.amount ?? 0n);
  }, [fromIndex]);

  const data = useLazyLoadQuery<PositionSwapConfigQuery>(configQuery, {
    query: fromCollateral.asset.metadata.symbol,
  });

  const routableAssets = new Set(
    (data.finV2.edges || []).flatMap((e) => {
      if (!e?.node) return [];
      const { assetBase, assetQuote } = e.node;
      if (assetBase.asset === fromAsset) return [assetQuote.asset];
      if (assetQuote.asset === fromAsset) return [assetBase.asset];
      return [];
    })
  );

  const options = (data.ghostCredit?.collaterals || [])
    .filter(
      (x) => x.asset.asset !== fromAsset && routableAssets.has(x.asset.asset)
    )
    .map((x) => ({ asset: x.asset, ratio: x.ratio }));
  const [to, setTo] = useState<Asset | undefined>(
    (
      options.find((a) =>
        fromAsset === "BTC-BTC"
          ? a.asset.asset === "ETH-ETH"
          : a.asset.asset === "BTC-BTC"
      ) || options[0]
    )?.asset
  );

  const optionAssets = options.map((o) => o.asset.asset).join(",");

  useEffect(() => {
    if (to && options.some((o) => o.asset.asset === to.asset)) return;
    setTo(options[0]?.asset);
  }, [fromAsset, optionAssets]);

  const target = useMemo(
    () =>
      data.finV2.edges?.find(
        (a) =>
          a?.node &&
          to &&
          ((a.node.assetBase.asset === fromAsset &&
            a.node.assetQuote.asset === to.asset) ||
            (a.node.assetQuote.asset === fromAsset &&
              a.node.assetBase.asset === to.asset))
      )?.node!,
    [data.finV2.edges, fromAsset, to?.asset]
  );
  const fromOptions = p.collaterals.map((c) => ({
    asset: c.asset,
    balance: c.amount,
    valueUsd: c.value,
  }));
  const fromValue =
    fromCollateral.amount > 0n
      ? (fromCollateral.value * fromAmount) / fromCollateral.amount
      : 0n;
  const toRatio = options.find((o) => o.asset.asset === to?.asset)?.ratio ?? 0n;

  const { selected } = useAccounts();
  const [simulationState, setSimulationState] = useState<
    SimulationState | undefined
  >();

  const msg = useMemo(() => {
    const collateralDenom = fromCollateral.asset.variants?.native?.denom;
    if (!fromAmount) return null;
    if (!collateralDenom) return null;
    if (!selected) return null;
    if (!target) return null;
    const acc = Account.fromAddress(selected.address);

    return new MsgMulti(acc, [
      new MsgExecute(acc, [], registry, {
        account: {
          addr: p.account.address,
          msgs: [
            {
              execute: {
                contract_addr: target.address,
                msg: Buffer.from(JSON.stringify({ swap: {} })).toString(
                  "base64"
                ),
                funds: signers.cosmos.coins(
                  fromAmount.toString(),
                  collateralDenom
                ),
              },
            },
          ],
        },
      }),
    ]);
  }, [target, fromAmount]);

  const [q, loadQuery] = useQueryLoader<PositionSwapQuery>(query);
  const [_, transition] = useTransition();

  useEffect(() => {
    if (!target) return;
    const oracleSymbol =
      fromAsset === target.assetBase.asset
        ? target.assetQuote.metadata.symbol
        : target.assetBase.metadata.symbol;
    transition(() => {
      loadQuery(
        {
          id: target.id,
          oracle: Buffer.from(`ThorchainOraclePrice:${oracleSymbol}`).toString(
            "base64"
          ),
        },
        { fetchPolicy: "store-and-network" }
      );
    });
  }, [target]);

  const { t } = useTranslation();

  return (
    <MsgProvider msg={msg}>
      <div style={{ marginLeft: "-0.5rem", marginRight: "-0.5rem" }}>
        <div className="row wrap gap-y-2 pad--sm mt-3">
          <div className="col-12 col-md-6">
            <h3 className="fs-14 fw-500 color-grey mb-1 ml-2">{t("from")}</h3>
            <SwapSelect
              selected={fromCollateral.asset}
              options={p.collaterals.length > 1 ? fromOptions : undefined}
              onSelect={(a) => {
                const idx = p.collaterals.findIndex(
                  (c) => c.asset.asset === a.asset
                );
                if (idx !== -1) setFromIndex(idx);
              }}
              amount={fromAmount}
              onChangeAmount={setFromAmount}
              max={fromCollateral.amount}
              value={fromValue}
              full
              className="bg-black"
            />
            <div className="flex ai-c mt-1.5 mx-2">
              <a
                className="fs-12 condensed fw-500 color-grey mr-0.5 pointer"
                onClick={() => setFromAmount(0n)}>
                0%
              </a>
              <ChunkSlider
                amount={fromAmount}
                setAmount={setFromAmount}
                max={fromCollateral.amount}
              />
              <a
                className="fs-12 condensed fw-500 color-grey ml-0.5 pointer"
                onClick={() => setFromAmount(fromCollateral.amount)}>
                100%
              </a>
            </div>
          </div>
          {to ? (
            <Suspense
              fallback={
                <To
                  p={p}
                  asset={to}
                  amount={0n}
                  onSelect={setTo}
                  options={options}
                  simulationState={simulationState}
                />
              }>
              {target && q ? (
                <Simulate
                  q={q}
                  p={p}
                  asset={to}
                  ratio={toRatio}
                  amount={fromAmount}
                  fromIndex={fromIndex}
                  onSelect={setTo}
                  options={options}
                  simulationState={simulationState}
                />
              ) : (
                <To
                  p={p}
                  asset={to}
                  amount={0n}
                  onSelect={setTo}
                  options={options}
                  simulationState={simulationState}
                />
              )}
            </Suspense>
          ) : (
            <div className="col-12 col-md-6">
              <h3 className="fs-14 fw-500 color-grey mb-1 ml-2">{t("to")}</h3>
              <Warning
                className="warning--sm condensed flex ai-c"
                color="orange">
                <div className="text-left fs-14">{t("noSwapRouteFound")}</div>
              </Warning>
            </div>
          )}
        </div>
      </div>
      <div className="modal__footer mt-4 px-3 py-2 flex ai-s jc-e wrap">
        <Button
          className="button--grey button--outline"
          onClick={hideModal}
          label={t("common:cancel")}
        />
        <div className="block ml-a text-right">
          {target ? (
            <TxButton
              label={t("swapCollateral")}
              onSuccess={hideModal}
              hideSimulation
              onSimulation={setSimulationState}
            />
          ) : (
            <Button disabled label={t("noSwapRouteFound")} />
          )}
        </div>
      </div>
    </MsgProvider>
  );
};

const Simulate: FC<{
  q: PreloadedQuery<PositionSwapQuery>;
  p: Cdp<Asset>;
  asset: Asset;
  ratio: bigint;
  amount: bigint;
  fromIndex: number;
  options: {
    asset: Asset;
  }[];
  simulationState?: SimulationState;
  onSelect: (opt: Asset) => void;
}> = ({
  asset,
  ratio,
  amount,
  fromIndex,
  onSelect,
  q,
  options,
  p,
  simulationState,
}) => {
  const x = usePreloadedQuery(query, q);
  const data = useFragment<PositionSwapBookFragment$key>(
    f,
    x.positionSwapContract?.book
  );

  const simulation = useSimulation(
    x.positionSwapContract?.address || "",
    p.collaterals[fromIndex]?.asset.variants?.native?.denom || "",
    amount
  );

  const returned = simulation?.returned || 0n;
  const price = useOraclePrice(x.oraclePrice);
  const swapped =
    price && returned
      ? Cdp.swapCollateral(
          p,
          amount,
          returned,
          price,
          ratio,
          asset,
          (a, b) => a.asset === b.asset,
          fromIndex
        )
      : p;

  return (
    <>
      {data && <Subscription subscription={sub1} id={data.id} />}
      {x.oraclePrice?.id && (
        <Subscription subscription={sub2} id={x.oraclePrice.id} />
      )}
      <To
        p={swapped}
        asset={asset}
        amount={returned}
        price={price}
        onSelect={onSelect}
        options={options}
        simulationState={simulationState}
      />
    </>
  );
};

const To: FC<{
  p: Cdp<Asset>;
  asset: Asset;
  amount: bigint;
  price?: bigint;
  onSelect: (opt: Asset) => void;
  options: {
    asset: Asset;
  }[];
  simulationState?: SimulationState;
}> = ({ p, asset, amount, price, onSelect, options, simulationState }) => {
  const { t } = useTranslation();
  const value =
    price !== undefined && amount ? (amount * price) / 10n ** 12n : undefined;
  return (
    <>
      <div className="col-12 col-md-6">
        <h3 className="fs-14 fw-500 color-grey mb-1 ml-2">{t("to")}</h3>

        <SwapSelect
          selected={asset}
          value={value}
          onSelect={onSelect}
          options={
            options.length > 1
              ? options.map((x) => ({ asset: x.asset }))
              : undefined
          }
          amount={amount}
          full
          className="bg-black"
        />
      </div>

      <AdjustmentSummary
        p={p}
        simulationState={simulationState}
        hideInterestRate
      />
    </>
  );
};
