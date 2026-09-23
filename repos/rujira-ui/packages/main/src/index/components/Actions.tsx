import clsx from "clsx";
import { FC, useEffect, useMemo, useState } from "react";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import { Account, MsgExecute, TxError, signers } from "rujira.js";
import {
  Button,
  DenomInput,
  Toggle,
  useLocale,
  useTranslation,
} from "rujira.ui";

import { Icons } from "rujira.ui";
import { usePreloadedBalance } from "../../common/components/Balance";
import { MsgProvider, TxButton } from "../../common/components/TxButton";
import { useAccounts } from "../../services/accounts";
import { IndexAccountFragment$data } from "../__generated__/IndexAccountFragment.graphql";
import { IndexQuery } from "../__generated__/IndexQuery.graphql";
import { openIndexShareModal } from "../utils";
import {
  ActionsAccountFragment$data,
  ActionsAccountFragment$key,
} from "./__generated__/ActionsAccountFragment.graphql";
import {
  AllocationFragment$data,
  AllocationFragment$key,
} from "./__generated__/AllocationFragment.graphql";
import { allocationFragment } from "./Allocation";
import { PartialWithdraw } from "./PartialWithdraw";

// Constants
const SLIPPAGE_OPTIONS = [100n, 200n, 500n, 750n] as const;
const DEFAULT_SLIPPAGE = 100n;
const GAS_RESERVE_AMOUNT = 0.1;
const REDEMPTION_RATE_DIVISOR = 1_000_000_000_000n;

const SLIP_TOOLTIP_CONTENT = {
  nav: {
    mint: "",
    redeem: "The maximum deviation from the estimated return amount.",
  },
  fixed: {
    mint: "The maximum deviation from the estimated index shares issued.",
    redeem: "The maximum deviation from the estimated return amount.",
  },
};

const accountFragment = graphql`
  fragment ActionsAccountFragment on Account {
    index {
      id
      shares
      index {
        id
        address
        shareAsset {
          asset
        }
        fees {
          rates {
            transaction
          }
        }
      }
    }
  }
`;

// Types
interface SwapData {
  denom: string;
  amount: string;
  min_return: string;
}

interface AssetAmounts {
  indexRcptTokens: bigint;
  inputMax: bigint;
  outputAmount: bigint;
}

interface AssetInfo {
  inputSymbol: string;
  inputDecimals: number;
  outputSymbol: string;
  outputDecimals: number;
  denom: string | undefined;
}

const useAssetAmounts = (
  quoteAssetAmount: bigint,
  indexAccountData: ActionsAccountFragment$data | null | undefined,
  index: IndexQuery["response"]["node"],
  isMint: boolean,
  amount: bigint
): AssetAmounts => {
  return useMemo(() => {
    const indexRcptTokens =
      indexAccountData?.index.find(
        (i) => i.index.shareAsset.asset === index?.shareAsset?.asset
      )?.shares || 0n;

    const rawInputMax = isMint ? quoteAssetAmount : indexRcptTokens;
    const inputDecimals = isMint
      ? index?.config?.quoteAsset.metadata.decimals || 8
      : index?.shareAsset?.metadata.decimals || 8;

    // Calculate gas reserve for RUNE
    const inputSymbol = isMint
      ? index?.config?.quoteAsset.metadata.symbol || ""
      : index?.shareAsset?.metadata.symbol || "";
    const isRune = inputSymbol.toLowerCase() === "rune";
    const gasReserve = isRune
      ? BigInt(GAS_RESERVE_AMOUNT * Math.pow(10, inputDecimals))
      : 0n;
    const inputMax = rawInputMax > gasReserve ? rawInputMax - gasReserve : 0n;

    // Apply Withdraw Fee to Output Amount
    let outputAmount: bigint;

    if (isMint) {
      outputAmount =
        (amount * REDEMPTION_RATE_DIVISOR) /
        BigInt(index?.status?.redemptionRate || 1n);
    } else {
      const grossOutputAmount =
        (amount * BigInt(index?.status?.redemptionRate || 0n)) /
        REDEMPTION_RATE_DIVISOR;

      // bps have 8 decimals
      const transactionFeeBps =
        (indexAccountData?.index.find(
          (i) => i.index.shareAsset.asset === index?.shareAsset?.asset
        )?.index?.fees?.rates?.transaction || 0n) / 100000000n;

      outputAmount =
        (grossOutputAmount * (10000n - transactionFeeBps)) / 10000n;
    }

    return {
      indexRcptTokens,
      inputMax,
      outputAmount,
    };
  }, [indexAccountData, index, isMint, amount]);
};

