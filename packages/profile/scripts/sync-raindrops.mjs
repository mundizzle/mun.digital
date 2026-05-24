import fs from "node:fs/promises";
import path from "node:path";

import { fetchRaindropSnapshot } from "../src/raindrop-links.mjs";

const rootDir = path.resolve(import.meta.dirname, "../../..");
const configPath = path.join(rootDir, "packages/profile/data/raindrop.config.json");
const outputPath = path.join(rootDir, "packages/profile/public/raindrops.json");

const config = JSON.parse(await fs.readFile(configPath, "utf8"));
const snapshot = await fetchRaindropSnapshot({
  token: process.env.RAINDROP_TOKEN,
  config,
});

const body = `${JSON.stringify(snapshot, null, 2)}\n`;
await fs.mkdir(path.dirname(outputPath), { recursive: true });
await fs.writeFile(outputPath, body);

console.log(`raindrop links synced: ${snapshot.links.length}`);
