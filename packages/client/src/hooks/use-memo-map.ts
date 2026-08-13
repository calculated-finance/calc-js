import React from "react";
import { MemoMapProviderContext } from "../components/providers/memo-map-provider";

export const useMemoMap = () => {
  const context = React.useContext(MemoMapProviderContext);

  return context;
};
