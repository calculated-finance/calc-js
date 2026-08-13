import { decodeAddress } from "rujira.js";

export type VaultInterest = {
  baseRate: bigint;
  step1: bigint;
  step2: bigint;
  targetRatio: bigint;
  vaultTotalDeposits: bigint;
  vaultTotalDebts: bigint;
};

export const computeProjectedRate = (
  vi: VaultInterest,
  currentDebt: bigint,
  projectedDebt: bigint
): bigint => {
  if (vi.vaultTotalDeposits === 0n) return vi.baseRate;

  const newVaultDebtSize = vi.vaultTotalDebts - currentDebt + projectedDebt;
  const clamped =
    newVaultDebtSize < 0n
      ? 0n
      : newVaultDebtSize > vi.vaultTotalDeposits
        ? vi.vaultTotalDeposits
        : newVaultDebtSize;

  const newRatio = (clamped * 10n ** 12n) / vi.vaultTotalDeposits;

  if (newRatio < vi.targetRatio) {
    return vi.targetRatio > 0n
      ? vi.baseRate + (newRatio * vi.step1) / vi.targetRatio
      : vi.baseRate;
  }

  return (
    vi.baseRate +
    vi.step1 +
    ((newRatio - vi.targetRatio) * (vi.step2 - vi.step1)) /
      (10n ** 12n - vi.targetRatio)
  );
};

/**
 * A single collateral asset within a Credit Account.
 */
export interface CdpCollateral<T> {
  asset: T;
  amount: bigint;
  value: bigint;
  valueAdjusted: bigint;
  price: bigint;
  ratio: bigint;
  min: bigint;
  minAdjust: bigint;
  liquidationPrice: bigint;
}

/**
 * A single debt asset within a Credit Account.
 */
export interface CdpDebt<T> {
  asset: T;
  amount: bigint;
  value: bigint;
  price: bigint;
  rate: bigint;
  max: bigint;
  maxAdjust: bigint;
  liquidationPrice: bigint;
}

/**
 * Utility interface for managing Credit Accounts with any combination of
 * single/multiple collateral and single/multiple debt positions.
 */
export interface Cdp<T> {
  ltv: bigint;
  adjustmentMax: bigint;
  account: {
    address: string;
  };
  collaterals: CdpCollateral<T>[];
  collateralValueUsd: bigint;
  collateralValueAdjustedUsd: bigint;
  collateralLiquidationValueUsd: bigint;
  collateralLiquidationDelta: bigint;
  debts: CdpDebt<T>[];
  debtValueUsd: bigint;
  debtLiquidationValueUsd: bigint;
  debtLiquidationDelta: bigint;
}

type CdpCollateralInput<T> = {
  asset: T;
  amount: bigint;
  value: bigint;
  valueAdjusted: bigint;
  price: bigint;
  ratio: bigint;
};

type CdpDebtInput<T> = {
  asset: T;
  amount: bigint;
  value: bigint;
  price: bigint;
  rate: bigint;
};

type CdpInput<T> = {
  account: { address: string };
  adjustmentMax: bigint;
  collaterals: CdpCollateralInput<T>[];
  debts: CdpDebtInput<T>[];
  collateralLiquidationValueUsd: bigint;
  debtLiquidationValueUsd: bigint;
};

// Inverse of Borrow.tsx's encodeAssetLabel: restores the full asset id from a
// credit-account label. Decodes the Base64url-compressed EVM address back to
// 0X-uppercase form (matching the graph's `asset` string). Legacy labels that
// already carry a raw 0x address are returned untouched.
const decodeAssetLabel = (label: string): string => {
  const [chain, symbol, ...rest] = label.split("-");
  if (rest.length === 0) return label;
  const addr = rest.join("-");
  if (/^0x[0-9a-f]{40}$/i.test(addr)) return label;
  return `${chain}-${symbol}-${decodeAddress(addr).toUpperCase()}`;
};

