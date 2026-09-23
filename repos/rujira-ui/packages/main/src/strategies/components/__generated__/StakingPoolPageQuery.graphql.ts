/**
 * @generated SignedSource<<c46940ff5d5823762b514ace2bf1b04a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type StakingPoolPageQuery$variables = Record<PropertyKey, never>;
export type StakingPoolPageQuery$data = {
  readonly staking: {
    readonly pendingBalances: ReadonlyArray<{
      readonly amount: bigint;
      readonly asset: {
        readonly asset: string;
        readonly metadata: {
          readonly symbol: string;
        };
      };
      readonly valueUsd: bigint;
    }>;
  };
};
export type StakingPoolPageQuery = {
  response: StakingPoolPageQuery$data;
  variables: StakingPoolPageQuery$variables;
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
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "amount",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "valueUsd",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "StakingPoolPageQuery",
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
            "concreteType": "Balance",
            "kind": "LinkedField",
            "name": "pendingBalances",
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
                  (v1/*: any*/)
                ],
                "storageKey": null
              },
              (v2/*: any*/),
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
    "name": "StakingPoolPageQuery",
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
            "concreteType": "Balance",
            "kind": "LinkedField",
            "name": "pendingBalances",
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
                  (v1/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "id",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              (v2/*: any*/),
              (v3/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "f0208156f6adeade739b0aa07fc852f8",
    "id": null,
    "metadata": {},
    "name": "StakingPoolPageQuery",
    "operationKind": "query",
    "text": "query StakingPoolPageQuery {\n  staking {\n    pendingBalances {\n      asset {\n        asset\n        metadata {\n          symbol\n        }\n        id\n      }\n      amount\n      valueUsd\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "db9196c448ee20f911385e3daba069bd";

export default node;
