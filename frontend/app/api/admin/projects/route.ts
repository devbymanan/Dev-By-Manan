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
    const {
      title,
      short_description,
      full_description,
      challenge_solution,
      thumbnail_url,
      live_demo_url,
      github_url,
      is_featured = false,
      is_public_code = false,
      display_order = 0,
      tags = [],
    } = body;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const sql = getDb();
    const rows = await sql`
      INSERT INTO projects (
        title, short_description, full_description, challenge_solution,
        thumbnail_url, live_demo_url, github_url, is_featured, is_public_code,
        display_order, created_at, updated_at
      ) VALUES (
        ${title}, ${short_description || null}, ${full_description || null}, ${challenge_solution || null},
        ${thumbnail_url || null}, ${live_demo_url || null}, ${github_url || null},
        ${Boolean(is_featured)}, ${Boolean(is_public_code)}, ${display_order}, NOW(), NOW()
      )
      RETURNING *
    `;

    const project = rows[0];

    // Handle tags
    if (Array.isArray(tags) && tags.length > 0) {
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
          VALUES (${project.id}, ${tagId})
          ON CONFLICT DO NOTHING
        `;
      }
    }

    return NextResponse.json({
      ...project,
      tags: tags || [],
    }, { status: 201 });
  } catch (error) {
    console.error("Create project error:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
