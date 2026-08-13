import { FC } from "react";
import { Button, Warning } from "rujira.ui";
import apiError from "../common/assets/api-error.gif";

export const AnalyticsWarning: FC<{ onRetry: () => void }> = ({ onRetry }) => (
  <Warning
    className="warning--sm warning--borderless condensed flex ai-c"
    color="orange">
    <img
      src={apiError}
      alt=""
      className="filter-orange block no-shrink"
      style={{ width: "2rem", height: "2rem" }}
    />
    <div className="text-left fs-14">
      The analytics are currently unavailable.
    </div>
    <Button
      className="button--xs button--outline button--orange"
      label="Retry"
      onClick={onRetry}
    />
  </Warning>
);
