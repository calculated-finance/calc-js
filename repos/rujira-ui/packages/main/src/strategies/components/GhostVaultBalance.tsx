import clsx from "clsx";
import { FC, useMemo, useState } from "react";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import { Account, Asset, MsgExecute, MsgSend, signers } from "rujira.js";
import {
  Button,
  Decimal,
  Fiat,
  IconDenom,
  Input,
  nFormatter,
  Numeric,
  toFiatAmount,
  TranslationProvider,
  useGlobalModalContext,
  useTranslation,
} from "rujira.ui";

import { Icons } from "rujira.ui";
import { MsgProvider, TxButton } from "../../common/components/TxButton";
import { useAccounts } from "../../services/accounts";
import { useMsgAssetFragment } from "../../services/msg";
import { Subscription } from "../../services/useNodeSubscription";
import { ChunkSlider } from "../../trade/components/InputQuantity";
import { GhostVaultBalanceFragment$key } from "./__generated__/GhostVaultBalanceFragment.graphql";
import { GhostVaultBalanceWithdrawFragment$key } from "./__generated__/GhostVaultBalanceWithdrawFragment.graphql";

const fragment = graphql`
  fragment GhostVaultBalanceFragment on GhostVaultAccount {
    id
    account
    receiptShares: shares {
      amount
      asset {
        ...msgAssetFragment
      }
    }
    receiptValue: value {
      amount
      asset {
        price {
          current
        }
        metadata {
          symbol
        }
      }
    }
    valueUsd
    ...GhostVaultBalanceWithdrawFragment
  }
`;

const subscription = graphql`
  subscription GhostVaultBalanceSubscription($id: ID!) {
    node(id: $id) {
      ... on GhostVaultAccount {
        id
        receiptShares: shares {
          amount
        }
        receiptValue: value {
          amount
        }
        valueUsd
      }
    }
  }
`;

