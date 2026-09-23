import { Code } from "../components/Code";
import { GitLabIcon } from "../components/GitLabIcon";

export const UseQueryParam = () => (
  <>
    <h1 className="h1">useQueryParam</h1>
    <Code language="tsx" code={`import { useQueryParam } from "rujira.ui";`} />
    <p className="flex ai-c p-1 br-1 bg-primary5 fs-12 fw-500 mt-2">
      <GitLabIcon className="w-3 h-2 block" />{" "}
      <a
        href="https://gitlab.com/thorchain/rujira.ui/-/blob/main/packages/rujira.ui/src/hooks/useQueryParam.ts?ref_type=heads"
        className="color-grey hover-purple ml-1 block no-underline"
        target="_blank">
        https://gitlab.com/thorchain/rujira.ui/-/blob/main/packages/rujira.ui/src/hooks/useQueryParam.ts?ref_type=heads
      </a>
    </p>
    <h3 className="h3 color-grey mt-4 mb-2">Reference</h3>
    <code className="fs-16">{`useQueryParam<type>(parameter, initialState)`}</code>
    <p className="p mt-2">Reads and writes a query parameter to the URL.</p>
    <Code
      language="ts"
      code={`const [page, setPage] = useQueryParam<string>("page", "1");`}
    />
    <p className="p mt-2">
      The convention is to name state variables like{" "}
      <code>[something, setSomething]</code> using array destructuring.
    </p>

    <h2 className="h2 color-grey mt-6">useQueryParams</h2>
    <h3 className="h3 color-grey mt-4 mb-2">Reference</h3>
    <code className="fs-16">{`useQueryParams<type>({reference: initialState, ...})`}</code>
    <p className="p mt-2">Reads and writes a multiple parameters to the URL.</p>
    <Code
      language="ts"
      code={`const [{page, sort}, setParams] = useQueryParams<string>({page: "1", sort: "desc");`}
    />
    <p className="p mt-2">
      The convention is to name state variables like{" "}
      <code>[something, setSomething]</code> using array destructuring.
    </p>
  </>
);
