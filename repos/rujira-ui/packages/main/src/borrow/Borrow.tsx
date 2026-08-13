import { Buffer } from "buffer";
import { FC, Suspense, useEffect, useMemo, useState } from "react";
import {
  useFragment,
  useLazyLoadQuery,
  useRefetchableFragment,
  useRelayEnvironment,
} from "react-relay";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { graphql, requestSubscription } from "relay-runtime";
import {
  Account,
  Asset,
  bigintMin,
  encodeAddress,
  MsgExecute,
  MsgMulti,
  MsgSecureWithdraw,
  MsgSend,
  MsgSwap,
  THOR,
} from "rujira.js";
import {
  Decimal,
  Fiat,
  IconDenom,
  LoaderWithContent,
  SimulationState,
  SwapSelect,
  TokenSelect,
  TranslationProvider,
  clipAmountString,
  useGlobalModalContext,
  useLocale,
  useTranslation,
} from "rujira.ui";

import { Icons } from "rujira.ui";
import {
  BalanceCompact,
  BalanceProvider,
  usePreloadedBalances,
} from "../common/components/Balance";
import {
  collectDestinationOptions,
  Destination,
  DestinationOption,
  DestinationSelectModal,
} from "../common/components/Destination";
import {
  MsgProvider,
  TxBalanceAccountButton,
} from "../common/components/TxButton";
import { useOraclePrice } from "../common/OraclePrice";
import { usePreloadedAccountData } from "../services/accountData";
import { useAccounts } from "../services/accounts";
import {
  assetToNetworkParam,
  assetToTradeUrlSegment,
  findAssetByUrlSegment,
  normalizeChainParam,
} from "../services/assetUrl";
import { Quote, useQuote } from "../services/useQuote";
import { getStaticProductSeo, ProductSeoHelmet } from "../seo";
import { ChunkSlider } from "../trade/components/InputQuantity";
import { BorrowAccountFragment$key } from "./__generated__/BorrowAccountFragment.graphql";
import { BorrowVaultPricesFragment$key } from "./__generated__/BorrowVaultPricesFragment.graphql";
import { BorrowNextFragment$key } from "./__generated__/BorrowNextFragment.graphql";
import {
  BorrowQuery,
  BorrowQuery$data,
} from "./__generated__/BorrowQuery.graphql";
import { NextQuery } from "./__generated__/NextQuery.graphql";
import { LiquidationPrice, LtvLabel } from "./components/Health";
import { PositionRow } from "./components/Position";
import { Cdp, computeProjectedRate } from "./components/utils";

const tooltipHtml = (text: string) =>
  `<div class="w-30 text-left">${text}</div>`;

const query = graphql`
  query BorrowQuery {
    ghostCredit {
      ...BorrowVaultPricesFragment
      address
      adjustmentThreshold
      collaterals {
        asset {
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
        price {
          ...OraclePriceFragment
        }
        ratio
      }
      vaults {
        price {
          ...OraclePriceFragment
        }
        borrower {
          address
          asset {
            asset
            type
            chain
            metadata {
              symbol
              decimals
            }

            variants {
              secured {
                asset
                type
                chain
                metadata {
                  symbol
                  decimals
                }
              }
              native {
                denom
              }
            }
          }
          available
          current
          limit
          shares
          vault {
            interest {
              baseRate
              step1
              step2
              targetUtilization
            }
            status {
              debtRate
              depositPool {
                size
              }
              debtPool {
                size
              }
            }
          }
        }
      }
    }
    thorchainV2 {
      rune {
        metadata {
          symbol
        }
        price {
          current
        }
      }
      pools {
        status
        asset {
          asset
          type
          chain
          metadata {
            symbol
            decimals
          }

          variants {
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
      }
    }
  }
`;

const vaultPricesFragment = graphql`
  fragment BorrowVaultPricesFragment on GhostCredit {
    vaults {
      price {
        current
      }
      borrower {
        asset {
          metadata {
            symbol
          }
        }
        vault {
          status {
            debtPool {
              size
            }
          }
        }
      }
    }
  }
`;

const accountFragment = graphql`
  fragment BorrowAccountFragment on Account {
    credit {
      next {
        ...BorrowNextFragment
      }
      accountsV2(first: 100) @connection(key: "Borrow_accountsV2") {
        __id
        edges {
          node {
            account {
              address
            }
            ltv
            ...PositionBorrowRowFragment
          }
        }
      }
    }
  }
`;

const nextFragment = graphql`
  fragment BorrowNextFragment on GhostCreditAccountNext
  @refetchable(queryName: "NextQuery") {
    salt
    account
  }
`;

