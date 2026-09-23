const fs = require("fs");
const path = require("path");

const writeType = (dir, type) => {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    path.join(dir, "package.json"),
    JSON.stringify({ type }, null, 2) + "\n"
  );
};

writeType(path.resolve(__dirname, "../lib/cjs"), "commonjs");
writeType(path.resolve(__dirname, "../lib/esm"), "module");
