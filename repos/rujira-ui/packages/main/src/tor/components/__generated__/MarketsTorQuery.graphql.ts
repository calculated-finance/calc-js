/**
 * @generated SignedSource<<dfe67698b8a2908fb0fc1122c749a154>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type MarketsTorQuery$variables = Record<PropertyKey, never>;
export type MarketsTorQuery$data = {
  readonly thorchainV2: {
    readonly pools: ReadonlyArray<{
      readonly asset: {
        readonly asset: string;
        readonly metadata: {
          readonly symbol: string;
        };
      };
      readonly " $fragmentSpreads": FragmentRefs<"MarketsTorItemFragment">;
    }>;
  } | null | undefined;
};
export type MarketsTorQuery = {
  response: MarketsTorQuery$data;
  variables: MarketsTorQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "asset",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "symbol",
  "storageKey": null
},
v2 = {
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
    "name": "MarketsTorQuery",
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
              {
                "alias": null,
                "args": null,
                "concreteType": "Asset",
                "kind": "LinkedField",
                "name": "asset",
                "plural": false,
                "selections": [
                  (v0/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Metadata",
                    "kind": "LinkedField",
                    "name": "metadata",
                    "plural": false,
                    "selections": [
                      (v1/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "MarketsTorItemFragment"
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
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "MarketsTorQuery",
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
              {
                "alias": null,
                "args": null,
                "concreteType": "Asset",
                "kind": "LinkedField",
                "name": "asset",
                "plural": false,
                "selections": [
                  (v0/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Metadata",
                    "kind": "LinkedField",
                    "name": "metadata",
                    "plural": false,
                    "selections": [
                      (v1/*: any*/),
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
                  (v2/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "type",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "chain",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              (v2/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "assetTorPrice",
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
    "cacheID": "9be76bdcd9d8279a1e984f0b94d7e9e2",
    "id": null,
    "metadata": {},
    "name": "MarketsTorQuery",
    "operationKind": "query",
    "text": "query MarketsTorQuery {\n  thorchainV2 {\n    pools {\n      asset {\n        asset\n        metadata {\n          symbol\n        }\n        id\n      }\n      ...MarketsTorItemFragment\n      id\n    }\n  }\n}\n\nfragment MarketsTorItemFragment on ThorchainPool {\n  id\n  asset {\n    asset\n    type\n    chain\n    metadata {\n      symbol\n      decimals\n    }\n    id\n  }\n  assetTorPrice\n}\n"
  }
};
})();

(node as any).hash = "0eb12df56c90c9085780a76e6e122c9f";

export default node;
