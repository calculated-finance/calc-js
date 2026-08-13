import { FC, useEffect, useMemo, useState } from "react";
import {
  Account,
  Asset,
  MsgExecute,
  MsgMulti,
  MsgSend,
  signers,
} from "rujira.js";
import {
  Button,
  SimulationState,
  SwapSelect,
  useTranslation,
  Warning,
  Icons,
} from "rujira.ui";
import {
  BalanceCompact,
  usePreloadedBalance,
} from "../../common/components/Balance";
import {
  MsgProvider,
  TxBalanceAccountButton,
  TxButton,
} from "../../common/components/TxButton";
import { useAccounts } from "../../services/accounts";
import { ChunkSlider } from "../../trade/components/InputQuantity";
import { AdjustmentSummary } from "./Common";
import { Cdp, computeProjectedRate, VaultInterest } from "./utils";

export const Repay: FC<{
  hideModal: () => void;
  p: Cdp<Asset>;
  registry: string;
  vaultInterest?: VaultInterest;
}> = ({ hideModal, registry, p, vaultInterest }) => {
  const { selected } = useAccounts();
  const [debtAmount, setDebtAmount] = useState<bigint>(0n);
  const [collateralIndex, setCollateralIndex] = useState(0);

  // The account subscription drops a collateral's slot once it's fully withdrawn,
  // so a stored index can fall out of range mid-render.
  const collateralIndexClamped =
    collateralIndex < p.collaterals.length ? collateralIndex : 0;

  const selectedCollateral = p.collaterals[collateralIndexClamped];
  const [collateralAmount_, setCollateralAmount] = useState<bigint>(0n);
  const collateralAmount =
    collateralAmount_ === selectedCollateral.amount
      ? selectedCollateral.amount
      : collateralAmount_;

  useEffect(() => {
    setCollateralAmount(0n);
  }, [collateralIndexClamped]);

  const q = Cdp.repayAndWithdraw(
    p,
    debtAmount,
    collateralAmount,
    collateralIndexClamped
  );
  const projectedRate = vaultInterest
    ? computeProjectedRate(vaultInterest, p.debts[0].amount, q.debts[0].amount)
    : undefined;

  const debtBalance = usePreloadedBalance();
  const collateralMax =
    selectedCollateral.amount > q.collaterals[collateralIndexClamped].minAdjust
      ? selectedCollateral.amount -
        q.collaterals[collateralIndexClamped].minAdjust
      : 0n;
  const collateralValue =
    collateralAmount > 0n
      ? (collateralAmount * selectedCollateral.price) / 10n ** 12n
      : undefined;
  const debtValue =
    debtAmount > 0n ? (debtAmount * p.debts[0].price) / 10n ** 12n : undefined;
  const collateralOptions = p.collaterals.map((c) => ({
    asset: c.asset,
    balance: c.amount,
    valueUsd: c.value,
  }));
  const msg = useMemo(() => {
    if (!selected) return null;
    if (!debtAmount && !collateralAmount) return null;
    const debtDenom = p.debts[0].asset.variants?.native?.denom;
    const collateralDenom = selectedCollateral.asset.variants?.native?.denom;
    // Over-repay fractionally if we're withdrawing all collateral to ensure
    // that debt is fully repaid
    const acc = Account.fromAddress(selected.address);

    // Only close the account when this is the last collateral
    if (
      p.collaterals.length === 1 &&
      collateralAmount === selectedCollateral.amount &&
      debtAmount === p.debts[0].amount
    ) {
      return new MsgMulti(
        acc,
        [
          debtDenom && debtAmount
            ? new MsgSend(
                acc,
                p.debts[0].asset,
                // Add some dust for safety, it'll be refunded
                (debtAmount * 1000n) / 999n,
                p.account.address
              )
            : null,
          new MsgExecute(acc, [], registry, {
            account: {
              addr: p.account.address,
              msgs: [{ repay_all: {} }, { close: {} }],
            },
          }),
        ].filter((x) => !!x)
      );
    }
    return new MsgMulti(
      acc,
      [
        debtDenom && debtAmount
          ? new MsgSend(acc, p.debts[0].asset, debtAmount, p.account.address)
          : null,
        new MsgExecute(acc, [], registry, {
          account: {
            addr: p.account.address,
            msgs: [
              debtDenom && debtAmount
                ? {
                    repay: {
                      denom: debtDenom,
                      amount: debtAmount.toString(),
                    },
                  }
                : null,
              collateralAmount && collateralDenom
                ? {
                    send: {
                      to_address: selected.address.address,
                      funds: signers.cosmos.coins(
                        collateralAmount.toString(),
                        collateralDenom
                      ),
                    },
                  }
                : null,
            ].filter((x) => !!x),
          },
        }),
      ].filter((x) => !!x)
    );
  }, [selected, debtAmount, collateralAmount, collateralIndexClamped]);

  const max =
    debtBalance.balance?.balance &&
    debtBalance.balance?.balance > p.debts[0].amount
      ? p.debts[0].amount
      : debtBalance.balance?.balance || 0n;

  const [simulationState, setSimulationState] = useState<
    SimulationState | undefined
  >();
  const { t } = useTranslation();

  return (
    <MsgProvider msg={msg}>
      <div style={{ marginLeft: "-0.5rem", marginRight: "-0.5rem" }}>
        <div className="row wrap gap-y-2 pad--sm mt-3">
          <div className="col-12 col-md-6">
            <h3 className="fs-14 fw-500 color-grey mb-1 mb-md-3.5 ml-2">
              {t("withdrawCollateral")}
            </h3>
            <SwapSelect
              selected={selectedCollateral.asset}
              options={p.collaterals.length > 1 ? collateralOptions : undefined}
              onSelect={(a) => {
                const idx = p.collaterals.findIndex(
                  (c) => c.asset.asset === a.asset
                );
                if (idx !== -1) setCollateralIndex(idx);
              }}
              amount={collateralAmount}
              onChangeAmount={setCollateralAmount}
              full
              max={collateralMax}
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
                max={collateralMax}
              />
              <a
                className="fs-12 condensed fw-500 color-grey ml-0.5 pointer"
                onClick={() => setCollateralAmount(collateralMax)}>
                100%
              </a>
            </div>
          </div>
          <div className="col-12 col-md-6">
            <h3 className="fs-14 fw-500 color-grey mb-1 ml-2">
              {t("repayLoan")}
            </h3>
            <BalanceCompact
              className="mb-0.5 px-1 ml-1"
              onClick={(v) => setDebtAmount(v.balance > max ? max : v.balance)}
            />
            <SwapSelect
              selected={p.debts[0].asset}
              amount={debtAmount}
              onChangeAmount={setDebtAmount}
              full
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
                max={max}
              />
              <a
                className="fs-12 condensed fw-500 color-grey ml-0.5 pointer"
                onClick={() => setDebtAmount(max)}>
                100%
              </a>
            </div>
          </div>
          <AdjustmentSummary
            p={q}
            projectedRate={projectedRate}
            simulationState={simulationState}
            originalDebtAmount={p.debts[0].amount}
          />
          {debtAmount > p.debts[0].amount && (
            <div className={"col-12"}>
              <Warning
                color="primary5"
                className="warning--borderless mt-2 condensed flex ai-c">
                <Icons.ExclamationCircle
                  style={{ width: "2rem", height: "2rem", flexShrink: 0 }}
                />
                <div className="text-left">{t("excessRepaymentWarning")}</div>
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
          {debtAmount > 0n ? (
            <TxBalanceAccountButton
              required={{ amount: debtAmount, asset: debtBalance.asset }}
              label={
                debtAmount > 0n && collateralAmount === 0n
                  ? t("repayLoan")
                  : t("repayAndWithdraw")
              }
              onSuccess={hideModal}
              hideSimulation
              onSimulation={setSimulationState}
            />
          ) : (
            <TxButton
              label={
                collateralAmount > 0n ? t("withdrawCollateral") : t("manage")
              }
              onSuccess={hideModal}
              hideSimulation
              onSimulation={setSimulationState}
            />
          )}
        </div>
      </div>
    </MsgProvider>
  );
};
