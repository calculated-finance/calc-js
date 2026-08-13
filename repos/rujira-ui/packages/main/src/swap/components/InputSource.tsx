import clsx from "clsx";
import { FC, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Balance,
  BalanceAccount,
  Network,
  THOR,
  networkLabel,
} from "rujira.js";
import {
  AssetLabel,
  BreakPoints,
  compareBigintDesc,
  sortByValueUsd,
  Decimal,
  Fiat,
  IconDenom,
  Input,
  NetworkIcon,
  SwapSelect,
  SwapSelectOption,
  TokenSelect,
  TranslationProvider,
  useGlobalModalContext,
  useTranslation,
  useWindowSize,
} from "rujira.ui";

import { Icons } from "rujira.ui";
import { usePreloadedBalances } from "../../common/components/Balance";
import {
  assetToTradeUrlSegment,
  findAssetByUrlSegment,
  normalizeChainParam,
  parseUrlSegment,
} from "../../services/assetUrl";
import { useSwapContext } from "./Context";

export const InputSource: FC = () => {
  const { showModal, hideModal } = useGlobalModalContext();
  const { from, amount, setAmount, setFrom, source, setSource } =
    useSwapContext();
  const [searchParams] = useSearchParams();
  const fromChain = normalizeChainParam(searchParams.get("fromChain"));
  const balances = usePreloadedBalances();
  const options: Balance[] = sortByValueUsd(balances || [], (a, b) =>
    compareBigintDesc(a.balance || 0n, b.balance || 0n)
  );

  useEffect(() => {
    const matched = from
      ? findAssetByUrlSegment(
          from,
          options.map((o) => o.asset),
          fromChain
        )
      : undefined;
    const bal = matched
      ? options.find((o) => o.asset.asset === matched.asset)
      : undefined;
    const accs = bal?.accounts || [];
    // A fromChain signals an external (L1) holding, so prefer the non-SECURED
    // account on that chain over the Rujira (SECURED) one that shares it.
    const def =
      (fromChain &&
        (accs.find(
          (a) => a.asset.chain === fromChain && a.asset.type !== "SECURED"
        ) ||
          accs.find((a) => a.asset.chain === fromChain))) ||
      accs.find(
        (a) => a.asset.type === "SECURED" || a.asset.chain === matched?.chain
      ) ||
      accs[0];
    if (!source) setSource(def);
  }, []);

  const OpenModal = () => {
    showModal({
      backgroundClose: true,
      className: "modal--xl modal--fixed modal--nopad",
      children: (
        <TranslationProvider namespace="swap">
          <Modal
            balances={options}
            source={source}
            setFrom={setFrom}
            from={from}
            setSource={(x) => {
              setSource(x);
              hideModal();
            }}
          />
        </TranslationProvider>
      ),
    });
  };

  const parsedFrom = from ? parseUrlSegment(from, fromChain) : undefined;
  const defaultAsset: SwapSelectOption = {
    asset: `${parsedFrom?.metadata.symbol ?? ""}.${parsedFrom?.chain ?? ""}`,
    type: "LAYER_1",
    chain: (parsedFrom?.chain ?? "") as Network,
    metadata: {
      symbol: parsedFrom?.metadata.symbol || "",
      decimals: 8,
    },
  };

  const value = source ? (source.valueUsd * amount) / source.balance : 0n;

  return (
    <>
      <div className="row wrap pad--sm gap-y-1 jc-c">
        <div className="col-12 col-sm-6 col-md-5 col-lg-4 col-xl-3">
          <TokenSelect
            selected={source?.asset || defaultAsset}
            onClick={balances && OpenModal}
            network={
              source?.asset.type === "SECURED" ? THOR : source?.asset.chain
            }
            address={source?.address}
          />
        </div>
        <div className="col-12 col-sm-6 col-md-7 col-lg-5">
          <SwapSelect
            selected={source?.asset || defaultAsset}
            amount={amount}
            onChangeAmount={setAmount}
            max={source?.balance || 0n}
            value={value}
            hideSelected={true}
          />
        </div>
      </div>
    </>
  );
};

const Modal: FC<{
  balances: Balance[];
  setFrom: (from: string) => void;
  source?: BalanceAccount;
  setSource: (b: BalanceAccount) => void;
  from?: string;
}> = ({ balances, source, setSource, from, setFrom }) => {
  const [balance, setBalance] = useState(
    balances.find((a) =>
      a.accounts.find((b) => b.asset.asset === source?.asset.asset)
    ) || balances[0]
  );
  const [step, setStep] = useState(0);
  // Temp local storage until we commit the change
  const [from_, setFrom_] = useState(from);
  const { width } = useWindowSize();

  return (
    <div className="row pad--sm flex-overflow mt-2">
      {((width < BreakPoints.medium && step === 0) ||
        width >= BreakPoints.medium) && (
        <div className="col-12 col-md-5 flex dir-c">
          <BalanceSelect
            balances={balances}
            setFrom={(e) => {
              setStep(1);
              setFrom_(e);
            }}
            balance={balance}
            setBalance={setBalance}
          />
        </div>
      )}
      {((width < BreakPoints.medium && step === 1) ||
        width >= BreakPoints.medium) && (
        <div className="col-12 col-md-7 flex dir-c">
          {width < BreakPoints.medium && (
            <BackButton onClick={() => setStep(0)} />
          )}
          <BalanceAccountSelect
            source={source}
            setSource={(s) => {
              setSource(s);
              from_ && setFrom(from_);
            }}
            balance={balance}
          />
        </div>
      )}
    </div>
  );
};

