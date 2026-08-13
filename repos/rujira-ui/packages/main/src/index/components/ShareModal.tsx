import { FC, useRef, useState } from "react";
import { Button, Icons, ShareCard, useIsTouchDevice } from "rujira.ui";
import { useCapture } from "../../services/useCapture";
import { ShareCardBadge } from "./ShareCardBadge";
import { ShareCardBadgeAccountFragment$key } from "./__generated__/ShareCardBadgeAccountFragment.graphql";

export type ShareModalProps = {
  backgroundImage?: string;
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
  filename?: string;
  scale?: number;
  account?: ShareCardBadgeAccountFragment$key;
  indexId?: string;
  sharesValue?: bigint;
  contentOptions?: Array<{
    image: string;
    badge: string;
    heading: string;
    url: string;
  }>;
  currentContentIndex?: number;
  onCycleContent?: () => void;
};

export const ShareModal: FC<ShareModalProps> = ({
  backgroundImage,
  leftComponent: initialLeftComponent,
  rightComponent: initialRightComponent,
  filename = "rujira-share.png",
  scale = 3,
  account,
  indexId,
  sharesValue,
  contentOptions,
  currentContentIndex = 0,
  onCycleContent,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isTouchDevice = useIsTouchDevice();
  const [localIndex, setLocalIndex] = useState(currentContentIndex);
  const { share, copy, download } = useCapture(cardRef, undefined, scale);

  const handleCycleContent = () => {
    if (contentOptions && contentOptions.length > 0) {
      const newIndex = (localIndex + 1) % contentOptions.length;
      setLocalIndex(newIndex);
      onCycleContent?.();
    }
  };

  // Use dynamic content if available, otherwise use initial components
  const currentContent = contentOptions?.[localIndex];
  const leftComponent = currentContent ? (
    <div className="index__share-left">
      <img src={currentContent.image} alt={`${currentContent.badge} logo`} />
    </div>
  ) : (
    initialLeftComponent
  );

  const rightComponent = currentContent ? (
    <div className="index__share-right">
      <div className="index__share-badge">{currentContent.badge}</div>
      <h1
        className="index__share-heading"
        dangerouslySetInnerHTML={{ __html: currentContent.heading }}
      />
      <p className="index__share-url">{currentContent.url}</p>
    </div>
  ) : (
    initialRightComponent
  );

  const badgeComponent = (() => {
    if (sharesValue !== undefined) {
      return <ShareCardBadge sharesValue={sharesValue} />;
    }
    if (account && indexId) {
      return <ShareCardBadge account={account} indexId={indexId} />;
    }
    return undefined;
  })();

  return (
    <div className="index__share-modal">
      <div ref={cardRef} className="index__share-modal-card">
        <ShareCard
          backgroundImage={backgroundImage}
          leftComponent={leftComponent}
          rightComponent={rightComponent}
          badgeComponent={badgeComponent}
        />
      </div>

      <div className="index__share-modal-buttons">
        {isTouchDevice ? (
          <Button onClick={share} className="button--icon-right" label="Share">
            <Icons.Share />
          </Button>
        ) : (
          <Button
            onClick={() => download(filename)}
            className="button--icon-right"
            label="Download">
            <Icons.ArrowDown />
          </Button>
        )}

        <Button
          onClick={copy}
          className="button--outline button--icon-right"
          label="Copy">
          <Icons.Copy />
        </Button>

        {contentOptions && contentOptions.length > 1 && (
          <Button
            onClick={handleCycleContent}
            className="button--outline button--icon-right"
            label="Randomize">
            <Icons.Rotate />
          </Button>
        )}
      </div>

      <p className="index__share-modal-help-text">
        {isTouchDevice
          ? "Share or copy the image to post on social media"
          : "Download or copy the image to post on social media"}
      </p>
    </div>
  );
};
