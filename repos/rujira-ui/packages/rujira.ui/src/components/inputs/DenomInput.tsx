import clsx from "clsx";
import { useMemo, useRef } from "react";
import { nFormatter, uuidv4 } from "../../helpers";
import { toFiatAmount } from "../../utils/fiat";
import { useTranslation } from "../../i18n";
import { Button } from "../buttons/Button";
import { IconDenom } from "../icons/IconDenom";
import { Decimal } from "../numbers/Decimal";
import { Fiat } from "../numbers/Fiat";
import { DecimalInput } from "./DecimalInput";

export const DenomInput = ({
  symbol,
  amount,
  decimals,
  onChangeAmount,
  disabled,
  readOnly,
  full,
  max,
  className,
  maxLabel,
  fiat,
}: {
  symbol: string;
  amount: bigint;
  decimals: number;
  onChangeAmount: (a: bigint) => void;
  disabled?: boolean;
  readOnly?: boolean;
  full?: boolean;
  max?: bigint;
  maxLabel?: string;
  className?: string;
  fiat?: { price?: bigint | null; symbol: string; };
}) => {
  const { t } = useTranslation("common");
  const input = useRef<HTMLDivElement>(null);
  const id = useMemo(() => uuidv4(), []);

 const fiatAmount = useMemo(() =>
   toFiatAmount(fiat?.price, amount)
  ,[fiat?.price, amount]);

  return (
    <div
      className={clsx({
        "denom-select condensed": true,
        "denom-select--full": full,
        "denom-select--disabled": disabled,
        [`${className}`]: className,
      })}
      onClick={() => {
        if (!disabled) input.current?.focus();
      }}>
      {max !== undefined && (
        <Button
          className="button--xsmall button--icon-right denom-select__balance denom-select__max"
          label={maxLabel || t("max")}
          onClick={() => onChangeAmount(max)}>
          <Decimal amount={max} decimals={decimals} className="fw-700" />
        </Button>
      )}
      <div className="denom-select__selected">
        <IconDenom denom={symbol} />
        <span>{symbol}</span>
      </div>
      {readOnly ? (
        <span className="val">{nFormatter(amount, decimals, decimals)}</span>
      ) : (
        <div
          className={"flex grow dir-r jc-e overflow-hidden pl-1"}
          style={{ width: "50%" }}>
          <div className={"flex dir-c mt-1 ai-e w-full"}>
            <DecimalInput
              getInputRef={input}
              decimals={decimals}
              disabled={disabled}
              amount={amount}
              initialZeroAsPlaceholder
              onAmountchange={onChangeAmount}
              id={id}
            />
            {fiatAmount != undefined && (
              <div className={"flex ml-3 fs-13 color-grey"}>
                <Fiat
                  amount={fiatAmount}
                  symbol={fiat!.symbol}
                  decimals={8}
                  className="numeric-input__value color-grey fs-12"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
