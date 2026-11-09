import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST() {
  try {
    const sql = getDb();
    const rows = await sql`
      SELECT content_value FROM site_content WHERE content_key = 'resume_url' LIMIT 1
    `;

    const resumeUrl = rows.length > 0 ? rows[0].content_value : null;
    if (!resumeUrl) {
      return NextResponse.json(
        { error: "Resume not available yet." },
        { status: 404 }
      );
    }

    return NextResponse.json({ resume_url: resumeUrl });
  } catch (error) {
    console.error("Resume download error:", error);
    return NextResponse.json(
      { error: "Failed to fetch resume" },
      { status: 500 }
    );
  }
}
