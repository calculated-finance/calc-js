import { FC } from "react";
import { Decimal, IconDenom } from "rujira.ui";

export const Bonded: FC = () => {
  return (
    <div className="relative card p-3 mt-2">
      <div className="table-sticky table-sticky--first">
        <table className="table table--big condensed portfolio__balances">
          <thead>
            <tr>
              <th className="w-1 bg-black"></th>
              <th style={{ paddingLeft: 0 }}>Token</th>
              <th className="text-right">Amount Staked</th>
              <th className="text-center">Auto Compounding</th>
              <th className="text-right">Unclaimed Rewards</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <Item />
            <Item />
            <Item />
            <Item />
            <Item />
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Item: FC = () => {
  return (
    <tr>
      <th className="bg-black">
        <IconDenom denom="demo" />
      </th>
      <td style={{ paddingLeft: 0 }}>
        <h3>DEMO</h3>
      </td>
      <td className="text-right">
        <Decimal amount={0n} decimals={8} round={6} />
      </td>
      <td className="text-center">
        <span className="tag tag--teal">Yes</span>
      </td>
      <td className="text-right">
        <Decimal amount={0n} decimals={8} round={6} symbol="DEMO" />
      </td>
    </tr>
  );
};
