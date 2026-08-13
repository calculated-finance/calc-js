import { clsx } from "clsx";
import { Icons, useQueryParam } from "rujira.ui";
import { Code } from "../components/Code";
import { GitLabIcon } from "../components/GitLabIcon";

export const Tabs = () => {
  const [tab, setTab] = useQueryParam<string>("tab", "one");
  return (
    <>
      <h1 className="h1">Tabs</h1>
      <p className="flex ai-c p-1 br-1 bg-primary5 fs-12 fw-500">
        <GitLabIcon className="w-a h-2 block" />{" "}
        <a
          href="https://gitlab.com/thorchain/rujira-ui/-/blob/main/packages/rujira.ui/src/scss/styledcomponents/_tabs.scss?ref_type=heads"
          className="color-grey hover-purple ml-1 block no-underline"
          target="_blank">
          https://gitlab.com/thorchain/rujira-ui/-/blob/main/packages/rujira.ui/src/scss/styledcomponents/_tabs.scss?ref_type=heads
        </a>
      </p>
      <h3 className="h3 color-grey mt-4 mb-2">Example</h3>

      <div className="relative w-full mb-4 p-3 bg-darkGrey">
        <div className="tabs">
          <a
            className={clsx({ selected: tab === "one" })}
            onClick={() => setTab("one")}>
            One
          </a>
          <a
            className={clsx({ selected: tab === "two" })}
            onClick={() => setTab("two")}>
            Two
          </a>
          <a
            className={clsx({ selected: tab === "three" })}
            onClick={() => setTab("three")}>
            Three
            <i>2</i>
          </a>
        </div>
      </div>

      <Code
        language="tsx"
        code={`import "rujira.ui/scss/index.scss";
import { useQueryParam } from "rujira.ui";

const [tab, setTab] = useQueryParam<string>("tab", "one");

<div className="tabs">
  <a
    className={clsx({ selected: tab === "one" })}
    onClick={() => setTab("one")}>
    One
  </a>
  <a
    className={clsx({ selected: tab === "two" })}
    onClick={() => setTab("two")}>
    Two
  </a>
  <a
    className={clsx({ selected: tab === "three" })}
    onClick={() => setTab("three")}>
    Three
    <i>2</i>
  </a>
</div>`}
      />

      <h3 className="h3 color-grey mt-6 mb-2">With Submenu</h3>

      <div className="relative w-full mb-4 h-25 p-3 bg-darkGrey">
        <div className="tabs">
          <a
            className={clsx({ selected: tab === "one" })}
            onClick={() => setTab("one")}>
            One
            <Icons.AngleDown />
            <nav>
              <a>Sub One</a>
              <a>Sub Two</a>
              <a>Sub Three</a>
            </nav>
          </a>
          <a
            className={clsx({ selected: tab === "two" })}
            onClick={() => setTab("two")}>
            Two
          </a>
          <a
            className={clsx({ selected: tab === "three" })}
            onClick={() => setTab("three")}>
            Three
            <i>2</i>
          </a>
        </div>
      </div>

      <Code
        language="tsx"
        code={`import "rujira.ui/scss/index.scss";
import { useQueryParam } from "rujira.ui";
import { Icons } from "rujira.ui";

const [tab, setTab] = useQueryParam<string>("tab", "one");

<div className="tabs">
  <a
    className={clsx({ selected: tab === "one" })}
    onClick={() => setTab("one")}>
    One
    <Icons.AngleDown />
    <nav>
      <a>Sub One</a>
      <a>Sub Two</a>
      <a>Sub Three</a>
    </nav>
  </a>
  <a
    className={clsx({ selected: tab === "two" })}
    onClick={() => setTab("two")}>
    Two
  </a>
  <a
    className={clsx({ selected: tab === "three" })}
    onClick={() => setTab("three")}>
    Three
    <i>2</i>
  </a>
</div>`}
      />

      <hr className="hr mt-5 mb-4" />
    </>
  );
};
