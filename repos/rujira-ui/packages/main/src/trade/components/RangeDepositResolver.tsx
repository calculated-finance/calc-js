import clsx from "clsx";
import { FC, ReactNode } from "react";
import { isThor, type Asset } from "rujira.js";
import { Button, useTranslation } from "rujira.ui";
import {
  useOmniFunding,
  type OmniFunding,
} from "../../common/components/Balance";
import { useDeposit } from "../../common/components/Deposit";
import { useAccounts } from "../../services/accounts";

type RangeSide = {
  asset: Asset;
  amount: bigint;
  /** False where the range has no side here, so the position never needs it. */
  needed: boolean;
};

export const RangeDepositResolver: FC<{
  base: RangeSide;
  quote: RangeSide;
  onAutoFit: () => void;
  expand?: boolean;
  skip?: boolean;
  className?: string;
  children: ReactNode;
}> = ({ base, quote, onAutoFit, expand, skip, className, children }) => {
  const { t } = useTranslation("common");
  const { accounts } = useAccounts();
  const baseFunding = useOmniFunding(base.asset);
  const quoteFunding = useOmniFunding(quote.asset);
  const connected = !!accounts?.some((a) => isThor(a.address));

  const unfunded = (side: RangeSide, { spendable }: OmniFunding) =>
    side.needed && spendable === 0n;

  const short = (side: RangeSide, funding: OmniFunding) =>
    unfunded(side, funding) || (side.needed && side.amount > funding.spendable);

  const baseShort = short(base, baseFunding);
  const quoteShort = short(quote, quoteFunding);

  // If either side has no balance on Rujira, don't show the Fit to Balances button.
  const fittable =
    !unfunded(base, baseFunding) && !unfunded(quote, quoteFunding);

  const target =
    baseShort && quoteShort
      ? quoteFunding.depositableUsdValue > baseFunding.depositableUsdValue
        ? quote
        : base
      : baseShort
        ? base
        : quoteShort
          ? quote
          : null;

  const deposit = useDeposit(0n, target?.asset);

  if (skip || !connected || !target) return <>{children}</>;

  return (
    <div className={clsx("flex ai-c jc-e wrap gap-1", className)}>
      <Button
        className={clsx({ expand })}
        label={t("depositSymbol", {
          symbol: target.asset.metadata.symbol,
        })}
        onClick={deposit}
      />
      {fittable ? (
        <Button
          className={clsx("button--outline", { expand })}
          label={t("autoFit")}
          onClick={onAutoFit}
        />
      ) : null}
    </div>
  );
};
