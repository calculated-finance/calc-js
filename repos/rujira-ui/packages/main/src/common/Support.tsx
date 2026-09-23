import { useState, ReactNode } from "react";
import { Helmet } from "react-helmet";
import { Input } from "rujira.ui";

import { Accordion } from "./Accordion";
import { Icons } from "rujira.ui";

const Meta = () => {
  return (
    <Helmet>
      <title>Rujira Support</title>
      <meta
        name="description"
        content="Rujira is born from the powerful merger of Kujira and THORChain, uniting fragmented DeFi tools into a seamless experience. Empower your financial journey with native cross-chain capabilities and unrivaled liquidity. No bridges. No barriers. Just DeFi."
      />
      <meta
        name="og:description"
        content="Rujira is born from the powerful merger of Kujira and THORChain, uniting fragmented DeFi tools into a seamless experience. Empower your financial journey with native cross-chain capabilities and unrivaled liquidity. No bridges. No barriers. Just DeFi."
      />
      <meta
        name="twitter:description"
        content="Rujira is born from the powerful merger of Kujira and THORChain, uniting fragmented DeFi tools into a seamless experience. Empower your financial journey with native cross-chain capabilities and unrivaled liquidity. No bridges. No barriers. Just DeFi."
      />
    </Helmet>
  );
};

interface FAQ {
  category: string;
  items: {
    question: string;
    answer: ReactNode;
    searchText: string;
  }[];
}

