import path from "node:path";
import fs from "fs/promises";

import CONFIG from "./config.ts";

let fileName = process.argv.slice(2)[0];

const MD_DIR_PATH = CONFIG.MD_DIR_PATH;

if (!fileName) {
  fileName = "template";
}

const filePath = path.join(MD_DIR_PATH, `${fileName}.md`);

try {
  await fs.stat(filePath);
} catch (e) {
  await fs.writeFile(
    filePath,
    `title: ${fileName}
description: 
createdAt: ${Date.now()}
updatedAt: null

=== meta ===
`,
  );
  console.log(fileName + ".md created!");
  process.exit(0);
}

console.error("Error: File already exists!");
