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
    const { company, role, duration, description, display_order } = body;
    const sql = getDb();

    const rows = await sql`
      UPDATE experience
      SET
        company = COALESCE(${company}, company),
        role = COALESCE(${role}, role),
        duration = COALESCE(${duration}, duration),
        description = COALESCE(${description}, description),
        display_order = COALESCE(${display_order}, display_order)
      WHERE id = ${id}
      RETURNING id, company, role, duration, description, display_order
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: "Experience not found" }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("Update experience error:", error);
    return NextResponse.json(
      { error: "Failed to update experience" },
      { status: 500 }
    );
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
    await sql`DELETE FROM experience WHERE id = ${id}`;
    return NextResponse.json({ message: "Experience deleted" });
  } catch (error) {
    console.error("Delete experience error:", error);
    return NextResponse.json(
      { error: "Failed to delete experience" },
      { status: 500 }
    );
  }
}
