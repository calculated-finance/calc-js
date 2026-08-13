import clsx from "clsx";
import { FC, useMemo, useState } from "react";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import { MsgWithdrawLiquidity, THOR } from "rujira.js";
import {
  Button,
  Decimal,
  Fiat,
  IconDenom,
  nFormatter,
  Numeric,
  TranslationProvider,
  useGlobalModalContext,
  useTranslation,
} from "rujira.ui";

import { MsgProvider, TxButton } from "../../common/components/TxButton";
import { RUNE } from "../../services/asset";
import { useMsgAssetFragment } from "../../services/msg";
import { Subscription } from "../../services/useNodeSubscription";
import { ThorchainPoolBalanceFragment$key } from "./__generated__/ThorchainPoolBalanceFragment.graphql";
import { ThorchainPoolBalanceWithDrawFragment$key } from "./__generated__/ThorchainPoolBalanceWithDrawFragment.graphql";
import { Icons } from "rujira.ui";

const fragment = graphql`
  fragment ThorchainPoolBalanceFragment on ThorchainLiquidityProvider {
    id
    asset {
      price {
        current
      }
      metadata {
        symbol
      }
    }
    assetRedeemValue
    runeRedeemValue
    units
    valueUsd
    ...ThorchainPoolBalanceWithDrawFragment
  }
`;

const subscription = graphql`
  subscription ThorchainPoolBalanceSubscription($id: ID!) {
    node(id: $id) {
      ... on ThorchainLiquidityProvider {
        assetRedeemValue
        runeRedeemValue
        units
      }
    }
  }
`;

export const ThorchainPoolBalance: FC<{
  asset: string;
  k?: ThorchainPoolBalanceFragment$key;
}> = ({ k, asset }) => {
  const { t } = useTranslation("strategies");
  const account = useFragment(fragment, k);
  const { showModal, hideModal } = useGlobalModalContext();

  return (
    <div className="gradient-card gradient-card--purple h-full p-3 flex dir-c bg-black">
      {account && <Subscription subscription={subscription} id={account.id} />}
      <h3 className="fs-16 lh-22 fw-400 color-grey">{t("myBalance")}</h3>
      <Fiat
        symbol="$"
        amount={BigInt(account?.valueUsd || 0)}
        decimals={8}
        className="fs-22 fs-md-32 condensed fw-500 mt-1"
      />
      <Fiat
        symbol={` ${t("shares")}`}
        symbolRight
        amount={BigInt(account?.units || 0)}
        decimals={8}
        className="fs-16 fs-md-18 lh-16 lh-md-18 condensed mt-1"
      />
      <div
        className={clsx({
          "flex ai-c": true,
          "mt-2": true,
          "mt-0.5": false,
        })}>
        <IconDenom denom={asset} className="h-2 w-2 mr-1" />
        <Decimal
          amount={BigInt(account?.assetRedeemValue || 0)}
          round={4}
          className="fs-16 fs-md-18 lh-16 lh-md-18 condensed color-grey"
        />
      </div>

      <div
        className={clsx({
          "flex ai-c": true,
          "mt-2": false,
          "mt-0.5": true,
        })}>
        <IconDenom denom="RUNE" className="h-2 w-2 mr-1" />
        <Decimal
          amount={BigInt(account?.runeRedeemValue || 0)}
          round={4}
          className="fs-16 fs-md-18 lh-16 lh-md-18 condensed color-grey"
        />
      </div>

      <Button
        disabled={!account?.units}
        onClick={() => {
          account &&
            showModal({
              //title: `Send ${symbol}`,
              backgroundClose: false,
              children: (
                <TranslationProvider namespace="strategies">
                  <Withdraw k={account} cancel={hideModal} />
                </TranslationProvider>
              ),
            });
        }}
        className="button--outline mt-1 w-full button--icon-right"
        label="Withdraw">
        <Icons.Split />
      </Button>
    </div>
  );
};

const withdrawFragment = graphql`
  fragment ThorchainPoolBalanceWithDrawFragment on ThorchainLiquidityProvider {
    assetAddress
    runeAddress
    asset {
      chain
      metadata {
        symbol
      }
      ...msgAssetFragment
    }
    units
    runeRedeemValue
    assetRedeemValue
  }
`;

const Withdraw: React.FC<{
  k: ThorchainPoolBalanceWithDrawFragment$key;
  cancel: () => void;
}> = ({ k, cancel }) => {
  const { t } = useTranslation("strategies");
  const [amount, setAmount] = useState(0n);
  const account = useFragment(withdrawFragment, k);
  const asset = useMsgAssetFragment(account.asset);
  const bps =
    amount === BigInt(account.units)
      ? 10000n
      : (amount * 10000n) / BigInt(account.units);
  const msg = useMemo(() => {
    if (!amount) return null;
    if (!account.runeAddress) return null;
    return new MsgWithdrawLiquidity(
      {
        address: account.runeAddress,
        network: THOR,
      },
      RUNE,
      0n,
      asset,
      bps
    );
  }, [bps, account]);

  return (
    <MsgProvider msg={msg}>
      <h2 className="h3 flex ai-c">{t("withdraw")}</h2>

      <div className="flex ai-c">
        <div className="condensed fs-14 color-grey fw-500">{t("amount")}</div>
        <button
          className="tag tag--borderless px-0.5 pointer ml-a"
          onClick={() => setAmount(BigInt(account.units))}>
          {t("shareBalance")}:{" "}
          <span className="color-white ml-0.5">
            {nFormatter(BigInt(account.units), 8)}
          </span>
        </button>
      </div>

      <div className="mt-1">
        <Numeric
          full
          amount={amount}
          initialZeroAsPlaceholder
          onChangeAmount={setAmount}
        />
      </div>

      <div className="flex ai-c mt-2">
        <IconDenom denom="RUNE" className="h-2 w-2 mr-1" />
        <Decimal
          amount={(BigInt(account.runeRedeemValue) * bps) / 10000n}
          round={4}
          className="fs-16 fs-md-18 lh-16 lh-md-18 condensed color-grey"
        />
      </div>

      <div className="flex ai-c mt-0.5">
        <IconDenom
          denom={account.asset.metadata.symbol}
          className="h-2 w-2 mr-1"
        />
        <Decimal
          amount={(BigInt(account.assetRedeemValue) * bps) / 10000n}
          round={4}
          className="fs-16 fs-md-18 lh-16 lh-md-18 condensed color-grey"
        />
      </div>

      <div className="modal__footer mt-4 px-3 py-2 flex ai-s wrap">
        <Button
          className="button--grey button--outline mr-1"
          onClick={cancel}
          label="Cancel"
        />
        <div className="block ml-a text-right">
          <TxButton
            className="button"
            label="Withdraw"
            onSuccess={() => cancel()}
          />
        </div>
      </div>
    </MsgProvider>
  );
};
