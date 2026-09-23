import clsx from "clsx";
import { FC } from "react";
import { Button, Icons, useTranslation, Warning } from "rujira.ui";
import type { Side } from "../hooks/useClampedPair";

type Props = {
  baseLabel: string;
  quoteLabel: string;
  enteredSide: Side;
  baseOver: boolean;
  quoteOver: boolean;
  onFix: () => void;
  className?: string;
};

export const RangeBalanceWarning: FC<Props> = ({
  baseLabel,
  quoteLabel,
  enteredSide,
  baseOver,
  quoteOver,
  onFix,
  className,
}) => {
  const { t } = useTranslation();

  const enteredLabel = enteredSide === "base" ? baseLabel : quoteLabel;
  const shortLabel = enteredSide === "base" ? quoteLabel : baseLabel;
  const balanceShort = enteredSide === "base" ? baseOver : quoteOver;
  const action = t("common:autoFit");

  return (
    <Warning color="orange" className={clsx("mt-3 flex ai-c", className)}>
      <Icons.ExclamationTriangle
        className="warning__icon"
        style={{ height: "2.5rem", marginTop: 0, marginRight: "0.5rem" }}
      />
      <span className="warning__msg">
        {balanceShort
          ? t("enteredSideShort", { entered: enteredLabel, action })
          : t("counterSideShort", {
              short: shortLabel,
              entered: enteredLabel,
              action,
            })}
      </span>
      <Button
        label={action}
        className="button--xs button--orange button--outline no-shrink ml-1 mr-1.5"
        onClick={onFix}
      />
    </Warning>
  );
};
