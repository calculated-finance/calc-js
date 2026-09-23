/**
 * @generated SignedSource<<4224dacd4c88d5329c80ebb8c43e9d15>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
export type AssetType = "LAYER_1" | "NATIVE" | "SECURED" | "SYNTH" | "%future added value";
export type Chain = "AVAX" | "BASE" | "BCH" | "BSC" | "BTC" | "DOGE" | "ETH" | "GAIA" | "KUJI" | "LTC" | "NOBLE" | "OSMO" | "SOL" | "TERRA" | "TERRA2" | "THOR" | "TON" | "TRON" | "TRON" | "XRP" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type AlgorithmicLeaderboard_query$data = {
  readonly finV3: {
    readonly ranges: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly analytics: {
            readonly apr: bigint;
            readonly dpi: bigint;
            readonly moic: bigint;
            readonly weightedAverageInvestmentAgeDays: number;
          } | null | undefined;
          readonly fee: bigint;
          readonly high: bigint;
          readonly id: string;
          readonly low: bigint;
          readonly owner: string;
          readonly pair: {
            readonly assetBase: {
              readonly asset: string;
              readonly chain: Chain;
              readonly metadata: {
                readonly decimals: number;
                readonly symbol: string;
              };
              readonly type: AssetType;
            };
            readonly assetQuote: {
              readonly asset: string;
              readonly chain: Chain;
              readonly metadata: {
                readonly decimals: number;
                readonly symbol: string;
              };
              readonly price: {
                readonly current: bigint | null | undefined;
              } | null | undefined;
              readonly type: AssetType;
            };
          };
          readonly price: bigint;
          readonly rewardStrategy: bigint | null | undefined;
          readonly spread: bigint;
          readonly tightnessFactor: bigint | null | undefined;
          readonly valueUsd: bigint;
        } | null | undefined;
      } | null | undefined> | null | undefined;
    } | null | undefined;
  };
  readonly " $fragmentType": "AlgorithmicLeaderboard_query";
};
export type AlgorithmicLeaderboard_query$key = {
  readonly " $data"?: AlgorithmicLeaderboard_query$data;
  readonly " $fragmentSpreads": FragmentRefs<"AlgorithmicLeaderboard_query">;
};

import AlgorithmicLeaderboardPaginationQuery_graphql from './AlgorithmicLeaderboardPaginationQuery.graphql';

const node: ReaderFragment = (function(){
var v0 = [
  "finV3",
  "ranges"
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "asset",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "type",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "chain",
  "storageKey": null
},
v4 = {
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
};
return {
  "argumentDefinitions": [
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "contracts"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "count"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "cursor"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "status"
    }
  ],
  "kind": "Fragment",
  "metadata": {
    "connection": [
      {
        "count": "count",
        "cursor": "cursor",
        "direction": "forward",
        "path": (v0/*: any*/)
      }
    ],
    "refetch": {
      "connection": {
        "forward": {
          "count": "count",
          "cursor": "cursor"
        },
        "backward": null,
        "path": (v0/*: any*/)
      },
      "fragmentPathInResult": [],
      "operation": AlgorithmicLeaderboardPaginationQuery_graphql
    }
  },
  "name": "AlgorithmicLeaderboard_query",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "FinV3",
      "kind": "LinkedField",
      "name": "finV3",
      "plural": false,
      "selections": [
        {
          "alias": "ranges",
          "args": [
            {
              "kind": "Variable",
              "name": "contracts",
              "variableName": "contracts"
            },
            {
              "kind": "Literal",
              "name": "sortBy",
              "value": "APR"
            },
            {
              "kind": "Literal",
              "name": "sortDir",
              "value": "DESC"
            },
            {
              "kind": "Variable",
              "name": "status",
              "variableName": "status"
            }
          ],
          "concreteType": "FinRangeConnection",
          "kind": "LinkedField",
          "name": "__AlgorithmicLeaderboard_ranges_connection",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "FinRangeEdge",
              "kind": "LinkedField",
              "name": "edges",
              "plural": true,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "FinRange",
                  "kind": "LinkedField",
                  "name": "node",
                  "plural": false,
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
                      "name": "owner",
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "high",
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "low",
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "price",
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "spread",
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "fee",
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
                      "kind": "ScalarField",
                      "name": "rewardStrategy",
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "tightnessFactor",
                      "storageKey": null
                    },
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
                            (v1/*: any*/),
                            (v2/*: any*/),
                            (v3/*: any*/),
                            (v4/*: any*/)
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
                            (v1/*: any*/),
                            (v2/*: any*/),
                            (v3/*: any*/),
                            (v4/*: any*/),
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
                      "concreteType": "FinRangePositionAnalytics",
                      "kind": "LinkedField",
                      "name": "analytics",
                      "plural": false,
                      "selections": [
                        {
                          "alias": null,
                          "args": null,
                          "kind": "ScalarField",
                          "name": "weightedAverageInvestmentAgeDays",
                          "storageKey": null
                        },
                        {
                          "alias": null,
                          "args": null,
                          "kind": "ScalarField",
                          "name": "apr",
                          "storageKey": null
                        },
                        {
                          "alias": null,
                          "args": null,
                          "kind": "ScalarField",
                          "name": "moic",
                          "storageKey": null
                        },
                        {
                          "alias": null,
                          "args": null,
                          "kind": "ScalarField",
                          "name": "dpi",
                          "storageKey": null
                        }
                      ],
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "__typename",
                      "storageKey": null
                    }
                  ],
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "cursor",
                  "storageKey": null
                }
              ],
              "storageKey": null
            },
            {
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
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "RootQueryType",
  "abstractKey": null
};
})();

(node as any).hash = "cf48c42bbd053ab2c3f13ed3e8856a4e";

export default node;
