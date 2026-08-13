import { Buffer } from "buffer";

// Make Buffer available globally for packages that expect it as a global (e.g. ton-core)
if (typeof globalThis.Buffer === "undefined") {
  (globalThis as unknown as Record<string, unknown>).Buffer = Buffer;
}
