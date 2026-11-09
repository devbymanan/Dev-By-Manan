import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { verifyAdmin } from "@/lib/auth";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const admin = verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projectId = parseInt(params.id, 10);
  if (isNaN(projectId)) {
    return NextResponse.json({ error: "Invalid Project ID" }, { status: 400 });
  }

  try {
    const formData = await request.formData();
    const altText = (formData.get("alt_text") as string) || "";
    const displayOrder = parseInt((formData.get("display_order") as string) || "0", 10);
    const file = formData.get("file") as File | null;

    let imageUrl = (formData.get("image_url") as string) || "";
    if (file && !imageUrl) {
      // In serverless, convert image to base64 data URI for storage or direct embed
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const mime = file.type || "image/jpeg";
      imageUrl = `data:${mime};base64,${buffer.toString("base64")}`;
    }

    if (!imageUrl) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const sql = getDb();
    const rows = await sql`
      INSERT INTO project_images (project_id, image_url, alt_text, display_order)
      VALUES (${projectId}, ${imageUrl}, ${altText || null}, ${displayOrder})
      RETURNING id, project_id, image_url, alt_text, display_order
    `;

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    console.error("Upload image error:", error);
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }
}