export namespace Cdp {
  // used during the creation of a new position, which currently always starts off as single collateral.
  export const fromInput = <T,>(
    deposit: {
      amount: bigint;
      price: bigint;
      asset: T;
      ratio: bigint;
    },
    borrow: {
      amount: bigint;
      price: bigint;
      rate: bigint;
      asset: T;
    },
    config: { adjustmentMax: bigint },
    next?: { account: string }
  ): Cdp<T> => {
    const collateralValue = (deposit.amount * deposit.price) / 10n ** 12n;
    const collateralValueAdjusted =
      (collateralValue * deposit.ratio) / 10n ** 12n;
    const debtValue = (borrow.amount * borrow.price) / 10n ** 12n;

    const collateralLiquidationValueUsd =
      collateralValueAdjusted > 0n
        ? (debtValue * collateralValue) / collateralValueAdjusted
        : 0n;

    return compute({
      account: { address: next?.account || "" },
      adjustmentMax: config.adjustmentMax,
      collaterals: [
        {
          asset: deposit.asset,
          amount: deposit.amount,
          value: collateralValue,
          valueAdjusted: collateralValueAdjusted,
          price: deposit.price,
          ratio: deposit.ratio,
        },
      ],
      debts: [
        {
          asset: borrow.asset,
          amount: borrow.amount,
          value: debtValue,
          rate: borrow.rate,
          price: borrow.price,
        },
      ],
      collateralLiquidationValueUsd,
      debtLiquidationValueUsd: collateralValueAdjusted,
    });
  };

  export const fromGraph = <T,>(
    v: {
      account: {
        address: string;
        label: string;
      };
      collaterals: ReadonlyArray<{
        collateral:
          | {
              __typename: "Balance";
              asset: T;
              amount: bigint;
            }
          | {
              __typename: "%other";
            };
        valueAdjusted: bigint;
        valueFull: bigint;
      }>;
      debts: ReadonlyArray<{
        debt: {
          borrower: {
            asset: T;
            vault: {
              status: {
                debtRate: bigint;
              };
            };
          };
          current: bigint;
        };
        value: bigint;
      }>;
      collateralLiquidationValueUsd?: bigint;
      debtLiquidationValueUsd?: bigint;
    },
    config: { adjustmentThreshold: bigint }
  ): Cdp<T> => {
    // The account label encodes the asset pair as "COLLATERAL/DEBT"; only the
    // debt side is needed, for the paid-off placeholder below.
    const [, debtAssetStr] = v.account.label.toString().split("/");

    const isBalanceCollateral = (
      c: (typeof v.collaterals)[number]
    ): c is {
      collateral: { __typename: "Balance"; asset: T; amount: bigint };
      valueAdjusted: bigint;
      valueFull: bigint;
    } => c.collateral.__typename === "Balance";

    const collaterals = v.collaterals.filter(isBalanceCollateral).map((c) => {
      // todo: We should get this value added to the API schema so that we don't have to recompute it
      // or look it up via some map.
      const ratio = c.valueFull
        ? (c.valueAdjusted * 10n ** 12n) / c.valueFull
        : 0n;
      return {
        asset: c.collateral.asset,
        amount: c.collateral.amount,
        value: c.valueFull,
        valueAdjusted: c.valueAdjusted,
        price: 0n,
        ratio,
      };
    });

    // NOTE: The synthesis behaviour described below can be deprecated once
    // we implement multi debt positions, as we can then simply have an empty
    // array of debts along with existing collateral(s). Currently, there is
    // UI code that expects at least 1 asset in a position that has collateral.

    // A position can never hold debt without collateral, so an account with no
    // collateral is fully closed — leave both sides empty and let consumers
    // detect the closed state via `collaterals.length === 0`. When collateral
    // remains but the debt is fully repaid, synthesise the debt asset from the
    // label so the paid-off position still renders.
    const debts =
      collaterals.length === 0
        ? []
        : v.debts.length > 0
          ? v.debts.map((d) => ({
              asset: d.debt.borrower.asset,
              amount: d.debt.current,
              value: d.value,
              rate: d.debt.borrower.vault.status.debtRate,
              price: 0n,
            }))
          : [
              {
                asset: {
                  asset: decodeAssetLabel(debtAssetStr),
                  chain: debtAssetStr.split("-")[0],
                  metadata: {
                    symbol: debtAssetStr.split("-")[1],
                  },
                } as unknown as T,
                amount: 0n,
                value: 0n,
                rate: 0n,
                price: 0n,
              },
            ];

    return compute({
      account: v.account,
      adjustmentMax: config.adjustmentThreshold,
      collaterals,
      debts,
      collateralLiquidationValueUsd: v.collateralLiquidationValueUsd ?? 0n,
      debtLiquidationValueUsd: v.debtLiquidationValueUsd ?? 0n,
    });
  };

