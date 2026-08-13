import { FC, useEffect, useMemo, useState } from "react";
import { Account, Asset, MsgExecute, MsgMulti, MsgSend } from "rujira.js";
import {
  Button,
  SimulationState,
  sortByValueUsd,
  SwapSelect,
  useTranslation,
} from "rujira.ui";
import {
  BalanceCompact,
  BalanceProvider,
  usePreloadedBalance,
  usePreloadedBalances,
} from "../../common/components/Balance";
import {
  MsgProvider,
  TxBalanceAccountButton,
  TxButton,
} from "../../common/components/TxButton";
import { useOraclePrice } from "../../common/OraclePrice";
import { useAccounts } from "../../services/accounts";
import { ChunkSlider } from "../../trade/components/InputQuantity";
import { PositionBorrowQuery$data } from "./__generated__/PositionBorrowQuery.graphql";
import { AdjustmentSummary } from "./Common";
import { Cdp, computeProjectedRate, VaultInterest } from "./utils";

type IncreaseVault = {
  borrower: {
    asset: Asset;
  };
};

type CollateralConfig = NonNullable<
  PositionBorrowQuery$data["ghostCredit"]
>["collaterals"];

export const Increase: FC<{
  hideModal: () => void;
  p: Cdp<Asset>;
  registry: string;
  vault?: IncreaseVault;
  vaultInterest?: VaultInterest;
  collateralConfig: CollateralConfig;
}> = ({ hideModal, registry, p, vault, vaultInterest, collateralConfig }) => {
  const balances = usePreloadedBalances();
  const collateralOptions = useMemo(
    () =>
      collateralConfig
        .filter((c) => c.ratio > 0n)
        .map((c) => {
          const balance = balances?.find(
            (a) => a.asset.asset === c.asset.asset
          );
          return {
            asset: c.asset,
            balance: balance?.balance || 0n,
            valueUsd: balance?.valueUsd || 0n,
          };
        })
        .filter((o) => o.balance > 0n),
    [collateralConfig, balances]
  );
  const sortedCollateralOptions = useMemo(
    () =>
      sortByValueUsd(collateralOptions, (a, b) =>
        a.asset.metadata.symbol.localeCompare(b.asset.metadata.symbol)
      ),
    [collateralOptions]
  );

  const [selectedAsset, setSelectedAsset] = useState<Asset>(
    sortedCollateralOptions[0]?.asset ?? p.collaterals[0].asset
  );

  useEffect(() => {
    if (
      sortedCollateralOptions.some((o) => o.asset.asset === selectedAsset.asset)
    )
      return;
    if (sortedCollateralOptions[0])
      setSelectedAsset(sortedCollateralOptions[0].asset);
  }, [selectedAsset.asset, sortedCollateralOptions]);

  return (
    <BalanceProvider asset={selectedAsset}>
      <IncreaseContent
        hideModal={hideModal}
        registry={registry}
        p={p}
        vault={vault}
        vaultInterest={vaultInterest}
        collateralConfig={collateralConfig}
        collateralOptions={sortedCollateralOptions}
        selectedAsset={selectedAsset}
        setSelectedAsset={setSelectedAsset}
      />
    </BalanceProvider>
  );
};

