import { Icons, NetworkIcons, WalletIcons } from "rujira.ui";
import { Code } from "../components/Code";
import { GitLabIcon } from "../components/GitLabIcon";
import React from "react";
import { FigmaIcon } from "../components/FigmaIcon";

export const IconsPage = () => {
  return (
    <>
      <h1 className="h1">Icons</h1>
      <Code language="tsx" code={`import { Icons } from "rujira.ui";`} />
      <p className="flex ai-c p-1 br-1 bg-primary5 fs-12 fw-500 mt-2">
        <GitLabIcon className="w-3 h-2 block" />{" "}
        <a
          href="https://gitlab.com/thorchain/rujira.ui/-/blob/main/packages/rujira.ui/src/components/icons/Icons.tsx?ref_type=heads"
          className="color-grey hover-purple ml-1 block no-underline"
          target="_blank">
          https://gitlab.com/thorchain/rujira.ui/-/blob/main/packages/rujira.ui/src/components/icons/Icons.tsx?ref_type=heads
        </a>
      </p>
      <p className="flex ai-c p-1 br-1 bg-primary5 fs-12 fw-500 mt-1">
        <FigmaIcon className="w-3 h-2 block" />{" "}
        <a
          href="https://www.figma.com/design/P5jeTCJw6Tc0CoX2pBUmsd/Rujira.ui?node-id=27-524&t=5f7WrO4Wen9BhCea-1"
          className="color-grey hover-purple ml-1 block no-underline"
          target="_blank">
          https://www.figma.com/design/P5jeTCJw6Tc0CoX2pBUmsd/Rujira.ui?node-id=27-524&t=5f7WrO4Wen9BhCea-1
        </a>
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
            <td className="color-primary1">className</td>
            <td>(optional) string</td>
            <td>
              <code>null</code>
            </td>
          </tr>
        </tbody>
      </table>
      <h2 className="h2 color-grey mt-6">Icons</h2>
      <div className="flex wrap mt-2">
        {Object.values(Icons).map((i) => (
          <div
            className="flex dir-c ai-c jc-c w-12 h-12 color-grey"
            key={i.type.name}>
            {React.createElement(i, {
              className: "block w-5 h-5",
            })}
            <p className="fs-12 condensed mt-1">{i.displayName}</p>
          </div>
        ))}
      </div>
      <h3 className="h3 color-grey mt-6">Usage Example</h3>
      <Code
        language="jsx"
        code={`import { Icons } from "rujira.ui";

<Icons.AngleRight className="color-grey w-4 h-4 />`}
      />

      <h2 className="h2 color-grey mt-6">Wallet Icons</h2>
      <div className="flex wrap mt-2 bg-black br-2">
        {Object.values(WalletIcons).map((i) => (
          <div
            className="flex dir-c ai-c jc-c h-12 color-grey"
            key={i.type.name}>
            {React.createElement(i, {
              className: "block w-a h-5 mx-3.5",
            })}
            <p className="fs-12 condensed mt-1">{i.displayName}</p>
          </div>
        ))}
      </div>
      <h3 className="h3 color-grey mt-6">Usage Example</h3>
      <Code
        language="jsx"
        code={`import { WalletIcons } from "rujira.ui";

<WalletIcons.Sonar className="w-a h-4 />`}
      />

      <h2 className="h2 color-grey mt-6">Network Icons</h2>
      <div className="flex wrap mt-2 bg-black br-2">
        {Object.values(NetworkIcons).map((i: any) => (
          <div
            className="flex dir-c ai-c jc-c h-12 color-grey"
            key={i.type.name}>
            {React.createElement(i, {
              className: "block w-a h-5 mx-3.5",
            })}
            <p className="fs-12 condensed mt-1">{i.displayName}</p>
          </div>
        ))}
      </div>
      <h3 className="h3 color-grey mt-6">Usage Example</h3>
      <Code
        language="jsx"
        code={`import { NetworkIcons } from "rujira.ui";

<NetworkIcons.Bitcoin className="w-a h-4 />`}
      />

      <hr className="hr mt-5 mb-4" />
    </>
  );
};
