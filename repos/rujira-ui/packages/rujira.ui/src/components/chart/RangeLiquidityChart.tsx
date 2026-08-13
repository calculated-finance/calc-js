import React, { FC, useEffect, useRef, useState } from "react";
import "./RangeLiquidityChart.css";

type Point = { t: number; price: number };

export type Bucket = {
  price: number; // center price of bucket
  value: number; // liquidity amount
};

export const clamp = (v: number, a: number, b: number) =>
  Math.max(a, Math.min(b, v));

export const priceToY = (
  price: number,
  min: number,
  max: number,
  height: number
) => {
  // y = 0 at top
  if (max === min) return height / 2;
  const p = (price - min) / (max - min);
  return height - p * height;
};

export const yToPrice = (
  y: number,
  min: number,
  max: number,
  height: number
) => {
  const p = clamp(1 - y / height, 0, 1);
  return min + p * (max - min);
};

export const RangeLiquidityChart: FC<{
  width?: number;
  height?: number;
  series: Point[];
  leftBuckets?: Bucket[];
  rightBuckets?: Bucket[];
  minPrice?: number;
  maxPrice?: number;
  initialRange?: { min: number; max: number };
  onRangeChange?: (r: { min: number; max: number }) => void;
}> = ({
  width = 900,
  height = 160,
  series,
  leftBuckets = [],
  rightBuckets = [],
  minPrice,
  maxPrice,
  initialRange,
  onRangeChange,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const prices = series.map((s) => s.price);
  const minP = minPrice ?? Math.min(...prices);
  const maxP = maxPrice ?? Math.max(...prices);

  const padding = { left: 36, right: 72, top: 12, bottom: 26 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  // range state in price units
  const [range, setRange] = useState(() => {
    if (initialRange) return initialRange;
    // default: center 30% of price span
    const span = maxP - minP;
    return { min: minP + span * 0.35, max: minP + span * 0.65 };
  });

  useEffect(() => onRangeChange?.(range), [range, onRangeChange]);

  // line path
  const step = series.length > 1 ? innerW / (series.length - 1) : 0;
  const path = series
    .map((p, i) => {
      const x = padding.left + i * step;
      const y = padding.top + priceToY(p.price, minP, maxP, innerH);
      return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");

  // current price marker at last point
  const last = series[series.length - 1];
  const currentX = padding.left + (series.length - 1) * step;
  const currentY = padding.top + priceToY(last.price, minP, maxP, innerH);

  // histograms
  const maxBucket = Math.max(
    1,
    ...leftBuckets.map((b) => b.value),
    ...rightBuckets.map((b) => b.value)
  );

  const barWidth = 10;

  // slider interactions
  const dragging = useRef<null | "min" | "max" | "band">(null);

  const onPointerDownHandle = (which: "min" | "max", e: React.PointerEvent) => {
    dragging.current = which;
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (dragging.current) {
      try {
        (e.target as Element).releasePointerCapture(e.pointerId);
      } catch {}
    }
    dragging.current = null;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const y = clamp(e.clientY - rect.top - padding.top, 0, innerH);
    const price = yToPrice(y, minP, maxP, innerH);
    if (dragging.current === "min") {
      const v = Math.min(price, range.max - (maxP - minP) * 0.001);
      setRange((r) => ({ ...r, min: clamp(v, minP, maxP) }));
    } else if (dragging.current === "max") {
      const v = Math.max(price, range.min + (maxP - minP) * 0.001);
      setRange((r) => ({ ...r, max: clamp(v, minP, maxP) }));
    } else if (dragging.current === "band") {
      // band drag: compute delta from start
      // Not implemented: simple noop for now
    }
  };

  // computed y positions for handles
  const yMin = padding.top + priceToY(range.min, minP, maxP, innerH);
  const yMax = padding.top + priceToY(range.max, minP, maxP, innerH);

  // build histogram bars
  const leftBars = leftBuckets.map((b) => {
    const y = padding.top + priceToY(b.price, minP, maxP, innerH);
    const h = Math.max(2, (b.value / maxBucket) * innerH * 0.5);
    return {
      x: padding.left - 8 - barWidth,
      y: y - h / 2,
      w: barWidth,
      h,
      value: b.value,
    };
  });

  const rightBars = rightBuckets.map((b) => {
    const y = padding.top + priceToY(b.price, minP, maxP, innerH);
    const h = Math.max(2, (b.value / maxBucket) * innerH * 0.5);
    return {
      x: padding.left + innerW + 8,
      y: y - h / 2,
      w: barWidth,
      h,
      value: b.value,
    };
  });

  return (
    <div className="rlc-root" style={{ width }}>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="rlc-svg">
        <defs>
          <linearGradient id="priceGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#ff55d1" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#ff55d1" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* price band */}
        <rect
          x={padding.left}
          y={yMax}
          width={innerW}
          height={Math.max(1, yMin - yMax)}
          fill="#ff49c8"
          opacity={0.18}
        />

        {/* histograms */}
        <g className="rlc-bars left">
          {leftBars.map((b, i) => (
            <rect
              key={i}
              className="rlc-bar"
              x={b.x}
              y={b.y}
              width={b.w}
              height={b.h}
              rx={4}
            />
          ))}
        </g>
        <g className="rlc-bars right">
          {rightBars.map((b, i) => (
            <rect
              key={i}
              className="rlc-bar"
              x={b.x}
              y={b.y}
              width={b.w}
              height={b.h}
              rx={4}
            />
          ))}
        </g>

        {/* price line */}
        <path
          d={path}
          className="rlc-line"
          fill="none"
          stroke="#ff57d8"
          strokeWidth={2}
        />

        {/* current price marker */}
        <circle
          cx={currentX}
          cy={currentY}
          r={4.5}
          fill="#ff7cd9"
          stroke="#fff"
          strokeWidth={1}
        />

        {/* slider on right */}
        <g
          className="rlc-slider"
          transform={`translate(${padding.left + innerW + 40},0)`}>
          <rect
            x={-12}
            y={padding.top}
            width={24}
            height={innerH}
            rx={12}
            fill="#2b2b2b"
            opacity={0.14}
          />

          {/* band selection on slider */}
          <rect
            x={-12}
            y={yMax}
            width={24}
            height={Math.max(4, yMin - yMax)}
            rx={8}
            fill="#ff49c8"
            opacity={0.9}
          />

          {/* handles */}
          <g
            className="rlc-handle rlc-handle-min"
            transform={`translate(0,${yMin})`}
            onPointerDown={(e) => onPointerDownHandle("min", e)}>
            <circle
              cx={0}
              cy={0}
              r={10}
              fill="#fff"
              stroke="#ff49c8"
              strokeWidth={3}
            />
          </g>

          <g
            className="rlc-handle rlc-handle-max"
            transform={`translate(0,${yMax})`}
            onPointerDown={(e) => onPointerDownHandle("max", e)}>
            <circle
              cx={0}
              cy={0}
              r={10}
              fill="#fff"
              stroke="#ff49c8"
              strokeWidth={3}
            />
          </g>
        </g>
      </svg>
    </div>
  );
};

export default RangeLiquidityChart;
