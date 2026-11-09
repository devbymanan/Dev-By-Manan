import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { verifyAdmin } from "@/lib/auth";

export async function PUT(request: Request) {
  const admin = verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await request.json();
    const sql = getDb();

    for (const [key, value] of Object.entries(payload)) {
      if (typeof value === "string") {
        await sql`
          INSERT INTO site_content (content_key, content_value)
          VALUES (${key}, ${value})
          ON CONFLICT (content_key) 
          DO UPDATE SET content_value = EXCLUDED.content_value
        `;
      }
    }

    const rows = await sql`SELECT content_key, content_value FROM site_content`;
    const content: Record<string, string> = {};
    for (const row of rows) {
      content[row.content_key] = row.content_value;
    }

    return NextResponse.json(content);
  } catch (error) {
    console.error("Update site content error:", error);
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 });
  }
}
