import clsx from "clsx";
import { FC, useMemo, useState } from "react";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import { Account, MsgExecute } from "rujira.js";
import {
  Button,
  Decimal,
  IconDenom,
  nFormatter,
  Numeric,
  TranslationProvider,
  useGlobalModalContext,
  useTranslation,
} from "rujira.ui";
//import exclamation from "rujira.ui/assets/images/exclamation.gif";

import { Icons } from "rujira.ui";
import { MsgProvider, TxButton } from "../../common/components/TxButton";
import { usePreloadedAccountData } from "../../services/accountData";
import { useAccounts } from "../../services/accounts";
import { useNodeSubscription } from "../../services/useNodeSubscription";
import {
  BalanceAccountFragment$data,
  BalanceAccountFragment$key,
} from "./__generated__/BalanceAccountFragment.graphql";
import { BalanceFragment$key } from "./__generated__/BalanceFragment.graphql";

const fragment = graphql`
  fragment BalanceFragment on Account {
    merge {
      accounts {
        pool {
          address
        }
        ...BalanceAccountFragment
      }
    }
  }
`;

export const Balance: FC = () => {
  const { t } = useTranslation("merge");
  const { accountData } = usePreloadedAccountData();
  const data = useFragment<BalanceFragment$key>(fragment, accountData);

  if (!data) return null;
  return (
    <>
      <h2 className="h2 mt-10">{t("myMergeBalance")}</h2>

      <div className="relative card px-3 pb-3 mt-2">
        <div className="row wrap pad-mini">
          {data?.merge?.accounts?.map((x) => (
            <AccountC key={x.pool.address} k={x} />
          ))}
          {!data.merge && (
            <p className="fs-14 fw-500 mx-a color-grey">
              {t("errorLoadingBalances")}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

const accountFragment = graphql`
  fragment BalanceAccountFragment on MergeAccount {
    id
    pool {
      address
      mergeAsset {
        metadata {
          symbol
        }
      }
      status {
        shareValue
        shareValueChange
      }
    }
    shares
    size {
      amount
    }
  }
`;

const subscription = graphql`
  subscription BalanceMergeSubscription($id: ID!) {
    node(id: $id) {
      ... on MergeAccount {
        shares
        size {
          amount
        }
      }
    }
  }
`;

const AccountC: FC<{ k: BalanceAccountFragment$key }> = ({ k }) => {
  const { t } = useTranslation("merge");
  const data = useFragment(accountFragment, k);
  useNodeSubscription(subscription, data.id);

  const change = data.pool.status?.shareValueChange;
  const { showModal, hideModal } = useGlobalModalContext();

  const withdraw = () => {
    showModal({
      title: t("withdrawRujiTitle"),
      //className: "modal--large",
      backgroundClose: false,
      children: (
        <TranslationProvider namespace="merge">
          <WithdrawModal data={data} close={hideModal} />
        </TranslationProvider>
      ),
    });
  };

  return (
    <div className="col-6 col-xs-4 col-lg-2 mt-4 flex ai-c dir-c">
      <div
        className={clsx({
          merge__icons: true,
          "opacity-10": !data.size.amount,
        })}>
        <IconDenom denom={data.pool.mergeAsset.metadata.symbol} />
        <IconDenom denom="RUJI" />
      </div>
      <h4 className="fs-12 color-grey fw-400 mt-1">{t("available")}</h4>
      <Decimal
        amount={BigInt(data.size.amount)}
        className={clsx({
          "fs-20": true,
          "color-grey": !data.size.amount,
        })}
      />
      {Number(change) > 1e8 && Number(data.size.amount) ? (
        <div className="color-teal flex ai-e">
          <span className="condensed fs-12">
            +{(Number(change) / 1e10).toLocaleDecimal(2)}%
          </span>
          <Icons.TrendUp className="h-1.5 w-a ml-0.5" />
        </div>
      ) : (
        <div className="color-grey flex ai-e">
          <span className="condensed fs-12">0.00%</span>
        </div>
      )}
      <Button
        label={t("withdrawButton")}
        className="button--xs button--outline button--grey mt-1.5"
        onClick={withdraw}
      />
      {/* <TxButton
        msg={msg}
        className="button--xs button--outline button--grey mt-1.5"
        label="Withdraw"
        hideSimulation
      /> */}
    </div>
  );
};

const WithdrawModal: FC<{
  data: BalanceAccountFragment$data;
  close: () => void;
}> = ({ data, close }) => {
  const { t } = useTranslation("merge");
  const { t: tCommon } = useTranslation("common");
  const size = BigInt(data.size.amount);
  const shares = BigInt(data.shares);
  const [amount, setAmount] = useState(size);
  const { selected } = useAccounts();
  const shareAmount = size === amount ? shares : (amount * shares) / size;
  const msg = useMemo(
    () =>
      selected && shareAmount
        ? new MsgExecute(
            Account.fromAddress(selected.address),
            [],
            data.pool.address,
            {
              withdraw: { share_amount: shareAmount.toString() },
            }
          )
        : null,
    [selected, shareAmount]
  );

  return (
    <MsgProvider msg={msg}>
      <div className="flex ai-c">
        <div className="condensed fs-14 color-grey fw-500">{t("amount")}</div>
        <button
          className="tag tag--borderless px-0.5 pointer ml-a"
          onClick={() => {
            setAmount(size);
          }}>
          RUJI {t("balance")}:{" "}
          <span className="color-white ml-0.5">{nFormatter(size, 6)}</span>
        </button>
      </div>

      <div className="mt-1">
        <Numeric
          full
          decimals={8}
          amount={amount}
          initialZeroAsPlaceholder
          onChangeAmount={setAmount}
        />
      </div>
      {/* <div className="mt-2 flex ai-c jc-c">
        <img
          src={exclamation}
          alt=""
          className="filter-orange block w-6 h-a no-shrink"
        />
        <span className="color-orange fs-14 fw-600 mx-1">
          {t("withdrawWarning")}
        </span>
      </div> */}
      <div className="modal__footer mt-4 px-3 py-2 flex ai-c jc-e wrap">
        <Button
          className="button--grey button--outline ml-a"
          onClick={close}
          label={tCommon("cancel")}
        />
        <TxButton
          className="button ml-1"
          label={tCommon("withdraw")}
          hideSimulation
          onSuccess={close}
        />
      </div>
    </MsgProvider>
  );
};

// @ts-expect-error
const _Table = () => {
  return (
    <div className="table-sticky--first">
      <table className="table table--big condensed portfolio__balances">
        <thead>
          <tr>
            <th className="bg-black">Token</th>
            <th>Amount</th>
            <th>Received</th>
            <th>Rate</th>
            <th>Status</th>
            <th className="w-1"></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th className="bg-black">
              <div className="flex ai-c no-shrink">
                <IconDenom denom="KUJI" />
                <h3>KUJI</h3>
                <span className="color-white mr-1">0.4097071</span>
                +1.1%
                <Icons.TrendUp className="h-2 w-a ml-0.5" />
              </div>
            </th>
            <td>
              <Decimal amount={1000000000n} decimals={6} />
            </td>
            <td>
              <div className="flex ai-c no-shrink">
                <IconDenom denom="RUJI" className="mr-1" />
                <Decimal
                  amount={BigInt(Math.round(1000 * 0.4097071 * 1000000))}
                  decimals={6}
                  symbol="RUJI"
                />
              </div>
            </td>
            <td>
              <div className="flex ai-c color-teal">
                <span className="color-white mr-1">0.4097071</span>
                +1.1%
                <Icons.TrendUp className="h-2 w-a ml-0.5" />
              </div>
            </td>
            <td>
              <div className="tag tag--teal tag--md">Bonded</div>
            </td>
            <td className="text-right">
              <Button
                className="button button--xs button--outline button--grey"
                label="Withdraw"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
