import path from "node:path";
import fs from "fs/promises";

import CONFIG from "./config.ts";

let fileName = process.argv.slice(2)[0];

const MD_DIR_PATH = CONFIG.MD_DIR_PATH;

if (!fileName) {
  console.error("Error: No file name provided!");
  process.exit(1);
}

const filePath = path.join(MD_DIR_PATH, `${fileName}.md`);
await fs.stat(filePath);

const [meta, content] = (await fs.readFile(filePath, "utf-8")).split(
  "=== meta ===",
);

const metaTransform = meta.replace(
  "updatedAt: null",
  "updatedAt: " + Date.now(),
);

await fs.writeFile(
  filePath,
  `${metaTransform}=== meta ===${content}
`,
);

console.log(fileName + ".md updated!");
