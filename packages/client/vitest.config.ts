import * as path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    setupFiles: [path.join(__dirname, "test", "setup.ts")],
    alias: {
      "@template/domain": path.join(__dirname, "..", "domain", "src"),
    },
  },
});
