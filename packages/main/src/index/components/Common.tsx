import clsx from "clsx";
import { FC, PropsWithChildren } from "react";
import { Link } from "react-router-dom";
import { Icons, nFormatter, useTranslation } from "rujira.ui";


export const IndexContainer: FC<PropsWithChildren> = ({ children }) => {
  const { t } = useTranslation();
  return (
    <>
      <div className="rujira__main rujira__main rujira__main--gradient pools">
        <div className="rujira__inner rujira__inner--pad">
          <Link
            to=".."
            className="fs-14 color-grey hover-white no-underline flex ai-c">
            <Icons.ArrowLeft className="w-2 h-a mr-0.5" />
            {t("backToIndexes")}
          </Link>
          {children}
        </div>
      </div>
    </>
  );
};

export const DailyChange: FC<{
  percentageChange: bigint | number;
  className?: string;
  tag?: boolean;
  centered?: boolean;
}> = ({ percentageChange, className = "", tag = false, centered = false }) => {
  const isBigInt = typeof percentageChange === "bigint";

  const formatNumber = () => {
    if (isBigInt) {
      return nFormatter(percentageChange as bigint, 3, 10);
    } else {
      const numValue = Number(percentageChange) || 0;
      return numValue.toFixed(2);
    }
  };

  if (percentageChange > 0) {
    return (
      <div
        className={clsx(
          "flex ai-c color-teal",
          {
            "jc-c": centered,
            "tag tag--teal": tag,
          },
          className
        )}
        style={{ minWidth: "4.5rem" }}>
        <span>+{formatNumber()}%</span>
        <Icons.TrendUp className="block w-2 ml-0.5" />
      </div>
    );
  }

  if (percentageChange < 0) {
    return (
      <div
        className={clsx(
          "flex ai-c color-red",
          {
            "jc-c": centered,
            "tag tag--red": tag,
          },
          className
        )}
        style={{ minWidth: "4.5rem" }}>
        <span>{formatNumber()}%</span>
        <Icons.TrendDown className="block w-2 ml-0.5" />
      </div>
    );
  }

  return (
    <div
      className={clsx(
        "flex ai-c color-orange",
        {
          "jc-c": centered,
          "tag tag--orange": tag,
        },
        className
      )}
      style={{ minWidth: "4.5rem" }}>
      <span>0.00%</span>
    </div>
  );
};
