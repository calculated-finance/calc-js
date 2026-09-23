import { describe, expect, it } from "vitest";
import {
  assetToLendUrlSegment,
  assetToNetworkParam,
  assetToTradeUrlSegment,
  assetToUrlSegment,
  findAssetByUrlSegment,
  normalizeChainParam,
  normalizeTradeSegment,
  parseUrlSegment,
} from "../assetUrl";

const asset = (symbol: string, chain: string, type?: string) => ({
  chain,
  metadata: { symbol },
  type,
});

describe("assetToUrlSegment", () => {
  it("returns the bare symbol when chain matches symbol", () => {
    expect(assetToUrlSegment(asset("BTC", "BTC"))).toBe("BTC");
    expect(assetToUrlSegment(asset("ETH", "ETH"))).toBe("ETH");
  });

  it("returns the bare symbol for THOR-chain assets", () => {
    expect(assetToUrlSegment(asset("RUNE", "THOR"))).toBe("RUNE");
  });

  it("uses the canonical chain for known cross-chain assets", () => {
    expect(assetToUrlSegment(asset("AAVE", "ETH"))).toBe("AAVE");
    expect(assetToUrlSegment(asset("DAI", "ETH"))).toBe("DAI");
    expect(assetToUrlSegment(asset("FOX", "ETH"))).toBe("FOX");
    expect(assetToUrlSegment(asset("GUSD", "ETH"))).toBe("GUSD");
    expect(assetToUrlSegment(asset("LINK", "ETH"))).toBe("LINK");
    expect(assetToUrlSegment(asset("LUSD", "ETH"))).toBe("LUSD");
    expect(assetToUrlSegment(asset("TGT", "ETH"))).toBe("TGT");
    expect(assetToUrlSegment(asset("THOR", "ETH"))).toBe("THOR");
    expect(assetToUrlSegment(asset("USDC", "ETH"))).toBe("USDC");
    expect(assetToUrlSegment(asset("USDC", "AVAX"))).toBe("USDC");
    expect(assetToUrlSegment(asset("USDT", "ETH"))).toBe("USDT");
    expect(assetToUrlSegment(asset("USDP", "ETH"))).toBe("USDP");
    expect(assetToUrlSegment(asset("VTHOR", "ETH"))).toBe("VTHOR");
    expect(assetToUrlSegment(asset("WBTC", "ETH"))).toBe("WBTC");
    expect(assetToUrlSegment(asset("YFI", "ETH"))).toBe("YFI");
    expect(assetToUrlSegment(asset("cbBTC", "BASE"))).toBe("cbBTC");
    expect(assetToUrlSegment(asset("BNB", "BSC"))).toBe("BNB");
  });

  it("returns the bare symbol for SECURED assets, with no .THOR suffix", () => {
    expect(assetToUrlSegment(asset("BTC", "BTC", "SECURED"))).toBe("BTC");
    expect(assetToUrlSegment(asset("ETH", "ETH", "SECURED"))).toBe("ETH");
  });

  it("returns the bare symbol for NATIVE THOR assets", () => {
    expect(assetToUrlSegment(asset("RUNE", "THOR", "NATIVE"))).toBe("RUNE");
  });
});

describe("assetToNetworkParam", () => {
  it("returns undefined for Rujira/THORChain assets", () => {
    expect(assetToNetworkParam(asset("RUNE", "THOR"))).toBeUndefined();
    expect(
      assetToNetworkParam(asset("USDC", "ETH", "SECURED"))
    ).toBeUndefined();
    expect(assetToNetworkParam(asset("BTC", "BTC", "SECURED"))).toBeUndefined();
  });

  it("returns the chain for external (L1) assets, even on the canonical chain", () => {
    expect(assetToNetworkParam(asset("USDC", "ETH", "LAYER_1"))).toBe("ETH");
    expect(assetToNetworkParam(asset("USDC", "AVAX", "LAYER_1"))).toBe("AVAX");
    expect(assetToNetworkParam(asset("ATOM", "GAIA", "LAYER_1"))).toBe("GAIA");
    expect(assetToNetworkParam(asset("WBTC", "ETH", "LAYER_1"))).toBe("ETH");
    expect(assetToNetworkParam(asset("WBTC", "BASE", "LAYER_1"))).toBe("BASE");
  });
});

