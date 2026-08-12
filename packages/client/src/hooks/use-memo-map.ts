import React from "react";
import { MemoMapProviderContext } from "../components/providers/memo-map-provider";

export const useMemoMap = () => {
  const context = React.useContext(MemoMapProviderContext);

  if (context === undefined)
    throw new Error("useMemoMap must be used within a MemoMapProvider");

  return context;
};
