/**
 * @generated SignedSource<<d4e7d7ede82edeb8f5c6a3f3c8481527>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type FinRangeStatus = "CLOSED" | "OPEN" | "%future added value";
export type AlgorithmicLeaderboardPaginationQuery$variables = {
  contracts?: ReadonlyArray<string> | null | undefined;
  count: number;
  cursor?: string | null | undefined;
  status: FinRangeStatus;
};
export type AlgorithmicLeaderboardPaginationQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"AlgorithmicLeaderboard_query">;
};
export type AlgorithmicLeaderboardPaginationQuery = {
  response: AlgorithmicLeaderboardPaginationQuery$data;
  variables: AlgorithmicLeaderboardPaginationQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
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
v1 = {
  "kind": "Variable",
  "name": "contracts",
  "variableName": "contracts"
},
v2 = {
  "kind": "Variable",
  "name": "status",
  "variableName": "status"
},
v3 = [
  {
    "kind": "Variable",
    "name": "after",
    "variableName": "cursor"
  },
  (v1/*: any*/),
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
  (v2/*: any*/)
],
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
  "kind": "ScalarField",
  "name": "type",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "chain",
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "AlgorithmicLeaderboardPaginationQuery",
    "selections": [
      {
        "args": [
          (v1/*: any*/),
          {
            "kind": "Variable",
            "name": "count",
            "variableName": "count"
          },
          {
            "kind": "Variable",
            "name": "cursor",
            "variableName": "cursor"
          },
          (v2/*: any*/)
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "AlgorithmicLeaderboardPaginationQuery",
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
            "args": (v3/*: any*/),
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
                      (v4/*: any*/),
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
                              (v5/*: any*/),
                              (v6/*: any*/),
                              (v7/*: any*/),
                              (v8/*: any*/),
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
                              (v5/*: any*/),
                              (v6/*: any*/),
                              (v7/*: any*/),
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
                                    "name": "current",
                                    "storageKey": null
                                  },
                                  (v4/*: any*/)
                                ],
                                "storageKey": null
                              },
                              (v4/*: any*/)
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
                          (v4/*: any*/)
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
            "args": (v3/*: any*/),
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
    "cacheID": "47802a72ddc7015a5967465b0e80270a",
    "id": null,
    "metadata": {},
    "name": "AlgorithmicLeaderboardPaginationQuery",
    "operationKind": "query",
    "text": "query AlgorithmicLeaderboardPaginationQuery(\n  $contracts: [Address!]\n  $count: Int!\n  $cursor: String\n  $status: FinRangeStatus!\n) {\n  ...AlgorithmicLeaderboard_query_khFjq\n}\n\nfragment AlgorithmicLeaderboard_query_khFjq on RootQueryType {\n  finV3 {\n    ranges(first: $count, after: $cursor, contracts: $contracts, status: $status, sortBy: APR, sortDir: DESC) {\n      edges {\n        node {\n          id\n          owner\n          high\n          low\n          price\n          spread\n          fee\n          valueUsd\n          rewardStrategy\n          tightnessFactor\n          pair {\n            assetBase {\n              asset\n              type\n              chain\n              metadata {\n                symbol\n                decimals\n              }\n              id\n            }\n            assetQuote {\n              asset\n              type\n              chain\n              metadata {\n                symbol\n                decimals\n              }\n              price {\n                current\n                id\n              }\n              id\n            }\n            id\n          }\n          analytics {\n            weightedAverageInvestmentAgeDays\n            apr\n            moic\n            dpi\n            id\n          }\n          __typename\n        }\n        cursor\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "cf48c42bbd053ab2c3f13ed3e8856a4e";

export default node;
