import { FC, memo, useState } from "react";
import { useFragment } from "react-relay";
import { Cell, Pie, PieChart, ResponsiveContainer, Sector } from "recharts";
import { graphql } from "relay-runtime";
import { Card, Decimal, Fiat, IconDenom, useTranslation } from "rujira.ui";
import {
  AllocationFragment$data,
  AllocationFragment$key,
} from "./__generated__/AllocationFragment.graphql";
import { DailyChange } from "./Common";

const colors: Record<string, string> = {
  TCY: "#28F5AF",
  RUNE: "#17E3D1",
  AUTO: "#D534EA",
  LQDY: "#23776B",
  BTC: "#F7931A",
  ETH: "#547FEF",
  RUJI: "#8933F3",
};

type Props = {
  k: AllocationFragment$key;
  s: string;
  t?: string;
};

export const allocationFragment = graphql`
  fragment AllocationFragment on IndexStatus {
    allocations {
      asset {
        asset
        metadata {
          decimals
          symbol
        }
        variants {
          native {
            denom
          }
        }
        price {
          changeDay
        }
      }
      value
      price
      targetWeight
      currentWeight
      balance
    }
  }
`;

type RawAllocation = AllocationFragment$data["allocations"][number];

interface PieDatum {
  name: string;
  value: number;
  denomKey: string;
}

