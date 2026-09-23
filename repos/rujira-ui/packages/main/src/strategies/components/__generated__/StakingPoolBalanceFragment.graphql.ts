/**
 * @generated SignedSource<<ea485e43f71bb075a84a86c97ffa897b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type StakingPoolBalanceFragment$data = {
  readonly account: string;
  readonly bonded: {
    readonly amount: bigint;
  };
  readonly id: string;
  readonly liquidSize: {
    readonly amount: bigint;
    readonly asset: {
      readonly " $fragmentSpreads": FragmentRefs<"msgAssetFragment">;
    };
  };
  readonly pool: {
    readonly bondAsset: {
      readonly metadata: {
        readonly symbol: string;
      };
    };
  };
  readonly valueUsd: bigint;
  readonly " $fragmentSpreads": FragmentRefs<"StakingPoolBalanceRewardsFragment" | "StakingPoolBalanceTransferFragment" | "StakingPoolBalanceWithdrawFragment">;
  readonly " $fragmentType": "StakingPoolBalanceFragment";
};
export type StakingPoolBalanceFragment$key = {
  readonly " $data"?: StakingPoolBalanceFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"StakingPoolBalanceFragment">;
};

import StakingPoolBalanceQuery_graphql from './StakingPoolBalanceQuery.graphql';

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "amount",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "refetch": {
      "connection": null,
      "fragmentPathInResult": [
        "node"
      ],
      "operation": StakingPoolBalanceQuery_graphql,
      "identifierInfo": {
        "identifierField": "id",
        "identifierQueryVariableName": "id"
      }
    }
  },
  "name": "StakingPoolBalanceFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "account",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Balance",
      "kind": "LinkedField",
      "name": "liquidSize",
      "plural": false,
      "selections": [
        (v0/*: any*/),
        {
          "alias": null,
          "args": null,
          "concreteType": "Asset",
          "kind": "LinkedField",
          "name": "asset",
          "plural": false,
          "selections": [
            {
              "args": null,
              "kind": "FragmentSpread",
              "name": "msgAssetFragment"
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Balance",
      "kind": "LinkedField",
      "name": "bonded",
      "plural": false,
      "selections": [
        (v0/*: any*/)
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "valueUsd",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "StakingPool",
      "kind": "LinkedField",
      "name": "pool",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "Asset",
          "kind": "LinkedField",
          "name": "bondAsset",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "Metadata",
              "kind": "LinkedField",
              "name": "metadata",
              "plural": false,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "symbol",
                  "storageKey": null
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "StakingPoolBalanceWithdrawFragment"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "StakingPoolBalanceRewardsFragment"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "StakingPoolBalanceTransferFragment"
    }
  ],
  "type": "StakingAccount",
  "abstractKey": null
};
})();

(node as any).hash = "699875c4d63ffeb70a04074823751838";

export default node;
