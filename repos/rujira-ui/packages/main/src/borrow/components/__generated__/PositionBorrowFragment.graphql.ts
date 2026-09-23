/**
 * @generated SignedSource<<412a0c8e748a1da20684598aa1fd16ee>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type PositionBorrowFragment$data = {
  readonly account: {
    readonly address: string;
    readonly label: string;
  };
  readonly id: string;
  readonly " $fragmentSpreads": FragmentRefs<"PositionPositionFragment">;
  readonly " $fragmentType": "PositionBorrowFragment";
};
export type PositionBorrowFragment$key = {
  readonly " $data"?: PositionBorrowFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"PositionBorrowFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "PositionBorrowFragment",
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
      "concreteType": "RujiraAccount",
      "kind": "LinkedField",
      "name": "account",
      "plural": false,
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
          "name": "label",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "PositionPositionFragment"
    }
  ],
  "type": "GhostCreditAccount",
  "abstractKey": null
};

(node as any).hash = "0830ff73119032f0410c3d2b9ecb70e1";

export default node;
