import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "b098f42c9b4770b0741a70fd635d6288f6276d1a15abedea09e4a5dd6cc7eea3";

export interface AdminPayload {
  sub: number;
  username: string;
}

export function signToken(admin: { id: number; username: string }): string {
  return jwt.sign(
    { sub: admin.id, username: admin.username },
    JWT_SECRET,
    { expiresIn: "12h" }
  );
}

export function verifyAdmin(request: Request): AdminPayload | null {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as unknown as AdminPayload;
    return decoded;
  } catch {
    return null;
  }
}

export async function verifyPassword(
  plain: string,
  hashed: string
): Promise<boolean> {
  return bcrypt.compare(plain, hashed);
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12);
}
