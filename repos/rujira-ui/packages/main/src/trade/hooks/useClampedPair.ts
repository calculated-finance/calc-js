import { useCallback, useState } from "react";
import type { Asset } from "rujira.js";
import {
  useOmniFunding,
  usePreloadedAssetBalance,
} from "../../common/components/Balance";
import type { AmountSource } from "../components/InputQuantity";

export type Side = "base" | "quote";

type ClampedPair = {
  authority: Side;
  base: bigint;
  quote: bigint;
};

export type UseClampedPairOptions = {
  assetBase: Asset;
  assetQuote: Asset;
  hasBase: boolean;
  hasQuote: boolean;
  ratioBase: bigint;
  ratioQuote: bigint;
};

export const useClampedPair = ({
  assetBase,
  assetQuote,
  hasBase,
  hasQuote,
  ratioBase,
  ratioQuote,
}: UseClampedPairOptions) => {
  const [base, setBase] = useState(0n);
  const [quote, setQuote] = useState(0n);
  const [authority, setAuthority] = useState<Side>("base");
  const [enteredSide, setEnteredSide] = useState<Side>("base");

  const baseMax = usePreloadedAssetBalance(assetBase).balance?.balance ?? 0n;
  const quoteMax = usePreloadedAssetBalance(assetQuote).balance?.balance ?? 0n;

  const { spendable: baseSpendable } = useOmniFunding(assetBase);
  const { spendable: quoteSpendable } = useOmniFunding(assetQuote);

  const quoteFromBase = useCallback(
    (amount: bigint) => (ratioBase ? (amount * ratioQuote) / ratioBase : 0n),
    [ratioBase, ratioQuote]
  );

  const baseFromQuote = useCallback(
    (amount: bigint) => (ratioQuote ? (amount * ratioBase) / ratioQuote : 0n),
    [ratioBase, ratioQuote]
  );

  const baseAmount = authority === "base" ? base : baseFromQuote(quote);
  const quoteAmount = authority === "quote" ? quote : quoteFromBase(base);

  const baseOver = hasBase && baseAmount > baseMax;
  const quoteOver = hasQuote && quoteAmount > quoteMax;
  const insufficient = baseOver || quoteOver;

  const clampFromBase = useCallback(
    (v: bigint, maxBase: bigint, maxQuote: bigint): ClampedPair => {
      const b = hasBase && v > maxBase ? maxBase : v;
      if (hasQuote && quoteFromBase(b) > maxQuote)
        return {
          authority: "quote",
          base: baseFromQuote(maxQuote),
          quote: maxQuote,
        };
      return { authority: "base", base: b, quote: quoteFromBase(b) };
    },
    [hasBase, hasQuote, quoteFromBase, baseFromQuote]
  );

  const clampFromQuote = useCallback(
    (v: bigint, maxBase: bigint, maxQuote: bigint): ClampedPair => {
      const q = hasQuote && v > maxQuote ? maxQuote : v;
      if (hasBase && baseFromQuote(q) > maxBase)
        return {
          authority: "base",
          base: maxBase,
          quote: quoteFromBase(maxBase),
        };
      return { authority: "quote", base: baseFromQuote(q), quote: q };
    },
    [hasBase, hasQuote, quoteFromBase, baseFromQuote]
  );

  const apply = useCallback((p: ClampedPair) => {
    setAuthority(p.authority);
    setBase(p.base);
    setQuote(p.quote);
  }, []);

  const setBaseAmount = useCallback(
    (v: bigint, source: AmountSource) => {
      setEnteredSide("base");
      if (source === "keyboard") {
        setAuthority("base");
        setBase(v);
        return;
      }
      apply(clampFromBase(v, baseMax, quoteMax));
    },
    [apply, clampFromBase, baseMax, quoteMax]
  );

  const setQuoteAmount = useCallback(
    (v: bigint, source: AmountSource) => {
      setEnteredSide("quote");
      if (source === "keyboard") {
        setAuthority("quote");
        setQuote(v);
        return;
      }
      apply(clampFromQuote(v, baseMax, quoteMax));
    },
    [apply, clampFromQuote, baseMax, quoteMax]
  );

  // Pin the currently-derived value into state before taking authority,
  // otherwise the field falls back to stale state and appears to blank.
  const onBaseFocus = useCallback(() => {
    setBase(baseAmount);
    setAuthority("base");
  }, [baseAmount]);

  const onQuoteFocus = useCallback(() => {
    setQuote(quoteAmount);
    setAuthority("quote");
  }, [quoteAmount]);

  const setMaxAvailable = useCallback(() => {
    apply(
      authority === "base"
        ? clampFromBase(baseAmount, baseSpendable, quoteSpendable)
        : clampFromQuote(quoteAmount, baseSpendable, quoteSpendable)
    );
  }, [
    apply,
    authority,
    baseAmount,
    quoteAmount,
    baseSpendable,
    quoteSpendable,
    clampFromBase,
    clampFromQuote,
  ]);

  return {
    baseAmount,
    quoteAmount,
    setBaseAmount,
    setQuoteAmount,
    onBaseFocus,
    onQuoteFocus,
    baseOver,
    quoteOver,
    insufficient,
    /** Which side the user last drove — picks the wording of the warning. */
    enteredSide,
    setMaxAvailable,
  };
};
