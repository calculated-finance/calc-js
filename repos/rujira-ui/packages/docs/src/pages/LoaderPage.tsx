import { Loader } from "rujira.ui";
import { Code } from "../components/Code";
import { GitLabIcon } from "../components/GitLabIcon";

export const LoaderPage = () => (
  <>
    <h1 className="h1">Loader</h1>
    <Code language="tsx" code={`import { Loader } from "rujira.ui";`} />
    <p className="flex ai-c p-1 br-1 bg-primary5 fs-12 fw-500 mt-2">
      <GitLabIcon className="w-3 h-2 block" />{" "}
      <a
        href="https://gitlab.com/thorchain/rujira.ui/-/blob/main/packages/rujira.ui/src/components/loader/Loader.tsx?ref_type=heads"
        className="color-grey hover-purple ml-1 block no-underline"
        target="_blank">
        https://gitlab.com/thorchain/rujira.ui/-/blob/main/packages/rujira.ui/src/components/loader/Loader.tsx?ref_type=heads
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
    <h3 className="h3 color-grey mt-6">Example</h3>

    <div className="row wrap mt-2 example example--with-controls">
      <div className="col-12 flex ai-c jc-c bg-black p-3">
        <Loader className="w-10 h-10" />
      </div>
      <div className="col-12">
        <Code
          language="tsx"
          code={`import { Loader } from "rujira.ui";

<Loader className="w-10 h-10" />`}
        />
      </div>
    </div>
  </>
);
