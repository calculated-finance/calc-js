import {
  createContext,
  Dispatch,
  FC,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { BalanceAccount } from "rujira.js";
import { Destination } from "../../common/components/Destination";
import {
  assetToNetworkParam,
  assetToTradeUrlSegment,
} from "../../services/assetUrl";
import { Quote, useQuote } from "../../services/useQuote";

const ERROR = () => {
  throw new Error("No SwapContext");
};

const context = createContext<{
  slippageLimit: bigint;
  setSlippageLimit: Dispatch<SetStateAction<bigint>>;
  /** Selected from Asset */
  from?: string;
  setFrom: (asset: string) => void;
  /** Selected to Asset */
  to?: string;
  setTo: (asset: string) => void;
  /** The amount of asset that needs to be deposited to inboundAddress, 8dp */
  amount: bigint;
  setAmount: Dispatch<SetStateAction<bigint>>;
  feeWarning: bigint;
  source?: BalanceAccount;
  setSource: (v?: BalanceAccount) => void;
  destination?: Destination;
  setDestination: (d?: Destination) => void;
  quote?: Quote;
}>({
  slippageLimit: 100n,
  setSlippageLimit: ERROR,
  amount: 0n,
  setAmount: ERROR,
  setFrom: ERROR,
  setTo: ERROR,
  feeWarning: 500n,
  setDestination: ERROR,
  setSource: ERROR,
});

export const Context: FC<PropsWithChildren> = ({ children }) => {
  const [slippageLimit, setSlippageLimit] = useState(100n);
  const { from, to } = useParams<{ from: string; to: string }>();
  const [searchParams] = useSearchParams();
  const nav = useNavigate();
  const [amount, setAmount] = useState(0n);
  const [source, setSource] = useState<BalanceAccount>();
  const [destination, setDestination] = useState<Destination>();

  const req = useMemo(() => {
    if (!source) return null;
    if (!destination) return null;
    if (!amount) return null;

    return {
      from: source.asset.asset,
      to: destination.asset.asset,
      amount,
      destination: destination.address,
      liquidityToleranceBps: slippageLimit,
    };
  }, [source, amount, slippageLimit, destination]);
  const quote = useQuote(req, true);

  useEffect(() => {
    if (!source || !destination) return;
    const fromSegment = assetToTradeUrlSegment(source.asset);
    const toSegment = assetToTradeUrlSegment(destination.asset);
    const fromChainValue = assetToNetworkParam(source.asset);
    const toChainValue = assetToNetworkParam(destination.asset);
    const currentFromChain = searchParams.get("fromChain") ?? undefined;
    const currentToChain = searchParams.get("toChain") ?? undefined;
    if (
      fromSegment !== from ||
      toSegment !== to ||
      fromChainValue !== currentFromChain ||
      toChainValue !== currentToChain
    ) {
      const qs = new URLSearchParams();
      if (fromChainValue) qs.set("fromChain", fromChainValue);
      if (toChainValue) qs.set("toChain", toChainValue);
      const search = qs.toString();
      nav(`../../${fromSegment}/${toSegment}${search ? `?${search}` : ""}`, {
        relative: "path",
        replace: true,
      });
    }
  }, [source, destination, from, to, searchParams, nav]);

  return (
    <context.Provider
      value={{
        slippageLimit,
        setSlippageLimit,
        from,
        to,
        amount,
        setAmount,
        setFrom: (a: string) =>
          to && nav(`../../${a}/${to}`, { relative: "path" }),
        setTo: (a: string) =>
          from && nav(`../../${from}/${a}`, { relative: "path" }),
        feeWarning: 500n,
        destination,
        setDestination,
        source,
        setSource,
        quote,
      }}>
      {children}
    </context.Provider>
  );
};

export const useSwapContext = () => useContext(context);
