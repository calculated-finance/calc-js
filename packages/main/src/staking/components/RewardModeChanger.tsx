import clsx from "clsx";
import { AnimatePresence, motion } from "motion/react";
import { FC, useEffect, useRef, useState } from "react";
import { Button, TranslationProvider, useTranslation } from "rujira.ui";

import { useAccounts } from "../../services/accounts";
import { TxButton } from "../../common/components/TxButton";
import { Icons } from "rujira.ui";
import {
  type AutoClaimerIntent,
  useAutoClaimer,
} from "../../trade/hooks/useAutoClaimer";
import {
  RewardModeSelector,
  type RewardModeSelectorPoolContext,
} from "./RewardModeSelector";

type RewardMode = "auto-claim" | "manual";

function toastOptsForIntent(
  intent: AutoClaimerIntent | undefined,
  t: (key: string) => string
) {
  switch (intent) {
    case "cancel":
      return {
        loading: t("disablingAutoClaim"),
        success: () => t("autoClaimDisabled"),
        error: (err: Error) =>
          `${t("failedToDisableAutoClaim")}: ${err.message}`,
      };
    case "modify":
      return {
        loading: t("updatingAutoClaim"),
        success: () => t("autoClaimUpdated"),
        error: (err: Error) =>
          `${t("failedToUpdateAutoClaim")}: ${err.message}`,
      };
    default:
      return {
        loading: t("enablingAutoClaim"),
        success: () => t("autoClaimActivated"),
        error: (err: Error) =>
          `${t("failedToEnableAutoClaim")}: ${err.message}`,
      };
  }
}

const REWARD_MODE_ICONS: Record<RewardMode, FC<{ className?: string }>> = {
  "auto-claim": Icons.Gear,
  manual: Icons.Wallet,
};

export const RewardModeChanger: FC<{
  poolContext: RewardModeSelectorPoolContext;
  swapTargetOptions: string[];
  bondedAmount: bigint;
  bondSymbol: string;
  showModal: (o: {
    title: string;
    backgroundClose: boolean;
    children: React.ReactNode;
    className?: string;
  }) => void;
  hideModal: () => void;
}> = ({
  poolContext,
  swapTargetOptions,
  bondedAmount,
  bondSymbol,
  showModal,
  hideModal,
}) => {
  const { t } = useTranslation("staking");
  const { selected } = useAccounts();
  const { activeInstance } = useAutoClaimer({
    appId: "RUJI-Staking",
    context: {
      stakedTokenSymbol: bondSymbol,
      poolAddress: "",
      rewardSymbol: "",
      minAmountToClaim: "0",
      slippageBps: "0",
    },
  });

  const [justSwitchedToAutomated, setJustSwitchedToAutomated] = useState(false);

  useEffect(() => {
    if (!justSwitchedToAutomated) return;
    const id = setTimeout(() => setJustSwitchedToAutomated(false), 5000);
    return () => clearTimeout(id);
  }, [justSwitchedToAutomated]);

  const getTelegramBotUrl = () =>
    `https://t.me/autorujira_bot?start=${selected?.address.address ?? ""}&utm_source=ruji-staking&utm_medium=webapp&utm_campaign=auto-claimer&utm_content=telegram-notifications-staking`;

  const currentMode: RewardMode = activeInstance ? "auto-claim" : "manual";
  const currentModeLabel =
    currentMode === "auto-claim"
      ? t("rewardModeAutomated")
      : t("rewardModeManual");
  const prevModeRef = useRef<RewardMode | null>(null);

  useEffect(() => {
    const prev = prevModeRef.current;
    prevModeRef.current = currentMode;
    if (prev === "manual" && currentMode === "auto-claim") {
      setJustSwitchedToAutomated(true);
    }
  }, [currentMode]);

  const Icon = REWARD_MODE_ICONS[currentMode];

  const openChangeRewardModal = () => {
    showModal({
      title: t("rewardsMode"),
      backgroundClose: true,
      className: "modal--lg modal--fullscreen-mobile",
      children: (
        <TranslationProvider namespace="staking">
          <div
            className="flex dir-c"
            style={{
              minHeight: "200px",
              maxHeight: "85vh",
              display: "flex",
              flexDirection: "column",
            }}>
            <div
              style={{
                overflowY: "auto",
                flex: "1 1 auto",
                minHeight: 0,
                padding: "6px 20px 6px 6px",
              }}>
              <RewardModeSelector
                poolContext={poolContext}
                swapTargetOptions={swapTargetOptions}
                accountOnly>
                {(intent) => (
                  <div
                    className="flex jc-e pt-3"
                    style={{ marginTop: "auto", flexShrink: 0 }}>
                    <TxButton
                      className="button"
                      hideSimulation
                      onSuccess={hideModal}
                      label={t("update")}
                      toastOpts={toastOptsForIntent(intent, t)}
                    />
                  </div>
                )}
              </RewardModeSelector>
            </div>
          </div>
        </TranslationProvider>
      ),
    });
  };

  return (
    <div className="mt-1.5">
      <span className="fs-14 color-grey">{t("rewardsMode")}</span>
      <div className="flex ai-c gap-1 mt-1">
        <span className="tag tag--lg tag--borderless tag--primary flex ai-c flex-shrink-0">
          <Icon className="w-4 h-4 block mr-0.5 flex-shrink-0" />
          <span className="fs-14 mr-0.5">{currentModeLabel}</span>
        </span>
        <Button
          className="button--outline button--grey button--xsmall flex-shrink-0"
          onClick={openChangeRewardModal}
          disabled={bondedAmount === 0n}
          label={t("change")}
        />
      </div>
      <AnimatePresence>
        {currentMode === "auto-claim" && (
          <motion.div
            key="telegram-alerts"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className={clsx(
              "mt-1 pt-1 flex dir-c",
              justSwitchedToAutomated && "p-2 reward-mode-changer__pulse"
            )}>
            <h4 className="fs-14 fw-500 color-grey">
              {t("getTelegramAlerts")}
            </h4>
            <Button
              className="button--outline mt-1 w-full button--icon-right"
              label={t("activate")}
              onClick={() =>
                window.open(
                  getTelegramBotUrl(),
                  "_blank",
                  "noopener,noreferrer"
                )
              }>
              <Icons.Telegram />
            </Button>
            <span className="fs-10 color-grey mt-1 block">
              {t("telegramAlertsSubtext")}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
