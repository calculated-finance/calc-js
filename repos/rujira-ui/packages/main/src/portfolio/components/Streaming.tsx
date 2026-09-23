import { priceFormatter } from "rujira.js";
import { IconDenom, Progress } from "rujira.ui";

export const Streaming = () => {
  return (
    <div className="relative card p-3 mt-2">
      <div className="table-sticky--first">
        <table className="table table--big condensed portfolio__balances">
          <thead>
            <tr>
              <th className="bg-black">Token</th>
              <th>Payment Type</th>
              <th>Progress</th>
              <th className="text-right">Total Amount</th>
              <th className="text-right">Received</th>
              <th className="w-1"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th className="bg-black">
                <div className="flex ai-c no-shrink">
                  <IconDenom denom="USDC" />
                  <h3>USDC</h3>
                </div>
              </th>
              <td>
                <span className="tag tag--md">monthly</span>
                <span className="tag tag--md ml-0.5">6 months</span>
              </td>
              <td>
                <Progress
                  className="w-full"
                  height={4}
                  percentage={50}
                  label="24/02/25"
                  labelMin="11/11/24"
                  labelMax="10/05/25"
                  showLabels={true}
                />
              </td>
              <td className="text-right">
                ${priceFormatter(1000000000000000n)}
              </td>
              <td className="text-right">${priceFormatter(500000000000n)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
