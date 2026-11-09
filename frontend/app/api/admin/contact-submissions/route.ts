import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { verifyAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const admin = verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const sql = getDb();
    const rows = await sql`
      SELECT id, name, email, message, submitted_at, email_sent
      FROM contact_submissions
      ORDER BY submitted_at DESC, id DESC
    `;

    const list = rows.map((r) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      message: r.message,
      submitted_at: r.submitted_at ? new Date(r.submitted_at).toISOString() : null,
      email_sent: Boolean(r.email_sent),
    }));

    return NextResponse.json(list);
  } catch (error) {
    console.error("Fetch contact submissions error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
