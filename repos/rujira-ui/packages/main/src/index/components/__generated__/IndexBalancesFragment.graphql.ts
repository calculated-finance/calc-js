/**
 * @generated SignedSource<<288c67fcdea71c5baaca4e1aa84cb73b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type IndexBalancesFragment$data = {
  readonly index: ReadonlyArray<{
    readonly id: string;
    readonly " $fragmentSpreads": FragmentRefs<"IndexBalanceFragment">;
  }>;
  readonly " $fragmentType": "IndexBalancesFragment";
};
export type IndexBalancesFragment$key = {
  readonly " $data"?: IndexBalancesFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"IndexBalancesFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "IndexBalancesFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "IndexAccount",
      "kind": "LinkedField",
      "name": "index",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "id",
          "storageKey": null
        },
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "IndexBalanceFragment"
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Account",
  "abstractKey": null
};

(node as any).hash = "3573a424dbb17360790e9a7fad66012a";

export default node;
