import { Link } from "react-router-dom";
import { NoIndexHelmet } from "../seo";

const Meta = () => {
  return (
    <NoIndexHelmet>
      <title>Terms of Use | Rujira</title>
      <meta
        name="description"
        content="Read the Rujira Terms of Use, including platform access, responsibilities, restrictions, and important legal information."
      />
      <meta
        name="og:description"
        content="Read the Rujira Terms of Use, including platform access, responsibilities, restrictions, and important legal information."
      />
      <meta
        name="twitter:description"
        content="Read the Rujira Terms of Use, including platform access, responsibilities, restrictions, and important legal information."
      />
    </NoIndexHelmet>
  );
};

export const TermsOfUse = () => (
  <>
    <Meta />
    <div className="rujira__main rujira__main--gradient">
      <div className="rujira__inner rujira__inner--pad terms">
        <h1 className="h1">Terms Of Use</h1>
        <p className="p">Last updated: 4 November 2025</p>
        <p className="p">
          These terms of use, together with any other agreements or terms
          incorporated by reference, including our Privacy Policy (available at{" "}
          <Link to="../privacypolicy" className="color-white hover-primary1">
            here
          </Link>
          ) (the "Terms") set forth the basis on which you may access and use
          the website-hosted user interface located at https://rujira.network/
          and any associated subdomains and documentation (the "Interface") made
          available to you by Ruji Holdings Limited ("the Company") and its
          Affiliates (collectively with the Company, "we" or "us").
        </p>
        <p className="p">
          By accessing and using the Interface, you expressly represent and
          acknowledge that you have read, understood, and agreed to be bound by
          these terms. If you are entering into these Terms on behalf of a
          company or another legal entity, you represent that you have the
          authority to bind such entity and its affiliates to these Terms, in
          which case the term "you" will refer to such entity and its
          affiliates. IF YOU DO NOT AGREE TO THESE TERMS, THEN YOU MUST NOT
          ACCESS OR USE THE INTERFACE.
        </p>
        <p className="p">
          NOTE: Please review these Terms carefully to understand your rights
          and obligations, including with respect to governing law, arbitration,
          a class action waiver, prohibited uses, indemnification, disclosures
          and disclaimers, limitations of liability, and exclusions of
          consequential damages and other claims.
        </p>
        <ol>
          <li className="p">THE INTERFACE.</li>
          <ol>
            <li className="p">
              The Interface is a user interface designed to provide convenient
              access to a decentralized protocol, which is open-source software
              comprised of a suite of publicly available smart contracts (the
              “Protocol”).{" "}
            </li>
            <li className="p">
              To access and use the Interface, you must use a Cosmos-supported,
              non-custodial, digital wallet which allows you to interact with
              public blockchains (a “Supported Wallet”). Your relationship with
              that Supported Wallet provider is governed by the applicable terms
              of service of that third party, not these Terms. Supported Wallets
              are not operated by, maintained by, or affiliated with us, and we
              do not have custody or control over the contents of your Supported
              Wallet and have no ability to retrieve or transfer the contents
              thereof. By connecting your Supported Wallet to our Interface, you
              agree to be bound by these Terms and all of the terms incorporated
              herein by reference.
            </li>
            <li className="p">
              The Interface is a purely non-custodial application, meaning we do
              not ever have custody, possession, or control of your digital
              assets at any time. It further means you are solely responsible
              for the custody of any cryptographic private keys to the digital
              asset wallets you hold, including your wallet credentials and any
              other sensitive information, and you should never share your
              sensitive information with anyone. We accept no responsibility
              for, or liability to you, in connection with your use of a wallet
              and make no representations or warranties regarding how the
              Interface will operate with any specific wallet. Likewise, you are
              solely responsible for any associated wallet and we are not liable
              for any acts or omissions by you in connection with or as a result
              of your wallet being compromised.
            </li>
            <li className="p">
              The Interface is distinct from the Protocol and is one, but not
              the exclusive, means of accessing the Protocol. We do not control
              or operate any version of the Protocol on any blockchain network.
              We have no information about all Protocol transactions beyond what
              is publicly available via the blockchain. However, we may collect
              information regarding the users of the Interface in accordance
              with our Privacy Policy. By using the Interface, you understand
              that we do not control trade execution on the Protocol. As a
              general matter, you are not buying or selling digital assets from
              the Company, and the Company is not a liquidity provider into
              Protocol liquidity pools.
            </li>
            <li className="p">
              All such information provided through the Interface is for
              informational purposes only and should not be construed as
              professional, technical, operational, investment, or other advice,
              nor a recommendation that a particular token is a safe or sound
              investment. You should not take, or refrain from taking, any
              action based on any information contained in the Interface. By
              providing token information for your convenience, we do not make
              any investment recommendations to you or opine on the merits of
              any transaction or opportunity. You alone are responsible for
              verifying the accuracy and relevance of such information, and
              seeking any independent professional advice, before determining
              whether any activity or transaction is appropriate for you based
              on your personal investment objectives, financial circumstances,
              and risk tolerance. We may provide information about tokens in the
              Interface sourced from third parties. The provision of
              informational materials does not make trades in those tokens
              solicited; we are not attempting to induce you to make any
              purchase as a result of information provided.
            </li>
            <li className="p">
              If you are deploying any open-source software related to the
              Interface for public use through a website interface or otherwise,
              you will take all reasonable steps to ensure your users’
              compliance with these terms.
            </li>
            <li className="p">
              We may update the Interface and/or any related policy, FAQ and/or
              guidelines from time to time, including adding or removing content
              and functions.
            </li>
          </ol>

          <li className="p">
            THE PROTOCOL.
            <ol>
              <li className="p">
                The Protocol is a suite of decentralized finance applications,
                including an orderbook exchange for spot trading, an automated
                market maker adding liquidity to the orderbook, a perpetual
                trading platform, a money market, a marketplace to bid on
                liquidated collateral, a launchpad, an option platform, an NFT
                marketplace, and a prediction market, among other products. All
                of these applications run autonomously with open-sourced smart
                contracts without relying on any centralized intermediary. We do
                not own or control the smart contracts comprising the Protocol,
                and have no involvement in the execution of transactions nor any
                third-party project launched or accessed through the Protocol.
              </li>
              <li className="p">
                Certain products available on the Protocol as accessed through
                the Interface may provide access to functionalities enabling the
                launch, sale, or distribution of tokens or other digital assets
                created and managed by independent third parties. These are
                initiated and managed entirely by external teams and are not
                created, operated, vetted, controlled, endorsed, or managed by
                us in any way. We make no representations or warranties as to
                the accuracy, legitimacy, legality, financial soundness,
                technical functionality, or any other aspect of any tokens,
                teams, protocols, smart contracts, or other materials on the
                Protocol. We are not responsible for and disclaim all liability
                in connection with any actions or omissions of third parties.
              </li>
            </ol>
          </li>

          <li className="p">
            REPRESENTATIONS AND WARRANTIES. You make the following
            representations and warranties regarding your use of the Interface:
            <ol>
              <li className="p">
                You represent and warrant that you are legally permitted to use
                the Interface in your jurisdiction, including that you are
                legally permitted to own the digital assets and interact with
                the Interface, and you will not coordinate, conduct or control
                your use of the Interface from within the United States of
                America, Canada, Australia, or any Prohibited Jurisdiction
                (defined below). You further represent and warrant that you are
                responsible for ensuring compliance with the laws, rules and
                regulations of your jurisdiction in connection with your use of
                the Interface and acknowledge that we are not liable for your
                compliance or non-compliance with any such laws, rules or
                regulations.
              </li>
              <li className="p">
                You represent and warrant that agreeing to the Terms and your
                use of the Interface does not constitute, and that you do not
                expect it to result in, a breach, default, or violation of any
                applicable law or any contract or agreement to which you are a
                party or are otherwise bound.
              </li>
              <li className="p">
                You represent and warrant that you are not a “Restricted
                Person”, which includes:
                <ol>
                  <li className="p">
                    A person or entity who resides in, is located in, is
                    incorporated in, has a registered office in, or is operated
                    or controlled from the United States of America, Canada,
                    UAE, or Australia;
                  </li>
                  <li className="p">
                    A person or entity who resides in, is a citizen of, is
                    located in, is incorporated in, has a registered office in,
                    or is operated or controlled from a jurisdiction that is
                    designated as high risk by the Financial Action Task Force,
                    that are subject to embargos or sanctions implemented by the
                    United Nations, Singapore, the European Union, or the Office
                    of Foreign Assets Control of the United States Treasury
                    Department, or are included on a list of jurisdictions not
                    permitted to use the Interface as determined by us (each, a
                    “Prohibited Jurisdiction);
                  </li>
                  <li className="p">
                    A person or entity subject to any economic or trade
                    sanctions administered or enforced by any governmental
                    authority or otherwise designated on any list of prohibited
                    or restricted parties (including the list maintained by the
                    Office of Foreign Assets Control of the United States
                    Treasury Department), or any agent or associate of such a
                    person or entity;
                  </li>
                  <li className="p">
                    A person, entity controlled by a person, or entity
                    identified on, or controlling a blockchain address
                    identified on, a list of persons or blockchain addresses
                    that have been specially designated, considered parties of
                    concern, or blocked that is established and maintained by
                    the United Nations, the European Union, or the Office of
                    Foreign Assets Control of the United States Treasury
                    Department;
                  </li>
                  <li className="p">
                    Any other person or entity whose use of the Interface or
                    Protocol is contrary to applicable law.{" "}
                  </li>
                </ol>
                <li className="p">
                  You represent and warrant that you will not engage in any
                  Prohibited Uses (as defined below).{" "}
                </li>
                <li className="p">
                  You represent and warrant that you are financially and
                  technically sophisticated in using and evaluating
                  cryptographic and blockchain technologies and related
                  blockchain-based digital assets, including but not limited to
                  the risks related to smart contract systems, leveraged
                  trading, and lending protocols. Specifically, you represent
                  and warrant that:
                  <ol>
                    <li className="p">
                      You have evaluated and understand the operation of the
                      Interface and have not relied on any information,
                      statement, representation, or warranty, express or
                      implied, made by or on behalf of us with respect to the
                      Interface.
                    </li>
                    <li className="p">
                      You understand that all trades and other on-chain actions
                      you submit through the Interface are considered
                      unsolicited and initiated solely by you, and we do not
                      conduct a suitability review of any trades or other
                      non-chain actions submitted by you.
                    </li>
                    <li className="p">
                      You have conducted your own due diligence and consulted
                      appropriate professionals to advise you on the legality,
                      regulatory compliance, tax treatment, and suitability of
                      your activities in your jurisdiction.
                    </li>
                    <li className="p">
                      You have not received any investment advice from us, and
                      you understand that we do not act as a broker, advisor,
                      fiduciary, or agent for you in any capacity.
                    </li>
                  </ol>
                </li>
                <li className="p">
                  All of the above representations and warranties are true,
                  complete, accurate and not misleading from the time of your
                  acceptance of the Terms and are deemed repeated each time you
                  use the Interface.
                </li>
              </li>
            </ol>
          </li>
          <li className="p">
            PROHIBITED USES. Without limitation, users of the Interface may not,
            directly or indirectly, engage in, or attempt to engage in, any of
            the following activities in connection with their use of the
            Interface (“Prohibited Uses”):
            <ol>
              <li className="p">
                A violation of any law, rule, or regulation of any jurisdiction
                that is applicable to you;
              </li>
              <li className="p">
                Violation or breaches of these Terms or any other document from
                time to time governing the use of the Interface;
              </li>
              <li className="p">
                Permit anyone other than you to access the Interface using a
                wallet owned by you or a blockchain address for which you
                control the private keys;
              </li>
              <li className="p">
                Perform any action that would interfere with, or otherwise
                adversely affect the normal operation of the Interface or act in
                a manner that may negatively affect other users’ experiences
                when using the Interface, including but not limited to taking
                advantage of software vulnerabilities and any other act that
                abuses or exploits the design of the Interface;
              </li>
              <li className="p">
                Engage in, or knowingly facilitate, any improper or abusive
                practices, including but not limited to (i) any fraudulent act
                or scheme to defraud, deceive, trick, or mislead other users or
                the Interface, (ii) any fraudulent or fictitious trading
                practices, and (iii) manipulative tactics commonly known as “rug
                pulls”, pumping and dumping, and wash trading;
              </li>
              <li className="p">
                Engage in, promote, or otherwise facilitate, any illegal
                activity, including but not limited to money laundering and
                terrorist financing;
              </li>
              <li className="p">
                Buy, sell, or transfer stolen items, fraudulently obtained
                items, items taken without authorization, and/or any other
                illegally obtained items;
              </li>
              <li className="p">
                Engage in activity that infringes on or violates any copyright,
                trademark, service market, patent, right of publicity, right or
                private, or other proprietary or intellectual property rights
                under the law;
              </li>
              <li className="p">
                Engage in, or knowingly facilitate, acts that are libelous,
                defamatory, profane, obscene, pornographic, sexually explicit,
                indecent, lewd, vulgar, suggestive, harassing, stalking,
                hateful, threatening, offensive, discriminatory, bigoted,
                abusive, inflammatory, fraudulent, deceptive, or otherwise
                objectionable or likely or intended to incite, threaten,
                facilitate, promote, or encourage hate, racial intolerance, or
                violent acts against others;
              </li>
              <li className="p">
                Circumvent access or use restrictions put into place to prevent
                certain uses of the Interface, including but not limited to
                using VPN software or any other privacy or anonymization tools
                or techniques, or other means, to circumvent, or attempt to
                circumvent, any restrictions that apply.
              </li>
            </ol>
          </li>

          <li className="p">
            INTELLECTUAL PROPERTY RIGHTS.
            <ol>
              <li className="p">
                Any Rujira code, software or documentation is released as
                open-source software under the MIT License (the “License”) as
                set forth in:{" "}
                <a
                  href="https://gitlab.com/thorchain/rujira/-/blob/main/LICENSE"
                  target="_blank"
                  className="color-white hover-primary1">
                  https://gitlab.com/thorchain/rujira/-/blob/main/LICENSE
                </a>
              </li>
              <li className="p">
                By using the Interface to list, post, promote, or display NFTs,
                you grant us a worldwide, non-exclusive, sublicensable,
                royalty-free license to use, copy, modify, and display any
                content, including but not limited to text, materials, images,
                files, communications, comments, feedback, suggestions, ideas,
                concepts, questions, data, or otherwise, that you post on or
                through the Interface for our current and future business
                purposes, including to provide, promote, and improve the
                services. This includes any digital file, art, or other material
                linked to or associated with any NFTs that are displayed.
                <br />
                <br />
                You represent and warrant that you have, or have obtained, all
                rights, licenses, consents, permissions, power and/or authority
                necessary to grant the rights granted herein for any NFTs that
                you list, post, promote, or display on or through the Interface.
                You represent and warrant that such content does not contain
                material subject to copyright, trademark, publicity rights, or
                other intellectual property rights, unless you have necessary
                permission or are otherwise legally entitled to post the
                material and to grant us the license described above, and that
                the content does not violate any laws.
              </li>
            </ol>
          </li>
          <li className="p">
            WAIVERS.
            <ol>
              <li className="p">
                You agree and acknowledge that the Company and its Affiliates
                shall not be liable for any direct, indirect, incidental,
                exemplary, punitive, special, consequential or other losses of
                any kind, in tort, contract or otherwise (including but not
                limited to loss of revenue, income or profits, and loss of use
                of data), in each case arising out of or related to your access
                and use of the Interface or interaction with the Protocol
                through the Interface. For the purposes of the Terms,
                “Affiliates” means the owners, officers, directors, employees,
                contractors (including developer contributors), advisors,
                agents, or affiliates of the Company or companies in which the
                Company has an interest.
              </li>
              <li className="p">
                You undertake not to initiate or participate, and waive the
                right to participate in, any class action lawsuit or a class
                wide arbitration against the Company and/or its Affiliates.
              </li>
              <li className="p">
                By accepting the Terms, you waive all rights, claims and/or
                causes of action (present or future) under law (including any
                tortious claims) or contract against the Company and/or its
                Affiliates in connection with your use of the Interface and
                interaction with the Protocol through the Interface.{" "}
              </li>
            </ol>
          </li>

          <li className="p">
            DISCLAIMER.
            <ol>
              <li className="p">
                The Interface are provided on an "as is" and "as available"
                basis, and the Company expressly disclaims any and all
                warranties of any kind, express, implied or statutory or
                otherwise, including but not limited to reliability of service,
                warranties of non-infringement or implied warranties of use,
                merchantability or fitness for a particular purpose or use,
                accuracy, completeness, reliability, security, or timeliness. We
                make no warranty that the Interface or any interaction through
                the Interface with the Protocol will meet your requirements,
                will be available on an uninterrupted, timely, secure, or
                error-free basis, or will be accurate, reliable, free of viruses
                or other harmful code, complete, legal, or safe. If applicable
                law requires any warranties with respect to the products, all
                such warranties are limited in duration to ninety (90) days from
                the date of first use.
              </li>
              <li className="p">
                We do not and cannot guarantee the security, performance, or
                reliability of the Protocol, its code, or any associated
                blockchain networks, protocols or tools. You understand that we
                are not a party to, nor do we control or facilitate, any
                transactions or trading activity conducted on the Protocol.
              </li>
              <li className="p">
                The Company does not endorse any third party and shall not be
                responsible in any way for any transactions you enter into with
                any other third party. You agree that the Company and its
                Affiliates will not be liable for any loss or damages of any
                sort incurred as the result of any interactions between you and
                any third party.
              </li>
            </ol>
          </li>

          <li className="p">
            LIMITATION OF LIABILITY.
            <ol>
              <li className="p">
                Limitation of Liability.
                <ol>
                  <li className="p">
                    To the maximum extent permitted by applicable law, in no
                    event shall the Company and its Affiliates be liable to you
                    or any third party for any lost profits, lost data, or any
                    indirect, consequential, exemplary, incidental, special or
                    punitive damages arising out of your use of the Interface
                    and your interaction with the Protocol, even if the Company
                    has been advised of the possibility of such liability.
                    Access to, and use of, the Interface and Protocol is at your
                    own discretion and risk, and you will be solely responsible
                    for any damage to your device or computer system, or loss of
                    data resulting therefrom.{" "}
                  </li>
                  <li className="p">
                    Without limiting the generality of the foregoing, neither
                    the Company nor its Affiliates assume any liability or
                    responsibility for any liability, claims, causes of actions,
                    loss or damages arising out of (a) your use of the
                    Interface, including any errors, delays, or interruptions in
                    its operation; (b) your interaction with the Protocol
                    through the Interface, including in respect of any trading
                    losses, liquidation events, or other financial impact; (c)
                    any reliance on market data, token values, or information
                    displayed on the Interface, which may be inaccurate or
                    delayed; (d) personal injury or property damage, of any
                    nature whatsoever, resulting from any access or use of the
                    Interface; (e) unauthorized access or use of any secure
                    server, database or wallet in our control, or the use of any
                    information or data stored therein; (f) errors, bugs, or
                    vulnerabilities in the Protocol, including, but not limited
                    to, issues in code, cross-chain bridges, oracles, or
                    perpetual futures mechanisms; (g) third-party integrations,
                    tools, or services utilized in connection with the Interface
                    or Protocol, including any failures or disruptions caused by
                    them; (h) third-party actions, including but not limited to
                    fraud, phishing, market manipulation, or hacking impacting
                    users of the Protocol or the Interface; (i) your failure to
                    keep your wallet credentials, private keys, or login
                    information secure, or any unauthorized access to or
                    transactions involving your wallet; (j) any regulatory, tax,
                    or legal consequences arising from your use of the Interface
                    or participation in activities on the Protocol through it;
                    and (k) bugs, viruses, trojan horses, or the like that may
                    be transmitted to or through the Interface.
                  </li>
                  <li className="p">
                    To the maximum extent permitted by applicable law,
                    notwithstanding anything to the contrary contained herein,
                    our liability to you for any claims, proceedings,
                    liabilities, obligations, damages, losses or costs arising
                    from or related to these terms (for any cause whatsoever and
                    regardless of the form of the action), will at all times be
                    limited to a maximum of the amount of US$100.00. The
                    existence of more than one claim will not enlarge this
                    limit.
                  </li>
                </ol>
              </li>
              <li className="p">
                Indemnification. You agree to indemnify, defend, and hold
                harmless the Company and its Affiliates (collectively the
                "Indemnified Parties") from and against all claims, liabilities,
                damages, costs and expenses (including reasonable attorneys'
                fees) arising out of or related to (a) your access to or use of
                the Interface; (b) your interaction with the Protocol,
                including, but not limited to, trading activities, leveraged
                positions or liquidation events; (c) your violation of any term
                or condition of these Terms, the right of any third party, or
                any other applicable law, rule or regulation; (d) your
                participation in any Prohibited Uses: (e) any other party’s
                access to and use of the Interface or the Protocol through the
                Interface, using any device or account that you own or control,
                whether or not caused by you; (f) any third-party services,
                tools, or platforms you use in connection with the Interface or
                the Protocol through the Interface; or (g) any false,
                misleading, or fraudulent statements or omissions made by you in
                connection with your use of the Interface or access to the
                Protocol through the Interface. The Company or the relevant
                Indemnified Party reserves the right, at your expense, to assume
                the exclusive defense and control of any matter for which you
                are required to provide indemnification, and you agree to
                cooperate in the defense of these claims. You agree not to
                settle any matter without the prior written consent of the
                relevant Indemnified Party or Parties.
              </li>
              <li className="p">
                Taxes. Users bear sole responsibility for determining and paying
                any and all taxes, duties, and assessments now or hereafter
                claimed or imposed by any governmental authority associated with
                their use of the Interface, their transactions, and/or their use
                of any cryptoassets and interactions with smart contracts. This
                includes any applicable tax reporting obligations in their
                jurisdiction. You acknowledge that blockchain-based transactions
                may be subject to uncertain or evolving tax treatment, and you
                are solely responsible for determining how such transactions are
                treated in your jurisdiction.
              </li>
              <li className="p">
                Acknowledgement of Risks. You expressly acknowledge and accept
                full responsibility for all of the risks involved with
                blockchain technologies, digital assets, and accessing and using
                the Interface, which include, but are not limited to, the
                following:
                <ol>
                  <li className="p">
                    Digital assets, including but not limited to those used in
                    spot trading, perpetual contracts, lending, and prediction
                    markets, are, by their nature, highly experimental,
                    speculative, risky, and volatile. The value of digital
                    assets may fluctuate significantly, which may result in the
                    partial or total loss of your assets. Past performance does
                    not indicate future results. Market risks include slippage,
                    rapid price changes, lack of liquidity, and failure to
                    execute trades at visible prices.{" "}
                  </li>
                  <li className="p">
                    The legal status and regulatory treatment of digital assets
                    varies across jurisdictions and may change without notice.
                    Some digital assets or activities may become restricted or
                    prohibited, and digital assets may not enjoy the same legal
                    protections as fiat currencies or traditional investments.
                    It is your responsibility to ensure that your activities
                    comply with the legal, regulatory, and tax requirements that
                    apply in your jurisdiction.
                  </li>
                  <li className="p">
                    The availability of active markets or sufficient liquidity
                    for any given asset is not guaranteed. ‘Stablecoins’ may not
                    be stable or adequately collateralized. Information
                    available through the Interface or Protocol may be
                    inaccurate, outdated, or incomplete, and should not be
                    relied upon as investment, legal, or financial advice.
                  </li>
                  <li className="p">
                    Transactions involving digital assets are irreversible.
                    Mistakes, theft, or loss of private keys can result in
                    permanent loss of assets. You are solely responsible for the
                    custody and security of your assets.
                  </li>
                  <li className="p">
                    Digital assets and smart contracts are susceptible to
                    unauthorized access, hacking, phishing, exploits, malware,
                    vulnerabilities, or coding errors in the Protocol,
                    associated bridges, oracles, or liquidity pools.
                  </li>
                  <li className="p">
                    Projects, issuers, exchanges, and custodians are susceptible
                    to failure, bankruptcy, fraud, hacks, theft, and attacks,
                    which may result in them not being able to fulfil their
                    obligations, including to return your assets to you.
                  </li>
                  <li className="p">
                    Anyone can create a token, including fake versions of
                    existing tokens and tokens that falsely claim to represent
                    projects, and you acknowledge and accept the risk that you
                    may mistakenly trade those or other tokens.
                  </li>
                  <li className="p">
                    The Interface and Protocol may experience delays,
                    disruptions, errors, or become temporarily or permanently
                    unavailable due to network issues, bugs, congestion, forks,
                    protocol upgrades, or third-party failures. Auction and
                    liquidation mechanisms may experience failed bids,
                    mispricing, or settlement delays due to network congestion,
                    smart contract limitations, or third-party data feed issues.
                  </li>
                  <li className="p">
                    Trading with leverage carries a high risk of loss, including
                    full liquidation of positions. Liquidations are automatic,
                    may be triggered by third-party data, and may be delayed or
                    executed based on inaccurate or outlier data.
                  </li>
                  <li className="p">
                    If you act as a liquidity provider, the assets you supply
                    may be subject to impermanent loss or lose value due to
                    price fluctuations in trading pairs or pools.
                  </li>
                  <li className="p">
                    Blockchain networks and third parties may charge fees for
                    engaging in a transaction on the network, which are subject
                    to change from time to time. You acknowledge and agree that
                    you are solely responsible for paying all such fees or
                    charges, and that you understand and accept that these are
                    variable.
                  </li>
                </ol>
              </li>
            </ol>
          </li>

          <li className="p">
            TERM AND TERMINATION.
            <ol>
              <li className="p">
                These Terms shall remain in full force and effect for so long as
                you use the Interface.
              </li>
              <li className="p">
                We may suspend or terminate your rights to use the Interface at
                any time for any reason at our sole direction without prior
                notice, including for any use of the Interface in violation of
                these Terms. Upon termination of your rights under these Terms,
                your right to access and use the Interface will terminate
                immediately. We will not be liable for any losses or damages
                suffered by you resulting from any modification, suspension, or
                termination, for any reason, of your access to all or any
                portion of the Interface.
              </li>
              <li className="p">
                We may change the Terms at any time and at our sole discretion,
                and such change will become effective upon the date on which it
                is posted on the Interface. You are responsible for checking the
                Interface regularly for such changes and to understand the terms
                and conditions that apply to your use of the Interface. By
                continuing to access or use the Interface, you will be deemed to
                have read, understood, and unconditionally consented and agreed
                to the revised Terms. If you do not agree to the Terms, you must
                cease using the Interface immediately.
              </li>
              <li className="p">
                The provisions of these Terms that, by their nature and content,
                must survive the termination of these Terms in order to achieve
                the fundamental purposes of these Terms shall so survive.
                Without limiting the generality of the foregoing, the Waivers,
                Disclaimer, Limitation of Liability, Term and Termination,
                Governing Law and Dispute Resolution and General sections, will
                survive the termination or expiration of the Terms.
              </li>
            </ol>
          </li>

          <li className="p">
            GOVERNING LAW AND DISPUTE RESOLUTION.
            <ol>
              <li className="p">
                These Terms and any dispute or claim arising out of or in
                connection with their subject matter or formation (including
                non-contractual disputes or claims) shall be governed by and
                construed in accordance with the laws of the British Virgin
                Islands.
              </li>
              <li className="p">
                The parties agree to waive the right to have any and all claims,
                disputes, or suits arising from these Terms, your use of, or
                access to, the Interface, or any other disputes with us
                (“Disputes”) resolved in a court. Instead, all Disputes will be
                resolved through binding arbitration.
              </li>
              <li className="p">
                You agree to notify us in writing of any Dispute by sending an
                email to hello@rujira.network within thirty (30) days of when it
                arises, including your name, contact details, description of the
                basis of the Dispute, and the specific resolution or action that
                you are seeking, so that the parties can attempt to resolve the
                Dispute in good faith. If the Dispute cannot be resolved
                informally, the matter shall be referred to and finally be
                resolved by arbitration in accordance with the British Virgin
                Islands Arbitration Center (“BVI IAC”) Arbitration Rules before
                a single arbitrator. Each party shall bear its own costs, unless
                otherwise determined by the arbitrator. Any claim shall be
                brought individually on behalf of the person or entity seeking
                relief, not on behalf of a class or other persons or entities
                not participating in the arbitration and shall not be
                consolidated with the claim of any person who is not asserting a
                claim arising under or relating to these Terms. The seat of
                arbitration shall be the British Virgin Islands and the language
                of any arbitration shall be English. Judgment on any award
                rendered by the arbitrators may be entered by any court of
                competent jurisdiction.
              </li>
            </ol>
          </li>

          <li className="p">
            GENERAL.
            <ol>
              <li className="p">
                Entire Agreement: These Terms contain the entire agreement
                between us and you relating to your use of the Interface and
                supersedes any and all prior agreements between us and you in
                relation to the same.
              </li>
              <li className="p">
                Severability: If any part of these Terms is deemed unlawful,
                void or for any reason unenforceable, then that provision shall
                be deemed to be severable from the rest of these Terms and shall
                not affect the validity and enforceability of any of the
                remaining provisions of these Terms. In such cases, the part
                deemed invalid or unenforceable shall be construed in a manner
                consistent with applicable law to reflect, as closely as
                possible, the original intent of the parties.
              </li>
              <li className="p">
                Relationship of the Parties: Nothing in these Terms shall be
                construed as creating any agency, partnership, trust
                arrangement, fiduciary relationship or any other form of joint
                enterprise between you and us. To the fullest extent permitted
                by law, you agree that we owe no fiduciary duties or liabilities
                to you or any other party based on your use of the Interface or
                interaction with the Protocol through the Interface. To the
                extent that any such duties or liabilities may exist at law or
                in equity, you hereby irrevocably disclaim, waive, and eliminate
                such duties and liabilities.
              </li>
              <li className="p">
                Assignment: You may not assign your rights or delegate your
                obligations under these Terms without the Company’s prior
                written consent. Any purported assignment contrary to this
                section will be null and void. We may assign or transfer any or
                all of our rights or obligations under these Terms, in whole or
                in part, with or without notice or obtaining your consent or
                approval.
              </li>
              <li className="p">
                Waiver: No waiver by us of a breach of any of the provisions of
                terms of these Terms shall be construed as a waiver of any
                preceding or succeeding breach of any of the provisions of these
                Terms.
              </li>
              <li className="p">
                Third Parties: There are no third-party beneficiaries to these
                Terms. Without limiting this section, users are not third-party
                beneficiaries to your rights under these Terms.
              </li>
            </ol>
          </li>
        </ol>
      </div>
    </div>
  </>
);
