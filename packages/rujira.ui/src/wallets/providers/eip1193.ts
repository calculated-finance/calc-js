import {
  AbstractSigner,
  BrowserProvider,
  Contract,
  Eip1193Provider,
  ethers,
  JsonRpcApiProvider,
  JsonRpcSigner,
  parseUnits,
} from "ethers";
import {
  Account,
  Address,
  AVAX,
  BASE,
  BSC,
  ERC20Allowance,
  ETH,
  gasToken,
  InsufficientAllowanceError,
  Msg,
  Network,
  networkId,
  Signer,
  Simulation,
  TxResult,
} from "rujira.js";
import { Eip712Adapter } from "./eip712";

interface Provider extends Eip1193Provider {
  on?: (event: string, cb: () => void) => void;
  off?: (event: string, cb: () => void) => void;
}

export class Eip1193Adapter implements Signer {
  private eip712?: Eip712Adapter;
  private map: Record<string, "712" | "1193"> = {};
  private currentListener?: (...args: unknown[]) => void;

  constructor(
    private e: () => Provider | undefined,
    eip712: boolean
  ) {
    if (eip712) this.eip712 = new Eip712Adapter(e);
  }

  public async connect(): Promise<Address[]> {
    const e = this.e();
    if (!e) throw new Error(``);

    const authorizedAccounts: string[] = await e.request({
      method: "eth_accounts",
    });

    const eip1193: string[] = authorizedAccounts.length
      ? authorizedAccounts
      : await e.request({ method: "eth_requestAccounts" });

    const eip712 = this.eip712 ? await this.eip712.connect() : [];
    this.map = eip1193.reduce(
      (a, v) => ({ ...a, [ethers.getAddress(v)]: "1193" }),
      this.map
    );
    this.map = eip712.reduce(
      (a, v) => ({ ...a, [v.address]: "712" }),
      this.map
    );
    return [
      ...eip712,
      ...eip1193.map((x) => ({
        address: ethers.getAddress(x),
        networks: this.eip1193Networks(),
      })),
    ];
  }

  public async simulate(msg: Msg): Promise<Simulation> {
    if (this.map[msg.account.address] === "712") {
      if (!this.eip712) throw new Error("No Eip712Adapter found");
      return this.eip712.simulate(msg);
    }

    const signer = this.buildSigner(msg.account);
    return simulate(signer, msg);
  }

  public async signAndBroadcast(
    simulation: Simulation,
    msg: Msg
  ): Promise<TxResult> {
    if (this.map[msg.account.address] === "712") {
      if (!this.eip712) throw new Error("No Eip712Adapter found");
      return this.eip712.signAndBroadcast(simulation, msg);
    }
    const signer = this.buildSigner(msg.account);
    return signAndBroadcast(signer, simulation, msg);
  }
  onChange = (cb: () => void) => {
    const e = this.e();
    if (!e) return;

    if (this.currentListener) {
      e.off?.("accountsChanged", this.currentListener);
      e.off?.("chainChanged", this.currentListener);
    }

    this.currentListener = () => cb();

    e.on?.("accountsChanged", this.currentListener);
    e.on?.("chainChanged", this.currentListener);
  };

  isAvailable() {
    return !!this.e();
  }

  buildSigner(account: Account): JsonRpcSigner {
    const e = this.e();
    if (!e) throw new Error(``);
    const provider = new BrowserProvider(e);
    return new JsonRpcSigner(provider, account.address);
  }
  public networks(): Network[] {
    return [...(this.eip712?.networks() || []), ...this.eip1193Networks()];
  }

  private eip1193Networks(): Network[] {
    return [AVAX, BASE, BSC, ETH];
  }
}

const checkAllowance = async (
  context: AbstractSigner<JsonRpcApiProvider>,
  erc20: ERC20Allowance,
  spender: string
) => {
  const contract = new Contract(
    erc20.asset.contract,
    [
      "function allowance(address owner, address spender) view returns (uint256)",
    ],
    await context.provider.getSigner()
  );

  const allowance = await contract.allowance(
    await context.getAddress(),
    spender
  );
  if (allowance < erc20.amount) {
    throw new InsufficientAllowanceError(
      spender,
      allowance,
      erc20.amount,
      erc20.asset
    );
  }
  return;
};

export const gasPrices = async (
  context: AbstractSigner<JsonRpcApiProvider>
) => {
  const provider = context.provider;

  const latestBlock = await provider.getBlock("latest");
  const isEIP1559 = !!latestBlock?.baseFeePerGas;

  if (!isEIP1559) {
    const gasPrice = await provider.send("eth_gasPrice", []);
    return { gasPrice: BigInt(gasPrice) };
  }

  const priorityFee = await provider
    .send("eth_maxPriorityFeePerGas", [])
    .catch(() => parseUnits("2", "gwei"));

  const baseFee = latestBlock.baseFeePerGas ?? 0n;
  const maxPriorityFeePerGas = BigInt(priorityFee);
  const maxFeePerGas = baseFee + maxPriorityFeePerGas * 2n;

  return {
    maxPriorityFeePerGas,
    maxFeePerGas,
  };
};

export const simulate = async (
  signer: AbstractSigner<JsonRpcApiProvider>,
  msg: Msg
): Promise<Simulation> => {
  const { tx, erc20 } = await msg.toEvmTxRequest();
  // await context.provider.on("debug", console.debug);
  const chainId = networkId(msg.account.network);

  const currentChainId = await signer.provider.send("eth_chainId", []);
  if (currentChainId.toLowerCase() !== chainId.toLowerCase()) {
    await signer.provider.send("wallet_switchEthereumChain", [{ chainId }]);
  }
  if (erc20 && tx.to) await checkAllowance(signer, erc20, tx.to.toString());
  try {
    const { maxFeePerGas, gasPrice } = await gasPrices(signer);
    const gas = await signer.estimateGas({
      ...tx,
      gasPrice,
      maxFeePerGas,
    });
    const sim = {
      ...gasToken(msg.account.network),
      amount: gasPrice ? gas * gasPrice : gas * (maxFeePerGas as bigint),
      gas,
    };

    return sim;
  } catch (error: any) {
    // We get pretty terrible error data back from Eip1193 providers eg Metamask and Keplr,
    // Log the error but throw a more friendly version
    if (
      error.message.includes("missing revert data") ||
      error.message.includes("invalid BigNumberish value")
    ) {
      console.error(error);
      throw new Error(
        `Insufficient ${gasToken(msg.account.network).symbol} for gas`
      );
    }
    throw error;
  }
};

export const signAndBroadcast = async (
  signer: AbstractSigner<JsonRpcApiProvider>,
  simulation: Simulation,
  msg: Msg
): Promise<TxResult> => {
  const req = await msg.toEvmTxRequest();
  try {
    const res = await signer.sendTransaction({
      ...req.tx,
      ...(await gasPrices(signer)),
      gasLimit: simulation.gas,
    });

    await res.wait();

    return {
      network: msg.account.network,
      address: msg.account.address,
      txHash: res.hash,
      deposited: msg.toDeposit?.() || null,
    };
  } catch (error: any) {
    throw new Error(error?.error?.message);
  }
};
