import { neon } from "@neondatabase/serverless";

export function getDb() {
  const rawUrl = process.env.DATABASE_URL;
  if (!rawUrl) {
    throw new Error("DATABASE_URL environment variable is not defined");
  }
  const databaseUrl = rawUrl.trim().replace(/^["']|["']$/g, "");
  return neon(databaseUrl);
}

