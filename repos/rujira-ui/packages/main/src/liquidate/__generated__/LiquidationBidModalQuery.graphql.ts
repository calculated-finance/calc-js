/**
 * @generated SignedSource<<3908d39e2a2c69de9e8c0a924b6fcc7b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type AssetType = "LAYER_1" | "NATIVE" | "SECURED" | "SYNTH" | "%future added value";
export type Chain = "AVAX" | "BASE" | "BCH" | "BSC" | "BTC" | "DOGE" | "ETH" | "GAIA" | "KUJI" | "LTC" | "NOBLE" | "OSMO" | "SOL" | "TERRA" | "TERRA2" | "THOR" | "TON" | "TRON" | "TRON" | "XRP" | "%future added value";
export type LiquidationBidModalQuery$variables = {
  id: string;
};
export type LiquidationBidModalQuery$data = {
  readonly pair: {
    readonly __typename: "FinPair";
    readonly address: string;
    readonly assetBase: {
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
    readonly oracleBase: {
      readonly id: string;
      readonly price: bigint;
    } | null | undefined;
    readonly oracleQuote: {
      readonly id: string;
      readonly price: bigint;
    } | null | undefined;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  } | null | undefined;
};
export type LiquidationBidModalQuery = {
  response: LiquidationBidModalQuery$data;
  variables: LiquidationBidModalQuery$variables;
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
  "name": "address",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "asset",
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
  "name": "chain",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "current",
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
},
v9 = [
  (v4/*: any*/),
  (v5/*: any*/),
  (v6/*: any*/),
  {
    "alias": null,
    "args": null,
    "concreteType": "Price",
    "kind": "LinkedField",
    "name": "price",
    "plural": false,
    "selections": [
      (v7/*: any*/)
    ],
    "storageKey": null
  },
  (v8/*: any*/)
],
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v11 = [
  (v10/*: any*/),
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "price",
    "storageKey": null
  }
],
v12 = {
  "alias": null,
  "args": null,
  "concreteType": "ThorchainOracle",
  "kind": "LinkedField",
  "name": "oracleBase",
  "plural": false,
  "selections": (v11/*: any*/),
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "concreteType": "ThorchainOracle",
  "kind": "LinkedField",
  "name": "oracleQuote",
  "plural": false,
  "selections": (v11/*: any*/),
  "storageKey": null
},
v14 = [
  (v4/*: any*/),
  (v5/*: any*/),
  (v6/*: any*/),
  {
    "alias": null,
    "args": null,
    "concreteType": "Price",
    "kind": "LinkedField",
    "name": "price",
    "plural": false,
    "selections": [
      (v7/*: any*/),
      (v10/*: any*/)
    ],
    "storageKey": null
  },
  (v8/*: any*/),
  (v10/*: any*/)
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "LiquidationBidModalQuery",
    "selections": [
      {
        "alias": "pair",
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
              (v3/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Asset",
                "kind": "LinkedField",
                "name": "assetBase",
                "plural": false,
                "selections": (v9/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "Asset",
                "kind": "LinkedField",
                "name": "assetQuote",
                "plural": false,
                "selections": (v9/*: any*/),
                "storageKey": null
              },
              (v12/*: any*/),
              (v13/*: any*/)
            ],
            "type": "FinPair",
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
    "name": "LiquidationBidModalQuery",
    "selections": [
      {
        "alias": "pair",
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
              (v3/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Asset",
                "kind": "LinkedField",
                "name": "assetBase",
                "plural": false,
                "selections": (v14/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "Asset",
                "kind": "LinkedField",
                "name": "assetQuote",
                "plural": false,
                "selections": (v14/*: any*/),
                "storageKey": null
              },
              (v12/*: any*/),
              (v13/*: any*/)
            ],
            "type": "FinPair",
            "abstractKey": null
          },
          (v10/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "8a33120476524c53cdc79f192acd885e",
    "id": null,
    "metadata": {},
    "name": "LiquidationBidModalQuery",
    "operationKind": "query",
    "text": "query LiquidationBidModalQuery(\n  $id: ID!\n) {\n  pair: node(id: $id) {\n    __typename\n    ... on FinPair {\n      address\n      assetBase {\n        asset\n        type\n        chain\n        price {\n          current\n          id\n        }\n        metadata {\n          symbol\n          decimals\n        }\n        id\n      }\n      assetQuote {\n        asset\n        type\n        chain\n        price {\n          current\n          id\n        }\n        metadata {\n          symbol\n          decimals\n        }\n        id\n      }\n      oracleBase {\n        id\n        price\n      }\n      oracleQuote {\n        id\n        price\n      }\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "10762a6cb7032cd58f13248954302016";

export default node;
