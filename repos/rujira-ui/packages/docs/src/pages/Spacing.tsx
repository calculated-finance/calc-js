import { Link } from "react-router-dom";
import { Code } from "../components/Code";
import { Copy } from "../components/Copy";
import { GitLabIcon } from "../components/GitLabIcon";

export const Spacing = () => (
  <>
    <h1 className="h1">Spacing</h1>
    <p className="flex ai-c p-1 br-1 bg-primary5 fs-12 fw-500">
      <GitLabIcon className="w-a h-2 block" />{" "}
      <a
        href="https://gitlab.com/thorchain/rujira.ui/-/blob/main/packages/rujira.ui/src/scss/base/_spacing.scss?ref_type=heads"
        className="color-grey hover-purple ml-1 block no-underline"
        target="_blank">
        https://gitlab.com/thorchain/rujira.ui/-/blob/main/packages/rujira.ui/src/scss/base/_spacing.scss?ref_type=heads
      </a>
    </p>
    <h2 className="h2 color-grey mt-4">Default Spacing Scale</h2>
    <p className="p">
      Rujira.ui includes a comprehensive numeric spacing scale. The values are
      proportional from <code>0 to 150</code>, with <code>1</code> spacing unit
      being equal to <code>0.5rem</code> or <code>8px</code>, and with{" "}
      <code>.5</code> incremental steps.
    </p>

    <h3 className="h3 color-grey mt-4 mb-2">Sizing Modifers</h3>
    <table className="table mt-4 table--lined">
      <thead className="border">
        <tr>
          <th>Modifier</th>
          <th className="text-right">Value</th>
          <th className="text-right">Pixel</th>
        </tr>
      </thead>
      <tbody>
        {[...Array(10).keys()].map((i) => (
          <tr key={`fw-${i}`}>
            <td>
              <code>{i * 0.5}</code>
            </td>
            <td className="text-right">{i / 4}rem</td>
            <td className="text-right">{i * 4}px</td>
          </tr>
        ))}
        <tr>
          <td>...</td>
          <td className="text-right">...</td>
          <td className="text-right">...</td>
        </tr>
        <tr>
          <td>
            <code>150</code>
          </td>
          <td className="text-right">75rem</td>
          <td className="text-right">1200px</td>
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
      can be added to the selector and modifer in the form of
      <br />
      <code>
        selector<em>-infix</em>-modifer
      </code>
      , e.g. <code>mt-lg-20</code>.{" "}
    </p>

    <h2 className="h2 color-grey mt-4">Margin</h2>
    <h3 className="h3 color-grey mb-2">Selectors</h3>
    <table className="table mt-4">
      <thead className="border">
        <tr>
          <th>Selector</th>
          <th>Description</th>
        </tr>
        <tr>
          <td>
            <Copy text="m" />
          </td>
          <td>
            <Code language="css" code={`margin: ...;`} />
          </td>
        </tr>
        <tr>
          <td>
            <Copy text="mt" />
          </td>
          <td>
            <Code language="css" code={`margin-top: ...;`} />
          </td>
        </tr>
        <tr>
          <td>
            <Copy text="mr" />
          </td>
          <td>
            <Code language="css" code={`margin-right: ...;`} />
          </td>
        </tr>
        <tr>
          <td>
            <Copy text="mb" />
          </td>
          <td>
            <Code language="css" code={`margin-bottom: ...;`} />
          </td>
        </tr>
        <tr>
          <td>
            <Copy text="ml" />
          </td>
          <td>
            <Code language="css" code={`margin-left: ...;`} />
          </td>
        </tr>
        <tr>
          <td>
            <Copy text="my" />
          </td>
          <td>
            <Code
              language="css"
              code={`margin-top: ...;
margin-bottom: ...;`}
            />
          </td>
        </tr>
        <tr>
          <td>
            <Copy text="mx" />
          </td>
          <td>
            <Code
              language="css"
              code={`margin-left: ...;
margin-right: ...;`}
            />
          </td>
        </tr>
      </thead>
    </table>

    <h4 className="h4 color-grey mb-2 mt-4">Examples</h4>
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
              m-<em>0..150</em>
            </code>
          </td>
          <td>
            <code>m-1</code>
          </td>
          <td>
            <Code language="css" code={`margin: 0.5rem;`} />
          </td>
        </tr>
        <tr>
          <td>
            <code>
              mx-<em>0..150</em>
            </code>
          </td>
          <td>
            <code>mx-1.5</code>
          </td>
          <td>
            <Code
              language="css"
              code={`margin-left: 0.75rem;
margin-right: 0.75rem;`}
            />
          </td>
        </tr>
        <tr>
          <td>
            <code>
              ml-<em>0..150</em>
            </code>
          </td>
          <td>
            <code>ml-2</code>
          </td>
          <td>
            <Code language="css" code={`margin-left: 1rem;`} />
          </td>
        </tr>
        <tr>
          <td>
            <code>
              mr-<em>0..150</em>
            </code>
          </td>
          <td>
            <code>mr-2.5</code>
          </td>
          <td>
            <Code language="css" code={`margin-right: 1.25rem;`} />
          </td>
        </tr>
        <tr>
          <td>
            <code>
              my-<em>0..150</em>
            </code>
          </td>
          <td>
            <code>my-3</code>
          </td>
          <td>
            <Code
              language="css"
              code={`margin-top: 1.5rem;
margin-bottom: 1.5rem;`}
            />
          </td>
        </tr>
        <tr>
          <td>
            <code>
              mt-<em>0..150</em>
            </code>
          </td>
          <td>
            <code>mt-3.5</code>
          </td>
          <td>
            <Code language="css" code={`margin-top: 1.75rem;`} />
          </td>
        </tr>
        <tr>
          <td>
            <code>
              mb-<em>0..150</em>
            </code>
          </td>
          <td>
            <code>mb-4</code>
          </td>
          <td>
            <Code language="css" code={`margin-bottom: 2rem;`} />
          </td>
        </tr>
        <tr>
          <td>
            <code>mt-a</code>
          </td>
          <td>-</td>
          <td>
            <Code language="css" code={`margin-top: auto;`} />
          </td>
        </tr>
        <tr>
          <td>
            <code>mr-a</code>
          </td>
          <td>-</td>
          <td>
            <Code language="css" code={`margin-right: auto;`} />
          </td>
        </tr>
        <tr>
          <td>
            <code>mb-a</code>
          </td>
          <td>-</td>
          <td>
            <Code language="css" code={`margin-bottom: auto;`} />
          </td>
        </tr>
        <tr>
          <td>
            <code>ml-a</code>
          </td>
          <td>-</td>
          <td>
            <Code language="css" code={`margin-left: auto;`} />
          </td>
        </tr>
        <tr>
          <td>
            <code>mx-a</code>
          </td>
          <td>-</td>
          <td>
            <Code
              language="css"
              code={`margin-left: auto;
margin-right: auto;`}
            />
          </td>
        </tr>
        <tr>
          <td>
            <code>my-a</code>
          </td>
          <td>-</td>
          <td>
            <Code
              language="css"
              code={`margin-top: auto;
margin-bottom: auto;`}
            />
          </td>
        </tr>
      </tbody>
    </table>

    <h4 className="h4 color-grey mb-2 mt-4">Putting it together</h4>
    <table className="table mt-4">
      <thead className="border">
        <tr>
          <th>Selectors</th>
          <th>Compiled CSS</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <Code
              language="ts"
              code={`className="ml-a mr-0 mt-1 mt-md-2.5 mt-lg-4"`}
            />
            {/* <Copy text="ml-a mt-0 mt-md-2.5 mt-lg-4" /> */}
          </td>
          <td>
            <Code
              language="css"
              code={`margin-left: auto;
margin-right: 0rem;
margin-top: 1rem;

@media only screen and (min-width: 768px) {
  margin-top: 1.25rem;
}

@media only screen and (min-width: 1024px) {
  margin-top: 2rem;
}`}
            />
          </td>
        </tr>
      </tbody>
    </table>

    <h2 className="h2 color-grey mt-6">Padding</h2>
    <h3 className="h3 color-grey mb-2">Selectors</h3>
    <table className="table mt-4">
      <thead className="border">
        <tr>
          <th>Selector</th>
          <th>Description</th>
        </tr>
        <tr>
          <td>
            <Copy text="p" />
          </td>
          <td>
            <Code language="css" code={`padding: ...;`} />
          </td>
        </tr>
        <tr>
          <td>
            <Copy text="pt" />
          </td>
          <td>
            <Code language="css" code={`padding-top: ...;`} />
          </td>
        </tr>
        <tr>
          <td>
            <Copy text="pr" />
          </td>
          <td>
            <Code language="css" code={`padding-right: ...;`} />
          </td>
        </tr>
        <tr>
          <td>
            <Copy text="pb" />
          </td>
          <td>
            <Code language="css" code={`padding-bottom: ...;`} />
          </td>
        </tr>
        <tr>
          <td>
            <Copy text="pl" />
          </td>
          <td>
            <Code language="css" code={`padding-left: ...;`} />
          </td>
        </tr>
        <tr>
          <td>
            <Copy text="py" />
          </td>
          <td>
            <Code
              language="css"
              code={`padding-top: ...;
padding-bottom: ...;`}
            />
          </td>
        </tr>
        <tr>
          <td>
            <Copy text="px" />
          </td>
          <td>
            <Code
              language="css"
              code={`padding-left: ...;
padding-right: ...;`}
            />
          </td>
        </tr>
      </thead>
    </table>

    <h4 className="h4 color-grey mb-2 mt-4">Examples</h4>
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
              p-<em>0..150</em>
            </code>
          </td>
          <td>
            <code>p-1</code>
          </td>
          <td>
            <Code language="css" code={`padding: 0.5rem;`} />
          </td>
        </tr>
        <tr>
          <td>
            <code>
              px-<em>0..150</em>
            </code>
          </td>
          <td>
            <code>px-1.5</code>
          </td>
          <td>
            <Code
              language="css"
              code={`padding-left: 0.75rem;
padding-right: 0.75rem;`}
            />
          </td>
        </tr>
        <tr>
          <td>
            <code>
              pl-<em>0..150</em>
            </code>
          </td>
          <td>
            <code>pl-2</code>
          </td>
          <td>
            <Code language="css" code={`padding-left: 1rem;`} />
          </td>
        </tr>
        <tr>
          <td>
            <code>
              pr-<em>0..150</em>
            </code>
          </td>
          <td>
            <code>pr-2.5</code>
          </td>
          <td>
            <Code language="css" code={`padding-right: 1.25rem;`} />
          </td>
        </tr>
        <tr>
          <td>
            <code>
              py-<em>0..150</em>
            </code>
          </td>
          <td>
            <code>py-3</code>
          </td>
          <td>
            <Code
              language="css"
              code={`padding-top: 1.5rem;
padding-bottom: 1.5rem;`}
            />
          </td>
        </tr>
        <tr>
          <td>
            <code>
              pt-<em>0..150</em>
            </code>
          </td>
          <td>
            <code>pt-3.5</code>
          </td>
          <td>
            <Code language="css" code={`padding-top: 1.75rem;`} />
          </td>
        </tr>
        <tr>
          <td>
            <code>
              pb-<em>0..150</em>
            </code>
          </td>
          <td>
            <code>pb-4</code>
          </td>
          <td>
            <Code language="css" code={`padding-bottom: 2rem;`} />
          </td>
        </tr>
        <tr>
          <td>
            <code>pt-a</code>
          </td>
          <td>-</td>
          <td>
            <Code language="css" code={`padding-top: auto;`} />
          </td>
        </tr>
        <tr>
          <td>
            <code>pr-a</code>
          </td>
          <td>-</td>
          <td>
            <Code language="css" code={`padding-right: auto;`} />
          </td>
        </tr>
        <tr>
          <td>
            <code>pb-a</code>
          </td>
          <td>-</td>
          <td>
            <Code language="css" code={`padding-bottom: auto;`} />
          </td>
        </tr>
        <tr>
          <td>
            <code>pl-a</code>
          </td>
          <td>-</td>
          <td>
            <Code language="css" code={`padding-left: auto;`} />
          </td>
        </tr>
        <tr>
          <td>
            <code>px-a</code>
          </td>
          <td>-</td>
          <td>
            <Code
              language="css"
              code={`padding-left: auto;
padding-right: auto;`}
            />
          </td>
        </tr>
        <tr>
          <td>
            <code>py-a</code>
          </td>
          <td>-</td>
          <td>
            <Code
              language="css"
              code={`padding-top: auto;
padding-bottom: auto;`}
            />
          </td>
        </tr>
      </tbody>
    </table>

    <h4 className="h4 color-grey mb-2 mt-4">Putting it together</h4>
    <table className="table mt-4">
      <thead className="border">
        <tr>
          <th>Selectors</th>
          <th>Compiled CSS</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <Code
              language="ts"
              code={`className="px-2 py-1.5 px-lg-3 py-lg-2"`}
            />
          </td>
          <td>
            <Code
              language="css"
              code={`padding-left: 1rem;
padding-right: 1rem;
padding-top: 0.75rem;
padding-bottom: 0.75rem;

@media only screen and (min-width: 1024px) {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
}`}
            />
          </td>
        </tr>
      </tbody>
    </table>
    <hr className="hr mt-5 mb-4" />
  </>
);
