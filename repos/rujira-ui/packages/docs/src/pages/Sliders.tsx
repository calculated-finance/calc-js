import { useState } from "react";
import { Input, Slider, Toggle } from "rujira.ui";
import { Code } from "../components/Code";
import { GitLabIcon } from "../components/GitLabIcon";
import { FigmaIcon } from "../components/FigmaIcon";

export const Sliders = () => {
  const [disabled, setDisabled] = useState(false);
  const [val, setVal] = useState(20);
  const [step, setStep] = useState(1);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(100);

  return (
    <>
      <h1 className="h1">Slider</h1>
      <Code language="tsx" code={`import { Slider } from "rujira.ui";`} />
      <p className="flex ai-c p-1 br-1 bg-primary5 fs-12 fw-500 mt-2">
        <GitLabIcon className="w-3 h-2 block" />{" "}
        <a
          href="https://gitlab.com/thorchain/rujira.ui/-/blob/main/packages/rujira.ui/src/components/slider/Slider.tsx?ref_type=heads"
          className="color-grey hover-purple ml-1 block no-underline"
          target="_blank">
          https://gitlab.com/thorchain/rujira.ui/-/blob/main/packages/rujira.ui/src/components/slider/Slider.tsx?ref_type=heads
        </a>
      </p>
      <p className="flex ai-c p-1 br-1 bg-primary5 fs-12 fw-500 mt-1">
        <FigmaIcon className="w-3 h-2 block" />{" "}
        <a
          href="https://www.figma.com/design/P5jeTCJw6Tc0CoX2pBUmsd/Rujira.ui?node-id=37-529&t=pVp0r65UkcbrYdkI-1"
          className="color-grey hover-purple ml-1 block no-underline"
          target="_blank">
          https://www.figma.com/design/P5jeTCJw6Tc0CoX2pBUmsd/Rujira.ui?node-id=37-529&t=pVp0r65UkcbrYdkI-1
        </a>
      </p>

      <p className="p mt-4">
        Inherits{" "}
        <code>
          <a
            href="https://github.com/zillow/react-slider"
            target="_blank"
            className="color-black hover-purple no-underline">
            @types/react-slider
          </a>
        </code>{" "}
        attributes.
      </p>

      <h3 className="h3 color-grey mt-6 mb-2">Example</h3>
      <div className="row wrap mt-2 example example--with-controls">
        <div className="col-12 col-lg-6 flex ai-c jc-c bg-black p-3">
          <Slider
            value={val}
            onChange={(value) => setVal(value)}
            step={step}
            min={min}
            max={max}
            disabled={disabled}
          />
        </div>

        <div className="col-12 col-lg-6 p-3 example__controls">
          <Input
            type="number"
            value={val}
            onChange={(e) => setVal(parseFloat(e.currentTarget.value))}
            label="Value"
          />
          <Input
            containerClassName="mt-2"
            type="number"
            value={step}
            onChange={(e) => setStep(parseFloat(e.currentTarget.value))}
            label="Step"
          />
          <Input
            containerClassName="mt-2"
            type="number"
            value={min}
            onChange={(e) => setMin(parseFloat(e.currentTarget.value))}
            label="Min"
          />
          <Input
            containerClassName="mt-2"
            type="number"
            value={max}
            onChange={(e) => setMax(parseFloat(e.currentTarget.value))}
            label="Max"
          />
          <Toggle
            label="Disabled"
            className="mt-2 toggle--small"
            checked={disabled}
            onChange={(e) => setDisabled(e.currentTarget.checked)}
          />
        </div>
        <div className="col-12">
          <Code
            language="tsx"
            code={`import { Slider } from "rujira.ui";

<Slider
  value={val}
  onChange={(value) => setVal(value)}
  step={${step}}
  min={${min}}
  max={${max}}
  disabled={${disabled}}
/>`}
          />
        </div>
      </div>

      <hr className="hr mt-5 mb-4" />
    </>
  );
};
