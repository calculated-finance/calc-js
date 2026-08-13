import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import { Asset } from "rujira.js";
import { msgAssetFragment$key } from "./__generated__/msgAssetFragment.graphql";

const msgAssetFragment = graphql`
  fragment msgAssetFragment on Asset {
    type
    chain
    asset
    metadata {
      decimals
      symbol
    }
    variants {
      native {
        denom
      }
      secured {
        type
        chain
        asset
        metadata {
          decimals
          symbol
        }
        variants {
          native {
            denom
          }
        }
      }
    }
  }
`;

export function useMsgAssetFragment(k: msgAssetFragment$key): Asset;
export function useMsgAssetFragment(
  k: msgAssetFragment$key | undefined | null
): Asset | undefined | null;
export function useMsgAssetFragment(
  k: msgAssetFragment$key | undefined | null
): Asset | undefined | null {
  return useFragment(msgAssetFragment, k);
}
