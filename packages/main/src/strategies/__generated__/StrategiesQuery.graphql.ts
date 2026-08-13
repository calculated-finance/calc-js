/**
 * @generated SignedSource<<a568129d917d6a8b7ecd146fde1b266a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type SortDir = "ASC" | "DESC" | "%future added value";
export type StrategySortBy = "APR" | "NAME" | "TVL" | "%future added value";
export type StrategiesQuery$variables = {
  after?: string | null | undefined;
  before?: string | null | undefined;
  first?: number | null | undefined;
  last?: number | null | undefined;
  query?: string | null | undefined;
  sortBy?: StrategySortBy | null | undefined;
  sortDir?: SortDir | null | undefined;
  typenames?: ReadonlyArray<string> | null | undefined;
};
export type StrategiesQuery$data = {
  readonly strategies: {
    readonly edges: ReadonlyArray<{
      readonly cursor: string | null | undefined;
      readonly node: {
        readonly __typename: "BowPoolXyk";
        readonly " $fragmentSpreads": FragmentRefs<"BowPoolXykRowFragment">;
      } | {
        readonly __typename: "GhostVault";
        readonly " $fragmentSpreads": FragmentRefs<"GhostVaultRowFragment">;
      } | {
        readonly __typename: "IndexVault";
        readonly " $fragmentSpreads": FragmentRefs<"IndexVaultRowFragment">;
      } | {
        readonly __typename: "StakingPool";
        readonly " $fragmentSpreads": FragmentRefs<"StakingPoolRowFragment">;
      } | {
        readonly __typename: "ThorchainPool";
        readonly " $fragmentSpreads": FragmentRefs<"ThorchainPoolRowFragment">;
      } | {
        // This will never be '%other', but we need some
        // value in case none of the concrete values match.
        readonly __typename: "%other";
      } | null | undefined;
    } | null | undefined> | null | undefined;
    readonly pageInfo: {
      readonly endCursor: string | null | undefined;
      readonly hasNextPage: boolean;
      readonly hasPreviousPage: boolean;
      readonly startCursor: string | null | undefined;
    };
  };
};
export type StrategiesQuery = {
  response: StrategiesQuery$data;
  variables: StrategiesQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "after"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "before"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "first"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "last"
},
v4 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "query"
},
v5 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "sortBy"
},
v6 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "sortDir"
},
v7 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "typenames"
},
v8 = [
  {
    "kind": "Variable",
    "name": "after",
    "variableName": "after"
  },
  {
    "kind": "Variable",
    "name": "before",
    "variableName": "before"
  },
  {
    "kind": "Variable",
    "name": "first",
    "variableName": "first"
  },
  {
    "kind": "Variable",
    "name": "last",
    "variableName": "last"
  },
  {
    "kind": "Variable",
    "name": "query",
    "variableName": "query"
  },
  {
    "kind": "Variable",
    "name": "sortBy",
    "variableName": "sortBy"
  },
  {
    "kind": "Variable",
    "name": "sortDir",
    "variableName": "sortDir"
  },
  {
    "kind": "Variable",
    "name": "typenames",
    "variableName": "typenames"
  }
],
v9 = {
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
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "hasPreviousPage",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "startCursor",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "cursor",
  "storageKey": null
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
  "name": "id",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "chain",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "type",
  "storageKey": null
},
v15 = {
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
},
v16 = {
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
    (v12/*: any*/)
  ],
  "storageKey": null
},
v17 = [
  (v13/*: any*/),
  (v14/*: any*/),
  (v15/*: any*/),
  (v16/*: any*/),
  (v12/*: any*/)
],
v18 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "asset",
  "storageKey": null
},
v19 = [
  (v15/*: any*/),
  (v12/*: any*/)
],
v20 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "value",
  "storageKey": null
},
v21 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "status",
  "storageKey": null
},
v22 = {
  "alias": null,
  "args": null,
  "concreteType": "Apr",
  "kind": "LinkedField",
  "name": "apr",
  "plural": false,
  "selections": [
    (v20/*: any*/),
    (v21/*: any*/)
  ],
  "storageKey": null
},
v23 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "valueUsd",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/),
      (v4/*: any*/),
      (v5/*: any*/),
      (v6/*: any*/),
      (v7/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "StrategiesQuery",
    "selections": [
      {
        "alias": null,
        "args": (v8/*: any*/),
        "concreteType": "StrategyConnection",
        "kind": "LinkedField",
        "name": "strategies",
        "plural": false,
        "selections": [
          (v9/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "StrategyEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              (v10/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": null,
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v11/*: any*/),
                  {
                    "kind": "InlineFragment",
                    "selections": [
                      {
                        "args": null,
                        "kind": "FragmentSpread",
                        "name": "BowPoolXykRowFragment"
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
                        "name": "ThorchainPoolRowFragment"
                      }
                    ],
                    "type": "ThorchainPool",
                    "abstractKey": null
                  },
                  {
                    "kind": "InlineFragment",
                    "selections": [
                      {
                        "args": null,
                        "kind": "FragmentSpread",
                        "name": "IndexVaultRowFragment"
                      }
                    ],
                    "type": "IndexVault",
                    "abstractKey": null
                  },
                  {
                    "kind": "InlineFragment",
                    "selections": [
                      {
                        "args": null,
                        "kind": "FragmentSpread",
                        "name": "StakingPoolRowFragment"
                      }
                    ],
                    "type": "StakingPool",
                    "abstractKey": null
                  },
                  {
                    "kind": "InlineFragment",
                    "selections": [
                      {
                        "args": null,
                        "kind": "FragmentSpread",
                        "name": "GhostVaultRowFragment"
                      }
                    ],
                    "type": "GhostVault",
                    "abstractKey": null
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
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v2/*: any*/),
      (v3/*: any*/),
      (v4/*: any*/),
      (v7/*: any*/),
      (v0/*: any*/),
      (v1/*: any*/),
      (v5/*: any*/),
      (v6/*: any*/)
    ],
    "kind": "Operation",
    "name": "StrategiesQuery",
    "selections": [
      {
        "alias": null,
        "args": (v8/*: any*/),
        "concreteType": "StrategyConnection",
        "kind": "LinkedField",
        "name": "strategies",
        "plural": false,
        "selections": [
          (v9/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "StrategyEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              (v10/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": null,
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v11/*: any*/),
                  {
                    "kind": "InlineFragment",
                    "selections": [
                      (v12/*: any*/),
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
                            "selections": (v17/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Asset",
                            "kind": "LinkedField",
                            "name": "y",
                            "plural": false,
                            "selections": (v17/*: any*/),
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
                      (v12/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Asset",
                        "kind": "LinkedField",
                        "name": "asset",
                        "plural": false,
                        "selections": [
                          (v12/*: any*/),
                          (v18/*: any*/),
                          (v14/*: any*/),
                          (v13/*: any*/),
                          (v15/*: any*/),
                          (v16/*: any*/)
                        ],
                        "storageKey": null
                      },
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
                      }
                    ],
                    "type": "ThorchainPool",
                    "abstractKey": null
                  },
                  {
                    "kind": "InlineFragment",
                    "selections": [
                      (v12/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Asset",
                        "kind": "LinkedField",
                        "name": "shareAsset",
                        "plural": false,
                        "selections": (v19/*: any*/),
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "IndexStatus",
                        "kind": "LinkedField",
                        "name": "status",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "IndexAllocation",
                            "kind": "LinkedField",
                            "name": "allocations",
                            "plural": true,
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "Asset",
                                "kind": "LinkedField",
                                "name": "asset",
                                "plural": false,
                                "selections": (v19/*: any*/),
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "balance",
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "nav",
                            "storageKey": null
                          },
                          (v22/*: any*/)
                        ],
                        "storageKey": null
                      }
                    ],
                    "type": "IndexVault",
                    "abstractKey": null
                  },
                  {
                    "kind": "InlineFragment",
                    "selections": [
                      (v12/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Asset",
                        "kind": "LinkedField",
                        "name": "bondAsset",
                        "plural": false,
                        "selections": (v19/*: any*/),
                        "storageKey": null
                      },
                      {
                        "alias": "stakingStatus",
                        "args": null,
                        "concreteType": "StakingStatus",
                        "kind": "LinkedField",
                        "name": "status",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "accountBond",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "liquidBondSize",
                            "storageKey": null
                          },
                          (v23/*: any*/),
                          (v12/*: any*/)
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": "stakingSummary",
                        "args": null,
                        "concreteType": "StakingSummary",
                        "kind": "LinkedField",
                        "name": "summary",
                        "plural": false,
                        "selections": [
                          (v22/*: any*/),
                          (v12/*: any*/)
                        ],
                        "storageKey": null
                      }
                    ],
                    "type": "StakingPool",
                    "abstractKey": null
                  },
                  {
                    "kind": "InlineFragment",
                    "selections": [
                      (v12/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Asset",
                        "kind": "LinkedField",
                        "name": "asset",
                        "plural": false,
                        "selections": [
                          (v18/*: any*/),
                          (v14/*: any*/),
                          (v13/*: any*/),
                          (v15/*: any*/),
                          (v12/*: any*/)
                        ],
                        "storageKey": null
                      },
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
                            "concreteType": "GhostVaultPool",
                            "kind": "LinkedField",
                            "name": "depositPool",
                            "plural": false,
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "size",
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          },
                          (v23/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Apr",
                            "kind": "LinkedField",
                            "name": "apr",
                            "plural": false,
                            "selections": [
                              (v21/*: any*/),
                              (v20/*: any*/)
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "type": "GhostVault",
                    "abstractKey": null
                  },
                  {
                    "kind": "InlineFragment",
                    "selections": [
                      (v12/*: any*/)
                    ],
                    "type": "Node",
                    "abstractKey": "__isNode"
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
    ]
  },
  "params": {
    "cacheID": "826a54058e4d42964d18c0bcc37f8cab",
    "id": null,
    "metadata": {},
    "name": "StrategiesQuery",
    "operationKind": "query",
    "text": "query StrategiesQuery(\n  $first: Int\n  $last: Int\n  $query: String\n  $typenames: [String!]\n  $after: String\n  $before: String\n  $sortBy: StrategySortBy\n  $sortDir: SortDir\n) {\n  strategies(first: $first, last: $last, query: $query, typenames: $typenames, sortBy: $sortBy, sortDir: $sortDir, after: $after, before: $before) {\n    pageInfo {\n      endCursor\n      hasNextPage\n      hasPreviousPage\n      startCursor\n    }\n    edges {\n      cursor\n      node {\n        __typename\n        ... on BowPoolXyk {\n          ...BowPoolXykRowFragment\n        }\n        ... on ThorchainPool {\n          ...ThorchainPoolRowFragment\n        }\n        ... on IndexVault {\n          ...IndexVaultRowFragment\n        }\n        ... on StakingPool {\n          ...StakingPoolRowFragment\n        }\n        ... on GhostVault {\n          ...GhostVaultRowFragment\n        }\n        ... on Node {\n          __isNode: __typename\n          id\n        }\n      }\n    }\n  }\n}\n\nfragment BowPoolXykRowFragment on BowPoolXyk {\n  id\n  config {\n    x {\n      chain\n      type\n      metadata {\n        symbol\n      }\n      price {\n        current\n        id\n      }\n      id\n    }\n    y {\n      chain\n      type\n      metadata {\n        symbol\n      }\n      price {\n        current\n        id\n      }\n      id\n    }\n    minQuote\n    fee\n  }\n  state {\n    x\n    y\n  }\n}\n\nfragment GhostVaultRowFragment on GhostVault {\n  id\n  asset {\n    asset\n    type\n    chain\n    metadata {\n      symbol\n    }\n    id\n  }\n  status {\n    depositPool {\n      size\n    }\n    valueUsd\n    apr {\n      status\n      value\n    }\n  }\n}\n\nfragment IndexVaultRowFragment on IndexVault {\n  id\n  shareAsset {\n    metadata {\n      symbol\n    }\n    id\n  }\n  status {\n    allocations {\n      asset {\n        metadata {\n          symbol\n        }\n        id\n      }\n      balance\n    }\n    nav\n    apr {\n      value\n      status\n    }\n  }\n}\n\nfragment StakingPoolRowFragment on StakingPool {\n  id\n  bondAsset {\n    metadata {\n      symbol\n    }\n    id\n  }\n  stakingStatus: status {\n    accountBond\n    liquidBondSize\n    valueUsd\n    id\n  }\n  stakingSummary: summary {\n    apr {\n      value\n      status\n    }\n    id\n  }\n}\n\nfragment ThorchainPoolRowFragment on ThorchainPool {\n  id\n  asset {\n    id\n    asset\n    type\n    chain\n    metadata {\n      symbol\n    }\n    price {\n      current\n      id\n    }\n  }\n  balanceAsset\n  balanceRune\n}\n"
  }
};
})();

(node as any).hash = "aa1b98d589fc75fa005634f69404c0f8";

export default node;
