import { FC } from "react";
import { Decimal, Fiat, IconDenom } from "rujira.ui";

export const SingleAsset: FC<{
  assetSymbol: string;
  assetAmount: bigint;
  assetValue: bigint;
  label: string;
}> = ({ assetSymbol, assetAmount, assetValue, label }) => {
  return (
    <div className={"flex ai-c"}>
      <IconDenom denom={assetSymbol} className="w-6 h-6 mr-1" />
      <div className="flex dir-c">
        <h3 className="fs-14 fw-500 color-grey">{label}</h3>
        <Fiat amount={assetValue} symbol="$" decimals={8} className="fs-16" />
        <Decimal
          amount={assetAmount}
          symbol={assetSymbol}
          subscript
          className={"fs-14 color-grey"}
        />
      </div>
    </div>
  );
};
