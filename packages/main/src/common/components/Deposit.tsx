import { FC, ReactNode, Suspense, useMemo } from "react";
import { graphql, useLazyLoadQuery } from "react-relay";
import {
  Asset,
  Balance,
  BalanceAccount,
  GAIA,
  Msg,
  MsgSecureDeposit,
  MsgSwap,
  MsgSwitch,
  THOR,
  TxResult,
  isThor,
  signers,
} from "rujira.js";
import {
  DepositModal as BaseDepositModal,
  Button,
  Input,
  useGlobalModalContext,
  sortByValueUsd,
  useTranslation,
} from "rujira.ui";
import "rujira.ui/scss/index.scss";
import { useAccounts } from "../../services/accounts";
import { isSunsetSymbol } from "../../services/asset";
import { QUERY_CLIENT } from "../../services/queryClient";
import { DepositQuery } from "./__generated__/DepositQuery.graphql";
import {
  BalanceProvider,
  usePreloadedBalance,
  usePreloadedBalances,
} from "./Balance";
import { MsgProvider, TxButton } from "./TxButton";

const query = graphql`
  query DepositQuery {
    thorchainV2 {
      pools {
        status
        asset {
          asset
          type
          chain
          price {
            current
          }
          metadata {
            symbol
            decimals
          }
        }
      }
      inboundAddresses {
        dustThreshold
        chain
      }
    }
  }
`;

export const Deposit: FC<{
  amount?: bigint;
  label?: string | ReactNode;
}> = ({ amount, label }) => (
  <Suspense fallback={<Fallback />}>
    <Content amount={amount} label={label} />
  </Suspense>
);

const Content: FC<{
  amount?: bigint;
  label?: string | ReactNode;
}> = ({ amount, label }) => {
  const { balance } = usePreloadedBalance();
  const selected =
    balance && !isSunsetSymbol(balance.asset.metadata.symbol)
      ? filterBalance(balance)
      : undefined;
  const { hideModal } = useGlobalModalContext();
  const accountProvider = useAccounts();
  const q = useLazyLoadQuery<DepositQuery>(query, {});
  const balances = usePreloadedBalances();
  const balanceOptions = sortByValueUsd(
    [...(balances || [])]
      .map((a) => {
        const balance = filterBalance(a);
        return {
          asset: a.asset,
          balance,
          valueUsd: balance.valueUsd,
        };
      })
      .filter(
        (a) =>
          !isSunsetSymbol(a.asset.metadata.symbol) &&
          a.balance.accounts.length
      )
  );

  const options = q.thorchainV2?.pools
    ? [...q.thorchainV2.pools]
        .sort((a, b) =>
          a.asset.metadata.symbol.localeCompare(b.asset.metadata.symbol)
        )
        .reduce(
          (a: { asset: Asset; balance?: Balance; valueUsd?: bigint }[], v) =>
            v.asset.type === "NATIVE" ||
            isSunsetSymbol(v.asset.metadata.symbol)
              ? a
              : a.find(
                    (x) => x.asset.metadata.symbol === v.asset.metadata.symbol
                  )
                ? a
                : [...a, { asset: v.asset }],
          balanceOptions
        )
    : balanceOptions;
  return (
    <BaseDepositModal
      selected={selected}
      amount={amount}
      options={options}
      Submit={Submit}
      dismiss={hideModal}
      target={accountProvider.selected?.address}
      label={label}
      targets={
        accountProvider.accounts
          ?.filter((a) => isThor(a.address))
          .map((a) => a.address) || []
      }
      queryClient={QUERY_CLIENT}
      inboundAddresses={
        q.thorchainV2?.inboundAddresses
          ? [...q.thorchainV2.inboundAddresses]
          : undefined
      }
    />
  );
};

