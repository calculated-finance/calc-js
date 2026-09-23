// Lints the domain and worker packages; the client carries its own stricter
// typed-lint config in packages/client/eslint.config.js.
import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config([
  { ignores: ["repos/**", "**/dist/**", "**/build/**", "packages/client/**"] },
  {
    files: ["packages/domain/src/**/*.ts", "packages/domain/test/**/*.ts", "packages/worker/src/**/*.ts"],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    rules: {
      // Chain payloads cross several untyped boundaries in the worker; keep
      // the untyped ruleset pragmatic and let reviews police new casts.
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
]);