  const compute = <T,>(p: CdpInput<T>): Cdp<T> => {
    // Fill in any missing per-asset prices from value / amount.
    const pricedCollaterals = p.collaterals.map((c) => ({
      ...c,
      price: c.price || (c.amount ? (c.value * 10n ** 12n) / c.amount : 0n),
    }));
    const pricedDebts = p.debts.map((d) => ({
      ...d,
      price: d.price || (d.amount ? (d.value * 10n ** 12n) / d.amount : 0n),
    }));

    const collateralValueUsd = pricedCollaterals.reduce(
      (a, c) => a + c.value,
      0n
    );
    const collateralValueAdjustedUsd = pricedCollaterals.reduce(
      (a, c) => a + c.valueAdjusted,
      0n
    );
    const debtValueUsd = pricedDebts.reduce((a, d) => a + d.value, 0n);

    // Account-level deltas: how far the (uniformly scaled) collateral / debt
    // side can move before liquidation.
    const collateralLiquidationDeltaRaw =
      p.collateralLiquidationValueUsd && collateralValueUsd
        ? ((collateralValueUsd - p.collateralLiquidationValueUsd) *
            10n ** 12n) /
          collateralValueUsd
        : 0n;
    const collateralLiquidationDelta =
      collateralLiquidationDeltaRaw < 0n ? 0n : collateralLiquidationDeltaRaw;

    const debtLiquidationDeltaRaw =
      p.debtLiquidationValueUsd && debtValueUsd
        ? ((p.debtLiquidationValueUsd - debtValueUsd) * 10n ** 12n) /
          debtValueUsd
        : 0n;
    const debtLiquidationDelta =
      debtLiquidationDeltaRaw < 0n ? 0n : debtLiquidationDeltaRaw;

    const collaterals: CdpCollateral<T>[] = pricedCollaterals.map((c) => {
      // Distribute the account liquidation value by full-value share, then
      // express it as a per-unit price. This matches the "uniform price
      // decline" model shown to users in Health.tsx. This calculation is only equivalent to a
      // valueAdjusted-share split when every collateral shares the same ratio.
      // This calculation is a very high-level estimate as it assumes
      // market conditions in the future that will never be known/predictable when
      // dealing with a basket of collateral assets. It is, therefore, a best effort
      // estimate to give the user some sort of idea about where they will get liquidated.
      const liqShare =
        collateralValueUsd > 0n
          ? (p.collateralLiquidationValueUsd * c.value) / collateralValueUsd
          : 0n;
      const liquidationPriceRaw = c.amount
        ? (liqShare * 10n ** 12n) / c.amount
        : 0n;
      const liquidationPrice =
        liquidationPriceRaw < 0n ? 0n : liquidationPriceRaw;

      // Minimum amount of this collateral needed to back all debt, with the
      // other collateral held constant.
      const otherAdjusted = collateralValueAdjustedUsd - c.valueAdjusted;
      const neededAdjusted =
        debtValueUsd - otherAdjusted < 0n ? 0n : debtValueUsd - otherAdjusted;
      const min = c.valueAdjusted
        ? (neededAdjusted * c.amount) / c.valueAdjusted
        : 0n;
      const minAdjust = p.adjustmentMax
        ? (min * 10n ** 12n) / p.adjustmentMax
        : 0n;

      return { ...c, min, minAdjust, liquidationPrice };
    });

    const debts: CdpDebt<T>[] = pricedDebts.map((d) => {
      const liqShare =
        debtValueUsd > 0n
          ? (p.debtLiquidationValueUsd * d.value) / debtValueUsd
          : 0n;
      const liquidationPrice = d.amount
        ? (liqShare * 10n ** 12n) / d.amount
        : 0n;

      // Maximum amount of this debt the collateral can back, with the other
      // debt held constant.
      const otherDebt = debtValueUsd - d.value;
      const room =
        collateralValueAdjustedUsd - otherDebt < 0n
          ? 0n
          : collateralValueAdjustedUsd - otherDebt;
      const max = d.price ? (room * 10n ** 12n) / d.price : 0n;
      const maxAdjust = (max * p.adjustmentMax) / 10n ** 12n;

      return { ...d, max, maxAdjust, liquidationPrice };
    });

    const ltvRaw = collateralValueAdjustedUsd
      ? (debtValueUsd * 10n ** 12n) / collateralValueAdjustedUsd
      : 0n;
    const ltv = ltvRaw < 0n ? 0n : ltvRaw;

    return {
      account: p.account,
      adjustmentMax: p.adjustmentMax,
      collaterals,
      debts,
      collateralValueUsd,
      collateralValueAdjustedUsd,
      debtValueUsd,
      collateralLiquidationValueUsd: p.collateralLiquidationValueUsd,
      debtLiquidationValueUsd: p.debtLiquidationValueUsd,
      collateralLiquidationDelta,
      debtLiquidationDelta,
      ltv,
    };
  };

