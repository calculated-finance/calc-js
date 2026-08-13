import clsx from "clsx";
import { useEffect, useMemo, useRef, useState } from "react";
import { Network, networkLabel } from "rujira.js";
import { compareValueUsdDesc, uuidv4 } from "../../helpers";
import { useTranslation } from "../../i18n";
import { AssetLabel } from "../AssetLabel";
import { Button } from "../buttons/Button";
import { IconDenom } from "../icons/IconDenom";
import { AngleDown, Glass } from "../icons/Icons";
import { NetworkIcon } from "../icons/NetworkIcon";
import { Decimal } from "../numbers/Decimal";
import { Fiat } from "../numbers/Fiat";
import { DecimalInput } from "./DecimalInput";

export interface SwapSelectOption {
  asset: string;
  type: string;
  chain: Network;
  metadata: {
    symbol: string;
    decimals: number;
  };
}

export type SwapSelectEntry<T extends SwapSelectOption> = {
  asset: T;
  balance?: bigint;
  valueUsd?: bigint;
};

export const SwapSelect = <T extends SwapSelectOption>({
  selected,
  options,
  onSelect,
  searchValue = "",
  amount,
  onChangeAmount,
  disabled,
  full,
  max,
  label,
  className,
  value,
  hideSelected = false,
  sortOptions,
}: {
  selected?: T;
  options?: SwapSelectEntry<T>[];
  onSelect?: (opt: T) => void;
  searchValue?: string;
  amount: bigint;
  onChangeAmount?: (a: bigint) => void;
  disabled?: boolean;
  full?: boolean;
  max?: bigint;
  label?: string;
  className?: string;
  value?: bigint;
  hideSelected?: boolean;
  sortOptions?: (a: SwapSelectEntry<T>, b: SwapSelectEntry<T>) => number;
}) => {
  const { t } = useTranslation("common");
  const readonly = !onChangeAmount;
  const node = useRef<HTMLDivElement>(null);
  const srch = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(searchValue);

  const sortedOptions = useMemo(() => {
    if (!options) return options;
    return [...options].sort(sortOptions || compareValueUsdDesc);
  }, [options, sortOptions]);

  const id = useMemo(() => uuidv4(), []);

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

  const handleClickOutside = (e: any) => {
    const ref = node.current;
    if (ref) {
      if (ref.contains(e.target)) {
        return;
      }
    }
    e.stopPropagation();
    e.stopImmediatePropagation();

    setOpen(false);
    return false;
  };

  return (
    <div
      ref={node}
      className={clsx({
        "swap-select condensed": true,
        "swap-select--open": open,
        "swap-select--full": full,
        "swap-select--disabled": disabled || sortedOptions?.length === 0,
        "swap-select--haslabel": label,
        "swap-select--noselected": hideSelected,
        [`${className}`]: className,
      })}>
      {label && (
        <label className="fs-16 fw-500 color-white" htmlFor={id}>
          {/* eslint-disable-next-line i18next-no-undefined-translation-keys/translation-key-string-literal */}
          {t(label)}
        </label>
      )}
      {max !== undefined && (
        <Button
          className="button--xsmall button--icon-right swap-select__max"
          label={t("max")}
          onClick={() => onChangeAmount && onChangeAmount(max)}>
          <Decimal amount={max} className="fw-700" />
        </Button>
      )}
      {!hideSelected && (
        <div
          className="swap-select__selected"
          onClick={() => sortedOptions && !disabled && setOpen(true)}>
          {open ? (
            <>
              <div className="swap-select__search-icon">
                <Glass />
              </div>
              <input
                ref={srch}
                className="swap-select__search"
                value={search}
                onChange={(e) => setSearch(e.currentTarget.value)}
                autoComplete="off"
              />
            </>
          ) : selected ? (
            <>
              <IconDenom denom={selected.metadata.symbol} />
              <div className="flex wrap dir-c ai-s swap-select__symbol">
                <span>{selected.metadata.symbol}</span>
              </div>
            </>
          ) : (
            <div className="flex wrap swap-select__symbol">
              <span className="mr-1">...</span>
            </div>
          )}
          {sortedOptions && <AngleDown />}
        </div>
      )}
      <div className="swap-select__value">
        <DecimalInput
          getInputRef={node}
          disabled={readonly || disabled}
          amount={amount}
          initialZeroAsPlaceholder
          onAmountchange={(e) => onChangeAmount && onChangeAmount(e)}
          id={id}
          className={clsx({
            "w-full swap-select__input": true,
            "has-value": value !== undefined,
          })}
          autoComplete="off"
        />
        {value !== undefined && (
          <Fiat
            amount={value}
            symbol="$"
            padSymbol={false}
            decimals={8}
            className="color-grey fs-14 ml-a"
          />
        )}
      </div>
      {open && sortedOptions && (
        <div className="swap-select__dropdown">
          {sortedOptions
            .filter((v) =>
              v.asset.metadata.symbol
                .toLowerCase()
                .includes(search.toLowerCase())
            )
            .map((a) => (
              <a
                key={a.asset.asset}
                onClick={() => {
                  setOpen(false);
                  onSelect && onSelect(a.asset);
                }}>
                <IconDenom denom={a.asset.metadata.symbol} />
                <span className="color-grey">{a.asset.metadata.symbol}</span>
                {a.balance === undefined ? null : (
                  <div className="swap-select__balance fs-14 text-right">
                    <Decimal
                      subscript
                      amount={a.balance}
                      decimals={a.asset.metadata.decimals}
                      className="color-white"
                    />
                    {a.valueUsd !== undefined && a.valueUsd > 0n && (
                      <>
                        <br />
                        <Fiat
                          amount={a.valueUsd}
                          symbol="$"
                          padSymbol={false}
                          decimals={8}
                          className="fs-12 color-grey"
                        />
                      </>
                    )}
                  </div>
                )}
              </a>
            ))}

          {sortedOptions.filter((v) =>
            v.asset.metadata.symbol.toLowerCase().includes(search.toLowerCase())
          ).length === 0 && <a>{t("noResults")}</a>}
        </div>
      )}
    </div>
  );
};

export const TokenSelect = ({
  selected,
  className,
  onClick,
  network,
  address,
}: {
  selected?: SwapSelectOption;
  className?: string;
  onClick?: () => void;
  network?: Network;
  address?: string;
}) => {
  return (
    <div
      className={clsx({
        "token-select condensed": true,
        [`${className}`]: className,
      })}
      onClick={onClick}>
      <div className="token-select__selected">
        {selected ? (
          <>
            <IconDenom denom={selected.metadata.symbol} />
            <div className="token-select__symbol">
              <AssetLabel
                asset={selected}
                Container={({ children }) => (
                  <span className="color-grey fs-14 fs-lg-16">{children}</span>
                )}
              />
            </div>
            {network && address && (
              <>
                <NetworkIcon network={network} className="icon-denom ml-1" />
                <div className="flex wrap dir-c ai-s token-select__symbol">
                  <span>{networkLabel(network)}</span>
                  <span className="fs-14 color-grey">
                    {address.substring(0, 6) + "…" + address.slice(-6)}
                  </span>
                </div>
              </>
            )}
          </>
        ) : (
          <div className="token-select__symbol">...</div>
        )}
        <AngleDown className="token-select__arrow" />
      </div>
    </div>
  );
};
