/**
 * @generated SignedSource<<2ee255c1198e06a8847bbb372631d7cc>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type FinRangeStatus = "CLOSED" | "OPEN" | "%future added value";
export type AlgorithmicLeaderboardQuery$variables = {
  contracts?: ReadonlyArray<string> | null | undefined;
  count: number;
  status: FinRangeStatus;
};
export type AlgorithmicLeaderboardQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"AlgorithmicLeaderboard_query">;
};
export type AlgorithmicLeaderboardQuery = {
  response: AlgorithmicLeaderboardQuery$data;
  variables: AlgorithmicLeaderboardQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "contracts"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "count"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "status"
},
v3 = {
  "kind": "Variable",
  "name": "contracts",
  "variableName": "contracts"
},
v4 = {
  "kind": "Variable",
  "name": "status",
  "variableName": "status"
},
v5 = [
  (v3/*: any*/),
  {
    "kind": "Variable",
    "name": "first",
    "variableName": "count"
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
  (v4/*: any*/)
],
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
  "name": "type",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "chain",
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
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "AlgorithmicLeaderboardQuery",
    "selections": [
      {
        "args": [
          (v3/*: any*/),
          {
            "kind": "Variable",
            "name": "count",
            "variableName": "count"
          },
          (v4/*: any*/)
        ],
        "kind": "FragmentSpread",
        "name": "AlgorithmicLeaderboard_query"
      }
    ],
    "type": "RootQueryType",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v2/*: any*/),
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "AlgorithmicLeaderboardQuery",
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
            "alias": null,
            "args": (v5/*: any*/),
            "concreteType": "FinRangeConnection",
            "kind": "LinkedField",
            "name": "ranges",
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
                      (v6/*: any*/),
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
                              (v7/*: any*/),
                              (v8/*: any*/),
                              (v9/*: any*/),
                              (v10/*: any*/),
                              (v6/*: any*/)
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
                              (v7/*: any*/),
                              (v8/*: any*/),
                              (v9/*: any*/),
                              (v10/*: any*/),
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
                              },
                              (v6/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v6/*: any*/)
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
                          },
                          (v6/*: any*/)
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
          },
          {
            "alias": null,
            "args": (v5/*: any*/),
            "filters": [
              "contracts",
              "status",
              "sortBy",
              "sortDir"
            ],
            "handle": "connection",
            "key": "AlgorithmicLeaderboard_ranges",
            "kind": "LinkedHandle",
            "name": "ranges"
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "6d7c83792dc2d6f011ad243420bed283",
    "id": null,
    "metadata": {},
    "name": "AlgorithmicLeaderboardQuery",
    "operationKind": "query",
    "text": "query AlgorithmicLeaderboardQuery(\n  $status: FinRangeStatus!\n  $count: Int!\n  $contracts: [Address!]\n) {\n  ...AlgorithmicLeaderboard_query_19uwlr\n}\n\nfragment AlgorithmicLeaderboard_query_19uwlr on RootQueryType {\n  finV3 {\n    ranges(first: $count, contracts: $contracts, status: $status, sortBy: APR, sortDir: DESC) {\n      edges {\n        node {\n          id\n          owner\n          high\n          low\n          price\n          spread\n          fee\n          valueUsd\n          rewardStrategy\n          tightnessFactor\n          pair {\n            assetBase {\n              asset\n              type\n              chain\n              metadata {\n                symbol\n                decimals\n              }\n              id\n            }\n            assetQuote {\n              asset\n              type\n              chain\n              metadata {\n                symbol\n                decimals\n              }\n              price {\n                current\n                id\n              }\n              id\n            }\n            id\n          }\n          analytics {\n            weightedAverageInvestmentAgeDays\n            apr\n            moic\n            dpi\n            id\n          }\n          __typename\n        }\n        cursor\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "6dccfea774fd2f750d8d68389843fbfc";

export default node;
