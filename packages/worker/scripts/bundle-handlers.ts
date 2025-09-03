import { build } from "esbuild";
import * as Fs from "fs";

const outdir = "./dist/consumer";

(async () => {
  try {
    Fs.rmSync(outdir, { recursive: true, force: true });

    const res = await build({
      entryPoints: ["./src/consumer.ts"],
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