const useAssetInfo = (index: any, isMint: boolean): AssetInfo => {
  return useMemo(() => {
    const inputSymbol = isMint
      ? index?.config?.quoteAsset.metadata.symbol || ""
      : index?.shareAsset?.metadata.symbol || "";

    const inputDecimals = isMint
      ? index?.config?.quoteAsset.metadata.decimals || 8
      : index?.shareAsset?.metadata.decimals || 8;

    const outputSymbol = isMint
      ? index?.shareAsset?.metadata.symbol || ""
      : index?.config?.quoteAsset.metadata.symbol || "";

    const outputDecimals = isMint
      ? index?.shareAsset?.metadata.decimals || 8
      : index?.config?.quoteAsset.metadata.decimals || 8;

    const denom = isMint
      ? index?.config?.quoteAsset.variants.native?.denom
      : index?.shareAsset?.variants.native?.denom;

    return {
      inputSymbol,
      inputDecimals,
      outputSymbol,
      outputDecimals,
      denom,
    };
  }, [index, isMint]);
};

/**
 * Adjusts swap amounts so that the sum equals the original amount.
 * The last swap gets the remainder.
 */
function getAdjustedSwaps(
  allocations: AllocationFragment$data | null | undefined,
  amount: bigint,
  slippageBps: bigint,
  isMint: boolean
): SwapData[] {
  const allocation = allocations?.allocations ?? [];
  if (allocation.length === 0 || amount <= 0n) return [];

  const swaps = allocation
    .map((a) => {
      if (!a?.asset?.variants.native?.denom || !a.price || !a.currentWeight) {
        return undefined;
      }
      const swapAmount =
        (amount * BigInt(a.currentWeight)) / REDEMPTION_RATE_DIVISOR;
      return {
        denom: a.asset.variants.native.denom,
        amount: swapAmount,
        min_return: getMinReturn(a.price, swapAmount, slippageBps, isMint),
      };
    })
    .filter(Boolean) as { denom: string; amount: bigint; min_return: string }[];

  const sumExceptLast = swaps
    .slice(0, -1)
    .reduce((acc, s) => acc + s.amount, 0n);

  return swaps.map((swap, idx) =>
    idx === swaps.length - 1
      ? {
          ...swap,
          amount: (amount - sumExceptLast).toString(),
        }
      : {
          ...swap,
          amount: swap.amount.toString(),
        }
  );
}

/**
 * Calculates the minimum return for redeeming.
 */
function getMinReturn(
  redemptionRate: bigint,
  amount: bigint,
  slippageBps: bigint,
  isMint: boolean
): string {
  const returnAmount = isMint
    ? (amount * REDEMPTION_RATE_DIVISOR) / BigInt(redemptionRate)
    : (amount * BigInt(redemptionRate)) / REDEMPTION_RATE_DIVISOR;

  const slippageBpsAdjusted = BigInt(10_000) - slippageBps;
  const minReturn = (returnAmount * slippageBpsAdjusted) / 10_000n;

  return minReturn.toString();
}

const Slippage: FC<{
  slippageBps: bigint;
  tooltip: string;
  setSlippageBps: (v: bigint) => void;
}> = ({ slippageBps, tooltip, setSlippageBps }) => {
  const { t } = useTranslation();
  return (
    <div className="flex dir-c dir-md-r dir-lg-c dir-xl-r row-md ai-c">
      <div className="col-12 col-md-6 text-center text-md-left color-grey fw-500 py-0.5">
        <div
          className="iflex ai-c no-select"
          data-tooltip-id="global-tip"
          data-tooltip-html={tooltip}
          style={{ cursor: "pointer" }}>
          <h5 className="fs-14 lh-16 m-0 fw-500 nowrap">
            {" "}
            {t("slippageTolerance")}
          </h5>
          <Icons.Info className="ml-0.5 block w-2.5" />
        </div>
      </div>
      <div className="col-12 col-md-6 text-center text-md-right py-0.5">
        {SLIPPAGE_OPTIONS.map((val) => (
          <Button
            key={val.toString()}
            className={clsx("button--outline button--xsmall ml-0.5 w-4", {
              "button--grey": slippageBps !== val,
            })}
            onClick={() => setSlippageBps(val)}>
            {Number(val) / 100}%
          </Button>
        ))}
      </div>
    </div>
  );
};

