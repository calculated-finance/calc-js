import { useState } from "react";
import { Checkbox, Input, Numeric, Radio, Textarea, Toggle } from "rujira.ui";
import { Code } from "../components/Code";
import { GitLabIcon } from "../components/GitLabIcon";
import { FigmaIcon } from "../components/FigmaIcon";

export const Inputs = () => {
  const [disabled, setDisabled] = useState(false);
  const [text, setText] = useState("");
  const [label, setLabel] = useState("First Name");
  const [classes, setClasses] = useState("");
  const [labelClasses, setLabelClasses] = useState("");
  const [containerClasses, setContainerClasses] = useState("");

  const [disablednum, setDisablednum] = useState(false);
  const [val, setVal] = useState(0);
  const [labelnum, setLabelnum] = useState("Amount");
  const [classesnum, setClassesnum] = useState("");
  const [decimals, setDecimals] = useState(8);

  const [disabledta, setDisabledta] = useState(false);
  const [textta, setTextta] = useState("");
  const [labelta, setLabelta] = useState("Message");
  const [classesta, setClassesta] = useState("");
  const [labelClassesta, setLabelClassesta] = useState("");
  const [containerClassesta, setContainerClassesta] = useState("");

  const [radioSelected, setRadioSelected] = useState("opt1");

  const [checked, setChecked] = useState(false);
  const [checked2, setChecked2] = useState(false);

  return (
    <>
      <h1 className="h1">Inputs</h1>
      <h2 className="h2 color-grey">Input</h2>
      <Code language="tsx" code={`import { Input } from "rujira.ui";`} />
      <p className="flex ai-c p-1 br-1 bg-primary5 fs-12 fw-500 mt-2">
        <GitLabIcon className="w-3 h-2 block" />{" "}
        <a
          href="https://gitlab.com/thorchain/rujira.ui/-/blob/main/packages/rujira.ui/src/components/inputs/Input.tsx?ref_type=heads"
          className="color-grey hover-purple ml-1 block no-underline"
          target="_blank">
          https://gitlab.com/thorchain/rujira.ui/-/blob/main/packages/rujira.ui/src/components/inputs/Input.tsx?ref_type=heads
        </a>
      </p>
      <p className="flex ai-c p-1 br-1 bg-primary5 fs-12 fw-500 mt-1">
        <FigmaIcon className="w-3 h-2 block" />{" "}
        <a
          href="https://www.figma.com/design/P5jeTCJw6Tc0CoX2pBUmsd/Rujira.ui?node-id=14-80&t=j2ZuRHEHecjWX4di-1"
          className="color-grey hover-purple ml-1 block no-underline"
          target="_blank">
          https://www.figma.com/design/P5jeTCJw6Tc0CoX2pBUmsd/Rujira.ui?node-id=14-80&t=j2ZuRHEHecjWX4di-1
        </a>
      </p>

      <p className="p mt-4">
        Inherits <code>&lt;input&gt;</code> attributes.
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
          <Input
            type="text"
            value={text}
            onChange={(e) => setText(e.currentTarget.value)}
            disabled={disabled}
            label={label}
            labelClassName={labelClasses}
            containerClassName={containerClasses}
          />
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
            code={`import { Input } from "rujira.ui";

<Input
  type="text"
  value={text}
  onChange={(e) => setText(e.currentTarget.value)}
  disabled={${disabled}}
  label="${label}"
  labelClassName="${labelClasses}"
  containerClassName="${containerClasses}"
/>`}
          />
        </div>
      </div>

      <h2 className="h2 color-grey mt-6">Numeric</h2>
      <Code language="tsx" code={`import { Numeric } from "rujira.ui";`} />
      <p className="flex ai-c p-1 br-1 bg-primary5 fs-12 fw-500 mt-2">
        <GitLabIcon className="w-3 h-2 block" />{" "}
        <a
          href="https://gitlab.com/thorchain/rujira.ui/-/blob/main/packages/rujira.ui/src/components/inputs/Numeric.tsx?ref_type=heads"
          className="color-grey hover-purple ml-1 block no-underline"
          target="_blank">
          https://gitlab.com/thorchain/rujira.ui/-/blob/main/packages/rujira.ui/src/components/inputs/Numeric.tsx?ref_type=heads
        </a>
      </p>
      <p className="flex ai-c p-1 br-1 bg-primary5 fs-12 fw-500 mt-1">
        <FigmaIcon className="w-3 h-2 block" />{" "}
        <a
          href="https://www.figma.com/design/P5jeTCJw6Tc0CoX2pBUmsd/Rujira.ui?node-id=14-80&t=j2ZuRHEHecjWX4di-1"
          className="color-grey hover-purple ml-1 block no-underline"
          target="_blank">
          https://www.figma.com/design/P5jeTCJw6Tc0CoX2pBUmsd/Rujira.ui?node-id=14-80&t=j2ZuRHEHecjWX4di-1
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
            <td className="color-primary1">label</td>
            <td>(optional) string</td>
            <td>
              <code>null</code>
            </td>
          </tr>
          <tr>
            <td className="color-primary1">amount</td>
            <td>bigint</td>
            <td>
              <code></code>
            </td>
          </tr>
          <tr>
            <td className="color-primary1">decimals</td>
            <td>(optional) number</td>
            <td>
              <code>8</code>
            </td>
          </tr>
          <tr>
            <td className="color-primary1">initialZeroAsPlaceholder</td>
            <td>
              (optional) boolean
              <br />
              display an initial zero amount using the input placeholder
            </td>
            <td>
              <code>false</code>
            </td>
          </tr>
          <tr>
            <td className="color-primary1">onChangeAmount</td>
            <td>{"(a: bigint) => void"}</td>
            <td>
              <code></code>
            </td>
          </tr>
          <tr>
            <td className="color-primary1">disabled</td>
            <td>(optional) boolean</td>
            <td>
              <code>null</code>
            </td>
          </tr>
          <tr>
            <td className="color-primary1">full</td>
            <td>
              (optional) boolean
              <br />
              stretch full width
            </td>
            <td>
              <code>null</code>
            </td>
          </tr>
          <tr>
            <td className="color-primary1">className</td>
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
          <Numeric
            amount={BigInt(val)}
            onChangeAmount={(a: any) => setVal(Number(a))}
            disabled={disablednum}
            label={labelnum}
            decimals={decimals}
            className={classesnum}
          />
        </div>

        <div className="col-12 col-lg-7 p-3 example__controls">
          <Input
            type="text"
            value={labelnum}
            onChange={(e) => setLabelnum(e.currentTarget.value)}
            label="label"
          />
          <Numeric
            className="mt-2"
            amount={BigInt(decimals)}
            onChangeAmount={(a: any) => setDecimals(Number(a))}
            label="decimals"
            decimals={0}
          />
          <Toggle
            className="mt-2"
            label="disabled"
            checked={disablednum}
            onChange={(e) => setDisablednum(e.currentTarget.checked)}
          />
          <Textarea
            containerClassName="mt-2"
            value={classesnum}
            onChange={(e) => setClassesnum(e.currentTarget.value)}
            label="className"
          />
        </div>
        <div className="col-12">
          <Code
            language="tsx"
            code={`import { Numeric } from "rujira.ui";

<Numeric
  amount={BigInt(val)}
  onChangeAmount={(a:any) => setVal(Number(a))}
  disabled={${disablednum}}
  label="${labelnum}"
  className="${classesnum}"
  decimals={${decimals}}
/>`}
          />
        </div>
      </div>

      <h2 className="h2 mt-6 color-grey">Textarea</h2>
      <Code language="tsx" code={`import { Textarea } from "rujira.ui";`} />
      <p className="flex ai-c p-1 br-1 bg-primary5 fs-12 fw-500 mt-2">
        <GitLabIcon className="w-a h-2 block" />{" "}
        <a
          href="https://gitlab.com/thorchain/rujira.ui/-/blob/main/packages/rujira.ui/src/components/inputs/Textarea.tsx?ref_type=heads"
          className="color-grey hover-purple ml-1 block no-underline"
          target="_blank">
          https://gitlab.com/thorchain/rujira.ui/-/blob/main/packages/rujira.ui/src/components/inputs/Textarea.tsx?ref_type=heads
        </a>
      </p>
      <p className="p mt-4">
        Inherits <code>&lt;textarea&gt;</code> attributes.
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
          <Textarea
            value={textta}
            onChange={(e) => setTextta(e.currentTarget.value)}
            disabled={disabledta}
            label={labelta}
            className={classesta}
            labelClassName={labelClassesta}
            containerClassName={containerClassesta}
          />
        </div>

        <div className="col-12 col-lg-7 p-3 example__controls">
          <Input
            type="text"
            value={labelta}
            onChange={(e) => setLabelta(e.currentTarget.value)}
            label="label"
          />
          <Toggle
            className="mt-2"
            label="disabled"
            checked={disabledta}
            onChange={(e) => setDisabledta(e.currentTarget.checked)}
          />
          <Textarea
            containerClassName="mt-2"
            value={classesta}
            onChange={(e) => setClassesta(e.currentTarget.value)}
            label="className"
          />
          <Textarea
            containerClassName="mt-2"
            value={labelClassesta}
            onChange={(e) => setLabelClassesta(e.currentTarget.value)}
            label="labelClassName"
          />
          <Textarea
            containerClassName="mt-2"
            value={containerClassesta}
            onChange={(e) => setContainerClassesta(e.currentTarget.value)}
            label="containerClassName"
          />
        </div>
        <div className="col-12">
          <Code
            language="tsx"
            code={`import { Textarea } from "rujira.ui";

<Textarea
  value={text}
  onChange={(e) => setText(e.currentTarget.value)}
  disabled={${disabled}}
  label="${label}"
  labelClassName="${labelClasses}"
  containerClassName="${containerClasses}"
/>`}
          />
        </div>
      </div>

      <h2 className="h2 mt-6 color-grey">Radio</h2>
      <Code language="tsx" code={`import { Radio } from "rujira.ui";`} />
      <p className="flex ai-c p-1 br-1 bg-primary5 fs-12 fw-500 mt-2">
        <GitLabIcon className="w-a h-2 block" />{" "}
        <a
          href="https://gitlab.com/thorchain/rujira.ui/-/blob/main/packages/rujira.ui/src/components/inputs/Radio.tsx?ref_type=heads"
          className="color-grey hover-purple ml-1 block no-underline"
          target="_blank">
          https://gitlab.com/thorchain/rujira.ui/-/blob/main/packages/rujira.ui/src/components/inputs/Radio.tsx?ref_type=heads
        </a>
      </p>
      <p className="flex ai-c p-1 br-1 bg-primary5 fs-12 fw-500 mt-1">
        <FigmaIcon className="w-3 h-2 block" />{" "}
        <a
          href="https://www.figma.com/design/P5jeTCJw6Tc0CoX2pBUmsd/Rujira.ui?node-id=449-130&t=tSQYCJUK3ObZDNSp-1"
          className="color-grey hover-purple ml-1 block no-underline"
          target="_blank">
          https://www.figma.com/design/P5jeTCJw6Tc0CoX2pBUmsd/Rujira.ui?node-id=449-130&t=tSQYCJUK3ObZDNSp-1
        </a>
      </p>
      <p className="p mt-4">
        Inherits <code>&lt;input&gt;</code> attributes.
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
        </tbody>
      </table>
      <h3 className="h3 color-grey mt-6 mb-2">Example</h3>
      <div className="row wrap mt-2 example example--with-controls">
        <div className="col-12 py-5 flex ai-c jc-c bg-black">
          <div className="flex dir-c">
            <Radio
              label="Option 1"
              value="opt1"
              name="option"
              checked={radioSelected === "opt1"}
              onChange={(e) => setRadioSelected(e.target.value)}
            />
            <Radio
              className="mt-2"
              label="Option 2"
              value="opt2"
              name="option"
              checked={radioSelected === "opt2"}
              onChange={(e) => setRadioSelected(e.target.value)}
            />
          </div>
        </div>
        <div className="col-12">
          <Code
            language="tsx"
            code={`import { Radio } from "rujira.ui";

<Radio
  label="Option 1"
  value="opt1"
  name="option"
  checked={radioSelected === "opt1"}
  onChange={(e) => setRadioSelected(e.target.value)}
/>
<Radio
  className="mt-2"
  label="Option 2"
  value="opt2"
  name="option"
  checked={radioSelected === "opt2"}
  onChange={(e) => setRadioSelected(e.target.value)}
/>`}
          />
        </div>
      </div>

      <h2 className="h2 mt-6 color-grey">Checkbox</h2>
      <Code language="tsx" code={`import { Checkbox } from "rujira.ui";`} />
      <p className="flex ai-c p-1 br-1 bg-primary5 fs-12 fw-500 mt-2">
        <GitLabIcon className="w-a h-2 block" />{" "}
        <a
          href="https://gitlab.com/thorchain/rujira.ui/-/blob/main/packages/rujira.ui/src/components/inputs/Checkbox.tsx?ref_type=heads"
          className="color-grey hover-purple ml-1 block no-underline"
          target="_blank">
          https://gitlab.com/thorchain/rujira.ui/-/blob/main/packages/rujira.ui/src/components/inputs/Checkbox.tsx?ref_type=heads
        </a>
      </p>
      <p className="flex ai-c p-1 br-1 bg-primary5 fs-12 fw-500 mt-1">
        <FigmaIcon className="w-3 h-2 block" />{" "}
        <a
          href="https://www.figma.com/design/P5jeTCJw6Tc0CoX2pBUmsd/Rujira.ui?node-id=450-130&t=tSQYCJUK3ObZDNSp-1"
          className="color-grey hover-purple ml-1 block no-underline"
          target="_blank">
          https://www.figma.com/design/P5jeTCJw6Tc0CoX2pBUmsd/Rujira.ui?node-id=450-130&t=tSQYCJUK3ObZDNSp-1
        </a>
      </p>
      <p className="p mt-4">
        Inherits <code>&lt;input&gt;</code> attributes.
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
            <td className="color-primary1">children</td>
            <td>
              (optional) ReactNode
              <br />
              Useful for rending links inside a label
            </td>
            <td>
              <code>null</code>
            </td>
          </tr>
        </tbody>
      </table>
      <h3 className="h3 color-grey mt-6 mb-2">Example</h3>
      <div className="row wrap mt-2 example example--with-controls">
        <div className="col-12 py-5 flex ai-c jc-c bg-black">
          <div className="flex dir-c">
            <Checkbox
              label="Simple Checkbox"
              checked={checked}
              onChange={() => setChecked(!checked)}
            />
            <Checkbox
              className="mt-2"
              checked={checked2}
              onChange={() => setChecked2(!checked2)}
              id="checky">
              <label htmlFor="checky">
                Accept{" "}
                <a href="https://www.google.com" target="_blank">
                  Terms and conditions
                </a>
              </label>
            </Checkbox>
          </div>
        </div>
        <div className="col-12">
          <Code
            language="tsx"
            code={`import { Checkbox } from "rujira.ui";

<Checkbox
  label="Simple Checkbox"
  checked={checked}
  onChange={(e) => setChecked(!checked)}
/>
<Checkbox
  className="mt-2"
  checked={checked2}
  onChange={(e) => setChecked2(!checked2)}
  id="checky">
  <label htmlFor="checky">
    Accept{" "}
    <a
      href="https://www.google.com"
      target="_blank">
      Terms and conditions
    </a>
  </label>
</Checkbox>`}
          />
        </div>
      </div>

      <hr className="hr mt-5 mb-4" />
    </>
  );
};
