import { Code } from "../components/Code";
import { Copy } from "../components/Copy";
import { GitLabIcon } from "../components/GitLabIcon";

export const Display = () => (
  <>
    <h1 className="h1">Display</h1>
    <p className="flex ai-c p-1 br-1 bg-primary5 fs-12 fw-500">
      <GitLabIcon className="w-a h-2 block" />{" "}
      <a
        href="https://gitlab.com/thorchain/rujira.ui/-/blob/main/packages/rujira.ui/src/scss/base/_display.scss?ref_type=heads"
        className="color-grey hover-purple ml-1 block no-underline"
        target="_blank">
        https://gitlab.com/thorchain/rujira.ui/-/blob/main/packages/rujira.ui/src/scss/base/_display.scss?ref_type=heads
      </a>
    </p>
    <p className="p mt-4">
      Rujira.ui uses <code>normalize.css ^8</code>, and sets the following
      baseline:
    </p>
    <Code
      language="css"
      code={`html {
  box-sizing: border-box;
  scroll-behavior: smooth;
}

*,
*:before,
*:after {
  box-sizing: border-box;
}`}
    />
    <h2 className="h2 color-grey mt-6 mb-2">Helper Classes</h2>
    <table className="table mt-4">
      <thead className="border">
        <tr>
          <th>Selector</th>
          <th>Corresponding Sass</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <Copy text="block" />
          </td>
          <td>
            <Code language="css" code={`display: block;`} />
          </td>
        </tr>
        <tr>
          <td>
            <Copy text="inline-block" />
          </td>
          <td>
            <Code language="css" code={`display: inline-block;`} />
          </td>
        </tr>
        <tr>
          <td>
            <Copy text="relative" />
          </td>
          <td>
            <Code language="css" code={`position: relative;`} />
          </td>
        </tr>
        <tr>
          <td>
            <Copy text="block-img" />
          </td>
          <td>
            <Code
              language="css"
              code={`display: block;
max-width: 100%;
height: auto;`}
            />
          </td>
        </tr>
        <tr>
          <td>
            <Copy text="overflow-x-auto" />
          </td>
          <td>
            <Code language="css" code={`overflow-x: auto;`} />
          </td>
        </tr>
        <tr>
          <td>
            <Copy text="overflow-y-auto" />
          </td>
          <td>
            <Code language="css" code={`overflow-y: auto;`} />
          </td>
        </tr>
        <tr>
          <td>
            <Copy text="overflow-hidden" />
          </td>
          <td>
            <Code language="css" code={`overflow: hidden;`} />
          </td>
        </tr>
        <tr>
          <td>
            <Copy text="reset-overflow" />
          </td>
          <td>
            <Code language="css" code={`overflow: visible;`} />
          </td>
        </tr>
        <tr>
          <td>
            <Copy text="pointer" />
          </td>
          <td>
            <Code language="css" code={`cursor: pointer;`} />
          </td>
        </tr>
        <tr>
          <td>
            <Copy text="arrow" />
          </td>
          <td>
            <Code language="css" code={`cursor: arrow;`} />
          </td>
        </tr>
        <tr>
          <td>
            <Copy text="visually-hidden" />
          </td>
          <td>
            <Code
              language="css"
              code={`position: absolute !important;
width: 1px !important;
height: 1px !important;
padding: 0 !important;
margin: -1px !important;
overflow: hidden !important;
clip: rect(0, 0, 0, 0) !important;
white-space: nowrap !important;
border: 0 !important;`}
            />
          </td>
        </tr>
        <tr>
          <td>
            <Copy text="no-pointer-events" />
          </td>
          <td>
            <Code language="css" code={`pointer-events: none;`} />
          </td>
        </tr>
        <tr>
          <td>
            <Copy text="no-select" />
          </td>
          <td>
            <Code
              language="css"
              code={`user-select: none;
cursor: default;`}
            />
          </td>
        </tr>
        <tr>
          <td>
            <Copy text="clearfix" />
          </td>
          <td>
            <Code
              language="css"
              code={`&::after {
  display: block;
  clear: both;
  content: "";
}`}
            />
          </td>
        </tr>
        <tr>
          <td>
            <Copy text="transition" />
          </td>
          <td>
            <Code language="css" code={`transition: all 0.15s;`} />
          </td>
        </tr>
      </tbody>
    </table>
    <hr className="hr mt-5 mb-4" />
  </>
);
