import { FC } from "react";
import { Button, Icons, useGlobalModalContext } from "rujira.ui";
import { ShareModal, ShareModalProps } from "./ShareModal";

type Props = ShareModalProps & {
  buttonLabel?: string;
  className?: string;
  variant?: "default" | "icon-only" | "icon-purple";
  iconSize?: string;
  "data-share-button"?: string;
};

export const ShareButton: FC<Props> = ({
  backgroundImage,
  leftComponent,
  rightComponent,
  filename,
  contentOptions,
  onCycleContent,
  account,
  indexId,
  sharesValue,
  buttonLabel = "Share",
  className,
  variant = "default",
  iconSize = "2.5",
  "data-share-button": dataShareButton,
}) => {
  const { showModal } = useGlobalModalContext();

  const handleShare = () => {
    showModal({
      title: "Share Your Passion for RUJI Index",
      backgroundClose: true,
      className: "modal--share-card",
      children: (
        <ShareModal
          backgroundImage={backgroundImage}
          leftComponent={leftComponent}
          rightComponent={rightComponent}
          filename={filename}
          contentOptions={contentOptions}
          onCycleContent={onCycleContent}
          account={account}
          indexId={indexId}
          sharesValue={sharesValue}
        />
      ),
    });
  };

  if (variant === "icon-only") {
    return (
      <button
        onClick={handleShare}
        className={`index__share-button--icon-only transparent hover-primary1 ${className || ""}`}
        aria-label="Share"
        data-share-button={dataShareButton}>
        <Icons.External className={`w-${iconSize} h-${iconSize}`} />
      </button>
    );
  }

  if (variant === "icon-purple") {
    return (
      <button
        onClick={handleShare}
        className={`index__share-button--icon-purple transparent ${className || ""}`}
        aria-label="Share"
        data-share-button={dataShareButton}>
        <Icons.External className={`w-${iconSize} h-${iconSize} icon`} />
      </button>
    );
  }

  return (
    <Button
      onClick={handleShare}
      className={`button--icon-right ${className || ""}`}
      label={buttonLabel}
      data-share-button={dataShareButton}>
      <Icons.External className={`w-${iconSize} h-${iconSize}`} />
    </Button>
  );
};
