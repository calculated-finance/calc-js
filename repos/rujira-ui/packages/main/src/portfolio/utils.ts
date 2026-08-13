import { BalanceContextFragment$data } from "../common/components/__generated__/BalanceContextFragment.graphql";
import { isSunsetSymbol } from "../services/asset";
import { PortfolioFragment$data } from "./__generated__/PortfolioFragment.graphql";

export interface PortfolioValue {
  total: bigint;
  balances: bigint;
  merge: bigint;
  orders: bigint;
  strategies: bigint;
}

export const tokenValue = (
  amount: bigint,
  decimals: number,
  price: bigint
): bigint => {
  // multiply at 24 dp and then reduce to the 12 used for prices
  const val = amount * 10n ** (24n - BigInt(decimals)) * (price * 10n ** 12n);
  return val / 10n ** 36n;
};

type Balances = Extract<
  BalanceContextFragment$data["balancesV2"],
  { ok: true }
>["value"]["edges"];

export const totalValue = (
  account: PortfolioFragment$data,
  balances: Balances
): bigint => balancesValue(balances) + accountValue(account);

export const balancesValue = (balances: Balances): bigint =>
  (balances || []).reduce(
    (a, v) =>
      v?.node?.valueUsd && !isSunsetSymbol(v.node.asset.metadata.symbol)
        ? a + v.node.valueUsd
        : a,
    0n
  );

export const isUnclaimedMerge = (v: { readonly shares: bigint }): boolean =>
  v.shares !== 0n;

export const accountValue = (account: PortfolioFragment$data): bigint =>
  (account?.fin?.ordersV2?.edges || []).reduce(
    (a, v) =>
      a + BigInt(v?.node && "valueUsd" in v?.node ? v?.node?.valueUsd : 0),
    0n
  ) +
  (account.fin?.ranges?.edges || []).reduce(
    (a, v) => (v?.node ? v.node.valueUsd + a : a),
    0n
  ) +
  (account?.strategies || []).reduce(
    (a, v) =>
      a +
      BigInt(
        v.__typename === "%other"
          ? 0
          : v.__typename === "IndexAccount"
            ? v.sharesValue
            : v.valueUsd
      ),
    0n
  ) +
  (account?.merge?.accounts || [])
    .filter(isUnclaimedMerge)
    .reduce((a, v) => a + BigInt(v.valueUsd), 0n) +
  (account?.credit?.accounts || []).reduce(
    (a, v) => a + BigInt(v.valueUsd),
    0n
  );
