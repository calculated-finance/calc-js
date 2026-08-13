import { fromBech32 } from "@cosmjs/encoding";
import { expect, test } from "vitest";
import { AminoTypes } from "../../../amino";
import { Asset, Coin } from "../common/common";
import { createThorchainAminoConverters } from "./aminomessages";
import { MsgDeposit } from "./msg_deposit";

test("amino MsgDeposit convertors work correctly", () => {
  const msg: MsgDeposit = {
    memo: "some-memo",
    signer: fromBech32("thor1e0lmk5juawc46jwjwd0xfz587njej7ay5fh6cd").data,
    coins: [
      Coin.fromPartial({
        amount: "10000000",
        asset: Asset.fromPartial({
          chain: "ETH",
          symbol: "USDC-0XA0B86991C6218B36C1D19D4A2E9EB0CE3606EB48",
          ticker: "USDC",
          secured: true,
        }),
      }),
    ],
  };

  const aminoTypes = new AminoTypes(createThorchainAminoConverters("thor"));
  const object = {
    typeUrl: MsgDeposit.typeUrl,
    value: msg,
  };
  const toAmino = aminoTypes.toAmino(object);
  const fromAmino = aminoTypes.fromAmino(toAmino);
  expect(object).toStrictEqual(fromAmino);
});
