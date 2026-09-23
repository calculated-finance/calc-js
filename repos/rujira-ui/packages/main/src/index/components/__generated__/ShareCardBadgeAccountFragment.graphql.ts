/**
 * @generated SignedSource<<5e8b4d141da2a9f9b2796d5315f54853>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ShareCardBadgeAccountFragment$data = {
  readonly index: ReadonlyArray<{
    readonly index: {
      readonly id: string;
    };
    readonly sharesValue: bigint;
  }>;
  readonly " $fragmentType": "ShareCardBadgeAccountFragment";
};
export type ShareCardBadgeAccountFragment$key = {
  readonly " $data"?: ShareCardBadgeAccountFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"ShareCardBadgeAccountFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ShareCardBadgeAccountFragment",
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
          "name": "sharesValue",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "IndexVault",
          "kind": "LinkedField",
          "name": "index",
          "plural": false,
          "selections": [
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
      ],
      "storageKey": null
    }
  ],
  "type": "Account",
  "abstractKey": null
};

(node as any).hash = "5d906d892bdbe4aee827952b2b3a721c";

export default node;
