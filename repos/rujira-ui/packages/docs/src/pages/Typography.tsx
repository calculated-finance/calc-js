import { Link } from "react-router-dom";
import { Code } from "../components/Code";
import { GitLabIcon } from "../components/GitLabIcon";
import { FigmaIcon } from "../components/FigmaIcon";

export const Typography = () => (
  <>
    <h1 className="h1">Typography</h1>
    <p className="flex ai-c p-1 br-1 bg-primary5 fs-12 fw-500">
      <GitLabIcon className="w-3 h-2 block" />{" "}
      <a
        href="https://gitlab.com/thorchain/rujira.ui/-/blob/main/packages/rujira.ui/src/scss/base/_typography.scss?ref_type=heads"
        className="color-grey hover-purple ml-1 block no-underline"
        target="_blank">
        https://gitlab.com/thorchain/rujira.ui/-/blob/main/packages/rujira.ui/src/scss/base/_typography.scss?ref_type=heads
      </a>
    </p>
    <p className="flex ai-c p-1 br-1 bg-primary5 fs-12 fw-500 mt-1">
      <FigmaIcon className="w-3 h-2 block" />{" "}
      <a
        href="https://www.figma.com/design/P5jeTCJw6Tc0CoX2pBUmsd/Rujira.ui?node-id=0-1&t=j2ZuRHEHecjWX4di-1"
        className="color-grey hover-purple ml-1 block no-underline"
        target="_blank">
        https://www.figma.com/design/P5jeTCJw6Tc0CoX2pBUmsd/Rujira.ui?node-id=0-1&t=j2ZuRHEHecjWX4di-1
      </a>
    </p>

    <p className="p mt-4">
      The following typefaces are preloaded, add the class selector to you
      element to set the font.
    </p>
    <table className="table mt-4">
      <thead className="border">
        <tr>
          <th>Font</th>
          <th>Selector</th>
          <th>font-family</th>
          <th>Weights</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="montserrat fs-22 fw-400">Montserrat</td>
          <td>
            <code>montserrat</code>
          </td>
          <td>
            <code>"Montserrat", Verdana, sans-serif;</code>
          </td>
          <td>Variable 100-900</td>
        </tr>
        <tr>
          <td className="condensed fs-22 fw-400">Barlow Semi Condensed</td>
          <td>
            <code>condensed</code>
          </td>
          <td>
            <code>"Barlow Semi Condensed", Verdana, sans-serif;</code>
          </td>
          <td>300, 400, 500</td>
        </tr>
        <tr>
          <td className="mono fs-22 fw-400">Mono</td>
          <td>
            <code>mono</code>
          </td>
          <td>
            <code>"mono", monospace;</code>
          </td>
          <td>400</td>
        </tr>
        <tr>
          <td className="inconsolata fs-22 fw-400">Inconsolata</td>
          <td>
            <code>inconsolata</code>
          </td>
          <td>
            <code>"inconsolata", monospace;</code>
          </td>
          <td>Variable 200-900</td>
        </tr>
      </tbody>
    </table>

    <h2 className="h2 color-grey mt-6">Preset Selectors</h2>
    <table className="table mt-4">
      <thead className="border">
        <tr>
          <th>Preview</th>
          <th>Selector</th>
          <th>Corresponding Sass</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="h1">Header 1</td>
          <td>
            <code>h1</code>
          </td>
          <td>
            <Code
              language="css"
              code={`.h1 {
  font-size: 3rem;
  line-height: 3.75rem;
  font-weight: 300;

  @media screen and (min-width: $xsmall) {
    font-size: 3.75rem;
    line-height: 5rem;
  }
}`}
            />
          </td>
        </tr>
        <tr>
          <td className="h2">Header 2</td>
          <td>
            <code>h2</code>
          </td>
          <td>
            <Code
              language="css"
              code={`.h2 {
  font-size: 2.2857142857142856rem;
  line-height: 3rem;
  font-weight: 400;

  @media screen and (min-width: $xsmall) {
    font-size: 3rem;
    line-height: 3.75rem;
  }
}`}
            />
          </td>
        </tr>
        <tr>
          <td className="h3">Header 3</td>
          <td>
            <code>h3</code>
          </td>
          <td>
            <Code
              language="css"
              code={`.h3 {
  font-size: 1.5rem;
  line-height: 2rem;
  font-weight: 400;

  @media screen and (min-width: $xsmall) {
    font-size: 2.25rem;
    line-height: 3rem;
  }
}`}
            />
          </td>
        </tr>
        <tr>
          <td className="h4">Header 4</td>
          <td>
            <code>h4</code>
          </td>
          <td>
            <Code
              language="css"
              code={`.h4 {
  font-size: 1.25rem;
  line-height: 1.75rem;
  font-weight: 600;
}`}
            />
          </td>
        </tr>
        <tr>
          <td className="h5">Header 5</td>
          <td>
            <code>h5</code>
          </td>
          <td>
            <Code
              language="css"
              code={`.h5 {
  font-size: 1.125rem;
  line-height: 1.25rem;
  font-weight: 600;
}`}
            />
          </td>
        </tr>
        <tr>
          <td className="p">Paragraph</td>
          <td>
            <code>p</code>
          </td>
          <td>
            <Code
              language="css"
              code={`.p {
  font-size: 1rem;
  line-height: 1.5rem;
}`}
            />
          </td>
        </tr>
      </tbody>
    </table>

    <h2 className="h2 color-grey mt-6">Font Styling</h2>
    <h3 className="h3 color-grey mt-2 mb-2">Size</h3>
    <p className="p">
      The font size modifer is a linear integer range of <code>0 - 64</code>{" "}
      referencing a pixel value translated to <code>rem</code>, where{" "}
      <code>16px</code> = <code>1rem</code>.
    </p>
    <p className="p mt-4">
      An optional{" "}
      <Link
        className="color-pink hover-purple no-underline fw-500"
        to="/breakpoints">
        breakpoint infix
      </Link>{" "}
      can be added to the selector and modifer in the form of
      <br />
      <code>
        selector<em>-infix</em>-modifer
      </code>
      .
    </p>
    <table className="table mt-4">
      <thead className="border">
        <tr>
          <th>Selector</th>
          <th>Example</th>
          <th>Corresponding Sass</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <code>
              fs-<em>10..64</em>
            </code>
          </td>
          <td>
            <code>fs-18</code>
          </td>
          <td>
            <Code language="css" code={`font-size: math.div(18, 16) * 1rem;`} />
          </td>
        </tr>
        <tr>
          <td>
            <code>
              fs-md-<em>10..64</em>
            </code>
          </td>
          <td>
            <code>fs-md-20</code>
          </td>
          <td>
            <Code
              language="css"
              code={`@media only screen and (min-width: $medium) {\n  font-size: math.div(20, 16) * 1rem;\n}`}
            />
          </td>
        </tr>
      </tbody>
    </table>

    <h3 className="h3 color-grey mt-4 mb-2">Line Height</h3>
    <p className="p">
      The line height modifer is a linear integer range of <code>0 - 64</code>{" "}
      referencing a pixel value translated to <code>rem</code>, where{" "}
      <code>16px</code> = <code>1rem</code>.
    </p>
    <p className="p mt-4">
      An optional{" "}
      <Link
        className="color-pink hover-purple no-underline fw-500"
        to="/breakpoints">
        breakpoint infix
      </Link>{" "}
      can be added to the selector and modifer in the form of
      <br />
      <code>
        selector<em>-infix</em>-modifer
      </code>
      .
    </p>
    <table className="table mt-4">
      <thead className="border">
        <tr>
          <th>Selector</th>
          <th>Example</th>
          <th>Corresponding Sass</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <code>
              lh-<em>10..64</em>
            </code>
          </td>
          <td>
            <code>lh-22</code>
          </td>
          <td>
            <Code
              language="css"
              code={`line-height: math.div(18, 16) * 1rem;`}
            />
          </td>
        </tr>
        <tr>
          <td>
            <code>
              lh-lg-<em>10..64</em>
            </code>
          </td>
          <td>
            <code>lh-lg-22</code>
          </td>
          <td>
            <Code
              language="css"
              code={`@media only screen and (min-width: $large) {\n  line-height: math.div(20, 16) * 1rem;\n}`}
            />
          </td>
        </tr>
      </tbody>
    </table>

    <h3 className="h3 color-grey mt-4 mb-2">Font Weight</h3>
    <p className="p">Set font weight with the class selectors and modifers:</p>
    <table className="table mt-4">
      <thead className="border">
        <tr>
          <th>Selector</th>
          <th>Corresponding Sass</th>
        </tr>
      </thead>
      <tbody>
        {[...Array(9).keys()].map((i) => (
          <tr key={`fw-${i}`}>
            <td>
              <code>fw-{(i + 1) * 100}</code>
              {i === 4 && <code className="ml-1">.condensed.strong</code>}
              {i === 5 && <code className="ml-1">.strong</code>}
            </td>
            <td>
              <Code language="css" code={`font-weight: ${(i + 1) * 100};`} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    <h3 className="h3 color-grey mt-4 mb-2">Alignment</h3>
    <p className="p">
      Align text with the <code>text</code> selector and modifers{" "}
      <code>left</code>, <code>center</code> and <code>right</code>.
    </p>
    <p className="p mt-4">
      An optional{" "}
      <Link
        className="color-pink hover-purple no-underline fw-500"
        to="/breakpoints">
        breakpoint infix
      </Link>{" "}
      can be added to the selector and modifer in the form of
      <br />
      <code>
        selector<em>-infix</em>-modifer
      </code>
      .
    </p>
    <table className="table mt-4">
      <thead className="border">
        <tr>
          <th>Selector</th>
          <th>Example</th>
          <th>Compiled CSS</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <code>
              text-<em>left|center|right</em>
            </code>
          </td>
          <td>
            <code>text-center</code>
          </td>
          <td>
            <Code language="css" code={`text-align: center;`} />
          </td>
        </tr>
        <tr>
          <td>
            <code>
              text-xl-<em>left|center|right</em>
            </code>
          </td>
          <td>
            <code>text-xl-right</code>
          </td>
          <td>
            <Code
              language="css"
              code={`@media only screen and (min-width: -xl) {\n  text-align: right;\n}`}
            />
          </td>
        </tr>
      </tbody>
    </table>

    <h3 className="h3 color-grey mt-4 mb-2">Helpers</h3>
    <table className="table mt-4">
      <thead className="border">
        <tr>
          <th>Selector</th>
          <th>Compiled CSS</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <code>no-underline</code>
          </td>
          <td>
            <Code
              language="css"
              code={`text-decoration: none;
a {
  text-decoration: none;
}`}
            />
          </td>
        </tr>
        <tr>
          <td>
            <code>titlecase</code>
          </td>
          <td>
            <Code language="css" code={`text-transform: capitalize;`} />
          </td>
        </tr>
        <tr>
          <td>
            <code>breakall</code>
          </td>
          <td>
            <Code language="css" code={`word-break: break-all;`} />
          </td>
        </tr>
        <tr>
          <td>
            <code>uppercase</code>
          </td>
          <td>
            <Code language="css" code={`text-transform: uppercase;`} />
          </td>
        </tr>
        <tr>
          <td>
            <code>lowercase</code>
          </td>
          <td>
            <Code language="css" code={`text-transform: lowercase;`} />
          </td>
        </tr>
        <tr>
          <td>
            <code>capitalize</code>
          </td>
          <td>
            <Code language="css" code={`text-transform: capitalize;`} />
          </td>
        </tr>
      </tbody>
    </table>

    <hr className="hr mt-5 mb-4" />
  </>
);
