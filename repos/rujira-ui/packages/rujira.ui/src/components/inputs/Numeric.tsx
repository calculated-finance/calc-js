import clsx from "clsx";
import { FocusEvent, KeyboardEvent, useEffect, useMemo, useRef } from "react";
import { uuidv4 } from "../../helpers";
import { toFiatAmount } from "../../utils/fiat";
import { useTranslation } from "../../i18n";
import { DecimalInput } from "./DecimalInput";
import { Fiat } from "../numbers/Fiat";

export const Numeric = ({
  label,
  amount,
  decimals = 8,
  onChangeAmount,
  onBlur,
  onFocus,
  onKeyDown,
  focused,
  disabled,
  full,
  className,
  children,
  icon,
  fiat,
  allowNegative,
  initialZeroAsPlaceholder,
  prefix,
  suffix,
}: {
  label?: string;
  amount: bigint;
  decimals?: number;
  onChangeAmount: (a: bigint) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
  focused?: boolean;
  disabled?: boolean;
  full?: boolean;
  className?: string;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  fiat?: { price?: bigint | null; symbol: string };
  allowNegative?: boolean;
  initialZeroAsPlaceholder?: boolean;
  prefix?: string;
  suffix?: string;
}) => {
  const { t } = useTranslation("common");
  const input = useRef<HTMLDivElement>(null);

  const id = useMemo(() => uuidv4(), []);

  const fiatAmount = useMemo(
    () => toFiatAmount(fiat?.price, amount),
    [fiat?.price, amount]
  );

  useEffect(() => {
    if (focused && !disabled) {
      input.current?.focus();
    }
  }, [focused, disabled]);

  return (
    <div
      className={clsx({
        "numeric-input condensed": true,
        "numeric-input--full": full,
        "numeric-input--disabled": disabled,
        [`${className}`]: className,
      })}
      onClick={() => {
        if (!disabled) input.current?.focus();
      }}>
      {label && <label>{t(label)}</label>}
      {children}
      <div
        className={clsx("numeric-input__content", {
          "mt-1 mb-1": fiatAmount != undefined && fiatAmount > 0n,
          "py-2": fiatAmount === 0n,
        })}>
        <DecimalInput
          getInputRef={input}
          decimals={decimals}
          disabled={disabled}
          amount={amount}
          initialZeroAsPlaceholder={initialZeroAsPlaceholder}
          onAmountchange={onChangeAmount}
          onBlur={onBlur}
          onFocus={onFocus}
          onKeyDown={onKeyDown}
          id={id}
          allowNegative={allowNegative}
          prefix={prefix}
          suffix={suffix}
        />
        {fiatAmount != undefined && fiatAmount > 0n && (
          <div className={"flex fs-13 color-grey"}>
            <Fiat
              amount={fiatAmount}
              symbol={fiat!.symbol}
              decimals={8}
              className="numeric-input__value color-grey fs-12"
            />
          </div>
        )}
      </div>
      {icon}
    </div>
  );
};
