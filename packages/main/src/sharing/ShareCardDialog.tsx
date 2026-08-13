import clsx from "clsx";
import { FC, ReactNode, useEffect, useRef, useState } from "react";
import {
  BreakPoints,
  Button,
  Icons,
  useGlobalModalContext,
  useIsTouchDevice,
  useTranslation,
  useWindowSize,
} from "rujira.ui";
import toast from "react-hot-toast";
import { useCapture } from "../services/useCapture";

export type ShareCardDialogProps = {
  children: ReactNode;
  shareTitle: string;
  shareText: string;
  shareUrl?: string;
  aspectRatio?: number;
  scale?: number;
};

export const buildShareMessage = ({
  headline,
  prompt,
  url,
  tagline,
}: {
  headline: string;
  prompt: string;
  url: string;
  tagline: string;
}): string =>
  // Constructed like this, instead of a multi line template literal, to control indentation
  [`${headline} 🚀`, prompt, url, tagline].join("\n\n");

export const ShareCardDialog: FC<ShareCardDialogProps> = ({
  children,
  shareTitle,
  shareText,
  shareUrl,
  aspectRatio = 2,
  scale = 2,
}) => {
  const { t } = useTranslation("common");
  const ref = useRef<HTMLDivElement>(null);
  const isMobile = useWindowSize().width < BreakPoints.medium;

  const { capture, share, copy } = useCapture(
    ref,
    { title: shareTitle, text: shareText },
    scale
  );

  const [image, setImage] = useState<{ blob: Blob; url: string } | null>(null);
  const [pending, setPending] = useState(true);

  const copyUrl = async () => {
    if (!shareUrl) return;

    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success(t("shareUrlCopied"));
    } catch (err) {
      console.error("Clipboard write failed:", err);
      toast.error(t("shareUrlCopyFailed"));
    }
  };

  useEffect(() => {
    let url: string | null = null;
    let cancelled = false;

    capture()
      .then((blob) => {
        if (cancelled || !blob) return;
        url = URL.createObjectURL(blob);
        setImage({ blob, url });
      })
      .catch((err) => console.error("Share card capture failed:", err))
      .finally(() => {
        if (!cancelled) setPending(false);
      });

    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [capture]);

  return (
    <>
      <div className="share-card-frame">
        {image ? (
          <img
            src={image.url}
            className="share-card-frame__preview"
            alt={shareText}
          />
        ) : (
          <div
            className={clsx("share-card-frame__placeholder flex ai-c jc-c", {
              "color-grey": !pending,
            })}
            style={{ aspectRatio }}>
            {pending ? (
              <div className="share-card-frame__spinner" />
            ) : (
              t("sharePreviewUnavailable")
            )}
          </div>
        )}
      </div>

      <div className="share-card-source" aria-hidden>
        <div className="share-card-source__stage" ref={ref}>
          {children}
        </div>
      </div>

      <div className="modal__footer mt-4 px-3 py-2 flex ai-c jc-e wrap">
        {shareUrl && (
          <Button
            className="button--grey button--outline mr-a"
            onClick={copyUrl}>
            <Icons.LinkAngle className="w-2 h-2 mr-1" />
            <span>{t("shareCopyUrl")}</span>
          </Button>
        )}
        <Button
          className={clsx("mr-1", {
            "button--grey button--outline": isMobile,
          })}
          onClick={() => copy(image?.blob)}
          disabled={pending}
          label={t("shareCopyImage")}
        />
        <Button
          className={clsx({ "button--grey button--outline": !isMobile })}
          onClick={() => share(image?.blob)}
          disabled={pending}
          label={t("share")}
        />
      </div>
    </>
  );
};

export type ShareCardButtonProps = ShareCardDialogProps & {
  modalTitle: string;
  className?: string;
  tooltip?: string;
};

export const ShareCardButton: FC<ShareCardButtonProps> = ({
  modalTitle,
  className,
  tooltip,
  ...dialog
}) => {
  const { showModal } = useGlobalModalContext();
  const tip = useIsTouchDevice() ? undefined : tooltip;

  return (
    <button
      className={clsx(
        "block transparent w-3 h-3 color-grey hover-white",
        className
      )}
      data-tooltip-content={tip}
      data-tooltip-id={tip ? "global-tip" : undefined}
      onClick={() =>
        showModal({
          title: modalTitle,
          className: "modal--xl",
          backgroundClose: true,
          children: <ShareCardDialog {...dialog} />,
        })
      }>
      <Icons.Share className="block w-3 h-3" />
    </button>
  );
};