const MintRedeemSwitch: FC<{
  mintRedeem: "mint" | "redeem";
  onModeChange: (mode: "mint" | "redeem") => void;
}> = ({ mintRedeem, onModeChange }) => {
  const { t } = useTranslation();
  return (
    <div className={`grow index__switch index__switch--${mintRedeem}`}>
      <button onClick={() => onModeChange("mint")}>{t("mint")}</button>
      <button onClick={() => onModeChange("redeem")}>{t("redeem")}</button>
    </div>
  );
};

const AmountInputs: FC<{
  partialWithdraw: boolean;
  index: any;
  amount: bigint;
  assetInfo: AssetInfo;
  assetAmounts: AssetAmounts;
  onAmountChange: (amount: bigint) => void;
  isMint?: boolean;
}> = ({
  partialWithdraw,
  index,
  amount,
  assetInfo,
  assetAmounts,
  onAmountChange,
  isMint,
}) => {
  const { t } = useTranslation("index");

  if (partialWithdraw) {
    return (
      <>
        <DenomInput
          symbol={assetInfo.inputSymbol}
          className="mt-2 mb-1"
          amount={amount}
          decimals={assetInfo.inputDecimals}
          onChangeAmount={onAmountChange}
          max={assetAmounts.inputMax}
        />
        <PartialWithdraw k={index?.status} rcptAmount={amount} />
      </>
    );
  }

  return (
    <>
      <DenomInput
        symbol={assetInfo.inputSymbol}
        className="mt-2"
        amount={amount}
        decimals={assetInfo.inputDecimals}
        onChangeAmount={onAmountChange}
        max={assetAmounts.inputMax}
      />
      <Icons.ArrowDown className="w-3 h-a my-1.5 mx-a color-grey block" />
      <div className="relative mb-2">
        <DenomInput
          symbol={assetInfo.outputSymbol}
          amount={assetAmounts.outputAmount}
          decimals={assetInfo.outputDecimals}
          onChangeAmount={() => {}}
          disabled
        />
        {!isMint && (
          <p className="index__withdrawal-fee-notice">{t("afterFees")}</p>
        )}
      </div>
    </>
  );
};

const TermsToggle: FC<{
  accept: boolean;
  onChange: (accept: boolean) => void;
}> = ({ accept, onChange }) => {
  const { t } = useTranslation();
  const { toRoot } = useLocale();
  const touHref = toRoot("tou");
  return (
    <Toggle
      checked={accept}
      onChange={(e) => onChange(e.currentTarget.checked)}
      className="toggle--small ai-c mb-1">
      <span className="toggle__label">
        {t("acceptTerms")}{" "}
        <a
          href={touHref}
          target="_blank"
          className="color-white hover-primary1">
          {t("termsOfUse")}
        </a>
      </span>
    </Toggle>
  );
};

