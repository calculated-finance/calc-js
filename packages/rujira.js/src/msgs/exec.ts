import { Buffer } from "buffer";
import { Account } from "../accounts";
import { Asset } from "../asset";
import { BTC, GAIA, THOR, networkLabel } from "../network";
import { EncodeObject } from "../signers/cosmos/proto-signing";
import { Coin } from "../signers/cosmos/types/cosmos/base/v1beta1/coin";
import {
  MsgExecuteContract,
  MsgMigrateContract,
  MsgSudoContract,
} from "../signers/cosmos/types/cosmwasm/wasm/v1/tx";
import { MsgDeposit } from "./deposit";
import { BaseMsg, Msg } from "./msg";

const defaultEncoder = <T>(x: T) => Buffer.from(JSON.stringify(x));

export class MsgExec<T> extends MsgDeposit implements Msg {
  constructor(
    public account: Account,
    asset: Asset,
    amount: bigint,

    private contractAddress: string,
    private msg: T,
    private encoder: (v: T) => Uint8Array = defaultEncoder
  ) {
    super(account, asset, amount);
  }

  async toCosmosTx(): Promise<{ msgs: EncodeObject[]; memo: string }> {
    if (this.account.network === THOR) {
      const denom = this.asset?.variants?.native?.denom;
      if (!denom)
        throw new Error(`Native denom for ${this.asset.asset} not provided`);

      return {
        msgs: [
          {
            typeUrl: MsgExecuteContract.typeUrl,
            value: {
              sender: this.account.address,
              contract: this.contractAddress,
              msg: this.encoder(this.msg),
              funds:
                this.amount === 0n
                  ? []
                  : [{ denom, amount: this.amount.toString() }],
            },
          },
        ],
        memo: "",
      };
    }

    return super.toCosmosTx();
  }

  toDeposit(): { amount: bigint; symbol: string } | null {
    if (this.account.network === THOR) return null;
    return super.toDeposit();
  }

  toMemo(): string {
    if (![BTC, GAIA, THOR].includes(this.asset.chain)) {
      throw new Error(
        `Exec memo support coming soon for ${networkLabel(this.asset.chain)}`
      );
    }

    const parts = [
      `x`,
      this.contractAddress,
      Buffer.from(this.encoder(this.msg)).toString("base64"),
    ];
    return parts.join(":");
  }
}

export class MsgExecute<T> extends BaseMsg implements Msg {
  constructor(
    public account: Account,
    private coins: Coin[],
    private contractAddress: string,
    private msg: T,
    private encoder: (v: T) => Uint8Array = defaultEncoder
  ) {
    super();
  }

  async toCosmosTx(): Promise<{ msgs: EncodeObject[]; memo: string }> {
    const funds = this.coins
      .sort((a, b) => a.denom.localeCompare(b.denom))
      .filter((x) => x.amount !== "0");

    return {
      msgs: [
        {
          typeUrl: MsgExecuteContract.typeUrl,
          value: {
            sender: this.account.address,
            contract: this.contractAddress,
            msg: this.encoder(this.msg),
            funds,
          },
        },
      ],
      memo: "",
    };
  }
}

export class MsgSudo<T> extends BaseMsg implements Msg {
  constructor(
    public account: Account,
    private contractAddress: string,
    private msg: T,
    private encoder: (v: T) => Uint8Array = defaultEncoder
  ) {
    super();
  }

  async toCosmosTx(): Promise<{ msgs: EncodeObject[]; memo: string }> {
    const value: MsgSudoContract = {
      authority: this.account.address,
      contract: this.contractAddress,
      msg: this.encoder(this.msg),
    };
    return {
      msgs: [
        {
          typeUrl: MsgSudoContract.typeUrl,
          value,
        },
      ],
      memo: "",
    };
  }
}

export class MsgMigrate<T> extends BaseMsg implements Msg {
  constructor(
    public account: Account,
    private coins: Coin[],
    private contractAddress: string,
    private msg: T,
    private codeId: bigint,
    private encoder: (v: T) => Uint8Array = defaultEncoder
  ) {
    super();
  }

  async toCosmosTx(): Promise<{ msgs: EncodeObject[]; memo: string }> {
    return {
      msgs: [
        {
          typeUrl: MsgMigrateContract.typeUrl,
          value: {
            sender: this.account.address,
            contract: this.contractAddress,
            msg: this.encoder(this.msg),
            funds: this.coins,
            codeId: this.codeId,
          },
        },
      ],
      memo: "",
    };
  }
}
