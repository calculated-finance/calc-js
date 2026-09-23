/**
 * @generated SignedSource<<4b482a367358531accda2e61e88294b3>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type FAQFragment$data = {
  readonly address: string;
  readonly fees: {
    readonly rates: {
      readonly management: bigint;
      readonly transaction: bigint;
    };
  };
  readonly shareAsset: {
    readonly metadata: {
      readonly symbol: string;
    };
  };
  readonly type: string;
  readonly " $fragmentType": "FAQFragment";
};
export type FAQFragment$key = {
  readonly " $data"?: FAQFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"FAQFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "FAQFragment",
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
      "concreteType": "IndexFees",
      "kind": "LinkedField",
      "name": "fees",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "IndexFeesRates",
          "kind": "LinkedField",
          "name": "rates",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "management",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "transaction",
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Asset",
      "kind": "LinkedField",
      "name": "shareAsset",
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
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "type",
      "storageKey": null
    }
  ],
  "type": "IndexVault",
  "abstractKey": null
};

(node as any).hash = "3cb08678d09132cce8f87f2765a94127";

export default node;
