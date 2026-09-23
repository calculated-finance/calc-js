/**
 * @generated SignedSource<<6709d013e1ab370fdf8ab27389ce3831>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type LeaderboardAccountQuery$variables = {
  id: string;
};
export type LeaderboardAccountQuery$data = {
  readonly node: {
    readonly address?: string;
    readonly points?: bigint;
    readonly rank?: number | null | undefined;
    readonly rankPrevious?: number | null | undefined;
  } | null | undefined;
};
export type LeaderboardAccountQuery = {
  response: LeaderboardAccountQuery$data;
  variables: LeaderboardAccountQuery$variables;
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
  "kind": "InlineFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "address",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "points",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "rank",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "rankPrevious",
      "storageKey": null
    }
  ],
  "type": "LeagueAccount",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "LeaderboardAccountQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v2/*: any*/)
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
    "name": "LeaderboardAccountQuery",
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
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "1432e471455032773a3ebe05f4b77367",
    "id": null,
    "metadata": {},
    "name": "LeaderboardAccountQuery",
    "operationKind": "query",
    "text": "query LeaderboardAccountQuery(\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    ... on LeagueAccount {\n      address\n      points\n      rank\n      rankPrevious\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "acca148e079250ea7e9342b2e6b72d89";

export default node;
