import clsx from "clsx";
import { useId } from "react";
import { Tooltip } from "react-tooltip";
import { clipAmount, whatDecimalSeparator } from "../../helpers";
import { toFiatDisplay } from "../../utils/fiat";

export const Fiat = ({
  amount,
  decimals = 2,
  symbol = "$",
  className,
  symbolRight = false,
  padSymbol = true,
  symbolSmall = false,
  as: Component = "div",
  clip = false,
  round = 2,
}: {
  amount: bigint;
  decimals?: number;
  symbol?: string;
  className?: string;
  symbolRight?: boolean;
  padSymbol?: boolean;
  symbolSmall?: boolean;
  as?: React.ElementType;
  clip?: boolean;
  round?: number;
}) => {
  const tipId = useId();

  const componentClass = clsx({
    fiat: true,
    "fiat--symbol-right": symbolRight,
    [`${className}`]: className,
  });

  const symbolSpanClass = clsx({
    fiat__symbol: true,
    "fiat__symbol--small": symbolSmall,
    "mr-0.5": padSymbol && !symbolRight,
    "ml-0.5": padSymbol && symbolRight,
  });

  const symbolEl = symbol && <span className={symbolSpanClass}>{symbol}</span>;

  const subDisplayMin = BigInt(10 ** Math.max(0, decimals - round));

  if (amount > 0n && amount < subDisplayMin) {
    const fullStr = `${symbol ?? ""}${toFiatDisplay(amount, { decimals, rounding: decimals }).replace(/\.?0+$/, "")}`;
    return (
      <Component
        className={componentClass}
        data-tooltip-id={tipId}
        data-tooltip-content={fullStr}>
        <span
          className={clsx("fiat__less-than mr-0.5", {
            "fiat__less-than--small": symbolSmall,
          })}>
          {"<"}
        </span>
        <span className="fiat__int">{`0${whatDecimalSeparator()}`}</span>
        <span className="fiat__dec">{"1".padStart(round, "0")}</span>
        {symbolEl}
        <Tooltip id={tipId} className="tooltip" />
      </Component>
    );
  }

  if (clip) {
    const { intStr, sep, decStr } = clipAmount(amount, decimals);
    return (
      <Component className={componentClass}>
        <span className="fiat__int">
          {intStr}
          {sep && whatDecimalSeparator()}
        </span>
        {sep && <span className="fiat__dec">{decStr}</span>}
        {symbolEl}
      </Component>
    );
  }

  const dec = amount % BigInt(10 ** decimals);
  const int = BigInt(Math.floor(Number(amount - dec) / 10 ** decimals));
  return (
    <Component className={componentClass}>
      <span className="fiat__int">
        {(int || "0").toLocaleString()}
        {whatDecimalSeparator()}
      </span>
      <span className="fiat__dec">
        {dec.toString().padStart(decimals, "0").substring(0, round)}
      </span>
      {symbolEl}
    </Component>
  );
};
