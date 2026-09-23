import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from "react";
import { OrderType } from "../types";
import { useTradeUrlState } from "../tradeUrlState";

type TradeContextValue = {
  price: bigint;
  setPrice: (v: bigint) => void;
  premium: bigint;
  setPremium: (v: bigint) => void;
  amount: bigint;
  setAmount: (v: bigint) => void;
  address?: string;
  base?: string;
  quote?: string;
  cclHigh?: bigint;
  cclLow?: bigint;
  orderType: OrderType;
  setOrderType: (v: OrderType) => void;
};

const defaultContext: TradeContextValue = {
  price: 0n,
  setPrice: () => {},
  premium: 0n,
  setPremium: () => {},
  amount: 0n,
  setAmount: () => {},
  address: undefined,
  base: undefined,
  quote: undefined,
  orderType: OrderType.Market,
  setOrderType: () => {},
};

const context = createContext(defaultContext);

export const TradeContext: FC<
  PropsWithChildren<{
    address?: string;
    base?: string;
    quote?: string;
  }>
> = ({ children, address, base, quote }) => {
  const [price, setPrice] = useState(0n);
  const [premium, setPremium] = useState(0n);
  const [amount, setAmount] = useState(0n);
  const [tradeUrlState, setTradeUrlState] = useTradeUrlState();
  const orderType =
    tradeUrlState.type === "manual" ? tradeUrlState.order : OrderType.Market;
  const setOrderType = useCallback(
    (order: OrderType) => setTradeUrlState({ type: "manual", order }),
    [setTradeUrlState]
  );

  return (
    <context.Provider
      value={{
        price,
        setPrice,
        premium,
        setPremium,
        amount,
        setAmount,
        address,
        base,
        quote,
        orderType,
        setOrderType,
      }}>
      {children}
    </context.Provider>
  );
};

export const usePrice = (): [bigint, (v: bigint) => void] => {
  const { price, setPrice } = useContext(context);
  return [price, setPrice];
};

export const usePremium = (): [bigint, (v: bigint) => void] => {
  const { premium, setPremium } = useContext(context);
  return [premium, setPremium];
};

export const useAmount = (): [bigint, (v: bigint) => void] => {
  const { amount, setAmount } = useContext(context);
  return [amount, setAmount];
};

export const useOrderType = (): [OrderType, (v: OrderType) => void] => {
  const { orderType, setOrderType } = useContext(context);
  return [orderType, setOrderType];
};

export const useTradeContext = (): {
  base?: string;
  quote?: string;
  address?: string;
} => {
  const { base, quote, address } = useContext(context);
  return { base, quote, address };
};
