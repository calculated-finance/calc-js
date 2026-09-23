import clsx from "clsx";
import { format } from "date-fns";
import { FC, PropsWithChildren, useMemo, useState } from "react";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import {
  Account,
  MsgExecute,
  MsgMulti,
  THOR,
  bigintToFixed,
  validateAddress,
} from "rujira.js";
import {
  Button,
  Decimal,
  Fiat,
  IconDenom,
  Icons,
  Input,
  Numeric,
  LabelAsset,
  TranslationProvider,
  Warning,
  assetLabel,
  fiatize,
  useGlobalModalContext,
  useTranslation,
} from "rujira.ui";
import { coin } from "../../../../../rujira.js/src/signers/cosmos";
import { BalanceProvider } from "../../../common/components/Balance";
import { MsgProvider, TxButton } from "../../../common/components/TxButton";
import { useAccounts } from "../../../services/accounts";
import {
  ChunkSlider,
  InputQuantity,
} from "../../../trade/components/InputQuantity";
import { RangeBalanceWarning } from "../RangeBalanceWarning.tsx";
import { RangeDepositResolver } from "../RangeDepositResolver.tsx";
import { useClampedPair } from "../../hooks/useClampedPair";
import { TradeSubscriptionsFinRangeFragment$key } from "../../__generated__/TradeSubscriptionsFinRangeFragment.graphql";
import { useTradeSubscriptionsFinRangeFragment } from "../../TradeSubscriptions";
import { RangeManageFragment$key } from "./__generated__/RangeManageFragment.graphql";
import { Apr, Dpi, Moic } from "./Common";

const fragment = graphql`
  fragment RangeManageFragment on FinRange {
    id
    ...TradeSubscriptionsFinRangeFragment
  }
`;

enum Tab {
  Deposit,
  Withdraw,
}

