import { useState } from "react";
import { Input, Select, Textarea, Toggle } from "rujira.ui";
import { Code } from "../components/Code";
import { GitLabIcon } from "../components/GitLabIcon";
import { FigmaIcon } from "../components/FigmaIcon";

export const Toggles = () => {
  const [checked, setChecked] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [label, setLabel] = useState("Hello World");
  const [sizeClass, setSizeClass] = useState("");
  const [colorClass, setColorClass] = useState("");
  const [classes, setClasses] = useState("");

  return (
    <>
      <h1 className="h1">Toggle</h1>
      <Code language="tsx" code={`import { Toggle } from "rujira.ui";`} />
      <p className="flex ai-c p-1 br-1 bg-primary5 fs-12 fw-500 mt-2">
        <GitLabIcon className="w-3 h-2 block" />{" "}
        <a
          href="https://gitlab.com/thorchain/rujira.ui/-/blob/main/packages/rujira.ui/src/components/inputs/Toggle.tsx?ref_type=heads"
          className="color-grey hover-purple ml-1 block no-underline"
          target="_blank">
          https://gitlab.com/thorchain/rujira.ui/-/blob/main/packages/rujira.ui/src/components/inputs/Toggle.tsx?ref_type=heads
        </a>
      </p>
      <p className="flex ai-c p-1 br-1 bg-primary5 fs-12 fw-500 mt-1">
        <FigmaIcon className="w-3 h-2 block" />{" "}
        <a
          href="https://www.figma.com/design/P5jeTCJw6Tc0CoX2pBUmsd/Rujira.ui?node-id=14-172&t=j2ZuRHEHecjWX4di-1"
          className="color-grey hover-purple ml-1 block no-underline"
          target="_blank">
          https://www.figma.com/design/P5jeTCJw6Tc0CoX2pBUmsd/Rujira.ui?node-id=14-172&t=j2ZuRHEHecjWX4di-1
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
        </tbody>
      </table>
      <h3 className="h3 color-grey mt-6 mb-2">Example</h3>
      <div className="row wrap mt-2 example example--with-controls">
        <div className="col-12 col-lg-5 flex ai-c jc-c bg-black">
          <Toggle
            label={label}
            disabled={disabled}
            className={[sizeClass, colorClass, classes]
              .filter(Boolean)
              .join(" ")}
            checked={checked}
            onChange={(e) => setChecked(e.currentTarget.checked)}
          />
        </div>

        <div className="col-12 col-lg-7 p-3 example__controls">
          <Input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.currentTarget.value)}
            label="Label"
          />
          <Toggle
            label="Disabled"
            className="mt-2"
            checked={disabled}
            onChange={(e) => setDisabled(e.currentTarget.checked)}
          />
          <Select
            containerClassName="mt-2"
            value={sizeClass}
            label="Size Modifier"
            onChange={(e) => setSizeClass(e.currentTarget.value)}>
            <option value="">none</option>
            <option>toggle--small</option>
          </Select>
          <Select
            containerClassName="mt-2"
            value={colorClass}
            label="Color Modifier"
            onChange={(e) => setColorClass(e.currentTarget.value)}>
            <option value="">none</option>
            <option>toggle--primary2</option>
            <option>toggle--grey</option>
          </Select>
          <Textarea
            containerClassName="mt-2"
            value={classes}
            onChange={(e) => setClasses(e.currentTarget.value)}
            label="Additional Classes (e.g. font or font size modifer)"
          />
        </div>
        <div className="col-12">
          <Code
            language="tsx"
            code={`import { Toggle } from "rujira.ui";

<Toggle
  className="${[sizeClass, colorClass, classes].filter(Boolean).join(" ")}"
  label="${label}"
  checked="${disabled}"
/>`}
          />
        </div>
      </div>

      <hr className="hr mt-5 mb-4" />
    </>
  );
};
