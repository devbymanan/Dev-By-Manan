import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { verifyAdmin } from "@/lib/auth";

export async function POST(request: Request) {
  const admin = verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, category, icon_name, display_order = 0 } = body;

    if (!name || !category) {
      return NextResponse.json(
        { error: "Name and category are required" },
        { status: 400 }
      );
    }

    const sql = getDb();
    const rows = await sql`
      INSERT INTO skills (name, category, icon_name, display_order)
      VALUES (${name}, ${category}, ${icon_name || null}, ${display_order})
      RETURNING id, name, category, icon_name, display_order
    `;

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    console.error("Create skill error:", error);
    return NextResponse.json({ error: "Failed to create skill" }, { status: 500 });
  }
}