type Collateral = NonNullable<
  BorrowQuery$data["ghostCredit"]
>["collaterals"][number];

type Vault = NonNullable<BorrowQuery$data["ghostCredit"]>["vaults"][number];

// Keeps the on-chain credit-account label under the 128-char CosmWasm limit by
// compressing the EVM contract address (chain-symbol-0x...) into Base64url.
const encodeAssetLabel = (asset: string): string => {
  const parts = asset.split("-");
  if (parts.length === 3) {
    return `${parts[0]}-${parts[1]}-${encodeAddress(parts[2])}`;
  }
  return asset;
};

export const Borrow = () => {
  const { locale } = useLocale();

  return (
    <TranslationProvider namespace="borrow">
      <ProductSeoHelmet seo={getStaticProductSeo("/borrow", locale)} />
      <BorrowContent />
    </TranslationProvider>
  );
};

const BorrowContent = () => {
  const { t } = useTranslation();
  const data = useLazyLoadQuery<BorrowQuery>(query, {});
  const collaterals = (data.ghostCredit?.collaterals || []).filter(
    (c) => c.ratio > 0n
  );
  const { collateral: collateralParam } = useParams<{
    collateral: string;
    debt: string;
  }>();
  const collateralFromParam =
    collateralParam &&
    findAssetByUrlSegment(
      collateralParam,
      collaterals.map((c) => c.asset)
    );
  const [collateral, setCollateral] = useState<Collateral>(
    (collateralFromParam &&
      collaterals.find((c) => c.asset.asset === collateralFromParam.asset)) ||
      collaterals.find((a) => a.asset.asset === "BTC-BTC") ||
      collaterals[0]
  );
  if (!collateral)
    return (
      <div className="rujira__main rujira__main--gradient borrow">
        <div className="rujira__inner--pad">
          <div className="rujira__inner">
            <h1 className="h1">{t("borrow")}</h1>
            <h2 className="fs-24 lh-32 fw-400 color-white balance-text">
              {t("pageDescription")}
            </h2>
            <p className="text-center mt-12 fs-24 color-grey">
              {t("arrivingImminently")}
            </p>
          </div>
        </div>
      </div>
    );
  return (
    <BalanceProvider asset={collateral.asset}>
      <Content
        data={data}
        setCollateralAsset={(x) => {
          const c = collaterals.find((a) => x.asset === a.asset.asset);
          if (!c) return;
          return setCollateral(c);
        }}
        collateral={collateral}
      />
    </BalanceProvider>
  );
};

