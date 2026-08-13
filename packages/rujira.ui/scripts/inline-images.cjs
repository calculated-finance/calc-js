const fs = require("fs");
const path = require("path");

const MIME = { png: "image/png", gif: "image/gif" };

// import name from "...assets/x.png";
const SINGLE_RE =
  /^import\s+(\w+)\s+from\s+"((?:\.\.\/)*assets\/[^"]+\.(png|gif))";$/gm;

// import { default as a, default as b, } from "...assets/x.png";
const MULTI_RE =
  /^import\s+\{([^}]+)\}\s+from\s+"((?:\.\.\/)*assets\/[^"]+\.(png|gif))";$/gm;

const toDataUrl = (filePath) => {
  const ext = path.extname(filePath).slice(1).toLowerCase();
  const b64 = fs.readFileSync(filePath).toString("base64");
  return `data:${MIME[ext]};base64,${b64}`;
};

const processFile = (filePath, rootDir) => {
  let src = fs.readFileSync(filePath, "utf8");
  let changed = false;

  src = src.replace(SINGLE_RE, (_, name, rel, _ext) => {
    const abs = path.resolve(path.dirname(filePath), rel);
    if (!fs.existsSync(abs)) { console.warn(`  [skip] ${abs}`); return _; }
    changed = true;
    return `const ${name} = "${toDataUrl(abs)}";`;
  });

  src = src.replace(MULTI_RE, (_, aliases, rel, _ext) => {
    const abs = path.resolve(path.dirname(filePath), rel);
    if (!fs.existsSync(abs)) { console.warn(`  [skip] ${abs}`); return _; }
    changed = true;
    const names = [...aliases.matchAll(/default\s+as\s+(\w+)/g)].map((m) => m[1]);
    const dataUrl = toDataUrl(abs);
    // first name holds the value, rest alias it
    const [first, ...rest] = names;
    const lines = [`const ${first} = "${dataUrl}";`];
    rest.forEach((n) => lines.push(`const ${n} = ${first};`));
    return lines.join("\n");
  });

  if (changed) {
    fs.writeFileSync(filePath, src);
    console.log(`  inlined: ${path.relative(rootDir, filePath)}`);
  }
};

const walk = (dir, rootDir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, rootDir);
    else if (entry.name.endsWith(".js")) processFile(full, rootDir);
  }
};

const rootDir = path.resolve(__dirname, "..");
console.log("Inlining image imports…");
for (const outDir of ["lib/esm", "lib/cjs"]) {
  const dir = path.join(rootDir, outDir);
  if (fs.existsSync(dir)) walk(dir, rootDir);
}
console.log("Done.");
