import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_API_ORIGIN = "https://api.rujira.network";
const PAGE_SIZE = 100;
const NATIVE_SWAP_ASSETS = ["RUNE"];
const BORROW_DEBT_SYMBOLS = ["USDC", "USDT", "BTC", "ETH"];

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageRoot = join(__dirname, "..");
const require = createRequire(import.meta.url);
registerTypescript();
const { assetToTradeUrlSegment } = require("../src/services/assetUrl.ts");
const {
  buildSwapSeoRoutesFromLiveAssets,
  getProductSeo,
  PRODUCT_SEO_LOCALES,
  SITE_ORIGIN,
  staticProductSeoCopy,
} = require("../src/seo/productSeo.ts");
const DEFAULT_ORIGIN = SITE_ORIGIN;
const STATIC_ROUTE_DEFAULTS = {
  "/borrow": "/borrow/BTC/USDC",
};
const STATIC_ROUTES = Object.keys(staticProductSeoCopy.en).map(
  (path) => STATIC_ROUTE_DEFAULTS[path] || path
);

loadEnvFile(join(packageRoot, ".env"));
loadEnvFile(join(packageRoot, `.env.${process.env.NETWORK || "main"}`));

const origin = normalizeOrigin(process.env.SITEMAP_ORIGIN || DEFAULT_ORIGIN);
const apiOrigin = process.env.VITE_API || DEFAULT_API_ORIGIN;
const graphqlEndpoint =
  process.env.SITEMAP_GRAPHQL_ENDPOINT || new URL("/api", apiOrigin).toString();

const FIN_QUERY = `
  query ProductSitemapFin($first: Int!, $after: String) {
    finV2(first: $first, after: $after, sortBy: NAME, sortDir: ASC) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          assetBase {
            chain
            metadata {
              symbol
            }
          }
          assetQuote {
            chain
            metadata {
              symbol
            }
          }
        }
      }
    }
  }
`;

const SWAP_QUERY = `
  query ProductSitemapSwap {
    thorchainV2 {
      pools {
        status
        asset {
          metadata {
            symbol
          }
        }
      }
    }
  }
`;

const INDEX_QUERY = `
  query ProductSitemapIndex {
    index {
      id
      shareAsset {
        metadata {
          symbol
        }
      }
    }
  }
`;

const STRATEGY_QUERY = `
  query ProductSitemapStrategies($first: Int!, $after: String) {
    strategies(
      first: $first
      after: $after
      typenames: ["BowPoolXyk", "StakingPool", "GhostVault"]
      sortBy: NAME
      sortDir: ASC
    ) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          __typename
          ... on BowPoolXyk {
            id
            config {
              x {
                metadata {
                  symbol
                }
              }
              y {
                metadata {
                  symbol
                }
              }
            }
          }
          ... on StakingPool {
            id
            bondAsset {
              chain
              type
              metadata {
                symbol
              }
            }
          }
          ... on GhostVault {
            id
            asset {
              asset
              chain
              metadata {
                symbol
              }
            }
          }
        }
      }
    }
  }
`;

const BORROW_QUERY = `
  query ProductSitemapBorrow {
    ghostCredit {
      collaterals {
        asset {
          asset
          chain
          type
          metadata {
            symbol
          }
        }
      }
      vaults {
        borrower {
          asset {
            asset
            chain
            type
            metadata {
              symbol
            }
          }
        }
      }
    }
  }
`;

const graphql = async (query, variables = {}) => {
  const response = await fetch(graphqlEndpoint, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(
      `GraphQL request failed: ${response.status} ${response.statusText}`
    );
  }

  const json = await response.json();
  if (json.errors?.length) {
    throw new Error(
      `GraphQL errors: ${json.errors.map((e) => e.message).join("; ")}`
    );
  }

  return json.data;
};

const fetchConnection = async (query, connectionName) => {
  const nodes = [];
  let after = null;

  do {
    const data = await graphql(query, { first: PAGE_SIZE, after });
    const connection = data?.[connectionName];

    if (!connection) {
      throw new Error(`Missing GraphQL connection: ${connectionName}`);
    }

    for (const edge of connection.edges || []) {
      if (edge?.node) nodes.push(edge.node);
    }

    after = connection.pageInfo?.hasNextPage
      ? connection.pageInfo.endCursor
      : null;
  } while (after);

  return nodes;
};

const symbol = (value) => {
  const token = typeof value === "string" ? value.trim() : "";
  return token || null;
};

const pathSegment = (value) => encodeURIComponent(value);

const assetUrlSegment = (asset) => {
  const sym = symbol(asset?.metadata?.symbol);
  const chain = symbol(asset?.chain);

  if (!sym || !chain) return null;
  return assetToTradeUrlSegment({
    chain,
    type: asset?.type,
    metadata: { symbol: sym },
  });
};