  export const depositAndBorrow = <T,>(
    p: Cdp<T>,
    depositAmount: bigint,
    borrowAmount: bigint,
    collateralIndex = 0,
    debtIndex = 0
  ): Cdp<T> => {
    const collaterals = p.collaterals.map((c, i) => {
      if (i !== collateralIndex) return c;

      //adjust the collateral item when it matches the index of the collateral we are depositing
      const amount = c.amount + depositAmount;
      const value = c.amount
        ? (c.value * amount) / c.amount
        : c.price
          ? (amount * c.price) / 10n ** 12n
          : 0n;
      const valueAdjusted = c.amount
        ? (c.valueAdjusted * amount) / c.amount
        : c.ratio
          ? (value * c.ratio) / 10n ** 12n
          : 0n;
      return { ...c, amount, value, valueAdjusted };
    });

    const debts = p.debts.map((d, i) => {
      if (i !== debtIndex) return d;

      //adjust the debt item when it matches the index of the debt we are taking out.
      const amount = d.amount + borrowAmount;
      const value = d.amount
        ? (d.value * amount) / d.amount
        : d.price
          ? (amount * d.price) / 10n ** 12n
          : 0n;
      return { ...d, amount, value };
    });

    const collateralValueUsd = collaterals.reduce((a, c) => a + c.value, 0n);
    const collateralValueAdjustedUsd = collaterals.reduce(
      (a, c) => a + c.valueAdjusted,
      0n
    );
    const debtValueUsd = debts.reduce((a, d) => a + d.value, 0n);

    // Estimate only: assumes all collateral assets scale proportionally, so
    // it's exact for one asset/uniform ratios but approximate otherwise.
    const collateralLiquidationValueUsd =
      collateralValueAdjustedUsd > 0n
        ? (debtValueUsd * collateralValueUsd) / collateralValueAdjustedUsd
        : 0n;

    return compute({
      account: p.account,
      adjustmentMax: p.adjustmentMax,
      collaterals,
      debts,
      collateralLiquidationValueUsd,
      debtLiquidationValueUsd: collateralValueAdjustedUsd,
    });
  };

  export const withOraclePricing = <T,>(
    p: Cdp<T>,
    collateralPrice: bigint | undefined,
    debtPrice: bigint | undefined,
    collateralRatio: bigint | undefined,
    collateralIndex = 0,
    debtIndex = 0
  ): Cdp<T> => {
    if (!collateralPrice && !debtPrice) return p;

    const collaterals = p.collaterals.map((c, i) => {
      if (i !== collateralIndex) return c;
      const price = collateralPrice ?? c.price;
      const ratio = collateralRatio ?? c.ratio;
      const value =
        collateralPrice && c.amount ? (c.amount * price) / 10n ** 12n : c.value;
      const valueAdjusted =
        collateralPrice && collateralRatio && c.amount
          ? (value * ratio) / 10n ** 12n
          : c.valueAdjusted;
      return { ...c, price, ratio, value, valueAdjusted };
    });

    const debts = p.debts.map((d, i) => {
      if (i !== debtIndex) return d;
      const price = debtPrice ?? d.price;
      const value =
        debtPrice && d.amount ? (d.amount * price) / 10n ** 12n : d.value;
      return { ...d, price, value };
    });

    return compute({
      account: p.account,
      adjustmentMax: p.adjustmentMax,
      collaterals,
      debts,
      collateralLiquidationValueUsd: p.collateralLiquidationValueUsd,
      debtLiquidationValueUsd: p.debtLiquidationValueUsd,
    });
  };

