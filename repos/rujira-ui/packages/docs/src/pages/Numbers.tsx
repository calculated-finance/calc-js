import { useState } from "react";
import { Decimal, Fiat, Input, Textarea, Toggle } from "rujira.ui";
import { Code } from "../components/Code";
import { Link } from "react-router-dom";
import { GitLabIcon } from "../components/GitLabIcon";
import { FigmaIcon } from "../components/FigmaIcon";

export const Numbers = () => {
  const [amount, setAmount] = useState(9465174859n);
  const [decimals, setDecimals] = useState(6);
  const [round, setRound] = useState(6);
  const [symbol, setSymbol] = useState("RUJI");
  const [symbolLeft, setSymbolLeft] = useState(false);
  const [classes, setClasses] = useState("color-white");

  const [amountFiat, setAmountFiat] = useState(99999n);
  const [decimalsFiat, setDecimalsFiat] = useState(2);
  const [symbolFiat, setSymbolFiat] = useState("$");
  const [symbolRight, setSymbolRight] = useState(false);
  const [padSymbol, setPadSymbol] = useState(true);
  const [classesFiat, setClassesFiat] = useState("color-white");

  return (
    <>
      <h1 className="h1">Numbers</h1>
      <h2 className="h2 color-grey">Decimal</h2>
      <Code language="tsx" code={`import { Decimal } from "rujira.ui";`} />
      <p className="flex ai-c p-1 br-1 bg-primary5 fs-12 fw-500 mt-2">
        <GitLabIcon className="w-3 h-2 block" />{" "}
        <a
          href="https://gitlab.com/thorchain/rujira.ui/-/blob/main/packages/rujira.ui/src/components/numbers/Decimal.tsx?ref_type=heads"
          className="color-grey hover-purple ml-1 block no-underline"
          target="_blank">
          https://gitlab.com/thorchain/rujira.ui/-/blob/main/packages/rujira.ui/src/components/numbers/Decimal.tsx?ref_type=heads
        </a>
      </p>
      <p className="flex ai-c p-1 br-1 bg-primary5 fs-12 fw-500 mt-1">
        <FigmaIcon className="w-3 h-2 block" />{" "}
        <a
          href="https://www.figma.com/design/P5jeTCJw6Tc0CoX2pBUmsd/Rujira.ui?node-id=14-211&t=j2ZuRHEHecjWX4di-1"
          className="color-grey hover-purple ml-1 block no-underline"
          target="_blank">
          https://www.figma.com/design/P5jeTCJw6Tc0CoX2pBUmsd/Rujira.ui?node-id=14-211&t=j2ZuRHEHecjWX4di-1
        </a>
      </p>

      <p className="p mt-4">
        The Decimal component accepts a <code>BigInt</code> and outputs a
        localized integer and decimal, with the decimal numbers displaying at{" "}
        <code>0.85em</code>.
      </p>
      <p className="p">
        Accepts all{" "}
        <Link
          to="/typography"
          className="color-pink hover-purple no-underline fw-500">
          Typography
        </Link>{" "}
        helper classes for customization.
      </p>
      <table className="table mt-4 table--big table--va-t table--lined">
        <thead className="border">
          <tr>
            <th>Attribute</th>
            <th>Description</th>
            <th>Default</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="color-primary1">amount</td>
            <td>bitint</td>
            <td>-</td>
          </tr>
          <tr>
            <td className="color-primary1">decimals</td>
            <td>
              (optional) number
              <br />
              How many decimal places make up part of this number, e.g.{" "}
              <code>1000000</code> with <code>6</code> decimal places is equal
              to <code>1.000000</code>
            </td>
            <td>
              <code>6</code>
            </td>
          </tr>
          <tr>
            <td className="color-primary1">round</td>
            <td>
              (optional) number
              <br />
              How many decimals should be displayed
            </td>
            <td>
              <code>6</code>
            </td>
          </tr>
          <tr>
            <td className="color-primary1">symbol</td>
            <td>(optional) string</td>
            <td>
              <code>null</code>
            </td>
          </tr>
          <tr>
            <td className="color-primary1">symbolLeft</td>
            <td>
              (optional) boolean
              <br />
              Display symbol on left
            </td>
            <td>
              <code>false</code>
            </td>
          </tr>
          <tr>
            <td className="color-primary1">className</td>
            <td>(optional) string</td>
            <td>
              <code>null</code>
            </td>
          </tr>
        </tbody>
      </table>

      <h3 className="h3 color-grey mt-6 mb-2">Example</h3>
      <div className="row wrap mt-2 example example--with-controls">
        <div className="col-12 col-lg-5 flex ai-c jc-c bg-black p-4">
          <Decimal
            amount={amount}
            decimals={decimals}
            round={round}
            symbol={symbol}
            symbolLeft={symbolLeft}
            className={classes}
          />
        </div>

        <div className="col-12 col-lg-7 p-3 example__controls">
          <Input
            type="number"
            value={amount.toString()}
            onChange={(e) => setAmount(BigInt(e.currentTarget.value))}
            label="amount"
          />
          <Input
            containerClassName="mt-2"
            type="number"
            value={decimals.toString()}
            onChange={(e) => setDecimals(Number(e.currentTarget.value))}
            label="decimals"
          />
          <Input
            containerClassName="mt-2"
            type="number"
            value={round.toString()}
            onChange={(e) => setRound(Number(e.currentTarget.value))}
            label="round"
          />
          <Input
            containerClassName="mt-2"
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.currentTarget.value)}
            label="symbol"
          />
          <Toggle
            className="mt-2"
            label="symbolLeft"
            checked={symbolLeft}
            onChange={(e) => setSymbolLeft(e.currentTarget.checked)}
          />
          <Textarea
            containerClassName="mt-2"
            value={classes}
            onChange={(e) => setClasses(e.currentTarget.value)}
            label="classes"
          />
        </div>
        <div className="col-12">
          <Code
            language="tsx"
            code={`import { Decimal } from "rujira.ui";

 <Decimal
  amount={${amount}}
  decimals={${decimals}}
  round={${round}}
  symbol="${symbol}"
  symbolLeft={${symbolLeft}}
  className="${classes}"
/>`}
          />
        </div>
      </div>

      <h2 className="h2 color-grey mt-6">Fiat</h2>
      <Code language="tsx" code={`import { Fiat } from "rujira.ui";`} />
      <p className="flex ai-c p-1 br-1 bg-primary5 fs-12 fw-500 mt-2">
        <GitLabIcon className="w-a h-2 block" />{" "}
        <a
          href="https://gitlab.com/thorchain/rujira.ui/-/blob/main/packages/rujira.ui/src/components/numbers/Fiat.tsx?ref_type=heads"
          className="color-grey hover-purple ml-1 block no-underline"
          target="_blank">
          https://gitlab.com/thorchain/rujira.ui/-/blob/main/packages/rujira.ui/src/components/numbers/Fiat.tsx?ref_type=heads
        </a>
      </p>
      <p className="flex ai-c p-1 br-1 bg-primary5 fs-12 fw-500 mt-1">
        <FigmaIcon className="w-3 h-2 block" />{" "}
        <a
          href="https://www.figma.com/design/P5jeTCJw6Tc0CoX2pBUmsd/Rujira.ui?node-id=14-217&t=j2ZuRHEHecjWX4di-1"
          className="color-grey hover-purple ml-1 block no-underline"
          target="_blank">
          https://www.figma.com/design/P5jeTCJw6Tc0CoX2pBUmsd/Rujira.ui?node-id=14-217&t=j2ZuRHEHecjWX4di-1
        </a>
      </p>

      <p className="p mt-4">
        The Fiat component accepts a <code>BigInt</code> and outputs a localized
        integer and decimal, with the decimal numbers displaying at{" "}
        <code>0.85em</code>.
      </p>
      <p className="p">
        Accepts all{" "}
        <Link
          to="/typography"
          className="color-pink hover-purple no-underline fw-500">
          Typography
        </Link>{" "}
        helper classes for customization.
      </p>
      <table className="table mt-4 table--big table--va-t table--lined">
        <thead className="border">
          <tr>
            <th>Attribute</th>
            <th>Description</th>
            <th>Default</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="color-primary1">amount</td>
            <td>bitint</td>
            <td>-</td>
          </tr>
          <tr>
            <td className="color-primary1">decimals</td>
            <td>
              (optional) number
              <br />
              How many decimal places make up part of this number, e.g.{" "}
              <code>1000</code> with <code>2</code> decimal places is equal to{" "}
              <code>10.00</code>
            </td>
            <td>
              <code>2</code>
            </td>
          </tr>
          <tr>
            <td className="color-primary1">symbol</td>
            <td>(optional) string</td>
            <td>
              <code>null</code>
            </td>
          </tr>
          <tr>
            <td className="color-primary1">symbolRight</td>
            <td>
              (optional) boolean
              <br />
              Display symbol on right
            </td>
            <td>
              <code>false</code>
            </td>
          </tr>
          <tr>
            <td className="color-primary1">padSymbol</td>
            <td>
              (optional) boolean
              <br />
              Display a space between the symbol and the integer / decimal
            </td>
            <td>
              <code>false</code>
            </td>
          </tr>
          <tr>
            <td className="color-primary1">className</td>
            <td>(optional) string</td>
            <td>
              <code>null</code>
            </td>
          </tr>
        </tbody>
      </table>

      <h3 className="h3 color-grey mt-6 mb-2">Example</h3>
      <div className="row wrap mt-2 example example--with-controls">
        <div className="col-12 col-lg-5 flex ai-c jc-c bg-black p-4">
          <Fiat
            amount={amountFiat}
            decimals={decimalsFiat}
            symbol={symbolFiat}
            symbolRight={symbolRight}
            padSymbol={padSymbol}
            className={classesFiat}
          />
        </div>

        <div className="col-12 col-lg-7 p-3 example__controls">
          <Input
            type="number"
            value={amountFiat.toString()}
            onChange={(e) => setAmountFiat(BigInt(e.currentTarget.value))}
            label="amount"
          />
          <Input
            containerClassName="mt-2"
            type="number"
            value={decimalsFiat.toString()}
            onChange={(e) => setDecimalsFiat(Number(e.currentTarget.value))}
            label="decimals"
          />
          <Input
            containerClassName="mt-2"
            type="text"
            value={symbolFiat}
            onChange={(e) => setSymbolFiat(e.currentTarget.value)}
            label="symbol"
          />
          <Toggle
            className="mt-2"
            label="symbolRight"
            checked={symbolRight}
            onChange={(e) => setSymbolRight(e.currentTarget.checked)}
          />
          <Toggle
            className="mt-2"
            label="padSymbol"
            checked={padSymbol}
            onChange={(e) => setPadSymbol(e.currentTarget.checked)}
          />
          <Textarea
            containerClassName="mt-2"
            value={classesFiat}
            onChange={(e) => setClassesFiat(e.currentTarget.value)}
            label="classes"
          />
        </div>
        <div className="col-12">
          <Code
            language="tsx"
            code={`import { Decimal } from "rujira.ui";

<Fiat
  amount={${amountFiat}}
  decimals={${decimalsFiat}}
  symbol="${symbolFiat}"
  symbolRight={${symbolRight}}
  padSymbol={${padSymbol}}
  className="${classesFiat}"
/>`}
          />
        </div>
      </div>

      <hr className="hr mt-5 mb-4" />
    </>
  );
};
