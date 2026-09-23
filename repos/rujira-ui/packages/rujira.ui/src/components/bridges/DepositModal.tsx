import clsx from "clsx";
import { formatDuration, intervalToDuration } from "date-fns";
import { FC, ReactNode, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  Address,
  Asset,
  Balance,
  BalanceAccount,
  THOR,
  TxResult,
  networkConfirmationTime,
  networkExplorerLabel,
  networkLabel,
  networkTxLink,
  signers,
  validateAddress,
} from "rujira.js";
import { useTranslation } from "../../i18n";
import { IconDenom } from "../icons/IconDenom";
import { AngleLeft, External, MinusCircle } from "../icons/Icons";
import { Input } from "../inputs/Input";
import { LoaderWithContent } from "../loader/LoaderWithContent";

import {
  Button,
  Decimal,
  DenomInput,
  Fiat,
  Icons,
  NetworkIcon,
  Radio,
  Toggle,
  Warning,
} from "../..";
import deposited from "../../assets/images/deposited.gif";
import filters from "../../assets/images/filters.gif";
import filtersStatic from "../../assets/images/filters.png";
import swapImg from "../../assets/images/swap.gif";
import { Select } from "../inputs/Select";

export interface DepositSubmitProps {
  selected?: BalanceAccount;
  amount: bigint;
  target?: string;
  swapMemo?: string;
  onSuccess: (tx: TxResult) => void;
  disabled?: boolean;
  isDangerous?: boolean;
  quote: signers.cosmos.QuoteSwap | Error | "loading" | undefined;
  shouldSwap: boolean;
}

export interface DepositModalProps {
  title?: string;
  options: { asset: Asset; balance?: Balance; valueUsd?: bigint }[];
  targets: Address[];
  target?: Address;
  selected?: Balance;
  Submit: FC<DepositSubmitProps>;
  dismiss: () => void;
  feeWarning?: bigint;
  queryClient: signers.cosmos.QueryClient & signers.cosmos.ThorchainExtension;
  amount?: bigint;
  label?: string | ReactNode;
  inboundAddresses?: { dustThreshold: bigint; chain: string }[];
}

export const DepositModal: FC<DepositModalProps> = ({
  title = "deposit",
  options,
  targets,
  selected,
  dismiss,
  Submit,
  queryClient,
  amount,
  target,
  label,
  inboundAddresses,
}) => {
  const { t } = useTranslation("common");
  const [token, setToken] = useState<string | undefined>(
    selected ? selected.asset.metadata.symbol : undefined
  );
  const [asset, setAsset] = useState<Asset | undefined>(selected?.asset);
  const [tx, setTx] = useState<TxResult>();

  return (
    <div className="deposit-modal">
      {(token || asset) && !selected && !tx && (
        <button
          className="transparent color-white hover-primary1 flex ai-c mb-1 fs-14 fw-500 pointer"
          onClick={() => {
            setAsset(undefined);
            setToken(undefined);
          }}>
          <AngleLeft className="block w-2 h-2 mr-0.5" />
          {t("back")}
        </button>
      )}
      <h3 className="h3 flex ai-b mb-0">
        {asset && (
          <IconDenom
            denom={asset.metadata.symbol}
            className="as-c w-4 h-4 mr-1"
          />
        )}
        {t(title)} {asset && asset.metadata.symbol}
        {asset && (
          <small className="ml-1 color-grey fw-400">{t("toRujira")}</small>
        )}
      </h3>
      {label}
      <div className="mt-3">
        {!token && (
          <TokenSelect
            options={options}
            onSelect={(a) => {
              setToken(a.metadata.symbol);
              setAsset(a);
            }}
          />
        )}

        {asset && !tx && (
          <>
            <Confirm
              asset={asset}
              amount={amount}
              balance={
                selected ||
                options.find((a) => a.asset.asset === asset.asset)?.balance
              }
              target={target}
              targets={targets}
              Submit={Submit}
              onSuccess={setTx}
              queryClient={queryClient}
              inboundAddresses={inboundAddresses}
            />
          </>
        )}
        {tx && <Success tx={tx} dismiss={dismiss} />}
      </div>
    </div>
  );
};