const Content: FC<{
  data: BorrowQuery$data;
  collateral: Collateral;
  setCollateralAsset: (v: Asset) => void;
}> = ({ data, collateral, setCollateralAsset }) => {
  const { accountData } = usePreloadedAccountData();
  const account = useFragment<BorrowAccountFragment$key>(
    accountFragment,
    accountData
  );
  const vaultPriceData = useFragment<BorrowVaultPricesFragment$key>(
    vaultPricesFragment,
    data.ghostCredit
  );
  const { accounts } = useAccounts();
  const navigate = useNavigate();
  const { collateral: collateralParam, debt: debtParam } = useParams<{
    collateral: string;
    debt: string;
  }>();
  const [searchParams] = useSearchParams();
  const toChainParam = searchParams.get("toChain") ?? undefined;

  const destinationOptions: DestinationOption[] =
    (data.thorchainV2?.pools || [])
      .reduce((a: Asset[], v) => {
        if (v.status !== "AVAILABLE") return a;
        if (
          !vaultPriceData?.vaults.find(
            (x) => x.borrower.asset.metadata.symbol === v.asset.metadata.symbol
          )
        )
          return a;
        return [v.asset, ...a];
      }, [])
      .flatMap(collectDestinationOptions(accounts || []))
      .map((option) => {
        const vault = vaultPriceData?.vaults.find(
          (x) =>
            x.borrower.asset.metadata.symbol === option.asset.metadata.symbol
        );
        const price = vault?.price?.current;
        const debtPoolSize = vault?.borrower.vault.status.debtPool.size;

        return {
          ...option,
          valueUsd:
            price !== undefined && debtPoolSize !== undefined
              ? (debtPoolSize * price) / 10n ** 12n
              : 0n,
        };
      })
      .sort((a, b) => {
        return a.asset.metadata.symbol.localeCompare(b.asset.metadata.symbol);
      }) || [];

  const [collateralAmount, setCollateralAmount] = useState(0n);
  // Resolve the debt selection from the URL. The same symbol can exist both on
  // Rujira (the SECURED variant) and on its external L1 (e.g. USDC on
  // Ethereum). They share the bare URL segment ("USDC"), so `&toChain=<chain>`
  // disambiguates: when present we want the L1 variant on that chain, otherwise
  // the Rujira (SECURED) variant. `findAssetByUrlSegment` applies that rule.
  const debtFromParam =
    debtParam &&
    findAssetByUrlSegment(
      debtParam,
      destinationOptions.map((d) => d.asset),
      normalizeChainParam(toChainParam)
    );
  const [destination, setDestination] = useState<Destination | undefined>(
    (debtFromParam &&
      destinationOptions.find((d) => d.asset.asset === debtFromParam.asset)) ||
      destinationOptions.find(
        (a) => a.asset.metadata.symbol === "USDC" && a.asset.type === "SECURED"
      )
  );

  useEffect(() => {
    const collateralSegment = assetToTradeUrlSegment(collateral.asset);
    const debtSegment = destination
      ? assetToTradeUrlSegment(destination.asset)
      : debtParam;
    // Rujira (SECURED) debt needs no chain param; any external chain (e.g.
    // Ethereum) is surfaced via `&toChain=` so it stays distinguishable from
    // the Rujira variant of the same symbol.
    const debtChainValue = destination
      ? assetToNetworkParam(destination.asset)
      : toChainParam;
    if (
      collateralSegment !== collateralParam ||
      debtSegment !== debtParam ||
      debtChainValue !== toChainParam
    ) {
      const search = debtChainValue ? `?toChain=${debtChainValue}` : "";
      navigate(`/borrow/${collateralSegment}/${debtSegment}${search}`, {
        replace: true,
      });
    }
  }, [
    collateral,
    destination,
    collateralParam,
    debtParam,
    toChainParam,
    navigate,
  ]);

  const [debtAmount, setDebtAmount] = useState(0n);
  const vault =
    data.ghostCredit?.vaults.find((a) => {
      return (
        destination &&
        a.borrower.asset.metadata.symbol === destination.asset.metadata.symbol
      );
    }) ||
    data.ghostCredit?.vaults.find((a) =>
      a.borrower.asset.asset.startsWith("ETH-USDC")
    );

  const collateralPrice = useOraclePrice(collateral.price) || 0n;
  const debtPrice = useOraclePrice(vault?.price) || 0n;
  const [simulationState, setSimulationState] = useState<
    SimulationState | undefined
  >();
  const debtAssetId = vault?.borrower.asset.asset;
  const destinationAssetId = destination?.asset.asset;
  const destinationAddress = destination?.address;
  const quoteRequest = useMemo(() => {
    if (
      !debtAssetId ||
      !destinationAssetId ||
      !debtAmount ||
      !destinationAddress
    )
      return null;
    return {
      from: debtAssetId,
      to: destinationAssetId,
      amount: debtAmount,
      destination: destinationAddress,
      liquidityToleranceBps: 50n,
    };
  }, [debtAmount, debtAssetId, destinationAddress, destinationAssetId]);
  const quote = useQuote(quoteRequest);

  if (!vault) return null;

  const next = useFragment<BorrowNextFragment$key>(
    nextFragment,
    account?.credit.next
  );

  const p = Cdp.fromInput(
    {
      amount: collateralAmount,
      price: collateralPrice,
      asset: collateral.asset,
      ratio: collateral.ratio,
    },
    {
      amount: debtAmount,
      price: debtPrice,
      rate: vault.borrower.vault.status.debtRate,
      asset: vault.borrower.asset,
    },
    { adjustmentMax: BigInt(data.ghostCredit?.adjustmentThreshold || 0) },
    next || undefined
  );

  const { t } = useTranslation();
  const borrowAsset = vault.borrower.asset.metadata.symbol;
  const collateralAsset = collateral.asset.metadata.symbol;
  return (
    <>
      <div className="rujira__main rujira__main--gradient borrow">
        <div className="rujira__inner--pad">
          <div className="rujira__inner">
            <h1 className="h1">
              {t("borrowTitle", { borrowAsset, collateralAsset })}
            </h1>
            <h2 className="fs-24 lh-32 fw-400 color-white balance-text">
              {t("borrowSubheading", { collateralAsset })}
            </h2>
            <div className="flex jc-c wrap mt-6">
              <InputCollateral
                data={data}
                collateral={collateral}
                setCollateralAsset={setCollateralAsset}
                collateralAmount={collateralAmount}
                setCollateralAmount={setCollateralAmount}
                p={p}
              />
              <div className="borrow__arrow">
                <Icons.AnglesRight />
              </div>
              <InputDebt
                data={data}
                setDestination={setDestination}
                destination={destination}
                debtAmount={debtAmount}
                setDebtAmount={setDebtAmount}
                vault={vault}
                p={p}
                options={destinationOptions}
                quote={quote}
                simulationState={simulationState}
                collateralAmount={collateralAmount}
                collateralAsset={collateral.asset}
                debtAsset={vault.borrower.asset}
                onSimulation={setSimulationState}
              />
            </div>
            <Positions data={data} />
          </div>
        </div>
      </div>
    </>
  );
};

