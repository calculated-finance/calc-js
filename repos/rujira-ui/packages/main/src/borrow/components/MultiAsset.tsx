import { FC, Fragment, useId } from "react";
import { Tooltip } from "react-tooltip";
import { Decimal, Fiat, IconDenom } from "rujira.ui";
import { PositionBorrowRowFragment$data } from "./__generated__/PositionBorrowRowFragment.graphql";

type CollateralEntry = PositionBorrowRowFragment$data["collaterals"][number];

type BalanceEntry = CollateralEntry & {
  collateral: Extract<CollateralEntry["collateral"], { __typename: "Balance" }>;
};

//This should get extended in the next iteration to support multi-debt tokens too.
export const MultiAsset: FC<{
  collaterals: readonly CollateralEntry[];
}> = ({ collaterals }) => {
  const tooltipId = useId();
  const balanceEntries = collaterals.filter(
    (c): c is BalanceEntry => c.collateral.__typename === "Balance"
  );
  const single = balanceEntries.length === 1;
  const totalValue = collaterals.reduce((a, v) => a + v.valueFull, 0n);

  return (
    <div className="collateral-tokens">
      {balanceEntries.map((c, idx) => {
        const { asset, amount } = c.collateral;

        if (single) {
          return (
            <span
              key={idx}
              className="collateral-tokens__icon collateral-tokens__icon--inline flex">
              <IconDenom
                denom={asset.metadata.symbol}
                className="w-4 block mr-1"
              />
              <div className={"flex dir-c"}>
                <Fiat
                  amount={c.valueFull}
                  symbol="$"
                  decimals={8}
                  className="fs-16"
                />
                <Decimal
                  className={"color-grey"}
                  amount={amount}
                  symbol={asset.metadata.symbol}
                  subscript
                />
              </div>
            </span>
          );
        }

        const tipId = `${tooltipId}-${idx}`;
        return (
          <Fragment key={idx}>
            <span
              data-tooltip-id={tipId}
              className="collateral-tokens__icon flex">
              <IconDenom denom={asset.metadata.symbol} className="w-3.5 block" />
            </span>
            <Tooltip id={tipId} className="tooltip">
              <div className="condensed">
                <Fiat
                  className={"fs-16 fw-500"}
                  amount={c.valueFull}
                  symbol="$"
                  decimals={8}
                />
                <div className="fs-14 color-grey fw-500">
                  <Decimal
                    amount={amount}
                    symbol={asset.metadata.symbol}
                    subscript
                  />
                </div>
              </div>
            </Tooltip>
          </Fragment>
        );
      })}
      {!single && (
        <Fiat
          amount={totalValue}
          symbol="$"
          decimals={8}
          className="fs-16 text-right ml-1.5"
        />
      )}
    </div>
  );
};
