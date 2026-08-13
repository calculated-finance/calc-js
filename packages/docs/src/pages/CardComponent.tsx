import { Card, GradientCard } from "rujira.ui";
import { Code } from "../components/Code";
import { GitLabIcon } from "../components/GitLabIcon";
import { Link } from "react-router-dom";

export const CardComponent = () => (
  <>
    <h1 className="h1">Card Components</h1>
    <Code
      language="tsx"
      code={`import { Card, GradientCard } from "rujira.ui";`}
    />
    <p className="flex ai-c p-1 br-1 bg-primary5 fs-12 fw-500 mt-2">
      <GitLabIcon className="w-3 h-2 block" />{" "}
      <a
        href="https://gitlab.com/thorchain/rujira.ui/-/blob/main/packages/rujira.ui/src/components/cards/Card.tsx?ref_type=heads"
        className="color-grey hover-purple ml-1 block no-underline"
        target="_blank">
        https://gitlab.com/thorchain/rujira.ui/-/blob/main/packages/rujira.ui/src/components/cards/Card.tsx?ref_type=heads
      </a>
    </p>

    <p className="p mt-4">
      Shortcut implementation of the{" "}
      <Link to="/cards" className="color-pink hover-purple no-underline fw-500">
        Cards Styles
      </Link>
      .
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
    <h3 className="h3 color-grey mt-6">Example</h3>

    <div className="row wrap mt-2 example example--with-controls">
      <div className="col-12 flex ai-c jc-c bg-primary5 p-3">
        <Card>
          <h5 className="h5 color-grey">Card Title</h5>
          <p className="fs-14 lh-19">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
        </Card>
      </div>
      <div className="col-12">
        <Code
          language="tsx"
          code={`import { Card } from "rujira.ui";

<Card>
  <h5 className="h5 color-grey">Card Title</h5>
  <p className="fs-14 lh-19">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
    eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
    ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
    aliquip ex ea commodo consequat.
  </p>
</Card>`}
        />
      </div>
    </div>

    <div className="row wrap mt-4 example example--with-controls">
      <div className="col-12 flex ai-c jc-c bg-primary5 p-3 gradient-card-container">
        <GradientCard className="gradient-card--purple">
          <h5 className="h5 color-primary1">GradientCard Title</h5>
          <p className="fs-14 lh-19">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
        </GradientCard>
      </div>
      <div className="col-12">
        <Code
          language="tsx"
          code={`import { GradientCard } from "rujira.ui";

<GradientCard className="gradient-card--purple">
  <h5 className="h5 color-primary1">GradientCard Title</h5>
  <p className="fs-14 lh-19">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
    eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
    ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
    aliquip ex ea commodo consequat.
  </p>
</GradientCard>`}
        />
      </div>
    </div>
  </>
);