const borrowSummaryLabelClass =
  "col-6 h-3 flex ai-c text-left color-grey fw-500 mt-0.5";
const borrowSummaryValueClass = "col-6 h-3 flex ai-c jc-e text-right mt-0.5";

const InputCollateral: FC<{
  data: BorrowQuery$data;
  collateral: Collateral;
  setCollateralAsset: (v: Asset) => void;
  collateralAmount: bigint;
  setCollateralAmount: (v: bigint) => void;
  p: Cdp<Asset>;
}> = ({
  data,
  collateral,
  setCollateralAsset,
  collateralAmount,
  setCollateralAmount,
  p,
}) => {
  const vaults = data.ghostCredit?.vaults || [];
  const collaterals = data.ghostCredit?.collaterals || [];

  if (!vaults.length && !collaterals.length)
    throw new Error(`Borrow not available yet on ${import.meta.env.MODE}net`);

  const balances = usePreloadedBalances();
  const collateralOptions = collaterals
    .filter((v) => v.ratio > 0n)
    .map((v) => {
      const balance = balances?.find((a) => a.asset.asset === v.asset.asset);
      return {
        asset: v.asset,
        balance: balance?.balance || 0n,
        valueUsd: balance?.valueUsd || 0n,
      };
    });

  const collateralPrice = useOraclePrice(collateral.price) || 0n;
  const { t } = useTranslation();

  return (
    <div className="swap__select">
      <h3 className="h4 mb-1">{t("deposit")}</h3>
      <BalanceCompact
        className="mb-0.5 px-1"
        onClick={(v) => setCollateralAmount(v.balance)}
      />
      <SwapSelect
        selected={collateral.asset}
        options={collateralOptions}
        onSelect={(v) => {
          setCollateralAsset(v);
        }}
        amount={collateralAmount}
        onChangeAmount={(a: bigint) => setCollateralAmount(a)}
        className="swap-select--responsive"
        value={p.collaterals[0].value}
      />
      <div className="row wrap pad-mini px-0.5 px-sm-2.5 mt-1.5 condensed fs-14">
        <div className={borrowSummaryLabelClass}>
          {collateral.asset.metadata.symbol} {t("price")}
        </div>
        <div className={borrowSummaryValueClass}>
          <Fiat amount={collateralPrice} decimals={12} symbol="$" />
        </div>
        <div className={borrowSummaryLabelClass}>
          <div
            data-tooltip-id="global-tip"
            data-tooltip-html={`<div class='w-20'>${t(
              "collateralRatioTooltip",
              {
                symbol: collateral.asset.metadata.symbol,
              }
            )}</div>`}
            className="iflex ai-c no-select">
            {t("collateralRatio")}
            <Icons.Info className="ml-0.5 block w-2" />
          </div>
        </div>
        <div className={borrowSummaryValueClass}>
          {(Number(collateral.ratio) / 1e12).toLocaleDecimal(2)}
        </div>

        <div className={borrowSummaryLabelClass}>
          <div
            data-tooltip-id="global-tip"
            data-tooltip-html={t("adjustedCollateralValueTooltip", {
              symbol: collateral.asset.metadata.symbol,
            })}
            className="iflex ai-c no-select">
            {t("adjustedCollateralValue")}
            <Icons.Info className="ml-0.5 block w-2" />
          </div>
        </div>
        <div className={borrowSummaryValueClass}>
          <Fiat
            amount={p.collaterals[0].valueAdjusted}
            decimals={8}
            symbol="$"
          />
        </div>
      </div>
    </div>
  );
};

