// Shim for borsh to add default export for ESM compatibility
import * as borsh from "borsh";

// Export all named exports
export const serialize: typeof borsh.serialize = (...args) =>
  borsh.serialize(...args);
export const deserialize: typeof borsh.deserialize = (...args) =>
  borsh.deserialize(...args);
export const deserializeUnchecked: typeof borsh.deserializeUnchecked = (
  ...args
) => borsh.deserializeUnchecked(...args);

// Add default export for packages expecting it
export default borsh;
