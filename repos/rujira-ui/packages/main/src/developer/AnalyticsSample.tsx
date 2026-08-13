import { FC, useCallback, useState } from "react";
import { Button } from "rujira.ui";
import { AnalyticsBoundary } from "../analytics/AnalyticsBoundary";
import { NoIndexHelmet } from "../seo";
import {
  AnalyticsConnectionStatus,
  retryAnalyticsConnection,
  useAnalyticsConnection,
} from "../services/relayAnalytics";
import { useAnalyticsTestQuery } from "./analytics/AnalyticsSample";

const statusColor: Record<AnalyticsConnectionStatus, string> = {
  connecting: "color-grey",
  open: "color-teal",
  error: "color-orange",
};

// Dev-only proof that the analytics API is wired up end-to-end: socket
// connects, auth header is sent, and the shared Bigint scalar (`amount`,
// `percentage`) decodes correctly. Not a real feature page.
export const AnalyticsSample: FC = () => {
  const [attempt, setAttempt] = useState(0);
  const status = useAnalyticsConnection();

  // Remounting the boundary is what clears a caught error — AnalyticsBoundary
  // is a class boundary with no reset path of its own.
  const retry = useCallback(() => {
    retryAnalyticsConnection();
    setAttempt((a) => a + 1);
  }, []);

  return (
    <>
      <NoIndexHelmet>
        <title>Rujira Analytics Test</title>
      </NoIndexHelmet>
      <div className="rujira__main rujira__main--gradient pools">
        <div className="rujira__inner--pad">
          <div className="rujira__inner">
            <h1 className="h1">Analytics API Test</h1>
            <div className="flex ai-c gap-x-1 mt-1">
              <span className="fs-12 color-grey">Socket</span>
              <span className={`fs-12 fw-500 ${statusColor[status]}`}>
                {status}
              </span>
              <Button
                className="button--sm button--grey button--outline"
                label="Retry"
                onClick={retry}
              />
            </div>
            <div className="relative card p-3 mt-2 table-sticky">
              <AnalyticsBoundary key={attempt}>
                <Content fetchKey={attempt} />
              </AnalyticsBoundary>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const Content: FC<{ fetchKey: number }> = ({ fetchKey }) => {
  const data = useAnalyticsTestQuery(fetchKey);
  return (
    <table className="table table--big condensed nowrap">
      <thead>
        <tr>
          <th>Tier</th>
          <th>Amount</th>
          <th>Percentage</th>
        </tr>
      </thead>
      <tbody>
        {data.users.topTradersByVolume.map((item) => (
          <tr key={item.tier}>
            <td>{item.tier}</td>
            <td>{item.amount.toString()}</td>
            <td>{item.percentage.toString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
