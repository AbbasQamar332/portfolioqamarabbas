import { NextRequest, NextResponse } from "next/server";
import { hashPassword, getAuthenticatedUser } from "@/lib/auth";
import { getDb, run, queryOne, initializeDatabase } from "@/lib/database";
import { generateId } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const admin = await getAuthenticatedUser(request);
    if (!admin) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    const { email, password, name } = await request.json();
    if (!email || !password || !name) {
      return NextResponse.json({ success: false, error: "All fields are required" }, { status: 400 });
    }
    await initializeDatabase();
    const db = await getDb();
    const existing = queryOne(db, "SELECT id FROM admin_users WHERE email = ?", [email]);
    if (existing) return NextResponse.json({ success: false, error: "User already exists" }, { status: 409 });
    const password_hash = hashPassword(password);
    const id = generateId();
    run(db, "INSERT INTO admin_users (id, email, password_hash, name) VALUES (?, ?, ?, ?)", [id, email, password_hash, name]);
    return NextResponse.json({ success: true, data: { id, email, name } }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
