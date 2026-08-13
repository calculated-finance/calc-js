import { ResolutionString } from "charting_library";
import { FC, useMemo } from "react";
import { useRelayEnvironment } from "react-relay";
import { Chart } from "../../chart/components";
import { RelayChartDataProvider } from "./TorRelayChartDataProvider";

export const TradingView: FC<{ asset: string }> = ({ asset }) => {
  const environment = useRelayEnvironment();

  const datafeed = useMemo(
    () => new RelayChartDataProvider(environment, asset),
    [asset]
  );

  return (
    <div className="trade__graph">
      {datafeed && (
        <Chart
          className="trade__graph-tv"
          symbol={`${asset}/TOR`}
          datafeed={datafeed}
          interval={"60" as ResolutionString}
          tick={8}
        />
      )}
    </div>
  );
};
