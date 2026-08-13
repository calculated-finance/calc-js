import { QRCodeSVG } from "qrcode.react";
import { FC } from "react";
import { Decimal, getDenomIconSrc, Slider, useTranslation } from "rujira.ui";
import rujiraLogo from "rujira.ui/assets/images/rujira.png";
import { formatBigintPercent } from "../common/bigint";
import { buildShareMessage, ShareCardButton } from "./ShareCardDialog";
import curve from "./assets/ccl-curve.png";
import clsx from "clsx";

// Matches the .share-card block's 60rem x 30rem design size.
const ASPECT_RATIO = 2;

export type RangePositionCardProps = {
  copyUrl: string;
  baseLabel: string;
  quoteLabel: string;
  low: bigint;
  high: bigint;
  current: bigint;
  spread: bigint;
  fee: bigint;
  apr?: bigint | null;
  ageDays?: number | null;
};

export type RangePositionShareButtonProps = RangePositionCardProps & {
  shareMsg: string;
};

const NOT_AVAILABLE = "—";

const formatApr = (v?: bigint | null) => {
  if (v === null || v === undefined) return NOT_AVAILABLE;
  return `${v > 0n ? "+" : ""}${formatBigintPercent(v)}`;
};

const formatAge = (days?: number | null) => {
  if (days === null || days === undefined) return NOT_AVAILABLE;
  return `${days.toLocaleString()}d`;
};

const rewardPct = (fee: bigint, spread: bigint) => {
  if (fee === 0n || spread === 0n) return 0;
  return Math.round(Number((fee * 10000n) / spread) / 100);
};

const pricePosition = (low: bigint, high: bigint, current: bigint) => {
  const span = high - low;
  if (span <= 0n) return 50;
  const from = low - span / 2n;
  const to = high + span / 2n;
  const pct = Number(((current - from) * 1000n) / (to - from)) / 10;
  return Math.max(0, Math.min(100, pct));
};

const Stat: FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="share-card__stat">
    <div className="fs-24 lh-16 color-grey fw-500">{label}</div>
    <div className="fs-28 lh-24 condensed fw-500 nowrap mt-1.5">{value}</div>
  </div>
);

export const RangePositionCard: FC<RangePositionCardProps> = ({
  copyUrl,
  baseLabel,
  quoteLabel,
  low,
  high,
  current,
  spread,
  fee,
  apr,
  ageDays,
}) => {
  const { t } = useTranslation("common");
  const reward = rewardPct(fee, spread);
  const position = pricePosition(low, high, current);

  return (
    <div className="share-card">
      <div className="share-card__main flex dir-c">
        <div className="flex ai-c">
          <img src={rujiraLogo} className="share-card__logo" />
          <span className="tag tag--lg tag--purple ml-2">
            {t("shareCclPositionTag")}
          </span>
        </div>

        <img src={curve} className="share-card__curve" />

        <div className="share-card__hero my-a mt-10">
          <div className="fs-25 fw-500 lh-20 color-grey">
            {t("shareYieldApr")}
          </div>
          <div
            className={clsx("share-card__apr lh-76 fw-500 color-teal", {
              "fs-40": fee === 0n,
              "fs-90 mt-2": fee > 0n,
            })}>
            {fee === 0n ? t("compounding") : formatApr(apr)}
          </div>
        </div>

        <div className="share-card__stats flex pt-2">
          <Stat label={t("shareSpread")} value={formatBigintPercent(spread)} />
          <Stat label={t("shareAge")} value={formatAge(ageDays)} />
          <div className="share-card__stat share-card__stat--wide">
            <div className="flex ai-b">
              <span className="fs-24 fw-500 lh-16 color-grey">
                {t("shareRewardStrategy")}
              </span>
            </div>
            <div className="flex ai-c mt-2 fs-19 fw-500 lh-16">
              <span className="nowrap">{t("shareCompounding")}</span>
              <Slider min={0} max={100} value={reward} disabled />
              <span className="nowrap">{t("shareYielding")}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="share-card__side flex dir-c ml-3 pl-3">
        <div className="fs-17 fw-500 lh-16 color-grey">
          {t("shareAssetPair")}
        </div>
        <div className="flex ai-c mt-1">
          <img
            src={getDenomIconSrc(baseLabel)}
            className="icon-denom w-3 h-3"
          />
          <img
            src={getDenomIconSrc(quoteLabel)}
            className="icon-denom w-3 h-3 share-card__asset-overlap"
          />
          <span className="fs-18 lh-22 ml-1 nowrap">
            {baseLabel} / {quoteLabel}
          </span>
        </div>

        <div className="fs-17 fw-500 lh-16 color-grey mt-3">
          {t("sharePriceRange")}
        </div>
        <div className="share-card__range lh-44">
          <Decimal
            amount={low}
            decimals={12}
            clip
            className="fs-36 condensed fw-500 color-purple"
          />
          <p className="share-card__range-label fs-28 color-grey nowrap">
            {quoteLabel}
          </p>
          <Decimal
            amount={high}
            decimals={12}
            clip
            className="fs-36 condensed fw-500 color-purple"
          />
          <p className="share-card__range-label fs-28 color-grey nowrap">
            {quoteLabel}
          </p>
        </div>

        <div className="share-card__bar mt-3">
          <span className="share-card__bar-range" />
          {current > 0n && (
            <span
              className="share-card__bar-tick"
              style={{ left: `${position}%` }}
            />
          )}
        </div>

        <div className="fs-16 lh-18 fw-600 color-purple text-center mt-a mb-0.5">
          {t("shareCallToAction")}
        </div>
        <div className="share-card__qr mx-a mt-1.5">
          <QRCodeSVG value={copyUrl} size={128} level="M" />
        </div>
        <div className="fs-15 lh-16 text-center mt-1.5">{"rujira.network"}</div>
      </div>
    </div>
  );
};

export const RangePositionShareButton: FC<RangePositionShareButtonProps> = ({
  shareMsg,
  ...card
}) => {
  const { t } = useTranslation("common");

  return (
    <ShareCardButton
      className="ml-0.5"
      tooltip={t("share")}
      modalTitle={t("shareCclPositionTitle")}
      shareTitle={t("shareCclCardTitle", {
        base: card.baseLabel,
        quote: card.quoteLabel,
      })}
      shareText={buildShareMessage({
        headline: shareMsg,
        prompt: t("shareCclCopyPrompt"),
        url: card.copyUrl,
        tagline: t("shareTagline"),
      })}
      shareUrl={card.copyUrl}
      aspectRatio={ASPECT_RATIO}>
      <RangePositionCard {...card} />
    </ShareCardButton>
  );
};
