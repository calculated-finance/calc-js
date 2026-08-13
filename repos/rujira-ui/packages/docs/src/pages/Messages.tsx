import { Button, Warning } from "rujira.ui";
import { Code } from "../components/Code";
import { GitLabIcon } from "../components/GitLabIcon";
import { FigmaIcon } from "../components/FigmaIcon";

import toast from "react-hot-toast";
import { Icons } from "rujira.ui";

const promiseWithTimeout = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: 3 });
    }, 1000);
  });
};

export const Messages = () => (
  <>
    <h1 className="h1">Messages</h1>
    <h2 className="h2 color-grey">Warning</h2>
    <Code language="tsx" code={`import { Warning } from "rujira.ui";`} />
    <p className="flex ai-c p-1 br-1 bg-primary5 fs-12 fw-500 mt-2">
      <GitLabIcon className="w-3 h-2 block" />{" "}
      <a
        href="https://gitlab.com/thorchain/rujira.ui/-/blob/main/packages/rujira.ui/src/components/notices/Warning.tsx?ref_type=heads"
        className="color-grey hover-purple ml-1 block no-underline"
        target="_blank">
        https://gitlab.com/thorchain/rujira.ui/-/blob/main/packages/rujira.ui/src/components/notices/Warning.tsx?ref_type=heads
      </a>
    </p>
    <p className="flex ai-c p-1 br-1 bg-primary5 fs-12 fw-500 mt-1">
      <FigmaIcon className="w-3 h-2 block" />{" "}
      <a
        href="https://www.figma.com/design/P5jeTCJw6Tc0CoX2pBUmsd/Rujira.ui?node-id=116-731&t=ouk1kg1koWatWYU0-1"
        className="color-grey hover-purple ml-1 block no-underline"
        target="_blank">
        https://www.figma.com/design/P5jeTCJw6Tc0CoX2pBUmsd/Rujira.ui?node-id=116-731&t=ouk1kg1koWatWYU0-1
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
          <td className="color-primary1">msg</td>
          <td>string</td>
          <td>
            <code>-</code>
          </td>
        </tr>
        <tr>
          <td className="color-primary1">color</td>
          <td>(optional) teal | orange | red</td>
          <td>
            <code>low</code>
          </td>
        </tr>
        <tr>
          <td className="color-primary1">dismiss</td>
          <td>
            (optional) function
            <br />
            Dispatched on clicking the <code>X</code> button. Parent should hide
            warning
          </td>
          <td>
            <code>null</code>
          </td>
        </tr>
        <tr>
          <td className="color-primary1">className</td>
          <td>(optional) string</td>
          <td>
            <code>null</code>
          </td>
        </tr>
        <tr>
          <td className="color-primary1">children</td>
          <td>
            (optional) ReactNode
            <br />
            Replaces the default icon, or icon and JSX content
          </td>
          <td>
            <code>null</code>
          </td>
        </tr>
      </tbody>
    </table>

    <div className="bg-black p-3 mt-6">
      <Warning msg="This is some information. Custom Child">
        <Icons.Building />
      </Warning>

      <Warning
        msg={`Set custom font size and colour.\nAnd 'pre' line breaks.`}
        className="fs-12 fw-600 mt-2 color-white warning--pre">
        <Icons.Terminal className="color-teal" />
      </Warning>

      <Warning className="mt-2" color="teal" msg="This is some information." />

      <Warning className="mt-2" color="teal">
        <Icons.ChartUpDown className="color-darkTeal" />
        <span className="warning__msg">
          This is custom JSX.
          <br />
          <a
            href="http://www.x.com"
            target="_blank"
            className="color-white no-underline fs-12">
            Link to another site.
          </a>
        </span>
      </Warning>

      <Warning
        className="mt-2"
        color="orange"
        msg="This is a test, please ignore."
      />

      <Warning
        className="mt-2"
        color="red"
        msg="This is not a test, panic."
        dismiss={() => toast("Close Clicked!")}
      />
    </div>

    <h2 className="h2 color-grey mt-6">Toasts</h2>
    <p className="mb-2">
      See React Hot Toast{" "}
      <a
        href="https://react-hot-toast.com/docs/toast"
        target="_blank"
        className="color-grey hover-purple no-underline">
        documentation
      </a>
      .
    </p>

    <Code language="tsx" code={`import toast from "react-hot-toast";`} />

    <table className="table mt-4 table--big">
      <thead className="border">
        <tr>
          <th>Example</th>
          <th>Test</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <Code
              language="ts"
              code={`toast.success('Successfully created!');`}
            />
          </td>
          <td>
            <Button
              className="button--small button--grey"
              onClick={() => toast.success("Successfully created!")}
              label="Test"
            />
          </td>
        </tr>
        <tr>
          <td>
            <Code language="ts" code={`toast.error('This is an error!');`} />
          </td>
          <td>
            <Button
              className="button--small button--grey"
              onClick={() => toast.error("This is an error!")}
              label="Test"
            />
          </td>
        </tr>
        <tr>
          <td>
            <Code
              language="ts"
              code={`toast('Good Job!', {
  icon: '👏',
});`}
            />
          </td>
          <td>
            <Button
              className="button--small button--grey"
              onClick={() =>
                toast("Good Job!", {
                  icon: "👏",
                })
              }
              label="Test"
            />
          </td>
        </tr>
        <tr>
          <td>
            <Code
              language="ts"
              code={`toast.promise(
  saveSettings(settings),
   {
     loading: 'Saving...',
     success: <b>Settings saved!</b>,
     error: <b>Could not save.</b>,
   }
 );`}
            />
          </td>
          <td>
            <Button
              className="button--small button--grey"
              onClick={() =>
                toast.promise(promiseWithTimeout(), {
                  loading: "Saving...",
                  success: <b>Settings saved!</b>,
                  error: <b>Could not save.</b>,
                })
              }
              label="Test"
            />
          </td>
        </tr>
      </tbody>
    </table>

    <hr className="hr mt-5 mb-4" />
  </>
);