export const RangeManage: FC<{
  hideModal: () => void;
  k: RangeManageFragment$key;
}> = ({ hideModal, k }) => {
  const data = useFragment(fragment, k);
  const range = useTradeSubscriptionsFinRangeFragment(data);
  const [tab, setTab] = useState<Tab>(Tab.Deposit);
  const { t } = useTranslation();
  const { selected } = useAccounts();
  const { showModal, hideModal: hideSendModal } = useGlobalModalContext();

  const claimMsg = useMemo(
    () =>
      selected && (range.feesBase || range.feesQuote)
        ? new MsgExecute(
            Account.fromAddress(selected.address),
            [],
            range.pair.address,
            { range: { claim: { idx: range.idx.toString() } } }
          )
        : null,
    [selected, range]
  );

  return (
    <>
      <h2 className="h4 mb-2">{t("common:managePosition")}</h2>
      <div
        className="card p-2"
        style={{ marginLeft: "-0.5rem", marginRight: "-0.5rem" }}>
        <div className="row wrap pad gap-y-3">
          <Balances
            label="rangeBalances"
            baseAmount={range.base}
            baseAsset={range.pair.assetBase}
            quoteAmount={range.quote}
            quoteAsset={range.pair.assetQuote}
            valueUsd={range.principalUsd}>
            <Button
              className="button--outline mt-1.5 button--full button--sm button--grey"
              onClick={() => {
                showModal({
                  backgroundClose: false,
                  children: (
                    <TranslationProvider namespace={"common"}>
                      <Transfer
                        idx={range.idx.toString()}
                        pairAddress={range.pair.address}
                        baseAsset={range.pair.assetBase}
                        quoteAsset={range.pair.assetQuote}
                        cancel={hideSendModal}
                      />
                    </TranslationProvider>
                  ),
                });
              }}
              label={t("common:transfer")}
            />
          </Balances>
          <Balances
            label="rangeFees"
            baseAmount={range.feesBase}
            baseAsset={range.pair.assetBase}
            quoteAmount={range.feesQuote}
            quoteAsset={range.pair.assetQuote}
            valueUsd={range.yieldUsd}>
            <MsgProvider msg={claimMsg}>
              <TxButton
                className="button--outline mt-1.5 button--full button--sm"
                label="Claim"
                hideSimulation
              />
            </MsgProvider>
          </Balances>
          <div className="col-6 col-md-3">
            <h3 className="fs-14 fw-500 color-grey mb-1">Created</h3>
            <div className="tag tag--borderless tag--grey i-fs-16">
              {range.analytics?.firstDepositDate
                ? format(range.analytics.firstDepositDate, "dd-MMM-yy")
                : "Not Available"}
            </div>
          </div>

          <div className="col-6 col-md-3">
            <h3 className="fs-14 fw-500 color-grey mb-1">
              <Moic />
            </h3>
            <div className="tag tag--borderless tag--grey i-fs-16">
              {(Number(range.analytics?.moic) / 1e12).toLocaleDecimal(2)}x
            </div>
          </div>
          <div className="col-6 col-md-3">
            <h3 className="fs-14 fw-500 color-grey mb-1">
              <Dpi />
            </h3>
            <div className="tag tag--borderless tag--grey i-fs-16">
              {(Number(range.analytics?.dpi) / 1e12).toLocaleDecimal(2)}x
            </div>
          </div>
          <div className="col-6 col-md-3">
            <h3 className="fs-14 fw-500 color-grey mb-1">
              <Apr />
            </h3>
            <div className="tag tag--borderless tag--grey i-fs-16 tag--teal">
              {(Number(range.analytics?.apr) / 1e10).toLocaleDecimal(2)}%
            </div>
          </div>
        </div>
      </div>
      {/* <hr className="hr opacity-10 my-3" /> */}

      <nav className="tabs tabs--sm tabs--dark mt-3 flex jc-c wrap">
        <a
          onClick={() => setTab(Tab.Deposit)}
          className={clsx({ selected: tab === Tab.Deposit })}>
          {t("depositTab")}
        </a>
        <a
          onClick={() => setTab(Tab.Withdraw)}
          className={clsx({ selected: tab === Tab.Withdraw })}>
          {t("withdrawTab")}
        </a>
      </nav>

      {tab === Tab.Deposit && <Deposit hideModal={hideModal} k={data} />}
      {tab === Tab.Withdraw && <Withdraw hideModal={hideModal} k={data} />}
    </>
  );
};

const Balances: FC<
  PropsWithChildren<{
    label: string;
    baseAsset: LabelAsset;
    baseAmount: bigint;
    quoteAsset: LabelAsset;
    quoteAmount: bigint;
    valueUsd?: bigint;
  }>
> = ({
  label,
  baseAmount,
  baseAsset,
  quoteAmount,
  quoteAsset,
  valueUsd,
  children,
}) => {
  const { t } = useTranslation();
  return (
    <div className="col-12 col-md-6">
      <div className={"flex dir-r mb-1 ai-c"}>
        <h3 className="fs-14 fw-500 color-grey">{t(label)}</h3>
      </div>
      <div className={"flex dir-r"}>
        <IconDenom denom={baseAsset.metadata.symbol} className="w-3 mr-1" />
        <div className="flex ai-b">
          <Decimal
            className="fs-18 fw-500 condensed"
            symbolClassName={"color-grey condensed fw-500"}
            amount={baseAmount}
            symbol={assetLabel(baseAsset)}
          />
        </div>
      </div>
      <div className="flex ai-c mt-1">
        <IconDenom denom={quoteAsset.metadata.symbol} className="w-3 mr-1" />
        <div className="flex ai-b">
          <Decimal
            className="fs-18 fw-500 condensed"
            symbolClassName={"color-grey condensed fw-500"}
            amount={quoteAmount}
            symbol={assetLabel(quoteAsset)}
          />
        </div>
      </div>
      <hr className="hr opacity-10" />
      <div className={"flex dir-r"}>
        {valueUsd !== undefined && (
          <Fiat
            amount={valueUsd}
            decimals={8}
            symbol="≈ $"
            className="fs-18 color-white ml-1"
          />
        )}
      </div>
      {children}
    </div>
  );
};

