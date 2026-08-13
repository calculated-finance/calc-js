import clsx from "clsx";
import { AnimatePresence, motion } from "motion/react";
import { FC, useEffect, useMemo, useState } from "react";
import { Account, MsgMulti } from "rujira.js";
import { useClickOutside, useTranslation } from "rujira.ui";

import { Icons } from "rujira.ui";
import { MsgProvider, TxButton } from "../../common/components/TxButton";
import { useAccounts } from "../../services/accounts.tsx";
import { useAutoClaimer } from "../hooks/useAutoClaimer.tsx";

interface AutoClaimerStatusMenuProps {
  className?: string;
}

export const AutoClaimerStatusMenu: FC<AutoClaimerStatusMenuProps> = ({
  className,
}) => {
  const { t } = useTranslation();
  const { selected } = useAccounts();
  const { activeInstance, msgs } = useAutoClaimer({ appId: "RUJI-Trade" });
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useClickOutside(() => setShowMenu(false));
  const isLoading = msgs === "loading";
  const statusLabel = activeInstance ? t("on") : t("off");
  const toggleLabel = activeInstance ? t("disable") : t("enable");
  const [shouldPromote, setShouldPromote] = useState(false);

  useEffect(() => {
    if (activeInstance && shouldPromote) {
      setShowMenu(true);
      setShouldPromote(false);
    }
  }, [activeInstance, shouldPromote]);

  const getTelegramBotUrl = () =>
    `https://t.me/autorujira_bot?start=${selected?.address.address ?? ""}&utm_source=ruji-trade&utm_medium=webapp&utm_campaign=auto-claimer&utm_content=telegram-notifications`;

  const msg = useMemo(() => {
    if (!selected) return null;
    if (msgs === "loading") return null;
    return new MsgMulti(Account.fromAddress(selected.address), msgs);
  }, [selected, msgs, activeInstance]);

  return (
    <div className={clsx("autoClaimer-status flex ai-c gap-0.5", className)}>
      <span className="fs-14 condensed">{t("autoClaim")}</span>
      <span
        className={clsx("tag tag--sm", {
          "tag--teal": !!activeInstance,
        })}>
        {statusLabel}
      </span>
      <div
        className={clsx("autoClaimer__menu-trigger", {
          "is-active": showMenu,
        })}
        onClick={(e) => {
          e.stopPropagation();
          setShowMenu((prev) => !prev);
        }}
        data-tooltip-content={!showMenu ? t("automationMenu") : undefined}
        data-tooltip-id="global-tip"
        data-tooltip-place="top">
        <Icons.Ellipsis className="color-white w-2 h-2 hover-primary1" />

        <AnimatePresence>
          {showMenu && (
            <motion.nav
              ref={menuRef}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}>
              {activeInstance && (
                <>
                  <a
                    href={getTelegramBotUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                    }}
                    className="flex ai-c">
                    <Icons.Telegram className="w-2 h-2 mr-1" />
                    <span className="mr-1">{t("activateNotifications")}</span>
                    <Icons.External className="w-1.5 h-1.5 ml-a" />
                  </a>

                  <a
                    href="https://hub.autorujira.app/automations/activity?utm_source=ruji-trade&utm_medium=webapp&utm_campaign=auto-claimer&utm_content=my-automations"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                    }}
                    className="flex ai-c">
                    <Icons.Rocket className="w-2 h-2 mr-1" />
                    <span className="mr-1">{t("myAutomations")}</span>
                    <Icons.External className="w-1.5 h-1.5 ml-a" />
                  </a>

                  <a
                    href="https://autorujira.app/home/my-account?utm_source=ruji-trade&utm_medium=webapp&utm_campaign=auto-claimer&utm_content=config-menu"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                    }}
                    className="flex ai-c">
                    <Icons.Gear className="w-2 h-2 mr-1" />
                    <span className="mr-1">{t("config")}</span>
                    <Icons.External className="w-1.5 h-1.5 ml-a" />
                  </a>
                  <hr className="hr" />
                </>
              )}

              <MsgProvider msg={msg}>
                <TxButton
                  className={clsx({
                    "button--sm": true,
                    "button--grey button--xs": activeInstance,
                  })}
                  onSuccess={() => !activeInstance && setShouldPromote(true)}
                  hideSimulation
                  disabled={!msg || !selected || isLoading}
                  label={toggleLabel}
                  toastOpts={{
                    loading: t(
                      activeInstance
                        ? "disablingAutoClaim"
                        : "enablingAutoClaim"
                    ),
                    success: () => {
                      return activeInstance
                        ? t("autoClaimDeactivated")
                        : t("autoClaimActivated");
                    },
                    error: (err) =>
                      `${
                        activeInstance
                          ? t("failedToDeactivateAutoClaim")
                          : t("failedToActivateAutoClaim")
                      }: ${err.message}`,
                  }}
                />
              </MsgProvider>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
