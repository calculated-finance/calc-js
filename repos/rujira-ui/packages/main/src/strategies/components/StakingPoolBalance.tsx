import clsx from "clsx";
import { FC, useEffect, useMemo, useState } from "react";
import {
  useFragment,
  useRefetchableFragment,
  useRelayEnvironment,
} from "react-relay";
import { graphql, requestSubscription } from "relay-runtime";
import { Account, MsgExecute, MsgSend, signers } from "rujira.js";
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
import { RewardModeChanger } from "./RewardModeChanger";
import { type RewardModeSelectorPoolContext } from "./RewardModeSelector";
import { StakingPoolBalanceFragment$key } from "./__generated__/StakingPoolBalanceFragment.graphql";
import { StakingPoolBalanceRewardsFragment$key } from "./__generated__/StakingPoolBalanceRewardsFragment.graphql";
import { StakingPoolBalanceTransferFragment$key } from "./__generated__/StakingPoolBalanceTransferFragment.graphql";
import { StakingPoolBalanceWithdrawFragment$key } from "./__generated__/StakingPoolBalanceWithdrawFragment.graphql";

export const stakingPoolBalanceFragment = graphql`
  fragment StakingPoolBalanceFragment on StakingAccount
  @refetchable(queryName: "StakingPoolBalanceQuery") {
    id
    account
    liquidSize {
      amount
      asset {
        ...msgAssetFragment
      }
    }
    bonded {
      amount
    }
    valueUsd
    pool {
      bondAsset {
        metadata {
          symbol
        }
      }
    }
    ...StakingPoolBalanceWithdrawFragment
    ...StakingPoolBalanceRewardsFragment
    ...StakingPoolBalanceTransferFragment
    ...StakingPoolBalanceWithdrawFragment
  }
`;

const nodeSubscription = graphql`
  subscription StakingPoolBalanceNodeSubscription($id: ID!) {
    node(id: $id) {
      ... on StakingAccount {
        liquidSize {
          amount
        }
        liquidShares {
          amount
        }
        valueUsd
      }
    }
  }
`;

const accountSubscription = graphql`
  subscription StakingPoolBalanceAccountSubscription($owner: Address!) {
    stakingAccountUpdated(owner: $owner) {
      ... on StakingAccount {
        bonded {
          amount
        }
        pendingRevenue {
          amount
        }
        liquidSize {
          amount
        }
        valueUsd
      }
    }
  }
`;

