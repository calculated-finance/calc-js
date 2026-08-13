import { MsgSwap } from "rujira.js";
import { Icons, TxButton } from "rujira.ui";
import { Code } from "../components/Code";
import { useAccounts } from "../services/accounts";

export const TxButtons = () => {
  const accountProvider = useAccounts();

  return (
    <>
      <h1 className="h1">TxButton</h1>
      <p className="p mt-4">
        A universal transaction signing button that:
        <ol>
          <li>
            Takes a definition of an message type <code>msg</code> as a prop
          </li>
          <li>Encodes it for the currently connected Network</li>
          <li>Signs it with the currently connected Signer</li>
          <li>Broadcasts it over the currently connected Network</li>
        </ol>
      </p>
      <p className="p mt-4">
        TxButton requires an{" "}
        <a
          target="_blank"
          className="color-purple"
          href="https://gitlab.com/thorchain/rujira-ui/-/blob/main/packages/rujira.js/src/services/wallets/provider.ts?ref_type=heads#L13-20">
          AccountProvider
        </a>
        . You may find it easier to re-export a TxButton in your own app which
        accesses a shared value
      </p>

      <Code
        language="tsx"
        code={`import { FC } from "react";
import { TxButton as TxButtonInner, TxButtonProps } from "rujira.ui";
import { useAccounts } from "../../services/accounts";

export const TxButton: FC<Omit<TxButtonProps, "accountProvider">> = ({
  children,
  ...props
}) => {
  const provider = useAccounts();
  return (
    <TxButtonInner accountProvider={provider} {...props}>
      {children}
    </TxButtonInner>
  );
};`}
      />
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
            <td className="color-primary1">msg</td>
            <td>
              A value that implements the{" "}
              <a
                href="https://gitlab.com/thorchain/rujira-ui/-/blob/main/packages/rujira.js/src/msgs.ts"
                target="_blank"
                className="color-purple">
                Msg interface
              </a>{" "}
              to support multichain simulation & signing.
              <br />
              <br /> rujira.js exports the basic message types (
              <code>MsgSwap</code>, <code>MsgBond</code>,{" "}
              <code>MsgDeposit</code>,<code>MsgExecuteContract</code> etc).
              <br />
              <br />
              <code>MsgDeposit</code> is the most basic interface, and allows
              custom memos to be constructed
              <br />
              <br />
              <code>MsgSwap</code>, <code>MsgAddLiquidity</code> etc provide
              structured arguments that are converted to a memo for a L1 deposit
              or a base-layer <code>MsgDeposit</code>
              <br />
              <br />
              <code>MsgExecuteContract</code> provides a structured object for
              calling smart contracts on the app-layer. This is either executed
              as its own msg type directly on the base-layer, or is converted
              into an <code>ExecMemo</code> to be called from a L1 deposit
              transaction. App-layer protcols should wrap{" "}
              <code>MsgExecuteContract</code> to provide better interfaces to
              individual contract execution variants
            </td>
            <td></td>
          </tr>
          <tr>
            <td className="color-primary1">accountProvider</td>
            <td>
              An{" "}
              <a
                target="_blank"
                className="color-purple"
                href="https://gitlab.com/thorchain/rujira-ui/-/blob/main/packages/rujira.js/src/services/wallets/provider.ts?ref_type=heads#L13-20">
                AccountProvider
              </a>{" "}
              as defined in rujira.js
            </td>
            <td></td>
          </tr>
          <tr>
            <td className="color-primary1">SimulationComponent</td>
            <td>
              (optional) A{" "}
              <code>{`React.ElementType<{ simulation?: Simulation }>`}</code>{" "}
              that renders the simulation result
            </td>
            <td></td>
          </tr>

          <tr>
            <td className="color-primary1">loading</td>
            <td>
              (optional) The{" "}
              <a
                href="https://github.com/timolins/react-hot-toast/blob/main/src/core/types.ts#L12"
                target="_blank"
                className="color-purple">
                Renderable
              </a>{" "}
              message shown in the Toast component whilst the transaction is
              pending
            </td>
            <td>"Submitting Transaction"</td>
          </tr>

          <tr>
            <td className="color-primary1">success</td>
            <td>
              (optional) The{" "}
              <a
                href="https://github.com/timolins/react-hot-toast/blob/main/src/core/toast.ts#L65"
                target="_blank"
                className="color-purple">
                {`ValueOrFunction<Renderable, TxResult>`}
              </a>{" "}
              used to display a successful transaction result
            </td>
            <td>
              <Code
                language="tsx"
                code={`(res: TxResult): Renderable => (
  <p>
    Transaction Succeeded
    <br />
    <a
      href={networkTxLink(res)}
      target="_blank"
      className="color-white no-underline fs-12">
      {res.txHash.slice(0, 8) + "..." + res.txHash.slice(-8)}
    </a>
  </p>
);`}
              />
            </td>
          </tr>

          <tr>
            <td className="color-primary1">error</td>
            <td>
              (optional) The{" "}
              <a
                href="https://github.com/timolins/react-hot-toast/blob/main/src/core/toast.ts#66"
                target="_blank"
                className="color-purple">
                {`ValueOrFunction<Renderable, any>`}
              </a>{" "}
              used to display a failed transaction
            </td>
            <td>"Error Submitting Transaction"</td>
          </tr>
        </tbody>
      </table>
      <h3 className="h3 color-grey mt-6 mb-2">Examples</h3>

      <div className="row wrap mt-2 example example--with-controls">
        <div className="col-12 flex ai-c jc-c bg-black p-3">
          <TxButton
            accountProvider={accountProvider}
            label="Swap"
            className="button--icon-right"
            msg={
              new MsgSwap(
                { address: "", network: "BTC" },
                {
                  asset: "BTC.BTC",
                  chain: "BTC",
                  type: "NATIVE",
                  metadata: { decimals: 8, symbol: "BTC" },
                },
                500000000n,
                "=:ETH.ETH:0x4b6c651e097454f9cedad6105365afa0490f28da"
              )
            }>
            <Icons.Swap />
          </TxButton>
        </div>
        <div className="col-12">
          <Code
            language="tsx"
            code={`import { TxButton, Icons } from "rujira.ui";
import { MsgSwap, Asset } from "rujira.js";
<TxButton
  signer={Signer}
  label="Swap"
  className="button--icon-right"
  msg={new MsgSwap(
    { address: "bc1...", network: "BTC", }
    { asset: "BTC.BTC", chain: "BTC" },
    500000000n,
    "=:ETH.ETH:0x4b6c651e097454f9cedad6105365afa0490f28da"
  )}>
  <Icons.Swap />
</TxButton>`}
          />
        </div>
      </div>

      <hr className="hr mt-5 mb-4" />
    </>
  );
};