export const GhostVaultBalance: FC<{
  symbol: string;
  k?: GhostVaultBalanceFragment$key;
}> = ({ symbol, k }) => {
  const { t } = useTranslation("strategies");
  const account = useFragment(fragment, k);

  const { showModal, hideModal } = useGlobalModalContext();
  const shareAsset = useMsgAssetFragment(account?.receiptShares.asset);
  return (
    <div className="gradient-card gradient-card--purple p-3 flex dir-c bg-black">
      {account && <Subscription id={account.id} subscription={subscription} />}
      <h3 className="fs-16 lh-22 fw-400 color-grey">{t("myBalance")}</h3>
      <Fiat
        symbol="$"
        amount={BigInt(account?.valueUsd || 0)}
        decimals={8}
        className="fs-22 fs-md-32 condensed fw-500 mt-1"
      />
      <Decimal
        symbol={` ${t("shares")}`}
        amount={BigInt(account?.receiptShares.amount || 0)}
        decimals={8}
        className="fs-16 fs-md-18 lh-16 lh-md-18 condensed mt-1"
        subscript
        clip
      />
      <div className="flex ai-c mt-2">
        <IconDenom denom={symbol} className="h-2 w-2 mr-1" />
        <Decimal
          amount={BigInt(account?.receiptValue.amount || 0)}
          round={4}
          className="fs-16 fs-md-18 lh-16 lh-md-18 condensed color-grey"
          subscript
          clip
        />
      </div>

      <Button
        disabled={!account || !account?.receiptShares.amount}
        onClick={() => {
          shareAsset &&
            showModal({
              //title: `Send ${symbol}`,
              backgroundClose: false,
              children: (
                <TranslationProvider namespace="strategies">
                  <Send
                    asset={shareAsset}
                    symbol={shareAsset.metadata.symbol}
                    cancel={hideModal}
                    balance={BigInt(account?.receiptShares.amount || 0)}
                    price={account?.receiptValue.asset.price?.current}
                  />
                </TranslationProvider>
              ),
            });
        }}
        className="button--outline button--grey mt-3 w-full button--icon-right"
        label="Transfer">
        <Icons.ArrowRight />
      </Button>
      <Button
        disabled={!account || !account?.receiptShares.amount}
        onClick={() => {
          account &&
            showModal({
              //title: `Send ${symbol}`,
              backgroundClose: false,
              children: (
                <TranslationProvider namespace="strategies">
                  <GhostVaultWithdraw k={account} cancel={hideModal} />
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

const Send: React.FC<{
  symbol: string;
  asset: Asset;
  balance: bigint;
  cancel: () => void;
  price?: bigint | null;
}> = ({ asset, symbol, cancel, balance, price }) => {
  const { t } = useTranslation("strategies");
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState(0n);
  const { selected } = useAccounts();

  const msg =
    address && amount && selected
      ? new MsgSend(
          Account.fromAddress(selected.address),
          asset,
          amount,
          address.trim()
        )
      : null;

  return (
    <MsgProvider msg={msg}>
      <h2 className="h3 flex ai-c">
        {t("common:send")} {symbol}
        <IconDenom
          denom={asset.metadata.symbol}
          className="w-4 h-4 block ml-1"
        />
      </h2>

      <div className="text-right">
        <button
          className="tag tag--borderless px-0.5 pointer"
          onClick={() => setAmount(balance)}>
          {symbol} {t("balance")}:{" "}
          <span className="color-white ml-0.5">
            {nFormatter(balance, 8, asset.metadata.decimals)}
          </span>
        </button>
      </div>

      <div className="row pad-mini mt-1.5 condensed fs-14 color-grey">
        <div className="col-8 fw-500">{t("common:rujiraAddress")}</div>
        <div className="col-4 text-right mr-0.5  fw-500">{t("amount")}</div>
      </div>
      <div className="row pad-mini mt-1">
        <div className="col-8 flex">
          <Input
            type="text"
            value={address}
            containerClassName="grow h-full"
            onChange={(e) => {
              setAddress(e.currentTarget.value);
            }}
          />
        </div>
        <div className="col-4">
          <div className="flex">
            <Numeric
              full
              decimals={asset.metadata.decimals}
              amount={amount}
              initialZeroAsPlaceholder
              onChangeAmount={setAmount}
              fiat={{ price, symbol: "$" }}
            />
          </div>
        </div>
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
            label="Send"
            onSuccess={() => cancel()}
          />
        </div>
      </div>
    </MsgProvider>
  );
};

const withdrawFragment = graphql`
  fragment GhostVaultBalanceWithdrawFragment on GhostVaultAccount {
    vault {
      address
    }
    receiptShares: shares {
      amount
      asset {
        ...msgAssetFragment
      }
    }
    receiptValue: value {
      amount
      asset {
        metadata {
          symbol
          decimals
        }
        price {
          current
        }
      }
    }
  }
`;

export const GhostVaultWithdraw: React.FC<{
  k: GhostVaultBalanceWithdrawFragment$key;
  cancel: () => void;
}> = ({ k, cancel }) => {
  const { t } = useTranslation("strategies");
  const [amount, setAmount] = useState(0n);
  const account = useFragment(withdrawFragment, k);
  const asset = useMsgAssetFragment(account.receiptShares.asset);
  const sharesBalance = BigInt(account.receiptShares.amount);
  const sharesValue = BigInt(account.receiptValue.amount);
  const nextBalance = amount >= sharesValue ? 0n : sharesValue - amount;
  const { selected } = useAccounts();

  const withdrawalShares = useMemo(() => {
    return amount === sharesValue
      ? sharesBalance.toString()
      : ((amount * sharesBalance) / sharesValue).toString();
  }, [amount]);

  const msg = useMemo(
    () =>
      amount && asset.variants?.native?.denom && selected
        ? new MsgExecute(
            Account.fromAddress(selected.address),
            signers.cosmos.coins(withdrawalShares, asset.variants.native.denom),
            account.vault.address,
            { withdraw: {} }
          )
        : null,
    [amount, asset.variants?.native?.denom, account.vault.address]
  );

  return (
    <MsgProvider msg={msg}>
      <h2 className="h3 flex ai-b mb-0">
        <IconDenom
          denom={account.receiptValue.asset.metadata.symbol}
          className="as-c w-4 h-4 block mr-1 no-shrink"
        />
        {t("withdraw")} {account.receiptValue.asset.metadata.symbol}
      </h2>

      <div className="flex ai-c mt-2">
        <div className="condensed fs-12 color-grey mt-0.5">{t("amount")}</div>
        <button
          className="tag tag--borderless px-0.5 pointer ml-a"
          onClick={() => setAmount(sharesValue)}>
          {account.receiptValue.asset.metadata.symbol} {t("balance")}:{" "}
          <span className="color-white ml-0.5">
            {nFormatter(
              sharesValue,
              8,
              account.receiptValue.asset.metadata.decimals
            )}
          </span>
        </button>
      </div>

      <div className="mt-1">
        <Numeric
          full
          decimals={asset.metadata.decimals}
          amount={amount}
          initialZeroAsPlaceholder
          onChangeAmount={setAmount}
          fiat={{
            price: account.receiptValue.asset.price?.current,
            symbol: "$",
          }}
        />
      </div>
      <div className="flex ai-c mt-1">
        <a
          className="fs-12 condensed fw-500 color-grey hover-white mr-0.5 pointer"
          onClick={() => setAmount(0n)}>
          0%
        </a>
        <ChunkSlider amount={amount} setAmount={setAmount} max={sharesValue} />
        <a
          className="fs-12 condensed fw-500 color-grey hover-white ml-0.5 pointer"
          onClick={() => setAmount(sharesValue)}>
          100%
        </a>
      </div>

      <GhostVaultBalancePreview
        className="mt-2"
        current={sharesValue}
        next={nextBalance}
        decimals={account.receiptValue.asset.metadata.decimals}
        price={account.receiptValue.asset.price?.current}
        symbol={account.receiptValue.asset.metadata.symbol}
      />

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
            hideSimulation
          />
        </div>
      </div>
    </MsgProvider>
  );
};

export const GhostVaultBalancePreview: FC<{
  current: bigint;
  next: bigint;
  decimals: number;
  price?: bigint | null;
  symbol: string;
  className?: string;
}> = ({ current, next, decimals, price, symbol, className }) => {
  const { t } = useTranslation("strategies");
  const rows = [
    { label: t("currentBalance"), amount: current },
    { label: t("newBalance"), amount: next },
  ];

  return (
    <div className={clsx("row wrap condensed fs-14 px-2 gap-y-1", className)}>
      {rows.map(({ label, amount }) => (
        <div className="col-12 flex wrap ai-c jc-sb gap-1" key={label}>
          <span className="color-grey fw-500">{label}:</span>
          <span className="text-right color-white nowrap">
            <Decimal
              amount={amount}
              decimals={decimals}
              round={6}
              symbol={symbol}
              as="span"
              className="color-white"
              symbolClassName="color-grey fs-14 condensed fw-500"
              clip
              subscript
            />
            <span className="color-grey ml-0.5">(</span>
            <Fiat
              amount={toFiatAmount(price, amount) ?? 0n}
              decimals={8}
              symbol="$"
              as="span"
              className="color-grey fs-12"
            />
            <span className="color-grey">)</span>
          </span>
        </div>
      ))}
    </div>
  );
};
