/**
 * @generated SignedSource<<966b32d316424a5a59e9d420610e3dd4>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type PositionSwapOracleSubscription$variables = {
  id: string;
};
export type PositionSwapOracleSubscription$data = {
  readonly node: {
    readonly " $fragmentSpreads": FragmentRefs<"OraclePriceFragment">;
  } | null | undefined;
};
export type PositionSwapOracleSubscription = {
  response: PositionSwapOracleSubscription$data;
  variables: PositionSwapOracleSubscription$variables;
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
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "PositionSwapOracleSubscription",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "OraclePriceFragment"
              }
            ],
            "type": "ThorchainOraclePrice",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "RootSubscriptionType",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "PositionSwapOracleSubscription",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
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
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          },
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
    "cacheID": "a056bf1d17fe5b1924d68ba0d4267baf",
    "id": null,
    "metadata": {},
    "name": "PositionSwapOracleSubscription",
    "operationKind": "subscription",
    "text": "subscription PositionSwapOracleSubscription(\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    ... on ThorchainOraclePrice {\n      ...OraclePriceFragment\n    }\n    id\n  }\n}\n\nfragment OraclePriceFragment on ThorchainOraclePrice {\n  id\n  current\n}\n"
  }
};
})();

(node as any).hash = "c2f30c13463cfe9e26243a0eb4dd1265";

export default node;
