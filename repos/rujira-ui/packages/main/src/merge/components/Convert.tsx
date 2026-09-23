import clsx from "clsx";
import { FC, useMemo, useState } from "react";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import { Account, MsgExec } from "rujira.js";
import { Button, DenomInput, OmniBalance, useTranslation } from "rujira.ui";
import { usePreloadedBalance } from "../../common/components/Balance";
import {
  MsgProvider,
  TxBalanceAccountButton,
} from "../../common/components/TxButton";
import { useAccounts } from "../../services/accounts";
import { ConvertStepFragment$key } from "./__generated__/ConvertStepFragment.graphql";

const pool = graphql`
  fragment ConvertStepFragment on MergePool {
    address
    mergeAsset {
      type
      chain
      asset
      metadata {
        decimals
        symbol
      }
      variants {
        native {
          denom
        }
        secured {
          type
          chain
          asset
          metadata {
            decimals
            symbol
          }
          variants {
            native {
              denom
            }
          }
        }
      }
    }
  }
`;

export const Convert: FC<{
  c?: ConvertStepFragment$key;
  symbol: string;
}> = ({ symbol, c }) => {
  const { t } = useTranslation("merge");
  const { selected } = useAccounts();
  const { balance } = usePreloadedBalance();
  const contract = useFragment(pool, c);
  const [amount, setAmount] = useState(0n);

  const msg = useMemo(() => {
    if (!selected) return null;
    if (!contract) return null;
    if (!amount) return null;

    return new MsgExec(
      Account.fromAddress(selected.address),
      contract.mergeAsset,
      amount,
      contract.address,
      {
        deposit: {},
      }
    );
  }, [selected, contract, amount]);

  if (!contract) return null;

  return (
    <div className="col-12 mt-2 col-lg-4 mt-lg-0">
      <div className="merge__step card h-full p-3 merge__step--selected">
        <h4
          className={clsx({
            "h5 text-center": true,
            "mb-0": selected,
          })}>
          {t("convertToRuji")}
        </h4>

        {selected && (
          <p className="fs-13 text-center mb-1 mt-1 condensed">
            <span className="color-grey">from</span> {selected.address.address}
          </p>
        )}

        <DenomInput
          symbol={symbol}
          amount={amount}
          decimals={8}
          full={true}
          className="mt-2"
          onChangeAmount={setAmount}
        />
        {/* <button className="transparent flex jc-e mt-1 mr-1 ml-a color-white pointer">
          <i18n.p className="fs-14 condensed color-grey">Balance: </i18n.p>
          <Decimal
            amount={balance?.balance || 0n}
            onClick={() => setAmount(balance?.balance || 0n)}
            className="condensed fs-14 ml-0.5"
          />

          {balance?.accounts.map((x) => (
            <div key={x.asset.chain}>
              <NetworkIcon network={x.asset.chain as Network} />
              <Decimal amount={x.balance} className="condensed fs-14 ml-0.5" />
            </div>
          ))}
        </button> */}

        <div className="flex jc-e mt-1 mr-1 ml-a color-white">
          <p className="fs-14 condensed color-grey mr-0.5">{t("balance")}:</p>
          <OmniBalance
            balance={
              balance
                ? { ...balance, accounts: [...balance.accounts] }
                : undefined
            }
            onClick={(x) => setAmount(x.balance)}
            className="condensed fs-14"
          />
        </div>

        {import.meta.env.MODE === "dev" ? (
          <Button
            className="button--grey mt-3 w-full"
            label={t("temporarilyDisabled")}
            disabled
          />
        ) : (
          <MsgProvider msg={msg}>
            <TxBalanceAccountButton
              required={{ asset: contract.mergeAsset, amount }}
              className="mt-3 w-full"
              label={t("mergeToRuji")}
              disabled={import.meta.env.MODE === "dev"}
            />
          </MsgProvider>
        )}
      </div>
    </div>
  );
};