  export const repayAndWithdraw = <T,>(
    p: Cdp<T>,
    repayAmount: bigint,
    withdrawAmount: bigint,
    collateralIndex = 0,
    debtIndex = 0
  ): Cdp<T> =>
    depositAndBorrow(
      p,
      -withdrawAmount,
      -repayAmount,
      collateralIndex,
      debtIndex
    );

  export const swapCollateral = <T,>(
    p: Cdp<T>,
    fromAmount: bigint,
    newAmount: bigint,
    oraclePrice: bigint,
    newCollateralRatio: bigint,
    newAsset: T,
    isSameAsset: (a: T, b: T) => boolean,
    collateralIndex = 0
  ): Cdp<T> => {
    const value = (newAmount * oraclePrice) / 10n ** 12n;
    const valueAdjusted = (value * newCollateralRatio) / 10n ** 12n;

    const source = p.collaterals[collateralIndex];
    const remainingAmount =
      source && source.amount > fromAmount ? source.amount - fromAmount : 0n;
    const remainingValue = source?.amount
      ? (source.value * remainingAmount) / source.amount
      : 0n;
    const remainingValueAdjusted = source?.amount
      ? (source.valueAdjusted * remainingAmount) / source.amount
      : 0n;

    const existingIndex = p.collaterals.findIndex(
      (c, i) => i !== collateralIndex && isSameAsset(c.asset, newAsset)
    );

    const collaterals =
      existingIndex === -1
        ? remainingAmount > 0n
          ? [
              ...p.collaterals.map((c, i) =>
                i === collateralIndex
                  ? {
                      ...c,
                      amount: remainingAmount,
                      value: remainingValue,
                      valueAdjusted: remainingValueAdjusted,
                    }
                  : c
              ),
              {
                asset: newAsset,
                price: oraclePrice,
                amount: newAmount,
                value,
                valueAdjusted,
                ratio: newCollateralRatio,
              },
            ]
          : p.collaterals.map((c, i) =>
              i === collateralIndex
                ? {
                    ...c,
                    asset: newAsset,
                    price: oraclePrice,
                    amount: newAmount,
                    value,
                    valueAdjusted,
                    ratio: newCollateralRatio,
                  }
                : c
            )
        : p.collaterals
            .map((c, i) =>
              i === existingIndex
                ? {
                    ...c,
                    amount: c.amount + newAmount,
                    value: c.value + value,
                    valueAdjusted: c.valueAdjusted + valueAdjusted,
                  }
                : i === collateralIndex
                  ? {
                      ...c,
                      amount: remainingAmount,
                      value: remainingValue,
                      valueAdjusted: remainingValueAdjusted,
                    }
                  : c
            )
            .filter((_, i) => i !== collateralIndex || remainingAmount > 0n);

    const collateralValueUsd = collaterals.reduce((a, c) => a + c.value, 0n);
    const collateralValueAdjustedUsd = collaterals.reduce(
      (a, c) => a + c.valueAdjusted,
      0n
    );

    const collateralLiquidationValueUsd =
      collateralValueAdjustedUsd > 0n
        ? (p.debtValueUsd * collateralValueUsd) / collateralValueAdjustedUsd
        : 0n;

    return compute({
      account: p.account,
      adjustmentMax: p.adjustmentMax,
      collaterals,
      debts: p.debts,
      collateralLiquidationValueUsd,
      debtLiquidationValueUsd: collateralValueAdjustedUsd,
    });
  };
}
