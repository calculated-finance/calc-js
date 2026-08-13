import { useState } from "react";
import { Button, Icons, Input, Select, Toggle } from "rujira.ui";
import { Code } from "../components/Code";
import { GitLabIcon } from "../components/GitLabIcon";
import { FigmaIcon } from "../components/FigmaIcon";

export const Buttons = () => {
  const [disabled, setDisabled] = useState(false);
  const [label, setLabel] = useState("Hello World");
  const [sizeClass, setSizeClass] = useState("");
  const [outlineClass, setOutlineClass] = useState("");
  const [colorClass, setColorClass] = useState("");
  const [classes, setClasses] = useState("");

  return (
    <>
      <h1 className="h1">Button</h1>
      <Code language="tsx" code={`import { Button } from "rujira.ui";`} />
      <p className="flex ai-c p-1 br-1 bg-primary5 fs-12 fw-500 mt-2">
        <GitLabIcon className="w-3 h-2 block" />{" "}
        <a
          href="https://gitlab.com/thorchain/rujira.ui/-/blob/main/packages/rujira.ui/src/components/buttons/Button.tsx?ref_type=heads"
          className="color-grey hover-purple ml-1 block no-underline"
          target="_blank">
          https://gitlab.com/thorchain/rujira.ui/-/blob/main/packages/rujira.ui/src/components/buttons/Button.tsx?ref_type=heads
        </a>
      </p>
      <p className="flex ai-c p-1 br-1 bg-primary5 fs-12 fw-500 mt-1">
        <FigmaIcon className="w-3 h-2 block" />{" "}
        <a
          href="https://www.figma.com/design/P5jeTCJw6Tc0CoX2pBUmsd/Rujira.ui?node-id=12-48&t=j2ZuRHEHecjWX4di-1"
          className="color-grey hover-purple ml-1 block no-underline"
          target="_blank">
          https://www.figma.com/design/P5jeTCJw6Tc0CoX2pBUmsd/Rujira.ui?node-id=12-48&t=j2ZuRHEHecjWX4di-1
        </a>
      </p>
      <p className="p mt-4">
        Inherits <code>&lt;button&gt;</code> attributes, and if <code>as</code>{" "}
        is supplied, will extend the <code>RefAttributes</code> of the supplied
        type.
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
            <td className="color-primary1">as</td>
            <td>
              (optional) React.ElementType to render <code>{`<Button>`}</code>{" "}
              as, e.g.{" "}
              <code>
                as={`{Link}`} or as={`"button"`},
              </code>{" "}
              and inherit the type attributes.
            </td>
            <td>
              <code>"button"</code>
            </td>
          </tr>
          <tr>
            <td className="color-primary1">label</td>
            <td>(optional) string</td>
            <td>
              <em>null</em>
            </td>
          </tr>
        </tbody>
      </table>
      <h3 className="h3 color-grey mt-6 mb-2">Examples</h3>
      <div className="row wrap mt-2 example example--with-controls">
        <div className="col-12 col-lg-5 flex ai-c jc-c bg-black relative gradient-card-container">
          <Button
            disabled={disabled}
            label={label}
            className={[sizeClass, outlineClass, colorClass, classes]
              .filter(Boolean)
              .join(" ")}
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
            className="toggle--small mt-2"
            checked={disabled}
            onChange={(e) => setDisabled(e.currentTarget.checked)}
          />
          <Select
            containerClassName="mt-2"
            value={sizeClass}
            label="Size Modifier"
            onChange={(e) => setSizeClass(e.currentTarget.value)}>
            <option value="">none</option>
            <option>button--xsmall</option>
            <option>button--small</option>
            <option>button--big</option>
          </Select>
          <Select
            containerClassName="mt-2"
            value={outlineClass}
            label="Outline"
            onChange={(e) => setOutlineClass(e.currentTarget.value)}>
            <option value="">none</option>
            <option>button--outline</option>
          </Select>
          <Select
            containerClassName="mt-2"
            value={colorClass}
            label="Color Modifier"
            onChange={(e) => setColorClass(e.currentTarget.value)}>
            <option value="">none</option>
            <option>button--dark</option>
            <option>button--blue</option>
            <option>button--grey</option>
            <option>button--red</option>
          </Select>
          <Input
            type="text"
            value={classes}
            onChange={(e) => setClasses(e.currentTarget.value)}
            label="Custom Classes"
            containerClassName="mt-2"
          />
        </div>
        <div className="col-12">
          <Code
            language="tsx"
            code={`import { Button } from "rujira.ui";

<Button
  className="${[sizeClass, outlineClass, colorClass, classes].filter(Boolean).join(" ")}"
  label="${label}"
  disabled="${disabled}"
/>`}
          />
        </div>
      </div>

      <div className="row wrap mt-2 example example--with-controls">
        <div className="col-12 flex ai-c jc-c bg-black p-3">
          <Button label="Go Back" className="button--outline mr-1">
            <Icons.AngleLeft />
          </Button>
          <Button label="Let's Go" className="button--icon-right">
            <Icons.ArrowRight />
          </Button>
        </div>
        <div className="col-12">
          <Code
            language="tsx"
            code={`import { Button, Icons } from "rujira.ui";

<Button label="Go Back" className="button--outline mr-1">
  <Icons.AngleLeft />
</Button>
<Button label="Let's Go" className="button--icon-right">
  <Icons.ArrowRight />
</Button>`}
          />
        </div>
      </div>

      <hr className="hr mt-5 mb-4" />
    </>
  );
};
