import {
  DeviceActionState,
  DeviceActionStatus,
  DeviceManagementKit,
  DeviceManagementKitBuilder,
  DiscoveredDevice,
} from "@ledgerhq/device-management-kit";
import {
  DefaultDescriptorTemplate,
  DefaultWallet,
  GetWalletAddressDAError,
  GetWalletAddressDAIntermediateValue,
  GetWalletAddressDAOutput,
  SignerBtc,
  SignerBtcBuilder,
} from "@ledgerhq/device-signer-kit-bitcoin";
import { webHidTransportFactory } from "@ledgerhq/device-transport-kit-web-hid";
import { Root } from "react-dom/client";
import {
  Address,
  BTC,
  Msg,
  Network,
  Signer,
  Simulation,
  TxResult,
} from "rujira.js";
import { Subject } from "rxjs";
import { renderModal } from "./ledger/Modal";

const PATH = "84'/0'/0'";

class LedgerAdapter implements Signer {
  private dmk: DeviceManagementKit;
  private observer?: Subject<GetWalletAddressDAIntermediateValue>;
  private root?: Root;
  private sessionId?: string;
  private signer?: SignerBtc;

  constructor() {
    this.dmk = new DeviceManagementKitBuilder()
      // .addLogger(new ConsoleLogger())
      .addTransport(webHidTransportFactory)
      .build();
  }
  connect(): Promise<Address[]> {
    this.observer = new Subject();
    this.root = renderModal(this.observer);

    return new Promise((resolve, reject) => {
      const o = this.dmk.startDiscovering({});
      o.subscribe({
        error: (error: { originalError?: unknown }) => {
          this.observer?.error(error);
          reject(error.originalError);
        },
        next: this.onDevice((signer, address) => {
          this.signer = signer;
          return resolve([{ address, networks: [BTC] }]);
        }, reject),
      });
    });
  }
  simulate(_tx: Msg): Promise<Simulation> {
    this.signer;
    throw new Error("Native BTC Ledger signing coming soon");
  }
  signAndBroadcast(_simulation: Simulation, _tx: Msg): Promise<TxResult> {
    throw new Error("Native BTC Ledger signing coming soon");
  }
  onChange?: ((cb: () => void) => void) | undefined;
  isAvailable() {
    return true;
  }
  networks(): Network[] {
    return [BTC];
  }
  disconnect() {
    this.sessionId && this.dmk.disconnect({ sessionId: this.sessionId });
  }

  onDevice =
    (
      resolve: (signer: SignerBtc, address: string) => void,
      reject: (reason?: any) => void
    ) =>
    (device: DiscoveredDevice) => {
      this.dmk.connect({ device }).then((sessionId: string) => {
        this.sessionId = sessionId;
        const signer = new SignerBtcBuilder({
          dmk: this.dmk,
          sessionId,
        }).build();

        const { observable, cancel: _cancel } = signer.getWalletAddress(
          new DefaultWallet(PATH, DefaultDescriptorTemplate.NATIVE_SEGWIT),
          0,
          { checkOnDevice: false }
        );

        observable.subscribe({
          error: (error: { originalError?: unknown }) => {
            this.observer?.error(error);
            reject(error.originalError);
          },
          next: this.onAddress((address) => resolve(signer, address), reject),
        });
      });
    };

  onAddress =
    (resolve: (v: string) => void, reject: (reason?: any) => void) =>
    (
      address: DeviceActionState<
        GetWalletAddressDAOutput,
        GetWalletAddressDAError,
        GetWalletAddressDAIntermediateValue
      >
    ) => {
      switch (address.status) {
        case DeviceActionStatus.NotStarted:
          break;
        case DeviceActionStatus.Pending:
          this.observer?.next(address.intermediateValue);
          break;
        case DeviceActionStatus.Stopped:
          reject("Stopped");
          break;
        case DeviceActionStatus.Completed:
          this.root?.unmount();
          resolve(address.output.address);
          break;
        case DeviceActionStatus.Error:
          this.observer?.error(address.error);
          reject(address.error);
          break;
      }
    };
}

export default new LedgerAdapter();
