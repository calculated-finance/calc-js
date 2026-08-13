import { useState } from "react";
import { Decimal, Fiat, Input } from "rujira.ui";

const DECIMALS = 8;

const CASES: { label: string; amount: bigint }[] = [
  { label: "50,000", amount: 5_000_000_000_000n },
  { label: "1,234.567", amount: 123_456_700_000n },
  { label: "999.9876", amount: 99_998_760_000n },
  { label: "56.789", amount: 5_678_900_000n },
  { label: "7.123", amount: 712_300_000n },
  { label: "1.000 (exact)", amount: 100_000_000n },
  { label: "0.5678", amount: 56_780_000n },
  { label: "0.05678", amount: 5_678_000n },
  { label: "0.001234", amount: 123_400n },
  { label: "0.0001234", amount: 12_340n },
  { label: "0.00001234 (subscript)", amount: 1_234n },
  { label: "0 (zero)", amount: 0n },
];

export const NumberClip = () => {
  const [custom, setCustom] = useState("9876543210");

  const customAmount = (() => {
    try {
      return BigInt(custom || "0");
    } catch {
      return 0n;
    }
  })();

  return (
    <>
      <h1 className="h1">Number Clip</h1>
      <p className="p mt-2 color-grey">
        Side-by-side comparison of <code>clip=false</code> vs{" "}
        <code>clip=true</code> on <code>Decimal</code> and <code>Fiat</code>.
        All values use <code>decimals={DECIMALS}</code>.
      </p>

      <table className="table mt-4 table--big condensed table--lined">
        <thead>
          <tr>
            <th className="color-grey">Value</th>
            <th>Decimal</th>
            <th className="color-teal">Decimal clip</th>
            <th>Fiat</th>
            <th className="color-teal">Fiat clip</th>
          </tr>
        </thead>
        <tbody>
          {CASES.map(({ label, amount }) => (
            <tr key={label}>
              <td className="color-grey fs-14 condensed">{label}</td>
              <td>
                <Decimal
                  amount={amount}
                  decimals={DECIMALS}
                  round={4}
                  className="condensed"
                />
              </td>
              <td>
                <Decimal
                  amount={amount}
                  decimals={DECIMALS}
                  clip
                  className="condensed"
                />
              </td>
              <td>
                <Fiat
                  amount={amount}
                  decimals={DECIMALS}
                  symbol="$"
                  className="condensed"
                />
              </td>
              <td>
                <Fiat
                  amount={amount}
                  decimals={DECIMALS}
                  symbol="$"
                  clip
                  className="condensed"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="h3 color-grey mt-6 mb-3">Custom value</h3>
      <div className="row wrap gap-3">
        <div className="col-12 col-md-4">
          <Input
            type="number"
            label={`amount (raw bigint, decimals=${DECIMALS})`}
            value={custom}
            onChange={(e) => setCustom(e.currentTarget.value)}
          />
          <p className="color-grey fs-12 mt-1">
            e.g. <code>100000000</code> = 1.0 &nbsp;|&nbsp; <code>1234</code> =
            0.00001234
          </p>
        </div>
        <div className="col-12">
          <table className="table table--big condensed table--lined">
            <thead>
              <tr>
                <th>Decimal</th>
                <th className="color-teal">Decimal clip</th>
                <th>Fiat</th>
                <th className="color-teal">Fiat clip</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <Decimal
                    amount={customAmount}
                    decimals={DECIMALS}
                    round={4}
                    className="condensed"
                  />
                </td>
                <td>
                  <Decimal
                    amount={customAmount}
                    decimals={DECIMALS}
                    clip
                    className="condensed"
                  />
                </td>
                <td>
                  <Fiat
                    amount={customAmount}
                    decimals={DECIMALS}
                    symbol="$"
                    className="condensed"
                  />
                </td>
                <td>
                  <Fiat
                    amount={customAmount}
                    decimals={DECIMALS}
                    symbol="$"
                    clip
                    className="condensed"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
