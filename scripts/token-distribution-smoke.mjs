import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const tokenCssPath = path.join(rootDir, "packages/tokens/css/tokens.generated.css");
const consumers = [
  path.join(rootDir, "apps/web/src/app/globals.css"),
  path.join(rootDir, "apps/docs/src/app/globals.css"),
  path.join(rootDir, "apps/storybook/.storybook/preview.ts"),
];

const css = fs.readFileSync(tokenCssPath, "utf8");
const requiredTokens = ["--background:", "--foreground:", "--primary:", "--rail-offset:"];

for (const token of requiredTokens) {
  if (!css.includes(token)) {
    throw new Error(`Missing token ${token} in ${tokenCssPath}`);
  }
}

for (const consumer of consumers) {
  const content = fs.readFileSync(consumer, "utf8");
  if (!content.includes("@mun.digital/tokens/css") && !content.includes("@mun.digital/ui/styles.css")) {
    throw new Error(`Missing shared token import in ${consumer}`);
  }
}

console.log("token distribution smoke passed");
