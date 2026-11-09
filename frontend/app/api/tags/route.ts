import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const sql = getDb();
    const rows = await sql`
      SELECT id, name FROM tags ORDER BY name ASC
    `;
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Fetch tags error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
