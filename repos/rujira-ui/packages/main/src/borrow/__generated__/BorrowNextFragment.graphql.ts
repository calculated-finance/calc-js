/**
 * @generated SignedSource<<74b9a9ea604c89227ead5084f707cefd>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type BorrowNextFragment$data = {
  readonly account: string;
  readonly id: string;
  readonly salt: string;
  readonly " $fragmentType": "BorrowNextFragment";
};
export type BorrowNextFragment$key = {
  readonly " $data"?: BorrowNextFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"BorrowNextFragment">;
};

import NextQuery_graphql from './NextQuery.graphql';

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "refetch": {
      "connection": null,
      "fragmentPathInResult": [
        "node"
      ],
      "operation": NextQuery_graphql,
      "identifierInfo": {
        "identifierField": "id",
        "identifierQueryVariableName": "id"
      }
    }
  },
  "name": "BorrowNextFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "salt",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "account",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    }
  ],
  "type": "GhostCreditAccountNext",
  "abstractKey": null
};

(node as any).hash = "83605242194f268ef5671001865e171a";

export default node;
