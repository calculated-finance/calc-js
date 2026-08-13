import clsx from "clsx";
import { FC, PropsWithChildren, useEffect, useRef, useState } from "react";
import { useTranslation } from "../../i18n";
import { AssetLabel, LabelAsset } from "../AssetLabel";
import { IconDenom } from "../icons/IconDenom";
import { AngleDown, Glass } from "../icons/Icons";

export type DenomPair<T extends LabelAsset> = { baseAsset: T; quoteAsset: T };

// A selectable entry: a single asset or a base/quote pair.
export type DenomOption<T extends LabelAsset> = T | DenomPair<T>;

const isPair = <T extends LabelAsset>(o: DenomOption<T>): o is DenomPair<T> =>
  "baseAsset" in o;

// Searchable text: "BTC/USDC" for pairs, "BTC" for single assets.
const optionLabel = (o: DenomOption<LabelAsset>): string =>
  isPair(o)
    ? `${o.baseAsset.metadata.symbol}/${o.quoteAsset.metadata.symbol}`
    : o.metadata.symbol;

// Symbols repeat across chains and types (e.g. secured vs native USDC), so
// list keys include all three.
const assetKey = (a: LabelAsset): string =>
  `${a.chain}.${a.type}.${a.metadata.symbol}`;

const optionKey = (o: DenomOption<LabelAsset>): string =>
  isPair(o)
    ? `${assetKey(o.baseAsset)}/${assetKey(o.quoteAsset)}`
    : assetKey(o);

const GreySmall: FC<PropsWithChildren> = ({ children }) => (
  <small className="color-grey">{children}</small>
);

const DenomDisplay: FC<{ option: DenomOption<LabelAsset> }> = ({ option }) =>
  isPair(option) ? (
    <div className="flex ai-c gap-1">
      <div className="lp">
        <IconDenom denom={option.baseAsset.metadata.symbol} />
        <IconDenom denom={option.quoteAsset.metadata.symbol} />
      </div>
      <div className="denom-select__symbol flex ai-b fw-500">
        <AssetLabel asset={option.baseAsset} Container={GreySmall} />
        <div className="color-grey ml-0.5">
          <AssetLabel asset={option.quoteAsset} Container={GreySmall} />
        </div>
      </div>
    </div>
  ) : (
    <>
      <IconDenom denom={option.metadata.symbol} />
      <div className="flex wrap dir-c ai-s denom-select__symbol fw-500">
        <span>{option.metadata.symbol}</span>
      </div>
    </>
  );

export const DenomSelect = <T extends LabelAsset>({
  selected,
  options,
  onSelect,
  searchValue = "",
  disabled,
  full,
  className,
  hideSelected = false,
  defaultText = "...",
}: {
  selected?: DenomOption<T>;
  options?: { asset: DenomOption<T> }[];
  onSelect?: (opt: DenomOption<T>) => void;
  searchValue?: string;
  disabled?: boolean;
  full?: boolean;
  className?: string;
  hideSelected?: boolean;
  defaultText?: string;
}) => {
  const { t } = useTranslation("common");
  const node = useRef<HTMLDivElement>(null);
  const srch = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(searchValue);

  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  useEffect(() => {
    const ref = srch.current;
    if (ref && open) {
      ref.focus();
    }
    if (!open) {
      setSearch("");
    }
  }, [open]);

  const handleClickOutside = (e: MouseEvent) => {
    const ref = node.current;
    if (ref && e.target instanceof Node && ref.contains(e.target)) {
      return;
    }
    e.stopPropagation();
    e.stopImmediatePropagation();

    setOpen(false);
    return false;
  };

  const filtered = (options ?? []).filter((o) =>
    optionLabel(o.asset).toLowerCase().includes(search.toLowerCase())
  );

  const selectedKey = selected && optionKey(selected);

  return (
    <div
      ref={node}
      className={clsx({
        "denom-select denom-select--no-input denom-select--compact condensed":
          true,
        "denom-select--open": open,
        "denom-select--full": full,
        "denom-select--disabled": disabled || options?.length === 0,
        "denom-select--noselected": hideSelected,
        [`${className}`]: className,
      })}>
      <div
        className="denom-select__selected"
        onClick={() => options && !disabled && setOpen(true)}>
        {open ? (
          <>
            <div className="denom-select__search-icon">
              <Glass />
            </div>
            <input
              ref={srch}
              className="denom-select__search"
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              autoComplete="off"
            />
          </>
        ) : selected ? (
          <DenomDisplay option={selected} />
        ) : (
          <div className="flex wrap">{defaultText}</div>
        )}
        {options && <AngleDown />}
      </div>

      {open && options && (
        <div className="denom-select__dropdown">
          {filtered.map((o) => (
            <a
              key={optionKey(o.asset)}
              className={clsx({
                "denom-select__item": true,
                "denom-select__item--selected":
                  optionKey(o.asset) === selectedKey,
              })}
              onClick={() => {
                setOpen(false);
                onSelect && onSelect(o.asset);
              }}>
              <DenomDisplay option={o.asset} />
            </a>
          ))}

          {filtered.length === 0 && <a>{t("noResults")}</a>}
        </div>
      )}
    </div>
  );
};
