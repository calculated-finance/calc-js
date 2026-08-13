import React, { FC, Suspense, useEffect, useMemo, useState } from "react";
import { useLazyLoadQuery } from "react-relay";
import { graphql } from "relay-runtime";
import {
  Account,
  Address,
  Asset,
  Balance,
  BalanceAccount,
  MsgSecureWithdraw,
  MsgSwap,
  BASE,
  BSC,
  Network,
  SOL,
  THOR,
  networkLabel,
  validateAddress,
} from "rujira.js";
import {
  Button,
  Decimal,
  DenomInput,
  Fiat,
  IconDenom,
  NetworkIcon,
  Provider,
  Toggle,
  useTranslation,
  Warning,
} from "rujira.ui";
import exclamation from "rujira.ui/assets/images/exclamation.gif";
import { usePreloadedBalance } from "../../../common/components/Balance";
import {
  Destination,
  DestinationOption,
  DestinationSelect,
} from "../../../common/components/Destination";
import { MsgProvider, TxButton } from "../../../common/components/TxButton";
import { useAccounts } from "../../../services/accounts";
import { Quote, useQuote } from "../../../services/useQuote";
import { WithdrawQuery } from "./__generated__/WithdrawQuery.graphql";

// Chains to which withdrawals are temporarily disabled.
const DISABLED_WITHDRAWAL_CHAINS: Network[] = [SOL, BASE, BSC];

const query = graphql`
  query WithdrawQuery {
    thorchainV2 {
      outboundFees {
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
          variants {
            secured {
              chain
              type
              asset
              metadata {
                symbol
                decimals
              }
            }
          }
        }
        outboundFee
      }
      rune {
        price {
          current
        }
        metadata {
          decimals
        }
      }
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
          variants {
            secured {
              chain
              type
              asset
              variants {
                native {
                  denom
                }
              }
              metadata {
                symbol
                decimals
              }
            }
          }
        }
        assetTorPrice
      }
    }
  }
`;

export const Withdraw: React.FC<{
  cancel: () => void;
}> = ({ cancel }) => {
  const { t } = useTranslation("common");
  const [amount, setAmount] = useState(0n);
  const [destination, setDestination] = useState<Destination>();
  const { balance, account, asset } = usePreloadedBalance();
  const shouldSwap = destination?.asset.chain !== account?.asset.chain;

  const req = useMemo(() => {
    if (!account?.asset) return null;
    if (!destination) return null;
    if (!amount) return null;
    if (!destination?.address) return null;

    return {
      from: account.asset.asset,
      to: destination.asset.asset,
      amount,
      destination: destination.address,
    };
  }, [account, amount, destination]);
  const quote = useQuote(req);
  const swapFee = shouldSwap
    ? (typeof quote === "object" && "memo" in quote && quote.fees?.total) || 0n
    : 0n;

  const max = account?.balance || 0n;
  if (!balance) return null;
  return (
    <>
      <h3 className="h3 flex ai-c mb-0">
        <IconDenom
          denom={asset.metadata.symbol}
          className="as-c w-4 h-4 mr-1"
        />
        {t("withdraw")} {asset.metadata.symbol}
        <small className="ml-1 color-grey fw-400">{t("fromRujira")}</small>
      </h3>
      <DenomInput
        className="mt-2.5 bg-black mb-2"
        symbol={asset.metadata.symbol}
        amount={amount}
        decimals={8}
        onChangeAmount={setAmount}
        max={max}
        maxLabel={`${t("balance")}:`}
        fiat={{ price: asset?.price?.current, symbol: "$" }}
      />
      <Suspense>
        <QueryContent
          amount={amount}
          balance={balance}
          destination={destination}
          setDestination={setDestination}
          swapFee={swapFee}
        />
      </Suspense>
      <div
        className="modal__footer mt-4 px-3 py-2 text-right"
        style={{ position: "relative" }}>
        <div style={{ position: "absolute" }}>
          <Button
            className="button--grey button--outline"
            onClick={cancel}
            label="Cancel"
          />
        </div>
        <Confirm
          amount={amount}
          destination={destination}
          account={account}
          shouldSwap={shouldSwap}
          quote={quote}
        />
        {/* <Button className="button ml-1" label="Coming Soon..." disabled /> */}
      </div>
    </>
  );
};