const BalanceSelect: FC<{
  balance: Balance;
  setBalance: (b: Balance) => void;
  balances: Balance[];
  setFrom: (from: string) => void;
}> = ({ balances, setFrom, setBalance, balance }) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  return (
    <>
      <div className="pl-2">
        <Input
          value={search || ""}
          onChange={(e) => setSearch(e.currentTarget.value)}
          label={t("searchTokens")}>
          {search && (
            <Icons.MinusCircle
              className="input-container__clear"
              onClick={() => setSearch("")}
            />
          )}
        </Input>
      </div>
      <div className="overflow-y common-scrollbars flex dir-c gap-1 pl-2 mt-1 pr-1 mb-2">
        {balances.filter((v) =>
          v.asset.metadata.symbol.toLowerCase().includes(search.toLowerCase())
        ).length === 0 && <NoSearchResults />}
        {balances
          .filter((v) =>
            v.asset.metadata.symbol.toLowerCase().includes(search.toLowerCase())
          )
          .map((a) => (
            <a
              key={a.asset.asset}
              onClick={() => {
                setFrom(assetToTradeUrlSegment(a.asset));
                setBalance(a);
              }}
              className={clsx({
                "condensed p-1.5 flex ai-c card b-hover-grey": true,
                "b-black": balance.asset.asset !== a.asset.asset,
                "b-white": balance.asset.asset === a.asset.asset,
              })}>
              <IconDenom
                denom={a.asset.metadata.symbol}
                className="h-3 w-3 block"
              />
              <div className="ml-1 fw-500">
                <AssetLabel
                  asset={a.asset}
                  Container={({ children }) => (
                    <span className="color-grey fs-14 fs-lg-16">
                      {children}
                    </span>
                  )}
                />
              </div>
              {a.balance === undefined ? null : (
                <div className="ml-a text-right">
                  <Decimal
                    amount={a.balance}
                    decimals={a.asset.metadata.decimals}
                    className="color-white"
                  />
                  {a.valueUsd !== undefined && a.valueUsd > 0n && (
                    <>
                      <br />
                      <Fiat
                        amount={a.valueUsd}
                        symbol="$"
                        padSymbol={false}
                        decimals={8}
                        className="fs-12 mr-1 color-grey"
                      />
                    </>
                  )}
                </div>
              )}
            </a>
          ))}
      </div>
    </>
  );
};

const BackButton: FC<{ onClick: () => void }> = ({ onClick }) => {
  const { t } = useTranslation();
  return (
    <div className="px-1.5 mb-0.5">
      <button
        className="transparent fs-12 color-grey hover-white flex ai-c"
        onClick={onClick}>
        <Icons.AngleLeft className="w-2 h-2 mr-0.5" />
        {t("back")}
      </button>
    </div>
  );
};

const NoSearchResults: FC = () => {
  const { t } = useTranslation();
  return (
    <p className="color-grey condensed fs-14 as-c p-2">
      {t("noSearchResultsFound")}
    </p>
  );
};

const BalanceAccountSelect: FC<{
  source?: BalanceAccount;
  setSource: (b: BalanceAccount) => void;
  balance: Balance;
}> = ({ source, setSource, balance }) => {
  const { t } = useTranslation();
  if (!balance) return null;
  const accounts = sortByValueUsd(balance.accounts, (a, b) =>
    a.address.localeCompare(b.address)
  );
  return (
    <>
      <div
        className="pr-2 ml-2 ml-md-1.5 flex ai-c condensed fs-18 fw-500"
        style={{ height: "2.875rem" }}>
        <IconDenom
          denom={balance.asset.metadata.symbol}
          className="h-3.5 w-3.5 block mr-1"
        />
        {t("selectPreferredWallet", {
          symbol: balance.asset.metadata.symbol,
        })}
      </div>
      <div className="overflow-y common-scrollbars flex dir-c gap-1 pl-2 pl-md-0 pr-2 mt-1 mb-2">
        {accounts.map((x) => {
          const network = x.asset.type === "SECURED" ? THOR : x.asset.chain;
          const isSelected =
            source?.asset.asset == x.asset.asset &&
            source.address === x.address;

          return (
            <a
              key={x.address + x.asset.chain}
              onClick={() => {
                setSource(x);
              }}
              className={clsx({
                "condensed p-1.5 flex ai-c card b-hover-grey": true,
                "b-black": !isSelected,
                "b-white": isSelected,
              })}>
              <NetworkIcon network={network} className="w-3 h-3 block" />
              <p className="ml-1 fw-500 color-white flex dir-c">
                {networkLabel(network)}
                <span className="block color-grey fs-14">
                  {x.address.substring(0, 8) + "…" + x.address.slice(-8)}
                </span>
              </p>
              <div className="ml-a text-right">
                <Decimal
                  amount={x.balance}
                  symbol={x.asset.metadata.symbol}
                  className="color-white"
                />

                <br />
                <Fiat
                  amount={x.valueUsd || 0n}
                  symbol="$"
                  padSymbol={false}
                  decimals={8}
                  className="fs-12 mr-1 color-grey"
                />
              </div>
            </a>
          );
        })}
      </div>
    </>
  );
};
