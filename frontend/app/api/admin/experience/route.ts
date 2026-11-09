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
    const { company, role, duration, description, display_order = 0 } = body;

    if (!company || !role) {
      return NextResponse.json(
        { error: "Company and role are required" },
        { status: 400 }
      );
    }

    const sql = getDb();
    const rows = await sql`
      INSERT INTO experience (company, role, duration, description, display_order)
      VALUES (${company}, ${role}, ${duration || null}, ${description || null}, ${display_order})
      RETURNING id, company, role, duration, description, display_order
    `;

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    console.error("Create experience error:", error);
    return NextResponse.json(
      { error: "Failed to create experience" },
      { status: 500 }
    );
  }
}
