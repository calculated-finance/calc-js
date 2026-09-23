const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const sourceAssetsDir = path.join(rootDir, "src/assets");
const targetAssetDirs = [
  path.join(rootDir, "lib/esm/assets"),
  path.join(rootDir, "lib/cjs/assets"),
];

const copyAssets = (targetDir) => {
  fs.mkdirSync(targetDir, { recursive: true });
  fs.cpSync(sourceAssetsDir, targetDir, {
    recursive: true,
    force: true,
  });
};

for (const targetDir of targetAssetDirs) {
  copyAssets(targetDir);
}
