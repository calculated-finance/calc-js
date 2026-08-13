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

// Prepend vite/client reference to index.d.ts so consumers without Vite
// can resolve PNG/SVG module declarations from distributed type declarations.
const esmIndexDts = path.resolve(__dirname, "../lib/esm/index.d.ts");
if (fs.existsSync(esmIndexDts)) {
  const existing = fs.readFileSync(esmIndexDts, "utf8");
  const reference = '/// <reference types="vite/client" />\n';
  if (!existing.includes(reference)) {
    fs.writeFileSync(esmIndexDts, reference + existing);
  }
}
