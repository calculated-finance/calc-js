/**
 * @generated SignedSource<<87a003c3313d4a090933af36084869ab>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type PositionSubscription$variables = {
  contract: string;
};
export type PositionSubscription$data = {
  readonly ghostCreditAccountUpdated: {
    readonly node: {
      readonly " $fragmentSpreads": FragmentRefs<"PositionPositionFragment">;
    } | null | undefined;
  } | null | undefined;
};
export type PositionSubscription = {
  response: PositionSubscription$data;
  variables: PositionSubscription$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "contract"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "address",
    "variableName": "contract"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "concreteType": "Asset",
  "kind": "LinkedField",
  "name": "asset",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "asset",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "type",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "chain",
      "storageKey": null
    },
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
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "decimals",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "AssetVariants",
      "kind": "LinkedField",
      "name": "variants",
      "plural": false,
      "selections": [
        {
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
        }
      ],
      "storageKey": null
    },
    (v3/*: any*/)
  ],
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "PositionSubscription",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "NodeEdge",
        "kind": "LinkedField",
        "name": "ghostCreditAccountUpdated",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": null,
            "kind": "LinkedField",
            "name": "node",
            "plural": false,
            "selections": [
              {
                "kind": "InlineFragment",
                "selections": [
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "PositionPositionFragment"
                  }
                ],
                "type": "GhostCreditAccount",
                "abstractKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "RootSubscriptionType",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "PositionSubscription",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "NodeEdge",
        "kind": "LinkedField",
        "name": "ghostCreditAccountUpdated",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": null,
            "kind": "LinkedField",
            "name": "node",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              {
                "kind": "InlineFragment",
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "GhostCreditCollateral",
                    "kind": "LinkedField",
                    "name": "collaterals",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": null,
                        "kind": "LinkedField",
                        "name": "collateral",
                        "plural": false,
                        "selections": [
                          (v2/*: any*/),
                          {
                            "kind": "InlineFragment",
                            "selections": [
                              (v4/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "amount",
                                "storageKey": null
                              }
                            ],
                            "type": "Balance",
                            "abstractKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "valueFull",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "valueAdjusted",
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "GhostCreditDebt",
                    "kind": "LinkedField",
                    "name": "debts",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "value",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "GhostVaultDelegate",
                        "kind": "LinkedField",
                        "name": "debt",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "current",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "GhostVaultBorrower",
                            "kind": "LinkedField",
                            "name": "borrower",
                            "plural": false,
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "GhostVault",
                                "kind": "LinkedField",
                                "name": "vault",
                                "plural": false,
                                "selections": [
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "GhostVaultStatus",
                                    "kind": "LinkedField",
                                    "name": "status",
                                    "plural": false,
                                    "selections": [
                                      {
                                        "alias": null,
                                        "args": null,
                                        "kind": "ScalarField",
                                        "name": "debtRate",
                                        "storageKey": null
                                      }
                                    ],
                                    "storageKey": null
                                  },
                                  (v3/*: any*/)
                                ],
                                "storageKey": null
                              },
                              (v4/*: any*/)
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
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "ltv",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "collateralValueUsd",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "debtValueUsd",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "collateralLiquidationValueUsd",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "debtLiquidationValueUsd",
                    "storageKey": null
                  }
                ],
                "type": "GhostCreditAccount",
                "abstractKey": null
              },
              (v3/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "d6cfe4954b34bb92733aedd36e193cb1",
    "id": null,
    "metadata": {},
    "name": "PositionSubscription",
    "operationKind": "subscription",
    "text": "subscription PositionSubscription(\n  $contract: Address!\n) {\n  ghostCreditAccountUpdated(address: $contract) {\n    node {\n      __typename\n      ... on GhostCreditAccount {\n        ...PositionPositionFragment\n      }\n      id\n    }\n  }\n}\n\nfragment PositionPositionFragment on GhostCreditAccount {\n  collaterals {\n    collateral {\n      __typename\n      ... on Balance {\n        asset {\n          asset\n          type\n          chain\n          metadata {\n            symbol\n            decimals\n          }\n          variants {\n            native {\n              denom\n            }\n          }\n          id\n        }\n        amount\n      }\n    }\n    valueFull\n    valueAdjusted\n  }\n  debts {\n    value\n    debt {\n      current\n      borrower {\n        vault {\n          status {\n            debtRate\n          }\n          id\n        }\n        asset {\n          asset\n          type\n          chain\n          metadata {\n            symbol\n            decimals\n          }\n          variants {\n            native {\n              denom\n            }\n          }\n          id\n        }\n      }\n    }\n  }\n  ltv\n  collateralValueUsd\n  debtValueUsd\n  collateralLiquidationValueUsd\n  debtLiquidationValueUsd\n}\n"
  }
};
})();

(node as any).hash = "dfe8351d050f18d9c4464f9260f380c9";

export default node;
