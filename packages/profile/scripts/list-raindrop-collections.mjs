import { fetchRaindropCollections } from "../src/raindrop-links.mjs";

const token = process.env.RAINDROP_TOKEN;

try {
  const collections = await fetchRaindropCollections({ token });

  if (collections.length === 0) {
    throw new Error("Raindrop API returned no collections");
  }

  for (const collection of collections) {
    const fields = [
      `id=${collection.id}`,
      `title=${JSON.stringify(collection.title)}`,
      `count=${collection.count}`,
      `public=${collection.public}`,
    ];

    if (collection.parentId) {
      fields.push(`parent=${collection.parentId}`);
    }

    console.log(fields.join(" "));
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
