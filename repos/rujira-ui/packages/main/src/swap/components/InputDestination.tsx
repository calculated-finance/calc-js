import { FC, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import { Network, THOR } from "rujira.js";
import {
  Decimal,
  SwapSelect,
  SwapSelectOption,
  TokenSelect,
  TranslationProvider,
  useGlobalModalContext,
} from "rujira.ui";
import {
  collectDestinationOptions,
  DestinationOption,
  DestinationSelectModal,
} from "../../common/components/Destination";
import { useAccounts } from "../../services/accounts";
import { RUNE } from "../../services/asset";
import {
  assetToTradeUrlSegment,
  findAssetByUrlSegment,
  normalizeChainParam,
  parseUrlSegment,
} from "../../services/assetUrl";
import { useQuote } from "../../services/useQuote";
import { InputDestinationFragment$key } from "./__generated__/InputDestinationFragment.graphql";
import { useSwapContext } from "./Context";

const fragment = graphql`
  fragment InputDestinationFragment on ThorchainV2 {
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
            metadata {
              symbol
              decimals
            }
            price {
              current
            }
          }
        }
      }
      assetTorPrice
    }
  }
`;

export const InputDestination: FC<{
  r?: InputDestinationFragment$key;
}> = ({ r }) => {
  const { showModal, hideModal } = useGlobalModalContext();
  const {
    to,
    setTo,
    quote,
    setDestination,
    destination,
    source,
    amount: input,
  } = useSwapContext();
  const [searchParams] = useSearchParams();
  const toChain = normalizeChainParam(searchParams.get("toChain"));
  const tc = useFragment(fragment, r);
  const preferredOrder = [
    "THOR.RUJI",
    "THOR.RUNE",
    "ETH.USDC-0XA0B86991C6218B36C1D19D4A2E9EB0CE3606EB48",
    "BTC.BTC",
  ];
  const { accounts } = useAccounts();
  const rune = tc?.rune?.price ? { ...RUNE, price: tc.rune.price } : RUNE;
  const options: DestinationOption[] = (tc?.pools || [])
    .reduce(
      (a, v) => {
        if (v.status !== "AVAILABLE") return a;
        if (v.asset.asset === source?.asset.asset) return a;
        return [v.asset, ...a];
      },
      [rune]
    )
    .flatMap(
      collectDestinationOptions(
        accounts || [],
        source &&
          QuotePreview({ fromAsset: source?.asset.asset, amount: input })
      )
    )
    .sort((a, b) => {
      const aSymbol = a.asset.asset;
      const bSymbol = b.asset.asset;
      const aIndex = preferredOrder.indexOf(aSymbol);
      const bIndex = preferredOrder.indexOf(bSymbol);
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      return a.asset.metadata.symbol.localeCompare(b.asset.metadata.symbol);
    });

  const amount =
    typeof quote === "object" && "memo" in quote ? quote.expectedAmountOut : 0n;
  const value =
    ((destination?.asset.price?.current || 0n) * amount) / 10n ** 12n;

  useEffect(() => {
    const matched = to
      ? findAssetByUrlSegment(
          to,
          options.map((o) => o.asset),
          toChain
        )
      : undefined;
    const def = matched
      ? options.find((o) => o.asset.asset === matched.asset)
      : undefined;
    if (def && !destination) setDestination(def);
  }, [options]);

  const OpenModal = () => {
    showModal({
      backgroundClose: true,
      className: "modal--xl modal--fixed modal--nopad",
      children: (
        <TranslationProvider namespace="common">
          <DestinationSelectModal
            setTo={setTo}
            to={to}
            destination={destination}
            setDestination={(v) => {
              setDestination(v);
              hideModal();
            }}
            options={options}
          />
        </TranslationProvider>
      ),
    });
  };

  const parsedTo = to ? parseUrlSegment(to, toChain) : undefined;
  const defaultAsset: SwapSelectOption = {
    asset: `${parsedTo?.metadata.symbol ?? ""}.${parsedTo?.chain ?? ""}`,
    type: "LAYER_1",
    chain: (parsedTo?.chain ?? "") as Network,
    metadata: {
      symbol: parsedTo?.metadata.symbol || "",
      decimals: 8,
    },
  };

  return (
    <>
      <div className="row wrap pad--sm gap-y-1 jc-c">
        <div className="col-12 col-sm-6 col-md-5 col-lg-4 col-xl-3">
          <TokenSelect
            selected={destination?.asset || defaultAsset}
            onClick={accounts?.length ? OpenModal : () => {}}
            network={
              destination?.asset.type === "SECURED"
                ? THOR
                : destination?.asset?.chain
            }
            address={destination?.address}
          />
        </div>
        <div className="col-12 col-sm-6 col-md-7 col-lg-5">
          <SwapSelect
            selected={destination?.asset || defaultAsset}
            //options={options}
            onSelect={(v) => {
              setTo(assetToTradeUrlSegment(v));
              setDestination(undefined);
            }}
            amount={amount}
            value={value}
            hideSelected={true}
            className="swap-select--responsive"
          />
          {/* <DestinationAccountSelect assets={targetPools} /> */}
        </div>
      </div>
    </>
  );
};

const QuotePreview: (v: {
  fromAsset: string;
  amount: bigint;
}) => FC<Omit<DestinationOption, "Component">> =
  (props) =>
  ({ asset, address }) => {
    const req = useMemo(() => {
      return {
        from: props.fromAsset,
        amount: props.amount,
        to: asset.asset,
        destination: address,
      };
    }, [props]);

    const quote = useQuote(req, true);
    return (
      <div className="ml-1 color-grey">
        {typeof quote === "object" && "memo" in quote ? (
          <Decimal amount={quote.expectedAmountOut} round={4} />
        ) : (
          <div className="skeleton h-2 w-6 br-4" />
        )}
      </div>
    );
  };
