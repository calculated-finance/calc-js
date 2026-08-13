/**
 * @generated SignedSource<<225ea4c1d2d505352ffe272a2500db3e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type OraclePriceSubscription$variables = {
  id: string;
};
export type OraclePriceSubscription$data = {
  readonly node: {
    readonly " $fragmentSpreads": FragmentRefs<"OraclePriceFragment">;
  } | null | undefined;
};
export type OraclePriceSubscription = {
  response: OraclePriceSubscription$data;
  variables: OraclePriceSubscription$variables;
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
    "name": "OraclePriceSubscription",
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
    "name": "OraclePriceSubscription",
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
    "cacheID": "d0dfe4b0efccd25661960e980edd44c6",
    "id": null,
    "metadata": {},
    "name": "OraclePriceSubscription",
    "operationKind": "subscription",
    "text": "subscription OraclePriceSubscription(\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    ... on ThorchainOraclePrice {\n      ...OraclePriceFragment\n    }\n    id\n  }\n}\n\nfragment OraclePriceFragment on ThorchainOraclePrice {\n  id\n  current\n}\n"
  }
};
})();

(node as any).hash = "2967d40a1c3b3f608c947231c3d7f29a";

export default node;
