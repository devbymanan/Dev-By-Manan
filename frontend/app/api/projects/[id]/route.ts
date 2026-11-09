import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const sql = getDb();
    const rows = await sql`
      SELECT * FROM projects WHERE id = ${id} LIMIT 1
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const p = rows[0];

    // Fetch tags
    const tagRows = await sql`
      SELECT t.name
      FROM project_tags pt
      JOIN tags t ON pt.tag_id = t.id
      WHERE pt.project_id = ${id}
    `;

    // Fetch images
    const imageRows = await sql`
      SELECT id, image_url, alt_text, display_order
      FROM project_images
      WHERE project_id = ${id}
      ORDER BY display_order ASC, id ASC
    `;

    const result = {
      id: p.id,
      title: p.title,
      short_description: p.short_description,
      full_description: p.full_description,
      challenge_solution: p.challenge_solution,
      thumbnail_url: p.thumbnail_url,
      live_demo_url: p.live_demo_url,
      github_url: p.is_public_code ? p.github_url : null,
      is_featured: Boolean(p.is_featured),
      is_public_code: Boolean(p.is_public_code),
      display_order: p.display_order,
      tags: tagRows.map((t) => t.name),
      images: imageRows.map((img) => ({
        id: img.id,
        image_url: img.image_url,
        alt_text: img.alt_text,
        display_order: img.display_order,
      })),
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Fetch project detail error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
