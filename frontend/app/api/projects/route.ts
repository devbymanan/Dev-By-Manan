import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const sql = getDb();

    // 1. Fetch projects
    const projects = await sql`
      SELECT 
        id, title, short_description, thumbnail_url,
        is_featured, is_public_code, live_demo_url, github_url,
        display_order
      FROM projects
      ORDER BY display_order ASC, id DESC
    `;

    if (projects.length === 0) {
      return NextResponse.json([]);
    }

    const projectIds = projects.map((p) => p.id);

    // 2. Fetch tags and first image for these projects
    const tagRows = await sql`
      SELECT pt.project_id, t.name as tag_name
      FROM project_tags pt
      JOIN tags t ON pt.tag_id = t.id
      WHERE pt.project_id = ANY(${projectIds})
    `;

    const tagsByProject: Record<number, string[]> = {};
    for (const r of tagRows) {
      if (!tagsByProject[r.project_id]) {
        tagsByProject[r.project_id] = [];
      }
      tagsByProject[r.project_id].push(r.tag_name);
    }

    const imageRows = await sql`
      SELECT DISTINCT ON (project_id) project_id, image_url
      FROM project_images
      WHERE project_id = ANY(${projectIds})
      ORDER BY project_id, display_order ASC, id ASC
    `;
    const firstImageByProject: Record<number, string> = {};
    for (const img of imageRows) {
      firstImageByProject[img.project_id] = img.image_url;
    }

    // 3. Assemble response
    const result = projects.map((p) => ({
      id: p.id,
      title: p.title,
      short_description: p.short_description,
      thumbnail_url: p.thumbnail_url || firstImageByProject[p.id] || null,
      is_featured: Boolean(p.is_featured),
      is_public_code: Boolean(p.is_public_code),
      live_demo_url: p.live_demo_url,
      github_url: p.is_public_code ? p.github_url : null,
      tags: tagsByProject[p.id] || [],
      display_order: p.display_order,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Fetch projects error:", error);
    return NextResponse.json([], { status: 500 });
  }
}

