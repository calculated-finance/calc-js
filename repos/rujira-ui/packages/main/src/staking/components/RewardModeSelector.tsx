import clsx from "clsx";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { Account, BTC, MsgMulti } from "rujira.js";
import { Button, IconDenom, Numeric, useTranslation } from "rujira.ui";

import { Icons } from "rujira.ui";
import { MsgProvider, useMsg } from "../../common/components/TxButton";
import { useAccounts } from "../../services/accounts";
import {
  type AutoClaimerIntent,
  useAutoClaimer,
} from "../../trade/hooks/useAutoClaimer";
import {
  type ActiveInstance,
  type AutoClaimerStakingContext,
  parseInstanceParameters,
} from "../utils.ts";

const DEFAULT_SWAP_TARGET = "USDC";

export type AccountRewardMode = "auto-claim" | "manual";

export interface RewardModeSelectorPoolContext {
  stakedTokenSymbol: string;
  poolAddress: string;
  rewardSymbol: string;
  swapTargetAddressMap: Map<string, string>;
}

export interface RewardModeSelectorProps {
  poolContext: RewardModeSelectorPoolContext;
  swapTargetOptions: string[];
  accountOnly?: boolean;
  children?:
    | React.ReactNode
    | ((intent: AutoClaimerIntent | undefined) => React.ReactNode);
}

