import React from "react";
import { RuntimeContext } from "../components/providers/runtime-provider";

export const useRuntime = () => {
  const runtime = React.useContext(RuntimeContext);

  if (!runtime) throw new Error("useRuntime must be used within a RuntimeProvider");

  return runtime;
};
