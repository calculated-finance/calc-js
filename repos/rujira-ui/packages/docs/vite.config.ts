import dsv from "@rollup/plugin-dsv";
import react from "@vitejs/plugin-react-swc";
import vultisig from "@vultisig/sdk/vite";
import fs from "fs";
import path from "path";
import { defineConfig } from "vite";

const devConditions = ["development", "module", "browser", "import", "default"];
const rujiraUiRoot = path.resolve(__dirname, "../rujira.ui/src");
const rujiraJsRoot = path.resolve(__dirname, "../rujira.js/src");

// Real path so esbuild can find buffer's deps (base64-js, ieee754) as pnpm store siblings
const bufferRealPath = path.join(
  fs.realpathSync(path.resolve(__dirname, "node_modules/buffer")),
  "index.js"
);

// https://vitejs.dev/config/
export default defineConfig({
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
    ],
  },
  optimizeDeps: {
    include: ["buffer"],
    esbuildOptions: {
      plugins: [
        {
          name: "buffer-real-path",
          setup(build) {
            build.onResolve({ filter: /^buffer$/ }, () => ({
              path: bufferRealPath,
            }));
          },
        },
      ],
      define: {
        global: "globalThis",
      },
      conditions: devConditions,
    },
  },
  define: {
    global: "globalThis",
  },
  build: {
    target: "esnext",
  },
  plugins: [react(), vultisig(), dsv()],
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
      },
    },
  },
});