const QueryContent: FC<{
  amount: bigint;
  balance: Balance;
  destination?: Destination;
  setDestination: (v: Destination) => void;
  swapFee: bigint;
}> = ({ amount, balance, destination, setDestination, swapFee }) => {
  const { t } = useTranslation("portfolio");
  const [enableCustom, setEnableCustom] = useState(false);
  const [forceCustom, setForceCustom] = useState(false);
  const q = useLazyLoadQuery<WithdrawQuery>(query, {});
  const { accounts } = useAccounts();
  const outboundFee = q.thorchainV2?.outboundFees.find(
    (a) => a.asset.variants.secured?.asset === balance.asset.asset
  );

  const options: DestinationOption[] = useMemo(() => {
    if (!outboundFee?.asset) return [];

    const customOption: DestinationOption = {
      address: "",
      asset: outboundFee.asset,
      network: outboundFee.asset.chain,
      providers: [],
    };

    return (q.thorchainV2?.pools || []).reduce(
      (a: DestinationOption[], v) => {
        if (v.status !== "AVAILABLE") return a;
        if (v.asset.chain === THOR) return a;
        if (!v.asset.metadata.symbol.includes(balance.asset.metadata.symbol))
          return a;

        const destinationOptions = collectOptions(accounts || [])(v.asset);
        const agg =
          a.length === 1 &&
          destinationOptions.length > 0 &&
          a[0] === customOption
            ? []
            : a;
        return [...destinationOptions, ...agg];
      },
      [customOption]
    );
  }, [outboundFee]);

  useEffect(() => {
    if (options.length === 1 && options[0].address === "") {
      setEnableCustom(true);
      setForceCustom(true);
      setDestination(options[0]);
    }
  }, [options]);

  const fee = BigInt(outboundFee?.outboundFee || 0) + swapFee;
  const received = fee > amount ? 0n : amount - fee;
  const feeValue =
    ((outboundFee?.asset.price?.current || 0n) * fee) / 10n ** 12n;
  const receivedValue =
    ((outboundFee?.asset.price?.current || 0n) * received) / 10n ** 12n;

  return (
    <>
      {!forceCustom && (
        <div className={"flex mb-2"}>
          {options.length > 1 && (
            <h2 className="fs-14 fw-500 color-grey mt-1 ml-1">
              {t("selectDestinationAccount")}
            </h2>
          )}

          <Toggle
            className="toggle--xs ml-2 mt-1"
            label={t("common:customAddress")}
            checked={enableCustom}
            onChange={(e) => setEnableCustom(e.currentTarget.checked)}
          />
        </div>
      )}

      <div className="overflow-y common-scrollbars flex dir-c gap-1 mt-1">
        <DestinationSelect
          destination={destination}
          setDestination={setDestination}
          options={options}
          enableCustomAddress={enableCustom}
        />
      </div>
      {/* <p className="fs-14 color-grey mt-2 balance">
        Something something outbound delay
      </p> */}
      {/* <Warning
        color="orange"
        msg={`Outbound delay expected.\nThe withdrawal route is not guaranteed to be fast. Please be patient.`}
        className="fs-12 fw-600 mt-2 color-white warning--pre">
        <Stopwatch className="color-orange" />
      </Warning> */}
      <div className="row wrap mt-1.5 mt-sm-2 condensed fs-14 px-2 gap-y-1">
        {enableCustom && (
          <Warning
            className="warning--sm mb-1 p-1 condensed flex ai-c"
            color="orange">
            <img
              src={exclamation}
              alt=""
              className="filter-orange block no-shrink"
              style={{ width: "2.5rem", height: "2.5rem" }}
            />
            <div className="text-left">
              Rujira is not responsible for any loss of funds due to a custom
              address being incorrect or not supported by the selected asset.
              Please ensure that the address is valid and compatible with the
              asset you are swapping. Never use a centralized exchange or smart
              contract address directly as it could result in loss of funds.
            </div>
          </Warning>
        )}

        <div className="col-12 col-xs-4 text-center text-xs-left color-grey fw-500">
          {t("withdrawalFee")}
        </div>
        <div className="col-12 col-xs-8 text-center text-xs-right">
          <Decimal
            amount={fee}
            symbol={outboundFee?.asset.metadata.symbol}
            symbolClassName="color-grey fs-14 condensed fw-500"
          />
          <div className="iflex ml-1 fs-13 color-grey">
            (
            <Fiat
              amount={feeValue ?? 0n}
              symbol="$"
              decimals={8}
              className="numeric-input__value color-grey fs-12"
            />
            )
          </div>
        </div>
        <div className="col-12 col-xs-4 text-center text-xs-left color-grey fw-500">
          {t("totalReceived")}
        </div>
        <div className="col-12 col-xs-8 text-center text-xs-right">
          <Decimal
            amount={received}
            symbol={outboundFee?.asset.metadata.symbol}
            symbolClassName="color-grey fs-14 condensed fw-500"
          />
          <div className="iflex ml-1 fs-13 color-grey">
            (
            <Fiat
              amount={receivedValue ?? 0n}
              symbol="$"
              decimals={8}
              className="numeric-input__value color-grey fs-12"
            />
            )
          </div>
        </div>
        <div className="col-12 col-xs-4 text-center text-xs-left color-grey fw-500">
          {t("common:receivingAddress")}
        </div>
        <div className="col-12 col-xs-8 text-center text-xs-right">
          <div className={"flex grow jc-c jc-xs-e"}>
            {destination?.asset?.chain && destination?.address.length > 0 && (
              <NetworkIcon
                network={destination.asset.chain}
                className="w-3 h-3 block icon-denom"
              />
            )}
            <span className={"mt-0.5 ml-1"}>
              {destination?.address.substring(0, 12)}…
              {destination?.address.slice(-12)}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

const Confirm: FC<{
  amount: bigint;
  account?: BalanceAccount;
  destination?: Destination;
  shouldSwap: boolean;
  quote: Quote;
}> = ({ account, destination, amount, shouldSwap, quote }) => {
  const { t } = useTranslation("portfolio");
  const { selected } = useAccounts();

  const destinationChain = destination?.asset.chain;
  const chainDisabled = Boolean(
    destinationChain && DISABLED_WITHDRAWAL_CHAINS.includes(destinationChain)
  );

  const msg = useMemo(() => {
    if (!amount) return null;
    if (!account) return null;
    if (!selected) return null;
    if (!destination || !destination.address) return null;
    if (chainDisabled) return null;

    return shouldSwap
      ? typeof quote === "object" && "memo" in quote
        ? new MsgSwap(
            Account.fromAddress(selected.address),
            account.asset,
            amount,
            quote.memo
          )
        : null
      : new MsgSecureWithdraw(
          Account.fromAddress(selected.address),
          account.asset,
          amount,
          destination.address
        );
  }, [amount, destination, account, quote, selected, chainDisabled]);

  //remove this and the temp "paused" button once withdrawals are enabled and stable again.
  const paused = false;

  return (
    <MsgProvider msg={msg}>
      {paused ? (
        <Button label="Paused" disabled className="button--grey" />
      ) : chainDisabled ? (
        <Button
          label={t("withdrawalsDisabledForChain", {
            chain: destinationChain ? networkLabel(destinationChain) : "",
          })}
          disabled
          className="button--grey"
        />
      ) : (
        <TxButton className="button ml-1" label="Confirm" onSuccess={close} />
      )}
    </MsgProvider>
  );
};

const collectOptions =
  (accounts: { address: Address; provider: Provider.Key }[]) =>
  (asset: Asset): DestinationOption[] => {
    const byAddress = new Map<string, Provider.Key[]>();
    for (const v of accounts) {
      if (validateAddress(asset.chain, v.address.address)) {
        const providers = byAddress.get(v.address.address) ?? [];
        if (!providers.includes(v.provider)) providers.push(v.provider);
        byAddress.set(v.address.address, providers);
      }
    }
    return Array.from(byAddress.entries()).map(([address, providers]) => ({
      asset,
      address,
      network: asset.chain,
      providers,
    }));
  };
