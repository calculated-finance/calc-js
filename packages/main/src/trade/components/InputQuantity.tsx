import clsx from "clsx";
import { FC, FocusEvent, useState } from "react";
import type { Asset } from "rujira.js";
import { AssetLabel, Numeric, Slider, useTranslation } from "rujira.ui";
import {
  BalanceCompact,
  usePreloadedBalance,
} from "../../common/components/Balance";
import {} from "../../portfolio/utils";

const adjust = (v: bigint, r: number) =>
  (BigInt(Math.floor(r * 100)) * v) / 100n;

export type AmountSource = "keyboard" | "pointer";

export const InputQuantity: FC<{
  amount: bigint;
  setAmount: (v: bigint, inputSource: AmountSource) => void;
  highlightInvalid?: boolean;
  children?: React.ReactNode;
  asset?: Asset;
  className?: string;
  containerClassName?: string;
  onFocus?: (event?: FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event?: FocusEvent<HTMLInputElement>) => void;
  fiat?: { price?: bigint | null; symbol: string };
  onSliderChange?: (v: bigint) => void;
}> = ({
  amount,
  setAmount,
  highlightInvalid,
  children,
  asset,
  className,
  containerClassName,
  onFocus,
  onBlur,
  fiat,
  onSliderChange,
}) => {
  const { t } = useTranslation();
  const { balance, additionalBalance } = usePreloadedBalance();
  const max = (balance?.balance || 0n) + (additionalBalance || 0n);
  const invalid = amount > 0n && amount > max;

  return (
    <div className={clsx("flex dir-c gap-y-1 grow", containerClassName)}>
      <BalanceCompact
        className={className}
        onClick={(x) => {
          onFocus?.();
          setAmount(x.balance, "pointer");
        }}
      />
      <Numeric
        amount={amount}
        initialZeroAsPlaceholder
        fiat={fiat}
        onChangeAmount={(amount) => {
          setAmount(amount, "keyboard");
        }}
        onFocus={onFocus}
        onBlur={onBlur}
        className={clsx("numeric-input--white", {
          "numeric-input--error": highlightInvalid && invalid,
        })}>
        {children || (
          <label>
            {t("amount")}
            {asset ? (
              <>
                {" "}
                <small>
                  (
                  <AssetLabel
                    asset={asset}
                    Container={({ children }) => <>{children}</>}
                  />
                  )
                </small>
              </>
            ) : null}
          </label>
        )}
      </Numeric>
      <div className="flex ai-c">
        <a
          className="fs-12 condensed fw-500 color-grey hover-white mr-0.5 pointer"
          onClick={() => {
            onFocus?.();
            setAmount(0n, "pointer");
          }}>
          0%
        </a>

        <ChunkSlider
          amount={amount}
          setAmount={(v) => {
            onFocus?.();
            setAmount(v, "pointer");
          }}
          max={max}
          onChangeAmount={onSliderChange}
        />
        <a
          className="fs-12 condensed fw-500 color-grey hover-white ml-0.5 pointer"
          onClick={() => {
            onFocus?.();
            setAmount(max, "pointer");
          }}>
          100%
        </a>
      </div>
    </div>
  );
};

export const ChunkSlider: FC<{
  amount: bigint;
  setAmount: (v: bigint) => void;
  max: bigint;
  onChangeAmount?: (v: bigint) => void;
}> = ({ amount, setAmount, max, onChangeAmount }) => {
  const slider = max ? (amount * 100n) / max : 0n;
  const sliderValue = Number(slider);
  const [dragValue, setDragValue] = useState<number | null>(null);
  const completed = dragValue ?? sliderValue;

  return (
    <Slider
      min={0}
      max={100}
      step={5}
      value={sliderValue}
      onAfterChange={(v) => {
        setDragValue(null);
        setAmount(adjust(max, v / 100));
      }}
      onChange={(v) => {
        setDragValue(v);
        onChangeAmount?.(adjust(max, v / 100));
      }}
      marks={max ? [0, 25, 50, 75, 100] : false}
      renderMark={(props) => {
        const { className, key, ...rest } = props;
        return (
          <span
            key={key}
            className={clsx({
              slider__mark: true,
              [`slider__mark--${props.key}`]: true,
              "slider__mark--completed":
                Number(key) <= completed && Number(max) >= Number(key),
            })}
            {...rest}
          />
        );
      }}
    />
  );
};

/* Convert decimal bigint to strin decimal value without float arithmetic */
export const toDecimal = (v: BigInt, decimals = 12): string => {
  const s = v.toString();
  const len = s.length;

  if (len <= decimals) {
    const padded = s.padStart(decimals, "0");
    return `0.${padded}`;
  }

  const intPart = s.slice(0, len - decimals);
  const fracPart = s.slice(len - decimals).replace(/0+$/, ""); // trim trailing zeroes
  return fracPart.length ? `${intPart}.${fracPart}` : intPart;
};