const InputDebt: FC<{
  data: BorrowQuery$data;
  destination?: Destination;
  setDestination: (v: Destination) => void;
  debtAmount: bigint;
  setDebtAmount: (v: bigint) => void;
  p: Cdp<Asset>;
  vault: Vault;
  options: DestinationOption[];
  quote: Quote;
  simulationState?: SimulationState;
  collateralAmount: bigint;
  collateralAsset: Asset;
  debtAsset: Asset;
  onSimulation: (simulationState: SimulationState) => void;
}> = ({
  data,
  debtAmount,
  setDebtAmount,
  destination,
  setDestination,
  p,
  vault,
  options,
  quote,
  simulationState,
  collateralAmount,
  collateralAsset,
  debtAsset,
  onSimulation,
}) => {
  const { showModal, hideModal } = useGlobalModalContext();
  const [to, setTo] = useState(p.debts[0].asset.metadata.symbol);
  const openModal = () => {
    showModal({
      backgroundClose: true,
      className: "modal--xl modal--fixed modal--nopad",
      children: (
        <DestinationSelectModal
          setTo={setTo}
          to={to}
          destination={destination}
          setDestination={(v) => {
            setDestination(v);
            hideModal();
          }}
          options={options}
        />
      ),
    });
  };

  const debtDepositSize = vault.borrower.vault.status.depositPool.size;
  const debtDebtSize = vault.borrower.vault.status.debtPool.size;
  const debtAvailable = bigintMin(
    debtDepositSize - debtDebtSize,
    vault.borrower.available
  );
  const debtMax = bigintMin(p.debts[0].maxAdjust, debtAvailable);

  const { t } = useTranslation();

  return (
    <div className="swap__select">
      <h3 className="h4 mb-1 mb-lg-3.5">{t("borrow")}</h3>
      <div className="row wrap pad--sm gap-y-1 jc-c">
        <div className="col-12 col-md-6 col-lg-6">
          <TokenSelect
            selected={destination?.asset || p.debts[0].asset}
            onClick={options.length ? openModal : undefined}
            network={
              destination?.asset.type === "SECURED"
                ? THOR
                : destination?.asset.chain
            }
            address={destination?.address}
          />
        </div>
        <div className="col-12 col-md-6 col-lg-6">
          <SwapSelect
            selected={p.debts[0].asset}
            amount={debtAmount}
            onChangeAmount={setDebtAmount}
            value={p.debts[0].value}
            hideSelected={true}
            className="swap-select--responsive"
          />
        </div>
      </div>

      <div className="flex ai-c mt-1.5 mx-0.5 mx-sm-1">
        <a
          className="fs-12 condensed fw-500 color-grey mr-0.5 pointer"
          onClick={() => setDebtAmount(0n)}>
          0%
        </a>
        <ChunkSlider
          amount={debtAmount}
          setAmount={setDebtAmount}
          max={debtMax}
        />
        <a
          className="fs-12 condensed fw-500 color-grey ml-0.5 pointer"
          onClick={() => setDebtAmount(debtMax)}>
          100%
        </a>
      </div>
      <InputDebtSummary
        data={data}
        debtAsset={p.debts[0].asset}
        debtAmount={debtAmount}
        debtDepositSize={debtDepositSize}
        debtDebtSize={debtDebtSize}
        debtAvailable={debtAvailable}
        p={p}
        vault={vault}
        destination={destination}
        quote={quote}
        simulationState={simulationState}
      />
      <Suspense>
        <Submit
          data={data}
          collateralAmount={collateralAmount}
          collateralAsset={collateralAsset}
          debtAmount={debtAmount}
          debtAsset={debtAsset}
          destination={destination}
          quote={quote}
          onSimulation={onSimulation}
        />
      </Suspense>
    </div>
  );
};

