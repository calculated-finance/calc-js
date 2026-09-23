import { Code } from "../components/Code";
import { Copy } from "../components/Copy";
import { GitLabIcon } from "../components/GitLabIcon";

const Color = ({ color }: { color: string; className?: string }) => (
  <div className={`w-10 h-6 br-1 bg-${color}`} />
);

export const Colors = () => (
  <>
    <h1 className="h1">Colors</h1>
    <p className="flex ai-c p-1 br-1 bg-primary5 fs-12 fw-500">
      <GitLabIcon className="w-a h-2 block" />{" "}
      <a
        href="https://gitlab.com/thorchain/rujira.ui/-/blob/main/packages/rujira.ui/src/scss/base/_variables.scss?ref_type=heads#L2-26"
        className="color-grey hover-purple ml-1 block no-underline"
        target="_blank">
        https://gitlab.com/thorchain/rujira.ui/-/blob/main/packages/rujira.ui/src/scss/base/_variables.scss?ref_type=heads#L2-26
      </a>
    </p>
    <h2 className="h2 color-grey mt-4">Primary Colors</h2>
    <table className="table mt-4">
      <thead className="border">
        <tr>
          <th>Preview</th>
          <th>Modifer(s)</th>
          <th>Variable(s)</th>
          <th>HEX</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <Color color="primary1" />
          </td>
          <td>
            <Copy text="primary1" />
            <code className="ml-1">pink</code>
          </td>
          <td>
            <Copy text="$primary1" />
            <code className="ml-1">$pink</code>
          </td>
          <td>
            <Copy text="#D615EB" />
          </td>
        </tr>
        <tr>
          <td>
            <Color color="primary2" />
          </td>
          <td>
            <Copy text="primary2" />
            <code className="ml-1">purple</code>
          </td>
          <td>
            <Copy text="$primary2" />
            <code className="ml-1">$purple</code>
          </td>
          <td>
            <Copy text="#8436F5" />
          </td>
        </tr>
        <tr>
          <td>
            <Color color="primary3" />
          </td>
          <td>
            <Copy text="primary3" />
          </td>
          <td>
            <Copy text="$primary3" />
          </td>
          <td>
            <Copy text="#5A2AD1" />
          </td>
        </tr>
        <tr>
          <td>
            <Color color="primary4" />
          </td>
          <td>
            <Copy text="primary4" />
          </td>
          <td>
            <Copy text="$primary4" />
          </td>
          <td>
            <Copy text="#070E50" />
          </td>
        </tr>
        <tr>
          <td>
            <Color color="primary5" />
          </td>
          <td>
            <Copy text="primary5" />
          </td>
          <td>
            <Copy text="$primary5" />
          </td>
          <td>
            <Copy text="#ECEDF2" />
          </td>
        </tr>
        <tr>
          <td>
            <Color color="primary6" />
          </td>
          <td>
            <Copy text="primary6" />
          </td>
          <td>
            <Copy text="$primary6" />
          </td>
          <td>
            <Copy text="#D9D5E2" />
          </td>
        </tr>
      </tbody>
    </table>
    <h2 className="h2 color-grey mt-6">Secondary Colors</h2>
    <table className="table mt-4">
      <thead className="border">
        <tr>
          <th>Preview</th>
          <th>Modifer</th>
          <th>Variable</th>
          <th>HEX</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <Color color="teal" />
          </td>
          <td>
            <Copy text="teal" />
          </td>
          <td>
            <Copy text="$teal" />
          </td>
          <td>
            <Copy text="#60fbd0" />
          </td>
        </tr>
        <tr>
          <td>
            <Color color="darkTeal" />
          </td>
          <td>
            <Copy text="darkTeal" />
          </td>
          <td>
            <Copy text="$darkTeal" />
          </td>
          <td>
            <Copy text="#34aa89" />
          </td>
        </tr>
        <tr>
          <td>
            <Color color="blue" />
          </td>
          <td>
            <Copy text="blue" />
          </td>
          <td>
            <Copy text="$blue" />
          </td>
          <td>
            <Copy text="#1e92e6" />
          </td>
        </tr>
        <tr>
          <td>
            <Color color="darkBlue" />
          </td>
          <td>
            <Copy text="darkBlue" />
          </td>
          <td>
            <Copy text="$darkBlue" />
          </td>
          <td>
            <Copy text="#1c6599" />
          </td>
        </tr>
        <tr>
          <td>
            <Color color="orange" />
          </td>
          <td>
            <Copy text="orange" />
          </td>
          <td>
            <Copy text="$orange" />
          </td>
          <td>
            <Copy text="#f57c00" />
          </td>
        </tr>
        <tr>
          <td>
            <Color color="darkOrange" />
          </td>
          <td>
            <Copy text="darkOrange" />
          </td>
          <td>
            <Copy text="$darkOrange" />
          </td>
          <td>
            <Copy text="#ff5722" />
          </td>
        </tr>
        <tr>
          <td>
            <Color color="red" />
          </td>
          <td>
            <Copy text="red" />
          </td>
          <td>
            <Copy text="$red" />
          </td>
          <td>
            <Copy text="#e53935" />
          </td>
        </tr>
        <tr>
          <td>
            <Color color="darkRed" />
          </td>
          <td>
            <Copy text="darkRed" />
          </td>
          <td>
            <Copy text="$darkRed" />
          </td>
          <td>
            <Copy text="#B71C1C" />
          </td>
        </tr>
      </tbody>
    </table>
    <h2 className="h2 color-grey mt-6">Greys</h2>
    <table className="table mt-4">
      <thead className="border">
        <tr>
          <th>Preview</th>
          <th>Modifer</th>
          <th>Variable</th>
          <th>HEX</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <Color color="grey" />
          </td>
          <td>
            <Copy text="grey" />
          </td>
          <td>
            <Copy text="$grey" />
          </td>
          <td>
            <Copy text="#71909F" />
          </td>
        </tr>
        <tr>
          <td>
            <Color color="lightGrey" />
          </td>
          <td>
            <Copy text="lightGrey" />
          </td>
          <td>
            <Copy text="$lightGrey" />
          </td>
          <td>
            <Copy text="#90a4ae" />
          </td>
        </tr>
        <tr>
          <td>
            <Color color="darkGrey" />
          </td>
          <td>
            <Copy text="darkGrey" />
          </td>
          <td>
            <Copy text="$darkGrey" />
          </td>
          <td>
            <Copy text="#22242f" />
          </td>
        </tr>
        <tr>
          <td>
            <Color color="black" />
          </td>
          <td>
            <Copy text="black" />
          </td>
          <td>
            <Copy text="$black" />
          </td>
          <td>
            <Copy text="#161721" />
          </td>
        </tr>
        <tr>
          <td>
            <Color color="deepBlack" />
          </td>
          <td>
            <Copy text="deepBlack" />
          </td>
          <td>
            <Copy text="$deepBlack" />
          </td>
          <td>
            <Copy text="#0c0a0f" />
          </td>
        </tr>
        <tr>
          <td>
            <Color color="white" />
          </td>
          <td>
            <Copy text="white" />
          </td>
          <td>
            <Copy text="$white" />
          </td>
          <td>
            <Copy text="#ffffff" />
          </td>
        </tr>
      </tbody>
    </table>
    <h3 className="h3 color-grey mt-6">Using Colors</h3>
    <p className="p">
      The color modifer can be used with the following class selectors:
    </p>
    <table className="table mt-4">
      <thead className="border">
        <tr>
          <th>Selector</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <code>
              color-<em>modifer</em>
            </code>
          </td>
          <td>Set color</td>
        </tr>
        <tr>
          <td>
            <code>
              hover-<em>modifer</em>
            </code>
          </td>
          <td>Set hover color</td>
        </tr>
        <tr>
          <td>
            <code>
              bg-<em>modifer</em>
            </code>
          </td>
          <td>Set background color</td>
        </tr>
        <tr>
          <td>
            <code>
              bg-hover-<em>modifer</em>
            </code>
          </td>
          <td>Set background hover color</td>
        </tr>
      </tbody>
    </table>
    <h3 className="fs-22 fw-400 mt-4">Example</h3>
    <div className="row wrap mt-2 example">
      <div className="col-12 col-lg-4 flex ai-c jc-c bg-primary5">
        <div className="p-2 br-1 bg-pink bg-hover-purple color-white hover-teal fs-14 fw-600">
          Hover
        </div>
      </div>
      <div className="col-12 col-lg-8">
        <Code
          language="html"
          code={`<div className="bg-pink bg-hover-purple color-white hover-teal">
  Hover
</div>`}
        />
      </div>
    </div>
    <hr className="hr mt-5 mb-4" />
  </>
);
