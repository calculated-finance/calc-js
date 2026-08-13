/**
 * @generated SignedSource<<096b01402bd6ce45dbe427be3a00f79c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs, Result } from "relay-runtime";
export type AssetType = "LAYER_1" | "NATIVE" | "SECURED" | "SYNTH" | "%future added value";
export type Chain = "AVAX" | "BASE" | "BCH" | "BSC" | "BTC" | "DOGE" | "ETH" | "GAIA" | "KUJI" | "LTC" | "NOBLE" | "OSMO" | "SOL" | "TERRA" | "TERRA2" | "THOR" | "TON" | "TRON" | "TRON" | "XRP" | "%future added value";
export type TradeQuery$variables = {
  id: string;
  rangeAfter?: string | null | undefined;
  rangeBefore?: string | null | undefined;
  truncate?: number | null | undefined;
};
export type TradeQuery$data = {
  readonly pair: Result<{
    readonly address?: string;
    readonly assetBase?: {
      readonly chain: Chain;
      readonly metadata: {
        readonly symbol: string;
      };
      readonly type: AssetType;
      readonly " $fragmentSpreads": FragmentRefs<"msgAssetFragment">;
    };
    readonly assetQuote?: {
      readonly chain: Chain;
      readonly metadata: {
        readonly symbol: string;
      };
      readonly type: AssetType;
      readonly " $fragmentSpreads": FragmentRefs<"msgAssetFragment">;
    };
    readonly bookV2?: {
      readonly " $fragmentSpreads": FragmentRefs<"OrderBookFragment">;
    };
    readonly oracleBase?: {
      readonly id: string;
    } | null | undefined;
    readonly oracleQuote?: {
      readonly id: string;
    } | null | undefined;
    readonly tick?: bigint;
    readonly trades?: {
      readonly __id: string;
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly type: string;
        } | null | undefined;
        readonly " $fragmentSpreads": FragmentRefs<"HistoryFragment">;
      } | null | undefined> | null | undefined;
    };
    readonly " $fragmentSpreads": FragmentRefs<"HeaderTradeFragment" | "RangeFragment" | "RangeInputsFragment" | "SubmitFragment">;
  } | null | undefined, unknown>;
};
export type TradeQuery = {
  response: TradeQuery$data;
  variables: TradeQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "rangeAfter"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "rangeBefore"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "truncate"
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
  "name": "address",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "tick",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "chain",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "type",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "symbol",
  "storageKey": null
},
v7 = [
  (v4/*: any*/),
  (v5/*: any*/),
  {
    "alias": null,
    "args": null,
    "concreteType": "Metadata",
    "kind": "LinkedField",
    "name": "metadata",
    "plural": false,
    "selections": [
      (v6/*: any*/)
    ],
    "storageKey": null
  },
  {
    "args": null,
    "kind": "FragmentSpread",
    "name": "msgAssetFragment"
  }
],
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v9 = [
  (v8/*: any*/)
],
v10 = {
  "kind": "Variable",
  "name": "truncate",
  "variableName": "truncate"
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "cursor",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "concreteType": "PageInfo",
  "kind": "LinkedField",
  "name": "pageInfo",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "endCursor",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "hasNextPage",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v14 = {
  "kind": "ClientExtension",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "__id",
      "storageKey": null
    }
  ]
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "decimals",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "concreteType": "Metadata",
  "kind": "LinkedField",
  "name": "metadata",
  "plural": false,
  "selections": [
    (v6/*: any*/),
    (v15/*: any*/)
  ],
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "asset",
  "storageKey": null
},
v18 = {
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
v19 = {
  "alias": null,
  "args": null,
  "concreteType": "AssetVariants",
  "kind": "LinkedField",
  "name": "variants",
  "plural": false,
  "selections": [
    (v18/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": "Asset",
      "kind": "LinkedField",
      "name": "secured",
      "plural": false,
      "selections": [
        (v5/*: any*/),
        (v4/*: any*/),
        (v17/*: any*/),
        {
          "alias": null,
          "args": null,
          "concreteType": "Metadata",
          "kind": "LinkedField",
          "name": "metadata",
          "plural": false,
          "selections": [
            (v15/*: any*/),
            (v6/*: any*/)
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
            (v18/*: any*/)
          ],
          "storageKey": null
        },
        (v8/*: any*/)
      ],
      "storageKey": null
    }
  ],
  "storageKey": null
},
v20 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "current",
  "storageKey": null
},
v21 = {
  "alias": null,
  "args": null,
  "concreteType": "Price",
  "kind": "LinkedField",
  "name": "price",
  "plural": false,
  "selections": [
    (v20/*: any*/),
    (v8/*: any*/)
  ],
  "storageKey": null
},
v22 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "price",
  "storageKey": null
},
v23 = [
  (v8/*: any*/),
  (v22/*: any*/)
],
v24 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "center",
  "storageKey": null
},
v25 = {
  "kind": "Literal",
  "name": "first",
  "value": 100
},
v26 = [
  (v25/*: any*/),
  (v10/*: any*/)
],
v27 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "value",
  "storageKey": null
},
v28 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "total",
  "storageKey": null
},
v29 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "virtualValue",
  "storageKey": null
},
v30 = [
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
          (v27/*: any*/),
          (v22/*: any*/),
          (v28/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "virtualTotal",
            "storageKey": null
          },
          (v29/*: any*/),
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
v31 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 1
  }
],
v32 = [
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
          (v22/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
],
v33 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "high",
  "storageKey": null
},
v34 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "low",
  "storageKey": null
},
v35 = [
  (v28/*: any*/),
  (v22/*: any*/),
  (v29/*: any*/),
  (v27/*: any*/)
],
v36 = [
  (v25/*: any*/)
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "TradeQuery",
    "selections": [
      {
        "kind": "CatchField",
        "field": {
          "alias": "pair",
          "args": (v1/*: any*/),
          "concreteType": null,
          "kind": "LinkedField",
          "name": "node",
          "plural": false,
          "selections": [
            {
              "kind": "InlineFragment",
              "selections": [
                (v2/*: any*/),
                (v3/*: any*/),
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "Asset",
                  "kind": "LinkedField",
                  "name": "assetBase",
                  "plural": false,
                  "selections": (v7/*: any*/),
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "Asset",
                  "kind": "LinkedField",
                  "name": "assetQuote",
                  "plural": false,
                  "selections": (v7/*: any*/),
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "ThorchainOracle",
                  "kind": "LinkedField",
                  "name": "oracleBase",
                  "plural": false,
                  "selections": (v9/*: any*/),
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "ThorchainOracle",
                  "kind": "LinkedField",
                  "name": "oracleQuote",
                  "plural": false,
                  "selections": (v9/*: any*/),
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "FinBookV2",
                  "kind": "LinkedField",
                  "name": "bookV2",
                  "plural": false,
                  "selections": [
                    {
                      "args": [
                        (v10/*: any*/)
                      ],
                      "kind": "FragmentSpread",
                      "name": "OrderBookFragment"
                    }
                  ],
                  "storageKey": null
                },
                {
                  "args": null,
                  "kind": "FragmentSpread",
                  "name": "HeaderTradeFragment"
                },
                {
                  "args": null,
                  "kind": "FragmentSpread",
                  "name": "SubmitFragment"
                },
                {
                  "alias": "trades",
                  "args": null,
                  "concreteType": "FinTradeConnection",
                  "kind": "LinkedField",
                  "name": "__HistoryFragment_trades_connection",
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
                          "args": null,
                          "kind": "FragmentSpread",
                          "name": "HistoryFragment"
                        },
                        {
                          "alias": null,
                          "args": null,
                          "concreteType": "FinTrade",
                          "kind": "LinkedField",
                          "name": "node",
                          "plural": false,
                          "selections": [
                            (v5/*: any*/),
                            (v11/*: any*/)
                          ],
                          "storageKey": null
                        },
                        (v12/*: any*/)
                      ],
                      "storageKey": null
                    },
                    (v13/*: any*/),
                    (v14/*: any*/)
                  ],
                  "storageKey": null
                },
                {
                  "args": null,
                  "kind": "FragmentSpread",
                  "name": "RangeFragment"
                },
                {
                  "args": null,
                  "kind": "FragmentSpread",
                  "name": "RangeInputsFragment"
                }
              ],
              "type": "FinPair",
              "abstractKey": null
            }
          ],
          "storageKey": null
        },
        "to": "RESULT"
      }
    ],
    "type": "RootQueryType",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "TradeQuery",
    "selections": [
      {
        "alias": "pair",
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v11/*: any*/),
          (v8/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Asset",
                "kind": "LinkedField",
                "name": "assetBase",
                "plural": false,
                "selections": [
                  (v4/*: any*/),
                  (v5/*: any*/),
                  (v16/*: any*/),
                  (v17/*: any*/),
                  (v19/*: any*/),
                  (v8/*: any*/),
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
                        "name": "mcap",
                        "storageKey": null
                      },
                      (v8/*: any*/),
                      (v20/*: any*/)
                    ],
                    "storageKey": null
                  }
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
                  (v4/*: any*/),
                  (v5/*: any*/),
                  (v16/*: any*/),
                  (v17/*: any*/),
                  (v19/*: any*/),
                  (v8/*: any*/),
                  (v21/*: any*/)
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "ThorchainOracle",
                "kind": "LinkedField",
                "name": "oracleBase",
                "plural": false,
                "selections": (v23/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "ThorchainOracle",
                "kind": "LinkedField",
                "name": "oracleQuote",
                "plural": false,
                "selections": (v23/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "FinBookV2",
                "kind": "LinkedField",
                "name": "bookV2",
                "plural": false,
                "selections": [
                  (v8/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "FinPair",
                    "kind": "LinkedField",
                    "name": "pair",
                    "plural": false,
                    "selections": [
                      (v2/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Asset",
                        "kind": "LinkedField",
                        "name": "assetBase",
                        "plural": false,
                        "selections": [
                          (v17/*: any*/),
                          (v16/*: any*/),
                          (v8/*: any*/)
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
                          (v17/*: any*/),
                          (v16/*: any*/),
                          (v21/*: any*/),
                          (v8/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v3/*: any*/),
                      (v8/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v24/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "spread",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": (v26/*: any*/),
                    "concreteType": "FinBookEntryConnection",
                    "kind": "LinkedField",
                    "name": "bids",
                    "plural": false,
                    "selections": (v30/*: any*/),
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": (v26/*: any*/),
                    "concreteType": "FinBookEntryConnection",
                    "kind": "LinkedField",
                    "name": "asks",
                    "plural": false,
                    "selections": (v30/*: any*/),
                    "storageKey": null
                  },
                  {
                    "alias": "bestAsk",
                    "args": (v31/*: any*/),
                    "concreteType": "FinBookEntryConnection",
                    "kind": "LinkedField",
                    "name": "asks",
                    "plural": false,
                    "selections": (v32/*: any*/),
                    "storageKey": "asks(first:1)"
                  },
                  {
                    "alias": "bestBid",
                    "args": (v31/*: any*/),
                    "concreteType": "FinBookEntryConnection",
                    "kind": "LinkedField",
                    "name": "bids",
                    "plural": false,
                    "selections": (v32/*: any*/),
                    "storageKey": "bids(first:1)"
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "FinSummary",
                "kind": "LinkedField",
                "name": "summary",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "last",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "lastUsd",
                    "storageKey": null
                  },
                  (v33/*: any*/),
                  (v34/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "change",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "volumeUsd",
                    "storageKey": null
                  }
                ],
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
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "FinBookEntry",
                    "kind": "LinkedField",
                    "name": "bids",
                    "plural": true,
                    "selections": (v35/*: any*/),
                    "storageKey": null
                  },
                  (v24/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "FinBookEntry",
                    "kind": "LinkedField",
                    "name": "asks",
                    "plural": true,
                    "selections": (v35/*: any*/),
                    "storageKey": null
                  },
                  (v8/*: any*/)
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "feeMaker",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "feeTaker",
                "storageKey": null
              },
              {
                "alias": null,
                "args": (v36/*: any*/),
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
                      (v12/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "FinTrade",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          (v8/*: any*/),
                          (v5/*: any*/),
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
                          (v22/*: any*/),
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
                          },
                          (v11/*: any*/)
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  (v13/*: any*/),
                  (v14/*: any*/)
                ],
                "storageKey": "trades(first:100)"
              },
              {
                "alias": null,
                "args": (v36/*: any*/),
                "filters": null,
                "handle": "connection",
                "key": "HistoryFragment_trades",
                "kind": "LinkedHandle",
                "name": "trades"
              },
              {
                "alias": null,
                "args": [
                  {
                    "kind": "Variable",
                    "name": "after",
                    "variableName": "rangeAfter"
                  },
                  {
                    "kind": "Variable",
                    "name": "before",
                    "variableName": "rangeBefore"
                  },
                  {
                    "kind": "Literal",
                    "name": "last",
                    "value": 90
                  },
                  {
                    "kind": "Literal",
                    "name": "resolution",
                    "value": "1D"
                  }
                ],
                "concreteType": "FinCandleConnection",
                "kind": "LinkedField",
                "name": "candles",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "FinCandleEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "FinCandle",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "close",
                            "storageKey": null
                          },
                          (v33/*: any*/),
                          (v34/*: any*/),
                          (v8/*: any*/)
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
            "type": "FinPair",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "ee8c01d4f8b8147260e64f2e5a155b11",
    "id": null,
    "metadata": {
      "connection": [
        {
          "count": null,
          "cursor": null,
          "direction": "forward",
          "path": [
            "pair",
            "trades"
          ]
        }
      ]
    },
    "name": "TradeQuery",
    "operationKind": "query",
    "text": "query TradeQuery(\n  $id: ID!\n  $rangeAfter: String\n  $rangeBefore: String\n  $truncate: Int\n) {\n  pair: node(id: $id) {\n    __typename\n    ... on FinPair {\n      address\n      tick\n      assetBase {\n        chain\n        type\n        metadata {\n          symbol\n        }\n        ...msgAssetFragment\n        id\n      }\n      assetQuote {\n        chain\n        type\n        metadata {\n          symbol\n        }\n        ...msgAssetFragment\n        id\n      }\n      oracleBase {\n        id\n      }\n      oracleQuote {\n        id\n      }\n      bookV2 {\n        ...OrderBookFragment_2ob4IK\n        id\n      }\n      ...HeaderTradeFragment\n      ...SubmitFragment\n      trades(first: 100) {\n        edges {\n          ...HistoryFragment\n          node {\n            type\n            id\n            __typename\n          }\n          cursor\n        }\n        pageInfo {\n          endCursor\n          hasNextPage\n        }\n      }\n      ...RangeFragment\n      ...RangeInputsFragment\n    }\n    id\n  }\n}\n\nfragment ClassicSubmitFragment on FinPair {\n  ...MarketSubmitFragment\n  ...OracleSubmitFragment\n  ...LimitSubmitFragment\n  ...RecurringSubmitFragment\n  address\n  tick\n  assetBase {\n    metadata {\n      symbol\n    }\n    id\n  }\n  assetQuote {\n    metadata {\n      symbol\n    }\n    id\n  }\n  oracleBase {\n    id\n    price\n  }\n  oracleQuote {\n    id\n    price\n  }\n  book {\n    bids {\n      price\n    }\n    center\n    asks {\n      price\n    }\n    id\n  }\n  feeMaker\n  feeTaker\n}\n\nfragment HeaderTradeFragment on FinPair {\n  id\n  address\n  assetBase {\n    asset\n    type\n    chain\n    metadata {\n      symbol\n      decimals\n    }\n    price {\n      mcap\n      id\n    }\n    id\n  }\n  assetQuote {\n    asset\n    type\n    chain\n    metadata {\n      symbol\n      decimals\n    }\n    id\n  }\n  summary {\n    ...HeaderTradeSummaryFragment\n  }\n}\n\nfragment HeaderTradeSummaryFragment on FinSummary {\n  last\n  lastUsd\n  high\n  low\n  change\n  volumeUsd\n}\n\nfragment HistoryFragment on FinTradeEdge {\n  cursor\n  node {\n    id\n    ...HistoryItemFragment\n  }\n}\n\nfragment HistoryItemFragment on FinTrade {\n  type\n  quoteAmount\n  baseAmount\n  price\n  protocol\n  timestamp\n}\n\nfragment LimitSubmitFragment on FinPair {\n  address\n  tick\n  assetBase {\n    asset\n    type\n    chain\n    metadata {\n      decimals\n      symbol\n    }\n    price {\n      current\n      id\n    }\n    id\n  }\n  assetQuote {\n    asset\n    type\n    chain\n    metadata {\n      decimals\n      symbol\n    }\n    price {\n      current\n      id\n    }\n    id\n  }\n  oracleBase {\n    id\n    price\n  }\n  oracleQuote {\n    id\n    price\n  }\n  book {\n    bids {\n      price\n    }\n    center\n    asks {\n      price\n    }\n    id\n  }\n  feeMaker\n  feeTaker\n}\n\nfragment MarketSubmitFragment on FinPair {\n  address\n  tick\n  assetBase {\n    asset\n    type\n    chain\n    metadata {\n      decimals\n      symbol\n    }\n    price {\n      current\n      id\n    }\n    variants {\n      native {\n        denom\n      }\n    }\n    id\n  }\n  assetQuote {\n    asset\n    type\n    chain\n    metadata {\n      decimals\n      symbol\n    }\n    price {\n      current\n      id\n    }\n    variants {\n      native {\n        denom\n      }\n    }\n    id\n  }\n  book {\n    bids {\n      total\n      price\n      virtualValue\n      value\n    }\n    center\n    asks {\n      total\n      price\n      virtualValue\n      value\n    }\n    id\n  }\n  feeMaker\n  feeTaker\n}\n\nfragment OracleSubmitFragment on FinPair {\n  address\n  tick\n  assetBase {\n    asset\n    type\n    chain\n    metadata {\n      decimals\n      symbol\n    }\n    price {\n      current\n      id\n    }\n    id\n  }\n  assetQuote {\n    asset\n    type\n    chain\n    metadata {\n      decimals\n      symbol\n    }\n    price {\n      current\n      id\n    }\n    id\n  }\n  oracleBase {\n    id\n    price\n  }\n  oracleQuote {\n    id\n    price\n  }\n  book {\n    bids {\n      price\n    }\n    center\n    asks {\n      price\n    }\n    id\n  }\n  feeMaker\n  feeTaker\n}\n\nfragment OrderBookEntryFragment on FinBookEntry {\n  price\n  side\n  total\n  value\n  virtualTotal\n  virtualValue\n}\n\nfragment OrderBookFragment_2ob4IK on FinBookV2 {\n  id\n  pair {\n    address\n    assetBase {\n      asset\n      metadata {\n        symbol\n        decimals\n      }\n      id\n    }\n    assetQuote {\n      asset\n      metadata {\n        symbol\n        decimals\n      }\n      price {\n        current\n        id\n      }\n      id\n    }\n    tick\n    id\n  }\n  ...OrderBookSubFragment_2ob4IK\n}\n\nfragment OrderBookSubFragment_2ob4IK on FinBookV2 {\n  id\n  center\n  spread\n  bids(first: 100, truncate: $truncate) {\n    edges {\n      node {\n        value\n        price\n        total\n        virtualTotal\n        virtualValue\n        ...OrderBookEntryFragment\n      }\n    }\n  }\n  asks(first: 100, truncate: $truncate) {\n    edges {\n      node {\n        value\n        price\n        total\n        virtualTotal\n        virtualValue\n        ...OrderBookEntryFragment\n      }\n    }\n  }\n}\n\nfragment RangeDepositFragment on FinPair {\n  assetBase {\n    asset\n    type\n    chain\n    metadata {\n      decimals\n      symbol\n    }\n    price {\n      current\n      id\n    }\n    variants {\n      native {\n        denom\n      }\n    }\n    id\n  }\n  assetQuote {\n    asset\n    type\n    chain\n    metadata {\n      decimals\n      symbol\n    }\n    price {\n      current\n      id\n    }\n    variants {\n      native {\n        denom\n      }\n    }\n    id\n  }\n}\n\nfragment RangeFragment on FinPair {\n  id\n  tick\n  bookV2 {\n    id\n    center\n    bestAsk: asks(first: 1) {\n      edges {\n        node {\n          price\n        }\n      }\n    }\n    bestBid: bids(first: 1) {\n      edges {\n        node {\n          price\n        }\n      }\n    }\n  }\n  candles(after: $rangeAfter, before: $rangeBefore, last: 90, resolution: \"1D\") {\n    edges {\n      node {\n        close\n        high\n        low\n        id\n      }\n    }\n  }\n}\n\nfragment RangeInputsFragment on FinPair {\n  ...RangeDepositFragment\n}\n\nfragment RecurringSubmitFragment on FinPair {\n  address\n  tick\n  assetBase {\n    asset\n    metadata {\n      symbol\n      decimals\n    }\n    type\n    chain\n    price {\n      current\n      id\n    }\n    variants {\n      native {\n        denom\n      }\n      secured {\n        asset\n        type\n        chain\n        metadata {\n          decimals\n          symbol\n        }\n        variants {\n          native {\n            denom\n          }\n        }\n        id\n      }\n    }\n    id\n  }\n  assetQuote {\n    asset\n    metadata {\n      symbol\n      decimals\n    }\n    type\n    chain\n    price {\n      current\n      id\n    }\n    variants {\n      native {\n        denom\n      }\n      secured {\n        asset\n        type\n        chain\n        metadata {\n          decimals\n          symbol\n        }\n        variants {\n          native {\n            denom\n          }\n        }\n        id\n      }\n    }\n    id\n  }\n  book {\n    bids {\n      total\n      price\n      value\n    }\n    center\n    asks {\n      total\n      price\n      value\n    }\n    id\n  }\n  feeTaker\n}\n\nfragment SubmitFragment on FinPair {\n  assetBase {\n    chain\n    asset\n    type\n    metadata {\n      symbol\n      decimals\n    }\n    id\n  }\n  assetQuote {\n    chain\n    asset\n    type\n    metadata {\n      symbol\n      decimals\n    }\n    id\n  }\n  oracleBase {\n    id\n  }\n  oracleQuote {\n    id\n  }\n  ...ClassicSubmitFragment\n}\n\nfragment msgAssetFragment on Asset {\n  type\n  chain\n  asset\n  metadata {\n    decimals\n    symbol\n  }\n  variants {\n    native {\n      denom\n    }\n    secured {\n      type\n      chain\n      asset\n      metadata {\n        decimals\n        symbol\n      }\n      variants {\n        native {\n          denom\n        }\n      }\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "d7b1e1d1b2f936d74edeb348d07379b1";

export default node;
