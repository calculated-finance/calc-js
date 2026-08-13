import { Code } from "../components/Code";
import { GitLabIcon } from "../components/GitLabIcon";

export const Filters = () => (
  <>
    <h1 className="h1">Filters</h1>
    <p className="flex ai-c p-1 br-1 bg-primary5 fs-12 fw-500">
      <GitLabIcon className="w-a h-2 block" />{" "}
      <a
        href="https://gitlab.com/thorchain/rujira.ui/-/blob/main/packages/rujira.ui/src/scss/base/_filters.scss?ref_type=heads"
        className="color-grey hover-purple ml-1 block no-underline"
        target="_blank">
        https://gitlab.com/thorchain/rujira.ui/-/blob/main/packages/rujira.ui/src/scss/base/_filters.scss?ref_type=heads
      </a>
    </p>
    <h2 className="h2 color-grey mt-4 mb-2">Helper Classes</h2>
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
            <code>
              opacity-<em>0..20</em>
            </code>
          </td>
          <td>
            <Code language="css" code={`opacity: $i * 0.05;`} />
          </td>
        </tr>
        <tr>
          <td>
            <code>invert</code>
          </td>
          <td>
            <Code language="css" code={`filter: invert(1);`} />
          </td>
        </tr>
        <tr>
          <td>
            <code>desaturate</code>
          </td>
          <td>
            <Code
              language="css"
              code={`filter: none;
-webkit-filter: grayscale(100%);
-moz-filter: grayscale(100%);
-ms-filter: grayscale(100%);
-o-filter: grayscale(100%);`}
            />
          </td>
        </tr>
        <tr>
          <td>
            <code>blur-bg</code>
          </td>
          <td>
            <Code
              language="css"
              code={`-webkit-backdrop-filter: blur(5px);
backdrop-filter: blur(5px);`}
            />
          </td>
        </tr>
      </tbody>
    </table>
    <hr className="hr mt-5 mb-4" />
  </>
);
