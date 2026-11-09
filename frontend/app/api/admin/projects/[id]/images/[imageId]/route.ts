import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { verifyAdmin } from "@/lib/auth";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; imageId: string } }
) {
  const admin = verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projectId = parseInt(params.id, 10);
  const imageId = parseInt(params.imageId, 10);
  if (isNaN(projectId) || isNaN(imageId)) {
    return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
  }

  try {
    const sql = getDb();
    await sql`
      DELETE FROM project_images 
      WHERE id = ${imageId} AND project_id = ${projectId}
    `;
    return NextResponse.json({ message: "Image removed" });
  } catch (error) {
    console.error("Delete image error:", error);
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
  }
}
