import clsx from "clsx";
import { FC, useEffect, useMemo, useState } from "react";
import {
  Address,
  Asset,
  ETH,
  Network,
  THOR,
  isThor,
  networkLabel,
  validateAddress,
} from "rujira.js";
import {
  AssetLabel,
  BreakPoints,
  IconDenom,
  Icons,
  Input,
  NetworkIcon,
  Provider,
  ProviderIcon,
  sortKeysByValueUsd,
  useTranslation,
  useWindowSize,
} from "rujira.ui";

export type Destination = {
  address: string;
  asset: Asset;
};

export interface DestinationOption {
  asset: Asset;
  address: string;
  network: Network;
  providers: Provider.Key[];
  valueUsd?: bigint;
  Component?: FC<Omit<DestinationOption, "Component">>;
}

export const DestinationSelectModal: FC<{
  to?: string;
  setTo: (v: string) => void;
  destination?: Destination;
  setDestination: (v: Destination) => void;
  options: DestinationOption[];
}> = ({ options: options_, setDestination, destination, to, setTo }) => {
  const { t } = useTranslation("common");
  // Store a temporary value - we don't want to commit until the final selection
  const [to_, setTo_] = useState(to);
  const [step, setStep] = useState(0);
  const { width } = useWindowSize();
  const options = options_.filter((a) => a.asset.metadata.symbol === to_);

  return (
    <div className="row flex-overflow mt-2">
      {((width < BreakPoints.medium && step === 0) ||
        width >= BreakPoints.medium) && (
        <div className="col-12 col-md-5 flex dir-c">
          <DestinationAssetSelect
            to={to_}
            options={options_}
            setTo={(v) => {
              setStep(1);
              setTo_(v);
            }}
          />
        </div>
      )}
      {((width < BreakPoints.medium && step === 1) ||
        width >= BreakPoints.medium) && (
        <div className="col-12 col-md-7 flex dir-c">
          {width < BreakPoints.medium && (
            <div className="px-1.5 mb-0.5">
              <button
                className="transparent fs-12 color-grey hover-white flex ai-c"
                onClick={() => setStep(0)}>
                <Icons.AngleLeft className="w-2 h-2 mr-0.5" />
                {t("back")}
              </button>
            </div>
          )}
          {to_ && (
            <>
              <div
                className="pr-2 ml-2.5 flex ai-c condensed fs-18 fw-500 no-shrink"
                style={{ height: "2.875rem" }}>
                <IconDenom denom={to_} className="h-3.5 w-3.5 block mr-1" />
                {t("selectPreferredWallet", { symbol: to_ })}
              </div>
              <div className="overflow-y common-scrollbars flex dir-c gap-1 pl-2 pr-2 pt-1 pb-2">
                <DestinationSelect
                  destination={destination}
                  setDestination={(d) => {
                    setDestination(d);
                    setTo(to_);
                  }}
                  options={options}
                />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

const deduplicate = (options: DestinationOption[]) =>
  options.filter(
    (x, i, arr) =>
      arr.findIndex(
        (y) =>
          y.asset.asset === x.asset.asset && y.asset.chain === x.asset.chain
      ) === i
  );

export const DestinationSelect: FC<{
  destination?: Destination;
  setDestination: (v: Destination) => void;
  enableCustomAddress?: boolean;
  options: DestinationOption[];
}> = ({ options, destination, setDestination, enableCustomAddress }) => {
  const sorted = useMemo(
    () =>
      (enableCustomAddress ? deduplicate(options) : options).sort((a, b) => {
        const aSym = a.asset.metadata.symbol;
        const bSym = b.asset.metadata.symbol;

        // First group by symbol
        const symCmp = aSym.localeCompare(bSym);
        if (symCmp !== 0) return symCmp;

        const aChain = a.asset.chain;
        const bChain = b.asset.chain;

        // Priority scoring
        const score = (asset: typeof a) => {
          const isSec = asset.asset.type === "SECURED";
          const isEth = asset.asset.chain === ETH;

          // Highest: SECURED + ETH
          if (isSec && isEth) return 0;

          // Next: SECURED on own-chain (symbol = chain)
          if (isSec && !["USDC", "USDT"].includes(asset.asset.metadata.symbol))
            return 1;

          // Next: L1 ETH
          if (!isSec && isEth) return 2;

          // Next: L1 non-ETH chains (alphabetical later)
          if (!isSec && !isEth) return 3;

          // Last: Remaining SECURED
          return 4;
        };

        const aScore = score(a);
        const bScore = score(b);

        if (aScore !== bScore) return aScore - bScore;

        //
        // If same scoring bucket, order by chain alphabetically
        //
        const chainCmp = aChain.localeCompare(bChain);
        if (chainCmp !== 0) return chainCmp;

        //
        // Final tiebreak: address
        //
        return a.address.localeCompare(b.address);
      }),
    [options, enableCustomAddress]
  );

  useEffect(() => {
    const def = sorted[0];
    if (def && !destination) setDestination(def);
  }, [sorted]);

  return (
    <>
      {sorted.map((x) => (
        <Item
          key={x.address + x.asset.asset + x.network}
          {...x}
          setDestination={setDestination}
          destination={destination}
          enableCustomAddress={enableCustomAddress}
        />
      ))}
    </>
  );
};

const Item: FC<
  {
    destination?: Destination;
    setDestination: (d: Destination) => void;
    enableCustomAddress?: boolean;
  } & DestinationOption
> = ({
  address,
  network,
  providers,
  asset,
  destination,
  setDestination,
  enableCustomAddress,
  Component,
}) => {
  const { t } = useTranslation("common");
  const [addressInvalid, setAddressInvalid] = useState(false);
  const [customAddress, setCustomAddress] = useState("");

  const isSelected = useMemo(() => {
    return enableCustomAddress
      ? asset.asset === destination?.asset.asset
      : asset.asset === destination?.asset.asset &&
          destination?.address === address;
  }, [enableCustomAddress, destination, address, asset.asset]);

  useEffect(() => {
    if (!isSelected) return;
    if (!enableCustomAddress) {
      if (destination?.asset && destination.address !== address) {
        setDestination({
          address: address,
          asset: destination.asset,
        });
      }
      return;
    }

    if (!customAddress && destination) {
      setDestination({
        address: "",
        asset: destination.asset,
      });
      return;
    }

    const valid = validateAddress(
      asset.type === "SECURED" ? THOR : asset.chain,
      customAddress
    );

    setAddressInvalid(!valid);

    if (!valid && destination) {
      setDestination({
        address: "",
        asset: destination.asset,
      });
    } else if (valid && destination) {
      setDestination({
        address: customAddress,
        asset: destination.asset,
      });
    }
  }, [customAddress, enableCustomAddress]);

  return (
    <a
      onClick={() => {
        setDestination({
          address: enableCustomAddress
            ? addressInvalid
              ? ""
              : customAddress
            : address,
          asset,
        });
      }}
      className={clsx({
        "condensed p-1.5 flex ai-c card b-hover-grey": true,
        "b-black": !isSelected,
        "b-white": isSelected,
        "glow-primary1": network === THOR,
      })}>
      <div className="lp">
        <IconDenom denom={asset.metadata.symbol} className="w-3 h-3 block" />
        <NetworkIcon network={network} className="w-3 h-3 block icon-denom" />
      </div>
      <p className="ml-1 fw-500 color-white flex dir-c w-full">
        <span>
          <AssetLabel
            asset={asset}
            Container={({ children }) => (
              <span className="color-grey fs-14 fs-lg-16">{children}</span>
            )}
          />{" "}
          <span className="color-grey">on</span> {networkLabel(network)}
        </span>
        {!enableCustomAddress && (
          <div className={"flex h-3"}>
            <span className="block color-grey fs-14 mt-0.5">
              {address.substring(0, 12)}…{address.slice(-12)}
            </span>
          </div>
        )}
        {enableCustomAddress && isSelected && (
          <div className={"flex jc-e mt-1"}>
            <div
              className={"flex dir-c grow"}
              style={{ marginBottom: "0.15rem" }}>
              <Input
                type="text"
                value={customAddress}
                onChange={(e) => {
                  setCustomAddress(e.target.value);
                }}
                disabled={false}
                label={t(
                  addressInvalid && customAddress
                    ? "invalidAddress"
                    : "customAddress"
                )}
                labelClassName="fs-14 mb-1"
                containerClassName={clsx("grow", {
                  "input-container--error": addressInvalid && customAddress,
                })}
              />
            </div>
          </div>
        )}
      </p>
      {!enableCustomAddress &&
        providers.map((p) => (
          <ProviderIcon
            key={p}
            provider={p}
            className="w-2 h-2 ml-a"
            selected
          />
        ))}
      {Component && (
        <Component
          asset={asset}
          address={address}
          network={network}
          providers={providers}
        />
      )}
    </a>
  );
};

const DestinationAssetSelect: FC<{
  to?: string;
  setTo: (v: string) => void;
  options: DestinationOption[];
}> = ({ options, to, setTo }) => {
  const { t } = useTranslation("common");
  const [search, setSearch] = useState("");
  const filtered = useMemo(
    () =>
      sortKeysByValueUsd(
        options,
        (option) => option.asset.metadata.symbol
      ).filter((a) =>
        search ? a.toLowerCase().includes(search.toLowerCase()) : true
      ),
    [options, search]
  );

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
        {filtered.length === 0 && (
          <p className="color-grey condensed fs-14 as-c p-2">
            {t("noSearchResultsFound")}
          </p>
        )}
        {filtered.map((a) => (
          <a
            key={a}
            onClick={() => {
              setTo(a);
            }}
            className={clsx({
              "condensed p-1.5 flex ai-c card b-hover-grey": true,
              "b-black": to !== a,
              "b-white": to === a,
            })}>
            <IconDenom denom={a} className="h-3 w-3 block" />
            <p className="ml-1 fw-500 color-white">{a}</p>
          </a>
        ))}
      </div>
    </>
  );
};

export const collectDestinationOptions =
  (
    accounts: { address: Address; provider: Provider.Key }[],
    Component?: FC<Omit<DestinationOption, "Component">>
  ) =>
  (asset: Asset): DestinationOption[] => {
    const secured: DestinationOption[] = asset.variants?.secured
      ? accounts
          .filter((a) => isThor(a.address))
          .map((a) => ({
            asset: asset.variants!.secured!,
            address: a.address.address,
            network: THOR,
            providers: [a.provider],
            Component,
          }))
      : [];

    return accounts.reduce(
      (a: DestinationOption[], v) =>
        validateAddress(
          asset.type === "SECURED" ? THOR : asset.chain,
          v.address.address
        )
          ? [
              {
                asset,
                address: v.address.address,
                network: asset.chain,
                providers: [v.provider],
                Component,
              },
              ...a,
            ]
          : a,
      secured
    );
  };
