import clsx from "clsx";
import { clipAmount, compress, whatDecimalSeparator } from "../../helpers";

export const Decimal = ({
  amount,
  decimals = 8,
  round = 6,
  symbol,
  symbolLeft,
  padSymbol = true,
  className,
  onClick,
  as: Component = "div",
  symbolClassName,
  subscript,
  clip = false,
}: {
  amount: bigint;
  decimals?: number;
  round?: number;
  symbol?: string;
  symbolLeft?: boolean;
  padSymbol?: boolean;
  className?: string;
  onClick?: () => void;
  as?: React.ElementType;
  symbolClassName?: string;
  subscript?: boolean;
  clip?: boolean;
}) => {
  const normalizedAmount =
    typeof amount === "bigint" ? amount : BigInt(amount || 0);
  const normalizedDecimals = Number(decimals) || 0;

  const componentClass = clsx({
    decimal: true,
    "decimal--label-left": symbolLeft,
    "decimal--no-pad": !padSymbol,
    [`${className}`]: className,
  });

  const symbolEl = symbol && (
    <span
      className={clsx({
        decimal__symbol: true,
        [`${symbolClassName}`]: symbolClassName,
      })}>
      {symbol}
    </span>
  );

  if (clip) {
    const { intStr, sep, decStr } = clipAmount(normalizedAmount, normalizedDecimals);
    return (
      <Component className={componentClass} onClick={onClick}>
        <span className="decimal__int">
          {intStr}
          {sep && whatDecimalSeparator()}
        </span>
        {sep && <span className="decimal__dec">{decStr}</span>}
        {symbolEl}
      </Component>
    );
  }

  const scale = 10n ** BigInt(normalizedDecimals);
  const dec = normalizedAmount % scale;
  const int = normalizedAmount / scale;
  const padded = dec.toString().padStart(normalizedDecimals, "0");

  let needsSubscript = false;
  if (int <= 0n && dec > 0n && round) {
    const padLength = normalizedDecimals - dec.toString().length;
    if (padLength >= round) {
      needsSubscript = true;
    }
  }

  const truncated = subscript && needsSubscript ? compress(padded) : padded;
  const trimmed = truncated.substring(0, round);

  return (
    <Component className={componentClass} onClick={onClick}>
      <span className="decimal__int">
        {(int || "0").toLocaleString()}
        {round > 0 && whatDecimalSeparator()}
      </span>
      {dec.toString().length && round > 0 && (
        <span className="decimal__dec">{trimmed}</span>
      )}
      {symbolEl}
    </Component>
  );
};
