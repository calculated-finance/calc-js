// Compresses a 20-byte EVM address (0x hex) into a URL-safe Base64 string so it
// fits inside on-chain string fields with tight length limits (e.g. the 128-char
// CosmWasm contract label). Reversible via decodeAddress.
export function encodeAddress(addr: string): string {
  const hex = addr.replace(/^0x/i, "");
  const bytes = new Uint8Array(20);
  for (let i = 0; i < 20; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  let bin = "";
  for (let i = 0; i < bytes.length; i++) {
    bin += String.fromCharCode(bytes[i]);
  }
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

export function decodeAddress(b64: string): string {
  let s = b64.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  const bin = atob(s);
  return (
    "0x" +
    Array.from(bin)
      .map((c) => c.charCodeAt(0).toString(16).padStart(2, "0"))
      .join("")
  );
}
