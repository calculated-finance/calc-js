/**
 * @generated SignedSource<<7b2c2ec38e94a2a33cb23b43d5d9a04d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type SwapThorchainQuery$variables = Record<PropertyKey, never>;
export type SwapThorchainQuery$data = {
  readonly thorchainV2: {
    readonly " $fragmentSpreads": FragmentRefs<"InputDestinationFragment">;
  } | null | undefined;
};
export type SwapThorchainQuery = {
  response: SwapThorchainQuery$data;
  variables: SwapThorchainQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v1 = {
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
    (v0/*: any*/)
  ],
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "decimals",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "asset",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "type",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "chain",
  "storageKey": null
},
v6 = {
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
    (v2/*: any*/)
  ],
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "SwapThorchainQuery",
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
            "args": null,
            "kind": "FragmentSpread",
            "name": "InputDestinationFragment"
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
    "name": "SwapThorchainQuery",
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
            "concreteType": "Asset",
            "kind": "LinkedField",
            "name": "rune",
            "plural": false,
            "selections": [
              (v1/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Metadata",
                "kind": "LinkedField",
                "name": "metadata",
                "plural": false,
                "selections": [
                  (v2/*: any*/)
                ],
                "storageKey": null
              },
              (v0/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "ThorchainPool",
            "kind": "LinkedField",
            "name": "pools",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "status",
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
                  (v4/*: any*/),
                  (v5/*: any*/),
                  (v1/*: any*/),
                  (v6/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "AssetVariants",
                    "kind": "LinkedField",
                    "name": "variants",
                    "plural": false,
                    "selections": [
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
                          (v3/*: any*/),
                          (v6/*: any*/),
                          (v1/*: any*/),
                          (v0/*: any*/)
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  (v0/*: any*/)
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "assetTorPrice",
                "storageKey": null
              },
              (v0/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "c7321f5944b291ffae1f4ef86a935465",
    "id": null,
    "metadata": {},
    "name": "SwapThorchainQuery",
    "operationKind": "query",
    "text": "query SwapThorchainQuery {\n  thorchainV2 {\n    ...InputDestinationFragment\n  }\n}\n\nfragment InputDestinationFragment on ThorchainV2 {\n  rune {\n    price {\n      current\n      id\n    }\n    metadata {\n      decimals\n    }\n    id\n  }\n  pools {\n    status\n    asset {\n      asset\n      type\n      chain\n      price {\n        current\n        id\n      }\n      metadata {\n        symbol\n        decimals\n      }\n      variants {\n        secured {\n          chain\n          type\n          asset\n          metadata {\n            symbol\n            decimals\n          }\n          price {\n            current\n            id\n          }\n          id\n        }\n      }\n      id\n    }\n    assetTorPrice\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "47e0d2eb9319da6194a26493c9a8fba3";

export default node;