export const Actions: FC<{
  index: IndexQuery["response"]["node"];
  account: IndexAccountFragment$data | undefined;
}> = ({ index, account }) => {
  const { selected } = useAccounts();
  const indexAccountData = useFragment<ActionsAccountFragment$key>(
    accountFragment,
    account
  );
  const allocationData = useFragment<AllocationFragment$key>(
    allocationFragment,
    index?.status
  );

  const [mintRedeem, setMintRedeem] = useState<"mint" | "redeem">("mint");
  const [txError, setTxError] = useState<TxError | null>(null);
  const [partialWithdraw, setPartialWithdraw] = useState(false);
  const [accept, setAccept] = useState(false);
  const [amount, setAmount] = useState<bigint>(0n);
  const [slippageBps, setSlippageBps] = useState<bigint>(DEFAULT_SLIPPAGE);

  const isMint = mintRedeem === "mint";

  // Custom hooks
  const assetInfo = useAssetInfo(index, isMint);
  const { balance } = usePreloadedBalance();
  const assetAmounts = useAssetAmounts(
    balance?.balance || 0n,
    indexAccountData,
    index,
    isMint,
    amount
  );

  useEffect(() => {
    if (
      !isMint &&
      index?.entryAdapter !== null
      // txError?.error.toString().includes("Insufficient Return expected") &&
      // slippageBps === 750n
    ) {
      setPartialWithdraw(true);
      setAccept(false);
    }
  }, [txError, isMint, slippageBps]);

  const msg = useMemo(() => {
    if (!accept || !assetInfo.denom) return null;
    if (!selected) return null;
    if (partialWithdraw) {
      return new MsgExecute(
        Account.fromAddress(selected.address),
        signers.cosmos.coins(amount.toString(), assetInfo.denom),
        index?.address ?? "",
        { withdraw: {} }
      );
    }

    const payload =
      index?.entryAdapter === null
        ? isMint
          ? { deposit: {} }
          : { withdraw: { slippage: (Number(slippageBps) / 10000).toString() } }
        : isMint
          ? {
              deposit: {
                index: index?.address,
                swaps: getAdjustedSwaps(
                  allocationData,
                  amount,
                  slippageBps,
                  isMint
                ),
              },
            }
          : {
              withdraw: {
                index: index?.address,
                min_return: getMinReturn(
                  index?.status?.redemptionRate || 0n,
                  amount,
                  slippageBps,
                  isMint
                ),
              },
            };

    return new MsgExecute(
      Account.fromAddress(selected.address),
      signers.cosmos.coins(amount.toString(), assetInfo.denom),
      index?.entryAdapter ?? index?.address ?? "",
      payload
    );
  }, [
    accept,
    assetInfo.denom,
    amount,
    slippageBps,
    isMint,
    allocationData,
    partialWithdraw,
    index?.entryAdapter,
    index?.address,
    index?.status?.redemptionRate,
  ]);

  const resetStates = () => {
    setAmount(0n);
    setAccept(false);
    setTxError(null);
    setPartialWithdraw(false);
    setSlippageBps(DEFAULT_SLIPPAGE);
  };

  const handleModeChange = (mode: "mint" | "redeem") => {
    resetStates();
    setMintRedeem(mode);
  };

  const shouldShowSlippage = !(
    partialWithdraw ||
    (index?.type === "nav" && isMint)
  );
  const slippageTooltip =
    SLIP_TOOLTIP_CONTENT[index?.type === "nav" ? "nav" : "fixed"][mintRedeem];

  return (
    <div className="index__actionsContainer card card--shadow p-3">
      <MintRedeemSwitch
        mintRedeem={mintRedeem}
        onModeChange={handleModeChange}
      />

      <div>
        <AmountInputs
          partialWithdraw={partialWithdraw}
          index={index}
          amount={amount}
          assetInfo={assetInfo}
          assetAmounts={assetAmounts}
          onAmountChange={setAmount}
          isMint={isMint}
        />
      </div>

      {shouldShowSlippage ? (
        <Slippage
          slippageBps={slippageBps}
          tooltip={slippageTooltip}
          setSlippageBps={setSlippageBps}
        />
      ) : (
        <div style={{ height: "30px" }} />
      )}

      <TermsToggle accept={accept} onChange={setAccept} />
      <MsgProvider msg={msg}>
        {isMint ? (
          <Button label="Paused" disabled className="button--grey" />
        ) : (
          <TxButton
            hideSimulation={!accept || amount <= 0n || !assetInfo.denom}
            label={isMint ? "Mint" : "Redeem"}
            disabled={!account}
            onError={(e) => setTxError(e)}
            onSuccess={() => {
              // Open share modal on successful mint transaction
              if (isMint) {
                const symbol = index?.shareAsset?.metadata.symbol;
                if (symbol) {
                  // Add a small delay to ensure DOM is ready
                  setTimeout(() => {
                    openIndexShareModal(symbol);
                  }, 100);
                }
              }
            }}
          />
        )}
      </MsgProvider>
    </div>
  );
};