const FAQ_DATA: FAQ[] = [
  {
    category: "Understanding Rujira",
    items: [
      {
        question: "What is Rujira?",
        answer: (
          <p className="p mb-0 mt-2">
            Rujira is the App Layer built on top of THORChain, offering a
            complete suite of DeFi apps, accessible with native assets from all
            connected chains. Rujira core products include an Orderbook DEX, an
            Automated Market Maker, a Perpetual Futures DEX, a Money Market, a
            Liquidations Marketplace, a Launchpad, a NFT marketplace and more.
            All Rujira's products are available from a unified web interface
            covering all your DeFi needs in one place. Rujira will also be
            accessible from a dedicated mobile app (Station) and a chat-GPT like
            interface (RUJI AI).
          </p>
        ),
        searchText:
          "Rujira is the App Layer built on top of THORChain, offering a complete suite of DeFi apps, accessible with native assets from all connected chains. Rujira core products include an Orderbook DEX, an Automated Market Maker, a Perpetual Futures DEX, a Money Market, a Liquidations Marketplace, a Launchpad, a NFT marketplace and more. All Rujira's products are available from a unified web interface covering all your DeFi needs in one place. Rujira will also be accessible from a dedicated mobile app (Station) and a chat-GPT like interface (RUJI AI).",
      },
      {
        question: "Is the App Layer a L2 on top of THORChain?",
        answer: (
          <p className="p mb-0 mt-2">
            No, a L2 would suggest a different mempool/consensus mechanism,
            using the L1 as a settlement layer. The App Layer shares the same
            consensus mechanism as THORChain, it has the same blocktime and
            supports atomic transactions between CosmWasm contracts and
            THORChain L1. We refer to THORChain as the Base Layer and Rujira as
            the App Layer.
          </p>
        ),
        searchText:
          "No, a L2 would suggest a different mempool/consensus mechanism, using the L1 as a settlement layer. The App Layer shares the same consensus mechanism as THORChain, it has the same blocktime and supports atomic transactions between CosmWasm contracts and THORChain L1. We refer to THORChain as the Base Layer and Rujira as the App Layer.",
      },
      {
        question: "What does Omnichain mean?",
        answer: (
          <p className="p mb-0 mt-2">
            Ominichain refers to the fact that Rujira apps are accessible from
            all connected chains, all at once, and via any supported wallet. As
            a user, it means you can connect your Bitcoin, Ethereum, Solana,
            Cosmos, etc. wallets and you will see your aggregated balances
            appear across all apps, and you will be able to trigger transactions
            from any connected chain, regardless of where your assets are. As a
            builder, it means you can deploy once on Rujira and make your app
            available from all connected chains and wallets. Rujira is the only
            place where you can accept direct deposits from all major L1 to your
            app.
          </p>
        ),
        searchText:
          "Ominichain refers to the fact that Rujira apps are accessible from all connected chains, all at once, and via any supported wallet. As a user, it means you can connect your Bitcoin, Ethereum, Solana, Cosmos, etc. wallets and you will see your aggregated balances appear across all apps, and you will be able to trigger transactions from any connected chain, regardless of where your assets are. As a builder, it means you can deploy once on Rujira and make your app available from all connected chains and wallets. Rujira is the only place where you can accept direct deposits from all major L1 to your app.",
      },
      {
        question: "Is Rujira connected to other Cosmos chains via the IBC?",
        answer: (
          <p className="p mb-0 mt-2">
            No, Rujira does not utilize the Inter-Blockchain Communication (IBC)
            protocol for cross-chain interoperability. Instead, Rujira leverages
            THORChain technology and secured assets to operate as the omnichain
            DeFi hub. At this stage IBC is disabled and might never be enabled
            like on other Cosmos chains. A custom implementation to connect with
            the rest of the Cosmos is being researched by the Strange Love team,
            but specifications are not finalized yet.
          </p>
        ),
        searchText:
          "No, Rujira does not utilize the Inter-Blockchain Communication (IBC) protocol for cross-chain interoperability. Instead, Rujira leverages THORChain technology and secured assets to operate as the omnichain DeFi hub. At this stage IBC is disabled and might never be enabled like on other Cosmos chains. A custom implementation to connect with the rest of the Cosmos is being researched by the Strange Love team, but specifications are not finalized yet.",
      },
    ],
  },
  {
    category: "Using the Rujira App Layer",
    items: [
      {
        question:
          "Do I need to have RUJI to use the Rujira App Layer and pay for gas?",
        answer: (
          <p className="p mb-0 mt-2">
            No, you do not need RUJI to use the App Layer. Gas on the App Layer
            is paid in RUNE and gas price is a THORChain's economic Mimir (i.e.
            a parameter upgradable by Node Operators). Initially gas price for
            interacting with the App Layer will be set to 0 as an experiment,
            meaning you will be able to use Rujira apps without paying any gas.
            If we see there are abuses, we will set the gas price to a non-null
            value. In such scenario, gas will be paid using RUNE.
          </p>
        ),
        searchText:
          "No, you do not need RUJI to use the App Layer. Gas on the App Layer is paid in RUNE and gas price is a THORChain's economic Mimir (i.e. a parameter upgradable by Node Operators). Initially gas price for interacting with the App Layer will be set to 0 as an experiment, meaning you will be able to use Rujira apps without paying any gas. If we see there are abuses, we will set the gas price to a non-null value. In such scenario, gas will be paid using RUNE.",
      },
      {
        question: "Which wallet do I need to use the Rujira App Layer?",
        answer: (
          <p className="p mb-0 mt-2">
            Initially, you will be able to use{" "}
            <a
              className="color-primary1 hover-teal no-underline"
              href="https://vultisig.com/">
              Vultisig
            </a>
            ,{" "}
            <a
              className="color-primary1 hover-teal no-underline"
              href="https://www.keplr.app/get">
              Keplr
            </a>
            ,{" "}
            <a
              className="color-primary1 hover-teal no-underline"
              href="https://brave.com/wallet/">
              Brave
            </a>
            ,{" "}
            <a
              className="color-primary1 hover-teal no-underline"
              href="https://www.coinbase.com/en-gb/wallet">
              Coinbase Wallet
            </a>
            ,{" "}
            <a
              className="color-primary1 hover-teal no-underline"
              href="https://ctrl.xyz/">
              CTRL
            </a>
            ,{" "}
            <a
              className="color-primary1 hover-teal no-underline"
              href="https://www.leapwallet.io/download">
              Leap
            </a>
            ,{" "}
            <a
              className="color-primary1 hover-teal no-underline"
              href="https://metamask.io/">
              Metamask
            </a>
            ,{" "}
            <a
              className="color-primary1 hover-teal no-underline"
              href="https://chromewebstore.google.com/detail/okx-wallet/mcohilncbfahbmgdjkbpemcciiolgcge">
              OKX
            </a>
            ,{" "}
            <a
              className="color-primary1 hover-teal no-underline"
              href="https://rabby.io/">
              Rabby
            </a>{" "}
            and{" "}
            <a
              className="color-primary1 hover-teal no-underline"
              href="https://trustwallet.com/browser-extension">
              Trust
            </a>{" "}
            to interact with the Rujira App Layer. We plan to integrate with
            more wallets over time, and launch our own Rujira-focused mobile app
            (Station).
          </p>
        ),
        searchText:
          "Initially, you will be able to use Vultisig, Keplr, Brave, Coinbase Wallet, CTRL, Leap, Metamask, OKX, Rabby and Trust to interact with the Rujira App Layer. We plan to integrate with more wallets over time, and launch our own Rujira-focused mobile app (Station).",
      },
    ],
  },
  {
    category: "RUJI Value Proposition and Staking",
    items: [
      {
        question: "What it the main value propositions of RUJI?",
        answer: (
          <p className="p mb-0 mt-2">
            RUJI represents a bet on the success of the Rujira. RUJI accrue
            value from the revenue generated by Rujira's core applications,
            therefore increasing adoption and usage should lead to an
            appreciation in RUJI's value and/or a higher staking yields. A bet
            on RUJI is essentially a bet on the growth of the economic activity
            on the THORChain App Layer.
          </p>
        ),
        searchText:
          "RUJI represents a bet on the success of the Rujira. RUJI accrue value from the revenue generated by Rujira's core applications, therefore increasing adoption and usage should lead to an appreciation in RUJI's value and/or a higher staking yields. A bet on RUJI is essentially a bet on the growth of the economic activity on the THORChain App Layer.",
      },
      {
        question:
          "Where does RUJI staking yield come from? Is the token inflationary?",
        answer: (
          <p className="p mb-0 mt-2">
            RUJI is a non-inflationary token. Rujira dApps generate real revenue
            from users' economic activity. Fees paid on these dApps (net of
            THORChain Base Layer share) are converted to USDC and distributed to
            RUJI stakers.
          </p>
        ),
        searchText:
          "RUJI is a non-inflationary token. Rujira dApps generate real revenue from users' economic activity. Fees paid on these dApps (net of THORChain Base Layer share) are converted to USDC and distributed to RUJI stakers.",
      },
      {
        question:
          "How are the fees distributed between the App Layer and the Base Layer?",
        answer: (
          <p className="p mb-0 mt-2">
            The standard revenue split between core Rujira applications and the
            Base Layer is 50/50. However, any economic activities that already
            contribute value to the Base Layer, such as swaps executed against
            Base Layer liquidity, and applications built on top of the Rujira
            primitives, are not required to pay for security twice and can keep
            100% of their revenue.
          </p>
        ),
        searchText:
          "The standard revenue split between core Rujira applications and the Base Layer is 50/50. However, any economic activities that already contribute value to the Base Layer, such as swaps executed against Base Layer liquidity, and applications built on top of the Rujira primitives, are not required to pay for security twice and can keep 100% of their revenue.",
      },
      {
        question: "What staking options are available?",
        answer: (
          <>
            <p className="p mt-2">
              There will be two options available to stakers:
            </p>
            <ol className="list mb-4">
              <li>Single-sided staking with RUJI token.</li>
              <li>LP staking with a RUJI/RUNE LP token.</li>
            </ol>
          </>
        ),
        searchText:
          "There will be two options available to stakers: Single-sided staking with RUJI token. LP staking with a RUJI/RUNE LP token.",
      },
      {
        question: "What will the staking APY be?",
        answer: (
          <>
            <p className="p mt-2">
              The staking APY will be dynamic and dependant on multiple factors:
            </p>
            <ul className="list mb-4">
              <li>
                The revenue split between the single-sided RUJI staking and the
                LP staking with the RUJI/RUNE LP token (set to 50/50 initially).
              </li>
              <li>
                The total amount of RUJI staked and the distribution between
                single-sided stakers and LP stakers.
              </li>
              <li>The amount of revenue collected from the Rujira products.</li>
            </ul>
          </>
        ),
        searchText:
          "The staking APY will be dynamic and dependant on multiple factors: The revenue split between the single-sided RUJI staking and the LP staking with the RUJI/RUNE LP token (set to 50/50 initially). The total amount of RUJI staked and the distribution between single-sided stakers and LP stakers. The amount of revenue collected from the Rujira products.",
      },
    ],
  },
  {
    category: "Secured Assets",
    items: [
      {
        question: "What are Secured Assets?",
        answer: (
          <p className="p mb-0 mt-2">
            Secured Assets are a novel answer to the problems of cross-chain
            interoperability, providing an open source, decentralized, and
            secure cross-chain asset model powered by THORChain. Secured Assets
            are backed 1:1 by native assets secured in THORChain's decentralized
            Asgard Vaults, which are secured by Threshold Signature Schemes
            (TSS) with the private keys split among ~100 independent node
            operators that churn every 3 days. Secured Assets remove all
            dependency to third-party bridges (e.g. Axellar, Gravity) and
            wrapping by centralized intermediaries (e.g. wBTC by BitGo, cbBTC by
            Coinbase), enabling access to DeFi with native assets from all
            connected chains.
          </p>
        ),
        searchText:
          "Secured Assets are a novel answer to the problems of cross-chain interoperability, providing an open source, decentralized, and secure cross-chain asset model powered by THORChain. Secured Assets are backed 1:1 by native assets secured in THORChain's decentralized Asgard Vaults, which are secured by Threshold Signature Schemes (TSS) with the private keys split among ~100 independent node operators that churn every 3 days. Secured Assets remove all dependency to third-party bridges (e.g. Axellar, Gravity) and wrapping by centralized intermediaries (e.g. wBTC by BitGo, cbBTC by Coinbase), enabling access to DeFi with native assets from all connected chains.",
      },
      {
        question: "How Secured Assets differ from traditional Bridged Assets?",
        answer: (
          <p className="p mb-0 mt-2">
            Bridged assets are IOUs issued by a third-party protocol on the
            destination chain, and represent a claim on the underlying asset on
            its native chain. In the best case, the assets on the native chains
            are secured by an external validator set (e.g. Axellar, Gravity),
            and in many cases by low-security multisig that have resulted in
            billions of dollar lost in hacks (Ronin Bridge $625m hack, Wormhole
            Bridge $326m hack, Nomad Bridge $190m hack, and the list goes on).
            In any case, they introduce an extra layer of exogenous risk between
            the native chain and the end user. Secured Assets, on the other
            hand, eliminate this additional layer of risk. While they do indeed
            mint new assets on THORChain, THORChain's TSS eliminates the
            external risks associated with third-party bridges and their
            security designs. This provides a far more robust architecture for
            Secured Assets than traditional bridges.
          </p>
        ),
        searchText:
          "Bridged assets are IOUs issued by a third-party protocol on the destination chain, and represent a claim on the underlying asset on its native chain. In the best case, the assets on the native chains are secured by an external validator set (e.g. Axellar, Gravity), and in many cases by low-security multisig that have resulted in billions of dollar lost in hacks (Ronin Bridge $625m hack, Wormhole Bridge $326m hack, Nomad Bridge $190m hack, and the list goes on). In any case, they introduce an extra layer of exogenous risk between the native chain and the end user. Secured Assets, on the other hand, eliminate this additional layer of risk. While they do indeed mint new assets on THORChain, THORChain's TSS eliminates the external risks associated with third-party bridges and their security designs. This provides a far more robust architecture for Secured Assets than traditional bridges.",
      },
      {
        question: "How Secured Assets differ from Wrapped Assets?",
        answer: (
          <p className="p mb-0 mt-2">
            Wrapped assets are also IOUs, but, unlike bridged assets, these are
            issued by a centralized intermediary, one that holds the underlying
            asset in custody (e.g., wBTC issued by BitGo or cbBTC issued by
            Coinbase). This allows assets like BTC to be used in DeFi on e.g.
            Ethereum, but it forces users to trust the centralized issuer to
            secure the underlying assets appropriately, to not misuses the
            reserves, and to not give in to censorship (e.g. freezing assets
            under the pressure of arbitrary governments). In using wrapped
            assets, a centralized intermediary have now become one's unintended
            financial partners, negating the very ethos of decentralization. In
            contrast, Secured Assets require no error-prone and corruptible
            centralized custodian, and are never subject to permission or KYC
            requirements.
          </p>
        ),
        searchText:
          "Wrapped assets are also IOUs, but, unlike bridged assets, these are issued by a centralized intermediary, one that holds the underlying asset in custody (e.g., wBTC issued by BitGo or cbBTC issued by Coinbase). This allows assets like BTC to be used in DeFi on e.g. Ethereum, but it forces users to trust the centralized issuer to secure the underlying assets appropriately, to not misuses the reserves, and to not give in to censorship (e.g. freezing assets under the pressure of arbitrary governments). In using wrapped assets, a centralized intermediary have now become one's unintended financial partners, negating the very ethos of decentralization. In contrast, Secured Assets require no error-prone and corruptible centralized custodian, and are never subject to permission or KYC requirements.",
      },
    ],
  },
  {
    category: "Finding Your Order on RUJI Trade",
    items: [
      {
        question:
          "I can't find my order on RUJI Trade even though it should have gone through. Did I lose my money?",
        answer: (
          <p className="p mb-0 mt-2">
            After orders execute on RUJI Trade orderbook DEX, you must claim
            them before seeing the new tokens in your wallet. Navigate to the
            &quot;Filled&quot; tab and check for any unclaimed orders (purple
            arrow up icon).
          </p>
        ),
        searchText:
          "After orders execute on RUJI Trade orderbook DEX, you must claim them before seeing the new tokens in your wallet. Navigate to the Filled tab and check for any unclaimed orders (purple arrow up icon).",
      },
    ],
  },
  {
    category: "Seeking Help",
    items: [
      {
        question: "I am stuck and need help; who should I contact?",
        answer: (
          <p className="p mb-0 mt-2">
            For support, visit our{" "}
            <a
              className="color-primary1 hover-teal no-underline"
              href="https://discord.com/invite/ddWCkJjD4u">
              Icons.Discord
            </a>{" "}
            and submit a support ticket. You can also reach out on{" "}
            <a
              className="color-primary1 hover-teal no-underline"
              href="https://t.me/Rujira_Community">
              Telegram
            </a>
            . Avoid private messages from unknown sources to prevent scams.
          </p>
        ),
        searchText:
          "For support, visit our Icons.Discord and submit a support ticket. You can also reach out on Telegram. Avoid private messages from unknown sources to prevent scams.",
      },
    ],
  },
];

