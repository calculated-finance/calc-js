import { useState } from "react";
import { Numeric, Progress, Textarea, Toggle } from "rujira.ui";
import { Code } from "../components/Code";
import { GitLabIcon } from "../components/GitLabIcon";
//import { FigmaIcon } from "../components/FigmaIcon";

export const ProgressPage = () => {
  const [percentage, setPercentage] = useState(50);
  const [height, setHeight] = useState(4);
  const [labels, setLabels] = useState(false);
  const [classes, setClasses] = useState("");

  return (
    <>
      <h1 className="h1">Progress</h1>
      <Code language="tsx" code={`import { Progress } from "rujira.ui";`} />
      <p className="flex ai-c p-1 br-1 bg-primary5 fs-12 fw-500 mt-2">
        <GitLabIcon className="w-3 h-2 block" />{" "}
        <a
          href="https://gitlab.com/thorchain/rujira.ui/-/blob/main/packages/rujira.ui/src/components/progress/Progress.tsx?ref_type=heads"
          className="color-grey hover-purple ml-1 block no-underline"
          target="_blank">
          https://gitlab.com/thorchain/rujira.ui/-/blob/main/packages/rujira.ui/src/components/progress/Progress.tsx?ref_type=heads
        </a>
      </p>
      {/* <p className="flex ai-c p-1 br-1 bg-primary5 fs-12 fw-500 mt-1">
        <FigmaIcon className="w-3 h-2 block" />{" "}
        <a
          href="https://www.figma.com/design/P5jeTCJw6Tc0CoX2pBUmsd/Rujira.ui?node-id=14-172&t=j2ZuRHEHecjWX4di-1"
          className="color-grey hover-purple ml-1 block no-underline"
          target="_blank">
          https://www.figma.com/design/P5jeTCJw6Tc0CoX2pBUmsd/Rujira.ui?node-id=14-172&t=j2ZuRHEHecjWX4di-1
        </a>
      </p> */}

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
            <td className="color-primary1">percentage</td>
            <td>
              number
              <br />
              range 0 to 100
            </td>
            <td>
              <code>null</code>
            </td>
          </tr>
          <tr>
            <td className="color-primary1">height</td>
            <td>(optional) number</td>
            <td>
              <code>4</code>
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
        <div className="col-12 col-lg-5 flex ai-c jc-c bg-black px-2">
          <Progress
            className={classes}
            height={height}
            percentage={percentage}
            showLabels={labels}
          />
        </div>

        <div className="col-12 col-lg-7 p-3 example__controls">
          <Numeric
            amount={BigInt(percentage)}
            decimals={0}
            onChangeAmount={(a) => setPercentage(Number(a))}
            label="Percentage"
          />
          <Numeric
            className="mt-2"
            amount={BigInt(height)}
            decimals={0}
            onChangeAmount={(a) => setHeight(Number(a))}
            label="Height"
          />
          <Toggle
            className="mt-2"
            label="Show Labels"
            checked={labels}
            onChange={(e) => setLabels(e.currentTarget.checked)}
          />

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
            code={`import { Progress } from "rujira.ui";

<Progress
  className="${classes}"
  height={${height}}
  percentage={${percentage}}
/>`}
          />
        </div>
      </div>

      <hr className="hr mt-5 mb-4" />
    </>
  );
};
