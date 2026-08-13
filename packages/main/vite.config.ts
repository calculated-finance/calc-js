import { transformSync } from "@babel/core";
import dsv from "@rollup/plugin-dsv";
import inject from "@rollup/plugin-inject";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import react from "@vitejs/plugin-react-swc";
import vultisig from "@vultisig/sdk/vite";
import { exec } from "child_process";
import * as fs from "fs/promises";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";
import { promisify } from "util";
import type { Plugin } from "vite";
import { defineConfig, PluginOption } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import wasm from "vite-plugin-wasm";

const branch = process.env.NETWORK || "stage";
const execAsync = promisify(exec);
const rujiraUiRoot = path.resolve(__dirname, "../rujira.ui/src");
const rujiraJsRoot = path.resolve(__dirname, "../rujira.js/src");

function vultisigSdkShim(): Plugin {
  return {
    name: "resolve-polyfill-shims",
    resolveId(id) {
      if (id === "vite-plugin-node-polyfills/shims/buffer") {
        return { id: "\0polyfill-buffer", external: false };
      }
      if (id === "vite-plugin-node-polyfills/shims/process") {
        return { id: "\0polyfill-process", external: false };
      }
      if (id === "vite-plugin-node-polyfills/shims/global") {
        return { id: "\0polyfill-global", external: false };
      }
      return null;
    },
    load(id) {
      if (id === "\0polyfill-buffer") {
        return 'import { Buffer } from "buffer"; export { Buffer }; export default Buffer;';
      }
      if (id === "\0polyfill-process") {
        return 'import process from "process/browser"; export { process }; export default process;';
      }
      if (id === "\0polyfill-global") {
        return "export default globalThis;";
      }
      return null;
    },
  };
}

// Replaces vite-plugin-relay, which passes no options to babel-plugin-relay.
// babel-plugin-relay can't read `eagerEsModules` out of our multi-project
// relay.config.json, and without it emits require() into ESM output.
function relay(): PluginOption {
  return {
    name: "vite-plugin-relay-inline",
    transform(src, id) {
      if (!/\.(t|j)sx?/.test(id) || !src.includes("graphql`")) return null;
      const out = transformSync(src, {
        plugins: [["babel-plugin-relay", { eagerEsModules: true }]],
        code: true,
        filename: id,
        sourceMaps: true,
      });
      if (!out?.code) {
        throw new Error(`vite-plugin-relay-inline: failed to transform ${id}`);
      }
      return { code: out.code, map: out.map };
    },
  };
}

type SchemaSource = { envVar: "VITE_API" | "VITE_ANALYTICS_API"; schemaPath: string };

const schemaSources: SchemaSource[] = [
  { envVar: "VITE_API", schemaPath: "./data/schema.graphql" },
  { envVar: "VITE_ANALYTICS_API", schemaPath: "./data/analytics-schema.graphql" },
];

function verifySchema(): PluginOption {
  let isBuild = false;
  let apis: Record<string, string | undefined> = {};

  const fetchSchema = async (
    warn: (msg: string) => void,
    { envVar, schemaPath }: SchemaSource
  ): Promise<boolean> => {
    const api = apis[envVar];
    if (!api) {
      warn(`${envVar} not set; skipping schema fetch for ${schemaPath}.`);
      return false;
    }
    const endpoint = `${api}/api/schema/RujiraWeb.Schema`;
    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        warn(
          `Failed to fetch GraphQL schema from ${endpoint} (${response.status}); skipping.`
        );
        return false;
      }
      const schemaContent = await response.text();
      if (!schemaContent || schemaContent.trim() === "") {
        warn(`Received empty GraphQL schema from ${endpoint}; skipping.`);
        return false;
      }
      await fs.writeFile(schemaPath, schemaContent, "utf8");
      return true;
    } catch (error) {
      warn(`Schema fetch from ${endpoint} failed; skipping. ${String(error)}`);
      return false;
    }
  };

  return {
    name: "vite-relay-plugin",

    configResolved(config) {
      isBuild = config.command === "build";
      apis = {
        VITE_API: config.env.VITE_API,
        VITE_ANALYTICS_API: config.env.VITE_ANALYTICS_API,
      };
    },

    async buildStart() {
      if (!isBuild) return;
      const results = await Promise.all(
        schemaSources.map((source) => fetchSchema((msg) => this.warn(msg), source))
      );
      if (!results.some(Boolean)) {
        this.warn("No GraphQL schemas fetched; skipping relay compile.");
        return;
      }
      try {
        await execAsync(`pnpm run relay`);
      } catch (error) {
        this.warn(`Relay compile failed. ${String(error)}`);
      }
    },
  };
}

// https://vitejs.dev/config/
const devConditions = ["development", "module", "browser", "import", "default"];

export default defineConfig({
  mode: branch,
  optimizeDeps: {
    include: ["ton-core"],
    esbuildOptions: {
      keepNames: true, // Optional: Avoid function name mangling
      define: {
        global: "globalThis",
      },
      conditions: devConditions,
    },
  },
  plugins: [
    wasm(),
    vultisigSdkShim(), // Handle SDK's polyfill shim imports
    nodePolyfills({
      exclude: ["fs"], // fs not available in browser
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      protocolImports: true,
    }),
    inject({
      Buffer: ["buffer", "Buffer"],
      exclude: [
        "**/node_modules/**",
        "**/signers/cosmos/rpc/comet38/encodings.ts",
        "**/signers/cosmos/types/varint.ts",
        "**/signers/cosmos/proto-signing/registry.ts",
        "**/signers/cosmos/types/helpers.ts",
        "**/rujira.js/src/msgs/exec.ts",
      ],
    }),
    react(),
    vultisig(),
    relay(),
    dsv(),
    visualizer({ filename: "bundle.html", open: true }),
    sentryVitePlugin({
      org: "rujira",
      project: "rujira",
    }),
    verifySchema(),
  ],
  resolve: {
    conditions: devConditions,
    alias: [
      {
        find: new RegExp("^rujira\\.ui/scss/"),
        replacement: `${rujiraUiRoot}/scss/`,
      },
      {
        find: new RegExp("^rujira\\.ui/assets/"),
        replacement: `${rujiraUiRoot}/assets/`,
      },
      {
        find: "rujira.ui",
        replacement: `${rujiraUiRoot}/index.ts`,
      },
      {
        find: "rujira.js",
        replacement: `${rujiraJsRoot}/index.ts`,
      },
      { find: "buffer", replacement: "buffer/" },
      { find: "crypto", replacement: "crypto-browserify" },
      { find: "stream", replacement: "stream-browserify" },
      { find: "borsh", replacement: "./src/shims/borsh.ts" },

      {
        find: "tweetnacl-util",
        replacement: path.resolve(__dirname, "src/shims/tweetnacl-util.ts"),
      },
    ],
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler", // or "modern"
      },
    },
  },
  define: {
    __APP_VERSION__: JSON.stringify(process.env.VERCEL_GIT_COMMIT_SHA),
    global: "globalThis",
  },
  build: {
    target: "esnext",
    sourcemap: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("@vultisig/sdk")) {
            return "vultisig";
          }
          if (
            id.includes("@trustwallet/wallet-core") ||
            id.includes("protobufjs")
          ) {
            return "trustwallet";
          }
          if (id.includes("cosmjs")) {
            return "cosmjs";
          }
          if (id.includes("charts")) {
            return "charts";
          }
          if (id.includes("rujira.ui") || id.includes("rujira.js")) {
            return "rujira";
          }
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },
  },
});
