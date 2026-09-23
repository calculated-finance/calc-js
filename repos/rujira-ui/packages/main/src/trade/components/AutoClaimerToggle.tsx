import clsx from "clsx";
import { FC, PropsWithChildren, useMemo, useState } from "react";
import { MsgMulti } from "rujira.js";
import { Toggle, useTranslation } from "rujira.ui";

import { MsgProvider, useMsg } from "../../common/components/TxButton";
import { useAccounts } from "../../services/accounts.tsx";
import { useAutoClaimer } from "../hooks/useAutoClaimer.tsx";
import { Icons } from "rujira.ui";

export const AutoClaimerToggle: FC<PropsWithChildren> = ({ children }) => {
  const { t } = useTranslation();
  const { selected } = useAccounts();
  const [autoclaimEnabled, setAutoclaimEnabled] = useState(false);

  const { msgs, activeInstance } = useAutoClaimer({
    appId: "RUJI-Trade",
    onError: () => setAutoclaimEnabled(false),
  });

  const orderMsg = useMsg();
  const isLoading = msgs === "loading";

  const msg = useMemo(() => {
    if (!orderMsg) return null;
    if (msgs === "loading") return null;
    return (autoclaimEnabled && msgs.length > 0)
      ? new MsgMulti(orderMsg.account, [orderMsg, ...msgs])
      : orderMsg;
  }, [orderMsg, autoclaimEnabled, msgs, activeInstance]);

  if (activeInstance) return children;

  return (
    <>
      <div className="flex ai-c jc-e mt-2 gap-0.5">
        <span className="color-grey fs-12">{t("autoClaim")}</span>
        <Icons.Info
          className="w-2 h-2 color-grey"
          data-tooltip-content={t("autoClaimTooltip")}
          data-tooltip-id="global-tip"
          data-tooltip-place="top"
        />
        <Toggle
          className={clsx("toggle--xs", {
            "is-loading": isLoading,
          })}
          checked={autoclaimEnabled}
          onChange={() => setAutoclaimEnabled(!autoclaimEnabled)}
          disabled={!selected || isLoading}
        />
      </div>
      <MsgProvider msg={msg}>{children}</MsgProvider>
    </>
  );
};