const route = (path) => {
  if (String(path || "").includes("#")) {
    throw new Error(`Sitemap route must not include hash: ${path}`);
  }

  return normalizeRoute(path);
};

const canonicalProductLoc = (path, locale) => {
  const normalizedRoute = route(path);
  const seo = getProductSeo(normalizedRoute, locale);

  if (!seo) {
    throw new Error(
      `Missing product SEO for sitemap route: ${normalizedRoute} (${locale})`
    );
  }

  if (/\bnoindex\b/i.test(seo.robots || "")) return null;
  if (!seo.canonical) {
    throw new Error(
      `Missing canonical URL for sitemap route: ${normalizedRoute}`
    );
  }

  return seo.canonical;
};

const canonicalProductLocs = (path) =>
  PRODUCT_SEO_LOCALES.flatMap((locale) => {
    const loc = canonicalProductLoc(path, locale);
    return loc ? [loc] : [];
  });

const tradeRoutes = (pairs) =>
  pairs.flatMap((pair) => {
    const base = assetUrlSegment(pair.assetBase);
    const quote = assetUrlSegment(pair.assetQuote);

    if (!base || !quote) return [];

    const pairPath = `/trade/${pathSegment(base)}/${pathSegment(quote)}`;

    return [pairPath, `${pairPath}?type=automated`];
  });

const swapRoutes = async () => {
  const data = await graphql(SWAP_QUERY);
  const poolSymbols =
    data?.thorchainV2?.pools
      ?.filter((pool) => pool?.status === "AVAILABLE")
      .map((pool) => symbol(pool?.asset?.metadata?.symbol))
      .filter(Boolean) || [];

  return buildSwapSeoRoutesFromLiveAssets([
    ...NATIVE_SWAP_ASSETS,
    ...poolSymbols,
  ]);
};

const indexRoutes = async () => {
  const data = await graphql(INDEX_QUERY);

  return (data?.index || []).flatMap((index) => {
    const shareSymbol = symbol(index?.shareAsset?.metadata?.symbol);
    return shareSymbol ? [`/index/${pathSegment(shareSymbol)}`] : [];
  });
};

const strategyRoutes = (strategies) =>
  strategies.flatMap((strategy) => {
    switch (strategy.__typename) {
      case "BowPoolXyk": {
        const x = symbol(strategy.config?.x?.metadata?.symbol);
        const y = symbol(strategy.config?.y?.metadata?.symbol);
        return x && y
          ? [`/strategies/amm/xyk/${pathSegment(x)}-${pathSegment(y)}`]
          : [];
      }
      case "StakingPool": {
        const bond = assetUrlSegment(strategy.bondAsset);
        return bond ? [`/stake/${pathSegment(bond)}`] : [];
      }
      case "GhostVault": {
        const asset = assetUrlSegment(strategy.asset);
        return asset ? [`/lend/${pathSegment(asset)}`] : [];
      }
      default:
        return [];
    }
  });

const borrowRoutes = (ghostCredit) => {
  const collaterals = ghostCredit?.collaterals || [];
  const vaultAssets =
    ghostCredit?.vaults
      ?.map((vault) => vault?.borrower?.asset)
      .filter(Boolean) || [];

  const debtAssets = BORROW_DEBT_SYMBOLS.flatMap((targetSymbol) => {
    const debt =
      vaultAssets.find(
        (asset) =>
          symbol(asset?.metadata?.symbol) === targetSymbol &&
          assetUrlSegment(asset) === targetSymbol
      ) ||
      vaultAssets.find(
        (asset) => symbol(asset?.metadata?.symbol) === targetSymbol
      );

    return debt ? [debt] : [];
  });

  const routes = collaterals.flatMap((collateral) => {
    const collateralAsset = collateral?.asset;
    const collateralSegment = assetUrlSegment(collateralAsset);
    const collateralSymbol = symbol(collateralAsset?.metadata?.symbol);

    if (!collateralSegment || !collateralSymbol) return [];

    return debtAssets.flatMap((debtAsset) => {
      const debtSegment = assetUrlSegment(debtAsset);
      const debtSymbol = symbol(debtAsset?.metadata?.symbol);

      if (!debtSegment || !debtSymbol) return [];
      if (collateralSegment === debtSegment) return [];

      return [
        `/borrow/${pathSegment(collateralSegment)}/${pathSegment(debtSegment)}`,
      ];
    });
  });

  return [...new Set(routes)].sort((a, b) => a.localeCompare(b));
};