const Transfer: React.FC<{
  idx: string;
  pairAddress: string;
  baseAsset: LabelAsset;
  quoteAsset: LabelAsset;
  cancel: () => void;
}> = ({ idx, pairAddress, baseAsset, quoteAsset, cancel }) => {
  const { t } = useTranslation("common");
  const [address, setAddress] = useState("");
  const { selected } = useAccounts();
  const trimmed = address.trim();
  const isValidAddress = validateAddress(THOR, trimmed);
  const isInvalid = trimmed.length > 0 && !isValidAddress;

  const msg = useMemo(() => {
    return trimmed && selected && isValidAddress
      ? new MsgExecute(Account.fromAddress(selected.address), [], pairAddress, {
          range: { transfer: { idx, to: trimmed } },
        })
      : null;
  }, [address, selected, pairAddress, idx]);

  return (
    <MsgProvider msg={msg}>
      <h2 className="h3">
        {t("transfer")} {assetLabel(baseAsset)}/{assetLabel(quoteAsset)}
      </h2>

      <div className="condensed fs-14 color-grey fw-500 mt-1.5">
        {t("rujiraAddress")}
      </div>
      <div className="mt-1">
        <Input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.currentTarget.value)}
        />
        {isInvalid && (
          <div className="flex dir-r jc-c grow mt-1">
            <Warning color="red" className="condensed iflex grow">
              <Icons.ExclamationTriangle className="color-red" />
              <span className="warning__msg">{t("invalidThorAddress")}</span>
            </Warning>
          </div>
        )}
      </div>

      <div className="modal__footer mt-4 px-3 py-2 flex ai-s wrap">
        <Button
          className="button--grey button--outline mr-1"
          onClick={cancel}
          label={t("cancel")}
        />
        <div className="block ml-a text-right">
          <TxButton
            className="button"
            label={t("transfer")}
            hideSimulation
            onSuccess={() => cancel()}
          />
        </div>
      </div>
    </MsgProvider>
  );
};

const shareScale = 10000n;

const clamp = (v: bigint, min: bigint, max: bigint) =>
  v < min ? min : v > max ? max : v;

const roundDiv = (num: bigint, den: bigint) =>
  den ? (num + den / 2n) / den : 0n;

const shareFromAmount = (amount: bigint, total: bigint) =>
  total ? clamp(roundDiv(amount * shareScale, total), 0n, shareScale) : 0n;

const amountFromShare = (total: bigint, share: bigint) =>
  clamp(roundDiv(total * share, shareScale), 0n, total);

