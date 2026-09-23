import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useRef,
} from "react";
import { useLocalStorage } from "rujira.ui";
import { OrderType } from "../../types";
import { useTradeUrlState } from "../../tradeUrlState";

export enum Tab {
  Limit = "limit",
  Recurring = "recurring",
  Automated = "automated",
}

const context = createContext<{
  only: boolean;
  setOnly: (v: boolean) => void;
  tab: Tab;
  selectTab: (v: Tab) => void;
  selectPreviousTab: () => void;
  previousTab: Tab | null;
}>({
  only: false,
  setOnly: () => {},
  tab: Tab.Limit,
  selectTab: () => {},
  selectPreviousTab: () => {},
  previousTab: null,
});

export const Context: FC<PropsWithChildren> = ({ children }) => {
  const [only, setOnly] = useLocalStorage("trade-only", false);
  const [tradeUrlState, setTradeUrlState] = useTradeUrlState();
  const tab =
    tradeUrlState.type === "automated"
      ? Tab.Automated
      : tradeUrlState.order === OrderType.Recurring
        ? Tab.Recurring
        : Tab.Limit;
  const previousTabRef = useRef<Tab | null>(null);

  const selectTab = (v: Tab) => {
    previousTabRef.current = tab;

    if (v === Tab.Automated) {
      setTradeUrlState({
        type: "automated",
        strategy: "ccl",
      });
    } else if (v === Tab.Recurring) {
      setTradeUrlState({ type: "manual", order: OrderType.Recurring });
    } else {
      setTradeUrlState({ type: "manual", order: OrderType.Limit });
    }
  };

  const selectPreviousTab = () => {
    selectTab(
      previousTabRef.current !== Tab.Automated
        ? (previousTabRef.current ?? Tab.Limit)
        : Tab.Limit
    );
  };

  return (
    <context.Provider
      value={{
        only,
        setOnly,
        tab,
        selectTab,
        selectPreviousTab,
        previousTab: previousTabRef.current,
      }}>
      {children}
    </context.Provider>
  );
};

export const useOrdersContext = () => useContext(context);
