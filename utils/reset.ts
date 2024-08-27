import { kv } from "../db/kv.ts";

export async function resetDatabase() {
  console.log("Resetting database...");
  for await (const entry of kv.list({ prefix: ["postings"] })) {
    await kv.delete(entry.key);
  }
  console.log("Database reset successfully.");
}

if (import.meta.main) {
  await resetDatabase();
  Deno.exit(0);
}