const Deposit: FC<{
  hideModal: () => void;
  k: TradeSubscriptionsFinRangeFragment$key;
}> = ({ hideModal, k }) => {
  const { selected } = useAccounts();
  const range = useTradeSubscriptionsFinRangeFragment(k);

  const {
    baseAmount,
    quoteAmount,
    setBaseAmount,
    setQuoteAmount,
    onBaseFocus,
    onQuoteFocus,
    baseOver,
    quoteOver,
    insufficient,
    enteredSide,
    setMaxAvailable,
  } = useClampedPair({
    assetBase: range.pair.assetBase,
    assetQuote: range.pair.assetQuote,
    hasBase: !!range.base,
    hasQuote: !!range.quote,
    ratioBase: range.base,
    ratioQuote: range.quote,
  });

  const msg = useMemo(() => {
    if (!selected) return null;
    if (!range.pair.assetBase.variants.native?.denom) return null;
    if (!range.pair.assetQuote.variants.native?.denom) return null;
    if (baseAmount === 0n && quoteAmount === 0n) return null;
    if (insufficient) return null;

    return new MsgExecute(
      Account.fromAddress(selected.address),
      [
        coin(baseAmount.toString(), range.pair.assetBase.variants.native.denom),
        coin(
          quoteAmount.toString(),
          range.pair.assetQuote.variants.native.denom
        ),
      ].filter((x) => x.amount !== "0"),
      range.pair.address,
      {
        range: {
          deposit: {
            idx: range.idx.toString(),
          },
        },
      }
    );
  }, [selected, baseAmount, quoteAmount, range.pair, insufficient]);

  const { t } = useTranslation();

  const depositLabel = useMemo(() => {
    const assets = [
      {
        price: range.pair.assetBase.price?.current,
        amount: baseAmount,
      },
      {
        price: range.pair.assetQuote.price?.current,
        amount: quoteAmount,
      },
    ];

    return fiatize(t("depositRange"), assets);
  }, [range.pair, baseAmount, quoteAmount]);

  return (
    <MsgProvider msg={msg}>
      <div style={{ marginLeft: "-0.5rem", marginRight: "-0.5rem" }}>
        <div className="row wrap gap-y-2 pad--sm mt-3">
          {range.base ? (
            <div
              className={clsx("col-12", {
                "col-md-6": range.base && range.quote,
              })}>
              <BalanceProvider asset={range.pair.assetBase}>
                <InputQuantity
                  amount={baseAmount}
                  onFocus={onBaseFocus}
                  setAmount={setBaseAmount}
                  highlightInvalid
                  fiat={{
                    price: range.pair.assetBase.price?.current,
                    symbol: "$",
                  }}
                  asset={range.pair.assetBase}
                  className="mb-0.5 px-1 ml-1"
                  containerClassName="grow"
                />
              </BalanceProvider>
            </div>
          ) : null}
          {range.quote ? (
            <div
              className={clsx("col-12", {
                "col-md-6": range.base && range.quote,
              })}>
              <BalanceProvider asset={range.pair.assetQuote}>
                <InputQuantity
                  amount={quoteAmount}
                  onFocus={onQuoteFocus}
                  setAmount={setQuoteAmount}
                  highlightInvalid
                  fiat={{
                    price: range.pair.assetQuote.price?.current,
                    symbol: "$",
                  }}
                  asset={range.pair.assetQuote}
                  className="mb-0.5 px-1 ml-1"
                  containerClassName="grow"
                />
              </BalanceProvider>
            </div>
          ) : null}
        </div>
      </div>
      {insufficient ? (
        <RangeBalanceWarning
          baseLabel={range.pair.assetBase.metadata.symbol}
          quoteLabel={range.pair.assetQuote.metadata.symbol}
          enteredSide={enteredSide}
          baseOver={baseOver}
          quoteOver={quoteOver}
          onFix={setMaxAvailable}
        />
      ) : null}
      <div className="modal__footer mt-4 px-3 py-2 flex ai-s jc-e wrap">
        <Button
          className="button--grey button--outline"
          onClick={hideModal}
          label={t("common:cancel")}
        />
        <div className="expand text-right">
          <RangeDepositResolver
            base={{
              asset: range.pair.assetBase,
              amount: baseAmount,
              needed: !!range.base,
            }}
            quote={{
              asset: range.pair.assetQuote,
              amount: quoteAmount,
              needed: !!range.quote,
            }}
            onAutoFit={setMaxAvailable}
            skip={insufficient}>
            <TxButton
              label={depositLabel}
              onSuccess={hideModal}
              hideSimulation
            />
          </RangeDepositResolver>
        </div>
      </div>
    </MsgProvider>
  );
};

