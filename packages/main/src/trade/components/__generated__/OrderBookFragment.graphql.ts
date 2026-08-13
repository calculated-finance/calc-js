/**
 * @generated SignedSource<<c847c46b4b491ea87385b2a644bcc2e4>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type OrderBookFragment$data = {
  readonly id: string;
  readonly pair: {
    readonly address: string;
    readonly assetBase: {
      readonly asset: string;
      readonly metadata: {
        readonly decimals: number;
        readonly symbol: string;
      };
    };
    readonly assetQuote: {
      readonly asset: string;
      readonly metadata: {
        readonly decimals: number;
        readonly symbol: string;
      };
      readonly price: {
        readonly current: bigint | null | undefined;
      } | null | undefined;
    };
    readonly tick: bigint;
  };
  readonly " $fragmentSpreads": FragmentRefs<"OrderBookSubFragment">;
  readonly " $fragmentType": "OrderBookFragment";
};
export type OrderBookFragment$key = {
  readonly " $data"?: OrderBookFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"OrderBookFragment">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "asset",
  "storageKey": null
},
v1 = {
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
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "decimals",
      "storageKey": null
    }
  ],
  "storageKey": null
};
return {
  "argumentDefinitions": [
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "truncate"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "OrderBookFragment",
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
      "concreteType": "FinPair",
      "kind": "LinkedField",
      "name": "pair",
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
          "concreteType": "Asset",
          "kind": "LinkedField",
          "name": "assetBase",
          "plural": false,
          "selections": [
            (v0/*: any*/),
            (v1/*: any*/)
          ],
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "Asset",
          "kind": "LinkedField",
          "name": "assetQuote",
          "plural": false,
          "selections": [
            (v0/*: any*/),
            (v1/*: any*/),
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
          "name": "tick",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "args": [
        {
          "kind": "Variable",
          "name": "truncate",
          "variableName": "truncate"
        }
      ],
      "kind": "FragmentSpread",
      "name": "OrderBookSubFragment"
    }
  ],
  "type": "FinBookV2",
  "abstractKey": null
};
})();

(node as any).hash = "41e696fbdcad731f4ce5383e62de53b6";

export default node;