const TokenSelect: FC<{
  options: { asset: Asset; balance?: Balance; valueUsd?: bigint }[];
  onSelect: (v: Asset) => void;
}> = ({ options, onSelect }) => {
  const { t } = useTranslation("common");
  const [search, setSearch] = useState<string>("");
  const [all, setAll] = useState(!options.length);
  const filtered = options.filter((i) => {
    const q = i.asset.metadata.symbol
      .toLowerCase()
      .includes(search.toLowerCase());
    return all ? q : q && i.balance;
  });

  return (
    <>
      <div className="flex">
        <Input
          containerClassName="grow"
          label={t("search")}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}>
          {search !== "" && (
            <MinusCircle
              className="input-container__clear"
              onClick={() => setSearch("")}
            />
          )}
        </Input>
        <Toggle
          label={t("showAll")}
          className="toggle--xs color-white as-c ml-1"
          checked={all}
          onChange={(e) => setAll(e.currentTarget.checked)}
        />
      </div>

      <div className="deposit-modal__content row wrap pad-mini mt-1.5">
        {filtered.map((i) => (
          <div className="col-12 col-md-col-6" key={i.asset.asset}>
            <button
              className="card card--hover-border mt-0.5 mb-0.5 p-2 flex ai-c"
              onClick={() => {
                onSelect(i.asset);
                setSearch("");
              }}>
              <IconDenom
                denom={i.asset.metadata.symbol}
                className="block w-4 h-4"
              />
              <p className="ml-1 fw-600 color-white">
                {i.asset.metadata.symbol}
              </p>
              <div className="ml-a text-right">
                {i.balance ? (
                  <Decimal
                    amount={i.balance.balance}
                    decimals={i.asset.metadata.decimals}
                    className="color-white"
                  />
                ) : null}
                <br />
                {i.valueUsd ? (
                  <small className="color-grey">
                    <Fiat
                      symbol="$"
                      padSymbol={false}
                      className="fs-12 mr-1 color-grey"
                      amount={i.valueUsd}
                      decimals={8}
                    />
                  </small>
                ) : null}
              </div>
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="color-grey my-2 w-full text-center">
            {t("noBalancesFound")}
          </p>
        )}
      </div>
    </>
  );
};

interface DepositConfirmProps {
  asset: Asset;
  balance?: Balance;
  target?: Address;
  targets: Address[];
  Submit: FC<DepositSubmitProps>;
  onSuccess: (tx: TxResult) => void;
  queryClient: signers.cosmos.QueryClient & signers.cosmos.ThorchainExtension;
  amount?: bigint;
  inboundAddresses?: { dustThreshold: bigint; chain: string }[];
}