const buildSitemap = (locs) => {
  const xmlEntries = locs
    .map((loc) => {
      const priority = loc === `${origin}/` ? "1.0" : "0.7";
      return [
        "  <url>",
        `    <loc>${escapeXml(loc)}</loc>`,
        "    <changefreq>weekly</changefreq>",
        `    <priority>${priority}</priority>`,
        "  </url>",
      ].join("\n");
    })
    .join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    xmlEntries,
    "</urlset>",
    "",
  ].join("\n");
};

const main = async () => {
  const [pairs, swaps, indexes, strategies, borrowData] = await Promise.all([
    fetchConnection(FIN_QUERY, "finV2"),
    swapRoutes(),
    indexRoutes(),
    fetchConnection(STRATEGY_QUERY, "strategies"),
    graphql(BORROW_QUERY),
  ]);
  const borrows = borrowRoutes(borrowData?.ghostCredit);

  const routes = [
    ...STATIC_ROUTES,
    ...tradeRoutes(pairs),
    ...swaps,
    ...indexes,
    ...strategyRoutes(strategies),
    ...borrows,
  ];

  const locs = [
    ...new Set(
      routes.flatMap((path) => {
        return canonicalProductLocs(path);
      })
    ),
  ].sort((a, b) => a.localeCompare(b));

  validateLocs(locs);

  const sitemap = buildSitemap(locs);
  const outputPath = join(packageRoot, "public", "sitemap-product.xml");

  writeFileSync(outputPath, sitemap, "utf8");

  console.log(`Product sitemap generated at ${outputPath}`);
  console.log(`URLs: ${locs.length}`);
  console.log(`Locales: ${PRODUCT_SEO_LOCALES.join(", ")}`);
  console.log(`Static routes: ${STATIC_ROUTES.length}`);
  console.log(`Trade SEO routes: ${tradeRoutes(pairs).length}`);
  console.log(`Swap SEO routes: ${swaps.length}`);
  console.log(`Index assets: ${indexes.length}`);
  console.log(`Strategy pages: ${strategyRoutes(strategies).length}`);
  console.log(`Borrow routes: ${borrows.length}`);
};

function validateLocs(locs) {
  const seen = new Set();
  for (const loc of locs) {
    if (seen.has(loc)) throw new Error(`Duplicate sitemap URL: ${loc}`);
    seen.add(loc);

    const url = new URL(loc);
    if (url.origin !== origin) throw new Error(`Unexpected origin: ${loc}`);
    if (url.hash) {
      throw new Error(`Sitemap URL must not include hash: ${loc}`);
    }
    if (url.search) {
      const params = [...url.searchParams.entries()];
      if (params.length !== 1 || url.searchParams.get("type") !== "automated") {
        throw new Error(`Unexpected sitemap query: ${loc}`);
      }
    }
    if (url.pathname !== "/" && url.pathname.endsWith("/")) {
      throw new Error(`Sitemap URL must not include trailing slash: ${loc}`);
    }
  }
}

function normalizeOrigin(value) {
  const url = new URL(value);
  url.pathname = "/";
  url.search = "";
  url.hash = "";
  return url.toString().replace(/\/$/, "");
}

function normalizePath(value) {
  let path =
    String(value || "")
      .trim()
      .split(/[?#]/, 1)[0] || "/";
  if (!path.startsWith("/")) path = `/${path}`;
  path = path.replace(/\/{2,}/g, "/");
  return path !== "/" ? path.replace(/\/+$/, "") : "/";
}

function normalizeRoute(value) {
  const raw = String(value || "").trim();
  const queryIndex = raw.indexOf("?");
  const pathPart = queryIndex === -1 ? raw : raw.slice(0, queryIndex);
  const queryPart = queryIndex === -1 ? "" : raw.slice(queryIndex + 1);
  const path = normalizePath(pathPart);

  if (!queryPart) return path;

  const params = new URLSearchParams(queryPart);
  const entries = [...params.entries()];
  if (entries.length === 1 && params.get("type") === "automated") {
    return `${path}?type=automated`;
  }

  throw new Error(`Unsupported sitemap route query: ${value}`);
}

function escapeXml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function loadEnvFile(path) {
  if (!existsSync(path)) return;

  const lines = readFileSync(path, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) continue;

    const [, key, rawValue] = match;
    if (process.env[key] !== undefined) continue;

    process.env[key] = rawValue
      .trim()
      .replace(/^(['"])(.*)\1$/, "$2")
      .replace(/\\n/g, "\n");
  }
}

function registerTypescript() {
  const ts = require("typescript");

  require.extensions[".ts"] = (module, filename) => {
    const source = readFileSync(filename, "utf8");
    const output = ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        esModuleInterop: true,
        resolveJsonModule: true,
      },
      fileName: filename,
    }).outputText;

    module._compile(output, filename);
  };
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
