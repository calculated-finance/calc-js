/**
 * @generated SignedSource<<03d88ada5ea8fe30be8eda5e76c52056>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ThorchainPoolAccountFragment$data = {
  readonly liquidityAccounts: ReadonlyArray<{
    readonly asset: {
      readonly id: string;
    };
    readonly id: string;
    readonly " $fragmentSpreads": FragmentRefs<"ThorchainPoolBalanceFragment" | "ThorchainPoolDepositAccountFragment">;
  }>;
  readonly " $fragmentType": "ThorchainPoolAccountFragment";
};
export type ThorchainPoolAccountFragment$key = {
  readonly " $data"?: ThorchainPoolAccountFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"ThorchainPoolAccountFragment">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ThorchainPoolAccountFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "ThorchainLiquidityProvider",
      "kind": "LinkedField",
      "name": "liquidityAccounts",
      "plural": true,
      "selections": [
        (v0/*: any*/),
        {
          "alias": null,
          "args": null,
          "concreteType": "Asset",
          "kind": "LinkedField",
          "name": "asset",
          "plural": false,
          "selections": [
            (v0/*: any*/)
          ],
          "storageKey": null
        },
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "ThorchainPoolBalanceFragment"
        },
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "ThorchainPoolDepositAccountFragment"
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Account",
  "abstractKey": null
};
})();

(node as any).hash = "3a4a7bc1dc9631b3499dfee8f3071d35";

export default node;