const Confirm: FC<DepositConfirmProps> = ({
  asset,
  balance,
  targets,
  target: target_,
  Submit,
  onSuccess,
  queryClient,
  amount: requestAmount,
  inboundAddresses,
}) => {
  const { t } = useTranslation("common");
  const ref = useRef<HTMLInputElement | null>(null);
  const [amount, setAmount] = useState(requestAmount || 0n);
  const [target, setTarget] = useState<string>(target_?.address || "");
  const [custom, setCustom] = useState<string>("");
  const [direct, setDirect] = useState<boolean>(false);
  const [advanced, setAdvanced] = useState<boolean>(false);
  const [hoverAd, setHoverAd] = useState<boolean>(false);
  const [quote, setQuote] = useState<
    undefined | "loading" | signers.cosmos.QuoteSwap | Error
  >();
  const [account, setAccount] = useState(balance?.accounts[0]);
  const dustThreshold = inboundAddresses?.find(
    (a) => a.chain === account?.asset.chain
  )?.dustThreshold;

  useEffect(() => {
    if (ref.current && target === "custom") {
      ref.current.focus();
    }
  }, [target, ref]);

  const canSwap =
    asset.chain !== account?.asset.chain ||
    asset.metadata.symbol !== account.asset.metadata.symbol;

  const shouldSwap = canSwap && !direct;
  const standardChain = networkLabel(asset.chain);
  const directChain = account?.asset ? networkLabel(account.asset.chain) : "";
  const directAsset = account?.asset.metadata.symbol || asset.metadata.symbol;
  const directAssetChain = account?.asset.chain;
  const nonStandardDepositWarning = direct
    ? t("directDepositWarning", {
        asset: directAsset,
        standardChain,
        directChain,
      })
    : t("nonStandardDepositWarning", {
        asset: directAsset,
        standardChain,
        directChain,
      });

  // Determine the actual destination address
  const destination = target === "custom" ? custom : target;

  const isCustomAddressInvalid =
    target === "custom" && custom !== "" && !validateAddress(THOR, custom);

  // Fetch swap quote when conditions are met
  useEffect(() => {
    setQuote(undefined);
    if (!account) return;
    if (!shouldSwap) return;
    if (!amount) return;
    if (direct) return;
    setQuote("loading");
    queryClient.thorchain
      .getSwapQuote({
        fromAsset: account.asset.asset,
        toAsset: asset.asset,
        amount: amount,
        streamingInterval: 1n,
        streamingQuantity: 0n,
        destination,
      })
      .then(setQuote)
      .catch(setQuote);
  }, [account, amount, destination, asset, direct]);

  const depositAmount =
    typeof quote === "object" && "memo" in quote
      ? quote.expectedAmountOut
      : amount;

  const depositFee =
    (typeof quote === "object" && "memo" in quote && quote.fees?.total) || 0n;

  const price = asset.price?.current || 0n;
  const feeValue = price ? (price * depositFee) / 10n ** 12n : 0n;
  const receivedValue = price ? (price * depositAmount) / 10n ** 12n : 0n;

  return (
    <>
      {balance && balance.accounts.length > 0 ? (
        <>
          <h2 className="fs-14 fw-500 color-grey mb-1 ml-1">
            {t("selectSourceAccount")}
          </h2>
          <div className="br-1 p-2 bg-black mb-2 flex dir-c gap-y-1">
            {balance.accounts.map((x) => (
              <div
                key={x.address + x.asset.chain}
                onClick={() => {
                  setAccount(x);
                }}
                className={clsx({
                  "flex ai-c fs-14 condensed pointer": true,
                  "color-grey": account !== x,
                  "color-white": account === x,
                })}>
                <Radio checked={account === x} readOnly />
                <div
                  data-tooltip-content={x.address}
                  data-tooltip-id="modal-tip"
                  onClick={() => {
                    toast.success("Address copied to clipboard");
                    navigator.clipboard.writeText(x.address);
                  }}
                  className="inconsolata mx-1">
                  {x.address.substring(0, 6) + "…" + x.address.slice(-6)}
                </div>
                <div className="flex ai-c gap-0.5">
                  <NetworkIcon network={x.asset.chain} className="w-2 h-2" />
                  <span className="">{networkLabel(x.asset.chain)}</span>
                </div>
                <div className="flex dir-r ai-e ml-a">
                  <div
                    className={clsx({
                      "tag tag--md ml-a": true,
                      "tag--teal": account === x,
                    })}>
                    <Decimal
                      amount={x.balance}
                      symbol={x.asset.metadata.symbol}
                      className="color-grey"
                      symbolClassName="color-grey condensed fw-500"
                    />
                  </div>
                  {x.valueUsd ? (
                    <div
                      className="iflex ml-0.5 ml-sm-1 fs-13 color-white"
                      style={{ marginBottom: "0.05rem" }}>
                      (
                      <Fiat
                        amount={x.valueUsd}
                        symbol="$"
                        padSymbol={false}
                        decimals={8}
                        className="fs-12 color-white"
                      />
                      )
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : null}

      <DenomInput
        className="mt-2.5 bg-black"
        symbol={asset.metadata.symbol}
        amount={amount}
        decimals={8}
        onChangeAmount={setAmount}
        max={BigInt(account?.balance || 0)}
        maxLabel={`${t("balance")}:`}
        fiat={{ price, symbol: "$" }}
      />

      <div className="row wrap mt-1.5 mt-sm-2 condensed fs-14 px-2 gap-y-1">
        <div
          className={clsx(
            "col-12 col-xs-4 text-center text-xs-left fw-500",
            amount > 0n && amount < (dustThreshold ?? 0n)
              ? "color-red"
              : "color-grey"
          )}>
          {t("minimumDeposit")}
        </div>
        <div className="col-12 col-xs-8 text-center text-xs-right color-grey">
          {(dustThreshold ?? 0n) > 0n && (
            <Decimal
              amount={dustThreshold!}
              symbol={account?.asset.metadata.symbol}
              className={clsx("pointer", {
                "color-red": amount > 0n && amount < dustThreshold!,
                "color-grey": amount > 0n && amount > dustThreshold!,
              })}
              symbolClassName={clsx("fs-14 condensed fw-500", {
                "color-red": amount > 0n && amount < dustThreshold!,
                "color-grey": amount > 0n && amount > dustThreshold!,
              })}
              onClick={() => setAmount(dustThreshold! ?? 0n)}
            />
          )}
        </div>

        <div className="col-12 col-xs-4 text-center text-xs-left color-grey fw-500">
          {t("swapFee")}
        </div>
        <div className="col-12 col-xs-8 text-center text-xs-right color-teal">
          <LoaderWithContent
            loading={quote === "loading"}
            content={
              <div className="color-grey">
                <Decimal
                  amount={depositFee}
                  symbol={
                    direct
                      ? account?.asset.metadata.symbol
                      : asset.metadata.symbol
                  }
                  className={direct || !shouldSwap ? "color-grey" : undefined}
                  symbolClassName="color-grey fs-14 condensed fw-500"
                />
                <div className="iflex ml-1 fs-13 color-grey">
                  (
                  <Fiat
                    amount={feeValue ?? 0n}
                    symbol="$"
                    padSymbol={false}
                    decimals={8}
                    className="numeric-input__value color-grey fs-12"
                  />
                  )
                </div>
              </div>
            }
          />
        </div>

        <div className="col-12 col-xs-4 text-center text-xs-left color-grey fw-500">
          {t("receivedAmount")}
        </div>
        <div className="col-12 col-xs-8 text-center text-xs-right color-teal">
          <LoaderWithContent
            loading={quote === "loading"}
            content={
              <div className="color-white">
                <Decimal
                  amount={depositAmount}
                  symbol={
                    direct
                      ? account?.asset.metadata.symbol
                      : asset.metadata.symbol
                  }
                  symbolClassName="color-grey fs-14 condensed fw-500"
                />
                <div className="iflex ml-1 fs-13 color-grey">
                  (
                  <Fiat
                    amount={receivedValue ?? 0n}
                    symbol="$"
                    padSymbol={false}
                    decimals={8}
                    className="numeric-input__value color-grey fs-12"
                  />
                  )
                </div>
              </div>
            }
          />
        </div>

        <div
          className="flex w-full jc-c ai-c gap-0.5 pointer color-grey hover-white"
          onMouseEnter={() => setHoverAd(true)}
          onMouseLeave={() => setHoverAd(false)}
          onClick={() => setAdvanced((prev) => !prev)}>
          <img
            src={hoverAd ? filters : filtersStatic}
            className={clsx({
              "w-2 h-2": true,
              "filter-grey": !hoverAd,
              "filter-white": hoverAd,
            })}
          />
          {advanced ? t("hideAdvancedOptions") : t("showAdvancedOptions")}
        </div>
      </div>

      {/* {quote === "loading" && <Loader className="w-2 h-2" />} */}

      {advanced && (
        <div className="br-1 p-2 bg-black mt-1 row wrap condensed fs-14 px-2 gap-y-1">
          <div className="col-12 col-xs-4 text-center text-xs-left color-grey fw-500">
            {t("destination")}
          </div>
          <div className="col-12 col-xs-8 text-center text-xs-right">
            <Select
              containerClassName="fs-14"
              className="select--inline text-right"
              value={target}
              onChange={(e) => setTarget(e.currentTarget.value)}>
              {targets.map((x) => (
                <option
                  key={x.address}
                  value={x.address}
                  className={"bg-darkGrey"}>
                  {x.address}
                </option>
              ))}
              <option className={"bg-darkGrey"} value="custom">
                {t("customAddress")}
              </option>
            </Select>
          </div>
          {target === "custom" && (
            <>
              <div className="col-12 col-xs-4 text-center text-xs-left color-grey fw-500">
                {t("customDestination")}
              </div>
              <div className="col-12 col-xs-8 text-center text-xs-right">
                <Input
                  containerClassName="fs-14"
                  value={custom}
                  onChange={(e) => setCustom(e.currentTarget.value)}
                  className="input--inline text-right"
                  innerRef={ref}
                />
              </div>
            </>
          )}
          {canSwap && (
            <>
              {asset.chain === THOR ? null : (
                <div className="col-12 text-center text-xs-right">
                  <Toggle
                    className="toggle--xs"
                    checked={direct}
                    onChange={() => setDirect((prev) => !prev)}>
                    <span className="toggle__label">
                      {t("depositAssetOnChain")} {directAsset}
                      {directAssetChain && (
                        <span className="color-grey">.{directAssetChain}</span>
                      )}
                    </span>
                  </Toggle>
                </div>
              )}
              {asset.chain !== THOR && (
                <Warning
                  className="warning--sm condensed flex ai-c mt-1"
                  color="orange">
                  <img
                    src={swapImg}
                    alt=""
                    className="filter-orange block no-shrink"
                    style={{ width: "2.5rem", height: "2.5rem" }}
                  />
                  <small
                    className="text-left fs-14"
                    dangerouslySetInnerHTML={{
                      __html: nonStandardDepositWarning,
                    }}
                  />
                </Warning>
              )}
            </>
          )}
          {isCustomAddressInvalid && (
            <div className="flex dir-r jc-c grow mt-1">
              <Warning color="red" className="condensed iflex grow">
                <Icons.ExclamationTriangle className="color-red" />
                <span className="warning__msg">{t("invalidThorAddress")}</span>
              </Warning>
            </div>
          )}
        </div>
      )}
      <Submit
        selected={account}
        amount={amount}
        target={target !== "custom" ? target : custom}
        swapMemo={"memo"}
        onSuccess={onSuccess}
        disabled={isCustomAddressInvalid}
        isDangerous={false}
        quote={quote}
        shouldSwap={shouldSwap}
      />
    </>
  );
};

const Success: FC<{ tx: TxResult; dismiss: () => void }> = ({
  tx,
  dismiss,
}) => {
  const { t } = useTranslation("common");
  return (
    <>
      <div className="mt-2 flex ai-c br-2 bg-teal-10 p-2">
        <img
          src={deposited}
          alt=""
          className="filter-teal block w-6 h-a no-shrink"
        />
        <span className="color-teal fs-18 fw-600 mx-1">
          {t("depositStarted")}
        </span>
      </div>
      <div className="table table--no-hover mt-1">
        <tbody>
          <tr>
            <td className="color-grey">
              {networkLabel(tx.network)} {t("depositEta")}
            </td>
            <td>
              {formatDuration(
                intervalToDuration({
                  start: 0,
                  end: networkConfirmationTime(tx.network),
                }),
                { format: ["hours", "minutes", "seconds"], zero: false }
              )}
            </td>
          </tr>
          <tr>
            <td className="color-grey">{t("viewTx")}</td>
            <td>
              <a
                href={networkTxLink(tx)}
                target="_blank"
                className="color-white hover-primary1 no-underline">
                {networkExplorerLabel(tx.network)}
                <External className="inline-block w-1.5 h-1.5 ml-0.5" />
              </a>
            </td>
          </tr>
          <tr>
            <td className="color-grey">{t("trackDeposit")}</td>
            <td>
              <a
                href={networkTxLink({
                  network: THOR,
                  txHash: tx.txHash.replace(/^0x/, "").toUpperCase(),
                })}
                target="_blank"
                className="color-white hover-primary1 no-underline">
                THORChain.net
                <External className="inline-block w-1.5 h-1.5 ml-0.5" />
              </a>
            </td>
          </tr>
        </tbody>
      </div>
      <div className="modal__footer p-3 text-right">
        <Button label="Close" onClick={dismiss} />
      </div>
    </>
  );
};
