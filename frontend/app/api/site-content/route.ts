import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const sql = getDb();
    const rows = await sql`
      SELECT content_key, content_value FROM site_content
    `;
    const content: Record<string, string> = {};
    for (const row of rows) {
      content[row.content_key] = row.content_value;
    }
    return NextResponse.json(content);
  } catch (error) {
    console.error("Fetch site-content error:", error);
    return NextResponse.json({}, { status: 500 });
  }
}
