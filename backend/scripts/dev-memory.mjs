/**
 * Dev launcher: boots an in-memory MongoDB replica set, points the app at it,
 * then starts the normal Express server (index.js).
 *
 *   node scripts/dev-memory.mjs
 *
 * Writes the ephemeral connection URI to scripts/.memory-mongo-uri so other
 * one-shot processes (e.g. scripts/seed.cjs) can attach to the same instance.
 * Use ONLY for local development/verification — data is not persisted.
 */
import { MongoMemoryReplSet } from "mongodb-memory-server";
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));

const replSet = await MongoMemoryReplSet.create({
  replSet: { count: 1, storageEngine: "wiredTiger" },
});
const uri = replSet.getUri("akuma_dev");
console.log("[dev-memory] mongo ready:", uri);
writeFileSync(join(here, ".memory-mongo-uri"), uri, "utf8");

process.env.MONGODB_URI = uri;
process.env.NODE_ENV = "development";

await import("../index.js");