const SwapTargetSelect: FC<{
  value: string;
  options: string[];
  onChange: (symbol: string) => void;
}> = ({ value, options, onChange }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const displayValue = options.includes(value) ? value : (options[0] ?? value);

  return (
    <div
      ref={containerRef}
      className={clsx(
        "denom-select condensed denom-select--network denom-select--compact",
        open && "denom-select--open"
      )}>
      <div
        role="button"
        tabIndex={0}
        className="denom-select__selected"
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => e.key === "Enter" && setOpen((o) => !o)}>
        <IconDenom denom={displayValue} />
        <span>{displayValue}</span>
        <Icons.AngleDown />
      </div>
      {open && (
        <div className="denom-select__dropdown" role="listbox">
          {options.map((sym) => (
            <a
              key={sym}
              href="#"
              role="option"
              aria-selected={sym === displayValue}
              onClick={(e) => {
                e.preventDefault();
                onChange(sym);
                setOpen(false);
              }}>
              <IconDenom denom={sym} />
              {sym}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

function deriveIntent(
  prevInstance: ActiveInstance,
  selectedMode: AccountRewardMode,
  hasChanges: boolean,
  hasSynced: boolean
): AutoClaimerIntent | undefined {
  if (!prevInstance) {
    return selectedMode === "auto-claim" ? "launch" : undefined;
  }
  if (selectedMode === "manual") return "cancel";
  if (hasSynced && hasChanges) return "modify";
  return undefined;
}

export const RewardModeSelector: FC<RewardModeSelectorProps> = ({
  poolContext,
  swapTargetOptions,
  accountOnly = true,
  children,
}) => {
  const { t } = useTranslation("staking");
  const { selected } = useAccounts();
  const options =
    swapTargetOptions.length > 0 ? swapTargetOptions : [DEFAULT_SWAP_TARGET];
  const defaultSwapTarget = options.includes(BTC) ? BTC : (options[0] ?? "");

  // --- Form state ---
  const [selectedMode, setSelectedMode] = useState<AccountRewardMode>("manual");
  const [minUsdCents, setMinUsdCents] = useState<bigint>(100n);
  const [slippageBps, setSlippageBps] = useState<bigint>(100n);
  const [swapTargetSymbol, setSwapTargetSymbol] = useState<string | undefined>(
    undefined
  );

  // --- Build context for useAutoClaimer ---
  const context = useMemo<AutoClaimerStakingContext>(
    () => ({
      stakedTokenSymbol: poolContext.stakedTokenSymbol,
      poolAddress: poolContext.poolAddress,
      rewardSymbol: poolContext.rewardSymbol,
      swapTargetSymbol,
      minAmountToClaim: String(Number(minUsdCents) / 100),
      slippageBps: String(slippageBps),
      swapContractAddress: swapTargetSymbol
        ? poolContext.swapTargetAddressMap.get(swapTargetSymbol)
        : undefined,
    }),
    [
      poolContext.stakedTokenSymbol,
      poolContext.poolAddress,
      poolContext.rewardSymbol,
      poolContext.swapTargetAddressMap,
      swapTargetSymbol,
      minUsdCents,
      slippageBps,
    ]
  );

  // --- Change detection via synced snapshot (avoids string-format mismatches) ---
  const prevInstanceRef = useRef<ActiveInstance>(null);
  const [hasSynced, setHasSynced] = useState(false);
  const syncedValuesRef = useRef<{
    minUsdCents: bigint;
    slippageBps: bigint;
    swapTargetSymbol: string | undefined;
  } | null>(null);

  const hasChanges =
    syncedValuesRef.current !== null &&
    (minUsdCents !== syncedValuesRef.current.minUsdCents ||
      slippageBps !== syncedValuesRef.current.slippageBps ||
      swapTargetSymbol !== syncedValuesRef.current.swapTargetSymbol);

  const intent = deriveIntent(
    prevInstanceRef.current,
    selectedMode,
    hasChanges,
    hasSynced
  );

  const { activeInstance, msgs } = useAutoClaimer({
    appId: "RUJI-Staking",
    context,
    intent,
  });

  // --- Track instance ref ---
  useEffect(() => {
    prevInstanceRef.current = activeInstance;
  }, [activeInstance]);

  // --- Sync form from instance (option B) ---
  useEffect(() => {
    if (!activeInstance) {
      syncedValuesRef.current = null;
      setHasSynced(false);
      return;
    }
    setSelectedMode("auto-claim");
    const params = parseInstanceParameters(
      activeInstance,
      poolContext.swapTargetAddressMap
    );
    if (params) {
      const minStr = params.minAmountToClaim;
      const minUsd =
        minStr !== undefined && minStr !== ""
          ? parseFloat(String(minStr))
          : NaN;
      const newMin = !Number.isNaN(minUsd)
        ? BigInt(Math.round(minUsd * 100))
        : 100n;
      const newSlippage =
        params.slippageBps !== undefined && params.slippageBps !== ""
          ? BigInt(params.slippageBps)
          : 100n;
      const newSwap = params.swapTargetSymbol;

      setMinUsdCents(newMin);
      setSlippageBps(newSlippage);
      setSwapTargetSymbol(newSwap);

      syncedValuesRef.current = {
        minUsdCents: newMin,
        slippageBps: newSlippage,
        swapTargetSymbol: newSwap,
      };
    }
    setHasSynced(true);
  }, [activeInstance, poolContext.swapTargetAddressMap]);

  // --- Combine msgs (works for both deposit and modal without knowing context) ---
  const parentMsg = useMsg();
  const combinedMsg = useMemo(() => {
    if (msgs === "loading") return parentMsg;
    if (!msgs.length) return parentMsg;
    if (parentMsg) return new MsgMulti(parentMsg.account, [parentMsg, ...msgs]);
    if (selected)
      return new MsgMulti(Account.fromAddress(selected.address), msgs);
    return null;
  }, [msgs, parentMsg, selected]);

  // --- Form UI ---
  const optionCardClass = "card card--hover-shadow p-3 flex dir-c flex-1";
  const isAutomateSelected = selectedMode === "auto-claim";
  const swapEnabled = isAutomateSelected && !!swapTargetSymbol;

  const poweredByAuto = (
    <div className="flex ai-c fs-12 color-grey flex-shrink-0">
      <IconDenom denom="AUTO" className="w-3 h-3 mr-0.5" />
      <span>{t("poweredByAUTO")}</span>
    </div>
  );

  const automateExpandContent = (
    <div className="flex dir-c gap-3">
      <div>
        <h4 className="fs-14 fw-500 color-grey mb-2">{t("afterClaiming")}</h4>
        <div className="flex dir-c dir-md-r gap-2 w-full">
          <div
            role="button"
            tabIndex={0}
            onKeyDown={(e) =>
              e.key === "Enter" && setSwapTargetSymbol(undefined)
            }
            className={clsx(
              "card card--hover-shadow p-3 flex dir-c col-12 col-md-6 flex-1 min-w-0",
              !swapEnabled ? "card--outline-primary" : "card--border"
            )}
            onClick={() => setSwapTargetSymbol(undefined)}>
            <span className="fw-500 fs-14">
              {t("sendAsSymbol", { symbol: poolContext.rewardSymbol })}
            </span>
            <span className="fs-14 color-grey mt-0.5">
              {t("sendAsSymbolSubtext")}
            </span>
          </div>
          <div
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setSwapTargetSymbol(swapTargetSymbol || defaultSwapTarget);
              }
            }}
            className={clsx(
              "card card--hover-shadow p-3 flex dir-c col-12 col-md-6 flex-1 min-w-0",
              swapEnabled ? "card--outline-primary" : "card--border"
            )}
            onClick={() =>
              setSwapTargetSymbol(swapTargetSymbol || defaultSwapTarget)
            }>
            <span className="fw-500 fs-14">{t("swapBeforeSending")}</span>
            <span className="fs-14 color-grey mt-0.5">
              {t("swapBeforeSendingSubtext")}
            </span>
          </div>
        </div>
      </div>
      <div className="flex dir-c dir-md-r gap-3 w-full">
        <div
          className={clsx("min-w-0 col-12", swapEnabled && "col-md-4")}
          style={{ flex: "1 1 0%", minWidth: 0 }}>
          <h4 className="fs-14 fw-500 color-grey mb-0.5">
            {t("claimWhenRewardsMin")}
          </h4>
          <div className="col w-14 mt-0.5">
            <div className="flex dir-r ai-c gap-1">
              <div className="col min-w-0">
                <Numeric
                  decimals={2}
                  amount={minUsdCents}
                  onChangeAmount={setMinUsdCents}
                />
              </div>
              <span className="fs-14 color-grey flex-shrink-0">USD</span>
            </div>
          </div>
        </div>
        {swapEnabled && (
          <>
            <div
              className="min-w-0 col-12 col-md-4"
              style={{ flex: "1 1 0%", minWidth: 0 }}>
              <h4 className="fs-14 fw-500 color-grey mb-0.5">
                {t("swapRewardsTo")}
              </h4>
              <div className="col w-14 mt-0.5">
                <SwapTargetSelect
                  value={
                    swapTargetSymbol && options.includes(swapTargetSymbol)
                      ? swapTargetSymbol
                      : defaultSwapTarget
                  }
                  options={options}
                  onChange={setSwapTargetSymbol}
                />
              </div>
            </div>
            <div
              className="min-w-0 col-12 col-md-4"
              style={{ flex: "1 1 0%", minWidth: 0 }}>
              <div className="fs-14 color-grey mb-0.5">
                {t("slippageTolerance")}
              </div>
              <div className="flex wrap gap-0.5 mt-0.5">
                {(
                  [
                    [100n, "1%"],
                    [200n, "2%"],
                    [500n, "5%"],
                    [750n, "7.5%"],
                  ] as [bigint, string][]
                ).map(([bps, label]) => (
                  <Button
                    key={String(bps)}
                    className={clsx(
                      "button--outline button--xsmall",
                      slippageBps !== bps && "button--grey"
                    )}
                    onClick={() => setSlippageBps(bps)}
                    label={label}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
      {swapEnabled && (
        <p className="fs-14 color-grey mt-0.5">{t("swapsExecutedHelper")}</p>
      )}
    </div>
  );

  const formUI = (
    <>
      <h4 className="fs-14 fw-500 color-grey mb-2">
        {t("chooseWhatToDoWithRewards")}
      </h4>
      <div className="flex dir-c gap-2 mt-2">
        {!accountOnly && (
          <div
            role="button"
            tabIndex={0}
            onKeyDown={(e) =>
              e.key === "Enter" && setSelectedMode("auto-claim")
            }
            className={clsx(
              optionCardClass,
              selectedMode !== "auto-claim" && "card--border",
              selectedMode === "auto-claim" && "card--ring-primary"
            )}
            onClick={() => setSelectedMode("auto-claim")}>
            <span className="fw-500 fs-14">{t("reinvestAutomatically")}</span>
            <span className="fs-14 color-grey mt-0.5">
              {t("autoCompoundDescription")}
            </span>
          </div>
        )}
        <div
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && setSelectedMode("manual")}
          className={clsx(
            optionCardClass,
            selectedMode !== "manual" && "card--border",
            selectedMode === "manual" && "card--ring-primary"
          )}
          onClick={() => setSelectedMode("manual")}>
          <div className="flex dir-r ai-c jc-s pointer">
            <div className="flex dir-c flex-1 min-w-0">
              <div className="flex ai-c gap-1">
                <div className="flex ai-c gap-1 flex-1 min-w-0">
                  <span className="fw-500 fs-14">{t("claimManually")}</span>
                </div>
              </div>
              <span className="fs-14 color-grey mt-0.5">
                {t("manualDescription")}
              </span>
            </div>
          </div>
        </div>
        <div
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && setSelectedMode("auto-claim")}
          className={clsx(
            optionCardClass,
            !isAutomateSelected && "card--border",
            isAutomateSelected && "card--ring-primary"
          )}
          onClick={() => setSelectedMode("auto-claim")}>
          <div className="flex dir-r ai-c jc-s pointer">
            <div className="flex dir-c flex-1 min-w-0">
              <div className="flex ai-c gap-1">
                <div className="flex ai-c gap-1 flex-1 min-w-0">
                  <span className="fw-500 fs-14">{t("automateRewards")}</span>
                </div>
                <div className="ml-auto flex-shrink-0 show-md-flex">
                  {poweredByAuto}
                </div>
              </div>
              <span className="fs-14 color-grey mt-0.5">
                {t("automateRewardsDescription")}
              </span>
              <div className="mt-0.5 visually-hidden-md">{poweredByAuto}</div>
            </div>
          </div>
          {isAutomateSelected && (
            <div
              className="mt-1 pt-1 condensed"
              onClick={(e) => e.stopPropagation()}
              role="presentation">
              <hr className="hr mb-2 opacity-4" />
              {automateExpandContent}
            </div>
          )}
        </div>
      </div>
    </>
  );

  return (
    <>
      {formUI}
      <MsgProvider msg={combinedMsg}>
        {typeof children === "function" ? children(intent) : children}
      </MsgProvider>
    </>
  );
};

