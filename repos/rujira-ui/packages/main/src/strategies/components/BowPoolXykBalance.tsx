import clsx from "clsx";
import { FC, useState } from "react";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import { Account, Asset, Msg, MsgSend } from "rujira.js";
import {
  Button,
  Decimal,
  Fiat,
  IconDenom,
  Input,
  nFormatter,
  Numeric,
  TranslationProvider,
  useGlobalModalContext,
  useTranslation,
} from "rujira.ui";

import { Icons } from "rujira.ui";
import { MsgProvider, TxButton } from "../../common/components/TxButton";
import { useAccounts } from "../../services/accounts";
import { useMsgAssetFragment } from "../../services/msg";
import { Subscription } from "../../services/useNodeSubscription";
import { BowPoolXykBalanceFragment$key } from "./__generated__/BowPoolXykBalanceFragment.graphql";
import { BowPoolXykBalanceWithdrawFragment$key } from "./__generated__/BowPoolXykBalanceWithdrawFragment.graphql";

const fragment = graphql`
  fragment BowPoolXykBalanceFragment on BowAccount {
    id
    account
    shares {
      amount
      asset {
        ...msgAssetFragment
      }
    }
    value {
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
    ...BowPoolXykBalanceWithdrawFragment
  }
`;

const subscription = graphql`
  subscription BowPoolXykBalanceSubscription($id: ID!) {
    node(id: $id) {
      ... on BowAccount {
        id
        shares {
          amount
        }
        value {
          amount
        }
      }
    }
  }
`;

export const BowPoolXykBalance: FC<{
  k?: BowPoolXykBalanceFragment$key;
  id?: string;
  toMsg: (amount: BigInt, asset: Asset) => Msg | null;
}> = ({ k, toMsg, id }) => {
  const { t } = useTranslation("strategies");
  const account = useFragment(fragment, k);
  const { showModal, hideModal } = useGlobalModalContext();
  const shareAsset = useMsgAssetFragment(account?.shares.asset);
  return (
    <div className="gradient-card gradient-card--purple h-full p-3 flex dir-c bg-black">
      {id && <Subscription id={id} subscription={subscription} />}
      <h3 className="fs-16 lh-22 fw-400 color-grey">{t("myBalance")}</h3>
      <Fiat
        symbol="$"
        amount={BigInt(account?.valueUsd || 0)}
        decimals={8}
        className="fs-22 fs-md-32 condensed fw-500 mt-1"
      />
      <Decimal
        symbol={` ${t("shares")}`}
        amount={BigInt(account?.shares.amount || 0)}
        decimals={8}
        className="fs-16 fs-md-18 lh-16 lh-md-18 condensed mt-1"
        subscript
      />
      {account?.value.map((x, i) => (
        <div
          key={x.asset.metadata.symbol}
          className={clsx({
            "flex ai-c": true,
            "mt-2": i === 0,
            "mt-0.5": i > 0,
          })}>
          <IconDenom denom={x.asset.metadata.symbol} className="h-2 w-2 mr-1" />
          <Decimal
            amount={BigInt(x.amount)}
            round={4}
            className="fs-16 fs-md-18 lh-16 lh-md-18 condensed color-grey"
            subscript
          />
        </div>
      ))}

      <Button
        disabled={!account || !account?.shares.amount}
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
                    balance={BigInt(account?.shares.amount || 0)}
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
        disabled={!account || !account?.shares.amount}
        onClick={() => {
          account &&
            showModal({
              //title: `Send ${symbol}`,
              backgroundClose: false,
              children: (
                <TranslationProvider namespace="strategies">
                  <Withdraw k={account} cancel={hideModal} toMsg={toMsg} />
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
}> = ({ asset, symbol, cancel, balance }) => {
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
        <div className="col-8 flex ai-c">
          <Input
            type="text"
            value={address}
            containerClassName="grow"
            onChange={(e) => {
              setAddress(e.currentTarget.value);
            }}
          />
        </div>
        <div className="col-4">
          <div className="flex ai-c">
            <Numeric
              full
              decimals={asset.metadata.decimals}
              amount={amount}
              initialZeroAsPlaceholder
              onChangeAmount={setAmount}
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
  fragment BowPoolXykBalanceWithdrawFragment on BowAccount {
    shares {
      amount
      asset {
        ...msgAssetFragment
      }
    }
    value {
      amount
      asset {
        metadata {
          symbol
        }
      }
    }
  }
`;

const Withdraw: React.FC<{
  k: BowPoolXykBalanceWithdrawFragment$key;
  cancel: () => void;
  toMsg: (amount: BigInt, asset: Asset) => Msg | null;
}> = ({ k, cancel, toMsg }) => {
  const { t } = useTranslation("strategies");
  const [amount, setAmount] = useState(0n);
  const account = useFragment(withdrawFragment, k);
  const asset = useMsgAssetFragment(account.shares.asset);
  const msg = toMsg(amount, asset);
  const balance = BigInt(account.shares.amount);

  return (
    <MsgProvider msg={msg}>
      <h2 className="h3 flex ai-c">
        {t("withdraw")} {asset.metadata.symbol}
        <IconDenom
          denom={asset.metadata.symbol}
          className="w-4 h-4 block ml-1"
        />
      </h2>

      <div className="flex ai-c">
        <div className="condensed fs-14 color-grey fw-500">{t("amount")}</div>
        <button
          className="tag tag--borderless px-0.5 pointer ml-a"
          onClick={() => setAmount(balance)}>
          {asset.metadata.symbol} {t("balance")}:{" "}
          <span className="color-white ml-0.5">
            {nFormatter(balance, 8, asset.metadata.decimals)}
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
        />
      </div>

      {account?.value.map((x, i) => {
        const scaled = (BigInt(x.amount) * amount) / balance;
        return (
          <div
            key={x.asset.metadata.symbol}
            className={clsx({
              "flex ai-c": true,
              "mt-2": i === 0,
              "mt-0.5": i > 0,
            })}>
            <IconDenom
              denom={x.asset.metadata.symbol}
              className="h-2 w-2 mr-1"
            />
            <Decimal
              amount={scaled}
              round={4}
              className="fs-16 fs-md-18 lh-16 lh-md-18 condensed color-grey"
            />
          </div>
        );
      })}

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
