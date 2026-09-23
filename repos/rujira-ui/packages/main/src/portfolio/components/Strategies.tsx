import { FC } from "react";
import { StrategiesPortfolio } from "../../strategies/components/Balances";

export const Strategies: FC = () => {
  return (
    <div className="relative card p-3 mt-2">
      <StrategiesPortfolio />
    </div>
  );
};
