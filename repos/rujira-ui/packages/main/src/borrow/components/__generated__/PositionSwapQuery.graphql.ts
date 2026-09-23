/**
 * @generated SignedSource<<5a6c1a239b262620e19a57009df3b3d6>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type PositionSwapQuery$variables = {
  id: string;
  oracle: string;
};
export type PositionSwapQuery$data = {
  readonly oraclePrice: {
    readonly id: string;
    readonly " $fragmentSpreads": FragmentRefs<"OraclePriceFragment">;
  } | null | undefined;
  readonly positionSwapContract: {
    readonly address?: string;
    readonly book?: {
      readonly " $fragmentSpreads": FragmentRefs<"PositionSwapBookFragment">;
    };
    readonly id?: string;
  } | null | undefined;
};
export type PositionSwapQuery = {
  response: PositionSwapQuery$data;
  variables: PositionSwapQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "oracle"
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
  "name": "id",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "address",
  "storageKey": null
},
v4 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "oracle"
  }
],
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v6 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "asset",
    "storageKey": null
  },
  (v2/*: any*/)
],
v7 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "price",
    "storageKey": null
  },
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "total",
    "storageKey": null
  },
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "value",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "PositionSwapQuery",
    "selections": [
      {
        "alias": "positionSwapContract",
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          {
            "kind": "InlineFragment",
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "FinBook",
                "kind": "LinkedField",
                "name": "book",
                "plural": false,
                "selections": [
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "PositionSwapBookFragment"
                  }
                ],
                "storageKey": null
              }
            ],
            "type": "FinPair",
            "abstractKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": "oraclePrice",
        "args": (v4/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "OraclePriceFragment"
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
    "name": "PositionSwapQuery",
    "selections": [
      {
        "alias": "positionSwapContract",
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v5/*: any*/),
          (v2/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v3/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "FinBook",
                "kind": "LinkedField",
                "name": "book",
                "plural": false,
                "selections": [
                  (v2/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "FinPair",
                    "kind": "LinkedField",
                    "name": "pair",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Asset",
                        "kind": "LinkedField",
                        "name": "assetBase",
                        "plural": false,
                        "selections": (v6/*: any*/),
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Asset",
                        "kind": "LinkedField",
                        "name": "assetQuote",
                        "plural": false,
                        "selections": (v6/*: any*/),
                        "storageKey": null
                      },
                      (v2/*: any*/)
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "FinBookEntry",
                    "kind": "LinkedField",
                    "name": "bids",
                    "plural": true,
                    "selections": (v7/*: any*/),
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "FinBookEntry",
                    "kind": "LinkedField",
                    "name": "asks",
                    "plural": true,
                    "selections": (v7/*: any*/),
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "type": "FinPair",
            "abstractKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": "oraclePrice",
        "args": (v4/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v5/*: any*/),
          (v2/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "current",
                "storageKey": null
              }
            ],
            "type": "ThorchainOraclePrice",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "2cceee57bcf0bda19c44b07a924031fe",
    "id": null,
    "metadata": {},
    "name": "PositionSwapQuery",
    "operationKind": "query",
    "text": "query PositionSwapQuery(\n  $id: ID!\n  $oracle: ID!\n) {\n  positionSwapContract: node(id: $id) {\n    __typename\n    ... on FinPair {\n      id\n      address\n      book {\n        ...PositionSwapBookFragment\n        id\n      }\n    }\n    id\n  }\n  oraclePrice: node(id: $oracle) {\n    __typename\n    id\n    ...OraclePriceFragment\n  }\n}\n\nfragment OraclePriceFragment on ThorchainOraclePrice {\n  id\n  current\n}\n\nfragment PositionSwapBookFragment on FinBook {\n  id\n  pair {\n    assetBase {\n      asset\n      id\n    }\n    assetQuote {\n      asset\n      id\n    }\n    id\n  }\n  bids {\n    price\n    total\n    value\n  }\n  asks {\n    price\n    total\n    value\n  }\n}\n"
  }
};
})();

(node as any).hash = "5bc91e210c30cdb06d7a8793d6de9457";

export default node;
