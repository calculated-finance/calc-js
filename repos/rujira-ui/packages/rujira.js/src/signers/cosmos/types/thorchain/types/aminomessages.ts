import { fromBech32, toBech32 } from "@cosmjs/encoding";
import { AminoConverters, AminoMsg } from "../../../amino";
import { MsgDeposit } from "./msg_deposit";

/** A high level transaction of the coin module */
export interface AminoMsgDeposit extends AminoMsg {
  readonly type: "thorchain/MsgDeposit";
  readonly value: {
    readonly signer: string;
    readonly memo: string;
    readonly coins: readonly { asset: string; amount: string }[];
  };
}

export function isAminoMsgSend(msg: AminoMsg): msg is AminoMsgDeposit {
  return msg.type === "thorchain/MsgDeposit";
}

export function createThorchainAminoConverters(
  bech32Prefix = "thor"
): AminoConverters {
  return {
    "/types.MsgDeposit": {
      aminoType: "thorchain/MsgDeposit",
      toAmino: ({
        signer,
        memo,
        coins,
      }: MsgDeposit): AminoMsgDeposit["value"] => ({
        signer: toBech32(bech32Prefix, signer),
        memo,
        coins: [
          ...coins.map((x) => ({
            asset: x.asset
              ? x.asset.chain + (x.asset.secured ? "-" : ".") + x.asset.symbol
              : "",
            amount: x.amount,
          })),
        ],
      }),
      fromAmino: ({
        signer,
        memo,
        coins,
      }: AminoMsgDeposit["value"]): MsgDeposit => ({
        signer: fromBech32(signer).data,
        memo,
        coins: [
          ...coins.map((x) => {
            // We're only using this for Depositing x/ assets due to encoding issues,
            // so they'll be native without contract addresses

            const [, chain, separator, symbol] = x.asset.match(
              /^([A-Z]{3,10})([\.-])(.*)$/
            )!;
            return {
              amount: x.amount,
              asset: {
                chain: chain,
                symbol,
                ticker: symbol.split("-")[0],
                synth: false,
                trade: false,
                secured: separator === "-",
              },
              decimals: 0,
            };
          }),
        ],
      }),
    },
  };
}
