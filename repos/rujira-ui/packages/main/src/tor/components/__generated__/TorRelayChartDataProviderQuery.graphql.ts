/**
 * @generated SignedSource<<22044954b61b741bb4a4303d19a8af4d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type TorRelayChartDataProviderQuery$variables = {
  after: string;
  before: string;
  pair: string;
  resolution: string;
};
export type TorRelayChartDataProviderQuery$data = {
  readonly node: {
    readonly asset?: {
      readonly asset: string;
    };
    readonly candles?: {
      readonly __id: string;
      readonly edges: ReadonlyArray<{
        readonly cursor: string | null | undefined;
        readonly node: {
          readonly bin: any;
          readonly close: bigint;
          readonly high: bigint;
          readonly id: string;
          readonly low: bigint;
          readonly open: bigint;
        } | null | undefined;
      } | null | undefined> | null | undefined;
    };
  } | null | undefined;
};
export type TorRelayChartDataProviderQuery = {
  response: TorRelayChartDataProviderQuery$data;
  variables: TorRelayChartDataProviderQuery$variables;
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
  "name": "pair"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "resolution"
},
v4 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "pair"
  }
],
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
  "name": "id",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": [
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
      "name": "resolution",
      "variableName": "resolution"
    }
  ],
  "concreteType": "ThorchainTorCandleConnection",
  "kind": "LinkedField",
  "name": "candles",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "ThorchainTorCandleEdge",
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
          "concreteType": "ThorchainTorCandle",
          "kind": "LinkedField",
          "name": "node",
          "plural": false,
          "selections": [
            (v6/*: any*/),
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "open",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "close",
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
              "name": "bin",
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
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
    }
  ],
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "TorRelayChartDataProviderQuery",
    "selections": [
      {
        "alias": null,
        "args": (v4/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
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
                  (v5/*: any*/)
                ],
                "storageKey": null
              },
              (v7/*: any*/)
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
    "argumentDefinitions": [
      (v2/*: any*/),
      (v0/*: any*/),
      (v1/*: any*/),
      (v3/*: any*/)
    ],
    "kind": "Operation",
    "name": "TorRelayChartDataProviderQuery",
    "selections": [
      {
        "alias": null,
        "args": (v4/*: any*/),
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
                  (v6/*: any*/)
                ],
                "storageKey": null
              },
              (v7/*: any*/)
            ],
            "type": "ThorchainPool",
            "abstractKey": null
          },
          (v6/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "39aede11ce98e639a08ab73d58a049e1",
    "id": null,
    "metadata": {},
    "name": "TorRelayChartDataProviderQuery",
    "operationKind": "query",
    "text": "query TorRelayChartDataProviderQuery(\n  $pair: ID!\n  $after: String!\n  $before: String!\n  $resolution: String!\n) {\n  node(id: $pair) {\n    __typename\n    ... on ThorchainPool {\n      asset {\n        asset\n        id\n      }\n      candles(after: $after, before: $before, resolution: $resolution) {\n        edges {\n          cursor\n          node {\n            id\n            open\n            close\n            high\n            low\n            bin\n          }\n        }\n      }\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "5d0c7f4db4e8ec2ff3af3e0e0fe99425";

export default node;
