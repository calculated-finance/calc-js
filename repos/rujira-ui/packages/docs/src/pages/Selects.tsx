import { useState } from "react";
import { Input, Select, Textarea, Toggle } from "rujira.ui";
import { Code } from "../components/Code";
import { GitLabIcon } from "../components/GitLabIcon";
import { FigmaIcon } from "../components/FigmaIcon";

export const Selects = () => {
  const [disabled, setDisabled] = useState(false);
  const [option, setOption] = useState("");
  const [label, setLabel] = useState("Denom");
  const [classes, setClasses] = useState("");
  const [labelClasses, setLabelClasses] = useState("");
  const [containerClasses, setContainerClasses] = useState("w-15");

  return (
    <>
      <h1 className="h1">Select</h1>
      <Code language="tsx" code={`import { Select } from "rujira.ui";`} />
      <p className="flex ai-c p-1 br-1 bg-primary5 fs-12 fw-500 mt-2">
        <GitLabIcon className="w-3 h-2 block" />{" "}
        <a
          href="https://gitlab.com/thorchain/rujira.ui/-/blob/main/packages/rujira.ui/src/components/inputs/Select.tsx?ref_type=heads"
          className="color-grey hover-purple ml-1 block no-underline"
          target="_blank">
          https://gitlab.com/thorchain/rujira.ui/-/blob/main/packages/rujira.ui/src/components/inputs/Select.tsx?ref_type=heads
        </a>
      </p>
      <p className="flex ai-c p-1 br-1 bg-primary5 fs-12 fw-500 mt-1">
        <FigmaIcon className="w-3 h-2 block" />{" "}
        <a
          href="https://www.figma.com/design/P5jeTCJw6Tc0CoX2pBUmsd/Rujira.ui?node-id=14-145&t=j2ZuRHEHecjWX4di-1"
          className="color-grey hover-purple ml-1 block no-underline"
          target="_blank">
          https://www.figma.com/design/P5jeTCJw6Tc0CoX2pBUmsd/Rujira.ui?node-id=14-145&t=j2ZuRHEHecjWX4di-1
        </a>
      </p>

      <p className="p mt-4">
        Inherits <code>&lt;select&gt;</code> attributes.
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
            <td className="color-primary1">label</td>
            <td>(optional) string</td>
            <td>
              <code>null</code>
            </td>
          </tr>
          <tr>
            <td className="color-primary1">labelClassName</td>
            <td>
              (optional) string
              <br />
              Class name(s) to be applied to the label
            </td>
            <td>
              <code>null</code>
            </td>
          </tr>
          <tr>
            <td className="color-primary1">containerClassName</td>
            <td>
              (optional) string
              <br />
              Class name(s) to be applied to the container
            </td>
            <td>
              <code>null</code>
            </td>
          </tr>
        </tbody>
      </table>
      <h3 className="h3 color-grey mt-6 mb-2">Example</h3>
      <div className="row wrap mt-2 example example--with-controls">
        <div className="col-12 col-lg-5 flex ai-c jc-c bg-black">
          <Select
            value={option}
            onChange={(e) => setOption(e.currentTarget.value)}
            disabled={disabled}
            label={label}
            labelClassName={labelClasses}
            containerClassName={containerClasses}>
            <option disabled value="">
              Select...
            </option>
            <option value="ruji">RUJI</option>
            <option value="rune">RUNE</option>
            <option value="usdc">USDC</option>
            <option value="btc">BTC</option>
          </Select>
        </div>

        <div className="col-12 col-lg-7 p-3 example__controls">
          <Input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.currentTarget.value)}
            label="label"
          />
          <Toggle
            className="mt-2"
            label="disabled"
            checked={disabled}
            onChange={(e) => setDisabled(e.currentTarget.checked)}
          />
          <Textarea
            containerClassName="mt-2"
            value={classes}
            onChange={(e) => setClasses(e.currentTarget.value)}
            label="className"
          />
          <Textarea
            containerClassName="mt-2"
            value={labelClasses}
            onChange={(e) => setLabelClasses(e.currentTarget.value)}
            label="labelClassName"
          />
          <Textarea
            containerClassName="mt-2"
            value={containerClasses}
            onChange={(e) => setContainerClasses(e.currentTarget.value)}
            label="containerClassName"
          />
        </div>
        <div className="col-12">
          <Code
            language="tsx"
            code={`import { Select } from "rujira.ui";

<Select
  value="${option}"
  onChange={(e) => setOption(e.currentTarget.value)}
  disabled="${disabled}"
  label="${label}"
  labelClassName="${labelClasses}"
  containerClassName="${containerClasses}>"
  <option disabled selected value="">Select...</option>
  <option value="ruji">RUJI</option>
  <option value="rune">RUNE</option>
  <option value="usdc">USDC</option>
  <option value="btc">BTC</option>
</Select>`}
          />
        </div>
      </div>

      <hr className="hr mt-5 mb-4" />
    </>
  );
};
