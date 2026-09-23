import { Link } from "react-router-dom";
import { Header } from "rujira.ui";
import { Code } from "../components/Code";
import { FigmaIcon } from "../components/FigmaIcon";
import { GitLabIcon } from "../components/GitLabIcon";
import { ProviderIcon, useAccounts, WALLETS } from "../services/accounts";

export const HeaderPage = () => {
  const accountProvider = useAccounts();
  return (
    <>
      <h1 className="h1">Header</h1>
      <Code language="tsx" code={`import { Header } from "rujira.ui";`} />
      <p className="flex ai-c p-1 br-1 bg-primary5 fs-12 fw-500 mt-2">
        <GitLabIcon className="w-3 h-2 block" />{" "}
        <a
          href="https://gitlab.com/thorchain/rujira.ui/-/blob/main/packages/rujira.ui/src/components/header/Header.tsx?ref_type=heads"
          className="color-grey hover-purple ml-1 block no-underline"
          target="_blank">
          https://gitlab.com/thorchain/rujira.ui/-/blob/main/packages/rujira.ui/src/components/header/Header.tsx?ref_type=heads
        </a>
      </p>
      <p className="flex ai-c p-1 br-1 bg-primary5 fs-12 fw-500 mt-1">
        <FigmaIcon className="w-3 h-2 block" />{" "}
        <a
          href="https://www.figma.com/design/P5jeTCJw6Tc0CoX2pBUmsd/Rujira.ui?node-id=94-686&t=YRcvrDQGDBUKTHzJ-1"
          className="color-grey hover-purple ml-1 block no-underline"
          target="_blank">
          https://www.figma.com/design/P5jeTCJw6Tc0CoX2pBUmsd/Rujira.ui?node-id=94-686&t=YRcvrDQGDBUKTHzJ-1
        </a>
      </p>
      <div className="relative bg-black w-full mt-6">
        <Header
          accountProvider={accountProvider}
          routingElement={Link}
          wallets={WALLETS}
          ProviderIcon={ProviderIcon}
          getAccountValue={() => 1000000000000000n}
        />
      </div>

      <h2 className="h2 color-grey mt-6">Deconstructing the Header</h2>
      <p className="p">
        It is possible to only use certain parts of the header component, the{" "}
        <code>Header</code> can be constructed in the following way:
      </p>
      <Code
        language="tsx"
        code={`import { Head } from "rujira.ui";

<Head.Container className={className} domain={domain}>
  <Head.Logo />
  <Head.MobileNav domain={domain} />
  <Head.MainNav domain={domain} />
  <div className="ml-a mr-0 flex ai-c">
    <Head.QuickLauncher domain={domain || ""} />
    <Head.Accounts />
  </div>
</Head.Container>`}
      />

      <hr className="hr mt-5 mb-4" />
    </>
  );
};
