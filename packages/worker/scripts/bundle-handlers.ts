import { build } from "esbuild";
import * as Fs from "fs";

const outdir = "./dist/handlers";

(async () => {
  try {
    Fs.rmSync(outdir, { recursive: true, force: true });

    const res = await build({
      entryPoints: [
        "./src/handlers/executor/app.ts",
        "./src/handlers/counter/app.ts",
        "./src/handlers/tvl/app.ts",
        "./src/handlers/prices/app.ts",
      ],
      outdir,
      minify: true,
      sourcemap: false,
      bundle: true,
      platform: "node",
      target: "node20",
      format: "cjs",
    });

    if (res.warnings.length > 0) {
      console.log(`WARNINGS: ${res.warnings}`);
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