const IncreaseContent: FC<{
  hideModal: () => void;
  p: Cdp<Asset>;
  registry: string;
  vault?: IncreaseVault;
  vaultInterest?: VaultInterest;
  collateralConfig: CollateralConfig;
  collateralOptions: { asset: Asset; balance: bigint; valueUsd: bigint }[];
  selectedAsset: Asset;
  setSelectedAsset: (a: Asset) => void;
}> = ({
  hideModal,
  registry,
  p,
  vault,
  vaultInterest,
  collateralConfig,
  collateralOptions,
  selectedAsset,
  setSelectedAsset,
}) => {
  const { selected } = useAccounts();
  const [debtAmount, setDebtAmount] = useState<bigint>(0n);
  const [collateralAmount, setCollateralAmount] = useState<bigint>(0n);
  const collateralBalance = usePreloadedBalance();

  useEffect(() => {
    setCollateralAmount(0n);
  }, [selectedAsset.asset]);

  const existingIndex = p.collaterals.findIndex(
    (c) => c.asset.asset === selectedAsset.asset
  );
  const config = collateralConfig.find(
    (c) => c.asset.asset === selectedAsset.asset
  );

  const newAssetPrice = useOraclePrice(
    existingIndex === -1 ? config?.price : undefined
  );

  const basePosition: Cdp<Asset> =
    existingIndex !== -1
      ? p
      : {
          ...p,
          collaterals: [
            ...p.collaterals,
            {
              asset: selectedAsset,
              amount: 0n,
              value: 0n,
              valueAdjusted: 0n,
              price: newAssetPrice ?? 0n,
              ratio: config?.ratio ?? 0n,
              min: 0n,
              minAdjust: 0n,
              liquidationPrice: 0n,
            },
          ],
        };
  const collateralIndex =
    existingIndex !== -1 ? existingIndex : basePosition.collaterals.length - 1;
  const selectedCollateral = basePosition.collaterals[collateralIndex];

  // When debt is 0, p.debts[0].asset comes from the account-label fallback in fromGraph
  // and lacks variants.native.denom. Use the full vault asset instead.
  const effectiveDebtAsset =
    p.debts[0].amount === 0n && vault ? vault.borrower.asset : p.debts[0].asset;

  const adjustedPosition = Cdp.depositAndBorrow(
    basePosition,
    collateralAmount,
    debtAmount,
    collateralIndex
  );
  const debtMax = adjustedPosition.debts[0].maxAdjust - p.debts[0].amount;
  const collateralValue =
    collateralAmount > 0n
      ? (collateralAmount * selectedCollateral.price) / 10n ** 12n
      : undefined;
  const debtValue =
    debtAmount > 0n ? (debtAmount * p.debts[0].price) / 10n ** 12n : undefined;
  const projectedRate = vaultInterest
    ? computeProjectedRate(
        vaultInterest,
        p.debts[0].amount,
        adjustedPosition.debts[0].amount
      )
    : undefined;

  const msg = useMemo(() => {
    if (!selected) return null;
    if (!collateralAmount && !debtAmount) return null;

    const debtDenom = effectiveDebtAsset.variants?.native?.denom;
    const collateralDenom = selectedCollateral.asset.variants?.native?.denom;
    const acc = Account.fromAddress(selected.address);

    return new MsgMulti(
      acc,
      [
        collateralDenom && collateralAmount
          ? new MsgSend(
              acc,
              selectedCollateral.asset,
              collateralAmount,
              p.account.address
            )
          : null,
        debtDenom && debtAmount
          ? new MsgExecute(acc, [], registry, {
              account: {
                addr: p.account.address,
                msgs: [
                  {
                    borrow: { denom: debtDenom, amount: debtAmount.toString() },
                  },
                  {
                    send: {
                      to_address: selected.address.address,
                      funds: [
                        { denom: debtDenom, amount: debtAmount.toString() },
                      ],
                    },
                  },
                ],
              },
            })
          : null,
      ].filter((x) => !!x)
    );
  }, [
    selected,
    debtAmount,
    collateralAmount,
    vault,
    p.account.address,
    selectedCollateral.asset,
    registry,
  ]);

  const [simulationState, setSimulationState] = useState<
    SimulationState | undefined
  >();
  const { t } = useTranslation();

  return (
    <MsgProvider msg={msg}>
      <div style={{ marginLeft: "-0.5rem", marginRight: "-0.5rem" }}>
        <div className="row wrap gap-y-2 pad--sm mt-3">
          <div className="col-12 col-md-6">
            <h3 className="fs-14 fw-500 color-grey mb-1 ml-2">
              {t("depositCollateral")}
            </h3>
            <BalanceCompact
              className="mb-0.5 px-1 ml-1"
              onClick={(v) => setCollateralAmount(v.balance)}
            />

            <SwapSelect
              selected={selectedAsset}
              options={
                collateralOptions.length > 1 ? collateralOptions : undefined
              }
              onSelect={setSelectedAsset}
              amount={collateralAmount}
              onChangeAmount={setCollateralAmount}
              full
              value={collateralValue}
              className="bg-black"
            />

            <div className="flex ai-c mt-1.5 mx-2">
              <a
                className="fs-12 condensed fw-500 color-grey mr-0.5 pointer"
                onClick={() => setCollateralAmount(0n)}>
                0%
              </a>
              <ChunkSlider
                amount={collateralAmount}
                setAmount={setCollateralAmount}
                max={collateralBalance.balance?.balance || 0n}
              />
              <a
                className="fs-12 condensed fw-500 color-grey ml-0.5 pointer"
                onClick={() =>
                  setCollateralAmount(collateralBalance.balance?.balance || 0n)
                }>
                100%
              </a>
            </div>
          </div>
          <div className="col-12 col-md-6">
            <h3 className="fs-14 fw-500 color-grey mb-1 mb-md-3.5 ml-2">
              {t("increaseLoan")}
            </h3>
            <SwapSelect
              selected={effectiveDebtAsset}
              amount={debtAmount}
              onChangeAmount={setDebtAmount}
              full
              max={debtMax}
              value={debtValue}
              className="bg-black"
            />

            <div className="flex ai-c mt-1.5 mx-2">
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
          </div>

          <AdjustmentSummary
            p={adjustedPosition}
            projectedRate={projectedRate}
            simulationState={simulationState}
            originalDebtAmount={p.debts[0].amount}
          />
        </div>
      </div>
      <div className="modal__footer mt-4 px-3 py-2 flex ai-s jc-e wrap">
        <Button
          className="button--grey button--outline"
          onClick={hideModal}
          label={t("common:cancel")}
        />
        <div className="block ml-a text-right">
          {collateralAmount ? (
            <TxBalanceAccountButton
              required={{
                amount: collateralAmount,
                asset: selectedCollateral.asset,
              }}
              label={t("increaseLoan")}
              onSuccess={hideModal}
              hideSimulation
              onSimulation={setSimulationState}
            />
          ) : (
            <TxButton
              label={t("increaseLoan")}
              hideSimulation
              onSimulation={setSimulationState}
            />
          )}
        </div>
      </div>
    </MsgProvider>
  );
};
