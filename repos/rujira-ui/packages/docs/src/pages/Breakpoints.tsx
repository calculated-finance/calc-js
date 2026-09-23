import { GitLabIcon } from "../components/GitLabIcon";

export const Breakpoints = () => (
  <>
    <h1 className="h1">Breakpoints</h1>
    <p className="flex ai-c p-1 br-1 bg-primary5 fs-12 fw-500">
      <GitLabIcon className="w-a h-2 block" />{" "}
      <a
        href="https://gitlab.com/thorchain/rujira.ui/-/blob/main/packages/rujira.ui/src/scss/base/_variables.scss?ref_type=heads#L51-57"
        className="color-grey hover-purple ml-1 block no-underline"
        target="_blank">
        https://gitlab.com/thorchain/rujira.ui/-/blob/main/packages/rujira.ui/src/scss/base/_variables.scss?ref_type=heads#L51-57
      </a>
    </p>
    <h3 className="fs-22 fw-400 mt-4 mb-2">
      Breakpoints are widths that determine how your responsive layout behaves
      across device or viewport sizes.
    </h3>
    <p className="p">
      There are 7 included breakpoints for building responsively and their class
      infix can be added to most helper class selectors in the form of{" "}
      <code>selector-infix-modifer</code> e.g. <code>fs-lg-20</code>.
    </p>
    <table className="table mt-4 table--lined">
      <thead className="border">
        <tr>
          <th>Breakpoint</th>
          <th>Infix</th>
          <th>Variable</th>
          <th>Dimensions</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Extra Small</td>
          <td>
            <code>xs</code>
          </td>
          <td>
            <code>$xs</code>
          </td>
          <td>&gt;=420px</td>
        </tr>
        <tr>
          <td>Small</td>
          <td>
            <code>sm</code>
          </td>
          <td>
            <code>$sm</code>
          </td>
          <td>&gt;=576px</td>
        </tr>
        <tr>
          <td>Medium</td>
          <td>
            <code>md</code>
          </td>
          <td>
            <code>$md</code>
          </td>
          <td>&gt;=768px</td>
        </tr>
        <tr>
          <td>Large</td>
          <td>
            <code>lg</code>
          </td>
          <td>
            <code>$lg</code>
          </td>
          <td>&gt;=1024px</td>
        </tr>
        <tr>
          <td>Extra Large</td>
          <td>
            <code>xl</code>
          </td>
          <td>
            <code>$xl</code>
          </td>
          <td>&gt;=1440px</td>
        </tr>
        <tr>
          <td>Extra Extra Large</td>
          <td>
            <code>xxl</code>
          </td>
          <td>
            <code>$xxl</code>
          </td>
          <td>&gt;=1680px</td>
        </tr>
        <tr>
          <td>HD</td>
          <td>
            <code>hd</code>
          </td>
          <td>
            <code>$hd</code>
          </td>
          <td>&gt;=1920px</td>
        </tr>
      </tbody>
    </table>
    <p className="p mt-4">
      The base size is set by omitting the breakpoint infix e.g.{" "}
      <code>mt-2</code>.
    </p>

    <hr className="hr mt-5 mb-4" />
  </>
);
