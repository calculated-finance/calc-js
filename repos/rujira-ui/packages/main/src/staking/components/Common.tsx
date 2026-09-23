import { FC, PropsWithChildren } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Icons, useTranslation } from "rujira.ui";

export const StakingContainer: FC<PropsWithChildren> = ({ children }) => {
  const { t } = useTranslation("staking");
  const navigate = useNavigate();
  const { state } = useLocation();
  const backLabel =
    state?.from === "lend" ? t("backToLending") : t("backToStaking");

  return (
    <div className="rujira__main rujira__main--gradient pools">
      <div className="rujira__inner rujira__inner--pad">
        <button
          onClick={() => navigate(-1)}
          className="fs-14 color-grey hover-white iflex ai-c pointer"
          style={{ background: "none", border: "none", padding: 0 }}>
          <Icons.ArrowLeft className="w-2 h-a mr-0.5" />
          {backLabel}
        </button>
        {children}
      </div>
    </div>
  );
};

export const AddressLink: FC<{ address: string }> = ({ address }) => {
  const url = address.startsWith("sthor")
    ? `https://stagenet.thorchain.net/address/${address}`
    : `https://thorchain.net/address/${address}`;

  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={url}
      className="color-white hover-primary1 iflex ai-c">
      {`${address.slice(0, 8)} ... ${address.slice(-12)}`}
      <Icons.External className="w-2 h-2 ml-1" />
    </a>
  );
};
