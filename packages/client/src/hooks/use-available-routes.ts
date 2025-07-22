import type { SwapRoute } from '@template/domain/src/calc'
import { useFinPairs } from './use-fin-pairs'

const isSecuredAsset = (denom: string) =>
  denom.toLowerCase() === 'rune' || denom.includes('-')

export const useAvailableRoutes = (denoms: [string, string]) => {
  const routes: SwapRoute[] = []

  const { pairsByDenom } = useFinPairs()

  const finRoute = pairsByDenom[denoms[0]]?.[denoms[1]]

  if (finRoute) {
    routes.push({
      fin: {
        pair_address: finRoute.address,
      },
    })
  }

  if (denoms.every(isSecuredAsset)) {
    routes.push({
      thorchain: {
        affiliate_bps: null,
        affiliate_code: null,
        latest_swap: undefined,
        max_streaming_quantity: 100,
        streaming_interval: 3,
      },
    })
  }

  return routes
}
