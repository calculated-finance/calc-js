import {
  STAGENET_FIN_PAIRS,
  STAGENET_FIN_PAIRS_BY_DENOM,
} from '@template/domain/src/rujira'

export const useFinPairs = () => {
  return {
    pairs: STAGENET_FIN_PAIRS,
    pairsByDenom: STAGENET_FIN_PAIRS_BY_DENOM,
  }
}
