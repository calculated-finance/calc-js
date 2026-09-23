/**
 * @generated SignedSource<<992114aeaf676a35caa15137fd7a5397>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type StakePoolBalanceQuery$variables = {
  id: string;
};
export type StakePoolBalanceQuery$data = {
  readonly node: {
    readonly " $fragmentSpreads": FragmentRefs<"StakePoolBalanceFragment">;
  } | null | undefined;
};
export type StakePoolBalanceQuery = {
  response: StakePoolBalanceQuery$data;
  variables: StakePoolBalanceQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "amount",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "type",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "chain",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "asset",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "symbol",
  "storageKey": null
},
v8 = {
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
      "name": "decimals",
      "storageKey": null
    },
    (v7/*: any*/)
  ],
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "concreteType": "Denom",
  "kind": "LinkedField",
  "name": "native",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "denom",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "concreteType": "AssetVariants",
  "kind": "LinkedField",
  "name": "variants",
  "plural": false,
  "selections": [
    (v9/*: any*/)
  ],
  "storageKey": null
},
v11 = [
  (v4/*: any*/),
  (v5/*: any*/),
  (v6/*: any*/),
  (v8/*: any*/),
  {
    "alias": null,
    "args": null,
    "concreteType": "AssetVariants",
    "kind": "LinkedField",
    "name": "variants",
    "plural": false,
    "selections": [
      (v9/*: any*/),
      {
        "alias": null,
        "args": null,
        "concreteType": "Asset",
        "kind": "LinkedField",
        "name": "secured",
        "plural": false,
        "selections": [
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v8/*: any*/),
          (v10/*: any*/),
          (v2/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  },
  (v2/*: any*/)
],
v12 = {
  "alias": null,
  "args": null,
  "concreteType": "Metadata",
  "kind": "LinkedField",
  "name": "metadata",
  "plural": false,
  "selections": [
    (v7/*: any*/)
  ],
  "storageKey": null
},
v13 = [
  (v12/*: any*/),
  (v2/*: any*/)
],
v14 = [
  (v3/*: any*/)
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "StakePoolBalanceQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "StakePoolBalanceFragment"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "RootQueryType",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "StakePoolBalanceQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "__typename",
            "storageKey": null
          },
          (v2/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
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
                  (v3/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Asset",
                    "kind": "LinkedField",
                    "name": "asset",
                    "plural": false,
                    "selections": (v11/*: any*/),
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
                  (v3/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Asset",
                    "kind": "LinkedField",
                    "name": "asset",
                    "plural": false,
                    "selections": (v13/*: any*/),
                    "storageKey": null
                  }
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
                      (v12/*: any*/),
                      (v2/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Price",
                        "kind": "LinkedField",
                        "name": "price",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "current",
                            "storageKey": null
                          },
                          (v2/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v10/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v2/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "address",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Asset",
                    "kind": "LinkedField",
                    "name": "revenueAsset",
                    "plural": false,
                    "selections": (v13/*: any*/),
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Asset",
                    "kind": "LinkedField",
                    "name": "receiptAsset",
                    "plural": false,
                    "selections": (v11/*: any*/),
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
                "name": "liquidShares",
                "plural": false,
                "selections": (v14/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "Balance",
                "kind": "LinkedField",
                "name": "pendingRevenue",
                "plural": false,
                "selections": (v14/*: any*/),
                "storageKey": null
              }
            ],
            "type": "StakingAccount",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "3fce959933fe9a2e94bba8a175037b19",
    "id": null,
    "metadata": {},
    "name": "StakePoolBalanceQuery",
    "operationKind": "query",
    "text": "query StakePoolBalanceQuery(\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    ...StakePoolBalanceFragment\n    id\n  }\n}\n\nfragment StakePoolBalanceFragment on StakingAccount {\n  id\n  account\n  liquidSize {\n    amount\n    asset {\n      ...msgAssetFragment\n      id\n    }\n  }\n  bonded {\n    amount\n  }\n  valueUsd\n  pool {\n    bondAsset {\n      metadata {\n        symbol\n      }\n      id\n    }\n    id\n  }\n  ...StakePoolBalanceWithdrawFragment\n  ...StakePoolBalanceRewardsFragment\n  ...StakePoolBalanceTransferFragment\n}\n\nfragment StakePoolBalanceRewardsFragment on StakingAccount {\n  pool {\n    address\n    revenueAsset {\n      metadata {\n        symbol\n      }\n      id\n    }\n    id\n  }\n  pendingRevenue {\n    amount\n  }\n}\n\nfragment StakePoolBalanceTransferFragment on StakingAccount {\n  pool {\n    bondAsset {\n      metadata {\n        symbol\n      }\n      price {\n        current\n        id\n      }\n      id\n    }\n    receiptAsset {\n      ...msgAssetFragment\n      metadata {\n        symbol\n      }\n      id\n    }\n    id\n  }\n  liquidSize {\n    amount\n  }\n  liquidShares {\n    amount\n  }\n}\n\nfragment StakePoolBalanceWithdrawFragment on StakingAccount {\n  pool {\n    address\n    bondAsset {\n      price {\n        current\n        id\n      }\n      variants {\n        native {\n          denom\n        }\n      }\n      id\n    }\n    id\n  }\n  bonded {\n    amount\n    asset {\n      metadata {\n        symbol\n      }\n      id\n    }\n  }\n  liquidSize {\n    amount\n  }\n  liquidShares {\n    amount\n  }\n}\n\nfragment msgAssetFragment on Asset {\n  type\n  chain\n  asset\n  metadata {\n    decimals\n    symbol\n  }\n  variants {\n    native {\n      denom\n    }\n    secured {\n      type\n      chain\n      asset\n      metadata {\n        decimals\n        symbol\n      }\n      variants {\n        native {\n          denom\n        }\n      }\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "36bae54105afd09ffd43b4b54c0e3323";

export default node;
