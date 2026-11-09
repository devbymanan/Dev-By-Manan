import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const sql = getDb();
    const rows = await sql`
      SELECT id, name, category, icon_name, display_order 
      FROM skills 
      ORDER BY display_order ASC, id ASC
    `;

    const result = {
      frontend: [] as any[],
      backend: [] as any[],
      database: [] as any[],
      tools: [] as any[],
    };

    for (const row of rows) {
      const cat = (row.category || "tools").toLowerCase() as keyof typeof result;
      const skill = {
        id: row.id,
        name: row.name,
        category: row.category,
        icon_name: row.icon_name,
      };
      if (result[cat]) {
        result[cat].push(skill);
      } else {
        result.tools.push(skill);
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Fetch skills error:", error);
    return NextResponse.json(
      { frontend: [], backend: [], database: [], tools: [] },
      { status: 500 }
    );
  }
}
