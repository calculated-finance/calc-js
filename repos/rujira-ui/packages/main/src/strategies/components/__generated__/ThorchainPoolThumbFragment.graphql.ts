/**
 * @generated SignedSource<<2d5ef7fbd0ed1abe4f08ba74dff71018>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ThorchainPoolThumbFragment$data = {
  readonly asset: {
    readonly asset: string;
    readonly metadata: {
      readonly symbol: string;
    };
    readonly price: {
      readonly current: bigint | null | undefined;
    } | null | undefined;
  };
  readonly assetRedeemValue: bigint;
  readonly runeRedeemValue: bigint;
  readonly valueUsd: bigint;
  readonly " $fragmentType": "ThorchainPoolThumbFragment";
};
export type ThorchainPoolThumbFragment$key = {
  readonly " $data"?: ThorchainPoolThumbFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"ThorchainPoolThumbFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ThorchainPoolThumbFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "Asset",
      "kind": "LinkedField",
      "name": "asset",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "asset",
          "storageKey": null
        },
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
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "valueUsd",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "assetRedeemValue",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "runeRedeemValue",
      "storageKey": null
    }
  ],
  "type": "ThorchainLiquidityProvider",
  "abstractKey": null
};

(node as any).hash = "9cc334f494a33722fc5a84fe6b02399c";

export default node;
