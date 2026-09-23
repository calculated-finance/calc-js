import clsx from "clsx";
import { DenomPair, DenomSelect, Icons, LabelAsset } from "rujira.ui";

export const ALL_PAIRS = "all";

export interface PairOption<T extends LabelAsset> {
  key: string;
  asset: DenomPair<T>;
}

export const PairSelect = <T extends LabelAsset>({
  options,
  pair,
  setPair,
  clearable = true,
  className,
}: {
  options: PairOption<T>[];
  pair: string;
  setPair: (p: string) => void;
  clearable?: boolean;
  className?: string;
}) => (
  <div className={clsx("flex ai-c gap-1", className)}>
    <DenomSelect
      selected={options.find((o) => o.key === pair)?.asset}
      options={options}
      onSelect={(opt) => {
        const match = options.find((o) => o.asset === opt);
        if (match) setPair(match.key);
      }}
      defaultText="All pairs"
    />
    {clearable && pair !== ALL_PAIRS && (
      <button
        className="transparent color-grey hover-white fs-12 fw-500 pointer nowrap"
        onClick={() => setPair(ALL_PAIRS)}>
        <Icons.Xmark className="w-2 h-2" />
      </button>
    )}
  </div>
);
