import { ResolutionString } from "charting_library";
import { FC, useEffect, useMemo, useRef } from "react";
import { useRelayEnvironment } from "react-relay";
import { Chart } from "../../chart/components";
import { RelayChartDataProvider } from "../../services/RelayChartDataProvider";
import { useRangeDrawing } from "./Range";
import { RangeFragment$key } from "./__generated__/RangeFragment.graphql";

export const TradingView: FC<{
  address?: string;
  base?: string;
  quote?: string;
  tick: number;
  k: RangeFragment$key;
}> = ({ address, tick, k, base, quote }) => {
  const environment = useRelayEnvironment();

  const datafeed = useMemo(
    () => (address ? new RelayChartDataProvider(environment, address) : null),
    [address]
  );

  const extension = useRangeDrawing(k);
  // useRangeDrawing({ low: 250000000000, high: 270000000000, price: 264200000000 });

  if (datafeed)
    return (
      <Chart
        className="trade__graph-tv"
        symbol={`${base}/${quote}`}
        datafeed={datafeed}
        interval={"60" as ResolutionString}
        tick={tick}
        extension={extension}
      />
    );
  return null;
};

export const TradingViewLoader = () => {
  const ref = useRef<SVGPathElement>(null);
  //const _animation = document.querySelector("#moveTheWave");
  const m = 0.512286623256592433;

  function buildWave(w: number, h: number) {
    const a = h / 4;
    const y = h / 2;

    const pathData = [
      "M",
      w * 0,
      y + a / 2,
      "c",
      a * m,
      0,
      -(1 - a) * m,
      -a,
      a,
      -a,
      "s",
      -(1 - a) * m,
      a,
      a,
      a,
      "s",
      -(1 - a) * m,
      -a,
      a,
      -a,
      "s",
      -(1 - a) * m,
      a,
      a,
      a,
      "s",
      -(1 - a) * m,
      -a,
      a,
      -a,

      "s",
      -(1 - a) * m,
      a,
      a,
      a,
      "s",
      -(1 - a) * m,
      -a,
      a,
      -a,
      "s",
      -(1 - a) * m,
      a,
      a,
      a,
      "s",
      -(1 - a) * m,
      -a,
      a,
      -a,
      "s",
      -(1 - a) * m,
      a,
      a,
      a,
      "s",
      -(1 - a) * m,
      -a,
      a,
      -a,
      "s",
      -(1 - a) * m,
      a,
      a,
      a,
      "s",
      -(1 - a) * m,
      -a,
      a,
      -a,
      "s",
      -(1 - a) * m,
      a,
      a,
      a,
      "s",
      -(1 - a) * m,
      -a,
      a,
      -a,
    ].join(" ");

    if (ref.current) {
      ref.current.setAttribute("d", pathData);
    }
  }

  useEffect(() => {
    buildWave(90, 60);
  }, []);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="80px"
      height="60px"
      viewBox="5 0 80 60">
      <path
        ref={ref}
        id="wave"
        fill="none"
        stroke="#71909F"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
};
