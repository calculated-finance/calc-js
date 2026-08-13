/**
 * @generated SignedSource<<22f4b1add39da381c1276cab8fb23f88>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type BorrowSubscription$variables = {
  connection: string;
  prefix: string;
};
export type BorrowSubscription$data = {
  readonly edge: {
    readonly cursor: string | null | undefined;
    readonly node: {
      readonly " $fragmentSpreads": FragmentRefs<"PositionBorrowRowFragment">;
    } | null | undefined;
  } | null | undefined;
};
export type BorrowSubscription = {
  response: BorrowSubscription$data;
  variables: BorrowSubscription$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "connection"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "prefix"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "prefix",
    "variableName": "prefix"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "cursor",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "asset",
  "storageKey": null
},
v6 = {
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
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "type",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "chain",
  "storageKey": null
},
v9 = {
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
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "BorrowSubscription",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "NodeEdge",
        "kind": "LinkedField",
        "name": "edge",
        "plural": false,
        "selections": [
          (v2/*: any*/),
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
                    "name": "PositionBorrowRowFragment"
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
    "name": "BorrowSubscription",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "NodeEdge",
        "kind": "LinkedField",
        "name": "edge",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": null,
            "kind": "LinkedField",
            "name": "node",
            "plural": false,
            "selections": [
              (v3/*: any*/),
              (v4/*: any*/),
              {
                "kind": "InlineFragment",
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "RujiraAccount",
                    "kind": "LinkedField",
                    "name": "account",
                    "plural": false,
                    "selections": [
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
                        "kind": "ScalarField",
                        "name": "label",
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
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
                          (v3/*: any*/),
                          {
                            "kind": "InlineFragment",
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "Asset",
                                "kind": "LinkedField",
                                "name": "asset",
                                "plural": false,
                                "selections": [
                                  (v5/*: any*/),
                                  (v6/*: any*/),
                                  (v4/*: any*/),
                                  (v7/*: any*/),
                                  (v8/*: any*/),
                                  (v9/*: any*/)
                                ],
                                "storageKey": null
                              },
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
                                  (v4/*: any*/)
                                ],
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "Asset",
                                "kind": "LinkedField",
                                "name": "asset",
                                "plural": false,
                                "selections": [
                                  (v6/*: any*/),
                                  (v4/*: any*/),
                                  (v5/*: any*/),
                                  (v7/*: any*/),
                                  (v8/*: any*/),
                                  (v9/*: any*/)
                                ],
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
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": (v1/*: any*/),
        "filters": null,
        "handle": "appendEdge",
        "key": "",
        "kind": "LinkedHandle",
        "name": "edge",
        "handleArgs": [
          {
            "items": [
              {
                "kind": "Variable",
                "name": "connections.0",
                "variableName": "connection"
              }
            ],
            "kind": "ListValue",
            "name": "connections"
          }
        ]
      }
    ]
  },
  "params": {
    "cacheID": "65974f5f911d9cb123605b9d0be99160",
    "id": null,
    "metadata": {},
    "name": "BorrowSubscription",
    "operationKind": "subscription",
    "text": "subscription BorrowSubscription(\n  $prefix: String!\n) {\n  edge(prefix: $prefix) {\n    cursor\n    node {\n      __typename\n      ... on GhostCreditAccount {\n        ...PositionBorrowRowFragment\n      }\n      id\n    }\n  }\n}\n\nfragment PositionBorrowFragment on GhostCreditAccount {\n  id\n  account {\n    address\n    label\n  }\n  ...PositionPositionFragment\n}\n\nfragment PositionBorrowRowFragment on GhostCreditAccount {\n  account {\n    address\n    label\n  }\n  collaterals {\n    collateral {\n      __typename\n      ... on Balance {\n        asset {\n          asset\n          metadata {\n            symbol\n          }\n          id\n        }\n        amount\n      }\n    }\n    valueFull\n    valueAdjusted\n  }\n  debts {\n    value\n    debt {\n      current\n      borrower {\n        vault {\n          status {\n            debtRate\n          }\n          id\n        }\n        asset {\n          metadata {\n            symbol\n          }\n          id\n        }\n      }\n    }\n  }\n  ltv\n  collateralValueUsd\n  debtValueUsd\n  collateralLiquidationValueUsd\n  debtLiquidationValueUsd\n  ...PositionBorrowFragment\n}\n\nfragment PositionPositionFragment on GhostCreditAccount {\n  collaterals {\n    collateral {\n      __typename\n      ... on Balance {\n        asset {\n          asset\n          type\n          chain\n          metadata {\n            symbol\n            decimals\n          }\n          variants {\n            native {\n              denom\n            }\n          }\n          id\n        }\n        amount\n      }\n    }\n    valueFull\n    valueAdjusted\n  }\n  debts {\n    value\n    debt {\n      current\n      borrower {\n        vault {\n          status {\n            debtRate\n          }\n          id\n        }\n        asset {\n          asset\n          type\n          chain\n          metadata {\n            symbol\n            decimals\n          }\n          variants {\n            native {\n              denom\n            }\n          }\n          id\n        }\n      }\n    }\n  }\n  ltv\n  collateralValueUsd\n  debtValueUsd\n  collateralLiquidationValueUsd\n  debtLiquidationValueUsd\n}\n"
  }
};
})();

(node as any).hash = "f703669deb88779b693401aa7c162fa6";

export default node;
