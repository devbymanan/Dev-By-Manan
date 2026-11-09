import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { verifyAdmin } from "@/lib/auth";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const admin = verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { name, category, icon_name, display_order } = body;
    const sql = getDb();

    const rows = await sql`
      UPDATE skills
      SET 
        name = COALESCE(${name}, name),
        category = COALESCE(${category}, category),
        icon_name = COALESCE(${icon_name}, icon_name),
        display_order = COALESCE(${display_order}, display_order)
      WHERE id = ${id}
      RETURNING id, name, category, icon_name, display_order
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("Update skill error:", error);
    return NextResponse.json({ error: "Failed to update skill" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const admin = verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const sql = getDb();
    await sql`DELETE FROM skills WHERE id = ${id}`;
    return NextResponse.json({ message: "Skill deleted" });
  } catch (error) {
    console.error("Delete skill error:", error);
    return NextResponse.json({ error: "Failed to delete skill" }, { status: 500 });
  }
}
