import { Code } from "../components/Code";
import { GitLabIcon } from "../components/GitLabIcon";

export const UseWindowSize = () => (
  <>
    <h1 className="h1">useWindowSize</h1>
    <Code language="tsx" code={`import { useWindowSize } from "rujira.ui";`} />
    <p className="flex ai-c p-1 br-1 bg-primary5 fs-12 fw-500 mt-2">
      <GitLabIcon className="w-3 h-2 block" />{" "}
      <a
        href="https://gitlab.com/thorchain/rujira.ui/-/blob/main/packages/rujira.ui/src/hooks/useWindowSize.ts?ref_type=heads"
        className="color-grey hover-purple ml-1 block no-underline"
        target="_blank">
        https://gitlab.com/thorchain/rujira.ui/-/blob/main/packages/rujira.ui/src/hooks/useWindowSize.ts?ref_type=heads
      </a>
    </p>
    <h3 className="h3 color-grey mt-4 mb-2">Reference</h3>
    <p className="p mt-2">
      Returns <code>window.outerWidth</code> and <code>window.outerHeight</code>{" "}
      as <code>{`{width, height}`}</code> on render and window resize.
    </p>
    <Code
      language="ts"
      code={`const size = useWindowSize();
// or
const {width, height} = useWindowSize();`}
    />
  </>
);
