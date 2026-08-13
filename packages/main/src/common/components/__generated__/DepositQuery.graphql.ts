/**
 * @generated SignedSource<<ffb2bea90e0b02ef9d970f44f7cc270c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type AssetType = "LAYER_1" | "NATIVE" | "SECURED" | "SYNTH" | "%future added value";
export type Chain = "AVAX" | "BASE" | "BCH" | "BSC" | "BTC" | "DOGE" | "ETH" | "GAIA" | "KUJI" | "LTC" | "NOBLE" | "OSMO" | "SOL" | "TERRA" | "TERRA2" | "THOR" | "TON" | "TRON" | "TRON" | "XRP" | "%future added value";
export type ThorchainPoolStatus = "AVAILABLE" | "STAGED" | "SUSPENDED" | "UNKNOWN" | "%future added value";
export type DepositQuery$variables = Record<PropertyKey, never>;
export type DepositQuery$data = {
  readonly thorchainV2: {
    readonly inboundAddresses: ReadonlyArray<{
      readonly chain: Chain;
      readonly dustThreshold: bigint;
    }>;
    readonly pools: ReadonlyArray<{
      readonly asset: {
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
      readonly status: ThorchainPoolStatus;
    }>;
  } | null | undefined;
};
export type DepositQuery = {
  response: DepositQuery$data;
  variables: DepositQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "status",
  "storageKey": null
},
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
  "kind": "ScalarField",
  "name": "current",
  "storageKey": null
},
v5 = {
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
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "dustThreshold",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "DepositQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "ThorchainV2",
        "kind": "LinkedField",
        "name": "thorchainV2",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "ThorchainPool",
            "kind": "LinkedField",
            "name": "pools",
            "plural": true,
            "selections": [
              (v0/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Asset",
                "kind": "LinkedField",
                "name": "asset",
                "plural": false,
                "selections": [
                  (v1/*: any*/),
                  (v2/*: any*/),
                  (v3/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Price",
                    "kind": "LinkedField",
                    "name": "price",
                    "plural": false,
                    "selections": [
                      (v4/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v5/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "ThorchainInboundAddress",
            "kind": "LinkedField",
            "name": "inboundAddresses",
            "plural": true,
            "selections": [
              (v6/*: any*/),
              (v3/*: any*/)
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
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "DepositQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "ThorchainV2",
        "kind": "LinkedField",
        "name": "thorchainV2",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "ThorchainPool",
            "kind": "LinkedField",
            "name": "pools",
            "plural": true,
            "selections": [
              (v0/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Asset",
                "kind": "LinkedField",
                "name": "asset",
                "plural": false,
                "selections": [
                  (v1/*: any*/),
                  (v2/*: any*/),
                  (v3/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Price",
                    "kind": "LinkedField",
                    "name": "price",
                    "plural": false,
                    "selections": [
                      (v4/*: any*/),
                      (v7/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v5/*: any*/),
                  (v7/*: any*/)
                ],
                "storageKey": null
              },
              (v7/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "ThorchainInboundAddress",
            "kind": "LinkedField",
            "name": "inboundAddresses",
            "plural": true,
            "selections": [
              (v6/*: any*/),
              (v3/*: any*/),
              (v7/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "b1db388d09255e73ec09d8746b89666d",
    "id": null,
    "metadata": {},
    "name": "DepositQuery",
    "operationKind": "query",
    "text": "query DepositQuery {\n  thorchainV2 {\n    pools {\n      status\n      asset {\n        asset\n        type\n        chain\n        price {\n          current\n          id\n        }\n        metadata {\n          symbol\n          decimals\n        }\n        id\n      }\n      id\n    }\n    inboundAddresses {\n      dustThreshold\n      chain\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "7d519516feb16d4145b9e6bda78b7bc0";

export default node;
