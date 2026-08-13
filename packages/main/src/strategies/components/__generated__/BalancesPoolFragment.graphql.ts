/**
 * @generated SignedSource<<838bde9a16086dc325ea0d3d8b2aabfa>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type BalancesPoolFragment$data = {
  readonly bow: ReadonlyArray<{
    readonly id: string;
    readonly " $fragmentSpreads": FragmentRefs<"BalanceThumbDualFragment">;
  }>;
  readonly strategies: ReadonlyArray<{
    readonly __typename: "BowAccount";
    readonly id: string;
    readonly " $fragmentSpreads": FragmentRefs<"BowPoolXykThumbFragment">;
  } | {
    readonly __typename: "GhostVaultAccount";
    readonly id: string;
    readonly " $fragmentSpreads": FragmentRefs<"GhostVaultThumbFragment">;
  } | {
    readonly __typename: "IndexAccount";
    readonly id: string;
    readonly " $fragmentSpreads": FragmentRefs<"IndexVaultPortfolioRowFragment" | "IndexVaultThumbFragment">;
  } | {
    readonly __typename: "StakingAccount";
    readonly id: string;
    readonly " $fragmentSpreads": FragmentRefs<"StakingPoolPortfolioRowFragment" | "StakingPoolThumbFragment">;
  } | {
    readonly __typename: "ThorchainLiquidityProvider";
    readonly id: string;
    readonly " $fragmentSpreads": FragmentRefs<"ThorchainPoolThumbFragment">;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  }>;
  readonly " $fragmentType": "BalancesPoolFragment";
};
export type BalancesPoolFragment$key = {
  readonly " $data"?: BalancesPoolFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"BalancesPoolFragment">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "BalancesPoolFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "BowAccount",
      "kind": "LinkedField",
      "name": "bow",
      "plural": true,
      "selections": [
        (v0/*: any*/),
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "BalanceThumbDualFragment"
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": null,
      "kind": "LinkedField",
      "name": "strategies",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "__typename",
          "storageKey": null
        },
        {
          "kind": "InlineFragment",
          "selections": [
            (v0/*: any*/),
            {
              "args": null,
              "kind": "FragmentSpread",
              "name": "ThorchainPoolThumbFragment"
            }
          ],
          "type": "ThorchainLiquidityProvider",
          "abstractKey": null
        },
        {
          "kind": "InlineFragment",
          "selections": [
            (v0/*: any*/),
            {
              "args": null,
              "kind": "FragmentSpread",
              "name": "BowPoolXykThumbFragment"
            }
          ],
          "type": "BowAccount",
          "abstractKey": null
        },
        {
          "kind": "InlineFragment",
          "selections": [
            (v0/*: any*/),
            {
              "args": null,
              "kind": "FragmentSpread",
              "name": "IndexVaultThumbFragment"
            },
            {
              "args": null,
              "kind": "FragmentSpread",
              "name": "IndexVaultPortfolioRowFragment"
            }
          ],
          "type": "IndexAccount",
          "abstractKey": null
        },
        {
          "kind": "InlineFragment",
          "selections": [
            (v0/*: any*/),
            {
              "args": null,
              "kind": "FragmentSpread",
              "name": "StakingPoolThumbFragment"
            },
            {
              "args": null,
              "kind": "FragmentSpread",
              "name": "StakingPoolPortfolioRowFragment"
            }
          ],
          "type": "StakingAccount",
          "abstractKey": null
        },
        {
          "kind": "InlineFragment",
          "selections": [
            (v0/*: any*/),
            {
              "args": null,
              "kind": "FragmentSpread",
              "name": "GhostVaultThumbFragment"
            }
          ],
          "type": "GhostVaultAccount",
          "abstractKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Account",
  "abstractKey": null
};
})();

(node as any).hash = "a34c4b113b6dc355a9c27711de6e67a1";

export default node;
