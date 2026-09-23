/**
 * @generated SignedSource<<703029c710396b710c7c0d8a2fce69eb>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type StakeRootQuery$variables = Record<PropertyKey, never>;
export type StakeRootQuery$data = {
  readonly staking: {
    readonly pools: ReadonlyArray<{
      readonly bondAsset: {
        readonly metadata: {
          readonly symbol: string;
        };
      };
      readonly id: string;
    }>;
  };
};
export type StakeRootQuery = {
  response: StakeRootQuery$data;
  variables: StakeRootQuery$variables;
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
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "StakeRootQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Staking",
        "kind": "LinkedField",
        "name": "staking",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "StakingPool",
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
                "name": "bondAsset",
                "plural": false,
                "selections": [
                  (v1/*: any*/)
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
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "StakeRootQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Staking",
        "kind": "LinkedField",
        "name": "staking",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "StakingPool",
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
                "name": "bondAsset",
                "plural": false,
                "selections": [
                  (v1/*: any*/),
                  (v0/*: any*/)
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
    "cacheID": "228f5271c578f87d410405fea8b9b986",
    "id": null,
    "metadata": {},
    "name": "StakeRootQuery",
    "operationKind": "query",
    "text": "query StakeRootQuery {\n  staking {\n    pools {\n      id\n      bondAsset {\n        metadata {\n          symbol\n        }\n        id\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "c66ff092b3ebeccdd12b21dbd312485d";

export default node;
