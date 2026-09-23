import clsx from "clsx";
import React, { FC, useMemo, useState } from "react";
import { Trans } from "react-i18next";
import {
  BalanceAccount,
  MsgSend,
  THOR,
  networkLabel,
  validateAddress,
} from "rujira.js";
import {
  Button,
  Decimal,
  DenomInput,
  IconDenom,
  Input,
  NetworkIcon,
  Warning,
  useTranslation,
} from "rujira.ui";

import { Icons } from "rujira.ui";
import exclamation from "rujira.ui/assets/images/exclamation.gif";
import {
  BalanceCompact,
  usePreloadedBalance,
} from "../../../common/components/Balance";
import { MsgProvider, TxButton } from "../../../common/components/TxButton";

export const Send: React.FC<{
  cancel: () => void;
}> = ({ cancel }) => {
  const { t } = useTranslation("portfolio");
  const balance = usePreloadedBalance();
  const [account, setAccount] = useState(balance.account);
  if (!account) return null;

  return (
    <>
      <h2 className="h3 flex ai-c">
        <IconDenom
          denom={account.asset.metadata.symbol}
          className="w-4 h-4 block mr-1"
        />
        {t("sendToken", { symbol: account.asset.metadata.symbol })}
      </h2>

      <BalanceCompact onClick={(b) => !("accounts" in b) && setAccount(b)} />

      <SendAccount account={account} cancel={cancel} />
    </>
  );
};

export const SendAccount: React.FC<{
  account: BalanceAccount;
  cancel: () => void;
}> = ({ cancel, account }) => {
  const { t } = useTranslation("portfolio");
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState(0n);
  const [memo, setMemo] = useState("");
  const [showMemo, setShowMemo] = useState(false);

  const isValid = useMemo(
    () =>
      validateAddress(
        account.asset.type === "SECURED" ? THOR : account.asset.chain,
        address
      ),
    [account, address]
  );

  const msg = useMemo(() => {
    if (!amount) return null;
    if (amount > account.balance) return null;
    if (!isValid) return null;

    return new MsgSend(
      {
        address: account.address,
        network: account.asset.type === "SECURED" ? THOR : account.asset.chain,
      },
      account.asset,
      amount,
      address.trim(),
      memo
    );
  }, [account, address, amount, memo]);

  const network = networkLabel(
    account.asset.type === "SECURED" ? THOR : account.asset.chain
  );

  return (
    <MsgProvider msg={msg}>
      <div className="flex dir-c pad-mini">
        <div className="mt-4">
          <DenomInput
            full
            symbol={account.asset.metadata.symbol}
            amount={amount}
            decimals={8}
            onChangeAmount={setAmount}
            max={account.balance}
            maxLabel={`${t("common:balance")}:`}
            fiat={{ price: account.asset.price?.current, symbol: "$" }}
          />
          {amount > account.balance && (
            <InsufficientFundsWarning
              amount={amount}
              balance={account.balance}
              symbol={account.asset.metadata.symbol}
            />
          )}
        </div>
        <div className="row pad-mini mb-1.5 mt-3 condensed fs-14 color-grey">
          <div className="fw-500 ml-0.5 flex ai-c">
            <NetworkIcon
              network={
                account.asset.type === "SECURED" ? THOR : account.asset.chain
              }
              className="w-2.5 h-2.5 block icon-denom mr-0.5"
            />
            {t("networkAddress", { network })}
          </div>
        </div>
        <Input
          type="text"
          value={address}
          containerClassName={clsx({
            "input-container--error": address && !isValid,
          })}
          onChange={(e) => setAddress(e.currentTarget.value)}
        />
        {address && !isValid && <InvalidAddressWarning network={network} />}
      </div>

      <div className="mt-2">
        <button
          className="transparent condensed fs-14 fw-500 color-grey hover-white iflex ai-c pointer"
          onClick={() => setShowMemo(!showMemo)}>
          {!showMemo ? (
            <>
              <Icons.Plus className="h-1.5 w-a mr-0.5" />
              {t("addMemo")}
            </>
          ) : (
            <>
              <Icons.Xmark className="h-1.5 w-a mr-0.5" />
              {t("removeMemo")}
            </>
          )}
        </button>
        {showMemo && (
          <Input
            value={memo}
            onChange={(e) => setMemo(e.currentTarget.value)}
            className="mt-1"
            label={t("memo")}
          />
        )}
      </div>

      <div
        className="modal__footer mt-4 px-3 py-2 text-right"
        style={{ position: "relative" }}>
        <div style={{ position: "absolute" }}>
          <Button
            className="button--grey button--outline"
            onClick={cancel}
            label={t("common:cancel")}
          />
        </div>
        <TxButton
          className="button ml-1"
          label={t("common:send")}
          onSuccess={() => cancel()}
        />
      </div>
    </MsgProvider>
  );
};

const InsufficientFundsWarning: FC<{
  amount: bigint;
  balance: bigint;
  symbol: string;
}> = ({ amount, balance, symbol }) => (
  <Warning className="warning--sm mt-1 p-1 condensed flex ai-c" color="orange">
    <img
      src={exclamation}
      alt=""
      className="filter-orange block no-shrink"
      style={{ width: "2.5rem", height: "2.5rem" }}
    />
    <small className="text-left fs-14 lh-18">
      <Trans
        i18nKey="portfolio:insufficientFunds"
        components={{
          sending: (
            <Decimal
              amount={amount}
              decimals={8}
              symbol={symbol}
              className="color-white"
              as="span"
            />
          ),
          available: (
            <Decimal
              amount={balance}
              decimals={8}
              symbol={symbol}
              className="color-white"
              as="span"
            />
          ),
        }}
      />
    </small>
  </Warning>
);

const InvalidAddressWarning: FC<{ network: string }> = ({ network }) => (
  <Warning className="warning--sm mt-1 p-1 condensed flex ai-c" color="orange">
    <img
      src={exclamation}
      alt=""
      className="filter-orange block no-shrink"
      style={{ width: "2.5rem", height: "2.5rem" }}
    />
    <small className="text-left fs-14 lh-18 ml-1">
      <Trans
        i18nKey="common:invalidAddressWarning"
        components={{ network: <span className="color-white">{network}</span> }}
      />
    </small>
  </Warning>
);
