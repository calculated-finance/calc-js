import { Account } from "../accounts";
import { EncodeObject } from "../signers/cosmos/proto-signing";
import { Coin } from "../signers/cosmos/types/cosmos/base/v1beta1/coin";
import {
  MsgInstantiateContract,
  MsgStoreCode,
} from "../signers/cosmos/types/cosmwasm/wasm/v1/tx";
import { BaseMsg, Msg } from "./msg";

export class MsgStore extends BaseMsg implements Msg {
  constructor(
    public account: Account,
    private wasmByteCode: Uint8Array
  ) {
    super();
  }

  async toCosmosTx(): Promise<{ msgs: EncodeObject[]; memo: string }> {
    return {
      msgs: [
        {
          typeUrl: MsgStoreCode.typeUrl,
          value: MsgStoreCode.fromPartial({
            sender: this.account.address,
            wasmByteCode: this.wasmByteCode,
          }),
        },
      ],
      memo: "",
    };
  }
}

const defaultEncoder = <T>(x: T) => Buffer.from(JSON.stringify(x));

export class MsgInstantiate<T> extends BaseMsg implements Msg {
  constructor(
    public account: Account,
    private codeId: bigint,
    private msg: T,
    private label: string,
    private funds?: Coin[],
    private admin?: string,

    private encoder: (v: T) => Uint8Array = defaultEncoder
  ) {
    super();
  }
  async toCosmosTx(): Promise<{ msgs: EncodeObject[]; memo: string }> {
    return {
      msgs: [
        {
          typeUrl: MsgInstantiateContract.typeUrl,
          value: MsgInstantiateContract.fromPartial({
            sender: this.account.address,
            codeId: this.codeId,
            msg: this.encoder(this.msg),
            funds: this.funds,
            label: this.label,
            admin: this.admin,
          }),
        },
      ],
      memo: "",
    };
  }
}