function toPieData(allocations: ReadonlyArray<RawAllocation>): PieDatum[] {
  return allocations.reduce<PieDatum[]>((acc, entry) => {
    const denom = entry.asset?.variants.native?.denom;
    if (!denom) {
      // skip anything with no native denom
      return acc;
    }
    acc.push({
      name: entry.asset?.metadata.symbol ?? "",
      value: Number(BigInt(entry.currentWeight ?? 0)),
      denomKey: denom,
    });
    return acc;
  }, []);
}

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } =
    props;

  // Increase outer radius by e.g. 10 px to “pop out” on hover
  const expandedOuterRadius = outerRadius! + 10;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={expandedOuterRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

interface DiagramProps {
  allocation: AllocationFragment$data["allocations"];
  symbol: string;
  activeIndex: number;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
}

export const Diagram: React.FC<DiagramProps> = ({
  allocation,
  symbol,
  activeIndex,
  setActiveIndex,
}) => {
  const pieData = toPieData(allocation);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(-1);
  };
  return (
    <div className="index__allocationsPieContainer">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            innerRadius="70%"
            outerRadius="90%"
            dataKey="value"
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            onMouseEnter={onPieEnter}
            onMouseLeave={onPieLeave}
            paddingAngle={2}
            stroke="none">
            {pieData.map((entry, idx) => (
              <Cell key={idx} fill={colors[entry.name] || "#ccc"} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      <div className="index__allocationsPieDenom">
        <IconDenom denom={symbol} className="index__denomIcon-pie" />
      </div>
    </div>
  );
};

interface AllocationTableProps {
  allocation: AllocationFragment$data["allocations"];
  t?: string;
  activeIndex: number;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
}

const AllocationTable: React.FC<AllocationTableProps> = ({
  allocation,
  t,
  activeIndex,
  setActiveIndex,
}) => {
  const { t: translate } = useTranslation();
  return (
    <div className="p-lg-5 flex-column text-center " style={{ width: "100%" }}>
      <h4 className="text-center pb-5 fw-500 color-grey">{translate("assetDistribution")}</h4>

      {/* Desktop Table */}
      <div className="index__desktop-table" style={{ width: "100%" }}>
        <table className="table table--big condensed portfolio__balances">
          <thead>
            <tr>
              <th className="bg-black w-1"></th>
              <th style={{ paddingLeft: 0 }} className="text-center">
                {translate("asset")}
              </th>
              <th style={{ paddingLeft: 0 }} className="text-center">
                {translate("priceChange")}
              </th>
              {t === "nav" && <th className="text-center">{translate("targetShare")}</th>}
              <th className="text-center">{translate("currentShare")}</th>
              <th className="text-center">{translate("totalValue")}</th>
            </tr>
          </thead>
          <tbody>
            {allocation.map((entry, idx) => (
              <MemoizedAssetRow
                key={entry.currentWeight}
                data={entry}
                t={t}
                idx={idx}
                activeIndex={activeIndex}
                isActive={idx === activeIndex}
                setActiveIndex={setActiveIndex}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout */}
      <div className="index__mobile-cards">
        {allocation.map((entry, idx) => (
          <MobileAssetCard
            key={entry.currentWeight}
            data={entry}
            t={t}
            activeIndex={activeIndex}
            idx={idx}
            isActive={idx === activeIndex}
            setActiveIndex={setActiveIndex}
          />
        ))}
      </div>
    </div>
  );
};

interface MobileAssetCardProps {
  data: AllocationFragment$data["allocations"][number] | null;
  t?: string;
  isActive: boolean;
  idx: number;
  activeIndex: number;
  setActiveIndex: (i: number) => void;
}

const MobileAssetCard: FC<MobileAssetCardProps> = ({
  data,
  t,
  isActive,
  idx,
  activeIndex,
  setActiveIndex,
}) => {
  const { t: translate } = useTranslation();
  if (!data) return null;

  const handleTouchStart = () => {
    setActiveIndex(idx);
  };

  const handleTouchEnd = () => {
    setTimeout(() => setActiveIndex(-1), 10000);
  };

  const handleClick = () => {
    if (isActive) {
      setActiveIndex(-1);
    } else {
      setActiveIndex(idx);
    }
  };

  const cardClass = isActive
    ? "index__mobile-card index__mobile-card--active"
    : activeIndex !== -1
      ? "index__mobile-card index__mobile-card--inactive"
      : "index__mobile-card";

  const statsClass =
    t === "nav"
      ? "index__mobile-card-stats has-target"
      : "index__mobile-card-stats";

  return (
    <div
      className={cardClass}
      key={data.asset?.metadata.symbol}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}>
      <div className="index__mobile-card-header">
        <div className="index__mobile-card-asset">
          <IconDenom
            denom={data.asset?.metadata.symbol ?? ""}
            className="index__mobile-card-icon"
          />
          <span className="index__mobile-card-symbol">
            {data.asset?.metadata.symbol}
          </span>
        </div>
        <div className="index__mobile-card-change">
          <DailyChange
            percentageChange={data.asset?.price?.changeDay || 0}
            centered
          />
        </div>
      </div>

      {/* Asset Stats */}
      <div className={statsClass}>
        {t === "nav" && (
          <div className="index__mobile-card-stat">
            <div className="index__mobile-card-label">{translate("target")}</div>
            <div className="index__mobile-card-value">
              <Decimal
                amount={BigInt(data.targetWeight ?? 0)}
                decimals={10}
                symbol="%"
                round={2}
              />
            </div>
          </div>
        )}
        <div className="index__mobile-card-stat">
          <div className="index__mobile-card-label">{translate("share")}</div>
          <div className="index__mobile-card-value">
            <Decimal
              amount={BigInt(data.currentWeight ?? 0)}
              decimals={10}
              symbol="%"
              round={2}
            />
          </div>
        </div>
        <div className="index__mobile-card-stat">
          <div className="index__mobile-card-label">{translate("value")}</div>
          <div className="index__mobile-card-value">
            <Fiat amount={BigInt(data.value ?? 0)} symbol="$" decimals={8} />
          </div>
        </div>
      </div>
    </div>
  );
};

interface AssetRowProps {
  data: AllocationFragment$data["allocations"][number] | null;
  t?: string;
  idx: number;
  isActive: boolean;
  activeIndex: number;
  setActiveIndex: (i: number) => void;
}

const AssetRow: FC<AssetRowProps> = ({
  data,
  t,
  idx,
  isActive,
  activeIndex,
  setActiveIndex,
}) => {
  if (!data) return null;
  const onMouseEnterRow = () => setActiveIndex(idx);
  const onMouseLeaveRow = () => setActiveIndex(-1);
  const rowClass = isActive
    ? "bg-black"
    : activeIndex !== -1
      ? "bg-black color-grey"
      : "bg-black";
  const opacity = isActive ? 1 : activeIndex !== -1 ? 0.4 : 1;

  return (
    <tr
      className={rowClass}
      onMouseEnter={onMouseEnterRow}
      onMouseLeave={onMouseLeaveRow}>
      <th
        className="bg-black"
        style={{
          opacity,
          transition: "opacity 0.2s ease",
        }}>
        <IconDenom denom={data.asset?.metadata.symbol ?? ""} />
      </th>
      <td style={{ paddingLeft: 0 }} className="text-center">
        <span>{data.asset?.metadata.symbol}</span>
      </td>
      <td className="text-center">
        <DailyChange
          percentageChange={data.asset?.price?.changeDay || 0}
          centered
        />
      </td>

      {t === "nav" && (
        <td className="text-center">
          <Decimal
            amount={BigInt(data.targetWeight ?? 0)}
            decimals={10}
            symbol="%"
            round={2}
          />
        </td>
      )}

      <td className="text-center">
        <Decimal
          amount={BigInt(data.currentWeight ?? 0)}
          decimals={10}
          symbol="%"
          round={2}
        />
      </td>

      <td className="text-center">
        <Fiat amount={BigInt(data.value ?? 0)} symbol="$" decimals={8} />
      </td>
    </tr>
  );
};
const MemoizedAssetRow = memo(AssetRow);

export const Allocation = ({ k, t, s }: Props) => {
  const data = useFragment(allocationFragment, k);
  const allocations = data.allocations ?? [];
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  return (
    <Card className="grid index__allocationsGrid ai-c ji-c mt-2">
      <Diagram
        allocation={allocations}
        symbol={s}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
      />
      <AllocationTable
        allocation={allocations}
        t={t}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
      />
    </Card>
  );
};
