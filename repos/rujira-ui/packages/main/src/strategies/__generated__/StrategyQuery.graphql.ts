/**
 * @generated SignedSource<<ce15fe63a8d2285b91f39e870140e43c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type StrategyQuery$variables = {
  id: string;
};
export type StrategyQuery$data = {
  readonly node: {
    readonly __typename: "BowPoolXyk";
    readonly " $fragmentSpreads": FragmentRefs<"BowPoolXykFragment">;
  } | {
    readonly __typename: "ThorchainPool";
    readonly " $fragmentSpreads": FragmentRefs<"ThorchainPoolFragment">;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  } | null | undefined;
};
export type StrategyQuery = {
  response: StrategyQuery$data;
  variables: StrategyQuery$variables;
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
  "kind": "ScalarField",
  "name": "address",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "symbol",
  "storageKey": null
},
v6 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "Metadata",
    "kind": "LinkedField",
    "name": "metadata",
    "plural": false,
    "selections": [
      (v5/*: any*/)
    ],
    "storageKey": null
  },
  (v3/*: any*/)
],
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "tick",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "asset",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "decimals",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "concreteType": "Metadata",
  "kind": "LinkedField",
  "name": "metadata",
  "plural": false,
  "selections": [
    (v5/*: any*/),
    (v9/*: any*/)
  ],
  "storageKey": null
},
v11 = {
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
    (v3/*: any*/)
  ],
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "spread",
  "storageKey": null
},
v13 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 100
  }
],
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "price",
  "storageKey": null
},
v15 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "FinBookEntryEdge",
    "kind": "LinkedField",
    "name": "edges",
    "plural": true,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "FinBookEntry",
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "value",
            "storageKey": null
          },
          (v14/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "total",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "virtualTotal",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "virtualValue",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "side",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
],
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "chain",
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "type",
  "storageKey": null
},
v18 = [
  (v16/*: any*/),
  (v10/*: any*/),
  (v3/*: any*/),
  (v8/*: any*/),
  (v17/*: any*/),
  (v11/*: any*/)
],
v19 = {
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
v20 = {
  "alias": null,
  "args": null,
  "concreteType": "AssetVariants",
  "kind": "LinkedField",
  "name": "variants",
  "plural": false,
  "selections": [
    (v19/*: any*/)
  ],
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "StrategyQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
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
                "args": null,
                "kind": "FragmentSpread",
                "name": "BowPoolXykFragment"
              }
            ],
            "type": "BowPoolXyk",
            "abstractKey": null
          },
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "ThorchainPoolFragment"
              }
            ],
            "type": "ThorchainPool",
            "abstractKey": null
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
    "name": "StrategyQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v4/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "FinBook",
                "kind": "LinkedField",
                "name": "quotes",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "FinPair",
                    "kind": "LinkedField",
                    "name": "pair",
                    "plural": false,
                    "selections": [
                      (v4/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Asset",
                        "kind": "LinkedField",
                        "name": "assetBase",
                        "plural": false,
                        "selections": (v6/*: any*/),
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Asset",
                        "kind": "LinkedField",
                        "name": "assetQuote",
                        "plural": false,
                        "selections": (v6/*: any*/),
                        "storageKey": null
                      },
                      (v3/*: any*/),
                      (v7/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "FinBookV2",
                        "kind": "LinkedField",
                        "name": "bookV2",
                        "plural": false,
                        "selections": [
                          (v3/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "FinPair",
                            "kind": "LinkedField",
                            "name": "pair",
                            "plural": false,
                            "selections": [
                              (v4/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "Asset",
                                "kind": "LinkedField",
                                "name": "assetBase",
                                "plural": false,
                                "selections": [
                                  (v8/*: any*/),
                                  (v10/*: any*/),
                                  (v3/*: any*/)
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
                                  (v8/*: any*/),
                                  (v10/*: any*/),
                                  (v11/*: any*/),
                                  (v3/*: any*/)
                                ],
                                "storageKey": null
                              },
                              (v7/*: any*/),
                              (v3/*: any*/)
                            ],
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "center",
                            "storageKey": null
                          },
                          (v12/*: any*/),
                          {
                            "alias": null,
                            "args": (v13/*: any*/),
                            "concreteType": "FinBookEntryConnection",
                            "kind": "LinkedField",
                            "name": "bids",
                            "plural": false,
                            "selections": (v15/*: any*/),
                            "storageKey": "bids(first:100)"
                          },
                          {
                            "alias": null,
                            "args": (v13/*: any*/),
                            "concreteType": "FinBookEntryConnection",
                            "kind": "LinkedField",
                            "name": "asks",
                            "plural": false,
                            "selections": (v15/*: any*/),
                            "storageKey": "asks(first:100)"
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
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "BowConfigXyk",
                "kind": "LinkedField",
                "name": "config",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Asset",
                    "kind": "LinkedField",
                    "name": "x",
                    "plural": false,
                    "selections": (v18/*: any*/),
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Asset",
                    "kind": "LinkedField",
                    "name": "y",
                    "plural": false,
                    "selections": (v18/*: any*/),
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Asset",
                    "kind": "LinkedField",
                    "name": "shareAsset",
                    "plural": false,
                    "selections": [
                      (v20/*: any*/),
                      (v3/*: any*/)
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "minQuote",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "fee",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "BowSummary",
                "kind": "LinkedField",
                "name": "summary",
                "plural": false,
                "selections": [
                  (v12/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "depthBid",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "depthAsk",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "volume",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "utilization",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": [
                  {
                    "kind": "Literal",
                    "name": "first",
                    "value": 20
                  }
                ],
                "concreteType": "FinTradeConnection",
                "kind": "LinkedField",
                "name": "trades",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "FinTradeEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "cursor",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "FinTrade",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          (v3/*: any*/),
                          (v17/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "quoteAmount",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "baseAmount",
                            "storageKey": null
                          },
                          (v14/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "protocol",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "timestamp",
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": "trades(first:20)"
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "BowStateXyk",
                "kind": "LinkedField",
                "name": "state",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "x",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "y",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "shares",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "type": "BowPoolXyk",
            "abstractKey": null
          },
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "balanceAsset",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "balanceRune",
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
                  (v3/*: any*/),
                  (v17/*: any*/),
                  (v16/*: any*/),
                  (v10/*: any*/),
                  (v11/*: any*/),
                  (v8/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "AssetVariants",
                    "kind": "LinkedField",
                    "name": "variants",
                    "plural": false,
                    "selections": [
                      (v19/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Asset",
                        "kind": "LinkedField",
                        "name": "secured",
                        "plural": false,
                        "selections": [
                          (v17/*: any*/),
                          (v16/*: any*/),
                          (v8/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Metadata",
                            "kind": "LinkedField",
                            "name": "metadata",
                            "plural": false,
                            "selections": [
                              (v9/*: any*/),
                              (v5/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v20/*: any*/),
                          (v3/*: any*/)
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
            "type": "ThorchainPool",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "9c61372f9e286f500982d8a7e8a2b8e4",
    "id": null,
    "metadata": {},
    "name": "StrategyQuery",
    "operationKind": "query",
    "text": "query StrategyQuery(\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    ... on BowPoolXyk {\n      ...BowPoolXykFragment\n    }\n    ... on ThorchainPool {\n      ...ThorchainPoolFragment\n    }\n    id\n  }\n}\n\nfragment BowPoolXykFragment on BowPoolXyk {\n  ...BowPoolXykSummaryFragment\n  ...BowPoolXykStateFragment\n  id\n  address\n  config {\n    x {\n      asset\n      chain\n      type\n      price {\n        current\n        id\n      }\n      metadata {\n        symbol\n        decimals\n      }\n      id\n    }\n    y {\n      asset\n      chain\n      type\n      price {\n        current\n        id\n      }\n      metadata {\n        symbol\n        decimals\n      }\n      id\n    }\n    shareAsset {\n      variants {\n        native {\n          denom\n        }\n      }\n      id\n    }\n    minQuote\n    fee\n  }\n  state {\n    x\n    y\n    shares\n  }\n}\n\nfragment BowPoolXykStateFragment on BowPoolXyk {\n  config {\n    x {\n      chain\n      metadata {\n        symbol\n      }\n      id\n    }\n    y {\n      chain\n      metadata {\n        symbol\n      }\n      id\n    }\n  }\n  quotes {\n    pair {\n      tick\n      bookV2 {\n        ...OrderBookFragment\n        id\n      }\n      id\n    }\n    id\n  }\n  summary {\n    spread\n    depthBid\n    depthAsk\n    volume\n    utilization\n  }\n  trades(first: 20) {\n    edges {\n      ...HistoryFragment\n    }\n  }\n}\n\nfragment BowPoolXykSummaryFragment on BowPoolXyk {\n  address\n  quotes {\n    pair {\n      address\n      assetBase {\n        metadata {\n          symbol\n        }\n        id\n      }\n      assetQuote {\n        metadata {\n          symbol\n        }\n        id\n      }\n      id\n    }\n    id\n  }\n}\n\nfragment HistoryFragment on FinTradeEdge {\n  cursor\n  node {\n    id\n    ...HistoryItemFragment\n  }\n}\n\nfragment HistoryItemFragment on FinTrade {\n  type\n  quoteAmount\n  baseAmount\n  price\n  protocol\n  timestamp\n}\n\nfragment OrderBookEntryFragment on FinBookEntry {\n  price\n  side\n  total\n  value\n  virtualTotal\n  virtualValue\n}\n\nfragment OrderBookFragment on FinBookV2 {\n  id\n  pair {\n    address\n    assetBase {\n      asset\n      metadata {\n        symbol\n        decimals\n      }\n      id\n    }\n    assetQuote {\n      asset\n      metadata {\n        symbol\n        decimals\n      }\n      price {\n        current\n        id\n      }\n      id\n    }\n    tick\n    id\n  }\n  ...OrderBookSubFragment_3xbZD3\n}\n\nfragment OrderBookSubFragment_3xbZD3 on FinBookV2 {\n  id\n  center\n  spread\n  bids(first: 100) {\n    edges {\n      node {\n        value\n        price\n        total\n        virtualTotal\n        virtualValue\n        ...OrderBookEntryFragment\n      }\n    }\n  }\n  asks(first: 100) {\n    edges {\n      node {\n        value\n        price\n        total\n        virtualTotal\n        virtualValue\n        ...OrderBookEntryFragment\n      }\n    }\n  }\n}\n\nfragment ThorchainPoolFragment on ThorchainPool {\n  id\n  balanceAsset\n  balanceRune\n  asset {\n    id\n    type\n    chain\n    metadata {\n      symbol\n    }\n    price {\n      current\n      id\n    }\n    ...msgAssetFragment\n  }\n}\n\nfragment msgAssetFragment on Asset {\n  type\n  chain\n  asset\n  metadata {\n    decimals\n    symbol\n  }\n  variants {\n    native {\n      denom\n    }\n    secured {\n      type\n      chain\n      asset\n      metadata {\n        decimals\n        symbol\n      }\n      variants {\n        native {\n          denom\n        }\n      }\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "2cd82cca41517199d35fb1ee3f9422a4";

export default node;
