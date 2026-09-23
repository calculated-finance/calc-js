import clsx from "clsx";
import { FC, useMemo, useState } from "react";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import { MsgAddLiquidity } from "rujira.js";
import {
  DenomInput,
  Toggle,
  useLocale,
  useTranslation,
  Warning,
} from "rujira.ui";

import {
  BalanceProvider,
  usePreloadedBalance,
} from "../../common/components/Balance";
import { MsgProvider, TxButton } from "../../common/components/TxButton";
import { msgAssetFragment$key } from "../../services/__generated__/msgAssetFragment.graphql";
import { useAccounts } from "../../services/accounts";
import { RUNE } from "../../services/asset";
import { useMsgAssetFragment } from "../../services/msg";
import { ThorchainPoolDepositAccountFragment$key } from "./__generated__/ThorchainPoolDepositAccountFragment.graphql";
import { Icons } from "rujira.ui";
import exclamation from "rujira.ui/assets/images/exclamation.gif";

const accountFragment = graphql`
  fragment ThorchainPoolDepositAccountFragment on ThorchainLiquidityProvider {
    pendingAsset
    pendingRune
  }
`;

export const DepositThorchain: FC<{
  a: msgAssetFragment$key;
  acc?: ThorchainPoolDepositAccountFragment$key;
  ratio: bigint;
}> = ({ a, acc, ratio }) => {
  const asset = useMsgAssetFragment(a);
  const account = useFragment(accountFragment, acc);
  const pendingAsset = BigInt(account?.pendingAsset || 0);
  const [assetAmount, setAmount] = useState(pendingAsset);
  const { t } = useTranslation("strategies");

  return (
    <div className="card h-full p-3">
      <h3
        className={clsx({
          "fs-18 lh-22 fw-500": true,
          "color-grey": pendingAsset,
          "color-white": !pendingAsset,
        })}>
        {t("depositAsset")}
      </h3>
      <Warning
        className="warning--sm mt-2 condensed flex ai-c mx-a"
        color="orange">
        <img
          src={exclamation}
          alt=""
          className="filter-orange block no-shrink"
          style={{ width: "2rem", height: "2rem" }}
        />
        <div className="text-left fs-14 mr-1">
          Support for THORChain's CLP is being deprecated, LPs have been set to
          withdrawal only
        </div>
      </Warning>
    </div>
  );

  return (
    <div className="card h-full p-3">
      <BalanceProvider asset={asset}>
        <DepositAsset
          amount={assetAmount}
          setAmount={setAmount}
          ratio={ratio}
          a={a}
        />
      </BalanceProvider>
      <Icons.Plus className="w-3 h-a my-1.5 mx-a color-grey block" />
      <BalanceProvider asset={RUNE}>
        <DepositRune ratio={ratio} a={a} assetAmount={assetAmount} />
      </BalanceProvider>
    </div>
  );
};

const DepositAsset: FC<{
  a: msgAssetFragment$key;
  acc?: ThorchainPoolDepositAccountFragment$key;
  ratio: bigint;
  amount: bigint;
  setAmount: (v: bigint) => void;
}> = ({ a, acc, amount, setAmount }) => {
  const { t } = useTranslation("strategies");
  const { toRoot } = useLocale();
  const [accept, setAccept] = useState(false);
  const { balance, account } = usePreloadedBalance();
  const asset = useMsgAssetFragment(a);
  const tcAccount = useFragment(accountFragment, acc);
  const touHref = toRoot("tou");

  const pendingAsset = BigInt(tcAccount?.pendingAsset || 0);
  // const runeRequired = (amount * ratio) / 10n ** 12n;

  const msgDepositAsset = useMemo(() => {
    if (!accept) return null;
    return pendingAsset
      ? null
      : account && amount
        ? new MsgAddLiquidity(
            { address: account.address, network: account.asset.chain },
            asset,
            amount,
            asset,
            account.address
          )
        : null;
  }, [accept, pendingAsset, amount, account]);

  return (
    <MsgProvider msg={msgDepositAsset}>
      <h3
        className={clsx({
          "fs-18 lh-22 fw-500": true,
          "color-grey": pendingAsset,
          "color-white": !pendingAsset,
        })}>
        {t("depositAsset")}
      </h3>
      <DenomInput
        disabled={!!pendingAsset}
        symbol={asset.metadata.symbol}
        decimals={8}
        className="mt-2"
        amount={amount}
        onChangeAmount={setAmount}
        max={balance?.balance || 0n}
      />
      <div className="flex wrap ai-s mt-1">
        <Toggle
          checked={accept}
          onChange={(e) => {
            setAccept(e.currentTarget.checked);
          }}
          className="mt-2 toggle--small ai-c">
          <span className="toggle__label">
            I accept the{" "}
            <a
              href={touHref}
              target="_blank"
              className="color-white hover-primary1">
              terms of use
            </a>
          </span>
        </Toggle>
        <div className="mt-1 block ml-a text-right">
          <TxButton hideSimulation label={`Deposit ${asset.metadata.symbol}`} />
        </div>
      </div>
    </MsgProvider>
  );
};

export const DepositRune: FC<{
  a: msgAssetFragment$key;
  acc?: ThorchainPoolDepositAccountFragment$key;
  ratio: bigint;
  assetAmount: bigint;
}> = ({ a, acc, ratio, assetAmount }) => {
  const { t } = useTranslation("strategies");
  const asset = useMsgAssetFragment(a);
  const { selected } = useAccounts();
  const tcAccount = useFragment(accountFragment, acc);

  const pendingAsset = tcAccount?.pendingAsset || 0n;
  const pendingRune = tcAccount?.pendingRune || 0n;

  const { balance, account } = usePreloadedBalance();
  const runeRequired = (assetAmount * ratio) / 10n ** 12n;

  const msgDepositRune = useMemo(
    () =>
      pendingAsset
        ? pendingRune
          ? null
          : account && assetAmount
            ? new MsgAddLiquidity(
                { address: account.address, network: account.asset.chain },
                RUNE,
                runeRequired,
                asset,
                account.address
              )
            : null
        : null,
    [pendingAsset, runeRequired, selected, pendingRune]
  );

  return (
    <MsgProvider msg={msgDepositRune}>
      <h3
        className={clsx({
          "fs-18 lh-22 fw-500": true,
          "color-grey": !pendingAsset,
          "color-white": pendingAsset,
        })}>
        {t("stepTwoDepositRune")}
      </h3>

      <DenomInput
        readOnly={true}
        symbol="RUNE"
        amount={runeRequired}
        decimals={8}
        className="mt-2"
        onChangeAmount={() => {}}
        max={balance?.balance || 0n}
      />

      <div className="flex wrap ai-s mt-1">
        <div className="mt-1 block ml-a text-right">
          <TxButton
            hideSimulation
            disabled={!pendingAsset || !!pendingRune}
            label="Deposit RUNE"
          />
        </div>
      </div>
    </MsgProvider>
  );
};
