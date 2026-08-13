// Shim for tweetnacl-util to add default export for ESM compatibility
import * as naclUtil from "tweetnacl-util";

// Export all named exports
export const decodeUTF8 = (s: string) => naclUtil.decodeUTF8(s);
export const encodeUTF8 = (arr: Uint8Array) => naclUtil.encodeUTF8(arr);
export const encodeBase64 = (arr: Uint8Array) => naclUtil.encodeBase64(arr);
export const decodeBase64 = (s: string) => naclUtil.decodeBase64(s);

// Add default export for packages expecting it
export default naclUtil;
