import { FC, useCallback, useState } from "react";
import {
  NumericFormat,
  NumericFormatProps,
  numericFormatter,
  OnValueChange,
} from "react-number-format";

const separators = () => {
  const formatter = new Intl.NumberFormat();
  const parts = formatter.formatToParts(12345.6);
  const group = parts.find((p) => p.type === "group")?.value || ",";
  const decimal = parts.find((p) => p.type === "decimal")?.value || ".";
  return { group, decimal };
};
const { decimal, group } = separators();

const parseFixed = (v: string, decimals: number): bigint => {
  const [int, dec] = v.replaceAll(",", "").split(".");
  const intVal = BigInt(int) * 10n ** BigInt(decimals);
  const trimmed = dec?.slice(0, decimals);
  const decVal = trimmed ? BigInt(trimmed.padEnd(decimals, "0")) : 0n;
  return intVal + decVal;
};

const trim = /\.0+$|(?<=\.\d*[1-9])0+$/;

const format = (v: bigint, decimals: number): string => {
  if (decimals === 0) {
    return Number(v).toString();
  }
  // Manually split to prevent floating point issued eg (100000.92).toFixed(12) => 100000.919999999998
  const str = v.toString().padStart(decimals, "0");
  const lead = str.slice(0, -decimals);
  return numericFormatter(
    `${lead.length ? lead : "0"}.${str.slice(-decimals)}`,
    { decimalScale: decimals }
  );
};

export const DecimalInput: FC<
  NumericFormatProps & {
    amount: bigint;
    onAmountchange: (v: bigint) => void;
    decimals?: number;
    allowNegative?: boolean;
    initialZeroAsPlaceholder?: boolean;
  }
> = ({
  amount,
  decimals = 8,
  onAmountchange,
  disabled,
  allowNegative = false,
  initialZeroAsPlaceholder = false,
  ...rest
}) => {
  const formatted = format(amount, decimals);
  const trimmed = formatted.replace(trim, "");
  const [previousValue, setPreviousValue] = useState(
    initialZeroAsPlaceholder && amount === 0n ? "" : trimmed
  );
  const [previousAmount, setPreviousAmount] = useState(amount);
  const onValueChange: OnValueChange = useCallback(
    (values, sourceInfo) => {
      // `values.value` is always a dot separated decimal
      const intValue = parseFixed(values.value, decimals);
      setPreviousValue(values.value);
      setPreviousAmount(intValue);
      // Only propagate changes triggered by the user, not programmatic value prop updates
      if (sourceInfo.source === "event") {
        onAmountchange(intValue);
      }
    },
    [decimals]
  );

  return (
    <NumericFormat
      allowNegative={allowNegative}
      decimalScale={decimals}
      decimalSeparator={decimal}
      thousandSeparator={group}
      disabled={disabled}
      placeholder="0"
      maxLength={35}
      value={
        // Unique case if decimal digits are deleted up to the separator, causing
        // we want to retain the decimal separator in the input
        // Secondly don't change the input value to `trimmed` if the value hassn't changed
        // eg 100. -> 100.0, which causes a change loop and input to be reset to 100
        previousValue === `${trimmed}.` || previousAmount === amount
          ? previousValue
          : trimmed
      }
      onValueChange={onValueChange}
      {...rest}
    />
  );
};