const InputDebtSummary: FC<{
  data: BorrowQuery$data;
  debtAsset: Asset;
  debtAmount: bigint;
  p: Cdp<Asset>;
  debtDepositSize: bigint;
  debtDebtSize: bigint;
  debtAvailable: bigint;
  vault: Vault;
  destination?: Destination;
  quote: Quote;
  simulationState?: SimulationState;
}> = ({
  data,
  debtAmount,
  debtAsset,
  p,
  debtDepositSize,
  debtDebtSize,
  debtAvailable,
  vault,
  destination,
  quote,
  simulationState,
}) => {
  const vaults = data.ghostCredit?.vaults || [];
  const collaterals = data.ghostCredit?.collaterals || [];

  if (!vaults.length && !collaterals.length)
    throw new Error(`Borrow not available yet on ${import.meta.env.MODE}net`);

  const debtPrice = p.debts[0].price;
  const borrowApr = computeProjectedRate(
    {
      baseRate: vault.borrower.vault.interest.baseRate,
      step1: vault.borrower.vault.interest.step1,
      step2: vault.borrower.vault.interest.step2,
      targetRatio: vault.borrower.vault.interest.targetUtilization,
      vaultTotalDeposits: debtDepositSize,
      vaultTotalDebts: debtDebtSize,
    },
    0n,
    debtAmount
  );

  const { t } = useTranslation();
  const [liquidationView, setLiquidationView] = useState<
    "collateral" | "debt" | null
  >(null);
  const isExternalWithdrawal = destination?.asset.type === "LAYER_1";

  const networkFee = simulationState?.simulation;

  const runeAsset = data.thorchainV2?.rune;
  const networkFeePrice =
    networkFee && runeAsset?.metadata.symbol === networkFee.symbol
      ? runeAsset.price?.current
      : undefined;

  const networkFeeUnpriced =
    simulationState?.status === "completed" &&
    (networkFeePrice === undefined || networkFeePrice === null);

  const feeReady =
    isExternalWithdrawal &&
    simulationState?.status === "completed" &&
    typeof quote === "object" &&
    "memo" in quote &&
    !networkFeeUnpriced;

  const feeFailed =
    simulationState?.status === "failed" ||
    quote instanceof Error ||
    networkFeeUnpriced;

  const feePending =
    isExternalWithdrawal && !feeReady && !feeFailed && debtAmount > 0n;

  const withdrawalFee =
    typeof quote === "object" && "memo" in quote && quote.fees?.outbound
      ? BigInt(quote.fees.outbound)
      : undefined;
  const feeAsset = destination?.asset;

  const withdrawalFeeAssetAmount =
    withdrawalFee !== undefined && feeAsset
      ? (withdrawalFee * 10n ** BigInt(feeAsset.metadata.decimals)) / 10n ** 8n
      : undefined;
  const networkFeeValueUsd =
    networkFee && networkFeePrice
      ? (networkFee.amount * networkFeePrice) / 10n ** 12n
      : 0n;

  const withdrawalFeeValueUsd = withdrawalFee
    ? (withdrawalFee * debtPrice) / 10n ** 12n
    : 0n;

  const totalFeeValueUsd = networkFeeValueUsd + withdrawalFeeValueUsd;
  const feeTooltip = `<div class='w-30'>${t("feesTooltip")}</div>`;
  const feeBreakdownTooltip = (
    type: string,
    amount: string,
    symbol: string,
    valueUsd: bigint
  ) =>
    `<div class='nowrap'><span class='fw-500'>${type}:</span> <span class='color-white'>${amount} ${symbol}</span> <span class='color-grey'>($${clipAmountString(valueUsd, 8)})</span></div>`;
  const feeIcons = [
    networkFee && {
      key: "network",
      symbol: networkFee.symbol,
      tooltip: feeBreakdownTooltip(
        t("networkFee"),
        clipAmountString(networkFee.amount, networkFee.decimals),
        networkFee.symbol,
        networkFeeValueUsd
      ),
    },
    withdrawalFeeAssetAmount !== undefined &&
      feeAsset && {
        key: "withdrawal",
        symbol: feeAsset.metadata.symbol,
        tooltip: feeBreakdownTooltip(
          t("withdrawalFee"),
          clipAmountString(
            withdrawalFeeAssetAmount,
            feeAsset.metadata.decimals
          ),
          feeAsset.metadata.symbol,
          withdrawalFeeValueUsd
        ),
      },
  ].filter(
    (
      fee
    ): fee is {
      key: string;
      symbol: string;
      tooltip: string;
    } => Boolean(fee)
  );

  return (
    <div className="row wrap pad-mini px-0.5 px-sm-2.5 mt-1.5 condensed fs-14">
      <div className={borrowSummaryLabelClass}>
        {debtAsset.metadata.symbol} {t("price")}
      </div>
      <div className={borrowSummaryValueClass}>
        <Fiat amount={debtPrice} decimals={12} symbol="$" />
      </div>
      <div className={borrowSummaryLabelClass}>
        {debtAsset.metadata.symbol} {t("available")}
      </div>
      <div className={borrowSummaryValueClass}>
        <Decimal amount={debtAvailable} round={2} />

        <Fiat
          className="color-grey ml-1"
          symbol="$"
          decimals={20}
          amount={debtPrice * debtAvailable}
        />
      </div>

      <div className={borrowSummaryLabelClass}>
        <div
          data-tooltip-id="global-tip"
          data-tooltip-html={`<div class='w-20'>${t("interestRateTooltip")}</div>`}
          className="iflex ai-c no-select">
          {t("annualInterestRate")}
          <Icons.Info className="ml-0.5 block w-2" />
        </div>
      </div>
      <div className={borrowSummaryValueClass}>
        <div
          className={"tag tag--borderless tag--index"}
          style={{ marginRight: "-0.5rem" }}>
          {(Number(borrowApr) / 1e10).toLocaleDecimal(2)}%
        </div>
      </div>

      <div className={borrowSummaryLabelClass}>
        <div
          data-tooltip-id="global-tip"
          data-tooltip-html={t("ltvTooltip")}
          className="iflex ai-c no-select">
          {t("adjustedLtv")}
          <Icons.Info className="ml-0.5 block w-2" />
        </div>
      </div>
      <div className={borrowSummaryValueClass}>
        <div style={{ marginRight: "-0.5rem" }}>
          <LtvLabel ltv={p.ltv} />
        </div>
      </div>

      <div className={borrowSummaryLabelClass}>
        <div
          data-tooltip-id="global-tip"
          data-tooltip-html={t("liquidationPriceTooltip", {
            symbol: (["USDC", "USDT"].includes(
              p.collaterals[0].asset.metadata.symbol
            )
              ? p.debts[0]
              : p.collaterals[0]
            ).asset.metadata.symbol,
          })}
          className="iflex ai-c no-select">
          {liquidationView === "debt"
            ? t("debtLiquidationPrice")
            : liquidationView === "collateral"
              ? t("collateralLiquidationPrice")
              : t("liquidationPrice")}
          <Icons.Info className="ml-0.5 block w-2" />
        </div>
      </div>
      <div className={borrowSummaryValueClass}>
        <div style={{ marginRight: "-0.5rem" }}>
          <LiquidationPrice
            p={p}
            onOrientationSet={(orientation) => setLiquidationView(orientation)}
          />
        </div>
      </div>
      <div
        className={borrowSummaryLabelClass}
        style={{ visibility: isExternalWithdrawal ? "visible" : "hidden" }}>
        <div
          data-tooltip-id="global-tip"
          data-tooltip-html={feeTooltip}
          className="iflex ai-c no-select">
          {t("estimatedFee")}
          <Icons.Info className="ml-0.5 block w-2" />
        </div>
      </div>
      <div
        className={borrowSummaryValueClass}
        style={{ visibility: isExternalWithdrawal ? "visible" : "hidden" }}>
        <div style={{ marginRight: "-0.5rem" }}>
          <LoaderWithContent
            loading={feePending}
            content={
              feeReady ? (
                <div className="flex ai-c jc-e">
                  <Fiat
                    amount={totalFeeValueUsd}
                    symbol="$"
                    decimals={8}
                    clip
                    className="color-grey"
                  />
                  <div className="flex ai-c ml-1">
                    {feeIcons.map((fee, index) => (
                      <span
                        key={fee.key}
                        data-tooltip-id="global-tip"
                        data-tooltip-html={fee.tooltip}
                        className="iflex ai-c"
                        style={{
                          marginLeft: index === 0 ? undefined : "-0.125em",
                        }}>
                        <IconDenom
                          denom={fee.symbol}
                          className="w-2 h-2 block"
                        />
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <span className="color-grey">&mdash;</span>
              )
            }
          />
        </div>
      </div>
    </div>
  );
};

const Submit: FC<{
  data: BorrowQuery$data;
  collateralAmount: bigint;
  collateralAsset: Asset;
  debtAmount: bigint;
  debtAsset: Asset;
  destination?: Destination;
  quote: Quote;
  onSimulation: (simulationState: SimulationState) => void;
}> = ({
  data,
  debtAmount,
  debtAsset,
  collateralAmount,
  collateralAsset,
  destination,
  quote,
  onSimulation,
}) => {
  const { accountData } = usePreloadedAccountData();
  const account = useFragment<BorrowAccountFragment$key>(
    accountFragment,
    accountData
  );

  const registry = data.ghostCredit?.address || "";
  const { selected } = useAccounts();
  const [next, refetch] = useRefetchableFragment<
    NextQuery,
    BorrowNextFragment$key
  >(nextFragment, account?.credit.next);

  const msg = useMemo(() => {
    if (!(collateralAmount && debtAmount && selected)) return null;
    const borrowAmount = {
      denom: debtAsset.variants?.native?.denom,
      amount: debtAmount.toString(),
    };

    if (!next) return null;
    if (!destination) return null;
    const acc = Account.fromAddress(selected.address);
    const isWithdrawal = destination.asset.type == "LAYER_1";
    const base = [
      new MsgExecute(acc, [], registry, {
        create: {
          salt: next.salt,
          label: `${encodeAssetLabel(collateralAsset.asset)}/${encodeAssetLabel(
            debtAsset.asset
          )}`,
          tag: "single",
        },
      }),
      new MsgSend(acc, collateralAsset, collateralAmount, next.account),
      new MsgExecute(acc, [], registry, {
        account: {
          addr: next.account,
          msgs: [
            { borrow: borrowAmount },
            {
              send: {
                funds: [borrowAmount],
                to_address: selected.address.address,
              },
            },
          ],
        },
      }),
    ];
    if (!isWithdrawal) return new MsgMulti(acc, base);
    if (destination.asset.chain === debtAsset.chain)
      return new MsgMulti(acc, [
        ...base,
        new MsgSecureWithdraw(
          acc,
          destination.asset.variants?.secured!,
          debtAmount,
          destination.address
        ),
      ]);

    if (!(typeof quote === "object" && "memo" in quote)) return null;
    return new MsgMulti(acc, [
      ...base,
      new MsgSwap(acc, debtAsset, debtAmount, quote.memo),
    ]);
  }, [
    collateralAmount,
    debtAmount,
    selected,
    debtAsset,
    collateralAsset,
    destination,
    next,
    quote,
  ]);

  return (
    <MsgProvider msg={msg}>
      <div className="mt-3 text-left">
        <TxBalanceAccountButton
          label={`Borrow ${debtAsset.metadata.symbol}`}
          required={{
            asset: collateralAsset,
            amount: collateralAmount,
          }}
          onSuccess={() => {
            refetch({});
          }}
          hideSimulation
          onSimulation={onSimulation}
        />
      </div>
    </MsgProvider>
  );
};

const subscription = graphql`
  subscription BorrowSubscription($connection: ID!, $prefix: String!) {
    edge(prefix: $prefix) @appendEdge(connections: [$connection]) {
      cursor
      node {
        ... on GhostCreditAccount {
          ...PositionBorrowRowFragment
        }
      }
    }
  }
`;

const Positions: FC<{
  data: BorrowQuery$data;
}> = ({ data }) => {
  const { selected } = useAccounts();
  const { accountData } = usePreloadedAccountData();
  const account = useFragment<BorrowAccountFragment$key>(
    accountFragment,
    accountData
  );

  const accounts = account?.credit.accountsV2.edges
    ?.map((a) => a?.node!)
    .sort((a, b) => (a.ltv > b.ltv ? -1 : a.ltv < b.ltv ? 1 : 0));
  const env = useRelayEnvironment();

  useEffect(() => {
    if (!account?.credit.accountsV2.__id) return;
    if (!selected) return;
    const { dispose } = requestSubscription(env, {
      subscription,
      variables: {
        prefix: Buffer.from(
          `GhostCreditAccount:${selected.address.address}`
        ).toString("base64"),
        connection: account.credit.accountsV2.__id,
      },
    });
    return () => {
      dispose();
    };
  }, [selected, account]);

  const { t } = useTranslation();

  return (
    accounts &&
    accounts.length > 0 && (
      <>
        <hr className="hr mt-6 mb-4 opacity-10" />

        <h3 className="h4 mb-1">{t("myPositions")}</h3>
        <div className="card relative mt-2 p-3">
          <div className="table-sticky">
            <table className="table table--big condensed">
              <thead>
                <tr>
                  <th>{t("collateral")}</th>
                  <th>{t("borrowed")}</th>
                  <th>
                    <div
                      className="iflex ai-c no-select"
                      data-tooltip-id="global-tip"
                      data-tooltip-html={`<div class='w-20'>${t(
                        "interestRateTooltip"
                      )}</div>`}>
                      {t("interestRate")}
                      <Icons.Info className="ml-0.5 block w-2" />
                    </div>
                  </th>
                  <th className="text-center">
                    <div
                      className="iflex ai-c no-select"
                      data-tooltip-id="global-tip"
                      data-tooltip-html={tooltipHtml(t("adjustedLtvTooltip"))}>
                      {t("adjustedLtv")}
                      <Icons.Info className="ml-0.5 block w-2" />
                    </div>
                  </th>
                  <th>
                    <div
                      className="iflex ai-c no-select"
                      data-tooltip-id="global-tip"
                      data-tooltip-html={tooltipHtml(
                        t("liquidationPriceTableTooltip")
                      )}>
                      {t("liquidationPriceTableHeader")}
                      <Icons.Info className="ml-0.5 block w-2" />
                    </div>
                  </th>
                  <th className="w-1" />
                </tr>
              </thead>
              <tbody>
                {accounts.map((a) => (
                  <PositionRow
                    k={a}
                    key={a.account.address}
                    adjustmentThreshold={
                      data.ghostCredit?.adjustmentThreshold || 0n
                    }
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </>
    )
  );
};
