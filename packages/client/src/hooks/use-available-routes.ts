import type { SwapRoute } from "@template/domain/src/calc";

  const isSecuredAsset = (denom: string) =>
    denom.toLowerCase() === "rune" || denom.includes("-");

export const useAvailableRoutes = (denoms: [string, string]) => {
  const routes: SwapRoute[] = [];

  if (denoms.every(isSecuredAsset)) {
    routes.push({
      thorchain: {
        affiliate_bps: null,
        affiliate_code: null,
        latest_swap: undefined,
        max_streaming_quantity: 100,
        streaming_interval: 3,
      },
    });
  }

  return routes;
};
