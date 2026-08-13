/**
 * @generated SignedSource<<c4ce357db976b6b9a575aa76b574d71d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type StakePoolPageDepositFragment$data = {
  readonly address: string;
  readonly bondAsset: {
    readonly metadata: {
      readonly symbol: string;
    };
    readonly price: {
      readonly current: bigint | null | undefined;
    } | null | undefined;
  };
  readonly " $fragmentType": "StakePoolPageDepositFragment";
};
export type StakePoolPageDepositFragment$key = {
  readonly " $data"?: StakePoolPageDepositFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"StakePoolPageDepositFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "StakePoolPageDepositFragment",
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
      "concreteType": "Asset",
      "kind": "LinkedField",
      "name": "bondAsset",
      "plural": false,
      "selections": [
        {
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
        {
          "alias": null,
          "args": null,
          "concreteType": "Price",
          "kind": "LinkedField",
          "name": "price",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "current",
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "StakingPool",
  "abstractKey": null
};

(node as any).hash = "ba51eb8398f106f006fe6982a3aa0053";

export default node;