export const StakingPoolBalance: FC<{
  k?: StakingPoolBalanceFragment$key;
  bond: string;
  reward: string;
  poolContext: RewardModeSelectorPoolContext;
  swapTargetOptions: string[];
}> = ({ k, bond, reward, poolContext, swapTargetOptions }) => {
  const { t } = useTranslation("strategies");
  const [account, refetch] = useRefetchableFragment(
    stakingPoolBalanceFragment,
    k
  );
  const { showModal, hideModal } = useGlobalModalContext();

  const shareAsset = useMsgAssetFragment(account?.liquidSize.asset);

  const total = account
    ? BigInt(account.bonded.amount) + BigInt(account.liquidSize.amount)
    : 0n;

  const unstake = (type: "account" | "liquid") => {
    showModal({
      title: `Unstake ${bond} ${type === "account" ? "(Yielding)" : "(Auto-Compounding)"}`,
      backgroundClose: false,
      children: (
        <TranslationProvider namespace="strategies">
          <WithdrawModal
            k={account || undefined}
            close={hideModal}
            type={type}
          />
        </TranslationProvider>
      ),
    });
  };

  const env = useRelayEnvironment();

  useEffect(() => {
    if (!account) return;
    refetch({});
  }, []);

  useEffect(() => {
    if (!account) return;
    const a = requestSubscription(env, {
      subscription: nodeSubscription,
      variables: { id: account.id },
    });
    const b = requestSubscription(env, {
      subscription: accountSubscription,
      variables: { owner: account.account },
    });

    return () => {
      a.dispose();
      b.dispose();
    };
  }, [account]);

  const bondedAmount = BigInt(account?.bonded.amount || 0);

  return (
    <div className="gradient-card gradient-card--purple h-full p-3 flex dir-c bg-black">
      <h3 className="fs-16 lh-22 fw-400 color-grey">{t("myTotalBalance")}</h3>
      <Fiat
        symbol="$"
        amount={BigInt(account?.valueUsd || 0)}
        decimals={8}
        className="fs-22 fs-md-32 condensed fw-500 mt-1"
      />
      <div className="flex ai-c mt-0.5 flex-wrap gap-x-1">
        <IconDenom denom={bond} className="h-2 w-2 mr-1" />
        <Decimal
          amount={total}
          round={4}
          className="fs-16 fs-md-18 lh-16 lh-md-18 condensed color-grey"
          symbol={bond}
        />
      </div>

      <hr className="hr mt-3 mb-3 opacity-4" />

      <div>
        <h4 className="fs-16 lh-22 fw-400 color-grey">{t("liquidStaking")}</h4>
        <div className="flex ai-c mt-0.5">
          <IconDenom denom={bond} className="h-2 w-2 mr-1" />
          <Decimal
            amount={account?.liquidSize.amount || 0n}
            round={4}
            className="fs-16 fs-md-18 lh-16 lh-md-18 condensed color-grey"
            symbol={bond}
          />
        </div>
        <Button
          disabled={!account?.liquidSize.amount}
          onClick={() => {
            shareAsset &&
              showModal({
                backgroundClose: false,
                children: (
                  <TranslationProvider namespace="strategies">
                    <Send k={account || undefined} cancel={hideModal} />
                  </TranslationProvider>
                ),
              });
          }}
          className="button--outline button--grey mt-3 w-full button--icon-right"
          label="Transfer">
          <Icons.ArrowRight />
        </Button>
        <Button
          disabled={!account?.liquidSize.amount}
          onClick={() => unstake("liquid")}
          className="button--outline mt-1 w-full button--icon-right"
          label="Unstake">
          <Icons.Split />
        </Button>
      </div>

      <hr className="hr mt-3 mb-3 opacity-4" />

      <div>
        <h4 className="fs-16 lh-22 fw-400 color-grey">
          {t("accountStakingBalanceLabel")}
        </h4>
        <div className="flex ai-c mt-0.5">
          <IconDenom denom={bond} className="h-2 w-2 mr-1" />
          <Decimal
            amount={bondedAmount}
            round={4}
            className="fs-16 fs-md-18 lh-16 lh-md-18 condensed color-grey"
            symbol={bond}
          />
        </div>

        <Rewards k={account || undefined} reward={reward} />

        <Button
          disabled={bondedAmount === 0n}
          onClick={() => unstake("account")}
          className="button--outline mt-1 w-full button--icon-right"
          label="Unstake">
          <Icons.Split />
        </Button>

        <RewardModeChanger
          poolContext={poolContext}
          swapTargetOptions={swapTargetOptions}
          bondedAmount={bondedAmount}
          bondSymbol={bond}
          showModal={showModal}
          hideModal={hideModal}
        />
      </div>
    </div>
  );
};

const transferFragment = graphql`
  fragment StakingPoolBalanceTransferFragment on StakingAccount {
    pool {
      bondAsset {
        metadata {
          symbol
        }
        price {
          current
        }
      }

      receiptAsset {
        ...msgAssetFragment
        metadata {
          symbol
        }
      }
    }
    liquidSize {
      amount
    }
    liquidShares {
      amount
    }
  }
`;

