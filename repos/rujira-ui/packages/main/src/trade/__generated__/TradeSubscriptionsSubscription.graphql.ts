/**
 * @generated SignedSource<<31e7c1c79bc47d835b1cbdceccf13f73>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type TradeSubscriptionsSubscription$variables = {
  contract: string;
  owner: string;
  price: string;
  side: string;
};
export type TradeSubscriptionsSubscription$data = {
  readonly finOrderFilled: {
    readonly node: {
      readonly __typename: string;
      readonly pair?: {
        readonly assetBase: {
          readonly metadata: {
            readonly symbol: string;
          };
        };
        readonly assetQuote: {
          readonly metadata: {
            readonly symbol: string;
          };
        };
      };
      readonly " $fragmentSpreads": FragmentRefs<"LimitOrdersFragment">;
    } | null | undefined;
  } | null | undefined;
};
export type TradeSubscriptionsSubscription = {
  response: TradeSubscriptionsSubscription$data;
  variables: TradeSubscriptionsSubscription$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "contract"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "owner"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "price"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "side"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "contract",
    "variableName": "contract"
  },
  {
    "kind": "Variable",
    "name": "owner",
    "variableName": "owner"
  },
  {
    "kind": "Variable",
    "name": "price",
    "variableName": "price"
  },
  {
    "kind": "Variable",
    "name": "side",
    "variableName": "side"
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
  "name": "symbol",
  "storageKey": null
},
v4 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "Metadata",
    "kind": "LinkedField",
    "name": "metadata",
    "plural": false,
    "selections": [
      (v3/*: any*/)
    ],
    "storageKey": null
  }
],
v5 = {
  "alias": null,
  "args": null,
  "concreteType": "Metadata",
  "kind": "LinkedField",
  "name": "metadata",
  "plural": false,
  "selections": [
    (v3/*: any*/),
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
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "asset",
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
  "kind": "ScalarField",
  "name": "type",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "TradeSubscriptionsSubscription",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "NodeEdge",
        "kind": "LinkedField",
        "name": "finOrderFilled",
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
                    "concreteType": "FinPair",
                    "kind": "LinkedField",
                    "name": "pair",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Asset",
                        "kind": "LinkedField",
                        "name": "assetBase",
                        "plural": false,
                        "selections": (v4/*: any*/),
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Asset",
                        "kind": "LinkedField",
                        "name": "assetQuote",
                        "plural": false,
                        "selections": (v4/*: any*/),
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "type": "FinOrder",
                "abstractKey": null
              },
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "LimitOrdersFragment"
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
    "name": "TradeSubscriptionsSubscription",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "NodeEdge",
        "kind": "LinkedField",
        "name": "finOrderFilled",
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
                    "concreteType": "FinPair",
                    "kind": "LinkedField",
                    "name": "pair",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Asset",
                        "kind": "LinkedField",
                        "name": "assetBase",
                        "plural": false,
                        "selections": [
                          (v5/*: any*/),
                          (v6/*: any*/),
                          (v7/*: any*/),
                          (v8/*: any*/),
                          (v9/*: any*/)
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Asset",
                        "kind": "LinkedField",
                        "name": "assetQuote",
                        "plural": false,
                        "selections": [
                          (v5/*: any*/),
                          (v6/*: any*/),
                          (v7/*: any*/),
                          (v8/*: any*/),
                          (v9/*: any*/),
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
                              (v6/*: any*/)
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      (v6/*: any*/),
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
                        "concreteType": "FinBook",
                        "kind": "LinkedField",
                        "name": "book",
                        "plural": false,
                        "selections": [
                          (v6/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "center",
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
                    "name": "deviation",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "filled",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "filledValue",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "filledFee",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "offer",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "owner",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "remaining",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "remainingValue",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "rate",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "side",
                    "storageKey": null
                  },
                  (v9/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "updatedAt",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "offerValue",
                    "storageKey": null
                  }
                ],
                "type": "FinOrder",
                "abstractKey": null
              },
              (v6/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "55ee7f8ccd659e1c3d9241537b9e9a5a",
    "id": null,
    "metadata": {},
    "name": "TradeSubscriptionsSubscription",
    "operationKind": "subscription",
    "text": "subscription TradeSubscriptionsSubscription(\n  $contract: Address!\n  $owner: Address!\n  $price: String!\n  $side: String!\n) {\n  finOrderFilled(contract: $contract, owner: $owner, price: $price, side: $side) {\n    node {\n      __typename\n      ... on FinOrder {\n        pair {\n          assetBase {\n            metadata {\n              symbol\n            }\n            id\n          }\n          assetQuote {\n            metadata {\n              symbol\n            }\n            id\n          }\n          id\n        }\n      }\n      ...LimitOrdersFragment\n      id\n    }\n  }\n}\n\nfragment LimitOrdersFragment on FinOrder {\n  deviation\n  filled\n  filledValue\n  filledFee\n  offer\n  owner\n  pair {\n    address\n    assetBase {\n      asset\n      chain\n      type\n      metadata {\n        symbol\n        decimals\n      }\n      id\n    }\n    assetQuote {\n      asset\n      chain\n      type\n      metadata {\n        symbol\n        decimals\n      }\n      price {\n        current\n        id\n      }\n      id\n    }\n    book {\n      id\n      center\n    }\n    id\n  }\n  remaining\n  remainingValue\n  rate\n  side\n  type\n  updatedAt\n  offerValue\n}\n"
  }
};
})();

(node as any).hash = "89474979592e948d1a90f2d30da1f5f3";

export default node;
