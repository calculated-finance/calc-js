/**
 * @generated SignedSource<<27e3ad9664693d0dc57850567230fbad>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type PositionsPortfolioFragment$data = {
  readonly credit: {
    readonly accounts: ReadonlyArray<{
      readonly account: {
        readonly address: string;
      };
      readonly ltv: bigint;
      readonly " $fragmentSpreads": FragmentRefs<"PositionBorrowRowFragment">;
    }> | null | undefined;
  };
  readonly " $fragmentType": "PositionsPortfolioFragment";
};
export type PositionsPortfolioFragment$key = {
  readonly " $data"?: PositionsPortfolioFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"PositionsPortfolioFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "PositionsPortfolioFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "GhostCreditAccounts",
      "kind": "LinkedField",
      "name": "credit",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "GhostCreditAccount",
          "kind": "LinkedField",
          "name": "accounts",
          "plural": true,
          "selections": [
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
                }
              ],
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "ltv",
              "storageKey": null
            },
            {
              "args": null,
              "kind": "FragmentSpread",
              "name": "PositionBorrowRowFragment"
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

(node as any).hash = "886f241d7629af14085167985fccf976";

export default node;