const Send: React.FC<{
  k?: StakingPoolBalanceTransferFragment$key;
  cancel: () => void;
}> = ({ cancel, k }) => {
  const { t } = useTranslation("strategies");
  const data = useFragment(transferFragment, k);
  const asset = useMsgAssetFragment(data?.pool.receiptAsset);
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState(0n);
  const balance = BigInt(data?.liquidSize.amount || 0n);
  const { selected } = useAccounts();

  const msg = useMemo(() => {
    if (!amount) return null;
    if (!data) return null;
    if (!address) return null;
    if (!selected) return null;
    if (!asset) return null;
    const shares =
      amount === balance
        ? BigInt(data?.liquidShares.amount)
        : (BigInt(data?.liquidShares.amount) * amount) / balance;

    return new MsgSend(
      Account.fromAddress(selected.address),
      asset,
      shares,
      address.trim()
    );
  }, [amount, address, data]);

  return (
    <MsgProvider msg={msg}>
      <h2 className="h3 flex ai-c">
        {t("sendStaked")} {data?.pool.bondAsset.metadata.symbol}
        <IconDenom
          denom={data?.pool.bondAsset.metadata.symbol || ""}
          className="w-4 h-4 block ml-1"
        />
      </h2>

      <div className="text-right">
        <button
          className="tag tag--borderless px-0.5 pointer"
          onClick={() => setAmount(balance)}>
          Staked {data?.pool.bondAsset.metadata.symbol} {t("balance")}:{" "}
          <span className="color-white ml-0.5">{nFormatter(balance, 8)}</span>
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
              amount={amount}
              initialZeroAsPlaceholder
              onChangeAmount={setAmount}
              fiat={{ price: data?.pool.bondAsset.price?.current, symbol: "$" }}
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
  fragment StakingPoolBalanceWithdrawFragment on StakingAccount {
    pool {
      address
      bondAsset {
        price {
          current
        }
        variants {
          native {
            denom
          }
        }
      }
    }
    bonded {
      amount
      asset {
        metadata {
          symbol
        }
      }
    }
    liquidSize {
      amount
    }
    liquidShares {
      amount
    }
  }
`;

export const WithdrawModal: FC<{
  k?: StakingPoolBalanceWithdrawFragment$key;
  type: "account" | "liquid";
  close: () => void;
}> = ({ k, close, type }) => {
  const data = useFragment(withdrawFragment, k);

  const balance = BigInt(
    type === "account" ? data?.bonded.amount || 0 : data?.liquidSize.amount || 0
  );
  const [amount, setAmount] = useState(0n);
  const { selected } = useAccounts();

  const msg = useMemo(() => {
    if (!selected) return null;
    if (!amount) return null;
    if (!data) return null;
    if (type === "account")
      return new MsgExecute(
        Account.fromAddress(selected.address),
        [],
        data.pool.address,
        {
          account: { withdraw: { amount: amount.toString() } },
        }
      );

    const liquidSize = BigInt(data.liquidSize.amount);
    if (liquidSize === 0n) return null;
    const shares =
      amount === liquidSize
        ? BigInt(data?.liquidShares.amount)
        : (BigInt(data?.liquidShares.amount) * amount) / liquidSize;

    return new MsgExecute(
      Account.fromAddress(selected.address),
      signers.cosmos.coins(
        shares.toString(),
        `x/staking-${data.pool.bondAsset.variants.native?.denom}`
      ),
      data.pool.address,
      { liquid: { unbond: {} } }
    );
  }, [amount, data, type]);

  return (
    <MsgProvider msg={msg}>
      <div
        className="text-right fs-12 condensed color-grey py-1 px-0.5 pointer"
        onClick={() => setAmount(balance)}>
        Staked Balance:{" "}
        <span className="color-white">{nFormatter(balance, 6)}</span>
      </div>
      <Numeric
        label="Amount"
        amount={amount}
        initialZeroAsPlaceholder
        onChangeAmount={setAmount}
        className=""
        fiat={{ price: data?.pool.bondAsset.price?.current, symbol: "$" }}
      />
      <p className="fs-14 color-grey mt-2 balance">
        Please note that there is no unbonding time, unstaking will be instant
        {type === "account" &&
          " and unclaimed rewards will be automatically claimed"}
        .
      </p>
      <div className="modal__footer mt-4 px-3 py-2 flex ai-s jc-e wrap">
        <Button
          className="button--grey button--outline"
          onClick={close}
          label="Cancel"
        />
        <div className="block ml-a text-right">
          <TxButton label="Confirm" onSuccess={close} hideSimulation />
        </div>
      </div>
    </MsgProvider>
  );
};

const rewardsFragment = graphql`
  fragment StakingPoolBalanceRewardsFragment on StakingAccount {
    pool {
      address
      revenueAsset {
        metadata {
          symbol
        }
      }
    }
    pendingRevenue {
      amount
    }
  }
`;

const Rewards: FC<{
  k?: StakingPoolBalanceRewardsFragment$key;
  reward: string;
}> = ({ k, reward }) => {
  const data = useFragment(rewardsFragment, k);
  const rewards = BigInt(data?.pendingRevenue.amount || 0);
  const { selected } = useAccounts();

  const msg =
    rewards && data && selected
      ? new MsgExecute(
          Account.fromAddress(selected.address),
          [],
          data.pool.address,
          { account: { claim: {} } }
        )
      : null;

  return (
    <MsgProvider msg={msg}>
      <div className="mt-2">
        <h4 className="fs-16 lh-22 fw-400 color-grey">Unclaimed Rewards</h4>
        <div
          className={clsx({
            "flex ai-c mt-0.5": true,
            "opacity-8": !rewards,
          })}>
          <IconDenom className="w-3.5" denom={reward} />

          <Decimal
            amount={rewards}
            round={4}
            className={clsx({
              "fs-28 fw-500 ml-1": true,
              "color-grey": !rewards,
            })}
            subscript
          />
        </div>

        <TxButton
          disabled={!rewards}
          hideSimulation
          className="button--outline button--blue w-full mt-1.5"
          label="Claim"
        />
      </div>
    </MsgProvider>
  );
};
