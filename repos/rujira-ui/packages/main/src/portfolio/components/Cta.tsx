import { FC } from "react";
import {
  Button,
  BuyModal,
  useTranslation,
  Icons,
  useGlobalModalContext,
} from "rujira.ui";

export const Buy: FC<{ disabled?: boolean }> = ({ disabled = true }) => {
  const { t } = useTranslation("portfolio");
  const { showModal } = useGlobalModalContext();

  const onClick = () => {
    showModal({
      //title: `Send ${symbol}`,
      backgroundClose: false,
      children: <BuyModal />,
    });
  };

  return (
    <div className="gradient-card gradient-card--blue p-2 p-lg-3 bg-black h-full flex dir-c ai-s">
      <h3 className="fs-14 fs-lg-16 lh-22 fw-500 color-teal">
        {t("buyCrypto")}
      </h3>
      <p className="fs-12 fs-lg-14 lh-16 lh-lg-18 color-white mt-0.5 mb-2">
        {t("buyCryptoDescription")}
      </p>

      <Button
        disabled={disabled}
        onClick={onClick}
        className="mt-a mb-0 button--blue button--icon-right no-shrink"
        label={t("comingSoon")}>
        <Icons.Timer />
      </Button>
    </div>
  );
};

export const Deposit: FC<{ disabled?: boolean }> = ({ disabled }) => {
  const { t } = useTranslation("portfolio");
  return (
    <div className="gradient-card gradient-card--purple p-2 p-lg-3 bg-black h-full flex dir-c ai-s">
      <h3 className="fs-14 fs-lg-16 lh-22 fw-500 color-primary1">
        {t("depositCrypto")}
      </h3>
      <p className="fs-12 fs-lg-14 lh-16 lh-lg-18 color-white mt-0.5 mb-2">
        {t("depositCryptoDescription")}
      </p>

      <Button
        disabled={disabled}
        onClick={() => document.getElementById("deposit")?.click()}
        className="mt-a mb-0 button--icon-right no-shrink"
        label={t("depositNow")}>
        <Icons.ArrowUpRight />
      </Button>
    </div>
  );
};