export const Support = () => {
  const [search, setSearch] = useState<string>("");

  const filteredFAQs = FAQ_DATA.map((category) => ({
    ...category,
    items: category.items.filter(
      (item) =>
        !search ||
        item.question.toLowerCase().includes(search.toLowerCase()) ||
        item.searchText.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((category) => category.items.length > 0);

  return (
    <>
      <Meta />
      <div className="rujira__main rujira__main--gradient">
        <div className="rujira__inner rujira__inner--pad">
          <div className="row wrap pad gap-y-3 ai-e">
            <div className="col-12 col-md-8 col-lg-9">
              <h1 className="h1">Support</h1>
              <h2 className="fs-24 lh-32 fw-400 color-white">
                Having a question or an issue? check the Frequently Asked
                Questions below, or create a support ticket on Icons.Discord if you
                need additional help.
              </h2>
            </div>
            <div className="col-12 col-md-4 col-lg-3 gradient-card-container">
              <a
                href="https://discord.gg/XPvsxhWKfb"
                target="_blank"
                rel="noreferrer"
                className="glow-card bg-black p-2 flex gap-1.5 ai-s color-white no-underline">
                <Icons.Discord className="w-4 h-a no-shrink color-primary1" />
                <div className="flex dir-c gap-0.5">
                  <h3 className="fs-16 fw-500 mb-0.5">
                    Need Additional Help?
                  </h3>
                  <p className="fs-14 color-grey hover-white">
                    Join our Icons.Discord and create a support ticket.
                  </p>
                </div>
              </a>
            </div>
          </div>
          <h1 className="h3 mt-4 mb-3">Frequently Asked Questions</h1>
          <Input
            containerClassName=""
            value={search || ""}
            onChange={(e) => setSearch(e.currentTarget.value)}
            label="Search">
            {search && (
              <Icons.MinusCircle
                className="input-container__clear"
                onClick={() => setSearch("")}
              />
            )}
          </Input>

          {filteredFAQs.map((category) => (
            <div key={category.category}>
              <h3 className="fs-28 fw-400 mb-2 mt-4 color-grey">
                {category.category}
              </h3>
              {category.items.map((item, index) => (
                <Accordion
                  key={index}
                  title={<h4 className="h5 mb-0">{item.question}</h4>}>
                  {item.answer}
                </Accordion>
              ))}
            </div>
          ))}

          {filteredFAQs.length === 0 && (
            <p className="p mt-4 color-grey">
              No results found for{" "}
              <span className="color-white">&quot;{search}&quot;</span>. Please
              try another search term.
            </p>
          )}
        </div>
      </div>
    </>
  );
};
