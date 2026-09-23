import { Link } from "react-router-dom";
import { Code } from "../components/Code";
import { GitLabIcon } from "../components/GitLabIcon";

export const Flexbox = () => (
  <>
    <h1 className="h1">Flexbox</h1>
    <p className="flex ai-c p-1 br-1 bg-primary5 fs-12 fw-500">
      <GitLabIcon className="w-a h-2 block" />{" "}
      <a
        href="https://gitlab.com/thorchain/rujira.ui/-/blob/main/packages/rujira.ui/src/scss/base/_flex.scss?ref_type=heads"
        className="color-grey hover-purple ml-1 block no-underline"
        target="_blank">
        https://gitlab.com/thorchain/rujira.ui/-/blob/main/packages/rujira.ui/src/scss/base/_flex.scss?ref_type=heads
      </a>
    </p>
    <h2 className="h2 color-grey mt-6 mb-2">Container</h2>
    <h3 className="h3 color-grey mt-4 mb-2">Selectors</h3>
    <table className="table">
      <thead className="border">
        <tr>
          <th>Selector</th>
          <th>Corresponsding Sass</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <code>flex</code>
            <code className="ml-1">row</code>
          </td>
          <td>
            <Code language="css" code={`display: flex;`} />
          </td>
        </tr>
        <tr>
          <td>
            <code>iflex</code>
          </td>
          <td>
            <Code language="css" code={`display: inline-flex;`} />
          </td>
        </tr>
        <tr>
          <td>
            <code>grid</code>
          </td>
          <td>
            <Code language="css" code={`display: grid;`} />
          </td>
        </tr>
      </tbody>
    </table>

    <h4 className="h4 color-grey mt-4 mb-2">Wrapping</h4>
    <table className="table">
      <tbody>
        <tr>
          <td>
            <code>wrap</code>
          </td>
          <td>
            <Code language="css" code={`flex-wrap: wrap;`} />
          </td>
        </tr>
      </tbody>
    </table>

    <h3 className="h3 color-grey mt-4 mb-2">Modifers</h3>
    <p className="p mt-4">
      An optional{" "}
      <Link
        className="color-pink hover-purple no-underline fw-500"
        to="/breakpoints">
        breakpoint infix
      </Link>{" "}
      can be added to the modifers in the form of
      <br />
      <code>
        selector<em>-infix</em>-modifer
      </code>
      , e.g. <code>ai-lg-c</code>.{" "}
    </p>

    <h4 className="h4 color-grey mt-4 mb-2">Direction</h4>
    <table className="table">
      <tbody>
        <tr>
          <td>
            <code>dir-r</code>
          </td>
          <td>
            <Code language="css" code={`flex-direction: row;`} />
          </td>
        </tr>
        <tr>
          <td>
            <code>dir-c</code>
          </td>
          <td>
            <Code language="css" code={`flex-direction: column;`} />
          </td>
        </tr>
      </tbody>
    </table>

    <h4 className="h4 color-grey mt-4 mb-2">Alignment</h4>
    <table className="table">
      <tbody>
        <tr>
          <td>
            <code>ai-s</code>
          </td>
          <td>
            <Code language="css" code={`align-items: flex-start;`} />
          </td>
        </tr>
        <tr>
          <td>
            <code>ai-c</code>
          </td>
          <td>
            <Code language="css" code={`align-items: center;`} />
          </td>
        </tr>
        <tr>
          <td>
            <code>ai-e</code>
          </td>
          <td>
            <Code language="css" code={`align-items: flex-end;`} />
          </td>
        </tr>
        <tr>
          <td>
            <code>ac-s</code>
          </td>
          <td>
            <Code language="css" code={`align-content: flex-start;`} />
          </td>
        </tr>
        <tr>
          <td>
            <code>ac-c</code>
          </td>
          <td>
            <Code language="css" code={`align-content: center;`} />
          </td>
        </tr>
        <tr>
          <td>
            <code>ac-e</code>
          </td>
          <td>
            <Code language="css" code={`align-content: flex-end;`} />
          </td>
        </tr>
      </tbody>
    </table>

    <h4 className="h4 color-grey mt-4 mb-2">Justification</h4>
    <table className="table">
      <tbody>
        <tr>
          <td>
            <code>ji-s</code>
          </td>
          <td>
            <Code language="css" code={`justify-items: flex-start;`} />
          </td>
        </tr>
        <tr>
          <td>
            <code>ji-c</code>
          </td>
          <td>
            <Code language="css" code={`justify-items: center;`} />
          </td>
        </tr>
        <tr>
          <td>
            <code>ji-e</code>
          </td>
          <td>
            <Code language="css" code={`justify-items: flex-end;`} />
          </td>
        </tr>
        <tr>
          <td>
            <code>jc-s</code>
          </td>
          <td>
            <Code language="css" code={`justify-content: flex-start;`} />
          </td>
        </tr>
        <tr>
          <td>
            <code>jc-c</code>
          </td>
          <td>
            <Code language="css" code={`justify-content: center;`} />
          </td>
        </tr>
        <tr>
          <td>
            <code>jc-e</code>
          </td>
          <td>
            <Code language="css" code={`justify-content: flex-end;`} />
          </td>
        </tr>
      </tbody>
    </table>

    <h2 className="h2 color-grey mt-6 mb-2">Children</h2>

    <table className="table">
      <tbody>
        <tr>
          <td>
            <code>no-shrink</code>
          </td>
          <td>
            <Code language="css" code={`flex-shrink: 0;`} />
          </td>
        </tr>
        <tr>
          <td>
            <code>grow</code>
          </td>
          <td>
            <Code language="css" code={`flex-grow: 1;`} />
          </td>
        </tr>
        <tr>
          <td>
            <code>expand</code>
          </td>
          <td>
            <Code language="css" code={`flex: 1;`} />
          </td>
        </tr>
      </tbody>
    </table>

    <p className="p mt-4">
      An optional{" "}
      <Link
        className="color-pink hover-purple no-underline fw-500"
        to="/breakpoints">
        breakpoint infix
      </Link>{" "}
      can be added to the modifers in the form of
      <br />
      <code>
        selector<em>-infix</em>-modifer
      </code>
      , e.g. <code>as-lg-c</code>.{" "}
    </p>

    <h4 className="h4 color-grey mt-4 mb-2">Alignment</h4>
    <table className="table">
      <tbody>
        <tr>
          <td>
            <code>as-s</code>
          </td>
          <td>
            <Code language="css" code={`align-self: flex-start;`} />
          </td>
        </tr>
        <tr>
          <td>
            <code>as-c</code>
          </td>
          <td>
            <Code language="css" code={`align-self: center;`} />
          </td>
        </tr>
        <tr>
          <td>
            <code>as-e</code>
          </td>
          <td>
            <Code language="css" code={`align-self: flex-end;`} />
          </td>
        </tr>
        <tr>
          <td>
            <code>al</code>
          </td>
          <td>
            <Code
              language="css"
              code={`margin-left: 0;
margin-right: auto;`}
            />
          </td>
        </tr>
        <tr>
          <td>
            <code>ar</code>
          </td>
          <td>
            <Code
              language="css"
              code={`margin-left: auto;
margin-right: 0;`}
            />
          </td>
        </tr>
      </tbody>
    </table>

    <h3 className="h3 color-grey mt-4 mb-2">Example</h3>
    <div className="row wrap mt-2 example example--with-controls">
      <div className="col-12 flex ai-c jc-c bg-primary5 p-4 gradient-card-container">
        <div className="grid ai-c w-full b-grey p-2">
          <div className="bg-primary1 w-7 h-5"></div>
          <div className="as-e js-e bg-primary2 w-7 h-5"></div>
        </div>
      </div>
      <div className="col-12">
        <Code
          language="tsx"
          code={`import "rujira.ui/scss/index.scss";

<div className="grid ai-c">
  <div></div>
  <div className="as-e js-e"></div>
</div>`}
        />
      </div>
    </div>

    <h2 className="h2 color-grey mt-6 mb-2">Columns</h2>
    <p className="p">
      The Flexbox system uses rows and columns to layout and align content. It's
      built with flexbox and is fully responsive.
    </p>

    <div className="row wrap mt-2 example example--with-controls">
      <div className="col-12 flex ai-c jc-c bg-primary5 p-4 gradient-card-container">
        <div className="row w-full">
          <div className="col b-primary5 bg-lightGrey p-2">
            <p className="mono">.col</p>
          </div>
          <div className="col b-primary5 bg-lightGrey p-2">
            <p className="mono">.col</p>
          </div>
          <div className="col b-primary5 bg-lightGrey p-2">
            <p className="mono">.col</p>
          </div>
        </div>
      </div>
      <div className="col-12">
        <Code
          language="tsx"
          code={`import "rujira.ui/scss/index.scss";

<div className="row">
  <div className="col">.col</div>
  <div className="col">.col</div>
  <div className="col">.col</div>
</div>`}
        />
      </div>
    </div>

    <h3 className="h3 color-grey mt-6 mb-2">12 Column System</h3>
    <p className="p">
      <strong>This section is incomplete...</strong>
    </p>

    <hr className="hr mt-5 mb-4" />
  </>
);
