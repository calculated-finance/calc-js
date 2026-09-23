import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";

import { defineConfig, type ProxyOptions } from "vite";

/**
 * The Rujira indexer's CORS whitelist doesn't include our origins, so the
 * browser talks to it through this same-origin proxy. Origin headers are
 * stripped server-side: the API accepts origin-less requests (curl does),
 * it only rejects browser origins it doesn't know.
 */
const rujiraProxy: ProxyOptions = {
  target: "https://api.rujira.network",
  changeOrigin: true,
  ws: true,
  rewrite: (path) => path.replace(/^\/rujira/, ""),
  configure: (proxy) => {
    proxy.on("proxyReq", (proxyReq) => {
      proxyReq.removeHeader("origin");
    });
    proxy.on("proxyReqWs", (proxyReq) => {
      proxyReq.removeHeader("origin");
    });
  },
};

export default defineConfig({
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@/hooks": new URL("./src/hooks", import.meta.url).pathname,
      "@": new URL("./src", import.meta.url).pathname,
      "@template/domain": new URL("../domain/src", import.meta.url).pathname,
    },
  },
  server: {
    proxy: { "/rujira": rujiraProxy },
  },
  preview: {
    proxy: { "/rujira": rujiraProxy },
  },
});
