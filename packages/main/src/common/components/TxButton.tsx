import clsx from "clsx";
import { createContext, FC, PropsWithChildren, useContext } from "react";
import { Link } from "react-router-dom";
import { Asset, isThor, Msg } from "rujira.js";
import {
  Button,
  TxButton as TxButtonInner,
  TxButtonProps as TxButtonPropsInner,
  useLocale,
  useTranslation,
} from "rujira.ui";
import connect from "rujira.ui/assets/images/connect.gif";
import { useAccounts } from "../../services/accounts";
import { usePendingDepositStore } from "../../services/deposits";
import { QUERY_CLIENT } from "../../services/queryClient";
import { useBalanceAccount, useDeposit } from "./Deposit";

export type TxButtonProps = Omit<
  TxButtonPropsInner,
  "signer" | "accountProvider"
>;

const context = createContext<Msg | null>(null);

/**
 * MsgProvider is a composable interface to provide a Msg value for a TxButton
 * Nested MsgProviders can adjust the msg finally accessed by the TxButton
 */
export const MsgProvider: FC<PropsWithChildren<{ msg: Msg | null }>> = ({
  children,
  msg,
}) => {
  return <context.Provider value={msg}>{children}</context.Provider>;
};

export const useMsg = () => useContext(context);

export const TxButton: FC<Omit<TxButtonProps, "msg">> = ({
  children,
  onSuccess,
  ...props
}) => {
  const { t } = useTranslation("common");
  const msg = useMsg();
  msg?.withQueryClient?.(QUERY_CLIENT);
  const accountProvider = useAccounts();
  const [setDeposit] = usePendingDepositStore();
  const { toRoot } = useLocale();
  const connectTo = toRoot("connect");

  return accountProvider.selected ? (
    <TxButtonInner
      msg={msg}
      accountProvider={accountProvider}
      onSuccess={(x) => {
        const coin = msg?.toDeposit?.();

        if (coin)
          setDeposit({
            hash: x.txHash,
            network: x.network,
            timestamp: new Date(),
            coin,
          });
        onSuccess?.(x);
      }}
      {...props}>
      {children}
    </TxButtonInner>
  ) : props.className?.includes("transparent") ? null : (
    <Button
      as={Link}
      className={clsx({
        [`${props.className}`]: props.className,
        "button--outline button--icon-right": true,
      })}
      to={connectTo}>
      <span>{t("connectWallet")}</span>
      <img
        src={connect}
        alt="Connect Animation"
        className="filter-primary hover-filter-white"
      />
    </Button>
  );
};

type TxBalanceAccountButtonProps = Omit<
  TxButtonProps,
  "signer" | "accountProvider" | "msg"
> & {
  required: {
    asset: Asset;
    amount: bigint;
  };
};

export const TxBalanceAccountButton: FC<
  TxBalanceAccountButtonProps & {
    Component?: FC<Omit<TxButtonProps, "msg">>;
  }
> = ({
  children,
  onSuccess: onSuccess,
  hideSimulation: hideSimulation,
  onSimulation,
  required,
  Component = TxButton,
  ...props
}) => {
  const { t } = useTranslation("common");
  const balance = useBalanceAccount(required);
  const { accounts } = useAccounts();
  const deposit = useDeposit(
    required.amount,
    required.asset,
    <p className="ml-1 color-grey fs-12">
      {t("depositInOrderTo", {
        symbol: required.asset.metadata.symbol,
        action: props.label,
      })}
    </p>
  );
  const { toRoot } = useLocale();
  const connectTo = toRoot("connect");

  if (
    !accounts ||
    accounts.length === 0 ||
    accounts?.every((a) => !isThor(a.address))
  ) {
    const { className, ...rest } = props;
    return (
      <Button
        as={Link}
        {...rest}
        className={`${className} button--primary button--outline button--icon-right`}
        label={t("connectWallet")}
        to={connectTo}>
        <img
          src={connect}
          alt="Connect Animation"
          className="filter-primary hover-filter-white"
        />
      </Button>
    );
  }

  return balance ? (
    <Component
      {...props}
      onSuccess={onSuccess}
      hideSimulation={hideSimulation}
      onSimulation={onSimulation}>
      {children}
    </Component>
  ) : (
    <Button
      {...props}
      label={t("depositSymbolTo", {
        symbol: required.asset.metadata.symbol,
        action: props.label,
      })}
      onClick={deposit}
    />
  );
};
