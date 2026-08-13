import { Code } from "../components/Code";

export const Usage = () => (
  <>
    <h1 className="h1">Gettin Started</h1>
    <h2 className="h2 color-grey">Usage</h2>
    <p className="p">
      In your main React app file include the rujira.ui scss file to gain access
      to all the CSS styles:
    </p>
    <Code language="tsx" code={`import "rujira.ui/scss/index.scss";`} />

    <p className="p mt-4">Import individual components in your React views:</p>
    <Code
      language="tsx"
      code={`import {Button, DemonIcon, Icons } from "rujira.ui";`}
    />
    <hr className="hr mt-5 mb-4" />
  </>
);
