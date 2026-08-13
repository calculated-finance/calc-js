import { Buffer } from "buffer";

export namespace Id {
  export const account = (a: { address: string }): string =>
    Buffer.from(`Account:${a.address}`).toString("base64");
}
