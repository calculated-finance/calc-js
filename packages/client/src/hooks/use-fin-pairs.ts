import { RUJIRA } from '@template/domain/chains'
import { FinPair, PAIRS_BY_CHAIN_ID } from '@template/domain/rujira'

const pairs = PAIRS_BY_CHAIN_ID[RUJIRA.id] ?? []

const pairsByDenom = pairs.reduce(
  (acc, pair) => ({
    ...acc,
    [pair.denoms[0]]: {
      ...acc[pair.denoms[0]],
      [pair.denoms[1]]: pair,
    },
    [pair.denoms[1]]: {
      ...acc[pair.denoms[1]],
      [pair.denoms[0]]: pair,
    },
  }),
  {} as Record<string, Record<string, FinPair>>,
)

export const useFinPairs = () => {
  return {
    pairs,
    pairsByDenom,
  }
}