describe("assetToTradeUrlSegment", () => {
  it("returns the bare symbol for THOR-chain assets", () => {
    expect(assetToTradeUrlSegment(asset("RUNE", "THOR"))).toBe("RUNE");
  });

  it("returns the bare symbol when chain matches symbol", () => {
    expect(assetToTradeUrlSegment(asset("BTC", "BTC"))).toBe("BTC");
  });

  it("returns the bare symbol for an asset on its canonical chain", () => {
    expect(assetToTradeUrlSegment(asset("AAVE", "ETH"))).toBe("AAVE");
    expect(assetToTradeUrlSegment(asset("DAI", "ETH"))).toBe("DAI");
    expect(assetToTradeUrlSegment(asset("FOX", "ETH"))).toBe("FOX");
    expect(assetToTradeUrlSegment(asset("GUSD", "ETH"))).toBe("GUSD");
    expect(assetToTradeUrlSegment(asset("LINK", "ETH"))).toBe("LINK");
    expect(assetToTradeUrlSegment(asset("LUSD", "ETH"))).toBe("LUSD");
    expect(assetToTradeUrlSegment(asset("TGT", "ETH"))).toBe("TGT");
    expect(assetToTradeUrlSegment(asset("THOR", "ETH"))).toBe("THOR");
    expect(assetToTradeUrlSegment(asset("USDC", "ETH"))).toBe("USDC");
    expect(assetToTradeUrlSegment(asset("USDT", "ETH"))).toBe("USDT");
    expect(assetToTradeUrlSegment(asset("USDP", "ETH"))).toBe("USDP");
    expect(assetToTradeUrlSegment(asset("VTHOR", "ETH"))).toBe("VTHOR");
    expect(assetToTradeUrlSegment(asset("WBTC", "ETH"))).toBe("WBTC");
    expect(assetToTradeUrlSegment(asset("YFI", "ETH"))).toBe("YFI");
    expect(assetToTradeUrlSegment(asset("ATOM", "GAIA"))).toBe("ATOM");
    expect(assetToTradeUrlSegment(asset("BNB", "BSC"))).toBe("BNB");
    expect(assetToTradeUrlSegment(asset("cbBTC", "BASE"))).toBe("cbBTC");
  });

  it("suffixes the chain for the same symbol on a non-canonical chain", () => {
    expect(assetToTradeUrlSegment(asset("ETH", "BASE"))).toBe("ETH.BASE");
    expect(assetToTradeUrlSegment(asset("USDC", "AVAX"))).toBe("USDC.AVAX");
    expect(assetToTradeUrlSegment(asset("USDC", "BASE"))).toBe("USDC.BASE");
    expect(assetToTradeUrlSegment(asset("USDC", "BSC"))).toBe("USDC.BSC");
  });

  it("suffixes the chain for symbols with no canonical-chain entry", () => {
    expect(assetToTradeUrlSegment(asset("DPI", "ETH"))).toBe("DPI.ETH");
    expect(assetToTradeUrlSegment(asset("SNX", "ETH"))).toBe("SNX.ETH");
  });

  it("suffixes the chain for a canonical symbol on a non-home chain", () => {
    expect(assetToTradeUrlSegment(asset("WBTC", "BASE"))).toBe("WBTC.BASE");
  });
});

describe("assetToLendUrlSegment", () => {
  it("uses a bare symbol for the canonical chain", () => {
    expect(assetToLendUrlSegment(asset("USDC", "ETH"))).toBe("USDC");
    expect(assetToLendUrlSegment(asset("ETH", "ETH"))).toBe("ETH");
  });

  it("suffixes non-canonical chains for multichain vault symbols", () => {
    expect(assetToLendUrlSegment(asset("USDC", "AVAX"))).toBe("USDC.AVAX");
    expect(assetToLendUrlSegment(asset("USDC", "BASE"))).toBe("USDC.BASE");
  });
});

describe("findAssetByUrlSegment", () => {
  const assets = [
    asset("BTC", "BTC"),
    asset("USDC", "ETH"),
    asset("ETH", "BASE"),
    asset("USDT", "ETH"),
  ];

  it("finds an asset by its canonical segment", () => {
    expect(findAssetByUrlSegment("BTC", assets)).toBe(assets[0]);
    expect(findAssetByUrlSegment("USDC", assets)).toBe(assets[1]);
    expect(findAssetByUrlSegment("USDT", assets)).toBe(assets[3]);
  });

  it("falls back to matching symbol+chain via legacy [SYMBOL].[CHAIN] segment", () => {
    expect(findAssetByUrlSegment("ETH.BASE", assets)).toBe(assets[2]);
    expect(findAssetByUrlSegment("USDT.ETH", assets)).toBe(assets[3]);
  });

  it("returns undefined when nothing matches", () => {
    expect(findAssetByUrlSegment("FOO", assets)).toBeUndefined();
    expect(findAssetByUrlSegment("FOO.BAR", assets)).toBeUndefined();
  });

  it("matches an asset regardless of native/secured type when segments collide", () => {
    const nativeBtc = asset("BTC", "BTC", "LAYER_1");
    const securedBtc = asset("BTC", "BTC", "SECURED");
    const mixed = [nativeBtc, securedBtc];
    const match = findAssetByUrlSegment("BTC", mixed);
    expect(match?.metadata.symbol).toBe("BTC");
    expect(match?.chain).toBe("BTC");
  });

  it("prefers the chainParam match when provided", () => {
    const usdcEth = asset("USDC", "ETH");
    const usdcAvax = asset("USDC", "AVAX");
    const mixed = [usdcEth, usdcAvax];
    expect(findAssetByUrlSegment("USDC", mixed, "AVAX")).toBe(usdcAvax);
    expect(findAssetByUrlSegment("USDC", mixed)).toBe(usdcEth);
  });

  it("disambiguates SECURED vs LAYER_1 sharing a chain via the chainParam", () => {
    const securedUsdc = asset("USDC", "ETH", "SECURED");
    const layer1Usdc = asset("USDC", "ETH", "LAYER_1");
    const mixed = [securedUsdc, layer1Usdc];
    // A chain param means the external (L1) variant.
    expect(findAssetByUrlSegment("USDC", mixed, "ETH")).toBe(layer1Usdc);
    // No chain param means the Rujira (SECURED) variant.
    expect(findAssetByUrlSegment("USDC", mixed)).toBe(securedUsdc);
  });

  it("resolves a chain-suffixed segment to the SECURED vs LAYER_1 variant", () => {
    const securedAvax = asset("USDC", "AVAX", "SECURED");
    const layer1Avax = asset("USDC", "AVAX", "LAYER_1");
    const securedEth = asset("USDC", "ETH", "SECURED");
    const mixed = [securedEth, securedAvax, layer1Avax];
    // "USDC.AVAX?toChain=AVAX" -> external (L1) Avalanche variant.
    expect(findAssetByUrlSegment("USDC.AVAX", mixed, "AVAX")).toBe(layer1Avax);
    // "USDC.AVAX" -> Rujira (SECURED) Avalanche variant, not the ETH one.
    expect(findAssetByUrlSegment("USDC.AVAX", mixed)).toBe(securedAvax);
  });
});

