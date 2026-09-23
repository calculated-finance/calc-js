import { Code } from "../components/Code";
import { GitLabIcon } from "../components/GitLabIcon";

export const Installation = () => (
  <>
    <h1 className="h1">Gettin Started</h1>
    <h2 className="h2 color-grey">Installation</h2>
    <h3 className="h3 color-grey mt-4 mb-2">As part of the monorepo</h3>
    <p className="p">
      Rujira.ui is included as part of the <strong>Rujira monorepo</strong> and
      does not need to be installed before use.
    </p>
    <h3 className="h3 color-grey mt-4 mb-2">As an external class</h3>
    <p className="p">
      Rujira.ui requires React 18. This module is distributed via npm which is
      bundled with node and should be installed as one of your project's{" "}
      <code>dependencies</code>:
    </p>
    <Code
      language="cpp"
      code={`# npm\nnpm install --save rujira.ui\n\n# yarn\nadd rujira.ui\n\n# pnpm\npnpm i rujira.ui`}
    />
    <p className="flex ai-c p-1 br-1 bg-primary5 fs-12 fw-500 mt-4">
      <GitLabIcon className="w-a h-2 block" />{" "}
      <a
        href="https://gitlab.com/thorchain/rujira.ui/-/tree/main/packages/ui?ref_type=heads"
        className="color-grey hover-purple ml-1 block no-underline"
        target="_blank">
        https://gitlab.com/thorchain/rujira.ui/-/tree/main/packages/ui?ref_type=heads
      </a>
    </p>
    <hr className="hr mt-5 mb-4" />
  </>
);
