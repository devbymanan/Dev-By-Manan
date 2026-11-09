import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const sql = getDb();
    const rows = await sql`
      SELECT id, company, role, duration, description, display_order
      FROM experience
      ORDER BY display_order ASC, id ASC
    `;

    const list = rows.map((r) => ({
      id: r.id,
      company: r.company,
      role: r.role,
      duration: r.duration,
      description: r.description,
    }));

    return NextResponse.json(list);
  } catch (error) {
    console.error("Fetch experience error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
