import { Code } from "../components/Code";

export const Styledcomponents = () => (
  <>
    <h1 className="h1">Styled Components</h1>
    <h3 className="fs-18 lh-24 fw-400 mt-4 mb-2">
      Styled components do not form part of a React Component but are a set of
      CSS class selectors and mofiders that can be applied to an HTML container
      element for consistent styling.
    </h3>
    <p className="p">The Rujira.ui SCSS must be imported into your project.</p>
    <Code language="tsx" code={`import "rujira.ui/scss/index.scss";`} />
  </>
);
