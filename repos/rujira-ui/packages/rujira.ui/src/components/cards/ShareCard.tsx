import React from "react";
import clsx from "clsx";

type Props = {
  className?: string;
  backgroundImage?: string;
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
  badgeComponent?: React.ReactNode;
};

export const ShareCard: React.FC<Props> = ({
  className,
  backgroundImage,
  leftComponent,
  rightComponent,
  badgeComponent,
}) => {
  return (
    <div
      className={clsx({
        "share-card": true,
        [`${className}`]: className,
      })}
      style={{
        backgroundImage: backgroundImage
          ? `url(${backgroundImage})`
          : undefined,
      }}>
      {badgeComponent && (
        <div className="share-card__badge">{badgeComponent}</div>
      )}
      <div className="share-card__content">
        <div className="share-card__left">{leftComponent}</div>
        <div className="share-card__right">{rightComponent}</div>
      </div>
    </div>
  );
};
