import { FC } from "react";
import { TranslationProvider } from "rujira.ui";
import { OrdersPortfolio } from "../../trade/components/Orders";

export const Orders: FC = () => {
  return (
    <div className="relative card pb-3 pt-1 px-2 mt-2">
      <TranslationProvider namespace="trade">
        <OrdersPortfolio />
      </TranslationProvider>
    </div>
  );
};