const Submit: FC<{
  selected?: BalanceAccount;
  amount: bigint;
  target?: string;
  quote: signers.cosmos.QuoteSwap | Error | "loading" | undefined;
  shouldSwap: boolean;
  onSuccess: (tx: TxResult) => void;
  disabled?: boolean;
  isDangerous?: boolean;
}> = ({
  selected,
  target,
  amount,
  quote,
  onSuccess,
  disabled,
  isDangerous,
  shouldSwap,
}) => {
  const { t } = useTranslation("common");
  const { hideModal } = useGlobalModalContext();

  const msg = useMemo(() => {
    if (!amount) return null;
    if (!selected) return null;
    if (!target) return null;
    if (disabled) return null;

    return selected.asset.metadata.symbol === "LVN"
      ? msgSwitch(selected, amount, target)
      : shouldSwap
        ? typeof quote === "object" && "memo" in quote
          ? new MsgSwap(
              { address: selected.address, network: selected.asset.chain },
              selected.asset,
              amount,
              quote.memo
            )
          : null
        : new MsgSecureDeposit(
            { address: selected.address, network: selected.asset.chain },
            selected.asset,
            amount,
            target
          );
  }, [amount, selected, target, quote]);

  //remove this and the temp "paused" button once deposits are enabled and stable again.
  const paused = false;

  if (!selected) return null;
  return (
    <MsgProvider msg={msg}>
      <div
        className="modal__footer mt-4 px-3 py-2 text-right"
        style={{ position: "relative" }}>
        <div style={{ position: "absolute" }}>
          <Button
            className="button--grey button--outline"
            onClick={hideModal}
            label={t("cancel")}
          />
        </div>
        {paused ? (
          <Button label="Paused" disabled className="button--grey" />
        ) : (
          <TxButton
            className={isDangerous ? "button--red ml-1" : "ml-1"}
            onSuccess={onSuccess}
            label={isDangerous ? t("iUnderstandContinue") : t("confirm")}
            disabled={disabled || !msg}
          />
        )}
      </div>
    </MsgProvider>
  );
};

const msgSwitch = (b: BalanceAccount, amount: bigint, target: string): Msg => {
  const msg = new MsgSwitch(
    { address: b.address, network: GAIA },
    b.asset,
    amount,
    target
  );
  if (b.address.startsWith("cosmos")) return msg;
  throw new Error(`Invalid IBC Deposit for ${b.address}`);
};

const filterBalance = (v: {
  readonly accounts: ReadonlyArray<{
    readonly address: string;
    readonly asset: Asset;
    readonly balance: bigint;
    readonly valueUsd: bigint;
  }>;
  readonly asset: Asset;
  readonly balance: bigint;
  readonly valueUsd: bigint;
}): Balance => {
  const accounts = v.accounts.filter(
    (a) =>
      a.asset.type !== "SECURED" &&
      a.asset.chain !== THOR &&
      !isSunsetSymbol(a.asset.metadata.symbol)
  );

  const accountValue = accounts.reduce((a, v) => a + v.valueUsd, 0n);
  const accountBalance = accounts.reduce((a, v) => a + v.balance, 0n);
  return {
    asset: v.asset,
    valueUsd: accountValue,
    balance: accountBalance,
    accounts,
  };
};

export const useDeposit = (
  amount: bigint,
  asset?: Asset,
  hint?: string | ReactNode
) => {
  const { showModal } = useGlobalModalContext();
  return () => {
    showModal({
      backgroundClose: false,
      children: asset ? (
        <BalanceProvider asset={asset}>
          <Deposit amount={amount} label={hint} />
        </BalanceProvider>
      ) : (
        <Deposit amount={amount} label={hint} />
      ),
    });
  };
};

/**
 *
 * @param v
 * @returns Returns a spendiable BalanceAccount for the provided balance.asset.asset, or a function to open deposit modal
 */
export const useBalanceAccount = (v: {
  asset: { asset: string };
  amount: bigint;
}): BalanceAccount | null => {
  const balances = usePreloadedBalances();
  const balance = balances?.find((a) => a.asset.asset === v.asset.asset);
  const thorAccount = balance?.accounts.find(
    (a) => a.asset.asset === balance.asset.asset
  );

  const required = v.amount - (thorAccount?.balance || 0n);
  return !thorAccount || required > 0n ? null : thorAccount;
};

const Fallback: FC = () => {
  const { t } = useTranslation("common");
  return (
    <div className="deposit-modal">
      <h3 className="h3">{t("deposit")}</h3>
      <Input label={t("search")} disabled={true} />
      <div className="deposit-modal__content row wrap pad-mini mt-1.5 gap-y-1">
        {[...Array(8)].map((_, i) => (
          <div className="col-6" key={i}>
            <div className="skeleton h-8 br-2"></div>
          </div>
        ))}
      </div>
    </div>
  );
};
