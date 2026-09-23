/**
 * @generated SignedSource<<485156b9998d3ffb33e27d776d57a5ea>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type DecayFragment$data = {
  readonly currentRate: bigint;
  readonly id: string;
  readonly startRate: bigint;
  readonly " $fragmentType": "DecayFragment";
};
export type DecayFragment$key = {
  readonly " $data"?: DecayFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"DecayFragment">;
};

import DecayRefetchQuery_graphql from './DecayRefetchQuery.graphql';

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "refetch": {
      "connection": null,
      "fragmentPathInResult": [
        "node"
      ],
      "operation": DecayRefetchQuery_graphql,
      "identifierInfo": {
        "identifierField": "id",
        "identifierQueryVariableName": "id"
      }
    }
  },
  "name": "DecayFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    },
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
    }
  ],
  "type": "MergePool",
  "abstractKey": null
};

(node as any).hash = "24fe1cad02c8277136b3d74b627cb00d";

export default node;
