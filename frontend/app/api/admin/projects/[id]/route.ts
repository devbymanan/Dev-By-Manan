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
    const {
      title,
      short_description,
      full_description,
      challenge_solution,
      thumbnail_url,
      live_demo_url,
      github_url,
      is_featured,
      is_public_code,
      display_order,
      tags,
    } = body;

    const sql = getDb();

    // Check project exists
    const existing = await sql`SELECT id FROM projects WHERE id = ${id}`;
    if (existing.length === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const rows = await sql`
      UPDATE projects
      SET
        title = COALESCE(${title}, title),
        short_description = COALESCE(${short_description}, short_description),
        full_description = COALESCE(${full_description}, full_description),
        challenge_solution = COALESCE(${challenge_solution}, challenge_solution),
        thumbnail_url = COALESCE(${thumbnail_url}, thumbnail_url),
        live_demo_url = COALESCE(${live_demo_url}, live_demo_url),
        github_url = COALESCE(${github_url}, github_url),
        is_featured = COALESCE(${is_featured !== undefined ? Boolean(is_featured) : null}, is_featured),
        is_public_code = COALESCE(${is_public_code !== undefined ? Boolean(is_public_code) : null}, is_public_code),
        display_order = COALESCE(${display_order}, display_order),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    // If tags are provided, sync tags
    if (Array.isArray(tags)) {
      await sql`DELETE FROM project_tags WHERE project_id = ${id}`;
      for (const rawName of tags) {
        const name = String(rawName).trim();
        if (!name) continue;
        const tagRows = await sql`
          INSERT INTO tags (name)
          VALUES (${name})
          ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
          RETURNING id
        `;
        const tagId = tagRows[0].id;
        await sql`
          INSERT INTO project_tags (project_id, tag_id)
          VALUES (${id}, ${tagId})
          ON CONFLICT DO NOTHING
        `;
      }
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("Update project error:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
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
    await sql`DELETE FROM projects WHERE id = ${id}`;
    return NextResponse.json({ message: "Project deleted" });
  } catch (error) {
    console.error("Delete project error:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
