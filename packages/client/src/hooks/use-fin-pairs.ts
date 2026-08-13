import { RUJIRA } from '@template/domain/chains'
import { FinPair, PAIRS_BY_CHAIN_ID } from '@template/domain/rujira'

const pairs = PAIRS_BY_CHAIN_ID[RUJIRA.id] ?? []

const pairsByDenom = pairs.reduce<Partial<Record<string, Partial<Record<string, FinPair>>>>>(
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
  {},
)

export const useFinPairs = () => {
  return {
    pairs,
    pairsByDenom,
  }
}