const Withdraw: FC<{
  hideModal: () => void;
  k: TradeSubscriptionsFinRangeFragment$key;
}> = ({ hideModal, k }) => {
  const range = useTradeSubscriptionsFinRangeFragment(k);
  const { selected } = useAccounts();
  const [amount, setAmount] = useState(0n);
  const baseAmount = amountFromShare(range.base, amount);
  const quoteAmount = amountFromShare(range.quote, amount);
  const setBase = (v: bigint) => setAmount(shareFromAmount(v, range.base));
  const setQuote = (v: bigint) => setAmount(shareFromAmount(v, range.quote));

  const msg = useMemo(() => {
    if (!selected) return null;
    if (!amount) return null;
    const account = Account.fromAddress(selected.address);
    return amount === shareScale
      ? new MsgMulti(account, [
          new MsgExecute(account, [], range.pair.address, {
            range: {
              claim: {
                idx: range.idx.toString(),
              },
            },
          }),

          new MsgExecute(account, [], range.pair.address, {
            range: {
              withdraw: {
                idx: range.idx.toString(),
                amount: "1",
              },
            },
          }),
        ])
      : new MsgExecute(account, [], range.pair.address, {
          range: {
            withdraw: {
              idx: range.idx.toString(),
              amount: bigintToFixed(amount, 4),
            },
          },
        });
  }, [selected, range, amount]);

  const { t } = useTranslation();

  const withdrawLabel = useMemo(() => {
    const assets = [
      { price: range.pair.assetBase.price?.current, amount: baseAmount },
      { price: range.pair.assetQuote.price?.current, amount: quoteAmount },
    ];
    const key = amount === shareScale ? "closeRange" : "withdrawRange";
    return fiatize(t(key), assets);
  }, [range, baseAmount, quoteAmount, amount]);

  return (
    <MsgProvider msg={msg}>
      <div style={{ marginLeft: "-0.5rem", marginRight: "-0.5rem" }}>
        <div className="row wrap gap-y-2 pad--sm mt-3">
          {range.base ? (
            <div
              className={clsx("col-12", {
                "col-md-6": range.base && range.quote,
              })}>
              <Numeric
                amount={baseAmount}
                initialZeroAsPlaceholder
                onChangeAmount={setBase}
                fiat={{
                  price: range.pair.assetBase.price?.current,
                  symbol: "$",
                }}
                className="numeric-input--white">
                <label>
                  {t("amount")}{" "}
                  <small>({assetLabel(range.pair.assetBase)})</small>
                </label>
              </Numeric>
            </div>
          ) : null}
          {range.quote ? (
            <div
              className={clsx("col-12", {
                "col-md-6": range.base && range.quote,
              })}>
              <Numeric
                amount={quoteAmount}
                initialZeroAsPlaceholder
                onChangeAmount={setQuote}
                fiat={{
                  price: range.pair.assetQuote.price?.current,
                  symbol: "$",
                }}
                className="numeric-input--white">
                <label>
                  {t("amount")}{" "}
                  <small>({assetLabel(range.pair.assetQuote)})</small>
                </label>
              </Numeric>
            </div>
          ) : null}
        </div>

        <div className="col-12">
          <div className="flex ai-c mt-1.5">
            <a
              className="fs-12 condensed fw-500 color-grey mr-0.5 pointer"
              onClick={() => setAmount(0n)}>
              0%
            </a>
            <ChunkSlider
              amount={amount}
              setAmount={setAmount}
              max={shareScale}
            />
            <a
              className="fs-12 condensed fw-500 color-grey ml-0.5 pointer"
              onClick={() => setAmount(shareScale)}>
              100%
            </a>
          </div>
        </div>
      </div>
      <div className="modal__footer mt-4 px-3 py-2 flex ai-s jc-e wrap">
        <Button
          className="button--grey button--outline"
          onClick={hideModal}
          label={t("common:cancel")}
        />
        <div className="block ml-a text-right">
          <TxButton
            label={withdrawLabel}
            onSuccess={hideModal}
            hideSimulation
          />
        </div>
      </div>
    </MsgProvider>
  );
};
