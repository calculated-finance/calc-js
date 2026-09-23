import { Code } from "../components/Code";
import { GitLabIcon } from "../components/GitLabIcon";

export const UseLocalStorage = () => (
  <>
    <h1 className="h1">useLocalStorage</h1>
    <Code
      language="tsx"
      code={`import { useLocalStorage } from "rujira.ui";`}
    />
    <p className="flex ai-c p-1 br-1 bg-primary5 fs-12 fw-500 mt-2">
      <GitLabIcon className="w-3 h-2 block" />{" "}
      <a
        href="https://gitlab.com/thorchain/rujira.ui/-/blob/main/packages/rujira.ui/src/hooks/useLocalStorage.ts?ref_type=heads"
        className="color-grey hover-purple ml-1 block no-underline"
        target="_blank">
        https://gitlab.com/thorchain/rujira.ui/-/blob/main/packages/rujira.ui/src/hooks/useLocalStorage.ts?ref_type=heads
      </a>
    </p>
    <h3 className="h3 color-grey mt-4 mb-2">Reference</h3>
    <code className="fs-16">{`useLocalStorage(key, initialState)`}</code>
    <p className="p mt-2">
      Reads and writes a key value string pair to local storage.
    </p>
    <Code
      language="ts"
      code={`const [currency, setCurrency] = useLocalStorage<string>("user-currency", "USD");`}
    />
    <p className="p mt-2">
      The convention is to name state variables like{" "}
      <code>[something, setSomething]</code> using array destructuring.
    </p>
  </>
);
