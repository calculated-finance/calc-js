/**
 * @generated SignedSource<<3c5a61c74087ec0aecf5294f7b7a3677>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type ChartQuery$variables = {
  first: number;
  from: any;
  id: string;
  resolution: any;
  to: any;
};
export type ChartQuery$data = {
  readonly node: {
    readonly config?: {
      readonly quoteAsset: {
        readonly metadata: {
          readonly symbol: string;
        };
      };
    };
    readonly id?: string;
    readonly navBins?: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly bin: any;
          readonly open: bigint;
          readonly tvl: bigint;
        } | null | undefined;
      } | null | undefined> | null | undefined;
    } | null | undefined;
    readonly shareAsset?: {
      readonly metadata: {
        readonly symbol: string;
      };
    };
    readonly status?: {
      readonly nav: bigint;
      readonly navChange: bigint | null | undefined;
      readonly navPerShare: bigint;
      readonly navPerShareChange: bigint | null | undefined;
      readonly redemptionRate: bigint;
    };
  } | null | undefined;
};
export type ChartQuery = {
  response: ChartQuery$data;
  variables: ChartQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "first"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "from"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "id"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "resolution"
},
v4 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "to"
},
v5 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
  }
],
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v7 = [
  {
    "kind": "Variable",
    "name": "first",
    "variableName": "first"
  },
  {
    "kind": "Variable",
    "name": "from",
    "variableName": "from"
  },
  {
    "kind": "Variable",
    "name": "resolution",
    "variableName": "resolution"
  },
  {
    "kind": "Variable",
    "name": "to",
    "variableName": "to"
  }
],
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "bin",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "open",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "tvl",
  "storageKey": null
},
v11 = {
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
v12 = [
  (v11/*: any*/)
],
v13 = {
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
      "kind": "ScalarField",
      "name": "nav",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "navPerShare",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "navPerShareChange",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "navChange",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "redemptionRate",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v14 = [
  (v11/*: any*/),
  (v6/*: any*/)
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/),
      (v4/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "ChartQuery",
    "selections": [
      {
        "alias": null,
        "args": (v5/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          {
            "kind": "InlineFragment",
            "selections": [
              (v6/*: any*/),
              {
                "alias": null,
                "args": (v7/*: any*/),
                "concreteType": "IndexNavBinConnection",
                "kind": "LinkedField",
                "name": "navBins",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "IndexNavBinEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "IndexNavBin",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          (v8/*: any*/),
                          (v9/*: any*/),
                          (v10/*: any*/)
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
                "concreteType": "Asset",
                "kind": "LinkedField",
                "name": "shareAsset",
                "plural": false,
                "selections": (v12/*: any*/),
                "storageKey": null
              },
              (v13/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "IndexConfig",
                "kind": "LinkedField",
                "name": "config",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Asset",
                    "kind": "LinkedField",
                    "name": "quoteAsset",
                    "plural": false,
                    "selections": (v12/*: any*/),
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "type": "IndexVault",
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
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v4/*: any*/),
      (v3/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Operation",
    "name": "ChartQuery",
    "selections": [
      {
        "alias": null,
        "args": (v5/*: any*/),
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
          (v6/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": (v7/*: any*/),
                "concreteType": "IndexNavBinConnection",
                "kind": "LinkedField",
                "name": "navBins",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "IndexNavBinEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "IndexNavBin",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          (v8/*: any*/),
                          (v9/*: any*/),
                          (v10/*: any*/),
                          (v6/*: any*/)
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
                "concreteType": "Asset",
                "kind": "LinkedField",
                "name": "shareAsset",
                "plural": false,
                "selections": (v14/*: any*/),
                "storageKey": null
              },
              (v13/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "IndexConfig",
                "kind": "LinkedField",
                "name": "config",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Asset",
                    "kind": "LinkedField",
                    "name": "quoteAsset",
                    "plural": false,
                    "selections": (v14/*: any*/),
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "type": "IndexVault",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "aaa1770a3b46d026cb2e6a31270277c3",
    "id": null,
    "metadata": {},
    "name": "ChartQuery",
    "operationKind": "query",
    "text": "query ChartQuery(\n  $first: Int!\n  $from: Timestamp!\n  $to: Timestamp!\n  $resolution: Resolution!\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    ... on IndexVault {\n      id\n      navBins(first: $first, from: $from, to: $to, resolution: $resolution) {\n        edges {\n          node {\n            bin\n            open\n            tvl\n            id\n          }\n        }\n      }\n      shareAsset {\n        metadata {\n          symbol\n        }\n        id\n      }\n      status {\n        nav\n        navPerShare\n        navPerShareChange\n        navChange\n        redemptionRate\n      }\n      config {\n        quoteAsset {\n          metadata {\n            symbol\n          }\n          id\n        }\n      }\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "81136750b95557c2afb8b276d1523f63";

export default node;
