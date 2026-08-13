/**
 * @generated SignedSource<<0aaa91c8d48174ff66a6d770bf9630cd>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type AssetType = "LAYER_1" | "NATIVE" | "SECURED" | "SYNTH" | "%future added value";
export type Chain = "AVAX" | "BASE" | "BCH" | "BSC" | "BTC" | "DOGE" | "ETH" | "GAIA" | "KUJI" | "LTC" | "NOBLE" | "OSMO" | "SOL" | "TERRA" | "TERRA2" | "THOR" | "TON" | "TRON" | "TRON" | "XRP" | "%future added value";
export type MergeQuery$variables = Record<PropertyKey, never>;
export type MergeQuery$data = {
  readonly merge: ReadonlyArray<{
    readonly address: string;
    readonly mergeAsset: {
      readonly asset: string;
      readonly chain: Chain;
      readonly metadata: {
        readonly decimals: number;
        readonly symbol: string;
      };
      readonly type: AssetType;
    };
    readonly " $fragmentSpreads": FragmentRefs<"ConvertStepFragment" | "DecayFragment" | "MergePoolFragment">;
  }>;
};
export type MergeQuery = {
  response: MergeQuery$data;
  variables: MergeQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "address",
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
  "concreteType": "Metadata",
  "kind": "LinkedField",
  "name": "metadata",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "decimals",
      "storageKey": null
    },
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
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "concreteType": "Denom",
  "kind": "LinkedField",
  "name": "native",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "denom",
      "storageKey": null
    }
  ],
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "MergeQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "MergePool",
        "kind": "LinkedField",
        "name": "merge",
        "plural": true,
        "selections": [
          (v0/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Asset",
            "kind": "LinkedField",
            "name": "mergeAsset",
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
            "args": null,
            "kind": "FragmentSpread",
            "name": "DecayFragment"
          },
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "MergePoolFragment"
          },
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "ConvertStepFragment"
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
    "name": "MergeQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "MergePool",
        "kind": "LinkedField",
        "name": "merge",
        "plural": true,
        "selections": [
          (v0/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Asset",
            "kind": "LinkedField",
            "name": "mergeAsset",
            "plural": false,
            "selections": [
              (v1/*: any*/),
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "AssetVariants",
                "kind": "LinkedField",
                "name": "variants",
                "plural": false,
                "selections": [
                  (v6/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Asset",
                    "kind": "LinkedField",
                    "name": "secured",
                    "plural": false,
                    "selections": [
                      (v2/*: any*/),
                      (v3/*: any*/),
                      (v1/*: any*/),
                      (v4/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "AssetVariants",
                        "kind": "LinkedField",
                        "name": "variants",
                        "plural": false,
                        "selections": [
                          (v6/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v5/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          (v5/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "startRate",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "currentRate",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "mergeSupply",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "rujiAllocation",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "MergeStatus",
            "kind": "LinkedField",
            "name": "status",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "merged",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "Apr",
                "kind": "LinkedField",
                "name": "apr",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "value",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "status",
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
    ]
  },
  "params": {
    "cacheID": "5ec0203677e391f04c0fe68df94b5c97",
    "id": null,
    "metadata": {},
    "name": "MergeQuery",
    "operationKind": "query",
    "text": "query MergeQuery {\n  merge {\n    address\n    mergeAsset {\n      asset\n      type\n      chain\n      metadata {\n        decimals\n        symbol\n      }\n      id\n    }\n    ...DecayFragment\n    ...MergePoolFragment\n    ...ConvertStepFragment\n    id\n  }\n}\n\nfragment ConvertStepFragment on MergePool {\n  address\n  mergeAsset {\n    type\n    chain\n    asset\n    metadata {\n      decimals\n      symbol\n    }\n    variants {\n      native {\n        denom\n      }\n      secured {\n        type\n        chain\n        asset\n        metadata {\n          decimals\n          symbol\n        }\n        variants {\n          native {\n            denom\n          }\n        }\n        id\n      }\n    }\n    id\n  }\n}\n\nfragment DecayFragment on MergePool {\n  id\n  startRate\n  currentRate\n}\n\nfragment MergePoolFragment on MergePool {\n  id\n  address\n  currentRate\n  mergeAsset {\n    asset\n    metadata {\n      symbol\n      decimals\n    }\n    id\n  }\n  mergeSupply\n  rujiAllocation\n  startRate\n  status {\n    merged\n    apr {\n      value\n      status\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "c001728eab220f7be1e2e024c24bdd26";

export default node;
