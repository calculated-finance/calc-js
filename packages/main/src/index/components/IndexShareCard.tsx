import { FC, useEffect, useState } from "react";
import ShareBackground from "../assets/share-card-bg.png";
import ShareCardRji from "../assets/share-card-rji.png";
import ShareCardYtcy from "../assets/share-card-tcy.png";
import ShareCardYrune from "../assets/share-card-yrune.png";
import { openIndexShareModal } from "../utils";
import { ShareCardBadgeAccountFragment$key } from "./__generated__/ShareCardBadgeAccountFragment.graphql";
import { ShareButton } from "./ShareButton";

type ShareContent = {
  image: string;
  badge: string;
  heading: string;
  url: string;
};

const shareContentMap: Record<string, ShareContent[]> = {
  ytcy: [
    {
      image: ShareCardYtcy,
      badge: "yTCY",
      heading: "This is how TCY <em>should</em> feel.",
      url: "https://rujira.network/index",
    },
    {
      image: ShareCardYtcy,
      badge: "yTCY",
      heading: "If TCY had a pro mode, this would be it.",
      url: "https://rujira.network/index",
    },
    {
      image: ShareCardYtcy,
      badge: "yTCY",
      heading: "The <em>art</em> of TCY yield.",
      url: "https://rujira.network/index",
    },
  ],
  yrune: [
    {
      image: ShareCardYrune,
      badge: "yRUNE",
      heading: "The <em>unofficial</em> RUNE LST.",
      url: "https://rujira.network/index",
    },
    {
      image: ShareCardYrune,
      badge: "yRUNE",
      heading: "Earn RUNE. Stay <em>Liquid</em>.",
      url: "https://rujira.network/index",
    },
    {
      image: ShareCardYrune,
      badge: "yRUNE",
      heading: "RUNE yield without lockup.",
      url: "https://rujira.network/index",
    },
  ],
  rji: [
    {
      image: ShareCardRji,
      badge: "RJI",
      heading: "Own the <em>entire</em> Rujira game.",
      url: "https://rujira.network/index",
    },
    {
      image: ShareCardRji,
      badge: "RJI",
      heading: "Stop picking winners. Own them <em>all</em>.",
      url: "https://rujira.network/index",
    },
    {
      image: ShareCardRji,
      badge: "RJI",
      heading: "The ultimate Rujira play.",
      url: "https://rujira.network/index",
    },
  ],
};

type Props = {
  symbol: string;
  indexId?: string;
  account?: ShareCardBadgeAccountFragment$key;
  sharesValue?: bigint;
  iconSize?: string;
  className?: string;
  variant?: "default" | "icon-only" | "icon-purple";
  triggerOpen?: boolean;
  onModalOpened?: () => void;
};

export const IndexShareCard: FC<Props> = ({
  symbol,
  indexId,
  account,
  sharesValue,
  iconSize,
  className,
  variant,
  triggerOpen,
  onModalOpened,
}) => {
  const contentOptions = shareContentMap[symbol.toLowerCase()] || [];
  const [currentIndex, setCurrentIndex] = useState(0);

  if (contentOptions.length === 0) {
    return null;
  }

  const cycleContent = () => {
    setCurrentIndex((prev) => (prev + 1) % contentOptions.length);
  };

  useEffect(() => {
    if (triggerOpen) {
      openIndexShareModal(symbol);
      onModalOpened?.();
    }
  }, [triggerOpen, symbol, onModalOpened]);

  return (
    <ShareButton
      className={className}
      variant={variant}
      iconSize={iconSize}
      data-share-button={symbol.toLowerCase()}
      backgroundImage={ShareBackground}
      filename={`rujira-index-${symbol.toLowerCase()}-share.png`}
      contentOptions={contentOptions}
      currentContentIndex={currentIndex}
      onCycleContent={cycleContent}
      account={account}
      indexId={indexId}
      sharesValue={sharesValue}
    />
  );
};