describe("normalizeChainParam", () => {
  it("treats an omitted param as undefined", () => {
    expect(normalizeChainParam(undefined)).toBeUndefined();
    expect(normalizeChainParam(null)).toBeUndefined();
    expect(normalizeChainParam("")).toBeUndefined();
  });

  it("treats THOR/RUJIRA as omitted, regardless of case", () => {
    expect(normalizeChainParam("THOR")).toBeUndefined();
    expect(normalizeChainParam("thor")).toBeUndefined();
    expect(normalizeChainParam("RUJIRA")).toBeUndefined();
    expect(normalizeChainParam("Rujira")).toBeUndefined();
  });

  it("returns any other chain unchanged", () => {
    expect(normalizeChainParam("ETH")).toBe("ETH");
    expect(normalizeChainParam("AVAX")).toBe("AVAX");
  });
});

describe("normalizeTradeSegment", () => {
  it("leaves segments that already contain a chain unchanged", () => {
    expect(normalizeTradeSegment("USDT.ETH")).toBe("USDT.ETH");
    expect(normalizeTradeSegment("WBTC.BASE")).toBe("WBTC.BASE");
    expect(normalizeTradeSegment("BTC.BTC")).toBe("BTC.BTC");
  });

  it("leaves USDC and symbols whose chain matches the symbol unchanged", () => {
    expect(normalizeTradeSegment("USDC")).toBe("USDC");
    expect(normalizeTradeSegment("BTC")).toBe("BTC");
    expect(normalizeTradeSegment("RUNE")).toBe("RUNE");
  });

  it("appends the canonical chain for bare symbols whose chain differs from the symbol", () => {
    expect(normalizeTradeSegment("AAVE")).toBe("AAVE.ETH");
    expect(normalizeTradeSegment("DAI")).toBe("DAI.ETH");
    expect(normalizeTradeSegment("FOX")).toBe("FOX.ETH");
    expect(normalizeTradeSegment("GUSD")).toBe("GUSD.ETH");
    expect(normalizeTradeSegment("LINK")).toBe("LINK.ETH");
    expect(normalizeTradeSegment("LUSD")).toBe("LUSD.ETH");
    expect(normalizeTradeSegment("TGT")).toBe("TGT.ETH");
    expect(normalizeTradeSegment("THOR")).toBe("THOR.ETH");
    expect(normalizeTradeSegment("USDT")).toBe("USDT.ETH");
    expect(normalizeTradeSegment("USDP")).toBe("USDP.ETH");
    expect(normalizeTradeSegment("VTHOR")).toBe("VTHOR.ETH");
    expect(normalizeTradeSegment("WBTC")).toBe("WBTC.ETH");
    expect(normalizeTradeSegment("YFI")).toBe("YFI.ETH");
    expect(normalizeTradeSegment("ATOM")).toBe("ATOM.GAIA");
    expect(normalizeTradeSegment("BNB")).toBe("BNB.BSC");
    expect(normalizeTradeSegment("cbBTC")).toBe("cbBTC.BASE");
  });
});

describe("parseUrlSegment", () => {
  it("parses a bare symbol as chain === symbol", () => {
    expect(parseUrlSegment("BTC")).toEqual({
      chain: "BTC",
      metadata: { symbol: "BTC" },
    });
  });

  it("parses a [SYMBOL].[CHAIN] segment", () => {
    expect(parseUrlSegment("SOL.AVAX")).toEqual({
      chain: "AVAX",
      metadata: { symbol: "SOL" },
    });
  });

  it("uses the chainParam when the segment has no chain", () => {
    expect(parseUrlSegment("USDC", "AVAX")).toEqual({
      chain: "AVAX",
      metadata: { symbol: "USDC" },
    });
  });
});
