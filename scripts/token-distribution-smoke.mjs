import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const tokenCssPath = path.join(rootDir, "packages/tokens/css/tokens.generated.css");
const tokenMetadataPath = path.join(rootDir, "packages/tokens/metadata/tokens.generated.mjs");
const consumers = [
  path.join(rootDir, "apps/web/src/app/globals.css"),
  path.join(rootDir, "apps/docs/src/app/globals.css"),
  path.join(rootDir, "apps/storybook/.storybook/preview.ts"),
];

const css = fs.readFileSync(tokenCssPath, "utf8");
const { tokenMetadata } = await import(pathToFileURL(tokenMetadataPath).href);
const requiredTokens = ["--background:", "--foreground:", "--primary:", "--rail-offset:"];

for (const token of requiredTokens) {
  if (!css.includes(token)) {
    throw new Error(`Missing token ${token} in ${tokenCssPath}`);
  }
}

if (!Array.isArray(tokenMetadata?.tokens)) {
  throw new Error(`Missing token metadata array in ${tokenMetadataPath}`);
}

const metadataRequiredTokens = [
  ["background", "light"],
  ["background", "dark"],
  ["foreground", "light"],
  ["primary", "light"],
  ["rail-offset", undefined],
];

for (const [name, mode] of metadataRequiredTokens) {
  const match = tokenMetadata.tokens.find((token) => token.name === name && token.mode === mode);
  if (!match) {
    throw new Error(`Missing metadata token ${mode ? `${mode}.` : ""}${name} in ${tokenMetadataPath}`);
  }
  if (!css.includes(`${match.cssVariable}:`)) {
    throw new Error(`Metadata token ${name} points at missing CSS variable ${match.cssVariable}`);
  }
}

for (const consumer of consumers) {
  const content = fs.readFileSync(consumer, "utf8");
  if (!content.includes("@mun.digital/tokens/css") && !content.includes("@mun.digital/ui/styles.css")) {
    throw new Error(`Missing shared token import in ${consumer}`);
  }
}

console.log("token distribution smoke passed");
