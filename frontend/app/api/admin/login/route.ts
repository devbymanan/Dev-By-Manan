import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { verifyPassword, signToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    const sql = getDb();
    const rows = await sql`
      SELECT id, username, password_hash 
      FROM admin_users 
      WHERE LOWER(username) = LOWER(${username.trim()})
      LIMIT 1
    `;

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    const admin = rows[0];
    const valid = await verifyPassword(password, admin.password_hash);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    const token = signToken({ id: admin.id, username: admin.username });

    return NextResponse.json({
      token,
      admin: {
        id: admin.id,
        username: admin.username,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    console.error("Admin login error:", message);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

